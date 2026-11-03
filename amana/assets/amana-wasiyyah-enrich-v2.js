/*! Wasiyyah enrich v2 · structured notes + export to Notes
 * Storage: clarity_amana_wasiyyah_v1
 * Notes page key: clarity_amana_notes_page_v1
 * Educational only — not a legal will · not a fatwa
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_WASIYYAH_ENRICH_V2__) return;
  w.__CLARITY_AMANA_WASIYYAH_ENRICH_V2__ = true;

  var STORE = "clarity_amana_wasiyyah_v1";
  var NOTES_KEY = "clarity_amana_notes_page_v1";

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORE) || "{}");
    } catch (e) {
      return {};
    }
  }
  function save(o) {
    o.ts = Date.now();
    try {
      localStorage.setItem(STORE, JSON.stringify(o));
      return true;
    } catch (e) {
      return false;
    }
  }

  function panelHtml(d) {
    d = d || {};
    return (
      '<div class="wasiyyah-enrich-v2" id="wasiyyah-enrich-v2">' +
      '<div class="we-badge">Educational notes · not a legal will · not a fatwa</div>' +
      "<h3>Wasiyyah · structured notes</h3>" +
      '<p class="we-lead">Debts and trusts are settled before bequests. Classical discussion often limits optional wasiyyah to non-heirs and up to one-third of what remains — confirm with a scholar and local counsel.</p>' +
      '<details class="we-tut"><summary>Before you write</summary><ul>' +
      "<li>List debts and trusts you hold for others.</li>" +
      "<li>Funeral wishes that do not contradict Sharīʿah.</li>" +
      "<li>Optional gifts (study limit: ≤ ⅓ of remainder, usually non-heirs).</li>" +
      "<li>Name a provisional executor to discuss with family and counsel.</li>" +
      "</ul></details>" +
      '<label for="we-debts">Debts &amp; trusts to settle first</label>' +
      '<textarea id="we-debts" rows="3" placeholder="What you owe · what you hold for others…">' +
      esc(d.debts || "") +
      "</textarea>" +
      '<label for="we-funeral">Funeral / burial wishes</label>' +
      '<textarea id="we-funeral" rows="2" placeholder="Simple wishes · avoid extravagance…">' +
      esc(d.funeral || "") +
      "</textarea>" +
      '<label for="we-bequests">Optional bequests (wasiyyah notes)</label>' +
      '<textarea id="we-bequests" rows="3" placeholder="Non-heir gifts · charity · verify ≤ ⅓ with a scholar…">' +
      esc(d.bequests || "") +
      "</textarea>" +
      '<label for="we-executor">Provisional executor / contact</label>' +
      '<input id="we-executor" type="text" maxlength="120" value="' +
      escAttr(d.executor || "") +
      '" placeholder="Name · phone" />' +
      '<label for="we-family">Family / heir notes</label>' +
      '<textarea id="we-family" rows="2" placeholder="Point heirs to the family tree &amp; letter…">' +
      esc(d.family || "") +
      "</textarea>" +
      '<label for="we-other">Other notes for counsel</label>' +
      '<textarea id="we-other" rows="2" placeholder="Anything a scholar or solicitor should know…">' +
      esc(d.other || "") +
      "</textarea>" +
      '<div class="we-actions">' +
      '<button type="button" class="btn-soft" id="we-save">Save wasiyyah notes</button>' +
      '<button type="button" class="btn-soft" id="we-to-notes">Export to Notes</button>' +
      '<button type="button" class="btn-soft" id="we-json">Export JSON</button>' +
      '<button type="button" class="btn-soft" id="we-print">Print notes</button>' +
      "</div>" +
      '<p class="we-msg" id="we-msg" role="status"></p>' +
      '<p class="we-disc">Not a court will · not a fatwa · civil probate differs by country. Use a solicitor/notary and a qualified local scholar.</p>' +
      '<p class="we-links"><a href="/amana/notes/">Open Notes</a> · <a href="/amana/dayn/">Dayn ledger</a> · <a href="/amana/tree/">Family tree</a> · <a href="/amana/fiqh/">Farāʾiḍ study</a></p>' +
      "</div>"
    );
  }

  function esc(s) {
    return String(s || "").replace(/</g, "&lt;");
  }
  function escAttr(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  function collect() {
    return {
      debts: (document.getElementById("we-debts") || {}).value || "",
      funeral: (document.getElementById("we-funeral") || {}).value || "",
      bequests: (document.getElementById("we-bequests") || {}).value || "",
      executor: (document.getElementById("we-executor") || {}).value || "",
      family: (document.getElementById("we-family") || {}).value || "",
      other: (document.getElementById("we-other") || {}).value || ""
    };
  }

  function setMsg(t, kind) {
    var el = document.getElementById("we-msg");
    if (!el) return;
    el.textContent = t || "";
    el.className = "we-msg" + (kind ? " " + kind : "");
  }

  function toPlainText(o) {
    return [
      "Amānah · Wasiyyah notes (educational · not a legal will)",
      "Saved: " + new Date().toISOString(),
      "",
      "Debts & trusts to settle first:",
      o.debts || "—",
      "",
      "Funeral / burial wishes:",
      o.funeral || "—",
      "",
      "Optional bequests (wasiyyah):",
      o.bequests || "—",
      "",
      "Provisional executor:",
      o.executor || "—",
      "",
      "Family / heir notes:",
      o.family || "—",
      "",
      "Other notes for counsel:",
      o.other || "—",
      "",
      "Disclaimer: not a fatwa · not a court will · confirm with a scholar and local counsel."
    ].join("\n");
  }

  function bind() {
    var saveBtn = document.getElementById("we-save");
    if (saveBtn) {
      saveBtn.onclick = function () {
        var o = collect();
        if (!save(o)) {
          setMsg("Could not save on this device.", "err");
          return;
        }
        setMsg("Wasiyyah notes saved on this device.", "ok");
      };
    }
    var toNotes = document.getElementById("we-to-notes");
    if (toNotes) {
      toNotes.onclick = function () {
        var o = collect();
        save(o);
        var text = toPlainText(o);
        try {
          var prev = localStorage.getItem(NOTES_KEY) || "";
          var block =
            (prev ? prev.replace(/\s+$/, "") + "\n\n———\n\n" : "") + text;
          localStorage.setItem(NOTES_KEY, block);
          setMsg("Exported to Notes page storage. Open Notes to review.", "ok");
        } catch (e) {
          setMsg("Could not write Notes storage.", "err");
        }
      };
    }
    var jsonBtn = document.getElementById("we-json");
    if (jsonBtn) {
      jsonBtn.onclick = function () {
        var o = collect();
        o.exportedAt = new Date().toISOString();
        o.exportType = "clarity-amana-wasiyyah";
        o.disclaimer = "Educational notes · not a legal will · not a fatwa";
        try {
          var blob = new Blob([JSON.stringify(o, null, 2)], {
            type: "application/json;charset=utf-8"
          });
          var a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "amana-wasiyyah-" + new Date().toISOString().slice(0, 10) + ".json";
          document.body.appendChild(a);
          a.click();
          setTimeout(function () {
            URL.revokeObjectURL(a.href);
            a.remove();
          }, 500);
          setMsg("JSON exported.", "ok");
        } catch (e) {
          setMsg("Export failed.", "err");
        }
      };
    }
    var printBtn = document.getElementById("we-print");
    if (printBtn) {
      printBtn.onclick = function () {
        var o = collect();
        save(o);
        if (typeof w.ClarityAmanaPrintWasiyyah === "function") {
          try {
            w.ClarityAmanaPrintWasiyyah();
            return;
          } catch (e) {}
        }
        var html =
          "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Wasiyyah notes</title>" +
          "<style>body{font-family:Georgia,serif;max-width:40rem;margin:1.5rem auto;padding:1rem;line-height:1.5}" +
          "h1{font-size:1.25rem}.disc{font-size:0.85rem;opacity:0.85}</style></head><body>" +
          "<h1>Amānah · Wasiyyah notes</h1>" +
          "<p class='disc'>Educational only — not a legal will · not a fatwa.</p>" +
          "<pre style='white-space:pre-wrap;font-family:Georgia,serif'>" +
          toPlainText(o).replace(/</g, "&lt;") +
          "</pre></body></html>";
        var win = window.open("", "_blank");
        if (win) {
          win.document.write(html);
          win.document.close();
          try {
            win.print();
          } catch (e) {}
        }
      };
    }
  }

  function mount() {
    if (!/\/amana\/wasiyyah\/?/.test(location.pathname || "")) return;
    var host = document.getElementById("amana-wasiyyah-rich-root");
    var card = host && host.parentElement;
    var d = load();
    // Prefer dedicated enrich root after rich module
    var slot = document.getElementById("amana-wasiyyah-enrich-root");
    if (!slot) {
      slot = document.createElement("div");
      slot.id = "amana-wasiyyah-enrich-root";
      if (host && host.parentNode) host.parentNode.insertBefore(slot, host.nextSibling);
      else if (card) card.appendChild(slot);
      else {
        var main = document.querySelector("main.amana-wrap");
        if (main) main.appendChild(slot);
      }
    }
    if (!document.getElementById("wasiyyah-enrich-v2")) {
      slot.innerHTML = panelHtml(d);
      bind();
    }
  }

  function boot() {
    try {
      mount();
    } catch (e) {
      try {
        console.warn("[Wasiyyah enrich v2]", e);
      } catch (err) {}
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 400);
  setTimeout(boot, 1200);
})(window);
