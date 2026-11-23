/*! companion-meme-owner-v1 · CM8 night fix
 * Single paint path for main canvas + X/FB desks · online bg via memeFetchBg
 * Educational only — not a fatwa · scenery only
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_OWNER_CM8__) return;
  w.__COMPANION_MEME_OWNER_CM8__ = true;

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
    spirit: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=80"],
    pattern: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1400&q=80"],
    decor: ["https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1400&q=80"],
    flickr: [],
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
  function drawFrame(ctx, W, H) {
    var inset = Math.max(10, Math.floor(W * 0.03));
    var stripH = Math.max(18, Math.floor(H * 0.06));
    ctx.strokeStyle = "rgba(232, 199, 107, 0.85)";
    ctx.lineWidth = 3;
    ctx.strokeRect(inset * 0.5, inset * 0.5, W - inset, H - inset);
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(0, H - stripH, W, stripH);
    ctx.fillStyle = "rgba(232,199,107,0.95)";
    ctx.font = "11px Quicksand, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(STRIP, W / 2, H - stripH / 2);
    return { inset: inset, stripH: stripH };
  }

  function syncFromFields() {
    var s = S();
    var t = d.getElementById("meme-top") || d.getElementById("meme-top-input");
    var m = d.getElementById("meme-mid") || d.getElementById("meme-mid-input");
    var r = d.getElementById("meme-ref") || d.getElementById("meme-bottom-input");
    if (t) s.top = t.value;
    if (m) s.mid = m.value;
    if (r) s.ref = r.value;
    return s;
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
        ctx.fillStyle = "rgba(0,0,0,0.32)";
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
    var place = (typeof s.place === "number" ? s.place : 50) / 100;
    var midY = safeTop + safeH * place;
    var maxW = W - inset * 2.2;
    var st = (s.scaleTop || 100) / 100;
    var sm = (s.scaleMid || 100) / 100;
    if (s.top) {
      ctx.font = "bold " + Math.floor(22 * st) + "px " + fontStack(s.font, true);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      var lines = wrap(ctx, s.top, maxW);
      var lh = Math.floor(26 * st);
      var y0 = midY - ((lines.length - 1) * lh) / 2 - (s.mid ? lh * 0.75 : 0);
      lines.forEach(function (ln, i) {
        var y = y0 + i * lh;
        ctx.lineWidth = s.style === "soft" ? 2 : 3;
        ctx.strokeStyle = "rgba(0,0,0,0.65)";
        if (s.style !== "fill") ctx.strokeText(ln, W / 2, y);
        ctx.fillStyle = "#f8f4ea";
        ctx.fillText(ln, W / 2, y);
      });
      midY = y0 + lines.length * lh + 8;
    }
    if (s.mid) {
      ctx.font = Math.floor(14 * sm) + "px Quicksand, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      wrap(ctx, s.mid, maxW).forEach(function (ln, i) {
        var y = midY + i * Math.floor(18 * sm);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(0,0,0,0.55)";
        ctx.strokeText(ln, W / 2, y);
        ctx.fillStyle = "#f0ebe3";
        ctx.fillText(ln, W / 2, y);
      });
    }
    if (s.ref) {
      ctx.font = "11px Quicksand, system-ui, sans-serif";
      ctx.fillStyle = "rgba(240,215,140,0.95)";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(normRef(s.ref), W / 2, H - stripH - 6);
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
