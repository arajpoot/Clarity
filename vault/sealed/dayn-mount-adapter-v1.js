/*! Dayn mount adapter v2 · vault passphrase surface only — no Day landing slot
 * Educational only — not a fatwa.
 */
(function () {
  "use strict";
  if (window.__CLARITY_DAYN_MOUNT_ADAPTER_V2__) return;
  window.__CLARITY_DAYN_MOUNT_ADAPTER_V2__ = true;

  function scrubLanding() {
    try {
      document.querySelectorAll("#clarity-dayn-entry, #clarity-landing-slot-dayn, [data-dayn-slot]").forEach(function (el) {
        if (el.closest && el.closest("#amana-vault, [data-vault-root], .amana-vault-interior, #clarity-vault-slot-dayn, #clarity-dayn-vault-ledger")) return;
        try {
          el.remove();
        } catch (e) {
          el.hidden = true;
        }
      });
    } catch (e) {}
  }

  function ensureVaultSlot() {
    scrubLanding();
    var block =
      document.getElementById("amana-vault-ledger-block-dayn") ||
      document.getElementById("clarity-vault-slot-dayn");
    if (block) {
      if (!block.id || block.id === "amana-vault-ledger-block-dayn") block.id = "clarity-vault-slot-dayn";
      return block;
    }
    var gate =
      document.querySelector("[data-vault-passphrase-panel]") ||
      document.getElementById("vault-passphrase") ||
      document.getElementById("amana-vault-gate") ||
      document.getElementById("amana-ledger-section") ||
      document.querySelector("[data-vault-ledger]") ||
      document.querySelector(".amana-vault-interior") ||
      document.getElementById("amana-vault") ||
      document.querySelector("[data-vault-root]");
    if (!gate) return null;
    var slot = document.getElementById("clarity-vault-slot-dayn");
    if (!slot) {
      slot = document.createElement("div");
      slot.id = "clarity-vault-slot-dayn";
      slot.className = "amana-dayn-vault-slot";
      var pw = gate.querySelector && gate.querySelector('input[type="password"]');
      if (pw && pw.parentElement) {
        var wrap = pw.closest("label, .field, .form-row, div") || pw;
        if (wrap.parentElement) wrap.parentElement.insertBefore(slot, wrap.nextSibling);
        else gate.appendChild(slot);
      } else {
        var exportHost = document.getElementById("vault-export-host");
        if (exportHost && exportHost.parentElement === gate) gate.insertBefore(slot, exportHost);
        else gate.appendChild(slot);
      }
    }
    return slot;
  }

  function tick() {
    scrubLanding();
    ensureVaultSlot();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tick);
  else tick();
  setTimeout(tick, 500);
  setTimeout(tick, 1500);
  setTimeout(tick, 3500);
  try {
    var obs = new MutationObserver(tick);
    obs.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () {
      try {
        obs.disconnect();
      } catch (e) {}
    }, 20000);
  } catch (e) {}
})();
