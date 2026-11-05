/**
 * Meme / Tablīgh Studio online backgrounds · 20261020TABLIGH
 * window.__memeOnlineFetch for chunk-8 memeFetchBg
 * Context-aware scenery from canvas text · Shariah: scenery/geometry only
 */
(function (g) {
  "use strict";
  g.__CLARITY_MEME_BG_FETCH_V1__ = true;

  function setStatus(msg) {
    var el = document.getElementById("meme-fetch-status");
    if (el) el.textContent = msg || "";
  }

  var CATALOG = {
    holy: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg/1280px-Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Green_Dome_and_Prophet%27s_Mosque.jpg/1280px-Green_Dome_and_Prophet%27s_Mosque.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Masjid_al-Haram_in_Makkah.jpg/1280px-Masjid_al-Haram_in_Makkah.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Mount_Arafat.jpg/800px-Mount_Arafat.jpg"
    ],
    nature: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1280&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1280&q=80",
      "https://picsum.photos/seed/clarity-nature-a/1280/720"
    ],
    flowers: [
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1280&q=80",
      "https://images.unsplash.com/photo-1462275646964-a0e2d0693f7d?w=1280&q=80",
      "https://picsum.photos/seed/clarity-flowers/1280/720"
    ],
    night: [
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1280&q=80",
      "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1280&q=80",
      "https://picsum.photos/seed/clarity-night/1280/720"
    ],
    water: [
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1280&q=80",
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1280&q=80"
    ],
    spirit: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1280&q=80",
      "https://picsum.photos/seed/clarity-spirit/1280/720"
    ],
    galaxy: [
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1280&q=80",
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1280&q=80"
    ],
    flickr: [
      "https://picsum.photos/seed/clarity-flickr-1/1280/720",
      "https://picsum.photos/seed/clarity-flickr-2/1280/720"
    ],
    free: [
      "https://picsum.photos/seed/clarity-free-1/1280/720",
      "https://picsum.photos/seed/clarity-free-2/1280/720"
    ],
    decor: [
      "https://picsum.photos/seed/clarity-decor/1280/720"
    ]
  };
  var idx = {};

  function nextUrl(kind) {
    var list = CATALOG[kind] || CATALOG.nature;
    idx[kind] = (idx[kind] || 0) % list.length;
    var u = list[idx[kind]];
    idx[kind]++;
    return u;
  }

  function canvasTextContext() {
    var parts = [];
    ["meme-top-input", "meme-mid-input", "meme-bottom-input"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.value) parts.push(el.value);
    });
    ["meme-box-top", "meme-box-mid", "meme-box-bottom"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.textContent) parts.push(el.textContent);
    });
    return parts.join(" ").toLowerCase();
  }

  function kindFromContext(fallback) {
    var t = canvasTextContext();
    if (!t) return fallback || "nature";
    if (/makkah|kaaba|haram|hajj|madinah|masjid|mosque|prophet|nabawi/.test(t)) return "holy";
    if (/night|qiyam|tahajjud|dark|stars/.test(t)) return "night";
    if (/mercy|rahma|forgive|istighfar|peace|tranq/.test(t)) return "spirit";
    if (/water|sea|river|rain/.test(t)) return "water";
    if (/flower|garden|spring/.test(t)) return "flowers";
    if (/sky|heaven|galaxy|cosmos/.test(t)) return "galaxy";
    if (/death|grave|akhirah|hereafter/.test(t)) return "night";
    return fallback || "nature";
  }

  function loadUrl(url, label) {
    return new Promise(function (resolve) {
      if (typeof g.memeLoadImageFromUrl === "function") {
        try {
          g.memeLoadImageFromUrl(url);
          setStatus((label || "BG") + " · loaded");
          resolve(true);
          setTimeout(function () {
            if (typeof g.memeAutoFitText === "function") g.memeAutoFitText();
            else if (typeof g.memeDraw === "function") g.memeDraw();
          }, 120);
          return;
        } catch (e) {}
      }
      var img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function () {
        try {
          if (g.memeState) g.memeState.bgImage = img;
          if (typeof g.memeDraw === "function") g.memeDraw();
          setStatus((label || "BG") + " · ok");
          if (typeof g.memeAutoFitText === "function") g.memeAutoFitText();
          resolve(true);
        } catch (e) {
          setStatus("draw error");
          resolve(false);
        }
      };
      img.onerror = function () {
        setStatus("fetch failed · try next");
        resolve(false);
      };
      img.src = url;
    });
  }

  function aiUrl(prompt) {
    var q = encodeURIComponent(
      prompt || "serene islamic geometric pattern soft gold teal, no people, landscape"
    );
    return (
      "https://image.pollinations.ai/prompt/" +
      q +
      "?width=1200&height=675&nologo=true&seed=" +
      (Date.now() % 99999)
    );
  }

  async function onlineFetch(kind) {
    kind = (kind || "nature") + "";
    var map = {
      "ai-scene": "ai",
      "ai-geo": "ai-geo",
      "ai-nature": "ai-nature",
      "ai-night": "ai-night",
      pattern: "ai-geo",
      geometry: "ai-geo"
    };
    if (map[kind]) kind = map[kind];

    if (kind === "blank") {
      if (typeof g.memeShowBlankPalette === "function") g.memeShowBlankPalette();
      setStatus("Blank");
      return;
    }
    if (kind === "context" || kind === "surprise") {
      kind = kindFromContext("nature");
      setStatus("Context → " + kind);
    }

    if (kind === "ai" || kind === "ai-geo" || kind === "ai-nature" || kind === "ai-night") {
      var ctx = canvasTextContext().slice(0, 120);
      var prompts = {
        ai: "calm mosque silhouette dusk soft light no people cinematic " + ctx,
        "ai-geo": "islamic geometric star pattern teal gold elegant no people",
        "ai-nature": "peaceful mountain lake sunrise mist no people soft " + ctx,
        "ai-night": "starry night desert dunes soft moonlight no people"
      };
      await loadUrl(aiUrl(prompts[kind] || prompts.ai), "AI · " + kind);
      return;
    }
    if (kind === "dynamic") {
      try {
        var c = document.getElementById("meme-canvas");
        if (c && c.getContext) {
          var ctx2 = c.getContext("2d");
          var g1 = ctx2.createLinearGradient(0, 0, c.width, c.height);
          g1.addColorStop(0, "#0d4f3c");
          g1.addColorStop(0.5, "#1a6b52");
          g1.addColorStop(1, "#0a2a22");
          ctx2.fillStyle = g1;
          ctx2.fillRect(0, 0, c.width, c.height);
          if (g.memeState) g.memeState.bgImage = null;
          if (typeof g.memeDraw === "function") g.memeDraw();
          setStatus("Dynamic gradient");
          if (typeof g.memeAutoFitText === "function") g.memeAutoFitText();
          return;
        }
      } catch (e) {}
    }
    var catalogKey = CATALOG[kind] ? kind : kindFromContext(kind);
    var url = nextUrl(catalogKey);
    var ok = await loadUrl(url, catalogKey);
    if (!ok) {
      await loadUrl(
        "https://picsum.photos/seed/clarity-fb-" + (Date.now() % 9999) + "/1200/900.jpg",
        "fallback"
      );
    }
  }

  /** Fit text boxes to stage width */
  g.memeAutoFitText = function () {
    try {
      var stage = document.getElementById("meme-stage") || document.getElementById("meme-stage-wrap");
      if (!stage) return;
      var w = stage.clientWidth || 320;
      var boxes = stage.querySelectorAll(".meme-text-box");
      boxes.forEach(function (box) {
        var text = (box.textContent || "").trim();
        if (!text) return;
        var size = 42;
        box.style.fontSize = size + "px";
        var guard = 0;
        while (box.scrollWidth > w * 0.92 && size > 12 && guard++ < 40) {
          size -= 1;
          box.style.fontSize = size + "px";
        }
      });
      var all = document.getElementById("meme-size");
      if (all && boxes[0]) {
        var fs = parseInt(boxes[0].style.fontSize, 10);
        if (fs) {
          all.value = fs;
          var val = document.getElementById("meme-size-val");
          if (val) val.textContent = String(fs);
        }
      }
      if (typeof g.memeDraw === "function") g.memeDraw();
    } catch (e) {}
  };

  g.__memeOnlineFetch = onlineFetch;
  g.memeFetchBg = function (k) {
    return onlineFetch(k);
  };
  g.clarityMemeAiBg = function (mode) {
    return onlineFetch(mode || "ai");
  };
  g.clarityMemeDecorBg = function (mode) {
    if (mode === "geometry" || mode === "pattern") return onlineFetch("ai-geo");
    if (mode === "mosque") return onlineFetch("holy");
    return onlineFetch("spirit");
  };
  g.memeFetchNature = function () {
    return onlineFetch("nature");
  };

  setStatus("Background fetch ready");
})(typeof window !== "undefined" ? window : this);
