/*! amana-fortify-boot M5 · sealed after unlock · non-blocking */
(function (w) {
  "use strict";
  if (w.__CLARITY_VAULT_FORTRESS_BOOT_M5__) return;
  w.__CLARITY_VAULT_FORTRESS_BOOT_M5__ = true;
  var SEALED = [
    "/amana/sealed/dayn-ledger-v2.js",
    "/amana/sealed/dayn-mount-adapter-v1.js",
    "/amana/sealed/dayn-section-bridge-v2.js",
    "/amana/sealed/dayn-enrich-v3.js"
  ];
  var loading = null;
  function loadScript(src) {
    return new Promise(function (resolve) {
      var s = document.createElement("script");
      s.src = src + "?v=20261102M5";
      s.async = true;
      s.onload = function () { resolve(src); };
      s.onerror = function () { resolve(src); };
      document.head.appendChild(s);
    });
  }
  w.ClarityLoadAmanaSealed = function () {
    if (loading) return loading;
    loading = Promise.resolve();
    SEALED.forEach(function (src) {
      loading = loading.then(function () {
        return new Promise(function (r) {
          setTimeout(function () {
            loadScript(src).then(r);
          }, 30);
        });
      });
    });
    loading = loading.then(function () {
      try { document.dispatchEvent(new CustomEvent("clarity-amana-sealed-ready")); } catch (e) {}
      return "ready";
    });
    return loading;
  };
  w.ClarityEnterAmana = function () { return w.ClarityLoadAmanaSealed(); };
})(window);
