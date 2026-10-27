/**
 * Phase B · Race-proof dual path IDs + campus/companion icons
 */
(function(g){
  "use strict";
  if(g.__CLARITY_PHASE_B_DUAL__) return;
  g.__CLARITY_PHASE_B_DUAL__ = true;

  function ensureIds(){
    try{
      document.querySelectorAll(".dual-tile, .dual-tiles > *").forEach(function(tile){
        var t = (tile.textContent||"").toLowerCase();
        if(/university|campus/.test(t)){
          if(!tile.id) tile.id = "dual-path-university";
          tile.setAttribute("data-path","university");
        } else if(/companion/.test(t)){
          if(!tile.id) tile.id = "dual-path-companion";
          tile.setAttribute("data-path","companion");
        }
      });
    }catch(e){}
  }

  function forceIcons(){
    try{
      function put(tile, name){
        if(!tile) return;
        tile.querySelectorAll(":scope > .nuros-icon").forEach(function(n){
          if(n.className.indexOf("nuros-icon-"+name)<0) try{n.parentNode.removeChild(n);}catch(e){}
        });
        if(!tile.querySelector(".nuros-icon-"+name)){
          var el=document.createElement("span");
          el.className="nuros-icon nuros-icon-"+name;
          el.setAttribute("aria-hidden","true");
          tile.insertBefore(el, tile.firstChild);
        }
        tile.setAttribute("data-nuros-iconized","1");
      }
      put(document.getElementById("dual-path-university"), "campus");
      put(document.getElementById("dual-path-companion"), "companion");
      // fallback by text
      document.querySelectorAll(".dual-tile").forEach(function(tile){
        var t=(tile.textContent||"").toLowerCase();
        if(/university|campus/.test(t)) put(tile,"campus");
        else if(/companion/.test(t)) put(tile,"companion");
      });
    }catch(e){}
  }

  function boot(){ ensureIds(); forceIcons(); }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  [200,600,1200,2000,3500].forEach(function(ms){setTimeout(boot,ms);});
  document.addEventListener("clarity:landing-ready", boot);
  // observe dual-tiles container for late paint
  try{
    var obs=new MutationObserver(function(){ boot(); });
    function watch(){
      var host=document.querySelector(".dual-tiles, #clarity-landing, [data-shell='landing']");
      if(host) obs.observe(host,{childList:true,subtree:true});
    }
    if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", watch);
    else watch();
  }catch(e){}
})(typeof window !== "undefined" ? window : this);
