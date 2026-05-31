from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import EvidenceItem
from database.schemas import EvidenceCreate, EvidenceStatusUpdate
from routes.project_routes import row_to_dict
from services.audit_service import add_audit_log
from services.auth_service import require_roles
from services.controversy_detection_service import build_lender_trust_report


router = APIRouter(prefix="/api/projects", tags=["evidence"])


@router.get("/{project_id}/evidence")
def get_project_evidence(
    project_id: str,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["Developer", "Consultant", "Lender", "Regulator", "Admin"])),
):
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


@router.patch("/{project_id}/evidence/{evidence_id}/status")
def update_project_evidence_status(
    project_id: str,
    evidence_id: str,
    payload: EvidenceStatusUpdate,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["Consultant", "Lender", "Regulator", "Admin"])),
):
    evidence = (
        db.query(EvidenceItem)
        .filter(EvidenceItem.project_id == project_id, EvidenceItem.id == evidence_id)
        .first()
    )
    if not evidence:
        raise HTTPException(status_code=404, detail={"status": "error", "error_code": "NOT_FOUND", "message": "Evidence item not found."})

    old_status = evidence.status
    evidence.status = payload.status
    if str(payload.status or "").lower() == "verified":
        evidence.verified_by = payload.verified_by or user.get("display_name") or user.get("role")
    else:
        evidence.verified_by = None

    actor = payload.verified_by or user.get("display_name") or user.get("role") or "Reviewer"
    add_audit_log(
        db,
        project_id,
        actor,
        user.get("role", "Reviewer"),
        f"Evidence {payload.status.lower()}",
        "evidence",
        evidence.id,
        payload.verification_note or f"{evidence.title} marked {payload.status}.",
        old_value=old_status,
        new_value=payload.status,
    )
    trust_report = build_lender_trust_report(db, project_id)
    add_audit_log(
        db,
        project_id,
        "HydroComply trust engine",
        "System",
        "Lender trust report generated",
        "lender_trust_report",
        trust_report.id,
        f"Evidence status update rebuilt report with {trust_report.unresolved_controversies_count} unresolved controversies.",
    )
    db.commit()
    db.refresh(evidence)
    db.refresh(trust_report)
    return {
        "evidence": row_to_dict(evidence),
        "trust_report": row_to_dict(trust_report),
    }
