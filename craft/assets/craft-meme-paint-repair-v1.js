/*! craft-meme-paint-repair-v1 · C17R1
 * Single owner for: canvas ensure · BG paint · text overlay · ratio · auto-scale.
 * Fixes C17 race: multiple __memeOnlineFetch wrappers + mr-canvas vs meme-canvas split.
 * G1: clarityShariahScanUrl before remote URL (fail closed if missing).
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_PAINT_REPAIR_C17R1__) return;
  w.__CRAFT_MEME_PAINT_REPAIR_C17R1__ = true;

  var bgImage = null;
  var ratioKey = "16:9";
  var DIMS = { "1:1": [1080, 1080], "16:9": [1200, 675], "4:5": [1080, 1350], twitter: [1200, 675], facebook: [1200, 630] };

  /* Known-good Wikimedia thumbs (tested paths) */
  var POOLS = {
    holy: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Masjid_al-Haram%2C_Mecca.jpg/1280px-Masjid_al-Haram%2C_Mecca.jpg"
    ],
    nature: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Desert_in_Qatar.jpg/1280px-Desert_in_Qatar.jpg",
      "https://picsum.photos/seed/clarity-craft-nature/1280/720"
    ],
    night: [
      "https://picsum.photos/seed/clarity-craft-night/1280/720"
    ],
    water: [
      "https://picsum.photos/seed/clarity-craft-water/1280/720"
    ],
    flowers: [
      "https://picsum.photos/seed/clarity-craft-flowers/1280/720"
    ],
    flickr: [
      "https://picsum.photos/seed/clarity-craft-free/1280/720"
    ]
  };

  function $(id) { return d.getElementById(id); }
  function status(msg) {
    var el = $("meme-fetch-status") || $("meme-wire-status");
    if (el) el.textContent = msg || "";
  }
  function scan(url, meta) {
    if (typeof w.clarityShariahScanUrl !== "function") {
      status("Shariah scan unavailable — refusing unscoped load");
      return false;
    }
    var r = w.clarityShariahScanUrl(url, meta || "");
    if (!r.ok) {
      status("Skipped (" + (r.reason || "blocked") + ")");
      return false;
    }
    return true;
  }

  function ensureCanvas() {
    var root = $("mr-root");
    if (!root) return null;
    var c = $("mr-canvas") || $("meme-canvas") || root.querySelector("canvas");
    if (!c) {
      var wrap = d.createElement("div");
      wrap.className = "craft-canvas-wrap";
      c = d.createElement("canvas");
      c.id = "mr-canvas";
      c.width = 1200;
      c.height = 675;
      c.style.cssText = "width:100%;max-width:720px;height:auto;display:block;margin:0.5rem auto;border-radius:12px;background:#0b1f18;";
      wrap.appendChild(c);
      root.appendChild(wrap);
    }
    if (!$("meme-canvas")) {
      try { c.id = c.id || "mr-canvas"; } catch (e) {}
    }
    return c;
  }

  function lineText() {
    var t = $("mr-text");
    var s = $("mr-src");
    var card = $("craft-verse-card");
    var body = (t && t.value) || (card && card.textContent) || "";
    var src = (s && s.value) || "";
    return { body: String(body || "").trim(), src: String(src || "").trim() };
  }

  function paint() {
    var c = ensureCanvas();
    if (!c) {
      status("No canvas host");
      return;
    }
    var dims = DIMS[ratioKey] || DIMS["16:9"];
    if (c.width !== dims[0] || c.height !== dims[1]) {
      c.width = dims[0];
      c.height = dims[1];
    }
    var ctx = c.getContext("2d");
    if (!ctx) return;
    var cw = c.width, ch = c.height;
    ctx.fillStyle = "#0b1f18";
    ctx.fillRect(0, 0, cw, ch);

    if (bgImage) {
      try {
        var ir = bgImage.width / Math.max(1, bgImage.height);
        var cr = cw / ch;
        var dw, dh, dx, dy;
        if (ir > cr) {
          dh = ch; dw = ch * ir; dx = (cw - dw) / 2; dy = 0;
        } else {
          dw = cw; dh = cw / ir; dx = 0; dy = (ch - dh) / 2;
        }
        ctx.drawImage(bgImage, dx, dy, dw, dh);
      } catch (e) {
        ctx.fillStyle = "#12352a";
        ctx.fillRect(0, 0, cw, ch);
      }
    }

    var L = lineText();
    if (L.body) {
      ctx.fillStyle = "rgba(0,0,0,0.48)";
      ctx.fillRect(0, ch * 0.28, cw, ch * 0.46);
      ctx.fillStyle = "#f3e6c0";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      var lines = L.body.split(/\n/).map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 6);
      /* auto-scale font to fit width */
      var fontSize = Math.min(42, Math.floor(ch * 0.07));
      var maxW = cw - 96;
      function fits(size) {
        ctx.font = "600 " + size + "px Amiri, serif";
        return lines.every(function (ln) { return ctx.measureText(ln).width <= maxW; });
      }
      while (fontSize > 16 && !fits(fontSize)) fontSize -= 2;
      ctx.font = "600 " + fontSize + "px Amiri, serif";
      var lineH = fontSize * 1.35;
      var startY = ch * 0.42 - ((lines.length - 1) * lineH) / 2;
      lines.forEach(function (ln, i) {
        ctx.fillText(ln.slice(0, 120), cw / 2, startY + i * lineH);
      });
      if (L.src) {
        ctx.fillStyle = "rgba(224,197,106,0.95)";
        ctx.font = "500 " + Math.max(14, Math.floor(fontSize * 0.45)) + "px Quicksand, system-ui, sans-serif";
        ctx.fillText(L.src.slice(0, 80), cw / 2, ch - 48);
      }
      ctx.fillStyle = "rgba(243,230,192,0.55)";
      ctx.font = "12px Quicksand, system-ui, sans-serif";
      ctx.fillText("clarity-dawah.fyi · educational reminder", cw / 2, ch - 24);
    }
  }

  function loadBg(kind) {
    kind = String(kind || "blank").toLowerCase();
    if (kind === "blank") {
      bgImage = null;
      paint();
      status("Background: solid");
      return;
    }
    var pool = POOLS[kind] || POOLS.nature;
    var url = pool[Math.floor(Math.random() * pool.length)];
    if (!scan(url, kind)) return;
    status("Fetching " + kind + "…");
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      bgImage = img;
      try {
        if (w.memeState) { w.memeState.img = img; w.memeState.bgImage = img; }
      } catch (e) {}
      paint();
      status("Background: " + kind + " · painted · scanned");
    };
    img.onerror = function () {
      /* last resort solid with message */
      bgImage = null;
      paint();
      status("BG load failed · solid · try another chip");
    };
    img.src = url;
  }

  function applyRatio(r) {
    ratioKey = r || "16:9";
    var c = ensureCanvas();
    var dims = DIMS[ratioKey] || DIMS["16:9"];
    if (c) {
      c.width = dims[0];
      c.height = dims[1];
      c.style.aspectRatio = dims[0] + " / " + dims[1];
    }
    var st = $("meme-ratio-status");
    if (st) st.textContent = "Ratio · " + ratioKey;
    paint();
  }

  function autoScale() {
    paint();
    status("Text auto-scaled to canvas");
  }

  function bind() {
    ensureCanvas();
    /* Take ownership of online fetch LAST */
    w.__memeOnlineFetch = function (kind) { loadBg(kind); };
    w.memeFetchBg = w.__memeOnlineFetch;
    w.__craftMemePaint = paint;
    w.memeAutoScaleLines = autoScale;

    d.querySelectorAll("[data-meme-bg]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        d.querySelectorAll("[data-meme-bg]").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        loadBg(btn.getAttribute("data-meme-bg"));
      });
    });
    d.querySelectorAll("[data-meme-ratio]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        d.querySelectorAll("[data-meme-ratio]").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        applyRatio(btn.getAttribute("data-meme-ratio"));
      });
    });
    d.querySelectorAll("[data-meme-section]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setTimeout(paint, 50);
      });
    });
    var prev = $("meme-wire-preview");
    if (prev) prev.addEventListener("click", paint);
    var sc = $("meme-auto-scale");
    if (sc) sc.addEventListener("click", autoScale);
    var next = $("meme-next-bg");
    if (next) next.addEventListener("click", function () {
      var a = d.querySelector("[data-meme-bg].active");
      loadBg((a && a.getAttribute("data-meme-bg")) || "nature");
    });
    var exp = $("meme-export-png");
    if (exp) exp.addEventListener("click", function () {
      var c = ensureCanvas();
      if (!c) return;
      try {
        var a = d.createElement("a");
        a.href = c.toDataURL("image/png");
        a.download = "clarity-craft-meme-" + Date.now() + ".png";
        a.click();
      } catch (e) {
        alert("Export failed (canvas tainted or empty).");
      }
    });
    ["mr-text", "mr-src"].forEach(function (id) {
      var el = $(id);
      if (el) el.addEventListener("input", function () { paint(); });
    });

    /* Initial paint after MediaReminder opens */
    setTimeout(function () {
      ensureCanvas();
      paint();
      status("Paint repair ready · pick section + scenery");
    }, 600);
    setTimeout(function () {
      ensureCanvas();
      paint();
    }, 1400);
  }

  function boot() {
    try {
      if (w.ClarityCraftStudioBoot) w.ClarityCraftStudioBoot.media();
      else if (w.ClarityMediaReminder) w.ClarityMediaReminder.open($("mr-root"));
    } catch (e) {}
    setTimeout(bind, 300);
    setTimeout(bind, 1000);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
