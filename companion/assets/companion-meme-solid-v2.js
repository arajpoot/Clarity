/*! companion-meme-solid-v2
 * All pills live · centered paint · gold frame · mobile viewport assumed fixed on shell
 * Educational only — not a fatwa. Scenery backgrounds only.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_SOLID_V2__) return;
  w.__COMPANION_MEME_SOLID_V2__ = true;

  var STRIP = "clarity-dawah.fyi";

  function S() {
    if (!w.memeState || typeof w.memeState !== "object") w.memeState = {};
    var s = w.memeState;
    if (s.scaleTop == null) s.scaleTop = 100;
    if (s.scaleMid == null) s.scaleMid = 100;
    if (s.scaleBot == null) s.scaleBot = 95;
    if (s.font == null) s.font = "naskh";
    if (s.style == null) s.style = "outline";
    if (s.ratio == null) s.ratio = "twitter";
    if (s.blankColor1 == null) s.blankColor1 = "#0b1220";
    if (s.blankColor2 == null) s.blankColor2 = "#152038";
    return s;
  }

  function status(msg) {
    var el = d.getElementById("meme-fetch-status");
    if (el) el.textContent = (msg || "").replace(/\s*·\s*ok\s*$/i, "");
  }

  function fontStack(name) {
    name = (name || "naskh").toLowerCase();
    if (name === "thuluth") return "'Scheherazade New', Amiri, 'Noto Naskh Arabic', serif";
    if (name === "amiri") return "Amiri, 'Scheherazade New', serif";
    if (name === "kufi") return "'Reem Kufi', 'Noto Kufi Arabic', 'Noto Naskh Arabic', sans-serif";
    return "Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
  }

  var SCENES = {
    nature: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&q=80", "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1280&q=80"],
    holy: ["https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Mount_Arafat.jpg/800px-Mount_Arafat.jpg", "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1280&q=80"],
    flowers: ["https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1280&q=80"],
    night: ["https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1280&q=80"],
    water: ["https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1280&q=80"],
    spirit: ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1280&q=80"],
    free: ["https://picsum.photos/seed/clarity-solid2/1280/720"],
    dynamic: ["https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1280&q=80"],
    pattern: ["https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1280&q=80"],
    decor: ["https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&q=80"],
    mosque: ["https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1280&q=80"],
    geometry: ["https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1280&q=80"]
  };
  var sidx = {}, bgLock = false;

  function loadScene(kind) {
    kind = String(kind || "nature").toLowerCase().replace(/\s+/g, "");
    if (kind === "blank") {
      S().img = null; S().bgImage = null; status(""); paint(); return;
    }
    if (/context/.test(kind)) kind = "spirit";
    if (/décor|decor/.test(kind)) kind = "decor";
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
    if (kind === "apply-bg") { loadScene("spirit"); return; }
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
    words.forEach(function (wd) {
      var test = line ? line + " " + wd : wd;
      if (ctx.measureText(test).width <= maxW || !line) line = test;
      else { lines.push(line); line = wd; }
    });
    if (line) lines.push(line);
    return lines.slice(0, 5);
  }

  function ratioVal(key) {
    key = (key || "twitter").toLowerCase();
    if (key === "1:1" || key === "instagram") return 1;
    if (key === "9:16" || key === "instagram_story") return 16 / 9;
    if (key === "16:9" || key === "twitter") return 9 / 16;
    if (key === "facebook" || key === "1.91:1") return 1 / 1.91;
    return 9 / 16;
  }

  function paint() {
    var canvas = d.getElementById("meme-canvas");
    if (!canvas) return false;
    var stage = d.getElementById("meme-stage") || canvas.parentElement;
    var root = d.getElementById("meme-studio-root");
    if (root) {
      root.style.display = "flex";
      root.style.flexDirection = "column";
      root.style.width = "100%";
      root.style.visibility = "visible";
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
    if (cssW < 280) cssW = Math.min(400, Math.floor((w.innerWidth || 360) * 0.92));

    var s = S();
    var cssH = Math.floor(cssW * ratioVal(s.ratio));
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

    var ti = d.getElementById("meme-top-input");
    var mi = d.getElementById("meme-mid-input");
    if (ti && ti.value) s.top = ti.value;
    if (mi && mi.value) s.mid = mi.value;
    var ref = normRef(s.ref);

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

    var inset = Math.max(14, Math.floor(Math.min(W, H) * 0.05));
    var stripH = Math.max(28, Math.floor(H * 0.1));
    var safeTop = inset + 4;
    var safeBot = H - stripH - inset;
    var safeH = safeBot - safeTop;
    var maxW = W - inset * 2.6;
    var cx = W / 2;
    var stack = fontStack(s.font);
    var style = (s.style || "outline").toLowerCase();

    // Ornate double gold frame
    ctx.strokeStyle = "rgba(212,175,55,0.92)";
    ctx.lineWidth = Math.max(3, inset * 0.2);
    ctx.strokeRect(inset * 0.4, inset * 0.4, W - inset * 0.8, H - inset * 0.8);
    ctx.strokeStyle = "rgba(255,230,150,0.55)";
    ctx.lineWidth = 1.4;
    ctx.strokeRect(inset * 0.75, inset * 0.75, W - inset * 1.5, H - inset * 1.5);
    // corner ornaments
    var c = Math.max(12, inset * 0.85);
    ctx.strokeStyle = "rgba(255,215,120,0.8)";
    ctx.lineWidth = 2;
    function corner(x, y, dx, dy) {
      ctx.beginPath();
      ctx.moveTo(x, y + dy * c);
      ctx.lineTo(x, y);
      ctx.lineTo(x + dx * c, y);
      ctx.stroke();
    }
    var fx = inset * 0.4, fy = inset * 0.4, fw = W - inset * 0.8, fh = H - inset * 0.8;
    corner(fx, fy, 1, 1);
    corner(fx + fw, fy, -1, 1);
    corner(fx, fy + fh, 1, -1);
    corner(fx + fw, fy + fh, -1, -1);

    ctx.fillStyle = "rgba(0,0,0,0.42)";
    ctx.fillRect(inset * 0.5, H - stripH - inset * 0.1, W - inset, stripH);

    function drawCentered(text, y, scalePct, base) {
      text = (text || "").trim();
      if (!text) return y;
      var maxSize = Math.floor(base * (Math.max(50, Math.min(160, scalePct || 100)) / 100));
      var size = maxSize;
      ctx.font = "700 " + size + "px " + stack;
      var lines = wrap(ctx, text, maxW);
      while (size > 12 && lines.length * size * 1.3 > safeH * 0.36) {
        size -= 1;
        ctx.font = "700 " + size + "px " + stack;
        lines = wrap(ctx, text, maxW);
      }
      var lh = size * 1.32;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineJoin = "round";
      lines.forEach(function (ln, i) {
        var yy = y + i * lh;
        if (style === "fill") {
          ctx.fillStyle = "#fff8e7";
          ctx.fillText(ln, cx, yy);
        } else if (style === "soft") {
          ctx.shadowColor = "rgba(0,0,0,0.55)";
          ctx.shadowBlur = Math.max(4, size * 0.15);
          ctx.fillStyle = "#fff8e7";
          ctx.fillText(ln, cx, yy);
          ctx.shadowBlur = 0;
        } else {
          // outline default
          ctx.strokeStyle = "rgba(0,0,0,0.75)";
          ctx.lineWidth = Math.max(2, size * 0.11);
          ctx.strokeText(ln, cx, yy);
          ctx.fillStyle = "#fff8e7";
          ctx.fillText(ln, cx, yy);
        }
      });
      return y + lines.length * lh;
    }

    var blocks = [];
    if (s.top) blocks.push({ t: s.top, sc: s.scaleTop, base: Math.floor(W * 0.052) });
    if (s.mid) blocks.push({ t: s.mid, sc: s.scaleMid, base: Math.floor(W * 0.034) });
    var ur = (s.bottom || "").trim();
    if (ur && !normRef(ur) && !/^\d+:\d+$/.test(ur)) blocks.push({ t: ur, sc: s.scaleBot, base: Math.floor(W * 0.03) });
    if (ref) blocks.push({ t: ref, sc: 90, base: Math.floor(W * 0.028) });

    var totalH = 0;
    blocks.forEach(function (b) { totalH += Math.floor(b.base * (b.sc / 100) * 1.35); });
    totalH += Math.max(0, blocks.length - 1) * Math.floor(H * 0.04);
    var y = safeTop + Math.max(0, (safeH - totalH) / 2) + Math.floor(W * 0.02);
    blocks.forEach(function (b) {
      y = drawCentered(b.t, y, b.sc, b.base);
      y += Math.floor(H * 0.042);
    });

    ctx.font = "600 " + Math.max(12, Math.floor(W * 0.03)) + "px system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,230,150,0.95)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(STRIP, cx, H - stripH / 2);

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

  function markActive(sel, attr, value) {
    var root = d.getElementById("meme-studio-root") || d;
    root.querySelectorAll(sel).forEach(function (btn) {
      var v = btn.getAttribute(attr);
      if (v === value) btn.classList.add("is-active");
      else btn.classList.remove("is-active");
    });
  }

  function wireAll() {
    var root = d.getElementById("meme-studio-root") || d;

    root.querySelectorAll("[data-meme-fetch]").forEach(function (btn) {
      if (btn.__v2) return;
      btn.__v2 = true;
      btn.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        applyPack(btn.getAttribute("data-meme-fetch") || "reminder");
      }, true);
    });

    root.querySelectorAll("[data-meme-bg],[data-meme-decor]").forEach(function (btn) {
      if (btn.__v2b) return;
      btn.__v2b = true;
      btn.addEventListener("click", function (ev) {
        var kind = btn.getAttribute("data-meme-bg") || btn.getAttribute("data-meme-decor");
        if (!kind) return;
        ev.preventDefault();
        ev.stopImmediatePropagation();
        loadScene(kind);
      }, true);
    });

    root.querySelectorAll("[data-meme-font]").forEach(function (btn) {
      if (btn.__v2f) return;
      btn.__v2f = true;
      btn.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        S().font = btn.getAttribute("data-meme-font") || "naskh";
        markActive("[data-meme-font]", "data-meme-font", S().font);
        paint();
      }, true);
    });

    root.querySelectorAll("[data-meme-style]").forEach(function (btn) {
      if (btn.__v2s) return;
      btn.__v2s = true;
      btn.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        S().style = btn.getAttribute("data-meme-style") || "outline";
        markActive("[data-meme-style]", "data-meme-style", S().style);
        paint();
      }, true);
    });

    root.querySelectorAll("[data-meme-ratio]").forEach(function (btn) {
      if (btn.__v2r) return;
      btn.__v2r = true;
      btn.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        S().ratio = btn.getAttribute("data-meme-ratio") || "twitter";
        markActive("[data-meme-ratio]", "data-meme-ratio", S().ratio);
        paint();
      }, true);
    });

    root.querySelectorAll("[data-meme-act]").forEach(function (btn) {
      if (btn.__v2a) return;
      btn.__v2a = true;
      btn.addEventListener("click", function (ev) {
        var act = btn.getAttribute("data-meme-act");
        ev.preventDefault();
        ev.stopImmediatePropagation();
        if (act === "autoscale") {
          S().scaleTop = 100; S().scaleMid = 100; S().scaleBot = 95;
          paint();
        } else if (act === "download") {
          paint();
          try {
            var a = d.createElement("a");
            a.download = "clarity-meme.png";
            a.href = d.getElementById("meme-canvas").toDataURL("image/png");
            a.click();
          } catch (e) {}
        } else if (act === "tweet") {
          var s = S();
          var text = [s.top, s.mid, s.ref || "", "educational only · clarity-dawah.fyi"].filter(Boolean).join("\n\n").slice(0, 280);
          w.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(text), "_blank", "noopener");
        }
      }, true);
    });
  }

  function injectBar() {
    if (!d.getElementById("meme-solid-css")) {
      var st = d.createElement("style");
      st.id = "meme-solid-css";
      st.textContent =
        "#meme-studio-root{display:flex!important;flex-direction:column!important;width:100%!important}" +
        "#meme-canvas{display:block!important;width:100%!important;margin:0 auto!important}" +
        "#meme-solid-bar{display:flex;flex-wrap:wrap;gap:.35rem;align-items:center;margin:.4rem 0;padding:.4rem .5rem;" +
        "border:1px solid rgba(212,180,90,.3);border-radius:10px;background:rgba(0,0,0,.18);font-size:.72rem}" +
        "[data-meme-font].is-active,[data-meme-style].is-active,[data-meme-ratio].is-active{outline:2px solid rgba(212,180,90,.7)}";
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
    injectBar();
    wireAll();
    paint();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  d.addEventListener("clarity:tab-mounted", function () { setTimeout(boot, 60); });
  w.addEventListener("resize", function () { paint(); });
  w.addEventListener("orientationchange", function () { setTimeout(paint, 200); });
})(window, document);
