(function(){
  "use strict";
  if (window.__NUROS_AV_REPAIR_V1__) return;
  window.__NUROS_AV_REPAIR_V1__ = true;

  function activateIframe(iframe) {
    if (!iframe || iframe.tagName !== "IFRAME") return;
    var ds = iframe.getAttribute("data-src") || iframe.dataset && iframe.dataset.src;
    var src = iframe.getAttribute("src") || "";
    if (ds && (!src || src === "about:blank" || src === "blank" || src === "#")) {
      iframe.setAttribute("src", ds);
    }
    // Ensure allow attributes for YT
    if (!iframe.getAttribute("allow")) {
      iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    }
    if (!iframe.hasAttribute("allowfullscreen")) {
      iframe.setAttribute("allowfullscreen", "");
    }
    iframe.style.setProperty("display", "block", "important");
    iframe.style.setProperty("visibility", "visible", "important");
    iframe.style.setProperty("opacity", "1", "important");
  }

  function activateAllIn(root) {
    root = root || document;
    root.querySelectorAll("iframe[data-src]").forEach(activateIframe);
    // Also bare youtube iframes that may have lost src
    root.querySelectorAll("iframe").forEach(function(f) {
      var s = f.getAttribute("src") || "";
      var d = f.getAttribute("data-src") || "";
      if ((!s || s === "about:blank") && d) activateIframe(f);
    });
  }

  function activateActiveTab() {
    var panel = document.querySelector(".tab-panel.active, .tab-panel.is-active");
    if (panel) activateAllIn(panel);
    // Known loaders
    try {
      var sealed = document.getElementById("sealed-yt-frame");
      if (sealed) {
        var sel = document.getElementById("sealed-ep");
        var val = sel ? sel.value : "videoseries";
        if (typeof sealedLoadEp === "function") sealedLoadEp(val);
        else activateIframe(sealed);
      }
    } catch(e){}
    try {
      var hajj = document.getElementById("hajj-yt-frame");
      if (hajj) activateIframe(hajj);
    } catch(e){}
    try {
      var taj = document.getElementById("tajalliyat-player");
      if (taj) activateIframe(taj);
    } catch(e){}
    // Generic players
    ["farhat-player","yaqeen-player","asma-lecture-player","spotify-player"].forEach(function(id){
      var el = document.getElementById(id);
      if (el) activateIframe(el);
    });
  }

  // Banner live: do not force-load if intentionally hidden; only ensure frame exists
  function checkBannerLive() {
    var live = document.getElementById("banner-live");
    if (!live) return;
    // leave src management to existing live toggle JS
  }

  // Mic / TTS smoke check (non-destructive)
  function checkMicWiring() {
    try {
      window.__NUROS_AV_STATUS__ = {
        getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        MediaRecorder: typeof MediaRecorder !== "undefined",
        AudioContext: !!(window.AudioContext || window.webkitAudioContext),
        speechSynthesis: !!(window.speechSynthesis),
        sealedLoadEp: typeof sealedLoadEp === "function",
        clarityNaturalTTS: typeof clarityNaturalTTS === "function"
      };
    } catch(e) {
      window.__NUROS_AV_STATUS__ = { error: String(e) };
    }
  }

  function boot() {
    activateAllIn(document);
    activateActiveTab();
    checkBannerLive();
    checkMicWiring();
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 80); });
  else setTimeout(boot, 80);
  window.addEventListener("load", function(){ setTimeout(boot, 250); });

  // Re-activate when switching sections
  function wrap(name) {
    if (typeof window[name] !== "function" || window[name]._avRepair) return;
    var prev = window[name];
    window[name] = function() {
      var r = prev.apply(this, arguments);
      setTimeout(activateActiveTab, 50);
      setTimeout(activateActiveTab, 200);
      return r;
    };
    window[name]._avRepair = true;
  }
  wrap("switchTab");
  wrap("clarityOpenSectionDoor");

  document.addEventListener("click", function(ev){
    var t = ev.target && ev.target.closest && ev.target.closest("[data-rail-tab],[data-tab],.door-rail-btn,.mb-tab,.nav-tab");
    if (t) {
      setTimeout(activateActiveTab, 80);
      setTimeout(activateActiveTab, 250);
    }
  }, true);

  // When select changes for lecture episodes, ensure src applies
  document.addEventListener("change", function(ev){
    var el = ev.target;
    if (!el || el.tagName !== "SELECT") return;
    if (/sealed|farhat|yaqeen|asma|spotify|hajj|episode/i.test(el.id || el.className || "")) {
      setTimeout(activateActiveTab, 30);
    }
  }, true);
})();