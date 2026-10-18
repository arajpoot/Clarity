/**
 * Companion deep-study bridges — university → companion anchors
 * Does not modify companion HTML. Hash + optional door event on load.
 */
(function (g) {
  "use strict";
  if (g.__CU_COMPANION_BRIDGE_V1__) return;
  g.__CU_COMPANION_BRIDGE_V1__ = true;

  /** Known companion anchors (scan 2026-10-18) */
  var LINKS = {
    hajjGuide: { href: "/#hajj-guide-card", label: "Hajj Ritual Guide", note: "Step-by-step rites · companion" },
    hajjChecklist: { href: "/#hajj-checklist-card", label: "Hajj checklist", note: "Preparation ticks · companion" },
    ilmPathway: { href: "/#ilm-pathway-card", label: "Ilm pathway", note: "Path index · companion" },
    authenticStack: { href: "/#authentic-learning-stack", label: "Authentic learning stack", note: "Curated gateways · companion" },
    learnStrip: { href: "/#guidance-learn-strip", label: "Guided search", note: "Theme search · companion" },
    dualPath: { href: "/#clarity-dual-path", label: "Dual path home", note: "Companion + University" },
    tajweedPath: { href: "/#tajweed-path-card", label: "Tajweed path card", note: "Companion tajweed entry" }
  };

  g.ClarityCompanionBridge = {
    links: LINKS,
    href: function (key) { return (LINKS[key] && LINKS[key].href) || "/"; }
  };

  /** If landing on companion with hash, soft-open RRRA action hub when API exists */
  function softOpenCompanionHash() {
    try {
      if (location.pathname !== "/" && location.pathname !== "/index.html") return;
      var h = (location.hash || "").replace(/^#/, "");
      if (!h) return;
      setTimeout(function () {
        try {
          if (typeof g.clarityOpenSectionDoor === "function") {
            /* action hub holds hajj cards */
            g.clarityOpenSectionDoor("action");
          }
          var el = document.getElementById(h);
          if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (e) {}
      }, 400);
    } catch (e) {}
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", softOpenCompanionHash);
  else softOpenCompanionHash();
})(typeof window !== "undefined" ? window : this);
