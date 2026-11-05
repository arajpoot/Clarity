/*! craft-notes-studio-v1 · C16NT
 * Full notes library for Craft — adapted from Companion clarity-notes-recovery patterns.
 * Storage: clarity.craft.notes.v1 only (not Amānah vault · not companion shell).
 * Educational only — not a fatwa · not encrypted cloud.
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_NOTES_STUDIO_C16NT__) return;
  w.__CRAFT_NOTES_STUDIO_C16NT__ = true;

  var KEY = "clarity.craft.notes.v1";
  var state = { notes: [], selectedId: null, query: "", tagFilter: "" };

  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }
  function nid() {
    return "cn-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  }
  function empty(partial) {
    var now = Date.now();
    return Object.assign({ id: nid(), title: "", body: "", tag: "general", createdAt: now, updatedAt: now }, partial || {});
  }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      state.notes = Array.isArray(data.notes) ? data.notes : Array.isArray(data) ? data : [];
      state.selectedId = data.selectedId || (state.notes[0] && state.notes[0].id) || null;
    } catch (e) {
      state.notes = [];
    }
  }
  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify({ notes: state.notes.slice(0, 200), selectedId: state.selectedId }));
    } catch (e) {}
    var st = d.getElementById("notes-save-status");
    if (st) st.textContent = "Saved on this device · " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  function displayTitle(n) {
    var t = (n.title || "").trim();
    if (t) return t;
    var first = (n.body || "").split("\n").map(function (l) { return l.replace(/^#+\s*/, "").trim(); }).find(Boolean);
    return first || "Untitled";
  }
  function match(n) {
    var q = (state.query || "").trim().toLowerCase();
    var tag = (state.tagFilter || "").trim().toLowerCase();
    if (tag && String(n.tag || "").toLowerCase() !== tag) return false;
    if (!q) return true;
    return (
      String(n.title || "").toLowerCase().indexOf(q) >= 0 ||
      String(n.body || "").toLowerCase().indexOf(q) >= 0 ||
      String(n.tag || "").toLowerCase().indexOf(q) >= 0
    );
  }
  function sorted() {
    return state.notes.slice().sort(function (a, b) { return (b.updatedAt || 0) - (a.updatedAt || 0); });
  }
  function selected() {
    return state.notes.find(function (n) { return n.id === state.selectedId; }) || null;
  }

  function paintList() {
    var list = d.getElementById("notes-list");
    if (!list) return;
    var rows = sorted().filter(match);
    if (!rows.length) {
      list.innerHTML = '<p class="panel-note">No notes match. Create one or clear filters.</p>';
      return;
    }
    list.innerHTML = rows
      .map(function (n) {
        var active = n.id === state.selectedId ? " active" : "";
        return (
          '<button type="button" class="note-row' + active + '" data-id="' + esc(n.id) + '">' +
          "<strong>" + esc(displayTitle(n)) + "</strong>" +
          ' <span class="note-tag">' + esc(n.tag || "") + "</span>" +
          "<time>" + new Date(n.updatedAt || n.createdAt || 0).toLocaleString() + "</time>" +
          "</button>"
        );
      })
      .join("");
    list.querySelectorAll("[data-id]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.selectedId = btn.getAttribute("data-id");
        paintEditor();
        paintList();
        persist();
      });
    });
  }

  function paintEditor() {
    var n = selected();
    var emptyEl = d.getElementById("notes-editor-empty");
    var activeEl = d.getElementById("notes-editor-active");
    var title = d.getElementById("notes-title");
    var body = d.getElementById("notes-body");
    var tag = d.getElementById("notes-tag-select");
    var cc = d.getElementById("notes-char-count");
    if (!n) {
      if (emptyEl) emptyEl.hidden = false;
      if (activeEl) activeEl.hidden = true;
      return;
    }
    if (emptyEl) emptyEl.hidden = true;
    if (activeEl) activeEl.hidden = false;
    if (title) title.value = n.title || "";
    if (body) body.value = n.body || "";
    if (tag) tag.value = n.tag || "general";
    if (cc) cc.textContent = (n.body || "").length + " chars";
  }

  function upsertFromEditor() {
    var n = selected();
    if (!n) return;
    var title = d.getElementById("notes-title");
    var body = d.getElementById("notes-body");
    var tag = d.getElementById("notes-tag-select");
    n.title = title ? title.value : n.title;
    n.body = body ? body.value : n.body;
    n.tag = tag ? tag.value : n.tag;
    n.updatedAt = Date.now();
    persist();
    paintList();
    var cc = d.getElementById("notes-char-count");
    if (cc) cc.textContent = (n.body || "").length + " chars";
  }

  function newNote() {
    var n = empty({ tag: (d.getElementById("notes-tag-select") || {}).value || "general" });
    state.notes.unshift(n);
    state.selectedId = n.id;
    persist();
    paintList();
    paintEditor();
    var title = d.getElementById("notes-title");
    if (title) title.focus();
  }

  function deleteSelected() {
    if (!state.selectedId) return;
    if (!w.confirm("Delete this craft note on this device?")) return;
    state.notes = state.notes.filter(function (n) { return n.id !== state.selectedId; });
    state.selectedId = state.notes[0] ? state.notes[0].id : null;
    persist();
    paintList();
    paintEditor();
  }

  function exportJson() {
    var blob = new Blob([JSON.stringify({ notes: state.notes }, null, 2)], { type: "application/json" });
    var a = d.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "clarity-craft-notes-" + Date.now() + ".json";
    a.click();
  }

  function importFile(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(String(reader.result || "{}"));
        var arr = Array.isArray(data.notes) ? data.notes : Array.isArray(data) ? data : [];
        arr.forEach(function (item) {
          if (!item || typeof item !== "object") return;
          var n = empty({
            title: item.title || "",
            body: item.body || item.text || "",
            tag: item.tag || "imported",
            createdAt: item.createdAt || Date.now(),
            updatedAt: item.updatedAt || Date.now()
          });
          state.notes.unshift(n);
        });
        if (state.notes[0]) state.selectedId = state.notes[0].id;
        persist();
        paintList();
        paintEditor();
      } catch (e) {
        alert("Import failed — use a Craft/Companion notes JSON export.");
      }
    };
    reader.readAsText(file);
  }

  /* Optional one-way import from legacy companion key (read-only merge) */
  function importCompanionLibrary() {
    try {
      var raw = localStorage.getItem("clarity-notes-v1");
      if (!raw) {
        alert("No Companion notes library found on this device.");
        return;
      }
      var data = JSON.parse(raw);
      var arr = (data && data.notes) || [];
      if (!arr.length) {
        alert("Companion library is empty.");
        return;
      }
      if (!w.confirm("Copy " + arr.length + " Companion note(s) into Craft storage on this device? (Amānah vault is separate.)")) return;
      arr.forEach(function (item) {
        state.notes.unshift(
          empty({
            title: item.title || "",
            body: item.body || "",
            tag: item.tag || "from-companion",
            createdAt: item.createdAt || Date.now(),
            updatedAt: Date.now()
          })
        );
      });
      state.selectedId = state.notes[0].id;
      persist();
      paintList();
      paintEditor();
    } catch (e) {
      alert("Could not read Companion notes key.");
    }
  }

  function bind() {
    load();
    if (!state.notes.length) {
      state.notes.push(
        empty({
          title: "Welcome · Craft Notes",
          tag: "guide",
          body:
            "Local Craft library on this browser only.\n\n" +
            "• Not Amānah vault (passphrase notes live under Amānah).\n" +
            "• Section reflections for meme/tajweed/calligraphy/quiz.\n" +
            "• Export JSON for your own backup.\n\n" +
            "Educational only — not a fatwa."
        })
      );
      state.selectedId = state.notes[0].id;
      persist();
    }
    paintList();
    paintEditor();

    var search = d.getElementById("notes-search");
    if (search) search.addEventListener("input", function () {
      state.query = search.value || "";
      paintList();
    });
    var tagFilter = d.getElementById("notes-tag-filter");
    if (tagFilter) tagFilter.addEventListener("change", function () {
      state.tagFilter = tagFilter.value || "";
      paintList();
    });
    ["notes-title", "notes-body", "notes-tag-select"].forEach(function (id) {
      var el = d.getElementById(id);
      if (!el) return;
      el.addEventListener("input", function () {
        upsertFromEditor();
      });
    });
    var save = d.getElementById("notes-save-now");
    if (save) save.addEventListener("click", function () {
      upsertFromEditor();
      persist();
    });
    var neu = d.getElementById("notes-new");
    if (neu) neu.addEventListener("click", newNote);
    var del = d.getElementById("notes-delete");
    if (del) del.addEventListener("click", deleteSelected);
    var exp = d.getElementById("notes-export");
    if (exp) exp.addEventListener("click", exportJson);
    var imp = d.getElementById("notes-import-file");
    if (imp) imp.addEventListener("change", function () {
      if (imp.files && imp.files[0]) importFile(imp.files[0]);
      imp.value = "";
    });
    var fromC = d.getElementById("notes-import-companion");
    if (fromC) fromC.addEventListener("click", importCompanionLibrary);

    d.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        newNote();
      }
    });
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", bind);
  else bind();

  w.craftNotesStudio = { state: state, persist: persist, newNote: newNote };
})(window, document);
