/*! Amānah UFT · tree lines boost v1
 * Force horizontal linked pedigree layout + open bands after render
 * Educational only — not a legal pedigree
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_TREE_LINES_V1__) return;
  w.__CLARITY_AMANA_UFT_TREE_LINES_V1__ = true;

  function isTree() {
    return /\/amana\/tree\/?/.test(location.pathname || "") || !!d.getElementById("uft-stage");
  }

  function openBands() {
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf("clarity_uft_band_") === 0) localStorage.setItem(k, "on");
      }
    } catch (e) {}
    d.querySelectorAll(".uft-band.collapsed").forEach(function (el) {
      el.classList.remove("collapsed");
    });
  }

  function preferHorizontal() {
    var preview = d.getElementById("uft-preview") || d.getElementById("uft-stage");
    if (!preview) return;
    var mode = "h";
    try {
      var v = localStorage.getItem("clarity_uft_orient_v1");
      if (v === "v" || v === "h") mode = v;
    } catch (e) {}
    preview.classList.toggle("uft-orient-h", mode === "h");
    preview.classList.toggle("uft-orient-v", mode === "v");
    preview.classList.add("uft-tree");
  }

  function settle() {
    if (!isTree()) return;
    preferHorizontal();
    openBands();
  }

  function wrap() {
    if (typeof w.uftRender === "function" && !w.uftRender.__treeLines) {
      var orig = w.uftRender;
      w.uftRender = function () {
        var r = orig.apply(this, arguments);
        setTimeout(settle, 0);
        return r;
      };
      w.uftRender.__treeLines = true;
    }
  }

  function boot() {
    if (!isTree()) return;
    wrap();
    settle();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 600);
  setTimeout(boot, 1600);
  d.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(boot, 300);
  });
})(window, document);
