(function(){
  "use strict";
  if (window.__NUROS_SHELL_COLLAPSE__) return;
  window.__NUROS_SHELL_COLLAPSE__ = true;

  function collapse() {
    try {
      // Force page-wrapper out of flex mode and zero size contribution when empty
      document.querySelectorAll("#main-content.page-wrapper, .page-wrapper, #main-content").forEach(function(el){
        el.style.setProperty("display", "block", "important");
        el.style.setProperty("margin", "0", "important");
        el.style.setProperty("padding", "0", "important");
        el.style.setProperty("min-height", "0", "important");
        el.style.setProperty("gap", "0", "important");
        // If wrapper only contains hidden sidebar / empty main, collapse height
        var visibleKids = Array.from(el.children).filter(function(ch){
          var cs = getComputedStyle(ch);
          return cs.display !== "none" && cs.visibility !== "hidden" && ch.offsetHeight > 0;
        });
        if (visibleKids.length === 0) {
          el.style.setProperty("height", "0", "important");
          el.style.setProperty("overflow", "hidden", "important");
        } else {
          el.style.setProperty("height", "auto", "important");
          el.style.removeProperty("overflow");
        }
      });
      document.querySelectorAll("main.main-content, .main-content").forEach(function(el){
        el.style.setProperty("margin", "0", "important");
        el.style.setProperty("padding", "0", "important");
        el.style.setProperty("min-height", "0", "important");
      });
      document.querySelectorAll("#clarity-sidebar, aside.sidebar").forEach(function(el){
        el.style.setProperty("display", "none", "important");
        el.style.setProperty("height", "0", "important");
        el.style.setProperty("width", "0", "important");
      });
      // Pull active tab up under banner
      var duo = document.getElementById("clarity-top-duo");
      var active = document.querySelector(".tab-panel.active, .tab-panel.is-active");
      if (duo && active) {
        active.style.setProperty("margin-top", "0", "important");
        active.style.setProperty("padding-top", "0.15rem", "important");
      }
    } catch (e) {}
  }

  function boot() {
    collapse();
    setTimeout(collapse, 100);
    setTimeout(collapse, 400);
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", function(){ setTimeout(collapse, 200); });

  // Re-run on tab change
  ["switchTab", "clarityOpenSectionDoor"].forEach(function(name){
    if (typeof window[name] === "function" && !window[name]._shellCollapse) {
      var prev = window[name];
      window[name] = function() {
        var r = prev.apply(this, arguments);
        setTimeout(collapse, 40);
        setTimeout(collapse, 150);
        return r;
      };
      window[name]._shellCollapse = true;
    }
  });
  document.addEventListener("click", function(ev){
    if (ev.target && ev.target.closest && ev.target.closest("[data-rail-tab],[data-tab],.door-rail-btn,.mb-tab,.nav-tab")) {
      setTimeout(collapse, 80);
    }
  }, true);
})();