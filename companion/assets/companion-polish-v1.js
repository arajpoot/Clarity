/*! companion-polish-v1 · P27 · path SVG · empty states · educational only */
(function(w,d){
  "use strict";
  if(w.__COMPANION_POLISH_V1__) return;
  w.__COMPANION_POLISH_V1__=true;

  var SVG={
    seeker:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><circle cx="12" cy="12" r="4"/></svg>',
    new_muslim:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V10l8-6 8 6v10"/><path d="M9 20v-6h6v6"/></svg>',
    practicing:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10"/><path d="M16 16l2 2 4-4"/></svg>',
    dai:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3z"/></svg>',
    reminder:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l1.2 3.5L17 8l-3.5 1.2L12 13l-1.2-3.8L7 8l3.8-1.5L12 3z"/><path d="M5 19h14"/></svg>',
    reality:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/></svg>',
    reflection:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4c-4 2-6 5-6 8a6 6 0 0012 0c0-3-2-6-6-8z"/></svg>',
    action:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h10"/><path d="M12 5l7 7-7 7"/></svg>',
    notes:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h9l3 3v13H6z"/><path d="M9 12h6M9 16h4"/></svg>',
    about:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 10v6M12 7h.01"/></svg>'
  };

  function pathIcons(){
    d.querySelectorAll(".cs-path-grid [data-cs-path]").forEach(function(btn){
      var p=(btn.getAttribute("data-cs-path")||"").toLowerCase();
      var key=p;
      if(p.indexOf("new")>=0) key="new_muslim";
      else if(p.indexOf("practic")>=0||p==="daily") key="practicing";
      else if(p.indexOf("dai")>=0) key="dai";
      else key="seeker";
      var ico=btn.querySelector(".cs-path-ico");
      if(!ico){ ico=d.createElement("span"); ico.className="cs-path-ico"; btn.insertBefore(ico, btn.firstChild); }
      if(SVG[key]) ico.innerHTML=SVG[key];
    });
  }

  function doorIcons(){
    d.querySelectorAll(".cs-door [data-rail-tab]").forEach(function(btn){
      var t=btn.getAttribute("data-rail-tab")||"";
      var ico=btn.querySelector(".dr-ico");
      if(!ico) return;
      if(SVG[t]) ico.innerHTML=SVG[t];
    });
  }

  function emptyStates(root){
    root=root||d.getElementById("cs-mount");
    if(!root) return;
    root.querySelectorAll("[data-engine], .live-ayah, .hadith-spark, #hadith, [id*='ayah']").forEach(function(el){
      if(el.getAttribute("data-cs-empty-bound")) return;
      el.setAttribute("data-cs-empty-bound","1");
      var text=(el.textContent||"").replace(/\s+/g," ").trim();
      if(text.length<8 || /loading/i.test(text)){
        if(!el.querySelector(".cs-engine-empty")){
          var box=d.createElement("div");
          box.className="cs-engine-empty";
          box.innerHTML="<strong>Educational source</strong>Tap refresh or open the verified link. Content loads from allowed educational APIs when available.";
          el.appendChild(box);
        }
      }
    });
    /* soft Loading… */
    root.querySelectorAll("*").forEach(function(n){
      if(n.childNodes.length===1 && n.childNodes[0].nodeType===3){
        var t=(n.textContent||"").trim();
        if(t==="Loading..."||t==="Loading…"){
          n.textContent="Fetching from allowed educational sources…";
          n.classList.add("cs-loading-soft");
        }
      }
    });
  }

  function plaqueIcons(root){
    root=root||d.getElementById("cs-mount");
    if(!root) return;
    root.querySelectorAll("[id$='-card'], section.cs-plaque").forEach(function(sec){
      if(sec.querySelector(".cs-plaque-head, .cs-ico, .cs-plaque-ico")) return;
      var h=sec.querySelector("h1,h2,h3");
      if(!h) return;
      var head=d.createElement("div");
      head.className="cs-plaque-head";
      var ico=d.createElement("span");
      ico.className="cs-plaque-ico";
      ico.setAttribute("aria-hidden","true");
      ico.textContent="◆";
      head.appendChild(ico);
      try{ sec.insertBefore(head, sec.firstChild); }catch(e){}
    });
  }

  function setActiveTab(){
    try{
      var b=d.querySelector(".cs-door button.is-active, [data-rail-tab].is-active");
      if(b){ var t=b.getAttribute("data-rail-tab"); if(t) d.body.setAttribute("data-active-tab", t); }
    }catch(e){}
  }
  function tick(){ setActiveTab();
    pathIcons();
    doorIcons();
    emptyStates();
    plaqueIcons();
  }

  function boot(){
    tick();
    var m=d.getElementById("cs-mount");
    if(m){
      var t=null;
      new MutationObserver(function(){ if(t) clearTimeout(t); t=setTimeout(tick,40); }).observe(m,{childList:true,subtree:true});
    }
    d.addEventListener("click", function(){ setTimeout(tick,30); }, true);
  }
  if(d.readyState==="loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window,document);
