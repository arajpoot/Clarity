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
    p.style.cssText = "font-size:.78rem;opacity:.8;margin:.5rem 0;padding:.5rem .7rem;border-radius:10px;border:1px dashed rgba(184,166,135,.4)";
    p.textContent = "Quizzes unlock the next door on this device. They are not a grade of iman and are not published.";
    stage.insertBefore(p, stage.firstChild);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(note, 500); });
  else setTimeout(note, 500);
})();
