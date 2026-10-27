/* inline-clarity-allow-boot-shim-v1.js · renamed from inline-96908bb2ed.js · 20261026HK */
(function(){
  "use strict";
  // Clarity companion boot shim · Phase 0 (20261025)
  // Early stubs so theme chips and deferred assets never throw before core loads.

  window.ALLOW = window.ALLOW || {
    seeker: {"commands-card":1,"samina-verse-card":1,"about-clarity-card":1},
    new_muslim: {},
    daily: {},
    dai: {}
  };

  /** Theme — real implementation may replace this from core-block-8 */
  window.claritySetThemeMode = window.claritySetThemeMode || function(mode){
    mode = mode || "system";
    try { localStorage.setItem("clarity_theme_mode", mode); } catch(e){}
    try { localStorage.setItem("clarity_theme", mode); } catch(e){}
    var resolved = mode;
    if (mode === "system") {
      try {
        resolved = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
      } catch(e){ resolved = "light"; }
    }
    try {
      document.documentElement.setAttribute("data-theme", resolved);
      document.documentElement.setAttribute("data-theme-mode", mode);
    } catch(e){}
    try {
      document.querySelectorAll("[data-theme-chip]").forEach(function(t){
        t.classList.toggle("active", t.getAttribute("data-theme-chip") === mode);
      });
    } catch(e){}
    try {
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", resolved === "dark" ? "#0c1a14" : "#0f4c3a");
    } catch(e){}
  };

  // Apply saved theme ASAP
  try {
    var saved = localStorage.getItem("clarity_theme_mode") || localStorage.getItem("clarity_theme") || "system";
    window.claritySetThemeMode(saved);
  } catch(e){}

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

  // Queue for calls made before core defines real loaders
  window.__clarityCmdQueue = window.__clarityCmdQueue || [];
  if (typeof window.loadCommand !== "function") {
    window.loadCommand = function(){
      window.__clarityCmdQueue.push(arguments);
    };
  }

  document.addEventListener("DOMContentLoaded", function(){
    document.querySelectorAll("[onclick*='clarityWelcomePickTrack']").forEach(function(btn){
      btn.addEventListener("click", function(){ try { clarityWelcomePickTrack("seeker"); } catch(e){} });
    });
  });

  /* Queue-safe stubs for controls that users tap before core/lazy arrives */
  window.memeFetchRrra = window.memeFetchRrra || function(cat){
    try {
      (window.__clarityMemeQueue = window.__clarityMemeQueue || []).push(["rrra", cat]);
      var st = document.getElementById("meme-rrra-status") || document.getElementById("meme-fetch-status");
      if (st) st.textContent = "Loading studio…";
      if (typeof window.ClarityLoadCore === "function") window.ClarityLoadCore();
    } catch(e) {}
  };
  window.clarityPlaySurahFromSelect = window.clarityPlaySurahFromSelect || function(sel){
    try {
      (window.__claritySurahQueue = window.__claritySurahQueue || []).push(sel && sel.value);
      if (typeof window.ClarityLoadCore === "function") window.ClarityLoadCore();
    } catch(e) {}
  };
  window.claritySetReciter = window.claritySetReciter || function(code){
    try { localStorage.setItem("clarity_reciter", code || "afs"); } catch(e) {}
  };
  window.memeFetchBg = window.memeFetchBg || function(kind){
    try { (window.__clarityMemeQueue = window.__clarityMemeQueue || []).push(["bg", kind]); } catch(e) {}
  };

})();