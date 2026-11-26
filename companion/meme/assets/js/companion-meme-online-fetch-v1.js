/*! companion-meme-online-fetch-v1
 * Provides window.memeFetchBg for owner · scenery-only pools · no figurative people
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_ONLINE_FETCH_V1__) return;
  w.__COMPANION_MEME_ONLINE_FETCH_V1__ = true;

  // Curated scenery-only (landscapes, sky, water, geometry, architecture exteriors without close portraits)
  var POOLS = {
    nature: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1400&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1400&q=80"
    ],
    holy: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg",
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1400&q=80",
      "https://images.unsplash.com/photo-1580418827634-230dcd1f91c0?w=1400&q=80"
    ],
    night: [
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1400&q=80",
      "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1400&q=80",
      "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=1400&q=80"
    ],
    water: [
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1400&q=80",
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1400&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80"
    ],
    flowers: [
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1400&q=80",
      "https://images.unsplash.com/photo-1462275646964-a0e7eaed8b7f?w=1400&q=80",
      "https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=1400&q=80"
    ],
    spirit: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1400&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=80",
      "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1400&q=80"
    ],
    pattern: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1400&q=80",
      "https://images.unsplash.com/photo-1550684848-facb0aea35b1?w=1400&q=80",
      "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1400&q=80"
    ],
    decor: [
      "https://images.unsplash.com/photo-1519817914152-22d216b8b5a8?w=1400&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1400&q=80"
    ],
    flickr: [
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1400&q=80",
      "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1400&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1400&q=80",
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1400&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=80"
    ]
  };

  var idx = {};

  function status(msg) {
    var el = d.getElementById("meme-fetch-status") || d.getElementById("meme-status");
    if (el) el.textContent = msg || "";
  }

  function paint() {
    try {
      if (typeof w.schedulePaint === "function") return w.schedulePaint();
    } catch (e) {}
    try {
      if (typeof w.paintMeme === "function") return w.paintMeme();
    } catch (e2) {}
    try {
      if (typeof w.memeDraw === "function") return w.memeDraw();
    } catch (e3) {}
  }

  function loadUrl(url, kind) {
    if (!url) {
      status("No scene URL");
      return;
    }
    status("Loading scenery · " + (kind || "") + "…");
    var im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = function () {
      if (!w.memeState) w.memeState = {};
      w.memeState.img = im;
      w.memeState.bgImage = im;
      status("Scenery ready · " + (kind || "online"));
      paint();
    };
    im.onerror = function () {
      status("Scene unavailable — try another");
      paint();
    };
    im.src = url;
  }

  function memeFetchBg(kind) {
    kind = String(kind || "nature").toLowerCase();
    if (kind === "geometry") kind = "pattern";
    if (kind === "blank") {
      if (!w.memeState) w.memeState = {};
      w.memeState.img = null;
      w.memeState.bgImage = null;
      status("Blank");
      paint();
      return;
    }
    var pool = POOLS[kind] || POOLS.nature;
    if (!idx[kind]) idx[kind] = 0;
    var url = pool[idx[kind] % pool.length];
    idx[kind]++;
    loadUrl(url, kind);
  }

  w.memeFetchBg = memeFetchBg;
  w.memeLoadImageFromUrl = function (url, failMsg) {
    loadUrl(url, "custom");
  };
  w.MEME_BG_POOLS = POOLS;
})(window, document);
