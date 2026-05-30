import json

from fastapi import Depends, FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from config import settings
from database.connection import get_db
from database.models import ComplianceAnalysis, ComplianceFinding, Document, DocumentChunk, IFCRequirement, Project
from database.seed import ensure_seed_schema
from routes import action_routes, audit_routes, evidence_routes, grievance_routes, project_routes, validation_routes
from schemas import ComplianceAnalyzeResponse, PdfExtractResponse
from services.chunk_service import chunk_pages, chunks_to_context, select_relevant_chunks
from services.compliance_service import IFC_REQUIREMENTS, analyze_with_groq
from services.fallback_service import fallback_analysis
from services.groq_service import GroqAPIError, ModelJSONParseError
from services.language_service import contains_devanagari
from services.pdf_service import extract_pdf_pages, is_text_too_short
from services.scoring_service import scores_from_model
from services.translation_service import translate_context_if_needed


app = FastAPI(title="HydroComply AI Backend", version="0.2.0")

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
        ps5_score=scores["ps5"],
        ps7_score=scores["ps7"],
        overall_score=scores["overall"],
        risk_level=scores["risk_level"],
        summary=model_result.summary,
        model_used=model_used,
        verification_status="ai_generated",
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    findings = []
    for standard, finding in [
        ("PS1", model_result.ps1),
        ("PS5", model_result.ps5),
        ("PS7", model_result.ps7),
    ]:
        db_finding = ComplianceFinding(
            project_id=project.id,
            analysis_id=analysis.id,
            standard=standard,
            score=finding.score,
            severity=finding.severity,
            title=finding.title,
            description=finding.title,
            missing_requirements_json=json.dumps(finding.missing_requirements),
            partial_compliance_json=json.dumps(finding.partial_compliance),
            risks_json=json.dumps(finding.risks),
            recommended_actions_json=json.dumps(finding.recommended_actions),
            evidence_json=json.dumps([item.dict() for item in finding.evidence]),
            verification_status="ai_generated",
        )
        db.add(db_finding)
        findings.append(finding_to_response(standard, finding))

    db.commit()

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
        "raw_model_used": {
            "translation_model": settings.groq_translation_model if contains_nepali else "not_used",
            "compliance_model": model_used,
        },
    }


@app.get("/api/compliance/analyses/{analysis_id}", response_model=ComplianceAnalyzeResponse)
def get_analysis(analysis_id: str, db: Session = Depends(get_db)):
    analysis = db.query(ComplianceAnalysis).filter(ComplianceAnalysis.id == analysis_id).first()
    if not analysis:
        return error_response("NOT_FOUND", "Analysis not found.", 404)

    document = db.query(Document).filter(Document.id == analysis.document_id).first()
    if not document:
        return error_response("NOT_FOUND", "Analysis document not found.", 404)
    findings = [
        {
            "standard": finding.standard,
            "score": finding.score,
            "severity": finding.severity,
            "title": finding.title,
            "missing_requirements": json.loads(finding.missing_requirements_json),
            "partial_compliance": json.loads(finding.partial_compliance_json),
            "risks": json.loads(finding.risks_json),
            "recommended_actions": json.loads(finding.recommended_actions_json),
            "evidence": json.loads(finding.evidence_json),
        }
        for finding in analysis.findings
    ]

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
            "ps5": analysis.ps5_score,
            "ps7": analysis.ps7_score,
            "overall": analysis.overall_score,
            "risk_level": analysis.risk_level,
        },
        "summary": analysis.summary,
        "findings": findings,
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
        "title": finding.title,
        "missing_requirements": finding.missing_requirements,
        "partial_compliance": finding.partial_compliance,
        "risks": finding.risks,
        "recommended_actions": finding.recommended_actions,
        "evidence": [item.dict() for item in finding.evidence],
    }
