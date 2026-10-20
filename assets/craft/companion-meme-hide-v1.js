/**
 * companion-meme-hide-v1 — 20261020VAULT2
 * Reveal Tablīgh (#meme-card) only outside Amana Vault / notes tab.
 */
(function (g) {
  "use strict";
  if (g.__CU_MEME_HIDE_V1__) {
    /* allow upgrade */
  }
  g.__CU_MEME_HIDE_V1__ = true;

  function onNotes() {
    try {
      return (document.body.getAttribute("data-active-tab") || "") === "notes";
    } catch (e) {
      return false;
    }
  }

  function reveal() {
    try {
      var card = document.getElementById("meme-card");
      if (!card) return;
      if (onNotes()) {
        card.setAttribute("hidden", "");
        card.setAttribute("aria-hidden", "true");
        card.style.setProperty("display", "none", "important");
        card.style.setProperty("visibility", "hidden", "important");
        return;
      }
      card.style.removeProperty("display");
      card.style.removeProperty("visibility");
      card.style.removeProperty("height");
      card.removeAttribute("hidden");
      card.setAttribute("aria-hidden", "false");
      var dead = document.getElementById("cu-meme-hide-css");
      if (dead) dead.remove();
    } catch (e) {}
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", reveal);
  else reveal();
  setTimeout(reveal, 200);
  setTimeout(reveal, 1200);
  g.addEventListener("clarity-tab-change", reveal);
  var prev = g.switchTab;
  if (typeof prev === "function" && !prev.__memeVaultGuard) {
    g.switchTab = function () {
      var r = prev.apply(this, arguments);
      setTimeout(reveal, 0);
      setTimeout(reveal, 150);
      return r;
    };
    g.switchTab.__memeVaultGuard = true;
  }
})(typeof window !== "undefined" ? window : this);
