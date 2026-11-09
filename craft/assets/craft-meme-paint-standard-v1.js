/*! craft-meme-paint-standard-v1 · C19MEME2
 * Standard meme layout (matches live Clarity X posts):
 *   TOP    — Arabic āyah (Amiri)
 *   CENTER — English meaning
 *   BOTTOM — reference (Qur’an x:y) + educational stamp
 * Gold double border · soft vignette · scenery background preserved
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_PAINT_STD_V1__) return;
  w.__CRAFT_MEME_PAINT_STD_V1__ = true;

  var GOLD = "#d4b45a";
  var GOLD_SOFT = "rgba(212,180,90,0.85)";
  var CREAM = "#f3e6c0";
  var CREAM_SOFT = "rgba(243,230,192,0.95)";
  var SHADOW = "rgba(0,0,0,0.55)";

  function $(id) { return d.getElementById(id); }

  function getCanvas() {
    return $("meme-canvas") || $("mr-canvas") || d.querySelector("#mr-root canvas") || d.querySelector(".craft-canvas-wrap canvas") || d.querySelector("canvas");
  }

  /** Split source text into { ar, en, ref } */
  function parseLayers(raw) {
    raw = String(raw || "").replace(/\s+/g, " ").trim();
    var ar = "", en = "", ref = "";

    /* explicit markers */
    var mRef = raw.match(/(?:Qur[’']an|Quran|Qurʾān|Surah|Sūrat?)\s*([0-9]{1,3})\s*[:：]\s*([0-9]{1,3}(?:\s*[-–]\s*[0-9]{1,3})?)/i);
    if (mRef) {
      ref = "Qur’an " + mRef[1] + ":" + mRef[2].replace(/\s+/g, "");
      raw = raw.replace(mRef[0], " ").trim();
    } else {
      var mRef2 = raw.match(/\(([0-9]{1,3})\s*[:：]\s*([0-9]{1,3})\)/);
      if (mRef2) {
        ref = "Qur’an " + mRef2[1] + ":" + mRef2[2];
        raw = raw.replace(mRef2[0], " ").trim();
      }
    }

    /* Arabic runs (script range) */
    var arParts = raw.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s،؟؛]+/g);
    if (arParts && arParts.length) {
      ar = arParts.map(function (s) { return s.trim(); }).filter(Boolean).join(" ").trim();
      raw = raw.replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+/g, " ");
    }

    en = raw.replace(/\s+/g, " ").replace(/^[\s\-–—:·]+|[\s\-–—:·]+$/g, "").trim();
    en = en.replace(/\(\s*\)/g, " ").replace(/\s*clarity-dawah\.fyi.*$/i, "").replace(/\s*educational only.*$/i, "").replace(/\s+/g, " ").trim();
    en = en.replace(/^[\s\-–—:·]+|[\s\-–—:·]+$/g, "").trim();

    if (!ar && !en && !ref) {
      en = "Educational reminder";
      ref = "Clarity Craft";
    }
    if (!ref) ref = "Educational reminder";
    return { ar: ar, en: en, ref: ref };
  }

  function readSourceText() {
    var card = $("craft-verse-card");
    var t = (card && card.textContent) || "";
    if (!t.trim()) {
      var x = $("x-draft");
      if (x && x.value) t = x.value;
    }
    if (!t.trim()) {
      var fb = $("fb-draft");
      if (fb && fb.value) t = fb.value;
    }
    if (!t.trim() && w.__memeLastLine) t = w.__memeLastLine;
    return t;
  }

  function wrapLines(ctx, text, maxW, maxLines) {
    maxLines = maxLines || 6;
    var words = String(text || "").split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    var lines = [];
    var line = "";
    for (var i = 0; i < words.length; i++) {
      var test = line ? line + " " + words[i] : words[i];
      if (ctx.measureText(test).width > maxW && line) {
        lines.push(line);
        line = words[i];
        if (lines.length >= maxLines) break;
      } else {
        line = test;
      }
    }
    if (line && lines.length < maxLines) lines.push(line);
    if (lines.length === maxLines && i < words.length - 1) {
      var last = lines[lines.length - 1];
      if (last.length > 3) lines[lines.length - 1] = last.replace(/\s+\S+$/, "") + "…";
    }
    return lines;
  }

  /** Arabic-aware soft wrap by character groups when spaces rare */
  function wrapArabic(ctx, text, maxW, maxLines) {
    maxLines = maxLines || 4;
    text = String(text || "").trim();
    if (!text) return [];
    if (ctx.measureText(text).width <= maxW) return [text];
    var lines = [];
    var buf = "";
    for (var i = 0; i < text.length; i++) {
      var ch = text.charAt(i);
      var test = buf + ch;
      if (ctx.measureText(test).width > maxW && buf) {
        lines.push(buf.trim());
        buf = ch;
        if (lines.length >= maxLines) break;
      } else {
        buf = test;
      }
    }
    if (buf.trim() && lines.length < maxLines) lines.push(buf.trim());
    return lines;
  }

  function fitFont(ctx, text, basePx, minPx, maxW, family, bold) {
    var size = basePx;
    var prefix = bold ? "700 " : "400 ";
    while (size > minPx) {
      ctx.font = prefix + size + "px " + family;
      if (ctx.measureText(text).width <= maxW) return size;
      size -= 2;
    }
    ctx.font = prefix + minPx + "px " + family;
    return minPx;
  }

  function drawGoldFrame(ctx, w, h) {
    var m = Math.max(14, Math.round(Math.min(w, h) * 0.028));
    /* outer soft gold */
    ctx.save();
    ctx.strokeStyle = GOLD_SOFT;
    ctx.lineWidth = Math.max(3, Math.round(m * 0.35));
    ctx.strokeRect(m, m, w - 2 * m, h - 2 * m);
    /* inner thin gold */
    var m2 = m + Math.max(6, Math.round(m * 0.45));
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = Math.max(1.5, Math.round(m * 0.18));
    ctx.strokeRect(m2, m2, w - 2 * m2, h - 2 * m2);
    /* corner ticks */
    var tick = Math.max(10, Math.round(m * 0.7));
    ctx.lineWidth = Math.max(2, Math.round(m * 0.2));
    ctx.strokeStyle = GOLD;
    function corner(x, y, dx, dy) {
      ctx.beginPath();
      ctx.moveTo(x, y + dy * tick);
      ctx.lineTo(x, y);
      ctx.lineTo(x + dx * tick, y);
      ctx.stroke();
    }
    corner(m2, m2, 1, 1);
    corner(w - m2, m2, -1, 1);
    corner(m2, h - m2, 1, -1);
    corner(w - m2, h - m2, -1, -1);
    ctx.restore();
  }

  function drawVignette(ctx, w, h) {
    ctx.save();
    var g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.25, w / 2, h / 2, Math.max(w, h) * 0.72);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(0.55, "rgba(0,0,0,0.25)");
    g.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    /* bottom readable band */
    var lg = ctx.createLinearGradient(0, h * 0.55, 0, h);
    lg.addColorStop(0, "rgba(0,0,0,0)");
    lg.addColorStop(1, "rgba(0,0,0,0.5)");
    ctx.fillStyle = lg;
    ctx.fillRect(0, h * 0.55, w, h * 0.45);
    ctx.restore();
  }

  function drawTextBlock(ctx, lines, x, y, lineH, color, shadow) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    if (shadow) {
      ctx.shadowColor = SHADOW;
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;
    }
    for (var i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], x, y + i * lineH);
    }
    ctx.restore();
    return lines.length * lineH;
  }

  /**
   * Paint standard layout onto existing canvas (keeps background image if already drawn).
   */
  function paintStandard(opts) {
    opts = opts || {};
    var canvas = getCanvas();
    if (!canvas || !canvas.getContext) return false;
    var ctx = canvas.getContext("2d");
    var w = canvas.width || 1280;
    var h = canvas.height || 720;

    var layers = opts.layers || parseLayers(opts.text || readSourceText());
    var ar = layers.ar || "";
    var en = layers.en || "";
    var ref = layers.ref || "";

    /* if caller only wants overlay after bg already painted */
    if (!opts.skipVignette) drawVignette(ctx, w, h);
    drawGoldFrame(ctx, w, h);

    var padX = Math.round(w * 0.08);
    var maxW = w - padX * 2;
    var cx = w / 2;

    /* —— TOP: Arabic —— */
    var arY = Math.round(h * 0.22);
    if (ar) {
      var arFamily = "Amiri, 'Traditional Arabic', 'Scheherazade New', serif";
      var arSize = fitFont(ctx, ar, Math.round(h * 0.055), Math.round(h * 0.032), maxW * 0.95, arFamily, true);
      ctx.font = "700 " + arSize + "px " + arFamily;
      var arLines = wrapArabic(ctx, ar, maxW, 3);
      var arLH = Math.round(arSize * 1.45);
      /* center the block around arY */
      var arBlockH = arLines.length * arLH;
      drawTextBlock(ctx, arLines, cx, arY - arBlockH / 2 + arLH / 2, arLH, CREAM, true);
    }

    /* —— CENTER: English —— */
    var enY = Math.round(h * 0.52);
    if (en) {
      var enFamily = "Georgia, 'Times New Roman', serif";
      var enSize = fitFont(ctx, en.split(/\s+/).slice(0, 8).join(" "), Math.round(h * 0.042), Math.round(h * 0.026), maxW * 0.92, enFamily, true);
      ctx.font = "600 " + enSize + "px " + enFamily;
      var enLines = wrapLines(ctx, en, maxW, 5);
      var enLH = Math.round(enSize * 1.35);
      var enBlockH = enLines.length * enLH;
      drawTextBlock(ctx, enLines, cx, enY - enBlockH / 2 + enLH / 2, enLH, GOLD, true);
    }

    /* —— BOTTOM: reference —— */
    var refY = Math.round(h * 0.88);
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = SHADOW;
    ctx.shadowBlur = 4;
    var refFamily = "Quicksand, Inter, system-ui, sans-serif";
    ctx.font = "600 " + Math.round(h * 0.028) + "px " + refFamily;
    ctx.fillStyle = CREAM_SOFT;
    ctx.fillText(ref, cx, refY);
    ctx.font = "500 " + Math.round(h * 0.018) + "px " + refFamily;
    ctx.fillStyle = "rgba(212,180,90,0.75)";
    ctx.fillText("clarity-dawah.fyi · educational reminder", cx, refY + Math.round(h * 0.038));
    ctx.restore();


    try {
      if (w.ClarityMemeAutomation && typeof w.ClarityMemeAutomation.fillDesks === "function") {
        setTimeout(function () { w.ClarityMemeAutomation.fillDesks(false); }, 100);
      }
    } catch (eSync) {}
    return true;
  }

  /** Full repaint: bg (optional solid) then standard text */
  function repaintAll() {
    var canvas = getCanvas();
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var w = canvas.width, h = canvas.height;

    /* keep existing bg image if present */
    if (w.__memeBgImage || w.__memeBgImage === 0) {
      /* global may store on window */
    }
    if (w.__memeBgImage && w.__memeBgImage.complete) {
      try {
        ctx.drawImage(w.__memeBgImage, 0, 0, w, h);
      } catch (e) {
        fillFallbackBg(ctx, w, h);
      }
    } else if (canvas._craftBgImage) {
      try {
        ctx.drawImage(canvas._craftBgImage, 0, 0, w, h);
      } catch (e2) {
        fillFallbackBg(ctx, w, h);
      }
    } else {
      /* do not wipe if something already painted — only vignette+text */
      var hasContent = false;
      try {
        var sample = ctx.getImageData(Math.floor(w / 2), Math.floor(h / 2), 1, 1).data;
        hasContent = sample[0] + sample[1] + sample[2] > 30;
      } catch (e3) {}
      if (!hasContent) fillFallbackBg(ctx, w, h);
    }
    paintStandard({ skipVignette: false });
  }

  function fillFallbackBg(ctx, w, h) {
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#1a3a2a");
    g.addColorStop(0.5, "#0f2a22");
    g.addColorStop(1, "#0a1814");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  
  /* Hook memeDraw — single paint pass only (no prev text stack) */
  function installHook() {
    var prev = w.memeDraw;
    if (typeof prev === "function" && !prev._craftStd) {
      w.__craftMemeDrawPrev = prev;
    }

    w.memeDraw = function () {
      var canvas = getCanvas();
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var W = canvas.width || 1280;
      var H = canvas.height || 720;
      var bg = w.__memeBgImage || canvas._craftBgImage || w.__memeBgImg;
      if (bg && (bg.complete !== false)) {
        try {
          ctx.clearRect(0, 0, W, H);
          ctx.drawImage(bg, 0, 0, W, H);
        } catch (e1) {
          fillFallbackBg(ctx, W, H);
        }
      } else {
        ctx.clearRect(0, 0, W, H);
        fillFallbackBg(ctx, W, H);
      }
      /* ONE text + gold frame pass — never call prev (prevents double Arabic/English) */
      try { paintStandard({}); } catch (e3) {}
    };
    w.memeDraw._craftStd = true;

    w.craftMemePaintStandard = paintStandard;
    w.craftMemeRepaintStandard = function () { w.memeDraw(); };
    w.craftMemeParseLayers = parseLayers;

    var rp = d.getElementById("meme-repaint") || d.querySelector("[data-action='repaint']");
    if (rp && !rp._std) {
      rp._std = true;
      rp.addEventListener("click", function () {
        setTimeout(function () { try { w.memeDraw(); } catch (e) {} }, 50);
      });
    }
    /* Re-paint canvas button by text */
    d.querySelectorAll("button").forEach(function (b) {
      var t = (b.textContent || "").toLowerCase();
      if (t.indexOf("re-paint") !== -1 || t.indexOf("repaint") !== -1) {
        if (b._std) return;
        b._std = true;
        b.addEventListener("click", function () {
          setTimeout(function () { try { w.memeDraw(); } catch (e) {} }, 80);
        });
      }
    });
  }

  function wireButtons() {
    var ids = ["meme-refresh-source", "meme-full-surprise", "meme-surprise-verse-only", "meme-auto-scale"];
    ids.forEach(function (id) {
      var b = $(id);
      if (!b || b._stdPaint) return;
      b._stdPaint = true;
      b.addEventListener("click", function () {
        setTimeout(function () {
          try { if (typeof w.memeDraw === "function") w.memeDraw(); else paintStandard({}); } catch (e) {}
        }, 400);
      });
    });
    /* after section chip */
    d.querySelectorAll("[data-meme-section]").forEach(function (btn) {
      if (btn._stdPaint) return;
      btn._stdPaint = true;
      btn.addEventListener("click", function () {
        setTimeout(function () {
          try { if (typeof w.memeDraw === "function") w.memeDraw(); else paintStandard({}); } catch (e) {}
        }, 450);
      });
    });
  }

  function boot() {
    installHook();
    wireButtons();
    setTimeout(wireButtons, 800);
    /* first paint once canvas exists */
    setTimeout(function () {
      try {
        if (getCanvas() && typeof w.memeDraw === "function") w.memeDraw();
      } catch (e) {}
    }, 900);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(boot, 400); });
})(window, document);
