/*! companion-integrity-v1 · Slim-2 integrity · educational only */
(function(w,d){
  "use strict";
  if(w.__COMPANION_INTEGRITY_V1__) return;
  w.__COMPANION_INTEGRITY_V1__=true;
  function mount(){ return d.getElementById("cs-mount"); }
  function tick(){
    var m=mount(); if(!m) return;
    m.querySelectorAll("[id$='-card'],section.cs-plaque:not([data-cs-path-only]),.dl-card,.cs-rich-legacy-wrap").forEach(function(el){
      if(el.hasAttribute("data-cs-path-only")) return;
      el.style.setProperty("display","block","important");
      el.style.setProperty("visibility","visible","important");
      el.style.setProperty("opacity","1","important");
      el.removeAttribute("hidden");
      el.classList.remove("cpp-path-hidden","is-path-hidden","arch-hidden","nuros-deferred","is-filtered-out");
    });
    m.querySelectorAll(".arch-level-shelf").forEach(function(s){
      s.classList.remove("is-filtered-out","is-empty","is-collapsed");
      s.style.setProperty("display","block","important");
    });
    try{
      if(w.ClarityPathGovernanceShell && w.ClarityPathGovernanceShell.apply){
        w.ClarityPathGovernanceShell.apply();
      }
    }catch(e){}
  }
  function boot(){
    tick();
    var m=mount();
    if(m){
      var t=null;
      new MutationObserver(function(){ if(t) clearTimeout(t); t=setTimeout(tick,25); }).observe(m,{childList:true,subtree:true});
    }
    d.addEventListener("click", function(){ setTimeout(tick,20); }, true);
    var i=0, iv=setInterval(function(){ tick(); if(++i>30) clearInterval(iv); }, 200);
  }
  if(d.readyState==="loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.ClarityCompanionIntegrity={tick:tick,version:"Slim1"};
})(window,document);
