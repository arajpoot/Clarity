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
