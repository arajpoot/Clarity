(function(){
  "use strict";
  if (window.__CLARITY_VAULT_NOTE_REGISTRY__) return;
  window.__CLARITY_VAULT_NOTE_REGISTRY__ = true;

  var KEY = "clarity_amana_note_registry_v1"; // local registry (encrypted vault may wrap later)

  function readReg(){
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch(e){ return []; }
  }
  function writeReg(rows){
    try { localStorage.setItem(KEY, JSON.stringify(rows)); } catch(e){}
  }

  function stamp(){
    var d = new Date();
    function p(n){ return n < 10 ? "0"+n : ""+n; }
    return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate())+" "+p(d.getHours())+":"+p(d.getMinutes())+":"+p(d.getSeconds());
  }

  function mountNoteBox(){
    if (document.getElementById("amana-note-registry-wrap")) return;
    var host =
      document.getElementById("amana-gate-status") ||
      document.querySelector(".amana-vault-interior") ||
      document.querySelector("[class*='amana']") ||
      document.getElementById("tab-notes");
    if (!host) return;

    var box = document.createElement("div");
    box.id = "amana-note-registry-wrap";
    box.innerHTML =
      "<h3>Vault note registry · on-device</h3>" +
      "<p style=\"margin:0 0 .35rem;font-size:.75rem;opacity:.8\">Private notes with date/time. Saved on this device. Export as CSV (Excel-friendly). Educational estate readiness — not legal advice.</p>" +
      "<textarea id=\"amana-note-text\" placeholder=\"Write a trust note, debt reminder, or wasiyyah thought…\"></textarea>" +
      "<div class=\"row\">" +
        "<button type=\"button\" id=\"amana-note-save\">Save to registry</button>" +
        "<button type=\"button\" id=\"amana-note-export\">Export Excel/CSV</button>" +
        "<button type=\"button\" id=\"amana-note-clear\">Clear list</button>" +
      "</div>" +
      "<ul id=\"amana-note-list\"></ul>";

    // Prefer inside vault panel
    if (host.id === "amana-gate-status" && host.parentNode) host.parentNode.appendChild(box);
    else host.appendChild(box);

    function render(){
      var ul = document.getElementById("amana-note-list");
      if (!ul) return;
      var rows = readReg().slice().reverse();
      ul.innerHTML = rows.slice(0, 40).map(function(r){
        return "<li><strong>"+ (r.ts||"") +"</strong> — "+ String(r.note||"").replace(/</g,"&lt;").slice(0,200) +"</li>";
      }).join("") || "<li style=\"opacity:.7\">No notes yet.</li>";
    }

    document.getElementById("amana-note-save").onclick = function(){
      var ta = document.getElementById("amana-note-text");
      var note = (ta && ta.value || "").trim();
      if (!note) return;
      var rows = readReg();
      rows.push({ ts: stamp(), note: note, id: "n"+Date.now() });
      writeReg(rows);
      if (ta) ta.value = "";
      render();
    };
    document.getElementById("amana-note-export").onclick = function(){
      var rows = readReg();
      var csv = "DateTime,Note\n" + rows.map(function(r){
        var n = String(r.note||"").replace(/"/g,'""');
        return '"'+ (r.ts||"") +'","'+ n +'"';
      }).join("\n");
      var blob = new Blob(["\ufeff"+csv], { type: "text/csv;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "clarity-amana-note-registry-"+ todayKeySafe() +".csv";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function(){ try{ URL.revokeObjectURL(a.href); }catch(e){} }, 2000);
    };
    document.getElementById("amana-note-clear").onclick = function(){
      if (confirm("Clear all local registry notes on this device?")) { writeReg([]); render(); }
    };
    function todayKeySafe(){
      var d=new Date(); return d.getFullYear()+"-"+ (d.getMonth()+1) +"-"+ d.getDate();
    }
    render();
  }

  function boot(){ try { mountNoteBox(); } catch(e){} }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 400); });
  else setTimeout(boot, 400);
  window.addEventListener("load", function(){ setTimeout(boot, 900); });
  // When user opens vault tab
  document.addEventListener("click", function(ev){
    var t = ev.target && ev.target.closest && ev.target.closest("[data-rail-tab='notes'], [data-cdl-tab='notes']");
    if (t) setTimeout(boot, 200);
  }, true);
})();