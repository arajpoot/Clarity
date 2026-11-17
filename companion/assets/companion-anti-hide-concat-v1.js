/*! companion-anti-hide-concat-v1.js · P18 · single repair for all hide scripts · educational only
 * Concat logic: patch governance, arch-ladder filter, hygiene, sustained showCards.
 */
(function(w,d){
  "use strict";
  if(w.__COMPANION_ANTI_HIDE_CONCAT_P18__) return;
  w.__COMPANION_ANTI_HIDE_CONCAT_P18__=true;

  function mount(){ return d.getElementById("cs-mount"); }

  function showCards(){
    var m=mount(); if(!m) return 0;
    var n=0;
    m.querySelectorAll("[id$='-card'], section.cs-plaque:not([data-cs-path-only]), .cs-plaque[data-cs-primary], .dl-card, .cs-rich-legacy-wrap").forEach(function(el){
      if(el.hasAttribute("data-cs-path-only")) return;
      try{
        el.style.setProperty("display","block","important");
        el.style.setProperty("visibility","visible","important");
        el.style.setProperty("opacity","1","important");
        el.removeAttribute("hidden");
        el.classList.remove("cpp-path-hidden","is-path-hidden","arch-hidden","nuros-deferred","is-filtered-out","is-empty");
        n++;
      }catch(e){}
    });
    /* open all arch shelves */
    m.querySelectorAll(".arch-level-shelf").forEach(function(s){
      s.classList.remove("is-filtered-out","is-empty","is-collapsed");
      s.style.setProperty("display","block","important");
      var body=s.querySelector(".arch-shelf-body");
      if(body){ body.style.setProperty("display","block","important"); body.style.setProperty("max-height","none","important"); }
    });
    return n;
  }

  function pathOnly(){
    var m=mount(); if(!m) return;
    var p="dai";
    try{
      var b=d.querySelector("[data-cs-path].is-active, button[data-cs-path].active");
      if(b) p=(b.getAttribute("data-cs-path")||"dai").toLowerCase().replace(/\s+/g,"_");
    }catch(e){}
    if(p==="daily") p="practicing";
    m.querySelectorAll("[data-cs-path-only]").forEach(function(el){
      var w=(el.getAttribute("data-cs-path-only")||"").toLowerCase().replace(/\s+/g,"_");
      var ok=w===p||w==="all"||(p==="practicing"&&w==="daily");
      if(ok){ el.style.setProperty("display","block","important"); el.removeAttribute("hidden"); }
      else { el.style.setProperty("display","none","important"); el.setAttribute("hidden",""); }
    });
  }

  function tick(){ showCards(); pathOnly(); }

  function patchGov(){
    var G=w.ClarityPathGovernanceShell;
    if(!G) return;
    G.apply=function(){ tick(); };
    G.applyPathGovernance=G.apply;
    G.honest=true;
    try{ G.allow={}; }catch(e){}
  }

  function patchLadder(){
    /* force All levels: remove filter from shelves */
    var m=mount(); if(!m) return;
    m.querySelectorAll(".arch-chip").forEach(function(c){
      if((c.textContent||"").toLowerCase().indexOf("all")>=0) c.classList.add("is-active");
    });
    m.querySelectorAll(".arch-level-shelf").forEach(function(s){
      s.classList.remove("is-filtered-out","is-empty","is-collapsed");
    });
    /* if ladder exposes run/align, wrap after */
    try{
      if(w.ClarityArchLadder && typeof w.ClarityArchLadder.run==="function" && !w.ClarityArchLadder.__antiHide){
        var prev=w.ClarityArchLadder.run;
        w.ClarityArchLadder.run=function(){
          var r=prev.apply(this,arguments);
          setTimeout(tick,20);
          return r;
        };
        w.ClarityArchLadder.__antiHide=true;
      }
    }catch(e){}
  }

  function boot(){
    patchGov();
    patchLadder();
    tick();
    var m=mount();
    if(m){
      var t=null;
      new MutationObserver(function(){
        if(t) clearTimeout(t);
        t=setTimeout(function(){ patchGov(); patchLadder(); tick(); },25);
      }).observe(m,{childList:true,subtree:true});
    }
    d.addEventListener("click",function(){ setTimeout(tick,15); setTimeout(tick,100); },true);
    var i=0;
    var iv=setInterval(function(){ tick(); patchGov(); if(++i>50) clearInterval(iv); },150);
  }

  if(d.readyState==="loading") d.addEventListener("DOMContentLoaded",boot);
  else boot();
  w.ClarityAntiHideConcat={tick:tick,showCards:showCards,version:"P18"};
})(window,document);
