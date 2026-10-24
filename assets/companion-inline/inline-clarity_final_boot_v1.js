(function(){
  "use strict";
  if (window.__CLARITY_FINAL_BOOT_V1__) return;
  window.__CLARITY_FINAL_BOOT_V1__ = true;
  function safe(fn){ try { if (typeof fn === "function") fn(); } catch(e){} }
  function boot(){
    safe(window.__notesLoadReal || window.notesLoad);
    safe(window.uftLoad);
    safe(window.claritySecurityAudit);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 500); });
  else setTimeout(boot, 500);
  window.addEventListener("load", function(){ setTimeout(boot, 1000); });
})();