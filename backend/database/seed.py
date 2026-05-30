import json

from sqlalchemy import inspect, text

from database.connection import SessionLocal, create_tables, engine
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
    ValidationQuestion,
)


PROJECTS = [
    {
        "id": "khimti",
        "name": "Khimti-I Hydropower",
        "capacity_mw": "60",
        "normalized_name": "khimti-i-hydropower",
        "project_type": "hydropower",
        "river": "Khimti Khola",
        "river_or_basin": "Khimti Khola",
        "district": "Dolakha / Ramechhap",
        "district_or_region": "Dolakha / Ramechhap",
        "province": "Bagmati",
        "promoter": "Himal Power Limited",
        "status": "Operating",
        "cod": "2000",
        "report_type_available": "demo baseline",
        "report_status": "ai_analyzed",
        "baseline_status": "ai_baseline_created",
        "metadata_confidence": "demo_public_metadata",
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
        "normalized_name": "middle-tamor-hpp",
        "project_type": "hydropower",
        "river": "Tamor River",
        "river_or_basin": "Tamor River",
        "district": "Taplejung",
        "district_or_region": "Taplejung",
        "province": "Koshi",
        "promoter": "Sanima Middle Tamor Hydropower",
        "status": "Construction / commissioning",
        "cod": "Demo profile",
        "report_type_available": "demo EIA text",
        "report_status": "ai_analyzed",
        "baseline_status": "ai_baseline_created",
        "metadata_confidence": "demo_public_metadata",
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
        "normalized_name": "seti-khola-hpp",
        "project_type": "hydropower",
        "river": "Seti Khola",
        "river_or_basin": "Seti Khola",
        "district": "Kaski",
        "district_or_region": "Kaski",
        "province": "Gandaki",
        "promoter": "Demo developer",
        "status": "Development",
        "cod": "Demo profile",
        "report_type_available": "demo profile",
        "report_status": "ai_analyzed",
        "baseline_status": "ai_baseline_created",
        "metadata_confidence": "demo_assumption",
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


REPORT_BACKED_PROJECTS = [
    ("upper-trishuli-1", "Upper Trishuli-1 Hydropower Project", "Trishuli River / basin"),
    ("kabeli-a", "Kabeli-A Hydroelectric Project", "Kabeli River / basin"),
    ("nagmati-dam", "Nagmati Dam Project", "Nagmati River / basin"),
    ("tanahu-tallo-seti", "Tanahu Tallo Seti Hydropower Project", "Seti River / basin"),
    ("bheri-1-pror", "Bheri-1 PRoR Hydropower Project", "Bheri River / basin"),
    ("mardi-khola", "Mardi Khola Hydropower Project", "Mardi Khola / basin"),
    ("mugu-karnali", "Mugu Karnali Hydropower Project", "Karnali River / basin"),
    ("rasuwagadhi", "Rasuwagadhi Hydropower Project", "to_be_extracted"),
    ("rolwaling-khola", "Rolwaling Khola Hydropower Project", "Rolwaling Khola / basin"),
    ("upper-apsuwa-khola", "Upper Apsuwa Khola Hydropower Project", "Apsuwa Khola / basin"),
    ("upper-inkhu-khola", "Upper Inkhu Khola Hydropower Project", "Inkhu Khola / basin"),
    ("upper-mugu-karnali", "Upper Mugu Karnali Hydropower Project", "Karnali River / basin"),
    ("super-inkhu-khola", "Super Inkhu Khola Hydropower Project", "Inkhu Khola / basin"),
    ("dudhkoshi-5", "Dudhkoshi-5 Hydropower Project", "Dudhkoshi River / basin"),
    ("bharbung", "Bharbung Hydropower Project", "to_be_extracted"),
    ("karuwa-seti", "Karuwa Seti Hydropower Project", "Seti River / basin"),
    ("lower-likhu", "Lower Likhu Hydropower Project", "Likhu River / basin"),
]


PROJECT_FIELDS = [
    "id", "name", "normalized_name", "project_type", "capacity_mw",
    "river", "river_or_basin", "district", "district_or_region", "province",
    "promoter", "status", "cod", "report_type_available", "report_status",
    "baseline_status", "metadata_confidence", "description", "risk_theme", "source_note",
]


VALIDATION_QUESTIONS = [
    ("screening", "Screening", "How are you connected to this hydropower project?", "multiple_choice", ["Affected landowner", "Nearby resident", "Indigenous community member", "Downstream water user", "Local business", "Worker", "Contractor worker", "Former worker", "Other"], "PS1", "connection_to_project", "medium"),
    ("screening", "Screening", "If you selected Other, which topic best matches your concern?", "multiple_choice", ["Community impact", "Working conditions", "Both"], "PS1", "other_connection_followup", "medium"),
    ("community", "Information and Consultation", "Were you informed before major project activities affected your area?", "multiple_choice", ["Yes", "Partly", "No", "Not sure"], "PS1", "prior_information", "high"),
    ("community", "Information and Consultation", "Were you or your household invited to consultation meetings?", "multiple_choice", ["Yes", "No", "Not sure"], "PS1", "consultation_invitation", "high"),
    ("community", "Information and Consultation", "Was information shared in a language and format people could understand?", "multiple_choice", ["Yes", "Partly", "No", "Not sure"], "PS1", "understandable_disclosure", "high"),
    ("community", "Information and Consultation", "Were women, vulnerable groups, and Indigenous people able to participate meaningfully?", "multiple_choice", ["Yes", "Partly", "No", "Not sure"], "PS1/PS7", "inclusive_consultation", "critical"),
    ("community", "Information and Consultation", "Did anyone feel pressure to agree with project decisions?", "yes_no_with_followup", ["Yes", "No", "Prefer not to say"], "PS1/PS7", "pressure_or_coercion", "critical"),
    ("community", "Land and Livelihoods", "Was land compensation fair and clear to affected households?", "multiple_choice", ["Yes", "Partly", "No", "Not sure"], "PS5", "compensation_fairness", "critical"),
    ("community", "Land and Livelihoods", "Are there unresolved land, crop, house, or livelihood disputes?", "yes_no_with_followup", ["Yes", "No", "Not sure"], "PS5", "unresolved_land_disputes", "critical"),
    ("community", "Land and Livelihoods", "Were livelihood restoration promises followed after compensation?", "multiple_choice", ["Yes", "Partly", "No", "Not applicable", "Not sure"], "PS5", "livelihood_restoration", "high"),
    ("community", "Indigenous Peoples and Culture", "Are Indigenous groups affected by land, forest, river, or cultural changes?", "multiple_choice", ["Yes", "No", "Not sure"], "PS7", "indigenous_impact", "critical"),
    ("community", "Indigenous Peoples and Culture", "Were Indigenous leaders and households consulted separately when needed?", "multiple_choice", ["Yes", "Partly", "No", "Not applicable", "Not sure"], "PS7", "indigenous_consultation", "critical"),
    ("community", "Indigenous Peoples and Culture", "Are sacred sites, cultural places, or traditional practices affected?", "yes_no_with_followup", ["Yes", "No", "Not sure"], "PS8", "cultural_heritage_impact", "high"),
    ("community", "Environment and Safety", "Have blasting, road traffic, dust, noise, or construction activities affected safety?", "yes_no_with_followup", ["Yes", "No", "Not sure"], "PS4", "community_safety_impact", "high"),
    ("community", "Environment and Safety", "Have river flow, fish, drinking water, irrigation, or forest access changed?", "yes_no_with_followup", ["Yes", "No", "Not sure"], "PS3/PS6", "environmental_change", "high"),
    ("community", "Environment and Safety", "Are mitigation measures visible and working in your area?", "multiple_choice", ["Yes", "Partly", "No", "Not sure"], "PS3/PS4/PS6", "mitigation_working", "medium"),
    ("community", "Grievance and Trust", "Do people know how to submit a grievance or concern?", "multiple_choice", ["Yes", "Some people know", "No", "Not sure"], "PS1", "grievance_awareness", "medium"),
    ("community", "Grievance and Trust", "Are people afraid of retaliation if they complain?", "multiple_choice", ["No", "Some people are afraid", "Yes", "Prefer not to say"], "PS1", "fear_of_retaliation", "critical"),
    ("community", "Grievance and Trust", "Have complaints been acknowledged and resolved on time?", "multiple_choice", ["Yes", "Sometimes delayed", "Often delayed", "No complaints submitted", "Not sure"], "PS1", "grievance_resolution", "high"),
    ("community", "Grievance and Trust", "Do you believe the project reports describe community impacts honestly?", "multiple_choice", ["Yes", "Partly", "No", "Not sure"], "PS1", "report_trust_concern", "critical"),
    ("community", "Additional Detail", "What is the most important issue lenders or reviewers should verify?", "text", [], "PS1", "community_priority_issue", "medium"),
    ("worker", "Employment and Payment", "Are you currently or previously employed on this project?", "multiple_choice", ["Current worker", "Former worker", "Contractor worker", "Not a worker"], "PS2", "worker_connection", "medium"),
    ("worker", "Employment and Payment", "Do workers receive wages on time?", "multiple_choice", ["Yes", "Sometimes delayed", "Often delayed", "Not paid fully", "Not sure"], "PS2", "timely_payment", "critical"),
    ("worker", "Employment and Payment", "Are overtime hours recorded and paid fairly?", "multiple_choice", ["Yes", "Partly", "No", "Not applicable", "Not sure"], "PS2", "overtime_fairness", "high"),
    ("worker", "Employment and Payment", "Do workers receive written contracts or clear terms of work?", "multiple_choice", ["Yes", "Some workers", "No", "Not sure"], "PS2", "contracts_provided", "high"),
    ("worker", "Worker Safety", "Have workers received safety induction or job-specific safety training?", "multiple_choice", ["Yes", "Only briefly", "No", "Not sure"], "PS2/PS4", "safety_training", "critical"),
    ("worker", "Worker Safety", "Is proper PPE provided and replaced when needed?", "multiple_choice", ["Yes", "Partly", "No", "Not sure"], "PS2", "ppe_provided", "critical"),
    ("worker", "Worker Safety", "Are accidents and near-misses honestly recorded and reported?", "multiple_choice", ["Yes", "Partly", "No", "Not sure"], "PS2", "accident_reporting_honesty", "critical"),
    ("worker", "Worker Safety", "Have you seen unsafe work, tunnel, blasting, electrical, traffic, or camp conditions?", "yes_no_with_followup", ["Yes", "No", "Prefer not to say"], "PS2/PS4", "unsafe_conditions", "critical"),
    ("worker", "Worker Accommodation", "Are worker camps clean, safe, and supplied with water and sanitation?", "multiple_choice", ["Yes", "Partly", "No", "Not applicable", "Not sure"], "PS2", "worker_camp_conditions", "high"),
    ("worker", "Worker Accommodation", "Are food, drinking water, and rest facilities adequate?", "multiple_choice", ["Yes", "Partly", "No", "Not sure"], "PS2", "worker_welfare", "medium"),
    ("worker", "Worker Grievance and Trust", "Do workers know how to raise a workplace grievance?", "multiple_choice", ["Yes", "Some workers know", "No", "Not sure"], "PS2", "worker_grievance_awareness", "medium"),
    ("worker", "Worker Grievance and Trust", "Are workers afraid of losing work or being punished if they complain?", "multiple_choice", ["No", "Some workers are afraid", "Yes", "Prefer not to say"], "PS2", "worker_retaliation_fear", "critical"),
    ("worker", "Worker Grievance and Trust", "Do you believe project labor and safety reports describe worker conditions honestly?", "multiple_choice", ["Yes", "Partly", "No", "Not sure"], "PS2", "worker_report_trust_concern", "critical"),
    ("worker", "Worker Grievance and Trust", "Are there serious worker issues not reflected in official reports?", "yes_no_with_followup", ["Yes", "No", "Not sure"], "PS2", "hidden_worker_issues", "critical"),
    ("worker", "Additional Detail", "What is the most important worker issue lenders or reviewers should verify?", "text", [], "PS2", "worker_priority_issue", "medium"),
]


def update_project_profile(project: Project, data: dict):
    for field in PROJECT_FIELDS:
        if field == "id":
            continue
        value = data.get(field)
        if value is not None:
            setattr(project, field, value)


def report_backed_project(project_id: str, name: str, river_or_basin: str) -> dict:
    return {
        "id": project_id,
        "name": name,
        "normalized_name": project_id,
        "project_type": "hydropower",
        "capacity_mw": None,
        "river": river_or_basin,
        "river_or_basin": river_or_basin,
        "district": "to_be_extracted",
        "district_or_region": "to_be_extracted",
        "province": "to_be_extracted",
        "promoter": "to_be_extracted",
        "status": "Report-backed project profile",
        "cod": None,
        "report_type_available": "report available",
        "report_status": "report_available",
        "baseline_status": "baseline_pending",
        "metadata_confidence": "report_backed_metadata_only",
        "description": "Report-backed project profile. Baseline analysis is pending PDF upload and extraction.",
        "risk_theme": "Baseline pending. No compliance findings or scores have been generated.",
        "source_note": "Seeded from report-backed project list. Compliance baseline pending PDF analysis.",
    }


def seed_validation_questions(db):
    for question_set, section, question_text, answer_type, options, linked_standard, topic, risk_weight in VALIDATION_QUESTIONS:
        existing = (
            db.query(ValidationQuestion)
            .filter(
                ValidationQuestion.question_set == question_set,
                ValidationQuestion.topic == topic,
                ValidationQuestion.question_text == question_text,
            )
            .first()
        )
        if existing:
            existing.section = section
            existing.answer_type = answer_type
            existing.options_json = json.dumps(options)
            existing.linked_standard = linked_standard
            existing.risk_weight = risk_weight
            existing.active = True
            continue

        db.add(ValidationQuestion(
            question_set=question_set,
            section=section,
            question_text=question_text,
            answer_type=answer_type,
            options_json=json.dumps(options),
            linked_standard=linked_standard,
            topic=topic,
            risk_weight=risk_weight,
            active=True,
        ))


def ensure_seed_schema():
    """Small SQLite upgrade helper for existing local demo databases."""
    create_tables()
    if engine.dialect.name != "sqlite":
        return

    project_columns = {
        "normalized_name": "VARCHAR(255)",
        "project_type": "VARCHAR(100)",
        "river_or_basin": "VARCHAR(255)",
        "district_or_region": "VARCHAR(255)",
        "report_type_available": "VARCHAR(100)",
        "report_status": "VARCHAR(100)",
        "baseline_status": "VARCHAR(100)",
        "metadata_confidence": "VARCHAR(100)",
    }

    with engine.begin() as connection:
        inspector = inspect(connection)
        existing_project_columns = {column["name"] for column in inspector.get_columns("projects")}
        for column_name, column_type in project_columns.items():
            if column_name not in existing_project_columns:
                connection.execute(text(f"ALTER TABLE projects ADD COLUMN {column_name} {column_type}"))

        snapshot_columns = inspector.get_columns("score_snapshots")
        needs_snapshot_rebuild = any(
            column["name"] in {"ps1_score", "ps5_score", "ps7_score", "overall_score", "risk_level"}
            and not column.get("nullable", True)
            for column in snapshot_columns
        )
        if needs_snapshot_rebuild:
            connection.execute(text("""
                CREATE TABLE score_snapshots_new (
                    id VARCHAR(80) NOT NULL PRIMARY KEY,
                    project_id VARCHAR(80) NOT NULL,
                    analysis_id VARCHAR(80),
                    ps1_score INTEGER,
                    ps5_score INTEGER,
                    ps7_score INTEGER,
                    overall_score INTEGER,
                    risk_level VARCHAR(50),
                    reason_for_change TEXT NOT NULL,
                    created_at DATETIME,
                    FOREIGN KEY(project_id) REFERENCES projects (id),
                    FOREIGN KEY(analysis_id) REFERENCES compliance_analyses (id)
                )
            """))
            connection.execute(text("""
                INSERT INTO score_snapshots_new (
                    id, project_id, analysis_id, ps1_score, ps5_score, ps7_score,
                    overall_score, risk_level, reason_for_change, created_at
                )
                SELECT
                    id, project_id, analysis_id, ps1_score, ps5_score, ps7_score,
                    overall_score, risk_level, reason_for_change, created_at
                FROM score_snapshots
            """))
            connection.execute(text("DROP TABLE score_snapshots"))
            connection.execute(text("ALTER TABLE score_snapshots_new RENAME TO score_snapshots"))


def seed_database():
    ensure_seed_schema()
    db = SessionLocal()
    try:
        seed_validation_questions(db)

        for data in PROJECTS:
            existing_project = db.query(Project).filter(Project.id == data["id"]).first()
            if existing_project:
                update_project_profile(existing_project, data)
                continue

            project = Project(**{key: data.get(key) for key in PROJECT_FIELDS})
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

        for project_id, name, river_or_basin in REPORT_BACKED_PROJECTS:
            data = report_backed_project(project_id, name, river_or_basin)
            existing_project = db.query(Project).filter(Project.id == project_id).first()
            if existing_project:
                update_project_profile(existing_project, data)
                continue

            project = Project(**{key: data.get(key) for key in PROJECT_FIELDS})
            db.add(project)
            db.flush()

            baseline = ProjectBaseline(
                project_id=project.id,
                baseline_type="baseline_pending",
                summary="Report available. Baseline analysis should be generated after PDF upload.",
                source_quality="report-backed project list; PDF extraction pending",
                assumption_level="to_be_generated_from_report",
            )
            db.add(baseline)

            db.add(SourceReference(
                project_id=project.id,
                source_title=f"{project.name} report-backed seed entry",
                source_type="report_available",
                note="Project seeded from report-backed list. No findings were generated until a PDF is uploaded and analyzed.",
            ))

            db.add(ScoreSnapshot(
                project_id=project.id,
                analysis_id=None,
                ps1_score=None,
                ps5_score=None,
                ps7_score=None,
                overall_score=None,
                risk_level="baseline_pending",
                reason_for_change="Project seeded from report-backed list; baseline pending PDF analysis.",
            ))

            db.add(AuditLog(
                project_id=project.id,
                actor="HydroComply seed script",
                actor_role="System",
                action="Project seeded from report-backed list; baseline pending PDF analysis.",
                entity_type="project",
                entity_id=project.id,
                detail="No compliance score, finding, evidence, grievance, or action was created for this project.",
            ))

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
    print("HydroComply demo database seeded.")
