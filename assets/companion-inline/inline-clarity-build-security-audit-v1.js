(function(){
"use strict";
if (window.__CLARITY_BUILD_SECURITY_AUDIT_V1__) return;
window.__CLARITY_BUILD_SECURITY_AUDIT_V1__ = true;

window.claritySecurityAudit = function(){
  var report = {
    ok: true,
    ts: Date.now(),
    build: "path-reset+additive+vault",
    vault: {
      gate: !!document.getElementById("amana-vault-gate"),
      tree: !!document.getElementById("user-family-tree-card"),
      uftRead: typeof window.uftRead === "function",
      uftKey: window.UFT_KEY || "clarity_user_family_tree_v1",
      cryptoSubtle: !!(window.crypto && window.crypto.subtle)
    },
    path: {
      request: typeof window.clarityRequestPath === "function",
      reset: typeof window.clarityPathResetToSeeker === "function",
      attr: document.documentElement.getAttribute("data-clarity-path")
    },
    storage: { keys: 0, suspicious: [] },
    notes: []
  };
  try {
    if (report.vault.uftKey !== "clarity_user_family_tree_v1") {
      report.ok = false;
      report.notes.push("unexpected UFT_KEY");
    }
  } catch(e){}
  try {
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i) || "";
      report.storage.keys++;
      if (/passphrase|plaintext.?key|(^|_)password$/i.test(k)) {
        report.storage.suspicious.push(k);
        report.ok = false;
        report.notes.push("suspicious key:"+k);
      }
    }
  } catch(e){}
  try {
    document.querySelectorAll("#amana-vault-gate input[type='password']").forEach(function(inp){
      inp.setAttribute("autocomplete","current-password");
    });
  } catch(e){}
  window.__CLARITY_SECURITY_REPORT__ = report;
  return report;
};
setTimeout(function(){ try { claritySecurityAudit(); } catch(e){} }, 1000);
})();
