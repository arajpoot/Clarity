/*! companion-meme-studio-rich-v1
 * Calm BG (bgImage), safe-frame paint, scale+position sliders, movable text bands
 * Educational only — not a fatwa. Scenery / geometry only.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_STUDIO_RICH_V1__) return;
  w.__COMPANION_MEME_STUDIO_RICH_V1__ = true;

  function S() {
    if (!w.memeState || typeof w.memeState !== "object") w.memeState = {};
    var s = w.memeState;
    if (s.top == null) s.top = "";
    if (s.mid == null) s.mid = "";
    if (s.bottom == null) s.bottom = "";
    if (s.ref == null) s.ref = "";
    if (s.posTop == null) s.posTop = 28;
    if (s.posMid == null) s.posMid = 58;
    if (s.posBot == null) s.posBot = 82;
    if (s.scaleTop == null) s.scaleTop = 100;
    if (s.scaleMid == null) s.scaleMid = 100;
    if (s.scaleBot == null) s.scaleBot = 100;
    if (s.blankColor1 == null) s.blankColor1 = "#0b1220";
    if (s.blankColor2 == null) s.blankColor2 = "#1a1030";
    return s;
  }

  var statusTimer = null;
  function status(msg, sticky) {
    var el = d.getElementById("meme-fetch-status") || d.getElementById("meme-rrra-status");
    if (!el) return;
    var m = msg == null ? "" : String(msg);
    if (/·\s*ok\s*$/i.test(m)) m = m.replace(/\s*·\s*ok\s*$/i, "");
    el.textContent = m;
    if (statusTimer) clearTimeout(statusTimer);
    if (m && !sticky) {
      statusTimer = setTimeout(function () {
        if (el.textContent === m) el.textContent = "";
      }, 2200);
    }
  }

  /* Curated scenery pools — one URL attempt family, no multi-source spam */
  var SCENES = {
    nature: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1280&q=80"
    ],
    holy: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Mount_Arafat.jpg/800px-Mount_Arafat.jpg",
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1280&q=80"
    ],
    flowers: [
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1280&q=80",
      "https://images.unsplash.com/photo-1462275646964-a0e2d0693f7d?w=1280&q=80"
    ],
    night: [
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1280&q=80",
      "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1280&q=80"
    ],
    water: [
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1280&q=80",
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1280&q=80"
    ],
    spirit: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1280&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1280&q=80"
    ],
    free: [
      "https://picsum.photos/seed/clarity-free-a/1280/720",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1280&q=80"
    ],
    pattern: [
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1280&q=80"
    ],
    decor: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&q=80"
    ]
  };

  var sceneIdx = {};
  var fetchLock = false;

  function loadScene(kind) {
    kind = String(kind || "nature").toLowerCase().replace(/\s+/g, "");
    if (kind === "blank") {
      var s = S();
      s.img = null;
      s.bgImage = null;
      status("Blank canvas");
      paint();
      return Promise.resolve(true);
    }
    var map = {
      holy: "holy", nature: "nature", flowers: "flowers", night: "night",
      water: "water", spirit: "spirit", free: "free", pattern: "pattern",
      decor: "decor", "contextscene": "spirit", context: "spirit"
    };
    var key = map[kind] || "nature";
    var list = SCENES[key] || SCENES.nature;
    if (sceneIdx[key] == null) sceneIdx[key] = 0;
    var url = list[sceneIdx[key] % list.length];
    sceneIdx[key]++;

    if (fetchLock) return Promise.resolve(false);
    fetchLock = true;
    status("Scene · " + key, true);

    return new Promise(function (resolve) {
      var img = new Image();
      img.crossOrigin = "anonymous";
      var done = false;
      function finish(ok) {
        if (done) return;
        done = true;
        fetchLock = false;
        if (ok) {
          var st = S();
          st.img = img;
          st.bgImage = img;
          status("Scene ready");
          paint();
          resolve(true);
        } else {
          status("Scene unavailable — try another or Blank");
          resolve(false);
        }
      }
      img.onload = function () { finish(true); };
      img.onerror = function () {
        // one quiet fallback in pool
        var alt = list[(sceneIdx[key]) % list.length];
        if (alt && alt !== url) {
          var img2 = new Image();
          img2.crossOrigin = "anonymous";
          img2.onload = function () {
            url = alt;
            img = img2;
            finish(true);
          };
          img2.onerror = function () { finish(false); };
          img2.src = alt;
        } else finish(false);
      };
      img.src = url;
      setTimeout(function () { if (!done) finish(!!(img.complete && img.naturalWidth)); }, 8000);
    });
  }

  function readInputs() {
    var s = S();
    [["meme-top-input", "top"], ["meme-mid-input", "mid"], ["meme-bottom-input", "bottom"]].forEach(function (p) {
      var el = d.getElementById(p[0]);
      if (el) s[p[1]] = el.value || "";
    });
    var bot = (s.bottom || "").trim();
    if (/qur.?n|ḥadīth|hadith|bukhār|muslim|sunnah|ayah|āyah|:\s*\d/i.test(bot)) s.ref = bot;
    return s;
  }

  function fitFont(ctx, sample, maxW, maxSize, minSize) {
    var size = maxSize;
    ctx.font = "700 " + size + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
    while (size > minSize && ctx.measureText(sample).width > maxW) {
      size -= 1;
      ctx.font = "700 " + size + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
    }
    return size;
  }

  function wrap(ctx, text, maxW) {
    text = (text || "").trim();
    if (!text) return [];
    var words = text.split(/\s+/), lines = [], line = "";
    words.forEach(function (wd) {
      var test = line ? line + " " + wd : wd;
      if (ctx.measureText(test).width <= maxW || !line) line = test;
      else { lines.push(line); line = wd; }
    });
    if (line) lines.push(line);
    return lines.slice(0, 6);
  }

  function paint() {
    var canvas = d.getElementById("meme-canvas");
    if (!canvas) return false;
    var stage = d.getElementById("meme-stage") || canvas.parentElement;
    var rect = (stage || canvas).getBoundingClientRect();
    var cssW = Math.max(300, Math.floor(rect.width || 360));
    var ratio = 9 / 16;
    var active = d.querySelector("[data-meme-ratio].is-active, .mv-chip[data-meme-ratio].active");
    if (active) {
      var r = active.getAttribute("data-meme-ratio") || "";
      if (r === "1:1") ratio = 1;
      else if (r === "9:16") ratio = 16 / 9;
      else if (r === "16:9") ratio = 9 / 16;
    }
    var cssH = Math.floor(cssW * ratio);
    var dpr = Math.min(2, w.devicePixelRatio || 1);
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    canvas.style.borderRadius = "12px";

    var ctx = canvas.getContext("2d");
    if (!ctx) return false;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var W = cssW, H = cssH;
    var s = readInputs();
    var bg = s.bgImage || s.img;

    if (bg && bg.complete && bg.naturalWidth) {
      try {
        var iw = bg.naturalWidth, ih = bg.naturalHeight;
        var sc = Math.max(W / iw, H / ih);
        var dw = iw * sc, dh = ih * sc;
        ctx.drawImage(bg, (W - dw) / 2, (H - dh) / 2, dw, dh);
        ctx.fillStyle = "rgba(0,0,0,0.33)";
        ctx.fillRect(0, 0, W, H);
      } catch (e) { bg = null; }
    }
    if (!bg || !bg.naturalWidth) {
      var g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, s.blankColor1);
      g.addColorStop(1, s.blankColor2);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    var inset = Math.max(14, Math.floor(Math.min(W, H) * 0.045));
    var stripH = Math.max(30, Math.floor(H * 0.1));
    var safe = { x: inset, y: inset, w: W - inset * 2, h: H - inset * 2 - stripH };

    ctx.strokeStyle = "rgba(212,180,90,0.5)";
    ctx.lineWidth = Math.max(2, Math.floor(inset * 0.16));
    ctx.strokeRect(inset * 0.4, inset * 0.4, W - inset * 0.8, H - inset * 0.8);
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(safe.x, safe.y, safe.w, safe.h);
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(0, H - stripH - inset * 0.25, W, stripH + inset * 0.25);

    var maxW = safe.w * 0.94;
    var cx = W / 2;

    function drawBlock(text, yPct, scalePct, maxSizeBase) {
      text = (text || "").trim();
      if (!text) return;
      var yCenter = safe.y + (safe.h * (Math.max(8, Math.min(92, yPct)) / 100));
      var maxSize = Math.floor(maxSizeBase * (Math.max(50, Math.min(160, scalePct)) / 100));
      var sample = text.split(/\s+/).slice(0, 5).join(" ");
      var size = fitFont(ctx, sample, maxW, maxSize, 11);
      ctx.font = "700 " + size + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
      var lines = wrap(ctx, text, maxW);
      while (lines.length * size * 1.28 > safe.h * 0.42 && size > 11) {
        size -= 1;
        ctx.font = "700 " + size + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
        lines = wrap(ctx, text, maxW);
      }
      var lh = size * 1.28;
      var blockH = lines.length * lh;
      var y0 = yCenter - blockH / 2 + size;
      if (y0 - size < safe.y) y0 = safe.y + size;
      if (y0 + blockH > safe.y + safe.h) y0 = Math.max(safe.y + size, safe.y + safe.h - blockH);
      lines.forEach(function (ln, i) {
        var y = y0 + i * lh;
        ctx.lineJoin = "round";
        ctx.strokeStyle = "rgba(0,0,0,0.7)";
        ctx.lineWidth = Math.max(2, Math.floor(size * 0.11));
        ctx.fillStyle = "#f7f3e8";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.strokeText(ln, cx, y);
        ctx.fillText(ln, cx, y);
      });
    }

    var top = s.top || "", mid = s.mid || "";
    var ref = (s.ref || "").trim();
    var bot = (s.bottom || "").trim();
    if (ref && bot === ref) bot = "";
    if (!ref && /qur.?n|hadith|bukhār|:\s*\d/i.test(bot)) { ref = bot; bot = ""; }

    drawBlock(top, s.posTop, s.scaleTop, Math.floor(W * 0.052));
    drawBlock(mid, s.posMid, s.scaleMid, Math.floor(W * 0.038));
    if (bot) drawBlock(bot, s.posBot, s.scaleBot, Math.floor(W * 0.03));

    if (ref) {
      var rSize = Math.max(10, Math.floor(W * 0.026));
      ctx.font = "600 " + rSize + "px system-ui, sans-serif";
      var rLines = wrap(ctx, ref, maxW).slice(0, 2);
      ctx.fillStyle = "rgba(247,243,232,0.92)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      var ry = H - stripH / 2;
      rLines.forEach(function (ln, i) {
        ctx.fillText(ln, cx, rLines.length === 1 ? ry : ry + (i - 0.5) * rSize * 1.15);
      });
    }
    return true;
  }

  function injectControls() {
    var root = d.getElementById("meme-studio-root");
    if (!root || d.getElementById("meme-rich-controls")) return;
    var box = d.createElement("div");
    box.id = "meme-rich-controls";
    box.setAttribute("data-enrichment", "added");
    box.style.cssText = "margin:.75rem 0;padding:.75rem .9rem;border:1px solid rgba(212,180,90,.35);border-radius:12px;background:rgba(0,0,0,.2)";
    box.innerHTML =
      '<div style="font-size:.8rem;opacity:.9;margin-bottom:.4rem">Text size &amp; vertical place · drag sliders · stays inside frame</div>' +
      '<label style="display:block;font-size:.78rem;margin:.35rem 0 0">Top (Arabic) size <span id="meme-sv-top">100</span>%</label>' +
      '<input type="range" id="meme-sl-scale-top" min="60" max="140" value="100" style="width:100%"/>' +
      '<label style="display:block;font-size:.78rem;margin:.35rem 0 0">Top vertical place <span id="meme-pv-top">28</span>%</label>' +
      '<input type="range" id="meme-sl-pos-top" min="10" max="90" value="28" style="width:100%"/>' +
      '<label style="display:block;font-size:.78rem;margin:.35rem 0 0">Middle (English) size <span id="meme-sv-mid">100</span>%</label>' +
      '<input type="range" id="meme-sl-scale-mid" min="60" max="140" value="100" style="width:100%"/>' +
      '<label style="display:block;font-size:.78rem;margin:.35rem 0 0">Middle vertical place <span id="meme-pv-mid">58</span>%</label>' +
      '<input type="range" id="meme-sl-pos-mid" min="10" max="90" value="58" style="width:100%"/>' +
      '<label style="display:block;font-size:.78rem;margin:.35rem 0 0">Bottom / body size <span id="meme-sv-bot">100</span>%</label>' +
      '<input type="range" id="meme-sl-scale-bot" min="60" max="140" value="100" style="width:100%"/>' +
      '<label style="display:block;font-size:.78rem;margin:.35rem 0 0">Bottom vertical place <span id="meme-pv-bot">82</span>%</label>' +
      '<input type="range" id="meme-sl-pos-bot" min="10" max="90" value="82" style="width:100%"/>' +
      '<p style="font-size:.75rem;opacity:.85;margin:.5rem 0 0">Educational only — not a fatwa. Reference stays on the lower band.</p>';
    var canvas = d.getElementById("meme-canvas");
    var stage = d.getElementById("meme-stage");
    if (stage && stage.parentNode) stage.parentNode.insertBefore(box, stage.nextSibling);
    else root.appendChild(box);

    function bind(id, key, labelId, isPos) {
      var el = d.getElementById(id);
      if (!el) return;
      el.addEventListener("input", function () {
        var v = parseInt(el.value, 10);
        var s = S();
        s[key] = v;
        var lab = d.getElementById(labelId);
        if (lab) lab.textContent = String(v);
        paint();
      });
    }
    bind("meme-sl-scale-top", "scaleTop", "meme-sv-top");
    bind("meme-sl-scale-mid", "scaleMid", "meme-sv-mid");
    bind("meme-sl-scale-bot", "scaleBot", "meme-sv-bot");
    bind("meme-sl-pos-top", "posTop", "meme-pv-top");
    bind("meme-sl-pos-mid", "posMid", "meme-pv-mid");
    bind("meme-sl-pos-bot", "posBot", "meme-pv-bot");
  }

  function wireBgPills() {
    var root = d.getElementById("meme-studio-root") || d;
    root.querySelectorAll("[data-meme-bg], .mv-chip").forEach(function (btn) {
      if (btn.__richBg) return;
      btn.__richBg = true;
      btn.addEventListener("click", function (ev) {
        var kind = btn.getAttribute("data-meme-bg");
        if (!kind) {
          var t = (btn.textContent || "").toLowerCase();
          if (/nature/.test(t)) kind = "nature";
          else if (/holy/.test(t)) kind = "holy";
          else if (/flower/.test(t)) kind = "flowers";
          else if (/night/.test(t)) kind = "night";
          else if (/water/.test(t)) kind = "water";
          else if (/spirit/.test(t)) kind = "spirit";
          else if (/free/.test(t)) kind = "free";
          else if (/blank/.test(t)) kind = "blank";
          else if (/pattern/.test(t)) kind = "pattern";
          else if (/décor|decor/.test(t)) kind = "decor";
          else return;
        }
        ev.preventDefault();
        ev.stopPropagation();
        loadScene(kind);
      }, true);
    });
  }

  function claimPaint() {
    w.paintMeme = paint;
    w.memeDraw = paint;
    w.memePaintQuiet = paint;
    if (!w.ClarityMemePaintV2) w.ClarityMemePaintV2 = {};
    w.ClarityMemePaintV2.paint = paint;
    w.memeFetchBg = function (k) { return loadScene(k); };
    w.memeAutoScaleLines = function () {
      var s = S();
      s.scaleTop = 100; s.scaleMid = 100; s.scaleBot = 100;
      paint();
      status("Fit · defaults");
    };
  }

  function boot() {
    claimPaint();
    injectControls();
    wireBgPills();
    paint();
  }

  var n = 0;
  var iv = setInterval(function () {
    n++;
    claimPaint();
    wireBgPills();
    if (!d.getElementById("meme-rich-controls")) injectControls();
    if (n > 30) clearInterval(iv);
  }, 400);

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  d.addEventListener("clarity:tab-mounted", function () { setTimeout(boot, 100); });
  w.addEventListener("resize", function () { paint(); });
})(window, document);
