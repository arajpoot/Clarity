/*! companion-path-harden-v1
 * Hardens four-path selected-only filter against late card injects.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_PATH_HARDEN_V1__) return;
  w.__COMPANION_PATH_HARDEN_V1__ = true;

  function reapply() {
    try {
      if (w.ClarityPathSelectedOnly && typeof w.ClarityPathSelectedOnly.apply === "function") {
        w.ClarityPathSelectedOnly.apply(w.ClarityPathSelectedOnly.current());
        return;
      }
      if (typeof w.applyGateSectionFilter === "function") {
        var g = "seeker";
        try {
          g =
            localStorage.getItem("clarity_path_override") ||
            localStorage.getItem("clarity_committed_path") ||
            "seeker";
        } catch (e) {}
        w.applyGateSectionFilter(g);
      }
    } catch (e) {}
  }

  function boot() {
    reapply();
    try {
      var root = d.getElementById("main-content") || d.querySelector("main") || d.body;
      if (root && w.MutationObserver) {
        var t = null;
        new MutationObserver(function () {
          if (t) clearTimeout(t);
          t = setTimeout(reapply, 120);
        }).observe(root, { childList: true, subtree: true });
      }
    } catch (e) {}
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(reapply, 200);
    setTimeout(reapply, 800);
  });
  setInterval(reapply, 3000);
})(window, document);
