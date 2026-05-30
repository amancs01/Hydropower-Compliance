from dataclasses import dataclass
from typing import Dict, List

from schemas import PageText


CHUNK_SIZE_CHARS = 7000
MAX_CONTEXT_CHARS = 32000

PS_KEYWORDS: Dict[str, List[str]] = {
    "PS1": [
        "esms", "environmental and social management", "stakeholder engagement",
        "grievance mechanism", "monitoring", "corrective action", "management plan",
        "consultation", "disclosure", "risk assessment", "environmental management",
        "social management",
    ],
    "PS5": [
        "land acquisition", "compensation", "replacement cost", "resettlement",
        "livelihood restoration", "affected household", "displacement", "rap",
        "payment", "landowner", "acquisition", "private land", "community forest",
        "grievance",
    ],
    "PS7": [
        "indigenous", "janajati", "ethnic", "limbu", "rai", "tamang", "magar",
        "gurung", "newar", "fpic", "free prior informed consent",
        "indigenous peoples plan", "ipp", "consultation", "benefit sharing",
        "cultural identity",
    ],
}


@dataclass
class TextChunk:
    page_number: int
    chunk_index: int
    text: str


def chunk_pages(pages: List[PageText]) -> List[TextChunk]:
    """Create page-aware chunks that can later be replaced by vector retrieval."""

    chunks = []
    chunk_index = 0
    for page in pages:
        text = page.text.strip()
        for start in range(0, len(text), CHUNK_SIZE_CHARS):
            part = text[start:start + CHUNK_SIZE_CHARS].strip()
            if part:
                chunks.append(TextChunk(page_number=page.page, chunk_index=chunk_index, text=part))
                chunk_index += 1
    return chunks


def select_relevant_chunks(chunks: List[TextChunk]) -> List[TextChunk]:
    """Select chunks that mention PS1, PS5, or PS7 topics using simple keywords."""

    scored = []
    all_keywords = [keyword for keywords in PS_KEYWORDS.values() for keyword in keywords]
    for chunk in chunks:
        lower = chunk.text.lower()
        score = sum(1 for keyword in all_keywords if keyword in lower)
        if score:
            scored.append((score, chunk))

    selected = [chunk for _, chunk in sorted(scored, key=lambda item: item[0], reverse=True)]
    if not selected:
        selected = chunks[:5]

    output = []
    size = 0
    for chunk in selected:
        if size + len(chunk.text) > MAX_CONTEXT_CHARS:
            break
        output.append(chunk)
        size += len(chunk.text)
    return output


def chunks_to_context(chunks: List[TextChunk]) -> str:
    return "\n\n".join(f"[Page {chunk.page_number}]\n{chunk.text}" for chunk in chunks)
