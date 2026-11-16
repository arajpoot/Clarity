/*! companion-foundation-v1 · calm hydrate coordinator */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_FOUNDATION_V1__) return;
  w.__COMPANION_FOUNDATION_V1__ = true;
  var LOG = (w.__COMPANION_FOUNDATION_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }
  function fixNav() {
    d.querySelectorAll('a[href="/yawm/"],a[href="/yawm"]').forEach(function (a) {
      a.setAttribute("href", "/daily/");
    });
  }
  function rehydrate() {
    fixNav();
    try {
      if (w.ClarityTabEngines && typeof w.ClarityTabEngines.hydrate === "function") {
        w.ClarityTabEngines.hydrate();
      }
    } catch (e) {}
    log("foundation-hydrate");
  }
  function boot() {
    fixNav();
    rehydrate();
    setTimeout(rehydrate, 500);
    setTimeout(rehydrate, 1500);
    setTimeout(rehydrate, 3000);
    log("foundation-boot");
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
