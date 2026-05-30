from schemas import ModelComplianceOutput


def clamp_score(score: int) -> int:
    return max(0, min(100, int(score)))


def calculate_overall_score(ps1: int, ps5: int, ps7: int) -> int:
    """Backend-owned weighted score: PS1 50%, PS5 30%, PS7 20%."""

    return round(clamp_score(ps1) * 0.5 + clamp_score(ps5) * 0.3 + clamp_score(ps7) * 0.2)


def calculate_risk_level(ps1: int, ps5: int, ps7: int, overall: int) -> str:
    """Backend-owned risk logic with forced High if any PS score is below 30."""

    if min(ps1, ps5, ps7) < 30:
        return "High"
    if overall >= 80:
        return "Low"
    if overall >= 50:
        return "Medium"
    return "High"


def scores_from_model(result: ModelComplianceOutput):
    ps1 = clamp_score(result.ps1.score)
    ps5 = clamp_score(result.ps5.score)
    ps7 = clamp_score(result.ps7.score)
    overall = calculate_overall_score(ps1, ps5, ps7)
    risk_level = calculate_risk_level(ps1, ps5, ps7, overall)
    return {
        "ps1": ps1,
        "ps5": ps5,
        "ps7": ps7,
        "overall": overall,
        "risk_level": risk_level,
    }
