(function(){
  "use strict";
  if (window.__NUROS_MEME_RATIO_UNLOCK__) return;
  window.__NUROS_MEME_RATIO_UNLOCK__ = true;

  function applyRatio(r) {
    r = r || "twitter";
    var st = document.getElementById("meme-stage") || document.querySelector(".meme-stage");
    var map = { "1:1": "1/1", twitter: "16/9", facebook: "1.91/1", "16:9": "16/9", "4:5": "4/5" };
    var dims = { "1:1": [1080,1080], twitter: [1200,675], facebook: [1200,630], "16:9": [1200,675], "4:5": [1080,1350] };
    if (st) {
      st.style.setProperty("aspect-ratio", map[r] || "16/9", "important");
      st.style.setProperty("height", "auto", "important");
      st.style.setProperty("min-height", "0", "important");
      st.style.setProperty("max-height", "52vh", "important");
      st.style.setProperty("width", "100%", "important");
      st.style.setProperty("max-width", "min(100%, 520px)", "important");
    }
    var canvas = document.getElementById("meme-canvas") || (st && st.querySelector("canvas"));
    if (canvas && dims[r]) {
      canvas.width = dims[r][0];
      canvas.height = dims[r][1];
    }
    try { if (typeof memeState === "object" && memeState) memeState.ratio = r; } catch(e){}
    try { if (typeof memePositionBoxes === "function") memePositionBoxes(); } catch(e){}
    try { if (typeof memeDraw === "function") memeDraw(); } catch(e){}
  }

  function wire() {
    var sel = null;
    document.querySelectorAll("select").forEach(function(s){
      if (/Twitter|16:9|Instagram|Canvas size/i.test((s.innerHTML || "") + (s.title || ""))) sel = s;
    });
    if (sel && !sel._ratioUnlock) {
      sel._ratioUnlock = true;
      sel.addEventListener("change", function(){ applyRatio(sel.value); });
      applyRatio(sel.value || "twitter");
    }
    if (typeof window.memeSetRatio === "function" && !window.memeSetRatio._unlocked) {
      var prev = window.memeSetRatio;
      window.memeSetRatio = function(r) {
        applyRatio(r);
        try { return prev.apply(this, arguments); } catch(e) {}
      };
      window.memeSetRatio._unlocked = true;
    } else if (typeof window.memeSetRatio !== "function") {
      window.memeSetRatio = applyRatio;
    }
  }

  function tighten() {
    try {
      [".page-wrapper", "#main-content", ".main-content"].forEach(function(q){
        var el = document.querySelector(q);
        if (el) { el.style.marginTop = "0"; el.style.paddingTop = "0.2rem"; }
      });
    } catch(e){}
  }

  function boot(){ wire(); tighten(); }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 120); });
  else setTimeout(boot, 120);
  window.addEventListener("load", function(){ setTimeout(boot, 350); });
})();