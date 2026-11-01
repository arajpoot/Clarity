/*! Companion surface fortress boot · 20261031COMP1
 * Loads sealed Amānah stack from /companion/sealed/
 */
(function () {
  "use strict";
  if (window.__CLARITY_VAULT_FORTRESS_BOOT__) return;
  window.__CLARITY_VAULT_FORTRESS_BOOT__ = true;
  var VER = "20261031COMP1";
  var BASE = "/companion/sealed/";
  var scripts = [
    "runtime-gate-v1.js",
    "facade-v1.js",
    "isolate-guard-v1.js",
    "digest-v1.js",
    "export-host-v1.js",
    "digest-panel-v1.js",
    "dayn-section-bridge-v2.js",
    "dayn-mount-adapter-v1.js",
    "dayn-ledger-v2.js",
    "dayn-enrich-v3.js",
    "dayn-ensure-s45.js",
    "passphrase-tutorial-v1.js"
  ];
  function loadOne(name) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = BASE + name + "?v=" + VER;
      s.defer = true;
      s.setAttribute("data-vault-sealed", "1");
      s.setAttribute("data-companion-surface", "1");
      s.onload = function () { resolve(name); };
      s.onerror = function () { reject(new Error("companion sealed fail " + name)); };
      document.head.appendChild(s);
    });
  }
  function run() {
    var chain = Promise.resolve();
    scripts.forEach(function (n) {
      chain = chain.then(function () { return loadOne(n); });
    });
    chain
      .then(function () {
        try {
          window.dispatchEvent(new CustomEvent("clarity-companion-surface-ready", { detail: { ver: VER } }));
        } catch (e) {}
        if (window.console && console.info) console.info("[Companion surface]", VER, "ready");
      })
      .catch(function (err) {
        if (window.console && console.warn) console.warn("[Companion surface]", err);
      });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
