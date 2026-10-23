/* 20261023CLEAN cleanse */
/**
 * cu-seq-campus-v1.js — Continue card + stage map on /campus/
 */
(function (g) {
  "use strict";
  if (g.__CU_SEQ_CAMPUS_V1__) return;
  g.__CU_SEQ_CAMPUS_V1__ = true;

  function esc(s) {
    return String(s || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
  }

  function render() {
    if (!g.CuSeq) return;
    var next = g.CuSeq.getNext();
    var c = g.CuSeq.counts();

    var slot = document.getElementById("seq-continue-slot");
    if (slot) {
      if (next && next.moduleId) {
        var mods = g.CuSeq.modulesFor(next.stage) || [];
        var title = next.moduleId;
        for (var i = 0; i < mods.length; i++) if (mods[i].id === next.moduleId) title = mods[i].title;
        slot.innerHTML =
          '<div class="seq-continue-card">' +
          "<div><strong>You are here</strong> · " + esc(g.CuSeq.stageLabel(next.stage)) + "</div>" +
          "<div><strong>Next module</strong> · " + esc(title) + "</div>" +
          '<p><a class="seq-btn primary" href="' + esc(g.CuSeq.deskHref(next.stage, next.moduleId)) + '">Continue where you left off →</a></p>' +
          "</div>";
      } else {
        slot.innerHTML =
          '<div class="seq-continue-card"><strong>Path complete on this device</strong> · Keep learning with a living teacher. Educational only — not a grade of īmān.</div>';
      }
    }

    var map = document.getElementById("seq-stage-map");
    if (map) {
      map.innerHTML =
        "<ul class=\"seq-stage-ul\">" +
        g.CuSeq.STAGES.map(function (st) {
          var x = c[st] || { done: 0, total: 0, unlocked: false };
          return (
            "<li class=\"" + (x.unlocked ? "open" : "locked") + "\">" +
            "<strong>" + esc(g.CuSeq.stageLabel(st)) + "</strong> · " +
            x.done + "/" + x.total +
            (x.unlocked ? "" : " · locked") +
            ' · <a href="' + esc(g.CuSeq.deskHref(st)) + '">Open</a></li>'
          );
        }).join("") +
        "</ul>";
    }
  }

  function boot() {
    render();
    document.addEventListener("cu-seq-progress", render);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
