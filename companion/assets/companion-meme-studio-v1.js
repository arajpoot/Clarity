/*! companion-meme-studio-v1 · P30 · Daily+Dai · fetch/ratio/font wire · educational only */
(function(w,d){
  "use strict";
  if(w.__COMPANION_MEME_STUDIO_V1_P30__) return;
  w.__COMPANION_MEME_STUDIO_V1_P30__=true;

  var loaded=false;
  var RATIO={
    twitter:{w:1200,h:675,css:"16/9"},
    facebook:{w:1200,h:630,css:"1.91/1"},
    instagram:{w:1080,h:1080,css:"1/1"},
    instagram_story:{w:1080,h:1920,css:"9/16"}
  };

  function path(){
    try{var b=d.querySelector("[data-cs-path].is-active");if(b)return (b.getAttribute("data-cs-path")||"").toLowerCase();}catch(e){}
    try{return (localStorage.getItem("cu_companion_path_v1")||"dai").toLowerCase();}catch(e2){}
    return "dai";
  }
  function allowed(){
    var p=path();
    return p==="practicing"||p==="daily"||p==="dai";
  }
  function gate(){
    ["meme-card","callig-lab-card","tweet-desk-card"].forEach(function(id){
      var el=d.getElementById(id); if(!el) return;
      if(allowed()){
        el.style.setProperty("display","block","important");
        el.removeAttribute("hidden");
      } else {
        el.style.setProperty("display","none","important");
        el.setAttribute("hidden","");
      }
    });
    if(allowed()) if(allowed()) ensureEngines();
  }
  function loadScript(src){
    return new Promise(function(res){
      if(d.querySelector('script[data-src="'+src+'"],script[src="'+src+'"]')){res();return;}
      var s=d.createElement("script"); s.src=src; s.async=true; s.setAttribute("data-src",src);
      s.onload=function(){res();}; s.onerror=function(){res();};
      d.head.appendChild(s);
    });
  }
  function loadCss(href){
    if(d.querySelector('link[href="'+href+'"]')) return;
    var l=d.createElement("link"); l.rel="stylesheet"; l.href=href; d.head.appendChild(l);
  }
  function status(msg){
    var el=d.getElementById("meme-fetch-status")||d.getElementById("meme-rrra-status");
    if(el) el.textContent=msg||"";
  }
  function state(){
    if(!w.memeState || typeof w.memeState!=="object"){
      w.memeState={vignette:0.28,ratio:"twitter",grade:"none",img:null,top:"",mid:"",bottom:"",_lastRef:"",
        fontSize:42,topSize:34,midSize:20,bottomSize:16,outline:4,font:"naskh",style:"outline",
        topY:0.12,midY:0.42,bottomY:0.70};
    }
    return w.memeState;
  }
  function paint(){
    try{ if(typeof w.paintMeme==="function") w.paintMeme(); }catch(e){}
    try{ if(typeof w.syncMemeUi==="function") w.syncMemeUi(); }catch(e2){}
    try{
      var s=state();
      if(typeof w.clarityMemeSetCanvas==="function" && (s.top||s.mid)){
        /* force redraw path */
      }
    }catch(e3){}
    try{
      // canvas-clean uses internal paint via setCanvas; trigger via state write
      if(typeof w.memeDraw==="function") w.memeDraw();
    }catch(e4){}
  }
  function applyRatio(name){
    var r=RATIO[name]||RATIO.twitter;
    var s=state();
    s.ratio=name;
    var canvas=d.getElementById("meme-canvas");
    var stage=d.getElementById("meme-stage");
    var wrap=d.getElementById("meme-stage-wrap");
    if(canvas){ canvas.width=r.w; canvas.height=r.h; }
    if(stage){ stage.style.aspectRatio=r.css; stage.setAttribute("data-ratio",name); }
    if(wrap){ wrap.setAttribute("data-ratio",name); }
    status("Canvas · "+name.replace("_"," "));
    paint();
    setTimeout(paint,100);
    setTimeout(paint,400);
  }
  function applyFont(font){
    var s=state(); s.font=font;
    if(/[\u0600-\u06FF]/.test(s.top||"")) s.topSize=s.topSize||34;
    status("Arabic style · "+font);
    paint(); setTimeout(paint,80);
  }
  function applyStyle(style){
    var s=state(); s.style=style;
    status("Text style · "+style);
    paint(); setTimeout(paint,80);
  }
  function fetchText(kind){
    status("Fetching…");
    function done(){
      setTimeout(function(){
        try{ if(typeof w.memeFetchBg==="function") w.memeFetchBg("dynamic"); }catch(e){}
        paint();
        setTimeout(paint,500);
        setTimeout(paint,1200);
      }, 400);
    }
    try{
      if(kind==="surprise"){ if(typeof w.memeFetchRrra==="function") w.memeFetchRrra(null); else fallbackVerse(); }
      else if(kind==="daily" && typeof w.memeDailyVerse==="function") w.memeDailyVerse();
      else if(kind==="command" && typeof w.memeFromCommand==="function") w.memeFromCommand();
      else if(kind==="dua" && typeof w.memeMasnunDua==="function") w.memeMasnunDua();
      else if(kind==="night" && typeof w.memeNightQuote==="function") w.memeNightQuote();
      else if(kind==="apply-bg"){
        if(typeof w.memeApplyUrduDua==="function") w.memeApplyUrduDua(true);
        else if(typeof w.memeFetchBg==="function") w.memeFetchBg("dynamic");
      } else if(typeof w.memeFetchRrra==="function") w.memeFetchRrra(kind);
      else fallbackVerse();
    }catch(e){ fallbackVerse(); }
    done();
  }
  function fallbackVerse(){
    var ar="كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ";
    var en="Every soul will taste death.";
    var ref="Qur'an 3:185";
    if(typeof w.clarityMemeFill==="function") w.clarityMemeFill(ar,en,ref);
    else if(typeof w.clarityMemeSetCanvas==="function") w.clarityMemeSetCanvas(ar,en,"",ref);
    else {
      var s=state(); s.top=ar; s.mid=en; s.bottom=ref; s._lastRef=ref;
      paint();
    }
    status(ref+" · on canvas");
  }
  function fetchBg(kind){
    status("Loading scene…");
    try{
      if(kind==="blank"){
        if(typeof w.memeShowBlankPalette==="function") w.memeShowBlankPalette();
        else { state().img=null; paint(); }
      } else if(typeof w.memeFetchBg==="function") w.memeFetchBg(kind);
      else if(kind==="dynamic" && typeof w.clarityMemeAiBg==="function") w.clarityMemeAiBg();
      else status("Background engine still loading — tap again");
    }catch(e){ status("Background busy — retry"); }
    setTimeout(paint,600);
    setTimeout(paint,1500);
  }
  function ensureEngines(){
    if(loaded){ bind(); return; }
    loaded=true;
    loadCss("/companion/assets/companion-meme-studio-v1.css?v=20261117M30");
    loadCss("/companion/assets/clarity-meme-layout-v1.css?v=20261117M30");
    Promise.all([
      loadScript("/companion/assets/clarity-meme-bg-fetch-v1.js?v=20261117M30"),
      loadScript("/companion/assets/clarity-meme-canvas-clean-v1.js?v=20261117M30")
    ]).then(function(){
      bind();
      applyRatio((state().ratio)||"twitter");
      paint();
    });
  }
  function bind(){
    var root=d.getElementById("meme-studio-root");
    if(!root||root.__memeBoundP30) return;
    root.__memeBoundP30=true;
    root.addEventListener("click", function(ev){
      var btn=ev.target&&ev.target.closest&&ev.target.closest("[data-meme-bg],[data-meme-decor],[data-meme-fetch],[data-meme-act],[data-meme-ratio],[data-meme-font],[data-meme-style]");
      if(!btn) return;
      ev.preventDefault();
      if(!allowed()){ status("Craft tools on Daily Muslim & Daʿī only."); return; }
      var bg=btn.getAttribute("data-meme-bg");
      var decor=btn.getAttribute("data-meme-decor");
      var fetch=btn.getAttribute("data-meme-fetch");
      var act=btn.getAttribute("data-meme-act");
      var ratio=btn.getAttribute("data-meme-ratio");
      var font=btn.getAttribute("data-meme-font");
      var style=btn.getAttribute("data-meme-style");
      if(ratio) applyRatio(ratio);
      else if(font) applyFont(font);
      else if(style) applyStyle(style);
      else if(bg) fetchBg(bg);
      else if(decor){ try{ if(typeof w.clarityMemeDecorBg==="function") w.clarityMemeDecorBg(decor);}catch(e){} setTimeout(paint,400); }
      else if(fetch) fetchText(fetch);
      else if(act==="autoscale"){ try{ if(typeof w.memeAutoScaleLines==="function") w.memeAutoScaleLines(); paint(); }catch(e){} }
      else if(act==="tweet"){ try{ if(typeof w.memeSendToTweetDesk==="function") w.memeSendToTweetDesk(); }catch(e){} }
      else if(act==="download"){
        var c=d.getElementById("meme-canvas");
        if(c){ var a=d.createElement("a"); a.download="clarity-meme.png"; a.href=c.toDataURL("image/png"); a.click(); }
      }
    });
  }
  function boot(){
    gate();
    var m=d.getElementById("cs-mount");
    if(m){ var t=null; new MutationObserver(function(){ if(t)clearTimeout(t); t=setTimeout(function(){ gate(); bind(); },40); }).observe(m,{childList:true,subtree:true}); }
    d.addEventListener("click", function(ev){
      if(ev.target&&ev.target.closest&&ev.target.closest("[data-cs-path]")) setTimeout(gate,30);
    }, true);
  }
  if(d.readyState==="loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.ClarityMemeStudio={gate:gate,ensureEngines:ensureEngines,applyRatio:applyRatio,version:"P30"};
})(window,document);
