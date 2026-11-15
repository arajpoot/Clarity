/*! companion-path-stacks-v1 · Phase 5 path primary ordering
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_PATH_STACKS_V1__) return;
  w.__COMPANION_PATH_STACKS_V1__ = true;

  var WEIGHT = {
    seeker: { reminder: 2, reflection: 2, reality: 1, action: 1 },
    new_muslim: { action: 2, reminder: 2, reality: 1, reflection: 1 },
    practicing: { reflection: 2, action: 2, reminder: 1, reality: 1 },
    dai: { reality: 2, action: 2, reminder: 1, reflection: 1 }
  };

  function path() {
    try {
      return (w.ClarityCompanionShell && w.ClarityCompanionShell.getPath && w.ClarityCompanionShell.getPath()) || "seeker";
    } catch (e) {
      return "seeker";
    }
  }

  function emphasizeRail() {
    var wgt = WEIGHT[path()] || WEIGHT.seeker;
    d.querySelectorAll(".cs-door [data-rail-tab]").forEach(function (btn) {
      var t = btn.getAttribute("data-rail-tab");
      var n = wgt[t] || 0;
      btn.classList.toggle("cc-stack-emph", n >= 2);
    });
  }

  function boot() {
    emphasizeRail();
    setTimeout(emphasizeRail, 400);
  }
  d.addEventListener("click", function (ev) {
    if (ev.target && ev.target.closest && ev.target.closest("[data-cs-path], .cs-door")) {
      setTimeout(emphasizeRail, 60);
    }
  });
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
