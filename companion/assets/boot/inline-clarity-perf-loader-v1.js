(function(){
  "use strict";
  if (window.__CLARITY_PERF_LOADER__) return;
  window.__CLARITY_PERF_LOADER__ = true;

  var CORE = "assets/clarity-core-block-8.js";
  var QUEUE = [
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
    /* path-progress loaded via direct defer in index — skip duplicate */
    "assets/clarity-modules-repair-v1.js",
    "assets/clarity-grave-path-curriculum-js.js",
    "assets/clarity-tj-meme-tweet-revamp-js.js"
  ];

  var coreLoaded = false;
  var restLoaded = false;
  var failed = [];

  function loadOne(src){
    return new Promise(function(resolve){
      try {
        if (document.querySelector('script[data-clarity-src="'+src+'"]')) {
          resolve(true); return;
        }
      } catch(e){}
      var s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.setAttribute("data-clarity-src", src);
      s.onload = function(){ resolve(true); };
      s.onerror = function(){
        failed.push(src);
        try { console.warn("[Clarity] failed to load", src); } catch(e){}
        resolve(false);
      };
      (document.head || document.documentElement).appendChild(s);
    });
  }

  function hydrateAfterCore(){
    try {
      if (typeof window.loadCommand === "function") {
        try { window.loadCommand(); } catch(e){}
      }
      /* flush queued command calls from boot stub */
      var q = window.__clarityCmdQueue || [];
      window.__clarityCmdQueue = [];
      if (q.length && typeof window.loadCommand === "function") {
        try { window.loadCommand(); } catch(e){}
      }
    } catch(e){}
    try {
      if (typeof window.startLocalClock === "function") window.startLocalClock();
    } catch(e){}
    try {
      if (typeof window.detectUserLocationByIP === "function") window.detectUserLocationByIP();
    } catch(e){}
    try {
      if (typeof window.renderHijriCalendar === "function") window.renderHijriCalendar();
      else if (typeof window.updateHijri === "function") window.updateHijri();
    } catch(e){}
    try {
      document.dispatchEvent(new CustomEvent("clarity-core-ready"));
    } catch(e){}
  }

  function loadCore(){
    if (coreLoaded) return Promise.resolve();
    coreLoaded = true;
    return loadOne(CORE).then(function(ok){
      if (ok) hydrateAfterCore();
      return ok;
    });
  }

  function loadRest(){
    if (restLoaded) return Promise.resolve();
    restLoaded = true;
    /* parallel batches of 3 */
    var i = 0;
    function nextBatch(){
      if (i >= QUEUE.length) return Promise.resolve();
      var batch = QUEUE.slice(i, i + 3);
      i += 3;
      return Promise.all(batch.map(loadOne)).then(nextBatch);
    }
    return nextBatch();
  }

  function loadAll(){
    return loadCore().then(function(){ return loadRest(); });
  }

  window.ClarityLoadCompanion = loadAll;
  window.ClarityLoadCore = loadCore;
  window.ClarityLoaderFailed = function(){ return failed.slice(); };

  /* Phase 1: core ASAP on DOM ready; rest after load/idle */
  function bootCore(){
    loadCore();
  }
  function bootRest(){
    if (window.requestIdleCallback) {
      requestIdleCallback(function(){ loadRest(); }, { timeout: 3000 });
    } else {
      setTimeout(loadRest, 1200);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootCore);
  } else {
    bootCore();
  }
  if (document.readyState === "complete") bootRest();
  else window.addEventListener("load", bootRest);
})();
