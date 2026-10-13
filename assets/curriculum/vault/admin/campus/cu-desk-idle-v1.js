/* NC2 — Desk idle hydrate: secondary modules after first paint */
(function (g) {
  "use strict";
  if (g.__CU_DESK_IDLE_V1__) return;
  g.__CU_DESK_IDLE_V1__ = true;

  var VER = "20261013NC2";
  var SECONDARY = [
    "/assets/curriculum/vault/admin/campus/cu-ilm-path-v1.js",
    "/assets/curriculum/vault/admin/campus/cu-deep-shelf-v1.js",
    "/assets/curriculum/vault/admin/campus/cu-local-certificate-v1.js",
    "/assets/curriculum/vault/admin/campus/cu-content-depth-v1.js",
    "/assets/curriculum/vault/admin/campus/cu-phase-plaque-local-v1.js",
    "/assets/curriculum/vault/admin/campus/campus-polish-v1.js",
    "/assets/curriculum/vault/admin/campus/cu-deploy-gate-v1.js",
    "/assets/curriculum/vault/admin/staff/role-injector-v1.js",
    "/assets/curriculum/vault/admin/campus/campus-wings-bridge-v1.js",
    "/assets/curriculum/vault/admin/campus/cu-lab-curriculum-link-v1.js",
    "/assets/curriculum/vault/admin/campus/cu-bab-qubul-v1.js"
  ];

  var loaded = {};

  function load(src) {
    return new Promise(function (resolve) {
      if (loaded[src]) return resolve(true);
      var base = src.split("/").pop();
      if (document.querySelector('script[src*="' + base + '"]')) {
        loaded[src] = true;
        return resolve(true);
      }
      var s = document.createElement("script");
      s.src = src + (src.indexOf("?") >= 0 ? "&" : "?") + "v=" + VER;
      s.defer = true;
      s.onload = function () {
        loaded[src] = true;
        resolve(true);
      };
      s.onerror = function () {
        resolve(false);
      };
      document.head.appendChild(s);
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
      }, { timeout: 2500 });
    } else {
      setTimeout(run, 400);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", schedule);
  } else schedule();
})(typeof window !== "undefined" ? window : this);
