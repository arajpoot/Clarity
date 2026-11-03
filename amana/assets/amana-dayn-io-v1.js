/*! amana-dayn-io-v1 · CSV already in bridge · email via mailto · no cloud API */
(function (w) {
  "use strict";
  if (w.__AMANA_DAYN_IO_V1__) return;
  w.__AMANA_DAYN_IO_V1__ = true;

  function $(id) { return document.getElementById(id); }

  /** Build plain-text summary for mailto (size-limited) */
  w.ClarityDaynEmailDraft = function (summaryText) {
    var subject = encodeURIComponent("Dayn / Qard ḥasan notes (on-device export)");
    var body = encodeURIComponent(
      (summaryText || "Attached notes were exported from Clarity Amānah on this device.\nEducational only — not a fatwa or legal document.\n")
        .slice(0, 1800)
    );
    var a = document.createElement("a");
    a.href = "mailto:?subject=" + subject + "&body=" + body;
    a.rel = "noopener";
    a.click();
  };

  function mountIoBar() {
    var host =
      $("clarity-vault-dayn-io") ||
      $("clarity-landing-slot-dayn") ||
      $("clarity-vault-slot-dayn");
    if (!host || host.querySelector("[data-dayn-io-bar]")) return;

    var bar = document.createElement("div");
    bar.setAttribute("data-dayn-io-bar", "1");
    bar.style.cssText =
      "margin:0.75rem 0;padding:0.85rem;border-radius:14px;border:1px solid rgba(212,180,90,0.3);background:rgba(15,76,58,0.12);font-size:0.82rem;line-height:1.45";
    bar.innerHTML =
      "<strong style='color:#e8d5a3'>Dayn I/O · this device</strong>" +
      "<p style='margin:0.35rem 0;opacity:0.9'>Export stays local. <strong>No Clarity cloud API</strong> uploads debts. Email opens your mail app with a short draft only (mailto). CSV/Excel-compatible export is provided by the Dayn bridge when the chamber is open.</p>" +
      "<div style='display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:0.5rem'>" +
      "<button type='button' data-io='email' class='btn-soft' style='padding:0.4rem 0.85rem;border-radius:999px;border:1px solid rgba(212,180,90,0.35);background:rgba(30,125,94,0.4);color:inherit;font-weight:700;cursor:pointer'>Email draft</button>" +
      "<button type='button' data-io='print' class='btn-soft' style='padding:0.4rem 0.85rem;border-radius:999px;border:1px solid rgba(212,180,90,0.35);background:rgba(0,0,0,0.25);color:inherit;font-weight:700;cursor:pointer'>Print page</button>" +
      "<span style='font-size:0.72rem;opacity:0.8;align-self:center'>API: none (by design)</span>" +
      "</div>";
    host.appendChild(bar);

    bar.querySelector("[data-io='email']").onclick = function () {
      var text =
        "Clarity Amānah · Dayn notes\n" +
        "Exported from this device only.\n" +
        "Educational — not a fatwa / not legal advice.\n" +
        "Use CSV export in the ledger for full lines, then attach manually if needed.\n";
      w.ClarityDaynEmailDraft(text);
    };
    bar.querySelector("[data-io='print']").onclick = function () {
      try { w.print(); } catch (e) {}
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountIoBar);
  else mountIoBar();
  document.addEventListener("clarity-amana-sealed-ready", mountIoBar);
})(window);
