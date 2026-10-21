/**
 * cu-seq-faculty-v1.js — Faculty personas map to stages
 */
(function (g) {
  "use strict";
  if (g.__CU_SEQ_FACULTY_V1__) return;
  g.__CU_SEQ_FACULTY_V1__ = true;

  var MAP = [
    { id: "fac-seeker", stage: "seeker", title: "Essentials guide", blurb: "Belief, worship awareness, character." },
    { id: "fac-practice", stage: "practice", title: "Foundations guide", blurb: "Purity, prayer, ḥadīth, Arabic step." },
    { id: "fac-consistency", stage: "consistency", title: "Consistency guide", blurb: "Review, light tafsīr, sīrah mercy." },
    { id: "fac-transmission", stage: "transmission", title: "Transmission guide", blurb: "Sources, adab of sharing, knowing when to stop." }
  ];

  function boot() {
    if (!g.CuSeq) return;
    var root = document.getElementById("seq-faculty-root");
    if (!root) return;
    var counts = g.CuSeq.counts();
    var doneMods = 0;
    Object.keys(counts).forEach(function (k) { doneMods += counts[k].done; });
    var countEl = document.getElementById("fac-count-num");
    if (countEl) countEl.textContent = String(doneMods);

    root.innerHTML = MAP.map(function (f) {
      var unlocked = g.CuSeq.isStageUnlocked(f.stage);
      var next = g.CuSeq.getNext();
      var href = unlocked ? g.CuSeq.deskHref(f.stage, next && next.stage === f.stage ? next.moduleId : null) : "#";
      return (
        '<article class="seq-stage-card' +
        (unlocked ? "" : " locked") +
        '">' +
        "<strong>" +
        f.title +
        "</strong>" +
        "<p>" +
        f.blurb +
        "</p>" +
        "<p class=\"cu-meta\">Educational persona — not a living scholar or fatwa service.</p>" +
        (unlocked
          ? '<a class="seq-btn primary" href="' + href + '">Start guided lesson →</a>'
          : "<p>Stage locked until previous is complete.</p>") +
        "</article>"
      );
    }).join("");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
