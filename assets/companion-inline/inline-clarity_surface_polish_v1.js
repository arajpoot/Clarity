(function(){
  "use strict";
  if (window.__CLARITY_SURFACE_POLISH_V1__) return;
  window.__CLARITY_SURFACE_POLISH_V1__ = true;

  var CSS = [
    "/* Live overlay lighter */",
    ".banner:has(.live-active) .banner-overlay,",
    "#clarity-top-duo .banner:has(.live-active) .banner-overlay {",
    "  background:linear-gradient(to bottom,rgba(8,28,22,0.08),rgba(8,28,22,0.18))!important; }",
    "#banner-media.live-active #banner-live, #banner-media.live-active .banner-live {",
    "  opacity:1!important; z-index:4!important; }",
    "/* Circular cal/salah title pills */",
    ".hijri-cal-section .cal-title, .salah-times-section .salah-title {",
    "  display:inline-flex!important; align-items:center; justify-content:center;",
    "  padding:0.2rem 0.5rem!important; border-radius:999px!important;",
    "  background:rgba(255,255,255,0.14)!important; font-size:0.65rem!important; }",
    ".hijri-cal-grid .day.today { border-radius:50%!important; background:rgba(255,255,255,0.4)!important; }",
    "/* Brand */",
    "#clarity-top-duo .banner-center h1, #clarity-top-duo .brand-name, .clarity-brand {",
    "  font-family:'Cormorant Garamond',Georgia,serif!important; font-weight:700!important; }",
    "/* Desktop full width */",
    "@media (min-width:901px){",
    "  .page-wrapper, #main-content, #main-application-workspace { max-width:none!important; width:100%!important;",
    "    padding-left:0.85rem!important; padding-right:0.85rem!important; }",
    "}",
    "/* Snappy tabs */",
    ".tab-panel.active { animation:clarityTabIn 0.18s ease both; }",
    "@keyframes clarityTabIn { from{opacity:0.55;transform:translateY(6px)} to{opacity:1;transform:none} }"
  ].join("\n");

  function inject(){
    if (document.getElementById("clarity-surface-polish-css")) return;
    var s = document.createElement("style");
    s.id = "clarity-surface-polish-css";
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", inject);
  else inject();
})();
