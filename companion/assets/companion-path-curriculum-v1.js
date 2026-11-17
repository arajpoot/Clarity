/*! companion-path-curriculum-v1 · P31 enrich · tips only · educational only */
(function(w,d){
  "use strict";
  w.__COMPANION_PATH_CURRICULUM_V1__=true;
  var FOCUS={
    seeker:{reminder:"One command-verse. Read · pause · one small act.",reality:"See the path of those who returned.",reflection:"Tawbah begins with honesty before Allah.",action:"One small deed that matches what you read.",notes:"Write one line you will act on.",about:"Clarity is a companion — not a fatwa desk."},
    new_muslim:{reminder:"Stability first — Names and short commands.",reality:"Pillars before volume.",reflection:"Learn with mercy toward yourself.",action:"Build salah and tongue habits gently.",notes:"Note one pillar practice today.",about:"Ask a local teacher for rulings."},
    practicing:{reminder:"Consistency — one Name, one command lived. Full modules stay open.",reality:"Weekly review · character and craft. Full shelf visible.",reflection:"Deepen without spectacle.",action:"Craft · tajweed · deed ledger — full tools.",notes:"Ledger one deed.",about:"Return anytime on this device."},
    dai:{reminder:"Share with source and adab. Full Reminder shelf open.",reality:"Critical study · seerah mirror — full modules.",reflection:"Transmit only what you practice.",action:"Tools serve the message — full Action shelf.",notes:"Draft with sources.",about:"Educational companion only."}
  };
  var CRAFT_IDS={ "meme-card":1, "callig-lab-card":1, "tweet-desk-card":1 };
  function norm(p){p=String(p||"dai").toLowerCase().replace(/\s+/g,"_");if(p==="daily"||p==="daily_muslim")return"practicing";if(p==="new"||p==="newmuslim")return"new_muslim";return p;}
  function path(){try{var b=d.querySelector("[data-cs-path].is-active");if(b)return norm(b.getAttribute("data-cs-path"));}catch(e){}try{return norm(localStorage.getItem("cu_companion_path_v1")||"dai");}catch(e2){}return"dai";}
  function tab(){try{var b=d.querySelector(".cs-door button.is-active,[data-rail-tab].is-active");if(b)return b.getAttribute("data-rail-tab")||"reminder";}catch(e){}return"reminder";}
  function show(el){if(!el)return;el.style.removeProperty("display");el.style.setProperty("display","block","important");el.removeAttribute("hidden");el.classList.remove("cpp-path-hidden");}
  function hide(el){if(!el)return;el.style.setProperty("display","none","important");el.setAttribute("hidden","");}
  function paint(){
    var p=path(), t=tab();
    var msg=(FOCUS[p]&&FOCUS[p][t])||"One sincere step is enough today.";
    var el=d.getElementById("cs-focus-msg"); if(el) el.textContent=msg;
    var pl=d.getElementById("cs-focus-path"); if(pl) pl.textContent=p.replace("_"," ")+" · "+t;
    var m=d.getElementById("cs-mount"); if(!m) return;

    /* 1) Always show educational primary cards */
    m.querySelectorAll("[id$='-card']").forEach(function(node){
      var id=node.id||"";
      if(CRAFT_IDS[id]) return; /* craft gated below */
      show(node);
    });

    /* 2) Path tip plaques only (not primary cards) */
    m.querySelectorAll("[data-cs-path-only]").forEach(function(node){
      var id=node.id||"";
      if(id && id.indexOf("-card")>0 && !CRAFT_IDS[id]){
        /* primary card accidentally marked — keep visible */
        show(node); return;
      }
      if(CRAFT_IDS[id]) return;
      var raw=(node.getAttribute("data-cs-path-only")||"").toLowerCase().replace(/,/g," ");
      var tokens=raw.split(/\s+/).filter(Boolean).map(norm);
      var ok=tokens.indexOf(p)>=0||tokens.indexOf("all")>=0;
      if(ok) show(node); else hide(node);
    });

    /* 3) Craft: Daily + Daʿī only */
    var craftOk=p==="practicing"||p==="dai";
    Object.keys(CRAFT_IDS).forEach(function(id){
      var node=d.getElementById(id); if(!node) return;
      if(craftOk) show(node); else hide(node);
    });
    try{ if(w.ClarityMemeStudio&&w.ClarityMemeStudio.gate) w.ClarityMemeStudio.gate(); }catch(e){}
  }
  function boot(){
    paint();
    d.addEventListener("click",function(){ setTimeout(paint,25); setTimeout(paint,120); },true);
    var m=d.getElementById("cs-mount");
    if(m){ var t=null; new MutationObserver(function(){ if(t)clearTimeout(t); t=setTimeout(paint,35); }).observe(m,{childList:true,subtree:true}); }
  }
  if(d.readyState==="loading") d.addEventListener("DOMContentLoaded",boot); else boot();
})(window,document);
