/*! clarity-callig-nuke-v1 · single owner · visible guide · educational only — not a fatwa */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_CALLIG_NUKE_V1__) return;
  w.__CLARITY_CALLIG_NUKE_V1__ = true;
  /* neutralize older engines */
  w.__CLARITY_CALLIG_QUIET_BOOT__ = true;
  w.__CLARITY_CALLIG_COMPANION_BRIDGE_V2__ = true;
  w.__CLARITY_CALLIG_ENGINE_V2__ = true;

  var state = {
    glyph: "ا",
    script: "naskh",
    ink: "#0d4f3c",
    size: 14,
    guide: true,
    strokes: [],
    cur: null,
    drawing: false
  };

  function $(id) { return d.getElementById(id); }

  function font() {
    var h = ($("callig-canvas") || {}).height || 420;
    var px = Math.round(h * 0.42);
    var s = state.script || "naskh";
    if (s === "kufi") return "700 " + px + "px 'Reem Kufi', Tahoma, sans-serif";
    if (s === "ruqaa") return "700 " + px + "px 'Aref Ruqaa', Amiri, serif";
    if (s === "thuluth") return "700 " + px + "px Lateef, Amiri, serif";
    return "700 " + px + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', 'Traditional Arabic', serif";
  }

  function redraw() {
    var c = $("callig-canvas");
    if (!c) return;
    var ctx = c.getContext("2d");
    if (!ctx) return;
    if (!c.width || !c.height) {
      c.width = 900;
      c.height = 420;
    }
    ctx.clearRect(0, 0, c.width, c.height);
    /* paper */
    ctx.fillStyle = "#f3efe6";
    ctx.fillRect(0, 0, c.width, c.height);
    /* rules */
    ctx.strokeStyle = "rgba(13,79,60,0.14)";
    ctx.lineWidth = 1;
    for (var y = 36; y < c.height; y += 36) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(c.width, y);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(184,146,42,0.4)";
    ctx.beginPath();
    ctx.moveTo(0, c.height / 2);
    ctx.lineTo(c.width, c.height / 2);
    ctx.stroke();
    /* GUIDE GLYPH — always if enabled */
    if (state.guide !== false) {
      ctx.save();
      ctx.font = font();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.direction = "rtl";
      var g = state.glyph || "ا";
      var x = c.width / 2, yy = c.height / 2;
      ctx.lineJoin = "round";
      ctx.lineWidth = Math.max(2.5, c.height * 0.014);
      ctx.strokeStyle = "rgba(13,79,60,0.55)";
      ctx.strokeText(g, x, yy);
      ctx.fillStyle = "rgba(13,79,60,0.30)";
      ctx.fillText(g, x, yy);
      ctx.restore();
    }
    /* user ink */
    /* ___inline_sync */
    state.strokes.forEach(function (st) {
      if (!st || !st.pts || st.pts.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = st.ink || state.ink;
      ctx.lineWidth = st.size || state.size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(st.pts[0].x, st.pts[0].y);
      for (var i = 1; i < st.pts.length; i++) ctx.lineTo(st.pts[i].x, st.pts[i].y);
      ctx.stroke();
    });
  }

  function pos(ev, c) {

    var r = c.getBoundingClientRect();
    var src = ev.touches && ev.touches[0] ? ev.touches[0] : ev;
    if (ev.clientX == null && ev.touches) src = ev.touches[0];
    if (ev.type && ev.type.indexOf("pointer") === 0) src = ev;
    var x = (src.clientX - r.left) * (c.width / Math.max(1, r.width));
    var y = (src.clientY - r.top) * (c.height / Math.max(1, r.height));
    return { x: x, y: y };
  }

  function start(ev) {
    var c = $("callig-canvas");
    if (!c) return;
    ev.preventDefault();
    state.drawing = true;
    var p = pos(ev, c);
    state.cur = { ink: state.ink, size: state.size, pts: [p] };
  }
  function move(ev) {
    if (!state.drawing || !state.cur) return;
    var c = $("callig-canvas");
    if (!c) return;
    ev.preventDefault();
    state.cur.pts.push(pos(ev, c));
    redraw();
    /* live stroke */
    var ctx = c.getContext("2d");
    var st = state.cur;
    if (st.pts.length < 2) return;
    ctx.beginPath();
    ctx.strokeStyle = st.ink;
    ctx.lineWidth = st.size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    var a = st.pts[st.pts.length - 2], b = st.pts[st.pts.length - 1];
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  function end(ev) {
    if (!state.drawing) return;
    state.drawing = false;
    if (state.cur && state.cur.pts.length > 1) state.strokes.push(state.cur);
    state.cur = null;
    redraw();
  }

  function wireCanvas(c) {
    if (c.__nukeWired) return;
    c.__nukeWired = true;
    c.style.touchAction = "none";
    if (w.PointerEvent) {
      c.addEventListener("pointerdown", function (ev) {
        try { c.setPointerCapture(ev.pointerId); } catch (e) {}
        start(ev);
      });
      c.addEventListener("pointermove", move);
      c.addEventListener("pointerup", end);
      c.addEventListener("pointercancel", end);
    } else {
      c.addEventListener("mousedown", start);
      c.addEventListener("mousemove", move);
      c.addEventListener("mouseup", end);
      c.addEventListener("mouseleave", end);
      c.addEventListener("touchstart", start, { passive: false });
      c.addEventListener("touchmove", move, { passive: false });
      c.addEventListener("touchend", end);
    }
  }

  function setGlyph(g) {
    state.glyph = g || "ا";
    state.strokes = [];
    redraw();
    var tip = $("callig-tajweed-tip");
    if (tip) tip.textContent = "Guide: " + state.glyph + " · trace over it · educational only — not a fatwa";
    d.querySelectorAll("[data-callig-glyph]").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-callig-glyph") === state.glyph);
    });
  }

  function boot() {
    var c = $("callig-canvas");
    if (!c) return false;
    c.width = 900;
    c.height = 420;
    /* sync UI */
    var guide = $("callig-guide");
    if (guide) state.guide = !!guide.checked;
    var script = $("callig-script");
    if (script) state.script = script.value || "naskh";
    var ink = $("callig-ink");
    if (ink) state.ink = ink.value || state.ink;
    var size = $("callig-size");
    if (size) state.size = +size.value || 14;
    wireCanvas(c);
    redraw();
    /* fonts late */
    try {
      if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { redraw(); });
    } catch (e) {}
    return true;
  }

  function wireUi() {
    d.querySelectorAll("[data-callig-glyph]").forEach(function (btn) {
      if (btn.__nuke) return;
      btn.__nuke = true;
      btn.addEventListener("click", function () {
        setGlyph(btn.getAttribute("data-callig-glyph") || "ا");
      });
    });
    var guide = $("callig-guide");
    if (guide && !guide.__nuke) {
      guide.__nuke = true;
      guide.addEventListener("change", function () {
        state.guide = !!guide.checked;
        redraw();
      });
    }
    var script = $("callig-script");
    if (script && !script.__nuke) {
      script.__nuke = true;
      script.addEventListener("change", function () {
        state.script = script.value;
        redraw();
      });
    }
    var ink = $("callig-ink");
    if (ink && !ink.__nuke) {
      ink.__nuke = true;
      ink.addEventListener("input", function () { state.ink = ink.value; });
    }
    var size = $("callig-size");
    if (size && !size.__nuke) {
      size.__nuke = true;
      size.addEventListener("input", function () { state.size = +size.value || 14; });
    }
    var clr = $("callig-clear");
    if (clr && !clr.__nuke) {
      clr.__nuke = true;
      clr.addEventListener("click", function () {
        state.strokes = [];
        redraw();
      });
    }
    var undo = $("callig-undo");
    if (undo && !undo.__nuke) {
      undo.__nuke = true;
      undo.addEventListener("click", function () {
        state.strokes.pop();
        redraw();
      });
    }
  }

  /* public API compat */
  w.calligInit = boot;
  w.calligDrawGuide = redraw;
  w.calligSetGlyph = setGlyph;
  w.calligClear = function () { state.strokes = []; redraw(); };
  w.calligUndo = function () { state.strokes.pop(); redraw(); };
  w.calligState = state;

  var tries = 0;
  function tick() {
    tries++;
    wireUi();
    if (boot()) {
      setTimeout(redraw, 300);
      setTimeout(redraw, 1000);
      return;
    }
    if (tries < 50) setTimeout(tick, 120);
  }

  function onMount(ev) {
    var tab = "";
    try { tab = String((ev && ev.detail && ev.detail.tab) || "").toLowerCase(); } catch (e) {}
    if (tab && tab !== "reminder") return;
    tries = 0;
    setTimeout(tick, 40);
  }
  d.addEventListener("clarity:tab-mounted", onMount);
  w.addEventListener("clarity:tab-mounted", onMount);
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(tick, 80); });
  else setTimeout(tick, 80);
  try {
    new MutationObserver(function () {
      if ($("callig-canvas") && !$("callig-canvas").__nukeWired) {
        tries = 0;
        tick();
      }
    }).observe(d.documentElement, { childList: true, subtree: true });
  } catch (e2) {}
})(window, document);
