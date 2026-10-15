/* FD3 — idle wing loader for non-critical campus scripts */
(function (g) {
  "use strict";
  if (g.__CU_FLASH_WINGS_V1__) return;
  g.__CU_FLASH_WINGS_V1__ = true;

  var VER = "20261014FD6";
  var page = (document.body && document.body.getAttribute("data-campus-page")) || "";
  var path = location.pathname || "";

  var COMMON = [
    "/assets/curriculum/vault/admin/campus/cu-flash-prefetch-v1.js?v=" + VER,
    "/assets/curriculum/vault/admin/campus/cu-mahtaab-hydrate-v1.js?v=" + VER,
    "/assets/curriculum/vault/admin/campus/cu-nav-phases-v1.js?v=" + VER,
    "/assets/curriculum/vault/admin/campus/cu-overlay-housekeep-v1.js?v=" + VER,
    "/assets/curriculum/vault/admin/campus/cu-phase5-polish-v1.js?v=" + VER
  ];

  var MAP = [
    "/assets/curriculum/vault/admin/campus/cu-page-flow-v1.js?v=" + VER,
    "/assets/curriculum/vault/admin/campus/cu-lazy-wings-v1.js?v=" + VER,
    "/assets/curriculum/vault/admin/campus/cu-compass-fab-v1.js?v=" + VER,
    "/assets/curriculum/vault/admin/campus/cu-smooth-runtime-v1.js?v=" + VER,
    "/assets/curriculum/vault/admin/campus/cu-map-idle-v1.js?v=" + VER,
    "/assets/curriculum/vault/admin/campus/cu-link-trust-v1.js?v=" + VER
  ];

  var DESK = [
    "/assets/curriculum/vault/admin/campus/cu-continue-flow-v1.js?v=" + VER,
    "/assets/curriculum/vault/admin/campus/cu-mirath-desk-v1.js?v=" + VER,
    "/assets/curriculum/vault/admin/campus/cu-smooth-runtime-v1.js?v=" + VER,
    "/assets/curriculum/vault/admin/campus/cu-desk-enrich-v1.css?v=" + VER
  ];

  function isDesk() {
    return path.indexOf("/campus/desk") >= 0 || page === "desk";
  }
  function isMap() {
    return path === "/campus/" || path === "/campus" || page === "campus" || page === "map";
  }
  function isVault() {
    return path.indexOf("/vault") >= 0 || page === "vault";
  }

  function loadScript(src) {
    return new Promise(function (resolve) {
      var base = src.split("?")[0].split("/").pop();
      if (document.querySelector('script[src*="' + base + '"]')) return resolve(true);
      if (base.indexOf(".css") >= 0) {
        if (document.querySelector('link[href*="' + base + '"]')) return resolve(true);
        var l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = src;
        l.onload = function () {
          resolve(true);
        };
        l.onerror = function () {
          resolve(false);
        };
        document.head.appendChild(l);
        return;
      }
      var s = document.createElement("script");
      s.src = src;
      s.defer = true;
      s.onload = function () {
        resolve(true);
      };
      s.onerror = function () {
        resolve(false);
      };
      document.body.appendChild(s);
    });
  }

  function queue() {
    var list = COMMON.slice();
    if (isMap()) list = list.concat(MAP);
    if (isDesk()) list = list.concat(DESK);
    /* vault wings loaded by FD5 gate — skip heavy campus map brains */
    if (isVault()) {
      list = [
        "/assets/curriculum/vault/admin/campus/cu-nav-phases-v1.js?v=" + VER
      ];
    }
    var chain = Promise.resolve();
    list.forEach(function (src) {
      chain = chain.then(function () {
        return loadScript(src);
      });
    });
    return chain.then(function () {
      try {
        g.dispatchEvent(new CustomEvent("cu-flash-wings-ready"));
      } catch (e) {}
    });
  }

  function schedule() {
    if (g.requestIdleCallback) {
      g.requestIdleCallback(
        function () {
          queue();
        },
        { timeout: 1800 }
      );
    } else {
      setTimeout(queue, 350);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", schedule);
  else schedule();
})(typeof window !== "undefined" ? window : this);
