/*! Dayn section bridge v3 · freeze fix
 * Observer-free · no competing Dayn form UI
 * Only CSV/Excel I/O helpers on chamber export host
 * Storage: clarity_dayn_ledger_v1
 * Educational only — not a fatwa · not legal/financial advice
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_DAYN_SECTION_V3__) return;
  g.__CLARITY_DAYN_SECTION_V3__ = true;
  // Prevent v2 from double-running if both somehow load
  g.__CLARITY_DAYN_SECTION_V2__ = true;

  var STORE = "clarity_dayn_ledger_v1";

  function isDaynChamber() {
    return /\/amana\/dayn\/?/.test(location.pathname || "");
  }

  function isGatePath() {
    var p = (location.pathname || "").replace(/\/+$/, "") || "/";
    return p === "/amana" || p === "/amana/index.html" || /\/amana\/?$/.test(location.pathname);
  }

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

  function money(n) {
    var x = Number(n);
    if (!isFinite(x)) return "0.00";
    return (Math.round(x * 100) / 100).toFixed(2);
  }

  function remaining(line, data) {
    var paid = 0;
    (data.repayments || []).forEach(function (r) {
      if (r.lineId === line.id) paid += Number(r.amount) || 0;
    });
    return Math.max(0, (Number(line.amount) || 0) - paid);
  }

  function download(filename, text, mime) {
    try {
      var blob = new Blob([text], { type: mime || "text/plain;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        try {
          URL.revokeObjectURL(url);
          a.remove();
        } catch (e) {}
      }, 800);
    } catch (e) {}
  }

  function toCsv() {
    var data = load();
    var rows = [
      ["createdAt", "direction", "who", "amount", "currency", "status", "remaining", "due", "note", "qardHasan"].join(",")
    ];
    data.lines.forEach(function (ln) {
      var rem = remaining(ln, data);
      rows.push(
        [
          ln.createdAt || "",
          ln.direction || "",
          '"' + String(ln.who || "").replace(/"/g, '""') + '"',
          money(ln.amount),
          ln.currency || "",
          ln.status || "",
          money(rem),
          ln.due || "",
          '"' + String(ln.note || "").replace(/"/g, '""') + '"',
          ln.qardHasan ? "yes" : "no"
        ].join(",")
      );
    });
    return rows.join("\n");
  }

  function toTsv() {
    var data = load();
    var rows = ["Amānah Dayn · Qard ḥasan only · educational · on-device"];
    rows.push(["createdAt", "direction", "who", "amount", "currency", "status", "remaining", "due", "note"].join("\t"));
    data.lines.forEach(function (ln) {
      rows.push(
        [ln.createdAt || "", ln.direction || "", ln.who || "", money(ln.amount), ln.currency || "", ln.status || "", money(remaining(ln, data)), ln.due || "", ln.note || ""].join("\t")
      );
    });
    return rows.join("\n");
  }

  function mountIo() {
    if (!isDaynChamber()) return;
    var host =
      document.getElementById("clarity-vault-dayn-io") ||
      document.getElementById("amana-vault-ledger-block-io") ||
      document.querySelector("[data-dayn-io]");
    if (!host) return;
    if (host.getAttribute("data-bridge-v3") === "1") return;
    host.setAttribute("data-bridge-v3", "1");
    host.innerHTML =
      '<div style="margin:1rem 0;padding:0.85rem 1rem;border-radius:14px;border:1px solid rgba(212,180,90,0.28);background:rgba(15,76,58,0.12)">' +
      '<p style="margin:0 0 0.45rem;font-size:0.8rem;font-weight:700;color:#d4b45a">CASH-FLOW EXPORT / IMPORT</p>' +
      '<p style="margin:0 0 0.55rem;font-size:0.75rem;opacity:0.85">CSV and Excel-compatible sheet of Qard ḥasan lines on this device. Educational · not financial advice.</p>' +
      '<div style="display:flex;flex-wrap:wrap;gap:0.4rem">' +
      '<button type="button" data-act="csv" style="padding:0.4rem 0.85rem;border-radius:999px;font-weight:800;font-size:0.78rem;cursor:pointer;border:1px solid rgba(212,180,90,0.4);background:rgba(30,125,94,0.55);color:inherit">Export CSV</button>' +
      '<button type="button" data-act="xls" style="padding:0.4rem 0.85rem;border-radius:999px;font-weight:800;font-size:0.78rem;cursor:pointer;border:1px solid rgba(212,180,90,0.4);background:rgba(30,125,94,0.55);color:inherit">Generate Excel sheet</button>' +
      "</div>" +
      '<p style="margin:0.45rem 0 0;font-size:0.72rem;opacity:0.8">On-device only · not a fatwa · not legal advice.</p>' +
      "</div>";

    var csvBtn = host.querySelector("[data-act='csv']");
    var xlsBtn = host.querySelector("[data-act='xls']");
    if (csvBtn) {
      csvBtn.onclick = function () {
        download("amana-dayn-" + new Date().toISOString().slice(0, 10) + ".csv", toCsv(), "text/csv;charset=utf-8");
      };
    }
    if (xlsBtn) {
      xlsBtn.onclick = function () {
        // TSV opens cleanly in Excel
        download("amana-dayn-" + new Date().toISOString().slice(0, 10) + ".xls", toTsv(), "application/vnd.ms-excel;charset=utf-8");
      };
    }
  }

  function tick() {
    if (isGatePath()) return; // never mount on gate
    try {
      mountIo();
    } catch (e) {
      try {
        console.warn("[Dayn bridge v3]", e);
      } catch (err) {}
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tick);
  } else {
    tick();
  }
  // Limited retries only — NO MutationObserver
  setTimeout(tick, 400);
  setTimeout(tick, 1200);

  document.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(tick, 60);
  });
  document.addEventListener("clarity-amana-sealed-ready", function () {
    setTimeout(tick, 40);
  });
})(typeof window !== "undefined" ? window : this);
