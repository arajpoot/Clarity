/*! companion-campus-calm-boot-v1 · single calm rehydrate · educational only */
(function(w,d){
  "use strict";
  if(w.__COMPANION_CAMPUS_CALM_BOOT__) return;
  w.__COMPANION_CAMPUS_CALM_BOOT__=true;
  function softLoading(root){
    if(!root) return;
    root.querySelectorAll("*").forEach(function(el){
      if(el.childNodes && el.childNodes.length===1 && el.childNodes[0].nodeType===3){
        var t=(el.textContent||"").trim();
        if(t==="Loading..."||t==="Loading…"){
          el.innerHTML='<span class="cs-loading-soft">Fetching from allowed educational sources…</span>';
        }
      }
    });
  }
  function onMount(){
    var m=d.getElementById("cs-mount");
    if(!m) return;
    softLoading(m);
    try{
      if(w.ClarityTabEngines && typeof w.ClarityTabEngines.rebind==="function") w.ClarityTabEngines.rebind(m);
    }catch(e){}
    try{
      if(w.ClarityFoundation && typeof w.ClarityFoundation.rehydrate==="function") w.ClarityFoundation.rehydrate();
    }catch(e){}
  }
  var t=null;
  function watch(){
    var m=d.getElementById("cs-mount");
    if(!m) return;
    new MutationObserver(function(){
      if(t) clearTimeout(t);
      t=setTimeout(onMount, 80);
    }).observe(m,{childList:true,subtree:false});
    onMount();
  }
  if(d.readyState==="loading") d.addEventListener("DOMContentLoaded", watch);
  else watch();
})(window,document);
