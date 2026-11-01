/*! Companion HOME fortress · 20261031HOME1
 * Surface: /companion/ — parallel to /daily/ and / */
(function () {
  "use strict";
  if (window.__CLARITY_VAULT_FORTRESS_BOOT__) return;
  window.__CLARITY_VAULT_FORTRESS_BOOT__ = true;
  var VER = "20261031HOME1";
  var BASE = "/companion/sealed/";
  var scripts = [
    "runtime-gate-v1.js", "facade-v1.js", "isolate-guard-v1.js",
    "digest-v1.js", "export-host-v1.js", "digest-panel-v1.js",
    "dayn-section-bridge-v2.js", "dayn-mount-adapter-v1.js",
    "dayn-ledger-v2.js", "dayn-enrich-v3.js", "dayn-ensure-s45.js",
    "passphrase-tutorial-v1.js"
  ];
  function loadOne(name) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = BASE + name + "?v=" + VER;
      s.defer = true;
      s.setAttribute("data-companion-surface", "1");
      s.onload = function () { resolve(name); };
      s.onerror = function () { reject(new Error(name)); };
      document.head.appendChild(s);
    });
  }
  function run() {
    var c = Promise.resolve();
    scripts.forEach(function (n) { c = c.then(function () { return loadOne(n); }); });
    c.then(function () {
      try { window.dispatchEvent(new CustomEvent("clarity-companion-home-ready", { detail: { ver: VER } })); } catch (e) {}
      if (window.console && console.info) console.info("[Companion HOME]", VER);
    }).catch(function (e) { if (window.console) console.warn("[Companion HOME]", e); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
