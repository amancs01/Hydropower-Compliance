from typing import List, Optional

from pydantic import BaseModel


class ProjectCreate(BaseModel):
    name: str
    normalized_name: Optional[str] = None
    project_type: Optional[str] = None
    capacity_mw: Optional[str] = None
    river: Optional[str] = None
    river_or_basin: Optional[str] = None
    district: Optional[str] = None
    district_or_region: Optional[str] = None
    province: Optional[str] = None
    promoter: Optional[str] = None
    status: Optional[str] = None
    cod: Optional[str] = None
    report_type_available: Optional[str] = None
    report_status: Optional[str] = None
    baseline_status: Optional[str] = None
    metadata_confidence: Optional[str] = None
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
    original_filename: Optional[str] = None
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    sha256_hash: Optional[str] = None
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
    ps1_score: Optional[int] = None
    ps5_score: Optional[int] = None
    ps7_score: Optional[int] = None
    overall_score: Optional[int] = None
    risk_level: Optional[str] = None
    reason_for_change: str


class ValidationAnswerCreate(BaseModel):
    question_id: str
    answer: str
    follow_up_text: Optional[str] = None


class ValidationSubmissionCreate(BaseModel):
    respondent_type: str
    respondent_connection: str
    answers: List[ValidationAnswerCreate]
    anonymous: bool = True
    gps_allowed: bool = False
    photo_allowed: bool = False
    location_text: Optional[str] = None


class ManualVerificationTaskCreate(BaseModel):
    assigned_to: str = "Verification team"
    verification_method: str
    contact_target: Optional[str] = None
    question_to_verify: str
    required_evidence: str
    due_date: Optional[str] = None


class ManualVerificationNoteCreate(BaseModel):
    verifier_name: str
    verifier_role: str
    call_summary: Optional[str] = None
    evidence_received: Optional[str] = None
    decision: str
    notes: Optional[str] = None


class LenderTrustReportOutput(BaseModel):
    id: str
    project_id: str
    community_validation_score: Optional[int] = None
    worker_validation_score: Optional[int] = None
    manual_verification_score: Optional[int] = None
    final_trust_score: int
    final_risk_level: str
    summary: str
    unresolved_controversies_count: int = 0
    funding_recommendation: str
    financing_gate: str
    blocker_summary: Optional[str] = None
    required_next_steps: Optional[str] = None
    evidence_trust_level: str
