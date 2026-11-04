/*! Clarity companion craft lazy v1 · Phase 3 · dedupe + on-demand · campus untouched */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_CRAFT_LAZY_V1__) return;
  w.__CLARITY_CRAFT_LAZY_V1__ = true;

  var loaded = {};
  var LOG = (w.__COMPANION_CRAFT_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  var GROUPS = {
    tajweed: [
      "/companion/modules/inline-clarity_lmr_read_sync.js?v=20261103P3",
      "/companion/modules/inline-nx-tajweed-deep-studio-js-v1.js?v=20261103P3",
      "/companion/modules/nx-tj-lmr-js-v1.js?v=20261103P3"
    ],
    calligraphy: [
      "/companion/modules/inline-clarity_callig_pad_boot.js?v=20261103P3"
    ],
    meme: [
      "/companion/modules/inline-clarity-meme-canvas-clean-v1.js?v=20261103P3",
      "/companion/modules/inline-clarity-meme-online-bg-v1.js?v=20261103P3",
      "/companion/modules/inline-clarity_meme_unlock_v2.js?v=20261103P3",
      "/companion/modules/inline-clarity_meme_push_cards.js?v=20261103P3",
      "/companion/modules/inline-clarity-tj-meme-tweet-revamp-js.js?v=20261103P3",
      "/companion/modules/inline-bundle-meme-v1.js?v=20261103P3"
    ],
    notes: [
      "/companion/modules/clarity-notes-recovery-v1.js?v=20261103P3"
    ]
  };

  function loadScript(src) {
    return new Promise(function (resolve) {
      if (loaded[src]) return resolve(src);
      /* skip if same path already in DOM */
      var bare = src.split("?")[0];
      var exists = d.querySelector('script[src*="' + bare.replace(/"/g, "") + '"]');
      if (exists) {
        loaded[src] = true;
        return resolve(src);
      }
      var s = d.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = function () {
        loaded[src] = true;
        log("loaded " + bare);
        resolve(src);
      };
      s.onerror = function () {
        log("fail " + bare);
        resolve(src);
      };
      d.head.appendChild(s);
    });
  }

  function loadGroup(name) {
    var list = GROUPS[name];
    if (!list) return Promise.resolve();
    if (w.__CLARITY_CRAFT_DONE__ && w.__CLARITY_CRAFT_DONE__[name]) {
      return Promise.resolve();
    }
    w.__CLARITY_CRAFT_DONE__ = w.__CLARITY_CRAFT_DONE__ || {};
    log("group " + name);
    return list.reduce(function (p, src) {
      return p.then(function () { return loadScript(src); });
    }, Promise.resolve()).then(function () {
      w.__CLARITY_CRAFT_DONE__[name] = true;
      /* integrity meters once */
      if (!w.__CLARITY_CRAFT_INTEGRITY_LOADED__) {
        w.__CLARITY_CRAFT_INTEGRITY_LOADED__ = true;
        loadScript("/companion/assets/clarity-craft-integrity-v35.js?v=20261103P35");
      }
      try {
        d.dispatchEvent(new CustomEvent("clarity-craft-ready", { detail: { group: name } }));
      } catch (e) {}
    });
  }

  function inferFromHash() {
    var h = (w.location.hash || "").replace(/^#/, "").toLowerCase();
    if (/tajweed|lmr|read/.test(h)) return "tajweed";
    if (/callig|calligraphy|pad/.test(h)) return "calligraphy";
    if (/meme|tweet/.test(h)) return "meme";
    if (/notes?/.test(h)) return "notes";
    return null;
  }

  function inferFromDoor(id) {
    id = String(id || "").toLowerCase();
    if (/tajweed|lmr/.test(id)) return "tajweed";
    if (/callig|calligraphy/.test(id)) return "calligraphy";
    if (/meme/.test(id)) return "meme";
    if (/notes?/.test(id)) return "notes";
    return null;
  }

  w.clarityLoadCraft = loadGroup;

  /* Hook door open without breaking existing API */
  var prevDoor = w.clarityOpenSectionDoor;
  w.clarityOpenSectionDoor = function (id) {
    var g = inferFromDoor(id);
    if (g) loadGroup(g);
    if (typeof prevDoor === "function") return prevDoor.apply(this, arguments);
  };

  /* Hash navigation */
  w.addEventListener("hashchange", function () {
    var g = inferFromHash();
    if (g) loadGroup(g);
  });

  /* Idle: prewarm nothing aggressive — only if hash already craft */
  function boot() {
    var g = inferFromHash();
    if (g) loadGroup(g);
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();

  /* idle prewarm craft so tajweed/meme/calligraphy feel rich without blocking first paint */
  function prewarm() {
    try {
      if (typeof w.requestIdleCallback === "function") {
        w.requestIdleCallback(function () {
          loadGroup("tajweed");
          loadGroup("calligraphy");
          loadGroup("meme");
        }, { timeout: 4000 });
      } else {
        setTimeout(function () {
          loadGroup("tajweed");
          loadGroup("calligraphy");
          loadGroup("meme");
        }, 2500);
      }
    } catch (e) {}
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(prewarm, 500); });
  else setTimeout(prewarm, 500);

  /* Optional: after 8s idle on companion, do not auto-load craft (keeps first paint light) */
})(window, document);
