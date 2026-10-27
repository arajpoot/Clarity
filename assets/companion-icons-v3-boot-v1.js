/* companion-icons-v3-boot-v1.js · 20261026FIX2 */
(function (g) {
  "use strict";
  if (g.__CLARITY_ICONS_V3_BOOT_V2__) return;
  g.__CLARITY_ICONS_V3_BOOT_V2__ = true;
  function ensureCss() {
    ["/assets/css/nuros-icons-v1.css", "/assets/css/nuros-icons-v3.css", "/assets/css/companion-track-tiles-restore-v1.css"].forEach(function (href) {
      var name = href.split("/").pop();
      var found = false;
      document.querySelectorAll('link[rel="stylesheet"]').forEach(function (l) {
        if ((l.href || "").indexOf(name) >= 0) found = true;
      });
      if (found) return;
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href + "?v=20261026FIX2";
      document.head.appendChild(link);
    });
  }
  function reapply() {
    ensureCss();
    try { if (typeof g.nurosIconsApply === "function") g.nurosIconsApply(); } catch (e) {}
  }
  function boot() { reapply(); setTimeout(reapply, 400); setTimeout(reapply, 1500); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("load", function () { setTimeout(reapply, 300); });
})(typeof window !== "undefined" ? window : this);
