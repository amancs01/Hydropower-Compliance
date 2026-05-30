import re


DEVANAGARI_PATTERN = re.compile(r"[\u0900-\u097F]")


def contains_devanagari(text: str) -> bool:
    """Detect Nepali / Devanagari text using the Unicode block."""

    return bool(DEVANAGARI_PATTERN.search(text or ""))
