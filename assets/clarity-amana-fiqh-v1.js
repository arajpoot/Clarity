/* Fiqh path companion */
(function(g){
"use strict";
try{
function fiqhGoStep(step){
  step = Number(step) || 1;
  var map = {
    1: { id: 'user-family-tree-card', hint: 'Step 1 · Mark ♂/♀, Alive/Deceased, years; add relatives; open Data health before inheritance.' },
    2: { id: 'faraid-card', hint: 'Step 2 · Load living heirs from the tree; set estate net; review shares — Hanafi study aid only.' },
    3: { id: 'wasiyyah-card', hint: 'Step 3 · Debts & funeral first; bequests ≤⅓ to non-heirs; name executor; save on device.' }
  };
  var spec = map[step] || map[1];
  try{
    document.querySelectorAll('.fiqh-step-btn').forEach(function(b){
      b.classList.toggle('on', Number(b.getAttribute('data-fiqh-step')) === step);
    });
    document.querySelectorAll('#fiqh-path-checklist li').forEach(function(li){
      li.classList.toggle('on', Number(li.getAttribute('data-step')) === step);
    });
    ['user-family-tree-card','faraid-card','wasiyyah-card'].forEach(function(id){
      var el = document.getElementById(id);
      if(el) el.classList.toggle('fiqh-path-focus', id === spec.id);
    });
    var hint = document.getElementById('fiqh-path-hint');
    if(hint) hint.textContent = spec.hint + ' Educational only — not a fatwa.';
    var target = document.getElementById(spec.id);
    if(target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    /* open matching tutorial if present */
    try{
      var tutId = step===1 ? 'uft-tutorial' : (step===2 ? 'faraid-tutorial' : 'wasiyyah-tutorial');
      var tut = document.getElementById(tutId);
      if(tut) tut.open = true;
    }catch(eT){}
    try{ localStorage.setItem('clarity_fiqh_path_step', String(step)); }catch(e){}
  }catch(err){ console.warn('fiqhGoStep', err); }
}
try{ window.fiqhGoStep = fiqhGoStep; }catch(e){}

function memeSurpriseMe(){
  try{
    var ratios=['4:5','1:1','9:16','4:3','16:9'];
    var grades=['night','warm','mist','parchment','none'];
    var styles=['gold','outline','glass','soft','ink'];
    var fonts=['serif','impact','arabic','sans'];
    var r=ratios[Math.floor(Math.random()*ratios.length)];
    var g=grades[Math.floor(Math.random()*grades.length)];
    var s=styles[Math.floor(Math.random()*styles.length)];
    var f=fonts[Math.floor(Math.random()*fonts.length)];
    memeState.ratio=r;memeState.grade=g;memeState.style=s;memeState.font=f;
    var base=Math.max(30, Math.min(44, (memeState.fontSize||36)));
    memeState.fontSize=base;
    memeState.topSize=base;
    memeState.midSize=base;
    memeState.bottomSize=Math.max(20, Math.round(base*0.82));
    memeState.outline=Math.max(3, memeState.outline||4);
    memeState.topY=0.16;memeState.midY=0.48;memeState.bottomY=0.80;
    try{
      ['top','mid','bottom'].forEach(function(k){
        var el=document.getElementById('meme-size-'+k);
        var lab=document.getElementById('meme-size-'+k+'-val');
        var n=memeState[k+'Size'];
        if(el)el.value=n; if(lab)lab.textContent=String(n);
      });
      var sizeEl=document.getElementById('meme-size'); if(sizeEl)sizeEl.value=base;
      var lab=document.getElementById('meme-size-val'); if(lab)lab.textContent=String(base);
      var outEl=document.getElementById('meme-outline'); if(outEl)outEl.value=memeState.outline;
      var ol=document.getElementById('meme-outline-val'); if(ol)ol.textContent=String(memeState.outline);
    }catch(e){}
    var re=document.getElementById('meme-ratio'); if(re)re.value=r;
    var ge=document.getElementById('meme-grade'); if(ge)ge.value=g;
    var se=document.getElementById('meme-style'); if(se)se.value=s;
    var fe=document.getElementById('meme-font'); if(fe){try{fe.value=f;}catch(e){}}
    try{ if(typeof memeSetRatio==='function') memeSetRatio(r); }catch(e){}
    try{ if(typeof memeSetGrade==='function') memeSetGrade(g); }catch(e){}
    try{ if(typeof memeSetFont==='function') memeSetFont(f); }catch(e){ memeState.font=f; }
    try{ if(typeof memeSetStyle==='function') memeSetStyle(s); }catch(e){ memeState.style=s; }
    var packs=[
      {top:'If I die tonight…',mid:'What light have I sent ahead?',bottom:'— Clarity'},
      {top:'The grave is a long stay',mid:'Send light before you arrive',bottom:'Qur’an · Sunnah'},
      {top:'Speak good — or remain silent',mid:'Whoever believes in Allah and the Last Day',bottom:'Bukhari · Muslim'},
      {top:'Hasbiyallāhu wa niʿmal-wakīl',mid:'Allah is sufficient for us',bottom:'Qur’an 3:173'},
      {top:'A small deed, done always',mid:'Is more beloved than a burst that dies',bottom:'Bukhari · Muslim'},
      {top:'Lower the wing of mercy',mid:'To your parents — even if it is hard',bottom:'Qur’an 17:24'},
      {top:'Remember the destroyer of pleasures',mid:'Then do one sincere deed now',bottom:'— Hadith'},
      {top:'Rabbana atina fid-dunya hasanah',mid:'Wa fil-akhirati hasanah wa qina adhaban-nar',bottom:'Qur’an 2:201'}
    ];
    var pick=packs[Math.floor(Math.random()*packs.length)];
    memeState.top=pick.top; memeState.mid=pick.mid; memeState.bottom=pick.bottom;
    var t=document.getElementById('meme-top-input'); if(t)t.value=pick.top;
    var m=document.getElementById('meme-mid-input'); if(m)m.value=pick.mid;
    var b=document.getElementById('meme-bottom-input'); if(b)b.value=pick.bottom;

    function finish(){
      try{ if(typeof memePositionBoxes==='function') memePositionBoxes(); }catch(e){}
      try{ if(typeof memeAutoFitSizes==='function') memeAutoFitSizes(); }catch(e){}
      try{ memeDraw(); }catch(e){}
      try{ memeUpdateWmLink(); }catch(e){}
      try{ if(typeof memeAutoScaleLines==='function') memeAutoScaleLines({quiet:true, status:'Surprise draft scaled'}); }catch(eSc){}
      try{
        var fab=document.getElementById('meme-audio-fab');
        if(fab){ fab.style.transform='scale(1.08)'; setTimeout(function(){ fab.style.transform=''; }, 700); }
      }catch(e){}
      try{
        /* Only keys that exist in MEME_BG_POOLS */
        if(typeof memeFetchBg==='function' && Math.random()>0.30){
          var cats=['nature','flowers','holy','spirit'];
          memeFetchBg(cats[Math.floor(Math.random()*cats.length)]);
        } else if(typeof memeSetBlankColor==='function'){
          var pairs=[['#0f4c3a','#1a2a22'],['#1a2830','#0c1410'],['#3d2a0a','#1a1208'],['#0d2137','#1a3a4a']];
          var p=pairs[Math.floor(Math.random()*pairs.length)];
          memeState.blankColor1=p[0]; memeState.blankColor2=p[1];
          memeState.img=null; memeDraw();
        }
      }catch(e){}
    }

    /* Optional live verse — silent if Journey not loaded (no alert during Surprise) */
    try{
      var hasVerse = (typeof currentJourneyVerse!=='undefined' && currentJourneyVerse && currentJourneyVerse.en);
      if(hasVerse && typeof memeFillFromJourneyVerse==='function' && Math.random()>0.50){
        var p1=memeFillFromJourneyVerse(true);
        if(p1 && typeof p1.then==='function'){ p1.then(finish).catch(finish); }
        else { setTimeout(finish, 400); }
      } else {
        finish();
      }
    }catch(e){ finish(); }
  }catch(err){
    console.warn('memeSurpriseMe', err);
    try{ memeDraw(); }catch(e2){}
  }
}

/* Clarity Revamp — First-visit welcome */
(function(){
  var KEY = 'clarity_welcome_seen_v2';
  function show(){
    var el = document.getElementById('clarity-welcome');
    if(!el) return;
    el.classList.add('show');
    el.setAttribute('aria-hidden','false');
    document.documentElement.style.overflowY = 'hidden';
    var chip = document.getElementById('clarity-start-chip');
    if(chip) chip.classList.remove('show');
  }
  function hide(){
    var el = document.getElementById('clarity-welcome');
    if(!el) return;
    el.classList.remove('show');
    el.setAttribute('aria-hidden','true');
    document.documentElement.style.overflowY = 'scroll';
  }
  window.clarityShowWelcome = function(){ show(); };
  window.clarityFinishWelcome = function(goJourney){
    try{ clarityLS.setItem(KEY, '1'); }catch(e){}
    hide();
    var chip = document.getElementById('clarity-start-chip');
    if(chip) chip.classList.remove('show');
    if(goJourney && typeof switchTab === 'function'){
      switchTab('journey');
      setTimeout(function(){
        var oa = document.querySelector('.one-action-strip');
        if(oa) oa.scrollIntoView({behavior:'smooth', block:'center'});
      }, 280);
    }
  };
  function welcomeAlreadySeen(){
    try {
      if (clarityLS.getItem(KEY)) return true;
      if (clarityLS.getItem('clarity_welcome_seen')) return true;
      if (localStorage.getItem(KEY)) return true;
      if (localStorage.getItem('clarity_welcome_seen')) return true;
      if (localStorage.getItem('clarity_path_override')) return true;
      if (localStorage.getItem('clarity_committed_path')) return true;
      if (localStorage.getItem('clarity_name')) return true;
    } catch(e){}
    return false;
  }
  function markWelcomeSeen(){
    try { clarityLS.setItem(KEY, '1'); } catch(e){}
    try { clarityLS.setItem('clarity_welcome_seen', '1'); } catch(e2){}
    try { localStorage.setItem(KEY, '1'); } catch(e3){}
    try { localStorage.setItem('clarity_welcome_seen', '1'); } catch(e4){}
  }
  window.clarityMarkWelcomeSeen = markWelcomeSeen;
  var _finish = window.clarityFinishWelcome;
  window.clarityFinishWelcome = function(goJourney){
    markWelcomeSeen();
    if (typeof _finish === 'function') {
      try { _finish(goJourney); } catch(e){}
    } else {
      hide();
    }
  };
  function maybeShow(){
    if (welcomeAlreadySeen()) {
      hide();
      try {
        var chip = document.getElementById('clarity-start-chip');
        if(chip && !sessionStorage.getItem('clarity_chip_dismissed')){
          setTimeout(function(){ chip.classList.add('show'); }, 1800);
          setTimeout(function(){ chip.classList.remove('show'); sessionStorage.setItem('clarity_chip_dismissed','1'); }, 12000);
        }
      } catch(e){}
      return;
    }
    setTimeout(show, 500);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', maybeShow);
  else maybeShow();
  // Esc closes
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      var el = document.getElementById('clarity-welcome');
      if(el && el.classList.contains('show')) clarityFinishWelcome(false);
    }
  });
})();

/* Clarity Revamp — SW + Beginner + Offline */
(function(){
  // Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      // Path-aware registration for GitHub Pages (root or /repo-name/)
      var swUrl = 'sw.js';
      var scope = './';
      try {
        var path = location.pathname || '/';
        // If page is /repo/index.html or /repo/, scope to /repo/
        if (path !== '/' && !path.endsWith('/')) {
          path = path.replace(/\/[^\/]*$/, '/');
        }
        if (path.length > 1) {
          swUrl = path + 'sw.js';
          scope = path;
        }
      } catch (e) {}
      navigator.serviceWorker.register(swUrl, { scope: scope })
        .then(function(reg){
          console.info('[Clarity] SW registered', reg.scope);
          // Optional: surface success once
          try {
            if (!sessionStorage.getItem('clarity_sw_ok')) {
              sessionStorage.setItem('clarity_sw_ok', '1');
            }
          } catch (e) {}
        })
        .catch(function(err){
          console.warn('[Clarity] SW failed', err);
        });
    });
  }

  // Offline badge
  function updateOnlineStatus() {
    var badge = document.getElementById('offline-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.id = 'offline-badge';
      badge.className = 'offline-badge';
      badge.textContent = 'Offline';
      badge.title = 'You are offline — core shell is cached; live content needs connection';
      var tools = document.querySelector('.banner-tools') || document.querySelector('.a11y-bar');
      if (tools) tools.appendChild(badge);
    }
    if (navigator.onLine) badge.classList.remove('show');
    else badge.classList.add('show');
  }
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', updateOnlineStatus);
  else updateOnlineStatus();

  // Beginner mode
  var BM_KEY = 'clarity_beginner_mode';
  function applyBeginner(on) {
    document.documentElement.classList.toggle('beginner-mode', !!on);
    try { clarityLS.setItem(BM_KEY, on ? '1' : '0'); } catch(e) {}
    var cb = document.getElementById('beginner-toggle');
    if (cb) cb.checked = !!on;
  }
  window.clarityToggleBeginner = function(el) {
    applyBeginner(el ? el.checked : !document.documentElement.classList.contains('beginner-mode'));
  };
  function initBeginner() {
    var on = false;
    try { on = clarityLS.getItem(BM_KEY) === '1'; } catch(e) {}
    applyBeginner(on);
    // Inject toggle into banner tools if missing
    if (!document.getElementById('beginner-toggle')) {
      var tools = document.querySelector('.banner-tools') || document.querySelector('.a11y-bar');
      if (tools) {
        var wrap = document.createElement('label');
        wrap.className = 'beginner-toggle-wrap';
        wrap.title = 'Simplify dense tools for first visits';
        wrap.innerHTML = '<input type="checkbox" id="beginner-toggle" onchange="clarityToggleBeginner(this)"> <span>Simple</span>';
        tools.insertBefore(wrap, tools.firstChild);
        document.getElementById('beginner-toggle').checked = on;
      }
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initBeginner);
  else initBeginner();

  // Legacy one-pager print helper
  window.clarityPrintLegacy = function() {
    var name = '';
    try { name = clarityLS.getItem('clarity_name') || ''; } catch(e) {}
    var ist = 0, sal = 0;
    try {
      if (typeof getDepositCount === 'function') {
        ist = getDepositCount('istighfar') || 0;
        sal = getDepositCount('salawat') || 0;
      }
    } catch(e) {}
    var today = new Date().toLocaleDateString(undefined, { year:'numeric', month:'long', day:'numeric' });
    var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Clarity Legacy One-Pager</title>' +
      '<style>body{font-family:Georgia,serif;max-width:720px;margin:1.5rem auto;padding:0 1.2rem;color:#1a1a1a;line-height:1.55}' +
      'h1{color:#0f4c3a;border-bottom:2px solid #b8922a;padding-bottom:.4rem;font-size:1.6rem}' +
      'h2{color:#0f4c3a;font-size:1.15rem;margin:1.3rem 0 .35rem}' +
      '.meta{color:#555;font-size:.9rem;margin-bottom:1.2rem}' +
      '.box{border:1px solid #d4c4a0;border-radius:10px;padding:.85rem 1rem;margin:.6rem 0;background:#faf7ef}' +
      '.note{font-size:.85rem;color:#555;margin-top:1.5rem}' +
      '@media print{body{margin:0}}' +
      '</style></head><body>' +
      '<h1>Clarity · Legacy One-Pager</h1>' +
      '<p class="meta">Prepared for: <strong>' + (name || '—') + '</strong> · ' + today + '</p>' +
    
}catch(e){console.warn("fiqh module",e);}
g.fiqhGoStep=typeof fiqhGoStep==="function"?fiqhGoStep:g.fiqhGoStep;
})(typeof window!=="undefined"?window:this);
