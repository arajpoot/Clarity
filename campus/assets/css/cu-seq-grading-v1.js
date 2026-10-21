/**
 * cu-seq-grading-v1.js — Study mirror
 */
(function (g) {
  "use strict";
  if (g.__CU_SEQ_GRADING_V1__) return;
  g.__CU_SEQ_GRADING_V1__ = true;

  function boot() {
    if (!g.CuSeq) return;
    var root = document.getElementById("seq-grading-root");
    if (!root) return;
    var next = g.CuSeq.getNext();
    var counts = g.CuSeq.counts();
    var last = g.CuSeq.lastCompletedModule();
    var rows = g.CuSeq.STAGES.map(function (st) {
      var c = counts[st];
      return (
        "<tr><td>" +
        g.CuSeq.stageLabel(st) +
        "</td><td>" +
        c.done +
        "/" +
        c.total +
        "</td><td>" +
        (c.complete ? "Complete" : c.unlocked ? "In progress" : "Locked") +
        "</td></tr>"
      );
    }).join("");

    var suggest =
      next && next.moduleId
        ? '<p><strong>Suggested next</strong> · <a href="' +
          g.CuSeq.deskHref(next.stage, next.moduleId) +
          '">' +
          next.moduleId +
          "</a></p>"
        : "<p>Sequence complete on this device.</p>";

    var review = last
      ? "<p><strong>Everyday return</strong> · Revisit: " +
        (last.module.title || last.module.id) +
        " — " +
        (last.module.action || "Repeat the aim once today.") +
        "</p>"
      : "<p><strong>Everyday return</strong> · Open Seeker and begin the first module.</p>";

    root.innerHTML =
      '<p class="gr-disclaimer"><strong>This is a study mirror, not a grade of īmān. Acceptance is with Allah.</strong></p>' +
      "<table class=\"seq-table\" style=\"width:100%;border-collapse:collapse;font-size:.88rem\"><thead><tr><th align=\"left\">Stage</th><th>Done</th><th>Status</th></tr></thead><tbody>" +
      rows +
      "</tbody></table>" +
      suggest +
      review +
      '<p class="cu-meta">One University marker on this device only — Companion streaks are separate and untouched.</p>';
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
