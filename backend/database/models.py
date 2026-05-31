import uuid
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from database.connection import Base


def new_id() -> str:
    return str(uuid.uuid4())


class Project(Base):
    """Main hydropower project profile."""

    __tablename__ = "projects"

    id = Column(String(80), primary_key=True, default=new_id)
    name = Column(String(255), nullable=False)
    normalized_name = Column(String(255), nullable=True)
    project_type = Column(String(100), nullable=True)
    capacity_mw = Column(String(50), nullable=True)
    river = Column(String(255), nullable=True)
    river_or_basin = Column(String(255), nullable=True)
    district = Column(String(255), nullable=True)
    district_or_region = Column(String(255), nullable=True)
    province = Column(String(255), nullable=True)
    promoter = Column(String(255), nullable=True)
    status = Column(String(255), nullable=True)
    cod = Column(String(255), nullable=True)
    report_type_available = Column(String(100), nullable=True)
    report_status = Column(String(100), nullable=True)
    baseline_status = Column(String(100), nullable=True)
    metadata_confidence = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    risk_theme = Column(Text, nullable=True)
    source_note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ProjectBaseline(Base):
    """Initial research-based or demo baseline before new documents are added."""

    __tablename__ = "project_baselines"

    id = Column(String(80), primary_key=True, default=new_id)
    project_id = Column(String(80), ForeignKey("projects.id"), nullable=False)
    baseline_type = Column(String(100), nullable=False)
    summary = Column(Text, nullable=False)
    source_quality = Column(String(255), nullable=False)
    assumption_level = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Document(Base):
    """Uploaded EIA, IEE, ESMP, RAP, monitoring report, or grievance log."""

    __tablename__ = "documents"

    id = Column(String(80), primary_key=True, default=new_id)
    project_id = Column(String(80), ForeignKey("projects.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=True)
    file_size = Column(Integer, nullable=True)
    mime_type = Column(String(255), nullable=True)
    sha256_hash = Column(String(64), nullable=True)
    document_type = Column(String(100), nullable=True)
    file_path = Column(Text, nullable=True)
    pages = Column(Integer, default=0)
    text_length = Column(Integer, default=0)
    contains_nepali = Column(Boolean, default=False)
    uploaded_by = Column(String(255), default="Demo user")
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    upload_status = Column(String(100), default="uploaded")
    verification_status = Column(String(100), default="uploaded")
    created_at = Column(DateTime, default=datetime.utcnow)


class DocumentChunk(Base):
    """Extracted PDF text chunks with page references."""

    __tablename__ = "document_chunks"

    id = Column(String(80), primary_key=True, default=new_id)
    document_id = Column(String(80), ForeignKey("documents.id"), nullable=False)
    project_id = Column(String(80), ForeignKey("projects.id"), nullable=False)
    page_number = Column(Integer, nullable=False)
    chunk_index = Column(Integer, nullable=False)
    text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class IFCRequirement(Base):
    """IFC requirement text used by the local demo and future admin UI."""

    __tablename__ = "ifc_requirements"

    id = Column(String(80), primary_key=True, default=new_id)
    standard = Column(String(20), nullable=False)
    requirement_text = Column(Text, nullable=False)


class ComplianceAnalysis(Base):
    """AI, baseline, or human compliance analysis for a project/document."""

    __tablename__ = "compliance_analyses"

    id = Column(String(80), primary_key=True, default=new_id)
    project_id = Column(String(80), ForeignKey("projects.id"), nullable=False)
    document_id = Column(String(80), ForeignKey("documents.id"), nullable=True)
    analysis_type = Column(String(100), nullable=False)
    ps1_score = Column(Integer, nullable=True)
    ps2_score = Column(Integer, nullable=True)
    ps3_score = Column(Integer, nullable=True)
    ps4_score = Column(Integer, nullable=True)
    ps5_score = Column(Integer, nullable=True)
    ps6_score = Column(Integer, nullable=True)
    ps7_score = Column(Integer, nullable=True)
    ps8_score = Column(Integer, nullable=True)
    overall_score = Column(Integer, nullable=True)
    risk_level = Column(String(50), nullable=False)
    summary = Column(Text, nullable=False)
    model_used = Column(String(255), nullable=False)
    verification_status = Column(String(100), default="ai_generated")
    created_at = Column(DateTime, default=datetime.utcnow)

    findings = relationship("ComplianceFinding", back_populates="analysis")


class ComplianceFinding(Base):
    """Specific compliance finding linked to a project and analysis."""

    __tablename__ = "compliance_findings"

    id = Column(String(80), primary_key=True, default=new_id)
    project_id = Column(String(80), ForeignKey("projects.id"), nullable=False)
    analysis_id = Column(String(80), ForeignKey("compliance_analyses.id"), nullable=False)
    standard = Column(String(20), nullable=False)
    score = Column(Integer, nullable=True)
    severity = Column(String(50), nullable=False)
    analysis_status = Column(String(50), nullable=False, default="analyzed")
    evidence_coverage = Column(String(50), nullable=False, default="weak")
    confidence = Column(Integer, nullable=False, default=0)
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    missing_requirements_json = Column(Text, nullable=False)
    partial_compliance_json = Column(Text, nullable=False)
    risks_json = Column(Text, nullable=False)
    recommended_actions_json = Column(Text, nullable=False)
    evidence_json = Column(Text, nullable=False)
    verification_status = Column(String(100), default="ai_generated")
    created_at = Column(DateTime, default=datetime.utcnow)

    analysis = relationship("ComplianceAnalysis", back_populates="findings")


class ComplianceStandardResult(Base):
    """One model result per IFC Performance Standard for an analysis."""

    __tablename__ = "compliance_standard_results"

    id = Column(String(80), primary_key=True, default=new_id)
    analysis_id = Column(String(80), ForeignKey("compliance_analyses.id"), nullable=False)
    project_id = Column(String(80), ForeignKey("projects.id"), nullable=False)
    standard = Column(String(20), nullable=False)
    score = Column(Integer, nullable=True)
    risk_level = Column(String(50), nullable=True)
    analysis_status = Column(String(50), nullable=False)
    evidence_coverage = Column(String(50), nullable=False)
    confidence = Column(Integer, nullable=False, default=0)
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=True)
    missing_requirements_json = Column(Text, nullable=False)
    partial_compliance_json = Column(Text, nullable=False)
    risks_json = Column(Text, nullable=False)
    recommended_actions_json = Column(Text, nullable=False)
    evidence_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class EvidenceItem(Base):
    """Evidence records linked to IFC standards; filed is not verified."""

    __tablename__ = "evidence_items"

    id = Column(String(80), primary_key=True, default=new_id)
    project_id = Column(String(80), ForeignKey("projects.id"), nullable=False)
    document_id = Column(String(80), ForeignKey("documents.id"), nullable=True)
    finding_id = Column(String(80), ForeignKey("compliance_findings.id"), nullable=True)
    standard = Column(String(20), nullable=False)
    evidence_type = Column(String(255), nullable=False)
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=True)
    source = Column(String(255), nullable=True)
    page_reference = Column(String(80), nullable=True)
    status = Column(String(100), nullable=False)
    original_filename = Column(String(255), nullable=True)
    file_size = Column(Integer, nullable=True)
    mime_type = Column(String(255), nullable=True)
    sha256_hash = Column(String(64), nullable=True)
    uploaded_by = Column(String(255), default="Demo team")
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    verified_by = Column(String(255), nullable=True)
    confidential = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Grievance(Base):
    """Community or worker grievance. Records are never permanently deleted."""

    __tablename__ = "grievances"

    id = Column(String(80), primary_key=True, default=new_id)
    project_id = Column(String(80), ForeignKey("projects.id"), nullable=False)
    submitted_by = Column(String(255), default="Anonymous")
    anonymous = Column(Boolean, default=True)
    original_text = Column(Text, nullable=False)
    translated_text = Column(Text, nullable=True)
    ai_summary = Column(Text, nullable=False)
    category = Column(String(255), nullable=False)
    linked_standard = Column(String(20), nullable=False)
    severity = Column(String(50), nullable=False)
    confidentiality_level = Column(String(100), nullable=False)
    status = Column(String(100), nullable=False)
    reference_number = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Action(Base):
    """Accountability task created from a finding or grievance."""

    __tablename__ = "actions"

    id = Column(String(80), primary_key=True, default=new_id)
    project_id = Column(String(80), ForeignKey("projects.id"), nullable=False)
    finding_id = Column(String(80), ForeignKey("compliance_findings.id"), nullable=True)
    grievance_id = Column(String(80), ForeignKey("grievances.id"), nullable=True)
    owner = Column(String(255), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    severity = Column(String(50), nullable=True)
    status = Column(String(100), nullable=False)
    due_date = Column(String(50), nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ScoreSnapshot(Base):
    """Score history over time for lender trust review."""

    __tablename__ = "score_snapshots"

    id = Column(String(80), primary_key=True, default=new_id)
    project_id = Column(String(80), ForeignKey("projects.id"), nullable=False)
    analysis_id = Column(String(80), ForeignKey("compliance_analyses.id"), nullable=True)
    ps1_score = Column(Integer, nullable=True)
    ps5_score = Column(Integer, nullable=True)
    ps7_score = Column(Integer, nullable=True)
    overall_score = Column(Integer, nullable=True)
    risk_level = Column(String(50), nullable=True)
    reason_for_change = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class VerificationReview(Base):
    """Human verification decision for evidence, finding, grievance, analysis, or action."""

    __tablename__ = "verification_reviews"

    id = Column(String(80), primary_key=True, default=new_id)
    project_id = Column(String(80), ForeignKey("projects.id"), nullable=False)
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(String(80), nullable=False)
    reviewer_name = Column(String(255), nullable=False)
    reviewer_role = Column(String(255), nullable=False)
    decision = Column(String(100), nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class AuditLog(Base):
    """Append-only history of important events."""

    __tablename__ = "audit_logs"

    id = Column(String(80), primary_key=True, default=new_id)
    project_id = Column(String(80), ForeignKey("projects.id"), nullable=False)
    actor = Column(String(255), nullable=False)
    actor_role = Column(String(255), nullable=True)
    action = Column(String(255), nullable=False)
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(String(80), nullable=False)
    old_value = Column(Text, nullable=True)
    new_value = Column(Text, nullable=True)
    detail = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class SourceReference(Base):
    """Where project metadata or baseline assumptions came from."""

    __tablename__ = "source_references"

    id = Column(String(80), primary_key=True, default=new_id)
    project_id = Column(String(80), ForeignKey("projects.id"), nullable=False)
    source_title = Column(String(255), nullable=False)
    source_url = Column(Text, nullable=True)
    source_type = Column(String(100), nullable=False)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class ReportClaim(Base):
    """Claim extracted from a legal or project report. Claims are not treated as final truth."""

    __tablename__ = "report_claims"

    id = Column(String(80), primary_key=True, default=new_id)
    project_id = Column(String(80), ForeignKey("projects.id"), nullable=False)
    document_id = Column(String(80), ForeignKey("documents.id"), nullable=True)
    analysis_id = Column(String(80), ForeignKey("compliance_analyses.id"), nullable=True)
    standard = Column(String(20), nullable=False)
    topic = Column(String(255), nullable=False)
    claim_text = Column(Text, nullable=False)
    source_page = Column(String(50), nullable=True)
    source_excerpt = Column(Text, nullable=True)
    ai_confidence = Column(Integer, default=70)
    verification_status = Column(String(100), default="document_claim_only")
    created_at = Column(DateTime, default=datetime.utcnow)


class ValidationQuestion(Base):
    """Questionnaire question for screening, community validation, or worker validation."""

    __tablename__ = "validation_questions"

    id = Column(String(80), primary_key=True, default=new_id)
    question_set = Column(String(50), nullable=False)
    section = Column(String(255), nullable=False)
    question_text = Column(Text, nullable=False)
    answer_type = Column(String(100), nullable=False)
    options_json = Column(Text, nullable=False)
    linked_standard = Column(String(50), nullable=True)
    topic = Column(String(255), nullable=False)
    risk_weight = Column(String(50), nullable=False)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class ValidationSubmission(Base):
    """One completed validation questionnaire submission."""

    __tablename__ = "validation_submissions"

    id = Column(String(80), primary_key=True, default=new_id)
    project_id = Column(String(80), ForeignKey("projects.id"), nullable=False)
    respondent_type = Column(String(50), nullable=False)
    respondent_connection = Column(String(255), nullable=False)
    reference_number = Column(String(100), nullable=False)
    anonymous = Column(Boolean, default=True)
    status = Column(String(100), default="submitted")
    created_at = Column(DateTime, default=datetime.utcnow)


class ValidationResponse(Base):
    """Answer from a community member or worker."""

    __tablename__ = "validation_responses"

    id = Column(String(80), primary_key=True, default=new_id)
    project_id = Column(String(80), ForeignKey("projects.id"), nullable=False)
    submission_id = Column(String(80), ForeignKey("validation_submissions.id"), nullable=True)
    question_id = Column(String(80), ForeignKey("validation_questions.id"), nullable=False)
    respondent_type = Column(String(50), nullable=False)
    respondent_connection = Column(String(255), nullable=False)
    answer = Column(Text, nullable=False)
    follow_up_text = Column(Text, nullable=True)
    anonymous = Column(Boolean, default=True)
    gps_allowed = Column(Boolean, default=False)
    photo_allowed = Column(Boolean, default=False)
    location_text = Column(Text, nullable=True)
    reference_number = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class ControversyFlag(Base):
    """Possible contradiction between report claims and ground-level feedback."""

    __tablename__ = "controversy_flags"

    id = Column(String(80), primary_key=True, default=new_id)
    project_id = Column(String(80), ForeignKey("projects.id"), nullable=False)
    report_claim_id = Column(String(80), ForeignKey("report_claims.id"), nullable=True)
    standard = Column(String(20), nullable=False)
    topic = Column(String(255), nullable=False)
    severity = Column(String(50), nullable=False)
    report_claim = Column(Text, nullable=False)
    human_feedback_summary = Column(Text, nullable=False)
    contradiction_summary = Column(Text, nullable=False)
    recommended_verification = Column(Text, nullable=False)
    status = Column(String(100), default="open")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ManualVerificationTask(Base):
    """Third-step manual checking task created from a contested claim."""

    __tablename__ = "manual_verification_tasks"

    id = Column(String(80), primary_key=True, default=new_id)
    project_id = Column(String(80), ForeignKey("projects.id"), nullable=False)
    controversy_id = Column(String(80), ForeignKey("controversy_flags.id"), nullable=False)
    assigned_to = Column(String(255), nullable=False)
    verification_method = Column(String(100), nullable=False)
    contact_target = Column(String(255), nullable=True)
    question_to_verify = Column(Text, nullable=False)
    required_evidence = Column(Text, nullable=False)
    status = Column(String(100), default="open")
    due_date = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ManualVerificationNote(Base):
    """Result or note from manual verification."""

    __tablename__ = "manual_verification_notes"

    id = Column(String(80), primary_key=True, default=new_id)
    task_id = Column(String(80), ForeignKey("manual_verification_tasks.id"), nullable=False)
    verifier_name = Column(String(255), nullable=False)
    verifier_role = Column(String(255), nullable=False)
    call_summary = Column(Text, nullable=True)
    evidence_received = Column(Text, nullable=True)
    decision = Column(String(100), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class LenderTrustReport(Base):
    """Final lender-facing trust report after document, feedback, and manual verification layers."""

    __tablename__ = "lender_trust_reports"

    id = Column(String(80), primary_key=True, default=new_id)
    project_id = Column(String(80), ForeignKey("projects.id"), nullable=False)
    document_analysis_id = Column(String(80), ForeignKey("compliance_analyses.id"), nullable=True)
    community_validation_score = Column(Integer, nullable=True)
    worker_validation_score = Column(Integer, nullable=True)
    manual_verification_score = Column(Integer, nullable=True)
    final_trust_score = Column(Integer, nullable=False)
    final_risk_level = Column(String(50), nullable=False)
    summary = Column(Text, nullable=False)
    unresolved_controversies_count = Column(Integer, default=0)
    funding_recommendation = Column(Text, nullable=False)
    financing_gate = Column(String(100), nullable=False, default="Manual verification required")
    blocker_summary = Column(Text, nullable=True)
    required_next_steps = Column(Text, nullable=True)
    evidence_trust_level = Column(String(50), nullable=False, default="Low")
    created_at = Column(DateTime, default=datetime.utcnow)
