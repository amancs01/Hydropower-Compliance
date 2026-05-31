import hashlib
import json
import logging
from datetime import datetime, timedelta

from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.orm import Session

from config import settings
from database.connection import get_db
from database.models import Action, AuditLog, ComplianceAnalysis, ComplianceFinding, ComplianceStandardResult, Document, DocumentChunk, IFCRequirement, Project, ReportClaim, ScoreSnapshot
from database.seed import ensure_seed_schema
from routes import action_routes, audit_routes, auth_routes, evidence_routes, grievance_routes, project_routes, validation_routes
from services.auth_service import require_roles
from schemas import ComplianceAnalyzeResponse, PdfExtractResponse
from services.chunk_service import chunk_pages, chunks_to_context, select_relevant_chunks
from services.compliance_service import IFC_REQUIREMENTS, analyze_with_groq
from services.fallback_service import fallback_analysis
from services.groq_service import GroqAPIError, ModelJSONParseError
from services.language_service import contains_devanagari
from services.pdf_service import extract_pdf_pages, is_text_too_short
from services.scoring_service import STANDARD_KEYS, scores_from_model
from services.translation_service import translate_context_if_needed


app = FastAPI(title="HydroComply AI Backend", version="0.2.0")
logger = logging.getLogger(__name__)

if settings.allow_all_origins:
    logger.warning("Warning: wildcard CORS enabled. Use only for local/demo testing.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(project_routes.router)
app.include_router(evidence_routes.router)
app.include_router(grievance_routes.router)
app.include_router(action_routes.router)
app.include_router(audit_routes.router)
app.include_router(validation_routes.router)


@app.on_event("startup")
def startup():
    if settings.demo_jwt_secret == "change-this-in-production":
        logger.warning("DEMO_JWT_SECRET is using the default demo value. Do not use this in production.")
    ensure_seed_schema()


@app.exception_handler(HTTPException)
def http_exception_handler(request, exc: HTTPException):
    if isinstance(exc.detail, dict) and exc.detail.get("status") == "error":
        return JSONResponse(status_code=exc.status_code, content=exc.detail)
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


def error_response(error_code: str, message: str, status_code: int = 400, details=None):
    return JSONResponse(
        status_code=status_code,
        content={
            "status": "error",
            "error_code": error_code,
            "message": message,
            "details": details or {},
        },
    )


def validate_pdf_upload(file: UploadFile):
    filename = file.filename or "uploaded.pdf"
    if file.content_type != "application/pdf" and not filename.lower().endswith(".pdf"):
        return error_response("PDF_EXTRACTION_ERROR", "Please upload a PDF file.", 400)
    return None


def get_or_create_demo_project(db: Session) -> Project:
    project = db.query(Project).filter(Project.id == "middle-tamor").first()
    if project:
        return project
    project = Project(
        id="middle-tamor",
        name="Middle Tamor HPP",
        capacity_mw="73",
        river="Tamor River",
        district="Taplejung",
        province="Koshi",
        promoter="Sanima Middle Tamor Hydropower",
        status="Construction / commissioning",
        cod="Demo profile",
        description="Main demo project for uploaded AI compliance analysis.",
        risk_theme="PS1, PS5, and PS7 AI analysis scenario.",
        source_note="Created automatically for AI PDF analysis if seed data has not been run.",
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def get_project_or_error(db: Session, project_id: str) -> Project:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=404,
            detail={"status": "error", "error_code": "NOT_FOUND", "message": "Project not found."},
        )
    return project


def action_title_for_standard(standard: str) -> str:
    return {
        "PS1": "Upload ESMS and stakeholder engagement evidence",
        "PS2": "Submit worker safety and wage evidence",
        "PS3": "Submit pollution and waste management evidence",
        "PS4": "Submit community safety and emergency preparedness evidence",
        "PS5": "Submit compensation and livelihood restoration evidence",
        "PS6": "Submit biodiversity and environmental-flow monitoring evidence",
        "PS7": "Submit Indigenous Peoples screening or consultation evidence",
        "PS8": "Submit cultural heritage screening or chance-find procedure",
    }.get(standard, "Submit evidence for compliance gap")


def due_days_for_severity(severity: str) -> int | None:
    return {"Critical": 7, "High": 14, "Medium": 30}.get(severity)


def seed_ifc_requirements(db: Session):
    if db.query(IFCRequirement).count() > 0:
        return
    for block in IFC_REQUIREMENTS.strip().split("\n\n"):
        standard = block.split(":", 1)[0].strip()
        db.add(IFCRequirement(standard=standard, requirement_text=block.strip()))
    db.commit()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/health")
def api_health(db: Session = Depends(get_db)):
    database_connected = True
    try:
        db.execute(text("SELECT 1"))
    except Exception:
        database_connected = False
    return {
        "status": "ok" if database_connected else "degraded",
        "app_version": app.version,
        "database_connected": database_connected,
        "ai_provider_configured": bool(settings.groq_api_key),
    }


@app.post("/api/pdf/extract", response_model=PdfExtractResponse)
async def extract_pdf(
    file: UploadFile = File(...),
    project_id: str = Form(...),
    db: Session = Depends(get_db),
    user=Depends(require_roles(["Developer", "Consultant", "Admin"])),
):
    get_project_or_error(db, project_id)
    invalid = validate_pdf_upload(file)
    if invalid:
        return invalid

    pdf_bytes = await file.read()
    if not pdf_bytes:
        return error_response("EMPTY_FILE", "Uploaded PDF is empty.", 400)

    try:
        pages_text, full_text = extract_pdf_pages(pdf_bytes)
    except ValueError as exc:
        return error_response(str(exc), "Could not extract text from PDF.", 400)

    if is_text_too_short(full_text):
        return error_response(
            "OCR_REQUIRED",
            "This PDF appears to be scanned or image-based. OCR is required before AI analysis.",
            422,
            {"filename": file.filename, "pages": len(pages_text), "text_length": len(full_text)},
        )

    return PdfExtractResponse(
        filename=file.filename or "uploaded.pdf",
        pages=len(pages_text),
        text_length=len(full_text),
        preview=full_text[:1000],
        pages_text=pages_text,
    )


@app.post("/api/compliance/analyze")
async def analyze_compliance_pdf(
    file: UploadFile = File(...),
    project_id: str = Form(...),
    db: Session = Depends(get_db),
    user=Depends(require_roles(["Developer", "Consultant", "Admin"])),
):
    invalid = validate_pdf_upload(file)
    if invalid:
        return invalid

    pdf_bytes = await file.read()
    if not pdf_bytes:
        return error_response("EMPTY_FILE", "Uploaded PDF is empty.", 400)
    if not project_id:
        return error_response("PROJECT_REQUIRED", "Select a project before running analysis.", 400)
    project = get_project_or_error(db, project_id)
    file_hash = hashlib.sha256(pdf_bytes).hexdigest()

    try:
        pages_text, full_text = extract_pdf_pages(pdf_bytes)
    except ValueError as exc:
        return error_response(str(exc), "Could not extract text from PDF.", 400)

    if is_text_too_short(full_text):
        return error_response(
            "OCR_REQUIRED",
            "This PDF appears to be scanned or image-based. OCR is required before AI analysis.",
            422,
        )

    seed_ifc_requirements(db)
    chunks = chunk_pages(pages_text)
    relevant_chunks = select_relevant_chunks(chunks)
    selected_context = chunks_to_context(relevant_chunks)
    logger.info(
        "Compliance PDF analysis: chunks_extracted=%s chunks_selected=%s context_chars=%s",
        len(chunks),
        len(relevant_chunks),
        len(selected_context),
    )
    contains_nepali = contains_devanagari(selected_context)

    try:
        english_context = translate_context_if_needed(selected_context, contains_nepali)
    except GroqAPIError:
        return error_response("GROQ_API_ERROR", "Groq translation failed. Please try again.", 502)

    model_used = settings.groq_model
    if settings.groq_api_key:
        try:
            model_result = analyze_with_groq(english_context)
        except GroqAPIError:
            return error_response("GROQ_API_ERROR", "Groq compliance analysis failed. Please try again.", 502)
        except ModelJSONParseError:
            return error_response("MODEL_JSON_PARSE_ERROR", "The AI model did not return valid JSON.", 502)
    else:
        model_used = "local-demo-fallback"
        first_chunk = relevant_chunks[0] if relevant_chunks else None
        model_result = fallback_analysis(first_chunk.text if first_chunk else full_text, first_chunk.page_number if first_chunk else 1)

    scores = scores_from_model(model_result)
    logger.info(
        "Compliance model returned standards: %s",
        {key.upper(): getattr(model_result, key).analysis_status for key in STANDARD_KEYS},
    )
    document = Document(
        project_id=project.id,
        filename=file.filename or "uploaded.pdf",
        original_filename=file.filename or "uploaded.pdf",
        file_size=len(pdf_bytes),
        mime_type=file.content_type or "application/pdf",
        sha256_hash=file_hash,
        document_type="uploaded_pdf",
        pages=len(pages_text),
        text_length=len(full_text),
        contains_nepali=contains_nepali,
        uploaded_by="Frontend user",
        verification_status="uploaded",
        upload_status="extracted",
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    for chunk in chunks:
        db.add(
            DocumentChunk(
                document_id=document.id,
                project_id=project.id,
                page_number=chunk.page_number,
                chunk_index=chunk.chunk_index,
                text=chunk.text,
            )
        )

    analysis = ComplianceAnalysis(
        project_id=project.id,
        document_id=document.id,
        analysis_type="ai_pdf_analysis",
        ps1_score=scores["ps1"],
        ps2_score=scores["ps2"],
        ps3_score=scores["ps3"],
        ps4_score=scores["ps4"],
        ps5_score=scores["ps5"],
        ps6_score=scores["ps6"],
        ps7_score=scores["ps7"],
        ps8_score=scores["ps8"],
        overall_score=scores["overall"] if scores["overall"] is not None else 0,
        risk_level=scores["risk_level"],
        summary=model_result.summary,
        model_used=model_used,
        verification_status="ai_generated",
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    findings = []
    created_actions = []
    for key in STANDARD_KEYS:
        standard = key.upper()
        finding = getattr(model_result, key)
        finding.standard = finding.standard or standard
        result_payload = {
            "project_id": project.id,
            "analysis_id": analysis.id,
            "document_id": document.id,
            "standard": standard,
            "score": finding.score,
            "severity": finding.severity,
            "analysis_status": finding.analysis_status,
            "evidence_coverage": finding.evidence_coverage,
            "confidence": finding.confidence,
            "title": finding.title,
            "summary": finding.summary,
            "missing_requirements_json": json.dumps(finding.missing_requirements),
            "partial_compliance_json": json.dumps(finding.partial_compliance),
            "risks_json": json.dumps(finding.risks),
            "recommended_actions_json": json.dumps(finding.recommended_actions),
            "evidence_json": json.dumps([item.dict() for item in finding.evidence]),
        }
        db.add(
            ComplianceStandardResult(
                **result_payload,
                risk_level=finding.severity if finding.analysis_status == "analyzed" else None,
            )
        )
        db_finding = None
        if finding.analysis_status == "analyzed" and finding.score is not None:
            db_finding = ComplianceFinding(
                **result_payload,
                description=finding.summary or finding.title,
                verification_status="ai_generated",
            )
            db.add(db_finding)
            db.flush()
            days = due_days_for_severity(finding.severity)
            if days is not None:
                due = (datetime.utcnow() + timedelta(days=days)).date().isoformat()
                db_action = Action(
                    project_id=project.id,
                    finding_id=db_finding.id,
                    owner="Project Compliance Team",
                    title=action_title_for_standard(standard),
                    description="AI-created action from document analysis. Review and update owner/status as needed.",
                    severity=finding.severity,
                    status="open",
                    due_date=due,
                )
                db.add(db_action)
                db.flush()
                created_actions.append(db_action)
        findings.append(finding_to_response(standard, finding))

    db.commit()

    report_claims = []
    for claim in model_result.report_claims:
        db_claim = ReportClaim(
            project_id=project.id,
            document_id=document.id,
            analysis_id=analysis.id,
            standard=claim.standard,
            topic=claim.topic,
            claim_text=claim.claim_text,
            source_excerpt=claim.source_excerpt,
            source_page=str(claim.source_page) if claim.source_page is not None else None,
            ai_confidence=claim.ai_confidence,
            verification_status="document_claim_only",
        )
        db.add(db_claim)
        db.flush()
        report_claims.append(report_claim_to_response(db_claim))

    if report_claims:
        db.add(AuditLog(
            project_id=project.id,
            actor="HydroComply AI",
            actor_role="System",
            action="Report claims extracted",
            entity_type="report_claims",
            entity_id=str(analysis.id),
            detail=f"{len(report_claims)} report claims extracted as document_claim_only.",
        ))
    if created_actions:
        db.add(AuditLog(
            project_id=project.id,
            actor="HydroComply AI",
            actor_role="System",
            action="Corrective actions created",
            entity_type="actions",
            entity_id=str(analysis.id),
            detail=f"{len(created_actions)} AI-created corrective actions linked to critical/high/medium findings.",
        ))
    db.add(ScoreSnapshot(
        project_id=project.id,
        analysis_id=analysis.id,
        ps1_score=scores["ps1"],
        ps2_score=scores["ps2"],
        ps3_score=scores["ps3"],
        ps4_score=scores["ps4"],
        ps5_score=scores["ps5"],
        ps6_score=scores["ps6"],
        ps7_score=scores["ps7"],
        ps8_score=scores["ps8"],
        overall_score=scores["overall"],
        risk_level=scores["risk_level"],
        reason_for_change="AI analysis completed",
    ))
    db.commit()

    analyzed_count = len([finding for finding in findings if finding.get("analysis_status") == "analyzed" and finding.get("score") is not None])
    overall_confidence = "low" if analyzed_count <= 3 else "medium" if analyzed_count <= 6 else "high"

    return {
        "status": "success",
        "analysis_id": str(analysis.id),
        "document": document_to_response(document),
        "scores": scores,
        "summary": model_result.summary,
        "findings": findings,
        "report_claims": report_claims,
        "actions_created": len(created_actions),
        "raw_model_used": {
            "translation_model": settings.groq_translation_model if contains_nepali else "not_used",
            "compliance_model": model_used,
        },
        "analysis_source": model_result.analysis_source or ("groq" if settings.groq_api_key else "local_demo_fallback"),
        "note": model_result.note,
    }


@app.get("/api/compliance/analyses/{analysis_id}", response_model=ComplianceAnalyzeResponse)
def get_analysis(
    analysis_id: str,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["Developer", "Consultant", "Lender", "Regulator", "Admin"])),
):
    analysis = db.query(ComplianceAnalysis).filter(ComplianceAnalysis.id == analysis_id).first()
    if not analysis:
        return error_response("NOT_FOUND", "Analysis not found.", 404)

    document = db.query(Document).filter(Document.id == analysis.document_id).first()
    if not document:
        return error_response("NOT_FOUND", "Analysis document not found.", 404)
    standard_results = (
        db.query(ComplianceStandardResult)
        .filter(ComplianceStandardResult.analysis_id == analysis.id)
        .order_by(ComplianceStandardResult.standard)
        .all()
    )
    source_rows = standard_results or analysis.findings
    findings = [stored_finding_to_response(finding) for finding in source_rows]
    analyzed_count = len([
        finding for finding in findings
        if finding.get("analysis_status") == "analyzed" and finding.get("score") is not None
    ])
    overall_confidence = "low" if analyzed_count <= 3 else "medium" if analyzed_count <= 6 else "high"
    report_claims = (
        db.query(ReportClaim)
        .filter(ReportClaim.analysis_id == analysis.id)
        .order_by(ReportClaim.created_at.desc())
        .all()
    )

    return {
        "status": "success",
        "analysis_id": str(analysis.id),
        "document": document_to_response(document),
        "scores": {
            "ps1": analysis.ps1_score,
            "ps2": analysis.ps2_score,
            "ps3": analysis.ps3_score,
            "ps4": analysis.ps4_score,
            "ps5": analysis.ps5_score,
            "ps6": analysis.ps6_score,
            "ps7": analysis.ps7_score,
            "ps8": analysis.ps8_score,
            "overall": analysis.overall_score,
            "risk_level": analysis.risk_level,
            "analyzed_count": analyzed_count,
            "total_standards": 8,
            "overall_confidence": overall_confidence,
            "coverage_note": f"{analyzed_count} of 8 standards were analyzed. Remaining standards require additional documents or manual review.",
        },
        "summary": analysis.summary,
        "findings": findings,
        "report_claims": [report_claim_to_response(claim) for claim in report_claims],
        "raw_model_used": {
            "translation_model": settings.groq_translation_model,
            "compliance_model": analysis.model_used,
        },
    }


def finding_to_response(standard: str, finding):
    return {
        "standard": standard,
        "score": finding.score,
        "severity": finding.severity,
        "analysis_status": finding.analysis_status,
        "evidence_coverage": finding.evidence_coverage,
        "confidence": finding.confidence,
        "title": finding.title,
        "summary": finding.summary,
        "missing_requirements": finding.missing_requirements,
        "partial_compliance": finding.partial_compliance,
        "risks": finding.risks,
        "recommended_actions": finding.recommended_actions,
        "evidence": [item.dict() for item in finding.evidence],
    }


def stored_finding_to_response(finding):
    return {
        "standard": finding.standard,
        "score": finding.score,
        "severity": finding.severity,
        "analysis_status": getattr(finding, "analysis_status", "analyzed"),
        "evidence_coverage": getattr(finding, "evidence_coverage", "weak"),
        "confidence": getattr(finding, "confidence", 0),
        "title": finding.title,
        "summary": getattr(finding, "summary", "") or finding.description or finding.title,
        "missing_requirements": safe_json_list(finding.missing_requirements_json),
        "partial_compliance": safe_json_list(finding.partial_compliance_json),
        "risks": safe_json_list(finding.risks_json),
        "recommended_actions": safe_json_list(finding.recommended_actions_json),
        "evidence": safe_json_list(finding.evidence_json),
    }


def safe_json_list(value):
    if not value:
        return []
    try:
        parsed = json.loads(value)
    except (TypeError, ValueError, json.JSONDecodeError):
        return []
    return parsed if isinstance(parsed, list) else []


def document_to_response(document: Document):
    uploaded_at = getattr(document, "uploaded_at", None) or document.created_at
    return {
        "id": str(document.id),
        "filename": document.filename,
        "original_filename": getattr(document, "original_filename", None) or document.filename,
        "file_size": getattr(document, "file_size", None),
        "mime_type": getattr(document, "mime_type", None),
        "sha256_hash": getattr(document, "sha256_hash", None),
        "uploaded_at": uploaded_at.isoformat() if uploaded_at else None,
        "verification_status": getattr(document, "verification_status", None) or "uploaded",
        "pages": document.pages,
        "text_length": document.text_length,
        "contains_nepali": document.contains_nepali,
    }


def report_claim_to_response(claim: ReportClaim):
    return {
        "id": claim.id,
        "standard": claim.standard,
        "topic": claim.topic,
        "claim_text": claim.claim_text,
        "source_excerpt": claim.source_excerpt or "",
        "source_page": int(claim.source_page) if claim.source_page and str(claim.source_page).isdigit() else None,
        "ai_confidence": claim.ai_confidence,
        "verification_status": claim.verification_status,
    }


@app.get("/api/projects/{project_id}/report-claims")
def get_project_report_claims(
    project_id: str,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["Developer", "Consultant", "Lender", "Regulator", "Admin"])),
):
    rows = (
        db.query(ReportClaim)
        .filter(ReportClaim.project_id == project_id)
        .order_by(ReportClaim.created_at.desc())
        .all()
    )
    return [report_claim_to_response(row) for row in rows]


@app.get("/api/documents/{document_id}/report-claims")
def get_document_report_claims(
    document_id: str,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["Developer", "Consultant", "Lender", "Regulator", "Admin"])),
):
    rows = (
        db.query(ReportClaim)
        .filter(ReportClaim.document_id == document_id)
        .order_by(ReportClaim.created_at.desc())
        .all()
    )
    return [report_claim_to_response(row) for row in rows]
