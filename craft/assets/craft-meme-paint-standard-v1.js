/*! craft-meme-paint-standard-v1 · C19MEME20
 * Single-owner paint: keep scenery · Arabic top · English · Urdu · ref bottom · gold frame
 * Captures BG from memeLoadImageFromUrl, memeState.img, and canvas snapshot
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  /* allow re-install of final build */
  w.__CRAFT_MEME_PAINT_STD_V3__ = true;
  w.__CRAFT_MEME_PAINT_STD_V1__ = true;

  var GOLD = "#e8c76b";
  var GOLD_LINE = "rgba(232,199,107,0.92)";
  var CREAM = "#f7efd6";
  var CREAM_DIM = "rgba(247,239,214,0.88)";
  var STORE = "clarity.craft.meme.scale.v1";

  var scale = { ar: 1, en: 1, ref: 1 };
  var paintTimer = null;
  var urduCache = {};
  var lastUrduKey = '';
  var lastUrduText = '';
  try {
    var saved = JSON.parse(localStorage.getItem(STORE) || "null");
    if (saved && typeof saved.ar === "number") scale = saved;
  } catch (e0) {}

  function $(id) { return d.getElementById(id); }

  function getCanvas() {
    return (
      $("meme-canvas") ||
      $("mr-canvas") ||
      d.querySelector("#mr-root canvas") ||
      d.querySelector(".craft-canvas-wrap canvas") ||
      d.querySelector("canvas")
    );
  }

  function ensureMemeState() {
    if (!w.memeState) w.memeState = {};
    return w.memeState;
  }

  function resolveBg(canvas) {
    if (w.__memeBgImage && w.__memeBgImage.width) return w.__memeBgImage;
    if (canvas && canvas._craftBgImage && canvas._craftBgImage.width) return canvas._craftBgImage;
    var st = w.memeState;
    if (st && st.img && st.img.width) return st.img;
    if (st && st.bgImage && st.bgImage.width) return st.bgImage;
    if (w.__memeBgImg && w.__memeBgImg.width) return w.__memeBgImg;
    return null;
  }

  function rememberBg(img) {
    if (!img) return;
    w.__memeBgImage = img; try { if (img && img.src) w.__memeBgUrl = img.src; } catch(eU) {}
    w.__memeBgImg = img;
    var st = ensureMemeState();
    st.img = img;
    st.bgImage = img;
    var c = getCanvas();
    if (c) c._craftBgImage = img;
  }

  function parseLayers(raw) {
    if (w.__memeLayers && (w.__memeLayers.ar || w.__memeLayers.en) && !String(raw||"").trim()) {
      return { ar: w.__memeLayers.ar||"", en: w.__memeLayers.en||"", ur: w.__memeLayers.ur||"", ref: w.__memeLayers.ref||"" };
    }
    if (w.__memeLayers && (w.__memeLayers.ar || w.__memeLayers.en) && String(raw||"").trim().length < 8) {
      return { ar: w.__memeLayers.ar||"", en: w.__memeLayers.en||"", ur: w.__memeLayers.ur||"", ref: w.__memeLayers.ref||"" };
    }
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
    var arRe = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u064B-\u065F\s،؟؛]+/g;
    var arParts = raw.match(arRe);
    if (arParts) {
      ar = arParts.map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 1; }).join(" ").replace(/\s+/g, " ").trim();
      raw = raw.replace(arRe, " ");
    }
    en = raw.replace(/\s+/g, " ").replace(/\(\s*\)/g, "").replace(/^[\s\-–—:·]+|[\s\-–—:·]+$/g, "").trim();
    en = en.replace(/\s*clarity-dawah\.fyi.*$/i, "").replace(/\s*educational only.*$/i, "").replace(/^[—\-–:]+\s*/, "").trim();
    var ur = "";
    /* Urdu-specific letters if present in leftover */
    var urRe = /[\u0600-\u06FF]*[\u0679\u0688\u0691\u06BA\u06C1\u06BE\u06D2\u06AF\u0686\u06A9\u06A9][\u0600-\u06FF\s،؟؛]*/g;
    var urParts = String(raw || "").match(urRe);
    if (urParts && urParts.length) {
      ur = urParts.map(function (s) { return s.trim(); }).filter(Boolean).join(" ").trim();
    }
    /* C19MEME20: never drop online-fetched Urdu when desk text has no Urdu */
    if (!ur && w.__memeLayers && w.__memeLayers.ur) ur = w.__memeLayers.ur;
    if (!ur && w.__memeUrduOnline) ur = w.__memeUrduOnline;
    if (!ar && w.__memeLayers && w.__memeLayers.ar) ar = w.__memeLayers.ar;
    if (!en && w.__memeLayers && w.__memeLayers.en) en = w.__memeLayers.en;
    if (!ref && w.__memeLayers && w.__memeLayers.ref) ref = w.__memeLayers.ref;
    return { ar: ar, en: en, ur: ur, ref: ref };
  }

  function layersFromGlobal() {
    var L = w.__memeLayers;
    if (L && (L.ar || L.en || L.ref)) {
      var parts = [];
      if (L.ar) parts.push(L.ar);
      if (L.en) parts.push(L.en);
      if (L.ref) parts.push("(" + L.ref + ")");
      return parts.join("\n");
    }
    return "";
  }

  function readSourceText() {
    var fromL = layersFromGlobal();
    if (fromL) return fromL;
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
      lines[lines.length - 1] = lines[lines.length - 1].replace(/\s+\S+$/, "") + "…";
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
    var g = ctx.createRadialGradient(w / 2, h * 0.42, Math.min(w, h) * 0.22, w / 2, h * 0.5, Math.max(w, h) * 0.78);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(0.7, "rgba(0,0,0,0.1)");
    g.addColorStop(1, "rgba(0,0,0,0.45)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    var lg = ctx.createLinearGradient(0, h * 0.64, 0, h);
    lg.addColorStop(0, "rgba(0,0,0,0)");
    lg.addColorStop(1, "rgba(0,0,0,0.4)");
    ctx.fillStyle = lg;
    ctx.fillRect(0, h * 0.64, w, h * 0.36);
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
    for (var i = 0; i < lines.length; i++) ctx.fillText(lines[i], cx, y0 + i * lineH);
    ctx.restore();
  }


  function sampleBgLuminance(ctx, w, h) {
    try {
      var sw = Math.min(32, w), sh = Math.min(32, h);
      var data = ctx.getImageData(0, 0, sw, sh).data;
      var sum = 0, n = 0;
      for (var i = 0; i < data.length; i += 16) {
        sum += 0.2126 * data[i] + 0.7152 * data[i+1] + 0.0722 * data[i+2];
        n++;
      }
      return n ? sum / n : 40;
    } catch (e) { return 40; }
  }

  function paintText(ctx, width, height) {
    try {
      var L = (typeof window !== "undefined" && window.__memeLayers) ? window.__memeLayers : {};
      var ar = String(L.ar || "").trim();
      var en = String(L.en || "").trim();
      var ur = String(L.ur || "").trim();
      var ref = String(L.ref || "").trim();
      if (!ar && !en) {
        try {
          var parsed = parseLayers(readSourceText());
          ar = parsed.ar || ""; en = parsed.en || ""; ur = ur || parsed.ur || ""; ref = ref || parsed.ref || "";
        } catch (eP) {}
      }

      var fonts = (typeof window !== "undefined" && window.__memeFonts) ? window.__memeFonts : {};
      var arFamily = (fonts.ar || "Amiri") + ", 'Scheherazade New', 'Noto Naskh Arabic', serif";
      var enFamily = (fonts.en || "Georgia") + ", 'Cormorant Garamond', 'Times New Roman', serif";
      var urFamily = (fonts.ur || "Noto Nastaliq Urdu") + ", 'Noto Naskh Arabic', Amiri, serif";
      var refFamily = (fonts.ref || "Georgia") + ", Quicksand, system-ui, sans-serif";

      var lum = 40;
      try {
        if (typeof sampleBgLuminance === "function") lum = sampleBgLuminance(ctx, width, height);
        else if (typeof window !== "undefined" && typeof window.__memeBgLum === "number") lum = window.__memeBgLum;
      } catch (eL) { lum = 40; }
      try { if (typeof window !== "undefined") window.__memeBgLum = lum; } catch (eW) {}

      var colAr, colEn, colUr, colRef, shadow;
      if (lum >= 140) {
        colAr = "#0a0a0a"; colEn = "#121212"; colUr = "#1a1a1a"; colRef = "#2a2a2a";
        shadow = "rgba(255,255,255,0.4)";
      } else if (lum >= 85) {
        colAr = "#1a1008"; colEn = "#241608"; colUr = "#1e1408"; colRef = "#3a2810";
        shadow = "rgba(255,255,255,0.25)";
      } else {
        colAr = "#f5e6c8"; colEn = "#e8c76b"; colUr = "rgba(245,230,200,0.92)"; colRef = "rgba(245,230,200,0.85)";
        shadow = "rgba(0,0,0,0.65)";
      }

      if ((typeof window === "undefined" || window.__memeVignetteOn !== false) && typeof drawVignette === "function") {
        try { drawVignette(ctx, width, height); } catch (eV) {}
      }
      if ((typeof window === "undefined" || window.__memeFrameOn !== false) && typeof drawGoldFrame === "function") {
        try { drawGoldFrame(ctx, width, height); } catch (eF) {}
      }

      var dens = (typeof window !== "undefined" && window.__memeTextDensity) ? window.__memeTextDensity : "standard";
      var scale = { ar: 1, en: 1, ref: 1 };
      try {
        if (typeof window !== "undefined" && window.__memeScale) scale = window.__memeScale;
        else {
          var s = JSON.parse(localStorage.getItem("clarity.craft.meme.scale.v1") || "null");
          if (s && typeof s.ar === "number") scale = s;
        }
      } catch (eS) {}

      var padX = Math.round(width * 0.09);
      var maxW = width - padX * 2;
      var cx = width / 2;
      var hasUr = !!(ur && ur.trim());
      var arBand = dens === "compact" ? 0.18 : dens === "airy" ? 0.26 : 0.22;
      var enBand = hasUr ? (dens === "compact" ? 0.36 : dens === "airy" ? 0.48 : 0.42) : (dens === "compact" ? 0.44 : dens === "airy" ? 0.56 : 0.50);
      var urBand = dens === "compact" ? 0.55 : dens === "airy" ? 0.68 : 0.62;
      var refBand = dens === "compact" ? 0.82 : dens === "airy" ? 0.90 : 0.86;

      function drawLines(lines, y0, lineH, color, fontSpec) {
        if (!lines || !lines.length) return;
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = color;
        ctx.font = fontSpec;
        ctx.shadowColor = shadow;
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 2;
        for (var i = 0; i < lines.length; i++) ctx.fillText(lines[i], cx, y0 + i * lineH);
        ctx.restore();
      }

      if (ar) {
        var arBase = Math.round(height * 0.058 * (scale.ar || 1));
        var arMin = Math.round(height * 0.032);
        var probe = ar.length > 40 ? ar.slice(0, Math.ceil(ar.length / 2)) : ar;
        var arSize = fitSize(ctx, probe, arBase, arMin, maxW * 0.98, arFamily, "700");
        var arLines = wrapArabic(ctx, ar, maxW, 3);
        var arLH = Math.round(arSize * 1.48);
        var arY = Math.round(height * arBand) - (arLines.length * arLH) / 2 + arLH / 2;
        drawLines(arLines, arY, arLH, colAr, "700 " + arSize + "px " + arFamily);
      }
      if (en) {
        var enBase = Math.round(height * (hasUr ? 0.032 : 0.038) * (scale.en || 1));
        var enMin = Math.round(height * 0.022);
        var enSize = fitSize(ctx, en.split(/\s+/).slice(0, 7).join(" "), enBase, enMin, maxW * 0.94, enFamily, "600");
        var enLines = wrapLines(ctx, en, maxW, hasUr ? 3 : 4);
        var enLH = Math.round(enSize * 1.35);
        var enY = Math.round(height * enBand) - (enLines.length * enLH) / 2 + enLH / 2;
        drawLines(enLines, enY, enLH, colEn, "600 " + enSize + "px " + enFamily);
      }
      if (hasUr) {
        var urBase = Math.round(height * 0.034 * (scale.en || 1));
        var urMin = Math.round(height * 0.022);
        var urSize = fitSize(ctx, ur.split(/\s+/).slice(0, 6).join(" "), urBase, urMin, maxW * 0.94, urFamily, "600");
        var urLines = wrapArabic(ctx, ur, maxW, 3);
        var urLH = Math.round(urSize * 1.45);
        var urY = Math.round(height * urBand) - (urLines.length * urLH) / 2 + urLH / 2;
        drawLines(urLines, urY, urLH, colUr, "600 " + urSize + "px " + urFamily);
      }
      var refY = Math.round(height * refBand);
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = shadow;
      ctx.shadowBlur = 5;
      if (ref) {
        ctx.font = "600 " + Math.round(height * 0.026 * (scale.ref || 1)) + "px " + refFamily;
        ctx.fillStyle = colRef;
        ctx.fillText(ref, cx, refY);
      }
      ctx.font = "500 " + Math.round(height * 0.016) + "px " + refFamily;
      ctx.fillStyle = lum >= 140 ? "rgba(0,0,0,0.55)" : "rgba(232,199,107,0.72)";
      ctx.fillText("clarity-dawah.fyi · educational reminder", cx, refY + Math.round(height * 0.036));
      ctx.restore();
    } catch (err) {
      try { console.warn("paintText", err); } catch (e0) {}
    }
  }

function schedulePaint() {
    if (paintTimer) clearTimeout(paintTimer);
    paintTimer = setTimeout(function () {
      paintTimer = null;
      fullPaintNow();
    }, 48);
  }

  function fetchUrduThenPaint() {
    /* C19MEME20: curated bank first — free API is last resort and audited */
    try {
      if (w.CraftMemeUrduFetch) {
        w.CraftMemeUrduFetch.loadForCurrentLayers(true);
        return;
      }
    } catch (eAud) {}

    var layers = parseLayers(readSourceText());
    if (layers.ur) {
      lastUrduText = layers.ur;
      schedulePaint();
      return;
    }
    var en = layers.en || "";
    if (!en) { schedulePaint(); return; }
    var key = en.slice(0, 180);
    if (urduCache[key]) {
      lastUrduText = urduCache[key];
      schedulePaint();
      return;
    }
    if (lastUrduKey === key && lastUrduText) {
      schedulePaint();
      return;
    }
    lastUrduKey = key;
    /* try free translation endpoint; fail soft */
    var url = null; /* C19MEME20: free EN→UR disabled — authentic ayah API only */
    if (w.CraftMemeUrduFetch) {
      var refGuess = "";
      try {
        var L0 = w.__memeLayers || {};
        refGuess = (L0.ref || "").match(/(\d{1,3})\s*[:：]\s*(\d{1,3})/);
        refGuess = refGuess ? refGuess[1]+":"+refGuess[2] : "";
        if (!refGuess && w.CraftMemeAuditor) {
          refGuess = w.CraftMemeAuditor.detectRefFromArabic(L0.ar||"") || w.CraftMemeAuditor.detectRefFromEnglish(en) || "";
        }
      } catch (eG) {}
      if (refGuess) {
        w.CraftMemeUrduFetch.fetchUrdu(refGuess).then(function (out) {
          if (out) {
            lastUrduText = out;
            urduCache[key] = out;
            if (w.__memeLayers) w.__memeLayers.ur = out;
            w.__memeUrduOnline = out;
          }
          schedulePaint();
          setTimeout(schedulePaint, 100);
        });
        return;
      }
    }
    /* no free machine translation of English — bank/API only */
    schedulePaint();
    return;
    var url = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(en.slice(0, 400)) + "&langpair=en|ur";
    fetch(url, { credentials: "omit" }).then(function (r) { return r.json(); }).then(function (j) {
      var out = (j && j.responseData && j.responseData.translatedText) || "";
      out = String(out).trim();
      if (/INVALID|QUERY LENGTH|MYMEMORY|ERROR/i.test(out)) out = "";
      if (out) {
        /* reject free-API if auditor says mismatch */
        var reject = false;
        try {
          if (w.CraftMemeAuditor) {
            var tmp = Object.assign({}, w.__memeLayers || {}, { ur: out });
            var prev = w.__memeLayers;
            w.__memeLayers = tmp;
            var rep = w.CraftMemeAuditor.audit({ autoFix: false });
            w.__memeLayers = prev;
            if (rep && !rep.ok && rep.blocks && rep.blocks.some(function(b){ return b.code === "urdu-mismatch"; })) {
              reject = true;
              var fix = (rep.blocks.find(function(b){ return b.fixUrdu; }) || {}).fixUrdu;
              if (fix) out = fix;
              else reject = true;
            }
          }
        } catch (eR) {}
        if (reject && w.CraftMemeAuditor) {
          out = ""; /* no bank */
        }
        urduCache[key] = out;
        lastUrduText = out;
        if (w.__memeLayers) w.__memeLayers.ur = out;
      }
      schedulePaint();
    }).catch(function () { schedulePaint(); });
  }

  function fullPaintNow() {
    /* prefer live source layers */
    if (w.__memeLayers && (w.__memeLayers.ar || w.__memeLayers.en)) {
      try { if (typeof setLayers === "function") setLayers(w.__memeLayers); } catch(e0) {}
    }

    var flags = w.__memeLayerFlags || {ar:true,en:true,ur:true,ref:true};

    var canvas = getCanvas();
    if (!canvas) return false;
    var ctx = canvas.getContext("2d");
    if (!ctx) return false;
    var W = canvas.width || 1200;
    var H = canvas.height || 675;
    if (!canvas.width) { canvas.width = W; canvas.height = H; }

    var bg = resolveBg(canvas);
    ctx.clearRect(0, 0, W, H);
    if (bg) {
      try { drawCoverBg(ctx, bg, W, H); }
      catch (e) { fillFallback(ctx, W, H); }
    } else {
      fillFallback(ctx, W, H);
    }
    paintText(ctx, W, H);
    return true;
  }

  function loadBgUrl(url, failMsg) {
    if (!url) return;
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      rememberBg(img);
      fullPaintNow();
      var st = $("meme-fetch-status");
      if (st) st.textContent = "Background ready";
    };
    img.onerror = function () {
      var st = $("meme-fetch-status");
      if (st) st.textContent = failMsg || "Background load failed";
    };
    img.src = url;
  }

  function autoScale() {
    scale.ar = 1;
    scale.en = 1;
    var canvas = getCanvas();
    if (!canvas) return;
    var layers = parseLayers(readSourceText());
    var ctx = canvas.getContext("2d");
    var w = canvas.width, h = canvas.height;
    var maxW = w * 0.82;
    if (layers.ar) {
      for (var a = 1; a >= 0.55; a -= 0.05) {
        ctx.font = "700 " + Math.round(h * 0.062 * a) + "px Amiri, serif";
        if (ctx.measureText(layers.ar).width <= maxW * 1.6) { scale.ar = Math.round(a * 100) / 100; break; }
        scale.ar = a;
      }
    }
    if (layers.en) {
      for (var e = 1; e >= 0.55; e -= 0.05) {
        ctx.font = "600 " + Math.round(h * 0.038 * e) + "px Georgia, serif";
        var lines = wrapLines(ctx, layers.en, maxW, 4);
        if (lines.length <= 4) { scale.en = Math.round(e * 100) / 100; break; }
        scale.en = e;
      }
    }
    try { localStorage.setItem(STORE, JSON.stringify(scale)); } catch (e1) {}
    syncSliders();
    schedulePaint();
  }

  function syncSliders() {
    var ar = $("meme-scale-ar");
    var en = $("meme-scale-en");
    if (ar) ar.value = String(Math.round(scale.ar * 100));
    if (en) en.value = String(Math.round(scale.en * 100));
    var arv = $("meme-scale-ar-val");
    var env = $("meme-scale-en-val");
    if (arv) arv.textContent = Math.round(scale.ar * 100) + "%";
    if (env) env.textContent = Math.round(scale.en * 100) + "%";
  }

  function ensureScaleWiring() {
    try { injectScalePanel(); } catch (e1) {}
    try { bindScaleControls(); } catch (e2) {}
    try { syncSliders(); } catch (e3) {}
  }
  function bindScaleControls() {
    ["meme-scale-ar","meme-scale-en"].forEach(function(id){
      var el=$(id); if(!el||el._bound) return; el._bound=true;
      el.addEventListener("input", function(){
        if(id.indexOf("ar")>=0) scale.ar=(+el.value||100)/100; else scale.en=(+el.value||100)/100;
        try{localStorage.setItem(STORE, JSON.stringify(scale));}catch(e){}
        syncSliders(); schedulePaint();
      });
    });
    var ap=$("meme-scale-apply"); if(ap&&!ap._bound){ap._bound=true;ap.addEventListener("click",function(){schedulePaint();});}
    var au=$("meme-scale-auto"); if(au&&!au._bound){au._bound=true;au.addEventListener("click",function(){if(typeof autoScale==="function") autoScale(); else if (typeof w.memeAutoScaleLines==="function") w.memeAutoScaleLines(); else schedulePaint();});}
    var rs=$("meme-scale-reset"); if(rs&&!rs._bound){rs._bound=true;rs.addEventListener("click",function(){scale.ar=1;scale.en=1;try{localStorage.setItem(STORE,JSON.stringify(scale));}catch(e){}syncSliders();schedulePaint();});}
    var topAuto=$("meme-auto-scale"); if(topAuto&&!topAuto._bound){topAuto._bound=true;topAuto.addEventListener("click",function(){if(typeof autoScale==="function")autoScale();});}
  }
  function injectScalePanel() {
    if ($("meme-scale-panel")) { syncSliders(); bindScaleControls(); return; }
    var hostPrefer = $("meme-scale-host");
    var panel = d.createElement("div");
    panel.id = "meme-scale-panel";
    panel.className = "tool-section";
    panel.innerHTML =
      "<h2>Text scale · before publish</h2>" +
      '<p class="panel-note">Arabic &amp; English size · auto-fit · saved on this device.</p>' +
      '<div style="display:grid;gap:0.65rem;max-width:28rem">' +
      '<label style="display:flex;align-items:center;gap:0.6rem;font-size:0.85rem">Arabic <input type="range" id="meme-scale-ar" min="50" max="140" value="' + Math.round(scale.ar * 100) + '" style="flex:1"/> <span id="meme-scale-ar-val">' + Math.round(scale.ar * 100) + "%</span></label>" +
      '<label style="display:flex;align-items:center;gap:0.6rem;font-size:0.85rem">English <input type="range" id="meme-scale-en" min="50" max="140" value="' + Math.round(scale.en * 100) + '" style="flex:1"/> <span id="meme-scale-en-val">' + Math.round(scale.en * 100) + "%</span></label>" +
      '<div class="wire-actions" style="display:flex;flex-wrap:wrap;gap:0.4rem">' +
      '<button type="button" class="btn primary" id="meme-scale-apply">Apply scale</button>' +
      '<button type="button" class="btn" id="meme-scale-auto">Auto-scale text</button>' +
      '<button type="button" class="btn" id="meme-scale-reset">Reset 100%</button>' +
      "</div></div>";
    if (hostPrefer) {
      hostPrefer.appendChild(panel);
      syncSliders();
      bindScaleControls();
      return;
    }
    var ratioSec = null;
    d.querySelectorAll(".tool-section").forEach(function (sec) {
      if (/Scale|ratio/i.test(sec.textContent || "")) ratioSec = sec;
    });
    if (ratioSec && ratioSec.parentNode) ratioSec.parentNode.insertBefore(panel, ratioSec.nextSibling);
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
    if (apply) apply.addEventListener("click", function () {
      onSlide();
      try { localStorage.setItem(STORE, JSON.stringify(scale)); } catch (e) {}
      schedulePaint();
    });
    var auto = $("meme-scale-auto");
    if (auto) auto.addEventListener("click", autoScale);
    var reset = $("meme-scale-reset");
    if (reset) reset.addEventListener("click", function () {
      scale = { ar: 1, en: 1, ref: 1 };
      try { localStorage.setItem(STORE, JSON.stringify(scale)); } catch (e2) {}
      syncSliders();
      schedulePaint();
    });
  }

  function installHooks() {
    /* always own image loader so online-bg keeps scenery */
    w.memeLoadImageFromUrl = function (url, failMsg) {
      loadBgUrl(url, failMsg);
    };
    w.memeLoadImageFromUrl._craftStd = true;

    w.memeDraw = function () { schedulePaint(); };
    w.memeDraw._craftStd = true;

    w.craftMemePaintStandard = schedulePaint;
    w.craftMemeRepaintStandard = schedulePaint;
    
    w.craftMemeParseLayers = parseLayers;
    w.memeAutoScaleLines = autoScale;
    w.craftMemeSetScale = function (ar, en) {
      if (typeof ar === "number") scale.ar = Math.min(1.4, Math.max(0.5, ar));
      if (typeof en === "number") scale.en = Math.min(1.4, Math.max(0.5, en));
      try { localStorage.setItem(STORE, JSON.stringify(scale)); } catch (e) {}
      syncSliders();
      schedulePaint();
    };

    /* if something sets memeState.img later, repaint */
    try {
      var st = ensureMemeState();
      if (st.img && st.img.width) rememberBg(st.img);
    } catch (e3) {}
  }

  function wireUi() {
    try { bindScaleControls(); } catch (eB) {}
    try { injectScalePanel(); } catch (eI) {}

    injectScalePanel();
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
        b.addEventListener("click", function () { setTimeout(fullPaint, 50); });
      }
    });
    d.querySelectorAll("[data-meme-section]").forEach(function (btn) {
      if (btn._stdSec) return;
      btn._stdSec = true;
      btn.addEventListener("click", function () { setTimeout(fullPaint, 500); });
    });
    var refresh = $("meme-refresh-source");
    if (refresh && !refresh._std) {
      refresh._std = true;
      refresh.addEventListener("click", function () { setTimeout(fullPaint, 400); });
    }
    /* next scenery should keep bg after fetch */
    var next = $("meme-next-bg");
    if (next && !next._std) {
      next._std = true;
      next.addEventListener("click", function () {
        setTimeout(function () {
          var st = w.memeState;
          if (st && st.img) rememberBg(st.img);
          schedulePaint();
        }, 700);
      });
    }
  }

  function muteMediaBoot() {
    if (w.ClarityCraftStudioBoot) {
      w.ClarityCraftStudioBoot.media = function () { return false; };
    }
  }

  function boot() {
    installHooks();
    muteMediaBoot();
    wireUi();
    setTimeout(installHooks, 400);
    setTimeout(installHooks, 1200);
    setTimeout(wireUi, 600);
    setTimeout(function () { fetchUrduThenPaint(); }, 900);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(installHooks, 200);
    setTimeout(fullPaint, 500);
  });

  /* C19MEME20 · single-owner lock — neutralize legacy painters */
  function neutralizeLegacyPainters() {
    try {
      /* wire / atelier / phase-bc direct paints must not stack text */
      if (w.paintWithBg && !w.paintWithBg._std) {
        w.paintWithBg = function () { schedulePaint(); };
        w.paintWithBg._std = true;
      }
      if (w.paintCanvas && !w.paintCanvas._std) {
        w.paintCanvas = function () { schedulePaint(); };
        w.paintCanvas._std = true;
      }
      if (w.paintWithStoredBg && !w.paintWithStoredBg._std) {
        w.paintWithStoredBg = function () { schedulePaint(); };
        w.paintWithStoredBg._std = true;
      }
      /* reassert memeDraw ownership after late scripts */
      w.memeDraw = function () { schedulePaint(); };
      w.memeDraw._craftStd = true;
      w.memeDraw._owner = "paint-standard-v1";
    } catch (e) {}
  }
  neutralizeLegacyPainters();
  setTimeout(neutralizeLegacyPainters, 400);
  setTimeout(neutralizeLegacyPainters, 1200);
  w.addEventListener("load", function () {
    neutralizeLegacyPainters();
    schedulePaint();
  });

})(window, document);
