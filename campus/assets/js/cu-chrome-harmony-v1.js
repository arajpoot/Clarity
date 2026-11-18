/*! cu-chrome-harmony-v1 · U24
 * Dedupe room rails + campus chrome (incl. smart-nav stacks).
 * Does not remove curriculum or charter body. Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CU_CHROME_HARMONY_V24__) return;
  w.__CU_CHROME_HARMONY_V24__ = true;

  function keepFirst(sel) {
    var nodes = d.querySelectorAll(sel);
    for (var i = 1; i < nodes.length; i++) {
      try {
        nodes[i].parentNode && nodes[i].parentNode.removeChild(nodes[i]);
      } catch (e) {}
    }
  }

  function harmony() {
    keepFirst("nav.clarity-room-nav");
    keepFirst("header.cu-banner");
    keepFirst("nav.cu-pills");
    keepFirst("nav.lab-station-nav");
    keepFirst("[data-cu-student-status]");
    keepFirst("#cu-day-flow");
    keepFirst("nav.cu-smart-rooms");
    keepFirst("nav.cu-smart-stages");
    keepFirst(".cu-smart-nav-root");
    keepFirst(".cu-uni-topbar");
    keepFirst(".cu-path-rail");
    keepFirst("[data-cu-path-rail]");
    // Second university mini-header if smart-nav injects duplicate brand row
    var brands = d.querySelectorAll(".cu-brand-row, .cu-uni-brand, header.cu-subhead");
    for (var i = 1; i < brands.length; i++) {
      try {
        brands[i].parentNode && brands[i].parentNode.removeChild(brands[i]);
      } catch (e) {}
    }
  }

  function boot() {
    try {
      harmony();
    } catch (e) {}
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 200);
  setTimeout(boot, 700);
  setTimeout(boot, 1500);
})(window, document);
