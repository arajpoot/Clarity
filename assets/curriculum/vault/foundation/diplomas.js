/* Clarity University Diplomas + Name Plaque + Score Ledger v1
 * Graduations: Junior → Junior High → Daily → Da'i
 * Certificates + scores stored locally; portable export for device transfer.
 * Educational recognition only — not a scholarly ijazah or fatwa license.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_UNIVERSITY_DIPLOMAS_V1__) return;
  g.__CLARITY_UNIVERSITY_DIPLOMAS_V1__ = true;

  var NAME_KEY = "clarity_learner_name_v1";
  var LEDGER_KEY = "clarity_university_ledger_v1";
  var DIPLOMAS_KEY = "clarity_university_diplomas_v1";
  var PORTABLE_KEY = "clarity_university_portable_v1";

  var PHASES = [
    {
      id: 1,
      code: "JR",
      title: "Junior · Seeker Foundations",
      latin: "Foundations of Belief",
      arabic: "أساس الإيمان",
      color: "#0d4f3c",
      seal: "✦"
    },
    {
      id: 2,
      code: "JH",
      title: "Junior High · New Muslim Practice",
      latin: "Practice of the Pillars",
      arabic: "عمل الأركان",
      color: "#1a6b52",
      seal: "◈"
    },
    {
      id: 3,
      code: "HS",
      title: "Daily · High School Consistency",
      latin: "Craft and Consistency",
      arabic: "الثبات والإتقان",
      color: "#8a6b1a",
      seal: "✧"
    },
    {
      id: 4,
      code: "DAI",
      title: "Da'i · University Transmission",
      latin: "Transmit with Adab",
      arabic: "الدعوة بالأدب",
      color: "#6b3a1a",
      seal: "❖"
    }
  ];

  function lsGet(k, fallback) {
    try {
      var v = localStorage.getItem(k);
      if (v == null) return fallback;
      return JSON.parse(v);
    } catch (e) {
      return fallback;
    }
  }
  function lsSet(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  }
  function lsStr(k, fallback) {
    try {
      return localStorage.getItem(k) || fallback || "";
    } catch (e) {
      return fallback || "";
    }
  }
  function lsSetStr(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch (e) {}
  }

  function getName() {
    return (lsStr(NAME_KEY, "") || "").trim();
  }
  function setName(n) {
    n = String(n || "").trim().slice(0, 64);
    lsSetStr(NAME_KEY, n);
    renderPlaque();
    try {
      g.dispatchEvent(new CustomEvent("clarity-learner-name", { detail: { name: n } }));
    } catch (e) {}
    return n;
  }

  function getLedger() {
    return lsGet(LEDGER_KEY, { scores: [], summary: {} }) || { scores: [], summary: {} };
  }
  function saveLedger(L) {
    lsSet(LEDGER_KEY, L);
    syncPortable();
  }
  function getDiplomas() {
    return lsGet(DIPLOMAS_KEY, {}) || {};
  }
  function saveDiplomas(D) {
    lsSet(DIPLOMAS_KEY, D);
    syncPortable();
  }

  /** Portable pack for device transfer (like family-tree card export) */
  function syncPortable() {
    var pack = {
      v: 1,
      kind: "clarity-university-portable",
      name: getName(),
      ledger: getLedger(),
      diplomas: getDiplomas(),
      phase: (function () {
        try {
          return parseInt(localStorage.getItem("clarity_curriculum_phase_v1") || "1", 10) || 1;
        } catch (e) {
          return 1;
        }
      })(),
      exportedAt: new Date().toISOString()
    };
    lsSet(PORTABLE_KEY, pack);
    return pack;
  }

  function importPortable(pack) {
    if (!pack || pack.kind !== "clarity-university-portable") {
      alert("Not a Clarity University pack.");
      return false;
    }
    if (pack.name) setName(pack.name);
    if (pack.ledger) lsSet(LEDGER_KEY, pack.ledger);
    if (pack.diplomas) lsSet(DIPLOMAS_KEY, pack.diplomas);
    if (pack.phase) {
      try {
        localStorage.setItem("clarity_curriculum_phase_v1", String(pack.phase));
      } catch (e) {}
    }
    syncPortable();
    renderPlaque();
    renderHall();
    alert("University record restored on this device.");
    return true;
  }

  /** Record a spark-quiz or phase-quiz score */
  function recordScore(entry) {
    var L = getLedger();
    L.scores = L.scores || [];
    L.scores.push({
      at: Date.now(),
      phase: entry.phase || 1,
      moduleId: entry.moduleId || null,
      kind: entry.kind || "spark",
      correct: entry.correct || 0,
      total: entry.total || 0,
      pct: entry.total ? Math.round((100 * entry.correct) / entry.total) : 0
    });
    /* rolling summary per phase */
    L.summary = L.summary || {};
    var ph = String(entry.phase || 1);
    var s = L.summary[ph] || { attempts: 0, correct: 0, total: 0, best: 0 };
    s.attempts += 1;
    s.correct += entry.correct || 0;
    s.total += entry.total || 0;
    s.best = Math.max(s.best || 0, entry.total ? Math.round((100 * entry.correct) / entry.total) : 0);
    L.summary[ph] = s;
    saveLedger(L);
    return L;
  }

  function phaseGPA(phase) {
    var L = getLedger();
    var s = (L.summary && L.summary[String(phase)]) || null;
    if (!s || !s.total) return null;
    return Math.round((100 * s.correct) / s.total);
  }

  function sealCode(name, phase, dateIso) {
    var raw = (name || "seeker") + "|" + phase + "|" + (dateIso || "").slice(0, 10);
    var h = 0;
    for (var i = 0; i < raw.length; i++) h = (h * 31 + raw.charCodeAt(i)) >>> 0;
    var hex = ("00000000" + h.toString(16)).slice(-8).toUpperCase();
    var meta = PHASES[phase - 1] || PHASES[0];
    return meta.code + "-" + hex.slice(0, 4) + "-" + hex.slice(4);
  }

  function issueDiploma(phase) {
    phase = phase || 1;
    var meta = PHASES[phase - 1];
    if (!meta) return null;
    var name = getName() || "Seeker of Clarity";
    var now = new Date();
    var iso = now.toISOString();
    var gpa = phaseGPA(phase);
    var dip = {
      phase: phase,
      code: meta.code,
      title: meta.title,
      latin: meta.latin,
      arabic: meta.arabic,
      name: name,
      date: iso,
      dateLabel: now.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
      }),
      seal: sealCode(name, phase, iso),
      score: gpa,
      sealMark: meta.seal,
      color: meta.color,
      note: "Educational recognition on this device — not a formal ijazah or fatwa license."
    };
    var D = getDiplomas();
    D[String(phase)] = dip;
    saveDiplomas(D);
    try {
      g.dispatchEvent(new CustomEvent("clarity-diploma-issued", { detail: dip }));
    } catch (e) {}
    showDiploma(dip, true);
    renderHall();
    renderPlaque();
    return dip;
  }

  function ensureUI() {
    if (document.getElementById("clarity-name-plaque-rail")) return;
    var rail = document.createElement("div");
    rail.id = "clarity-name-plaque-rail";
    rail.className = "clarity-name-plaque-rail";
    rail.innerHTML =
      '<div class="cnp-inner">' +
      '<div class="cnp-plaque" id="cnp-plaque">' +
      '<span class="cnp-label">Learner</span>' +
      '<span class="cnp-name" id="cnp-name">…</span>' +
      '<button type="button" class="cnp-edit" id="cnp-edit" title="Set your name">✎</button>' +
      "</div>" +
      '<div class="cnp-stats" id="cnp-stats"></div>' +
      '<button type="button" class="cnp-hall-btn" id="cnp-hall-btn">Diploma hall</button>' +
      "</div>";
    var phaseRail = document.getElementById("clarity-phase-plaque-rail");
    if (phaseRail && phaseRail.parentNode) {
      phaseRail.parentNode.insertBefore(rail, phaseRail.nextSibling);
    } else {
      var duo = document.getElementById("clarity-top-duo");
      if (duo && duo.parentNode) duo.parentNode.insertBefore(rail, duo.nextSibling);
      else document.body.insertBefore(rail, document.body.firstChild);
    }
    document.getElementById("cnp-edit").onclick = function () {
      var cur = getName();
      var n = prompt("Your learning name (shown on certificates):", cur || "");
      if (n != null) setName(n);
    };
    document.getElementById("cnp-hall-btn").onclick = function () {
      openHall();
    };
  }

  function renderPlaque() {
    ensureUI();
    var nameEl = document.getElementById("cnp-name");
    var stats = document.getElementById("cnp-stats");
    if (!nameEl) return;
    var n = getName();
    nameEl.textContent = n || "Tap ✎ to set your name";
    nameEl.classList.toggle("cnp-empty", !n);
    var D = getDiplomas();
    var earned = Object.keys(D).length;
    var phase = 1;
    try {
      phase = parseInt(localStorage.getItem("clarity_curriculum_phase_v1") || "1", 10) || 1;
    } catch (e) {}
    var gpa = phaseGPA(phase);
    if (stats) {
      stats.innerHTML =
        '<span class="cnp-chip">Phase ' +
        phase +
        "</span>" +
        (gpa != null ? '<span class="cnp-chip">Track score ' + gpa + "%</span>" : "") +
        '<span class="cnp-chip">' +
        earned +
        "/4 diplomas</span>";
    }
  }

  function showDiploma(dip, isNew) {
    var m = document.getElementById("clarity-diploma-modal");
    if (!m) {
      m = document.createElement("div");
      m.id = "clarity-diploma-modal";
      m.className = "clarity-diploma-modal";
      m.hidden = true;
      m.innerHTML =
        '<div class="cdm-backdrop" data-cdm-close="1"></div>' +
        '<div class="cdm-wrap">' +
        '<button type="button" class="cdm-x" data-cdm-close="1" aria-label="Close">×</button>' +
        '<div id="cdm-certificate" class="cdm-certificate"></div>' +
        '<div class="cdm-actions">' +
        '<button type="button" class="cdm-btn" id="cdm-export">Export portable record</button>' +
        '<button type="button" class="cdm-btn cdm-secondary" id="cdm-import">Import on this device</button>' +
        '<button type="button" class="cdm-btn cdm-secondary" data-cdm-close="1">Close</button>' +
        "</div></div>";
      document.body.appendChild(m);
      m.addEventListener("click", function (ev) {
        if (ev.target && ev.target.getAttribute("data-cdm-close")) {
          m.hidden = true;
          m.classList.remove("show");
        }
      });
      document.getElementById("cdm-export").onclick = function () {
        exportPortable();
      };
      document.getElementById("cdm-import").onclick = function () {
        importFromPrompt();
      };
    }
    var cert = document.getElementById("cdm-certificate");
    cert.innerHTML = buildCertificateHTML(dip, isNew);
    m.hidden = false;
    m.classList.add("show");
    if (isNew) {
      cert.classList.add("cdm-reveal");
      setTimeout(function () {
        cert.classList.remove("cdm-reveal");
      }, 1200);
    }
  }

  function buildCertificateHTML(dip, isNew) {
    var scoreLine =
      dip.score != null
        ? '<div class="cdc-score">Phase standing · <strong>' + dip.score + "%</strong></div>"
        : "";
    return (
      '<div class="cdc-frame" style="--cdc-accent:' +
      (dip.color || "#0d4f3c") +
      '">' +
      '<div class="cdc-ornament cdc-top">❖ ═══ ✦ ═══ ❖</div>' +
      '<p class="cdc-bismillah" dir="rtl" lang="ar">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>' +
      '<p class="cdc-brand">Clarity · NurOS Learning Path</p>' +
      '<h2 class="cdc-title">Certificate of Completion</h2>' +
      '<p class="cdc-latin">' +
      (dip.latin || "") +
      "</p>" +
      '<p class="cdc-arabic" dir="rtl" lang="ar">' +
      (dip.arabic || "") +
      "</p>" +
      '<p class="cdc-present">This is to recognise that</p>' +
      '<p class="cdc-recipient">' +
      escapeHtml(dip.name || "Seeker") +
      "</p>" +
      '<p class="cdc-has">has completed</p>' +
      '<p class="cdc-phase">' +
      escapeHtml(dip.title || "") +
      "</p>" +
      scoreLine +
      '<div class="cdc-meta">' +
      "<span>" +
      escapeHtml(dip.dateLabel || "") +
      "</span>" +
      '<span class="cdc-seal-code">' +
      escapeHtml(dip.seal || "") +
      "</span>" +
      "</div>" +
      '<div class="cdc-seal-mark" aria-hidden="true">' +
      (dip.sealMark || "✦") +
      "</div>" +
      '<p class="cdc-disclaimer">' +
      escapeHtml(dip.note || "") +
      "</p>" +
      '<div class="cdc-ornament cdc-bot">❖ ═══ ✦ ═══ ❖</div>' +
      (isNew ? '<p class="cdc-new-badge">Newly awarded · stored on this device</p>' : "") +
      "</div>"
    );
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function openHall() {
    var D = getDiplomas();
    var keys = Object.keys(D).sort();
    if (!keys.length) {
      var name = getName();
      if (!name) {
        var n = prompt("Set your learning name first (it appears on certificates):", "");
        if (n) setName(n);
      }
      alert(
        "No diplomas yet. Complete all modules in a phase and pass the phase quiz to graduate that track."
      );
      return;
    }
    /* show latest or hall picker */
    var hall = document.getElementById("clarity-diploma-hall");
    if (!hall) {
      hall = document.createElement("div");
      hall.id = "clarity-diploma-hall";
      hall.className = "clarity-diploma-hall";
      hall.hidden = true;
      hall.innerHTML =
        '<div class="cdh-backdrop" data-cdh-close="1"></div>' +
        '<div class="cdh-panel">' +
        '<button type="button" class="cdh-x" data-cdh-close="1">×</button>' +
        "<h2>Diploma hall</h2>" +
        '<p class="cdh-lead">Your on-device graduations. Export to move to another device.</p>' +
        '<div id="cdh-list" class="cdh-list"></div>' +
        '<div class="cdh-actions">' +
        '<button type="button" class="cdm-btn" id="cdh-export">Export portable record</button>' +
        '<button type="button" class="cdm-btn cdm-secondary" id="cdh-import">Import record</button>' +
        '<button type="button" class="cdm-btn cdm-secondary" id="cdh-transcript">Transcript</button>' +
        "</div></div>";
      document.body.appendChild(hall);
      hall.addEventListener("click", function (ev) {
        if (ev.target && ev.target.getAttribute("data-cdh-close")) {
          hall.hidden = true;
          hall.classList.remove("show");
        }
      });
      document.getElementById("cdh-export").onclick = exportPortable;
      document.getElementById("cdh-import").onclick = importFromPrompt;
      document.getElementById("cdh-transcript").onclick = showTranscript;
    }
    var list = document.getElementById("cdh-list");
    list.innerHTML = keys
      .map(function (k) {
        var d = D[k];
        return (
          '<button type="button" class="cdh-card" data-phase="' +
          d.phase +
          '">' +
          '<span class="cdh-seal">' +
          (d.sealMark || "✦") +
          "</span>" +
          "<strong>" +
          escapeHtml(d.title) +
          "</strong>" +
          "<small>" +
          escapeHtml(d.name) +
          " · " +
          escapeHtml(d.dateLabel) +
          (d.score != null ? " · " + d.score + "%" : "") +
          "</small>" +
          '<code>' +
          escapeHtml(d.seal) +
          "</code>" +
          "</button>"
        );
      })
      .join("");
    list.onclick = function (ev) {
      var btn = ev.target.closest && ev.target.closest(".cdh-card");
      if (!btn) return;
      var ph = btn.getAttribute("data-phase");
      var dip = D[ph];
      if (dip) showDiploma(dip, false);
    };
    hall.hidden = false;
    hall.classList.add("show");
  }

  function renderHall() {
    /* no-op until open; plaque stats updated */
  }

  function showTranscript() {
    var L = getLedger();
    var lines = ["Clarity University — Transcript (device-local)", "Learner: " + (getName() || "—"), ""];
    PHASES.forEach(function (p) {
      var s = (L.summary && L.summary[String(p.id)]) || null;
      var dip = getDiplomas()[String(p.id)];
      lines.push(
        "Phase " +
          p.id +
          " " +
          p.code +
          " — " +
          p.title +
          (s ? " | score " + Math.round((100 * s.correct) / (s.total || 1)) + "% (" + s.attempts + " checks)" : " | no scores yet") +
          (dip ? " | DIPLOMA " + dip.seal : " | not graduated")
      );
    });
    lines.push("", "Recent attempts:");
    (L.scores || [])
      .slice(-12)
      .reverse()
      .forEach(function (r) {
        lines.push(
          new Date(r.at).toLocaleString() +
            " · P" +
            r.phase +
            " · " +
            (r.kind || "spark") +
            " · " +
            r.correct +
            "/" +
            r.total +
            " (" +
            r.pct +
            "%)" +
            (r.moduleId ? " · " + r.moduleId : "")
        );
      });
    alert(lines.join("\n"));
  }

  function exportPortable() {
    var pack = syncPortable();
    var text = JSON.stringify(pack, null, 2);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () {
            alert("Portable university record copied. Paste it on another device via Import.");
          },
          function () {
            prompt("Copy this portable record:", text);
          }
        );
      } else {
        prompt("Copy this portable record:", text);
      }
    } catch (e) {
      prompt("Copy this portable record:", text);
    }
    /* also download file */
    try {
      var blob = new Blob([text], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "clarity-university-" + (getName() || "seeker").replace(/\s+/g, "-") + ".json";
      a.click();
      setTimeout(function () {
        URL.revokeObjectURL(a.href);
      }, 2000);
    } catch (e2) {}
  }

  function importFromPrompt() {
    var text = prompt("Paste your Clarity University portable JSON:");
    if (!text) return;
    try {
      var pack = JSON.parse(text);
      importPortable(pack);
    } catch (e) {
      alert("Could not read that pack.");
    }
  }

  /** Hook: after phase quiz pass → issue diploma */
  var prevPass = g.clarityOnPhaseQuizPass;
  g.clarityOnPhaseQuizPass = function (phase) {
    if (typeof prevPass === "function") prevPass(phase);
    /* ensure name */
    if (!getName()) {
      var n = prompt("Graduation name for your certificate:", getName() || "");
      if (n) setName(n);
    }
    issueDiploma(phase);
  };

  /** Hook spark quiz scores — wrap open */
  var prevSpark = g.clarityOpenModuleSparkQuiz;
  if (typeof prevSpark === "function") {
    g.clarityOpenModuleSparkQuiz = function (lessonId, lesson, onPass) {
      prevSpark(lessonId, lesson, function (id) {
        /* score is recorded inside spark submit — also listen via custom path */
        if (typeof onPass === "function") onPass(id);
      });
    };
  }

  /* Patch: listen to spark results via monkeypatch submit is fragile;
     expose recorder for spark quiz to call */
  g.clarityRecordUniversityScore = function (entry) {
    return recordScore(entry);
  };

  g.ClarityUniversity = {
    getName: getName,
    setName: setName,
    issueDiploma: issueDiploma,
    getDiplomas: getDiplomas,
    getLedger: getLedger,
    recordScore: recordScore,
    exportPortable: exportPortable,
    importPortable: importPortable,
    openHall: openHall,
    showTranscript: showTranscript,
    PHASES: PHASES
  };

  function boot() {
    ensureUI();
    renderPlaque();
    syncPortable();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("load", function () {
    setTimeout(boot, 300);
  });
  g.addEventListener("clarity-diploma-issued", function () {
    renderPlaque();
  });
  g.addEventListener("clarity-curriculum-phase", function () {
    renderPlaque();
  });
})(typeof window !== "undefined" ? window : this);
