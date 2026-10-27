/**
 * Banner UI harden — reduce multi-script flash
 */
(function(g){
  "use strict";
  if(g.__CLARITY_BANNER_HARDEN_V1__) return;
  g.__CLARITY_BANNER_HARDEN_V1__ = true;

  var lastSrc = "";
  var lastMode = "";

  function stable(){
    try{
      var root = document.getElementById("clarity-final-banner-controls-v2") ||
                 document.querySelector("[data-banner], .banner");
      if(root){
        root.setAttribute("data-banner-stable","1");
        root.style.contain = "layout paint style";
      }
      document.documentElement.setAttribute("data-banner-hardened","1");
      // If still/live thrashing, prefer still until user toggles
      var live = document.getElementById("banner-live");
      var img = document.getElementById("banner-img");
      if(live && img){
        // only one visible
        var liveOn = live.style.display !== "none" && live.offsetParent !== null;
        if(liveOn && img){ img.style.opacity = "0"; }
      }
    }catch(e){}
  }

  // Throttle expensive banner DOM rewrites from competing scripts
  if(g.MutationObserver){
    var pending = null;
    var obs = new MutationObserver(function(){
      if(pending) return;
      pending = setTimeout(function(){ pending = null; stable(); }, 120);
    });
    function watch(){
      var root = document.getElementById("clarity-final-banner-controls-v2");
      if(root) try{ obs.observe(root, {childList:true, subtree:true, attributes:true}); }catch(e){}
    }
    if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", function(){ stable(); watch(); });
    else { stable(); watch(); }
  } else {
    if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", stable);
    else stable();
  }
  setTimeout(stable, 500);
  setTimeout(stable, 1500);
})(typeof window !== "undefined" ? window : this);
