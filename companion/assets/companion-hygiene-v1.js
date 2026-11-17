/*! companion-hygiene-v1 · P17 · never hide educational cards · educational only */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_HOUSEKEEP_V1_P17__) return;
  w.__COMPANION_HOUSEKEEP_V1_P17__ = true;
  function hygiene(root) {
    root = root || d.getElementById("cs-mount");
    if (!root) return;
    var heroes = root.querySelectorAll(".cs-tab-hero");
    heroes.forEach(function (el, i) {
      if (i > 0) el.setAttribute("data-cs-extra-hero", "1");
    });
    /* do NOT hide [id$=-card] */
  }
  function boot() {
    hygiene();
    var mount = d.getElementById("cs-mount");
    if (mount) {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(function () { hygiene(mount); }, 40);
      }).observe(mount, { childList: true });
    }
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
