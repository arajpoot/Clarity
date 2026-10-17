/**
 * Clarity University campus.js · 20261017UNI8
 * cu_uni_* storage only. Bridges existing vault admin workers when available.
 * Educational only — not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CU_CAMPUS_SHELL_V1__) return;
  g.__CU_CAMPUS_SHELL_V1__ = true;

  var KEY = "cu_uni_progress_v1";
  var KEY_BOTS = "cu_uni_bots_v1";
  var KEY_NOTE = "cu_uni_day_note_v1";
  var BUILD = "20261017UNI8";

  var PHASES = [
    { id: 1, key: "seeker", label: "Kulliyyat al-Usul · Foundations", desk: "/campus/desk/seeker/" },
    { id: 2, key: "practice", label: "Kulliyyat al-Ibadah · Practice", desk: "/campus/desk/practice/" },
    { id: 3, key: "consistency", label: "Kulliyyat al-Itqan · Consistency", desk: "/campus/desk/consistency/" },
    { id: 4, key: "transmission", label: "Kulliyyat al-Dawah · Transmission", desk: "/campus/desk/transmission/" }
  ];

  var NOTES = [
    "Begin with the Name of Allah. One sincere page is better than ten rushed ones.",
    "Knowledge without action is a burden; a small deed done consistently is a treasure.",
    "Ask Allah for beneficial knowledge — and protection from knowledge that does not benefit.",
    "The best of you are those who learn the Qurʾān and teach it (educational reminder — verify sources).",
    "Leave the world better than you found it: one right restored, one duʿāʾ made.",
    "Humility is the vessel of ʿilm. Argue less; implement more.",
    "Your grave will be furnished with what you send ahead today."
  ];

  function readProgress() {
    try {
      var o = JSON.parse(localStorage.getItem(KEY) || "null");
      if (o && typeof o === "object") return o;
    } catch (e) {}
    return { phase: 1, stepsDone: 0, lastAction: null, updated: null };
  }
  function writeProgress(o) {
    o.updated = new Date().toISOString();
    try {
      localStorage.setItem(KEY, JSON.stringify(o));
    } catch (e) {}
    return o;
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
    try {
      localStorage.setItem(KEY_NOTE, JSON.stringify({ day: todayKey(), text: text }));
    } catch (e2) {}
    return text;
  }
  function phaseMeta(id) {
    for (var i = 0; i < PHASES.length; i++) if (PHASES[i].id === id) return PHASES[i];
    return PHASES[0];
  }
  function markStep() {
    var p = readProgress();
    p.stepsDone = (p.stepsDone || 0) + 1;
    p.lastAction = "step";
    return writeProgress(p);
  }
  function setPhase(n) {
    var p = readProgress();
    p.phase = Math.max(1, Math.min(4, parseInt(n, 10) || 1));
    p.lastAction = "phase";
    return writeProgress(p);
  }
  function continueHref() {
    return phaseMeta(readProgress().phase).desk;
  }

  var WORKER_SCRIPTS = [
    "/assets/curriculum/vault/admin/faculty/faculty-controller-v1.js",
    "/assets/curriculum/vault/admin/staff/staff-dispatcher-v1.js",
    "/assets/curriculum/vault/admin/staff/nur-workers-arsenal-v1.js",
    "/assets/curriculum/vault/admin/staff/staff-ops-monitor-v1.js",
    "/assets/curriculum/vault/admin/security/security-auditors-v1.js",
    "/assets/curriculum/vault/admin/om/om-controller-v1.js",
    "/assets/curriculum/vault/admin/it/it-controller-v1.js"
  ];

  function loadScript(src) {
    return new Promise(function (resolve) {
      var s = document.createElement("script");
      s.src = src + (src.indexOf("?") >= 0 ? "&" : "?") + "v=" + BUILD;
      s.async = true;
      s.onload = function () { resolve({ src: src, ok: true }); };
      s.onerror = function () { resolve({ src: src, ok: false }); };
      document.head.appendChild(s);
    });
  }

  var workersReady = null;
  function ensureWorkers() {
    if (workersReady) return workersReady;
    workersReady = Promise.all(WORKER_SCRIPTS.map(loadScript)).then(function (results) {
      var st = {
        faculty: !!(g.ClarityFaculty),
        security: !!(g.ClaritySecurity),
        om: !!(g.ClarityOM),
        it: !!(g.ClarityIT),
        arsenal: !!(g.ClarityNurArsenal),
        ops: !!(g.ClarityStaffOps),
        results: results
      };
      try {
        document.querySelectorAll("[data-cu-beacon]").forEach(function (el) {
          var k = el.getAttribute("data-cu-beacon");
          if (k && st[k]) el.classList.add("on");
        });
      } catch (e) {}
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
        try {
          if (g.ClaritySecurity && typeof g.ClaritySecurity.scan === "function") g.ClaritySecurity.scan();
          if (g.ClaritySecurity && typeof g.ClaritySecurity.openDesk === "function") {
            /* optional desk */
          }
          botLog(st.security
            ? "Security worker: on-device scan path available. Confirm this browser is yours only."
            : "Security (local fallback): Keep passphrase private. This device only. Educational only.");
        } catch (e) {
          botLog("Security (local): this device only. Educational only.");
        }
        try { localStorage.setItem("cu_uni_security_ok_v1", todayKey()); } catch (e2) {}
      } else if (kind === "it") {
        try {
          if (g.ClarityNurArsenal && typeof g.ClarityNurArsenal.trainAll === "function") {
            g.ClarityNurArsenal.trainAll();
            botLog("IT / arsenal: trainAll requested (on-device workers).");
          } else if (g.ClarityIT && typeof g.ClarityIT.report === "function") {
            g.ClarityIT.report();
            botLog("IT worker: status report requested.");
          } else {
            botLog("IT (local): Offline shell = campus.css/js + HTML. Progress keys cu_uni_* only.");
          }
        } catch (e) {
          botLog("IT (local): offline shell OK.");
        }
      } else if (kind === "om") {
        try {
          if (g.ClarityOM && typeof g.ClarityOM.pulse === "function") g.ClarityOM.pulse();
        } catch (e) {}
        var p = markStep();
        botLog("O&M: marked one University step (phase " + p.phase + ", steps " + p.stepsDone + "). Mirror, not scoreboard.");
        renderProgressWidgets();
      } else if (kind === "faculty") {
        try {
          if (g.ClarityFaculty) {
            var fn = g.ClarityFaculty.openDesk || g.ClarityFaculty.open || g.ClarityFaculty.render;
            if (typeof fn === "function") {
              fn.call(g.ClarityFaculty);
              botLog("Faculty controller desk opened.");
              return;
            }
          }
        } catch (e) {}
        botLog("Faculty: opening Faculty page.");
        location.href = "/campus/faculty.html";
      } else if (kind === "ops") {
        try {
          if (g.ClarityStaffOps && typeof g.ClarityStaffOps.runHealth === "function") {
            g.ClarityStaffOps.runHealth();
            botLog("Ops steward: health check requested.");
          } else {
            botLog("Ops (local): module controllers not mounted — use Phase desk steps.");
          }
        } catch (e) {
          botLog("Ops (local): health reminder complete.");
        }
      }
    });
  }

  function renderProgressWidgets() {
    var p = readProgress();
    var meta = phaseMeta(p.phase);
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
  }

  function normalizeFacultyList(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    var list = data.faculty || data.teachers || data.members || data.roster || data.staff || [];
    if (Array.isArray(list) && list.length) return list;
    if (data.workers && Array.isArray(data.workers)) return data.workers;
    return [];
  }

  function loadFacultyCards() {
    var host = document.getElementById("cu-faculty-host");
    if (!host) return;
    var fallback = [
      { name: "Amid · Foundations", title: "College of Usul", specialty: "Tawhid & Qurʾān foundations", phase: 1 },
      { name: "Amid · Practice", title: "College of Ibadah", specialty: "Taharah & salah confidence", phase: 2 },
      { name: "Amid · Consistency", title: "College of Itqan", specialty: "Tajweed & steady wird", phase: 3 },
      { name: "Amid · Transmission", title: "College of Dawah", specialty: "Adab & source care", phase: 4 }
    ];
    function paint(list) {
      host.innerHTML = "";
      list.slice(0, 8).forEach(function (t) {
        var a = document.createElement("a");
        a.className = "cu-card";
        var phase = t.phase || 1;
        a.href = "/campus/phase-desk.html?phase=" + phase;
        a.innerHTML =
          "<strong>" + (t.name || t.title || "Faculty") + "</strong><span>" +
          (t.title || t.rank || t.role || "") +
          (t.specialty ? " · " + t.specialty : "") + "</span>";
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

  g.CuCampus = {
    readProgress: readProgress,
    writeProgress: writeProgress,
    setPhase: setPhase,
    markStep: markStep,
    todayNote: todayNote,
    ensureWorkers: ensureWorkers,
    runBot: runBot,
    continueHref: continueHref,
    render: renderProgressWidgets,
    KEY: KEY,
    BUILD: BUILD
  };

  function boot() {
    renderProgressWidgets();
    loadFacultyCards();
    ensureWorkers();
    document.querySelectorAll("[data-cu-bot]").forEach(function (btn) {
      btn.addEventListener("click", function () { runBot(btn.getAttribute("data-cu-bot")); });
    });
    document.querySelectorAll("[data-cu-mark-step]").forEach(function (btn) {
      btn.addEventListener("click", function () { markStep(); renderProgressWidgets(); });
    });
    document.querySelectorAll("[data-cu-set-phase]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setPhase(btn.getAttribute("data-cu-set-phase"));
        renderProgressWidgets();
      });
    });
    try {
      var q = new URLSearchParams(location.search).get("phase");
      if (q) { setPhase(q); renderProgressWidgets(); }
    } catch (e) {}
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
