/* L5 wings - extras only if localStorage.cu_wings_extra=1 */
(function (g) {
  "use strict";
  if (g.__CU_FLASH_WINGS_V1__) return;
  g.__CU_FLASH_WINGS_V1__ = true;
  var VER = "20261016L4L6";
  var page = (document.body && document.body.getAttribute("data-campus-page")) || "";
  var phase = (document.body && document.body.getAttribute("data-phase-room")) || "";
  var path = location.pathname || "";
  var extra = false;
  try { extra = localStorage.getItem("cu_wings_extra") === "1"; } catch (e) {}

  var COMMON = [
    "/campus/assets/js/cu-mahtaab-hydrate-v1.js?v=" + VER,
    "/campus/assets/js/cu-overlay-housekeep-v1.js?v=" + VER
  ];
  var MAP = [
    "/campus/assets/js/cu-flash-prefetch-v1.js?v=" + VER
  ];
  var MAP_EXTRA = [
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
  function loadScript(src) {
    return new Promise(function (resolve) {
      var base = src.split("?")[0].split("/").pop();
      if (!base) return resolve(false);
      if (document.querySelector('script[src*="' + base + '"]')) return resolve(true);
      var s = document.createElement("script");
      s.src = src;
      s.defer = true;
      s.onload = function () { resolve(true); };
      s.onerror = function () { resolve(false); };
      document.head.appendChild(s);
    });
  }
  function idle(fn) {
    if (typeof requestIdleCallback === "function") requestIdleCallback(function () { fn(); }, { timeout: 2500 });
    else setTimeout(fn, 200);
  }
  function run() {
    var list = COMMON.slice();
    if (isMap()) {
      list = list.concat(MAP);
      if (extra) list = list.concat(MAP_EXTRA);
    } else if (isDeskHub()) {
      list = list.concat(DESK_HUB);
    }
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
