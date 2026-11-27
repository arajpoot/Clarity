/* P5 · online via memeFetchBg · scenery only */
/* P3 allowlist spine v=20261126P3 */
/*! companion-meme-owner-v1 · CM8 night fix
 * Single paint path for main canvas + X/FB desks · online bg via memeFetchBg
 * Educational only — not a fatwa · scenery only
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_OWNER_GOLD__) return;
  w.__COMPANION_MEME_OWNER_CM8__ = true;
  w.__COMPANION_MEME_OWNER_GOLD__ = true;

  var STRIP = "clarity-dawah.fyi";
  var tmr = null;
  var paintLock = false;
  var bgLock = false;
  var sidx = {};

  var SCENES = {
    nature: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&q=80"
    ],
    holy: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg"
    ],
    night: ["https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1400&q=80"],
    water: ["https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1400&q=80"],
    flowers: ["https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1400&q=80"],
    spirit: ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1400&q=80"],
    pattern: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1400&q=80"],
    decor: ["https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1400&q=80"],
    flickr: ["https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1400&q=80","https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1400&q=80","https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80"],
    blank: []
  };

  var PACKS = {
    daily: [{ ar: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", en: "All praise is for Allah, Lord of the worlds.", ref: "Qur'an 1:2" }],
    reminder: [{ ar: "فَاذْكُرُونِي أَذْكُرْكُمْ", en: "So remember Me; I will remember you.", ref: "Qur'an 2:152" }],
    reality: [{ ar: "وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ", en: "And cooperate in righteousness and piety.", ref: "Qur'an 5:2" }],
    reflection: [{ ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", en: "Indeed, with hardship comes ease.", ref: "Qur'an 94:6" }],
    action: [{ ar: "وَأَقِيمُوا الصَّلَاةَ", en: "And establish prayer.", ref: "Qur'an 2:43" }],
    night: [{ ar: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ", en: "Every soul will taste death.", ref: "Qur'an 3:185" }]
  };

  function S() {
    if (!w.memeState || typeof w.memeState !== "object") w.memeState = {};
    var s = w.memeState;
    if (s.top == null) s.top = "";
    if (s.mid == null) s.mid = "";
    if (s.ref == null) s.ref = "";
    if (s.scaleTop == null) s.scaleTop = 100;
    if (s.scaleMid == null) s.scaleMid = 100;
    if (s.font == null) s.font = "naskh";
    if (s.style == null) s.style = "outline";
    if (s.ratio == null) s.ratio = "facebook";
    if (s.place == null) s.place = 50;
    if (s.blankColor1 == null) s.blankColor1 = "#0b1220";
    if (s.blankColor2 == null) s.blankColor2 = "#152038";
    return s;
  }

  function status(msg) {
    var el = d.getElementById("meme-status");
    if (el) el.textContent = msg || "";
  }
  function clamp(n, a, b) {
    n = parseInt(n, 10);
    if (isNaN(n)) return a;
    return Math.max(a, Math.min(b, n));
  }
  function fontStack(name, arabic) {
    name = (name || "naskh").toLowerCase();
    if (name === "thuluth") return "'Scheherazade New', Amiri, serif";
    if (name === "amiri") return "Amiri, serif";
    if (name === "kufi") return arabic ? "'Reem Kufi', sans-serif" : "'Reem Kufi', sans-serif";
    return arabic ? "'Noto Naskh Arabic', Amiri, serif" : "Amiri, Georgia, serif";
  }
  function ratioVal(r) {
    r = String(r || "facebook");
    if (r === "instagram" || r === "1:1") return 1;
    if (r === "twitter" || r === "16:9") return 9 / 16;
    if (r === "story" || r === "9:16") return 16 / 9;
    return 630 / 1200;
  }
  function wrap(ctx, text, maxW) {
    var words = String(text || "").split(/\s+/),
      lines = [],
      line = "";
    words.forEach(function (wrd) {
      var t = line ? line + " " + wrd : wrd;
      if (ctx.measureText(t).width > maxW && line) {
        lines.push(line);
        line = wrd;
      } else line = t;
    });
    if (line) lines.push(line);
    return lines.length ? lines : [""];
  }
  function normRef(r) {
    return String(r || "").trim();
  }
  function roundedRectPath(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawCornerOrnament(ctx, x, y, size, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.strokeStyle = "rgba(232,199,107,0.95)";
    ctx.fillStyle = "rgba(232,199,107,0.55)";
    ctx.lineWidth = Math.max(1.2, size * 0.08);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(size * 0.55, 0, size * 0.7, size * 0.15);
    ctx.quadraticCurveTo(size * 0.15, size * 0.15, 0, size * 0.7);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(size * 0.22, size * 0.22, size * 0.06, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawFrame(ctx, W, H) {
    var inset = Math.max(14, Math.floor(W * 0.045));
    var stripH = Math.max(22, Math.floor(H * 0.07));
    var radius = Math.max(18, Math.floor(W * 0.045));
    var gold = "rgba(232, 199, 107, 0.92)";
    var goldDim = "rgba(184, 146, 42, 0.75)";

    /* outer soft vignette */
    var vig = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.2, W / 2, H / 2, Math.max(W, H) * 0.72);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(1, "rgba(0,0,0,0.38)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);

    /* double rounded gold border */
    ctx.save();
    roundedRectPath(ctx, inset * 0.45, inset * 0.45, W - inset * 0.9, H - inset * 0.9, radius);
    ctx.strokeStyle = gold;
    ctx.lineWidth = Math.max(2.5, W * 0.007);
    ctx.stroke();
    roundedRectPath(ctx, inset * 0.85, inset * 0.85, W - inset * 1.7, H - inset * 1.7, radius * 0.75);
    ctx.strokeStyle = goldDim;
    ctx.lineWidth = Math.max(1.2, W * 0.0035);
    ctx.stroke();
    ctx.restore();

    /* corner ornaments */
    var os = Math.max(16, Math.floor(W * 0.055));
    var ox = inset * 0.9;
    var oy = inset * 0.9;
    drawCornerOrnament(ctx, ox, oy, os, 0);
    drawCornerOrnament(ctx, W - ox, oy, os, Math.PI / 2);
    drawCornerOrnament(ctx, W - ox, H - oy - stripH * 0.15, os, Math.PI);
    drawCornerOrnament(ctx, ox, H - oy - stripH * 0.15, os, -Math.PI / 2);

    /* bottom brand strip */
    ctx.fillStyle = "rgba(0,0,0,0.42)";
    ctx.fillRect(0, H - stripH, W, stripH);
    ctx.strokeStyle = "rgba(232,199,107,0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W * 0.2, H - stripH);
    ctx.lineTo(W * 0.8, H - stripH);
    ctx.stroke();
    ctx.fillStyle = "rgba(232,199,107,0.95)";
    ctx.font = "600 " + Math.max(10, Math.floor(W * 0.028)) + "px Quicksand, Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦  " + STRIP + "  ✦", W / 2, H - stripH / 2);
    return { inset: inset, stripH: stripH, radius: radius };
  }

  function syncFromFields() {
    var s = S();
    var t = d.getElementById("meme-top") || d.getElementById("meme-top-input");
    var m = d.getElementById("meme-mid") || d.getElementById("meme-mid-input");
    var b = d.getElementById("meme-bot") || d.getElementById("meme-third") || d.getElementById("meme-bot-input");
    var r = d.getElementById("meme-ref") || d.getElementById("meme-bottom-input");
    if (t) s.top = t.value;
    if (m) s.mid = m.value;
    if (b) s.bot = b.value;
    if (r) s.ref = r.value;
    return s;
  }

  function paintTextBlock(ctx, text, x, y, maxW, font, fill, stroke, lh) {
    if (!text) return y;
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var lines = wrap(ctx, text, maxW);
    lines.forEach(function (ln, i) {
      var yy = y + i * lh;
      if (stroke) {
        ctx.lineJoin = "round";
        ctx.miterLimit = 2;
        ctx.lineWidth = stroke.width || 3;
        ctx.strokeStyle = stroke.color || "rgba(0,0,0,0.7)";
        ctx.strokeText(ln, x, yy);
      }
      /* depth shadow */
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillText(ln, x + 1.2, yy + 1.5);
      ctx.fillStyle = fill || "#f8f4ea";
      ctx.fillText(ln, x, yy);
    });
    return y + lines.length * lh;
  }

  function paintToContext(ctx, W, H) {
    if (!ctx || !W || !H) return;
    var s = syncFromFields();
    var bg = s.bgImage || s.img;
    if (bg && bg.complete && bg.naturalWidth) {
      try {
        var iw = bg.naturalWidth,
          ih = bg.naturalHeight;
        var sc = Math.max(W / iw, H / ih);
        ctx.drawImage(bg, (W - iw * sc) / 2, (H - ih * sc) / 2, iw * sc, ih * sc);
        /* soft readable wash */
        ctx.fillStyle = "rgba(0,0,0,0.28)";
        ctx.fillRect(0, 0, W, H);
      } catch (e) {
        bg = null;
      }
    }
    if (!bg || !bg.naturalWidth) {
      var g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, s.blankColor1 || "#1a2a22");
      g.addColorStop(1, s.blankColor2 || "#0a1812");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }
    var fm = drawFrame(ctx, W, H);
    var inset = fm.inset,
      stripH = fm.stripH;
    var safeTop = inset * 1.55;
    var safeBot = H - stripH - inset * 1.1;
    var safeH = Math.max(40, safeBot - safeTop);
    var place = (typeof s.place === "number" ? s.place : 42) / 100;
    var y = safeTop + safeH * place * 0.35;
    var maxW = W - inset * 2.4;
    var st = (s.scaleTop || 100) / 100;
    var sm = (s.scaleMid || 100) / 100;
    var sb = (s.scaleBot || 100) / 100;
    var arSize = Math.max(20, Math.floor(W * 0.055 * st));
    var enSize = Math.max(13, Math.floor(W * 0.036 * sm));
    var botSize = Math.max(12, Math.floor(W * 0.032 * sb));
    var arFont = "700 " + arSize + "px 'Amiri','Scheherazade New','Noto Naskh Arabic',serif";
    var enFont = "600 " + enSize + "px Quicksand, Georgia, 'Segoe UI', sans-serif";
    var botFont = "600 " + botSize + "px 'Noto Nastaliq Urdu','Noto Naskh Arabic',Georgia,serif";

    if (s.top) {
      y = paintTextBlock(
        ctx,
        s.top,
        W / 2,
        y + arSize * 0.2,
        maxW,
        arFont,
        "#f7f1e4",
        { width: Math.max(2.5, arSize * 0.08), color: "rgba(0,0,0,0.72)" },
        Math.floor(arSize * 1.35)
      );
      y += Math.floor(arSize * 0.35);
    }
    if (s.mid) {
      y = paintTextBlock(
        ctx,
        s.mid,
        W / 2,
        y + enSize * 0.35,
        maxW,
        enFont,
        "#f0ebe3",
        { width: 2.2, color: "rgba(0,0,0,0.55)" },
        Math.floor(enSize * 1.35)
      );
      y += Math.floor(enSize * 0.4);
    }
    /* third line — optional translation / Urdu / caption */
    if (s.bot) {
      y = paintTextBlock(
        ctx,
        s.bot,
        W / 2,
        y + botSize * 0.35,
        maxW,
        botFont,
        "#f5e6c8",
        { width: 2, color: "rgba(0,0,0,0.5)" },
        Math.floor(botSize * 1.4)
      );
      y += Math.floor(botSize * 0.45);
    }
    /* decorative rule */
    if (s.top || s.mid || s.bot) {
      ctx.strokeStyle = "rgba(232,199,107,0.55)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(W * 0.35, y + 4);
      ctx.lineTo(W * 0.65, y + 4);
      ctx.stroke();
      ctx.fillStyle = "rgba(232,199,107,0.85)";
      ctx.beginPath();
      ctx.arc(W / 2, y + 4, 2.2, 0, Math.PI * 2);
      ctx.fill();
      y += 16;
    }
    if (s.ref) {
      ctx.font = "500 " + Math.max(11, Math.floor(W * 0.028)) + "px Quicksand, Georgia, sans-serif";
      ctx.fillStyle = "rgba(240,215,140,0.95)";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(normRef(s.ref), W / 2, H - stripH - Math.max(8, inset * 0.35));
    }
  }

  function paint() {
    if (paintLock) return;
    paintLock = true;
    try {
      var canvas = d.getElementById("meme-canvas");
      if (!canvas) return;
      var stage = d.getElementById("meme-stage") || canvas.parentElement;
      var cssW = stage ? Math.floor(stage.getBoundingClientRect().width) : 360;
      if (cssW < 280) cssW = Math.min(440, Math.floor((w.innerWidth || 360) * 0.94));
      var s = syncFromFields();
      var cssH = Math.floor(cssW * ratioVal(s.ratio));
      var maxH = Math.floor((w.innerHeight || 700) * 0.52);
      if (cssH > maxH) {
        cssH = maxH;
        cssW = Math.max(280, Math.floor(cssH / ratioVal(s.ratio)));
      }
      var dpr = Math.min(2, w.devicePixelRatio || 1);
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "auto";
      var ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      paintToContext(ctx, cssW, cssH);
      updateDeskPreviews();
    } finally {
      paintLock = false;
    }
  }

  function ensureDeskCanvas(imgEl) {
    if (!imgEl || !imgEl.parentNode) return null;
    var c = imgEl.previousElementSibling;
    if (c && c.getAttribute("data-desk-canvas") === "1") return c;
    c = d.createElement("canvas");
    c.setAttribute("data-desk-canvas", "1");
    c.className = "desk-preview desk-preview-canvas";
    imgEl.style.display = "none";
    imgEl.parentNode.insertBefore(c, imgEl);
    return c;
  }

  function updateDeskPreviews() {
    try {
      ["desk-x-preview", "desk-fb-preview"].forEach(function (id) {
        var img = d.getElementById(id);
        var c = ensureDeskCanvas(img);
        if (!c) return;
        var w0 = Math.max(260, Math.floor((img.parentElement && img.parentElement.clientWidth) || 300));
        var s = S();
        var h0 = Math.floor(w0 * ratioVal(s.ratio || "facebook"));
        if (h0 > 200) {
          h0 = 200;
          w0 = Math.max(200, Math.floor(h0 / ratioVal(s.ratio || "facebook")));
        }
        c.width = w0 * 2;
        c.height = h0 * 2;
        c.style.width = "100%";
        c.style.height = "auto";
        c.style.display = "block";
        var ctx = c.getContext("2d");
        if (!ctx) return;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(2, 2);
        paintToContext(ctx, w0, h0);
      });
    } catch (e) {}
  }

  function schedulePaint() {
    if (tmr) clearTimeout(tmr);
    tmr = setTimeout(paint, 30);
  }

  function loadSceneLocal(kind) {
    kind = String(kind || "nature").toLowerCase();
    if (kind === "blank") {
      S().img = null;
      S().bgImage = null;
      status("");
      schedulePaint();
      return;
    }
    var list = SCENES[kind] || SCENES.nature;
    if (!list || !list.length) {
      status("No local scene");
      schedulePaint();
      return;
    }
    if (sidx[kind] == null) sidx[kind] = 0;
    var url = list[sidx[kind] % list.length];
    sidx[kind]++;
    if (bgLock) return;
    bgLock = true;
    status("Scene · " + kind);
    var im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = function () {
      bgLock = false;
      S().img = im;
      S().bgImage = im;
      status("Background ready");
      schedulePaint();
    };
    im.onerror = function () {
      bgLock = false;
      status("Scene unavailable");
      schedulePaint();
    };
    im.src = url;
  }

  function loadScene(kind) {
    kind = String(kind || "nature").toLowerCase();
    if (kind === "geometry") kind = "pattern";
    if (kind === "blank") return loadSceneLocal("blank");
    S().lastKind = kind;
    /* Online first (archive3 path) */
    if (typeof w.memeFetchBg === "function") {
      status("Online scenery · " + kind + "…");
      try {
        w.memeFetchBg(kind);
      } catch (e) {
        loadSceneLocal(kind);
        return;
      }
      /* fallback if nothing arrives */
      setTimeout(function () {
        if (!(S().img && S().img.complete)) loadSceneLocal(kind);
        else schedulePaint();
      }, 3200);
      return;
    }
    loadSceneLocal(kind);
  }

  function applyPack(name) {
    var list = PACKS[name] || PACKS.daily;
    var item = list[Math.floor(Math.random() * list.length)];
    var t = d.getElementById("meme-top") || d.getElementById("meme-top-input");
    var m = d.getElementById("meme-mid") || d.getElementById("meme-mid-input");
    var r = d.getElementById("meme-ref") || d.getElementById("meme-bottom-input");
    if (t) t.value = item.ar;
    if (m) m.value = item.en;
    if (r) r.value = item.ref;
    S().top = item.ar;
    S().mid = item.en;
    S().ref = item.ref;
    refreshDeskCaptions();
    schedulePaint();
  }

  function refreshDeskCaptions() {
    var s = syncFromFields();
    var x = d.getElementById("desk-x-caption");
    var fb = d.getElementById("desk-fb-caption");
    var cap = [s.top, s.mid, s.ref].filter(Boolean).join("\n");
    if (x) x.value = cap;
    if (fb) fb.value = cap + (cap ? "\n" : "") + "Educational only — not a fatwa.";
  }

  function downloadPng() {
    try {
      var canvas = d.getElementById("meme-canvas");
      if (!canvas) return;
      var a = d.createElement("a");
      a.download = "clarity-meme.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    } catch (e) {
      status("Download blocked (online image) — try Blank or local scene");
    }
  }

  function wire() {
    d.querySelectorAll("[data-meme-bg]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        d.querySelectorAll("[data-meme-bg]").forEach(function (b) {
          b.classList.remove("is-active");
        });
        btn.classList.add("is-active");
        loadScene(btn.getAttribute("data-meme-bg"));
      });
    });
    d.querySelectorAll("[data-meme-bg-next]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var kind = S().lastKind || "nature";
        if (typeof w.memeFetchBg === "function") {
          status("Next online · " + kind);
          w.memeFetchBg(kind === "geometry" ? "pattern" : kind);
        } else loadScene(kind);
      });
    });
    d.querySelectorAll("[data-meme-pack]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyPack(btn.getAttribute("data-meme-pack"));
      });
    });
    d.querySelectorAll("[data-meme-font]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        S().font = btn.getAttribute("data-meme-font");
        schedulePaint();
      });
    });
    d.querySelectorAll("[data-meme-style]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        S().style = btn.getAttribute("data-meme-style");
        schedulePaint();
      });
    });
    d.querySelectorAll("[data-meme-ratio]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        S().ratio = btn.getAttribute("data-meme-ratio");
        schedulePaint();
      });
    });
    ["meme-scale-top", "meme-scale-mid", "meme-place"].forEach(function (id) {
      var el = d.getElementById(id);
      if (!el) return;
      el.addEventListener("change", function () {
        if (id === "meme-scale-top") S().scaleTop = clamp(el.value, 50, 160);
        if (id === "meme-scale-mid") S().scaleMid = clamp(el.value, 50, 160);
        if (id === "meme-place") S().place = clamp(el.value, 0, 100);
        schedulePaint();
      });
    });
    ["meme-top", "meme-mid", "meme-ref", "meme-top-input", "meme-mid-input", "meme-bottom-input"].forEach(function (id) {
      var el = d.getElementById(id);
      if (el)
        el.addEventListener("input", function () {
          refreshDeskCaptions();
          schedulePaint();
        });
    });
    var png = d.getElementById("meme-png");
    if (png) png.onclick = downloadPng;
    var sync = d.getElementById("meme-sync") || d.getElementById("desk-refresh");
    if (sync)
      sync.onclick = function () {
        refreshDeskCaptions();
        schedulePaint();
      };
    [
      ["desk-x-download", downloadPng],
      ["desk-fb-download", downloadPng]
    ].forEach(function (p) {
      var el = d.getElementById(p[0]);
      if (el) el.onclick = p[1];
    });
  }

  function boot() {
    wire();
    applyPack("daily");
    schedulePaint();
  }

  w.ClarityMemeRepaint = schedulePaint;
  w.paintMeme = schedulePaint;
  w.memeDraw = schedulePaint;
  w.ClarityMemeOwnerPaint = schedulePaint;
  w.ClarityMemeSyncDesks = updateDeskPreviews;

  d.addEventListener("meme-bg-ready", function () {
    schedulePaint();
  });
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("resize", schedulePaint);
})(window, document);
