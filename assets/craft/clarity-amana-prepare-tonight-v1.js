/**
 * Clarity Amana — Prepare tonight (Phase 1)
 * Checklist on vault login; entries feed vault worksheet notes.
 * Intention aid only. Not a court document. Not a fatwa.
 * University /campus/ untouched.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_PREPARE_TONIGHT_V1__) return;
  g.__CLARITY_PREPARE_TONIGHT_V1__ = true;

  var KEY = "clarity_amana_prepare_tonight_v1";
  var STAGING_KEY = "clarity_amana_staging_notes_v1";
  var DISCLAIMER =
    "Intention aid only. Not a court document. Not a fatwa.";

  function $(id) {
    return document.getElementById(id);
  }

  function read() {
    try {
      var o = JSON.parse(localStorage.getItem(KEY) || "null");
      return o && typeof o === "object" ? o : empty();
    } catch (e) {
      return empty();
    }
  }

  function empty() {
    return {
      debtsTrusts: "",
      executor: "",
      goodIdea: "",
      duaDeceased: "",
      funeralContact: "",
      updated: null
    };
  }

  function write(data) {
    data.updated = new Date().toISOString();
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {}
    return data;
  }

  function collect() {
    return {
      debtsTrusts: (($("pt-debts") || {}).value || "").trim(),
      executor: (($("pt-executor") || {}).value || "").trim(),
      goodIdea: (($("pt-good") || {}).value || "").trim(),
      duaDeceased: (($("pt-dua") || {}).value || "").trim(),
      funeralContact: (($("pt-funeral") || {}).value || "").trim(),
      updated: null
    };
  }

  function fillForm(data) {
    data = data || read();
    if ($("pt-debts")) $("pt-debts").value = data.debtsTrusts || "";
    if ($("pt-executor")) $("pt-executor").value = data.executor || "";
    if ($("pt-good")) $("pt-good").value = data.goodIdea || "";
    if ($("pt-dua")) $("pt-dua").value = data.duaDeceased || "";
    if ($("pt-funeral")) $("pt-funeral").value = data.funeralContact || "";
  }

  function noteBody(data) {
    var lines = [
      "Prepare tonight checklist",
      DISCLAIMER,
      "",
      "• Debts and trusts noted: " + (data.debtsTrusts || "—"),
      "• Provisional executor named: " + (data.executor || "—"),
      "• One ongoing good idea: " + (data.goodIdea || "—"),
      "• One duʿāʾ for a deceased relative: " + (data.duaDeceased || "—"),
      "• Funeral contact: " + (data.funeralContact || "—"),
      "",
      "Saved: " + (data.updated || new Date().toISOString())
    ];
    return lines.join("\n");
  }

  function pushStagingNote(data) {
    var body = noteBody(data);
    var list = [];
    try {
      list = JSON.parse(localStorage.getItem(STAGING_KEY) || "[]");
      if (!Array.isArray(list)) list = [];
    } catch (e) {
      list = [];
    }
    /* replace prior prepare-tonight staging entry */
    list = list.filter(function (n) {
      return !(n && (n.source === "prepare-tonight" || (n.title || "").indexOf("Prepare tonight") === 0));
    });
    list.unshift({
      id: "pt-" + Date.now().toString(36),
      title: "Prepare tonight",
      body: body,
      created: new Date().toISOString(),
      source: "prepare-tonight"
    });
    try {
      localStorage.setItem(STAGING_KEY, JSON.stringify(list.slice(0, 40)));
    } catch (e2) {}
  }

  function pushInsideWorksheet(data) {
    try {
      if (typeof g.clarityAmanaAddWorksheetNote === "function") {
        g.clarityAmanaAddWorksheetNote({
          title: "Prepare tonight",
          body: noteBody(data),
          source: "prepare-tonight"
        });
        return true;
      }
    } catch (e) {}
    /* fallback: sheet key used by worksheet */
    try {
      var SHEET = "clarity_amana_worksheet_v1";
      var sheet = JSON.parse(localStorage.getItem(SHEET) || "[]");
      if (!Array.isArray(sheet)) sheet = [];
      sheet = sheet.filter(function (n) {
        return !(n && n.source === "prepare-tonight");
      });
      sheet.unshift({
        id: "pt-" + Date.now().toString(36),
        title: "Prepare tonight",
        body: noteBody(data),
        created: new Date().toISOString(),
        imported: null,
        source: "prepare-tonight"
      });
      localStorage.setItem(SHEET, JSON.stringify(sheet));
      if (typeof g.clarityAmanaRenderWorksheet === "function") g.clarityAmanaRenderWorksheet();
      return true;
    } catch (e2) {
      return false;
    }
  }

  function vaultOpen() {
    try {
      if (g.AmanaVault && typeof g.AmanaVault.isOpen === "function") return !!g.AmanaVault.isOpen();
    } catch (e) {}
    return false;
  }

  function save() {
    var data = write(collect());
    pushStagingNote(data);
    if (vaultOpen()) pushInsideWorksheet(data);
    var st = $("pt-status");
    if (st) {
      st.textContent = vaultOpen()
        ? "Saved · in vault worksheet notes (and staging)."
        : "Saved on device · will appear in vault notes when you unlock.";
    }
    return data;
  }

  function printChecklist() {
    var data = save();
    var html =
      "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Prepare tonight</title>" +
      "<style>body{font-family:system-ui,sans-serif;max-width:40rem;margin:1.5rem auto;padding:0 1rem;line-height:1.5}" +
      "h1{font-size:1.25rem}pre{white-space:pre-wrap;background:#f4f4f0;padding:1rem;border-radius:8px}" +
      ".d{font-size:.85rem;color:#444;margin-top:1rem}</style></head><body>" +
      "<h1>Prepare tonight</h1><pre>" +
      noteBody(data).replace(/</g, "&lt;") +
      "</pre><p class='d'>" +
      DISCLAIMER +
      "</p></body></html>";
    try {
      var w = window.open("", "_blank", "noopener,noreferrer");
      if (w) {
        w.document.write(html);
        w.document.close();
        setTimeout(function () {
          try {
            w.print();
          } catch (e) {}
        }, 250);
      }
    } catch (e2) {
      window.print();
    }
  }

  /** Companion path → vault login only (no contents) */
  function openVaultLoginOnly() {
    try {
      if (typeof g.clarityOpenSectionDoor === "function") g.clarityOpenSectionDoor("notes");
      else if (typeof g.switchTab === "function") g.switchTab("notes");
    } catch (e) {}
    setTimeout(function () {
      var gate = $("amana-vault-gate");
      if (gate) {
        try {
          gate.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (e2) {
          gate.scrollIntoView(true);
        }
        var pt = $("amana-prepare-tonight");
        if (pt) {
          try {
            pt.open = true;
          } catch (e3) {}
        }
      }
    }, 200);
  }

  function bind() {
    fillForm(read());
    var bs = $("pt-save");
    var bp = $("pt-print");
    if (bs) bs.onclick = function () { save(); };
    if (bp) bp.onclick = function () { printChecklist(); };
    document.querySelectorAll("[data-open-vault-login]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        openVaultLoginOnly();
      });
    });
    /* after unlock, worksheet importStaging already runs; ensure our staging entry exists */
    g.addEventListener("clarity-amana-unlocked", function () {
      var data = read();
      if (data.debtsTrusts || data.executor || data.goodIdea || data.duaDeceased || data.funeralContact) {
        pushStagingNote(data);
        pushInsideWorksheet(data);
      }
    });
  }

  g.ClarityPrepareTonight = {
    save: save,
    read: read,
    print: printChecklist,
    openVaultLoginOnly: openVaultLoginOnly,
    disclaimer: DISCLAIMER
  };
  g.clarityOpenVaultLoginOnly = openVaultLoginOnly;

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();
})(typeof window !== "undefined" ? window : this);
