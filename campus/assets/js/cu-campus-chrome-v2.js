/*! cu-campus-chrome-v2 · U45 CF13
 * Campus-wide dedupe: room nav, banners, uni-nav, top-duo, injected smart strips.
 * Runs after harmony; safe to load twice. Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CU_CAMPUS_CHROME_V2__) return;
  w.__CU_CAMPUS_CHROME_V2__ = true;

  function keepFirst(sel) {
    var nodes = d.querySelectorAll(sel);
    for (var i = 1; i < nodes.length; i++) {
      try {
        if (nodes[i].parentNode) nodes[i].parentNode.removeChild(nodes[i]);
      } catch (e) {}
    }
    return nodes[0] || null;
  }

  function hideExtras(sel, keep) {
    d.querySelectorAll(sel).forEach(function (el, i) {
      if (keep && el === keep) return;
      if (i === 0 && !keep) return;
      try {
        el.style.setProperty("display", "none", "important");
        el.setAttribute("data-chrome-dedupe", "1");
      } catch (e) {}
    });
  }

  function dedupe() {
    // Room nav — one only
    var room = keepFirst("nav.clarity-room-nav");
    // Primary banner
    var banner = keepFirst("header.cu-banner#cu-banner") || keepFirst("header.cu-banner") || keepFirst("#cu-banner");
    // Uni nav pills — at most one
    keepFirst("nav.uni-nav");
    keepFirst("nav.cu-uni-nav");
    // Top duo / injected dual brand
    keepFirst("#clarity-top-duo");
    keepFirst(".clarity-top-duo");
    // Secondary injected strips when room nav exists
    if (room) {
      d.querySelectorAll(
        ".cu-smart-top, .cu-injected-banner, header.cu-shell-banner, .cu-double-brand"
      ).forEach(function (el) {
        if (banner && (el === banner || banner.contains(el))) return;
        try {
          el.style.setProperty("display", "none", "important");
          el.setAttribute("data-chrome-dedupe", "1");
        } catch (e2) {}
      });
    }
    // Duplicate PATH rails (keep first .cu-path-rail or similar)
    keepFirst(".cu-path-rail");
    keepFirst("nav.cu-path-nav");
    // Mark html
    try {
      d.documentElement.setAttribute("data-cu-chrome", "U45");
    } catch (e3) {}
  }

  function boot() {
    try {
      dedupe();
    } catch (e) {}
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  [100, 400, 1000, 2500, 5000].forEach(function (t) {
    setTimeout(boot, t);
  });
  // Mutation soft-pass when late injectors fire
  try {
    var obs = new MutationObserver(function () {
      setTimeout(boot, 50);
    });
    obs.observe(d.documentElement, { childList: true, subtree: true });
    setTimeout(function () {
      try {
        obs.disconnect();
      } catch (e) {}
    }, 8000);
  } catch (e4) {}
})(window, document);
