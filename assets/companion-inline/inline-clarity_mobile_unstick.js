(function(){
  "use strict";
  if (window.__CLARITY_MOBILE_UNSTICK__) return;
  window.__CLARITY_MOBILE_UNSTICK__ = true;
  function unstick(){
    if (window.matchMedia && !window.matchMedia("(max-width: 900px)").matches) return;
    document.querySelectorAll(".banner, #clarity-top-duo, .global-nav, nav.global-nav").forEach(function(el){
      try {
        el.style.setProperty("position", "relative", "important");
        el.style.setProperty("top", "auto", "important");
      } catch(e){}
    });
    try {
      document.documentElement.style.setProperty("overflow-y", "auto", "important");
      document.body.style.setProperty("overflow-y", "auto", "important");
      document.body.style.setProperty("height", "auto", "important");
      document.body.style.setProperty("position", "static", "important");
    } catch(e){}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", unstick);
  else unstick();
  window.addEventListener("load", unstick);
  window.addEventListener("resize", unstick);
})();