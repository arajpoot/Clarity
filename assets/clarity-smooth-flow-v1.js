/**
 * Clarity Smooth Flow v1
 * - Debounce memeDraw (stops laggy multi-repaint)
 * - Throttle section sentinel
 * - Calm layout thrash after path changes
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_SMOOTH_FLOW_V1__) return;
  g.__CLARITY_SMOOTH_FLOW_V1__ = true;

  function rafDebounce(fn, wait) {
    var t = null, lastArgs = null;
    return function () {
      lastArgs = arguments;
      if (t) return;
      t = setTimeout(function () {
        t = null;
        var a = lastArgs;
        lastArgs = null;
        if (typeof requestAnimationFrame === "function") {
          requestAnimationFrame(function () { fn.apply(null, a || []); });
        } else {
          fn.apply(null, a || []);
        }
      }, wait || 32);
    };
  }

  function wrapMemeDraw() {
    try {
      var prev = g.memeDraw;
      if (typeof prev !== "function" || prev.__smoothWrapped) return;
      var debounced = rafDebounce(function () {
        try { prev.apply(g, arguments); } catch (e) {}
      }, 40);
      debounced.__smoothWrapped = true;
      debounced.__raw = prev;
      g.memeDraw = debounced;
    } catch (e) {}
  }

  function throttleSentinel() {
    try {
      if (typeof g.claritySectionSentinel !== "function") return;
      if (g.claritySectionSentinel.__smoothThrottled) return;
      var raw = g.claritySectionSentinel;
      var last = 0;
      g.claritySectionSentinel = function () {
        var now = Date.now();
        if (now - last < 1500) return; // was 2s interval + other callers
        last = now;
        try { return raw.apply(this, arguments); } catch (e) {}
      };
      g.claritySectionSentinel.__smoothThrottled = true;
    } catch (e) {}
  }

  function calmCards() {
    try {
      document.documentElement.style.setProperty("scroll-behavior", "smooth");
    } catch (e) {}
  }

  function boot() {
    wrapMemeDraw();
    throttleSentinel();
    calmCards();
    // Re-wrap if chunk reassigned memeDraw later
    setTimeout(wrapMemeDraw, 400);
    setTimeout(wrapMemeDraw, 1200);
    setTimeout(throttleSentinel, 500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  g.addEventListener("load", function () { setTimeout(boot, 200); });

  g.ClaritySmooth = { wrapMemeDraw: wrapMemeDraw, throttleSentinel: throttleSentinel };
})(typeof window !== "undefined" ? window : this);
