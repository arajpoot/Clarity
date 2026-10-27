/**
 * Phase C · Companion workspace overflow integrity
 */
(function(g){
  "use strict";
  if(g.__CLARITY_PHASE_C_OVERFLOW__) return;
  g.__CLARITY_PHASE_C_OVERFLOW__ = true;
  g.__CLARITY_SOLID_OVERFLOW_V1__ = true;

  function openMain(){
    if(document.documentElement.getAttribute("data-shell-mode")!=="companion") return;
    ["main-content","main-application-workspace"].forEach(function(id){
      var el=document.getElementById(id);
      if(!el) return;
      el.style.setProperty("height","auto","important");
      el.style.setProperty("max-height","none","important");
      el.style.setProperty("overflow","visible","important");
      el.style.setProperty("opacity","1","important");
      el.style.setProperty("visibility","visible","important");
    });
    document.querySelectorAll(".tab-panel.active, .tab-panel.is-active, main.main-content").forEach(function(el){
      el.style.setProperty("display","block","important");
      el.style.setProperty("height","auto","important");
      el.style.setProperty("overflow","visible","important");
    });
    var strip=document.querySelector("#clarity-grave-path-strip, .grave-path-strip, .path-to-grave");
    if(strip){
      strip.style.setProperty("display","block","important");
      strip.style.setProperty("visibility","visible","important");
    }
  }
  function boot(){ openMain(); }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  [300,900,1800,3000].forEach(function(ms){setTimeout(boot,ms);});
  document.addEventListener("clarity:companion-ready", boot);
  try{
    new MutationObserver(function(){ openMain(); }).observe(document.documentElement,{attributes:true,attributeFilter:["data-shell-mode"]});
  }catch(e){}
})(typeof window !== "undefined" ? window : this);
