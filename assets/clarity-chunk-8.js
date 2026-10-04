/* clarity-chunk-8 */
var VERSE_POOL=window.VERSE_POOL||[];

var UFT_KEY=window.UFT_KEY||"clarity_user_family_tree_v1";

function switchTab(tabId, opts){
  opts = opts || {};
  try{ if(typeof trackTabVisit==='function') trackTabVisit(tabId); }catch(e){}
  /* RRRA5 hubs + vault; legacy 10-tab names remap */
  var legacyMap = {
    journey:'reminder', commands:'reminder', tafseer:'reminder',
    grave:'reflection', seerah:'reality', tajweed:'action',
    lectures:'reality', search:'reminder', about:'reality',
    notes:'notes', reminder:'reminder', reality:'reality',
    reflection:'reflection', action:'action'
  };
  tabId = legacyMap[String(tabId||'').toLowerCase()] || 'reminder';
  var valid = ['reminder','reality','reflection','action','notes'];
  if(valid.indexOf(tabId) < 0) tabId = 'reminder';
  /* SEO path sync when user changes tabs (not when router called us) */
  try{
    if(!opts.fromRouter && typeof history !== 'undefined' && history.pushState){
      var hash = (tabId === 'journey') ? '' : ('#' + tabId);
      var safe = (window.location.pathname || '/') + (window.location.search || '') + hash;
      if((window.location.pathname + window.location.search + window.location.hash) !== safe){
        history.replaceState({ clarityTab: tabId }, '', safe);
      }
      var can = document.getElementById('clarity-canonical');
      if(can) can.setAttribute('href', (window.location.origin || 'https://clarity-dawah.fyi') + ((window.location.pathname || '/') === '/' ? '/' : (window.location.pathname || '/')));
      var titles = { journey:'Clarity – Furnish Your Grave', seerah:'Seerah · Clarity', grave:'Grave preparation · Clarity', notes:'Notes & tools · Clarity', tafseer:'Tafsir · Clarity', tajweed:'Tajweed · Clarity', lectures:'Lectures · Clarity', commands:'Commands · Clarity', search:'Search · Clarity', about:'About · Clarity' };
      if(titles[tabId]) document.title = titles[tabId];
    }
  }catch(eSeo){}

  try{ document.body.setAttribute('data-active-tab', tabId); }catch(e){}

  /* 1) Quarantine every section panel */
  document.querySelectorAll('.tab-panel').forEach(function(p){
    p.classList.remove('active');
    p.classList.remove('is-active');
    p.style.cssText = '';
    p.setAttribute('hidden', '');
    p.setAttribute('aria-hidden', 'true');
  });

  /* 2) RRRA5: tools live in hubs — never quarantine meme/about chrome by old "about" gate */
  var hubTools = ['about-clarity-card','meme-card','meme-studio-root','callig-lab-card','fiqh-quiz-card','palette-mgr-card','traffic-stats-card','notes-shell'];
  hubTools.forEach(function(id){
    var el = document.getElementById(id);
    if(!el) return;
    el.removeAttribute('hidden');
    el.removeAttribute('aria-hidden');
    if (el.style && el.style.display === 'none') el.style.display = '';
  });

  /* 3) Notes / Fiqh tools — only on Amana Vault door */
  ['fiqh-workflow-card','faraid-card','wasiyyah-card','user-family-tree-card'].forEach(function(id){
    var el = document.getElementById(id);
    if(!el) return;
    if(tabId !== 'notes'){
      el.setAttribute('hidden','');
      el.style.display = 'none';
    } else {
      el.removeAttribute('hidden');
      el.style.display = 'block';
      el.style.visibility = 'visible';
    }
  });

  /* 4) Map legacy tab ids → RRRA5 hubs before reveal */
  var _map = {journey:'reminder',commands:'reminder',seerah:'reality',lectures:'reality',about:'reality',
              grave:'reflection',tafseer:'reflection',tajweed:'action',search:'action',guidance:'action'};
  if (_map[tabId]) tabId = _map[tabId];
  try{ document.body.setAttribute('data-active-tab', tabId); }catch(e){}

  /* 4b) Reveal only the active panel */
  var panel = document.getElementById('tab-' + tabId);
  if(!panel){
    tabId = 'reminder';
    panel = document.getElementById('tab-reminder');
    try{ document.body.setAttribute('data-active-tab', 'reminder'); }catch(e){}
  }
  if(panel){
    panel.classList.add('active');
    panel.classList.add('is-active');
    panel.removeAttribute('hidden');
    panel.setAttribute('aria-hidden', 'false');
    panel.style.display = 'block';
    panel.style.visibility = 'visible';
    panel.style.height = 'auto';
    panel.style.overflow = 'visible';
    panel.style.position = 'relative';
    panel.style.left = 'auto';
    panel.style.opacity = '1';
    try{ if(typeof clarityFortifyAudioIcons==='function') clarityFortifyAudioIcons(panel); }catch(e){}
  }

  /* 5) Nav chrome */
  document.querySelectorAll('.nav-tab, .mb-tab').forEach(function(t){ t.classList.remove('active'); });
  var tabBtn = document.querySelector('.nav-tab[data-tab="'+tabId+'"]');
  if(tabBtn) tabBtn.classList.add('active');
  document.querySelectorAll('.mb-tab[data-tab="'+tabId+'"]').forEach(function(b){ b.classList.add('active'); });

  /* 6) Hash + storage */
  try{
    var _hash = tabId;
    history.replaceState(null, '', '#' + _hash);
  }catch(e){}
  try{ clarityLS.setItem('clarity_last_tab', tabId); }catch(e){}

  /* 7) Section-specific boots */
  try{
    if(tabId === 'notes'){
      setTimeout(function(){
        try{ if(typeof uftRender==='function') uftRender({keepScroll:true}); }catch(e){}
        try{ if(typeof uftZoomInit==='function') uftZoomInit(); }catch(e){}
        try{ if(typeof uftCollapseEditor==='function') uftCollapseEditor(); }catch(e){}
      }, 60);
    } else {
      try{ if(typeof clarityQuarantineFiqh==='function') clarityQuarantineFiqh(); }catch(e){}
    }
    if((tabId === 'journey' || tabId === 'reminder') && typeof ilmPathwayRender==='function') ilmPathwayRender();
    if(tabId === 'search' || tabId === 'action'){
      if(typeof hajjInit==='function') hajjInit();
      if(typeof renderQuestions==='function') renderQuestions();
      if(typeof hajjChecklistRender==='function') hajjChecklistRender();
    }
    if(tabId === 'about' || tabId === 'reality' || tabId === 'action' || tabId === 'reminder'){
      try{ if(typeof clarityFetchDailyDeepLearn==='function') clarityFetchDailyDeepLearn(); }catch(e){}
      try{ if(typeof fqEnsure==='function') fqEnsure(); }catch(e){}
      try{ if(typeof fqRender==='function') fqRender(); }catch(e){}
      try{ if(typeof pmBoot==='function') pmBoot(); }catch(e){}
      try{ if(typeof calligWspRefresh==='function') calligWspRefresh(); }catch(e){}
      setTimeout(function(){
        try{
          if(typeof memeDraw==='function') memeDraw();
          if(typeof memeUpdateWmLink==='function') memeUpdateWmLink();
          if(typeof memeInitDrag==='function') memeInitDrag();
          if(typeof calligInit==='function') calligInit();
          if(typeof calligProgressRender==='function') calligProgressRender();
        }catch(e){}
      }, 120);
    }
  }catch(e){}

  /* 8) Scroll to nav */
  try{
    var nav = document.querySelector('.nav-tabs') || document.querySelector('.page-wrapper');
    if(nav){
      var top = nav.getBoundingClientRect().top + window.scrollY - 10;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
  }catch(e){}

  /* 9) Leak sentinel — surprise auto-repair */
  try{ claritySectionSentinel(); }catch(e){}
}

function claritySectionSentinel(){
  try{
    var active = document.body.getAttribute('data-active-tab') || 'reminder';
    /* Map legacy ids → RRRA5 hubs */
    var map = {journey:'reminder',commands:'reminder',seerah:'reality',lectures:'reality',about:'reality',
               grave:'reflection',tafseer:'reflection',tajweed:'action',search:'action',
               guidance:'action',tools:'reality',fiqh:'notes',vault:'notes',amana:'notes'};
    if (map[active]) active = map[active];
    var hubs = {reminder:1,reality:1,reflection:1,action:1,notes:1};
    if (!hubs[active]) active = 'reminder';

    document.querySelectorAll('.tab-panel').forEach(function(p){
      var id = (p.id || '').replace(/^tab-/, '');
      var on = (id === active);
      if(on){
        p.classList.add('active','is-active');
        p.removeAttribute('hidden');
        p.style.display = 'block';
      } else {
        p.classList.remove('active','is-active');
        p.setAttribute('hidden','');
        p.style.display = 'none';
      }
    });
    /* RRRA5: NEVER quarantine meme / tools / notes cards by old "about" gate.
       Cards live inside hubs; panel show/hide is enough. */
    ['#meme-card','#meme-studio-root','#fiqh-quiz-card','#callig-lab-card','#palette-mgr-card',
     '#about-clarity-card','#notes-shell','.card-notes','.card-about'].forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(el){
        if (!el) return;
        el.removeAttribute('hidden');
        if (el.style && el.style.getPropertyValue('display') === 'none') {
          el.style.removeProperty('display');
        }
        if (el.style && el.style.getPropertyValue('visibility') === 'hidden') {
          el.style.removeProperty('visibility');
        }
      });
    });
    /* Force meme visible when Reminder is active */
    if (active === 'reminder') {
      var mc = document.getElementById('meme-card');
      if (mc) {
        mc.removeAttribute('hidden');
        mc.style.setProperty('display','block','important');
        mc.style.setProperty('visibility','visible','important');
        mc.style.setProperty('opacity','1','important');
        mc.style.setProperty('height','auto','important');
        mc.style.setProperty('max-height','none','important');
        mc.style.setProperty('pointer-events','auto','important');
      }
    }
  }catch(e){}
}
window.claritySectionSentinel = claritySectionSentinel;
try{
  setInterval(function(){ try{ claritySectionSentinel(); }catch(e){} }, 2000);
}catch(e){}

const tabKeys={journey:'clarity-u-journey',seerah:'clarity-u-seerah',tajweed:'clarity-u-tajweed',tafseer:'clarity-u-tafseer',lectures:'clarity-u-lectures',commands:'clarity-u-commands',grave:'clarity-u-grave',search:'clarity-u-search',notes:'clarity-u-notes',about:'clarity-u-about'};
var SITE_VISIT_KEY='clarity-u-site-visits';
function soulCompassDone(){
  try{clarityLS.setItem('clarity_soul_compass', new Date().toISOString().slice(0,10));}catch(e){}
  var s=document.getElementById('soul-compass-status');
  if(s)s.textContent='Recorded on this device for today. May Allah accept a sincere audit.';
  if(typeof addDeposit==='function'){try{addDeposit('istighfar');}catch(e){}}
}

function formatCount(n){
  n=parseInt(n,10)||0;
  if(n>=1000000) return (n/1000000).toFixed(1).replace(/\.0$/,'')+'M';
  if(n>=1000) return (n/1000).toFixed(1).replace(/\.0$/,'')+'k';
  return String(n);
}
function clarityVisitorId(){
  try{
    var id=clarityLS.getItem('clarity_vid');
    if(id&&id.length>7) return id;
    id='v'+Math.random().toString(36).slice(2)+Date.now().toString(36);
    clarityLS.setItem('clarity_vid',id);
    return id;
  }catch(e){ return 'anon'; }
}
/** Solid local traffic — one unique hit per tab per calendar day; total persisted forever */
function clarityTrafficStore(){
  try{
    if(typeof clarityLS!=='undefined' && clarityLS && typeof clarityLS.getItem==='function') return clarityLS;
  }catch(e){}
  try{ return window.localStorage; }catch(e2){}
  return {getItem:function(){return null},setItem:function(){},removeItem:function(){}};
}
function clarityRefreshAllVisitBadges(){
  try{
    var store=clarityTrafficStore();
    var tabs=['journey','commands','tafseer','tajweed','seerah','lectures','grave','search','notes','about'];
    tabs.forEach(function(tabId){
      var el=document.getElementById('vc-'+tabId);
      if(!el) return;
      var n=parseInt(store.getItem('clarity_vc_local_'+tabId)||'0',10)||0;
      el.textContent = n>0 ? (formatCount(n)+' local') : '0';
      el.title = n+' unique visit-days on this device';
    });
  }catch(e){}
}
async function trackTabVisit(tabId){
  if(!tabId) return;
  var store = clarityTrafficStore();
  var el = document.getElementById('vc-' + tabId);
  var day = new Date().toISOString().slice(0, 10);
  var mark = 'clarity_hit_' + tabId + '_' + day;
  var localKey = 'clarity_vc_local_' + tabId;
  var n = 0;
  try {
    n = parseInt(store.getItem(localKey) || '0', 10) || 0;
    if (store.getItem(mark) !== '1') {
      n += 1;
      store.setItem(localKey, String(n));
      store.setItem(mark, '1');
    }
    if (el) {
      el.textContent = formatCount(n) + ' local';
      el.title = n + ' unique visit-days on this device';
    }
  } catch (e) {}

  /* Online site visits — once per device per day */
  try {
    var dayS = new Date().toISOString().slice(0, 10);
    var siteMark = 'clarity_hit_site_' + dayS;
    var siteKey = (typeof SITE_VISIT_KEY !== 'undefined' && SITE_VISIT_KEY) ? SITE_VISIT_KEY : 'clarity-u-site-visits';
    if (store.getItem(siteMark) !== '1') {
      store.setItem(siteMark, '1');
      fetch('https://api.countapi.xyz/hit/' + siteKey).catch(function(){
        fetch('https://countapi.mileshilliard.com/api/v1/hit/' + siteKey).catch(function(){});
      });
    }
  } catch (eS) {}

  /* Optional per-tab remote (best-effort) — never blocks UI */
  var key = (typeof tabKeys !== 'undefined' && tabKeys) ? tabKeys[tabId] : null;
  if (!key) return;
  try {
    var mark2 = 'clarity_hit_remote_' + tabId + '_' + day;
    var already = store.getItem(mark2) === '1';
    var url = already
      ? ('https://api.countapi.xyz/get/' + key)
      : ('https://api.countapi.xyz/hit/' + key);
    if (!already) store.setItem(mark2, '1');
    var ctrl = typeof AbortController!=='undefined' ? new AbortController() : null;
    var to = setTimeout(function(){ try{ if(ctrl) ctrl.abort(); }catch(e){} }, 2500);
    var r = await fetch(url, { mode: 'cors', signal: ctrl ? ctrl.signal : undefined }).catch(function(){ return null; });
    clearTimeout(to);
    if (r && r.ok) {
      var data = await r.json().catch(function(){ return null; });
      if (el && data && data.value != null) {
        el.textContent = formatCount(data.value) + ' unique';
        el.title = 'Remote unique visits: ' + data.value + ' · Local day-hits: ' + n;
      }
    }
  } catch (e3) {}
}

/* ===== Guidance · Voice search (hardened) ===== */

/* ===== Voice search via Whisper-tiny (Xenova) — works without Web Speech API ===== */
var _ws = {
  rec: null, stream: null, chunks: [], target: null, onDone: null,
  timer: null, recording: false, token: 0
};

function clarityVoiceSupported(){
  try{
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  }catch(e){ return false; }
}
function clarityVoiceStatus(msg){
  var el = document.getElementById('voice-search-status');
  if(!el){
    el = document.createElement('div');
    el.id = 'voice-search-status';
    el.setAttribute('role','status');
    el.style.cssText = 'font-size:.82rem;color:var(--accent);margin:.4rem 0;font-weight:600;min-height:1.25em';
    var row = document.querySelector('#tab-search .search-row');
    if(row && row.parentNode) row.parentNode.insertBefore(el, row);
    else {
      var tab = document.getElementById('tab-search');
      if(tab) tab.insertBefore(el, tab.firstChild);
    }
  }
  el.textContent = msg || '';
}
function clarityVoiceStopTracks(){
  try{
    if(_ws.stream) _ws.stream.getTracks().forEach(function(t){ try{ t.stop(); }catch(e){} });
  }catch(e){}
  _ws.stream = null;
  _ws.rec = null;
  _ws.chunks = [];
  _ws.recording = false;
  if(_ws.timer){ clearTimeout(_ws.timer); _ws.timer = null; }
  try{
    document.querySelectorAll('.btn-voice-search.listening').forEach(function(b){
      b.classList.remove('listening');
      b.setAttribute('aria-pressed','false');
    });
  }catch(e){}
}
function clarityVoiceStop(){
  clarityVoiceStopTracks();
  _ws.target = null;
  _ws.onDone = null;
}
function clarityVoiceGo(inputId, onDone, text){
  text = String(text || '').trim();
  var inp = document.getElementById(inputId);
  if(inp){
    inp.value = text;
    try{ inp.dispatchEvent(new Event('input',{bubbles:true})); }catch(e){}
  }
  if(!text){
    clarityVoiceStatus('Nothing heard — speak 2–6 seconds, then stop.');
    return;
  }
  clarityVoiceStatus('Searching “' + text + '”…');
  var fn = null;
  if(typeof onDone === 'function') fn = onDone;
  else if(typeof onDone === 'string' && typeof window[onDone] === 'function') fn = window[onDone];
  setTimeout(function(){
    try{
      if(fn) fn();
      else if(inputId==='quran-search' && typeof searchQuran==='function') searchQuran();
      else if(inputId==='hadith-search' && typeof searchHadith==='function') searchHadith();
      else if(inputId==='life-search' && typeof searchLifeOrHadith==='function') searchLifeOrHadith();
      else if(inputId==='dua-search' && typeof searchMasnoonDua==='function') searchMasnoonDua();
    }catch(e){ console.warn(e); }
  }, 40);
}

async function clarityVoiceEnsureWhisper(){
  /* Prefer existing Voice Translator model if already loaded */
  try{
    if(typeof vtEnsureWhisper === 'function'){
      var w = await vtEnsureWhisper(false);
      if(w) return w;
    }
  }catch(e){ console.warn('vtEnsureWhisper', e); }
  try{
    if(typeof vtState !== 'undefined' && vtState && vtState.whisper) return vtState.whisper;
  }catch(e){}
  /* Standalone load */
  clarityVoiceStatus('Loading Whisper model (first time may take a minute)…');
  var mod = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2');
  try{
    if(mod.env){
      mod.env.allowLocalModels = false;
      mod.env.useBrowserCache = true;
    }
  }catch(e){}
  var pipe = await mod.pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny', {
    quantized: true,
    progress_callback: function(p){
      try{
        if(p && p.status === 'progress' && p.total){
          var pct = Math.round(100 * p.loaded / p.total);
          clarityVoiceStatus('Downloading Whisper… ' + pct + '%');
        }
      }catch(e){}
    }
  });
  try{
    if(typeof vtState !== 'undefined' && vtState){ vtState.whisper = pipe; vtState.modelReady = true; }
  }catch(e){}
  return pipe;
}

async function clarityVoiceBlobToFloat32(blob){
  if(typeof vtBlobToFloat32 === 'function'){
    try{ return await vtBlobToFloat32(blob); }catch(e){}
  }
  var buf = await blob.arrayBuffer();
  var AC = window.AudioContext || window.webkitAudioContext;
  var ctx = new AC();
  var decoded = await ctx.decodeAudioData(buf.slice(0));
  var ch = decoded.getChannelData(0);
  /* Resample to 16k if needed */
  var sr = decoded.sampleRate;
  if(Math.abs(sr - 16000) < 50) return ch;
  var ratio = sr / 16000;
  var outLen = Math.floor(ch.length / ratio);
  var out = new Float32Array(outLen);
  for(var i=0;i<outLen;i++) out[i] = ch[Math.floor(i * ratio)];
  try{ ctx.close(); }catch(e){}
  return out;
}

async function clarityVoiceTranscribe(blob){
  var asr = await clarityVoiceEnsureWhisper();
  if(!asr) throw new Error('Whisper unavailable');
  var audio = await clarityVoiceBlobToFloat32(blob);
  if(!audio || !audio.length) throw new Error('Empty audio');
  var peak = 0;
  for(var i=0;i<audio.length;i+=50){ var v=Math.abs(audio[i]); if(v>peak) peak=v; }
  if(peak < 0.005) throw new Error('Too quiet — speak louder');
  clarityVoiceStatus('Transcribing with Whisper…');
  var result = await asr(audio, {
    return_timestamps: false,
    chunk_length_s: 20,
    stride_length_s: 3,
    language: 'english',
    task: 'transcribe'
  });
  var text = '';
  if(typeof result === 'string') text = result;
  else if(result && result.text) text = result.text;
  else if(result && result[0] && result[0].text) text = result[0].text;
  return String(text || '').trim();
}

async function clarityVoiceFinish(inputId, onDone, startedAt){
  var my = ++_ws.token;
  var rec = _ws.rec;
  var chunks = _ws.chunks.slice();
  var mime = (rec && rec.mimeType) || 'audio/webm';
  clarityVoiceStatus('Processing…');
  var blob = await new Promise(function(resolve){
    if(!rec){ resolve(new Blob(chunks, {type:mime})); return; }
    var done = false;
    var finish = function(){
      if(done) return;
      done = true;
      resolve(new Blob(chunks, {type:mime}));
    };
    rec.onstop = finish;
    try{
      if(rec.state !== 'inactive') rec.stop();
      else finish();
    }catch(e){ finish(); }
    setTimeout(finish, 1500);
  });
  clarityVoiceStopTracks();
  if(my !== _ws.token) return;
  var elapsed = Date.now() - (startedAt || Date.now());
  if(elapsed < 800){
    clarityVoiceStatus('Too short — hold Voice 2–6 seconds while speaking.');
    return;
  }
  if(!blob || blob.size < 800){
    clarityVoiceStatus('No audio captured — check microphone permission.');
    return;
  }
  try{
    var text = await clarityVoiceTranscribe(blob);
    if(my !== _ws.token) return;
    if(!text){
      clarityVoiceStatus('Could not understand — try again slowly.');
      return;
    }
    clarityVoiceGo(inputId, onDone, text);
  }catch(err){
    console.warn('whisper search', err);
    clarityVoiceStatus('Whisper error: ' + ((err && err.message) || err) + ' — type instead.');
  }
}

function clarityVoiceSearch(inputId, onDone){
  var inp = document.getElementById(inputId);
  var btn = document.getElementById('voice-btn-'+inputId) || document.querySelector('[data-voice-input="'+inputId+'"]');
  if(!inp){ clarityVoiceStatus('Search field missing.'); return false; }

  /* Toggle: second tap stops & transcribes */
  if(_ws.recording && _ws.target === inputId){
    if(_ws.timer){ clearTimeout(_ws.timer); _ws.timer = null; }
    clarityVoiceFinish(inputId, onDone, _ws.startedAt);
    return false;
  }

  clarityVoiceStop();
  if(!window.isSecureContext && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1'){
    clarityVoiceStatus('Voice needs HTTPS.');
    return false;
  }
  if(!clarityVoiceSupported()){
    clarityVoiceStatus('Microphone API unavailable — type your theme.');
    return false;
  }

  _ws.target = inputId;
  _ws.onDone = onDone;
  _ws.chunks = [];
  _ws.token++;
  var startedAt = Date.now();
  _ws.startedAt = startedAt;

  clarityVoiceStatus('Allow mic if asked…');
  navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 }
  }).then(function(stream){
    _ws.stream = stream;
    var mime = '';
    try{
      if(MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) mime = 'audio/webm;codecs=opus';
      else if(MediaRecorder.isTypeSupported('audio/webm')) mime = 'audio/webm';
      else if(MediaRecorder.isTypeSupported('audio/mp4')) mime = 'audio/mp4';
    }catch(e){}
    var rec;
    try{ rec = mime ? new MediaRecorder(stream, {mimeType: mime}) : new MediaRecorder(stream); }
    catch(e){ rec = new MediaRecorder(stream); }
    _ws.rec = rec;
    _ws.chunks = [];
    rec.ondataavailable = function(ev){
      if(ev.data && ev.data.size > 0) _ws.chunks.push(ev.data);
    };
    rec.start(250);
    _ws.recording = true;
    if(btn){ btn.classList.add('listening'); btn.setAttribute('aria-pressed','true'); }
    clarityVoiceStatus('Recording… speak your theme, tap Voice again to search');
    /* Auto-stop after 6s */
    _ws.timer = setTimeout(function(){
      if(_ws.recording && _ws.target === inputId){
        clarityVoiceFinish(inputId, onDone, startedAt);
      }
    }, 6000);
  }).catch(function(err){
    console.warn('getUserMedia', err);
    clarityVoiceStop();
    clarityVoiceStatus('Microphone blocked — allow mic for this site.');
  });
  return true;
}
window.clarityVoiceSearch = clarityVoiceSearch;
window.clarityVoiceStop = clarityVoiceStop;
window.clarityVoiceSupported = clarityVoiceSupported;

function clarityBindVoiceSearch(){
  document.querySelectorAll('[data-voice-input]').forEach(function(btn){
    if(btn._vsWhisper) return;
    btn._vsWhisper = true;
    try{ btn.removeAttribute('onclick'); }catch(e){}
    btn.addEventListener('click', function(e){
      if(e){ e.preventDefault(); e.stopPropagation(); }
      clarityVoiceSearch(btn.getAttribute('data-voice-input'), btn.getAttribute('data-voice-fn'));
    });
  });
}
window.clarityBindVoiceSearch = clarityBindVoiceSearch;
if(document.readyState==='loading')
  document.addEventListener('DOMContentLoaded', clarityBindVoiceSearch);
else setTimeout(clarityBindVoiceSearch, 0);
setTimeout(clarityBindVoiceSearch, 1000);

function clarityExportSearchFns(){
  try{
    if(typeof searchMasnoonDua==='function') window.searchMasnoonDua = searchMasnoonDua;
    if(typeof searchQuran==='function') window.searchQuran = searchQuran;
    if(typeof searchHadith==='function') window.searchHadith = searchHadith;
    if(typeof searchLifeOrHadith==='function') window.searchLifeOrHadith = searchLifeOrHadith;
    if(typeof clarityClearSearch==='function') window.clarityClearSearch = clarityClearSearch;
    if(typeof clarityVoiceSearch==='function') window.clarityVoiceSearch = clarityVoiceSearch;
  }catch(e){}
}
try{
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', clarityExportSearchFns);
  else setTimeout(clarityExportSearchFns, 30);
  setTimeout(clarityExportSearchFns, 500);
  setTimeout(clarityExportSearchFns, 2000);
}catch(e){}

function clarityBindVoiceSearch(){
  try {
    if (typeof clarityExportSearchFns === 'function') clarityExportSearchFns();
    document.querySelectorAll('[data-voice-input]').forEach(function(btn){
      try { btn.removeAttribute('onclick'); } catch (e) {}
      if (btn._voiceBound) return;
      btn._voiceBound = true;
      btn.addEventListener('click', function(ev){
        try {
          if (ev) { ev.preventDefault(); ev.stopPropagation(); }
          if (btn._voiceRunning) return;
          btn._voiceRunning = true;
          setTimeout(function(){ btn._voiceRunning = false; }, 600);
          var id = btn.getAttribute('data-voice-input');
          var fn = btn.getAttribute('data-voice-fn');
          if (typeof window.clarityVoiceSearch === 'function') window.clarityVoiceSearch(id, fn);
          else if (typeof clarityVoiceSearch === 'function') clarityVoiceSearch(id, fn);
          else alert('Voice not loaded — hard-refresh the page (HTTPS required).');
        } catch (err) {
          console.warn('voice click', err);
          try { alert(err && err.message ? err.message : String(err)); } catch (e2) {}
        }
      }, true);
    });
  } catch (e) { console.warn('bind voice', e); }
}

try{
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', function(){ try{clarityExportSearchFns();}catch(e){} try{clarityBindVoiceSearch();}catch(e){} });
  else { try{clarityExportSearchFns();}catch(e){} try{clarityBindVoiceSearch();}catch(e){} }
  setTimeout(function(){ try{clarityBindVoiceSearch();}catch(e){} }, 1200);
}catch(e){}

try {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', clarityBindVoiceSearch);
  else setTimeout(clarityBindVoiceSearch, 50);
} catch (e) {}

function clarityBootTraffic(){
  try{ clarityRefreshAllVisitBadges(); }catch(e){}
  try{
    var tab = document.body.getAttribute('data-active-tab') || 'journey';
    trackTabVisit(tab);
  }catch(e){}
}
try{
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', clarityBootTraffic);
  else setTimeout(clarityBootTraffic, 100);
}catch(e){}

async function loadAllTabCounts(){
  var keys = (typeof tabKeys !== 'undefined') ? Object.keys(tabKeys) : [];
  for (var i = 0; i < keys.length; i++) {
    var tabId = keys[i];
    var el = document.getElementById('vc-' + tabId);
    if (!el) continue;
    try {
      var localKey = 'clarity_vc_local_' + tabId;
      var n = parseInt(clarityLS.getItem(localKey) || '0', 10) || 0;
      if (n > 0) el.textContent = formatCount(n) + ' local';
      var key = tabKeys[tabId];
      if (!key) continue;
      var res = await fetch('https://api.countapi.xyz/get/' + key, { mode: 'cors' }).catch(function(){ return null; });
      var data = res && res.ok ? await res.json() : null;
      if (data && data.value != null) el.textContent = formatCount(data.value) + ' unique';
    } catch (e) {}
  }
}

function openMemeStudio(){switchTab('reality');try{history.replaceState(null,'','#meme');}catch(e){}setTimeout(function(){var el=document.getElementById('meme-card');if(el)el.scrollIntoView({behavior:'smooth',block:'start'});},100);}

/* ===== Clarity path router (SEO-friendly URLs) =====
 * Hosting must rewrite clean paths → index.html (Vercel/Netlify/nginx).
 * Without rewrite, only / and /index.html work; /seerah 404s on static hosts.
 */
var CLARITY_ROUTES = {
  '': { tab: 'journey', title: 'Clarity – Furnish Your Grave' },
  'index.html': { tab: 'journey', title: 'Clarity – Furnish Your Grave' },
  'journey': { tab: 'journey', title: 'Journey · Clarity' },
  'seerah': { tab: 'seerah', title: 'Seerah · Clarity', desc: 'Prophetic biography, ṣaḥīḥ reports, and daily seerah moments. Educational only.' },
  'tajweed': { tab: 'tajweed', title: 'Tajweed · Clarity' },
  'tafseer': { tab: 'tafseer', title: 'Tafsir · Clarity' },
  'tafsir': { tab: 'tafseer', title: 'Tafsir · Clarity' },
  'lectures': { tab: 'lectures', title: 'Lectures · Clarity' },
  'commands': { tab: 'commands', title: 'Commands · Clarity' },
  'grave': { tab: 'grave', title: 'Grave preparation · Clarity', desc: 'Furnish your grave with deeds, reminders, and janazah outline. Educational only.' },
  'janazah': { tab: 'grave', scroll: 'janazah', title: 'Janazah prayer · Clarity' },
  'janazah-prayer': { tab: 'grave', scroll: 'janazah', title: 'Janazah prayer · Clarity', desc: 'Outline of funeral prayer practice; schools differ — follow your imam.' },
  'search': { tab: 'search', title: 'Search & guidance · Clarity' },
  'guidance': { tab: 'search', scroll: 'hajj', title: 'Hajj guidance · Clarity' },
  'hajj': { tab: 'search', scroll: 'hajj', title: 'Hajj guidance · Clarity' },
  'notes': { tab: 'about', scroll: 'notes-editor', title: 'Notes · Clarity' },
  'journal': { tab: 'about', scroll: 'notes-editor', title: 'Notes · Clarity' },
  'about': { tab: 'about', title: 'About & notes · Clarity' },
  'fiqh': { tab: 'notes', scroll: 'fiqh', title: 'Fiqh tools · Clarity' },
  'fiqh-tools': { tab: 'notes', scroll: 'fiqh', title: 'Fiqh tools · Clarity', desc: 'Family tree, farāʾiḍ study aid, wasiyyah draft. Educational — not a fatwa.' },
  'family-tree': { tab: 'notes', scroll: 'tree', title: 'Family tree · Clarity' },
  'faraid': { tab: 'notes', scroll: 'faraid', title: 'Farāʾiḍ · Clarity' },
  'wasiyyah': { tab: 'notes', scroll: 'wasiyyah', title: 'Wasiyyah · Clarity' },
  'meme': { tab: 'about', scroll: 'meme', title: 'Meme Studio · Clarity', desc: 'Clarity Meme Studio — reverent text on free stock backgrounds.' },
  'memes': { tab: 'about', scroll: 'meme', title: 'Meme Studio · Clarity' },
  'about': { tab: 'about', title: 'About · Clarity' },
  'quiz': { tab: 'notes', scroll: 'quiz', title: 'Sharia IQ · Clarity' }
};
function clarityBaseOrigin(){
  try{ return window.location.origin || 'https://clarity-dawah.fyi'; }catch(e){ return 'https://clarity-dawah.fyi'; }
}
function clarityPathKey(){
  try{
    var path = (window.location.pathname || '/').replace(/\/+/g, '/');
    if(path.length > 1 && path.slice(-1) === '/') path = path.slice(0, -1);
    var parts = path.split('/').filter(Boolean);
    /* support /seerah or /app/seerah */
    var key = (parts[parts.length - 1] || '').toLowerCase();
    if(!key || key === 'index.html'){
      var hash = (window.location.hash || '').replace(/^#/, '').split('?')[0].trim().toLowerCase();
      if(hash) key = hash;
    }
    return key;
  }catch(e){ return ''; }
}
function clarityApplyDocMeta(route, key){
  try{
    if(route && route.title) document.title = route.title;
    var can = document.getElementById('clarity-canonical');
    var path = key ? ('/' + key) : '/';
    if(key === 'index.html') path = '/';
    var url = clarityBaseOrigin() + (path === '/' ? '/' : path);
    if(can) can.setAttribute('href', url);
    var og = document.querySelector('meta[property="og:url"]');
    if(og) og.setAttribute('content', url);
    if(route && route.desc){
      var md = document.querySelector('meta[name="description"]');
      if(md) md.setAttribute('content', route.desc);
      var od = document.querySelector('meta[property="og:description"]');
      if(od) od.setAttribute('content', route.desc);
    }
  }catch(e){}
}
function clarityScrollRouteTarget(scroll){
  if(!scroll) return;
  setTimeout(function(){
    try{
      var map = {
        janazah: function(){
          var el = null;
          document.querySelectorAll('h2').forEach(function(h){
            if(/Janāzah|Janazah/i.test(h.textContent||'')) el = h.closest('.card') || h;
          });
          return el;
        },
        hajj: function(){ return document.getElementById('hajj-guide-card'); },
        fiqh: function(){ return document.getElementById('fiqh-workflow-card') || document.getElementById('user-family-tree-card'); },
        tree: function(){ return document.getElementById('user-family-tree-card'); },
        faraid: function(){ return document.getElementById('faraid-card'); },
        wasiyyah: function(){ return document.getElementById('wasiyyah-card'); },
        meme: function(){ return document.getElementById('meme-card'); },
        quiz: function(){ return document.getElementById('fiqh-quiz-card'); },
        'notes-editor': function(){ return document.getElementById('notes-shell') || document.getElementById('notes-editor-pane'); }
      };
      var el = (typeof map[scroll] === 'function') ? map[scroll]() : document.getElementById(scroll);
      if(el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }catch(e){}
  }, 150);
}
function clarityNavigate(key, opts){
  opts = opts || {};
  key = String(key || '').replace(/^#/, '').replace(/^\//, '').toLowerCase();
  var route = CLARITY_ROUTES[key] || CLARITY_ROUTES[''];
  var tab = route.tab || 'journey';
  try{
    if(typeof switchTab === 'function') switchTab(tab, { fromRouter: true });
  }catch(e){}
  clarityApplyDocMeta(route, key && CLARITY_ROUTES[key] ? key : '');
  clarityScrollRouteTarget(route.scroll);
  if(!opts.replaceOnly){
    try{
      var hash = (!key || key === 'journey') ? '' : ('#' + key);
      var url = (window.location.pathname || '/') + (window.location.search || '') + hash;
      if(opts.replace) history.replaceState({ clarityTab: tab, clarityKey: key }, route.title || '', url);
      else if(!opts.skipHistory) history.replaceState({ clarityTab: tab, clarityKey: key }, route.title || '', url);
    }catch(e2){}
  }
}
function initTabFromHash(){
  var key = clarityPathKey();
  var route = CLARITY_ROUTES[key];
  if(route){
    clarityNavigate(key, { replace: true, skipHistory: true });
    return;
  }
  /* legacy hash-only */
  var hash = (window.location.hash || '').replace(/^#/, '').split('?')[0].trim().toLowerCase();
  var validTabs = ['journey','seerah','tajweed','tafseer','lectures','commands','grave','search','notes','about'];
  if(hash && validTabs.indexOf(hash) >= 0){
    clarityNavigate(hash, { replace: true, skipHistory: true });
  } else if(hash && CLARITY_ROUTES[hash]){
    clarityNavigate(hash, { replace: true, skipHistory: true });
  } else {
    var last = '';
    try{ last = clarityLS.getItem('clarity_last_tab') || ''; }catch(e){}
    if(last && validTabs.indexOf(last) >= 0) clarityNavigate(last, { replace: true, skipHistory: true });
    else clarityNavigate('journey', { replace: true, skipHistory: true });
  }
}
try{
  window.clarityNavigate = clarityNavigate;
  window.CLARITY_ROUTES = CLARITY_ROUTES;
  window.initTabFromHash = initTabFromHash;
  window.addEventListener('popstate', function(){ initTabFromHash(); });
}catch(eR){}
let isPlaying=false,isMuted=false,previousVolume=0.85;const audio=document.getElementById("quran-audio")||document.createElement("audio");if(!audio.id){audio.id="quran-audio-dup2";audio.preload="none";audio.hidden=true;document.body.appendChild(audio);}try{audio.volume=0.85;}catch(e){}function changeStream(){const sel=document.getElementById("stream-select");const url=sel&&sel.value;if(!url||!audio)return;const wasPlaying=isPlaying;try{audio.pause();}catch(e){}isPlaying=false;updateStreamUI("stopped");audio.src=url;audio.load();if(wasPlaying)setTimeout(toggleQuranStream,400);}function updateStreamUI(state){const btn=document.getElementById("stream-btn");const icon=document.getElementById("stream-icon");const text=document.getElementById("stream-text");if(btn)btn.classList.remove("playing","loading");if(state==="playing"){if(btn)btn.classList.add("playing");if(icon)icon.textContent="⏸";if(text)text.textContent="Pause Quran";}else if(state==="loading"){if(btn)btn.classList.add("loading");if(icon)icon.textContent="⏳";if(text)text.textContent="Connecting…";}else{if(icon)icon.textContent="▶";if(text)text.textContent="Listen to Quran";}}function toggleQuranStream(){if(!audio)return;if(!audio.src){var _ss=document.getElementById("stream-select");audio.src=(_ss&&_ss.value)||"https://qurango.net/radio/tarateel";audio.load();}if(!isPlaying){updateStreamUI("loading");audio.play().then(()=>{isPlaying=true;updateStreamUI("playing");}).catch(()=>{isPlaying=false;updateStreamUI("stopped");const sel=document.getElementById("stream-select");if(sel.selectedIndex<sel.options.length-1){sel.selectedIndex++;changeStream();setTimeout(toggleQuranStream,600);}else alert("Stream temporarily unavailable. Try another station.");});}else{audio.pause();isPlaying=false;updateStreamUI("stopped");}}function setVolume(val){if(!audio)return;audio.volume=parseFloat(val)||0;var mb=document.getElementById("mute-btn");if(audio.volume>0){isMuted=false;if(mb)mb.textContent="🔊";}else{isMuted=true;if(mb)mb.textContent="🔇";}previousVolume=audio.volume||previousVolume;}function toggleMute(){if(!audio)return;var vs=document.getElementById("volume-slider");var mb=document.getElementById("mute-btn");if(isMuted){audio.volume=previousVolume||0.85;if(vs)vs.value=audio.volume;isMuted=false;if(mb)mb.textContent="🔊";}else{previousVolume=audio.volume;audio.volume=0;if(vs)vs.value=0;isMuted=true;if(mb)mb.textContent="🔇";}}function updateDailyStreak(){const today=new Date().toDateString();const last=clarityLS.getItem("clarity_last_day");let streak=parseInt(clarityLS.getItem("clarity_streak")||"0");if(last!==today){const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);streak=(last===yesterday.toDateString())?streak+1:1;clarityLS.setItem("clarity_streak",streak);clarityLS.setItem("clarity_last_day",today);}updateStats();}function recordLesson(){let count=parseInt(clarityLS.getItem("clarity_lessons")||"0")+1;clarityLS.setItem("clarity_lessons",count);updateDailyStreak();updateStats();}let hifzRecallHidden=false;const surahAyahCounts={1:7,2:286,3:200,4:176,5:120,6:165,7:206,8:75,9:129,10:109,11:123,12:111,13:43,14:52,15:99,16:128,17:111,18:110,19:98,20:135,21:112,22:78,23:118,24:64,25:77,26:227,27:93,28:88,29:69,30:60,31:34,32:30,33:73,34:54,35:45,36:83,37:182,38:88,39:75,40:85,41:54,42:53,43:89,44:59,45:37,46:35,47:38,48:29,49:18,50:45,51:60,52:49,53:62,54:55,55:78,56:96,57:29,58:22,59:24,60:13,61:14,62:11,63:11,64:18,65:12,66:12,67:30,68:52,69:52,70:44,71:28,72:28,73:20,74:56,75:40,76:31,77:50,78:40,79:46,80:42,81:29,82:19,83:36,84:25,85:22,86:17,87:19,88:26,89:30,90:20,91:15,92:21,93:11,94:8,95:8,96:19,97:5,98:8,99:8,100:11,101:11,102:8,103:3,104:9,105:5,106:4,107:7,108:3,109:6,110:3,111:5,112:4,113:5,114:6};function saveHifzSelection(){const surah=document.getElementById("hifz-surah").value;const ayah=document.getElementById("hifz-ayah-num").value;clarityLS.setItem("clarity_hifz_surah",surah);clarityLS.setItem("clarity_hifz_ayah",ayah);}function restoreHifzSelection(){const savedSurah=clarityLS.getItem("clarity_hifz_surah");const savedAyah=clarityLS.getItem("clarity_hifz_ayah");if(savedSurah){const sel=document.getElementById("hifz-surah");if([...sel.options].some(o=>o.value===savedSurah)){sel.value=savedSurah;}}if(savedAyah){document.getElementById("hifz-ayah-num").value=savedAyah;}}const shortTafseer={"1:1":"Bismillah teaches that every action should begin with the Name of Allah — the Most Gracious, Most Merciful. Starting with His Name invites barakah and protection.","1:2":"All praise belongs to Allah, Lord of all worlds. This ayah establishes pure Tawhid of Lordship and gratitude as the foundation of worship.","1:3":"Ar-Rahman and Ar-Rahim highlight Allah’s vast and specific mercy. The believer lives between hope in His mercy and fear of His justice.","1:4":"Master of the Day of Judgement. Reminds us that ultimate accountability belongs to Allah alone — a powerful motivator for sincerity.","1:5":"You alone we worship and You alone we ask for help. The heart of the Surah: exclusive worship and exclusive reliance (Tawhid of Uluhiyyah and Rububiyyah).","1:6":"Guide us to the Straight Path. The most comprehensive du‘a — we ask for continuous guidance, not a one-time gift.","1:7":"The path of those You have favoured, not of those who earned anger or went astray. We seek the way of the Prophets and righteous, avoiding both extremes.","112:1":"Say: He is Allah, the One. Pure Tawhid — Allah is unique, without partner, equal or rival.","112:2":"Allah, the Eternal Refuge (As-Samad). Everything depends on Him; He depends on nothing.","112:3":"He neither begets nor is born. Refutes all claims of divine lineage or partnership.","112:4":"And there is none comparable to Him. Completes the negation of any likeness — the essence of Tawhid.","113:1":"Seek refuge in the Lord of the daybreak. Protection begins with turning to Allah against all external and internal harm.","114:1":"Seek refuge in the Lord of mankind. The final Surah teaches complete dependence on Allah as King, God and Protector of all people.","36:1":"Ya-Sin. One of the names of the Prophet ﷺ or a letter whose full meaning is with Allah. The Surah is called the heart of the Quran.","67:1":"Blessed is He in Whose Hand is the dominion. Establishes Allah’s absolute sovereignty and the purpose of life as a test.","55:1":"The Most Merciful taught the Quran. Mercy precedes creation; the greatest mercy is the revelation of guidance.","18:1":"Praise be to Allah Who revealed the Book… Al-Kahf protects from the trials of Dajjal when read on Fridays; its stories teach refuge in caves of faith, knowledge, and gratitude."};async function loadHifzAyah(){const surah=document.getElementById("hifz-surah").value;let ayah=parseInt(document.getElementById("hifz-ayah-num").value)||1;const max=surahAyahCounts[surah]||7;if(ayah>max){ayah=max;document.getElementById("hifz-ayah-num").value=max;}if(ayah<1){ayah=1;document.getElementById("hifz-ayah-num").value=1;}saveHifzSelection();document.getElementById("hifz-arabic").textContent="Loading…";document.getElementById("hifz-translation").textContent="";const tafseerEl=document.getElementById("hifz-tafseer");if(tafseerEl){tafseerEl.style.display="none";tafseerEl.innerHTML="";}hifzRecallHidden=false;document.getElementById("hifz-translation").classList.remove("hifz-hidden");try{const[arRes,enRes]=await Promise.all([fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/quran-uthmani`),fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/en.sahih`)]);const arData=await arRes.json();const enData=await enRes.json();if(arData.data){document.getElementById("hifz-arabic").textContent=arData.data.text;document.getElementById("hifz-translation").textContent=enData.data?enData.data.text:"";const key=surah+":"+ayah;const note=shortTafseer[key];if(note&&tafseerEl){tafseerEl.innerHTML="<strong>Short reflection for memorisation:</strong> "+note;tafseerEl.style.display="block";}else if(tafseerEl){tafseerEl.innerHTML="<strong>Short reflection for memorisation:</strong> Reflect on the meaning while memorising. Ask: How does this ayah purify my heart and prepare my grave?";tafseerEl.style.display="block";}const tafseerFullEl=document.getElementById("hifz-tafseer-full");if(tafseerFullEl){let fullHtml="<strong>More detailed tafseer online:</strong><br>";fullHtml+="• <a href=\"https://quran.com/"+surah+"/"+ayah+"\" target=\"_blank\" rel=\"noopener\">Quran.com – verse page</a><br>";fullHtml+="• <a href=\"https://www.altafsir.com/Tafasir.asp?tMadhNo=0&tTafsirNo=74&tSoraNo="+surah+"&tAyahNo="+ayah+"&tDisplay=yes&UserProfile=0&LanguageId=2\" target=\"_blank\" rel=\"noopener\">Altafsir – Ibn Kathir (English)</a><br>";fullHtml+="• <a href=\"https://islamicstudies.info/tafheem.php?sura="+surah+"&verse="+ayah+"\" target=\"_blank\" rel=\"noopener\">Tafheem-ul-Quran (Maududi)</a>";tafseerFullEl.innerHTML=fullHtml;tafseerFullEl.style.display="block";}}}catch(e){document.getElementById("hifz-arabic").textContent="Could not load ayah.";}updateHifzTodayCount();}function toggleRecall(){hifzRecallHidden=!hifzRecallHidden;document.getElementById("hifz-translation").classList.toggle("hifz-hidden",hifzRecallHidden);}function nextHifzAyah(){const surah=document.getElementById("hifz-surah").value;let ayah=parseInt(document.getElementById("hifz-ayah-num").value)||1;const max=surahAyahCounts[surah]||7;ayah=ayah>=max?1:ayah+1;document.getElementById("hifz-ayah-num").value=ayah;loadHifzAyah();}function getHifzKey(){return"clarity_hifz_"+new Date().toDateString();}function markMemorized(){const key=getHifzKey();let count=parseInt(clarityLS.getItem(key)||"0")+1;clarityLS.setItem(key,count);updateHifzTodayCount();updateDailyStreak();const btn=event.target;const old=btn.textContent;btn.textContent="✓ Saved";setTimeout(()=>btn.textContent=old,1200);}function updateHifzTodayCount(){document.getElementById("hifz-today-count").textContent="Memorized today: "+(clarityLS.getItem(getHifzKey())||"0");}const tafseerLessons=[{id:"fatiha",title:"Surah Al-Fatihah – Complete Tafseer",desc:"The opening of the Book, the greatest Surah, and the foundation of every salah.",link:"https://www.youtube.com/results?search_query=Ustazah+Najiha+Hashmi+Surah+Fatiha"},{id:"baqarah1",title:"Surah Al-Baqarah (beginning)",desc:"The qualities of the believers, the disbelievers and the hypocrites.",link:"https://www.youtube.com/results?search_query=Ustazah+Najiha+Hashmi+Baqarah"},{id:"yasin",title:"Surah Ya-Sin",desc:"The heart of the Quran – themes of resurrection, warning and mercy.",link:"https://www.youtube.com/results?search_query=Ustazah+Najiha+Hashmi+Yasin"},{id:"mulk",title:"Surah Al-Mulk",desc:"Protection in the grave and the greatness of Allah’s dominion.",link:"https://www.youtube.com/results?search_query=Ustazah+Najiha+Hashmi+Mulk"},{id:"rahman",title:"Surah Ar-Rahman",desc:"The countless favours of the Most Merciful and the repeated question.",link:"https://www.youtube.com/results?search_query=Ustazah+Najiha+Hashmi+Rahman"},{id:"kahf",title:"Surah Al-Kahf",desc:"The four stories that protect from the fitnah of Dajjal.",link:"https://www.youtube.com/results?search_query=Ustazah+Najiha+Hashmi+Kahf"},{id:"ikhlas",title:"Surah Al-Ikhlas, Al-Falaq & An-Nas",desc:"Tawhid and the daily protection of the three Quls.",link:"https://www.youtube.com/results?search_query=Ustazah+Najiha+Hashmi+Ikhlas+Falaq+Nas"},{id:"araf",title:"Selected lessons from Surah Al-A’raf",desc:"Stories of previous nations and the dialogue between the people of Paradise and the Fire.",link:"https://www.youtube.com/results?search_query=Ustazah+Najiha+Hashmi+Araf"}];function getTafseerStudied(){try{return JSON.parse(clarityLS.getItem("clarity_tafseer_studied")||"[]");}catch(e){return[];}}function populateTafseerSelect(){const sel=document.getElementById("tafseer-select");if(!sel)return;while(sel.options.length>1)sel.remove(1);tafseerLessons.forEach(lesson=>{const opt=document.createElement("option");opt.value=lesson.id;opt.textContent=lesson.title;sel.appendChild(opt);});}function focusTafseerLesson(id){const items=document.querySelectorAll("#tafseer-list .tafseer-item");items.forEach(item=>{if(id==="all"){item.style.display="block";}else{item.style.display=item.dataset.id===id?"block":"none";}});}function renderTafseer(){const studied=getTafseerStudied();var _tc=document.getElementById("tafseer-count");if(_tc)_tc.textContent=studied.length;const last=clarityLS.getItem("clarity_tafseer_last");var _tl=document.getElementById("tafseer-last");if(_tl)_tl.textContent=last?"Last studied: "+last:"";const container=document.getElementById("tafseer-list");if(!container||!container.tagName)return;container.innerHTML="";populateTafseerSelect();tafseerLessons.forEach(lesson=>{const isStudied=studied.includes(lesson.id);const div=document.createElement("div");div.className="tafseer-item"+(isStudied?" studied":"");div.dataset.id=lesson.id;div.innerHTML=`
          <div class="story-title">${lesson.title}</div>
          <p style="font-size:0.94rem; margin:0.35rem 0;">${lesson.desc}</p>
          <a href="${lesson.link}" target="_blank" rel="noopener" style="color:var(--accent); font-size:0.88rem;">Watch / Listen on YouTube →</a>
          <br>
          <button type="button" class="btn-soft" style="margin-top:0.55rem; padding:0.35rem 0.95rem; font-size:0.86rem;"
            onclick="toggleTafseerStudied('${lesson.id}')">
            ${isStudied ? "✓ Studied – Unmark" : "Mark as Studied"}
          </button>`;container.appendChild(div);});const sel=document.getElementById("tafseer-select");if(sel)focusTafseerLesson(sel.value);}function toggleTafseerStudied(id){let studied=getTafseerStudied();if(studied.includes(id)){studied=studied.filter(x=>x!==id);}else{studied.push(id);clarityLS.setItem("clarity_tafseer_last",new Date().toDateString());updateDailyStreak();}clarityLS.setItem("clarity_tafseer_studied",JSON.stringify(studied));renderTafseer();}function updateNotifyStatus(){const enabled=clarityLS.getItem("clarity_notify")==="true";const toggle=document.getElementById("notify-toggle");const status=document.getElementById("notify-status");if(toggle)toggle.checked=enabled;if(!("Notification"in window)){status.textContent="Not supported";return;}if(Notification.permission==="denied")status.textContent="Permission blocked";else if(enabled&&Notification.permission==="granted")status.textContent="Reminders enabled";else status.textContent="";}function toggleDailyReminder(){const toggle=document.getElementById("notify-toggle");if(!toggle)return;if(toggle.checked){if(!("Notification"in window)){alert("Not supported");toggle.checked=false;return;}Notification.requestPermission().then(p=>{if(p==="granted"){clarityLS.setItem("clarity_notify","true");showDailyReminderIfNeeded();}else{clarityLS.setItem("clarity_notify","false");toggle.checked=false;}updateNotifyStatus();});}else{clarityLS.setItem("clarity_notify","false");updateNotifyStatus();}}function showDailyReminderIfNeeded(){if(clarityLS.getItem("clarity_notify")!=="true"||Notification.permission!=="granted")return;const today=new Date().toDateString();if(clarityLS.getItem("clarity_last_notify")!==today){try{new Notification("Clarity – Furnish Your Grave",{body:"Assalamu Alaikum. Take a few minutes today to send good deeds to your grave.",tag:"clarity-daily"});clarityLS.setItem("clarity_last_notify",today);}catch(e){}}}const rabbanaDuas=[{arabic:"رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",english:"Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",ref:"Quran 2:201"},{arabic:"رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا",english:"Our Lord, do not impose blame upon us if we have forgotten or erred.",ref:"Quran 2:286"},{arabic:"رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا",english:"Our Lord, and lay not upon us a burden like that which You laid upon those before us.",ref:"Quran 2:286"},{arabic:"رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ",english:"Our Lord, and burden us not with that which we have no ability to bear.",ref:"Quran 2:286"},{arabic:"رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً",english:"Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy.",ref:"Quran 3:8"},{arabic:"رَبَّنَا إِنَّنَا آمَنَّا فَاغْفِرْ لَنَا ذُنُوبَنَا وَقِنَا عَذَابَ النَّارِ",english:"Our Lord, indeed we have believed, so forgive us our sins and protect us from the punishment of the Fire.",ref:"Quran 3:16"},{arabic:"رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا",english:"Our Lord, forgive us our sins and the excess [committed] in our affairs and plant firmly our feet.",ref:"Quran 3:147"},{arabic:"رَبَّنَا مَا خَلَقْتَ هَٰذَا بَاطِلًا سُبْحَانَكَ فَقِنَا عَذَابَ النَّارِ",english:"Our Lord, You did not create this aimlessly; exalted are You; then protect us from the punishment of the Fire.",ref:"Quran 3:191"},{arabic:"رَبَّنَا إِنَّكَ مَن تُدْخِلِ النَّارَ فَقَدْ أَخْزَيْتَهُ",english:"Our Lord, indeed whoever You admit to the Fire – You have disgraced him.",ref:"Quran 3:192"},{arabic:"رَبَّنَا إِنَّنَا سَمِعْنَا مُنَادِيًا يُنَادِي لِلْإِيمَانِ أَنْ آمِنُوا بِرَبِّكُمْ فَآمَنَّا",english:"Our Lord, indeed we have heard a caller calling to faith, [saying], ‘Believe in your Lord,’ and we have believed.",ref:"Quran 3:193"},{arabic:"رَبَّنَا فَاغْفِرْ لَنَا ذُنُوبَنَا وَكَفِّرْ عَنَّا سَيِّئَاتِنَا وَتَوَفَّنَا مَعَ الْأَبْرَارِ",english:"Our Lord, so forgive us our sins and remove from us our misdeeds and cause us to die with the righteous.",ref:"Quran 3:193"},{arabic:"رَبَّنَا وَآتِنَا مَا وَعَدتَّنَا عَلَىٰ رُسُلِكَ وَلَا تُخْزِنَا يَوْمَ الْقِيَامَةِ",english:"Our Lord, and grant us what You promised us through Your messengers and do not disgrace us on the Day of Resurrection.",ref:"Quran 3:194"},{arabic:"رَبَّنَا آمَنَّا فَاكْتُبْنَا مَعَ الشَّاهِدِينَ",english:"Our Lord, we have believed, so register us among the witnesses.",ref:"Quran 5:83"},{arabic:"رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَتَوَفَّنَا مُسْلِمِينَ",english:"Our Lord, pour upon us patience and let us die as Muslims.",ref:"Quran 7:126"},{arabic:"رَبَّنَا لَا تَجْعَلْنَا فِتْنَةً لِّلْقَوْمِ الظَّالِمِينَ",english:"Our Lord, make us not [objects of] trial for the wrongdoing people.",ref:"Quran 10:85"},{arabic:"رَبَّنَا إِنَّكَ تَعْلَمُ مَا نُخْفِي وَمَا نُعْلِنُ",english:"Our Lord, indeed You know what we conceal and what we declare.",ref:"Quran 14:38"},{arabic:"رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي",english:"My Lord, make me an establisher of prayer, and [many] from my descendants.",ref:"Quran 14:40"},{arabic:"رَبَّنَا تَقَبَّلْ مِنَّا ۖ إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ",english:"Our Lord, accept [this] from us. Indeed You are the Hearing, the Knowing.",ref:"Quran 2:127"},{arabic:"رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",english:"Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.",ref:"Quran 25:74"},{arabic:"رَبَّنَا اصْرِفْ عَنَّا عَذَابَ جَهَنَّمَ ۖ إِنَّ عَذَابَهَا كَانَ غَرَامًا",english:"Our Lord, avert from us the punishment of Hell. Indeed, its punishment is ever adhering.",ref:"Quran 25:65"},{arabic:"رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ",english:"Our Lord, forgive us and our brothers who preceded us in faith.",ref:"Quran 59:10"},{arabic:"رَبَّنَا أَتْمِمْ لَنَا نُورَنَا وَاغْفِرْ لَنَا ۖ إِنَّكَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",english:"Our Lord, perfect for us our light and forgive us. Indeed, You are over all things competent.",ref:"Quran 66:8"},{arabic:"رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",english:"Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.",ref:"Quran 7:23"},{arabic:"رَبَّنَا آمَنَّا بِمَا أَنزَلْتَ وَاتَّبَعْنَا الرَّسُولَ فَاكْتُبْنَا مَعَ الشَّاهِدِينَ",english:"Our Lord, we have believed in what You revealed and have followed the messenger, so register us among the witnesses.",ref:"Quran 3:53"}];let rabbanaIndex=Math.floor(Date.now()/86400000)%(rabbanaDuas.length||1);function showRabbana(i){if(!rabbanaDuas.length)return;rabbanaIndex=((i%rabbanaDuas.length)+rabbanaDuas.length)%rabbanaDuas.length;const dua=rabbanaDuas[rabbanaIndex];const a=document.getElementById("rabbana-arabic");const e=document.getElementById("rabbana-english");const r=document.getElementById("rabbana-ref");const c=document.getElementById("rabbana-count");if(a)a.textContent=dua.arabic;if(e)e.textContent=dua.english;if(r)r.textContent=dua.ref;if(c)c.textContent=(rabbanaIndex+1)+' / '+rabbanaDuas.length;}function setDailyRabbana(){showRabbana(rabbanaIndex);}function cycleRabbana(dir){showRabbana(rabbanaIndex+(dir||1));}const OFFICIAL_HARAMAIN={makkah:{channelId:"UCos52azQNBgW63_9uDJoPDA",watchUrl:"https://www.youtube.com/@SaudiQuranTv/live",label:"Quran TV · Makkah",sources:[{kind:"channel",host:"www.youtube.com",id:"UCos52azQNBgW63_9uDJoPDA"},{kind:"channel",host:"www.youtube-nocookie.com",id:"UCos52azQNBgW63_9uDJoPDA"},{kind:"video",host:"www.youtube.com",id:"PLkCnLrKN8Q"},{kind:"video",host:"www.youtube-nocookie.com",id:"PLkCnLrKN8Q"},{kind:"video",host:"www.youtube.com",id:"Qvcimc6QQY8"},{kind:"video",host:"www.youtube.com",id:"kSUjZBv5wXg"}]},madinah:{channelId:"UCROKYPep-UuODNwyipe6JMw",watchUrl:"https://www.youtube.com/@SaudiSunnahTv/live",label:"Sunnah TV · Madinah",sources:[{kind:"channel",host:"www.youtube.com",id:"UCROKYPep-UuODNwyipe6JMw"},{kind:"channel",host:"www.youtube-nocookie.com",id:"UCROKYPep-UuODNwyipe6JMw"},{kind:"video",host:"www.youtube.com",id:"Rs7St51oDDc"},{kind:"video",host:"www.youtube-nocookie.com",id:"Rs7St51oDDc"},{kind:"video",host:"www.youtube.com",id:"ATMosZ7Xq1c"},{kind:"video",host:"www.youtube.com",id:"27cln-IxOGo"}]}};let haramainSrcIdx=0;function officialLiveEmbedUrl(source){let host=(source&&source.host)||"www.youtube-nocookie.com";if(String(host).indexOf("youtube")>=0&&String(host).indexOf("nocookie")<0)host="www.youtube-nocookie.com";const qs="autoplay=1&mute=1&controls=1&modestbranding=1&playsinline=1&rel=0&enablejsapi=1";if(source&&source.kind==="video"){return"https://"+host+"/embed/"+encodeURIComponent(source.id)+"?"+qs;}const ch=(source&&source.id)||(source&&source.channelId);return"https://"+host+"/embed/live_stream?channel="+encodeURIComponent(ch)+"&"+qs;}function currentHaramainOfficial(){const pref=clarityLS.getItem("clarity_haramain_place");const img=currentBannerPlace();const key=pref||(img&&img.placeKey)||"makkah";return OFFICIAL_HARAMAIN[key]||OFFICIAL_HARAMAIN.makkah;}function applyHaramainSource(idx){const official=currentHaramainOfficial();const list=official.sources||[];if(!list.length)return null;haramainSrcIdx=((idx%list.length)+list.length)%list.length;const src=list[haramainSrcIdx];const liveEl=document.getElementById("banner-live");if(!liveEl)return src;liveEl.setAttribute("title","Official live · "+official.label);liveEl.src=officialLiveEmbedUrl(src);return src;}function rotateHaramainSource(){applyHaramainSource(haramainSrcIdx+1);}const bannerImages=[{urls:["https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg","https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1600&q=80"],caption:"Masjid al-Haram • The Holy Kaaba, Makkah",lat:21.4225,lon:39.8262,placeKey:"makkah",cssBg:"linear-gradient(160deg,#1a5c45 0%,#0f4c3a 40%,#0a2e22 100%)"},{urls:["https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg/1280px-Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Al-Masjid_an-Nabawi_%28The_Prophet%27s_Mosque%29.jpg/1280px-Al-Masjid_an-Nabawi_%28The_Prophet%27s_Mosque%29.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Green_Dome_and_Prophet%27s_Mosque.jpg/1280px-Green_Dome_and_Prophet%27s_Mosque.jpg","https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1600&q=80"],caption:"Masjid an-Nabawi • The Prophet’s Mosque, Madinah",lat:24.4672,lon:39.6117,placeKey:"madinah",cssBg:"linear-gradient(160deg,#1e3a5f 0%,#0f2a44 40%,#0a1a28 100%)"},{urls:["https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Masjid_al-Haram_in_Makkah.jpg/1280px-Masjid_al-Haram_in_Makkah.jpg","https://images.unsplash.com/photo-1519817650390-64a5db1d0498?auto=format&fit=crop&w=1600&q=80","https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1600&q=80","https://images.unsplash.com/photo-1580418827493-f2b22c0dc151?auto=format&fit=crop&w=1600&q=80"],caption:"The Two Holy Mosques • Haramain",lat:21.4225,lon:39.8262,placeKey:"makkah",cssBg:"linear-gradient(160deg,#2a4a3a 0%,#0f4c3a 50%,#0a2e22 100%)"}];let bannerLiveTimer=null;let bannerUrlIdx=0;function setBannerFallbackStill(){if(navigator.onLine!==false&&localStorage.getItem("clarity_haramain_live")!=="off")return;const media=document.getElementById("banner-media");const liveEl=document.getElementById("banner-live");const imgEl=document.getElementById("banner-img");const stillFb=document.getElementById("banner-still-fallback");if(media){media.classList.remove("live-active");media.classList.add("live-fallback");}if(liveEl){try{liveEl.removeAttribute("src");liveEl.src="about:blank";}catch(e){}}const place=typeof currentBannerPlace==="function"?currentBannerPlace():null;if(stillFb){stillFb.style.opacity="1";stillFb.style.zIndex="2";stillFb.style.background=place&&place.cssBg?place.cssBg:"linear-gradient(160deg,#1a5c45 0%,#0f4c3a 40%,#0a2e22 100%)";stillFb.style.backgroundSize="cover";}if(imgEl&&place&&place.urls&&place.urls.length){tryBannerImage(place.urls,0);}else if(imgEl){imgEl.style.opacity="0.5";}const st=document.getElementById("banner-live-status");if(st)st.textContent="Still view · open 🔴 Live for stream";}function tryBannerImage(urls,idx){const imgEl=document.getElementById("banner-img");const stillFb=document.getElementById("banner-still-fallback");if(!imgEl||!urls||!urls.length){if(stillFb){stillFb.style.opacity="1";stillFb.style.zIndex="2";}return;}bannerUrlIdx=idx||0;if(bannerUrlIdx>=urls.length){imgEl.style.opacity="0";if(stillFb){stillFb.style.opacity="1";stillFb.style.zIndex="2";const place=typeof currentBannerPlace==="function"?currentBannerPlace():null;if(place&&place.cssBg)stillFb.style.background=place.cssBg;}return;}imgEl.style.display="block";imgEl.style.opacity="0.85";imgEl.style.zIndex="1";imgEl.onerror=function(){tryBannerImage(urls,bannerUrlIdx+1);};imgEl.onload=function(){imgEl.style.opacity="0.85";if(stillFb){stillFb.style.opacity="0.35";stillFb.style.zIndex="0";}};imgEl.src=urls[bannerUrlIdx];}let bannerPlaceIdx=0;function currentBannerPlace(){return bannerImages[bannerPlaceIdx%bannerImages.length];}function setDailyBanner(forceIdx){if(typeof forceIdx==="number")bannerPlaceIdx=forceIdx;else{const pref=clarityLS.getItem("clarity_haramain_place");const pidx=bannerImages.findIndex(function(b){return b.placeKey===pref;});bannerPlaceIdx=pidx>=0?pidx:(Math.floor(Date.now()/3600000)%bannerImages.length);}const img=currentBannerPlace();const official=OFFICIAL_HARAMAIN[img.placeKey]||OFFICIAL_HARAMAIN.makkah;const liveEl=document.getElementById("banner-live");const media=document.getElementById("banner-media");const stillFb=document.getElementById("banner-still-fallback");if(stillFb)stillFb.style.background=img.cssBg||"";const bust=img.urls.map(function(u){const sep=u.indexOf("?")>=0?"&":"?";return u+sep+"cb="+Math.floor(Date.now()/3600000);});tryBannerImage(bust,0);const wantLive=clarityLS.getItem("clarity_haramain_live")!=="off";const canEmbed=wantLive&&navigator.onLine&&location.protocol!=="file:"&&liveEl&&official.channelId;syncHaramainLiveUI();if(canEmbed){haramainSrcIdx=0;applyHaramainSource(0);if(media){media.classList.remove("live-fallback");media.classList.add("live-active");}if(bannerLiveTimer)clearTimeout(bannerLiveTimer);bannerLiveTimer=setTimeout(function(){if(!navigator.onLine){setBannerFallbackStill();return;}rotateHaramainSource();bannerLiveTimer=setTimeout(rotateHaramainSource,9000);},7000);}else{if(liveEl){try{liveEl.removeAttribute("src");}catch(e){}}if(media){media.classList.remove("live-active");media.classList.add("live-fallback");}}const placeEl=document.getElementById("place-name");if(placeEl){placeEl.innerHTML=img.caption+' <span class="temp-live" id="place-temp-alt"></span>';}loadPlaceTemperature(img.lat,img.lon);}function cycleBannerStill(){bannerPlaceIdx=(bannerPlaceIdx+1)%bannerImages.length;setDailyBanner(bannerPlaceIdx);}function tryBannerLiveEmbed(){ /* obliterated */ }
function syncHaramainLiveUI(){
  try {
    var btn = document.getElementById("live-haramain-btn");
    var lab = document.getElementById("live-haramain-label");
    if (btn) btn.classList.remove("on");
    if (lab) lab.textContent = "Stills";
  } catch (e) {}
}
function toggleHaramainLive(){
  try {
    if (typeof window.nurosBannerStill === "function") {
      window.nurosBannerStill((typeof bannerPlaceIdx === "number" ? bannerPlaceIdx : 0) + 1);
    } else if (typeof setDailyBanner === "function") {
      setDailyBanner((typeof bannerPlaceIdx === "number" ? bannerPlaceIdx : 0) + 1);
    }
  } catch (e) {}
}
function changeHaramainPlace(){
  try {
    var place = (document.getElementById("live-place-select") || {}).value || "makkah";
    try { localStorage.setItem("clarity_haramain_place", place); } catch (e) {}
    if (typeof window.nurosBannerStill === "function") {
      window.nurosBannerStill(place === "madinah" ? 1 : 0);
    } else if (typeof setDailyBanner === "function") {
      var idx = (typeof bannerImages !== "undefined") ? bannerImages.findIndex(function(b){ return b.placeKey === place; }) : -1;
      if (idx >= 0) setDailyBanner(idx);
    }
  } catch (e) {}
}
window.addEventListener("offline",setBannerFallbackStill);async function loadPlaceTemperature(lat,lon){const el=document.getElementById("place-temp");if(!el)return;try{const res=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`);const data=await res.json();if(data.current&&data.current.temperature_2m!=null){const t=Math.round(data.current.temperature_2m);el.textContent=t+"°C";}else{el.textContent="—°C";}}catch(e){el.textContent="—°C";}}const islamicFestivals=[{name:"Isrāʾ & Miʿrāj",date:new Date(2027,0,5)},{name:"Laylat al-Barāʾah",date:new Date(2027,0,23)},{name:"Ramadan begins",date:new Date(2027,1,8)},{name:"Laylat al-Qadr (approx.)",date:new Date(2027,2,6)},{name:"Eid al-Fitr",date:new Date(2027,2,9)},{name:"Day of ʿArafah",date:new Date(2027,4,15)},{name:"Eid al-Aḍḥā",date:new Date(2027,4,16)},{name:"Islamic New Year 1449",date:new Date(2027,5,6)},{name:"ʿĀshūrāʾ",date:new Date(2027,5,15)},{name:"Mawlid an-Nabī",date:new Date(2027,7,14)}];let userGeo={lat:21.4225,lon:39.8262,city:"Makkah",country:"SA",timezone:"Asia/Riyadh",label:"Makkah"};let salahTimingsCache=null;let localClockTimer=null;function formatClockInTimezone(tz){try{return new Intl.DateTimeFormat(undefined,{timeZone:tz||undefined,hour:"2-digit",minute:"2-digit",hour12:true}).format(new Date());}catch(e){return new Date().toLocaleTimeString(undefined,{hour:"2-digit",minute:"2-digit"});}}function updateLocalClock(){const el=document.getElementById("hijri-local-time");if(el)el.textContent=formatClockInTimezone(userGeo.timezone);}function startLocalClock(){updateLocalClock();if(localClockTimer)clearInterval(localClockTimer);localClockTimer=setInterval(updateLocalClock,30000);}async function detectUserLocationByIP(){const locEl=document.getElementById("hijri-local-loc");const endpoints=[{url:"https://ipapi.co/json/",parse:(d)=>({lat:d.latitude,lon:d.longitude,city:d.city,country:d.country_code||d.country,timezone:d.timezone,label:[d.city,d.region,d.country_name||d.country].filter(Boolean).join(", ")})},{url:"https://ipwho.is/",parse:(d)=>({lat:d.latitude,lon:d.longitude,city:d.city,country:d.country_code,timezone:d.timezone&&d.timezone.id,label:[d.city,d.region,d.country].filter(Boolean).join(", ")})},{url:"https://api.ipbase.com/v1/json/",parse:(d)=>({lat:parseFloat(d.latitude),lon:parseFloat(d.longitude),city:d.city,country:d.country_code,timezone:d.time_zone,label:[d.city,d.region_name,d.country_name].filter(Boolean).join(", ")})}];for(const ep of endpoints){try{const controller=new AbortController();const to=setTimeout(()=>controller.abort(),5000);const res=await fetch(ep.url,{signal:controller.signal});clearTimeout(to);if(!res.ok)continue;const data=await res.json();const parsed=ep.parse(data);if(parsed&&parsed.lat!=null&&parsed.lon!=null&&!isNaN(parsed.lat)&&!isNaN(parsed.lon)){userGeo={lat:parsed.lat,lon:parsed.lon,city:parsed.city||"Your city",country:parsed.country||"",timezone:parsed.timezone||Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC",label:parsed.label||parsed.city||"Your location"};if(locEl)locEl.textContent=userGeo.label;return userGeo;}}catch(e){}}try{userGeo.timezone=Intl.DateTimeFormat().resolvedOptions().timeZone||userGeo.timezone;}catch(e){}if(locEl)locEl.textContent="Location approx. (Makkah times)";return userGeo;}function parsePrayerTimeToDate(timeStr){if(!timeStr)return null;const clean=String(timeStr).split(" ")[0];const[hh,mm]=clean.split(":").map(Number);if(isNaN(hh)||isNaN(mm))return null;const d=new Date();d.setHours(hh,mm,0,0);return d;}function renderSalahTimes(timings,meta){const listEl=document.getElementById("salah-times-list");const titleEl=document.getElementById("salah-title");const metaEl=document.getElementById("salah-meta");const msNext=document.getElementById("ms-next-prayer");if(!listEl)return;const order=[{key:"Fajr",label:"Fajr"},{key:"Sunrise",label:"Sunrise"},{key:"Dhuhr",label:"Dhuhr"},{key:"Asr",label:"Asr"},{key:"Maghrib",label:"Maghrib"},{key:"Isha",label:"Isha"}];const now=new Date();let nextIdx=-1;const rows=order.map((p,i)=>{const t=timings[p.key];const dt=parsePrayerTimeToDate(t);const passed=dt?dt<now:false;return{...p,time:t||"—",dt,passed,i};});for(let i=0;i<rows.length;i++){if(rows[i].key==="Sunrise")continue;if(rows[i].dt&&rows[i].dt>=now){nextIdx=i;break;}}listEl.innerHTML=rows.map((r,i)=>{const cls=[r.passed?"passed":"",i===nextIdx?"next-prayer":""].filter(Boolean).join(" ");return`<li class="${cls}"><span class="salah-name">${r.label}</span><span class="salah-time">${r.time}</span></li>`;}).join("");if(titleEl){const city=(userGeo.city||"Local").split(",")[0];titleEl.textContent=`Salah · ${city}`;}if(metaEl){const method=meta&&meta.method&&meta.method.name?meta.method.name:"Standard";metaEl.textContent=method.length>28?method.slice(0,26)+"…":method;}if(msNext){if(nextIdx>=0){const n=rows[nextIdx];msNext.innerHTML=`Next: ${n.label} <span class="ms-days">${n.time}</span>`;}else{const fajr=rows[0];msNext.innerHTML=`Next: Fajr <span class="ms-days">${fajr.time}</span>`;}}salahTimingsCache={timings,meta,at:Date.now()};}async function loadSalahTimings(){const listEl=document.getElementById("salah-times-list");if(listEl)listEl.innerHTML='<li><span class="salah-name">Loading…</span><span class="salah-time">…</span></li>';try{const url=`https://api.aladhan.com/v1/timings?latitude=${userGeo.lat}&longitude=${userGeo.lon}&method=2`;const res=await fetch(url);const data=await res.json();if(data.code===200&&data.data&&data.data.timings){renderSalahTimes(data.data.timings,data.data.meta);}else{if(listEl)listEl.innerHTML='<li><span class="salah-name">Unavailable</span><span class="salah-time">—</span></li>';}}catch(e){if(listEl)listEl.innerHTML='<li><span class="salah-name">Offline</span><span class="salah-time">—</span></li>';}}function updateUpcomingEventOneLiner(){const targets=["hijri-ms-event","ms-event"].map(function(id){return document.getElementById(id);}).filter(Boolean);if(!targets.length)return;const now=new Date();now.setHours(0,0,0,0);const upcoming=islamicFestivals.map(function(f){return{name:f.name,date:new Date(f.date)};}).filter(function(f){f.date.setHours(0,0,0,0);return f.date>=now;}).sort(function(a,b){return a.date-b.date;});var html;if(!upcoming.length){html="No upcoming events listed";}else{const next=upcoming[0];const days=Math.max(0,Math.ceil((next.date-now)/86400000));const label=days===0?"Today":days===1?"Tomorrow":days+" days";html='<a class="hijri-event-link" href="https://www.islamicfinder.org/islamic-calendar/" target="_blank" rel="noopener" title="Islamic calendar">'+next.name+'</a> <span class="ms-days">'+label+'</span>';}targets.forEach(function(el){el.innerHTML=html;});}async function loadHijriCalendarAndEvents(){const titleEl=document.getElementById("hijri-cal-title");const gridEl=document.getElementById("hijri-cal-grid");const metaEl=document.getElementById("hijri-cal-meta");const msHijri=document.getElementById("ms-hijri");try{const t=new Date();const dd=String(t.getDate()).padStart(2,"0");const mm=String(t.getMonth()+1).padStart(2,"0");const yyyy=t.getFullYear();const res=await fetch(`https://api.aladhan.com/v1/gToH/${dd}-${mm}-${yyyy}`);const data=await res.json();if(data.code===200&&data.data?.hijri){const h=data.data.hijri;const monthName=h.month.en;const year=h.year;const todayDay=parseInt(h.day,10);const hijriLabel=`${todayDay} ${monthName} ${year} AH`;if(titleEl)titleEl.textContent=`${monthName} ${year} AH`;if(metaEl)metaEl.textContent=`Today: ${todayDay} ${monthName}`;if(msHijri)msHijri.textContent=hijriLabel;const calRes=await fetch(`https://api.aladhan.com/v1/hToGCalendar/${h.month.number}/${year}`);const calData=await calRes.json();if(gridEl&&calData.code===200&&Array.isArray(calData.data)){const days=calData.data;let startOffset=0;if(days[0]&&days[0].gregorian&&days[0].gregorian.weekday){const map={SUNDAY:0,MONDAY:1,TUESDAY:2,WEDNESDAY:3,THURSDAY:4,FRIDAY:5,SATURDAY:6};startOffset=map[(days[0].gregorian.weekday.en||"").toUpperCase()]||0;}let html='<span class="dow">S</span><span class="dow">M</span><span class="dow">T</span><span class="dow">W</span><span class="dow">T</span><span class="dow">F</span><span class="dow">S</span>';for(let i=0;i<startOffset;i++)html+='<span class="day empty"></span>';days.forEach(d=>{const num=d.hijri?parseInt(d.hijri.day,10):0;const isToday=num===todayDay;html+=`<span class="day${isToday ? " today" : ""}">${num || ""}</span>`;});gridEl.innerHTML=html;}else if(gridEl){gridEl.innerHTML=`<span class="dow" style="grid-column:1/-1;text-align:center;">${todayDay} ${monthName}</span>`;}}else{if(titleEl)titleEl.textContent="Hijri Calendar";if(metaEl)metaEl.textContent="Unavailable";if(msHijri)msHijri.textContent="Hijri date";}}catch(e){if(titleEl)titleEl.textContent="Hijri Calendar";if(metaEl)metaEl.textContent="Offline";if(msHijri)msHijri.textContent="Hijri date";}updateUpcomingEventOneLiner();}async function initLocationSalahAndClock(){startLocalClock();await detectUserLocationByIP();startLocalClock();await loadSalahTimings();setInterval(()=>{if(salahTimingsCache&&salahTimingsCache.timings){renderSalahTimes(salahTimingsCache.timings,salahTimingsCache.meta);}},60000);}function loadScholarsLive(){const el=document.getElementById("scholars-live");if(!el)return;const notes=[{title:"Ibn al-Qayyim – Kitāb al-Rūḥ",text:"The soul is aware of visits and benefits from Qurʾān and sincere deeds of the living.",link:"https://islamqa.info/en/answers/12652"},{title:"Majority Ahl al-Sunnah view",text:"Duʿāʾ, istighfār, ṣadaqah, and ongoing charity (ṣadaqah jāriyah) are the strongest agreed means of benefit.",link:"https://islamqa.info/en/answers/763"},{title:"Prophetic practice",text:"The Prophet ﷺ himself sought forgiveness for the deceased and encouraged charity on their behalf.",link:"https://sunnah.com/search?q=forgiveness+dead"},{title:"Ghazālī on preparation",text:"Remembering death daily is the best preparation; the grave becomes a garden or a pit according to deeds sent ahead.",link:"https://www.ghazali.org/works/gz100.htm"}];const pick=notes[Math.floor(Math.random()*notes.length)];el.innerHTML=`<div class="ponder-box" style="border-left-color:#5a9e4a;"><strong>Today’s refreshed note — ${pick.title}:</strong> ${pick.text}<br><a href="${pick.link}" target="_blank" rel="noopener" style="font-size:0.88rem;">Open related resource →</a></div>`;}function getTodayKey(type){return"clarity_"+type+"_"+new Date().toDateString();}function updateDepositDisplay(){document.getElementById("istighfar-count").textContent=clarityLS.getItem(getTodayKey("istighfar"))||"0";document.getElementById("salawat-count").textContent=clarityLS.getItem(getTodayKey("salawat"))||"0";}function addDeposit(type){const key=getTodayKey(type);let val=parseInt(clarityLS.getItem(key)||"0")+1;clarityLS.setItem(key,val);document.getElementById(type==="istighfar"?"istighfar-count":"salawat-count").textContent=val;updateDailyStreak();}function resetDeposits(){clarityLS.setItem(getTodayKey("istighfar"),"0");clarityLS.setItem(getTodayKey("salawat"),"0");updateDepositDisplay();}const commandRefs=["2:153","2:183","2:208","2:254","2:278","3:102","3:200","4:1","4:36","4:59","4:135","5:1","5:8","5:35","8:29","9:119","22:77","24:21","33:41","33:56","33:70","47:7","49:1","49:6","49:11","49:12","57:28","58:9","59:18","61:10","61:14","66:6","66:8"];const commandFollowUps={"2:153":"1. When hardship hits, immediately turn to salah and sabr. 2. Make a list of past difficulties Allah already helped you through. 3. Teach family members the same response: prayer + patience instead of complaint.","2:183":"1. Plan Ramadan early: fix sleep, meal and Quran schedule. 2. Outside Ramadan, fast Mondays/Thursdays or the white days if able. 3. Use hunger to remember the poor and increase charity.","2:208":"1. Enter into Islam fully — not selectively. 2. Review one area of life still on ‘half measure’ and correct it. 3. Seek company that encourages complete submission.","2:254":"1. Spend from what you love before the day when trade and friendship end. 2. Give something today, even small. 3. Automate a monthly sadaqah if able.","2:278":"1. Leave residual interest/riba structures where you can. 2. Ask a scholar about complex contracts. 3. Prefer clear, halal earnings over doubtful gain.","3:102":"1. Daily self-check: “Am I conscious of Allah in this action?” 2. Keep a small notebook of private sins to seek forgiveness for. 3. End each day with istighfar and a short heart review.","3:200":"1. Persevere in obedience when motivation fades. 2. Guard the boundaries of the deen in public and private. 3. Stay patient with people and with Allah’s decree.","4:1":"1. Honour family ties; call a relative you have neglected. 2. Fear Allah in how you speak about kinship. 3. Teach children the sanctity of the womb and lineage.","4:36":"1. Worship Allah alone; review shirk of the heart (showing off). 2. Be good to parents, relatives, orphans, the needy, and neighbours. 3. One concrete kindness to a neighbour this week.","4:59":"1. Obey those in legitimate authority unless it involves clear disobedience to Allah. 2. In family and work, fulfil contracts and instructions with ihsan. 3. When leaders err, advise privately with wisdom, not public humiliation.","4:135":"1. Speak truth even if it costs money, status or relationships. 2. In business and online, refuse to favour relatives or friends over justice. 3. Practice: when tempted to hide a fault or exaggerate, choose the harder truth.","5:1":"1. Fulfil contracts and promises. 2. Review outstanding commitments and close one today. 3. Avoid casual promises you cannot keep.","5:8":"1. Stand for justice even against yourself or your group. 2. Do not let hatred of a people make you unjust. 3. In an argument online, pause before posting.","5:35":"1. Increase means of nearness: extra salah, Quran, dhikr, charity. 2. Strive against the lower self (jihad an-nafs) daily. 3. Make du‘a with His beautiful names and seek the means He loves.","8:29":"1. Have taqwa so Allah grants criterion (furqan) between truth and falsehood. 2. Ask Allah for clarity before major decisions. 3. Reduce sin that clouds the heart’s sight.","9:119":"1. Be with the truthful in speech and company. 2. Correct one habitual half-truth. 3. Seek friends who remind you of Allah.","22:77":"1. Bow and prostrate with presence, not haste. 2. Do good that benefits others. 3. Hope in Allah’s response after worship.","24:21":"1. Do not follow the footsteps of Shaytan — cut one path of temptation. 2. Guard eyes and screen time. 3. Replace a sinful habit slot with dhikr.","33:41":"1. Set a daily dhikr target (e.g. 100 Subhanallah, 100 Alhamdulillah, 100 Allahu Akbar). 2. After every salah, do the Sunnah tasbih. 3. Keep tongue moist with dhikr while walking, driving or waiting.","33:56":"1. Send salawat upon the Prophet ﷺ daily. 2. Teach children a short salawat. 3. Increase salawat on Fridays.","33:70":"1. Before speaking, pause and ask: “Is this true, necessary and kind?” 2. Avoid idle talk, mockery and backbiting online and offline. 3. Make a habit of beginning important conversations with Bismillah and ending with good words.","47:7":"1. Support the religion with time, wealth, knowledge or character. 2. Defend the honour of Islam with good manners, not harshness. 3. Ask: “What one practical help can I give the deen this week?”","49:1":"1. Do not put yourself forward ahead of Allah and His Messenger in speech or fatwa. 2. Pause before sharing religious claims. 3. Verify before you forward.","49:6":"1. Verify news before sharing — especially online. 2. Refuse to spread unconfirmed accusations. 3. When in doubt, remain silent.","49:11":"1. Do not mock or insult others; stop one nickname that hurts. 2. Avoid group chat pile-ons. 3. Apologise if you belittled someone.","49:12":"1. Stop yourself from suspicion and negative assumptions about others. 2. Avoid spying, gossip and sharing private faults. 3. When a thought of suspicion arises, replace it with a good assumption (husn az-zann) and istighfar.","57:28":"1. Have taqwa and believe in the Messenger; ask Allah for a double portion of mercy. 2. Walk toward light with consistent small deeds. 3. Forgive and seek forgiveness.","58:9":"1. When you converse privately, do not plot sin or aggression. 2. Make private talk about righteousness and taqwa. 3. End private chats with dhikr, not gossip.","59:18":"1. Nightly self-accounting (muhasabah): What did I send ahead today? 2. Write one good deed and one shortcoming each evening. 3. Plan tomorrow’s priority act of worship before sleeping.","61:10":"1. Trade this world for a bargain that saves from the Fire: faith and struggle in His path. 2. Give time or wealth to a beneficial cause. 3. Renew intention that your work is for Allah.","61:14":"1. Be among the helpers of Allah with character and clarity. 2. Support truth without arrogance. 3. Stand with the believers in hardship.","66:6":"1. Protect yourself and family from the Fire by teaching prayer, Quran and good character. 2. Make your home a place of dhikr and learning. 3. Correct family members gently and consistently, starting with yourself.","66:8":"1. Turn to Allah with sincere tawbah. 2. Repair a right you owe someone. 3. Ask Allah to perfect your light and forgive you."};let currentCommand=0;let currentCommandVerse={arabic:"",english:"",ref:""}; try{window.currentCommandVerse=currentCommandVerse;}catch(eC){}function getCommandKey(idx){return"clarity_command_"+idx;}async function loadCommand(){const box=document.getElementById("command-box");if(!box||!box.tagName)return;box.innerHTML='<div class="loading-msg">Loading command…</div>';const ref=commandRefs[currentCommand];const saved=JSON.parse(clarityLS.getItem(getCommandKey(currentCommand))||"{}");try{const[arRes,enRes,urRes]=await Promise.all([fetch(`https://api.alquran.cloud/v1/ayah/${ref}/quran-uthmani`),fetch(`https://api.alquran.cloud/v1/ayah/${ref}/en.sahih`),fetch(`https://api.alquran.cloud/v1/ayah/${ref}/ur.jalandhry`)]);const ar=await arRes.json();const en=await enRes.json();let urdu="";try{const ur=await urRes.json();urdu=ur.data?.text||"";}catch(eU){}const arabic=ar.data?.text||"";const english=en.data?.text||"";currentCommandVerse={arabic:arabic,english:english,urdu:urdu,ref:"Qur’an "+ref}; try{window.currentCommandVerse=currentCommandVerse;}catch(eC2){}const isWorking=saved.working||false;const note=saved.note||"";const followUp=commandFollowUps[ref]||"Reflect on the command and choose one concrete action you can take this week.";const lang=getUILang();let transBlock;if(lang==='ur'){transBlock=`
            ${urdu ? `<p id="cmd-ur-text" class="verse-urdu" dir="rtl" style="font-size:1.12rem;line-height:1.85;margin:0.55rem 0;font-family:'Noto Naskh Arabic','Scheherazade New',serif;"><span class="tts-body">${urdu}</span> <button type="button" class="inline-tts" data-label="🔊" title="Urdu TTS" onclick="clarityInlineTTS(this,'ur')">🔊</button></p>` : ''}
            <p id="cmd-en-text" class="verse-en" style="font-size:0.95rem; margin:0.35rem 0; color:var(--text-muted);"><span class="tts-body">${english}</span> <button type="button" class="inline-tts" data-label="🔊" title="English TTS" onclick="clarityInlineTTS(this,'en')">🔊</button></p>
            <div class="ref" style="font-weight:600;">Qur’an ${ref}</div>
            <div class="ref">اردو (جالندھری) · Sahih International</div>`;}else{transBlock=`
            <p style="font-size:1.02rem; margin:0.55rem 0;">${english}</p>
            ${urdu ? `<p id="cmd-ur-text-dup1" class="verse-urdu" dir="rtl" style="font-size:1.08rem;line-height:1.8;margin:0.4rem 0;font-family:'Noto Naskh Arabic','Scheherazade New',serif;color:var(--accent);"><span class="tts-body">${urdu}</span> <button type="button" class="inline-tts" data-label="🔊" title="Urdu TTS" onclick="clarityInlineTTS(this,'ur')">🔊</button></p>` : ''}
            <div class="ref" style="font-weight:600;">Qur’an ${ref}</div>
            <div class="ref">Sahih International${urdu ? ' · اردو (جالندھری)' : ''}</div>`;}box.innerHTML=`
          <div class="arabic-calligraphy" data-ref="${ref}"><span class="tts-body">${arabic}</span> <button type="button" class="inline-tts" data-label="🔊" data-ref="${ref}" title="Arabic (Alafasy)" onclick="clarityInlineTTS(this,'ar')">🔊</button></div>
          ${transBlock}
          <div class="ponder-box"><strong>Recommended follow-up steps (fiqh & modern practice):</strong><br>${followUp}</div>
          <div class="command-status">
            <span class="status-badge ${isWorking ? 'status-working' : 'status-not'}">${isWorking ? '✓ I am working on this' : 'Not yet tracking'}</span>
            <button type="button" onclick="toggleCommandWorking()" class="btn-soft" style="padding:0.35rem 0.95rem; font-size:0.88rem;">${isWorking ? 'Mark as not tracking' : 'I am working on this'}</button>
          </div>
          <div style="margin-top:0.85rem;">
            <label style="font-size:0.88rem; color:#555;">My personal follow-up action / note:</label>
            <textarea id="command-note" rows="2" placeholder="How are you implementing this?">${note}</textarea>
            <button type="button" onclick="saveCommandNote()" style="margin-top:0.35rem; padding:0.4rem 1rem; font-size:0.88rem;">Save My Action</button>
          </div>`;}catch(e){box.innerHTML="Could not load this verse.";}}const HELL_SINS=[{t:"1. Shirk — associating partners with Allah",v:"“Indeed, whoever associates others with Allah — Allah has forbidden Paradise for him, and his home is the Fire.” (al-Māʾidah 5:72). “Allah does not forgive that partners be associated with Him, but He forgives what is less than that for whom He wills.” (al-Nisāʾ 4:48, 4:116).",h:"Listed first among the seven destructive sins (Bukhārī 2766, Muslim 89). The Prophet ﷺ said the gravest sin is to set up a rival with Allah while He created you (Bukhārī 6861, Muslim 86).",s:"Scholars: this is the one sin that, if a person dies upon it without tawbah and entering Islam/tawḥīd, is not forgiven. Hidden shirk includes riyāʾ (showing off worship). Tawbah: abandon every form of worship directed to other than Allah, attest tawḥīd, and rebuild ṣalāh and deeds for Him alone."},{t:"2. Siḥr — sorcery and occult magic",v:"“They taught people magic… and they learn what harms them and does not benefit them.” (al-Baqarah 2:102). “The magician will not succeed wherever he is.” (Ṭā-Hā 20:69).",h:"Second of the seven mūbiqāt (Bukhārī 2766, Muslim 89). Learning or practicing siḥr is a major sin; some jurists treated certain forms as kufr when they involve seeking help from jinn or worship of other than Allah.",s:"Opinion of the fuqahāʾ: destroy talismans, stop the practice, and seek ruqyah from Qur’an and established duʿāʾ — not from another magician. Tawbah is like other sins of Allah’s right if no people’s wealth was taken; otherwise return what was taken by deceit."},{t:"3. Murder — killing a soul Allah has forbidden except by right",v:"“Whoever kills a believer intentionally, his recompense is Hell, to abide therein, and the wrath and curse of Allah are upon him, and a great punishment is prepared for him.” (al-Nisāʾ 4:93). “Do not kill the soul which Allah has forbidden except by right.” (al-Anʿām 6:151).",h:"Third of the seven (Bukhārī / Muslim). Also: “The first cases to be judged among people on the Day of Resurrection will be cases of bloodshed.” (Bukhārī 6864, Muslim 1678).",s:"Ahl al-Sunnah: a Muslim murderer does not automatically become a disbeliever, but faces a severe threat. Tawbah: stop, remorse, resolve; then the heir’s right remains — qiṣāṣ, diyah, or pardon — as the Sharīʿah courts. Private remorse does not cancel the family’s right."},{t:"4. Consuming ribā (usury / interest)",v:"“Those who consume ribā will not stand except as one stands whom Satan has beaten into insanity… Allah has permitted trade and forbidden ribā.” (al-Baqarah 2:275). “O you who believe, fear Allah and give up what remains of ribā, if you are believers. If you do not, then be informed of a war from Allah and His Messenger.” (2:278–279).",h:"Fourth of the seven (Bukhārī / Muslim). Jābir: the Messenger ﷺ cursed the one who consumes ribā, the one who pays it, the one who writes it, and the two witnesses (Muslim 1598).",s:"Scholars: leave remaining interest, do not consume it; if already taken, many advise giving the surplus in charity without intending reward, and rebuilding ḥalāl income. Ask a mufti for contracts already signed."},{t:"5. Consuming the wealth of an orphan",v:"“Those who consume the property of orphans unjustly are only consuming fire into their bellies, and they will be burned in a Blaze.” (al-Nisāʾ 4:10). “Do not approach the orphan’s property except in the best manner.” (al-Anʿām 6:152).",h:"Fifth of the seven (Bukhārī 2766, Muslim 89).",s:"Tawbah requires returning the exact property or its value to the orphan or heirs, plus remorse. Guardians may use it only for the orphan’s benefit, with records."},{t:"6. Fleeing the battlefield",v:"“Whoever turns his back to them on that day — unless manoeuvring for battle or joining another group — has incurred wrath from Allah, and his refuge is Hell.” (al-Anfāl 8:16).",h:"Sixth of the seven mūbiqāt. Applies to a legitimate jihād under its legal conditions — not to every modern conflict a person invents.",s:"Scholars restrict this warning to turning away without a Sharʿī excuse when standing in a prescribed battle. Tawbah is with Allah if no lives were betrayed; the matter is grave — consult people of knowledge, do not self-apply battlefield rulings."},{t:"7. Qadhf — slandering chaste believing women",v:"“Those who accuse chaste women, then do not produce four witnesses — lash them eighty lashes and never accept their testimony. They are the defiantly disobedient — except those who repent thereafter and make right.” (al-Nūr 24:4–5). “Those who accuse chaste, unaware, believing women are cursed in this world and the Hereafter, and for them is a great punishment.” (24:23).",h:"Seventh of the seven (Bukhārī / Muslim).",s:"Tawbah: stop the accusation, feel remorse, resolve never to repeat it; many scholars require seeking the accused person’s pardon because honour is a human right. The ḥadd is a matter for authority, not private enforcement."},{t:"Further warnings the Qur’an and ṣaḥīḥ Sunnah attach to the Fire",v:"Hypocrisy: “The hypocrites will be in the lowest depth of the Fire.” (al-Nisāʾ 4:145). Intentionally killing a believer (4:93). Arrogant denial of the meeting with Allah (Yūnus 10:7–8). Those who hoard gold and silver and do not spend in Allah’s way (al-Tawbah 9:34–35). Those who devour the wealth of others unjustly and bar from Allah’s path.",h:"Abandoning ṣalāh is treated as kufr by some ḥadīth and by a body of scholars (e.g. “The covenant between us and them is prayer; whoever leaves it has disbelieved” — Aḥmad, Tirmidhī, Nasāʾī; ṣaḥīḥ chain according to many). Others hold it is a major sin short of kufr if the person still affirms the obligation. Zinā, consuming khamr, and undutifulness to parents are major sins with severe threats in ṣaḥīḥ reports (e.g. Bukhārī 5976 on parents; Muslim on the seven, plus other lists).",s:"Ibn ʿAbbās and later scholars: a major sin is any sin for which there is a ḥadd, a threat of the Fire, a curse, or a denial of faith. Lists longer than seven exist (al-Dhahabī, Kitāb al-Kabāʾir). The seven ḥadīth is a minimum, not a closed ceiling. Hope remains: “He forgives what is less than shirk for whom He wills” (4:48)."}];function renderHellSins(){const box=document.getElementById('hell-sins-list');if(!box)return;box.innerHTML=HELL_SINS.map(function(s){return'<details class="hell-item"><summary>'+s.t+'</summary><div class="body"><p>'+s.v+'</p><p>'+s.h+'</p><p><em>'+s.s+'</em></p></div></details>';}).join('');}function nextCommand(){currentCommand=(currentCommand+1)%commandRefs.length;loadCommand();}try{if(document.getElementById('hell-sins-list'))renderHellSins();}catch(e0){}function prevCommand(){currentCommand=(currentCommand-1+commandRefs.length)%commandRefs.length;loadCommand();}function toggleCommandWorking(){const key=getCommandKey(currentCommand);const saved=JSON.parse(clarityLS.getItem(key)||"{}");saved.working=!saved.working;clarityLS.setItem(key,JSON.stringify(saved));loadCommand();}function saveCommandNote(){const key=getCommandKey(currentCommand);const saved=JSON.parse(clarityLS.getItem(key)||"{}");const noteEl=document.getElementById("command-note");if(noteEl){saved.note=noteEl.value.trim();clarityLS.setItem(key,JSON.stringify(saved));loadCommand();}}function ponder(text){const t=(text||"").toLowerCase();if(t.includes("patient")||t.includes("patience")||t.includes("sabr")||t.includes("endure")){return"<strong>Pondering:</strong> Allah loves the patient (Qur’an 3:146) and promises them reward without measure (39:10). The Prophet ﷺ said: “How wonderful is the affair of the believer… if harm befalls him he is patient and that is good for him” (Sahih Muslim 2999). Ibn al-Qayyim notes that the past is not healed by sadness but by contentment, gratitude, patience, and firm belief in qadar. <em>Practice:</em> when hardship hits (job loss, illness, family strain), continue rightful action, say “Hasbiyallāhu wa niʿmal-wakīl,” and avoid words of dissatisfaction with the decree.";}if(t.includes("pray")||t.includes("prayer")||t.includes("salah")||t.includes("salat")||t.includes("ṣalāh")){return"<strong>Pondering:</strong> Prayer is a pillar of Islam and a direct appointment with Allah. Guarding the five daily prayers — even in travel, meetings, or fatigue — is among the greatest investments for the grave. Classical guidance stresses praying on time, with khushūʿ, and making up what was missed without delay. <em>Practice:</em> set reminders a few minutes early, prepare a clean space, and treat each ṣalāh as non-negotiable. Missing prayer weakens the soul more than missing a meal.";}if(t.includes("charity")||t.includes("spend")||t.includes("give")||t.includes("sadaqah")||t.includes("zakāt")||t.includes("zakat")){return"<strong>Pondering:</strong> Wealth spent for Allah never decreases. The Prophet ﷺ taught that charity extinguishes sin as water extinguishes fire, and that every day two angels pray for the one who gives and against the miser (Bukhari). Ongoing charity (ṣadaqah jāriyah), beneficial knowledge, and a righteous child who prays for you continue after death (Muslim). <em>Practice:</em> automate a small monthly gift; give when you receive good news; ask before non-essentials whether the purchase will accompany you in the grave.";}if(t.includes("anger")||t.includes("angry")||t.includes("rage")||t.includes("wrath")){return"<strong>Pondering:</strong> True strength is self-control when anger rises. The Prophet ﷺ advised: if standing, sit; if sitting, lie down; make wuḍūʾ; change place; and seek refuge from Shayṭān. Qur’an 42:37 praises those who, when angry, forgive. Uncontrolled anger leads to regretful speech and actions one is accountable for. <em>Practice:</em> in traffic, online arguments, or family tension — leave the screen or room, recite the istiʿādhah, and respond only after the heat cools.";}if(t.includes("parent")||t.includes("mother")||t.includes("father")||t.includes("parents")||t.includes("filial")){return"<strong>Pondering:</strong> After the rights of Allah, kindness to parents ranks highest (Qur’an 17:23–24). Even saying “uff” of irritation is forbidden; speak to them with respect, especially in old age. The Prophet ﷺ linked longevity and increase in provision to honouring parents, and taught that a righteous child who prays for the deceased benefits them after death. <em>Practice:</em> regular contact, practical help, and duʿāʾ by name each night — even when the relationship is difficult.";}if(t.includes("death")||t.includes("grave")||t.includes("die")||t.includes("hereafter")||t.includes("barzakh")){return"<strong>Pondering:</strong> The Prophet ﷺ said: “Remember often the destroyer of pleasures (death)” (Tirmidhi, hasan). Remembrance is meant to awaken, not to despair. Sleep is a small death; each morning is a new chance to send light ahead. Deeds that continue after death include ongoing charity, beneficial knowledge, and a righteous child’s duʿāʾ (Muslim). <em>Practice:</em> once a day ask, “If I die tonight, what have I sent ahead?” then do one small good deed immediately.";}if(t.includes("forgiv")||t.includes("repent")||t.includes("istighfar")||t.includes("mercy")||t.includes("tawbah")){return"<strong>Pondering:</strong> The door of tawbah remains open until the soul reaches the throat. No sin is too great for Allah’s mercy when repentance is sincere: stop the sin, regret it, resolve not to return, and repair harm done to others. The Prophet ﷺ sought forgiveness more than seventy times a day (Bukhari 6307). Regular istighfār opens ways out of difficulty (Abu Dawud, hasan). <em>Practice:</em> end each day with a short heart-review and sincere “Astaghfirullāh.”";}if(t.includes("truth")||t.includes("honest")||t.includes("lie")||t.includes("trust")||t.includes("amānah")||t.includes("amanah")){return"<strong>Pondering:</strong> Truthfulness leads to righteousness and righteousness leads to Paradise; lying leads to wickedness and the Fire (Bukhari & Muslim). Keeping trusts (amānah) is a mark of faith; betrayal is a mark of hypocrisy. In business, work, and online life, barakah follows honesty and is lost through deceit. <em>Practice:</em> when tempted to exaggerate or hide, choose the harder truth and seek Allah’s pleasure over people’s praise.";}if(t.includes("marriage")||t.includes("spouse")||t.includes("wife")||t.includes("husband")||t.includes("wedding")){return"<strong>Pondering:</strong> Marriage is a religious and social covenant, not merely a private arrangement. Islam encourages marriage, forbids unlawful relationships outside it, and places mutual rights and kind treatment at the centre of the home. Spending on one’s family is a legal duty of the husband and is counted among the best spending. <em>Practice:</em> speak gently, fulfil known rights, and make the home a place of dhikr and mercy rather than score-keeping.";}if(t.includes("knowledge")||t.includes("learn")||t.includes("teach")||t.includes("scholar")){return"<strong>Pondering:</strong> Seeking beneficial knowledge is a path to Paradise. Knowledge that continues to benefit others is among the deeds that remain after death (Muslim). Teaching with sincerity, acting on what one knows, and avoiding argument for ego protect the blessing of ʿilm. <em>Practice:</em> learn a little with understanding each day, share one useful point without showing off, and ask Allah for beneficial knowledge and a heart that acts on it.";}if(t.includes("gold")||t.includes("silver")||t.includes("exchange")||t.includes("riba")||t.includes("usury")||t.includes("interest")||t.includes("sale")||t.includes("sell")||t.includes("buy")||t.includes("trade")||t.includes("business")||t.includes("weight")||t.includes("measure")){return"<strong>Pondering:</strong> Classical fiqh (and the hadith of the six ribawi items) requires like-for-like, hand-to-hand exchange when trading gold for gold or silver for silver; any excess is ribā. Scholars (including discussions in Sahih Muslim on currency exchange) stress consulting those more knowledgeable and avoiding delayed unequal trades. <em>Practice:</em> in business and online sales, be transparent on price and quality, avoid hidden interest structures, and prefer clear spot deals when exchanging similar wealth.";}if(t.includes("character")||t.includes("manners")||t.includes("akhlak")||t.includes("akhlāq")||t.includes("neighbour")||t.includes("neighbor")||t.includes("smile")||t.includes("gentle")){return"<strong>Pondering:</strong> The Prophet ﷺ said he was sent to perfect good character. Good character is weighed heavily on the Day of Judgement; a gentle word, honouring neighbours, and restraining harm are repeatedly emphasised in the Sunnah. Imam al-Nawawī and later scholars treated husn al-khuluq as a path that softens the heart and lights the grave. <em>Practice:</em> choose one trait today — gentleness in speech, keeping a promise, or checking on a neighbour — and do it for Allah alone.";}if(t.includes("knowledge")||t.includes("know more")||t.includes("scholar")||t.includes("ask")||t.includes("fatwa")||t.includes("learned")){return"<strong>Pondering:</strong> The companions deferred to those with greater knowledge (as in referring questions to Zaid or al-Barāʾ). Seeking clarification from qualified people protects from error. Beneficial knowledge that is acted upon continues after death (Muslim). <em>Practice:</em> before a doubtful transaction or ruling, ask a trustworthy scholar; learn one issue properly rather than guessing.";}if(t.includes("modesty")||t.includes("haya")||t.includes("ḥayā")||t.includes("shame")||t.includes("modest")){return"<strong>Pondering:</strong> Ḥayāʾ is a branch of faith. It restrains the limbs from what displeases Allah and beautifies character. Scholars link modesty in dress, speech, and online behaviour to protecting the heart. <em>Practice:</em> review one public post or conversation and ask whether it reflects modesty before Allah.";}return"<strong>Pondering:</strong> Let this teaching settle in the heart. Ask: What one concrete action can I take today because of these words? That small, sincere change — done for Allah alone — is what will accompany you when all other company is left behind. Start with one step before the day ends.";}async function loadHadith(){
  const el=document.getElementById("hadith");
  if(!el) return;
  el.innerHTML='<div class="loading-msg">Loading ṣaḥīḥ ḥadīth (grade · collection · number)…</div>';
  function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function renderHadithCard(text, collection, num, gradeLabel, gradeClass){
    const refParts=[collection, num?('#'+num):''].filter(Boolean).join(' · ');
    const sunnahQ=encodeURIComponent((text||'').slice(0,80));
    const ponderHtml=(typeof ponder==='function')?ponder(text):'';
    el.innerHTML=
      '<div class="hadith-meta-bar" style="display:flex;flex-wrap:wrap;gap:.35rem;margin:0 0 .5rem;align-items:center">'+
        '<span class="hadith-grade-pill '+esc(gradeClass)+'" style="font-size:.72rem;font-weight:700;padding:.2rem .5rem;border-radius:999px;border:1px solid rgba(212,180,90,.45);background:rgba(212,180,90,.12)">'+esc(gradeLabel)+'</span>'+
        (collection?'<span class="hadith-coll-pill" style="font-size:.72rem;padding:.2rem .5rem;border-radius:999px;border:1px solid rgba(255,255,255,.15)">📚 '+esc(collection)+'</span>':'')+
        (num?'<span class="hadith-num-pill" style="font-size:.72rem;padding:.2rem .5rem;border-radius:999px;border:1px solid rgba(255,255,255,.15)"># '+esc(String(num))+'</span>':'')+
      '</div>'+
      '<p style="font-size:1.05rem;font-weight:500;margin-bottom:0.55rem">“'+esc(text)+'”</p>'+
      (ponderHtml?'<div class="ponder-box">'+ponderHtml+'</div>':'')+
      '<div class="ref">'+esc(refParts||'Collection')+
      '<br><a href="https://sunnah.com/search?q='+sunnahQ+'" target="_blank" rel="noopener" style="color:var(--accent)">Verify on Sunnah.com →</a></div>'+
      '<p class="td-src" style="font-size:.75rem;margin-top:.35rem"><strong>Educational only — not a fatwa.</strong> Prefer ṣaḥīḥ; always re-check grading.</p>';
  }
  function isSahih(h){
    const g=String(h.grade||h.status||'').toLowerCase();
    const c=String(h.collection||'').toLowerCase();
    if(g.includes('daif')||g.includes('da\'if')||g.includes('weak')||g.includes('mawdu')||g.includes('fabricat')) return false;
    if(c.includes('bukhari')||c.includes('muslim')||c.includes('bukhārī')) return true;
    if(g.includes('sahih')||g.includes('ṣaḥīḥ')||g.includes('sahīh')) return true;
    return false;
  }
  function gradeOf(h){
    const g=String(h.grade||h.status||'').toLowerCase();
    const c=String(h.collection||'').toLowerCase();
    if(c.includes('bukhari')||c.includes('muslim')||g.includes('sahih')||g.includes('ṣaḥīḥ')) return {label:'Ṣaḥīḥ', cls:'grade-sahih'};
    if(g.includes('hasan')) return {label:'Ḥasan', cls:'grade-hasan'};
    if(g.includes('daif')||g.includes('weak')) return {label:'Ḍaʿīf — not shown as proof', cls:'grade-daif'};
    if(g) return {label:String(h.grade||h.status), cls:'grade-other'};
    return {label:'Verify grade on Sunnah.com', cls:'grade-verify'};
  }
  /* Static ṣaḥīḥ fallback bank (Bukhārī / Muslim numbers) */
  const SAHIH_FALLBACK=[
    {text:'Actions are but by intention, and every person shall have only that which he intended.',collection:'Ṣaḥīḥ al-Bukhārī',num:'1',grade:'Ṣaḥīḥ'},
    {text:'None of you truly believes until he loves for his brother what he loves for himself.',collection:'Ṣaḥīḥ al-Bukhārī',num:'13',grade:'Ṣaḥīḥ'},
    {text:'The strong is not the one who overcomes people by his strength, but the strong is the one who controls himself while in anger.',collection:'Ṣaḥīḥ al-Bukhārī',num:'6114',grade:'Ṣaḥīḥ'},
    {text:'Whoever believes in Allah and the Last Day should speak good or remain silent.',collection:'Ṣaḥīḥ al-Bukhārī',num:'6018',grade:'Ṣaḥīḥ'},
    {text:'The Messenger of Allah ﷺ said: Make things easy and do not make them difficult; give glad tidings and do not drive people away.',collection:'Ṣaḥīḥ al-Bukhārī',num:'69',grade:'Ṣaḥīḥ'},
    {text:'Allah does not look at your bodies or your forms, but He looks at your hearts and your deeds.',collection:'Ṣaḥīḥ Muslim',num:'2564',grade:'Ṣaḥīḥ'},
    {text:'He who does not thank people does not thank Allah.',collection:'Sunan Abī Dāwūd',num:'4811',grade:'Ṣaḥīḥ (many graded)'},
    {text:'The best of you are those who learn the Qur’ān and teach it.',collection:'Ṣaḥīḥ al-Bukhārī',num:'5027',grade:'Ṣaḥīḥ'}
  ];
  try{
    let picked=null;
    for(let attempt=0; attempt<6; attempt++){
      try{
        const res=await fetch('https://ummahapi.com/api/hadith/random');
        if(!res.ok) continue;
        const data=await res.json();
        const h=data.data||data;
        if(!h) continue;
        if(!isSahih(h)) continue;
        picked=h; break;
      }catch(eTry){}
    }
    if(picked){
      const text=picked.hadith_english||picked.english||picked.text||'Hadith';
      const collection=(picked.collection||'').toString()||'Collection';
      const num=picked.hadithNumber||picked.number||'';
      const gr=gradeOf(picked);
      renderHadithCard(text, collection, num, gr.label, gr.cls);
      try{offlineCacheSet('hadith',{text,ref:collection+' · '+num,collection,num,grade:gr.label,at:Date.now()});}catch(e){}
      try{showOfflineBadge(false);}catch(e){}
      return;
    }
    throw new Error('no-sahih');
  }catch(e){
    if(!navigator.onLine){
      try{
        const cached=offlineCacheGet('hadith');
        if(cached&&cached.text){
          renderHadithCard(cached.text, cached.collection||'Cached', cached.num||'', cached.grade||'Cached snapshot', 'grade-verify');
          try{showOfflineBadge(true);}catch(e2){}
          return;
        }
      }catch(e3){}
    }
    const fb=SAHIH_FALLBACK[Math.floor(Math.random()*SAHIH_FALLBACK.length)];
    renderHadithCard(fb.text, fb.collection, fb.num, fb.grade||'Ṣaḥīḥ', 'grade-sahih');
    el.innerHTML += '<p class="td-src" style="font-size:.75rem">Offline / API fallback · verify on Sunnah.com</p>';
  }
}const SEARCH_GIST={patience:['sabr','patience','steadfast','persevere','endure'],sabr:['patience','sabr','steadfast','endure'],prayer:['salah','salat','prayer','worship','bow','prostrate'],salah:['prayer','salah','salat','worship'],forgiveness:['forgive','istighfar','pardon','mercy','repent','tawbah'],mercy:['rahmah','mercy','compassion','forgive','kind'],charity:['sadaqah','zakat','charity','give','spend','poor'],zakat:['charity','zakat','poor','alms'],parents:['mother','father','parents','bir','womb','kin'],mother:['parents','mother','womb'],anger:['anger','wrath','temper','forbear','rage'],death:['death','grave','hereafter','die','barzakh'],grave:['grave','barzakh','death','hereafter','tomb'],knowledge:['knowledge','ilm','learn','wisdom','teach'],guidance:['guidance','hidayah','straight path','guide'],fear:['fear','taqwa','awe','godfearing'],taqwa:['taqwa','piety','god-conscious','fear'],paradise:['jannah','paradise','garden','heaven'],hell:['hell','fire','jahannam'],marriage:['marriage','spouse','nikah','family','wife','husband'],travel:['travel','journey','safar'],anxiety:['anxiety','worry','distress','grief','sad'],gratitude:['shukr','thanks','gratitude','praise','hamd'],prophet:['muhammad','messenger','prophet'],quran:['book','quran','revelation','ayah'],justice:['justice','fair','oppress','zulm','right'],orphan:['orphan','yatim','care'],neighbor:['neighbour','neighbor','guest'],truth:['truth','honest','lie','amanah','trust'],patience_ar:['صبر','صابر'],salah_ar:['صلاة','صلوة'],rahma:['رحمة','رحيم']};function expandSearchQuery(raw){const q=String(raw||'').trim();if(!q)return{original:'',primary:'',alts:[]};const words=q.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);const alts=new Set();words.forEach(function(w){alts.add(w);Object.keys(SEARCH_GIST).forEach(function(k){if(w===k||SEARCH_GIST[k].indexOf(w)!==-1||k.indexOf(w)!==-1||w.indexOf(k)!==-1){SEARCH_GIST[k].forEach(function(a){alts.add(a);});alts.add(k);}});});return{original:q,primary:words[0]||q,alts:Array.from(alts)};}function gistScore(text,alts){const t=String(text||'').toLowerCase();let s=0;alts.forEach(function(a){if(a&&t.indexOf(a)!==-1)s+=1;});return s;}async function searchHadith(){const query=document.getElementById("hadith-search").value.trim();const resultsEl=document.getElementById("hadith-results");if(!query){resultsEl.innerHTML="<p>Enter a theme (exact word not required).</p>";return;}const gist=expandSearchQuery(query);resultsEl.innerHTML="<p>Searching related meaning across online collections…</p>";try{const matches=[];const seen={};const terms=[gist.primary].concat(gist.alts).filter(function(t,i,a){return t&&a.indexOf(t)===i;}).slice(0,7);async function addUmmah(term){const res=await fetch("https://ummahapi.com/api/hadith/search?q="+encodeURIComponent(term));const data=await res.json();(data.data||data.results||[]).forEach(function(h){const text=h.hadith_english||h.english||h.text||"";const key=text.slice(0,80);if(!key||seen[key])return;seen[key]=true;h._src='UmmahAPI';matches.push(h);});}async function addAbuAmina(term){const url='https://api.alquran.cloud/v1/search/'+encodeURIComponent(term)+'/all/en.sahih';const res=await fetch(url);const data=await res.json();((data.data&&data.data.matches)||[]).slice(0,3).forEach(function(m){const text=m.text||'';const key='q:'+((m.surah&&m.surah.number)||'')+':'+m.numberInSurah;if(!text||seen[key])return;seen[key]=true;matches.push({hadith_english:'Related Qur’an verse often cited with this theme: “'+text+'”',collection:'Qur’an',hadithNumber:((m.surah&&m.surah.number)||'')+':'+m.numberInSurah,_src:'AlQuran.cloud'});});}for(let i=0;i<terms.length&&matches.length<14;i++){try{await addUmmah(terms[i]);}catch(e1){}if(matches.length<8){try{await addAbuAmina(terms[i]);}catch(e2){}}}if(!matches.length){resultsEl.innerHTML=`<p>No close matches for this theme.</p>
            <p>Open the gist on:
              <a href="https://sunnah.com/search?q=${encodeURIComponent(gist.primary)}" target="_blank" rel="noopener">Sunnah.com</a> ·
              <a href="https://hadithcollection.com/?s=${encodeURIComponent(gist.primary)}" target="_blank" rel="noopener">HadithCollection</a> ·
              <a href="https://islamqa.info/en/search?q=${encodeURIComponent(gist.primary)}" target="_blank" rel="noopener">IslamQA</a> ·
              <a href="https://abuaminaelias.com/?s=${encodeURIComponent(gist.primary)}" target="_blank" rel="noopener">Abu Amina Elias</a>
            </p>`;return;}matches.sort(function(a,b){return gistScore((b.hadith_english||b.english||b.text||''),gist.alts)-gistScore((a.hadith_english||a.english||a.text||''),gist.alts);});let html=`<p>Theme: <strong>${gist.original}</strong> · gist search across UmmahAPI + Qur’an cross-ref</p>`;matches.slice(0,10).forEach(h=>{const text=h.hadith_english||h.english||h.text||"";const ref=[h.collection,h.hadithNumber||h.number,h._src].filter(Boolean).join(" · ");html+=`<div class="search-result"><p style="font-weight:500;">“${text}”</p><div class="ref">${ref}</div>
            <div class="ref"><a href="https://sunnah.com/search?q=${encodeURIComponent((text||'').slice(0,60))}" target="_blank" rel="noopener">Verify on Sunnah.com</a></div></div>`;});html+=`<p class="notes-hint">More gist sources:
          <a href="https://sunnah.com/search?q=${encodeURIComponent(gist.primary)}" target="_blank" rel="noopener">Sunnah.com</a> ·
          <a href="https://islamqa.info/en/search?q=${encodeURIComponent(gist.primary)}" target="_blank" rel="noopener">IslamQA</a> ·
          <a href="https://abuaminaelias.com/?s=${encodeURIComponent(gist.primary)}" target="_blank" rel="noopener">Abu Amina Elias</a></p>`;resultsEl.innerHTML=html;}catch(e){resultsEl.innerHTML=`<p>Search unavailable. <a href="https://sunnah.com/search?q=${encodeURIComponent(query)}" target="_blank">Try Sunnah.com</a></p>`;}}
function clarityDailyVerseSeed(){
  try{
    var d = new Date();
    var key = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
    var h=0,i,str=key+'|verse-v2';
    for(i=0;i<str.length;i++){ h=((h<<5)-h)+str.charCodeAt(i); h|=0; }
    if(typeof VERSE_POOL!=='undefined' && VERSE_POOL.length){
      versePoolIdx = Math.abs(h) % VERSE_POOL.length;
    }
  }catch(e){}
}
try{ clarityDailyVerseSeed(); }catch(e){}

VERSE_POOL=[{s:2,a:255},{s:2,a:286},{s:2,a:152},{s:2,a:153},{s:2,a:183},{s:2,a:186},{s:2,a:201},{s:3,a:8},{s:3,a:102},{s:3,a:159},{s:4,a:36},{s:4,a:103},{s:5,a:2},{s:6,a:162},{s:7,a:199},{s:9,a:51},{s:13,a:28},{s:14,a:7},{s:16,a:97},{s:17,a:23},{s:17,a:24},{s:18,a:10},{s:18,a:46},{s:20,a:25},{s:21,a:87},{s:23,a:1},{s:24,a:35},{s:25,a:74},{s:29,a:69},{s:31,a:14},{s:33,a:21},{s:33,a:56},{s:39,a:53},{s:49,a:10},{s:49,a:12},{s:51,a:56},{s:55,a:1},{s:57,a:20},{s:59,a:18},{s:64,a:11},{s:65,a:2},{s:65,a:3},{s:67,a:2},{s:94,a:5},{s:94,a:6},{s:103,a:1},{s:103,a:2},{s:103,a:3},{s:112,a:1},{s:112,a:2},{s:112,a:3},{s:112,a:4},{s:1,a:5},{s:2,a:45},{s:3,a:26},{s:3,a:173},{s:4,a:1},{s:8,a:2},{s:10,a:62},{s:12,a:87},{s:15,a:9},{s:17,a:80},{s:21,a:83},{s:24,a:30},{s:25,a:63},{s:28,a:77},{s:30,a:21},{s:36,a:82},{s:40,a:60},{s:41,a:30},{s:48,a:29},{s:53,a:39},{s:67,a:2},{s:94,a:5},{s:94,a:6},{s:103,a:1},{s:103,a:2},{s:103,a:3},{s:112,a:1},{s:112,a:2},{s:113,a:1},{s:114,a:1}];let versePoolIdx=Math.floor(Math.random()*VERSE_POOL.length);function stripHtmlTafseer(htmlStr){if(!htmlStr)return"";let s=String(htmlStr);s=s.replace(/<br\s*\/?>/gi,"\n");s=s.replace(/<\/p>/gi,"\n");s=s.replace(/<\/h[1-6]>/gi,"\n");s=s.replace(/<li>/gi,"• ");s=s.replace(/<\/li>/gi,"\n");s=s.replace(/<[^>]+>/g,"");s=s.replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'");s=s.replace(/\n{3,}/g,"\n\n").trim();if(s.length>1200){const cut=s.slice(0,1200);const last=Math.max(cut.lastIndexOf(". "),cut.lastIndexOf(".\n"));s=(last>400?cut.slice(0,last+1):cut)+"…";}return s;}let currentJourneyVerse={en:"",ur:"",tafseer:"",ref:"",arabic:""}; try{window.currentJourneyVerse=currentJourneyVerse;}catch(eJ){}function getUILang(){return(clarityLS.getItem('clarity_lang')||'en')==='ur'?'ur':'en';}function renderVerseHtml(arabic,en,ur,surahName,ayah,tafseerText){const lang=getUILang();const primary=(lang==='ur'&&ur)?ur:en;const secondary=(lang==='ur'&&ur&&en)?`<p class="verse-secondary" style="margin-top:0.4rem;font-size:0.92rem;color:var(--text-muted)">${en}</p>`:(lang==='en'&&ur?`<p class="verse-secondary verse-urdu" dir="rtl" style="margin-top:0.4rem;font-size:1.05rem;font-family:'Noto Naskh Arabic','Scheherazade New',serif;color:var(--accent)">${ur}</p>`:'');let mainBlock;if(lang==='ur'){mainBlock=`
          <p class="verse-primary verse-urdu" dir="rtl" style="margin-top:0.55rem;font-size:1.12rem;line-height:1.85;font-family:'Noto Naskh Arabic','Scheherazade New',serif">${ur || en}</p>
          ${en && ur ? `<p class="verse-secondary" style="margin-top:0.4rem;font-size:0.92rem;color:var(--text-muted)">${en}</p>` : ''}`;}else{mainBlock=`
          <p class="verse-primary" style="margin-top:0.55rem;font-size:1.02rem">${en}</p>
          ${ur ? `<p class="verse-secondary verse-urdu" dir="rtl" style="margin-top:0.45rem;font-size:1.08rem;line-height:1.8;font-family:'Noto Naskh Arabic','Scheherazade New',serif;color:var(--accent)">${ur}</p>` : ''}`;}const transLabel=lang==='ur'?(ur?'اردو ترجمہ (جالندھری) · Sahih International':'Sahih International'):(ur?'Sahih International · اردو (جالندھری)':'Sahih International');let ponderBlock="";if(tafseerText){const safe=tafseerText.replace(/</g,"&lt;").replace(/>/g,"&gt;");const ponderLabel=lang==='ur'?'غور و فکر:':'Pondering:';ponderBlock=`<div class="ponder-box"><strong>${ponderLabel}</strong> ${safe.replace(/\n/g, "<br>")}<div class="ref" style="margin-top:0.45rem">Ibn Kathīr (abridged) · ${surahName} ${ayah} · via Quran.com</div></div>`;}else if(en){ponderBlock=`<div class="ponder-box">${ponder(en)}</div>`;}const ayahStr=(ayah===0||ayah==='0'||ayah==='')?'':String(ayah);let refLine='';if(typeof surahName==='string'&&/^\d+:\d+/.test(surahName.trim())){refLine='Qur’an '+surahName.trim()+' • '+transLabel;}else if(ayahStr&&surahName){refLine=surahName+' '+ayahStr+' • '+transLabel;}else{refLine=(surahName||'Qur’an')+(ayahStr?' '+ayahStr:'')+' • '+transLabel;}const _refKey=(function(){
          var m=String(surahName||'').match(/(\d+)\s*:\s*(\d+)/);
          if(m) return m[1]+':'+m[2];
          if(ayahStr && /^\d+$/.test(String(surahName||'').trim())) return String(surahName).trim()+':'+ayahStr;
          return '';
        })();
        /* Rebuild mainBlock with inline TTS at each text line */
        if(lang==='ur'){
          mainBlock=`
          <p class="verse-primary verse-urdu" dir="rtl" style="margin-top:0.55rem;font-size:1.12rem;line-height:1.85;font-family:'Noto Naskh Arabic','Scheherazade New',serif"><span class="tts-body">${ur || en}</span>${(ur||en)?` <button type="button" class="inline-tts" data-label="🔊" title="Urdu TTS" onclick="clarityInlineTTS(this,'ur')">🔊</button>`:''}</p>
          ${en && ur ? `<p class="verse-secondary" style="margin-top:0.4rem;font-size:0.92rem;color:var(--text-muted)"><span class="tts-body">${en}</span> <button type="button" class="inline-tts" data-label="🔊" title="English TTS" onclick="clarityInlineTTS(this,'en')">🔊</button></p>` : ''}`;
        } else {
          mainBlock=`
          <p class="verse-primary" style="margin-top:0.55rem;font-size:1.02rem"><span class="tts-body">${en}</span>${en?` <button type="button" class="inline-tts" data-label="🔊" title="English TTS" onclick="clarityInlineTTS(this,'en')">🔊</button>`:''}</p>
          ${ur ? `<p class="verse-secondary verse-urdu" dir="rtl" style="margin-top:0.45rem;font-size:1.08rem;line-height:1.8;font-family:'Noto Naskh Arabic','Scheherazade New',serif;color:var(--accent)"><span class="tts-body">${ur}</span> <button type="button" class="inline-tts" data-label="🔊" title="Urdu TTS" onclick="clarityInlineTTS(this,'ur')">🔊</button></p>` : ''}`;
        }
        return`
        <div class="arabic-calligraphy" data-ref="${_refKey}"><span class="tts-body">${arabic}</span>${arabic?` <button type="button" class="inline-tts" data-label="🔊" data-ref="${_refKey}" title="Arabic recitation (Alafasy)" onclick="clarityInlineTTS(this,'ar')">🔊</button>`:''}</div>
        ${mainBlock}
        <div class="ref" style="font-weight:600;margin-top:0.45rem;">${refLine}</div>
        ${ponderBlock}`;}async function loadVerseInto(elId){const el=document.getElementById(elId);if(!el)return;el.innerHTML='<div class="loading-msg">Loading verse &amp; tafseer…</div>';try{const pick=VERSE_POOL[versePoolIdx%VERSE_POOL.length];versePoolIdx++;const key=pick.s+":"+pick.a;const[vRes,tRes,urRes]=await Promise.all([fetch(`https://api.quran.com/api/v4/verses/by_key/${key}?language=en&translations=20&fields=text_uthmani`),fetch(`https://api.quran.com/api/v4/tafsirs/en-tafisr-ibn-kathir/by_ayah/${key}`),fetch(`https://api.alquran.cloud/v1/ayah/${key}/ur.jalandhry`)]);const vData=await vRes.json();const tData=await tRes.json();let ur="";try{const urData=await urRes.json();ur=(urData.data&&urData.data.text)?urData.data.text:"";}catch(eUr){}const verse=vData.verse||{};const arabic=verse.text_uthmani||"";const en=(verse.translations&&verse.translations[0]&&verse.translations[0].text)?verse.translations[0].text.replace(/<[^>]+>/g,""):"";const surahNames={1:"Al-Fatihah",2:"Al-Baqarah",3:"Aal-Imran",4:"An-Nisa",5:"Al-Ma'idah",6:"Al-An'am",7:"Al-A'raf",9:"At-Tawbah",13:"Ar-Ra'd",14:"Ibrahim",16:"An-Nahl",17:"Al-Isra",18:"Al-Kahf",20:"Ta-Ha",21:"Al-Anbiya",23:"Al-Mu'minun",24:"An-Nur",25:"Al-Furqan",29:"Al-Ankabut",31:"Luqman",33:"Al-Ahzab",39:"Az-Zumar",49:"Al-Hujurat",51:"Adh-Dhariyat",55:"Ar-Rahman",57:"Al-Hadid",59:"Al-Hashr",64:"At-Taghabun",65:"At-Talaq",67:"Al-Mulk",94:"Ash-Sharh",103:"Al-Asr",112:"Al-Ikhlas"};const surahName=surahNames[pick.s]||("Surah "+pick.s);let tafseerText="";if(tData.tafsir&&tData.tafsir.text){tafseerText=stripHtmlTafseer(tData.tafsir.text);}if(!tafseerText||tafseerText.length<40){try{const mRes=await fetch(`https://api.quran.com/api/v4/tafsirs/en-tafsir-maarif-ul-quran/by_ayah/${key}`);const mData=await mRes.json();if(mData.tafsir&&mData.tafsir.text){tafseerText=stripHtmlTafseer(mData.tafsir.text);}}catch(e2){}}const refLabel="Qur’an "+key+" · "+surahName;if(elId==="verse"){currentJourneyVerse={en:en,ur:ur,tafseer:tafseerText||"",ref:refLabel,arabic:arabic,surah:pick.s,ayah:pick.a,key:key}; try{window.currentJourneyVerse=currentJourneyVerse;}catch(eJ2){}try{offlineCacheSet('verse',currentJourneyVerse);}catch(e2){}}el.innerHTML=renderVerseHtml(arabic,en,ur,key+" · "+surahName,"",tafseerText);}catch(e){if(!navigator.onLine){const cached=offlineCacheGet('verse');if(cached&&cached.arabic){currentJourneyVerse=cached;el.innerHTML=renderVerseHtml(cached.arabic,cached.en||"",cached.ur||"",cached.ref||"","",cached.tafseer||"");showOfflineBadge(true);return;}}el.innerHTML="Unable to load live verse. <a href='https://quran.com' target='_blank' rel='noopener'>Open Quran.com</a>";}}async function loadVerse(){loadVerseInto("verse");}function refreshVerseLanguage(){const el=document.getElementById('verse');const v=currentJourneyVerse;if(!el||!v||!v.arabic)return;const surahName=(v.ref||'').replace(/\s+\d+$/,'')||'';const ayah=v.ayah||'';el.innerHTML=renderVerseHtml(v.arabic,v.en||'',v.ur||'',surahName||v.ref||'',ayah,v.tafseer||'');}function loadVerseCommands(){}let lastSearchVerse={arabic:"",en:"",ur:"",ref:"",surah:0,ayah:0};let searchVerseCache=[];async function searchQuran(){const query=document.getElementById("quran-search").value.trim();const resultsEl=document.getElementById("quran-results");if(!query){resultsEl.innerHTML="<p>Enter a theme — exact wording is not required.</p>";return;}const gist=expandSearchQuery(query);resultsEl.innerHTML="<p>Searching related meaning…</p>";try{let matches=[];const tryTerms=[gist.original].concat(gist.alts).filter(function(t,i,arr){return t&&arr.indexOf(t)===i;}).slice(0,7);async function addCloud(term,edition){try{const res=await fetch('https://api.alquran.cloud/v1/search/'+encodeURIComponent(term)+'/all/'+edition);const data=await res.json();((data.data&&data.data.matches)||[]).forEach(function(m){const key=(m.surah&&m.surah.number)+':'+m.numberInSurah;if(!matches.some(function(x){return(x.surah&&x.surah.number)+':'+x.numberInSurah===key;})){m._src=edition;matches.push(m);}});}catch(e){}}async function addQuranCom(term,lang){try{const res=await fetch('https://api.quran.com/api/v4/search?q='+encodeURIComponent(term)+'&size=10&language='+(lang||'en'));const data=await res.json();const hits=(data.search&&data.search.results)||data.results||[];hits.forEach(function(h){const s=(h.verse_key||'').split(':');if(s.length<2)return;const key=s[0]+':'+s[1];if(matches.some(function(x){return(x.surah&&x.surah.number)+':'+x.numberInSurah===key;}))return;matches.push({text:(h.text||h.translations&&h.translations[0]&&h.translations[0].text||'').replace(/<[^>]+>/g,''),numberInSurah:parseInt(s[1],10),surah:{number:parseInt(s[0],10),englishName:''},_src:'Quran.com'});});}catch(e){}}for(let ti=0;ti<tryTerms.length&&matches.length<12;ti++){await addCloud(tryTerms[ti],'en');if(matches.length<12)await addQuranCom(tryTerms[ti],'en');if(matches.length<10)await addCloud(tryTerms[ti],'en.asad');if(matches.length<10)await addCloud(tryTerms[ti],'en.pickthall');}if(matches.length<4)await addCloud(tryTerms[0],'en.sahih');if(matches.length<6)await addQuranCom(tryTerms[0],'ur');matches.sort(function(a,b){return gistScore((b.text||''),gist.alts)-gistScore((a.text||''),gist.alts);});if(!matches.length){resultsEl.innerHTML='<p>No close verses for this theme. Try a related idea, or open: '+'<a href="https://quran.com/search?q='+encodeURIComponent(gist.primary)+'" target="_blank" rel="noopener">Quran.com</a> · '+'<a href="https://tanzil.net/#search/quran/'+encodeURIComponent(gist.primary)+'" target="_blank" rel="noopener">Tanzil</a> · '+'<a href="https://corpus.quran.com/search.jsp?q='+encodeURIComponent(gist.primary)+'" target="_blank" rel="noopener">Quranic Arabic Corpus</a>.</p>';return;}matches=matches.slice(0,8);searchVerseCache=[];resultsEl.innerHTML=`<p>Theme: <strong>${gist.original}</strong> · ${matches.length} gist-matched verse(s) from AlQuran.cloud + Quran.com</p><div id="quran-results-list"></div>`;const list=document.getElementById("quran-results-list");for(let i=0;i<matches.length;i++){const m=matches[i];const surahNum=m.surah&&m.surah.number?m.surah.number:0;const ayahNum=m.numberInSurah||0;const surahName=(m.surah&&(m.surah.englishName||m.surah.name))||("Surah "+surahNum);const card=document.createElement("div");card.className="search-result";card.id="sr-"+i;card.innerHTML=`<div class="loading-msg">Loading Arabic &amp; Urdu…</div><div class="ref">${surahName} ${ayahNum}</div>`;list.appendChild(card);(async function(idx,s,a,name,host){let arabic="",en=m.text||"",ur="";try{const[arRes,enRes,urRes]=await Promise.all([fetch(`https://api.alquran.cloud/v1/ayah/${s}:${a}/quran-uthmani`),fetch(`https://api.alquran.cloud/v1/ayah/${s}:${a}/en.sahih`),fetch(`https://api.alquran.cloud/v1/ayah/${s}:${a}/ur.jalandhry`)]);const arJ=await arRes.json();const enJ=await enRes.json();const urJ=await urRes.json();arabic=(arJ.data&&arJ.data.text)||"";en=(enJ.data&&enJ.data.text)||en||"";ur=(urJ.data&&urJ.data.text)||"";}catch(e2){en=m.text||en;}const ref="Qur’an "+s+":"+a+" · "+name;const payload={arabic:arabic,en:en,ur:ur,ref:ref,surah:s,ayah:a};searchVerseCache[idx]=payload;if(idx===0)lastSearchVerse=payload;const arHtml=arabic?`<div class="sr-ar" data-ref="${s}:${a}"><span class="tts-body">${arabic}</span> <button type="button" class="inline-tts" data-label="🔊" data-ref="${s}:${a}" title="Arabic (Alafasy)" onclick="clarityInlineTTS(this,'ar')">🔊</button></div>`:"";const enHtml=en?`<p class="sr-en"><span class="tts-body">${en}</span> <button type="button" class="inline-tts" data-label="🔊" title="English TTS" onclick="clarityInlineTTS(this,'en')">🔊</button></p>`:"";const urHtml=ur?`<p class="sr-ur" dir="rtl"><span class="tts-body">${ur}</span> <button type="button" class="inline-tts" data-label="🔊" title="Urdu TTS" onclick="clarityInlineTTS(this,'ur')">🔊</button></p>`:"";host.innerHTML=arHtml+enHtml+urHtml+`<div class="ref" style="font-weight:600;">${ref}</div>
               <div class="ref">Sahih International · اردو (جالندھری)</div>`+`<div class="sr-actions">
                <button type="button" class="btn-soft" onclick="memeUseSearchVerseIndex(${idx})">🖼️ Use in Meme</button>
              </div>`;})(i,surahNum,ayahNum,surahName,card);}}catch(e){resultsEl.innerHTML="<p>Search temporarily unavailable.</p>";}}function memeUseSearchVerseIndex(idx){const payload=searchVerseCache[idx];if(!payload)return;lastSearchVerse=payload;switchTab('reality');setTimeout(function(){const card=document.getElementById('meme-card');if(card)card.scrollIntoView({behavior:'smooth',block:'start'});memeFillFromSearch();},200);}function memeUseSearchVerse(payload){if(!payload)return;lastSearchVerse=payload;memeFillFromSearch();}function memeFormatRef(v){if(!v)return'';if(v.ref)return v.ref;if(v.surah&&v.ayah)return'Qur’an '+v.surah+':'+v.ayah;if(v.key)return'Qur’an '+v.key;return'';}function memeFillFromSearch(){const v=lastSearchVerse;if(!v||(!v.arabic&&!v.en)){alert('Search for a verse in the Search tab first, then tap “Use in Meme” or this button.');return;}const topEl=document.getElementById('meme-top-input');const midEl=document.getElementById('meme-mid-input');const botEl=document.getElementById('meme-bottom-input');const ref=memeFormatRef(v);if(topEl)topEl.value=String(v.arabic||'').trim();if(midEl)midEl.value=String(v.en||'').trim();const ur=String(v.ur||'').trim();if(botEl)botEl.value=String(ref||'').trim();memeState.topY=0.11;memeState.midY=0.46;memeState.bottomY=0.82;memePositionBoxes();memeSyncFromInputs();try{memeAutoFitSizes();memeDraw();}catch(e){}}
var CHAR_BANK=[
{title:'Truthfulness',text:'The Prophet ﷺ said: “Upon you is truthfulness. Truthfulness leads to righteousness, and righteousness leads to Paradise…”',ref:'Bukhari 6094 · Muslim 2607',ponder:'One honest sentence today is heavier than ten polished excuses.'},
{title:'Gentleness',text:'“Wherever gentleness is found, it beautifies what it is in; and when it is removed, it disfigures.”',ref:'Muslim 2594',ponder:'Where can you lower your voice and raise your adab?'},
{title:'Guarding the tongue',text:'“Whoever believes in Allah and the Last Day, let him speak good or remain silent.”',ref:'Bukhari 6018 · Muslim 47',ponder:'Silence is a ṣadaqah when speech would bruise.'},
{title:'Modesty',text:'“Modesty is part of faith.”',ref:'Bukhari 24 · Muslim 36',ponder:'Modesty is not weakness — it is light that restrains the self.'},
{title:'Reliance',text:'“If you relied on Allah as He should be relied on, He would provide for you as He provides for the birds…”',ref:'Tirmidhi 2344',ponder:'Tie your camel — then trust. Effort without tawakkul is noise.'},
{title:'Removing harm',text:'“Faith has over seventy branches… the removal of harm from the road is a branch of faith.”',ref:'Muslim 35',ponder:'What small harm can you clear from someone’s path today?'},
{title:'Loving for others',text:'“None of you truly believes until he loves for his brother what he loves for himself.”',ref:'Bukhari 13 · Muslim 45',ponder:'Wish for them the ease you beg for yourself.'},
{title:'Controlling anger',text:'“The strong is not the one who overcomes people by his strength, but the one who controls himself while angry.”',ref:'Bukhari 6114 · Muslim 2609',ponder:'When heat rises: seek refuge, sit or lie down, renew wuḍūʾ.'},
{title:'Honouring parents',text:'“The pleasure of the Lord is in the pleasure of the parents…”',ref:'Tirmidhi 1899',ponder:'One kind call can outweigh a day of empty busyness.'},
{title:'Consistency',text:'“The most beloved of deeds to Allah are the most consistent, even if small.”',ref:'Bukhari 6464 · Muslim 783',ponder:'A small daily deed that survives is better than a burst that dies.'}
];

async function loadLesson(count){
  const el=document.getElementById('lesson');
  if(!el)return;
  el.innerHTML='<div class="loading-msg">Loading…</div>';
  function renderBank(){
    const h=CHAR_BANK[Math.floor(Math.random()*CHAR_BANK.length)];
    el.innerHTML='<strong style="font-size:1.12rem;color:var(--accent)">'+h.title+'</strong>'+
      '<p style="margin-top:0.65rem;font-size:1.02rem;">“'+h.text+'”</p>'+
      '<div class="ponder-box">'+h.ponder+'</div>'+
      '<div class="ref">'+h.ref+'</div>'+
      '<div class="deep-learn" style="margin-top:.65rem"><strong>📚 Go deeper</strong><div class="res-stack">'+
      '<a href="https://sunnah.com/search?q='+encodeURIComponent(h.title)+'" target="_blank" rel="noopener">Sunnah.com</a> '+
      '<a href="https://islamqa.info/en/search?q='+encodeURIComponent(h.title)+'" target="_blank" rel="noopener">IslamQA</a> '+
      '<a href="https://sunnah.com/riyadussalihin" target="_blank" rel="noopener">Riyāḍ al-Ṣāliḥīn</a></div></div>';
    if(count&&typeof recordLesson==='function')recordLesson();
  }
  try{
    const res=await fetch('https://ummahapi.com/api/hadith/random');
    const data=await res.json();
    const h=data.data||data;
    const t=h.hadith_english||h.english||h.text||'';
    if(!t){renderBank();return;}
    const ref=[h.collection,h.hadithNumber||h.number].filter(Boolean).join(' ');
    el.innerHTML='<strong style="font-size:1.12rem;color:var(--accent)">Character from the Sunnah</strong>'+
      '<p style="margin-top:0.65rem;font-size:1.02rem;">“'+t+'”</p>'+
      '<div class="ponder-box">'+(typeof ponder==='function'?ponder(t):'Act on one word from this ḥadīth today.')+'</div>'+
      '<div class="ref">'+ref+'</div>'+
      '<div class="deep-learn" style="margin-top:.65rem"><strong>📚 Verify &amp; study</strong><div class="res-stack">'+
      '<a href="https://sunnah.com" target="_blank" rel="noopener">Sunnah.com</a> '+
      '<a href="https://dorar.net/en" target="_blank" rel="noopener">Dorar</a> '+
      '<a href="https://islamqa.info/en" target="_blank" rel="noopener">IslamQA</a></div></div>';
    if(count&&typeof recordLesson==='function')recordLesson();
  }catch(e){renderBank();}
}
const seerahMoments=[{title:"The Prophet’s Mercy with Children",event:"The Prophet ﷺ would shorten the prayer when he heard a child crying so that the mother would not be distressed. He carried his granddaughter Umamah on his shoulder during prayer, putting her down when he prostrated and lifting her when he stood.",lesson:"True strength includes gentleness. Adjusting our plans out of mercy for the weak is part of following the Messenger ﷺ.",ref:"Sahih Muslim • Sahih al-Bukhari"},{title:"Forgiving the People of Makkah",event:"After years of persecution, when the Prophet ﷺ entered Makkah as a victor, he stood at the door of the Kaaba and said to those who had harmed him: “Go, for you are free.” He forgave even those who had killed his companions and mutilated their bodies.",lesson:"When we gain the upper hand, the Prophetic example is mercy over revenge. Forgiveness at the moment of power is one of the highest forms of character.",ref:"Seerah Ibn Hisham • Seerah Ibn Ishaq"},{title:"Serving His Family",event:"Aisha (RA) was asked what the Prophet ﷺ used to do in his house. She replied: “He used to serve his family, and when the time for prayer came he would go out to pray.” He mended his own clothes, milked the goat, and helped with household work.",lesson:"Helping at home is not a loss of dignity; it is part of the Sunnah of the best of creation. The one who is greatest in the sight of Allah is also the most humble with those closest to him.",ref:"Sahih al-Bukhari"},{title:"Visiting the Sick",event:"The Prophet ﷺ regularly visited the sick, sat with them, made du’a for them, and reminded them of the reward of patience. He even visited a Jewish servant who used to serve him when the boy fell ill, and invited him to Islam.",lesson:"A short visit, a sincere message, or a quiet du’a for someone who is ill is a living Sunnah that brings comfort in this life and reward in the next.",ref:"Sahih al-Bukhari • Sahih Muslim"},{title:"The Smile of the Prophet ﷺ",event:"The companions described the Prophet ﷺ as someone who smiled often. Jarir (RA) said: “The Messenger of Allah never saw me except that he smiled.” His face was described as more beautiful than the full moon.",lesson:"A genuine smile is charity. Bringing ease and light to the faces of others is a small deed with great weight when done for the sake of Allah.",ref:"Jami` at-Tirmidhi • Sahih al-Bukhari"},{title:"Standing for Justice Even Against His Own",event:"When a woman from Banu Makhzum stole and some companions tried to intercede because of her status, the Prophet ﷺ became angry and said: “By Allah, if Fatimah the daughter of Muhammad were to steal, I would cut off her hand.”",lesson:"Justice is not bent for family, status or friendship. The Prophet ﷺ established that the law of Allah applies equally to everyone.",ref:"Sahih al-Bukhari • Sahih Muslim"}];let seerahIdx=0;function loadSeerah(){
  const s=seerahMoments[seerahIdx%seerahMoments.length];
  seerahIdx++;
  const ref=String(s.ref||'');
  const low=ref.toLowerCase();
  let grade='Study source';
  let gcls='grade-verify';
  if(low.includes('bukhari')||low.includes('muslim')||low.includes('sahih')||low.includes('ṣaḥīḥ')){
    grade='Ṣaḥīḥ / canonical report'; gcls='grade-sahih';
  } else if(low.includes('hasan')){ grade='Ḥasan (where graded)'; gcls='grade-hasan'; }
  else if(low.includes('seerah')||low.includes('sīrah')||low.includes('ibn hisham')||low.includes('mubarakpuri')){
    grade='Seerah literature — verify reports'; gcls='grade-verify';
  }
  const el=document.getElementById("seerah-content");
  if(!el) return;
  el.innerHTML=
    '<div class="hadith-meta-bar" style="display:flex;flex-wrap:wrap;gap:.35rem;margin:0 0 .45rem">'+
      '<span class="hadith-grade-pill '+gcls+'" style="font-size:.72rem;font-weight:700;padding:.2rem .5rem;border-radius:999px;border:1px solid rgba(212,180,90,.45);background:rgba(212,180,90,.12)">'+grade+'</span>'+
      '<span style="font-size:.72rem;padding:.2rem .5rem;border-radius:999px;border:1px solid rgba(255,255,255,.15)">📚 '+ref.replace(/</g,'')+'</span>'+
    '</div>'+
    '<div class="story-title">'+(s.title||'')+'</div>'+
    '<p>'+(s.event||'')+'</p>'+
    '<div class="ponder-box">'+(s.lesson||'')+'</div>'+
    '<div class="ref">'+ref+' · <strong>Educational only — not a fatwa.</strong> Prefer ṣaḥīḥ when acting on a report.</div>';
}const zikrWithVirtues=[{arabic:"سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",english:"Glory be to Allah and praise be to Him.",hadith:"The Prophet ﷺ said: “There are two statements that are light for the tongue, heavy in the Scales and dear to the Merciful: ‘Subhan-Allahi wa bihamdihi, Subhan-Allahil-Azim.’” (Sahih al-Bukhari 6682, Sahih Muslim 2694). Whoever says it 100 times a day, his sins are forgiven even if they are like the foam of the sea (Muslim 2691).",blessing:"Heavy on the scales, beloved to Allah, and a means of forgiveness."},{arabic:"سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ",english:"Glory be to Allah, all praise is for Allah, there is no god but Allah, and Allah is the Greatest.",hadith:"The Prophet ﷺ said: “The uttering of the words ‘Subhan-Allah, Al-hamdu lillah, La ilaha illallah and Allahu Akbar’ is dearer to me than anything over which the sun rises.” (Sahih Muslim 2695). These are the everlasting good deeds (al-baqiyat as-salihat).",blessing:"Most beloved speech to Allah; plants of Paradise; better than the world and what is in it."},{arabic:"لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",english:"There is no god but Allah, alone, without partner. His is the dominion and His is the praise, and He is over all things competent.",hadith:"Whoever says this 100 times a day will have the reward of freeing ten slaves, 100 good deeds written, 100 sins erased, and protection from Shaytan until evening (Sahih al-Bukhari 3293, Sahih Muslim 2691).",blessing:"Equivalent to freeing slaves, massive reward, and daily protection."},{arabic:"أَسْتَغْفِرُ اللَّهَ",english:"I seek forgiveness from Allah.",hadith:"The Prophet ﷺ said: “By Allah, I seek Allah’s forgiveness and repent to Him more than seventy times a day.” (Sahih al-Bukhari 6307). “Whoever says ‘Astaghfirullah’ regularly, Allah will make a way out of every difficulty and provide from where he does not expect.” (Abu Dawud 1518, graded hasan).",blessing:"Opens doors of relief, provision, and forgiveness; the Prophet ﷺ himself did it constantly."},{arabic:"اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ",english:"O Allah, send blessings upon Muhammad and upon the family of Muhammad.",hadith:"The Prophet ﷺ said: “Whoever sends blessings upon me once, Allah will send blessings upon him tenfold.” (Sahih Muslim 408). “The closest of people to me on the Day of Resurrection will be those who sent the most blessings upon me.” (Tirmidhi 484).",blessing:"Tenfold return from Allah; nearness to the Prophet ﷺ on the Day of Judgement."},{arabic:"سُبْحَانَ اللَّهِ (٣٣) الْحَمْدُ لِلَّهِ (٣٣) اللَّهُ أَكْبَرُ (٣٤)",english:"SubhanAllah 33×, Alhamdulillah 33×, Allahu Akbar 34× (after each prayer).",hadith:"Whoever glorifies Allah 33 times, praises Him 33 times and magnifies Him 34 times after each prayer — his sins will be forgiven even if they were as abundant as the foam of the sea. (Sahih Muslim 597). This is the Tasbih Fatimi taught to Fatimah (RA).",blessing:"Forgiveness of sins after every salah; taught by the Prophet ﷺ to his own daughter."}];let zikrIdx=0;async function loadZikr(){const el=document.getElementById("zikr");if(!el||!el.tagName)return;el.innerHTML='<div class="loading-msg">Loading…</div>';const z=zikrWithVirtues[zikrIdx%zikrWithVirtues.length];zikrIdx++;el.innerHTML=`
        <div class="arabic-calligraphy">${z.arabic}</div>
        <p style="font-size:1.05rem; margin-top:0.35rem"><strong>${z.english}</strong></p>
        <div class="ponder-box"><strong>Authentic virtue:</strong> ${z.hadith}</div>
        <p style="font-size:0.9rem; color:#0f4c3a; margin-top:0.55rem"><strong>Blessing:</strong> ${z.blessing}</p>`;}const prophetStories=[{title:"Prophet Adam عليه السلام",short:"Allah created Adam from clay with His own hands, breathed into him of His spirit, and taught him the names of all things. The angels were commanded to prostrate to him in honour. Iblis refused out of arrogance and was expelled. Adam and Hawwa lived in Paradise until they were deceived by Shaytan and ate from the forbidden tree. They immediately repented with the words taught by Allah, and their repentance was accepted.",more:"Their story teaches that the first human being erred, yet the door of tawbah remained open. Every child of Adam inherits both the capacity to slip and the capacity to return to Allah. Despair is never an option while the heart can still turn back.",ref:"Quran 2:30-39 • 7:11-25 • 20:115-122"},{title:"Prophet Nuh عليه السلام",short:"Nuh called his people to the worship of Allah alone for nine hundred and fifty years. He used every method – private and public, night and day – yet only a few believed. Allah commanded him to build the Ark under His guidance. When the flood came, the believers were saved and the disbelievers, including Nuh’s own son who refused to board, were destroyed.",more:"His life is the greatest example of long-term perseverance in dawah. Results belong to Allah; our duty is to convey with patience and clarity, even when the response is rejection for decades.",ref:"Quran 11:25-49 • 71 • 7:59-64"},{title:"Prophet Ibrahim عليه السلام",short:"Ibrahim is Khalilullah – the close friend of Allah. From a young age he rejected the idols of his people. He was thrown into a great fire, but Allah ordered the fire to be cool and safe for him. He left his wife Hajar and infant son Ismail in the barren valley of Makkah in obedience to Allah. Later he and Ismail raised the foundations of the Kaaba. He was willing to sacrifice his son when commanded in a dream, and Allah replaced the son with a ram.",more:"Ibrahim’s life is pure Tawhid in action: courage against falsehood, complete trust when leaving his family in the desert, and total submission even when the command seemed impossible. He is the model of “Islam” – surrender to Allah.",ref:"Quran 21:51-70 • 37:83-113 • 2:124-129 • 14:35-41"},{title:"Prophet Musa عليه السلام",short:"Musa was saved as a baby from Pharaoh’s slaughter of the male children and raised in Pharaoh’s own palace. He fled to Madyan after an accidental killing, then was chosen by Allah at the burning bush and given clear signs. He confronted Pharaoh, led the Children of Israel out of Egypt, and the sea was parted for them while it closed over Pharaoh and his army. He received the Torah and spent forty nights in close communion with Allah on the mountain.",more:"Musa’s story shows that no tyrant is beyond Allah’s power. Speaking truth to oppressive authority, even when one feels inadequate in speech, is part of prophetic courage. Allah uses the weak to humble the mighty.",ref:"Quran 20 • 28 • 26 • 7:103-171"},{title:"Prophet Isa عليه السلام",short:"Isa was born miraculously to the pure Maryam without a father. He spoke from the cradle in defence of his mother. By Allah’s permission he healed the blind and the leper, raised the dead, and fashioned a bird from clay that came to life. His people plotted to kill him, but Allah raised him up and saved him from their schemes. He will return before the Day of Judgement.",more:"Muslims honour Isa as one of the greatest messengers, born of a pure mother, supported by clear miracles. We reject both the extremes that later groups attributed to him, and we await his return as a just ruler who will break the cross and kill the swine.",ref:"Quran 3:45-55 • 19 • 5:110-120 • 4:157-159"},{title:"Prophet Muhammad ﷺ",short:"Muhammad ﷺ is the final messenger, sent as a mercy to all the worlds. Orphaned young, known as Al-Amin before revelation, he received the first revelation in the cave of Hira at the age of forty. He called to pure monotheism for thirteen years in Makkah under severe persecution, then established a just society in Madinah. He forgave his enemies after the conquest of Makkah, completed the religion, and left behind the Quran and his Sunnah as guidance until the end of time.",more:"Following his character – mercy, honesty, humility, courage, and constant remembrance of Allah – is the practical way to prepare for the meeting with Allah. His life is the living tafsir of the Quran.",ref:"Quran 21:107 • 33:21 • 68:4 • 9:128"}];let prophetIdx=0;function loadProphetStory(){const s=prophetStories[prophetIdx%prophetStories.length];prophetIdx++;const _ps=document.getElementById("prophet-story");if(!_ps||!_ps.tagName)return;_ps.innerHTML=`
        <div class="story-title">${s.title}</div>
        <p>${s.short}</p>
        <div class="ponder-box">${s.more}</div>
        <div class="ref">${s.ref}</div>`;}const israeliyatLessons=[{title:"The Man Who Killed 99 People",text:"A man from the Children of Israel killed ninety-nine people. He asked a worshipper if he could repent; the worshipper said no, so he killed him as well, completing one hundred. He then asked a scholar, who told him that nothing stands between a person and repentance, and advised him to go to a particular town of righteous people. He set out, but died on the way. The angels of mercy and the angels of punishment disputed over him. Allah ordered the land to be measured; he was found to be closer to the land of righteousness by a handspan, so he was forgiven.",modern:"Never despair of the mercy of Allah, no matter how great the sin. Sincere repentance combined with moving toward good can completely change a person’s ending. The door remains open until the soul reaches the throat.",ref:"Sahih al-Bukhari 3470 • Sahih Muslim 2766"},{title:"The Three Men Trapped in the Cave",text:"Three men were trapped in a cave by a falling rock. Each one made du’a by the most sincere good deed he had done purely for the sake of Allah. The first mentioned honouring his elderly parents; the second mentioned leaving a woman he loved when she refused unless he came through haram; the third mentioned returning the full amount of a trust that had grown into a large flock. With each sincere du’a the rock moved a little until they were freed.",modern:"Sincere deeds done only for Allah become a means of relief in the darkest moments of life – and they will be a means of relief in the darkness of the grave.",ref:"Sahih al-Bukhari 2272 • Sahih Muslim 2743"},{title:"The Woman Forgiven for a Dog",text:"A woman from the Children of Israel was forgiven because she saw a dog dying of thirst beside a well. She took off her shoe, filled it with water, and gave it to the dog to drink. Another woman entered the Fire because she kept a cat imprisoned, neither feeding it nor allowing it to hunt for itself, until it died.",modern:"Mercy to animals is part of faith. Small acts of compassion can be a cause of forgiveness, while cruelty – even to a creature that cannot speak – can be a cause of punishment.",ref:"Sahih al-Bukhari 3321 • Sahih Muslim 2245"},{title:"Juraij the Worshipper and His Mother",text:"Juraij was a devoted worshipper among the Children of Israel. His mother called him while he was praying. He said, “O Allah, my mother or my prayer?” and continued praying. She called a second and third time, then prayed that he would not die until he looked into the faces of prostitutes. Later he was falsely accused of fathering a child. Allah caused the infant to speak and clear his name, saying the real father was a shepherd.",modern:"The rights of parents are extremely high. Responding to a parent’s call can take precedence over voluntary prayer. Neglecting parents, even while busy with worship, can bring trials.",ref:"Sahih al-Bukhari 2483 • Sahih Muslim 2550"},{title:"The Boy and the King",text:"A young boy accepted the truth of pure monotheism after witnessing clear signs. A tyrant king ordered him to be killed in various ways, but he was protected until he told the king: “You will not be able to kill me until you do what I say. Gather the people, crucify me on a tree, take an arrow from my quiver, and say ‘In the name of the Lord of this boy’ then shoot.” The king did so, the boy died, and the people declared, “We believe in the Lord of this boy.”",modern:"Standing for truth can carry a high cost. Firmness upon faith, even for the young, is a recurring lesson from previous nations. Allah can turn the death of one sincere believer into the guidance of many.",ref:"Sahih Muslim 3005"}];let israeliyatIdx=0;function loadIsraeliyat(){const item=israeliyatLessons[israeliyatIdx%israeliyatLessons.length];israeliyatIdx++;const _ic=document.getElementById("israeliyat-content");if(!_ic||!_ic.tagName)return;_ic.innerHTML=`
        <div class="story-title">${item.title}</div>
        <p>${item.text}</p>
        <div class="ponder-box">${item.modern}</div>
        <div class="ref">${item.ref}</div>`;}const lifeTopics=[{title:"Job loss, debt, or financial strain",q:"patience",event:"Losing work, facing unpaid bills, or sudden expense",modern:"Scholars frame livelihood tests as part of qadar: the believer responds with gratitude in ease and patience in hardship (Sahih Muslim 2999). Ibn al-Qayyim taught that the past is not fixed by sorrow but by contentment, gratitude, patience, and trust in Allah’s decree. IslamQA and classical manuals urge lawful effort (seeking work, cutting waste, asking qualified help) without despair or unlawful shortcuts.",action:"Today: update one application or budget line, give a small ṣadaqah if you can, and say “Hasbiyallāhu wa niʿmal-wakīl” after each setback. Avoid complaining that questions Allah’s wisdom.",sources:"Qur’an 94:5–6; Muslim 2999; path of sabr in worldly difficulties (classical summaries)"},{title:"Illness in the family or oneself",q:"patience",event:"Chronic illness, hospital visits, or caring for a sick relative",modern:"Calamity can expiate sins and raise ranks when met with sabr. The Prophet ﷺ visited the sick, made duʿāʾ for them, and reminded them of the reward of patience. Wailing, tearing clothes, or words of dissatisfaction with the decree are prohibited; quiet endurance and lawful treatment are the Prophetic path.",action:"Today: one sincere visit or message, one duʿāʾ by name, and one act of service (medicine, errand, or simply sitting with the person). Journal the hardship and write “ḥasbunā Allāh” beside it.",sources:"Bukhari (visiting the sick); Muslim on sabr; rulings on response to calamity"},{title:"Ageing or difficult parents",q:"parents",event:"Elderly care, repeated requests, or a strained parent relationship",modern:"Qur’an 17:23–24 forbids even “uff” of irritation and commands kind speech, especially in old age. Filial duty remains after the rights of Allah; some scholars note the verse addresses the irritation of helping with personal care. A righteous child’s duʿāʾ continues to benefit parents after death (Muslim).",action:"Today: call or visit, ask about one practical need, and make duʿāʾ for them by name before sleep — even if the relationship is hard. Lower the wing of humility (Qur’an 17:24).",sources:"Qur’an 17:23–24; 31:14; Muslim (three ongoing deeds); family-life guidance in fiqh literature"},{title:"Marriage, conflict, or building a home",q:"marriage",event:"Wedding planning, spouse disagreement, or neglect of household rights",modern:"Marriage is a covenant of mercy and mutual rights, not a scoreboard. Islam encourages marriage, forbids unlawful relationships outside it, and counts spending on one’s family among the best spending. Kind speech, fulfilling known rights, and avoiding public shaming of a spouse are repeatedly stressed in the Sunnah and fiqh of the family.",action:"Today: one concrete kindness (help at home, a calm conversation, or a private apology). If conflict is serious, seek a trustworthy mediator rather than social-media venting.",sources:"Qur’an 30:21; 4:19; Sunnah on kind treatment; family-life manuals"},{title:"Birth, naming, and early parenting",q:"children",event:"Newborn, naming, ʿaqīqah, or early tarbiyah stress",modern:"Welcoming a child with gratitude, a good name, and the Prophetic rites (including ʿaqīqah when affordable) is part of the Sunnah. The best gift a parent can give is good education and character training. Daughters raised with kindness are a path to Paradise in authentic reports. Maintenance of children is a legal duty.",action:"Today: make duʿāʾ for the child’s faith and character, learn one Sunnah related to newborns if relevant, and prioritise calm presence over perfect routines.",sources:"Sunnah on ʿaqīqah and naming; reports on raising daughters; fiqh of nafaqah"},{title:"Death of a loved one",q:"death",event:"Funeral, grief, or how to benefit the deceased",modern:"Grief is human; the forbidden is excess that challenges the decree (wailing, self-harm, or despair of Allah’s mercy). The living benefit the dead — by Allah’s permission — through duʿāʾ, istighfār, ṣadaqah on their behalf, and (when conditions are met) ḥajj/ʿumrah. Ongoing charity, beneficial knowledge, and a righteous child’s prayer continue after death (Muslim).",action:"Today: one sincere duʿāʾ for the deceased by name, a small charity on their behalf if you can, and patience with the stages of grief without isolating from ṣalāh and community.",sources:"Muslim (three ongoing deeds); Ghazālī, Ibn Taymiyyah, Ibn al-Qayyim, Nawawī on benefiting the dead"},{title:"Anger at work, online, or at home",q:"anger",event:"Traffic, workplace insult, viral argument, or family flare-up",modern:"The strong person is the one who controls himself in anger. Prophetic remedies: sit if standing, lie down if sitting, make wuḍūʾ, leave the place, and seek refuge from Shayṭān. Qur’an 42:37 praises those who forgive when angry. Uncontrolled anger often produces words one must answer for on the Day of Judgement.",action:"Today: when heat rises, physically leave the chat or room for two minutes, recite the istiʿādhah, and only reply after the pulse settles. If you already spoke harshly, apologise the same day.",sources:"Bukhari & Muslim on anger; Qur’an 42:37; 3:134"},{title:"Guarding prayer in a busy schedule",q:"prayer",event:"Meetings, travel, exams, or shift work competing with ṣalāh times",modern:"The five prayers structure the day around Allah. Protecting them on time — with whatever ease the sharīʿah allows for travel or fear — is prioritised over optional work polish. Scholars stress not delaying until the time exits without a valid excuse, and making up what was missed promptly.",action:"Today: set a reminder 5–10 minutes before each prayer, identify a clean quiet spot at work or school, and treat the prayer slot as a fixed appointment you do not casually move.",sources:"Qur’an 2:238; 4:103; fiqh of prayer times and travel"},{title:"Wealth, spending, and charity",q:"charity",event:"Salary increase, impulse shopping, or hesitation to give",modern:"Wealth is a trust. Charity does not decrease wealth; angels daily invoke blessing on the giver and loss on the miser (Bukhari). Zakāt is an obligation on qualifying wealth; ṣadaqah beyond that is a path of purification and shade on the Day of Judgement. Ongoing charity continues after death.",action:"Today: automate a small monthly ṣadaqah or give something when good news arrives. Before a non-essential purchase, ask whether it will accompany you in the grave.",sources:"Bukhari (angels’ duʿāʾ); Muslim (ongoing deeds); zakāt fiqh summaries"},{title:"Repentance after a fall",q:"forgiveness",event:"A sin, a broken promise, or harm done to another person",modern:"Tawbah remains open until the soul reaches the throat. Conditions emphasised by scholars: stop the sin, regret it, resolve not to return, and restore rights or seek forgiveness from anyone wronged. The Prophet ﷺ sought forgiveness frequently despite being forgiven (Bukhari 6307). Regular istighfār is linked to relief from distress (Abu Dawud, hasan).",action:"Today: name the mistake privately before Allah, repair any human right involved, and replace the slot of the sin with a small fixed good deed for the next week.",sources:"Bukhari 6307; Abu Dawud 1518; classical chapters on tawbah"},{title:"Honesty in business and online life",q:"truth",event:"Sales pitch, résumé, social media image, or a entrusted secret",modern:"Truthfulness leads to righteousness and Paradise; lying leads to wickedness and the Fire (Bukhari & Muslim). Amānah (trust) is part of faith; its betrayal is a sign of hypocrisy. Barakah follows clear dealing; deceit may bring short gain and long loss.",action:"Today: correct one exaggeration you have been repeating, return or clarify one trust, and prefer the harder truthful sentence in your next negotiation or post.",sources:"Bukhari & Muslim (truthfulness); hadith on signs of hypocrisy"}];
function lifeEventThemeIcon(topic){
  try{
    var blob = ((topic&&topic.title)||'')+' '+((topic&&topic.q)||'')+' '+((topic&&topic.event)||'');
    blob = blob.toLowerCase();
    if(/job|debt|financ|money|work|livelihood|salary/.test(blob)) return '💼';
    if(/ill|sick|hospital|health|pain|disease/.test(blob)) return '🏥';
    if(/marri|wedding|spouse|wife|husband|nikah/.test(blob)) return '💍';
    if(/birth|baby|newborn|pregnancy|child/.test(blob)) return '👶';
    if(/death|funeral|grave|bereave|loss of|mourning/.test(blob)) return '🌙';
    if(/parent|mother|father|family/.test(blob)) return '👨‍👩‍👧';
    if(/anger|rage|temper/.test(blob)) return '🕊️';
    if(/anxiety|worry|stress|fear|sad/.test(blob)) return '💧';
    if(/charity|sadaqah|poor|orphan/.test(blob)) return '🎁';
    if(/patience|sabr|hardship|trial/.test(blob)) return '🌱';
    if(/travel|journey|hijra/.test(blob)) return '✈️';
    if(/neighbor|community/.test(blob)) return '🏠';
    if(/truth|honesty|lie/.test(blob)) return '💎';
    if(/prayer|salah|worship/.test(blob)) return '🕌';
    if(/forgiv|tawbah|repent/.test(blob)) return '🤲';
    return '📚';
  }catch(e){ return '📚'; }
}
function lifeEventDeepLearnHtml(topic){
  var icon = lifeEventThemeIcon(topic);
  var q = encodeURIComponent((topic&&(topic.q||topic.title))||'guidance');
  var title = (topic&&topic.title)||'this topic';
  return '<div class="deep-learn life-event-deep" style="margin-top:.55rem">'+
    '<strong>'+icon+' Deep learning · '+title.replace(/</g,'')+'</strong>'+
    '<div class="res-stack">'+
    '<a href="https://islamqa.info/en/search?q='+q+'" target="_blank" rel="noopener">📖 IslamQA</a>'+
    '<a href="https://sunnah.com/search?q='+q+'" target="_blank" rel="noopener">📗 Sunnah.com</a>'+
    '<a href="https://seekersguidance.org" target="_blank" rel="noopener">🎓 SeekersGuidance</a>'+
    '<a href="https://quran.com/search?q='+q+'" target="_blank" rel="noopener">🌙 Quran.com</a>'+
    '</div></div>';
}

async function loadLifeEvent(){const el=document.getElementById("life-event");el.innerHTML='<div class="loading-msg">Loading guidance…</div>';const topic=lifeTopics[Math.floor(Math.random()*lifeTopics.length)];const eventLine=topic.event?`<p style="font-size:0.92rem;color:var(--text-muted);margin:0.25rem 0 0.65rem"><strong>Real-life situation:</strong> ${topic.event}</p>`:"";const actionBox=topic.action?`<div class="ponder-box" style="border-left-color:#0f4c3a"><strong>Action today:</strong> ${topic.action}</div>`:"";const sourceLine=topic.sources?`<div class="ref">Grounded in: ${topic.sources}</div>`:"";try{const res=await fetch("https://ummahapi.com/api/hadith/search?q="+encodeURIComponent(topic.q));const data=await res.json();const matches=data.data||data.results||[];if(matches.length){const h=matches[0];const text=h.hadith_english||h.english||h.text||"";el.innerHTML=`
            <div class="story-title">${topic.title}</div>
            ${eventLine}
            <p><strong>From the Sunnah:</strong> “${text}”</p>
            <div class="ponder-box"><strong>Pondering:</strong> ${topic.modern}</div>
            ${actionBox}
            <div class="ponder-box">${ponder(text)}</div>
            <div class="ref">${[h.collection, h.hadithNumber].filter(Boolean).join(" ")}</div>
            ${sourceLine}${lifeEventDeepLearnHtml(topic)}`;}else throw new Error("empty");}catch(e){el.innerHTML=`
          <div class="story-title">${topic.title}</div>
          ${eventLine}
          <div class="ponder-box"><strong>Pondering:</strong> ${topic.modern}</div>
          ${actionBox}
          ${sourceLine}${lifeEventDeepLearnHtml(topic)}
          <p style="margin-top:0.55rem;">Search “${topic.q}” on <a href="https://sunnah.com/search?q=${encodeURIComponent(topic.q)}" target="_blank" rel="noopener">sunnah.com</a> for authentic narrations.</p>`;}}function searchLifeOrHadith(){const q=document.getElementById("life-search").value.trim();if(!q)return;const gist=expandSearchQuery(q);document.getElementById("hadith-search").value=gist.primary;searchHadith();(function(){var _lr=document.getElementById("life-results");if(_lr&&_lr.tagName)_lr.innerHTML="<p>Using your theme as a guide (not an exact-word lock) — related hadith below.</p>";})();}const qa=[
{topic:'rituals',q:'How do I make a valid wuḍūʾ?',a:'Wash the required limbs in order with intention: face, arms to the elbows, wipe the head, wash the feet to the ankles. Use pure water.',ref:'Quran 5:6',links:[{t:'IslamQA — Wuḍūʾ',u:'https://islamqa.info/en/answers/11423'},{t:'SeekersGuidance — Nullifiers',u:'https://seekersguidance.org/answers/hanafi-fiqh/what-nullifies-wudu/'}]},
{topic:'rituals',q:'What if I miss a prayer?',a:'Pray it as soon as you remember. Do not delay without a valid excuse.',ref:'Bukhari 597 · Muslim 684',links:[{t:'IslamQA — Missed prayers',u:'https://islamqa.info/en/answers/13340'}]},
{topic:'rituals',q:'Can travellers shorten or combine prayers?',a:'Travellers may shorten four-rakʿah prayers to two. Combining is allowed in many schools when travelling; details differ by madhhab.',ref:'Quran 4:101',links:[{t:'IslamQA — Shortening',u:'https://islamqa.info/en/answers/111894'},{t:'IslamQA — Combining',u:'https://islamqa.info/en/answers/105108'}]},
{topic:'rituals',q:'How do I pray when sick?',a:'Stand if you can; otherwise sit; otherwise on your side. Do not abandon prayer.',ref:'Bukhari 1117',links:[{t:'IslamQA — Prayer of the sick',u:'https://islamqa.info/en/answers/13271'}]},
{topic:'rituals',q:'How is zakāh calculated?',a:'Typically 2.5% of qualifying wealth above the niṣāb held for a lunar year.',ref:'Quran 9:60',links:[{t:'IslamQA — Zakāh',u:'https://islamqa.info/en/answers/69'},{t:'Calculator',u:'https://www.islamicfinder.org/zakat-calculator/'}]},
{topic:'rituals',q:'Who may break the Ramaḍān fast?',a:'The ill and travellers may break and make up later. Chronic inability may use fidya where applicable.',ref:'Quran 2:184–185',links:[{t:'IslamQA — Breaking the fast',u:'https://islamqa.info/en/answers/26865'}]},
{topic:'life',q:'Sunnahs when a child is born?',a:'Good name, ʿaqīqah if able, and reported practices of adhān and charity for the hair.',ref:'Abu Dawud · Tirmidhi',links:[{t:'IslamQA — Newborn',u:'https://islamqa.info/en/answers/7889'}]},
{topic:'life',q:'Basics of an Islamic marriage?',a:'Offer and acceptance, guardian (in many schools), two witnesses, and mahr — with mutual consent.',ref:'Quran 4:4',links:[{t:'IslamQA — Marriage',u:'https://islamqa.info/en/answers/2127'}]},
{topic:'life',q:'What about ribā (interest)?',a:'Ribā is prohibited. Prefer ḥalāl alternatives; consult a trusted local scholar for complex contracts.',ref:'Quran 2:275–279',links:[{t:'IslamQA — Ribā',u:'https://islamqa.info/en/answers/12811'}]},
{topic:'life',q:'What benefits the deceased?',a:'Ongoing charity, beneficial knowledge, and a righteous child who prays for them.',ref:'Muslim 1631',links:[{t:'IslamQA — Benefits the dead',u:'https://islamqa.info/en/answers/763'}]},
{topic:'life',q:'How do I repent from a major sin?',a:'Stop, regret, resolve not to return, and restore people’s rights if involved.',ref:'Quran 39:53',links:[{t:'IslamQA — Tawbah',u:'https://islamqa.info/en/answers/13990'}]},
{topic:'life',q:'How do I deal with waswasa and anxiety?',a:'Seek refuge in Allah, avoid obsessing over intrusive thoughts, keep prayer and dhikr, and take lawful means including professional care when needed.',ref:'Quran 2:286',links:[{t:'IslamQA — Waswasa',u:'https://islamqa.info/en/answers/62839'}]},
{topic:'hajj',q:'What are the pillars of Hajj?',a:'Commonly: iḥrām, standing at ʿArafah, ṭawāf al-ifāḍah, and saʿī (lists vary slightly by school). A missed pillar must be completed.',ref:'haj.gov.sa · IslamQA 31822',links:[{t:'Ministry of Hajj',u:'https://haj.gov.sa/en/Hajj'},{t:'IslamQA — Hajj',u:'https://islamqa.info/en/answers/31822'}]},
{topic:'hajj',q:'Tamattuʿ vs Qirān vs Ifrād?',a:'Tamattuʿ: ʿUmrah then Hajj (common for visitors). Qirān: both in one iḥrām with sacrifice. Ifrād: Hajj only.',ref:'IslamQA 109325',links:[{t:'IslamQA — Types of Hajj',u:'https://islamqa.info/en/answers/109325'}]},
{topic:'hajj',q:'Why is ʿArafah so important?',a:'The Prophet ﷺ said Hajj is ʿArafah. Presence within its boundaries on the 9th is the central pillar.',ref:'Tirmidhi · Muslim',links:[{t:'IslamQA — ʿArafah',u:'https://islamqa.info/en/answers/109313'}]},
{topic:'hajj',q:'What if I break an iḥrām rule?',a:'Many violations require a specified fidya. Ask your group scholar for your exact case.',ref:'IslamQA 11356',links:[{t:'IslamQA — Iḥrām prohibitions',u:'https://islamqa.info/en/answers/11356'}]},
{topic:'hajj',q:'How is ʿUmrah performed?',a:'Iḥrām at the mīqāt, ṭawāf (7), two rakʿahs if possible, saʿī, then shave or shorten the hair.',ref:'IslamQA 31819',links:[{t:'IslamQA — ʿUmrah',u:'https://islamqa.info/en/answers/31819'}]},
{topic:'hajj',q:'Where can I learn Hajj with a teacher?',a:'Use this page’s Hajj guide and trusted teachers. Ustazah Najiha Hashmi’s video is embedded above.',ref:'ArRahmah',links:[{t:'YouTube — Ustazah Najiha',u:'https://youtu.be/MUDNDj4n7I4'},{t:'ArRahmah',u:'https://www.arrahmah.org/'}]}
];
function qaToggleList(){
  var wrap=document.getElementById('qa-list-wrap');
  var btn=document.getElementById('qa-pull-btn');
  if(!wrap)return;
  var open=wrap.style.display!=='none';
  if(open){wrap.style.display='none';if(btn)btn.textContent='▸ Show questions';}
  else{wrap.style.display='block';if(btn)btn.textContent='▾ Hide questions';if(typeof renderQuestions==='function')renderQuestions();}
}
function renderQuestions(){
  const container=document.getElementById('questions');
  if(!container)return;
  const topic=((document.getElementById('qa-topic')||{}).value)||'all';
  const list=qa.filter(function(item){return topic==='all'||item.topic===topic;});
  container.innerHTML='';
  list.forEach(function(item,i){
    const div=document.createElement('div');
    div.className='question';
    const links=(item.links||[]).map(function(L){return '<a href="'+L.u+'" target="_blank" rel="noopener">'+L.t+' →</a> ';}).join('');
    div.innerHTML='<strong>'+item.q+'</strong><div class="answer" id="ans-'+i+'"><p>'+item.a+'</p><div class="ref">'+item.ref+'</div><div style="margin-top:.4rem">'+links+'</div></div>';
    div.addEventListener('click',function(e){
      if(e.target.tagName==='A')return;
      var ans=document.getElementById('ans-'+i);
      if(!ans)return;
      var open=ans.classList.toggle('show');
      div.classList.toggle('open',open);
    });
    container.appendChild(div);
  });
}
function askGrok(){const _gq=document.getElementById("grok-question");const question=((_gq&&_gq.value)||"").trim();const prompt=question||"What is the Islamic guidance for common life events such as birth, marriage and death?";navigator.clipboard.writeText(prompt).then(()=>{window.open("https://grok.com","_blank");alert("Your question has been copied! Paste it when Grok opens.");}).catch(()=>window.open("https://grok.com","_blank"));}function copySuggestion(){const text=document.getElementById("user-suggestion").value.trim();const status=document.getElementById("suggestion-status");if(!text){status.textContent="Please write a suggestion first.";return;}const full="Suggestion for Clarity (clarity-dawah.fyi):\n\n"+text;navigator.clipboard.writeText(full).then(()=>{status.textContent="✓ Suggestion copied! You can now paste it into an email or message.";}).catch(()=>{status.textContent="Could not copy automatically. Please select and copy the text yourself.";});}function emailSuggestion(){const text=document.getElementById("user-suggestion").value.trim();const body=encodeURIComponent("Suggestion for Clarity (clarity-dawah.fyi):\n\n"+(text||"(write your idea here)"));window.open("mailto:?subject="+encodeURIComponent("Suggestion for Clarity")+"&body="+body,"_blank");}function saveProfile(){const name=document.getElementById("username").value.trim();if(!name)return alert("Please enter a name.");clarityLS.setItem("clarity_name",name);showWelcome();}function resetName(){clarityLS.removeItem("clarity_name");document.getElementById("profile-input").style.display="block";document.getElementById("welcome-area").style.display="none";}function showWelcome(){const name=clarityLS.getItem("clarity_name");if(!name)return;document.getElementById("profile-input").style.display="none";document.getElementById("welcome-area").style.display="block";document.getElementById("welcome-text").textContent="Assalamu Alaikum, "+name;updateStats();updateNotifyStatus();showDailyReminderIfNeeded();}function updateStats(){document.getElementById("streak-display").textContent="Streak: "+(clarityLS.getItem("clarity_streak")||"0")+" days";document.getElementById("lessons-display").textContent="Lessons: "+(clarityLS.getItem("clarity_lessons")||"0");}function loadSpotifyPlayer(){const val=document.getElementById("spotify-select").value;const iframe=document.getElementById("spotify-player");if(iframe&&val){iframe.src="https://open.spotify.com/embed/"+val+"?utm_source=generator&theme=0";}}function loadIshaqPlayer(){const val=document.getElementById("ishaq-select").value;const iframe=document.getElementById("ishaq-player");if(!iframe||!val)return;if(val.startsWith("video:")){const id=val.replace("video:","");iframe.src="https://www.youtube.com/embed/"+id+"?rel=0";}else{iframe.src="https://www.youtube.com/embed/videoseries?list="+val;}}function loadYaqeenPlayer(){const val=document.getElementById("yaqeen-select").value;const iframe=document.getElementById("yaqeen-player");if(iframe&&val){iframe.src="https://www.youtube.com/embed/videoseries?list="+val;}}function loadFarhatPlayer(){const val=document.getElementById("farhat-select").value;const iframe=document.getElementById("farhat-player");if(iframe&&val){iframe.src="https://www.youtube.com/embed/videoseries?list="+val;}}setDailyBanner();setDailyRabbana();loadHijriCalendarAndEvents();initLocationSalahAndClock();loadScholarsLive();showWelcome();updateDepositDisplay();updateDailyStreak();loadCommand();loadLesson(false);loadLifeEvent();loadVerse();loadHadith();loadSeerah();loadProphetStory();loadIsraeliyat();loadZikr();renderQuestions();restoreHifzSelection();loadHifzAyah();updateHifzTodayCount();renderTafseer();try{var _ss0=document.getElementById("stream-select");if(audio&&_ss0&&_ss0.value)audio.src=_ss0.value;else if(audio)audio.src="https://qurango.net/radio/tarateel";}catch(_e){}function clarityQuarantineFiqh(){var notes=document.getElementById('tab-notes');var onNotes=notes&&notes.classList.contains('active');var ids=['fiqh-workflow-card','faraid-card','wasiyyah-card','user-family-tree-card'];ids.forEach(function(id){var el=document.getElementById(id);if(!el)return;if(onNotes){el.style.display='';el.style.visibility='';el.removeAttribute('aria-hidden');}else{el.style.display='none';el.setAttribute('aria-hidden','true');}});}try{clarityQuarantineFiqh();}catch(e){}initTabFromHash();try{clarityQuarantineFiqh();}catch(e){}loadAllTabCounts();window.addEventListener('hashchange',initTabFromHash);function cycleTheme(){const order=['light','dark','system'];const cur=clarityLS.getItem('clarity_theme')||'system';const next=order[(order.indexOf(cur)+1)%order.length];clarityLS.setItem('clarity_theme',next);applyTheme(next);}function resolveTheme(mode){if(mode==='light'||mode==='dark')return mode;return window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}function applyTheme(mode){mode=mode||clarityLS.getItem('clarity_theme')||'system';const resolved=resolveTheme(mode);document.documentElement.setAttribute('data-theme',resolved);const btn=document.getElementById('theme-toggle');if(btn){btn.textContent=mode==='light'?'☀️ Light':mode==='dark'?'🌙 Dark':'🌓 System';}const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute('content',resolved==='dark'?'#0c1a14':'#0f4c3a');}applyTheme();try{window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{if((clarityLS.getItem('clarity_theme')||'system')==='system')applyTheme('system');});}catch(e){}function getDepositCount(type){try{if(typeof getTodayKey==='function'){return parseInt(clarityLS.getItem(getTodayKey(type))||'0',10)||0;}return parseInt(clarityLS.getItem('clarity_'+type+'_'+new Date().toDateString())||'0',10)||0;}catch(e){return 0;}}function getHifzTodayCountNum(){try{if(typeof getHifzKey==='function'){return parseInt(clarityLS.getItem(getHifzKey())||'0',10)||0;}return parseInt(clarityLS.getItem('clarity_hifz_'+new Date().toDateString())||'0',10)||0;}catch(e){return 0;}}function updateProgressPills(){const streak=clarityLS.getItem('clarity_streak')||'0';const lessons=clarityLS.getItem('clarity_lessons')||'0';const set=(id,v)=>{const n=document.getElementById(id);if(n)n.textContent=v;};set('pill-streak',streak+'d');set('pill-lessons',lessons);set('pill-istighfar',String(getDepositCount('istighfar')));set('pill-salawat',String(getDepositCount('salawat')));const goal=parseInt(clarityLS.getItem('clarity_hifz_goal')||'3',10)||3;const today=getHifzTodayCountNum();set('hifz-goal-label',today+'/'+goal+' ayahs');const fill=document.getElementById('hifz-goal-fill');if(fill)fill.style.width=Math.min(100,Math.round((today/Math.max(1,goal))*100))+'%';}if(typeof updateStats==='function'){const _us=updateStats;updateStats=function(){_us();updateProgressPills();};}if(typeof updateDepositDisplay==='function'){const _ud=updateDepositDisplay;updateDepositDisplay=function(){_ud();updateProgressPills();};}if(typeof updateHifzTodayCount==='function'){const _uh=updateHifzTodayCount;updateHifzTodayCount=function(){_uh();updateProgressPills();};}if(typeof addDeposit==='function'){const _ad=addDeposit;addDeposit=function(type){_ad(type);updateProgressPills();};}if(typeof markMemorized==='function'){const _mm=markMemorized;markMemorized=function(){_mm();updateProgressPills();};}function getBookmarks(){return [];}

/* partial UFT offloaded — full module in clarity-uft-full-restore-v1 */

    function notesSaveNow(){
      if(notesState.saveTimer){clearTimeout(notesState.saveTimer);notesState.saveTimer=null;}
      notesPersist();
      notesRenderList();
      notesRenderTags();
      notesRenderPreview();
    }
    function clarityOpenNotesEditor(){
      try { if (typeof switchTab === 'function') switchTab('about', { fromRouter: true }); } catch(e){}
      try { if (typeof clarityOpenSectionDoor === 'function') clarityOpenSectionDoor('reality'); } catch(e2){}
      setTimeout(function(){
        var shell = document.getElementById('notes-shell') || document.getElementById('notes-editor-pane');
        if(shell && shell.scrollIntoView){
          try { shell.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch(e3){ shell.scrollIntoView(true); }
        }
      }, 80);
    }
    window.clarityOpenNotesEditor = clarityOpenNotesEditor;
    function notesOpenDeedNote(opts){ try{ if(typeof switchTab==="function") switchTab("notes"); }catch(e){}
      opts = opts || {};
      const day = new Date();
      const iso = day.toISOString().slice(0,10);
      const pretty = day.toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'});
      const title = opts.title || ('Today’s deed · ' + pretty);
      const tag = opts.tag || 'Practice';
      const pathLine = opts.pathLine || '';
      const deed = opts.deed || 'One sincere action for Allah';
      const stableId = 'deed-' + iso;
      let note = notesState.notes.find(n => n.id === stableId);
      const stamp = day.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
      const block = [
        '## ' + pretty,
        pathLine ? ('_' + pathLine + '_') : '',
        '',
        '**Deed:** ' + deed,
        '',
        '- [ ] I intended this for Allah',
        '- [ ] I acted, or I wrote why I delayed',
        '',
        '### What I want people to know / forgive',
        '',
        '### Light I can send ahead',
        '',
        '_Opened from Today · ' + stamp + '_'
      ].filter(function(x,i,a){return !(x==='' && a[i-1]==='');}).join('\n');
      if(!note){
        note = notesEmpty({id:stableId,title:title,tag:tag,grave:!!opts.grave,body:block});
        notesState.notes = [note].concat(notesState.notes);
      } else {
        if((note.body||'').indexOf(deed) === -1){
          note.body = (note.body||'') + '\n\n---\n' + block;
        }
        note.updatedAt = Date.now();
        note.tag = note.tag || tag;
        if(opts.grave) note.grave = true;
      }
      notesState.selectedId = note.id;
      notesPersist();
      try { if (typeof clarityOpenNotesEditor === 'function') clarityOpenNotesEditor();
      else if (typeof switchTab === 'function') switchTab('about', { fromRouter: true }); } catch(e){}
      notesRender();
      setTimeout(function(){
        const body = document.getElementById('notes-body');
        const active = document.getElementById('notes-editor-active');
        if(active){ active.classList.add('flash-deed'); setTimeout(function(){ active.classList.remove('flash-deed'); }, 1600); }
        if(body){ body.focus(); body.scrollTop = body.scrollHeight; }
      }, 80);
      return note.id;
    }
    function notesCreate(prefill) {
      const note = notesEmpty(prefill || {});
      notesState.notes = [note, ...notesState.notes];
      notesState.selectedId = note.id;
      notesState.query = '';
      notesState.tagFilter = '';
      notesState.viewMode = 'edit';
      notesPersist();
      notesRender();
      setTimeout(() => {
        const t = document.getElementById('notes-title');
        if (t) t.focus();
      }, 50);
      return note.id;
    }
    function notesUpdateField(field, value) {
      const id = notesState.selectedId;
      if (!id) return;
      notesState.notes = notesState.notes.map(n => {
        if (n.id !== id) return n;
        const next = Object.assign({}, n, { updatedAt: Date.now() });
        next[field] = value;
        return next;
      });
      const st=document.getElementById('notes-save-status');
      if(st) st.textContent='Unsaved changes…';
      const btn=document.getElementById('notes-save-now');
      if(btn){btn.textContent='Save note';btn.classList.remove('saved');}
      if (notesState.saveTimer) clearTimeout(notesState.saveTimer);
      notesState.saveTimer = setTimeout(() => {
        notesPersist();
        notesRenderList();
        notesRenderTags();
        if (field === 'body') notesRenderPreview();
      }, 280);
      if (field === 'body') notesRenderPreview();
      if (field === 'tag') notesRenderList();
    }
    function notesToggleGrave() {
      const id = notesState.selectedId;
      if (!id) return;
      notesState.notes = notesState.notes.map(n => n.id === id ? Object.assign({}, n, { grave: !n.grave, updatedAt: Date.now() }) : n);
      notesPersist();
      notesRender();
    }
    function notesRequestDelete() {
      const id = notesState.selectedId;
      if (!id) return;
      const n = notesState.notes.find(x => x.id === id);
      if (!n) return;
      if (!confirm('Delete note “' + notesDisplayTitle(n) + '”? This cannot be undone.')) return;
      notesState.notes = notesState.notes.filter(x => x.id !== id);
      notesState.selectedId = notesState.notes[0] ? notesState.notes[0].id : null;
      notesPersist();
      notesRender();
    }
    function notesRestoreSeed() {
      if (!confirm('Restore the starter library? Your current notes will be replaced.')) return;
      notesState.notes = notesSeedLibrary();
      notesState.selectedId = notesState.notes[0].id;
      notesPersist();
      notesRender();
    }
    function notesSetView(mode) {
      notesState.viewMode = mode;
      try { clarityLS.setItem(NOTES_VIEW_KEY, mode); } catch (e) {}
      notesApplyView();
    }
    function notesCycleView() {
      const order = ['edit', 'split', 'preview'];
      const i = order.indexOf(notesState.viewMode);
      notesSetView(order[(i + 1) % order.length]);
    }
    function notesApplyView() {
      const area = document.getElementById('notes-body-area');
      if (!area) return;
      area.classList.remove('split', 'edit-only', 'preview-only');
      if (notesState.viewMode === 'split') area.classList.add('split');
      else if (notesState.viewMode === 'preview') area.classList.add('preview-only');
      else area.classList.add('edit-only');
      ['edit','split','preview'].forEach(m => {
        const b = document.getElementById('nv-' + m);
        if (b) b.classList.toggle('active', notesState.viewMode === m);
      });
      if (notesState.viewMode !== 'edit') notesRenderPreview();
    }
    function escapeHtmlNotes(s) {
      return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }
    function notesSimpleMarkdown(src) {
      let s = escapeHtmlNotes(src || '');
      // code blocks
      s = s.replace(/```([\s\S]*?)```/g, (_, code) => '<pre><code>' + code.trim() + '</code></pre>');
      // tables (simple)
      s = s.replace(/(?:^|\n)((?:\|.+\|(?:\n|$))+)/g, (block) => {
        const rows = block.trim().split('\n').filter(Boolean);
        if (rows.length < 2) return block;
        const parseRow = r => r.replace(/^\||\|$/g, '').split('|').map(c => c.trim());
        const head = parseRow(rows[0]);
        const bodyRows = rows.slice(1).filter(r => !/^\|?\s*:?-+:?\s*\|/.test(r));
        let html = '<table><thead><tr>' + head.map(h => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>';
        bodyRows.forEach(r => {
          html += '<tr>' + parseRow(r).map(c => '<td>' + c + '</td>').join('') + '</tr>';
        });
        return html + '</tbody></table>';
      });
      s = s.replace(/^### (.+)$/gm, '<h3>$1</h3>');
      s = s.replace(/^## (.+)$/gm, '<h2>$1</h2>');
      s = s.replace(/^# (.+)$/gm, '<h1>$1</h1>');
      s = s.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
      s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
      s = s.replace(/`([^`]+)`/g,'<code>$1</code>');s=s.replace(/^\- (.+)$/gm,'<li>$1</li>');s=s.replace(/(?:<li>.*<\/li>\n?)+/g,m=>'<ul>'+m+'</ul>');s=s.replace(/^\d+\. (.+)$/gm,'<li>$1</li>');s=s.split(/\n{2,}/).map(p=>{if(/^<(h[123]|ul|ol|table|blockquote|pre)/.test(p.trim()))return p;return'<p>'+p.replace(/\n/g,'<br>')+'</p>';}).join('\n');return s;}function notesRenderPreview(){const prev=document.getElementById('notes-preview');const body=document.getElementById('notes-body');if(!prev)return;const text=body?body.value:((notesState.notes.find(n=>n.id===notesState.selectedId)||{}).body||'');prev.innerHTML=notesSimpleMarkdown(text);}function notesQuickFromSection(tag,title,grave){notesCreate({title:title||('Note · '+tag),tag:tag||'Reflection',grave:!!grave,body:grave?'**Intention for the grave**\n\n':'**Reflection**\n\n'});if(typeof clarityOpenNotesEditor==='function')clarityOpenNotesEditor();else switchTab('about',{fromRouter:true});}document.addEventListener('keydown',function(e){const panel=document.getElementById('tab-notes');if(!panel||!panel.classList.contains('active'))return;const mod=e.metaKey||e.ctrlKey;const t=e.target;const typing=t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.isContentEditable);if(e.key==='Escape'){const search=document.getElementById('notes-search');if(search&&notesState.query){search.value='';notesSetQuery('');e.preventDefault();}return;}if(e.key==='/'&&!typing){e.preventDefault();const search=document.getElementById('notes-search');if(search){search.focus();search.select();}return;}if(mod&&e.key.toLowerCase()==='s'){e.preventDefault();notesSaveNow();return;}if(mod&&e.key.toLowerCase()==='n'){e.preventDefault();notesCreate();return;}if(mod&&e.key.toLowerCase()==='e'){e.preventDefault();notesCycleView();}});notesLoad();window.memeState={vignette:0.28,ratio:'4:3',grade:'none',img:null,top:'',mid:'',bottom:'',fontSize:42,topSize:42,midSize:42,bottomSize:36,outline:4,font:'impact',style:'outline',topY:0.08,midY:0.48,bottomY:0.88,dragging:null,blankColor1:'#0f4c3a',blankColor2:'#1a2a22'};var memeState=window.memeState;function memeFontStack(font, isArabic){
  var f = font || 'arabic';
  if(f==='impact') return 'Impact, Haettenschweiler, Arial Black, sans-serif';
  if(f==='sans') return 'Inter, system-ui, sans-serif';
  if(f==='serif') return "'Cormorant Garamond', Georgia, serif";
  if(f==='kufi') return "'Reem Kufi', 'Scheherazade New', sans-serif";
  if(f==='ruqaa') return "'Aref Ruqaa', 'Amiri', serif";
  if(f==='thuluth') return "'Lateef', 'Scheherazade New', serif";
  if(f==='diwani') return "'Cairo', 'Amiri', sans-serif";
  if(f==='naskh') return "'Amiri', 'Noto Naskh Arabic', serif";
  /* default arabic / naskh */
  return "'Scheherazade New', 'Amiri', 'Noto Naskh Arabic', serif";
}
function memeSetFont(v){memeState.font=v||'impact';memeDraw();}function memeSetStyle(v){memeState.style=v||'outline';if(v==='none')memeState.outline=0;else if(v==='outline'&&memeState.outline<2)memeState.outline=4;const outEl=document.getElementById('meme-outline');if(outEl)outEl.value=memeState.outline;const lab=document.getElementById('meme-outline-val');if(lab)lab.textContent=String(memeState.outline);memeDraw();}function memeGetCanvas(){return document.getElementById('meme-canvas');}
function memeSiteLink(){
  return 'clarity-dawah.fyi/#meme';
}
function memePaintWatermark(ctx,w,h){
  if(!ctx)return;
  var ref="";
  try{
    var s=window.memeState||(typeof memeState!=="undefined"?memeState:null);
    if(s){
      ref=String(s._lastRef||s.ref||"").trim();
      /* never treat Urdu bottom caption as reference */
      if(ref && /[\u0600-\u06FF]/.test(ref) && ref.length>40) ref="";
    }
  }catch(e){}
  var mark="clarity-dawah.fyi";
  try{ if(typeof memeSiteLink==="function"){ var m=memeSiteLink(); if(m) mark=String(m).replace(/^https?:\/\//,"").split("#")[0].replace(/\/$/,""); } }catch(e){}
  var barH=Math.max(ref?34:22, Math.round(h*(ref?0.065:0.038)));
  var y0=h-barH;
  ctx.save();
  ctx.setTransform(1,0,0,1,0,0);
  ctx.globalAlpha=1;
  ctx.shadowColor="transparent";
  ctx.shadowBlur=0;
  ctx.fillStyle="rgba(10,8,4,0.92)";
  ctx.fillRect(0,y0,w,barH);
  /* gold separator edge */
  ctx.fillStyle="rgba(212,180,90,0.65)";
  ctx.fillRect(0,y0,w,Math.max(1,Math.round(h*0.003)));
  ctx.textAlign="center";
  ctx.textBaseline="middle";
  ctx.direction="ltr";
  if(ref){
    var fs1=Math.max(13,Math.min(18,Math.round(barH*0.36)));
    ctx.font="700 "+fs1+"px Inter, system-ui, sans-serif";
    ctx.fillStyle="#f5e6a8";
    while(fs1>11&&ctx.measureText(ref).width>w*0.94){fs1--;ctx.font="700 "+fs1+"px Inter, system-ui, sans-serif";}
    ctx.fillText(ref,w/2,y0+barH*0.38);
    var fs2=Math.max(10,Math.round(barH*0.26));
    ctx.font="600 "+fs2+"px Inter, system-ui, sans-serif";
    ctx.fillStyle="rgba(232,212,139,0.72)";
    ctx.fillText(mark,w/2,y0+barH*0.72);
  }else{
    var fs=Math.max(11,Math.min(15,Math.round(barH*0.42)));
    ctx.font="600 "+fs+"px Inter, system-ui, sans-serif";
    ctx.fillStyle="rgba(232,212,139,0.75)";
    ctx.fillText(mark,w/2,y0+barH/2);
  }
  ctx.restore();
}

function memeOnVignette(v){
  memeState.vignette=(Number(v)||0)/100;
  var lab=document.getElementById('meme-vig-val');
  if(lab)lab.textContent=String(v);
  if(memeState.vignette>0.05 && (!memeState.grade || memeState.grade==='none')){
    /* keep existing grade; extra vignette applied in draw */
  }
  memeDraw();
}
function memeSetFilter(name,btn){
  if(typeof memeSetGrade==='function') memeSetGrade(name||'none');
  else { memeState.grade=name||'none'; memeDraw(); }
  if(btn&&btn.parentNode){
    btn.parentNode.querySelectorAll('button').forEach(function(b){b.classList.toggle('on',b===btn);});
  }
}
function memeShuffleQuote(){
  if(typeof memeNightQuote==='function' && Math.random()>0.45){ memeNightQuote(); return; }
  if(typeof MASNOON_DUAS!=='undefined' && MASNOON_DUAS.length && typeof memeFillFromDua==='function'){
    lastMasnoonDua=MASNOON_DUAS[Math.floor(Math.random()*MASNOON_DUAS.length)];
    memeFillFromDua();
    return;
  }
  if(typeof memeSurpriseMe==='function') memeSurpriseMe();
}

function memeDraw(){/*meme-state-sync*/try{if(window.memeState&&typeof memeState!=='undefined'){for(var __mk in window.memeState){try{memeState[__mk]=window.memeState[__mk];}catch(__e2){}}}}catch(__e){}
  try{ if(typeof memeGuardMushafText==="function" && !memeGuardMushafText()){ /* keep prior frame */ } }catch(eG){}
const canvas=memeGetCanvas();if(!canvas)return;const ctx=canvas.getContext('2d');const w=canvas.width;const h=canvas.height;ctx.clearRect(0,0,w,h);if(memeState.img){const iw=memeState.img.width;const ih=memeState.img.height;const scale=Math.max(w/iw,h/ih);const dw=iw*scale;const dh=ih*scale;const dx=(w-dw)/2;const dy=(h-dh)/2;ctx.drawImage(memeState.img,dx,dy,dw,dh);}else{const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,memeState.blankColor1||'#0f4c3a');g.addColorStop(1,memeState.blankColor2||'#1a2a22');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);if(!(memeState.top||memeState.mid||memeState.bottom||(document.getElementById('meme-top-input')||{}).value)){const light=/^#([fFeE]|[a-fA-F0-9][fFeE])/.test(memeState.blankColor1||'');ctx.fillStyle=light?'rgba(0,0,0,0.25)':'rgba(255,255,255,0.18)';ctx.font='600 20px Inter, system-ui, sans-serif';ctx.textAlign='center';ctx.fillText('Blank background — pick a color or add text',w/2,h/2);}}function drawCaption(text,yRatio,lineSize){const raw=(text||'').trim();if(!raw)return;const style=memeState.style||'outline';const outline=style==='none'?0:(style==='soft'?Math.max(1,memeState.outline*0.5):memeState.outline);const maxWidth=w*0.92;const baseSize=(lineSize!=null?lineSize:memeState.fontSize)||42;const paragraphs=raw.split(/\n+/).map(p=>p.trim()).filter(Boolean);const lines=[];paragraphs.forEach(para=>{const isArabic=/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(para);const isRef=/^Qur[’']an\s+\d+/i.test(para)||/^\d+:\d+/.test(para)||/Bukhari|Muslim|Tirmidhi|Abu Dawud|Qur’an/i.test(para);const upper=!(isArabic||isRef||memeState.font==='serif'||memeState.font==='sans')&&para.length<90;const t=upper?para.toUpperCase():para;const fontSize=isRef?Math.max(18,Math.round(baseSize*0.7)):(isArabic?Math.max(baseSize,Math.round(baseSize*1.05)):baseSize);const stack=memeFontStack(memeState.font,isArabic);ctx.font=(isRef?'600 ':'700 ')+fontSize+'px '+stack;const words=t.split(/\s+/);let line='';words.forEach(word=>{const test=line?line+' '+word:word;if(ctx.measureText(test).width>maxWidth&&line){lines.push({text:line,fontSize:fontSize,arabic:isArabic,ref:isRef,stack:stack});line=word;}else{line=test;}});if(line)lines.push({text:line,fontSize:fontSize,arabic:isArabic,ref:isRef,stack:stack});});let blockH=0;lines.forEach(ln=>{blockH+=ln.fontSize*1.18;});let y=yRatio*h-blockH/2;lines.forEach(ln=>{const lh=ln.fontSize*1.18;y+=lh/2;ctx.font=(ln.ref?'600 ':'700 ')+ln.fontSize+'px '+ln.stack;ctx.direction=ln.arabic?'rtl':'ltr';ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';let fill='#fff';let stroke='#000';if(style==='gold'){fill='#f5e6a8';stroke='#3d2a0a';}else if(style==='ink'){fill='#1a1a1a';stroke='rgba(255,255,255,0.35)';}else if(style==='soft'){fill='#fff';stroke='rgba(0,0,0,0.45)';}else if(style==='glass'){fill='rgba(255,255,255,0.92)';stroke='rgba(0,0,0,0.25)';}if(ln.ref&&style!=='ink')fill='rgba(255,255,220,0.95)';if(outline>0||style==='soft'){ctx.strokeStyle=stroke;ctx.lineWidth=Math.max(1.5,outline*(ln.ref?1.1:2));if(style==='soft'){ctx.shadowColor='rgba(0,0,0,0.55)';ctx.shadowBlur=8;ctx.shadowOffsetY=3;}ctx.strokeText(ln.text,w/2,y);}ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.fillStyle=fill;ctx.fillText(ln.text,w/2,y);y+=lh/2;});}if(typeof memeApplyGrade==='function')memeApplyGrade(ctx,w,h);
drawCaption(memeState.top,memeState.topY,memeState.topSize||memeState.fontSize);drawCaption(memeState.mid,memeState.midY,memeState.midSize||memeState.fontSize);drawCaption(memeState.bottom,memeState.bottomY,memeState.bottomSize||18);
if(Number(memeState.vignette)>0){var vig=Number(memeState.vignette);var vg=ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*0.2,w/2,h/2,Math.max(w,h)*0.72);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,'+(0.12+vig*0.65)+')');ctx.fillStyle=vg;ctx.fillRect(0,0,w,h);}

try{memePaintWatermark(ctx,w,h);}catch(e){}
try{memeUpdateWmLink()}catch(e){}

}function memeSyncFromInputs(){const topEl=document.getElementById('meme-top-input');const midEl=document.getElementById('meme-mid-input');const botEl=document.getElementById('meme-bottom-input');if(topEl){if(topEl.value)memeState.top=topEl.value;else if(memeState.top)topEl.value=memeState.top;}if(midEl){if(midEl.value)memeState.mid=midEl.value;else if(memeState.mid)midEl.value=memeState.mid;}if(botEl){if(botEl.value)memeState.bottom=botEl.value;else if(memeState.bottom)botEl.value=memeState.bottom;}memeState._baseTopY=memeState.topY;memeState._baseMidY=memeState.midY;memeState._baseBotY=memeState.bottomY;memeDraw();}function memeClipForCaption(text,maxChars){let s=String(text||'').replace(/\s+/g,' ').trim();if(!s)return'';/* Full text preferred — only hard-cap extremely long pastes (not typical verse/hadith lines) */var lim=(maxChars&&maxChars>0)?maxChars:1200;if(s.length<=lim)return s;const cut=s.slice(0,lim);const lastSpace=cut.lastIndexOf(' ');const at=lastSpace>lim*0.6?lastSpace:lim;return cut.slice(0,at).trim()+'…';}
function memeAutoFitSizes(){
  /* Scale top/mid/bottom font sizes from text length so full translations fit */
  function fit(text, base, min){
    var t=String(text||'').trim(); if(!t) return base;
    var len=t.length;
    var lines=Math.max(1, (t.match(/\n/g)||[]).length+1);
    var n=base;
    if(len>40) n=Math.min(n, base-2);
    if(len>70) n=Math.min(n, base-6);
    if(len>110) n=Math.min(n, base-10);
    if(len>160) n=Math.min(n, base-14);
    if(len>220) n=Math.min(n, base-18);
    if(lines>=3) n=Math.min(n, n-2);
    if(lines>=5) n=Math.min(n, n-4);
    return Math.max(min||16, Math.round(n));
  }
  var top=memeState.top||''; var mid=memeState.mid||''; var bot=memeState.bottom||'';
  var ts=fit(top, /[\u0600-\u06FF]/.test(top)?36:32, 18);
  var ms=fit(mid, 28, 16);
  var bs=fit(bot, 24, 15);
  memeState.topSize=ts; memeState.midSize=ms; memeState.bottomSize=bs; memeState.fontSize=ms;
  try{
    [['top',ts],['mid',ms],['bottom',bs]].forEach(function(p){
      var el=document.getElementById('meme-size-'+p[0]);
      var lab=document.getElementById('meme-size-'+p[0]+'-val');
      if(el)el.value=p[1]; if(lab)lab.textContent=String(p[1]);
    });
    var sizeEl=document.getElementById('meme-size'); if(sizeEl)sizeEl.value=ms;
  }catch(e){}
}
async function memeFillFromJourneyVerse(quiet){const topEl=document.getElementById('meme-top-input');const botEl=document.getElementById('meme-bottom-input');const btn=document.getElementById('meme-fill-verse-btn');if(btn){btn.disabled=true;btn.textContent='Loading…';}try{if(!currentJourneyVerse.en){try{await loadVerseInto('verse');}catch(e){}}const v=currentJourneyVerse;if(!v||!v.en){if(!quiet)alert('Could not load a verse yet. Open the Journey tab once, then try again.');return;}const midEl=document.getElementById('meme-mid-input');const ref=memeFormatRef(v)||(v.surah&&v.ayah?('Qur’an '+v.surah+':'+v.ayah):'');if(topEl)topEl.value=(v.arabic||'').trim()||(v.en||'');if(midEl)midEl.value=String(v.en||'').trim();if(botEl){const line1=String(v.ur||v.tafseer||'').trim();botEl.value=[line1,ref].filter(Boolean).join('\n');}memeState.topY=0.11;memeState.midY=0.46;memeState.bottomY=0.82;memePositionBoxes();memeSyncFromInputs();try{memeAutoFitSizes();memeDraw();}catch(e){}}finally{if(btn){btn.disabled=false;btn.textContent='📖 Journey verse';}}}function memeOnSize(v){
  try{
    var n=parseInt(v,10)||42; n=Math.max(14,Math.min(96,n));
    memeState.fontSize=n; memeState.topSize=n; memeState.midSize=n; memeState.bottomSize=n;
    ['top','mid','bottom'].forEach(function(k){
      var el=document.getElementById('meme-size-'+k);
      var lab=document.getElementById('meme-size-'+k+'-val');
      if(el) el.value=n; if(lab) lab.textContent=String(n);
    });
    var lab=document.getElementById('meme-size-val'); if(lab) lab.textContent=String(n);
    var el=document.getElementById('meme-size'); if(el) el.value=n;
    if(typeof memeState.topY!=='number'||isNaN(memeState.topY)) memeState.topY=0.10;
    if(typeof memeState.midY!=='number'||isNaN(memeState.midY)) memeState.midY=0.48;
    if(typeof memeState.bottomY!=='number'||isNaN(memeState.bottomY)) memeState.bottomY=0.86;
    if(typeof memePositionBoxes==='function') try{memePositionBoxes();}catch(e){}
    if(typeof memeDraw==='function') memeDraw();
  }catch(e){console.warn('memeOnSize',e);}
}

function memeOnLineSize(which,v){
  try{
    var n=parseInt(v,10)||42;n=Math.max(14,Math.min(96,n));
    if(which==='top') memeState.topSize=n;
    else if(which==='bottom') memeState.bottomSize=n;
    else memeState.midSize=n;
    var lab=document.getElementById('meme-size-'+which+'-val'); if(lab) lab.textContent=String(n);
    if(which==='mid'){
      memeState.fontSize=n;
      var m=document.getElementById('meme-size'); if(m) m.value=n;
      var lv=document.getElementById('meme-size-val'); if(lv) lv.textContent=String(n);
    }
    /* Keep line anchors stable relative to canvas when size changes */
    if(typeof memeState.topY!=='number'||isNaN(memeState.topY)) memeState.topY=0.10;
    if(typeof memeState.midY!=='number'||isNaN(memeState.midY)) memeState.midY=0.48;
    if(typeof memeState.bottomY!=='number'||isNaN(memeState.bottomY)) memeState.bottomY=0.86;
    if(typeof memePositionBoxes==='function') try{memePositionBoxes();}catch(e){}
    if(typeof memeDraw==='function') memeDraw();
  }catch(e){console.warn('memeOnLineSize',e);}
}
function memeScaleAllSizes(factor){['top','mid','bottom'].forEach(function(k){var key=k+'Size';var cur=memeState[key]||memeState.fontSize||42;var n=Math.max(14,Math.min(96,Math.round(cur*factor)));memeState[key]=n;var el=document.getElementById('meme-size-'+k);var lab=document.getElementById('meme-size-'+k+'-val');if(el)el.value=n;if(lab)lab.textContent=String(n);});memeState.fontSize=memeState.midSize;memeDraw();}
function memeSyncSizesFromMaster(){var n=memeState.midSize||memeState.fontSize||42;memeState.topSize=n;memeState.bottomSize=n;memeState.fontSize=n;['top','mid','bottom'].forEach(function(k){var el=document.getElementById('meme-size-'+k);var lab=document.getElementById('meme-size-'+k+'-val');if(el)el.value=n;if(lab)lab.textContent=String(n);});memeDraw();}function memeOnOutline(v){memeState.outline=parseInt(v,10)||0;const lab=document.getElementById('meme-outline-val');if(lab)lab.textContent=String(memeState.outline);memeDraw();}function memeOnUpload(ev){const file=ev.target&&ev.target.files&&ev.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=function(e){const img=new Image();img.onload=function(){memeState.img=img;memeDraw();};img.src=e.target.result;};reader.readAsDataURL(file);ev.target.value='';}window.MEME_BG_POOLS=window.MEME_BG_POOLS||{};
window.MEME_BG_POOLS={nature:[],flowers:[],holy:[],spirit:[],free:[],night:[],water:[],flickr:[]};
var MEME_BG_POOLS=window.MEME_BG_POOLS;

try{
  if(typeof MEME_BG_POOLS!=='undefined' && MEME_BG_POOLS.free && MEME_BG_POOLS.free.length){
    MEME_BG_POOLS.flickr = MEME_BG_POOLS.free.slice();
    MEME_BG_POOLS.stock = MEME_BG_POOLS.free.slice();
    MEME_BG_POOLS.commons = MEME_BG_POOLS.free.slice();
  }
}catch(eMemePool){}
window.memeBgIdx={nature:0,flowers:0,holy:0,spirit:0,dynamic:0,night:0,water:0,free:0,flickr:0,stock:0,commons:0};const MEME_USE_KEY='clarity_meme_bg_uses';function memeGetUses(){try{return JSON.parse(clarityLS.getItem(MEME_USE_KEY)||'{"nature":0,"flowers":0,"holy":0,"spirit":0,"dynamic":0,"night":0,"water":0}');}catch(e){return{nature:0,flowers:0,holy:0,spirit:0,dynamic:0,night:0,water:0};}}function memeBumpUse(kind){const u=memeGetUses();if(u[kind]==null)u[kind]=0;u[kind]++;try{clarityLS.setItem(MEME_USE_KEY,JSON.stringify(u));}catch(e){}memeRenderUseCounts();}function memeRenderUseCounts(){const u=memeGetUses();['nature','flowers','holy','spirit','dynamic','night','water'].forEach(k=>{const a=document.getElementById('meme-cnt-'+k);const b=document.getElementById('meme-use-'+k);if(a)a.textContent=String(u[k]||0);if(b)b.textContent=String(u[k]||0);});}memeRenderUseCounts();function memeLoadImageFromUrl(url,onFailMsg){if(!url){memeState.img=null;memeDraw();return;}const img=new Image();img.crossOrigin='anonymous';img.onload=function(){memeState.img=img;memeDraw();};img.onerror=function(){if(onFailMsg)alert(onFailMsg);else alert('Could not load image. Try another background option.');};img.src=url;}function memeShowBlankPalette(){const pal=document.getElementById('meme-palette');if(pal)pal.style.display=pal.style.display==='none'?'flex':'none';memeState.img=null;memeDraw();}function memeSetBlankColor(c1,c2){memeState.blankColor1=c1||'#0f4c3a';memeState.blankColor2=c2||c1||'#1a2a22';memeState.img=null;const pal=document.getElementById('meme-palette');if(pal)pal.style.display='flex';memeDraw();}
function memeIsMushafContext(){
  try{
    var top=(memeState&&memeState.top)||'';
    var mid=(memeState&&memeState.mid)||'';
    var bot=(memeState&&memeState.bottom)||'';
    var blob=(top+'\n'+mid+'\n'+bot).toLowerCase();
    /* Detect Qurʾān page / muṣḥaf framing */
    if(/mu[sṣ][hḥ]af|mushaf|qur['']?an page|page of the quran|open mushaf|muṣḥaf/.test(blob)) return true;
    if(memeState && memeState._bgKind==='mushaf') return true;
    if(memeState && memeState.img && memeState.img.src && /mushaf|quran-page|mus-haf/i.test(String(memeState.img.src))) return true;
  }catch(e){}
  return false;
}
function memeLooksLikeJokeOverlay(text){
  var t=String(text||'').toLowerCase();
  if(!t.trim()) return false;
  /* Light heuristic: meme-joke markers, not scholarly Arabic */
  var joke=/(\blol\b|\blmao\b|\brofl\b|meme review|when the imam|expectation vs reality|nobody:\n|wait for it|top text bottom text)/i;
  return joke.test(t);
}
function memeGuardMushafText(){
  /* Never block standard verse/hadith fills — only soft-warn on clear joke overlays */
  if(!memeIsMushafContext()) return true;
  try{
    if(memeLooksLikeJokeOverlay(memeState.top)||memeLooksLikeJokeOverlay(memeState.mid)||memeLooksLikeJokeOverlay(memeState.bottom)){
      if(typeof memeFetchStatus==='function') memeFetchStatus('Note: keep text reverent on muṣḥaf backgrounds.');
      /* still allow draw */
    }
  }catch(e){}
  return true;
}

function memeFetchBg(kind){
  if (typeof window.__memeOnlineFetch === 'function') return window.__memeOnlineFetch(kind);
  if(kind==='blank'){ if(typeof memeShowBlankPalette==='function') memeShowBlankPalette(); return; }
  try {
    var u='https://picsum.photos/seed/clarity-fb-'+(Date.now()%9999)+'/1200/900.jpg';
    if(typeof memeLoadImageFromUrl==='function') memeLoadImageFromUrl(u);
  }catch(e){}
}function memeFetchNature(){memeFetchBg('nature');}function memeLoadSample(key){if(!key)return;if(key==='blank')return memeFetchBg('blank');if(key==='nature')return memeFetchBg('nature');if(key==='flowers')return memeFetchBg('flowers');if(key==='spirit')return memeFetchBg('spirit');if(key==='holy'||key==='kaaba'||key==='madinah')return memeFetchBg('holy');}let memeDynamicTimer=null;let memeDynamicPhase=0;function memeToggleDynamic(){const btn=document.getElementById('meme-dynamic-btn');if(memeDynamicTimer){clearInterval(memeDynamicTimer);memeDynamicTimer=null;memeDynamicPhase=0;if(btn)btn.textContent='▶ Dynamic';memeDraw();return;}if(btn)btn.textContent='⏸ Dynamic';memeDynamicTimer=setInterval(function(){memeDynamicPhase=(memeDynamicPhase+1)%120;const t=memeDynamicPhase/120;const wave=Math.sin(t*Math.PI*2)*0.012;const baseMid=memeState._baseMidY!=null?memeState._baseMidY:memeState.midY;if(memeState._baseMidY==null){memeState._baseTopY=memeState.topY;memeState._baseMidY=memeState.midY;memeState._baseBotY=memeState.bottomY;}memeState.topY=memeState._baseTopY+wave*0.4;memeState.midY=baseMid+wave;memeState.bottomY=memeState._baseBotY-wave*0.4;memePositionBoxes();memeDraw();},50);}let memeLastBgKind='dynamic';let memeBgCycleTimer=null;function memeToggleBgCycle(){const btn=document.getElementById('meme-bgcycle-btn');if(memeBgCycleTimer){clearInterval(memeBgCycleTimer);memeBgCycleTimer=null;if(btn)btn.textContent='↻ Auto-rotate bg';return;}if(btn)btn.textContent='⏸ Auto-rotate bg';const kind=memeLastBgKind||'dynamic';memeFetchBg(kind);memeBgCycleTimer=setInterval(function(){memeFetchBg(memeLastBgKind||'dynamic');},9000);}async function memeFillFromCommand(){const topEl=document.getElementById('meme-top-input');const botEl=document.getElementById('meme-bottom-input');const btn=document.getElementById('meme-fill-command-btn');if(btn){btn.disabled=true;btn.textContent='Loading…';}try{if(!currentCommandVerse.arabic){await loadCommand();}const c=currentCommandVerse;if(!c.arabic){alert('Could not load a Commands verse yet. Open the Commands tab once, then try again.');return;}const midEl=document.getElementById('meme-mid-input');const ref=c.ref||'';if(topEl)topEl.value=String(c.arabic||'').trim();if(midEl)midEl.value=String(c.english||'').trim();if(botEl){botEl.value=String(ref||'').trim();}memeState.topY=0.11;memeState.midY=0.46;memeState.bottomY=0.82;memePositionBoxes();memeSyncFromInputs();try{memeAutoFitSizes();memeDraw();}catch(e){}}finally{if(btn){btn.disabled=false;btn.textContent='📜 Command (AR + EN)';}}}const

MEME_URDU_DUAS=[
{arabic:"رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",urdu:"اے ہمارے رب! ہمیں دنیا میں بھلائی دے اور آخرت میں بھلائی دے اور ہمیں آگ کے عذاب سے بچا۔",en:"Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",ref:"Qur'an 2:201"},
{arabic:"رَبِّ زِدْنِي عِلْمًا",urdu:"اے میرے رب! میرے علم میں اضافہ فرما۔",en:"My Lord, increase me in knowledge.",ref:"Qur'an 20:114"},
{arabic:"حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",urdu:"اللہ ہمیں کافی ہے اور وہ بہترین کارساز ہے۔",en:"Allah is sufficient for us, and He is the best Disposer of affairs.",ref:"Qur'an 3:173"},
{arabic:"رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِن لِّسَانِي يَفْقَهُوا قَوْلِي",urdu:"اے میرے رب! میرا سینہ کھول دے، میرا کام آسان فرما دے، اور میری زبان کی گرہ کھول دے تاکہ وہ میری بات سمجھ سکیں۔",en:"My Lord, expand for me my breast, ease my task, and untie the knot from my tongue so they may understand my speech.",ref:"Qur'an 20:25–28"},
{arabic:"اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى",urdu:"اے اللہ! میں تجھ سے ہدایت، تقویٰ، پاکدامنی اور بے نیازی مانگتا ہوں۔",en:"O Allah, I ask You for guidance, piety, chastity and self-sufficiency.",ref:"Muslim 2721"},
{arabic:"أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",urdu:"میں اس اللہ سے بخشش مانگتا ہوں جس کے سوا کوئی معبود نہیں، جو زندہ اور قائم ہے، اور میں اسی کی طرف توبہ کرتا ہوں۔",en:"I seek forgiveness from Allah, other than whom there is no god, the Ever-Living, the Self-Sustaining, and I repent to Him.",ref:"Abu Dawud 1517"},
{arabic:"اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",urdu:"اے اللہ! محمد اور آل محمد پر رحمت بھیج جیسے تو نے ابراہیم اور آل ابراہیم پر بھیجی۔ بیشک تو حمید و مجید ہے۔",en:"O Allah, send salah upon Muhammad and his family as You sent salah upon Ibrahim and his family. You are Praiseworthy, Glorious.",ref:"Bukhari 3370"},
{arabic:"رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً إِنَّكَ أَنتَ الْوَهَّابُ",urdu:"اے ہمارے رب! ہدایت دینے کے بعد ہمارے دلوں کو ٹیڑھا نہ کر، اور ہمیں اپنی طرف سے رحمت عطا فرما۔ بیشک تو بہت بڑا عطا فرمانے والا ہے۔",en:"Our Lord, let not our hearts deviate after You have guided us, and grant us from Yourself mercy. Indeed, You are the Bestower.",ref:"Qur'an 3:8"},
{arabic:"اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",urdu:"اے اللہ! میں فکر، غم، عاجزی، سستی، بخل، بزدلی، قرض کے بوجھ اور لوگوں کے غلبے سے تیری پناہ مانگتا ہوں۔",en:"O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debt and being overpowered by men.",ref:"Bukhari 6369"},
{arabic:"يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَىٰ دِينِكَ",urdu:"اے دلوں کو پھیرنے والے! میرے دل کو اپنے دین پر ثابت رکھ۔",en:"O Turner of hearts, keep my heart firm upon Your religion.",ref:"Tirmidhi 2140"},
{arabic:"رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",urdu:"اے میرے رب! مجھے، میرے والدین کو اور اہل ایمان کو اس دن بخش دے جب حساب قائم ہوگا۔",en:"My Lord, forgive me and my parents and the believers on the Day the account is established.",ref:"Qur'an 14:41"},
{arabic:"الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",urdu:"تمام تعریف اللہ کے لیے ہے جس نے ہمیں کھانا دیا، پلایا اور ہمیں مسلمان بنایا۔",en:"All praise is for Allah who fed us, gave us drink, and made us Muslims.",ref:"Abu Dawud 3850"},
{arabic:"اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",urdu:"اے اللہ! تیرے ساتھ ہم نے صبح کی اور تیرے ساتھ شام، تیرے ساتھ جیتے اور مرتے ہیں، اور تیری طرف ہی اٹھنا ہے۔",en:"O Allah, by You we enter the morning and by You the evening, by You we live and die, and to You is the resurrection.",ref:"Tirmidhi 3391"},
{arabic:"رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ",urdu:"اے ہمارے رب! ہم سے قبول فرما، بیشک تو سننے والا جاننے والا ہے۔",en:"Our Lord, accept from us. Indeed You are the Hearing, the Knowing.",ref:"Qur'an 2:127"}
];let memeUrduIdx=0;let memeCurrentUrduDua=null;function memeRenderUrduPreview(d){const el=document.getElementById('meme-urdu-preview');if(!el||!d)return;el.innerHTML='<div class="mu-arabic">'+escapeHtmlNotes(d.arabic||'')+'</div>'+(d.urdu?'<div class="mu-urdu">'+escapeHtmlNotes(d.urdu)+'</div>':'')+(d.en?'<div class="mu-en">'+escapeHtmlNotes(d.en)+'</div>':'')+(d.ref?'<div class="mu-ref">'+escapeHtmlNotes(d.ref)+'</div>':'');}
/* Urdu morning / evening greeting memes — local pack (share-ready) */
var MEME_URDU_GREETINGS=[
{kind:'morning',top:'اسلام علیکم',mid:'صبح بخیر',bottom:'سدا آباد رہیں سلامت رہیں مسکراتے رہیں',ameen:'آمین یا رب العالمین',en:'Assalamu alaikum · Good morning · May you stay prosperous, safe, and smiling'},
{kind:'morning',top:'السلام علیکم ورحمۃ اللہ',mid:'صبح بخیر',bottom:'اللہ آپ کے دن کو خیروبرکت سے بھر دے',ameen:'آمین',en:'May Allah fill your day with goodness and barakah'},
{kind:'morning',top:'اسلام علیکم',mid:'صبح بخیر',bottom:'اللہ آپ کی حفاظت کرے اور روزی میں برکت دے',ameen:'آمین یا اللہ',en:'May Allah protect you and bless your provision'},
{kind:'morning',top:'السلام علیکم',mid:'نیک صبح',bottom:'اللہ دل کو سکون اور راستے کو روشن رکھے',ameen:'آمین',en:'May Allah grant the heart peace and light the path'},
{kind:'morning',top:'اسلام علیکم',mid:'صبح بخیر',bottom:'شکر کے ساتھ نیا دن — اللہ مدد فرمائے',ameen:'آمین',en:'A new day with gratitude — may Allah help you'},
{kind:'morning',top:'السلام علیکم',mid:'صبح بخیر و دعا',bottom:'اَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ',ameen:'رب العالمین',en:'We have entered morning and the dominion belongs to Allah'},
{kind:'evening',top:'اسلام علیکم',mid:'شب بخیر',bottom:'اللہ آپ کو سکون والی رات دے',ameen:'آمین',en:'May Allah grant you a peaceful night'},
{kind:'evening',top:'السلام علیکم',mid:'شب بخیر',bottom:'ہمارے اور آپ کے گناہ معاف فرما',ameen:'آمین یا رب',en:'May He forgive us and you'},
{kind:'salam',top:'السلام علیکم ورحمۃ اللہ وبرکاتہ',mid:'دعا گو',bottom:'اللہ آپ کو خوش رکھے',ameen:'آمین',en:'Peace and mercy — may Allah keep you happy'},
{kind:'salam',top:'اسلام علیکم',mid:'اللہ حافظ',bottom:'اللہ کی امان میں',ameen:'آمین',en:'Fi amanillah'}
];
var memeGreetIdx=0;
function memePickLocalUrduDua(){const d=MEME_URDU_DUAS[memeUrduIdx%MEME_URDU_DUAS.length];memeUrduIdx++;memeCurrentUrduDua=d;memeRenderUrduPreview(d);return d;}async function memeFetchUrduDua(){
  const btn=document.getElementById('meme-urdu-fetch-btn');
  if(btn){btn.disabled=true;btn.textContent='Fetching…';}
  try{
    function normalizeOnline(item){
      if(!item||typeof item!=='object') return null;
      const ar=String(item.arabic||item.dua||item.ar||item.text||'').trim();
      const ur=String(item.urdu||item.ur||item.translationUrdu||item.urduTranslation||'').trim();
      const en=String(item.en||item.translation||item.english||item.meaning||item.description||'').trim();
      const ref=String(item.ref||item.reference||item.category||item.title||'').trim();
      if(!ar && !ur && !en) return null;
      return {arabic:ar,urdu:ur,en:en,ref:ref,title:item.title||''};
    }
    function matchLocal(ar){
      if(!ar) return null;
      const needle=ar.replace(/[\s\u064B-\u065F\u0670]/g,'').slice(0,18);
      const pools=[];
      try{ if(typeof MEME_URDU_DUAS!=='undefined') pools.push.apply(pools,MEME_URDU_DUAS);}catch(e){}
      try{ if(typeof MASNOON_DUAS!=='undefined') pools.push.apply(pools,MASNOON_DUAS.map(function(d){return {arabic:d.ar,urdu:d.ur,en:d.en,ref:d.ref};}));}catch(e){}
      return pools.find(function(x){
        const hay=(x.arabic||x.ar||'').replace(/[\s\u064B-\u065F\u0670]/g,'');
        return hay && (hay.indexOf(needle)!==-1 || needle.indexOf(hay.slice(0,14))!==-1);
      })||null;
    }
    let online=null;
    try{
      const res=await fetch('https://dua-data-api.vercel.app/api/usefulDuas',{signal:AbortSignal.timeout(6000)});
      if(res.ok){
        const list=await res.json();
        if(Array.isArray(list)&&list.length){
          online=normalizeOnline(list[Math.floor(Math.random()*list.length)]);
        }
      }
    }catch(e){}
    if(online&&online.arabic){
      const localMatch=matchLocal(online.arabic);
      if(localMatch && (localMatch.urdu||localMatch.en)){
        memeCurrentUrduDua={
          arabic: localMatch.arabic || online.arabic,
          urdu: localMatch.urdu || '',
          en: localMatch.en || online.en || '',
          ref: localMatch.ref || online.ref || ''
        };
      } else {
        memeCurrentUrduDua={
          arabic: online.arabic,
          urdu: online.urdu || '',
          en: online.en || '',
          ref: online.ref || online.title || 'Masnūn duʿāʾ'
        };
      }
      /* Never leave Urdu empty or title-only ("موضوع:") */
      if(!memeCurrentUrduDua.urdu || /^موضوع:/.test(memeCurrentUrduDua.urdu)){
        if(localMatch && localMatch.urdu) memeCurrentUrduDua.urdu=localMatch.urdu;
        else if(memeCurrentUrduDua.en) memeCurrentUrduDua.urdu=memeCurrentUrduDua.en;
      }
      memeRenderUrduPreview(memeCurrentUrduDua);
    } else {
      memePickLocalUrduDua();
    }
  } finally {
    if(btn){btn.disabled=false;btn.textContent='✨ Next Urdu duʿā';}
  }
}
function memeApplyUrduDua(withNature){
  if(!memeCurrentUrduDua){ if(typeof memePickLocalUrduDua==="function") memePickLocalUrduDua(); }
  var d=memeCurrentUrduDua; if(!d) return;
  var topEl=document.getElementById("meme-top-input");
  var midEl=document.getElementById("meme-mid-input");
  var botEl=document.getElementById("meme-bottom-input");
  var ar=String(d.arabic||d.ar||"").trim();
  var en=String(d.en||"").trim();
  var ur=String(d.urdu||d.ur||"").trim();
  var ref=String(d.ref||"").trim();
  var bottom=ur;
  if(topEl) topEl.value=ar;
  if(midEl) midEl.value=en;
  if(botEl) botEl.value=bottom;
  function writeState(s){
    if(!s||typeof s!=="object") return;
    s.top=ar; s.mid=en; s.bottom=bottom; s._lastRef=ref; s.ref=ref;
    s._lastRef=ref; s.ref=ref;
    s.topY=0.12; s.midY=0.46; s.bottomY=0.72;
    s.topSize=34; s.midSize=en.length>120?16:20; s.bottomSize=16;
    if(!s.font||s.font==="impact") s.font="naskh";
  }
  try{ writeState(typeof memeState!=="undefined"?memeState:null); }catch(e){}
  try{ writeState(window.memeState); }catch(e){}
  try{ if(typeof memePositionBoxes==="function") memePositionBoxes(); }catch(e){}
  try{ if(typeof memeSyncFromInputs==="function") memeSyncFromInputs(); }catch(e){}
  try{ if(typeof memeAutoFitSizes==="function") memeAutoFitSizes(); }catch(e){}
  try{ if(typeof memeDraw==="function") memeDraw(); }catch(e){}
  setTimeout(function(){ try{ memeDraw(); }catch(e){} }, 80);
  setTimeout(function(){ try{ memeDraw(); }catch(e){} }, 300);
  if(withNature && typeof memeFetchBg==="function") memeFetchBg("nature");
  var st=document.getElementById("meme-rrra-status")||document.getElementById("meme-fetch-status");
  if(st) st.textContent=(ref||"Duʿā")+" · Arabic · English · Urdu";
}
function memeLoadUrduImageUrl(){const input=document.getElementById('meme-urdu-img-url');const url=input&&input.value.trim();if(!url){alert('Paste a direct image URL (ending in .jpg, .png, .webp, etc.).');return;}memeLoadImageFromUrl(url,'Could not load that image. The host may block embedding (CORS). Try uploading the file instead, or use another URL.');}function memeApplyPreset(name){
  if(preset==='story-stack'){
    memeState.topY=0.18;memeState.midY=0.48;memeState.bottomY=0.78;
    memeState.fontSize=Math.max(28,memeState.fontSize||32);
    memeState.style=memeState.style||'glass';
    var se=document.getElementById('meme-style');if(se){se.value='glass';}
    var re=document.getElementById('meme-ratio');if(re){re.value='9:16';}
    if(typeof memeSetRatio==='function')memeSetRatio('9:16');
    memePositionBoxes&&memePositionBoxes();memeDraw();return;
  }
if(!name)return;const topEl=document.getElementById('meme-top-input');const midEl=document.getElementById('meme-mid-input');const botEl=document.getElementById('meme-bottom-input');if(name==='classic'){memeState.topY=0.1;memeState.midY=0.48;memeState.bottomY=0.9;memeState.fontSize=42;if(topEl&&!topEl.value)topEl.value='REMEMBER DEATH';if(midEl&&!midEl.value)midEl.value='SEND LIGHT AHEAD';if(botEl&&!botEl.value)botEl.value='FURNISH YOUR GRAVE';}else if(name==='top-heavy'){memeState.topY=0.12;memeState.midY=0.42;memeState.bottomY=0.82;memeState.fontSize=44;if(topEl&&!topEl.value)topEl.value='ONE GOOD DEED TODAY';if(midEl&&!midEl.value)midEl.value='ISTIGHFAR · SALAWAT';if(botEl&&!botEl.value)botEl.value='LIGHT FOR THE GRAVE';}else if(name==='bottom-heavy'){memeState.topY=0.12;memeState.midY=0.5;memeState.bottomY=0.86;memeState.fontSize=40;if(topEl&&!topEl.value)topEl.value='ASTAGHFIRULLAH';if(midEl&&!midEl.value)midEl.value='EVERY DAY';if(botEl&&!botEl.value)botEl.value='SEND IT AHEAD';}else if(name==='center'){memeState.topY=0.28;memeState.midY=0.5;memeState.bottomY=0.72;memeState.fontSize=38;if(topEl&&!topEl.value)topEl.value='SABR';if(midEl&&!midEl.value)midEl.value='SHUKR';if(botEl&&!botEl.value)botEl.value='TAQWA';}else if(name==='minimal'){memeState.topY=0.18;memeState.midY=0.5;memeState.bottomY=0.82;memeState.fontSize=34;memeState.font='serif';memeState.style='soft';if(topEl&&!topEl.value)topEl.value='Remember death';if(midEl&&!midEl.value)midEl.value='Furnish your grave';if(botEl&&!botEl.value)botEl.value='with light';}else if(name==='poster'){memeState.topY=0.14;memeState.midY=0.48;memeState.bottomY=0.86;memeState.fontSize=48;memeState.font='impact';memeState.style='outline';if(topEl&&!topEl.value)topEl.value='ASTAGHFIRULLAH';if(midEl&&!midEl.value)midEl.value='SEND IT AHEAD';if(botEl&&!botEl.value)botEl.value='LIGHT FOR THE GRAVE';}const sizeEl=document.getElementById('meme-size');if(sizeEl){sizeEl.value=memeState.fontSize;memeOnSize(memeState.fontSize);}const fontEl=document.getElementById('meme-font');if(fontEl)fontEl.value=memeState.font;const styleEl=document.getElementById('meme-style');if(styleEl)styleEl.value=memeState.style;memePositionBoxes();memeSyncFromInputs();const sel=document.getElementById('meme-preset');if(sel)sel.value='';}function memePositionBoxes(){const map=[['meme-box-top',memeState.topY],['meme-box-mid',memeState.midY],['meme-box-bottom',memeState.bottomY]];map.forEach(function(pair){const box=document.getElementById(pair[0]);if(!box)return;box.style.top=(pair[1]*100)+'%';box.style.bottom='auto';box.style.transform='translate(-50%, -50%)';});}function memeReset(){memeState.img=null;memeState.top='';memeState.mid='';memeState.bottom='';memeState.fontSize=42;memeState.topSize=42;memeState.midSize=42;memeState.bottomSize=36;memeState.outline=4;memeState.topY=0.12;memeState.midY=0.42;memeState.bottomY=0.91;const topEl=document.getElementById('meme-top-input');const midEl=document.getElementById('meme-mid-input');const botEl=document.getElementById('meme-bottom-input');if(topEl)topEl.value='';if(midEl)midEl.value='';if(botEl)botEl.value='';const sizeEl=document.getElementById('meme-size');const outEl=document.getElementById('meme-outline');if(sizeEl){sizeEl.value=42;memeOnSize(42);}else{memeOnSize(42);}if(outEl){outEl.value=4;memeOnOutline(4);}const sample=document.getElementById('meme-sample');if(sample)sample.value='';memePositionBoxes();memeDraw();}function memeIsInAppBrowser(){
  var ua=(navigator.userAgent||'').toLowerCase();
  return /twitter|x\.com|fbav|fban|instagram|line\//i.test(ua) ||
    (/iphone|ipad|ipod|android/i.test(ua) && !/safari/i.test(ua) && /applewebkit/i.test(ua) && /crios|fxios|edgios|opios|linkedin|tiktok/i.test(ua));
}
function memeCanvasToBlob(canvas){
  return new Promise(function(resolve, reject){
    try{
      if(canvas.toBlob){
        canvas.toBlob(function(b){ if(b) resolve(b); else reject(new Error('toBlob empty')); }, 'image/png');
      } else {
        var data=canvas.toDataURL('image/png');
        var arr=data.split(','); var mime=(arr[0].match(/:(.*?);/)||[])[1]||'image/png';
        var bin=atob(arr[1]); var u=new Uint8Array(bin.length);
        for(var i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i);
        resolve(new Blob([u],{type:mime}));
      }
    }catch(e){ reject(e); }
  });
}
function memeTriggerBlobDownload(blob, filename){
  filename=filename||('clarity-meme-'+Date.now()+'.png');
  var url=URL.createObjectURL(blob);
  var link=document.createElement('a');
  link.href=url;
  link.download=filename;
  link.rel='noopener';
  link.style.display='none';
  document.body.appendChild(link);
  try{ link.click(); }catch(e){}
  setTimeout(function(){ try{ document.body.removeChild(link); URL.revokeObjectURL(url); }catch(e){} }, 2500);
  return url;
}
function memeOpenBlobPreview(blob){
  var url=URL.createObjectURL(blob);
  var w=null;
  try{ w=window.open(url,'_blank'); }catch(e){}
  if(!w){
    /* In-app browsers often block popups — navigate current tab as last resort with confirm */
    var go=confirm('Download blocked in this browser. Open the image so you can long-press → Save?');
    if(go) location.href=url;
    else URL.revokeObjectURL(url);
  } else {
    setTimeout(function(){ try{ URL.revokeObjectURL(url); }catch(e){} }, 60000);
  }
}
function memeForceAnchorDownload(href, name){
  var a = document.createElement('a');
  a.href = href;
  a.download = name;
  a.target = '_blank';
  a.rel = 'noopener';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(function(){ try{ document.body.removeChild(a); }catch(e){} }, 1500);
}
function memeEscapeHtml(s){
  return String(s==null?'':s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function memeCollectLinesForCard(){
  var parts=[];
  try{
    if(typeof memeCollectSpeakLines==='function') parts=memeCollectSpeakLines()||[];
  }catch(e){ parts=[]; }
  if(!parts.length){
    var t=(document.getElementById('meme-top-input')||{}).value||(memeState&&memeState.top)||'';
    var m=(document.getElementById('meme-mid-input')||{}).value||(memeState&&memeState.mid)||'';
    var b=(document.getElementById('meme-bottom-input')||{}).value||(memeState&&memeState.bottom)||'';
    parts=[t,m,b].map(function(x){return String(x||'').trim()}).filter(Boolean);
  }
  return parts;
}
async function memeDownloadPngOnly(){
  var canvas = memeGetCanvas();
  if(!canvas){ alert('Canvas not ready'); return; }
  try{ memeDraw(); }catch(e){}
  var filename = 'clarity-meme-' + Date.now() + '.png';
  function fromDataUrl(){
    try{
      var data = canvas.toDataURL('image/png');
      memeForceAnchorDownload(data, filename);
    }catch(e){
      alert('Download failed. Use Share, or open in Chrome/Safari.');
    }
  }
  try{
    if(canvas.toBlob){
      canvas.toBlob(function(blob){
        if(!blob){ fromDataUrl(); return; }
        try{
          var url = URL.createObjectURL(blob);
          memeForceAnchorDownload(url, filename);
          setTimeout(function(){ try{ URL.revokeObjectURL(url); }catch(e){} }, 4000);
        }catch(e){ fromDataUrl(); }
      }, 'image/png');
      return;
    }
  }catch(e){}
  fromDataUrl();
}
async function memeDownloadWithAudio(){
  /* Self-contained HTML card: image + Listen (speechSynthesis) so audio travels with the share */
  var canvas = memeGetCanvas();
  if(!canvas){ alert('Canvas not ready'); return; }
  try{ memeDraw(); }catch(e){}
  var dataUrl;
  try{ dataUrl = canvas.toDataURL('image/png'); }
  catch(e){ alert('Could not export image for audio card.'); return; }
  var lines = memeCollectLinesForCard();
  var linesJson = JSON.stringify(lines);
  var top = memeEscapeHtml(lines[0]||'');
  var mid = memeEscapeHtml(lines[1]||'');
  var bot = memeEscapeHtml(lines.slice(2).join(' · ')||'');
  var ts = Date.now();
  var htmlCard = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">'
    +'<title>Clarity meme</title>'
    +'<style>body{margin:0;font-family:system-ui,sans-serif;background:#0c1410;color:#eef6f1;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:1rem}'
    +'.card{max-width:520px;width:100%;background:#152019;border:1px solid rgba(212,180,90,.35);border-radius:16px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,.45)}'
    +'img{display:block;width:100%;height:auto;background:#111}'
    +'.bar{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;justify-content:space-between;padding:.75rem .9rem;border-top:1px solid rgba(255,255,255,.08)}'
    +'button{background:#0f4c3a;color:#fff;border:1px solid rgba(255,255,255,.25);border-radius:999px;padding:.5rem 1rem;font-weight:700;cursor:pointer}'
    +'button.playing{background:#8a3030}'
    +'.meta{font-size:.78rem;opacity:.8;line-height:1.35;max-width:58%}'
    +'a{color:#d4b45a}</style></head><body><div class="card">'
    +'<img src="'+dataUrl+'" alt="Clarity meme">'
    +'<div class="bar"><div class="meta"><strong>Clarity · Furnish Your Grave</strong><br>'
    +(top?top+'<br>':'')+(mid?mid+'<br>':'')+(bot?bot:'')
    +'<br><a href="https://clarity-dawah.fyi/" target="_blank" rel="noopener">clarity-dawah.fyi</a></div>'
    +'<button type="button" id="play" aria-label="Play meme audio">▶ Listen</button></div></div>'
    +'<scr'+'ipt>var LINES='+linesJson+';var active=false;'
    +'function stop(){active=false;try{speechSynthesis.cancel()}catch(e){}var b=document.getElementById("play");if(b){b.classList.remove("playing");b.textContent="▶ Listen"}}'
    +'function langFor(t){if(/[\u0600-\u06FF]/.test(t)){if(/[\u0679\u0688\u0691\u06BA\u06C1\u06BE\u06D2]/.test(t))return "ur-PK";return "ar-SA"}return "en-US"}'
    +'function speakNext(i){if(!active||i>=LINES.length){stop();return}var u=new SpeechSynthesisUtterance(LINES[i]);u.lang=langFor(LINES[i]);u.rate=u.lang.indexOf("ar")===0?0.82:0.94;'
    +'try{var vs=speechSynthesis.getVoices()||[];var hit=vs.find(function(v){return (v.lang||"").toLowerCase().indexOf(u.lang.slice(0,2))===0});if(hit)u.voice=hit}catch(e){}'
    +'u.onend=function(){speakNext(i+1)};u.onerror=function(){speakNext(i+1)};try{speechSynthesis.speak(u)}catch(e){speakNext(i+1)}}'
    +'document.getElementById("play").onclick=function(){if(active){stop();return}if(!window.speechSynthesis){alert("Speech not available in this browser.");return}'
    +'active=true;this.classList.add("playing");this.textContent="⏹ Stop";try{speechSynthesis.getVoices()}catch(e){}speakNext(0)};'
    +'</scr'+'ipt></body></html>';
  var blob = new Blob([htmlCard], {type:'text/html;charset=utf-8'});
  var url = URL.createObjectURL(blob);
  memeForceAnchorDownload(url, 'clarity-meme-audio-'+ts+'.html');
  setTimeout(function(){ try{ URL.revokeObjectURL(url); }catch(e){} }, 5000);
}
async function memeDownload(){
  /* Default: PNG image. Use Download+Audio for a playable HTML card. */
  return memeDownloadPngOnly();
}

async function memeSharePng(){
  /* Explicit share button path */
  var canvas=memeGetCanvas(); if(!canvas) return;
  try{ memeDraw(); }catch(e){}
  try{
    var blob=await memeCanvasToBlob(canvas);
    var filename='clarity-meme-'+Date.now()+'.png';
    var file=null;
    try{ file=new File([blob], filename, {type:'image/png'}); }catch(e){}
    if(navigator.share){
      if(file && navigator.canShare && navigator.canShare({files:[file]})){
        await navigator.share({ files:[file], title:'Clarity meme', text:'See more: clarity-dawah.fyi' });
        return;
      }
      await navigator.share({ title:'Clarity meme', text:'clarity-dawah.fyi', url:(location.origin||'https://clarity-dawah.fyi')+'/#meme' });
      return;
    }
  }catch(e){ if(e && e.name==='AbortError') return; }
  return memeDownload();
}
function memeInitDrag(){const stage=document.getElementById('meme-stage');if(!stage)return;const idMap={top:'meme-box-top',mid:'meme-box-mid',bottom:'meme-box-bottom'};function startDrag(which,clientY){memeState.dragging=which;const box=document.getElementById(idMap[which]);if(box)box.classList.add('dragging');moveDrag(clientY);}function moveDrag(clientY){if(!memeState.dragging)return;const rect=stage.getBoundingClientRect();let y=(clientY-rect.top)/rect.height;y=Math.max(0.06,Math.min(0.86,y));if(memeState.dragging==='top')memeState.topY=y;else if(memeState.dragging==='mid')memeState.midY=y;else memeState.bottomY=y;memePositionBoxes();memeDraw();}function endDrag(){if(!memeState.dragging)return;const box=document.getElementById(idMap[memeState.dragging]);if(box)box.classList.remove('dragging');memeState.dragging=null;}['top','mid','bottom'].forEach(which=>{const box=document.getElementById(idMap[which]);if(!box)return;const handle=box.querySelector('.meme-drag-handle');if(!handle)return;handle.addEventListener('pointerdown',(e)=>{e.preventDefault();handle.setPointerCapture(e.pointerId);startDrag(which,e.clientY);});handle.addEventListener('pointermove',(e)=>{if(memeState.dragging===which)moveDrag(e.clientY);});handle.addEventListener('pointerup',endDrag);handle.addEventListener('pointercancel',endDrag);});}function memeFitCanvasToStage(){const canvas=memeGetCanvas();const stage=document.getElementById('meme-stage');if(!canvas||!stage)return;const targetW=800;const targetH=600;if(canvas.width!==targetW||canvas.height!==targetH){canvas.width=targetW;canvas.height=targetH;}memePositionBoxes();memeDraw();}try{memeFitCanvasToStage();memeInitDrag();memeUpdateWmLink();memeDraw();window.addEventListener('resize',function(){memePositionBoxes();memeUpdateWmLink();});}catch(e){console.warn('Meme studio init',e);}tjRender();if(typeof tjRender==="function")tjRender();updateProgressPills();renderBookmarks();const OFFLINE_KEY='clarity_offline_pack_v1';function offlineCacheGet(k){try{const pack=JSON.parse(clarityLS.getItem(OFFLINE_KEY)||'{}');return pack[k]||null;}catch(e){return null;}}function offlineCacheSet(k,val){try{const pack=JSON.parse(clarityLS.getItem(OFFLINE_KEY)||'{}');pack[k]=val;pack.updatedAt=Date.now();clarityLS.setItem(OFFLINE_KEY,JSON.stringify(pack));}catch(e){}}function showOfflineBadge(on){const b=document.getElementById('offline-badge');if(b)b.classList.toggle('show',!!on);}window.addEventListener('online',()=>showOfflineBadge(false));window.addEventListener('offline',()=>showOfflineBadge(true));if(!navigator.onLine)showOfflineBadge(true);const ONE_ACTIONS=[
{id:'istighfar',text:'Say Astaghfirullāh 10 times and send it to your grave.',go:()=>{for(let i=0;i<10;i++)addDeposit('istighfar');switchTab('reflection');}},
{id:'salawat',text:'Send salawāt upon the Prophet ﷺ ten times.',go:()=>{for(let i=0;i<10;i++)addDeposit('salawat');switchTab('reflection');}},
{id:'command',text:'Open Commands and mark one verse you will work on.',go:()=>switchTab('reminder')},
{id:'verse',text:'Read today’s verse slowly, then do one deed it calls for.',go:()=>{switchTab('reminder');if(typeof loadVerse==='function')loadVerse();}},
{id:'hifz',text:'Memorise or review one ayah with meaning.',go:()=>switchTab('reminder')},
{id:'note',text:'Write one line in Notes for the grave.',go:()=>{if(typeof notesQuickFromSection==='function')notesQuickFromSection('Grave','Light for the grave',true);}},
{id:'parent',text:'Call or message a parent (or make duʿāʾ for them by name).',go:()=>switchTab('reminder')},
{id:'sadaqah',text:'Give a small ṣadaqah — even a smile or a message of ease.',go:()=>switchTab('reflection')},
{id:'night',text:'Ask: if I die tonight, what have I sent ahead? Then act once.',go:()=>{switchTab('reminder');document.getElementById('night-breath-card')&&document.getElementById('night-breath-card').scrollIntoView({behavior:'smooth'});}},
{id:'wudu',text:'Renew wuḍūʾ and pray two rakʿahs for forgiveness.',go:()=>switchTab('reflection')},
{id:'tongue',text:'Keep silent from one unnecessary complaint for the next hour.',go:()=>switchTab('reminder')},
{id:'quran_page',text:'Read one page of Qurʾān with presence, not speed.',go:()=>{switchTab('reminder');if(typeof loadVerse==='function')loadVerse();}},
{id:'soul_compass',text:'Run the Soul Compass (heart · tongue · hands).',go:()=>{switchTab('reminder');var el=document.getElementById('soul-compass-card');if(el)el.scrollIntoView({behavior:'smooth'});}}
];let currentOneAction=ONE_ACTIONS[0];function refreshOneAction(){currentOneAction=ONE_ACTIONS[Math.floor(Math.random()*ONE_ACTIONS.length)];const el=document.getElementById('one-action-text');if(el)el.textContent=currentOneAction.text;try{clarityLS.setItem('clarity_one_action',JSON.stringify({id:currentOneAction.id,day:new Date().toDateString()}));}catch(e){}}function doOneAction(){if(currentOneAction&&typeof currentOneAction.go==='function')currentOneAction.go();}(function initOneAction(){try{const saved=JSON.parse(clarityLS.getItem('clarity_one_action')||'null');if(saved&&saved.day===new Date().toDateString()){const found=ONE_ACTIONS.find(a=>a.id===saved.id);if(found)currentOneAction=found;}}catch(e){}const el=document.getElementById('one-action-text');if(el)el.textContent=currentOneAction.text;})();function updateWeeklyReview(){const set=(id,v)=>{const n=document.getElementById(id);if(n)n.textContent=v;};const streak=clarityLS.getItem('clarity_streak')||'0';const lessons=clarityLS.getItem('clarity_lessons')||'0';set('wr-streak',streak);set('wr-lessons',lessons);set('wr-istighfar',String(typeof getDepositCount==='function'?getDepositCount('istighfar'):0));set('wr-hifz',String(typeof getHifzTodayCountNum==='function'?getHifzTodayCountNum():0));const sum=document.getElementById('wr-summary');if(sum){const s=parseInt(streak,10)||0;sum.textContent=s>=7?'A full week of returning — may Allah accept what you sent ahead.':s>=3?'Consistency is forming. Guard the streak with one small deed today.':'Every long journey begins with a single return. Come back tomorrow.';}}updateWeeklyReview();if(typeof updateProgressPills==='function'){const _up=updateProgressPills;updateProgressPills=function(){_up();updateWeeklyReview();};}const NIGHT_QS=['What one deed would I want to have sent ahead?','Whose right have I delayed that I can repair before sleep?','If the grave asked me tonight, what light could I point to?','What screen time could become istighfār instead?','Have I prayed on time today — or do I owe a makeup?','Who needs my duʿāʾ by name before I sleep?','What am I clinging to that will not enter the grave with me?','Did I speak a word today I would not want written in my record?','If Fajr were my last adhān, was I ready to stand?','Which habit is quietly hardening my heart — and what is one cut tonight?','Have I thanked Allah for one specific mercy I treated as ordinary?','If I met the Prophet ﷺ tonight, what character would he recognise in me?','What apology have I postponed that could free two hearts before dawn?','Is there Qurʾān I delayed that I can read for ten honest minutes now?','When was the last time I gave ṣadaqah in secret?'];let nightQi=Math.floor(Math.random()*NIGHT_QS.length);function nightBreathRefresh(){nightQi=(nightQi+1)%NIGHT_QS.length;const q=document.getElementById('night-breath-q');if(q)q.textContent=NIGHT_QS[nightQi];}function nightBreathAct(){refreshOneAction();doOneAction();}nightBreathRefresh();const SEERAH_TIMELINE=[{year:'c. 570 CE',title:'Birth in Makkah',body:'Orphaned young; known later as al-Amīn — the trustworthy.',more:'Born in the Year of the Elephant to Āminah bint Wahb; father ʿAbdullāh had died before his birth. Cared for by Ḥalīmah al-Saʿdiyyah in the desert, then by his mother, then by grandfather ʿAbd al-Muṭṭalib, then by uncle Abū Ṭālib. Even before revelation he was known for honesty and for helping resolve disputes (e.g. the Black Stone).',wiki:'Muhammad'},{year:'595 CE',title:'Marriage to Khadījah رضي الله عنها',body:'Partnership in trade, faith, and the first years of revelation.',more:'Khadījah employed him in trade to Syria; impressed by his character, she proposed marriage. She was the first to believe in him, supported him with wealth and comfort, and remained his only wife until her death. Their home was the first shelter of the message.',wiki:'Khadija_bint_Khuwaylid'},{year:'610 CE',title:'First revelation',body:'Cave of Ḥirāʾ; “Iqraʾ” — prophethood at age forty.',more:'While in spiritual retreat in the Cave of Ḥirāʾ, Angel Jibrīl brought the first verses of Sūrat al-ʿAlaq. The Prophet ﷺ returned shaken; Khadījah reassured him and took him to Waraqah b. Nawfal, who affirmed the continuity of prophecy. A pause in revelation followed, then continuous wahy.',wiki:'Muhammad%27s_first_revelation'},{year:'613 CE',title:'Public call in Makkah',body:'Open invitation to Tawḥīd amid rising persecution.',more:'After a private phase, the call became public: “Warn your nearest kindred.” The early Muslims faced mockery, economic boycott, and violence. Bilāl, the family of Yāsir, and others were tortured. Some migrated to Abyssinia seeking a just Christian king’s protection.',wiki:'Meccan_surah'},{year:'619 CE',title:'Year of Sorrow',body:'Death of Khadījah and Abū Ṭālib; journey to Ṭāʾif.',more:'Loss of his wife and uncle removed major worldly support. The people of Ṭāʾif rejected him harshly; he responded with a famous duʿāʾ of dependence on Allah. Soon after came the gift of al-Isrāʾ wa-l-Miʿrāj.',wiki:'Year_of_Sorrow'},{year:'620–621',title:'Isrāʾ & Miʿrāj · First pledges of ʿAqabah',body:'Night journey and ascent; Madinan support begins.',more:'The night journey to Jerusalem and ascent to the heavens established the five daily prayers. Meetings with seekers from Yathrib (Madinah) at ʿAqabah laid the ground for Hijrah — a community ready to protect the message.',wiki:'Isra_and_Mi%27raj'},{year:'622 CE',title:'Hijrah to Madinah',body:'Migration that begins the Islamic calendar; a just community.',more:'Permission to migrate came after plots in Makkah. With Abū Bakr he reached Qubāʾ then Madinah. The Constitution of Madinah organised relations among Muslims, Jews, and others. Brotherhood (muʾākhāh) paired Muhājirūn and Anṣār.',wiki:'Hijrah'},{year:'624–627',title:'Badr, Uḥud, Khandaq',body:'Trials of war and patience; reliance and discipline.',more:'Badr (2 AH): a small force aided by Allah against a larger army. Uḥud (3 AH): a hard lesson when archers left their post. Khandaq (5 AH): trench defence against a confederate siege; trust and strategy under pressure.',wiki:'Battle_of_Badr'},{year:'628 CE',title:'Hudaybiyyah',body:'A treaty that looked like setback and became a clear opening.',more:'Prevented from ʿumrah, the Muslims accepted terms that seemed unfavourable. The Qurʾān called it a clear victory (fatḥ mubīn). The truce allowed peaceful dawah; numbers of Muslims grew rapidly. The Treaty was later broken by Quraysh’s allies.',wiki:'Treaty_of_Hudaybiyyah'},{year:'630 CE',title:'Conquest of Makkah',body:'Mercy over revenge: “Go, for you are free.”',more:'After Quraysh’s side violated the treaty, the Prophet ﷺ entered Makkah with overwhelming force but minimal bloodshed. Idols in the Kaʿbah were removed. General amnesty taught that power is for justice and mercy, not vengeance.',wiki:'Conquest_of_Mecca'},{year:'631–632',title:'Year of Delegations · Farewell Hajj',body:'Tribes enter Islam; the final sermon.',more:'Delegations from across Arabia accepted Islam. In the Farewell Hajj the Prophet ﷺ taught equality, the sanctity of life and property, and completion of the religion. “I leave among you the Book of Allah…”',wiki:'Farewell_Pilgrimage'},{year:'632 CE',title:'Return to Allah',body:'Religion completed; the ummah left with Quran and Sunnah.',more:'After a brief illness he ﷺ passed away in Madinah in the room of ʿĀʾishah رضي الله عنها. He was buried where he died. The companions preserved the Qurʾān and his Sunnah — the lasting legacy of guidance.',wiki:'Death_of_Muhammad'}];function renderSeerahTimeline(){const root=document.getElementById('seerah-timeline');if(!root)return;root.innerHTML=SEERAH_TIMELINE.map((item,i)=>`<div class="seerah-tl-item" data-idx="${i}" onclick="toggleSeerahTl(${i})">
          <div class="tl-year">${item.year}</div>
          <div class="tl-title">${item.title}</div>
          <div class="tl-body">${item.body}</div>
          <div class="tl-toggle" id="tl-tog-${i}">Show more ▾</div>
          <div class="tl-more" id="tl-more-${i}">
            <p>${item.more || ''}</p>
            <div class="tl-online" id="tl-online-${i}"></div>
          </div>
        </div>`).join('');}function toggleSeerahTl(i){const item=document.querySelector('.seerah-tl-item[data-idx="'+i+'"]');const tog=document.getElementById('tl-tog-'+i);if(!item)return;item.classList.toggle('open');if(tog)tog.textContent=item.classList.contains('open')?'Show less ▴':'Show more ▾';}function expandAllSeerahTl(){document.querySelectorAll('.seerah-tl-item').forEach((el,i)=>{el.classList.add('open');const tog=document.getElementById('tl-tog-'+i);if(tog)tog.textContent='Show less ▴';});}async function fetchSeerahOnlineSummaries(){const btn=event&&event.target;if(btn){btn.disabled=true;btn.textContent='Fetching…';}for(let i=0;i<SEERAH_TIMELINE.length;i++){const item=SEERAH_TIMELINE[i];const slot=document.getElementById('tl-online-'+i);if(!slot||!item.wiki)continue;slot.textContent='Loading online abstract…';try{const url='https://en.wikipedia.org/api/rest_v1/page/summary/'+item.wiki;const res=await fetch(url);if(!res.ok)throw new Error('no');const data=await res.json();const extract=(data.extract||'').slice(0,420);slot.innerHTML=extract?('<strong>Online abstract:</strong> '+extract+(data.extract&&data.extract.length>420?'…':'')+(data.content_urls&&data.content_urls.desktop?' <a href="'+data.content_urls.desktop.page+'" target="_blank" rel="noopener">Read more →</a>':'')):'No abstract available.';}catch(e){slot.textContent='Could not fetch abstract (network or blocked). Local text above remains.';}}expandAllSeerahTl();if(btn){btn.disabled=false;btn.textContent='↻ Refresh online abstracts';}}renderSeerahTimeline();const ASMA_UL_HUSNA=[{ar:'الرَّحْمَٰنُ',tr:'Ar-Raḥmān',en:'The Most Merciful',virtue:'Mercy that encompasses all. Allah is more merciful to His servants than a mother to her child.',ref:'Qur’an 1:1 · Bukhari 5999'},{ar:'الرَّحِيمُ',tr:'Ar-Raḥīm',en:'The Especially Merciful',virtue:'Special mercy for the believers. Begin with Bismillah seeking this mercy.',ref:'Qur’an 1:3'},{ar:'الْمَلِكُ',tr:'Al-Malik',en:'The King / Sovereign',virtue:'True sovereignty is His alone. Humbles the proud and comforts the oppressed.',ref:'Qur’an 59:23'},{ar:'الْقُدُّوسُ',tr:'Al-Quddūs',en:'The Most Holy',virtue:'Free of every defect. Subḥānallāh affirms His purity.',ref:'Qur’an 59:23'},{ar:'السَّلَامُ',tr:'As-Salām',en:'The Source of Peace',virtue:'Safety and peace come from Him. The greeting is a prayer for this peace.',ref:'Qur’an 59:23'},{ar:'الْمُؤْمِنُ',tr:'Al-Muʾmin',en:'The Giver of Faith & Security',virtue:'Grants security and confirms the truth of His messengers.',ref:'Qur’an 59:23'},{ar:'الْمُهَيْمِنُ',tr:'Al-Muhaymin',en:'The Guardian / Watcher',virtue:'Watches over and protects. Entrust affairs to Al-Muhaymin.',ref:'Qur’an 59:23'},{ar:'الْعَزِيزُ',tr:'Al-ʿAzīz',en:'The Almighty',virtue:'Might with wisdom. Dignity is from belonging to Him, not ego.',ref:'Qur’an 59:23'},{ar:'الْجَبَّارُ',tr:'Al-Jabbār',en:'The Compeller / Restorer',virtue:'Mends the broken and compels what He wills with justice.',ref:'Qur’an 59:23'},{ar:'الْمُتَكَبِّرُ',tr:'Al-Mutakabbir',en:'The Supreme',virtue:'Greatness belongs only to Him. Pride is for Allah alone.',ref:'Qur’an 59:23'},{ar:'الْخَالِقُ',tr:'Al-Khāliq',en:'The Creator',virtue:'Creates from nothing. Reflect on creation to know the Creator.',ref:'Qur’an 59:24'},{ar:'الْبَارِئُ',tr:'Al-Bāriʾ',en:'The Originator',virtue:'Brings into being with perfect form and proportion.',ref:'Qur’an 59:24'},{ar:'الْمُصَوِّرُ',tr:'Al-Muṣawwir',en:'The Fashioner',virtue:'Gives each creation its form. Beauty and diversity are from Him.',ref:'Qur’an 59:24'},{ar:'الْغَفَّارُ',tr:'Al-Ghaffār',en:'The Most Forgiving',virtue:'Forgives again and again. The Prophet ﷺ sought forgiveness often daily.',ref:'Qur’an 71:10 · Bukhari 6307'},{ar:'الْقَهَّارُ',tr:'Al-Qahhār',en:'The Subduer',virtue:'Overcomes all forces. Nothing escapes His will.',ref:'Qur’an 12:39'},{ar:'الْوَهَّابُ',tr:'Al-Wahhāb',en:'The Bestower',virtue:'Gives freely. Ask for good that does not burden the soul.',ref:'Qur’an 3:8'},{ar:'الرَّزَّاقُ',tr:'Ar-Razzāq',en:'The Provider',virtue:'Provision is from Him. Work with tawakkul.',ref:'Qur’an 51:58'},{ar:'الْفَتَّاحُ',tr:'Al-Fattāḥ',en:'The Opener',virtue:'Opens doors of mercy, knowledge, and relief.',ref:'Qur’an 34:26'},{ar:'الْعَلِيمُ',tr:'Al-ʿAlīm',en:'The All-Knowing',virtue:'Nothing is hidden — public or private. Trains ikhlāṣ.',ref:'Qur’an 2:29'},{ar:'الْقَابِضُ',tr:'Al-Qābiḍ',en:'The Withholder',virtue:'Withholds with wisdom. Constraint can be mercy.',ref:'Classical lists · Qur’an 2:245'},{ar:'الْبَاسِطُ',tr:'Al-Bāsiṭ',en:'The Expander',virtue:'Expands provision and hearts. Ask for expanse in faith.',ref:'Classical lists · Qur’an 2:245'},{ar:'الْخَافِضُ',tr:'Al-Khāfiḍ',en:'The Abaser',virtue:'Lowers whom He wills with justice. Humility before Him is honour.',ref:'Classical lists'},{ar:'الرَّافِعُ',tr:'Ar-Rāfiʿ',en:'The Exalter',virtue:'Raises ranks by faith and good deeds.',ref:'Classical lists · Qur’an 58:11'},{ar:'الْمُعِزُّ',tr:'Al-Muʿizz',en:'The Honourer',virtue:'True ʿizzah is from Allah for the believers.',ref:'Qur’an 3:26'},{ar:'الْمُذِلُّ',tr:'Al-Mudhill',en:'The Dishonourer',virtue:'Humiliates arrogance. Seek protection from disgrace in dunyā and ākhirah.',ref:'Qur’an 3:26'},{ar:'السَّمِيعُ',tr:'As-Samīʿ',en:'The All-Hearing',virtue:'Hears every duʿāʾ and whisper.',ref:'Qur’an 2:127 · Bukhari 7386'},{ar:'الْبَصِيرُ',tr:'Al-Baṣīr',en:'The All-Seeing',virtue:'Sees every deed. Root of iḥsān.',ref:'Qur’an 17:1 · Muslim 8'},{ar:'الْحَكَمُ',tr:'Al-Ḥakam',en:'The Judge',virtue:'Ultimate judgement is His. Uphold justice where you can.',ref:'Abu Dawud 4955'},{ar:'الْعَدْلُ',tr:'Al-ʿAdl',en:'The Just',virtue:'No soul is wronged by Him.',ref:'Qur’an 4:40'},{ar:'اللَّطِيفُ',tr:'Al-Laṭīf',en:'The Subtle & Kind',virtue:'Kindness in ways we may not see. Call on Him in tight places.',ref:'Qur’an 67:14'},{ar:'الْخَبِيرُ',tr:'Al-Khabīr',en:'The All-Aware',virtue:'Aware of the innermost. Pair with muḥāsabah.',ref:'Qur’an 6:18'},{ar:'الْحَلِيمُ',tr:'Al-Ḥalīm',en:'The Forbearing',virtue:'Does not rush to punish. Learn ḥilm.',ref:'Qur’an 2:225'},{ar:'الْعَظِيمُ',tr:'Al-ʿAẓīm',en:'The Magnificent',virtue:'Said in rukūʿ: Subḥāna Rabbiyal-ʿAẓīm.',ref:'Muslim 772'},{ar:'الْغَفُورُ',tr:'Al-Ghafūr',en:'The Forgiving',virtue:'Never despair of His mercy.',ref:'Qur’an 39:53'},{ar:'الشَّكُورُ',tr:'Ash-Shakūr',en:'The Appreciative',virtue:'Multiplies small deeds. Gratitude increases blessing.',ref:'Qur’an 35:30'},{ar:'الْعَلِيُّ',tr:'Al-ʿAliyy',en:'The Most High',virtue:'Above all creation. Raise concerns to Him.',ref:'Qur’an 2:255'},{ar:'الْكَبِيرُ',tr:'Al-Kabīr',en:'The Greatest',virtue:'Allāhu akbar shrinks anxiety and pride.',ref:'Qur’an 34:23'},{ar:'الْحَفِيظُ',tr:'Al-Ḥafīẓ',en:'The Preserver',virtue:'Guards His servants and the Book.',ref:'Qur’an 11:57'},{ar:'الْمُقِيتُ',tr:'Al-Muqīt',en:'The Sustainer',virtue:'Provides the measure each needs.',ref:'Qur’an 4:85'},{ar:'الْحَسِيبُ',tr:'Al-Ḥasīb',en:'The Reckoner',virtue:'Sufficient as a reckoner. Ḥasbunallāh.',ref:'Qur’an 4:86'},{ar:'الْجَلِيلُ',tr:'Al-Jalīl',en:'The Majestic',virtue:'Majesty that inspires awe and love.',ref:'Classical lists'},{ar:'الْكَرِيمُ',tr:'Al-Karīm',en:'The Generous',virtue:'Gives beyond measure. Ask with good opinion.',ref:'Qur’an 82:6'},{ar:'الرَّقِيبُ',tr:'Ar-Raqīb',en:'The Watchful',virtue:'Watches over every deed and intention.',ref:'Qur’an 4:1'},{ar:'الْمُجِيبُ',tr:'Al-Mujīb',en:'The Responsive',virtue:'“Call upon Me; I will respond to you.”',ref:'Qur’an 40:60 · 2:186'},{ar:'الْوَاسِعُ',tr:'Al-Wāsiʿ',en:'The Vast',virtue:'Mercy and knowledge vast beyond measure.',ref:'Qur’an 2:115'},{ar:'الْحَكِيمُ',tr:'Al-Ḥakīm',en:'The Wise',virtue:'Every decree has wisdom, even when hidden.',ref:'Qur’an 2:32'},{ar:'الْوَدُودُ',tr:'Al-Wadūd',en:'The Loving',virtue:'Loves the righteous; love of Allah is the heart’s life.',ref:'Qur’an 11:90'},{ar:'الْمَجِيدُ',tr:'Al-Majīd',en:'The Glorious',virtue:'The Qurʾān is majīd — approach with reverence.',ref:'Qur’an 85:15'},{ar:'الْبَاعِثُ',tr:'Al-Bāʿith',en:'The Resurrector',virtue:'Raises the dead and renews hearts.',ref:'Qur’an 22:7'},{ar:'الشَّهِيدُ',tr:'Ash-Shahīd',en:'The Witness',virtue:'Witness over all things — nothing is missed.',ref:'Qur’an 3:98'},{ar:'الْحَقُّ',tr:'Al-Ḥaqq',en:'The Truth',virtue:'Truth stands; falsehood vanishes.',ref:'Qur’an 22:6'},{ar:'الْوَكِيلُ',tr:'Al-Wakīl',en:'The Disposer of Affairs',virtue:'Allah is sufficient; best Disposer of affairs.',ref:'Qur’an 3:173'},{ar:'الْقَوِيُّ',tr:'Al-Qawiyy',en:'The Strong',virtue:'Strength belongs to Him. Seek strength for obedience.',ref:'Qur’an 22:40'},{ar:'الْمَتِينُ',tr:'Al-Matīn',en:'The Firm',virtue:'Unshakeable. Ask Him to firm the heart.',ref:'Qur’an 51:58'},{ar:'الْوَلِيُّ',tr:'Al-Waliyy',en:'The Protecting Friend',virtue:'Ally of the believers through taqwā.',ref:'Qur’an 2:257'},{ar:'الْحَمِيدُ',tr:'Al-Ḥamīd',en:'The Praiseworthy',virtue:'All praise is His. Al-ḥamdu lillāh fills the scales.',ref:'Qur’an 14:1 · Muslim 223'},{ar:'الْمُحْصِي',tr:'Al-Muḥṣī',en:'The Counter',virtue:'Counts every deed and leaf.',ref:'Qur’an 19:94'},{ar:'الْمُبْدِئُ',tr:'Al-Mubdiʾ',en:'The Originator',virtue:'Begins creation; none preceded Him in bringing things into being.',ref:'Qur’an 10:34'},{ar:'الْمُعِيدُ',tr:'Al-Muʿīd',en:'The Restorer',virtue:'Restores life and returns creation as He began it.',ref:'Qur’an 10:34'},{ar:'الْمُحْيِي',tr:'Al-Muḥyī',en:'The Giver of Life',virtue:'Gives life to bodies and to dead hearts.',ref:'Qur’an 30:50'},{ar:'الْمُمِيتُ',tr:'Al-Mumīt',en:'The Taker of Life',virtue:'Death is by His permission — a reminder to prepare.',ref:'Qur’an 40:68'},{ar:'الْحَيُّ',tr:'Al-Ḥayy',en:'The Ever-Living',virtue:'Never dies. Depend on Him when means pass away.',ref:'Qur’an 2:255'},{ar:'الْقَيُّومُ',tr:'Al-Qayyūm',en:'The Self-Sustaining',virtue:'Sustains all. With Al-Ḥayy in Āyat al-Kursī.',ref:'Qur’an 2:255'},{ar:'الْوَاجِدُ',tr:'Al-Wājid',en:'The Finder / Resourceful',virtue:'Finds and provides; nothing escapes Him.',ref:'Classical lists'},{ar:'الْمَاجِدُ',tr:'Al-Mājid',en:'The Noble',virtue:'Perfect nobility and glory.',ref:'Classical lists'},{ar:'الْوَاحِدُ',tr:'Al-Wāḥid',en:'The One',virtue:'One without partner. Foundation of tawḥīd.',ref:'Qur’an 39:4'},{ar:'الْأَحَدُ',tr:'Al-Aḥad',en:'The Unique',virtue:'Absolutely unique — Sūrat al-Ikhlāṣ.',ref:'Qur’an 112:1'},{ar:'الصَّمَدُ',tr:'Aṣ-Ṣamad',en:'The Eternal Refuge',virtue:'All turn to Him; He needs none.',ref:'Qur’an 112:2'},{ar:'الْقَادِرُ',tr:'Al-Qādir',en:'The Able',virtue:'Able over all things. Ask with humility.',ref:'Qur’an 2:20'},{ar:'الْمُقْتَدِرُ',tr:'Al-Muqtadir',en:'The Powerful',virtue:'Perfect power over every outcome.',ref:'Qur’an 18:45'},{ar:'الْمُقَدِّمُ',tr:'Al-Muqaddim',en:'The Advancer',virtue:'Brings forward whom He wills.',ref:'Classical lists · Muslim 2713'},{ar:'الْمُؤَخِّرُ',tr:'Al-Muʾakhkhir',en:'The Delayer',virtue:'Delays with wisdom. Trust His timing.',ref:'Classical lists · Muslim 2713'},{ar:'الْأَوَّلُ',tr:'Al-Awwal',en:'The First',virtue:'Before all things. Begin with His name.',ref:'Qur’an 57:3'},{ar:'الْآخِرُ',tr:'Al-Ākhir',en:'The Last',virtue:'After all ends. Orient life to meeting Him.',ref:'Qur’an 57:3'},{ar:'الظَّاهِرُ',tr:'Aẓ-Ẓāhir',en:'The Manifest',virtue:'Evident through signs in creation.',ref:'Qur’an 57:3'},{ar:'الْبَاطِنُ',tr:'Al-Bāṭin',en:'The Hidden',virtue:'Knows the inward. Purify the secret self.',ref:'Qur’an 57:3 · 50:16'},{ar:'الْوَالِي',tr:'Al-Wālī',en:'The Governor',virtue:'Directs all affairs with wisdom.',ref:'Classical lists'},{ar:'الْمُتَعَالِي',tr:'Al-Mutaʿālī',en:'The Most Exalted',virtue:'Exalted above every limitation.',ref:'Qur’an 13:9'},{ar:'الْبَرُّ',tr:'Al-Barr',en:'The Source of Goodness',virtue:'Kind and generous to creation. Be barr to parents and people.',ref:'Qur’an 52:28'},{ar:'التَّوَّابُ',tr:'At-Tawwāb',en:'The Accepter of Repentance',virtue:'Accepts those who turn back. Never close the door of tawbah.',ref:'Qur’an 2:222 · Bukhari 6308'},{ar:'الْمُنْتَقِمُ',tr:'Al-Muntaqim',en:'The Avenger',virtue:'Takes just retribution. Leave injustice to Him.',ref:'Qur’an 32:22'},{ar:'الْعَفُوُّ',tr:'Al-ʿAfuww',en:'The Pardoner',virtue:'Effaces sins. In Laylat al-Qadr: ask Al-ʿAfuww for pardon.',ref:'Tirmidhi 3513'},{ar:'الرَّءُوفُ',tr:'Ar-Raʾūf',en:'The Compassionate',virtue:'Gentle compassion. Be raʾūf to creation.',ref:'Qur’an 9:117'},{ar:'مَالِكُ الْمُلْكِ',tr:'Mālik-ul-Mulk',en:'Owner of Dominion',virtue:'Gives kingdom to whom He wills. Power is a trust.',ref:'Qur’an 3:26'},{ar:'ذُو الْجَلَالِ وَالْإِكْرَامِ',tr:'Dhūl-Jalāli wal-Ikrām',en:'Lord of Majesty and Honour',virtue:'Recited after ṣalāh. Awe with hope.',ref:'Qur’an 55:27 · Tirmidhi 3524'},{ar:'الْمُقْسِطُ',tr:'Al-Muqsiṭ',en:'The Equitable',virtue:'Establishes perfect equity.',ref:'Qur’an 3:18'},{ar:'الْجَامِعُ',tr:'Al-Jāmiʿ',en:'The Gatherer',virtue:'Gathers creation for the Day of Judgement.',ref:'Qur’an 3:9'},{ar:'الْغَنِيُّ',tr:'Al-Ghaniyy',en:'The Self-Sufficient',virtue:'Needs nothing; all need Him.',ref:'Qur’an 35:15'},{ar:'الْمُغْنِي',tr:'Al-Mughnī',en:'The Enricher',virtue:'Enriches hearts and hands as He wills.',ref:'Classical lists'},{ar:'الْمَانِعُ',tr:'Al-Māniʿ',en:'The Preventer',virtue:'Prevents harm and withholds what is not good for us.',ref:'Classical lists'},{ar:'الضَّارُّ',tr:'Aḍ-Ḍārr',en:'The Distresser',virtue:'Harm and benefit are by His decree — seek refuge in Him.',ref:'Classical lists'},{ar:'النَّافِعُ',tr:'An-Nāfiʿ',en:'The Benefactor',virtue:'All benefit is from Him. Ask for beneficial knowledge and provision.',ref:'Classical lists'},{ar:'النُّورُ',tr:'An-Nūr',en:'The Light',virtue:'Light of the heavens and earth. Ask for light in the heart and grave.',ref:'Qur’an 24:35'},{ar:'الْهَادِي',tr:'Al-Hādī',en:'The Guide',virtue:'Guides whom He wills. Ask for firmness on the straight path.',ref:'Qur’an 22:54'},{ar:'الْبَدِيعُ',tr:'Al-Badīʿ',en:'The Incomparable Originator',virtue:'Originates without precedent.',ref:'Qur’an 2:117'},{ar:'الْبَاقِي',tr:'Al-Bāqī',en:'The Everlasting',virtue:'Remains when all else perishes.',ref:'Qur’an 55:27'},{ar:'الْوَارِثُ',tr:'Al-Wārith',en:'The Inheritor',virtue:'Inherits the earth and all upon it.',ref:'Qur’an 15:23'},{ar:'الرَّشِيدُ',tr:'Ar-Rashīd',en:'The Guide to the Right Path',virtue:'Guides to mature, right conduct.',ref:'Classical lists'},{ar:'الصَّبُورُ',tr:'Aṣ-Ṣabūr',en:'The Patient',virtue:'Does not rush to punish. Learn ṣabr from Him.',ref:'Qur’an 2:153 · classical lists'}];function loadAsmaLecturePlayer(){const sel=document.getElementById('asma-lecture-select');const iframe=document.getElementById('asma-lecture-player');if(!sel||!iframe)return;const v=String(sel.value||'');let src='';if(v.indexOf('list:')===0){src='https://www.youtube.com/embed/videoseries?list='+encodeURIComponent(v.slice(5));}else if(v.indexOf('video:')===0){src='https://www.youtube.com/embed/'+encodeURIComponent(v.slice(6));}else if(v){src='https://www.youtube.com/embed/'+encodeURIComponent(v);}if(src)iframe.src=src;}function loadAsma(random){const box=document.getElementById('asma-box');if(!box)return;let idx;if(random){idx=Math.floor(Math.random()*ASMA_UL_HUSNA.length);}else{const day=Math.floor(Date.now()/86400000);idx=day%ASMA_UL_HUSNA.length;}const n=ASMA_UL_HUSNA[idx];box.innerHTML='<div class="asma-arabic">'+n.ar+'</div>'+'<div class="asma-translit">'+n.tr+' <span style="font-weight:500;opacity:0.75;font-size:0.9rem;">('+(idx+1)+'/99)</span></div>'+'<div class="asma-meaning">'+n.en+'</div>'+'<div class="asma-virtue"><strong>Reflection:</strong> '+n.virtue+'</div>'+'<div class="asma-ref">'+n.ref+' · Educational summary — not a fatwa</div>';enrichAsmaOnline(n.tr,box);}function showAllAsma(){const list=document.getElementById('asma-all-list');if(!list)return;if(list.style.display!=='none'&&list.innerHTML){list.style.display=list.style.display==='none'?'block':'none';if(list.style.display==='none')return;}list.style.display='block';filterAsmaList((document.getElementById('asma-search')||{}).value||'');}function filterAsmaList(q){const list=document.getElementById('asma-all-list');if(!list)return;list.style.display='block';const needle=(q||'').toLowerCase().trim();const items=ASMA_UL_HUSNA.map(function(n,i){const hay=(n.ar+' '+n.tr+' '+n.en).toLowerCase();if(needle&&hay.indexOf(needle)===-1)return'';return'<div class="search-result" style="cursor:pointer;margin-bottom:0.45rem;" onclick="loadAsmaAt('+i+')">'+'<span class="asma-arabic" style="font-size:1.25rem;display:inline-block;margin-left:0.35rem;">'+n.ar+'</span> '+'<strong>'+n.tr+'</strong> — '+n.en+'</div>';}).filter(Boolean);list.innerHTML=items.length?items.join(''):'<p class="notes-hint">No matching Name.</p>';}function loadAsmaAt(i){const box=document.getElementById('asma-box');if(!box||!ASMA_UL_HUSNA[i])return;const n=ASMA_UL_HUSNA[i];box.innerHTML='<div class="asma-arabic">'+n.ar+'</div>'+'<div class="asma-translit">'+n.tr+' <span style="font-weight:500;opacity:0.75;font-size:0.9rem;">('+(i+1)+'/99)</span></div>'+'<div class="asma-meaning">'+n.en+'</div>'+'<div class="asma-virtue"><strong>Reflection:</strong> '+n.virtue+'</div>'+'<div class="asma-ref">'+n.ref+' · Educational summary — not a fatwa</div>';box.scrollIntoView({behavior:'smooth',block:'nearest'});}async function enrichAsmaOnline(translit,box){try{const res=await fetch('https://api.aladhan.com/v1/asmaAlHusna',{signal:AbortSignal.timeout(4000)});if(!res.ok)return;const data=await res.json();const list=data.data||data||[];if(!Array.isArray(list)||!list.length)return;const needle=(translit||'').toLowerCase().replace(/[^a-z]/g,'');const hit=list.find(x=>{const en=((x.transliteration||x.en||x.name||'')+'').toLowerCase().replace(/[^a-z]/g,'');return en&&needle&&(en.indexOf(needle.slice(0,5))!==-1||needle.indexOf(en.slice(0,5))!==-1);});if(hit&&(hit.en||hit.meaning)){const extra=document.createElement('div');extra.className='asma-ref';extra.style.marginTop='0.45rem';extra.textContent='Online note: '+(hit.en||hit.meaning||hit.transliteration||'');box.appendChild(extra);}}catch(e){}}loadAsma(false);const PROPHET_NAMES=[{ar:'مُحَمَّد',tr:'Muḥammad',en:'The Praised One',blessing:'The name given by his family and by which he is most known. Allah combined praise for him on earth and in the heavens.',ref:'Qur’an 48:29 · Bukhari 3532'},{ar:'أَحْمَد',tr:'Aḥmad',en:'The Most Praiseworthy',blessing:'Mentioned in the glad tidings of ʿĪsā عليه السلام. The one who praises Allah most.',ref:'Qur’an 61:6 · Muslim 2354'},{ar:'الْمَاحِي',tr:'Al-Māḥī',en:'The Eraser',blessing:'Allah erases disbelief through him.',ref:'Muslim 2355'},{ar:'الْحَاشِر',tr:'Al-Ḥāshir',en:'The Gatherer',blessing:'People will be gathered at his feet on the Day of Resurrection.',ref:'Muslim 2354'},{ar:'الْعَاقِب',tr:'Al-ʿĀqib',en:'The Last',blessing:'There is no prophet after him.',ref:'Muslim 2354'},{ar:'نَبِيُّ الرَّحْمَة',tr:'Nabiyy ar-Raḥmah',en:'Prophet of Mercy',blessing:'Sent as a mercy to the worlds.',ref:'Qur’an 21:107 · Muslim 2355'},{ar:'نَبِيُّ التَّوْبَة',tr:'Nabiyy at-Tawbah',en:'Prophet of Repentance',blessing:'Through him the door of repentance was opened wide for this ummah.',ref:'Muslim 2355'},{ar:'الْمُصْطَفَى',tr:'Al-Muṣṭafā',en:'The Chosen',blessing:'Chosen above all creation for the final message.',ref:'Qur’an 22:75 · classical usage'},{ar:'الرَّسُول',tr:'Ar-Rasūl',en:'The Messenger',blessing:'Conveyed the message fully; obedience to him is obedience to Allah.',ref:'Qur’an 4:80'},{ar:'النَّبِيّ',tr:'An-Nabī',en:'The Prophet',blessing:'Receives revelation; final of the prophets.',ref:'Qur’an 33:40'},{ar:'الشَّاهِد',tr:'Ash-Shāhid',en:'The Witness',blessing:'Witness over his ummah on the Day of Judgement.',ref:'Qur’an 33:45'},{ar:'الْمُبَشِّر',tr:'Al-Mubashshir',en:'The Bearer of Good News',blessing:'Gives glad tidings of Paradise to the believers.',ref:'Qur’an 33:45'},{ar:'النَّذِير',tr:'An-Nadhīr',en:'The Warner',blessing:'Warns against the Fire and disbelief.',ref:'Qur’an 33:45'},{ar:'الدَّاعِي إِلَى اللَّهِ',tr:'Ad-Dāʿī ilā Allāh',en:'The Caller to Allah',blessing:'Invites to Allah by His permission.',ref:'Qur’an 33:46'},{ar:'السِّرَاجُ الْمُنِير',tr:'As-Sirāj al-Munīr',en:'The Illuminating Lamp',blessing:'A light by which people are guided.',ref:'Qur’an 33:46'},{ar:'خَاتَمُ النَّبِيِّين',tr:'Khātam an-Nabiyyīn',en:'Seal of the Prophets',blessing:'No prophet after him; the message is complete.',ref:'Qur’an 33:40 · Bukhari 3535'},{ar:'عَبْدُ اللَّهِ',tr:'ʿAbdullāh',en:'Servant of Allah',blessing:'His highest rank is servitude to Allah.',ref:'Qur’an 17:1 · 72:19'},{ar:'الْأُمِّيّ',tr:'Al-Ummī',en:'The Unlettered Prophet',blessing:'Did not read or write — a sign the Qurʾān is pure revelation.',ref:'Qur’an 7:157'},{ar:'طٰهٰ',tr:'Ṭā-Hā',en:'Ṭā-Hā',blessing:'Addressed in the Qurʾān; among names of affection in tafsīr.',ref:'Qur’an 20:1'},{ar:'يٰس',tr:'Yā-Sīn',en:'Yā-Sīn',blessing:'Addressed at the opening of Sūrat Yā-Sīn.',ref:'Qur’an 36:1'},{ar:'الْمُزَّمِّل',tr:'Al-Muzzammil',en:'The Enwrapped',blessing:'Addressed in the night of early revelation.',ref:'Qur’an 73:1'},{ar:'الْمُدَّثِّر',tr:'Al-Muddaththir',en:'The Cloaked',blessing:'Commanded: Arise and warn.',ref:'Qur’an 74:1–2'},{ar:'الصَّادِق',tr:'Aṣ-Ṣādiq',en:'The Truthful',blessing:'Known as truthful before and after prophethood.',ref:'Seerah · Bukhari'},{ar:'الْأَمِين',tr:'Al-Amīn',en:'The Trustworthy',blessing:'Trusted by Quraysh even when they opposed the message.',ref:'Seerah Ibn Hishām'},{ar:'الْحَبِيب',tr:'Al-Ḥabīb',en:'The Beloved',blessing:'Beloved of Allah; loving him is part of faith.',ref:'Bukhari 15 · Muslim 44'},{ar:'الشَّفِيع',tr:'Ash-Shafīʿ',en:'The Intercessor',blessing:'Granted the greatest intercession on the Day of Judgement.',ref:'Bukhari 4712 · Muslim 193'}];function loadProphetName(random){const box=document.getElementById('prophet-name-box');if(!box||!PROPHET_NAMES.length)return;let idx;if(random){idx=Math.floor(Math.random()*PROPHET_NAMES.length);}else{const day=Math.floor(Date.now()/86400000);idx=day%PROPHET_NAMES.length;}const n=PROPHET_NAMES[idx];box.innerHTML='<div class="asma-arabic">'+n.ar+'</div>'+'<div class="asma-translit">'+n.tr+' <span style="font-weight:500;opacity:0.75;font-size:0.9rem;">('+(idx+1)+'/'+PROPHET_NAMES.length+')</span></div>'+'<div class="asma-meaning">'+n.en+'</div>'+'<div class="asma-virtue"><strong>Blessing / meaning:</strong> '+n.blessing+'</div>'+'<div class="asma-ref">'+n.ref+' · Educational summary</div>';}function showAllProphetNames(){const list=document.getElementById('prophet-names-list');if(!list)return;list.style.display=list.style.display==='none'?'grid':'none';if(list.style.display!=='none')filterProphetNames((document.getElementById('prophet-names-search')||{}).value||'');}function filterProphetNames(q){const root=document.getElementById('prophet-names-list');if(!root)return;root.style.display='grid';const needle=(q||'').toLowerCase().trim();const items=PROPHET_NAMES.filter(function(n){if(!needle)return true;return(n.ar+' '+n.tr+' '+n.en+' '+n.blessing).toLowerCase().indexOf(needle)!==-1;});root.innerHTML=items.map(function(n,i){const realIdx=PROPHET_NAMES.indexOf(n);return'<div class="search-result prophet-name-card" style="cursor:pointer" onclick="loadProphetNameAt('+realIdx+')">'+'<div class="asma-arabic" style="font-size:1.25rem;margin-bottom:0.15rem;">'+n.ar+'</div>'+'<div><strong>'+n.tr+'</strong> — '+n.en+'</div>'+'<p style="font-size:0.88rem;margin:0.3rem 0;">'+n.blessing+'</p>'+'<div class="ref">'+n.ref+'</div></div>';}).join('')||'<p class="notes-hint">No matching name.</p>';}function loadProphetNameAt(i){if(!PROPHET_NAMES[i])return;const n=PROPHET_NAMES[i];const box=document.getElementById('prophet-name-box');if(!box)return;box.innerHTML='<div class="asma-arabic">'+n.ar+'</div>'+'<div class="asma-translit">'+n.tr+' <span style="font-weight:500;opacity:0.75;font-size:0.9rem;">('+(i+1)+'/'+PROPHET_NAMES.length+')</span></div>'+'<div class="asma-meaning">'+n.en+'</div>'+'<div class="asma-virtue"><strong>Blessing / meaning:</strong> '+n.blessing+'</div>'+'<div class="asma-ref">'+n.ref+' · Educational summary</div>';box.scrollIntoView({behavior:'smooth',block:'nearest'});}loadProphetName(false);const MASNOON_DUAS=[{tags:'opening prayer salah',ar:'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَىٰ جَدُّكَ وَلَا إِلَٰهَ غَيْرُكَ',en:'Glory be to You, O Allah, and praise. Blessed is Your Name, exalted is Your majesty, and there is no god but You.',ur:'اے اللہ! تو پاک ہے اور تیری حمد کے ساتھ۔ تیرا نام بابرکت ہے، تیری عظمت بلند ہے، اور تیرے سوا کوئی معبود نہیں۔',ref:'Abu Dawud 775 · Tirmidhi 243',benefit:'Opening of ṣalāh that glorifies Allah and affirms tawḥīd before recitation.'},{tags:'forgiveness istighfar repentance sayyid',ar:'أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',en:'I seek forgiveness from Allah, other than whom there is no god, the Ever-Living, the Self-Sustaining, and I repent to Him.',ur:'میں اس اللہ سے بخشش مانگتا ہوں جس کے سوا کوئی معبود نہیں، جو زندہ اور قائم ہے، اور میں اسی کی طرف توبہ کرتا ہوں۔',ref:'Abu Dawud 1517 · Tirmidhi 3577',benefit:'Called a master form of istighfār; reported that Allah forgives even one who says it while sins are like the foam of the sea (when said with sincerity).'},{tags:'morning evening adhkar',ar:'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',en:'O Allah, by You we enter the morning and by You the evening, by You we live and die, and to You is the resurrection.',ur:'اے اللہ! تیرے ساتھ ہم نے صبح کی اور تیرے ساتھ شام، تیرے ساتھ جیتے اور مرتے ہیں، اور تیری طرف ہی اٹھنا ہے۔',ref:'Tirmidhi 3391',benefit:'Morning adhkār that renews reliance on Allah for life, death, and the final rising.'},{tags:'anxiety distress worry sadness',ar:'لَا إِلَٰهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ لَا إِلَٰهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ',en:'There is no god but Allah, the Magnificent, the Forbearing. There is no god but Allah, Lord of the Tremendous Throne.',ur:'اللہ کے سوا کوئی معبود نہیں، جو عظیم اور بردبار ہے۔ اللہ کے سوا کوئی معبود نہیں، عرش عظیم کا رب۔',ref:'Bukhari 6346 · Muslim 2730',benefit:'Prophetic words of relief in distress; turns the heart from the problem to the Lord of the Throne.'},{tags:'parents mother father',ar:'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ',en:'My Lord, forgive me and my parents and the believers on the Day the account is established.',ur:'اے میرے رب! مجھے، میرے والدین کو اور اہل ایمان کو اس دن بخش دے جب حساب قائم ہوگا۔',ref:'Qur’an 14:41',benefit:'Qurʾānic duʿāʾ for self, parents, and all believers — continuous charity of the tongue.'},{tags:'travel journey',ar:'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ',en:'Glory be to Him who has subjected this to us, and we could not have done it by ourselves. And to our Lord we will surely return.',ur:'پاک ہے وہ ذات جس نے اس سواری کو ہمارے لیے مسخر کیا اور ہم اسے قابو میں نہ لا سکتے تھے، اور ہم اپنے رب کی طرف لوٹنے والے ہیں۔',ref:'Qur’an 43:13–14 · Muslim 1342',benefit:'Travel duʿāʾ: gratitude for means of transport and reminder of the return to Allah.'},{tags:'leaving home go out',ar:'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',en:'In the name of Allah, I place my trust in Allah; there is no power nor strength except with Allah.',ur:'اللہ کے نام سے، میں نے اللہ پر بھروسہ کیا، اور طاقت و قوت صرف اللہ ہی سے ہے۔',ref:'Abu Dawud 5095 · Tirmidhi 3426',benefit:'When said on leaving home, it is reported one is guided, sufficed, and protected.'},{tags:'after food meal',ar:'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَٰذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',en:'All praise is for Allah who fed me this and provided it without any power or might from myself.',ur:'تمام تعریف اس اللہ کے لیے ہے جس نے مجھے یہ کھلایا اور میری طاقت کے بغیر مجھے عطا کیا۔',ref:'Abu Dawud 4023 · Tirmidhi 3458',benefit:'Whoever says this after eating, his past sins are forgiven (as reported).'},{tags:'sleep night bedtime',ar:'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',en:'In Your name, O Allah, I die and I live.',ur:'اے اللہ! تیرے نام سے میں مرتا اور جیتا ہوں۔',ref:'Bukhari 6314',benefit:'Places sleep and waking under Allah’s name — a nightly renewal of tawḥīd.'},{tags:'waking up morning',ar:'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',en:'All praise is for Allah who gave us life after causing us to die, and to Him is the resurrection.',ur:'تمام تعریف اس اللہ کے لیے ہے جس نے ہمیں موت کے بعد زندگی دی اور اسی کی طرف اٹھنا ہے۔',ref:'Bukhari 6312',benefit:'First words on waking: praise for another day and reminder of the final rising.'},{tags:'anger control',ar:'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',en:'I seek refuge in Allah from the accursed Shayṭān.',ur:'میں شیطان مردود سے اللہ کی پناہ مانگتا ہوں۔',ref:'Bukhari 6115 · Muslim 2610',benefit:'The Prophet ﷺ taught this when anger rises — seeks refuge and cools the heart.'},{tags:'knowledge study',ar:'رَبِّ زِدْنِي عِلْمًا',en:'My Lord, increase me in knowledge.',ur:'اے میرے رب! میرے علم میں اضافہ فرما۔',ref:'Qur’an 20:114',benefit:'The only worldly increase the Prophet ﷺ was commanded to seek in the Qurʾān.'},{tags:'world hereafter hasanah',ar:'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',en:'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',ur:'اے ہمارے رب! ہمیں دنیا میں بھلائی دے اور آخرت میں بھلائی دے اور آگ کے عذاب سے بچا۔',ref:'Qur’an 2:201 · Bukhari 4522',benefit:'Among the most frequent duʿās of the Prophet ﷺ — balance of dunyā and ākhirah.'},{tags:'deceased dead funeral grave',ar:'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ',en:'O Allah, forgive him, have mercy on him, grant him well-being, and pardon him.',ur:'اے اللہ! اسے بخش، اس پر رحم فرما، اسے عافیت دے اور اسے معاف فرما۔',ref:'Muslim 963',benefit:'Core of the funeral prayer duʿāʾ — mercy for the deceased reaches by Allah’s permission.'},{tags:'guidance istiqamah heart',ar:'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَىٰ دِينِكَ',en:'O Turner of hearts, make my heart firm upon Your religion.',ur:'اے دلوں کو پھیرنے والے! میرے دل کو اپنے دین پر ثابت رکھ۔',ref:'Tirmidhi 2140',benefit:'The Prophet ﷺ often asked for a firm heart — the greatest provision for the grave.'},{tags:'protection evil harm',ar:'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',en:'I seek refuge in the perfect words of Allah from the evil of what He has created.',ur:'میں اللہ کے کامل کلمات کی پناہ لیتا ہوں اس کی مخلوق کے شر سے۔',ref:'Muslim 2708',benefit:'Whoever says it in the evening is protected from harm until morning (as reported).'},{tags:'mosque masjid enter',ar:'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',en:'O Allah, open for me the gates of Your mercy.',ur:'اے اللہ! میرے لیے اپنی رحمت کے دروازے کھول دے۔',ref:'Muslim 713',benefit:'Entering the mosque with a request for Allah’s mercy.'},{tags:'salawat prophet durood',ar:'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',en:'O Allah, send ṣalāh upon Muḥammad and his family as You sent ṣalāh upon Ibrāhīm and his family. You are Praiseworthy, Glorious.',ur:'اے اللہ! محمد اور آل محمد پر رحمت بھیج جیسے تو نے ابراہیم اور آل ابراہیم پر بھیجی۔ بیشک تو حمید و مجید ہے۔',ref:'Bukhari 3370 · Muslim 406',benefit:'Whoever sends ṣalāh upon the Prophet ﷺ once, Allah sends ṣalāh upon him tenfold.'},{tags:'bukhari muslim after salah tasbih',ar:'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ',en:'Glory be to Allah, all praise is for Allah, there is no god but Allah, and Allah is the Greatest.',ur:'اللہ پاک ہے، تمام تعریف اللہ کے لیے ہے، اللہ کے سوا کوئی معبود نہیں، اور اللہ سب سے بڑا ہے۔',ref:'Muslim 597 · Bukhari 6403',benefit:'More beloved to the Prophet ﷺ than all that the sun rises upon; heavy on the scales.'},{tags:'bukhari debt worry provision',ar:'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',en:'O Allah, suffice me with what You have made lawful against what You have forbidden, and make me independent by Your bounty of all others.',ur:'اے اللہ! اپنے حلال سے مجھے حرام سے بے نیاز کر دے، اور اپنے فضل سے مجھے تیرے سوا سب سے بے نیاز کر دے۔',ref:'Tirmidhi 3563',benefit:'Taught for relief from debt and worry — asks for ḥalāl sufficiency and independence through Allah.'},{tags:'muslim evening morning three times',ar:'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',en:'In the name of Allah, with whose name nothing on earth or in the heaven can cause harm, and He is the All-Hearing, the All-Knowing.',ur:'اللہ کے نام سے جس کے نام کے ساتھ زمین و آسمان میں کوئی چیز نقصان نہیں پہنچا سکتی، اور وہ سننے والا جاننے والا ہے۔',ref:'Abu Dawud 5088 · Tirmidhi 3388',benefit:'Said three times morning and evening — nothing harms the one who says it (as reported).'},{tags:'bukhari enter market',ar:'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ حَيٌّ لَا يَمُوتُ بِيَدِهِ الْخَيْرُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',en:'There is no god but Allah alone, without partner. His is the dominion and His is the praise. He gives life and causes death, and He is Ever-Living and does not die. In His hand is all good, and He is over all things competent.',ur:'اللہ کے سوا کوئی معبود نہیں، اکیلا، اس کا کوئی شریک نہیں۔ بادشاہی اور تعریف اسی کی ہے۔ وہ جلاتا اور مارتا ہے، زندہ ہے جو نہیں مرتا۔ بھلائی اسی کے ہاتھ میں ہے اور وہ ہر چیز پر قادر ہے۔',ref:'Tirmidhi 3428',benefit:'When entering the marketplace — great reward reported for affirming tawḥīd amid worldly distraction.'},{tags:'muslim after adhan',ar:'اللَّهُمَّ رَبَّ هَٰذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ',en:'O Allah, Lord of this perfect call and the prayer to be established, grant Muḥammad the wasīlah and excellence, and raise him to the praised station You promised him.',ur:'اے اللہ! اس کامل پکار اور قائم ہونے والی نماز کے رب، محمد ﷺ کو وسیلہ اور فضیلت عطا فرما، اور انہیں اس مقام محمود پر فائز فرما جس کا تو نے وعدہ کیا۔',ref:'Bukhari 614',benefit:'Whoever says this after the adhān, the Prophet’s ﷺ intercession becomes permissible for him on the Day of Judgement.'}];let lastMasnoonDua=null;let masnoonDuaCache=[];function searchMasnoonDua(){const q=((document.getElementById('dua-search')||{}).value||'').trim().toLowerCase();const el=document.getElementById('dua-results');if(!el)return;const gist=expandSearchQuery(q);const hits=MASNOON_DUAS.filter(function(d){if(!q)return true;const blob=(d.tags+' '+d.en+' '+d.ur+' '+d.ar+' '+d.ref+' '+(d.benefit||'')).toLowerCase();if(blob.indexOf(q)!==-1)return true;return gist.alts.some(function(a){return a&&blob.indexOf(a)!==-1;});}).slice(0,12);masnoonDuaCache=hits;if(!hits.length){el.innerHTML='<p>No matching masnūn duʿāʾ. Try another keyword or see <a href="https://sunnah.com" target="_blank" rel="noopener">sunnah.com</a>.</p>';return;}if(hits[0])lastMasnoonDua=hits[0];el.innerHTML='<p><strong>'+hits.length+'</strong> result(s):</p>'+hits.map(function(d,i){const ben=d.benefit?'<div class="ponder-box" style="margin-top:0.45rem;font-size:0.9rem;"><strong>Benefit / blessing:</strong> '+d.benefit+'</div>':'';return'<div class="search-result" id="dua-hit-'+i+'">'+'<div class="sr-ar">'+d.ar+'</div>'+'<p class="sr-en">'+d.en+'</p>'+'<p class="sr-ur">'+d.ur+'</p>'+'<div class="ref" style="font-weight:600;">'+d.ref+'</div>'+ben+'<div class="sr-actions"><button type="button" class="btn-soft" onclick="memeUseDuaIndex('+i+')">🖼️ Use in Meme</button></div></div>';}).join('');hits.forEach(function(d,i){enrichDuaBenefitOnline(d,i);});}function enrichDuaBenefitOnline(d,i){try{if(!navigator.onLine||!d||!d.ref)return;const slot=document.getElementById('dua-hit-'+i);if(!slot||slot.querySelector('.dua-online-note'))return;const note=document.createElement('p');note.className='dua-online-note notes-hint';note.style.marginTop='0.35rem';note.innerHTML='Further reading: <a href="https://sunnah.com/search?q='+encodeURIComponent((d.en||'').split(' ').slice(0,6).join(' '))+'" target="_blank" rel="noopener">Search related reports on Sunnah.com</a>';slot.appendChild(note);}catch(e){}}function memeUseDuaIndex(i){const d=masnoonDuaCache[i];if(!d)return;lastMasnoonDua=d;switchTab('reality');setTimeout(function(){const card=document.getElementById('meme-card');if(card)card.scrollIntoView({behavior:'smooth',block:'start'});memeFillFromDua();},200);}function memeFillFromDua(){const d=lastMasnoonDua;if(!d||!d.ar){alert('Search a masnūn duʿāʾ in the Search tab first, then tap “Use in Meme” or this button.');return;}const topEl=document.getElementById('meme-top-input');const midEl=document.getElementById('meme-mid-input');const botEl=document.getElementById('meme-bottom-input');if(topEl)topEl.value=String(d.ar||'').trim();if(midEl)midEl.value=String(d.en||'').trim();if(botEl)botEl.value=[String(d.ur||'').trim(),d.ref||''].filter(Boolean).join('\n');memeState.topY=0.11;memeState.midY=0.46;memeState.bottomY=0.82;memeState.font='arabic';const fontEl=document.getElementById('meme-font');if(fontEl)fontEl.value='arabic';memePositionBoxes();memeSyncFromInputs();try{memeAutoFitSizes();memeDraw();}catch(e){}}

/* ===== Clarity Audio (single pipeline) ===== */
var _caTok = 0;

function clarityStopAllAudio(){
  _caTok++;
  try{ if(window.speechSynthesis) speechSynthesis.cancel(); }catch(e){}
  try{
    var a = document.getElementById('verse-audio');
    if(a){ a.onended = null; a.onerror = null; a.pause(); a.removeAttribute('src'); }
  }catch(e){}
  try{
    document.querySelectorAll('.tts-active, .inline-tts[aria-pressed="true"], .ayah-audio-btn.playing, #hajj-audio-btn.playing').forEach(function(b){
      b.classList.remove('tts-active');
      b.classList.remove('playing');
      var p = b.getAttribute('data-label');
      if(p) b.textContent = p;
      try{ b.setAttribute('aria-pressed','false'); }catch(e){}
    });
  }catch(e){}
}
window.clarityStopAllAudio = clarityStopAllAudio;

function _caLang(code){
  code = String(code||'ar').toLowerCase();
  if(code.indexOf('ur')===0) return {code:'ur', bcp:'ur-PK'};
  if(code.indexOf('ar')===0) return {code:'ar', bcp:'ar-SA'};
  if(code.indexOf('en')===0) return {code:'en', bcp:'en-US'};
  if(code.indexOf('fr')===0) return {code:'fr', bcp:'fr-FR'};
  if(code.indexOf('tr')===0) return {code:'tr', bcp:'tr-TR'};
  if(code.indexOf('hi')===0) return {code:'hi', bcp:'hi-IN'};
  if(code.indexOf('id')===0) return {code:'id', bcp:'id-ID'};
  return {code:code.slice(0,2), bcp:code.slice(0,2)};
}
function _caDetect(text){
  text = String(text||'');
  var ur = (text.match(/[\u0679\u067E\u0686\u0688\u0691\u0698\u06A9\u06AF\u06BE\u06C1\u06C3\u06D2]/g)||[]).length;
  var ar = (text.match(/[\u0600-\u06FF]/g)||[]).length;
  var la = (text.match(/[A-Za-z]/g)||[]).length;
  if(ur>=1) return 'ur';
  if(ar>=3) return 'ar';
  if(la>=3) return 'en';
  return 'ar';
}
function _caPickVoice(langCode){
  try{
    if(!window.speechSynthesis) return null;
    var voices = speechSynthesis.getVoices()||[];
    if(!voices.length) return null;
    var L = _caLang(langCode);
    var want = L.code;
    var best = null, bestScore = -1;
    for(var i=0;i<voices.length;i++){
      var v = voices[i];
      var blob = ((v.name||'')+' '+(v.lang||'')).toLowerCase();
      var score = 0;
      if((v.lang||'').toLowerCase().indexOf(want)===0) score += 20;
      if(want==='ur' && /urdu/.test(blob)) score += 20;
      if(want==='ar' && /arabic/.test(blob)) score += 20;
      if(want==='en' && /english/.test(blob)) score += 15;
      if(score===0) continue;
      if(/google/.test(blob)) score += 10;
      if(/microsoft/.test(blob)) score += 6;
      if(/natural|neural|online|enhanced/.test(blob)) score += 4;
      if(score > bestScore){ bestScore = score; best = v; }
    }
    /* Urdu fallback: Arabic voice (shared script) better than English */
    if(!best && want==='ur') return _caPickVoice('ar');
    return best;
  }catch(e){ return null; }
}
function clarityPickVoice(lang){ return _caPickVoice(lang); }
function clarityPickArabicVoice(){ return _caPickVoice('ar'); }
window.clarityPickVoice = clarityPickVoice;

function _caBtnStart(btn){
  if(!btn) return '🔊';
  var prev = btn.getAttribute('data-label') || btn.textContent || '🔊';
  try{
    btn.setAttribute('data-label', prev);
    btn.classList.add('tts-active');
    /* Only change label for larger buttons; keep icon-only for .inline-tts */
    if(!btn.classList.contains('inline-tts')){
      btn.textContent = '🔊 …';
    }
    btn.setAttribute('aria-pressed','true');
  }catch(e){}
  return prev;
}
function _caBtnEnd(btn, prev){
  if(!btn) return;
  try{
    btn.classList.remove('tts-active');
    btn.classList.remove('playing');
    btn.textContent = prev || btn.getAttribute('data-label') || '🔊';
    btn.setAttribute('aria-pressed','false');
  }catch(e){}
}

/** TTS for non-verse text (duʿāʾ, Urdu, etc.) */
function clarityNaturalTTS(text, opts){
  opts = opts||{};
  text = String(text||'').replace(/\s+/g,' ').trim();
  if(!text) return false;
  var btn = opts.btn||null;
  var prev = _caBtnStart(btn);

  if(!window.speechSynthesis){
    _caBtnEnd(btn, prev);
    return false;
  }

  var my = ++_caTok;
  try{ speechSynthesis.cancel(); }catch(e){}

  var langCode = opts.lang || _caDetect(text);
  var L = _caLang(langCode);

  var parts = text.split(/(?<=[\u060C\u061B\u06D4.!?؟،؛\n,;])/).map(function(x){return x.trim();}).filter(Boolean);
  if(!parts.length) parts = [text];
  var chunks = [];
  parts.forEach(function(p){
    if(p.length<=140) chunks.push(p);
    else { for(var i=0;i<p.length;i+=140) chunks.push(p.slice(i,i+140)); }
  });

  var idx = 0;
  var tick = null;
  function done(){
    if(tick){ clearInterval(tick); tick=null; }
    if(my!==_caTok) return;
    _caBtnEnd(btn, prev);
  }
  function next(){
    if(my!==_caTok){ if(tick) clearInterval(tick); return; }
    if(idx>=chunks.length){ done(); return; }
    var u = new SpeechSynthesisUtterance(chunks[idx++]);
    u.lang = L.bcp;
    u.rate = opts.rate || 0.92;
    var voice = _caPickVoice(L.code);
    if(voice){ try{ u.voice = voice; if(voice.lang) u.lang = voice.lang; }catch(e){} }
    u.onend = function(){ next(); };
    u.onerror = function(){ next(); };
    try{ speechSynthesis.speak(u); }catch(e){ done(); }
  }
  function start(){
    next();
    tick = setInterval(function(){
      if(my!==_caTok){ clearInterval(tick); return; }
      try{
        if(speechSynthesis.speaking && speechSynthesis.paused) speechSynthesis.resume();
      }catch(e){}
    }, 300);
  }
  var voices = speechSynthesis.getVoices()||[];
  if(!voices.length){
    var n=0, w=setInterval(function(){
      n++;
      if((speechSynthesis.getVoices()||[]).length || n>20){ clearInterval(w); if(my===_caTok) start(); }
    }, 50);
  } else start();
  return true;
}
window.clarityNaturalTTS = clarityNaturalTTS;

/** Alafasy MP3 for sūrah:āyah */

function clarityFortifyAudioIcons(root){
  try{
    root = root || document;
    var nodes = root.querySelectorAll('.arabic-calligraphy, .dua-ar, .sr-ar, p.arabic, .rabbana-arabic');
    nodes.forEach(function(el){
      if(!el || el.querySelector('.inline-tts, .tts-body')) return;
      if(el.closest && el.closest('button,a,.meme-stage,#callig-canvas')) return;
      var text = (el.textContent||'').trim();
      if(!text || text.length < 6) return;
      var ar = (text.match(/[\u0600-\u06FF]/g)||[]).length;
      if(ar < 4) return;
      var ref = el.getAttribute('data-ref') || '';
      if(!ref && /14:41|Qur[\'']an 14:41/i.test(el.parentNode && el.parentNode.textContent || '')) ref = '14:41';
      el.innerHTML = '<span class="tts-body">' + text.replace(/</g,'') + '</span> ' +
        '<button type="button" class="inline-tts" data-label="🔊"' + (ref ? ' data-ref="'+ref+'"' : '') +
        ' title="' + (ref ? 'Arabic recitation' : 'Arabic TTS') + '" onclick="clarityInlineTTS(this,\'ar\')">🔊</button>';
      /* English sibling */
      var next = el.nextElementSibling;
      if(next && next.tagName === 'P' && !next.querySelector('.inline-tts') && !/arabic/i.test(next.className||'')){
        var en = (next.textContent||'').trim();
        if(en.length > 12 && /[A-Za-z]/.test(en)){
          next.innerHTML = '<span class="tts-body">' + next.innerHTML + '</span> ' +
            '<button type="button" class="inline-tts" data-label="🔊" title="English TTS" onclick="clarityInlineTTS(this,\'en\')">🔊</button>';
        }
      }
    });
  }catch(e){ console.warn('fortify audio', e); }
}
window.clarityFortifyAudioIcons = clarityFortifyAudioIcons;
try{
  if(document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', function(){ setTimeout(function(){ clarityFortifyAudioIcons(); }, 500); });
  else setTimeout(function(){ clarityFortifyAudioIcons(); }, 500);
  setTimeout(function(){ clarityFortifyAudioIcons(); }, 2000);
}catch(e){}

function clarityInlineTTS(btn, lang){
  try{
    lang = lang || 'en';
    if(lang === 'ar'){
      var ref = (btn && btn.getAttribute('data-ref')) || '';
      if(!ref){
        var host = btn && btn.closest && btn.closest('[data-ref]');
        if(host) ref = host.getAttribute('data-ref') || '';
      }
      if(ref && typeof playAyahAudio === 'function') return playAyahAudio(ref, btn);
      var arSpan = btn && btn.parentNode && btn.parentNode.querySelector('.tts-body');
      var arText = arSpan ? arSpan.textContent : '';
      return clarityNaturalTTS(arText, {btn: btn, lang: 'ar'});
    }
    var span = btn && btn.parentNode && btn.parentNode.querySelector('.tts-body');
    var text = span ? (span.textContent || '').trim() : '';
    if(!text && btn && btn.parentNode){
      var clone = btn.parentNode.cloneNode(true);
      var dead = clone.querySelectorAll('button,.inline-tts');
      for(var i=0;i<dead.length;i++) dead[i].remove();
      text = (clone.textContent || '').trim();
    }
    return clarityNaturalTTS(text, {btn: btn, lang: lang});
  }catch(e){ console.warn('inlineTTS', e); return false; }
}
window.clarityInlineTTS = clarityInlineTTS;

function claritySpeakLine(which, btn){
  try{
    which = which || 'en';
    var text = '';
    if(which==='ur'){
      var u = document.getElementById('cmd-ur-text') || document.querySelector('.verse-urdu');
      text = u ? (u.textContent||'') : '';
      if(!text && typeof currentCommandVerse==='object' && currentCommandVerse) text = currentCommandVerse.urdu||currentCommandVerse.ur||'';
      if(!text && typeof currentJourneyVerse==='object' && currentJourneyVerse) text = currentJourneyVerse.ur||'';
      return clarityNaturalTTS(text, {btn:btn, lang:'ur'});
    }
    if(which==='en'){
      var e = document.getElementById('cmd-en-text') || document.querySelector('.verse-en');
      text = e ? (e.textContent||'') : '';
      if(!text && typeof currentCommandVerse==='object' && currentCommandVerse) text = currentCommandVerse.english||currentCommandVerse.en||'';
      if(!text && typeof currentJourneyVerse==='object' && currentJourneyVerse) text = currentJourneyVerse.en||'';
      return clarityNaturalTTS(text, {btn:btn, lang:'en'});
    }
    if(which==='ar'){
      var a = document.querySelector('.arabic-calligraphy[data-ref], .arabic-calligraphy');
      text = a ? (a.textContent||'') : '';
      var ref = (a && a.getAttribute('data-ref')) || '';
      if(ref && typeof playAyahAudio==='function') return playAyahAudio(ref, btn);
      return clarityNaturalTTS(text, {btn:btn, lang:'ar'});
    }
  }catch(err){ console.warn('speakLine', err); }
  return false;
}
window.claritySpeakLine = claritySpeakLine;

function playAyahAudio(ref, btnEl){
  var surah=1, ayah=1;
  if(typeof ref==='string' && ref.indexOf(':')!==-1){
    var p = ref.replace(/^Qur[^\d]*/i,'').split(':');
    surah = parseInt(p[0],10)||1; ayah = parseInt(p[1],10)||1;
  } else if(ref && typeof ref==='object'){
    surah = ref.surah||ref.s||1; ayah = ref.ayah||ref.a||1;
  }
  var audio = document.getElementById('verse-audio');
  if(!audio){
    audio = document.createElement('audio');
    audio.id = 'verse-audio';
    audio.preload = 'none';
    document.body.appendChild(audio);
  }
  var btn = btnEl||null;
  var prev = _caBtnStart(btn);
  try{ speechSynthesis.cancel(); }catch(e){}
  try{ audio.pause(); }catch(e){}
  _caTok++;
  var file = String(surah).padStart(3,'0')+String(ayah).padStart(3,'0')+'.mp3';
  var url = 'https://everyayah.com/data/Alafasy_128kbps/'+file;
  audio.onended = function(){ _caBtnEnd(btn, prev); };
  audio.onerror = function(){
    _caBtnEnd(btn, prev);
    try{ window.open('https://quran.com/'+surah+'/'+ayah,'_blank'); }catch(e){}
  };
  audio.src = url;
  var pr = audio.play();
  if(pr && pr.catch) pr.catch(function(){ _caBtnEnd(btn, prev); });
  return true;
}
window.playAyahAudio = playAyahAudio;
window.clarityStreamAyah = function(ref,btn){ return playAyahAudio(ref,btn); };

function clarityPlayRecitation(surah, ayah, btn){
  surah = parseInt(surah,10)||0; ayah = parseInt(ayah,10)||0;
  if(surah>=1 && ayah>=1) return playAyahAudio(surah+':'+ayah, btn);
  return false;
}
window.clarityPlayRecitation = clarityPlayRecitation;

try{
  if(window.speechSynthesis){
    speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged = function(){ speechSynthesis.getVoices(); };
  }
}catch(e){}

window.clarityStopStream=function(){
  ['verse-audio','quran-audio'].forEach(function(id){
    var a=document.getElementById(id);if(!a)return;
    try{a.pause();a.removeAttribute('src');a.load();}catch(e){}
  });
  document.querySelectorAll('.verse-audio-btn.playing,.clarity-stream-btn.playing,#hajj-audio-btn.playing,#hifz-audio-btn.playing').forEach(function(b){
    b.classList.remove('playing');
    var prev=b.getAttribute('data-label');if(prev)b.textContent=prev;
  });
};

async function playCurrentVerseAudio(){
  try{
    var v = currentJourneyVerse;
    var btn = document.getElementById('verse-audio-btn');
    if(!v || !v.surah){ if(typeof loadVerse==='function') await loadVerse(); v = currentJourneyVerse; }
    var surah = (v && v.surah) || 1;
    var ayah = (v && v.ayah) || 1;
    return playAyahAudio({surah:surah, ayah:ayah}, btn);
  }catch(e){ console.warn(e); return false; }
}function playHifzAudio(){const s=document.getElementById('hifz-surah');const a=document.getElementById('hifz-ayah-num');const btn=document.getElementById('hifz-audio-btn');const surah=s?parseInt(s.value,10):1;const ayah=a?parseInt(a.value,10):1;return playAyahAudio({surah:surah,ayah:ayah},btn);}function notesExport(){try{const raw=clarityLS.getItem(NOTES_KEY)||'{"notes":[]}';const blob=new Blob([raw],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='clarity-notes-'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(a.href);}catch(e){alert('Could not export notes.');}}function notesImport(ev){const file=ev.target&&ev.target.files&&ev.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=function(e){try{const data=JSON.parse(e.target.result);/* Full NurOS package? */if(data&&data.data&&(data.os==='NurOS'||data.version)){if(window.NurOS&&typeof NurOS.importPackage==='function'){ev.target.files=ev.target.files;/* re-dispatch via vault */}if(confirm('This looks like a full NurOS Amana package. Open Vault import instead?')){if(window.NurOS)NurOS.openVault();alert('Use Amana Vault → Import package and select this file again.');}ev.target.value='';return;}if(!data||!Array.isArray(data.notes))throw new Error('Invalid file');if(!confirm('Replace current notes with imported library ('+data.notes.length+' notes)?'))return;clarityLS.setItem(NOTES_KEY,JSON.stringify(data));notesLoad();alert('Notes imported.');}catch(err){alert('Invalid notes file.');}};reader.readAsText(file);ev.target.value='';}function cycleTextSize(){const html=document.documentElement;const order=['','large-text','xlarge-text'];let cur='';if(html.classList.contains('xlarge-text'))cur='xlarge-text';else if(html.classList.contains('large-text'))cur='large-text';const next=order[(order.indexOf(cur)+1)%order.length];html.classList.remove('large-text','xlarge-text');if(next)html.classList.add(next);clarityLS.setItem('clarity_text_size',next);const btn=document.getElementById('text-size-btn');if(btn)btn.textContent=next==='xlarge-text'?'A++':next==='large-text'?'A+':'A';}(function restoreTextSize(){const s=clarityLS.getItem('clarity_text_size')||'';if(s)document.documentElement.classList.add(s);const btn=document.getElementById('text-size-btn');if(btn)btn.textContent=s==='xlarge-text'?'A++':s==='large-text'?'A+':'A';})();const UI_STRINGS={en:{tab_journey:'Journey',tab_commands:'Commands',tab_tafseer:'Tafseer',tab_tajweed:'Tajweed',tab_seerah:'Seerah',tab_lectures:'Lectures',tab_grave:'Grave',tab_search:'Guidance',tab_search_short:'Guidance',tab_notes:'Fiqh tools',tab_about:'Meme & Notes',one_action:'One action today',do_it:'Do it',offline_pack:'Offline pack',subtitle:'Furnish your grave • Prepare for the long stay',weekly_title:'📊 This week’s light',weekly_desc:'A quiet accounting — what you sent ahead (this device only).',night_title:'🕯️ If I die tonight…',night_hint:'The Prophet ﷺ said: “Remember often the destroyer of pleasures (death).” Let the question soften the heart — then act once.',night_act:'I will do one deed now',night_another:'Another question',my_journey:'My Journey',enter_name:'Enter your name to personalize (saved only on this device).',name_ph:'Your name',save_name:'Save Name',lesson_title:'Today’s Character Lesson',new_lesson:'New lesson',save_bm:'🔖 Save',verse_title:'A Verse from the Quran',another_verse:'Another verse',listen:'🔊 Listen',life_title:'Life Events Guidance',seerah_moment:'Daily Seerah Moment',furnish_grave:'Furnishing My Grave',furnish_desc:'The grave is a long stay. Every istighfar and salawat can be sent ahead as light and companionship.',benefits_title:'What Benefits the Deceased in the Grave — From the Scholars',about_title:'About Clarity',notes_title:'📝 Clarity Notes',notes_desc:'A quiet place to write, remember, and send light ahead. Notes stay on this device — nothing is uploaded. Tag by section, write in Markdown, and optionally mark a reflection for the grave.',disclaimer:'<strong>Educational only — not a fatwa.</strong> Summaries below reflect mainstream Sunni discussions. For a particular case (inheritance, vows, disputes), consult a qualified local scholar. Clarity does not issue rulings.',about_intro:'Clarity is a local-first companion to help you <strong>prepare the heart and the grave</strong> — with Quran, authentic Hadith, character lessons, and small daily deeds. It is not a full Quran library, prayer engine, or fatwa service.',about_disc:'<strong>Educational only.</strong> For personal rulings, consult a qualified scholar.',hifz_goal:'Hifz goal today',daily_reminder:'Daily reminder to return & furnish the grave',another_life:'Another life event',saved_device:'Saved on this device.',quick_reflect:'📓 Quick reflection',quick_reflect_desc:'Capture one thought from today’s journey. It opens in Notes, tagged Journey.',note_journey:'＋ Note from Journey',capture_seerah:'📖 Capture a seerah lesson',capture_seerah_desc:'After reading a moment from the Prophet’s life ﷺ, write one lesson and one action.',seerah_hadith:'Seerah & Hadith',another_moment:'Another moment',seerah_tl:'📜 Seerah timeline (key milestones)',seerah_tl_desc:'A simple chronological map of the Prophet’s life ﷺ — for orientation, not a full biography.',hadith_title:'A Saying of the Prophet ﷺ',daily_zikr:'Daily Zikr',prophet_stories:'Stories of the Prophets',prev_nations:'Lessons from Previous Nations',tajweed_title:'🔤 Tajweed Learning Path (Hafs ʿan ʿĀṣim)',lectures_title:'Lectures & Series',tafseer_res:'Tafseer Resources',commands_title:'Allah’s Commands to the Believers',hifz_title:'Quran Memorization (Hifz) — Light for the Grave',note_grave:'🌙 Note for the grave',note_grave_desc:'Write a deed, istighfar intention, or duʿāʾ you want to send ahead. Tagged Grave and marked as light.',send_note:'＋ Send a note ahead',istighfar_today:'Istighfar today',salawat_today:'Salawat today',grave_intention:'<strong>Today’s intention:</strong> I am sending these deeds to my grave as companions and light.',reset_counts:'Reset today’s counts',burial_title:'Preparing the Deceased & Islamic Burial — Process & Resources',search_quran:'📖 Search the Quran',search_hadith:'📚 Search Authentic Hadith',search_life:'🧭 Search Life Events / Hadith',common_q:'Common Questions',ask_grok:'✨ Ask Grok',suggest_title:'Suggest an Improvement',meme_title:'🖼️ Meme Studio'},ur:{tab_journey:'سفر',tab_commands:'احکامات',tab_tafseer:'تفسیر',tab_tajweed:'تجوید',tab_seerah:'سیرت',tab_lectures:'لیکچرز',tab_grave:'قبر',tab_search:'تلاش و سوال',tab_search_short:'تلاش',tab_notes:'فقہی اوزار',tab_about:'میم و نوٹس',one_action:'آج کا ایک عمل',do_it:'ابھی کریں',offline_pack:'آف لائن پیک',subtitle:'اپنی قبر سجاؤ • لمبے قیام کی تیاری',weekly_title:'📊 اس ہفتے کی روشنی',weekly_desc:'خاموش حساب — جو آپ نے آگے بھیجا (صرف اسی آلہ پر)۔',night_title:'🕯️ اگر آج رات میری وفات ہو جائے…',night_hint:'نبی ﷺ نے فرمایا: ”لذتوں کو ختم کرنے والی (موت) کو کثرت سے یاد کرو۔“ سوال دل نرم کرے — پھر ایک عمل کریں۔',night_act:'میں اب ایک عمل کروں گا',night_another:'دوسرا سوال',my_journey:'میرا سفر',enter_name:'اپنا نام لکھیں (صرف اسی آلہ پر محفوظ)۔',name_ph:'آپ کا نام',save_name:'نام محفوظ کریں',lesson_title:'آج کا کردار سبق',new_lesson:'نیا سبق',save_bm:'🔖 محفوظ',verse_title:'قرآن مجید کی ایک آیت',another_verse:'دوسری آیت',listen:'🔊 سنیں',life_title:'زندگی کے واقعات کی رہنمائی',seerah_moment:'روزانہ سیرت لمحہ',furnish_grave:'میری قبر کی تیاری',furnish_desc:'قبر لمبا قیام ہے۔ ہر استغفار اور درود آگے روشنی اور رفاقت بن کر جا سکتا ہے۔',benefits_title:'قبر میں میت کو کیا فائدہ پہنچتا ہے — علماء کی روشنی میں',about_title:'کلیئرٹی کا تعارف',notes_title:'📝 کلیئرٹی نوٹس',notes_desc:'لکھنے، یاد رکھنے اور آگے روشنی بھیجنے کی خاموش جگہ۔ نوٹس اسی آلہ پر رہتے ہیں — کچھ اپ لوڈ نہیں ہوتا۔',disclaimer:'<strong>صرف تعلیمی — فتویٰ نہیں۔</strong> نیچے کا خلاصہ سنی مکتب فکر کی عام بحث پر مبنی ہے۔ مخصوص معاملے میں مقامی مستند عالم سے رجوع کریں۔ کلیئرٹی فتویٰ نہیں دیتی۔',about_intro:'کلیئرٹی ایک مقامی ساتھی ہے جو <strong>دل اور قبر کی تیاری</strong> میں مدد کرتا ہے — قرآن، صحیح احادیث، کردار کے اسباق اور روزمرہ چھوٹے اعمال کے ساتھ۔ یہ مکمل قرآن لائبریری، نماز ایپ یا فتویٰ سروس نہیں۔',about_disc:'<strong>صرف تعلیمی۔</strong> ذاتی احکام کے لیے مستند عالم سے رجوع کریں۔',hifz_goal:'آج کا حفظ ہدف',daily_reminder:'روزانہ یاد دہانی — واپس آؤ اور قبر سجاؤ',another_life:'دوسرا واقعہ',bookmarks:'آپ کی محفوظ چیزیں',saved_device:'صرف اسی آلہ پر محفوظ۔',quick_reflect:'📓 فوری غور',quick_reflect_desc:'آج کے سفر سے ایک خیال لکھیں۔ نوٹس میں ٹیگ: سفر۔',note_journey:'＋ سفر سے نوٹ',capture_seerah:'📖 سیرت کا سبق محفوظ کریں',capture_seerah_desc:'نبی ﷺ کی زندگی کا ایک لمحہ پڑھنے کے بعد ایک سبق اور ایک عمل لکھیں۔',seerah_hadith:'سیرت و حدیث',another_moment:'دوسرا لمحہ',seerah_tl:'📜 سیرت کی ٹائم لائن (اہم سنگ میل)',seerah_tl_desc:'نبی ﷺ کی زندگی کا سادہ زمانی نقشہ — مکمل سیرت نہیں، صرف رخ دکھانے کے لیے۔',hadith_title:'نبی ﷺ کا ایک فرمان',daily_zikr:'روزانہ ذکر',prophet_stories:'انبیاء کے قصے',prev_nations:'پچھلی امتوں سے سبق',tajweed_title:'🔤 تجوید سیکھنے کا راستہ (حفص عن عاصم)',lectures_title:'لیکچرز اور سلسلے',tafseer_res:'تفسیر کے وسائل',commands_title:'ایمان والوں کو اللہ کے احکام',hifz_title:'قرآن حفظ — قبر کے لیے روشنی',note_grave:'🌙 قبر کے لیے نوٹ',note_grave_desc:'ایک عمل، استغفار یا دعا لکھیں جو آپ آگے بھیجنا چاہتے ہیں۔ ٹیگ: قبر۔',send_note:'＋ آگے نوٹ بھیجیں',istighfar_today:'آج کا استغفار',salawat_today:'آج کا درود',grave_intention:'<strong>آج کی نیت:</strong> میں یہ اعمال اپنی قبر کی طرف رفاقت اور روشنی کے طور پر بھیج رہا/رہی ہوں۔',reset_counts:'آج کے شمار دوبارہ صفر کریں',burial_title:'میت کی تیاری اور اسلامی تدفین — عمل اور وسائل',search_quran:'📖 قرآن تلاش کریں',search_hadith:'📚 مستند حدیث تلاش کریں',search_life:'🧭 زندگی کے واقعات / حدیث تلاش',common_q:'عام سوالات',ask_grok:'✨ گروک سے پوچھیں',suggest_title:'بہتری کی تجویز',meme_title:'🖼️ میم اسٹوڈیو'}};const ONE_ACTIONS_UR=[{id:'istighfar',text:'دس بار استغفراللہ کہیں اور اسے اپنی قبر کی طرف بھیجیں۔'},{id:'salawat',text:'نبی ﷺ پر دس بار درود بھیجیں۔'},{id:'command',text:'احکامات کھولیں اور ایک آیت پر عمل کا ارادہ کریں۔'},{id:'verse',text:'آج کی آیت غور سے پڑھیں، پھر اس کا ایک عمل کریں۔'},{id:'hifz',text:'ایک آیت معنی کے ساتھ یاد کریں یا دہرائیں۔'},{id:'note',text:'نوٹس میں قبر کے لیے ایک سطر لکھیں۔'},{id:'parent',text:'والدین کو فون/میسج کریں یا ان کے لیے دعا کریں۔'},{id:'sadaqah',text:'چھوٹا صدقہ دیں — مسکراہٹ بھی صدقہ ہے۔'},{id:'night',text:'پوچھیں: اگر آج رات وفات ہو جائے تو کیا آگے بھیجا؟ پھر ایک عمل۔'}];function setUILang(lang){lang=lang==='ur'?'ur':'en';clarityLS.setItem('clarity_lang',lang);document.documentElement.lang=lang==='ur'?'ur':'en';document.documentElement.dir='ltr';document.documentElement.classList.toggle('lang-ur',lang==='ur');const pack=UI_STRINGS[lang]||UI_STRINGS.en;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.getAttribute('data-i18n');if(pack[k]!=null)el.textContent=pack[k];});document.querySelectorAll('[data-i18n-html]').forEach(el=>{const k=el.getAttribute('data-i18n-html');if(pack[k]!=null)el.innerHTML=pack[k];});document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{const k=el.getAttribute('data-i18n-placeholder');if(pack[k]!=null)el.setAttribute('placeholder',pack[k]);});const sel=document.getElementById('lang-select');if(sel)sel.value=lang;try{if(typeof currentOneAction!=='undefined'&&currentOneAction){if(lang==='ur'){const u=ONE_ACTIONS_UR.find(a=>a.id===currentOneAction.id);const el=document.getElementById('one-action-text');if(el&&u)el.textContent=u.text;}else{const el=document.getElementById('one-action-text');if(el&&currentOneAction.text)el.textContent=currentOneAction.text;}}}catch(e){}try{if(typeof refreshVerseLanguage==='function')refreshVerseLanguage();}catch(e){}try{if(typeof currentCommandVerse!=='undefined'&&currentCommandVerse&&currentCommandVerse.arabic&&typeof loadCommand==='function'){loadCommand();}}catch(e){}}const _refreshOneAction=refreshOneAction;refreshOneAction=function(){_refreshOneAction();if((clarityLS.getItem('clarity_lang')||'en')==='ur'){const u=ONE_ACTIONS_UR.find(a=>a.id===currentOneAction.id);const el=document.getElementById('one-action-text');if(el&&u)el.textContent=u.text;}};setUILang(clarityLS.getItem('clarity_lang')||'en');function buildShareLight(){const name=clarityLS.getItem('clarity_name')||'a friend';const ist=typeof getDepositCount==='function'?getDepositCount('istighfar'):0;const text=`Assalamu alaikum — a gentle reminder from Clarity:\n\nThe grave is a long stay. Today I am trying to send light ahead (istighfār: ${ist}).\n\n“Remember often the destroyer of pleasures (death).”\n\nMay Allah make our ending good. Āmīn.\n\n— ${name}`;const ta=document.getElementById('share-light-text');if(ta)ta.value=text;}function copyShareLight(){buildShareLight();const ta=document.getElementById('share-light-text');if(!ta)return;ta.select();navigator.clipboard.writeText(ta.value).then(()=>alert('Copied — share with adab.')).catch(()=>{});}buildShareLight();let deferredInstall=null;window.addEventListener('beforeinstallprompt',(e)=>{e.preventDefault();deferredInstall=e;const btn=document.getElementById('install-pwa-btn');if(btn)btn.classList.add('show');});function installPWA(){if(!deferredInstall){alert('Use your browser menu: “Add to Home Screen” / Install app.');return;}deferredInstall.prompt();deferredInstall.userChoice.finally(()=>{deferredInstall=null;});}if(typeof loadCommand==='function'){const _lc=loadCommand;loadCommand=async function(){await _lc();if(currentCommandVerse&&currentCommandVerse.arabic){try{offlineCacheSet('command',currentCommandVerse);}catch(e){}}};}try{if(typeof loadAllTabCounts==='function')loadAllTabCounts();}catch(e){}function clarityUftBoot(){try{var pv=document.getElementById('uft-preview');if(pv)pv.dataset.zoomBound='';if(typeof uftZoomInit==='function')uftZoomInit();}catch(e){}try{if(typeof uftRender==='function'&&document.getElementById('uft-preview')){var notes=document.getElementById('tab-notes');if(notes&&notes.classList.contains('active'))uftRender({keepScroll:true});}}catch(e2){}}if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',clarityUftBoot);}else{setTimeout(clarityUftBoot,0);}window.addEventListener('load',function(){setTimeout(clarityUftBoot,50);});

var HAJJ_KEY='clarity_hajj_p',HAJJ_TALB='clarity_hajj_t';
var HAJJ_STEPS=[
{id:'prep',img:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/800px-Kaaba_Masjid_Haraam_Makkah.jpg',title:'📋 0. Prepare before travel',day:'Weeks before',level:'Prep',
fiqh:'Hajj is farḍ once in a lifetime on every adult Muslim who is free, sane, and able (istiṭāʿah): physical ability, a safe route, and sufficient funds for the journey and dependents left behind. Settle debts you can, seek forgiveness from those you wronged, leave written instructions, and learn your nusk (Tamattuʿ, Qirān, or Ifrād). Women must travel with a maḥram according to the stronger classical view; follow the fatwa of the scholars you trust and the rules of the host country.',
do:['Confirm istiṭāʿah and funds for dependents','Study pillars vs wājibāt vs sunan','Choose nusk with your group scholar','Pack iḥrām, comfortable footwear, basic medicines','Memorise Talbiyah and key duʿās'],
avoid:['Travel while neglecting debts you could settle','Ignoring health vaccinations and visa rules','Learning only on the plane'],
note:'Ability (istiṭāʿah) is a condition for the obligation to be due — not a licence to delay once you are truly able. Many scholars urge performing Hajj as soon as you can.',
dua_ar:'اللَّهُمَّ إِنِّي أُرِيدُ الْحَجَّ فَيَسِّرْهُ لِي وَتَقَبَّلْهُ مِنِّي',
dua_en:'O Allah, I intend Hajj; make it easy for me and accept it from me.',
refs:'IslamQA 31822 · Quran 3:97 · haj.gov.sa',
links:[{t:'IslamQA — Description of Hajj',u:'https://islamqa.info/en/answers/31822'},{t:'Ministry of Hajj',u:'https://haj.gov.sa/en/Hajj'}]},
{id:'ihram',img:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/800px-Kaaba_Masjid_Haraam_Makkah.jpg',title:'🧵 1. Iḥrām at the mīqāt',path:'Ghusl · mīqāt intention · Talbiyah · know the prohibitions.',learn:'Iḥrām strips worldly status — two cloths, one intention. Notice how equality before Allah begins at the mīqāt.',day:'At / before mīqāt',level:'Pillar',
fiqh:'Iḥrām is the state of sacred restriction and is a pillar. Enter it at or before your mīqāt (for most air travellers, often in the aircraft before flying over the mīqāt — follow the airline announcement and your guide). Men wear two unsewn cloths; women wear ordinary modest clothes without niqāb/gloves in iḥrām. Make ghusl if able, apply perfume to the body before the intention (men), then make the intention for your nusk and begin the Talbiyah. Learn the prohibitions: perfume after iḥrām, cutting hair/nails, sewn garments for men, hunting, marriage contracts, and intimacy.',
do:['Ghusl and cleanliness before intention','Intention matching your nusk (Tamattuʿ/Qirān/Ifrād)','Talbiyah aloud for men, softly for women','Know your mīqāt and do not pass it without iḥrām'],
avoid:['Crossing the mīqāt deliberately without iḥrām','Perfume on clothes after entering iḥrām','Confusion about women’s iḥrām clothing'],
note:'If you pass the mīqāt without iḥrām, most scholars require returning to it or offering a sacrifice — ask immediately.',
dua_ar:'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ',
dua_en:'Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Indeed all praise, favour and dominion are Yours. You have no partner.',
refs:'Bukhari · Muslim · IslamQA 11356',
links:[{t:'IslamQA — Prohibitions of iḥrām',u:'https://islamqa.info/en/answers/11356'},{t:'IslamQA — Mīqāt rules',u:'https://islamqa.info/en/answers/41959'}]},
{id:'makkah',img:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/800px-Kaaba_Masjid_Haraam_Makkah.jpg',title:'🕌 2. Enter Makkah & first rites',day:'Arrival',level:'Adab + ʿUmrah (Tamattuʿ)',
fiqh:'Enter the Ḥaram with humility. For Tamattuʿ: perform ʿUmrah first — ṭawāf, two rakʿahs if possible, saʿī, then shorten or shave the hair and exit iḥrām until the 8th of Dhul-Ḥijjah. For Qirān/Ifrād: you remain in iḥrām; ṭawāf al-qudūm is sunnah. Drink Zamzam and make duʿāʾ. Avoid harming others in crowds.',
do:['Enter with calm and dhikr','Complete ʿUmrah if on Tamattuʿ','Rest and hydrate','Note the location of your camp / hotel'],
avoid:['Pushing in the maṭāf','Wasting energy before ʿArafah','Exiting iḥrām incorrectly on Qirān/Ifrād'],
note:'Crowd management is part of worship — the Prophet ﷺ taught gentleness. Your safety and others’ safety are part of istiṭāʿah.',
dua_ar:'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
dua_en:'O Allah, open for me the gates of Your mercy.',
refs:'Muslim 713 · IslamQA 31819',
links:[{t:'IslamQA — How to perform ʿUmrah',u:'https://islamqa.info/en/answers/31819'},{t:'IslamQA — Types of Hajj',u:'https://islamqa.info/en/answers/109325'}]},
{id:'tawaf',img:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/800px-Kaaba_Masjid_Haraam_Makkah.jpg',title:'🔄 3. Ṭawāf (seven circuits)',path:'Wuḍūʾ · Black Stone line · seven circuits · calm dhikr · two rakʿahs if able.',learn:'Each circuit faces the Kaʿbah as the centre of tawḥīd. Keep your gaze and heart soft; crowding is a test of character.',day:'ʿUmrah / Ifāḍah / Wadāʿ',level:'Pillar when Ifāḍah',
fiqh:'Ṭawāf is seven circuits with the Kaʿbah on your left, beginning at the Black Stone line (or its marker). Intention matters; purity (wuḍūʾ) is required by the majority. Men may uncover the right shoulder (iḍṭibāʿ) in arrival ṭawāf of ʿUmrah/Hajj and walk with strength (ramal) in the first three circuits if able and not harming others. After ṭawāf, pray two rakʿahs if possible (behind Maqām Ibrāhīm is ideal but not required if crowded). Ṭawāf al-ifāḍah is a pillar of Hajj.',
do:['Keep count carefully','Maintain wuḍūʾ (majority view)','Make personal duʿāʾ — no fixed text required each step','Two rakʿahs after if reasonably possible'],
avoid:['Cutting across circuits and losing count','Harming others to touch the Black Stone','Believing every step needs a specific narrated formula'],
note:'Touching or kissing the Black Stone is sunnah when easy; pointing toward it with the right hand and saying Allāhu akbar is enough when crowded.',
dua_ar:'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
dua_en:'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire. (2:201)',
refs:'Quran 2:201 · IslamQA 31822 · Bukhari',
links:[{t:'IslamQA — Description of ṭawāf',u:'https://islamqa.info/en/answers/109291'}]},
{id:'sai',img:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg/800px-Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg',title:'🚶 4. Saʿī between Ṣafā and Marwah',path:'Start at Ṣafā · seven legs · duʿāʾ on the mounts · patience in the lane.',day:'After ṭawāf',level:'Wājib / pillar (schools differ)',
fiqh:'Saʿī is seven legs beginning at Ṣafā and ending at Marwah. Climb Ṣafā, face the Kaʿbah, make takbīr and the duʿāʾ of the Prophet ﷺ if able, then walk to Marwah (men run between the green markers if able). Pure intention; wuḍūʾ is preferred. For Tamattuʿ, saʿī of ʿUmrah is done with ʿUmrah; saʿī of Hajj follows ṭawāf al-ifāḍah.',
do:['Start at Ṣafā with Quran 2:158','Complete seven legs (Ṣafā→Marwah is one)','Duʿāʾ at Ṣafā and Marwah'],
avoid:['Starting at Marwah','Counting errors','Unnecessary roughness in the lane'],
note:'Wheelchairs and upper levels are valid when needed — hardship is lifted.',
dua_ar:'إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ',
dua_en:'Indeed, Ṣafā and Marwah are among the symbols of Allah. (2:158)',
refs:'Quran 2:158 · Muslim · IslamQA',
links:[{t:'IslamQA — Saʿī',u:'https://islamqa.info/en/answers/109295'}]},
{id:'tarwiyah',img:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Mount_Arafat.jpg/800px-Mount_Arafat.jpg',title:'⛺ 5. 8th Dhul-Ḥijjah — Tarwiyah (Mina)',day:'8 Dhul-Ḥijjah',level:'Sunnah (strongly practised)',
fiqh:'On the 8th, enter iḥrām for Hajj if you exited after ʿUmrah (Tamattuʿ). Proceed to Mina, stay the night, and pray shortened prayers without combining (according to the common practice). Use the day to rest, review the rites of ʿArafah, and keep the Talbiyah frequent.',
do:['Iḥrām for Hajj (Tamattuʿ) from Makkah','Stay Mina','Hydrate and rest for ʿArafah','Talbiyah often'],
avoid:['Exhausting optional wandering','Neglecting water and shade'],
note:'The night in Mina before ʿArafah is sunnah; the focus is readiness for the pillar of ʿArafah.',
dua_ar:'لَبَّيْكَ اللَّهُمَّ حَجًّا',
dua_en:'Here I am, O Allah, for Hajj.',
refs:'IslamQA 31822 · haj.gov.sa',
links:[{t:'IslamQA — Days of Hajj',u:'https://islamqa.info/en/answers/31822'}]},
{id:'arafah',img:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Mount_Arafat.jpg/800px-Mount_Arafat.jpg',title:'⛰️ 6. 9th — ʿArafah (the pillar)',path:'Stand within the boundary · combine Ẓuhr & ʿAṣr · tawbah until sunset · protect the pillar.',learn:'ʿArafah is the heart of Hajj — stand in duʿāʾ as if it is your last chance. The Prophet ﷺ spent the afternoon in humble pleading until sunset.',day:'9 Dhul-Ḥijjah',level:'Pillar',
fiqh:'The Prophet ﷺ said: “Hajj is ʿArafah.” Being within the boundaries of ʿArafah in the required time is the central pillar. The best is to stay from after Ẓuhr until sunset in duʿāʾ, dhikr, and tawbah. Combine Ẓuhr and ʿAṣr at ʿArafah (as the Prophet ﷺ did). Do not leave before sunset according to the majority. Avoid the valley of ʿUrnah (outside the boundary).',
do:['Confirm you are inside the boundary','Combine Ẓuhr & ʿAṣr','Abundant duʿāʾ and ṣalawāt','Keep wuḍūʾ as much as possible','Stay until sunset (majority)'],
avoid:['Leaving before sunset without a justified scholarly position you follow','Wasting the afternoon on idle talk','Standing in ʿUrnah thinking it is ʿArafah'],
note:'Even a brief presence in the valid time can fulfil the pillar; the afternoon devoted to duʿāʾ is the treasure of Hajj.',
dua_ar:'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
dua_en:'The best duʿāʾ on ʿArafah is: There is no god but Allah alone, without partner; His is the dominion and His is the praise, and He is over all things competent. (Tirmidhī)',
refs:'Tirmidhi · Muslim · IslamQA 109313',
links:[{t:'IslamQA — Standing at ʿArafah',u:'https://islamqa.info/en/answers/109313'},{t:'IslamQA — Full Hajj',u:'https://islamqa.info/en/answers/31822'}]},
{id:'muzdalifah',img:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Mount_Arafat.jpg/800px-Mount_Arafat.jpg',title:'🌌 7. Muzdalifah',day:'Night before Eid',level:'Wājib',
fiqh:'After sunset, move to Muzdalifah. Pray Maghrib and ʿIshāʾ combined (with one adhān and two iqāmahs as narrated). Rest. Collect pebbles for the jamarāt (seven for the 10th; more if staying for tashrīq). After Fajr, leave for Mina before sunrise. Weak and vulnerable people may leave after midnight according to a well-known concession.',
do:['Maghrib + ʿIshāʾ combined','Rest safely','Collect pebbles','Leave after Fajr (or after midnight if eligible)'],
avoid:['Leaving immediately after Maghrib without excuse','Sleeping past Fajr without need'],
note:'Pebbles should be small (chickpea to hazelnut size). Do not break pieces from the masjid or harm the environment.',
dua_ar:'اللَّهُمَّ كَمَا هَدَيْتَنَا لِهَٰذَا فَوَفِّقْنَا لِذِكْرِكَ وَشُكْرِكَ',
dua_en:'O Allah, as You guided us to this, grant us success in remembering and thanking You.',
refs:'Bukhari · Muslim · IslamQA',
links:[{t:'IslamQA — Muzdalifah',u:'https://islamqa.info/en/answers/36645'}]},
{id:'jamarat10',img:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Mount_Arafat.jpg/800px-Mount_Arafat.jpg',title:'🪨 8. 10th — ʿAqabah, hady, hair',day:'Eid 10th',level:'Wājib rites',
fiqh:'On the 10th: (1) stone Jamrat al-ʿAqabah only with seven pebbles, saying Allāhu akbar with each; (2) offer the sacrifice if required (Tamattuʿ/Qirān); (3) shave the head (best for men) or shorten; women shorten a small amount. After stoning and shaving/shortening (order has flexibility among schools), most iḥrām restrictions lift except intimacy until ṭawāf al-ifāḍah (partial release / taḥallul awwal).',
do:['Stone only ʿAqabah this day','Arrange hady if required','Shave or shorten','Maintain dignity in crowds'],
avoid:['Stoning the other jamarāt on the 10th','Large or harmful projectiles','Delaying taḥallul through confusion'],
note:'If your group schedules transport windows, follow safety instructions — the rite remains valid within the day.',
dua_ar:'اللَّهُ أَكْبَرُ',
dua_en:'Allāhu akbar with each pebble.',
refs:'Bukhari · Muslim · haj.gov.sa',
links:[{t:'IslamQA — Stoning',u:'https://islamqa.info/en/answers/109318'},{t:'Ministry of Hajj',u:'https://haj.gov.sa/en/Hajj'}]},
{id:'ifadah',img:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/800px-Kaaba_Masjid_Haraam_Makkah.jpg',title:'🕋 9. Ṭawāf al-Ifāḍah & Saʿī of Hajj',day:'10th or after',level:'Pillar',
fiqh:'Ṭawāf al-ifāḍah is a pillar. Perform seven circuits, then saʿī of Hajj if it was not already done as part of your nusk in a way that suffices (Tamattuʿ needs saʿī for Hajj after ifāḍah). After ifāḍah (and saʿī when required), all iḥrām restrictions end (taḥallul thānī). You may perform ifāḍah on the 10th or delay it during tashrīq if needed — do not leave Makkah without it.',
do:['Complete ifāḍah ṭawāf','Saʿī of Hajj if required','Confirm full taḥallul'],
avoid:['Leaving the country without ifāḍah','Assuming ʿUmrah saʿī always replaces Hajj saʿī without checking your nusk'],
note:'Menstruating women delay ṭawāf until pure; they should not depart without ifāḍah according to the stronger view — plan with your group.',
dua_ar:'رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ',
dua_en:'Our Lord, accept from us. Indeed You are the Hearing, the Knowing. (2:127)',
refs:'Quran 2:127 · IslamQA 31822',
links:[{t:'IslamQA — Ifāḍah',u:'https://islamqa.info/en/answers/109320'}]},
{id:'tashreeq',img:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Mount_Arafat.jpg/800px-Mount_Arafat.jpg',title:'📅 10. Days of Tashrīq — stoning',day:'11–12 or 13',level:'Wājib',
fiqh:'After Ẓuhr on the 11th and 12th, stone the three jamarāt (small, middle, then ʿAqabah), seven each, with duʿāʾ after the first two. You may leave on the 12th after stoning before Maghrib (taʿjīl). Staying to the 13th is better if able. Keep Mina nights according to the school and capacity of your group.',
do:['Stone after Ẓuhr','Order: small → middle → ʿAqabah','Duʿāʾ after first and second','Decide taʿjīl vs 13th'],
avoid:['Stoning before Ẓuhr on these days (majority)','Skipping a jamrah without a valid reason'],
note:'If severely overcrowded, follow current Saudi guidance and your scholar on timing windows.',
dua_ar:'اللَّهُمَّ اجْعَلْهُ حَجًّا مَبْرُورًا وَسَعْيًا مَشْكُورًا وَذَنْبًا مَغْفُورًا',
dua_en:'O Allah, make it an accepted Hajj, an appreciated effort, and a forgiven sin.',
refs:'IslamQA · haj.gov.sa',
links:[{t:'IslamQA — Tashrīq stoning',u:'https://islamqa.info/en/answers/36649'}]},
{id:'wada',img:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg/800px-Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg',title:'👋 11. Farewell ṭawāf (Wadāʿ)',path:'Last ṭawāf with soft heart · istighfār · hope for ḥajj mabrūr.',learn:'The farewell ṭawāf is a tender goodbye. Leave with istighfār and the hope of an accepted Hajj (ḥajj mabrūr).',day:'Before leaving Makkah',level:'Wājib',
fiqh:'Ṭawāf al-wadāʿ is the last act in Makkah for those who leave. Seven circuits; no saʿī. Menstruating women are excused according to the ḥadīth of Ibn ʿAbbās. Make it the final rite before travel.',
do:['Perform as the last act','Heartfelt farewell duʿāʾ','Leave without lingering for shopping after (ideal)'],
avoid:['Skipping without a valid excuse','Making another circuit-heavy visit after wadāʿ that voids the “last act” spirit without need'],
note:'If you must stay after wadāʿ for a real need, ask a scholar whether to repeat it.',
dua_ar:'اللَّهُمَّ لَا تَجْعَلْهُ آخِرَ الْعَهْدِ بِبَيْتِكَ الْحَرَامِ',
dua_en:'O Allah, do not make this our last visit to Your Sacred House.',
refs:'Bukhari · Muslim · IslamQA',
links:[{t:'IslamQA — Farewell ṭawāf',u:'https://islamqa.info/en/answers/70222'}]},
{id:'mistakes',img:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/800px-Kaaba_Masjid_Haraam_Makkah.jpg',title:'⚠️ 12. Mistakes, fidya & missed rites',day:'Anytime',level:'Fidā / repair',
fiqh:'Missing a pillar (e.g. ʿArafah, ifāḍah) is not fixed by a simple sacrifice alone — the pillar must be performed. Missing a wājib often requires dam (a sacrifice) or fasting according to detailed rules. Iḥrām violations have graded expiations (fidya): sacrifice, feeding, or fasting depending on the act. Always describe what happened to a qualified scholar before self-issuing a ruling under stress.',
do:['Write down what happened and when','Ask your group mufti or a reliable scholar','Complete any missed pillar as soon as possible'],
avoid:['Copying another pilgrim’s fidya without matching the case','Leaving the Ḥaram while a pillar remains'],
note:'Allah does not burden a soul beyond its capacity. Sincerity and asking are part of the worship.',
dua_ar:'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ',
dua_en:'Our Lord, we have wronged ourselves. If You do not forgive us and have mercy on us, we will surely be among the losers. (7:23)',
refs:'Quran 7:23 · IslamQA 11356 · IslamQA 31822',
links:[{t:'IslamQA — Iḥrām violations',u:'https://islamqa.info/en/answers/11356'},{t:'IslamQA — Full Hajj guide',u:'https://islamqa.info/en/answers/31822'}]}
];
function hajjProg(){try{return JSON.parse(clarityLS.getItem(HAJJ_KEY)||'{}')}catch(e){return{}}}
function hajjSave(p){try{clarityLS.setItem(HAJJ_KEY,JSON.stringify(p||{}))}catch(e){}}
function hajjId(){var s=document.getElementById('hajj-step-select');return s?s.value:(HAJJ_STEPS[0]&&HAJJ_STEPS[0].id)}
function hajjFill(){var s=document.getElementById('hajj-step-select');if(!s)return;var c=s.value;s.innerHTML=HAJJ_STEPS.map(function(x){return '<option value="'+x.id+'">'+x.title+'</option>'}).join('');if(c)s.value=c;else if(HAJJ_STEPS[0])s.value=HAJJ_STEPS[0].id}
function hajjChips(){var box=document.getElementById('hajj-progress');if(!box)return;var p=hajjProg(),cur=hajjId();box.innerHTML=HAJJ_STEPS.filter(function(x){return x.id!=='mistakes'}).map(function(x){return '<span class="hajj-chip'+(p[x.id]?' done':'')+(x.id===cur?' active':'')+'" onclick="hajjShowStep(\''+x.id+'\')">'+(p[x.id]?'✓ ':'')+x.title.replace(/^\d+\.\s*/,'')+'</span>'}).join('')}

function hajjNavStep(dir){
  try{
    var sel=document.getElementById('hajj-step-select');
    if(!sel||!sel.options.length)return;
    var i=sel.selectedIndex+dir;
    if(i<0)i=sel.options.length-1;
    if(i>=sel.options.length)i=0;
    sel.selectedIndex=i;
    hajjShowStep(sel.value);
  }catch(e){}
}
window.hajjNavStep=hajjNavStep;

function hajjShowStep(id){
  var step=HAJJ_STEPS.find(function(x){return x.id===id})||HAJJ_STEPS[0];
  if(!step)return;
  var sel=document.getElementById('hajj-step-select');if(sel)sel.value=step.id;
  var done=!!hajjProg()[step.id],panel=document.getElementById('hajj-panel');if(!panel)return;
  var ar=step.dua_ar||'';
  var linkHtml=(step.links||[]).map(function(L){return '<a class="hajj-ref-link" href="'+L.u+'" target="_blank" rel="noopener noreferrer">'+L.t+' →</a> '}).join('');
  var imgBlock='';
  if(step.img){
    imgBlock='<div class="hajj-hero"><img src="'+step.img+'" alt="'+String(step.title||'').replace(/"/g,'')+'" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.style.display=\'none\'"/><div class="hajj-hero-cap">'+step.day+' · '+step.level+'</div></div>';
  }
  var learn = step.learn || ('Reflect: how does this rite connect you to the Prophet ﷺ and the ummah around the Kaʿbah?');
  var path = step.path || 'Read the fiqh note → practice the Do list → make the duʿāʾ with presence → review sources.';
  var iconMap={prep:'📋',ihram:'🧵',makkah:'🕌',tawaf:'🔄',sai:'🚶',tarwiyah:'⛺',arafah:'⛰️',muzdalifah:'🌌',jamarat10:'🪨',ifadah:'🕋',tashreeq:'📅',wada:'👋',mistakes:'⚠️'};
  var ic=step.icon||iconMap[step.id]||'🕋';
  panel.innerHTML=imgBlock+
    '<div class="hajj-slide-nav"><button type="button" onclick="hajjNavStep(-1)">← Prev</button><button type="button" onclick="hajjNavStep(1)">Next →</button></div>'+
    '<h3><span class="hajj-step-icon">'+ic+'</span> '+step.title+(done?' <span class="hajj-done-badge">✓ Done</span>':'')+'</h3>'+
    '<div class="hajj-meta"><strong>'+step.day+'</strong> · <span class="hajj-level-pill">'+step.level+'</span>'+(step.refs?' · '+step.refs:'')+'</div>'+
    '<p class="hajj-fiqh">'+step.fiqh+'</p>'+
    '<div class="hajj-cols"><div class="hajj-col do"><div class="hajj-do-title">✓ Do</div><ul>'+(step.do||[]).map(function(x){return '<li style="color:inherit">'+x+'</li>'}).join('')+'</ul></div>'+
    '<div class="hajj-col avoid"><div class="hajj-avoid-title">✕ Avoid</div><ul>'+(step.avoid||[]).map(function(x){return '<li style="color:inherit">'+x+'</li>'}).join('')+'</ul></div></div>'+
    (step.note?'<div class="hajj-note"><strong>Note:</strong> '+step.note+'</div>':'')+
    '<div class="hajj-learn"><strong>🌱 Deepen:</strong> '+learn+'</div>'+
    '<div class="hajj-path"><strong>📚 Study path:</strong> '+path+'</div>'+
    '<div class="hajj-dua-box"><div class="dua-ar"><span class="tts-body">'+ar+'</span> <button type="button" class="inline-tts" data-label="🔊" title="Arabic TTS" onclick="clarityInlineTTS(this,\'ar\')">🔊</button></div><div class="dua-en"><span class="tts-body">'+(step.dua_en||'')+'</span>'+(step.dua_en?' <button type="button" class="inline-tts" data-label="🔊" title="English TTS" onclick="clarityInlineTTS(this,\'en\')">🔊</button>':'')+'</div></div>'+
    (linkHtml?'<div class="hajj-refs"><span class="hajj-refs-label">Authentic sources</span> '+linkHtml+'</div>':'');
  window.__hajjDuaAr=ar;hajjChips();
}
function hajjPlayDua(){
  var ar = window.__hajjDuaAr || '';
  if(!ar) return;
  /* Use floating btn only if present; never toggle progress chips */
  var btn = document.getElementById('hajj-audio-btn');
  if(typeof clarityNaturalTTS==='function') clarityNaturalTTS(ar, {btn:btn||null, lang:'ar'});
}
function hajjLoadEpisode(id){
  id=(id||'MUDNDj4n7I4').replace(/[^a-zA-Z0-9_-]/g,'');
  var frame=document.getElementById('hajj-yt-frame');
  if(frame)frame.src='https://www.youtube.com/embed/'+id+'?rel=0';
  var open=document.getElementById('hajj-yt-open');
  if(open)open.href='https://youtu.be/'+id;
}
function hajjPlayTalbiyah(){window.__hajjDuaAr='لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ';hajjPlayDua()}
function hajjMarkDone(){var p=hajjProg();p[hajjId()]=true;hajjSave(p);hajjShowStep(hajjId());try{hajjChecklistRender()}catch(e){}}
function hajjMarkUndone(){var p=hajjProg();delete p[hajjId()];hajjSave(p);hajjShowStep(hajjId());try{hajjChecklistRender()}catch(e){}}
function hajjTalbiyah(d){var n=0;try{n=parseInt(clarityLS.getItem(HAJJ_TALB)||'0',10)||0}catch(e){}if(d===0)n=0;else n=Math.max(0,n+d);try{clarityLS.setItem(HAJJ_TALB,String(n))}catch(e){}var el=document.getElementById('hajj-talbiyah-count');if(el)el.textContent=String(n)}
function hajjWhereAmI(){var a=prompt('Day? 0=before, 8=Mina, 9=Arafah, 10=Eid, 11-13=Tashriq');if(a===null)return;var map={'0':'prep','8':'tarwiyah','9':'arafah','10':'jamarat10','11':'tashreeq','12':'tashreeq','13':'tashreeq'};hajjShowStep(map[String(a).trim()]||'prep')}
function hajjPrintChecklist(){var p=hajjProg(),nusk=(document.getElementById('hajj-nusk')||{}).value||'tamattu',h='<html><head><title>Hajj checklist</title></head><body><h1>Hajj checklist</h1><p>Nusk: '+nusk+'</p><ol>';HAJJ_STEPS.forEach(function(s){if(s.id==='mistakes')return;h+='<li>'+(p[s.id]?'[x] ':'[ ] ')+s.title+'</li>'});h+='</ol></body></html>';var w=window.open('','_blank');if(!w){alert('Allow pop-ups');return}w.document.write(h);w.document.close();try{w.print()}catch(e){}}
function hajjInit(){try{hajjChecklistRender()}catch(e){}if(!document.getElementById('hajj-guide-card'))return;hajjFill();try{var el=document.getElementById('hajj-talbiyah-count');if(el)el.textContent=String(parseInt(clarityLS.getItem(HAJJ_TALB)||'0',10)||0)}catch(e){}hajjShowStep(hajjId()||'prep')}
try{if(window.speechSynthesis){speechSynthesis.getVoices();speechSynthesis.onvoiceschanged=function(){speechSynthesis.getVoices()}}}catch(e){}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){try{hajjInit();if(typeof renderQuestions==='function')renderQuestions()}catch(e){}});
else setTimeout(function(){try{hajjInit();if(typeof renderQuestions==='function')renderQuestions()}catch(e){}},0);

function hajjChecklistSetNusk(v){
  try{clarityLS.setItem('clarity_hajj_nusk', v||'tamattu');}catch(e){}
  var s=document.getElementById('hajj-nusk');
  if(s&&v)s.value=v;
}
function hajjChecklistToggle(id){
  if(typeof hajjProg!=='function'||typeof hajjSave!=='function')return;
  var p=hajjProg();
  if(p[id])delete p[id]; else p[id]=true;
  hajjSave(p);
  hajjChecklistRender();
  try{if(typeof hajjShowStep==='function'&&typeof hajjId==='function'){hajjChips&&hajjChips();}}catch(e){}
}
function hajjChecklistRender(){
  var list=document.getElementById('hajj-checklist-list');
  var prog=document.getElementById('hajj-checklist-progress');
  if(!list||typeof HAJJ_STEPS==='undefined')return;
  var p=(typeof hajjProg==='function')?hajjProg():{};
  var steps=HAJJ_STEPS.filter(function(x){return x.id!=='mistakes'});
  var done=steps.filter(function(x){return !!p[x.id]}).length;
  var pct=steps.length?Math.round(100*done/steps.length):0;
  if(prog){
    prog.innerHTML='<strong>'+done+' / '+steps.length+'</strong> steps marked · '+pct+'%'+
      '<div class="hcl-bar"><span style="width:'+pct+'%"></span></div>';
  }
  list.innerHTML=steps.map(function(s){
    var isDone=!!p[s.id];
    return '<div class="hcl-item'+(isDone?' done':'')+'" onclick="hajjChecklistToggle(\''+s.id+'\')">'+
      '<div class="hcl-check">'+(isDone?'✓':'')+'</div>'+
      '<div><div class="hcl-title">'+s.title+'</div>'+
      '<div class="hcl-meta">'+(s.day||'')+' · '+(s.level||'')+'</div></div></div>';
  }).join('');
  var nuskEl=document.getElementById('hajj-check-nusk');
  if(nuskEl){
    try{nuskEl.value=clarityLS.getItem('clarity_hajj_nusk')||'tamattu';}catch(e){}
  }
}
function hajjChecklistPrint(){
  if(typeof HAJJ_STEPS==='undefined')return;
  var p=(typeof hajjProg==='function')?hajjProg():{};
  var nusk='tamattu';
  try{nusk=clarityLS.getItem('clarity_hajj_nusk')||'tamattu';}catch(e){}
  var h='<html><head><title>Hajj checklist</title></head><body><h1>Hajj checklist</h1><p>Nusk: '+nusk+'</p><ol>';
  HAJJ_STEPS.forEach(function(s){if(s.id==='mistakes')return;h+='<li>'+(p[s.id]?'[x] ':'[ ] ')+s.title+' — '+(s.day||'')+'</li>';});
  h+='</ol></body></html>';
  var w=window.open('','_blank');if(!w){alert('Allow pop-ups');return;}
  w.document.write(h);w.document.close();try{w.print()}catch(e){}
}
function hajjChecklistReset(){
  if(!confirm('Clear all Hajj step marks on this device?'))return;
  if(typeof hajjSave==='function')hajjSave({});
  hajjChecklistRender();
  try{if(typeof hajjChips==='function')hajjChips();}catch(e){}
}

function sealedLoadEp(val){
  var frame=document.getElementById('sealed-yt-frame');
  if(!frame)return;
  var list='PLGlK3JqJXED8GhgIczDFEqEM0uFWfGN5X';
  if(!val || val==='videoseries'){
    frame.src='https://www.youtube.com/embed/videoseries?list='+list+'&rel=0';
  } else {
    var id=String(val).replace(/[^a-zA-Z0-9_-]/g,'');
    frame.src='https://www.youtube.com/embed/'+id+'?list='+list+'&rel=0';
  }
}

async function loadTrafficStats(force){
  var body=document.getElementById('traffic-stats-body');
  if(!body)return;
  if(!force && body.dataset.loaded==='1')return;
  body.innerHTML='<div class="loading-msg">Loading online visits…</div>';
  var siteKey=(typeof SITE_VISIT_KEY!=='undefined'&&SITE_VISIT_KEY)?SITE_VISIT_KEY:'clarity-u-site-visits';
  var siteN=0;
  try{
    var res=await fetch('https://api.countapi.xyz/get/'+siteKey);
    var data=res&&res.ok?await res.json():null;
    siteN=(data&&data.value!=null)?parseInt(data.value,10)||0:0;
  }catch(e1){
    try{
      var res2=await fetch('https://countapi.mileshilliard.com/api/v1/get/'+siteKey);
      var data2=res2&&res2.ok?await res2.json():null;
      siteN=(data2&&data2.value!=null)?parseInt(data2.value,10)||0:0;
    }catch(e2){siteN=0}
  }
  var html='<div class="tr-row" style="grid-template-columns:1fr auto;margin:.5rem 0 1rem"><span class="tr-label" style="font-size:1.05rem">🌐 Online site visits</span><span class="tr-val" style="font-size:1.15rem;font-weight:800;color:var(--accent)">'+siteN+'</span></div>';
  html+='<p style="font-size:.78rem;color:var(--text-muted);margin:0">Live counter for clarity-dawah.fyi (online hits). Refreshes when you open this panel.</p>';
  body.innerHTML=html;
  body.dataset.loaded='1';
}

document.addEventListener('DOMContentLoaded',function(){
  var d=document.getElementById('traffic-stats-details');
  if(d)d.addEventListener('toggle',function(){if(d.open)loadTrafficStats(false)});

try{
  (function claritySiteVisitOnce(){
    try{
      var store = (typeof clarityTrafficStore==='function') ? clarityTrafficStore() : (window.localStorage||{getItem:function(){return null},setItem:function(){}});
      var dayS = new Date().toISOString().slice(0,10);
      var siteMark = 'clarity_hit_site_' + dayS;
      var siteKey = (typeof SITE_VISIT_KEY!=='undefined'&&SITE_VISIT_KEY)?SITE_VISIT_KEY:'clarity-u-site-visits';
      if(store.getItem(siteMark)==='1') return;
      store.setItem(siteMark,'1');
      fetch('https://api.countapi.xyz/hit/'+siteKey).catch(function(){
        fetch('https://countapi.mileshilliard.com/api/v1/hit/'+siteKey).catch(function(){});
      });
    }catch(e){}
  })();
}catch(e){}

});

function clarityAuditDOM(){
  var report=[];
  var tabs=['journey','seerah','tajweed','lectures','tafseer','commands','grave','search','about','notes'];
  tabs.forEach(function(id){
    var els=document.querySelectorAll('#tab-'+id);
    if(els.length!==1)report.push('tab #'+id+' count='+els.length);
  });
  var stack=document.querySelectorAll('#authentic-learning-stack');
  if(stack.length!==1)report.push('learning stack count='+stack.length);
  else if(!document.getElementById('tab-about')||!document.getElementById('tab-about').contains(stack[0]))
    report.push('learning stack not inside Notes');
  var traffic=document.querySelectorAll('#traffic-stats-card');
  if(traffic.length!==1)report.push('traffic card count='+traffic.length);
  else if(!document.getElementById('tab-about')||!document.getElementById('tab-about').contains(traffic[0]))
    report.push('traffic not inside Notes');
  // raw text leak check
  var bodyText=(document.body&&document.body.innerText)||'';
  if(/id="tab-[a-z]+"\s*class="tab-panel"/.test(bodyText))report.push('RAW HTML LEAK: tab-panel text visible in page');
  if(report.length){
    console.warn('[Clarity audit]', report);
    return report;
  }
  console.info('[Clarity audit] OK');
  return [];
}
try{if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(clarityAuditDOM,500)});}catch(e){}

var ILM_PATH=[
{d:1,title:'Qurʾān with meaning',task:'Read 1 page slowly on Quran.com with translation.',link:'https://quran.com'},
{d:2,title:'One ḥadīth, one deed',task:'Open a short ḥadīth on Sunnah.com and act on one word.',link:'https://sunnah.com/riyadussalihin'},
{d:3,title:'Character',task:'Study one adab theme (truthfulness, tongue, or parents).',link:'https://sunnah.com/riyadussalihin'},
{d:4,title:'Fiqh of worship',task:'Review wuḍūʾ or prayer essentials from a reliable site.',link:'https://islamqa.info/en/answers/11423'},
{d:5,title:'Seerah light',task:'Watch one Sealed Nectar episode or read one seerah moment.',link:'https://www.youtube.com/playlist?list=PLGlK3JqJXED8GhgIczDFEqEM0uFWfGN5X'},
{d:6,title:'Duʿāʾ & dhikr',task:'Learn or review one Qurʾānic duʿāʾ; say it with presence.',link:'https://quran.com/2/201'},
{d:7,title:'Grave & legacy',task:'Give a small ṣadaqah or make duʿāʾ for parents by name.',link:'https://islamqa.info/en/answers/763'}
];
function ilmPathwayKey(){return 'clarity_ilm_path_'+(new Date().toISOString().slice(0,10).slice(0,7));}
function ilmPathwayState(){try{return JSON.parse(clarityLS.getItem(ilmPathwayKey())||'{}')}catch(e){return{}}}
function ilmPathwaySave(s){try{clarityLS.setItem(ilmPathwayKey(),JSON.stringify(s||{}))}catch(e){}}
function ilmPathwayToggle(d){var s=ilmPathwayState();if(s[d])delete s[d];else s[d]=true;ilmPathwaySave(s);ilmPathwayRender()}
function ilmPathwayReset(){if(!confirm('Reset this month’s pathway marks?'))return;ilmPathwaySave({});ilmPathwayRender()}
function ilmPathwayRender(){
  var box=document.getElementById('ilm-pathway-list');if(!box)return;
  var s=ilmPathwayState();
  var done=ILM_PATH.filter(function(x){return s[x.d]}).length;
  var meta=document.getElementById('ilm-pathway-summary-meta');
  if(meta){
    meta.textContent = done+' / '+ILM_PATH.length+' marked this month · tap to '+(document.getElementById('ilm-pathway-details')&&document.getElementById('ilm-pathway-details').open?'close':'open');
  }
  box.innerHTML='<p style="font-size:.84rem;color:var(--text-muted);margin:0 0 .4rem">'+done+' / '+ILM_PATH.length+' marked this month</p>'+
    ILM_PATH.map(function(x){
      var on=!!s[x.d];
      return '<div onclick="ilmPathwayToggle('+x.d+')" style="cursor:pointer;display:flex;gap:.5rem;padding:.5rem .65rem;margin:.28rem 0;border-radius:12px;border:1px solid var(--border);background:var(--bg-elevated,var(--card-bg))">'
        +'<span style="width:1.3rem;height:1.3rem;border-radius:6px;border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;flex:0 0 auto;background:'+(on?'var(--accent)':'transparent')+';color:#fff;font-size:.75rem">'+(on?'✓':'')+'</span>'
        +'<div><div style="font-weight:600;color:var(--text)">Day '+x.d+': '+x.title+'</div>'
        +'<div style="font-size:.84rem;color:var(--text-muted)">'+x.task+'</div>'
        +'<a href="'+x.link+'" target="_blank" rel="noopener" onclick="event.stopPropagation()" style="font-size:.78rem;color:var(--accent)">Open resource →</a></div></div>';
    }).join('');
}

function memeSetRatio(r){
  try{
    var st=document.getElementById('meme-stage');
    if(st){
      var ar={'1:1':'1/1','twitter':'16/9','facebook':'1.91/1','16:9':'16/9','4:5':'4/5'};
      st.style.setProperty('aspect-ratio', ar[r]||'1/1', 'important');
      st.style.setProperty('height', 'auto', 'important');
      st.style.setProperty('min-height', '0', 'important');
    }
  }catch(e){}
  memeState.ratio=r||'1:1';
  var canvas=memeGetCanvas();if(!canvas)return;
  var map={'1:1':[1080,1080],'twitter':[1200,675],'facebook':[1200,630],'16:9':[1200,675],'4:5':[1080,1350]};
  var dim=map[memeState.ratio]||map['1:1'];
  canvas.width=dim[0];canvas.height=dim[1];
  try{if(typeof memePositionBoxes==='function')memePositionBoxes();}catch(e){}
  try{memeDraw();}catch(e){}
}
function memeSetGrade(g){memeState.grade=g||'none';memeDraw()}
function memeApplyGrade(ctx,w,h){
  var g=memeState.grade||'none';
  if(g==='none')return;
  ctx.save();
  if(g==='warm'){
    ctx.fillStyle='rgba(180,100,40,0.18)';ctx.fillRect(0,0,w,h);
    ctx.globalCompositeOperation='soft-light';
    ctx.fillStyle='rgba(255,200,120,0.12)';ctx.fillRect(0,0,w,h);
  } else if(g==='night'){
    ctx.fillStyle='rgba(10,40,30,0.35)';ctx.fillRect(0,0,w,h);
    var grd=ctx.createRadialGradient(w*0.5,h*0.35,20,w*0.5,h*0.5,w*0.7);
    grd.addColorStop(0,'rgba(60,120,90,0.12)');grd.addColorStop(1,'rgba(0,0,0,0.45)');
    ctx.fillStyle=grd;ctx.fillRect(0,0,w,h);
  } else if(g==='parchment'){
    ctx.fillStyle='rgba(240,220,180,0.22)';ctx.fillRect(0,0,w,h);
  } else if(g==='mist'){
    var v=ctx.createRadialGradient(w/2,h/2,h*0.2,w/2,h/2,h*0.75);
    v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,0.42)');
    ctx.fillStyle=v;ctx.fillRect(0,0,w,h);
    ctx.fillStyle='rgba(200,220,210,0.08)';ctx.fillRect(0,0,w,h);
  }
  ctx.restore();
}

function memeNightQuote(){
  memeState.grade='night';
  memeState.style='gold';
  memeState.ratio='1:1';
  memeState.topY=0.22;memeState.midY=0.5;memeState.bottomY=0.82;memeState.topSize=36;memeState.midSize=32;memeState.bottomSize=22;memeState.fontSize=32;try{['top','mid','bottom'].forEach(function(k){var el=document.getElementById('meme-size-'+k);var lab=document.getElementById('meme-size-'+k+'-val');var n=memeState[k+'Size'];if(el)el.value=n;if(lab)lab.textContent=String(n);});}catch(e){}
  var ge=document.getElementById('meme-grade');if(ge)ge.value='night';
  var se=document.getElementById('meme-style');if(se)se.value='gold';
  var re=document.getElementById('meme-ratio');if(re)re.value='4:5';
  if(typeof memeSetRatio==='function')memeSetRatio('4:5');
  var nightLines=[
    ['If I die tonight…','What light did I send ahead?','— Clarity'],
    ['The grave is a long stay.','Send light before you arrive.','Qur’an · Sunnah'],
    ['Remember the destroyer of pleasures.','Then do one deed now.','— Hadith'],
    ['Hasbiyallāhu wa niʿmal-wakīl','Allah is sufficient for us.','Qur’an 3:173']
  ];
  var pick=nightLines[Math.floor(Math.random()*nightLines.length)];
  memeState.top=pick[0];memeState.mid=pick[1];memeState.bottom=pick[2];
  var t=document.getElementById('meme-top-input');if(t)t.value=pick[0];
  var m=document.getElementById('meme-mid-input');if(m)m.value=pick[1];
  var b=document.getElementById('meme-bottom-input');if(b)b.value=pick[2];
  memePositionBoxes&&memePositionBoxes();
  memeDraw();
}
async function memeCopyPng(){
  var canvas=memeGetCanvas(); if(!canvas) return;
  try{ memeDraw(); }catch(e){}
  try{
    var blob=await memeCanvasToBlob(canvas);
    if(navigator.clipboard&&window.ClipboardItem){
      await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);
      alert('PNG copied — paste into WhatsApp, Telegram, or a post.');
      return;
    }
  }catch(e){}
  try{
    await memeDownload();
  }catch(e2){
    alert('Could not copy or download in this browser. Use Share, or open in Safari/Chrome.');
  }
}

function clarityOpenMemeStudio(ev){
  try{ if(ev){ if(ev.preventDefault)ev.preventDefault(); if(ev.stopPropagation)ev.stopPropagation(); } }catch(e){}
  try{
    var href='#meme';
    try{
      if(location.protocol.indexOf('http')===0&&location.host){
        var path=(location.pathname||'/');
        if(path!=='/'&&!path.endsWith('/')) path=path.replace(/\/[^\/]*$/,'/');
        href=location.origin+path+'#meme';
      }
    }catch(e0){}
    if(typeof switchTab==='function'){
      switchTab('reality');
      try{ history.replaceState(null,'','#meme'); }catch(e2){}
      setTimeout(function(){
        var el=document.getElementById('meme-card')||document.getElementById('meme');
        if(el&&el.scrollIntoView) el.scrollIntoView({behavior:'smooth',block:'start'});
      },120);
    } else {
      try{ location.hash='meme'; }catch(e3){ location.href=href; }
    }
  }catch(e){
    try{ location.hash='meme'; }catch(e4){}
  }
  return false;
}
function memeUpdateWmLink(){
  var site = 'https://clarity-dawah.fyi/';
  var el = document.getElementById('meme-wm-link');
  if(!el) return;
  el.href = site + '#meme';
  el.target = '_blank';
  el.rel = 'noopener noreferrer';
  el.title = 'clarity-dawah.fyi';
  el.setAttribute('aria-label', 'Open clarity-dawah.fyi');
  el.style.zIndex = '200';
  el.style.pointerEvents = 'auto';
  el.onclick = null;
  el.ontouchend = null;
  var lab = el.querySelector('.wm-hit-label');
  if(lab) lab.textContent = 'clarity-dawah.fyi/#meme';
  var noteA = document.querySelector('.meme-wm-note a');
  if(noteA){ noteA.href = site; noteA.textContent = 'clarity-dawah.fyi'; }
}

/* Masnūn duʿāʾ + daily verse for meme studio */
var MASNUN_DUAS=[
  {ar:'بِسْمِ اللَّهِ',en:'In the name of Allah',ref:'When starting'},
  {ar:'الْحَمْدُ لِلَّهِ',en:'All praise is for Allah',ref:'Qurʾān opening'},
  {ar:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',en:'Glory be to Allah and praise be to Him',ref:'Bukhārī; Muslim'},
  {ar:'أَسْتَغْفِرُ اللَّهَ',en:'I seek forgiveness from Allah',ref:'Istighfār'},
  {ar:'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',en:'O Allah, send blessings upon Muhammad',ref:'Ṣalawāt'},
  {ar:'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',en:'Our Lord, give us good in this world and the next, and protect us from the Fire',ref:'Qurʾān 2:201'},
  {ar:'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',en:'Allah is sufficient for us, and He is the best Disposer of affairs',ref:'Qurʾān 3:173'},
  {ar:'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',en:'There is no god but You; glory be to You; I was among the wrongdoers',ref:'Qurʾān 21:87'},
  {ar:'رَبِّ اشْرَحْ لِي صَدْرِي',en:'My Lord, expand my chest for me',ref:'Qurʾān 20:25'},
  {ar:'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ',en:'O Allah, I ask You for Paradise and seek refuge from the Fire',ref:'Abū Dāwūd'}
];
function memeMasnunDua(){
  try{
    var d=MASNUN_DUAS[Math.floor(Math.random()*MASNUN_DUAS.length)];
    memeState.top=d.ar;
    memeState.mid=d.en;
    memeState.bottom=d.ref+' · clarity-dawah.fyi';
    memeState.font='naskh';
    if(typeof memeSyncInputs==='function') memeSyncInputs();
    else {
      var t=document.getElementById('meme-top-input'); if(t)t.value=memeState.top;
      var m=document.getElementById('meme-mid-input'); if(m)m.value=memeState.mid;
      var b=document.getElementById('meme-bottom-input'); if(b)b.value=memeState.bottom;
    }
    if(typeof memeDraw==='function') memeDraw();
    if(typeof memeFetchStatus==='function') memeFetchStatus('Masnūn duʿāʾ applied');
  }catch(e){console.warn(e)}
}
function memeFetchStatus(msg){
  try{ var el=document.getElementById('meme-fetch-status'); if(el) el.textContent=msg||''; }catch(e){}
}
function memeApplyVerseCard(ar, en, ur, ref){
  /* Clean baseline — full push logic lives in clarity-meme-rebuild-v1 */
  try {
    if (typeof window.clarityMemeFill === "function") {
      window.clarityMemeFill(ar, en, ref);
      return;
    }
    if (typeof memeState === "object" && memeState) {
      memeState.top = String(ar||"").trim();
      memeState.mid = String(en||"").trim();
      memeState.bottom = String(ref||"").trim();
      if (typeof memeDraw === "function") memeDraw();
    }
  } catch(e){}
}

async function memeFromJourney(){
  try{
    memeFetchStatus('Loading Journey verse…');
    var v = (typeof currentJourneyVerse==='object' && currentJourneyVerse) ? currentJourneyVerse : null;
    if(!v || !(v.en || v.arabic)){
      try{
        if(typeof loadVerseInto==='function') await loadVerseInto('verse');
        else if(typeof loadVerse==='function') await loadVerse();
      }catch(e){}
      v = (typeof currentJourneyVerse==='object' && currentJourneyVerse) ? currentJourneyVerse : null;
    }
    if(v && (v.en || v.arabic)){
      var ref = v.ref || ((v.surah&&v.ayah)?('Qurʾān '+v.surah+':'+v.ayah):'Qurʾān');
      memeApplyVerseCard(v.arabic||v.ar||'', v.en||v.english||'', v.ur||'', ref);
      memeFetchStatus('Journey verse applied · '+ref);
      return;
    }
    /* Fallback: fetch random ayah from online API */
    try{
      var s = 1 + Math.floor(Math.random()*114);
      var res = await fetch('https://api.alquran.cloud/v1/surah/'+s+'/editions/quran-uthmani,en.sahih,ur.jalandhry');
      var data = await res.json();
      var eds = (data && data.data) || [];
      var ayahs = (eds[0] && eds[0].ayahs) || [];
      if(ayahs.length){
        var ai = Math.floor(Math.random()*ayahs.length);
        var ar = (eds[0].ayahs[ai] && eds[0].ayahs[ai].text) || '';
        var en = (eds[1] && eds[1].ayahs[ai] && eds[1].ayahs[ai].text) || '';
        var ur = (eds[2] && eds[2].ayahs[ai] && eds[2].ayahs[ai].text) || '';
        var ref = 'Qurʾān '+s+':'+(ai+1);
        memeApplyVerseCard(ar, en, ur, ref);
        try{ currentJourneyVerse = {arabic:ar, en:en, ur:ur, ref:ref, surah:s, ayah:ai+1}; }catch(e){}
        memeFetchStatus('Loaded online · '+ref);
        return;
      }
    }catch(e){ console.warn('meme journey cloud', e); }
    memeFetchStatus('Open Journey tab once, then try again.');
  }catch(err){
    console.warn('memeFromJourney', err);
    memeFetchStatus('Could not load Journey verse');
  }
}
async function memeFromCommand(){
  try{
    memeFetchStatus('Loading Commands verse…');
    var v = (typeof currentCommandVerse==='object' && currentCommandVerse) ? currentCommandVerse : null;
    if(!v || !(v.arabic || v.english || v.en)){
      try{ if(typeof loadCommand==='function') await loadCommand(); }catch(e){}
      v = (typeof currentCommandVerse==='object' && currentCommandVerse) ? currentCommandVerse : null;
    }
    if(v && (v.arabic || v.english || v.en)){
      var ref = v.ref || ((v.surah&&v.ayah)?('Qurʾān '+v.surah+':'+v.ayah):'Commands');
      memeApplyVerseCard(v.arabic||'', v.english||v.en||'', '', ref);
      memeFetchStatus('Command verse applied · '+ref);
      return;
    }
    /* Fall back to Journey fetch for solid content */
    if(typeof memeFromJourney==='function') return memeFromJourney();
    memeFetchStatus('Open Commands tab once, then try again.');
  }catch(err){
    console.warn('memeFromCommand', err);
    memeFetchStatus('Could not load Command verse');
  }
}
function memeDailyVerse(){
  try{ return memeFromJourney(); }catch(e){}
}

function memeSyncInputsFromState(){
  try{
    var map=[['meme-top-input','top'],['meme-mid-input','mid'],['meme-bottom-input','bottom']];
    map.forEach(function(p){
      var el=document.getElementById(p[0]);
      if(el && memeState) el.value = memeState[p[1]] || '';
    });
  }catch(e){}
}
function memeReadLinesFromInputs(){
  try{
    var t=document.getElementById('meme-top-input');
    var m=document.getElementById('meme-mid-input');
    var b=document.getElementById('meme-bottom-input');
    if(t) memeState.top = t.value || memeState.top || '';
    if(m) memeState.mid = m.value || memeState.mid || '';
    if(b) memeState.bottom = b.value || memeState.bottom || '';
  }catch(e){}
}
/** Scale top/mid/bot font sizes so each block fits ~92% width and stacks cleanly (final draft). */
function memeAutoScaleLines(opts){
  opts = opts || {};
  try{
    memeReadLinesFromInputs();
    if(typeof memeGuardMushafText==='function' && !memeGuardMushafText()) return false;
    var canvas = (typeof memeGetCanvas==='function') ? memeGetCanvas() : document.getElementById('meme-canvas');
    if(!canvas || !memeState) return false;
    var ctx = canvas.getContext('2d');
    var w = canvas.width || 720;
    var maxW = w * 0.90;
    var slots = [
      {key:'top', sizeKey:'topSize', text: memeState.top||'', y: memeState.topY||0.16, maxShare:0.22},
      {key:'mid', sizeKey:'midSize', text: memeState.mid||'', y: memeState.midY||0.48, maxShare:0.28},
      {key:'bottom', sizeKey:'bottomSize', text: memeState.bottom||'', y: memeState.bottomY||0.82, maxShare:0.20}
    ];
    function fontStack(isAr){
      if(typeof memeFontStack==='function') return memeFontStack(memeState.font, isAr);
      return isAr ? 'Amiri, Scheherazade New, serif' : 'Inter, system-ui, sans-serif';
    }
    function measureBlock(text, size){
      if(!text || !String(text).trim()) return 0;
      var raw = String(text).trim();
      var paras = raw.split(/\n+/).map(function(p){return p.trim();}).filter(Boolean);
      var totalH = 0;
      paras.forEach(function(para){
        var isAr = /[\u0600-\u06FF]/.test(para);
        var isRef = /^Qur/i.test(para) || /^\d+:\d+/.test(para);
        var fs = isRef ? Math.max(12, Math.round(size*0.55)) : size;
        ctx.font = (isRef?'600 ':'700 ') + fs + 'px ' + fontStack(isAr);
        var words = para.split(/\s+/);
        var line = '', lines = 1;
        words.forEach(function(word){
          var test = line ? line+' '+word : word;
          if(ctx.measureText(test).width > maxW && line){ lines++; line = word; }
          else line = test;
        });
        totalH += lines * fs * 1.18;
      });
      return totalH;
    }
    slots.forEach(function(slot){
      if(!slot.text.trim()) return;
      var lo = 14, hi = Math.min(64, (memeState.fontSize||42) + 12);
      var best = 22;
      for(var i=0;i<18;i++){
        var mid = Math.round((lo+hi)/2);
        var h = measureBlock(slot.text, mid);
        var limit = (canvas.height||900) * slot.maxShare;
        if(h <= limit){ best = mid; lo = mid + 1; }
        else hi = mid - 1;
      }
      memeState[slot.sizeKey] = best;
      try{
        var el=document.getElementById('meme-size-'+slot.key);
        var lab=document.getElementById('meme-size-'+slot.key+'-val');
        if(el) el.value = best;
        if(lab) lab.textContent = String(best);
      }catch(e2){}
    });
    /* Balanced vertical placement for final draft */
    if(opts.reposition !== false){
      var hasT = !!(memeState.top||'').trim();
      var hasM = !!(memeState.mid||'').trim();
      var hasB = !!(memeState.bottom||'').trim();
      if(hasT && hasM && hasB){ memeState.topY=0.14; memeState.midY=0.48; memeState.bottomY=0.84; }
      else if(hasT && hasM){ memeState.topY=0.22; memeState.midY=0.55; memeState.bottomY=0.85; }
      else if(hasM && hasB){ memeState.topY=0.15; memeState.midY=0.40; memeState.bottomY=0.82; }
    }
    try{ if(typeof memePositionBoxes==='function') memePositionBoxes(); }catch(e3){}
    try{ if(typeof memeDraw==='function') memeDraw(); }catch(e4){}
    if(typeof memeFetchStatus==='function') memeFetchStatus(opts.quiet ? (opts.status||'') : (opts.status || 'Final draft · lines auto-scaled'));
    return true;
  }catch(err){
    console.warn('memeAutoScaleLines', err);
    return false;
  }
}
function memeSendToTweetDesk(){
  try{
    memeReadLinesFromInputs();
    var top = (memeState && memeState.top) || '';
    var mid = (memeState && memeState.mid) || '';
    var bot = (memeState && memeState.bottom) || '';
    var parts = [top, mid, bot].map(function(s){ return String(s||'').trim(); }).filter(Boolean);
    if(!parts.length){
      if(typeof memeFetchStatus==='function') memeFetchStatus('Nothing to send — add meme text first');
      return;
    }
    var body = parts.join('\n\n');
    var ta = document.getElementById('td-text');
    if(ta){
      ta.value = body;
      try{ ta.dispatchEvent(new Event('input', {bubbles:true})); }catch(e){}
    }
    /* optional count */
    try{
      if(typeof tdUpdateCount==='function') tdUpdateCount();
      if(typeof tdRender==='function') tdRender();
    }catch(e){}
    if(typeof memeFetchStatus==='function') memeFetchStatus('Sent to Tweet Desk ✓');
    /* soft navigate to notes / tweet if present */
    try{
      var desk = document.getElementById('tweet-desk-card') || document.getElementById('td-text');
      if(desk && desk.scrollIntoView) desk.scrollIntoView({behavior:'smooth', block:'center'});
    }catch(e2){}
    try{
      if(typeof switchTab==='function'){
        /* stay on notes if already; tweet desk is on notes */
      }
    }catch(e3){}
  }catch(err){
    console.warn('memeSendToTweetDesk', err);
  }
}
function memeSurpriseFinalDraft(){
  try{
    if(typeof memeSurpriseMe==='function') memeSurpriseMe();
    setTimeout(function(){
      memeAutoScaleLines({status:'Surprise final draft · scaled for export'});
      if(typeof memeFetchStatus==='function') memeFetchStatus('✨ Surprise final draft ready — Download PNG or send to Tweet Desk');
    }, 550);
  }catch(e){
    try{ memeAutoScaleLines({}); }catch(e2){}
  }
}
try{
  window.memeAutoScaleLines = memeAutoScaleLines;
  window.memeSendToTweetDesk = memeSendToTweetDesk;
  window.memeSurpriseFinalDraft = memeSurpriseFinalDraft;
}catch(e){}

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
    memeState.topY=0.16;memeState.midY=0.48;memeState.bottomY=0.72;
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
      switchTab('reminder');
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
      '<div class="box"><strong>Intention</strong><br>I am preparing my affairs and sending light ahead for the long stay. This page is a personal reminder, not a legal document.</div>' +
      '<h2>Deeds sent ahead (this device)</h2>' +
      '<p>Istighfār counted: <strong>' + ist + '</strong><br>Ṣalawāt counted: <strong>' + sal + '</strong></p>' +
      '<h2>Next steps for a complete wasiyyah</h2>' +
      '<ol><li>Open Clarity → Fiqh tools → Wasiyyah and complete debts, bequests (≤⅓), guardian, and executor.</li>' +
      '<li>Review the family tree and farāʾiḍ awareness notes with a qualified local scholar.</li>' +
      '<li>Store a signed paper copy with trusted family; update after major life events.</li></ol>' +
      '<h2>Duʿāʾ</h2>' +
      '<p style="direction:rtl;font-size:1.25rem;text-align:right">رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ</p>' +
      '<p>Our Lord, accept from us. Indeed You are the Hearing, the Knowing. (2:127)</p>' +
      '<p class="note">Educational summary only. For inheritance and will rulings consult a qualified scholar in your jurisdiction. Generated by Clarity – Furnish Your Grave.</p>' +
      '</body></html>';
    var w = window.open('', '_blank');
    if (!w) { alert('Allow pop-ups to print the legacy page.'); return; }
    w.document.write(html);
    w.document.close();
    setTimeout(function(){ try { w.print(); } catch(e) {} }, 350);
  };
})();

(function(){
  var d=document.getElementById('ilm-pathway-details');
  if(!d)return;
  try{
    if(clarityLS.getItem('clarity_ilm_open')==='1') d.open=true;
  }catch(e){}
  d.addEventListener('toggle',function(){
    try{clarityLS.setItem('clarity_ilm_open', d.open?'1':'0');}catch(e){}
    if(typeof ilmPathwayRender==='function')ilmPathwayRender();
  });
})();

function memePickGreeting(kind){
  var pool=(typeof MEME_URDU_GREETINGS!=='undefined'?MEME_URDU_GREETINGS:[]).filter(function(x){return !kind||x.kind===kind||(kind==='morning'&&x.kind==='morning');});
  if(!pool.length&&typeof MEME_URDU_GREETINGS!=='undefined')pool=MEME_URDU_GREETINGS.slice();
  if(!pool.length)return null;
  var d=pool[memeGreetIdx%pool.length];
  memeGreetIdx++;
  return d;
}
function memeApplyGreetingToCanvas(d,withFlowers){
  if(!d)return;
  memeState.font='arabic';
  memeState.style='gold';
  memeState.grade=withFlowers?'none':'night';
  memeState.ratio='1:1';
  memeState.fontSize=36;
  memeState.topSize=40;memeState.midSize=44;memeState.bottomSize=28;
  memeState.outline=3;
  memeState.topY=0.14;memeState.midY=0.28;memeState.bottomY=0.78;
  var top=d.top||'اسلام علیکم';
  var mid=d.mid||'صبح بخیر';
  var bot=(d.bottom||'')+(d.ameen?'\n'+d.ameen:'');
  memeState.top=top;memeState.mid=mid;memeState.bottom=bot;
  var t=document.getElementById('meme-top-input');if(t)t.value=top;
  var m=document.getElementById('meme-mid-input');if(m)m.value=mid;
  var b=document.getElementById('meme-bottom-input');if(b)b.value=bot;
  var re=document.getElementById('meme-ratio');if(re)re.value='4:5';
  var fe=document.getElementById('meme-font');if(fe){try{fe.value='arabic';}catch(e){}}
  var se=document.getElementById('meme-style');if(se){try{se.value='gold';}catch(e){}}
  try{if(typeof memeSetRatio==='function')memeSetRatio('4:5');}catch(e){}
  try{if(typeof memeSetFont==='function')memeSetFont('arabic');}catch(e){}
  try{if(typeof memeSetStyle==='function')memeSetStyle('gold');}catch(e){}
  try{if(typeof memePositionBoxes==='function')memePositionBoxes();}catch(e){}
  function drawNow(){try{memeDraw();}catch(e){}try{memeUpdateWmLink();}catch(e){}}
  if(withFlowers){
    try{
      if(typeof memeFetchBg==='function'){
        memeFetchBg('flowers');
        setTimeout(drawNow,700);
      } else {
        memeState.img=null;
        memeState.blankColor1='#0a0a0a';memeState.blankColor2='#1a1210';
        drawNow();
      }
    }catch(e){memeState.blankColor1='#0a0a0a';memeState.blankColor2='#1a1210';memeState.img=null;drawNow();}
  } else {
    memeState.img=null;
    memeState.blankColor1='#050505';memeState.blankColor2='#121212';
    memeState.grade='none';
    drawNow();
  }
  try{
    var prev=document.getElementById('meme-urdu-preview');
    if(prev)prev.innerHTML='<div style="direction:rtl;text-align:right;font-family:Scheherazade New,Amiri,serif;line-height:1.7"><div style="font-size:1.15rem">'+top+'</div><div style="font-size:1.35rem;color:var(--accent);font-weight:700">'+mid+'</div><div style="font-size:.95rem">'+bot.replace(/\n/g,'<br>')+'</div><div style="font-size:.8rem;opacity:.8;margin-top:.35rem;direction:ltr;text-align:left">'+(d.en||'')+'</div></div>';
  }catch(e){}
}
function memeUrduMorningGreeting(){
  var d=memePickGreeting('morning');
  if(!d){alert('Greeting pack missing');return;}
  memeApplyGreetingToCanvas(d,true);
}
function memeUrduEveningGreeting(){
  var d=memePickGreeting('evening');
  if(!d)d=memePickGreeting('salam');
  memeApplyGreetingToCanvas(d,false);
}
function memeUrduSalamGreeting(){
  var d=memePickGreeting('salam');
  if(!d)d=memePickGreeting('morning');
  memeApplyGreetingToCanvas(d,true);
}

function memeSetCalligraphy(style){
  var map={naskh:'naskh',kufi:'kufi',ruqaa:'ruqaa',thuluth:'thuluth',diwani:'diwani',arabic:'arabic'};
  var f=map[style]||'arabic';
  memeState.font=f;
  memeState.style = (style==='kufi'||style==='ruqaa') ? 'gold' : (memeState.style||'outline');
  var fe=document.getElementById('meme-font'); if(fe) fe.value=f;
  var se=document.getElementById('meme-style');
  if(se && (style==='kufi'||style==='thuluth')){ se.value='gold'; memeState.style='gold'; }
  try{ if(typeof memeSetFont==='function') memeSetFont(f); }catch(e){ memeState.font=f; }
  try{ memeDraw(); }catch(e){}
}

var calligState={
  drawing:false,ink:'#0d4f3c',size:14,guide:true,script:'naskh',glyph:'ا',
  strokes:[],cur:null,lastPts:[],
  audioOn:true,scale:100,offsetX:0,offsetY:0,
  stylusSim:true,autoEnhance:true,stylusFeel:70,
  lastVel:0,pointerType:'touch',tip:'finger'
};
function calligUpdateModeBadge(){
  var el=document.getElementById('callig-mode-badge');
  if(!el)return;
  var s=(calligState.script||'naskh');
  var names={naskh:'Naskh',kufi:'Kufi',ruqaa:'Ruqʿah',thuluth:'Thuluth'};
  var bits=[names[s]||s];
  bits.push(calligState.tip||'finger');
  if(calligState.autoEnhance) bits.push('auto-enhance');
  el.textContent=bits.join(' · ');
}
var CALLIG_AUDIO={
  'ا':{name:'Alif',tip:'Madd / مدّ letter — open and long when prolonged.',say:'ا'},
  'ب':{name:'Bāʾ',tip:'Lips close fully — bilabial.',say:'ب'},
  'ت':{name:'Tāʾ',tip:'Tip of tongue on upper gums.',say:'ت'},
  'ث':{name:'Thāʾ',tip:'Tongue tip with upper front teeth — soft th.',say:'ث'},
  'ح':{name:'Ḥāʾ',tip:'Middle of throat — compressed ḥ.',say:'ح'},
  'س':{name:'Sīn',tip:'Whistling sāfir — tongue near teeth.',say:'س'},
  'ع':{name:'ʿAyn',tip:'Middle throat — voiced ʿ.',say:'ع'},
  'م':{name:'Mīm',tip:'Lips + ghunnah / غُنّة (nasal) when noon/mim rules apply.',say:'م'},
  'ن':{name:'Nūn',tip:'Tongue tip + ghunnah / غُنّة in ikhfāʾ (إخفاء) / idghām (إدغام) contexts.',say:'ن'},
  'ه':{name:'Hāʾ',tip:'Deepest throat — light hāʾ.',say:'ه'},
  'و':{name:'Wāw',tip:'Lips round — madd / مدّ when prolonged.',say:'و'},
  'ي':{name:'Yāʾ',tip:'Tongue middle — madd / مدّ when prolonged.',say:'ي'},
  'الله':{name:'Allah',tip:'Lām tafkhīm / تفخيم after fatḥah/ḍammah; tarqīq / ترقيق after kasrah.',say:'الله'},
  'بسم':{name:'Bism',tip:'Start of basmalah — clear bāʾ then sīn.',say:'بسم'},
  'محمد':{name:'Muḥammad',tip:'Ḥāʾ from middle throat; mīm with care.',say:'محمد'},
  'رحمن':{name:'Raḥmān',tip:'Rāʾ rules + ḥāʾ + mīm ghunnah / غُنّة.',say:'رحمن'},
  'رحيم':{name:'Raḥīm',tip:'Madd / مدّ on yāʾ when appropriate.',say:'رحيم'},
  'صبر':{name:'Ṣabr',tip:'Ṣād is istiʿlāʾ / استعلاء (heavy).',say:'صبر'},
  'شكر':{name:'Shukr',tip:'Shīn is spread; kāf light.',say:'شكر'}
};
function calligFont(){
  var s=calligState.script||'naskh';
  var sc=(calligState.scale||100)/100;
  var px=Math.round(120*sc);
  if(s==='kufi') return "700 "+px+"px 'Reem Kufi', sans-serif";
  if(s==='ruqaa') return "700 "+px+"px 'Aref Ruqaa', serif";
  if(s==='thuluth') return "700 "+Math.round(130*sc)+"px 'Lateef', serif";
  return "700 "+px+"px 'Amiri', 'Scheherazade New', serif";
}
function calligSpeak(glyph){
  if(!calligState.audioOn) return;
  glyph = glyph || calligState.glyph || 'ا';
  var meta = CALLIG_AUDIO[glyph] || {name:glyph, tip:'Articulate carefully.', say:glyph};
  var tipEl = document.getElementById('callig-tajweed-tip');
  if(tipEl){
    tipEl.innerHTML = '<strong>'+meta.name+'</strong> — '+meta.tip;
  }
  try{
    if(!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(meta.say || glyph);
    u.lang = 'ar-SA';
    u.rate = 0.75;
    u.pitch = 1;
    /* Prefer Arabic voice when available */
    var voices = window.speechSynthesis.getVoices() || [];
    var ar = voices.find(function(v){ return /^ar/i.test(v.lang); });
    if(ar) u.voice = ar;
    window.speechSynthesis.speak(u);
  }catch(e){}
}
function calligToggleAudio(){
  calligState.audioOn = !calligState.audioOn;
  var b = document.getElementById('callig-audio-btn');
  if(b) b.textContent = calligState.audioOn ? '🔊 Audio on' : '🔇 Audio off';
  if(calligState.audioOn) calligSpeak();
}
function calligMeasureGuide(ctx, c, scaleOverride){
  var g=String(calligState.glyph||'ا');
  var isLatin=/[A-Za-z]/.test(g);
  var sc=((scaleOverride!=null?scaleOverride:calligState.scale)||100)/100;
  var prevFont=ctx.font, prevDir=ctx.direction, prevAlign=ctx.textAlign, prevBase=ctx.textBaseline;
  if(isLatin){
    ctx.font="600 "+Math.round(48*sc)+"px 'Cormorant Garamond', Georgia, serif";
    ctx.direction='ltr';
  } else {
    var s=calligState.script||'naskh';
    var px=Math.round(120*sc);
    if(s==='kufi') ctx.font="700 "+px+"px 'Reem Kufi', sans-serif";
    else if(s==='ruqaa') ctx.font="700 "+px+"px 'Aref Ruqaa', serif";
    else if(s==='thuluth') ctx.font="700 "+Math.round(130*sc)+"px 'Lateef', serif";
    else ctx.font="700 "+px+"px 'Amiri', 'Scheherazade New', serif";
    ctx.direction='rtl';
  }
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  var m=ctx.measureText(g);
  var w=Math.max(m.width||0, 1);
  var h=0;
  if(m.actualBoundingBoxAscent!=null && m.actualBoundingBoxDescent!=null){
    h=m.actualBoundingBoxAscent+m.actualBoundingBoxDescent;
  } else {
    h=Math.round((isLatin?48:120)*sc*1.15);
  }
  ctx.font=prevFont; ctx.direction=prevDir; ctx.textAlign=prevAlign; ctx.textBaseline=prevBase;
  return {w:w, h:h, isLatin:isLatin, g:g};
}
function calligAutoFitScale(opts){
  opts=opts||{};
  var c=document.getElementById('callig-canvas'); if(!c) return calligState.scale||100;
  var ctx=c.getContext('2d');
  var padX=opts.padX!=null?opts.padX:48;
  var padY=opts.padY!=null?opts.padY:36;
  var maxW=Math.max(40, c.width-padX*2);
  var maxH=Math.max(40, c.height-padY*2);
  var lo=40, hi=160, best=70;
  for(var i=0;i<18;i++){
    var mid=Math.round((lo+hi)/2);
    var m=calligMeasureGuide(ctx, c, mid);
    if(m.w<=maxW && m.h<=maxH){ best=mid; lo=mid+1; }
    else hi=mid-1;
  }
  best=Math.max(40, Math.min(160, best));
  var oldSc=calligState.scale||100;
  if(oldSc<1) oldSc=100;
  var origin=typeof calligGuideOrigin==='function'?calligGuideOrigin():{cx:450,cy:210};
  calligState.scale=best;
  var scaleEl=document.getElementById('callig-scale');
  if(scaleEl) scaleEl.value=String(best);
  var lab=document.getElementById('callig-scale-val'); if(lab) lab.textContent=best+'%';
  /* keep offsets but clamp after fit; move ink with guide */
  calligClampOffsets();
  if(typeof calligScaleStrokesAround==='function') calligScaleStrokesAround(origin.cx, origin.cy, best/oldSc);
  return best;
}
function calligClampOffsets(){
  var c=document.getElementById('callig-canvas'); if(!c) return;
  var maxX=Math.round(c.width*0.42);
  var maxY=Math.round(c.height*0.42);
  calligState.offsetX=Math.max(-maxX, Math.min(maxX, calligState.offsetX||0));
  calligState.offsetY=Math.max(-maxY, Math.min(maxY, calligState.offsetY||0));
  var ox=document.getElementById('callig-offset-x');
  var oy=document.getElementById('callig-offset-y');
  var oxv=document.getElementById('callig-offset-x-val');
  var oyv=document.getElementById('callig-offset-y-val');
  if(ox){ ox.min=String(-maxX); ox.max=String(maxX); ox.value=String(calligState.offsetX); }
  if(oy){ oy.min=String(-maxY); oy.max=String(maxY); oy.value=String(calligState.offsetY); }
  if(oxv) oxv.textContent=String(calligState.offsetX);
  if(oyv) oyv.textContent=String(calligState.offsetY);
}
function calligShiftStrokes(dx, dy){
  if(!dx && !dy) return;
  function shift(st){
    if(!st || !st.length) return;
    for(var i=0;i<st.length;i++){
      if(st[i]){ st[i].x=(st[i].x||0)+dx; st[i].y=(st[i].y||0)+dy; }
    }
  }
  (calligState.strokes||[]).forEach(shift);
  if(calligState.cur) shift(calligState.cur);
}
function calligScaleStrokesAround(cx, cy, ratio){
  if(!ratio || Math.abs(ratio-1)<1e-6) return;
  function sc(st){
    if(!st || !st.length) return;
    for(var i=0;i<st.length;i++){
      if(!st[i]) continue;
      st[i].x = cx + ((st[i].x||0)-cx)*ratio;
      st[i].y = cy + ((st[i].y||0)-cy)*ratio;
      if(st[i].w!=null) st[i].w = Math.max(0.8, (st[i].w||1)*ratio);
    }
    if(st.size!=null) st.size = Math.max(1, st.size*ratio);
  }
  (calligState.strokes||[]).forEach(sc);
  if(calligState.cur) sc(calligState.cur);
}
function calligGuideOrigin(){
  var c=document.getElementById('callig-canvas');
  if(!c) return {cx:450, cy:210};
  return {
    cx: c.width/2 + (calligState.offsetX||0),
    cy: c.height/2 + (calligState.offsetY||0)
  };
}
function calligSetOffset(axis, v){
  try{
    var oldX=calligState.offsetX||0, oldY=calligState.offsetY||0;
    v=Math.round(+v||0);
    if(axis==='x') calligState.offsetX=v; else calligState.offsetY=v;
    if(typeof calligClampOffsets==='function') calligClampOffsets();
    var nx=calligState.offsetX||0, ny=calligState.offsetY||0;
    if(typeof calligShiftStrokes==='function') calligShiftStrokes(nx-oldX, ny-oldY);
    var lx=document.getElementById('callig-offset-x-val');
    var ly=document.getElementById('callig-offset-y-val');
    if(lx) lx.textContent=String(nx);
    if(ly) ly.textContent=String(ny);
    var elx=document.getElementById('callig-offset-x');
    var ely=document.getElementById('callig-offset-y');
    if(elx && axis==='x') elx.value=String(nx);
    if(ely && axis==='y') ely.value=String(ny);
    if(typeof calligDrawGuide==='function') calligDrawGuide();
  }catch(e){console.warn('calligSetOffset',e);}
}
function calligDrawGuide(){
  var c=document.getElementById('callig-canvas'); if(!c) return;
  var ctx=c.getContext('2d');
  ctx.clearRect(0,0,c.width,c.height);
  ctx.fillStyle='#f7f3eb';
  ctx.fillRect(0,0,c.width,c.height);
  ctx.strokeStyle='rgba(13,79,60,0.10)';
  ctx.lineWidth=1;
  for(var y=40;y<c.height;y+=40){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(c.width,y); ctx.stroke(); }
  /* soft midline */
  ctx.strokeStyle='rgba(184,146,42,0.25)';
  ctx.beginPath(); ctx.moveTo(0,c.height/2); ctx.lineTo(c.width,c.height/2); ctx.stroke();
  if(calligState.guide){
    ctx.save();
    ctx.fillStyle='rgba(13,79,60,0.13)';
    var g=String(calligState.glyph||'ا');
    var isLatin=/[A-Za-z]/.test(g);
    if(isLatin){
      ctx.font="600 "+Math.round(48*((calligState.scale||100)/100))+"px 'Cormorant Garamond', Georgia, serif";
      ctx.direction='ltr';
    } else {
      ctx.font=calligFont();
      ctx.direction='rtl';
    }
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    var ox=calligState.offsetX||0;
    var oy=calligState.offsetY||0;
    ctx.fillText(g, c.width/2+ox, c.height/2+oy);
    ctx.restore();
  }
  (calligState.strokes||[]).forEach(function(st){ calligStrokePath(ctx, st); });
}
function calligStrokePath(ctx, st){
  if(!st || st.length<1) return;
  var ink = st.ink || calligState.ink;
  var base = st.size || calligState.size;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if(st.length===1){
    ctx.beginPath();
    ctx.fillStyle = ink;
    ctx.arc(st[0].x, st[0].y, Math.max(1, base/3.2), 0, Math.PI*2);
    ctx.fill();
    return;
  }
  /* Variable-width qalam: width from point pressure/velocity */
  for(var i=1;i<st.length;i++){
    var a=st[i-1], b=st[i];
    var w = (b.w!=null?b.w:(a.w!=null?a.w:base));
    ctx.beginPath();
    ctx.strokeStyle = ink;
    ctx.lineWidth = Math.max(1.2, w);
    if(i===1) ctx.moveTo(a.x,a.y);
    else {
      var px=st[i-2].x, py=st[i-2].y;
      var mx=(a.x+b.x)/2, my=(a.y+b.y)/2;
      ctx.moveTo((px+a.x)/2,(py+a.y)/2);
      ctx.quadraticCurveTo(a.x,a.y,mx,my);
    }
    if(i===st.length-1){
      ctx.lineTo(b.x,b.y);
    }
    ctx.stroke();
  }
  /* Soft dark edge for reed-pen illusion */
  if(calligState.stylusSim && st.length>3){
    ctx.save();
    ctx.globalAlpha=0.18;
    ctx.strokeStyle='#0a2018';
    for(var j=2;j<st.length;j+=2){
      var p=st[j];
      ctx.beginPath();
      ctx.lineWidth=Math.max(0.6,(p.w||base)*0.35);
      ctx.moveTo(st[j-1].x, st[j-1].y);
      ctx.lineTo(p.x,p.y);
      ctx.stroke();
    }
    ctx.restore();
  }
}
/** Auto-enhance stroke geometry to match calligraphy script mode */
function calligEnhanceStroke(st){
  if(!st || st.length<3) return st;
  var script=calligState.script||'naskh';
  var out=[];
  for(var i=0;i<st.length;i++){
    var p={x:st[i].x,y:st[i].y,w:st[i].w,t:st[i].t};
    out.push(p);
  }
  /* light Chaikin-ish smooth */
  function smoothOnce(pts){
    if(pts.length<3) return pts;
    var n=[{x:pts[0].x,y:pts[0].y,w:pts[0].w,t:pts[0].t}];
    for(var i=0;i<pts.length-1;i++){
      var a=pts[i],b=pts[i+1];
      n.push({x:a.x*0.75+b.x*0.25,y:a.y*0.75+b.y*0.25,w:(a.w+b.w)/2,t:a.t});
      n.push({x:a.x*0.25+b.x*0.75,y:a.y*0.25+b.y*0.75,w:(a.w+b.w)/2,t:b.t});
    }
    n.push({x:pts[pts.length-1].x,y:pts[pts.length-1].y,w:pts[pts.length-1].w,t:pts[pts.length-1].t});
    return n;
  }
  if(script==='naskh'||script==='thuluth'){
    out=smoothOnce(out);
    if(script==='thuluth') out=smoothOnce(out);
  }
  if(script==='kufi'){
    /* quantize toward horizontal/vertical segments */
    for(var i=1;i<out.length;i++){
      var dx=out[i].x-out[i-1].x, dy=out[i].y-out[i-1].y;
      if(Math.abs(dx)>Math.abs(dy)*1.35){ out[i].y=out[i-1].y; }
      else if(Math.abs(dy)>Math.abs(dx)*1.35){ out[i].x=out[i-1].x; }
    }
    for(var i=0;i<out.length;i++){ out[i].w=Math.max(out[i].w||calligState.size, calligState.size*0.95); }
  }
  if(script==='ruqaa'){
    /* shorten trailing tails; slightly reduce late widths */
    var cut=Math.max(3, Math.floor(out.length*0.12));
    if(out.length>8) out=out.slice(0, out.length-cut);
    for(var i=Math.floor(out.length*0.55);i<out.length;i++){
      out[i].w=Math.max(1.4,(out[i].w||calligState.size)*0.72);
    }
  }
  if(script==='thuluth'){
    for(var i=0;i<out.length;i++){
      var t=i/(out.length-1||1);
      out[i].w=(out[i].w||calligState.size)*(0.85+0.45*Math.sin(t*Math.PI));
    }
  }
  if(script==='naskh'){
    for(var i=1;i<out.length-1;i++){
      out[i].x=out[i].x*0.92+(out[i-1].x+out[i+1].x)*0.04;
      out[i].y=out[i].y*0.92+(out[i-1].y+out[i+1].y)*0.04;
    }
  }
  out.ink=st.ink; out.size=st.size;
  return out;
}
function calligAutoEnhanceAll(){
  if(!(calligState.strokes&&calligState.strokes.length)){alert('Draw a stroke first, then enhance.');return;}
  calligState.strokes=calligState.strokes.map(calligEnhanceStroke);
  calligDrawGuide();
  var tip=document.getElementById('callig-tajweed-tip');
  if(tip) tip.innerHTML='✨ Enhanced <strong>'+calligState.strokes.length+'</strong> stroke(s) for <strong>'+(calligState.script||'naskh')+'</strong>';
}
function calligPos(ev,c){
  var r=c.getBoundingClientRect();
  var t=(ev.touches&&ev.touches[0])||(ev.changedTouches&&ev.changedTouches[0])||ev;
  var x=(t.clientX-r.left)*(c.width/r.width);
  var y=(t.clientY-r.top)*(c.height/r.height);
  return {x:x, y:y};
}
function calligDist(a,b){
  var dx=a.x-b.x, dy=a.y-b.y;
  return Math.sqrt(dx*dx+dy*dy);
}
function calligStart(ev){
  var c=document.getElementById('callig-canvas'); if(!c) return;
  ev.preventDefault();
  calligState.drawing=true;
  var p=calligPos(ev,c);
  var t=Date.now();
  var press=0.85;
  try{
    if(ev.pressure!=null && ev.pressure>0) press=ev.pressure;
    else if(ev.touches&&ev.touches[0]&&ev.touches[0].force) press=Math.max(0.25, Math.min(1, ev.touches[0].force));
  }catch(e){}
  var w=(typeof calligTipWidth==='function')?calligTipWidth(press,0,0.6):(calligState.size||14);
  calligState.cur=[{x:p.x,y:p.y,w:w,t:t,a:0.6}];
  calligState.cur.ink=calligState.ink;
  calligState.cur.size=calligState.size;
  calligState.lastPts=[p];
  calligState.lastVel=0;
  try{calligState.pointerType=(ev.pointerType||(ev.touches?'touch':'mouse'));}catch(e){}
}
function calligMove(ev){
  if(!calligState || !calligState.drawing) return;
  var c=document.getElementById('callig-canvas'); if(!c) return;
  ev.preventDefault();
  var p=calligPos(ev,c);
  var cur=calligState.cur;
  /* Normalize object-shape {pts:[]} from any fallback binder */
  if (cur && !Array.isArray(cur) && Array.isArray(cur.pts)) cur = calligState.cur = cur.pts;
  if(!cur || !Array.isArray(cur) || !cur.length) return;
  var last = cur[cur.length-1];
  if(!last) return;
  var minD = calligState.stylusSim ? 1.1 : 1.6;
  if(calligDist(last, p) < minD) return;
  var now=Date.now();
  var dt=Math.max(8, now-(last.t||now));
  var dist=calligDist(last,p);
  var vel=dist/dt; /* px/ms */
  calligState.lastVel=vel;
  var alpha = (ev.touches && ev.touches.length) ? 0.30 : 0.38;
  if(calligState.stylusSim) alpha = Math.min(0.42, alpha+0.05);
  var sm = {
    x: last.x + (p.x - last.x) * alpha,
    y: last.y + (p.y - last.y) * alpha,
    t: now
  };
  var press=0.8;
  try{
    if(ev.pressure!=null && ev.pressure>0) press=ev.pressure;
    else if(ev.touches&&ev.touches[0]&&ev.touches[0].force) press=Math.max(0.2, Math.min(1, ev.touches[0].force));
  }catch(e){}
  /* Finger has no real pressure — simulate from inverse velocity (slow=thick reed) */
  if(calligState.stylusSim){
    var feel=(calligState.stylusFeel||70)/100;
    var speedFactor=1/(1+vel*14);
    var base=calligState.size;
    sm.w = base * (0.42 + 0.7*press) * (0.55 + 0.7*speedFactor) * (0.75 + 0.4*feel);
    sm.w = Math.max(base*0.28, Math.min(base*1.55, sm.w));
  } else {
    sm.w = calligState.size;
  }
  cur.push(sm);
  calligDrawGuide();
  calligStrokePath(c.getContext('2d'), cur);
}
function calligEnd(ev){
  if(!calligState || !calligState.drawing) return;
  calligState.drawing=false;
  var cur = calligState.cur;
  if (cur && !Array.isArray(cur) && Array.isArray(cur.pts)) cur = cur.pts;
  if(cur && Array.isArray(cur) && cur.length>0){
    var stroke=cur;
    if(calligState.autoEnhance){
      try{ stroke=calligEnhanceStroke(stroke); }catch(e){}
    }
    calligState.strokes.push(stroke);
  }
  calligState.cur=null;
  calligDrawGuide();
}
function calligClear(){ calligState.strokes=[]; calligDrawGuide(); }
function calligUndo(){ calligState.strokes.pop(); calligDrawGuide(); }
function calligToggleGuide(){ calligState.guide=!calligState.guide; calligDrawGuide(); }
function calligSetScript(v){ calligState.script=v||'naskh'; calligState.strokes=[]; calligState.cur=null; calligState.drawing=false; calligDrawGuide(); calligUpdateModeBadge(); }
function calligSetGlyph(v){
  calligState.glyph=v||'ا';
  calligState.strokes=[];
  calligState.cur=null;
  calligState.drawing=false;
  calligDrawGuide();
  calligSpeak(calligState.glyph);
}
function calligSurprise(){
  /* Prefer active English→Arabic phrase on the pad; only then random practice letter */
  var enEl = document.getElementById('callig-english-input');
  var en = (enEl && enEl.value || '').trim();
  var arEl = document.getElementById('callig-voice-ar');
  var ar = (arEl && arEl.value || '').trim();
  if (!ar) {
    try {
      if (en && typeof calligLocalTranslate === 'function') ar = calligLocalTranslate(en) || '';
    } catch(e){}
  }
  if (!ar && en) {
    /* common short phrase map */
    var map = {
      'praise be to allah':'الحمد لله',
      'all praise is due to allah':'الحمد لله',
      'in the name of allah':'بسم الله',
      'bismillah':'بسم الله',
      'subhanallah':'سبحان الله',
      'allahu akbar':'الله أكبر',
      'astaghfirullah':'أستغفر الله',
      'la ilaha illallah':'لا إله إلا الله'
    };
    ar = map[en.toLowerCase()] || '';
  }
  if (ar) {
    try {
      if (typeof calligSetGuideText === 'function') calligSetGuideText(ar, { clearStrokes: true, resetPan: true });
      else { calligState.glyph = ar; if (typeof calligDrawGuide==='function') calligDrawGuide(); }
      var tip = document.getElementById('callig-tajweed-tip');
      if (tip) tip.textContent = 'On pad: ' + ar + (en ? ' ← ' + en : '');
      return;
    } catch(e){}
  }
  /* Letter practice fallback */
  var glyphs=['ا','ب','ت','ث','ج','ح','خ','د','ر','س','ش','ص','ع','م','ن','ه','و','ي','لا','الله'];
  var scripts=['naskh','ruqaa','thuluth','kufi'];
  calligState.glyph=glyphs[Math.floor(Math.random()*glyphs.length)];
  calligState.script=scripts[Math.floor(Math.random()*scripts.length)];
  calligState.stylusSim=true; calligState.autoEnhance=true;
  try {
    if (typeof calligSetGuideText === 'function') calligSetGuideText(calligState.glyph, { clearStrokes: true, resetPan: true });
    else if (typeof calligDrawGuide==='function') calligDrawGuide();
  } catch(e){}
  var tip2 = document.getElementById('callig-tajweed-tip');
  if (tip2) tip2.textContent = 'Practice letter: ' + calligState.glyph + ' · ' + (calligState.script||'naskh') + ' — type a phrase above for full words';
}
function calligInit(){
  var c=document.getElementById('callig-canvas'); if(!c) return;
  var targetW = 900;
  var targetH = 420;
  c.width = targetW;
  c.height = targetH;
  calligDrawGuide();
  calligUpdateModeBadge();
  /* Pointer Events unify mouse / finger / stylus with pressure when available */
  if(window.PointerEvent){
    c.style.touchAction='none';
    c.addEventListener('pointerdown', function(ev){ try{c.setPointerCapture(ev.pointerId);}catch(e){} calligStart(ev); });
    c.addEventListener('pointermove', calligMove);
    c.addEventListener('pointerup', calligEnd);
    c.addEventListener('pointercancel', calligEnd);
    c.addEventListener('pointerleave', function(ev){ if(calligState.drawing) calligEnd(ev); });
  } else {
    c.onmousedown=calligStart;
    c.onmousemove=calligMove;
    c.onmouseup=calligEnd;
    c.onmouseleave=calligEnd;
    c.ontouchstart=calligStart;
    c.ontouchmove=calligMove;
    c.ontouchend=calligEnd;
    c.ontouchcancel=calligEnd;
  }
  try{ window.speechSynthesis && window.speechSynthesis.getVoices(); }catch(e){}
  try{ calligProgressRender(); }catch(e){}
}
try{
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', function(){ setTimeout(calligInit, 400); });
  else setTimeout(calligInit, 400);
}catch(e){}

function calligSetGuideText(text, opts){
  opts=opts||{};
  text=String(text||'').trim();
  if(!text) return false;
  calligState.glyph=text;
  if(opts.clearStrokes!==false){
    calligState.strokes=[];
    calligState.cur=null;
    calligState.drawing=false;
  }
  if(opts.resetPan!==false){
    calligState.offsetX=0; calligState.offsetY=0;
  }
  try{ calligAutoFitScale({padX:opts.padX||36, padY:opts.padY||24}); }catch(e){}
  calligDrawGuide();
  return true;
}
function calligPreviewTranslation(en, ar){
  var box=document.getElementById('callig-translate-preview');
  if(!box) return;
  var e=String(en||'').trim();
  var a=String(ar||'').trim();
  if(!e && !a){ box.innerHTML=''; return; }
  box.innerHTML=(e?('<div class="en-out">EN: '+e.replace(/</g,'&lt;')+'</div>'):'')+(a?('<div class="ar-out">'+a+'</div>'):'');
}
var CALLIG_EN_AR_GLOSS={
  'bismillah':'بِسْمِ اللَّهِ','in the name of allah':'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  'allah':'اللَّه','god':'اللَّه','patience':'صَبْر','sabr':'صَبْر','gratitude':'شُكْر','shukr':'شُكْر',
  'peace':'سَلَام','salam':'سَلَام','mercy':'رَحْمَة','light':'نُور','heart':'قَلْب','truth':'حَقّ',
  'knowledge':'عِلْم','ilm':'عِلْم','faith':'إِيمَان','iman':'إِيمَان','paradise':'جَنَّة','jannah':'جَنَّة',
  'prayer':'صَلَاة','salah':'صَلَاة','quran':'قُرْآن','muhammad':'مُحَمَّد','prophet':'نَبِيّ',
  'forgive me':'اغْفِرْ لِي','o allah':'يَا اللَّه','praise be to allah':'الْحَمْدُ لِلَّهِ','alhamdulillah':'الْحَمْدُ لِلَّهِ',
  'subhanallah':'سُبْحَانَ اللَّهِ','allahu akbar':'اللَّهُ أَكْبَر','la ilaha illallah':'لَا إِلَٰهَ إِلَّا اللَّه',
  'hasbunallah':'حَسْبُنَا اللَّهُ','tawakkul':'تَوَكُّل','tawbah':'تَوْبَة','repentance':'تَوْبَة',
  'mother':'أُمّ','father':'أَب','family':'أُسْرَة','love':'حُبّ','hope':'أَمَل','patience is beautiful':'فَصَبْرٌ جَمِيلٌ',
  'my lord':'رَبِّي','our lord':'رَبَّنَا','guide us':'اهْدِنَا','grant us':'آتِنَا','clarity':'صَفَاء','grave':'قَبْر'
};
function calligLocalTranslate(en){
  var k=String(en||'').trim().toLowerCase().replace(/\s+/g,' ');
  if(!k) return '';
  if(CALLIG_EN_AR_GLOSS[k]) return CALLIG_EN_AR_GLOSS[k];
  for(var key in CALLIG_EN_AR_GLOSS){ if(k.indexOf(key)!==-1) return CALLIG_EN_AR_GLOSS[key]; }
  return '';
}
async function calligGoogleTranslate(text, sl, tl){
  text=String(text||'').trim();
  if(!text) return '';
  sl=sl||'en'; tl=tl||'ar';
  if(sl==='auto') sl='auto';

  function parseGtx(payload){
    try{
      var data=(typeof payload==='string')?JSON.parse(payload):payload;
      var parts=[];
      if(Array.isArray(data) && Array.isArray(data[0])){
        data[0].forEach(function(row){
          if(Array.isArray(row) && row[0]) parts.push(String(row[0]));
          else if(typeof row==='string') parts.push(row);
        });
      } else if(data && data.sentences){
        data.sentences.forEach(function(s){ if(s&&s.trans) parts.push(String(s.trans)); });
      }
      return parts.join('').trim();
    }catch(e){ return ''; }
  }
  function parseClients5(data){
    try{
      if(typeof data==='string') data=JSON.parse(data);
      if(Array.isArray(data)){
        if(Array.isArray(data[0])) return String(data[0][0]||'').trim();
        return String(data[0]||'').trim();
      }
      return '';
    }catch(e){ return ''; }
  }
  async function fetchText(url){
    var res=await fetch(url, {method:'GET', credentials:'omit', cache:'no-store', mode:'cors'});
    if(!res.ok) throw new Error('http '+res.status);
    return res;
  }

  /* Chunk long text */
  var chunks=[];
  if(text.length<=420) chunks=[text];
  else {
    var words=text.split(/\s+/), buf='';
    words.forEach(function(w){
      if((buf+' '+w).trim().length>400){ if(buf) chunks.push(buf.trim()); buf=w; }
      else buf=(buf?buf+' ':'')+w;
    });
    if(buf.trim()) chunks.push(buf.trim());
  }

  var out=[];
  for(var c=0;c<chunks.length;c++){
    var q=chunks[c];
    var got='';

    /* 1) clients5 — more reliable under rate limits */
    if(!got){
      try{
        var u1='https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl='+encodeURIComponent(sl)+'&tl='+encodeURIComponent(tl)+'&q='+encodeURIComponent(q);
        var r1=await fetchText(u1);
        got=parseClients5(await r1.json());
      }catch(e){}
    }

    /* 2) Classic gtx endpoint */
    if(!got){
      try{
        var u2='https://translate.googleapis.com/translate_a/single?client=gtx&sl='+encodeURIComponent(sl)+'&tl='+encodeURIComponent(tl)+'&dt=t&q='+encodeURIComponent(q);
        var r2=await fetchText(u2);
        got=parseGtx(await r2.json());
      }catch(e){}
    }

    /* 3) Alternate Google path */
    if(!got){
      try{
        var u3='https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&dt=bd&sl='+encodeURIComponent(sl)+'&tl='+encodeURIComponent(tl)+'&q='+encodeURIComponent(q);
        var r3=await fetchText(u3);
        got=parseGtx(await r3.json());
      }catch(e){}
    }

    if(!got) return '';
    out.push(got);
  }
  return out.join(' ').replace(/\s+/g,' ').trim();
}
window.clarityGoogleTranslate = calligGoogleTranslate;

async function calligTranslateEnToAr(text){
  text=String(text||'').trim();
  if(!text) return '';
  var local=calligLocalTranslate(text);
  try{
    var gar=await calligGoogleTranslate(text, 'en', 'ar');
    if(gar && gar.toLowerCase()!==text.toLowerCase()){
      if(typeof calligVoice==='object' && calligVoice) calligVoice.lastTranslateSource='Google Translate';
      return gar;
    }
  }catch(e){}
  try{
    var url='https://api.mymemory.translated.net/get?q='+encodeURIComponent(text)+'&langpair=en|ar';
    var res=await fetch(url);
    if(res.ok){
      var data=await res.json();
      var ar=(data&&data.responseData&&data.responseData.translatedText)||'';
      ar=String(ar).trim();
      if(ar && ar.toLowerCase()!==text.toLowerCase() && ar.toLowerCase().indexOf('invalid')<0){
        if(typeof calligVoice==='object' && calligVoice) calligVoice.lastTranslateSource='MyMemory';
        return ar;
      }
    }
  }catch(e){}
  try{
    var lt=await fetch('https://libretranslate.com/translate', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({q:text, source:'en', target:'ar', format:'text'})
    });
    if(lt.ok){
      var lj=await lt.json();
      var lar=String((lj&&lj.translatedText)||'').trim();
      if(lar && lar.toLowerCase()!==text.toLowerCase()){
        if(typeof calligVoice==='object' && calligVoice) calligVoice.lastTranslateSource='LibreTranslate';
        return lar;
      }
    }
  }catch(e){}
  if(local){
    if(typeof calligVoice==='object' && calligVoice) calligVoice.lastTranslateSource='Glossary';
    return local;
  }
  return '';
}
async function calligTranslateToArabic(){
  var el=document.getElementById('callig-english-input');
  var btn=document.getElementById('callig-translate-btn');
  var t=(el&&el.value||'').trim();
  if(!t){ alert('Type an English phrase first.'); return; }
  var tip=document.getElementById('callig-tajweed-tip');
  if(btn){ btn.disabled=true; btn.textContent='…'; }
  if(tip) tip.textContent='Translating to Arabic…';
  calligPreviewTranslation(t, '…');
  try{
    var ar=await calligTranslateEnToAr(t);
    if(!ar){
      if(tip) tip.textContent='Could not translate — try a simpler phrase or use EN canvas.';
      calligPreviewTranslation(t, '');
      return;
    }
    calligPreviewTranslation(t, ar);
    try{
      var vt=document.getElementById('callig-voice-text'); if(vt) vt.value=t;
      var va=document.getElementById('callig-voice-ar'); if(va) va.value=ar;
      if(typeof calligMicSetArabic==='function') calligMicSetArabic(ar);
    }catch(e){}
    calligSetGuideText(ar, {clearStrokes:true, resetPan:true});
    if(tip) tip.innerHTML='🌐 Arabic guide set — trace with finger';
    try{ if(typeof calligSpeak==='function') calligSpeak(ar); }catch(e){}
  }finally{
    if(btn){ btn.disabled=false; btn.textContent='🌐 EN → AR'; }
  }
}
function calligSendEnglishToCanvas(){
  var el=document.getElementById('callig-english-input');
  var t=(el&&el.value||'').trim();
  if(!t){ alert('Type an English phrase first.'); return; }
  calligSetGuideText(t, {clearStrokes:true, resetPan:true});
  calligPreviewTranslation(t, '');
  try{
    if(window.speechSynthesis){
      window.speechSynthesis.cancel();
      var u=new SpeechSynthesisUtterance(t);
      u.lang='en-US'; u.rate=0.9;
      window.speechSynthesis.speak(u);
    }
  }catch(e){}
  var tip=document.getElementById('callig-tajweed-tip');
  if(tip) tip.innerHTML='<strong>Practice</strong> — English guide on canvas. Use <strong>EN → AR</strong> for Arabic calligraphy.';
}
/* ---- Voice capture (English) → canvas ---- */
var calligVoice = {
  rec: null,
  stream: null,
  chunks: [],
  listening: false,
  finals: '',
  interim: '',
  lastTranslateAt: 0,
  translateTimer: null,
  translateToken: 0,
  lastAr: '',
  lastTranslateSource: '',
  startedAt: 0,
  autoTimer: null,
  token: 0
};

function calligVoiceSupported() {
  try{
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  }catch(e){ return false; }
}

function calligMicStatus(msg, listening) {
  var st = document.getElementById('callig-voice-status');
  var stTop = document.getElementById('callig-voice-status-top');
  var stop = document.getElementById('callig-mic-stop');
  var stopTop = document.getElementById('callig-mic-stop-top');
  var wrap = document.getElementById('callig-stage-wrap');
  var btn = document.getElementById('callig-mic-btn');
  var btnTop = document.getElementById('callig-mic-btn-top');
  if (st) {
    st.textContent = msg || 'Mic ready';
    st.classList.toggle('live', !!listening);
  }
  if (stTop) {
    stTop.textContent = msg || 'Mic ready';
    stTop.classList.toggle('live', !!listening);
  }
  if (stopTop) {
    stopTop.disabled = !listening;
  }
  if (btnTop) btnTop.classList.toggle('recording', !!listening);

  if (stop) {
    stop.disabled = !listening;
    stop.classList.toggle('show', !!listening);
  }
  if (wrap) wrap.classList.toggle('listening', !!listening);
  if (btn) btn.classList.toggle('recording', !!listening);
}

function calligMicGetEnglish() {
  var box = document.getElementById('callig-voice-text');
  var t = box ? String(box.value || '').trim() : '';
  if (t) return t;
  var en = document.getElementById('callig-english-input');
  return en ? String(en.value || '').trim() : '';
}

function calligMicGetArabic() {
  var box = document.getElementById('callig-voice-ar');
  return box ? String(box.value || '').trim() : (calligVoice.lastAr || '');
}

function calligMicSetEnglish(text) {
  text = String(text || '').trim();
  var box = document.getElementById('callig-voice-text');
  if (box) box.value = text;
  var en = document.getElementById('callig-english-input');
  if (en) en.value = text;
}

function calligMicSetArabic(text) {
  text = String(text || '').trim();
  calligVoice.lastAr = text;
  var box = document.getElementById('callig-voice-ar');
  if (box) box.value = text;
  try { calligPreviewTranslation(calligMicGetEnglish(), text); } catch (e) {}
}

function calligLiveTranslateEnabled() {
  var el = document.getElementById('callig-live-ar');
  return !el || !!el.checked;
}

async function calligRunLiveTranslate(text, force) {
  text = String(text || '').trim();
  if (!text) {
    calligMicSetArabic('');
    return '';
  }
  if (!calligLiveTranslateEnabled() && !force) return calligMicGetArabic();
  var now = Date.now();
  calligVoice.lastTranslateAt = now;
  var token = (calligVoice.translateToken = (calligVoice.translateToken || 0) + 1);
  try {
    var ar = await calligTranslateEnToAr(text);
    /* ignore stale responses when user keeps speaking */
    if (token !== calligVoice.translateToken) return calligMicGetArabic();
    if (ar) {
      calligMicSetArabic(ar);
      var src = calligVoice.lastTranslateSource || 'Google Translate';
      if (calligVoice.listening) {
        calligMicStatus('Live · ' + src + ' · ' + text.slice(0, 28) + (text.length > 28 ? '…' : ''), true);
      }
    }
    return ar || '';
  } catch (e) {
    return '';
  }
}

function calligScheduleLiveTranslate(text) {
  if (calligVoice.translateTimer) clearTimeout(calligVoice.translateTimer);
  calligVoice.translateTimer = setTimeout(function () {
    calligRunLiveTranslate(text, false);
  }, 280);
}

function calligLiveTranslateFromCapture() {
  var t = calligMicGetEnglish();
  calligScheduleLiveTranslate(t);
}

function calligLiveTranslateFromInput() {
  var en = document.getElementById('callig-english-input');
  var t = en ? String(en.value || '').trim() : '';
  var box = document.getElementById('callig-voice-text');
  if (box && t && !calligVoice.listening) box.value = t;
  calligScheduleLiveTranslate(t);
}

function calligPlaceArabicOnCanvas() {
  var ar = calligMicGetArabic();
  if (!ar) {
    calligMicStatus('No Arabic yet — translate first', !!calligVoice.listening);
    return;
  }
  try {
    calligSetGuideText(ar, { clearStrokes: true, resetPan: true });
    calligPreviewTranslation(calligMicGetEnglish(), ar);
    calligMicStatus('Arabic on canvas', !!calligVoice.listening);
    var tip = document.getElementById('callig-tajweed-tip');
    if (tip) tip.innerHTML = '🌐 Arabic guide on canvas — trace with finger';
    try { if (typeof calligSpeak === 'function') calligSpeak(ar); } catch (e) {}
  } catch (e) {}
}

function calligMicPlaceEnglish() {
  var said = calligMicGetEnglish();
  if (!said) {
    calligMicStatus('No English text to place', !!calligVoice.listening);
    return;
  }
  try {
    calligSetGuideText(said, { clearStrokes: true, resetPan: true });
    calligPreviewTranslation(said, calligMicGetArabic());
    calligMicStatus('English on canvas', !!calligVoice.listening);
  } catch (e) {}
}

function calligMicPlaceArabic() {
  return calligPlaceArabicOnCanvas();
}

function calligMicKillRec() {
  try{ if(calligVoice.autoTimer){ clearTimeout(calligVoice.autoTimer); calligVoice.autoTimer = null; } }catch(e){}
  try{
    var rec = calligVoice.rec;
    if(rec){
      try{ rec.ondataavailable = null; }catch(e){}
      try{ if(rec.state && rec.state !== 'inactive') rec.stop(); }catch(e){}
    }
  }catch(e){}
  calligVoice.rec = null;
  try{
    if(calligVoice.stream){
      calligVoice.stream.getTracks().forEach(function(t){ try{ t.stop(); }catch(e){} });
    }
  }catch(e){}
  calligVoice.stream = null;
}

function calligMicSetUi(recording){
  calligVoice.listening = !!recording;
  var stop = document.getElementById('callig-mic-stop');
  var btn = document.getElementById('callig-mic-btn');
  var wrap = document.getElementById('callig-stage-wrap');
  var st = document.getElementById('callig-voice-status');
  if(stop){
    stop.disabled = false; /* always clickable — handler no-ops if idle */
    stop.removeAttribute('disabled');
    stop.classList.toggle('show', !!recording);
    stop.style.opacity = recording ? '1' : '0.45';
    stop.style.pointerEvents = 'auto';
  }
  if(btn){
    btn.classList.toggle('recording', !!recording);
    btn.textContent = recording ? '🎤 Recording…' : '🎤 Start';
  }
  if(wrap) wrap.classList.toggle('listening', !!recording);
}

function calligMicStatus(msg, listening) {
  var st = document.getElementById('callig-voice-status');
  if(st){
    st.textContent = msg || 'Mic ready';
    st.classList.toggle('live', !!listening);
  }
  if(typeof listening === 'boolean') calligMicSetUi(listening);
  var badge = document.getElementById('callig-wsp-badge');
  if(badge){
    try{
      if(typeof vtState !== 'undefined' && vtState && vtState.whisper) badge.textContent = 'Whisper-tiny · ready';
      else badge.textContent = 'Whisper-tiny';
    }catch(e){ badge.textContent = 'Whisper-tiny'; }
  }
}

async function calligMicEnsureWhisper(){
  try{
    if(typeof vtEnsureWhisper === 'function'){
      var w = await vtEnsureWhisper(false);
      if(w) return w;
    }
  }catch(e){}
  try{
    if(typeof clarityVoiceEnsureWhisper === 'function') return await clarityVoiceEnsureWhisper();
  }catch(e){}
  try{
    if(typeof vtState !== 'undefined' && vtState && vtState.whisper) return vtState.whisper;
  }catch(e){}
  calligMicStatus('Loading Whisper-tiny…', calligVoice.listening);
  var mod = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2');
  try{ if(mod.env){ mod.env.allowLocalModels = false; mod.env.useBrowserCache = true; } }catch(e){}
  var pipe = await mod.pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny', {
    quantized: true,
    progress_callback: function(p){
      try{
        if(p && p.status === 'progress' && p.total)
          calligMicStatus('Downloading Whisper-tiny… ' + Math.round(100*p.loaded/p.total) + '%', false);
      }catch(e){}
    }
  });
  try{ if(typeof vtState !== 'undefined' && vtState){ vtState.whisper = pipe; vtState.modelReady = true; } }catch(e){}
  return pipe;
}

async function calligMicBlobToFloat32(blob){
  if(typeof vtBlobToFloat32 === 'function'){ try{ return await vtBlobToFloat32(blob); }catch(e){} }
  if(typeof clarityVoiceBlobToFloat32 === 'function'){ try{ return await clarityVoiceBlobToFloat32(blob); }catch(e){} }
  var buf = await blob.arrayBuffer();
  var AC = window.AudioContext || window.webkitAudioContext;
  var ctx = new AC();
  var decoded = await ctx.decodeAudioData(buf.slice(0));
  var ch = decoded.getChannelData(0);
  var sr = decoded.sampleRate;
  if(Math.abs(sr - 16000) < 50){ try{ ctx.close(); }catch(e){} return ch; }
  var ratio = sr / 16000;
  var outLen = Math.floor(ch.length / ratio);
  var out = new Float32Array(outLen);
  for(var i=0;i<outLen;i++) out[i] = ch[Math.floor(i*ratio)];
  try{ ctx.close(); }catch(e){}
  return out;
}

async function calligMicTranscribe(blob){
  var asr = await calligMicEnsureWhisper();
  if(!asr) throw new Error('Whisper-tiny unavailable');
  var audio = await calligMicBlobToFloat32(blob);
  if(!audio || !audio.length) throw new Error('Empty audio');
  var peak = 0;
  for(var i=0;i<audio.length;i+=40){ var v=Math.abs(audio[i]); if(v>peak) peak=v; }
  if(peak < 0.005) throw new Error('Too quiet — speak louder');
  calligMicStatus('Whisper-tiny transcribing…', false);
  var result = await asr(audio, {
    return_timestamps: false,
    chunk_length_s: 20,
    stride_length_s: 3,
    language: 'english',
    task: 'transcribe'
  });
  var text = '';
  if(typeof result === 'string') text = result;
  else if(result && result.text) text = result.text;
  else if(result && result[0] && result[0].text) text = result[0].text;
  return String(text||'').trim();
}

function calligMicToggle(){
  if(calligVoice.listening) calligMicStop();
  else calligMicStart();
}

function calligMicStart() {
  if(calligVoice.listening){ calligMicStop(); return; }
  if(!calligVoiceSupported()){
    calligMicStatus('Mic unsupported — type English instead', false);
    return;
  }
  if(!window.isSecureContext && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1'){
    calligMicStatus('Mic needs HTTPS', false);
    return;
  }
  calligMicKillRec();
  calligVoice.chunks = [];
  calligVoice.finals = '';
  calligVoice.token = (calligVoice.token||0) + 1;
  var myToken = calligVoice.token;
  calligVoice.startedAt = Date.now();
  calligMicSetEnglish('');
  calligMicSetArabic('');
  calligMicSetUi(true);
  calligMicStatus('Allow mic if asked…', true);

  navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 }
  }).then(function(stream){
    if(calligVoice.token !== myToken || !calligVoice.listening){
      try{ stream.getTracks().forEach(function(t){ t.stop(); }); }catch(e){}
      return;
    }
    calligVoice.stream = stream;
    var mime = '';
    try{
      if(MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) mime = 'audio/webm;codecs=opus';
      else if(MediaRecorder.isTypeSupported('audio/webm')) mime = 'audio/webm';
      else if(MediaRecorder.isTypeSupported('audio/mp4')) mime = 'audio/mp4';
    }catch(e){}
    var rec;
    try{ rec = mime ? new MediaRecorder(stream, {mimeType:mime}) : new MediaRecorder(stream); }
    catch(e){ rec = new MediaRecorder(stream); }
    calligVoice.rec = rec;
    calligVoice.chunks = [];
    rec.ondataavailable = function(ev){
      if(ev.data && ev.data.size) calligVoice.chunks.push(ev.data);
    };
    try{ rec.start(200); }catch(e){
      calligMicSetUi(false);
      calligMicStatus('Could not start recorder', false);
      calligMicKillRec();
      return;
    }
    calligMicStatus('Recording… speak, then tap Stop', true);
    calligVoice.autoTimer = setTimeout(function(){
      if(calligVoice.listening && calligVoice.token === myToken) calligMicStop();
    }, 8000);
  }).catch(function(err){
    console.warn('callig getUserMedia', err);
    calligMicSetUi(false);
    calligMicKillRec();
    calligMicStatus('Microphone blocked — allow mic in site settings', false);
  });
}

function calligMicStop() {
  if(!calligVoice.listening && !calligVoice.rec){
    calligMicStatus('Mic ready (Whisper-tiny)', false);
    return;
  }
  var startedAt = calligVoice.startedAt || Date.now();
  var chunks = (calligVoice.chunks || []).slice();
  var rec = calligVoice.rec;
  var mime = (rec && rec.mimeType) || 'audio/webm';
  var myToken = calligVoice.token;

  /* UI: leave recording mode immediately so Stop feels responsive */
  calligVoice.listening = false;
  if(calligVoice.autoTimer){ clearTimeout(calligVoice.autoTimer); calligVoice.autoTimer = null; }
  calligMicSetUi(false);
  calligMicStatus('Stopping…', false);

  function afterBlob(blob){
    calligMicKillRec();
    var elapsed = Date.now() - startedAt;
    if(calligVoice.token !== myToken) return;
    if(elapsed < 600){
      calligMicStatus('Too short — hold 2+ seconds', false);
      return;
    }
    if(!blob || blob.size < 600){
      calligMicStatus('No audio — check mic permission', false);
      return;
    }
    calligMicStatus('Whisper-tiny processing…', false);
    calligMicTranscribe(blob).then(function(text){
      if(calligVoice.token !== myToken) return;
      if(!text){
        calligMicStatus('Could not understand — try again', false);
        return;
      }
      calligVoice.finals = text;
      calligMicSetEnglish(text);
      calligMicStatus('Heard: “'+text+'” · translating…', false);
      if(typeof calligRunLiveTranslate === 'function'){
        return calligRunLiveTranslate(text, true).then(function(ar){
          if(ar){
            if(typeof calligPlaceArabicOnCanvas === 'function') calligPlaceArabicOnCanvas();
            else if(typeof calligMicPlaceArabic === 'function') calligMicPlaceArabic();
            calligMicStatus('Done · Arabic on canvas', false);
          } else {
            if(typeof calligMicPlaceEnglish === 'function') calligMicPlaceEnglish();
            calligMicStatus('English ready (translate unavailable)', false);
          }
        });
      }
    }).catch(function(err){
      console.warn('callig whisper', err);
      calligMicStatus('Whisper error: ' + ((err && err.message) || err), false);
    });
  }

  if(!rec){
    afterBlob(new Blob(chunks, {type: mime}));
    return;
  }
  var done = false;
  var finish = function(){
    if(done) return;
    done = true;
    afterBlob(new Blob(chunks, {type: mime}));
  };
  try{ rec.ondataavailable = function(ev){ if(ev.data && ev.data.size) chunks.push(ev.data); }; }catch(e){}
  rec.onstop = finish;
  try{
    if(rec.state !== 'inactive') rec.stop();
    else finish();
  }catch(e){ finish(); }
  setTimeout(finish, 1200);
}

function calligMicOnResult(ev){ return; }

function calligMicOnResult(ev){
  /* legacy Web Speech handler kept as no-op for old callers */
  return;
}

/* aliases */
function calligStartVoiceCapture() { return calligMicStart(); }
function calligStopVoiceCapture() { return calligMicStop(); }
function calligToggleVoiceCapture() { return calligMicToggle(); }
function calligVoiceTranslateToArabic() { return calligMicStart(); }
function calligMicPlaceOnCanvas() { return calligMicPlaceArabic(); }

function calligSendEnglishToMeme(){
  var el=document.getElementById('callig-english-input');
  var t=(el&&el.value||'').trim();
  if(!t){ alert('Type an English phrase first.'); return; }
  /* put on meme middle line, calligraphy font */
  memeState = memeState || {};
  memeState.mid = t;
  memeState.top = memeState.top || 'Clarity';
  memeState.bottom = memeState.bottom || '— Furnish Your Grave';
  memeState.font = 'naskh';
  memeState.style = 'gold';
  var m=document.getElementById('meme-mid-input'); if(m) m.value=t;
  var top=document.getElementById('meme-top-input'); if(top&&!top.value) top.value=memeState.top;
  var b=document.getElementById('meme-bottom-input'); if(b&&!b.value) b.value=memeState.bottom;
  var fe=document.getElementById('meme-font'); if(fe) fe.value='naskh';
  try{ if(typeof memeSetFont==='function') memeSetFont('naskh'); }catch(e){}
  try{ if(typeof memeDraw==='function') memeDraw(); }catch(e){}
  var card=document.getElementById('meme-card');
  if(card) card.scrollIntoView({behavior:'smooth',block:'start'});
}
var memeSpeakQueue=[];
var memeSpeakActive=false;
function memeSanitizeSpeakText(raw){
  var t=String(raw==null?'':raw);
  t=t.replace(/<[^>]*>/g,' ');
  t=t.replace(/https?:\/\/\S+/gi,' ');
  t=t.replace(/[<>{}[\]`]+/g,' ');
  t=t.replace(/[\u0000-\u001F\u007F]/g,' ');
  t=t.replace(/\s+/g,' ').trim();
  if(t.length>420) t=t.slice(0,420);
  return t;
}
function memeCollectSpeakLines(){
  var t=(document.getElementById('meme-top-input')||{}).value;
  var m=(document.getElementById('meme-mid-input')||{}).value;
  var b=(document.getElementById('meme-bottom-input')||{}).value;
  if(typeof memeState!=='undefined'){
    if(!t) t=memeState.top||'';
    if(!m) m=memeState.mid||'';
    if(!b) b=memeState.bottom||'';
  }
  var parts=[t,m,b].map(memeSanitizeSpeakText).filter(Boolean);
  if(!parts.length){
    parts=['Clarity','Send light ahead for the long stay','Furnish your grave'];
    try{
      if(typeof memeState!=='undefined'){
        memeState.top=parts[0]; memeState.mid=parts[1]; memeState.bottom=parts[2];
        var ti=document.getElementById('meme-top-input'); if(ti&&!ti.value) ti.value=parts[0];
        var mi=document.getElementById('meme-mid-input'); if(mi&&!mi.value) mi.value=parts[1];
        var bi=document.getElementById('meme-bottom-input'); if(bi&&!bi.value) bi.value=parts[2];
        if(typeof memeDraw==='function') memeDraw();
      }
    }catch(e){}
  }
  return parts;
}
function memeSetSpeakUI(on){
  memeSpeakActive=!!on;
  var fab=document.getElementById('meme-audio-fab');
  var btn=document.getElementById('meme-hear-btn');
  if(fab){
    fab.setAttribute('data-playing', on?'1':'0');
    fab.innerHTML = on ? '<span class="fab-dot"></span> Stop' : '▶ Listen';
  }
  if(btn){
    btn.classList.toggle('playing', !!on);
    btn.textContent = on ? '⏹ Stop audio' : '🔊 Hear meme';
  }
}
function memeStopSpeak(){
  memeSpeakQueue=[];
  try{ if(window.speechSynthesis) speechSynthesis.cancel(); }catch(e){}
  memeSetSpeakUI(false);
}
function memePickVoice(lang){
  var voices=[];
  try{ voices=window.speechSynthesis.getVoices()||[]; }catch(e){ voices=[]; }
  var pref=(lang||'en').toLowerCase();
  var hit=voices.find(function(v){ return (v.lang||'').toLowerCase().indexOf(pref)===0; });
  if(hit) return hit;
  if(pref.indexOf('ar')===0){
    hit=voices.find(function(v){ return /arabic|ar[-_]/i.test((v.lang||'')+' '+(v.name||'')); });
  } else if(pref.indexOf('ur')===0){
    hit=voices.find(function(v){ return /urdu|ur[-_]/i.test((v.lang||'')+' '+(v.name||'')); })
      || voices.find(function(v){ return /arabic|ar[-_]/i.test((v.lang||'')+' '+(v.name||'')); });
  } else {
    hit=voices.find(function(v){ return /^en/i.test(v.lang||''); });
  }
  return hit||voices[0]||null;
}
function memeLangForText(text){
  if(/[\u0600-\u06FF]/.test(text)){
    if(/[\u0679\u0688\u0691\u06BA\u06C1\u06BE\u06D2]/.test(text)) return 'ur-PK';
    return 'ar-SA';
  }
  return 'en-US';
}
function memeSpeakNext(){
  if(!memeSpeakQueue.length){ memeSetSpeakUI(false); return; }
  if(!window.speechSynthesis){ memeSetSpeakUI(false); return; }
  var item=memeSpeakQueue.shift();
  var u=new SpeechSynthesisUtterance(item.text);
  u.lang=item.lang;
  u.rate=item.lang.indexOf('ar')===0?0.82:0.94;
  u.pitch=1;
  var voice=memePickVoice(item.lang);
  if(voice) u.voice=voice;
  u.onend=function(){ memeSpeakNext(); };
  u.onerror=function(){ memeSpeakNext(); };
  try{ speechSynthesis.speak(u); }catch(e){ memeSpeakNext(); }
}
function memeEnsureVoices(cb){
  var ready=function(){ cb && cb(); };
  try{
    if(!window.speechSynthesis){ ready(); return; }
    var v=speechSynthesis.getVoices()||[];
    if(v.length){ ready(); return; }
    var done=false;
    var finish=function(){ if(done)return; done=true; ready(); };
    speechSynthesis.onvoiceschanged=finish;
    setTimeout(finish, 700);
  }catch(e){ ready(); }
}
function memeToggleSpeak(ev){
  try{ if(ev){ ev.preventDefault(); ev.stopPropagation(); } }catch(e){}
  if(memeSpeakActive){ memeStopSpeak(); return; }
  memeSpeakCard();
}
function memeSpeakCard(){
  try{
    if(!window.speechSynthesis){
      alert('Speech is not available in this browser. Try Chrome, Edge, or Safari.');
      return;
    }
    memeStopSpeak();
    var parts=memeCollectSpeakLines();
    if(typeof claritySpeakArabic==='function'){
      memeSetSpeakUI(true);
      var btn=document.getElementById('meme-hear-btn')||document.getElementById('meme-audio-fab');
      claritySpeakArabic(parts, {asLines:true, btn:btn, rate:0.9});
      /* claritySpeakStop clears playing UI via memeSetSpeakUI bridge on stop */
      var prevStop=window.claritySpeakStop;
      /* ensure UI resets: poll */
      var iv=setInterval(function(){
        try{
          if(!window.speechSynthesis || !speechSynthesis.speaking && !speechSynthesis.pending){
            memeSetSpeakUI(false); clearInterval(iv);
          }
        }catch(e){ clearInterval(iv); }
      }, 400);
      setTimeout(function(){ try{ clearInterval(iv); memeSetSpeakUI(false); }catch(e){} }, 120000);
      return;
    }
    memeSpeakQueue=parts.map(function(text){
      return {text:text, lang:memeLangForText(text)};
    });
    memeSetSpeakUI(true);
    memeEnsureVoices(function(){
      if(!memeSpeakActive) return;
      setTimeout(function(){ if(memeSpeakActive) memeSpeakNext(); }, 60);
    });
  }catch(e){
    console.warn('memeSpeakCard', e);
    memeSetSpeakUI(false);
  }
}
try{
  if(window.speechSynthesis){
    speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged=function(){ try{ speechSynthesis.getVoices(); }catch(e){} };
  }
}catch(e){}

var CALLIG_PROGRESS_KEY='clarity_callig_progress_v1';
function calligProgressLoad(){
  try{ return JSON.parse((window.clarityLS||localStorage).getItem(CALLIG_PROGRESS_KEY)||'{}'); }catch(e){ return {}; }
}
function calligProgressSave(p){
  try{ (window.clarityLS||localStorage).setItem(CALLIG_PROGRESS_KEY, JSON.stringify(p||{})); }catch(e){}
}

function calligMarkProgress(){ return calligMarkPracticed(); }
function calligPronounce(){ try{ calligSpeak(calligState.glyph); }catch(e){} }
function calligPlayGlyph(){ try{ calligSpeak(calligState.glyph); }catch(e){} }
function calligDownload(){
  try{
    var c=document.getElementById('callig-canvas');
    if(!c) return;
    var a=document.createElement('a');
    a.href=c.toDataURL('image/png');
    a.download='clarity-calligraphy.png';
    a.click();
  }catch(e){ console.warn(e); }
}
function calligFocusWhisper(){
  var p=document.getElementById('callig-mic-panel');
  if(p && p.scrollIntoView) p.scrollIntoView({behavior:'smooth',block:'center'});
  try{ if(typeof calligMicToggle==='function') calligMicToggle(); }catch(e){}
}
window.calligMarkProgress=calligMarkProgress;
window.calligPronounce=calligPronounce;
window.calligPlayGlyph=calligPlayGlyph;
window.calligDownload=calligDownload;
window.calligFocusWhisper=calligFocusWhisper;

function calligMarkPracticed(){
  var p=calligProgressLoad();
  var g=calligState.glyph||'ا';
  var day=new Date().toISOString().slice(0,10);
  p.total=(p.total||0)+1;
  p.last=g;
  p.lastDay=day;
  p.byGlyph=p.byGlyph||{};
  p.byGlyph[g]=(p.byGlyph[g]||0)+1;
  if(p.streakDay===day){ /* same day */ }
  else if(p.streakDay){
    var prev=new Date(p.streakDay); var now=new Date(day);
    var diff=(now-prev)/86400000;
    p.streak = (diff===1) ? ((p.streak||0)+1) : 1;
  } else p.streak=1;
  p.streakDay=day;
  calligProgressSave(p);
  calligProgressRender();
  var tip=document.getElementById('callig-tajweed-tip');
  if(tip) tip.innerHTML='✓ Logged <strong>'+g+'</strong> — total '+p.total+' · streak '+(p.streak||1)+' day(s)';
}
function calligProgressRender(){
  var box=document.getElementById('callig-progress-body'); if(!box) return;
  var p=calligProgressLoad();
  var entries=Object.keys(p.byGlyph||{}).map(function(k){ return {g:k,n:p.byGlyph[k]}; });
  entries.sort(function(a,b){ return b.n-a.n; });
  var lines=entries.slice(0,12).map(function(e){ return '<span style="display:inline-block;margin:.15rem .35rem .15rem 0;padding:.15rem .45rem;border-radius:999px;border:1px solid var(--border)">'+e.g+' ×'+e.n+'</span>'; }).join('');
  box.innerHTML='<div><strong>Streak:</strong> '+(p.streak||0)+' · <strong>Total marks:</strong> '+(p.total||0)+
    (p.last?(' · <strong>Last:</strong> '+p.last):'')+'</div><div style="margin-top:.35rem">'+
    (lines||'<span style="color:var(--text-muted)">No practice marked yet.</span>')+'</div>';
}
function calligProgressReset(){
  if(!confirm('Reset calligraphy practice log on this device?')) return;
  calligProgressSave({});
  calligProgressRender();
}

function calligResetView(){
  try{
    calligState.scale = 100;
    calligState.offsetX = 0;
    calligState.offsetY = 0;
    var scaleEl = document.getElementById("callig-scale");
    if (scaleEl) scaleEl.value = "100";
    var lab = document.getElementById("callig-scale-val");
    if (lab) lab.textContent = "100%";
    var ox = document.getElementById("callig-offset-x");
    var oy = document.getElementById("callig-offset-y");
    if (ox) ox.value = "0";
    if (oy) oy.value = "0";
    var oxv = document.getElementById("callig-offset-x-val");
    var oyv = document.getElementById("callig-offset-y-val");
    if (oxv) oxv.textContent = "0";
    if (oyv) oyv.textContent = "0";
    if (typeof calligDrawGuide === "function") calligDrawGuide();
    if (typeof calligRedraw === "function") calligRedraw();
  } catch(e){ console.warn("calligResetView", e); }
}
window.calligResetView = calligResetView;

function calligSetScale(v){
  try{
  v=Math.max(40, Math.min(160, +v||100));
  var old=calligState.scale||100;
  if(old<1) old=100;
  var origin=calligGuideOrigin();
  calligState.scale=v;
  var scaleEl=document.getElementById('callig-scale');
  if(scaleEl) scaleEl.value=String(v);
  var lab=document.getElementById('callig-scale-val'); if(lab) lab.textContent=v+'%';
  calligClampOffsets();
  /* Keep practice ink locked to the guide when scaling */
  calligScaleStrokesAround(origin.cx, origin.cy, v/old);
  calligDrawGuide();
  }catch(e){console.warn("calligSetScale",e);}
}

async function calligFetchDailyVerse(){
  var tip=document.getElementById('callig-tajweed-tip');
  if(tip) tip.textContent='Fetching a short verse for practice…';
  try{
    /* Prefer a short ayah — random 1–6 length-ish via API */
    var chapter=Math.floor(Math.random()*114)+1;
    var res=await fetch('https://api.quran.com/api/v4/verses/by_chapter/'+chapter+'?language=en&words=false&per_page=1&page=1');
    if(!res.ok) throw new Error('api');
    var data=await res.json();
    var v=(data.verses&&data.verses[0])||null;
    var key=v&&v.verse_key;
    /* Arabic text */
    var arRes=await fetch('https://api.quran.com/api/v4/quran/verses/uthmani?verse_key='+encodeURIComponent(key));
    var arJson=await arRes.json();
    var ar=(arJson.verses&&arJson.verses[0]&&arJson.verses[0].text_uthmani)||'';
    if(!ar) throw new Error('no ar');
    /* Full verse — auto-scale so it stays inside the canvas, then user may scale/pan to practice */
    calligState.glyph=ar;
    calligState.strokes=[]; calligState.cur=null; calligState.drawing=false;
    calligState.offsetX=0; calligState.offsetY=0;
    try{ calligAutoFitScale({padX:40, padY:28}); }catch(e){ calligState.scale=70; }
    calligDrawGuide();
    if(tip){ tip.innerHTML=''; var wrap=document.createElement('div'); wrap.innerHTML='📖 <strong></strong> — auto-scaled. Trace with finger (stylus feel). '; wrap.querySelector('strong').textContent=key||''; var btn=document.createElement('button'); btn.type='button'; btn.className='clarity-stream-btn'; btn.textContent='🔊 Alafasy stream'; btn.onclick=function(){ clarityStreamAyah(key, btn); }; wrap.appendChild(btn); wrap.appendChild(document.createTextNode(' · ')); var a=document.createElement('a'); a.href='https://quran.com/'+String(key||'').replace(':','/'); a.target='_blank'; a.rel='noopener'; a.textContent='quran.com'; wrap.appendChild(a); tip.appendChild(wrap); }
    calligSpeak(ar);
  }catch(e){
    /* offline fallback */
    var fallbacks=[
      {k:'1:1', ar:'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'},
      {k:'2:2', ar:'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ'},
      {k:'112:1', ar:'قُلْ هُوَ اللَّهُ أَحَدٌ'},
      {k:'103:1', ar:'وَالْعَصْرِ'},
      {k:'110:1', ar:'إِذَا جَاءَ نَصْرُ اللَّهِ'}
    ];
    var f=fallbacks[Math.floor(Math.random()*fallbacks.length)];
    calligState.glyph=f.ar;
    calligState.strokes=[]; calligState.cur=null; calligState.drawing=false;
    calligState.offsetX=0; calligState.offsetY=0;
    try{ calligAutoFitScale({padX:40, padY:28}); }catch(e){ calligState.scale=80; }
    calligDrawGuide();
    if(tip) tip.innerHTML='📖 <strong>'+f.k+'</strong> (offline sample) — auto-scaled to fit. Adjust Scale / pan, then trace.';
    calligSpeak(f.ar);
  }
}

function calligScorePractice(){
  var c=document.getElementById('callig-canvas'); if(!c) return;
  if(!(calligState.strokes&&calligState.strokes.length)){
    alert('Write something on the canvas first, then score.');
    return;
  }
  var w=c.width, h=c.height;
  /* Offscreen: guide only */
  var g=document.createElement('canvas'); g.width=w; g.height=h;
  var gctx=g.getContext('2d');
  gctx.fillStyle='#fff'; gctx.fillRect(0,0,w,h);
  gctx.fillStyle='#000';
  var glyph=String(calligState.glyph||'ا');
  var isLatin=/[A-Za-z]/.test(glyph);
  if(isLatin){
    gctx.font="600 "+Math.round(48*((calligState.scale||100)/100))+"px 'Cormorant Garamond', Georgia, serif";
    gctx.direction='ltr';
  } else {
    gctx.font=calligFont();
    gctx.direction='rtl';
  }
  gctx.textAlign='center'; gctx.textBaseline='middle';
  gctx.fillText(glyph, w/2, h/2);

  /* Offscreen: user strokes only */
  var u=document.createElement('canvas'); u.width=w; u.height=h;
  var uctx=u.getContext('2d');
  uctx.fillStyle='#fff'; uctx.fillRect(0,0,w,h);
  uctx.strokeStyle='#000';
  (calligState.strokes||[]).forEach(function(st){
    calligStrokePath(uctx, st);
  });

  var gData=gctx.getImageData(0,0,w,h).data;
  var uData=uctx.getImageData(0,0,w,h).data;
  var guideCount=0, hit=0, userInk=0;
  /* sample every 2nd pixel for speed */
  for(var i=0;i<gData.length;i+=8){
    var gInk = gData[i]<200; /* dark */
    var uInk = uData[i]<200;
    if(gInk){ guideCount++; if(uInk) hit++; }
    if(uInk) userInk++;
  }
  if(guideCount<20){
    alert('Guide too faint to score — turn Guide on and try a clearer glyph.');
    return;
  }
  var coverage = hit / guideCount; /* how much of guide was traced */
  var precision = userInk>0 ? (hit / userInk) : 0; /* ink on guide vs stray */
  var score = Math.round(100 * (0.65*coverage + 0.35*precision));
  score = Math.max(0, Math.min(100, score));
  var stars = score>=85 ? '★★★★★' : score>=70 ? '★★★★' : score>=55 ? '★★★' : score>=40 ? '★★' : '★';
  var msg = 'Score <strong>'+score+'</strong>/100 '+stars+' · cover '+Math.round(coverage*100)+'% · precision '+Math.round(precision*100)+'%';
  var out=document.getElementById('callig-score-out');
  if(out){
    out.innerHTML = msg;
    out.scrollIntoView({behavior:'smooth', block:'nearest'});
  }
  /* Do NOT put score on tajweed tip (above canvas) */
  var tip=document.getElementById('callig-tajweed-tip');
  if(tip && /Score\s*<strong>/.test(tip.innerHTML||'')) tip.innerHTML = 'Select a letter, then Pronounce for tajweed-style tips.';
  /* soft celebrate */
  try{
    if(score>=70 && window.speechSynthesis){
      var utter=new SpeechSynthesisUtterance(score>=85 ? 'Excellent effort' : 'Good practice');
      utter.rate=1; window.speechSynthesis.speak(utter);
    }
  }catch(e){}
  return score;
}

/* ========== Clarity speak router (thin) ========== */
(function(){
  if(window.__claritySpeakBoot) return;
  window.__claritySpeakBoot = true;

  function parseRef(opts, text){
    opts = opts||{};
    var s = opts.surah||opts.s||0, a = opts.ayah||opts.a||0;
    if((!s||!a) && opts.ref){
      var m = String(opts.ref).match(/(\d+)\s*[.:：]\s*(\d+)/);
      if(m){ s=+m[1]; a=+m[2]; }
    }
    if((!s||!a) && text){
      var m2 = String(text).match(/(\d+)\s*[.:：]\s*(\d+)/);
      if(m2){ s=+m2[1]; a=+m2[2]; }
    }
    return {s:s, a:a};
  }

  window.claritySpeakArabic = function(text, opts){
    opts = opts||{};
    var ref = parseRef(opts, typeof text==='string'?text:'');
    if(ref.s>=1 && ref.a>=1 && typeof playAyahAudio==='function'){
      return playAyahAudio(ref.s+':'+ref.a, opts.btn||null);
    }
    var t = Array.isArray(text) ? text.join(' ') : String(text||'');
    if(typeof clarityNaturalTTS==='function'){
      return clarityNaturalTTS(t, {btn:opts.btn||null, lang:opts.lang||null, rate:opts.rate||0.92});
    }
    return false;
  };
  window.claritySpeakStop = function(){ if(typeof clarityStopAllAudio==='function') clarityStopAllAudio(); };
  window.claritySpeakIsMuted = function(){ return false; };
  window.claritySpeakSetMute = function(){};
  window.claritySpeakToggleMute = function(){};

  function textOf(el){
    if(!el) return '';
    if(el.getAttribute && el.getAttribute('data-ar')) return el.getAttribute('data-ar');
    return (el.innerText||el.textContent||'').trim();
  }
  function enhanceEl(el){
    if(!el||el.nodeType!==1) return;
    if(el.getAttribute('data-clarity-ar')==='1') return;
    if(el.closest && el.closest('button,a,script,style,.meme-stage,#callig-lab-card,.banner,.nav-tabs,.hajj-dua-box,#hajj-guide-card,.talbiyah-box,.verse-listen-row')) return;
    if(el.querySelector && el.querySelector('.inline-tts')) return;
    if(el.parentNode && el.parentNode.querySelector && el.parentNode.querySelector('.ayah-audio-btn,.verse-listen-row,.verse-audio-btn')) return;
    var t = textOf(el);
    if(!t || t.length<4) return;
    /* Only auto-chip when Arabic script is dominant */
    var ar = (t.match(/[\u0600-\u06FF]/g)||[]).length;
    if(ar < t.length*0.3 && ar < 8) return;
    el.setAttribute('data-clarity-ar','1');
    var parent = el.parentNode;
    if(!parent) return;
    var ref = el.getAttribute('data-ref')||'';
    if(!ref && el.closest){
      var card = el.closest('[data-ref],.card,.search-result,.verse-box');
      if(card){
        ref = card.getAttribute('data-ref')||'';
        if(!ref){ var re=card.querySelector('.ref,[data-ref]'); if(re) ref=re.getAttribute('data-ref')||re.textContent||''; }
      }
    }
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'clarity-ar-btn';
    btn.innerHTML = '🔊';
    btn.title = /\d+\s*[.:：]\s*\d+/.test(ref) ? 'Listen · Alafasy' : 'Listen';
    if(ref) btn.setAttribute('data-ref', ref);
    btn.addEventListener('click', function(ev){
      ev.preventDefault();
      ev.stopPropagation();
      window.claritySpeakArabic(textOf(el), {btn:btn, ref:ref||btn.getAttribute('data-ref')});
    });
    var wrap = document.createElement('span');
    wrap.className = 'clarity-ar-wrap';
    wrap.style.marginInlineStart = '.35rem';
    wrap.appendChild(btn);
    if(el.nextSibling) parent.insertBefore(wrap, el.nextSibling);
    else parent.appendChild(wrap);
  }
  function enhanceAll(){
    try{
      document.querySelectorAll('.arabic,.arabic-calligraphy,.rabbana-arabic,.dua-ar,.sr-ar,[data-ar]').forEach(enhanceEl);
    }catch(e){}
  }
  window.clarityEnhanceArabicAudio = enhanceAll;

  window.claritySurpriseRecite = function(){
    var pool = ['سُبْحَانَ اللَّهِ','الْحَمْدُ لِلَّهِ','اللَّهُ أَكْبَرُ','أَسْتَغْفِرُ اللَّهَ'];
    var pick = pool[Math.floor(Math.random()*pool.length)];
    window.claritySpeakArabic(pick, {lang:'ar'});
    return pick;
  };

  if(document.readyState==='loading')
    document.addEventListener('DOMContentLoaded', function(){ setTimeout(enhanceAll, 400); });
  else setTimeout(enhanceAll, 400);
  setTimeout(enhanceAll, 1500);
})();

/* ========== Guidance · Voice Translator (Whisper-tiny · Cache API · low RAM) ========== */
var vtState = {
  whisper: null,
  transformersMod: null,
  loadingModel: false,
  modelReady: false,
  cacheOk: false,
  recording: false,
  recorder: null,
  stream: null,
  chunks: [],
  recStartedAt: 0,
  timer: null,
  token: 0
};

/* Quantized tiny = smallest public Xenova ASR build (~40MB class, ONNX q8) */
var VT_WHISPER_ID = 'Xenova/whisper-tiny';
var VT_CACHE_NAME = 'transformers-cache';
/* Known file suffixes Xenova serves for quantized whisper-tiny (probe for cache status) */
var VT_CACHE_HINTS = [
  'https://huggingface.co/Xenova/whisper-tiny/resolve/main/config.json',
  'https://huggingface.co/Xenova/whisper-tiny/resolve/main/tokenizer.json',
  'https://huggingface.co/Xenova/whisper-tiny/resolve/main/preprocessor_config.json',
  'https://huggingface.co/Xenova/whisper-tiny/resolve/main/onnx/encoder_model_quantized.onnx',
  'https://huggingface.co/Xenova/whisper-tiny/resolve/main/onnx/decoder_model_merged_quantized.onnx'
];

var VT_LANG_NAME = {
  en: 'english', ar: 'arabic', ur: 'urdu', fr: 'french', es: 'spanish',
  tr: 'turkish', id: 'indonesian', hi: 'hindi', de: 'german', 'zh-CN': 'chinese'
};
var VT_TTS = {
  en: 'en-US', ar: 'ar-SA', ur: 'ur-PK', fr: 'fr-FR', es: 'es-ES',
  tr: 'tr-TR', id: 'id-ID', hi: 'hi-IN', de: 'de-DE', 'zh-CN': 'zh-CN'
};

function vtEl(id){ return document.getElementById(id); }

function vtStatus(msg, live){
  var el = vtEl('vt-status');
  if (el) el.textContent = msg || '';
  var mic = vtEl('vt-mic');
  if (mic) {
    if (live) {
      mic.textContent = '⏹ Stop recording';
      mic.classList.add('on');
    } else if (!vtState.recording) {
      mic.textContent = '🎤 Start recording';
      mic.classList.remove('on');
    }
  }
}

function vtProgress(show, pct, label){
  var wrap = vtEl('vt-progress-wrap');
  var fill = vtEl('vt-progress-fill');
  var lab = vtEl('vt-progress-label');
  if (wrap) wrap.hidden = !show;
  if (fill) fill.style.width = Math.max(0, Math.min(100, pct || 0)) + '%';
  if (lab) lab.textContent = label || '';
}

function vtSetCacheBadge(state, text){
  var b = vtEl('vt-cache-badge');
  if (!b) return;
  b.className = 'vt-cache-badge' + (state ? (' ' + state) : '');
  b.textContent = text || 'Cache';
}

async function vtProbeDeviceCache(){
  if (!('caches' in window)) {
    vtState.cacheOk = false;
    vtSetCacheBadge('err', 'Cache API unavailable');
    return false;
  }
  try {
    var keys = await caches.keys();
    var hits = 0;
    var total = VT_CACHE_HINTS.length;
    for (var i = 0; i < keys.length; i++) {
      var cache = await caches.open(keys[i]);
      for (var j = 0; j < VT_CACHE_HINTS.length; j++) {
        try {
          var m = await cache.match(VT_CACHE_HINTS[j], { ignoreSearch: true });
          if (m) hits++;
        } catch (e) {}
      }
    }
    /* Also scan any request URL containing whisper-tiny */
    if (hits < 2) {
      for (var k = 0; k < keys.length; k++) {
        try {
          var c = await caches.open(keys[k]);
          var reqs = await c.keys();
          for (var r = 0; r < reqs.length; r++) {
            var u = String(reqs[r].url || '');
            if (u.indexOf('whisper-tiny') >= 0 || u.indexOf('Xenova/whisper') >= 0) hits++;
          }
        } catch (e) {}
      }
    }
    if (hits >= 3 || vtState.modelReady) {
      vtState.cacheOk = true;
      vtSetCacheBadge('ok', 'Device cache: Whisper files present');
      return true;
    }
    if (hits > 0) {
      vtState.cacheOk = true;
      vtSetCacheBadge('ok', 'Device cache: partial (' + hits + ' files)');
      return true;
    }
    vtState.cacheOk = false;
    vtSetCacheBadge('miss', 'Device cache: empty — install once');
    return false;
  } catch (err) {
    vtState.cacheOk = false;
    vtSetCacheBadge('err', 'Cache check failed');
    return false;
  }
}

function vtRefreshCacheStatus(){
  vtProbeDeviceCache().then(function(){});
}

function vtFrom(){ var e = vtEl('vt-from'); return e ? e.value : 'en'; }
function vtTo(){ var e = vtEl('vt-to'); return e ? e.value : 'ar'; }

function vtOnLangChange(){
  try { if (typeof vtScheduleTranslate === 'function') vtScheduleTranslate(); } catch (e) {}
}

function vtPreset(from, to){
  var a = vtEl('vt-from'), b = vtEl('vt-to');
  if (a) a.value = from;
  if (b) b.value = to;
  vtOnLangChange();
}

function vtSwapLangs(){
  var a = vtEl('vt-from'), b = vtEl('vt-to');
  if (!a || !b) return;
  if (a.value === 'auto') { a.value = b.value; return; }
  var t = a.value; a.value = b.value; b.value = t;
  var inp = vtEl('vt-in'), out = vtEl('vt-out');
  if (inp && out) {
    var x = inp.value; inp.value = out.value; out.value = x;
  }
  vtOnLangChange();
}

function vtSurprise(){
  var pairs = [['en','ar'],['ar','en'],['en','ur'],['fr','ar'],['es','ar'],['tr','en']];
  var p = pairs[Math.floor(Math.random() * pairs.length)];
  vtPreset(p[0], p[1]);
  vtStatus('Surprise: ' + p[0] + ' → ' + p[1], false);
}

function vtClear(){
  var inp = vtEl('vt-in'), out = vtEl('vt-out');
  if (inp) inp.value = '';
  if (out) out.value = '';
  vtStatus('Cleared', false);
}

function vtCopyOut(){
  var out = vtEl('vt-out');
  var t = out ? String(out.value || '') : '';
  if (!t) { vtStatus('Nothing to copy', false); return; }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(t).then(function(){ vtStatus('Copied', false); }).catch(function(){ vtStatus('Copy failed', false); });
  } else {
    try {
      out.select();
      document.execCommand('copy');
      vtStatus('Copied', false);
    } catch (e) { vtStatus('Copy failed', false); }
  }
}

function vtSpeakOut(){
  try {
    var out = vtEl('vt-out');
    var t = out ? String(out.value || '').trim() : '';
    var lang = vtTo();
    if (!t) {
      var inp = vtEl('vt-in');
      t = inp ? String(inp.value || '').trim() : '';
      lang = vtFrom() === 'auto' ? 'en' : vtFrom();
    }
    if (!t) { vtStatus('Nothing to hear', false); return; }
    if (!window.speechSynthesis) { alert('TTS not available'); return; }
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(t);
    u.lang = VT_TTS[lang] || 'en-US';
    u.rate = (lang === 'ar' || lang === 'ur') ? 0.9 : 0.95;
    var voices = speechSynthesis.getVoices() || [];
    var pref = String(u.lang).slice(0, 2).toLowerCase();
    for (var i = 0; i < voices.length; i++) {
      if (String(voices[i].lang || '').toLowerCase().indexOf(pref) === 0) {
        u.voice = voices[i];
        break;
      }
    }
    u.onend = function(){ vtStatus('Ready', false); };
    speechSynthesis.speak(u);
    vtStatus('Playing…', false);
  } catch (e) {
    vtStatus('Hear failed', false);
  }
}

function vtScheduleTranslate(){
  if (vtState.timer) clearTimeout(vtState.timer);
  vtState.timer = setTimeout(function(){ vtTranslateNow(); }, 400);
}

async function vtTranslateNow(){
  var inp = vtEl('vt-in');
  var text = inp ? String(inp.value || '').trim() : '';
  var out = vtEl('vt-out');
  if (!text) {
    if (out) out.value = '';
    vtStatus('Type or record first', false);
    return '';
  }
  var sl = vtFrom() === 'auto' ? 'auto' : vtFrom();
  var tl = vtTo();
  if (sl === tl) {
    if (out) out.value = text;
    vtStatus('Same language', false);
    return text;
  }
  var token = ++vtState.token;
  vtStatus('Google Translate…', false);
  try {
    var fn = window.clarityGoogleTranslate || window.calligGoogleTranslate;
    var translated = '';
    if (typeof fn === 'function') translated = await fn(text, sl, tl);
    if (token !== vtState.token) return '';
    if (!translated && sl === 'auto' && typeof fn === 'function') {
      translated = await fn(text, 'en', tl);
    }
    if (token !== vtState.token) return '';
    if (out) out.value = translated || '';
    vtStatus(translated ? 'Translated ✓' : 'Translate failed — check network', false);
    return translated || '';
  } catch (e) {
    vtStatus('Translate error', false);
    return '';
  }
}

/** Configure Transformers.js env BEFORE any model fetch — Cache API path */
function vtConfigureEnv(mod){
  if (!mod || !mod.env) return;
  try {
    mod.env.allowLocalModels = false;
    mod.env.allowRemoteModels = true;
    mod.env.useBrowserCache = true;  /* Cache API — survives refresh */
    /* FS cache is Node-only; force browser path */
    try { mod.env.useFSCache = false; } catch (e1) {}
    /* Explicit remote host + path so cache keys stay stable */
    mod.env.remoteHost = 'https://huggingface.co/';
    mod.env.remotePathTemplate = '{model}/resolve/{revision}/';
    /* WASM: single thread reduces peak RAM on phones */
    if (!mod.env.backends) mod.env.backends = {};
    if (!mod.env.backends.onnx) mod.env.backends.onnx = {};
    if (!mod.env.backends.onnx.wasm) mod.env.backends.onnx.wasm = {};
    mod.env.backends.onnx.wasm.numThreads = 1;
    try { mod.env.backends.onnx.wasm.simd = true; } catch (e2) {}
  } catch (e) {
    console.warn('vt env config', e);
  }
}

/**
 * Load Whisper-tiny quantized into RAM from device Cache API when possible.
 * Files remain on disk after Unload from RAM.
 */
async function vtEnsureWhisper(forceMsg){
  if (vtState.whisper) {
    vtState.modelReady = true;
    if (forceMsg) vtStatus('Whisper ready (in RAM this session)', false);
    try { vtSetCacheBadge('ok', 'Device cache + RAM: ready'); } catch (e) {}
    return vtState.whisper;
  }
  if (vtState.loadingModel) {
    if (forceMsg) vtStatus('Model loading…', false);
    for (var w = 0; w < 40 && vtState.loadingModel; w++) {
      await new Promise(function(r){ setTimeout(r, 250); });
      if (vtState.whisper) return vtState.whisper;
    }
    return vtState.whisper || null;
  }
  vtState.loadingModel = true;
  vtProgress(true, 4, 'Starting…');
  vtStatus('Opening Whisper via device cache path…', false);
  try {
    if (!vtState.transformersMod) {
      vtProgress(true, 8, 'Loading Transformers.js…');
      vtState.transformersMod = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2');
    }
    var mod = vtState.transformersMod;
    vtConfigureEnv(mod);

    await vtProbeDeviceCache();
    vtProgress(true, 16, vtState.cacheOk ? 'Reading device cache…' : 'Downloading into device cache (once)…');

    var lastFile = '';
    var progressCb = function(p){
      try {
        if (!p) return;
        if (p.status === 'initiate' || p.status === 'download') {
          lastFile = p.file || lastFile || 'weights';
          vtProgress(true, 20, 'Cache write: ' + lastFile);
        } else if (p.status === 'progress' && p.total) {
          var pct = 20 + Math.round((p.loaded / p.total) * 72);
          var tag = (p.loaded === p.total) ? ' · cached' : '';
          vtProgress(true, Math.min(96, pct), 'Model ' + Math.min(99, pct) + '%' + tag);
        } else if (p.status === 'done') {
          vtProgress(true, 94, 'File stored in device cache…');
        } else if (p.status === 'ready') {
          vtProgress(true, 97, 'Assembling pipeline…');
        }
      } catch (e) {}
    };

    /* quantized: true → *_quantized.onnx paths under onnx/ */
    vtState.whisper = await mod.pipeline(
      'automatic-speech-recognition',
      VT_WHISPER_ID,
      {
        progress_callback: progressCb,
        quantized: true,
        revision: 'main'
      }
    );
    vtState.modelReady = true;
    await vtProbeDeviceCache();
    vtProgress(true, 100, 'Ready · files on device');
    vtStatus('Whisper ready — record a clear phrase (2–12s)', false);
    setTimeout(function(){ vtProgress(false, 0, ''); }, 900);
    return vtState.whisper;
  } catch (err) {
    console.error('Whisper load', err);
    vtState.whisper = null;
    vtState.modelReady = false;
    vtProgress(false, 0, '');
    vtStatus('Whisper load failed — network needed for first install', false);
    vtSetCacheBadge('err', 'Install failed');
    alert('Could not load Whisper.\n\nFirst install needs network so quantized files can be written to this browser’s Cache API.\nAfter that, refresh uses device cache.\n\nYou can still type + Google Translate.');
    return null;
  } finally {
    vtState.loadingModel = false;
  }
}

/** Drop pipeline from RAM; Cache API files stay on device */
function vtUnloadWhisper(){
  try {
    vtState.recording = false;
    if (vtState.maxTimer) { try { clearTimeout(vtState.maxTimer); } catch (e) {} vtState.maxTimer = null; }
    if (vtState.recorder) {
      try { vtState.recorder.ondataavailable = null; } catch (e) {}
      try { if (vtState.recorder.state !== 'inactive') vtState.recorder.stop(); } catch (e) {}
    }
    vtState.recorder = null;
    vtState.chunks = [];
    if (typeof vtStopTracks === 'function') vtStopTracks();
  } catch (e) {}
  try {
    if (vtState.whisper && typeof vtState.whisper.dispose === 'function') {
      vtState.whisper.dispose();
    }
  } catch (e) {}
  vtState.whisper = null;
  vtState.modelReady = false;
  vtStatus('Unloaded from RAM — cache files still on this device', false);
  try { vtProbeDeviceCache(); } catch (e) {}
  try { if (typeof globalThis !== 'undefined' && globalThis.gc) globalThis.gc(); } catch (e2) {}
}

function vtStopTracks(){
  try {
    if (vtState.stream) {
      vtState.stream.getTracks().forEach(function(t){ try { t.stop(); } catch (e) {} });
    }
  } catch (e) {}
  vtState.stream = null;
}

function vtPickMime(){
  if (!window.MediaRecorder) return '';
  var types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
  for (var i = 0; i < types.length; i++) {
    try {
      if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(types[i])) return types[i];
    } catch (e) {}
  }
  return '';
}

async function vtBlobToFloat32(blob){
  var buf = await blob.arrayBuffer();
  var AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) throw new Error('AudioContext unavailable');
  var ctx = new AC({ sampleRate: 16000 });
  var decoded;
  try {
    decoded = await ctx.decodeAudioData(buf.slice(0));
  } finally {
    try { await ctx.close(); } catch (e) {}
  }
  var ch0 = decoded.getChannelData(0);
  var inRate = decoded.sampleRate || 16000;
  var outRate = 16000;
  if (Math.abs(inRate - outRate) < 50) return new Float32Array(ch0);
  var ratio = inRate / outRate;
  var newLen = Math.max(1, Math.round(ch0.length / ratio));
  var out = new Float32Array(newLen);
  for (var i = 0; i < newLen; i++) {
    var x = i * ratio;
    var i0 = Math.floor(x);
    var i1 = Math.min(i0 + 1, ch0.length - 1);
    var f = x - i0;
    out[i] = ch0[i0] * (1 - f) + ch0[i1] * f;
  }
  return out;
}

function vtCleanTranscript(text){
  text = String(text || '').trim().replace(/\s+/g, ' ');
  var bad = [
    /^thanks for watching\.?$/i,
    /^thank you for watching\.?$/i,
    /^subscribe\.?$/i,
    /^you$/i,
    /^\.+$/
  ];
  for (var i = 0; i < bad.length; i++) if (bad[i].test(text)) return '';
  return text;
}

async function vtToggleRecord(){
  if (vtState.recording) await vtStopRecordAndTranscribe();
  else await vtStartRecord();
}

async function vtStartRecord(){
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    vtStatus('Microphone API unavailable', false);
    return;
  }
  if (!window.MediaRecorder) {
    vtStatus('MediaRecorder unavailable', false);
    return;
  }
  /* Do NOT reload if model already in RAM or loading */
  if (!vtState.whisper && !vtState.loadingModel) {
    try { vtEnsureWhisper(false); } catch (e) {}
  }
  try {
    vtState.stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 }
    });
  } catch (err) {
    vtStatus('Microphone permission denied', false);
    return;
  }
  vtState.chunks = [];
  var mime = vtPickMime();
  try {
    vtState.recorder = mime
      ? new MediaRecorder(vtState.stream, { mimeType: mime })
      : new MediaRecorder(vtState.stream);
  } catch (e) {
    try { vtState.recorder = new MediaRecorder(vtState.stream); }
    catch (e2) {
      vtStatus('Could not start recorder', false);
      vtStopTracks();
      return;
    }
  }
  vtState.recorder.ondataavailable = function(ev){
    if (ev.data && ev.data.size > 0) vtState.chunks.push(ev.data);
  };
  vtState.recorder.start(200);
  vtState.recording = true;
  vtState.recStartedAt = Date.now();
  vtStatus('Recording… speak clearly, then Stop', true);
}

async function vtStopRecordAndTranscribe(){
  if (!vtState.recorder) {
    vtState.recording = false;
    vtStatus('Not recording', false);
    return;
  }
  var elapsed = Date.now() - (vtState.recStartedAt || Date.now());
  vtState.recording = false;
  vtStatus('Processing…', false);

  var blob = await new Promise(function(resolve){
    var rec = vtState.recorder;
    var done = false;
    rec.onstop = function(){
      if (done) return;
      done = true;
      resolve(new Blob(vtState.chunks, { type: rec.mimeType || 'audio/webm' }));
    };
    try {
      if (rec.state !== 'inactive') rec.stop();
      else resolve(new Blob(vtState.chunks, { type: 'audio/webm' }));
    } catch (e) {
      resolve(new Blob(vtState.chunks, { type: 'audio/webm' }));
    }
    setTimeout(function(){
      if (!done) {
        done = true;
        resolve(new Blob(vtState.chunks, { type: 'audio/webm' }));
      }
    }, 2000);
  });
  vtStopTracks();
  vtState.recorder = null;
  vtState.chunks = [];

  if (elapsed < 700) {
    vtStatus('Too short — record 2+ seconds', false);
    return;
  }
  if (!blob || blob.size < 1200) {
    vtStatus('No audio captured', false);
    return;
  }

  vtProgress(true, 28, 'Decoding audio…');
  var audio = null;
  try {
    var asr = await vtEnsureWhisper(false);
    if (!asr) {
      vtProgress(false, 0, '');
      vtStatus('Install Whisper first, then record', false);
      return;
    }
    audio = await vtBlobToFloat32(blob);
    blob = null;
    if (audio && audio.length > 16000 * 12) audio = audio.slice(audio.length - 16000 * 12);
    var peak = 0;
    for (var i = 0; i < audio.length; i += 40) {
      var v = Math.abs(audio[i]);
      if (v > peak) peak = v;
    }
    if (peak < 0.008) {
      audio = null;
      vtProgress(false, 0, '');
      vtStatus('Too quiet — move closer / speak louder', false);
      return;
    }
    vtProgress(true, 60, 'Whisper transcribing…');
    var from = vtFrom();
    var opts = {
      return_timestamps: false,
      chunk_length_s: 18,
      stride_length_s: 2
    };
    if (from && from !== 'auto') {
      opts.language = VT_LANG_NAME[from] || from;
      opts.task = 'transcribe';
    }
    var result = await asr(audio, opts);
    audio = null;
    var text = '';
    if (typeof result === 'string') text = result;
    else if (result && result.text) text = result.text;
    result = null;
    text = vtCleanTranscript(text);
    vtProgress(true, 100, 'Done');
    if (!text) {
      vtStatus('Could not parse speech — retry', false);
      setTimeout(function(){ vtProgress(false, 0, ''); }, 700);
      return;
    }
    var inp = vtEl('vt-in');
    if (inp) inp.value = text;
    vtStatus('Transcribed — translating…', false);
    await vtTranslateNow();
    setTimeout(function(){ vtProgress(false, 0, ''); }, 500);
  } catch (err) {
    console.error(err);
    audio = null;
    vtProgress(false, 0, '');
    vtStatus('Transcription failed — type or retry', false);
  }
}

window.vtOnLangChange = vtOnLangChange;
window.vtPreset = vtPreset;
window.vtSwapLangs = vtSwapLangs;
window.vtSurprise = vtSurprise;
window.vtClear = vtClear;
window.vtCopyOut = vtCopyOut;
window.vtSpeakOut = vtSpeakOut;
window.vtScheduleTranslate = vtScheduleTranslate;
window.vtTranslateNow = vtTranslateNow;
window.vtEnsureWhisper = vtEnsureWhisper;
window.vtUnloadWhisper = vtUnloadWhisper;
window.vtRefreshCacheStatus = vtRefreshCacheStatus;
window.vtToggleRecord = vtToggleRecord;
window.vtBlobToFloat32 = vtBlobToFloat32;
window.vtPickMime = vtPickMime;
window.vtCleanTranscript = vtCleanTranscript;
window.vtStopTracks = vtStopTracks;
window.vtMicStart = function(){ return vtStartRecord(); };
window.vtMicStop = function(){ return vtStopRecordAndTranscribe(); };

try { if (window.speechSynthesis) speechSynthesis.getVoices(); } catch (e) {}
try {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ try { vtProbeDeviceCache(); } catch (e) {} });
  } else {
    setTimeout(function(){ try { vtProbeDeviceCache(); } catch (e) {} }, 400);
  }
} catch (e) {}

try { if (window.speechSynthesis) speechSynthesis.getVoices(); } catch (e) {}

function calligSetTip(tip){
  calligState.tip = tip || 'finger';
  calligState.stylusSim = tip !== 'blunt';
  ['finger','stylus','feather','blunt'].forEach(function(t){
    var b=document.getElementById('callig-tip-'+t);
    if(b) b.classList.toggle('on', t===calligState.tip);
  });
  calligUpdateModeBadge();
}
function calligTipWidth(press, vel, ang){
  var base=calligState.size||14;
  var feel=(calligState.stylusFeel||70)/100;
  press=Math.max(0.1,Math.min(1,press||0.75));
  vel=Math.max(0,vel||0);
  var tip=calligState.tip||'finger';
  if(tip==='blunt') return Math.max(base*0.9, Math.min(base*1.3, base*(0.95+0.2*press)));
  if(tip==='stylus') return Math.max(base*0.3, Math.min(base*1.55, base*(0.4+0.9*press)*(0.85+0.2*feel)));
  if(tip==='feather'){
    var slow=1/(1+vel*18);
    var flare=0.7+0.5*Math.abs(Math.sin(ang||0.6));
    return Math.max(base*0.2, Math.min(base*1.9, base*(0.3+0.8*press)*slow*flare*(0.75+0.4*feel)));
  }
  var slow=1/(1+vel*14);
  return Math.max(base*0.3, Math.min(base*1.5, base*(0.45+0.65*press)*(0.55+0.7*slow)*(0.75+0.4*feel)));
}
window.calligSetTip=calligSetTip;

/* duplicate memeFetchBg removed */

function memeFetchStatus(msg) {
  var el = document.getElementById('meme-fetch-status');
  if (el) el.textContent = msg || '';
}

function memeSyncInputs(){
  try {
    var t = document.getElementById('meme-top-input');
    var m = document.getElementById('meme-mid-input');
    var b = document.getElementById('meme-bottom-input');
    if (t) t.value = memeState.top || '';
    if (m) m.value = memeState.mid || '';
    if (b) b.value = memeState.bottom || '';
  } catch (e) {}
}

function claritySendToMeme(kind){
  try{
    if(typeof switchTab==='function') switchTab('reality');
    setTimeout(function(){
      try{
        var card=document.getElementById('meme-card');
        if(card) card.scrollIntoView({behavior:'smooth',block:'start'});
        if(kind==='command' && typeof memeFromCommand==='function') memeFromCommand();
        else if(kind==='dua' && typeof memeMasnunDua==='function') memeMasnunDua();
        else if(typeof memeFromJourney==='function') memeFromJourney();
      }catch(e){}
    }, 220);
  }catch(e){}
}
window.claritySendToMeme = claritySendToMeme;
window.memeFromJourney = memeFromJourney;
window.memeFromCommand = memeFromCommand;
window.memeFetchStatus = memeFetchStatus;

function calligWspRefresh(){
  var badge=document.getElementById('callig-wsp-badge');
  try{
    if(typeof vtState!=='undefined' && vtState && vtState.whisper){
      if(badge) badge.textContent='Whisper-tiny · ready';
      return;
    }
  }catch(e){}
  if(badge) badge.textContent='Whisper-tiny';
}
async function calligWspInstall(){
  var badge=document.getElementById('callig-wsp-badge');
  if(badge) badge.textContent='Loading Whisper-tiny…';
  try{
    if(typeof calligMicEnsureWhisper==='function') await calligMicEnsureWhisper();
    else if(typeof vtEnsureWhisper==='function') await vtEnsureWhisper(true);
    if(badge) badge.textContent='Whisper-tiny · ready';
  }catch(e){ if(badge) badge.textContent='Load failed'; }
}
async function calligWspUnload(){
  var badge=document.getElementById('callig-wsp-badge');
  try{
    if(typeof vtUnloadWhisper==='function') await vtUnloadWhisper();
    if(badge) badge.textContent='Whisper-tiny · unloaded';
  }catch(e){ if(badge) badge.textContent='Unload error'; }
}
window.calligWspInstall=calligWspInstall;
window.calligWspUnload=calligWspUnload;
window.calligWspRefresh=calligWspRefresh;
try {
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', function(){ setTimeout(calligWspRefresh, 600); });
  else setTimeout(calligWspRefresh, 600);
} catch(e){}

/* ===== Daily Fiqh Challenge (v4 · rebuilt) ===== */
var FQ_KEY = 'clarity_fiqh_quiz_v8';
var FQ_BANK = [
  {lvl:'beginner',cat:'Aqīdah',vis:'🕌',q:'The first pillar of Islam is…',opts:['Hajj only','The shahādah — testimony of faith','Zakāh only','Optional night prayer'],a:1,why:'Islam rests on five pillars; the first is the testimony that there is no god but Allah and Muḥammad is His Messenger.',ref:'Bukhārī; Muslim',res:'https://sunnah.com/bukhari:8'},
  {lvl:'beginner',cat:'Prayer',vis:'🌅',q:'How many farḍ rakʿahs are in Maghrib?',opts:['2','3','4','5'],a:1,why:'Maghrib is three farḍ rakʿahs by consensus.',ref:'Ijmāʿ',res:'https://islamqa.info/en/answers/72829'},
  {lvl:'beginner',cat:'Prayer',vis:'🕋',q:'What is the qiblah for the obligatory prayer?',opts:['Sunrise','The Kaʿbah in Makkah','Any quiet direction','The nearest ocean'],a:1,why:'Allah commanded facing the Sacred Mosque.',ref:'Qurʾān 2:144',res:'https://quran.com/2/144'},
  {lvl:'beginner',cat:'Fasting',vis:'🌙',q:'What deliberately breaks the Ramaḍān fast?',opts:['A short nap','Eating or drinking on purpose','Using miswāk','Unavoidable dust'],a:1,why:'Deliberate eating or drinking in the daytime invalidates the fast.',ref:'Qurʾān 2:187',res:'https://quran.com/2/187'},
  {lvl:'beginner',cat:'Manners',vis:'😊',q:'Smiling at your brother is described as…',opts:['A waste','A charity (ṣadaqah)','Only for strangers','Forbidden in the mosque'],a:1,why:'A smile is among the small charities taught by the Prophet ﷺ.',ref:'Tirmidhī',res:'https://sunnah.com/tirmidhi:1956'},
  {lvl:'beginner',cat:'Manners',vis:'🤝',q:'After a sneeze with Alḥamdulillāh, the reply is…',opts:['Nothing','Yarḥamuk Allāh','Only smile','Allāhu akbar only'],a:1,why:'Sunnah etiquette of sneezing.',ref:'Bukhārī',res:'https://sunnah.com/bukhari:6224'},
  {lvl:'beginner',cat:'Fasting',vis:'🍲',q:'Suḥūr (pre-dawn meal) is…',opts:['Forbidden','A recommended blessing','Only for children','Only on Fridays'],a:1,why:'The Prophet ﷺ encouraged suḥūr as a blessing.',ref:'Bukhārī; Muslim',res:'https://sunnah.com/bukhari:1923'},
  {lvl:'beginner',cat:'Aqīdah',vis:'✨',q:'Iḥsān is to worship Allah as though…',opts:['People are watching','You see Him; and if not, He sees you','You will never be judged','Only in Ramaḍān'],a:1,why:'Ḥadīth of Jibrīl defines iḥsān this way.',ref:'Muslim',res:'https://sunnah.com/muslim:8'},
  {lvl:'beginner',cat:'Prayer',vis:'💧',q:'Wuḍūʾ is required before…',opts:['Only sleep','The obligatory prayer when one is impure and able','Every meal','Wearing perfume'],a:1,why:'Purification is a condition for prayer when able.',ref:'Qurʾān 5:6',res:'https://quran.com/5/6'},
  {lvl:'beginner',cat:'Aqīdah',vis:'🧭',q:'Muslims face the Kaʿbah because…',opts:['Fashion','Allah commanded the Sacred Mosque as qiblah','Only for Makkah residents','It replaces the shahādah'],a:1,why:'The qiblah unites the ummah in obedience.',ref:'Qurʾān 2:144',res:'https://quran.com/2/144'},
  {lvl:'moderate',cat:'Purification',vis:'😴',q:'What commonly breaks wuḍūʾ (majority teaching)?',opts:['Smiling','Deep sleep that loosens control','Quiet walking','Soft laughter outside prayer'],a:1,why:'Deep sleep that relaxes control is widely taught to nullify wuḍūʾ.',ref:'Fiqh of ṭahārah',res:'https://islamqa.info/en/answers/14321'},
  {lvl:'moderate',cat:'Purification',vis:'🥾',q:'Before wiping over khuffs, wear them…',opts:['While impure','After complete wuḍūʾ','With only ghusl and no wuḍūʾ','Never — wiping is invalid'],a:1,why:'A condition is wearing them in purity after washing the feet.',ref:'Sunnah of wiping',res:'https://islamqa.info/en/answers/9640'},
  {lvl:'moderate',cat:'Zakāh',vis:'💰',q:'Zakāh on cash/gold/silver typically needs niṣāb and…',opts:['Same-day spend','A lunar year (ḥawl) of ownership','Inheritance only','Weekly payment'],a:1,why:'A lunar year after niṣāb is a classical condition.',ref:'Fiqh of zakāh',res:'https://islamqa.info/en/answers/36681'},
  {lvl:'moderate',cat:'Zakāh',vis:'🤲',q:'Qurʾān 9:60 lists zakāh recipients beginning with…',opts:['Only rulers','The poor and the needy (among eight categories)','Only tourists','Business partners only'],a:1,why:'Sūrat al-Tawbah lists eight categories starting with the poor and needy.',ref:'Qurʾān 9:60',res:'https://quran.com/9/60'},
  {lvl:'moderate',cat:'Fasting',vis:'✈️',q:'A traveller who breaks the Ramaḍān fast must…',opts:['Do nothing','Make up the missed days later','Pay double zakāh only','Fast an extra year'],a:1,why:'The Qurʾān allows the traveller to break the fast and make up later.',ref:'Qurʾān 2:184–185',res:'https://quran.com/2/184'},
  {lvl:'moderate',cat:'Prayer',vis:'🌌',q:'The five daily prayers were prescribed during…',opts:['Badr','Isrāʾ and Miʿrāj','Hijrah only','Ḥudaybiyyah'],a:1,why:'Prescribed on the Night Journey and Ascension.',ref:'Bukhārī; Muslim',res:'https://sunnah.com/bukhari:349'},
  {lvl:'moderate',cat:'Prayer',vis:'📢',q:'Jumuʿah includes…',opts:['Only Fajr rules','A khuṭbah before two rakʿahs','Only Eid rules','Taraweeh only'],a:1,why:'Jumuʿah has a khuṭbah before two rakʿahs for those obligated.',ref:'Qurʾān 62:9',res:'https://quran.com/62/9'},
  {lvl:'moderate',cat:'Manners',vis:'🕊️',q:'When angry, the Sunnah encourages…',opts:['Respond at once','Seek refuge in Allah and restrain anger','Never walk away','Raise the voice'],a:1,why:'Seek refuge from Shayṭān and control anger.',ref:'Bukhārī',res:'https://sunnah.com/bukhari:6114'},
  {lvl:'moderate',cat:'Purification',vis:'🚿',q:'Ghusl is required after…',opts:['Only travel','Major impurity (janābah) and other Sunnah causes','Eating cooked food','Perfume'],a:1,why:'Janābah and other causes require ghusl before prayer.',ref:'Qurʾān 5:6',res:'https://quran.com/5/6'},
  {lvl:'moderate',cat:'Aqīdah',vis:'📖',q:'The Qurʾān is best described as…',opts:['Only historical poetry','The speech of Allah revealed to the Prophet ﷺ','A text rewritten yearly','Unrelated to prayer'],a:1,why:'Revelation recited in prayer and preserved as guidance.',ref:'ʿAqīdah primers',res:'https://quran.com'},
  {lvl:'advanced',cat:'Purification',vis:'🏺',q:'Water that keeps colour, taste, and smell is often discussed with a threshold of…',opts:['Less than a cup','About two qullahs (large jars)','Any bottle always pure','Only zamzam'],a:1,why:'Schools discuss two qullahs when properties are unchanged.',ref:'Fiqh of ṭahārah',res:'https://islamqa.info/en/answers/220299'},
  {lvl:'advanced',cat:'Prayer',vis:'🙇',q:'Catching the imām in rukūʿ — many scholars teach the rakʿah…',opts:['Never counts','Can count if one joins the rukūʿ','Always requires full repeat','Only counts at tashahhud'],a:1,why:'A well-known position: catching rukūʿ catches the rakʿah; details differ by school.',ref:'Hadith commentary',res:'https://islamqa.info/en/answers/26704'},
  {lvl:'advanced',cat:'Zakāh',vis:'🎁',q:'Zakāt al-fiṭr is typically due…',opts:['Only from the very wealthy','From every able Muslim before Eid prayer, for those one supports','Only during Hajj','Once in a lifetime'],a:1,why:'It purifies the fast and feeds the needy at Eid.',ref:'Bukhārī; Muslim',res:'https://sunnah.com/bukhari:1503'},
  {lvl:'advanced',cat:'Prayer',vis:'🧭',q:'Facing the qiblah when able is required for…',opts:['Optional dhikr only','The obligatory prayer (with known exceptions such as fear)','Eating only','Travel talk'],a:1,why:'Qiblah is required for farḍ prayer when able.',ref:'Qurʾān 2:144',res:'https://islamqa.info/en/answers/65854'},
  {lvl:'advanced',cat:'Fasting',vis:'⚖️',q:'Intentionally breaking a Ramaḍān fast without excuse requires…',opts:['Nothing','Make-up (and further consequences in some cases per school)','Only a smile','Changing the qiblah'],a:1,why:'Make-up is required; some cases discuss major expiation — ask a scholar for personal cases.',ref:'Fiqh of ṣiyām',res:'https://islamqa.info/en/answers/38702'},
  {lvl:'advanced',cat:'Manners',vis:'👁️',q:'Lowering the gaze and modesty in the Qurʾān address…',opts:['Only fashion culture','Believing men and women','Ignoring family ties','Abandoning prayer'],a:1,why:'Sūrat al-Nūr instructs believing men and women.',ref:'Qurʾān 24:30–31',res:'https://quran.com/24/30'},
  {lvl:'advanced',cat:'Aqīdah',vis:'🏛️',q:'The five pillars begin with shahādah and include…',opts:['Only optional charity','Ṣalāh, zakāh, ṣawm of Ramaḍān, and ḥajj for those able','Only night prayer','Political office'],a:1,why:'Famous hadith lists the five foundations of Islam.',ref:'Bukhārī; Muslim',res:'https://sunnah.com/bukhari:8'},
  {lvl:'advanced',cat:'Prayer',vis:'🧳',q:'Combining prayers while travelling is…',opts:['Always forbidden','Discussed in the Sunnah; details differ by school and situation','Only for Makkah residents','A replacement for wuḍūʾ'],a:1,why:'The Prophet ﷺ combined while travelling; schools differ on when it is allowed.',ref:'Muslim; fiqh of travel',res:'https://islamqa.info/en/answers/97880'},
  {lvl:'advanced',cat:'Zakāh',vis:'📏',q:'Niṣāb is…',opts:['Any small cash','A minimum threshold of wealth that can make zakāh due when other conditions are met','A type of prayer','Only gold fashion'],a:1,why:'Niṣāb is the classical threshold for eligible wealth.',ref:'Fiqh of zakāh',res:'https://islamqa.info/en/answers/36681'},
  {lvl:'advanced',cat:'Purification',vis:'🏜️',q:'Tayammum is…',opts:['A food substitute','Dry purification with earth when water is unavailable or harmful, under its conditions','Only for Hajj','Never allowed'],a:1,why:'The Qurʾān and Sunnah legislate tayammum when water cannot be used.',ref:'Qurʾān 5:6',res:'https://quran.com/5/6'},
  {lvl:'beginner',cat:'Aqīdah',vis:'❤️',q:'Tawakkul means…',opts:['Abandoning work','Trusting Allah while taking lawful means','Never making duʿāʾ','Only relying on people'],a:1,why:'Tawakkul is trust in Allah together with taking appropriate means.',ref:'Qurʾān & Sunnah',res:'https://quran.com/65/3'},
  {lvl:'beginner',cat:'Prayer',vis:'⏰',q:'Which prayer is prayed at dawn?',opts:['Maghrib','Fajr','ʿIshāʾ','Jumuʿah only'],a:1,why:'Fajr is the dawn prayer.',ref:'Qurʾān 17:78',res:'https://quran.com/17/78'},
  {lvl:'beginner',cat:'Manners',vis:'🗣️',q:'A believer is taught regarding the tongue to…',opts:['Speak without care','Guard speech; silence can be safety','Never greet others','Only argue'],a:1,why:'Prophetic teaching stresses guarding the tongue.',ref:'Bukhārī; Muslim',res:'https://sunnah.com/bukhari:6474'},
  {lvl:'beginner',cat:'Fasting',vis:'📅',q:'Ramaḍān fasting is obligatory on…',opts:['Only scholars','Every able adult Muslim who meets the conditions','Children only','Travelers only'],a:1,why:'It is a pillar for those who meet the conditions of obligation.',ref:'Qurʾān 2:183',res:'https://quran.com/2/183'},
  {lvl:'beginner',cat:'Aqīdah',vis:'🌟',q:'The best of speech is…',opts:['Poetry only','The Book of Allah','Market rumors','Political slogans'],a:1,why:'The Qurʾān is the best of speech; the guidance of the Prophet ﷺ follows.',ref:'Muslim',res:'https://sunnah.com/muslim:867'},
  {lvl:'moderate',cat:'Prayer',vis:'📿',q:'The tashahhud is recited…',opts:['Only outside prayer','In the sitting of the prayer as taught','Instead of Fātiḥah always','Only on Eid'],a:1,why:'Tashahhud is part of the prayer sittings according to the Sunnah.',ref:'Bukhārī; Muslim',res:'https://sunnah.com/bukhari:831'},
  {lvl:'moderate',cat:'Zakāh',vis:'🌾',q:'Zakāh on agriculture is discussed in the Qurʾān with…',opts:['No mention of harvest','Giving the due on the day of harvest (among other rulings)','Only gold rules','Only for traders'],a:1,why:'Qurʾān 6:141 mentions the due on the day of harvest; details are in fiqh.',ref:'Qurʾān 6:141',res:'https://quran.com/6/141'},
  {lvl:'moderate',cat:'Fasting',vis:'🩺',q:'A sick person unable to fast may…',opts:['Ignore the day forever with no ruling','Break the fast and make it up later (or other options per condition)','Must fast anyway always','Pay zakāh instead only'],a:1,why:'The Qurʾān allows the sick to break the fast with make-up or other provisions depending on case.',ref:'Qurʾān 2:184–185',res:'https://quran.com/2/184'},
  {lvl:'moderate',cat:'Manners',vis:'🏠',q:'Entering homes in the Qurʾān is linked to…',opts:['Entering without notice','Seeking permission and greeting','Never visiting family','Only night visits'],a:1,why:'Sūrat al-Nūr teaches permission and greetings when entering homes.',ref:'Qurʾān 24:27',res:'https://quran.com/24/27'},
  {lvl:'moderate',cat:'Purification',vis:'🌊',q:'Istinjāʾ refers to…',opts:['A type of zakāh','Cleaning impurity from the private parts after relieving oneself','Only ghusl of Janābah','Wiping the face only'],a:1,why:'Istinjāʾ is purification after using the toilet.',ref:'Fiqh of ṭahārah',res:'https://islamqa.info/en/answers/95340'},
  {lvl:'advanced',cat:'Prayer',vis:'📖',q:'Reciting al-Fātiḥah in prayer is…',opts:['Optional in all schools always','A major pillar in the majority teaching for the one who can recite','Forbidden in silent prayers','Only for the imām in every school without exception'],a:1,why:'The majority treat Fātiḥah as essential for the one who can recite; details differ for the follower behind an imām.',ref:'Hadith «No prayer without Fātiḥah»',res:'https://sunnah.com/bukhari:756'},
  {lvl:'advanced',cat:'Aqīdah',vis:'⚖️',q:'Qadar (divine decree) in Sunnī belief includes…',opts:['Denial of human choice entirely','Belief that Allah knows, writes, wills, and creates; humans act with choice under His decree','That Allah does not know the future','That prophets invent decree'],a:1,why:'Classical ʿaqīdah affirms Allah’s comprehensive decree and human responsibility.',ref:'ʿAqīdah primers',res:'https://islamqa.info/en/answers/49004'},
  {lvl:'advanced',cat:'Zakāh',vis:'📈',q:'Trade goods for zakāh are generally assessed…',opts:['Never','By value when conditions of niṣāb and ḥawl are met (per school details)','Only by weight of the shelves','Only once in a lifetime'],a:1,why:'Merchandise is a classic category of zakāh when thresholds and conditions are met.',ref:'Fiqh of zakāh',res:'https://islamqa.info/en/answers/36681'},
  {lvl:'advanced',cat:'Fasting',vis:'🌙',q:'Voluntary fasting on Monday and Thursday is…',opts:['Forbidden','A known Sunnah practice','Only for Ramaḍān','Only for the elderly'],a:1,why:'The Prophet ﷺ was known to fast Mondays and Thursdays.',ref:'Tirmidhī; Nasāʾī',res:'https://sunnah.com/tirmidhi:745'},
  {lvl:'advanced',cat:'Prayer',vis:'🌅',q:'The time of Fajr begins at…',opts:['Sunrise','True dawn (al-fajr al-ṣādiq)','Midday','Sunset'],a:1,why:'Fajr begins at true dawn and lasts until sunrise.',ref:'Hadith of prayer times',res:'https://sunnah.com/muslim:612'},
  {lvl:'beginner',cat:'Aqīdah',vis:'🕋',q:'Tawḥīd means…',opts:['Worshipping saints','Oneness of Allah in Lordship, worship, and His names & attributes','Believing only in the angels','Avoiding all speech'],a:1,why:'Tawḥīd is pure monotheism — affirming Allah alone as Creator, the only One worshipped, and unique in His names and attributes.',ref:'Qur’an 112; IslamQA',res:'https://islamqa.info/en/answers/49030'},
  {lvl:'beginner',cat:'Prayer',vis:'📿',q:'How many obligatory units (rakʿāt) are in Maghrib?',opts:['2','3','4','5'],a:1,why:'Maghrib is three rakʿāt by consensus of the mainstream schools.',ref:'Prayer times & structure',res:'https://islamqa.info/en/answers/107645'},
  {lvl:'beginner',cat:'Character',vis:'💛',q:'The Prophet ﷺ said the most complete believers in faith are those best in…',opts:['Wealth','Character (khuluq)','Debate','Travel'],a:1,why:'Faith and good character are linked in authentic reports.',ref:'Tirmidhī',res:'https://sunnah.com/tirmidhi:1162'},
  {lvl:'beginner',cat:'Qur’an',vis:'📖',q:'Sūrat al-Fātiḥah is recited in…',opts:['Only Tarāwīḥ','Every rakʿah of the obligatory prayer (widely taught)','Only Friday','Only funeral prayer'],a:1,why:'The opening of the Book is recited in the prayer according to the mainstream practice of the ummah.',ref:'Bukhārī; Muslim',res:'https://sunnah.com/bukhari:756'},
  {lvl:'beginner',cat:'Zakāh',vis:'🌿',q:'Zakāh is obligatory on…',opts:['Only kings','Muslims who meet the niṣāb conditions','Non-Muslims only','Children under seven only'],a:1,why:'Zakāh is a pillar upon those who meet the threshold and conditions of ownership and time.',ref:'Qur’an 9:60; fiqh of zakāh',res:'https://islamqa.info/en/answers/9449'},
  {lvl:'beginner',cat:'Fasting',vis:'🌙',q:'What breaks the fast of Ramaḍān deliberately without excuse?',opts:['Smiling','Eating or drinking knowingly','Walking','Sleeping'],a:1,why:'Intentional eating or drinking in the day of Ramaḍān breaks the fast and requires repentance and make-up (qaḍāʾ), with further rulings depending on the case.',ref:'IslamQA — fasting',res:'https://islamqa.info/en/answers/38023'},
  {lvl:'beginner',cat:'Hadith',vis:'📜',q:'Actions are judged by…',opts:['Outcomes alone','Intentions (niyyāt)','Wealth','Age'],a:1,why:'The famous hadith: actions are only by intentions.',ref:'Bukhārī; Muslim',res:'https://sunnah.com/bukhari:1'},
  {lvl:'beginner',cat:'Duʿāʾ',vis:'🤲',q:'A time when duʿāʾ is especially encouraged is…',opts:['Never','In the last third of the night','Only on Monday','Only after years of study'],a:1,why:'The Lord descends to the lowest heaven in the last third of the night, inviting His servants to ask.',ref:'Bukhārī; Muslim',res:'https://sunnah.com/bukhari:1145'},
  {lvl:'beginner',cat:'Adab',vis:'🤝',q:'Saying “salām” when entering a gathering is…',opts:['Forbidden','A recommended Sunnah','Only for imams','Only in Makkah'],a:1,why:'Spreading salām is from the guidance of the Prophet ﷺ and a cause of love among believers.',ref:'Muslim',res:'https://sunnah.com/muslim:54'},
  {lvl:'beginner',cat:'Grave',vis:'🪦',q:'Which of these can benefit the deceased according to authentic texts?',opts:['Music parties','Duʿāʾ, charity, and a righteous child’s prayer','Astrology','Wailing loudly as a ritual'],a:1,why:'The dead benefit from the living’s duʿāʾ, ṣadaqah, and the ongoing righteous deeds of a good child.',ref:'Muslim 1631; IslamQA',res:'https://islamqa.info/en/answers/763'},
  {lvl:'intermediate',cat:'Fiqh',vis:'⚖️',q:'Wiping over leather socks (khuffayn) in wuḍūʾ is…',opts:['Never allowed','Allowed with conditions in the Sunnah','Only for travelers forever','Only for women'],a:1,why:'Authentic hadiths establish wiping over khuffayn for a limited period with conditions.',ref:'Muslim; IslamQA',res:'https://islamqa.info/en/answers/9638'},
  {lvl:'intermediate',cat:'Prayer',vis:'🕌',q:'If one misses a prayer without excuse, the duty is to…',opts:['Ignore it','Make it up (qaḍāʾ) and repent','Replace it with charity only','Wait until next year'],a:1,why:'Missed obligatory prayers are made up, and one turns to Allah in repentance for negligence.',ref:'IslamQA',res:'https://islamqa.info/en/answers/13340'},
  {lvl:'intermediate',cat:'Aqīdah',vis:'✨',q:'Belief in the Last Day includes…',opts:['Only this world','Resurrection, judgment, Paradise and Hellfire','Denying the scale','Rejecting prophecy'],a:1,why:'The pillars of faith include belief in the Last Day and what Allah revealed about it.',ref:'Qur’an; Hadith of Jibrīl',res:'https://sunnah.com/muslim:8'},
  {lvl:'intermediate',cat:'Character',vis:'🪞',q:'Backbiting (ghībah) is mentioned in the Qur’an as like…',opts:['Planting a tree','Eating the flesh of one’s dead brother','Giving charity','Fasting'],a:1,why:'Sūrat al-Ḥujurāt warns against ghībah with this severe image.',ref:'Qur’an 49:12',res:'https://quran.com/49/12'},
  {lvl:'intermediate',cat:'Trade',vis:'🛒',q:'A sale involving clear deception and harm is…',opts:['Always recommended','Forbidden (and may be invalid depending on the case)','Required for profit','Only disliked for travelers'],a:1,why:'The Sharīʿah forbids cheating and deceptive sales.',ref:'Hadith “Whoever cheats us is not of us”',res:'https://sunnah.com/muslim:101'},
  {lvl:'intermediate',cat:'Family',vis:'🏠',q:'Kind treatment of parents is…',opts:['Optional culture','A major duty after monotheism in the Qur’an','Only if they are wealthy','Forbidden after marriage'],a:1,why:'Allah pairs worship of Him with excellence to parents in many verses.',ref:'Qur’an 17:23–24',res:'https://quran.com/17/23'},
  {lvl:'intermediate',cat:'Hajj',vis:'🕋',q:'Wuqūf at ʿArafah is…',opts:['Optional sightseeing','An essential pillar of Hajj','Only for residents of Makkah','Replaced by fasting'],a:1,why:'The Prophet ﷺ said Hajj is ʿArafah — standing at ʿArafah is central to the pilgrimage.',ref:'Tirmidhī; IslamQA',res:'https://islamqa.info/en/answers/109290'},
  {lvl:'intermediate',cat:'Hadith',vis:'📚',q:'A ḥasan (good) hadith is generally…',opts:['Fabricated','Acceptable for practice when conditions are met, below ṣaḥīḥ in strength','Equal to rejecting revelation','Only for stories'],a:1,why:'Scholars grade reports; ḥasan is usable with known standards of the science of hadith.',ref:'Hadith sciences overview',res:'https://islamqa.info/en/answers/20153'},
  {lvl:'advanced',cat:'Uṣūl',vis:'🧭',q:'A clear text (naṣṣ) of Qur’an or authentic Sunnah…',opts:['May be ignored for culture','Takes precedence over opinion that contradicts it','Is equal to dreams','Only binds the companions'],a:1,why:'Revelation is the primary source; analogy and opinion serve under its light, not against it.',ref:'Uṣūl al-fiqh foundations',res:'https://islamqa.info/en/answers/21924'},
  {lvl:'advanced',cat:'Fiqh',vis:'📖',q:'When two evidences appear to conflict, scholars…',opts:['Discard Islam','Seek reconciliation, abrogation chronology, or preferred weight by known principles','Follow whichever is shorter','Always prefer the weaker report'],a:1,why:'The science of uṣūl teaches methods to resolve apparent conflict without abandoning the texts.',ref:'Uṣūl al-fiqh',res:'https://islamqa.info/en/answers/20153'},
  {lvl:'advanced',cat:'Aqīdah',vis:'🌙',q:'Seeking absolute unseen knowledge from fortune-tellers is…',opts:['Recommended','Forbidden and harms tawḥīd','Required before marriage','A pillar of Hajj'],a:1,why:'Claiming knowledge of the unseen with soothsayers is rejected in authentic hadiths.',ref:'Muslim',res:'https://sunnah.com/muslim:2228'},
  {lvl:'advanced',cat:'Purification',vis:'💧',q:'Ghusl is required after…',opts:['Every sneeze','Major ritual impurity (janābah) and other established causes','Reading any book','Travel only'],a:1,why:'Major impurity and related causes require ghusl before prayer, as detailed in fiqh.',ref:'IslamQA',res:'https://islamqa.info/en/answers/823'},
  {lvl:'advanced',cat:'Society',vis:'⚖️',q:'Justice (ʿadl) in Islam is…',opts:['Only for one tribe','A command even toward those one dislikes','Optional for rulers only','Opposed to mercy'],a:1,why:'Allah commands justice; it is not cancelled by personal hatred.',ref:'Qur’an 5:8',res:'https://quran.com/5/8'},
  {lvl:'beginner',cat:'Seerah',vis:'🕊️',q:'The Prophet ﷺ migrated from Makkah to…',opts:['Rome','Madinah','Egypt','Yemen only'],a:1,why:'The Hijrah to Madinah is the pivot of the prophetic biography and the Islamic calendar.',ref:'Seerah; Bukhārī',res:'https://sunnah.com/bukhari:3905'},
  {lvl:'beginner',cat:'Wudu',vis:'💧',q:'Wuḍūʾ is required before…',opts:['Sleeping only','The ṣalāh (prayer)','Eating fruit','Writing notes'],a:1,why:'Purification is a condition for the prayer when one is in minor impurity.',ref:'Qur’an 5:6',res:'https://quran.com/5/6'},
  {lvl:'beginner',cat:'Tafseer',vis:'📚',q:'What is the main theme of Sūrat al-Fātiḥah in classical tafsīr?',opts:['Battle rulings only','Praise of Allah, the straight path, and seeking guidance','Inheritance shares','Hajj rites'],a:1,why:'Ibn Kathīr and others: the Fātiḥah gathers tawḥīd, mercy, the Day of Judgment, and the request for ṣirāṭ al-mustaqīm.',ref:'Ibn Kathīr on 1:1–7',res:'https://quran.com/1:1/tafsirs/en-tafisr-ibn-kathir'},
  {lvl:'beginner',cat:'Seerah',vis:'📖',q:'Where did the Prophet ﷺ receive the first revelation?',opts:['The Kaʿbah roof','Cave Ḥirāʾ near Makkah','Madinah marketplace','Ṭāʾif orchard'],a:1,why:'Jibrīl came to him in Cave Ḥirāʾ with Iqraʾ (96:1).',ref:'Bukhārī, beginning of revelation',res:'https://sunnah.com/bukhari:3'},
  {lvl:'moderate',cat:'Tafseer',vis:'📚',q:'In 2:255 (Āyat al-Kursī), “Allah — there is no deity except Him” primarily teaches…',opts:['Calendar rules','Tawḥīd of Allah’s lordship and divinity','Only night prayer length','Trade law'],a:1,why:'The verse is among the greatest on Allah’s oneness, life, and maintenance of creation (Ibn Kathīr).',ref:'Qur’an 2:255',res:'https://quran.com/2/255'},
  {lvl:'moderate',cat:'Seerah',vis:'📖',q:'The Hijrah to Madinah was first to…',opts:['Abyssinia only','Leave persecution and found a community under revelation','Collect jizyah from Makkah','Abandon ṣalāh'],a:1,why:'The Hijrah established the Madinan community after years of harm in Makkah.',ref:'Sīrah Ibn Hishām; Bukhārī',res:'https://sunnah.com/bukhari:3905'},
  {lvl:'advanced',cat:'Tafseer',vis:'📚',q:'“We have not neglected anything in the Book” (6:38) is explained by many mufassirūn as…',opts:['Every worldly recipe is in one muṣḥaf page','Guidance and principles are complete; details come via Sunnah and ijtihād','Canceling all ḥadīth','Only Makkan law'],a:1,why:'Classical tafsīr: the Book’s guidance is complete; the Prophet ﷺ explains it. Not every empirical fact is a verse.',ref:'Qur’an 6:38; Ibn Kathīr',res:'https://quran.com/6/38'},
  {lvl:'advanced',cat:'Seerah',vis:'📖',q:'The Treaty of Ḥudaybiyyah is often described in the sīrah as…',opts:['A military defeat with no wisdom','A seeming concession that opened the way to ʿumrah and later conquest','Abandonment of tawḥīd','A ban on daʿwah'],a:1,why:'The Qur’an calls it a clear opening (48:1). Short-term terms led to long-term spread of the message.',ref:'Qur’an 48:1; Sīrah',res:'https://quran.com/48/1'}

  ,{lvl:'beginner',cat:'Aqīdah',vis:'🕌',q:'Islām, Īmān, and Iḥsān were explained together in which famous ḥadīth?',opts:['Ḥadīth of Jibrīl','Ḥadīth of the fly','Ḥadīth of the cat','Ḥadīth of the date-seller'],a:0,why:'Jibrīl asked the Prophet ﷺ about Islam, Iman, and Ihsan; this is a foundation of Sunni teaching.',ref:'Muslim 8',res:'https://sunnah.com/muslim:8'}
  ,{lvl:'beginner',cat:'ʿIbādah',vis:'🕌',q:'How many obligatory units (rakʿahs) are there in Maghrib?',opts:['Two','Three','Four','Five'],a:1,why:'Maghrib is three fard rakʿahs.',ref:'Prayer consensus',res:'https://islamqa.info'}
  ,{lvl:'beginner',cat:'Akhlaq',vis:'💚',q:'A believer is not a believer fully until he loves for his brother…',opts:['Wealth','What he loves for himself','Silence','Travel'],a:1,why:'Famous ḥadīth in Bukhārī and Muslim.',ref:'Bukhārī 13',res:'https://sunnah.com/bukhari:13'}
  ,{lvl:'beginner',cat:'Qur’an',vis:'📖',q:'Sūrat al-Fātiḥah is recited in…',opts:['Only Jumuʿah','Every rakʿah of ṣalāh (as a rule)','Only tarāwīḥ','Only janazah'],a:1,why:'No prayer is complete without the Opening in the standard teaching of the schools.',ref:'Bukhārī 756',res:'https://sunnah.com/bukhari:756'}
  ,{lvl:'intermediate',cat:'Fiqh',vis:'⚖️',q:'Zakāh becomes due on gold when it reaches…',opts:['Any amount','The niṣāb and a lunar year passes','Only after Hajj','Only on coins minted in Madinah'],a:1,why:'Niṣāb plus ḥawl is the classical condition for zakāh on gold and silver.',ref:'Zakāh manuals',res:'https://islamqa.info'}
  ,{lvl:'intermediate',cat:'Seerah',vis:'🕊',q:'The first masjid the Prophet ﷺ built after the Hijrah in Qubāʾ was followed in Madinah by…',opts:['Masjid al-Ḥarām','Masjid Qubāʾ only','Masjid al-Nabawī','Masjid al-Aqṣā'],a:2,why:'After Qubāʾ he established the Prophet’s Mosque in Madinah.',ref:'Sīrah',res:'https://sunnah.com'}
  ,{lvl:'intermediate',cat:'Tafsīr',vis:'📖',q:'“Indeed with hardship comes ease” is from…',opts:['Al-Baqarah','Al-Sharḥ (94)','Al-Fīl','Al-Ikhlāṣ'],a:1,why:'Qur’an 94:5–6, revealed as comfort after difficulty.',ref:'Qur’an 94:5',res:'https://quran.com/94/5'}
  ,{lvl:'intermediate',cat:'Hadith',vis:'📗',q:'Actions are judged by…',opts:['Volume of speech','Intentions','Clothing','Tribe'],a:1,why:'Innamā al-aʿmāl bi-l-niyyāt — Bukhārī 1.',ref:'Bukhārī 1',res:'https://sunnah.com/bukhari:1'}
  ,{lvl:'advanced',cat:'Uṣūl',vis:'📚',q:'A mutawātir report is…',opts:['A weak isolated story','Narrated by so many independent paths that collusion on a lie is implausible','Any quote on social media','A dream'],a:1,why:'Mutawātir yields certain knowledge in ḥadīth science.',ref:'Muṣṭalaḥ al-ḥadīth',res:'https://sunnah.com'}
  ,{lvl:'advanced',cat:'Farāʾid',vis:'📜',q:'Before Qur’anic shares are given, the estate first pays…',opts:['Gifts to friends','Funeral costs and debts','Optional travel','Dowry already paid'],a:1,why:'Funeral (reasonable) then debts, then wasiyyah, then faraʾid.',ref:'Farāʾid primers',res:'https://clarity-dawah.fyi/islamic-inheritance-calculator/'}
  ,{lvl:'advanced',cat:'Seerah',vis:'🕊',q:'The Treaty of Ḥudaybiyyah is described in the Qur’an as…',opts:['A defeat','A clear opening (fatḥ mubīn)','Abrogation of Hajj','End of prophecy'],a:1,why:'Sūrat al-Fatḥ opens by calling it a clear victory.',ref:'Qur’an 48:1',res:'https://quran.com/48/1'}
  ,{lvl:'beginner',cat:'Grave',vis:'🌙',q:'Which of these is taught to benefit the deceased?',opts:['Wailing as a custom of jāhiliyyah','Duʿāʾ, ṣadaqah, and a righteous child who prays','Building a palace on the grave','Abandoning janazah'],a:1,why:'Muslim 1631: ongoing charity, beneficial knowledge, a child who makes duʿāʾ.',ref:'Muslim 1631',res:'https://sunnah.com/muslim:1631'}
  ,{lvl:'intermediate',cat:'Tajweed',vis:'🔤',q:'Qalqalah letters include…',opts:['س ص ز','ق ط ب ج د','و ي ا','غ خ ع'],a:1,why:'The five qalqalah letters bounce when sākin.',ref:'Tajweed primers',res:'https://www.abouttajweed.com'},
  /* ===== Expanded Tafseer / Seerah / Daily life (beginner) ===== */
  {lvl:'beginner',cat:'Tafseer',vis:'📖',q:'Sūrat al-Fātiḥah is called the Mother of the Book because…',opts:['It is the longest sūrah','It summarizes the core of faith and is recited in every prayer','It was revealed in Madinah only','It has no basmalah'],a:1,why:'It gathers praise, tawḥīd, guidance and the path of those favoured by Allah.',ref:'Ibn Kathīr on 1:1–7',res:'https://quran.com/1'},
  {lvl:'beginner',cat:'Tafseer',vis:'📖',q:'“Guide us to the straight path” (1:6) is a request for…',opts:['Worldly wealth only','Steadfast guidance on Islam until we meet Allah','A shorter prayer','Political power'],a:1,why:'The greatest need after tawḥīd is ongoing guidance.',ref:'Qurʾān 1:6 · Tafseer Ibn Kathīr',res:'https://quran.com/1/6'},
  {lvl:'beginner',cat:'Tafseer',vis:'📖',q:'Āyat al-Kursī (2:255) primarily teaches…',opts:['Rules of inheritance','Allah’s perfect attributes and that nothing tires Him','How to fast','Hajj rituals'],a:1,why:'It affirms His life, self-sufficiency, knowledge and dominion.',ref:'Qurʾān 2:255',res:'https://quran.com/2/255'},
  {lvl:'beginner',cat:'Seerah',vis:'🕊',q:'The first revelation in Cave Ḥirāʾ began with the word…',opts:['Ṣalli','Iqraʾ (Read)','Hajj','Zakāh'],a:1,why:'“Read in the name of your Lord who created…” (96:1).',ref:'Bukhārī · Qurʾān 96:1',res:'https://sunnah.com/bukhari:3'},
  {lvl:'beginner',cat:'Seerah',vis:'🕊',q:'The Prophet ﷺ migrated from Makkah to…',opts:['Ṭāʾif only','Madinah (Yathrib)','Egypt','Yemen'],a:1,why:'The Hijrah established the first Muslim community in Madinah.',ref:'Seerah · Bukhārī',res:'https://sunnah.com/bukhari:3905'},
  {lvl:'beginner',cat:'Seerah',vis:'🕊',q:'Who was the first free adult man to accept Islam?',opts:['ʿUmar','Abū Bakr al-Ṣiddīq','Khālid ibn al-Walīd','Muʿāwiyah'],a:1,why:'Abū Bakr was among the earliest and strongest supporters.',ref:'Seerah books · authentic reports',res:'https://islamqa.info/en/answers/14629'},
  {lvl:'beginner',cat:'Daily',vis:'🏠',q:'Before eating, the Sunnah is to say…',opts:['Nothing','Bismillāh','Only Alḥamdulillāh after','Allāhu akbar three times'],a:1,why:'Mentioning Allah’s name at the start of food is established Sunnah.',ref:'Bukhārī; Muslim',res:'https://sunnah.com/bukhari:5376'},
  {lvl:'beginner',cat:'Daily',vis:'🏠',q:'When entering the home it is recommended to…',opts:['Shout your name','Give salām and mention Allah','Remain silent always','Knock once only'],a:1,why:'Greeting brings blessing to the household.',ref:'Qurʾān 24:61 · adab',res:'https://islamqa.info/en/answers/13200'},
  {lvl:'beginner',cat:'Daily',vis:'🏠',q:'Kindness to parents is…',opts:['Optional after wealth','A major duty second only to worship of Allah in many āyāt','Only for mothers','Only when they are Muslim scholars'],a:1,why:'Allah paired worship of Him with excellence to parents.',ref:'Qurʾān 17:23',res:'https://quran.com/17/23'},
  {lvl:'beginner',cat:'Daily',vis:'🏠',q:'Removing harm from the road is…',opts:['Wasted effort','A branch of faith (īmān)','Only for city councils','Disliked'],a:1,why:'The Prophet ﷺ listed it among the branches of faith.',ref:'Muslim',res:'https://sunnah.com/muslim:35'},

  /* intermediate / moderate */
  {lvl:'intermediate',cat:'Tafseer',vis:'📖',q:'In Sūrat al-Kahf, the companions of the cave were protected because of their…',opts:['Wealth','Faith and duʿāʾ for mercy and guidance','Military strength','Trade skills'],a:1,why:'They called on the Lord of the heavens and earth and were granted sleep as a mercy.',ref:'Qurʾān 18:10–16',res:'https://quran.com/18/10'},
  {lvl:'intermediate',cat:'Tafseer',vis:'📖',q:'“Indeed, with hardship comes ease” (94:5–6) is repeated to emphasize…',opts:['Ease never comes','Relief is promised with difficulty; do not despair','Only one hardship in life','Abandon effort'],a:1,why:'Allah states the promise twice for emphasis and comfort.',ref:'Qurʾān 94:5–6 · Ibn Kathīr',res:'https://quran.com/94'},
  {lvl:'intermediate',cat:'Tafseer',vis:'📖',q:'Sūrat al-Ḥujurāt teaches believers not to…',opts:['Pray in congregation','Spy on one another or backbite','Give zakāh','Fast Monday'],a:1,why:'It forbids suspicion, spying and backbiting — likened to eating a dead brother’s flesh.',ref:'Qurʾān 49:12',res:'https://quran.com/49/12'},
  {lvl:'intermediate',cat:'Seerah',vis:'🕊',q:'At Ḥudaybiyyah the treaty looked unfavourable, yet Allah called it…',opts:['A defeat','A clear opening (fatḥ mubīn)','Useless','Only a truce for Quraysh'],a:1,why:'Sūrat al-Fatḥ opens by describing it as a clear victory.',ref:'Qurʾān 48:1 · Seerah',res:'https://quran.com/48/1'},
  {lvl:'intermediate',cat:'Seerah',vis:'🕊',q:'In the cave during the Hijrah, Abū Bakr was afraid; the Prophet ﷺ said…',opts:['Run','Do not grieve; Allah is with us','Fight them alone','Surrender'],a:1,why:'Qurʾān 9:40 records this reassurance.',ref:'Qurʾān 9:40 · Bukhārī',res:'https://quran.com/9/40'},
  {lvl:'intermediate',cat:'Seerah',vis:'🕊',q:'The Prophet ﷺ said he was only a human and judged by what he heard, warning that…',opts:['Judges are always right','A favourable verdict does not make the ḥarām ḥalāl for the one who knows the truth','Eloquence is forbidden','Only written proofs count'],a:1,why:'He warned against taking another’s right through clever speech.',ref:'Bukhārī 6967',res:'https://sunnah.com/bukhari:6967'},
  {lvl:'intermediate',cat:'Daily',vis:'🏠',q:'Lowering the gaze is commanded to protect…',opts:['Eyesight only','The heart and chastity of men and women','Fashion sense','Sleep quality'],a:1,why:'Qurʾān 24:30–31 links gaze, modesty and purity.',ref:'Qurʾān 24:30–31',res:'https://quran.com/24/30'},
  {lvl:'intermediate',cat:'Daily',vis:'🏠',q:'When two Muslims meet, the Sunnah includes…',opts:['Ignoring the younger','Spreading salām and smiling','Only handshakes without words','Asking for money first'],a:1,why:'Spreading salām is from īmān and brings love.',ref:'Muslim',res:'https://sunnah.com/muslim:54'},
  {lvl:'intermediate',cat:'Daily',vis:'🏠',q:'Truthfulness in speech and trade leads to…',opts:['Poverty','Being recorded as truthful with Allah; lying leads toward disbelief','Only worldly success','Nothing spiritual'],a:1,why:'Truthfulness guides to righteousness and Paradise.',ref:'Bukhārī; Muslim',res:'https://sunnah.com/bukhari:6094'},
  {lvl:'intermediate',cat:'Fiqh',vis:'⚖️',q:'A bequest (waṣiyyah) to an heir who already has a fixed Qurʾānic share is…',opts:['Always valid','Not valid without the consent of the other heirs (majority view)','Required by law','Unlimited'],a:1,why:'“No bequest for an heir” — unless other heirs allow it.',ref:'Bukhārī · fiqh',res:'https://islamqa.info/en/answers/111834'},

  /* also tag moderate for bank compatibility */
  {lvl:'moderate',cat:'Tafseer',vis:'📖',q:'“Allah does not burden a soul beyond its capacity” (2:286) teaches…',opts:['No effort is needed','Responsibility is matched to ability; hardship has limits set by Allah','Only prophets are tested','Sin has no consequence'],a:1,why:'A foundational mercy in the closing of al-Baqarah.',ref:'Qurʾān 2:286',res:'https://quran.com/2/286'},
  {lvl:'moderate',cat:'Seerah',vis:'🕊',q:'After Uḥud the Prophet ﷺ was told to…',opts:['Abandon consultation','Pardon them, seek forgiveness for them, and consult them in the matter','Never trust the companions','Stop preaching'],a:1,why:'Qurʾān 3:159 combines mercy with shūrā.',ref:'Qurʾān 3:159',res:'https://quran.com/3/159'},
  {lvl:'moderate',cat:'Daily',vis:'🏠',q:'Controlling anger: the strong person is the one who…',opts:['Wins every fight','Controls himself when angry','Never feels anger','Shouts the loudest'],a:1,why:'Strength is self-mastery, not physical force alone.',ref:'Bukhārī; Muslim',res:'https://sunnah.com/bukhari:6114'},

  /* advanced */
  {lvl:'advanced',cat:'Tafseer',vis:'📖',q:'In the story of Mūsā and al-Khiḍr (18:60–82), the key lesson about knowledge is…',opts:['All knowledge is equal','Human knowledge is limited; outward harm may hide wisdom known only to Allah','Prophets need no teachers','Travel is forbidden'],a:1,why:'Mūsā was taught patience with a wisdom he could not see at first.',ref:'Qurʾān 18:60–82 · Ibn Kathīr',res:'https://quran.com/18/66'},
  {lvl:'advanced',cat:'Tafseer',vis:'📖',q:'Sūrat al-Nūr’s light verse (24:35) is often explained as…',opts:['A physics lesson only','Allah is the Light of the heavens and earth; guidance that illuminates the heart','A description of the sun','Only for scholars'],a:1,why:'Classical tafsīr links it to divine guidance and the believer’s heart.',ref:'Qurʾān 24:35 · Tafseer',res:'https://quran.com/24/35'},
  {lvl:'advanced',cat:'Tafseer',vis:'📖',q:'“Do not follow that of which you have no knowledge” (17:36) warns against…',opts:['Seeking education','Speaking or judging without knowledge — the hearing, sight and heart will be questioned','Reading books','Asking scholars'],a:1,why:'Accountability for the senses and the heart.',ref:'Qurʾān 17:36',res:'https://quran.com/17/36'},
  {lvl:'advanced',cat:'Seerah',vis:'🕊',q:'When Usāmah tried to intercede for a noble woman who stole, the Prophet ﷺ said…',opts:['Status excuses ḥudūd','If Fāṭimah stole, he would carry out the ḥadd; laws of Allah are not bent for status','Forgive all theft','Only men are punished'],a:1,why:'Justice is equal; intercession does not cancel ḥudūd.',ref:'Bukhārī 3475',res:'https://sunnah.com/bukhari:3475'},
  {lvl:'advanced',cat:'Seerah',vis:'🕊',q:'At Badr the Qurʾān says “you did not throw when you threw, but Allah threw” (8:17) to teach…',opts:['No human effort matters','Victory is from Allah even while believers take the means','Throwing stones is the only tactic','Muslims should not prepare'],a:1,why:'Tawḥīd of action: means are taken, results are from Allah.',ref:'Qurʾān 8:17',res:'https://quran.com/8/17'},
  {lvl:'advanced',cat:'Seerah',vis:'🕊',q:'The Prophet ﷺ judged between people by revelation when it came, and by apparent claims when it did not, and warned that…',opts:['His judgement makes ḥarām ḥalāl permanently','A court decision does not change the reality of a right before Allah','Only written contracts count','He never erred in perception'],a:1,why:'Worldly verdicts do not legalise the forbidden for the one who knows.',ref:'Bukhārī 7185',res:'https://sunnah.com/bukhari:7185'},
  {lvl:'advanced',cat:'Daily',vis:'🏠',q:'Backbiting is defined as mentioning your brother in a way he dislikes; if what you say is false it is…',opts:['Still only backbiting','Slander (buhtān) — worse','Permissible joke','Required for advice'],a:1,why:'False accusation is buhtān; truth said to shame is ghībah.',ref:'Muslim',res:'https://sunnah.com/muslim:2589'},
  {lvl:'advanced',cat:'Daily',vis:'🏠',q:'Enjoining good and forbidding wrong is…',opts:['Only for rulers','A collective and individual duty balanced with wisdom and ability','Forbidden in public','Only about prayer times'],a:1,why:'The ummah is described as the best for this quality (3:104, 3:110).',ref:'Qurʾān 3:104',res:'https://quran.com/3/104'},
  {lvl:'advanced',cat:'Daily',vis:'🏠',q:'Spending on one’s family is…',opts:['Wasted charity','A form of ṣadaqah when done seeking Allah’s face','Only obligatory for the rich','Inferior to mosque donations'],a:1,why:'The Prophet ﷺ taught that provision for family is rewarded as charity.',ref:'Bukhārī; Muslim',res:'https://sunnah.com/bukhari:55'},
  {lvl:'advanced',cat:'Fiqh',vis:'⚖️',q:'In inheritance, debts and funeral expenses are paid…',opts:['After all bequests','Before wasiyyah and fixed shares','Only if heirs agree','Never from the estate'],a:1,why:'Classical order: shroud/funeral → debts → optional wasiyyah (≤⅓) → farāʾiḍ.',ref:'Fiqh · IslamQA',res:'https://islamqa.info/en/answers/111834'}
];

async function clarityFetchDailyDeepLearn(){
  var host = document.getElementById('clarity-daily-deep');
  if(!host) return;
  var day = (new Date()).toISOString().slice(0,10);
  try{
    var cached = sessionStorage.getItem('clarity_daily_deep_'+day);
    if(cached){ host.innerHTML = cached; return; }
  }catch(e){}
  host.innerHTML = '<span class="loading-msg">Refreshing daily light…</span>';
  var html = '';
  try{
    /* Authentic short hadith via UmmahAPI random */
    var r = await fetch('https://ummahapi.com/api/hadiths/random', {credentials:'omit'});
    if(r.ok){
      var data = await r.json();
      var h = data.data || data.hadith || data;
      var body = (h.body || h.text || h.hadith || '').replace(/<[^>]+>/g,'').trim();
      var book = h.book || h.collection || '';
      var num = h.number || h.hadithNumber || '';
      if(body && body.length > 40){
        html += '<div class="daily-deep-card"><div class="daily-deep-label">📜 Hadith light · today</div><p class="daily-deep-text">'+(body.length>320?body.slice(0,320)+'…':body)+'</p>';
        if(book) html += '<div class="ref">'+book+(num?(' · '+num):'')+'</div>';
        html += '<a class="daily-deep-link" href="https://sunnah.com/search?q='+encodeURIComponent(body.slice(0,80))+'" target="_blank" rel="noopener">Verify on Sunnah.com</a></div>';
      }
    }
  }catch(e){}
  try{
    /* Ayah of reflection via alquran.cloud */
    var pool = (typeof VERSE_POOL!=='undefined' && VERSE_POOL.length) ? VERSE_POOL : [{s:2,a:255}];
    var d = new Date();
    var idx = (d.getFullYear()*365 + d.getMonth()*31 + d.getDate()) % pool.length;
    var v = pool[idx];
    var key = v.s+':'+v.a;
    var ar = await fetch('https://api.alquran.cloud/v1/ayah/'+key+'/en.sahih');
    if(ar.ok){
      var jd = await ar.json();
      var text = (jd.data && jd.data.text) ? jd.data.text : '';
      if(text){
        html += '<div class="daily-deep-card"><div class="daily-deep-label">📖 Āyah · today</div><p class="daily-deep-text">'+text+'</p><div class="ref">Qur’an '+key+' · Sahih International</div><a class="daily-deep-link" href="https://quran.com/'+v.s+'/'+v.a+'" target="_blank" rel="noopener">Open on Quran.com</a></div>';
      }
    }
  }catch(e){}
  if(!html) html = '<div class="daily-deep-card"><p class="daily-deep-text">Open Quran.com or Sunnah.com for today’s reading. Offline cache will fill when you are online.</p></div>';
  host.innerHTML = html;
  try{ sessionStorage.setItem('clarity_daily_deep_'+day, html); }catch(e){}
}
window.clarityFetchDailyDeepLearn = clarityFetchDailyDeepLearn;

function fqTodayKey(){
  var d=new Date();
  /* Local calendar day — avoids UTC “yesterday” stickiness */
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function fqDaySeed(){
  return fqTodayKey()+'|clarity-fiqh-v6|'+String((FQ_BANK&&FQ_BANK.length)||0);
}
function fqFreshState(){return {day:fqTodayKey(),level:'beginner',idx:0,correct:0,answered:[],streak:0,best:0,totalCorrect:0,lastCompleteDay:'',seed:fqDaySeed()+'|beginner'};}
function fqLoad(){
  try{
    var raw=localStorage.getItem(FQ_KEY);
    if(!raw) return fqFreshState();
    var s=JSON.parse(raw);
    if(!s||typeof s!=='object') return fqFreshState();
    if(s.day!==fqTodayKey()){
      var streak=s.streak||0, last=s.lastCompleteDay||'';
      var y=(function(){var d=new Date();d.setDate(d.getDate()-1);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');})();
      if(last!==y&&last!==fqTodayKey()) streak=0;
      return Object.assign(fqFreshState(),{streak:streak,best:s.best||0,totalCorrect:s.totalCorrect||0,lastCompleteDay:last,level:s.level||'beginner'});
    }
    if(!s.level) s.level='beginner';
    return s;
  }catch(e){return fqFreshState();}
}
function fqSave(s){try{localStorage.setItem(FQ_KEY,JSON.stringify(s));}catch(e){}}
function fqHash(str){var h=2166136261>>>0;for(var i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}return h>>>0;}
function fqNormalizeLevel(level){
  level = (level||'beginner').toLowerCase();
  if(level==='intermediate' || level==='moderate') return 'intermediate';
  if(level==='advanced') return 'advanced';
  return 'beginner';
}
function fqLevelMatch(qLvl, want){
  want = fqNormalizeLevel(want);
  qLvl = (qLvl||'').toLowerCase();
  if(want==='intermediate') return qLvl==='intermediate' || qLvl==='moderate';
  return qLvl === want;
}
function fqTopicMatch(q, topic){
  if(!topic || topic==='all') return true;
  var c = String((q&&q.cat)||'');
  if(topic==='Tafseer') return /tafs[eē]{1,2}r|tafsīr|qur/i.test(c);
  if(topic==='Seerah') return /seerah|sīrah|sira|hadith/i.test(c);
  if(topic==='Daily') return /daily|manners|character|adab|akhlaq|family|society|trade|du/i.test(c);
  if(topic==='Fiqh') return /fiqh|prayer|fast|zak|purif|wudu|hajj|farā|faraid|ʿibādah|ibadah/i.test(c);
  return true;
}
function fqBankForLevel(level, topic){
  level = fqNormalizeLevel(level);
  topic = topic || (typeof fqState==='object' && fqState && fqState.topic) || 'all';
  var list = FQ_BANK.filter(function(q){
    return fqLevelMatch(q.lvl, level) && fqTopicMatch(q, topic);
  });
  if(list.length < 5){
    list = FQ_BANK.filter(function(q){ return fqLevelMatch(q.lvl, level); });
  }
  if(list.length < 5) list = FQ_BANK.slice();
  return list;
}
function fqCardId(q){
  return String((q&&q.q)||'').slice(0,80);
}
function fqPickDaily(seedStr, level, excludeIds){
  var bank=fqBankForLevel(level).slice();
  excludeIds = excludeIds || [];
  var filtered = bank.filter(function(q){ return excludeIds.indexOf(fqCardId(q)) < 0; });
  if(filtered.length < 6) filtered = bank.slice();
  var seed=fqHash((seedStr||fqDaySeed())+'|'+level+'|v8|'+String(filtered.length));
  var idxs=[]; for(var i=0;i<filtered.length;i++) idxs.push(i);
  for(var i=idxs.length-1;i>0;i--){
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;
    var j=seed%(i+1);
    var t=idxs[i]; idxs[i]=idxs[j]; idxs[j]=t;
  }
  /* Extra entropy: mix in seconds-of-day bucket so same morning vs evening can vary after force refresh */
  return idxs.slice(0, Math.min(10, filtered.length)).map(function(i){ return filtered[i]; });
}
var fqState=null,fqCards=[];
function fqEnsure(force){
  if(!fqState) fqState=fqLoad();
  if(!fqState.topic){
    try{ fqState.topic = localStorage.getItem(FQ_TOPIC_KEY) || 'all'; }catch(e){ fqState.topic='all'; }
  }
  var today=fqTodayKey();
  var lvl = (typeof fqNormalizeLevel==='function') ? fqNormalizeLevel(fqState.level||'beginner') : (fqState.level||'beginner');
  fqState.level = lvl;
  var wantSeed=fqDaySeed()+'|'+lvl+'|'+(fqState.topic||'all')+'|v10';
  var forced = force || (String(fqState.seed||'').indexOf('|v9|')>=0 || String(fqState.seed||'').indexOf('|v10|')>=0) && fqState.day===today;
  var broken = force || !fqCards.length || fqState.day!==today || (!forced && fqState.seed!==wantSeed) || !fqCards[0] || !fqCards[0].vis || !fqCards[0].q;
  if(broken){
    var prevIds = [];
    try{ prevIds = JSON.parse(localStorage.getItem('clarity_fq_prev_ids')||'[]'); }catch(e){}
    if(fqState.day!==today){
      var prev=fqState; fqState=fqLoad();
      if(prev && prev.level) fqState.level = (typeof fqNormalizeLevel==='function') ? fqNormalizeLevel(prev.level) : prev.level;
      if(prev && prev.topic) fqState.topic = prev.topic;
    }
    fqState.day=today;
    fqState.seed=wantSeed;
    fqState.idx=0; fqState.correct=0; fqState.answered=[];
    fqCards=fqPickDaily(wantSeed, fqState.level||'beginner', prevIds);
    if(!fqCards.length || !fqCards[0] || !fqCards[0].q){
      fqCards = fqBankForLevel(fqState.level||'beginner').slice(0,10);
    }
    try{
      localStorage.setItem('clarity_fq_prev_ids', JSON.stringify(fqCards.map(fqCardId)));
    }catch(e){}
    try{ fqSave(fqState); }catch(e){}
  }
}
function fqForceNewDeck(){
  var prev=[];
  try{ prev=JSON.parse(localStorage.getItem('clarity_fq_prev_ids')||'[]'); }catch(e){}
  if(!Array.isArray(prev)) prev=[];
  try{
    if(typeof fqCards!=='undefined' && fqCards && fqCards.length){
      fqCards.forEach(function(c){ var id=fqCardId(c); if(prev.indexOf(id)<0) prev.push(id); });
    }
  }catch(e2){}
  if(prev.length>80) prev=prev.slice(-80);
  fqState=fqFreshState();
  fqState.seed=fqDaySeed()+'|'+(fqState.level||'beginner')+'|v9|'+String(Date.now());
  fqCards=fqPickDaily(fqState.seed, fqState.level||'beginner', prev);
  try{
    fqCards.forEach(function(c){ var id=fqCardId(c); if(prev.indexOf(id)<0) prev.push(id); });
    localStorage.setItem('clarity_fq_prev_ids', JSON.stringify(prev));
  }catch(e3){}
  try{ fqSave(); }catch(e4){}
  fqRender();
}
function fqResetSeenDecks(){
  try{ localStorage.removeItem('clarity_fq_prev_ids'); }catch(e){}
  fqForceNewDeck();
}
window.fqForceNewDeck = fqForceNewDeck;

/* ===== Sharia IQ Test ===== */
var siqState = { on:false, idx:0, score:0, cards:[], timed:true, timer:null, left:60, answered:0, hideCorrect:true, online:true, correctIds:[], sessionCorrect:[] };

function siqShow(which){
  which = which || 'daily';
  document.querySelectorAll('.siq-tab').forEach(function(b){
    b.classList.toggle('active', b.getAttribute('data-siq')===which);
  });
  var d = document.getElementById('siq-panel-daily');
  var q = document.getElementById('siq-panel-iq');
  if(d){ d.classList.toggle('active', which==='daily'); d.hidden = which!=='daily'; }
  if(q){ q.classList.toggle('active', which==='iq'); q.hidden = which!=='iq'; }
  if(which==='daily'){ try{ fqRender(); }catch(e){} }
}

/* --- SIQ: hide-correct, online fetch, daily log --- */
var SIQ_ONLINE_BANK = [];
function siqCorrectStoreKey(){ return 'clarity_siq_correct_ids_v1'; }
function siqLogStoreKey(){ return 'clarity_siq_daily_log_v1'; }
function siqLoadCorrectIds(){
  try {
    var raw = localStorage.getItem(siqCorrectStoreKey());
    var arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch(e){ return []; }
}
function siqSaveCorrectIds(ids){
  try { localStorage.setItem(siqCorrectStoreKey(), JSON.stringify(ids||[])); } catch(e){}
}
function siqQid(q){
  if(!q) return '';
  if(q.id) return String(q.id);
  return String(q.q||'').slice(0,120);
}
function siqLoadLogs(){
  try {
    var raw = localStorage.getItem(siqLogStoreKey());
    var arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch(e){ return []; }
}
function siqPushLog(entry){
  try {
    var logs = siqLoadLogs();
    logs.unshift(entry);
    if(logs.length > 60) logs = logs.slice(0,60);
    localStorage.setItem(siqLogStoreKey(), JSON.stringify(logs));
  } catch(e){}
}
function siqShowDailyLog(){
  var box = document.getElementById('siq-daily-log');
  if(!box) return;
  box.hidden = !box.hidden;
  if(box.hidden) return;
  var logs = siqLoadLogs();
  if(!logs.length){
    box.innerHTML = '<em>No IQ sessions logged yet. Complete a test to record today’s progress.</em>';
    return;
  }
  box.innerHTML = '<strong>Daily IQ log</strong> (saved on this device)' +
    '<ul style="margin:.35rem 0 0;padding-left:1.1rem">' +
    logs.slice(0,14).map(function(L){
      return '<li><strong>'+ (L.date||'') +'</strong> · index '+ (L.index||'—') +
        ' · '+ (L.pct||0) +'% · correct '+ (L.correct||0) +'/'+ (L.answered||0) +
        (L.online ? ' · online' : '') + '</li>';
    }).join('') + '</ul>';
}
async function siqFetchOnlineBank(force){
  var st = document.getElementById('siq-online-status');
  if(st) st.textContent = 'Fetching deeper questions from authentic sources…';
  var merged = [];
  try {
    if(typeof fetch === 'function'){
      var refs = [
        [2,255],[2,286],[3,102],[3,31],[4,36],[4,59],[4,65],[4,80],[5,3],[8,20],
        [9,119],[16,90],[17,23],[18,10],[24,51],[25,63],[33,21],[33,36],[33,70],[33,71],
        [49,10],[49,12],[49,13],[59,7],[67,2],[94,5],[103,3],[112,1]
      ];
      var day = (typeof fqTodayKey==='function'?fqTodayKey():'') + String(force||'');
      var h = 0; for(var i=0;i<day.length;i++) h=((h<<5)-h)+day.charCodeAt(i)|0;
      var picks = [];
      for(var k=0;k<8;k++){
        h = (Math.imul(h,1664525)+1013904223)>>>0;
        picks.push(refs[h % refs.length]);
      }
      for(var p=0;p<picks.length;p++){
        try {
          var sa = picks[p];
          var url = 'https://api.alquran.cloud/v1/ayah/'+sa[0]+':'+sa[1]+'/en.sahih';
          var res = await fetch(url);
          if(!res.ok) continue;
          var data = await res.json();
          var text = (data && data.data && data.data.text) ? data.data.text : '';
          if(!text) continue;
          var short = text.length > 160 ? text.slice(0,157)+'…' : text;
          merged.push({
            id: 'online-quran-'+sa[0]+'-'+sa[1],
            q: 'Reflection (Qurʾān '+sa[0]+':'+sa[1]+'): What core duty does this guide toward? «'+short+'»',
            opts: [
              'Obedience to Allah and living by revelation',
              'Ignoring revelation when inconvenient',
              'Following culture over Qurʾān and Sunnah',
              'Treating worship as optional social custom'
            ],
            a: 0,
            lvl: 'intermediate',
            cat: 'Qurʾān',
            topic: 'Tafseer',
            why: 'The Qurʾān calls believers to submit to Allah and act on guidance.',
            res: 'https://quran.com/'+sa[0]+'/'+sa[1],
            ref: 'Quran.com · '+sa[0]+':'+sa[1]
          });
        } catch(eOne){}
      }
    }
  } catch(eAll){}
  var deep = [
    {id:'deep-1',q:'What is the maximum portion of a wasiyyah (bequest) from the net estate for non-heirs?',opts:['One-third','One-half','Two-thirds','Unlimited'],a:0,lvl:'intermediate',cat:'Fiqh',why:'Classic rule: bequests to non-heirs up to one-third unless heirs consent.',res:'https://islamqa.info',ref:'Fiqh · wasiyyah'},
    {id:'deep-2',q:'“Samiʿnā wa aṭaʿnā” primarily expresses:',opts:['Hearing and obeying Allah and His Messenger','Hearing without action','Obeying only cultural elders','Delaying rulings until convenient'],a:0,lvl:'beginner',cat:'ʿAqīdah',why:'Qurʾān 24:51 describes believers’ response: we hear and we obey.',res:'https://quran.com/24/51',ref:'An-Nūr 24:51'},
    {id:'deep-3',q:'In inheritance (farāʾid), fixed Qurʾānic shares are given:',opts:['Before residual ʿaṣabah distribution','Only after all bequests unlimited','Only to non-Muslims','By equal split ignoring text'],a:0,lvl:'advanced',cat:'Fiqh',why:'Aṣḥāb al-furūḍ take prescribed shares first.',res:'https://islamqa.info',ref:'Farāʾid'},
    {id:'deep-4',q:'Following the Prophet ﷺ is linked in the Qurʾān to:',opts:['Love of Allah (3:31)','Abandoning the Sunnah','Preferring local custom only','Rejecting revelation'],a:0,lvl:'beginner',cat:'Seerah',why:'Āl ʿImrān 3:31 ties love of Allah to following the Messenger.',res:'https://quran.com/3/31',ref:'3:31'},
    {id:'deep-5',q:'Zakāt is best described as:',opts:['Obligatory purification of wealth for eligible categories','Optional tip for charity only','Tax identical in every country law','Only due on gold jewelry of children'],a:0,lvl:'intermediate',cat:'Fiqh',why:'Zakāt is a pillar with nisāb and Qurʾānic categories of recipients.',res:'https://islamqa.info',ref:'Zakāt'},
    {id:'deep-6',q:'Accepting the Prophet’s ﷺ judgement in disputes is tied to:',opts:['True faith (4:65)','Political preference only','Poetry contests','Trade season customs'],a:0,lvl:'intermediate',cat:'ʿAqīdah',why:'An-Nisāʾ 4:65 links real īmān to accepting his judgement.',res:'https://quran.com/4/65',ref:'4:65'},
    {id:'deep-7',q:'The five daily prayers were obligated during:',opts:['The Night Journey (Isrāʾ & Miʿrāj)','Only after the conquest of Makkah','At the Treaty of Ḥudaybiyyah','In the year of the elephant'],a:0,lvl:'beginner',cat:'Seerah',why:'Ṣalāh was prescribed during the Miʿrāj, a core seerah event.',res:'https://sunnah.com',ref:'Seerah · ṣalāh'},
    {id:'deep-8',q:'Riba (usury/interest) in clear Qurʾānic terms is:',opts:['Prohibited with a strong warning','Recommended for trade growth','Allowed if both parties agree privately','Only disliked without sin'],a:0,lvl:'intermediate',cat:'Fiqh',why:'Qurʾān 2:275–279 strongly prohibits riba.',res:'https://quran.com/2/275',ref:'2:275–279'},
    {id:'deep-9',q:'Gheebah (backbiting) is likened in the Qurʾān to:',opts:['Eating the flesh of one’s dead brother','A minor social joke with no harm','Obligatory advice in all cases','Only a problem if the person hears it'],a:0,lvl:'beginner',cat:'Character',why:'Al-Ḥujurāt 49:12 warns against suspicion and backbiting.',res:'https://quran.com/49/12',ref:'49:12'},
    {id:'deep-10',q:'A valid wasiyyah may be given to:',opts:['Non-heirs or charity within the one-third cap','Fixed-share heirs to increase their farḍ','Anyone for the entire estate','Creditors instead of paying debts'],a:0,lvl:'advanced',cat:'Fiqh',why:'Bequests to Qurʾānic heirs to enlarge their share are not the proper channel; debts are paid first.',res:'https://islamqa.info',ref:'Wasiyyah'},
    {id:'deep-11',q:'The best among people, as taught in ḥadīth culture, are those who:',opts:['Benefit others and have good character','Argue the longest','Hide knowledge','Seek status over sincerity'],a:0,lvl:'beginner',cat:'Character',why:'Prophetic teachings elevate benefit to people and good character.',res:'https://sunnah.com',ref:'Character'},
    {id:'deep-12',q:'Before distributing farāʾiḍ shares one should first:',opts:['Settle funeral costs and debts','Give unlimited gifts to relatives','Equal-split everything by local custom','Ignore wasiyyah rules'],a:0,lvl:'intermediate',cat:'Fiqh',why:'Estate order: burial/debts, optional wasiyyah, then inheritance shares.',res:'https://islamqa.info',ref:'Farāʾiḍ order'}
  ];
  merged = merged.concat(deep);
  SIQ_ONLINE_BANK = merged;
  try { localStorage.setItem('clarity_siq_online_bank', JSON.stringify(merged)); } catch(e){}
  if(st) st.textContent = 'Online bank ready: '+merged.length+' deeper items (Quran.com + classical topics). Falls back to stored deck if offline.';
  return merged;
}
function siqEnsureOnlineCached(){
  if(SIQ_ONLINE_BANK.length) return SIQ_ONLINE_BANK;
  try {
    var raw = localStorage.getItem('clarity_siq_online_bank');
    var arr = raw ? JSON.parse(raw) : [];
    if(Array.isArray(arr) && arr.length){ SIQ_ONLINE_BANK = arr; return arr; }
  } catch(e){}
  /* Baseline deeper bank (always available offline) */
  SIQ_ONLINE_BANK = [
    {id:'deep-1',q:'What is the maximum portion of a wasiyyah (bequest) from the net estate for non-heirs?',opts:['One-third','One-half','Two-thirds','Unlimited'],a:0,lvl:'intermediate',cat:'Fiqh',why:'Bequests to non-heirs up to one-third unless heirs consent.',res:'https://islamqa.info',ref:'Wasiyyah'},
    {id:'deep-2',q:'“Samiʿnā wa aṭaʿnā” primarily expresses:',opts:['Hearing and obeying Allah and His Messenger','Hearing without action','Obeying only cultural elders','Delaying rulings'],a:0,lvl:'beginner',cat:'ʿAqīdah',why:'Qurʾān 24:51.',res:'https://quran.com/24/51',ref:'24:51'},
    {id:'deep-7',q:'The five daily prayers were obligated during:',opts:['The Night Journey (Isrāʾ & Miʿrāj)','Only after the conquest of Makkah','At Ḥudaybiyyah','Year of the elephant'],a:0,lvl:'beginner',cat:'Seerah',why:'Ṣalāh prescribed during Miʿrāj.',res:'https://sunnah.com',ref:'Seerah'},
    {id:'deep-8',q:'Riba (usury/interest) in the Qurʾān is:',opts:['Prohibited with a strong warning','Recommended for trade','Allowed if private','Only disliked'],a:0,lvl:'intermediate',cat:'Fiqh',why:'2:275–279.',res:'https://quran.com/2/275',ref:'2:275'},
    {id:'deep-9',q:'Gheebah (backbiting) is likened to:',opts:['Eating the flesh of one’s dead brother','A harmless joke','Obligatory advice always','Only wrong if heard'],a:0,lvl:'beginner',cat:'Character',why:'49:12.',res:'https://quran.com/49/12',ref:'49:12'},
    {id:'deep-12',q:'Before farāʾiḍ shares one should first:',opts:['Settle funeral costs and debts','Give unlimited gifts','Equal-split by custom','Ignore wasiyyah'],a:0,lvl:'intermediate',cat:'Fiqh',why:'Debts and burial first.',res:'https://islamqa.info',ref:'Farāʾiḍ'}
  ];
  return SIQ_ONLINE_BANK;
}
try {
  window.siqFetchOnlineBank = siqFetchOnlineBank;
  window.siqShowDailyLog = siqShowDailyLog;
  window.siqLoadCorrectIds = siqLoadCorrectIds;
} catch(eW){}

function siqBuildDeck(){
  var bank = (typeof FQ_BANK!=='undefined' && FQ_BANK.length) ? FQ_BANK.slice() : [];
  var online = siqEnsureOnlineCached();
  if(siqState.online && online.length){
    bank = bank.concat(online);
  }
  /* Hide correctly answered by default */
  if(siqState.hideCorrect){
    var done = {};
    (siqLoadCorrectIds()||[]).forEach(function(id){ done[String(id)] = true; });
    var filtered = bank.filter(function(x){ return !done[siqQid(x)]; });
    if(filtered.length >= 8) bank = filtered;
  }
  var beg = bank.filter(function(x){return x.lvl==='beginner';});
  var mid = bank.filter(function(x){return x.lvl==='intermediate';});
  var adv = bank.filter(function(x){return x.lvl==='advanced' || !x.lvl;});
  function shuffle(arr){
    var seed = (typeof fqHash==='function' ? fqHash(String(Date.now())+'|siq|'+String(arr.length)+'|'+(typeof fqTodayKey==='function'?fqTodayKey():'')) : Date.now());
    var a = arr.slice();
    for(var i=a.length-1;i>0;i--){
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;
      var j=seed%(i+1); var t=a[i]; a[i]=a[j]; a[j]=t;
    }
    return a;
  }
  var deck = shuffle(beg).slice(0,5).concat(shuffle(mid).slice(0,5)).concat(shuffle(adv).slice(0,5));
  if(deck.length < 15) deck = shuffle(bank).slice(0,15);
  return shuffle(deck).slice(0,15);
}

function siqStart(){
  siqState.timed = !!(document.getElementById('siq-timed')||{}).checked;
  siqState.hideCorrect = !!(document.getElementById('siq-hide-correct')||{checked:true}).checked;
  siqState.online = !!(document.getElementById('siq-online-fetch')||{checked:true}).checked;
  siqState.sessionCorrect = [];
  if(siqState.online){
    try {
      var st = document.getElementById('siq-online-status');
      if(st) st.textContent = 'Loading online questions…';
    } catch(e){}
  }
  /* Prefer cached/online bank; refresh async for next time */
  try {
    if(siqState.online && typeof siqFetchOnlineBank === 'function'){
      if(!siqEnsureOnlineCached().length){
        /* synchronous path uses deep fallback inside fetch when awaited below via microtask - build uses cache */
      }
      siqFetchOnlineBank(false).then(function(){
        try{ var st2=document.getElementById('siq-online-status'); if(st2) st2.textContent='Online bank updated for next session.'; }catch(e2){}
      }).catch(function(){});
    }
  } catch(e){}
  siqState.cards = siqBuildDeck();
  siqState.idx = 0;
  siqState.score = 0;
  siqState.answered = 0;
  siqState.on = true;
  var intro = document.getElementById('siq-iq-intro');
  var stage = document.getElementById('siq-iq-stage');
  var res = document.getElementById('siq-iq-result');
  if(intro) intro.hidden = true;
  if(res){ res.hidden = true; res.innerHTML=''; }
  if(stage){ stage.hidden = false; }
  siqRenderQ();
}

function siqClearTimer(){
  if(siqState.timer){ clearInterval(siqState.timer); siqState.timer=null; }
}

function siqRenderQ(){
  siqClearTimer();
  var stage = document.getElementById('siq-iq-stage');
  if(!stage) return;
  if(siqState.idx >= siqState.cards.length){ siqFinish(); return; }
  var q = siqState.cards[siqState.idx];
  var n = siqState.idx + 1;
  var total = siqState.cards.length;
  var rawOpts = (q.opts||[]).slice();
  var answerIdx = (typeof q.a === 'number') ? q.a : 0;
  var order = rawOpts.map(function(_,i){ return i; });
  /* Fisher-Yates seeded shuffle of option order */
  var seed = (typeof fqHash==='function' ? fqHash(String(q.q||'')+'|siqopt|'+(typeof fqTodayKey==='function'?fqTodayKey():'')) : 1);
  for(var oi=order.length-1;oi>0;oi--){
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;
    var oj=seed%(oi+1); var tmp=order[oi]; order[oi]=order[oj]; order[oj]=tmp;
  }
  var mappedA = order.indexOf(answerIdx);
  if(mappedA < 0) mappedA = 0;
  q._siqA = mappedA;
  var opts = order.map(function(origI, dispI){
    return '<button type="button" class="siq-opt" onclick="siqAnswer('+dispI+')">'+(rawOpts[origI]||'')+'</button>';
  }).join('');
  stage.innerHTML =
    '<div class="siq-progress"><div class="siq-progress-bar" style="width:'+(100*siqState.idx/total)+'%"></div></div>'+
    '<div class="siq-meta">Question '+n+' / '+total+' · <span class="siq-cat">'+(q.cat||'Sharia')+'</span> · '+(q.lvl||'')+
    (siqState.timed?' · <span id="siq-clock">60s</span>':'')+'</div>'+
    '<div class="fq-qcard siq-qcard"><div class="siq-vis">'+(q.vis||'📖')+'</div><h3>'+q.q+'</h3><div class="siq-opts">'+opts+'</div></div>';
  if(siqState.timed){
    siqState.left = 60;
    siqState.timer = setInterval(function(){
      siqState.left--;
      var el = document.getElementById('siq-clock');
      if(el) el.textContent = siqState.left+'s';
      if(siqState.left <= 0){ siqAnswer(-1); }
    }, 1000);
  }
}

function siqAnswer(choice){
  if(!siqState.on) return;
  siqClearTimer();
  var q = siqState.cards[siqState.idx];
  if(!q){ siqFinish(); return; }
  siqState.answered++;
  var ok = (choice === (typeof q._siqA === "number" ? q._siqA : q.a));
  if(ok){
    /* Weighted like aptitude bands */
    var w = q.lvl==='advanced'?12 : q.lvl==='intermediate'?10 : 8;
    siqState.score += w;
    try {
      var id = siqQid(q);
      if(id){
        siqState.sessionCorrect.push(id);
        if(siqState.hideCorrect){
          var ids = siqLoadCorrectIds();
          if(ids.indexOf(id) < 0){ ids.push(id); siqSaveCorrectIds(ids); }
        }
      }
    } catch(eC){}
  }
  var stage = document.getElementById('siq-iq-stage');
  var why = q.why || '';
  var ref = q.ref || '';
  var res = q.res ? '<a href="'+q.res+'" target="_blank" rel="noopener">Source</a>' : '';
  if(stage){
    stage.innerHTML +=
      '<div class="siq-feedback '+(ok?'ok':'bad')+'">'+(ok?'✓ Correct':'✗ Not quite')+
      (why?('<p>'+why+'</p>'):'')+
      (ref?('<div class="ref">'+ref+' · '+res+'</div>'):'')+
      '<button type="button" class="btn-soft" onclick="siqNextQ()">Continue</button></div>';
    stage.querySelectorAll('.siq-opt').forEach(function(b){ b.disabled = true; });
  }
}

function siqNextQ(){
  siqState.idx++;
  siqRenderQ();
}

function siqFinish(){
  siqClearTimer();
  siqState.on = false;
  var stage = document.getElementById('siq-iq-stage');
  var res = document.getElementById('siq-iq-result');
  if(stage) stage.hidden = true;
  var max = 15 * 12; /* theoretical max if all advanced */
  var pct = Math.round(100 * siqState.score / Math.max(1, siqState.answered * 10));
  var band =
    pct >= 90 ? {t:'Ummah Scholar Path', d:'Exceptional grasp — keep teaching with humility.'} :
    pct >= 75 ? {t:'Strong Student of Knowledge', d:'Solid foundations — deepen with texts and teachers.'} :
    pct >= 55 ? {t:'Steady Believer', d:'Good path — review weak areas with authentic sources.'} :
    pct >= 35 ? {t:'Seeking Heart', d:'A beginning is blessed — study a little every day.'} :
                {t:'Return to Basics', d:'Revisit pillars, prayer, and short sūrahs with a local teacher.'};
  /* Fun scaled index (not real IQ) */
  var index = Math.min(145, Math.max(70, Math.round(70 + pct * 0.75)));
  try {
    siqPushLog({
      date: (typeof fqTodayKey==='function' ? fqTodayKey() : new Date().toISOString().slice(0,10)),
      index: index,
      pct: pct,
      score: siqState.score,
      answered: siqState.answered,
      correct: (siqState.sessionCorrect||[]).length,
      online: !!siqState.online
    });
  } catch(eLog){}
  if(res){
    res.hidden = false;
    res.innerHTML =
      '<div class="siq-result-card">'+
      '<div class="siq-index">'+index+'</div>'+
      '<div class="siq-index-label">Sharia Practice Index</div>'+
      '<h3>'+band.t+'</h3>'+
      '<p>'+band.d+'</p>'+
      '<p class="ref">Score points: '+siqState.score+' · Answered '+siqState.answered+'/15 · '+pct+'% band · logged today</p>'+
      '<p class="siq-disclaimer">Not a clinical IQ test · not a certificate of scholarship · educational self-check only</p>'+
      '<button type="button" class="btn-soft" onclick="siqStart()">Retake with new questions</button> '+
      '<button type="button" class="btn-secondary" onclick="siqShow(\'daily\')">Back to Daily Fiqh</button>'+
      '</div>';
  }
}

window.siqShow = siqShow;
window.siqStart = siqStart;
window.siqAnswer = siqAnswer;
window.siqNextQ = siqNextQ;

function fqSetLevel(level){
  level = fqNormalizeLevel(level||'beginner');
  if(!fqState) fqState=fqLoad();
  fqState.level=level; fqState.idx=0; fqState.correct=0; fqState.answered=[];
  fqState.day=fqTodayKey();
  fqState.seed=fqDaySeed()+'|'+level+'|'+(fqState.topic||'all')+'|v10';
  fqCards=fqPickDaily(fqState.seed, level);
  fqSave(fqState);
  document.querySelectorAll('.fq-lvl').forEach(function(b){
    var dl = b.getAttribute('data-lvl') || '';
    b.classList.toggle('on', fqNormalizeLevel(dl) === level);
  });
  fqRender();
}
function fqUpdateStats(){
  fqEnsure();
  var s=fqState,el;
  if((el=document.getElementById('fq-streak'))) el.textContent='🔥 Streak '+(s.streak||0);
  if((el=document.getElementById('fq-today'))) el.textContent='Today '+(s.correct||0)+'/'+fqCards.length;
  if((el=document.getElementById('fq-best'))) el.textContent='Best '+(s.best||0);
  if((el=document.getElementById('fq-total'))) el.textContent='All-time '+(s.totalCorrect||0);
  var fill=document.getElementById('fq-prog-fill');
  if(fill) fill.style.width=(fqCards.length?Math.round((s.answered.length/fqCards.length)*100):0)+'%';
  ['beginner','moderate','advanced'].forEach(function(L){var b=document.getElementById('fq-lvl-'+L);if(b)b.classList.toggle('on',L===(s.level||'beginner'));});
}

function fqShuffleOpts(card){
  if(!card || !card.opts || !card.opts.length) return card;
  if(card._shuffled) return card;
  var opts = card.opts.slice();
  var correct = opts[card.a];
  /* Fisher–Yates */
  for(var i=opts.length-1;i>0;i--){
    var j = Math.floor(Math.random()*(i+1));
    var t = opts[i]; opts[i]=opts[j]; opts[j]=t;
  }
  card.opts = opts;
  card.a = opts.indexOf(correct);
  if(card.a < 0) card.a = 0;
  card._shuffled = true;
  return card;
}

function fqRender(){
  fqEnsure();
  var stage=document.getElementById('fq-stage'); if(!stage) return;
  fqUpdateStats();
  /* Skip cards already answered correctly when hide-mode (default) */
  try{
    if(typeof fqShouldHideCorrect==='function' && fqShouldHideCorrect() && fqCards && fqCards.length){
      var pack = fqCorrectIdsToday();
      var ids = pack.ids || [];
      var n = fqCards.length;
      var tries = 0;
      while(tries < n && fqState.answered.indexOf(fqState.idx) >= 0){
        fqState.idx = (fqState.idx + 1) % n;
        tries++;
      }
      tries = 0;
      while(tries < n && ids.indexOf(fqCardId(fqCards[fqState.idx])) >= 0){
        /* mark as answered so progress still works */
        if(fqState.answered.indexOf(fqState.idx) < 0) fqState.answered.push(fqState.idx);
        fqState.idx = (fqState.idx + 1) % n;
        tries++;
      }
      /* If all hidden, show completion */
      if(tries >= n && ids.length >= n){
        /* fall through to done state via answered length */
      }
    }
  }catch(eSkip){}
  var nextBtn=document.getElementById('fq-next-btn');
  if(fqState.answered.length>=fqCards.length){
    var stars=fqState.correct>=5?'🌟🌟🌟':fqState.correct>=3?'🌟🌟':'🌟';
    stage.innerHTML='<div class="fq-done fq-qcard"><h3>'+stars+' Day complete</h3><p style="margin:.3rem 0">Level: <strong>'+(fqState.level||'beginner')+'</strong> — <strong>'+fqState.correct+' / '+fqCards.length+'</strong></p><p style="font-size:.88rem;color:var(--text-muted)">Streak: '+fqState.streak+'. Progress auto-logged for this level. Try another topic/level or return tomorrow.</p><button type="button" class="btn-soft" onclick="fqResetToday()" style="margin-top:.5rem">Practice again</button></div>';
    if(nextBtn) nextBtn.hidden=true;
    return;
  }
  var i=fqState.idx; if(i>=fqCards.length) i=fqCards.length-1;
  var card=fqCards[i]; if(!card) return;
  try{ fqShuffleOpts(card); }catch(eSh){}
  var locked=fqState.answered.indexOf(i)>=0;
  var vis=card.vis?('<span class="fq-vis">'+card.vis+'</span> '):'';
  var h='<div class="fq-qcard"><div class="fq-cat">'+vis+(card.cat||'')+' · '+(fqState.level||'')+' · Card '+(i+1)+' of '+fqCards.length+'</div><p class="fq-question">'+card.q+'</p><div class="fq-options">';
  for(var o=0;o<card.opts.length;o++) h+='<button type="button" class="fq-opt" data-oi="'+o+'" onclick="fqAnswer('+i+','+o+')"'+(locked?' disabled':'')+'>'+card.opts[o]+'</button>';
  h+='</div><div class="fq-explain" id="fq-explain"></div></div>';
  stage.innerHTML=h;
  if(nextBtn) nextBtn.hidden=!locked||fqState.answered.length>=fqCards.length;
}
function fqAnswer(qi,oi){
  fqEnsure();
  if(fqState.answered.indexOf(qi)>=0) return;
  var card=fqCards[qi]; if(!card) return;
  document.querySelectorAll('.fq-opt').forEach(function(btn){
    btn.disabled=true;
    var idx=parseInt(btn.getAttribute('data-oi'),10);
    if(idx===card.a) btn.classList.add('correct');
    if(idx===oi&&oi!==card.a) btn.classList.add('wrong');
  });
  var ok=oi===card.a;
  if(ok){fqState.correct++;fqState.totalCorrect=(fqState.totalCorrect||0)+1;
    try{
      localStorage.setItem('clarity_td_quiz_win', JSON.stringify({
        q:card.q, ans:(card.opts&&card.opts[card.a])||'', why:card.why||'', ref:card.ref||'', lvl:card.lvl||fqState.level||'', t:Date.now()
      }));
    }catch(eWin){}
  }
  fqState.answered.push(qi);
  var exp=document.getElementById('fq-explain');
  if(exp){
    var res=card.res?('<div class="fq-res"><a href="'+card.res+'" target="_blank" rel="noopener">📚 Open source →</a></div>'):'';
    exp.innerHTML=(ok?'<strong>Correct.</strong> ':'<strong>Not quite.</strong> ')+card.why+'<div class="fq-ref">'+card.ref+'</div>'+res;
    exp.classList.add('show');
  }
  if(fqState.answered.length>=fqCards.length){
    if(fqState.correct>(fqState.best||0)) fqState.best=fqState.correct;
    if(fqState.correct>=3){if(fqState.lastCompleteDay!==fqTodayKey()){fqState.streak=(fqState.streak||0)+1;fqState.lastCompleteDay=fqTodayKey();}}
    else fqState.lastCompleteDay=fqTodayKey();
    try{ if(typeof fqLogDailyProgress==='function') fqLogDailyProgress(); }catch(eLog){}
  }
  fqSave(fqState); fqUpdateStats();
  var nextBtn=document.getElementById('fq-next-btn');
  if(nextBtn) nextBtn.hidden=false;
  if(fqState.answered.length>=fqCards.length) setTimeout(fqRender,900);
}
function fqNext(){
  fqEnsure();
  var next=fqState.idx+1;
  while(next<fqCards.length&&fqState.answered.indexOf(next)>=0) next++;
  if(next>=fqCards.length){fqRender();return;}
  fqState.idx=next; fqSave(fqState); fqRender();
}
function fqResetToday(){
  fqEnsure();
  fqState.idx=0;fqState.correct=0;fqState.answered=[];
  fqState.seed=fqDaySeed()+'|retry|'+Date.now();
  fqCards=fqPickDaily(fqState.seed, fqState.level||'beginner');
  fqSave(fqState); fqRender();
}
function fqShareScore(){
  fqEnsure();
  var msg='Clarity Fiqh Quiz ('+(fqState.level||'beginner')+') — '+fqTodayKey()+': '+fqState.correct+'/'+fqCards.length+' · streak '+(fqState.streak||0)+' · clarity-dawah.fyi';
  if(navigator.share) navigator.share({text:msg}).catch(function(){});
  else if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(msg).then(function(){alert('Score copied.');});
  else alert(msg);
}

/* ===== Quiz: default-hide correct cards · topic filter · per-level log ===== */
var FQ_LOG_KEY = 'clarity_fq_daily_log_v2';
var FQ_SHOW_KEY = 'clarity_fq_show_correct_v1';
var FQ_CORRECT_IDS_KEY = 'clarity_fq_correct_ids_v1';
var FQ_TOPIC_KEY = 'clarity_fq_topic_v1';

function fqLoadLog(){
  try{ return JSON.parse(localStorage.getItem(FQ_LOG_KEY) || '[]'); }catch(e){ return []; }
}
function fqSaveLog(arr){
  try{ localStorage.setItem(FQ_LOG_KEY, JSON.stringify(arr.slice(-120))); }catch(e){}
}
function fqCorrectIdsToday(){
  var today = (typeof fqTodayKey==='function') ? fqTodayKey() : new Date().toISOString().slice(0,10);
  try{
    var raw = JSON.parse(localStorage.getItem(FQ_CORRECT_IDS_KEY) || '{}');
    if(raw.d !== today){ raw = {d: today, ids: []}; }
    return raw;
  }catch(e){ return {d: today, ids: []}; }
}
function fqRememberCorrect(q){
  if(!q) return;
  var pack = fqCorrectIdsToday();
  var id = fqCardId(q);
  if(pack.ids.indexOf(id) < 0){
    pack.ids.push(id);
    if(pack.ids.length > 200) pack.ids = pack.ids.slice(-200);
    try{ localStorage.setItem(FQ_CORRECT_IDS_KEY, JSON.stringify(pack)); }catch(e){}
  }
}
function fqShouldHideCorrect(){
  /* Default: HIDE. Only show when user checks the box */
  try{ return localStorage.getItem(FQ_SHOW_KEY) !== '1'; }catch(e){ return true; }
}
function fqToggleShowCorrect(on){
  try{ localStorage.setItem(FQ_SHOW_KEY, on ? '1' : '0'); }catch(e){}
  try{
    /* Rebuild deck excluding (or including) correct ids */
    fqEnsure(true);
    fqRender();
  }catch(e){}
}
function fqSetTopic(topic){
  topic = topic || 'all';
  if(!fqState) fqState = fqLoad();
  fqState.topic = topic;
  try{ localStorage.setItem(FQ_TOPIC_KEY, topic); }catch(e){}
  document.querySelectorAll('.fq-topic').forEach(function(b){
    b.classList.toggle('on', b.getAttribute('data-topic') === topic);
  });
  fqState.idx = 0; fqState.correct = 0; fqState.answered = [];
  fqState.seed = fqDaySeed() + '|' + (fqState.level||'beginner') + '|' + topic + '|v10|' + Date.now();
  fqCards = fqPickDaily(fqState.seed, fqState.level||'beginner', null);
  try{ fqSave(fqState); }catch(e){}
  fqRender();
}
function fqLogDailyProgress(){
  fqEnsure();
  var lvl = fqNormalizeLevel(fqState.level || 'beginner');
  var entry = {
    d: fqTodayKey(),
    level: lvl,
    topic: (fqState.topic || 'all'),
    correct: fqState.correct || 0,
    total: (fqCards && fqCards.length) || 0,
    answered: (fqState.answered && fqState.answered.length) || 0,
    streak: fqState.streak || 0,
    t: Date.now()
  };
  /* One entry per day+level (replace same day+level) */
  var log = fqLoadLog().filter(function(x){
    return !(x.d === entry.d && fqNormalizeLevel(x.level) === entry.level);
  });
  log.push(entry);
  fqSaveLog(log);
  var status = document.getElementById('fq-daily-log-panel');
  if(status){
    status.hidden = false;
    status.innerHTML = '<strong>Logged</strong> · '+entry.d+' · <em>'+entry.level+'</em> · '+entry.correct+'/'+entry.total+
      ' · topic '+entry.topic+' · streak '+entry.streak+
      ' <button type="button" class="btn-soft" style="margin-left:.4rem;padding:.2rem .5rem;font-size:.78rem" onclick="fqShowDailyLog()">Open full log</button>';
  }
}
function fqShowDailyLog(){
  var panel = document.getElementById('fq-daily-log-panel');
  if(!panel) return;
  var log = fqLoadLog().slice().reverse();
  if(!log.length){
    panel.hidden = false;
    panel.innerHTML = '<em>No log entries yet. Finish cards and tap “Log this level”.</em>';
    return;
  }
  /* Group visual by level */
  var byLvl = {beginner:[], intermediate:[], advanced:[]};
  log.forEach(function(e){
    var L = fqNormalizeLevel(e.level);
    if(!byLvl[L]) byLvl[L] = [];
    byLvl[L].push(e);
  });
  var html = '<div style="font-weight:600;margin-bottom:.4rem">Per-level daily log (this device only)</div>';
  ['beginner','intermediate','advanced'].forEach(function(L){
    var rows = byLvl[L] || [];
    if(!rows.length) return;
    html += '<div style="margin:.35rem 0 .15rem;font-weight:600;color:var(--accent)">'+L+'</div>';
    rows.slice(0,12).forEach(function(e){
      html += '<div style="padding:.15rem 0;border-bottom:1px solid var(--border);font-size:.82rem">'+e.d+
        ' · <strong>'+e.correct+'/'+e.total+'</strong>'+
        (e.topic && e.topic!=='all' ? ' · '+e.topic : '')+
        ' · streak '+(e.streak||0)+'</div>';
    });
  });
  html += '<button type="button" class="btn-secondary" style="margin-top:.45rem;font-size:.8rem" onclick="if(confirm(\'Clear entire quiz log?\')){localStorage.removeItem(\''+FQ_LOG_KEY+'\');fqShowDailyLog();}">Clear log</button>';
  panel.hidden = false;
  panel.innerHTML = html;
}

/* Patch fqPickDaily usage: exclude correctly-answered when hide is default */
(function(){
  var _origPick = window.fqPickDaily || fqPickDaily;
  window.fqPickDaily = fqPickDaily = function(seedStr, level, excludeIds){
    excludeIds = excludeIds || [];
    if(fqShouldHideCorrect()){
      try{
        var pack = fqCorrectIdsToday();
        (pack.ids || []).forEach(function(id){
          if(excludeIds.indexOf(id) < 0) excludeIds.push(id);
        });
      }catch(e){}
    }
    var bank = fqBankForLevel(level).slice();
    var filtered = bank.filter(function(q){ return excludeIds.indexOf(fqCardId(q)) < 0; });
    if(filtered.length < 4) filtered = bank.slice();
    var seed = fqHash((seedStr||fqDaySeed())+'|'+(level||'')+'|v10|'+String(filtered.length)+'|'+(fqState&&fqState.topic||'all'));
    var idxs = []; for(var i=0;i<filtered.length;i++) idxs.push(i);
    for(var i=idxs.length-1;i>0;i--){
      seed = (Math.imul(seed,1664525)+1013904223)>>>0;
      var j = seed % (i+1);
      var t = idxs[i]; idxs[i]=idxs[j]; idxs[j]=t;
    }
    return idxs.slice(0, Math.min(10, filtered.length)).map(function(i){ return filtered[i]; });
  };
})();

/* Remember correct answers on success */
(function(){
  var _ans = window.fqAnswer;
  if(typeof _ans !== 'function') return;
  window.fqAnswer = function(qi, oi){
    try{
      if(typeof fqCards !== 'undefined' && fqCards && fqCards[qi] && oi === fqCards[qi].a){
        fqRememberCorrect(fqCards[qi]);
      }
    }catch(e){}
    var r = _ans.apply(this, arguments);
    /* If hiding, after a correct answer advance past it next time */
    try{
      if(fqShouldHideCorrect() && typeof fqState === 'object' && fqState){
        /* leave answered list as-is; pick/render will skip those ids next deck refresh */
      }
    }catch(e2){}
    return r;
  };
})();

/* On load: show-correct checkbox reflects storage (default unchecked = hide) */
function fqBootShowCorrectUI(){
  try{
    var on = localStorage.getItem(FQ_SHOW_KEY) === '1';
    var cb = document.getElementById('fq-show-correct');
    if(cb) cb.checked = on;
    var topic = localStorage.getItem(FQ_TOPIC_KEY) || 'all';
    if(fqState) fqState.topic = topic;
    document.querySelectorAll('.fq-topic').forEach(function(b){
      b.classList.toggle('on', b.getAttribute('data-topic') === topic);
    });
  }catch(e){}
}
try{
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', fqBootShowCorrectUI);
  else setTimeout(fqBootShowCorrectUI, 300);
}catch(e){}

window.fqLogDailyProgress = fqLogDailyProgress;
window.fqShowDailyLog = fqShowDailyLog;
window.fqToggleShowCorrect = fqToggleShowCorrect;
window.fqSetTopic = fqSetTopic;
window.fqShouldHideCorrect = fqShouldHideCorrect;
window.fqNormalizeLevel = fqNormalizeLevel;

/* ===== Online deck fetch (Qur’an + Hadith APIs) with local fallback ===== */
var FQ_ONLINE_CACHE_KEY = 'clarity_fq_online_cache_v1';
var fqPreferOnline = false;

async function fqFetchAyahQuestion(ref, level){
  try{
    var v = await fetch('https://api.quran.com/api/v4/verses/by_key/' + encodeURIComponent(ref) + '?language=en&translations=20&fields=text_uthmani');
    if(!v.ok) throw new Error('ayah');
    var j = await v.json();
    var verse = j.verse || {};
    var ar = verse.text_uthmani || '';
    var tr = (verse.translations && verse.translations[0] && verse.translations[0].text) || '';
    tr = String(tr).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
    if(!tr || tr.length < 20) throw new Error('short');
    var snippet = tr.length > 140 ? tr.slice(0,137)+'…' : tr;
    return {
      lvl: level || 'intermediate',
      cat: 'Tafseer',
      vis: '📖',
      q: 'What is the main message reflected in Qur’an '+ref+'?',
      opts: [
        snippet,
        'A ruling that cancels the five prayers',
        'A command to abandon worldly work entirely',
        'A genealogy list with no guidance'
      ],
      a: 0,
      why: 'Meaning (Sahih International): '+snippet,
      ref: 'Qur’an '+ref,
      res: 'https://quran.com/'+ref.replace(':','/'),
      online: true,
      ar: ar
    };
  }catch(e){ return null; }
}

async function fqFetchHadithQuestion(level){
  var picks = [
    {api:'eng-bukhari/1', ref:'Bukhārī 1', cat:'Hadith'},
    {api:'eng-bukhari/8', ref:'Bukhārī 8', cat:'Hadith'},
    {api:'eng-muslim/1', ref:'Muslim 1', cat:'Hadith'},
    {api:'eng-bukhari:6018', ref:'Bukhārī 6018', cat:'Daily'},
    {api:'eng-bukhari/13', ref:'Bukhārī 13', cat:'Daily'}
  ];
  var p = picks[Math.floor(Math.random()*picks.length)];
  try{
    var url = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/' + p.api.replace(':','/') + '.min.json';
    // normalize path
    url = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/' + String(p.api).replace(':','/') + '.min.json';
    if(p.api.indexOf(':')>=0){
      url = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-bukhari/' + p.api.split(':')[1] + '.min.json';
    }
    var res = await fetch(url);
    if(!res.ok) throw new Error('hadith');
    var j = await res.json();
    var txt = (j.hadith && j.hadith.text) || j.text || '';
    txt = String(txt).replace(/\s+/g,' ').trim();
    if(txt.length < 30) throw new Error('short');
    var snip = txt.length > 120 ? txt.slice(0,117)+'…' : txt;
    return {
      lvl: level || 'beginner',
      cat: p.cat,
      vis: '🕊',
      q: 'According to '+p.ref+', which statement is closest to the narration?',
      opts: [snip, 'Prayer is optional for travellers only', 'Smiling is forbidden in the mosque', 'Zakāh is only for Makkah residents'],
      a: 0,
      why: 'Narration gist: '+snip,
      ref: p.ref,
      res: 'https://sunnah.com/',
      online: true
    };
  }catch(e){ return null; }
}

async function fqFetchOnlineDeck(){
  var status = document.getElementById('fq-online-status');
  if(status) status.textContent = 'Fetching from Qur’an & Hadith APIs…';
  fqPreferOnline = true;
  var level = (fqState && fqState.level) || 'beginner';
  var ayahs = {
    beginner: ['1:1','1:6','2:255','112:1','103:1','94:5','2:152','17:23'],
    intermediate: ['18:10','49:12','3:159','9:40','48:1','24:30','2:286','33:56'],
    advanced: ['18:66','24:35','17:36','8:17','3:104','4:65','59:18','67:2']
  };
  var L = (typeof fqNormalizeLevel==='function') ? fqNormalizeLevel(level) : level;
  var refs = ayahs[L] || ayahs.beginner;
  // shuffle refs
  refs = refs.slice().sort(function(){ return Math.random()-0.5; }).slice(0,6);
  var cards = [];
  for(var i=0;i<refs.length;i++){
    var q = await fqFetchAyahQuestion(refs[i], L);
    if(q) cards.push(q);
  }
  var h1 = await fqFetchHadithQuestion(L);
  if(h1) cards.push(h1);
  var h2 = await fqFetchHadithQuestion(L);
  if(h2) cards.push(h2);

  if(cards.length < 4){
    if(status) status.textContent = 'Online limited — merged with stored bank';
    var local = fqBankForLevel(L).slice();
    while(cards.length < 8 && local.length){
      cards.push(local.shift());
    }
  } else {
    if(status) status.textContent = 'Online deck ready · '+cards.length+' cards · stored fallback on';
  }
  try{ localStorage.setItem(FQ_ONLINE_CACHE_KEY, JSON.stringify({t:Date.now(), level:L, cards:cards})); }catch(e){}
  fqEnsure();
  fqState.idx=0; fqState.correct=0; fqState.answered=[];
  fqState.seed = fqDaySeed()+'|online|'+L+'|'+Date.now();
  fqCards = cards.slice(0,10); try{ fqCards.forEach(function(c){ if(typeof fqShuffleOpts==='function') fqShuffleOpts(c); }); }catch(e){}
  try{ fqSave(fqState); }catch(e){}
  fqRender();
}

function fqUseStoredOnly(){
  fqPreferOnline = false;
  var status = document.getElementById('fq-online-status');
  if(status) status.textContent = 'Using on-device bank only';
  fqEnsure(true);
  fqRender();
}

/* Surprise Me — richer random for meme */
async function claritySurpriseMe(){
  var status = document.getElementById('meme-fetch-status');
  if(status) status.textContent = 'Surprising you…';
  try{
    var refs = ['2:255','94:5','1:6','18:10','49:10','3:159','33:56','103:1','112:1','25:74'];
    var ref = refs[Math.floor(Math.random()*refs.length)];
    var v = await fetch('https://api.quran.com/api/v4/verses/by_key/' + encodeURIComponent(ref) + '?language=en&translations=20&fields=text_uthmani');
    var j = await v.json();
    var verse = j.verse || {};
    var ar = verse.text_uthmani || '';
    var en = ((verse.translations&&verse.translations[0]&&verse.translations[0].text)||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
    var top = document.getElementById('meme-top-input');
    var mid = document.getElementById('meme-mid-input');
    var bot = document.getElementById('meme-bottom-input');
    if(top) top.value = ar || '';
    if(mid) mid.value = en ? (en.length>160?en.slice(0,157)+'…':en) : '';
    if(bot) bot.value = 'Qur’an '+ref;
    try{
      if(typeof memeState==='object'){
        memeState.top = top ? top.value : '';
        memeState.mid = mid ? mid.value : '';
        memeState.bottom = bot ? bot.value : '';
      }
      if(typeof memeDraw==='function') memeDraw();
      if(typeof memeFetchBg==='function') memeFetchBg(['holy','spirit','nature','night'][Math.floor(Math.random()*4)]);
    }catch(e2){}
    if(status) status.textContent = 'Surprise · Qur’an '+ref;
  }catch(e){
    if(status) status.textContent = 'Surprise offline — try a scene chip';
    try{ if(typeof memeFetchBg==='function') memeFetchBg('holy'); }catch(e3){}
  }
}
window.fqFetchOnlineDeck = fqFetchOnlineDeck;
window.fqUseStoredOnly = fqUseStoredOnly;
window.claritySurpriseMe = claritySurpriseMe;
window.fqFetchAyahQuestion = fqFetchAyahQuestion;

/* Wire Surprise me buttons if present */
try{
  document.querySelectorAll('button').forEach(function(b){
    var t = (b.textContent||'').trim();
    if(/surprise me/i.test(t) && !b.getAttribute('data-surprise-wired')){
      b.setAttribute('data-surprise-wired','1');
      b.addEventListener('click', function(ev){
        try{ claritySurpriseMe(); }catch(e){}
      });
    }
  });
}catch(e){}

/* Deep-learn online refresh for live sections */
async function clarityRefreshSection(kind){
  try{
    if(kind==='tafseer' && typeof clarityLiveTafseer==='function') await clarityLiveTafseer(true);
    else if(kind==='seerah' && typeof clarityLiveSeerah==='function') await clarityLiveSeerah(true);
    else if(kind==='tajweed' && typeof clarityLiveTajweed==='function') await clarityLiveTajweed(true);
    else if(kind==='sami' && typeof clarityLiveSamina==='function') await clarityLiveSamina(true);
    else if(kind==='verse' && typeof loadVerse==='function') loadVerse();
    else if(kind==='commands' && typeof loadCommand==='function') loadCommand();
    else if(kind==='grave' && typeof loadZikr==='function') loadZikr();
  }catch(e){ console.warn('refresh', kind, e); }
}
window.clarityRefreshSection = clarityRefreshSection;

/* Ensure icons on section titles */
function clarityEnsureTitleIcons(){
  var map = [
    [/my journey|journey/i, '🧭'],
    [/command/i, '📜'],
    [/tafseer|tafsīr|tafsir/i, '📖'],
    [/seerah|sīrah|sami/i, '🕊'],
    [/tajweed|calligraphy/i, '🔤'],
    [/grave|zikr|istighfar/i, '🌙'],
    [/quiz|fiqh|sharia iq/i, '🧠'],
    [/meme/i, '🎨'],
    [/guidance|search/i, '🔍'],
    [/lecture/i, '🎧'],
    [/note|tool|wasiyyah|family tree|farā/i, '🛠️'],
    [/hajj/i, '🕋'],
    [/deepen your study/i, '📚'],
    [/weekly|this week/i, '📊'],
    [/ask grok/i, '✨'],
    [/section palette/i, '🎨']
  ];
  document.querySelectorAll('h2').forEach(function(h){
    if(h.getAttribute('data-iconized')) return;
    var txt = (h.textContent||'').trim();
    if(!txt) return;
    if(/^[\u{1F300}-\u{1FAFF}🧭📜📖🕊🔤🌙🧠🎨🔍🎧📝🕋𝕏📚🛠️✨📊]/u.test(txt)){
      h.setAttribute('data-iconized','1'); return;
    }
    for(var i=0;i<map.length;i++){
      if(map[i][0].test(txt)){
        h.insertAdjacentText('afterbegin', map[i][1]+' ');
        break;
      }
    }
    h.setAttribute('data-iconized','1');
  });
}
try{
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', function(){ setTimeout(clarityEnsureTitleIcons, 200); });
  else setTimeout(clarityEnsureTitleIcons, 400);
}catch(e){}
window.clarityEnsureTitleIcons = clarityEnsureTitleIcons;

window.fqShuffleOpts=fqShuffleOpts;
window.fqAnswer=fqAnswer;window.fqNext=fqNext;window.fqResetToday=fqResetToday;window.fqShareScore=fqShareScore;window.fqRender=fqRender;
function fqForceUpgrade(){ return fqForceNewDeck(); }
window.fqForceUpgrade=fqForceUpgrade;
window.fqSetLevel=fqSetLevel;
try{if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){try{fqRender();}catch(e){}});else setTimeout(function(){try{fqRender();}catch(e){}},200);}catch(e){}

/* ===== Section Palette Manager ===== */
var PM_KEY='clarity_section_palette_v1';
var PM_PRESETS={
  day:{bg:'#f6f1e7',text:'#1c2a22',card:'#fffdf8',accent:'#0d4f3c',hajj:'#f7f4ec',quiz:'#ffffff',gold:'#b8922a',sky:'#2a5f7a'},
  night:{bg:'#0c1410',text:'#e8efe9',card:'#152019',accent:'#3d9b78',hajj:'#15241c',quiz:'#1a2420',gold:'#d4b24a',sky:'#6a9aba'},
  soft:{bg:'#f4f0ea',text:'#2a322c',card:'#faf8f4',accent:'#2a6b52',hajj:'#f3f0e8',quiz:'#fafafa',gold:'#c4a04a',sky:'#4a7a90'},
  high:{bg:'#ffffff',text:'#000000',card:'#ffffff',accent:'#004d33',hajj:'#ffffff',quiz:'#ffffff',gold:'#8a6a00',sky:'#003366'},
  oasis:{bg:'#eef6f1',text:'#0b3d2e',card:'#f7fbf8',accent:'#0b5c45',hajj:'#e8f5ee',quiz:'#ffffff',gold:'#b8922a',sky:'#2a5f7a'}
};
function pmEls(){
  return {
    bg:document.getElementById('pm-bg'),
    text:document.getElementById('pm-text'),
    card:document.getElementById('pm-card'),
    accent:document.getElementById('pm-accent'),
    hajj:document.getElementById('pm-hajj'),
    quiz:document.getElementById('pm-quiz'),
    gold:document.getElementById('pm-gold'),
    sky:document.getElementById('pm-sky')
  };
}
function pmRead(){
  var e=pmEls(),o={};
  Object.keys(e).forEach(function(k){if(e[k])o[k]=e[k].value;});
  return o;
}
function pmWrite(o){
  var e=pmEls();
  Object.keys(o||{}).forEach(function(k){if(e[k]&&o[k])e[k].value=o[k];});
}
function pmApply(o){
  if(!o)return;
  var r=document.documentElement;
  if(o.bg)r.style.setProperty('--bg',o.bg);
  if(o.text)r.style.setProperty('--text',o.text);
  if(o.card)r.style.setProperty('--card-bg',o.card);
  if(o.card)r.style.setProperty('--bg-elevated',o.card);
  if(o.accent){r.style.setProperty('--accent',o.accent);r.style.setProperty('--banner',o.accent);}
  if(o.gold)r.style.setProperty('--gold',o.gold);
  if(o.sky)r.style.setProperty('--sky',o.sky);
  /* Section surfaces */
  var st=document.getElementById('pm-live-style');
  if(!st){st=document.createElement('style');st.id='pm-live-style';document.head.appendChild(st);}
  st.textContent=[
    '#hajj-guide-card.hajj-guide-card,#tab-search #hajj-guide-card{background:'+(o.hajj||'#f7f4ec')+' !important;color:'+(o.text||'#1a2420')+' !important}',
    '#hajj-guide-card h2{color:'+(o.accent||'#0b3d2e')+' !important;opacity:1 !important}',
    'html[data-theme="dark"] #hajj-guide-card h2{color:'+(o.gold||'#f0d78c')+' !important}',
    '#fiqh-quiz-card .fq-opt{background:'+(o.quiz||'#fff')+' !important;color:'+(o.text||'#1a2420')+' !important;border-color:#c5bba8 !important;opacity:1 !important}',
    '#fiqh-quiz-card .fq-question{color:'+(o.text||'#1a2420')+' !important}',
    '#fiqh-quiz-card h2{color:'+(o.accent||'#0b3d2e')+' !important}',
    '.card{background:'+(o.card||'#fffdf8')+' !important;color:'+(o.text||'#1c2a22')+' !important}',
    'body{background-color:'+(o.bg||'#f6f1e7')+' !important}'
  ].join('\n');
}
function pmLive(){pmApply(pmRead());var s=document.getElementById('pm-status');if(s)s.textContent='Live preview · tap Save to keep';}
function pmApplyPreset(name){
  var o=PM_PRESETS[name]||PM_PRESETS.day;
  pmWrite(o);pmApply(o);
  document.querySelectorAll('.pm-preset').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-pm')===name);});
  if(name==='night'){try{document.documentElement.setAttribute('data-theme','dark');}catch(e){}}
  else if(name==='day'||name==='oasis'||name==='high'||name==='soft'){try{document.documentElement.setAttribute('data-theme','light');}catch(e){}}
  var s=document.getElementById('pm-status');if(s)s.textContent='Preset: '+name;
  try{clarityLS.setItem(PM_KEY,JSON.stringify({preset:name,colors:o}));}catch(e){}
}
function pmSave(){
  var o=pmRead();
  pmApply(o);
  try{clarityLS.setItem(PM_KEY,JSON.stringify({preset:'custom',colors:o}));}catch(e){}
  var s=document.getElementById('pm-status');if(s)s.textContent='Saved on this device';
}
function pmExport(){
  var o=pmRead();
  var css=':root{--bg:'+o.bg+';--text:'+o.text+';--card-bg:'+o.card+';--accent:'+o.accent+';--gold:'+o.gold+';--sky:'+o.sky+'}';
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(css).then(function(){alert('Palette CSS copied');});
  else alert(css);
}
function pmBoot(){
  try{
    var raw=clarityLS.getItem(PM_KEY);
    if(!raw)return;
    var data=JSON.parse(raw);
    if(data&&data.colors){pmWrite(data.colors);pmApply(data.colors);}
    if(data&&data.preset){
      document.querySelectorAll('.pm-preset').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-pm')===data.preset);});
    }
  }catch(e){}
}
window.pmApplyPreset=pmApplyPreset;window.pmLive=pmLive;window.pmSave=pmSave;window.pmExport=pmExport;
try{
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',pmBoot);
  else setTimeout(pmBoot,200);
}catch(e){}

/* Extend clarityAuditDOM */
(function(){
  var prev = window.clarityAuditDOM;
  window.clarityAuditDOM = function(){
    var report = [];
    try{ if(typeof prev==='function'){ var r=prev(); if(Array.isArray(r)) report=report.concat(r); } }catch(e){ report.push('prev audit error'); }
    if(typeof claritySpeakArabic!=='function') report.push('claritySpeakArabic missing');
    if(typeof clarityEnhanceArabicAudio!=='function') report.push('clarityEnhanceArabicAudio missing');
    if(typeof playAyahAudio!=='function' && typeof clarityStreamAyah!=='function') report.push('Alafasy stream helper missing');
    if(typeof calligEnhanceStroke!=='function') report.push('calligEnhanceStroke missing');
    if(typeof calligAutoEnhanceAll!=='function') report.push('calligAutoEnhanceAll missing');
    if(typeof calligTranslateToArabic!=='function') report.push('calligTranslateToArabic missing');
    if(typeof calligToggleVoiceCapture!=='function') report.push('callig voice capture missing');
    if(!document.getElementById('callig-canvas')) report.push('callig canvas missing');
    if(!document.getElementById('callig-english-input')) report.push('callig english input missing');
    if(!document.getElementById('callig-translate-btn')) report.push('callig translate btn missing');
    if(!document.getElementById('callig-mic-btn')) report.push('callig mic btn missing');
    if(!document.getElementById('callig-mic-stop')) report.push('callig mic stop missing');
    /* speak mute intentionally removed site-wide */
    try{ if(typeof playAyahAudio!=='function') report.push('playAyahAudio missing'); }catch(e){}
    try{ if(typeof clarityPlayRecitation!=='function') report.push('clarityPlayRecitation missing'); }catch(e){}
    try{ if(typeof memeFromJourney!=='function') report.push('memeFromJourney missing'); }catch(e){}

    var arBtns=document.querySelectorAll('.clarity-ar-btn').length;
    if(document.querySelector('.arabic, .rabbana-arabic, .arabic-calligraphy') && arBtns===0){
      report.push('arabic present but no listen chips yet (run enhance)');
    }
    var verseBtn=document.getElementById('verse-audio-btn');
    if(!verseBtn) report.push('journey verse-audio-btn missing');
    if(!document.getElementById('verse-audio') && !document.getElementById('quran-audio')) report.push('audio element missing');
    if(!document.getElementById('voice-translator-card')) report.push('voice translator card missing');
    if(!document.getElementById('fiqh-quiz-card')) report.push('fiqh quiz card missing');
    if(typeof vtEnsureWhisper!=='function') report.push('vt whisper missing');
    if(typeof vtToggleRecord!=='function') report.push('vt record missing');
    if(typeof clarityGoogleTranslate!=='function' && typeof calligGoogleTranslate!=='function') report.push('Google translate helper missing');

    var bodyText=(document.body&&document.body.innerText)||'';
    if(/id="tab-[a-z]+"\s*class="tab-panel"/.test(bodyText)) report.push('RAW HTML LEAK still present');
    if(report.length){ console.warn('[Clarity audit]', report); return report; }
    console.info('[Clarity audit] OK — speak engine + DOM solid');
    return [];
  };
})();

function tdClip(s,n){s=String(s||'').replace(/\s+/g,' ').trim();if(!n||s.length<=n)return s;return s.slice(0,n-1).trim()+'…';}
function tdSite(){try{if(location.protocol.indexOf('http')===0&&location.host)return location.origin+'/';}catch(e){}return 'https://clarity-dawah.fyi/';}
function tdTextOf(sel){
  var el=typeof sel==='string'?document.querySelector(sel):sel;
  if(!el) return '';
  return String(el.innerText||el.value||'').replace(/Loading[….]/g,'').trim();
}

/* ===== Clarity Tweet Desk (single module) ===== */
function tdTabLink(hash){
  var base = 'https://clarity-dawah.fyi/';
  try {
    if (location.protocol.indexOf('http') === 0 && location.host) base = location.origin + '/';
  } catch (e) {}
  base = String(base).replace(/\/?$/, '/');
  return base + '#' + String(hash || 'about').replace(/^#/, '');
}
function tdStatus(msg){
  var s = document.getElementById('td-status');
  if (s) s.textContent = msg;
}
function tdClean(s){
  return String(s || '').replace(/🔊/g, '').replace(/Loading[….].*/gi, '').replace(/\s+/g, ' ').trim();
}
function tdCap(s, n){
  s = String(s || '').trim();
  n = n || 280;
  if (s.length <= n) return s;
  return s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…';
}
function tdBeautify(ar, en, ref){
  ar = tdClean(ar);
  en = tdClean(en);
  ref = tdClean(ref || '');
  var lines = [];
  if (ar) lines.push(ar);
  if (en) lines.push(en);
  if (ref) lines.push(ref);
  return lines.join('\n');
}
function tdHash(kind){
  return ({
    verse: 'journey', commands: 'commands', grave: 'grave',
    tafseer: 'tafseer', seerah: 'seerah', tajweed: 'tajweed',
    quiz: 'about', meme: 'about', sami: 'seerah', surprise: 'seerah'
  })[kind] || 'about';
}
function tdFinish(kind, body){
  var core = tdCap(String(body || '').trim(), 280);
  var ta = document.getElementById('td-text');
  if (ta) ta.value = core;
  tdCount();
  try {
    var first = core.split('\n')[0] || '';
    if (first && /[\u0600-\u06FF]/.test(first) && typeof calligSetGuideText === 'function') calligSetGuideText(first);
  } catch (e) {}
  tdStatus('Ready · ' + kind + ' · ' + tdHash(kind));
}

function tdVerse(){
  var v = (typeof currentJourneyVerse === 'object' && currentJourneyVerse) ? currentJourneyVerse : {};
  var ar = v.arabic || '';
  var en = v.en || v.english || '';
  if (!en) {
    var el = document.querySelector('#verse .verse-primary:not(.verse-urdu), #verse .verse-en, #verse .sr-en, #verse .verse-secondary:not(.verse-urdu)');
    if (el) en = tdClean(el.innerText);
  }
  if (!ar) {
    var ael = document.querySelector('#verse .arabic, #verse .arabic-calligraphy, #verse [lang="ar"], #verse .sr-ar');
    if (ael) ar = tdClean(ael.innerText);
  }
  var ref = '';
  try { ref = (v && (v.ref || (v.key ? ('Qur’an ' + v.key) : ''))) || ''; } catch (eR) {}
  if (ref && ref.indexOf('Qur') < 0 && /\d+:\d+/.test(ref)) ref = 'Qur’an ' + ref;
  return tdBeautify(ar, en, ref);
}
function tdCommands(){
  var v = (typeof currentCommandVerse === 'object' && currentCommandVerse) ? currentCommandVerse : {};
  var ar = v.arabic || '';
  var en = v.english || v.en || '';
  if (!en) {
    var el = document.getElementById('cmd-en-text') || document.querySelector('#command-box .verse-en, #command-box .verse-primary:not(.verse-urdu)');
    if (el) en = tdClean(el.innerText);
  }
  if (!ar) {
    var ael = document.querySelector('#command-box .arabic-calligraphy, #command-box .arabic, #command-box [lang="ar"]');
    if (ael) ar = tdClean(ael.innerText);
  }
  var ref = (v && v.ref) || '';
  return tdBeautify(ar, en, ref);
}
function tdGrave(){
  var ar = '', en = '';
  var box = document.getElementById('zikr');
  if (box) {
    var ael = box.querySelector('.arabic, .arabic-calligraphy, [lang="ar"]');
    var eel = box.querySelector('.verse-en, .sr-en, p:not([dir="rtl"])');
    if (ael) ar = tdClean(ael.innerText);
    if (eel) en = tdClean(eel.innerText);
    if (!ar && !en) {
      var lines = tdClean(box.innerText).split('. ');
      en = lines[0] || '';
    }
  }
  return tdBeautify(ar, en);
}
function tdTafseer(){
  var a = window._clarityLiveTafseer || {};
  var ar = a.ar || tdClean((document.getElementById('tafseer-live-ar') || {}).textContent);
  var en = a.en || tdClean((document.getElementById('tafseer-live-en') || {}).textContent);
  return tdBeautify(ar, en, a.ref ? ('Qur’an ' + a.ref) : '');
}
function tdSeerah(){
  var a = window._clarityLiveSeerah || {};
  var ar = a.ar || tdClean((document.getElementById('seerah-live-ar') || {}).textContent);
  var en = a.en || tdClean((document.getElementById('seerah-live-en') || {}).textContent);
  var extra = a.note || '';
  if (a.tf) extra = (extra ? extra + ' ' : '') + a.tf;
  if (extra && en.indexOf(extra.slice(0, 40)) < 0) en = (en ? en + ' — ' : '') + extra;
  var ref = a.ref ? ('Qur’an ' + a.ref) : '';
  return tdBeautify(ar, en, ref);
}
function tdSamina(){
  var a = window._clarityLiveSamina || {};
  var ar = a.ar || tdClean((document.getElementById('samina-ar') || {}).textContent);
  var en = a.en || tdClean((document.getElementById('samina-en') || {}).textContent);
  var title = a.title || tdClean((document.getElementById('samina-title') || {}).textContent);
  if (title && en.indexOf(title) < 0) en = title + ' — ' + en;
  return tdBeautify(ar, en, a.ref || '');
}
function tdTajweed(){
  var m = window._clarityLiveTajweed;
  if (m && (m.t || m.b)) return tdClean((m.t ? m.t + ': ' : '') + (m.b || ''));
  return tdClean((document.getElementById('tajweed-live-body') || {}).textContent);
}
function tdQuiz(){
  var w = null;
  try { w = JSON.parse(localStorage.getItem('clarity_td_quiz_win') || 'null'); } catch (e) {}
  if (!w || !w.q) {
    try {
      if (typeof fqEnsure === 'function') fqEnsure();
      if (typeof fqCards !== 'undefined' && fqCards && typeof fqState === 'object' && fqState && fqState.answered && fqState.answered.length) {
        var card = fqCards[fqState.answered[fqState.answered.length - 1]];
        if (card) w = { q: card.q, ans: (card.opts && card.opts[card.a]) || '', why: card.why || '', ref: card.ref || '' };
      }
    } catch (e2) {}
  }
  if (!w || !w.q) {
    var qel = document.querySelector('#fiqh-quiz-card .fq-question');
    var expl = document.getElementById('fq-explain');
    if (qel) w = { q: tdClean(qel.innerText), ans: '', why: expl ? tdClean(expl.innerText) : '', ref: '' };
  }
  if (!w || !w.q) return '';
  var line = 'Q: ' + w.q + ' A: ' + (w.ans || '');
  if (w.why) line += ' — ' + w.why;
  if (w.ref) line += ' (' + w.ref + ')';
  return tdClean(line);
}
function tdMeme(){
  var parts = [];
  ['meme-top-input', 'meme-mid-input', 'meme-bottom-input'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el && el.value.trim()) parts.push(el.value.trim());
  });
  return parts.join(' · ');
}

async function tdFetchAyah(ref){
  var out = { ar: '', en: '', ref: ref };
  try {
    var v = await fetch('https://api.quran.com/api/v4/verses/by_key/' + encodeURIComponent(ref) + '?language=en&translations=20&fields=text_uthmani');
    var j = await v.json();
    var verse = j.verse || {};
    out.ar = verse.text_uthmani || '';
    var tr = (verse.translations && verse.translations[0] && verse.translations[0].text) || '';
    out.en = String(tr).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  } catch (e) {}
  return out;
}
async function clarityLiveTafseer(force){
  var picks = ['1:6', '2:255', '3:31', '18:10', '24:35', '49:12', '67:2', '94:5'];
  var ref = picks[(force ? Date.now() : Math.floor(Date.now() / 86400000)) % picks.length];
  var a = await tdFetchAyah(ref);
  var tf = '';
  try {
    var t = await fetch('https://api.quran.com/api/v4/tafsirs/en-tafisr-ibn-kathir/by_ayah/' + encodeURIComponent(ref));
    var tj = await t.json();
    tf = String((tj.tafsir && tj.tafsir.text) || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  } catch (e) {}
  var ar = document.getElementById('tafseer-live-ar');
  var en = document.getElementById('tafseer-live-en');
  var meta = document.getElementById('tafseer-live-meta');
  var full = document.getElementById('tafseer-live-full');
  if (ar) ar.textContent = a.ar || '';
  if (en) en.textContent = a.en || '';
  if (meta) meta.textContent = ref + ' · Sahih International';
  if (full) full.textContent = tf ? ('Ibn Kathīr: ' + tf) : '';
  window._clarityLiveTafseer = a;
  return a;
}
async function clarityLiveSeerah(force){
  var picks = [
    { ref: '96:1', note: 'First waḥy in Cave Ḥirāʾ — Iqraʾ.' },
    { ref: '48:1', note: 'Ḥudaybiyyah: Allah called it a clear opening.' },
    { ref: '9:40', note: 'The two companions in the cave on the Hijrah.' },
    { ref: '33:56', note: 'Allah commands ṣalāh upon the Prophet ﷺ.' },
    { ref: '93:3', note: 'He did not abandon you after the pause in revelation.' },
    { ref: '8:17', note: 'Badr: you did not throw when you threw, but Allah threw.' },
    { ref: '3:159', note: 'After Uḥud: pardon them, consult them, rely on Allah.' },
    { ref: '4:65', note: 'No faith until they make you judge of what arises between them.' }
  ];
  var pck = picks[(force ? Date.now() : Math.floor(Date.now() / 86400000)) % picks.length];
  var a = await tdFetchAyah(pck.ref);
  a.note = pck.note;
  var tf = '';
  try {
    var r = await fetch('https://api.quran.com/api/v4/tafsirs/en-tafisr-ibn-kathir/by_ayah/' + encodeURIComponent(pck.ref));
    var tj = await r.json();
    tf = String((tj.tafsir && tj.tafsir.text) || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  } catch (e) {}
  a.tf = tf;
  var ar = document.getElementById('seerah-live-ar');
  var en = document.getElementById('seerah-live-en');
  var note = document.getElementById('seerah-live-note');
  if (ar) ar.textContent = a.ar || '';
  if (en) en.textContent = a.en || '';
  if (note) note.textContent = pck.ref + ' · ' + pck.note + (tf ? (' · Ibn Kathīr: ' + tf.slice(0, 280)) : '');
  window._clarityLiveSeerah = a;
  return a;
}
async function clarityLiveTajweed(force){
  var mods = [
    { t: 'Izhār (إظهار)', b: 'Nūn sākinah or tanwīn before ء ه ع ح غ خ: keep the nūn clear.' },
    { t: 'Ikhfāʾ (إخفاء)', b: 'Hide nūn/tanwīn before the ikhfāʾ (إخفاء) letters with light ghunnah (غُنّة).' },
    { t: 'Idghām (إدغام)', b: 'Nūn/tanwīn + ي ن م و: merge and hold two counts of ghunnah (غُنّة).' },
    { t: 'Qalqalah (قلقلة)', b: 'Bounce ق ط ب ج د when sākin — echo without a full vowel.' },
    { t: 'Madd ṭabīʿī (مدّ طبيعي)', b: 'Two counts on a long vowel not followed by hamzah or sukūn.' },
    { t: 'Madd lāzim (مدّ لازم)', b: 'Six counts when a permanent sukūn follows the madd (مدّ) letter.' },
    { t: 'Ghunnah (غُنّة)', b: 'Nūn or mīm mushaddadah: two counts of nasal sound.' }
  ];
  var m = mods[(force ? Date.now() : Math.floor(Date.now() / 86400000)) % mods.length];
  var title = document.getElementById('tajweed-live-title');
  var body = document.getElementById('tajweed-live-body');
  var src = document.getElementById('tajweed-live-src');
  if (title) title.textContent = m.t;
  if (body) body.textContent = m.b;
  if (src) src.textContent = 'AboutTajweed · https://www.abouttajweed.com';
  window._clarityLiveTajweed = m;
  return m;
}

var SAMINA_CASES = [
  {title:'Irrigation of al-Ḥarrah', ar:'اسْقِ يَا زُبَيْرُ ثُمَّ أَرْسِلِ الْمَاءَ إِلَى جَارِكَ', en:'A man disputed with al-Zubayr over irrigation channels. The Prophet ﷺ said: Water your land, O Zubayr, then send the water to your neighbour. When the man protested, the judgement was confirmed and 4:65 was recited about making him judge.', ref:'Bukhārī 2361', url:'https://sunnah.com/bukhari:2361', api:'eng-bukhari/2361', kind:'judgement'},
  {title:'I judge by what I hear', ar:'إِنَّمَا أَنَا بَشَرٌ وَإِنَّكُمْ تَخْتَصِمُونَ إِلَيَّ', en:'The Prophet ﷺ said: I am only a human. You bring disputes to me; some of you may be more eloquent than others. I judge by what I hear. If I give someone a right that belongs to his brother, let him not take it — it is a piece of the Fire.', ref:'Bukhārī 6967', url:'https://sunnah.com/bukhari:6967', api:'eng-bukhari/6967', kind:'judgement'},
  {title:'The lost sheep and camel', ar:'هِيَ لَكَ أَوْ لأَخِيكَ أَوْ لِلذِّئْبِ', en:'He was asked about a lost sheep: It is for you, or your brother, or the wolf. About a lost camel: Leave it; it has hooves and a water-skin; it drinks and eats until its owner finds it. Announce lost gold for a year.', ref:'Bukhārī 2427', url:'https://sunnah.com/bukhari:2427', api:'eng-bukhari/2427', kind:'judgement'},
  {title:'The Makhzūmī woman who stole', ar:'أَتَشْفَعُ فِي حَدٍّ مِنْ حُدُودِ اللَّهِ', en:'Usāmah tried to intercede for a noble woman who stole. The Prophet ﷺ said: Do you intercede regarding a ḥadd of Allah? By Allah, if Fāṭimah bint Muḥammad stole, I would cut her hand. Then he carried out the ḥadd.', ref:'Bukhārī 3475', url:'https://sunnah.com/bukhari:3475', api:'eng-bukhari/3475', kind:'judgement'},
  {title:'Hind and spending', ar:'خُذِي مَا يَكْفِيكِ وَوَلَدَكِ بِالْمَعْرُوفِ', en:'Hind bint ʿUtbah said Abū Sufyān was stingy. The Prophet ﷺ said: Take what is sufficient for you and your child in a reasonable manner.', ref:'Bukhārī 2211', url:'https://sunnah.com/bukhari:2211', api:'eng-bukhari/2211', kind:'judgement'},
  {title:'Two litigants, no proof', ar:'إِنَّمَا أَقْضِي بَيْنَكُمْ بِرَأْيِي فِيمَا لَمْ يُنْزَلْ عَلَيَّ فِيهِ', en:'Two men disputed an inheritance with no evidence but their claim. He judged between people by revelation when it came, and by apparent claims when it did not — and warned that a favourable verdict does not make the ḥarām ḥalāl.', ref:'Bukhārī 7185', url:'https://sunnah.com/bukhari:7185', api:'eng-bukhari/7185', kind:'judgement'},
  {title:'Constitution of Madinah — one ummah', ar:'إِنَّهُمْ أُمَّةٌ وَاحِدَةٌ مِنْ دُونِ النَّاسِ', en:'Governance: After the Hijrah the Prophet ﷺ established a written agreement between the Muhājirūn, Anṣār, and allied Jewish tribes of Madinah — defining mutual defence, religious autonomy, and that believers are one community distinct in their covenant. A foundational moment of Prophetic political order.', ref:'Sīrah · Constitution of Madinah', url:'https://www.muslimheritage.com/article/constitution-of-medina', api:'', kind:'governance'},
  {title:'Treaty of Ḥudaybiyyah — patience in terms', ar:'إِنَّهُ لَا يَأْتِيكَ مِنْهُمْ رَجُلٌ وَإِنْ كَانَ عَلَى دِينِكَ إِلَّا رَدَدْتَهُ إِلَيْهِمْ', en:'Governance: At Ḥudaybiyyah the Prophet ﷺ accepted terms that looked harsh to the Companions (including returning those who came to him from Quraysh). Revelation later called it a clear victory (48:1). Leadership that prefers long-term good over immediate pride.', ref:'Bukhārī 2731 · Qur’an 48:1', url:'https://sunnah.com/bukhari:2731', api:'eng-bukhari/2731', kind:'governance'},
  {title:'Public command — remove harm from the road', ar:'وَتُمِيطُ الأَذَى عَنِ الطَّرِيقِ صَدَقَةٌ', en:'Governance of daily space: Faith has sixty-odd branches; the highest is saying lā ilāha illā Allāh; the least is removing something harmful from the road. Public welfare is part of īmān.', ref:'Muslim 35', url:'https://sunnah.com/muslim:35', api:'eng-muslim/35', kind:'governance'},
  {title:'Consultation (shūrā) before Uḥud', ar:'فَاعْفُ عَنْهُمْ وَاسْتَغْفِرْ لَهُمْ وَشَاوِرْهُمْ فِي الأَمْرِ', en:'Governance: Before Uḥud the Prophet ﷺ consulted the Companions; younger voices preferred meeting the enemy outside. He wore his armour and did not put it off after the decision. Qur’an later commands: pardon them, seek forgiveness for them, and consult them in the matter (3:159).', ref:'Qur’an 3:159 · Sīrah Uḥud', url:'https://quran.com/3/159', api:'', kind:'governance'},
  {title:'Farewell sermon — blood and property sacred', ar:'فَإِنَّ دِمَاءَكُمْ وَأَمْوَالَكُمْ وَأَعْرَاضَكُمْ عَلَيْكُمْ حَرَامٌ', en:'Governance: In the Farewell Ḥajj he declared the blood, wealth, and honour of the believers sacred like the sacredness of that day, month, and city — and that no Arab has superiority over a non-Arab except by taqwā. A charter of rights under Prophetic authority.', ref:'Muslim · Farewell sermon reports', url:'https://sunnah.com/search?q=farewell+sermon', api:'', kind:'governance'},
  {title:'Letter to Heraclius — invitation with proof', ar:'مِنْ مُحَمَّدٍ عَبْدِ اللَّهِ وَرَسُولِهِ إِلَى هِرَقْلَ عَظِيمِ الرُّومِ', en:'Governance & dawah: The Prophet ﷺ wrote to Heraclius: From Muḥammad, servant and Messenger of Allah, to Heraclius, great one of Rome… Invite to Islam with the word of tawḥīd and a clear call — diplomacy under revelation.', ref:'Bukhārī 7', url:'https://sunnah.com/bukhari:7', api:'eng-bukhari/7', kind:'governance'}
];

/* ===== Daily Samiʿnā wa aṭaʿnā Qurʾānic verses ===== */
var SAMINA_VERSE_BANK = [
  { surah:4, ayah:59, ref:"An-Nisāʾ 4:59",
    ar:"يَا أَيُّهَا الَّذِينَ آمَنُوا أَطِيعُوا اللَّهَ وَأَطِيعُوا الرَّسُولَ وَأُولِي الْأَمْرِ مِنكُمْ",
    en:"O you who believe, obey Allah and obey the Messenger and those in authority among you.",
    note:"Obedience to Allah and His Messenger ﷺ is the foundation of submission." },
  { surah:4, ayah:65, ref:"An-Nisāʾ 4:65",
    ar:"فَلَا وَرَبِّكَ لَا يُؤْمِنُونَ حَتَّىٰ يُحَكِّمُوكَ فِيمَا شَجَرَ بَيْنَهُمْ",
    en:"But no, by your Lord, they will not [truly] believe until they make you [O Muhammad] judge concerning that over which they dispute among themselves.",
    note:"True faith includes accepting the Prophet’s ﷺ judgement." },
  { surah:33, ayah:36, ref:"Al-Aḥzāb 33:36",
    ar:"وَمَا كَانَ لِمُؤْمِنٍ وَلَا مُؤْمِنَةٍ إِذَا قَضَى اللَّهُ وَرَسُولُهُ أَمْرًا أَن يَكُونَ لَهُمُ الْخِيَرَةُ مِنْ أَمْرِهِمْ",
    en:"It is not for a believing man or woman, when Allah and His Messenger have decided a matter, to have any choice about their decision.",
    note:"Believers have no preference against the decision of Allah and His Messenger ﷺ." },
  { surah:59, ayah:7, ref:"Al-Ḥashr 59:7",
    ar:"وَمَا آتَاكُمُ الرَّسُولُ فَخُذُوهُ وَمَا نَهَاكُمْ عَنْهُ فَانتَهُوا",
    en:"And whatever the Messenger gives you, take it; and whatever he forbids you, refrain from it.",
    note:"Take what the Prophet ﷺ brought and leave what he forbade." },
  { surah:3, ayah:31, ref:"Āl ʿImrān 3:31",
    ar:"قُلْ إِن كُنتُمْ تُحِبُّونَ اللَّهَ فَاتَّبِعُونِي يُحْبِبْكُمُ اللَّهُ",
    en:"Say [O Muhammad]: If you love Allah, then follow me; Allah will love you.",
    note:"Love of Allah is proven by following the Prophet ﷺ." },
  { surah:4, ayah:80, ref:"An-Nisāʾ 4:80",
    ar:"مَّن يُطِعِ الرَّسُولَ فَقَدْ أَطَاعَ اللَّهَ",
    en:"Whoever obeys the Messenger has obeyed Allah.",
    note:"Obedience to the Messenger ﷺ is obedience to Allah." },
  { surah:24, ayah:51, ref:"An-Nūr 24:51",
    ar:"إِنَّمَا كَانَ قَوْلَ الْمُؤْمِنِينَ إِذَا دُعُوا إِلَى اللَّهِ وَرَسُولِهِ لِيَحْكُمَ بَيْنَهُمْ أَن يَقُولُوا سَمِعْنَا وَأَطَعْنَا",
    en:"The only response of the believers, when they are called to Allah and His Messenger to judge between them, is that they say: We hear and we obey.",
    note:"Samiʿnā wa aṭaʿnā — we hear and we obey." },
  { surah:33, ayah:71, ref:"Al-Aḥzāb 33:71",
    ar:"وَمَن يُطِعِ اللَّهَ وَرَسُولَهُ فَقَدْ فَازَ فَوْزًا عَظِيمًا",
    en:"And whoever obeys Allah and His Messenger has certainly attained a great triumph.",
    note:"Obedience is the path to ultimate success." },
  { surah:8, ayah:20, ref:"Al-Anfāl 8:20",
    ar:"يَا أَيُّهَا الَّذِينَ آمَنُوا أَطِيعُوا اللَّهَ وَرَسُولَهُ وَلَا تَوَلَّوْا عَنْهُ وَأَنتُمْ تَسْمَعُونَ",
    en:"O you who believe, obey Allah and His Messenger and do not turn away from him while you hear [his order].",
    note:"Do not turn away from the Messenger while you hear." },
  { surah:4, ayah:13, ref:"An-Nisāʾ 4:13",
    ar:"وَمَن يُطِعِ اللَّهَ وَرَسُولَهُ يُدْخِلْهُ جَنَّاتٍ تَجْرِي مِن تَحْتِهَا الْأَنْهَارُ",
    en:"And whoever obeys Allah and His Messenger — He will admit him to gardens beneath which rivers flow.",
    note:"Obedience is linked to Paradise by Allah’s promise." }
];
function clarityDailySaminaVerse(force){
  try {
    var key = 'clarity_samina_verse_' + (typeof fqTodayKey==='function' ? fqTodayKey() : new Date().toISOString().slice(0,10));
    var idx = 0;
    if(!force){
      try {
        var saved = localStorage.getItem(key);
        if(saved != null) idx = parseInt(saved,10)||0;
        else {
          var day = key.split('_').pop() || '';
          var h = 0; for(var i=0;i<day.length;i++) h = ((h<<5)-h)+day.charCodeAt(i)|0;
          idx = Math.abs(h) % SAMINA_VERSE_BANK.length;
          localStorage.setItem(key, String(idx));
        }
      } catch(e0){ idx = Math.floor(Math.random()*SAMINA_VERSE_BANK.length); }
    } else {
      try {
        var prev = parseInt(localStorage.getItem(key)||'0',10)||0;
        idx = (prev + 1) % SAMINA_VERSE_BANK.length;
        localStorage.setItem(key, String(idx));
      } catch(e1){ idx = Math.floor(Math.random()*SAMINA_VERSE_BANK.length); }
    }
    var c = SAMINA_VERSE_BANK[idx % SAMINA_VERSE_BANK.length];
    var apply = function(v){
      var r = document.getElementById('samina-verse-ref');
      var a = document.getElementById('samina-verse-ar');
      var e = document.getElementById('samina-verse-en');
      var n = document.getElementById('samina-verse-note');
      var l = document.getElementById('samina-verse-link');
      if(r) r.textContent = v.ref || '';
      if(a) a.textContent = v.ar || '';
      if(e) e.textContent = v.en || '';
      if(n) n.textContent = v.note || '';
      if(l){ l.href = 'https://quran.com/' + (v.surah||4) + '/' + (v.ayah||59); }
      window._claritySaminaVerse = v;
    };
    apply(c);
    if(typeof fetch === 'function'){
      fetch('https://api.alquran.cloud/v1/ayah/' + c.surah + ':' + c.ayah + '/editions/quran-uthmani,en.sahih')
        .then(function(res){ return res.ok ? res.json() : null; })
        .then(function(data){
          if(!data || data.code !== 200 || !data.data) return;
          var arr = Array.isArray(data.data) ? data.data : [data.data];
          var ar = '', en = '';
          arr.forEach(function(ed){
            if(!ed) return;
            var id = (ed.edition && ed.edition.identifier) ? String(ed.edition.identifier) : '';
            if(/uthmani|quran/i.test(id) && ed.text) ar = ed.text;
            if(/en\.|sahih/i.test(id) && ed.text) en = ed.text;
          });
          if(ar || en) apply({ surah:c.surah, ayah:c.ayah, ref:c.ref, ar: ar||c.ar, en: en||c.en, note:c.note });
        }).catch(function(){});
    }
  } catch(err){ console.warn('samina verse', err); }
}
try { window.clarityDailySaminaVerse = clarityDailySaminaVerse; } catch(e){}

async function clarityLiveSamina(force){
  var i = (force ? Date.now() : Math.floor(Date.now() / 86400000)) % SAMINA_CASES.length;
  var c = SAMINA_CASES[i];
  var en = c.en;
  try {
    var res = await fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/' + c.api + '.min.json');
    if (res.ok) {
      var j = await res.json();
      var txt = (j.hadith && j.hadith.text) || (j.text) || '';
      if (txt && String(txt).length > 40) en = String(txt).replace(/\s+/g, ' ').trim();
    }
  } catch (e) {}
  window._clarityLiveSamina = { ar: c.ar, en: en, title: c.title, ref: c.ref, url: c.url };
  var tel = document.getElementById('samina-title');
  var ael = document.getElementById('samina-ar');
  var eel = document.getElementById('samina-en');
  var sel = document.getElementById('samina-src');
  var lel = document.getElementById('samina-link');
  if (tel) tel.textContent = c.title;
  if (ael) ael.textContent = c.ar;
  if (eel) eel.textContent = en;
  if (sel) sel.textContent = (c.kind === 'governance' ? 'Governance · ' : 'Judgement · ') + c.ref + ' · Educational only — not a fatwa';
  if (lel) { lel.href = c.url; lel.textContent = 'Open ' + c.ref + ' on Sunnah.com'; }
  return window._clarityLiveSamina;
}
window.clarityLiveSamina = clarityLiveSamina;
try{ window.clarityDailySaminaVerse = clarityDailySaminaVerse; window.siqFetchOnlineBank = siqFetchOnlineBank; window.siqShowDailyLog = siqShowDailyLog; }catch(eExpSiq){}

async function tdRefreshOnline(){
  tdStatus('Refreshing live sections…');
  try { if (typeof loadVerse === 'function') loadVerse(); } catch (e1) {}
  try { if (typeof loadCommand === 'function') loadCommand(); } catch (e2) {}
  try { if (typeof loadZikr === 'function') loadZikr(); } catch (e3) {}
  try { await clarityLiveTafseer(true); } catch (e4) {}
  try { await clarityLiveSeerah(true); } catch (e5) {}
  try { await clarityLiveTajweed(true); } catch (e6) {}
  try { await clarityLiveSamina(true); } catch (e7) {}
  try { clarityDailySaminaVerse(false); } catch (e7b) {}
  tdStatus('Live sections refreshed');
}
function tdKindBg(kind){
  return ({ verse:'holy', commands:'holy', grave:'night', tafseer:'spirit', seerah:'holy', tajweed:'nature', sami:'holy', quiz:'spirit', meme:'flickr', surprise:'flickr' })[kind] || 'flickr';
}
function tdSendToMeme(){
  var ta = document.getElementById('td-text');
  var raw = ta ? String(ta.value || '') : '';
  var lines = raw.split('\n').map(function(l){ return l.trim(); }).filter(Boolean);
  var link = '';
  if (lines.length && /^https?:\/\//.test(lines[lines.length-1])) link = lines.pop();
  var ar = '', en = '', ref = '';
  lines.forEach(function(l){
    if (/[\u0600-\u06FF]/.test(l) && !ar) ar = l;
    else if (/Qur|Bukh|Muslim|Sahih|Ref/i.test(l) && !ref) ref = l;
    else if (!en) en = l;
    else en += ' ' + l;
  });
  var top = document.getElementById('meme-top-input');
  var mid = document.getElementById('meme-mid-input');
  var bot = document.getElementById('meme-bottom-input');
  if (top) top.value = ar || (lines[0] || '');
  if (mid) mid.value = en || '';
  if (bot) bot.value = ref || link || '';
  try { if (typeof memeSyncFromInputs === 'function') memeSyncFromInputs(); } catch (e) {}
  var kind = (window._tdLastKind || 'verse');
  try { if (typeof memeFetchBg === 'function') memeFetchBg(tdKindBg(kind)); } catch (e2) {}
  try { if (typeof switchTab === 'function') switchTab('reality'); } catch (e3) {}
  setTimeout(function(){
    var el = document.getElementById('meme-card');
    if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
  tdStatus('Sent to Meme Studio');
}

async function tdDraft(kind){
  window._tdLastKind = (kind==="surprise"||kind==="mix") ? window._tdLastKind : kind;

  tdStatus('Drafting…');
  if (kind === 'surprise' || kind === 'mix') {
    kind = ['verse', 'commands', 'grave', 'tafseer', 'seerah', 'tajweed', 'sami'][Math.floor(Math.random() * 7)];
  }
  var body = '';
  try {
    if (kind === 'tafseer') await clarityLiveTafseer();
    if (kind === 'seerah') await clarityLiveSeerah();
    if (kind === 'tajweed') await clarityLiveTajweed();
    if (kind === 'sami') await clarityLiveSamina();
    if (kind === 'verse') body = tdVerse();
    else if (kind === 'commands') body = tdCommands();
    else if (kind === 'grave') body = tdGrave();
    else if (kind === 'tafseer') body = tdTafseer();
    else if (kind === 'seerah') body = tdSeerah();
    else if (kind === 'tajweed') body = tdTajweed();
    else if (kind === 'sami') body = tdSamina();
    else if (kind === 'quiz') body = tdQuiz();
    else if (kind === 'meme') body = tdMeme();
    else body = tdVerse();
  } catch (err) {
    body = '';
  }
  if (!body) body = 'Open that tab so the verse + English can load, then draft again.';
  tdFinish(kind, body);
}

function tdCount(){
  var ta = document.getElementById('td-text');
  var n = ta ? ta.value.length : 0;
  var c = document.getElementById('td-count');
  var m = document.getElementById('td-meta');
  if (c) c.textContent = n + ' / 280';
  if (m) m.classList.toggle('warn', n > 260);
}
function tdCopy(){
  var ta = document.getElementById('td-text');
  var val = ta ? ta.value : '';
  if (!val) { tdDraft('verse'); val = (ta && ta.value) || ''; }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(val).then(function () { tdStatus('Copied'); });
  } else tdPost();
}
function tdPost(){
  var ta = document.getElementById('td-text');
  if (!ta || !ta.value.trim()) tdDraft('verse');
  var raw = ((document.getElementById('td-text') || {}).value || '');
  window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(raw), '_blank', 'noopener');
  tdStatus('Compose opened — post while logged into X');
}
function tdRemind(){
  try { localStorage.setItem('clarity_tweet_desk_daily', '1'); } catch (e) {}
  tdStatus('Reminder saved on this device');
}
function tdSaveHandle(){
  var el = document.getElementById('td-handle');
  var h = (el && el.value || '').trim().replace(/^@/, '');
  try { localStorage.setItem('clarity_x_handle', h); } catch (e) {}
  tdStatus(h ? ('Saved @' + h) : 'Handle cleared');
}
function tdLoadHandle(){
  var el = document.getElementById('td-handle');
  if (!el) return;
  try {
    var h = localStorage.getItem('clarity_x_handle') || '';
    if (h) el.value = '@' + h.replace(/^@/, '');
  } catch (e) {}
}
function tdConnectX(){
  window.open('https://x.com/login', '_blank', 'noopener');
  tdStatus('Log in on X, return, then Post');
}
window.tdDraft = tdDraft;
window.tdPost = tdPost;
window.tdCopy = tdCopy;
window.tdRemind = tdRemind;
window.tdCount = tdCount;
window.tdSaveHandle = tdSaveHandle;
window.tdConnectX = tdConnectX;
window.tdRefreshOnline = tdRefreshOnline;
window.tdSendToMeme = tdSendToMeme;

function clarityIconizeSections(){
  var map = [
    [/journey|daily verse|today.s verse/i, '🧭'],
    [/command/i, '📜'],
    [/tafseer|tafsīr|tafsir/i, '📖'],
    [/seerah|sīrah|sami|samiʿ|judgement/i, '🕊'],
    [/tajweed|calligraphy/i, '🔤'],
    [/grave|zikr|istighfar/i, '🌙'],
    [/quiz|fiqh|sharia iq/i, '🧠'],
    [/meme studio/i, '🎨'],
    [/tweet desk/i, '𝕏'],
    [/guidance|search/i, '🔍'],
    [/lecture/i, '🎧'],
    [/note/i, '📝'],
    [/hajj/i, '🕋']
  ];
  document.querySelectorAll('h2').forEach(function(h){
    if (h.getAttribute('data-iconized')) return;
    var txt = (h.textContent || '').trim();
    if (!txt || /^[\u{1F300}-\u{1FAFF}🧭📜📖🕊🔤🌙🧠🎨🔍🎧📝🕋𝕏]/u.test(txt)) { h.setAttribute('data-iconized','1'); return; }
    for (var i=0;i<map.length;i++){
      if (map[i][0].test(txt)){
        h.insertAdjacentText('afterbegin', map[i][1] + ' ');
        break;
      }
    }
    h.setAttribute('data-iconized','1');
  });
}
try{
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', function(){ try{clarityIconizeSections();}catch(e){} });
  else setTimeout(function(){ try{clarityIconizeSections();}catch(e){} }, 300);
}catch(e){}

window.clarityLiveTafseer = clarityLiveTafseer;
window.clarityLiveSeerah = clarityLiveSeerah;
window.clarityLiveTajweed = clarityLiveTajweed;
try {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      tdLoadHandle();
      try { clarityLiveTafseer(); } catch (e1) {}
      try { clarityLiveSeerah(); } catch (e2) {}
      try { clarityLiveTajweed(); } catch (e3) {}
      try { clarityLiveSamina(); } catch (e4) {}
      try { clarityDailySaminaVerse(false); } catch (e4b) {}
    });
  } else {
    setTimeout(function () {
      tdLoadHandle();
      try { clarityLiveTafseer(); } catch (e1) {}
      try { clarityLiveSeerah(); } catch (e2) {}
      try { clarityLiveTajweed(); } catch (e3) {}
    }, 400);
  }
} catch (e) {}

// 🧠 SHARIA IQ DATABASE MATRIX (15 Progressive Questions Expansion Pack)
const shariaIQDatabase = [
    { q: "What constitutes the maximum limit for a voluntary bequest (Wasiyyah) to non-heirs from an estate?", cat: "Fiqh & Inheritance", opts: ["One-Fourth (1/4)", "One-Third (1/3)", "One-Half (1/2)", "No specific restriction limit"], ans: 1, fix: "Correct. Classical prophetic consensus explicitly caps voluntary bequests at one-third to preserve rightful family inheritance portions." },
    { q: "Which specific compilation criteria explicitly separates Hadith Qudsi from standard Hadith reports?", cat: "Hadith Science", opts: ["Its chain contains only Sahaba", "The meaning is from Allah but word phrasing is from the Prophet ﷺ", "It is only verified via written papyrus", "It only details martial judgments"], ans: 1, fix: "Correct. Hadith Qudsi details divine meaning directly from Allah expressed using the phrasing of the Prophet ﷺ." },
    { q: "How many mandatory Takbirs are universally executed during standard funeral prayers (Salat al-Janazah)?", cat: "Fiqh / Rituals", opts: ["Two Takbirs", "Three Takbirs", "Four Takbirs", "Five Takbirs"], ans: 2, fix: "Correct. Mainstream classical consensus outlines exactly four structural Takbirs during congregational funeral prayers." },
    { q: "What is the primary conceptual distinction of Tauheed al-Uloohiyyah?", cat: "Theology (Aqidah)", opts: ["Affirming Allah as the sole Creator", "Directing all individual acts of worship to Allah alone", "Affirming Allah's unique names and descriptors", "Sourcing historical jurisprudence rules"], ans: 1, fix: "Correct. Tauheed al-Uloohiyyah focuses on exclusivity of direct dedication in all actions of worship to the Creator alone." },
    { q: "In classical inheritance science, who among the following living close relative entities can never be entirely excluded from standard assets distribution?", cat: "Fiqh & Inheritance", opts: ["Full Paternal Brother", "Biological Son", "Paternal Grandfather", "Maternal Uncle"], ans: 1, fix: "Correct. Primary direct lineage descendants (like biological sons, daughters, spouses, and parents) are never completely excluded from distribution arrays." },
    { q: "Which major covenant took place explicitly during the 6th year after Hijrah, paving the way for the opening of Makkah?", cat: "Prophetic History (Seerah)", opts: ["The Treaty of Hudaybiyyah", "The Pledge of Aqabah", "The Battle of Badr", "The Migration to Abyssinia"], ans: 0, fix: "Correct. The Treaty of Hudaybiyyah established critical strategic peace protocols allowing organic dawah expansion networks across Arabia." },
    { q: "What baseline window condition immediately voids the validity of ritual purification via wiping over leather socks (Khuffayn) for a resident?", cat: "Fiqh / Rituals", opts: ["Exceeding a 12-hour limit", "Exceeding a 24-hour limit", "Exceeding a 72-hour limit", "Entering a new municipality environment"], ans: 1, fix: "Correct. For stationary residents, the classical legislative window allows wiping up to exactly 24 hours (one day and night) before requiring structural renewal." },
    { q: "What linguistic definition represents the core legal mechanism of 'Awl in Islamic estate calculation processing?", cat: "Fiqh & Inheritance", opts: ["The total asset values expand exponentially", "The sum of structural share fractions exceeds the denominator baseline unit", "All residual relatives decline allocation shares", "Debts absorb the total asset inventory value"], ans: 1, fix: "Correct. 'Awl describes structural fraction asset conflicts where valid shares outpace the baseline unit, requiring proportionate fraction downscaling updates." },
    { q: "Which Quranic Surah contains two distinct occurrences of the critical opening phrase 'Bismillahir-Rahmanir-Rahim'?", cat: "Quranic Sciences", opts: ["Surah Al-Baqarah", "Surah Al-Namal", "Surah At-Tawbah", "Surah Al-Kahf"], ans: 1, fix: "Correct. Surah Al-Namal contains the phrase at the verse start and inside a written missive text sequence referenced within verse 30." },
    { q: "What exact financial framework boundary transforms standard silver asset quantities into tax-obligatory (Zakat) status?", cat: "Fiqh / Wealth", opts: ["500 grams baseline", "595 grams baseline (5 Masa / 200 Dirhams)", "85 grams baseline structural weight", "1000 grams baseline unit"], ans: 1, fix: "Correct. The classical Nisab indicator for silver configurations evaluates to 200 Dirhams, translating to approximately 595 grams of pure asset holdings." },
    { q: "During which foundational defensive engagement did the trench strategy transformation framework get deployed?", cat: "Prophetic History (Seerah)", opts: ["The Battle of Uhud", "The Battle of Al-Khandaq (The Trench)", "The Battle of Hunayn", "The Battle of Khaybar"], ans: 1, fix: "Correct. Salman al-Farsi suggested the defensive trench deployment to safeguard Madinah during the combined siege." },
    { q: "What functional definition describes the category of 'Asabah in inheritance share distribution rules?", cat: "Fiqh & Inheritance", opts: ["Relatives who only receive a fixed 1/6 allocation", "Residuary heirs who capture remaining value segments after primary fractions resolve", "Non-Muslim relatives mapped onto the lineage index", "Executors appointed via formal document instructions"], ans: 1, fix: "Correct. 'Asabah heirs occupy residuary distribution fields, claiming remaining wealth fragments after specific structural fractions are calculated." },
    { q: "What terminology dictates an authentic Hadith report containing a completely unbroken tracking line directly back to its origin statement?", cat: "Hadith Science", opts: ["Hadith Mu'allaq", "Hadith Muttasil", "Hadith Mursal", "Hadith Da'if"], ans: 1, fix: "Correct. Hadith Muttasil represents an unbroken textual transmission line where every single narrator connected directly to their immediate reporting link." },
    { q: "Which companion was chosen to stay behind in the cave with the Prophet ﷺ during the critical migration (Hijrah) route to Madinah?", cat: "Prophetic History (Seerah)", opts: ["Umar ibn al-Khattab", "Abu Bakr As-Siddiq", "Ali ibn Abi Talib", "Uthman ibn Affan"], ans: 1, fix: "Correct. Abu Bakr As-Siddiq accompanied the Prophet ﷺ during the flight, a companionship immortalized in Surah At-Tawbah." },
    { q: "What condition is a core requirement for a repentance act (Tawbah) to be structurally complete and accepted?", cat: "Theology (Aqidah)", opts: ["Public performance before a local congregation", "Immediate cessation, authentic internal remorse, and absolute resolve to avoid return", "Financial penalization payment tracking lines", "Changing geographic residency lines instantly"], ans: 1, fix: "Correct. Sincere repentance requires stopping the sin immediately, feeling deep remorse, and firmly resolving never to repeat it." }
];

let currentQuizIndex = 0;
let accumulatedQuizScore = 0;

function _dead_initClarityOnboarding() {
    try {
        var cachedGate = localStorage.getItem("clarity_active_gate");
        if (cachedGate) { applyGateConfiguration(cachedGate); }
    } catch (e) {}
    try { initializeShariaQuiz(); } catch (e2) {}
}
function _dead_selectAppGate(gateType) {
    try {
      localStorage.setItem("clarity_active_gate", gateType);
      /* Force path switch on every gate choice */
      var pathKey = (gateType === "practicing") ? "practicing" : (gateType === "new_muslim") ? "new_muslim" : (gateType === "seeker") ? "seeker" : gateType;
      localStorage.setItem("clarity_path_override", pathKey);
    } catch (e) {}
    applyGateConfiguration(gateType);
    try {
      clarityRefreshDashboard();
      clarityDailyLesson(false);
      if (typeof clarityRenderPaths === "function") clarityRenderPaths();
      var board = document.getElementById("path-board");
      if (board) board.hidden = true;
      var badge = document.getElementById("current-mode-badge");
      var labels = { seeker: "Seeker Journey Mode", new_muslim: "New Muslim Track", practicing: "Legacy Planning Toolkit" };
      if (badge && labels[gateType]) badge.innerText = labels[gateType];
    } catch (e2) {}
}
function _dead_applyGateConfiguration(gate) {
    var overlay = document.getElementById("landing-gate-screen");
    var topNav = document.getElementById("clarity-global-nav");
    var workspace = document.getElementById("main-application-workspace");
    var badge = document.getElementById("current-mode-badge");
    if (overlay) overlay.classList.add("hidden");
    if (topNav) topNav.classList.remove("hidden");
    if (workspace) workspace.classList.remove("hidden");
    document.querySelectorAll(".gate-seeker-view, .gate-new-muslim-view, .gate-legacy-view").forEach(function(el){ el.classList.add("hidden"); });
    if (gate === "seeker") {
        if (badge) badge.innerText = "Seeker Journey Mode";
        document.querySelectorAll(".gate-seeker-view").forEach(function(el){ el.classList.remove("hidden"); });
    } else if (gate === "new_muslim") {
        if (badge) badge.innerText = "New Muslim Track";
        document.querySelectorAll(".gate-new-muslim-view").forEach(function(el){ el.classList.remove("hidden"); });
    } else if (gate === "practicing") {
        if (badge) badge.innerText = "Legacy Planning Toolkit";
        document.querySelectorAll(".gate-legacy-view").forEach(function(el){ el.classList.remove("hidden"); });
    }
}
function _dead_resetToGateView() {
    var overlay = document.getElementById("landing-gate-screen");
    var topNav = document.getElementById("clarity-global-nav");
    var workspace = document.getElementById("main-application-workspace");
    var los = document.getElementById("clarity-learn-os");
    if (overlay) overlay.classList.remove("hidden");
    if (topNav) topNav.classList.add("hidden");
    if (workspace) workspace.classList.add("hidden");
    if (los) los.classList.add("hidden");
    try {
      localStorage.removeItem("clarity_active_gate");
      localStorage.removeItem("clarity_path_override");
    } catch (e) {}
}
function toggleMasterDirectory() {
    document.querySelectorAll(".gate-seeker-view, .gate-new-muslim-view, .gate-legacy-view").forEach(function(el){ el.classList.remove("hidden"); });
    var badge = document.getElementById("current-mode-badge");
    if (badge) badge.innerText = "Master System Admin Mode";
}
function initializeShariaQuiz() {
    try {
        currentQuizIndex = parseInt(localStorage.getItem("clarity_quiz_index") || "0", 10);
        accumulatedQuizScore = parseInt(localStorage.getItem("clarity_quiz_score") || "0", 10);
    } catch (e) { currentQuizIndex = 0; accumulatedQuizScore = 0; }
    if (currentQuizIndex >= shariaIQDatabase.length) { currentQuizIndex = 0; accumulatedQuizScore = 0; }
    renderShariaQuizCard();
}
function renderShariaQuizCard() {
    if (!shariaIQDatabase.length) return;
    var currentItem = shariaIQDatabase[currentQuizIndex];
    var qLabel = document.getElementById("lbl-quiz-question");
    var catLabel = document.getElementById("lbl-question-category");
    if (!qLabel) return;
    if (catLabel) catLabel.innerText = currentItem.cat;
    qLabel.innerText = "Question " + (currentQuizIndex + 1) + ": " + currentItem.q;
    var container = document.getElementById("quiz-options-container");
    if (!container) return;
    container.innerHTML = "";
    currentItem.opts.forEach(function(opt, i) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "quiz-option-btn";
        btn.textContent = opt;
        btn.onclick = function() { processShariaAnswer(i); };
        container.appendChild(btn);
    });
    var scoreEl = document.getElementById("lbl-quiz-score");
    if (scoreEl) scoreEl.textContent = "Score: " + accumulatedQuizScore + " / " + shariaIQDatabase.length;
    var progEl = document.getElementById("lbl-quiz-progress");
    if (progEl) progEl.textContent = (currentQuizIndex + 1) + " / " + shariaIQDatabase.length;
}
function processShariaAnswer(selectedIdx) {
    var currentItem = shariaIQDatabase[currentQuizIndex];
    var feedback = document.getElementById("lbl-quiz-feedback");
    var correct = selectedIdx === currentItem.ans;
    if (correct) {
        accumulatedQuizScore++;
        if (feedback) {
            feedback.className = "siq-feedback ok";
            feedback.innerHTML = "<strong>✓ Correct.</strong> " + currentItem.fix;
        }
    } else {
        if (feedback) {
            feedback.className = "siq-feedback bad";
            feedback.innerHTML = "<strong>✗ Not quite.</strong> " + currentItem.fix;
        }
    }
    try {
        localStorage.setItem("clarity_quiz_score", String(accumulatedQuizScore));
        localStorage.setItem("clarity_quiz_index", String(currentQuizIndex + 1));
    } catch (e) {}
    var container = document.getElementById("quiz-options-container");
    if (container) container.querySelectorAll("button").forEach(function(b){ b.disabled = true; });
    setTimeout(function() {
        currentQuizIndex++;
        if (currentQuizIndex >= shariaIQDatabase.length) {
            finishShariaQuiz();
        } else {
            renderShariaQuizCard();
            if (feedback) feedback.innerHTML = "";
        }
    }, 1600);
}
function finishShariaQuiz() {
    var qLabel = document.getElementById("lbl-quiz-question");
    var container = document.getElementById("quiz-options-container");
    var feedback = document.getElementById("lbl-quiz-feedback");
    var pct = Math.round((accumulatedQuizScore / shariaIQDatabase.length) * 100);
    var band = pct >= 90 ? "Ummah Scholar Path" :
               pct >= 75 ? "Strong Student of Knowledge" :
               pct >= 55 ? "Steady Believer" :
               pct >= 35 ? "Seeking Heart" : "Return to Basics";
    if (qLabel) qLabel.innerText = "Session complete — " + band;
    if (container) container.innerHTML = "";
    if (feedback) {
        feedback.innerHTML = "<strong>Final score: " + accumulatedQuizScore + " / " + shariaIQDatabase.length + " (" + pct + "%)</strong><br>" +
            "<button type='button' class='btn-soft' onclick='resetShariaQuiz()'>Retake Sharia IQ</button>";
    }
    try {
        localStorage.setItem("clarity_quiz_score", String(accumulatedQuizScore));
        localStorage.setItem("clarity_quiz_index", String(shariaIQDatabase.length));
    } catch (e) {}
}
function resetShariaQuiz() {
    currentQuizIndex = 0;
    accumulatedQuizScore = 0;
    try {
        localStorage.setItem("clarity_quiz_index", "0");
        localStorage.setItem("clarity_quiz_score", "0");
    } catch (e) {}
    renderShariaQuizCard();
    var feedback = document.getElementById("lbl-quiz-feedback");
    if (feedback) feedback.innerHTML = "";
}
try {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initClarityOnboarding);
    } else {
        setTimeout(initClarityOnboarding, 100);
    }
} catch (eBoot) {}
/* window.selectAppGate deferred to fortress */
/* window.resetToGateView deferred to fortress */
window.toggleMasterDirectory = toggleMasterDirectory;
/* window.initClarityOnboarding deferred to fortress */
window.resetShariaQuiz = resetShariaQuiz;
window.processShariaAnswer = processShariaAnswer;

/* ===== Clarity Learning OS Engine (Paths / Daily / SR / Dashboard) ===== */
var CLARITY_PATHS = {
  seeker: {
    label: 'Curious Seeker',
    blurb: 'Purpose of reality → prophecy → Qur’an → next life',
    modules: [
      { id:'s1', title:'Tawhid & purpose of creation', mins:8, tab:'journey', prereq:null },
      { id:'s2', title:'Proofs of prophethood (Seerah highlights)', mins:10, tab:'seerah', prereq:'s1' },
      { id:'s3', title:'How the Qur’an was preserved', mins:8, tab:'tafseer', prereq:'s2' },
      { id:'s4', title:'Death, grave, and the next life', mins:10, tab:'grave', prereq:'s3' },
      { id:'s5', title:'Common doubts — calm answers', mins:10, tab:'search', prereq:'s4' }
    ]
  },
  new_muslim: {
    label: 'New Muslim 30-day starter',
    blurb: 'Prayer, purification, character — linear and practical',
    modules: [
      { id:'n1', title:'Shahada meaning & first steps', mins:7, tab:'journey', prereq:null },
      { id:'n2', title:'Wudu & prayer — step by step', mins:12, tab:'commands', prereq:'n1' },
      { id:'n3', title:'Five pillars in daily life', mins:10, tab:'commands', prereq:'n2' },
      { id:'n4', title:'Character & adab with family', mins:8, tab:'seerah', prereq:'n3' },
      { id:'n5', title:'Istighfar, salawat & the grave', mins:8, tab:'grave', prereq:'n4' }
    ]
  },
  practicing: {
    label: 'Daily Muslim',
    blurb: 'Micro-deeds, review, and legacy tools',
    modules: [
      { id:'p1', title:'One action today + streak discipline', mins:5, tab:'journey', prereq:null },
      { id:'p2', title:'Tajweed / short surah fluency', mins:10, tab:'tajweed', prereq:'p1' },
      { id:'p3', title:'Weekly light review', mins:8, tab:'journey', prereq:'p2' },
      { id:'p4', title:'Wasiyyah & inheritance awareness', mins:12, tab:'notes', prereq:'p3' },
      { id:'p5', title:'Share one authentic reminder', mins:6, tab:'about', prereq:'p4' }
    ]
  },
  dai: {
    label: 'Aspiring Da’i',
    blurb: 'Clarity, sources, and gentle invitation',
    modules: [
      { id:'d1', title:'Dawah ethics & sincerity', mins:8, tab:'seerah', prereq:null },
      { id:'d2', title:'Source discipline (Qur’an / Hadith grades)', mins:10, tab:'search', prereq:'d1' },
      { id:'d3', title:'Answering misconceptions calmly', mins:12, tab:'search', prereq:'d2' },
      { id:'d4', title:'Teaching one micro-lesson well', mins:10, tab:'lectures', prereq:'d3' },
      { id:'d5', title:'Local mosque & community link', mins:6, tab:'about', prereq:'d4' }
    ]
  }
};

var CLARITY_DAILY_BANK = [
  { title:'Begin with the Name', ar:'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', en:'In the name of Allah, the Entirely Merciful, the Especially Merciful.', action:'Say Bismillah before your next task and mean it.', evidence:'Qur’an 1:1 · Opening of almost every surah — a daily reset of intention.', ref:'https://quran.com/1/1' },
  { title:'One sincere istighfar', ar:'أَسْتَغْفِرُ اللَّهَ', en:'I seek forgiveness from Allah.', action:'Make istighfar 10 times with presence, not speed.', evidence:'Prophetic practice elevates regular istighfar; pair with leaving a known sin.', ref:'https://sunnah.com' },
  { title:'Pray on time', ar:'إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا', en:'Indeed, prayer has been decreed upon the believers a decree of specified times.', action:'Guard the next salah from its first moment.', evidence:'Qur’an 4:103 · Fixed times are a mercy, not a burden.', ref:'https://quran.com/4/103' },
  { title:'Speak good or remain silent', ar:'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ', en:'Whoever believes in Allah and the Last Day should speak good or remain silent.', action:'Before your next reply online or offline, pause one breath.', evidence:'Bukhari / Muslim — foundational adab of the tongue.', ref:'https://sunnah.com' },
  { title:'Send salawat', ar:'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', en:'O Allah, send peace and blessings upon Muhammad.', action:'Send salawat 10 times with love for the Prophet ﷺ.', evidence:'Qur’an 33:56 · Allah and the angels send salawat; believers are commanded.', ref:'https://quran.com/33/56' },
  { title:'Light for the grave', ar:'كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ', en:'Every soul will taste death.', action:'Give charity or a quiet good deed intending it as light ahead.', evidence:'Qur’an 3:185 · Death is certain; deeds travel with you.', ref:'https://quran.com/3/185' },
  { title:'Parents and kindness', ar:'وَبِالْوَالِدَيْنِ إِحْسَانًا', en:'And to parents, good treatment.', action:'Message or help a parent (or elder) with one concrete kindness.', evidence:'Qur’an 17:23 · After Tawhid, excellence to parents.', ref:'https://quran.com/17/23' }
];

function clarityLSGet(k, fallback) {
  try { var v = localStorage.getItem(k); return v == null ? fallback : v; } catch (e) { return fallback; }
}
function clarityLSSet(k, v) { try { localStorage.setItem(k, String(v)); } catch (e) {} }
function clarityLSJSON(k, fallback) {
  try { var raw = localStorage.getItem(k); if (!raw) return fallback; var o = JSON.parse(raw); return o == null ? fallback : o; } catch (e) { return fallback; }
}
function clarityLSSetJSON(k, o) { try { localStorage.setItem(k, JSON.stringify(o)); } catch (e) {} }

function clarityPathProgressKey(track) { return 'clarity_path_prog_' + track; }
function clarityGetPathProgress(track) {
  return clarityLSJSON(clarityPathProgressKey(track), { done: [], last: null, minutes: 0 });
}
function claritySavePathProgress(track, prog) {
  clarityLSSetJSON(clarityPathProgressKey(track), prog);
  clarityRefreshDashboard();
}
function _dead_clarityActiveTrack() {
  /* Prefer explicit path override; keep in sync with last gate selection */
  var o = clarityLSGet('clarity_path_override', '');
  if (o && CLARITY_PATHS[o]) return o;
  var g = clarityLSGet('clarity_active_gate', 'seeker') || 'seeker';
  if (g === 'dai') return 'dai';
  if (CLARITY_PATHS[g]) return g;
  return 'seeker';
}

function clarityRefreshDashboard() {
  var track = clarityActiveTrack();
  var path = CLARITY_PATHS[track] || CLARITY_PATHS.seeker;
  var prog = clarityGetPathProgress(track);
  var label = document.getElementById('cd-track-label');
  if (label) label.textContent = path.label;
  var streak = parseInt(clarityLSGet('clarity_daily_streak', '0'), 10) || 0;
  var el;
  if ((el = document.getElementById('cd-streak'))) el.textContent = String(streak);
  if ((el = document.getElementById('cd-modules'))) el.textContent = String((prog.done || []).length);
  if ((el = document.getElementById('cd-minutes'))) el.textContent = String(prog.minutes || 0);
  var sr = clarityLSJSON('clarity_sr_queue', []);
  var due = 0, now = Date.now();
  (sr || []).forEach(function(item){ if (!item.due || item.due <= now) due++; });
  if ((el = document.getElementById('cd-sr-due'))) el.textContent = String(due);
  var hint = document.getElementById('cd-sr-hint');
  if (hint) hint.textContent = due > 0 ? (due + ' spaced-review item(s) due — revisit key terms today.') : 'No spaced reviews due. Save a daily card to build the queue.';
  var los = document.getElementById('clarity-learn-os');
  var ws = document.getElementById('main-application-workspace');
  if (los && ws && !ws.classList.contains('hidden')) los.classList.remove('hidden');
}

function clarityRenderPaths() {
  var board = document.getElementById('path-board');
  if (!board) return;
  var track = clarityActiveTrack();
  var html = '';
  Object.keys(CLARITY_PATHS).forEach(function(key) {
    var path = CLARITY_PATHS[key];
    var prog = clarityGetPathProgress(key);
    var doneMap = {};
    (prog.done || []).forEach(function(id){ doneMap[id] = true; });
    var total = path.modules.length;
    var doneN = path.modules.filter(function(m){ return doneMap[m.id]; }).length;
    var pct = total ? Math.round(100 * doneN / total) : 0;
    html += '<div class="path-card" data-track="'+key+'">';
    html += '<h3>'+path.label+(key===track?' · active':'')+'</h3>';
    html += '<div class="path-meta">'+path.blurb+' · '+doneN+'/'+total+' modules</div>';
    html += '<div class="path-prog"><div class="fill" style="width:'+pct+'%"></div></div>';
    html += '<ul class="path-mods">';
    path.modules.forEach(function(m) {
      var locked = m.prereq && !doneMap[m.prereq];
      var isDone = !!doneMap[m.id];
      html += '<li class="'+(isDone?'done':'')+'" onclick="clarityOpenModule(\''+key+'\',\''+m.id+'\')">';
      html += '<input type="checkbox" class="mod-check" '+(isDone?'checked':'')+' '+(locked?'disabled':'')+' onclick="event.stopPropagation();clarityToggleModule(\''+key+'\',\''+m.id+'\')" />';
      html += '<span style="flex:1">'+(locked?'🔒 ':'')+m.title+'</span>';
      html += '<span class="mod-time">~'+m.mins+' min</span></li>';
    });
    html += '</ul>';
    if (key !== track) {
      html += '<button type="button" class="btn-soft" style="margin-top:.5rem" onclick="claritySwitchTrack(\''+key+'\')">Switch to this track</button>';
    }
    html += '</div>';
  });
  board.innerHTML = html;
  board.hidden = false;
}

function clarityShowPaths() {
  var board = document.getElementById('path-board');
  if (!board) return;
  if (board.hidden || !board.innerHTML) clarityRenderPaths();
  else board.hidden = !board.hidden;
}

function _dead_claritySwitchTrack(key) {
  if (!CLARITY_PATHS[key]) return;
  clarityLSSet('clarity_path_override', key);
  var gate = (key === 'dai') ? 'practicing' : key;
  try { localStorage.setItem('clarity_active_gate', gate); } catch(e) {}
  if (typeof applyGateConfiguration === 'function') applyGateConfiguration(gate);
  clarityRefreshDashboard();
  clarityRenderPaths();
  clarityDailyLesson(false);
}

function clarityToggleModule(track, modId) {
  var path = CLARITY_PATHS[track];
  if (!path) return;
  var mod = null;
  for (var i=0;i<path.modules.length;i++) if (path.modules[i].id===modId) mod = path.modules[i];
  if (!mod) return;
  var prog = clarityGetPathProgress(track);
  var done = prog.done || [];
  var idx = done.indexOf(modId);
  if (idx >= 0) done.splice(idx, 1);
  else {
    if (mod.prereq && done.indexOf(mod.prereq) < 0) {
      alert('Complete the previous module first.');
      clarityRenderPaths();
      return;
    }
    done.push(modId);
    prog.minutes = (prog.minutes || 0) + (mod.mins || 5);
    prog.last = modId;
  }
  prog.done = done;
  claritySavePathProgress(track, prog);
  if (done.length >= path.modules.length) {
    var cert = document.getElementById('cert-banner');
    var ct = document.getElementById('cert-text');
    if (ct) ct.textContent = path.label + ' — all modules checked on this device.';
    if (cert) cert.classList.add('show');
  }
  clarityRenderPaths();
}

function clarityOpenModule(track, modId) {
  var path = CLARITY_PATHS[track];
  if (!path) return;
  var mod = null;
  for (var i=0;i<path.modules.length;i++) if (path.modules[i].id===modId) mod = path.modules[i];
  if (!mod) return;
  var prog = clarityGetPathProgress(track);
  if (mod.prereq && (prog.done || []).indexOf(mod.prereq) < 0) {
    alert('Prerequisite not done yet.');
    return;
  }
  prog.last = modId;
  claritySavePathProgress(track, prog);
  if (typeof switchTab === 'function') switchTab(mod.tab);
}

function clarityContinuePath() {
  var track = clarityActiveTrack();
  var path = CLARITY_PATHS[track] || CLARITY_PATHS.seeker;
  var prog = clarityGetPathProgress(track);
  var doneMap = {};
  (prog.done || []).forEach(function(id){ doneMap[id] = true; });
  var next = null;
  for (var i = 0; i < path.modules.length; i++) {
    if (!doneMap[path.modules[i].id]) { next = path.modules[i]; break; }
  }
  if (!next) {
    alert('This track is complete on this device. Browse another track.');
    clarityShowPaths();
    return;
  }
  clarityOpenModule(track, next.id);
}

function clarityDailyLesson(forceNew) {
  var key = 'clarity_daily_card_' + (new Date().toISOString().slice(0,10));
  var idx = forceNew ? -1 : parseInt(clarityLSGet(key, '-1'), 10);
  if (forceNew || isNaN(idx) || idx < 0) {
    idx = Math.floor(Math.random() * CLARITY_DAILY_BANK.length);
    clarityLSSet(key, String(idx));
  }
  var card = CLARITY_DAILY_BANK[idx % CLARITY_DAILY_BANK.length];
  var t = document.getElementById('dm-title');
  var ar = document.getElementById('dm-verse');
  var en = document.getElementById('dm-en');
  var act = document.getElementById('dm-action');
  var ev = document.getElementById('dm-evidence-body');
  if (t) t.textContent = card.title;
  if (ar) ar.textContent = card.ar || '';
  if (en) en.textContent = card.en || '';
  if (act) act.innerHTML = '<strong>One action:</strong> ' + (card.action || '');
  if (ev) ev.innerHTML = (card.evidence || '') + (card.ref ? ' · <a href="'+card.ref+'" target="_blank" rel="noopener" style="color:#f0d78c">Open source</a>' : '');
  try { window._clarityDailyCard = card; } catch (e) {}
}

function clarityNoteDailyCard() {
  var card = window._clarityDailyCard || {};
  if (typeof notesOpenDeedNote === 'function') {
    notesOpenDeedNote({
      title: 'Micro-lesson · ' + (card.title || 'Today'),
      tag: 'Practice',
      grave: false,
      pathLine: 'Daily micro-lesson',
      deed: (card.action || card.title || 'One action') + (card.en ? (' — ' + card.en) : '')
    });
  }
}
function clarityCompleteDaily() {
  var today = new Date().toISOString().slice(0,10);
  var last = clarityLSGet('clarity_daily_last', '');
  var streak = parseInt(clarityLSGet('clarity_daily_streak', '0'), 10) || 0;
  if (last !== today) {
    var yesterday = new Date(Date.now() - 86400000).toISOString().slice(0,10);
    streak = (last === yesterday) ? streak + 1 : 1;
    clarityLSSet('clarity_daily_last', today);
    clarityLSSet('clarity_daily_streak', String(streak));
  }
  var track = clarityActiveTrack();
  var prog = clarityGetPathProgress(track);
  prog.minutes = (prog.minutes || 0) + 5;
  claritySavePathProgress(track, prog);
  clarityRefreshDashboard();
  alert('Barakallahufeek — daily step logged. Streak: ' + streak);
}

function clarityQueueSR() {
  var title = (document.getElementById('dm-title') || {}).textContent || 'Daily item';
  var en = (document.getElementById('dm-en') || {}).textContent || '';
  var q = clarityLSJSON('clarity_sr_queue', []);
  q.push({ t: title, b: en, due: Date.now() + 86400000, created: Date.now() });
  if (q.length > 40) q = q.slice(-40);
  clarityLSSetJSON('clarity_sr_queue', q);
  clarityRefreshDashboard();
  alert('Saved for spaced review (due in ~24h on this device).');
}

/* old gate-hook IIFE removed — fortress handles commits */

window.clarityContinuePath = clarityContinuePath;
window.clarityShowPaths = clarityShowPaths;
window.clarityDailyLesson = clarityDailyLesson;
window.clarityCompleteDaily = clarityCompleteDaily;
window.clarityQueueSR = clarityQueueSR;
window.clarityOpenModule = clarityOpenModule;
window.clarityToggleModule = clarityToggleModule;
window.claritySwitchTrack = claritySwitchTrack;
window.clarityRefreshDashboard = clarityRefreshDashboard;

/* ===== GATE/PATH FORTRESS v2 — hard switch every time ===== */
function clarityCommitGate(gateType) {
  gateType = String(gateType || "seeker").trim();
  var allowed = { seeker:1, new_muslim:1, practicing:1, dai:1 };
  if (!allowed[gateType]) gateType = "seeker";
  var pathKey = gateType;

  try {
    localStorage.setItem("clarity_active_gate", gateType === "dai" ? "practicing" : gateType);
    localStorage.setItem("clarity_path_override", pathKey);
    localStorage.setItem("clarity_committed_path", pathKey);
    localStorage.setItem("clarity_last_gate_ts", String(Date.now()));
  } catch (e) {}

  try { document.documentElement.setAttribute("data-clarity-path", pathKey); } catch (e0) {}

  var overlay = document.getElementById("landing-gate-screen");
  var topNav = document.getElementById("clarity-global-nav");
  var workspace = document.getElementById("main-application-workspace");
  var los = document.getElementById("clarity-learn-os");
  var badge = document.getElementById("current-mode-badge");
  var trackLabel = document.getElementById("cd-track-label");

  if (overlay) {
    overlay.classList.add("hidden");
    overlay.style.setProperty("display", "none", "important");
    overlay.setAttribute("aria-hidden", "true");
  }
  if (topNav) {
    topNav.classList.remove("hidden");
    topNav.style.removeProperty("display");
  }
  if (workspace) {
    workspace.classList.remove("hidden");
    workspace.style.removeProperty("display");
  }
  if (los) {
    los.classList.remove("hidden");
    los.style.removeProperty("display");
  }

  var labels = {
    seeker: "Seeker Journey Mode",
    new_muslim: "New Muslim Track",
    practicing: "Daily Muslim / Legacy",
    dai: "Aspiring Da’i Track"
  };
  var pathTitles = {
    seeker: "Curious Seeker",
    new_muslim: "New Muslim 30-day starter",
    practicing: "Daily Muslim",
    dai: "Aspiring Da’i"
  };
  if (badge) badge.textContent = labels[pathKey] || "Core Matrix";
  if (trackLabel) trackLabel.textContent = pathTitles[pathKey] || pathKey;

  document.querySelectorAll(".gate-seeker-view, .gate-new-muslim-view, .gate-legacy-view").forEach(function(el) {
    el.classList.add("hidden");
  });
  var viewSel = pathKey === "seeker" ? ".gate-seeker-view" :
                pathKey === "new_muslim" ? ".gate-new-muslim-view" : ".gate-legacy-view";
  document.querySelectorAll(viewSel).forEach(function(el) { el.classList.remove("hidden"); });

  try { if (typeof clarityRefreshDashboard === "function") clarityRefreshDashboard(pathKey); } catch (e1) {}
  try { if (typeof clarityDailyLesson === "function") clarityDailyLesson(false); } catch (e2) {}
  try {
    if (typeof clarityRenderPaths === "function") clarityRenderPaths(pathKey);
    var board = document.getElementById("path-board");
    if (board) board.hidden = true;
  } catch (e3) {}
}

function selectAppGate(gateType) { clarityCommitGate(gateType); }
function applyGateConfiguration(gate) { clarityCommitGate(gate); }

function resetToGateView() {
  try {
    localStorage.removeItem("clarity_active_gate");
    localStorage.removeItem("clarity_path_override");
    localStorage.removeItem("clarity_committed_path");
    localStorage.removeItem("clarity_last_gate_ts");
  } catch (e) {}
  try { document.documentElement.removeAttribute("data-clarity-path"); } catch (e0) {}
  var overlay = document.getElementById("landing-gate-screen");
  var topNav = document.getElementById("clarity-global-nav");
  var workspace = document.getElementById("main-application-workspace");
  var los = document.getElementById("clarity-learn-os");
  if (overlay) {
    overlay.classList.remove("hidden");
    overlay.style.setProperty("display", "flex", "important");
    overlay.style.setProperty("align-items", "center", "important");
    overlay.style.setProperty("justify-content", "center", "important");
    overlay.setAttribute("aria-hidden", "false");
  }
  if (topNav) topNav.classList.add("hidden");
  if (workspace) workspace.classList.add("hidden");
  if (los) los.classList.add("hidden");
  var badge = document.getElementById("current-mode-badge");
  if (badge) badge.textContent = "Core Matrix";
}

function clarityActiveTrack() {
  try {
    var committed = localStorage.getItem("clarity_committed_path");
    if (committed && typeof CLARITY_PATHS !== "undefined" && CLARITY_PATHS[committed]) return committed;
    var o = localStorage.getItem("clarity_path_override");
    if (o && typeof CLARITY_PATHS !== "undefined" && CLARITY_PATHS[o]) return o;
    var g = localStorage.getItem("clarity_active_gate") || "seeker";
    if (typeof CLARITY_PATHS !== "undefined" && CLARITY_PATHS[g]) return g;
  } catch (e) {}
  return "seeker";
}

function claritySwitchTrack(key) {
  if (typeof CLARITY_PATHS === "undefined" || !CLARITY_PATHS[key]) return;
  clarityCommitGate(key);
  try {
    clarityRenderPaths(key);
    var board = document.getElementById("path-board");
    if (board) board.hidden = false;
  } catch (e) {}
}

function initClarityOnboarding() {
  var cached = null;
  try { cached = localStorage.getItem("clarity_committed_path") || localStorage.getItem("clarity_active_gate"); } catch (e) {}
  if (cached) clarityCommitGate(cached);
  try { if (typeof initializeShariaQuiz === "function") initializeShariaQuiz(); } catch (e2) {}
}

function clarityAcceptOathIntent() {
  try {
    localStorage.setItem("clarity_oath_intent", new Date().toISOString());
    localStorage.setItem("clarity_oath_done_v1", "1");
  } catch (e) {}
  var s = document.getElementById("oath-status");
  if (s) s.textContent = "Intention noted on this device only.";
  var strip = document.getElementById("clarity-oath-strip");
  var det = document.getElementById("oath-details");
  var sum = document.getElementById("oath-summary");
  if (strip) strip.classList.add("oath-done");
  if (det) det.open = false;
  if (sum) sum.textContent = "Optional oath · saved on this device ✓";
}
function clarityBootOathCollapse() {
  var done = false;
  try { done = localStorage.getItem("clarity_oath_done_v1") === "1" || !!localStorage.getItem("clarity_oath_intent"); } catch (e) {}
  if (!done) return;
  var strip = document.getElementById("clarity-oath-strip");
  var det = document.getElementById("oath-details");
  var sum = document.getElementById("oath-summary");
  if (strip) strip.classList.add("oath-done");
  if (det) det.open = false;
  if (sum) sum.textContent = "Optional oath · saved on this device ✓";
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", clarityBootOathCollapse);
else setTimeout(clarityBootOathCollapse, 30);

/* Patch dashboard/paths to honor forced track argument */
(function() {
  var _rd = window.clarityRefreshDashboard;
  window.clarityRefreshDashboard = function(forceTrack) {
    if (forceTrack) {
      try { localStorage.setItem("clarity_committed_path", forceTrack); localStorage.setItem("clarity_path_override", forceTrack); } catch (e) {}
    }
    var track = forceTrack || (typeof clarityActiveTrack === "function" ? clarityActiveTrack() : "seeker");
    var path = (typeof CLARITY_PATHS !== "undefined" && CLARITY_PATHS[track]) ? CLARITY_PATHS[track] : null;
    var label = document.getElementById("cd-track-label");
    if (label && path) label.textContent = path.label;
    if (typeof _rd === "function") {
      try { _rd(); } catch (e2) {}
    }
    /* re-apply label after _rd in case it overwrote */
    if (label && path) label.textContent = path.label;
    var streak = 0;
    try { streak = parseInt(localStorage.getItem("clarity_daily_streak") || "0", 10) || 0; } catch (e3) {}
    var el;
    if ((el = document.getElementById("cd-streak"))) el.textContent = String(streak);
    try {
      var progKey = "clarity_path_prog_" + track;
      var prog = JSON.parse(localStorage.getItem(progKey) || "{\"done\":[],\"minutes\":0}");
      if ((el = document.getElementById("cd-modules"))) el.textContent = String((prog.done || []).length);
      if ((el = document.getElementById("cd-minutes"))) el.textContent = String(prog.minutes || 0);
    } catch (e4) {}
  };

  var _rp = window.clarityRenderPaths;
  window.clarityRenderPaths = function(forceTrack) {
    if (typeof _rp === "function") {
      try { _rp(); } catch (e) {}
    }
    var track = forceTrack || (typeof clarityActiveTrack === "function" ? clarityActiveTrack() : "seeker");
    document.querySelectorAll(".path-card").forEach(function(card) {
      var t = card.getAttribute("data-track");
      if (t === track) card.classList.add("is-active");
      else card.classList.remove("is-active");
      var h = card.querySelector("h3");
      if (h) {
        var base = h.textContent.replace(/\s*·\s*active\s*$/i, "");
        h.textContent = (t === track) ? (base + " · active") : base;
      }
    });
  };
})();

window.clarityCommitGate = clarityCommitGate;
window.selectAppGate = selectAppGate;
window.applyGateConfiguration = applyGateConfiguration;
window.resetToGateView = resetToGateView;
window.clarityActiveTrack = clarityActiveTrack;
window.claritySwitchTrack = claritySwitchTrack;
window.initClarityOnboarding = initClarityOnboarding;
window.clarityAcceptOathIntent = clarityAcceptOathIntent;

try {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      try { initClarityOnboarding(); } catch (e) {}
    });
  } else {
    setTimeout(function() { try { initClarityOnboarding(); } catch (e) {} }, 50);
  }
} catch (eBoot) {}

/* ===== Door-rail: vertical tabs → section under banner; collapse → path door ===== */
function clarityShowDoorRail(show) {
  var rail = document.getElementById("clarity-door-rail");
  if (!rail) return;
  if (show) {
    rail.classList.remove("rail-hidden");
    try { document.documentElement.classList.add("door-rail-on"); } catch (e) {}
  } else {
    rail.classList.add("rail-hidden");
    try { document.documentElement.classList.remove("door-rail-on"); } catch (e) {}
  }
}

function clarityOpenSectionDoor(tabId) {
  tabId = String(tabId || "journey");
  try { document.documentElement.setAttribute("data-section-mode", "1"); } catch (e) {}
  try { document.body.classList.add("section-open"); } catch (e2) {}
  /* Keep path UI available but de-emphasize boards */
  var board = document.getElementById("path-board");
  if (board) board.hidden = true;
  clarityShowDoorRail(true);
  document.querySelectorAll("#clarity-door-rail .door-rail-btn[data-rail-tab]").forEach(function(btn) {
    btn.classList.toggle("active", btn.getAttribute("data-rail-tab") === tabId);
  });
  var mainBtn = document.getElementById("door-rail-main-view");
  if (mainBtn) mainBtn.classList.remove("active");
  document.querySelectorAll(".tab-panel").forEach(function(p) {
    try { p.style.removeProperty("display"); } catch (e0) {}
  });
  if (typeof switchTab === "function") {
    try { switchTab(tabId, { fromDoorRail: true }); } catch (e3) { try { switchTab(tabId); } catch (e4) {} }
  }
  var panel = document.getElementById("tab-" + tabId);
  if (panel) {
    panel.classList.add("active");
    try { panel.style.removeProperty("display"); } catch (e5) {}
  }
  /* Scroll to main content below banner */
  setTimeout(function() {
    var target = document.getElementById("main-content") || document.getElementById("tab-" + tabId);
    if (target && target.scrollIntoView) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 60);
}

/* Main view chip — restore primary door viewport (Today / Learn paths / Prepare) */
function clarityCollapseToPathDoor() {
  try { document.documentElement.setAttribute("data-section-mode", "0"); } catch (e) {}
  try { document.body.classList.remove("section-open"); } catch (e2) {}
  document.querySelectorAll(".tab-panel").forEach(function(p) {
    p.classList.remove("active");
    try { p.style.display = "none"; } catch (e3) {}
  });
  document.querySelectorAll("#clarity-door-rail .door-rail-btn[data-rail-tab]").forEach(function(btn) {
    btn.classList.remove("active");
  });
  var mainBtn = document.getElementById("door-rail-main-view");
  if (mainBtn) mainBtn.classList.add("active");

  var los = document.getElementById("clarity-learn-os");
  if (los) {
    los.classList.remove("hidden");
    try { los.style.removeProperty("display"); } catch (e4) {}
  }
  var door = null;
  try { door = localStorage.getItem("clarity_primary_door"); } catch (e5) {}
  if (door === "today") {
    try { if (typeof clarityShowToday === "function") clarityShowToday(true); } catch (e6) {}
  } else {
    try { if (typeof clarityShowToday === "function") clarityShowToday(false); } catch (e6b) {}
  }
  if (door === "prepare") {
    try { if (typeof clarityRenderPrimaryPathDays === "function") clarityRenderPrimaryPathDays("legacy7"); } catch (e7) {}
  } else if (door === "learn") {
    try {
      var pid = localStorage.getItem("clarity_active_primary_path") || "heart_grave";
      if (typeof clarityRenderPrimaryPathDays === "function") clarityRenderPrimaryPathDays(pid);
    } catch (e8) {}
  } else {
    try {
      if (typeof clarityRefreshDashboard === "function") clarityRefreshDashboard();
      if (typeof clarityRenderPaths === "function") clarityRenderPaths();
      var board = document.getElementById("path-board");
      if (board) board.hidden = false;
    } catch (e9) {}
  }
  clarityShowDoorRail(true);
  /* Always bring viewport to banner (main menu home) */
  var banner = document.querySelector(".banner") || document.getElementById("clarity-global-nav");
  if (banner && banner.scrollIntoView) {
    try { banner.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (eScroll) {
      try { banner.scrollIntoView(true); } catch (e2) {}
    }
  } else {
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e3) { window.scrollTo(0, 0); }
  }
  /* After scroll, if Today is active keep surface in view under banner */
  setTimeout(function() {
    var door = null;
    try { door = localStorage.getItem("clarity_primary_door"); } catch (eD) {}
    if (door === "today") {
      var ts = document.getElementById("clarity-today-surface");
      if (ts && ts.scrollIntoView) try { ts.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e4) {}
    }
  }, 320);
}
window.clarityCollapseToPathDoor = clarityCollapseToPathDoor;

/* When gate commits, show rail; start in path-door mode (no section forced) */
(function() {
  var prevCommit = window.clarityCommitGate;
  window.clarityCommitGate = function(gateType) {
    if (typeof prevCommit === "function") prevCommit(gateType);
    try { document.documentElement.setAttribute("data-section-mode", "0"); } catch (e) {}
    try { document.body.classList.remove("section-open"); } catch (e2) {}
    clarityShowDoorRail(true);
    /* panels closed until a door is chosen */
    document.querySelectorAll(".tab-panel").forEach(function(p) {
      p.classList.remove("active");
    });
    try {
      if (typeof clarityRenderPaths === "function") clarityRenderPaths();
      var board = document.getElementById("path-board");
      if (board) board.hidden = false;
    } catch (e3) {}
  };
  var prevReset = window.resetToGateView;
  window.resetToGateView = function() {
    if (typeof prevReset === "function") prevReset();
    clarityShowDoorRail(false);
    try { document.documentElement.setAttribute("data-section-mode", "0"); } catch (e) {}
    try { document.body.classList.remove("section-open"); } catch (e2) {}
  };
})();

window.clarityOpenSectionDoor = clarityOpenSectionDoor;
window.clarityCollapseToPathDoor = clarityCollapseToPathDoor;
window.clarityShowDoorRail = clarityShowDoorRail;

/* ===== Dawah objective OS: three doors, paths, Today, Lab, legacy pack ===== */
var CLARITY_PRIMARY_PATHS = {
  heart_grave: {
    id: 'heart_grave', label: 'Heart & grave', days: 14, door: 'learn',
    blurb: 'Deposits, commands, character, one action a day',
    list: [
      'Day 1: Remember death with hope — one istighfar with presence',
      'Day 2: Bismillah before tasks — reset intention',
      'Day 3: Guard one salah from its start',
      'Day 4: Tongue: speak good or silence',
      'Day 5: Salawat 10× with love',
      'Day 6: Charity or help as light ahead',
      'Day 7: Parents / elders — one kindness',
      'Day 8: Qur’an page slowly (tajweed awareness)',
      'Day 9: Command verse — act on one line',
      'Day 10: Leave one minor sin for Allah',
      'Day 11: Ghazālī-style: watch the heart in speech',
      'Day 12: Ibn al-Qayyim-style: pair fear with hope',
      'Day 13: Write one grave-bound deed intention',
      'Day 14: Weekly review + renew streak'
    ]
  },
  seerah30: {
    id: 'seerah30', label: 'Seerah — 30 sittings', days: 30, door: 'learn',
    blurb: 'Timeline moments + capture one lesson',
    list: (function(){
      var a=[]; for(var i=1;i<=30;i++) a.push('Sitting '+i+': open Seerah tab — read the live moment, capture one lesson in Notes');
      return a;
    })()
  },
  legacy7: {
    id: 'legacy7', label: 'Prepare for death — 7 days', days: 7, door: 'prepare',
    blurb: 'Debts, tree, farāʾiḍ, wasiyyah, janazah, ṣadaqah jāriyah',
    list: [
      'Day 1: Remember death — write what you want people to forgive you for',
      'Day 2: List debts and trusts (financial and interpersonal)',
      'Day 3: Sketch family tree (heirs awareness)',
      'Day 4: Study farāʾiḍ outline on Quran.com / IslamQA — not a fatwa for your case',
      'Day 5: Draft wasiyyah notes (≤⅓ optional bequest; executor ideas)',
      'Day 6: Janazah / ghusl awareness — who to call, local masjid',
      'Day 7: Ṣadaqah jāriyah idea + Print Family Legacy Pack'
    ]
  }
};

function clarityPickPrimaryDoor(door) {
  try {
    localStorage.setItem('clarity_primary_door', door);
    localStorage.setItem('clarity_primary_door_ts', String(Date.now()));
  } catch (e) {}
  var td = document.getElementById('clarity-three-doors');
  if (td) { td.classList.add('hidden'); td.style.display = 'none'; }

  if (door === 'today') {
    clarityCommitGate('practicing');
    try { localStorage.setItem('clarity_committed_path', 'practicing'); } catch (e) {}
    clarityShowToday(true);
    clarityShowDoorRail(true);
    try { document.documentElement.setAttribute('data-section-mode', '0'); } catch (e2) {}
    return;
  }
  if (door === 'learn') {
    clarityCommitGate('seeker');
    clarityShowToday(false);
    clarityShowDoorRail(true);
    try {
      if (typeof clarityRenderPaths === 'function') clarityRenderPaths();
      var board = document.getElementById('path-board');
      if (board) board.hidden = false;
    } catch (e3) {}
    clarityRenderPrimaryPathDays('heart_grave');
    return;
  }
  if (door === 'prepare') {
    clarityCommitGate('practicing');
    try { localStorage.setItem('clarity_path_override', 'legacy7'); localStorage.setItem('clarity_committed_path', 'legacy7'); } catch (e4) {}
    clarityShowToday(false);
    clarityShowDoorRail(true);
    clarityRenderPrimaryPathDays('legacy7');
    try { if (typeof clarityOpenSectionDoor === 'function') { /* stay on path first */ } } catch (e5) {}
    return;
  }
}

function clarityShowToday(show) {
  var el = document.getElementById('clarity-today-surface');
  if (!el) return;
  if (show) {
    el.classList.remove('hidden');
    clarityRefreshTodaySurface();
  } else el.classList.add('hidden');
}

/* clarityRefreshTodaySurface + clarityNoteTodayDeed: canonical definitions later in file (solid OS) */

function clarityPrimaryProg(id) {
  try {
    return JSON.parse(localStorage.getItem('clarity_primary_prog_' + id) || '{"done":[],"streak":0}');
  } catch (e) { return { done: [], streak: 0 }; }
}
function claritySavePrimaryProg(id, prog) {
  try { localStorage.setItem('clarity_primary_prog_' + id, JSON.stringify(prog)); } catch (e) {}
}

function clarityRenderPrimaryPathDays(pathId) {
  var path = CLARITY_PRIMARY_PATHS[pathId];
  if (!path) return;
  try { localStorage.setItem('clarity_active_primary_path', pathId); } catch (e) {}
  var board = document.getElementById('path-board');
  if (!board) return;
  var prog = clarityPrimaryProg(pathId);
  var doneMap = {};
  (prog.done || []).forEach(function(i){ doneMap[i] = true; });
  var html = '<div class="path-card is-active" style="grid-column:1/-1">';
  html += '<h3>' + path.label + '</h3>';
  html += '<div class="path-meta">' + path.blurb + ' · ' + (prog.done||[]).length + '/' + path.days + ' days · streak ' + (prog.streak||0) + '</div>';
  html += '<div class="cred-stamp">Reviewed for educational accuracy: Clarity editorial pass · verify primary texts on Quran.com / Sunnah.com · Sep 2026 · not a fatwa.</div>';
  html += '<ul class="path-day-list">';
  path.list.forEach(function(line, i) {
    html += '<li class="' + (doneMap[i] ? 'done' : '') + '">';
    html += '<input type="checkbox" ' + (doneMap[i]?'checked':'') + ' onchange="clarityTogglePrimaryDay(\'' + pathId + '\',' + i + ')" />';
    html += '<span style="flex:1">' + line + '</span></li>';
  });
  html += '</ul>';
  if (pathId === 'legacy7') {
    html += '<button type="button" class="btn" style="margin-top:.75rem" onclick="clarityPrintLegacyPack()">🖨 Print Family Legacy Pack</button>';
  }
  html += '<p style="font-size:.8rem;margin-top:.65rem"><a href="https://sunnah.com" target="_blank" rel="noopener">Verify on Sunnah.com</a> · <a href="https://quran.com" target="_blank" rel="noopener">Quran.com</a></p>';
  html += '</div>';
  /* also offer path switcher */
  html += '<div class="path-card"><h3>Other first-class paths</h3><div class="path-meta">Switch focus</div>';
  Object.keys(CLARITY_PRIMARY_PATHS).forEach(function(k) {
    if (k === pathId) return;
    html += '<button type="button" class="btn-soft" style="margin:.25rem" onclick="clarityRenderPrimaryPathDays(\''+k+'\')">' + CLARITY_PRIMARY_PATHS[k].label + '</button>';
  });
  html += '</div>';
  board.innerHTML = html;
  board.hidden = false;
}

function clarityTogglePrimaryDay(pathId, dayIdx) {
  var path = CLARITY_PRIMARY_PATHS[pathId];
  if (!path) return;
  var prog = clarityPrimaryProg(pathId);
  var done = prog.done || [];
  var at = done.indexOf(dayIdx);
  if (at >= 0) done.splice(at, 1);
  else {
    done.push(dayIdx);
    /* streak only when sequential next day completed */
    var expect = done.length - 1; /* simplistic: count completions */
    prog.streak = (prog.streak || 0);
    if (dayIdx === (prog.lastDay == null ? 0 : prog.lastDay + 1) || (prog.lastDay == null && dayIdx === 0)) {
      prog.streak = (prog.streak || 0) + 1;
      prog.lastDay = dayIdx;
    } else {
      prog.lastDay = dayIdx;
    }
    try {
      var today = new Date().toISOString().slice(0,10);
      localStorage.setItem('clarity_daily_last', today);
      var st = parseInt(localStorage.getItem('clarity_daily_streak')||'0',10)||0;
      localStorage.setItem('clarity_daily_streak', String(st + 1));
    } catch (e) {}
  }
  prog.done = done;
  claritySavePrimaryProg(pathId, prog);
  clarityRenderPrimaryPathDays(pathId);
  clarityRefreshTodaySurface();
}

function clarityNotePathDay(pathId, dayIdx) {
  var path = CLARITY_PRIMARY_PATHS[pathId];
  if (!path) return;
  var line = (path.list && path.list[dayIdx]) || 'One sincere action';
  if (typeof notesOpenDeedNote === 'function') {
    notesOpenDeedNote({
      title: path.label + ' · Day ' + (dayIdx + 1),
      tag: pathId === 'legacy7' ? 'Grave' : 'Practice',
      grave: pathId === 'legacy7' || pathId === 'heart_grave',
      pathLine: path.label + ' · Day ' + (dayIdx + 1) + ' of ' + path.days,
      deed: line
    });
  }
}

function clarityTodayMarkDeed() {
  try {
    var today = new Date().toISOString().slice(0,10);
    var last = localStorage.getItem('clarity_daily_last') || '';
    var st = parseInt(localStorage.getItem('clarity_daily_streak')||'0',10)||0;
    if (last !== today) {
      var y = new Date(Date.now()-864e5).toISOString().slice(0,10);
      st = (last === y) ? st + 1 : 1;
      localStorage.setItem('clarity_daily_last', today);
      localStorage.setItem('clarity_daily_streak', String(st));
    }
  } catch (e) {}
  clarityRefreshTodaySurface();
  alert('Deed logged on this device. Streak updated.');
}

function clarityToggleLab() {
  try { document.documentElement.classList.toggle("show-lab"); } catch (e) {}
  var on = false;
  try { on = document.documentElement.classList.contains("show-lab"); } catch (e2) {}
  var labBtn = document.querySelector(".door-rail-lab");
  if (labBtn) {
    labBtn.classList.toggle("active", on);
    labBtn.title = on ? "Lab on — experimental tools visible" : "Lab off — core paths primary";
  }
  /* no alert — silent */
  try {
    if (on && typeof clarityOpenSectionDoor === "function") {
      /* stay put; user can open All tools */
    }
  } catch (e3) {}
}

function clarityPrintLegacyPack() {
  var w = window.open('', '_blank');
  if (!w) { alert('Allow pop-ups to print the legacy pack.'); return; }
  var doc = w.document;
  doc.open();
  var parts = [];
  parts.push('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Family Legacy Pack</title>');
  parts.push('<style type="text/css">');
  parts.push('body{font-family:Georgia,serif;max-width:720px;margin:1.5rem auto;padding:0 1rem;line-height:1.5;color:#1a1a1a}');
  parts.push('h1,h2{color:#0d4f3a}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:.4rem;text-align:left}');
  parts.push('.disclaimer{font-size:.85rem;border:1px solid #c9a06a;padding:.75rem;margin:1rem 0;background:#fff8f0}');
  parts.push('<' + '/style></head><body>');
  parts.push('<h1>Family Legacy Pack</h1>');
  parts.push('<p><em>Clarity educational outline only. Not a fatwa or formal will.</em></p>');
  parts.push('<div class="disclaimer"><strong>Disclaimer:</strong> Educational only. Sep 2026.</div>');
  parts.push('<h2>1. Remember death</h2><p>Notes: _______________________________</p>');
  parts.push('<h2>2. Debts and trusts</h2><table><tr><th>Item</th><th>To whom</th><th>Detail</th></tr><tr><td></td><td></td><td></td></tr></table>');
  parts.push('<h2>3. Executor</h2><p>Name: _____________ Contact: _____________</p>');
  parts.push('<h2>4. Optional wasiyyah (max one-third)</h2><p>Ideas: _______________________________</p>');
  parts.push('<h2>5. Funeral wishes</h2><p>Masjid / contact: _____________</p>');
  parts.push('<h2>6. Heir study (learning only)</h2><table><tr><th>Relative</th><th>Alive</th><th>Note</th></tr><tr><td>Spouse</td><td></td><td></td></tr></table>');
  parts.push('<h2>7. Sadaqah jariyah</h2><p>Idea: _______________________________</p>');
  parts.push('<p style="margin-top:2rem;font-size:.8rem">Generated by Clarity (clarity-dawah.fyi)</p>');
  parts.push('<' + '/body><' + '/html>');
  doc.write(parts.join(''));
  doc.close();
  try { w.focus(); w.print(); } catch (e) {}
}

function clarityCollapseToPathDoor() {
  try { document.documentElement.setAttribute("data-section-mode", "0"); } catch (e) {}
  try { document.body.classList.remove("section-open"); } catch (e2) {}
  document.querySelectorAll(".tab-panel").forEach(function(p) {
    p.classList.remove("active");
    try { p.style.display = "none"; } catch (e3) {}
  });
  document.querySelectorAll("#clarity-door-rail .door-rail-btn[data-rail-tab]").forEach(function(btn) {
    btn.classList.remove("active");
  });
  var mainBtn = document.getElementById("door-rail-main-view");
  if (mainBtn) mainBtn.classList.add("active");

  var los = document.getElementById("clarity-learn-os");
  if (los) {
    los.classList.remove("hidden");
    try { los.style.removeProperty("display"); } catch (e4) {}
  }
  var door = null;
  try { door = localStorage.getItem("clarity_primary_door"); } catch (e5) {}
  if (door === "today") {
    try { if (typeof clarityShowToday === "function") clarityShowToday(true); } catch (e6) {}
  } else {
    try { if (typeof clarityShowToday === "function") clarityShowToday(false); } catch (e6b) {}
  }
  if (door === "prepare") {
    try { if (typeof clarityRenderPrimaryPathDays === "function") clarityRenderPrimaryPathDays("legacy7"); } catch (e7) {}
  } else if (door === "learn") {
    try {
      var pid = localStorage.getItem("clarity_active_primary_path") || "heart_grave";
      if (typeof clarityRenderPrimaryPathDays === "function") clarityRenderPrimaryPathDays(pid);
    } catch (e8) {}
  } else {
    try {
      if (typeof clarityRefreshDashboard === "function") clarityRefreshDashboard();
      if (typeof clarityRenderPaths === "function") clarityRenderPaths();
      var board = document.getElementById("path-board");
      if (board) board.hidden = false;
    } catch (e9) {}
  }
  clarityShowDoorRail(true);

  /* Hard scroll: banner fully into view */
  function scrollToBanner() {
    var banner = document.querySelector("#main-application-workspace .banner")
      || document.querySelector(".banner")
      || document.getElementById("clarity-global-nav")
      || document.getElementById("main-application-workspace");
    if (!banner) {
      try { window.scrollTo(0, 0); } catch (e) {}
      return;
    }
    try {
      var top = banner.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop || 0);
      var offset = 8;
      window.scrollTo({ top: Math.max(0, top - offset), behavior: "smooth" });
    } catch (e2) {
      try { banner.scrollIntoView(true); } catch (e3) { window.scrollTo(0, 0); }
    }
  }
  scrollToBanner();
  setTimeout(scrollToBanner, 50);
  setTimeout(scrollToBanner, 200);
  setTimeout(scrollToBanner, 400);
}
window.clarityCollapseToPathDoor = clarityCollapseToPathDoor;

(function(){
  var _reset = window.resetToGateView;
  window.resetToGateView = function() {
    if (typeof _reset === "function") _reset();
    var overlay = document.getElementById("landing-gate-screen");
    if (overlay) {
      overlay.classList.remove("hidden");
      overlay.style.setProperty("display", "flex", "important");
      overlay.style.setProperty("align-items", "center", "important");
      overlay.style.setProperty("justify-content", "center", "important");
      overlay.style.setProperty("padding", "0.75rem", "important");
      overlay.setAttribute("aria-hidden", "false");
    }
    var rail = document.getElementById("clarity-door-rail");
    if (rail) rail.classList.add("rail-hidden");
    try { document.documentElement.classList.remove("door-rail-on"); } catch (e) {}
  };
})();

/* ===== Unified welcome portal (no duplicate doors/gate full-page) ===== */
function clarityWelcomePick(door) {
  try {
    localStorage.setItem("clarity_primary_door", door);
    localStorage.setItem("clarity_welcome_seen", "1");
  } catch (e) {}
  var w = document.getElementById("clarity-welcome");
  if (w) {
    w.classList.remove("show");
    w.setAttribute("aria-hidden", "true");
  }
  var td = document.getElementById("clarity-three-doors");
  if (td) { td.classList.add("hidden"); td.style.display = "none"; }
  var gate = document.getElementById("landing-gate-screen");
  if (gate) { gate.classList.add("hidden"); gate.style.display = "none"; }
  if (typeof clarityPickPrimaryDoor === "function") {
    clarityPickPrimaryDoor(door);
  } else if (typeof clarityCommitGate === "function") {
    clarityCommitGate(door === "learn" ? "seeker" : "practicing");
  }
  if (typeof clarityFinishWelcome === "function") {
    try { clarityFinishWelcome(true); } catch (e2) {}
  }
}

function claritySetThemeMode(mode) {
  mode = mode || "system";
  try { localStorage.setItem("clarity_theme_mode", mode); } catch (e) {}
  var root = document.documentElement;
  var resolved = mode;
  if (mode === "system") {
    try {
      resolved = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch (e2) { resolved = "light"; }
  }
  root.setAttribute("data-theme", resolved);
  document.querySelectorAll("[data-theme-chip]").forEach(function(btn) {
    btn.classList.toggle("active", btn.getAttribute("data-theme-chip") === mode);
  });
}

function clarityOpenWelcomePortal() {
  var w = document.getElementById("clarity-welcome");
  if (w) {
    w.classList.add("show");
    w.setAttribute("aria-hidden", "false");
  }
  var gate = document.getElementById("landing-gate-screen");
  if (gate) { gate.classList.add("hidden"); gate.style.display = "none"; }
  var td = document.getElementById("clarity-three-doors");
  if (td) { td.classList.add("hidden"); td.style.display = "none"; }
  try { if (typeof clarityShowDoorRail === "function") clarityShowDoorRail(false); } catch (e) {}
}

/* Switch Gate Mode → welcome card portal (not full-page gate) */
(function() {
  var _reset = window.resetToGateView;
  window.resetToGateView = function() {
    try {
      localStorage.removeItem("clarity_primary_door");
    } catch (e) {}
    if (typeof _reset === "function") {
      try { _reset(); } catch (e2) {}
    }
    var gate = document.getElementById("landing-gate-screen");
    if (gate) { gate.classList.add("hidden"); gate.style.display = "none"; }
    var workspace = document.getElementById("main-application-workspace");
    if (workspace) { workspace.classList.remove("hidden"); }
    clarityOpenWelcomePortal();
  };
})();

/* Boot: only welcome card; never three-doors or full gate */
(function() {
  function bootPortal() {
    var td = document.getElementById("clarity-three-doors");
    if (td) { td.classList.add("hidden"); td.style.display = "none"; }
    var gate = document.getElementById("landing-gate-screen");
    if (gate) { gate.classList.add("hidden"); gate.style.display = "none"; }
    var door = null, seen = null, path = null, name = null;
    try { door = localStorage.getItem("clarity_primary_door"); } catch (e) {}
    try { seen = localStorage.getItem("clarity_welcome_seen") || localStorage.getItem("clarity_welcome_seen_v2"); } catch (e2) {}
    try { path = localStorage.getItem("clarity_path_override") || localStorage.getItem("clarity_committed_path"); } catch (e2b) {}
    try { name = localStorage.getItem("clarity_name"); } catch (e2c) {}
    var returning = !!(door || seen || path || name);
    var w = document.getElementById("clarity-welcome");
    if (returning) {
      if (w) { w.classList.remove("show"); w.setAttribute("aria-hidden", "true"); }
      try { if (typeof clarityMarkWelcomeSeen === "function") clarityMarkWelcomeSeen(); } catch (eM) {}
      if (door && typeof clarityPickPrimaryDoor === "function") {
        try { clarityPickPrimaryDoor(door); } catch (e3) {}
      }
    } else {
      /* first visit: First-visit IIFE / Landing OS will show once — do not double-open */
      if (w) { w.classList.remove("show"); w.setAttribute("aria-hidden", "true"); }
    }
    var mode = "system";
    try { mode = localStorage.getItem("clarity_theme_mode") || "system"; } catch (e4) {}
    claritySetThemeMode(mode);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(bootPortal, 40); });
  else setTimeout(bootPortal, 40);
})();

window.clarityWelcomePick = clarityWelcomePick;
window.claritySetThemeMode = claritySetThemeMode;
window.clarityOpenWelcomePortal = clarityOpenWelcomePortal;

/* Today plaque + growth tree + deed dedupe + notes links */
(function(){
  function el(id){ return document.getElementById(id); }
  window.saveProfile = function(){
    var input = el("username") || el("username-legacy-hidden");
    var name = input ? String(input.value || "").trim() : "";
    if(!name){ alert("Please enter a name."); return; }
    try {
      if(window.clarityLS && clarityLS.setItem) clarityLS.setItem("clarity_name", name);
      else localStorage.setItem("clarity_name", name);
    } catch(e) {}
    if(typeof showWelcome === "function") showWelcome();
    try { clarityUpdateGrowthTree(); } catch(e2) {}
  };
  window.showWelcome = function(){
    var name = "";
    try {
      name = (window.clarityLS && clarityLS.getItem) ? (clarityLS.getItem("clarity_name") || "") : (localStorage.getItem("clarity_name") || "");
    } catch(e) {}
    var pi = el("today-profile-input") || el("profile-input") || el("profile-input-legacy");
    var wa = el("today-welcome-area") || el("welcome-area") || el("welcome-area-legacy");
    var wt = el("welcome-text");
    if(!name){
      if(pi) pi.style.display = "";
      if(wa) wa.style.display = "none";
      return;
    }
    if(pi) pi.style.display = "none";
    if(wa) wa.style.display = "block";
    if(wt) wt.textContent = "Assalamu Alaikum, " + name;
    var streak = 0, lessons = 0;
    try {
      streak = parseInt(localStorage.getItem("clarity_daily_streak") || "0", 10) || 0;
      lessons = parseInt(localStorage.getItem("clarity_lessons") || localStorage.getItem("clarity_quiz_score") || "0", 10) || 0;
    } catch(e3) {}
    var sd = el("streak-display"); if(sd) sd.textContent = "Streak: " + streak + " days";
    var ld = el("lessons-display"); if(ld) ld.textContent = "Lessons: " + lessons;
    try { clarityUpdateGrowthTree(); } catch(e4) {}
  };
  window.resetName = function(){
    try {
      if(window.clarityLS && clarityLS.removeItem) clarityLS.removeItem("clarity_name");
      else localStorage.removeItem("clarity_name");
    } catch(e) {}
    var pi = el("today-profile-input"); var wa = el("today-welcome-area");
    if(pi) pi.style.display = "";
    if(wa) wa.style.display = "none";
    var input = el("username"); if(input) input.value = "";
  };
})();
function clarityDeedCount(){
  var n = 0;
  try {
    n = parseInt(localStorage.getItem("clarity_daily_streak") || "0", 10) || 0;
    Object.keys(localStorage).forEach(function(k){
      if(k.indexOf("clarity_primary_prog_") === 0){
        try {
          var p = JSON.parse(localStorage.getItem(k) || "{}");
          if(p.done && p.done.length) n += p.done.length;
        } catch(e) {}
      }
    });
  } catch(e2) {}
  return n;
}
function clarityUpdateGrowthTree(){ return; /* growth-tree gamification removed */
  var n = clarityDeedCount();
  var seed = document.getElementById("dgt-seed");
  var sprout = document.getElementById("dgt-sprout");
  var sapling = document.getElementById("dgt-sapling");
  var tree = document.getElementById("dgt-tree");
  var cap = document.getElementById("dgt-caption");
  [seed, sprout, sapling, tree].forEach(function(g){ if(g) g.setAttribute("opacity", "0"); });
  var stage = n >= 12 ? "tree" : n >= 5 ? "sapling" : n >= 1 ? "sprout" : "seed";
  var map = { seed: seed, sprout: sprout, sapling: sapling, tree: tree };
  if(map[stage]) map[stage].setAttribute("opacity", "1");
  var name = "";
  try {
    name = (window.clarityLS && clarityLS.getItem) ? (clarityLS.getItem("clarity_name") || "") : (localStorage.getItem("clarity_name") || "");
  } catch(e) {}
  var shortName = name ? name.slice(0, 12) : "";
  var tn = document.getElementById("dgt-trunk-name");
  var tnn = document.getElementById("dgt-tree-name");
  if(tn) tn.textContent = shortName || ".";
  if(tnn) tnn.textContent = shortName || ".";
  if(cap){
    cap.textContent = stage === "seed" ? "Plant a deed" :
      stage === "sprout" ? ("A sprout of light (" + n + ")") :
      stage === "sapling" ? ("Growing — " + (shortName || "your deeds")) :
      ("Rooted in deeds (" + n + ")");
  }
}
window.clarityUpdateGrowthTree = clarityUpdateGrowthTree;
function clarityRefreshTodaySurface() {
  var streak = 0;
  try { streak = parseInt(localStorage.getItem("clarity_daily_streak") || "0", 10) || 0; } catch (e) {}
  var sp = document.getElementById("today-streak-pill");
  if (sp) sp.textContent = "Streak " + streak;
  var pathKey = "heart_grave";
  try {
    pathKey = localStorage.getItem("clarity_active_primary_path") ||
      localStorage.getItem("clarity_committed_path") ||
      localStorage.getItem("clarity_primary_door") || "heart_grave";
  } catch (e2) {}
  if (pathKey === "today" || pathKey === "practicing") pathKey = "legacy7";
  if (pathKey === "learn" || pathKey === "seeker") pathKey = "heart_grave";
  if (pathKey === "prepare") pathKey = "legacy7";
  var primary = (typeof CLARITY_PRIMARY_PATHS !== "undefined" && CLARITY_PRIMARY_PATHS[pathKey])
    ? CLARITY_PRIMARY_PATHS[pathKey]
    : ((typeof CLARITY_PRIMARY_PATHS !== "undefined") ? CLARITY_PRIMARY_PATHS.heart_grave : null);
  var pp = document.getElementById("today-path-pill");
  if (pp) pp.textContent = primary ? primary.label : String(pathKey);
  var salah = document.getElementById("today-salah-pill");
  var next = document.getElementById("ms-next-prayer");
  if (salah && next && next.textContent) salah.textContent = "Next: " + next.textContent.trim();
  var prog = { done: [] };
  try {
    if (primary && typeof clarityPrimaryProg === "function") prog = clarityPrimaryProg(primary.id);
  } catch (e3) {}
  var dayIdx = (prog.done || []).length;
  if (primary && primary.list && dayIdx >= primary.list.length) dayIdx = Math.max(0, primary.list.length - 1);
  var line = (primary && primary.list) ? primary.list[dayIdx] : "One sincere action for Allah";
  var card = document.getElementById("today-path-card");
  if (card) {
    card.innerHTML = primary
      ? ("<strong>" + primary.label + "</strong> · Day " + (dayIdx + 1) + " of " + primary.days)
      : "";
  }
  var deedText = document.getElementById("today-deed-text");
  if (deedText) deedText.textContent = line;
  else {
    var deed = document.getElementById("today-deed-line");
    if (deed) {
      var kicker = deed.querySelector(".deed-kicker");
      var p = deed.querySelector(".deed-text");
      if (p) p.textContent = line;
      else if (!kicker) deed.textContent = line;
    }
  }
  try { clarityUpdateGrowthTree(); } catch (e4) {}
  try { if (typeof showWelcome === "function") showWelcome(); } catch (e5) {}
}
window.clarityRefreshTodaySurface = clarityRefreshTodaySurface;
function clarityNoteTodayDeed() {
  var deedEl = document.getElementById("today-deed-text") || document.getElementById("today-deed-line");
  var deed = deedEl ? String(deedEl.textContent || "").trim() : "One sincere action";
  var pathPill = document.getElementById("today-path-pill");
  var pathLine = pathPill ? pathPill.textContent : "";
  if (typeof notesOpenDeedNote === "function") {
    notesOpenDeedNote({ title: "Today's deed", tag: "Practice", pathLine: pathLine, deed: deed, grave: true });
  }
  if (typeof clarityOpenSectionDoor === "function") clarityOpenSectionDoor("about");
  setTimeout(function(){
    var el = document.querySelector(".card-notes");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 250);
}
window.clarityNoteTodayDeed = clarityNoteTodayDeed;
(function(){
  var _render = window.clarityRenderPrimaryPathDays;
  if (typeof _render !== "function") return;
  window.clarityRenderPrimaryPathDays = function(pathId) {
    _render(pathId);
    var board = document.getElementById("path-board");
    if (!board) return;
    board.querySelectorAll(".path-day-list li").forEach(function(li, i) {
      if (li.querySelector(".path-note-btn")) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-soft path-note-btn";
      btn.style.cssText = "margin-left:auto;font-size:0.72rem;padding:0.25rem 0.5rem";
      btn.textContent = "Note";
      btn.onclick = function(ev) {
        ev.stopPropagation();
        if (typeof clarityNotePathDay === "function") clarityNotePathDay(pathId, i);
      };
      li.style.display = "flex";
      li.style.flexWrap = "wrap";
      li.style.alignItems = "center";
      li.appendChild(btn);
    });
  };
})();
document.addEventListener("DOMContentLoaded", function(){
  setTimeout(function(){
    try { if (typeof showWelcome === "function") showWelcome(); } catch(e) {}
    try { clarityUpdateGrowthTree(); } catch(e2) {}
  }, 150);
});

/* Section chip router — Notes / Meme / Family tree / Sharia IQ / Calligraphy */
function clarityGoSectionChip(kind) {
  kind = String(kind || "");
  var tab = "about";
  var finders = [];
  if (kind === "notes") {
    tab = "about";
    finders = [".card-notes", "#notes-shell", "#notes-list", "[data-i18n='notes_title']"];
  } else if (kind === "meme") {
    tab = "about";
    finders = ["#meme-stage", ".card-meme", "#meme-studio", "[id*='meme-']"];
  } else if (kind === "family") {
    tab = "notes";
    finders = ["#user-family-tree-card", ".uft-wrap", "#uft-canvas", "[id*='family']"];
  } else if (kind === "quiz") {
    /* Sharia IQ / fiqh quiz lives in About (All tools), not Fiqh tools tab */
    tab = "about";
    finders = ["#fiqh-quiz-card", "#lbl-quiz-question", "#lbl-question-category", ".fiqh-quiz", "#pm-quiz"];
  } else if (kind === "calligraphy") {
    /* Calligraphy lab is inside Tajweed tab */
    tab = "tajweed";
    finders = ["#tab-tajweed", ".card-tajweed"];
  }
  try {
    if (typeof clarityOpenSectionDoor === "function") clarityOpenSectionDoor(tab);
    else if (typeof switchTab === "function") switchTab(tab);
  } catch (eOpen) {
    try { if (typeof switchTab === "function") switchTab(tab); } catch (e2) {}
  }
  function scrollTarget() {
    var el = null;
    for (var i = 0; i < finders.length; i++) {
      try { el = document.querySelector(finders[i]); } catch (e) {}
      if (el) break;
    }
    /* Calligraphy: prefer heading text match inside tajweed panel */
    if (!el && kind === "calligraphy") {
      var panel = document.getElementById("tab-tajweed");
      if (panel) {
        var hs = panel.querySelectorAll("h2, h3");
        for (var h = 0; h < hs.length; h++) {
          if (/calligraph/i.test(hs[h].textContent || "")) { el = hs[h]; break; }
        }
        if (!el) el = panel.querySelector(".arabic-calligraphy") || panel;
      }
    }
    if (!el && kind === "quiz") {
      el = document.getElementById("fiqh-quiz-card") || document.getElementById("lbl-quiz-question");
    }
    if (el && el.scrollIntoView) {
      try { el.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e3) {
        try { el.scrollIntoView(true); } catch (e4) {}
      }
    }
  }
  setTimeout(scrollTarget, 200);
  setTimeout(scrollTarget, 450);
}

window.clarityGoSectionChip = clarityGoSectionChip;