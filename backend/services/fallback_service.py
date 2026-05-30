from schemas import EvidenceSnippet, ModelComplianceOutput, ModelFinding, ReportClaimOutput


def insufficient(standard: str) -> ModelFinding:
    return ModelFinding(
        standard=standard,
        score=None,
        severity="Low",
        analysis_status="insufficient_evidence",
        evidence_coverage="insufficient",
        confidence=0,
        title=f"Insufficient evidence for {standard}",
        summary="The uploaded document does not contain enough evidence to score this standard.",
        missing_requirements=[],
        partial_compliance=[],
        risks=[],
        recommended_actions=[],
        evidence=[],
    )


def fallback_analysis(evidence_text: str = "", page: int = 1) -> ModelComplianceOutput:
    """Deterministic demo result used when GROQ_API_KEY is missing."""

    snippet = EvidenceSnippet(text=(evidence_text or "No evidence snippet available.")[:240], page=page)
    demo_claims = [
        ReportClaimOutput(
            standard="PS1",
            topic="consultation",
            claim_text="The report states that public consultation was conducted.",
            source_excerpt=snippet.text,
            source_page=page,
            ai_confidence=78,
        ),
        ReportClaimOutput(
            standard="PS1",
            topic="grievance mechanism",
            claim_text="The report states that a grievance mechanism exists.",
            source_excerpt=snippet.text,
            source_page=page,
            ai_confidence=72,
        ),
        ReportClaimOutput(
            standard="PS5",
            topic="compensation",
            claim_text="The report indicates compensation or land acquisition was addressed.",
            source_excerpt=snippet.text,
            source_page=page,
            ai_confidence=70,
        ),
        ReportClaimOutput(
            standard="PS6",
            topic="biodiversity monitoring",
            claim_text="The report proposes biodiversity or aquatic ecology monitoring.",
            source_excerpt=snippet.text,
            source_page=page,
            ai_confidence=68,
        ),
    ]
    return ModelComplianceOutput(
        summary=(
            "The document contains some environmental and social management information, "
            "but important land acquisition, livelihood restoration, and Indigenous Peoples "
            "evidence remain weak or missing."
        ),
        ps1=ModelFinding(
            standard="PS1",
            score=80,
            severity="Medium",
            analysis_status="analyzed",
            evidence_coverage="moderate",
            confidence=70,
            title="PS1 mostly addressed but evidence needs strengthening",
            summary="Some management-system evidence is present, but operational controls need review.",
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
        ps2=insufficient("PS2"),
        ps3=insufficient("PS3"),
        ps4=insufficient("PS4"),
        ps5=ModelFinding(
            standard="PS5",
            score=40,
            severity="High",
            analysis_status="analyzed",
            evidence_coverage="weak",
            confidence=65,
            title="PS5 land and livelihood evidence is weak",
            summary="Land evidence is partial and does not prove replacement-cost or livelihood restoration.",
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
        ps6=insufficient("PS6"),
        ps7=ModelFinding(
            standard="PS7",
            score=20,
            severity="Critical",
            analysis_status="analyzed",
            evidence_coverage="weak",
            confidence=60,
            title="PS7 Indigenous Peoples evidence is missing",
            summary="Potential Indigenous Peoples impacts need applicability screening and verification.",
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
        ps8=insufficient("PS8"),
        report_claims=demo_claims,
        analysis_source="local_demo_fallback",
        note="Local demo fallback analyzes only selected standards.",
    )
