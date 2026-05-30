from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import EvidenceItem
from database.schemas import EvidenceCreate
from routes.project_routes import row_to_dict
from services.audit_service import add_audit_log
from services.auth_service import require_roles


router = APIRouter(prefix="/api/projects", tags=["evidence"])


@router.get("/{project_id}/evidence")
def get_project_evidence(project_id: str, db: Session = Depends(get_db)):
    rows = db.query(EvidenceItem).filter(EvidenceItem.project_id == project_id).all()
    return [row_to_dict(row) for row in rows]


@router.post("/{project_id}/evidence")
def create_project_evidence(
    project_id: str,
    payload: EvidenceCreate,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["Developer", "Consultant", "Admin"])),
):
    evidence = EvidenceItem(project_id=project_id, **payload.dict())
    db.add(evidence)
    db.flush()
    add_audit_log(db, project_id, payload.uploaded_by, "Developer", "Evidence added", "evidence", evidence.id, "Filed is not verified.")
    db.commit()
    return row_to_dict(evidence)
