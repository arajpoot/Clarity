/*! companion-meme-honest-v1
 * Honest night fix: strip ALWAYS clarity-dawah.fyi · verse ref in content · never paint 21:87 on strip
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_HONEST_V1__) return;
  w.__COMPANION_MEME_HONEST_V1__ = true;

  var STRIP_PROMO = "clarity-dawah.fyi";

  function S() {
    if (!w.memeState || typeof w.memeState !== "object") w.memeState = {};
    var s = w.memeState;
    if (s.topY == null) s.topY = 0.24;
    if (s.midY == null) s.midY = 0.48;
    if (s.botY == null) s.botY = 0.72;
    if (s.scaleTop == null) s.scaleTop = 100;
    if (s.scaleMid == null) s.scaleMid = 100;
    if (s.scaleBot == null) s.scaleBot = 95;
    return s;
  }

  function status(msg) {
    var el = d.getElementById("meme-fetch-status") || d.getElementById("meme-rrra-status");
    if (el) el.textContent = msg || "";
  }

  function normRef(raw) {
    var r = String(raw || "").trim();
    if (!r) return "";
    if (/https?:|www\.|clarity-dawah|educational only/i.test(r)) return "";
    // bare clock-like only if valid quran pair AND user labeled — still prefer Qur'an prefix
    var q = r.match(/(?:Qur['']?a?n)?\s*(\d{1,3})\s*[:：]\s*(\d{1,3})/i);
    if (q) {
      var a = parseInt(q[1], 10), b = parseInt(q[2], 10);
      if (a >= 1 && a <= 114 && b >= 1 && b <= 286) return "Qur'an " + a + ":" + b;
      return "";
    }
    if (/bukhārī|muslim|tirmidhī/i.test(r)) return r.slice(0, 60);
    return "";
  }

  function readState() {
    var s = S();
    var ti = d.getElementById("meme-top-input");
    var mi = d.getElementById("meme-mid-input");
    var bi = d.getElementById("meme-bottom-input");
    if (ti) s.top = ti.value || s.top || "";
    if (mi) s.mid = mi.value || s.mid || "";
    if (bi) {
      var bv = (bi.value || "").trim();
      if (bv) {
        var maybe = normRef(bv);
        if (maybe) s.ref = maybe;
        else if (!/^\d{1,2}:\d{2}$/.test(bv)) s.bottom = bv;
      }
    }
    // Prefer explicit ref field
    if (s.ref) s.ref = normRef(s.ref);
    // If bottom is only a citation, treat as ref not urdu
    if (s.bottom) {
      var br = normRef(s.bottom);
      if (br) {
        s.ref = br;
        s.bottom = "";
      }
    }
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
    return lines.slice(0, 5);
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
      var rr = active.getAttribute("data-meme-ratio") || "";
      if (rr === "1:1") ratio = 1;
      else if (rr === "9:16") ratio = 16 / 9;
      else if (rr === "16:9") ratio = 9 / 16;
    }
    var cssH = Math.floor(cssW * ratio);
    var dpr = Math.min(2, w.devicePixelRatio || 1);
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    canvas.style.borderRadius = "14px";
    var ctx = canvas.getContext("2d");
    if (!ctx) return false;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var W = cssW, H = cssH;
    var s = readState();
    var verseRef = normRef(s.ref);

    var bg = s.bgImage || s.img;
    if (bg && bg.complete && bg.naturalWidth) {
      try {
        var iw = bg.naturalWidth, ih = bg.naturalHeight;
        var sc = Math.max(W / iw, H / ih);
        ctx.drawImage(bg, (W - iw * sc) / 2, (H - ih * sc) / 2, iw * sc, ih * sc);
        ctx.fillStyle = "rgba(0,0,0,0.28)";
        ctx.fillRect(0, 0, W, H);
      } catch (e) { bg = null; }
    }
    if (!bg || !bg.naturalWidth) {
      var g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, s.blankColor1 || "#0b1220");
      g.addColorStop(1, s.blankColor2 || "#1a1030");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    var inset = Math.max(16, Math.floor(Math.min(W, H) * 0.05));
    var stripH = Math.max(30, Math.floor(H * 0.11));
    var safe = { x: inset, y: inset, w: W - inset * 2, h: H - inset * 2 - stripH };

    // gold frame
    ctx.strokeStyle = "rgba(212,175,55,0.85)";
    ctx.lineWidth = Math.max(3, Math.floor(inset * 0.2));
    ctx.strokeRect(inset * 0.5, inset * 0.5, W - inset, H - inset);
    ctx.strokeStyle = "rgba(255,230,150,0.5)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(inset * 0.85, inset * 0.85, W - inset * 1.7, H - inset * 1.7);

    // strip background
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(inset * 0.6, H - stripH - inset * 0.15, W - inset * 1.2, stripH + inset * 0.1);

    var maxW = safe.w * 0.92, cx = W / 2;

    function drawBlock(text, yFrac, scalePct, base, fill) {
      text = (text || "").trim();
      if (!text) return;
      var yCenter = safe.y + safe.h * Math.max(0.08, Math.min(0.92, yFrac));
      var maxSize = Math.floor(base * (Math.max(50, Math.min(180, scalePct || 100)) / 100));
      var size = fitFont(ctx, text.split(/\s+/).slice(0, 6).join(" "), maxW, maxSize, 10);
      ctx.font = "700 " + size + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
      var lines = wrap(ctx, text, maxW);
      while (lines.length * size * 1.28 > safe.h * 0.34 && size > 10) {
        size -= 1;
        ctx.font = "700 " + size + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
        lines = wrap(ctx, text, maxW);
      }
      var lh = size * 1.28, blockH = lines.length * lh;
      var y0 = yCenter - blockH / 2 + size;
      if (y0 - size < safe.y) y0 = safe.y + size;
      if (y0 + blockH > safe.y + safe.h) y0 = Math.max(safe.y + size, safe.y + safe.h - blockH);
      lines.forEach(function (ln, i) {
        var y = y0 + i * lh;
        ctx.lineJoin = "round";
        ctx.strokeStyle = "rgba(0,0,0,0.65)";
        ctx.lineWidth = Math.max(2, Math.floor(size * 0.1));
        ctx.fillStyle = fill || "#fff8e7";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.strokeText(ln, cx, y);
        ctx.fillText(ln, cx, y);
      });
    }

    drawBlock(s.top, s.topY, s.scaleTop, Math.floor(W * 0.055));
    drawBlock(s.mid, s.midY, s.scaleMid, Math.floor(W * 0.036));

    // Content band: Urdu body AND/OR verse reference (never on strip)
    var urdu = (s.bottom || "").trim();
    if (urdu && (/^\d+:\d+$/.test(urdu) || /^Qur/i.test(urdu))) urdu = "";
    if (urdu) {
      drawBlock(urdu, s.botY, s.scaleBot, Math.floor(W * 0.032));
      if (verseRef) drawBlock(verseRef, Math.min(0.9, s.botY + 0.12), 90, Math.floor(W * 0.026), "rgba(255,248,230,0.95)");
    } else if (verseRef) {
      drawBlock(verseRef, s.botY, s.scaleBot, Math.floor(W * 0.03), "rgba(255,248,230,0.95)");
    }

    // STRIP — only promo. Never ref. Never 21:87.
    var pSize = Math.max(12, Math.floor(W * 0.03));
    ctx.font = "600 " + pSize + "px system-ui, sans-serif";
    ctx.fillStyle = "rgba(255, 230, 150, 0.95)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(STRIP_PROMO, cx, H - stripH / 2 - inset * 0.05);

    // clickable overlay
    if (stage) {
      if (getComputedStyle(stage).position === "static") stage.style.position = "relative";
      var link = d.getElementById("meme-strip-link");
      if (!link) {
        link = d.createElement("a");
        link.id = "meme-strip-link";
        link.href = "https://clarity-dawah.fyi/";
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.title = "clarity-dawah.fyi";
        link.style.cssText = "position:absolute;left:10%;width:80%;bottom:3%;height:12%;z-index:8;background:transparent;";
        stage.appendChild(link);
      }
    }
    return true;
  }

  function claim() {
    w.paintMeme = paint;
    w.memeDraw = paint;
    w.memePaintQuiet = paint;
    if (!w.ClarityMemePaintV2) w.ClarityMemePaintV2 = {};
    w.ClarityMemePaintV2.paint = paint;
  }

  function injectCss() {
    if (d.getElementById("meme-honest-css")) return;
    var s = d.createElement("style");
    s.id = "meme-honest-css";
    s.textContent =
      "#meme-rich-controls,#meme-peace-sliders,#meme-stable-size{display:none!important}" +
      "#meme-night-size{display:flex!important;flex-wrap:wrap;gap:.4rem;align-items:center}";
    (d.head || d.documentElement).appendChild(s);
  }

  function boot() {
    injectCss();
    claim();
    paint();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  d.addEventListener("clarity:tab-mounted", function () { setTimeout(boot, 60); });
  w.addEventListener("resize", function () { paint(); });

  // Win the paint race: re-claim and repaint after other scripts' delayed paints
  var n = 0;
  var iv = setInterval(function () {
    n++;
    claim();
    paint();
    if (n >= 25) clearInterval(iv);
  }, 200);

  // Also after BG load delays
  var _fetch = w.memeFetchBg;
  w.memeFetchBg = function (k) {
    var r = typeof _fetch === "function" ? _fetch.apply(this, arguments) : null;
    [100, 400, 900, 1500].forEach(function (t) {
      setTimeout(function () {
        claim();
        paint();
      }, t);
    });
    return r;
  };
})(window, document);
