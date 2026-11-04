/*! companion-craft-core-v1 · N2 eager meme/tajweed/callig cores · campus untouched */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_CRAFT_CORE_V1__) return;
  w.__CLARITY_CRAFT_CORE_V1__ = true;

  var LOG = (w.__COMPANION_CRAFT_LOG = w.__COMPANION_CRAFT_LOG || []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  var CORE = [
    "/companion/assets/clarity-meme-api-bridge-v1.js?v=20261104EC",
    "/companion/modules/inline-clarity_lmr_read_sync.js?v=20261104N02",
    "/companion/modules/nx-tj-lmr-js-v1.js?v=20261104N02",
    "/companion/modules/inline-nx-tajweed-deep-studio-js-v1.js?v=20261104N02",
    "/companion/modules/inline-clarity_callig_pad_boot.js?v=20261104N02",
    "/companion/modules/inline-clarity-meme-canvas-clean-v1.js?v=20261104N02",
    "/companion/modules/inline-bundle-meme-v1.js?v=20261104N02",
    "/companion/modules/inline-clarity_meme_unlock_v2.js?v=20261104N02",
    "/companion/assets/clarity-craft-integrity-v35.js?v=20261104N02"
  ];

  var EXTRA = [
    "/companion/modules/inline-clarity-meme-online-bg-v1.js?v=20261104N02",
    "/companion/modules/inline-clarity_meme_push_cards.js?v=20261104N02",
    "/companion/modules/inline-clarity-tj-meme-tweet-revamp-js.js?v=20261104N02"
  ];

  var loaded = {};

  function loadScript(src) {
    return new Promise(function (resolve) {
      var bare = src.split("?")[0];
      if (loaded[bare]) return resolve(bare);
      if (d.querySelector('script[src*="' + bare.replace(/"/g, "") + '"]')) {
        loaded[bare] = true;
        return resolve(bare);
      }
      var s = d.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = function () {
        loaded[bare] = true;
        log("core " + bare);
        resolve(bare);
      };
      s.onerror = function () {
        log("fail " + bare);
        resolve(bare);
      };
      d.head.appendChild(s);
    });
  }

  function loadAll(list) {
    return list.reduce(function (p, src) {
      return p.then(function () { return loadScript(src); });
    }, Promise.resolve());
  }

  function boot() {
    log("core-start");
    loadAll(CORE).then(function () {
      log("core-ready");
      try {
        d.dispatchEvent(new CustomEvent("clarity-craft-ready", { detail: { group: "core" } }));
      } catch (e) {}
      try {
        if (typeof w.clarityEnsureCraftMeters === "function") w.clarityEnsureCraftMeters();
      } catch (e2) {}
      /* extras idle */
      var runExtra = function () { loadAll(EXTRA).then(function () { log("extra-ready"); }); };
      if (typeof w.requestIdleCallback === "function") {
        w.requestIdleCallback(runExtra, { timeout: 5000 });
      } else {
        setTimeout(runExtra, 3000);
      }
    });
  }

  w.clarityLoadCraft = function (name) {
    /* compat for older hooks — cores already loading */
    log("loadCraft:" + name);
    return loadAll(CORE);
  };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
