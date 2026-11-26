/*! companion-p4-tab-glory-v1.js · visibility + path soft-emphasis · educational only */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_P4_TAB_GLORY__) return;
  w.__COMPANION_P4_TAB_GLORY__ = true;

  function show(el) {
    if (!el) return;
    try {
      el.style.removeProperty("display");
      el.removeAttribute("hidden");
      el.classList.remove("cpp-path-hidden", "is-path-hidden", "arch-hidden", "is-filtered-out", "is-empty");
      // only force display on primary / non path-only
      if (!el.hasAttribute("data-cs-path-only")) {
        el.style.setProperty("display", "block", "important");
        el.style.setProperty("visibility", "visible", "important");
        el.style.setProperty("opacity", "1", "important");
      }
    } catch (e) {}
  }

  function glory() {
    var root = d.getElementById("cs-mount") || d;
    root.querySelectorAll(
      ".cs-plaque[data-cs-primary], .cs-plaque-deep, .card.card-tools, .p4-glory-rail, [data-enrichment], .cs-rich-legacy-wrap, .rrra-hub-hero"
    ).forEach(show);
    // soft: path-only still gated by path-governance; we do not strip path feature
    d.documentElement.setAttribute("data-p4-glory", "1");
  }

  function boot() {
    glory();
    var m = d.getElementById("cs-mount");
    if (m && w.MutationObserver) {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(glory, 40);
      }).observe(m, { childList: true, subtree: true });
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", glory);
})(window, document);
