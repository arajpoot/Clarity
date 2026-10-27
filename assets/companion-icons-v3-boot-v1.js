/* companion-icons-v3-boot-v1.js · 20261026FIX
 * Ensure NurOS icon CSS is active and re-apply icons after paint.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_ICONS_V3_BOOT__) return;
  g.__CLARITY_ICONS_V3_BOOT__ = true;

  function ensureCss() {
    var hrefs = [
      "/assets/css/nuros-icons-v1.css",
      "/assets/css/nuros-icons-v3.css"
    ];
    hrefs.forEach(function (href) {
      var ok = false;
      document.querySelectorAll('link[rel="stylesheet"]').forEach(function (l) {
        if ((l.getAttribute("href") || "").indexOf(href.split("/").pop()) >= 0) ok = true;
      });
      if (ok) return;
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href + "?v=20261026FIX";
      document.head.appendChild(link);
    });
  }

  function reapply() {
    try {
      if (typeof g.nurosIconsApply === "function") g.nurosIconsApply();
      if (typeof g.__NUROS_ICONS_APPLY__ === "function") g.__NUROS_ICONS_APPLY__();
    } catch (e) {}
    /* trigger Mutation by touching body class */
    try {
      document.documentElement.classList.add("nuros-icons-on");
      document.body.classList.add("nuros-icons-ready");
    } catch (e) {}
  }

  function boot() {
    ensureCss();
    reapply();
    setTimeout(reapply, 400);
    setTimeout(reapply, 1200);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("load", function () { setTimeout(reapply, 200); });
})(typeof window !== "undefined" ? window : this);
