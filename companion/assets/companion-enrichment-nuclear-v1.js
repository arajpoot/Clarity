/*! companion-enrichment-nuclear-v1 · anti-thin · educational only */
(function(w,d){
  "use strict";
  if(w.__COMPANION_ENRICHMENT_NUCLEAR_V1__) return;
  w.__COMPANION_ENRICHMENT_NUCLEAR_V1__=true;
  function root(){ return d.getElementById("cs-mount"); }
  function showAllCards(){
    var m=root(); if(!m) return;
    m.querySelectorAll("[id$='-card'], section.cs-plaque:not([data-cs-path-only]), .cs-plaque[data-cs-primary], .cs-rich-legacy-wrap, .cs-rich-legacy, [data-rrra]").forEach(function(el){
      if(el.hasAttribute("data-cs-path-only")) return;
      el.style.setProperty("display","block","important");
      el.style.setProperty("visibility","visible","important");
      el.style.setProperty("opacity","1","important");
      el.style.setProperty("max-height","none","important");
      el.removeAttribute("hidden");
      el.classList.remove("cpp-path-hidden","is-path-hidden","arch-hidden");
    });
  }
  function pathKey(){
    try{
      var b=d.querySelector("[data-cs-path].is-active, button[data-cs-path].active, .cs-path .is-active");
      if(b) return b.getAttribute("data-cs-path")||"dai";
    }catch(e){}
    try{ return localStorage.getItem("cu_companion_path_v1")||"dai"; }catch(e2){}
    return "dai";
  }
  function filterPathOnly(){
    var m=root(); if(!m) return;
    var p=pathKey(); if(p==="daily") p="practicing";
    m.querySelectorAll("[data-cs-path-only]").forEach(function(el){
      var want=el.getAttribute("data-cs-path-only");
      var ok=want===p||(p==="practicing"&&want==="daily");
      el.style.setProperty("display", ok?"block":"none", "important");
      if(ok) el.removeAttribute("hidden");
    });
  }
  function apply(){ showAllCards(); filterPathOnly(); }
  function patch(){
    try{
      var G=w.ClarityPathGovernanceShell;
      if(G && !G.__nuclear && typeof G.applyPathGovernance==="function"){
        var o=G.applyPathGovernance.bind(G);
        G.applyPathGovernance=function(){
          var r=o.apply(this,arguments);
          setTimeout(apply,0); setTimeout(apply,40); setTimeout(apply,200);
          return r;
        };
        G.__nuclear=true;
      }
    }catch(e){}
  }
  function boot(){
    patch(); apply();
    var m=root();
    if(m){
      var t=null;
      new MutationObserver(function(){
        if(t) clearTimeout(t);
        t=setTimeout(function(){ patch(); apply(); }, 40);
      }).observe(m,{childList:true});
    }
    [0,50,120,300,600,1000,2000,4000].forEach(function(ms){
      setTimeout(function(){ patch(); apply(); }, ms);
    });
  }
  if(d.readyState==="loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.ClarityEnrichmentNuclear={apply:apply,showAllCards:showAllCards};
})(window,document);
