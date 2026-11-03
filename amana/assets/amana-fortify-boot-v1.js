/*! amana-fortify + engine sealed load */
(function (w) {
  "use strict";
  if (w.__CLARITY_VAULT_FORTRESS_BOOT_A3__) return;
  w.__CLARITY_VAULT_FORTRESS_BOOT_A3__ = true;
  var SEALED = [
    "/amana/sealed/dayn-ledger-v2.js",
    "/amana/sealed/dayn-mount-adapter-v1.js",
    "/amana/sealed/dayn-section-bridge-v2.js",
    "/amana/sealed/dayn-enrich-v3.js",
    "/amana/sealed/dayn-ensure-s45.js"
  ];
  var loading = null;
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src + "?v=20261102ENG";
      s.async = false;
      s.onload = function () { resolve(src); };
      s.onerror = function () { reject(new Error(src)); };
      document.head.appendChild(s);
    });
  }
  w.ClarityLoadAmanaSealed = function () {
    if (loading) return loading;
    loading = SEALED.reduce(function (p, src) {
      return p.then(function () {
        return loadScript(src).catch(function (e) {
          try { console.warn("[Amānah] sealed", src, e); } catch (e2) {}
        });
      });
    }, Promise.resolve()).then(function () {
      try {
        document.dispatchEvent(new CustomEvent("clarity-amana-sealed-ready"));
      } catch (e3) {}
      return "ready";
    });
    return loading;
  };
  w.ClarityEnterAmana = function () {
    return w.ClarityLoadAmanaSealed();
  };
})(window);
