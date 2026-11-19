/*! companion-meme-merge-v1
 * Single canvas authority: safe frame, bottom ref, quiet status, wins after BG/text fetch
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_MERGE_V1__) return;
  w.__COMPANION_MEME_MERGE_V1__ = true;

  var lastStatus = 0;
  function softStatus(msg) {
    var el = d.getElementById("meme-fetch-status") || d.getElementById("meme-rrra-status");
    if (!el) return;
    var m = (msg == null ? "" : String(msg));
    if (/·\s*ok\s*$/i.test(m) || /^(ok|ready|done)$/i.test(m.trim())) m = "";
    if (/Loading scene/i.test(m)) {
      var now = Date.now();
      if (now - lastStatus < 300) return;
      lastStatus = now;
    }
    el.textContent = m;
  }

  function S() {
    if (!w.memeState || typeof w.memeState !== "object") {
      w.memeState = {
        top: "", mid: "", bottom: "", ref: "",
        topSize: 42, midSize: 22, bottomSize: 14, outline: 3,
        blankColor1: "#0b1220", blankColor2: "#1a1030"
      };
    }
    return w.memeState;
  }

  function readInputs() {
    var s = S();
    [["meme-top-input","top"],["meme-mid-input","mid"],["meme-bottom-input","bottom"]].forEach(function (p) {
      var el = d.getElementById(p[0]);
      if (el) s[p[1]] = el.value || "";
    });
    var bot = (s.bottom || "").trim();
    if (/qur.?n|ḥadīth|hadith|bukhār|muslim|sunnah|ayah|āyah|:\s*\d/i.test(bot)) s.ref = bot;
    var refEl = d.querySelector("#meme-ref, .meme-ref, [data-verse-ref]");
    if (refEl) {
      var rv = (refEl.value || refEl.textContent || "").trim();
      if (rv) s.ref = rv;
    }
    if (s.img && !s.img.complete) { /* wait */ }
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
    var words = text.split(/\s+/);
    var lines = [], line = "";
    words.forEach(function (wd) {
      var test = line ? line + " " + wd : wd;
      if (ctx.measureText(test).width <= maxW || !line) line = test;
      else { lines.push(line); line = wd; }
    });
    if (line) lines.push(line);
    return lines.slice(0, 6);
  }

  function paintMerge() {
    var canvas = d.getElementById("meme-canvas");
    if (!canvas) return false;
    var stage = d.getElementById("meme-stage") || canvas.parentElement;
    var rect = (stage || canvas).getBoundingClientRect();
    var cssW = Math.max(300, Math.floor(rect.width || 360));
    var ratio = 9 / 16;
    var active = d.querySelector("[data-meme-ratio].is-active, .mv-chip[data-meme-ratio].active, button[data-meme-ratio].active");
    if (active) {
      var r = active.getAttribute("data-meme-ratio") || "";
      if (r === "1:1") ratio = 1;
      else if (r === "9:16") ratio = 16 / 9;
      else if (r === "16:9") ratio = 9 / 16;
      else if (String(r).indexOf("1.91") >= 0) ratio = 1 / 1.91;
    }
    var cssH = Math.floor(cssW * ratio);
    var dpr = Math.min(2, w.devicePixelRatio || 1);
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    canvas.style.display = "block";
    canvas.style.borderRadius = "12px";

    var ctx = canvas.getContext("2d");
    if (!ctx) return false;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var W = cssW, H = cssH;
    var s = readInputs();

    if (s.img && s.img.complete && s.img.naturalWidth) {
      try {
        var iw = s.img.naturalWidth, ih = s.img.naturalHeight;
        var sc = Math.max(W / iw, H / ih);
        var dw = iw * sc, dh = ih * sc;
        ctx.drawImage(s.img, (W - dw) / 2, (H - dh) / 2, dw, dh);
        ctx.fillStyle = "rgba(0,0,0,0.34)";
        ctx.fillRect(0, 0, W, H);
      } catch (e) { s.img = null; }
    }
    if (!s.img) {
      var g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, s.blankColor1 || "#0b1220");
      g.addColorStop(1, s.blankColor2 || "#1a1030");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    var inset = Math.max(14, Math.floor(Math.min(W, H) * 0.045));
    var stripH = Math.max(32, Math.floor(H * 0.11));
    var safe = { x: inset, y: inset, w: W - inset * 2, h: H - inset * 2 - stripH };

    ctx.save();
    ctx.strokeStyle = "rgba(212,180,90,0.55)";
    ctx.lineWidth = Math.max(2, Math.floor(inset * 0.18));
    ctx.strokeRect(inset * 0.45, inset * 0.45, W - inset * 0.9, H - inset * 0.9);
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(safe.x, safe.y, safe.w, safe.h);
    ctx.setLineDash([]);
    ctx.restore();

    ctx.fillStyle = "rgba(0,0,0,0.42)";
    ctx.fillRect(0, H - stripH - inset * 0.3, W, stripH + inset * 0.3);

    var maxW = safe.w * 0.96;
    var cx = W / 2;

    function drawBlock(text, yCenter, maxSize, weight) {
      text = (text || "").trim();
      if (!text) return;
      var sample = text.split(/\s+/).slice(0, 5).join(" ");
      var size = fitFont(ctx, sample, maxW, maxSize, 11);
      ctx.font = weight + " " + size + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
      var lines = wrap(ctx, text, maxW);
      while (lines.length * size * 1.28 > safe.h * 0.4 && size > 11) {
        size -= 1;
        ctx.font = weight + " " + size + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
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
        ctx.strokeStyle = "rgba(0,0,0,0.72)";
        ctx.lineWidth = Math.max(2, Math.floor(size * 0.12));
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
    if (!ref && /qur.?n|hadith|bukhār|muslim|:\s*\d/i.test(bot)) { ref = bot; bot = ""; }

    drawBlock(top, safe.y + safe.h * 0.28, Math.floor(W * 0.05), "700");
    drawBlock(mid, safe.y + safe.h * 0.58, Math.floor(W * 0.036), "600");
    if (bot) drawBlock(bot, safe.y + safe.h * 0.82, Math.floor(W * 0.03), "600");

    if (ref) {
      var rSize = Math.max(10, Math.floor(W * 0.028));
      ctx.font = "600 " + rSize + "px system-ui, sans-serif";
      var rLines = wrap(ctx, ref, maxW);
      while (rLines.length * rSize * 1.2 > stripH - 8 && rSize > 9) {
        rSize -= 1;
        ctx.font = "600 " + rSize + "px system-ui, sans-serif";
        rLines = wrap(ctx, ref, maxW);
      }
      ctx.fillStyle = "rgba(247,243,232,0.92)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      var ry = H - stripH / 2 - inset * 0.1;
      rLines.slice(0, 2).forEach(function (ln, i) {
        var yy = rLines.length === 1 ? ry : ry + (i - 0.5) * rSize * 1.15;
        ctx.fillText(ln, cx, yy);
      });
    }
    return true;
  }

  var timer = null;
  function schedule(ms) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      timer = null;
      paintMerge();
    }, ms == null ? 50 : ms);
  }

  function rebindGlobals() {
    w.paintMeme = paintMerge;
    w.memeDraw = paintMerge;
    w.memePaintQuiet = paintMerge;
    w.memeAutoScaleLines = function () {
      softStatus("Fit · safe frame");
      paintMerge();
    };
    if (!w.ClarityMemePaintV2) w.ClarityMemePaintV2 = {};
    w.ClarityMemePaintV2.paint = paintMerge;

    // Wrap fetch so every BG load ends in merge paint (studio still uses closed-over paint)
    if (w.memeFetchBg && !w.memeFetchBg.__mergeWrapped) {
      var origBg = w.memeFetchBg;
      w.memeFetchBg = function (kind) {
        softStatus("Scene · " + (kind || ""));
        var ret;
        try { ret = origBg.apply(this, arguments); } catch (e) { ret = null; }
        Promise.resolve(ret).then(function () {
          [80, 250, 600, 1000, 1600, 2200].forEach(function (t) {
            setTimeout(paintMerge, t);
          });
          setTimeout(function () { softStatus(""); }, 1800);
        });
        return ret;
      };
      w.memeFetchBg.__mergeWrapped = true;
    }

    if (w.memeFetchRrra && !w.memeFetchRrra.__mergeWrapped) {
      var origRrra = w.memeFetchRrra;
      w.memeFetchRrra = function () {
        var ret;
        try { ret = origRrra.apply(this, arguments); } catch (e) { ret = null; }
        Promise.resolve(ret).then(function () {
          [200, 500, 900].forEach(function (t) { setTimeout(paintMerge, t); });
        });
        return ret;
      };
      w.memeFetchRrra.__mergeWrapped = true;
    }
  }

  function wireUi() {
    var root = d.getElementById("meme-studio-root") || d;
    root.querySelectorAll("[data-meme-bg], .mv-chip").forEach(function (btn) {
      if (btn.__mergeBg) return;
      btn.__mergeBg = true;
      btn.addEventListener("click", function () {
        schedule(100);
        [300, 700, 1200, 1800, 2400].forEach(function (t) { setTimeout(paintMerge, t); });
      }, true);
    });
    root.querySelectorAll("#meme-top-input, #meme-mid-input, #meme-bottom-input").forEach(function (inp) {
      if (inp.__mergeIn) return;
      inp.__mergeIn = true;
      inp.addEventListener("input", function () { schedule(80); });
    });
  }

  // Intercept canvas redraws that clear our frame: after any studio paint, re-apply merge
  function watchCanvas() {
    var canvas = d.getElementById("meme-canvas");
    if (!canvas || canvas.__mergeWatch) return;
    canvas.__mergeWatch = true;
    var pending = null;
    var desc = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype, "width");
    // lighter: poll size changes + image onload on memeState
    setInterval(function () {
      var s = S();
      if (s.img && s.img.complete && !s.img.__mergeHooked) {
        s.img.__mergeHooked = true;
        s.img.addEventListener("load", function () {
          [50, 200, 500, 1000].forEach(function (t) { setTimeout(paintMerge, t); });
        });
        [50, 200, 500].forEach(function (t) { setTimeout(paintMerge, t); });
      }
    }, 400);
  }

  function boot() {
    rebindGlobals();
    wireUi();
    watchCanvas();
    paintMerge();
  }

  // Keep winning the paint race with studio's delayed setTimeout(paint)
  var n = 0;
  var iv = setInterval(function () {
    n++;
    rebindGlobals();
    wireUi();
    watchCanvas();
    if (n > 40) clearInterval(iv);
  }, 250);

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();

  d.addEventListener("clarity:tab-mounted", function () { setTimeout(boot, 80); });
  w.addEventListener("resize", function () { schedule(60); });
})(window, document);
