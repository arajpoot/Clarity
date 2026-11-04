/*! companion-meme-studio-fix-v1
 * 1) Move How-to + options rail ABOVE canvas
 * 2) Rewire all background chips to Shariah-safe Wikimedia pools
 * 3) Scene-per-verse: when text applied, pick matching safe scene
 * Educational only — not a fatwa. Scenery only · no prophet likeness.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_MEME_STUDIO_FIX_V1__) return;
  w.__CLARITY_MEME_STUDIO_FIX_V1__ = true;

  var LOG = (w.__MEME_STUDIO_FIX_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  /* ——— Shariah-safe pools (Wikimedia / same-origin only) ——— */
  var POOLS = {
    nature: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Green_pasture.jpg/1280px-Green_pasture.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Wadi_Rum_Jordan.jpg/1280px-Wadi_Rum_Jordan.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Desert_in_Qatar.jpg/1280px-Desert_in_Qatar.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Sand_dunes_in_the_Empty_Quarter.jpg/1280px-Sand_dunes_in_the_Empty_Quarter.jpg"
    ],
    mountains: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Wadi_Rum_Jordan.jpg/1280px-Wadi_Rum_Jordan.jpg"
    ],
    holy: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Masjid_al-Haram%2C_Mecca.jpg/1280px-Masjid_al-Haram%2C_Mecca.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Al-Masjid_an-Nabawi_as-from_top.jpg/1280px-Al-Masjid_an-Nabawi_as-from_top.jpg"
    ],
    night: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Night_sky_with_stars.jpg/1280px-Night_sky_with_stars.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Milky_Way_Arch.jpg/1280px-Milky_Way_Arch.jpg"
    ],
    water: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Ocean_waves.jpg/1280px-Ocean_waves.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Blue_Mediterranean_Sea.jpg/1280px-Blue_Mediterranean_Sea.jpg"
    ],
    flowers: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Field_of_flowers.jpg/1280px-Field_of_flowers.jpg"
    ],
    spirit: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Green_pasture.jpg/1280px-Green_pasture.jpg"
    ],
    galaxy: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Milky_Way_Arch.jpg/1280px-Milky_Way_Arch.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Night_sky_with_stars.jpg/1280px-Night_sky_with_stars.jpg"
    ],
    free: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Green_pasture.jpg/1280px-Green_pasture.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg"
    ],
    pattern: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Islamic_geometric_pattern.jpg/1280px-Islamic_geometric_pattern.jpg"
    ]
  };

  var ALIAS = {
    nature: "nature", flowers: "flowers", holy: "holy", spirit: "spirit",
    night: "night", water: "water", galaxy: "galaxy", free: "free",
    pattern: "pattern", flickr: "nature", dynamic: "nature", stock: "nature",
    commons: "holy", ai: "holy", "ai scene": "holy", "ai again": "nature",
    scene: "nature", mountains: "mountains", blank: "blank"
  };

  var idx = {};
  Object.keys(POOLS).forEach(function (k) { idx[k] = 0; });

  function blocked(url) {
    var u = String(url || "").toLowerCase();
    return !u || /picsum\.photos|loremflickr|images\.unsplash|source\.unsplash|placeholder/i.test(u);
  }
  function allowed(url) {
    var u = String(url || "").toLowerCase();
    return u.indexOf("upload.wikimedia.org") >= 0 || u.indexOf("clarity-dawah.fyi") >= 0;
  }

  function nextUrl(kind) {
    kind = ALIAS[String(kind || "nature").toLowerCase()] || "nature";
    if (kind === "blank") return null;
    var pool = POOLS[kind] || POOLS.nature;
    var i = idx[kind] || 0;
    var url = pool[i % pool.length];
    idx[kind] = i + 1;
    return url;
  }

  function status(msg) {
    var el = d.getElementById("meme-fetch-status");
    if (el) el.textContent = msg;
  }

  function loadUrl(url) {
    if (!url || blocked(url) || !allowed(url)) url = nextUrl("holy");
    status("Loading…");
    if (typeof w.memeLoadImageFromUrl === "function") {
      try {
        w.memeLoadImageFromUrl(url, "Could not load — try Holy");
        status("Background ready");
        return;
      } catch (e) {}
    }
    var im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = function () {
      try {
        if (!w.memeState) w.memeState = {};
        w.memeState.img = im;
        if (typeof w.memeDraw === "function") w.memeDraw();
      } catch (e) {}
      status("Background ready");
    };
    im.onerror = function () {
      var fb = nextUrl("holy");
      if (fb && fb !== url) loadUrl(fb);
      else status("Load failed — try Blank or Holy");
    };
    im.src = url;
  }

  function fetchBg(kind) {
    kind = String(kind || "nature").toLowerCase();
    var mapped = ALIAS[kind] || kind;
    if (mapped === "blank" || kind === "blank") {
      status("Blank");
      try {
        if (!w.memeState) w.memeState = {};
        w.memeState.img = null;
        if (typeof w.memeShowBlankPalette === "function") w.memeShowBlankPalette();
        else if (typeof w.memeDraw === "function") w.memeDraw();
      } catch (e) {}
      return;
    }
    log("bg " + kind + "→" + mapped);
    loadUrl(nextUrl(mapped));
  }

  function installFetch() {
    w.memeFetchBg = fetchBg;
    w.__memeOnlineFetch = fetchBg;
    w.memeFetchNature = function () { fetchBg("nature"); };
    w.memeFetchFlickr = function () { fetchBg("nature"); };
    w.memeLoadSample = function (k) { fetchBg(k || "holy"); };
    if (typeof w.clarityMemeDecorBg !== "function") {
      w.clarityMemeDecorBg = function (k) {
        fetchBg(k === "geometry" || k === "pattern" ? "pattern" : "holy");
      };
    }
  }

  /* ——— Scene per verse / message ——— */
  function moodFromText(blob) {
    blob = String(blob || "").toLowerCase();
    if (/ليل|night|darkness|stars|moon|قمر|سماء/.test(blob)) return "night";
    if (/بحر|water|river|sea|rain|مطر|نهر/.test(blob)) return "water";
    if (/جبل|mountain|طور|حجر|rock/.test(blob)) return "mountains";
    if (/جنّ|garden|flower|tree|زرع|نبات/.test(blob)) return "flowers";
    if (/كعب|مكّ|مكة|مدينة|مسجد|قبل|haram|kaaba|mosque|pray|صل/.test(blob)) return "holy";
    if (/موت|death|grave|آخر|hour|قيامة|fire|نار/.test(blob)) return "night";
    if (/شمس|sun|light|نور|dawn|فجر/.test(blob)) return "nature";
    return "nature";
  }

  function sceneForCanvasMessage(opts) {
    opts = opts || {};
    var top = "", mid = "", bot = "";
    try {
      if (w.memeState) {
        top = w.memeState.top || "";
        mid = w.memeState.mid || "";
        bot = w.memeState.bottom || "";
      }
    } catch (e) {}
    var blob = [top, mid, bot, opts.text || ""].join("\n");
    var mood = opts.mood || moodFromText(blob);
    log("scene-per-verse mood=" + mood);
    fetchBg(mood);
    status("Scene for message · " + mood);
  }

  w.clarityMemeSceneForVerse = sceneForCanvasMessage;

  /* Hook common apply paths */
  function wrap(name, after) {
    var prev = w[name];
    if (typeof prev !== "function") return;
    if (prev.__shariahWrapped) return;
    w[name] = function () {
      var r = prev.apply(this, arguments);
      try { after.apply(null, arguments); } catch (e) {}
      return r;
    };
    w[name].__shariahWrapped = true;
  }

  function installHooks() {
    wrap("memeFetchRrra", function () {
      setTimeout(function () { sceneForCanvasMessage({}); }, 120);
    });
    wrap("memeDailyVerse", function () {
      setTimeout(function () { sceneForCanvasMessage({}); }, 120);
    });
    /* Apply duā + bg buttons if present */
    d.querySelectorAll("[onclick*='Apply'], button").forEach(function (btn) {
      var t = (btn.textContent || "").toLowerCase();
      if (t.indexOf("apply + bg") >= 0 || t.indexOf("apply+bg") >= 0) {
        if (btn.__sceneBound) return;
        btn.__sceneBound = true;
        btn.addEventListener("click", function () {
          setTimeout(function () { sceneForCanvasMessage({}); }, 150);
        });
      }
    });
  }

  /* ——— Layout: How-to + scale/options ABOVE canvas ——— */
  function reorderStudio() {
    var root = d.getElementById("meme-studio-root");
    if (!root) return;

    var preview = root.querySelector(".meme-preview-only");
    var below = root.querySelector(".meme-below");
    if (!preview || !below) return;

    /* Collect rails to lift above canvas */
    var liftSelectors = [
      ".meme-howto",
      "#meme-howto",
      "[class*='how-to']",
      ".meme-guide",
      "#meme-scale-bar",
      ".meme-scale",
      ".meme-bar-scale",
      ".meme-options-rail",
      "#meme-options",
      ".meme-controls-primary"
    ];
    var lift = [];
    liftSelectors.forEach(function (sel) {
      root.querySelectorAll(sel).forEach(function (el) {
        if (lift.indexOf(el) < 0) lift.push(el);
      });
    });

    /* Also: first scale / outline style bars inside below that are not fetch bars */
    below.querySelectorAll(".meme-bar").forEach(function (bar) {
      var lab = (bar.querySelector(".meme-tool-label") || {}).textContent || "";
      lab = lab.toLowerCase();
      if (/scale|outline|how to|guide|options|format/.test(lab) && lift.indexOf(bar) < 0) {
        lift.push(bar);
      }
    });
    /* How-to details/summary blocks */
    below.querySelectorAll("details, .meme-help, .howto").forEach(function (el) {
      if (lift.indexOf(el) < 0) lift.push(el);
    });

    var mount = d.getElementById("meme-controls-above");
    if (!mount) {
      mount = d.createElement("div");
      mount.id = "meme-controls-above";
      mount.className = "meme-controls-above";
      preview.parentNode.insertBefore(mount, preview);
    }
    lift.forEach(function (el) {
      try { mount.appendChild(el); } catch (e) {}
    });

    /* Restyle bg bar labels — remove picsum/flickr promises */
    root.querySelectorAll(".mv-chip").forEach(function (btn) {
      var oc = btn.getAttribute("onclick") || "";
      var title = btn.getAttribute("title") || "";
      if (/flickr|picsum|free online/i.test(title) || /flickr/i.test(oc)) {
        btn.setAttribute("title", "Shariah-safe scenery · Wikimedia only");
      }
      if (/memeFetchBg\('flickr'\)/.test(oc)) {
        btn.setAttribute("onclick", "memeFetchBg('nature')");
        if (/Flickr/i.test(btn.textContent || "")) btn.textContent = "🌿 Nature+";
      }
      if (/memeFetchBg\('free'\)/.test(oc) && /Picsum/i.test(title)) {
        btn.setAttribute("title", "Free Wikimedia scenery · no people stock");
      }
    });

    log("reorder lift=" + lift.length);
  }

  var CSS = [
    "#meme-controls-above{display:flex;flex-direction:column;gap:0.4rem;margin:0.35rem 0 0.5rem;}",
    "#meme-controls-above .meme-bar{margin:0;}",
    "#meme-studio-root .meme-bar-bg{order:0;}",
    "#meme-controls-above{order:1;}",
    "#meme-studio-root .meme-preview-only{order:2;}",
    "#meme-studio-root.meme-realign{display:flex;flex-direction:column;}"
  ].join("\n");

  function injectCss() {
    if (d.getElementById("meme-studio-fix-css")) return;
    var s = d.createElement("style");
    s.id = "meme-studio-fix-css";
    s.textContent = CSS;
    (d.head || d.documentElement).appendChild(s);
  }

  function boot() {
    injectCss();
    installFetch();
    reorderStudio();
    installHooks();
    log("boot");
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(boot, 100);
    setTimeout(function () { installFetch(); reorderStudio(); installHooks(); }, 600);
  });
  d.addEventListener("clarity-core-ready", function () {
    setTimeout(function () { installFetch(); installHooks(); }, 50);
  });
  setInterval(function () {
    if (w.memeFetchBg !== fetchBg) { log("reclaim"); installFetch(); }
  }, 2500);

  w.ClarityMemeStudioFix = {
    fetchBg: fetchBg,
    sceneForVerse: sceneForCanvasMessage,
    reorder: reorderStudio,
    log: function () { return LOG.slice(); }
  };
})(window, document);
