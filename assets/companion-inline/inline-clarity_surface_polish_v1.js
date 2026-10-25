(function(){
  "use strict";
  if (window.__CLARITY_SURFACE_POLISH_V3__) return;
  window.__CLARITY_SURFACE_POLISH_V3__ = true;

  var CSS = [
    "/* Banner equal side cards */",
    "#clarity-top-duo .banner-overlay{display:flex!important;flex-direction:row!important;align-items:stretch!important;",
    "  justify-content:space-between!important;gap:0.45rem!important;width:100%!important;box-sizing:border-box!important;",
    "  padding:0.4rem 0.45rem!important;}",
    "#clarity-top-duo .banner-side{flex:0 0 9.5rem!important;width:9.5rem!important;max-width:22%!important;min-width:7.5rem!important;",
    "  display:flex!important;flex-direction:column!important;}",
    "#clarity-top-duo .banner-center{flex:1 1 auto!important;min-width:0!important;display:flex!important;flex-direction:column!important;",
    "  align-items:center!important;justify-content:center!important;}",
    "#clarity-top-duo .hijri-cal-section,#clarity-top-duo .salah-times-section{width:100%!important;min-height:9.5rem!important;",
    "  box-sizing:border-box!important;border-radius:16px!important;background:rgba(0,0,0,0.32)!important;",
    "  box-shadow:inset 0 0 0 1px rgba(255,255,255,0.12)!important;padding:0.35rem 0.4rem!important;}",
    "#clarity-top-duo .hijri-cal-section .cal-title,#clarity-top-duo .salah-times-section .salah-title{",
    "  display:inline-flex!important;margin:0.1rem auto 0.25rem!important;padding:0.18rem 0.45rem!important;",
    "  border-radius:999px!important;background:rgba(255,255,255,0.14)!important;font-size:0.65rem!important;font-weight:700!important;}",
    "@media(max-width:720px){#clarity-top-duo .banner-side{flex:0 0 6.8rem!important;width:6.8rem!important;max-width:28%!important;}}",
    ".banner:has(.live-active) .banner-overlay{background:linear-gradient(to bottom,rgba(8,28,22,0.08),rgba(8,28,22,0.18))!important;}",
    "#clarity-top-duo .banner-center h1,#clarity-top-duo .brand-name{font-family:'Cormorant Garamond',Georgia,serif!important;font-weight:700!important;}",

    "/* ===== Main companion: full viewport + centered workspace ===== */",
    "html,body{max-width:100%!important;overflow-x:hidden;}",
    "body{display:block!important;}",
    "#main-application-workspace,.page-wrapper,#main-content{",
    "  width:100%!important;max-width:100%!important;margin-left:auto!important;margin-right:auto!important;",
    "  box-sizing:border-box!important;padding-left:0.85rem!important;padding-right:0.85rem!important;}",
    "@media(min-width:901px){",
    "  #main-application-workspace,.page-wrapper,#main-content{",
    "    width:100%!important;max-width:100%!important;padding-left:1.25rem!important;padding-right:1.25rem!important;}",
    "  #main-content .card,#main-application-workspace .card,.rrra-hub-hero,.card,",
    "  #main-content .tab-panel,.tab-panel{",
    "    width:100%!important;max-width:100%!important;margin-left:auto!important;margin-right:auto!important;",
    "    box-sizing:border-box!important;}",
    "}",
    "/* Kill legacy narrow cages */",
    ".container,.content-wrap,.app-shell,.workspace-inner{",
    "  max-width:none!important;width:100%!important;margin-left:auto!important;margin-right:auto!important;}",
    "#clarity-day-landing,.path-to-grave,#clarity-path-doors{",
    "  width:100%!important;max-width:100%!important;margin-left:auto!important;margin-right:auto!important;box-sizing:border-box!important;}",
    "/* Bottom nav full width centered */",
    ".bottom-nav,#bottom-nav,.rrra-bottom-nav{width:100%!important;max-width:100%!important;left:0!important;right:0!important;}",
    ".tab-panel.active{animation:clarityTabIn 0.18s ease both;}",
    "@keyframes clarityTabIn{from{opacity:0.55;transform:translateY(6px)}to{opacity:1;transform:none}}",
    "#clarity-day-landing~#clarity-day-landing{display:none!important;}"
  ].join("\n");

  function inject(){
    var old=document.getElementById("clarity-surface-polish-css");
    if(old) old.remove();
    var s=document.createElement("style");
    s.id="clarity-surface-polish-css";
    s.textContent=CSS;
    (document.head||document.documentElement).appendChild(s);
  }
  function dedupe(){
    try{
      var lands=document.querySelectorAll("#clarity-day-landing");
      for(var i=1;i<lands.length;i++) lands[i].remove();
    }catch(e){}
  }
  function boot(){ inject(); dedupe(); }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",function(){setTimeout(boot,30);});
  else setTimeout(boot,30);
  window.addEventListener("load",function(){setTimeout(dedupe,200);});
})();
