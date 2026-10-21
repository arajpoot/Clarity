/* Fiqh path companion — minimal valid 20261015FIX */
(function (g) {
  "use strict";
  function fiqhGoStep(step) {
    step = Number(step) || 1;
    var map = {
      1: { id: "user-family-tree-card", hint: "Step 1 · Family tree. Educational only — not a fatwa." },
      2: { id: "faraid-card", hint: "Step 2 · Farāʾiḍ shares. Educational only — not a fatwa." },
      3: { id: "wasiyyah-card", hint: "Step 3 · Wasiyyah ≤⅓. Educational only — not a fatwa." }
    };
    var spec = map[step] || map[1];
    try {
      document.querySelectorAll(".fiqh-step-btn").forEach(function (b) {
        b.classList.toggle("on", Number(b.getAttribute("data-fiqh-step")) === step);
      });
      document.querySelectorAll("#fiqh-path-checklist li").forEach(function (li) {
        li.classList.toggle("on", Number(li.getAttribute("data-step")) === step);
      });
      ["user-family-tree-card", "faraid-card", "wasiyyah-card"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.classList.toggle("fiqh-path-focus", id === spec.id);
      });
      var hint = document.getElementById("fiqh-path-hint");
      if (hint) hint.textContent = spec.hint;
      var target = document.getElementById(spec.id);
      if (target && target.scrollIntoView) target.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {
      console.warn("fiqhGoStep", e);
    }
  }
  g.fiqhGoStep = fiqhGoStep;
})(typeof window !== "undefined" ? window : this);
