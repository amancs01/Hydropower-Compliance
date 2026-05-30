from schemas import EvidenceSnippet, ModelComplianceOutput, ModelFinding


def fallback_analysis(evidence_text: str = "", page: int = 1) -> ModelComplianceOutput:
    """Deterministic demo result used when GROQ_API_KEY is missing."""

    snippet = EvidenceSnippet(text=(evidence_text or "No evidence snippet available.")[:240], page=page)
    return ModelComplianceOutput(
        summary=(
            "The document contains some environmental and social management information, "
            "but important land acquisition, livelihood restoration, and Indigenous Peoples "
            "evidence remain weak or missing."
        ),
        ps1=ModelFinding(
            score=80,
            severity="Medium",
            title="PS1 mostly addressed but evidence needs strengthening",
            missing_requirements=[
                "Complete ESMS evidence",
                "Stakeholder engagement plan",
                "Operational grievance mechanism",
            ],
            partial_compliance=[
                "EIA-style assessment is present",
                "Some consultation evidence appears available",
            ],
            risks=["One-time assessment may not prove ongoing management"],
            recommended_actions=[
                "Upload ESMS, SEP, grievance mechanism, monitoring matrix, and corrective action register",
            ],
            evidence=[snippet],
        ),
        ps5=ModelFinding(
            score=40,
            severity="High",
            title="PS5 land and livelihood evidence is weak",
            missing_requirements=[
                "Replacement-cost methodology",
                "Resettlement Action Plan",
                "Livelihood restoration monitoring",
                "Post-compensation follow-up",
            ],
            partial_compliance=["Land or compensation is referenced"],
            risks=[
                "Compensation may not meet IFC PS5 expectations",
                "Livelihood restoration may be untracked",
            ],
            recommended_actions=[
                "Upload RAP, affected household list, payment proof, replacement-cost methodology, and livelihood monitoring records",
            ],
            evidence=[snippet],
        ),
        ps7=ModelFinding(
            score=20,
            severity="Critical",
            title="PS7 Indigenous Peoples evidence is missing",
            missing_requirements=[
                "PS7 applicability screening",
                "Indigenous Peoples Plan",
                "FPIC or consultation evidence where applicable",
                "Benefit-sharing evidence",
            ],
            partial_compliance=["Ethnic or local communities may be referenced"],
            risks=["Potential Indigenous Peoples impacts may be unresolved"],
            recommended_actions=[
                "Verify PS7 applicability and upload IPP, FPIC/consultation records, benefit-sharing plan, and grievance evidence",
            ],
            evidence=[snippet],
        ),
    )
