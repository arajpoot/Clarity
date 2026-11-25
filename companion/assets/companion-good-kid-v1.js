(function(w,d){
  if(w.__COMPANION_GOOD_KID_V1__) return; w.__COMPANION_GOOD_KID_V1__=true;
  function tab(){return d.body&&d.body.getAttribute("data-active-tab");}
  function show(el){if(!el)return;var n=0,c=el;while(c&&c.id!=="cs-mount"&&n<12){if(c.nodeType===1){var cs=getComputedStyle(c);if(cs.display==="none")c.style.setProperty("display","block","important");if(cs.visibility==="hidden")c.style.setProperty("visibility","visible","important");}c=c.parentElement;n++;}}
  function run(){
    if(tab()!=="reflection") return;
    var root=d.getElementById("cs-mount"); if(!root) return;
    var ladder=root.querySelector("[data-g2-ladder='reflection']");
    var deep=root.querySelector("#reflection-deep-learning");
    var media=root.querySelector("#reflection-media-restored");
    if(deep){ show(deep); deep.style.setProperty("display","block","important");
      if(ladder&&ladder.parentElement){ try{ ladder.parentElement.insertBefore(deep, ladder.nextSibling);}catch(e){} }
    }
    if(media){ var body=root.querySelector("[data-cs-tab-body]")||root; try{ body.appendChild(media);}catch(e){} }
  }
  function boot(){ run(); d.addEventListener("clarity:tab-mounted",function(){setTimeout(run,40);setTimeout(run,200);});
    d.addEventListener("click",function(ev){ if(ev.target&&ev.target.closest&&ev.target.closest("[data-cs-path],[data-rail-tab]")) setTimeout(run,100);},true);
    var m=d.getElementById("cs-mount"); if(m&&MutationObserver){ var t; new MutationObserver(function(){clearTimeout(t);t=setTimeout(run,70);}).observe(m,{childList:true,subtree:true});}
  }
  if(d.readyState==="loading") d.addEventListener("DOMContentLoaded",boot); else boot();
})(window,document);
