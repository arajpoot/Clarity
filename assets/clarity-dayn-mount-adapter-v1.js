/*! Dayn mount adapter · places authentic Qard ḥasan ledger in Ledger + day landing
 * Storage remains clarity_dayn_ledger_v1 (same as original)
 * Educational only — not a fatwa · not legal/financial advice
 */
(function () {
  "use strict";
  if (window.__CLARITY_DAYN_MOUNT_ADAPTER__) return;
  window.__CLARITY_DAYN_MOUNT_ADAPTER__ = true;

  function ensureLandingSlot() {
    var landing =
      document.getElementById("clarity-day-landing") ||
      document.querySelector("[data-day-landing]") ||
      document.getElementById("clarity-landing-slot-dayn");
    if (!landing) return null;
    var slot = document.getElementById("clarity-landing-slot-dayn");
    if (!slot) {
      slot = document.createElement("div");
      slot.id = "clarity-landing-slot-dayn";
      slot.setAttribute("data-dayn-slot", "1");
      // insert before "Remember the long stay" if found, else append
      var longStay = null;
      landing.querySelectorAll("h2,h3,.cdl-head,section,.card").forEach(function (el) {
        if (/remember the long stay/i.test(el.textContent || "")) longStay = el.closest("section,article,.card") || el;
      });
      if (longStay && longStay.parentElement) {
        longStay.parentElement.insertBefore(slot, longStay);
      } else {
        landing.appendChild(slot);
      }
    }
    return slot;
  }

  function ensureVaultSlot() {
    var block = document.getElementById('amana-vault-ledger-block-dayn') || document.getElementById('clarity-vault-slot-dayn');
    if (block) { if (!block.id || block.id === 'amana-vault-ledger-block-dayn') block.id = 'clarity-vault-slot-dayn'; return block; }
    // Prefer Amānah Ledger shell from fortify
    var ledger =
      document.getElementById("amana-ledger-section") ||
      document.querySelector("[data-vault-ledger]");
    if (ledger) {
      var slot = document.getElementById("clarity-vault-slot-dayn");
      if (!slot) {
        slot = document.createElement("div");
        slot.id = "clarity-vault-slot-dayn";
        slot.className = "amana-dayn-vault-slot";
        var exportHost = document.getElementById("vault-export-host");
        if (exportHost) ledger.insertBefore(slot, exportHost);
        else ledger.appendChild(slot);
      }
      return slot;
    }
    // Original targets
    var interior =
      document.querySelector(".amana-vault-interior") ||
      document.getElementById("ahr-debts") ||
      document.querySelector("[data-vault-unlocked]");
    if (!interior) return null;
    var vslot = document.getElementById("clarity-vault-slot-dayn");
    if (!vslot) {
      vslot = document.createElement("div");
      vslot.id = "clarity-vault-slot-dayn";
      var parent = interior.closest("section,article,.card") || interior.parentElement || interior;
      if (parent) parent.appendChild(vslot);
    }
    return vslot;
  }

  function tick() {
    ensureLandingSlot();
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
    setTimeout(function () { try { obs.disconnect(); } catch (e) {} }, 20000);
  } catch (e) {}
})();
