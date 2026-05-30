from typing import Any, Dict, List, Literal, Optional

from pydantic import BaseModel


class PageText(BaseModel):
    page: int
    text: str


class PdfExtractResponse(BaseModel):
    filename: str
    pages: int
    text_length: int
    preview: str
    pages_text: List[PageText]


class EvidenceSnippet(BaseModel):
    text: str
    page: int


class ReportClaimOutput(BaseModel):
    id: Optional[str] = None
    standard: str
    topic: str
    claim_text: str
    source_excerpt: str = ""
    source_page: Optional[int] = None
    ai_confidence: int = 0
    verification_status: str = "document_claim_only"


class ModelFinding(BaseModel):
    standard: Optional[str] = None
    score: Optional[int] = None
    severity: str
    analysis_status: Literal["analyzed", "insufficient_evidence", "not_applicable"] = "analyzed"
    evidence_coverage: Literal["strong", "moderate", "weak", "insufficient"] = "weak"
    confidence: int = 0
    title: str
    summary: str = ""
    missing_requirements: List[str]
    partial_compliance: List[str]
    risks: List[str]
    recommended_actions: List[str]
    evidence: List[EvidenceSnippet]


class ModelComplianceOutput(BaseModel):
    summary: str
    ps1: ModelFinding
    ps2: ModelFinding
    ps3: ModelFinding
    ps4: ModelFinding
    ps5: ModelFinding
    ps6: ModelFinding
    ps7: ModelFinding
    ps8: ModelFinding
    report_claims: List[ReportClaimOutput] = []
    analysis_source: Optional[str] = None
    note: Optional[str] = None


class DocumentInfo(BaseModel):
    id: str
    filename: str
    original_filename: Optional[str] = None
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    sha256_hash: Optional[str] = None
    uploaded_at: Optional[str] = None
    verification_status: Optional[str] = None
    pages: int
    text_length: int
    contains_nepali: bool


class ScoreSummary(BaseModel):
    ps1: Optional[int] = None
    ps2: Optional[int] = None
    ps3: Optional[int] = None
    ps4: Optional[int] = None
    ps5: Optional[int] = None
    ps6: Optional[int] = None
    ps7: Optional[int] = None
    ps8: Optional[int] = None
    overall: Optional[int] = None
    risk_level: str
    analyzed_count: int = 0
    total_standards: int = 8
    overall_confidence: str = "low"
    coverage_note: str = ""


class ComplianceFindingResponse(BaseModel):
    standard: str
    score: Optional[int] = None
    severity: str
    analysis_status: str = "analyzed"
    evidence_coverage: str = "weak"
    confidence: int = 0
    title: str
    summary: str = ""
    missing_requirements: List[str]
    partial_compliance: List[str]
    risks: List[str]
    recommended_actions: List[str]
    evidence: List[EvidenceSnippet]


class RawModelUsed(BaseModel):
    translation_model: str
    compliance_model: str


class ComplianceAnalyzeResponse(BaseModel):
    status: str
    analysis_id: str
    document: DocumentInfo
    scores: ScoreSummary
    summary: str
    findings: List[ComplianceFindingResponse]
    report_claims: List[ReportClaimOutput] = []
    actions_created: int = 0
    raw_model_used: RawModelUsed


class ErrorResponse(BaseModel):
    status: str = "error"
    error_code: str
    message: str
    details: Dict[str, Any] = {}
