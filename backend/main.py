import json
import logging

from fastapi import Depends, FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from config import settings
from database.connection import get_db
from database.models import AuditLog, ComplianceAnalysis, ComplianceFinding, ComplianceStandardResult, Document, DocumentChunk, IFCRequirement, Project, ReportClaim
from database.seed import ensure_seed_schema
from routes import action_routes, audit_routes, evidence_routes, grievance_routes, project_routes, validation_routes
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(project_routes.router)
app.include_router(evidence_routes.router)
app.include_router(grievance_routes.router)
app.include_router(action_routes.router)
app.include_router(audit_routes.router)
app.include_router(validation_routes.router)


@app.on_event("startup")
def startup():
    ensure_seed_schema()


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
def api_health():
    return {"status": "ok"}


@app.post("/api/pdf/extract", response_model=PdfExtractResponse)
async def extract_pdf(file: UploadFile = File(...)):
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
async def analyze_compliance_pdf(file: UploadFile = File(...), db: Session = Depends(get_db)):
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
    project = get_or_create_demo_project(db)

    document = Document(
        project_id=project.id,
        filename=file.filename or "uploaded.pdf",
        document_type="uploaded_pdf",
        pages=len(pages_text),
        text_length=len(full_text),
        contains_nepali=contains_nepali,
        uploaded_by="Frontend user",
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
    for key in STANDARD_KEYS:
        standard = key.upper()
        finding = getattr(model_result, key)
        finding.standard = finding.standard or standard
        result_payload = {
            "project_id": project.id,
            "analysis_id": analysis.id,
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
        if finding.analysis_status == "analyzed" and finding.score is not None:
            db_finding = ComplianceFinding(
                **result_payload,
                description=finding.summary or finding.title,
                verification_status="ai_generated",
            )
            db.add(db_finding)
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
    db.commit()

    analyzed_count = len([finding for finding in findings if finding.get("analysis_status") == "analyzed" and finding.get("score") is not None])
    overall_confidence = "low" if analyzed_count <= 3 else "medium" if analyzed_count <= 6 else "high"

    return {
        "status": "success",
        "analysis_id": str(analysis.id),
        "document": {
            "id": str(document.id),
            "filename": document.filename,
            "pages": document.pages,
            "text_length": document.text_length,
            "contains_nepali": document.contains_nepali,
        },
        "scores": scores,
        "summary": model_result.summary,
        "findings": findings,
        "report_claims": report_claims,
        "raw_model_used": {
            "translation_model": settings.groq_translation_model if contains_nepali else "not_used",
            "compliance_model": model_used,
        },
        "analysis_source": model_result.analysis_source or ("groq" if settings.groq_api_key else "local_demo_fallback"),
        "note": model_result.note,
    }


@app.get("/api/compliance/analyses/{analysis_id}", response_model=ComplianceAnalyzeResponse)
def get_analysis(analysis_id: str, db: Session = Depends(get_db)):
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
    report_claims = (
        db.query(ReportClaim)
        .filter(ReportClaim.analysis_id == analysis.id)
        .order_by(ReportClaim.created_at.desc())
        .all()
    )

    return {
        "status": "success",
        "analysis_id": str(analysis.id),
        "document": {
            "id": str(document.id),
            "filename": document.filename,
            "pages": document.pages,
            "text_length": document.text_length,
            "contains_nepali": document.contains_nepali,
        },
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
        "missing_requirements": json.loads(finding.missing_requirements_json),
        "partial_compliance": json.loads(finding.partial_compliance_json),
        "risks": json.loads(finding.risks_json),
        "recommended_actions": json.loads(finding.recommended_actions_json),
        "evidence": json.loads(finding.evidence_json),
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
def get_project_report_claims(project_id: str, db: Session = Depends(get_db)):
    rows = (
        db.query(ReportClaim)
        .filter(ReportClaim.project_id == project_id)
        .order_by(ReportClaim.created_at.desc())
        .all()
    )
    return [report_claim_to_response(row) for row in rows]


@app.get("/api/documents/{document_id}/report-claims")
def get_document_report_claims(document_id: str, db: Session = Depends(get_db)):
    rows = (
        db.query(ReportClaim)
        .filter(ReportClaim.document_id == document_id)
        .order_by(ReportClaim.created_at.desc())
        .all()
    )
    return [report_claim_to_response(row) for row in rows]
