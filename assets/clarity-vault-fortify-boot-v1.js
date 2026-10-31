/*! Amānah Vault FORTRESS BOOT · 20261031FORT2
 * Thin public door — sealed modules under /vault/sealed/
 * runtime-gate first to stop UI leakage into other Companion tabs
 */
(function () {
  "use strict";
  if (window.__CLARITY_VAULT_FORTRESS_BOOT__) return;
  window.__CLARITY_VAULT_FORTRESS_BOOT__ = true;
  var VER = "20261031FORT2";
  var BASE = "/vault/sealed/";
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
    "passphrase-tutorial-v1.js"
  ];
  function loadOne(name) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = BASE + name + "?v=" + VER;
      s.defer = true;
      s.setAttribute("data-vault-sealed", "1");
      s.onload = function () { resolve(name); };
      s.onerror = function () { reject(new Error("sealed load fail " + name)); };
      document.head.appendChild(s);
    });
  }
  function run() {
    var chain = Promise.resolve();
    scripts.forEach(function (n) {
      chain = chain.then(function () { return loadOne(n); });
    });
    chain = chain.then(function () {
      return new Promise(function (resolve) {
        var s = document.createElement("script");
        s.src = "/vault/patches/daily-note-vault-pill.js?v=" + VER;
        s.defer = true;
        s.onload = resolve;
        s.onerror = resolve;
        document.head.appendChild(s);
      });
    });
    chain
      .then(function () {
        try {
          window.dispatchEvent(new CustomEvent("clarity-vault-fortress-ready", { detail: { ver: VER } }));
        } catch (e) {}
        if (window.console && console.info) console.info("[Amānah Fortress]", VER, "ready (gated)");
      })
      .catch(function (err) {
        if (window.console && console.warn) console.warn("[Amānah Fortress]", err);
      });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
