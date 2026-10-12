/* Campus mount bridge v3 — R2 desk never empty + phase cards */
(function (g) {
  "use strict";
  if (g.__CU_CAMPUS_MOUNT_V3__) return;
  g.__CU_CAMPUS_MOUNT_V3__ = true;
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

  function ensureSkeleton() {
    var body = stageBody();
    if (!body) return;
    if (body.querySelector(".curriculum-phase-card, [id$='-curriculum-card'] .junior-module")) {
      removeSkeleton();
      return;
    }
    if (body.querySelector(".cu-skel")) return;
    var sk = document.createElement("div");
    sk.className = "cu-skel";
    sk.id = "cu-stage-skeleton";
    sk.innerHTML =
      '<div class="cu-skel-tile"></div><div class="cu-skel-tile"></div><div class="cu-skel-tile"></div>' +
      '<p class="cu-empty" style="border:none;padding:0.4rem 0">Loading modules…</p>';
    body.appendChild(sk);
  }

  function removeSkeleton() {
    var sk = document.getElementById("cu-stage-skeleton");
    if (sk) sk.remove();
    var body = stageBody();
    if (!body) return;
    body.querySelectorAll(".cu-empty").forEach(function (n) {
      if ((n.textContent || "").indexOf("Loading") >= 0) n.remove();
    });
  }

  function showRetry() {
    var body = stageBody();
    if (!body || body.querySelector(".cu-retry")) return;
    removeSkeleton();
    var box = document.createElement("div");
    box.className = "cu-empty";
    box.innerHTML =
      "Modules did not mount yet.<br/>Check connection or retry." +
      '<br/><button type="button" class="cu-retry" id="cu-mount-retry">Retry load</button>';
    body.appendChild(box);
    var btn = document.getElementById("cu-mount-retry");
    if (btn) {
      btn.onclick = function () {
        box.remove();
        tries = 0;
        ensureSkeleton();
        tick();
      };
    }
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
      var api = g[API_BY_PHASE[pn]];
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
  }

  var tries = 0;
  function tick() {
    tries++;
    var meta = alignStorage();
    ensureSkeleton();
    syncTracks(meta.n);
    var id = CARD_BY_PHASE[meta.n];
    var card = id && document.getElementById(id);
    var hasBody =
      card &&
      ((card.textContent || "").length > 40 ||
        card.querySelector(".junior-module, .junior-progress, [id$='-body']"));
    if (hasBody) {
      removeSkeleton();
      setTimeout(function () {
        syncTracks(meta.n);
        removeSkeleton();
      }, 400);
      return;
    }
    if (tries < 28) setTimeout(tick, tries < 10 ? 200 : 450);
    else showRetry();
  }

  function boot() {
    if (!document.body || document.body.getAttribute("data-campus-page") !== "desk") return;
    alignStorage();
    ensureSkeleton();
    setTimeout(tick, 60);
    g.addEventListener("clarity-vault-ready", function () {
      tries = 0;
      ensureSkeleton();
      setTimeout(tick, 40);
    });
    g.addEventListener("cu-phase-selected", function () {
      tries = 0;
      ensureSkeleton();
      setTimeout(tick, 60);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
