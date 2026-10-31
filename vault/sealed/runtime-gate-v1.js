/*! Amānah runtime gate v2 · Dayn vault-only (not Day landing / not Companion tabs)
 * Educational only — not a fatwa · not legal/financial advice.
 */
(function (w) {
  "use strict";
  if (w.ClarityVaultGate && w.ClarityVaultGate.__daynVaultOnly) return;

  function hash() {
    try {
      return (w.location.hash || "").replace(/^#/, "").toLowerCase();
    } catch (e) {
      return "";
    }
  }

  function tab() {
    try {
      var b = document.body;
      return ((b && b.getAttribute("data-active-tab")) || "").toLowerCase();
    } catch (e) {
      return "";
    }
  }

  function vaultPanelVisible() {
    var sels = [
      "[data-vault-root]",
      "#amana-vault",
      ".amana-vault-interior",
      "#amana-prepare-tonight",
      "[data-vault-passphrase-panel]",
      "#vault-passphrase",
      "#amana-vault-gate",
    ];
    for (var i = 0; i < sels.length; i++) {
      var nodes = document.querySelectorAll(sels[i]);
      for (var j = 0; j < nodes.length; j++) {
        var el = nodes[j];
        if (el.hasAttribute("hidden") || el.getAttribute("aria-hidden") === "true") continue;
        try {
          if (el.style && el.style.display === "none") continue;
        } catch (e) {}
        return true;
      }
    }
    return false;
  }

  function isVaultContext() {
    var h = hash();
    if (h.indexOf("vault") >= 0) return true;
    var t = tab();
    if (t === "notes" || t === "vault") return true;
    if (vaultPanelVisible()) return true;
    return false;
  }

  function isPassphraseSurface() {
    if (!isVaultContext()) return false;
    var roots = document.querySelectorAll(
      "[data-vault-root], #amana-vault, .amana-vault, .amana-vault-interior, #amana-prepare-tonight, [data-vault-passphrase-panel], #vault-passphrase, #amana-vault-gate"
    );
    for (var i = 0; i < roots.length; i++) {
      var r = roots[i];
      if (r.hasAttribute("hidden")) continue;
      if (r.querySelector('input[type="password"], [data-vault-passphrase], .vault-passphrase, #vault-passphrase')) {
        return true;
      }
      if (r.id === "vault-passphrase" || r.getAttribute("data-vault-passphrase-panel") != null) return true;
    }
    return isVaultContext();
  }

  function isDayLandingContext() {
    return false; /* Dayn removed from Day landing */
  }

  function vaultPasswordInputs() {
    var roots = document.querySelectorAll(
      "[data-vault-root], #amana-vault, .amana-vault, .amana-vault-interior, #amana-prepare-tonight, [data-vault-passphrase-panel]"
    );
    var out = [];
    for (var i = 0; i < roots.length; i++) {
      var r = roots[i];
      if (r.hasAttribute("hidden")) continue;
      var list = r.querySelectorAll('input[type="password"]');
      for (var j = 0; j < list.length; j++) out.push(list[j]);
    }
    return out;
  }

  w.ClarityVaultGate = {
    __daynVaultOnly: true,
    isVaultContext: isVaultContext,
    isDayLandingContext: isDayLandingContext,
    isPassphraseSurface: isPassphraseSurface,
    vaultPasswordInputs: vaultPasswordInputs,
    allowDigestPanel: function () {
      return isVaultContext();
    },
    allowPassphraseTutorial: function () {
      return isVaultContext();
    },
    allowDaynVault: function () {
      return isVaultContext() || isPassphraseSurface();
    },
    allowDaynLanding: function () {
      return false;
    },
  };
})(window);
