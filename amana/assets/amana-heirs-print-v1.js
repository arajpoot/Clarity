/*! amana-heirs-print-v1 */
(function (w) {
  "use strict";
  if (w.__AMANA_HEIRS_PRINT_V1__) return;
  w.__AMANA_HEIRS_PRINT_V1__ = true;

  w.ClarityAmanaPrintHeirs = function () {
    try {
      var KEY = "clarity_amana_heirs_v1";
      var raw = localStorage.getItem(KEY) || "{}";
      var o = {};
      try { o = JSON.parse(raw); } catch (e) {}
      var fields = [
        ["Full name", o["ahr-fullname"] || ""],
        ["Next of kin", o["ahr-kin"] || ""],
        ["Wasī / guardian", o["ahr-wasi"] || ""],
        ["Letter", o["ahr-letter"] || ""],
        ["Debts / trusts", o["ahr-debts"] || ""],
        ["Documents location", o["ahr-docs"] || ""]
      ];
      var html = "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Amānah · Heir readiness</title>";
      html += "<style>body{font-family:Georgia,serif;max-width:40rem;margin:1.5rem auto;padding:1rem;color:#111}";
      html += "h1{font-size:1.35rem}h2{font-size:1rem;margin:1rem 0 0.35rem;color:#333}";
      html += "p,pre{white-space:pre-wrap;line-height:1.45;font-size:0.95rem}";
      html += ".disc{font-size:0.8rem;color:#444;border-left:3px solid #c9a84c;padding:0.4rem 0.6rem;background:#faf6ea}</style></head><body>";
      html += "<h1>Amānah · Heir readiness</h1>";
      html += "<p class='disc'>Educational only — not a fatwa · not a will · not legal advice. Printed from this device. Confirm with a scholar and local counsel.</p>";
      fields.forEach(function (pair) {
        html += "<h2>" + pair[0] + "</h2><pre>" + String(pair[1]).replace(/</g, "&lt;") + "</pre>";
      });
      html += "<p style='margin-top:2rem;font-size:0.75rem;color:#666'>Generated " + new Date().toISOString() + " · Clarity Amānah</p>";
      html += "</body></html>";
      var wdw = w.open("", "_blank", "noopener,noreferrer");
      if (!wdw) {
        alert("Allow pop-ups to print the heir pack.");
        return;
      }
      wdw.document.write(html);
      wdw.document.close();
      try { wdw.focus(); wdw.print(); } catch (e2) {}
    } catch (err) {
      try { console.warn(err); } catch (e3) {}
    }
  };
})(window);
