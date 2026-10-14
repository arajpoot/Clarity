/* Light integrity — university vault page only */
(function (g) {
  "use strict";
  if (g.__CU_VAULT_INTEGRITY_V1__) return;
  g.__CU_VAULT_INTEGRITY_V1__ = true;

  function check() {
    var report = { ok: true, notes: [] };
    try {
      if (!g.crypto || !g.crypto.subtle) {
        report.ok = false;
        report.notes.push("Web Crypto missing");
      }
      if (!g.ClarityVaultSecure) report.notes.push("secure engine not loaded");
      /* passphrase must not appear as localStorage key */
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i) || "";
        if (/passphrase|password|vault-pass/i.test(k)) {
          report.ok = false;
          report.notes.push("suspicious key: " + k);
        }
      }
      /* encrypted blob keys only */
      var meta = localStorage.getItem("cu_vault_meta_v1");
      if (meta && /\"pass\"/.test(meta)) {
        report.ok = false;
        report.notes.push("meta must not hold passphrase");
      }
    } catch (e) {
      report.ok = false;
      report.notes.push(String(e));
    }
    g.__CU_VAULT_INTEGRITY__ = report;
    return report;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(check, 600);
    });
  } else setTimeout(check, 600);

  g.ClarityVaultIntegrity = { check: check };
})(typeof window !== "undefined" ? window : this);
