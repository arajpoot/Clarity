/*! craft-meme-shariah-pools-v1 · Phase B C18
 * Curated scenery pools (fixed Unsplash IDs + Wikimedia).
 * Blocks random people/animal stock. Every URL still intended for clarityShariahScanUrl.
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  w.__CRAFT_MEME_SHARIAH_POOLS_C18__ = true;

  function U(id) {
    return "https://images.unsplash.com/" + id + "?auto=format&fit=crop&w=1600&q=80";
  }
  function W(path) {
    return "https://upload.wikimedia.org/wikipedia/commons/" + path;
  }

  var POOLS = {
    nature: [
      U("photo-1506905925346-21bda4d32df4"),
      U("photo-1441974231531-c6227db76b6e"),
      U("photo-1470071451329-d1ea785c8c7d"),
      U("photo-1464822759023-fed622ff2c3b"),
      W("thumb/6/6d/Desert_in_Qatar.jpg/1280px-Desert_in_Qatar.jpg")
    ],
    mountains: [
      U("photo-1506905925346-21bda4d32df4"),
      U("photo-1464822759023-fed622ff2c3b"),
      U("photo-1519681393784-d120267933ba")
    ],
    desert: [
      U("photo-1509316785289-025f5b846b35"),
      U("photo-1473580044384-7ba9967e16a0"),
      W("thumb/6/6d/Desert_in_Qatar.jpg/1280px-Desert_in_Qatar.jpg")
    ],
    night: [
      U("photo-1419242902214-272b3f66ee7a"),
      U("photo-1507272931001-fc06c17e4f43"),
      U("photo-1475274047050-1d0c0975c63e")
    ],
    galaxy: [
      U("photo-1462331940025-496dfbfc7564"),
      U("photo-1516339901601-2e1b62dc0c45"),
      U("photo-1419242902214-272b3f66ee7a")
    ],
    water: [
      U("photo-1505142468610-359e7d316be0"),
      U("photo-1439066615861-d1af74d74000"),
      U("photo-1507525428034-b723cf961d3e")
    ],
    flowers: [
      U("photo-1490750967916-d7429ed35a8e"),
      U("photo-1462275646964-a0e7786cbe5a")
    ],
    holy: [
      U("photo-1564769625905-50e93615e769"),
      U("photo-1591604129939-f1efa4d9f7fa"),
      U("photo-1519817650390-64a5db1d0498"),
      W("thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg")
    ],
    spirit: [
      U("photo-1564769625905-50e93615e769"),
      U("photo-1470071451329-d1ea785c8c7d"),
      U("photo-1506905925346-21bda4d32df4")
    ],
    geometry: [
      U("photo-1564769625905-50e93615e769"),
      U("photo-1519817650390-64a5db1d0498")
    ],
    free: [
      U("photo-1506905925346-21bda4d32df4"),
      U("photo-1441974231531-c6227db76b6e"),
      U("photo-1564769625905-50e93615e769")
    ],
    flickr: [
      U("photo-1441974231531-c6227db76b6e"),
      U("photo-1506905925346-21bda4d32df4")
    ]
  };

  var ALIAS = {
    nature: "nature", night: "night", water: "water", holy: "holy",
    flowers: "flowers", free: "free", flickr: "flickr", blank: "blank",
    galaxy: "galaxy", desert: "desert", mountains: "mountains",
    spirit: "spirit", geometry: "geometry", pattern: "geometry",
    surprise: "surprise", dynamic: "nature", stock: "nature"
  };

  var idx = {};
  Object.keys(POOLS).forEach(function (k) { idx[k] = 0; });

  function blockedHost(url) {
    var u = String(url || "").toLowerCase();
    if (!u) return true;
    if (/picsum\.photos|loremflickr|source\.unsplash\.com|placekitten|thispersondoesnotexist/.test(u)) return true;
    return false;
  }

  function next(kind) {
    kind = ALIAS[String(kind || "nature").toLowerCase()] || "nature";
    if (kind === "blank") return null;
    if (kind === "surprise") {
      var keys = ["nature", "night", "water", "holy", "galaxy", "desert", "mountains", "flowers", "spirit"];
      kind = keys[Math.floor(Math.random() * keys.length)];
    }
    var pool = POOLS[kind] || POOLS.nature;
    var i = idx[kind] || 0;
    var url = pool[i % pool.length];
    idx[kind] = i + 1;
    if (blockedHost(url)) return next("holy");
    return url;
  }

  w.CraftMemePools = {
    version: "C18",
    pools: POOLS,
    next: next,
    blockedHost: blockedHost,
    alias: ALIAS
  };
})(window);
