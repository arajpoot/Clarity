/*! amana-wasiyyah-rich-v1 · educational — not a legal will */
(function (w) {
  "use strict";
  if (w.__AMANA_WASIYYAH_RICH_V1__) return;
  w.__AMANA_WASIYYAH_RICH_V1__ = true;
  var STORE = "clarity_amana_wasiyyah_v1";

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE) || "{}"); } catch (e) { return {}; }
  }
  function save(o) {
    o.ts = Date.now();
    try { localStorage.setItem(STORE, JSON.stringify(o)); } catch (e) {}
  }

  w.ClarityAmanaPrintWasiyyah = function () {
    var o = load();
    var html = "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Amānah · Wasiyyah notes</title>";
    html += "<style>body{font-family:Georgia,serif;max-width:40rem;margin:1.5rem auto;padding:1rem}h1{font-size:1.3rem}";
    html += ".disc{font-size:0.8rem;border-left:3px solid #c9a84c;padding:0.4rem 0.6rem;background:#faf6ea;color:#333}";
    html += "h2{font-size:1rem;margin:1rem 0 0.3rem}pre{white-space:pre-wrap}</style></head><body>";
    html += "<h1>Wasiyyah notes (educational)</h1>";
    html += "<p class='disc'>Not a fatwa · not a legal will · not a court document. Printed from this device. Review with a scholar and local counsel.</p>";
    [["Testator name", o.name],["Date intent", o.date],["Bequests (optional third)", o.bequests],
     ["Wasī / executor", o.wasi],["Guardian of minors", o.guardian],["Debts reminder", o.debts],
     ["Witnesses", o.witness],["Additional notes", o.body]].forEach(function (pair) {
      html += "<h2>" + pair[0] + "</h2><pre>" + String(pair[1] || "").replace(/</g, "&lt;") + "</pre>";
    });
    html += "<p style='font-size:0.75rem;color:#666'>Generated " + new Date().toISOString() + "</p></body></html>";
    var wdw = w.open("", "_blank", "noopener,noreferrer");
    if (!wdw) { alert("Allow pop-ups to print."); return; }
    wdw.document.write(html);
    wdw.document.close();
    try { wdw.focus(); wdw.print(); } catch (e) {}
  };

  function boot() {
    var root = document.getElementById("amana-wasiyyah-rich-root");
    if (!root) return;
    var o = load();
    root.innerHTML =
      '<p class="disc"><strong>Bequests are studied within classical limits (often discussed as up to one-third)</strong> after debts and fixed heirs. This form is for preparation only.</p>' +
      '<label>Your name</label><input id="wasi-name" type="text"/>' +
      '<label>Date of these notes</label><input id="wasi-date" type="date"/>' +
      '<label>Bequests from the optional third</label><textarea id="wasi-bequests" rows="4" placeholder="Gifts, causes, freeable portion…"></textarea>' +
      '<label>Wasī / executor</label><input id="wasi-wasi" type="text"/>' +
      '<label>Guardian of minors</label><input id="wasi-guardian" type="text"/>' +
      '<label>Debts to settle first (reminder)</label><textarea id="wasi-debts" rows="2"></textarea>' +
      '<label>Witnesses (notes)</label><input id="wasi-witness" type="text"/>' +
      '<label>Additional notes / letter fragment</label><textarea id="wasi-body" rows="5"></textarea>' +
      '<button type="button" class="btn-soft" id="wasi-save-rich">Save on this device</button> ' +
      '<button type="button" class="btn-soft" id="wasi-print-rich">Print wasiyyah notes</button> ' +
      '<span id="wasi-msg-rich" style="font-size:0.78rem;opacity:0.85"></span>';

    var map = {
      "wasi-name": "name", "wasi-date": "date", "wasi-bequests": "bequests",
      "wasi-wasi": "wasi", "wasi-guardian": "guardian", "wasi-debts": "debts",
      "wasi-witness": "witness", "wasi-body": "body"
    };
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el && o[map[id]] != null) el.value = o[map[id]];
    });
    document.getElementById("wasi-save-rich").onclick = function () {
      var data = {};
      Object.keys(map).forEach(function (id) {
        var el = document.getElementById(id);
        if (el) data[map[id]] = el.value;
      });
      save(data);
      document.getElementById("wasi-msg-rich").textContent = "Saved · " + new Date().toLocaleString();
    };
    document.getElementById("wasi-print-rich").onclick = function () {
      // persist then print
      document.getElementById("wasi-save-rich").click();
      w.ClarityAmanaPrintWasiyyah();
    };
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window);
