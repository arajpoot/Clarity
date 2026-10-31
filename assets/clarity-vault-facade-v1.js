/*! ClarityVault façade — navigation + export hook only · not a fatwa */
(function (w) {
  "use strict";
  var API = {
    openDoor: function () {
      try {
        if (w.location.pathname.indexOf("/vault") === 0) return;
        // Prefer existing hash/route used on site
        if (w.location.hash !== "#vault" && !/vault/i.test(w.location.pathname)) {
          w.location.hash = "vault";
        }
        var el = document.getElementById("amana-vault") ||
          document.querySelector("[data-vault-root]") ||
          document.getElementById("vault");
        if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (e) {}
    },
    isUnlocked: function () {
      try {
        if (typeof w.ClarityAmanaVault !== "undefined" && w.ClarityAmanaVault.isUnlocked) {
          return !!w.ClarityAmanaVault.isUnlocked();
        }
      } catch (e) {}
      return !!w.__clarityVaultUnlocked;
    },
    requestExportSnapshot: function () {
      if (!API.isUnlocked()) return { ok: false, error: "locked" };
      if (typeof w.ClarityVaultDigest !== "undefined" && w.ClarityVaultDigest.buildAndUpload) {
        return w.ClarityVaultDigest.buildAndUpload();
      }
      return { ok: false, error: "digest_module_missing" };
    }
  };
  w.ClarityVault = API;
})(window);
