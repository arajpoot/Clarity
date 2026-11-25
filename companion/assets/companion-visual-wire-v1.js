/*! companion-visual-wire-v1 · wire deep learning + hifz after fortify mount
 * Educational only — not a fatwa. Visible fixes only.
 */
(function(w,d){
  "use strict";
  if(w.__COMPANION_VISUAL_WIRE_V1__) return;
  w.__COMPANION_VISUAL_WIRE_V1__=true;

  function ensureHifz(){
    if(w.clarityHifz && typeof w.clarityHifz.play==="function") return;
    // minimal visible-safe stubs so buttons don't dead-end
    var state={tier:1,idx:0,hidden:false};
    w.clarityHifz={
      play:function(){ var a=d.getElementById("hifz-audio"); if(a){ try{a.play();}catch(e){} } },
      toggleRecall:function(){
        state.hidden=!state.hidden;
        d.querySelectorAll("[data-hifz-ayah],[data-hifz-text],#hifz-ayah-text,.hifz-ayah").forEach(function(el){
          el.style.filter=state.hidden?"blur(6px)":"none";
        });
      },
      prev:function(){ if(w.ClarityHifzEngine&&w.ClarityHifzEngine.prev) return w.ClarityHifzEngine.prev(); state.idx=Math.max(0,state.idx-1); },
      next:function(){ if(w.ClarityHifzEngine&&w.ClarityHifzEngine.next) return w.ClarityHifzEngine.next(); state.idx++; },
      markMemorized:function(){ var s=d.getElementById("hifz-status"); if(s) s.textContent="Marked for review · on-device · educational only"; },
      setTier:function(n){ state.tier=n; var s=d.getElementById("hifz-status"); if(s) s.textContent="SRS tier T"+n+" · educational only — not a fatwa"; },
      load:function(){ if(w.ClarityHifzEngine&&w.ClarityHifzEngine.load) w.ClarityHifzEngine.load(); }
    };
  }

  function ensureSearchFns(){
    function toast(msg){
      var s=d.getElementById("cs-mount-status")||d.getElementById("hifz-status");
      if(s) s.textContent=msg;
    }
    if(typeof w.searchMasnoonDua!=="function"){
      w.searchMasnoonDua=function(){ toast("Masnūn duʿā search · connect engine or open trusted source · educational only"); };
    }
    if(typeof w.searchQuran!=="function"){
      w.searchQuran=function(){ toast("Qurʾān search · use a verified muṣḥaf · educational only — not a fatwa"); };
    }
    if(typeof w.searchHadith!=="function"){
      w.searchHadith=function(){ toast("Ḥadīth search · require grade · collection · number · educational only"); };
    }
    if(typeof w.searchLifeOrHadith!=="function"){
      w.searchLifeOrHadith=function(){ toast("Life / ḥadīth search · verify with a teacher · educational only"); };
    }
  }

  function expandDeep(){
    var root=d.getElementById("cs-mount")||d;
    var deep=root.querySelector("#r7-r8-enrichment,.cs-r7-r8");
    if(!deep) return;
    deep.style.display="block";
    deep.style.visibility="visible";
    deep.querySelectorAll("details").forEach(function(x){ /* leave user control */ });
    // show iframes
    deep.querySelectorAll("iframe").forEach(function(f){
      f.style.width="100%";
      f.style.minHeight="220px";
      f.setAttribute("loading","lazy");
    });
  }

  function fixMeme(){
    var c=d.getElementById("meme-canvas");
    var s=d.getElementById("meme-stage");
    if(s){ s.style.display="block"; s.style.width="100%"; s.style.minHeight="220px"; }
    if(c){ c.style.display="block"; c.style.width="100%"; c.style.minHeight="200px";
      if(!c.width) c.width=720; if(!c.height) c.height=404;
    }
    try{ if(w.ClarityMemePaintV2&&w.ClarityMemePaintV2.paint) w.ClarityMemePaintV2.paint(); }catch(e){}
  }

  function run(){
    ensureHifz();
    ensureSearchFns();
    expandDeep();
    fixMeme();
  }

  function boot(){
    run();
    d.addEventListener("clarity:tab-mounted", function(){ setTimeout(run,50); });
    var m=d.getElementById("cs-mount");
    if(m&&typeof MutationObserver!=="undefined"){
      var t=null;
      new MutationObserver(function(){ if(t)clearTimeout(t); t=setTimeout(run,60); }).observe(m,{childList:true});
    }
  }
  if(d.readyState==="loading") d.addEventListener("DOMContentLoaded",boot); else boot();
})(window,document);
