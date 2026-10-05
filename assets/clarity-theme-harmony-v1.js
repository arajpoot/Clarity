/**
 * Clarity Theme Harmony v1
 * One theme attribute, one token set. Palette presets (day/night/…)
 * write CSS variables; data-theme stays light|dark only.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_THEME_HARMONY_V1__) return;
  g.__CLARITY_THEME_HARMONY_V1__ = true;

  var HARMONY_PRESETS = {
    day:   { bg:"#f6f1e7", text:"#1c2a22", card:"#fffdf8", accent:"#0d4f3c", gold:"#b8922a", sky:"#2a5f7a" },
    night: { bg:"#0c1410", text:"#e7efe9", card:"#152019", accent:"#3d9b78", gold:"#d4b45a", sky:"#6a9fb5" },
    soft:  { bg:"#f4f0ea", text:"#2a322c", card:"#faf8f4", accent:"#2a6b52", gold:"#c4a04a", sky:"#4a7a90" },
    high:  { bg:"#ffffff", text:"#111111", card:"#ffffff", accent:"#004d33", gold:"#8a6a00", sky:"#003366" },
    oasis: { bg:"#eef6f1", text:"#0b3d2e", card:"#f7fbf8", accent:"#0b5c45", gold:"#b8922a", sky:"#2a5f7a" }
  };

  function applyTokens(o) {
    if (!o) return;
    var r = document.documentElement;
    var map = {
      bg: "--bg",
      text: "--text",
      card: "--card-bg",
      accent: "--accent",
      gold: "--gold",
      sky: "--sky"
    };
    Object.keys(map).forEach(function (k) {
      if (o[k]) r.style.setProperty(map[k], o[k]);
    });
    if (o.card) r.style.setProperty("--bg-elevated", o.card);
    if (o.accent) {
      r.style.setProperty("--banner", o.accent);
      r.style.setProperty("--accent-light", o.accent);
    }
  }

  function setThemeAttr(mode) {
    var resolved = mode;
    if (mode === "system") {
      try {
        resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      } catch (e) {
        resolved = "light";
      }
    }
    if (mode === "night") resolved = "dark";
    if (mode === "day" || mode === "soft" || mode === "high" || mode === "oasis") resolved = "light";
    if (resolved !== "dark" && resolved !== "light") resolved = "light";
    document.documentElement.setAttribute("data-theme", resolved);
    try {
      document.body && document.body.setAttribute("data-theme", resolved);
    } catch (e2) {}
    return resolved;
  }

  /** Public: prefer this over ad-hoc night/day setters */
  g.clarityHarmonyTheme = function (name) {
    name = String(name || "day").toLowerCase();
    var preset = HARMONY_PRESETS[name];
    var mode = name === "night" ? "dark" : name === "system" ? "system" : "light";
    if (name === "dark") { mode = "dark"; preset = HARMONY_PRESETS.night; }
    if (name === "light") { mode = "light"; preset = HARMONY_PRESETS.day; }
    try {
      localStorage.setItem("clarity_theme_mode", mode === "system" ? "system" : mode);
      if (preset) localStorage.setItem("clarity_harmony_preset", name);
    } catch (e) {}
    setThemeAttr(mode === "system" ? "system" : mode);
    if (preset) applyTokens(preset);
    // Keep chip UI in sync
    try {
      document.querySelectorAll("[data-theme-chip]").forEach(function (btn) {
        var chip = btn.getAttribute("data-theme-chip");
        btn.classList.toggle("active", chip === mode || chip === name);
      });
      document.querySelectorAll(".pm-preset").forEach(function (btn) {
        btn.classList.toggle("on", btn.getAttribute("data-pm") === name);
      });
    } catch (e3) {}
    return { mode: mode, preset: name };
  };

  // Wrap existing setters so they don't fight
  function wrapExisting() {
    if (typeof g.claritySetThemeMode === "function" && !g.claritySetThemeMode.__harmony) {
      var prev = g.claritySetThemeMode;
      g.claritySetThemeMode = function (mode) {
        mode = mode || "system";
        if (mode === "dark") return g.clarityHarmonyTheme("night");
        if (mode === "light") return g.clarityHarmonyTheme("day");
        var r = prev.apply(this, arguments);
        setThemeAttr(mode);
        return r;
      };
      g.claritySetThemeMode.__harmony = true;
    }
    // Palette manager preset
    if (typeof g.pmApplyPreset === "function" && !g.pmApplyPreset.__harmony) {
      var prevPm = g.pmApplyPreset;
      g.pmApplyPreset = function (name) {
        try { prevPm.apply(this, arguments); } catch (e) {}
        g.clarityHarmonyTheme(name);
      };
      g.pmApplyPreset.__harmony = true;
    }
  }

  function boot() {
    wrapExisting();
    var mode = "system";
    var preset = null;
    try {
      mode = localStorage.getItem("clarity_theme_mode") || "system";
      preset = localStorage.getItem("clarity_harmony_preset");
    } catch (e) {}
    if (preset && HARMONY_PRESETS[preset]) {
      g.clarityHarmonyTheme(preset);
    } else if (mode === "dark" || mode === "night") {
      g.clarityHarmonyTheme("night");
    } else if (mode === "light" || mode === "day") {
      g.clarityHarmonyTheme("day");
    } else {
      setThemeAttr("system");
    }
    setTimeout(wrapExisting, 400);
    setTimeout(wrapExisting, 1200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  g.addEventListener("load", function () { setTimeout(boot, 150); });
})(typeof window !== "undefined" ? window : this);
