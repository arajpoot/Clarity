/**
 * Phase A · Single owners — neutralize competing banner/path/icon thrash
 * Educational only — not a fatwa.
 */
(function(g){
  "use strict";
  if(g.__CLARITY_PHASE_A_OWNERS__) return;
  g.__CLARITY_PHASE_A_OWNERS__ = true;

  /* Claim ownership flags so older scripts no-op if they check these */
  g.__CLARITY_BANNER_OWNER__ = "harden-v1";
  g.__CLARITY_PATH_OWNER__ = "grave-strip-v1";
  g.__CLARITY_ICON_OWNER__ = "nuros-v3";

  /* Block known thrash intervals that rewrite banner/path every few seconds */
  var _si = g.setInterval;
  g.setInterval = function(fn, ms){
    try{
      var s = String(fn);
      if(ms < 4000 && /banner|grave-path|path-strip|gate-switcher|forceTrack|forceExtent|nuclear/i.test(s)){
        console.info("[Clarity PhaseA] blocked thrash interval", ms);
        return 0;
      }
    }catch(e){}
    return _si.apply(g, arguments);
  };

  /* Path: prefer grave strip; hide redundant TRACK if strip has 4 phases */
  function pathOwner(){
    try{
      var strip = document.querySelector("#clarity-grave-path-strip, .grave-path-strip, .path-to-grave");
      var gate = document.querySelector(".clarity-gate-switcher");
      if(strip){
        strip.style.setProperty("display","block","important");
        strip.style.setProperty("visibility","visible","important");
        strip.style.setProperty("opacity","1","important");
        strip.hidden = false;
        var n = strip.querySelectorAll(".gps-phase, .door, [data-gate]").length;
        if(gate && n >= 3){
          gate.style.setProperty("display","none","important");
        }
      } else if(gate){
        gate.style.setProperty("display","flex","important");
        gate.style.setProperty("visibility","visible","important");
      }
    }catch(e){}
  }

  /* Icons: strip legacy mask classes fighting v3 */
  function iconOwner(){
    try{
      document.querySelectorAll(".nuros-icon").forEach(function(el){
        el.style.setProperty("-webkit-mask-image","none","important");
        el.style.setProperty("mask-image","none","important");
        el.style.setProperty("background-color","transparent","important");
      });
    }catch(e){}
  }

  function boot(){ pathOwner(); iconOwner(); }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  [400,1200,2500].forEach(function(ms){ setTimeout(boot, ms); });
  document.addEventListener("clarity:companion-ready", boot);
  document.addEventListener("clarity:landing-ready", boot);
})(typeof window !== "undefined" ? window : this);
