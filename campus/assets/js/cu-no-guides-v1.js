
(function(){
  if (window.__CU_NO_GUIDES_V1__) return;
  window.__CU_NO_GUIDES_V1__ = true;
  function kill(){
    try {
      document.querySelectorAll("#cu-personas-dock,.cu-personas-dock,.cu-personas-embed,#cu-personas-embed").forEach(function(el){
        el.remove();
      });
    } catch(e){}
  }
  kill();
  if (typeof MutationObserver !== "undefined") {
    var obs = new MutationObserver(function(){ kill(); });
    if (document.documentElement) obs.observe(document.documentElement, {childList:true, subtree:true});
  }
  setTimeout(kill, 500);
  setTimeout(kill, 2000);
})();
