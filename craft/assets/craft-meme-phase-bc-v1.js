/*! craft-meme-phase-bc-v1 · C18.1
 * Pools fetch · scene-for-text · FULL surprise = section line + scenery + auto-scale
 * Educational only — not a fatwa. Craft room only.
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_PHASE_BC_V1__) {
    /* allow upgrade reinstall */
  }
  w.__CRAFT_MEME_PHASE_BC_V1__ = true;

  var LOG = (w.__CRAFT_MEME_BC_LOG = w.__CRAFT_MEME_BC_LOG || []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  var SECTIONS = ["reminder", "reality", "reflection", "action"];

  function status(msg) {
    var el = d.getElementById("meme-fetch-status");
    if (el) el.textContent = msg;
    var s2 = d.getElementById("meme-surprise-status");
    if (s2) s2.textContent = msg;
  }

  function scanUrl(url) {
    if (typeof w.clarityShariahScanUrl === "function") {
      try {
        var r = w.clarityShariahScanUrl(url, "bg");
        if (r && r.ok === false) return false;
      } catch (e) {
        return false;
      }
    }
    return true;
  }

  function pickUrl(kind) {
    if (w.CraftMemePools && typeof w.CraftMemePools.next === "function") {
      return w.CraftMemePools.next(kind);
    }
    return null;
  }

  function paintSolid() {
    try {
      var c = d.getElementById("meme-canvas") || d.querySelector("#mr-root canvas") || d.querySelector("canvas");
      if (!c || !c.getContext) return;
      if (c.width < 100) { c.width = 1200; c.height = 675; }
      var ctx = c.getContext("2d");
      var g = ctx.createLinearGradient(0, 0, c.width, c.height);
      g.addColorStop(0, "#0f4c3a");
      g.addColorStop(1, "#1a2a22");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, c.width, c.height);
      if (w.memeState) w.memeState.img = null;
      if (typeof w.memeDraw === "function") w.memeDraw();
    } catch (e) {}
  }

  function loadUrl(url, attempt) {
    attempt = attempt || 0;
    if (!url) {
      paintSolid();
      status("Background: solid");
      return;
    }
    if (w.CraftMemePools && w.CraftMemePools.blockedHost && w.CraftMemePools.blockedHost(url)) {
      if (attempt < 4) return loadUrl(pickUrl("nature"), attempt + 1);
      paintSolid();
      return;
    }
    if (!scanUrl(url)) {
      if (attempt < 4) return loadUrl(pickUrl("holy"), attempt + 1);
      paintSolid();
      return;
    }
    status("Loading scenery…");
    var im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = function () {
      try {
        if (!w.memeState) w.memeState = {};
        w.memeState.img = im;
        if (typeof w.memeLoadImageFromUrl === "function") {
          try { w.memeLoadImageFromUrl(url, null); } catch (e1) {}
        }
        if (typeof w.memeDraw === "function") w.memeDraw();
        else if (typeof w.clarityMemeUiSync === "function") w.clarityMemeUiSync();
        else {
          var c = d.getElementById("meme-canvas") || d.querySelector("#mr-root canvas") || d.querySelector("canvas");
          if (c && c.getContext) {
            if (c.width < 100) { c.width = 1200; c.height = 675; }
            c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
          }
        }
      } catch (e) {}
      status("Background ready · scenery");
    };
    im.onerror = function () {
      if (attempt < 5) loadUrl(pickUrl("nature"), attempt + 1);
      else {
        paintSolid();
        status("Background: solid (fallback)");
      }
    };
    im.src = url;
  }

  function fetchBg(kind) {
    kind = String(kind || "nature").toLowerCase();
    if (kind === "blank" || kind === "solid") {
      paintSolid();
      status("Background: solid");
      return;
    }
    loadUrl(pickUrl(kind), 0);
  }

  function canvasTextBlob() {
    var parts = [];
    try {
      if (w.memeState) {
        parts.push(w.memeState.top || "", w.memeState.mid || "", w.memeState.bottom || "");
      }
    } catch (e) {}
    ["meme-box-top", "meme-box-mid", "meme-box-bottom", "craft-verse-card", "meme-source-status"].forEach(function (id) {
      var el = d.getElementById(id);
      if (el) parts.push(el.textContent || "");
    });
    return parts.join("\n");
  }

  function moodFromText(blob) {
    blob = String(blob || "").toLowerCase();
    if (/ليل|night|darkness|stars|moon|قمر/.test(blob)) return "night";
    if (/مجر|galaxy|milky/.test(blob)) return "galaxy";
    if (/بحر|water|river|sea|rain|مطر|ocean/.test(blob)) return "water";
    if (/جبل|mountain|طور/.test(blob)) return "mountains";
    if (/صحر|desert|dune|رمال/.test(blob)) return "desert";
    if (/جنّ|garden|flower|tree|زرع/.test(blob)) return "flowers";
    if (/كعب|مكّ|مكة|مدينة|مسجد|haram|kaaba|mosque|صل/.test(blob)) return "holy";
    if (/موت|death|grave|قيامة|نار|fire/.test(blob)) return "night";
    return "nature";
  }

  function sceneForText(forceMood) {
    var mood = forceMood || moodFromText(canvasTextBlob());
    fetchBg(mood);
    status("Scene for text · " + mood);
  }

  function autoScale() {
    try {
      var btn = d.getElementById("meme-auto-scale");
      if (btn) btn.click();
      else if (w.memeState && typeof w.memeDraw === "function") {
        if (w.memeState.topScale == null) w.memeState.topScale = 42;
        if (w.memeState.midScale == null) w.memeState.midScale = 36;
        if (w.memeState.botScale == null) w.memeState.botScale = 32;
        w.memeDraw();
      }
    } catch (e) {}
  }

  /** Fetch a random section line using studio controls */
  function surpriseVerse() {
    var sec = SECTIONS[Math.floor(Math.random() * SECTIONS.length)];
    var chip = d.querySelector('[data-meme-section="' + sec + '"]');
    if (chip) {
      try { chip.click(); } catch (e) {}
    }
    /* also try programmatic source APIs */
    try {
      if (w.CraftMemeSource && typeof w.CraftMemeSource.load === "function") {
        w.CraftMemeSource.load(sec);
      }
    } catch (e) {}
    try {
      if (typeof w.memeFetchRrra === "function") w.memeFetchRrra(sec);
    } catch (e) {}
    var refresh = d.getElementById("meme-refresh-source");
    if (refresh) {
      setTimeout(function () {
        try { refresh.click(); } catch (e) {}
      }, 80);
    }
    status("Surprise line · " + sec);
    return sec;
  }

  /** Full surprise: verse/line from fetch banks + matching scenery + scale */
  function fullSurprise() {
    status("Full surprise…");
    var sec = surpriseVerse();
    setTimeout(function () {
      sceneForText();
      setTimeout(function () {
        autoScale();
        status("Full surprise · " + sec + " + scenery + scale");
      }, 180);
    }, 260);
  }

  function surpriseSceneOnly() {
    fetchBg("surprise");
    status("Surprise scene only");
  }

  function installFetch() {
    w.memeFetchBg = fetchBg;
    w.__memeOnlineFetch = fetchBg;
    w.memeFetchNature = function () { fetchBg("nature"); };
    w.clarityMemeSceneForVerse = function () { sceneForText(); };
    w.clarityMemeSurprise = fullSurprise;
    w.clarityMemeSurpriseVerse = surpriseVerse;
    w.clarityMemeSurpriseScene = surpriseSceneOnly;
  }

  function wireChips() {
    d.querySelectorAll("[data-meme-bg]").forEach(function (btn) {
      if (btn.__bcWired) return;
      btn.__bcWired = true;
      btn.addEventListener("click", function () {
        var k = btn.getAttribute("data-meme-bg") || "nature";
        d.querySelectorAll("[data-meme-bg]").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        if (k === "surprise") surpriseSceneOnly();
        else fetchBg(k);
      });
    });
  }

  function wireSurpriseButtons() {
    function bind(id, fn) {
      var el = d.getElementById(id);
      if (!el || el.__bcFull) return;
      el.__bcFull = true;
      el.addEventListener("click", fn);
    }
    bind("meme-full-surprise", fullSurprise);
    bind("meme-surprise-bg", fullSurprise); /* primary surprise = full pack */
    bind("meme-surprise-verse-only", surpriseVerse);
    bind("meme-surprise-scene-only", surpriseSceneOnly);
    bind("meme-scene-for-text", function () { sceneForText(); });
  }

  function ensureExtraChips() {
    var row = d.querySelector(".bg-chips");
    if (!row) return;
    var extras = [
      ["galaxy", "🌌 Galaxy"],
      ["desert", "🏜️ Desert"],
      ["mountains", "⛰️ Mountains"],
      ["spirit", "✨ Spirit"],
      ["geometry", "◈ Pattern"],
      ["surprise", "✨ Surprise scene"]
    ];
    extras.forEach(function (pair) {
      if (row.querySelector('[data-meme-bg="' + pair[0] + '"]')) return;
      var b = d.createElement("button");
      b.type = "button";
      b.setAttribute("data-meme-bg", pair[0]);
      b.textContent = pair[1];
      row.appendChild(b);
    });
  }

  function hookSources() {
    var refresh = d.getElementById("meme-refresh-source");
    if (refresh && !refresh.__bcScene) {
      refresh.__bcScene = true;
      refresh.addEventListener("click", function () {
        setTimeout(function () { sceneForText(); }, 200);
      });
    }
    d.querySelectorAll("[data-meme-section]").forEach(function (btn) {
      if (btn.__bcScene) return;
      btn.__bcScene = true;
      btn.addEventListener("click", function () {
        setTimeout(function () { sceneForText(); }, 220);
      });
    });
  }

  function boot() {
    installFetch();
    ensureExtraChips();
    wireChips();
    wireSurpriseButtons();
    hookSources();
    log("phase-bc C18.1");
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(boot, 100);
    setTimeout(boot, 500);
    setTimeout(wireSurpriseButtons, 700);
  });
  setInterval(function () {
    if (w.memeFetchBg !== fetchBg) installFetch();
    wireSurpriseButtons();
  }, 2500);

  w.CraftMemePhaseBC = {
    fetchBg: fetchBg,
    sceneForText: sceneForText,
    fullSurprise: fullSurprise,
    surpriseVerse: surpriseVerse,
    log: function () { return LOG.slice(); }
  };
})(window, document);
