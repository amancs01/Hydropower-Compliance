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

const initialState = {
  selectedProjectId: "middle-tamor",
  role: "Lender",
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
    }
  ],
  scores: {
    "khimti": { PS1: 58, PS2: 76, PS3: 46, PS4: 64, PS5: 48, PS6: 71, PS7: 67, PS8: 82 },
    "middle-tamor": { PS1: 38, PS2: 70, PS3: 62, PS4: 66, PS5: 42, PS6: 47, PS7: 34, PS8: 76 },
    "seti-khola": { PS1: 61, PS2: 73, PS3: 49, PS4: 43, PS5: 65, PS6: 68, PS7: 72, PS8: 80 }
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
  ]
};

let state = loadState();
let currentRoute = "publicHome";
let currentView = "dashboard";

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
    ["analyst", "AI Document Scan", "spark"],
    ["matrix", "Compliance Gaps", "matrix"],
    ["evidence", "Evidence Vault", "vault"],
    ["grievances", "Grievances", "message"],
    ["actions", "Actions", "check"],
    ["reports", "Reports", "rule"],
    ["audit", "Audit Trail", "clock"]
  ],
  lender: [
    ["dashboard", "Portfolio Risk", "layout"],
    ["matrix", "Project Review", "matrix"],
    ["evidence", "Verified Evidence", "vault"],
    ["analyst", "Critical Gaps", "alert"],
    ["grievances", "Grievance History", "message"],
    ["audit", "Audit Trail", "clock"],
    ["reports", "Export Report", "rule"]
  ],
  consultant: [
    ["dashboard", "Review Queue", "layout"],
    ["analyst", "AI Findings", "spark"],
    ["evidence", "Evidence Verification", "vault"],
    ["matrix", "Disputed Evidence", "matrix"],
    ["grievances", "Comments", "message"],
    ["reports", "Reports", "rule"]
  ],
  regulator: [
    ["dashboard", "Projects", "layout"],
    ["matrix", "Submission Completeness", "matrix"],
    ["evidence", "Monitoring Status", "vault"],
    ["actions", "Commitments", "check"],
    ["grievances", "Grievance Trends", "message"],
    ["audit", "Inspection View", "clock"]
  ],
  "community-liaison": [
    ["dashboard", "New Grievances", "layout"],
    ["grievances", "Confidential Cases", "message"],
    ["actions", "Response Deadlines", "check"],
    ["audit", "Escalations", "clock"],
    ["evidence", "Resolution Evidence", "vault"]
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
  analyst: { eyebrow: "AI Compliance Analyst", title: "Read documents, detect IFC gaps, create actions" },
  matrix: { eyebrow: "IFC PS1-PS8 gap matrix", title: "Explainable scores with evidence confidence" },
  evidence: { eyebrow: "Evidence Vault", title: "Filed is not the same as verified" },
  grievances: { eyebrow: "Community Grievance Center", title: "Plain-language complaints routed to IFC standards" },
  actions: { eyebrow: "Action Tracker", title: "Every gap becomes an accountable promise" },
  rules: { eyebrow: "Transparent rule engine", title: "Scoring logic the reviewer can inspect" },
  audit: { eyebrow: "Accountability trail", title: "Who knew, who acted, and what changed" }
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

function loadState() {
  const stored = localStorage.getItem("hydrocomply-state");
  if (!stored) return structuredClone(initialState);
  try {
    const parsed = JSON.parse(stored);
    const nextState = { ...structuredClone(initialState), ...parsed };
    nextState.projects = parsed.projects || initialState.projects;
    nextState.scores = parsed.scores || initialState.scores;
    nextState.evidence = parsed.evidence || initialState.evidence;
    nextState.findings = parsed.findings || initialState.findings;
    nextState.grievances = parsed.grievances || initialState.grievances;
    nextState.actions = parsed.actions || initialState.actions;
    nextState.auditLogs = parsed.auditLogs || initialState.auditLogs;
    return nextState;
  } catch {
    return structuredClone(initialState);
  }
}

function saveState() {
  localStorage.setItem("hydrocomply-state", JSON.stringify(state));
}

function project() {
  return state.projects.find((item) => item.id === state.selectedProjectId);
}

function selectedScores() {
  return state.scores[state.selectedProjectId];
}

function statusForScore(score) {
  if (score >= 80) return "Green";
  if (score >= 50) return "Amber";
  return "Red";
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
  const values = Object.values(scores);
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
  projectSelect.innerHTML = state.projects.map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join("");
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
    currentView = "dashboard";
    renderPortalShell(roleKey());
    render();
    setView("dashboard");
    toast(`Role switched to ${state.role}. Portal navigation and verification controls updated.`);
  });

  document.querySelector(".nav-cta").addEventListener("click", () => {
    navigate("portal", "analyst");
  });

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
  document.querySelector("#projectSelect").value = state.selectedProjectId;
  renderDashboard();
  renderAnalyst();
  renderMatrix();
  renderEvidence();
  renderGrievances();
  renderActions();
  renderRules();
  renderAudit();
  renderReports();
  installIcons();
  animateMagicCounters();
  observeResultCards();
}

function renderLandingPage() {
  const critical = state.findings.filter((item) => item.severity === "Critical" && item.status !== "Closed").length;
  const unresolvedGrievances = state.grievances.filter((item) => !["Closed", "Verified"].includes(item.status)).length;
  document.querySelector("#publicHome").innerHTML = `
    <header class="public-nav">
      <div>
        <p class="eyebrow">HydroComply Nepal</p>
        <strong>IFC compliance intelligence</strong>
      </div>
      <div class="public-nav-actions">
        <button class="btn" type="button" data-route="roles">Choose Portal</button>
        <button class="btn primary" type="button" data-route="developer">Analyze a Project</button>
      </div>
    </header>

    <section class="public-hero">
      <div class="hero-copy">
        <p class="eyebrow">Nepal hydropower compliance platform</p>
        <h2>AI-powered IFC compliance intelligence for Nepal hydropower.</h2>
        <p>Upload EIA, IEE, RAP, ESMP, monitoring reports, and grievances. HydroComply Nepal reads them, maps evidence to IFC Performance Standards PS1-PS8, detects gaps, and turns risks into accountable actions.</p>
        <div class="hero-actions">
          <button class="btn primary" type="button" data-route="developer">Analyze a Project</button>
          <button class="btn" type="button" data-route="community">Submit Community Concern</button>
          <button class="btn" type="button" data-route="lender">View Lender Demo</button>
        </div>
      </div>
      <div class="product-preview" aria-label="HydroComply document intelligence preview">
        <div class="document-preview">
          <div class="doc-header"><span></span><span></span><span></span><strong>EIA / ESIA Upload</strong></div>
          <p>Middle Tamor Hydropower Project Environmental and Social Impact Assessment</p>
          <p>Land acquisition, public hearings, aquatic ecology baseline, minimum environmental flow, grievance register format...</p>
          <p class="highlight-line">No complete ESMS, stakeholder engagement plan, or monitoring responsibility matrix attached.</p>
        </div>
        <div class="finding-stack">
          <article><span class="severity severity-critical">PS1 Critical Gap</span><strong>ESMS not found</strong></article>
          <article><span class="severity severity-high">PS5 High Risk</span><strong>Replacement cost unclear</strong></article>
          <article><span class="severity severity-critical">PS7 Missing Evidence</span><strong>IPP / FPIC records absent</strong></article>
          <article><span class="status-pill status-green">Actions Created</span><strong>${critical + unresolvedGrievances} accountable follow-ups</strong></article>
        </div>
      </div>
    </section>

    <section class="public-section problem-band">
      <div><p class="eyebrow">Problem</p><h3>Infrastructure finance teams need proof, not folders.</h3></div>
      <p>Hydropower projects often hold compliance evidence across EIA annexes, consultant files, grievance logs, field notes, and email threads. HydroComply turns those records into a shared evidence map that developers, lenders, reviewers, and communities can understand.</p>
    </section>

    <section class="public-section">
      <div class="section-heading"><p class="eyebrow">How it works</p><h3>One shared compliance engine, different portal experiences.</h3></div>
      <div class="process-grid">
        ${["Upload project evidence", "Map to IFC PS1-PS8", "Detect gaps and risks", "Assign accountable actions"].map((item, index) => `
          <article class="process-card"><span>${index + 1}</span><h3>${item}</h3><p class="muted">${["Documents, grievances, monitoring logs, and evidence enter one project room.", "AI extracts evidence and links it to standards, rules, and project commitments.", "Missing, stale, disputed, and unverified records become visible before financing.", "Each risk becomes an owner, due date, status, and immutable audit event."][index]}</p></article>
        `).join("")}
      </div>
    </section>

    <section class="public-section">
      <div class="section-heading"><p class="eyebrow">Role-based portals</p><h3>Designed for the people who must trust the record.</h3></div>
      <div class="role-mini-grid">
        ${portalRoles.map((role) => `<article><strong>${escapeHtml(role.label)}</strong><p>${escapeHtml(role.text)}</p></article>`).join("")}
      </div>
    </section>

    <section class="public-section preview-grid">
      <article class="preview-panel"><p class="eyebrow">AI document analysis</p><h3>Evidence map, critical gaps, missing documents, and recommended actions from one EIA paste.</h3></article>
      <article class="preview-panel"><p class="eyebrow">Community grievance</p><h3>Simple Nepali or English intake creates a reference number and routes the concern to IFC risk owners.</h3></article>
      <article class="preview-panel"><p class="eyebrow">Lender trust</p><h3>Financing readiness is based on verified evidence, unresolved grievances, and audit history.</h3></article>
    </section>

    <section class="public-section proof-section">
      <div class="section-heading"><p class="eyebrow">Demo projects / proof</p><h3>Project rooms already loaded for the MVP.</h3></div>
      <div class="project-proof-grid">
        ${state.projects.map((item) => `<article class="card"><h3>${escapeHtml(item.name)}</h3><p class="muted">${escapeHtml(item.capacity)} - ${escapeHtml(item.district)}</p><span class="status-pill status-${statusForScore(average(state.scores[item.id])).toLowerCase()}">${average(state.scores[item.id])}/100 readiness</span></article>`).join("")}
      </div>
    </section>

    <section class="public-cta">
      <h3>Start with a role-based demo workspace.</h3>
      <button class="btn primary" type="button" data-route="roles">Choose Portal</button>
    </section>
  `;

  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => handlePublicRoute(button.dataset.route));
  });
}

function renderRoleSelection() {
  document.querySelector("#roleSelection").innerHTML = `
    <header class="public-nav">
      <div><p class="eyebrow">Choose portal</p><strong>HydroComply Nepal</strong></div>
      <button class="btn" type="button" data-back-home>Back to Home</button>
    </header>
    <section class="role-select-hero">
      <p class="eyebrow">Role-based access</p>
      <h2>Select how you want to review this hydropower project.</h2>
      <p>Each portal uses the same local demo data, analyzer, evidence vault, grievances, actions, and audit trail, but presents the work in the language of that role.</p>
    </section>
    <section class="role-card-grid">
      ${portalRoles.map((role) => `
        <button class="role-card" type="button" data-role-choice="${escapeHtml(role.label)}" data-entry="${role.entryView}">
          <span>${escapeHtml(role.label)}</span>
          <p>${escapeHtml(role.text)}</p>
        </button>
      `).join("")}
    </section>
  `;
  document.querySelector("[data-back-home]")?.addEventListener("click", () => navigate("publicHome"));
  document.querySelectorAll("[data-role-choice]").forEach((card) => {
    card.addEventListener("click", () => {
      state.role = card.dataset.roleChoice;
      saveState();
      if (card.dataset.entry === "community") navigate("community");
      else navigate("portal", card.dataset.entry);
    });
  });
}

function renderCommunityPortal() {
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
    <p>You can use this number to check your complaint status.</p>
    <div class="split-meta">
      <span class="tag">${escapeHtml(classification.standard)}</span>
      <span class="severity severity-${severityClass(classification.severity)}">${escapeHtml(classification.severity)}</span>
      <span class="tag">${escapeHtml(classification.category)}</span>
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
    return navigate("portal", "dashboard");
  }
  if (route === "developer") {
    state.role = "Developer";
    saveState();
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
  return {
    readiness: average(scores),
    criticalGaps: state.findings.filter((item) => item.projectId === projectId && item.severity === "Critical" && item.status !== "Closed").length,
    missingEvidence: state.evidence.filter((item) => item.projectId === projectId && ["Missing", "Filed", "Disputed", "Rejected", "Expired"].includes(item.status)).length,
    openGrievances: state.grievances.filter((item) => item.projectId === projectId && !["Closed", "Verified"].includes(item.status)).length,
    overdueActions: state.actions.filter((item) => item.projectId === projectId && item.status === "Overdue").length,
    unverifiedEvidence: state.evidence.filter((item) => item.projectId === projectId && item.status !== "Verified").length,
    highRiskGrievances: state.grievances.filter((item) => item.projectId === projectId && item.severity === "High" && !["Closed", "Verified"].includes(item.status)).length
  };
}

function projectRoomTabs() {
  const tabs = [
    ["dashboard", "Overview"],
    ["analyst", "AI Scan"],
    ["matrix", "IFC Matrix"],
    ["evidence", "Evidence"],
    ["grievances", "Grievances"],
    ["actions", "Actions"],
    ["audit", "Audit"],
    ["reports", "Reports"]
  ];
  return `<div class="project-tabs">${tabs.map(([view, label]) => `<button type="button" data-tab-view="${view}">${label}</button>`).join("")}</div>`;
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
    return `<div class="project-row"><div><h3>${escapeHtml(item.name)}</h3><p class="muted">${escapeHtml(item.district)}</p></div><strong>${metrics.readiness}</strong><span>${metrics.openGrievances} grievances</span><span>${metrics.overdueActions} overdue</span><button class="btn" data-select-project="${item.id}" type="button">Inspect</button></div>`;
  }).join("");
  document.querySelector("#dashboard").innerHTML = `
    <section class="portal-hero"><div><p class="eyebrow">Regulator / Reviewer portal</p><h2>Project Monitoring & Submission Review</h2><p class="hero-subtitle">Track submission completeness, monitoring status, unresolved commitments, grievance trends, and inspection readiness.</p></div></section>
    <section class="panel"><div class="panel-header"><div><h3>Projects</h3><p>Completeness and inspection readiness overview.</p></div></div>${rows}</section>
  `;
  document.querySelectorAll("[data-select-project]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedProjectId = button.dataset.selectProject;
      saveState();
      render();
    });
  });
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
  document.querySelector("#analyst").innerHTML = `
    <section class="document-intel-hero">
      <div>
        <p class="eyebrow">AI Document Intelligence</p>
        <h2>Read project documents, map IFC evidence, and create accountable actions.</h2>
        <p>Transparent local analysis preserves the MVP behavior while making the scan feel like the core product demo.</p>
      </div>
      <div class="processing-steps">
        ${["Reading document", "Extracting evidence", "Mapping to IFC PS1-PS8", "Detecting gaps", "Creating actions"].map((step, index) => `<span>${index + 1}. ${step}</span>`).join("")}
      </div>
    </section>

    <div class="intel-grid">
      <section class="panel intel-column">
        <div class="panel-header">
          <div>
            <h3>Uploaded / Pasted Document</h3>
            <p>Upload EIA, IEE, RAP, ESMP, biodiversity report, monitoring report, or grievance log as PDF or text. HydroComply will extract the text, map evidence to IFC PS1-PS8, detect gaps, and create action items.</p>
          </div>
          <span class="tag">No API key required</span>
        </div>
        <div class="form-grid">
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
            <label for="docFile">Upload PDF or text file</label>
            <input id="docFile" type="file" accept=".pdf,.txt,.md,.csv" />
            <p class="file-status">Supported: PDF, TXT, MD, CSV. PDF text will be extracted automatically.</p>
            <p id="fileStatus" class="file-status">No file uploaded yet.</p>
          </div>
          <div class="field full">
            <label for="docText">Project document text</label>
            <textarea id="docText" placeholder="Paste EIA, IEE, ESMP, RAP, monitoring report, consultation record, or grievance log text..."></textarea>
          </div>
        </div>
        <div class="toolbar" style="margin-top:20px">
          <button class="btn" id="loadSample" type="button"><span class="tool-icon" data-icon="upload"></span>Load sample EIA</button>
          <button class="btn primary" id="runAnalysis" type="button"><span class="tool-icon" data-icon="play"></span>Run AI analysis</button>
          <button class="btn" id="resetDemo" type="button">Reset demo data</button>
        </div>
      </section>

      <section class="panel intel-column">
        <div class="panel-header">
          <div>
            <h3>AI Evidence Map</h3>
            <p>Detected standards and evidence extracted for ${escapeHtml(project().name)}.</p>
          </div>
        </div>
        <div class="evidence-map-list">
          ${standards.map((standard) => {
            const linkedEvidence = evidenceItems.filter((item) => item.linkedStandard === standard.code);
            const linkedFindings = findings.filter((item) => item.standard === standard.code);
            return `<article><span class="status-pill status-${linkedFindings.length ? "red" : linkedEvidence.some((item) => item.status === "Verified") ? "green" : "amber"}">${standard.code}</span><div><strong>${standard.name}</strong><p class="muted">${linkedEvidence.length} evidence references, ${linkedFindings.length} findings</p></div></article>`;
          }).join("")}
        </div>
      </section>

      <section class="panel intel-column">
        <div class="panel-header">
          <div>
            <h3>IFC Risk Findings</h3>
            <p>Project summary, critical gaps, missing documents, recommended actions, and confidence.</p>
          </div>
        </div>
        <div class="scan-summary">
          ${detail("Project summary", project().status)}
          ${detail("Detected standards", [...new Set(findings.map((item) => item.standard))].join(", ") || "Run scan")}
          ${detail("Evidence extracted", String(evidenceItems.length))}
          ${detail("Critical gaps", String(findings.filter((item) => item.severity === "Critical").length))}
          ${detail("Linked actions created", String(actions.length))}
          ${detail("Confidence score", `${Math.round(findings.reduce((sum, item) => sum + item.confidence, 0) / Math.max(1, findings.length))}%`)}
        </div>
      </section>
    </div>

    <section class="panel" style="margin-top:32px">
      <div class="panel-header">
        <div>
          <h3>Critical Gaps & Recommended Actions</h3>
          <p>Every finding can produce evidence requests, action ownership, due dates, and audit events.</p>
        </div>
      </div>
      <div class="analysis-output">${findings.map(renderFindingCard).join("") || empty("Run the analyzer to generate IFC-specific findings.")}</div>
    </section>
  `;

  document.querySelector("#loadSample").addEventListener("click", () => {
    document.querySelector("#docText").value = sampleDocument;
    toast("Sample Middle Tamor EIA text loaded.");
  });
  document.querySelector("#runAnalysis").addEventListener("click", runDocumentAnalysis);
  document.querySelector("#resetDemo").addEventListener("click", () => {
    state = structuredClone(initialState);
    saveState();
    render();
    toast("Demo data reset.");
  });
  document.querySelector("#docFile").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const docText = document.querySelector("#docText");
    const fileStatus = document.querySelector("#fileStatus");

    try {
      toast(`Reading ${file.name}...`);
      if (fileStatus) {
        fileStatus.className = "file-status";
        fileStatus.textContent = `Reading ${file.name}...`;
      }

      let extractedText = "";

      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        extractedText = await extractPdfText(file);
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
      const statusMessage = `${file.name} loaded. ${extractedText.length.toLocaleString()} characters extracted.`;
      if (fileStatus) {
        fileStatus.className = "file-status";
        fileStatus.textContent = statusMessage;
      }
      toast(statusMessage);
    } catch (error) {
      console.error(error);
      if (fileStatus) {
        fileStatus.className = "file-status error";
        fileStatus.textContent = "PDF extraction failed. Try another PDF or paste text manually.";
      }
      toast(`Could not read ${file.name}. Please try another file or paste the text manually.`);
    }
  });
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
  return `
    <div class="grid">
      <div class="card">
        <div class="finding-topline">
          <h3>${escapeHtml(project().name)} has ${critical.length} critical and ${high.length} high-risk open findings.</h3>
          <span class="status-pill status-${statusForScore(average(selectedScores())).toLowerCase()}">${average(selectedScores())} overall</span>
        </div>
        <p class="muted" style="margin-top:14px">The main financing readiness blockers are mandatory PS1 management-system evidence, PS5 land and livelihood follow-up, and PS7 applicability evidence where local ethnic or Indigenous communities may be affected.</p>
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
  document.querySelector("#matrix").innerHTML = `
    <div class="ps-grid">
      ${standards.map((standard) => {
        const score = selectedScores()[standard.code];
        const status = statusForScore(score);
        const standardFindings = projectItems("findings").filter((item) => item.standard === standard.code && item.status !== "Closed");
        const linkedEvidence = projectItems("evidence").filter((item) => item.linkedStandard === standard.code);
        const scoreColor = status === "Green" ? "var(--green)" : status === "Amber" ? "var(--amber)" : "var(--red)";
        return `
          <article class="ps-card">
            <div class="scoreline">
              <div>
                <p class="eyebrow">${standard.code}</p>
                <h3>${standard.name}</h3>
              </div>
              <div class="score-ring" style="--score:${score};--score-color:${scoreColor}"><span>${score}</span></div>
            </div>
            <span class="status-pill status-${status.toLowerCase()}">${status}</span>
            <p class="muted">${whyScore(standard.code, score, standardFindings, linkedEvidence)}</p>
            <div class="split-meta">
              <span class="tag">${standardFindings.length} findings</span>
              <span class="tag">${linkedEvidence.length} evidence</span>
              ${standard.mandatory ? '<span class="tag">mandatory gate</span>' : ""}
            </div>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function whyScore(code, score, findings, evidenceItems) {
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
    <article class="card">
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

  document.querySelector("#grievances").innerHTML = `
    <div class="grid two">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Community Portal</h3>
            <p>English and Nepali intake with the same three-question flow a field team can use from a phone.</p>
          </div>
          <span class="tag">Public intake</span>
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
          <button class="btn" id="loadNepali" type="button">Load Nepali example</button>
          <button class="btn primary" id="submitGrievance" type="button"><span class="tool-icon" data-icon="message"></span>Submit grievance</button>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>AI Routing Preview</h3>
            <p>New submissions are translated, summarized, classified, mapped to IFC, assigned severity, and given a reference number.</p>
          </div>
        </div>
        <div id="routingPreview" class="empty-state">Submit a grievance to see the routing result.</div>
      </section>
    </div>

    <section class="panel" style="margin-top:32px">
      <div class="panel-header">
        <div>
          <h3>${escapeHtml(project().name)} Grievances</h3>
          <p>Developers can update and close records only with resolution evidence. Permanent deletion is intentionally unavailable.</p>
        </div>
        <span class="tag">${projectItems("grievances").length} visible records</span>
      </div>
      <div class="grievance-list">${list || empty("No grievances for this project yet.")}</div>
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
        ${detail("IFC readiness", `${metrics.readiness}/100`)}
        ${detail("Critical gaps", String(metrics.criticalGaps))}
        ${detail("Unverified evidence", String(metrics.unverifiedEvidence))}
        ${detail("Open grievances", String(metrics.openGrievances))}
        ${detail("Overdue actions", String(metrics.overdueActions))}
        ${detail("Status", metrics.criticalGaps ? "Not finance-ready" : "Review-ready")}
      </div>
      <div class="card" style="margin-top:20px">
        <h3>Blocking issues</h3>
        <p class="muted" style="margin-top:12px">${blockers.map((item) => `${item.standard}: ${item.title}`).join("; ") || "No critical or high blockers remain."}</p>
      </div>
    </section>
  `;
  document.querySelector("#copyReport")?.addEventListener("click", () => {
    const summary = `${project().name} readiness ${metrics.readiness}/100. Critical gaps: ${metrics.criticalGaps}. Unverified evidence: ${metrics.unverifiedEvidence}. Open grievances: ${metrics.openGrievances}. Overdue actions: ${metrics.overdueActions}.`;
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
