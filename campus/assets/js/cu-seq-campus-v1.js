/* 20261023HK2 */
/**
 * cu-seq-campus-v1.js — Continue · Today 10 min · stage map · after-Clarity paths
 */
(function (g) {
  "use strict";
  if (g.__CU_SEQ_CAMPUS_V1__) return;
  g.__CU_SEQ_CAMPUS_V1__ = true;

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function moduleTitle(stage, id) {
    var mods = g.CuSeq.modulesFor(stage) || [];
    for (var i = 0; i < mods.length; i++) if (mods[i].id === id) return mods[i].title;
    return id;
  }

  function render() {
    if (!g.CuSeq) return;
    var next = g.CuSeq.getNext();
    var c = g.CuSeq.counts();

    var slot = document.getElementById("seq-continue-slot");
    if (slot) {
      if (next && next.moduleId) {
        var mods = g.CuSeq.modulesFor(next.stage) || [];
        var mod = null;
        for (var i = 0; i < mods.length; i++) if (mods[i].id === next.moduleId) mod = mods[i];
        var title = mod ? mod.title : next.moduleId;
        var mins = mod && mod.minutes ? mod.minutes : 10;
        var aim = mod && mod.aim ? mod.aim : "";
        slot.innerHTML =
          '<div class="seq-continue-card seq-today">' +
          '<div class="seq-today-badge">Today · about ' +
          esc(String(mins)) +
          " minutes</div>" +
          "<div><strong>You are here</strong> · " +
          esc(g.CuSeq.stageLabel(next.stage)) +
          "</div>" +
          "<div><strong>Next module</strong> · " +
          esc(title) +
          "</div>" +
          (aim ? '<p class="seq-today-aim">' + esc(aim) + "</p>" : "") +
          '<p><a class="seq-btn primary" href="' +
          esc(g.CuSeq.deskHref(next.stage, next.moduleId)) +
          '">Continue where you left off →</a></p>' +
          "</div>";
      } else {
        slot.innerHTML =
          '<div class="seq-continue-card"><strong>Path complete on this device</strong> · Keep learning with a living teacher. Educational only — not a grade of īmān.</div>';
      }
    }

    var map = document.getElementById("seq-stage-map");
    if (map) {
      map.innerHTML =
        '<ul class="seq-stage-ul">' +
        g.CuSeq.STAGES.map(function (st) {
          var x = c[st] || { done: 0, total: 0, unlocked: false };
          return (
            '<li class="' +
            (x.unlocked ? "open" : "locked") +
            '"><strong>' +
            esc(g.CuSeq.stageLabel(st)) +
            "</strong> · " +
            x.done +
            "/" +
            x.total +
            (x.unlocked ? "" : " · locked") +
            ' · <a href="' +
            esc(g.CuSeq.deskHref(st)) +
            '">Open</a></li>'
          );
        }).join("") +
        "</ul>";
    }

    var paths = document.getElementById("seq-after-clarity");
    if (paths) {
      paths.innerHTML =
        '<div class="seq-after">' +
        "<h3>After Clarity — go deeper with teachers</h3>" +
        "<p>Clarity is an on-device on-ramp. For scholar-led essentials and Qurʾān depth, continue outside:</p>" +
        "<ul>" +
        '<li><a href="https://seekersguidance.org/courses/absolute-essentials-of-islam-hanafi-getting-started-with-your-belief-and-practice" target="_blank" rel="noopener">SeekersGuidance · Absolute Essentials (Hanafi)</a> — check Shāfiʿī track if that is your school</li>' +
        '<li><a href="https://quran.com/1" target="_blank" rel="noopener">Quran.com · Al-Fātiḥah</a> — read and listen with meaning</li>' +
        '<li><a href="https://sunnah.com/" target="_blank" rel="noopener">Sunnah.com</a> — verify ḥadīth by collection and number</li>' +
        "<li>A local trusted teacher or class — for prayer validity and personal questions</li>" +
        "</ul>" +
        '<p class="seq-after-note">Educational only — not a fatwa. Not affiliated with those sites as institutions.</p>' +
        "</div>";
    }
  }

  function boot() {
    render();
    document.addEventListener("cu-seq-progress", render);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
