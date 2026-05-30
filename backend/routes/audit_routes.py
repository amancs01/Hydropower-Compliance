from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import AuditLog
from routes.project_routes import row_to_dict
from services.auth_service import require_roles


router = APIRouter(prefix="/api/projects", tags=["audit"])


@router.get("/{project_id}/audit")
def get_project_audit(
    project_id: str,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["Lender", "Consultant", "Regulator", "Admin"])),
):
    rows = db.query(AuditLog).filter(AuditLog.project_id == project_id).order_by(AuditLog.created_at.desc()).all()
    return [row_to_dict(row) for row in rows]
