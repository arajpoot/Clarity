(function(){
  "use strict";
  // Early stubs so deferred assets can load safely
  window.ALLOW = window.ALLOW || {
    seeker: {"commands-card":1,"samina-verse-card":1,"about-clarity-card":1},
    new_muslim: {},
    daily: {},
    dai: {}
  };
  window.clarityWelcomePickTrack = window.clarityWelcomePickTrack || function(track){
    try {
      track = track || "seeker";
      localStorage.setItem("clarity_path_focus", track);
      localStorage.setItem("clarity_committed_path", track);
      var modal = document.querySelector(".clarity-welcome, #clarity-welcome, [class*='welcome']");
      if (modal) modal.style.display = "none";
      document.body.classList.remove("welcome-open");
      if (typeof switchTab === "function") switchTab("reminder");
      if (typeof clarityRequestPath === "function") clarityRequestPath(track);
    } catch(e) {}
  };
  window.clarityWelcomeSkipToName = window.clarityWelcomeSkipToName || function(){
    try {
      var modal = document.querySelector(".clarity-welcome, #clarity-welcome, [class*='welcome']");
      if (modal) modal.style.display = "none";
      document.body.classList.remove("welcome-open");
      var name = document.getElementById("welcome-name") || document.querySelector("input[name='display-name']");
      if (name) name.focus();
    } catch(e) {}
  };
  // Wire onclick buttons that may have fired early
  document.addEventListener("DOMContentLoaded", function(){
    document.querySelectorAll("[onclick*='clarityWelcomePickTrack']").forEach(function(btn){
      btn.addEventListener("click", function(){ clarityWelcomePickTrack("seeker"); });
    });
  });
})();