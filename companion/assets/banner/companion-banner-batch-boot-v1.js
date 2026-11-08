/*! companion-banner-batch-boot-v1 · C1 curtain · educational only — not a fatwa */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_BANNER_BATCH_V1__) return;
  w.__COMPANION_BANNER_BATCH_V1__ = true;
  var V = "20261108C1";
  /* Prefer live paths already under /companion/assets/ — load order only */
  var CORE = ["/companion/assets/companion-banner-viewport-v1.js", "/companion/assets/companion-banner-controls-v1.js"];
  var WAVE2 = ["/companion/assets/companion-banner-mobile-v1.js", "/companion/assets/companion-banner-desktop-v1.js", "/companion/assets/companion-banner-plaques-v1.js"];
  var WAVE3 = ["/companion/assets/companion-banner-enrich-v1.js", "/companion/assets/companion-haramain-temps-v1.js"];

  function loadOne(src) {
    return new Promise(function (resolve) {
      if (d.querySelector('script[src*="'+src.split('/').pop()+'"]')) {
        resolve({src: src, skipped: true});
        return;
      }
      var s = d.createElement("script");
      s.src = src + (src.indexOf("?") >= 0 ? "&" : "?") + "v=" + V;
      s.async = false;
      s.onload = function () { resolve({src: src, ok: true}); };
      s.onerror = function () { resolve({src: src, ok: false}); };
      d.head.appendChild(s);
    });
  }
  function wave(list) {
    return list.reduce(function (p, src) {
      return p.then(function () { return loadOne(src); });
    }, Promise.resolve());
  }
  function idle(fn) {
    if (typeof w.requestIdleCallback === "function") w.requestIdleCallback(fn, { timeout: 2500 });
    else w.setTimeout(fn, 80);
  }
  function boot() {
    /* If page already included banner scripts, this is a no-op enhancer for future thin chrome */
    wave(CORE).then(function () {
      return wave(WAVE2);
    }).then(function () {
      idle(function () { wave(WAVE3); });
    });
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
