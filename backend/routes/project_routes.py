from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.connection import get_db
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
    VerificationReview,
)
from database.schemas import (
    ActionCreate,
    BaselineCreate,
    EvidenceCreate,
    FindingCreate,
    GrievanceCreate,
    ProjectCreate,
    ScoreSnapshotCreate,
    VerificationReviewCreate,
)
from services.audit_service import add_audit_log
from services.auth_service import require_roles


router = APIRouter(prefix="/api/projects", tags=["projects"])


def row_to_dict(row):
    return {column.name: getattr(row, column.name) for column in row.__table__.columns}


def latest_score(db: Session, project_id: str):
    snapshot = (
        db.query(ScoreSnapshot)
        .filter(ScoreSnapshot.project_id == project_id)
        .order_by(ScoreSnapshot.created_at.desc())
        .first()
    )
    return row_to_dict(snapshot) if snapshot else None


@router.get("")
def list_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).order_by(Project.name).all()
    return [
        {**row_to_dict(project), "latest_score": latest_score(db, project.id)}
        for project in projects
    ]


@router.post("")
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["Developer", "Admin"])),
):
    project = Project(**payload.dict())
    db.add(project)
    db.flush()
    add_audit_log(
        db,
        project_id=project.id,
        actor="API user",
        actor_role="Admin",
        action="Project created",
        entity_type="project",
        entity_id=project.id,
        detail="Project added through API.",
    )
    db.commit()
    db.refresh(project)
    return row_to_dict(project)


@router.get("/{project_id}")
def get_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        return {"status": "error", "error_code": "NOT_FOUND", "message": "Project not found."}
    return {**row_to_dict(project), "latest_score": latest_score(db, project.id)}


@router.get("/{project_id}/baseline")
def get_project_baseline(project_id: str, db: Session = Depends(get_db)):
    rows = db.query(ProjectBaseline).filter(ProjectBaseline.project_id == project_id).all()
    return [row_to_dict(row) for row in rows]


@router.post("/{project_id}/baseline")
def create_project_baseline(
    project_id: str,
    payload: BaselineCreate,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["Developer", "Admin"])),
):
    baseline = ProjectBaseline(project_id=project_id, **payload.dict())
    db.add(baseline)
    db.flush()
    add_audit_log(db, project_id, "API user", "Admin", "Baseline added", "baseline", baseline.id)
    db.commit()
    return row_to_dict(baseline)


@router.get("/{project_id}/findings")
def get_project_findings(project_id: str, db: Session = Depends(get_db)):
    rows = db.query(ComplianceFinding).filter(ComplianceFinding.project_id == project_id).all()
    return [row_to_dict(row) for row in rows]


@router.post("/{project_id}/findings")
def create_project_finding(
    project_id: str,
    payload: FindingCreate,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["Developer", "Consultant", "Admin"])),
):
    finding = ComplianceFinding(project_id=project_id, **payload.dict())
    db.add(finding)
    db.flush()
    add_audit_log(db, project_id, "API user", "Reviewer", "Finding added", "finding", finding.id)
    db.commit()
    return row_to_dict(finding)


@router.get("/{project_id}/score-history")
def get_project_score_history(project_id: str, db: Session = Depends(get_db)):
    rows = db.query(ScoreSnapshot).filter(ScoreSnapshot.project_id == project_id).order_by(ScoreSnapshot.created_at).all()
    return [row_to_dict(row) for row in rows]


@router.post("/{project_id}/score-snapshots")
def create_score_snapshot(
    project_id: str,
    payload: ScoreSnapshotCreate,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["Consultant", "Admin"])),
):
    snapshot = ScoreSnapshot(project_id=project_id, **payload.dict())
    db.add(snapshot)
    db.flush()
    add_audit_log(db, project_id, "API user", "Reviewer", "Score snapshot added", "score_snapshot", snapshot.id)
    db.commit()
    return row_to_dict(snapshot)


@router.post("/{project_id}/verification-reviews")
def create_verification_review(
    project_id: str,
    payload: VerificationReviewCreate,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["Consultant", "Lender", "Admin"])),
):
    review = VerificationReview(project_id=project_id, **payload.dict())
    db.add(review)
    db.flush()
    add_audit_log(db, project_id, payload.reviewer_name, payload.reviewer_role, "Verification review added", payload.entity_type, payload.entity_id, payload.comment or "")
    db.commit()
    return row_to_dict(review)
