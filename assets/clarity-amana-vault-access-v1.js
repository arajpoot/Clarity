/*! Clarity Amana Vault Access — ISOLATED module
 * Does not depend on feature-pack, path-rail, meme, curriculum, or strips.
 * Only coordinates: show #tab-notes + #amana-vault-gate.
 * Crypto/lock/unlock lives solely in clarity-amana-vault-gate-js-v1.js
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_AMANA_VAULT_ACCESS_ISO__) return;
  g.__CLARITY_AMANA_VAULT_ACCESS_ISO__ = true;

  function showNotesTab() {
    try {
      if (typeof g.switchTab === "function") g.switchTab("notes");
    } catch (e) {}
    var panel = document.getElementById("tab-notes");
    if (!panel) return;
    panel.classList.add("active");
    panel.hidden = false;
    panel.style.display = "block";
    panel.style.visibility = "visible";
    panel.setAttribute("aria-hidden", "false");
    try {
      document.documentElement.setAttribute("data-active-tab", "notes");
      if (document.body) document.body.setAttribute("data-active-tab", "notes");
    } catch (e2) {}
    document.querySelectorAll(".tab-panel").forEach(function (p) {
      if (p.id !== "tab-notes") p.classList.remove("active");
    });
  }

  function revealGate() {
    var panel = document.getElementById("tab-notes");
    var gate = document.getElementById("amana-vault-gate");
    var interior = document.getElementById("amana-vault-interior");
    if (panel && !panel.classList.contains("amana-unlocked")) {
      panel.classList.add("amana-locked");
    }
    if (gate) {
      gate.hidden = false;
      gate.removeAttribute("hidden");
      gate.style.display = "block";
      gate.style.visibility = "visible";
      gate.style.opacity = "1";
      gate.style.pointerEvents = "auto";
    }
    try {
      if (g.AmanaVault && typeof g.AmanaVault.isOpen === "function" && g.AmanaVault.isOpen()) {
        if (panel) {
          panel.classList.remove("amana-locked");
          panel.classList.add("amana-unlocked");
        }
        if (interior) {
          interior.hidden = false;
          interior.style.display = "flex";
        }
        if (gate) gate.style.display = "none";
      }
    } catch (e) {}
  }

  function openVault() {
    showNotesTab();
    revealGate();
    setTimeout(function () {
      showNotesTab();
      revealGate();
      var gate = document.getElementById("amana-vault-gate");
      if (gate) {
        try {
          gate.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (e) {}
        var input = document.getElementById("amana-pass-unlock") || document.getElementById("amana-pass-new");
        if (input) {
          try {
            input.focus();
          } catch (e2) {}
        }
      }
    }, 60);
  }

  g.clarityOpenVault = openVault;
  g.clarityOpenAmanaVault = openVault;

  document.addEventListener(
    "click",
    function (ev) {
      var t = ev.target.closest(".rrra-rail-vault, [data-rail-tab='notes'], [data-rail-tab='vault']");
      if (!t) return;
      setTimeout(openVault, 20);
      setTimeout(openVault, 180);
    },
    true
  );

  function patchDoor() {
    var orig = g.clarityOpenSectionDoor;
    if (typeof orig === "function" && !orig.__amanaIso) {
      g.clarityOpenSectionDoor = function (id) {
        var r;
        try {
          r = orig.apply(this, arguments);
        } catch (e) {}
        id = String(id || "");
        if (id === "notes" || id === "vault" || id === "amana") setTimeout(openVault, 15);
        return r;
      };
      g.clarityOpenSectionDoor.__amanaIso = true;
    }
  }

  function boot() {
    patchDoor();
    setTimeout(patchDoor, 400);
    setTimeout(patchDoor, 1200);
    try {
      var h = (location.hash || "").replace("#", "").toLowerCase();
      if (h === "notes" || h === "vault" || h === "amana") setTimeout(openVault, 250);
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
