/*! Amānah legacy quarantine v1 · 20261031FORT3
 * Leftover public dayn/vault scripts under /assets/ must not paint Companion tabs.
 * Sealed stack under /vault/sealed/ is the only Dayn + digest authority.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_VAULT_LEGACY_QUARANTINE_V1__) return;
  w.__CLARITY_VAULT_LEGACY_QUARANTINE_V1__ = true;

  function neutralizePublicDayn() {
    w.__CLARITY_DAYN_SEALED_ONLY__ = true;
    document.querySelectorAll(
      "#clarity-dayn-entry, .clarity-dayn-entry, #clarity-dayn-vault-ledger"
    ).forEach(function (el) {
      var allowed =
        el.closest &&
        el.closest(
          "#clarity-day-landing, #clarity-landing-slot-dayn, #amana-vault, .amana-vault-interior, [data-vault-root], #clarity-vault-slot-dayn, #clarity-dayn-vault-ledger"
        );
      if (allowed) return;
      try {
        el.remove();
      } catch (e) {
        el.style.setProperty("display", "none", "important");
        el.setAttribute("hidden", "");
      }
    });
  }

  function boot() {
    try {
      neutralizePublicDayn();
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    boot();
    [400, 1200, 3000, 6000].forEach(function (ms) {
      setTimeout(boot, ms);
    });
  });
  w.addEventListener("clarity-vault-fortress-ready", boot);
  try {
    new MutationObserver(function () {
      boot();
    }).observe(document.documentElement, { childList: true, subtree: true });
  } catch (e) {}
})(typeof window !== "undefined" ? window : this);
