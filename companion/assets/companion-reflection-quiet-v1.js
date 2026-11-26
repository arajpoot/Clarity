/*! companion-reflection-quiet-v1 · runtime id + h2 plaque dedupe · protect glory rail */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_REFLECTION_QUIET_V1__) return;
  w.__COMPANION_REFLECTION_QUIET_V1__ = true;
  function run() {
    var root = d.getElementById("cs-mount");
    if (!root) return;
    var seenId = Object.create(null);
    root.querySelectorAll("[id]").forEach(function (el) {
      if (!el.id) return;
      if (seenId[el.id]) {
        el.style.setProperty("display", "none", "important");
        el.setAttribute("aria-hidden", "true");
      } else seenId[el.id] = true;
    });
    var seenH = Object.create(null);
    root.querySelectorAll(".cs-plaque, .card").forEach(function (el) {
      if (el.classList.contains("p4-glory-rail") || el.closest(".p4-glory-rail")) return;
      var h = el.querySelector("h2");
      if (!h) return;
      var t = (h.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
      if (!t || t.length < 10) return;
      if (seenH[t]) {
        el.style.setProperty("display", "none", "important");
        el.setAttribute("aria-hidden", "true");
      } else seenH[t] = true;
    });
  }
  function boot() {
    run();
    var root = d.getElementById("cs-mount");
    if (root && w.MutationObserver) {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(run, 60);
      }).observe(root, { childList: true, subtree: true });
    }
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", run);
})(window, document);
