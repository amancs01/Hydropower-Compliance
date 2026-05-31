from database.models import ComplianceStandardResult, Document
from services.scoring_service import risk_level_for


STANDARDS = [f"PS{index}" for index in range(1, 9)]


def _result_rank(result: ComplianceStandardResult):
    verified = 1 if getattr(result, "verification_status", "") in {"manually_verified", "human_verified", "verified"} else 0
    analyzed = 1 if result.analysis_status == "analyzed" and result.score is not None else 0
    return (
        verified,
        analyzed,
        result.confidence or 0,
        result.created_at,
    )


def _main_gap(result: ComplianceStandardResult) -> str:
    return result.title or "Additional evidence required."


def merged_project_compliance(db, project_id: str):
    rows = (
        db.query(ComplianceStandardResult)
        .filter(ComplianceStandardResult.project_id == project_id)
        .order_by(ComplianceStandardResult.standard, ComplianceStandardResult.created_at.desc())
        .all()
    )
    documents = {
        document.id: document
        for document in db.query(Document).filter(Document.project_id == project_id).all()
    }
    by_standard = {}
    for row in rows:
        current = by_standard.get(row.standard)
        if current is None or _result_rank(row) > _result_rank(current):
            by_standard[row.standard] = row

    standards = []
    scored_values = []
    analyzed_count = 0
    for standard in STANDARDS:
        result = by_standard.get(standard)
        if result:
            document = documents.get(result.document_id)
            if result.analysis_status == "analyzed" and result.score is not None:
                scored_values.append(result.score)
                analyzed_count += 1
            standards.append({
                "standard": standard,
                "score": result.score,
                "risk_level": result.risk_level,
                "analysis_status": result.analysis_status,
                "evidence_coverage": result.evidence_coverage,
                "confidence": result.confidence,
                "source_document_id": result.document_id,
                "source_document_name": document.filename if document else None,
                "summary": result.summary or result.title,
                "main_gap": _main_gap(result),
            })
        else:
            standards.append({
                "standard": standard,
                "score": None,
                "risk_level": None,
                "analysis_status": "insufficient_evidence",
                "evidence_coverage": "insufficient",
                "confidence": 0,
                "source_document_id": None,
                "source_document_name": None,
                "summary": "No uploaded project document contains enough evidence for this standard.",
                "main_gap": f"Insufficient evidence: upload {standard} supporting document.",
            })

    overall_score = round(sum(scored_values) / len(scored_values)) if scored_values else None
    return {
        "project_id": project_id,
        "standards": standards,
        "overall_score": overall_score,
        "risk_level": risk_level_for(scored_values),
        "coverage_note": f"{analyzed_count} of 8 standards have enough evidence from uploaded project documents.",
    }
