/* Campus mount bridge v1 — place foundation curriculum into #campus-stage-body
 * Fixes empty desk after welcome (seeker mountBoost targets Companion RRRA only).
 * Educational only — not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CU_CAMPUS_MOUNT_V1__) return;
  g.__CU_CAMPUS_MOUNT_V1__ = true;

  var CARD_BY_PHASE = {
    1: "junior-curriculum-card",
    2: "junior-high-curriculum-card",
    3: "daily-hs-curriculum-card",
    4: "dai-university-curriculum-card"
  };
  var PATH_BY_PHASE = {
    1: "seeker",
    2: "new-muslim",
    3: "daily",
    4: "dai"
  };

  function phaseNum() {
    try {
      if (g.ClarityUnivLearner) return g.ClarityUnivLearner.currentPhaseNum();
    } catch (e) {}
    try {
      var u = new URL(location.href);
      var q = (u.searchParams.get("phase") || "seeker").toLowerCase();
      var map = { seeker: 1, junior: 1, "new-muslim": 2, newmuslim: 2, daily: 3, dai: 4 };
      if (map[q]) return map[q];
    } catch (e2) {}
    try {
      return parseInt(localStorage.getItem("clarity_curriculum_phase_v1") || "1", 10) || 1;
    } catch (e3) {
      return 1;
    }
  }

  function alignStorage() {
    var n = phaseNum();
    var path = PATH_BY_PHASE[n] || "seeker";
    try {
      localStorage.setItem("clarity_curriculum_phase_v1", String(n));
      localStorage.setItem("clarity_path_focus", path);
      localStorage.setItem("clarity_committed_path", path);
    } catch (e) {}
    return { n: n, path: path };
  }

  function stageBody() {
    var body = document.getElementById("campus-stage-body");
    if (body) return body;
    var stage = document.getElementById("clarity-campus-stage");
    if (stage) {
      body = document.createElement("div");
      body.id = "campus-stage-body";
      stage.appendChild(body);
      return body;
    }
    return null;
  }

  function showCard(card) {
    if (!card) return;
    try {
      card.classList.remove("gate-hidden", "hidden");
      card.removeAttribute("data-gate-hidden");
      card.hidden = false;
      card.style.removeProperty("display");
      card.style.display = "";
    } catch (e) {}
  }

  function placeCard(id) {
    var body = stageBody();
    if (!body) return null;
    var card = document.getElementById(id);
    if (!card) return null;
    if (card.parentNode !== body) {
      try {
        body.insertBefore(card, body.firstChild);
      } catch (e) {
        try {
          body.appendChild(card);
        } catch (e2) {}
      }
    }
    showCard(card);
    /* hide other phase cards in stage */
    Object.keys(CARD_BY_PHASE).forEach(function (k) {
      var oid = CARD_BY_PHASE[k];
      if (oid === id) return;
      var other = document.getElementById(oid);
      if (other && other.parentNode === body) {
        try {
          other.style.display = "none";
        } catch (e3) {}
      }
    });
    return card;
  }

  function triggerRender(n) {
    try {
      if (n === 1 && g.ClarityJuniorCurriculum && typeof g.ClarityJuniorCurriculum.render === "function") {
        g.ClarityJuniorCurriculum.render();
      }
    } catch (e) {}
    try {
      if (typeof g.clarityRefreshPhasePlaque === "function") g.clarityRefreshPhasePlaque();
    } catch (e2) {}
  }

  function ensureSeekerCard() {
    /* If seeker never appended, create via public path by calling ensure through render */
    var card = document.getElementById("junior-curriculum-card");
    if (card) return card;
    try {
      if (g.ClarityJuniorCurriculum && typeof g.ClarityJuniorCurriculum.render === "function") {
        g.ClarityJuniorCurriculum.render();
      }
    } catch (e) {}
    return document.getElementById("junior-curriculum-card");
  }

  function removeEmptyPlaceholder() {
    var body = stageBody();
    if (!body) return;
    var empty = body.querySelector(".cu-empty");
    if (empty && body.querySelector("#junior-curriculum-card, .curriculum-phase-card, .junior-module")) {
      empty.remove();
    }
  }

  var tries = 0;
  function tick() {
    tries++;
    var meta = alignStorage();
    var id = CARD_BY_PHASE[meta.n] || CARD_BY_PHASE[1];
    if (meta.n === 1) ensureSeekerCard();
    var card = placeCard(id);
    if (!card && meta.n === 1) {
      /* force create by cloning structure if API present */
      try {
        if (g.ClarityJuniorCurriculum) g.ClarityJuniorCurriculum.render();
      } catch (e) {}
      card = placeCard(id);
    }
    triggerRender(meta.n);
    removeEmptyPlaceholder();
    if (!card && tries < 25) {
      setTimeout(tick, tries < 8 ? 200 : 500);
    } else if (card) {
      /* keep a few follow-up renders for late boot */
      setTimeout(function () {
        placeCard(id);
        triggerRender(meta.n);
        removeEmptyPlaceholder();
      }, 400);
      setTimeout(function () {
        placeCard(id);
        triggerRender(meta.n);
      }, 1200);
    }
  }

  function boot() {
    if (!document.body || document.body.getAttribute("data-campus-page") !== "desk") return;
    alignStorage();
    setTimeout(tick, 100);
    g.addEventListener("clarity-vault-ready", function () {
      tries = 0;
      setTimeout(tick, 50);
    });
    g.addEventListener("cu-phase-selected", function () {
      tries = 0;
      setTimeout(tick, 80);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
