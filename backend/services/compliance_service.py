from config import settings
from schemas import ModelComplianceOutput
from services.groq_service import parse_model_json, run_groq_chat


IFC_REQUIREMENTS = """
PS1: Environmental and Social Management System, Stakeholder Engagement Plan,
Grievance Mechanism, monitoring plan, corrective action ownership, E&S risk
identification and management, and evidence of ongoing management beyond a one-time EIA.

PS2: Labor and working conditions, worker contracts, wages, working hours,
contractor and subcontractor labor, occupational health and safety, worker
grievance mechanism, child labor, forced labor, worker accommodation, and
accident reporting.

PS3: Resource efficiency, pollution prevention, waste management, spoil
disposal, water quality, air pollution, dust, noise, hazardous materials,
chemicals, oil, cement, effluent, and environmental flow where relevant.

PS4: Community health and safety, traffic impacts, blasting impacts, emergency
preparedness, public safety risks, security personnel, landslide risk, flood
risk, dam failure risk, sudden water release, and access road safety.

PS5: Land acquisition, compensation, replacement-cost methodology, Resettlement
Action Plan, livelihood restoration, affected household records, payment proof,
post-compensation monitoring, and land-related grievances.

PS6: Biodiversity conservation, aquatic ecology, fish passage, environmental
flow, forests, wildlife, critical habitat, ecosystem services, protected
species, biodiversity offsets, and biodiversity monitoring.

PS7: Indigenous Peoples, Janajati / ethnic communities, FPIC where applicable,
Indigenous Peoples Plan, culturally appropriate consultation, benefit-sharing,
cultural/social impacts, and Indigenous Peoples grievance handling.

PS8: Cultural heritage, temples, cremation sites, burial places, sacred sites,
shrines, festivals, archaeological resources, chance-find procedure, cultural
practices, and protection measures.
"""

SYSTEM_PROMPT = (
    "You are an IFC compliance auditor for infrastructure and hydropower projects. "
    "You analyze project documents against IFC Performance Standards. Return strict "
    "JSON only. Do not include markdown. Do not include chain-of-thought. Use concise "
    "rationale only inside JSON fields."
)


def build_user_prompt(english_context: str) -> str:
    return f"""
Analyze the project document context against IFC Performance Standards PS1, PS2, PS3, PS4, PS5, PS6, PS7, and PS8.

Project Document Context:
{english_context}

Relevant IFC Requirements:
{IFC_REQUIREMENTS}

Tasks:
1. Identify missing requirements.
2. Identify partial compliance.
3. Identify environmental and social risks.
4. Recommend corrective actions.
5. Give separate scores for every standard where enough evidence exists.
6. Cite short evidence text snippets and page references when available.
7. Do not invent scores. If the document does not contain enough evidence for a standard, return score null and analysis_status "insufficient_evidence".
8. Extract short checkable report claims that can later be compared with community or worker feedback. A claim is not verified just because it appears in the report.

Return strict JSON only in this schema:
{{
  "summary": "...",
  "ps1": {{
    "standard": "PS1",
    "score": 0,
    "severity": "Critical | High | Medium | Low",
    "analysis_status": "analyzed | insufficient_evidence | not_applicable",
    "evidence_coverage": "strong | moderate | weak | insufficient",
    "confidence": 0,
    "title": "...",
    "summary": "...",
    "missing_requirements": [],
    "partial_compliance": [],
    "risks": [],
    "recommended_actions": [],
    "evidence": [{{"text": "...", "page": 1}}]
  }},
  "ps2": {{ "...same structure as ps1..." }},
  "ps3": {{ "...same structure as ps1..." }},
  "ps4": {{ "...same structure as ps1..." }},
  "ps5": {{ "...same structure as ps1..." }},
  "ps6": {{ "...same structure as ps1..." }},
  "ps7": {{ "...same structure as ps1..." }},
  "ps8": {{ "...same structure as ps1..." }},
  "report_claims": [
    {{
      "standard": "PS1",
      "topic": "consultation",
      "claim_text": "The report states that public consultation was conducted.",
      "source_excerpt": "Public hearing was conducted in affected wards...",
      "source_page": 12,
      "ai_confidence": 82
    }}
  ]
}}

For insufficient evidence, use exactly:
{{
  "standard": "PSX",
  "score": null,
  "severity": "Low",
  "analysis_status": "insufficient_evidence",
  "evidence_coverage": "insufficient",
  "confidence": 0,
  "title": "Insufficient evidence for PSX",
  "summary": "The uploaded document does not contain enough evidence to score this standard.",
  "missing_requirements": [],
  "partial_compliance": [],
  "risks": [],
  "recommended_actions": [],
  "evidence": []
}}

Report claim extraction rules:
- Extract only claims that can be checked later.
- Link each claim to an IFC standard and one short topic.
- Keep claim_text short and clear.
- Include source_excerpt and page number when available.
- Do not invent claims. If no clear claims exist, return an empty report_claims array.
- Use professional language: report claim, ground feedback, contested claim, contradiction, manual verification required.
"""


def analyze_with_groq(english_context: str) -> ModelComplianceOutput:
    """Send selected English context to DeepSeek R1 through Groq and validate JSON."""

    output = run_groq_chat(
        model=settings.groq_model,
        system_prompt=SYSTEM_PROMPT,
        user_prompt=build_user_prompt(english_context),
    )
    return parse_model_json(output)
