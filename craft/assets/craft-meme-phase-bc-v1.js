/*! craft-meme-phase-bc-v1 · foundation repair + enrichment
 * - Reliable fetch via CraftMemePools + clarityShariahScanUrl
 * - More background pills · Surprise · scene-per-text
 * - Text auto-scale helper · no alert spam
 * Educational only — not a fatwa. Craft room only.
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_PHASE_BC_V1__) return;
  w.__CRAFT_MEME_PHASE_BC_V1__ = true;

  var LOG = (w.__CRAFT_MEME_BC_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  function status(msg) {
    var el = d.getElementById("meme-fetch-status");
    if (el) el.textContent = msg;
  }

  function scanUrl(url) {
    if (typeof w.clarityShariahScanUrl === "function") {
      try {
        var r = w.clarityShariahScanUrl(url, "bg");
        if (r && r.ok === false) return false;
      } catch (e) {
        log("scan-err");
        return false; /* fail closed */
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
    if (w.CraftMemePools && w.CraftMemePools.blockedHost(url)) {
      if (attempt < 4) return loadUrl(pickUrl("nature"), attempt + 1);
      paintSolid();
      status("Background: solid (blocked host)");
      return;
    }
    if (!scanUrl(url)) {
      if (attempt < 4) return loadUrl(pickUrl("holy"), attempt + 1);
      paintSolid();
      status("Background: solid (scan)");
      return;
    }
    status("Loading…");
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
      } catch (e) { log("paint " + e); }
      status("Background ready · scenery");
      log("ok");
    };
    im.onerror = function () {
      log("fail");
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
    var url = pickUrl(kind);
    log("fetch " + kind);
    loadUrl(url, 0);
  }

  /* Scene mood from painted / source text */
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
    if (/ليل|night|darkness|stars|moon|قمر|سماء/.test(blob)) return "night";
    if (/مجر|galaxy|milky/.test(blob)) return "galaxy";
    if (/بحر|water|river|sea|rain|مطر|نهر|ocean/.test(blob)) return "water";
    if (/جبل|mountain|طور/.test(blob)) return "mountains";
    if (/صحر|desert|رمال|dune/.test(blob)) return "desert";
    if (/جنّ|garden|flower|tree|زرع|نبات/.test(blob)) return "flowers";
    if (/كعب|مكّ|مكة|مدينة|مسجد|haram|kaaba|mosque|صل|قبل/.test(blob)) return "holy";
    if (/موت|death|grave|قيامة|نار|fire|hour/.test(blob)) return "night";
    if (/نور|light|dawn|فجر|شمس|sun/.test(blob)) return "nature";
    return "nature";
  }

  function sceneForText(forceMood) {
    var mood = forceMood || moodFromText(canvasTextBlob());
    fetchBg(mood);
    status("Scene for text · " + mood);
  }

  function surprise() {
    fetchBg("surprise");
    /* light text scale nudge if auto-scale exists */
    try {
      var btn = d.getElementById("meme-auto-scale");
      if (btn) btn.click();
    } catch (e) {}
    status("Surprise scenery");
  }

  function installFetch() {
    w.memeFetchBg = fetchBg;
    w.__memeOnlineFetch = fetchBg;
    w.memeFetchNature = function () { fetchBg("nature"); };
    w.clarityMemeSceneForVerse = function () { sceneForText(); };
    w.clarityMemeSurprise = surprise;
  }

  function wireChips() {
    d.querySelectorAll("[data-meme-bg]").forEach(function (btn) {
      if (btn.__bcWired) return;
      btn.__bcWired = true;
      btn.addEventListener("click", function () {
        var k = btn.getAttribute("data-meme-bg") || "nature";
        d.querySelectorAll("[data-meme-bg]").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        if (k === "surprise") surprise();
        else fetchBg(k);
      });
    });
    var sur = d.getElementById("meme-surprise-bg");
    if (sur && !sur.__bcWired) {
      sur.__bcWired = true;
      sur.addEventListener("click", surprise);
    }
    var sceneBtn = d.getElementById("meme-scene-for-text");
    if (sceneBtn && !sceneBtn.__bcWired) {
      sceneBtn.__bcWired = true;
      sceneBtn.addEventListener("click", function () { sceneForText(); });
    }
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
      ["surprise", "✨ Surprise"]
    ];
    extras.forEach(function (pair) {
      if (row.querySelector('[data-meme-bg="' + pair[0] + '"]')) return;
      var b = d.createElement("button");
      b.type = "button";
      b.setAttribute("data-meme-bg", pair[0]);
      b.textContent = pair[1];
      row.appendChild(b);
    });
    /* action row under chips */
    if (!d.getElementById("meme-bc-actions")) {
      var actions = d.createElement("div");
      actions.id = "meme-bc-actions";
      actions.className = "wire-actions";
      actions.style.marginTop = "0.4rem";
      actions.innerHTML =
        '<button type="button" class="btn primary" id="meme-surprise-bg">✨ Surprise scene</button>' +
        '<button type="button" class="btn" id="meme-scene-for-text">🖼 Scene for text</button>' +
        '<button type="button" class="btn" id="meme-next-scenery">↻ Next scenery</button>';
      row.parentNode.insertBefore(actions, row.nextSibling);
      var next = d.getElementById("meme-next-scenery");
      if (next) {
        next.addEventListener("click", function () {
          var active = d.querySelector("[data-meme-bg].active");
          var k = (active && active.getAttribute("data-meme-bg")) || "nature";
          if (k === "blank") k = "nature";
          fetchBg(k);
        });
      }
    }
  }

  /* Auto scene when section source refreshes */
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

  /* Text scale: enhance auto-scale button */
  function enhanceScale() {
    var btn = d.getElementById("meme-auto-scale");
    if (!btn || btn.__bcScale) return;
    btn.__bcScale = true;
    btn.addEventListener("click", function () {
      try {
        if (w.memeState) {
          /* gentle defaults if numeric scales exist */
          if (w.memeState.topScale == null) w.memeState.topScale = 42;
          if (w.memeState.midScale == null) w.memeState.midScale = 36;
          if (w.memeState.botScale == null) w.memeState.botScale = 32;
        }
        if (typeof w.memeDraw === "function") w.memeDraw();
        status("Text auto-scale applied");
      } catch (e) {}
    });
  }

  function boot() {
    installFetch();
    ensureExtraChips();
    wireChips();
    hookSources();
    enhanceScale();
    log("phase-bc boot");
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(boot, 100); setTimeout(boot, 600); });
  setInterval(function () {
    if (w.memeFetchBg !== fetchBg) installFetch();
  }, 2500);

  w.CraftMemePhaseBC = {
    fetchBg: fetchBg,
    sceneForText: sceneForText,
    surprise: surprise,
    log: function () { return LOG.slice(); }
  };
})(window, document);
