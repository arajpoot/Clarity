/*! craft-notes-v1 · local craft log · not Amānah */
(function (w, d) {
  "use strict";
  var KEY = "clarity_craft_notes_v1";
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; }
  }
  function save(arr) {
    try { localStorage.setItem(KEY, JSON.stringify(arr.slice(0, 80))); } catch (e) {}
  }
  function paint() {
    var list = d.getElementById("notes-list");
    if (!list) return;
    var arr = load();
    list.innerHTML = arr.length
      ? arr.map(function (n) {
          return '<div class="note-row"><time>' + (n.t || "").slice(0, 19).replace("T", " ") + "</time> · <strong>" + (n.tag || "") + "</strong><div>" + (n.text || "") + "</div></div>";
        }).join("")
      : "<p class='panel-note'>No craft notes yet.</p>";
  }
  function boot() {
    paint();
    var ta = d.getElementById("craft-note");
    var tag = d.getElementById("note-tag");
    d.getElementById("note-save").addEventListener("click", function () {
      var text = (ta && ta.value || "").trim();
      if (!text) return;
      var arr = load();
      arr.unshift({ t: new Date().toISOString(), tag: tag ? tag.value : "general", text: text });
      save(arr);
      if (ta) ta.value = "";
      paint();
    });
    d.getElementById("note-clear").addEventListener("click", function () {
      if (ta) ta.value = "";
    });
    if (w.ClarityCraftRegistry) w.ClarityCraftRegistry.runUpgrade("notes", {});
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
