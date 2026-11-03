/*! amana-export-desk-v1 · safe CSV/JSON/clipboard · no blocking mailto */
(function (w) {
  "use strict";
  if (w.__AMANA_EXPORT_DESK_V1__) return;
  w.__AMANA_EXPORT_DESK_V1__ = true;

  function downloadBlob(filename, mime, text) {
    try {
      var blob = new Blob([text], { type: mime || "text/plain;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        try { URL.revokeObjectURL(url); a.remove(); } catch (e) {}
      }, 800);
    } catch (e2) {
      try { console.warn("[Amānah export]", e2); } catch (e3) {}
    }
  }

  function clipboard(text) {
    text = String(text || "").slice(0, 50000);
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
      ta.style.cssText = "position:fixed;left:-9999px;top:0";
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch (e) {
      return false;
    }
  }

  /** Safe email: short mailto only (avoid freeze from huge URI) */
  function emailShort(subject, body) {
    var s = encodeURIComponent(String(subject || "Amānah export").slice(0, 80));
    var b = encodeURIComponent(String(body || "").slice(0, 400));
    /* open in same tick without huge string */
    var href = "mailto:?subject=" + s + "&body=" + b;
    var a = document.createElement("a");
    a.href = href;
    a.style.display = "none";
    document.body.appendChild(a);
    try { a.click(); } catch (e) {
      try { w.location.href = href; } catch (e2) {}
    }
    setTimeout(function () { try { a.remove(); } catch (e3) {} }, 0);
  }

  function daynSummary() {
    try {
      var q = JSON.parse(localStorage.getItem("clarity_amana_dayn_intake_queue_v1") || "[]");
      if (!Array.isArray(q) || !q.length) return "No dayn intake lines on this device yet.\n";
      return q.map(function (ln, i) {
        return (i + 1) + ". " + (ln.direction || "") + " " + (ln.amount || "") + " " + (ln.currency || "") + " · " + (ln.party || "") + " · " + (ln.note || "");
      }).join("\n");
    } catch (e) {
      return "";
    }
  }

  function mount(host) {
    if (!host || host.getAttribute("data-export-desk")) return;
    host.setAttribute("data-export-desk", "1");
    host.innerHTML =
      '<div class="amana-export-desk" style="margin:0.75rem 0;padding:1rem;border-radius:14px;border:1px solid rgba(212,180,90,0.35);background:rgba(15,76,58,0.14)">' +
      '<strong style="color:#e8d5a3">Export desk · this device</strong>' +
      '<p style="font-size:0.8rem;line-height:1.45;opacity:0.92;margin:0.4rem 0">CSV / JSON download preferred. <strong>Email</strong> only opens a short mail draft (mailto) so the page does not freeze. <strong>No cloud API</strong> — debts and trees never upload to Clarity servers.</p>' +
      '<div style="display:flex;flex-wrap:wrap;gap:0.4rem">' +
      '<button type="button" data-ex="csv" class="btn-soft">Download CSV summary</button>' +
      '<button type="button" data-ex="json" class="btn-soft">Download JSON queue</button>' +
      '<button type="button" data-ex="copy" class="btn-soft">Copy summary</button>' +
      '<button type="button" data-ex="email" class="btn-soft">Short email draft</button>' +
      '<button type="button" data-ex="print" class="btn-soft">Print</button>' +
      '</div>' +
      '<p data-ex-msg style="font-size:0.75rem;opacity:0.85;margin:0.5rem 0 0"></p>' +
      '</div>';

    function msg(t) {
      var el = host.querySelector("[data-ex-msg]");
      if (el) el.textContent = t || "";
    }

    host.querySelector('[data-ex="csv"]').onclick = function () {
      var text = "direction,amount,currency,party,note,ts\n" + daynSummary().split("\n").filter(Boolean).map(function (line) {
        return '"' + line.replace(/"/g, '""') + '"';
      }).join("\n");
      downloadBlob("amana-dayn-summary-" + new Date().toISOString().slice(0, 10) + ".csv", "text/csv;charset=utf-8", text);
      msg("CSV downloaded · educational only.");
    };
    host.querySelector('[data-ex="json"]').onclick = function () {
      var raw = localStorage.getItem("clarity_amana_dayn_intake_queue_v1") || "[]";
      downloadBlob("amana-dayn-queue-" + new Date().toISOString().slice(0, 10) + ".json", "application/json", raw);
      msg("JSON downloaded.");
    };
    host.querySelector('[data-ex="copy"]').onclick = function () {
      clipboard(daynSummary() || "No lines.").then(function (ok) {
        msg(ok ? "Copied to clipboard." : "Copy failed — use Download instead.");
      });
    };
    host.querySelector('[data-ex="email"]').onclick = function () {
      /* short only — full data via CSV attachment by user */
      emailShort(
        "Amānah Dayn notes",
        "I exported Dayn notes from Clarity Amānah on my device.\nEducational only — not a fatwa.\nPlease see the CSV file I will attach separately.\n"
      );
      msg("Short mail draft opened · attach CSV yourself for full data.");
    };
    host.querySelector('[data-ex="print"]').onclick = function () {
      try { w.print(); } catch (e) {}
    };
  }

  w.ClarityAmanaExportDesk = { mount: mount, downloadBlob: downloadBlob, clipboard: clipboard, emailShort: emailShort };

  function auto() {
    var host = document.getElementById("clarity-vault-dayn-io") || document.getElementById("amana-export-desk-host");
    if (host) mount(host);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", auto);
  else auto();
})(window);
