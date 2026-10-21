/* Companion Mahtaab Hydration Engine v1
 * Phases: seed → crescent → half → full
 * Coordinates diet-idle packs + soft visual energize
 * Educational UX only — not a fatwa
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_COMPANION_MAHTAAB_V1__) return;
  g.__CLARITY_COMPANION_MAHTAAB_V1__ = true;

  var VER = "20261013CDB3";
  var phase = "seed";
  var loaded = {};

  /* Secondary depth — same list as diet-idle (idempotent if both run) */
  var HALF_SCRIPTS = [
    "./assets/clarity-chunk-8.js?v=" + VER,
    "./assets/clarity-feature-pack-v1.js?v=" + VER,
    "./assets/clarity-path-pack-v1.js?v=" + VER,
    "./assets/clarity-aux-pack-v1.js?v=" + VER
  ];

  function setPhase(p) {
    phase = p;
    try {
      document.documentElement.setAttribute("data-mahtaab", p);
    } catch (e) {}
    try {
      g.dispatchEvent(new CustomEvent("clarity-mahtaab-phase", { detail: { phase: p } }));
    } catch (e2) {}
  }

  function loadScript(src) {
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
      (document.body || document.documentElement).appendChild(s);
    });
  }

  function idle(fn, timeout) {
    if (g.requestIdleCallback) {
      g.requestIdleCallback(function () {
        fn();
      }, { timeout: timeout || 2500 });
    } else {
      setTimeout(fn, Math.min(timeout || 2500, 600));
    }
  }

  /* Crescent: visual only + light DOM polish after first paint */
  function crescent() {
    setPhase("crescent");
    /* Soft-mark calendar meta if empty */
    try {
      var meta = document.getElementById("hijri-cal-meta");
      if (meta && (!meta.textContent || meta.textContent.indexOf("…") >= 0)) {
        /* leave to existing hijri script */
      }
    } catch (e) {}
  }

  /* Half: secondary feature packs */
  function half() {
    setPhase("half");
    var chain = Promise.resolve();
    HALF_SCRIPTS.forEach(function (src) {
      chain = chain.then(function () {
        return loadScript(src);
      });
    });
    return chain;
  }

  /* Full: announce ready for optional deep modules */
  function full() {
    setPhase("full");
    try {
      g.dispatchEvent(new CustomEvent("clarity-companion-mahtaab-ready"));
    } catch (e) {}
  }

  function boot() {
    setPhase("seed");
    /* Crescent on next frame */
    if (g.requestAnimationFrame) {
      g.requestAnimationFrame(function () {
        crescent();
        idle(function () {
          half().then(function () {
            idle(full, 1200);
          });
        }, 2000);
      });
    } else {
      setTimeout(function () {
        crescent();
        idle(function () {
          half().then(function () {
            idle(full, 1200);
          });
        }, 2000);
      }, 0);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  g.ClarityCompanionMahtaab = {
    phase: function () {
      return phase;
    },
    load: loadScript
  };
})(typeof window !== "undefined" ? window : this);
