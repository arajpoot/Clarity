/* FD5 — load vault heavy modules after unlock (or if already unlocked) */
(function (g) {
  "use strict";
  if (g.__CU_VAULT_WINGS_V1__) return;
  g.__CU_VAULT_WINGS_V1__ = true;

  var VER = "20261014FD";
  var HEAVY = [
    "/assets/curriculum/vault/admin/vault/cu-vault-uft-v1.js?v=" + VER,
    "/assets/curriculum/vault/admin/vault/cu-vault-faraid-v1.js?v=" + VER,
    "/assets/curriculum/vault/admin/vault/cu-vault-print-v1.js?v=" + VER,
    "/assets/curriculum/vault/admin/vault/cu-vault-json-import-v1.js?v=" + VER,
    "/assets/curriculum/vault/admin/vault/cu-vault-integrity-v1.js?v=" + VER,
    "/assets/curriculum/vault/admin/vault/cu-vault-amana-unit-v1.js?v=" + VER
  ];
  var loaded = false;

  function loadAll() {
    if (loaded) return Promise.resolve();
    loaded = true;
    var chain = Promise.resolve();
    HEAVY.forEach(function (src) {
      chain = chain.then(function () {
        return new Promise(function (resolve) {
          var base = src.split("?")[0].split("/").pop();
          if (document.querySelector('script[src*="' + base + '"]')) return resolve();
          var s = document.createElement("script");
          s.src = src;
          s.onload = function () {
            resolve();
          };
          s.onerror = function () {
            resolve();
          };
          document.body.appendChild(s);
        });
      });
    });
    return chain.then(function () {
      try {
        g.dispatchEvent(new CustomEvent("cu-vault-wings-ready"));
      } catch (e) {}
    });
  }

  g.ClarityVaultWings = { load: loadAll };

  /* Hook common unlock success events + button */
  function arm() {
    document.addEventListener("cu-vault-unlocked", function () {
      loadAll();
    });
    var btn = document.getElementById("vault-unlock-btn");
    if (btn) {
      btn.addEventListener(
        "click",
        function () {
          setTimeout(function () {
            var mods = document.getElementById("vault-modules");
            if (mods && mods.offsetParent !== null) loadAll();
            /* also if session flag */
            try {
              if (sessionStorage.getItem("cu_vault_unlocked_v1") === "1") loadAll();
            } catch (e) {}
          }, 400);
        },
        true
      );
    }
    try {
      if (sessionStorage.getItem("cu_vault_unlocked_v1") === "1") loadAll();
    } catch (e2) {}
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", arm);
  else arm();
})(typeof window !== "undefined" ? window : this);
