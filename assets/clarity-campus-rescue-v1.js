/**
 * Campus Rescue v2 — door API, stage recovery, post-vault junior mount
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_CAMPUS_RESCUE_V2__) return;
  g.__CLARITY_CAMPUS_RESCUE_V2__ = true;
  var VER = "20261009VAULT";

  if (typeof g.clarityOpenSectionDoor !== "function") {
    g.clarityOpenSectionDoor = function (tab) {
      try {
        document.documentElement.setAttribute("data-active-tab", String(tab || "journey"));
        document.dispatchEvent(new CustomEvent("clarity-rrra-change", { detail: { hub: tab, tab: tab } }));
      } catch (e) {}
    };
  }

  function stageBody() {
    return document.getElementById("campus-stage-body");
  }

  function hasJunior() {
    return !!document.getElementById("junior-curriculum-card");
  }

  function tryJunior() {
    try {
      if (g.ClarityJuniorCurriculum) {
        if (typeof g.ClarityJuniorCurriculum.render === "function") g.ClarityJuniorCurriculum.render();
        return hasJunior();
      }
    } catch (e) {}
    return false;
  }

  function ensureStage() {
    try {
      if (g.ClarityCampus && typeof g.ClarityCampus.run === "function") g.ClarityCampus.run();
    } catch (e) {}
    var body = stageBody();
    if (!body) {
      try {
        if (g.ClarityCampus && g.ClarityCampus.run) g.ClarityCampus.run();
      } catch (e2) {}
      body = stageBody();
    }
    if (!body) return;
    if (tryJunior()) return;
    if (hasJunior()) return;
    if (document.getElementById("campus-rescue-card")) return;
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
        try {
          if (g.ClarityCampus) g.ClarityCampus.run();
        } catch (e) {}
        if (hasJunior()) {
          try { card.remove(); } catch (e) {}
        }
      };
    }
  }

  function tick() {
    ensureStage();
  }

  function boot() {
    tick();
    setTimeout(tick, 500);
    setTimeout(tick, 1500);
    setTimeout(tick, 3000);
    setTimeout(tick, 5000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("clarity-vault-ready", function () {
    setTimeout(tick, 50);
    setTimeout(tick, 400);
    setTimeout(tick, 1200);
  });
})(typeof window !== "undefined" ? window : this);
