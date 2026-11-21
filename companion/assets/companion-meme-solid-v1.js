/*! companion-meme-solid-v1
 * Viewport-safe · centered craft-style paint · scenery only · strip promo
 * Replaces stacked meme overlays. Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_SOLID_V1__) return;
  w.__COMPANION_MEME_SOLID_V1__ = true;

  var STRIP = "clarity-dawah.fyi";

  function S() {
    if (!w.memeState || typeof w.memeState !== "object") w.memeState = {};
    var s = w.memeState;
    if (s.scaleTop == null) s.scaleTop = 100;
    if (s.scaleMid == null) s.scaleMid = 100;
    if (s.scaleBot == null) s.scaleBot = 95;
    if (s.blankColor1 == null) s.blankColor1 = "#0b1220";
    if (s.blankColor2 == null) s.blankColor2 = "#152038";
    return s;
  }

  function status(msg) {
    var el = d.getElementById("meme-fetch-status");
    if (!el) return;
    var t = (msg || "").replace(/\s*·\s*ok\s*$/i, "");
    el.textContent = t;
  }

  /* Scenery only */
  var SCENES = {
    nature: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&q=80", "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1280&q=80"],
    holy: ["https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Mount_Arafat.jpg/800px-Mount_Arafat.jpg"],
    flowers: ["https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1280&q=80"],
    night: ["https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1280&q=80"],
    water: ["https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1280&q=80"],
    spirit: ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1280&q=80"],
    free: ["https://picsum.photos/seed/clarity-solid/1280/720"],
    pattern: ["https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1280&q=80"],
    decor: ["https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&q=80"]
  };
  var sidx = {}, bgLock = false;

  function loadScene(kind) {
    kind = String(kind || "nature").toLowerCase();
    if (kind === "blank") {
      S().img = null; S().bgImage = null; status(""); paint(); return;
    }
    if (/context/.test(kind)) kind = "spirit";
    if (/decor|décor/.test(kind)) kind = "decor";
    if (!SCENES[kind]) kind = "nature";
    var list = SCENES[kind];
    if (sidx[kind] == null) sidx[kind] = 0;
    var url = list[sidx[kind] % list.length];
    sidx[kind]++;
    if (bgLock) return;
    bgLock = true;
    status("Scene · " + kind);
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      bgLock = false;
      S().img = img; S().bgImage = img;
      status("");
      paint();
    };
    img.onerror = function () { bgLock = false; status("Scene unavailable"); };
    img.src = url;
  }

  var PACKS = {
    reminder: [
      { ar: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", en: "In the name of Allah, the Entirely Merciful, the Especially Merciful.", ur: "اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔", ref: "Qur'an 1:1" },
      { ar: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ", en: "Every soul will taste death.", ur: "ہر جان موت کا مزہ چکھنے والی ہے۔", ref: "Qur'an 3:185" }
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
    s.top = item.ar; s.mid = item.en; s.bottom = item.ur || ""; s.ref = item.ref || "";
    var t = d.getElementById("meme-top-input"), m = d.getElementById("meme-mid-input"), b = d.getElementById("meme-bottom-input");
    if (t) t.value = s.top;
    if (m) m.value = s.mid;
    if (b) b.value = s.ref;
    paint();
  }

  function normRef(r) {
    r = String(r || "").trim();
    if (!r || /https?:|clarity-dawah/i.test(r)) return "";
    var q = r.match(/(?:Qur['']?a?n)?\s*(\d{1,3})\s*[:：]\s*(\d{1,3})/i);
    if (!q) return "";
    var a = parseInt(q[1], 10), b = parseInt(q[2], 10);
    if (a < 1 || a > 114 || b < 1 || b > 286) return "";
    return "Qur'an " + a + ":" + b;
  }

  function wrap(ctx, text, maxW) {
    text = (text || "").trim();
    if (!text) return [];
    var words = text.split(/\s+/), lines = [], line = "";
    for (var i = 0; i < words.length; i++) {
      var test = line ? line + " " + words[i] : words[i];
      if (ctx.measureText(test).width <= maxW || !line) line = test;
      else { lines.push(line); line = words[i]; }
    }
    if (line) lines.push(line);
    return lines.slice(0, 5);
  }

  function paint() {
    var canvas = d.getElementById("meme-canvas");
    if (!canvas) return false;
    var stage = d.getElementById("meme-stage") || canvas.parentElement;

    // Force visible
    var root = d.getElementById("meme-studio-root");
    if (root) {
      root.style.display = "flex";
      root.style.flexDirection = "column";
      root.style.visibility = "visible";
      root.style.width = "100%";
    }
    if (stage) {
      stage.style.display = "block";
      stage.style.width = "100%";
      stage.style.position = "relative";
    }

    var cssW = 360;
    if (stage) {
      var rw = stage.getBoundingClientRect().width;
      if (rw > 40) cssW = Math.floor(rw);
    }
    if (cssW < 280) cssW = Math.min(360, Math.floor((w.innerWidth || 360) * 0.92));

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
    canvas.style.display = "block";
    canvas.style.margin = "0 auto";
    canvas.style.borderRadius = "14px";

    var ctx = canvas.getContext("2d");
    if (!ctx) return false;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    var W = cssW, H = cssH;
    var s = S();
    var ti = d.getElementById("meme-top-input");
    var mi = d.getElementById("meme-mid-input");
    if (ti && ti.value) s.top = ti.value;
    if (mi && mi.value) s.mid = mi.value;
    var ref = normRef(s.ref);

    // Background
    var bg = s.bgImage || s.img;
    if (bg && bg.complete && bg.naturalWidth) {
      try {
        var iw = bg.naturalWidth, ih = bg.naturalHeight;
        var sc = Math.max(W / iw, H / ih);
        var dw = iw * sc, dh = ih * sc;
        ctx.drawImage(bg, (W - dw) / 2, (H - dh) / 2, dw, dh);
        ctx.fillStyle = "rgba(0,0,0,0.34)";
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

    var inset = Math.max(14, Math.floor(Math.min(W, H) * 0.048));
    var stripH = Math.max(28, Math.floor(H * 0.1));
    var safeTop = inset;
    var safeBot = H - stripH - inset;
    var safeH = safeBot - safeTop;
    var maxW = W - inset * 2.4;
    var cx = W / 2; // ALWAYS center of canvas in CSS pixels

    // Gold frame
    ctx.strokeStyle = "rgba(212,175,55,0.9)";
    ctx.lineWidth = Math.max(2.5, inset * 0.18);
    ctx.strokeRect(inset * 0.45, inset * 0.45, W - inset * 0.9, H - inset * 0.9);
    ctx.strokeStyle = "rgba(255,230,150,0.5)";
    ctx.lineWidth = 1.25;
    ctx.strokeRect(inset * 0.8, inset * 0.8, W - inset * 1.6, H - inset * 1.6);

    // Strip band
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(inset * 0.5, H - stripH - inset * 0.15, W - inset, stripH + inset * 0.1);

    function drawCentered(text, y, scalePct, base, weight) {
      text = (text || "").trim();
      if (!text) return y;
      var maxSize = Math.floor(base * (Math.max(50, Math.min(160, scalePct || 100)) / 100));
      var size = maxSize;
      ctx.font = (weight || "700") + " " + size + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
      var lines = wrap(ctx, text, maxW);
      while (size > 12 && (lines.length * size * 1.3 > safeH * 0.35 || ctx.measureText(lines[0] || "").width > maxW)) {
        size -= 1;
        ctx.font = (weight || "700") + " " + size + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
        lines = wrap(ctx, text, maxW);
      }
      var lh = size * 1.32;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineJoin = "round";
      lines.forEach(function (ln, i) {
        var yy = y + i * lh;
        ctx.strokeStyle = "rgba(0,0,0,0.72)";
        ctx.lineWidth = Math.max(2, size * 0.1);
        ctx.fillStyle = "#fff8e7";
        ctx.strokeText(ln, cx, yy);
        ctx.fillText(ln, cx, yy);
      });
      return y + lines.length * lh;
    }

    // Vertical stack centered in safe area
    var blocks = [];
    if (s.top) blocks.push({ t: s.top, sc: s.scaleTop, base: Math.floor(W * 0.052) });
    if (s.mid) blocks.push({ t: s.mid, sc: s.scaleMid, base: Math.floor(W * 0.034) });
    var ur = (s.bottom || "").trim();
    if (ur && !normRef(ur) && !/^\d+:\d+$/.test(ur)) blocks.push({ t: ur, sc: s.scaleBot, base: Math.floor(W * 0.03) });
    if (ref) blocks.push({ t: ref, sc: 90, base: Math.floor(W * 0.028) });

    // Measure total block height roughly
    var totalH = 0;
    blocks.forEach(function (b) {
      totalH += Math.floor(b.base * (b.sc / 100) * 1.4);
    });
    totalH += Math.max(0, blocks.length - 1) * Math.floor(H * 0.04);
    var y = safeTop + Math.max(0, (safeH - totalH) / 2) + Math.floor(W * 0.03);

    blocks.forEach(function (b, idx) {
      y = drawCentered(b.t, y, b.sc, b.base);
      y += Math.floor(H * 0.045);
    });

    // Strip promo only
    ctx.font = "600 " + Math.max(12, Math.floor(W * 0.03)) + "px system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,230,150,0.95)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(STRIP, cx, H - stripH / 2);

    // clickable strip
    if (stage) {
      var link = d.getElementById("meme-strip-link");
      if (!link) {
        link = d.createElement("a");
        link.id = "meme-strip-link";
        link.href = "https://clarity-dawah.fyi/";
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.style.cssText = "position:absolute;left:10%;width:80%;bottom:2%;height:12%;z-index:8;";
        stage.appendChild(link);
      }
    }
    return true;
  }

  function injectUi() {
    if (!d.getElementById("meme-solid-css")) {
      var st = d.createElement("style");
      st.id = "meme-solid-css";
      st.textContent = [
        "#meme-studio-root{display:flex!important;flex-direction:column!important;width:100%!important;visibility:visible!important}",
        "#meme-canvas{display:block!important;width:100%!important;max-width:100%!important;height:auto!important;margin:0 auto!important}",
        "#meme-stage,.meme-stage-wrap{display:block!important;width:100%!important;position:relative!important}",
        "#meme-solid-bar{display:flex;flex-wrap:wrap;gap:.35rem;align-items:center;margin:.4rem 0;padding:.4rem .5rem;",
        "border:1px solid rgba(212,180,90,.3);border-radius:10px;background:rgba(0,0,0,.18);font-size:.72rem}",
        "#meme-rich-controls,#meme-peace-sliders,#meme-stable-size,#meme-core-bar,#meme-night-size{display:none!important}"
      ].join("");
      (d.head || d.documentElement).appendChild(st);
    }
    if (d.getElementById("meme-solid-bar")) return;
    var root = d.getElementById("meme-studio-root");
    if (!root) return;
    var bar = d.createElement("div");
    bar.id = "meme-solid-bar";
    var opts = [70, 85, 100, 120, 140].map(function (n) {
      return '<option value="' + n + '">' + n + "%</option>";
    }).join("");
    bar.innerHTML =
      '<label>AR <select id="ms-top">' + opts + "</select></label>" +
      '<label>EN <select id="ms-mid">' + opts + "</select></label>" +
      '<label>UR <select id="ms-bot">' + opts + "</select></label>" +
      '<button type="button" class="btn-soft" id="ms-copy">Copy X</button>' +
      '<button type="button" class="btn-soft" id="ms-post">Post X</button>' +
      '<button type="button" class="btn-soft" id="ms-png">PNG</button>';
    var stage = d.getElementById("meme-stage") || d.getElementById("meme-canvas");
    if (stage && stage.parentNode) stage.parentNode.insertBefore(bar, stage.nextSibling);
    else root.appendChild(bar);
    function bind(id, key) {
      var el = d.getElementById(id);
      if (!el) return;
      el.value = String(S()[key] || 100);
      el.onchange = function () { S()[key] = parseInt(el.value, 10) || 100; paint(); };
    }
    bind("ms-top", "scaleTop");
    bind("ms-mid", "scaleMid");
    bind("ms-bot", "scaleBot");
    function share() {
      var s = S();
      return [s.top, s.mid, s.ref || "", "educational only · clarity-dawah.fyi"].filter(Boolean).join("\n\n").slice(0, 280);
    }
    d.getElementById("ms-copy").onclick = function () {
      if (navigator.clipboard) navigator.clipboard.writeText(share());
    };
    d.getElementById("ms-post").onclick = function () {
      w.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(share()), "_blank", "noopener");
    };
    d.getElementById("ms-png").onclick = function () {
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
      if (btn.__solid) return;
      btn.__solid = true;
      btn.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        applyPack(btn.getAttribute("data-meme-fetch") || "reminder");
      }, true);
    });
    root.querySelectorAll("[data-meme-bg],[data-meme-decor]").forEach(function (btn) {
      if (btn.__solidb) return;
      btn.__solidb = true;
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
    w.memeFetchBg = function (k) { loadScene(k); return Promise.resolve(true); };
    w.memeFetchRrra = applyPack;
    w.memeDailyVerse = function () { applyPack("daily"); };
    w.memeFromCommand = function () { applyPack("command"); };
    w.memeMasnunDua = function () { applyPack("dua"); };
    w.memeNightQuote = function () { applyPack("night"); };
  }

  function boot() {
    claim();
    injectUi();
    wire();
    paint();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  d.addEventListener("clarity:tab-mounted", function () { setTimeout(boot, 60); });
  w.addEventListener("resize", function () { paint(); });
  w.addEventListener("orientationchange", function () { setTimeout(paint, 200); });
})(window, document);
