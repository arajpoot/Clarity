/*! clarity-meme-bg-fetch-v1 · P37 scenery exemption · block random people stock · educational only */
(function (g) {
  "use strict";
  g.__CLARITY_MEME_BG_FETCH_V1__ = true;
  g.__CLARITY_MEME_BG_FETCH_P37__ = true;

  function setStatus(msg) {
    var el = document.getElementById("meme-fetch-status") || document.getElementById("meme-rrra-status");
    if (el) el.textContent = msg || "";
  }

  var CATALOG = {"holy": ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg", "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1580418827493-f2b22c0a76cd?auto=format&fit=crop&w=1280&q=80"], "nature": ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1280&q=80"], "night": ["https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1280&q=80"], "water": ["https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1280&q=80"], "flowers": ["https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1462275646964-a0e2d0693f7d?auto=format&fit=crop&w=1280&q=80"], "spirit": ["https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1280&q=80"], "free": ["https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1280&q=80", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg"], "dynamic": ["https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1280&q=80", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg"], "flickr": ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1280&q=80"], "galaxy": ["https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1280&q=80"]};
  var ALLOW_SUB = ["upload.wikimedia.org", "photo-1506905925346", "photo-1469474968028", "photo-1441974231531", "photo-1470071459604", "photo-1419242902214", "photo-1519681393784", "photo-1505142468610", "photo-1439066615861", "photo-1490750967868", "photo-1462275646964", "photo-1564769625905", "photo-1580418827493"];
  var idx = {};

  function isAllowedUrl(url) {
    if (!url || typeof url !== "string") return false;
    var u = url.toLowerCase();
    /* HARD BLOCK random/people-prone feeds */
    if (/picsum\.photos|pexels\.com|pixabay\.com|shutterstock|gettyimages|istockphoto/i.test(u))
      return false;
    /* generic unsplash without known landscape id — block */
    if (/unsplash\.com/i.test(u)) {
      for (var i = 0; i < ALLOW_SUB.length; i++) {
        if (u.indexOf(String(ALLOW_SUB[i]).toLowerCase()) >= 0) return true;
      }
      return false;
    }
    if (/upload\.wikimedia\.org/i.test(u)) return true;
    for (var j = 0; j < ALLOW_SUB.length; j++) {
      if (u.indexOf(String(ALLOW_SUB[j]).toLowerCase()) >= 0) return true;
    }
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

  function paintAll() {
    try {
      if (g.ClarityMemeStudio && typeof g.ClarityMemeStudio.paintLocal === "function")
        g.ClarityMemeStudio.paintLocal();
    } catch (e) {}
    try { if (typeof g.paintMeme === "function") g.paintMeme(); } catch (e2) {}
    try { if (typeof g.memeDraw === "function") g.memeDraw(); } catch (e3) {}
  }

  function loadUrl(url, label) {
    return new Promise(function (resolve) {
      if (!isAllowedUrl(url)) {
        setStatus("blocked · not a scenery source");
        resolve(false);
        return;
      }
      setStatus((label || "BG") + " · fetching…");
      var triedCors = false;
      function attempt(useCors) {
        var img = new Image();
        if (useCors) img.crossOrigin = "anonymous";
        img.onload = function () {
          if (!img.naturalWidth) {
            setStatus((label || "BG") + " · empty frame");
            resolve(false);
            return;
          }
          var s = ensureState();
          s.bgImage = img;
          s.img = img;
          s._bgUrl = url;
          setStatus((label || "BG") + " · displayed");
          paintAll();
          setTimeout(paintAll, 60);
          setTimeout(paintAll, 250);
          resolve(true);
        };
        img.onerror = function () {
          if (useCors && !triedCors) {
            triedCors = true;
            attempt(false); /* retry without CORS for display */
            return;
          }
          setStatus((label || "BG") + " · failed · next");
          resolve(false);
        };
        img.src = url;
      }
      attempt(true);
    });
  }

  async function onlineFetch(kind) {
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
      return true;
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
    setStatus(key + " · all sources failed");
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
  g.ClarityMemeBgGuard = { isAllowedUrl: isAllowedUrl, version: "P37" };

  setStatus("Background · scenery pills enabled · random people feeds blocked");
})(typeof window !== "undefined" ? window : this);
