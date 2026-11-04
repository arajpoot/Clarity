/*! nuros-ops-boot-v1 · Phase 8 — operational continuity
 * Loads integrity smoke if missing; exposes contract helpers.
 * Does not import room SoTs. Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__NUROS_OPS_BOOT_V1__) return;
  w.__NUROS_OPS_BOOT_V1__ = true;

  function loadScript(src) {
    return new Promise(function (resolve) {
      if (d.querySelector('script[src*="' + src.split("?")[0] + '"]')) {
        resolve(true);
        return;
      }
      var s = d.createElement("script");
      s.src = src;
      s.defer = true;
      s.onload = function () { resolve(true); };
      s.onerror = function () { resolve(false); };
      d.head.appendChild(s);
    });
  }

  function ensureIntegrity() {
    if (w.ClarityIntegrity || typeof w.integrity === "function") return Promise.resolve(true);
    return loadScript("/assets/nuros/nuros-integrity-smoke-v1.js?v=20261104P8");
  }

  function stamp() {
    try {
      d.documentElement.setAttribute("data-nuros-ops", "8");
    } catch (e) {}
  }

  function boot() {
    stamp();
    ensureIntegrity().then(function () {
      try {
        if (typeof w.integrity === "function" && (w.location.pathname === "/" || w.location.pathname === "")) {
          w.integrity("ops_boot");
        }
      } catch (e) {}
    });
  }

  w.NurOSOps = {
    version: "8",
    ensureIntegrity: ensureIntegrity,
    smoke: function (r) {
      return ensureIntegrity().then(function () {
        if (typeof w.integrity === "function") return w.integrity(r || "ops");
        return { status: "SKIP", issues: ["integrity_not_loaded"] };
      });
    }
  };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
