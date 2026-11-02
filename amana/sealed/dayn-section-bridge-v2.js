/*! Amānah Dayn + notes section · below heirs letter · day landing pair · CSV/Excel
 * Storage: clarity_dayn_ledger_v1 (original) · notes via existing registry when present
 * Educational only — not a fatwa · not legal/financial advice
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_DAYN_SECTION_V2__) return;
  g.__CLARITY_DAYN_SECTION_V2__ = true;

  var STORE = "clarity_dayn_ledger_v1";

  function load() {
    try {
      var o = JSON.parse(localStorage.getItem(STORE) || "{}");
      if (!o.lines) o.lines = [];
      if (!o.repayments) o.repayments = [];
      return o;
    } catch (e) {
      return { lines: [], repayments: [] };
    }
  }
  function save(data) {
    try {
      localStorage.setItem(STORE, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }
  function remaining(line, data) {
    var paid = 0;
    (data.repayments || []).forEach(function (r) {
      if (r.lineId === line.id) paid += Number(r.amount) || 0;
    });
    return Math.max(0, (Number(line.amount) || 0) - paid);
  }
  function money(n) {
    var x = Number(n);
    if (!isFinite(x)) return "0.00";
    return (Math.round(x * 100) / 100).toFixed(2);
  }

  function findHeirsLetter() {
    var sels = [
      "#ahr-letter",
      "[data-heir-letter]",
      "#heir-letter",
      "textarea#ahr-letter",
      "label[for='ahr-letter']",
    ];
    for (var i = 0; i < sels.length; i++) {
      var el = document.querySelector(sels[i]);
      if (el) return el.closest("section,article,.card,details,div") || el.parentElement;
    }
    var nodes = document.querySelectorAll("h2,h3,h4,summary,label,.cdl-head");
    for (var j = 0; j < nodes.length; j++) {
      var t = (nodes[j].textContent || "").toLowerCase();
      if (/letter to heirs|heirs letter|heir letter|letter for heirs/.test(t)) {
        return nodes[j].closest("section,article,.card,details,div") || nodes[j].parentElement;
      }
    }
    return null;
  }

  function ensureSection(parent, id) {
    var sec = document.getElementById(id);
    if (sec) return sec;
    sec = document.createElement("section");
    sec.id = id;
    sec.setAttribute("data-amana-ledger-block", "1");
    sec.style.cssText =
      "margin:1rem 0;padding:1rem 1.05rem;border-radius:16px;border:1px solid rgba(201,168,76,.38);" +
      "background:linear-gradient(155deg,rgba(255,255,255,.05),rgba(8,24,20,.5))";
    sec.innerHTML =
      "<header style='margin-bottom:.65rem'>" +
      "<p style='margin:0;font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;color:#c9a84c;font-weight:800'>Amānah · Ledger</p>" +
      "<h2 style='margin:.2rem 0 .3rem;font-size:1.1rem;color:#e8d5a3'>Notes &amp; Qard ḥasan (Dayn)</h2>" +
      "<p style='margin:0;font-size:.8rem;opacity:.9'>Below letter to heirs when available. On-device only · educational · not a fatwa · not legal or financial advice.</p>" +
      "</header>" +
      "<div id='" + id + "-notes' data-notes-slot='1'></div>" +
      "<div id='" + id + "-dayn' data-dayn-slot='1'></div>" +
      "<div id='" + id + "-io' data-dayn-io='1'></div>";
    if (parent && parent.parentElement) {
      parent.parentElement.insertBefore(sec, parent.nextSibling);
    } else if (parent) {
      parent.appendChild(sec);
    } else {
      (document.querySelector(".amana-vault-interior") || document.body).appendChild(sec);
    }
    return sec;
  }

  function vaultLinkHtml() {
    return (
      '<p style="margin:.55rem 0 0">' +
      '<a href="#vault" data-open-amana-vault="1" style="display:inline-flex;align-items:center;gap:.35rem;padding:.4rem .9rem;border-radius:999px;' +
      "border:1px solid rgba(201,168,76,.45);color:#e0c56a;text-decoration:none;font-size:.82rem;font-weight:700\">" +
      "Open Amānah Vault to verify →</a></p>"
    );
  }

  function mountDayLandingBundle() {
    if (window.ClarityVaultGate && !window.ClarityVaultGate.allowDaynLanding()) return;
    var landing =
      document.getElementById("clarity-day-landing") ||
      document.querySelector("[data-day-landing]");
    if (!landing) return;
    var bundle = document.getElementById("amana-day-landing-ledger");
    if (!bundle) {
      bundle = document.createElement("section");
      bundle.id = "amana-day-landing-ledger";
      bundle.setAttribute("data-amana-ledger-block", "1");
      bundle.style.cssText =
        "margin:1rem 0;padding:1rem;border-radius:16px;border:1px solid rgba(201,168,76,.36);" +
        "background:rgba(8,24,20,.45)";
      bundle.innerHTML =
        "<p style='margin:0;font-size:.7rem;letter-spacing:.07em;text-transform:uppercase;color:#c9a84c;font-weight:800'>Day landing · entry</p>" +
        "<h2 style='margin:.2rem 0 .35rem;font-size:1.05rem;color:#e8d5a3'>Notes &amp; Qard ḥasan</h2>" +
        "<p style='font-size:.8rem;opacity:.9;margin:0 0 .5rem'>Record here · verify full ledger in Amānah Vault. On-device only.</p>" +
        "<div id='clarity-landing-slot-notes'></div>" +
        "<div id='clarity-landing-slot-dayn'></div>" +
        vaultLinkHtml();
      // prefer before long stay
      var anchor = null;
      landing.querySelectorAll("h2,h3,section,.card").forEach(function (el) {
        if (/remember the long stay/i.test(el.textContent || "")) {
          anchor = el.closest("section,article,.card") || el;
        }
      });
      if (anchor && anchor.parentElement) anchor.parentElement.insertBefore(bundle, anchor);
      else landing.appendChild(bundle);
    } else if (!bundle.querySelector("[data-open-amana-vault]")) {
      bundle.insertAdjacentHTML("beforeend", vaultLinkHtml());
    }
    // wire vault link
    bundle.querySelectorAll("[data-open-amana-vault]").forEach(function (a) {
      a.onclick = function (e) {
        if (g.ClarityVault && g.ClarityVault.openDoor) {
          e.preventDefault();
          g.ClarityVault.openDoor();
        } else {
          try {
            location.hash = "vault";
          } catch (err) {}
        }
      };
    });
  }

  function mountVaultBundle() {
    if (window.ClarityVaultGate && !window.ClarityVaultGate.allowDaynVault()) return;
    var heirs = findHeirsLetter();
    var sec = ensureSection(heirs, "amana-vault-ledger-block");
    // also expose classic ids for dayn scripts
    var daynSlot = document.getElementById("amana-vault-ledger-block-dayn");
    if (daynSlot && !document.getElementById("clarity-vault-slot-dayn")) {
      daynSlot.id = daynSlot.id; // keep
      var alias = document.getElementById("clarity-vault-slot-dayn");
      if (!alias) {
        daynSlot.setAttribute("id", "clarity-vault-slot-dayn");
      }
    }
    var slot = document.getElementById("clarity-vault-slot-dayn");
    if (!slot) {
      slot = document.getElementById("amana-vault-ledger-block-dayn");
      if (slot) slot.id = "clarity-vault-slot-dayn";
    }
    // notes: move existing note registry landing mount point reference
    var notesSlot = document.getElementById("amana-vault-ledger-block-notes");
    if (notesSlot && !document.getElementById("amana-note-registry-vault")) {
      notesSlot.id = "amana-note-registry-vault";
    }
    return sec;
  }

  function csvEscape(s) {
    s = String(s == null ? "" : s);
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  }

  function buildCsv(data) {
    var rows = [
      ["type", "id", "direction", "counterparty", "amount", "currency", "due", "note", "lineId", "date", "remaining"].join(","),
    ];
    (data.lines || []).forEach(function (ln) {
      rows.push(
        [
          "line",
          csvEscape(ln.id),
          csvEscape(ln.direction || ln.dir || ""),
          csvEscape(ln.party || ln.counterparty || ""),
          csvEscape(ln.amount),
          csvEscape(ln.currency || ""),
          csvEscape(ln.due || ""),
          csvEscape(ln.note || ""),
          "",
          csvEscape(ln.date || ln.createdAt || ""),
          csvEscape(money(remaining(ln, data))),
        ].join(",")
      );
    });
    (data.repayments || []).forEach(function (r) {
      rows.push(
        [
          "repayment",
          csvEscape(r.id),
          "",
          "",
          csvEscape(r.amount),
          "",
          "",
          csvEscape(r.note || ""),
          csvEscape(r.lineId),
          csvEscape(r.date || r.createdAt || ""),
          "",
        ].join(",")
      );
    });
    return rows.join("\n");
  }

  function downloadBlob(filename, mime, text) {
    var blob = new Blob([text], { type: mime });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(function () {
      try {
        URL.revokeObjectURL(a.href);
      } catch (e) {}
    }, 1500);
  }

  /** SpreadsheetML Excel-compatible XML */
  function buildExcelXml(data) {
    function cell(v) {
      return "<Cell><Data ss:Type=\"String\">" + String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</Data></Cell>";
    }
    var rows = [];
    rows.push(
      "<Row>" +
        ["Type", "Id", "Direction", "Counterparty", "Amount", "Currency", "Due", "Note", "LineId", "Date", "Remaining"]
          .map(cell)
          .join("") +
        "</Row>"
    );
    (data.lines || []).forEach(function (ln) {
      rows.push(
        "<Row>" +
          [
            "line",
            ln.id,
            ln.direction || ln.dir || "",
            ln.party || ln.counterparty || "",
            money(ln.amount),
            ln.currency || "",
            ln.due || "",
            ln.note || "",
            "",
            ln.date || "",
            money(remaining(ln, data)),
          ]
            .map(cell)
            .join("") +
          "</Row>"
      );
    });
    (data.repayments || []).forEach(function (r) {
      rows.push(
        "<Row>" +
          ["repayment", r.id, "", "", money(r.amount), "", "", r.note || "", r.lineId, r.date || "", ""]
            .map(cell)
            .join("") +
          "</Row>"
      );
    });
    return (
      '<?xml version="1.0"?>' +
      '<?mso-application progid="Excel.Sheet"?>' +
      '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' +
      "<Worksheet ss:Name=\"Dayn\"><Table>" +
      rows.join("") +
      "</Table></Worksheet></Workbook>"
    );
  }

  function parseCsv(text) {
    var lines = String(text).replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return null;
    var data = load();
    // simple CSV split
    function split(row) {
      var out = [],
        cur = "",
        q = false;
      for (var i = 0; i < row.length; i++) {
        var c = row[i];
        if (c === '"') {
          if (q && row[i + 1] === '"') {
            cur += '"';
            i++;
          } else q = !q;
        } else if (c === "," && !q) {
          out.push(cur);
          cur = "";
        } else cur += c;
      }
      out.push(cur);
      return out;
    }
    for (var r = 1; r < lines.length; r++) {
      var cols = split(lines[r]);
      var type = (cols[0] || "").toLowerCase();
      if (type === "line") {
        data.lines.push({
          id: cols[1] || "d" + Date.now() + r,
          direction: cols[2] || "owe",
          party: cols[3] || "",
          amount: cols[4] || "0",
          currency: cols[5] || "",
          due: cols[6] || "",
          note: cols[7] || "",
          date: cols[9] || new Date().toISOString().slice(0, 10),
        });
      } else if (type === "repayment") {
        data.repayments.push({
          id: cols[1] || "r" + Date.now() + r,
          amount: cols[4] || "0",
          note: cols[7] || "",
          lineId: cols[8] || "",
          date: cols[9] || new Date().toISOString().slice(0, 10),
        });
      }
    }
    return data;
  }

  function mountIo(host) {
    if (!host || host.querySelector("[data-dayn-io-ui]")) return;
    var box = document.createElement("div");
    box.setAttribute("data-dayn-io-ui", "1");
    box.style.cssText =
      "margin-top:.85rem;padding:.85rem;border-radius:12px;border:1px dashed rgba(201,168,76,.4);background:rgba(0,0,0,.15)";
    box.innerHTML =
      "<p style='margin:0 0 .4rem;font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:#c9a84c;font-weight:800'>Cash-flow export / import</p>" +
      "<p style='font-size:.78rem;opacity:.9;margin:0 0 .5rem'>CSV and Excel-compatible sheet of Qard ḥasan lines &amp; repayments on this device. Educational · not financial advice.</p>" +
      "<div style='display:flex;flex-wrap:wrap;gap:.35rem'>" +
      "<button type='button' data-act='csv' style='padding:.35rem .75rem;border:0;border-radius:999px;background:#1e7d5e;color:#fff;font-weight:700'>Export CSV</button>" +
      "<button type='button' data-act='xls' style='padding:.35rem .75rem;border:0;border-radius:999px;background:#1e7d5e;color:#fff;font-weight:700'>Generate Excel sheet</button>" +
      "<label style='padding:.35rem .75rem;border-radius:999px;border:1px solid rgba(201,168,76,.4);font-size:.8rem;cursor:pointer'>Import CSV<input type='file' accept='.csv,text/csv' hidden data-act='import'/></label>" +
      "</div>" +
      "<p data-io-msg style='font-size:.75rem;margin:.4rem 0 0;opacity:.9'></p>";
    host.appendChild(box);
    var msg = box.querySelector("[data-io-msg]");
    box.querySelector("[data-act='csv']").onclick = function () {
      var data = load();
      downloadBlob("amana-dayn-" + new Date().toISOString().slice(0, 10) + ".csv", "text/csv;charset=utf-8", buildCsv(data));
      msg.textContent = "CSV downloaded.";
    };
    box.querySelector("[data-act='xls']").onclick = function () {
      var data = load();
      downloadBlob(
        "amana-dayn-" + new Date().toISOString().slice(0, 10) + ".xls",
        "application/vnd.ms-excel",
        buildExcelXml(data)
      );
      msg.textContent = "Excel sheet generated (open in Excel / Sheets).";
    };
    box.querySelector("[data-act='import']").onchange = function (ev) {
      var f = ev.target.files && ev.target.files[0];
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function () {
        var parsed = parseCsv(String(reader.result || ""));
        if (!parsed) {
          msg.textContent = "Import failed — check CSV format.";
          return;
        }
        save(parsed);
        msg.textContent = "Imported on this device. Refresh list in the Dayn card.";
        try {
          g.dispatchEvent(new CustomEvent("clarity-dayn-imported"));
        } catch (e) {}
      };
      reader.readAsText(f);
    };
  }

  
  function relocateNotes() {
    var src =
      document.getElementById("amana-note-registry-landing") ||
      document.querySelector("[data-vault-note-registry]");
    var daySlot = document.getElementById("clarity-landing-slot-notes");
    var vaultSlot =
      document.getElementById("amana-note-registry-vault") ||
      document.getElementById("amana-vault-ledger-block-notes");
    if (src && daySlot && !daySlot.contains(src)) {
      // clone entry affordance only if not already in slot
      if (!daySlot.querySelector("#amana-note-registry-landing")) {
        var clone = src.cloneNode(true);
        clone.id = "amana-note-registry-landing-day";
        daySlot.appendChild(clone);
      }
    }
    if (src && vaultSlot && !vaultSlot.contains(src)) {
      try {
        vaultSlot.appendChild(src);
      } catch (e) {}
    }
  }

  function tick() {
    relocateNotes();
    mountDayLandingBundle();
    mountVaultBundle();
    var ioVault = document.getElementById("amana-vault-ledger-block-io");
    if (ioVault) mountIo(ioVault);
    // if dayn scripts left empty slots, IO still on vault block
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tick);
  else tick();
  [600, 1500, 3000, 5000].forEach(function (ms) {
    setTimeout(tick, ms);
  });
  try {
    var obs = new MutationObserver(function () {
      tick();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () {
      try {
        obs.disconnect();
      } catch (e) {}
    }, 25000);
  } catch (e) {}
})(window);
