from config import settings
from schemas import ModelComplianceOutput
from services.groq_service import parse_model_json, run_groq_chat


IFC_REQUIREMENTS = """
PS1: Environmental and Social Management System, Stakeholder Engagement Plan,
Grievance Mechanism, monitoring plan, corrective action ownership, E&S risk
identification and management, and evidence of ongoing management beyond a one-time EIA.

PS5: Land acquisition, compensation, replacement-cost methodology, Resettlement
Action Plan, livelihood restoration, affected household records, payment proof,
post-compensation monitoring, and land-related grievances.

PS7: Indigenous Peoples, Janajati / ethnic communities, FPIC where applicable,
Indigenous Peoples Plan, consultation records, benefit-sharing, cultural/social
impacts, and Indigenous Peoples grievance handling.
"""

SYSTEM_PROMPT = (
    "You are an IFC compliance auditor for infrastructure and hydropower projects. "
    "You analyze project documents against IFC Performance Standards. Return strict "
    "JSON only. Do not include markdown. Do not include chain-of-thought. Use concise "
    "rationale only inside JSON fields."
)


def build_user_prompt(english_context: str) -> str:
    return f"""
Analyze the project document context against IFC Performance Standards PS1, PS5, and PS7.

Project Document Context:
{english_context}

Relevant IFC Requirements:
{IFC_REQUIREMENTS}

Tasks:
1. Identify missing requirements.
2. Identify partial compliance.
3. Identify environmental and social risks.
4. Recommend corrective actions.
5. Give separate scores for PS1, PS5, and PS7 using the rubric.
6. Cite short evidence text snippets and page references when available.

Return strict JSON only in this schema:
{{
  "summary": "...",
  "ps1": {{
    "score": 0,
    "severity": "...",
    "title": "...",
    "missing_requirements": [],
    "partial_compliance": [],
    "risks": [],
    "recommended_actions": [],
    "evidence": [{{"text": "...", "page": 1}}]
  }},
  "ps5": {{
    "score": 0,
    "severity": "...",
    "title": "...",
    "missing_requirements": [],
    "partial_compliance": [],
    "risks": [],
    "recommended_actions": [],
    "evidence": [{{"text": "...", "page": 1}}]
  }},
  "ps7": {{
    "score": 0,
    "severity": "...",
    "title": "...",
    "missing_requirements": [],
    "partial_compliance": [],
    "risks": [],
    "recommended_actions": [],
    "evidence": [{{"text": "...", "page": 1}}]
  }}
}}
"""


def analyze_with_groq(english_context: str) -> ModelComplianceOutput:
    """Send selected English context to DeepSeek R1 through Groq and validate JSON."""

    output = run_groq_chat(
        model=settings.groq_model,
        system_prompt=SYSTEM_PROMPT,
        user_prompt=build_user_prompt(english_context),
    )
    return parse_model_json(output)
