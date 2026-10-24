(function(){
"use strict";
if (window.__CLARITY_VAULT_TREE_SECURITY_V1__) return;
window.__CLARITY_VAULT_TREE_SECURITY_V1__ = true;

window.clarityVaultTreeAudit = function(){
  var report = {
    ok: true,
    ts: Date.now(),
    notes: [],
    vault: {
      gate: !!document.getElementById("amana-vault-gate"),
      interior: !!document.getElementById("amana-vault-interior"),
      treeCard: !!document.getElementById("user-family-tree-card"),
      stage: !!document.getElementById("uft-stage"),
      preview: !!document.getElementById("uft-preview"),
      uftRead: typeof window.uftRead === "function",
      uftRender: typeof window.uftRender === "function",
      uftCollect: typeof window.uftCollect === "function",
      uftKey: window.UFT_KEY || null,
      cryptoSubtle: !!(window.crypto && window.crypto.subtle),
      unlocked: !!(document.getElementById("tab-notes") &&
        document.getElementById("tab-notes").classList.contains("amana-unlocked"))
    },
    storage: { keys: 0, suspicious: [] }
  };

  try {
    if (!report.vault.uftKey) report.vault.uftKey = "clarity_user_family_tree_v1";
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
        report.notes.push("suspicious key: " + k);
      }
    }
  } catch(e){ report.notes.push(String(e)); }

  try {
    document.querySelectorAll("#amana-vault-gate input[type='password']").forEach(function(inp){
      inp.setAttribute("autocomplete", "current-password");
      inp.setAttribute("spellcheck", "false");
    });
  } catch(e){}

  /* Ensure tree data stays local — soft check */
  try {
    if (typeof window.uftSave === "function") {
      var src = Function.prototype.toString.call(window.uftSave);
      if (/fetch\s*\(\s*['\"]https?:/i.test(src)) {
        report.ok = false;
        report.notes.push("uftSave may post remotely");
      }
    }
  } catch(e){}

  window.__CLARITY_VAULT_TREE_REPORT__ = report;
  return report;
};

setTimeout(function(){
  try { window.clarityVaultTreeAudit(); } catch(e){}
}, 900);
})();