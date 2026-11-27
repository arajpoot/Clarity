/*! companion-meme-shariah-bg-v1.js · soft policy v2
 * Limit: no humans, no animals in fetched backgrounds.
 * Scenery, architecture, sky, geometry, plants OK.
 * Live Wikimedia Commons search enabled.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  w.__CLARITY_MEME_SHARIAH_BG_V1__ = true;
  w.__CLARITY_MEME_BG_POLICY_V2__ = true;

  var LOG = (w.__MEME_SHARIAH_BG_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  /* Soft block: humans / animals only (URL + title hints) */
  var BLOCK_RE = /\b(portrait|people|person|human|man|woman|child|boy|girl|face|selfie|crowd|soldier|worker|family|couple|baby|hands?\b|animal|cat|dog|horse|camel|bird|fish|lion|tiger|sheep|cow|monkey|wildlife|pet)\b/i;

  var POOLS = {
    nature: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Green_pasture.jpg/1280px-Green_pasture.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Sand_dunes_in_the_Empty_Quarter.jpg/1280px-Sand_dunes_in_the_Empty_Quarter.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Wadi_Rum_Jordan.jpg/1280px-Wadi_Rum_Jordan.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Desert_in_Qatar.jpg/1280px-Desert_in_Qatar.jpg"
    ],
    holy: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg",
      "https://img.youtube.com/vi/Rs7St51oDDc/maxresdefault.jpg",
      "https://img.youtube.com/vi/27cln-IxOGo/maxresdefault.jpg"
    ],
    night: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Night_sky_with_stars.jpg/1280px-Night_sky_with_stars.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Milky_Way_Arch.jpg/1280px-Milky_Way_Arch.jpg"
    ],
    water: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Ocean_waves.jpg/1280px-Ocean_waves.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Blue_Mediterranean_Sea.jpg/1280px-Blue_Mediterranean_Sea.jpg"
    ],
    flowers: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Field_of_flowers.jpg/1280px-Field_of_flowers.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Olive_grove.jpg/1280px-Olive_grove.jpg"
    ],
    spirit: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Green_pasture.jpg/1280px-Green_pasture.jpg"
    ],
    pattern: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Islamic_geometric_pattern.jpg/1280px-Islamic_geometric_pattern.jpg"
    ],
    decor: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Islamic_geometric_pattern.jpg/1280px-Islamic_geometric_pattern.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg"
    ],
    free: [],
    galaxy: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Milky_Way_Arch.jpg/1280px-Milky_Way_Arch.jpg"
    ]
  };
  POOLS.free = [].concat(POOLS.nature, POOLS.holy, POOLS.night, POOLS.water, POOLS.pattern);

  var ALIAS = {
    nature: "nature", flowers: "flowers", holy: "holy", spirit: "spirit",
    night: "night", water: "water", galaxy: "galaxy", free: "free",
    pattern: "pattern", geometry: "pattern", decor: "decor", blank: "blank",
    dynamic: "nature", stock: "free", flickr: "free", commons: "holy",
    wikimedia: "free", wiki: "free", online: "free", scene: "nature"
  };

  var idx = {};
  Object.keys(POOLS).forEach(function (k) { idx[k] = 0; });

  function status(msg) {
    var el = d.getElementById("meme-fetch-status") || d.getElementById("meme-rrra-status");
    if (el) el.textContent = msg || "";
  }

  function paint() {
    try {
      if (typeof w.memeRender === "function") w.memeRender();
      else if (typeof w.memePaint === "function") w.memePaint();
      else if (w.ClarityMemeOwner && w.ClarityMemeOwner.paint) w.ClarityMemeOwner.paint();
    } catch (e) {}
  }

  function isBlocked(url, title) {
    var u = String(url || "") + " " + String(title || "");
    if (BLOCK_RE.test(u)) return true;
    var low = u.toLowerCase();
    /* hard portrait stock hosts */
    if (low.indexOf("picsum.photos") >= 0) return true;
    if (low.indexOf("loremflickr") >= 0) return true;
    if (low.indexOf("thispersondoesnotexist") >= 0) return true;
    return false;
  }

  function loadUrl(url, kind, title) {
    if (!url || isBlocked(url, title)) {
      status("Skipped (humans/animals filter) — try next");
      return;
    }
    var im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = function () {
      if (!w.memeState) w.memeState = {};
      w.memeState.img = im;
      w.memeState.bgImage = im;
      w.memeState.bgUrl = url;
      status("Scenery ready · " + (kind || "bg") + (title ? " · " + title : ""));
      paint();
    };
    im.onerror = function () {
      status("Image unavailable — try Next / Wikimedia");
      paint();
    };
    im.src = url;
  }

  function memeFetchBg(kind) {
    kind = ALIAS[String(kind || "nature").toLowerCase()] || String(kind || "nature").toLowerCase();
    if (kind === "blank") {
      if (!w.memeState) w.memeState = {};
      w.memeState.img = null;
      w.memeState.bgImage = null;
      w.memeState.bgUrl = "";
      status("Blank canvas");
      paint();
      return;
    }
    if (kind === "wikimedia" || kind === "wiki") {
      if (typeof w.memeFetchWikimedia === "function") {
        w.memeFetchWikimedia();
        return;
      }
      kind = "free";
    }
    var pool = POOLS[kind] || POOLS.nature;
    if (!pool.length) pool = POOLS.nature;
    if (!idx[kind]) idx[kind] = 0;
    var url = pool[idx[kind] % pool.length];
    idx[kind]++;
    loadUrl(url, kind);
  }

  w.memeFetchBg = memeFetchBg;
  w.memeLoadImageFromUrl = function (url, failMsg, title) {
    if (isBlocked(url, title)) {
      status(failMsg || "Blocked: humans/animals not used as backgrounds");
      return;
    }
    loadUrl(url, "custom", title);
  };
  w.MEME_BG_POOLS = POOLS;
  w.memeBgIsBlocked = isBlocked;
  log("bg policy v2 soft filter ready");
})(window, document);
