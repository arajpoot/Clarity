/**
 * Campus Rescue v3 — stage recovery without fighting live curriculum
 * Educational only.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_CAMPUS_RESCUE_V3__) return;
  g.__CLARITY_CAMPUS_RESCUE_V3__ = true;
  g.__CLARITY_CAMPUS_RESCUE_V2__ = true;

  if (typeof g.clarityOpenSectionDoor !== "function") {
    g.clarityOpenSectionDoor = function (tab) {
      try {
        document.documentElement.setAttribute("data-active-tab", String(tab || "journey"));
        document.dispatchEvent(
          new CustomEvent("clarity-rrra-change", { detail: { hub: tab, tab: tab } })
        );
      } catch (e) {}
    };
  }

  function stageBody() {
    return document.getElementById("campus-stage-body");
  }

  function hasCurriculum() {
    if (document.getElementById("junior-curriculum-card")) return true;
    if (document.getElementById("junior-high-curriculum-card")) return true;
    if (document.getElementById("daily-hs-curriculum-card")) return true;
    if (document.getElementById("dai-university-curriculum-card")) return true;
    var body = stageBody();
    if (!body) return false;
    if (body.querySelector(".junior-module, .junior-body, .curriculum-phase-card, [data-curriculum-phase]"))
      return true;
    // unit headings from seeker render
    if (body.querySelector("h3, .junior-prog-label, .junior-bar")) return true;
    return false;
  }

  function removeRescue() {
    var card = document.getElementById("campus-rescue-card");
    if (card) {
      try {
        card.remove();
      } catch (e) {}
    }
    var hint = document.getElementById("campus-loading-hint");
    if (hint && hasCurriculum()) {
      try {
        hint.remove();
      } catch (e2) {}
    }
  }

  function tryJunior() {
    try {
      if (g.ClarityJuniorCurriculum && typeof g.ClarityJuniorCurriculum.render === "function") {
        g.ClarityJuniorCurriculum.render();
      }
      if (g.ClarityJuniorHighCurriculum && g.ClarityJuniorHighCurriculum.render) {
        g.ClarityJuniorHighCurriculum.render();
      }
      if (g.ClarityDailyHsCurriculum && g.ClarityDailyHsCurriculum.render) {
        g.ClarityDailyHsCurriculum.render();
      }
      if (g.ClarityDaiUniversityCurriculum && g.ClarityDaiUniversityCurriculum.render) {
        g.ClarityDaiUniversityCurriculum.render();
      }
      if (g.ClarityCampus && g.ClarityCampus.adoptCurriculumCards) {
        g.ClarityCampus.adoptCurriculumCards();
      }
    } catch (e) {}
    return hasCurriculum();
  }

  function ensureStage() {
    if (hasCurriculum()) {
      removeRescue();
      return;
    }
    try {
      if (g.ClarityCampus && typeof g.ClarityCampus.run === "function") g.ClarityCampus.run();
    } catch (e) {}
    var body = stageBody();
    if (!body) return;

    if (tryJunior()) {
      removeRescue();
      return;
    }
    if (hasCurriculum()) {
      removeRescue();
      return;
    }

    // Only show rescue if still empty after attempts
    if (document.getElementById("campus-rescue-card")) return;
    // Don't inject if body already has non-hint children that look like content
    var kids = body.children;
    for (var i = 0; i < kids.length; i++) {
      var id = kids[i].id || "";
      if (id && id !== "campus-loading-hint" && id !== "campus-rescue-card") {
        return;
      }
    }

    var card = document.createElement("section");
    card.id = "campus-rescue-card";
    card.className = "curriculum-card";
    card.innerHTML =
      '<h2 class="card-title">Learning desk</h2>' +
      '<p class="muted">Waiting for sealed Junior curriculum (vault). If this stays empty after a few seconds, tap retry or hard-refresh once.</p>' +
      '<p><button type="button" class="btn-soft" id="campus-rescue-retry">Retry load</button></p>';
    body.appendChild(card);
    var btn = document.getElementById("campus-rescue-retry");
    if (btn) {
      btn.onclick = function () {
        tryJunior();
        if (hasCurriculum()) removeRescue();
      };
    }
  }

  function tick() {
    ensureStage();
    if (hasCurriculum()) removeRescue();
  }

  function boot() {
    tick();
    setTimeout(tick, 400);
    setTimeout(tick, 1200);
    setTimeout(tick, 2500);
    setTimeout(tick, 5000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("clarity-vault-ready", function () {
    setTimeout(tick, 50);
    setTimeout(tick, 300);
    setTimeout(tick, 900);
    setTimeout(tick, 2000);
  });
})(typeof window !== "undefined" ? window : this);
