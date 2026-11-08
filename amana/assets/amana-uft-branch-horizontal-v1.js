/*! Amānah UFT · branch horizontal v1
 * Force orient-h class, open stage scrolled to start so backbone L→R is visible
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_BRANCH_H_V1__) return;
  w.__CLARITY_AMANA_UFT_BRANCH_H_V1__ = true;

  function isTree() {
    return /\/amana\/tree\/?/.test(location.pathname || "") || !!d.getElementById("uft-stage");
  }

  function settle() {
    if (!isTree()) return;
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

    if (mode === "h") {
      try {
        preview.scrollLeft = 0;
      } catch (e2) {}
      var layer = d.getElementById("uft-zoom-layer");
      if (layer) {
        layer.style.minWidth = "max-content";
        layer.style.width = "max-content";
      }
    }
  }

  function wrap() {
    if (typeof w.uftRender === "function" && !w.uftRender.__branchH) {
      var orig = w.uftRender;
      w.uftRender = function () {
        var r = orig.apply(this, arguments);
        setTimeout(settle, 0);
        setTimeout(settle, 200);
        return r;
      };
      w.uftRender.__branchH = true;
    }
  }

  function boot() {
    if (!isTree()) return;
    wrap();
    settle();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 500);
  setTimeout(boot, 1600);
  d.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(boot, 300);
  });
})(window, document);
