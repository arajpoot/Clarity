/*! tajweed-host-v1.js · Companion modules host
 * #tajweed → Action + #tj-deep-studio · ensure modules LMR scripts · remount
 * Educational only — not a fatwa · Version 20261128TJHOST
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_TAJWEED_HOST_V1__) return;
  w.__COMPANION_TAJWEED_HOST_V1__ = true;

  var SCRIPTS = [
    "/companion/modules/inline-clarity_lmr_read_sync.js?v=20261128TJHOST",
    "/companion/modules/nx-tj-lmr-js-v1.js?v=20261128TJHOST",
    "/companion/modules/inline-nx-tajweed-deep-studio-js-v1.js?v=20261128TJHOST"
  ];
  var CSS = ["/companion/modules/css/nx-tajweed-deep-studio-v1.css?v=20261128TJHOST"];

  function loadCss(href) {
    if (d.querySelector('link[href*="' + href.split("?")[0] + '"]')) return;
    var l = d.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    d.head.appendChild(l);
  }

  function loadScript(src) {
    return new Promise(function (resolve) {
      var bare = src.split("?")[0];
      if (d.querySelector('script[src*="' + bare + '"]')) return resolve();
      var s = d.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = function () { resolve(); };
      s.onerror = function () { resolve(); };
      d.head.appendChild(s);
    });
  }

  function ensureModules() {
    CSS.forEach(loadCss);
    return SCRIPTS.reduce(function (p, src) {
      return p.then(function () { return loadScript(src); });
    }, Promise.resolve());
  }

  function openActionDeep() {
    var btn =
      d.querySelector('#clarity-door-rail [data-rail-tab="action"]') ||
      d.querySelector('.cs-door [data-rail-tab="action"]');
    if (btn) {
      try { btn.click(); } catch (e) {}
    }
    setTimeout(function () {
      var el =
        d.getElementById("tj-deep-studio") ||
        d.getElementById("tj-lmr") ||
        d.getElementById("tajweed-path-card");
      if (el && el.scrollIntoView) {
        try { el.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e2) {
          el.scrollIntoView(true);
        }
      }
      try {
        if (typeof w.clarityWireTjLmr === "function") w.clarityWireTjLmr();
        if (typeof w.clarityBootTjDeepStudio === "function") w.clarityBootTjDeepStudio();
      } catch (e3) {}
    }, 350);
  }

  function onHash() {
    var h = (w.location.hash || "").replace(/^#/, "").toLowerCase();
    if (
      h === "tajweed" ||
      h === "tj-lmr" ||
      h === "tj-deep-studio" ||
      h === "tajweed-deep" ||
      h.indexOf("tajweed") === 0
    ) {
      ensureModules().then(openActionDeep);
    }
  }

  function onActionMount(ev) {
    try {
      var t = (ev && ev.detail && (ev.detail.tab || ev.detail.name)) || "";
      if (t && String(t).toLowerCase() !== "action") return;
    } catch (e) {}
    ensureModules().then(function () {
      setTimeout(function () {
        try {
          if (typeof w.clarityWireTjLmr === "function") w.clarityWireTjLmr();
          if (typeof w.clarityBootTjDeepStudio === "function") w.clarityBootTjDeepStudio();
        } catch (e2) {}
      }, 100);
    });
  }

  d.addEventListener("clarity:tab-mounted", onActionMount);
  w.addEventListener("clarity:tab-mounted", onActionMount);
  w.addEventListener("hashchange", onHash);

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", onHash);
  else onHash();
  setTimeout(onHash, 500);

  w.CompanionTajweedHost = { open: openActionDeep, ensure: ensureModules, version: "20261128TJHOST" };
})(window, document);
