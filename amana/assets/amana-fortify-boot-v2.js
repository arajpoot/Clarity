/*! amana-fortify-boot v2 · Dayn freeze polish · sealed after unlock · non-blocking
 * Load order deliberately ordered to eliminate mount races.
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_VAULT_FORTRESS_BOOT_V2__) return;
  w.__CLARITY_VAULT_FORTRESS_BOOT_V2__ = true;
  // Keep M5 flag so older pages that check it do not double-boot
  w.__CLARITY_VAULT_FORTRESS_BOOT_M5__ = true;

  /**
   * Authoritative Dayn chain (freeze-polished):
   * 1. ensure slots (one-shot)
   * 2. mount adapter v2 (idempotent, no MutationObserver)
   * 3. ledger v2 (single UI owner)
   * 4. section-bridge (I/O + notes only — does not re-create dayn hosts)
   * 5. enrich v3 is intentionally omitted from live chain (kept in sealed/ for rollback)
   */
  var SEALED = [
    "/amana/sealed/dayn-ensure-s45.js",
    "/amana/sealed/dayn-mount-adapter-v2.js",
    "/amana/sealed/dayn-ledger-v2.js",
    "/amana/sealed/dayn-section-bridge-v2.js"
  ];

  var loading = null;
  var VERSION = "20261102D1";

  function loadScript(src) {
    return new Promise(function (resolve) {
      // Already present?
      var existing = document.querySelector('script[src*="' + src.split("/").pop() + '"]');
      if (existing) {
        resolve(src);
        return;
      }
      var s = document.createElement("script");
      s.src = src + (src.indexOf("?") > -1 ? "&" : "?") + "v=" + VERSION;
      s.async = false; // sequential for deterministic order
      s.onload = function () { resolve(src); };
      s.onerror = function () { resolve(src); }; // soft-fail
      document.head.appendChild(s);
    });
  }

  w.ClarityLoadAmanaSealed = function () {
    if (loading) return loading;
    loading = Promise.resolve();
    SEALED.forEach(function (src) {
      loading = loading.then(function () {
        return new Promise(function (r) {
          // small stagger still helps older devices without creating races
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
      if (w.ClarityAmanaDayn && typeof w.ClarityAmanaDayn.markReady === "function") {
        try { w.ClarityAmanaDayn.markReady(); } catch (e) {}
      }
      return "ready";
    });
    return loading;
  };

  w.ClarityEnterAmana = function () {
    return w.ClarityLoadAmanaSealed();
  };
})(window);
