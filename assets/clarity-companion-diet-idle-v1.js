/* Companion Diet Phase 1 — idle-load secondary packs */
(function (g) {
  "use strict";
  if (g.__CLARITY_COMPANION_DIET_IDLE_V1__) return;
  g.__CLARITY_COMPANION_DIET_IDLE_V1__ = true;

  var VER = "20261013CD1";
  /* Order: overlays/runtime first if missing, then feature depth */
  var SECONDARY = [
    "./assets/clarity-chunk-8.js?v=" + VER,
    "./assets/clarity-feature-pack-v1.js?v=" + VER,
    "./assets/clarity-path-pack-v1.js?v=" + VER,
    "./assets/clarity-aux-pack-v1.js?v=" + VER
  ];

  var loaded = {};

  function load(src) {
    return new Promise(function (resolve) {
      var base = src.split("?")[0].split("/").pop();
      if (loaded[base]) return resolve(true);
      if (document.querySelector('script[src*="' + base + '"]')) {
        loaded[base] = true;
        return resolve(true);
      }
      var s = document.createElement("script");
      s.src = src;
      s.defer = true;
      s.onload = function () {
        loaded[base] = true;
        resolve(true);
      };
      s.onerror = function () {
        resolve(false);
      };
      document.body.appendChild(s);
    });
  }

  function run() {
    var chain = Promise.resolve();
    SECONDARY.forEach(function (src) {
      chain = chain.then(function () {
        return load(src);
      });
    });
    return chain.then(function () {
      try {
        g.dispatchEvent(new CustomEvent("clarity-companion-diet-ready"));
      } catch (e) {}
    });
  }

  function schedule() {
    if (g.requestIdleCallback) {
      g.requestIdleCallback(function () {
        run();
      }, { timeout: 2800 });
    } else {
      setTimeout(run, 500);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", schedule);
  } else schedule();
})(typeof window !== "undefined" ? window : this);
