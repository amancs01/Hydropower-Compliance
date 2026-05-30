from typing import Any, Dict, List

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


class ModelFinding(BaseModel):
    score: int
    severity: str
    title: str
    missing_requirements: List[str]
    partial_compliance: List[str]
    risks: List[str]
    recommended_actions: List[str]
    evidence: List[EvidenceSnippet]


class ModelComplianceOutput(BaseModel):
    summary: str
    ps1: ModelFinding
    ps5: ModelFinding
    ps7: ModelFinding


class DocumentInfo(BaseModel):
    id: str
    filename: str
    pages: int
    text_length: int
    contains_nepali: bool


class ScoreSummary(BaseModel):
    ps1: int
    ps5: int
    ps7: int
    overall: int
    risk_level: str


class ComplianceFindingResponse(BaseModel):
    standard: str
    score: int
    severity: str
    title: str
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
    raw_model_used: RawModelUsed


class ErrorResponse(BaseModel):
    status: str = "error"
    error_code: str
    message: str
    details: Dict[str, Any] = {}
