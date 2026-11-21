/*! companion-meme-core-v1
 * SINGLE owner. Scenery-only BG. Gold frame. Strip = clarity-dawah.fyi. Size dropdowns.
 * Educational only — not a fatwa. No figurative people/animals in backgrounds.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_CORE_V1__) return;
  w.__COMPANION_MEME_CORE_V1__ = true;

  var STRIP = "clarity-dawah.fyi";

  function S() {
    if (!w.memeState || typeof w.memeState !== "object") w.memeState = {};
    var s = w.memeState;
    if (s.topY == null) s.topY = 0.22;
    if (s.midY == null) s.midY = 0.48;
    if (s.botY == null) s.botY = 0.72;
    if (s.scaleTop == null) s.scaleTop = 100;
    if (s.scaleMid == null) s.scaleMid = 100;
    if (s.scaleBot == null) s.scaleBot = 95;
    if (s.blankColor1 == null) s.blankColor1 = "#0b1220";
    if (s.blankColor2 == null) s.blankColor2 = "#1a1030";
    return s;
  }

  function status(msg) {
    var el = d.getElementById("meme-fetch-status") || d.getElementById("meme-rrra-status");
    if (el) el.textContent = msg || "";
  }

  /* Scenery / architecture / sky / water only — no figurative people */
  var SCENES = {
    nature: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1280&q=80"
    ],
    holy: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Mount_Arafat.jpg/800px-Mount_Arafat.jpg",
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1280&q=80"
    ],
    flowers: ["https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1280&q=80"],
    night: [
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1280&q=80",
      "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1280&q=80"
    ],
    water: ["https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1280&q=80"],
    spirit: ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1280&q=80"],
    free: ["https://picsum.photos/seed/clarity-scenery/1280/720"],
    pattern: ["https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1280&q=80"],
    decor: ["https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&q=80"]
  };
  var sidx = {}, lockBg = false;

  function loadScene(kind) {
    kind = String(kind || "nature").toLowerCase().replace(/\s+/g, "");
    if (kind === "blank") {
      S().img = null;
      S().bgImage = null;
      status("");
      paint();
      return;
    }
    if (/context/.test(kind)) kind = "spirit";
    if (/décor|decor/.test(kind)) kind = "decor";
    if (!SCENES[kind]) kind = "nature";
    var list = SCENES[kind];
    if (sidx[kind] == null) sidx[kind] = 0;
    var url = list[sidx[kind] % list.length];
    sidx[kind]++;
    if (lockBg) return;
    lockBg = true;
    status("Scene · " + kind);
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      lockBg = false;
      S().img = img;
      S().bgImage = img;
      status("");
      paint();
    };
    img.onerror = function () {
      lockBg = false;
      status("Scene unavailable");
    };
    img.src = url;
  }

  var PACKS = {
    reminder: [
      { ar: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ", en: "Every soul will taste death.", ur: "ہر جان موت کا مزہ چکھنے والی ہے۔", ref: "Qur'an 3:185" },
      { ar: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", en: "In the name of Allah, the Entirely Merciful, the Especially Merciful.", ur: "اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔", ref: "Qur'an 1:1" }
    ],
    reality: [{ ar: "وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ", en: "And cooperate in righteousness and piety.", ur: "نیکی اور پرہیزگاری میں تعاون کرو۔", ref: "Qur'an 5:2" }],
    reflection: [{ ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", en: "Indeed, with hardship comes ease.", ur: "بیشک تنگی کے ساتھ آسانی ہے۔", ref: "Qur'an 94:6" }],
    action: [{ ar: "وَأَقِيمُوا الصَّلَاةَ", en: "And establish prayer.", ur: "اور نماز قائم کرو۔", ref: "Qur'an 2:43" }],
    daily: [{ ar: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", en: "All praise is for Allah, Lord of the worlds.", ur: "تمام تعریفیں اللہ کے لیے ہیں۔", ref: "Qur'an 1:2" }],
    command: [{ ar: "وَأَقِيمُوا الصَّلَاةَ", en: "And establish prayer.", ur: "اور نماز قائم کرو۔", ref: "Qur'an 2:43" }],
    dua: [{ ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً", en: "Our Lord, give us good in this world.", ur: "اے ہمارے رب! دنیا میں بھلائی عطا فرما۔", ref: "Qur'an 2:201" }],
    night: [{ ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", en: "Surely in the remembrance of Allah do hearts find rest.", ur: "اللہ کے ذکر سے دلوں کو اطمینان ہے۔", ref: "Qur'an 13:28" }]
  };
  PACKS.surprise = PACKS.reminder.concat(PACKS.reality);
  var pidx = {};

  function applyPack(kind) {
    kind = String(kind || "reminder").toLowerCase();
    if (/masn/.test(kind)) kind = "dua";
    var list = PACKS[kind] || PACKS.reminder;
    if (pidx[kind] == null) pidx[kind] = 0;
    var item = list[pidx[kind] % list.length];
    pidx[kind]++;
    var s = S();
    s.top = item.ar;
    s.mid = item.en;
    s.bottom = item.ur || "";
    s.ref = item.ref || "";
    var t = d.getElementById("meme-top-input");
    var m = d.getElementById("meme-mid-input");
    var b = d.getElementById("meme-bottom-input");
    if (t) t.value = s.top;
    if (m) m.value = s.mid;
    if (b) b.value = s.ref;
    paint();
  }

  function normRef(r) {
    r = String(r || "").trim();
    if (!r || /https?:|clarity-dawah|educational only/i.test(r)) return "";
    var q = r.match(/(?:Qur['']?a?n)?\s*(\d{1,3})\s*[:：]\s*(\d{1,3})/i);
    if (q) {
      var a = parseInt(q[1], 10), b = parseInt(q[2], 10);
      if (a >= 1 && a <= 114 && b >= 1 && b <= 286) return "Qur'an " + a + ":" + b;
    }
    return "";
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
    var active = d.querySelector("[data-meme-ratio].is-active");
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
    var s = S();
    var ti = d.getElementById("meme-top-input");
    var mi = d.getElementById("meme-mid-input");
    if (ti && ti.value) s.top = ti.value;
    if (mi && mi.value) s.mid = mi.value;
    var verseRef = normRef(s.ref);

    var bg = s.bgImage || s.img;
    if (bg && bg.complete && bg.naturalWidth) {
      try {
        var iw = bg.naturalWidth, ih = bg.naturalHeight;
        var sc = Math.max(W / iw, H / ih);
        ctx.drawImage(bg, (W - iw * sc) / 2, (H - ih * sc) / 2, iw * sc, ih * sc);
        ctx.fillStyle = "rgba(0,0,0,0.32)";
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
    var stripH = Math.max(30, Math.floor(H * 0.11));
    var safe = { x: inset, y: inset, w: W - inset * 2, h: H - inset * 2 - stripH };

    ctx.strokeStyle = "rgba(212,175,55,0.9)";
    ctx.lineWidth = Math.max(3, Math.floor(inset * 0.22));
    ctx.strokeRect(inset * 0.5, inset * 0.5, W - inset, H - inset);
    ctx.strokeStyle = "rgba(255,230,150,0.55)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(inset * 0.85, inset * 0.85, W - inset * 1.7, H - inset * 1.7);

    ctx.fillStyle = "rgba(0,0,0,0.42)";
    ctx.fillRect(inset * 0.55, H - stripH - inset * 0.1, W - inset * 1.1, stripH);

    var maxW = safe.w * 0.92, cx = W / 2;
    function drawBlock(text, yFrac, scalePct, base) {
      text = (text || "").trim();
      if (!text) return;
      var yCenter = safe.y + safe.h * Math.max(0.1, Math.min(0.9, yFrac));
      var maxSize = Math.floor(base * (Math.max(50, Math.min(180, scalePct)) / 100));
      var size = fitFont(ctx, text.split(/\s+/).slice(0, 6).join(" "), maxW, maxSize, 11);
      ctx.font = "700 " + size + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
      var lines = wrap(ctx, text, maxW);
      while (lines.length * size * 1.28 > safe.h * 0.36 && size > 11) {
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
        ctx.strokeStyle = "rgba(0,0,0,0.7)";
        ctx.lineWidth = Math.max(2, Math.floor(size * 0.11));
        ctx.fillStyle = "#fff8e7";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.strokeText(ln, cx, y);
        ctx.fillText(ln, cx, y);
      });
    }

    drawBlock(s.top, s.topY, s.scaleTop, Math.floor(W * 0.055));
    drawBlock(s.mid, s.midY, s.scaleMid, Math.floor(W * 0.036));
    var urdu = (s.bottom || "").trim();
    if (urdu && (normRef(urdu) || /^\d+:\d+$/.test(urdu))) urdu = "";
    if (urdu) {
      drawBlock(urdu, s.botY, s.scaleBot, Math.floor(W * 0.03));
      if (verseRef) drawBlock(verseRef, Math.min(0.9, s.botY + 0.12), 90, Math.floor(W * 0.026));
    } else if (verseRef) {
      drawBlock(verseRef, s.botY, s.scaleBot, Math.floor(W * 0.03));
    }

    // STRIP only
    var pSize = Math.max(12, Math.floor(W * 0.03));
    ctx.font = "600 " + pSize + "px system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,230,150,0.95)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(STRIP, cx, H - stripH / 2);

    if (stage) {
      if (getComputedStyle(stage).position === "static") stage.style.position = "relative";
      var link = d.getElementById("meme-strip-link");
      if (!link) {
        link = d.createElement("a");
        link.id = "meme-strip-link";
        link.href = "https://clarity-dawah.fyi/";
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.style.cssText = "position:absolute;left:10%;width:80%;bottom:3%;height:12%;z-index:8;";
        stage.appendChild(link);
      }
    }
    return true;
  }

  function injectUi() {
    // hide legacy chrome
    if (!d.getElementById("meme-core-css")) {
      var st = d.createElement("style");
      st.id = "meme-core-css";
      st.textContent = [
        "#meme-rich-controls,#meme-peace-sliders,#meme-stable-size,#meme-night-size,",
        "#meme-post-v2-bar,#meme-stable-share{display:none!important}",
        "#meme-core-bar{display:flex;flex-wrap:wrap;gap:.4rem;align-items:center;margin:.4rem 0;",
        "padding:.4rem .55rem;border:1px solid rgba(212,180,90,.3);border-radius:10px;",
        "background:rgba(0,0,0,.18);font-size:.72rem}",
        "#meme-core-bar select{font-size:.72rem;padding:.15rem .3rem;border-radius:6px}"
      ].join("");
      (d.head || d.documentElement).appendChild(st);
    }
    if (d.getElementById("meme-core-bar")) return;
    var root = d.getElementById("meme-studio-root");
    if (!root) return;
    var bar = d.createElement("div");
    bar.id = "meme-core-bar";
    var opts = [60, 80, 100, 120, 140, 160].map(function (n) {
      return '<option value="' + n + '">' + n + "%</option>";
    }).join("");
    bar.innerHTML =
      '<span>Size</span>' +
      '<label>AR <select id="mc-top">' + opts + "</select></label>" +
      '<label>EN <select id="mc-mid">' + opts + "</select></label>" +
      '<label>UR <select id="mc-bot">' + opts + "</select></label>" +
      '<button type="button" class="btn-soft" id="mc-copy">Copy X</button>' +
      '<button type="button" class="btn-soft" id="mc-post">Post X</button>' +
      '<button type="button" class="btn-soft" id="mc-save">PNG</button>';
    var stage = d.getElementById("meme-stage") || d.getElementById("meme-canvas");
    if (stage && stage.parentNode) stage.parentNode.insertBefore(bar, stage.nextSibling);
    else root.appendChild(bar);
    function bind(id, key) {
      var el = d.getElementById(id);
      if (!el) return;
      el.value = String(S()[key] || 100);
      el.addEventListener("change", function () {
        S()[key] = parseInt(el.value, 10) || 100;
        paint();
      });
    }
    bind("mc-top", "scaleTop");
    bind("mc-mid", "scaleMid");
    bind("mc-bot", "scaleBot");
    function share() {
      var s = S();
      return [s.top, s.mid, s.ref || "", "educational only · clarity-dawah.fyi"].filter(Boolean).join("\n\n").slice(0, 280);
    }
    d.getElementById("mc-copy").onclick = function () {
      if (navigator.clipboard) navigator.clipboard.writeText(share()).then(function () { status("Copied"); });
    };
    d.getElementById("mc-post").onclick = function () {
      w.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(share()), "_blank", "noopener");
    };
    d.getElementById("mc-save").onclick = function () {
      paint();
      try {
        var a = d.createElement("a");
        a.download = "clarity-meme.png";
        a.href = d.getElementById("meme-canvas").toDataURL("image/png");
        a.click();
      } catch (e) {}
    };
  }

  function wire() {
    var root = d.getElementById("meme-studio-root") || d;
    root.querySelectorAll("[data-meme-fetch]").forEach(function (btn) {
      if (btn.__core) return;
      btn.__core = true;
      btn.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        applyPack(btn.getAttribute("data-meme-fetch") || "reminder");
      }, true);
    });
    root.querySelectorAll("[data-meme-bg], [data-meme-decor]").forEach(function (btn) {
      if (btn.__coreb) return;
      btn.__coreb = true;
      btn.addEventListener("click", function (ev) {
        var kind = btn.getAttribute("data-meme-bg") || btn.getAttribute("data-meme-decor");
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
          else if (/decor|décor/.test(t)) kind = "decor";
          else if (/context/.test(t)) kind = "spirit";
          else return;
        }
        ev.preventDefault();
        ev.stopImmediatePropagation();
        loadScene(kind);
      }, true);
    });
  }

  function claim() {
    w.paintMeme = paint;
    w.memeDraw = paint;
    w.memePaintQuiet = paint;
    w.memeFetchBg = function (k) {
      loadScene(k);
      return Promise.resolve(true);
    };
    w.memeFetchRrra = applyPack;
    w.memeDailyVerse = function () { applyPack("daily"); };
    w.memeFromCommand = function () { applyPack("command"); };
    w.memeMasnunDua = function () { applyPack("dua"); };
    w.memeNightQuote = function () { applyPack("night"); };
    if (!w.ClarityMemePaintV2) w.ClarityMemePaintV2 = {};
    w.ClarityMemePaintV2.paint = paint;
  }

  function boot() {
    claim();
    injectUi();
    wire();
    paint();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  d.addEventListener("clarity:tab-mounted", function () { setTimeout(boot, 80); });
  w.addEventListener("resize", function () { paint(); });
})(window, document);
