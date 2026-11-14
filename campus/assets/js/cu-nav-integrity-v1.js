/*! cu-nav-integrity-v1.3 · full pill matrix · educational only */
(function (w, d) {
  "use strict";
  if (w.__CU_NAV_INTEGRITY_V13__) return;
  w.__CU_NAV_INTEGRITY_V13__ = true;

  var LOCK = {
    progress: "/campus/grading",
    faculty: "/campus/faculty/",
    bots: "/campus/bots/",
    desk: "/campus/desk/",
    seeker: "/campus/desk/seeker/",
    practice: "/campus/desk/practice/",
    consistency: "/campus/desk/consistency/",
    transmission: "/campus/desk/transmission/",
    "campus home": "/campus/",
    foundation: "/campus/desk/foundation/",
    pillars: "/campus/desk/pillars/",
    "iḥsān": "/campus/desk/ihsan/",
    ihsan: "/campus/desk/ihsan/",
    "amānah module": "/campus/desk/amanah/",
    assignments: "/campus/assignments/",
    lab: "/campus/lab/",
    library: "/campus/library/",
    buddy: "/campus/buddy/",
    portal: "/campus/portal/",
    journey: "/campus/journey/",
    orientation: "/campus/orientation/",
    schedule: "/campus/schedule/",
    transcript: "/campus/transcript/",
    diploma: "/campus/diploma/",
    "mīrāth": "/campus/mirath/",
    mirath: "/campus/mirath/",
    "campus vault": "/campus/vault/",
    charter: "/campus/charter/"
  };

  function textOf(a) {
    return String(a.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function fix(a) {
    if (!a || !a.getAttribute) return;
    var href = a.getAttribute("href") || "";
    var t = textOf(a);
    var locked = a.getAttribute("data-cu-href");
    if (locked && locked.indexOf("/campus") === 0) {
      if (href !== locked) a.setAttribute("href", locked);
      return;
    }
    if (LOCK[t]) {
      a.setAttribute("href", LOCK[t]);
      a.setAttribute("data-cu-href", LOCK[t]);
      return;
    }
    if ((href === "/" || href === "/index.html") && t.indexOf("companion") !== -1) {
      a.setAttribute("href", "/companion/");
    }
    if (href === "/campus/grading.html") a.setAttribute("href", "/campus/grading");
    if (href === "/campus/faculty.html") a.setAttribute("href", "/campus/faculty/");
    if (href === "/campus/bots.html") a.setAttribute("href", "/campus/bots/");
  }

  function garden() {
    var p = location.pathname || "";
    if (p.indexOf("/campus") !== 0) return;
    d.querySelectorAll("a[href]").forEach(fix);
  }

  function boot() {
    garden();
    [50, 300, 800, 1500, 3000].forEach(function (ms) {
      setTimeout(garden, ms);
    });
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
