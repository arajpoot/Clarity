/*! companion-path-soft-v1 · P16 honest · never exclusive-hide cards */
(function(w,d){
  "use strict";
  if(w.__COMPANION_PATH_SOFT_P16__) return;
  w.__COMPANION_PATH_SOFT_P16__=true;
  function restore(){
    var root=d.getElementById("cs-mount"); if(!root) return;
    root.querySelectorAll("[id$='-card'], section.cs-plaque:not([data-cs-path-only])").forEach(function(el){
      el.style.removeProperty("display");
      el.removeAttribute("hidden");
      el.classList.remove("cpp-path-hidden");
    });
  }
  function boot(){
    restore();
    var G=w.ClarityPathGovernanceShell;
    if(G && typeof G.apply==="function" && !G.__softP16){
      var prev=G.apply;
      G.apply=function(){ var r=prev.apply(this,arguments); restore(); return r; };
      G.__softP16=true;
    }
    var m=d.getElementById("cs-mount");
    if(m){ var t=null; new MutationObserver(function(){ if(t) clearTimeout(t); t=setTimeout(restore,40); }).observe(m,{childList:true}); }
    [0,100,400,1000].forEach(function(ms){ setTimeout(restore,ms); });
  }
  if(d.readyState==="loading") d.addEventListener("DOMContentLoaded", boot); else boot();
})(window,document);
