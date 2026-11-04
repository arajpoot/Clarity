/*! companion-a2-spine-loader-v1 · R1–R7 Archive2 packs · companion room only */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_A2_SPINE_LOADER__) return;
  w.__CLARITY_A2_SPINE_LOADER__ = true;

  var LOG = (w.__A2_SPINE_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  var BASE = "/companion/assets/a2/";
  var V = "20261104R17";

  /* Order matters: overlays → chunk-8 (meme/callig/tj core) → feature → path → aux → sticky */
  var PACKS = [
    "clarity-runtime-overlays-v1.js",
    "clarity-chunk-8.js",
    "clarity-feature-pack-v1.js",
    "clarity-path-pack-v1.js",
    "clarity-aux-pack-v1.js",
    /* skip sticky: "clarity-sticky-harden-v1.js" */
  ];

  function roomOk() {
    try {
      var r = d.documentElement.getAttribute("data-clarity-room") || "";
      if (r && r !== "companion") return false;
      var p = (w.location && w.location.pathname) || "";
      if (p.indexOf("/campus") === 0 || p.indexOf("/amana") === 0 || p.indexOf("/daily") === 0) return false;
      return true;
    } catch (e) {
      return true;
    }
  }

  function loadScript(src) {
    return new Promise(function (resolve) {
      var bare = src.split("?")[0];
      if (d.querySelector('script[data-a2-spine="' + bare + '"]')) {
        resolve(bare);
        return;
      }
      var s = d.createElement("script");
      s.src = src;
      s.async = false; /* preserve order */
      s.defer = true;
      s.setAttribute("data-a2-spine", bare);
      s.onload = function () {
        log("loaded " + bare.split("/").pop());
        resolve(bare);
      };
      s.onerror = function () {
        log("FAIL " + bare);
        resolve(bare);
      };
      d.head.appendChild(s);
    });
  }

  function loadSeq(list) {
    return list.reduce(function (p, name) {
      return p.then(function () {
        return loadScript(BASE + name + "?v=" + V);
      });
    }, Promise.resolve());
  }

  function afterSpine() {
    log("spine-ready");
    try {
      d.dispatchEvent(new CustomEvent("clarity-a2-spine-ready"));
    } catch (e) {}
    /* Ensure critical meme APIs exist (bridge is backup) */
    var need = ["memeDailyVerse", "memeFetchBg", "memeFetchRrra"];
    need.forEach(function (n) {
      if (typeof w[n] !== "function") log("still-missing " + n);
      else log("api-ok " + n);
    });
    try {
      if (typeof w.clarityEnsureCraftMeters === "function") w.clarityEnsureCraftMeters();
    } catch (e2) {}
  }

  function boot() {
    if (!roomOk()) {
      log("skip-non-companion");
      return;
    }
    log("spine-start");
    loadSeq(PACKS).then(afterSpine);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
