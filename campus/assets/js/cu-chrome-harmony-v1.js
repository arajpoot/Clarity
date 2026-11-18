/*! cu-chrome-harmony-v1 · U22
 * Dedupe room rails + campus chrome injected more than once.
 * Does NOT remove admission steps, curriculum, or stage content.
 * Educational only — not a fatwa · not a grade of īmān.
 */
(function (w, d) {
  "use strict";
  if (w.__CU_CHROME_HARMONY_V1__) return;
  w.__CU_CHROME_HARMONY_V1__ = true;

  function keepFirst(sel) {
    var nodes = d.querySelectorAll(sel);
    for (var i = 1; i < nodes.length; i++) {
      try {
        nodes[i].parentNode && nodes[i].parentNode.removeChild(nodes[i]);
      } catch (e) {}
    }
    return nodes.length;
  }

  function harmony() {
    // Castle room rail (shared)
    keepFirst("nav.clarity-room-nav");
    // Campus banners / pill rails (JS may inject extras)
    keepFirst("header.cu-banner");
    keepFirst("nav.cu-pills");
    keepFirst("nav.lab-station-nav");
    keepFirst("[data-cu-student-status]");
    keepFirst("#cu-day-flow");
    // Smart-nav clones if any
    keepFirst("nav.cu-smart-rooms");
    keepFirst("nav.cu-smart-stages");
    keepFirst(".cu-smart-nav-root");
  }

  function boot() {
    try {
      harmony();
    } catch (e) {}
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 200);
  setTimeout(boot, 800);
  setTimeout(boot, 1600);
})(window, document);
