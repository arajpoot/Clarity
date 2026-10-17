/**
 * Amana vault focus mode — 20261016FOCUS
 * Hides banner + dual path + track chrome while vault is unlocked.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_AMANA_FOCUS_V1__) return;
  g.__CLARITY_AMANA_FOCUS_V1__ = true;

  var HIDE_IDS = [
    "clarity-top-duo",
    "clarity-dual-path",
    "cw-track-steps",
    "cw-track-kicker",
    "clarity-visit-pill-bar",
    "banner-media"
  ];
  var HIDE_SEL = [
    ".banner",
    ".clarity-dual-path",
    ".dual-tiles",
    "#clarity-dual-path"
  ];
  var saved = {};

  function $(id) {
    try {
      return document.getElementById(id);
    } catch (e) {
      return null;
    }
  }

  function isOpen() {
    var tab = $("tab-notes");
    if (tab && tab.classList.contains("amana-unlocked")) return true;
    try {
      if (g.AmanaVault && typeof g.AmanaVault.isOpen === "function") {
        return !!g.AmanaVault.isOpen();
      }
    } catch (e) {}
    return false;
  }

  function hideEl(el) {
    if (!el || el.__amanaFocusHidden) return;
    el.__amanaFocusHidden = true;
    el.__amanaFocusPrev = el.getAttribute("style") || "";
    el.style.setProperty("display", "none", "important");
    el.style.setProperty("visibility", "hidden", "important");
    el.style.setProperty("height", "0", "important");
    el.style.setProperty("overflow", "hidden", "important");
    el.style.setProperty("margin", "0", "important");
    el.style.setProperty("padding", "0", "important");
  }

  function showEl(el) {
    if (!el || !el.__amanaFocusHidden) return;
    el.__amanaFocusHidden = false;
    var prev = el.__amanaFocusPrev || "";
    if (prev) el.setAttribute("style", prev);
    else el.removeAttribute("style");
    try {
      el.style.removeProperty("display");
      el.style.removeProperty("visibility");
      el.style.removeProperty("height");
    } catch (e) {}
  }

  function apply(on) {
    try {
      document.documentElement.classList.toggle("amana-vault-focus", !!on);
      document.body.classList.toggle("amana-vault-focus", !!on);
    } catch (e) {}
    HIDE_IDS.forEach(function (id) {
      var el = $(id);
      if (!el) return;
      if (on) hideEl(el);
      else showEl(el);
    });
    HIDE_SEL.forEach(function (sel) {
      try {
        document.querySelectorAll(sel).forEach(function (el) {
          if (on) hideEl(el);
          else showEl(el);
        });
      } catch (e) {}
    });
  }

  function sync() {
    apply(isOpen());
  }

  g.clarityAmanaFocusSync = sync;

  /* Observe tab-notes class changes */
  function observe() {
    var tab = $("tab-notes");
    if (!tab || tab.__amanaFocusObs) return;
    tab.__amanaFocusObs = true;
    try {
      var mo = new MutationObserver(function () {
        sync();
      });
      mo.observe(tab, { attributes: true, attributeFilter: ["class"] });
    } catch (e) {}
  }

  function boot() {
    observe();
    sync();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(boot, 50);
      setTimeout(boot, 400);
    });
  } else {
    setTimeout(boot, 50);
    setTimeout(boot, 400);
  }
  g.addEventListener("load", function () {
    setTimeout(boot, 100);
    setTimeout(sync, 800);
  });
  setInterval(sync, 2000);
})(window);
