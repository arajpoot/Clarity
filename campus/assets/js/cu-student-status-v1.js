/**
 * Clarity University — Student status spine (T0)
 * Local-only · educational · not affiliated with Al-Azhar · not a fatwa
 */
(function (g) {
  "use strict";
  if (g.__CU_STUDENT_STATUS_V1__) return;
  g.__CU_STUDENT_STATUS_V1__ = true;

  var PHASES = [
    { id: "seeker", label: "Seeker", href: "/campus/desk/seeker/", sub: "Foundations · belief" },
    { id: "practice", label: "Practice", href: "/campus/desk/practice/", sub: "Skills after foundations" },
    { id: "consistency", label: "Consistency", href: "/campus/desk/consistency/", sub: "Steady craft & review" },
    { id: "transmission", label: "Transmission", href: "/campus/desk/transmission/", sub: "Share with adab & sources" }
  ];

  function readJSON(key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key) || "null");
      return v == null ? fallback : v;
    } catch (e) {
      return fallback;
    }
  }

  function admitName() {
    var a = readJSON("cu_uni_admit_v1", null) || readJSON("clarity_admit_v1", null);
    if (!a) return "";
    if (typeof a === "string") return a;
    return a.name || a.fullName || a.studentName || "";
  }

  function currentPhaseId() {
    return (
      localStorage.getItem("clarity_curriculum_phase_v1") ||
      localStorage.getItem("cu_uni_phase_v1") ||
      "seeker"
    );
  }

  function progressFor(phaseId) {
    var prog = readJSON("cu_uni_progress_v1", {}) || {};
    var p = prog[phaseId] || prog[phaseId + "_modules"] || {};
    var done = 0;
    var total = 0;
    if (Array.isArray(p.completed)) {
      done = p.completed.length;
      total = p.total || Math.max(done, 12);
    } else if (typeof p === "object") {
      var keys = Object.keys(p).filter(function (k) {
        return p[k] === true || p[k] === "done" || (p[k] && p[k].done);
      });
      done = keys.length;
      total = Math.max(done, 12);
    }
    // desk module flags
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf("cu_" + phaseId) === 0 && /done|complete/i.test(k)) done++;
      }
    } catch (e) {}
    return { done: done, total: total || 12 };
  }

  function phaseMeta(id) {
    for (var i = 0; i < PHASES.length; i++) if (PHASES[i].id === id) return PHASES[i];
    return PHASES[0];
  }

  function getStatus() {
    var id = currentPhaseId();
    var meta = phaseMeta(id);
    var pr = progressFor(id);
    return {
      name: admitName(),
      phaseId: id,
      phaseLabel: meta.label,
      phaseSub: meta.sub,
      href: meta.href,
      done: pr.done,
      total: pr.total
    };
  }

  function renderInto(el) {
    if (!el) return;
    var s = getStatus();
    var nameLine = s.name
      ? '<div class="cu-st-name">Student · <strong>' + escapeHtml(s.name) + "</strong></div>"
      : '<div class="cu-st-name cu-meta">On-device learner · <a href="/charter/">Charter admission</a> optional</div>';
    el.innerHTML =
      '<div class="cu-student-status" role="status">' +
      nameLine +
      '<div class="cu-st-row">' +
      "<div><strong>" +
      escapeHtml(s.phaseLabel) +
      "</strong> · " +
      escapeHtml(s.phaseSub) +
      "<br/><span class=\"cu-meta\">Progress on this device · " +
      s.done +
      " recorded</span></div>" +
      '<a class="cu-st-go" href="' +
      s.href +
      '">Continue →</a>' +
      "</div>" +
      '<p class="cu-meta cu-st-disclaimer">Educational path only · not affiliated with Al-Azhar · not a fatwa · not a grade of īmān</p>' +
      "</div>";
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function boot() {
    document.querySelectorAll("[data-cu-student-status]").forEach(renderInto);
  }

  g.CuStudentStatus = {
    get: getStatus,
    render: renderInto,
    phases: PHASES,
    progressFor: progressFor
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window);
