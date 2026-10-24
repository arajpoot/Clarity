(function(){
  "use strict";
  if (window.__NUROS_GAP_KILL_V1__) return;
  window.__NUROS_GAP_KILL_V1__ = true;

  function collapseGaps() {
    try {
      document.documentElement.classList.add("door-rail-on");
      // Hide top nav tabs hard
      document.querySelectorAll("nav.nav-tabs, .nav-tabs").forEach(function(n){
        n.style.setProperty("display", "none", "important");
        n.style.setProperty("height", "0", "important");
        n.style.setProperty("margin", "0", "important");
        n.style.setProperty("padding", "0", "important");
      });
      // Zero top spacing on content shells
      ["#main-application-workspace", ".page-wrapper", "#main-content", ".main-content"].forEach(function(q){
        var el = document.querySelector(q);
        if (!el) return;
        el.style.setProperty("margin-top", "0", "important");
        el.style.setProperty("padding-top", "0", "important");
      });
      // Ensure only one active panel
      var active = document.querySelector(".tab-panel.active, .tab-panel.is-active");
      document.querySelectorAll(".tab-panel").forEach(function(p){
        if (p === active) {
          p.style.setProperty("display", "block", "important");
          p.style.setProperty("height", "auto", "important");
          p.style.setProperty("margin-top", "0", "important");
          p.style.setProperty("padding-top", "0.15rem", "important");
        } else {
          p.style.setProperty("display", "none", "important");
          p.style.setProperty("height", "0", "important");
          p.style.setProperty("margin", "0", "important");
          p.style.setProperty("padding", "0", "important");
        }
      });
    } catch (e) {}
  }

  // Hook tab switches
  function wrap(name) {
    if (typeof window[name] !== "function" || window[name]._gapKill) return;
    var prev = window[name];
    window[name] = function() {
      var r = prev.apply(this, arguments);
      setTimeout(collapseGaps, 30);
      setTimeout(collapseGaps, 120);
      return r;
    };
    window[name]._gapKill = true;
  }

  function boot() {
    collapseGaps();
    wrap("switchTab");
    wrap("clarityOpenSectionDoor");
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 50); });
  else setTimeout(boot, 50);
  window.addEventListener("load", function(){ setTimeout(collapseGaps, 200); });
  document.addEventListener("click", function(ev){
    var t = ev.target && ev.target.closest && ev.target.closest("[data-rail-tab], [data-tab], .door-rail-btn, .mb-tab, .nav-tab");
    if (t) setTimeout(collapseGaps, 80);
  }, true);
})();