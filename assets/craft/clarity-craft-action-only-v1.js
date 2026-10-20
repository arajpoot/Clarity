/**
 * Craft tools Action-only · 20261020CRAFT
 * Tablīgh, Tweet/FB desks, Calligraphy, Tajweed must not creep into
 * Reminder / Reality / Reflection / Notes (Vault).
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_CRAFT_ACTION_ONLY_V1__ === "20261020CRAFT") return;
  g.__CLARITY_CRAFT_ACTION_ONLY_V1__ = "20261020CRAFT";

  var CRAFT_IDS = [
    "meme-card",
    "tweet-desk-card",
    "facebook-desk-card",
    "callig-lab-card",
    "tajweed-live-card",
    "tajweed-path-card",
    "tj-deep-studio"
  ];

  function tab() {
    try {
      return (document.body.getAttribute("data-active-tab") || "").toLowerCase();
    } catch (e) {
      return "";
    }
  }

  function hideEl(el) {
    if (!el) return;
    el.setAttribute("hidden", "");
    el.setAttribute("aria-hidden", "true");
    try {
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("visibility", "hidden", "important");
      el.style.setProperty("height", "0", "important");
      el.style.setProperty("overflow", "hidden", "important");
    } catch (e) {}
  }

  function showEl(el) {
    if (!el) return;
    el.removeAttribute("hidden");
    el.setAttribute("aria-hidden", "false");
    try {
      el.style.removeProperty("display");
      el.style.removeProperty("visibility");
      el.style.removeProperty("height");
      el.style.removeProperty("overflow");
    } catch (e) {}
  }

  function homeAction() {
    var action =
      document.getElementById("rrra-hub-body-action") ||
      document.getElementById("tab-action");
    if (!action) return;
    CRAFT_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (!action.contains(el)) {
        try {
          action.appendChild(el);
        } catch (e) {}
      }
    });
  }

  function enforce() {
    try {
      homeAction();
      var onAction = tab() === "action";
      CRAFT_IDS.forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        if (onAction) showEl(el);
        else hideEl(el);
      });
    } catch (e) {}
  }

  var prev = g.switchTab;
  if (typeof prev === "function") {
    g.switchTab = function () {
      var r = prev.apply(this, arguments);
      setTimeout(enforce, 0);
      setTimeout(enforce, 100);
      setTimeout(enforce, 400);
      return r;
    };
  }

  g.addEventListener("clarity-tab-change", enforce);
  document.addEventListener("DOMContentLoaded", enforce);
  if (document.readyState !== "loading") enforce();
  setTimeout(enforce, 300);
  setTimeout(enforce, 1000);
  setTimeout(enforce, 2500);
  /* defeat late revealDrills / meme-hide */
  setInterval(function () {
    if (tab() !== "action") enforce();
  }, 2000);
})(typeof window !== "undefined" ? window : this);
