(function(){
  "use strict";
  if (window.__CLARITY_LOADER_GUARD_V1__) return;
  window.__CLARITY_LOADER_GUARD_V1__ = true;

  /* Prevent double path-progress init if both defer + lazy fire */
  var _pp = window.clarityPathProgress;
  Object.defineProperty(window, "__clarityPathProgressOnce", {
    value: true,
    writable: false
  });

  /* After core ready, re-assert theme from user chips (stub may have run first) */
  document.addEventListener("clarity-core-ready", function(){
    try {
      var mode = localStorage.getItem("clarity_theme_mode") || localStorage.getItem("clarity_theme") || "system";
      if (typeof window.claritySetThemeMode === "function") window.claritySetThemeMode(mode);
    } catch(e){}
    try {
      if (typeof window.loadCommand === "function") window.loadCommand();
    } catch(e){}
  });

  /* Soft report failed lazy assets once */
  window.addEventListener("load", function(){
    setTimeout(function(){
      try {
        var f = typeof window.ClarityLoaderFailed === "function" ? window.ClarityLoaderFailed() : [];
        if (f && f.length) console.info("[Clarity] lazy failures:", f.join(", "));
      } catch(e){}
    }, 8000);
  });
})();
