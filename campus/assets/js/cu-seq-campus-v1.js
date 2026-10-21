/**
 * cu-seq-campus-v1.js — Continue card + stage map on /campus/
 */
(function (g) {
  "use strict";
  if (g.__CU_SEQ_CAMPUS_V1__) return;
  g.__CU_SEQ_CAMPUS_V1__ = true;

  function boot() {
    if (!g.CuSeq || !g.CU_SEQ_MODULES) return;
    var slot = document.getElementById("seq-continue-slot");
    var map = document.getElementById("seq-stage-map");
    var next = g.CuSeq.getNext();
    var counts = g.CuSeq.counts();

    if (slot) {
      var title = "Continue where you left off";
      var sub = "Start Seeker essentials";
      var href = g.CuSeq.deskHref("seeker");
      if (next && next.moduleId) {
        var mods = g.CuSeq.modulesFor(next.stage);
        var m = mods.filter(function (x) { return x.id === next.moduleId; })[0];
        sub = g.CuSeq.stageLabel(next.stage) + " · " + ((m && m.title) || next.moduleId);
        href = g.CuSeq.deskHref(next.stage, next.moduleId);
      } else if (next && next.allDone) {
        sub = "Sequence complete on this device — keep learning with a teacher";
        href = "/campus/grading.html";
      }
      slot.innerHTML =
        '<div class="seq-continue">' +
        "<div><strong>" +
        title +
        "</strong><br/><span>" +
        sub +
        "</span></div>" +
        '<a class="seq-btn primary" href="' +
        href +
        '">Continue →</a></div>';
    }

    if (map) {
      map.innerHTML = g.CuSeq.STAGES.map(function (st) {
        var c = counts[st] || { done: 0, total: 0, unlocked: true };
        var here = next && next.stage === st;
        return (
          '<div class="seq-stage-card' +
          (c.unlocked ? "" : " locked") +
          (here ? " here" : "") +
          '">' +
          "<strong>" +
          g.CuSeq.stageLabel(st) +
          "</strong>" +
          (c.unlocked ? c.done + "/" + c.total + " modules" : "Locked") +
          (here ? "<br/><em>You are here</em>" : "") +
          (c.unlocked
            ? '<br/><a href="' + g.CuSeq.deskHref(st) + '">Open desk →</a>'
            : "") +
          "</div>"
        );
      }).join("");
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
