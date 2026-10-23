/* 20261023HK2 */
/* 20261023CLEAN cleanse */
/**
 * University theme · 20261017HARM
 * Single control: data-cu-theme = light | dark | system
 * Storage: cu_uni_theme_v1
 */
(function () {
  "use strict";
  var KEY = "cu_uni_theme_v1";
  function resolved(t) {
    if (t === "day") t = "light";
    if (t === "night") t = "dark";
    if (t === "auto") t = "system";
    if (t === "system") {
      try {
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      } catch (e) { return "light"; }
    }
    return t === "dark" ? "dark" : "light";
  }
  function apply(pref) {
    pref = pref || "system";
    if (pref === "day") pref = "light";
    if (pref === "night") pref = "dark";
    if (pref === "auto") pref = "system";
    var t = resolved(pref);
    document.documentElement.setAttribute("data-theme", t);
    document.documentElement.setAttribute("data-theme-pref", pref);
    try {
      document.documentElement.style.colorScheme = t === "dark" ? "dark" : "light";
    } catch (e) {}
    try { localStorage.setItem(KEY, pref); } catch (e) {}
    document.querySelectorAll("[data-cu-theme]").forEach(function (btn) {
      var v = btn.getAttribute("data-cu-theme") || "";
      btn.setAttribute("aria-pressed", v === pref || (pref === "system" && (v === "system" || v === "auto")) ? "true" : "false");
    });
  }
  function boot() {
    var t = "system";
    try { t = localStorage.getItem(KEY) || "system"; } catch (e) {}
    apply(t);
    document.querySelectorAll("[data-cu-theme]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        apply(btn.getAttribute("data-cu-theme") || "system");
      });
    });
    try {
      if (window.matchMedia) {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
          var cur = "system";
          try { cur = localStorage.getItem(KEY) || "system"; } catch (e) {}
          if (cur === "system" || cur === "auto") apply("system");
        });
      }
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
