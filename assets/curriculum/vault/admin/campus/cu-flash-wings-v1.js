/* FD3 wings - 20261016AUDIT clean */
(function (g) {
  "use strict";
  if (g.__CU_FLASH_WINGS_V1__) return;
  g.__CU_FLASH_WINGS_V1__ = true;

  var VER = "20261016AUDIT";
  var page = (document.body && document.body.getAttribute("data-campus-page")) || "";
  var phase = (document.body && document.body.getAttribute("data-phase-room")) || "";
  var path = location.pathname || "";

  var COMMON = [
    "/assets/curriculum/vault/admin/campus/cu-mahtaab-hydrate-v1.js?v=" + VER,
    "/assets/curriculum/vault/admin/campus/cu-overlay-housekeep-v1.js?v=" + VER
  ];

  var MAP = [
    "/assets/curriculum/vault/admin/campus/cu-flash-prefetch-v1.js?v=" + VER,
    "/assets/curriculum/vault/admin/campus/cu-nav-phases-v1.js?v=" + VER,
    "/assets/curriculum/vault/admin/campus/cu-page-flow-v1.js?v=" + VER,
    "/assets/curriculum/vault/admin/campus/cu-map-idle-v1.js?v=" + VER
  ];

  var DESK_HUB = [
    "/assets/curriculum/vault/admin/campus/cu-continue-flow-v1.js?v=" + VER
  ];

  function isDeskHub() {
    return (path === "/campus/desk" || path === "/campus/desk/") && !phase;
  }
  function isDeskRoom() {
    return path.indexOf("/campus/desk/") >= 0 && path !== "/campus/desk/" && path !== "/campus/desk";
  }
  function isMap() {
    return path === "/campus/" || path === "/campus" || page === "map";
  }

  function loadScript(src) {
    return new Promise(function (resolve) {
      var base = src.split("?")[0].split("/").pop();
      if (!base) return resolve(false);
      if (document.querySelector('script[src*="' + base + '"]')) return resolve(true);
      if (/\.css$/i.test(base)) {
        if (document.querySelector('link[href*="' + base + '"]')) return resolve(true);
        var l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = src;
        l.onload = function () { resolve(true); };
        l.onerror = function () { resolve(false); };
        document.head.appendChild(l);
        return;
      }
      var s = document.createElement("script");
      s.src = src;
      s.defer = true;
      s.onload = function () { resolve(true); };
      s.onerror = function () { resolve(false); };
      document.head.appendChild(s);
    });
  }

  function idle(fn) {
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(function () { fn(); }, { timeout: 2500 });
    } else {
      setTimeout(fn, 200);
    }
  }

  function run() {
    var list = COMMON.slice();
    if (isMap()) list = list.concat(MAP);
    else if (isDeskHub()) list = list.concat(DESK_HUB);
    // phase rooms: COMMON only (mahtaab)

    var i = 0;
    function next() {
      if (i >= list.length) return;
      var src = list[i++];
      loadScript(src).then(function () { idle(next); });
    }
    idle(next);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})(typeof window !== "undefined" ? window : this);
