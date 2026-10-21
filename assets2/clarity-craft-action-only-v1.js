/**
 * Craft section anchors · 20261020ANCHOR
 * - استوديو التبليغ + Calligraphy + Tweet/FB desks → Action only
 * - Tajweed (live / path / deep) → Reminder only
 * Never on Reality / Reflection / Notes(Vault)
 */
(function (g) {
  "use strict";
  g.__CLARITY_CRAFT_ACTION_ONLY_V1__ = "20261020ANCHOR";

  var ACTION_IDS = [
    "meme-card",
    "tweet-desk-card",
    "facebook-desk-card",
    "callig-lab-card"
  ];
  var REMINDER_IDS = [
    "tajweed-live-card",
    "tajweed-path-card",
    "tj-deep-studio"
  ];
  var ALL = ACTION_IDS.concat(REMINDER_IDS);

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
      el.style.setProperty("pointer-events", "none", "important");
    } catch (e) {}
  }

  function showEl(el) {
    if (!el) return;
    el.removeAttribute("hidden");
    el.setAttribute("aria-hidden", "false");
    try {
      el.style.removeProperty("display");
      el.style.removeProperty("visibility");
      el.style.removeProperty("pointer-events");
    } catch (e) {}
  }

  function moveTo(el, parent) {
    if (!el || !parent) return;
    if (!parent.contains(el)) {
      try {
        parent.appendChild(el);
      } catch (e) {}
    }
  }

  function enforce() {
    try {
      var t = tab();
      var action =
        document.getElementById("rrra-hub-body-action") ||
        document.getElementById("tab-action");
      var reminder =
        document.getElementById("rrra-hub-body-reminder") ||
        document.getElementById("tab-reminder");

      ACTION_IDS.forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        moveTo(el, action);
        if (t === "action") showEl(el);
        else hideEl(el);
      });

      REMINDER_IDS.forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        moveTo(el, reminder);
        if (t === "reminder") showEl(el);
        else hideEl(el);
      });
    } catch (e) {}
  }

  var prev = g.switchTab;
  if (typeof prev === "function") {
    g.switchTab = function () {
      var r = prev.apply(this, arguments);
      setTimeout(enforce, 0);
      setTimeout(enforce, 80);
      setTimeout(enforce, 300);
      return r;
    };
  }
  g.addEventListener("clarity-tab-change", enforce);
  document.addEventListener("DOMContentLoaded", enforce);
  if (document.readyState !== "loading") enforce();
  [200, 600, 1200, 2500].forEach(function (ms) {
    setTimeout(enforce, ms);
  });
  setInterval(enforce, 2500);
})(typeof window !== "undefined" ? window : this);
