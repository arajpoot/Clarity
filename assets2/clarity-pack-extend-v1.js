/**
 * Extend Legacy + Amana print packs: today's deed · path day · wasiyyah one-pager
 * Uses existing buttons. Intention aid only. Not a court document. Not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_PACK_EXTEND_V1__) return;
  g.__CLARITY_PACK_EXTEND_V1__ = true;

  function todayDeed() {
    try {
      var i = localStorage.getItem("istighfar-count") || localStorage.getItem("clarity_istighfar_count");
      var s = localStorage.getItem("salawat-count") || localStorage.getItem("clarity_salawat_count");
      return "Istighfar count (device): " + (i || "0") + " · Salawat count (device): " + (s || "0");
    } catch (e) {
      return "Deed counts on this device.";
    }
  }

  function pathDay() {
    try {
      var p =
        localStorage.getItem("clarity_committed_path") ||
        localStorage.getItem("clarity_path_focus") ||
        "seeker";
      var c = null;
      try {
        c = JSON.parse(localStorage.getItem("clarity_continue_v1") || "null");
      } catch (e2) {}
      return (
        "Path: " +
        p +
        (c && c.action ? " · last action: " + c.action : "") +
        "\nSummary: Continue sequential learning with sincerity. Action: one small good today + review rights."
      );
    } catch (e) {
      return "Path day: seeker · one small good today.";
    }
  }

  function wasiyyahOnePager() {
    try {
      var pt = JSON.parse(localStorage.getItem("clarity_amana_prepare_tonight_v1") || "null") || {};
      return [
        "Will / wasiyyah one-pager (intention aid — not a court document)",
        "Debts & trusts: " + (pt.debtsTrusts || "—"),
        "Provisional executor: " + (pt.executor || "—"),
        "Ongoing good: " + (pt.goodIdea || "—"),
        "Duʿāʾ for deceased: " + (pt.duaDeceased || "—"),
        "Funeral contact: " + (pt.funeralContact || "—"),
        "",
        "Confirm with a qualified scholar and local counsel. Not a fatwa."
      ].join("\n");
    } catch (e) {
      return "Wasiyyah one-pager: fill Prepare tonight in Amana vault login. Not a court document. Not a fatwa.";
    }
  }

  function buildHtml() {
    return (
      "<!DOCTYPE html><html><head><meta charset=utf-8><title>Clarity Legacy Pack</title>" +
      "<style>body{font-family:system-ui,sans-serif;max-width:42rem;margin:1.25rem auto;padding:0 1rem;line-height:1.45}" +
      "h1{font-size:1.2rem}h2{font-size:1rem;margin-top:1.25rem}pre{white-space:pre-wrap;background:#f6f5f0;padding:.85rem;border-radius:8px;font-size:.88rem}" +
      ".d{font-size:.8rem;color:#444;margin-top:1.25rem}</style></head><body>" +
      "<h1>Clarity · Legacy pack</h1>" +
      "<h2>Today's deed (device)</h2><pre>" +
      todayDeed().replace(/</g, "&lt;") +
      "</pre><h2>Current path day</h2><pre>" +
      pathDay().replace(/</g, "&lt;") +
      "</pre><h2>Will / wasiyyah one-pager</h2><pre>" +
      wasiyyahOnePager().replace(/</g, "&lt;") +
      "</pre><p class='d'>Intention aid only. Not a court document. Not a fatwa. Local-only on this device.</p>" +
      "</body></html>"
    );
  }

  function openPack() {
    try {
      var w = window.open("", "_blank", "noopener,noreferrer");
      if (w) {
        w.document.write(buildHtml());
        w.document.close();
        setTimeout(function () {
          try {
            w.print();
          } catch (e) {}
        }, 300);
      }
    } catch (e2) {
      window.print();
    }
  }

  function wrap(name) {
    var prev = g[name];
    g[name] = function () {
      openPack();
      if (typeof prev === "function") {
        try {
          /* still call original if different behavior needed — optional */
        } catch (e) {}
      }
    };
  }

  wrap("clarityPrintLegacyPack");
  wrap("clarityPrintLegacy");
  /* Amana pack: keep unlock requirement by calling original first if present */
  var prevA = g.clarityAmanaPrintPack;
  g.clarityAmanaPrintPack = function () {
    try {
      if (g.AmanaVault && typeof g.AmanaVault.isOpen === "function" && !g.AmanaVault.isOpen()) {
        alert("Unlock Amana Vault first to print the vault pack (existing rule). You can still use Legacy pack for the educational one-pager.");
        if (typeof prevA === "function") return prevA.apply(this, arguments);
        return;
      }
    } catch (e) {}
    openPack();
    if (typeof prevA === "function") {
      try {
        prevA.apply(this, arguments);
      } catch (e2) {}
    }
  };

  g.ClarityPackExtend = { open: openPack, buildHtml: buildHtml };
})(typeof window !== "undefined" ? window : this);
