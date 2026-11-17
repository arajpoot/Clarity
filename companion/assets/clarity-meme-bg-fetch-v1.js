/*! clarity-meme-bg-fetch-v1 · P35 Shariah scenery-only · educational only */
(function (g) {
  "use strict";
  g.__CLARITY_MEME_BG_FETCH_V1__ = true;
  g.__CLARITY_MEME_BG_FETCH_P35__ = true;

  function setStatus(msg) {
    var el = document.getElementById("meme-fetch-status") || document.getElementById("meme-rrra-status");
    if (el) el.textContent = msg || "";
  }

  /* Curated Wikimedia only — architecture / landscape / sky / flora. No random stock (avoids people). */
  var CATALOG = {"holy": ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg/1280px-Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg"], "nature": ["https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Half_Dome_from_Glacier_Point%2C_Yosemite_NP_-_Diliff.jpg/1024px-Half_Dome_from_Glacier_Point%2C_Yosemite_NP_-_Diliff.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Desert_landscape_in_Wadi_Rum.jpg/1280px-Desert_landscape_in_Wadi_Rum.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Sahara_desert.jpg/1280px-Sahara_desert.jpg"], "night": ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Stars_of_the_Milky_Way.jpg/1280px-Stars_of_the_Milky_Way.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Night_in_the_desert.jpg/1280px-Night_in_the_desert.jpg"], "water": ["https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/20100726_Lake_Mapourika_02.jpg/1280px-20100726_Lake_Mapourika_02.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Waves_in_pacifica_1.jpg/1280px-Waves_in_pacifica_1.jpg"], "flowers": ["https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Tulip_clumps_Kurume.jpg/1280px-Tulip_clumps_Kurume.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Field_of_sunflowers.jpg/1280px-Field_of_sunflowers.jpg"], "spirit": ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Sahara_desert.jpg/1280px-Sahara_desert.jpg"], "free": ["https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Half_Dome_from_Glacier_Point%2C_Yosemite_NP_-_Diliff.jpg/1024px-Half_Dome_from_Glacier_Point%2C_Yosemite_NP_-_Diliff.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Desert_landscape_in_Wadi_Rum.jpg/1280px-Desert_landscape_in_Wadi_Rum.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Sahara_desert.jpg/1280px-Sahara_desert.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg/1280px-Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg"], "dynamic": ["https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Half_Dome_from_Glacier_Point%2C_Yosemite_NP_-_Diliff.jpg/1024px-Half_Dome_from_Glacier_Point%2C_Yosemite_NP_-_Diliff.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Desert_landscape_in_Wadi_Rum.jpg/1280px-Desert_landscape_in_Wadi_Rum.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Sahara_desert.jpg/1280px-Sahara_desert.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg/1280px-Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg"], "flickr": ["https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Half_Dome_from_Glacier_Point%2C_Yosemite_NP_-_Diliff.jpg/1024px-Half_Dome_from_Glacier_Point%2C_Yosemite_NP_-_Diliff.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Desert_landscape_in_Wadi_Rum.jpg/1280px-Desert_landscape_in_Wadi_Rum.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Sahara_desert.jpg/1280px-Sahara_desert.jpg"], "galaxy": ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Stars_of_the_Milky_Way.jpg/1280px-Stars_of_the_Milky_Way.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Night_in_the_desert.jpg/1280px-Night_in_the_desert.jpg"]};

  var idx = {};
  function nextUrl(kind) {
    var list = CATALOG[kind] || CATALOG.nature;
    idx[kind] = idx[kind] || 0;
    var u = list[idx[kind] % list.length];
    idx[kind]++;
    return u;
  }
  function ensureState() {
    if (!g.memeState || typeof g.memeState !== "object") g.memeState = {};
    return g.memeState;
  }
  function paintAll() {
    try { if (typeof g.memeDraw === "function") g.memeDraw(); } catch (e) {}
    try { if (typeof g.paintMeme === "function") g.paintMeme(); } catch (e2) {}
    try {
      if (g.ClarityMemeStudio && typeof g.ClarityMemeStudio.paintLocal === "function")
        g.ClarityMemeStudio.paintLocal();
    } catch (e3) {}
  }
  function loadUrl(url, label) {
    return new Promise(function (resolve) {
      if (!url) { resolve(false); return; }
      /* block obvious non-scenery hosts */
      if (/unsplash|picsum|pexels|shutterstock|getty/i.test(url)) {
        setStatus("blocked non-scenery source");
        resolve(false);
        return;
      }
      setStatus((label || "BG") + " · fetching…");
      var img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function () {
        var s = ensureState();
        s.bgImage = img;
        s.img = img;
        setStatus((label || "BG") + " · ok · scenery");
        paintAll();
        setTimeout(paintAll, 100);
        setTimeout(paintAll, 400);
        resolve(true);
      };
      img.onerror = function () {
        setStatus((label || "BG") + " · failed · next");
        resolve(false);
      };
      img.src = url;
    });
  }
  async function onlineFetch(kind) {
    kind = String(kind || "nature").toLowerCase();
    if (kind === "blank") {
      var s = ensureState();
      s.bgImage = null; s.img = null;
      var c = document.getElementById("meme-canvas");
      if (c) {
        var ctx = c.getContext("2d");
        ctx.fillStyle = "#0f4c3a";
        ctx.fillRect(0, 0, c.width, c.height);
      }
      setStatus("blank · ok");
      paintAll();
      return;
    }
    if (kind === "mosque") kind = "holy";
    if (kind === "geometry" || kind === "pattern" || kind === "ai-geo") kind = "nature";
    if (kind === "ai") kind = "dynamic";
    var key = CATALOG[kind] ? kind : "nature";
    var n = (CATALOG[key] || []).length || 1;
    for (var i = 0; i < n; i++) {
      var ok = await loadUrl(nextUrl(key), key);
      if (ok) return true;
    }
    /* final safe fallback: solid green — never random people stock */
    setStatus(key + " · fallback solid (safe)");
    var s2 = ensureState();
    s2.bgImage = null; s2.img = null;
    paintAll();
    return false;
  }
  g.memeFetchBg = function (k) { return onlineFetch(k); };
  g.clarityMemeAiBg = function (mode) { return onlineFetch(mode || "dynamic"); };
  g.clarityMemeDecorBg = function (mode) {
    if (mode === "mosque") return onlineFetch("holy");
    return onlineFetch("nature");
  };
  g.memeFetchNature = function () { return onlineFetch("nature"); };
  g.__memeOnlineFetch = onlineFetch;
  setStatus("Background · Shariah scenery catalog");
})(typeof window !== "undefined" ? window : this);
