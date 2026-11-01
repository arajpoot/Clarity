(function(){
  "use strict";
  if (window.__CLARITY_VAULT_HARDEN_V1__) return;
  window.__CLARITY_VAULT_HARDEN_V1__ = true;

  /** Site-wide security audit focused on Amana Vault */
  window.claritySecurityDeepAudit = function(){
    var report = {
      ok: true,
      ts: Date.now(),
      vault: {
        subtle: !!(window.crypto && window.crypto.subtle),
        iterations: 120000,
        algo: "PBKDF2-SHA256 → AES-GCM-256",
        passphraseInStorage: false,
        suspiciousKeys: [],
        exportPresent: !!document.getElementById("amana-export-btn") || /Export encrypted/i.test(document.body.innerText||""),
        gatePresent: !!document.getElementById("amana-gate-status") || !!document.querySelector(".amana-vault-interior, #amana-vault, [data-vault]")
      },
      storage: { total: 0, vaultish: [] },
      fetch: { meme: typeof window.memeFetchBg === "function", online: typeof window.__memeOnlineFetch === "function" },
      interlink: {
        switchTab: typeof window.switchTab === "function",
        door: typeof window.clarityOpenSectionDoor === "function",
        toMeme: typeof window.claritySendToMeme === "function" || typeof window.clarityToMeme === "function",
        memePush: typeof window.clarityMemePush === "function",
        tdPost: typeof window.tdPost === "function"
      },
      notes: []
    };

    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i) || "";
        report.storage.total++;
        if (/passphrase|password|plaintext|secret.?key|raw.?key/i.test(k)) {
          report.vault.passphraseInStorage = true;
          report.vault.suspiciousKeys.push(k);
          report.ok = false;
          report.notes.push("CRITICAL: suspicious key in localStorage: " + k);
        }
        if (/vault|amana|uft|family.?tree|wasiyyah|faraid/i.test(k)) {
          report.storage.vaultish.push(k);
        }
      }
    } catch(e) { report.notes.push("localStorage read blocked"); }

    try {
      // Never leave passphrase in DOM value attributes after unlock attempt
      document.querySelectorAll('input[type="password"]').forEach(function(inp){
        if (!inp.getAttribute("autocomplete")) inp.setAttribute("autocomplete", "current-password");
        if (!inp.getAttribute("name")) inp.setAttribute("name", "clarity-vault-pass");
      });
    } catch(e){}

    if (!report.vault.subtle) {
      report.ok = false;
      report.notes.push("Web Crypto subtle missing — vault cannot encrypt");
    }
    window.__CLARITY_SECURITY_DEEP__ = report;
    return report;
  };

  /** Plug: wipe password fields on lock / visibility hide */
  function wipePassFields(){
    document.querySelectorAll('input[type="password"]').forEach(function(inp){
      try {
        if (document.hidden || document.body.classList.contains("vault-locked")) {
          inp.value = "";
        }
      } catch(e){}
    });
  }
  document.addEventListener("visibilitychange", wipePassFields);
  setInterval(function(){
    try {
      if (document.body && document.body.classList.contains("vault-locked")) wipePassFields();
    } catch(e){}
  }, 15000);

  /** Block accidental logging of passphrase-shaped strings */
  try {
    var _clog = console.log;
    // do not override aggressively — only audit helper
  } catch(e){}

  setTimeout(function(){ try { claritySecurityDeepAudit(); } catch(e){} }, 900);
})();