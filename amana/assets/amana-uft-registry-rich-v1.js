/*! Amānah UFT · registry richness restore v1
 * Expand full-fields registry, keep dock steps, pull tree names
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_REGISTRY_RICH_V1__) return;
  w.__CLARITY_AMANA_UFT_REGISTRY_RICH_V1__ = true;

  function isTree() {
    return /\/amana\/tree\/?/.test(location.pathname || "");
  }

  function enrich() {
    if (!isTree()) return;
    var deep = d.getElementById("uft-registry-deep");
    if (deep) {
      deep.classList.remove("uft-reg-collapsed");
      deep.hidden = false;
      deep.style.display = "block";
      var btn = d.getElementById("uft-reg-toggle-btn");
      if (btn) btn.textContent = "Collapse registry";
    }
    try {
      localStorage.setItem("clarity_uft_reg_collapsed_v1", "0");
    } catch (e) {}
    /* Ensure deep panel exists (registry-deep module) */
    try {
      if (typeof w.uftRegistryDeepEnsure === "function") w.uftRegistryDeepEnsure();
    } catch (e2) {}
    d.querySelectorAll("#uft-registry-deep .uft-deep-grid, #uft-registry-deep .uft-deep-list-wrap").forEach(function (el) {
      el.style.display = "";
    });
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(enrich, 400); });
  else setTimeout(enrich, 400);
  setTimeout(enrich, 1200);
  setTimeout(enrich, 2500);
  d.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(enrich, 300);
  });
})(window, document);
