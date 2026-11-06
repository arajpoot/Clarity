/*! craft-meme-phase-bc-v1 · C18.3
 * Wire-compatible paint: sets __craftMemeBgImage + __craftMemePaint so scenery STAYS.
 * Full surprise = section line + scenery + scale.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  w.__CRAFT_MEME_PHASE_BC_V1__ = true;

  var LOG = (w.__CRAFT_MEME_BC_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  var SECTIONS = ["reminder", "reality", "reflection", "action"];
  var lastKind = "nature";

  function status(msg) {
    ["meme-fetch-status", "meme-surprise-status", "meme-wire-status"].forEach(function (id) {
      var el = d.getElementById(id);
      if (el) el.textContent = msg;
    });
  }

  function scanUrl(url) {
    if (typeof w.clarityShariahScanUrl === "function") {
      try {
        var r = w.clarityShariahScanUrl(url, "bg");
        if (r && r.ok === false) return false;
      } catch (e) { return false; }
    }
    return true;
  }

  function pickUrl(kind) {
    if (w.CraftMemePools && typeof w.CraftMemePools.next === "function") {
      return w.CraftMemePools.next(kind);
    }
    return null;
  }

  function getCanvas() {
    return d.getElementById("mr-canvas") ||
      d.getElementById("meme-canvas") ||
      d.querySelector("#mr-root canvas") ||
      d.querySelector("canvas");
  }

  /** Painter that keeps last bg image + current text fields */
  function paintWithStoredBg() {
    var canvas = getCanvas();
    if (!canvas || !canvas.getContext) return;
    var img = w.__craftMemeBgImage;
    try {
      if (canvas.width < 100) {
        canvas.width = 1200;
        canvas.height = 675;
      }
      var ctx = canvas.getContext("2d");
      var cw = canvas.width;
      var ch = canvas.height;
      ctx.clearRect(0, 0, cw, ch);

      if (img && img.width) {
        var ir = img.width / img.height;
        var cr = cw / ch;
        var dw, dh, dx, dy;
        if (ir > cr) {
          dh = ch; dw = ch * ir; dx = (cw - dw) / 2; dy = 0;
        } else {
          dw = cw; dh = cw / ir; dx = 0; dy = (ch - dh) / 2;
        }
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.fillStyle = "rgba(7, 20, 16, 0.55)";
        ctx.fillRect(0, 0, cw, ch);
      } else {
        var g1 = ctx.createLinearGradient(0, 0, cw, ch);
        g1.addColorStop(0, "#0d3d32");
        g1.addColorStop(1, "#071410");
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, cw, ch);
      }

      var text = ((d.getElementById("mr-text") || {}).value || "").trim();
      var src = ((d.getElementById("mr-src") || {}).value || "").trim();
      if (text) {
        ctx.fillStyle = "#f3e6c0";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var size = Math.max(22, Math.min(42, Math.floor(cw / 28)));
        ctx.font = "600 " + size + "px Georgia, serif";
        wrapText(ctx, text, cw / 2, ch * 0.42, cw * 0.82, size * 1.25);
      }
      if (src) {
        ctx.font = "500 " + Math.max(14, Math.floor(cw / 55)) + "px system-ui,sans-serif";
        ctx.fillStyle = "rgba(243,230,192,0.85)";
        ctx.fillText(src, cw / 2, ch * 0.78);
      }
      ctx.font = "500 " + Math.max(12, Math.floor(cw / 70)) + "px system-ui,sans-serif";
      ctx.fillStyle = "rgba(243,230,192,0.55)";
      ctx.fillText("clarity-dawah.fyi · educational only", cw / 2, ch * 0.9);
    } catch (e) {
      log("paint-err " + e);
    }
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    var words = String(text).split(/\s+/);
    var line = "";
    var lines = [];
    for (var n = 0; n < words.length; n++) {
      var test = line ? line + " " + words[n] : words[n];
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = words[n];
      } else line = test;
    }
    if (line) lines.push(line);
    var start = y - ((lines.length - 1) * lineHeight) / 2;
    for (var i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], x, start + i * lineHeight);
    }
  }

  function installPainter() {
    w.__craftMemePaint = paintWithStoredBg;
    /* wrap Preview / render so bg is not wiped */
    var prev = d.getElementById("mr-render");
    if (prev && !prev.__bcPaint) {
      prev.__bcPaint = true;
      prev.addEventListener("click", function () {
        setTimeout(paintWithStoredBg, 30);
      }, true);
    }
  }

  function loadUrl(url, attempt) {
    attempt = attempt || 0;
    if (!url) {
      w.__craftMemeBgImage = null;
      installPainter();
      paintWithStoredBg();
      status("Background: solid");
      return;
    }
    if (w.CraftMemePools && w.CraftMemePools.blockedHost && w.CraftMemePools.blockedHost(url)) {
      if (attempt < 4) return loadUrl(pickUrl("nature"), attempt + 1);
      return loadUrl(null, 99);
    }
    if (!scanUrl(url)) {
      if (attempt < 4) return loadUrl(pickUrl("holy"), attempt + 1);
      return loadUrl(null, 99);
    }
    status("Loading scenery…");
    var im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = function () {
      w.__craftMemeBgImage = im;
      installPainter();
      paintWithStoredBg();
      /* second paint after media bench settles */
      setTimeout(paintWithStoredBg, 80);
      setTimeout(paintWithStoredBg, 280);
      status("Background ready · scenery");
      log("bg-ok");
    };
    im.onerror = function () {
      if (attempt < 5) loadUrl(pickUrl(lastKind || "nature"), attempt + 1);
      else {
        w.__craftMemeBgImage = null;
        paintWithStoredBg();
        status("Background: solid (fallback)");
      }
    };
    im.src = url;
  }

  function fetchBg(kind) {
    kind = String(kind || "nature").toLowerCase();
    lastKind = kind;
    if (kind === "blank" || kind === "solid") {
      loadUrl(null, 0);
      return;
    }
    loadUrl(pickUrl(kind), 0);
  }

  function canvasTextBlob() {
    var parts = [];
    var mr = d.getElementById("mr-text");
    if (mr) parts.push(mr.value || "");
    var card = d.getElementById("craft-verse-card");
    if (card) parts.push(card.textContent || "");
    return parts.join("\n");
  }

  function moodFromText(blob) {
    blob = String(blob || "").toLowerCase();
    if (/ليل|night|darkness|stars|moon|قمر|ذكرى|remind/.test(blob)) return "night";
    if (/بحر|water|river|sea|rain|مطر|ocean/.test(blob)) return "water";
    if (/جبل|mountain|طور/.test(blob)) return "mountains";
    if (/صحر|desert|dune/.test(blob)) return "desert";
    if (/جنّ|garden|flower|tree|زرع/.test(blob)) return "flowers";
    if (/كعب|مكّ|مكة|مدينة|مسجد|haram|kaaba|mosque|صل|مؤمن/.test(blob)) return "holy";
    if (/موت|death|grave|قيامة|نار/.test(blob)) return "night";
    return "nature";
  }

  function sceneForText() {
    fetchBg(moodFromText(canvasTextBlob()));
  }

  function autoScale() {
    try {
      var btn = d.getElementById("meme-auto-scale");
      if (btn) btn.click();
      setTimeout(paintWithStoredBg, 100);
    } catch (e) {}
  }

  function surpriseVerse() {
    var sec = SECTIONS[Math.floor(Math.random() * SECTIONS.length)];
    var chip = d.querySelector('[data-meme-section="' + sec + '"]');
    if (chip) try { chip.click(); } catch (e) {}
    try {
      if (w.CraftMemeSource && typeof w.CraftMemeSource.load === "function") w.CraftMemeSource.load(sec);
    } catch (e) {}
    try {
      if (typeof w.memeFetchRrra === "function") w.memeFetchRrra(sec);
    } catch (e) {}
    var refresh = d.getElementById("meme-refresh-source");
    if (refresh) setTimeout(function () { try { refresh.click(); } catch (e) {} }, 60);
    status("Surprise line · " + sec);
    setTimeout(paintWithStoredBg, 200);
    setTimeout(paintWithStoredBg, 450);
    return sec;
  }

  function fullSurprise() {
    status("Full surprise…");
    var sec = surpriseVerse();
    setTimeout(function () {
      sceneForText();
      setTimeout(function () {
        autoScale();
        paintWithStoredBg();
        status("Full surprise · " + sec + " + scenery");
      }, 200);
    }, 280);
  }

  function installFetch() {
    w.memeFetchBg = fetchBg;
    w.__memeOnlineFetch = function (kind) {
      /* used by wire loadBg — must set persistent bg, not return early empty */
      fetchBg(kind);
    };
    w.clarityMemeSurprise = fullSurprise;
    w.clarityMemeSurpriseVerse = surpriseVerse;
    w.clarityMemeSurpriseScene = function () { fetchBg("surprise"); };
    w.clarityMemeSceneForVerse = sceneForText;
    installPainter();
  }

  function wireUi() {
    d.querySelectorAll("[data-meme-bg]").forEach(function (btn) {
      if (btn.__bc2) return;
      btn.__bc2 = true;
      btn.addEventListener("click", function () {
        var k = btn.getAttribute("data-meme-bg") || "nature";
        d.querySelectorAll("[data-meme-bg]").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        fetchBg(k === "surprise" ? "surprise" : k);
      });
    });
    function bind(id, fn) {
      var el = d.getElementById(id);
      if (!el || el.__bc2) return;
      el.__bc2 = true;
      el.addEventListener("click", fn);
    }
    bind("meme-full-surprise", fullSurprise);
    bind("meme-surprise-bg", fullSurprise);
    bind("meme-surprise-verse-only", surpriseVerse);
    bind("meme-surprise-scene-only", function () { fetchBg("surprise"); });
    bind("meme-scene-for-text", sceneForText);
    bind("meme-next-bg", function () { fetchBg(lastKind || "nature"); });
    bind("meme-wire-preview", function () { setTimeout(paintWithStoredBg, 40); });
    bind("meme-auto-scale", function () { setTimeout(paintWithStoredBg, 80); });

    /* section chips: keep bg when text changes */
    d.querySelectorAll("[data-meme-section]").forEach(function (btn) {
      if (btn.__bc2s) return;
      btn.__bc2s = true;
      btn.addEventListener("click", function () {
        setTimeout(function () {
          sceneForText();
          setTimeout(paintWithStoredBg, 200);
        }, 200);
      });
    });
    var refresh = d.getElementById("meme-refresh-source");
    if (refresh && !refresh.__bc2s) {
      refresh.__bc2s = true;
      refresh.addEventListener("click", function () {
        setTimeout(function () {
          sceneForText();
          setTimeout(paintWithStoredBg, 200);
        }, 200);
      });
    }
  }

  function boot() {
    installFetch();
    wireUi();
    log("bc-18.2");
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(boot, 80);
    setTimeout(boot, 400);
    setTimeout(installPainter, 600);
  });
  setInterval(function () {
    installFetch();
    wireUi();
  }, 3000);

  w.CraftMemePhaseBC = {
    fetchBg: fetchBg,
    paint: paintWithStoredBg,
    fullSurprise: fullSurprise,
    log: function () { return LOG.slice(); }
  };
})(window, document);
