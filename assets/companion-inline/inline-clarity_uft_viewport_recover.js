(function(){
  "use strict";
  if (window.__CLARITY_UFT_VIEWPORT_RECOVER__) return;
  window.__CLARITY_UFT_VIEWPORT_RECOVER__ = true;
  function recover(){
    try {
      var tab = document.getElementById("tab-notes");
      if (!tab || !tab.classList.contains("active")) return;
      if (tab.classList.contains("amana-locked") && !tab.classList.contains("amana-unlocked")) return;
      ["user-family-tree-card","uft-stage","uft-preview","uft-preview-wrap","uft-zoom-layer",
       "uft-editor","uft-palette","amana-fiqh-tools-wrap","faraid-card","wasiyyah-card"].forEach(function(id){
        var el = document.getElementById(id);
        if (!el) return;
        el.style.setProperty("display", id==="uft-palette"?"flex":"block", "important");
        el.style.setProperty("visibility","visible","important");
        el.style.setProperty("height","auto","important");
        el.style.setProperty("max-height","none","important");
        el.style.setProperty("opacity","1","important");
      });
      var st = document.getElementById("uft-stage");
      if (st) st.style.setProperty("min-height","min(48vh, 26rem)","important");
      try {
        var layer = document.getElementById("uft-zoom-layer");
        if (typeof window.uftRender==="function" && layer && !layer.children.length) window.uftRender();
        if (typeof window.uftZoomInit==="function") window.uftZoomInit();
      } catch(e){}
    } catch(e){}
  }
  function boot(){
    var tab = document.getElementById("tab-notes");
    if (tab && !tab._uftRecoverObs) {
      var obs = new MutationObserver(function(){ recover(); });
      obs.observe(tab, { attributes:true, attributeFilter:["class"] });
      tab._uftRecoverObs = obs;
    }
    recover();
    setTimeout(recover, 250);
  }
  document.addEventListener("click", function(ev){
    var t = ev.target && ev.target.closest && ev.target.closest("#amana-btn-unlock,#amana-btn-create,[data-rail-tab='notes'],[data-tab='notes']");
    if (t) { setTimeout(recover, 80); setTimeout(recover, 300); }
  }, true);
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", function(){ setTimeout(boot, 200); });
})();