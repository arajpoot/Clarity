(function(){
  "use strict";
  if (window.__CLARITY_ERROR_GUARD_V2__) return;
  window.__CLARITY_ERROR_GUARD_V2__ = true;

  function ensureCalligState(){
    if (!window.calligState || typeof window.calligState !== "object") {
      window.calligState = {
        drawing:false, ink:"#0d4f3c", size:14, guide:true, script:"naskh", glyph:"ا",
        strokes:[], cur:null, lastPts:[], audioOn:true, scale:100, offsetX:0, offsetY:0,
        stylusSim:true, autoEnhance:true, stylusFeel:70, lastVel:0, pointerType:"touch", tip:"finger"
      };
    }
    var s = window.calligState;
    if (!Array.isArray(s.strokes)) s.strokes = [];
    if (!Array.isArray(s.lastPts)) s.lastPts = [];
    if (s.cur && !Array.isArray(s.cur)) {
      if (s.cur.pts && Array.isArray(s.cur.pts)) s.cur = s.cur.pts;
      else s.cur = null;
    }
    return s;
  }
  ensureCalligState();

  /* Patch common callig APIs to self-heal */
  ["calligPointerDown","calligPointerMove","calligPointerUp","calligRedraw","calligClear"].forEach(function(name){
    try {
      var fn = window[name];
      if (typeof fn !== "function" || fn.__guarded) return;
      window[name] = function(){
        ensureCalligState();
        try { return fn.apply(this, arguments); }
        catch(err){ console.warn("[Clarity]", name, err && err.message); }
      };
      window[name].__guarded = true;
    } catch(e){}
  });

  /* Soften uncaught push on undefined in late listeners */
  window.addEventListener("error", function(ev){
    try {
      var msg = (ev && ev.message) || "";
      if (/reading ['\"]push['\"]/.test(msg) || /Cannot read properties of undefined \(reading 'push'\)/.test(msg)) {
        ensureCalligState();
        if (window.calligState && window.calligState.cur && !Array.isArray(window.calligState.cur.pts)) {
          window.calligState.cur.pts = [];
        }
        /* prevent red overlay spam for this known class */
        ev.preventDefault && ev.preventDefault();
      }
    } catch(e){}
  }, true);

  /* notesState */
  if (!window.notesState || typeof window.notesState !== "object") {
    window.notesState = { notes: [], selectedId: null, query: "", tagFilter: "", viewMode: "edit", saveTimer: null };
  }
  if (!Array.isArray(window.notesState.notes)) window.notesState.notes = [];

  /* memeState */
  if (!window.memeState) window.memeState = { img:null, text:"", bg:null };
  if (!window.VERSE_POOL) window.VERSE_POOL = [];
  if (!Array.isArray(window.VERSE_POOL)) window.VERSE_POOL = [];

  function boot(){ ensureCalligState(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", boot);
})();