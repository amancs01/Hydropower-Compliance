# HydroComply Backend

FastAPI backend for HydroComply Nepal. It provides project records, PDF extraction, compliance analysis, validation questionnaires, controversy tracking, manual verification tasks, and lender trust reports.

## Setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `.env` inside `backend/`:

```txt
GROQ_API_KEY=
GROQ_TRANSLATION_MODEL=llama-3.3-70b-versatile
GROQ_MODEL=deepseek-r1-distill-llama-70b
DATABASE_URL=sqlite:///./hydrocomply.db
```

`GROQ_API_KEY` can stay empty for local fallback mode.

## Seed Database

```powershell
python -m database.seed
```

This creates the SQLite database, seeds demo projects, and adds validation questions. Running it more than once is safe.

## Run

```powershell
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Swagger:

```txt
http://127.0.0.1:8000/docs
```

## Quick Tests

```powershell
curl.exe http://127.0.0.1:8000/health
curl.exe http://127.0.0.1:8000/api/projects
curl.exe http://127.0.0.1:8000/api/projects/middle-tamor/validation/screening-question
```

PDF extraction:

```powershell
curl.exe -X POST "http://127.0.0.1:8000/api/pdf/extract" -F "file=@C:\path\to\document.pdf"
```

If a PDF is scanned or image-based, the API returns `OCR_REQUIRED`.
