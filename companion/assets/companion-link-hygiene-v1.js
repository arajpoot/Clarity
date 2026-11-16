/*! companion-link-hygiene-v1 · P5i slim replacement for repair-v3 link bit
 * /yawm → /daily only. No mount races. Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_LINK_HYGIENE_V1__) return;
  w.__COMPANION_LINK_HYGIENE_V1__ = true;
  function fix(root) {
    root = root || d;
    try {
      root.querySelectorAll('a[href="/yawm/"],a[href="/yawm"]').forEach(function (a) {
        a.setAttribute("href", "/daily/");
      });
    } catch (e) {}
  }
  function boot() {
    fix(d);
    var m = d.getElementById("cs-mount");
    if (m && typeof MutationObserver !== "undefined") {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(function () { fix(m); }, 40);
      }).observe(m, { childList: true });
    }
    d.addEventListener("clarity:tab-mounted", function () { fix(d.getElementById("cs-mount") || d); });
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
