/**
 * Meme Studio online background fetch — 20261015MEMEBG
 * Implements window.__memeOnlineFetch so chunk-8 memeFetchBg uses real sources.
 * CSP-friendly: Wikimedia, Picsum, Pollinations (img-src https: allowed).
 * Educational · scenery / architecture — avoid figurative portraits.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_MEME_BG_FETCH_V1__) return;
  g.__CLARITY_MEME_BG_FETCH_V1__ = true;

  var statusEl = function () {
    return document.getElementById("meme-fetch-status");
  };
  function setStatus(msg) {
    var el = statusEl();
    if (el) el.textContent = msg || "";
  }

  /* Content-sensitive / Shariah-leaning scenery (no figurative people stock) */
  var CATALOG = {
    holy: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg/1280px-Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Green_Dome_and_Prophet%27s_Mosque.jpg/1280px-Green_Dome_and_Prophet%27s_Mosque.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Masjid_al-Haram_in_Makkah.jpg/1280px-Masjid_al-Haram_in_Makkah.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Mount_Arafat.jpg/800px-Mount_Arafat.jpg"
    ],
    nature: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80",
      "https://picsum.photos/seed/clarity-nature-a/1200/900.jpg",
      "https://picsum.photos/seed/clarity-nature-b/1200/900.jpg"
    ],
    flowers: [
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1468327761634-b5f9bd0d5c57?auto=format&fit=crop&w=1400&q=80",
      "https://picsum.photos/seed/clarity-flower-1/1200/900.jpg"
    ],
    water: [
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1400&q=80",
      "https://picsum.photos/seed/clarity-water-1/1200/900.jpg"
    ],
    night: [
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1400&q=80",
      "https://picsum.photos/seed/clarity-night-1/1200/900.jpg"
    ],
    spirit: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1400&q=80",
      "https://picsum.photos/seed/clarity-spirit-1/1200/900.jpg"
    ],
    free: []
  };
  CATALOG.free = [].concat(CATALOG.holy, CATALOG.nature, CATALOG.flowers);
  CATALOG.flickr = CATALOG.free.slice();

  var cursor = {};

  function nextUrl(kind) {
    var list = CATALOG[kind] || CATALOG.free;
    if (!list.length) list = CATALOG.nature;
    cursor[kind] = ((cursor[kind] || 0) + 1) % list.length;
    return list[cursor[kind]];
  }

  function loadUrl(url, label) {
    setStatus("Loading " + (label || "background") + "…");
    return new Promise(function (resolve) {
      if (typeof g.memeLoadImageFromUrl === "function") {
        try {
          g.memeLoadImageFromUrl(url);
          setStatus("Background: " + (label || "ready"));
          resolve(true);
          return;
        } catch (e) {}
      }
      /* fallback: draw via Image → canvas if meme state exists */
      var img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function () {
        try {
          if (g.memeState) g.memeState.bgImage = img;
          if (typeof g.memeDraw === "function") g.memeDraw();
          setStatus("Background: " + (label || "ready"));
          resolve(true);
        } catch (e2) {
          setStatus("Loaded image but canvas draw failed");
          resolve(false);
        }
      };
      img.onerror = function () {
        setStatus("Fetch blocked or failed — try another chip / Blank");
        resolve(false);
      };
      img.src = url;
    });
  }

  /** AI graphic via Pollinations (no key; CSP allows image.pollinations.ai) */
  function aiUrl(prompt) {
    var q = encodeURIComponent(prompt || "serene islamic geometric pattern soft gold teal, no people, landscape");
    return "https://image.pollinations.ai/prompt/" + q + "?width=1200&height=675&nologo=true&seed=" + (Date.now() % 99999);
  }

  async function onlineFetch(kind) {
    kind = (kind || "nature") + "";
    if (kind === "blank") {
      if (typeof g.memeShowBlankPalette === "function") g.memeShowBlankPalette();
      setStatus("Blank palette");
      return;
    }
    if (kind === "ai" || kind === "ai-geo" || kind === "ai-nature" || kind === "ai-night") {
      var prompts = {
        ai: "calm mosque silhouette at dusk soft light, no people, cinematic landscape",
        "ai-geo": "islamic geometric star pattern teal and gold, flat elegant, no people",
        "ai-nature": "peaceful mountain lake sunrise mist, no people, soft colors",
        "ai-night": "starry night over desert dunes soft moonlight, no people"
      };
      var url = aiUrl(prompts[kind] || prompts.ai);
      await loadUrl(url, "AI · " + kind);
      return;
    }
    if (kind === "dynamic") {
      /* soft gradient canvas without network */
      try {
        var c = document.getElementById("meme-canvas");
        if (c && c.getContext) {
          var ctx = c.getContext("2d");
          var g1 = ctx.createLinearGradient(0, 0, c.width, c.height);
          g1.addColorStop(0, "#0d4f3c");
          g1.addColorStop(0.5, "#1a6b52");
          g1.addColorStop(1, "#0a2a22");
          ctx.fillStyle = g1;
          ctx.fillRect(0, 0, c.width, c.height);
          if (g.memeState) g.memeState.bgImage = null;
          if (typeof g.memeDraw === "function") g.memeDraw();
          setStatus("Dynamic gradient");
          return;
        }
      } catch (e) {}
    }
    var url = nextUrl(kind);
    var ok = await loadUrl(url, kind);
    if (!ok) {
      /* last resort picsum */
      await loadUrl("https://picsum.photos/seed/clarity-fb-" + (Date.now() % 9999) + "/1200/900.jpg", "fallback");
    }
  }

  g.__memeOnlineFetch = onlineFetch;
  g.clarityMemeAiBg = function (mode) {
    return onlineFetch(mode || "ai");
  };
  g.clarityMemeDecorBg = function (mode) {
    if (mode === "geometry" || mode === "pattern") return onlineFetch("ai-geo");
    if (mode === "mosque") return onlineFetch("holy");
    return onlineFetch("spirit");
  };

  setStatus("Background fetch ready");
})(typeof window !== "undefined" ? window : this);
