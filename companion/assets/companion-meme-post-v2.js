/*! companion-meme-post-v2
 * Gold-frame studio + X share line (Arabic · English · ref · educational only · clarity-dawah.fyi)
 * Educational only — not a fatwa. Scenery backgrounds preferred.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_POST_V2__) return;
  w.__COMPANION_MEME_POST_V2__ = true;

  function S() {
    if (!w.memeState || typeof w.memeState !== "object") w.memeState = {};
    var s = w.memeState;
    if (s.posTop == null) s.posTop = 26;
    if (s.posMid == null) s.posMid = 50;
    if (s.posBot == null) s.posBot = 72;
    if (s.scaleTop == null) s.scaleTop = 100;
    if (s.scaleMid == null) s.scaleMid = 100;
    if (s.scaleBot == null) s.scaleBot = 95;
    if (s.blankColor1 == null) s.blankColor1 = "#0b1220";
    if (s.blankColor2 == null) s.blankColor2 = "#1a1030";
    return s;
  }

  function hasArabic(t) { return /[\u0600-\u06FF]/.test(t || ""); }
  function hasUrduHints(t) {
    t = t || "";
    return /[\u0600-\u06FF]/.test(t) && /(اے|کرو|ہے|میں|اور|کا|کی|سے|پر|یہ)/.test(t);
  }

  function status(msg) {
    var el = d.getElementById("meme-fetch-status") || d.getElementById("meme-rrra-status");
    if (!el) return;
    var m = (msg || "").replace(/\s*·\s*ok\s*$/i, "");
    el.textContent = m;
  }

  function readInputs() {
    var s = S();
    [["meme-top-input", "top"], ["meme-mid-input", "mid"], ["meme-bottom-input", "bottom"]].forEach(function (p) {
      var el = d.getElementById(p[0]);
      if (el) s[p[1]] = el.value || "";
    });
    var bot = (s.bottom || "").trim();
    var refEl = d.querySelector("#meme-ref, .meme-ref, [data-verse-ref]");
    if (refEl) {
      var rv = (refEl.value || refEl.textContent || "").trim();
      if (rv) s.ref = rv;
    }
    if (!s.ref && /qur.?n\s*\d|hadith|bukhār|muslim|:\s*\d/i.test(bot) && bot.length < 80) {
      s.ref = bot;
    }
    return s;
  }

  function fitFont(ctx, sample, maxW, maxSize, minSize) {
    var size = maxSize;
    ctx.font = "700 " + size + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', 'Noto Nastaliq Urdu', serif";
    while (size > minSize && ctx.measureText(sample).width > maxW) {
      size -= 1;
      ctx.font = "700 " + size + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', 'Noto Nastaliq Urdu', serif";
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

  function drawGoldFrame(ctx, W, H, inset) {
    // Outer soft edge
    ctx.save();
    // Double ornate gold frame (screenshot style)
    var x = inset * 0.55, y = inset * 0.55, w = W - inset * 1.1, h = H - inset * 1.1;
    ctx.strokeStyle = "rgba(212, 175, 55, 0.85)";
    ctx.lineWidth = Math.max(3, Math.floor(inset * 0.22));
    ctx.strokeRect(x, y, w, h);
    ctx.strokeStyle = "rgba(255, 230, 150, 0.55)";
    ctx.lineWidth = Math.max(1.5, Math.floor(inset * 0.1));
    ctx.strokeRect(x + inset * 0.35, y + inset * 0.35, w - inset * 0.7, h - inset * 0.7);
    // corner ticks
    var c = Math.max(10, inset * 0.7);
    ctx.strokeStyle = "rgba(255, 215, 120, 0.75)";
    ctx.lineWidth = 2;
    function corner(cx, cy, dx, dy) {
      ctx.beginPath();
      ctx.moveTo(cx, cy + dy * c);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx + dx * c, cy);
      ctx.stroke();
    }
    corner(x, y, 1, 1);
    corner(x + w, y, -1, 1);
    corner(x, y + h, 1, -1);
    corner(x + w, y + h, -1, -1);
    ctx.restore();
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
    var s = readInputs();
    var bg = s.bgImage || s.img;

    if (bg && bg.complete && bg.naturalWidth) {
      try {
        var iw = bg.naturalWidth, ih = bg.naturalHeight;
        var sc = Math.max(W / iw, H / ih);
        var dw = iw * sc, dh = ih * sc;
        ctx.drawImage(bg, (W - dw) / 2, (H - dh) / 2, dw, dh);
        ctx.fillStyle = "rgba(0,0,0,0.28)";
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

    var inset = Math.max(16, Math.floor(Math.min(W, H) * 0.05));
    var stripH = Math.max(28, Math.floor(H * 0.09));
    var safe = { x: inset, y: inset, w: W - inset * 2, h: H - inset * 2 - stripH * 0.85 };

    drawGoldFrame(ctx, W, H, inset);

    // subtle bottom band for citation only
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(inset, H - stripH - inset * 0.2, W - inset * 2, stripH);

    var maxW = safe.w * 0.92;
    var cx = W / 2;

    function drawBlock(text, yPct, scalePct, maxSizeBase, fill) {
      text = (text || "").trim();
      if (!text) return;
      var yCenter = safe.y + safe.h * (Math.max(10, Math.min(90, yPct)) / 100);
      var maxSize = Math.floor(maxSizeBase * (Math.max(55, Math.min(150, scalePct)) / 100));
      var sample = text.split(/\s+/).slice(0, 6).join(" ");
      var size = fitFont(ctx, sample, maxW, maxSize, 11);
      ctx.font = "700 " + size + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', 'Noto Nastaliq Urdu', serif";
      var lines = wrap(ctx, text, maxW);
      while (lines.length * size * 1.3 > safe.h * 0.36 && size > 11) {
        size -= 1;
        ctx.font = "700 " + size + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', 'Noto Nastaliq Urdu', serif";
        lines = wrap(ctx, text, maxW);
      }
      var lh = size * 1.3;
      var blockH = lines.length * lh;
      var y0 = yCenter - blockH / 2 + size;
      if (y0 - size < safe.y) y0 = safe.y + size;
      if (y0 + blockH > safe.y + safe.h) y0 = Math.max(safe.y + size, safe.y + safe.h - blockH);
      lines.forEach(function (ln, i) {
        var y = y0 + i * lh;
        ctx.lineJoin = "round";
        ctx.strokeStyle = "rgba(0,0,0,0.65)";
        ctx.lineWidth = Math.max(2, Math.floor(size * 0.1));
        ctx.fillStyle = fill || "#f7f3e8";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.strokeText(ln, cx, y);
        ctx.fillText(ln, cx, y);
      });
    }

    var top = (s.top || "").trim();
    var mid = (s.mid || "").trim();
    var bot = (s.bottom || "").trim();
    var ref = (s.ref || "").trim();
    if (ref && bot === ref) bot = "";
    if (!ref && bot && /qur.?n|hadith|:\s*\d/i.test(bot) && bot.length < 70) {
      ref = bot; bot = "";
    }
    // If bottom looks like Urdu body, keep as third band
    var urduBand = "";
    if (bot && hasArabic(bot) && !/^qur/i.test(bot)) {
      urduBand = bot;
      bot = "";
    }

    drawBlock(top, s.posTop, s.scaleTop, Math.floor(W * 0.055), "#fff8e7");
    drawBlock(mid, s.posMid, s.scaleMid, Math.floor(W * 0.036), "#f5f0e6");
    if (urduBand) drawBlock(urduBand, s.posBot, s.scaleBot, Math.floor(W * 0.032), "#f0ebe0");
    else if (bot) drawBlock(bot, s.posBot, s.scaleBot, Math.floor(W * 0.032), "#f0ebe0");

    if (ref) {
      var rSize = Math.max(10, Math.floor(W * 0.024));
      ctx.font = "600 " + rSize + "px Georgia, serif";
      ctx.fillStyle = "rgba(255,248,230,0.9)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(ref, cx, H - stripH / 2 - inset * 0.05);
    }
    return true;
  }

  /** X / share text — matches public educational post style */
  function sharePayload() {
    var s = readInputs();
    var parts = [];
    if (s.top) parts.push(s.top.trim());
    if (s.mid) parts.push(s.mid.trim());
    var bot = (s.bottom || "").trim();
    var ref = (s.ref || "").trim();
    if (bot && bot !== ref && !/^qur/i.test(bot)) {
      // optional third language line omitted from short X body if too long
      if (parts.join("\n").length + bot.length < 180) parts.push(bot);
    }
    if (ref) {
      if (!/^\(/.test(ref) && /qur/i.test(ref)) ref = "(" + ref.replace(/^\(|\)$/g, "") + ")";
      else if (/^\d+:\d+/.test(ref)) ref = "(Qur'an " + ref + ")";
      parts.push(ref);
    }
    parts.push("educational only · clarity-dawah.fyi");
    var text = parts.join("\n\n");
    if (text.length > 280) {
      // prefer AR + EN + ref + footer
      text = [s.top, s.mid, ref || "", "educational only · clarity-dawah.fyi"]
        .filter(Boolean)
        .join("\n\n")
        .slice(0, 280);
    }
    return text;
  }

  function postToX() {
    var text = sharePayload();
    var url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
    try { w.open(url, "_blank", "noopener,noreferrer"); }
    catch (e) { w.location.href = url; }
  }

  function copyShare() {
    var text = sharePayload();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { status("Share text copied"); });
    } else {
      status("Copy: " + text.slice(0, 40) + "…");
    }
  }

  function savePng() {
    var canvas = d.getElementById("meme-canvas");
    if (!canvas) return;
    paint();
    try {
      var a = d.createElement("a");
      a.download = "clarity-meme.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
      status("PNG saved — attach on X if you wish");
    } catch (e) {
      status("Save blocked (canvas/CORS) — try Blank scene or screenshot");
    }
  }

  function injectShareBar() {
    if (d.getElementById("meme-post-v2-bar")) return;
    var root = d.getElementById("meme-studio-root");
    if (!root) return;
    var bar = d.createElement("div");
    bar.id = "meme-post-v2-bar";
    bar.style.cssText = "display:flex;flex-wrap:wrap;gap:.4rem;margin:.55rem 0;align-items:center";
    bar.innerHTML =
      '<button type="button" class="btn-soft" id="meme-v2-copy">Copy X text</button>' +
      '<button type="button" class="btn-soft" id="meme-v2-post">Post on X</button>' +
      '<button type="button" class="btn-soft" id="meme-v2-save">Save PNG</button>' +
      '<span style="font-size:.75rem;opacity:.85">Gold frame · educational footer on share</span>';
    var stage = d.getElementById("meme-stage");
    if (stage && stage.parentNode) stage.parentNode.insertBefore(bar, stage);
    else root.insertBefore(bar, root.firstChild);
    d.getElementById("meme-v2-copy").onclick = copyShare;
    d.getElementById("meme-v2-post").onclick = postToX;
    d.getElementById("meme-v2-save").onclick = savePng;
  }

  function claim() {
    w.paintMeme = paint;
    w.memeDraw = paint;
    w.memePaintQuiet = paint;
    if (!w.ClarityMemePaintV2) w.ClarityMemePaintV2 = {};
    w.ClarityMemePaintV2.paint = paint;
    w.ClarityMemePaintV2.sharePayload = sharePayload;
    w.tdPost = postToX;
    w.memeSharePayload = sharePayload;
  }

  function boot() {
    claim();
    injectShareBar();
    paint();
  }

  var n = 0;
  setInterval(function () {
    n++;
    claim();
    if (!d.getElementById("meme-post-v2-bar")) injectShareBar();
    if (n > 25) { /* stop claiming loop noise */ }
  }, 500);

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  d.addEventListener("clarity:tab-mounted", function () { setTimeout(boot, 120); });
  w.addEventListener("resize", function () { paint(); });
})(window, document);
