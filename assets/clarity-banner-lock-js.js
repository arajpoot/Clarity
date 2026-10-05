(function(){
  "use strict";
  if (window.__CLARITY_SCROLL_UNLOCK__) return;
  window.__CLARITY_SCROLL_UNLOCK__ = true;
  window.__CLARITY_BOOT_TS = Date.now();

  function unlockScroll(){
    try {
      var de = document.documentElement;
      var b = document.body;
      if (de) {
        de.style.setProperty("overflow-y", "auto", "important");
        de.style.setProperty("overflow-x", "hidden", "important");
        de.style.setProperty("height", "auto", "important");
        de.style.setProperty("position", "static", "important");
        de.style.removeProperty("overflow");
      }
      if (b) {
        b.style.setProperty("overflow-y", "auto", "important");
        b.style.setProperty("overflow-x", "hidden", "important");
        b.style.setProperty("height", "auto", "important");
        b.style.setProperty("position", "static", "important");
        b.classList.remove("no-scroll", "modal-open", "scroll-lock");
      }
      /* close stuck welcome if marked seen */
      var w = document.getElementById("clarity-welcome");
      if (w && w.classList.contains("show")) {
        try {
          var seen = localStorage.getItem("clarity_welcome_seen_v2") || localStorage.getItem("clarity_welcome_seen");
          if (seen) {
            w.classList.remove("show");
            w.setAttribute("aria-hidden", "true");
          }
        } catch (e) {}
      }
      var td = document.getElementById("clarity-three-doors");
      if (td) {
        td.classList.add("hidden");
        td.style.setProperty("display", "none", "important");
      }
    } catch (e) {}
  }

  function ensureBanner(){
    var duo = document.getElementById("clarity-top-duo");
    if (!duo) return;
    duo.style.setProperty("display", "block", "important");
    duo.style.setProperty("visibility", "visible", "important");
  }

  function boot(){
    unlockScroll();
    ensureBanner();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", function(){
    unlockScroll();
    ensureBanner();
    try { window.scrollTo(0, 0); } catch (e) {}
  });
  /* Keep unlocking briefly in case deferred chunk sets overflowY hidden then fails to clear */
  var n = 0;
  var iv = setInterval(function(){
    unlockScroll();
    n++;
    if (n > 20) clearInterval(iv);
  }, 250);
  /* Public API */
  window.clarityUnlockScroll = unlockScroll;
})();