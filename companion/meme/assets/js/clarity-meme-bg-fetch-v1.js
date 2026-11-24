/*! clarity-meme-bg-fetch-v1 · P38 all pills · photo then safe scenery fill · educational only */
(function (g) {
  "use strict";
  g.__CLARITY_MEME_BG_FETCH_V1__ = true;
  g.__CLARITY_MEME_BG_FETCH_P38__ = true;

  function setStatus(msg) {
    var el = document.getElementById("meme-fetch-status") || document.getElementById("meme-rrra-status");
    if (el) el.textContent = msg || "";
  }

  var CATALOG = {"holy": ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg", "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1280&q=80"], "nature": ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1280&q=80"], "night": ["https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1280&q=80"], "water": ["https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1280&q=80"], "flowers": ["https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1280&q=80"], "spirit": ["https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1280&q=80"], "free": ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1280&q=80", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg", "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1280&q=80"], "dynamic": ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1280&q=80", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg", "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1280&q=80"], "flickr": ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1280&q=80"], "galaxy": ["https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1280&q=80"]};
  var idx = {};

  /* Scenery fills — no people/animals; always works offline */
  var FILLS = {
    nature: ["#0d3b2c", "#1a5c40", "#0a281c"],
    holy: ["#1a3d2e", "#c9a227", "#0f2a20"],
    night: ["#050b18", "#1a2744", "#0a1020"],
    water: ["#0a2a32", "#1a6a7a", "#06303a"],
    flowers: ["#2a1830", "#6b3a5c", "#1a1020"],
    spirit: ["#1a1430", "#3d2a60", "#0e0a18"],
    free: ["#123024", "#2a6b4a", "#0c1c14"],
    dynamic: ["#0f2a22", "#2a5a40", "#0a1c16"],
    blank: ["#0f4c3a", "#0f4c3a", "#0f4c3a"]
  };

  function isAllowedUrl(url) {
    if (!url || typeof url !== "string") return false;
    var u = url.toLowerCase();
    if (/picsum\.photos|pexels\.com|pixabay\.com|shutterstock|gettyimages|istockphoto/i.test(u))
      return false;
    if (/upload\.wikimedia\.org/i.test(u)) return true;
    if (/images\.unsplash\.com\/photo-/i.test(u)) return true;
    return false;
  }

  function nextUrl(kind) {
    var list = CATALOG[kind] || CATALOG.nature || [];
    if (!list.length) return "";
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
      if (typeof g.ClarityMemeRepaint === "function") g.ClarityMemeRepaint();
    } catch (e0) {}
    try {
      if (typeof g.ClarityMemeOwnerPaint === "function") g.ClarityMemeOwnerPaint();
    } catch (e0b) {}
    try {
      if (g.ClarityMemeStudio && typeof g.ClarityMemeStudio.paintLocal === "function")
        g.ClarityMemeStudio.paintLocal();
    } catch (e) {}
    try { if (typeof g.paintMeme === "function") g.paintMeme(); } catch (e2) {}
    try { if (typeof g.memeDraw === "function") g.memeDraw(); } catch (e3) {}
    try { document.dispatchEvent(new CustomEvent("meme-bg-ready")); } catch (e4) {}
  }

  function drawSafeFill(kind) {
    var canvas = document.getElementById("meme-canvas");
    if (!canvas) return false;
    var ctx = canvas.getContext("2d");
    if (!ctx) return false;
    var colors = FILLS[kind] || FILLS.nature;
    var gdt = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gdt.addColorStop(0, colors[0]);
    gdt.addColorStop(0.55, colors[1]);
    gdt.addColorStop(1, colors[2] || colors[0]);
    ctx.fillStyle = gdt;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    /* soft vignette */
    var vg = ctx.createRadialGradient(canvas.width/2, canvas.height/2, canvas.height*0.2, canvas.width/2, canvas.height/2, canvas.height*0.85);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.35)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var s = ensureState();
    /* keep text; clear bitmap bg so paintLocal uses canvas as-is — store flag */
    s.bgImage = null;
    s.img = null;
    s._bgUrl = "safe-fill:" + kind;
    s._safeFill = kind;
    paintAll();
    /* re-apply fill after paintLocal may clear — draw text on top */
    try {
      if (g.ClarityMemeStudio && g.ClarityMemeStudio.paintLocal) {
        /* paintLocal clears; so custom paint: fill then text */
        var st = s;
        ctx.fillStyle = gdt;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        function line(text, y, size) {
          if (!text) return;
          ctx.save();
          ctx.font = "bold " + size + "px Amiri, 'Noto Naskh Arabic', serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.lineWidth = 4;
          ctx.strokeStyle = "rgba(0,0,0,0.75)";
          ctx.fillStyle = "#f7f1e1";
          ctx.strokeText(text, canvas.width/2, canvas.height * y);
          ctx.fillText(text, canvas.width/2, canvas.height * y);
          ctx.restore();
        }
        line(st.top || "", st.topY || 0.14, st.topSize || 36);
        line(st.mid || "", st.midY || 0.42, st.midSize || 20);
        line(st.bottom || st._lastRef || "", st.bottomY || 0.72, st.bottomSize || 16);
      }
    } catch (e) {}
    return true;
  }

  function loadUrl(url, label) {
    return new Promise(function (resolve) {
      if (!url || !isAllowedUrl(url)) { resolve(false); return; }
      setStatus((label || "BG") + " · fetching…");
      var done = false;
      function finish(ok) { if (done) return; done = true; resolve(ok); }
      function attempt(useCors) {
        var img = new Image();
        if (useCors) try { img.crossOrigin = "anonymous"; } catch (e) {}
        var timer = setTimeout(function () {
          try { img.src = ""; } catch (e) {}
          if (useCors) attempt(false);
          else finish(false);
        }, 8000);
        img.onload = function () {
          clearTimeout(timer);
          if (!img.naturalWidth) { finish(false); return; }
          var s = ensureState();
          s.bgImage = img; s.img = img; s._bgUrl = url; s._safeFill = "";
          setStatus((label || "BG") + " · displayed");
          paintAll();
          setTimeout(paintAll, 80);
          setTimeout(paintAll, 400);
          finish(true);
        };
        img.onerror = function () {
          clearTimeout(timer);
          if (useCors) attempt(false);
          else finish(false);
        };
        img.src = url;
      }
      attempt(true);
    });
  }

  async function onlineFetch(kind) {
    kind = String(kind || "nature").toLowerCase();
    if (kind === "mosque" || kind === "decor") kind = "holy";
    if (kind === "geometry" || kind === "pattern" || kind === "ai-geo") kind = "nature";
    if (kind === "ai") kind = "dynamic";

    if (kind === "blank") {
      drawSafeFill("blank");
      setStatus("blank · ok");
      return true;
    }

    var key = CATALOG[kind] ? kind : "nature";
    var n = Math.max(1, (CATALOG[key] || []).length);
    for (var i = 0; i < n; i++) {
      var ok = await loadUrl(nextUrl(key), key);
      if (ok) return true;
    }
    /* Always show something compliant */
    drawSafeFill(key);
    setStatus(key + " · displayed · safe scenery fill");
    return true;
  }

  g.memeFetchBg = function (k) { return onlineFetch(k); };
  g.clarityMemeAiBg = function (mode) { return onlineFetch(mode || "dynamic"); };
  g.clarityMemeDecorBg = function (mode) {
    if (mode === "mosque") return onlineFetch("holy");
    return onlineFetch("nature");
  };
  g.memeFetchNature = function () { return onlineFetch("nature"); };
  g.__memeOnlineFetch = onlineFetch;
  g.ClarityMemeBgGuard = { isAllowedUrl: isAllowedUrl, version: "P38" };
  setStatus("Background · all pills ready");
})(typeof window !== "undefined" ? window : this);
