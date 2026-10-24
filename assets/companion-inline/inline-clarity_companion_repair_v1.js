(function(){
  "use strict";
  if (window.__CLARITY_COMPANION_REPAIR_V1__) return;
  window.__CLARITY_COMPANION_REPAIR_V1__ = true;

  window.clarityAmanaPrintPack = window.clarityAmanaPrintPack || function(){
    try {
      if (typeof window.printVaultPack === "function") return window.printVaultPack();
      if (typeof window.clarityPrintVaultPack === "function") return window.clarityPrintVaultPack();
      var btn = document.getElementById("amana-print-btn") || document.querySelector("[data-print-vault]");
      if (btn) btn.click();
      else window.print();
    } catch(e) { try { window.print(); } catch(e2){} }
  };

  window.clarityClearSearch = window.clarityClearSearch || function(){
    document.querySelectorAll('input[type="search"], input[id*="search"], input[name*="search"]').forEach(function(inp){
      inp.value = "";
      inp.dispatchEvent(new Event("input", {bubbles:true}));
    });
  };

  window.clarityIsraeliyatExpandScholar = window.clarityIsraeliyatExpandScholar || function(id){
    try {
      var el = document.getElementById(id) || document.querySelector('[data-scholar="'+id+'"]');
      if (el) { el.hidden = false; el.classList.add("expanded"); el.scrollIntoView({behavior:"smooth",block:"nearest"}); }
    } catch(e){}
  };

  window.uftZoomFit = window.uftZoomFit || function(){
    try {
      if (typeof window.uftSetZoom === "function") return window.uftSetZoom("fit");
      var stage = document.getElementById("uft-stage") || document.getElementById("uft-preview");
      if (stage) stage.style.transform = "scale(1)";
    } catch(e){}
  };

  // Dedup landing/reopen if any race created doubles
  function dedup(){
    document.querySelectorAll("#clarity-day-landing").forEach(function(el,i){ if(i>0) el.remove(); });
    document.querySelectorAll("#clarity-reopen-bar").forEach(function(el,i){ if(i>0) el.remove(); });
    document.querySelectorAll(".dual-tiles").forEach(function(el,i){
      if (i>0 && el.closest("#clarity-day-landing") === null) el.remove();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", dedup);
  else dedup();
  window.addEventListener("load", function(){ setTimeout(dedup, 300); });
})();