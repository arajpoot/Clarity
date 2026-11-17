/*! clarity-meme-bg-fetch-v1 · P36 HARD block people-stock · educational only */
(function (g) {
  "use strict";
  g.__CLARITY_MEME_BG_FETCH_V1__ = true;
  g.__CLARITY_MEME_BG_FETCH_P36__ = true;

  function setStatus(msg) {
    var el = document.getElementById("meme-fetch-status") || document.getElementById("meme-rrra-status");
    if (el) el.textContent = msg || "";
  }

  var CATALOG = {"holy": ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg/1280px-Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg"], "nature": ["https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Sahara_desert.jpg/1280px-Sahara_desert.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Desert_landscape_in_Wadi_Rum.jpg/1280px-Desert_landscape_in_Wadi_Rum.jpg"], "night": ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Stars_of_the_Milky_Way.jpg/1280px-Stars_of_the_Milky_Way.jpg"], "water": ["https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/20100726_Lake_Mapourika_02.jpg/1280px-20100726_Lake_Mapourika_02.jpg"], "flowers": ["https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Tulip_clumps_Kurume.jpg/1280px-Tulip_clumps_Kurume.jpg"], "spirit": ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg/1280px-Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Sahara_desert.jpg/1280px-Sahara_desert.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Desert_landscape_in_Wadi_Rum.jpg/1280px-Desert_landscape_in_Wadi_Rum.jpg"], "free": ["https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Sahara_desert.jpg/1280px-Sahara_desert.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Desert_landscape_in_Wadi_Rum.jpg/1280px-Desert_landscape_in_Wadi_Rum.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg/1280px-Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg"], "dynamic": ["https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Sahara_desert.jpg/1280px-Sahara_desert.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Desert_landscape_in_Wadi_Rum.jpg/1280px-Desert_landscape_in_Wadi_Rum.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg/1280px-Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg"], "flickr": ["https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Sahara_desert.jpg/1280px-Sahara_desert.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Desert_landscape_in_Wadi_Rum.jpg/1280px-Desert_landscape_in_Wadi_Rum.jpg"], "galaxy": ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Stars_of_the_Milky_Way.jpg/1280px-Stars_of_the_Milky_Way.jpg"]};
  var idx = {};

  function isAllowedUrl(url) {
    if (!url || typeof url !== "string") return false;
    var u = url.toLowerCase();
    /* HARD BLOCK — stock / random / social CDNs that serve people */
    if (/unsplash|blocked-picsum|pexels|pixabay|shutterstock|getty|istock|adobe\.ly|flickr\.com\/photos|i\.imgur|reddit|tiktok|instagram|facebook|googleusercontent|ytimg|twimg/i.test(u))
      return false;
    /* ALLOW only Wikimedia Commons uploads */
    if (u.indexOf("upload.wikimedia.org") === 0 || u.indexOf("https://upload.wikimedia.org/") === 0)
      return true;
    if (/upload\.wikimedia\.org/.test(u)) return true;
    return false;
  }

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

  /** Drop any stuck non-compliant image already in memory */
  function purgeUnsafeState() {
    var s = ensureState();
    var img = s.bgImage || s.img;
    var src = "";
    try { src = (img && (img.src || img.currentSrc)) || s._bgUrl || ""; } catch (e) {}
    if (src && !isAllowedUrl(src)) {
      s.bgImage = null;
      s.img = null;
      s._bgUrl = "";
      setStatus("removed non-compliant background");
      return true;
    }
    if (src && isAllowedUrl(src)) return false;
    /* no src but image object from opaque stock — clear anyway if _bgUrl bad */
    if (s._bgUrl && !isAllowedUrl(s._bgUrl)) {
      s.bgImage = null; s.img = null; s._bgUrl = "";
      return true;
    }
    return false;
  }

  function paintAll() {
    purgeUnsafeState();
    try { if (typeof g.memeDraw === "function") g.memeDraw(); } catch (e) {}
    try { if (typeof g.paintMeme === "function") g.paintMeme(); } catch (e2) {}
    try {
      if (g.ClarityMemeStudio && typeof g.ClarityMemeStudio.paintLocal === "function")
        g.ClarityMemeStudio.paintLocal();
    } catch (e3) {}
  }

  function loadUrl(url, label) {
    return new Promise(function (resolve) {
      if (!isAllowedUrl(url)) {
        setStatus("blocked · not scenery source");
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
        s._bgUrl = url;
        setStatus((label || "BG") + " · ok · compliant");
        paintAll();
        setTimeout(paintAll, 120);
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
    purgeUnsafeState();
    kind = String(kind || "nature").toLowerCase();
    if (kind === "blank") {
      var s = ensureState();
      s.bgImage = null; s.img = null; s._bgUrl = "";
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
    /* safe solid — never stock photo CDN */
    var s2 = ensureState();
    s2.bgImage = null; s2.img = null; s2._bgUrl = "";
    setStatus(key + " · safe solid (no people source)");
    paintAll();
    return false;
  }

  /* Monkey-patch any older memeFetchBg that might still be present */
  g.memeFetchBg = function (k) { return onlineFetch(k); };
  g.clarityMemeAiBg = function (mode) { return onlineFetch(mode || "dynamic"); };
  g.clarityMemeDecorBg = function (mode) {
    if (mode === "mosque") return onlineFetch("holy");
    return onlineFetch("nature");
  };
  g.memeFetchNature = function () { return onlineFetch("nature"); };
  g.__memeOnlineFetch = onlineFetch;
  g.ClarityMemeBgGuard = { isAllowedUrl: isAllowedUrl, purgeUnsafeState: purgeUnsafeState };

  /* On load: purge stuck people image from previous session */
  function bootGuard() {
    if (purgeUnsafeState()) paintAll();
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", bootGuard);
  else bootGuard();
  setTimeout(bootGuard, 300);
  setTimeout(bootGuard, 1200);

  setStatus("Background · Wikimedia scenery only · people/stock blocked");
})(typeof window !== "undefined" ? window : this);
