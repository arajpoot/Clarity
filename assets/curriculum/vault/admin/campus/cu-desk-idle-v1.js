/* NC2 — Desk idle loader: secondary scripts after first paint */
(function (g) {
  "use strict";
  if (g.__CU_DESK_IDLE_V1__) return;
  g.__CU_DESK_IDLE_V1__ = true;

  var VER = "20261014NC2";
  var SECONDARY = [
    "/assets/curriculum/vault/admin/campus/cu-overlay-housekeep-v1.js?v=" + VER,
    "/assets/curriculum/vault/admin/campus/cu-continue-flow-v1.js?v=" + VER,
    "/assets/curriculum/vault/admin/campus/cu-mirath-desk-v1.js?v=" + VER,
    "/assets/curriculum/vault/admin/campus/cu-phase5-polish-v1.js?v=" + VER,
    "/assets/curriculum/vault/admin/campus/cu-smooth-runtime-v1.js?v=" + VER
  ];

  var loaded = {};

  function load(src) {
    return new Promise(function (resolve) {
      var base = src.split("?")[0].split("/").pop();
      if (loaded[base]) return resolve(true);
      if (document.querySelector('script[src*="' + base + '"]')) {
        loaded[base] = true;
        return resolve(true);
      }
      var s = document.createElement("script");
      s.src = src;
      s.defer = true;
      s.onload = function () {
        loaded[base] = true;
        resolve(true);
      };
      s.onerror = function () {
        resolve(false);
      };
      document.body.appendChild(s);
    });
  }

  function run() {
    var chain = Promise.resolve();
    SECONDARY.forEach(function (src) {
      chain = chain.then(function () {
        return load(src);
      });
    });
    return chain.then(function () {
      try {
        g.dispatchEvent(new CustomEvent("cu-desk-idle-ready"));
      } catch (e) {}
    });
  }

  function schedule() {
    if (g.requestIdleCallback) {
      g.requestIdleCallback(function () {
        run();
      }, { timeout: 2200 });
    } else {
      setTimeout(run, 400);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", schedule);
  } else schedule();
})(typeof window !== "undefined" ? window : this);
