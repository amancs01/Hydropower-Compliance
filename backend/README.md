# HydroComply AI Backend

FastAPI backend for project records, PDF extraction, and IFC compliance analysis.

## 1. Create Virtual Environment

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

## 2. Install Requirements

```powershell
pip install -r requirements.txt
```

## 3. Create `.env`

```txt
GROQ_API_KEY=
GROQ_TRANSLATION_MODEL=llama-3.3-70b-versatile
GROQ_MODEL=deepseek-r1-distill-llama-70b
DATABASE_URL=sqlite:///./hydrocomply.db
```

Leave `GROQ_API_KEY` empty to test the deterministic local fallback.

## 4. Run Backend

```powershell
uvicorn main:app --reload
```

## 5. Test

Health:

```txt
http://127.0.0.1:8000/health
```

Swagger:

```txt
http://127.0.0.1:8000/docs
```

PDF extraction:

```powershell
curl.exe -X POST "http://127.0.0.1:8000/api/pdf/extract" -F "file=@C:\path\to\document.pdf"
```

Compliance analysis:

```powershell
curl.exe -X POST "http://127.0.0.1:8000/api/compliance/analyze" -F "file=@C:\path\to\document.pdf"
```

Stored analysis:

```txt
GET http://127.0.0.1:8000/api/compliance/analyses/1
```

## Database Setup

The local demo uses SQLite. Tables are created automatically when the backend starts, or when the seed script runs.

Initialize and seed the current 3 demo projects:

```powershell
cd backend
python -m database.seed
```

Alternative:

```powershell
cd backend
python seed.py
```

Running the seed twice is safe. Existing project IDs are skipped, so the 3 demo projects are not duplicated.

Reset the local database:

```powershell
cd backend
Remove-Item .\hydrocomply.db
python -m database.seed
```

## Current Seeded Projects

Only these 3 projects are seeded:

1. Khimti-I Hydropower
2. Middle Tamor HPP
3. Seti Khola HPP

The seed data uses phrases such as "Demo baseline assumption", "Preliminary AI/research baseline", and "Requires human verification" so demo compliance gaps are not presented as verified facts.

## Project API

List projects:

```txt
GET http://127.0.0.1:8000/api/projects
```

Project detail:

```txt
GET http://127.0.0.1:8000/api/projects/middle-tamor
```

Project records:

```txt
GET /api/projects/{project_id}/baseline
GET /api/projects/{project_id}/findings
GET /api/projects/{project_id}/evidence
GET /api/projects/{project_id}/grievances
GET /api/projects/{project_id}/actions
GET /api/projects/{project_id}/score-history
GET /api/projects/{project_id}/audit
```

Add a project later through Swagger:

```txt
POST http://127.0.0.1:8000/api/projects
```

Or edit `database/seed.py`, add another project object to `PROJECTS`, then run:

```powershell
python -m database.seed
```

## Notes

- PDF text is extracted with PyMuPDF before AI analysis.
- If a PDF is scanned or image-only, the API returns `OCR_REQUIRED`.
- If `GROQ_API_KEY` is missing, `/api/compliance/analyze` returns a deterministic fallback result.
- SQLite is used for the local demo. `DATABASE_URL` is centralized so PostgreSQL can be added later.
- ChromaDB is not implemented yet. `chunk_service.py` uses simple keyword retrieval and can later be replaced by vector search.
- The frontend tries to load backend projects first. If the backend is not running, it keeps using the local demo fallback.
