/**
 * Seeker surface rebuild — clean module UI
 * Uses CU_SEEKER_UNITS + same progress key as legacy junior for continuity.
 * Educational only — not a fatwa. No foundation college chain.
 */
(function (g) {
  "use strict";
  if (g.__CU_SEEKER_SURFACE_V1__) return;
  g.__CU_SEEKER_SURFACE_V1__ = true;

  var PROGRESS_KEY = "clarity_junior_progress_v1";
  var PHASE_KEY = "clarity_curriculum_phase_v1";

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}") || {};
    } catch (e) {
      return {};
    }
  }
  function saveProgress(p) {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
      localStorage.setItem(PHASE_KEY, "seeker");
    } catch (e) {}
  }

  function flatLessons(units) {
    var list = [];
    (units || []).forEach(function (u) {
      (u.lessons || []).forEach(function (l) {
        list.push({ unit: u, lesson: l });
      });
    });
    return list;
  }

  function isDone(p, id) {
    if (!p) return false;
    if (p[id] === true || (p[id] && p[id].done)) return true;
    if (p.modules && (p.modules[id] === true || (p.modules[id] && p.modules[id].done))) return true;
    return false;
  }

  function markDone(id) {
    var p = loadProgress();
    p[id] = { done: true, at: new Date().toISOString() };
    if (!p.modules) p.modules = {};
    p.modules[id] = { done: true, at: new Date().toISOString() };
    saveProgress(p);
    if (g.CuUniProgress && typeof g.CuUniProgress.recordModule === "function") {
      try {
        g.CuUniProgress.recordModule(id, { phase: "seeker" });
      } catch (e) {}
    }
  }

  function firstOpenIndex(flat, p) {
    for (var i = 0; i < flat.length; i++) {
      if (!isDone(p, flat[i].lesson.id)) return i;
    }
    return flat.length; // all done
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function render() {
    var host = document.getElementById("cu-stage");
    if (!host) return;
    var units = g.CU_SEEKER_UNITS;
    if (!units || !units.length) {
      host.innerHTML =
        '<p class="cu-seek-disc">Seeker modules could not load. Hard-refresh or check cu-seeker-units-v1.js.</p>';
      return;
    }
    var p = loadProgress();
    var flat = flatLessons(units);
    var openIx = firstOpenIndex(flat, p);
    var doneCount = 0;
    flat.forEach(function (x) {
      if (isDone(p, x.lesson.id)) doneCount++;
    });
    var pct = flat.length ? Math.round((doneCount / flat.length) * 100) : 0;

    var html =
      '<div class="cu-seek-wrap">' +
      '<div class="cu-seek-head">' +
      "<h1>Seeker · modules</h1>" +
      '<p class="cu-seek-meta">Phase 1 of 4 · foundations · one module at a time. Educational only — not a fatwa.</p>' +
      '<p class="cu-seek-meta"><strong>' +
      doneCount +
      " / " +
      flat.length +
      " modules · " +
      pct +
      "%</strong></p>" +
      '<div class="cu-seek-progress" aria-hidden="true"><span style="width:' +
      pct +
      '%"></span></div>' +
      '<p class="cu-seek-meta">Complete modules in order. Next phase stays locked until modules are done and you pass the phase quiz (when shown).</p>' +
      "</div>";

    units.forEach(function (u) {
      html +=
        '<section class="cu-seek-unit">' +
        "<h2>" +
        esc(u.title) +
        "</h2>" +
        '<p class="goal">' +
        esc(u.goal || "") +
        "</p>";
      (u.lessons || []).forEach(function (l) {
        var ix = -1;
        for (var i = 0; i < flat.length; i++) {
          if (flat[i].lesson.id === l.id) {
            ix = i;
            break;
          }
        }
        var done = isDone(p, l.id);
        var locked = ix > openIx;
        var open = ix === openIx;
        html +=
          '<article class="cu-seek-lesson' +
          (locked ? " locked" : "") +
          '" data-lesson="' +
          esc(l.id) +
          '">' +
          "<h3>" +
          (done ? "✓ " : locked ? "🔒 " : "▸ ") +
          esc(l.title) +
          (l.minutes ? " (" + l.minutes + " min)" : "") +
          "</h3>";
        if (locked) {
          html +=
            '<p class="cu-seek-meta">Locked — complete the previous module and mark it complete to open this one.</p>';
        } else {
          if (l.adab) html += '<p class="adab">' + esc(l.adab) + "</p>";
          if (l.body && l.body.length) {
            html += '<div class="body">';
            l.body.forEach(function (para) {
              html += "<p>" + esc(para) + "</p>";
            });
            html += "</div>";
          }
          if (l.points && l.points.length) {
            html += "<ul>";
            l.points.forEach(function (pt) {
              html += "<li>" + esc(pt) + "</li>";
            });
            html += "</ul>";
          }
          if (l.ayah) {
            html +=
              '<div class="ayah"><strong>' +
              esc(l.ayah.ref || "") +
              "</strong> — " +
              esc(l.ayah.en || "") +
              "</div>";
          }
          if (l.practice) {
            html += '<p class="practice"><strong>Practice:</strong> ' + esc(l.practice) + "</p>";
          }
          html += '<div class="cu-seek-actions">';
          if (!done) {
            html +=
              '<button type="button" class="primary" data-mark="' +
              esc(l.id) +
              '">Mark complete</button>';
          } else {
            html += "<span class=\"cu-seek-meta\">Completed ✓</span>";
          }
          html +=
            '<a href="/lab/arabic/">Lab · Arabic</a>' +
            '<a href="/library/">Library</a>' +
            "</div>";
        }
        html += "</article>";
      });
      html += "</section>";
    });

    html +=
      '<p class="cu-seek-disc">Quizzes unlock doors on this device only. They are not a grade of īmān. Verify with Qurʾān, Sunnah, and a trusted teacher.</p></div>';

    host.innerHTML = html;

    host.querySelectorAll("[data-mark]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        markDone(btn.getAttribute("data-mark"));
        render();
        try {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (e) {}
      });
    });
  }

  function boot() {
    if (!document.body || document.body.getAttribute("data-phase-room") !== "seeker") return;
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(window);
