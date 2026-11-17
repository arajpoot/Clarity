/*! companion-meme-studio-v1 · wire + path gate daily/dai · educational only */
(function(w,d){
  "use strict";
  if(w.__COMPANION_MEME_STUDIO_V1__) return;
  w.__COMPANION_MEME_STUDIO_V1__=true;

  var loaded=false;
  function path(){
    try{
      var b=d.querySelector("[data-cs-path].is-active");
      if(b) return (b.getAttribute("data-cs-path")||"").toLowerCase();
    }catch(e){}
    try{ return (localStorage.getItem("cu_companion_path_v1")||"dai").toLowerCase(); }catch(e2){}
    return "dai";
  }
  function allowed(){
    var p=path();
    return p==="practicing"||p==="daily"||p==="dai";
  }
  function gate(){
    var card=d.getElementById("meme-card");
    if(!card) return;
    if(allowed()){
      card.style.removeProperty("display");
      card.removeAttribute("hidden");
      card.style.setProperty("display","block","important");
      d.body && d.body.setAttribute("data-cs-path", path());
      ensureEngines();
    } else {
      card.style.setProperty("display","none","important");
      card.setAttribute("hidden","");
    }
  }
  function loadScript(src){
    return new Promise(function(resolve){
      if(d.querySelector('script[src="'+src+'"]')){ resolve(); return; }
      var s=d.createElement("script"); s.src=src; s.async=true;
      s.onload=function(){ resolve(); }; s.onerror=function(){ resolve(); };
      d.head.appendChild(s);
    });
  }
  function loadCss(href){
    if(d.querySelector('link[href="'+href+'"]')) return;
    var l=d.createElement("link"); l.rel="stylesheet"; l.href=href; d.head.appendChild(l);
  }
  function ensureEngines(){
    if(loaded) return;
    loaded=true;
    loadCss("/companion/assets/companion-meme-studio-v1.css?v=20261117M28");
    loadCss("/companion/assets/clarity-meme-layout-v1.css?v=20261117M28");
    Promise.all([
      loadScript("/companion/assets/clarity-meme-bg-fetch-v1.js?v=20261117M28"),
      loadScript("/companion/assets/clarity-meme-canvas-clean-v1.js?v=20261117M28")
    ]).then(function(){
      bind();
      try{ if(typeof w.paintMeme==="function") w.paintMeme(); }catch(e){}
      try{ if(typeof w.syncMemeUi==="function") w.syncMemeUi(); }catch(e2){}
    });
  }
  function status(msg){
    var el=d.getElementById("meme-fetch-status")||d.getElementById("meme-rrra-status");
    if(el) el.textContent=msg||"";
  }
  function afterTextFetch(){
    /* scene matching message context */
    try{
      if(typeof w.memeFetchBg==="function") w.memeFetchBg("dynamic");
      else if(typeof w.clarityMemeAiBg==="function") w.clarityMemeAiBg();
    }catch(e){}
  }
  function bind(){
    var root=d.getElementById("meme-studio-root");
    if(!root || root.__memeBound) return;
    root.__memeBound=true;
    root.addEventListener("click", function(ev){
      var btn=ev.target && ev.target.closest && ev.target.closest("[data-meme-bg],[data-meme-decor],[data-meme-fetch],[data-meme-act]");
      if(!btn) return;
      ev.preventDefault();
      if(!allowed()){ status("Meme Studio is on Daily Muslim & Daʿī paths only."); return; }
      var bg=btn.getAttribute("data-meme-bg");
      var decor=btn.getAttribute("data-meme-decor");
      var fetch=btn.getAttribute("data-meme-fetch");
      var act=btn.getAttribute("data-meme-act");
      try{
        if(bg==="blank"){
          if(typeof w.memeShowBlankPalette==="function") w.memeShowBlankPalette();
          else status("Blank palette");
        } else if(bg){
          status("Loading scene…");
          if(typeof w.memeFetchBg==="function") w.memeFetchBg(bg);
          else if(bg==="dynamic" && typeof w.clarityMemeAiBg==="function") w.clarityMemeAiBg();
          else status("Background engine loading…");
        } else if(decor){
          if(typeof w.clarityMemeDecorBg==="function") w.clarityMemeDecorBg(decor);
        } else if(fetch){
          status("Fetching text…");
          if(fetch==="surprise"){ if(typeof w.memeFetchRrra==="function") w.memeFetchRrra(null); }
          else if(fetch==="daily" && typeof w.memeDailyVerse==="function") w.memeDailyVerse();
          else if(fetch==="command" && typeof w.memeFromCommand==="function") w.memeFromCommand();
          else if(fetch==="dua" && typeof w.memeMasnunDua==="function") w.memeMasnunDua();
          else if(fetch==="night" && typeof w.memeNightQuote==="function") w.memeNightQuote();
          else if(fetch==="apply-bg"){
            if(typeof w.memeApplyUrduDua==="function") w.memeApplyUrduDua(true);
            else afterTextFetch();
          } else if(typeof w.memeFetchRrra==="function") w.memeFetchRrra(fetch);
          setTimeout(afterTextFetch, 600);
        } else if(act==="autoscale" && typeof w.memeAutoScaleLines==="function") w.memeAutoScaleLines();
        else if(act==="tweet" && typeof w.memeSendToTweetDesk==="function") w.memeSendToTweetDesk();
        else if(act==="download"){
          var c=d.getElementById("meme-canvas");
          if(c){ var a=d.createElement("a"); a.download="clarity-meme.png"; a.href=c.toDataURL("image/png"); a.click(); }
        }
      }catch(err){ status("Tool busy — try again"); }
    });
  }
  function boot(){
    gate();
    var m=d.getElementById("cs-mount");
    if(m){
      var t=null;
      new MutationObserver(function(){ if(t) clearTimeout(t); t=setTimeout(function(){ gate(); bind(); }, 40); }).observe(m,{childList:true,subtree:true});
    }
    d.addEventListener("click", function(ev){
      if(ev.target && ev.target.closest && ev.target.closest("[data-cs-path]")) setTimeout(gate, 30);
    }, true);
  }
  if(d.readyState==="loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.ClarityMemeStudio={gate:gate,ensureEngines:ensureEngines,version:"P28"};
})(window,document);
