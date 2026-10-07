/**
 * Clarity Notes Restore v1 — fix broken notepad when recovery is lazy
 * Provides stubs for HTML onclicks, loads recovery, drains queue
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_NOTES_RESTORE_V1__) return;
  g.__CLARITY_NOTES_RESTORE_V1__ = true;

  var loading = null;

  function loadNotes() {
    if (typeof g.notesCreate === "function" && g.notesCreate.__real) return Promise.resolve(true);
    if (typeof g.notesCreate === "function" && !g.notesCreate.__stub) return Promise.resolve(true);
    if (loading) return loading;
    loading = Promise.resolve()
      .then(function () {
        if (g.ClarityLazy && typeof g.ClarityLazy.notes === "function")
          return g.ClarityLazy.notes();
        return new Promise(function (res, rej) {
          var s = document.createElement("script");
          s.src = "./assets/clarity-notes-recovery-v1.js?v=20261006G";
          s.defer = true;
          s.onload = function () { res(true); };
          s.onerror = function () { rej(new Error("notes load")); };
          (document.body || document.documentElement).appendChild(s);
        });
      })
      .then(function () {
        try {
          if (typeof g.notesLoad === "function") g.notesLoad();
          if (typeof g.notesRender === "function") g.notesRender();
        } catch (e) {}
        return true;
      })
      .catch(function (e) {
        console.warn("notes restore", e);
        return false;
      });
    return loading;
  }

  function stub(name, fn) {
    if (typeof g[name] === "function" && !g[name].__stub) return;
    var s = function () {
      var args = arguments;
      return loadNotes().then(function (ok) {
        if (ok && typeof g[name] === "function" && !g[name].__stub)
          return g[name].apply(g, args);
        if (typeof fn === "function") return fn.apply(g, args);
      });
    };
    s.__stub = true;
    g[name] = s;
  }

  stub("notesCreate");
  stub("notesSetQuery");
  stub("notesSelect");
  stub("notesSaveNow");
  stub("notesRequestDelete");
  stub("notesToggleGrave");
  stub("notesUpdateField");
  stub("notesExport");
  stub("notesImport");
  stub("notesCycleView");
  stub("notesSetView");
  stub("notesOpenDeedNote");
  stub("notesQuickFromSection");

  g.clarityOpenNotesEditor = function () {
    return loadNotes().then(function () {
      try {
        if (typeof g.switchTab === "function") g.switchTab("notes");
      } catch (e) {}
      try {
        var shell = document.getElementById("notes-shell");
        if (shell) {
          shell.classList.remove("gate-hidden");
          shell.hidden = false;
          shell.style.removeProperty("display");
          shell.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } catch (e2) {}
      try {
        if (typeof g.notesRender === "function") g.notesRender();
      } catch (e3) {}
    });
  };

  // Eager load after first paint so notepad works
  function boot() {
    var run = function () {
      loadNotes();
    };
    if ("requestIdleCallback" in g)
      requestIdleCallback(run, { timeout: 2500 });
    else setTimeout(run, 1200);
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("load", function () { setTimeout(loadNotes, 400); });

  g.ClarityNotesRestore = { load: loadNotes };
})(typeof window !== "undefined" ? window : this);
