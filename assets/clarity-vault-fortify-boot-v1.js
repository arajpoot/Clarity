/*! Clarity Amānah vault fortify BOOT · 20261031DR2
 * One script tag deploys façade, isolate, digest, panel, passphrase tutorial, daily pill.
 * Educational only — not a fatwa · not legal advice.
 */
(function () {
  "use strict";
  if (window.__CLARITY_VAULT_FORTIFY_BOOT__) return;
  window.__CLARITY_VAULT_FORTIFY_BOOT__ = true;

  var VER = "20261031DR2";
  var scripts = [
    "/assets/clarity-vault-facade-v1.js?v=" + VER,
    "/assets/clarity-vault-isolate-guard-v1.js?v=" + VER,
    "/assets/clarity-vault-digest-v1.js?v=" + VER,
    "/assets/clarity-vault-export-host-v1.js?v=" + VER,
    "/assets/clarity-vault-digest-panel-v1.js?v=" + VER,
    "/assets/clarity-vault-passphrase-tutorial-v1.js?v=" + VER,
    "/vault/patches/daily-note-vault-pill.js?v=" + VER
  ];

  function loadOne(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.defer = true;
      s.onload = function () { resolve(src); };
      s.onerror = function () { reject(new Error("fail " + src)); };
      document.head.appendChild(s);
    });
  }

  function run() {
    var chain = Promise.resolve();
    scripts.forEach(function (src) {
      chain = chain.then(function () { return loadOne(src); });
    });
    chain
      .then(function () {
        try {
          window.dispatchEvent(new CustomEvent("clarity-vault-fortify-ready", { detail: { ver: VER } }));
        } catch (e) {}
        if (window.console && console.info) {
          console.info("[Clarity Vault fortify] ready", VER);
        }
      })
      .catch(function (err) {
        if (window.console && console.warn) console.warn("[Clarity Vault fortify]", err);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
