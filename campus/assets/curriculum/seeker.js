/**
 * Surface curriculum loader — seeker only (F1-F3)
 * Does not load other colleges. Foundation files stay deep.
 */
(function (g) {
  "use strict";
  var ROOM = "seeker";
  var API = "ClarityJuniorCurriculum";
  var CHAIN = ["/assets/curriculum/vault/foundation/engine.js", "/assets/curriculum/vault/foundation/spark-quiz.js", "/assets/curriculum/vault/foundation/phase-plaque.js", "/assets/curriculum/vault/foundation/college-seeker.js"];
  var VER = "20261017F0F3";
  if (g.__CU_CURRICULUM_LOADER__ === ROOM) return;

  function currentRoom() {
    return (document.body && document.body.getAttribute("data-phase-room")) || "";
  }
  if (currentRoom() && currentRoom() !== ROOM) {
    console.info("[CU curriculum] skip " + ROOM + " loader on room=" + currentRoom());
    return;
  }
  g.__CU_CURRICULUM_LOADER__ = ROOM;

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var base = src.split("?").shift().split("/").pop();
      if (document.querySelector('script[data-cu-curr="'+base+'"]')) return resolve();
      var s = document.createElement("script");
      s.src = src + (src.indexOf("?") >= 0 ? "&" : "?") + "v=" + VER;
      s.defer = false;
      s.dataset.cuCurr = base;
      s.dataset.cuRoom = ROOM;
      s.onload = function () { resolve(); };
      s.onerror = function () { console.warn("[CU curriculum] fail", src); resolve(); };
      document.head.appendChild(s);
    });
  }

  function isolate() {
    var map = {
      ClarityJuniorCurriculum: "seeker",
      ClarityJuniorHighCurriculum: "practice",
      ClarityDailyHsCurriculum: "consistency",
      ClarityDaiUniversity: "transmission",
      ClarityDaiUniversityCurriculum: "transmission"
    };
    Object.keys(map).forEach(function (name) {
      var api = g[name];
      if (!api || typeof api.render !== "function" || api.__cu_room_isolated) return;
      var orig = api.render;
      api.render = function () {
        if (currentRoom() !== map[name]) return;
        return orig.apply(api, arguments);
      };
      api.__cu_room_isolated = true;
    });
  }

  function stripForeign() {
    var keepId = {
      seeker: "junior-curriculum-card",
      practice: "junior-high-curriculum-card",
      consistency: "daily-hs-curriculum-card",
      transmission: "dai-university-curriculum-card"
    }[ROOM];
    document.querySelectorAll("[id$='-curriculum-card'], .curriculum-phase-card").forEach(function (el) {
      if (keepId && el.id === keepId) return;
      try { el.remove(); } catch (e) {}
    });
  }

  function runChain(i) {
    if (i >= CHAIN.length) {
      isolate();
      stripForeign();
      try {
        if (g[API] && typeof g[API].render === "function" && currentRoom() === ROOM) {
          g[API].render();
        }
      } catch (eR) {}
      stripForeign();
      setTimeout(stripForeign, 400);
      setTimeout(function () { isolate(); stripForeign(); }, 1000);
      try {
        document.dispatchEvent(new CustomEvent("cu-curriculum-ready", { detail: { room: ROOM, api: API } }));
      } catch (eD) {}
      return;
    }
    loadScript(CHAIN[i]).then(function () {
      isolate();
      runChain(i + 1);
    });
  }

  function start() {
    if (currentRoom() !== ROOM) return;
    runChain(0);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})(typeof window !== "undefined" ? window : this);
