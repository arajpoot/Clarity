/* Campus utils — progress UX + export (merged) */

/* PRIORITY3 — Reset + progress UX (plaque companion) */
(function (g) {
  "use strict";
  if (g.__CLARITY_PROGRESS_UX_V1__) return;
  g.__CLARITY_PROGRESS_UX_V1__ = true;

  var PHASE_KEY = "clarity_curriculum_phase_v1";
  var QUIZ_PASS_KEY = "clarity_phase_quiz_pass_v1";
  var PROGRESS_KEYS = [
    "clarity_junior_progress_v1",
    "clarity_junior_high_progress_v1",
    "clarity_daily_hs_progress_v1",
    "clarity_dai_progress_v1",
    "clarity_university_diplomas_v1",
    "clarity_path_unlocked_max",
    "clarity_quiz_passed_v1",
    "clarity_path_quiz_done",
    QUIZ_PASS_KEY
  ];

  function phase() {
    try {
      return Math.max(1, Math.min(4, parseInt(localStorage.getItem(PHASE_KEY) || "1", 10) || 1));
    } catch (e) {
      return 1;
    }
  }

  function readProgressKey(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "{}") || {};
    } catch (e) {
      return {};
    }
  }

  function countDone(obj) {
    var n = 0;
    Object.keys(obj || {}).forEach(function (k) {
      if (obj[k] && (obj[k].done || obj[k] === true)) n++;
    });
    return n;
  }

  function stats() {
    var keys = [
      ["Junior", "clarity_junior_progress_v1"],
      ["New Muslim", "clarity_junior_high_progress_v1"],
      ["Daily", "clarity_daily_hs_progress_v1"],
      ["Da'i", "clarity_dai_progress_v1"]
    ];
    return keys.map(function (pair) {
      var o = readProgressKey(pair[1]);
      var done = countDone(o);
      return { label: pair[0], done: done, key: pair[1] };
    });
  }

  function renderProgressStrip() {
    var host =
      document.getElementById("clarity-progress-strip") ||
      document.querySelector("[data-clarity-phase-plaque], #clarity-phase-plaque, .clarity-phase-plaque");
    if (!host) return;
    var el = document.getElementById("clarity-progress-ux");
    if (!el) {
      el = document.createElement("div");
      el.id = "clarity-progress-ux";
      el.setAttribute("role", "status");
      el.style.cssText =
        "font-size:0.78rem;opacity:0.95;margin:0.35rem 0 0;text-align:center;line-height:1.4;width:100%";
      host.appendChild(el);
    }
    var st = stats();
    var ph = phase();
    var parts = st.map(function (s, i) {
      var mark = i + 1 === ph ? "▸ " : "";
      return mark + s.label + ": " + s.done + " done";
    });
    el.textContent = "Phase " + ph + "/4 · " + parts.join(" · ");
  }

  function fullReset() {
    if (
      !g.confirm(
        "Clear local study progress on this device?\n\nThis resets phases, module checkmarks, quizzes, and local diploma records. It does not affect notes encrypted in Amanah Vault."
      )
    ) {
      return;
    }
    try {
      PROGRESS_KEYS.forEach(function (k) {
        localStorage.removeItem(k);
      });
      localStorage.setItem(PHASE_KEY, "1");
      localStorage.setItem("clarity_path_focus", "seeker");
      localStorage.setItem("clarity_committed_path", "seeker");
      localStorage.setItem("clarity_path_unlocked_max", "0");
      localStorage.setItem("clarity_quiz_passed_v1", "{}");
      document.documentElement.setAttribute("data-path-i", "0");
      document.documentElement.setAttribute("data-clarity-path", "seeker");
    } catch (e) {}
    try {
      if (typeof g.clarityPathResetToSeeker === "function") g.clarityPathResetToSeeker();
    } catch (e2) {}
    try {
      g.dispatchEvent(new CustomEvent("clarity-path-changed", { detail: { path: "seeker", pathI: 0 } }));
      g.dispatchEvent(new CustomEvent("clarity-curriculum-reset", { detail: { phase: 1 } }));
    } catch (e3) {}
    renderProgressStrip();
    try {
      g.alert("Progress cleared on this device. You are back at Phase 1 (Junior / Seeker).");
    } catch (e4) {}
  }

  g.clarityFullCurriculumReset = fullReset;
  g.clarityRenderProgressUX = renderProgressStrip;

  document.addEventListener(
    "click",
    function (ev) {
      var t = ev.target;
      if (!t || !t.closest) return;
      if (t.closest("#clarity-path-reset-btn, .cgs-reset, [data-clarity-reset], .cpp-reset")) {
        ev.preventDefault();
        ev.stopPropagation();
        fullReset();
      }
    },
    true
  );

  function boot() {
    renderProgressStrip();
    setTimeout(renderProgressStrip, 400);
    setTimeout(renderProgressStrip, 1200);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("load", function () {
    setTimeout(renderProgressStrip, 200);
  });
  g.addEventListener("clarity-path-changed", function () {
    setTimeout(renderProgressStrip, 50);
  });
  g.addEventListener("clarity-diploma-issued", function () {
    setTimeout(renderProgressStrip, 50);
  });
})(typeof window !== "undefined" ? window : this);


/* PRIORITY6 — export local study summary (this device only) */
(function (g) {
  "use strict";
  if (g.__CLARITY_EXPORT_PROGRESS_V1__) return;
  g.__CLARITY_EXPORT_PROGRESS_V1__ = true;
  g.clarityExportStudySummary = function () {
    var lines = [
      "Clarity — local study summary (this device only)",
      "Not a formal diploma or accreditation. Educational record only.",
      "Generated: " + new Date().toISOString(),
      ""
    ];
    try {
      lines.push("Phase: " + (localStorage.getItem("clarity_curriculum_phase_v1") || "1"));
      lines.push("Path focus: " + (localStorage.getItem("clarity_path_focus") || "seeker"));
      lines.push("Diplomas/records JSON: " + (localStorage.getItem("clarity_university_diplomas_v1") || "{}"));
    } catch (e) {}
    var blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "clarity-study-summary.txt";
    a.click();
    setTimeout(function () { try { URL.revokeObjectURL(a.href); } catch (e) {} }, 1000);
  };
})(typeof window !== "undefined" ? window : this);

