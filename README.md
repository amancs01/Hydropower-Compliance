# HydroComply Nepal

HydroComply Nepal is a local demo for hydropower IFC compliance review. It has:

- A static frontend in `index.html`, `styles.css`, and `app.js`
- A FastAPI backend in `backend/`
- A SQLite demo database seeded with hydropower projects and validation questions

## Run the Frontend

Open `index.html` in your browser.

The frontend works even if the backend is off. In that case it uses the local demo fallback data.

## Run the Backend

From the project root:

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

Create and seed the database:

```powershell
python -m database.seed
```

Start FastAPI:

```powershell
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Open:

```txt
http://127.0.0.1:8000/docs
```

## Useful Tests

Check backend health:

```powershell
curl.exe http://127.0.0.1:8000/health
```

Check seeded projects:

```powershell
curl.exe http://127.0.0.1:8000/api/projects
```

Extract PDF text:

```powershell
curl.exe -X POST "http://127.0.0.1:8000/api/pdf/extract" -F "file=@C:\path\to\document.pdf"
```

## Notes

- Run `python -m database.seed` again whenever you want to update seed data.
- Running the seed twice does not duplicate projects or validation questions.
- Leave `GROQ_API_KEY` blank to use the local deterministic fallback.
- The frontend automatically tries `http://127.0.0.1:8000/api/projects`; if unavailable, it keeps using local demo data.
