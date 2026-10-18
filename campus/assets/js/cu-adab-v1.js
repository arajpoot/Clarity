
(function () {
  "use strict";
  if (window.__CU_ADAB_V1__) return;
  window.__CU_ADAB_V1__ = true;
  function note() {
    if ((location.pathname || "").indexOf("/campus/desk/") < 0) return;
    if (document.getElementById("cu-adab-note")) return;
    var stage = document.getElementById("cu-stage");
    if (!stage) return;
    var p = document.createElement("p");
    p.id = "cu-adab-note";
    p.style.cssText = "font-size:.78rem;opacity:.9;margin:.5rem 0;padding:.55rem .75rem;border-radius:10px;border:1px dashed rgba(201,162,39,.45);background:rgba(70,124,69,.08)";
    p.innerHTML = "<strong>Adab</strong> — Quizzes unlock the next door on this device only. They are not a grade of īmān and are not published. When you open <em>Prove it</em>, read the adab line before answering.";
    stage.insertBefore(p, stage.firstChild);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(note, 500); });
  else setTimeout(note, 500);
})();
