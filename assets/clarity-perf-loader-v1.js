/**
 * Clarity performance loader — 20261018PERF
 * Phase 2: lazy vault stack on Amana tab / idle
 * Phase 4: idle secondary assets
 * University / campus untouched.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_PERF_LOADER_V1__) return;
  g.__CLARITY_PERF_LOADER_V1__ = true;

  var VER = "20261018PERF";
  var vaultLoaded = false;
  var idleLoaded = false;

  var VAULT_JS = [
    "/assets/amana-phase1-local-guard.js?v=" + VER,
    "/assets/clarity-amana-live-gate-js-v1.js?v=" + VER,
    "/assets/clarity-amana-live-secure-login-v1.js?v=" + VER,
    "/assets/clarity-amana-live-input-fix-v1.js?v=" + VER,
    "/assets/clarity-amana-live-single-path-v1.js?v=" + VER,
    "/assets/clarity-amana-live-unlock-fix-v1.js?v=" + VER,
    "/assets/clarity-amana-worksheet-v1.js?v=" + VER,
    "/assets/clarity-amana-prepare-tonight-v1.js?v=" + VER,
    "/assets/clarity-amana-focus-v1.js?v=" + VER,
    "/assets/clarity-amana-vault-nuros-v1.js?v=" + VER,
    "/assets/clarity-amana-vault-bridge-v1.js?v=" + VER
  ];

  var IDLE_JS = [
    "/assets/clarity-meme-bg-fetch-v1.js?v=" + VER
  ];

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      try {
        if (document.querySelector('script[src="' + src + '"]')) {
          resolve();
          return;
        }
        var s = document.createElement("script");
        s.src = src;
        s.defer = true;
        s.onload = function () {
          resolve();
        };
        s.onerror = function () {
          resolve();
        }; /* soft-fail */
        (document.body || document.documentElement).appendChild(s);
      } catch (e) {
        resolve();
      }
    });
  }

  function loadSeq(list) {
    var p = Promise.resolve();
    list.forEach(function (src) {
      p = p.then(function () {
        return loadScript(src);
      });
    });
    return p;
  }

  function ensureVault() {
    if (vaultLoaded) return Promise.resolve();
    vaultLoaded = true;
    return loadSeq(VAULT_JS);
  }

  function ensureIdle() {
    if (idleLoaded) return;
    idleLoaded = true;
    loadSeq(IDLE_JS);
  }

  function isVaultSurface() {
    try {
      var tab = document.getElementById("tab-notes");
      if (tab && tab.classList.contains("active")) return true;
      if (document.body && document.body.getAttribute("data-active-tab") === "notes")
        return true;
      var hash = (g.location && g.location.hash) || "";
      if (/notes|vault|amana/i.test(hash)) return true;
    } catch (e) {}
    return false;
  }

  function onVaultIntent(ev) {
    try {
      var t = ev && ev.target;
      if (!t) return;
      var el = t.closest
        ? t.closest(
            '[data-tab="notes"], #tab-btn-notes, a[href*="notes"], a[href*="vault"], #amana-vault-host, .mb-tab'
          )
        : null;
      if (el) ensureVault();
      /* bottom Amana Vault tab label */
      if (t.textContent && /Amana Vault|Vault/i.test(t.textContent) && t.closest(".mb-tab, .nav-tab, button")) {
        ensureVault();
      }
    } catch (e) {}
  }

  function boot() {
    document.addEventListener("click", onVaultIntent, true);
    document.addEventListener("pointerdown", onVaultIntent, true);

    if (isVaultSurface()) {
      ensureVault();
    }

    /* Idle: preload vault after first paint so first open is warm */
    function armIdle() {
      ensureIdle();
      var run = function () {
        if (!vaultLoaded) {
          /* warm cache without forcing execution order beyond load */
          ensureVault();
        }
      };
      if ("requestIdleCallback" in g) {
        g.requestIdleCallback(run, { timeout: 6000 });
      } else {
        setTimeout(run, 4000);
      }
    }
    if (document.readyState === "complete") armIdle();
    else g.addEventListener("load", armIdle);

    g.clarityEnsureVault = ensureVault;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(window);
