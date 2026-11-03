/*! amana-fortify-boot gate-aware v2
 * On the gate (/amana/) → do NOT load full Dayn sealed chain.
 * On /amana/dayn/ → load the freeze-polished Dayn chain.
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_VAULT_FORTRESS_BOOT_GATE_V2__) return;
  w.__CLARITY_VAULT_FORTRESS_BOOT_GATE_V2__ = true;
  w.__CLARITY_VAULT_FORTRESS_BOOT_V2__ = true;
  w.__CLARITY_VAULT_FORTRESS_BOOT_M5__ = true;

  function isGatePath() {
    var p = (location.pathname || "").replace(/\/+$/, "") || "/";
    return p === "/amana" || p === "/amana/index.html" || /\/amana\/?$/.test(location.pathname);
  }

  function isDaynChamber() {
    return /\/amana\/dayn\/?/.test(location.pathname || "");
  }

  // Full Dayn chain only on the Dayn chamber
  var SEALED_DAYN = [
    "/amana/sealed/dayn-ensure-s45.js",
    "/amana/sealed/dayn-mount-adapter-v2.js",
    "/amana/sealed/dayn-ledger-v2.js",
    "/amana/sealed/dayn-section-bridge-v2.js"
  ];

  // On gate: load nothing from Dayn (guard handles policy)
  var SEALED_GATE = [];

  var VERSION = "20261102G1";
  var loading = null;

  function loadScript(src) {
    return new Promise(function (resolve) {
      var name = src.split("/").pop();
      if (document.querySelector('script[src*="' + name + '"]')) {
        resolve(src);
        return;
      }
      var s = document.createElement("script");
      s.src = src + (src.indexOf("?") > -1 ? "&" : "?") + "v=" + VERSION;
      s.async = false;
      s.onload = function () { resolve(src); };
      s.onerror = function () { resolve(src); };
      document.head.appendChild(s);
    });
  }

  w.ClarityLoadAmanaSealed = function () {
    if (loading) return loading;

    var list = isDaynChamber() ? SEALED_DAYN : (isGatePath() ? SEALED_GATE : SEALED_DAYN);

    // Other chambers (heirs/tree/fiqh/wasiyyah) currently get no Dayn scripts —
    // that is intentional; Dayn lives on /amana/dayn/.

    loading = Promise.resolve();
    list.forEach(function (src) {
      loading = loading.then(function () {
        return new Promise(function (r) {
          setTimeout(function () {
            loadScript(src).then(r);
          }, 20);
        });
      });
    });

    loading = loading.then(function () {
      try {
        document.dispatchEvent(new CustomEvent("clarity-amana-sealed-ready"));
      } catch (e) {}
      return "ready";
    });
    return loading;
  };

  w.ClarityEnterAmana = function () {
    return w.ClarityLoadAmanaSealed();
  };
})(window);
