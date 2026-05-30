import json

from database.connection import SessionLocal, create_tables
from database.models import (
    Action,
    AuditLog,
    ComplianceAnalysis,
    ComplianceFinding,
    EvidenceItem,
    Grievance,
    Project,
    ProjectBaseline,
    ScoreSnapshot,
    SourceReference,
)


PROJECTS = [
    {
        "id": "khimti",
        "name": "Khimti-I Hydropower",
        "capacity_mw": "60",
        "river": "Khimti Khola",
        "district": "Dolakha / Ramechhap",
        "province": "Bagmati",
        "promoter": "Himal Power Limited",
        "status": "Operating",
        "cod": "2000",
        "description": "Mature operating project profile used for a legacy compliance records demo scenario.",
        "risk_theme": "Legacy compliance records and stale monitoring evidence scenario.",
        "source_note": "Public metadata + demo scenario. Compliance gaps are demo assumptions and require human verification.",
        "scores": {"ps1": 58, "ps5": 48, "ps7": 67, "overall": 57, "risk_level": "Medium"},
        "baseline_summary": "Preliminary AI/research baseline for a mature operating project with legacy monitoring and PS5 follow-up assumptions.",
        "findings": [
            ("PS3", 46, "High", "Pollution monitoring evidence is stale", "Demo baseline assumption: monitoring evidence may be outside lender freshness windows."),
            ("PS5", 48, "High", "Livelihood restoration follow-up incomplete", "Demo baseline assumption: compensation records exist but livelihood follow-up needs verification."),
        ],
        "evidence": [
            ("PS3", "Monitoring report", "Water quality monitoring report", "Expired", "Environmental monitoring folder", False),
            ("PS5", "Compensation register", "Compensation payment register", "Filed", "Resettlement folder", True),
        ],
        "actions": [
            ("E&S Consultant", "Refresh water quality monitoring", "Upload current monitoring evidence and reviewer verification comments.", "High", "in_progress", "2026-06-20"),
            ("Land Officer", "Verify livelihood follow-up", "Check affected-household follow-up records and add monitoring evidence.", "High", "open", "2026-06-25"),
        ],
        "grievances": [],
    },
    {
        "id": "middle-tamor",
        "name": "Middle Tamor HPP",
        "capacity_mw": "73",
        "river": "Tamor River",
        "district": "Taplejung",
        "province": "Koshi",
        "promoter": "Sanima Middle Tamor Hydropower",
        "status": "Construction / commissioning",
        "cod": "Demo profile",
        "description": "Main demo project for AI document analysis, PS1, PS5, and PS7 evidence-gap scenarios.",
        "risk_theme": "PS1 ESMS gap, PS5 replacement-cost / livelihood follow-up gap, and PS7 applicability evidence gap.",
        "source_note": "Public metadata + demo assumptions. Compliance findings require human verification.",
        "scores": {"ps1": 38, "ps5": 42, "ps7": 34, "overall": 38, "risk_level": "High"},
        "baseline_summary": "Preliminary AI/research baseline used for document-intelligence and lender-risk demo flow.",
        "findings": [
            ("PS1", 38, "Critical", "No complete ESMS or grievance mechanism detected", "Demo baseline assumption: EIA evidence exists, but ongoing ESMS evidence needs verification."),
            ("PS5", 42, "High", "Replacement-cost and livelihood monitoring unclear", "Demo baseline assumption: land acquisition is referenced but methodology and follow-up need verification."),
            ("PS7", 34, "Critical", "Indigenous Peoples evidence missing", "Demo baseline assumption: ethnic communities may be referenced and PS7 applicability needs human verification."),
        ],
        "evidence": [
            ("PS1", "Consultation record", "EIA public hearing minutes", "Filed", "EIA Section 8", False),
            ("PS6", "Biodiversity baseline", "Aquatic ecology baseline", "Filed", "EIA Section 9", False),
        ],
        "actions": [
            ("Compliance Manager", "Upload ESMS and grievance mechanism", "Add ESMS, SEP, grievance procedure, and monitoring responsibility matrix.", "Critical", "open", "2026-06-12"),
            ("Land Officer", "Verify compensation methodology", "Submit replacement-cost methodology and affected-household follow-up log.", "High", "waiting_for_evidence", "2026-06-05"),
        ],
        "grievances": [
            {
                "submitted_by": "Anonymous",
                "anonymous": True,
                "original_text": "हाम्रो जग्गाको मुआब्जा अझै पूरा आएको छैन र कार्यालयमा जाँदा कसैले स्पष्ट जवाफ दिँदैन।",
                "translated_text": "Our land compensation has still not been fully paid, and when we go to the office no one gives a clear answer.",
                "ai_summary": "Land compensation concern",
                "category": "Land compensation concern",
                "linked_standard": "PS5",
                "severity": "High",
                "confidentiality_level": "Confidential",
                "status": "new",
                "reference_number": "HCN-MID-2408",
            }
        ],
    },
    {
        "id": "seti-khola",
        "name": "Seti Khola HPP",
        "capacity_mw": "22",
        "river": "Seti Khola",
        "district": "Kaski",
        "province": "Gandaki",
        "promoter": "Demo developer",
        "status": "Development",
        "cod": "Demo profile",
        "description": "Demo project for community nuisance, safety, and waste-handling evidence scenarios.",
        "risk_theme": "PS4 community nuisance / safety complaint and PS3 disputed waste handling evidence.",
        "source_note": "Demo scenario and manual entry. Compliance findings require human verification.",
        "scores": {"ps1": 61, "ps5": 65, "ps7": 72, "overall": 65, "risk_level": "Medium"},
        "baseline_summary": "Preliminary AI/research baseline for grievance and disputed evidence workflow demo.",
        "findings": [
            ("PS4", 43, "High", "Community nuisance grievance trend is overdue", "Demo baseline assumption: noise/access-road complaints require response evidence."),
            ("PS3", 49, "High", "Waste handling evidence disputed", "Demo baseline assumption: uploaded checklist needs disposal proof."),
        ],
        "evidence": [
            ("PS3", "Waste checklist", "Waste handling checklist", "Disputed", "Site inspection pack", False),
            ("PS4", "Community complaint record", "Road blasting complaint record", "Filed", "Grievance Center", True),
        ],
        "actions": [
            ("Community Liaison", "Respond to PS4 grievance", "Inspect damage claim, document response, and attach closure evidence.", "High", "overdue", "2026-05-24"),
        ],
        "grievances": [
            {
                "submitted_by": "Anonymous",
                "anonymous": True,
                "original_text": "Road blasting caused cracks in our house and no one has come to inspect.",
                "translated_text": "Road blasting caused cracks in our house and no one has come to inspect.",
                "ai_summary": "Community safety and property damage concern",
                "category": "Community safety and property damage concern",
                "linked_standard": "PS4",
                "severity": "High",
                "confidentiality_level": "Private",
                "status": "under_review",
                "reference_number": "HCN-SET-2407",
            }
        ],
    },
]


def seed_database():
    create_tables()
    db = SessionLocal()
    try:
        for data in PROJECTS:
            if db.query(Project).filter(Project.id == data["id"]).first():
                continue

            project = Project(**{key: data[key] for key in [
                "id", "name", "capacity_mw", "river", "district", "province",
                "promoter", "status", "cod", "description", "risk_theme", "source_note",
            ]})
            db.add(project)
            db.flush()

            db.add(ProjectBaseline(
                project_id=project.id,
                baseline_type="research_seeded",
                summary=data["baseline_summary"],
                source_quality="public metadata + demo assumptions",
                assumption_level="demo_assumption",
            ))

            scores = data["scores"]
            analysis = ComplianceAnalysis(
                project_id=project.id,
                analysis_type="baseline",
                ps1_score=scores["ps1"],
                ps5_score=scores["ps5"],
                ps7_score=scores["ps7"],
                overall_score=scores["overall"],
                risk_level=scores["risk_level"],
                summary=data["baseline_summary"],
                model_used="seeded_demo_baseline",
                verification_status="pending_review",
            )
            db.add(analysis)
            db.flush()

            db.add(ScoreSnapshot(
                project_id=project.id,
                analysis_id=analysis.id,
                ps1_score=scores["ps1"],
                ps5_score=scores["ps5"],
                ps7_score=scores["ps7"],
                overall_score=scores["overall"],
                risk_level=scores["risk_level"],
                reason_for_change="Baseline analysis created",
            ))

            finding_ids = []
            for standard, score, severity, title, description in data["findings"]:
                finding = ComplianceFinding(
                    project_id=project.id,
                    analysis_id=analysis.id,
                    standard=standard,
                    score=score,
                    severity=severity,
                    title=title,
                    description=description,
                    missing_requirements_json=json.dumps(["Requires human verification", "Demo baseline assumption"]),
                    partial_compliance_json=json.dumps(["Preliminary AI/research baseline"]),
                    risks_json=json.dumps([description]),
                    recommended_actions_json=json.dumps(["Upload evidence and request consultant review"]),
                    evidence_json=json.dumps([]),
                    verification_status="pending_review",
                )
                db.add(finding)
                db.flush()
                finding_ids.append(finding.id)

            for index, (standard, evidence_type, title, status, source, confidential) in enumerate(data["evidence"]):
                db.add(EvidenceItem(
                    project_id=project.id,
                    finding_id=finding_ids[index] if index < len(finding_ids) else None,
                    standard=standard,
                    evidence_type=evidence_type,
                    title=title,
                    summary="Seeded demo evidence. Requires human verification before lender trust.",
                    source=source,
                    status=status.lower(),
                    uploaded_by="Demo team",
                    confidential=confidential,
                ))

            for owner, title, description, severity, status, due_date in data["actions"]:
                db.add(Action(
                    project_id=project.id,
                    owner=owner,
                    title=title,
                    description=description,
                    severity=severity,
                    status=status,
                    due_date=due_date,
                ))

            for grievance in data["grievances"]:
                db.add(Grievance(project_id=project.id, **grievance))

            db.add(SourceReference(
                project_id=project.id,
                source_title="Seeded demo baseline",
                source_type="demo_assumption",
                note=data["source_note"],
            ))

            db.add(AuditLog(
                project_id=project.id,
                actor="HydroComply seed script",
                actor_role="System",
                action="Baseline created",
                entity_type="project",
                entity_id=project.id,
                detail="Seeded public metadata + demo assumptions. Requires human verification.",
            ))

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
    print("HydroComply demo database seeded.")
