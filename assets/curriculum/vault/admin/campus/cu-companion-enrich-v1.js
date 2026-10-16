/**
 * Companion enrichment — DISABLED off Map (20261016NIGHT)
 */
(function (g) {
  "use strict";
  if (g.__CU_COMPANION_ENRICH_V1__) return;
  g.__CU_COMPANION_ENRICH_V1__ = true;

  function isMap() {
    try {
      if (document.body && document.body.getAttribute("data-campus-page") === "map") return true;
    } catch (e) {}
    var p = (location.pathname || "").replace(/\/+$/, "") || "/";
    return p === "/campus" || p === "/campus/";
  }

  function strip() {
    document.querySelectorAll("#cu-companion-enrich, .cu-companion-enrich, section.cu-enrich, .cu-enrich-grid").forEach(function (el) {
      if (el.id === "cu-companion-enrich" || el.classList.contains("cu-companion-enrich")) {
        if (!isMap()) el.remove();
      } else if (!isMap() && el.closest && !el.closest("#cu-companion-enrich")) {
        /* only remove known enrich wrappers off-map */
      }
    });
    if (!isMap()) {
      document.querySelectorAll("#cu-companion-enrich, .cu-companion-enrich").forEach(function (el) {
        el.remove();
      });
      /* remove heading blocks that only exist for enrich */
      document.querySelectorAll("h2.cu-enrich-title, p.cu-enrich-lead").forEach(function (el) {
        var sec = el.closest("section");
        if (sec) sec.remove();
        else el.remove();
      });
    }
  }

  function mount() {
    strip();
    if (!isMap()) return;
    /* Map may already have static enrich — do not duplicate */
    if (document.getElementById("cu-companion-enrich")) return;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
  setTimeout(strip, 300);
  setTimeout(strip, 900);
  setTimeout(strip, 2000);
})(typeof window !== "undefined" ? window : this);
