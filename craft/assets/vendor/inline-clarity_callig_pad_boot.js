(function(){
  if (window.__CLARITY_CALLIG_PAD_BOOT__) return;
  window.__CLARITY_CALLIG_PAD_BOOT__ = true;
  function boot(){
    try {
      if (typeof calligInit === "function") calligInit();
      var c = document.getElementById("callig-canvas");
      if (c) {
        c.style.width = "100%";
        c.style.maxWidth = "100%";
        c.style.height = "auto";
        c.style.minHeight = "12rem";
        c.style.background = "var(--card-bg, #fffef8)";
        c.style.borderRadius = "12px";
        c.style.display = "block";
      }
    } catch(e){}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 500); });
  else setTimeout(boot, 500);
  document.addEventListener("click", function(ev){
    var t = ev.target && ev.target.closest && ev.target.closest("[data-rail-tab='reminder']");
    if (t) setTimeout(boot, 200);
  }, true);
})();