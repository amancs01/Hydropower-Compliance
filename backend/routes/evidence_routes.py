import hashlib
import re
import uuid
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import EvidenceItem, Project
from database.schemas import EvidenceCreate, EvidenceStatusUpdate
from routes.project_routes import row_to_dict
from services.audit_service import add_audit_log
from services.auth_service import require_roles
from services.controversy_detection_service import build_lender_trust_report


router = APIRouter(prefix="/api/projects", tags=["evidence"])
UPLOAD_ROOT = Path(__file__).resolve().parents[1] / "uploads" / "evidence"


def safe_filename(filename: str) -> str:
    name = Path(filename or "evidence-file").name
    name = re.sub(r"[^A-Za-z0-9._-]+", "-", name).strip(".-")
    return name or "evidence-file"


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


@router.post("/{project_id}/evidence/upload")
async def upload_project_evidence_file(
    project_id: str,
    file: UploadFile = File(...),
    standard: str = Form(...),
    evidence_type: str = Form(...),
    title: str = Form(...),
    summary: str | None = Form(None),
    source: str | None = Form(None),
    page_reference: str | None = Form(None),
    confidential: bool = Form(False),
    db: Session = Depends(get_db),
    user=Depends(require_roles(["Developer", "Consultant", "Admin"])),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail={"status": "error", "error_code": "NOT_FOUND", "message": "Project not found."})

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail={"status": "error", "error_code": "EMPTY_FILE", "message": "Uploaded evidence file is empty."})

    original_filename = file.filename or "evidence-file"
    file_hash = hashlib.sha256(file_bytes).hexdigest()
    project_folder = UPLOAD_ROOT / safe_filename(project_id)
    project_folder.mkdir(parents=True, exist_ok=True)
    stored_filename = f"{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{uuid.uuid4().hex[:8]}-{safe_filename(original_filename)}"
    file_path = project_folder / stored_filename
    file_path.write_bytes(file_bytes)

    actor = user.get("display_name") or user.get("role") or "Demo user"
    evidence = EvidenceItem(
        project_id=project_id,
        standard=standard,
        evidence_type=evidence_type,
        title=title,
        summary=summary,
        source=source,
        page_reference=page_reference,
        confidential=confidential,
        status="filed",
        file_path=str(file_path),
        original_filename=original_filename,
        file_size=len(file_bytes),
        file_size_bytes=len(file_bytes),
        mime_type=file.content_type,
        sha256_hash=file_hash,
        uploaded_at=datetime.utcnow(),
        uploaded_by=actor,
    )
    db.add(evidence)
    db.flush()
    add_audit_log(
        db,
        project_id,
        actor,
        user.get("role", "Developer"),
        "Evidence file uploaded",
        "evidence",
        evidence.id,
        f"Evidence file uploaded as filed. Filed evidence is not treated as verified. SHA256: {file_hash}",
    )
    db.commit()
    db.refresh(evidence)
    return {
        "evidence": row_to_dict(evidence),
        "message": "Evidence uploaded as filed. Verification required before lender trust.",
    }


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
    evidence.verification_note = payload.verification_note
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
