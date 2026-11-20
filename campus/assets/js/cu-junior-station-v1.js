/*! cu-junior-station-v1 · U33
 * Junior curriculum only on /campus/desk/seeker/
 * Educational only — not a fatwa · not a grade of īmān
 */
(function (w, d) {
  "use strict";
  if (w.__CU_JUNIOR_STATION_V1__) return;
  w.__CU_JUNIOR_STATION_V1__ = true;
  function isSeeker() {
    var p = (location.pathname || "").replace(/\/+$/, "");
    return p === "/campus/desk/seeker";
  }
  function scrub() {
    if (isSeeker()) return;
    d.querySelectorAll("#junior-curriculum-card, .junior-curriculum-card, .curriculum-phase-card.junior-active").forEach(function (el) {
      try {
        el.style.setProperty("display", "none", "important");
        el.setAttribute("data-junior-station-hide", "1");
        if (el.parentNode) el.parentNode.removeChild(el);
      } catch (e) {}
    });
    d.querySelectorAll("h2.card-title, h2").forEach(function (el) {
      if (!/Junior curriculum/i.test(el.textContent || "")) return;
      var root = el.closest("section, article, .card, div") || el.parentElement;
      if (root) {
        root.style.setProperty("display", "none", "important");
        try { if (root.parentNode) root.parentNode.removeChild(root); } catch (e2) {}
      }
    });
  }
  function boot() { scrub(); }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  [100, 400, 1000, 2000, 4000].forEach(function (t) { setTimeout(scrub, t); });
})(window, document);
