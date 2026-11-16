/*! companion-enrichment-nuclear-v2 · educational only */
(function(w,d){
  "use strict";
  if(w.__COMPANION_ENRICHMENT_NUCLEAR_V2__) return;
  w.__COMPANION_ENRICHMENT_NUCLEAR_V2__=true;
  function root(){ return d.getElementById("cs-mount"); }
  function showAllCards(){
    var m=root(); if(!m) return;
    m.querySelectorAll("[id$='-card'], section.cs-plaque:not([data-cs-path-only]), .cs-plaque[data-cs-primary], .cs-rich-legacy-wrap, .cs-rich-legacy").forEach(function(el){
      if(el.hasAttribute("data-cs-path-only")) return;
      el.style.setProperty("display","block","important");
      el.style.setProperty("visibility","visible","important");
      el.style.setProperty("opacity","1","important");
      el.style.setProperty("max-height","none","important");
      el.removeAttribute("hidden");
      el.classList.remove("cpp-path-hidden","is-path-hidden","arch-hidden");
    });
  }
  function norm(p){
    p=String(p||"dai").toLowerCase().replace(/\s+/g,"_");
    if(p==="daily"||p==="daily_muslim"||p==="practicing") return "practicing";
    if(p==="new"||p==="newmuslim"||p==="new_muslim") return "new_muslim";
    if(p==="seek"||p==="seeker") return "seeker";
    if(p.indexOf("dai")===0||p.indexOf("da")===0&&p.length<=4) return "dai";
    return p;
  }
  function pathKey(){
    try{
      var b=d.querySelector("[data-cs-path].is-active, button[data-cs-path].active, .cs-path .is-active, [data-cs-path][aria-pressed='true']");
      if(b) return norm(b.getAttribute("data-cs-path"));
    }catch(e){}
    try{ return norm(localStorage.getItem("cu_companion_path_v1")||"dai"); }catch(e2){}
    return "dai";
  }
  function filterPathOnly(){
    var m=root(); if(!m) return;
    var p=pathKey();
    m.querySelectorAll("[data-cs-path-only]").forEach(function(el){
      var want=norm(el.getAttribute("data-cs-path-only")||"");
      var ok=want===p;
      el.style.setProperty("display", ok?"block":"none", "important");
      if(ok) el.removeAttribute("hidden"); else el.setAttribute("hidden","hidden");
    });
  }
  function dedupeArch(){
    var m=root(); if(!m) return;
    /* protect enriched */
    m.querySelectorAll("[data-higher-arch='1']").forEach(function(el){
      el.style.setProperty("display","block","important");
      el.removeAttribute("hidden");
    });
    /* shallow only: Higher arch without .cs-arch-blurb */
    m.querySelectorAll("section, .cs-plaque").forEach(function(sec){
      if(sec.getAttribute("data-higher-arch")==="1") return;
      if(sec.querySelector && sec.querySelector(".cs-arch-blurb")) return;
      var t=sec.textContent||"";
      if(t.indexOf("Higher arch")>=0 && t.indexOf("L1")>=0 && t.indexOf("L6")>=0 && t.indexOf("Foundation")>=0){
        if(t.indexOf("salah spine")>=0 || t.indexOf("Fard before volume")>=0) return;
        sec.style.setProperty("display","none","important");
        sec.setAttribute("data-arch-counts-only","1");
      }
    });
  }
  function apply(){ showAllCards(); filterPathOnly(); dedupeArch(); }
  function patch(){
    try{
      var G=w.ClarityPathGovernanceShell;
      if(G && !G.__nuclear2 && typeof G.applyPathGovernance==="function"){
        var o=G.applyPathGovernance.bind(G);
        G.applyPathGovernance=function(){
          var r=o.apply(this,arguments);
          setTimeout(apply,0); setTimeout(apply,40); setTimeout(apply,200);
          return r;
        };
        G.__nuclear2=true;
      }
    }catch(e){}
  }
  function boot(){
    patch(); apply();
    var m=root();
    if(m){
      var t=null;
      new MutationObserver(function(){ if(t) clearTimeout(t); t=setTimeout(function(){patch();apply();},40); }).observe(m,{childList:true,subtree:true});
    }
    d.addEventListener("click", function(){ setTimeout(apply,30); setTimeout(apply,150); }, true);
    [0,50,150,400,900,2000,4000].forEach(function(ms){ setTimeout(function(){patch();apply();},ms); });
  }
  if(d.readyState==="loading") d.addEventListener("DOMContentLoaded", boot); else boot();
  w.ClarityEnrichmentNuclear={apply:apply};
})(window,document);
