from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import Action
from database.schemas import ActionCreate
from routes.project_routes import row_to_dict
from services.audit_service import add_audit_log


router = APIRouter(prefix="/api/projects", tags=["actions"])


@router.get("/{project_id}/actions")
def get_project_actions(project_id: str, db: Session = Depends(get_db)):
    rows = db.query(Action).filter(Action.project_id == project_id).all()
    return [row_to_dict(row) for row in rows]


@router.post("/{project_id}/actions")
def create_project_action(project_id: str, payload: ActionCreate, db: Session = Depends(get_db)):
    action = Action(project_id=project_id, **payload.dict())
    db.add(action)
    db.flush()
    add_audit_log(db, project_id, "API user", "Project team", "Action added", "action", action.id)
    db.commit()
    return row_to_dict(action)
