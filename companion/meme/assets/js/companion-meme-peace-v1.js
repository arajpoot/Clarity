/*! companion-meme-peace-v1
 * End script war · calm tab-fetch · compact wide-range sliders · on-canvas drag handles
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_PEACE_V1__) return;
  w.__COMPANION_MEME_PEACE_V1__ = true;

  /* Freeze older meme painters after we boot */
  var FROZEN = false;

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
    if (!s.top) s.top = "";
    if (!s.mid) s.mid = "";
    if (!s.bottom) s.bottom = "";
    if (!s.ref) s.ref = "";
    return s;
  }

  function status(msg) {
    var el = d.getElementById("meme-fetch-status") || d.getElementById("meme-rrra-status");
    if (!el) return;
    el.textContent = (msg || "").replace(/\s*·\s*ok\s*$/i, "");
  }

  /* Offline educational packs — not a fatwa */
  var PACKS = {
    reminder: [
      { ar: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ", en: "Every soul will taste death.", ur: "ہر جان موت کا مزہ چکھنے والی ہے۔", ref: "Qur'an 3:185" },
      { ar: "فَاذْكُرُونِي أَذْكُرْكُمْ", en: "So remember Me; I will remember you.", ur: "پس تم مجھے یاد کرو، میں تمہیں یاد رکھوں گا۔", ref: "Qur'an 2:152" },
      { ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", en: "Surely in the remembrance of Allah do hearts find rest.", ur: "سنو! اللہ کے ذکر سے دلوں کو اطمینان ملتا ہے۔", ref: "Qur'an 13:28" }
    ],
    reality: [
      { ar: "وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ", en: "And cooperate in righteousness and piety.", ur: "نیکی اور پرہیزگاری میں ایک دوسرے کا تعاون کرو۔", ref: "Qur'an 5:2" },
      { ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", en: "Indeed, with hardship comes ease.", ur: "بیشک تنگی کے ساتھ آسانی ہے۔", ref: "Qur'an 94:6" }
    ],
    reflection: [
      { ar: "وَفِي أَنْفُسِكُمْ ۚ أَفَلَا تُبْصِرُونَ", en: "And in yourselves — then will you not see?", ur: "اور خود تمہارے نفوس میں؛ کیا تم نہیں دیکھت؟", ref: "Qur'an 51:21" },
      { ar: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ", en: "Read in the name of your Lord who created.", ur: "پڑھو اپنے رب کے نام سے جس نے پیدا کیا۔", ref: "Qur'an 96:1" }
    ],
    action: [
      { ar: "وَقُلِ اعْمَلُوا فَسَيَرَى اللَّهُ عَمَلَكُمْ", en: "And say, 'Do [as you will], for Allah will see your deeds.'", ur: "اور کہہ دو: عمل کرو، اللہ تمہارا عمل دیکھے گا۔", ref: "Qur'an 9:105" },
      { ar: "إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ", en: "Indeed, Allah loves the doers of good.", ur: "بیشک اللہ احسان کرنے والوں سے محبت کرتا ہے۔", ref: "Qur'an 2:195" }
    ],
    daily: [
      { ar: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", en: "All praise is for Allah, Lord of the worlds.", ur: "تمام تعریفیں اللہ کے لیے ہیں جو سارے جہانوں کا رب ہے۔", ref: "Qur'an 1:2" }
    ],
    command: [
      { ar: "وَأَقِيمُوا الصَّلَاةَ", en: "And establish prayer.", ur: "اور نماز قائم کرو۔", ref: "Qur'an 2:43" }
    ],
    dua: [
      { ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً", en: "Our Lord, give us good in this world…", ur: "اے ہمارے رب! ہمیں دنیا میں بھلائی عطا فرما۔", ref: "Qur'an 2:201" }
    ],
    night: [
      { ar: "وَمِنْ آنَائِ اللَّيْلِ فَسَبِّحْ", en: "And in the hours of the night, glorify Him.", ur: "اور رات کے حصوں میں اس کی تسبیح کرو۔", ref: "Qur'an 50:40" }
    ]
  };
  PACKS.surprise = PACKS.reminder.concat(PACKS.reality, PACKS.reflection, PACKS.action);

  var packIdx = {};

  function applyPack(kind) {
    kind = String(kind || "reminder").toLowerCase();
    if (kind === "masnun" || kind === "masnūn" || kind === "masnun-dua") kind = "dua";
    var list = PACKS[kind] || PACKS.reminder;
    if (packIdx[kind] == null) packIdx[kind] = 0;
    var item = list[packIdx[kind] % list.length];
    packIdx[kind]++;
    var s = S();
    s.top = item.ar || "";
    s.mid = item.en || "";
    s.bottom = item.ur || "";
    s.ref = item.ref || "";
    ["meme-top-input", "meme-mid-input", "meme-bottom-input"].forEach(function (id, i) {
      var el = d.getElementById(id);
      if (!el) return;
      el.value = i === 0 ? s.top : i === 1 ? s.mid : (s.ref || s.bottom);
    });
    // keep urdu in bottom state even if input shows ref
    status("Text · " + (item.ref || kind));
    paint(true);
  }

  function readInputs() {
    var s = S();
    var t = d.getElementById("meme-top-input");
    var m = d.getElementById("meme-mid-input");
    var b = d.getElementById("meme-bottom-input");
    if (t && t.value) s.top = t.value;
    if (m && m.value) s.mid = m.value;
    if (b && b.value) {
      var bv = b.value.trim();
      if (/qur.?n|hadith|:\s*\d/i.test(bv) && bv.length < 80) s.ref = bv;
      else s.bottom = bv;
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

  function drawGoldFrame(ctx, W, H, inset) {
    var x = inset * 0.55, y = inset * 0.55, w = W - inset * 1.1, h = H - inset * 1.1;
    ctx.strokeStyle = "rgba(212,175,55,0.85)";
    ctx.lineWidth = Math.max(3, Math.floor(inset * 0.22));
    ctx.strokeRect(x, y, w, h);
    ctx.strokeStyle = "rgba(255,230,150,0.55)";
    ctx.lineWidth = Math.max(1.5, Math.floor(inset * 0.1));
    ctx.strokeRect(x + inset * 0.35, y + inset * 0.35, w - inset * 0.7, h - inset * 0.7);
  }

  var painting = false;
  function paint(force) {
    if (painting && !force) return false;
    painting = true;
    try {
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
      var stripH = Math.max(26, Math.floor(H * 0.09));
      var safe = { x: inset, y: inset, w: W - inset * 2, h: H - inset * 2 - stripH * 0.8 };
      // store for drag
      s._safe = safe;
      s._cssW = W;
      s._cssH = H;

      drawGoldFrame(ctx, W, H, inset);
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(inset, H - stripH - inset * 0.2, W - inset * 2, stripH);

      var maxW = safe.w * 0.92;
      var cx = W / 2;

      function drawBlock(text, yPct, scalePct, base) {
        text = (text || "").trim();
        if (!text) return;
        var yCenter = safe.y + safe.h * (Math.max(8, Math.min(92, yPct)) / 100);
        var maxSize = Math.floor(base * (Math.max(40, Math.min(180, scalePct)) / 100));
        var sample = text.split(/\s+/).slice(0, 6).join(" ");
        var size = fitFont(ctx, sample, maxW, maxSize, 10);
        ctx.font = "700 " + size + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
        var lines = wrap(ctx, text, maxW);
        while (lines.length * size * 1.28 > safe.h * 0.38 && size > 10) {
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
          ctx.strokeStyle = "rgba(0,0,0,0.65)";
          ctx.lineWidth = Math.max(2, Math.floor(size * 0.1));
          ctx.fillStyle = "#fff8e7";
          ctx.textAlign = "center";
          ctx.textBaseline = "alphabetic";
          ctx.strokeText(ln, cx, y);
          ctx.fillText(ln, cx, y);
        });
      }

      var top = s.top, mid = s.mid, bot = (s.bottom || "").trim(), ref = (s.ref || "").trim();
      if (ref && bot === ref) bot = "";
      drawBlock(top, s.posTop, s.scaleTop, Math.floor(W * 0.055));
      drawBlock(mid, s.posMid, s.scaleMid, Math.floor(W * 0.036));
      if (bot && !/^qur/i.test(bot)) drawBlock(bot, s.posBot, s.scaleBot, Math.floor(W * 0.032));
      if (ref) {
        var rSize = Math.max(10, Math.floor(W * 0.024));
        ctx.font = "600 " + rSize + "px Georgia, serif";
        ctx.fillStyle = "rgba(255,248,230,0.9)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(ref, cx, H - stripH / 2);
      }
      layoutHandles();
      return true;
    } finally {
      painting = false;
    }
  }

  /* —— Compact sliders (half height UI, wide range) —— */
  function injectSliders() {
    var old = d.getElementById("meme-rich-controls");
    if (old) old.remove();
    if (d.getElementById("meme-peace-sliders")) return;
    var root = d.getElementById("meme-studio-root");
    if (!root) return;
    var box = d.createElement("div");
    box.id = "meme-peace-sliders";
    box.style.cssText = "margin:.4rem 0;padding:.45rem .65rem;border:1px solid rgba(212,180,90,.3);border-radius:10px;background:rgba(0,0,0,.18);font-size:.72rem";
    box.innerHTML =
      '<div style="opacity:.85;margin-bottom:.25rem">Size (40–180%) · Place · or drag handles on canvas</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.25rem .6rem;align-items:center">' +
      '<label>Top size <b id="ps-st">100</b>%</label><input type="range" id="ps-scale-top" min="40" max="180" value="100" style="width:100%;height:1.1rem"/>' +
      '<label>Top place <b id="ps-pt">26</b>%</label><input type="range" id="ps-pos-top" min="8" max="90" value="26" style="width:100%;height:1.1rem"/>' +
      '<label>Mid size <b id="ps-sm">100</b>%</label><input type="range" id="ps-scale-mid" min="40" max="180" value="100" style="width:100%;height:1.1rem"/>' +
      '<label>Mid place <b id="ps-pm">50</b>%</label><input type="range" id="ps-pos-mid" min="8" max="90" value="50" style="width:100%;height:1.1rem"/>' +
      '<label>Bot size <b id="ps-sb">95</b>%</label><input type="range" id="ps-scale-bot" min="40" max="180" value="95" style="width:100%;height:1.1rem"/>' +
      '<label>Bot place <b id="ps-pb">72</b>%</label><input type="range" id="ps-pos-bot" min="8" max="90" value="72" style="width:100%;height:1.1rem"/>' +
      '</div>';
    var stage = d.getElementById("meme-stage");
    if (stage && stage.parentNode) stage.parentNode.insertBefore(box, stage.nextSibling);
    else root.appendChild(box);

    function wire(id, key, lab) {
      var el = d.getElementById(id);
      if (!el || el.__peace) return;
      el.__peace = true;
      el.addEventListener("input", function () {
        var v = parseInt(el.value, 10);
        S()[key] = v;
        var L = d.getElementById(lab);
        if (L) L.textContent = String(v);
        paint(true);
      });
    }
    wire("ps-scale-top", "scaleTop", "ps-st");
    wire("ps-scale-mid", "scaleMid", "ps-sm");
    wire("ps-scale-bot", "scaleBot", "ps-sb");
    wire("ps-pos-top", "posTop", "ps-pt");
    wire("ps-pos-mid", "posMid", "ps-pm");
    wire("ps-pos-bot", "posBot", "ps-pb");
  }

  /* —— Transparent on-canvas drag handles —— */
  function layoutHandles() {
    var stage = d.getElementById("meme-stage") || d.getElementById("meme-canvas") && d.getElementById("meme-canvas").parentElement;
    var canvas = d.getElementById("meme-canvas");
    if (!stage || !canvas) return;
    if (getComputedStyle(stage).position === "static") stage.style.position = "relative";
    var s = S();
    var H = canvas.clientHeight || s._cssH || 200;
    var safeTop = 0.08 * H;
    var safeH = 0.72 * H;
    [["top", "posTop"], ["mid", "posMid"], ["bot", "posBot"]].forEach(function (pair) {
      var id = "meme-drag-" + pair[0];
      var h = d.getElementById(id);
      if (!h) {
        h = d.createElement("div");
        h.id = id;
        h.className = "meme-drag-handle";
        h.setAttribute("data-pos-key", pair[1]);
        h.title = "Drag to move " + pair[0] + " text";
        h.style.cssText =
          "position:absolute;left:8%;width:84%;height:28px;margin-top:-14px;border:1px dashed rgba(212,180,90,.35);" +
          "border-radius:8px;background:rgba(255,255,255,.04);cursor:ns-resize;z-index:5;touch-action:none;";
        stage.appendChild(h);
        bindDrag(h);
      }
      var pct = s[pair[1]] || 50;
      h.style.top = safeTop + safeH * (pct / 100) + "px";
    });
  }

  function bindDrag(el) {
    if (el.__drag) return;
    el.__drag = true;
    var key = el.getAttribute("data-pos-key");
    function onMove(clientY) {
      var canvas = d.getElementById("meme-canvas");
      if (!canvas) return;
      var rect = canvas.getBoundingClientRect();
      var y = clientY - rect.top;
      var pct = ((y - rect.height * 0.08) / (rect.height * 0.72)) * 100;
      pct = Math.max(8, Math.min(90, pct));
      S()[key] = Math.round(pct);
      var map = { posTop: ["ps-pos-top", "ps-pt"], posMid: ["ps-pos-mid", "ps-pm"], posBot: ["ps-pos-bot", "ps-pb"] };
      var ids = map[key];
      if (ids) {
        var r = d.getElementById(ids[0]);
        var L = d.getElementById(ids[1]);
        if (r) r.value = String(Math.round(pct));
        if (L) L.textContent = String(Math.round(pct));
      }
      paint(true);
    }
    el.addEventListener("pointerdown", function (ev) {
      el.setPointerCapture(ev.pointerId);
      el.style.background = "rgba(212,180,90,.15)";
      onMove(ev.clientY);
      function move(e) { onMove(e.clientY); }
      function up() {
        el.style.background = "rgba(255,255,255,.04)";
        el.releasePointerCapture(ev.pointerId);
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
      }
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
    });
  }

  function wireFetchPills() {
    var root = d.getElementById("meme-studio-root") || d;
    root.querySelectorAll("[data-meme-fetch]").forEach(function (btn) {
      if (btn.__peaceFetch) return;
      btn.__peaceFetch = true;
      btn.addEventListener("click", function (ev) {
        var kind = btn.getAttribute("data-meme-fetch") || "reminder";
        ev.preventDefault();
        ev.stopImmediatePropagation();
        applyPack(kind);
      }, true);
    });
  }

  function claim() {
    w.paintMeme = function () { return paint(true); };
    w.memeDraw = function () { return paint(true); };
    w.memePaintQuiet = function () { return paint(true); };
    if (!w.ClarityMemePaintV2) w.ClarityMemePaintV2 = {};
    w.ClarityMemePaintV2.paint = function () { return paint(true); };
    w.memeFetchRrra = function (k) { applyPack(k); };
    w.memeDailyVerse = function () { applyPack("daily"); };
    w.memeFromCommand = function () { applyPack("command"); };
    w.memeMasnunDua = function () { applyPack("dua"); };
    w.memeNightQuote = function () { applyPack("night"); };
    w.memeAutoScaleLines = function () {
      var s = S();
      s.scaleTop = 100; s.scaleMid = 100; s.scaleBot = 95;
      paint(true);
    };
  }

  function boot() {
    claim();
    injectSliders();
    wireFetchPills();
    paint(true);
    FROZEN = true;
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  d.addEventListener("clarity:tab-mounted", function () { setTimeout(boot, 100); });
  w.addEventListener("resize", function () { paint(true); });

  // brief claim window then stop interval noise
  var n = 0;
  var iv = setInterval(function () {
    n++;
    claim();
    wireFetchPills();
    if (!d.getElementById("meme-peace-sliders")) injectSliders();
    if (n >= 12) clearInterval(iv);
  }, 300);
})(window, document);
