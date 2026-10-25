/**
 * Clarity surface chrome v5 — site-wide symmetry
 * Equal rails, centered sections, balanced grids. Educational only.
 */
(function () {
  "use strict";
  if (window.__CLARITY_SURFACE_POLISH_V5__) return;
  window.__CLARITY_SURFACE_POLISH_V5__ = true;

  var CSS = [
    "/* ===== Global rails: equal L/R, no drift ===== */",
    "html{overflow-x:hidden!important;}",
    "body{margin:0!important;max-width:100%!important;overflow-x:hidden!important;}",
    "body > *,.page-wrapper,#main-application-workspace{",
    "  box-sizing:border-box!important;}",
    "/* Workspace: full width, equal horizontal padding, content centered as a block */",
    ".page-wrapper,#main-application-workspace,#main-content,",
    ".container,.content-wrap,.app-shell,.workspace-inner,.rrra-hub,.hub-wrap,.section-wrap{",
    "  width:100%!important;max-width:100%!important;",
    "  margin-left:auto!important;margin-right:auto!important;",
    "  padding-left:max(0.75rem, env(safe-area-inset-left))!important;",
    "  padding-right:max(0.75rem, env(safe-area-inset-right))!important;",
    "  box-sizing:border-box!important;}",
    "@media(min-width:900px){",
    "  .page-wrapper,#main-application-workspace,#main-content{",
    "    padding-left:1.5rem!important;padding-right:1.5rem!important;}",
    "}",
    "@media(min-width:1200px){",
    "  .page-wrapper,#main-application-workspace,#main-content{",
    "    padding-left:2rem!important;padding-right:2rem!important;}",
    "}",
    "/* Cards / panels fill the padded rail evenly */",
    "#main-content .card,#main-application-workspace .card,.card,",
    ".tab-panel,.rrra-hub-hero,section.card,article.card{",
    "  width:100%!important;max-width:100%!important;",
    "  margin-left:auto!important;margin-right:auto!important;",
    "  box-sizing:border-box!important;}",
    "/* Path to furnish — centered title + equal door grid */",
    ".path-to-grave,#clarity-path-doors,.grave-path-doors,[class*='path-to-grave']{",
    "  width:100%!important;max-width:100%!important;",
    "  margin-left:auto!important;margin-right:auto!important;",
    "  text-align:center!important;box-sizing:border-box!important;}",
    ".path-to-grave h2,.path-to-grave h3,#clarity-path-doors h2{",
    "  text-align:center!important;margin-left:auto!important;margin-right:auto!important;}",
    ".path-to-grave .doors,.path-doors-grid,.grave-path-doors > div,",
    "#clarity-path-doors .doors-row,.path-to-grave > div:last-child{",
    "  display:grid!important;",
    "  grid-template-columns:repeat(4,minmax(0,1fr))!important;",
    "  gap:0.5rem!important;width:100%!important;",
    "  margin-left:auto!important;margin-right:auto!important;",
    "  text-align:left!important;}",
    "@media(max-width:900px){",
    "  .path-to-grave .doors,.path-doors-grid,.grave-path-doors > div,",
    "  #clarity-path-doors .doors-row,.path-to-grave > div:last-child{",
    "    grid-template-columns:repeat(2,minmax(0,1fr))!important;}",
    "}",
    ".path-to-grave .door,.path-door,.grave-door,a.path-door,button.path-door{",
    "  min-height:0!important;padding:0.55rem 0.65rem!important;border-radius:12px!important;",
    "  text-align:left!important;box-sizing:border-box!important;width:100%!important;}",
    "/* Day landing symmetry */",
    "#clarity-day-landing{width:100%!important;max-width:100%!important;",
    "  margin-left:auto!important;margin-right:auto!important;",
    "  padding-left:0!important;padding-right:0!important;box-sizing:border-box!important;}",
    "#clarity-day-landing .dual-tiles,#clarity-day-landing .cdl-hero,",
    "#clarity-day-landing .cdl-oath,#clarity-day-landing .cdl-light{",
    "  width:100%!important;margin-left:auto!important;margin-right:auto!important;}",
    "#clarity-day-landing .dual-tiles{display:grid!important;grid-template-columns:1fr 1fr!important;gap:0.5rem!important;}",
    "@media(max-width:560px){#clarity-day-landing .dual-tiles{grid-template-columns:1fr!important;}}",
    "#clarity-day-landing .cdl-hero{display:grid!important;gap:0.55rem!important;}",
    "@media(min-width:720px){#clarity-day-landing .cdl-hero{grid-template-columns:1.15fr 1fr 0.9fr!important;}}",
    "#clarity-day-landing .cdl-oath{display:grid!important;gap:0.55rem!important;}",
    "@media(min-width:700px){#clarity-day-landing .cdl-oath{grid-template-columns:1fr 1fr!important;}}",
    "/* Banner balanced sides */",
    "#clarity-top-duo{width:100%!important;max-width:100%!important;margin:0 auto!important;}",
    "#clarity-top-duo .banner-overlay{display:flex!important;align-items:stretch!important;",
    "  justify-content:space-between!important;gap:0.35rem!important;width:100%!important;",
    "  box-sizing:border-box!important;padding:0.3rem 0.35rem!important;}",
    "#clarity-top-duo .banner-side{flex:0 0 clamp(5.8rem,20vw,10rem)!important;",
    "  width:clamp(5.8rem,20vw,10rem)!important;max-width:22%!important;}",
    "#clarity-top-duo .banner-side.left,#clarity-top-duo .banner-side.right{",
    "  flex-basis:clamp(5.8rem,20vw,10rem)!important;}",
    "#clarity-top-duo .banner-center{flex:1 1 auto!important;min-width:0!important;",
    "  display:flex!important;flex-direction:column!important;align-items:center!important;",
    "  justify-content:center!important;text-align:center!important;}",
    "/* Shell plaque centered */",
    "#clarity-reopen-bar{width:100%!important;max-width:100%!important;",
    "  margin-left:auto!important;margin-right:auto!important;",
    "  display:flex!important;justify-content:center!important;flex-wrap:wrap!important;}",
    "/* Bottom nav full & centered */",
    ".bottom-nav,#bottom-nav,.rrra-bottom-nav{",
    "  width:100%!important;max-width:100%!important;left:0!important;right:0!important;",
    "  margin:0 auto!important;box-sizing:border-box!important;}",
    ".bottom-nav .nav-inner,.rrra-bottom-nav > div{",
    "  display:flex!important;justify-content:center!important;align-items:center!important;",
    "  width:100%!important;max-width:100%!important;margin:0 auto!important;}",
    "/* Reminder / RRRA section headers centered when alone */",
    "#main-content > h2,#main-content > .section-title,.rrra-section-title{",
    "  text-align:center!important;}",
    "/* Brand */",
    "#clarity-top-duo .banner-center h1,.brand-name,.clarity-brand{",
    "  font-family:'Cormorant Garamond',Georgia,serif!important;font-weight:700!important;}",
    ".banner:has(.live-active) .banner-overlay{",
    "  background:linear-gradient(to bottom,rgba(8,28,22,0.08),rgba(8,28,22,0.18))!important;}",
    ".tab-panel.active{animation:clarityTabIn 0.16s ease both;}",
    "@keyframes clarityTabIn{from{opacity:0.55;transform:translateY(5px)}to{opacity:1;transform:none}}",
    "#clarity-day-landing~#clarity-day-landing{display:none!important;}",
    "/* Neutralize legacy float / absolute that break symmetry */",
    "#main-content .card{float:none!important;}",
    ".path-to-grave .door{float:none!important;}"
  ].join("\n");

  function inject() {
    var old = document.getElementById("clarity-surface-polish-css");
    if (old) old.remove();
    var s = document.createElement("style");
    s.id = "clarity-surface-polish-css";
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function boot() { inject(); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 15); });
  } else setTimeout(boot, 15);
  window.addEventListener("load", function () { setTimeout(inject, 100); });
})();
