from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import Grievance
from database.schemas import GrievanceCreate
from routes.project_routes import row_to_dict
from services.audit_service import add_audit_log


router = APIRouter(prefix="/api/projects", tags=["grievances"])


@router.get("/{project_id}/grievances")
def get_project_grievances(project_id: str, db: Session = Depends(get_db)):
    rows = db.query(Grievance).filter(Grievance.project_id == project_id).all()
    return [row_to_dict(row) for row in rows]


@router.post("/{project_id}/grievances")
def create_project_grievance(project_id: str, payload: GrievanceCreate, db: Session = Depends(get_db)):
    grievance = Grievance(project_id=project_id, **payload.dict())
    db.add(grievance)
    db.flush()
    add_audit_log(db, project_id, "Community Portal", "Community", "Grievance added", "grievance", grievance.id, "Grievance record is append-only.")
    db.commit()
    return row_to_dict(grievance)
