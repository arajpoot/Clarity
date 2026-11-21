/*! companion-meme-solid-v3
 * Sandbox harmony: sticky scenes · proportional gold frame · fuller text stack · clean strip
 * Educational only — not a fatwa. Scenery only.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_SOLID_V3__) return;
  w.__COMPANION_MEME_SOLID_V3__ = true;

  var STRIP = "clarity-dawah.fyi";

  function S() {
    if (!w.memeState || typeof w.memeState !== "object") w.memeState = {};
    var s = w.memeState;
    if (s.scaleTop == null) s.scaleTop = 100;
    if (s.scaleMid == null) s.scaleMid = 100;
    if (s.scaleBot == null) s.scaleBot = 95;
    if (s.font == null) s.font = "naskh";
    if (s.style == null) s.style = "outline";
    if (s.ratio == null) s.ratio = "instagram"; // 1:1 closer to sandbox card
    if (s.blankColor1 == null) s.blankColor1 = "#0b1220";
    if (s.blankColor2 == null) s.blankColor2 = "#152038";
    return s;
  }

  function status(msg) {
    var el = d.getElementById("meme-fetch-status");
    if (!el) return;
    var t = (msg || "").replace(/\s*·\s*ok\s*$/i, "").replace(/^holy\s*·.*/i, "");
    if (/·\s*ok/i.test(t)) t = "";
    el.textContent = t;
  }

  function fontStack(name) {
    name = (name || "naskh").toLowerCase();
    if (name === "thuluth") return "'Scheherazade New', Amiri, serif";
    if (name === "amiri") return "Amiri, 'Scheherazade New', serif";
    if (name === "kufi") return "'Reem Kufi', 'Noto Kufi Arabic', sans-serif";
    return "Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
  }

  var SCENES = {
    nature: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=85",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1400&q=85"
    ],
    holy: [
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1400&q=85",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Mount_Arafat.jpg/1280px-Mount_Arafat.jpg"
    ],
    flowers: ["https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1400&q=85"],
    night: [
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1400&q=85",
      "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1400&q=85"
    ],
    water: ["https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1400&q=85"],
    spirit: ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1400&q=85"],
    free: ["https://picsum.photos/seed/clarity-v3/1400/1400"],
    dynamic: ["https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1400&q=85"],
    pattern: ["https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1400&q=85"],
    decor: ["https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1400&q=85"],
    mosque: ["https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1400&q=85"],
    geometry: ["https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1400&q=85"]
  };
  var sidx = {}, bgLock = false;

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
      // stick: paint now and again after layout
      paint();
      requestAnimationFrame(paint);
      setTimeout(paint, 80);
      setTimeout(paint, 250);
    };
    img.onerror = function () {
      bgLock = false;
      status("Scene unavailable");
    };
    img.src = url;
  }

  var PACKS = {
    reminder: [
      { ar: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", en: "In the name of Allah, the Entirely Merciful, the Especially Merciful.", ur: "اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔", ref: "Qur'an 1:1" },
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
    paint();
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
      stage.style.padding = "0";
      stage.style.margin = "0";
    }

    var cssW = 360;
    if (stage) {
      var rw = stage.getBoundingClientRect().width;
      if (rw > 40) cssW = Math.floor(rw);
    }
    if (cssW < 280) cssW = Math.min(420, Math.floor((w.innerWidth || 360) * 0.94));

    var s = S();
    var cssH = Math.floor(cssW * ratioVal(s.ratio));
    // avoid huge empty letterbox on phone for tall ratios
    var maxH = Math.floor((w.innerHeight || 700) * 0.55);
    if (cssH > maxH && ratioVal(s.ratio) > 1) {
      cssH = maxH;
      cssW = Math.floor(cssH / ratioVal(s.ratio));
    }

    var dpr = Math.min(2, w.devicePixelRatio || 1);
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.width = "100%";
    canvas.style.maxWidth = "100%";
    canvas.style.height = "auto";
    canvas.style.display = "block";
    canvas.style.margin = "0 auto";
    canvas.style.borderRadius = "16px";

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
    var ref = normRef(s.ref);

    // sticky bg
    var bg = s.bgImage || s.img;
    if (bg && bg.complete && bg.naturalWidth) {
      try {
        var iw = bg.naturalWidth,
          ih = bg.naturalHeight;
        var sc = Math.max(W / iw, H / ih);
        ctx.drawImage(bg, (W - iw * sc) / 2, (H - ih * sc) / 2, iw * sc, ih * sc);
        ctx.fillStyle = "rgba(0,0,0,0.30)";
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

    // Proportional ornate frame (scales with canvas)
    var inset = Math.max(12, Math.round(Math.min(W, H) * 0.045));
    var stripH = Math.max(26, Math.round(H * 0.085));
    var safeTop = inset * 1.2;
    var safeBot = H - stripH - inset * 0.8;
    var safeH = safeBot - safeTop;
    var maxW = W - inset * 2.8;
    var cx = W / 2;
    var stack = fontStack(s.font);
    var style = (s.style || "outline").toLowerCase();

    var frameX = inset * 0.55,
      frameY = inset * 0.55,
      frameW = W - inset * 1.1,
      frameH = H - inset * 1.1;
    ctx.strokeStyle = "rgba(212,175,55,0.95)";
    ctx.lineWidth = Math.max(2.5, Math.min(W, H) * 0.012);
    ctx.strokeRect(frameX, frameY, frameW, frameH);
    ctx.strokeStyle = "rgba(255,230,150,0.55)";
    ctx.lineWidth = Math.max(1.2, Math.min(W, H) * 0.005);
    var pad = inset * 0.35;
    ctx.strokeRect(frameX + pad, frameY + pad, frameW - pad * 2, frameH - pad * 2);

    var c = Math.max(10, Math.min(W, H) * 0.035);
    ctx.strokeStyle = "rgba(255,215,120,0.85)";
    ctx.lineWidth = Math.max(1.5, Math.min(W, H) * 0.006);
    function corner(x, y, dx, dy) {
      ctx.beginPath();
      ctx.moveTo(x, y + dy * c);
      ctx.lineTo(x, y);
      ctx.lineTo(x + dx * c, y);
      ctx.stroke();
    }
    corner(frameX, frameY, 1, 1);
    corner(frameX + frameW, frameY, -1, 1);
    corner(frameX, frameY + frameH, 1, -1);
    corner(frameX + frameW, frameY + frameH, -1, -1);

    // tight strip (less empty under content for share)
    ctx.fillStyle = "rgba(0,0,0,0.38)";
    ctx.fillRect(frameX, H - stripH - inset * 0.2, frameW, stripH + inset * 0.15);

    function drawCentered(text, y, scalePct, base) {
      text = (text || "").trim();
      if (!text) return y;
      var maxSize = Math.floor(base * (Math.max(55, Math.min(160, scalePct || 100)) / 100));
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
          ctx.shadowColor = "rgba(0,0,0,0.5)";
          ctx.shadowBlur = Math.max(4, size * 0.14);
          ctx.fillStyle = "#fff8e7";
          ctx.fillText(ln, cx, yy);
          ctx.shadowBlur = 0;
        } else {
          ctx.strokeStyle = "rgba(0,0,0,0.72)";
          ctx.lineWidth = Math.max(2, size * 0.1);
          ctx.strokeText(ln, cx, yy);
          ctx.fillStyle = "#fff8e7";
          ctx.fillText(ln, cx, yy);
        }
      });
      return y + lines.length * lh;
    }

    var blocks = [];
    if (s.top) blocks.push({ t: s.top, sc: s.scaleTop, base: Math.floor(W * 0.058) });
    if (s.mid) blocks.push({ t: s.mid, sc: s.scaleMid, base: Math.floor(W * 0.036) });
    var ur = (s.bottom || "").trim();
    if (ur && !normRef(ur) && !/^\d+:\d+$/.test(ur))
      blocks.push({ t: ur, sc: s.scaleBot, base: Math.floor(W * 0.032) });
    if (ref) blocks.push({ t: ref, sc: 92, base: Math.floor(W * 0.03) });

    var totalH = 0;
    blocks.forEach(function (b) {
      totalH += Math.floor(b.base * (b.sc / 100) * 1.35);
    });
    totalH += Math.max(0, blocks.length - 1) * Math.floor(H * 0.035);
    var y = safeTop + Math.max(0, (safeH - totalH) / 2) + Math.floor(W * 0.015);
    blocks.forEach(function (b) {
      y = drawCentered(b.t, y, b.sc, b.base);
      y += Math.floor(H * 0.038);
    });

    // strip promo (sandbox-like)
    var pSize = Math.max(11, Math.floor(W * 0.032));
    ctx.font = "600 " + pSize + "px system-ui, sans-serif";
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
        link.style.cssText =
          "position:absolute;left:8%;width:84%;bottom:1.5%;height:11%;z-index:8;";
        stage.appendChild(link);
      }
    }
    return true;
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
    root.querySelectorAll("[data-meme-fetch]").forEach(function (btn) {
      if (btn.__v3) return;
      btn.__v3 = true;
      btn.addEventListener(
        "click",
        function (ev) {
          ev.preventDefault();
          ev.stopImmediatePropagation();
          applyPack(btn.getAttribute("data-meme-fetch") || "reminder");
        },
        true
      );
    });
    root.querySelectorAll("[data-meme-bg],[data-meme-decor]").forEach(function (btn) {
      if (btn.__v3b) return;
      btn.__v3b = true;
      btn.addEventListener(
        "click",
        function (ev) {
          var kind = btn.getAttribute("data-meme-bg") || btn.getAttribute("data-meme-decor");
          if (!kind) return;
          ev.preventDefault();
          ev.stopImmediatePropagation();
          loadScene(kind);
        },
        true
      );
    });
    root.querySelectorAll("[data-meme-font]").forEach(function (btn) {
      if (btn.__v3f) return;
      btn.__v3f = true;
      btn.addEventListener(
        "click",
        function (ev) {
          ev.preventDefault();
          ev.stopImmediatePropagation();
          S().font = btn.getAttribute("data-meme-font") || "naskh";
          markActive("[data-meme-font]", "data-meme-font", S().font);
          paint();
        },
        true
      );
    });
    root.querySelectorAll("[data-meme-style]").forEach(function (btn) {
      if (btn.__v3s) return;
      btn.__v3s = true;
      btn.addEventListener(
        "click",
        function (ev) {
          ev.preventDefault();
          ev.stopImmediatePropagation();
          S().style = btn.getAttribute("data-meme-style") || "outline";
          markActive("[data-meme-style]", "data-meme-style", S().style);
          paint();
        },
        true
      );
    });
    root.querySelectorAll("[data-meme-ratio]").forEach(function (btn) {
      if (btn.__v3r) return;
      btn.__v3r = true;
      btn.addEventListener(
        "click",
        function (ev) {
          ev.preventDefault();
          ev.stopImmediatePropagation();
          S().ratio = btn.getAttribute("data-meme-ratio") || "instagram";
          markActive("[data-meme-ratio]", "data-meme-ratio", S().ratio);
          paint();
        },
        true
      );
    });
    root.querySelectorAll("[data-meme-act]").forEach(function (btn) {
      if (btn.__v3a) return;
      btn.__v3a = true;
      btn.addEventListener(
        "click",
        function (ev) {
          var act = btn.getAttribute("data-meme-act");
          ev.preventDefault();
          ev.stopImmediatePropagation();
          if (act === "autoscale") {
            S().scaleTop = 100;
            S().scaleMid = 100;
            S().scaleBot = 95;
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
            var text = [s.top, s.mid, s.ref || "", "educational only · clarity-dawah.fyi"]
              .filter(Boolean)
              .join("\n\n")
              .slice(0, 280);
            w.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(text), "_blank", "noopener");
          }
        },
        true
      );
    });
  }

  function injectBar() {
    if (!d.getElementById("meme-solid-css")) {
      var st = d.createElement("style");
      st.id = "meme-solid-css";
      st.textContent =
        "#meme-studio-root{display:flex!important;flex-direction:column!important;width:100%!important}" +
        "#meme-canvas{display:block!important;width:100%!important;margin:0 auto!important;border-radius:16px!important}" +
        "#meme-stage{padding:0!important;margin:0!important}" +
        "#meme-solid-bar{display:flex;flex-wrap:wrap;gap:.35rem;align-items:center;margin:.35rem 0;padding:.4rem .5rem;" +
        "border:1px solid rgba(212,180,90,.3);border-radius:10px;background:rgba(0,0,0,.18);font-size:.72rem}" +
        "[data-meme-font].is-active,[data-meme-style].is-active,[data-meme-ratio].is-active{outline:2px solid rgba(212,180,90,.7)}" +
        "#meme-fetch-status:empty{display:none!important}";
      (d.head || d.documentElement).appendChild(st);
    }
    status(""); // clear holy · ok
    if (d.getElementById("meme-solid-bar")) return;
    var root = d.getElementById("meme-studio-root");
    if (!root) return;
    var bar = d.createElement("div");
    bar.id = "meme-solid-bar";
    var opts = [70, 85, 100, 120, 140]
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
    function bind(id, key) {
      var el = d.getElementById(id);
      if (!el) return;
      el.value = String(S()[key] || 100);
      el.onchange = function () {
        S()[key] = parseInt(el.value, 10) || 100;
        paint();
      };
    }
    bind("ms-top", "scaleTop");
    bind("ms-mid", "scaleMid");
    bind("ms-bot", "scaleBot");
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

  function claim() {
    w.paintMeme = paint;
    w.memeDraw = paint;
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
    claim();
    injectBar();
    wireAll();
    status("");
    paint();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  d.addEventListener("clarity:tab-mounted", function () {
    setTimeout(boot, 60);
  });
  w.addEventListener("resize", function () {
    paint();
  });
  w.addEventListener("orientationchange", function () {
    setTimeout(paint, 200);
  });
})(window, document);
