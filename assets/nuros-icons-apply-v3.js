/**
 * NurOS v3 Shariah apply · Phase 0–2
 */
(function(g){
  "use strict";
  if(g.__NUROS_ICONS_V3_SITE__)return;
  g.__NUROS_ICONS_V3_SITE__=true;g.__NUROS_ICONS_V3__=true;
  g.__NUROS_ICONS_APPLY_V2__=true;g.__NUROS_ICONS_V2__=true;

  var RULES=[
    {re:/reminder/i,icon:"reminder"},{re:/reality/i,icon:"reality"},
    {re:/reflection/i,icon:"reflection"},{re:/action/i,icon:"action"},
    {re:/vault|am[aā]nah|notes? registry|heir/i,icon:"vault"},
    {re:/companion/i,icon:"companion"},{re:/university|campus/i,icon:"campus"},
    {re:/adhk|dhikr|tasb/i,icon:"tasbih"},{re:/do this today|today\b/i,icon:"today"},
    {re:/ṣalāh|salah|prayer|next ṣ/i,icon:"salah"},
    {re:/qur|command|verse|sami/i,icon:"quran"},{re:/scroll|believers/i,icon:"scroll"},
    {re:/seerah|s[iī]rah/i,icon:"seerah"},{re:/pedigree|family tree|nasab/i,icon:"tree"},
    {re:/tajweed|recit|tarateel/i,icon:"tajweed"},{re:/listen|audio/i,icon:"audio"},
    {re:/tweet|tabl[iī]gh|share/i,icon:"tabligh"},{re:/callig|pen/i,icon:"callig"},
    {re:/meme|studio/i,icon:"meme"},{re:/print|legacy pack|print vault/i,icon:"print"},
    {re:/search/i,icon:"search"},{re:/protect|shield|ḥi[sṣ]n|core protection/i,icon:"shield"},
    {re:/character|adab/i,icon:"character"},{re:/kaaba|ḥaram|makkah/i,icon:"kaaba"},
    {re:/du[aā]|supplicat/i,icon:"dua"},{re:/path|journey|seeker|gate mode/i,icon:"path"},
    {re:/legacy|wasiyy/i,icon:"legacy"},{re:/reward|long stay|grave/i,icon:"star"},
    {re:/water|wu[dḍ]/i,icon:"water"},{re:/seed|charity|ṣadaqah/i,icon:"seed"}
  ];

  function make(name,sm){
    var el=document.createElement("span");
    el.className="nuros-icon nuros-icon-"+name+(sm?" sm":"");
    el.setAttribute("aria-hidden","true");
    return el;
  }
  function stripEmoji(el){
    if(!el)return;
    var child=el.firstChild,g2=0;
    while(child&&g2++<10){
      if(child.nodeType===1){
        var cls=(child.className||"").toString();
        if(cls.indexOf("nuros-")>=0)break;
        var t=(child.textContent||"").trim();
        if((child.tagName==="SPAN"||child.tagName==="I")&&(t.length<=3||/[\u{1F300}-\u{1FAFF}]/u.test(t))){
          var n=child.nextSibling;try{child.parentNode.removeChild(child);}catch(e){}
          child=n;continue;
        }
        break;
      }
      if(child.nodeType===3){
        child.textContent=(child.textContent||"").replace(/^[\s\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\uFE0F\u200D⌂🏠🎓📚🕌🌙✦◉☾➤🔒🌱🛡️📜📖🌳👨👩👧👦]+/u,"");
        break;
      }
      break;
    }
  }
  function pick(text){
    text=String(text||"");
    for(var i=0;i<RULES.length;i++) if(RULES[i].re.test(text)) return RULES[i].icon;
    return null;
  }
  function decorate(el,name,force){
    if(!el||!name)return;
    if(!force&&el.getAttribute("data-nuros-iconized")==="1")return;
    el.querySelectorAll(":scope > .nuros-icon").forEach(function(n){try{n.parentNode.removeChild(n);}catch(e){}});
    stripEmoji(el);
    var sm=el.closest&&el.closest("#clarity-door-rail,.door-rail-btn");
    el.insertBefore(make(name,!!sm),el.firstChild);
    el.setAttribute("data-nuros-iconized","1");
  }

  /* Phase 0: strip human emoji from pedigree / family tree */
  function stripHumanEmoji(){
    try{
      var re=/[\u{1F466}-\u{1F478}\u{1F9D1}-\u{1F9DF}\u{1F46A}-\u{1F46D}👨👩👧👦]/gu;
      document.querySelectorAll("#uft-root, .uft-tree, .pedigree, [class*='pedigree'], [class*='uft'], [id*='uft']").forEach(function(root){
        root.querySelectorAll("*").forEach(function(el){
          if(el.childElementCount===0 && re.test(el.textContent||"")){
            el.textContent=(el.textContent||"").replace(re,"");
          }
        });
        // text nodes
        var w=document.createTreeWalker(root, NodeFilter.SHOW_TEXT,null);
        var n; while(n=w.nextNode()){ if(re.test(n.nodeValue||"")) n.nodeValue=(n.nodeValue||"").replace(re,""); }
      });
    }catch(e){}
  }

  function boot(){
    try{
      document.querySelectorAll("#clarity-door-rail button,.door-rail-btn").forEach(function(btn){
        var label=(btn.getAttribute("data-tab")||btn.getAttribute("aria-label")||btn.textContent||"").trim();
        var ic=pick(label); if(ic) decorate(btn,ic,true);
      });
      document.querySelectorAll(".dual-tile,[id*='dual-path']").forEach(function(tile){
        var ic=pick(tile.textContent||""); if(ic) decorate(tile,ic,true);
      });
      document.querySelectorAll(".rrra-hub>h2,.tab-panel>h2,.card>h2,.card>h3,.cdl-card h2,.cdl-card h3,.section-head").forEach(function(h){
        if((h.textContent||"").length>90)return;
        var ic=pick(h.textContent||""); if(ic) decorate(h,ic,false);
      });
      document.querySelectorAll("button,a.chip").forEach(function(el){
        var t=(el.textContent||"").trim();
        if(t.length<3||t.length>40)return;
        if(/legacy pack|print vault|gate mode/i.test(t)){
          var ic=pick(t); if(ic&&!el.querySelector(".nuros-icon")) decorate(el,ic,false);
        }
      });
      stripHumanEmoji();
    }catch(e){}
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot);
  else boot();
  [300,900,1800,3200].forEach(function(ms){setTimeout(boot,ms);});
  document.addEventListener("clarity:companion-ready",boot);
})(typeof window!=="undefined"?window:this);


/* Restore: force dual-path campus icon + path strip visibility */
(function(g){
  "use strict";
  if(g.__CLARITY_RESTORE_UI_V1__) return;
  g.__CLARITY_RESTORE_UI_V1__ = true;

  function forceCampusIcon(){
    try{
      var tiles = document.querySelectorAll(".dual-tile, [id*='dual-path'], [class*='dual-path']");
      tiles.forEach(function(tile){
        var t = (tile.textContent||"").toLowerCase();
        if(!/university|campus/.test(t)) return;
        // remove wrong icons
        tile.querySelectorAll(":scope > .nuros-icon").forEach(function(n){
          if(!/nuros-icon-campus/.test(n.className)) try{n.parentNode.removeChild(n);}catch(e){}
        });
        if(!tile.querySelector(".nuros-icon-campus")){
          var el = document.createElement("span");
          el.className = "nuros-icon nuros-icon-campus";
          el.setAttribute("aria-hidden","true");
          tile.insertBefore(el, tile.firstChild);
          tile.setAttribute("data-nuros-iconized","1");
        }
      });
    }catch(e){}
  }

  function restorePathTracker(){
    try{
      // Show grave path strip (4 path tiles)
      var sels = [
        "#clarity-grave-path-strip",
        ".grave-path-strip",
        ".path-to-grave",
        "#clarity-path-rail",
        ".gps-phases",
        ".path-doors-grid"
      ];
      sels.forEach(function(sel){
        document.querySelectorAll(sel).forEach(function(el){
          el.style.setProperty("display", sel.indexOf("phases")>=0 || sel.indexOf("grid")>=0 ? "grid" : "block", "important");
          el.style.setProperty("visibility", "visible", "important");
          el.style.setProperty("opacity", "1", "important");
          el.hidden = false;
          el.removeAttribute("hidden");
        });
      });
      // Gate switcher: keep as secondary if strip missing
      var strip = document.querySelector("#clarity-grave-path-strip, .grave-path-strip, .path-to-grave");
      var gate = document.querySelector(".clarity-gate-switcher");
      if(gate){
        if(strip && strip.offsetParent !== null && (strip.querySelectorAll(".gps-phase, .door, [data-gate]").length >= 3)){
          // strip works — hide redundant TRACK bar
          gate.style.setProperty("display","none","important");
        } else {
          // restore TRACK 4 buttons
          gate.style.setProperty("display","flex","important");
          gate.style.setProperty("visibility","visible","important");
          gate.style.setProperty("opacity","1","important");
          gate.hidden = false;
        }
      }
      // companion mode: path tracker must show under hubs intro
      if(document.documentElement.getAttribute("data-shell-mode")==="companion"){
        if(strip){
          strip.style.setProperty("display","block","important");
        }
      }
    }catch(e){}
  }

  function hardenBanner(){
    try{
      var b = document.querySelector("#banner-media, .banner-media, #clarity-final-banner-controls-v2, [data-banner]");
      if(!b) b = document.querySelector(".banner, #banner");
      if(!b) return;
      b.style.setProperty("contain","layout paint style");
      b.style.setProperty("min-height", b.style.minHeight || "180px");
      // prevent opacity thrash
      var media = document.querySelector("#banner-media, #banner-live, #banner-img");
      if(media){
        media.style.setProperty("transition","opacity 0.25s ease");
      }
      // single still/live toggle: mark ready
      document.documentElement.setAttribute("data-banner-hardened","1");
    }catch(e){}
  }

  // Reduce banner script fighting: throttle live label updates
  var _lastBannerTick = 0;
  function throttleBanner(){
    var now = Date.now();
    if(now - _lastBannerTick < 800) return false;
    _lastBannerTick = now;
    return true;
  }
  g.__clarityBannerThrottle = throttleBanner;

  function boot(){
    forceCampusIcon();
    restorePathTracker();
    hardenBanner();
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  [200,600,1200,2000,3500].forEach(function(ms){ setTimeout(boot, ms); });
  document.addEventListener("clarity:companion-ready", boot);
  // On shell mode change
  var obs = new MutationObserver(function(){ boot(); });
  try{ obs.observe(document.documentElement, {attributes:true, attributeFilter:["data-shell-mode"]}); }catch(e){}
})(typeof window!=="undefined"?window:this);
