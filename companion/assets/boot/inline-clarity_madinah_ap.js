(function(){
  "use strict";
  if (window.__CLARITY_MADINAH_AP__) return;
  window.__CLARITY_MADINAH_AP__ = true;

  function preferMadinah(){
    var sel = document.getElementById("stream-select") || document.querySelector("select[id*='stream']");
    if (sel) {
      var found = false;
      for (var i = 0; i < sel.options.length; i++) {
        var t = (sel.options[i].text || "") + " " + (sel.options[i].value || "");
        if (/madin/i.test(t)) {
          sel.selectedIndex = i;
          found = true;
          break;
        }
      }
      if (found) {
        try { sel.dispatchEvent(new Event("change", { bubbles: true })); } catch(e){}
      }
    }
    // Live button
    var liveBtn = document.getElementById("live-haramain-btn") || document.querySelector("[data-live], .live-btn, button.live");
    // iframe autoplay params
    document.querySelectorAll("#clarity-top-duo iframe, .banner-overlay iframe, #haramain-live iframe").forEach(function(f){
      try {
        var src = f.getAttribute("src") || "";
        if (src && src.indexOf("autoplay") < 0) {
          f.setAttribute("src", src + (src.indexOf("?") >= 0 ? "&" : "?") + "autoplay=1&mute=1");
        }
        f.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
      } catch(e){}
    });
  }

  function tryStart(){
    preferMadinah();
    // click live if present and not active
    var btns = document.querySelectorAll("#live-haramain-btn, button[onclick*='Live'], .av-pill-live");
    btns.forEach(function(b){
      if (b && !b.classList.contains("active") && !b.dataset.apDone) {
        // don't auto-click aggressively — only set default select
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(tryStart, 500); });
  else setTimeout(tryStart, 500);
  window.addEventListener("load", function(){ setTimeout(tryStart, 1200); });
})();