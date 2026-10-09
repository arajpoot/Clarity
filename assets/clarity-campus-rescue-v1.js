/**
 * Campus Rescue v1 — door poly safe + empty stage recovery + diploma freeze safe
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_CAMPUS_RESCUE_V1__) return;
  g.__CLARITY_CAMPUS_RESCUE_V1__ = true;
  var VER = "20261009CAMPUS3";

  /* Ensure door API always callable */
  if (typeof g.clarityOpenSectionDoor !== "function") {
    g.clarityOpenSectionDoor = function (tab) {
      try {
        document.documentElement.setAttribute("data-active-tab", String(tab || "journey"));
        document.dispatchEvent(new CustomEvent("clarity-rrra-change", { detail: { hub: tab, tab: tab } }));
      } catch (e) {}
    };
  }

  /* Diploma: never throw on frozen ClarityUniversity */
  function softDiplomaHook() {
    try {
      var U = g.ClarityUniversity;
      if (!U || typeof U.issueDiploma !== "function") return;
      if (Object.isFrozen(U)) return;
      /* leave as-is if writable */
    } catch (e) {}
  }

  function stageEmpty() {
    var body = document.getElementById("campus-stage-body");
    if (!body) return true;
    return !body.querySelector("#junior-curriculum-card, .junior-body, .junior-module, [data-module]");
  }

  function rescueJunior() {
    try {
      if (g.ClarityJuniorCurriculum && typeof g.ClarityJuniorCurriculum.render === "function") {
        g.ClarityJuniorCurriculum.render();
        return true;
      }
    } catch (e) {}
    /* manual minimal card if vault junior missing */
    var body = document.getElementById("campus-stage-body");
    if (!body || document.getElementById("junior-curriculum-card")) return !!document.getElementById("junior-curriculum-card");
    var card = document.createElement("section");
    card.id = "junior-curriculum-card";
    card.className = "curriculum-card junior-active";
    card.innerHTML =
      '<h2 class="card-title">Junior · Seeker foundations</h2>' +
      '<p class="muted">Curriculum desk is waking up. If this stays empty, hard-refresh once (vault SEAL loads foundation modules).</p>' +
      '<p><button type="button" class="btn-soft" id="campus-rescue-retry">Retry load</button></p>';
    body.appendChild(card);
    var btn = document.getElementById("campus-rescue-retry");
    if (btn) {
      btn.onclick = function () {
        try {
          if (g.ClarityVault && g.ClarityVault.status) console.info(g.ClarityVault.status());
          if (g.ClarityCampus && g.ClarityCampus.run) g.ClarityCampus.run();
          if (g.ClarityJuniorCurriculum && g.ClarityJuniorCurriculum.render) g.ClarityJuniorCurriculum.render();
        } catch (e) {}
      };
    }
    return true;
  }

  function tick() {
    softDiplomaHook();
    if (stageEmpty()) rescueJunior();
  }

  function boot() {
    tick();
    setTimeout(tick, 600);
    setTimeout(tick, 1800);
    setTimeout(tick, 3500);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("clarity-vault-ready", function () {
    setTimeout(tick, 100);
    setTimeout(tick, 800);
  });
})(typeof window !== "undefined" ? window : this);
