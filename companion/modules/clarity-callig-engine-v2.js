/*! clarity-callig-engine-v2.js · Companion Reminder · from NurOS AV calligraphy lab
 * Glyph guide · canvas · scripts · educational only — not a fatwa
 */
(function(w){
"use strict";
if (w.__CLARITY_CALLIG_ENGINE_V2__) return;
w.__CLARITY_CALLIG_ENGINE_V2__ = true;

/* Companion stubs · educational only — not a fatwa */
window.calligVoice = window.calligVoice || { listening: false, lastEn: "", lastAr: "" };
window.calligProgressRender = window.calligProgressRender || function () {};
window.calligTipWidth = window.calligTipWidth || function (base, vel, pressure) {
  var b = base || 14;
  var p = (pressure != null && pressure > 0) ? pressure : 0.5;
  var v = vel || 0;
  return Math.max(2, Math.min(48, b * (0.55 + p * 0.9) * (1 - Math.min(0.35, v * 0.02))));
};
window.calligSendEnglishToMeme = window.calligSendEnglishToMeme || function () {
  try {
    var en = (document.getElementById("callig-english-input") || {}).value || "";
    if (!en) return;
    if (window.localStorage) localStorage.setItem("clarity_meme_bridge_caption", en);
  } catch (e) {}
};
window.calligMicToggle = window.calligMicToggle || function () {
  var st = document.getElementById("callig-voice-status");
  if (st) st.textContent = "Mic optional — use type → EN→AR · educational only";
};
window.calligMicStop = window.calligMicStop || function () {};

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
  var px=Math.round(Math.min(220, Math.max(90, (document.getElementById('callig-canvas')||{}).height||420) * 0.42 * sc));
  var stack = "'Amiri','Scheherazade New','Noto Naskh Arabic','Arabic Typesetting','Traditional Arabic',serif";
  if(s==='kufi') stack = "'Reem Kufi','Noto Kufi Arabic',Tahoma,sans-serif";
  if(s==='ruqaa') stack = "'Aref Ruqaa','Amiri',serif";
  if(s==='thuluth') stack = "'Lateef','Amiri','Scheherazade New',serif";
  return "700 "+px+"px "+stack;
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
  var ctx=c.getContext('2d'); if(!ctx) return;
  if(!c.width || !c.height){ c.width=900; c.height=420; }
  ctx.clearRect(0,0,c.width,c.height);
  /* paper */
  ctx.fillStyle='#f3efe6';
  ctx.fillRect(0,0,c.width,c.height);
  /* ruled lines */
  ctx.strokeStyle='rgba(13,79,60,0.12)';
  ctx.lineWidth=1;
  for(var y=36;y<c.height;y+=36){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(c.width,y); ctx.stroke(); }
  /* midline */
  ctx.strokeStyle='rgba(184,146,42,0.35)';
  ctx.lineWidth=1.25;
  ctx.beginPath(); ctx.moveTo(0,c.height/2); ctx.lineTo(c.width,c.height/2); ctx.stroke();
  /* always show guide when enabled (default true) */
  var show = !calligState || calligState.guide !== false;
  if(show){
    ctx.save();
    var g=String((calligState && calligState.glyph) || 'ا');
    var isLatin=/[A-Za-z]/.test(g);
    if(isLatin){
      ctx.font="600 "+Math.round(c.height*0.28)+"px Georgia, serif";
      ctx.direction='ltr';
    } else {
      ctx.font=calligFont();
      ctx.direction='rtl';
    }
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    var ox=(calligState && calligState.offsetX)||0;
    var oy=(calligState && calligState.offsetY)||0;
    var x=c.width/2+ox, y=c.height/2+oy;
    /* high-visibility ghost glyph */
    ctx.lineJoin='round';
    ctx.lineWidth=Math.max(2, Math.round(c.height*0.012));
    ctx.strokeStyle='rgba(13,79,60,0.38)';
    ctx.strokeText(g, x, y);
    ctx.fillStyle='rgba(13,79,60,0.20)';
    ctx.fillText(g, x, y);
    ctx.restore();
  }
  /* user strokes on top */
  (calligState && calligState.strokes || []).forEach(function(st){
    try { if (typeof calligStrokePath === 'function') calligStrokePath(ctx, st); } catch(e){}
  });
}

function calligSetGlyph(v){
  calligState.glyph=v||'ا';
  calligState.strokes=[];
  calligState.cur=null;
  calligState.drawing=false;
  calligDrawGuide();
  calligSpeak(calligState.glyph);
}
function calligSurprise(){
  var glyphs=['ا','ب','ت','ح','س','ع','م','ن','ه','و','ي','الله','بسم','محمد','رحمن','رحيم','صبر','شكر'];
  var scripts=['naskh','kufi','ruqaa','thuluth'];
  var inks=['#0d4f3c','#1a3a5c','#5a2a1a','#3d2a6b','#0a3030','#4a3a10'];
  calligState.glyph=glyphs[Math.floor(Math.random()*glyphs.length)];
  calligState.script=scripts[Math.floor(Math.random()*scripts.length)];
  calligState.ink=inks[Math.floor(Math.random()*inks.length)];
  calligState.size=10+Math.floor(Math.random()*14);
  calligState.stylusSim=true; calligState.autoEnhance=true;
  calligState.stylusFeel=55+Math.floor(Math.random()*40);
  var ge=document.getElementById('callig-glyph');
  if(ge){
    var opt=[].slice.call(ge.options).some(function(o){return o.value===calligState.glyph;});
    if(opt) ge.value=calligState.glyph;
  }
  var se=document.getElementById('callig-script'); if(se) se.value=calligState.script;
  var inkEl=document.getElementById('callig-ink'); if(inkEl) inkEl.value=calligState.ink;
  var sizeEl=document.getElementById('callig-size'); if(sizeEl){ sizeEl.value=calligState.size; var sv=document.getElementById('callig-size-val'); if(sv) sv.textContent=String(calligState.size); }
  var feelEl=document.getElementById('callig-stylus-feel'); if(feelEl) feelEl.value=calligState.stylusFeel;
  var st=document.getElementById('callig-stylus-on'); if(st) st.checked=true;
  var ae=document.getElementById('callig-auto-enhance'); if(ae) ae.checked=true;
  calligState.strokes=[];
  calligDrawGuide();
  calligUpdateModeBadge();
  calligSpeak(calligState.glyph);
  var tip=document.getElementById('callig-tajweed-tip');
  /* ~35%: seed an English prompt so user can practice EN→AR flow */
  if(Math.random()<0.35){
    var seeds=['patience','gratitude','peace','Bismillah','O Allah','light','faith','praise be to allah'];
    var seed=seeds[Math.floor(Math.random()*seeds.length)];
    var el=document.getElementById('callig-english-input');
    if(el) el.value=seed;
    if(tip) tip.innerHTML='✨ Surprise seed: type/voice <strong>'+seed+'</strong> — tap <strong>EN → AR</strong> or 🎤→🌐';
    calligPreviewTranslation(seed, calligLocalTranslate(seed)||'');
  } else if(tip){
    tip.innerHTML='✨ Surprise: <strong>'+calligState.glyph+'</strong> in <strong>'+calligState.script+'</strong> — finger-draw with stylus feel + auto-enhance';
  }
}
function calligInit(){
  var c=document.getElementById('callig-canvas'); if(!c) return;
  /* Fixed bitmap — CSS width:100% scales; avoids full/half pad size fight */
  var targetW = 900;
  var targetH = 420;
  if (c.width !== targetW || c.height !== targetH) {
    c.width = targetW;
    c.height = targetH;
  }
  if (typeof calligState !== 'undefined' && calligState) {
    if (calligState.guide == null) calligState.guide = true;
    if (!calligState.glyph) calligState.glyph = 'ا';
  }
  calligDrawGuide();
  calligUpdateModeBadge();
  if (c.__calligListenersBound) return;
  c.__calligListenersBound = true;
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
/* boot handled by companion mount bridge */

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
w.calligInit = calligInit;
w.calligDrawGuide = calligDrawGuide;
w.calligSetGlyph = calligSetGlyph;
w.calligClear = calligClear;
w.calligUndo = calligUndo;
w.calligSetScript = typeof calligSetScript==='function'?calligSetScript:function(s){ if(w.calligState){ w.calligState.script=s; calligDrawGuide(); calligUpdateModeBadge(); } };
})(window);

/*! Companion mount bridge · Reminder tab calligraphy */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_CALLIG_COMPANION_BRIDGE__) return;
  w.__CLARITY_CALLIG_COMPANION_BRIDGE__ = true;

  function isReminder() {
    try {
      var t = (d.body && d.body.getAttribute("data-active-tab")) || "";
      t = String(t || "").toLowerCase();
      if (t === "reminder") return true;
      if (d.getElementById("callig-canvas") && d.getElementById("callig-lab-card")) return true;
    } catch (e) {}
    return !!d.getElementById("callig-canvas");
  }

  function boot() {
    if (!d.getElementById("callig-canvas")) return;
    try {
      if (typeof w.calligInit === "function") w.calligInit();
    } catch (e) { console.warn("[callig]", e); }
    /* wire glyph chips */
    d.querySelectorAll("[data-callig-glyph]").forEach(function (btn) {
      if (btn.__calligWired) return;
      btn.__calligWired = true;
      btn.addEventListener("click", function () {
        var g = btn.getAttribute("data-callig-glyph") || "ا";
        if (typeof w.calligSetGlyph === "function") w.calligSetGlyph(g);
        d.querySelectorAll("[data-callig-glyph]").forEach(function (b) {
          b.classList.toggle("on", b === btn);
        });
      });
    });
    var guide = d.getElementById("callig-guide");
    if (guide && !guide.__calligWired) {
      guide.__calligWired = true;
      guide.addEventListener("change", function () {
        if (w.calligState) w.calligState.guide = !!guide.checked;
        if (typeof w.calligDrawGuide === "function") w.calligDrawGuide();
      });
    }
    var ink = d.getElementById("callig-ink");
    if (ink && !ink.__calligWired) {
      ink.__calligWired = true;
      ink.addEventListener("input", function () {
        if (w.calligState) w.calligState.ink = ink.value;
      });
    }
    var size = d.getElementById("callig-size");
    if (size && !size.__calligWired) {
      size.__calligWired = true;
      size.addEventListener("input", function () {
        if (w.calligState) w.calligState.size = +size.value || 14;
      });
    }
    var script = d.getElementById("callig-script");
    if (script && !script.__calligWired) {
      script.__calligWired = true;
      script.addEventListener("change", function () {
        if (typeof w.calligSetScript === "function") w.calligSetScript(script.value);
        else if (w.calligState) {
          w.calligState.script = script.value;
          if (typeof w.calligDrawGuide === "function") w.calligDrawGuide();
          if (typeof w.calligUpdateModeBadge === "function") w.calligUpdateModeBadge();
        }
      });
    }
    var glyphSel = d.getElementById("callig-glyph");
    if (glyphSel && !glyphSel.__calligWired) {
      glyphSel.__calligWired = true;
      glyphSel.addEventListener("change", function () {
        if (typeof w.calligSetGlyph === "function") w.calligSetGlyph(glyphSel.value);
      });
    }
    ["callig-clear", "callig-undo"].forEach(function (id) {
      var el = d.getElementById(id);
      if (!el || el.__calligWired) return;
      el.__calligWired = true;
      el.addEventListener("click", function () {
        if (id === "callig-clear" && typeof w.calligClear === "function") w.calligClear();
        if (id === "callig-undo" && typeof w.calligUndo === "function") w.calligUndo();
      });
    });
  }

  function onMounted(ev) {
    var tab = "";
    try { tab = String((ev && ev.detail && ev.detail.tab) || "").toLowerCase(); } catch (e) {}
    if (tab && tab !== "reminder" && tab !== "") {
      /* keep engine; no-op off reminder */
      return;
    }
    setTimeout(boot, 50);
    setTimeout(boot, 400);
  }

  d.addEventListener("clarity:tab-mounted", onMounted);
  w.addEventListener("clarity:tab-mounted", onMounted);
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 200); });
  else setTimeout(boot, 200);
})(window, document);


/*! Callig quiet boot · visible guide · no pad-size fight */
(function(w,d){
  "use strict";
  if (w.__CLARITY_CALLIG_QUIET_BOOT__) return;
  w.__CLARITY_CALLIG_QUIET_BOOT__ = true;
  var tries = 0;
  function onceInit(){
    var c = d.getElementById("callig-canvas");
    if (!c) return false;
    try {
      if (typeof w.calligInit === "function") w.calligInit();
      if (w.calligState) {
        w.calligState.guide = true;
        if (!w.calligState.glyph) w.calligState.glyph = "ا";
      }
      if (typeof w.calligDrawGuide === "function") w.calligDrawGuide();
      var tip = d.getElementById("callig-tajweed-tip");
      if (tip && (!tip.textContent || tip.textContent.indexOf("Select")===0)) {
        tip.textContent = "Guide on · trace the letter · educational only — not a fatwa";
      }
    } catch (e) { try { console.warn("[callig-boot]", e); } catch(e2){} }
    return true;
  }
  function tick(){
    tries++;
    if (onceInit()) {
      /* fonts may load late — redraw */
      try {
        if (d.fonts && d.fonts.ready) {
          d.fonts.ready.then(function(){ try { if (typeof w.calligDrawGuide==="function") w.calligDrawGuide(); } catch(e){} });
        }
      } catch (e3) {}
      setTimeout(function(){ try { if (typeof w.calligDrawGuide==="function") w.calligDrawGuide(); } catch(e){} }, 400);
      setTimeout(function(){ try { if (typeof w.calligDrawGuide==="function") w.calligDrawGuide(); } catch(e){} }, 1200);
      return;
    }
    if (tries < 40) setTimeout(tick, 150);
  }
  function onMount(){ tries = 0; setTimeout(tick, 30); }
  d.addEventListener("clarity:tab-mounted", onMount);
  w.addEventListener("clarity:tab-mounted", onMount);
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", onMount);
  else onMount();
  /* fortify may inject later */
  try {
    var mo = new MutationObserver(function(){
      if (d.getElementById("callig-canvas") && tries >= 40) { tries = 0; tick(); }
      else if (d.getElementById("callig-canvas")) { onceInit(); }
    });
    mo.observe(d.documentElement, { childList: true, subtree: true });
  } catch (e4) {}
})(window, document);
