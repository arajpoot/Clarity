/*! craft-meme-studio-enrich-v1 · C16 · from companion studio fix
 * Shariah: block people/animals random stock — allow scenery, sky, water, architecture.
 * Curated Unsplash IDs (fixed photos, not random) + Wikimedia when available.
 * Soft fail → solid green (no alert spam). Layout: controls above canvas.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_STUDIO_ENRICH_C16__) return;
  w.__CRAFT_MEME_STUDIO_ENRICH_C16__ = true;
  w.__CRAFT_MEME_STUDIO_ENRICH_C16_LEGACY__ = true;

  var LOG = (w.__MEME_STUDIO_FIX_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  function govScanUrl(url, meta) {
    if (typeof w.clarityShariahScanUrl !== "function") {
      status("Shariah scan unavailable — refusing unscoped load");
      return false;
    }
    var r = w.clarityShariahScanUrl(url, meta || "");
    if (!r.ok) {
      status("Skipped non-compliant (" + (r.reason || "blocked") + ")");
      return false;
    }
    return true;
  }
  function loadScanned(url, onOk) {
    if (!url || !govScanUrl(url, "")) return;
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      try {
        if (w.memeState) { w.memeState.img = img; w.memeState.bgImage = img; }
      } catch (e) {}
      if (typeof onOk === "function") onOk(img);
      try {
        if (typeof w.__craftMemePaint === "function") w.__craftMemePaint();
      } catch (e2) {}
      /* bridge apply if present */
      try {
        var ev = new CustomEvent("craft-meme-bg-loaded", { detail: { img: img } });
        d.dispatchEvent(ev);
      } catch (e3) {}
      status("Background ready · scanned");
    };
    img.onerror = function () { status("BG failed · try another"); };
    img.src = url;
  }


  /* Fixed photo IDs — landscapes / architecture / sky / water only (no portrait queries) */
  var U = function (id) {
    return "https://images.unsplash.com/" + id + "?auto=format&fit=crop&w=1600&q=80";
  };
  var W = function (path) {
    return "https://upload.wikimedia.org/wikipedia/commons/" + path;
  };

  var POOLS = {
    nature: [
      U("photo-1506905925346-21bda4d32df4"), /* mountains */
      U("photo-1441974231531-c6227db76b6e"), /* forest path canopy */
      U("photo-1470071451329-d1ea785c8c7d"), /* misty hills */
      U("photo-1464822759023-fed622ff2c3b"), /* mountain peaks */
      W("thumb/6/6d/Desert_in_Qatar.jpg/1280px-Desert_in_Qatar.jpg")
    ],
    mountains: [
      U("photo-1506905925346-21bda4d32df4"),
      U("photo-1464822759023-fed622ff2c3b"),
      U("photo-1519681393784-d120267933ba")
    ],
    holy: [
      U("photo-1564769625905-50e93615e769"), /* haram area architecture */
      U("photo-1591604129939-f1efa4d9f7fa"),
      U("photo-1519817650390-64a5db1d0498"),
      W("thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg"),
      W("thumb/c/c8/Masjid_al-Haram%2C_Mecca.jpg/1280px-Masjid_al-Haram%2C_Mecca.jpg")
    ],
    night: [
      U("photo-1419242902214-272b3f66ee7a"), /* stars */
      U("photo-1507272931001-fc06c17e4f43"), /* night sky */
      U("photo-1475274047050-1d0c0975c63e")
    ],
    water: [
      U("photo-1505142468610-359e7d316be0"), /* ocean */
      U("photo-1439066615861-d1af74d74000"), /* lake */
      U("photo-1507525428034-b723cf961d3e")  /* beach seascape */
    ],
    flowers: [
      U("photo-1490750967916-d7429ed35a8e"), /* field flowers wide */
      U("photo-1462275646964-a0e7786cbe5a")
    ],
    spirit: [
      U("photo-1564769625905-50e93615e769"),
      U("photo-1506905925346-21bda4d32df4"),
      U("photo-1470071451329-d1ea785c8c7d")
    ],
    galaxy: [
      U("photo-1419242902214-272b3f66ee7a"),
      U("photo-1462331940025-496dfbfc7564"),
      U("photo-1516339901601-2e1b62dc0c45")
    ],
    free: [
      U("photo-1506905925346-21bda4d32df4"),
      U("photo-1441974231531-c6227db76b6e"),
      U("photo-1564769625905-50e93615e769")
    ],
    pattern: [
      U("photo-1564769625905-50e93615e769"),
      U("photo-1519817650390-64a5db1d0498")
    ]
  };

  var ALIAS = {
    nature: "nature", flowers: "flowers", holy: "holy", spirit: "spirit",
    night: "night", water: "water", galaxy: "galaxy", free: "free",
    pattern: "pattern", flickr: "nature", dynamic: "nature", stock: "nature",
    commons: "holy", ai: "nature", "ai scene": "nature", "ai again": "nature",
    scene: "nature", mountains: "mountains", blank: "blank", decor: "holy"
  };

  var idx = {};
  Object.keys(POOLS).forEach(function (k) { idx[k] = 0; });

  /** Block only random/people/animal stock endpoints — not all remote images */
  function blocked(url) {
    var u = String(url || "").toLowerCase();
    if (!u) return true;
    if (/picsum\.photos/.test(u)) return true;
    if (/loremflickr/.test(u)) return true; /* often animals */
    if (/source\.unsplash\.com/.test(u)) return true; /* random */
    if (/placekitten|placeimg|fakeimg|placeholder\.com/.test(u)) return true;
    if (/thispersondoesnotexist|generated\.photos/.test(u)) return true;
    return false;
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

  function paintSolid() {
    try {
      if (!w.memeState) w.memeState = {};
      w.memeState.img = null;
      var c = d.getElementById("meme-canvas");
      if (c && c.getContext) {
        if (c.width < 100) { c.width = 1200; c.height = 675; }
        var ctx = c.getContext("2d");
        var g = ctx.createLinearGradient(0, 0, c.width, c.height);
        g.addColorStop(0, "#0f4c3a");
        g.addColorStop(1, "#1a2a22");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, c.width, c.height);
      }
      if (typeof w.memeDraw === "function") w.memeDraw();
    } catch (e) {}
  }

  function loadUrl(url, attempt) {
    attempt = attempt || 0;
    if (!url || blocked(url)) {
      if (attempt < 3) return loadUrl(nextUrl("nature"), attempt + 1);
      status("Using solid background");
      paintSolid();
      return;
    }
    status("Loading…");

    /* Prefer silent loader — avoid core alert() on error */
    var im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = function () {
      try {
        if (!w.memeState) w.memeState = {};
        w.memeState.img = im;
        if (typeof w.memeDraw === "function") w.memeDraw();
        else if (typeof w.clarityMemeUiSync === "function") w.clarityMemeUiSync();
        else {
          var c = d.getElementById("meme-canvas");
          if (c && c.getContext) {
            if (c.width < 100) { c.width = 1200; c.height = 675; }
            c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
          }
        }
      } catch (e) { log("paint " + e); }
      status("Background ready");
      log("ok " + url.slice(0, 60));
    };
    im.onerror = function () {
      log("fail " + url.slice(0, 60));
      if (attempt < 4) loadUrl(nextUrl("nature"), attempt + 1);
      else {
        status("Using solid background");
        paintSolid();
      }
    };
    im.src = url;
  }

  function fetchBg(kind) {
    kind = String(kind || "nature").toLowerCase();
    var mapped = ALIAS[kind] || kind;
    if (mapped === "blank" || kind === "blank") {
      status("Blank");
      paintSolid();
      try {
        if (typeof w.memeShowBlankPalette === "function") w.memeShowBlankPalette();
      } catch (e) {}
      return;
    }
    log("bg " + kind + "→" + mapped);
    loadUrl(nextUrl(mapped), 0);
  }

  function installFetch() {
    w.memeFetchBg = fetchBg;
    w.__memeOnlineFetch = fetchBg;
    w.memeFetchNature = function () { fetchBg("nature"); };
    w.memeFetchFlickr = function () { fetchBg("nature"); };
    w.memeLoadSample = function (k) { fetchBg(k || "nature"); };
    w.clarityMemeDecorBg = function (k) {
      fetchBg(k === "geometry" || k === "pattern" ? "pattern" : "holy");
    };
    /* Mute noisy core alert on bg fail */
    if (typeof w.memeLoadImageFromUrl === "function" && !w.memeLoadImageFromUrl.__soft) {
      var prev = w.memeLoadImageFromUrl;
      w.memeLoadImageFromUrl = function (url, onFailMsg) {
        if (blocked(url)) {
          fetchBg("nature");
          return;
        }
        try {
          return prev.call(this, url, null); /* null → less alert spam in some builds */
        } catch (e) {
          loadUrl(url, 0);
        }
      };
      w.memeLoadImageFromUrl.__soft = true;
    }
  }

  /* Scene per verse */
  function moodFromText(blob) {
    blob = String(blob || "").toLowerCase();
    if (/ليل|night|darkness|stars|moon|قمر/.test(blob)) return "night";
    if (/بحر|water|river|sea|rain|مطر|نهر/.test(blob)) return "water";
    if (/جبل|mountain|طور/.test(blob)) return "mountains";
    if (/جنّ|garden|flower|tree|زرع/.test(blob)) return "flowers";
    if (/كعب|مكّ|مكة|مدينة|مسجد|haram|kaaba|mosque|صل/.test(blob)) return "holy";
    if (/موت|death|grave|قيامة|نار|fire/.test(blob)) return "night";
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
    var mood = opts.mood || moodFromText([top, mid, bot, opts.text || ""].join("\n"));
    fetchBg(mood);
  }
  w.clarityMemeSceneForVerse = sceneForCanvasMessage;

  function wrap(name) {
    var prev = w[name];
    if (typeof prev !== "function" || prev.__shariahWrapped) return;
    w[name] = function () {
      var r = prev.apply(this, arguments);
      setTimeout(function () { sceneForCanvasMessage({}); }, 150);
      return r;
    };
    w[name].__shariahWrapped = true;
  }

  /* Layout: how-to + scale above canvas */
  function reorderStudio() {
    var root = d.getElementById("meme-studio-root");
    if (!root) return;
    var preview = root.querySelector(".meme-preview-only");
    var below = root.querySelector(".meme-below");
    if (!preview || !below) return;
    var mount = d.getElementById("meme-controls-above");
    if (!mount) {
      mount = d.createElement("div");
      mount.id = "meme-controls-above";
      mount.className = "meme-controls-above";
      preview.parentNode.insertBefore(mount, preview);
    }
    below.querySelectorAll(".meme-bar").forEach(function (bar) {
      var lab = ((bar.querySelector(".meme-tool-label") || {}).textContent || "").toLowerCase();
      if (/scale|outline|how to|guide|options|format/.test(lab)) {
        try { mount.appendChild(bar); } catch (e) {}
      }
    });
    below.querySelectorAll("details, .meme-howto, .meme-help").forEach(function (el) {
      try { mount.appendChild(el); } catch (e) {}
    });
    /* Retarget risky chip labels */
    root.querySelectorAll(".mv-chip").forEach(function (btn) {
      var oc = btn.getAttribute("onclick") || "";
      if (/memeFetchBg\('flickr'\)/.test(oc)) {
        btn.setAttribute("onclick", "memeFetchBg('nature')");
        btn.setAttribute("title", "Nature scenery (safe)");
      }
      if (/Picsum/i.test(btn.getAttribute("title") || "")) {
        btn.setAttribute("title", "Scenery catalogue · no people/animal stock");
      }
    });
    log("reorder");
  }

  function injectCss() {
    if (d.getElementById("meme-studio-fix-css")) return;
    var s = d.createElement("style");
    s.id = "meme-studio-fix-css";
    s.textContent = [
      "#meme-controls-above{display:flex;flex-direction:column;gap:0.4rem;margin:0.35rem 0 0.5rem;}",
      "#meme-studio-root.meme-realign{display:flex;flex-direction:column;}"
    ].join("");
    (d.head || d.documentElement).appendChild(s);
  }

  function boot() {
    injectCss();
    installFetch();
    reorderStudio();
    wrap("memeFetchRrra");
    wrap("memeDailyVerse");
    log("boot-v2");
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(boot, 80);
    setTimeout(function () { installFetch(); }, 500);
  });
  d.addEventListener("clarity-core-ready", function () {
    setTimeout(installFetch, 40);
  });
  setInterval(function () {
    if (w.memeFetchBg !== fetchBg) installFetch();
  }, 2000);

  w.ClarityMemeStudioFix = {
    fetchBg: fetchBg,
    sceneForVerse: sceneForCanvasMessage,
    pools: POOLS,
    log: function () { return LOG.slice(); }
  };

  /* C16 craft aliases */
  w.craftMemeStudioEnrich = {
    version: "C16",
    pools: typeof POOLS !== "undefined" ? POOLS : null,
    loadScanned: typeof loadScanned === "function" ? loadScanned : null
  };
  /* Prefer scanned fetch for chip kinds */
  var _fetch = w.__memeOnlineFetch;
  w.__memeOnlineFetch = function (kind) {
    kind = String(kind || "nature").toLowerCase();
    try {
      if (typeof POOLS !== "undefined" && POOLS[kind] && POOLS[kind].length) {
        var url = POOLS[kind][Math.floor(Math.random() * POOLS[kind].length)];
        if (typeof loadScanned === "function") {
          loadScanned(url, function (img) {
            try {
              if (w.memeState) w.memeState.img = img;
            } catch (e) {}
          });
          return;
        }
      }
    } catch (e) {}
    if (typeof _fetch === "function" && !_fetch._craftEnrichWrapped) {
      try { return _fetch(kind); } catch (e2) {}
    }
  };
  w.__memeOnlineFetch._craftEnrichWrapped = true;
  w.memeFetchBg = w.__memeOnlineFetch;
})(window, document);
