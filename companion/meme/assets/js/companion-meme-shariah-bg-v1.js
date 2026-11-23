/*! companion-meme-shariah-bg-v1
 * Contract: scenery / architecture / night sky / geometric only.
 * NO random people stock (picsum/unsplash portrait pools).
 * NO figurative portraits as meme backgrounds.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_MEME_SHARIAH_BG_V1__) return;
  w.__CLARITY_MEME_SHARIAH_BG_V1__ = true;

  var LOG = (w.__MEME_SHARIAH_BG_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  /* Curated Wikimedia-only pools — landscapes, sacred architecture, sky, water, pattern.
     Avoid human-focused portrait photography. */
  var POOLS = {
    nature: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Green_pasture.jpg/1280px-Green_pasture.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Sand_dunes_in_the_Empty_Quarter.jpg/1280px-Sand_dunes_in_the_Empty_Quarter.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Desert_in_Qatar.jpg/1280px-Desert_in_Qatar.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Wadi_Rum_Jordan.jpg/1280px-Wadi_Rum_Jordan.jpg"
    ],
    holy: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Masjid_al-Haram%2C_Mecca.jpg/1280px-Masjid_al-Haram%2C_Mecca.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Al-Masjid_an-Nabawi_as-from_top.jpg/1280px-Al-Masjid_an-Nabawi_as-from_top.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Masjid_al-Nabawi_Gates.jpg/1280px-Masjid_al-Nabawi_Gates.jpg"
    ],
    night: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Night_sky_with_stars.jpg/1280px-Night_sky_with_stars.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Milky_Way_Arch.jpg/1280px-Milky_Way_Arch.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Starsinthesky.jpg/1280px-Starsinthesky.jpg"
    ],
    water: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Ocean_waves.jpg/1280px-Ocean_waves.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Blue_Mediterranean_Sea.jpg/1280px-Blue_Mediterranean_Sea.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Calm_sea.jpg/1280px-Calm_sea.jpg"
    ],
    flowers: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Field_of_flowers.jpg/1280px-Field_of_flowers.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Olive_grove.jpg/1280px-Olive_grove.jpg"
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
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Islamic_geometric_pattern.jpg/1280px-Islamic_geometric_pattern.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Green_pasture.jpg/1280px-Green_pasture.jpg"
    ],
    pattern: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Islamic_geometric_pattern.jpg/1280px-Islamic_geometric_pattern.jpg"
    ]
  };

  /* Map UI pill aliases */
  var ALIAS = {
    nature: "nature",
    flowers: "flowers",
    holy: "holy",
    spirit: "spirit",
    night: "night",
    water: "water",
    galaxy: "galaxy",
    free: "free",
    pattern: "pattern",
    blank: "blank",
    dynamic: "nature",
    stock: "nature",
    flickr: "nature",
    commons: "holy",
    "ai scene": "holy",
    ai: "holy",
    "ai again": "nature",
    scene: "nature"
  };

  var idx = {};
  Object.keys(POOLS).forEach(function (k) { idx[k] = 0; });

  function blockedHost(url) {
    var u = String(url || "").toLowerCase();
    if (!u) return true;
    if (u.indexOf("picsum.photos") >= 0) return true;
    if (u.indexOf("loremflickr") >= 0) return true;
    if (u.indexOf("placeholder") >= 0) return true;
    /* unsplash random portrait risk — only allow if we later add allowlisted IDs; default block */
    if (u.indexOf("images.unsplash.com") >= 0) return true;
    if (u.indexOf("source.unsplash.com") >= 0) return true;
    return false;
  }

  function allowHost(url) {
    var u = String(url || "").toLowerCase();
    if (u.indexOf("upload.wikimedia.org") >= 0) return true;
    if (u.indexOf("clarity-dawah.fyi") >= 0) return true;
    return false;
  }

  function nextUrl(kind) {
    kind = ALIAS[String(kind || "nature").toLowerCase()] || "nature";
    if (kind === "blank") return null;
    var pool = POOLS[kind] || POOLS.nature;
    if (!pool.length) pool = POOLS.holy;
    var i = idx[kind] || 0;
    var url = pool[i % pool.length];
    idx[kind] = i + 1;
    return url;
  }

  function status(msg) {
    var el = d.getElementById("meme-bg-status") || d.querySelector("[data-meme-bg-status]");
    if (el) el.textContent = msg;
  }

  function loadUrl(url) {
    if (!url || blockedHost(url) || !allowHost(url)) {
      log("blocked " + url);
      url = nextUrl("holy");
    }
    status("Loading…");
    if (typeof w.memeLoadImageFromUrl === "function") {
      try {
        w.memeLoadImageFromUrl(url, "Could not load — try Holy or Nature");
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
        else if (typeof w.clarityMemeUiSync === "function") w.clarityMemeUiSync();
      } catch (e) {}
      status("Background ready");
      log("ok");
    };
    im.onerror = function () {
      log("fail " + url);
      var fallback = nextUrl("holy");
      if (fallback && fallback !== url) loadUrl(fallback);
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
    var url = nextUrl(mapped);
    log("fetch " + kind + " → " + mapped);
    loadUrl(url);
  }

  function install() {
    w.memeFetchBg = fetchBg;
    w.__memeOnlineFetch = fetchBg;
    w.memeFetchNature = function () { fetchBg("nature"); };
    w.memeFetchFlickr = function () { fetchBg("nature"); };
    w.memeLoadSample = function (key) { fetchBg(key || "holy"); };
    /* expose allowlist for audits */
    w.ClarityMemeShariahBg = {
      pools: POOLS,
      blockedHost: blockedHost,
      fetch: fetchBg,
      log: function () { return LOG.slice(); }
    };
    log("installed");
  }

  install();
  /* Re-assert after late core/packs */
  d.addEventListener("clarity-core-ready", function () { setTimeout(install, 30); });
  w.addEventListener("clarity-a2-spine-ready", function () { setTimeout(install, 30); });
  w.addEventListener("load", function () { setTimeout(install, 100); setTimeout(install, 800); });
  setInterval(function () {
    if (w.memeFetchBg !== fetchBg) {
      log("reclaim");
      install();
    }
  }, 2500);
})(window, document);
