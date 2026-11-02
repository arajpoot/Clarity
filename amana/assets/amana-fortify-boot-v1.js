/*! amana fortify A3 · sealed under /amana/sealed/ */
(function (w) {
  "use strict";
  if (w.__CLARITY_VAULT_FORTRESS_BOOT_A3__) return;
  w.__CLARITY_VAULT_FORTRESS_BOOT_A3__ = true;

  var VER = "20261101A3";
  var BASE = "/amana/sealed/";
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
  var loading = null;
  var loaded = false;

  function loadOne(n) {
    return new Promise(function (res, rej) {
      var id = "a3-sealed-" + n.replace(/\W+/g, "_");
      if (document.getElementById(id)) return res(n);
      var s = document.createElement("script");
      s.id = id;
      s.src = BASE + n + "?v=" + VER;
      s.defer = true;
      s.onload = function () { res(n); };
      s.onerror = function () { rej(new Error("sealed fail: " + n)); };
      document.head.appendChild(s);
    });
  }

  function loadSealed() {
    if (loaded) return Promise.resolve("loaded");
    if (loading) return loading;
    loading = Promise.resolve();
    scripts.forEach(function (n) {
      loading = loading.then(function () { return loadOne(n); });
    });
    loading = loading.then(function () {
      loaded = true;
      try {
        document.documentElement.setAttribute("data-amana-sealed", "ready");
        document.dispatchEvent(new CustomEvent("clarity-amana-sealed-ready"));
      } catch (e) {}
      return "ready";
    }).catch(function (err) {
      loading = null;
      try { console.warn("[Amānah]", err); } catch (e) {}
      throw err;
    });
    return loading;
  }

  w.ClarityLoadAmanaSealed = loadSealed;
  w.ClarityEnterAmana = function (opts) {
    opts = opts || {};
    return loadSealed().then(function () {
      try {
        if (typeof w.ClarityAmanaSetUnlocked === "function") w.ClarityAmanaSetUnlocked(true);
        document.dispatchEvent(new CustomEvent("clarity-amana-enter"));
      } catch (e) {}
      return "entered";
    });
  };

  // Auto-load on Amānah paths
  function maybe() {
    try {
      var p = (w.location.pathname || "");
      if (p.indexOf("/amana") === 0) loadSealed();
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", maybe);
  else maybe();
  setTimeout(maybe, 600);
})(window);
