/*! S4/S5 Dayn slot ensure — landing + vault heirs */
(function(){
  "use strict";
  if (window.__CLARITY_DAYN_ENSURE_S45__) return;
  window.__CLARITY_DAYN_ENSURE_S45__ = true;
  function ensureLanding(){
    var land = document.getElementById("clarity-day-landing") || document.querySelector("[data-day-landing]");
    if (!land) return;
    if (!document.getElementById("clarity-landing-slot-dayn")) {
      var s = document.createElement("div");
      s.id = "clarity-landing-slot-dayn";
      land.appendChild(s);
    }
  }
  function ensureVault(){
    if (window.ClarityVaultGate && !window.ClarityVaultGate.allowDaynVault()) return;
    var heirs = document.getElementById("ahr-letter");
    if (!heirs) return;
    var block = document.getElementById("amana-vault-ledger-block");
    if (!block) {
      block = document.createElement("section");
      block.id = "amana-vault-ledger-block";
      block.setAttribute("data-vault-ledger","1");
      var slot = document.createElement("div");
      slot.id = "clarity-vault-slot-dayn";
      block.appendChild(slot);
      var p = heirs.closest("section,article,.card,div") || heirs.parentElement;
      if (p && p.parentElement) p.parentElement.insertBefore(block, p.nextSibling);
    }
  }
  function tick(){ ensureLanding(); ensureVault(); }
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", tick);
  else tick();
  setTimeout(tick, 800);
  setTimeout(tick, 2500);
})();
