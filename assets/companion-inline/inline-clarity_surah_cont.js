(function(){
  "use strict";
  if (window.__CLARITY_SURAH_CONT__) return;
  window.__CLARITY_SURAH_CONT__ = true;
  function wire(){
    var audio = document.getElementById("clarity-surah-audio");
    if (!audio || audio.__contWired) return;
    audio.__contWired = true;
    audio.addEventListener("ended", function(){
      try {
        var cur = (typeof currentSurah === "number" && currentSurah) ? currentSurah : 0;
        if (!cur) {
          var sel = document.getElementById("surah-dropdown") || document.querySelector("select.surah-dropdown");
          cur = parseInt(sel && sel.value, 10) || 0;
        }
        var next = cur + 1;
        if (next > 114) next = 1;
        if (typeof clarityPlaySurah === "function") {
          clarityPlaySurah(next);
          var sel2 = document.getElementById("surah-dropdown") || document.querySelector("select.surah-dropdown");
          if (sel2) sel2.value = String(next);
        }
      } catch(e){}
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(wire, 600); });
  else setTimeout(wire, 600);
  setInterval(wire, 4000);
})();