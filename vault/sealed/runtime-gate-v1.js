/*! Amānah sealed runtime gate · SPA-aware · stops tab leakage */
(function (w) {
  "use strict";
  if (w.__CLARITY_VAULT_RUNTIME_GATE__) return;
  w.__CLARITY_VAULT_RUNTIME_GATE__ = true;

  function tab() {
    try {
      return ((document.body && document.body.getAttribute("data-active-tab")) || "").toLowerCase();
    } catch (e) {
      return "";
    }
  }
  function hash() {
    try {
      return (location.hash || "").toLowerCase();
    } catch (e) {
      return "";
    }
  }
  function vaultPanelVisible() {
    var roots = document.querySelectorAll("#amana-vault, [data-vault-root], .amana-vault-interior");
    for (var i = 0; i < roots.length; i++) {
      var el = roots[i];
      if (el.hasAttribute("hidden")) continue;
      if (el.getAttribute("aria-hidden") === "true") continue;
      var st = "";
      try {
        st = (el.style && el.style.display) || "";
      } catch (e) {}
      if (st === "none") continue;
      // class active on parent tab
      var tabp = el.closest(".tab-panel, [data-tab-panel]");
      if (tabp && tabp.hasAttribute("hidden")) continue;
      if (tabp && tabp.getAttribute("aria-hidden") === "true") continue;
      if (tabp && !(tabp.classList && (tabp.classList.contains("active") || tabp.classList.contains("is-active")))) {
        // if tab system uses active class and this panel lacks it, skip
        if (tabp.className && String(tabp.className).indexOf("tab-panel") >= 0) continue;
      }
      return true;
    }
    return false;
  }

  /** Active vault UX — not merely "vault nodes exist in SPA DOM" */
  function isVaultContext() {
    var h = hash();
    if (h.indexOf("vault") >= 0) return true;
    var t = tab();
    if (t === "notes" || t === "vault") return true;
    // Amana bottom nav often uses notes for vault tools
    if (t === "notes") return true;
    if (vaultPanelVisible()) return true;
    return false;
  }

  function isDayLandingContext() {
    var land =
      document.getElementById("clarity-day-landing") ||
      document.querySelector("[data-day-landing]");
    if (!land) return false;
    if (land.hasAttribute("hidden") || land.getAttribute("aria-hidden") === "true") return false;
    try {
      if (land.style && land.style.display === "none") return false;
    } catch (e) {}
    return true;
  }

  function vaultPasswordInputs() {
    var roots = document.querySelectorAll(
      "[data-vault-root], #amana-vault, .amana-vault, .amana-vault-interior, #amana-prepare-tonight"
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
    isVaultContext: isVaultContext,
    isDayLandingContext: isDayLandingContext,
    vaultPasswordInputs: vaultPasswordInputs,
    allowDigestPanel: function () {
      return isVaultContext();
    },
    allowPassphraseTutorial: function () {
      return isVaultContext();
    },
    allowDaynVault: function () {
      return isVaultContext();
    },
    allowDaynLanding: function () {
      return isDayLandingContext();
    },
  };
})(window);
