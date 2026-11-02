(function(){
  if (!window.ALLOW || typeof window.ALLOW !== "object") {
    window.ALLOW = window.ALLOW || {};
  }
  // If still empty after late scripts, soft once
  document.addEventListener("DOMContentLoaded", function(){
    try {
      if (!window.ALLOW || !window.ALLOW.seeker) {
        console.warn("[Clarity] ALLOW map missing seeker — path filter soft-disabled");
        window.ALLOW = window.ALLOW || {};
        window.ALLOW.seeker = window.ALLOW.seeker || {"commands-card":1,"about-clarity-card":1};
      }
    } catch(e){}
  });
})();