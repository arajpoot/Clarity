/**
 * Clarity University on-ramp · 20261017ONRAMP
 * Map foyer → local registration → faculty advisor → desk classroom
 * Storage: cu_uni_* only (bridges read-only to desk continue if present)
 * Educational only — not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CU_CAMPUS_ONRAMP_V1__) return;
  g.__CU_CAMPUS_ONRAMP_V1__ = true;

  var KEY = "cu_uni_progress_v1";
  var KEY_REG = "cu_uni_registration_v1";
  var KEY_BOTS = "cu_uni_bots_v1";
  var KEY_NOTE = "cu_uni_day_note_v1";
  var BUILD = "20261017ONRAMP";

  var PHASES = [
    { id: 1, key: "seeker", label: "Kulliyyat al-Usul · Foundations", desk: "/campus/desk/seeker/", faculty: "Shaykh Nur al-Yaqeen" },
    { id: 2, key: "practice", label: "Kulliyyat al-Ibadah · Practice", desk: "/campus/desk/practice/", faculty: "Ustadha Safaa al-Amal" },
    { id: 3, key: "consistency", label: "Kulliyyat al-Itqan · Consistency", desk: "/campus/desk/consistency/", faculty: "Shaykh Rashid al-Itqan" },
    { id: 4, key: "transmission", label: "Kulliyyat al-Dawah · Transmission", desk: "/campus/desk/transmission/", faculty: "Shaykh Hakim al-Balagh" }
  ];

  var HELP = {
    "1": ["Read slowly. Tawḥīd is loyalty of the heart, not a slogan.", "Open one verse and sit with a single line.", "You do not need to finish fast — finish sincere."],
    "2": ["Use this as a map; confirm prayer details with a local teacher.", "Mistakes in practice are part of learning when sincerity is present.", "Write one small action for today."],
    "3": ["One tajweed rule applied well beats ten rushed.", "Weekly review is honesty, not self-punishment.", "Craft beauty without inventing meanings."],
    "4": ["Before teaching, ask: is my source clear?", "Adab is part of the message.", "If unsure of a ruling, pause and ask qualified scholarship."]
  };

  var NOTES = [
    "Begin with the Name of Allah. One sincere page is better than ten rushed ones.",
    "Knowledge without action is a burden; a small deed done consistently is a treasure.",
    "Ask Allah for beneficial knowledge — and protection from knowledge that does not benefit.",
    "Your grave will be furnished with what you send ahead today.",
    "Humility is the vessel of ʿilm. Argue less; implement more."
  ];

  function readProgress() {
    try {
      var o = JSON.parse(localStorage.getItem(KEY) || "null");
      if (o && typeof o === "object") return o;
    } catch (e) {}
    return { phase: 1, stepsDone: 0, lastAction: null, updated: null, registered: false };
  }
  function writeProgress(o) {
    o.updated = new Date().toISOString();
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
    return o;
  }
  function readReg() {
    try {
      return JSON.parse(localStorage.getItem(KEY_REG) || "null");
    } catch (e) { return null; }
  }
  function writeReg(o) {
    try { localStorage.setItem(KEY_REG, JSON.stringify(o)); } catch (e) {}
  }
  function todayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function todayNote() {
    try {
      var o = JSON.parse(localStorage.getItem(KEY_NOTE) || "null");
      if (o && o.day === todayKey() && o.text) return o.text;
    } catch (e) {}
    var text = NOTES[Math.floor(Math.random() * NOTES.length)];
    try { localStorage.setItem(KEY_NOTE, JSON.stringify({ day: todayKey(), text: text })); } catch (e2) {}
    return text;
  }
  function phaseMeta(id) {
    for (var i = 0; i < PHASES.length; i++) if (PHASES[i].id === id) return PHASES[i];
    return PHASES[0];
  }
  function advisorLine(phase) {
    var arr = HELP[String(phase)] || HELP["1"];
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /** Continue → real desk classroom (legacy desk rooms) */
  function continueHref() {
    var p = readProgress();
    var meta = phaseMeta(p.phase);
    /* Prefer desk continue engine path if it stored a room */
    try {
      var c = JSON.parse(localStorage.getItem("cu_continue_v1") || "null");
      if (c && c.href && String(c.href).indexOf("/campus/desk/") === 0) return c.href;
      if (c && c.room) {
        var map = { seeker: "/campus/desk/seeker/", practice: "/campus/desk/practice/", consistency: "/campus/desk/consistency/", transmission: "/campus/desk/transmission/" };
        if (map[c.room]) return map[c.room];
      }
    } catch (e) {}
    return meta.desk;
  }

  function markStep() {
    var p = readProgress();
    p.stepsDone = (p.stepsDone || 0) + 1;
    p.lastAction = "step";
    return writeProgress(p);
  }
  function setPhase(n) {
    var p = readProgress();
    var next = Math.max(1, Math.min(4, parseInt(n, 10) || 1));
    /* single active phase — registrar spirit: allow set but record */
    p.phase = next;
    p.lastAction = "phase";
    writeProgress(p);
    var reg = readReg() || {};
    reg.activePhase = next;
    reg.advisor = phaseMeta(next).faculty;
    writeReg(reg);
    return p;
  }

  /** Phase B — local registration (no accounts) */
  function register(phase) {
    phase = Math.max(1, Math.min(4, parseInt(phase, 10) || 1));
    var meta = phaseMeta(phase);
    var reg = {
      registered: true,
      activePhase: phase,
      college: meta.label,
      advisor: meta.faculty,
      registeredAt: new Date().toISOString(),
      disclaimer: "On-device campus record only. Not an official university enrollment. Educational only — not a fatwa."
    };
    writeReg(reg);
    var p = readProgress();
    p.registered = true;
    p.phase = phase;
    p.lastAction = "register";
    writeProgress(p);
    return reg;
  }

  function isRegistered() {
    var r = readReg();
    return !!(r && r.registered);
  }

  /* Workers */
  var WORKER_SCRIPTS = [
    "/assets/curriculum/vault/admin/faculty/faculty-controller-v1.js",
    "/assets/curriculum/vault/admin/staff/staff-dispatcher-v1.js",
    "/assets/curriculum/vault/admin/staff/nur-workers-arsenal-v1.js",
    "/assets/curriculum/vault/admin/security/security-auditors-v1.js",
    "/assets/curriculum/vault/admin/om/om-controller-v1.js",
    "/assets/curriculum/vault/admin/it/it-controller-v1.js"
  ];
  function loadScript(src) {
    return new Promise(function (resolve) {
      var s = document.createElement("script");
      s.src = src + "?v=" + BUILD;
      s.async = true;
      s.onload = function () { resolve(true); };
      s.onerror = function () { resolve(false); };
      document.head.appendChild(s);
    });
  }
  var workersReady = null;
  function ensureWorkers() {
    if (workersReady) return workersReady;
    workersReady = Promise.all(WORKER_SCRIPTS.map(loadScript)).then(function () {
      var st = {
        faculty: !!g.ClarityFaculty,
        security: !!g.ClaritySecurity,
        om: !!g.ClarityOM,
        it: !!g.ClarityIT,
        arsenal: !!g.ClarityNurArsenal,
        ops: !!g.ClarityStaffOps
      };
      document.querySelectorAll("[data-cu-beacon]").forEach(function (el) {
        var k = el.getAttribute("data-cu-beacon");
        if (k && st[k]) el.classList.add("on");
      });
      return st;
    });
    return workersReady;
  }

  function botLog(msg) {
    var el = document.getElementById("cu-bot-log");
    if (el) el.textContent = new Date().toLocaleTimeString() + " · " + msg + "\n" + (el.textContent || "");
    try {
      var log = JSON.parse(localStorage.getItem(KEY_BOTS) || "[]");
      if (!Array.isArray(log)) log = [];
      log.unshift({ t: Date.now(), msg: msg });
      localStorage.setItem(KEY_BOTS, JSON.stringify(log.slice(0, 40)));
    } catch (e) {}
  }

  function runBot(kind) {
    ensureWorkers().then(function (st) {
      if (kind === "security") {
        try { if (g.ClaritySecurity && g.ClaritySecurity.scan) g.ClaritySecurity.scan(); } catch (e) {}
        botLog(st.security ? "Security: on-device scan path available. This device only." : "Security (local): this device only. Educational only.");
      } else if (kind === "it") {
        try { if (g.ClarityNurArsenal && g.ClarityNurArsenal.trainAll) g.ClarityNurArsenal.trainAll(); } catch (e) {}
        botLog("IT: offline shell + cu_uni_* progress. Educational only.");
      } else if (kind === "om") {
        try { if (g.ClarityOM && g.ClarityOM.pulse) g.ClarityOM.pulse(); } catch (e) {}
        markStep();
        botLog("O&M: one University step marked. Mirror, not scoreboard.");
        renderAll();
      } else if (kind === "ops") {
        try { if (g.ClarityStaffOps && g.ClarityStaffOps.runHealth) g.ClarityStaffOps.runHealth(); } catch (e) {}
        botLog("Ops: health reminder (local).");
      } else if (kind === "faculty") {
        location.href = "/campus/faculty.html";
      }
    });
  }

  function renderAll() {
    var p = readProgress();
    var meta = phaseMeta(p.phase);
    var reg = readReg();
    document.querySelectorAll("[data-cu-phase-label]").forEach(function (el) {
      el.textContent = meta.label;
    });
    document.querySelectorAll("[data-cu-steps]").forEach(function (el) {
      el.textContent = String(p.stepsDone || 0);
    });
    document.querySelectorAll("[data-cu-continue-href]").forEach(function (el) {
      if (el.tagName === "A") el.setAttribute("href", continueHref());
    });
    document.querySelectorAll("[data-cu-today-note]").forEach(function (el) {
      el.textContent = todayNote();
    });
    document.querySelectorAll("[data-cu-progress-bar]").forEach(function (el) {
      var pct = Math.min(100, Math.round((p.phase - 1) * 25 + Math.min(24, (p.stepsDone || 0) * 3)));
      el.style.width = pct + "%";
    });
    document.querySelectorAll("[data-cu-last]").forEach(function (el) {
      el.textContent = p.updated ? new Date(p.updated).toLocaleString() : "—";
    });
    document.querySelectorAll("[data-cu-advisor-name]").forEach(function (el) {
      el.textContent = (reg && reg.advisor) || meta.faculty;
    });
    document.querySelectorAll("[data-cu-advisor-line]").forEach(function (el) {
      el.textContent = advisorLine(p.phase);
    });
    document.querySelectorAll("[data-cu-reg-status]").forEach(function (el) {
      el.textContent = isRegistered()
        ? "Campus record open · " + ((reg && reg.college) || meta.label)
        : "Not registered yet — open a local campus record to begin.";
    });
    document.querySelectorAll("[data-cu-step-reg]").forEach(function (el) {
      el.classList.toggle("done", isRegistered());
    });
    var enter = document.getElementById("cu-enter-class");
    if (enter) {
      enter.setAttribute("href", continueHref());
      enter.style.opacity = isRegistered() ? "1" : "0.55";
    }
  }

  function normalizeFacultyList(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data.faculty || data.teachers || data.members || data.roster || data.workers || [];
  }

  function loadFacultyCards() {
    var host = document.getElementById("cu-faculty-host");
    if (!host) return;
    var fallback = PHASES.map(function (ph) {
      return { name: ph.faculty, title: ph.label, specialty: "Phase " + ph.id + " advisor", phase: ph.id };
    });
    function paint(list) {
      host.innerHTML = "";
      list.slice(0, 8).forEach(function (t) {
        var phase = t.phase || 1;
        var a = document.createElement("a");
        a.className = "cu-card";
        a.href = "/campus/desk/" + (phaseMeta(phase).key === "seeker" ? "seeker" : phaseMeta(phase).key) + "/";
        if (phase === 1) a.href = "/campus/desk/seeker/";
        if (phase === 2) a.href = "/campus/desk/practice/";
        if (phase === 3) a.href = "/campus/desk/consistency/";
        if (phase === 4) a.href = "/campus/desk/transmission/";
        a.innerHTML =
          "<strong>" + (t.name || t.title || "Faculty") + "</strong><span>" +
          (t.title || t.rank || "") + (t.specialty ? " · " + t.specialty : "") +
          "</span>";
        a.addEventListener("click", function () {
          setPhase(phase);
          if (!isRegistered()) register(phase);
        });
        host.appendChild(a);
      });
    }
    fetch("/assets/curriculum/vault/admin/faculty/faculty-roster.json?v=" + BUILD)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var list = normalizeFacultyList(data);
        paint(list.length ? list : fallback);
      })
      .catch(function () { paint(fallback); });
  }

  function bindAdmission() {
    document.querySelectorAll("[data-cu-register]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var ph = btn.getAttribute("data-cu-register") || readProgress().phase || 1;
        register(ph);
        renderAll();
        var msg = document.getElementById("cu-reg-flash");
        if (msg) {
          msg.textContent = "Record opened on this device. Your advisor is ready. Enter class when you are.";
        }
      });
    });
    document.querySelectorAll("[data-cu-register-and-go]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var ph = btn.getAttribute("data-cu-register-and-go") || "1";
        register(ph);
        location.href = phaseMeta(parseInt(ph, 10)).desk;
      });
    });
  }

  g.CuCampus = {
    readProgress: readProgress,
    register: register,
    isRegistered: isRegistered,
    setPhase: setPhase,
    markStep: markStep,
    todayNote: todayNote,
    continueHref: continueHref,
    ensureWorkers: ensureWorkers,
    runBot: runBot,
    render: renderAll,
    KEY: KEY,
    KEY_REG: KEY_REG,
    BUILD: BUILD
  };

  function boot() {
    renderAll();
    loadFacultyCards();
    bindAdmission();
    ensureWorkers();
    document.querySelectorAll("[data-cu-bot]").forEach(function (btn) {
      btn.addEventListener("click", function () { runBot(btn.getAttribute("data-cu-bot")); });
    });
    document.querySelectorAll("[data-cu-mark-step]").forEach(function (btn) {
      btn.addEventListener("click", function () { markStep(); renderAll(); });
    });
    document.querySelectorAll("[data-cu-set-phase]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setPhase(btn.getAttribute("data-cu-set-phase"));
        renderAll();
      });
    });
    try {
      var q = new URLSearchParams(location.search).get("phase");
      if (q) { setPhase(q); renderAll(); }
    } catch (e) {}
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
