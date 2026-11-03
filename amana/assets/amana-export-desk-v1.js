/*! amana-export-desk-v3 · M5 · zero work until click · no mailto */
(function (w) {
  "use strict";
  if (w.__AMANA_EXPORT_DESK_V3__) return;
  w.__AMANA_EXPORT_DESK_V3__ = true;

  function downloadBlob(filename, mime, text) {
    try {
      var blob = new Blob([text], { type: mime || "text/plain;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        try { URL.revokeObjectURL(url); a.remove(); } catch (e) {}
      }, 400);
      return true;
    } catch (e2) {
      return false;
    }
  }

  function clipboard(text) {
    text = String(text || "").slice(0, 15000);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }).catch(function () {
        return false;
      });
    }
    return Promise.resolve(false);
  }

  function queueRaw() {
    try {
      return localStorage.getItem("clarity_amana_dayn_intake_queue_v1") || "[]";
    } catch (e) {
      return "[]";
    }
  }

  function mount(host) {
    if (!host || host.getAttribute("data-export-v3")) return;
    host.setAttribute("data-export-v3", "1");
    host.innerHTML =
      '<div style="margin:0.5rem 0;padding:0.85rem;border-radius:14px;border:1px solid rgba(212,180,90,0.3);background:rgba(15,76,58,0.12)">' +
      '<strong style="color:#e8d5a3">Export desk</strong>' +
      '<p style="font-size:0.78rem;opacity:0.9;margin:0.35rem 0">Download or copy only — no email link. No cloud API.</p>' +
      '<div style="display:flex;flex-wrap:wrap;gap:0.35rem">' +
      '<button type="button" data-ex="csv" style="padding:0.4rem 0.8rem;border-radius:999px;border:1px solid rgba(212,180,90,0.35);background:rgba(30,125,94,0.45);color:inherit;font-weight:700;cursor:pointer">CSV</button>' +
      '<button type="button" data-ex="json" style="padding:0.4rem 0.8rem;border-radius:999px;border:1px solid rgba(212,180,90,0.35);background:rgba(0,0,0,0.28);color:inherit;font-weight:700;cursor:pointer">JSON</button>' +
      '<button type="button" data-ex="copy" style="padding:0.4rem 0.8rem;border-radius:999px;border:1px solid rgba(212,180,90,0.35);background:rgba(0,0,0,0.28);color:inherit;font-weight:700;cursor:pointer">Copy</button>' +
      '<button type="button" data-ex="print" style="padding:0.4rem 0.8rem;border-radius:999px;border:1px solid rgba(212,180,90,0.35);background:rgba(0,0,0,0.28);color:inherit;font-weight:700;cursor:pointer">Print</button>' +
      '</div><p data-ex-msg style="font-size:0.72rem;margin:0.4rem 0 0;opacity:0.85"></p></div>';

    function msg(t) {
      var el = host.querySelector("[data-ex-msg]");
      if (el) el.textContent = t || "";
    }
    host.querySelector('[data-ex="csv"]').onclick = function () {
      downloadBlob("amana-dayn.csv", "text/csv;charset=utf-8", queueRaw());
      msg("CSV saved on device.");
    };
    host.querySelector('[data-ex="json"]').onclick = function () {
      downloadBlob("amana-dayn.json", "application/json", queueRaw());
      msg("JSON saved on device.");
    };
    host.querySelector('[data-ex="copy"]').onclick = function () {
      clipboard(queueRaw()).then(function (ok) {
        msg(ok ? "Copied." : "Copy unavailable — use CSV.");
      });
    };
    host.querySelector('[data-ex="print"]').onclick = function () {
      try { w.print(); } catch (e) {}
    };
  }

  function auto() {
    var host = document.getElementById("clarity-vault-dayn-io");
    if (host) mount(host);
  }
  /* idle mount — never block first paint */
  if (document.readyState === "complete") setTimeout(auto, 0);
  else w.addEventListener("load", function () { setTimeout(auto, 0); });
})(window);
