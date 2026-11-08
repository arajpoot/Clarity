/*! Amānah UFT · final cohesion v1
 * Single post-load settle: enrich graph → open bands → horizontal → stable names → expand registry.
 * Prevents flash/hide from competing repair scripts.
 * Educational only — not a legal pedigree · not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_FINAL_COHESION_V1__) return;
  w.__CLARITY_AMANA_UFT_FINAL_COHESION_V1__ = true;

  var KEY = w.UFT_KEY || "clarity_user_family_tree_v1";
  var done = false;

  function isTree() {
    return /\/amana\/tree\/?/.test(location.pathname || "") || !!d.getElementById("user-family-tree-card");
  }

  function settle() {
    if (!isTree()) return;
    try {
      if (typeof w.uftEnrichRestore === "function") w.uftEnrichRestore();
    } catch (e) {}
    try {
      if (typeof w.uftBuildRepairApply === "function") w.uftBuildRepairApply();
    } catch (e2) {}
    try {
      if (typeof w.uftViewportNamesSettle === "function") w.uftViewportNamesSettle();
    } catch (e3) {}
    /* Expand registry UI */
    try {
      var uni = d.getElementById("uft-registry-unified");
      if (uni) uni.open = true;
      var box = d.getElementById("uft-registry-box");
      if (box) box.open = true;
      d.querySelectorAll(".uft-reg-collapsed").forEach(function (el) {
        el.classList.remove("uft-reg-collapsed");
      });
      try {
        localStorage.setItem("clarity_uft_reg_collapsed_v1", "0");
      } catch (e4) {}
    } catch (e5) {}
    /* Horizontal */
    try {
      var preview = d.getElementById("uft-preview") || d.getElementById("uft-stage");
      if (preview) {
        preview.classList.add("uft-orient-h", "uft-tree");
        preview.classList.remove("uft-orient-v");
      }
      localStorage.setItem("clarity_uft_orient_v1", "h");
    } catch (e6) {}
    done = true;
  }

  function boot() {
    if (!isTree()) return;
    setTimeout(settle, 500);
    setTimeout(settle, 1600);
    setTimeout(function () {
      if (!done) settle();
    }, 2800);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  d.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) {
      done = false;
      setTimeout(boot, 200);
    }
  });
})(window, document);
