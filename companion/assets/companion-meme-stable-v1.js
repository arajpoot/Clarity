/*! companion-meme-stable-v1
 * Peak architecture (archive3/5 lessons): single owner · size-only compact sliders · canvas place handles
 * Quarantine noisy layers · calm BG/text · gold frame · educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_STABLE_V1__) return;
  w.__COMPANION_MEME_STABLE_V1__ = true;

  /* Kill switch for older injectors */
  w.__CLARITY_MEME_STUDIO_RICH_V1__ = true;
  w.__COMPANION_MEME_PEACE_V1__ = true;
  w.__COMPANION_MEME_CLEANUP_V1__ = true;
  w.__COMPANION_MEME_LOCK_V1__ = true;
  w.__COMPANION_MEME_POST_V2__ = true;
  w.__COMPANION_MEME_MERGE_V1__ = true;
  w.__COMPANION_MEME_QUIET_FIT_V1__ = true;

  function S() {
    if (!w.memeState || typeof w.memeState !== "object") w.memeState = {};
    var s = w.memeState;
    if (s.topY == null) s.topY = 0.26;
    if (s.midY == null) s.midY = 0.5;
    if (s.botY == null) s.botY = 0.72;
    if (s.scaleTop == null) s.scaleTop = 100;
    if (s.scaleMid == null) s.scaleMid = 100;
    if (s.scaleBot == null) s.scaleBot = 95;
    if (s.blankColor1 == null) s.blankColor1 = "#0b1220";
    if (s.blankColor2 == null) s.blankColor2 = "#1a1030";
    if (s.top == null) s.top = "";
    if (s.mid == null) s.mid = "";
    if (s.bottom == null) s.bottom = "";
    if (s.ref == null) s.ref = "";
    return s;
  }

  function status(msg) {
    var el = d.getElementById("meme-fetch-status") || d.getElementById("meme-rrra-status");
    if (el) el.textContent = (msg || "").replace(/\s*·\s*ok\s*$/i, "");
  }

  /* Inject CSS: hide all legacy control noise */
  function injectCss() {
    if (d.getElementById("meme-stable-css")) return;
    var s = d.createElement("style");
    s.id = "meme-stable-css";
    s.textContent = [
      "#meme-rich-controls, #meme-peace-sliders, #meme-post-v2-bar { display:none !important; }",
      "#meme-studio-root .meme-line-size, #meme-studio-root [class*='line-size'] { display:none !important; }",
      "#meme-stable-size { margin:.35rem 0; padding:.4rem .55rem; border:1px solid rgba(212,180,90,.3); border-radius:10px; background:rgba(0,0,0,.18); font-size:.7rem; }",
      "#meme-stable-size .row { display:grid; grid-template-columns:4.5rem 1fr 2.2rem; gap:.2rem .4rem; align-items:center; margin:.15rem 0; }",
      "#meme-stable-size input[type=range] { width:100%; height:1rem; }",
      "#meme-stage, .meme-stage-wrap { position:relative; }",
      ".meme-drag-handle { position:absolute; left:6%; width:88%; height:22px; margin-top:-11px; border:1px dashed rgba(212,180,90,.4); border-radius:6px; background:rgba(255,255,255,.03); cursor:ns-resize; z-index:6; touch-action:none; }",
      "/* hide duplicate Auto-scale Save Tweet above canvas when followed by BG bar */",
      "#meme-studio-root > .meme-bar:has(+ .meme-bar-bg) { display:none; }"
    ].join("\n");
    (d.head || d.documentElement).appendChild(s);
  }

  function stripNoise() {
    ["meme-rich-controls", "meme-peace-sliders"].forEach(function (id) {
      d.querySelectorAll("#" + id).forEach(function (n) {
        n.style.display = "none";
        if (!n.getAttribute("data-quarantine")) {
          n.innerHTML = "";
          n.setAttribute("data-quarantine", "1");
        }
      });
    });
    // plant quarantine so rich inject exits
    if (!d.getElementById("meme-rich-controls")) {
      var dummy = d.createElement("div");
      dummy.id = "meme-rich-controls";
      dummy.style.display = "none";
      dummy.setAttribute("data-quarantine", "1");
      (d.body || d.documentElement).appendChild(dummy);
    }
    var root = d.getElementById("meme-studio-root");
    if (!root) return;
    root.querySelectorAll("div").forEach(function (el) {
      if (el.id === "meme-stable-size" || el.id === "meme-stable-share") return;
      var tx = el.textContent || "";
      if (/LINE SIZE/i.test(tx) && el.querySelectorAll("select").length >= 2) el.style.display = "none";
      if (/Top \(Arabic\) size/.test(tx) && el.querySelectorAll('input[type=range]').length >= 4) el.style.display = "none";
      if (/Size \(40/.test(tx) && el.id !== "meme-stable-size") el.style.display = "none";
    });
  }

  /* Size-only compact strip (half height, full range) */
  function injectSizeOnly() {
    if (d.getElementById("meme-stable-size")) return;
    var root = d.getElementById("meme-studio-root");
    if (!root) return;
    var box = d.createElement("div");
    box.id = "meme-stable-size";
    box.innerHTML =
      '<div style="opacity:.85;margin-bottom:.2rem">Text size only · drag dashed bands on canvas to place</div>' +
      '<div class="row"><span>Arabic</span><input type="range" id="st-scale-top" min="40" max="180" value="100"/><b id="st-st">100</b></div>' +
      '<div class="row"><span>English</span><input type="range" id="st-scale-mid" min="40" max="180" value="100"/><b id="st-sm">100</b></div>' +
      '<div class="row"><span>Urdu/body</span><input type="range" id="st-scale-bot" min="40" max="180" value="95"/><b id="st-sb">95</b></div>';
    var stage = d.getElementById("meme-stage") || d.getElementById("meme-canvas");
    if (stage && stage.parentNode) stage.parentNode.insertBefore(box, stage.nextSibling);
    else root.appendChild(box);
    function bind(id, key, lab) {
      var el = d.getElementById(id);
      if (!el || el.__st) return;
      el.__st = true;
      el.addEventListener("input", function () {
        var v = parseInt(el.value, 10);
        S()[key] = v;
        var L = d.getElementById(lab);
        if (L) L.textContent = String(v);
        paint();
      });
    }
    bind("st-scale-top", "scaleTop", "st-st");
    bind("st-scale-mid", "scaleMid", "st-sm");
    bind("st-scale-bot", "scaleBot", "st-sb");
  }

  function injectShare() {
    if (d.getElementById("meme-stable-share")) return;
    var root = d.getElementById("meme-studio-root");
    if (!root) return;
    var bar = d.createElement("div");
    bar.id = "meme-stable-share";
    bar.style.cssText = "display:flex;flex-wrap:wrap;gap:.35rem;margin:.4rem 0;align-items:center";
    bar.innerHTML =
      '<button type="button" class="btn-soft" id="st-copy">Copy X text</button>' +
      '<button type="button" class="btn-soft" id="st-post">Post on X</button>' +
      '<button type="button" class="btn-soft" id="st-save">Save PNG</button>';
    var stage = d.getElementById("meme-stage");
    if (stage && stage.parentNode) stage.parentNode.insertBefore(bar, stage);
    else root.appendChild(bar);
    d.getElementById("st-copy").onclick = function () {
      var t = sharePayload();
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { status("Copied"); });
    };
    d.getElementById("st-post").onclick = function () {
      w.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(sharePayload()), "_blank", "noopener");
    };
    d.getElementById("st-save").onclick = function () {
      paint();
      try {
        var a = d.createElement("a");
        a.download = "clarity-meme.png";
        a.href = d.getElementById("meme-canvas").toDataURL("image/png");
        a.click();
      } catch (e) { status("Save blocked"); }
    };
  }

  function sharePayload() {
    var s = S();
    var parts = [s.top, s.mid, s.ref || "", "educational only · clarity-dawah.fyi"].filter(Boolean);
    return parts.join("\n\n").slice(0, 280);
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
    var s = S();
    // sync inputs
    var ti = d.getElementById("meme-top-input");
    var mi = d.getElementById("meme-mid-input");
    var bi = d.getElementById("meme-bottom-input");
    if (ti) s.top = ti.value;
    if (mi) s.mid = mi.value;
    if (bi) {
      var bv = (bi.value || "").trim();
      if (/qur.?n|hadith|:\s*\d/i.test(bv) && bv.length < 80) s.ref = bv;
      else s.bottom = bv;
    }
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
      g.addColorStop(0, s.blankColor1);
      g.addColorStop(1, s.blankColor2);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }
    var inset = Math.max(16, Math.floor(Math.min(W, H) * 0.05));
    var stripH = Math.max(26, Math.floor(H * 0.09));
    var safe = { x: inset, y: inset, w: W - inset * 2, h: H - inset * 2 - stripH * 0.85 };
    ctx.strokeStyle = "rgba(212,175,55,0.85)";
    ctx.lineWidth = Math.max(3, Math.floor(inset * 0.2));
    ctx.strokeRect(inset * 0.5, inset * 0.5, W - inset, H - inset);
    ctx.strokeStyle = "rgba(255,230,150,0.5)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(inset * 0.85, inset * 0.85, W - inset * 1.7, H - inset * 1.7);
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.fillRect(inset, H - stripH - inset * 0.15, W - inset * 2, stripH);
    var maxW = safe.w * 0.92, cx = W / 2;

    function drawBlock(text, yFrac, scalePct, base) {
      text = (text || "").trim();
      if (!text) return;
      var yCenter = safe.y + safe.h * Math.max(0.08, Math.min(0.92, yFrac));
      var maxSize = Math.floor(base * (Math.max(40, Math.min(180, scalePct)) / 100));
      var size = fitFont(ctx, text.split(/\s+/).slice(0, 6).join(" "), maxW, maxSize, 10);
      ctx.font = "700 " + size + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
      var lines = wrap(ctx, text, maxW);
      while (lines.length * size * 1.28 > safe.h * 0.36 && size > 10) {
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
        ctx.fillStyle = "#fff8e7";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.strokeText(ln, cx, y);
        ctx.fillText(ln, cx, y);
      });
    }
    drawBlock(s.top, s.topY, s.scaleTop, Math.floor(W * 0.055));
    drawBlock(s.mid, s.midY, s.scaleMid, Math.floor(W * 0.036));
    if (s.bottom && !/^qur/i.test(s.bottom)) drawBlock(s.bottom, s.botY, s.scaleBot, Math.floor(W * 0.032));
    if (s.ref) {
      var rSize = Math.max(10, Math.floor(W * 0.024));
      ctx.font = "600 " + rSize + "px Georgia, serif";
      ctx.fillStyle = "rgba(255,248,230,0.9)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(s.ref, cx, H - stripH / 2);
    }
    layoutHandles();
    return true;
  }

  function layoutHandles() {
    var stage = d.getElementById("meme-stage") || (d.getElementById("meme-canvas") && d.getElementById("meme-canvas").parentElement);
    var canvas = d.getElementById("meme-canvas");
    if (!stage || !canvas) return;
    if (getComputedStyle(stage).position === "static") stage.style.position = "relative";
    var H = canvas.clientHeight || 200;
    var safeTop = 0.08 * H, safeH = 0.72 * H;
    var s = S();
    [["top", "topY"], ["mid", "midY"], ["bot", "botY"]].forEach(function (pair) {
      var id = "meme-drag-" + pair[0];
      var h = d.getElementById(id);
      if (!h) {
        h = d.createElement("div");
        h.id = id;
        h.className = "meme-drag-handle";
        h.setAttribute("data-y", pair[1]);
        h.title = "Drag to place " + pair[0];
        stage.appendChild(h);
        bindDrag(h);
      }
      h.style.top = safeTop + safeH * (s[pair[1]] || 0.5) + "px";
    });
  }

  function bindDrag(el) {
    if (el.__st) return;
    el.__st = true;
    var key = el.getAttribute("data-y");
    el.addEventListener("pointerdown", function (ev) {
      el.setPointerCapture(ev.pointerId);
      function move(e) {
        var canvas = d.getElementById("meme-canvas");
        if (!canvas) return;
        var rect = canvas.getBoundingClientRect();
        var y = e.clientY - rect.top;
        var frac = (y - rect.height * 0.08) / (rect.height * 0.72);
        frac = Math.max(0.08, Math.min(0.92, frac));
        S()[key] = frac;
        paint();
      }
      function up() {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
      }
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      move(ev);
    });
  }

  /* Text packs + BG */
  var PACKS = {
    reminder: [{ ar: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ", en: "Every soul will taste death.", ur: "ہر جان موت کا مزہ چکھنے والی ہے۔", ref: "Qur'an 3:185" }, { ar: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", en: "All praise is for Allah, Lord of the worlds.", ur: "تمام تعریفیں اللہ کے لیے ہیں۔", ref: "Qur'an 1:2" }],
    reality: [{ ar: "وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ", en: "And cooperate in righteousness and piety.", ur: "نیکی اور پرہیزگاری میں تعاون کرو۔", ref: "Qur'an 5:2" }],
    reflection: [{ ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", en: "Indeed, with hardship comes ease.", ur: "بیشک تنگی کے ساتھ آسانی ہے۔", ref: "Qur'an 94:6" }],
    action: [{ ar: "وَأَقِيمُوا الصَّلَاةَ", en: "And establish prayer.", ur: "اور نماز قائم کرو۔", ref: "Qur'an 2:43" }],
    daily: [{ ar: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", en: "In the name of Allah, the Entirely Merciful, the Especially Merciful.", ur: "اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔", ref: "Qur'an 1:1" }],
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
    s.top = item.ar; s.mid = item.en; s.bottom = item.ur; s.ref = item.ref;
    var t = d.getElementById("meme-top-input");
    var m = d.getElementById("meme-mid-input");
    var b = d.getElementById("meme-bottom-input");
    if (t) t.value = s.top;
    if (m) m.value = s.mid;
    if (b) b.value = s.ref;
    paint();
  }

  var SCENES = {
    nature: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&q=80"],
    holy: ["https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Mount_Arafat.jpg/800px-Mount_Arafat.jpg"],
    flowers: ["https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1280&q=80"],
    night: ["https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1280&q=80"],
    water: ["https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1280&q=80"],
    spirit: ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1280&q=80"],
    free: ["https://picsum.photos/seed/clarity-stable/1280/720"],
    pattern: ["https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1280&q=80"],
    decor: ["https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&q=80"]
  };
  var sidx = {};
  function loadScene(kind) {
    kind = String(kind || "nature").toLowerCase();
    if (kind === "blank") { S().img = null; S().bgImage = null; paint(); return; }
    if (/context/.test(kind)) kind = "spirit";
    if (/decor|décor/.test(kind)) kind = "decor";
    if (!SCENES[kind]) kind = "nature";
    var list = SCENES[kind];
    if (sidx[kind] == null) sidx[kind] = 0;
    var url = list[sidx[kind] % list.length];
    sidx[kind]++;
    status("Scene · " + kind);
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () { S().img = img; S().bgImage = img; status(""); paint(); };
    img.onerror = function () { status("Scene unavailable"); };
    img.src = url;
  }

  function wire() {
    var root = d.getElementById("meme-studio-root") || d;
    root.querySelectorAll("[data-meme-fetch]").forEach(function (btn) {
      if (btn.__st) return;
      btn.__st = true;
      btn.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        applyPack(btn.getAttribute("data-meme-fetch") || "reminder");
      }, true);
    });
    root.querySelectorAll("[data-meme-bg], [data-meme-decor]").forEach(function (btn) {
      if (btn.__stb) return;
      btn.__stb = true;
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
    w.memeFetchBg = function (k) { loadScene(k); return Promise.resolve(true); };
    w.memeFetchRrra = applyPack;
    w.memeDailyVerse = function () { applyPack("daily"); };
    w.memeFromCommand = function () { applyPack("command"); };
    w.memeMasnunDua = function () { applyPack("dua"); };
    w.memeNightQuote = function () { applyPack("night"); };
    w.tdPost = function () {
      w.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(sharePayload()), "_blank", "noopener");
    };
    w.memeSharePayload = sharePayload;
    if (!w.ClarityMemePaintV2) w.ClarityMemePaintV2 = {};
    w.ClarityMemePaintV2.paint = paint;
  }

  function boot() {
    injectCss();
    stripNoise();
    injectSizeOnly();
    injectShare();
    claim();
    wire();
    paint();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  d.addEventListener("clarity:tab-mounted", function () { setTimeout(boot, 80); });
  w.addEventListener("resize", function () { paint(); });

  try {
    new MutationObserver(function () {
      stripNoise();
      if (!d.getElementById("meme-stable-size")) injectSizeOnly();
    }).observe(d.documentElement, { childList: true, subtree: true });
  } catch (e) {}

  var n = 0;
  var iv = setInterval(function () {
    n++;
    stripNoise();
    claim();
    wire();
    if (n >= 15) clearInterval(iv);
  }, 300);
})(window, document);
