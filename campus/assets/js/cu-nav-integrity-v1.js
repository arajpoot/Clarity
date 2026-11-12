/*! cu-nav-integrity-v1 · campus nav href gardener · educational only — not a fatwa
 * Scope: University/campus pages only. Does not touch Companion/Yawm/Amānah/Craft rooms.
 */
(function (w, d) {
  "use strict";
  if (w.__CU_NAV_INTEGRITY_V1__) return;
  w.__CU_NAV_INTEGRITY_V1__ = true;

  var MAP = [
    { from: "/lab/", to: "/campus/lab/" },
    { from: "/library/", to: "/campus/library/" },
    { from: "/lab", to: "/campus/lab/" },
    { from: "/library", to: "/campus/library/" }
  ];

  function textOf(a) {
    return String(a.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function fixAnchor(a) {
    if (!a || !a.getAttribute) return;
    var href = a.getAttribute("href") || "";
    var t = textOf(a);

    // Mislabeled Companion → Port
    if (href === "/" || href === "/?" || href.indexOf("/?enter=companion") === 0) {
      if (t.indexOf("companion") !== -1) {
        a.setAttribute("href", "/companion/");
        a.setAttribute("data-nav-fixed", "companion");
        return;
      }
      // bare ← Port stays; if unlabeled "/", leave
    }

    // Short lab/library → campus paths
    for (var i = 0; i < MAP.length; i++) {
      if (href === MAP[i].from || href.replace(/\/$/, "") === MAP[i].from.replace(/\/$/, "")) {
        a.setAttribute("href", MAP[i].to);
        a.setAttribute("data-nav-fixed", "campus-path");
        return;
      }
    }

    // Progress aliases
    if ((t === "progress" || t.indexOf("progress") === 0) && (href === "/grading" || href === "/grading.html")) {
      a.setAttribute("href", "/campus/grading.html");
      a.setAttribute("data-nav-fixed", "progress");
    }
  }

  function garden() {
    // Only on campus/university surfaces
    var room = (d.documentElement.getAttribute("data-clarity-room") || "").toLowerCase();
    var path = (location.pathname || "");
    if (room && room !== "university" && path.indexOf("/campus") !== 0) return;
    if (path.indexOf("/campus") !== 0 && room !== "university") return;

    var nodes = d.querySelectorAll("a[href]");
    for (var i = 0; i < nodes.length; i++) fixAnchor(nodes[i]);
  }

  function boot() {
    garden();
    // Re-run after injected uni-nav builds
    setTimeout(garden, 50);
    setTimeout(garden, 300);
    setTimeout(garden, 1000);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
