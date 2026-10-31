/*! Amānah Vault FORTRESS BOOT · 20261031FORT3
 * Thin public door ONLY — sealed modules under /vault/sealed/
 * Dayn is a sealed component (not a free Companion tab widget).
 * Educational only — not a fatwa · not legal/financial advice.
 */
(function () {
  "use strict";
  if (window.__CLARITY_VAULT_FORTRESS_BOOT__) return;
  window.__CLARITY_VAULT_FORTRESS_BOOT__ = true;
  var VER = "20261031FORT3";
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
  var loaded = [];
  var failed = [];

  function loadOne(name) {
    return new Promise(function (resolve) {
      var s = document.createElement("script");
      s.src = BASE + name + "?v=" + VER;
      s.defer = true;
      s.setAttribute("data-vault-sealed", "1");
      s.setAttribute("data-fortress-ver", VER);
      s.onload = function () {
        loaded.push(name);
        resolve(name);
      };
      s.onerror = function () {
        failed.push(name);
        resolve(name);
      };
      document.head.appendChild(s);
    });
  }

  function integrityReport() {
    var report = {
      ver: VER,
      loaded: loaded.slice(),
      failed: failed.slice(),
      gate: !!window.ClarityVaultGate,
      facade: !!window.ClarityVault,
      ok: failed.length === 0 && !!window.ClarityVaultGate
    };
    window.__CLARITY_VAULT_FORTRESS_REPORT__ = report;
    try {
      window.dispatchEvent(new CustomEvent("clarity-vault-fortress-ready", { detail: report }));
    } catch (e) {}
    if (window.console && console.info) {
      console.info("[Amānah Fortress]", VER, report.ok ? "integrity OK" : "integrity PARTIAL", report);
    }
    return report;
  }

  function run() {
    var chain = Promise.resolve();
    scripts.forEach(function (n) {
      chain = chain.then(function () {
        return loadOne(n);
      });
    });
    chain = chain.then(function () {
      return new Promise(function (resolve) {
        var s = document.createElement("script");
        s.src = "/vault/patches/daily-note-vault-pill.js?v=" + VER;
        s.defer = true;
        s.setAttribute("data-vault-patch", "1");
        s.onload = resolve;
        s.onerror = resolve;
        document.head.appendChild(s);
      });
    });
    chain.then(function () {
      integrityReport();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
