/**
 * companion-meme-hide-v1 · 20261020CRAFT
 * Reveal استوديو التبليغ only on Action tab
 */
(function (g) {
  "use strict";
  g.__CU_MEME_HIDE_V1__ = "20261020CRAFT";
  function onAction() {
    try {
      return (document.body.getAttribute("data-active-tab") || "") === "action";
    } catch (e) {
      return false;
    }
  }
  function apply() {
    try {
      var card = document.getElementById("meme-card");
      if (!card) return;
      if (!onAction()) {
        card.setAttribute("hidden", "");
        card.setAttribute("aria-hidden", "true");
        card.style.setProperty("display", "none", "important");
        card.style.setProperty("visibility", "hidden", "important");
        return;
      }
      card.style.removeProperty("display");
      card.style.removeProperty("visibility");
      card.removeAttribute("hidden");
      card.setAttribute("aria-hidden", "false");
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
  else apply();
  setTimeout(apply, 200);
  setTimeout(apply, 1200);
  var prev = g.switchTab;
  if (typeof prev === "function") {
    g.switchTab = function () {
      var r = prev.apply(this, arguments);
      setTimeout(apply, 0);
      setTimeout(apply, 150);
      return r;
    };
  }
})(typeof window !== "undefined" ? window : this);
