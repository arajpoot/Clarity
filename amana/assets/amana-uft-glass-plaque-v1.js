/*! Amānah UFT · glass plaque + horizontal harden v1
 * Force horizontal classes, open bands, re-apply after render
 * Educational only — not a legal pedigree
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_GLASS_PLAQUE_V1__) return;
  w.__CLARITY_AMANA_UFT_GLASS_PLAQUE_V1__ = true;

  function isTree() {
    return /\/amana\/tree\/?/.test(location.pathname || "") || !!d.getElementById("uft-stage");
  }

  function hardenHorizontal() {
    var preview = d.getElementById("uft-preview") || d.getElementById("uft-stage");
    if (!preview) return;
    var mode = "h";
    try {
      var v = localStorage.getItem("clarity_uft_orient_v1");
      if (v === "v" || v === "h") mode = v;
    } catch (e) {}
    preview.classList.add("uft-tree");
    preview.classList.toggle("uft-orient-h", mode === "h");
    preview.classList.toggle("uft-orient-v", mode === "v");

    /* Open all generation bands so horizontal row has content */
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf("clarity_uft_band_") === 0) localStorage.setItem(k, "on");
      }
    } catch (e2) {}
    d.querySelectorAll(".uft-band.collapsed").forEach(function (el) {
      el.classList.remove("collapsed");
    });

    /* Ensure zoom layer can grow horizontally */
    var layer = d.getElementById("uft-zoom-layer");
    if (layer && mode === "h") {
      layer.style.minWidth = "max-content";
    }
  }

  function wrap() {
    if (typeof w.uftRender === "function" && !w.uftRender.__glass) {
      var orig = w.uftRender;
      w.uftRender = function () {
        var r = orig.apply(this, arguments);
        setTimeout(hardenHorizontal, 0);
        return r;
      };
      w.uftRender.__glass = true;
    }
  }

  function boot() {
    if (!isTree()) return;
    wrap();
    hardenHorizontal();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 500);
  setTimeout(boot, 1600);
  d.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(boot, 300);
  });
})(window, document);
