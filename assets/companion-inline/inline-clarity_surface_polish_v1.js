(function(){
  "use strict";
  if (window.__CLARITY_SURFACE_POLISH_V2__) return;
  window.__CLARITY_SURFACE_POLISH_V2__ = true;

  var CSS = [
    "/* ===== Banner: equal calendar + salah side cards ===== */",
    "#clarity-top-duo .banner-overlay{",
    "  display:flex!important;flex-direction:row!important;align-items:stretch!important;",
    "  justify-content:space-between!important;gap:0.45rem!important;",
    "  width:100%!important;box-sizing:border-box!important;",
    "  padding:0.4rem 0.45rem!important;}",
    "#clarity-top-duo .banner-side{",
    "  flex:0 0 9.5rem!important;width:9.5rem!important;max-width:22%!important;",
    "  min-width:7.5rem!important;display:flex!important;flex-direction:column!important;",
    "  align-items:stretch!important;justify-content:flex-start!important;}",
    "#clarity-top-duo .banner-side.left,",
    "#clarity-top-duo .banner-side.right{",
    "  flex:0 0 9.5rem!important;width:9.5rem!important;}",
    "#clarity-top-duo .banner-center{",
    "  flex:1 1 auto!important;min-width:0!important;max-width:none!important;",
    "  display:flex!important;flex-direction:column!important;align-items:center!important;",
    "  justify-content:center!important;}",
    "#clarity-top-duo .hijri-cal-section,",
    "#clarity-top-duo .salah-times-section{",
    "  width:100%!important;height:100%!important;min-height:9.5rem!important;",
    "  box-sizing:border-box!important;border-radius:16px!important;",
    "  background:rgba(0,0,0,0.32)!important;",
    "  box-shadow:inset 0 0 0 1px rgba(255,255,255,0.12)!important;",
    "  padding:0.35rem 0.4rem!important;",
    "  display:flex!important;flex-direction:column!important;justify-content:flex-start!important;}",
    "#clarity-top-duo .hijri-cal-section .cal-title,",
    "#clarity-top-duo .salah-times-section .salah-title{",
    "  display:inline-flex!important;align-items:center!important;justify-content:center!important;",
    "  margin:0.1rem auto 0.25rem!important;padding:0.18rem 0.45rem!important;",
    "  border-radius:999px!important;background:rgba(255,255,255,0.14)!important;",
    "  font-size:0.65rem!important;font-weight:700!important;}",
    "#clarity-top-duo .hijri-cal-grid{width:100%!important;}",
    "#clarity-top-duo .salah-times-section table,",
    "#clarity-top-duo .salah-times-section .salah-list{width:100%!important;font-size:0.7rem!important;}",
    "@media(max-width:720px){",
    "  #clarity-top-duo .banner-side{flex:0 0 6.8rem!important;width:6.8rem!important;max-width:28%!important;min-width:5.5rem!important;}",
    "  #clarity-top-duo .hijri-cal-section,#clarity-top-duo .salah-times-section{min-height:7.5rem!important;}",
    "}",
    "/* Live overlay lighter */",
    ".banner:has(.live-active) .banner-overlay,",
    "#clarity-top-duo .banner:has(.live-active) .banner-overlay{",
    "  background:linear-gradient(to bottom,rgba(8,28,22,0.08),rgba(8,28,22,0.18))!important;}",
    "#banner-media.live-active #banner-live,#banner-media.live-active .banner-live{",
    "  opacity:1!important;z-index:4!important;}",
    "/* Brand */",
    "#clarity-top-duo .banner-center h1,#clarity-top-duo .brand-name,.clarity-brand{",
    "  font-family:'Cormorant Garamond',Georgia,serif!important;font-weight:700!important;}",
    "/* ===== Full viewport sections ===== */",
    "html,body{max-width:100%!important;overflow-x:hidden;}",
    ".page-wrapper,#main-content,#main-application-workspace,#clarity-day-landing{",
    "  width:100%!important;max-width:100%!important;box-sizing:border-box!important;}",
    "@media(min-width:901px){",
    "  .page-wrapper,#main-content,#main-application-workspace{",
    "    max-width:none!important;width:100%!important;",
    "    padding-left:1rem!important;padding-right:1rem!important;}",
    "  #main-content .card,#main-application-workspace .card,",
    "  #main-content .rrra-hub-hero,.card{",
    "    width:100%!important;max-width:100%!important;box-sizing:border-box!important;}",
    "}",
    "/* Path doors full width */",
    ".path-to-grave,#clarity-path-doors,.grave-path-doors{",
    "  width:100%!important;max-width:100%!important;box-sizing:border-box!important;}",
    "/* Snappy tabs */",
    ".tab-panel.active{animation:clarityTabIn 0.18s ease both;}",
    "@keyframes clarityTabIn{from{opacity:0.55;transform:translateY(6px)}to{opacity:1;transform:none}}",
    "/* Hide true duplicate day-landing blocks if two painted */",
    "#clarity-day-landing ~ #clarity-day-landing{display:none!important;}"
  ].join("\n");

  function inject(){
    var old = document.getElementById("clarity-surface-polish-css");
    if (old) old.remove();
    var s = document.createElement("style");
    s.id = "clarity-surface-polish-css";
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  /** Remove duplicate dual-tiles / path plaques if shell+landing both left copies */
  function dedupe(){
    try {
      var lands = document.querySelectorAll("#clarity-day-landing");
      for (var i = 1; i < lands.length; i++) lands[i].remove();
      // duplicate "Path to furnish" cards: keep first in main flow
      var paths = document.querySelectorAll(".path-to-grave, #clarity-path-doors, [aria-label*='furnish the grave']");
      if (paths.length > 1) {
        for (var j = 1; j < paths.length; j++) {
          if (paths[j].closest && paths[j].closest("#clarity-day-landing")) continue;
          // only remove exact duplicate siblings
          if (paths[j].parentNode === paths[0].parentNode) paths[j].remove();
        }
      }
    } catch(e){}
  }

  function boot(){ inject(); dedupe(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 30); });
  else setTimeout(boot, 30);
  window.addEventListener("load", function(){ setTimeout(dedupe, 200); });
})();
