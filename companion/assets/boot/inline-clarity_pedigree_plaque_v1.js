(function(){
  "use strict";
  if (window.__CLARITY_PEDIGREE_PLAQUE_V1__) return;
  window.__CLARITY_PEDIGREE_PLAQUE_V1__ = true;

  function nukeTreeGraphics() {
    document.querySelectorAll("#uft-bg, svg.uft-bg, .uft-bg").forEach(function(el){
      try { el.remove(); } catch(e) {
        el.style.display = "none";
        el.setAttribute("aria-hidden", "true");
      }
    });
  }

  function hardenViewport() {
    var preview = document.getElementById("uft-preview");
    if (!preview) return;
    preview.classList.add("uft-tree");
    preview.style.overflowX = "auto";
    preview.style.overflowY = "auto";
    preview.style.webkitOverflowScrolling = "touch";
    preview.style.overscrollBehavior = "contain";
    preview.style.scrollBehavior = "auto";
    preview.style.touchAction = "pan-x pan-y";

    var sizer = document.getElementById("uft-zoom-sizer");
    if (sizer) {
      sizer.style.paddingLeft = "2.75rem";
      sizer.style.paddingRight = "2.75rem";
      sizer.style.boxSizing = "border-box";
    }
    var layer = document.getElementById("uft-zoom-layer");
    if (layer) {
      layer.style.transition = "none";
      layer.style.transformOrigin = "0 0";
    }

    /* Equalize scroll range: ensure content can scroll past both edges */
    try {
      /* after render, center-ish if overflow */
      if (preview.scrollWidth > preview.clientWidth + 8) {
        var max = preview.scrollWidth - preview.clientWidth;
        /* leave ability to reach both ends — no forced center that breaks right-only feel */
        if (preview.scrollLeft <= 2) {
          preview.scrollLeft = Math.min(max * 0.15, 48);
        }
      }
    } catch(e){}
  }

  function killZoomTransition() {
    /* transitions on transform cause jerky pan while resizing sizer */
    var layer = document.getElementById("uft-zoom-layer");
    if (layer) layer.style.transition = "none";
    try {
      if (typeof window.uftZoomApply === "function" && !window.uftZoomApply.__plaqueSmooth) {
        var prev = window.uftZoomApply;
        window.uftZoomApply = function(opts) {
          opts = opts || {};
          opts.immediate = true;
          var r = prev.apply(this, arguments);
          var layer2 = document.getElementById("uft-zoom-layer");
          if (layer2) layer2.style.transition = "none";
          return r;
        };
        window.uftZoomApply.__plaqueSmooth = true;
      }
    } catch(e){}
  }

  function boot() {
    nukeTreeGraphics();
    hardenViewport();
    killZoomTransition();
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 200); });
  else setTimeout(boot, 200);
  window.addEventListener("load", function(){
    setTimeout(boot, 400);
    setTimeout(boot, 1200);
  });

  /* After tree re-renders */
  document.addEventListener("click", function(ev){
    var t = ev.target && ev.target.closest && ev.target.closest("#user-family-tree-card, #uft-preview, .uft-view-bar, .uft-person");
    if (t) setTimeout(function(){ nukeTreeGraphics(); hardenViewport(); }, 150);
  }, true);

  /* Observe re-injection of tree SVG */
  try {
    var card = document.getElementById("user-family-tree-card");
    if (card && !card._plaqueObs) {
      var obs = new MutationObserver(function(){ nukeTreeGraphics(); });
      obs.observe(card, { childList: true, subtree: true });
      card._plaqueObs = obs;
    }
  } catch(e){}

  window.clarityPedigreePlaque = { nuke: nukeTreeGraphics, harden: hardenViewport };
})();