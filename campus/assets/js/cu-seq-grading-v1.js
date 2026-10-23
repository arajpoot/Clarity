/* 20261023HK2 */
/* 20261023C4 */
/* 20261023CLEAN cleanse */
/**
 * cu-seq-grading-v1.js — Study mirror from sequential progress
 * Educational only — not a grade of īmān.
 */
(function (g) {
  "use strict";
  if (g.__CU_SEQ_GRADING_V1__) return;
  g.__CU_SEQ_GRADING_V1__ = true;

  function esc(s) {
    return String(s || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
  }

  function render() {
    var root = document.getElementById("seq-grading-root") || document.getElementById("gr-suggest");
    if (!root || !g.CuSeq) return;

    var counts = g.CuSeq.counts();
    var next = g.CuSeq.getNext();
    var last = g.CuSeq.lastCompletedModule ? g.CuSeq.lastCompletedModule() : null;

    var rows = g.CuSeq.STAGES.map(function (st) {
      var c = counts[st] || { done: 0, total: 0, unlocked: false, complete: false };
      return (
        "<tr><td>" + esc(g.CuSeq.stageLabel(st)) + "</td>" +
        "<td>" + c.done + " / " + c.total + "</td>" +
        "<td>" + (c.complete ? "Complete" : c.unlocked ? "Open" : "Locked") + "</td></tr>"
      );
    }).join("");

    var suggest = "";
    if (next && next.moduleId) {
      var title = next.moduleId;
      var mods = g.CuSeq.modulesFor(next.stage) || [];
      for (var i = 0; i < mods.length; i++) if (mods[i].id === next.moduleId) title = mods[i].title;
      suggest =
        '<p><strong>Suggested next</strong> · <a href="' +
        esc(g.CuSeq.deskHref(next.stage, next.moduleId)) +
        '">' + esc(title) + " →</a></p>";
    } else {
      suggest = "<p><strong>Suggested next</strong> · Sequence complete on this device. Keep learning with a living teacher.</p>";
    }

    var everyday = "";
    if (last && last.module) {
      var src = last.module.source || {};
      everyday =
        '<div class="seq-everyday">' +
        "<strong>Everyday return</strong> (study mirror, not a grade of īmān)<br/>" +
        "Revisit: <em>" + esc(last.module.title) + "</em>" +
        (src.ref ? " · Source: " + esc(src.ref) : "") +
        (src.href ? ' · <a href="' + esc(src.href) + '" target="_blank" rel="noopener">Open source</a>' : "") +
        (last.module.action ? "<br/>Action: " + esc(last.module.action) : "") +
        "</div>";
    } else {
      everyday =
        '<div class="seq-everyday"><strong>Everyday return</strong> · Open Seeker and complete your first module. Study mirror, not a grade of īmān.</div>';
    }

    // If root is gr-suggest only, fill host
    var host = document.getElementById("seq-grading-root");
    if (!host) {
      host = document.createElement("div");
      host.id = "seq-grading-root";
      root.parentNode.insertBefore(host, root);
    }

    host.innerHTML =
      '<p class="seq-mirror-note">Study mirror — not a grade of īmān. Acceptance is with Allah.</p>' +
      '<table class="seq-table"><thead><tr><th>Stage</th><th>Modules</th><th>Status</th></tr></thead><tbody>' +
      rows +
      "</tbody></table>" +
      suggest +
      everyday;

    // Update legacy fields if present
    var pct = document.getElementById("gr-pct");
    if (pct) {
      var total = 0, done = 0;
      Object.keys(counts).forEach(function (k) {
        total += counts[k].total || 0;
        done += counts[k].done || 0;
      });
      pct.textContent = total ? Math.round((100 * done) / total) + "%" : "0%";
    }
  }

  function boot() {
    render();
    document.addEventListener("cu-seq-progress", render);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);

(function (g) {
  function paintReturns() {
    if (!g.CuSeq || !g.CuSeq.dueReturns) return;
    var host = document.getElementById("seq-grading-root") || document.getElementById("gr-suggest");
    if (!host) return;
    var due = g.CuSeq.dueReturns();
    if (!due.length) return;
    var box = document.getElementById("seq-spaced-return");
    if (!box) {
      box = document.createElement("div");
      box.id = "seq-spaced-return";
      box.className = "seq-everyday";
      host.appendChild(box);
    }
    box.innerHTML =
      "<strong>Spaced return</strong> (3- or 7-day review)<ul>" +
      due
        .slice(0, 5)
        .map(function (d) {
          var parts = String(d.id).split(".");
          var st = parts[0];
          var href = g.CuSeq.deskHref(st, d.id);
          return "<li>" + d.kind + " · <a href=\"" + href + "\">" + d.id + "</a></li>";
        })
        .join("") +
      "</ul>";
  }
  document.addEventListener("DOMContentLoaded", paintReturns);
  document.addEventListener("cu-seq-progress", paintReturns);
})(typeof window !== "undefined" ? window : this);
