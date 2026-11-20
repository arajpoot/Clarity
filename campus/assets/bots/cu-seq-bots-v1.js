/* 20261023HK2 */
/* 20261023C4 */
/* 20261023CLEAN cleanse */
/**
 * cu-seq-bots-v1.js — IT incomplete + O&M mark one step (same progress bus)
 * All local. Educational only.
 */
(function (g) {
  "use strict";
  if (g.__CU_SEQ_BOTS_V1__) return;
  g.__CU_SEQ_BOTS_V1__ = true;

  function esc(s) {
    return String(s || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
  }

  function itReport() {
    if (!g.CuSeq) return ["Sequential bus not loaded."];
    var c = g.CuSeq.counts();
    var lines = [];
    g.CuSeq.STAGES.forEach(function (st) {
      var x = c[st] || { done: 0, total: 0, unlocked: false };
      lines.push(
        g.CuSeq.stageLabel(st) + ": " + x.done + "/" + x.total +
        (x.unlocked ? (x.done >= x.total ? " complete" : "") : " (locked)")
      );
    });
    var n = g.CuSeq.getNext();
    if (n && n.moduleId) lines.push("Next unfinished: " + n.moduleId);
    else lines.push("No unfinished sequential module on this device.");
    return lines;
  }

  function paintIt() {
    var el = document.getElementById("it-report") || document.getElementById("seq-bot-it");
    if (!el) return;
    el.innerHTML = "<ul>" + itReport().map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul>";
  }

  function wireOm() {
    var btn = document.getElementById("om-mark") || document.getElementById("seq-om-mark");
    if (!btn || btn.__seqWired) return;
    btn.__seqWired = true;
    btn.addEventListener("click", function () {
      if (!g.CuSeq) return;
      var n = g.CuSeq.getNext();
      if (!n || !n.moduleId) {
        alert("No unfinished module. Sequence complete on this device.");
        return;
      }
      g.CuSeq.markModuleDone(n.moduleId);
      paintIt();
      alert("O&M marked one step: " + n.moduleId + " (local only).");
    });
  }

  function wireIt() {
    var btn = document.getElementById("it-run");
    if (!btn || btn.__seqWired) return;
    btn.__seqWired = true;
    btn.addEventListener("click", function () {
      paintIt();
    });
  }

  function boot() {
    paintIt();
    wireOm();
    wireIt();
    document.addEventListener("cu-seq-progress", paintIt);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
