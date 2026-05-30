import fitz

from schemas import PageText


MIN_EXTRACTED_TEXT_LENGTH = 50


def extract_pdf_pages(pdf_bytes: bytes):
    """Extract selectable text from every PDF page using PyMuPDF."""

    if not pdf_bytes:
        raise ValueError("EMPTY_FILE")

    try:
        document = fitz.open(stream=pdf_bytes, filetype="pdf")
    except Exception as exc:
        raise ValueError("PDF_EXTRACTION_ERROR") from exc

    pages_text = []
    try:
        for page_index in range(document.page_count):
            page = document.load_page(page_index)
            text = page.get_text("text").strip()
            pages_text.append(PageText(page=page_index + 1, text=text))
    finally:
        document.close()

    full_text = "\n\n".join(page.text for page in pages_text).strip()
    return pages_text, full_text


def is_text_too_short(text: str) -> bool:
    return len((text or "").strip()) < MIN_EXTRACTED_TEXT_LENGTH
