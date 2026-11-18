/*! companion-meme-paint-v2 · canvas-conscious auto-fit + bottom reference strip
 * Share text uses verse/ḥadīth ref (not site promo line).
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_PAINT_V2__) return;
  w.__COMPANION_MEME_PAINT_V2__ = true;

  function S() {
    if (!w.memeState || typeof w.memeState !== "object") {
      w.memeState = {
        top: "", mid: "", bottom: "", ref: "",
        topSize: 42, midSize: 22, bottomSize: 16,
        outline: 4,
        blankColor1: "#0b1220", blankColor2: "#1a1030"
      };
    }
    return w.memeState;
  }

  function readInputs() {
    var s = S();
    var map = [
      ["meme-top-input", "top"],
      ["meme-mid-input", "mid"],
      ["meme-bottom-input", "bottom"]
    ];
    map.forEach(function (p) {
      var el = d.getElementById(p[0]);
      if (el) s[p[1]] = el.value || "";
    });
    // ref from bottom if looks like citation, else dedicated
    var bot = (s.bottom || "").trim();
    if (/qur.?n|hadith|bukhār|muslim|sunnah|:\s*\d|ayah|āyah/i.test(bot)) {
      s.ref = bot;
    }
    var refEl = d.querySelector("[data-verse-ref], #meme-ref, .meme-ref");
    if (refEl && (refEl.value || refEl.textContent)) {
      s.ref = (refEl.value || refEl.textContent || "").trim();
    }
    return s;
  }

  function fitFont(ctx, text, maxW, maxSize, minSize) {
    var size = maxSize;
    ctx.font = "700 " + size + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
    while (size > minSize && ctx.measureText(text).width > maxW) {
      size -= 1;
      ctx.font = "700 " + size + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
    }
    return size;
  }

  function wrap(ctx, text, maxW) {
    text = (text || "").trim();
    if (!text) return [];
    var words = text.split(/\s+/);
    var lines = [];
    var line = "";
    words.forEach(function (wd) {
      var test = line ? line + " " + wd : wd;
      if (ctx.measureText(test).width > maxW && line) {
        lines.push(line);
        line = wd;
      } else line = test;
    });
    if (line) lines.push(line);
    return lines;
  }

  function paint() {
    var canvas = d.getElementById("meme-canvas");
    if (!canvas) return false;
    var stage = d.getElementById("meme-stage") || canvas.parentElement;
    var rect = (stage || canvas).getBoundingClientRect();
    var cssW = Math.max(320, Math.floor(rect.width || 360));
    var ratio = 9 / 16;
    var rEl = d.querySelector("[data-meme-ratio].is-active, .mv-chip[data-meme-ratio].active");
    // default 16:9
    var cssH = Math.floor(cssW * ratio);
    var dpr = Math.min(2, w.devicePixelRatio || 1);
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    canvas.style.display = "block";

    var ctx = canvas.getContext("2d");
    if (!ctx) return false;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var W = cssW;
    var H = cssH;
    var s = readInputs();

    // background
    if (s.img && s.img.complete && s.img.naturalWidth) {
      try {
        // cover
        var iw = s.img.naturalWidth, ih = s.img.naturalHeight;
        var scale = Math.max(W / iw, H / ih);
        var dw = iw * scale, dh = ih * scale;
        ctx.drawImage(s.img, (W - dw) / 2, (H - dh) / 2, dw, dh);
        ctx.fillStyle = "rgba(0,0,0,0.32)";
        ctx.fillRect(0, 0, W, H);
      } catch (e) {
        s.img = null;
      }
    }
    if (!s.img) {
      var g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, s.blankColor1 || "#0b1220");
      g.addColorStop(1, s.blankColor2 || "#1a1030");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    // layout zones — reserve bottom strip for reference
    var stripH = Math.max(28, Math.floor(H * 0.09));
    var contentTop = H * 0.08;
    var contentBot = H - stripH - H * 0.04;
    var contentH = contentBot - contentTop;
    var maxW = W * 0.88;
    var cx = W / 2;

    function drawBlock(text, yCenter, maxSize, weight) {
      text = (text || "").trim();
      if (!text) return;
      var size = fitFont(ctx, text.split(/\s+/).slice(0, 6).join(" "), maxW, maxSize, 12);
      ctx.font = weight + " " + size + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
      var lines = wrap(ctx, text, maxW);
      // if too many lines, shrink
      while (lines.length * size * 1.25 > contentH * 0.42 && size > 12) {
        size -= 1;
        ctx.font = weight + " " + size + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
        lines = wrap(ctx, text, maxW);
      }
      var lh = size * 1.28;
      var startY = yCenter - ((lines.length - 1) * lh) / 2;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineJoin = "round";
      ctx.lineWidth = Math.max(2, (s.outline || 4) * (W / 400));
      ctx.strokeStyle = "rgba(0,0,0,0.75)";
      ctx.fillStyle = "#f7f0dd";
      lines.forEach(function (ln, i) {
        var y = startY + i * lh;
        ctx.strokeText(ln, cx, y);
        ctx.fillText(ln, cx, y);
      });
    }

    var top = s.top;
    var mid = s.mid;
    var bot = s.bottom;
    // if bottom is the ref, don't double-draw in body
    var bodyBot = bot;
    if (s.ref && bot === s.ref) bodyBot = "";

    drawBlock(top, contentTop + contentH * 0.22, Math.floor(W * 0.055), "700");
    drawBlock(mid, contentTop + contentH * 0.55, Math.floor(W * 0.038), "600");
    if (bodyBot && bodyBot !== s.ref) {
      drawBlock(bodyBot, contentTop + contentH * 0.82, Math.floor(W * 0.032), "600");
    }

    // —— bottom reference strip ——
    var ref = (s.ref || "").trim();
    if (!ref && bot && /qur.?n|hadith|bukhār|muslim|:\d/i.test(bot)) ref = bot;
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, H - stripH, W, stripH);
    // gold hairline
    ctx.strokeStyle = "rgba(212,180,90,0.45)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W * 0.08, H - stripH + 0.5);
    ctx.lineTo(W * 0.92, H - stripH + 0.5);
    ctx.stroke();
    if (ref) {
      var rSize = Math.max(11, Math.floor(W * 0.028));
      ctx.font = "600 " + rSize + "px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "rgba(232, 212, 139, 0.95)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // truncate ref to strip
      var r = ref;
      while (ctx.measureText(r).width > W * 0.9 && r.length > 8) r = r.slice(0, -2);
      if (r !== ref) r += "…";
      ctx.fillText(r, cx, H - stripH / 2);
    }

    return true;
  }

  function bind() {
    ["meme-top-input", "meme-mid-input", "meme-bottom-input"].forEach(function (id) {
      var el = d.getElementById(id);
      if (!el || el.__paintV2) return;
      el.__paintV2 = true;
      el.addEventListener("input", function () {
        paint();
      });
    });
  }

  // Share: verse / ḥadīth reference — not site promo line
  function sharePayload() {
    var s = readInputs();
    var parts = [];
    if (s.top) parts.push(s.top);
    if (s.mid) parts.push(s.mid);
    var ref = s.ref || "";
    if (!ref && s.bottom && /qur.?n|hadith|bukhār|muslim|:\d/i.test(s.bottom)) ref = s.bottom;
    else if (s.bottom && s.bottom !== ref) parts.push(s.bottom);
    if (ref) parts.push(ref);
    return parts.join("\n\n").slice(0, 280);
  }

  w.tdPost = function () {
    var text = sharePayload();
    if (!text) text = (S().top || S().mid || "Educational reminder").slice(0, 280);
    var url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
    try {
      w.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      w.location.href = url;
    }
  };

  w.clarityMemeFill = function (ar, en, ref) {
    var s = S();
    s.top = ar || s.top;
    s.mid = en || s.mid;
    s.ref = ref || s.ref || "";
    if (ref) s.bottom = ref;
    var t = d.getElementById("meme-top-input");
    var m = d.getElementById("meme-mid-input");
    var b = d.getElementById("meme-bottom-input");
    if (t) t.value = s.top;
    if (m) m.value = s.mid;
    if (b) b.value = s.ref || s.bottom || "";
    paint();
  };

  function hydrate() {
    bind();
    paint();
  }

  function boot() {
    hydrate();
    w.addEventListener("resize", function () {
      paint();
    });
    d.addEventListener("clarity:tab-mounted", function () {
      setTimeout(hydrate, 60);
    });
    var m = d.getElementById("cs-mount");
    if (m && typeof MutationObserver !== "undefined") {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(hydrate, 80);
      }).observe(m, { childList: true });
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.ClarityMemePaintV2 = { paint: paint, sharePayload: sharePayload, version: "MP2" };
})(window, document);
