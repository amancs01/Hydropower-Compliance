# HydroComply Nepal

AI-powered IFC compliance intelligence demo for Nepal hydropower projects.

## Run

Open `index.html` in a browser. The app is dependency-free and stores demo changes in `localStorage`.

## Demo Flow

1. Open **AI Analyst**, load the sample EIA, and run analysis.
2. Open **Grievance Center**, load the Nepali grievance example, and submit it.
3. Open **Accountability** to show linked findings, actions, evidence, grievances, and audit history.

The current analyzer is a deterministic local MVP. It is structured so a future `/api/documents/:id/analyze` endpoint can replace the local heuristics while keeping the same data objects.
