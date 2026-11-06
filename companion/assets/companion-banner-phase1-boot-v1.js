/*! companion-banner-phase1-boot-v1
 * Phase 1: moon + banner repair + live harden under Companion assets.
 * Does not load vault, landing-v3, campus, or amana engines.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_BANNER_PHASE1_BOOT__) return;
  w.__COMPANION_BANNER_PHASE1_BOOT__ = true;

  function roomOk() {
    try {
      var r = d.documentElement.getAttribute("data-clarity-room") || "";
      if (r && r !== "companion") return false;
      var p = (w.location.pathname || "");
      return p.indexOf("/companion") === 0 || p === "/" || true;
    } catch (e) { return true; }
  }

  if (!roomOk()) return;

  /* Flag for governance smoke */
  d.documentElement.setAttribute("data-companion-banner-phase", "1");
  try {
    w.ClarityCompanionBannerPhase1 = {
      version: "20261105P1",
      modules: ["moon", "repair", "live-harden"],
      governance: "companion-assets-only"
    };
  } catch (e) {}
})(window, document);
