/*! craft-calligraphy-pad-v1 · C19CALLIG3
 * Natural stroke pad: pointer pressure · velocity width · smoothing · undo
 * Learning path: faint → hollow → beside → memory (mashq-style)
 * Educational only — not an ijāzah / fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_CALLIG_PAD_V1__) return;
  w.__CRAFT_CALLIG_PAD_V1__ = true;

  var STORE = "clarity.craft.callig.progress.v1";
  var CFG = {
    baseWidth: 5.5,
    minWidth: 1.6,
    maxWidth: 14,
    smooth: 0.65,
    ink: "#1a1a1a",
    paper: "#f4efe3"
  };

  /* Ruqʿah-first path (people's script) — alif = 3 dots teaching note */
  var CURRICULUM = {
    ruqah: {
      label: "Ruqʿah",
      note: "Everyday hand · alif ≈ 3 dots tall · start here for steady handwriting.",
      glyphs: [
        { ar: "ا", en: "Alif", tip: "Straight stem · the yardstick for every letter." },
        { ar: "ب", en: "Bāʾ", tip: "Open bowl · one dot below." },
        { ar: "ت", en: "Tāʾ", tip: "Same body as bāʾ · two dots above." },
        { ar: "ث", en: "Thāʾ", tip: "Same body · three dots above." },
        { ar: "ن", en: "Nūn", tip: "Deep bowl · one dot above." },
        { ar: "ي", en: "Yāʾ", tip: "Bowl with two dots below (final form practice free)." },
        { ar: "ح", en: "Ḥāʾ", tip: "Closed loop family starter." },
        { ar: "س", en: "Sīn", tip: "Three teeth · even rhythm." },
        { ar: "م", en: "Mīm", tip: "Small loop · sit on the line." },
        { ar: "ل", en: "Lām", tip: "Tall stem into a soft foot." },
        { ar: "و", en: "Wāw", tip: "Head + open tail." },
        { ar: "ه", en: "Hāʾ", tip: "Round medial practice · keep light." }
      ]
    },
    naskh: {
      label: "Naskh",
      note: "Book hand · alif ≈ 5 dots · classical path companion to Thuluth.",
      glyphs: [
        { ar: "ا", en: "Alif", tip: "Five-dot height ideal · slight right lean optional." },
        { ar: "ب", en: "Bāʾ", tip: "Balanced bowl · baseline clear." },
        { ar: "س", en: "Sīn", tip: "Even teeth · measured spacing." },
        { ar: "ص", en: "Ṣād", tip: "Wide eye · closed form discipline." },
        { ar: "ع", en: "ʿAyn", tip: "Two-story form awareness." },
        { ar: "ك", en: "Kāf", tip: "S-curve stem practice." },
        { ar: "الله", en: "Allāh", tip: "Lām-alif family · reverence in spacing." }
      ]
    },
    thuluth: {
      label: "Thuluth",
      note: "Mother of scripts · alif ≈ 7 dots · angle-sensitive (practice slow).",
      glyphs: [
        { ar: "ا", en: "Alif", tip: "Tall · deliberate entry angle." },
        { ar: "ب", en: "Bāʾ", tip: "Generous bowl · heavy-to-light stroke." },
        { ar: "ح", en: "Ḥāʾ", tip: "Open swing · watch the return." },
        { ar: "س", en: "Sīn", tip: "Rhythmic teeth · not cramped." },
        { ar: "م", en: "Mīm", tip: "Elegant loop · lift cleanly." },
        { ar: "الله", en: "Allāh", tip: "Composition practice · educational only." }
      ]
    }
  };

  var STEPS = [
    { id: "faint", label: "1 · Trace faint", cls: "", pass: 0 },
    { id: "hollow", label: "2 · Hollow guide", cls: "hollow", pass: 0 },
    { id: "beside", label: "3 · Beside model", cls: "beside", pass: 0 },
    { id: "memory", label: "4 · From memory", cls: "memory", pass: 0 }
  ];

  var state = {
    script: "ruqah",
    glyphIdx: 0,
    stepIdx: 0,
    strokes: [],
    current: null,
    drawing: false,
    guideOn: true,
    progress: {}
  };

  function $(id) { return d.getElementById(id); }

  function loadProgress() {
    try {
      var p = JSON.parse(localStorage.getItem(STORE) || "{}");
      if (p && typeof p === "object") state.progress = p;
    } catch (e) {}
  }
  function saveProgress() {
    try { localStorage.setItem(STORE, JSON.stringify(state.progress)); } catch (e) {}
  }
  function progKey() {
    var g = CURRICULUM[state.script].glyphs[state.glyphIdx];
    return state.script + ":" + (g && g.ar) + ":" + STEPS[state.stepIdx].id;
  }

  function canvas() { return $("cal-canvas"); }

  function pos(ev, c) {
    var r = c.getBoundingClientRect();
    var x = (ev.clientX - r.left) * (c.width / Math.max(1, r.width));
    var y = (ev.clientY - r.top) * (c.height / Math.max(1, r.height));
    var pressure = typeof ev.pressure === "number" && ev.pressure > 0 ? ev.pressure : 0.5;
    if (ev.pointerType === "mouse" && !(ev.buttons > 0 && ev.pressure)) pressure = 0.5;
    return { x: x, y: y, p: pressure, t: Date.now() };
  }

  function widthFor(pt, prev) {
    var p = pt.p > 0 ? pt.p : 0.5;
    var w = CFG.baseWidth * (0.45 + p * 1.1);
    if (prev && prev.t) {
      var dt = Math.max(1, pt.t - prev.t);
      var dist = Math.hypot(pt.x - prev.x, pt.y - prev.y);
      var speed = dist / dt; /* px/ms */
      /* faster → slightly thinner (ink lift illusion) */
      w *= Math.max(0.55, Math.min(1.25, 1.05 - speed * 0.35));
    }
    return Math.max(CFG.minWidth, Math.min(CFG.maxWidth, w));
  }

  function smoothPoint(a, b, t) {
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, p: a.p + (b.p - a.p) * t, t: b.t };
  }

  function drawStroke(ctx, pts) {
    if (!pts || pts.length < 2) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = CFG.ink;
    for (var i = 1; i < pts.length; i++) {
      var a = pts[i - 1], b = pts[i];
      var mid = smoothPoint(a, b, CFG.smooth);
      var w = (widthFor(a, pts[i - 2] || a) + widthFor(b, a)) / 2;
      ctx.beginPath();
      ctx.lineWidth = w;
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(a.x, a.y, mid.x, mid.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.lineWidth = w;
      ctx.moveTo(mid.x, mid.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }

  function paintPaper(ctx, c) {
    ctx.fillStyle = CFG.paper;
    ctx.fillRect(0, 0, c.width, c.height);
    /* soft baseline */
    ctx.strokeStyle = "rgba(26,40,32,0.08)";
    ctx.lineWidth = 1;
    var mid = c.height * 0.62;
    ctx.beginPath();
    ctx.moveTo(c.width * 0.06, mid);
    ctx.lineTo(c.width * 0.94, mid);
    ctx.stroke();
  }

  function redraw() {
    var c = canvas();
    if (!c) return;
    var ctx = c.getContext("2d");
    paintPaper(ctx, c);
    state.strokes.forEach(function (s) { drawStroke(ctx, s.pts); });
    if (state.current && state.current.pts) drawStroke(ctx, state.current.pts);
  }

  function status(msg) {
    var el = $("cal-status");
    if (el) el.textContent = msg || "";
  }

  function updateGuide() {
    var layer = $("cal-guide-layer");
    var meta = $("cal-lesson-meta");
    var g = CURRICULUM[state.script].glyphs[state.glyphIdx];
    var step = STEPS[state.stepIdx];
    if (layer) {
      layer.textContent = state.guideOn ? (g && g.ar) || "" : "";
      layer.className = step.cls || "";
      if (!state.guideOn) layer.className = "memory";
    }
    if (meta && g) {
      meta.innerHTML =
        "<strong>" + CURRICULUM[state.script].label + " · " + g.en + " (" + g.ar + ")</strong> — " +
        step.label + "<br/><span class='panel-note'>" + (g.tip || "") + " · " + (CURRICULUM[state.script].note || "") + "</span>";
    }
    var meter = $("cal-progress-meter");
    if (meter) {
      var keys = Object.keys(state.progress).filter(function (k) { return k.indexOf(state.script + ":") === 0 && state.progress[k]; });
      var total = CURRICULUM[state.script].glyphs.length * STEPS.length;
      meter.style.width = Math.min(100, Math.round((keys.length / Math.max(1, total)) * 100)) + "%";
    }
  }

  function onDown(ev) {
    var c = canvas();
    if (!c) return;
    try { c.setPointerCapture(ev.pointerId); } catch (e) {}
    state.drawing = true;
    var p = pos(ev, c);
    state.current = { pts: [p] };
    try { ev.preventDefault(); } catch (e2) {}
  }
  function onMove(ev) {
    if (!state.drawing || !state.current) return;
    var c = canvas();
    var p = pos(ev, c);
    /* coalesced events for smoother stylus */
    var pts = typeof ev.getCoalescedEvents === "function" ? ev.getCoalescedEvents() : null;
    if (pts && pts.length) {
      for (var i = 0; i < pts.length; i++) state.current.pts.push(pos(pts[i], c));
    } else {
      state.current.pts.push(p);
    }
    redraw();
    try { ev.preventDefault(); } catch (e) {}
  }
  function onUp(ev) {
    if (!state.drawing) return;
    state.drawing = false;
    if (state.current && state.current.pts && state.current.pts.length > 1) {
      state.strokes.push(state.current);
    }
    state.current = null;
    redraw();
    try { if (ev) cRelease(ev); } catch (e) {}
  }
  function cRelease(ev) {
    var c = canvas();
    if (c && ev) try { c.releasePointerCapture(ev.pointerId); } catch (e) {}
  }

  function bindPad() {
    var c = canvas();
    if (!c || c.__craftPadBound) return;
    c.__craftPadBound = true;
    c.style.touchAction = "none";
    c.addEventListener("pointerdown", onDown);
    c.addEventListener("pointermove", onMove);
    c.addEventListener("pointerup", onUp);
    c.addEventListener("pointercancel", onUp);
    c.addEventListener("pointerleave", function (e) { if (state.drawing) onUp(e); });
    /* size for crispness */
    var wrap = c.parentElement;
    var cssW = (wrap && wrap.clientWidth) || 640;
    c.width = Math.min(1400, Math.max(640, Math.floor(cssW * 2)));
    c.height = Math.round(c.width * 0.52);
    redraw();
  }

  function markStepDone() {
    state.progress[progKey()] = Date.now();
    saveProgress();
    updateGuide();
    status("Step logged on-device · " + STEPS[state.stepIdx].label + " · educational only");
  }

  function clearPad() {
    state.strokes = [];
    state.current = null;
    redraw();
    status("Pad cleared");
  }
  function undo() {
    state.strokes.pop();
    redraw();
  }
  function exportPng() {
    var c = canvas();
    if (!c) return;
    try {
      var a = d.createElement("a");
      a.href = c.toDataURL("image/png");
      a.download = "clarity-craft-callig-" + Date.now() + ".png";
      a.click();
      status("PNG exported · educational watermark free · not an ijāzah");
    } catch (e) {
      status("Export failed");
    }
  }

  function renderChrome() {
    var host = $("cal-fallback") || $("cg-root") || d.querySelector(".tool-section");
    if (!host) return;
    if ($("cal-enrich-root")) return;

    var root = d.createElement("div");
    root.id = "cal-enrich-root";
    root.innerHTML =
      '<div class="cal-lesson-card">' +
      "<h3>Learning path · mashq steps</h3>" +
      '<p id="cal-lesson-meta" class="panel-note">Choose a script and letter.</p>' +
      '<div class="cal-meter" aria-hidden="true"><span id="cal-progress-meter"></span></div>' +
      '<div class="cal-script-pills" id="cal-scripts" role="group" aria-label="Script"></div>' +
      '<div class="cal-step-pills" id="cal-steps" role="group" aria-label="Step"></div>' +
      '<div class="cal-glyph-grid" id="cal-glyphs" role="group" aria-label="Letters"></div>' +
      "</div>" +
      '<div class="cal-toolbar">' +
      '<label>Nib <input type="range" id="cal-nib" min="2" max="12" step="0.5" value="' + CFG.baseWidth + '"/></label>' +
      '<label>Smooth <input type="range" id="cal-smooth" min="0.2" max="0.9" step="0.05" value="' + CFG.smooth + '"/></label>' +
      '<button type="button" class="btn" id="cal-guide-toggle">Toggle guide</button>' +
      '<button type="button" class="btn" id="cal-step-done">Mark step done</button>' +
      "</div>";

    /* ensure pad wrap + guide layer */
    var canvasEl = $("cal-canvas");
    if (canvasEl && !canvasEl.closest(".cal-pad-wrap")) {
      var wrap = d.createElement("div");
      wrap.className = "cal-pad-wrap";
      wrap.id = "cal-pad-wrap";
      canvasEl.parentNode.insertBefore(wrap, canvasEl);
      wrap.appendChild(canvasEl);
      var guide = d.createElement("div");
      guide.id = "cal-guide-layer";
      guide.setAttribute("aria-hidden", "true");
      wrap.insertBefore(guide, canvasEl);
    }

    var padWrap = $("cal-pad-wrap") || canvasEl && canvasEl.parentNode;
    if (padWrap) padWrap.parentNode.insertBefore(root, padWrap);
    else host.insertBefore(root, host.firstChild);

    /* scripts */
    var scripts = $("cal-scripts");
    Object.keys(CURRICULUM).forEach(function (key) {
      var b = d.createElement("button");
      b.type = "button";
      b.textContent = CURRICULUM[key].label;
      b.setAttribute("data-script", key);
      if (key === state.script) b.classList.add("active");
      b.addEventListener("click", function () {
        state.script = key;
        state.glyphIdx = 0;
        state.stepIdx = 0;
        scripts.querySelectorAll("button").forEach(function (x) { x.classList.toggle("active", x === b); });
        fillGlyphs();
        updateGuide();
        clearPad();
      });
      scripts.appendChild(b);
    });

    var steps = $("cal-steps");
    STEPS.forEach(function (s, i) {
      var b = d.createElement("button");
      b.type = "button";
      b.textContent = s.label;
      if (i === state.stepIdx) b.classList.add("active");
      b.addEventListener("click", function () {
        state.stepIdx = i;
        steps.querySelectorAll("button").forEach(function (x) { x.classList.toggle("active", x === b); });
        updateGuide();
      });
      steps.appendChild(b);
    });

    function fillGlyphs() {
      var grid = $("cal-glyphs");
      grid.innerHTML = "";
      CURRICULUM[state.script].glyphs.forEach(function (g, i) {
        var b = d.createElement("button");
        b.type = "button";
        b.textContent = g.ar;
        b.title = g.en;
        if (i === state.glyphIdx) b.classList.add("active");
        b.addEventListener("click", function () {
          state.glyphIdx = i;
          grid.querySelectorAll("button").forEach(function (x) { x.classList.toggle("active", x === b); });
          updateGuide();
          clearPad();
        });
        grid.appendChild(b);
      });
    }
    fillGlyphs();

    $("cal-nib").addEventListener("input", function (e) {
      CFG.baseWidth = parseFloat(e.target.value) || 5.5;
    });
    $("cal-smooth").addEventListener("input", function (e) {
      CFG.smooth = parseFloat(e.target.value) || 0.65;
    });
    $("cal-guide-toggle").addEventListener("click", function () {
      state.guideOn = !state.guideOn;
      updateGuide();
    });
    $("cal-step-done").addEventListener("click", markStepDone);

    /* wire existing buttons if present */
    var clr = $("cal-clear");
    if (clr && !clr._craft) { clr._craft = true; clr.addEventListener("click", clearPad); }
    var und = $("cal-undo");
    if (und && !und._craft) { und._craft = true; und.addEventListener("click", undo); }
    var exp = $("cal-export");
    if (exp && !exp._craft) { exp._craft = true; exp.addEventListener("click", exportPng); }

    updateGuide();
  }

  function boot() {
    loadProgress();
    renderChrome();
    bindPad();
    setTimeout(bindPad, 400);
    status("Pad ready · stylus pressure & velocity width · educational only");
  }

  w.CraftCalligPad = {
    redraw: redraw,
    clear: clearPad,
    undo: undo,
    exportPng: exportPng,
    curriculum: CURRICULUM,
    strokeCount: function () { return state.strokes.length; },
    setFocus: function (script, glyph) {
      if (script && CURRICULUM[script]) {
        state.script = script;
        state.glyphIdx = 0;
        var gs = CURRICULUM[script].glyphs;
        for (var i = 0; i < gs.length; i++) {
          if (glyph && (gs[i].ar === glyph || glyph.indexOf(gs[i].ar) === 0)) { state.glyphIdx = i; break; }
        }
        try {
          d.querySelectorAll("#cal-scripts [data-script]").forEach(function (b) {
            b.classList.toggle("active", b.getAttribute("data-script") === script);
          });
          var grid = d.getElementById("cal-glyphs");
          if (grid) {
            /* re-click script if possible */
          }
        } catch (e) {}
        if (typeof updateGuide === "function") updateGuide();
        clearPad();
      }
    }
  };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(boot, 200); });
})(window, document);
