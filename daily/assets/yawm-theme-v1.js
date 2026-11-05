/*! yawm-theme-v1 · self-contained fallback
 * Educational only — not a fatwa. Used if daily.js load order differs.
 */
(function () {
  "use strict";
  var KEY = "clarity.daily.theme.v1";
  function apply(t) {
    try {
      document.documentElement.setAttribute("data-theme", t === "light" ? "light" : "dark");
      localStorage.setItem(KEY, t === "light" ? "light" : "dark");
    } catch (e) {}
  }
  try {
    var saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") apply(saved);
  } catch (e) {}
  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("theme-toggle");
    if (!btn || btn.__yawmThemeBound) return;
    btn.__yawmThemeBound = true;
    btn.addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme") || "dark";
      apply(cur === "dark" ? "light" : "dark");
    });
  });
})();
