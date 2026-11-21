/*! companion-meme-final-v1
 * Single locked owner · sandbox-depth frame · default basmala · educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_FINAL_V1__) return;
  w.__COMPANION_MEME_FINAL_V1__ = true;

  var STRIP = "clarity-dawah.fyi";
  var DEFAULT = {
    top: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    mid: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    bottom: "اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔",
    ref: "Qur'an 1:1"
  };

  function S() {
    if (!w.memeState || typeof w.memeState !== "object") w.memeState = {};
    var s = w.memeState;
    if (s.scaleTop == null) s.scaleTop = 100;
    if (s.scaleMid == null) s.scaleMid = 100;
    if (s.scaleBot == null) s.scaleBot = 95;
    if (s.font == null) s.font = "naskh";
    if (s.style == null) s.style = "outline";
    if (s.ratio == null) s.ratio = "instagram";
    if (s.blankColor1 == null) s.blankColor1 = "#0b1220";
    if (s.blankColor2 == null) s.blankColor2 = "#152038";
    return s;
  }

  function seed() {
    var s = S();
    if (!(s.top || "").trim()) {
      s.top = DEFAULT.top;
      s.mid = DEFAULT.mid;
      s.bottom = DEFAULT.bottom;
      s.ref = DEFAULT.ref;
    }
    var t = d.getElementById("meme-top-input");
    var m = d.getElementById("meme-mid-input");
    var b = d.getElementById("meme-bottom-input");
    if (t && !t.value) t.value = s.top;
    if (m && !m.value) m.value = s.mid;
    if (b && !b.value) b.value = s.ref;
  }

  function status(msg) {
    var el = d.getElementById("meme-fetch-status");
    if (!el) return;
    var t = String(msg || "").replace(/holy\s*·.*/i, "").replace(/\s*·\s*ok\s*$/i, "");
    if (/·\s*ok/i.test(t)) t = "";
    el.textContent = t;
  }

  function clamp(n) {
    n = parseInt(n, 10);
    if (isNaN(n)) return 100;
    return Math.max(50, Math.min(160, n));
  }

  function fontStack(name) {
    name = (name || "naskh").toLowerCase();
    if (name === "thuluth") return "'Scheherazade New', Amiri, serif";
    if (name === "amiri") return "Amiri, 'Scheherazade New', serif";
    if (name === "kufi") return "'Reem Kufi', 'Noto Kufi Arabic', sans-serif";
    return "Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
  }

  var SCENES = {
    nature: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80"],
    holy: ["https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1400&q=80"],
    flowers: ["https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1400&q=80"],
    night: ["https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1400&q=80"],
    water: ["https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1400&q=80"],
    spirit: ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1400&q=80"],
    free: ["https://picsum.photos/seed/clarity-final/1400/1400"],
    dynamic: ["https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1400&q=80"],
    pattern: ["https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1400&q=80"],
    decor: ["https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1400&q=80"],
    mosque: ["https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1400&q=80"],
    geometry: ["https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1400&q=80"]
  };
  var sidx = {}, bgLock = false, paintLock = false;

  function loadScene(kind) {
    kind = String(kind || "nature").toLowerCase().replace(/\s+/g, "");
    seed();
    if (kind === "blank") {
      S().img = null;
      S().bgImage = null;
      status("");
      schedulePaint();
      return;
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
      S().img = img;
      S().bgImage = img;
      status("");
      seed();
      schedulePaint();
    };
    img.onerror = function () {
      bgLock = false;
      status("Scene unavailable");
      schedulePaint();
    };
    img.src = url;
  }

  var PACKS = {
    reminder: [
      { ar: DEFAULT.top, en: DEFAULT.mid, ur: DEFAULT.bottom, ref: DEFAULT.ref },
      { ar: "فَاذْكُرُونِي أَذْكُرْكُمْ", en: "So remember Me; I will remember you.", ur: "پس مجھے یاد کرو، میں تمہیں یاد رکھوں گا۔", ref: "Qur'an 2:152" }
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
    if (kind === "apply-bg") {
      loadScene("spirit");
      return;
    }
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
    schedulePaint();
  }

  function normRef(r) {
    r = String(r || "").trim();
    if (!r || /https?:|clarity-dawah/i.test(r)) return "";
    var q = r.match(/(?:Qur['']?a?n)?\s*(\d{1,3})\s*[:：]\s*(\d{1,3})/i);
    if (!q) return "";
    var a = parseInt(q[1], 10),
      b = parseInt(q[2], 10);
    if (a < 1 || a > 114 || b < 1 || b > 286) return "";
    return "Qur'an " + a + ":" + b;
  }

  function wrap(ctx, text, maxW) {
    text = (text || "").trim();
    if (!text) return [];
    var words = text.split(/\s+/),
      lines = [],
      line = "";
    words.forEach(function (wd) {
      var test = line ? line + " " + wd : wd;
      if (ctx.measureText(test).width <= maxW || !line) line = test;
      else {
        lines.push(line);
        line = wd;
      }
    });
    if (line) lines.push(line);
    return lines.slice(0, 5);
  }

  function ratioVal(key) {
    key = (key || "instagram").toLowerCase();
    if (key === "1:1" || key === "instagram") return 1;
    if (key === "9:16" || key === "instagram_story") return 16 / 9;
    if (key === "16:9" || key === "twitter") return 9 / 16;
    if (key === "facebook" || key.indexOf("1.91") >= 0) return 1 / 1.91;
    return 1;
  }

  function drawDesignerFrame(ctx, W, H) {
    var m = Math.min(W, H);
    var inset = Math.max(14, Math.round(m * 0.05));
    var x = inset * 0.5,
      y = inset * 0.5,
      w = W - inset,
      h = H - inset;
    var r = Math.max(18, Math.round(m * 0.055));
    var lw = Math.max(3.5, m * 0.015);
    var lw2 = Math.max(1.5, m * 0.006);

    function rr(xx, yy, ww, hh, rad) {
      rad = Math.min(rad, ww / 2, hh / 2);
      ctx.beginPath();
      ctx.moveTo(xx + rad, yy);
      ctx.arcTo(xx + ww, yy, xx + ww, yy + hh, rad);
      ctx.arcTo(xx + ww, yy + hh, xx, yy + hh, rad);
      ctx.arcTo(xx, yy + hh, xx, yy, rad);
      ctx.arcTo(xx, yy, xx + ww, yy, rad);
      ctx.closePath();
    }

    ctx.strokeStyle = "rgba(212,175,55,0.22)";
    ctx.lineWidth = lw + 5;
    rr(x, y, w, h, r);
    ctx.stroke();

    ctx.strokeStyle = "rgba(218,185,70,0.98)";
    ctx.lineWidth = lw;
    ctx.lineJoin = "round";
    rr(x, y, w, h, r);
    ctx.stroke();

    var pad = Math.max(6, inset * 0.34);
    ctx.strokeStyle = "rgba(255,235,170,0.7)";
    ctx.lineWidth = lw2;
    rr(x + pad, y + pad, w - pad * 2, h - pad * 2, Math.max(10, r - pad * 0.5));
    ctx.stroke();

    var c = Math.max(14, m * 0.05);
    ctx.strokeStyle = "rgba(255,220,130,0.95)";
    ctx.lineWidth = Math.max(1.8, m * 0.007);
    function flourish(cx, cy, sx, sy) {
      ctx.beginPath();
      ctx.moveTo(cx + sx * c * 0.1, cy + sy * c);
      ctx.quadraticCurveTo(cx + sx * c * 0.05, cy + sy * c * 0.15, cx, cy);
      ctx.quadraticCurveTo(cx + sx * c * 0.15, cy + sy * c * 0.05, cx + sx * c, cy + sy * c * 0.1);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + sx * c * 0.25, cy + sy * c * 0.55);
      ctx.quadraticCurveTo(cx + sx * c * 0.2, cy + sy * c * 0.2, cx + sx * c * 0.55, cy + sy * c * 0.25);
      ctx.stroke();
    }
    flourish(x + r * 0.22, y + r * 0.22, 1, 1);
    flourish(x + w - r * 0.22, y + r * 0.22, -1, 1);
    flourish(x + r * 0.22, y + h - r * 0.22, 1, -1);
    flourish(x + w - r * 0.22, y + h - r * 0.22, -1, -1);

    return { inset: inset, stripH: Math.max(28, Math.round(H * 0.09)), frameX: x, frameY: y, frameW: w, frameH: h };
  }

  var paintTimer = null;
  function schedulePaint() {
    if (paintTimer) clearTimeout(paintTimer);
    paintTimer = setTimeout(function () {
      paintTimer = null;
      paint();
    }, 40);
  }

  function paint() {
    if (paintLock) return false;
    paintLock = true;
    try {
      seed();
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
        stage.style.minHeight = "220px";
        stage.style.overflow = "visible";
      }

      var cssW = 360;
      if (stage) {
        var rw = stage.getBoundingClientRect().width;
        if (rw > 40) cssW = Math.floor(rw);
      }
      if (cssW < 280) cssW = Math.min(420, Math.floor((w.innerWidth || 360) * 0.94));

      var s = S();
      var cssH = Math.floor(cssW * ratioVal(s.ratio));
      var maxH = Math.floor((w.innerHeight || 700) * 0.58);
      if (cssH > maxH && ratioVal(s.ratio) > 1) {
        cssH = maxH;
        cssW = Math.floor(cssH / ratioVal(s.ratio));
      }

      var dpr = Math.min(2, w.devicePixelRatio || 1);
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "auto";
      canvas.style.display = "block";
      canvas.style.margin = "0 auto";
      canvas.style.borderRadius = "16px";
      canvas.style.maxHeight = "none";

      var ctx = canvas.getContext("2d");
      if (!ctx) return false;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      var W = cssW,
        H = cssH;

      var ti = d.getElementById("meme-top-input");
      var mi = d.getElementById("meme-mid-input");
      if (ti && ti.value) s.top = ti.value;
      if (mi && mi.value) s.mid = mi.value;
      if (!(s.top || "").trim()) seed();
      var ref = normRef(s.ref);

      var bg = s.bgImage || s.img;
      if (bg && bg.complete && bg.naturalWidth) {
        try {
          var iw = bg.naturalWidth,
            ih = bg.naturalHeight;
          var sc = Math.max(W / iw, H / ih);
          ctx.drawImage(bg, (W - iw * sc) / 2, (H - ih * sc) / 2, iw * sc, ih * sc);
          ctx.fillStyle = "rgba(0,0,0,0.28)";
          ctx.fillRect(0, 0, W, H);
        } catch (e) {
          bg = null;
        }
      }
      if (!bg || !bg.naturalWidth) {
        var g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, s.blankColor1);
        g.addColorStop(1, s.blankColor2);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      var frameMeta = drawDesignerFrame(ctx, W, H);
      var inset = frameMeta.inset;
      var stripH = frameMeta.stripH;
      var frameX = frameMeta.frameX,
        frameW = frameMeta.frameW;
      var safeTop = inset * 1.25;
      var safeBot = H - stripH - inset * 0.9;
      var safeH = safeBot - safeTop;
      var maxW = W - inset * 2.8;
      var cx = W / 2;
      var stack = fontStack(s.font);
      var style = (s.style || "outline").toLowerCase();

      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(frameX, H - stripH - inset * 0.2, frameW, stripH + inset * 0.12);

      function drawCentered(text, y, scalePct, base) {
        text = (text || "").trim();
        if (!text) return y;
        var maxSize = Math.floor(base * (clamp(scalePct) / 100));
        var size = maxSize;
        ctx.font = "700 " + size + "px " + stack;
        var lines = wrap(ctx, text, maxW);
        while (size > 13 && lines.length * size * 1.28 > safeH * 0.38) {
          size -= 1;
          ctx.font = "700 " + size + "px " + stack;
          lines = wrap(ctx, text, maxW);
        }
        var lh = size * 1.3;
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
            ctx.shadowBlur = Math.max(4, size * 0.14);
            ctx.fillStyle = "#fff8e7";
            ctx.fillText(ln, cx, yy);
            ctx.shadowBlur = 0;
          } else {
            ctx.strokeStyle = "rgba(0,0,0,0.75)";
            ctx.lineWidth = Math.max(2.2, size * 0.11);
            ctx.strokeText(ln, cx, yy);
            ctx.fillStyle = "#fff8e7";
            ctx.fillText(ln, cx, yy);
          }
        });
        return y + lines.length * lh;
      }

      var blocks = [];
      if (s.top) blocks.push({ t: s.top, sc: s.scaleTop, base: Math.floor(W * 0.062) });
      if (s.mid) blocks.push({ t: s.mid, sc: s.scaleMid, base: Math.floor(W * 0.038) });
      var ur = (s.bottom || "").trim();
      if (ur && !normRef(ur) && !/^\d+:\d+$/.test(ur))
        blocks.push({ t: ur, sc: s.scaleBot, base: Math.floor(W * 0.032) });
      if (ref) blocks.push({ t: ref, sc: 92, base: Math.floor(W * 0.03) });

      var totalH = 0;
      blocks.forEach(function (b) {
        totalH += Math.floor(b.base * (clamp(b.sc) / 100) * 1.35);
      });
      totalH += Math.max(0, blocks.length - 1) * Math.floor(H * 0.035);
      var y = safeTop + Math.max(0, (safeH - totalH) / 2) + Math.floor(W * 0.012);
      blocks.forEach(function (b) {
        y = drawCentered(b.t, y, b.sc, b.base);
        y += Math.floor(H * 0.036);
      });

      ctx.font = "600 " + Math.max(11, Math.floor(W * 0.032)) + "px system-ui, sans-serif";
      ctx.fillStyle = "rgba(255,230,150,0.95)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(STRIP, cx, H - stripH / 2 - 1);

      if (stage) {
        var link = d.getElementById("meme-strip-link");
        if (!link) {
          link = d.createElement("a");
          link.id = "meme-strip-link";
          link.href = "https://clarity-dawah.fyi/";
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.style.cssText = "position:absolute;left:8%;width:84%;bottom:1.5%;height:11%;z-index:8;";
          stage.appendChild(link);
        }
      }
      return true;
    } finally {
      paintLock = false;
    }
  }

  function setScale(which, val) {
    val = clamp(val);
    if (which === "top") S().scaleTop = val;
    else if (which === "mid") S().scaleMid = val;
    else S().scaleBot = val;
    var map = { top: "ms-top", mid: "ms-mid", bot: "ms-bot" };
    var el = d.getElementById(map[which] || map.bot);
    if (el) el.value = String(val);
    schedulePaint();
  }

  function markActive(sel, attr, value) {
    var root = d.getElementById("meme-studio-root") || d;
    root.querySelectorAll(sel).forEach(function (btn) {
      if (btn.getAttribute(attr) === value) btn.classList.add("is-active");
      else btn.classList.remove("is-active");
    });
  }

  function wireAll() {
    var root = d.getElementById("meme-studio-root") || d;
    function on(sel, attr, fn) {
      root.querySelectorAll(sel).forEach(function (btn) {
        if (btn.__final) return;
        btn.__final = true;
        btn.addEventListener(
          "click",
          function (ev) {
            ev.preventDefault();
            ev.stopImmediatePropagation();
            fn(btn);
          },
          true
        );
      });
    }
    on("[data-meme-fetch]", null, function (btn) {
      applyPack(btn.getAttribute("data-meme-fetch") || "reminder");
    });
    on("[data-meme-bg],[data-meme-decor]", null, function (btn) {
      loadScene(btn.getAttribute("data-meme-bg") || btn.getAttribute("data-meme-decor"));
    });
    on("[data-meme-font]", null, function (btn) {
      S().font = btn.getAttribute("data-meme-font") || "naskh";
      markActive("[data-meme-font]", "data-meme-font", S().font);
      schedulePaint();
    });
    on("[data-meme-style]", null, function (btn) {
      S().style = btn.getAttribute("data-meme-style") || "outline";
      markActive("[data-meme-style]", "data-meme-style", S().style);
      schedulePaint();
    });
    on("[data-meme-ratio]", null, function (btn) {
      S().ratio = btn.getAttribute("data-meme-ratio") || "instagram";
      markActive("[data-meme-ratio]", "data-meme-ratio", S().ratio);
      schedulePaint();
    });
    on("[data-meme-act]", null, function (btn) {
      var act = btn.getAttribute("data-meme-act");
      if (act === "autoscale") {
        setScale("top", 100);
        setScale("mid", 100);
        setScale("bot", 95);
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
        var text = [s.top, s.mid, s.ref || "", "educational only · clarity-dawah.fyi"]
          .filter(Boolean)
          .join("\n\n")
          .slice(0, 280);
        w.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(text), "_blank", "noopener");
      }
    });
  }

  function injectUi() {
    if (!d.getElementById("meme-final-css")) {
      var st = d.createElement("style");
      st.id = "meme-final-css";
      st.textContent =
        "#meme-studio-root{display:flex!important;flex-direction:column!important;width:100%!important}" +
        "#meme-canvas{display:block!important;width:100%!important;margin:0 auto!important;border-radius:16px!important;max-height:none!important}" +
        "#meme-stage{min-height:220px!important;overflow:visible!important;position:relative!important}" +
        "#meme-final-bar{display:flex;flex-wrap:wrap;gap:.35rem;align-items:center;margin:.35rem 0;padding:.4rem .5rem;" +
        "border:1px solid rgba(212,180,90,.3);border-radius:10px;background:rgba(0,0,0,.18);font-size:.72rem}" +
        "#meme-rich-controls,#meme-peace-sliders,#meme-stable-size,#meme-solid-bar,#meme-core-bar{display:none!important}" +
        "[data-meme-font].is-active,[data-meme-style].is-active,[data-meme-ratio].is-active{outline:2px solid rgba(212,180,90,.7)}" +
        "#meme-fetch-status:empty{display:none!important}";
      (d.head || d.documentElement).appendChild(st);
    }
    status("");
    if (d.getElementById("meme-final-bar")) return;
    var root = d.getElementById("meme-studio-root");
    if (!root) return;
    var bar = d.createElement("div");
    bar.id = "meme-final-bar";
    var opts = [50, 70, 85, 100, 120, 140, 160]
      .map(function (n) {
        return '<option value="' + n + '">' + n + "%</option>";
      })
      .join("");
    bar.innerHTML =
      '<label>AR <select id="ms-top">' +
      opts +
      "</select></label>" +
      '<label>EN <select id="ms-mid">' +
      opts +
      "</select></label>" +
      '<label>UR <select id="ms-bot">' +
      opts +
      "</select></label>" +
      '<button type="button" class="btn-soft" id="ms-copy">Copy X</button>' +
      '<button type="button" class="btn-soft" id="ms-post">Post X</button>' +
      '<button type="button" class="btn-soft" id="ms-png">PNG</button>';
    var stage = d.getElementById("meme-stage") || d.getElementById("meme-canvas");
    if (stage && stage.parentNode) stage.parentNode.insertBefore(bar, stage.nextSibling);
    else root.appendChild(bar);
    function bind(id, which) {
      var el = d.getElementById(id);
      if (!el) return;
      el.value = String(
        which === "top" ? S().scaleTop : which === "mid" ? S().scaleMid : S().scaleBot
      );
      el.addEventListener("change", function () {
        setScale(which, el.value);
      });
    }
    bind("ms-top", "top");
    bind("ms-mid", "mid");
    bind("ms-bot", "bot");
    function share() {
      var s = S();
      return [s.top, s.mid, s.ref || "", "educational only · clarity-dawah.fyi"]
        .filter(Boolean)
        .join("\n\n")
        .slice(0, 280);
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

  function lockOwner() {
    function set(name, fn) {
      try {
        Object.defineProperty(w, name, {
          configurable: true,
          enumerable: false,
          get: function () {
            return fn;
          },
          set: function () {
            /* ignore overwrite attempts */
          }
        });
      } catch (e) {
        w[name] = fn;
      }
    }
    set("paintMeme", paint);
    set("memeDraw", paint);
    set("memePaintQuiet", paint);
    set("memePaint", paint);
    if (!w.ClarityMemePaintV2) w.ClarityMemePaintV2 = {};
    try {
      Object.defineProperty(w.ClarityMemePaintV2, "paint", {
        configurable: true,
        get: function () {
          return paint;
        },
        set: function () {}
      });
    } catch (e) {
      w.ClarityMemePaintV2.paint = paint;
    }
    w.memeFetchBg = function (k) {
      loadScene(k);
      return Promise.resolve(true);
    };
    w.memeFetchRrra = applyPack;
    w.memeDailyVerse = function () {
      applyPack("daily");
    };
    w.memeFromCommand = function () {
      applyPack("command");
    };
    w.memeMasnunDua = function () {
      applyPack("dua");
    };
    w.memeNightQuote = function () {
      applyPack("night");
    };
  }

  function boot() {
    lockOwner();
    seed();
    injectUi();
    wireAll();
    status("");
    paint();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  d.addEventListener("clarity:tab-mounted", function () {
    setTimeout(boot, 50);
  });
  w.addEventListener("resize", function () {
    schedulePaint();
  });

  var n = 0;
  var iv = setInterval(function () {
    n++;
    lockOwner();
    wireAll();
    if (n === 2 || n === 8) {
      seed();
      paint();
    }
    if (n >= 15) clearInterval(iv);
  }, 500);
})(window, document);
