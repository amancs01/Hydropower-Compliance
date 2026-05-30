from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from database.models import (
    ControversyFlag,
    AuditLog,
    LenderTrustReport,
    ManualVerificationTask,
    ReportClaim,
    ValidationResponse,
)


def make_reference_number(project_id: str) -> str:
    stamp = datetime.utcnow().strftime("%y%m%d%H%M%S")
    return f"VAL-{project_id[:4].upper()}-{stamp}"


def default_report_claim(topic: str) -> str:
    claims = {
        "prior_information": "Project report claims affected people were informed before major activities.",
        "consultation_invitation": "Project report claims public consultation was completed.",
        "understandable_disclosure": "Project report claims disclosure was understandable to local people.",
        "inclusive_consultation": "Project report claims vulnerable and Indigenous groups were included.",
        "pressure_or_coercion": "Project report claims consultation and agreement were voluntary.",
        "compensation_fairness": "Project report claims compensation was completed fairly.",
        "unresolved_land_disputes": "Project report claims no unresolved land disputes exist.",
        "worker_report_trust_concern": "Project labor and safety report claims worker issues are accurately reported.",
        "hidden_worker_issues": "Project report claims accidents, wage delays, and worker complaints are properly disclosed.",
        "safety_training": "Project report claims workers received safety training.",
        "ppe_provided": "Project report claims workers received proper protective equipment.",
        "accident_reporting_honesty": "Project report claims accidents are honestly recorded.",
        "fear_of_retaliation": "Project report claims the grievance mechanism can be used safely.",
        "worker_retaliation_fear": "Project report claims worker grievance channels can be used safely.",
        "report_trust_concern": "Project report claims environmental and social information is complete.",
    }
    return claims.get(topic, "Project report contains a claim that requires validation against feedback.")


def negative_answer(answer: str) -> bool:
    value = answer.strip().lower()
    return value in {
        "no",
        "partly",
        "not sure",
        "sometimes",
        "sometimes delayed",
        "often delayed",
        "not paid fully",
        "not paid yet",
        "only briefly",
        "never",
        "some people are afraid",
        "some workers are afraid",
        "prefer not to say",
    }


def severity_for(weight: str) -> str:
    return {
        "critical": "Critical",
        "high": "High",
        "medium": "Medium",
        "low": "Low",
    }.get((weight or "").lower(), "Medium")


def method_for(respondent_type: str, topic: str) -> str:
    if respondent_type == "worker":
        return "worker_call"
    if topic in {"compensation_fairness", "unresolved_land_disputes"}:
        return "community_call"
    return "community_call"


def create_report_claim_if_needed(db: Session, project_id: str, standard: str, topic: str, claim_text: str):
    claim = (
        db.query(ReportClaim)
        .filter(ReportClaim.project_id == project_id, ReportClaim.topic == topic)
        .first()
    )
    if claim:
        return claim
    claim = ReportClaim(
        project_id=project_id,
        standard=standard,
        topic=topic,
        claim_text=claim_text,
        source_excerpt=claim_text,
        ai_confidence=65,
        verification_status="document_claim_only",
    )
    db.add(claim)
    db.flush()
    return claim


def create_manual_task(db: Session, controversy: ControversyFlag):
    existing = (
        db.query(ManualVerificationTask)
        .filter(ManualVerificationTask.controversy_id == controversy.id)
        .first()
    )
    if existing:
        return existing

    due = (datetime.utcnow() + timedelta(days=14)).date().isoformat()
    task = ManualVerificationTask(
        project_id=controversy.project_id,
        controversy_id=controversy.id,
        assigned_to="Verification team",
        verification_method=method_for("worker" if controversy.standard == "PS2" else "community", controversy.topic),
        contact_target="Community or worker representative",
        question_to_verify=f"Verify contested claim: {controversy.contradiction_summary}",
        required_evidence=controversy.recommended_verification,
        status="open",
        due_date=due,
    )
    db.add(task)
    db.flush()
    return task


def detect_controversies(db: Session, project_id: str, responses_with_questions):
    created = []
    important_topics = {
        "report_trust_concern",
        "worker_report_trust_concern",
        "hidden_worker_issues",
        "fear_of_retaliation",
        "worker_retaliation_fear",
        "compensation_fairness",
        "unresolved_land_disputes",
        "safety_training",
        "ppe_provided",
        "accident_reporting_honesty",
        "timely_payment",
    }

    for response, question in responses_with_questions:
        answer = response.answer
        topic = question.topic
        should_flag = topic in important_topics and negative_answer(answer)
        if question.answer_type == "yes_no_with_followup" and answer.lower() == "yes":
            should_flag = True
        if topic in {"fear_of_retaliation", "worker_retaliation_fear"} and "afraid" in answer.lower():
            should_flag = True
        if not should_flag:
            continue

        claim = create_report_claim_if_needed(
            db,
            project_id,
            question.linked_standard or "PS1",
            topic,
            default_report_claim(topic),
        )
        claim.verification_status = "manual_verification_required"

        existing = (
            db.query(ControversyFlag)
            .filter(ControversyFlag.project_id == project_id, ControversyFlag.topic == topic, ControversyFlag.status != "resolved")
            .first()
        )
        if existing:
            continue

        controversy = ControversyFlag(
            project_id=project_id,
            report_claim_id=claim.id,
            standard=(question.linked_standard or "PS1").split("/")[0].strip(),
            topic=topic,
            severity=severity_for(question.risk_weight),
            report_claim=claim.claim_text,
            human_feedback_summary=f"Validation answer for '{question.question_text}': {answer}",
            contradiction_summary="Feedback may not align with the project report claim. Manual verification is required before lender trust conclusions.",
            recommended_verification=recommended_evidence_for(topic),
            status="open",
        )
        db.add(controversy)
        db.flush()
        create_manual_task(db, controversy)
        db.add(AuditLog(
            project_id=project_id,
            actor="HydroComply trust engine",
            actor_role="System",
            action="Controversy created",
            entity_type="controversy",
            entity_id=controversy.id,
            detail=f"{controversy.standard} {topic} marked as contested claim requiring manual verification.",
        ))
        db.add(AuditLog(
            project_id=project_id,
            actor="HydroComply trust engine",
            actor_role="System",
            action="Manual verification task created",
            entity_type="controversy",
            entity_id=controversy.id,
            detail=f"Manual verification task created for {controversy.standard} {topic}.",
        ))
        created.append(controversy)

    return created


def recommended_evidence_for(topic: str) -> str:
    if "compensation" in topic or "land" in topic:
        return "Compensation register, affected household list, payment proof, and independent community confirmation."
    if "safety" in topic or "ppe" in topic or "accident" in topic:
        return "Safety training records, PPE issue logs, accident register, contractor records, and worker representative confirmation."
    if "retaliation" in topic or "grievance" in topic:
        return "Grievance logs, anonymous worker/community confirmation, and evidence that complaints can be raised safely."
    if "consultation" in topic or "information" in topic:
        return "Meeting minutes, attendance sheets, photos, local-language disclosure materials, and independent community confirmation."
    return "Document request, representative call, photo/GPS evidence request, or field visit."


def validation_score(responses):
    if not responses:
        return None
    score = 100
    for response in responses:
        if negative_answer(response.answer):
            score -= 8
    return max(0, min(100, score))


def build_lender_trust_report(db: Session, project_id: str):
    controversies = db.query(ControversyFlag).filter(ControversyFlag.project_id == project_id).all()
    responses = db.query(ValidationResponse).filter(ValidationResponse.project_id == project_id).all()
    community = [item for item in responses if item.respondent_type in {"community", "both"}]
    worker = [item for item in responses if item.respondent_type in {"worker", "both"}]
    open_items = [item for item in controversies if item.status not in {"resolved", "dismissed"}]
    critical_open = [item for item in open_items if item.severity == "Critical"]

    community_score = validation_score(community)
    worker_score = validation_score(worker)
    manual_score = max(0, 100 - len(open_items) * 12)
    document_score = 70
    final_score = round(
        document_score * 0.4
        + (community_score if community_score is not None else 70) * 0.25
        + (worker_score if worker_score is not None else 70) * 0.2
        + manual_score * 0.15
    )
    final_risk = "High" if critical_open else "Medium" if open_items else "Low"
    recommendation = "Ready for lender review"
    if critical_open:
        recommendation = "High risk: unresolved community/worker contradictions"
    elif open_items:
        recommendation = "Manual verification required before financing"
    elif final_score < 75:
        recommendation = "Conditional review after evidence update"

    report = LenderTrustReport(
        project_id=project_id,
        community_validation_score=community_score,
        worker_validation_score=worker_score,
        manual_verification_score=manual_score,
        final_trust_score=final_score,
        final_risk_level=final_risk,
        summary="Trust report combines document claims, community/worker feedback, and manual verification status.",
        unresolved_controversies_count=len(open_items),
        funding_recommendation=recommendation,
    )
    db.add(report)
    db.flush()
    return report
