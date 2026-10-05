(function(){
  "use strict";
  if (window.__NUROS_SHIELD__) return;
  window.__NUROS_SHIELD__ = true;
  function _gebi(id){ try { return document.getElementById(id); } catch(e){ return null; } }
  var safeStyle; try { safeStyle = new Proxy({}, { get:function(){return "";}, set:function(){return true;} }); } catch(e){ safeStyle = {}; }
  var safeClassList = { add:function(){}, remove:function(){}, toggle:function(){return false;}, contains:function(){return false;} };
  function makeSafe(){
    var store = {innerHTML:"",textContent:"",value:"",src:"",href:"",disabled:false};
    var node = { style:safeStyle, classList:safeClassList, tagName:undefined, parentNode:null,
      setAttribute:function(){}, getAttribute:function(){return null;}, addEventListener:function(){},
      removeEventListener:function(){}, appendChild:function(c){return c;}, querySelector:function(){return null;},
      querySelectorAll:function(){return [];}, focus:function(){}, click:function(){}, remove:function(){},
      getContext:function(){return null;}, play:function(){return Promise.resolve();}, pause:function(){} };
    try {
      return new Proxy(node, {
        get: function(t,p){ if(p in t) return t[p]; if(p in store) return store[p]; return function(){return null;}; },
        set: function(t,p,v){ store[p]=v; return true; }
      });
    } catch(e){ return node; }
  }
  var SAFE = makeSafe();
  var OPTIONAL = {"grok-question":1,"hifz-arabic":1,"hifz-translation":1,"hifz-today-count":1,"istighfar-count":1,"salawat-count":1,"streak-display":1,"lessons-display":1,"welcome-text":1,"welcome-area":1,"mute-btn":1,"volume-slider":1,"tafseer-count":1,"tafseer-last":1,"tafseer-list":1,"prophet-story":1,"israeliyat-content":1,"zikr":1,"life-event":1,"life-results":1,"command-box":1,"seerah-content":1,"tj-overall-label":1,"tj-overall-fill":1,"tj-levels-root":1,"callig-mode-badge":1,"callig-voice-status":1,"callig-mic-stop":1,"callig-mic-btn":1,"banner-live-status":1,"nuros-dp-score":1,"nuros-dp-log":1};
  var _raw = document.getElementById.bind(document);
  document.getElementById = function(id){
    var n = null; try { n = _raw(id); } catch(e){}
    if (n) return n;
    if (OPTIONAL[id]) return SAFE;
    return null;
  };
  function wrapName(name){
    try {
      if (typeof window[name] !== "function" || window[name].__nurosWrapped) return;
      var prev = window[name];
      window[name] = function(){ try { return prev.apply(this, arguments); } catch(err){ console.warn("[NurOS]", name, err&&err.message); } };
      window[name].__nurosWrapped = true;
    } catch(e){}
  }
  function wrapAll(){
    try {
      Object.getOwnPropertyNames(window).forEach(function(n){
        if (/^(load|update|render|sync|show|hide|toggle|refresh|init|callig|clarity|tj|fq|pm|uft|meme)/i.test(n)) wrapName(n);
      });
      ["askGrok","loadZikr","loadProphetStory","loadIsraeliyat","loadCommand","tryBannerLiveEmbed","toggleHaramainLive","searchHadith","searchQuran"].forEach(wrapName);
    } catch(e){}
  }
  function soft(ev){
    try {
      var msg = (ev && (ev.message || (ev.reason && ev.reason.message))) || "";
      if (/Cannot set properties of null|Cannot read properties of null|is not a function/.test(msg)) {
        if (ev.preventDefault) ev.preventDefault();
        console.warn("[NurOS soft]", msg);
      }
    } catch(e){}
  }
  window.addEventListener("error", soft, true);
  window.addEventListener("unhandledrejection", soft, true);
  function paper(){
    try {
      var c=_raw("callig-canvas"), o=_raw("callig-stage-outer"), s=_raw("callig-lab-stage");
      if(o){o.style.background="#f7f3eb";o.style.minHeight="280px";}
      if(s){s.style.background="#f7f3eb";s.style.minHeight="260px";}
      if(c){c.style.background="#f7f3eb";c.style.display="block";
        if(!c.width||c.width<40)c.width=900; if(!c.height||c.height<40)c.height=420;
        if(!c.getAttribute("data-paper")){var ctx=c.getContext&&c.getContext("2d"); if(ctx){ctx.fillStyle="#f7f3eb";ctx.fillRect(0,0,c.width,c.height);} c.setAttribute("data-paper","1");}
      }
    } catch(e){}
  }
  function boot(){ wrapAll(); paper(); }
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", function(){ boot(); setTimeout(boot,120); });
  else boot();
  window.addEventListener("load", function(){ setTimeout(boot,80); setTimeout(boot,400); });
})();