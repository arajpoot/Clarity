/*! Reflection deep learning hold · media appendix at bottom · §3+§3A */
(function(w,d){
  "use strict";
  if(w.__COMPANION_REFLECTION_DEEP_HOLD__) return;
  w.__COMPANION_REFLECTION_DEEP_HOLD__=true;
  var DEEP_CACHE=null;

  function tab(){ return d.body&&d.body.getAttribute("data-active-tab"); }

  function forceShow(el){
    if(!el) return;
    var n=0,cur=el;
    while(cur && cur.id!=="cs-mount" && n<12){
      if(cur.nodeType===1){
        var cs=w.getComputedStyle(cur);
        if(cs.display==="none") cur.style.setProperty("display","block","important");
        if(cs.visibility==="hidden") cur.style.setProperty("visibility","visible","important");
      }
      cur=cur.parentElement; n++;
    }
  }

  function hold(){
    if(tab()!=="reflection") return;
    var root=d.getElementById("cs-mount"); if(!root) return;
    var deep=root.querySelector("#reflection-deep-learning, [data-deep-learning='1']");
    if(deep){
      DEEP_CACHE=deep.cloneNode(true);
      forceShow(deep);
      deep.style.setProperty("display","block","important");
      // keep under ladder
      var ladder=root.querySelector("[data-g2-ladder='reflection']");
      if(ladder && ladder.parentElement && deep.parentElement && ladder.nextElementSibling!==deep){
        try{ ladder.parentElement.insertBefore(deep, ladder.nextSibling); }catch(e){}
      }
    } else if(DEEP_CACHE){
      var ladder=root.querySelector("[data-g2-ladder='reflection']");
      var body=root.querySelector("[data-cs-tab-body]")||root;
      if(ladder&&ladder.parentElement) ladder.parentElement.insertBefore(DEEP_CACHE.cloneNode(true), ladder.nextSibling);
      else body.appendChild(DEEP_CACHE.cloneNode(true));
    }
    // media stays wherever; do not promote to top
    root.querySelectorAll("[data-visibility-hold='1']").forEach(forceShow);
  }

  function boot(){
    hold();
    d.addEventListener("clarity:tab-mounted", function(){ setTimeout(hold,40); setTimeout(hold,220); });
    d.addEventListener("click", function(ev){
      if(ev.target&&ev.target.closest&&ev.target.closest("[data-cs-path],[data-rail-tab]")) setTimeout(hold,100);
    }, true);
    var m=d.getElementById("cs-mount");
    if(m&&typeof MutationObserver!=="undefined"){
      var t=null;
      new MutationObserver(function(){ if(t)clearTimeout(t); t=setTimeout(hold,70); }).observe(m,{childList:true,subtree:true,attributes:true,attributeFilter:["style","class","hidden"]});
    }
  }
  if(d.readyState==="loading") d.addEventListener("DOMContentLoaded", boot); else boot();
})(window,document);
