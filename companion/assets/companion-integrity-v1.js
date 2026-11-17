/*! companion-integrity-v1 · P31 enrichment · educational only */
(function(w,d){
  "use strict";
  if(w.__COMPANION_INTEGRITY_V1_P31__) return;
  w.__COMPANION_INTEGRITY_V1_P31__=true;
  var CRAFT={ "meme-card":1, "callig-lab-card":1, "tweet-desk-card":1 };
  function path(){
    try{var b=d.querySelector("[data-cs-path].is-active");if(b)return (b.getAttribute("data-cs-path")||"").toLowerCase();}catch(e){}
    try{return (localStorage.getItem("cu_companion_path_v1")||"dai").toLowerCase();}catch(e2){}
    return "dai";
  }
  function tick(){
    var m=d.getElementById("cs-mount"); if(!m) return;
    var p=path(); if(p==="daily") p="practicing";
    m.querySelectorAll("[id$='-card']").forEach(function(el){
      var id=el.id||"";
      if(CRAFT[id]){
        var ok=p==="practicing"||p==="dai";
        if(ok){ el.style.setProperty("display","block","important"); el.removeAttribute("hidden"); }
        else { el.style.setProperty("display","none","important"); el.setAttribute("hidden",""); }
        return;
      }
      el.style.setProperty("display","block","important");
      el.style.setProperty("visibility","visible","important");
      el.style.setProperty("opacity","1","important");
      el.removeAttribute("hidden");
      el.classList.remove("cpp-path-hidden","is-path-hidden","arch-hidden","nuros-deferred");
    });
  }
  function boot(){
    tick();
    var m=d.getElementById("cs-mount");
    if(m){ var t=null; new MutationObserver(function(){ if(t)clearTimeout(t); t=setTimeout(tick,30); }).observe(m,{childList:true,subtree:true}); }
    d.addEventListener("click", function(){ setTimeout(tick,20); }, true);
    var i=0, iv=setInterval(function(){ tick(); if(++i>40) clearInterval(iv); }, 150);
  }
  if(d.readyState==="loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.ClarityCompanionIntegrity={tick:tick,version:"P31"};
})(window,document);
