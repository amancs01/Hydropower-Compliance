# HydroComply Nepal

AI-powered IFC compliance intelligence demo for Nepal hydropower projects.

## Run

Open `index.html` in a browser. The app is dependency-free and stores demo changes in `localStorage`.

## Demo Flow

1. Open **AI Analyst**, load the sample EIA, and run analysis.
2. Open **Grievance Center**, load the Nepali grievance example, and submit it.
3. Open **Accountability** to show linked findings, actions, evidence, grievances, and audit history.

The current analyzer is a deterministic local MVP. It is structured so a future `/api/documents/:id/analyze` endpoint can replace the local heuristics while keeping the same data objects.

## Stage 1 AI Backend

This project also includes a FastAPI backend for PDF text extraction and IFC PS1, PS5, and PS7 compliance analysis. It uses PyMuPDF, optional Groq models, and SQLite for local demo storage.

### Install Backend Dependencies

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `backend/.env`:

```txt
GROQ_API_KEY=
GROQ_TRANSLATION_MODEL=llama-3.3-70b-versatile
GROQ_MODEL=deepseek-r1-distill-llama-70b
DATABASE_URL=sqlite:///./hydrocomply.db
```

Leave `GROQ_API_KEY` blank to test the local deterministic fallback.

### Run Backend

```powershell
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### Initialize Project Database

The backend now stores project profiles, baselines, documents, findings, evidence, grievances, actions, score history, verification reviews, source references, and audit logs.

Seed only the current 3 demo projects:

```powershell
cd backend
python -m database.seed
```

Alternative:

```powershell
python seed.py
```

Running the seed twice will not duplicate projects because existing project IDs are skipped.

Reset the database:

```powershell
Remove-Item .\hydrocomply.db
python -m database.seed
```

Add a new project later by either:

1. Editing `backend/database/seed.py` and adding a new project object to `PROJECTS`, then running `python -m database.seed`.
2. Opening Swagger at `http://127.0.0.1:8000/docs` and using `POST /api/projects`.

Health check:

```txt
GET http://127.0.0.1:8000/health
```

Swagger UI:

```txt
http://127.0.0.1:8000/docs
```

### Extract PDF Text

Endpoint:

```txt
POST http://127.0.0.1:8000/api/pdf/extract
```

Send a multipart form upload with field name `file`.

Example with curl:

```powershell
curl.exe -X POST "http://127.0.0.1:8000/api/pdf/extract" -F "file=@C:\path\to\document.pdf"
```

Successful response shape:

```json
{
  "filename": "document.pdf",
  "pages": 3,
  "text_length": 12000,
  "preview": "First extracted text...",
  "pages_text": [
    { "page": 1, "text": "Page 1 text..." }
  ]
}
```

If the PDF is scanned or image-based and text extraction is too short, the backend returns `422` with `OCR_REQUIRED`.

### Analyze IFC Compliance

Endpoint:

```txt
POST http://127.0.0.1:8000/api/compliance/analyze
```

Example:

```powershell
curl.exe -X POST "http://127.0.0.1:8000/api/compliance/analyze" -F "file=@C:\path\to\document.pdf"
```

Stored analyses can be read with:

```txt
GET http://127.0.0.1:8000/api/compliance/analyses/{analysis_id}
```

To test fallback behavior, remove or leave blank `GROQ_API_KEY`. To test real AI analysis, add `GROQ_API_KEY` and restart the backend.

### Frontend Backend Fallback

The frontend tries to fetch project data from `http://127.0.0.1:8000/api/projects`. If the backend is not running, the original local demo data remains available and the role badge shows `Local demo fallback`.
