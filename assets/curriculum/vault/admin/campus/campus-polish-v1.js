/**
 * Campus Polish v1 — lab wiring, nav dedupe, admin pills, phase plaque beauty, arc depth
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_CAMPUS_POLISH_V1__) return;
  g.__CLARITY_CAMPUS_POLISH_V1__ = true;
  var VER = "20261009POLISH";

  /* 1. Dedupe Clarity wording — keep University brand, soft badge */
  function dedupeNav() {
    var badge = document.getElementById("current-mode-badge");
    if (badge) {
      var t = (badge.textContent || "").trim().toLowerCase();
      if (t === "clarity" || t === "clarity mode") {
        badge.textContent = "Campus";
        badge.title = "Clarity University campus mode";
        badge.classList.add("mode-badge-campus");
      }
    }
  }

  /* 2. Lab openCard — real wiring to tools */
  function openToolCard(id) {
    if (!id) return false;
    var map = {
      "tajweed-live-card": { door: "reflection", lazy: "tjLmr", alts: ["tj-lmr-panel", "tj-deep-studio", "tj-lmr"] },
      "meme-card": { door: "reminder", alts: ["tweet-desk-card", "meme-studio-root", "meme-card"] },
      "callig-lab-card": { door: "reflection", alts: ["callig-lab-card", "callig-card"] },
      "deepen-study-card": { door: "reality", alts: ["deepen-study-card", "ilm-pathway-card"] }
    };
    var conf = map[id] || { alts: [id] };
    try {
      if (conf.door && typeof g.clarityOpenSectionDoor === "function") {
        g.clarityOpenSectionDoor(conf.door);
      }
    } catch (e) {}
    try {
      if (conf.lazy && g.ClarityLazy && typeof g.ClarityLazy[conf.lazy] === "function") {
        g.ClarityLazy[conf.lazy]();
      }
    } catch (e2) {}
    var found = null;
    (conf.alts || [id]).forEach(function (aid) {
      if (found) return;
      var el = document.getElementById(aid);
      if (el) found = el;
    });
    if (found) {
      try {
        found.classList.remove("gate-hidden", "hidden");
        found.hidden = false;
        found.style.removeProperty("display");
        found.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (e3) {}
      return true;
    }
    return false;
  }

  function wireLabOpen() {
    if (g.ClarityLab && typeof g.ClarityLab.openStation === "function") {
      /* patch openCard used inside lab via global helper */
    }
    g.clarityLabOpenTool = openToolCard;
    /* delegate clicks on data-open-card */
    document.addEventListener(
      "click",
      function (ev) {
        var t = ev.target && ev.target.closest && ev.target.closest("[data-open-card]");
        if (!t) return;
        var id = t.getAttribute("data-open-card");
        if (!id) return;
        ev.preventDefault();
        var ok = openToolCard(id);
        if (!ok) {
          try {
            alert("Tool card is still loading. Open the matching bottom tab (Reminder / Reality / Reflection) and try again.");
          } catch (e) {}
        }
      },
      true
    );
  }

  /* 3. Admin pills — ensure hall host + re-click binding */
  function ensureAdminHost() {
    var host =
      document.querySelector(".cnp-inner") ||
      document.getElementById("clarity-name-plaque-rail") ||
      document.getElementById("clarity-phase-plaque-rail");
    if (!host) {
      var stage = document.getElementById("campus-stage-body") || document.getElementById("clarity-campus-stage");
      if (!stage) return null;
      host = document.getElementById("clarity-admin-pill-rail");
      if (!host) {
        host = document.createElement("div");
        host.id = "clarity-admin-pill-rail";
        host.className = "cnp-inner clarity-admin-pill-rail";
        stage.insertBefore(host, stage.firstChild);
      }
    }
    return host;
  }

  function wireAdminPills() {
    var host = ensureAdminHost();
    if (!host) return;
    /* event delegation for cnp-hall-btn */
    if (!host.__adminWired) {
      host.__adminWired = true;
      host.addEventListener("click", function (ev) {
        var btn = ev.target.closest && ev.target.closest(".cnp-hall-btn, [id^='cnp-']");
        if (!btn) return;
        var id = btn.id || "";
        try {
          if (id.indexOf("faculty") >= 0 && g.ClarityFaculty && g.ClarityFaculty.open) g.ClarityFaculty.open();
          else if (id.indexOf("faculty") >= 0) btn.onclick && btn.onclick();
          if (id.indexOf("chan") >= 0 && g.ClarityChancellor && g.ClarityChancellor.open) g.ClarityChancellor.open();
          if (id.indexOf("registrar") >= 0 && g.ClarityRegistrar && g.ClarityRegistrar.open) g.ClarityRegistrar.open();
          if (id.indexOf("security") >= 0 && g.ClaritySecurity && g.ClaritySecurity.open) g.ClaritySecurity.open();
          if (id.indexOf("om") >= 0 && g.ClarityOM && g.ClarityOM.open) g.ClarityOM.open();
          if (id.indexOf("it") >= 0 && g.ClarityIT && g.ClarityIT.open) g.ClarityIT.open();
          if (id.indexOf("lab") >= 0 && g.ClarityLab && g.ClarityLab.render) {
            g.ClarityLab.render();
            var lab = document.getElementById("clarity-lab-shell");
            if (lab) lab.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        } catch (e) {}
      });
    }
    /* re-inject doors if APIs expose inject */
    try {
      if (g.ClarityFaculty && g.ClarityFaculty.render) g.ClarityFaculty.render();
    } catch (e) {}
  }

  /* 4. Phase 2 empty body — re-sync practice track */
  function rescuePhaseCards() {
    try {
      if (g.ClarityJuniorHighCurriculum && g.ClarityJuniorHighCurriculum.render) {
        g.ClarityJuniorHighCurriculum.render();
      }
    } catch (e) {}
    try {
      if (g.ClarityJuniorCurriculum && g.ClarityJuniorCurriculum.render) {
        g.ClarityJuniorCurriculum.render();
      }
    } catch (e2) {}
    var jh = document.getElementById("junior-high-curriculum-card");
    var body = document.getElementById("jh-curriculum-body");
    if (jh && body && !body.innerHTML.trim()) {
      body.innerHTML =
        '<p class="muted">Phase 2 modules unlock after you finish Junior and pass the phase quiz. Keep going on Phase 1 — Module progress is on the plaque above.</p>';
    }
  }

  /* 5. Beautiful how-phases plaque class */
  function stylePhaseHow() {
    var how = document.querySelector(".cpp-how");
    if (how) how.classList.add("cpp-how-plaque");
  }

  function boot() {
    dedupeNav();
    wireLabOpen();
    wireAdminPills();
    rescuePhaseCards();
    stylePhaseHow();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(boot, 800);
      setTimeout(boot, 2200);
      setTimeout(rescuePhaseCards, 3500);
    });
  } else {
    setTimeout(boot, 800);
    setTimeout(boot, 2200);
  }
  g.addEventListener("clarity-vault-ready", function () {
    setTimeout(boot, 500);
    setTimeout(rescuePhaseCards, 1200);
  });
  g.addEventListener("clarity-curriculum-phase", function () {
    setTimeout(rescuePhaseCards, 200);
    setTimeout(stylePhaseHow, 200);
  });

  g.ClarityCampusPolish = { version: VER, openToolCard: openToolCard, dedupeNav: dedupeNav };
  try {
    console.info("%c Campus Polish ", "background:#0d4f3c;color:#f0e6c8", VER);
  } catch (e) {}
})(typeof window !== "undefined" ? window : this);
