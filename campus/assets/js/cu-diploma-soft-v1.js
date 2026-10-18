/**
 * U-E Soft diploma hall — ceremony tone, no false credentials.
 */
(function () {
  "use strict";
  if (window.__CU_DIPLOMA_SOFT_V1__) return;
  window.__CU_DIPLOMA_SOFT_V1__ = true;
  function run() {
    var root =
      document.getElementById("cu-diploma-root") ||
      document.querySelector("article.cu-student");
    if (!root) return;
    if (document.getElementById("cu-diploma-soft-note")) return;
    var note = document.createElement("div");
    note.id = "cu-diploma-soft-note";
    note.className = "cu-plaque";
    note.style.margin = "0.75rem 0";
    note.innerHTML =
      "<strong>Educational milestone only</strong>" +
      "<p class=\"cu-meta\" style=\"margin:0.35rem 0 0\">This hall marks effort on this device. It is not an accredited diploma, not ijāzah, and not a measure of īmān. Seal and phase rules stay in the foundation layer.</p>";
    root.insertBefore(note, root.firstChild.nextSibling);
    try {
      if (window.CuUniProgress) {
        var p = window.CuUniProgress.load();
        var n = Object.keys((p && p.modules) || {}).length;
        var line = document.createElement("p");
        line.className = "cu-meta";
        line.textContent =
          n > 0
            ? "Recorded module completions on this device: " + n + "."
            : "Complete desk modules to build a local record toward this hall.";
        note.appendChild(line);
      }
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
