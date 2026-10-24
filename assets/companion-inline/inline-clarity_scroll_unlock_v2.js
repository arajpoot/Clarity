(function(){
  "use strict";
  if (window.__CLARITY_SCROLL_UNLOCK_V2__) return;
  window.__CLARITY_SCROLL_UNLOCK_V2__ = true;

  function unlock(){
    try {
      var root = document.documentElement;
      var body = document.body;
      if (!body) return;
      root.style.setProperty("overflow-y", "auto", "important");
      root.style.setProperty("overflow-x", "hidden", "important");
      root.style.setProperty("height", "auto", "important");
      root.style.setProperty("position", "static", "important");
      body.style.setProperty("overflow-y", "auto", "important");
      body.style.setProperty("overflow-x", "hidden", "important");
      body.style.setProperty("height", "auto", "important");
      body.style.setProperty("position", "static", "important");
      body.style.removeProperty("touch-action");
      // Dismiss stuck welcome if already seen
      try {
        var seen = localStorage.getItem("clarity_welcome_seen_v2");
        var wel = document.getElementById("clarity-welcome");
        if (seen === "1" && wel) {
          wel.classList.remove("show");
          wel.setAttribute("aria-hidden", "true");
          wel.style.display = "none"; wel.style.pointerEvents = "none";
        }
      } catch(e){}
    } catch(e){}
  }

  unlock();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", unlock);
  window.addEventListener("load", unlock);
  setInterval(unlock, 2000);
  // Re-unlock after any potential modal open
  document.addEventListener("click", function(){ setTimeout(unlock, 50); }, true);
})();