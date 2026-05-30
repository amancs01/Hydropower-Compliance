# HydroComply Nepal

AI-powered IFC compliance and trust-verification tool for hydropower projects in Nepal. Upload EIA, IEE, ESMP, RAP, biodiversity, or grievance documents, analyze IFC PS1-PS8, extract report claims, compare them with community/worker feedback, and generate lender-facing trust reports.

---

## What's in this project

| File/Folder | What it does |
|---|---|
| `index.html` | Open this in your browser to use the app |
| `app.js` | All the frontend logic |
| `styles.css` | All the styling |
| `backend/` | Python server that handles AI analysis and the database |

---

## Option 1 — Just open the frontend (no setup needed)

Double-click `index.html` to open it in your browser. That's it.

The app comes with built-in demo data for several Nepal hydropower projects, so everything works without any backend. This is the quickest way to see the project.

---

## Option 2 — Run the full app with backend + AI

The backend gives you real AI analysis (via Groq) and saves results to a database. You need Python installed on your computer.

### Step 1 — Check Python is installed

Open PowerShell and run:
```powershell
python --version
```
You should see something like `Python 3.10.x`. If you get an error, download Python from https://python.org first.

### Step 2 — Open PowerShell in the backend folder

```powershell
cd path\to\Hydropower-Compliance-main\backend
```

### Step 3 — Create a virtual environment

This keeps the project's dependencies separate from the rest of your computer:
```powershell
python -m venv .venv
```

### Step 4 — Activate the virtual environment

```powershell
.\.venv\Scripts\Activate.ps1
```

If you get a "Security Error" or "Blocked" message:
Windows often blocks scripts. You have two ways to fix this:

Option A (Recommended): Temporarily allow scripts in your current window:

PowerShell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
# Now run the activation again:
.\.venv\Scripts\Activate.ps1

Option B (The Shortcut): Switch to Command Prompt (CMD), which has fewer restrictions:

PowerShell
cmd
.\.venv\Scripts\activate
You'll know it worked when you see (.venv) appear at the start of your prompt.
You'll know it worked when you see `(.venv)` appear at the start of your PowerShell prompt.

### Step 5 — Install dependencies

```powershell
pip install -r requirements.txt
```

### Step 6 — Create your .env file

Copy the `.env.example` file and rename the copy to `.env`. Then open `.env` and fill in your Groq API key.

You can get a free Groq API key at https://console.groq.com

> **You can leave GROQ_API_KEY blank.** The app will still work — it just uses built-in demo analysis instead of real AI.

### Step 7 — Create the database

```powershell
python -m database.seed
```

This creates a file called `hydrocomply.db` with all the demo project data. It's safe to run multiple times.

### Step 8 — Start the backend server

```powershell
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

Leave this PowerShell window open while you use the app.

### Step 9 — Open the app

Open `index.html` in your browser as usual. It will automatically detect and connect to the backend.

You can also explore all backend API endpoints at:
```
http://127.0.0.1:8000/docs
```

---

## Troubleshooting

**"uvicorn is not recognized"** — Make sure you activated the virtual environment in Step 4. You should see `(.venv)` in your prompt.

**Frontend shows demo data even with backend running** — Check that the backend is still running in PowerShell (the window shouldn't be closed). Try refreshing the browser.

**Backend starts but AI analysis gives an error** — Your `GROQ_API_KEY` may be missing or wrong. Check your `.env` file. The app will fall back to demo analysis automatically.

**Port 8000 already in use** — Another program is using that port. Either close it, or change `--port 8000` to `--port 8001` in Step 8 and set `window.HYDROCOMPLY_API_BASE_URL` or localStorage key `hydrocomply-api-base-url` to match.

---

## Notes

- The `.env` file contains your secret API key — never share it or commit it to GitHub.
- The `hydrocomply.db` database file is generated locally and should not be committed to GitHub.
- Re-run `python -m database.seed` any time you want to reset the database to its original demo state.

---

## Local CORS and Demo Auth

Recommended `.env` settings for local demo:

```env
GROQ_API_KEY=
DEMO_JWT_SECRET=change-this-in-production
ALLOW_ALL_ORIGINS=false
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000,http://localhost:4173,http://127.0.0.1:4173
VITE_API_BASE_URL=http://127.0.0.1:8000
```

To use a deployed frontend later, add its URL to `ALLOWED_ORIGINS`, separated by commas. Only use `ALLOW_ALL_ORIGINS=true` for local/demo testing.

The static frontend uses `http://127.0.0.1:8000` by default. To point it at another backend without editing source, set:

```js
window.HYDROCOMPLY_API_BASE_URL = "http://127.0.0.1:8001";
```

or run this once in the browser console:

```js
localStorage.setItem("hydrocomply-api-base-url", "http://127.0.0.1:8001");
```

HydroComply uses simple demo authentication for role-based API access. This is not production-grade identity management.

Demo login:

```http
POST /api/auth/demo-login
```

Example body:

```json
{ "role": "Developer" }
```

The backend returns a 12-hour bearer token. The frontend stores it in `localStorage` and sends:

```http
Authorization: Bearer <token>
```

Public endpoints:

- `GET /health`
- `GET /api/health`
- validation screening/questions
- validation response submission
- public grievance submission

Protected examples:

- document extraction and AI analysis: `Developer`, `Consultant`, `Admin`
- audit logs: `Lender`, `Consultant`, `Regulator`, `Admin`
- lender trust report: `Lender`, `Consultant`, `Regulator`, `Admin`
- manual verification notes: `Consultant`, `Community Liaison`, `Admin`
- project creation/editing: `Developer`, `Admin`

To test role restrictions, log in as `Lender` and try document analysis. The backend should return:

```json
{
  "status": "error",
  "error_code": "FORBIDDEN",
  "message": "You do not have permission to perform this action."
}
```
