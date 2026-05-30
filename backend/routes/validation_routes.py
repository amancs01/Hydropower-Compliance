from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import (
    ControversyFlag,
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
from services.verification_service import (
    build_lender_trust_report,
    detect_controversies,
    make_reference_number,
)


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

    controversies = detect_controversies(db, project_id, responses_with_questions)
    trust_report = build_lender_trust_report(db, project_id)
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
def get_project_controversies(project_id: str, db: Session = Depends(get_db)):
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
):
    task = ManualVerificationTask(project_id=project_id, controversy_id=controversy_id, **payload.dict())
    db.add(task)
    db.commit()
    db.refresh(task)
    return row_to_dict(task)


@router.get("/projects/{project_id}/manual-verification-tasks")
def get_manual_verification_tasks(project_id: str, db: Session = Depends(get_db)):
    rows = (
        db.query(ManualVerificationTask)
        .filter(ManualVerificationTask.project_id == project_id)
        .order_by(ManualVerificationTask.created_at.desc())
        .all()
    )
    return [row_to_dict(row) for row in rows]


@router.post("/manual-verification-tasks/{task_id}/notes")
def add_manual_verification_note(task_id: str, payload: ManualVerificationNoteCreate, db: Session = Depends(get_db)):
    task = db.query(ManualVerificationTask).filter(ManualVerificationTask.id == task_id).first()
    if not task:
        return {"status": "error", "error_code": "NOT_FOUND", "message": "Manual verification task not found."}

    note = ManualVerificationNote(task_id=task_id, **payload.dict())
    db.add(note)
    if payload.decision in {"verified", "partially_verified"}:
        task.status = "completed"
    elif payload.decision in {"unresolved", "needs_field_visit"}:
        task.status = "unresolved"
    db.commit()
    db.refresh(note)
    return row_to_dict(note)


@router.get("/projects/{project_id}/lender-trust-report")
def get_lender_trust_report(project_id: str, db: Session = Depends(get_db)):
    report = (
        db.query(LenderTrustReport)
        .filter(LenderTrustReport.project_id == project_id)
        .order_by(LenderTrustReport.created_at.desc())
        .first()
    )
    if not report:
        report = build_lender_trust_report(db, project_id)
        db.commit()
        db.refresh(report)
    return row_to_dict(report)
