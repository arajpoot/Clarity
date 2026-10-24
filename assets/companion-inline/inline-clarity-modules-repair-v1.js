
(function(){
"use strict";
if (window.__CLARITY_MODULES_REPAIR_V1__) return;
window.__CLARITY_MODULES_REPAIR_V1__ = true;

/**
 * Repair wiring for: Tajweed, Notes/Notepad, Calligraphy, Meme Studio, Tweet desk
 */

function safe(fn){ try { return fn(); } catch(e){ return null; } }

/* ---------- Shared stubs (only if missing) ---------- */
function stub(name, impl){
  if (typeof window[name] !== "function") window[name] = impl;
}

/* ---------- Calligraphy ---------- */
function calligEnsureState(){
  if (typeof window.calligState !== "object" || !window.calligState) {
    window.calligState = {
      drawing:false, ink:"#0d4f3c", size:14, guide:true, script:"naskh", glyph:"ا",
      strokes:[], cur:null, lastPts:[], audioOn:true, scale:100, offsetX:0, offsetY:0,
      stylusSim:true, autoEnhance:true, stylusFeel:70, lastVel:0, pointerType:"touch", tip:"finger"
    };
  } else {
    var s = window.calligState;
    if (s.scale == null) s.scale = 100;
    if (s.size == null) s.size = 14;
    if (!Array.isArray(s.strokes)) s.strokes = [];
  }
}

function calligResizeCanvas(){
  var c = document.getElementById("callig-canvas");
  if (!c) return;
  var parent = c.parentElement;
  var w = Math.max(280, Math.min(900, (parent && parent.clientWidth) || 360));
  var h = Math.max(220, Math.round(w * 0.62));
  if (c.width !== w || c.height !== h) {
    c.width = w;
    c.height = h;
  }
  if (typeof window.calligDrawGuide === "function") {
    try { window.calligDrawGuide(); } catch(e){}
  }
}

function calligBoot(){
  calligEnsureState();
  calligResizeCanvas();
  var c = document.getElementById("callig-canvas");
  if (!c || c.__calligBound) return;
  c.__calligBound = true;
  /* Pointer drawing fallback if main binder failed */
  if (typeof window.calligPointerDown !== "function") {
    var drawing = false;
    function pos(ev){
      var r = c.getBoundingClientRect();
      var t = ev.touches && ev.touches[0] ? ev.touches[0] : ev;
      return {
        x: (t.clientX - r.left) * (c.width / Math.max(1, r.width)),
        y: (t.clientY - r.top) * (c.height / Math.max(1, r.height))
      };
    }
    c.addEventListener("pointerdown", function(ev){
      drawing = true;
      try { c.setPointerCapture(ev.pointerId); } catch(e){}
      var p = pos(ev);
      var s = window.calligState || (window.calligState = { strokes:[], cur:null, drawing:false, ink:"#0d4f3c", size:14, scale:100 });
      if (!Array.isArray(s.strokes)) s.strokes = [];
      s.cur = [{ x: p.x, y: p.y, w: s.size || 14, t: Date.now(), a: 0.6 }];
      s.drawing = true;
    });
    c.addEventListener("pointermove", function(ev){
      if (!drawing || !window.calligState) return;
      if (!Array.isArray(window.calligState.cur)) {
        window.calligState.cur = [];
      }
      var p = pos(ev);
      var cur = window.calligState.cur;
      cur.push({ x: p.x, y: p.y, w: window.calligState.size || 14, t: Date.now() });
      var ctx = c.getContext("2d");
      var pts = cur;
      if (pts.length < 2) return;
      ctx.strokeStyle = window.calligState.ink || "#0d4f3c";
      ctx.lineWidth = (window.calligState.size || 14) * ((window.calligState.scale||100)/100);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      var a = pts[pts.length-2], b = pts[pts.length-1];
      ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    });
    function endDraw(){
      if (!drawing) return;
      drawing = false;
      var s = window.calligState;
      if (s.cur && s.cur.pts && s.cur.pts.length) s.strokes.push(s.cur);
      s.cur = null; s.drawing = false;
    }
    c.addEventListener("pointerup", endDraw);
    c.addEventListener("pointercancel", endDraw);
  }
}

stub("calligClear", function(){
  calligEnsureState();
  window.calligState.strokes = [];
  window.calligState.cur = null;
  calligResizeCanvas();
  if (typeof window.calligDrawGuide === "function") window.calligDrawGuide();
});

stub("calligSurprise", function(){
  calligEnsureState();
  var glyphs = ["ا","ب","ت","ث","ن","م","ل","ك","ه","و","ي","س","ر","ع","ح","ق"];
  window.calligState.glyph = glyphs[Math.floor(Math.random()*glyphs.length)];
  if (typeof window.calligDrawGuide === "function") window.calligDrawGuide();
  else calligResizeCanvas();
});

/* ---------- Meme Studio ---------- */
stub("memeSurpriseMe", function(){
  if (typeof window.memeFetchRrra === "function") return window.memeFetchRrra(null);
  if (typeof window.memeDailyVerse === "function") return window.memeDailyVerse();
});
stub("memeRender", function(){
  if (typeof window.memeApplyVerseCard === "function") return;
  var canvas = document.getElementById("meme-canvas");
  if (!canvas) return;
  try {
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
  } catch(e){}
});

function memeEnsureOnline(){
  /* Prefer existing online engine; ensure memeFetchBg exists */
  if (typeof window.memeFetchBg !== "function") {
    window.memeFetchBg = function(kind){
      if (typeof window.__memeOnlineFetch === "function") return window.__memeOnlineFetch(kind);
      kind = kind || "nature";
      var seed = "clarity-" + kind + "-" + (Date.now() % 99999);
      var url = "https://picsum.photos/seed/" + encodeURIComponent(seed) + "/1200/900.jpg";
      if (typeof window.memeLoadImageFromUrl === "function") return window.memeLoadImageFromUrl(url);
    };
  } else {
    /* wrap once to fall back online */
    if (!window.memeFetchBg.__repaired) {
      var orig = window.memeFetchBg;
      window.memeFetchBg = function(kind){
        try {
          if (typeof window.__memeOnlineFetch === "function") {
            return window.__memeOnlineFetch(kind);
          }
        } catch(e){}
        return orig.apply(this, arguments);
      };
      window.memeFetchBg.__repaired = true;
    }
  }
}

/* ---------- Tweet desk ---------- */
stub("tdStatus", function(msg){
  var el = document.getElementById("td-status") || document.querySelector(".td-status");
  if (el) el.textContent = msg || "";
});
stub("tdRemind", function(){
  if (typeof window.tdDraft === "function") return window.tdDraft("verse");
});
stub("tdCopy", function(){
  var ta = document.getElementById("td-output") || document.getElementById("td-compose") || document.querySelector("#tweet-desk-card textarea");
  if (!ta) return;
  try {
    ta.select();
    document.execCommand("copy");
    if (typeof window.tdStatus === "function") window.tdStatus("Copied");
  } catch(e){}
});

/* ---------- Tajweed ---------- */
stub("clarityLiveTajweed", function(force){
  var host = document.getElementById("tajweed-live-card") || document.getElementById("tj-live-body");
  var mods = [
    { t: "Izhār (إظهار)", b: "Nūn sākinah or tanwīn before ء ه ع ح غ خ: keep the nūn clear." },
    { t: "Ikhfāʾ (إخفاء)", b: "Hide nūn/tanwīn with light ghunnah before ikhfāʾ letters." },
    { t: "Idghām (إدغام)", b: "Merge nūn/tanwīn into ي ن م و with ghunnah where required." },
    { t: "Qalqalah (قلقلة)", b: "Bounce on ق ط ب ج د when sākin." }
  ];
  var pick = mods[Math.floor(Math.random() * mods.length)];
  var slot = document.getElementById("tj-daily-module") || document.querySelector("#tajweed-live-card .tj-daily, #tajweed-live-card .td-src");
  if (slot) {
    slot.innerHTML = "<strong>"+pick.t+"</strong> — "+pick.b;
  } else if (host) {
    var p = host.querySelector("p");
    if (p) p.textContent = pick.t + " — " + pick.b;
  }
  return pick;
});
stub("clarityRefreshSection", function(which){
  if (which === "tajweed" && typeof window.clarityLiveTajweed === "function") {
    window.clarityLiveTajweed(true);
  }
});

/* ---------- Notes / notepad ---------- */
function notesEnsure(){
  if (typeof window.notesState !== "object" || !window.notesState) {
    window.notesState = { notes: [], selectedId: null, query: "", tagFilter: "", viewMode: "edit", saveTimer: null };
  }
  if (typeof window.notesLoad !== "function") {
    window.notesLoad = function(){
      try {
        var key = window.NOTES_KEY || "clarity_notes_v1";
        var raw = localStorage.getItem(key);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.notes)) window.notesState = parsed;
          else if (Array.isArray(parsed)) window.notesState.notes = parsed;
        }
      } catch(e){}
      if (typeof window.notesRenderEditor === "function") window.notesRenderEditor();
      if (typeof window.notesRenderList === "function") window.notesRenderList();
      return window.notesState;
    };
  }
}

/* ---------- Boot ---------- */
function repairAll(){
  calligBoot();
  memeEnsureOnline();
  notesEnsure();
  /* Soft-boot tajweed label once */
  try {
    if (document.getElementById("tajweed-live-card") && typeof window.clarityLiveTajweed === "function") {
      /* don't force rewrite every time — only if empty slot */
      var slot = document.getElementById("tj-daily-module");
      if (slot && !slot.textContent.trim()) window.clarityLiveTajweed(false);
    }
  } catch(e){}
}

if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", function(){ setTimeout(repairAll, 300); });
else setTimeout(repairAll, 300);
window.addEventListener("load", function(){
  setTimeout(repairAll, 600);
  setTimeout(calligResizeCanvas, 1000);
});
window.addEventListener("resize", function(){
  clearTimeout(window.__calligResizeT);
  window.__calligResizeT = setTimeout(calligResizeCanvas, 150);
});

/* After tab switch, re-bind canvases */
var _sw = window.switchTab;
if (typeof _sw === "function" && !_sw.__modulesRepair) {
  window.switchTab = function(){
    var r = _sw.apply(this, arguments);
    setTimeout(repairAll, 200);
    return r;
  };
  window.switchTab.__modulesRepair = true;
}

window.clarityModulesRepair = { run: repairAll, calligBoot: calligBoot };
})();
