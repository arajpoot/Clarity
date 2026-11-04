/*! nuros-campus-subpage-guard-v1 · Phase 9+
 * For /campus/* subpages: ensure university room attr; warn if companion shell detected.
 * Does not delete campus curriculum.
 */
(function (w, d) {
  "use strict";
  if (w.__NUROS_CAMPUS_SUBPAGE_GUARD_V1__) return;
  w.__NUROS_CAMPUS_SUBPAGE_GUARD_V1__ = true;

  function onCampus() {
    try {
      var p = (w.location && w.location.pathname) || "";
      return p === "/campus" || p.indexOf("/campus/") === 0;
    } catch (e) { return false; }
  }
  if (!onCampus()) return;

  try {
    d.documentElement.setAttribute("data-clarity-room", "university");
  } catch (e) {}

  function lookLikeCompanionShell() {
    return !!(d.querySelector("#tab-reminder") && d.querySelector(".rrra-hub-hero") && !d.querySelector(".cu-wrap, .cu-page, [data-campus-page]"));
  }

  function fixNav() {
    d.querySelectorAll(".clarity-room-nav a").forEach(function (a) {
      var uni = a.getAttribute("data-room-link") === "university" ||
        ((a.getAttribute("href") || "").indexOf("/campus") === 0);
      a.classList.toggle("is-here", !!uni);
      if (uni) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  function boot() {
    fixNav();
    if (lookLikeCompanionShell()) {
      try {
        console.warn("[NurOS] campus subpage still looks like Companion shell — restore campus HTML");
        w.__NUROS_CAMPUS_SHELL_WARN__ = true;
      } catch (e) {}
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
