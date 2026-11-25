/*! reflection enrichment hold · path must not strip pinned surfaces · §3+§3A */
(function(w,d){
  "use strict";
  if(w.__COMPANION_REFLECTION_HOLD2__) return;
  w.__COMPANION_REFLECTION_HOLD2__=true;
  var CACHE=null;

  function tab(){ return d.body && d.body.getAttribute("data-active-tab"); }

  function forceShow(el){
    if(!el) return;
    var n=0, cur=el;
    while(cur && cur.id!=="cs-mount" && n<12){
      if(cur.nodeType===1){
        if(cur.tagName==="DETAILS") cur.open=true;
        var cs=w.getComputedStyle(cur);
        if(cs.display==="none") cur.style.setProperty("display","block","important");
        if(cs.visibility==="hidden") cur.style.setProperty("visibility","visible","important");
        if(parseFloat(cs.opacity||"1")<0.05) cur.style.setProperty("opacity","1","important");
      }
      cur=cur.parentElement; n++;
    }
  }

  function hold(){
    if(tab()!=="reflection") return;
    var root=d.getElementById("cs-mount"); if(!root) return;
    root.querySelectorAll("[data-visibility-hold='1'], #reflection-media-restored").forEach(function(el){
      forceShow(el);
      el.style.setProperty("display","block","important");
    });
    var media=root.querySelector("#reflection-media-restored");
    if(media){
      CACHE=media.cloneNode(true);
      media.querySelectorAll("details").forEach(function(x){ x.open=true; });
      media.querySelectorAll("iframe").forEach(function(f){
        var ds=f.getAttribute("data-src");
        if(ds && (!f.getAttribute("src") || /about:blank/i.test(f.getAttribute("src")||""))) f.setAttribute("src", ds);
        f.style.setProperty("display","block","important");
        f.style.setProperty("width","100%","important");
        f.style.setProperty("min-height","220px","important");
        f.style.setProperty("height","220px","important");
      });
      // keep near top: if media is not among first sections, move after ladder
      var ladder=root.querySelector("[data-g2-ladder='reflection']");
      var body=root.querySelector("[data-cs-tab-body]")||root;
      if(ladder && media.parentElement && ladder.nextElementSibling!==media){
        if(ladder.parentElement) ladder.parentElement.insertBefore(media, ladder.nextSibling);
      }
    } else if(CACHE){
      var body=root.querySelector("[data-cs-tab-body]")||root;
      var ladder=root.querySelector("[data-g2-ladder='reflection']");
      if(ladder && ladder.parentElement) ladder.parentElement.insertBefore(CACHE.cloneNode(true), ladder.nextSibling);
      else body.appendChild(CACHE.cloneNode(true));
      hold();
    }
  }

  function boot(){
    hold();
    d.addEventListener("clarity:tab-mounted", function(){ setTimeout(hold,40); setTimeout(hold,250); });
    d.addEventListener("click", function(ev){
      if(ev.target && ev.target.closest && ev.target.closest("[data-cs-path],[data-rail-tab]")) setTimeout(hold,120);
    }, true);
    var m=d.getElementById("cs-mount");
    if(m && typeof MutationObserver!=="undefined"){
      var t=null;
      new MutationObserver(function(){ if(t) clearTimeout(t); t=setTimeout(hold,70); }).observe(m,{childList:true,subtree:true,attributes:true,attributeFilter:["style","class","hidden"]});
    }
  }
  if(d.readyState==="loading") d.addEventListener("DOMContentLoaded", boot); else boot();
})(window,document);
