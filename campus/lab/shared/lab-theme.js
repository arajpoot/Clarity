/**
 * Lab surface theme · 20261024CAMP2
 * Day / Night / System — local only, key cu_lab_theme_v1
 */
(function (g) {
  "use strict";
  var KEY = "cu_lab_theme_v1";
  function apply(theme) {
    theme = theme || "system";
    var root = document.documentElement;
    if (theme === "system") {
      var dark = g.matchMedia && g.matchMedia("(prefers-color-scheme: dark)").matches;
      root.setAttribute("data-theme", dark ? "dark" : "light");
    } else {
      root.setAttribute("data-theme", theme);
    }
    document.querySelectorAll("[data-lab-theme]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-lab-theme") === theme ? "true" : "false");
    });
  }
  function boot() {
    var saved = "system";
    try { saved = localStorage.getItem(KEY) || "system"; } catch (e) {}
    apply(saved);
    document.querySelectorAll("[data-lab-theme]").forEach(function (b) {
      b.addEventListener("click", function () {
        var t = b.getAttribute("data-lab-theme") || "system";
        try { localStorage.setItem(KEY, t); } catch (e) {}
        apply(t);
      });
    });
    try {
      if (g.matchMedia) {
        g.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
          var cur = "system";
          try { cur = localStorage.getItem(KEY) || "system"; } catch (e) {}
          if (cur === "system") apply("system");
        });
      }
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window);
