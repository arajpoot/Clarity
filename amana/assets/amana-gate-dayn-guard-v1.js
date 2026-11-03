/*! Amānah gate Dayn guard v1
 * Prevents full Dayn ledger / form / export from mounting on the unlock (gate) page.
 * Full UI is allowed only on /amana/dayn/ (and optionally other chamber routes).
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_GATE_DAYN_GUARD__) return;
  w.__CLARITY_AMANA_GATE_DAYN_GUARD__ = true;

  function isGatePath() {
    var p = (location.pathname || "").replace(/\/+$/, "") || "/";
    return p === "/amana" || p === "/amana/index.html" || /\/amana\/?$/.test(location.pathname);
  }

  function isDaynChamber() {
    return /\/amana\/dayn\/?/.test(location.pathname || "");
  }

  // Public gate policy used by sealed Dayn scripts
  w.ClarityVaultGate = w.ClarityVaultGate || {};
  w.ClarityVaultGate.allowDaynLanding = function () {
    // Landing card only on day-landing surfaces or dayn chamber — never on gate
    if (isGatePath()) return false;
    return true;
  };
  w.ClarityVaultGate.allowDaynVault = function () {
    // Full vault ledger only on dayn chamber (or explicit vault interior pages)
    if (isGatePath()) return false;
    return isDaynChamber() || !!document.querySelector(".amana-vault-interior");
  };
  w.ClarityVaultGate.isGate = isGatePath;
  w.ClarityVaultGate.isDaynChamber = isDaynChamber;

  // Hide any Dayn UI that still leaks onto the gate after unlock
  function scrubGate() {
    if (!isGatePath()) return;
    var selectors = [
      "#clarity-dayn-entry",
      "#clarity-dayn-vault-ledger",
      "#amana-day-landing-ledger",
      "#amana-vault-ledger-block",
      "[data-amana-ledger-block]",
      ".clarity-dayn-entry",
      ".dayn-form",
      ".dayn-today",
      "[data-dayn-io-ui]",
      "#clarity-landing-slot-dayn",
      "#clarity-vault-slot-dayn"
    ];
    selectors.forEach(function (sel) {
      try {
        document.querySelectorAll(sel).forEach(function (el) {
          // Keep the chamber-tools links; only remove full Dayn modules
          if (el.closest && el.closest(".amana-tools")) return;
          el.style.setProperty("display", "none", "important");
          el.setAttribute("data-gate-scrubbed", "1");
          // Prefer removal when it is a pure Dayn block
          if (
            el.id === "clarity-dayn-entry" ||
            el.id === "clarity-dayn-vault-ledger" ||
            el.id === "amana-day-landing-ledger" ||
            el.id === "amana-vault-ledger-block" ||
            el.getAttribute("data-amana-ledger-block") === "1"
          ) {
            try { el.remove(); } catch (e) {}
          }
        });
      } catch (e) {}
    });
  }

  function boot() {
    scrubGate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // Re-scrub after unlock and after sealed scripts finish
  document.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) {
      setTimeout(scrubGate, 50);
      setTimeout(scrubGate, 400);
      setTimeout(scrubGate, 1200);
    }
  });
  document.addEventListener("clarity-amana-sealed-ready", function () {
    setTimeout(scrubGate, 30);
    setTimeout(scrubGate, 300);
  });

  // Limited observer only while on gate (disconnects quickly)
  if (isGatePath()) {
    try {
      var obs = new MutationObserver(function () {
        scrubGate();
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(function () {
        try { obs.disconnect(); } catch (e) {}
      }, 8000);
    } catch (e) {}
  }
})(window);
