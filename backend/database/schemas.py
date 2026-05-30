from typing import Optional

from pydantic import BaseModel


class ProjectCreate(BaseModel):
    name: str
    capacity_mw: Optional[str] = None
    river: Optional[str] = None
    district: Optional[str] = None
    province: Optional[str] = None
    promoter: Optional[str] = None
    status: Optional[str] = None
    cod: Optional[str] = None
    description: Optional[str] = None
    risk_theme: Optional[str] = None
    source_note: Optional[str] = "manual_entry"


class BaselineCreate(BaseModel):
    baseline_type: str = "manual_review"
    summary: str
    source_quality: str = "manual_entry"
    assumption_level: str = "requires_human_verification"


class FindingCreate(BaseModel):
    analysis_id: str
    standard: str
    score: int
    severity: str
    title: str
    description: Optional[str] = None
    missing_requirements_json: str = "[]"
    partial_compliance_json: str = "[]"
    risks_json: str = "[]"
    recommended_actions_json: str = "[]"
    evidence_json: str = "[]"
    verification_status: str = "pending_review"


class EvidenceCreate(BaseModel):
    standard: str
    evidence_type: str
    title: str
    summary: Optional[str] = None
    source: Optional[str] = None
    page_reference: Optional[str] = None
    status: str = "filed"
    uploaded_by: str = "Demo team"
    confidential: bool = False


class GrievanceCreate(BaseModel):
    submitted_by: str = "Anonymous"
    anonymous: bool = True
    original_text: str
    translated_text: Optional[str] = None
    ai_summary: str
    category: str
    linked_standard: str
    severity: str
    confidentiality_level: str = "Private"
    status: str = "new"
    reference_number: str


class ActionCreate(BaseModel):
    finding_id: Optional[str] = None
    grievance_id: Optional[str] = None
    owner: str
    title: str
    description: Optional[str] = None
    severity: Optional[str] = None
    status: str = "open"
    due_date: Optional[str] = None


class VerificationReviewCreate(BaseModel):
    entity_type: str
    entity_id: str
    reviewer_name: str
    reviewer_role: str
    decision: str
    comment: Optional[str] = None


class ScoreSnapshotCreate(BaseModel):
    analysis_id: Optional[str] = None
    ps1_score: int
    ps5_score: int
    ps7_score: int
    overall_score: int
    risk_level: str
    reason_for_change: str
