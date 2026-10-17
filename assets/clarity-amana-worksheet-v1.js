/**
 * Amana Quick Note → Worksheet
 * Phase 1: staging on lock screen (plaintext local only)
 * Phase 2: import into vault-side worksheet on unlock (timestamps)
 * Phase 3: dropdown list UI + optional pin to heir letter
 * Staging is NOT the vault — cleared/marked after import.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_AMANA_WORKSHEET_V1__) return;
  g.__CLARITY_AMANA_WORKSHEET_V1__ = true;

  var STAGING_KEY = "clarity_amana_staging_notes_v1";
  var SHEET_KEY = "clarity_amana_worksheet_v1"; /* mirror; vault payload is source of truth when open */

  function $(id) {
    try {
      return document.getElementById(id);
    } catch (e) {
      return null;
    }
  }

  function uid() {
    return "n" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function readStaging() {
    try {
      var a = JSON.parse(localStorage.getItem(STAGING_KEY) || "[]");
      return Array.isArray(a) ? a : [];
    } catch (e) {
      return [];
    }
  }

  function writeStaging(arr) {
    try {
      localStorage.setItem(STAGING_KEY, JSON.stringify(arr.slice(-100)));
    } catch (e) {}
  }

  function readSheetLocal() {
    try {
      var a = JSON.parse(localStorage.getItem(SHEET_KEY) || "[]");
      return Array.isArray(a) ? a : [];
    } catch (e) {
      return [];
    }
  }

  function writeSheetLocal(arr) {
    try {
      localStorage.setItem(SHEET_KEY, JSON.stringify(arr.slice(-200)));
    } catch (e) {}
  }

  function fmtWhen(iso) {
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return iso || "—";
      return d.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return iso || "—";
    }
  }

  function statusGate(msg, err) {
    var el = $("amana-gate-status");
    if (!el) return;
    el.textContent = msg || "";
    el.className = "av-status" + (err ? " err" : "");
  }

  function saveStagingFromUI() {
    var bodyEl = $("amana-quick-note-body");
    var titleEl = $("amana-quick-note-title");
    var body = ((bodyEl && bodyEl.value) || "").trim();
    if (!body) {
      statusGate("Type a quick note first.", true);
      return;
    }
    var title = ((titleEl && titleEl.value) || "").trim();
    var list = readStaging();
    list.push({
      id: uid(),
      title: title,
      body: body,
      created: new Date().toISOString(),
      source: "lock-screen"
    });
    writeStaging(list);
    if (bodyEl) bodyEl.value = "";
    if (titleEl) titleEl.value = "";
    renderStagingPreview();
    statusGate("Saved outside vault — imports when you unlock.");
    setTimeout(function () {
      statusGate("");
    }, 2500);
  }

  function renderStagingPreview() {
    var box = $("amana-staging-preview");
    if (!box) return;
    var list = readStaging();
    if (!list.length) {
      box.innerHTML = "<span class=\"aw-muted\">No staged notes yet.</span>";
      return;
    }
    var last = list.slice(-3).reverse();
    box.innerHTML = last
      .map(function (n) {
        var t = (n.title || n.body || "").slice(0, 60);
        return (
          "<div class=\"aw-stage-row\"><time>" +
          fmtWhen(n.created) +
          "</time> · " +
          escapeHtml(t) +
          (n.body && n.body.length > 60 ? "…" : "") +
          "</div>"
        );
      })
      .join("");
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function readCompanionNotes() {
    try {
      var a = JSON.parse(localStorage.getItem("clarity_companion_notes_v1") || "[]");
      return Array.isArray(a) ? a : [];
    } catch (e) {
      return [];
    }
  }

  /** Import staging + companion Notes pad → worksheet (call on unlock) */
  function importStagingToWorksheet() {
    var sheet = readSheetLocal();
    var existing = {};
    sheet.forEach(function (n) {
      if (n && n.id) existing[n.id] = 1;
      if (n && n.fingerprint) existing[n.fingerprint] = 1;
    });
    var added = 0;
    var now = new Date().toISOString();

    function pushNote(n, source) {
      if (!n) return;
      var body = (n.body || n.note || "").trim();
      var title = (n.title || "").trim();
      if (!body && !title) return;
      var fp =
        n.id ||
        source +
          ":" +
          (n.created || "") +
          ":" +
          title.slice(0, 40) +
          ":" +
          body.slice(0, 80);
      if (existing[fp] || (n.id && existing[n.id])) return;
      var id = n.id || uid();
      sheet.push({
        id: id,
        fingerprint: fp,
        title: title,
        body: body,
        created: n.created || n.ts || now,
        imported: now,
        source: source
      });
      existing[fp] = 1;
      existing[id] = 1;
      added++;
    }

    readStaging().forEach(function (n) {
      pushNote(n, n.source || "lock-screen");
    });
    readCompanionNotes().forEach(function (n) {
      pushNote(n, "notes-pad");
    });

    writeSheetLocal(sheet);
    writeStaging([]); /* clear quick-note staging after import */
    renderWorksheet();
    renderStagingPreview();
    try {
      if (typeof clarityAmanaRenderWorksheet === "function") clarityAmanaRenderWorksheet();
    } catch (e) {}
    return added;
  }

  function addInsideNote() {
    var bodyEl = $("amana-sheet-note-body");
    var titleEl = $("amana-sheet-note-title");
    var body = ((bodyEl && bodyEl.value) || "").trim();
    if (!body) return;
    var sheet = readSheetLocal();
    sheet.push({
      id: uid(),
      title: ((titleEl && titleEl.value) || "").trim(),
      body: body,
      created: new Date().toISOString(),
      imported: null,
      source: "inside"
    });
    writeSheetLocal(sheet);
    if (bodyEl) bodyEl.value = "";
    if (titleEl) titleEl.value = "";
    renderWorksheet();
  }

  function deleteNote(id) {
    var sheet = readSheetLocal().filter(function (n) {
      return n && n.id !== id;
    });
    writeSheetLocal(sheet);
    renderWorksheet();
  }

  function pinToHeirLetter(id) {
    var sheet = readSheetLocal();
    var note = null;
    sheet.forEach(function (n) {
      if (n && n.id === id) note = n;
    });
    if (!note) return;
    var letter = $("ahr-letter");
    if (!letter) return;
    var block =
      "\n\n— Worksheet " +
      fmtWhen(note.created) +
      " —\n" +
      (note.title ? note.title + "\n" : "") +
      (note.body || "");
    letter.value = ((letter.value || "").trim() + block).trim();
    try {
      letter.dispatchEvent(new Event("change", { bubbles: true }));
    } catch (e) {}
  }

  function renderWorksheet() {
    var sel = $("amana-worksheet-select");
    var detail = $("amana-worksheet-detail");
    var count = $("amana-worksheet-count");
    var sheet = readSheetLocal().slice().reverse();
    if (count) count.textContent = String(sheet.length);
    if (!sel) return;
    var prev = sel.value;
    sel.innerHTML =
      '<option value="">' +
      (sheet.length ? "Select a note…" : "No worksheet notes yet") +
      "</option>";
    sheet.forEach(function (n) {
      var label =
        fmtWhen(n.created) +
        " · " +
        ((n.title || n.body || "Note").slice(0, 48) || "Note");
      var opt = document.createElement("option");
      opt.value = n.id;
      opt.textContent = label;
      sel.appendChild(opt);
    });
    if (prev) sel.value = prev;
    if (!sel.value && sheet.length) {
      sel.value = sheet[0].id;
    }
    showDetail(sel.value);
    if (detail && !sel.value) {
      detail.innerHTML = sheet.length
        ? "<span class=\"aw-muted\">Choose a note from the list.</span>"
        : "<span class=\"aw-muted\">Quick notes from the lock screen appear here after unlock.</span>";
    }
  }

  function showDetail(id) {
    var detail = $("amana-worksheet-detail");
    if (!detail) return;
    if (!id) return;
    var note = null;
    readSheetLocal().forEach(function (n) {
      if (n && n.id === id) note = n;
    });
    if (!note) {
      detail.innerHTML = "";
      return;
    }
    detail.innerHTML =
      "<div class=\"aw-detail\">" +
      "<div class=\"aw-meta\"><time>" +
      escapeHtml(fmtWhen(note.created)) +
      "</time>" +
      (note.source === "lock-screen"
        ? ' · <span class="aw-badge">from lock screen</span>'
        : "") +
      "</div>" +
      (note.title
        ? "<strong>" + escapeHtml(note.title) + "</strong>"
        : "") +
      "<p>" +
      escapeHtml(note.body || "").replace(/\n/g, "<br>") +
      "</p>" +
      '<div class="aw-detail-actions">' +
      '<button type="button" class="aw-btn" data-aw-pin="' +
      escapeHtml(note.id) +
      '">Pin to heir letter</button> ' +
      '<button type="button" class="aw-btn aw-danger" data-aw-del="' +
      escapeHtml(note.id) +
      '">Delete</button>' +
      "</div></div>";
  }

  function wire() {
    var bs = $("amana-quick-note-save");
    if (bs && !bs.__aw) {
      bs.__aw = true;
      bs.addEventListener("click", saveStagingFromUI);
    }
    var bi = $("amana-sheet-note-save");
    if (bi && !bi.__aw) {
      bi.__aw = true;
      bi.addEventListener("click", addInsideNote);
    }
    var sel = $("amana-worksheet-select");
    if (sel && !sel.__aw) {
      sel.__aw = true;
      sel.addEventListener("change", function () {
        showDetail(sel.value);
      });
    }
    document.addEventListener(
      "click",
      function (ev) {
        var t = ev.target;
        if (!t || !t.getAttribute) return;
        var del = t.getAttribute("data-aw-del");
        var pin = t.getAttribute("data-aw-pin");
        if (del) {
          ev.preventDefault();
          deleteNote(del);
        }
        if (pin) {
          ev.preventDefault();
          pinToHeirLetter(pin);
        }
      },
      false
    );
    renderStagingPreview();
    renderWorksheet();
  }

  /** Hook for gate unlock */
  g.clarityAmanaImportWorksheet = function () {
    var n = importStagingToWorksheet();
    renderWorksheet();
    return n;
  };

  g.clarityAmanaRenderWorksheet = renderWorksheet;

  function boot() {
    wire();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(boot, 80);
    });
  } else setTimeout(boot, 80);
  g.addEventListener("load", function () {
    setTimeout(boot, 200);
  });
})(window);
