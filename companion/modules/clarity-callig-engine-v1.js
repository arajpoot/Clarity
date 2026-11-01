/*! clarity-callig-engine-v1 · educational pad · not a qari verdict */
(function (w) {
  "use strict";
  if (w.__CLARITY_CALLIG_ENGINE_V1__) return;
  w.__CLARITY_CALLIG_ENGINE_V1__ = true;

  function ensureState() {
    if (!w.calligState || typeof w.calligState !== "object") {
      w.calligState = {
        drawing: false, ink: "#0d4f3c", size: 14, guide: true, script: "naskh", glyph: "ا",
        strokes: [], cur: null, lastPts: [], audioOn: false, scale: 100, offsetX: 0, offsetY: 0
      };
    }
    var s = w.calligState;
    if (!Array.isArray(s.strokes)) s.strokes = [];
    return s;
  }

  function canvas() {
    return document.getElementById("callig-canvas");
  }

  function ctx2d() {
    var c = canvas();
    if (!c) return null;
    var ctx = c.getContext("2d");
    return ctx;
  }

  function pos(ev, c) {
    var r = c.getBoundingClientRect();
    var x = (ev.clientX != null ? ev.clientX : (ev.touches && ev.touches[0] ? ev.touches[0].clientX : 0)) - r.left;
    var y = (ev.clientY != null ? ev.clientY : (ev.touches && ev.touches[0] ? ev.touches[0].clientY : 0)) - r.top;
    var sx = c.width / Math.max(1, r.width);
    var sy = c.height / Math.max(1, r.height);
    return { x: x * sx, y: y * sy };
  }

  function drawGuide(ctx, c, s) {
    if (!s.guide) return;
    ctx.save();
    ctx.strokeStyle = "rgba(13,79,60,0.12)";
    ctx.lineWidth = 1;
    var step = 40;
    for (var y = step; y < c.height; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(c.width, y); ctx.stroke();
    }
    ctx.fillStyle = "rgba(13,79,60,0.08)";
    ctx.font = "120px Amiri, 'Noto Naskh Arabic', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(s.glyph || "ا", c.width / 2, c.height / 2);
    ctx.restore();
  }

  function redraw() {
    var c = canvas();
    var ctx = ctx2d();
    if (!c || !ctx) return;
    var s = ensureState();
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#fffef8";
    ctx.fillRect(0, 0, c.width, c.height);
    drawGuide(ctx, c, s);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    s.strokes.forEach(function (stroke) {
      if (!stroke || !stroke.pts || stroke.pts.length < 1) return;
      ctx.strokeStyle = stroke.ink || s.ink;
      ctx.lineWidth = stroke.size || s.size;
      ctx.beginPath();
      ctx.moveTo(stroke.pts[0].x, stroke.pts[0].y);
      for (var i = 1; i < stroke.pts.length; i++) ctx.lineTo(stroke.pts[i].x, stroke.pts[i].y);
      ctx.stroke();
    });
    if (s.cur && s.cur.pts && s.cur.pts.length) {
      ctx.strokeStyle = s.ink;
      ctx.lineWidth = s.size;
      ctx.beginPath();
      ctx.moveTo(s.cur.pts[0].x, s.cur.pts[0].y);
      for (var j = 1; j < s.cur.pts.length; j++) ctx.lineTo(s.cur.pts[j].x, s.cur.pts[j].y);
      ctx.stroke();
    }
  }

  w.calligDrawGuide = redraw;
  w.calligRedraw = redraw;

  w.calligClear = function () {
    var s = ensureState();
    s.strokes = [];
    s.cur = null;
    redraw();
  };

  w.calligDownload = function () {
    var c = canvas();
    if (!c) return;
    try {
      var a = document.createElement("a");
      a.href = c.toDataURL("image/png");
      a.download = "clarity-callig.png";
      a.click();
    } catch (e) {}
  };

  w.calligPointerDown = function (ev) {
    var c = canvas();
    if (!c) return;
    var s = ensureState();
    s.drawing = true;
    var p = pos(ev, c);
    s.cur = { pts: [p], ink: s.ink, size: s.size };
    try { ev.preventDefault(); } catch (e) {}
  };

  w.calligPointerMove = function (ev) {
    var c = canvas();
    var s = ensureState();
    if (!c || !s.drawing || !s.cur) return;
    s.cur.pts.push(pos(ev, c));
    redraw();
    try { ev.preventDefault(); } catch (e) {}
  };

  w.calligPointerUp = function () {
    var s = ensureState();
    if (s.drawing && s.cur && s.cur.pts && s.cur.pts.length > 1) s.strokes.push(s.cur);
    s.drawing = false;
    s.cur = null;
    redraw();
  };

  w.calligInit = function () {
    var c = canvas();
    if (!c) return;
    ensureState();
    if (c.__calligBound) { redraw(); return; }
    c.__calligBound = true;
    c.style.touchAction = "none";
    c.addEventListener("pointerdown", w.calligPointerDown);
    c.addEventListener("pointermove", w.calligPointerMove);
    c.addEventListener("pointerup", w.calligPointerUp);
    c.addEventListener("pointerleave", w.calligPointerUp);
    c.addEventListener("pointercancel", w.calligPointerUp);
    redraw();
  };

  /* Soft stubs — no throw */
  w.calligAutoEnhanceAll = w.calligAutoEnhanceAll || function () { redraw(); };
  w.calligMarkPracticed = w.calligMarkPracticed || function () {
    try { localStorage.setItem("clarity_callig_practiced_v1", String(Date.now())); } catch (e) {}
  };
  w.calligTranslateToArabic = w.calligTranslateToArabic || function () {};
  w.calligSendEnglishToCanvas = w.calligSendEnglishToCanvas || function () {};
  w.calligPlaceArabicOnCanvas = w.calligPlaceArabicOnCanvas || function () { redraw(); };
  w.calligSendEnglishToMeme = w.calligSendEnglishToMeme || function () {};
  w.calligSurprise = w.calligSurprise || function () {
    var s = ensureState();
    var glyphs = ["ا", "ب", "ت", "ح", "س", "م", "ن", "ي", "لا", "الله"];
    s.glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
    redraw();
  };
  w.calligMicToggle = w.calligMicToggle || function () {};
  w.calligMicStop = w.calligMicStop || function () {};
  w.calligMicPlaceEnglish = w.calligMicPlaceEnglish || function () {};
  w.calligMicPlaceArabic = w.calligMicPlaceArabic || function () {};

  function boot() { try { w.calligInit(); } catch (e) {} }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 300); });
  else setTimeout(boot, 300);
})(window);
