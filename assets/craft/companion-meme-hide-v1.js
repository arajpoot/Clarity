/**
 * companion-meme-hide-v1 — RESTORED 20261015MEME
 * Previously hid #meme-card on Companion. Now a no-op so Meme Studio stays visible.
 * University paths still unaffected.
 */
(function (g) {
  "use strict";
  if (g.__CU_MEME_HIDE_V1__) return;
  g.__CU_MEME_HIDE_V1__ = true;
  /* Restore: do not inject hide CSS. Optional: ensure card is not aria-hidden. */
  function reveal() {
    try {
      var card = document.getElementById("meme-card");
      if (card) {
        card.style.removeProperty("display");
        card.style.removeProperty("visibility");
        card.style.removeProperty("height");
        card.removeAttribute("hidden");
        card.setAttribute("aria-hidden", "false");
      }
      var dead = document.getElementById("cu-meme-hide-css");
      if (dead) dead.remove();
      var hint = document.getElementById("cu-lab-craft-hint");
      if (hint) hint.remove();
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", reveal);
  else reveal();
  setTimeout(reveal, 200);
  setTimeout(reveal, 1200);
})(typeof window !== "undefined" ? window : this);
