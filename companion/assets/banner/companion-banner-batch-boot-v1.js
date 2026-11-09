/*! companion-banner-batch-boot-v2 · C5 · educational only */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_BANNER_BATCH_V2__) return;
  w.__COMPANION_BANNER_BATCH_V2__ = true;
  var V = "20261108C5";
  var CORE = [
    "/companion/assets/companion-banner-viewport-v1.js",
    "/companion/assets/companion-banner-controls-v1.js"
  ];
  var WAVE2 = [
    "/companion/assets/companion-banner-mobile-v1.js",
    "/companion/assets/companion-banner-desktop-v1.js",
    "/companion/assets/companion-banner-plaques-v1.js"
  ];
  var WAVE3 = [
    "/companion/assets/companion-banner-enrich-v1.js",
    "/companion/assets/companion-haramain-temps-v1.js",
    "/companion/assets/banner/companion-banner-owner-v1.js"
  ];
  function loadOne(src) {
    return new Promise(function (resolve) {
      var base = src.split("/").pop().split("?")[0];
      if (d.querySelector('script[src*="'+base+'"]')) {
        resolve({ skipped: true }); return;
      }
      var s = d.createElement("script");
      s.src = src + (src.indexOf("?") >= 0 ? "&" : "?") + "v=" + V;
      s.async = false;
      s.onload = function () { resolve({ ok: true }); };
      s.onerror = function () { resolve({ ok: false }); };
      d.head.appendChild(s);
    });
  }
  function wave(list) {
    return list.reduce(function (p, src) {
      return p.then(function () { return loadOne(src); });
    }, Promise.resolve());
  }
  function idle(fn) {
    if (typeof w.requestIdleCallback === "function") w.requestIdleCallback(fn, { timeout: 3000 });
    else w.setTimeout(fn, 100);
  }
  function boot() {
    wave(CORE).then(function () { return wave(WAVE2); }).then(function () {
      idle(function () { wave(WAVE3); });
    });
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
