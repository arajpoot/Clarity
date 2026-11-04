/*! companion-core-path-fix-v1 · Phase 0 (dedupe-safe)
 * Absolute core path for /companion/. Skips if spine-dedupe owns load.
 * Campus untouched.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_COMPANION_CORE_PATH_FIX_V1__) return;
  w.__CLARITY_COMPANION_CORE_PATH_FIX_V1__ = true;

  var CORE_ABS = "/assets/clarity-core-block-8.js";
  var CORE_VER = "20261104DD";

  function roomOk() {
    try {
      var p = (w.location && w.location.pathname) || "";
      if (p.indexOf("/campus") === 0 || p.indexOf("/amana") === 0) return false;
      return p.indexOf("/companion") === 0 || d.documentElement.getAttribute("data-clarity-room") === "companion";
    } catch (e) { return true; }
  }

  function stub(name, fn) {
    if (typeof w[name] !== "function") w[name] = fn;
  }

  stub("claritySetThemeMode", function (mode) {
    try {
      mode = String(mode || "system").toLowerCase();
      if (mode === "night") mode = "dark";
      if (mode === "day") mode = "light";
      if (mode === "system") {
        var dark = w.matchMedia && w.matchMedia("(prefers-color-scheme: dark)").matches;
        mode = dark ? "dark" : "light";
      }
      d.documentElement.setAttribute("data-theme", mode);
      try { localStorage.setItem("clarity_theme_mode", mode); } catch (e) {}
    } catch (e) {}
  });
  stub("switchTab", function (id) {
    try {
      id = String(id || "reminder").replace(/^tab-/, "");
      d.querySelectorAll(".tab-panel").forEach(function (t) {
        var on = t.id === "tab-" + id || t.getAttribute("data-rrra-hub") === id;
        t.style.display = on ? "block" : "none";
        t.setAttribute("aria-hidden", on ? "false" : "true");
        t.classList.toggle("active", on);
      });
    } catch (e) {}
  });
  stub("memeFetchRrra", function () { return Promise.resolve(null); });
  stub("memeFetchBg", function () { return Promise.resolve(null); });
  stub("clarityPlaySurahFromSelect", function () {});
  stub("claritySetReciter", function () {});
  stub("toggleHaramainLive", function () {});
  stub("toggleQuranStream", function () {});
  stub("resetToGateView", function () { try { w.location.href = "/"; } catch (e) {} });
  stub("clarityPickPrimaryDoor", function (door) {
    try {
      if (door === "today") w.location.href = "/daily/";
      else if (door === "learn") w.location.href = "/campus/";
      else if (door === "prepare") w.location.href = "/amana/";
      else w.location.href = "/";
    } catch (e) {}
  });

  function loadCoreAbs() {
    if (w.__CLARITY_CORE_ABS_LOADED__) return Promise.resolve(true);
    if (d.querySelector('script[data-clarity-core-abs="1"]')) {
      w.__CLARITY_CORE_ABS_LOADED__ = true;
      return Promise.resolve(true);
    }
    /* spine-dedupe will load core — avoid race double-insert */
    if (w.__CLARITY_SPINE_DEDUPE_V1__) return Promise.resolve(true);
    return new Promise(function (resolve) {
      var s = d.createElement("script");
      s.src = CORE_ABS + "?v=" + CORE_VER;
      s.async = false;
      s.setAttribute("data-clarity-core-abs", "1");
      s.onload = function () {
        w.__CLARITY_CORE_ABS_LOADED__ = true;
        try { d.dispatchEvent(new CustomEvent("clarity-core-ready")); } catch (e) {}
        resolve(true);
      };
      s.onerror = function () { resolve(false); };
      d.head.appendChild(s);
    });
  }

  function boot() {
    if (!roomOk()) return;
    /* If dedupe present, it owns core load */
    if (w.__CLARITY_SPINE_DEDUPE_V1__) return;
    loadCoreAbs();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.ClarityCompanionLoadCoreAbs = loadCoreAbs;
})(window, document);
