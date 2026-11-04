/*! companion-spine-dedupe-v1 · fix const tabKeys redeclare
 * Loads absolute core once; A2 spine packs EXCLUDE chunk-8 when core present.
 * Companion room only. Campus untouched.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_SPINE_DEDUPE_V1__) return;
  w.__CLARITY_SPINE_DEDUPE_V1__ = true;

  function roomOk() {
    try {
      var p = (w.location && w.location.pathname) || "";
      if (p.indexOf("/campus") === 0 || p.indexOf("/amana") === 0) return false;
      return p.indexOf("/companion") === 0;
    } catch (e) { return false; }
  }
  if (!roomOk()) return;

  var CORE_ABS = "/assets/clarity-core-block-8.js";
  var CORE_VER = "20261104DD";
  var BASE = "/companion/assets/a2/";
  var V = "20261104R17";
  /* chunk-8 duplicates core top-level const tabKeys — omit when core loads */
  var PACKS = [
    "clarity-runtime-overlays-v1.js",
    "clarity-feature-pack-v1.js",
    "clarity-path-pack-v1.js",
    "clarity-aux-pack-v1.js"
  ];

  function loadScript(src, flag) {
    return new Promise(function (resolve) {
      var bare = src.split("?")[0];
      if (d.querySelector('script[' + flag + '="' + bare + '"]')) {
        resolve(true);
        return;
      }
      var s = d.createElement("script");
      s.src = src;
      s.async = false;
      s.setAttribute(flag, bare);
      s.onload = function () { resolve(true); };
      s.onerror = function () { resolve(false); };
      d.head.appendChild(s);
    });
  }

  function loadCore() {
    if (w.__CLARITY_CORE_ABS_LOADED__) return Promise.resolve(true);
    if (d.querySelector('script[data-clarity-core-abs="1"]')) {
      w.__CLARITY_CORE_ABS_LOADED__ = true;
      return Promise.resolve(true);
    }
    return loadScript(CORE_ABS + "?v=" + CORE_VER, "data-clarity-core-abs").then(function (ok) {
      if (ok) {
        w.__CLARITY_CORE_ABS_LOADED__ = true;
        try { d.dispatchEvent(new CustomEvent("clarity-core-ready")); } catch (e) {}
      }
      return ok;
    });
  }

  function loadPacks() {
    return PACKS.reduce(function (p, name) {
      return p.then(function () {
        return loadScript(BASE + name + "?v=" + V, "data-a2-spine");
      });
    }, Promise.resolve());
  }

  /* Neutralize stock spine if it still runs — mark packs including chunk as loaded */
  function poisonChunk() {
    try {
      /* prevent duplicate chunk evaluation: insert inert marker */
      var marker = d.createElement("script");
      marker.setAttribute("data-a2-spine", BASE + "clarity-chunk-8.js");
      marker.type = "text/plain";
      d.head.appendChild(marker);
      w.__CLARITY_A2_SPINE_LOADER__ = true; /* stock spine no-ops if it checks this — it sets own flag first though */
    } catch (e) {}
  }

  function after() {
    try { d.dispatchEvent(new CustomEvent("clarity-a2-spine-ready")); } catch (e) {}
    try { d.dispatchEvent(new CustomEvent("clarity-core-ready")); } catch (e) {}
  }

  function boot() {
    poisonChunk();
    loadCore()
      .then(function () { return loadPacks(); })
      .then(after);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
