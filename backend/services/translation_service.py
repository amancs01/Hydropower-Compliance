from config import settings
from services.groq_service import run_groq_chat


TRANSLATION_PROMPT = (
    "Translate the following Nepali or mixed Nepali-English hydropower compliance "
    "document text into clear English. Preserve technical terms, project names, dates, "
    "page references, compensation details, land acquisition details, grievance details, "
    "and community names. Return translated text only."
)


def translate_context_if_needed(context: str, contains_nepali: bool) -> str:
    """Translate only selected relevant context when Nepali text is detected."""

    if not contains_nepali:
        return context
    if not settings.groq_api_key:
        return context
    return run_groq_chat(
        model=settings.groq_translation_model,
        system_prompt=TRANSLATION_PROMPT,
        user_prompt=context,
    )
