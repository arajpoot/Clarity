/**
 * Amana note registry · one-way: landing entry → vault Heir readiness (collapsed)
 * KEY: clarity_amana_note_registry_v1
 * Educational estate readiness — not legal advice / not a fatwa
 */
(function () {
  "use strict";
  if (window.__CLARITY_VAULT_NOTE_REGISTRY_V3__) return;
  window.__CLARITY_VAULT_NOTE_REGISTRY_V3__ = true;
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

  /** Landing: entry only — no list of saved notes */
  function mountLanding() {
    var mount = document.getElementById("amana-note-registry-landing");
    if (!mount) return;

    // Always rebuild landing UI as entry-only
    mount.innerHTML =
      "<textarea id=\"amana-note-text-landing\" placeholder=\"Write a trust note, debt reminder, or wasiyyah thought…\" rows=\"3\" " +
        "style=\"width:100%;box-sizing:border-box;min-height:4.5rem;margin:.35rem 0;padding:.5rem .65rem;border-radius:10px;" +
        "border:1px solid rgba(212,180,90,.25);background:rgba(0,0,0,.15);color:inherit\"></textarea>" +
      "<div style=\"display:flex;flex-wrap:wrap;gap:.4rem;margin:.35rem 0\">" +
        "<button type=\"button\" id=\"amana-note-save-landing\" style=\"padding:.4rem .75rem;border-radius:999px;border:none;" +
          "background:#0f4c3a;color:#f5e6b8;font-weight:700;cursor:pointer\">Save to registry</button>" +
      "</div>" +
      "<p id=\"amana-note-landing-hint\" class=\"cdl-sub\" style=\"margin:.25rem 0 0;font-size:.78rem;opacity:.88;line-height:1.4\">" +
        "Notes are stored only on this device. They are <strong>not listed here</strong> — open " +
        "<strong>Amānah Vault → Heir readiness</strong> (collapsed section) for heirs to review when the vault is unlocked. " +
        "One-way channel · educational · not legal advice." +
      "</p>" +
      "<p id=\"amana-note-save-flash\" style=\"display:none;margin:.35rem 0 0;font-size:.78rem;color:#c9a84c;font-weight:600\"></p>";

    var save = document.getElementById("amana-note-save-landing");
    var ta = document.getElementById("amana-note-text-landing");
    if (save && !save.__boundV3) {
      save.__boundV3 = true;
      save.onclick = function () {
        var note = (ta && ta.value || "").trim();
        if (!note) return;
        var rows = readReg();
        rows.push({ ts: stamp(), note: note, id: "n" + Date.now() });
        writeReg(rows);
        if (ta) ta.value = "";
        var flash = document.getElementById("amana-note-save-flash");
        if (flash) {
          flash.style.display = "block";
          flash.textContent = "Saved · find under Amānah Vault → Heir readiness";
          setTimeout(function () { flash.style.display = "none"; }, 3200);
        }
        // refresh vault collapsed list if present
        try { renderVaultHeirList(); } catch (e) {}
        try {
          window.dispatchEvent(new CustomEvent("clarity-amana-note-saved", { detail: { count: rows.length } }));
        } catch (e2) {}
      };
    }
  }

  /** Remove any entry UI that was previously mounted on the vault passphrase / gate page */
  function removeVaultGateEntry() {
    var wrap = document.getElementById("amana-note-registry-wrap");
    if (wrap) {
      try { wrap.parentNode && wrap.parentNode.removeChild(wrap); } catch (e) {}
    }
    // orphan lists under gate status
    document.querySelectorAll("#amana-gate-status #amana-note-list, #tab-notes > #amana-note-registry-wrap").forEach(function (el) {
      try { el.parentNode && el.parentNode.removeChild(el); } catch (e) {}
    });
  }

  function renderVaultHeirList() {
    var host = document.getElementById("amana-heir-notes-host");
    if (!host) return;
    var rows = readReg().slice().reverse();
    var ul = host.querySelector("#amana-heir-note-list");
    if (!ul) return;
    var countLab = host.querySelector("#amana-heir-note-count");
    if (countLab) countLab.textContent = rows.length ? (rows.length + " note" + (rows.length === 1 ? "" : "s")) : "No notes yet";
    ul.innerHTML = rows.length
      ? rows.slice(0, 60).map(function (r) {
          return "<li style=\"margin:0.35rem 0;padding:0.35rem 0;border-bottom:1px solid rgba(212,180,90,0.12)\">" +
            "<strong style=\"font-size:0.75rem;opacity:0.85\">" + (r.ts || "") + "</strong>" +
            "<div style=\"font-size:0.84rem;line-height:1.4;margin-top:0.15rem\">" +
            String(r.note || "").replace(/</g, "&lt;") + "</div></li>";
        }).join("")
      : "<li style=\"opacity:0.7;list-style:none\">No registry notes yet. Add them from Day landing · Vault note registry.</li>";
  }

  /** Vault: collapsed records under Heir readiness only — no entry form */
  function mountVaultHeir() {
    removeVaultGateEntry();
    var readiness = document.getElementById("amana-heir-readiness") ||
      document.getElementById("amana-heir-body") ||
      document.querySelector(".amana-heir-body");
    if (!readiness) return;

    var host = document.getElementById("amana-heir-notes-host");
    if (!host) {
      host = document.createElement("details");
      host.id = "amana-heir-notes-host";
      host.className = "amana-heir-notes-dd";
      host.style.cssText = "margin:0.85rem 0 0.35rem;border-radius:12px;border:1px solid rgba(212,180,90,0.28);padding:0.15rem 0.65rem 0.55rem;background:rgba(0,0,0,0.12)";
      host.innerHTML =
        "<summary style=\"cursor:pointer;font-weight:700;padding:0.5rem 0.15rem;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:0.5rem\">" +
          "<span>📝 Registry notes · from Day landing</span>" +
          "<span id=\"amana-heir-note-count\" style=\"font-size:0.72rem;font-weight:600;opacity:0.85\">…</span>" +
        "</summary>" +
        "<p style=\"margin:0.2rem 0 0.45rem;font-size:0.75rem;opacity:0.8;line-height:1.4\">" +
          "One-way channel: notes are written on Day landing, stored on this device, and shown here for heirs after unlock. " +
          "Educational estate readiness — not legal advice.</p>" +
        "<ul id=\"amana-heir-note-list\" style=\"margin:0;padding-left:1rem\"></ul>" +
        "<div style=\"display:flex;flex-wrap:wrap;gap:0.35rem;margin-top:0.5rem\">" +
          "<button type=\"button\" id=\"amana-heir-note-export\" style=\"padding:0.35rem 0.65rem;border-radius:999px;border:1px solid rgba(212,180,90,0.35);" +
            "background:transparent;color:inherit;cursor:pointer;font-size:0.75rem\">Export Excel/CSV</button>" +
          "<button type=\"button\" id=\"amana-heir-note-clear\" style=\"padding:0.35rem 0.65rem;border-radius:999px;border:1px solid rgba(212,180,90,0.35);" +
            "background:transparent;color:inherit;cursor:pointer;font-size:0.75rem\">Clear list</button>" +
        "</div>";
      readiness.appendChild(host);

      var exp = document.getElementById("amana-heir-note-export");
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
      var clr = document.getElementById("amana-heir-note-clear");
      if (clr && !clr.__bound) {
        clr.__bound = true;
        clr.onclick = function () {
          if (confirm("Clear all local registry notes on this device?")) {
            writeReg([]);
            renderVaultHeirList();
          }
        };
      }
    }
    renderVaultHeirList();
  }

  function lockAmanaVault() {
    try {
      var tab = document.getElementById("tab-notes");
      if (tab) {
        tab.classList.remove("amana-unlocked");
        tab.classList.add("amana-locked");
      }
      document.body.classList.remove("amana-unlocked");
      document.body.classList.add("vault-locked");
      document.querySelectorAll("#tab-notes input[type=password]").forEach(function (inp) {
        try { inp.value = ""; } catch (e) {}
      });
    } catch (e) {}
  }

  function boot() {
    try { mountLanding(); } catch (e) {}
    try { removeVaultGateEntry(); } catch (e) {}
    try { mountVaultHeir(); } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 500); });
  } else setTimeout(boot, 500);
  window.addEventListener("load", function () {
    setTimeout(boot, 900);
    setTimeout(boot, 1800);
  });

  var obs = new MutationObserver(function () {
    if (document.getElementById("amana-note-registry-landing") && !document.getElementById("amana-note-text-landing")) {
      try { mountLanding(); } catch (e) {}
    }
    if (document.getElementById("amana-heir-readiness") && !document.getElementById("amana-heir-notes-host")) {
      try { mountVaultHeir(); } catch (e) {}
    }
    // Keep gate free of old entry UI
    if (document.getElementById("amana-note-registry-wrap")) {
      try { removeVaultGateEntry(); } catch (e) {}
    }
  });
  try { obs.observe(document.documentElement, { childList: true, subtree: true }); } catch (e) {}

  document.addEventListener("click", function (ev) {
    var t = ev.target && ev.target.closest && ev.target.closest("[data-rail-tab], [data-tab], .door-rail-btn");
    if (!t) return;
    var tab = (t.getAttribute("data-rail-tab") || t.getAttribute("data-tab") || "").toLowerCase();
    if (tab === "notes" || tab === "amana" || tab === "vault") {
      setTimeout(function () {
        removeVaultGateEntry();
        mountVaultHeir();
      }, 200);
    } else if (tab) {
      setTimeout(lockAmanaVault, 30);
    }
  }, true);

  window.addEventListener("hashchange", function () {
    var h = (location.hash || "").replace(/^#/, "").toLowerCase();
    if (h && h !== "notes" && h !== "amana" && h !== "vault") lockAmanaVault();
    if (h === "notes" || h === "amana") {
      setTimeout(function () { removeVaultGateEntry(); mountVaultHeir(); }, 200);
    }
  });

  window.ClarityAmanaNotes = {
    read: readReg,
    write: writeReg,
    render: renderVaultHeirList,
    lock: lockAmanaVault,
    mount: boot
  };
})();
