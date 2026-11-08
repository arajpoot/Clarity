/*! Amānah UFT · Phase B · boot cohesion
 * Collapse multi-recover races: one scheduled render/load after modules settle.
 * Does not change storage schema · enrichment still held for calculator writes.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_PHASE_B_BOOT__) return;
  w.__CLARITY_AMANA_UFT_PHASE_B_BOOT__ = true;

  function isTree() {
    return /\/amana\/tree\/?/.test(location.pathname || "") || !!d.getElementById("user-family-tree-card");
  }

  var scheduled = false;
  function settle() {
    if (!isTree()) return;
    if (scheduled) return;
    scheduled = true;
    var tries = 0;
    function tick() {
      tries++;
      var ready =
        typeof w.uftLoad === "function" ||
        typeof w.uftRender === "function" ||
        typeof w.uftRegRender === "function";
      if (ready) {
        try {
          if (typeof w.uftLoad === "function") w.uftLoad();
          else if (typeof w.uftRender === "function") w.uftRender();
        } catch (e) {}
        try {
          if (typeof w.uftRegRender === "function") w.uftRegRender();
        } catch (e2) {}
        try {
          if (typeof w.uftRegFillHostSelect === "function") w.uftRegFillHostSelect();
        } catch (e3) {}
        var s = d.getElementById("uft-status");
        if (s && /Loading UFT/i.test(s.textContent || "")) {
          s.textContent = "UFT ready · educational outline on this device · not a legal pedigree";
        }
        return;
      }
      if (tries < 20) setTimeout(tick, 150);
    }
    setTimeout(tick, 300);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", settle);
  else settle();
  if (w.addEventListener) {
    w.addEventListener("load", function () {
      scheduled = false;
      settle();
    });
  }
  if (d.addEventListener) {
    d.addEventListener("clarity-amana-unlock-change", function (ev) {
      if (ev.detail && ev.detail.unlocked) {
        scheduled = false;
        settle();
      }
    });
  }
})(window, document);
