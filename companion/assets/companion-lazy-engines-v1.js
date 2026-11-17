/*! companion-lazy-engines-v1 · Slim-4 · load craft/hifz/wiring on tab need · educational only */
(function(w,d){
  "use strict";
  if(w.__COMPANION_LAZY_ENGINES_V1__) return;
  w.__COMPANION_LAZY_ENGINES_V1__=true;
  var loaded={};
  var MAP={
    reminder: ["/companion/assets/companion-craft-studios-v1.js?v=20261117S4"],
    action: [
      "/companion/assets/companion-action-wiring-v1.js?v=20261117S4",
      "/companion/assets/companion-hifz-engine-v1.js?v=20261117S4",
      "/companion/assets/companion-craft-studios-v1.js?v=20261117S4"
    ]
  };
  function load(src){
    if(loaded[src]) return loaded[src];
    loaded[src]=new Promise(function(resolve){
      var s=d.createElement("script");
      s.src=src; s.async=true;
      s.onload=function(){ resolve(src); };
      s.onerror=function(){ resolve(null); };
      d.head.appendChild(s);
    });
    return loaded[src];
  }
  function tabId(){
    try{
      var b=d.querySelector(".cs-door button.is-active, [data-rail-tab].is-active");
      if(b) return b.getAttribute("data-rail-tab")||"";
    }catch(e){}
    try{
      var m=location.hash||"";
      if(m.indexOf("action")>=0) return "action";
      if(m.indexOf("reminder")>=0) return "reminder";
    }catch(e2){}
    return "";
  }
  function ensure(tab){
    var list=MAP[tab]||[];
    return Promise.all(list.map(load));
  }
  function boot(){
    ensure(tabId()||"reminder");
    d.addEventListener("click", function(ev){
      var b=ev.target && ev.target.closest && ev.target.closest("[data-rail-tab]");
      if(!b) return;
      var t=b.getAttribute("data-rail-tab");
      setTimeout(function(){ ensure(t); }, 20);
    }, true);
    var m=d.getElementById("cs-mount");
    if(m){
      var t=null;
      new MutationObserver(function(){
        if(t) clearTimeout(t);
        t=setTimeout(function(){ ensure(tabId()); }, 50);
      }).observe(m,{childList:true});
    }
  }
  if(d.readyState==="loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.ClarityLazyEngines={ensure:ensure,version:"Slim4"};
})(window,document);
