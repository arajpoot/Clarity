/*! companion-meme-owner-v1
 * Isolated Companion meme room + in-room X & Facebook desks (no Craft)
 * Educational only — not a fatwa · scenery only
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_OWNER_V1__) return;
  w.__COMPANION_MEME_OWNER_V1__ = true;

  var STRIP = "clarity-dawah.fyi";

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
  function deskStatus(which, msg) {
    var el = d.getElementById(which === "x" ? "desk-x-status" : "desk-fb-status");
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
    if (name === "amiri") return "Amiri, 'Scheherazade New', serif";
    if (name === "kufi") return arabic ? "'Reem Kufi', 'Noto Kufi Arabic', sans-serif" : "'Reem Kufi', sans-serif";
    return arabic ? "'Noto Naskh Arabic', Amiri, serif" : "Amiri, Georgia, serif";
  }

  var SCENES = {
    nature: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80"],
    holy: ["https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1400&q=80"],
    night: ["https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1400&q=80"],
    water: ["https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1400&q=80"],
    spirit: ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1400&q=80"],
    flowers: ["https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1400&q=80"]
  };
  var sidx = {}, bgLock = false, paintLock = false, tmr = null;

  function loadScene(kind) {
    kind = String(kind || "nature").toLowerCase();
    if (kind === "blank") {
      S().img = null;
      S().bgImage = null;
      status("");
      schedulePaint();
      return;
    }
    /* CM4: prefer archive3 online pools (Commons / Flickr / Picsum) */
    var onlineKinds = { nature:1, flowers:1, holy:1, spirit:1, night:1, water:1, flickr:1, free:1, decor:1, pattern:1, geometry:1 };
    if (onlineKinds[kind] && typeof w.memeFetchBg === "function") {
      status("Online scenery · " + kind + "…");
      try {
        w.memeFetchBg(kind === "geometry" ? "pattern" : kind);
      } catch (e) {}
      /* still cycle local SCENES as parallel fallback after delay if no img */
      setTimeout(function () {
        if (S().img || S().bgImage) {
          schedulePaint();
          return;
        }
        loadSceneLocal(kind);
      }, 2800);
      return;
    }
    loadSceneLocal(kind);
  }
  function loadSceneLocal(kind) {
    kind = String(kind || "nature").toLowerCase();
    if (!SCENES[kind]) kind = "nature";
    var list = SCENES[kind] || SCENES.nature || [];
    if (!list.length) {
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
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      bgLock = false;
      S().img = img;
      S().bgImage = img;
      status("Background ready");
      schedulePaint();
    };
    img.onerror = function () {
      bgLock = false;
      status("Scene unavailable · try another");
      schedulePaint();
    };
    img.src = url;
  }

  var PACKS = {
    reminder: [
      { ar: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", en: "In the name of Allah, the Entirely Merciful, the Especially Merciful.", ref: "Qur'an 1:1" },
      { ar: "فَاذْكُرُونِي أَذْكُرْكُمْ", en: "So remember Me; I will remember you.", ref: "Qur'an 2:152" }
    ],
    reality: [{ ar: "وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ", en: "And cooperate in righteousness and piety.", ref: "Qur'an 5:2" }],
    reflection: [{ ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", en: "Indeed, with hardship comes ease.", ref: "Qur'an 94:6" }],
    action: [{ ar: "وَأَقِيمُوا الصَّلَاةَ", en: "And establish prayer.", ref: "Qur'an 2:43" }],
    daily: [{ ar: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", en: "All praise is for Allah, Lord of the worlds.", ref: "Qur'an 1:2" }],
    night: [{ ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", en: "Surely in the remembrance of Allah do hearts find rest.", ref: "Qur'an 13:28" }]
  };
  var pidx = {};

  function syncFromFields() {
    var s = S();
    var ti = d.getElementById("meme-top");
    var mi = d.getElementById("meme-mid");
    if (ti) s.top = ti.value;
    if (mi) s.mid = mi.value;
    return s;
  }

  function applyPack(kind) {
    kind = String(kind || "daily").toLowerCase();
    var list = PACKS[kind] || PACKS.daily;
    if (pidx[kind] == null) pidx[kind] = 0;
    var item = list[pidx[kind] % list.length];
    pidx[kind]++;
    var s = S();
    s.top = item.ar || "";
    s.mid = item.en || "";
    s.ref = item.ref || "";
    var t = d.getElementById("meme-top");
    var m = d.getElementById("meme-mid");
    if (t) t.value = s.top;
    if (m) m.value = s.mid;
    refreshDeskCaptions();
    schedulePaint();
  }

  function caption() {
    var s = syncFromFields();
    return [s.top, s.mid, s.ref || "", "educational only · clarity-dawah.fyi"].filter(Boolean).join("\n\n").slice(0, 280);
  }

  function captionFb() {
    var s = syncFromFields();
    return [s.top, s.mid, s.ref || "", "", "Educational only — not a fatwa.", "clarity-dawah.fyi"].filter(Boolean).join("\n");
  }

  function refreshDeskCaptions() {
    var x = d.getElementById("desk-x-caption");
    var f = d.getElementById("desk-fb-caption");
    if (x) x.value = caption();
    if (f) f.value = captionFb();
    updateDeskPreviews();
  }

  function updateDeskPreviews() {
    paint();
    try {
      var canvas = d.getElementById("meme-canvas");
      if (!canvas) return;
      var url = canvas.toDataURL("image/png");
      ["desk-x-preview", "desk-fb-preview"].forEach(function (id) {
        var img = d.getElementById(id);
        if (img) {
          img.src = url;
          img.style.display = "block";
        }
      });
    } catch (e) {}
  }

  function normRef(r) {
    r = String(r || "").trim();
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
    return lines.slice(0, 6);
  }

  function ratioVal(key) {
    key = (key || "facebook").toLowerCase();
    if (key === "instagram") return 1;
    if (key === "twitter") return 9 / 16;
    if (key === "story") return 16 / 9;
    return 1 / 1.91;
  }

  function drawFrame(ctx, W, H) {
    var m = Math.min(W, H);
    var inset = Math.max(12, Math.round(m * 0.048));
    var x = inset * 0.5,
      y = inset * 0.5,
      w = W - inset,
      h = H - inset;
    var r = Math.max(16, Math.round(m * 0.05));
    var lw = Math.max(3, m * 0.014);
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
    ctx.strokeStyle = "rgba(212,175,55,0.25)";
    ctx.lineWidth = lw + 4;
    rr(x, y, w, h, r);
    ctx.stroke();
    ctx.strokeStyle = "rgba(218,185,70,0.98)";
    ctx.lineWidth = lw;
    rr(x, y, w, h, r);
    ctx.stroke();
    var pad = Math.max(5, inset * 0.32);
    ctx.strokeStyle = "rgba(255,235,170,0.65)";
    ctx.lineWidth = Math.max(1.3, m * 0.005);
    rr(x + pad, y + pad, w - pad * 2, h - pad * 2, Math.max(8, r - pad * 0.5));
    ctx.stroke();
    return { inset: inset, stripH: Math.max(26, Math.round(H * 0.1)), frameX: x, frameW: w };
  }

  function schedulePaint() {
    if (tmr) clearTimeout(tmr);
    tmr = setTimeout(function () {
      paint();
      // keep desk previews in sync after paint
      try {
        var canvas = d.getElementById("meme-canvas");
        if (!canvas) return;
        var url = canvas.toDataURL("image/png");
        ["desk-x-preview", "desk-fb-preview"].forEach(function (id) {
          var img = d.getElementById(id);
          if (img) {
            img.src = url;
            img.style.display = "block";
          }
        });
      } catch (e) {}
    }, 40);
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
      var W = cssW,
        H = cssH;
      var ref = normRef(s.ref);

      var bg = s.bgImage || s.img;
      if (bg && bg.complete && bg.naturalWidth) {
        try {
          var iw = bg.naturalWidth,
            ih = bg.naturalHeight;
          var sc = Math.max(W / iw, H / ih);
          ctx.drawImage(bg, (W - iw * sc) / 2, (H - ih * sc) / 2, iw * sc, ih * sc);
          ctx.fillStyle = "rgba(0,0,0,0.3)";
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

      var fm = drawFrame(ctx, W, H);
      var inset = fm.inset,
        stripH = fm.stripH;
      var safeTop = inset * 1.3;
      var safeBot = H - stripH - inset * 0.9;
      var safeH = Math.max(40, safeBot - safeTop);
      var maxW = W - inset * 2.6;
      var cx = W / 2;
      var style = (s.style || "outline").toLowerCase();

      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(fm.frameX, H - stripH - inset * 0.15, fm.frameW, stripH + inset * 0.1);

      function drawCentered(text, y, scalePct, base, arabic) {
        text = (text || "").trim();
        if (!text) return y;
        var stack = fontStack(s.font, !!arabic);
        var size = Math.floor(base * (clamp(scalePct, 50, 160) / 100));
        ctx.font = "700 " + size + "px " + stack;
        var lines = wrap(ctx, text, maxW);
        while (size > 11 && lines.length * size * 1.28 > safeH * 0.42) {
          size -= 1;
          ctx.font = "700 " + size + "px " + stack;
          lines = wrap(ctx, text, maxW);
        }
        var lh = size * 1.28;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
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
            ctx.lineWidth = Math.max(2, size * 0.1);
            ctx.strokeText(ln, cx, yy);
            ctx.fillStyle = "#fff8e7";
            ctx.fillText(ln, cx, yy);
          }
        });
        return y + lines.length * lh;
      }

      var blocks = [];
      if (s.top) blocks.push({ t: s.top, sc: s.scaleTop, base: Math.floor(W * 0.055), ar: true });
      if (s.mid) blocks.push({ t: s.mid, sc: s.scaleMid, base: Math.floor(W * 0.034), ar: false });
      if (ref) blocks.push({ t: ref, sc: 90, base: Math.floor(W * 0.028), ar: false });

      var totalH = 0;
      blocks.forEach(function (b) {
        totalH += Math.floor(b.base * (clamp(b.sc, 50, 160) / 100) * 1.3);
      });
      totalH += Math.max(0, blocks.length - 1) * Math.floor(H * 0.03);
      var place = clamp(s.place, 0, 100);
      var y0 = safeTop + ((safeH - totalH) * place) / 100;
      if (y0 < safeTop) y0 = safeTop;
      if (y0 + totalH > safeBot) y0 = Math.max(safeTop, safeBot - totalH);
      var y = y0;
      blocks.forEach(function (b) {
        y = drawCentered(b.t, y, b.sc, b.base, b.ar);
        y += Math.floor(H * 0.03);
      });

      ctx.font = "600 " + Math.max(11, Math.floor(W * 0.03)) + "px system-ui, sans-serif";
      ctx.fillStyle = "rgba(255,230,150,0.95)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(STRIP, cx, H - stripH / 2);
    } finally {
      paintLock = false;
    }
  }

  function downloadPng() {
    paint();
    try {
      var a = d.createElement("a");
      a.download = "clarity-meme.png";
      a.href = d.getElementById("meme-canvas").toDataURL("image/png");
      a.click();
      status("PNG downloaded");
      deskStatus("x", "PNG ready to attach in X");
      deskStatus("fb", "PNG ready to attach in Facebook");
    } catch (e) {
      status("PNG export blocked");
    }
  }

  function copyImage(which) {
    paint();
    try {
      var canvas = d.getElementById("meme-canvas");
      canvas.toBlob(function (blob) {
        if (!blob || !navigator.clipboard || !w.ClipboardItem) {
          deskStatus(which, "Copy image not supported — use Download PNG");
          return;
        }
        navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]).then(
          function () {
            deskStatus(which, "Image copied — paste into the app");
          },
          function () {
            deskStatus(which, "Copy failed — use Download PNG");
          }
        );
      }, "image/png");
    } catch (e) {
      deskStatus(which, "Copy failed — use Download PNG");
    }
  }

  function copyText(which) {
    var t = which === "x" ? (d.getElementById("desk-x-caption") || {}).value || caption() : (d.getElementById("desk-fb-caption") || {}).value || captionFb();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(t).then(function () {
        deskStatus(which, "Caption copied");
      });
    } else deskStatus(which, t.slice(0, 80));
  }

  function openX() {
    var t = (d.getElementById("desk-x-caption") || {}).value || caption();
    w.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(t.slice(0, 280)), "_blank", "noopener");
    deskStatus("x", "X opened — attach PNG from Download");
  }

  function openFb() {
    // Facebook sharer: link share; image still via download/paste
    var u = encodeURIComponent("https://clarity-dawah.fyi/companion/redirects/meme/");
    w.open("https://www.facebook.com/sharer/sharer.php?u=" + u, "_blank", "noopener");
    deskStatus("fb", "Facebook opened — upload PNG + paste caption");
  }

  function wire() {
    d.querySelectorAll("[data-meme-bg]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        loadScene(btn.getAttribute("data-meme-bg"));
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
    var st = d.getElementById("meme-scale-top");
    var sm = d.getElementById("meme-scale-mid");
    var pl = d.getElementById("meme-place");
    if (st)
      st.addEventListener("change", function () {
        S().scaleTop = clamp(st.value, 50, 160);
        schedulePaint();
      });
    if (sm)
      sm.addEventListener("change", function () {
        S().scaleMid = clamp(sm.value, 50, 160);
        schedulePaint();
      });
    if (pl)
      pl.addEventListener("change", function () {
        S().place = clamp(pl.value, 0, 100);
        schedulePaint();
      });
    ["meme-top", "meme-mid"].forEach(function (id) {
      var el = d.getElementById(id);
      if (el)
        el.addEventListener("input", function () {
          refreshDeskCaptions();
          schedulePaint();
        });
    });

    var png = d.getElementById("meme-png");
    if (png) png.onclick = downloadPng;

    // desks
    var map = [
      ["desk-x-download", downloadPng],
      ["desk-fb-download", downloadPng],
      ["desk-x-copy-img", function () { copyImage("x"); }],
      ["desk-fb-copy-img", function () { copyImage("fb"); }],
      ["desk-x-copy-text", function () { copyText("x"); }],
      ["desk-fb-copy-text", function () { copyText("fb"); }],
      ["desk-x-open", openX],
      ["desk-fb-open", openFb],
      ["desk-refresh", function () { refreshDeskCaptions(); schedulePaint(); }]
    ];
    map.forEach(function (pair) {
      var el = d.getElementById(pair[0]);
      if (el) el.onclick = pair[1];
    });
  }

  function boot() {
    wire();
    applyPack("daily");
    schedulePaint();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("resize", schedulePaint);
})(window, document);
