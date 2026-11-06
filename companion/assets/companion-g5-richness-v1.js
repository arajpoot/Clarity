/*! companion-g5-richness-v1 · path reset class · content preserved */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_G5_RICHNESS_V1__) return;
  w.__CLARITY_G5_RICHNESS_V1__ = true;
  function markReset() {
    var g = d.querySelector(".clarity-gate-switcher");
    if (!g) return;
    g.querySelectorAll("button, a").forEach(function (btn) {
      var t = (btn.textContent || "").toLowerCase();
      if (/reset/.test(t) || btn.id === "clarity-path-reset-btn") btn.classList.add("cgs-reset");
    });
  }
  function boot() {
    markReset();
    setTimeout(markReset, 500);
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
