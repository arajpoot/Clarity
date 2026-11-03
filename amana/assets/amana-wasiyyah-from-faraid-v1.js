/*! Pull Farāʾiḍ study figures into Wasiyyah notes
 * Reads clarity_amana_faraid_push_v1 set by calculator v3
 * Educational only — not a legal will
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_WASI_FROM_FARAID_V1__) return;
  w.__CLARITY_AMANA_WASI_FROM_FARAID_V1__ = true;

  function pull() {
    var raw = null;
    try {
      raw = localStorage.getItem("clarity_amana_faraid_push_v1");
    } catch (e) {}
    if (!raw) {
      alert("No Farāʾiḍ figures found. Run Calculate shares on /amana/fiqh/ first.");
      return;
    }
    var o;
    try {
      o = JSON.parse(raw);
    } catch (e) {
      alert("Could not read Farāʾiḍ push data.");
      return;
    }
    var lines = [
      "Pulled from Farāʾiḍ study calculator (" + (o.at || "") + "):",
      "Gross estate: " + (o.gross || "—") + " " + (o.currency || ""),
      "Funeral: " + (o.funeral || "—"),
      "Debts: " + (o.debts || "—"),
      "Wasiyyah input: " + (o.wasiyyah || "—"),
      "Net distributable (study): " + (o.net || "—"),
      "Educational figures only — not a fatwa."
    ].join("\n");

    // Prefer enrich v2 fields
    var debts = document.getElementById("we-debts");
    var bequests = document.getElementById("we-bequests");
    var other = document.getElementById("we-other");
    if (debts) {
      debts.value = (debts.value ? debts.value + "\n\n" : "") + "Debts (from study): " + (o.debts || "—");
    }
    if (bequests) {
      bequests.value =
        (bequests.value ? bequests.value + "\n\n" : "") +
        "Wasiyyah amount (from study): " +
        (o.wasiyyah || "—") +
        " " +
        (o.currency || "");
    }
    if (other) {
      other.value = (other.value ? other.value + "\n\n" : "") + lines;
    }

    // Also merge into wasiyyah store
    try {
      var STORE = "clarity_amana_wasiyyah_v1";
      var cur = JSON.parse(localStorage.getItem(STORE) || "{}");
      cur.debts = (debts && debts.value) || cur.debts || "";
      cur.bequests = (bequests && bequests.value) || cur.bequests || "";
      cur.other = (other && other.value) || cur.other || "";
      cur.fromFaraid = o;
      cur.ts = Date.now();
      localStorage.setItem(STORE, JSON.stringify(cur));
    } catch (e) {}

    alert("Farāʾiḍ study figures pulled into Wasiyyah notes (educational only).");
  }

  w.wasiPullFromFaraid = pull;

  function injectButton() {
    if (!/\/amana\/wasiyyah\/?/.test(location.pathname || "")) return;
    if (document.getElementById("wasi-pull-faraid-btn")) return;
    var host =
      document.getElementById("wasiyyah-enrich-v2") ||
      document.getElementById("amana-wasiyyah-rich-root") ||
      document.querySelector(".amana-card");
    if (!host) return;
    var bar = document.createElement("div");
    bar.style.cssText = "display:flex;flex-wrap:wrap;gap:0.4rem;margin:0.5rem 0 0.75rem";
    bar.innerHTML =
      '<button type="button" class="btn-soft" id="wasi-pull-faraid-btn">↙ Pull estate from Farāʾiḍ calculator</button>' +
      '<a class="btn-soft" href="/amana/fiqh/" style="text-decoration:none">Open Farāʾiḍ study</a>';
    host.insertBefore(bar, host.firstChild);
    document.getElementById("wasi-pull-faraid-btn").onclick = pull;
  }

  function boot() {
    try {
      injectButton();
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 600);
})(window);
