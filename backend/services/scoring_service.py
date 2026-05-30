from schemas import ModelComplianceOutput, ModelFinding


STANDARD_KEYS = ["ps1", "ps2", "ps3", "ps4", "ps5", "ps6", "ps7", "ps8"]


def clamp_score(score: int) -> int:
    return max(0, min(100, int(score)))


def model_findings(result: ModelComplianceOutput):
    return [(key, getattr(result, key)) for key in STANDARD_KEYS]


def is_analyzed(finding: ModelFinding) -> bool:
    return finding.analysis_status == "analyzed" and finding.score is not None


def confidence_label(analyzed_count: int) -> str:
    if analyzed_count <= 3:
        return "low"
    if analyzed_count <= 6:
        return "medium"
    return "high"


def risk_level_for(scores):
    if not scores:
        return "Unknown"
    if any(score < 30 for score in scores):
        return "High"
    overall = round(sum(scores) / len(scores))
    if overall >= 80:
        return "Low"
    if overall >= 50:
        return "Medium"
    return "High"


def scores_from_model(result: ModelComplianceOutput):
    analyzed_scores = []
    output = {}

    for key, finding in model_findings(result):
        if is_analyzed(finding):
            score = clamp_score(finding.score)
            output[key] = score
            analyzed_scores.append(score)
        else:
            output[key] = None

    analyzed_count = len(analyzed_scores)
    overall = round(sum(analyzed_scores) / analyzed_count) if analyzed_count else None
    risk_level = risk_level_for(analyzed_scores)
    output.update({
        "overall": overall,
        "risk_level": risk_level,
        "analyzed_count": analyzed_count,
        "total_standards": len(STANDARD_KEYS),
        "overall_confidence": confidence_label(analyzed_count),
        "coverage_note": (
            f"{analyzed_count} of {len(STANDARD_KEYS)} standards were analyzed. "
            "Remaining standards require additional documents or manual review."
        ),
    })
    return output
