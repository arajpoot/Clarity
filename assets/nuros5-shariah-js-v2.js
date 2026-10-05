(function(){
  "use strict";
  function wrapWorkspace(sel, label){
    var el = document.querySelector(sel);
    if (!el || el.closest(".workspace-safe-frame")) return;
    var frame = document.createElement("div");
    frame.className = "workspace-safe-frame";
    frame.setAttribute("data-frame-label", label || "Workspace");
    el.parentNode.insertBefore(frame, el);
    frame.appendChild(el);
    var hint = document.createElement("p");
    hint.className = "workspace-scroll-hint";
    hint.textContent = "Scroll outside this frame to leave the workspace safely.";
    frame.appendChild(hint);
  }
  function ensureCalligBridge(){
    if (document.getElementById("callig-text-bridge")) return;
    var stage = document.getElementById("callig-stage-outer") || document.getElementById("callig-lab-stage");
    var tools = document.getElementById("callig-canvas-tools");
    if (!stage && !tools) return;
    var bridge = document.createElement("div");
    bridge.id = "callig-text-bridge";
    bridge.innerHTML = '<div class="bridge-title">Text → Arabic · preview on pad</div><div class="bridge-row"><input type="text" id="callig-bridge-en" placeholder="Type English to translate…" autocomplete="off" /><button type="button" class="btn-soft" id="callig-bridge-go">EN → AR</button><button type="button" class="btn-soft" id="callig-bridge-place">Place on pad</button></div><div class="arabic" id="callig-bridge-ar" dir="rtl" lang="ar"></div><p id="callig-bridge-hint">Educational calligraphy aid. Verify Arabic with a teacher when needed.</p>';
    if (tools && tools.parentNode) tools.parentNode.insertBefore(bridge, tools);
    else if (stage && stage.parentNode) stage.parentNode.insertBefore(bridge, stage);
    var en = document.getElementById("callig-bridge-en");
    var go = document.getElementById("callig-bridge-go");
    var place = document.getElementById("callig-bridge-place");
    var arOut = document.getElementById("callig-bridge-ar");
    function translate(){
      var t = (en && en.value || "").trim();
      if (!t) { if (arOut) arOut.textContent = ""; return; }
      var mainIn = document.getElementById("callig-english-input");
      if (mainIn) {
        mainIn.value = t;
        try { if (typeof calligLiveTranslateFromInput==="function") calligLiveTranslateFromInput(); if (typeof calligTranslateToArabic==="function") calligTranslateToArabic(); } catch(e){}
        setTimeout(function(){
          var arText = window.calligLastArabic || "";
          var arField = document.getElementById("callig-arabic-output") || document.getElementById("callig-ar-text");
          if (!arText && arField) arText = arField.value || arField.textContent || "";
          if (arOut) arOut.textContent = arText || "… (use toolbar EN→AR if needed)";
        }, 400);
      } else if (arOut) arOut.textContent = "Use the EN→AR control under the pad.";
    }
    if (go) go.addEventListener("click", translate);
    if (en) en.addEventListener("keydown", function(ev){ if (ev.key==="Enter"){ ev.preventDefault(); translate(); } });
    if (place) place.addEventListener("click", function(){
      var ar = (arOut && arOut.textContent || "").trim();
      if (!ar || ar.indexOf("…")===0) { translate(); return; }
      try {
        if (typeof calligPlaceArabicOnCanvas==="function") calligPlaceArabicOnCanvas(ar);
        else if (typeof calligSendEnglishToCanvas==="function") calligSendEnglishToCanvas();
        else if (typeof calligTranslateToArabic==="function") calligTranslateToArabic();
      } catch(e){}
    });
  }
  function forceLive(){
    if (typeof window.officialLiveEmbedUrl === "function") {
      window.officialLiveEmbedUrl = function(source){
        var host = "www.youtube-nocookie.com";
        var qs = "autoplay=0&mute=1&controls=1&modestbranding=1&playsinline=1&rel=0&enablejsapi=1";
        var id = (source && source.id) || "Rs7St51oDDc";
        if (source && source.kind === "channel") id = "Rs7St51oDDc";
        var place = ((document.getElementById("live-place-select")||{}).value)||"";
        if (place === "madinah") id = "27cln-IxOGo";
        return "https://"+host+"/embed/"+encodeURIComponent(id)+"?"+qs;
      };
    }
  }
  function boot(){
    forceLive();
    wrapWorkspace("#callig-stage-outer", "Calligraphy pad");
    wrapWorkspace("#meme-stage-wrap", "Meme studio");
    wrapWorkspace("#uft-stage", "Family tree viewport");
    ensureCalligBridge();
  }
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 120); });
  else setTimeout(boot, 120);
  window.addEventListener("load", function(){ setTimeout(boot, 400); });
})();