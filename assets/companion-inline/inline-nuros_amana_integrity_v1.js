(function(){
  "use strict";
  if (window.__NUROS_AMANA_INTEGRITY_V1__) return;
  window.__NUROS_AMANA_INTEGRITY_V1__ = true;
  function check(){
    var report = { ok: true, notes: [] };
    try {
      if (!document.getElementById("amana-vault-gate")) { report.ok = false; report.notes.push("gate missing"); }
      if (!document.getElementById("amana-vault-interior")) { report.ok = false; report.notes.push("interior missing"); }
      var interior = document.getElementById("amana-vault-interior");
      if (interior && !interior.hidden && interior.getAttribute("data-amana-sealed") === "1") {
        report.notes.push("sealed attr with visible interior — check gate script");
      }
      /* must not store passphrase keys */
      try {
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i) || "";
          if (/passphrase|password|amana-pass/i.test(k)) {
            report.ok = false;
            report.notes.push("suspicious localStorage key: " + k);
          }
        }
      } catch(e){}
    } catch(e){ report.ok = false; report.notes.push(String(e)); }
    try { window.__AMANA_INTEGRITY__ = report; } catch(e){}
    return report;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(check, 800); });
  else setTimeout(check, 800);
  window.clarityAmanaIntegrityCheck = check;
})();