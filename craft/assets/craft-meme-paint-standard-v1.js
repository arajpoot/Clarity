/*! craft-meme-paint-standard-v1 · C19MEME3
 * Post-quality canvas: Arabic top · English center · ref bottom · gold frame
 * Cover-fit scenery · soft vignette · scale controls · auto-scale
 * Single paint owner — no Media Reminder double text
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_PAINT_STD_V3__) return;
  w.__CRAFT_MEME_PAINT_STD_V3__ = true;
  w.__CRAFT_MEME_PAINT_STD_V1__ = true; /* legacy gate */

  var GOLD = "#e8c76b";
  var GOLD_LINE = "rgba(232,199,107,0.92)";
  var CREAM = "#f7efd6";
  var CREAM_DIM = "rgba(247,239,214,0.88)";
  var STORE = "clarity.craft.meme.scale.v1";

  var scale = { ar: 1, en: 1, ref: 1 };
  try {
    var saved = JSON.parse(localStorage.getItem(STORE) || "null");
    if (saved && typeof saved.ar === "number") scale = saved;
  } catch (e0) {}

  function $(id) { return d.getElementById(id); }

  function getCanvas() {
    return $("meme-canvas") || $("mr-canvas") || d.querySelector("#mr-root canvas") || d.querySelector(".craft-canvas-wrap canvas") || d.querySelector("canvas");
  }

  function parseLayers(raw) {
    raw = String(raw || "").replace(/\s+/g, " ").trim();
    var ar = "", en = "", ref = "";
    var mRef = raw.match(/(?:Qur[’']an|Quran|Qurʾān|Surah|Sūrat?)\s*([0-9]{1,3})\s*[:：]\s*([0-9]{1,3}(?:\s*[-–]\s*[0-9]{1,3})?)/i);
    if (mRef) {
      ref = "Qur’an " + mRef[1] + ":" + mRef[2].replace(/\s+/g, "");
      raw = (raw.slice(0, mRef.index) + " " + raw.slice(mRef.index + mRef[0].length)).trim();
    } else {
      var m2 = raw.match(/\(([0-9]{1,3})\s*[:：]\s*([0-9]{1,3}(?:\s*[-–]\s*[0-9]{1,3})?)\)/);
      if (m2) {
        ref = "Qur’an " + m2[1] + ":" + m2[2].replace(/\s+/g, "");
        raw = raw.replace(m2[0], " ").trim();
      }
    }
    var arRe = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u064B-\u065F\s،؟؛۝ٰٕٖۗۘۙۚۛۜٓٔٗ٘]+/g;
    var arParts = raw.match(arRe);
    if (arParts) {
      ar = arParts.map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 1; }).join(" ").replace(/\s+/g, " ").trim();
      raw = raw.replace(arRe, " ");
    }
    en = raw.replace(/\s+/g, " ").replace(/\(\s*\)/g, "").replace(/^[\s\-–—:·]+|[\s\-–—:·]+$/g, "").trim();
    en = en.replace(/\s*clarity-dawah\.fyi.*$/i, "").replace(/\s*educational only.*$/i, "").replace(/\s+/g, " ").trim();
    /* drop mixed dash leftovers like leading emdash */
    en = en.replace(/^[—\-–:]+\s*/, "").trim();
    if (!ref) ref = "";
    return { ar: ar, en: en, ref: ref };
  }

  function readSourceText() {
    var card = $("craft-verse-card");
    var t = (card && card.textContent) || "";
    if (!t.trim()) {
      var mr = $("mr-text");
      var ms = $("mr-src");
      if (mr && mr.value) t = mr.value + (ms && ms.value ? " (" + ms.value + ")" : "");
    }
    if (!t.trim()) {
      var x = $("x-draft");
      if (x && x.value) t = x.value;
    }
    return String(t || "").trim();
  }

  function wrapLines(ctx, text, maxW, maxLines) {
    maxLines = maxLines || 5;
    var words = String(text || "").split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    var lines = [], line = "";
    for (var i = 0; i < words.length; i++) {
      var test = line ? line + " " + words[i] : words[i];
      if (ctx.measureText(test).width > maxW && line) {
        lines.push(line);
        line = words[i];
        if (lines.length >= maxLines) break;
      } else line = test;
    }
    if (line && lines.length < maxLines) lines.push(line);
    if (lines.length === maxLines && i < words.length - 1) {
      var last = lines[lines.length - 1];
      lines[lines.length - 1] = last.replace(/\s+\S+$/, "") + "…";
    }
    return lines;
  }

  function wrapArabic(ctx, text, maxW, maxLines) {
    maxLines = maxLines || 3;
    text = String(text || "").trim();
    if (!text) return [];
    if (ctx.measureText(text).width <= maxW) return [text];
    var words = text.split(/\s+/);
    if (words.length > 1) return wrapLines(ctx, text, maxW, maxLines);
    var lines = [], buf = "";
    for (var i = 0; i < text.length; i++) {
      var ch = text.charAt(i);
      if (ctx.measureText(buf + ch).width > maxW && buf) {
        lines.push(buf);
        buf = ch;
        if (lines.length >= maxLines) break;
      } else buf += ch;
    }
    if (buf && lines.length < maxLines) lines.push(buf);
    return lines;
  }

  function fitSize(ctx, text, base, min, maxW, family, weight) {
    var size = base;
    while (size > min) {
      ctx.font = weight + " " + size + "px " + family;
      if (ctx.measureText(text).width <= maxW) return size;
      size -= 1;
    }
    ctx.font = weight + " " + min + "px " + family;
    return min;
  }

  function drawCoverBg(ctx, img, w, h) {
    var ir = img.width / Math.max(1, img.height);
    var cr = w / h;
    var dw, dh, dx, dy;
    if (ir > cr) {
      dh = h; dw = h * ir; dx = (w - dw) / 2; dy = 0;
    } else {
      dw = w; dh = w / ir; dx = 0; dy = (h - dh) / 2;
    }
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function fillFallback(ctx, w, h) {
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#1c4a3a");
    g.addColorStop(0.55, "#0f2a22");
    g.addColorStop(1, "#071512");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  function drawVignette(ctx, w, h) {
    /* soft edge only — keep photo quality */
    var g = ctx.createRadialGradient(w / 2, h * 0.42, Math.min(w, h) * 0.2, w / 2, h * 0.5, Math.max(w, h) * 0.78);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(0.65, "rgba(0,0,0,0.12)");
    g.addColorStop(1, "rgba(0,0,0,0.48)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    var lg = ctx.createLinearGradient(0, h * 0.62, 0, h);
    lg.addColorStop(0, "rgba(0,0,0,0)");
    lg.addColorStop(1, "rgba(0,0,0,0.42)");
    ctx.fillStyle = lg;
    ctx.fillRect(0, h * 0.62, w, h * 0.38);
  }

  function drawGoldFrame(ctx, w, h) {
    var m = Math.max(16, Math.round(Math.min(w, h) * 0.032));
    ctx.save();
    ctx.strokeStyle = GOLD_LINE;
    ctx.lineWidth = Math.max(2.5, Math.round(m * 0.28));
    ctx.strokeRect(m, m, w - 2 * m, h - 2 * m);
    var m2 = m + Math.max(7, Math.round(m * 0.42));
    ctx.lineWidth = Math.max(1.25, Math.round(m * 0.14));
    ctx.strokeRect(m2, m2, w - 2 * m2, h - 2 * m2);
    var tick = Math.max(12, Math.round(m * 0.75));
    ctx.lineWidth = Math.max(2, Math.round(m * 0.18));
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

  function drawCentered(ctx, lines, cx, y0, lineH, color) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.shadowColor = "rgba(0,0,0,0.55)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;
    for (var i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], cx, y0 + i * lineH);
    }
    ctx.restore();
    return lines.length * lineH;
  }

  function paintStandard(opts) {
    opts = opts || {};
    var canvas = getCanvas();
    if (!canvas || !canvas.getContext) return false;
    var ctx = canvas.getContext("2d");
    var w = canvas.width || 1200;
    var h = canvas.height || 675;

    var layers = opts.layers || parseLayers(opts.text || readSourceText());
    var ar = layers.ar || "";
    var en = layers.en || "";
    var ref = layers.ref || "";

    if (!opts.skipVignette) drawVignette(ctx, w, h);
    drawGoldFrame(ctx, w, h);

    var padX = Math.round(w * 0.09);
    var maxW = w - padX * 2;
    var cx = w / 2;

    var arFamily = "Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
    var enFamily = "Georgia, 'Cormorant Garamond', 'Times New Roman', serif";
    var refFamily = "Quicksand, Inter, system-ui, sans-serif";

    /* Arabic — top third */
    if (ar) {
      var arBase = Math.round(h * 0.062 * scale.ar);
      var arMin = Math.round(h * 0.034);
      var probe = ar.length > 40 ? ar.slice(0, Math.ceil(ar.length / 2)) : ar;
      var arSize = fitSize(ctx, probe, arBase, arMin, maxW * 0.98, arFamily, "700");
      ctx.font = "700 " + arSize + "px " + arFamily;
      var arLines = wrapArabic(ctx, ar, maxW, 3);
      var arLH = Math.round(arSize * 1.5);
      var arBlock = arLines.length * arLH;
      var arY = Math.round(h * 0.26) - arBlock / 2 + arLH / 2;
      drawCentered(ctx, arLines, cx, arY, arLH, CREAM);
    }

    /* English — center, gold */
    if (en) {
      var enBase = Math.round(h * 0.038 * scale.en);
      var enMin = Math.round(h * 0.024);
      var enSize = fitSize(ctx, en.split(/\s+/).slice(0, 7).join(" "), enBase, enMin, maxW * 0.94, enFamily, "600");
      ctx.font = "600 " + enSize + "px " + enFamily;
      var enLines = wrapLines(ctx, en, maxW, 4);
      var enLH = Math.round(enSize * 1.38);
      var enBlock = enLines.length * enLH;
      var enY = Math.round(h * 0.52) - enBlock / 2 + enLH / 2;
      drawCentered(ctx, enLines, cx, enY, enLH, GOLD);
    }

    /* Reference — bottom */
    var refY = Math.round(h * 0.86);
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 5;
    if (ref) {
      ctx.font = "600 " + Math.round(h * 0.026 * scale.ref) + "px " + refFamily;
      ctx.fillStyle = CREAM_DIM;
      ctx.fillText(ref, cx, refY);
    }
    ctx.font = "500 " + Math.round(h * 0.016) + "px " + refFamily;
    ctx.fillStyle = "rgba(232,199,107,0.72)";
    ctx.fillText("clarity-dawah.fyi · educational reminder", cx, refY + Math.round(h * 0.036));
    ctx.restore();
    return true;
  }

  function fullPaint() {
    var canvas = getCanvas();
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var W = canvas.width || 1200;
    var H = canvas.height || 675;
    var bg = w.__memeBgImage || canvas._craftBgImage || w.__memeBgImg;
    ctx.clearRect(0, 0, W, H);
    if (bg && bg.complete !== false && bg.width) {
      try { drawCoverBg(ctx, bg, W, H); } catch (e) { fillFallback(ctx, W, H); }
    } else {
      fillFallback(ctx, W, H);
    }
    paintStandard({});
    try {
      if (w.ClarityMemeAutomation && typeof w.ClarityMemeAutomation.fillDesks === "function") {
        setTimeout(function () { w.ClarityMemeAutomation.fillDesks(false); }, 60);
      }
    } catch (e2) {}
  }

  /** Auto-scale: shrink until Arabic+English fit in bands */
  function autoScale() {
    scale.ar = 1;
    scale.en = 1;
    var canvas = getCanvas();
    if (!canvas) return;
    var layers = parseLayers(readSourceText());
    var ctx = canvas.getContext("2d");
    var w = canvas.width, h = canvas.height;
    var maxW = w * 0.82;
    var arFamily = "Amiri, serif";
    var enFamily = "Georgia, serif";
    if (layers.ar) {
      for (var a = 1; a >= 0.55; a -= 0.05) {
        var sz = Math.round(h * 0.062 * a);
        ctx.font = "700 " + sz + "px " + arFamily;
        if (ctx.measureText(layers.ar).width <= maxW * 1.6) { scale.ar = Math.round(a * 100) / 100; break; }
        scale.ar = a;
      }
    }
    if (layers.en) {
      for (var e = 1; e >= 0.55; e -= 0.05) {
        var ez = Math.round(h * 0.038 * e);
        ctx.font = "600 " + ez + "px " + enFamily;
        var lines = wrapLines(ctx, layers.en, maxW, 4);
        if (lines.length <= 4) { scale.en = Math.round(e * 100) / 100; break; }
        scale.en = e;
      }
    }
    persistScale();
    syncSliders();
    fullPaint();
  }

  function persistScale() {
    try { localStorage.setItem(STORE, JSON.stringify(scale)); } catch (e) {}
  }

  function syncSliders() {
    var ar = $("meme-scale-ar");
    var en = $("meme-scale-en");
    var arv = $("meme-scale-ar-val");
    var env = $("meme-scale-en-val");
    if (ar) ar.value = String(Math.round(scale.ar * 100));
    if (en) en.value = String(Math.round(scale.en * 100));
    if (arv) arv.textContent = Math.round(scale.ar * 100) + "%";
    if (env) env.textContent = Math.round(scale.en * 100) + "%";
  }

  function installHook() {
    w.memeDraw = function () { fullPaint(); };
    w.memeDraw._craftStd = true;
    w.craftMemePaintStandard = function (o) { fullPaint(); return paintStandard(o || {}); };
    w.craftMemeRepaintStandard = fullPaint;
    w.craftMemeParseLayers = parseLayers;
    w.memeAutoScaleLines = autoScale;
    w.craftMemeSetScale = function (ar, en) {
      if (typeof ar === "number") scale.ar = Math.min(1.4, Math.max(0.5, ar));
      if (typeof en === "number") scale.en = Math.min(1.4, Math.max(0.5, en));
      persistScale();
      syncSliders();
      fullPaint();
    };
    w.craftMemeGetScale = function () { return { ar: scale.ar, en: scale.en, ref: scale.ref }; };

    /* capture bg image assignments */
    var prevLoad = w.memeLoadImageFromUrl;
    if (typeof prevLoad === "function" && !prevLoad._stdCap) {
      w.memeLoadImageFromUrl = function (url, failMsg) {
        var img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = function () {
          w.__memeBgImage = img;
          var c = getCanvas();
          if (c) c._craftBgImage = img;
          fullPaint();
        };
        img.onerror = function () {
          if (typeof failMsg === "string") {
            var st = $("meme-fetch-status");
            if (st) st.textContent = failMsg;
          }
        };
        img.src = url;
        if (typeof prevLoad === "function") {
          try { /* still allow legacy path */ } catch (e) {}
        }
      };
      w.memeLoadImageFromUrl._stdCap = true;
    }
  }

  function injectScalePanel() {
    if ($("meme-scale-panel")) return;
    var host = d.querySelector("#desks") || d.querySelector(".desks-row") || d.querySelector(".tool-section");
    var panel = d.createElement("div");
    panel.id = "meme-scale-panel";
    panel.className = "tool-section";
    panel.innerHTML =
      '<h2>Text scale · before publish</h2>' +
      '<p class="panel-note">Ported craft controls · Arabic &amp; English size · auto-fit for the frame · saved on this device.</p>' +
      '<div class="meme-scale-grid" style="display:grid;gap:0.65rem;max-width:28rem">' +
      '<label style="display:flex;align-items:center;gap:0.6rem;font-size:0.85rem">Arabic <input type="range" id="meme-scale-ar" min="50" max="140" value="' + Math.round(scale.ar * 100) + '" style="flex:1" /> <span id="meme-scale-ar-val">' + Math.round(scale.ar * 100) + '%</span></label>' +
      '<label style="display:flex;align-items:center;gap:0.6rem;font-size:0.85rem">English <input type="range" id="meme-scale-en" min="50" max="140" value="' + Math.round(scale.en * 100) + '" style="flex:1" /> <span id="meme-scale-en-val">' + Math.round(scale.en * 100) + '%</span></label>' +
      '<div class="wire-actions" style="display:flex;flex-wrap:wrap;gap:0.4rem">' +
      '<button type="button" class="btn primary" id="meme-scale-apply">Apply scale</button>' +
      '<button type="button" class="btn" id="meme-scale-auto">Auto-scale text</button>' +
      '<button type="button" class="btn" id="meme-scale-reset">Reset 100%</button>' +
      "</div></div>";
    var ratioSec = null;
    d.querySelectorAll(".tool-section").forEach(function (sec) {
      if (/Scale|ratio/i.test(sec.textContent || "")) ratioSec = sec;
    });
    if (ratioSec && ratioSec.parentNode) ratioSec.parentNode.insertBefore(panel, ratioSec.nextSibling);
    else if (host && host.parentNode) host.parentNode.insertBefore(panel, host);
    else d.body.appendChild(panel);

    function onSlide() {
      scale.ar = (parseInt(($("meme-scale-ar") || {}).value, 10) || 100) / 100;
      scale.en = (parseInt(($("meme-scale-en") || {}).value, 10) || 100) / 100;
      syncSliders();
    }
    ["meme-scale-ar", "meme-scale-en"].forEach(function (id) {
      var el = $(id);
      if (el) el.addEventListener("input", onSlide);
    });
    var apply = $("meme-scale-apply");
    if (apply) apply.addEventListener("click", function () { onSlide(); persistScale(); fullPaint(); });
    var auto = $("meme-scale-auto");
    if (auto) auto.addEventListener("click", autoScale);
    var reset = $("meme-scale-reset");
    if (reset) reset.addEventListener("click", function () {
      scale = { ar: 1, en: 1, ref: 1 };
      persistScale();
      syncSliders();
      fullPaint();
    });
  }

  function wireButtons() {
    var autoBtn = $("meme-auto-scale");
    if (autoBtn && !autoBtn._std) {
      autoBtn._std = true;
      autoBtn.addEventListener("click", function (e) {
        e.preventDefault();
        autoScale();
      });
    }
    d.querySelectorAll("button").forEach(function (b) {
      var t = (b.textContent || "").toLowerCase();
      if ((t.indexOf("re-paint") !== -1 || t.indexOf("repaint") !== -1) && !b._stdRp) {
        b._stdRp = true;
        b.addEventListener("click", function () { setTimeout(fullPaint, 40); });
      }
    });
    d.querySelectorAll("[data-meme-section]").forEach(function (btn) {
      if (btn._stdSec) return;
      btn._stdSec = true;
      btn.addEventListener("click", function () { setTimeout(fullPaint, 480); });
    });
    var refresh = $("meme-refresh-source");
    if (refresh && !refresh._std) {
      refresh._std = true;
      refresh.addEventListener("click", function () { setTimeout(fullPaint, 400); });
    }
  }

  function silenceMediaReminderPaint() {
    /* Prevent Media Reminder Bench from stacking its own text on the same canvas */
    if (w.ClarityMediaReminder && w.ClarityMediaReminder.open && !w.ClarityMediaReminder._stdMuted) {
      var prev = w.ClarityMediaReminder.open;
      w.ClarityMediaReminder.open = function (root) {
        try { prev.call(w.ClarityMediaReminder, root); } catch (e) {}
        setTimeout(fullPaint, 200);
        setTimeout(fullPaint, 600);
      };
      w.ClarityMediaReminder._stdMuted = true;
    }
    /* Prefer not auto-opening media boot on this page */
    if (w.ClarityCraftStudioBoot && !w.ClarityCraftStudioBoot._stdMute) {
      var media = w.ClarityCraftStudioBoot.media;
      w.ClarityCraftStudioBoot.media = function () {
        /* skip dual bench open — paint-standard owns canvas */
        return false;
      };
      w.ClarityCraftStudioBoot._stdMute = true;
      if (typeof media === "function") w.ClarityCraftStudioBoot._mediaPrev = media;
    }
  }

  function boot() {
    installHook();
    silenceMediaReminderPaint();
    injectScalePanel();
    wireButtons();
    setTimeout(wireButtons, 700);
    setTimeout(silenceMediaReminderPaint, 400);
    setTimeout(function () { try { fullPaint(); } catch (e) {} }, 1000);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(boot, 300); });
})(window, document);
