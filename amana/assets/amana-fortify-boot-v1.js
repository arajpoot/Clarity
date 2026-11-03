/*! amana-fortify-boot-v1 · loads sealed Dayn chain · educational — not a fatwa */
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
      s.src = src + (src.indexOf("?") >= 0 ? "&" : "?") + "v=20261102DN";
      s.async = false;
      s.onload = function () { resolve(src); };
      s.onerror = function () { reject(new Error("fail " + src)); };
      document.head.appendChild(s);
    });
  }

  w.ClarityLoadAmanaSealed = function () {
    if (loading) return loading;
    loading = SEALED.reduce(function (p, src) {
      return p.then(function () {
        return loadScript(src).catch(function (e) {
          try { console.warn("[Amānah] sealed optional", src, e); } catch (e2) {}
        });
      });
    }, Promise.resolve()).then(function () {
      try {
        if (typeof w.ClarityDaynMount === "function") w.ClarityDaynMount();
        if (typeof w.ClarityDaynBridgeInit === "function") w.ClarityDaynBridgeInit();
        document.dispatchEvent(new CustomEvent("clarity-amana-sealed-ready"));
      } catch (e3) {}
      return "ready";
    });
    return loading;
  };

  w.ClarityEnterAmana = function () {
    return w.ClarityLoadAmanaSealed();
  };

  /* Auto-load on dayn page if session unlocked */
  function maybeAutoload() {
    try {
      if (sessionStorage.getItem("clarity_amana_session_unlocked_v1") === "1") {
        w.ClarityLoadAmanaSealed();
      }
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", maybeAutoload);
  else maybeAutoload();
})(window);
