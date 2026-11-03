/*! companion fortify C2 · 20261101C2 · sealed only under /companion/sealed/ */
(function (w) {
  "use strict";
  if (w.__CLARITY_VAULT_FORTRESS_BOOT_C2__) return;
  w.__CLARITY_VAULT_FORTRESS_BOOT_C2__ = true;

  var VER = "20261101C2";
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
  var loading = null;
  var loaded = false;

  function loadOne(n) {
    return new Promise(function (res, rej) {
      var id = "c2-sealed-" + n.replace(/\W+/g, "_");
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
      try { console.warn("[Companion Amānah]", err); } catch (e) {}
      throw err;
    });
    return loading;
  }

  w.ClarityLoadAmanaSealed = loadSealed;

  function wantsAmana() {
    try {
      var h = (w.location.hash || "").toLowerCase();
      if (/notes|amana|vault|heir/.test(h)) return true;
      var q = (w.location.search || "").toLowerCase();
      if (/enter=amana|enter=vault|enter=notes/.test(q)) return true;
      var tab = document.getElementById("tab-notes");
      if (tab && tab.classList && (tab.classList.contains("active") || tab.classList.contains("amana-unlocked"))) return true;
    } catch (e) {}
    return false;
  }

  function maybe() {
    if (wantsAmana()) loadSealed();
  }

  /* Enter Amānah from Companion only — hash + notes tab */
  function enterAmana(opts) {
    opts = opts || {};
    try {
      if (opts.hash !== false) {
        var h = opts.hash || "notes";
        if ((w.location.hash || "") !== "#" + h) w.location.hash = h;
      }
    } catch (e) {}
    return loadSealed().then(function () {
      try {
        var tab = document.getElementById("tab-notes");
        if (tab && typeof tab.click === "function") tab.click();
      } catch (e2) {}
      try {
        document.dispatchEvent(new CustomEvent("clarity-amana-enter"));
      } catch (e3) {}
      return "entered";
    });
  }
  w.ClarityEnterAmana = enterAmana;

  document.addEventListener("click", function (ev) {
    try {
      var t = ev.target && ev.target.closest && ev.target.closest(
        "#tab-notes, [data-rail-tab='notes'], [data-enter-amana], a[href='#notes'], a[href='#amana'], a[href='#vault']"
      );
      if (t) loadSealed();
    } catch (e) {}
  }, true);

  w.addEventListener("hashchange", maybe);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", maybe);
  else maybe();
  /* soft delayed check for deep links */
  setTimeout(maybe, 800);
})(window);
