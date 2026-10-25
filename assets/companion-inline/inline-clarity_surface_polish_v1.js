/**
 * Clarity surface chrome v6 — fix syntax, site-wide centered tile plaques
 * Educational only — not a fatwa.
 */
(function () {
  "use strict";
  if (window.__CLARITY_SURFACE_POLISH_V6__) return;
  window.__CLARITY_SURFACE_POLISH_V6__ = true;

  var CSS = [
    "html{overflow-x:hidden!important;}",
    "body{margin:0!important;max-width:100%!important;overflow-x:hidden!important;}",

    "/* Equal rails */",
    ".page-wrapper,#main-application-workspace,#main-content,",
    ".container,.content-wrap,.app-shell,.workspace-inner,.rrra-hub,.hub-wrap,.section-wrap{",
    "  width:100%!important;max-width:100%!important;",
    "  margin-left:auto!important;margin-right:auto!important;",
    "  padding-left:max(0.75rem,env(safe-area-inset-left))!important;",
    "  padding-right:max(0.75rem,env(safe-area-inset-right))!important;",
    "  box-sizing:border-box!important;}",
    "@media(min-width:900px){",
    "  .page-wrapper,#main-application-workspace,#main-content{",
    "    padding-left:1.5rem!important;padding-right:1.5rem!important;}",
    "}",
    "@media(min-width:1200px){",
    "  .page-wrapper,#main-application-workspace,#main-content{",
    "    padding-left:2rem!important;padding-right:2rem!important;}",
    "}",

    "/* Main sections → centered flex plaque stack */",
    "#main-content,.tab-panel.active{",
    "  display:flex!important;flex-direction:column!important;align-items:stretch!important;",
    "  gap:0.65rem!important;}",
    "#main-content > .card,#main-content > section,#main-content > article,",
    "#main-application-workspace > .card,.tab-panel > .card,.tab-panel > section,",
    ".rrra-hub-hero,.reminder-hub,.section-card{",
    "  width:100%!important;max-width:100%!important;",
    "  margin-left:auto!important;margin-right:auto!important;",
    "  box-sizing:border-box!important;float:none!important;",
    "  border-radius:16px!important;",
    "  border:1px solid rgba(15,76,58,0.16)!important;",
    "  background:linear-gradient(160deg,rgba(15,76,58,0.07),rgba(15,76,58,0.02))!important;",
    "  padding:0.85rem 1rem!important;",
    "  box-shadow:0 2px 12px rgba(0,0,0,0.06)!important;}",
    "html[data-theme=dark] #main-content > .card,",
    "html[data-theme=dark] .tab-panel > .card,",
    "html[data-theme=dark] .rrra-hub-hero{",
    "  border-color:rgba(212,180,90,0.18)!important;",
    "  background:linear-gradient(160deg,rgba(212,180,90,0.06),rgba(12,28,22,0.55))!important;}",

    "/* Inline module chips as plaque row */",
    ".module-pills,.section-pills,.hub-pills,#main-content .pill-row{",
    "  display:flex!important;flex-wrap:wrap!important;gap:0.4rem!important;",
    "  justify-content:flex-start!important;width:100%!important;}",

    "/* Path strip already handled by path_plaques */",
    "#clarity-grave-path-strip{width:100%!important;margin-left:auto!important;margin-right:auto!important;}",

    "/* Day landing */",
    "#clarity-day-landing{width:100%!important;margin-left:auto!important;margin-right:auto!important;}",
    "#clarity-day-landing .dual-tiles{display:grid!important;grid-template-columns:1fr 1fr!important;gap:0.5rem!important;}",
    "@media(max-width:560px){#clarity-day-landing .dual-tiles{grid-template-columns:1fr!important;}}",
    "#clarity-day-landing .cdl-hero{display:grid!important;gap:0.55rem!important;}",
    "@media(min-width:720px){#clarity-day-landing .cdl-hero{grid-template-columns:1.15fr 1fr 0.9fr!important;}}",
    "#clarity-day-landing .cdl-oath{display:grid!important;gap:0.55rem!important;}",
    "@media(min-width:700px){#clarity-day-landing .cdl-oath{grid-template-columns:1fr 1fr!important;}}",

    "/* Banner balance */",
    "#clarity-top-duo{width:100%!important;margin:0 auto!important;}",
    "#clarity-top-duo .banner-overlay{display:flex!important;align-items:stretch!important;",
    "  justify-content:space-between!important;gap:0.35rem!important;width:100%!important;",
    "  box-sizing:border-box!important;}",
    "#clarity-top-duo .banner-side{flex:0 0 clamp(5.8rem,20vw,10rem)!important;max-width:22%!important;}",
    "#clarity-top-duo .banner-center{flex:1 1 auto!important;min-width:0!important;",
    "  display:flex!important;flex-direction:column!important;align-items:center!important;text-align:center!important;}",

    "/* Shell plaque */",
    "#clarity-reopen-bar{width:100%!important;margin-left:auto!important;margin-right:auto!important;",
    "  display:flex!important;justify-content:center!important;flex-wrap:wrap!important;}",

    "/* Bottom nav */",
    ".bottom-nav,#bottom-nav,.rrra-bottom-nav{width:100%!important;left:0!important;right:0!important;margin:0 auto!important;}",

    "/* Quick access must not block expanders */",
    ".quick-access,button.quick-access,#quick-access,[class*=\"quick-access\"]{z-index:5!important;}",
    "#clarity-day-landing .cdl-expand-card,#clarity-day-landing .cdl-steps{position:relative;z-index:6!important;}",

    "/* Brand + motion */",
    "#clarity-top-duo .banner-center h1,.brand-name{",
    "  font-family:'Cormorant Garamond',Georgia,serif!important;font-weight:700!important;}",
    ".tab-panel.active{animation:clarityTabIn 0.16s ease both;}",
    "@keyframes clarityTabIn{from{opacity:0.55;transform:translateY(5px)}to{opacity:1;transform:none}}",
    "#clarity-day-landing~#clarity-day-landing{display:none!important;}",
    "#main-content .card{float:none!important;}"
  ].join("\n");

  function inject() {
    var old = document.getElementById("clarity-surface-polish-css");
    if (old) old.remove();
    var s = document.createElement("style");
    s.id = "clarity-surface-polish-css";
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function tileize() {
    try {
      var roots = [
        document.getElementById("main-content"),
        document.querySelector(".tab-panel.active")
      ];
      roots.forEach(function (root) {
        if (!root) return;
        root.querySelectorAll(":scope > div, :scope > section").forEach(function (el) {
          if (el.id === "clarity-day-landing") return;
          if (el.classList.contains("bottom-nav")) return;
          if (el.id === "clarity-reopen-bar") return;
          if (!el.classList.contains("card") && el.children && el.children.length) {
            // soft plaque class without fighting layout
            el.classList.add("clarity-soft-plaque");
          }
        });
      });
    } catch (e) {}
  }

  function boot() {
    inject();
    tileize();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 15); });
  } else setTimeout(boot, 15);
  window.addEventListener("load", function () { setTimeout(boot, 120); });
  document.addEventListener("clarity-core-ready", function () { setTimeout(boot, 80); });
})();
