(function (g) {
  "use strict";
  g.__CU_MEME_HIDE_V1__ = "20261020ANCHOR";
  function onAction() {
    try {
      return (document.body.getAttribute("data-active-tab") || "") === "action";
    } catch (e) {
      return false;
    }
  }
  function apply() {
    var card = document.getElementById("meme-card");
    if (!card) return;
    if (!onAction()) {
      card.setAttribute("hidden", "");
      card.style.setProperty("display", "none", "important");
      return;
    }
    card.removeAttribute("hidden");
    card.style.removeProperty("display");
  }
  document.addEventListener("DOMContentLoaded", apply);
  setTimeout(apply, 300);
  setTimeout(apply, 1200);
  var p = g.switchTab;
  if (typeof p === "function") {
    g.switchTab = function () {
      var r = p.apply(this, arguments);
      setTimeout(apply, 0);
      return r;
    };
  }
})(typeof window !== "undefined" ? window : this);
