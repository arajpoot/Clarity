/*! companion-assets-allowlist-v1 · selective root assets · companion only */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_ASSETS_ALLOWLIST_V1__) return;
  w.__CLARITY_ASSETS_ALLOWLIST_V1__ = true;

  var LOG = (w.__ALLOWLIST_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  var V = "20261104AL";
  /* ORDER: notes shim early intent already in HTML; tracks → path stable → banner restore → meme bg → shariah bg */
  var LIST = [
    "/assets/companion-track-tiles-restore-v1.css",
    "/assets/css/companion-track-tiles-restore-v1.css",
    "/assets/companion-track-unhide-v1.js",
    "/assets/companion-path-track-stable-v1.js",
    "/assets/companion-path-track-integrity-v1.js",
    "/assets/companion-notesload-shim-v1.js",
    "/assets/companion-inline/inline-clarity-banner-restore-v1.js",
    "/assets/clarity-banner-revamp-v1.css",
    "/assets/css/clarity-banner-revamp-v1.css",
    "/assets/clarity-meme-bg-fetch-v1.js",
    "/assets/craft/clarity-meme-bg-fetch-v1.js",
    "/assets/companion-inline/inline-clarity-meme-shariah-bg-v1.js",
    "/assets/companion-freeze-guard-v1.js"
  ];

  /* Prefer first success per logical group — try alternate paths */
  var GROUPS = [
    { name: "track-css", urls: [
      "/assets/css/companion-track-tiles-restore-v1.css?v=" + V,
      "/assets/companion-track-tiles-restore-v1.css?v=" + V
    ], css: true },
    { name: "track-unhide", urls: ["/assets/companion-track-unhide-v1.js?v=" + V] },
    { name: "path-stable", urls: ["/assets/companion-path-track-stable-v1.js?v=" + V] },
    { name: "path-integrity", urls: ["/assets/companion-path-track-integrity-v1.js?v=" + V] },
    { name: "notes-shim", urls: ["/assets/companion-notesload-shim-v1.js?v=" + V] },
    { name: "banner-restore", urls: ["/assets/companion-inline/inline-clarity-banner-restore-v1.js?v=" + V] },
    { name: "banner-revamp-css", urls: [
      "/assets/css/clarity-banner-revamp-v1.css?v=" + V,
      "/assets/clarity-banner-revamp-v1.css?v=" + V
    ], css: true },
    { name: "meme-bg", urls: [
      "/assets/clarity-meme-bg-fetch-v1.js?v=" + V,
      "/assets/craft/clarity-meme-bg-fetch-v1.js?v=" + V
    ] },
    { name: "meme-shariah", urls: ["/assets/companion-inline/inline-clarity-meme-shariah-bg-v1.js?v=" + V] },
    { name: "freeze-guard", urls: ["/assets/companion-freeze-guard-v1.js?v=" + V] }
  ];

  function roomOk() {
    try {
      var p = (w.location.pathname || "");
      if (p.indexOf("/campus") === 0 || p.indexOf("/amana") === 0 || p.indexOf("/daily") === 0) return false;
    } catch (e) {}
    return true;
  }

  function loadCss(href) {
    return new Promise(function (resolve) {
      var bare = href.split("?")[0];
      if (d.querySelector('link[data-allowlist="' + bare + '"]')) return resolve(true);
      var l = d.createElement("link");
      l.rel = "stylesheet";
      l.href = href;
      l.setAttribute("data-allowlist", bare);
      l.onload = function () { log("css-ok " + bare); resolve(true); };
      l.onerror = function () { log("css-fail " + bare); resolve(false); };
      d.head.appendChild(l);
    });
  }

  function loadJs(src) {
    return new Promise(function (resolve) {
      var bare = src.split("?")[0];
      if (d.querySelector('script[data-allowlist="' + bare + '"]')) return resolve(true);
      var s = d.createElement("script");
      s.src = src;
      s.async = true;
      s.setAttribute("data-allowlist", bare);
      s.onload = function () { log("js-ok " + bare); resolve(true); };
      s.onerror = function () { log("js-fail " + bare); resolve(false); };
      d.head.appendChild(s);
    });
  }

  function loadGroup(g) {
    function tryAt(i) {
      if (i >= g.urls.length) {
        log("group-miss " + g.name);
        return Promise.resolve(false);
      }
      var url = g.urls[i];
      var p = g.css ? loadCss(url) : loadJs(url);
      return p.then(function (ok) {
        if (ok) {
          log("group-ok " + g.name);
          return true;
        }
        return tryAt(i + 1);
      });
    }
    return tryAt(0);
  }

  function run() {
    if (!roomOk()) {
      log("skip-room");
      return;
    }
    log("start");
    var chain = Promise.resolve();
    GROUPS.forEach(function (g) {
      chain = chain.then(function () { return loadGroup(g); });
    });
    chain.then(function () {
      log("done");
      try {
        d.dispatchEvent(new CustomEvent("clarity-allowlist-ready"));
      } catch (e) {}
      /* re-assert track visibility once */
      try {
        d.querySelectorAll(".clarity-gate-switcher").forEach(function (el) {
          el.style.setProperty("display", "flex", "important");
          el.hidden = false;
        });
      } catch (e2) {}
    });
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", run);
  else run();
})(window, document);
