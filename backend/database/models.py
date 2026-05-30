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
    capacity_mw = Column(String(50), nullable=True)
    river = Column(String(255), nullable=True)
    district = Column(String(255), nullable=True)
    province = Column(String(255), nullable=True)
    promoter = Column(String(255), nullable=True)
    status = Column(String(255), nullable=True)
    cod = Column(String(255), nullable=True)
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
    document_type = Column(String(100), nullable=True)
    file_path = Column(Text, nullable=True)
    pages = Column(Integer, default=0)
    text_length = Column(Integer, default=0)
    contains_nepali = Column(Boolean, default=False)
    uploaded_by = Column(String(255), default="Demo user")
    upload_status = Column(String(100), default="uploaded")
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
    overall_score = Column(Integer, nullable=False)
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
    score = Column(Integer, nullable=False)
    severity = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    missing_requirements_json = Column(Text, nullable=False)
    partial_compliance_json = Column(Text, nullable=False)
    risks_json = Column(Text, nullable=False)
    recommended_actions_json = Column(Text, nullable=False)
    evidence_json = Column(Text, nullable=False)
    verification_status = Column(String(100), default="ai_generated")
    created_at = Column(DateTime, default=datetime.utcnow)

    analysis = relationship("ComplianceAnalysis", back_populates="findings")


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
    uploaded_by = Column(String(255), default="Demo team")
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
    ps1_score = Column(Integer, nullable=False)
    ps5_score = Column(Integer, nullable=False)
    ps7_score = Column(Integer, nullable=False)
    overall_score = Column(Integer, nullable=False)
    risk_level = Column(String(50), nullable=False)
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
