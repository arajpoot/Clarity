/* Clarity University — Learner bridge v1
 * Phase 1 IA: phase query, progress surface, continue target
 * Phase 2: progress schema + sequential unlock signals for map/desk
 * Does not modify Companion landing (/). Educational only.
 */
(function (g) {
  "use strict";
  if (g.__CU_LEARNER_V1__) return;
  g.__CU_LEARNER_V1__ = true;

  var PHASE_KEY = "clarity_curriculum_phase_v1";
  var JUNIOR_KEY = "clarity_junior_progress_v1";
  var UNIV_KEY = "clarity_univ_progress_v1";
  var QUIZ_KEY = "clarity_phase_quiz_pass_v1";

  var PHASES = [
    { id: "seeker", n: 1, label: "Junior · Seeker", short: "Seeker",
      blurb: "Belief foundations. One module open. Spark quiz unlocks the next." },
    { id: "new-muslim", n: 2, label: "New Muslim", short: "Practice",
      blurb: "Purification and prayer practice. Unlocks after the Junior phase quiz." },
    { id: "daily", n: 3, label: "Daily", short: "Consistency",
      blurb: "Craft and consistency. Daily practice and habit building." },
    { id: "dai", n: 4, label: "Da'i", short: "Transmission",
      blurb: "Transmit with adab. Responsibility and wise invitation." }
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
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }

  function currentPhaseNum() {
    var p = lsGet(PHASE_KEY, 1);
    if (typeof p === "object" && p && p.phase) p = p.phase;
    p = parseInt(p, 10);
    if (!p || p < 1) p = 1;
    if (p > 4) p = 4;
    return p;
  }

  function quizPassed(n) {
    var q = lsGet(QUIZ_KEY, {});
    if (!q || typeof q !== "object") return false;
    return !!(q[String(n)] || q[n] || q["phase-" + n]);
  }

  function juniorDoneCount() {
    var pr = lsGet(JUNIOR_KEY, {});
    if (!pr || typeof pr !== "object") return 0;
    var n = 0;
    Object.keys(pr).forEach(function (k) {
      if (pr[k] && (pr[k].done || pr[k] === true)) n++;
    });
    return n;
  }

  function univSnapshot() {
    var snap = lsGet(UNIV_KEY, null);
    if (!snap || typeof snap !== "object") {
      snap = {
        phase: currentPhaseNum(),
        lastPhaseId: PHASES[currentPhaseNum() - 1].id,
        lastModuleId: null,
        updated: Date.now()
      };
    }
    snap.phase = currentPhaseNum();
    return snap;
  }

  function saveUnivSnapshot(partial) {
    var s = univSnapshot();
    if (partial) {
      Object.keys(partial).forEach(function (k) { s[k] = partial[k]; });
    }
    s.updated = Date.now();
    lsSet(UNIV_KEY, s);
    return s;
  }

  function phaseUnlocked(n) {
    if (n <= 1) return true;
    /* prior phase quiz pass OR explicit phase key advanced */
    if (currentPhaseNum() >= n) return true;
    if (quizPassed(n - 1)) return true;
    return false;
  }

  function phaseStatus(n) {
    if (!phaseUnlocked(n)) return "locked";
    if (n < currentPhaseNum() || quizPassed(n)) return "done";
    return "open";
  }

  function deskUrl(phaseId) {
    return "/campus/desk/?phase=" + encodeURIComponent(phaseId || "seeker");
  }

  function parsePhaseFromLocation() {
    try {
      var u = new URL(location.href);
      var q = (u.searchParams.get("phase") || "").toLowerCase();
      if (q === "junior") q = "seeker";
      if (q === "practice" || q === "newmuslim") q = "new-muslim";
      if (q === "consistency") q = "daily";
      if (q === "transmission") q = "dai";
      for (var i = 0; i < PHASES.length; i++) {
        if (PHASES[i].id === q) return PHASES[i];
      }
      var n = currentPhaseNum();
      return PHASES[n - 1] || PHASES[0];
    } catch (e) {
      return PHASES[0];
    }
  }

  /** Map page: badges + lock classes + continue */
  function paintMap() {
    var grid = document.getElementById("cu-phase-grid");
    if (!grid) return;
    var snap = univSnapshot();
    PHASES.forEach(function (ph) {
      var card = grid.querySelector('[data-phase="' + ph.id + '"]');
      if (!card) return;
      var st = phaseStatus(ph.n);
      card.classList.toggle("locked", st === "locked");
      if (st === "locked") {
        card.setAttribute("aria-disabled", "true");
        card.addEventListener("click", function (ev) {
          ev.preventDefault();
          alert("Complete the previous phase quiz to unlock " + ph.label + ".");
        });
      } else {
        card.href = deskUrl(ph.id);
        card.removeAttribute("aria-disabled");
      }
      var badge = card.querySelector(".cu-badge");
      if (badge) {
        badge.className = "cu-badge " + st;
        badge.textContent = st === "done" ? "Done" : st === "open" ? "Open" : "Locked";
      }
    });
    var cont = document.getElementById("cu-continue");
    if (cont) {
      var cur = PHASES[snap.phase - 1] || PHASES[0];
      var title = cont.querySelector("[data-cu-continue-title]");
      var sub = cont.querySelector("[data-cu-continue-sub]");
      var a = cont.querySelector("a");
      if (title) title.textContent = "Continue · " + cur.label;
      if (sub) {
        var jd = juniorDoneCount();
        sub.textContent = cur.n === 1
          ? (jd ? jd + " junior checks recorded on this device" : "Start Unit 1 — Who is Allah?")
          : cur.blurb;
      }
      if (a) a.href = deskUrl(cur.id);
    }
  }

  /** Desk: phase tabs + learner-first roles + seed phase storage */
  function paintDesk() {
    var ph = parsePhaseFromLocation();
    saveUnivSnapshot({ phase: ph.n, lastPhaseId: ph.id });
    try {
      /* align controller phase if present */
      var cur = currentPhaseNum();
      if (ph.n !== cur && phaseUnlocked(ph.n)) {
        lsSet(PHASE_KEY, ph.n);
      }
    } catch (e) {}

    var tabs = document.getElementById("cu-phase-tabs");
    if (tabs) {
      tabs.innerHTML = "";
      PHASES.forEach(function (p) {
        var a = document.createElement("a");
        a.href = deskUrl(p.id);
        a.textContent = p.short;
        if (p.id === ph.id) a.className = "on";
        if (!phaseUnlocked(p.n)) {
          a.href = "#";
          a.style.opacity = "0.45";
          a.title = "Locked until previous phase quiz is passed";
          a.addEventListener("click", function (ev) { ev.preventDefault(); });
        }
        tabs.appendChild(a);
      });
    }

    var label = document.getElementById("cu-desk-label");
    if (label) label.textContent = "University Desk · " + ph.label;

    var toggle = document.getElementById("cu-roles-toggle");
    var roles = document.getElementById("roles");
    if (toggle && roles) {
      roles.classList.add("cu-roles");
      roles.classList.remove("show");
      toggle.addEventListener("click", function () {
        roles.classList.toggle("show");
        toggle.textContent = roles.classList.contains("show")
          ? "Hide campus roles"
          : "Campus roles (staff / IT)";
      });
    }

    /* Empty-state fallback if stage stays empty */
    setTimeout(function () {
      var body = document.getElementById("campus-stage-body");
      if (!body) return;
      if (body.children.length === 0 || !(body.textContent || "").trim()) {
        if (body.querySelector(".cu-empty")) return;
        var d = document.createElement("div");
        d.className = "cu-empty";
        d.innerHTML =
          "<strong style=\"color:#f3e6c0\">Loading curriculum…</strong><br/>" +
          "If this stays empty, hard-refresh or clear site data for university assets only.<br/>" +
          "<span style=\"color:var(--cu-gold)\">Phase: " + ph.label + "</span>";
        body.appendChild(d);
      }
    }, 2800);

    /* Signal to existing campus engines */
    try {
      g.dispatchEvent(new CustomEvent("cu-phase-selected", { detail: { id: ph.id, n: ph.n } }));
    } catch (e2) {}
  }

  function boot() {
    if (document.getElementById("cu-phase-grid")) paintMap();
    if (document.body && document.body.getAttribute("data-campus-page") === "desk") paintDesk();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  g.addEventListener("load", function () { setTimeout(boot, 200); });

  g.ClarityUnivLearner = {
    phases: PHASES,
    currentPhaseNum: currentPhaseNum,
    phaseStatus: phaseStatus,
    deskUrl: deskUrl,
    snapshot: univSnapshot,
    saveSnapshot: saveUnivSnapshot
  };
})(typeof window !== "undefined" ? window : this);
