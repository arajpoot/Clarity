/* Flash wings + Mahtaab eager (20261016ENGINES) */
(function (g) {
  "use strict";
  if (g.__CU_FLASH_WINGS_V1__) return;
  g.__CU_FLASH_WINGS_V1__ = true;

  var VER = "20261016ENGINES";
  var page = (document.body && document.body.getAttribute("data-campus-page")) || "";
  var phase = (document.body && document.body.getAttribute("data-phase-room")) || "";
  var path = location.pathname || "";
  var extra = false;
  try { extra = localStorage.getItem("cu_wings_extra") === "1"; } catch (e) {}

  var MAHTAAB = "/campus/assets/js/cu-mahtaab-hydrate-v1.js?v=" + VER;
  var HOUSEKEEP = "/campus/assets/js/cu-overlay-housekeep-v1.js?v=" + VER;

  var MAP_EXTRA = [
    "/campus/assets/js/cu-flash-prefetch-v1.js?v=" + VER,
    "/campus/assets/js/cu-nav-phases-v1.js?v=" + VER,
    "/campus/assets/js/cu-page-flow-v1.js?v=" + VER,
    "/campus/assets/js/cu-map-idle-v1.js?v=" + VER
  ];
  var DESK_HUB = [
    "/campus/assets/js/cu-continue-flow-v1.js?v=" + VER
  ];

  function isDeskHub() {
    return (path === "/campus/desk" || path === "/campus/desk/") && !phase;
  }
  function isMap() {
    return path === "/campus/" || path === "/campus" || page === "map";
  }
  function isLab() {
    return path.indexOf("/lab") === 0 || page === "lab";
  }

  function loadScript(src, eager) {
    return new Promise(function (resolve) {
      var base = src.split("?")[0].split("/").pop();
      if (!base) return resolve(false);
      if (document.querySelector('script[src*="' + base + '"]')) return resolve(true);
      var s = document.createElement("script");
      s.src = src;
      if (!eager) s.defer = true;
      s.onload = function () { resolve(true); };
      s.onerror = function () { resolve(false); };
      document.head.appendChild(s);
    });
  }

  function idle(fn) {
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(function () { fn(); }, { timeout: 1800 });
    } else setTimeout(fn, 120);
  }

  function run() {
    /* Mahtaab + housekeep: eager first on every campus/lab learning page */
    loadScript(MAHTAAB, true).then(function () {
      return loadScript(HOUSEKEEP, true);
    }).then(function () {
      var list = [];
      if (isMap()) {
        list = list.concat(MAP_EXTRA[0] ? [MAP_EXTRA[0]] : []);
        if (extra) list = list.concat(MAP_EXTRA.slice(1));
      } else if (isDeskHub()) {
        list = list.concat(DESK_HUB);
      }
      /* rooms / lab / library: mahtaab only — no map extras */
      var i = 0;
      function next() {
        if (i >= list.length) return;
        var src = list[i++];
        loadScript(src, false).then(function () { idle(next); });
      }
      if (list.length) idle(next);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})(typeof window !== "undefined" ? window : this);
