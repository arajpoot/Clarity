/*! companion-banner-craft-v1 · layout lock + shariah-safe meme backgrounds */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_BANNER_CRAFT_V1__) return;
  w.__CLARITY_BANNER_CRAFT_V1__ = true;

  var LOG = (w.__BANNER_CRAFT_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  function layout() {
    var ov = d.querySelector(".banner-overlay");
    if (!ov) return;
    var left = ov.querySelector(".banner-side.left");
    var center = ov.querySelector(".banner-center");
    var right = ov.querySelector(".banner-side.right");
    if (!right) {
      right = d.createElement("div");
      right.className = "banner-side right";
    }
    var salah = d.querySelector(".salah-times-section");
    var cal = d.querySelector(".hijri-cal-section");
    if (cal && left) left.appendChild(cal);
    if (salah) right.appendChild(salah);
    if (left) ov.appendChild(left);
    if (center) ov.appendChild(center);
    ov.appendChild(right);
    log("layout");
  }

  /* ——— Shariah-leaning still backgrounds (nature / architecture / pattern; no figurative portraits) ——— */
  var SAFE = {
    nature: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Green_pasture.jpg/1280px-Green_pasture.jpg",
      "https://picsum.photos/seed/clarity-nature-1/1200/900.jpg",
      "https://picsum.photos/seed/clarity-nature-2/1200/900.jpg"
    ],
    holy: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Masjid_al-Haram%2C_Mecca.jpg/1280px-Masjid_al-Haram%2C_Mecca.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Al-Masjid_an-Nabawi_as-from_top.jpg/1280px-Al-Masjid_an-Nabawi_as-from_top.jpg"
    ],
    night: [
      "https://picsum.photos/seed/clarity-night-1/1200/900.jpg",
      "https://picsum.photos/seed/clarity-night-2/1200/900.jpg"
    ],
    water: [
      "https://picsum.photos/seed/clarity-water-1/1200/900.jpg",
      "https://picsum.photos/seed/clarity-water-2/1200/900.jpg"
    ],
    flowers: [
      "https://picsum.photos/seed/clarity-flowers-1/1200/900.jpg",
      "https://picsum.photos/seed/clarity-flowers-2/1200/900.jpg"
    ],
    spirit: [
      "https://picsum.photos/seed/clarity-spirit-1/1200/900.jpg",
      "https://picsum.photos/seed/clarity-spirit-2/1200/900.jpg"
    ],
    pattern: [
      "https://picsum.photos/seed/clarity-pattern-1/1200/900.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/640px-Kaaba_Masjid_Haraam_Makkah.jpg"
    ],
    free: [],
    flickr: [],
    dynamic: [],
    blank: []
  };
  SAFE.free = SAFE.nature.concat(SAFE.holy);
  SAFE.flickr = SAFE.nature;
  SAFE.dynamic = SAFE.spirit.concat(SAFE.night);

  var idx = {};
  function nextUrl(kind) {
    kind = (kind || "nature").toLowerCase();
    if (kind === "decor") kind = "pattern";
    var pool = SAFE[kind] || SAFE.nature;
    if (!pool.length) pool = SAFE.nature;
    if (typeof idx[kind] !== "number") idx[kind] = -1;
    idx[kind] = (idx[kind] + 1) % pool.length;
    return pool[idx[kind]];
  }

  function status(msg) {
    var el = d.getElementById("meme-fetch-status") || d.getElementById("meme-rrra-status");
    if (el) el.textContent = msg || "";
  }

  function paintImg(im) {
    try {
      if (!w.memeState) w.memeState = {};
      w.memeState.img = im;
      if (typeof w.memeDraw === "function") w.memeDraw();
      else if (typeof w.clarityMemeUiSync === "function") w.clarityMemeUiSync();
      else {
        var c = d.getElementById("meme-canvas");
        if (c && c.getContext) {
          var ctx = c.getContext("2d");
          if (c.width < 100) { c.width = 1200; c.height = 675; }
          ctx.drawImage(im, 0, 0, c.width, c.height);
        }
      }
    } catch (e) {
      log("paint " + e);
    }
  }

  function loadUrl(url, attempt) {
    attempt = attempt || 0;
    status("Loading…");
    if (typeof w.memeLoadImageFromUrl === "function") {
      try {
        w.memeLoadImageFromUrl(url, "Could not load");
        status("Background ready");
        log("via memeLoadImageFromUrl");
        return;
      } catch (e) {}
    }
    var im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = function () {
      paintImg(im);
      status("Background ready");
      log("bg-ok");
    };
    im.onerror = function () {
      if (attempt < 2) {
        log("retry");
        loadUrl(nextUrl("nature"), attempt + 1);
      } else {
        status("Load failed — try another chip");
        log("bg-fail");
      }
    };
    im.src = url;
  }

  /* Override memeFetchBg with curated safe pools (no random people stock) */
  w.memeFetchBg = function (kind) {
    kind = kind || "nature";
    if (kind === "blank") {
      status("Blank");
      try {
        if (!w.memeState) w.memeState = {};
        w.memeState.img = null;
        var c = d.getElementById("meme-canvas");
        if (c && c.getContext) {
          var ctx = c.getContext("2d");
          if (c.width < 100) { c.width = 1200; c.height = 675; }
          ctx.fillStyle = (w.memeState.blankColor1 || "#0f4c3a");
          ctx.fillRect(0, 0, c.width, c.height);
        }
      } catch (e) {}
      return;
    }
    var url = nextUrl(kind);
    log("fetch " + kind);
    loadUrl(url, 0);
  };
  w.__memeOnlineFetch = w.memeFetchBg;
  w.memeFetchNature = function () { w.memeFetchBg("nature"); };
  w.memeFetchFlickr = function () { w.memeFetchBg("nature"); };

  function boot() {
    layout();
    setTimeout(layout, 400);
    setTimeout(layout, 1000);
    log("craft-boot");
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("clarity-a2-spine-ready", function () {
    setTimeout(layout, 50);
    setTimeout(layout, 400);
    /* re-assert fetch after packs */
    w.memeFetchBg = w.memeFetchBg;
    w.__memeOnlineFetch = w.memeFetchBg;
  });
})(window, document);
