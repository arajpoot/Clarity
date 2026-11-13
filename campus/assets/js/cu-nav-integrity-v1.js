/*! cu-nav-integrity-v1.2 · campus pill lock · educational only — not a fatwa */
(function (w, d) {
  "use strict";
  if (w.__CU_NAV_INTEGRITY_V12__) return;
  w.__CU_NAV_INTEGRITY_V12__ = true;

  var MAP = [
    { from: "/lab/", to: "/campus/lab/" },
    { from: "/library/", to: "/campus/library/" },
    { from: "/lab", to: "/campus/lab/" },
    { from: "/library", to: "/campus/library/" },
    { from: "/faculty", to: "/campus/faculty" },
    { from: "/faculty.html", to: "/campus/faculty" },
    { from: "/bots", to: "/campus/bots" },
    { from: "/bots.html", to: "/campus/bots" },
    { from: "/grading", to: "/campus/grading" },
    { from: "/grading.html", to: "/campus/grading" }
  ];

  function textOf(a) {
    return String(a.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function fixAnchor(a) {
    if (!a || !a.getAttribute) return;
    var href = a.getAttribute("href") || "";
    var t = textOf(a);
    var locked = a.getAttribute("data-cu-href");

    /* Smart-nav locked targets win */
    if (locked && locked.charAt(0) === "/") {
      if (href !== locked) a.setAttribute("href", locked);
      return;
    }

    if (href === "/" || href === "/?" || href.indexOf("/?enter=companion") === 0) {
      if (t.indexOf("companion") !== -1) {
        a.setAttribute("href", "/companion/");
        return;
      }
    }

    for (var i = 0; i < MAP.length; i++) {
      if (href === MAP[i].from) {
        a.setAttribute("href", MAP[i].to);
        return;
      }
    }

    if ((t === "progress" || t.indexOf("progress") === 0) && (href === "/grading" || href === "/grading.html")) {
      a.setAttribute("href", "/campus/grading");
    }

    /* Labels that must never be Port */
    var campusLabels = {
      faculty: "/campus/faculty",
      bots: "/campus/bots",
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
      charter: "/campus/charter/",
      assignments: "/campus/assignments/",
      foundation: "/campus/desk/foundation/",
      pillars: "/campus/desk/pillars/",
      "iḥsān": "/campus/desk/ihsan/",
      ihsan: "/campus/desk/ihsan/",
      "amānah module": "/campus/desk/amanah/"
    };
    if (href === "/" || href === "/index.html" || href === "") {
      if (campusLabels[t]) a.setAttribute("href", campusLabels[t]);
    }
  }

  function garden() {
    var room = (d.documentElement.getAttribute("data-clarity-room") || "").toLowerCase();
    var path = location.pathname || "";
    if (path.indexOf("/campus") !== 0 && room !== "university") return;
    d.querySelectorAll("a[href]").forEach(fixAnchor);
  }

  function boot() {
    garden();
    setTimeout(garden, 50);
    setTimeout(garden, 400);
    setTimeout(garden, 1200);
    setTimeout(garden, 2500);
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
