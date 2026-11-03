/*! Dayn mount adapter v2 · freeze polish
 * Observer-free · idempotent · single-purpose slot ensure
 * Storage remains clarity_dayn_ledger_v1
 * Educational only — not a fatwa · not legal/financial advice
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_DAYN_MOUNT_ADAPTER_V2__) return;
  g.__CLARITY_DAYN_MOUNT_ADAPTER_V2__ = true;

  // Keep legacy flag so older checks do not double-mount
  g.__CLARITY_DAYN_MOUNT_ADAPTER__ = true;

  var COORD = (g.ClarityAmanaDayn = g.ClarityAmanaDayn || {
    ready: false,
    mounted: { landing: false, vault: false },
    markReady: function () {
      this.ready = true;
      try {
        document.dispatchEvent(new CustomEvent("clarity-amana-dayn-ready"));
      } catch (e) {}
    }
  });

  function ensureLandingSlot() {
    if (COORD.mounted.landing) {
      var existing = document.getElementById("clarity-landing-slot-dayn");
      if (existing && existing.isConnected) return existing;
    }

    var slot = document.getElementById("clarity-landing-slot-dayn");
    if (slot && slot.isConnected) {
      COORD.mounted.landing = true;
      return slot;
    }

    // Prefer explicit chamber host on /amana/dayn/
    var chamber = document.querySelector("[data-clarity-room='amana'] main .amana-card") ||
                  document.querySelector("main.amana-wrap .amana-card");
    if (chamber && !document.getElementById("clarity-landing-slot-dayn")) {
      slot = document.createElement("div");
      slot.id = "clarity-landing-slot-dayn";
      slot.setAttribute("data-dayn-slot", "1");
      chamber.insertBefore(slot, chamber.firstChild);
      COORD.mounted.landing = true;
      return slot;
    }

    var landing =
      document.getElementById("clarity-day-landing") ||
      document.querySelector("[data-day-landing]");
    if (!landing) return null;

    slot = document.createElement("div");
    slot.id = "clarity-landing-slot-dayn";
    slot.setAttribute("data-dayn-slot", "1");

    var longStay = null;
    try {
      landing.querySelectorAll("h2,h3,.cdl-head,section,.card").forEach(function (el) {
        if (/remember the long stay/i.test(el.textContent || "")) {
          longStay = el.closest("section,article,.card") || el;
        }
      });
    } catch (e) {}

    if (longStay && longStay.parentElement) {
      longStay.parentElement.insertBefore(slot, longStay);
    } else {
      landing.appendChild(slot);
    }
    COORD.mounted.landing = true;
    return slot;
  }

  function ensureVaultSlot() {
    if (COORD.mounted.vault) {
      var existing = document.getElementById("clarity-vault-slot-dayn");
      if (existing && existing.isConnected) return existing;
    }

    var block =
      document.getElementById("clarity-vault-slot-dayn") ||
      document.getElementById("amana-vault-ledger-block-dayn");
    if (block && block.isConnected) {
      if (block.id !== "clarity-vault-slot-dayn") block.id = "clarity-vault-slot-dayn";
      COORD.mounted.vault = true;
      return block;
    }

    // Prefer Amānah Ledger shell / chamber card
    var ledger =
      document.getElementById("amana-ledger-section") ||
      document.querySelector("[data-vault-ledger]") ||
      document.querySelector("main.amana-wrap .amana-card");
    if (ledger) {
      var slot = document.createElement("div");
      slot.id = "clarity-vault-slot-dayn";
      slot.className = "amana-dayn-vault-slot";
      slot.setAttribute("data-dayn-slot", "1");
      var exportHost = document.getElementById("vault-export-host") ||
                       document.getElementById("clarity-vault-dayn-io");
      if (exportHost && exportHost.parentElement === ledger) {
        ledger.insertBefore(slot, exportHost);
      } else {
        ledger.appendChild(slot);
      }
      COORD.mounted.vault = true;
      return slot;
    }

    var interior =
      document.querySelector(".amana-vault-interior") ||
      document.getElementById("ahr-debts") ||
      document.querySelector("[data-vault-unlocked]");
    if (!interior) return null;

    var vslot = document.createElement("div");
    vslot.id = "clarity-vault-slot-dayn";
    vslot.setAttribute("data-dayn-slot", "1");
    var parent = interior.closest("section,article,.card") || interior.parentElement || interior;
    if (parent) parent.appendChild(vslot);
    COORD.mounted.vault = true;
    return vslot;
  }

  function tick() {
    try {
      ensureLandingSlot();
      ensureVaultSlot();
      if (COORD.mounted.landing || COORD.mounted.vault) {
        COORD.markReady();
      }
    } catch (e) {
      try { console.warn("[Dayn mount adapter v2]", e); } catch (err) {}
    }
  }

  // Event-driven only — no MutationObserver
  function boot() {
    tick();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // Limited, non-recursive retries (no observer)
  setTimeout(tick, 400);
  setTimeout(tick, 1200);

  document.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(tick, 60);
  });
  document.addEventListener("clarity-amana-sealed-ready", function () {
    setTimeout(tick, 40);
  });
})(typeof window !== "undefined" ? window : this);
