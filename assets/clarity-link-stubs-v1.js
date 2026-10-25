/**
 * Phase 0 stubs until core-block loads · 20261025
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_LINK_STUBS_V1__ === "20261025") return;
  w.__CLARITY_LINK_STUBS_V1__ = "20261025";

  function stub(name, fn) {
    if (typeof w[name] !== "function") w[name] = fn;
  }

  stub("claritySetThemeMode", function (mode) {
    mode = mode || "system";
    try { localStorage.setItem("clarity_theme_mode", mode); } catch (e) {}
    var resolved = mode;
    if (mode === "system") {
      try {
        resolved = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
      } catch (e) { resolved = "light"; }
    }
    try { document.documentElement.setAttribute("data-theme", resolved); } catch (e) {}
    try {
      document.querySelectorAll("[data-theme-chip]").forEach(function (t) {
        t.classList.toggle("active", t.getAttribute("data-theme-chip") === mode);
      });
    } catch (e) {}
  });

  stub("clarityRefreshSection", function (section) {
    try {
      var el = document.querySelector("#" + (section || ""));
      if (el) el.classList.add("cph-refresh-pulse");
    } catch (e) {}
  });

  stub("notesQuickFromSection", function () {
    try {
      if (typeof w.switchTab === "function") w.switchTab("notes");
      else w.location.hash = "notes";
    } catch (e) {}
  });

  stub("loadCommand", function () {
    try { (w.__clarityCmdQueue = w.__clarityCmdQueue || []).push([]); } catch (e) {}
  });
})(typeof window !== "undefined" ? window : this);
