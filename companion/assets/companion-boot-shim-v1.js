/*! companion-boot-shim-v1 · Phase C
 * Cleaned from inline-96908bb2ed Phase 0 shim.
 * Does NOT set window.ALLOW (path-progress + governance own it).
 * Early theme + queue stubs only. Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_BOOT_SHIM_V1__) return;
  w.__COMPANION_BOOT_SHIM_V1__ = true;

  /* Theme chips — real core may replace */
  if (typeof w.claritySetThemeMode !== "function") {
    w.claritySetThemeMode = function (mode) {
      mode = mode || "system";
      try { localStorage.setItem("clarity_theme_mode", mode); } catch (e) {}
      var resolved = mode;
      if (mode === "system") {
        try {
          resolved =
            w.matchMedia && w.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light";
        } catch (e) {
          resolved = "light";
        }
      }
      try {
        d.documentElement.setAttribute("data-theme", resolved);
        d.documentElement.setAttribute("data-theme-mode", mode);
      } catch (e) {}
      try {
        d.querySelectorAll("[data-theme-chip]").forEach(function (t) {
          t.classList.toggle("active", t.getAttribute("data-theme-chip") === mode);
        });
      } catch (e) {}
    };
  }

  if (typeof w.clarityWelcomePickTrack !== "function") {
    w.clarityWelcomePickTrack = function () {};
  }
  if (typeof w.clarityWelcomeSkipToName !== "function") {
    w.clarityWelcomeSkipToName = function () {};
  }
  if (typeof w.loadCommand !== "function") {
    w.loadCommand = function () {
      try {
        (w.__clarityCmdQueue = w.__clarityCmdQueue || []).push([]);
      } catch (e) {}
    };
  }
  if (typeof w.memeFetchRrra !== "function") {
    w.memeFetchRrra = function () {
      try {
        (w.__clarityMemeQueue = w.__clarityMemeQueue || []).push(["rrra"]);
      } catch (e) {}
    };
  }
  if (typeof w.memeFetchBg !== "function") {
    w.memeFetchBg = function (kind) {
      try {
        (w.__clarityMemeQueue = w.__clarityMemeQueue || []).push(["bg", kind]);
      } catch (e) {}
    };
  }
  /* Surah/reciter: prefer banner-controls if already defined */
  if (typeof w.clarityPlaySurahFromSelect !== "function") {
    w.clarityPlaySurahFromSelect = function (sel) {
      try {
        (w.__claritySurahQueue = w.__claritySurahQueue || []).push(sel && sel.value);
      } catch (e) {}
    };
  }
  if (typeof w.claritySetReciter !== "function") {
    w.claritySetReciter = function (code) {
      try {
        localStorage.setItem("clarity_reciter", code || "afs");
      } catch (e) {}
    };
  }
})(window, document);
