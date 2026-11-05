(function () {
  "use strict";
  function boot() {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var html = document.documentElement;
      var next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", next);
      try { localStorage.setItem("yawm_theme_v1", next); } catch (e) {}
    });
    try {
      var t = localStorage.getItem("yawm_theme_v1");
      if (t) document.documentElement.setAttribute("data-theme", t);
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
