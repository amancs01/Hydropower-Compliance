const standards = [
  { code: "PS1", name: "Assessment and Management", mandatory: true, weight: 18 },
  { code: "PS2", name: "Labor and Working Conditions", mandatory: false, weight: 10 },
  { code: "PS3", name: "Resource Efficiency and Pollution", mandatory: false, weight: 12 },
  { code: "PS4", name: "Community Health and Safety", mandatory: false, weight: 12 },
  { code: "PS5", name: "Land Acquisition and Resettlement", mandatory: true, weight: 15 },
  { code: "PS6", name: "Biodiversity Conservation", mandatory: false, weight: 13 },
  { code: "PS7", name: "Indigenous Peoples", mandatory: true, weight: 10 },
  { code: "PS8", name: "Cultural Heritage", mandatory: true, weight: 10 }
];

const rules = [
  { code: "PS1", question: "Is there a living ESMS with stakeholder engagement, grievance mechanism, monitoring, and corrective-action ownership?", evidence: "ESMS, SEP, grievance procedure, monitoring matrix", weight: 18, freshness: 365, mandatory: true },
  { code: "PS2", question: "Are labor, contractor, OHS, and worker grievance records filed and reviewed?", evidence: "Labor plan, OHS logs, contractor records", weight: 10, freshness: 180, mandatory: false },
  { code: "PS3", question: "Are pollution, waste, spoil, water quality, and environmental-flow commitments backed by recent monitoring?", evidence: "Monitoring logs, waste manifests, water quality reports", weight: 12, freshness: 180, mandatory: false },
  { code: "PS4", question: "Are community safety, traffic, blasting, emergency preparedness, and nuisance impacts tracked?", evidence: "CHS plan, emergency plan, complaint trend records", weight: 12, freshness: 180, mandatory: false },
  { code: "PS5", question: "Is land acquisition supported by replacement-cost methodology, payment proof, livelihood restoration, and monitoring?", evidence: "RAP, household list, payment proof, livelihood follow-up", weight: 15, freshness: 365, mandatory: true },
  { code: "PS6", question: "Are biodiversity, aquatic ecology, critical habitat, and environmental flow requirements actively monitored?", evidence: "Biodiversity report, aquatic ecology records, e-flow logs", weight: 13, freshness: 180, mandatory: false },
  { code: "PS7", question: "If Indigenous Peoples are affected, is there consultation, FPIC evidence, benefit-sharing, and an Indigenous Peoples Plan?", evidence: "IPP, FPIC records, consultation register", weight: 10, freshness: 365, mandatory: true },
  { code: "PS8", question: "Are chance-find, cultural heritage, and sacred-site protocols documented and disclosed?", evidence: "Chance-find procedure, cultural heritage survey", weight: 10, freshness: 730, mandatory: true }
];

const sampleDocument = `Middle Tamor Hydropower Project Environmental and Social Impact Assessment
Section 2: Project description. Run-of-river hydropower on the Tamor River with access roads, camps, transmission alignment, spoil disposal areas, diversion weir, settling basin and powerhouse.
Section 4: Baseline. The EIA includes one-time baseline surveys for water quality, aquatic ecology, forests, and affected wards. The report notes ethnic Limbu and Rai communities in the influence area.
Section 6: Land acquisition. Private land and community forest land will be acquired. Compensation will be paid as per district rates. The document does not describe replacement-cost methodology, livelihood restoration monitoring, or post-payment follow-up.
Section 7: Environmental management. The report includes mitigation measures for spoil, dust, noise, waste handling, worker camp sanitation, and minimum environmental flow. Monitoring is proposed but no current monitoring responsibility matrix is attached.
Section 8: Stakeholder consultation. Public hearings were held during EIA preparation. No complete stakeholder engagement plan or project grievance mechanism procedure is included.
Section 9: Biodiversity. Fish passage and aquatic ecology monitoring are recommended. No recent biodiversity monitoring evidence or e-flow log is attached.
Annex: Grievances. A sample complaint register format is included, but there are no records showing acknowledgement, resolution deadline, or closure evidence.`;

const nepaliGrievance = "हाम्रो जग्गाको मुआब्जा अझै पूरा आएको छैन र कार्यालयमा जाँदा कसैले स्पष्ट जवाफ दिँदैन।";

function pendingDemoProject(id, name, river) {
  return {
    id,
    name,
    capacity: "",
    river,
    district: "To be extracted",
    promoter: "To be extracted",
    status: "Report-backed project profile",
    cod: "",
    reportTypeAvailable: "Report available",
    reportStatus: "report_available",
    baselineStatus: "baseline_pending",
    metadataConfidence: "report_backed_metadata_only",
    description: "Report-backed project room. Upload the project report to generate the compliance baseline."
  };
}

const reportBackedDemoProjects = [
  pendingDemoProject("upper-trishuli-1", "Upper Trishuli-1 Hydropower Project", "Trishuli River / basin"),
  pendingDemoProject("kabeli-a", "Kabeli-A Hydroelectric Project", "Kabeli River / basin"),
  pendingDemoProject("nagmati-dam", "Nagmati Dam Project", "Nagmati River / basin"),
  pendingDemoProject("tanahu-tallo-seti", "Tanahu Tallo Seti Hydropower Project", "Seti River / basin"),
  pendingDemoProject("bheri-1-pror", "Bheri-1 PRoR Hydropower Project", "Bheri River / basin"),
  pendingDemoProject("mardi-khola", "Mardi Khola Hydropower Project", "Mardi Khola / basin"),
  pendingDemoProject("mugu-karnali", "Mugu Karnali Hydropower Project", "Karnali River / basin"),
  pendingDemoProject("rasuwagadhi", "Rasuwagadhi Hydropower Project", "To be extracted"),
  pendingDemoProject("rolwaling-khola", "Rolwaling Khola Hydropower Project", "Rolwaling Khola / basin"),
  pendingDemoProject("upper-apsuwa-khola", "Upper Apsuwa Khola Hydropower Project", "Apsuwa Khola / basin"),
  pendingDemoProject("upper-inkhu-khola", "Upper Inkhu Khola Hydropower Project", "Inkhu Khola / basin"),
  pendingDemoProject("upper-mugu-karnali", "Upper Mugu Karnali Hydropower Project", "Karnali River / basin"),
  pendingDemoProject("super-inkhu-khola", "Super Inkhu Khola Hydropower Project", "Inkhu Khola / basin"),
  pendingDemoProject("dudhkoshi-5", "Dudhkoshi-5 Hydropower Project", "Dudhkoshi River / basin"),
  pendingDemoProject("bharbung", "Bharbung Hydropower Project", "To be extracted"),
  pendingDemoProject("karuwa-seti", "Karuwa Seti Hydropower Project", "Seti River / basin"),
  pendingDemoProject("lower-likhu", "Lower Likhu Hydropower Project", "Likhu River / basin")
];

const initialState = {
  selectedProjectId: "middle-tamor",
  role: "Lender",
  dataSource: "Local demo fallback",
  projects: [
    {
      id: "khimti",
      name: "Khimti-I Hydropower",
      capacity: "60 MW",
      river: "Khimti Khola",
      district: "Dolakha / Ramechhap",
      promoter: "Himal Power Limited",
      status: "Operating",
      cod: "2000",
      description: "Mature operating project with older compliance records. Demo assumptions are used for current gaps unless separately verified."
    },
    {
      id: "middle-tamor",
      name: "Middle Tamor HPP",
      capacity: "73 MW",
      river: "Tamor River",
      district: "Taplejung",
      promoter: "Sanima Middle Tamor Hydropower",
      status: "Construction / commissioning",
      cod: "Demo profile",
      description: "Newer project profile used to demonstrate document intelligence, action closure, PS5 follow-up, and PS6 monitoring gaps."
    },
    {
      id: "seti-khola",
      name: "Seti Khola HPP",
      capacity: "22 MW",
      river: "Seti Khola",
      district: "Kaski",
      promoter: "Demo developer",
      status: "Development",
      cod: "Demo profile",
      description: "Mid-size demo project with community nuisance and waste-handling evidence scenarios."
    },
    ...reportBackedDemoProjects
  ],
  scores: {
    "khimti": { PS1: 58, PS2: 76, PS3: 46, PS4: 64, PS5: 48, PS6: 71, PS7: 67, PS8: 82 },
    "middle-tamor": { PS1: 38, PS2: 70, PS3: 62, PS4: 66, PS5: 42, PS6: 47, PS7: 34, PS8: 76 },
    "seti-khola": { PS1: 61, PS2: 73, PS3: 49, PS4: 43, PS5: 65, PS6: 68, PS7: 72, PS8: 80 },
    ...Object.fromEntries(reportBackedDemoProjects.map((item) => [item.id, null]))
  },
  evidence: [
    evidence("ev-1", "khimti", "PS3", "Water quality monitoring report", "Expired", "Monitoring record older than current lender freshness window.", "Environmental monitoring folder", "2024-05-11", false),
    evidence("ev-2", "khimti", "PS5", "Compensation payment register", "Filed", "Payment records exist, but livelihood follow-up is incomplete.", "Resettlement folder", "2025-02-18", true),
    evidence("ev-3", "middle-tamor", "PS1", "EIA public hearing minutes", "Filed", "Consultation evidence detected, but no living stakeholder engagement plan was attached.", "EIA Section 8", "2026-02-04", false),
    evidence("ev-4", "middle-tamor", "PS6", "Aquatic ecology baseline", "Filed", "Baseline survey exists. Recent monitoring evidence is missing.", "EIA Section 9", "2025-11-19", false),
    evidence("ev-5", "seti-khola", "PS3", "Waste handling checklist", "Disputed", "Checklist was uploaded by developer but rejected pending photo and disposal evidence.", "Site inspection pack", "2026-01-12", false)
  ],
  findings: [
    finding("fi-1", "khimti", "PS3", "High", "Pollution monitoring evidence is stale", "Water quality and environmental flow evidence is outside the 180-day freshness window.", "Upload recent water quality results, environmental-flow logs, spoil disposal records, and reviewer comments.", "Open", 78, "AI Retro-Compliance Scan"),
    finding("fi-2", "khimti", "PS5", "High", "Livelihood restoration follow-up incomplete", "Compensation files exist, but the project has no clear post-payment livelihood monitoring evidence.", "Add affected household follow-up records, restoration indicators, unresolved grievance list, and verification note.", "Waiting for evidence", 72, "PS5 rule engine"),
    finding("fi-3", "middle-tamor", "PS1", "Critical", "No complete ESMS or grievance mechanism detected", "The document has one-time assessment and public hearing records, but no ongoing ESMS, stakeholder engagement plan, grievance mechanism, or monitoring responsibility matrix.", "Upload ESMS, SEP, grievance mechanism procedure, monitoring matrix, and corrective-action register.", "Open", 88, "AI analyst"),
    finding("fi-4", "middle-tamor", "PS5", "High", "Replacement-cost and livelihood monitoring unclear", "Land acquisition is referenced, but replacement-cost methodology, livelihood restoration follow-up, and post-compensation monitoring are not clear.", "Upload RAP, household list, payment proof, replacement-cost methodology, and livelihood restoration monitoring records.", "Open", 83, "AI analyst"),
    finding("fi-5", "middle-tamor", "PS7", "Critical", "Indigenous Peoples evidence missing", "The document references Limbu and Rai communities, but no Indigenous Peoples Plan, FPIC evidence, or benefit-sharing records were detected.", "Confirm PS7 applicability. If affected, upload consultation records, consent evidence, IPP, benefit-sharing plan, and grievance evidence.", "Open", 84, "AI analyst"),
    finding("fi-6", "seti-khola", "PS4", "High", "Community nuisance grievance trend is overdue", "Noise and access-road complaints remain open beyond the response deadline.", "Assign liaison response, verify mitigation, and attach closure evidence before lender review.", "Overdue", 80, "Grievance Center")
  ],
  grievances: [
    grievance("gr-1", "seti-khola", "Private", "Road blasting caused cracks in our house and no one has come to inspect.", "Community safety and property damage concern", "PS4", "High", "Overdue", "HCN-SET-2407", "2026-05-17T09:15:00"),
    grievance("gr-2", "middle-tamor", "Confidential", nepaliGrievance, "Land compensation concern", "PS5", "High", "New", "HCN-MID-2408", "2026-05-28T14:20:00")
  ],
  actions: [
    action("ac-1", "middle-tamor", "fi-3", "", "Compliance Manager", "Upload ESMS and grievance mechanism", "Add ESMS, SEP, grievance procedure, and monitoring responsibility matrix.", "Open", "2026-06-12"),
    action("ac-2", "middle-tamor", "fi-4", "gr-2", "Land Officer", "Verify compensation methodology", "Submit replacement-cost methodology and affected-household follow-up log.", "Waiting for evidence", "2026-06-05"),
    action("ac-3", "khimti", "fi-1", "", "E&S Consultant", "Refresh water quality monitoring", "Upload 2026 monitoring evidence and reviewer verification comments.", "In progress", "2026-06-20"),
    action("ac-4", "seti-khola", "fi-6", "gr-1", "Community Liaison", "Respond to PS4 grievance", "Inspect damage claim, document response, and attach closure evidence.", "Overdue", "2026-05-24")
  ],
  auditLogs: [
    audit("Finding created", "AI analyst flagged PS1 critical gap for Middle Tamor.", "HydroComply AI", "2026-05-28T14:24:00"),
    audit("Action assigned", "Compliance Manager assigned ESMS upload due 2026-06-12.", "Lender Reviewer", "2026-05-28T14:31:00"),
    audit("Grievance received", "Nepali compensation grievance routed to PS5 with confidential handling.", "Community Portal", "2026-05-28T14:20:00"),
    audit("Evidence disputed", "Seti Khola waste checklist marked disputed pending disposal proof.", "Consultant", "2026-05-21T11:45:00")
  ],
  validationSubmissions: [],
  controversies: [],
  manualTasks: [],
  lenderTrustReports: [],
  reportClaims: []
};

let state = loadState();
let currentRoute = "publicHome";
let currentView = "dashboard";
let selectedAnalyzerFile = null;
let latestComplianceAnalysis = null;
let projectFilter = "all";
let validationFlow = {
  step: "screening",
  projectId: state.selectedProjectId,
  respondentConnection: "",
  respondentType: "community",
  questionSet: "community",
  sectionIndex: 0,
  questions: [],
  answers: {},
  loading: false,
  receipt: null
};

const reviewerRoles = new Set(["Lender", "Lender / Investor", "Consultant", "Reviewer", "Regulator / Reviewer"]);

const portalRoles = [
  {
    key: "developer",
    label: "Developer",
    text: "Upload documents, fix compliance gaps, manage evidence, and respond to grievances.",
    entryView: "dashboard"
  },
  {
    key: "lender",
    label: "Lender / Investor",
    text: "Review verified evidence, unresolved risks, grievance history, and audit trail before financing.",
    entryView: "dashboard"
  },
  {
    key: "consultant",
    label: "Consultant",
    text: "Verify AI findings, review evidence, reject weak documents, and prepare compliance reports.",
    entryView: "dashboard"
  },
  {
    key: "regulator",
    label: "Regulator / Reviewer",
    text: "Check submission completeness, monitoring status, unresolved commitments, and inspection readiness.",
    entryView: "dashboard"
  },
  {
    key: "community",
    label: "Community Member",
    text: "Submit a concern in simple Nepali or English and receive a reference number.",
    entryView: "community"
  },
  {
    key: "community-liaison",
    label: "Community Liaison",
    text: "Manage community concerns, acknowledge grievances, and attach resolution evidence.",
    entryView: "dashboard"
  }
];

const portalNav = {
  developer: [
    ["dashboard", "Overview", "layout"],
    ["analyst", "AI Scan", "spark"],
    ["matrix", "Matrix", "matrix"],
    ["evidence", "Evidence Vault", "vault"],
    ["grievances", "Grievances", "message"],
    ["actions", "Actions", "check"],
    ["validation", "Validation", "message"],
    ["audit", "Audit", "clock"],
    ["reports", "Reports", "rule"]
  ],
  lender: [
    ["dashboard", "Review", "layout"],
    ["trust-report", "Trust Report", "rule"],
    ["evidence", "Evidence", "vault"],
    ["controversies", "Controversies", "alert"],
    ["audit", "Audit", "clock"],
    ["reports", "Reports", "rule"]
  ],
  consultant: [
    ["dashboard", "Review Queue", "layout"],
    ["evidence", "Evidence", "vault"],
    ["analyst", "Findings", "spark"],
    ["validation", "Validation", "message"],
    ["reports", "Reports", "rule"]
  ],
  regulator: [
    ["dashboard", "Projects", "layout"],
    ["matrix", "Submission Completeness", "matrix"],
    ["evidence", "Monitoring Status", "vault"],
    ["validation", "Validation Responses", "message"],
    ["controversies", "Controversies", "alert"],
    ["actions", "Commitments", "check"],
    ["grievances", "Grievance Trends", "message"],
    ["audit", "Inspection View", "clock"]
  ],
  "community-liaison": [
    ["grievances", "Grievances", "message"],
    ["validation", "Validation", "message"],
    ["manual-verification", "Manual Checks", "check"],
    ["actions", "Actions", "check"]
  ],
  admin: [
    ["dashboard", "Users", "layout"],
    ["reports", "Roles", "check"],
    ["matrix", "IFC Standards", "matrix"],
    ["rules", "Rules", "rule"],
    ["analyst", "AI Prompts", "spark"],
    ["audit", "Audit Logs", "clock"]
  ]
};

const portalTitles = {
  developer: "Project Compliance Workspace",
  lender: "Investment Risk Review",
  consultant: "Evidence Review Queue",
  regulator: "Project Monitoring & Submission Review",
  "community-liaison": "Community Response Workspace",
  admin: "Platform Administration"
};

const views = {
  dashboard: { eyebrow: "Portfolio dashboard", title: "Finance-ready hydropower compliance intelligence" },
  analyst: { eyebrow: "AI Document Scan", title: "Upload a report and detect IFC gaps" },
  matrix: { eyebrow: "PS Matrix", title: "IFC status at a glance" },
  evidence: { eyebrow: "Evidence Vault", title: "Filed is not the same as verified" },
  grievances: { eyebrow: "Grievance Center", title: "Inbox for community cases" },
  validation: { eyebrow: "Validation Questionnaires", title: "Community and worker ground-truth validation" },
  controversies: { eyebrow: "Controversy Center", title: "Document claims compared with ground-level feedback" },
  "manual-verification": { eyebrow: "Manual Verification Desk", title: "Task workflow for contested claims" },
  "trust-report": { eyebrow: "Lender Trust Report", title: "Credit-style compliance trust memo" },
  actions: { eyebrow: "Actions", title: "Accountable work by status" },
  rules: { eyebrow: "Rule Admin", title: "Scoring logic" },
  audit: { eyebrow: "Audit Trail", title: "Accountability without clutter" }
};

function evidence(id, projectId, linkedStandard, evidenceType, status, summary, source, capturedAt, confidential) {
  return { id, projectId, linkedStandard, evidenceType, status, summary, source, capturedAt, confidential, uploadedBy: "Demo team", verifiedBy: status === "Verified" ? "Reviewer" : "" };
}

function finding(id, projectId, standard, severity, title, rationale, recommendation, status, confidence, source) {
  return { id, projectId, standard, severity, title, rationale, recommendation, status, confidence, source, aiGenerated: true };
}

function grievance(id, projectId, confidentiality, originalText, aiSummary, linkedStandard, severity, status, referenceNumber, receivedAt) {
  return {
    id,
    projectId,
    submittedBy: "Anonymous",
    anonymous: true,
    originalText,
    translatedText: originalText.includes("मुआब्जा") ? "Our land compensation has still not been fully paid, and when we go to the office no one gives a clear answer." : originalText,
    aiSummary,
    category: aiSummary,
    linkedStandard,
    severity,
    confidentialityLevel: confidentiality,
    status,
    referenceNumber,
    receivedAt
  };
}

function action(id, projectId, findingId, grievanceId, owner, title, description, status, dueDate) {
  return { id, projectId, findingId, grievanceId, owner, title, description, status, dueDate, completedAt: "" };
}

function audit(actionName, detail, actor, createdAt) {
  return { id: crypto.randomUUID(), entityType: "demo", entityId: "workspace", actor, action: actionName, detail, createdAt };
}

function mergeProjectsWithDefaults(projects = []) {
  const savedById = new Map(projects.map((item) => [item.id, item]));
  const merged = initialState.projects.map((defaultProject) => ({
    ...defaultProject,
    ...(savedById.get(defaultProject.id) || {})
  }));
  projects.forEach((item) => {
    if (!initialState.projects.some((defaultProject) => defaultProject.id === item.id)) {
      merged.push(item);
    }
  });
  return merged;
}

function mergeScoresWithDefaults(scores = {}) {
  return { ...initialState.scores, ...scores };
}

function loadState() {
  const stored = localStorage.getItem("hydrocomply-state");
  if (!stored) return structuredClone(initialState);
  try {
    const parsed = JSON.parse(stored);
    const nextState = { ...structuredClone(initialState), ...parsed };
    nextState.projects = mergeProjectsWithDefaults(parsed.projects || []);
    nextState.scores = mergeScoresWithDefaults(parsed.scores || {});
    nextState.evidence = parsed.evidence || initialState.evidence;
    nextState.findings = parsed.findings || initialState.findings;
    nextState.grievances = parsed.grievances || initialState.grievances;
    nextState.actions = parsed.actions || initialState.actions;
    nextState.auditLogs = parsed.auditLogs || initialState.auditLogs;
    nextState.validationSubmissions = parsed.validationSubmissions || initialState.validationSubmissions;
    nextState.controversies = parsed.controversies || initialState.controversies;
    nextState.manualTasks = parsed.manualTasks || initialState.manualTasks;
    nextState.lenderTrustReports = parsed.lenderTrustReports || initialState.lenderTrustReports;
    nextState.reportClaims = parsed.reportClaims || initialState.reportClaims;
    if (!nextState.projects.some((item) => item.id === nextState.selectedProjectId)) {
      nextState.selectedProjectId = initialState.selectedProjectId;
    }
    return nextState;
  } catch {
    return structuredClone(initialState);
  }
}

function saveState() {
  localStorage.setItem("hydrocomply-state", JSON.stringify(state));
}

const API_BASE_URL = window.HYDROCOMPLY_API_BASE_URL || localStorage.getItem("hydrocomply-api-base-url") || "http://127.0.0.1:8000";

function backendRole(role = state.role) {
  return {
    "Lender / Investor": "Lender",
    "Regulator / Reviewer": "Regulator",
    "Community Member": "Community User"
  }[role] || role;
}

function authSession() {
  try {
    return JSON.parse(localStorage.getItem("hydrocomply-auth") || "null");
  } catch {
    return null;
  }
}

function authHeaders(extra = {}) {
  const session = authSession();
  return session?.access_token
    ? { ...extra, Authorization: `Bearer ${session.access_token}` }
    : extra;
}

async function demoLogin(role = state.role) {
  const response = await fetch(`${API_BASE_URL}/api/auth/demo-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: backendRole(role) })
  });
  if (!response.ok) throw new Error("Demo login failed.");
  const session = await response.json();
  localStorage.setItem("hydrocomply-auth", JSON.stringify(session));
  return session;
}

async function ensureDemoLogin(role = state.role) {
  const session = authSession();
  if (session?.access_token && session.role === backendRole(role)) return session;
  return demoLogin(role);
}

async function apiGet(path) {
  await ensureDemoLogin(state.role);
  const response = await fetch(`${API_BASE_URL}${path}`, { headers: authHeaders() });
  if (response.status === 403) throw new Error("This action is not available for your role.");
  if (!response.ok) throw new Error(`Backend request failed: ${path}`);
  return response.json();
}

function fetchProjectsFromBackend() {
  console.log("Fetching projects from backend...");
  return apiGet("/api/projects");
}

function fetchScreeningQuestion(projectId) {
  return apiGet(`/api/projects/${encodeURIComponent(projectId)}/validation/screening-question`);
}

function fetchValidationQuestions(projectId, questionSet) {
  return apiGet(`/api/projects/${encodeURIComponent(projectId)}/validation/questions?question_set=${encodeURIComponent(questionSet)}`);
}

async function submitValidationResponses(projectId, payload) {
  const response = await fetch(`${API_BASE_URL}/api/projects/${encodeURIComponent(projectId)}/validation/responses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Validation submission failed.");
  return response.json();
}

function fetchControversies(projectId) {
  return apiGet(`/api/projects/${encodeURIComponent(projectId)}/controversies`);
}

function fetchManualTasks(projectId) {
  return apiGet(`/api/projects/${encodeURIComponent(projectId)}/manual-verification-tasks`);
}

function fetchLenderTrustReport(projectId) {
  return apiGet(`/api/projects/${encodeURIComponent(projectId)}/lender-trust-report`);
}

function fetchReportClaims(projectId) {
  return apiGet(`/api/projects/${encodeURIComponent(projectId)}/report-claims`);
}

async function addManualTaskNote(taskId, payload) {
  const response = await fetch(`${API_BASE_URL}/api/manual-verification-tasks/${encodeURIComponent(taskId)}/notes`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Manual verification note failed.");
  return response.json();
}

async function loadVerificationData(projectId = state.selectedProjectId) {
  try {
    await ensureDemoLogin(state.role);
    const [controversies, manualTasks, trustReport, reportClaims] = await Promise.all([
      fetchControversies(projectId),
      fetchManualTasks(projectId),
      fetchLenderTrustReport(projectId),
      fetchReportClaims(projectId)
    ]);
    state.controversies = [
      ...state.controversies.filter((item) => item.project_id !== projectId && item.projectId !== projectId),
      ...controversies
    ];
    state.manualTasks = [
      ...state.manualTasks.filter((item) => item.project_id !== projectId && item.projectId !== projectId),
      ...manualTasks
    ];
    state.lenderTrustReports = [
      ...state.lenderTrustReports.filter((item) => item.project_id !== projectId && item.projectId !== projectId),
      trustReport
    ];
    state.reportClaims = [
      ...state.reportClaims.filter((item) => item.project_id !== projectId && item.projectId !== projectId),
      ...reportClaims.map((item) => ({ ...item, project_id: projectId }))
    ];
    saveState();
    render();
  } catch {
    toast("Backend verification data is not available. Showing local demo data.");
  }
}

function fetchProjects() {
  return fetchProjectsFromBackend();
}

function fetchProject(projectId) {
  return apiGet(`/api/projects/${projectId}`);
}

function fetchProjectFindings(projectId) {
  return apiGet(`/api/projects/${projectId}/findings`);
}

function fetchProjectEvidence(projectId) {
  return apiGet(`/api/projects/${projectId}/evidence`);
}

function fetchProjectGrievances(projectId) {
  return apiGet(`/api/projects/${projectId}/grievances`);
}

function fetchProjectActions(projectId) {
  return apiGet(`/api/projects/${projectId}/actions`);
}

function fetchProjectAudit(projectId) {
  return apiGet(`/api/projects/${projectId}/audit`);
}

function fetchProjectScoreHistory(projectId) {
  return apiGet(`/api/projects/${projectId}/score-history`);
}

async function loadBackendProjectData() {
  try {
    const projects = await fetchProjectsFromBackend();
    if (!Array.isArray(projects) || !projects.length) {
      throw new Error("No backend projects returned.");
    }

    state.projects = projects.map(mapBackendProject);
    state.scores = {};
    state.findings = [];
    state.evidence = [];
    state.grievances = [];
    state.actions = [];
    state.auditLogs = [];

    projects.forEach((projectItem) => {
      state.scores[projectItem.id] = mapBackendScore(projectItem, []);
    });

    if (!state.projects.some((item) => item.id === state.selectedProjectId)) {
      state.selectedProjectId = state.projects[0].id;
    }

    state.dataSource = "Backend database connected";
    saveState();
    renderProjectOptions();
    render();
    console.log("Backend projects loaded");
    toast("Backend database connected.");
    await ensureDemoLogin(state.role);

    const details = await Promise.all(projects.map(async (projectItem) => {
      const [findings, evidence, grievances, actions, auditLogs, scoreHistory] = await Promise.all([
        optionalBackendList(() => fetchProjectFindings(projectItem.id)),
        optionalBackendList(() => fetchProjectEvidence(projectItem.id)),
        optionalBackendList(() => fetchProjectGrievances(projectItem.id)),
        optionalBackendList(() => fetchProjectActions(projectItem.id)),
        optionalBackendList(() => fetchProjectAudit(projectItem.id)),
        optionalBackendList(() => fetchProjectScoreHistory(projectItem.id))
      ]);
      return { projectItem, findings, evidence, grievances, actions, auditLogs, scoreHistory };
    }));

    state.scores = {};
    state.findings = [];
    state.evidence = [];
    state.grievances = [];
    state.actions = [];
    state.auditLogs = [];

    details.forEach(({ projectItem, findings, evidence, grievances, actions, auditLogs, scoreHistory }) => {
      state.scores[projectItem.id] = mapBackendScore(projectItem, scoreHistory);
      state.findings.push(...findings.map(mapBackendFinding));
      state.evidence.push(...evidence.map(mapBackendEvidence));
      state.grievances.push(...grievances.map(mapBackendGrievance));
      state.actions.push(...actions.map(mapBackendAction));
      state.auditLogs.push(...auditLogs.map(mapBackendAudit));
    });

    saveState();
    render();
  } catch (error) {
    console.log("Backend unavailable, using local fallback", error);
    useLocalDemoFallback();
  }
}

function useLocalDemoFallback() {
  if (state.dataSource === "Backend database connected") {
    const currentRole = state.role;
    state = structuredClone(initialState);
    state.role = currentRole;
    state.dataSource = "Local demo fallback";
    saveState();
    renderProjectOptions();
    render();
    return;
  }

  state.dataSource = "Local demo fallback";
  saveState();
  updateTopbarContext();
}

async function optionalBackendList(loader) {
  try {
    const value = await loader();
    return Array.isArray(value) ? value : [];
  } catch (error) {
    console.warn("Optional backend records unavailable", error);
    return [];
  }
}

function mapBackendProject(projectItem) {
  return {
    id: projectItem.id,
    name: projectItem.name,
    normalizedName: projectItem.normalized_name || projectItem.id,
    projectType: projectItem.project_type || "hydropower",
    capacity: projectItem.capacity_mw ? `${projectItem.capacity_mw} MW` : "",
    river: projectItem.river_or_basin || projectItem.river || "",
    district: projectItem.district_or_region || projectItem.district || "",
    promoter: projectItem.promoter || "",
    status: projectItem.status || "",
    cod: projectItem.cod || "",
    reportTypeAvailable: projectItem.report_type_available || "",
    reportStatus: projectItem.report_status || "",
    baselineStatus: projectItem.baseline_status || "",
    metadataConfidence: projectItem.metadata_confidence || "",
    description: projectItem.description || projectItem.source_note || ""
  };
}

function mapBackendScore(projectItem, scoreHistory = []) {
  const latest = projectItem.latest_score || scoreHistory[scoreHistory.length - 1] || {};
  const isPendingScore = projectItem.baseline_status === "baseline_pending"
    || latest.risk_level === "baseline_pending"
    || latest.overall_score === null
    || latest.overall_score === undefined;
  if (isPendingScore) return null;

  return {
    PS1: latest.ps1_score ?? 50,
    PS2: latest.ps2_score ?? null,
    PS3: latest.ps3_score ?? null,
    PS4: latest.ps4_score ?? null,
    PS5: latest.ps5_score ?? 50,
    PS6: latest.ps6_score ?? null,
    PS7: latest.ps7_score ?? 50,
    PS8: latest.ps8_score ?? null
  };
}

function mapBackendFinding(item) {
  return finding(
    item.id,
    item.project_id,
    item.standard,
    item.severity,
    item.title,
    item.description || item.title,
    parseJsonArray(item.recommended_actions_json).join("; ") || "Upload evidence and request review.",
    item.verification_status || "pending_review",
    item.score || 70,
    "Backend database"
  );
}

function mapBackendEvidence(item) {
  return {
    id: item.id,
    projectId: item.project_id,
    linkedStandard: item.standard,
    evidenceType: item.evidence_type,
    status: normalizeStatus(item.status),
    summary: item.summary || "",
    source: item.source || "",
    capturedAt: (item.created_at || "").slice(0, 10),
    confidential: Boolean(item.confidential),
    uploadedBy: item.uploaded_by || "Demo team",
    verifiedBy: item.verified_by || "",
    originalFilename: item.original_filename || item.source || "",
    fileSize: item.file_size || null,
    mimeType: item.mime_type || "",
    sha256Hash: item.sha256_hash || "",
    uploadedAt: item.uploaded_at || item.created_at || ""
  };
}

function mapBackendGrievance(item) {
  return {
    id: item.id,
    projectId: item.project_id,
    submittedBy: item.submitted_by,
    anonymous: item.anonymous,
    originalText: item.original_text,
    translatedText: item.translated_text || item.original_text,
    aiSummary: item.ai_summary,
    category: item.category,
    linkedStandard: item.linked_standard,
    severity: item.severity,
    confidentialityLevel: item.confidentiality_level,
    status: normalizeStatus(item.status),
    referenceNumber: item.reference_number,
    receivedAt: item.created_at
  };
}

function mapBackendAction(item) {
  return {
    id: item.id,
    projectId: item.project_id,
    findingId: item.finding_id || "",
    grievanceId: item.grievance_id || "",
    owner: item.owner,
    title: item.title,
    description: item.description || "",
    status: normalizeStatus(item.status),
    dueDate: item.due_date || "",
    completedAt: item.completed_at || "",
    aiCreated: String(item.description || "").toLowerCase().includes("ai-created")
  };
}

function mapBackendAudit(item) {
  return {
    id: item.id,
    entityType: item.entity_type,
    entityId: item.entity_id,
    actor: item.actor,
    action: item.action,
    detail: item.detail || "",
    createdAt: item.created_at
  };
}

function parseJsonArray(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeStatus(value) {
  return String(value || "")
    .split("_")
    .map((part) => part ? part[0].toUpperCase() + part.slice(1) : "")
    .join(" ");
}

function project() {
  return state.projects.find((item) => item.id === state.selectedProjectId);
}

function selectedScores() {
  return state.scores[state.selectedProjectId] || null;
}

function statusForScore(score) {
  if (!Number.isFinite(score)) return "Pending";
  if (score >= 80) return "Green";
  if (score >= 50) return "Amber";
  return "Red";
}

function hasComplianceScore(projectId = state.selectedProjectId) {
  const scores = state.scores[projectId];
  return Boolean(scores) && standards.some((standard) => Number.isFinite(scores[standard.code]));
}

function isBaselinePendingProject(item = project()) {
  if (!item) return false;
  return item.baselineStatus === "baseline_pending" || item.reportStatus === "needs_ocr" || !hasComplianceScore(item.id);
}

function projectStatusLabel(item = project()) {
  if (!item) return "Baseline pending";
  if (item.reportStatus === "needs_ocr") return "Needs OCR";
  if (item.baselineStatus === "human_verified") return "Human verified";
  if (item.baselineStatus === "ai_baseline_created" || item.reportStatus === "ai_analyzed") return "AI analyzed";
  if (hasComplianceScore(item.id)) return "AI analyzed";
  return "Baseline pending";
}

function projectStatusClass(item = project()) {
  const label = projectStatusLabel(item).toLowerCase().replace(/\s+/g, "-");
  if (label === "ai-analyzed") return "amber";
  if (label === "human-verified") return "green";
  if (label === "needs-ocr") return "red";
  return "pending";
}

function readinessText(score) {
  return Number.isFinite(score) ? `${score}/100` : "Baseline pending";
}

function scoreOrPending(score) {
  return Number.isFinite(score) ? String(score) : "Pending";
}

function severityClass(value) {
  return value.toLowerCase().replace(/\s+/g, "-");
}

function projectItems(collection) {
  return state[collection].filter((item) => item.projectId === state.selectedProjectId);
}

function roleKey(role = state.role) {
  if (role === "Lender") return "lender";
  if (role === "Reviewer") return "regulator";
  return String(role)
    .toLowerCase()
    .replace(/\s*\/\s*/g, "-")
    .replace(/\s+/g, "-");
}

function average(scores) {
  if (!scores) return null;
  const values = Object.values(scores).filter((value) => Number.isFinite(value));
  if (!values.length) return null;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function canReviewEvidence() {
  return reviewerRoles.has(state.role);
}

function canViewConfidentialGrievance(item) {
  if (!["Confidential", "Retaliation-risk"].includes(item.confidentialityLevel)) return true;
  return state.role !== "Developer";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function icon(name) {
  const paths = {
    layout: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="18" height="7"/>',
    spark: '<path d="M12 3l1.7 5.1L19 10l-5.3 1.9L12 17l-1.7-5.1L5 10l5.3-1.9L12 3Z"/><path d="M19 16l.7 2.1L22 19l-2.3.9L19 22l-.7-2.1L16 19l2.3-.9L19 16Z"/>',
    matrix: '<path d="M4 4h16v16H4z"/><path d="M4 10h16M4 16h16M10 4v16M16 4v16"/>',
    vault: '<path d="M4 8h16v12H4z"/><path d="M8 8V6a4 4 0 018 0v2"/><circle cx="12" cy="14" r="2"/>',
    message: '<path d="M4 5h16v11H8l-4 4V5z"/><path d="M8 9h8M8 13h5"/>',
    check: '<path d="M4 12l5 5L20 6"/><path d="M4 20h16"/>',
    rule: '<path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>',
    upload: '<path d="M12 16V4"/><path d="M7 9l5-5 5 5"/><path d="M5 20h14"/>',
    play: '<path d="M8 5v14l11-7z"/>',
    verify: '<path d="M20 6L9 17l-5-5"/>',
    alert: '<path d="M12 3l10 18H2L12 3z"/><path d="M12 9v5M12 17h.01"/>',
    lock: '<rect x="5" y="10" width="14" height="10"/><path d="M8 10V7a4 4 0 018 0v3"/>'
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.layout}</svg>`;
}

function installIcons() {
  document.querySelectorAll("[data-icon]").forEach((node) => {
    node.innerHTML = icon(node.dataset.icon);
  });
}

function setupChrome() {
  const sidebarToggle = document.querySelector(".sidebar-toggle");
  const sidebarCollapsed = localStorage.getItem("hydrocomply-sidebar") === "collapsed";
  document.body.classList.toggle("sidebar-collapsed", sidebarCollapsed);
  sidebarToggle.setAttribute("aria-expanded", String(!sidebarCollapsed));
  sidebarToggle.setAttribute("aria-label", sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar");
  sidebarToggle.setAttribute("title", sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar");

  sidebarToggle.addEventListener("click", () => {
    const collapsed = document.body.classList.toggle("sidebar-collapsed");
    localStorage.setItem("hydrocomply-sidebar", collapsed ? "collapsed" : "expanded");
    sidebarToggle.setAttribute("aria-expanded", String(!collapsed));
    sidebarToggle.setAttribute("aria-label", collapsed ? "Expand sidebar" : "Collapse sidebar");
    sidebarToggle.setAttribute("title", collapsed ? "Expand sidebar" : "Collapse sidebar");
  });

  const projectSelect = document.querySelector("#projectSelect");
  renderProjectOptions();
  projectSelect.value = state.selectedProjectId;
  projectSelect.addEventListener("change", (event) => {
    state.selectedProjectId = event.target.value;
    saveState();
    render();
  });

  const roleSelect = document.querySelector("#roleSelect");
  roleSelect.innerHTML = [
    "Developer",
    "Lender / Investor",
    "Consultant",
    "Regulator / Reviewer",
    "Community Liaison",
    "Admin"
  ].map((role) => `<option value="${role}">${role}</option>`).join("");
  if (state.role === "Lender") state.role = "Lender / Investor";
  if (state.role === "Reviewer") state.role = "Regulator / Reviewer";
  if (![...roleSelect.options].some((option) => option.value === state.role)) state.role = "Lender / Investor";
  roleSelect.value = state.role;
  roleSelect.addEventListener("change", (event) => {
    state.role = event.target.value;
    saveState();
    ensureDemoLogin(state.role).catch(() => toast("Backend unavailable. Local demo fallback remains available."));
    currentView = "dashboard";
    renderPortalShell(roleKey());
    render();
    setView("dashboard");
    toast(`Role switched to ${state.role}. Portal navigation and verification controls updated.`);
  });

  document.querySelector(".nav-cta").addEventListener("click", () => {
    navigate("portal", "analyst");
  });
  document.querySelector("#backHomeBtn")?.addEventListener("click", () => navigate("publicHome"));
  document.querySelector("#switchRoleBtn")?.addEventListener("click", () => navigate("roleSelect"));

  installIcons();
}

function setView(viewName) {
  currentView = viewName;
  document.body.dataset.view = viewName;
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === viewName));
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === viewName));
  const title = portalViewTitle(viewName);
  document.querySelector("#viewEyebrow").textContent = title.eyebrow;
  document.querySelector("#viewTitle").textContent = title.title;
  if (viewName === "dashboard") {
    requestAnimationFrame(() => {
      animateMagicCounters();
      observeResultCards();
    });
  }
}

function render() {
  renderLandingPage();
  renderRoleSelection();
  renderCommunityPortal();
  renderPortalShell(roleKey());
  renderProjectOptions();
  document.querySelector("#projectSelect").value = state.selectedProjectId;
  renderDashboard();
  renderAnalyst();
  renderMatrix();
  renderEvidence();
  renderGrievances();
  renderValidationQuestionnaires();
  renderControversyCenter();
  renderManualVerificationDesk();
  renderLenderTrustReport();
  renderActions();
  renderRules();
  renderAudit();
  renderReports();
  updateTopbarContext();
  installIcons();
  animateMagicCounters();
  observeResultCards();
}

function updateTopbarContext() {
  const roleBadge = document.querySelector("#roleBadge");
  if (roleBadge) roleBadge.textContent = `${state.role} - ${state.dataSource || "Local demo fallback"}`;
}

function renderProjectOptions() {
  const projectSelect = document.querySelector("#projectSelect");
  if (!projectSelect) return;
  projectSelect.innerHTML = state.projects.map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join("");
}

function renderLandingPage() {
  const critical = state.findings.filter((item) => item.severity === "Critical" && item.status !== "Closed").length;
  const unresolvedGrievances = state.grievances.filter((item) => !["Closed", "Verified"].includes(item.status)).length;
  document.querySelector("#publicHome").innerHTML = `
    <header class="public-nav">
      <div class="public-brand">
        <span class="brand-mark">HCN</span>
        <div>
          <strong>HydroComply Nepal</strong>
          <small>IFC compliance intelligence</small>
        </div>
      </div>
      <nav class="public-links" aria-label="Public navigation">
        <a href="#product">Product</a>
        <a href="#portals">Portals</a>
        <a href="#ai-analysis">AI Analysis</a>
        <a href="#community">Community</a>
        <a href="#demo">Demo</a>
      </nav>
      <div class="public-nav-actions">
        <button class="btn" type="button" data-route="community">Submit Concern</button>
        <button class="btn primary" type="button" data-route="roles">Open Demo</button>
      </div>
    </header>

    <section id="product" class="public-hero">
      <div class="hero-copy">
        <p class="eyebrow">IFC compliance intelligence</p>
        <h2>AI compliance for hydropower finance.</h2>
        <p>Verify reports, community feedback, worker feedback, and manual checks before lender review.</p>
        <div class="hero-trust-list">
          <span>PDF evidence extraction</span>
          <span>Ground feedback validation</span>
          <span>Lender audit trail</span>
        </div>
        <div class="hero-actions">
          <button class="btn primary" type="button" data-route="developer">Run AI Scan</button>
          <button class="btn secondary" type="button" data-route="lender">Open Lender Demo</button>
          <button class="btn link" type="button" data-route="community">Submit Concern</button>
        </div>
      </div>
      <div class="hero-ai-pipeline trust-engine" aria-label="HydroComply Trust Verification Pipeline visual">
        <article class="trust-engine-card">
          <header class="trust-engine-header">
            <div>
              <p>HydroComply Trust Engine</p>
              <strong>Middle Tamor HPP</strong>
            </div>
            <span>Live verification</span>
          </header>

          <div class="trust-flow" aria-hidden="true">
            <span></span><span></span><span></span><span></span>
          </div>

          <section class="trust-step trust-step-claims">
            <span class="trust-step-index">01</span>
            <h3>Document Claims</h3>
            <p>EIA uploaded &bull; 216 pages</p>
            <div class="trust-tags">
              <span>PS1 claims extracted</span>
              <span>PS5 claims extracted</span>
              <span>PS7 claims extracted</span>
            </div>
          </section>

          <section class="trust-step trust-step-feedback">
            <span class="trust-step-index">02</span>
            <h3>Ground Feedback</h3>
            <p>42 community responses &bull; 18 worker responses</p>
            <div class="trust-tags">
              <span>Consultation</span>
              <span>Compensation</span>
              <span>Worker safety</span>
            </div>
          </section>

          <section class="trust-step trust-step-controversy">
            <span class="trust-step-index">03</span>
            <h3>Controversy Check</h3>
            <p>3 contested claims found</p>
            <strong class="trust-badge warning">Manual verification required</strong>
          </section>

          <section class="trust-step trust-step-manual">
            <span class="trust-step-index">04</span>
            <h3>Manual Verification</h3>
            <p>Controversies reviewed before lender release</p>
            <strong class="trust-badge processing">Evidence review open</strong>
          </section>

          <section class="trust-step trust-step-report">
            <span class="trust-step-index">05</span>
            <h3>Lender Trust Report</h3>
            <p>Final Trust: 56/100</p>
            <strong class="trust-badge risk">High Risk</strong>
          </section>
        </article>

        <article class="trust-mini-card mini-ps5">
          <strong>PS5 Contested Claim</strong>
          <p>Report: "Compensation paid fairly"</p>
          <span>Feedback: "Partly / No"</span>
        </article>
        <article class="trust-mini-card mini-ps1">
          <strong>PS1 Misalignment</strong>
          <p>Report: "Consultation completed"</p>
          <span>Feedback: "Not invited"</span>
        </article>
        <article class="trust-mini-card mini-manual">
          <strong>Manual Verification</strong>
          <p>Site call required</p>
          <span>Evidence request pending</span>
        </article>
      </div>
    </section>

    <section class="credibility-strip" aria-label="Platform proof">
      <span>${state.projects.length} demo project rooms</span>
      <span>${standards.length} IFC Performance Standards</span>
      <span>${critical} critical findings</span>
      <span>${unresolvedGrievances} unresolved grievances</span>
    </section>

    <section class="public-section problem-band">
      <div><p class="eyebrow">Problem</p><h3>Finance teams need proof, not folders.</h3></div>
      <p>HydroComply turns report claims, field feedback, and manual checks into one lender-ready trust record.</p>
    </section>

    <section class="public-section" id="demo">
      <div class="section-heading"><p class="eyebrow">How HydroComply works</p><h3>From project documents to finance-grade accountability.</h3></div>
      <div class="process-grid">
        ${["Upload report", "Check claims", "Compare feedback", "Create trust report"].map((item, index) => `
          <article class="process-card"><span>${index + 1}</span><h3>${item}</h3><p class="muted">${["Add EIA, IEE, ESMP, RAP, or monitoring files.", "Extract commitments and map IFC gaps.", "Compare reports with community and worker feedback.", "Review unresolved risks before financing."][index]}</p></article>
        `).join("")}
      </div>
    </section>

    <section class="public-section" id="portals">
      <div class="section-heading"><p class="eyebrow">Role-based portals</p><h3>One project record, different trust lenses.</h3></div>
      <div class="role-mini-grid">
        ${[
          ["Developer Workspace", "Fix gaps before lender review."],
          ["Lender Review", "Review trust and unresolved risks."],
          ["Consultant Queue", "Verify AI findings and evidence."],
          ["Regulator View", "Check monitoring and commitments."],
          ["Community Portal", "Submit feedback or concerns."],
          ["Community Liaison", "Manage cases and responses."]
        ].map(([title, text]) => `<article><strong>${title}</strong><p>${text}</p></article>`).join("")}
      </div>
    </section>

    <section class="public-section feature-band" id="ai-analysis">
      <div>
        <p class="eyebrow">AI analysis demo</p>
        <h3>Document intelligence built for E&S due diligence.</h3>
        <p>Upload a PDF or paste text. HydroComply extracts evidence, maps standards, detects gaps, and prepares corrective actions while keeping the output reviewable.</p>
      </div>
      <button class="btn primary" type="button" data-route="developer">Run AI Project Scan</button>
    </section>

    <section class="public-section split-proof" id="community">
      <article>
        <p class="eyebrow">Community grievance demo</p>
        <h3>Public intake without exposing technical compliance tools.</h3>
        <p class="muted">Community members submit a concern, receive a reference number, and the system routes the concern to the right IFC risk owner.</p>
      </article>
      <article>
        <p class="eyebrow">Lender trust</p>
        <h3>Financing readiness depends on verified evidence, not uploaded files.</h3>
        <p class="muted">Lenders see blockers, unresolved grievances, missed promises, and the audit trail before making a decision.</p>
      </article>
    </section>

    <section class="public-section proof-section">
      <div class="section-heading"><p class="eyebrow">Demo projects</p><h3>Project rooms already loaded for the MVP.</h3></div>
      <div class="project-proof-grid">
        ${state.projects.map((item) => {
          const score = average(state.scores[item.id]);
          const status = statusForScore(score);
          return `<article class="card"><h3>${escapeHtml(item.name)}</h3><p class="muted">${escapeHtml(item.capacity || "Capacity pending")} - ${escapeHtml(item.district || "Region pending")}</p><span class="status-pill status-${status.toLowerCase()}">${Number.isFinite(score) ? `${score}/100 readiness` : "Baseline pending"}</span></article>`;
        }).join("")}
      </div>
    </section>

    <section class="public-cta">
      <div>
        <p class="eyebrow">Start the demo</p>
        <h3>Open a role-based workspace and inspect the same project record from a different trust lens.</h3>
      </div>
      <button class="btn primary" type="button" data-route="roles">Open Demo</button>
    </section>
  `;

  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => handlePublicRoute(button.dataset.route));
  });
}

function renderRoleSelection() {
  const roleCards = [
    ["Developer Workspace", "Developer", "Fix gaps before lender review.", "DEV"],
    ["Lender Review", "Lender / Investor", "Review trust, evidence, and unresolved risks.", "LND"],
    ["Consultant Queue", "Consultant", "Verify AI findings and evidence.", "CON"],
    ["Regulator View", "Regulator / Reviewer", "Check monitoring and commitments.", "REG"],
    ["Community Portal", "Community Member", "Submit feedback or concerns.", "COM"],
    ["Community Liaison", "Community Liaison", "Manage cases and responses.", "LIA"]
  ];
  document.querySelector("#roleSelection").innerHTML = `
    <header class="public-nav">
      <div class="public-brand"><span class="brand-mark">HCN</span><div><strong>HydroComply Nepal</strong><small>Workspace selection</small></div></div>
      <div class="public-nav-actions"><button class="btn" type="button" data-back-home>Back to Home</button></div>
    </header>
    <section class="role-select-hero">
      <p class="eyebrow">Role-based access</p>
      <h2>Choose your HydroComply workspace</h2>
      <p>Each role sees the same project record through a different trust lens.</p>
    </section>
    <section class="role-card-grid">
      ${roleCards.map(([title, roleValue, description, iconText]) => `
        <button class="role-card" type="button" data-role-choice="${escapeHtml(roleValue)}" data-entry="${roleValue === "Community Member" ? "community" : "dashboard"}">
          <span class="role-card-icon">${escapeHtml(iconText)}</span>
          <strong>${escapeHtml(title)}</strong>
          <p>${escapeHtml(description)}</p>
          <em>Enter workspace</em>
        </button>
      `).join("")}
    </section>
  `;
  document.querySelector("[data-back-home]")?.addEventListener("click", () => navigate("publicHome"));
  document.querySelectorAll("[data-role-choice]").forEach((card) => {
    card.addEventListener("click", () => {
      state.role = card.dataset.roleChoice;
      saveState();
      ensureDemoLogin(state.role).catch(() => toast("Backend unavailable. Local demo fallback remains available."));
      if (card.dataset.entry === "community") navigate("community");
      else navigate("portal", card.dataset.entry);
    });
  });
}

const validationQuestionFallbacks = {
  community: [
    { id: "local-c-1", section: "Information and Consultation", question_text: "Were you informed before major project activities affected your area?", answer_type: "multiple_choice", options: ["Yes", "Partly", "No", "Not sure"], linked_standard: "PS1", topic: "prior_information", risk_weight: "high" },
    { id: "local-c-2", section: "Land and Livelihoods", question_text: "Was land compensation fair and clear to affected households?", answer_type: "multiple_choice", options: ["Yes", "Partly", "No", "Not sure"], linked_standard: "PS5", topic: "compensation_fairness", risk_weight: "critical" },
    { id: "local-c-3", section: "Land and Livelihoods", question_text: "Are there unresolved land, crop, house, or livelihood disputes?", answer_type: "yes_no_with_followup", options: ["Yes", "No", "Not sure"], linked_standard: "PS5", topic: "unresolved_land_disputes", risk_weight: "critical" },
    { id: "local-c-4", section: "Grievance and Trust", question_text: "Are people afraid of retaliation if they complain?", answer_type: "multiple_choice", options: ["No", "Some people are afraid", "Yes", "Prefer not to say"], linked_standard: "PS1", topic: "fear_of_retaliation", risk_weight: "critical" },
    { id: "local-c-5", section: "Grievance and Trust", question_text: "Do you believe the project reports describe community impacts honestly?", answer_type: "multiple_choice", options: ["Yes", "Partly", "No", "Not sure"], linked_standard: "PS1", topic: "report_trust_concern", risk_weight: "critical" }
  ],
  worker: [
    { id: "local-w-1", section: "Employment and Payment", question_text: "Do workers receive wages on time?", answer_type: "multiple_choice", options: ["Yes", "Sometimes delayed", "Often delayed", "Not paid fully", "Not sure"], linked_standard: "PS2", topic: "timely_payment", risk_weight: "critical" },
    { id: "local-w-2", section: "Worker Safety", question_text: "Have workers received safety induction or job-specific safety training?", answer_type: "multiple_choice", options: ["Yes", "Only briefly", "No", "Not sure"], linked_standard: "PS2/PS4", topic: "safety_training", risk_weight: "critical" },
    { id: "local-w-3", section: "Worker Safety", question_text: "Is proper PPE provided and replaced when needed?", answer_type: "multiple_choice", options: ["Yes", "Partly", "No", "Not sure"], linked_standard: "PS2", topic: "ppe_provided", risk_weight: "critical" },
    { id: "local-w-4", section: "Worker Grievance and Trust", question_text: "Are workers afraid of losing work or being punished if they complain?", answer_type: "multiple_choice", options: ["No", "Some workers are afraid", "Yes", "Prefer not to say"], linked_standard: "PS2", topic: "worker_retaliation_fear", risk_weight: "critical" },
    { id: "local-w-5", section: "Worker Grievance and Trust", question_text: "Are there serious worker issues not reflected in official reports?", answer_type: "yes_no_with_followup", options: ["Yes", "No", "Not sure"], linked_standard: "PS2", topic: "hidden_worker_issues", risk_weight: "critical" }
  ]
};

function validationSections() {
  return [...new Set(validationFlow.questions.map((item) => item.section || "Questions"))];
}

function questionsForCurrentSection() {
  const sections = validationSections();
  const section = sections[validationFlow.sectionIndex] || sections[0];
  return validationFlow.questions.filter((item) => (item.section || "Questions") === section);
}

function respondentTypeForConnection(connection, followup = "") {
  if (["Worker", "Contractor worker", "Former worker"].includes(connection)) return "worker";
  if (connection === "Other" && followup === "Working conditions") return "worker";
  if (connection === "Other" && followup === "Both") return "both";
  return "community";
}

async function startValidationQuestionnaire() {
  const projectId = document.querySelector("#validationProject").value;
  const connection = document.querySelector("#validationConnection").value;
  const followup = document.querySelector("#validationFollowup")?.value || "";
  const respondentType = respondentTypeForConnection(connection, followup);
  const questionSet = respondentType === "worker" ? "worker" : "community";
  validationFlow = { step: "questions", projectId, respondentConnection: connection === "Other" ? `Other - ${followup || "Not specified"}` : connection, respondentType, questionSet, sectionIndex: 0, questions: [], answers: {}, loading: true, receipt: null };
  renderCommunityPortal();
  try {
    validationFlow.questions = await fetchValidationQuestions(projectId, questionSet);
  } catch {
    validationFlow.questions = validationQuestionFallbacks[questionSet];
  }
  validationFlow.loading = false;
  renderCommunityPortal();
}

function renderValidationInput(question) {
  const saved = validationFlow.answers[question.id] || {};
  if (question.answer_type === "text") {
    return `<textarea data-validation-answer="${question.id}" placeholder="Write in your own words.">${escapeHtml(saved.answer || "")}</textarea>`;
  }
  const options = question.options || [];
  return `
    <select data-validation-answer="${question.id}">
      <option value="">Select an answer</option>
      ${options.map((option) => `<option value="${escapeHtml(option)}" ${saved.answer === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
    </select>
    ${question.answer_type === "yes_no_with_followup" && saved.answer === "Yes" ? `<textarea data-validation-followup="${question.id}" placeholder="Please add detail for verification.">${escapeHtml(saved.follow_up_text || "")}</textarea>` : ""}
  `;
}

function renderValidationPortal() {
  const project = state.projects.find((item) => item.id === validationFlow.projectId) || state.projects[0];
  const sections = validationSections();
  const currentQuestions = questionsForCurrentSection();
  if (validationFlow.receipt) {
    return `<section class="community-public validation-public"><header class="community-public-header"><button class="btn" type="button" data-community-home>Back to HydroComply</button></header><main class="validation-shell"><section class="validation-card receipt-card"><p class="eyebrow">Validation received</p><h2>Your validation response has been received.</h2><p>Reference number: <strong>${escapeHtml(validationFlow.receipt.reference_number)}</strong></p><p>Your response may be used to compare project reports with ground-level feedback.</p><button class="btn primary" type="button" data-validation-reset>Submit another response</button></section></main></section>`;
  }
  if (validationFlow.step === "screening") {
    return `<section class="community-public validation-public"><header class="community-public-header"><button class="btn" type="button" data-community-home>Back to HydroComply</button><span>English / Nepali</span></header><main class="validation-shell"><section class="validation-card"><p class="eyebrow">Ground-truth validation</p><h2>Help verify what project reports say.</h2><p>Choose a project and answer the questionnaire that matches your connection. You can stay anonymous.</p><div class="field"><label for="validationProject">Hydropower project</label><select id="validationProject">${state.projects.map((item) => `<option value="${item.id}" ${item.id === validationFlow.projectId ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}</select></div><div class="field"><label for="validationConnection">How are you connected to this project?</label><select id="validationConnection">${["Affected landowner", "Nearby resident", "Indigenous community member", "Downstream water user", "Local business", "Worker", "Contractor worker", "Former worker", "Other"].map((item) => `<option>${item}</option>`).join("")}</select></div><div class="field" id="validationFollowupWrap"><label for="validationFollowup">If other, select the closest topic</label><select id="validationFollowup"><option>Community impact</option><option>Working conditions</option><option>Both</option></select></div><button class="btn primary" type="button" data-validation-start>Continue</button></section></main></section>`;
  }
  if (validationFlow.loading) {
    return `<section class="community-public validation-public"><header class="community-public-header"><button class="btn" type="button" data-community-home>Back</button></header><main class="validation-shell"><section class="validation-card"><h2>Loading validation questions...</h2><p>Please wait while HydroComply prepares the questionnaire.</p></section></main></section>`;
  }
  if (validationFlow.step === "review") {
    return `<section class="community-public validation-public"><header class="community-public-header"><button class="btn" type="button" data-community-home>Back to HydroComply</button><span>${escapeHtml(project.name)}</span></header><main class="validation-shell"><section class="validation-card"><p class="eyebrow">Review response</p><h2>Check your answers before submitting.</h2><div class="validation-review">${validationFlow.questions.map((question) => `<article><strong>${escapeHtml(question.question_text)}</strong><p>${escapeHtml(validationFlow.answers[question.id]?.answer || "")}</p>${validationFlow.answers[question.id]?.follow_up_text ? `<small>${escapeHtml(validationFlow.answers[question.id].follow_up_text)}</small>` : ""}</article>`).join("")}</div><div class="toolbar"><button class="btn" type="button" data-validation-back>Back</button><button class="btn primary" type="button" data-validation-submit>Submit validation</button></div></section></main></section>`;
  }
  return `<section class="community-public validation-public"><header class="community-public-header"><button class="btn" type="button" data-community-home>Back to HydroComply</button><span>${escapeHtml(project.name)}</span></header><main class="validation-shell"><section class="validation-card"><div class="wizard-progress"><span>Section ${validationFlow.sectionIndex + 1} of ${sections.length}</span><strong>${escapeHtml(sections[validationFlow.sectionIndex] || "Questions")}</strong></div><div class="question-stack">${currentQuestions.map((question) => `<article class="question-card"><span>${escapeHtml(question.linked_standard || "IFC")}</span><label>${escapeHtml(question.question_text)}</label>${renderValidationInput(question)}</article>`).join("")}</div><div class="toolbar"><button class="btn" type="button" data-validation-prev ${validationFlow.sectionIndex === 0 ? "disabled" : ""}>Back</button><button class="btn primary" type="button" data-validation-next>${validationFlow.sectionIndex === sections.length - 1 ? "Review" : "Next"}</button></div></section></main></section>`;
}

function validationCanContinue() {
  return questionsForCurrentSection().every((question) => (validationFlow.answers[question.id]?.answer || "").trim());
}

async function submitValidationPortal() {
  const payload = { respondent_type: validationFlow.respondentType, respondent_connection: validationFlow.respondentConnection, anonymous: true, gps_allowed: false, photo_allowed: false, answers: validationFlow.questions.map((question) => ({ question_id: question.id, answer: validationFlow.answers[question.id]?.answer || "", follow_up_text: validationFlow.answers[question.id]?.follow_up_text || null })).filter((item) => item.answer) };
  try {
    validationFlow.receipt = await submitValidationResponses(validationFlow.projectId, payload);
    await loadVerificationData(validationFlow.projectId);
  } catch {
    validationFlow.receipt = { reference_number: referenceFor(validationFlow.projectId), status: "local_fallback" };
    state.validationSubmissions.unshift({ id: crypto.randomUUID(), projectId: validationFlow.projectId, ...payload, referenceNumber: validationFlow.receipt.reference_number, createdAt: new Date().toISOString() });
    saveState();
  }
  renderCommunityPortal();
}

function bindValidationPortalEvents() {
  document.querySelector("[data-community-home]")?.addEventListener("click", () => navigate("publicHome"));
  document.querySelector("[data-validation-reset]")?.addEventListener("click", () => {
    validationFlow = { ...validationFlow, step: "screening", receipt: null, answers: {}, questions: [] };
    renderCommunityPortal();
  });
  document.querySelector("[data-validation-start]")?.addEventListener("click", startValidationQuestionnaire);
  document.querySelector("#validationConnection")?.addEventListener("change", (event) => {
    document.querySelector("#validationFollowupWrap").hidden = event.target.value !== "Other";
  });
  if (document.querySelector("#validationConnection")) document.querySelector("#validationFollowupWrap").hidden = document.querySelector("#validationConnection").value !== "Other";
  document.querySelectorAll("[data-validation-answer]").forEach((field) => {
    field.addEventListener("input", () => {
      validationFlow.answers[field.dataset.validationAnswer] = { ...(validationFlow.answers[field.dataset.validationAnswer] || {}), answer: field.value };
      if (field.tagName === "SELECT") renderCommunityPortal();
    });
  });
  document.querySelectorAll("[data-validation-followup]").forEach((field) => {
    field.addEventListener("input", () => {
      validationFlow.answers[field.dataset.validationFollowup] = { ...(validationFlow.answers[field.dataset.validationFollowup] || {}), follow_up_text: field.value };
    });
  });
  document.querySelector("[data-validation-prev]")?.addEventListener("click", () => {
    validationFlow.sectionIndex = Math.max(0, validationFlow.sectionIndex - 1);
    renderCommunityPortal();
  });
  document.querySelector("[data-validation-next]")?.addEventListener("click", () => {
    if (!validationCanContinue()) return toast("Please answer each question in this section.");
    if (validationFlow.sectionIndex >= validationSections().length - 1) validationFlow.step = "review";
    else validationFlow.sectionIndex += 1;
    renderCommunityPortal();
  });
  document.querySelector("[data-validation-back]")?.addEventListener("click", () => {
    validationFlow.step = "questions";
    renderCommunityPortal();
  });
  document.querySelector("[data-validation-submit]")?.addEventListener("click", submitValidationPortal);
}

function renderCommunityPortal() {
  {
    document.querySelector("#communityPortal").innerHTML = renderValidationPortal();
    bindValidationPortalEvents();
    return;
    document.querySelector("#communityPortal").innerHTML = `
      <section class="community-public">
        <header class="community-public-header">
          <button class="btn" type="button" data-community-home>Back to HydroComply</button>
          <div class="community-language">English / नेपाली</div>
        </header>
        <main class="community-phone-card">
          <div class="community-intro">
            <p class="eyebrow">Community Concern Intake</p>
            <h2>Do you have a concern about a hydropower project?</h2>
            <p class="nepali-label">जलविद्युत आयोजनासम्बन्धी गुनासो छ?</p>
            <p>Submit a concern in your own words. You can stay anonymous and receive a reference number.</p>
          </div>
          <form class="community-card" id="communityForm">
            <section class="community-step">
              <span>Step 1</span>
              <label for="communityIdentity">Do you want to stay anonymous?</label>
              <select id="communityIdentity">
                <option value="Anonymous">Stay anonymous</option>
                <option value="Named">Give my name</option>
              </select>
              <input id="communityName" placeholder="Name, optional" />
            </section>
            <section class="community-step">
              <span>Step 2</span>
              <label for="communityText">What happened?</label>
              <textarea id="communityText" placeholder="तपाईंको गुनासो यहाँ लेख्नुहोस् / Write your concern here..."></textarea>
            </section>
            <section class="community-step">
              <span>Step 3</span>
              <label for="communityProject">Which project is this about?</label>
              <select id="communityProject">${state.projects.map((item) => `<option value="${item.id}" ${item.id === state.selectedProjectId ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}</select>
            </section>
            <div class="community-optional-grid">
              <div class="field"><label for="communityPhone">Phone number, optional</label><input id="communityPhone" placeholder="+977..." /></div>
              <div class="field"><label for="communityLocation">Location, optional</label><input id="communityLocation" placeholder="Location" /></div>
              <div class="field"><label for="communityConfidentiality">Confidentiality</label><select id="communityConfidentiality"><option>Private</option><option>Confidential</option><option>Retaliation-risk</option><option>Public anonymized</option></select></div>
              <div class="field"><label for="communityPhoto">Photo upload placeholder</label><input id="communityPhoto" type="file" disabled /></div>
            </div>
            <div class="toolbar"><button class="btn" type="button" id="communityNepaliExample">Load Nepali example</button><button class="btn primary" type="submit">Submit Concern</button></div>
          </form>
          <section id="communityReceipt" class="community-receipt" hidden></section>
        </main>
      </section>
    `;
    document.querySelector("[data-community-home]")?.addEventListener("click", () => navigate("publicHome"));
    document.querySelector("#communityNepaliExample")?.addEventListener("click", () => {
      document.querySelector("#communityText").value = nepaliGrievance;
      document.querySelector("#communityConfidentiality").value = "Confidential";
    });
    document.querySelector("#communityForm")?.addEventListener("submit", submitCommunityConcern);
    return;
  }
  document.querySelector("#communityPortal").innerHTML = `
    <section class="community-shell">
      <header class="community-header">
        <button class="btn" type="button" data-community-home>Back</button>
        <p class="eyebrow">Community Portal / समुदाय पोर्टल</p>
        <h2>Do you have a concern about a hydropower project?</h2>
        <p>Write in simple Nepali or English. You can stay anonymous and you will receive a reference number.</p>
      </header>
      <form class="community-card" id="communityForm">
        <div class="field">
          <label for="communityIdentity">Do you want to give your name or stay anonymous?</label>
          <select id="communityIdentity">
            <option value="Anonymous">Stay anonymous</option>
            <option value="Named">Give my name</option>
          </select>
        </div>
        <div class="field" id="communityNameField">
          <label for="communityName">Name, optional</label>
          <input id="communityName" placeholder="Your name" />
        </div>
        <div class="field">
          <label for="communityText">What happened? Write in your own words.</label>
          <textarea id="communityText" placeholder="तपाईंको गुनासो यहाँ लेख्नुहोस् / Write your concern here..."></textarea>
        </div>
        <div class="field">
          <label for="communityProject">Which project is this about?</label>
          <select id="communityProject">
            ${state.projects.map((item) => `<option value="${item.id}" ${item.id === state.selectedProjectId ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}
          </select>
        </div>
        <div class="community-optional-grid">
          <div class="field"><label for="communityPhone">Phone number, optional</label><input id="communityPhone" placeholder="+977..." /></div>
          <div class="field"><label for="communityLocation">Location, optional</label><input id="communityLocation" placeholder="Ward, village, site area" /></div>
          <div class="field"><label for="communityPhoto">Photo upload placeholder</label><input id="communityPhoto" type="file" disabled /></div>
          <div class="field"><label for="communityConfidentiality">Confidentiality preference</label><select id="communityConfidentiality"><option>Private</option><option>Confidential</option><option>Retaliation-risk</option><option>Public anonymized</option></select></div>
        </div>
        <div class="toolbar">
          <button class="btn" type="button" id="communityNepaliExample">Load Nepali example</button>
          <button class="btn primary" type="submit">Submit Concern</button>
        </div>
      </form>
      <section id="communityReceipt" class="community-receipt" hidden></section>
    </section>
  `;
  document.querySelector("[data-community-home]")?.addEventListener("click", () => navigate("publicHome"));
  document.querySelector("#communityNepaliExample")?.addEventListener("click", () => {
    document.querySelector("#communityText").value = nepaliGrievance;
    document.querySelector("#communityConfidentiality").value = "Confidential";
  });
  document.querySelector("#communityForm")?.addEventListener("submit", submitCommunityConcern);
}

function submitCommunityConcern(event) {
  event.preventDefault();
  const text = document.querySelector("#communityText").value.trim();
  if (!text) {
    toast("Write the concern first.");
    return;
  }
  const projectId = document.querySelector("#communityProject").value;
  const classification = classifyGrievance(text);
  const ref = referenceFor(projectId);
  const item = grievance(crypto.randomUUID(), projectId, document.querySelector("#communityConfidentiality").value, text, classification.category, classification.standard, classification.severity, "New", ref, new Date().toISOString());
  item.submittedBy = document.querySelector("#communityIdentity").value === "Anonymous" ? "Anonymous" : (document.querySelector("#communityName").value.trim() || "Community member");
  item.anonymous = document.querySelector("#communityIdentity").value === "Anonymous";
  item.translatedText = classification.translation;
  state.grievances.unshift(item);

  const linkedFinding = finding(crypto.randomUUID(), projectId, classification.standard, classification.severity, `${classification.category} grievance requires response`, classification.rationale, classification.action, "Open", 82, "Community Portal");
  state.findings.unshift(linkedFinding);
  state.actions.unshift(action(crypto.randomUUID(), projectId, linkedFinding.id, item.id, classification.owner, classification.action.split(".")[0], classification.action, "Open", dueDateFor(classification.severity)));
  state.auditLogs.unshift(audit("Grievance received", `${ref} routed to ${classification.standard} with ${classification.severity} severity.`, "Community Portal", new Date().toISOString()));
  state.selectedProjectId = projectId;
  recalculateScores();
  saveState();

  document.querySelector("#communityReceipt").hidden = false;
  document.querySelector("#communityReceipt").innerHTML = `
    <h3>Your concern has been received.</h3>
    <p>Reference number: <strong>${escapeHtml(ref)}</strong></p>
    <p>Please save this reference number. You can use it to check your complaint status.</p>
    <div class="split-meta">
      <span class="tag">Status: New</span>
      <span class="tag">${escapeHtml(classification.category)}</span>
      <span class="tag">${escapeHtml(classification.standard)}</span>
      <span class="severity severity-${severityClass(classification.severity)}">${escapeHtml(classification.severity)}</span>
    </div>
  `;
  document.querySelector("#communityForm").reset();
  toast(`${ref} created and routed to ${classification.standard}.`);
}

function navigate(route, viewName = "dashboard") {
  currentRoute = route;
  document.body.dataset.route = route;
  document.querySelector("#publicHome").hidden = route !== "publicHome";
  document.querySelector("#roleSelection").hidden = route !== "roleSelect";
  document.querySelector("#communityPortal").hidden = route !== "community";
  document.querySelector("#appShell").hidden = route !== "portal";

  if (route === "portal") {
    currentView = viewName;
    renderPortalShell(roleKey());
    render();
    setView(viewName);
  }
  if (route === "publicHome") renderLandingPage();
  if (route === "roleSelect") renderRoleSelection();
  if (route === "community") renderCommunityPortal();
}

function portalViewTitle(viewName) {
  const key = roleKey();
  if (viewName === "dashboard") {
    return { eyebrow: `${state.role} portal`, title: portalTitles[key] || "Compliance Workspace" };
  }
  const navItem = (portalNav[key] || portalNav.developer).find(([view]) => view === viewName);
  return {
    eyebrow: navItem ? navItem[1] : views[viewName]?.eyebrow || "HydroComply",
    title: views[viewName]?.title || navItem?.[1] || "HydroComply Nepal"
  };
}

function handlePublicRoute(route) {
  if (route === "roles") return navigate("roleSelect");
  if (route === "community") return navigate("community");
  if (route === "lender") {
    state.role = "Lender / Investor";
    saveState();
    ensureDemoLogin(state.role).catch(() => toast("Backend unavailable. Local demo fallback remains available."));
    return navigate("portal", "dashboard");
  }
  if (route === "developer") {
    state.role = "Developer";
    saveState();
    ensureDemoLogin(state.role).catch(() => toast("Backend unavailable. Local demo fallback remains available."));
    return navigate("portal", "analyst");
  }
}

function renderPortalShell(key = roleKey()) {
  const nav = portalNav[key] || portalNav.developer;
  const navList = document.querySelector(".nav-list");
  navList.innerHTML = nav.map(([view, label, iconName]) => `
    <button class="nav-item ${view === currentView ? "active" : ""}" data-view="${view}" type="button">
      <span class="nav-icon" data-icon="${iconName}"></span>
      <span class="nav-label">${escapeHtml(label)}</span>
    </button>
  `).join("");
  navList.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });
}

function complianceMetrics(projectId = state.selectedProjectId) {
  const scores = state.scores[projectId];
  const readiness = average(scores);
  return {
    readiness,
    criticalGaps: state.findings.filter((item) => item.projectId === projectId && item.severity === "Critical" && item.status !== "Closed").length,
    missingEvidence: state.evidence.filter((item) => item.projectId === projectId && ["Missing", "Filed", "Disputed", "Rejected", "Expired"].includes(item.status)).length,
    openGrievances: state.grievances.filter((item) => item.projectId === projectId && !["Closed", "Verified"].includes(item.status)).length,
    overdueActions: state.actions.filter((item) => item.projectId === projectId && item.status === "Overdue").length,
    unverifiedEvidence: state.evidence.filter((item) => item.projectId === projectId && item.status !== "Verified").length,
    highRiskGrievances: state.grievances.filter((item) => item.projectId === projectId && item.severity === "High" && !["Closed", "Verified"].includes(item.status)).length
  };
}

function projectRoomHeader(activeView = currentView) {
  const item = project();
  return `
    <section class="project-room-header">
      <div>
        <p class="eyebrow">Project Room</p>
        <h2>${escapeHtml(item.name)} Project Room</h2>
        <p>${escapeHtml(item.capacity)} - ${escapeHtml(item.river)} - ${escapeHtml(item.district)} - ${escapeHtml(item.status)}</p>
      </div>
      ${projectRoomTabs(activeView)}
    </section>
  `;
}

function projectRoomTabs() {
  const tabs = [
    ["dashboard", "Overview"],
    ["analyst", "AI Scan"],
    ["matrix", "IFC Matrix"],
    ["evidence", "Evidence"],
    ["grievances", "Grievances"],
    ["validation", "Validation"],
    ["controversies", "Controversies"],
    ["manual-verification", "Manual Checks"],
    ["trust-report", "Trust Report"],
    ["actions", "Actions"],
    ["audit", "Audit"],
    ["reports", "Reports"]
  ];
  return `<div class="project-tabs">${tabs.map(([view, label]) => `<button class="${view === currentView ? "active" : ""}" type="button" data-tab-view="${view}">${label}</button>`).join("")}</div>`;
}

function bindProjectRoomControls() {
  document.querySelectorAll("[data-tab-view]").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.tabView));
  });
}

const projectFilterOptions = [
  ["all", "All"],
  ["baseline_pending", "Baseline pending"],
  ["ai_analyzed", "AI analyzed"],
  ["human_verified", "Human verified"],
  ["needs_ocr", "Needs OCR"]
];

function projectMatchesFilter(item) {
  if (projectFilter === "all") return true;
  if (projectFilter === "baseline_pending") return item.baselineStatus === "baseline_pending" || !hasComplianceScore(item.id);
  if (projectFilter === "ai_analyzed") return item.baselineStatus === "ai_baseline_created" || item.reportStatus === "ai_analyzed" || hasComplianceScore(item.id);
  if (projectFilter === "human_verified") return item.baselineStatus === "human_verified";
  if (projectFilter === "needs_ocr") return item.reportStatus === "needs_ocr";
  return true;
}

function renderProjectFilterControls() {
  return `<div class="project-filter-bar" role="group" aria-label="Project filter">
    ${projectFilterOptions.map(([value, label]) => `<button class="${projectFilter === value ? "active" : ""}" type="button" data-project-filter="${value}">${label}</button>`).join("")}
  </div>`;
}

function renderProjectDirectory(title = "Project Dashboard") {
  const rows = state.projects.filter(projectMatchesFilter).map((item) => {
    const score = average(state.scores[item.id]);
    const status = statusForScore(score);
    const openFindings = state.findings.filter((findingItem) => findingItem.projectId === item.id && findingItem.status !== "Closed").length;
    const pending = isBaselinePendingProject(item);
    return `
      <article class="project-directory-row ${item.id === state.selectedProjectId ? "selected" : ""}">
        <div>
          <div class="directory-titleline">
            <h3>${escapeHtml(item.name)}</h3>
            <span class="status-pill status-${projectStatusClass(item)}">${escapeHtml(projectStatusLabel(item))}</span>
          </div>
          <p class="muted">${escapeHtml(item.capacity || "Capacity pending")} - ${escapeHtml(item.river || "River pending")} - ${escapeHtml(item.district || "Region pending")}</p>
          <p class="muted">${pending ? "Report available, AI analysis not yet run." : `${openFindings} open compliance gap(s).`}</p>
        </div>
        <div class="directory-score">
          <strong>${Number.isFinite(score) ? score : "No score"}</strong>
          <span>${pending ? "No compliance score yet" : `${status} readiness`}</span>
        </div>
        <button class="btn" type="button" data-select-project="${item.id}">Inspect</button>
      </article>
    `;
  }).join("");

  return `
    <section class="panel project-directory">
      <div class="panel-header">
        <div>
          <h3>${escapeHtml(title)}</h3>
          <p>Report-backed projects stay baseline pending until a PDF is uploaded and analyzed.</p>
        </div>
        ${renderProjectFilterControls()}
      </div>
      <div class="project-directory-list">${rows || empty("No projects match this filter.")}</div>
    </section>
  `;
}

function bindProjectDirectoryControls() {
  document.querySelectorAll("[data-project-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      projectFilter = button.dataset.projectFilter;
      render();
    });
  });
  document.querySelectorAll("[data-select-project]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedProjectId = button.dataset.selectProject;
      saveState();
      render();
      toast(`${project().name} selected.`);
    });
  });
}

function actionForFinding(item) {
  return projectItems("actions").find((actionItem) => actionItem.findingId === item.id || actionItem.title.toLowerCase().includes(item.standard.toLowerCase()));
}

function evidenceForStandard(standard) {
  return projectItems("evidence").filter((item) => item.linkedStandard === standard);
}

function renderAuditTimelineItem(item) {
  return `
    <article class="audit-event">
      <time>${new Date(item.createdAt).toLocaleString()}</time>
      <div>
        <span class="tag">${escapeHtml(item.actor)}</span>
        <h3>${escapeHtml(item.action)}</h3>
        <p>${escapeHtml(item.detail)}</p>
      </div>
    </article>
  `;
}

function renderDashboard() {
  const key = roleKey();
  if (key === "lender") return renderLenderDashboard();
  if (key === "consultant") return renderConsultantDashboard();
  if (key === "regulator") return renderRegulatorDashboard();
  if (key === "community-liaison") return renderCommunityLiaisonDashboard();
  if (key === "admin") return renderAdminDashboard();
  return renderDeveloperDashboard();
}

function renderDeveloperDashboard() {
  {
    const metrics = complianceMetrics();
    const selectedProject = project();
    const selectedPending = isBaselinePendingProject(selectedProject);
    const priorityFixes = projectItems("findings")
      .filter((item) => ["Critical", "High"].includes(item.severity) && item.status !== "Closed")
      .slice(0, 3);
    const evidenceChecklist = [
      "ESMS",
      "Stakeholder Engagement Plan",
      "Grievance Mechanism",
      "RAP / compensation methodology",
      "Livelihood restoration monitoring",
      "IPP / FPIC applicability evidence"
    ];
    document.querySelector("#dashboard").innerHTML = `
      ${projectRoomHeader("dashboard")}
      ${selectedPending ? `
        <section class="pending-baseline-panel">
          <div>
            <span class="status-pill status-pending">Baseline pending</span>
            <h3>No compliance score yet</h3>
            <p>Report available, AI analysis not yet run. Upload the report in AI Document Scan to extract text and create a reviewed baseline.</p>
          </div>
          <button class="btn primary" type="button" data-hero-view="analyst">Upload report</button>
        </section>
      ` : ""}
      <section class="developer-kpi-grid">
        <article class="score-card"><span>Readiness score</span><strong>${readinessText(metrics.readiness)}</strong><p>${selectedPending ? "Baseline has not been generated from the report yet." : "Current IFC readiness after open gaps and evidence trust are considered."}</p></article>
        <article class="score-card danger"><span>Critical blockers</span><strong>${metrics.criticalGaps}</strong><p>Mandatory evidence gaps before lender review.</p></article>
        <article class="score-card warning"><span>Open grievances</span><strong>${metrics.openGrievances}</strong><p>Community cases still active in this project room.</p></article>
        <article class="score-card warning"><span>Overdue actions</span><strong>${metrics.overdueActions}</strong><p>Commitments past their response date.</p></article>
      </section>

      <section class="developer-workspace">
        <div class="panel priority-panel">
          <div class="panel-header"><div><h3>Priority Fixes Before Lender Review</h3><p>What the project team should fix next.</p></div><button class="btn primary" data-hero-view="analyst" type="button">Run AI scan</button></div>
          <div class="priority-list">
            ${selectedPending ? empty("No findings yet. Run AI analysis after uploading the PDF report.") : priorityFixes.map((item) => {
              const linkedAction = actionForFinding(item);
              return `<article class="priority-item">
                <span class="severity severity-${severityClass(item.severity)}">${escapeHtml(item.standard)} ${escapeHtml(item.severity)}</span>
                <div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.rationale)}</p></div>
                <footer><span>Owner: ${escapeHtml(linkedAction?.owner || ownerFor(item.standard))}</span><span>Due: ${escapeHtml(linkedAction?.dueDate || dueDateFor(item.severity))}</span></footer>
              </article>`;
            }).join("") || empty("No priority fixes are currently open.")}
          </div>
        </div>
        <aside class="panel evidence-next">
          <div class="panel-header"><div><h3>Next Required Evidence</h3><p>Documents most likely to improve lender trust.</p></div></div>
          <div class="checklist">${evidenceChecklist.map((item) => `<label><input type="checkbox" disabled /> <span>${escapeHtml(item)}</span></label>`).join("")}</div>
        </aside>
      </section>

      <section class="panel recent-activity-panel">
        <div class="panel-header"><div><h3>Recent Activity</h3><p>Latest accountability events for this project room.</p></div></div>
        <div class="audit-timeline compact">${state.auditLogs.slice(0, 5).map(renderAuditTimelineItem).join("")}</div>
      </section>
      ${renderProjectDirectory("Project Dashboard")}
    `;
    document.querySelectorAll("[data-hero-view]").forEach((button) => {
      button.addEventListener("click", () => setView(button.dataset.heroView));
    });
    bindProjectRoomControls();
    bindProjectDirectoryControls();
    return;
  }
  const redStandards = standards.filter((standard) => statusForScore(selectedScores()[standard.code]) === "Red").length;
  const overdue = state.actions.filter((item) => item.status === "Overdue").length;
  const unresolvedGrievances = state.grievances.filter((item) => !["Closed", "Verified"].includes(item.status)).length;
  const unverified = state.evidence.filter((item) => item.status !== "Verified").length;
  const metrics = complianceMetrics();
  const portfolioRows = state.projects.map((item) => {
    const score = average(state.scores[item.id]);
    const status = statusForScore(score);
    const openFindings = state.findings.filter((findingItem) => findingItem.projectId === item.id && findingItem.status !== "Closed").length;
    return `
      <div class="project-row">
        <div>
          <h3>${escapeHtml(item.name)}</h3>
          <p class="muted">${escapeHtml(item.capacity)} • ${escapeHtml(item.district)}</p>
        </div>
        <strong>${score}</strong>
        <span class="status-pill status-${status.toLowerCase()}">${status}</span>
        <span>${openFindings} open gaps</span>
        <button class="btn" type="button" data-select-project="${item.id}">Inspect</button>
      </div>
    `;
  }).join("");

  document.querySelector("#dashboard").innerHTML = `
    <section class="portal-hero">
      <div>
        <p class="eyebrow">Developer portal</p>
        <h2>${escapeHtml(project().name)} Project Room</h2>
        <p class="hero-subtitle">Everything here belongs to this hydropower project: AI scans, IFC matrix, evidence, grievances, actions, audit events, and reports.</p>
        ${projectRoomTabs()}
        <div class="hero-actions">
          <button class="btn primary" type="button" data-hero-view="analyst">Run AI document scan</button>
          <button class="btn secondary" type="button" data-hero-view="evidence">Open evidence vault</button>
        </div>
      </div>
      <div class="hero-proof" aria-label="Demo highlights">
        <div class="hero-proof-card">
          <strong>${metrics.readiness}/100</strong>
          <span>IFC readiness score</span>
        </div>
        <div class="hero-proof-card">
          <strong>${metrics.criticalGaps}</strong>
          <span>Critical compliance gaps</span>
        </div>
        <div class="hero-proof-card">
          <strong>${metrics.overdueActions}</strong>
          <span>Overdue accountability actions</span>
        </div>
      </div>
    </section>

    <div class="grid result-grid">
      ${metric("IFC Readiness Score", `${metrics.readiness}/100`, "Current weighted readiness for the selected project.", "", "baseline", { counter: metrics.readiness, suffix: "/100" })}
      ${metric("Critical Gaps", String(metrics.criticalGaps), "Mandatory IFC standards needing urgent corrective evidence.", "", "red", { counter: metrics.criticalGaps })}
      ${metric("Missing Evidence", String(metrics.missingEvidence), "Filed, missing, stale, disputed, or rejected records still not verified.", "", "amber", { counter: metrics.missingEvidence })}
      ${metric("Open Grievances", String(metrics.openGrievances), "Community concerns still active for this project.", "", "blue", { counter: metrics.openGrievances })}
      ${metric("Overdue Actions", String(metrics.overdueActions), "Commitments past their response deadline.", "", "red", { counter: metrics.overdueActions })}
      ${metric("Lender Readiness", `${Math.max(0, metrics.readiness - metrics.criticalGaps * 8)}/100`, "Finance-facing score after critical blockers are considered.", "", "baseline")}
    </div>

    <div class="grid two portfolio-overview" style="margin-top:28px">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Portfolio Risk Board</h3>
            <p>Public project metadata is mixed with clearly marked demo assumptions for compliance gaps.</p>
          </div>
          <span class="tag">${escapeHtml(state.role)} view</span>
        </div>
        ${portfolioRows}
      </section>

      <section class="panel mini-map">
        <div class="panel-header">
          <div>
            <h3>Nepal Hydropower Readiness Map</h3>
            <p>Demo project points show where lender attention is currently needed.</p>
          </div>
        </div>
        <svg class="terrain-svg" viewBox="0 0 560 260" aria-label="Stylized Nepal river corridor map">
          <path class="ridge-path" d="M16 105c64-51 106-54 160-24 44 24 83 31 141 2 70-35 141-19 224 35" />
          <path class="ridge-path" d="M22 155c79-34 125-27 185 10 58 36 115 37 177 2 62-35 109-33 154-9" />
          <path class="ridge-path" d="M58 64c45 13 85 11 120-8 47-26 88-18 119 15 42 45 84 47 143 4" />
          <path class="river-path" d="M50 206c61-30 75-93 134-107 41-10 78 9 117 22 64 22 111 3 147-34 29-29 53-40 82-36" />
          <path class="river-path" d="M183 99c13 42 4 76-27 102" />
          <path class="river-path" d="M326 129c-9 41 0 71 27 91" />
        </svg>
        <span class="map-point amber" style="left:34%;top:49%">Khimti-I</span>
        <span class="map-point" style="left:70%;top:38%">Middle Tamor</span>
        <span class="map-point amber" style="left:49%;top:66%">Seti Khola</span>
      </section>
    </div>

    <section class="panel" style="margin-top:32px">
      <div class="panel-header">
        <div>
          <h3>Selected Project Brief</h3>
          <p>${escapeHtml(project().description)}</p>
        </div>
        <span class="status-pill status-${statusForScore(average(selectedScores())).toLowerCase()}">${statusForScore(average(selectedScores()))}</span>
      </div>
      <div class="grid three">
        ${detail("Capacity", project().capacity)}
        ${detail("River", project().river)}
        ${detail("District", project().district)}
        ${detail("Promoter", project().promoter)}
        ${detail("Status", project().status)}
        ${detail("Commercial operation", project().cod)}
      </div>
    </section>
  `;

  document.querySelectorAll("[data-select-project]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedProjectId = button.dataset.selectProject;
      saveState();
      render();
      toast(`${project().name} selected.`);
    });
  });
  document.querySelectorAll("[data-hero-view]").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.heroView));
  });
  document.querySelectorAll("[data-tab-view]").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.tabView));
  });
}

function metric(label, value, hint, icon = "📌", type = "", counter = null) {
  const counterAttrs = counter
    ? ` data-counter="${counter.counter}" data-prefix="${counter.prefix || ""}" data-suffix="${counter.suffix || ""}"`
    : "";
  return `<div class="metric ${type} result-card"><span class="metric-icon" aria-hidden="true">${icon}</span><span>${escapeHtml(label)}</span><strong${counterAttrs}>${escapeHtml(value)}</strong><p class="muted">${escapeHtml(hint)}</p></div>`;
}

function renderLenderDashboard() {
  {
    const metrics = complianceMetrics();
    const readiness = Number.isFinite(metrics.readiness)
      ? Math.max(0, metrics.readiness - metrics.criticalGaps * 8 - metrics.highRiskGrievances * 4)
      : null;
    const blockers = projectItems("findings").filter((item) => ["Critical", "High"].includes(item.severity) && item.status !== "Closed");
    const verified = projectItems("evidence").filter((item) => item.status === "Verified");
    const filed = projectItems("evidence").filter((item) => item.status === "Filed");
    const disputed = projectItems("evidence").filter((item) => ["Disputed", "Rejected", "Expired"].includes(item.status));
    const required = Math.max(17, projectItems("evidence").length + blockers.length);
    document.querySelector("#dashboard").innerHTML = `
      ${projectRoomHeader("dashboard")}
      <section class="lender-summary">
        <div>
          <p class="eyebrow">Investment Risk Review</p>
          <h2>${escapeHtml(project().name)} is ${Number.isFinite(readiness) ? (readiness >= 75 ? "finance-ready" : "not finance-ready") : "baseline pending"}</h2>
          <p>${Number.isFinite(readiness) ? "Some IFC standards remain unverified or insufficiently evidenced." : "Report available, AI analysis not yet run. No lender score has been generated."}</p>
        </div>
        <div class="readiness-meter"><strong>${readinessText(readiness)}</strong><span>Readiness</span></div>
      </section>
      <section class="trust-panel">
        <article><span>Verified Evidence</span><strong>${verified.length} / ${required} required</strong></article>
        <article><span>Critical Blockers</span><strong>${blockers.filter((item) => item.severity === "Critical").length} open</strong></article>
        <article><span>Grievance Risk</span><strong>${metrics.highRiskGrievances} high-risk unresolved</strong></article>
      </section>
      <section class="panel">
        <div class="panel-header"><div><h3>Blocking Issues</h3><p>Read-only finance review of unresolved IFC blockers.</p></div><span class="status-pill status-${Number.isFinite(readiness) ? (readiness >= 75 ? "green" : "red") : "pending"}">${Number.isFinite(readiness) ? (readiness >= 75 ? "Finance-ready" : "Not finance-ready") : "Baseline pending"}</span><button class="btn primary" type="button" data-report-export>Export lender summary</button></div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>IFC Standard</th><th>Issue</th><th>Severity</th><th>Evidence status</th><th>Owner</th><th>Due date</th></tr></thead>
            <tbody>
              ${blockers.map((item) => {
                const linkedAction = actionForFinding(item);
                const evidenceStatus = evidenceForStandard(item.standard).some((evidenceItem) => evidenceItem.status === "Verified") ? "Verified" : "Unverified";
                return `<tr><td><strong>${escapeHtml(item.standard)}</strong></td><td>${escapeHtml(item.title)}</td><td><span class="severity severity-${severityClass(item.severity)}">${escapeHtml(item.severity)}</span></td><td>${evidenceStatus}</td><td>${escapeHtml(linkedAction?.owner || ownerFor(item.standard))}</td><td>${escapeHtml(linkedAction?.dueDate || dueDateFor(item.severity))}</td></tr>`;
              }).join("")}
            </tbody>
          </table>
        </div>
      </section>
      <section class="lender-body-grid">
        <div class="panel">
          <div class="panel-header"><div><h3>Evidence Trust</h3><p>Uploaded does not mean lender-trusted.</p></div></div>
          <div class="trust-lanes">
            ${[
              ["Verified", verified],
              ["Filed but unverified", filed],
              ["Disputed / rejected", disputed],
              ["Missing", blockers.filter((item) => evidenceForStandard(item.standard).length === 0)]
            ].map(([label, items]) => `<article><strong>${label}</strong><span>${items.length}</span></article>`).join("")}
          </div>
        </div>
        <div class="panel">
          <div class="panel-header"><div><h3>Audit Trail Preview</h3><p>Signals used for lender confidence.</p></div></div>
          <div class="audit-timeline compact">${state.auditLogs.slice(0, 4).map(renderAuditTimelineItem).join("")}</div>
        </div>
      </section>
    `;
    document.querySelector("[data-report-export]")?.addEventListener("click", () => setView("reports"));
    bindProjectRoomControls();
    return;
  }
  const metrics = complianceMetrics();
  const readiness = Math.max(0, metrics.readiness - metrics.criticalGaps * 8 - metrics.highRiskGrievances * 4);
  const blockers = projectItems("findings").filter((item) => ["Critical", "High"].includes(item.severity) && item.status !== "Closed").slice(0, 5);
  const verified = projectItems("evidence").filter((item) => item.status === "Verified").length;
  const required = Math.max(standards.length * 2 + blockers.length, projectItems("evidence").length + blockers.length);
  document.querySelector("#dashboard").innerHTML = `
    <section class="portal-hero lender-hero">
      <div>
        <p class="eyebrow">Lender / Investor portal</p>
        <h2>${escapeHtml(project().name)} - Lender Risk Review</h2>
        <p class="hero-subtitle">Can this project be trusted for financing? This view focuses on verified evidence, unresolved blockers, grievance history, missed promises, and audit trail.</p>
      </div>
      <div class="readiness-block"><strong>${readiness}/100</strong><span>Readiness</span><em>${readiness >= 75 ? "Finance-ready" : "Not finance-ready"}</em></div>
    </section>
    <div class="grid result-grid">
      ${metric("Projects under review", String(state.projects.length), "Portfolio records available for lender diligence.", "", "baseline")}
      ${metric("Unverified evidence", String(metrics.unverifiedEvidence), "Filed evidence still awaiting reviewer trust.", "", "amber")}
      ${metric("Unresolved critical findings", String(metrics.criticalGaps), "Critical blockers still open.", "", "red")}
      ${metric("High-risk grievances", String(metrics.highRiskGrievances), "Community risk that may affect financing.", "", "red")}
      ${metric("Missed developer promises", String(metrics.overdueActions), "Overdue actions and commitments.", "", "amber")}
      ${metric("Financing readiness", `${readiness}/100`, "Adjusted for blockers and grievance risk.", "", "baseline")}
    </div>
    <div class="grid two" style="margin-top:28px">
      <section class="panel">
        <div class="panel-header"><div><h3>Blocking issues</h3><p>Items that prevent a clean financing view.</p></div><span class="status-pill status-${readiness >= 75 ? "green" : "red"}">${readiness >= 75 ? "Finance-ready" : "Not finance-ready"}</span></div>
        <div class="analysis-output">${blockers.map(renderFindingCard).join("") || empty("No critical lender blockers remain.")}</div>
      </section>
      <section class="panel">
        <div class="panel-header"><div><h3>Verified Evidence Summary</h3><p>${verified} verified / ${required} required</p></div><button class="btn primary" type="button" data-report-export>Export lender summary</button></div>
        ${detail("Unresolved grievances", `${metrics.highRiskGrievances} high-risk unresolved`)}
        ${detail("Audit trail", state.auditLogs.slice(0, 3).map((item) => item.action).join("; "))}
      </section>
    </div>
  `;
  document.querySelector("[data-report-export]")?.addEventListener("click", () => setView("reports"));
}

function renderConsultantDashboard() {
  {
    const queue = projectItems("findings").filter((item) => item.aiGenerated && item.status !== "Closed");
    const selected = queue[0];
    document.querySelector("#dashboard").innerHTML = `
      ${projectRoomHeader("dashboard")}
      <section class="queue-heading">
        <div><p class="eyebrow">Consultant portal</p><h2>Evidence Verification Queue</h2><p>Review AI findings, linked evidence, confidence, and required reviewer action.</p></div>
      </section>
      <section class="consultant-queue-layout">
        <div class="panel queue-list-panel">
          <div class="panel-header"><div><h3>AI findings needing review</h3><p>${queue.length} open review items</p></div></div>
          <div class="queue-list">
            ${queue.map((item, index) => `<button class="queue-row ${index === 0 ? "active" : ""}" type="button">
              <span>${escapeHtml(item.standard)}</span>
              <strong>${escapeHtml(item.title)}</strong>
              <em>${escapeHtml(item.severity)} - ${item.confidence}% confidence</em>
            </button>`).join("") || empty("No AI findings need review.")}
          </div>
        </div>
        <div class="panel selected-finding-panel">
          ${selected ? `
            <div class="panel-header"><div><p class="eyebrow">${selected.standard} - ${selected.confidence}% confidence</p><h3>${escapeHtml(selected.title)}</h3></div><span class="severity severity-${severityClass(selected.severity)}">${escapeHtml(selected.severity)}</span></div>
            <p class="muted">${escapeHtml(selected.rationale)}</p>
            <div class="finding-detail-grid">
              ${detail("Linked evidence", `${evidenceForStandard(selected.standard).length} records`)}
              ${detail("Evidence status", evidenceForStandard(selected.standard).some((item) => item.status === "Verified") ? "Verified" : "Needs review")}
              ${detail("Recommended action", selected.recommendation)}
            </div>
            <div class="toolbar review-actions"><button class="btn primary" data-finding-review="${selected.id}:Verified" type="button">Verify finding</button><button class="btn danger" data-finding-review="${selected.id}:Rejected" type="button">Reject finding</button><button class="btn warning" data-finding-review="${selected.id}:Needs more evidence" type="button">Needs more evidence</button><button class="btn" data-finding-review="${selected.id}:Comment added" type="button">Add comment</button></div>
          ` : empty("No selected finding.")}
        </div>
      </section>
    `;
    document.querySelectorAll("[data-finding-review]").forEach((button) => {
      button.addEventListener("click", () => {
        const [id, status] = button.dataset.findingReview.split(":");
        const item = state.findings.find((findingItem) => findingItem.id === id);
        item.status = status;
        state.auditLogs.unshift(audit("Consultant reviewed finding", `${item.title} marked ${status}.`, state.role, new Date().toISOString()));
        saveState();
        render();
        toast(`Finding marked ${status}.`);
      });
    });
    bindProjectRoomControls();
    return;
  }
  const queue = projectItems("findings").filter((item) => item.aiGenerated && item.status !== "Closed");
  const disputed = projectItems("evidence").filter((item) => ["Disputed", "Rejected"].includes(item.status));
  document.querySelector("#dashboard").innerHTML = `
    <section class="portal-hero">
      <div><p class="eyebrow">Consultant portal</p><h2>Evidence Review Queue</h2><p class="hero-subtitle">AI suggestions remain reviewable until a qualified reviewer verifies, rejects, or asks for more evidence.</p></div>
    </section>
    <div class="grid result-grid">
      ${metric("AI findings needing review", String(queue.length), "Open AI-generated findings for this project.", "", "amber")}
      ${metric("Evidence awaiting verification", String(projectItems("evidence").filter((item) => item.status === "Filed").length), "Filed by developer, not yet trusted.", "", "amber")}
      ${metric("Disputed documents", String(disputed.length), "Evidence already challenged by reviewers.", "", "red")}
      ${metric("Rejected evidence", String(projectItems("evidence").filter((item) => item.status === "Rejected").length), "Records that failed review.", "", "red")}
      ${metric("Reports to prepare", String(Math.max(1, queue.length - disputed.length)), "Compliance summaries needed for decision makers.", "", "baseline")}
    </div>
    <section class="panel" style="margin-top:28px">
      <div class="panel-header"><div><h3>Review Queue</h3><p>Each item links an AI finding, IFC standard, evidence status, confidence, and reviewer action.</p></div></div>
      <div class="analysis-output">
        ${queue.map((item) => `
          <article class="card review-item">
            <div class="finding-topline"><div><p class="eyebrow">${item.standard} - ${item.confidence}% confidence</p><h3>${escapeHtml(item.title)}</h3></div><span class="severity severity-${severityClass(item.severity)}">${escapeHtml(item.severity)}</span></div>
            <p class="muted">${escapeHtml(item.rationale)}</p>
            <div class="split-meta"><span class="tag">Linked evidence: ${projectItems("evidence").filter((evidenceItem) => evidenceItem.linkedStandard === item.standard).length}</span><span class="tag">${escapeHtml(item.status)}</span></div>
            <div class="toolbar"><button class="btn primary" data-finding-review="${item.id}:Verified" type="button">Verify finding</button><button class="btn danger" data-finding-review="${item.id}:Rejected" type="button">Reject finding</button><button class="btn warning" data-finding-review="${item.id}:Needs more evidence" type="button">Needs more evidence</button><button class="btn" data-finding-review="${item.id}:Comment added" type="button">Add comment</button></div>
          </article>
        `).join("") || empty("No AI findings need review.")}
      </div>
    </section>
  `;
  document.querySelectorAll("[data-finding-review]").forEach((button) => {
    button.addEventListener("click", () => {
      const [id, status] = button.dataset.findingReview.split(":");
      const item = state.findings.find((findingItem) => findingItem.id === id);
      item.status = status;
      state.auditLogs.unshift(audit("Consultant reviewed finding", `${item.title} marked ${status}.`, state.role, new Date().toISOString()));
      saveState();
      render();
      toast(`Finding marked ${status}.`);
    });
  });
}

function renderRegulatorDashboard() {
  const rows = state.projects.map((item) => {
    const metrics = complianceMetrics(item.id);
    return `<div class="project-row"><div><h3>${escapeHtml(item.name)}</h3><p class="muted">${escapeHtml(item.district || "Region pending")}</p></div><strong>${scoreOrPending(metrics.readiness)}</strong><span class="status-pill status-${projectStatusClass(item)}">${escapeHtml(projectStatusLabel(item))}</span><span>${metrics.openGrievances} grievances</span><span>${metrics.overdueActions} overdue</span><button class="btn" data-select-project="${item.id}" type="button">Inspect</button></div>`;
  }).join("");
  document.querySelector("#dashboard").innerHTML = `
    <section class="portal-hero"><div><p class="eyebrow">Regulator / Reviewer portal</p><h2>Project Monitoring & Submission Review</h2><p class="hero-subtitle">Track submission completeness, monitoring status, unresolved commitments, grievance trends, and inspection readiness.</p></div></section>
    <section class="panel"><div class="panel-header"><div><h3>Projects</h3><p>Completeness and inspection readiness overview.</p></div></div>${rows}</section>
    ${renderProjectDirectory("Filtered Project Dashboard")}
  `;
  bindProjectDirectoryControls();
}

function renderCommunityLiaisonDashboard() {
  const grievances = projectItems("grievances").filter((item) => item.status !== "Closed");
  document.querySelector("#dashboard").innerHTML = `
    <section class="portal-hero"><div><p class="eyebrow">Community Liaison portal</p><h2>Community Response Workspace</h2><p class="hero-subtitle">Manage new grievances, confidentiality, response deadlines, escalations, and resolution evidence.</p></div></section>
    <div class="grid result-grid">
      ${metric("New Grievances", String(grievances.filter((item) => item.status === "New").length), "Unacknowledged community concerns.", "", "amber")}
      ${metric("Confidential Cases", String(grievances.filter((item) => item.confidentialityLevel !== "Private").length), "Restricted concerns requiring careful handling.", "", "red")}
      ${metric("Response Deadlines", String(projectItems("actions").filter((item) => item.owner === "Community Liaison").length), "Liaison-owned commitments.", "", "baseline")}
      ${metric("Escalations", String(grievances.filter((item) => item.severity === "High").length), "High severity community cases.", "", "red")}
      ${metric("Resolution Evidence", String(projectItems("evidence").filter((item) => item.linkedStandard === "PS4" || item.linkedStandard === "PS5").length), "Records linked to grievance response.", "", "blue")}
    </div>
    <section class="panel" style="margin-top:28px"><div class="panel-header"><div><h3>Active community cases</h3><p>No delete controls are available for grievances or audit logs.</p></div></div><div class="grievance-list">${grievances.map((item) => routingCard(item)).join("") || empty("No active cases.")}</div></section>
  `;
}

function renderAdminDashboard() {
  document.querySelector("#dashboard").innerHTML = `
    <section class="portal-hero"><div><p class="eyebrow">Admin portal</p><h2>Platform Administration</h2><p class="hero-subtitle">Demo administration for users, roles, IFC standards, transparent rules, AI prompts, and immutable audit logs.</p></div></section>
    <div class="grid three">
      ${detail("Users", "Demo workspace")}
      ${detail("Roles", "Developer, Lender, Consultant, Reviewer, Liaison")}
      ${detail("IFC Standards", "PS1-PS8")}
      ${detail("Rules", `${rules.length} scoring rules`)}
      ${detail("AI Prompts", "Local deterministic analyzer")}
      ${detail("Audit Logs", `${state.auditLogs.length} immutable events`)}
    </div>
  `;
}

function animateMagicCounters() {
  document.querySelectorAll("[data-counter]").forEach((node) => {
    const target = Number(node.dataset.counter);
    if (!Number.isFinite(target)) return;

    const prefix = node.dataset.prefix || "";
    const suffix = node.dataset.suffix || "";
    const duration = 1500;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      node.textContent = `${prefix}${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    node.textContent = `${prefix}0${suffix}`;
    requestAnimationFrame(tick);
  });
}

function observeResultCards() {
  const cards = document.querySelectorAll(".result-card");
  if (!cards.length) return;

  cards.forEach((card, index) => {
    card.style.setProperty("--card-delay", `${index * 150}ms`);
  });

  if (!("IntersectionObserver" in window)) {
    cards.forEach((card) => card.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  cards.forEach((card) => observer.observe(card));
}

function detail(label, value) {
  return `<div class="card"><p class="eyebrow">${label}</p><h3>${escapeHtml(value)}</h3></div>`;
}

function pageHeader(title, subtitle, eyebrow = "") {
  return `
    <section class="ui-page-header">
      ${eyebrow ? `<p class="eyebrow">${escapeHtml(eyebrow)}</p>` : ""}
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(subtitle)}</p>
    </section>
  `;
}

function metricCard(label, value, tone = "") {
  return `<article class="metric-card ${tone}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong></article>`;
}

function statusPill(label, tone = "") {
  return `<span class="status-pill status-${tone || statusTone(label)}">${escapeHtml(label)}</span>`;
}

function statusTone(label = "") {
  const value = String(label).toLowerCase();
  if (value.includes("verified") || value.includes("closed") || value.includes("green") || value.includes("complete")) return "green";
  if (value.includes("high") || value.includes("critical") || value.includes("red") || value.includes("overdue") || value.includes("rejected") || value.includes("missing")) return "red";
  if (value.includes("filed") || value.includes("pending") || value.includes("review") || value.includes("amber") || value.includes("progress")) return "amber";
  return "blue";
}

function compactTable(headers, rows, emptyMessage = "No records yet.") {
  return `
    <div class="table-wrap">
      <table class="table compact-table">
        <thead><tr>${headers.map((item) => `<th>${escapeHtml(item)}</th>`).join("")}</tr></thead>
        <tbody>${rows.length ? rows.join("") : `<tr><td colspan="${headers.length}">${empty(emptyMessage)}</td></tr>`}</tbody>
      </table>
    </div>
  `;
}

function accordion(title, body, open = false) {
  return `<details class="ui-accordion" ${open ? "open" : ""}><summary>${escapeHtml(title)}</summary><div>${body}</div></details>`;
}

function filterTabs(items, active = "All") {
  return `<div class="filter-tabs">${items.map((item) => `<button class="${item === active ? "active" : ""}" type="button">${escapeHtml(item)}</button>`).join("")}</div>`;
}

function shortDate(value) {
  return value ? new Date(value).toLocaleDateString() : "TBD";
}

function shortHash(value) {
  return value ? `${String(value).slice(0, 10)}...` : "Not recorded";
}

function formatFileSize(value) {
  const bytes = Number(value);
  if (!Number.isFinite(bytes) || bytes <= 0) return "Not recorded";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function verificationSourceForClaim(status) {
  const normalized = String(status || "document_claim_only").toLowerCase();
  if (normalized.includes("manual") || normalized.includes("verified")) return "Manual verification";
  if (normalized.includes("contradicted") || normalized.includes("disputed")) return "Ground feedback";
  return "Report only";
}

function revealWords(text) {
  return text
    .split(" ")
    .map((word, index) => `<span class="reveal-word" style="--word-index:${index}">${escapeHtml(word)}</span>`)
    .join(" ");
}

function renderAnalyst() {
  const findings = projectItems("findings").filter((item) => item.aiGenerated);
  const evidenceItems = projectItems("evidence");
  const actions = projectItems("actions");
  const textLength = document.querySelector("#docText")?.value?.length || 0;
  const scanScores = latestComplianceAnalysis?.scores || { overall: average(selectedScores()), ps1: selectedScores()?.PS1, ps5: selectedScores()?.PS5, ps7: selectedScores()?.PS7, risk_level: statusForScore(average(selectedScores())) };
  const scanClaims = latestComplianceAnalysis?.report_claims || currentProjectVerification(state.reportClaims);
  const standardsAnalyzed = latestComplianceAnalysis?.scores?.analyzed_count ?? Object.values(selectedScores() || {}).filter(Number.isFinite).length;
  document.querySelector("#analyst").innerHTML = `
    ${projectRoomHeader("analyst")}
    ${pageHeader("AI Document Scan", "Upload a report and detect IFC gaps.", "Workflow")}

    <section class="scan-workflow">
      <article class="workflow-step panel">
        <div class="step-label">Step 1</div>
        <div class="workflow-step-body">
          <div class="panel-header compact">
            <div><h3>Upload Report</h3><p>Drop a PDF, TXT, or MD file, or load the sample EIA.</p></div>
            <span class="tag">PDF, TXT, MD</span>
          </div>
          <div class="upload-card">
            <input id="docFile" type="file" accept=".pdf,.txt,.md" />
            <div>
              <strong>Drop report here</strong>
              <p>PDF, TXT, or MD supported</p>
            </div>
            <div class="toolbar">
              <label class="btn" for="docFile">Choose file</label>
              <button class="btn" id="loadSample" type="button">Load sample</button>
            </div>
          </div>
          <div class="file-summary">
            <p id="fileStatus" class="file-status">No file uploaded yet.</p>
            <div id="pdfExtractSummary" class="pdf-extract-summary" hidden></div>
            <div class="summary-grid">
              <span>Project: <strong>${escapeHtml(project().name)}</strong></span>
              <span>Characters: <strong>${textLength.toLocaleString()}</strong></span>
              <span>Extraction: <strong>${textLength ? "Ready" : "Pending"}</strong></span>
              <span>Nepali: <strong>${document.querySelector("#docText")?.value?.match(/[\u0900-\u097F]/) ? "Yes" : "No"}</strong></span>
            </div>
          </div>
          <div class="toolbar">
            <button class="btn" type="button" data-view-text>View extracted text</button>
            <button class="btn primary" id="runAnalysisStep1" type="button">Run AI Scan</button>
          </div>
          ${accordion("Paste text manually", `
            <div class="field">
              <label for="docType">Document type</label>
              <select id="docType">
                <option>EIA / ESIA</option>
                <option>IEE</option>
                <option>ESMP</option>
                <option>RAP</option>
                <option>Biodiversity report</option>
                <option>Grievance log</option>
              </select>
            </div>
            <div class="field">
              <label for="docText">Project document text</label>
              <textarea id="docText" placeholder="Paste report text...">${escapeHtml(document.querySelector("#docText")?.value || "")}</textarea>
            </div>
          `)}
          ${accordion("View extracted text", `<pre class="raw-output">${escapeHtml(document.querySelector("#docText")?.value || "No extracted text yet.")}</pre>`)}
        </div>
      </article>

      <article class="workflow-step panel">
        <div class="step-label">Step 2</div>
        <div class="workflow-step-body">
          <div class="panel-header compact">
            <div><h3>Run Analysis</h3><p>Extract claims, map evidence, check gaps, and create actions.</p></div>
          </div>
          <div class="processing-steps clean">
            ${["Extracting text", "Mapping IFC evidence", "Detecting gaps", "Extracting report claims", "Creating actions"].map((step) => `<span>${step}</span>`).join("")}
          </div>
          <div class="toolbar">
            <button class="btn primary" id="runAnalysis" type="button"><span class="tool-icon" data-icon="play"></span>Run AI Scan</button>
            <button class="btn" id="runRealAiAnalysis" type="button">Real AI</button>
            <button class="btn" id="resetDemo" type="button">Reset demo</button>
          </div>
        </div>
      </article>

      <article class="workflow-step panel">
        <div class="step-label">Step 3</div>
        <div class="workflow-step-body">
          <div class="panel-header compact">
            <div><h3>Results</h3><p>Review summary first. Expand details only when needed.</p></div>
          </div>
          <div class="metric-grid four compact-metrics">
            ${metricCard("Overall risk", scanScores.risk_level || statusForScore(scanScores.overall), statusTone(scanScores.risk_level || ""))}
            ${metricCard("Standards analyzed", `${standardsAnalyzed}/8`)}
            ${metricCard("Open critical gaps", findings.filter((item) => item.severity === "Critical").length)}
            ${metricCard("Report claims", scanClaims.length)}
          </div>
          <div class="result-tabs">
            <input checked id="scanTabSummary" name="scanTabs" type="radio" />
            <label for="scanTabSummary">Summary</label>
            <input id="scanTabStandards" name="scanTabs" type="radio" />
            <label for="scanTabStandards">Standards</label>
            <input id="scanTabClaims" name="scanTabs" type="radio" />
            <label for="scanTabClaims">Report Claims</label>
            <input id="scanTabFindings" name="scanTabs" type="radio" />
            <label for="scanTabFindings">Findings</label>
            <input id="scanTabEvidence" name="scanTabs" type="radio" />
            <label for="scanTabEvidence">Evidence</label>
            <input id="scanTabActions" name="scanTabs" type="radio" />
            <label for="scanTabActions">Actions</label>
            <input id="scanTabRaw" name="scanTabs" type="radio" />
            <label for="scanTabRaw">Raw output</label>
            <section class="tab-panel summary-panel">
              <p>${findings.length ? `${findings.length} AI findings and ${actions.length} actions are linked to this project.` : "Run a scan to generate the first compliance analysis."}</p>
            </section>
            <section class="tab-panel standards-panel">
              ${compactTable(["Standard", "Score", "Status"], ["ps1","ps2","ps3","ps4","ps5","ps6","ps7","ps8"].map((key) => `<tr><td>${key.toUpperCase()}</td><td>${scanScores[key] == null ? "Insufficient evidence" : scanScores[key]}</td><td>${statusPill(scanScores[key] == null ? "Insufficient evidence" : statusForScore(scanScores[key]), scanScores[key] == null ? "pending" : statusForScore(scanScores[key]).toLowerCase())}</td></tr>`), "No standard results yet.")}
            </section>
            <section class="tab-panel claims-panel">
              <p class="muted">Report claims are not verified until checked against ground feedback or manual verification.</p>
              ${compactTable(["IFC Standard", "Topic", "Claim", "Page", "Verification source", "Status"], scanClaims.map((claim) => `<tr><td>${escapeHtml(claim.standard)}</td><td>${escapeHtml(claim.topic)}</td><td><strong>${escapeHtml(claim.claim_text)}</strong>${accordion("Source excerpt", `<p>${escapeHtml(claim.source_excerpt || "No excerpt available.")}</p>`)}</td><td>${escapeHtml(String(claim.source_page ?? "N/A"))}</td><td>${escapeHtml(verificationSourceForClaim(claim.verification_status))}</td><td>${statusPill(claim.verification_status || "document_claim_only", "blue")}</td></tr>`), "No report claims extracted yet.")}
            </section>
            <section class="tab-panel findings-panel">
              <div class="analysis-output">${findings.map(renderComplianceFindingFromState).join("") || empty("No findings yet.")}</div>
            </section>
            <section class="tab-panel evidence-panel">
              ${compactTable(["Evidence", "Standard", "Status", "Source"], evidenceItems.map((item) => `<tr><td>${escapeHtml(item.evidenceType)}</td><td>${escapeHtml(item.linkedStandard)}</td><td>${statusPill(item.status, statusClassForEvidence(item.status))}</td><td>${escapeHtml(item.source)}</td></tr>`), "No evidence extracted yet.")}
            </section>
            <section class="tab-panel actions-panel">
              ${compactTable(["Action", "Owner", "Due", "Status"], actions.map((item) => `<tr><td>${escapeHtml(item.title)}</td><td>${escapeHtml(item.owner)}</td><td>${escapeHtml(item.dueDate)}</td><td>${statusPill(item.status)}</td></tr>`), "No actions yet.")}
            </section>
            <section class="tab-panel raw-panel">
              <div id="realAiResult">${latestComplianceAnalysis ? renderComplianceAnalysisResult(latestComplianceAnalysis) : empty("Real AI output appears here after analysis.")}</div>
            </section>
          </div>
        </div>
      </article>
    </section>
  `;

  document.querySelector("#loadSample").addEventListener("click", () => {
    document.querySelector("#docText").value = sampleDocument;
    toast("Sample Middle Tamor EIA text loaded.");
  });
  document.querySelector("#runAnalysis").addEventListener("click", runDocumentAnalysis);
  document.querySelector("#runAnalysisStep1")?.addEventListener("click", runDocumentAnalysis);
  document.querySelector("[data-view-text]")?.addEventListener("click", () => {
    [...document.querySelectorAll(".ui-accordion")]
      .find((item) => item.querySelector("summary")?.textContent === "View extracted text")
      ?.setAttribute("open", "");
  });
  document.querySelector("#runRealAiAnalysis").addEventListener("click", runRealAiAnalysis);
  document.querySelector("#resetDemo").addEventListener("click", () => {
    state = structuredClone(initialState);
    saveState();
    render();
    toast("Demo data reset.");
  });
  document.querySelector("#docFile").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    selectedAnalyzerFile = file;

    const docText = document.querySelector("#docText");
    const fileStatus = document.querySelector("#fileStatus");
    const pdfExtractSummary = document.querySelector("#pdfExtractSummary");

    try {
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      toast(isPdf ? `Extracting ${file.name} with FastAPI...` : `Reading ${file.name}...`);
      if (fileStatus) {
        fileStatus.className = "file-status";
        fileStatus.textContent = isPdf ? `Extracting ${file.name} with FastAPI backend...` : `Reading ${file.name}...`;
      }
      if (pdfExtractSummary) {
        pdfExtractSummary.hidden = true;
        pdfExtractSummary.innerHTML = "";
      }

      let extractedText = "";
      let pdfResult = null;

      if (isPdf) {
        pdfResult = await extractPdfTextFromBackend(file);
        extractedText = pagesTextToDocumentText(pdfResult.pages_text);
      } else {
        extractedText = await file.text();
      }

      if (!extractedText || extractedText.trim().length < 50) {
        const warning = "This PDF may be scanned or image-based. Browser text extraction cannot read scanned images. For the demo, use a text-based PDF or paste the document text manually.";
        docText.value = extractedText || "";
        if (fileStatus) {
          fileStatus.className = "file-status warning";
          fileStatus.textContent = warning;
        }
        toast(warning);
        return;
      }

      docText.value = extractedText;
      const statusMessage = pdfResult
        ? `${pdfResult.filename} loaded. ${pdfResult.pages} pages and ${pdfResult.text_length.toLocaleString()} characters extracted.`
        : `${file.name} loaded. ${extractedText.length.toLocaleString()} characters extracted.`;
      if (fileStatus) {
        fileStatus.className = "file-status";
        fileStatus.textContent = statusMessage;
      }
      if (pdfResult && pdfExtractSummary) {
        pdfExtractSummary.hidden = false;
        pdfExtractSummary.innerHTML = renderPdfExtractSummary(pdfResult);
      }
      toast(statusMessage);
    } catch (error) {
      console.error(error);
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      const message = messageForPdfUploadError(error, file, isPdf);
      if (fileStatus) {
        fileStatus.className = "file-status error";
        fileStatus.textContent = message;
      }
      if (pdfExtractSummary) {
        pdfExtractSummary.hidden = false;
        pdfExtractSummary.innerHTML = `<strong>Extraction failed</strong><p>${escapeHtml(message)}</p>`;
      }
      toast(message);
    }
  });
  bindProjectRoomControls();
}

async function extractPdfTextFromBackend(file) {
  await ensureDemoLogin(state.role);
  if (!state.selectedProjectId) throw new Error("Select a project before running analysis.");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("project_id", state.selectedProjectId);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/pdf/extract`, {
      method: "POST",
      body: formData,
      headers: authHeaders()
    });
  } catch (error) {
    error.code = "BACKEND_OFFLINE";
    throw error;
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const detail = payload?.detail || {};
    const error = new Error(payload?.message || detail.message || "PDF extraction failed.");
    error.status = response.status;
    error.code = payload?.error_code || detail.error || payload?.error || "PDF_EXTRACTION_FAILED";
    error.payload = payload;
    throw error;
  }

  return payload;
}

function pagesTextToDocumentText(pagesText = []) {
  return pagesText
    .map((item) => `--- Page ${item.page} ---\n${item.text || ""}`)
    .join("\n\n")
    .trim();
}

function renderPdfExtractSummary(result) {
  return `
    <div class="pdf-summary-grid">
      <div><span>Filename</span><strong>${escapeHtml(result.filename)}</strong></div>
      <div><span>Pages</span><strong>${result.pages}</strong></div>
      <div><span>Text length</span><strong>${Number(result.text_length).toLocaleString()}</strong></div>
    </div>
    <div class="pdf-preview">
      <span>Preview</span>
      <p>${escapeHtml(result.preview || "No preview returned.")}</p>
    </div>
  `;
}

function messageForPdfUploadError(error, file, isPdf) {
  if (error.code === "OCR_REQUIRED") {
    return "This PDF appears scanned or image-based. OCR is required.";
  }
  if (isPdf && (error.code === "BACKEND_OFFLINE" || error instanceof TypeError)) {
    return "Backend is not running. Start FastAPI with uvicorn main:app --reload.";
  }
  return `Could not read ${file.name}. Please try another file or paste the text manually.`;
}

async function analyzeCompliancePdf(file) {
  await ensureDemoLogin(state.role);
  if (!state.selectedProjectId) throw new Error("Select a project before running analysis.");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("project_id", state.selectedProjectId);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/compliance/analyze`, {
      method: "POST",
      body: formData,
      headers: authHeaders()
    });
  } catch (error) {
    error.code = "BACKEND_OFFLINE";
    throw error;
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.status === "error") {
    const error = new Error(payload?.message || "Compliance analysis failed.");
    error.code = payload?.error_code || "COMPLIANCE_ANALYSIS_FAILED";
    if (response.status === 403) error.code = "FORBIDDEN";
    error.payload = payload;
    throw error;
  }
  return payload;
}

async function runRealAiAnalysis() {
  const resultNode = document.querySelector("#realAiResult");
  if (!selectedAnalyzerFile) {
    toast("Upload a PDF first, then run real AI analysis.");
    if (resultNode) resultNode.innerHTML = empty("Upload a PDF first, then run real AI analysis.");
    return;
  }
  if (!selectedAnalyzerFile.name.toLowerCase().endsWith(".pdf") && selectedAnalyzerFile.type !== "application/pdf") {
    toast("Real AI analysis currently expects a PDF upload.");
    if (resultNode) resultNode.innerHTML = empty("Real AI analysis currently expects a PDF upload.");
    return;
  }

  if (resultNode) {
    resultNode.innerHTML = `<div class="empty-state">Analyzing PDF with FastAPI and AI compliance services...</div>`;
  }
  toast("Running real AI compliance analysis...");

  try {
    latestComplianceAnalysis = await analyzeCompliancePdf(selectedAnalyzerFile);
    state.reportClaims = [
      ...state.reportClaims.filter((item) => item.project_id !== state.selectedProjectId && item.projectId !== state.selectedProjectId),
      ...(latestComplianceAnalysis.report_claims || []).map((item) => ({ ...item, project_id: state.selectedProjectId }))
    ];
    saveState();
    if (resultNode) resultNode.innerHTML = renderComplianceAnalysisResult(latestComplianceAnalysis);
    toast(`AI compliance analysis complete: ${scoreOrPending(latestComplianceAnalysis.scores.overall)}/100, ${latestComplianceAnalysis.scores.risk_level} risk.`);
  } catch (error) {
    const message = messageForComplianceAnalysisError(error);
    if (error.code === "BACKEND_OFFLINE") {
      latestComplianceAnalysis = localComplianceFallbackResult(selectedAnalyzerFile);
      state.reportClaims = [
        ...state.reportClaims.filter((item) => item.project_id !== state.selectedProjectId && item.projectId !== state.selectedProjectId),
        ...(latestComplianceAnalysis.report_claims || []).map((item) => ({ ...item, project_id: state.selectedProjectId }))
      ];
      saveState();
      if (resultNode) resultNode.innerHTML = renderComplianceAnalysisResult(latestComplianceAnalysis, true);
      toast("Backend unavailable. Showing Local demo fallback.");
      return;
    }
    latestComplianceAnalysis = null;
    if (resultNode) resultNode.innerHTML = `<div class="empty-state">${escapeHtml(message)}</div>`;
    toast(message);
  }
}

function messageForComplianceAnalysisError(error) {
  if (error.code === "OCR_REQUIRED") {
    return "This PDF appears scanned or image-based. OCR is required.";
  }
  if (error.code === "BACKEND_OFFLINE" || error instanceof TypeError) {
    return "Backend is not running. Start FastAPI with uvicorn main:app --reload.";
  }
  if (error.code === "MODEL_JSON_PARSE_ERROR") {
    return "The AI model returned an invalid response. Please retry the analysis.";
  }
  if (error.code === "GROQ_API_ERROR") {
    return "Groq analysis failed. Check the backend logs and GROQ_API_KEY.";
  }
  if (error.code === "FORBIDDEN") {
    return "This action is not available for your role.";
  }
  if (error.message?.includes("role") || error.message?.includes("FORBIDDEN")) {
    return "This action is not available for your role.";
  }
  return error.message || "Compliance analysis failed.";
}

function localComplianceFallbackResult(file) {
  const insufficient = (standard) => ({
    standard,
    score: null,
    severity: "Low",
    analysis_status: "insufficient_evidence",
    evidence_coverage: "insufficient",
    confidence: 0,
    title: `Insufficient evidence for ${standard}`,
    summary: "The uploaded document does not contain enough evidence to score this standard.",
    missing_requirements: [],
    partial_compliance: [],
    risks: [],
    recommended_actions: [],
    evidence: []
  });
  return {
    status: "success",
    analysis_id: "local-demo-fallback",
    document: {
      id: "local-demo",
      filename: file.name,
      pages: 0,
      text_length: document.querySelector("#docText")?.value.length || 0,
      contains_nepali: false
    },
    scores: {
      ps1: 80,
      ps2: null,
      ps3: null,
      ps4: null,
      ps5: 40,
      ps6: null,
      ps7: 20,
      ps8: null,
      overall: 47,
      risk_level: "High",
      analyzed_count: 3,
      total_standards: 8,
      overall_confidence: "low",
      coverage_note: "3 of 8 standards were analyzed. Remaining standards require additional documents or manual review."
    },
    summary: "The document contains some environmental and social management information, but important land acquisition, livelihood restoration, and Indigenous Peoples evidence remain weak or missing.",
    findings: [
      {
        standard: "PS1",
        score: 80,
        severity: "Medium",
        analysis_status: "analyzed",
        evidence_coverage: "moderate",
        confidence: 70,
        title: "PS1 mostly addressed but evidence needs strengthening",
        summary: "Some management-system evidence is present, but operational controls need review.",
        missing_requirements: ["Complete ESMS evidence", "Stakeholder engagement plan", "Operational grievance mechanism"],
        partial_compliance: ["EIA-style assessment is present", "Some consultation evidence appears available"],
        risks: ["One-time assessment may not prove ongoing management"],
        recommended_actions: ["Upload ESMS, SEP, grievance mechanism, monitoring matrix, and corrective action register"],
        evidence: [{ text: "Local demo fallback evidence snippet from the uploaded text.", page: 1 }]
      },
      insufficient("PS2"),
      insufficient("PS3"),
      insufficient("PS4"),
      {
        standard: "PS5",
        score: 40,
        severity: "High",
        analysis_status: "analyzed",
        evidence_coverage: "weak",
        confidence: 65,
        title: "PS5 land and livelihood evidence is weak",
        summary: "Land evidence is partial and does not prove replacement-cost or livelihood restoration.",
        missing_requirements: ["Replacement-cost methodology", "Resettlement Action Plan", "Livelihood restoration monitoring", "Post-compensation follow-up"],
        partial_compliance: ["Land or compensation is referenced"],
        risks: ["Compensation may not meet IFC PS5 expectations", "Livelihood restoration may be untracked"],
        recommended_actions: ["Upload RAP, affected household list, payment proof, replacement-cost methodology, and livelihood monitoring records"],
        evidence: [{ text: "Local demo fallback evidence snippet from the uploaded text.", page: 1 }]
      },
      insufficient("PS6"),
      {
        standard: "PS7",
        score: 20,
        severity: "Critical",
        analysis_status: "analyzed",
        evidence_coverage: "weak",
        confidence: 60,
        title: "PS7 Indigenous Peoples evidence is missing",
        summary: "Potential Indigenous Peoples impacts need applicability screening and verification.",
        missing_requirements: ["PS7 applicability screening", "Indigenous Peoples Plan", "FPIC or consultation evidence where applicable", "Benefit-sharing evidence"],
        partial_compliance: ["Ethnic or local communities may be referenced"],
        risks: ["Potential Indigenous Peoples impacts may be unresolved"],
        recommended_actions: ["Verify PS7 applicability and upload IPP, FPIC/consultation records, benefit-sharing plan, and grievance evidence"],
        evidence: [{ text: "Local demo fallback evidence snippet from the uploaded text.", page: 1 }]
      },
      insufficient("PS8")
    ],
    report_claims: [
      {
        standard: "PS1",
        topic: "consultation",
        claim_text: "The report states that public consultation was conducted.",
        source_excerpt: "Local demo fallback evidence snippet from the uploaded text.",
        source_page: 1,
        ai_confidence: 78,
        verification_status: "document_claim_only"
      },
      {
        standard: "PS1",
        topic: "grievance mechanism",
        claim_text: "The report states that a grievance mechanism exists.",
        source_excerpt: "Local demo fallback evidence snippet from the uploaded text.",
        source_page: 1,
        ai_confidence: 72,
        verification_status: "document_claim_only"
      },
      {
        standard: "PS5",
        topic: "compensation",
        claim_text: "The report indicates compensation or land acquisition was addressed.",
        source_excerpt: "Local demo fallback evidence snippet from the uploaded text.",
        source_page: 1,
        ai_confidence: 70,
        verification_status: "document_claim_only"
      }
    ],
    raw_model_used: { translation_model: "not_used", compliance_model: "Local demo fallback" },
    analysis_source: "local_demo_fallback",
    note: "Local demo fallback analyzes only selected standards."
  };
}

function renderComplianceAnalysisResult(result, isLocalFallback = false) {
  const standardKeys = ["ps1", "ps2", "ps3", "ps4", "ps5", "ps6", "ps7", "ps8"];
  const findingsByStandard = new Map((result.findings || []).map((item) => [String(item.standard || "").toUpperCase(), item]));
  const reportClaims = result.report_claims || [];
  return `
    <div class="compliance-result ${isLocalFallback ? "fallback" : ""}">
      ${isLocalFallback ? `<div class="fallback-banner">Local demo fallback. Start the FastAPI backend for real AI analysis.</div>` : ""}
      <section class="compliance-result-summary">
        <div>
          <p class="eyebrow">${escapeHtml(result.document.filename)}</p>
          <h3>${escapeHtml(result.summary)}</h3>
          <div class="split-meta">
            <span class="tag">Pages: ${result.document.pages}</span>
            <span class="tag">Text: ${Number(result.document.text_length).toLocaleString()} chars</span>
            <span class="tag">Nepali detected: ${result.document.contains_nepali ? "Yes" : "No"}</span>
            <span class="tag">Model: ${escapeHtml(result.raw_model_used.compliance_model)}</span>
            <span class="tag">${escapeHtml(result.scores.coverage_note || `${result.scores.analyzed_count || 0} of ${result.scores.total_standards || 8} standards analyzed`)}</span>
            <span class="tag">Actions created: ${escapeHtml(String(result.actions_created ?? 0))}</span>
          </div>
        </div>
        <div class="compliance-score-card">
          <strong>${scoreOrPending(result.scores.overall)}/100</strong>
          <span>${escapeHtml(result.scores.risk_level)} risk</span>
        </div>
      </section>
      <section class="score-strip">
        ${standardKeys.map((key) => {
          const score = result.scores[key];
          const finding = findingsByStandard.get(key.toUpperCase());
          return `<article class="${score == null ? "insufficient" : ""}"><span>${key.toUpperCase()}</span><strong>${score == null ? "Insufficient" : score}</strong><em>${escapeHtml(finding?.analysis_status || (score == null ? "insufficient_evidence" : "analyzed"))}</em></article>`;
        }).join("")}
      </section>
      ${result.scores.analyzed_count < 8 ? `<div class="fallback-banner caution">Lender caution: Some IFC standards were not scored because the uploaded document did not contain enough evidence.</div>` : ""}
      <section class="panel report-claims-panel">
        <div class="panel-header compact">
          <div>
            <h3>Report Claims</h3>
            <p>These claims are extracted from the report. They are not verified until checked against ground feedback or manual verification.</p>
          </div>
        </div>
        ${compactTable(["IFC Standard", "Topic", "Claim", "Page", "Verification source", "Status"], reportClaims.map((claim) => `
          <tr>
            <td>${escapeHtml(claim.standard)}</td>
            <td>${escapeHtml(claim.topic)}</td>
            <td><strong>${escapeHtml(claim.claim_text)}</strong>${accordion("Source excerpt", `<p>${escapeHtml(claim.source_excerpt || "No excerpt returned.")}</p>`)}</td>
            <td>${escapeHtml(String(claim.source_page ?? "N/A"))}</td>
            <td>${escapeHtml(verificationSourceForClaim(claim.verification_status))}</td>
            <td>${statusPill(claim.verification_status || "document_claim_only", "blue")}</td>
          </tr>
        `), "No checkable report claims were extracted.")}
      </section>
      <section class="compliance-findings">
        ${result.findings.map(renderComplianceFinding).join("")}
      </section>
    </div>
  `;
}

function renderComplianceFinding(finding) {
  const insufficient = finding.analysis_status === "insufficient_evidence" || finding.score == null;
  return `
    <article class="compliance-finding-card ${insufficient ? "insufficient" : ""}">
      <div class="finding-topline">
        <div>
          <p class="eyebrow">${escapeHtml(finding.standard)} - ${insufficient ? "Insufficient evidence" : `Score ${finding.score}`}</p>
          <h3>${escapeHtml(finding.title)}</h3>
        </div>
        <span class="severity severity-${insufficient ? "pending" : severityClass(finding.severity)}">${insufficient ? "Insufficient evidence" : escapeHtml(finding.severity)}</span>
      </div>
      <p class="muted">${escapeHtml(finding.summary || "The uploaded document does not contain enough evidence to score this standard.")}</p>
      ${insufficient ? "" : `
        ${listBlock("Missing requirements", finding.missing_requirements)}
        ${listBlock("Partial compliance", finding.partial_compliance)}
        ${listBlock("Risks", finding.risks)}
        ${listBlock("Recommended actions", finding.recommended_actions)}
      `}
      <div class="evidence-snippets">
        <strong>Evidence snippets</strong>
        ${(finding.evidence || []).map((item) => `<blockquote>${escapeHtml(item.text)} <cite>Page ${item.page}</cite></blockquote>`).join("") || "<p class=\"muted\">No evidence snippets returned.</p>"}
      </div>
    </article>
  `;
}

function listBlock(title, items = []) {
  return `<div class="finding-list-block"><strong>${escapeHtml(title)}</strong><ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>None reported.</li>"}</ul></div>`;
}

async function extractPdfText(file) {
  if (!window.pdfjsLib) {
    throw new Error("PDF.js is not loaded. Please check your internet connection or CDN script.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();

    const pageText = textContent.items
      .map((item) => item.str)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    fullText += `\n\n--- Page ${pageNumber} ---\n${pageText}`;
  }

  return fullText.trim();
}

function lenderSummary() {
  const critical = projectItems("findings").filter((item) => item.severity === "Critical" && item.status !== "Closed");
  const high = projectItems("findings").filter((item) => item.severity === "High" && item.status !== "Closed");
  const openActions = projectItems("actions").filter((item) => item.status !== "Closed").length;
  const score = average(selectedScores());
  const status = statusForScore(score);
  return `
    <div class="grid">
      <div class="card">
        <div class="finding-topline">
          <h3>${escapeHtml(project().name)} has ${critical.length} critical and ${high.length} high-risk open findings.</h3>
          <span class="status-pill status-${status.toLowerCase()}">${Number.isFinite(score) ? `${score} overall` : "Baseline pending"}</span>
        </div>
        <p class="muted" style="margin-top:14px">${Number.isFinite(score) ? "The main financing readiness blockers are mandatory PS1 management-system evidence, PS5 land and livelihood follow-up, and PS7 applicability evidence where local ethnic or Indigenous communities may be affected." : "Report available, AI analysis not yet run. No lender readiness findings have been generated."}</p>
      </div>
      <div class="card">
        <h3>${openActions} corrective actions are currently assigned.</h3>
        <p class="muted" style="margin-top:14px">Evidence upload is separated from reviewer verification, so filed documents do not automatically improve the trusted score.</p>
      </div>
    </div>
  `;
}

function renderFindingCard(item) {
  return `
    <article class="card finding-card ${severityClass(item.severity)}">
      <div class="finding-topline">
        <div>
          <p class="eyebrow">${item.standard} • ${escapeHtml(item.source)}</p>
          <h3>${escapeHtml(item.title)}</h3>
        </div>
        <span class="severity severity-${severityClass(item.severity)}">${escapeHtml(item.severity)}</span>
      </div>
      <div class="finding-body">
        <p class="muted">${escapeHtml(item.rationale)}</p>
        <p><strong>Recommended action:</strong> ${escapeHtml(item.recommendation)}</p>
        <div class="split-meta">
          <span class="tag">${escapeHtml(item.status)}</span>
          <span class="tag">${item.confidence}% confidence</span>
          <span class="tag">AI generated</span>
        </div>
      </div>
    </article>
  `;
}

function renderComplianceFindingFromState(item) {
  const linkedEvidence = projectItems("evidence").find((evidenceItem) => evidenceItem.linkedStandard === item.standard);
  return `
    <article class="compliance-finding-card compact">
      <div class="finding-topline">
        <div>
          <p class="eyebrow">${escapeHtml(item.standard)} ${escapeHtml(item.severity)}</p>
          <h3>${escapeHtml(item.title)}</h3>
        </div>
        <span class="severity severity-${severityClass(item.severity)}">${escapeHtml(item.severity)}</span>
      </div>
      <p><strong>Missing:</strong> ${escapeHtml(item.rationale.split(".")[0] || "Evidence needs review")}</p>
      <p><strong>Action:</strong> ${escapeHtml(item.recommendation.split(".")[0])}</p>
      <p><strong>Evidence:</strong> ${escapeHtml(linkedEvidence?.source || "Not filed")}</p>
      ${accordion("Expand details", `<p>${escapeHtml(item.rationale)}</p><p>${escapeHtml(item.recommendation)}</p>`)}
    </article>
  `;
}

function runDocumentAnalysis() {
  const text = document.querySelector("#docText").value.trim();
  if (!text) {
    toast("Paste text or load the sample EIA first.");
    return;
  }

  const lower = text.toLowerCase();
  const detected = [];
  const pushFinding = (standard, severity, title, rationale, recommendation, source = "AI analyst") => {
    detected.push(finding(crypto.randomUUID(), state.selectedProjectId, standard, severity, title, rationale, recommendation, "Open", severity === "Critical" ? 88 : 80, source));
  };

  if (!/esms|environmental and social management system/.test(lower) || !/grievance mechanism|stakeholder engagement plan/.test(lower)) {
    pushFinding("PS1", "Critical", "No complete ESMS or grievance mechanism detected", "The document contains assessment and consultation language, but does not show a living ESMS, stakeholder engagement plan, project grievance mechanism, monitoring responsibility matrix, and corrective-action ownership.", "Upload ESMS, SEP, grievance mechanism procedure, monitoring responsibility matrix, and action tracker.");
  }
  if (/land|compensation|resettlement|livelihood|mua?bza|मुआब्जा/.test(lower) && !/replacement cost|livelihood restoration|post-compensation|household follow-up/.test(lower)) {
    pushFinding("PS5", "High", "Land acquisition evidence lacks replacement-cost and livelihood follow-up", "Land or compensation is referenced, but the document does not clearly prove replacement-cost methodology, livelihood restoration monitoring, or post-compensation follow-up.", "Upload RAP, affected household list, compensation methodology, payment proof, livelihood restoration plan, and monitoring evidence.");
  }
  if (/indigenous|ethnic|janajati|limbu|rai|tamang|magar|newar|gurung/.test(lower) && !/fpic|free, prior|indigenous peoples plan|ipp|consent evidence/.test(lower)) {
    pushFinding("PS7", "Critical", "Indigenous Peoples applicability evidence missing", "The document references ethnic or Indigenous communities, but no Indigenous Peoples Plan, FPIC evidence, benefit-sharing plan, or PS7 applicability decision was detected.", "Verify PS7 applicability. If affected, upload consultation records, consent evidence, IPP, benefit-sharing plan, and grievance mechanism records.");
  }
  if (/biodiversity|aquatic|fish|environmental flow|e-flow|forest/.test(lower) && !/recent monitoring|monitoring log|2026 monitoring|verified biodiversity/.test(lower)) {
    pushFinding("PS6", "High", "Biodiversity and environmental-flow monitoring evidence is weak", "The document mentions biodiversity or aquatic ecology commitments, but recent monitoring evidence was not detected.", "Upload biodiversity monitoring records, environmental-flow logs, aquatic ecology reports, mitigation photos, and reviewer verification.");
  }
  if (/waste|spoil|pollution|water quality|dust|noise/.test(lower) && !/manifest|verified|latest inspection/.test(lower)) {
    pushFinding("PS3", "Medium", "Pollution control evidence needs verification", "Mitigation commitments are present, but verified waste, spoil, water quality, or pollution monitoring evidence is not complete.", "Upload current monitoring logs, waste manifests, spoil disposal records, water quality reports, and inspection notes.");
  }

  if (!detected.length) {
    pushFinding("PS1", "Low", "No major new gaps detected in pasted text", "The analyzer found some management-system language and no obvious mandatory missing evidence. Human review is still required.", "Have a reviewer verify evidence freshness and mark records as verified before lender review.", "AI analyst");
  }

  const existingKeys = new Set(state.findings.map((item) => `${item.projectId}-${item.standard}-${item.title}`));
  let addedFindings = 0;
  detected.forEach((item) => {
    const key = `${item.projectId}-${item.standard}-${item.title}`;
    if (existingKeys.has(key)) return;
    state.findings.push(item);
    existingKeys.add(key);
    addedFindings += 1;
    state.actions.push(action(crypto.randomUUID(), item.projectId, item.id, "", ownerFor(item.standard), item.recommendation.split(".")[0], item.recommendation, item.severity === "Critical" ? "Open" : "Waiting for evidence", dueDateFor(item.severity)));
  });

  addEvidenceFromText(text, detected.filter((item) => state.findings.some((findingItem) => findingItem.id === item.id)));
  recalculateScores();
  state.auditLogs.unshift(audit("Document analyzed", `${addedFindings} new IFC findings generated for ${project().name}.`, "HydroComply AI", new Date().toISOString()));
  saveState();
  render();
  toast(`AI analysis complete: ${addedFindings} new findings, linked evidence, and actions generated.`);
}

function ownerFor(standard) {
  return {
    PS1: "Compliance Manager",
    PS3: "E&S Officer",
    PS5: "Land Officer",
    PS6: "Biodiversity Specialist",
    PS7: "Community Liaison"
  }[standard] || "Project E&S Lead";
}

function dueDateFor(severity) {
  const days = severity === "Critical" ? 10 : severity === "High" ? 18 : 30;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function addEvidenceFromText(text, detected) {
  const excerpt = text.split(/\n+/).find((line) => line.trim().length > 80) || text.slice(0, 180);
  detected.forEach((item) => {
    state.evidence.push(evidence(crypto.randomUUID(), item.projectId, item.standard, `${item.standard} extracted document reference`, "Filed", excerpt.slice(0, 220), "Pasted document text", new Date().toISOString().slice(0, 10), item.standard === "PS5" || item.standard === "PS7"));
  });
}

function recalculateScores() {
  const scores = { ...state.scores[state.selectedProjectId] };
  standards.forEach((standard) => {
    const projectFindings = projectItems("findings").filter((item) => item.standard === standard.code && item.status !== "Closed");
    const projectEvidence = projectItems("evidence").filter((item) => item.linkedStandard === standard.code);
    let score = 88;
    const critical = projectFindings.filter((item) => item.severity === "Critical").length;
    const high = projectFindings.filter((item) => item.severity === "High").length;
    const medium = projectFindings.filter((item) => item.severity === "Medium").length;
    const verified = projectEvidence.filter((item) => item.status === "Verified").length;
    const filed = projectEvidence.filter((item) => item.status === "Filed").length;
    const disputed = projectEvidence.filter((item) => ["Disputed", "Rejected", "Expired"].includes(item.status)).length;
    score -= critical * 32 + high * 22 + medium * 12 + disputed * 16;
    score += verified * 8 + filed * 3;
    if (standard.mandatory && (critical > 0 || (!verified && !filed))) score = Math.min(score, 42);
    scores[standard.code] = Math.max(5, Math.min(96, Math.round(score)));
  });
  state.scores[state.selectedProjectId] = scores;
}

function renderMatrix() {
  const scores = selectedScores();
  const rows = standards.map((standard) => {
    const score = scores?.[standard.code];
    const insufficient = scores && score === null;
    const status = insufficient ? "Insufficient evidence" : statusForScore(score);
    const standardFindings = projectItems("findings").filter((item) => item.standard === standard.code && item.status !== "Closed");
    const linkedEvidence = projectItems("evidence").filter((item) => item.linkedStandard === standard.code);
    const topGap = standardFindings[0]?.title || "No open blocker";
    const evidenceStatus = linkedEvidence.length
      ? `${linkedEvidence.filter((item) => item.status === "Verified").length} verified, ${linkedEvidence.filter((item) => item.status !== "Verified").length} pending`
      : "Missing";
    return `
      <tr>
        <td><strong>${standard.code}</strong><span class="muted block">${escapeHtml(standard.name)}</span></td>
        <td>${insufficient ? "Insufficient evidence" : scoreOrPending(score)}</td>
        <td>${statusPill(status, insufficient ? "pending" : status.toLowerCase())}</td>
        <td>${escapeHtml(topGap)}</td>
        <td>${escapeHtml(evidenceStatus)}</td>
        <td><button class="btn" type="button" data-tab-view="evidence">View</button></td>
      </tr>
      <tr class="detail-row">
        <td colspan="6">${accordion(`${standard.code} details`, `<p>${escapeHtml(whyScore(standard.code, score, standardFindings, linkedEvidence))}</p><p><strong>Required:</strong> ${escapeHtml(standard.evidence)}</p>`)}</td>
      </tr>
    `;
  });
  document.querySelector("#matrix").innerHTML = `
    ${projectRoomHeader("matrix")}
    ${pageHeader("PS Matrix", "Check IFC status quickly.", "IFC PS1-PS8")}
    ${!scores ? `<section class="pending-baseline-panel"><div><span class="status-pill status-pending">Baseline pending</span><h3>No IFC matrix score yet</h3><p>Report available, AI analysis not yet run. The matrix will populate after PDF extraction and analysis.</p></div><button class="btn primary" type="button" data-matrix-upload>Upload report</button></section>` : ""}
    <section class="panel">${compactTable(["Standard", "Score", "Status", "Main gap", "Evidence status", "Action"], rows, "No matrix rows yet.")}</section>
  `;
  document.querySelector("[data-matrix-upload]")?.addEventListener("click", () => setView("analyst"));
  bindProjectRoomControls();
}

function whyScore(code, score, findings, evidenceItems) {
  if (!Number.isFinite(score)) return "Pending because no report-backed baseline analysis has been generated yet.";
  if (score < 50) {
    const top = findings[0];
    return top ? `Capped red because ${top.title.toLowerCase()}.` : "Capped red because mandatory verified evidence is missing.";
  }
  if (score < 80) return `Amber because ${evidenceItems.filter((item) => item.status !== "Verified").length} linked evidence item(s) still need verification or freshness review.`;
  return "Green because core evidence is available and no high-severity open gap is linked to this standard.";
}

function renderEvidence() {
  const reviewDisabled = canReviewEvidence() ? "" : "disabled";
  const reviewHint = canReviewEvidence() ? "" : ` title="${escapeHtml(state.role)} cannot verify evidence in this demo"`;
  {
    const items = projectItems("evidence");
    const filters = ["All", "Verified", "Filed", "Under review", "Expired", "Disputed", "Missing", "Confidential"];
    const tableRows = items.map((item) => `
      <tr>
        <td><strong>${escapeHtml(item.evidenceType)}</strong>${accordion("Snippet", `<p>${escapeHtml(item.summary)}</p>`)}</td>
        <td>${escapeHtml(item.linkedStandard)}</td>
        <td>${escapeHtml(item.source)}</td>
        <td><span title="${escapeHtml(item.sha256Hash || "No hash recorded")}">${escapeHtml(shortHash(item.sha256Hash))}</span><br><small>${escapeHtml(formatFileSize(item.fileSize))}</small></td>
        <td><span class="status-pill status-${statusClassForEvidence(item.status)}">${escapeHtml(item.status)}</span></td>
        <td>${escapeHtml(item.uploadedBy)}</td>
        <td>${escapeHtml(item.verifiedBy || "Not verified")}</td>
        <td>${escapeHtml(item.capturedAt)}</td>
        <td>${item.confidential ? "Confidential" : "Shared"}</td>
        <td class="table-actions"><button class="btn" data-evidence-status="${item.id}:Verified" type="button" ${reviewDisabled}${reviewHint}>Verify</button><button class="btn warning" data-evidence-status="${item.id}:Disputed" type="button" ${reviewDisabled}${reviewHint}>Dispute</button><button class="btn danger" data-evidence-status="${item.id}:Rejected" type="button" ${reviewDisabled}${reviewHint}>Reject</button></td>
      </tr>
    `).join("");
    document.querySelector("#evidence").innerHTML = `
      ${projectRoomHeader("evidence")}
      ${pageHeader("Evidence Vault", "Filed documents do not become trusted until verified.", "Trust repository")}
      <section class="panel compact-note">
        <strong>Filed != Verified.</strong>
        <span>Lenders trust only reviewed evidence.</span>
      </section>
      <section class="panel">
        ${filterTabs(filters)}
      </section>
      <section class="evidence-layout single">
        <div class="panel">
          <div class="table-wrap">
            <table class="table evidence-table">
              <thead><tr><th>Evidence</th><th>IFC Standard</th><th>Source</th><th>File hash</th><th>Status</th><th>Uploaded by</th><th>Verified by</th><th>Date</th><th>Confidentiality</th><th>Action</th></tr></thead>
              <tbody>${tableRows || `<tr><td colspan="10">${empty("No evidence records yet.")}</td></tr>`}</tbody>
            </table>
          </div>
        </div>
      </section>
    `;
    document.querySelectorAll("[data-evidence-status]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!canReviewEvidence()) {
          toast(`${state.role} cannot verify evidence. Switch to Lender, Consultant, or Reviewer.`);
          return;
        }
        const [id, status] = button.dataset.evidenceStatus.split(":");
        const item = state.evidence.find((evidenceItem) => evidenceItem.id === id);
        item.status = status;
        item.verifiedBy = status === "Verified" ? state.role : "";
        state.auditLogs.unshift(audit(`Evidence ${status.toLowerCase()}`, `${item.evidenceType} marked ${status} by ${state.role}.`, state.role, new Date().toISOString()));
        recalculateScores();
        saveState();
        render();
        toast(`Evidence marked ${status}. Score explanation updated.`);
      });
    });
    bindProjectRoomControls();
    return;
  }
  const rows = projectItems("evidence").map((item) => `
    <article class="card">
      <div class="evidence-topline">
        <div>
          <p class="eyebrow">${item.linkedStandard} • ${escapeHtml(item.source)}</p>
          <h3>${escapeHtml(item.evidenceType)}</h3>
        </div>
        <span class="status-pill status-${statusClassForEvidence(item.status)}">${escapeHtml(item.status)}</span>
      </div>
      <p class="muted" style="margin-top:14px">${escapeHtml(item.summary)}</p>
      <div class="split-meta">
        <span class="tag">Captured ${escapeHtml(item.capturedAt)}</span>
        <span class="tag">${item.confidential ? "Confidential" : "Shared"}</span>
        <span class="tag">Uploaded by ${escapeHtml(item.uploadedBy)}</span>
        ${item.verifiedBy ? `<span class="tag">Verified by ${escapeHtml(item.verifiedBy)}</span>` : ""}
      </div>
      <div class="toolbar" style="margin-top:18px">
        <button class="btn" data-evidence-status="${item.id}:Verified" type="button" ${reviewDisabled}${reviewHint}><span class="tool-icon" data-icon="verify"></span>Verify</button>
        <button class="btn warning" data-evidence-status="${item.id}:Disputed" type="button" ${reviewDisabled}${reviewHint}>Dispute</button>
        <button class="btn danger" data-evidence-status="${item.id}:Rejected" type="button" ${reviewDisabled}${reviewHint}>Reject</button>
      </div>
    </article>
  `).join("");
  const tableRows = projectItems("evidence").map((item) => `
    <tr>
      <td><strong>${escapeHtml(item.evidenceType)}</strong></td>
      <td>${escapeHtml(item.linkedStandard)}</td>
      <td>${escapeHtml(item.source)}</td>
      <td><span class="status-pill status-${statusClassForEvidence(item.status)}">${escapeHtml(item.status)}</span></td>
      <td>${escapeHtml(item.uploadedBy)}</td>
      <td>${escapeHtml(item.verifiedBy || "Not verified")}</td>
      <td>${escapeHtml(item.capturedAt)}</td>
      <td>${item.confidential ? "Confidential" : "Shared"}</td>
      <td class="table-actions">
        <button class="btn" data-evidence-status="${item.id}:Verified" type="button" ${reviewDisabled}${reviewHint}>Verify</button>
        <button class="btn warning" data-evidence-status="${item.id}:Disputed" type="button" ${reviewDisabled}${reviewHint}>Dispute</button>
        <button class="btn danger" data-evidence-status="${item.id}:Rejected" type="button" ${reviewDisabled}${reviewHint}>Reject</button>
      </td>
    </tr>
  `).join("");

  document.querySelector("#evidence").innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>${escapeHtml(project().name)} Evidence Vault</h3>
          <p>Developers can file evidence. Only authorized reviewers can verify, dispute, reject, or expire it.</p>
        </div>
        <span class="tag">${canReviewEvidence() ? "Reviewer controls enabled" : "Reviewer controls locked"}</span>
      </div>
      <div class="table-wrap">
        <table class="table evidence-table">
          <thead>
            <tr>
              <th>Evidence name</th>
              <th>IFC standard</th>
              <th>Source document</th>
              <th>Status</th>
              <th>Uploaded by</th>
              <th>Verified by</th>
              <th>Date</th>
              <th>Confidentiality</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
      <div class="evidence-list evidence-card-list">${rows || empty("No evidence records yet.")}</div>
    </section>
  `;

  document.querySelectorAll("[data-evidence-status]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!canReviewEvidence()) {
        toast(`${state.role} cannot verify evidence. Switch to Lender, Consultant, or Reviewer.`);
        return;
      }
      const [id, status] = button.dataset.evidenceStatus.split(":");
      const item = state.evidence.find((evidenceItem) => evidenceItem.id === id);
      item.status = status;
      item.verifiedBy = status === "Verified" ? state.role : "";
      state.auditLogs.unshift(audit(`Evidence ${status.toLowerCase()}`, `${item.evidenceType} marked ${status} by ${state.role}.`, state.role, new Date().toISOString()));
      recalculateScores();
      saveState();
      render();
      toast(`Evidence marked ${status}. Score explanation updated.`);
    });
  });
}

function statusClassForEvidence(status) {
  if (status === "Verified") return "green";
  if (status === "Filed") return "blue";
  if (status === "Expired" || status === "Disputed") return "amber";
  return "red";
}

function renderGrievances() {
  const list = projectItems("grievances").map((item) => `
    <article class="inbox-item">
      <div class="finding-topline">
        <div>
          <p class="eyebrow">${escapeHtml(item.referenceNumber)} • ${new Date(item.receivedAt).toLocaleString()}</p>
          <h3>${escapeHtml(item.aiSummary)}</h3>
        </div>
        <span class="severity severity-${severityClass(item.severity)}">${escapeHtml(item.severity)}</span>
      </div>
      <p class="muted" style="margin-top:14px">${escapeHtml(canViewConfidentialGrievance(item) ? item.originalText : "Confidential grievance details are restricted for this role.")}</p>
      <p style="margin-top:14px"><strong>AI translation:</strong> ${escapeHtml(canViewConfidentialGrievance(item) ? item.translatedText : "Restricted")}</p>
      <div class="split-meta">
        <span class="tag">${escapeHtml(item.linkedStandard)}</span>
        <span class="tag">${escapeHtml(item.confidentialityLevel)}</span>
        <span class="tag">${escapeHtml(item.status)}</span>
        <span class="tag">Immutable record</span>
      </div>
    </article>
  `).join("");
  const selected = projectItems("grievances")[0];

  document.querySelector("#grievances").innerHTML = `
    ${projectRoomHeader("grievances")}
    ${pageHeader("Grievance Center", "Review cases like an inbox.", "Community cases")}
    <section class="panel">${filterTabs(["New", "Under review", "High risk", "Resolved", "Confidential"])}</section>
    <div class="inbox-layout">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Submit Concern</h3>
            <p>Keep public intake simple and human.</p>
          </div>
        </div>
        <div class="form-grid">
          <div class="field">
            <label for="grievanceName">Name or anonymous</label>
            <input id="grievanceName" placeholder="Anonymous" />
          </div>
          <label class="checkbox-row" style="align-self:end">
            <input id="anonymous" type="checkbox" checked />
            Stay anonymous
          </label>
          <div class="field full">
            <label for="grievanceText">Your concern / तपाईंको गुनासो</label>
            <textarea id="grievanceText" placeholder="Write in your own words..."></textarea>
          </div>
          <div class="field">
            <label for="grievanceProject">Project</label>
            <select id="grievanceProject">
              ${state.projects.map((item) => `<option value="${item.id}" ${item.id === state.selectedProjectId ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="confidentiality">Confidentiality</label>
            <select id="confidentiality">
              <option>Private</option>
              <option>Confidential</option>
              <option>Retaliation-risk</option>
              <option>Public anonymized</option>
            </select>
          </div>
          <div class="field">
            <label for="phone">Phone, optional</label>
            <input id="phone" placeholder="+977..." />
          </div>
          <div class="field">
            <label for="location">Location, optional</label>
            <input id="location" placeholder="Ward, village, site area" />
          </div>
        </div>
        <div class="toolbar" style="margin-top:20px">
          <button class="btn" id="loadNepali" type="button">Load example</button>
          <button class="btn primary" id="submitGrievance" type="button"><span class="tool-icon" data-icon="message"></span>Submit</button>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Case Detail</h3>
            <p>Long text stays here, not in every list item.</p>
          </div>
        </div>
        ${selected ? `
          <div class="case-detail">
            <div class="split-meta"><span class="tag">${escapeHtml(selected.referenceNumber)}</span><span class="tag">${escapeHtml(selected.linkedStandard)}</span><span class="tag">${escapeHtml(selected.confidentialityLevel)}</span></div>
            <h3>${escapeHtml(selected.aiSummary)}</h3>
            ${accordion("Original text", `<p>${escapeHtml(canViewConfidentialGrievance(selected) ? selected.originalText : "Confidential grievance details are restricted for this role.")}</p>`)}
            ${accordion("AI summary", `<p>${escapeHtml(selected.aiSummary)}</p><p>${escapeHtml(canViewConfidentialGrievance(selected) ? selected.translatedText : "Restricted")}</p>`)}
            ${accordion("Status history", `<p>Received ${shortDate(selected.receivedAt)}. Current status: ${escapeHtml(selected.status)}.</p>`)}
          </div>
        ` : empty("No grievance selected.")}
        <div id="routingPreview" class="empty-state compact">Submit a new concern to see routing.</div>
      </section>
    </div>

    <section class="panel" style="margin-top:24px">
      <div class="panel-header">
        <div>
          <h3>Inbox</h3>
          <p>Reference, category, severity, status, and age.</p>
        </div>
        <span class="tag">${projectItems("grievances").length} visible records</span>
      </div>
      <div class="grievance-list inbox-list">${list || empty("No grievances for this project yet.")}</div>
    </section>
  `;

  document.querySelector("#loadNepali").addEventListener("click", () => {
    document.querySelector("#grievanceText").value = nepaliGrievance;
    document.querySelector("#confidentiality").value = "Confidential";
    toast("Nepali grievance example loaded.");
  });
  document.querySelector("#submitGrievance").addEventListener("click", submitGrievance);
}

function submitGrievance() {
  const text = document.querySelector("#grievanceText").value.trim();
  if (!text) {
    toast("Write the concern first.");
    return;
  }
  const projectId = document.querySelector("#grievanceProject").value;
  const classification = classifyGrievance(text);
  const ref = referenceFor(projectId);
  const item = grievance(crypto.randomUUID(), projectId, document.querySelector("#confidentiality").value, text, classification.category, classification.standard, classification.severity, "New", ref, new Date().toISOString());
  item.submittedBy = document.querySelector("#anonymous").checked ? "Anonymous" : (document.querySelector("#grievanceName").value.trim() || "Community member");
  item.anonymous = document.querySelector("#anonymous").checked;
  item.translatedText = classification.translation;
  state.grievances.unshift(item);

  const linkedFinding = finding(crypto.randomUUID(), projectId, classification.standard, classification.severity, `${classification.category} grievance requires response`, classification.rationale, classification.action, "Open", 82, "Grievance Center");
  state.findings.unshift(linkedFinding);
  state.actions.unshift(action(crypto.randomUUID(), projectId, linkedFinding.id, item.id, classification.owner, classification.action.split(".")[0], classification.action, "Open", dueDateFor(classification.severity)));
  state.auditLogs.unshift(audit("Grievance received", `${ref} routed to ${classification.standard} with ${classification.severity} severity.`, "Community Portal", new Date().toISOString()));
  state.selectedProjectId = projectId;
  recalculateScores();
  saveState();
  render();
  setView("grievances");
  document.querySelector("#routingPreview").innerHTML = routingCard(item);
  toast(`${ref} created and routed to ${classification.standard}. Developer dashboard updated.`);
}

function classifyGrievance(text) {
  const lower = text.toLowerCase();
  if (/compensation|land|resettlement|livelihood|मुआब्जा|जग्गा/.test(lower)) {
    return {
      category: "Land compensation concern",
      standard: "PS5",
      severity: "High",
      owner: "Land Officer",
      translation: text.includes("मुआब्जा") ? "Our land compensation has still not been fully paid, and when we go to the office no one gives a clear answer." : text,
      rationale: "Land compensation and unclear response create a PS5 risk because affected households may be economically displaced without verified remedy.",
      action: "Developer must review land compensation records and respond within the grievance response deadline."
    };
  }
  if (/blast|traffic|dust|noise|crack|safety|drinking water|road/.test(lower)) {
    return {
      category: "Community health and safety concern",
      standard: "PS4",
      severity: "High",
      owner: "Community Liaison",
      translation: text,
      rationale: "The concern may involve project-related community safety, nuisance, or property damage.",
      action: "Inspect the reported impact, document mitigation, and attach closure evidence."
    };
  }
  if (/waste|spoil|pollution|fish|river|flow|forest/.test(lower)) {
    return {
      category: "Environmental impact concern",
      standard: /fish|forest|flow/.test(lower) ? "PS6" : "PS3",
      severity: "Medium",
      owner: "E&S Officer",
      translation: text,
      rationale: "The concern may affect pollution control, biodiversity, or environmental-flow commitments.",
      action: "Review monitoring records, inspect the site, and upload response evidence."
    };
  }
  return {
    category: "General stakeholder grievance",
    standard: "PS1",
    severity: "Medium",
    owner: "Community Liaison",
    translation: text,
    rationale: "A project-level grievance must be acknowledged, assigned, tracked, and closed with evidence.",
    action: "Acknowledge the grievance, assign a response owner, and document the resolution."
  };
}

function referenceFor(projectId) {
  const prefix = projectId.split("-").map((part) => part[0]).join("").slice(0, 3).toUpperCase();
  return `HCN-${prefix}-${Math.floor(2400 + Math.random() * 600)}`;
}

function routingCard(item) {
  return `
    <article class="card">
      <p class="eyebrow">${escapeHtml(item.referenceNumber)}</p>
      <h3>${escapeHtml(item.aiSummary)}</h3>
      <p class="muted" style="margin-top:14px">${escapeHtml(item.translatedText)}</p>
      <div class="split-meta">
        <span class="tag">${escapeHtml(item.linkedStandard)}</span>
        <span class="severity severity-${severityClass(item.severity)}">${escapeHtml(item.severity)}</span>
        <span class="tag">${escapeHtml(item.confidentialityLevel)}</span>
        <span class="tag">Status: ${escapeHtml(item.status)}</span>
      </div>
    </article>
  `;
}

function currentProjectVerification(collection) {
  return collection.filter((item) => (item.project_id || item.projectId) === state.selectedProjectId);
}

function renderValidationQuestionnaires() {
  const node = document.querySelector("#validation");
  if (!node) return;
  node.innerHTML = `
    ${projectRoomHeader("validation")}
    <div class="split-grid">
      <article class="panel">
        <p class="eyebrow">Public validation portal</p>
        <h3>Routed questionnaires for community members and workers</h3>
        <p class="muted">The public flow screens the respondent connection, loads the matching question set, and creates a receipt after submission.</p>
        <div class="metric-grid small">
          <div class="metric"><span>Community questions</span><strong>${validationQuestionFallbacks.community.length}+</strong></div>
          <div class="metric"><span>Worker questions</span><strong>${validationQuestionFallbacks.worker.length}+</strong></div>
          <div class="metric"><span>Project</span><strong>${escapeHtml(project().name)}</strong></div>
        </div>
        <div class="toolbar"><button class="btn primary" type="button" data-open-validation-portal>Open public validation portal</button></div>
      </article>
      <article class="panel">
        <p class="eyebrow">Question routing</p>
        <div class="question-stack compact">
          <article class="question-card"><span>Step 1</span><label>Screen respondent connection to the project.</label></article>
          <article class="question-card"><span>Step 2</span><label>Route community members to PS1, PS5, PS7, PS8, PS4, and PS6 validation questions.</label></article>
          <article class="question-card"><span>Step 3</span><label>Route workers to PS2 labor, safety, payment, grievance, and trust questions.</label></article>
        </div>
      </article>
    </div>
  `;
  node.querySelector("[data-open-validation-portal]")?.addEventListener("click", () => navigate("community"));
}

function renderControversyCenter() {
  const node = document.querySelector("#controversies");
  if (!node) return;
  const items = currentProjectVerification(state.controversies);
  const fallbackItems = items.length ? items : projectItems("findings")
    .filter((item) => ["Critical", "High"].includes(item.severity))
    .slice(0, 3)
    .map((item) => ({
      standard: item.standard,
      severity: item.severity,
      status: "open",
      report_claim: item.title,
      human_feedback_summary: item.standard === "PS5" ? "Feedback says compensation is partly unresolved." : "Ground feedback needs confirmation.",
      recommended_verification: "Community or worker call required.",
      contradiction_summary: item.title
    }));
  node.innerHTML = `
    ${projectRoomHeader("controversies")}
    ${pageHeader("Controversy Center", "Compare report claims with ground feedback.", "Manual review")}
    <section class="panel">${filterTabs(["Open", "Under manual review", "Resolved", "Dismissed"])}</section>
    <section class="comparison-list">
      ${fallbackItems.length ? fallbackItems.map((item) => `
        <article class="comparison-card">
          <header>
            <div><p class="eyebrow">${escapeHtml(item.standard || "IFC")} contested claim</p><h3>${escapeHtml(item.contradiction_summary || "Manual verification required")}</h3></div>
            ${statusPill(item.severity || "Medium", severityClass(item.severity || "Medium"))}
          </header>
          <div class="comparison-grid">
            <div><span>Report says</span><p>${escapeHtml(item.report_claim || "Claim pending")}</p></div>
            <div><span>Ground feedback says</span><p>${escapeHtml(item.human_feedback_summary || "Feedback pending")}</p></div>
            <div><span>Verification needed</span><p>${escapeHtml(item.recommended_verification || "Manual check required")}</p></div>
          </div>
          <footer><span class="tag">Status: ${escapeHtml(item.status || "open")}</span><button class="btn" type="button" data-refresh-verification>Refresh</button></footer>
        </article>
      `).join("") : emptyState("No controversies detected yet.")}
    </section>
  `;
  node.querySelectorAll("[data-refresh-verification]").forEach((button) => button.addEventListener("click", () => loadVerificationData()));
}

function renderManualVerificationDesk() {
  const node = document.querySelector("#manual-verification");
  if (!node) return;
  const tasks = currentProjectVerification(state.manualTasks);
  const fallbackTasks = tasks.length ? tasks : projectItems("findings").filter((item) => ["Critical", "High"].includes(item.severity)).slice(0, 4).map((item, index) => ({
    id: item.id,
    question_to_verify: item.title,
    verification_method: index % 2 ? "community call" : "document request",
    due_date: actionForFinding(item)?.dueDate || dueDateFor(item.severity),
    required_evidence: item.recommendation,
    assigned_to: ownerFor(item.standard),
    status: index === 0 ? "Open" : index === 1 ? "In Progress" : "Evidence Requested"
  }));
  const columns = ["Open", "In Progress", "Evidence Requested", "Completed", "Unresolved"];
  node.innerHTML = `
    ${projectRoomHeader("manual-verification")}
    ${pageHeader("Manual Verification Desk", "Move contested claims through a task workflow.", "Operations")}
    <div class="toolbar"><button class="btn" type="button" data-refresh-verification>Refresh</button></div>
    <section class="kanban-board">
      ${columns.map((column) => `
        <div class="kanban-column">
          <h3>${escapeHtml(column)}</h3>
          ${fallbackTasks.filter((item) => (item.status || "Open").toLowerCase() === column.toLowerCase()).map((item) => `
            <article class="kanban-card">
              <strong>${escapeHtml(item.question_to_verify || "Verify contested claim")}</strong>
              <span>Method: ${escapeHtml(item.verification_method || "site call")}</span>
              <span>Due: ${escapeHtml(item.due_date || "TBD")}</span>
              ${accordion("Required evidence", `<p>${escapeHtml(item.required_evidence || "Evidence request pending")}</p>`)}
              <button class="btn" type="button">Add note</button>
            </article>
          `).join("") || empty("No tasks.")}
        </div>
      `).join("")}
    </section>
  `;
  node.querySelector("[data-refresh-verification]")?.addEventListener("click", () => loadVerificationData());
}

function renderLenderTrustReport() {
  const node = document.querySelector("#trust-report");
  if (!node) return;
  const report = currentProjectVerification(state.lenderTrustReports).at(-1);
  const metrics = complianceMetrics();
  const trustScore = report?.final_trust_score ?? 56;
  const risk = report?.final_risk_level ?? "High";
  const financingGate = report?.financing_gate || (risk === "High" ? "Manual verification required" : "Ready for lender review");
  const blockerSummary = report?.blocker_summary || "Manual verification required before financing decision.";
  const requiredNextSteps = report?.required_next_steps || "Resolve contested claims, verify filed evidence, and refresh the lender trust report.";
  const evidenceTrustLevel = report?.evidence_trust_level || "Low";
  const controversies = currentProjectVerification(state.controversies);
  const reportClaims = currentProjectVerification(state.reportClaims);
  const contestedClaims = reportClaims.filter((claim) => {
    const status = String(claim.verification_status || "").toLowerCase();
    return status.includes("contradicted") || status.includes("disputed") || status.includes("manual");
  });
  const verifiedClaims = reportClaims.filter((claim) => String(claim.verification_status || "").toLowerCase().includes("verified"));
  const manualPending = currentProjectVerification(state.manualTasks).filter((item) => ["open", "unresolved"].includes(String(item.status || "open").toLowerCase()));
  const blockers = projectItems("findings").filter((item) => ["Critical", "High"].includes(item.severity) && item.status !== "Closed").slice(0, 3);
  node.innerHTML = `
    ${projectRoomHeader("trust-report")}
    ${pageHeader("Lender Trust Report", "Manual verification required before financing.", "Credit risk memo")}
    <section class="panel financing-gate-panel">
      <span>Financing Gate</span>
      <strong>${escapeHtml(financingGate)}</strong>
      <p>${escapeHtml(blockerSummary)}</p>
    </section>
    <section class="panel compact-note lender-strict-language">
      <strong>Filed evidence is not treated as verified.</strong>
      <span>Community feedback contradicts the report claim.</span>
      <span>Manual verification required before financing decision.</span>
    </section>
    <section class="lender-memo">
      <div>
        <span>Final Trust Score</span>
        <strong>${escapeHtml(trustScore)}/100</strong>
      </div>
      <div>
        <span>Risk</span>
        <strong>${escapeHtml(risk)}</strong>
      </div>
      <div>
        <span>Recommendation</span>
        <strong>${escapeHtml(financingGate)}</strong>
      </div>
    </section>
    <div class="toolbar lender-print-actions"><button class="btn primary" type="button" data-print-report>Print / Save PDF</button></div>
    <section class="metric-grid four compact-metrics">
      ${metricCard("Document score", readinessText(metrics.readiness))}
      ${metricCard("Evidence trust", evidenceTrustLevel)}
      ${metricCard("Community validation", report?.community_validation_score ?? "Pending")}
      ${metricCard("Worker validation", report?.worker_validation_score ?? "Pending")}
    </section>
    <section class="panel">
      <div class="panel-header compact"><div><h3>Contested claims requiring verification</h3><p>Report claims stay untrusted until field feedback or manual review resolves them. Community feedback contradicts the report claim.</p></div><button class="btn" type="button" data-tab-view="controversies">View all</button></div>
      ${compactTable(["Standard", "Report claim", "Verification signal", "Status"], (contestedClaims.length ? contestedClaims : reportClaims.slice(0, 3)).map((claim) => `<tr><td>${escapeHtml(claim.standard || "IFC")}</td><td>${escapeHtml(claim.claim_text || "Claim pending extraction")}</td><td>${escapeHtml(verificationSourceForClaim(claim.verification_status))}</td><td>${statusPill(claim.verification_status || "document_claim_only", claim.verification_status === "contradicted_by_feedback" ? "amber" : "blue")}</td></tr>`), "No extracted report claims yet.")}
      ${blockers.length ? accordion("Related high-risk findings", compactTable(["Standard", "Issue", "Severity", "Status"], blockers.map((item) => `<tr><td>${escapeHtml(item.standard)}</td><td>${escapeHtml(item.title)}</td><td>${statusPill(item.severity, severityClass(item.severity))}</td><td>${escapeHtml(item.status)}</td></tr>`), "No unresolved blockers.")) : ""}
    </section>
    <section class="panel">
      <div class="metric-grid four compact-metrics">
        ${metricCard("Claims extracted", reportClaims.length)}
        ${metricCard("Claims verified", verifiedClaims.length)}
        ${metricCard("Feedback received", projectItems("grievances").length + state.validationSubmissions.length)}
        ${metricCard("Manual checks pending", manualPending.length || controversies.length || blockers.length)}
      </div>
      ${accordion("Why this score?", `<p>${escapeHtml(report?.summary || "Some IFC standards remain unverified or insufficiently evidenced.")}</p>`)}
      ${accordion("Required next steps", `<p>${escapeHtml(requiredNextSteps)}</p>`)}
    </section>
    <div class="toolbar"><button class="btn" type="button" data-refresh-verification>Refresh</button></div>
  `;
  node.querySelector("[data-refresh-verification]")?.addEventListener("click", () => loadVerificationData());
  node.querySelector("[data-print-report]")?.addEventListener("click", () => window.print());
  bindProjectRoomControls();
}

function renderActions() {
  const rows = projectItems("actions").map((item) => `
    <article class="card">
      <div class="action-topline">
        <div>
          <p class="eyebrow">Owner: ${escapeHtml(item.owner)} • Due ${escapeHtml(item.dueDate)}</p>
          <h3>${escapeHtml(item.title)}</h3>
        </div>
        <span class="status-pill status-${item.status === "Overdue" ? "red" : item.status === "Verified" || item.status === "Closed" ? "green" : "amber"}">${escapeHtml(item.status)}</span>
      </div>
      <p class="muted" style="margin-top:14px">${escapeHtml(item.description)}</p>
      <div class="split-meta">
        ${item.aiCreated ? `<span class="tag">AI-created</span>` : ""}
        ${item.findingId ? `<span class="tag">Linked finding</span>` : ""}
      </div>
      <div class="toolbar" style="margin-top:18px">
        <button class="btn" data-action-status="${item.id}:In progress" type="button">Start</button>
        <button class="btn" data-action-status="${item.id}:Submitted for review" type="button">Submit evidence</button>
        <button class="btn primary" data-action-status="${item.id}:Verified" type="button"><span class="tool-icon" data-icon="verify"></span>Verify</button>
      </div>
    </article>
  `).join("");

  document.querySelector("#actions").innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>${escapeHtml(project().name)} Corrective Actions</h3>
          <p>Actions connect findings, evidence, grievances, owners, due dates, reviewer comments, and audit history.</p>
        </div>
        <span class="tag">${projectItems("actions").length} actions</span>
      </div>
      <div class="action-list">${rows || empty("No actions have been assigned yet.")}</div>
    </section>
  `;

  document.querySelectorAll("[data-action-status]").forEach((button) => {
    button.addEventListener("click", () => {
      const [id, status] = button.dataset.actionStatus.split(":");
      const item = state.actions.find((actionItem) => actionItem.id === id);
      item.status = status;
      if (status === "Verified") item.completedAt = new Date().toISOString();
      state.auditLogs.unshift(audit(`Action ${status.toLowerCase()}`, `${item.title} marked ${status} by ${state.role}.`, state.role, new Date().toISOString()));
      saveState();
      render();
      toast(`Action moved to ${status}.`);
    });
  });
}

function renderRules() {
  document.querySelector("#rules").innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>Rule Engine</h3>
          <p>AI suggests evidence and findings. The transparent rule engine scores status based on evidence verification, freshness, disputed records, mandatory gates, unresolved grievances, and overdue actions.</p>
        </div>
        <button class="btn primary" id="runRules" type="button"><span class="tool-icon" data-icon="rule"></span>Recalculate</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>Standard</th>
            <th>Rule question</th>
            <th>Required evidence</th>
            <th>Weight</th>
            <th>Freshness</th>
            <th>Gate</th>
          </tr>
        </thead>
        <tbody>
          ${rules.map((rule) => `
            <tr>
              <td><strong>${rule.code}</strong></td>
              <td>${escapeHtml(rule.question)}</td>
              <td>${escapeHtml(rule.evidence)}</td>
              <td>${rule.weight}</td>
              <td>${rule.freshness} days</td>
              <td>${rule.mandatory ? "Mandatory" : "Weighted"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
  `;

  document.querySelector("#runRules").addEventListener("click", () => {
    recalculateScores();
    state.auditLogs.unshift(audit("Rules recalculated", `IFC PS scores recalculated for ${project().name}.`, state.role, new Date().toISOString()));
    saveState();
    render();
    toast("Rules recalculated. PS matrix updated.");
  });
}

function renderAudit() {
  {
    document.querySelector("#audit").innerHTML = `
      ${projectRoomHeader("audit")}
      <section class="audit-page-header">
        <p class="eyebrow">Accountability Trail</p>
        <h2>Who knew what, when, and what changed.</h2>
        <p>Every upload, grievance, finding, review, assignment, and clarification is timestamped without delete controls.</p>
      </section>
      <section class="panel audit-panel">
        <div class="audit-timeline">${state.auditLogs.map(renderAuditTimelineItem).join("")}</div>
      </section>
    `;
    bindProjectRoomControls();
    return;
  }
  const selectedFinding = projectItems("findings").find((item) => item.status !== "Closed") || projectItems("findings")[0];
  document.querySelector("#audit").innerHTML = `
    <div class="grid two">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Who knew what, when, and what did they do?</h3>
            <p>Each gap links to evidence, grievance context, responsible action, owner, deadline, and review status.</p>
          </div>
        </div>
        ${selectedFinding ? renderAccountabilityFinding(selectedFinding) : empty("No finding selected.")}
      </section>
      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Immutable Audit History</h3>
            <p>Every upload, verification, dispute, assignment, lender clarification, and grievance update is timestamped without delete controls.</p>
          </div>
          <span class="tag">${state.auditLogs.length} events</span>
        </div>
        <div class="audit-list">${state.auditLogs.slice(0, 10).map((item) => `
          <div class="timeline-item">
            <p class="eyebrow">${new Date(item.createdAt).toLocaleString()} • ${escapeHtml(item.actor)}</p>
            <h3>${escapeHtml(item.action)}</h3>
            <p class="muted">${escapeHtml(item.detail)}</p>
          </div>
        `).join("")}</div>
      </section>
    </div>
  `;
}

function renderReports() {
  const metrics = complianceMetrics();
  const blockers = projectItems("findings").filter((item) => ["Critical", "High"].includes(item.severity) && item.status !== "Closed");
  document.querySelector("#reports").innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>${escapeHtml(project().name)} Compliance Report</h3>
          <p>Demo export summary for lender, developer, consultant, or regulator review.</p>
        </div>
        <button class="btn primary" type="button" id="copyReport">Copy summary</button>
      </div>
      <div class="grid three">
        ${detail("IFC readiness", readinessText(metrics.readiness))}
        ${detail("Critical gaps", String(metrics.criticalGaps))}
        ${detail("Unverified evidence", String(metrics.unverifiedEvidence))}
        ${detail("Open grievances", String(metrics.openGrievances))}
        ${detail("Overdue actions", String(metrics.overdueActions))}
        ${detail("Status", Number.isFinite(metrics.readiness) ? (metrics.criticalGaps ? "Not finance-ready" : "Review-ready") : "Baseline pending")}
      </div>
      <div class="card" style="margin-top:20px">
        <h3>Blocking issues</h3>
        <p class="muted" style="margin-top:12px">${blockers.map((item) => `${item.standard}: ${item.title}`).join("; ") || "No critical or high blockers remain."}</p>
      </div>
    </section>
  `;
  document.querySelector("#copyReport")?.addEventListener("click", () => {
    const summary = `${project().name} readiness ${readinessText(metrics.readiness)}. Critical gaps: ${metrics.criticalGaps}. Unverified evidence: ${metrics.unverifiedEvidence}. Open grievances: ${metrics.openGrievances}. Overdue actions: ${metrics.overdueActions}.`;
    navigator.clipboard?.writeText(summary);
    toast("Report summary copied.");
  });
}

function renderAccountabilityFinding(item) {
  const linkedActions = projectItems("actions").filter((actionItem) => actionItem.findingId === item.id || actionItem.title.toLowerCase().includes(item.standard.toLowerCase()));
  const linkedEvidence = projectItems("evidence").filter((evidenceItem) => evidenceItem.linkedStandard === item.standard);
  const linkedGrievances = projectItems("grievances").filter((grievanceItem) => grievanceItem.linkedStandard === item.standard);
  return `
    ${renderFindingCard(item)}
    <div class="grid" style="margin-top:24px">
      <div class="card">
        <h3>Linked evidence</h3>
        <p class="muted" style="margin-top:12px">${linkedEvidence.map((evidenceItem) => `${evidenceItem.evidenceType} (${evidenceItem.status})`).join("; ") || "No linked evidence yet."}</p>
      </div>
      <div class="card">
        <h3>Responsible action</h3>
        <p class="muted" style="margin-top:12px">${linkedActions.map((actionItem) => `${actionItem.owner}: ${actionItem.title}, due ${actionItem.dueDate}, ${actionItem.status}`).join("; ") || "No action assigned yet."}</p>
      </div>
      <div class="card">
        <h3>Linked grievance</h3>
        <p class="muted" style="margin-top:12px">${linkedGrievances.map((grievanceItem) => `${grievanceItem.referenceNumber}: ${grievanceItem.aiSummary}, ${grievanceItem.status}`).join("; ") || "No grievance linked."}</p>
      </div>
      <div class="card">
        <h3>Protection controls</h3>
        <p class="muted" style="margin-top:12px">Developers cannot permanently delete grievances. Confidential records are visible only by authorized role. AI outputs remain suggestions until reviewed.</p>
      </div>
    </div>
  `;
}

function empty(text) {
  return `<div class="empty-state">${escapeHtml(text)}</div>`;
}

function toast(message) {
  const node = document.querySelector("#toast");
  node.textContent = message;
  node.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => node.classList.remove("show"), 3200);
}

setupChrome();
document.body.dataset.view = "dashboard";
render();
navigate("publicHome");
loadBackendProjectData();
