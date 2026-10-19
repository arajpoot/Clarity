/**
 * Generic phase surface (Practice / Consistency / Transmission)
 * Config: data-phase-room, data-units-global, data-progress-key, data-phase-label, data-phase-sub
 * Educational only — not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CU_PHASE_SURFACE_V1__) return;
  g.__CU_PHASE_SURFACE_V1__ = true;

  function cfg() {
    var b = document.body;
    return {
      room: (b && b.getAttribute("data-phase-room")) || "",
      unitsKey: (b && b.getAttribute("data-units-global")) || "",
      progressKey: (b && b.getAttribute("data-progress-key")) || "cu_phase_progress_v1",
      label: (b && b.getAttribute("data-phase-label")) || "Phase",
      sub: (b && b.getAttribute("data-phase-sub")) || "One module at a time.",
      labHref: (b && b.getAttribute("data-lab-href")) || "/lab/",
      labLabel: (b && b.getAttribute("data-lab-label")) || "Lab"
    };
  }

  function loadProgress(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "{}") || {};
    } catch (e) {
      return {};
    }
  }
  function saveProgress(key, p) {
    try {
      localStorage.setItem(key, JSON.stringify(p));
    } catch (e) {}
  }
  function isDone(p, id) {
    if (!p) return false;
    if (p[id] === true || (p[id] && p[id].done)) return true;
    if (p.modules && (p.modules[id] === true || (p.modules[id] && p.modules[id].done))) return true;
    return false;
  }
  function markDone(key, id, room) {
    var p = loadProgress(key);
    p[id] = { done: true, at: new Date().toISOString() };
    if (!p.modules) p.modules = {};
    p.modules[id] = { done: true, at: new Date().toISOString() };
    saveProgress(key, p);
    try {
      localStorage.setItem("clarity_curriculum_phase_v1", room);
    } catch (e) {}
    if (g.CuUniProgress && g.CuUniProgress.recordModule) {
      try {
        g.CuUniProgress.recordModule(id, { phase: room });
      } catch (e) {}
    }
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
  function firstOpen(flat, p) {
    for (var i = 0; i < flat.length; i++) {
      if (!isDone(p, flat[i].lesson.id)) return i;
    }
    return flat.length;
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function render() {
    var c = cfg();
    if (!c.room || c.room === "seeker") return; // seeker has its own surface
    var host = document.getElementById("cu-stage");
    if (!host) return;
    var units = g[c.unitsKey];
    if (!units || !units.length) {
      host.innerHTML = '<p class="cu-seek-disc">Modules could not load. Check units script.</p>';
      return;
    }
    var p = loadProgress(c.progressKey);
    var flat = flatLessons(units);
    var openIx = firstOpen(flat, p);
    var doneCount = 0;
    flat.forEach(function (x) {
      if (isDone(p, x.lesson.id)) doneCount++;
    });
    var pct = flat.length ? Math.round((doneCount / flat.length) * 100) : 0;

    var html =
      '<div class="cu-seek-wrap">' +
      '<div class="cu-seek-head">' +
      "<h1>" +
      esc(c.label) +
      " · modules</h1>" +
      '<p class="cu-seek-meta">' +
      esc(c.sub) +
      " Educational only — not a fatwa.</p>" +
      '<p class="cu-seek-meta"><strong>' +
      doneCount +
      " / " +
      flat.length +
      " modules · " +
      pct +
      "%</strong></p>" +
      '<div class="cu-seek-progress" aria-hidden="true"><span style="width:' +
      pct +
      '%"></span></div></div>';

    units.forEach(function (u) {
      html +=
        '<section class="cu-seek-unit"><h2>' +
        esc(u.title) +
        "</h2>" +
        (u.goal ? '<p class="goal">' + esc(u.goal) + "</p>" : "");
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
        html +=
          '<article class="cu-seek-lesson' +
          (locked ? " locked" : "") +
          '"><h3>' +
          (done ? "✓ " : locked ? "🔒 " : "▸ ") +
          esc(l.title) +
          (l.minutes ? " (" + l.minutes + " min)" : "") +
          "</h3>";
        if (locked) {
          html +=
            '<p class="cu-seek-meta">Locked — complete the previous module first.</p>';
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
            html +=
              '<p class="practice"><strong>Practice:</strong> ' +
              esc(l.practice) +
              "</p>";
          }
          html += '<div class="cu-seek-actions">';
          if (!done) {
            html +=
              '<button type="button" class="primary" data-mark="' +
              esc(l.id) +
              '">Mark complete</button>';
          } else {
            html += '<span class="cu-seek-meta">Completed ✓</span>';
          }
          html +=
            '<a href="' +
            esc(c.labHref) +
            '">' +
            esc(c.labLabel) +
            '</a><a href="/library/">Library</a><a href="/campus/buddy/">Buddy</a></div>';
        }
        html += "</article>";
      });
      html += "</section>";
    });
    html +=
      '<p class="cu-seek-disc">Progress stays on this device. Not a grade of īmān. Verify with Qurʾān, Sunnah, and a trusted teacher.</p></div>';
    host.innerHTML = html;
    host.querySelectorAll("[data-mark]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        markDone(c.progressKey, btn.getAttribute("data-mark"), c.room);
        render();
        try {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (e) {}
      });
    });
  }

  function boot() {
    var c = cfg();
    if (!c.room || c.room === "seeker") return;
    if (!c.unitsKey) return;
    render();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window);
