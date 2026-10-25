(function(){
  "use strict";
  if (window.__CLARITY_PERF_LOADER__) return;
  window.__CLARITY_PERF_LOADER__ = true;
  var QUEUE = [
  "assets/clarity-core-block-8.js",
  "assets/nx-tajweed-deep-studio-js-v1.js",
  "assets/nx-tj-lmr-js-v1.js",
  "assets/nuros-bridge-enrich-js.js",
  "assets/clarity-full-surah-recitation-v1.js",
  "assets/clarity-amana-vault-gate-js-v1.js",
  "assets/clarity-track-os-v3.js",
  "assets/clarity-seerah-revamp-js.js",
  "assets/nuros-amana-vault-js.js",
  "assets/clarity-meme-canvas-clean-v1.js",
  "assets/clarity-amana-vault-secure-login-v1.js",
  "assets/clarity-notes-recovery-v1.js",
  "assets/clarity-uft-full-restore-v1.js",
  "assets/clarity-meme-online-bg-v1.js",
  "assets/clarity-gate-switcher-js-v1.js",
  "assets/clarity-path-progress-v1.js",
  "assets/clarity-modules-repair-v1.js",
  "assets/clarity-grave-path-curriculum-js.js",
  "assets/clarity-tj-meme-tweet-revamp-js.js"
  ];
  var loaded = false;
  function loadOne(src){
    return new Promise(function(resolve){
      var s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = s.onerror = function(){ resolve(); };
      document.head.appendChild(s);
    });
  }
  function loadAll(){
    if (loaded) return Promise.resolve();
    loaded = true;
    var chain = Promise.resolve();
    QUEUE.forEach(function(src){
      chain = chain.then(function(){ return loadOne(src); });
    });
    return chain;
  }
  // Expose for shell when opening companion
  window.ClarityLoadCompanion = loadAll;
  // After first paint + idle, start loading heavy modules in background
  function schedule(){
    if (window.requestIdleCallback) {
      requestIdleCallback(function(){ loadAll(); }, { timeout: 4000 });
    } else {
      setTimeout(loadAll, 2500);
    }
  }
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule);
})();
