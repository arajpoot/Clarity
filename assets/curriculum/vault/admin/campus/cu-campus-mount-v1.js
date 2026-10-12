/* Campus mount bridge v2 — Phases B: all phase cards into #campus-stage-body */
(function (g) {
  "use strict";
  if (g.__CU_CAMPUS_MOUNT_V2__) return;
  g.__CU_CAMPUS_MOUNT_V2__ = true;
  g.__CU_CAMPUS_MOUNT_V1__ = true;

  var CARD_BY_PHASE = {
    1: "junior-curriculum-card",
    2: "junior-high-curriculum-card",
    3: "daily-hs-curriculum-card",
    4: "dai-university-curriculum-card"
  };
  var PATH_BY_PHASE = { 1: "seeker", 2: "new-muslim", 3: "daily", 4: "dai" };
  var API_BY_PHASE = {
    1: "ClarityJuniorCurriculum",
    2: "ClarityJuniorHighCurriculum",
    3: "ClarityDailyHsCurriculum",
    4: "ClarityDaiUniversity"
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

  function showCard(card, on) {
    if (!card) return;
    try {
      if (on) {
        card.classList.remove("gate-hidden", "hidden");
        card.removeAttribute("data-gate-hidden");
        card.hidden = false;
        card.style.removeProperty("display");
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
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
    return card;
  }

  function syncTracks(n) {
    Object.keys(CARD_BY_PHASE).forEach(function (k) {
      var pn = parseInt(k, 10);
      var id = CARD_BY_PHASE[k];
      var card = placeCard(id);
      showCard(card, pn === n);
      var apiName = API_BY_PHASE[pn];
      var api = g[apiName];
      try {
        if (api && typeof api.show === "function") api.show(pn === n);
        if (pn === n && api && typeof api.render === "function") api.render();
      } catch (e) {}
    });
    try {
      if (n === 1 && g.ClarityJuniorCurriculum && typeof g.ClarityJuniorCurriculum.render === "function") {
        g.ClarityJuniorCurriculum.render();
      }
    } catch (e2) {}
    try {
      if (typeof g.clarityRefreshPhasePlaque === "function") g.clarityRefreshPhasePlaque();
    } catch (e3) {}
    try {
      g.dispatchEvent(new CustomEvent("clarity-path-changed", { detail: { path: PATH_BY_PHASE[n] } }));
    } catch (e4) {}
  }

  function removeEmpty() {
    var body = stageBody();
    if (!body) return;
    var empty = body.querySelector(".cu-empty");
    if (empty && body.querySelector(".curriculum-phase-card, .junior-module, [id$='-curriculum-card']")) {
      empty.remove();
    }
  }

  var tries = 0;
  function tick() {
    tries++;
    var meta = alignStorage();
    syncTracks(meta.n);
    removeEmpty();
    var id = CARD_BY_PHASE[meta.n];
    var card = id && document.getElementById(id);
    if (!card && tries < 30) setTimeout(tick, tries < 10 ? 200 : 450);
    else if (card) {
      setTimeout(function () {
        syncTracks(meta.n);
        removeEmpty();
      }, 500);
      setTimeout(function () {
        syncTracks(meta.n);
      }, 1500);
    }
  }

  function boot() {
    if (!document.body || document.body.getAttribute("data-campus-page") !== "desk") return;
    alignStorage();
    setTimeout(tick, 80);
    g.addEventListener("clarity-vault-ready", function () {
      tries = 0;
      setTimeout(tick, 40);
    });
    g.addEventListener("cu-phase-selected", function () {
      tries = 0;
      setTimeout(tick, 60);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
