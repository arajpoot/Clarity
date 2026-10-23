/* 20261023C4 */
/* 20261023CLEAN cleanse */
/**
 * cu-seq-faculty-v1.js — Educational personas → sequential modules
 * Not living scholars or fatwa service.
 */
(function (g) {
  "use strict";
  if (g.__CU_SEQ_FACULTY_V1__) return;
  g.__CU_SEQ_FACULTY_V1__ = true;

  function esc(s) {
    return String(s || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
  }

  function paintCount() {
    var el = document.getElementById("fac-count-num") || document.getElementById("fac-count");
    if (!el || !g.CuSeq) return;
    var c = g.CuSeq.counts(), n = 0;
    Object.keys(c).forEach(function (k) { n += c[k].done || 0; });
    if (el.id === "fac-count-num") el.textContent = String(n);
    else el.innerHTML = "Modules marked done: <strong id=\"fac-count-num\">" + n + "</strong> · Educational personas — not living scholars";
  }

  function wireButtons() {
    if (!g.CuSeq) return;
    document.querySelectorAll("[data-start-guided], .fac-card button, #fac-next").forEach(function (btn) {
      if (btn.__seqWired) return;
      btn.__seqWired = true;
      btn.addEventListener("click", function (e) {
        // Prefer sequential next unfinished module
        var next = g.CuSeq.getNext();
        if (next && next.moduleId) {
          e.preventDefault();
          location.href = g.CuSeq.deskHref(next.stage, next.moduleId);
        }
      });
    });
    // Dedicated button if present
    var start = document.getElementById("seq-start-guided");
    if (start && !start.__seqWired) {
      start.__seqWired = true;
      start.addEventListener("click", function () {
        var next = g.CuSeq.getNext();
        if (next && next.moduleId) location.href = g.CuSeq.deskHref(next.stage, next.moduleId);
        else alert("All sequential modules marked on this device.");
      });
    }
  }

  function renderRoot() {
    var root = document.getElementById("seq-faculty-root");
    if (!root || !g.CuSeq) return;
    var next = g.CuSeq.getNext();
    var c = g.CuSeq.counts();
    var map = g.CuSeq.STAGES.map(function (st) {
      var x = c[st] || { done: 0, total: 0 };
      return "<li><strong>" + esc(g.CuSeq.stageLabel(st)) + "</strong> · " + x.done + "/" + x.total + "</li>";
    }).join("");
    root.innerHTML =
      '<p class="seq-persona-note">Educational personas only — not living scholars or a fatwa service.</p>' +
      "<ul>" + map + "</ul>" +
      (next && next.moduleId
        ? '<p><button type="button" class="seq-btn primary" id="seq-start-guided">Start guided lesson →</button></p>'
        : "<p>Sequence complete on this device.</p>");
    wireButtons();
  }

  function boot() {
    paintCount();
    renderRoot();
    wireButtons();
    document.addEventListener("cu-seq-progress", function () {
      paintCount();
      renderRoot();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
