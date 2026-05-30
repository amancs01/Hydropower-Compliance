from dataclasses import dataclass
import logging
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
    "PS2": [
        "labor", "worker", "wage", "salary", "overtime", "contract",
        "contractor", "subcontractor", "safety training", "ppe",
        "personal protective equipment", "accident", "injury", "fatality",
        "camp", "accommodation", "child labor", "forced labor", "grievance",
        "worker grievance",
    ],
    "PS3": [
        "pollution", "waste", "spoil", "muck", "disposal", "water quality",
        "dust", "noise", "air quality", "hazardous", "chemical", "oil",
        "cement", "effluent", "wastewater", "environmental flow",
        "resource efficiency",
    ],
    "PS4": [
        "community health", "community safety", "traffic", "blasting",
        "emergency", "landslide", "flood", "dam failure", "sudden release",
        "public safety", "security personnel", "access road", "road safety",
        "nuisance",
    ],
    "PS5": [
        "land acquisition", "compensation", "replacement cost", "resettlement",
        "livelihood restoration", "affected household", "displacement", "rap",
        "payment", "landowner", "acquisition", "private land", "community forest",
        "grievance",
    ],
    "PS6": [
        "biodiversity", "aquatic ecology", "fish", "fish passage", "forest",
        "wildlife", "critical habitat", "environmental flow", "e-flow",
        "ecosystem", "conservation", "protected species", "habitat",
        "biodiversity monitoring",
    ],
    "PS7": [
        "indigenous", "janajati", "ethnic", "limbu", "rai", "tamang", "magar",
        "gurung", "newar", "fpic", "free prior informed consent",
        "indigenous peoples plan", "ipp", "consultation", "benefit sharing",
        "cultural identity",
    ],
    "PS8": [
        "cultural heritage", "temple", "cremation", "burial", "sacred",
        "shrine", "festival", "archaeological", "archaeology", "chance find",
        "chance-find", "cultural practice", "religious site",
    ],
}

logger = logging.getLogger(__name__)


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
    """Select top chunks per IFC standard, then deduplicate within context budget."""

    per_standard = {}
    selected_by_standard = {}
    selected_ids = set()

    for standard, keywords in PS_KEYWORDS.items():
        scored = []
        for chunk in chunks:
            lower = chunk.text.lower()
            score = sum(1 for keyword in keywords if keyword in lower)
            if score:
                scored.append((score, chunk))
        top_chunks = [chunk for _, chunk in sorted(scored, key=lambda item: item[0], reverse=True)[:3]]
        per_standard[standard] = len(top_chunks)
        selected_by_standard[standard] = top_chunks

    selected = []
    for rank in range(3):
        for standard in PS_KEYWORDS:
            top_chunks = selected_by_standard.get(standard, [])
            if rank < len(top_chunks):
                chunk = top_chunks[rank]
                if chunk.chunk_index not in selected_ids:
                    selected.append(chunk)
                    selected_ids.add(chunk.chunk_index)

    if not selected:
        selected = chunks[:5]
        per_standard = {standard: 0 for standard in PS_KEYWORDS}

    output = []
    size = 0
    for chunk in selected:
        if size + len(chunk.text) > MAX_CONTEXT_CHARS:
            break
        output.append(chunk)
        size += len(chunk.text)

    logger.info(
        "Chunk selection: extracted=%s selected=%s context_chars=%s per_standard=%s",
        len(chunks),
        len(output),
        size,
        per_standard,
    )
    return output


def chunks_to_context(chunks: List[TextChunk]) -> str:
    return "\n\n".join(f"[Page {chunk.page_number}]\n{chunk.text}" for chunk in chunks)
