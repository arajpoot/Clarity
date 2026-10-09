/* STUB — Clarity University form factor moved to sealed vault.
 * Load ./assets/curriculum/vault/boot.js instead.
 * This file no-ops when vault is present to prevent double-init corruption.
 */
(function(g){
  "use strict";
  if (g.__CLARITY_VAULT_BOOT__ || g.__CLARITY_VAULT_SEALED__) {
    try { console.info("[Clarity Vault] stub ignored: office-controller (foundation sealed)"); } catch(e) {}
    return;
  }
  try { console.warn("[Clarity Vault] office-controller is a stub. Deploy curriculum/vault and load boot.js"); } catch(e) {}
})(typeof window!=="undefined"?window:this);
