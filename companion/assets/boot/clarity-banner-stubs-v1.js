/*! clarity-banner-stubs-v1 · soft globals to prevent ReferenceError */
(function(w){
  "use strict";
  function soft(name, fn){ if (typeof w[name] !== "function") w[name] = fn; }
  soft("clarityAzanToggle", function(on){
    try { localStorage.setItem("clarity_azan_notify", on ? "1" : "0"); } catch(e){}
  });
  soft("claritySetThemeMode", function(mode){
    try {
      mode = mode || "system";
      document.documentElement.setAttribute("data-theme", mode === "system" ? "" : mode);
      localStorage.setItem("clarity_theme_mode", mode);
    } catch(e){}
  });
  soft("resetToGateView", function(){
    try { location.hash = "gate"; } catch(e){}
  });
})(window);
