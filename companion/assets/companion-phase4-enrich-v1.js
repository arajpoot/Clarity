/*! companion-phase4-enrich-v1 · section UX · educational only — not a fatwa */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_PHASE4_ENRICH__) return;
  w.__COMPANION_PHASE4_ENRICH__ = true;

  var STAMP = "Educational only — not a fatwa.";

  function ensureStamp(section) {
    if (!section || section.querySelector(":scope > .disc, :scope > .edu")) return;
    var p = d.createElement("p");
    p.className = "disc edu";
    p.textContent = STAMP;
    section.appendChild(p);
  }

  function upgradeSections(root) {
    root = root || d.getElementById("cs-mount") || d;
    root.querySelectorAll("section, .cs-plaque, .cs-card").forEach(function (sec) {
      if (sec.dataset.p4 === "1") return;
      sec.dataset.p4 = "1";
      // Promote plain section without plaque class
      if (sec.tagName === "SECTION" && !sec.classList.contains("cs-plaque")) {
        sec.classList.add("cs-plaque");
      }
      var h = sec.querySelector("h2, h3");
      if (h && !h.classList.contains("cs-title-enriched")) {
        h.classList.add("cs-title-enriched");
      }
      ensureStamp(sec);
    });
  }

  function boot() {
    try {
      d.documentElement.setAttribute("data-companion-phase", "4");
    } catch (e) {}
    upgradeSections();
    var m = d.getElementById("cs-mount");
    if (m) {
      new MutationObserver(function () {
        upgradeSections(m);
      }).observe(m, { childList: true, subtree: true });
    }
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.ClarityPhase4 = { version: "P4", upgrade: upgradeSections };
})(window, document);
