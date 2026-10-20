/**
 * Amana Vault isolation trench · 20261020VAULT
 * Prevents Action / Reminder / Reflection cross-wiring into vault interior.
 * Does not weaken CASTLE crypto — only visibility & tab boundary.
 * Educational · on-device only · not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_AMANA_VAULT_ISOLATE_V1__) return;
  g.__CLARITY_AMANA_VAULT_ISOLATE_V1__ = true;

  var SENSITIVE_IDS = [
    "amana-vault-interior",
    "faraid-card",
    "wasiyyah-card",
    "user-family-tree-card",
    "fiqh-workflow-card"
  ];
  var ACTION_IDS = [
    "meme-card",
    "tweet-desk-card",
    "facebook-desk-card",
    "callig-lab-card",
    "tajweed-live-card",
    "tajweed-path-card",
    "tj-deep-studio"
  ];

  function activeTab() {
    try {
      return (document.body.getAttribute("data-active-tab") || "").toLowerCase();
    } catch (e) {
      return "";
    }
  }

  function sealInterior() {
    var interior = document.getElementById("amana-vault-interior");
    if (!interior) return;
    interior.setAttribute("hidden", "");
    interior.setAttribute("inert", "");
    interior.setAttribute("aria-hidden", "true");
    interior.setAttribute("data-amana-sealed", "1");
    try {
      interior.style.setProperty("display", "none", "important");
      interior.style.setProperty("visibility", "hidden", "important");
    } catch (e) {}
    /* do not clear encrypted storage — only UI seal */
  }

  function hideSensitiveOutsideNotes() {
    var tab = activeTab();
    if (tab === "notes") return;
    sealInterior();
    SENSITIVE_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (id === "amana-vault-interior") return;
      /* cards live inside interior — ensure not orphan-shown */
      if (!el.closest || !el.closest("#amana-vault-interior")) {
        el.setAttribute("hidden", "");
        el.style.display = "none";
      }
    });
  }

  function hideActionToolsOnNotes() {
    if (activeTab() !== "notes") return;
    ACTION_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.setAttribute("hidden", "");
      try {
        el.style.setProperty("display", "none", "important");
      } catch (e) {}
    });
  }

  function revealActionToolsOffNotes() {
    if (activeTab() === "notes") return;
    ACTION_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      /* only unhide if parent action panel is active path — leave data-rrra filter alone */
      el.removeAttribute("hidden");
      try {
        el.style.removeProperty("display");
      } catch (e) {}
    });
  }

  function isolateVaultHost() {
    var host = document.getElementById("amana-vault-host");
    var notes = document.getElementById("tab-notes");
    if (!host || !notes) return;
    var onNotes = activeTab() === "notes";
    if (!onNotes) {
      notes.setAttribute("hidden", "");
      notes.setAttribute("aria-hidden", "true");
      try {
        notes.style.setProperty("display", "none", "important");
      } catch (e) {}
      sealInterior();
    }
  }

  function enforce() {
    try {
      hideSensitiveOutsideNotes();
      isolateVaultHost();
      if (activeTab() === "notes") {
        hideActionToolsOnNotes();
      } else {
        revealActionToolsOffNotes();
      }
    } catch (e) {}
  }

  /* Wrap switchTab without breaking existing */
  var prev = g.switchTab;
  if (typeof prev === "function") {
    g.switchTab = function (tab, opts) {
      var r = prev.apply(this, arguments);
      setTimeout(enforce, 0);
      setTimeout(enforce, 120);
      return r;
    };
  }

  g.addEventListener("clarity-tab-change", enforce);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      /* castle already locks session; reinforce UI seal when leaving page */
      try {
        if (typeof g.amanaLockVault === "function") g.amanaLockVault();
        else if (typeof g.amanaSessionLock === "function") g.amanaSessionLock();
      } catch (e) {}
      sealInterior();
    }
  });
  g.addEventListener("pagehide", function () {
    sealInterior();
  });

  /* Block accidental deep-link dump of interior HTML into Action */
  g.addEventListener(
    "click",
    function (ev) {
      var t = ev.target;
      if (!t || !t.closest) return;
      if (t.closest("#amana-vault-interior") && activeTab() !== "notes") {
        ev.stopPropagation();
        sealInterior();
      }
    },
    true
  );

  function boot() {
    enforce();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(enforce, 500);
  setTimeout(enforce, 2000);
})(typeof window !== "undefined" ? window : this);
