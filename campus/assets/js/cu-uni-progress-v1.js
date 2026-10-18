/**
 * U-D One progress model (bridge) — Clarity University
 * Reads legacy keys, writes cu_uni_progress_v1, feeds transcript root.
 * Companion untouched. Educational only.
 */
(function (g) {
  "use strict";
  if (g.__CU_UNI_PROGRESS_V1__) return;
  g.__CU_UNI_PROGRESS_V1__ = true;

  var KEY = "cu_uni_progress_v1";
  var LEGACY = [
    "clarity_univ_progress_v1",
    "clarity_junior_progress_v1",
    "clarity_curriculum_phase_v1",
    "clarity_phase_quiz_pass_v1",
    "cu_uni_day_note_v1"
  ];

  function readRaw(k) {
    try {
      return localStorage.getItem(k);
    } catch (e) {
      return null;
    }
  }

  function writeRaw(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch (e) {}
  }

  function parseJSON(s, fallback) {
    try {
      return s ? JSON.parse(s) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function load() {
    var cur = parseJSON(readRaw(KEY), null);
    if (cur && typeof cur === "object") return cur;
    var phase = readRaw("clarity_curriculum_phase_v1") || "seeker";
    var junior = parseJSON(readRaw("clarity_junior_progress_v1"), {});
    var univ = parseJSON(readRaw("clarity_univ_progress_v1"), {});
    var quiz = parseJSON(readRaw("clarity_phase_quiz_pass_v1"), {});
    var merged = {
      v: 1,
      phase: phase,
      modules: {},
      quizzes: quiz || {},
      labs: {},
      updated: new Date().toISOString(),
      source: "bridge"
    };
    if (junior && typeof junior === "object") {
      Object.keys(junior).forEach(function (k) {
        if (k === "modules" && junior.modules) {
          Object.assign(merged.modules, junior.modules);
        } else if (k !== "phase") {
          merged.modules[k] = junior[k];
        }
      });
      if (junior.phase) merged.phase = junior.phase;
    }
    if (univ && typeof univ === "object") {
      if (univ.phase) merged.phase = univ.phase;
      if (univ.modules) Object.assign(merged.modules, univ.modules);
      if (univ.labs) Object.assign(merged.labs, univ.labs);
    }
    save(merged);
    return merged;
  }

  function save(obj) {
    obj.updated = new Date().toISOString();
    writeRaw(KEY, JSON.stringify(obj));
    /* mirror phase for older continue scripts */
    if (obj.phase) writeRaw("clarity_curriculum_phase_v1", String(obj.phase));
    return obj;
  }

  function recordModule(id, meta) {
    var p = load();
    p.modules[id] = Object.assign({ at: new Date().toISOString(), done: true }, meta || {});
    return save(p);
  }

  function recordQuiz(id, pass) {
    var p = load();
    p.quizzes[id] = { pass: !!pass, at: new Date().toISOString() };
    return save(p);
  }

  function recordLab(id) {
    var p = load();
    p.labs[id] = { at: new Date().toISOString() };
    return save(p);
  }

  function paintTranscript() {
    var root = document.getElementById("cu-transcript-root");
    if (!root) return;
    var p = load();
    var mods = Object.keys(p.modules || {});
    var quizzes = Object.keys(p.quizzes || {});
    var labs = Object.keys(p.labs || {});
    var html =
      '<div class="cu-plaque"><strong>Phase</strong> · ' +
      (p.phase || "seeker") +
      '<br/><span class="cu-meta">Updated ' +
      (p.updated || "—") +
      "</span></div>";
    html += "<h2 style=\"font-size:1rem;margin:1rem 0 0.35rem\">Modules</h2>";
    if (!mods.length) {
      html += '<p class="cu-meta">No module completions stored yet. Finish a desk module to record one.</p>';
    } else {
      html += "<ul style=\"margin:0 0 0 1.1rem\">";
      mods
        .sort()
        .reverse()
        .forEach(function (id) {
          var m = p.modules[id] || {};
          html +=
            "<li><strong>" +
            id +
            "</strong> · " +
            (m.at || "") +
            (m.done ? " · done" : "") +
            "</li>";
        });
      html += "</ul>";
    }
    html += "<h2 style=\"font-size:1rem;margin:1rem 0 0.35rem\">Quizzes</h2>";
    if (!quizzes.length) {
      html += '<p class="cu-meta">No spark quiz results stored yet.</p>';
    } else {
      html += "<ul style=\"margin:0 0 0 1.1rem\">";
      quizzes.forEach(function (id) {
        var q = p.quizzes[id] || {};
        html +=
          "<li>" +
          id +
          " · " +
          (q.pass ? "passed" : "attempted") +
          " · " +
          (q.at || "") +
          "</li>";
      });
      html += "</ul>";
    }
    html += "<h2 style=\"font-size:1rem;margin:1rem 0 0.35rem\">Lab visits</h2>";
    if (!labs.length) {
      html += '<p class="cu-meta">No lab visits recorded on this device yet.</p>';
    } else {
      html += "<ul style=\"margin:0 0 0 1.1rem\">";
      labs.forEach(function (id) {
        html += "<li>" + id + " · " + ((p.labs[id] && p.labs[id].at) || "") + "</li>";
      });
      html += "</ul>";
    }
    html +=
      '<p class="cu-meta" style="margin-top:1rem">Local only · not a public grade of īmān · educational record only.</p>';
    root.innerHTML = html;
  }

  /* lab page ping */
  try {
    var path = (location.pathname || "");
    if (path.indexOf("/lab/") === 0) {
      var labId = path.replace(/\/+$/, "").split("/").pop() || "lab";
      recordLab(labId);
    }
  } catch (e) {}

  g.CuUniProgress = {
    load: load,
    save: save,
    recordModule: recordModule,
    recordQuiz: recordQuiz,
    recordLab: recordLab,
    paintTranscript: paintTranscript,
    KEY: KEY
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      load();
      paintTranscript();
    });
  } else {
    load();
    paintTranscript();
  }
})(window);
