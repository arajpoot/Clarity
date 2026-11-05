/*! craft-meme-shariah-pools-v1 · C17
 * Best-of archive3/main: Wikimedia-only scenery pools (companion-meme-shariah-bg).
 * Every URL still passes clarityShariahScanUrl (fail closed if missing).
 * Educational only — not a fatwa · scenery/architecture/sky/water/pattern only.
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_SHARIAH_POOLS_C17__) return;
  w.__CRAFT_MEME_SHARIAH_POOLS_C17__ = true;

  var W = function (path) {
    return "https://upload.wikimedia.org/wikipedia/commons/" + path;
  };

  /* Curated Wikimedia — no portrait stock */
  var POOLS = {
    nature: [
      W("thumb/d/d5/Green_pasture.jpg/1280px-Green_pasture.jpg"),
      W("thumb/1/1a/Sand_dunes_in_the_Empty_Quarter.jpg/1280px-Sand_dunes_in_the_Empty_Quarter.jpg"),
      W("thumb/6/6d/Desert_in_Qatar.jpg/1280px-Desert_in_Qatar.jpg"),
      W("thumb/3/3e/Wadi_Rum_Jordan.jpg/1280px-Wadi_Rum_Jordan.jpg")
    ],
    holy: [
      W("thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg"),
      W("thumb/c/c8/Masjid_al-Haram%2C_Mecca.jpg/1280px-Masjid_al-Haram%2C_Mecca.jpg"),
      W("thumb/8/8a/Al-Masjid_an-Nabawi_as-from_top.jpg/1280px-Al-Masjid_an-Nabawi_as-from_top.jpg"),
      W("thumb/4/4a/Masjid_al-Nabawi_Gates.jpg/1280px-Masjid_al-Nabawi_Gates.jpg")
    ],
    night: [
      W("thumb/6/62/Night_sky_with_stars.jpg/1280px-Night_sky_with_stars.jpg"),
      W("thumb/8/80/Milky_Way_Arch.jpg/1280px-Milky_Way_Arch.jpg"),
      W("thumb/2/21/Starsinthesky.jpg/1280px-Starsinthesky.jpg")
    ],
    water: [
      W("thumb/7/7e/Ocean_waves.jpg/1280px-Ocean_waves.jpg"),
      W("thumb/5/5f/Blue_Mediterranean_Sea.jpg/1280px-Blue_Mediterranean_Sea.jpg"),
      W("thumb/0/0c/Calm_sea.jpg/1280px-Calm_sea.jpg")
    ],
    flowers: [
      W("thumb/a/a5/Flower_field.jpg/1280px-Flower_field.jpg"),
      W("thumb/4/4b/Wildflowers.jpg/1280px-Wildflowers.jpg")
    ],
    flickr: [
      W("thumb/6/6d/Desert_in_Qatar.jpg/1280px-Desert_in_Qatar.jpg"),
      W("thumb/d/d5/Green_pasture.jpg/1280px-Green_pasture.jpg")
    ],
    blank: []
  };

  if (!w.MEME_BG_POOLS) w.MEME_BG_POOLS = {};
  Object.keys(POOLS).forEach(function (k) {
    w.MEME_BG_POOLS[k] = POOLS[k].slice();
  });

  function status(msg) {
    var el = d.getElementById("meme-fetch-status");
    if (el) el.textContent = msg || "";
  }

  function scan(url, meta) {
    if (typeof w.clarityShariahScanUrl !== "function") {
      status("Shariah scan unavailable — refusing unscoped load");
      return false;
    }
    var r = w.clarityShariahScanUrl(url, meta || "");
    if (!r.ok) {
      status("Skipped non-compliant (" + (r.reason || "blocked") + ")");
      return false;
    }
    return true;
  }

  function loadUrl(url, kind) {
    if (!url || !scan(url, kind || "")) return;
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      try {
        if (w.memeState) {
          w.memeState.img = img;
          w.memeState.bgImage = img;
        }
      } catch (e) {}
      try {
        if (typeof w.__craftMemePaint === "function") w.__craftMemePaint();
      } catch (e2) {}
      try {
        d.dispatchEvent(new CustomEvent("craft-meme-bg-loaded", { detail: { img: img, kind: kind } }));
      } catch (e3) {}
      status("Background: " + (kind || "ready") + " · Wikimedia · scanned");
    };
    img.onerror = function () {
      status("BG failed · try Next scenery");
    };
    img.src = url;
  }

  function pick(kind) {
    kind = String(kind || "nature").toLowerCase();
    if (kind === "blank") return null;
    var pool = POOLS[kind] || POOLS.nature || [];
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  /* Prefer these pools for Craft chip fetches */
  var prev = w.__memeOnlineFetch;
  w.__memeOnlineFetch = function (kind) {
    kind = String(kind || "nature").toLowerCase();
    if (kind === "blank") {
      status("Background: solid");
      return;
    }
    var url = pick(kind);
    if (url) {
      loadUrl(url, kind);
      return;
    }
    if (typeof prev === "function" && !prev._c17Pools) {
      try { prev(kind); } catch (e) {}
    }
  };
  w.__memeOnlineFetch._c17Pools = true;
  w.memeFetchBg = w.__memeOnlineFetch;

  w.craftMemeShariahPools = { version: "C17", pools: POOLS, pick: pick, loadUrl: loadUrl };
})(window, document);
