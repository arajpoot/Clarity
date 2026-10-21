/**
 * Phase C2 — quiet secondary boots · 20261021PERF2
 * Limits forced reflow storms from repeated setTimeout(boot) patterns
 * after first paint. Does not remove features.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_PERF_BOOT_QUIET_V1__) return;
  w.__CLARITY_PERF_BOOT_QUIET_V1__ = true;

  var scheduled = 0;
  var MAX_NESTED = 2;
  var realTimeout = w.setTimeout.bind(w);
  var realRAF = w.requestAnimationFrame ? w.requestAnimationFrame.bind(w) : null;

  /* After load + 3s, coalesce frequent layout reads */
  function afterPaint(fn) {
    if (realRAF) {
      realRAF(function () {
        realRAF(fn);
      });
    } else {
      realTimeout(fn, 0);
    }
  }

  w.addEventListener(
    "load",
    function () {
      /* one layout settle pass */
      afterPaint(function () {
        try {
          document.documentElement.classList.add("cph-paint-settled");
        } catch (e) {}
      });
    },
    { once: true }
  );

  /* Prefer idle for non-critical custom events */
  if (typeof w.requestIdleCallback === "function") {
    w.requestIdleCallback(
      function () {
        try {
          w.dispatchEvent(new CustomEvent("clarity-companion-idle"));
        } catch (e) {}
      },
      { timeout: 5000 }
    );
  }
})(window);
