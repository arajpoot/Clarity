/*! companion-path-curriculum-v1 · multi path-only tokens · educational only */
(function(w,d){
  "use strict";
  w.__COMPANION_PATH_CURRICULUM_V1__=true;
  var FOCUS={
    seeker:{reminder:"One command-verse. Read · pause · one small act.",reality:"See the path of those who returned.",reflection:"Tawbah begins with honesty before Allah.",action:"One small deed that matches what you read.",notes:"Write one line you will act on.",about:"Clarity is a companion — not a fatwa desk."},
    new_muslim:{reminder:"Stability first — Names and short commands.",reality:"Pillars before volume.",reflection:"Learn with mercy toward yourself.",action:"Build salah and tongue habits gently.",notes:"Note one pillar practice today.",about:"Ask a local teacher for rulings."},
    practicing:{reminder:"Consistency — one Name, one command lived.",reality:"Weekly review of character and craft.",reflection:"Deepen without spectacle.",action:"Craft · tajweed · deed ledger.",notes:"Ledger one deed.",about:"Return anytime on this device."},
    dai:{reminder:"Choose a verse to share with source and adab.",reality:"Critical study · seerah mirror.",reflection:"Transmit only what you practice.",action:"Tools serve the message — not the ego.",notes:"Draft with sources.",about:"Educational companion only."}
  };
  function norm(p){p=String(p||"dai").toLowerCase().replace(/\s+/g,"_");if(p==="daily"||p==="daily_muslim")return"practicing";if(p==="new"||p==="newmuslim")return"new_muslim";return p;}
  function path(){try{var b=d.querySelector("[data-cs-path].is-active");if(b)return norm(b.getAttribute("data-cs-path"));}catch(e){}try{return norm(localStorage.getItem("cu_companion_path_v1")||"dai");}catch(e2){}return"dai";}
  function tab(){try{var b=d.querySelector(".cs-door button.is-active,[data-rail-tab].is-active");if(b)return b.getAttribute("data-rail-tab")||"reminder";}catch(e){}return"reminder";}
  function paint(){
    var p=path(), t=tab();
    var msg=(FOCUS[p]&&FOCUS[p][t])||"One sincere step is enough today.";
    var el=d.getElementById("cs-focus-msg"); if(el) el.textContent=msg;
    var pl=d.getElementById("cs-focus-path"); if(pl) pl.textContent=p.replace("_"," ")+" · "+t;
    var m=d.getElementById("cs-mount"); if(!m) return;
    m.querySelectorAll("[data-cs-path-only]").forEach(function(node){
      var raw=(node.getAttribute("data-cs-path-only")||"").toLowerCase().replace(/,/g," ");
      var tokens=raw.split(/\s+/).filter(Boolean).map(norm);
      var ok=tokens.indexOf(p)>=0||tokens.indexOf("all")>=0||(p==="practicing"&&tokens.indexOf("daily")>=0);
      if(ok){ node.style.setProperty("display","block","important"); node.removeAttribute("hidden"); }
      else { node.style.setProperty("display","none","important"); node.setAttribute("hidden",""); }
    });
    try{ if(w.ClarityMemeStudio) w.ClarityMemeStudio.gate(); }catch(e){}
  }
  function boot(){
    paint();
    d.addEventListener("click",function(){ setTimeout(paint,30); setTimeout(paint,120); },true);
    var m=d.getElementById("cs-mount");
    if(m){ var t=null; new MutationObserver(function(){ if(t)clearTimeout(t); t=setTimeout(paint,40); }).observe(m,{childList:true}); }
  }
  if(d.readyState==="loading") d.addEventListener("DOMContentLoaded",boot); else boot();
})(window,document);
