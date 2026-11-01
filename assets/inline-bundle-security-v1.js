/**
 * Named bundle: security audits · v1
 * Duplicate/overlap audits kept in original order.
 */


;/* ==== inline-clarity-security-audit-v1.js ==== */
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


;/* ==== inline-clarity-final-security-sweep-v1.js ==== */
(function(){
"use strict";
if (window.__CLARITY_FINAL_SECURITY_SWEEP_V1__) return;
window.__CLARITY_FINAL_SECURITY_SWEEP_V1__ = true;
window.claritySecurityAudit = function(){
  var report = {ok:true,ts:Date.now(),vault:{
    gate:!!document.getElementById("amana-vault-gate"),
    interior:!!document.getElementById("amana-vault-interior"),
    unlocked:!!(document.getElementById("tab-notes")&&document.getElementById("tab-notes").classList.contains("amana-unlocked")),
    uftRead:typeof window.uftRead==="function",
    uftCollect:typeof window.uftCollect==="function",
    uftKey:window.UFT_KEY||null,
    cryptoSubtle:!!(window.crypto&&window.crypto.subtle),
    pathFilter:typeof window.applyGateSectionFilter==="function",
    pathAttr:document.documentElement.getAttribute("data-clarity-path"),
    pathLock:!!document.getElementById("clarity-path-lock")
  },notes:[],storageScan:{keys:0,suspicious:[]}};
  try{
    for(var i=0;i<localStorage.length;i++){
      var k=localStorage.key(i)||"";
      report.storageScan.keys++;
      if(/passphrase|plaintext.?key|(^|_)password$/i.test(k)){
        report.storageScan.suspicious.push(k);
        report.ok=false;
        report.notes.push("suspicious key:"+k);
      }
    }
  }catch(e){report.notes.push(String(e));}
  try{
    document.querySelectorAll("#amana-vault-gate input[type='password']").forEach(function(inp){
      inp.setAttribute("autocomplete","current-password");
      inp.setAttribute("spellcheck","false");
    });
  }catch(e){}
  if(report.vault.uftKey&&report.vault.uftKey!=="clarity_user_family_tree_v1"){
    report.ok=false;report.notes.push("unexpected UFT_KEY");
  }
  window.__CLARITY_SECURITY_REPORT__=report;
  return report;
};
function boot(){
  try{
    var g=localStorage.getItem("clarity_committed_path")||"seeker";
    document.documentElement.setAttribute("data-clarity-path",g);
    if(typeof applyGateSectionFilter==="function")applyGateSectionFilter(g);
  }catch(e){}
  try{claritySecurityAudit();}catch(e){}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){setTimeout(boot,400);});
else setTimeout(boot,400);
})();


;/* ==== inline-clarity_vault_tree_security_v1.js ==== */
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


;/* ==== inline-clarity-build-security-audit-v1.js ==== */
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


;/* ==== inline-clarity-security-pass-v3.js ==== */
(function(){
  "use strict";
  if (window.__CLARITY_SECURITY_PASS_V3__) return;
  window.__CLARITY_SECURITY_PASS_V3__ = true;

  window.claritySecurityAudit = function(){
    var report = {
      ok: true,
      ts: Date.now(),
      build: "banner-nuclear+path+curriculum",
      vault: {
        tree: !!document.getElementById("user-family-tree-card"),
        uftKey: window.UFT_KEY || "clarity_user_family_tree_v1",
        uftRead: typeof window.uftRead === "function",
        cryptoSubtle: !!(window.crypto && window.crypto.subtle)
      },
      path: {
        attr: document.documentElement.getAttribute("data-clarity-path"),
        request: typeof window.clarityRequestPath === "function",
        reset: typeof window.clarityPathResetToSeeker === "function"
      },
      banner: {
        duo: !!document.getElementById("clarity-top-duo"),
        media: !!document.getElementById("banner-media"),
        live: !!document.getElementById("banner-live"),
        visitOutsideBanner: (function(){
          var v = document.getElementById("clarity-visit-pill-bar");
          var b = document.querySelector(".banner");
          return !!(v && b && !b.contains(v));
        })()
      },
      storage: { keys: 0, suspicious: [] },
      external: { scripts: 0, frames: 0 },
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
        if (/passphrase|plaintext.?key|(^|_)password$|secret.?key/i.test(k)) {
          report.storage.suspicious.push(k);
          report.ok = false;
          report.notes.push("suspicious storage key: " + k);
        }
      }
    } catch(e){}
    try {
      document.querySelectorAll("script[src]").forEach(function(s){
        report.external.scripts++;
        var src = s.getAttribute("src") || "";
        if (/^https?:/i.test(src) && !/fonts\.googleapis|fonts\.gstatic|youtube|flickr/i.test(src)) {
          report.notes.push("external script: " + src.slice(0, 80));
        }
      });
      document.querySelectorAll("iframe[src]").forEach(function(f){
        report.external.frames++;
        var src = f.getAttribute("src") || "";
        if (src && !/youtube\.com|youtube-nocookie\.com/i.test(src)) {
          report.notes.push("non-youtube iframe: " + src.slice(0, 80));
        }
      });
    } catch(e){}
    try {
      document.querySelectorAll("input[type='password']").forEach(function(inp){
        if (!inp.getAttribute("autocomplete")) inp.setAttribute("autocomplete", "current-password");
      });
    } catch(e){}
    if (!report.banner.visitOutsideBanner) {
      report.notes.push("visit bar still inside banner — layout risk");
    }
    window.__CLARITY_SECURITY_REPORT__ = report;
    return report;
  };

  setTimeout(function(){ try { claritySecurityAudit(); } catch(e){} }, 1200);
})();
