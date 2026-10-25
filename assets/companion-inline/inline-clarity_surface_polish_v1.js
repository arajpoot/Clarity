(function(){
  "use strict";
  if (window.__CLARITY_SURFACE_POLISH_V4__) return;
  window.__CLARITY_SURFACE_POLISH_V4__ = true;

  var CSS = [
    "/* Kill competing max-width / center cages */",
    "html,body{max-width:100%!important;overflow-x:hidden!important;}",
    ".page-wrapper,#main-application-workspace,#main-content,.container,.content-wrap,.app-shell,.workspace-inner,",
    ".rrra-hub,.hub-wrap,.section-wrap{",
    "  width:100%!important;max-width:100%!important;margin-left:0!important;margin-right:0!important;",
    "  box-sizing:border-box!important;}",
    "@media(min-width:901px){",
    "  #main-content,#main-application-workspace,.page-wrapper{",
    "    padding-left:1rem!important;padding-right:1rem!important;}",
    "  #main-content .card,#main-application-workspace .card,.card,.tab-panel,.rrra-hub-hero{",
    "    width:100%!important;max-width:100%!important;margin-left:0!important;margin-right:0!important;",
    "    box-sizing:border-box!important;}",
    "}",
    "/* Path doors — rectangular, use width, less vertical waste */",
    ".path-to-grave,#clarity-path-doors,.grave-path-doors,",
    "[class*='path-to-grave'],.path-doors-grid{",
    "  width:100%!important;max-width:100%!important;box-sizing:border-box!important;}",
    ".path-to-grave .doors,.path-doors-grid,.grave-path-doors > div,",
    "#clarity-path-doors .doors-row{",
    "  display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;",
    "  gap:0.45rem!important;width:100%!important;}",
    "@media(max-width:800px){",
    "  .path-to-grave .doors,.path-doors-grid,.grave-path-doors > div,#clarity-path-doors .doors-row{",
    "    grid-template-columns:repeat(2,minmax(0,1fr))!important;}",
    "}",
    ".path-to-grave .door,.path-door,.grave-door,a.path-door,button.path-door,",
    ".path-to-grave [class*='door']{",
    "  min-height:0!important;height:auto!important;padding:0.55rem 0.6rem!important;",
    "  border-radius:12px!important;display:flex!important;flex-direction:column!important;",
    "  justify-content:flex-start!important;box-sizing:border-box!important;}",
    "/* Dual path tiles rectangular */",
    "#clarity-day-landing .dual-tiles{display:grid!important;grid-template-columns:1fr 1fr!important;gap:0.45rem!important;}",
    "@media(max-width:560px){#clarity-day-landing .dual-tiles{grid-template-columns:1fr!important;}}",
    "#clarity-day-landing .dual-tile{padding:0.55rem 0.7rem!important;border-radius:12px!important;}",
    "#clarity-day-landing .dual-ico{font-size:1.1rem!important;margin-bottom:0.1rem!important;}",
    "/* Banner brand */",
    "#clarity-top-duo .banner-center h1,.brand-name{font-family:'Cormorant Garamond',Georgia,serif!important;font-weight:700!important;}",
    ".banner:has(.live-active) .banner-overlay{background:linear-gradient(to bottom,rgba(8,28,22,0.08),rgba(8,28,22,0.18))!important;}",
    ".tab-panel.active{animation:clarityTabIn 0.16s ease both;}",
    "@keyframes clarityTabIn{from{opacity:0.55;transform:translateY(5px)}to{opacity:1;transform:none}}",
    "#clarity-day-landing~#clarity-day-landing{display:none!important;}",
    ".bottom-nav,#bottom-nav,.rrra-bottom-nav{width:100%!important;left:0!important;right:0!important;}"
  ].join("\n");

  function inject(){
    var old=document.getElementById("clarity-surface-polish-css");
    if(old) old.remove();
    var s=document.createElement("style");
    s.id="clarity-surface-polish-css";
    s.textContent=CSS;
    (document.head||document.documentElement).appendChild(s);
  }
  function boot(){ inject(); }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",function(){setTimeout(boot,20);});
  else setTimeout(boot,20);
})();
