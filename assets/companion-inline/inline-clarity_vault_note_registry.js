/**
 * Amana note registry · landing + vault (shared storage)
 * KEY: clarity_amana_note_registry_v1
 */
(function () {
  "use strict";
  if (window.__CLARITY_VAULT_NOTE_REGISTRY_V2__) return;
  window.__CLARITY_VAULT_NOTE_REGISTRY_V2__ = true;
  window.__CLARITY_VAULT_NOTE_REGISTRY__ = true;

  var KEY = "clarity_amana_note_registry_v1";

  function readReg() {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; }
  }
  function writeReg(rows) {
    try { localStorage.setItem(KEY, JSON.stringify(rows)); } catch (e) {}
  }
  function stamp() {
    var d = new Date();
    function p(n) { return n < 10 ? "0" + n : "" + n; }
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " +
      p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
  }
  function todayKeySafe() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  function renderList(ulId) {
    var ul = document.getElementById(ulId);
    if (!ul) return;
    var rows = readReg().slice().reverse();
    ul.innerHTML = rows.slice(0, 40).map(function (r) {
      return "<li><strong>" + (r.ts || "") + "</strong> — " +
        String(r.note || "").replace(/</g, "&lt;").slice(0, 200) + "</li>";
    }).join("") || "<li style=\"opacity:.7\">No notes yet.</li>";
  }

  function renderAll() {
    renderList("amana-note-list");
    renderList("amana-note-list-landing");
  }

  function bindControls(prefix) {
    var save = document.getElementById(prefix + "save");
    var exp = document.getElementById(prefix + "export");
    var clr = document.getElementById(prefix + "clear");
    var ta = document.getElementById(prefix + "text");
    if (save && !save.__bound) {
      save.__bound = true;
      save.onclick = function () {
        var note = (ta && ta.value || "").trim();
        if (!note) return;
        var rows = readReg();
        rows.push({ ts: stamp(), note: note, id: "n" + Date.now() });
        writeReg(rows);
        if (ta) ta.value = "";
        renderAll();
        try {
          window.dispatchEvent(new CustomEvent("clarity-amana-note-saved", { detail: { count: rows.length } }));
        } catch (e) {}
      };
    }
    if (exp && !exp.__bound) {
      exp.__bound = true;
      exp.onclick = function () {
        var rows = readReg();
        var csv = "DateTime,Note\n" + rows.map(function (r) {
          var n = String(r.note || "").replace(/"/g, '""');
          return '"' + (r.ts || "") + '","' + n + '"';
        }).join("\n");
        var blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "clarity-amana-note-registry-" + todayKeySafe() + ".csv";
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { try { URL.revokeObjectURL(a.href); } catch (e) {} }, 2000);
      };
    }
    if (clr && !clr.__bound) {
      clr.__bound = true;
      clr.onclick = function () {
        if (confirm("Clear all local registry notes on this device?")) {
          writeReg([]);
          renderAll();
        }
      };
    }
  }

  function formHTML(idSuffix) {
    var s = idSuffix || "";
    return (
      (s ? "" : "<h3>Vault note registry · on-device</h3>") +
      (s ? "" : "<p style=\"margin:0 0 .35rem;font-size:.75rem;opacity:.8\">Private notes with date/time. Saved on this device. Export as CSV (Excel-friendly). Educational estate readiness — not legal advice.</p>") +
      "<textarea id=\"amana-note-text" + s + "\" placeholder=\"Write a trust note, debt reminder, or wasiyyah thought…\" rows=\"3\" style=\"width:100%;box-sizing:border-box;min-height:4.5rem;margin:.35rem 0;padding:.5rem .65rem;border-radius:10px;border:1px solid rgba(212,180,90,.25);background:rgba(0,0,0,.15);color:inherit\"></textarea>" +
      "<div class=\"row\" style=\"display:flex;flex-wrap:wrap;gap:.4rem;margin:.35rem 0\">" +
        "<button type=\"button\" class=\"cdl-btn\" id=\"amana-note-save" + s + "\" style=\"padding:.4rem .75rem;border-radius:999px;border:none;background:#0f4c3a;color:#f5e6b8;font-weight:700;cursor:pointer\">Save to registry</button>" +
        "<button type=\"button\" class=\"cdl-btn secondary\" id=\"amana-note-export" + s + "\" style=\"padding:.4rem .75rem;border-radius:999px;border:1px solid rgba(212,180,90,.35);background:transparent;color:inherit;cursor:pointer\">Export Excel/CSV</button>" +
        "<button type=\"button\" class=\"cdl-btn secondary\" id=\"amana-note-clear" + s + "\" style=\"padding:.4rem .75rem;border-radius:999px;border:1px solid rgba(212,180,90,.35);background:transparent;color:inherit;cursor:pointer\">Clear list</button>" +
      "</div>" +
      "<ul id=\"amana-note-list" + s + "\" style=\"margin:.4rem 0 0;padding-left:1.1rem;font-size:.82rem;line-height:1.45\"></ul>"
    );
  }

  function mountLanding() {
    var host = document.getElementById("amana-note-registry-landing") ||
      document.getElementById("cdl-amana-note-host");
    if (!host) return;
    var mount = document.getElementById("amana-note-registry-landing") || host;
    if (document.getElementById("amana-note-text-landing")) {
      bindControls("amana-note-");
      // wrong prefix for landing — use landing ids
    }
    if (!document.getElementById("amana-note-text-landing")) {
      if (mount.id === "amana-note-registry-landing") {
        mount.innerHTML = formHTML("-landing");
      } else if (!document.getElementById("amana-note-registry-landing")) {
        var inner = document.createElement("div");
        inner.id = "amana-note-registry-landing";
        inner.innerHTML = formHTML("-landing");
        mount.appendChild(inner);
      }
    }
    // bind landing controls with suffix -landing → ids amana-note-save-landing
    var map = [
      ["amana-note-save-landing", "save"],
      ["amana-note-export-landing", "export"],
      ["amana-note-clear-landing", "clear"]
    ];
    // manual bind for -landing suffix
    var save = document.getElementById("amana-note-save-landing");
    var ta = document.getElementById("amana-note-text-landing");
    if (save && !save.__bound) {
      save.__bound = true;
      save.onclick = function () {
        var note = (ta && ta.value || "").trim();
        if (!note) return;
        var rows = readReg();
        rows.push({ ts: stamp(), note: note, id: "n" + Date.now() });
        writeReg(rows);
        if (ta) ta.value = "";
        renderAll();
      };
    }
    var exp = document.getElementById("amana-note-export-landing");
    if (exp && !exp.__bound) {
      exp.__bound = true;
      exp.onclick = function () {
        var rows = readReg();
        var csv = "DateTime,Note\n" + rows.map(function (r) {
          return '"' + (r.ts || "") + '","' + String(r.note || "").replace(/"/g, '""') + '"';
        }).join("\n");
        var blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "clarity-amana-note-registry-" + todayKeySafe() + ".csv";
        document.body.appendChild(a); a.click(); a.remove();
      };
    }
    var clr = document.getElementById("amana-note-clear-landing");
    if (clr && !clr.__bound) {
      clr.__bound = true;
      clr.onclick = function () {
        if (confirm("Clear all local registry notes on this device?")) {
          writeReg([]);
          renderAll();
        }
      };
    }
    renderAll();
  }

  function mountVault() {
    if (document.getElementById("amana-note-registry-wrap")) {
      bindControls("amana-note-");
      renderAll();
      return;
    }
    var host =
      document.getElementById("amana-gate-status") ||
      document.querySelector(".amana-vault-interior") ||
      document.getElementById("tab-notes");
    if (!host) return;

    var box = document.createElement("div");
    box.id = "amana-note-registry-wrap";
    box.innerHTML = formHTML("");
    if (host.id === "amana-gate-status" && host.parentNode) host.parentNode.appendChild(box);
    else host.appendChild(box);
    bindControls("amana-note-");
    renderAll();
  }

  /** Lock Amānah vault when leaving notes tab */
  function lockAmanaVault() {
    try {
      var tab = document.getElementById("tab-notes");
      if (tab) {
        tab.classList.remove("amana-unlocked");
        tab.classList.add("amana-locked");
      }
      document.body.classList.remove("amana-unlocked");
      document.body.classList.add("vault-locked");
      document.querySelectorAll("#tab-notes input[type=password], #tab-notes input[type=text][id*='pass'], #tab-notes input[autocomplete=current-password]").forEach(function (inp) {
        try { inp.value = ""; } catch (e) {}
      });
      // hide unlocked interior if present
      document.querySelectorAll("#tab-notes .amana-vault-interior, #tab-notes [data-amana-interior]").forEach(function (el) {
        if (el.closest && el.closest("#amana-note-registry-wrap")) return;
      });
    } catch (e) {}
  }

  function boot() {
    try { mountLanding(); } catch (e) {}
    try { mountVault(); } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 500); });
  } else setTimeout(boot, 500);
  window.addEventListener("load", function () {
    setTimeout(boot, 900);
    setTimeout(boot, 1800);
  });

  // Re-mount landing when day landing rebuilds
  var obs = new MutationObserver(function () {
    if (document.getElementById("cdl-amana-note-host") && !document.getElementById("amana-note-text-landing")) {
      try { mountLanding(); } catch (e) {}
    }
  });
  try { obs.observe(document.documentElement, { childList: true, subtree: true }); } catch (e) {}

  document.addEventListener("click", function (ev) {
    var t = ev.target && ev.target.closest && ev.target.closest("[data-rail-tab], [data-tab], .door-rail-btn");
    if (!t) return;
    var tab = (t.getAttribute("data-rail-tab") || t.getAttribute("data-tab") || "").toLowerCase();
    if (tab === "notes" || tab === "amana" || tab === "vault") {
      setTimeout(function () { try { mountVault(); } catch (e) {} }, 200);
    } else if (tab) {
      // Any other section tab → lock vault
      setTimeout(lockAmanaVault, 30);
    }
  }, true);

  window.addEventListener("hashchange", function () {
    var h = (location.hash || "").replace(/^#/, "").toLowerCase();
    if (h && h !== "notes" && h !== "amana" && h !== "vault") {
      lockAmanaVault();
    }
    if (h === "notes" || h === "amana") setTimeout(mountVault, 200);
  });

  window.ClarityAmanaNotes = { read: readReg, write: writeReg, render: renderAll, lock: lockAmanaVault, mount: boot };
})();
