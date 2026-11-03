/*! amana-export-desk-v2 · no mail-app freeze · CSV/JSON/copy/print */
(function (w) {
  "use strict";
  if (w.__AMANA_EXPORT_DESK_V2__) return;
  w.__AMANA_EXPORT_DESK_V2__ = true;

  function downloadBlob(filename, mime, text) {
    try {
      var blob = new Blob([text], { type: mime || "text/plain;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.rel = "noopener";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        try {
          URL.revokeObjectURL(url);
          a.remove();
        } catch (e) {}
      }, 500);
      return true;
    } catch (e2) {
      return false;
    }
  }

  function clipboard(text) {
    text = String(text || "").slice(0, 20000);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }).catch(function () {
        return legacyCopy(text);
      });
    }
    return Promise.resolve(legacyCopy(text));
  }

  function legacyCopy(text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      var ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch (e) {
      return false;
    }
  }

  function daynSummary() {
    try {
      var q = JSON.parse(localStorage.getItem("clarity_amana_dayn_intake_queue_v1") || "[]");
      if (!Array.isArray(q) || !q.length) return "No dayn intake lines on this device yet.";
      return q
        .map(function (ln, i) {
          return (
            i +
            1 +
            ". " +
            (ln.direction || "") +
            " " +
            (ln.amount || "") +
            " " +
            (ln.currency || "") +
            " · " +
            (ln.party || "") +
            " · " +
            (ln.note || "")
          );
        })
        .join("\n");
    } catch (e) {
      return "No dayn data readable on this device.";
    }
  }

  function daynCsv() {
    var rows = ["direction,amount,currency,party,note,qardHasan,ts"];
    try {
      var q = JSON.parse(localStorage.getItem("clarity_amana_dayn_intake_queue_v1") || "[]");
      if (Array.isArray(q)) {
        q.forEach(function (ln) {
          rows.push(
            [ln.direction, ln.amount, ln.currency, ln.party, ln.note, ln.qardHasan, ln.ts]
              .map(function (c) {
                return '"' + String(c == null ? "" : c).replace(/"/g, '""') + '"';
              })
              .join(",")
          );
        });
      }
    } catch (e) {}
    return rows.join("\n");
  }

  function mount(host) {
    if (!host) return;
    if (host.getAttribute("data-export-desk") === "2") return;
    host.setAttribute("data-export-desk", "2");
    host.innerHTML =
      '<div class="amana-export-desk" style="margin:0.75rem 0;padding:1rem;border-radius:14px;' +
      "border:1px solid rgba(212,180,90,0.35);background:rgba(15,76,58,0.14)\">" +
      '<strong style="color:#e8d5a3">Export desk · this device</strong>' +
      '<p style="font-size:0.8rem;line-height:1.45;opacity:0.92;margin:0.4rem 0">' +
      "Download or copy only — <strong>no email deep-link</strong> (avoids mobile freezes). " +
      "No cloud API. Educational only — not a fatwa.</p>" +
      '<div style="display:flex;flex-wrap:wrap;gap:0.4rem">' +
      '<button type="button" data-ex="csv" class="btn-soft" style="padding:0.4rem 0.85rem;border-radius:999px;' +
      "border:1px solid rgba(212,180,90,0.35);background:rgba(30,125,94,0.45);color:inherit;font-weight:700;cursor:pointer\">Download CSV</button>" +
      '<button type="button" data-ex="json" class="btn-soft" style="padding:0.4rem 0.85rem;border-radius:999px;' +
      "border:1px solid rgba(212,180,90,0.35);background:rgba(0,0,0,0.28);color:inherit;font-weight:700;cursor:pointer\">Download JSON</button>" +
      '<button type="button" data-ex="copy" class="btn-soft" style="padding:0.4rem 0.85rem;border-radius:999px;' +
      "border:1px solid rgba(212,180,90,0.35);background:rgba(0,0,0,0.28);color:inherit;font-weight:700;cursor:pointer\">Copy for email</button>" +
      '<button type="button" data-ex="print" class="btn-soft" style="padding:0.4rem 0.85rem;border-radius:999px;' +
      "border:1px solid rgba(212,180,90,0.35);background:rgba(0,0,0,0.28);color:inherit;font-weight:700;cursor:pointer\">Print</button>" +
      "</div>" +
      '<p data-ex-msg style="font-size:0.75rem;opacity:0.9;margin:0.5rem 0 0"></p></div>';

    function msg(t) {
      var el = host.querySelector("[data-ex-msg]");
      if (el) el.textContent = t || "";
    }

    host.querySelector('[data-ex="csv"]').onclick = function () {
      var ok = downloadBlob(
        "amana-dayn-" + new Date().toISOString().slice(0, 10) + ".csv",
        "text/csv;charset=utf-8",
        daynCsv()
      );
      msg(ok ? "CSV downloaded · attach it in your mail app if needed." : "Download blocked — try Copy.");
    };
    host.querySelector('[data-ex="json"]').onclick = function () {
      var raw = localStorage.getItem("clarity_amana_dayn_intake_queue_v1") || "[]";
      var ok = downloadBlob(
        "amana-dayn-" + new Date().toISOString().slice(0, 10) + ".json",
        "application/json",
        raw
      );
      msg(ok ? "JSON downloaded." : "Download blocked — try Copy.");
    };
    host.querySelector('[data-ex="copy"]').onclick = function () {
      var text =
        "Clarity Amānah · Dayn notes (this device)\nEducational only — not a fatwa.\n\n" + daynSummary();
      clipboard(text).then(function (ok) {
        msg(
          ok
            ? "Copied. Paste into email yourself — page stays responsive."
            : "Copy failed. Use Download CSV instead."
        );
      });
    };
    host.querySelector('[data-ex="print"]').onclick = function () {
      try {
        w.print();
      } catch (e) {}
    };
  }

  w.ClarityAmanaExportDesk = {
    mount: mount,
    downloadBlob: downloadBlob,
    clipboard: clipboard
  };

  function auto() {
    var host =
      document.getElementById("clarity-vault-dayn-io") ||
      document.getElementById("amana-export-desk-host");
    if (host) mount(host);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", auto);
  else auto();
  document.addEventListener("clarity-amana-sealed-ready", function () {
    setTimeout(auto, 100);
  });
})(window);
