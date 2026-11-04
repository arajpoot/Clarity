/*! companion-core-path-fix-v1 · Phase 0
 * Fixes relative core path on /companion/ (was requesting /companion/assets/core → 404)
 * Campus / daily / amana untouched.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_COMPANION_CORE_PATH_FIX_V1__) return;
  w.__CLARITY_COMPANION_CORE_PATH_FIX_V1__ = true;

  var CORE_ABS = "/assets/clarity-core-block-8.js";
  var CORE_VER = "20261104CF";

  function roomOk() {
    try {
      var p = (w.location && w.location.pathname) || "";
      if (p.indexOf("/campus") === 0 || p.indexOf("/amana") === 0) return false;
      if (p.indexOf("/companion") === 0) return true;
      var r = d.documentElement.getAttribute("data-clarity-room") || "";
      return r === "companion" || r === "";
    } catch (e) {
      return true;
    }
  }

  function stub(name, fn) {
    if (typeof w[name] !== "function") w[name] = fn;
  }

  /* Early stubs so tabs/chips never throw before spine/core */
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
      var tabs = d.querySelectorAll(".tab-panel");
      tabs.forEach(function (t) {
        var on = t.id === "tab-" + id || t.id === id || t.getAttribute("data-rrra-hub") === id;
        t.style.display = on ? "" : "none";
        t.setAttribute("aria-hidden", on ? "false" : "true");
        t.classList.toggle("active", on);
      });
      d.querySelectorAll(".bottom-nav [data-tab], .rrra-bottom-nav [data-tab], [data-rrra-nav]").forEach(function (b) {
        var t = b.getAttribute("data-tab") || b.getAttribute("data-rrra-nav");
        b.classList.toggle("active", t === id);
      });
      try { localStorage.setItem("clarity_active_tab", id); } catch (e) {}
    } catch (e) {}
  });
  stub("memeFetchRrra", function () { return Promise.resolve(null); });
  stub("memeFetchBg", function () { return Promise.resolve(null); });
  stub("clarityPlaySurahFromSelect", function () {});
  stub("claritySetReciter", function () {});
  stub("toggleHaramainLive", function () {});
  stub("toggleQuranStream", function () {});
  stub("resetToGateView", function () {
    try { w.location.href = "/"; } catch (e) {}
  });
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
      s.onerror = function () {
        console.warn("[companion-core-path-fix] core failed", CORE_ABS);
        resolve(false);
      };
      d.head.appendChild(s);
    });
  }

  /* Patch relative CORE string if perf-loader already defined */
  function patchPerfRelative() {
    try {
      if (typeof w.ClarityLoadCore === "function") {
        var _old = w.ClarityLoadCore;
        w.ClarityLoadCore = function () {
          return loadCoreAbs().then(function (ok) {
            if (ok) return true;
            return _old.apply(this, arguments);
          });
        };
      }
    } catch (e) {}
  }

  function boot() {
    if (!roomOk()) return;
    loadCoreAbs().then(function () {
      patchPerfRelative();
    });
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();

  w.ClarityCompanionLoadCoreAbs = loadCoreAbs;
})(window, document);
