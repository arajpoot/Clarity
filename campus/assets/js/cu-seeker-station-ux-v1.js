/*! cu-seeker-station-ux-v1 · U35
 * Relocate sticky phase rail · dedupe enrich lessons · mark junior present
 */
(function (w, d) {
  "use strict";
  if (w.__CU_SEEKER_STATION_UX_V1__) return;
  w.__CU_SEEKER_STATION_UX_V1__ = true;

  function isSeeker() {
    var p = (location.pathname || "").replace(/\/+$/, "");
    return p === "/campus/desk/seeker";
  }

  function calmRail() {
    if (!isSeeker()) return;
    var rail =
      d.getElementById("clarity-phase-plaque-rail") ||
      d.querySelector(".clarity-phase-plaque-rail");
    if (!rail) return;
    // Unstick: move under curriculum host or main, not floating top
    rail.style.position = "relative";
    rail.style.top = "auto";
    rail.style.zIndex = "1";
    var host = d.getElementById("cu-curriculum-host");
    var main = d.querySelector("main") || d.body;
    if (host && rail.parentNode !== host) {
      try {
        host.insertBefore(rail, host.firstChild);
      } catch (e) {
        try {
          main.appendChild(rail);
        } catch (e2) {}
      }
    }
  }

  function dedupeLessons() {
    if (!isSeeker()) return;
    var junior = d.getElementById("junior-curriculum-card");
    var lessons = d.getElementById("cu-curr-lessons");
    if (junior) {
      d.body.classList.add("cu-has-junior");
      if (lessons) {
        lessons.classList.add("cu-dup-hide");
        lessons.style.display = "none";
      }
    }
  }

  function boot() {
    if (!isSeeker()) return;
    try {
      d.body.setAttribute("data-campus-page", "seeker");
      calmRail();
      dedupeLessons();
    } catch (e) {}
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  [200, 600, 1500, 3000].forEach(function (t) {
    setTimeout(boot, t);
  });
})(window, document);
