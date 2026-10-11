/**
 * Clarity Nur Workers Arsenal v1 — on-device automation for Islamic knowledge journey
 * Educational only. No fatwa. Allowlisted sources. localStorage only.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_NUR_ARSENAL__) return;
  g.__CLARITY_NUR_ARSENAL__ = true;

  var NS = "clarity_nur_";
  var KEYS = {
    pulse: NS + "ops_pulse_v1",
    authenticity: NS + "fiqh_log_v1",
    scoutInbox: NS + "scout_inbox_v1",
    libIssues: NS + "lib_issues_v1",
    itBridge: NS + "it_bridge_v1",
    securityLog: NS + "sec_log_v1",
    omVein: NS + "om_vein_v1",
    journeyHint: NS + "journey_hint_v1",
    drill: NS + "workers_drill_v1"
  };

  function get(k, fb) {
    try {
      var v = localStorage.getItem(k);
      if (v == null) return fb;
      return JSON.parse(v);
    } catch (e) {
      return fb;
    }
  }
  function set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  }
  function pushCap(k, item, max) {
    max = max || 40;
    var arr = get(k, []);
    if (!Array.isArray(arr)) arr = [];
    arr.unshift(item);
    if (arr.length > max) arr = arr.slice(0, max);
    set(k, arr);
    return arr;
  }
  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (e) {
      return String(Date.now());
    }
  }

  /* —— Ops: pulse curriculum bloodstream —— */
  function opsPulse() {
    var snap = {
      t: nowIso(),
      phase: null,
      engine: !!g.ClarityCurriculumEngine,
      controller: !!g.ClarityCurriculumController,
      junior: !!(g.ClarityJuniorCurriculum && g.ClarityJuniorCurriculum.render),
      vault: !!g.__CLARITY_VAULT_SEALED__
    };
    try {
      snap.phase = localStorage.getItem("clarity_curriculum_phase_v1") || localStorage.getItem("clarity_university_phase_v1");
    } catch (e) {}
    pushCap(KEYS.pulse, snap, 24);
    if (g.ClarityStaffOps && typeof g.ClarityStaffOps.note === "function") {
      try {
        g.ClarityStaffOps.note("pulse", snap);
      } catch (e2) {}
    }
    return snap;
  }

  /* —— Authenticity: educational tone ledger —— */
  function authenticityCheck(sample) {
    var text = String(sample || "");
    var flags = [];
    // soft educational hygiene — not a legal ruling engine
    if (/you must believe|takfir|declare.*kafir/i.test(text)) flags.push("tone-caution");
    if (/this is a fatwa|binding ruling/i.test(text)) flags.push("not-fatwa-reminder");
    var row = { t: nowIso(), flags: flags, ok: flags.length === 0, note: "Educational path only — verify with Qur'an, Sunnah, local scholar" };
    pushCap(KEYS.authenticity, row, 30);
    return row;
  }

  /* —— Scout: allowlisted study links inbox —— */
  var ALLOW = [
    "https://quran.com",
    "https://sunnah.com",
    "https://seekersguidance.org",
    "https://yaqeeninstitute.org",
    "https://beginislam.org"
  ];
  function scoutPropose(topic) {
    topic = String(topic || "tawhid").slice(0, 40);
    var item = {
      t: nowIso(),
      topic: topic,
      suggestions: ALLOW.map(function (u) {
        return { url: u, purpose: "reference", topic: topic };
      }),
      status: "proposed",
      disclaimer: "Human review before any curriculum change. Not a fatwa."
    };
    pushCap(KEYS.scoutInbox, item, 20);
    return item;
  }

  /* —— Librarian: issue rotation brief —— */
  function librarianIssue(title, body) {
    var issue = {
      t: nowIso(),
      title: title || "Rotation brief",
      body: body || "Keep modules sequential; prefer primary sources; educational disclaimer visible.",
      for: ["ops", "scout"]
    };
    pushCap(KEYS.libIssues, issue, 15);
    return issue;
  }

  /* —— IT: bridge health into storage —— */
  function itBridgeSnapshot() {
    var edge = {
      t: nowIso(),
      sealed: !!g.__CLARITY_VAULT_SEALED__,
      it: !!g.ClarityIT,
      om: !!g.ClarityOM,
      security: !!g.ClaritySecurity,
      staff: !!(g.ClarityStaffOps || g.ClarityStaffLibrarian),
      path: typeof g.clarityOpenSectionDoor === "function"
    };
    set(KEYS.itBridge, edge);
    pushCap(KEYS.drill, { t: edge.t, kind: "it-bridge", edge: edge }, 20);
    return edge;
  }

  /* —— Security: soft wiring note —— */
  function securityNote(msg) {
    return pushCap(KEYS.securityLog, { t: nowIso(), msg: String(msg || "scan") }, 25);
  }

  /* —— O&M: vein tick —— */
  function omVein() {
    var v = { t: nowIso(), circulation: true };
    set(KEYS.omVein, v);
    return v;
  }

  /* —— Journey hint for seeker —— */
  function journeyHint() {
    var phase = 1;
    try {
      phase = parseInt(localStorage.getItem("clarity_curriculum_phase_v1") || "1", 10) || 1;
    } catch (e) {}
    var hints = {
      1: "Junior: one module, one spark quiz. Tawhid first.",
      2: "Practice path: build steady salah and manners.",
      3: "Daily: consistency over speed.",
      4: "Da'i: transmit with humility — still educational only."
    };
    var h = { t: nowIso(), phase: phase, text: hints[phase] || hints[1] };
    set(KEYS.journeyHint, h);
    return h;
  }

  /* —— Train loop: light automation on campus —— */
  function trainAll() {
    var report = {
      ops: opsPulse(),
      auth: authenticityCheck("Educational Islamic companion — not a fatwa."),
      scout: scoutPropose("seeker foundations"),
      lib: librarianIssue("Nur path rotation", "Prioritize Qur'an & authentic hadith references in study links."),
      it: itBridgeSnapshot(),
      sec: securityNote("wiring pulse"),
      om: omVein(),
      journey: journeyHint()
    };
    try {
      g.dispatchEvent(new CustomEvent("clarity-nur-trained", { detail: report }));
    } catch (e) {}
    try {
      console.info("%c Nur Workers ", "background:#0d4f3c;color:#f0e6c8", "trained · arsenal in localStorage");
    } catch (e2) {}
    return report;
  }

  g.ClarityNurArsenal = {
    keys: KEYS,
    opsPulse: opsPulse,
    authenticityCheck: authenticityCheck,
    scoutPropose: scoutPropose,
    librarianIssue: librarianIssue,
    itBridgeSnapshot: itBridgeSnapshot,
    securityNote: securityNote,
    omVein: omVein,
    journeyHint: journeyHint,
    trainAll: trainAll,
    read: function (k) {
      return get(KEYS[k] || k, null);
    }
  };

  function boot() {
    /* delay so vault/staff can appear first */
    setTimeout(function () {
      try {
        trainAll();
      } catch (e) {}
    }, 1200);
    setTimeout(function () {
      try {
        opsPulse();
        omVein();
        itBridgeSnapshot();
      } catch (e) {}
    }, 8000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  typeof g.addEventListener==="function"&&g.addEventListener("clarity-vault-ready", function () {
    setTimeout(trainAll, 400);
  });
  typeof g.addEventListener==="function"&&g.addEventListener("clarity-staff-ready", function () {
    setTimeout(function () {
      try {
        librarianIssue("Staff online", "Ops · Authenticity · Scout · Librarian circulating.");
      } catch (e) {}
    }, 200);
  });
})(typeof window !== "undefined" ? window : this);
