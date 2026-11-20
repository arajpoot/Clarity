/*! cu-stage-station-v1 · U37 CF4
 * Hide curriculum cards that do not belong to the current desk stage.
 * Educational only — not a fatwa · not a grade of īmān
 */
(function (w, d) {
  "use strict";
  if (w.__CU_STAGE_STATION_V1__) return;
  w.__CU_STAGE_STATION_V1__ = true;

  var MAP = {
    seeker: ["junior-curriculum-card"],
    practice: ["junior-high-curriculum-card"],
    consistency: ["daily-hs-curriculum-card", "hs-curriculum-card"],
    transmission: ["transmission-curriculum-card", "dai-curriculum-card"]
  };

  function stage() {
    var p = (location.pathname || "").replace(/\/+$/, "");
    var m = p.match(/\/campus\/desk\/([^/]+)/);
    return m ? m[1] : "";
  }

  function scrub() {
    var st = stage();
    if (!st) return;
    d.body.setAttribute("data-campus-page", st);
    var allow = MAP[st] || [];
    var allIds = [];
    Object.keys(MAP).forEach(function (k) {
      MAP[k].forEach(function (id) { allIds.push(id); });
    });
    // also junior always off non-seeker
    allIds.push("junior-curriculum-card");
    allIds.forEach(function (id) {
      var el = d.getElementById(id);
      if (!el) return;
      if (allow.indexOf(id) >= 0 && st) return;
      if (st === "seeker" && id === "junior-curriculum-card") return;
      try {
        el.style.setProperty("display", "none", "important");
        el.setAttribute("data-stage-hide", "1");
      } catch (e) {}
    });
    // generic Junior title off non-seeker
    if (st !== "seeker") {
      d.querySelectorAll("h2.card-title, h2").forEach(function (el) {
        if (!/Junior curriculum/i.test(el.textContent || "")) return;
        var root = el.closest("section, article, .card, div") || el;
        try { root.style.setProperty("display", "none", "important"); } catch (e2) {}
      });
    }
  }

  function boot() { scrub(); }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  [200, 800, 2000].forEach(function (t) { setTimeout(scrub, t); });
})(window, document);
