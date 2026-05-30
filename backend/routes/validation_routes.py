from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import (
    ControversyFlag,
    AuditLog,
    LenderTrustReport,
    ManualVerificationNote,
    ManualVerificationTask,
    ValidationQuestion,
    ValidationResponse,
    ValidationSubmission,
)
from database.schemas import (
    ManualVerificationNoteCreate,
    ManualVerificationTaskCreate,
    ValidationSubmissionCreate,
)
from routes.project_routes import row_to_dict
from services.controversy_detection_service import (
    build_lender_trust_report,
    detect_controversies,
    make_reference_number,
)
from services.auth_service import require_roles


router = APIRouter(prefix="/api", tags=["validation"])


def question_to_dict(question: ValidationQuestion):
    row = row_to_dict(question)
    row["options"] = []
    if question.options_json:
        import json

        row["options"] = json.loads(question.options_json)
    return row


@router.get("/projects/{project_id}/validation/screening-question")
def get_screening_question(project_id: str, db: Session = Depends(get_db)):
    questions = (
        db.query(ValidationQuestion)
        .filter(ValidationQuestion.question_set == "screening", ValidationQuestion.active == True)
        .order_by(ValidationQuestion.created_at)
        .all()
    )
    return {
        "question": question_to_dict(questions[0]) if questions else None,
        "follow_up_question": question_to_dict(questions[1]) if len(questions) > 1 else None,
        "questions": [question_to_dict(question) for question in questions],
    }


@router.get("/projects/{project_id}/validation/questions")
def get_validation_questions(project_id: str, question_set: str = "community", db: Session = Depends(get_db)):
    rows = (
        db.query(ValidationQuestion)
        .filter(ValidationQuestion.question_set == question_set, ValidationQuestion.active == True)
        .order_by(ValidationQuestion.created_at)
        .all()
    )
    return [question_to_dict(row) for row in rows]


@router.post("/projects/{project_id}/validation/responses")
def submit_validation_responses(project_id: str, payload: ValidationSubmissionCreate, db: Session = Depends(get_db)):
    reference_number = make_reference_number(project_id)
    submission = ValidationSubmission(
        project_id=project_id,
        respondent_type=payload.respondent_type,
        respondent_connection=payload.respondent_connection,
        reference_number=reference_number,
        anonymous=payload.anonymous,
        status="submitted",
    )
    db.add(submission)
    db.flush()

    responses_with_questions = []
    for answer in payload.answers:
        question = db.query(ValidationQuestion).filter(ValidationQuestion.id == answer.question_id).first()
        if not question:
            continue
        response = ValidationResponse(
            project_id=project_id,
            submission_id=submission.id,
            question_id=question.id,
            respondent_type=payload.respondent_type,
            respondent_connection=payload.respondent_connection,
            answer=answer.answer,
            follow_up_text=answer.follow_up_text,
            anonymous=payload.anonymous,
            gps_allowed=payload.gps_allowed,
            photo_allowed=payload.photo_allowed,
            location_text=payload.location_text,
            reference_number=reference_number,
        )
        db.add(response)
        db.flush()
        responses_with_questions.append((response, question))

    db.add(AuditLog(
        project_id=project_id,
        actor="Validation Portal",
        actor_role="Public respondent",
        action="Validation submission received",
        entity_type="validation_submission",
        entity_id=submission.id,
        detail=f"Validation response {reference_number} received from {payload.respondent_type}.",
    ))
    controversies = detect_controversies(db, project_id, responses_with_questions)
    trust_report = build_lender_trust_report(db, project_id)
    db.add(AuditLog(
        project_id=project_id,
        actor="HydroComply trust engine",
        actor_role="System",
        action="Lender trust report generated",
        entity_type="lender_trust_report",
        entity_id=trust_report.id,
        detail=f"{trust_report.unresolved_controversies_count} unresolved controversies included.",
    ))
    db.commit()

    return {
        "status": "success",
        "message": "Your validation response has been received.",
        "reference_number": reference_number,
        "submission_id": submission.id,
        "controversies_created": len(controversies),
        "trust_report_id": trust_report.id,
    }


@router.get("/projects/{project_id}/controversies")
def get_project_controversies(
    project_id: str,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["Developer", "Consultant", "Lender", "Regulator", "Community Liaison", "Admin"])),
):
    rows = (
        db.query(ControversyFlag)
        .filter(ControversyFlag.project_id == project_id)
        .order_by(ControversyFlag.created_at.desc())
        .all()
    )
    return [row_to_dict(row) for row in rows]


@router.post("/projects/{project_id}/controversies/{controversy_id}/manual-verification-task")
def create_manual_verification_task(
    project_id: str,
    controversy_id: str,
    payload: ManualVerificationTaskCreate,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["Consultant", "Community Liaison", "Admin"])),
):
    task = ManualVerificationTask(project_id=project_id, controversy_id=controversy_id, **payload.dict())
    db.add(task)
    db.flush()
    db.add(AuditLog(
        project_id=project_id,
        actor="HydroComply trust engine",
        actor_role="System",
        action="Manual verification task created",
        entity_type="manual_verification_task",
        entity_id=task.id,
        detail=f"Manual verification task created for controversy {controversy_id}.",
    ))
    db.commit()
    db.refresh(task)
    return row_to_dict(task)


@router.get("/projects/{project_id}/manual-verification-tasks")
def get_manual_verification_tasks(
    project_id: str,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["Consultant", "Lender", "Regulator", "Community Liaison", "Admin"])),
):
    rows = (
        db.query(ManualVerificationTask)
        .filter(ManualVerificationTask.project_id == project_id)
        .order_by(ManualVerificationTask.created_at.desc())
        .all()
    )
    return [row_to_dict(row) for row in rows]


@router.post("/manual-verification-tasks/{task_id}/notes")
def add_manual_verification_note(
    task_id: str,
    payload: ManualVerificationNoteCreate,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["Consultant", "Community Liaison", "Admin"])),
):
    task = db.query(ManualVerificationTask).filter(ManualVerificationTask.id == task_id).first()
    if not task:
        return {"status": "error", "error_code": "NOT_FOUND", "message": "Manual verification task not found."}

    note = ManualVerificationNote(task_id=task_id, **payload.dict())
    db.add(note)
    db.flush()
    if payload.decision in {"report_claim_verified", "community_feedback_verified", "worker_feedback_verified", "partially_verified"}:
        task.status = "completed"
    elif payload.decision in {"unresolved", "needs_field_visit"}:
        task.status = "unresolved"
    db.add(AuditLog(
        project_id=task.project_id,
        actor=payload.verifier_name,
        actor_role=payload.verifier_role,
        action="Manual verification note added",
        entity_type="manual_verification_note",
        entity_id=note.id,
        detail=f"Decision: {payload.decision}.",
    ))
    db.commit()
    db.refresh(note)
    return row_to_dict(note)


@router.get("/projects/{project_id}/lender-trust-report")
def get_lender_trust_report(
    project_id: str,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["Lender", "Consultant", "Regulator", "Admin"])),
):
    report = (
        db.query(LenderTrustReport)
        .filter(LenderTrustReport.project_id == project_id)
        .order_by(LenderTrustReport.created_at.desc())
        .first()
    )
    if not report:
        report = build_lender_trust_report(db, project_id)
        db.add(AuditLog(
            project_id=project_id,
            actor="HydroComply trust engine",
            actor_role="System",
            action="Lender trust report generated",
            entity_type="lender_trust_report",
            entity_id=report.id,
            detail=f"{report.unresolved_controversies_count} unresolved controversies included.",
        ))
        db.commit()
        db.refresh(report)
    return row_to_dict(report)
