/*! Amānah UFT · Phase A · host cohesion
 * Load map fragility: core expects #uft-preview; chamber ships #uft-stage.
 * Creates alias id without moving DOM; single recover pass.
 */
(function (d) {
  "use strict";
  if (window.__CLARITY_AMANA_UFT_PHASE_A_HOST__) return;
  window.__CLARITY_AMANA_UFT_PHASE_A_HOST__ = true;

  function alias() {
    var stage = d.getElementById("uft-stage");
    var preview = d.getElementById("uft-preview");
    if (stage && !preview) {
      stage.id = "uft-stage"; /* keep */
      stage.setAttribute("data-uft-preview-alias", "1");
      /* dual-id not valid; expose property for scripts that query preview */
      try {
        Object.defineProperty(d, "__uftPreviewEl", {
          configurable: true,
          get: function () {
            return d.getElementById("uft-stage");
          }
        });
      } catch (e) {}
      /* Lightweight shim for getElementById('uft-preview') via patch once */
      if (!d.__uftGetElPatched) {
        d.__uftGetElPatched = true;
        var orig = d.getElementById.bind(d);
        d.getElementById = function (id) {
          if (id === "uft-preview") {
            return orig("uft-preview") || orig("uft-stage");
          }
          return orig(id);
        };
      }
    }
  }

  function boot() {
    alias();
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 0);
})(document);
