/*! companion-meme-studio-v1 · P32 slow mount · educational only */
(function(w,d){
  "use strict";
  if(w.__COMPANION_MEME_STUDIO_P32__) return;
  w.__COMPANION_MEME_STUDIO_P32__=true;

  var CRAFT_OK = { practicing:1, daily:1, dai:1 };
  var RATIO = {
    twitter:{w:1200,h:675,css:"16/9"},
    facebook:{w:1200,h:630,css:"1.91/1"},
    instagram:{w:1080,h:1080,css:"1/1"},
    instagram_story:{w:1080,h:1920,css:"9/16"}
  };
  /* local educational packs — always available */
  var PACKS = {
    reminder: { verses:[
      {ar:"كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ", en:"Every soul will taste death.", ref:"Qur'an 3:185"},
      {ar:"فَاذْكُرُونِي أَذْكُرْكُمْ", en:"So remember Me; I will remember you.", ref:"Qur'an 2:152"},
      {ar:"وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ", en:"I did not create jinn and mankind except to worship Me.", ref:"Qur'an 51:56"}
    ], hadith:[
      {ar:"إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ", en:"Actions are by intentions.", ref:"Bukhari & Muslim — educational"}
    ]},
    reality: { verses:[
      {ar:"أَحَسِبَ النَّاسُ أَن يُتْرَكُوا أَن يَقُولُوا آمَنَّا وَهُمْ لَا يُفْتَنُونَ", en:"Do people think they will be left to say 'We believe' without being tested?", ref:"Qur'an 29:2"}
    ], hadith:[]},
    reflection: { verses:[
      {ar:"يَا أَيُّهَا الَّذِينَ آمَنُوا تُوبُوا إِلَى اللَّهِ تَوْبَةً نَّصُوحًا", en:"O you who believe, turn to Allah in sincere repentance.", ref:"Qur'an 66:8"}
    ], hadith:[]},
    action: { verses:[
      {ar:"وَقُلِ اعْمَلُوا فَسَيَرَى اللَّهُ عَمَلَكُمْ وَرَسُولُهُ وَالْمُؤْمِنُونَ", en:"Say: Work, for Allah will see your work, and His Messenger, and the believers.", ref:"Qur'an 9:105"}
    ], hadith:[]}
  };

  function path(){
    try{var b=d.querySelector("[data-cs-path].is-active"); if(b) return (b.getAttribute("data-cs-path")||"").toLowerCase();}catch(e){}
    try{return (localStorage.getItem("cu_companion_path_v1")||"dai").toLowerCase();}catch(e2){}
    return "dai";
  }
  function allowed(){ var p=path(); return !!(CRAFT_OK[p]); }

  function status(msg){
    var el=d.getElementById("meme-fetch-status")||d.getElementById("meme-rrra-status");
    if(el) el.textContent = msg||"";
  }

  function forceVisible(){
    var card=d.getElementById("meme-card");
    var root=d.getElementById("meme-studio-root");
    if(!card||!root) return false;
    if(!allowed()){
      card.style.setProperty("display","none","important");
      card.setAttribute("hidden","");
      return false;
    }
    card.style.setProperty("display","block","important");
    card.removeAttribute("hidden");
    root.style.setProperty("display","flex","important");
    root.style.setProperty("visibility","visible","important");
    root.style.setProperty("opacity","1","important");
    root.style.setProperty("max-height","none","important");
    root.querySelectorAll(".meme-bar, .meme-preview-only, .meme-below, .meme-chip-row, #meme-stage, #meme-canvas").forEach(function(el){
      el.style.setProperty("display", el.id==="meme-canvas"||el.classList.contains("meme-chip-row")?"(flex or block)":"block", "important");
    });
    /* fix botched ternary — do explicit */
    root.querySelectorAll(".meme-bar, .meme-preview-only, .meme-below, #meme-stage-wrap, #meme-stage").forEach(function(el){
      el.style.setProperty("display","block","important");
      el.style.setProperty("visibility","visible","important");
    });
    root.querySelectorAll(".meme-chip-row").forEach(function(el){
      el.style.setProperty("display","flex","important");
    });
    var canvas=d.getElementById("meme-canvas");
    if(canvas){
      canvas.style.setProperty("display","block","important");
      canvas.style.setProperty("width","100%","important");
      if(!canvas.width) canvas.width=1200;
      if(!canvas.height) canvas.height=675;
    }
    return true;
  }

  function state(){
    if(!w.memeState||typeof w.memeState!=="object"){
      w.memeState={ratio:"twitter", top:"", mid:"", bottom:"", _lastRef:"", font:"naskh", style:"outline",
        topSize:36, midSize:20, bottomSize:16, baseTopSize:36, baseMidSize:20, baseBottomSize:16, outline:4, img:null, topY:0.14, midY:0.42, bottomY:0.72, scaleTop:100, scaleMid:100, scaleBottom:100};
    }
    return w.memeState;
  }

  function paintLocal(){
    var canvas=d.getElementById("meme-canvas");
    if(!canvas) return;
    var s=state();
    var ctx=canvas.getContext("2d");
    if(!ctx) return;
    var W=canvas.width, H=canvas.height;
    ctx.clearRect(0,0,W,H);
    var bg=s.bgImage||s.img;
    if(bg && (bg.complete || bg.naturalWidth)){
      try{
        var nw=bg.naturalWidth||bg.width||W, nh=bg.naturalHeight||bg.height||H;
        var scale=Math.max(W/nw, H/nh);
        var iw=nw*scale, ih=nh*scale;
        ctx.drawImage(bg, (W-iw)/2, (H-ih)/2, iw, ih);
        ctx.fillStyle="rgba(0,0,0,0.28)";
        ctx.fillRect(0,0,W,H);
      }catch(e){ ctx.fillStyle="#0c1a14"; ctx.fillRect(0,0,W,H); }
    } else {
      ctx.fillStyle="#0c1a14"; ctx.fillRect(0,0,W,H);
    }
    function drawLine(text, yFrac, size){
      if(!text) return;
      ctx.save();
      ctx.font="bold "+size+"px Amiri, 'Noto Naskh Arabic', serif";
      ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.lineWidth=s.outline||4;
      ctx.strokeStyle="rgba(0,0,0,0.75)";
      ctx.fillStyle="#f7f1e1";
      if(s.style!=="fill") ctx.strokeText(text, W/2, H*yFrac);
      ctx.fillText(text, W/2, H*yFrac);
      ctx.restore();
    }
    drawLine(s.top, s.topY||0.14, s.topSize||36);
    drawLine(s.mid, s.midY||0.42, s.midSize||20);
    drawLine(s.bottom||s._lastRef, s.bottomY||0.72, s.bottomSize||16);
  }

  function paint(){
    try{ if(typeof w.paintMeme==="function") w.paintMeme(); }catch(e){}
    try{ if(typeof w.memeDraw==="function") w.memeDraw(); }catch(e2){}
    paintLocal();
  }

  function setText(ar,en,ref){
    var s=state();
    s.top=String(ar||"").trim();
    s.mid=String(en||"").trim();
    s.bottom=String(ref||"").trim();
    s._lastRef=s.bottom;
    try{
      if(typeof w.clarityMemeFill==="function") w.clarityMemeFill(s.top,s.mid,s._lastRef);
      else if(typeof w.clarityMemeSetCanvas==="function") w.clarityMemeSetCanvas(s.top,s.mid,"",s._lastRef);
    }catch(e){}
    var top=d.getElementById("meme-top-input");
    var mid=d.getElementById("meme-mid-input");
    var bot=d.getElementById("meme-bottom-input");
    if(top) top.value=s.top;
    if(mid) mid.value=s.mid;
    if(bot) bot.value=s.bottom;
    paint();
    setTimeout(paint, 120);
    setTimeout(paint, 500);
    status((ref||"Text")+" · on canvas");
  }

  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  function fetchText(kind){
    if(!allowed()){ status("Meme Studio · Daily Muslim & Daʿī only"); return; }
    forceVisible();
    var cat=kind;
    if(kind==="surprise"||!kind) cat = pick(["reminder","reality","reflection","action"]);
    if(kind==="daily"||kind==="command"||kind==="dua"||kind==="night") cat="reminder";
    if(["reminder","reality","reflection","action"].indexOf(cat)<0) cat="reminder";

    /* prefer engine packs if present */
    try{
      if(typeof w.memeFetchRrra==="function" && ["reminder","reality","reflection","action"].indexOf(kind)>=0){
        w.memeFetchRrra(kind);
        status("Fetched · "+kind);
        setTimeout(function(){ paint(); fetchBg("dynamic"); }, 500);
        return;
      }
      if(kind==="daily" && typeof w.memeDailyVerse==="function"){ w.memeDailyVerse(); setTimeout(paint,400); return; }
      if(kind==="command" && typeof w.memeFromCommand==="function"){ w.memeFromCommand(); setTimeout(paint,400); return; }
      if(kind==="dua" && typeof w.memeMasnunDua==="function"){ w.memeMasnunDua(); setTimeout(paint,400); return; }
      if(kind==="night" && typeof w.memeNightQuote==="function"){ w.memeNightQuote(); setTimeout(paint,400); return; }
    }catch(e){}

    var pack=PACKS[cat]||PACKS.reminder;
    var pool=(pack.verses||[]).concat(pack.hadith||[]);
    var item=pick(pool);
    setText(item.ar, item.en, item.ref);
    setTimeout(function(){ fetchBg("dynamic"); }, 400);
  }

  function fetchBg(kind){
    if(!allowed()) return;
    forceVisible();
    status("Loading scene · "+kind+"…");
    ensureEngines(function(){
      try{
        if(typeof w.memeFetchBg==="function"){
          Promise.resolve(w.memeFetchBg(kind)).then(function(){
            setTimeout(paint, 200);
            setTimeout(paint, 800);
            setTimeout(paint, 1600);
          });
          return;
        }
      }catch(e){}
      status("BG engine missing");
    });
  }

  
  function applyScalePct(which, pct){
    var s=state();
    pct=Math.max(50, Math.min(220, parseInt(pct,10)||100));
    if(which==="top"){ s.scaleTop=pct; s.topSize=Math.round((s.baseTopSize||36)*pct/100); }
    if(which==="mid"){ s.scaleMid=pct; s.midSize=Math.round((s.baseMidSize||20)*pct/100); }
    if(which==="bottom"){ s.scaleBottom=pct; s.bottomSize=Math.round((s.baseBottomSize||16)*pct/100); }
    try{ paintLocal(); }catch(e){}
    paint();
    setTimeout(function(){ try{ paintLocal(); paint(); }catch(e2){} }, 50);
    status("Size · "+which+" "+pct+"%");
  }
  function autoScaleLines(){
    var canvas=d.getElementById("meme-canvas");
    if(!canvas) return;
    var s=state();
    var ctx=canvas.getContext("2d");
    if(!ctx) return;
    var W=canvas.width;
    function fit(text, base, maxPct){
      if(!text) return 100;
      var pct=100;
      for(var guard=0; guard<40; guard++){
        var size=Math.max(10, Math.round(base*pct/100));
        ctx.font="bold "+size+"px Amiri, 'Noto Naskh Arabic', serif";
        var w=ctx.measureText(text).width;
        if(w <= W*0.88) break;
        pct -= 5;
        if(pct<55) break;
      }
      /* if too small on canvas, try grow once for short lines */
      if(pct===100){
        ctx.font="bold "+base+"px Amiri, 'Noto Naskh Arabic', serif";
        var w0=ctx.measureText(text).width;
        if(w0 < W*0.55 && text.length<40){
          while(pct<160){
            pct+=5;
            var size2=Math.round(base*pct/100);
            ctx.font="bold "+size2+"px Amiri, 'Noto Naskh Arabic', serif";
            if(ctx.measureText(text).width > W*0.88){ pct-=5; break; }
          }
        }
      }
      return pct;
    }
    var pt=fit(s.top||"", s.baseTopSize||36);
    var pm=fit(s.mid||"", s.baseMidSize||20);
    var pb=fit(s.bottom||s._lastRef||"", s.baseBottomSize||16);
    s.scaleTop=pt; s.scaleMid=pm; s.scaleBottom=pb;
    s.topSize=Math.round((s.baseTopSize||36)*pt/100);
    s.midSize=Math.round((s.baseMidSize||20)*pm/100);
    s.bottomSize=Math.round((s.baseBottomSize||16)*pb/100);
    /* sync selects */
    var st=d.getElementById("meme-scale-top");
    var sm=d.getElementById("meme-scale-mid");
    var sb=d.getElementById("meme-scale-bottom");
    function nearest(sel, val){
      if(!sel) return;
      var best=sel.options[0], bd=1e9;
      for(var i=0;i<sel.options.length;i++){
        var v=parseInt(sel.options[i].value,10);
        var d=Math.abs(v-val);
        if(d<bd){ bd=d; best=sel.options[i]; }
      }
      sel.value=best.value;
    }
    nearest(st, pt); nearest(sm, pm); nearest(sb, pb);
    try{ paintLocal(); }catch(e){}
    paint();
    setTimeout(function(){ try{ paintLocal(); paint(); }catch(e2){} }, 50);
    status("Auto-scale · top "+pt+"% · mid "+pm+"% · bottom "+pb+"%");
  }


  function applyRatio(name){
    var r=RATIO[name]||RATIO.twitter;
    var s=state(); s.ratio=name;
    var canvas=d.getElementById("meme-canvas");
    var stage=d.getElementById("meme-stage");
    if(canvas){ canvas.width=r.w; canvas.height=r.h; }
    if(stage){ stage.style.aspectRatio=r.css; stage.setAttribute("data-ratio", name); }
    paint(); status("Canvas · "+name);
  }

  function loadScript(src){
    return new Promise(function(res){
      if(d.querySelector('script[data-meme-src="'+src+'"]')){ res(); return; }
      var s=d.createElement("script"); s.src=src; s.async=true; s.setAttribute("data-meme-src",src);
      s.onload=function(){res();}; s.onerror=function(){res();};
      d.head.appendChild(s);
    });
  }
  function loadCss(href){
    if(d.querySelector('link[href="'+href+'"]')) return;
    var l=d.createElement("link"); l.rel="stylesheet"; l.href=href; d.head.appendChild(l);
  }

  var enginesReady=false;
  function ensureEngines(cb){
    if(enginesReady){ if(cb) cb(); return; }
    loadCss("/companion/assets/companion-meme-studio-v1.css?v=20261117P32");
    Promise.all([
      loadScript("/companion/assets/clarity-meme-bg-fetch-v1.js?v=20261117P32"),
      loadScript("/companion/assets/clarity-meme-canvas-clean-v1.js?v=20261117P32")
    ]).then(function(){
      enginesReady=true;
      if(cb) cb();
    });
  }

  function bind(){
    var root=d.getElementById("meme-studio-root");
    if(!root || root.__p32Bound) return;
    root.__p32Bound=true;
    root.addEventListener("click", function(ev){
      var btn=ev.target && ev.target.closest && ev.target.closest("[data-meme-bg],[data-meme-fetch],[data-meme-ratio],[data-meme-font],[data-meme-style],[data-meme-act],[data-meme-decor]");
      if(!btn) return;
      ev.preventDefault();
      if(!forceVisible()){ status("Meme Studio · Daily Muslim & Daʿī only"); return; }
      var bg=btn.getAttribute("data-meme-bg");
      var fetch=btn.getAttribute("data-meme-fetch");
      var ratio=btn.getAttribute("data-meme-ratio");
      var font=btn.getAttribute("data-meme-font");
      var style=btn.getAttribute("data-meme-style");
      var act=btn.getAttribute("data-meme-act");
      var decor=btn.getAttribute("data-meme-decor");
      if(ratio) applyRatio(ratio);
      else if(font){ state().font=font; paint(); status("Font · "+font); }
      else if(style){ state().style=style; paint(); status("Style · "+style); }
      else if(bg) ensureEngines(function(){ fetchBg(bg); });
      else if(decor){ ensureEngines(function(){ try{ if(w.clarityMemeDecorBg) w.clarityMemeDecorBg(decor);}catch(e){} fetchBg("holy"); }); }
      else if(fetch) ensureEngines(function(){ fetchText(fetch==="apply-bg"?"reminder":fetch); if(fetch==="apply-bg") fetchBg("dynamic"); });
      else if(act==="download"){
        var c=d.getElementById("meme-canvas");
        if(c){ var a=d.createElement("a"); a.download="clarity-meme.png"; a.href=c.toDataURL("image/png"); a.click(); }
      } else if(act==="autoscale"){ autoScaleLines(); } else if(false){ paint(); }
    });
  }

  function gate(){
    ["meme-card","callig-lab-card","tweet-desk-card"].forEach(function(id){
      var el=d.getElementById(id); if(!el) return;
      if(allowed()){ el.style.setProperty("display","block","important"); el.removeAttribute("hidden"); }
      else { el.style.setProperty("display","none","important"); el.setAttribute("hidden",""); }
    });
    if(allowed()){
      forceVisible();
      ensureEngines(function(){ bind(); paint(); });
    }
  }

  
  /* P35_SCALE — hard-wire dropdowns to canvas */
  function wireScaleControls(){
    function onScaleChange(ev){
      var t=ev.target;
      if(!t || !t.getAttribute) return;
      if(t.getAttribute("data-meme-scale")){
        applyScalePct(t.getAttribute("data-meme-scale"), t.value);
        return;
      }
      if(t.id==="meme-text-style" || t.hasAttribute("data-meme-style-select")){
        state().style=t.value; paint(); status("Style · "+t.value); return;
      }
      if(t.id==="meme-font-select" || t.hasAttribute("data-meme-font-select")){
        state().font=t.value; paint(); status("Font · "+t.value); return;
      }
    }
    d.addEventListener("change", onScaleChange, true);
    d.addEventListener("input", onScaleChange, true);
  }
  wireScaleControls();

  function boot(){
    gate();
    bind();
    var m=d.getElementById("cs-mount");
    if(m){
      var t=null;
      new MutationObserver(function(){
        if(t) clearTimeout(t);
        t=setTimeout(function(){ gate(); bind(); forceVisible(); }, 50);
      }).observe(m,{childList:true,subtree:true});
    }
    d.addEventListener("click", function(ev){
      if(ev.target&&ev.target.closest&&ev.target.closest("[data-cs-path],[data-rail-tab]"))
        setTimeout(function(){ gate(); forceVisible(); }, 40);
    }, true);
    /* settle after mount */
    [100,400,1000,2000].forEach(function(ms){ setTimeout(function(){ gate(); forceVisible(); bind(); }, ms); });
  }

  if(d.readyState==="loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.ClarityMemeStudio={gate:gate,forceVisible:forceVisible,fetchText:fetchText,fetchBg:fetchBg,paintLocal:paintLocal,paint:paint,autoScaleLines:autoScaleLines,applyScalePct:applyScalePct,version:"P35"};
  w.memeAutoScaleLines=autoScaleLines;
  w.memeApplyScalePct=applyScalePct;
})(window,document);
