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
    ctx.fillStyle='rgba(13,79,60,0.22)';
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
    ctx.lineWidth = Math.max(1.5, Math.round(((calligState.scale||100)/100)*2));
    ctx.strokeStyle = 'rgba(13,79,60,0.28)';
    ctx.strokeText(g, c.width/2+ox, c.height/2+oy);
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
  if(!calligState.drawing) return;
  var c=document.getElementById('callig-canvas'); if(!c) return;
  ev.preventDefault();
  var p=calligPos(ev,c);
  var cur=calligState.cur; if(!cur) return;
  var last = cur[cur.length-1];
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
  if(!calligState.drawing) return;
  calligState.drawing=false;
  if(calligState.cur && calligState.cur.length>0){
    var stroke=calligState.cur;
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
  var targetW = 900;
  var targetH = 420;
  /* preserve aspect on narrow hosts */
  try {
    var rect = c.getBoundingClientRect();
    if (rect.width > 80) {
      targetW = Math.max(480, Math.min(1100, Math.round(rect.width * (window.devicePixelRatio || 1))));
      targetH = Math.round(targetW * 0.48);
    }
  } catch (e0) {}
  c.width = targetW;
  c.height = targetH;
  if (typeof calligState !== 'undefined' && calligState) {
    if (calligState.guide == null) calligState.guide = true;
    if (!calligState.glyph) calligState.glyph = 'ا';
  }
  calligDrawGuide();
  calligUpdateModeBadge();
  if (c.__calligListenersBound) {
    return; /* already wired — only redrew guide */
  }
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
  if (w.__CLARITY_CALLIG_COMPANION_BRIDGE_V2__) return;
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
