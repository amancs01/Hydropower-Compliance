import json

from groq import Groq

from config import settings
from schemas import ModelComplianceOutput


class ModelJSONParseError(Exception):
    pass


class GroqAPIError(Exception):
    pass


def run_groq_chat(model: str, system_prompt: str, user_prompt: str) -> str:
    """Call Groq chat completions. The API key stays server-side."""

    try:
        client = Groq(api_key=settings.groq_api_key)
        completion = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.1,
        )
        return completion.choices[0].message.content or ""
    except Exception as exc:
        raise GroqAPIError(str(exc)) from exc


def parse_model_json(text: str) -> ModelComplianceOutput:
    """Parse strict JSON even if a model adds fences or extra text."""

    cleaned = (text or "").strip()
    cleaned = cleaned.replace("```json", "").replace("```", "").strip()

    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ModelJSONParseError("No JSON object found in model output.")

    json_text = cleaned[start:end + 1]
    try:
        payload = json.loads(json_text)
        return ModelComplianceOutput.parse_obj(payload)
    except Exception as exc:
        raise ModelJSONParseError(str(exc)) from exc
