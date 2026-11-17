/*! clarity-meme-bg-fetch-v1 · P33 real image load · educational scenery only */
(function (g) {
  "use strict";
  g.__CLARITY_MEME_BG_FETCH_V1__ = true;
  g.__CLARITY_MEME_BG_FETCH_P33__ = true;

  function setStatus(msg) {
    var el = document.getElementById("meme-fetch-status") || document.getElementById("meme-rrra-status");
    if (el) el.textContent = msg || "";
  }

  var CATALOG = {"holy": ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg/1280px-Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Masjid_al-Haram_at_night.jpg/1280px-Masjid_al-Haram_at_night.jpg"], "nature": ["https://picsum.photos/seed/clarity-mountains-1/1280/720", "https://picsum.photos/seed/clarity-forest-2/1280/720", "https://picsum.photos/seed/clarity-valley-3/1280/720", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1280&q=80"], "night": ["https://picsum.photos/seed/clarity-night-sky/1280/720", "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1280&q=80"], "water": ["https://picsum.photos/seed/clarity-ocean-1/1280/720", "https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1280&q=80"], "flowers": ["https://picsum.photos/seed/clarity-garden-1/1280/720", "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1280&q=80"], "spirit": ["https://picsum.photos/seed/clarity-mist-1/1280/720", "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1280&q=80"], "free": ["https://picsum.photos/seed/clarity-free-a/1280/720", "https://picsum.photos/seed/clarity-free-b/1280/720"], "dynamic": ["https://picsum.photos/seed/clarity-dynamic-1/1280/720", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg"]};
  CATALOG.flickr = CATALOG.nature;
  CATALOG.galaxy = CATALOG.night;
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
    try {
      var s = ensureState();
      var img = s.bgImage || s.img;
      var canvas = document.getElementById("meme-canvas");
      if (!canvas || !img) return;
      var ctx = canvas.getContext("2d");
      if (!ctx) return;
      var W = canvas.width, H = canvas.height;
      var nw = img.naturalWidth || img.width || W;
      var nh = img.naturalHeight || img.height || H;
      var scale = Math.max(W / nw, H / nh);
      var iw = nw * scale, ih = nh * scale;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(img, (W - iw) / 2, (H - ih) / 2, iw, ih);
      ctx.fillStyle = "rgba(0,0,0,0.28)";
      ctx.fillRect(0, 0, W, H);
      function line(text, y, size) {
        if (!text) return;
        ctx.save();
        ctx.font = "bold " + size + "px Amiri, 'Noto Naskh Arabic', serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgba(0,0,0,0.75)";
        ctx.fillStyle = "#f7f1e1";
        ctx.strokeText(text, W / 2, H * y);
        ctx.fillText(text, W / 2, H * y);
        ctx.restore();
      }
      line(s.top || "", s.topY || 0.14, s.topSize || 36);
      line(s.mid || "", s.midY || 0.42, s.midSize || 20);
      line(s.bottom || s._lastRef || "", s.bottomY || 0.72, s.bottomSize || 16);
    } catch (e4) {}
  }

  function loadUrl(url, label) {
    return new Promise(function (resolve) {
      if (!url) { resolve(false); return; }
      setStatus((label || "BG") + " · fetching…");
      var img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function () {
        var s = ensureState();
        s.bgImage = img;
        s.img = img;
        setStatus((label || "BG") + " · ok");
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
    return await loadUrl("https://picsum.photos/seed/clarity-fb-" + (Date.now() % 9999) + "/1280/720", key);
  }

  g.memeFetchBg = function (k) { return onlineFetch(k); };
  g.clarityMemeAiBg = function (mode) { return onlineFetch(mode || "dynamic"); };
  g.clarityMemeDecorBg = function (mode) {
    if (mode === "mosque") return onlineFetch("holy");
    return onlineFetch("nature");
  };
  g.memeFetchNature = function () { return onlineFetch("nature"); };
  g.__memeOnlineFetch = onlineFetch;
  setStatus("Background fetch ready · free libraries");
})(typeof window !== "undefined" ? window : this);
