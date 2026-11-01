(function(){
  "use strict";
  if (window.__CLARITY_LMR_READ_SYNC__) return;
  window.__CLARITY_LMR_READ_SYNC__ = true;

  function syncRead(){
    var ar = document.getElementById("tj-lmr-ar");
    var en = document.getElementById("tj-lmr-en");
    var meta = document.getElementById("tj-lmr-meta");
    var arR = document.getElementById("tj-lmr-ar-read");
    var enR = document.getElementById("tj-lmr-en-read");
    var metaR = document.getElementById("tj-lmr-meta-read");
    if (ar && arR) {
      var t = (ar.textContent || "").trim();
      if (t && t !== "…") arR.textContent = t;
    }
    if (en && enR) enR.textContent = (en.textContent || "").trim();
    if (meta && metaR) {
      var m = (meta.textContent || "").trim();
      if (m) metaR.textContent = m;
    }
  }

  // Hook after common LMR updates
  var _obs = null;
  function watch(){
    var ar = document.getElementById("tj-lmr-ar");
    if (!ar) return;
    if (_obs) _obs.disconnect();
    _obs = new MutationObserver(function(){ syncRead(); });
    _obs.observe(ar, { childList: true, characterData: true, subtree: true });
    var en = document.getElementById("tj-lmr-en");
    if (en) _obs.observe(en, { childList: true, characterData: true, subtree: true });
    var meta = document.getElementById("tj-lmr-meta");
    if (meta) _obs.observe(meta, { childList: true, characterData: true, subtree: true });
    syncRead();
  }

  // Wrap fetch completion: poll briefly after pull clicks
  document.addEventListener("click", function(ev){
    var t = ev.target;
    if (!t) return;
    var id = t.id || (t.closest && t.closest("button") && t.closest("button").id);
    if (id === "tj-lmr-fetch" || id === "tj-lmr-random" || id === "tj-lmr-fetch-rule" || id === "tj-lmr-rule-next") {
      setTimeout(syncRead, 200);
      setTimeout(syncRead, 600);
      setTimeout(syncRead, 1200);
      setTimeout(syncRead, 2500);
    }
  }, true);

  function boot(){ watch(); syncRead(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", function(){ setTimeout(boot, 300); });
})();