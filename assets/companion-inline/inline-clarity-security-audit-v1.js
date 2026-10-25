(function(){
  "use strict";
  if (window.__CLARITY_SECURITY_AUDIT_V1__) return;
  window.__CLARITY_SECURITY_AUDIT_V1__ = true;
  function audit(){
    var report = { ok: true, notes: [], ts: Date.now() };
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i) || "";
        if (/passphrase|password|amana-pass|vault-secret/i.test(k)) {
          report.ok = false;
          report.notes.push("suspicious key: " + k);
        }
      }
    } catch(e){ report.notes.push("ls scan: " + e); }
    try {
      if (!document.getElementById("amana-vault-gate")) report.notes.push("gate missing");
      if (typeof window.uftRead !== "function") { report.ok = false; report.notes.push("uftRead missing"); }
      if (typeof window.uftCollect !== "function") { report.ok = false; report.notes.push("uftCollect missing"); }
      if (typeof window.notesState === "undefined") report.notes.push("notesState missing");
      var key = window.UFT_KEY || "";
      if (key && key !== "clarity_user_family_tree_v1") report.notes.push("UFT_KEY unexpected: " + key);
    } catch(e){ report.ok = false; report.notes.push(String(e)); }
    window.__CLARITY_SECURITY_REPORT__ = report;
    return report;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(audit, 1000); });
  else setTimeout(audit, 1000);
  window.claritySecurityAudit = audit;
})();
