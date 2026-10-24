(function(){
  "use strict";
  if (window.__CLARITY_AMANA_HARDENING__) return;
  window.__CLARITY_AMANA_HARDENING__ = true;

  window.amanaEsc = window.amanaEsc || function(s){
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  window.clarityAmanaPrintPackSafe = function(d){
    d = d || {};
    var E = window.amanaEsc;
    var lines = [
      "Amana Vault · educational pack — not a fatwa",
      "Full name: " + E(d.fullName || d.full || ""),
      "Next of kin: " + E(d.nextOfKin || d.kin || ""),
      "Debts / trusts: " + E(d.debts || ""),
      "Wasiyyah notes: " + E(d.wasiyyah || d.wasi || ""),
      "Executor / wasi: " + E(d.executor || ""),
      "Generated: " + new Date().toISOString(),
      "On-device only · verify with a qualified scholar where needed."
    ];
    var w = window.open("", "_blank");
    if (!w) return;
    var html = "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Amana Pack</title></head><body><pre style='font-family:system-ui,sans-serif;padding:1.5rem;white-space:pre-wrap'>"
      + lines.join("\n")
      + "</pre></body></html>";
    w.document.open();
    w.document.write(html);
    w.document.close();
    try { w.print(); } catch(e){}
  };

  function wire(){
    var bp = document.getElementById("ahr-print");
    if (bp && !bp.__safePrint) {
      bp.__safePrint = true;
      bp.addEventListener("click", function(ev){
        try {
          var d = typeof readHeirForm === "function" ? readHeirForm() : {};
          window.clarityAmanaPrintPackSafe(d);
          ev.preventDefault();
          ev.stopPropagation();
        } catch(e){}
      }, true);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(wire, 400); });
  else setTimeout(wire, 400);
})();