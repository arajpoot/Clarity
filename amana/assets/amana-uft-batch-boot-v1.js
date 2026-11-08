/*! amana-uft-batch-boot-v1 · M5b performance · full pedigree retained · educational only — not a fatwa */
(function (w, d) {
  "use strict";
  if (w.__AMANA_UFT_BATCH_BOOT_V1__) return;
  w.__AMANA_UFT_BATCH_BOOT_V1__ = true;

  var V = "20261108M5b";

  /** Core pedigree — must load before enrichers */
  var CORE = [
    "/amana/assets/clarity-amana-uft-v1.js",
    "/amana/assets/clarity-uft-full-restore-v1.js"
  ];

  /** Registry / viewport / ops — second wave */
  var WAVE2 = [
    "/amana/assets/amana-uft-registry-deep-v1.js",
    "/amana/assets/amana-uft-viewport-stable-v1.js",
    "/amana/assets/amana-uft-dock-v2.js",
    "/amana/assets/amana-uft-layout-h-v1.js",
    "/amana/assets/amana-uft-file-ops-v1.js",
    "/amana/assets/amana-uft-loaded-ops-v1.js",
    "/amana/assets/amana-uft-workspace-v1.js",
    "/amana/assets/amana-uft-build-viewport-v1.js"
  ];

  /** Polish / export / fiqh bridge — third wave (idle) */
  var WAVE3 = [
    "/amana/assets/amana-uft-png-v1.js",
    "/amana/assets/amana-uft-fiqh-bridge-v1.js",
    "/amana/assets/amana-uft-classic-boost-v1.js",
    "/amana/assets/amana-uft-housekeep-v2.js",
    "/amana/assets/amana-uft-tree-lines-v1.js",
    "/amana/assets/amana-uft-registry-rich-v1.js",
    "/amana/assets/amana-uft-ui-order-v1.js",
    "/amana/assets/amana-uft-glass-plaque-v1.js",
    "/amana/assets/amana-uft-branch-horizontal-v1.js",
    "/amana/assets/amana-uft-day-close-v1.js"
  ];

  function loadOne(src) {
    return new Promise(function (resolve) {
      var s = d.createElement("script");
      s.src = src + (src.indexOf("?") >= 0 ? "&" : "?") + "v=" + V;
      s.async = false; /* preserve order within a wave */
      s.onload = function () { resolve({ src: src, ok: true }); };
      s.onerror = function () { resolve({ src: src, ok: false }); };
      d.head.appendChild(s);
    });
  }

  function loadWave(list) {
    return list.reduce(function (p, src) {
      return p.then(function () {
        return loadOne(src);
      });
    }, Promise.resolve());
  }

  function idle(fn, timeout) {
    if (typeof w.requestIdleCallback === "function") {
      w.requestIdleCallback(function () { fn(); }, { timeout: timeout || 2000 });
    } else {
      w.setTimeout(fn, 50);
    }
  }

  function status(msg) {
    try {
      var el = d.getElementById("uft-status") || d.getElementById("amana-uft-boot-status");
      if (el) el.textContent = msg;
    } catch (e) {}
  }

  function boot() {
    status("Family tree · loading core pedigree…");
    loadWave(CORE)
      .then(function () {
        status("Family tree · loading registry & viewport…");
        try {
          d.dispatchEvent(new CustomEvent("clarity-uft-core-ready"));
        } catch (e) {}
        return loadWave(WAVE2);
      })
      .then(function () {
        status("Family tree · loading polish modules…");
        try {
          d.dispatchEvent(new CustomEvent("clarity-uft-wave2-ready"));
        } catch (e2) {}
        return new Promise(function (resolve) {
          idle(function () {
            loadWave(WAVE3).then(resolve);
          }, 2500);
        });
      })
      .then(function () {
        status("Family tree · ready on this device · educational only — not a fatwa");
        try {
          d.dispatchEvent(new CustomEvent("clarity-uft-batch-ready"));
        } catch (e3) {}
      });
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
