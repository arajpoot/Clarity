/**
 * Clarity University U7 shell · 20261022U7
 * Theme restore only. Companion untouched.
 */
(function () {
  "use strict";
  try {
    var t = localStorage.getItem("clarity_uni_theme");
    if (t === "light" || t === "dark") {
      document.documentElement.setAttribute("data-theme", t);
    }
  } catch (e) {}
  window.cuUniSetTheme = function (mode) {
    try {
      document.documentElement.setAttribute("data-theme", mode);
      localStorage.setItem("clarity_uni_theme", mode);
    } catch (e2) {}
  };
})();
