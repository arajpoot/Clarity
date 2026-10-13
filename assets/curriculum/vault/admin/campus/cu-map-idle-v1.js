/* NC3 — Map idle hydrate */
(function (g) {
  "use strict";
  if (g.__CU_MAP_IDLE_V1__) return;
  g.__CU_MAP_IDLE_V1__ = true;

  var VER = "20261013NC3";
  var SECONDARY = [
    "/assets/curriculum/vault/admin/campus/cu-learner-v1.js",
    "/assets/curriculum/vault/admin/campus/cu-ilm-path-v1.js",
    "/assets/curriculum/vault/admin/campus/cu-bab-qubul-v1.js",
    "/assets/curriculum/vault/admin/campus/cu-spark-adab-v1.js",
    "/assets/curriculum/vault/admin/campus/campus-wings-bridge-v1.js"
  ];

  function load(src) {
    return new Promise(function (resolve) {
      var base = src.split("/").pop();
      if (document.querySelector('script[src*="' + base + '"]')) return resolve(true);
      var s = document.createElement("script");
      s.src = src + "?v=" + VER;
      s.defer = true;
      s.onload = function () {
        resolve(true);
      };
      s.onerror = function () {
        resolve(false);
      };
      document.head.appendChild(s);
    });
  }

  function run() {
    var c = Promise.resolve();
    SECONDARY.forEach(function (src) {
      c = c.then(function () {
        return load(src);
      });
    });
  }

  function schedule() {
    if (g.requestIdleCallback) g.requestIdleCallback(run, { timeout: 2000 });
    else setTimeout(run, 350);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", schedule);
  else schedule();
})(typeof window !== "undefined" ? window : this);
