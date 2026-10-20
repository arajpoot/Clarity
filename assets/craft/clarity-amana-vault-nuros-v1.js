/* NurOS Amana package panel */

/*! NurOS Amana Vault — full on-device package, emergency retrieval, cross-device import */
(function(){
  "use strict";
  var OS_NAME = "NurOS";
  var PACKAGE_VERSION = 2;
  var PREFIXES = [
    "clarity_", "clarity-", "NOTES_KEY", "clarity-notes",
    "clarity-notes-v1", "clarity_deed_journal"
  ];

  function store(){
    return (window.clarityLS && typeof clarityLS.getItem === "function")
      ? clarityLS
      : (function(){ try { return localStorage; } catch(e){ return null; } })();
  }

  function allKeys(ls){
    var keys = [];
    if (!ls) return keys;
    try {
      if (ls === localStorage || (ls.length !== undefined && typeof ls.key === "function")) {
        for (var i = 0; i < ls.length; i++) {
          var k = ls.key(i);
          if (k) keys.push(k);
        }
      } else {
        // memory fallback object may not expose length — try common keys via scan of known patterns
      }
    } catch(e){}
    // Always include known critical keys
    var critical = [
      "clarity_name", "clarity_daily_streak", "clarity_daily_last", "clarity_lessons",
      "clarity_path_override", "clarity_committed_path", "clarity_primary_door",
      "clarity_active_primary_path", "clarity_welcome_seen", "clarity_welcome_seen_v2",
      "clarity_theme_mode", "clarity_deed_journal_v1", "clarity-notes-v1",
      "clarity_bookmarks", "clarity_seerah_mirror", "clarity_quiz_score",
      "clarity_notify", "clarity_lang", "clarity_beginner_mode"
    ];
    critical.forEach(function(k){ if (keys.indexOf(k) < 0) keys.push(k); });
    // progressive path keys
    try {
      for (var j = 0; j < (ls.length || 0); j++) {
        var kk = ls.key(j);
        if (kk && (kk.indexOf("clarity_") === 0 || kk.indexOf("clarity-") === 0)) {
          if (keys.indexOf(kk) < 0) keys.push(kk);
        }
      }
    } catch(e2){}
    return keys;
  }

  function isOurs(k){
    if (!k) return false;
    if (k.indexOf("clarity_") === 0 || k.indexOf("clarity-") === 0) return true;
    if (k === "clarity-notes-v1" || k.indexOf("clarity-notes") === 0) return true;
    return false;
  }

  function buildPackage(kind){
    var ls = store();
    var data = {};
    var keys = allKeys(ls);
    keys.forEach(function(k){
      if (!isOurs(k) && k !== "clarity-notes-v1") return;
      try {
        var v = ls.getItem(k);
        if (v !== null && v !== undefined) data[k] = v;
      } catch(e){}
    });
    // Force notes + deed journal
    try {
      var nk = "clarity-notes-v1";
      if (!data[nk] && ls) data[nk] = ls.getItem(nk);
    } catch(e){}
    try {
      if (!data["clarity_deed_journal_v1"] && ls)
        data["clarity_deed_journal_v1"] = ls.getItem("clarity_deed_journal_v1");
    } catch(e2){}

    return {
      os: OS_NAME,
      version: PACKAGE_VERSION,
      kind: kind || "full",
      exportedAt: new Date().toISOString(),
      disclaimer: "Educational intentions only. Acceptance is with Allah. Not a fatwa or formal will.",
      keys: Object.keys(data).length,
      data: data
    };
  }

  function downloadJSON(obj, filename){
    var blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){
      try { URL.revokeObjectURL(a.href); a.remove(); } catch(e){}
    }, 500);
  }

  function persistVerify(){
    var ls = store();
    var report = { ok: false, backend: "none", canWrite: false, canRead: false, keyCount: 0, name: "", streak: 0, notes: 0 };
    if (!ls) { report.backend = "unavailable"; return report; }
    try {
      var probe = "__nuros_probe_" + Date.now();
      ls.setItem(probe, "1");
      report.canWrite = ls.getItem(probe) === "1";
      ls.removeItem(probe);
      report.canRead = true;
      report.ok = report.canWrite;
      // detect backend
      try {
        if (ls === window.localStorage) report.backend = "localStorage";
        else report.backend = "memory-fallback";
      } catch(e){ report.backend = "opaque"; }
      var keys = allKeys(ls).filter(isOurs);
      report.keyCount = keys.length;
      report.name = ls.getItem("clarity_name") || "";
      report.streak = parseInt(ls.getItem("clarity_daily_streak") || "0", 10) || 0;
      try {
        var notesRaw = ls.getItem("clarity-notes-v1");
        if (notesRaw) {
          var n = JSON.parse(notesRaw);
          report.notes = (n && n.notes && n.notes.length) || 0;
        }
      } catch(e2){}
    } catch(err) {
      report.ok = false;
      report.backend = "blocked";
    }
    return report;
  }

  function refreshStatus(){
    var el = document.getElementById("av-status");
    var chip = document.getElementById("nuros-storage-chip");
    var r = persistVerify();
    var lines = [];
    lines.push(OS_NAME + " storage: " + (r.ok ? "ACTIVE" : "LIMITED"));
    lines.push("Backend: " + r.backend);
    lines.push("Keys: " + r.keyCount + " · Notes: " + r.notes + " · Streak: " + r.streak);
    if (r.name) lines.push("Name on device: " + r.name.slice(0, 24));
    if (r.backend === "memory-fallback")
      lines.push("⚠ Private mode? Data may not survive refresh — Export package now.");
    if (el) el.textContent = lines.join("\n");
    if (chip) {
      chip.textContent = r.ok ? "On-device ✓" : "Storage limited";
      chip.classList.toggle("warn", !r.ok || r.backend === "memory-fallback");
    }
    return r;
  }

  function applyPackage(pkg, mode){
    if (!pkg || !pkg.data || typeof pkg.data !== "object")
      throw new Error("Invalid package");
    var ls = store();
    if (!ls) throw new Error("No storage available");
    var keys = Object.keys(pkg.data);
    if (mode === "merge") {
      keys.forEach(function(k){
        if (!isOurs(k) && k !== "clarity-notes-v1") return;
        try { ls.setItem(k, pkg.data[k]); } catch(e){}
      });
    } else {
      // replace ours only — do not wipe unrelated site data
      var existing = allKeys(ls).filter(isOurs);
      existing.forEach(function(k){
        try { ls.removeItem(k); } catch(e){}
      });
      keys.forEach(function(k){
        if (!isOurs(k) && k !== "clarity-notes-v1") return;
        try { ls.setItem(k, pkg.data[k]); } catch(e){}
      });
    }
  }

  window.NurOS = {
    name: OS_NAME,
    openVault: function(){
      var panel = document.getElementById("nuros-amana-panel");
      if (!panel) return;
      panel.classList.add("open");
      panel.setAttribute("aria-hidden", "false");
      refreshStatus();
    },
    closeVault: function(){
      var panel = document.getElementById("nuros-amana-panel");
      if (!panel) return;
      panel.classList.remove("open");
      panel.setAttribute("aria-hidden", "true");
    },
    exportPackage: function(){
      var pkg = buildPackage("full");
      var day = new Date().toISOString().slice(0,10);
      downloadJSON(pkg, "nuros-amana-package-" + day + ".json");
      refreshStatus();
      try { alert("Package saved (" + pkg.keys + " keys). Import it on another device via Amana Vault."); } catch(e){}
    },
    exportEmergency: function(){
      var pkg = buildPackage("emergency");
      pkg.emergency = true;
      pkg.note = "Minimal recovery snapshot — import ASAP on a trusted device.";
      var day = new Date().toISOString().slice(0,10);
      downloadJSON(pkg, "nuros-EMERGENCY-" + day + ".json");
      refreshStatus();
    },
    importPackage: function(ev){
      var file = ev.target && ev.target.files && ev.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function(e){
        try {
          var pkg = JSON.parse(e.target.result);
          if (!pkg.data) throw new Error("No data field");
          var n = Object.keys(pkg.data).length;
          var mode = confirm(
            "Import NurOS package (" + n + " keys" + (pkg.exportedAt ? ", from " + String(pkg.exportedAt).slice(0,10) : "") + ")?\n\nOK = Replace this device's Clarity data\nCancel = abort"
          );
          if (!mode) { ev.target.value = ""; return; }
          applyPackage(pkg, "replace");
          refreshStatus();
          try {
            if (typeof notesLoad === "function") notesLoad();
          } catch(err){}
          try {
            if (typeof clarityRefreshTodaySurface === "function") clarityRefreshTodaySurface();
          } catch(err2){}
          try {
            if (typeof showWelcome === "function") showWelcome();
          } catch(err3){}
          try {
            if (typeof clarityUpdateGrowthTree === "function") clarityUpdateGrowthTree();
          } catch(err4){}
          alert("Package imported. Your intentions are on this device again.");
          // soft reload surfaces
          try { location.reload(); } catch(err5){}
        } catch(err) {
          alert("Could not import: " + (err && err.message ? err.message : "invalid file"));
        }
        ev.target.value = "";
      };
      reader.readAsText(file);
    },
    copySummary: function(){
      var r = persistVerify();
      var text = OS_NAME + " summary\n" +
        "Name: " + (r.name || "(none)") + "\n" +
        "Streak: " + r.streak + "\n" +
        "Notes: " + r.notes + "\n" +
        "Keys: " + r.keyCount + "\n" +
        "Backend: " + r.backend + "\n" +
        "Exported hint: use Amana Vault → Export package\n" +
        "Disclaimer: Educational only. Acceptance is with Allah.";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function(){
          alert("Summary copied.");
        }).catch(function(){ prompt("Copy:", text); });
      } else {
        prompt("Copy:", text);
      }
    },
    health: persistVerify,
    refreshStatus: refreshStatus
  };

  // Auto-persist heartbeat: re-write critical keys periodically so some browsers flush to disk
  function heartbeat(){
    var ls = store();
    if (!ls) return;
    try {
      var r = persistVerify();
      if (!r.ok) return;
      // touch a timestamp so storage layer stays warm
      ls.setItem("clarity_nuros_heartbeat", new Date().toISOString());
    } catch(e){}
  }

  function injectChip(){
    if (document.getElementById("nuros-storage-chip")) return;
    var host = document.querySelector(".tjp-title, .banner h1, #today-journey-plaque h2");
    if (!host) return;
    var chip = document.createElement("span");
    chip.id = "nuros-storage-chip";
    chip.textContent = "On-device …";
    host.appendChild(chip);
    refreshStatus();
  }

  function boot(){
    injectChip();
    refreshStatus();
    heartbeat();
    setInterval(heartbeat, 120000);
    // Escape closes vault
    document.addEventListener("keydown", function(ev){
      if (ev.key === "Escape") NurOS.closeVault();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", function(){ setTimeout(injectChip, 200); setTimeout(refreshStatus, 300); });

  // Ensure notes export still works; also expose full package from notes toolbar if present
  window.nurosExportAll = function(){ NurOS.exportPackage(); };
  window.nurosImportAll = function(ev){ NurOS.importPackage(ev); };
})();
