/**
 * University progress bus — Faculty · Bots · Grading
 * Keys stay under cu_uni_* only. Never Companion streaks.
 * Educational only — not a grade of īmān.
 */
(function (g) {
  "use strict";
  if (g.__CU_CAMPUS_PROGRESS_V1__) return;
  g.__CU_CAMPUS_PROGRESS_V1__ = true;

  var FACULTY_KEY = "cu_uni_faculty_v1";
  var BOTS_KEY = "cu_uni_bots_v1";
  var REVIEW_KEY = "cu_uni_review_v1";
  var OM_STEPS_KEY = "cu_uni_om_steps_v1";

  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var o = JSON.parse(raw);
      return o && typeof o === "object" ? o : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function save(key, obj) {
    try {
      localStorage.setItem(key, JSON.stringify(obj));
    } catch (e) {}
  }

  /* —— Faculty —— */
  function facultyState() {
    return load(FACULTY_KEY, { lessons: {} });
  }
  function markFacultyLesson(id) {
    var s = facultyState();
    if (!s.lessons) s.lessons = {};
    s.lessons[id] = { done: true, at: new Date().toISOString() };
    save(FACULTY_KEY, s);
    return s;
  }
  function isFacultyDone(id) {
    var s = facultyState();
    return !!(s.lessons && s.lessons[id] && s.lessons[id].done);
  }
  function facultyDoneCount() {
    var s = facultyState();
    var n = 0;
    if (s.lessons) {
      Object.keys(s.lessons).forEach(function (k) {
        if (s.lessons[k] && s.lessons[k].done) n++;
      });
    }
    return n;
  }

  /* —— Bots —— */
  function botsState() {
    return load(BOTS_KEY, { security: null, it: null, om: null, log: [] });
  }
  function pushLog(msg) {
    var s = botsState();
    if (!Array.isArray(s.log)) s.log = [];
    s.log.unshift({ t: new Date().toISOString(), m: String(msg || "") });
    if (s.log.length > 40) s.log = s.log.slice(0, 40);
    save(BOTS_KEY, s);
    return s;
  }
  function setSecurityConfirmed() {
    var s = botsState();
    s.security = { confirmed: true, at: new Date().toISOString() };
    save(BOTS_KEY, s);
    pushLog("Security: device-only checklist confirmed");
    return s;
  }
  function runItCheck() {
    var desk = 0;
    try {
      var p = JSON.parse(localStorage.getItem("clarity_junior_progress_v1") || "{}");
      if (p && p.modules) desk = Object.keys(p.modules).filter(function (k) {
        return p.modules[k] && (p.modules[k] === true || p.modules[k].done);
      }).length;
      else if (p) {
        Object.keys(p).forEach(function (k) {
          if (k === "modules") return;
          if (p[k] === true || (p[k] && p[k].done)) desk++;
        });
      }
    } catch (e) {}
    var fac = facultyDoneCount();
    var admit = null;
    try {
      admit = JSON.parse(localStorage.getItem("cu_uni_admit_v1") || "null");
    } catch (e) {}
    var report = {
      at: new Date().toISOString(),
      deskModules: desk,
      facultyLessons: fac,
      registered: !!(admit && admit.name),
      name: (admit && admit.name) || null
    };
    var s = botsState();
    s.it = report;
    save(BOTS_KEY, s);
    pushLog("IT: offline pack — desk " + desk + ", faculty " + fac + (report.registered ? ", registered" : ""));
    return report;
  }
  function markOmStep() {
    var steps = load(OM_STEPS_KEY, { count: 0, last: null });
    steps.count = (steps.count || 0) + 1;
    steps.last = new Date().toISOString();
    save(OM_STEPS_KEY, steps);
    var s = botsState();
    s.om = { count: steps.count, at: steps.last };
    save(BOTS_KEY, s);
    pushLog("O&M: phase step marked (" + steps.count + ")");
    return steps;
  }
  function omStepCount() {
    var steps = load(OM_STEPS_KEY, { count: 0 });
    return steps.count || 0;
  }

  /* —— Review / grading —— */
  function reviewState() {
    return load(REVIEW_KEY, { items: {}, last: null });
  }
  function markReview(id) {
    var s = reviewState();
    if (!s.items) s.items = {};
    s.items[id] = { done: true, at: new Date().toISOString() };
    s.last = id;
    save(REVIEW_KEY, s);
    return s;
  }
  function reviewDoneCount() {
    var s = reviewState();
    var n = 0;
    if (s.items) {
      Object.keys(s.items).forEach(function (k) {
        if (s.items[k] && s.items[k].done) n++;
      });
    }
    return n;
  }

  function currentStage() {
    try {
      var ph = localStorage.getItem("clarity_curriculum_phase_v1") || "seeker";
      var map = {
        seeker: "Seeker · Foundations",
        practice: "Practice",
        consistency: "Consistency",
        transmission: "Transmission"
      };
      return map[ph] || "Seeker · Foundations";
    } catch (e) {
      return "Seeker · Foundations";
    }
  }

  function campusProgressPercent() {
    var fac = facultyDoneCount();
    var om = omStepCount();
    var rev = reviewDoneCount();
    var desk = 0;
    try {
      var p = JSON.parse(localStorage.getItem("clarity_junior_progress_v1") || "{}");
      if (p && p.modules) {
        desk = Object.keys(p.modules).filter(function (k) {
          return p.modules[k] && (p.modules[k] === true || p.modules[k].done);
        }).length;
      }
    } catch (e) {}
    // soft ceiling for mirror only
    var score = Math.min(100, fac * 12 + om * 8 + rev * 10 + Math.min(desk, 6) * 5);
    return score;
  }

  function suggestedNext() {
    if (!isFacultyDone("fac-tawhid")) {
      return { label: "Faculty · Tawḥīd orientation", href: "/campus/faculty.html#fac-tawhid" };
    }
    if (!isFacultyDone("fac-practice")) {
      return { label: "Faculty · One skill drill", href: "/campus/faculty.html#fac-practice" };
    }
    var desk = 0;
    try {
      var p = JSON.parse(localStorage.getItem("clarity_junior_progress_v1") || "{}");
      if (p && p.modules) {
        desk = Object.keys(p.modules).filter(function (k) {
          return p.modules[k] && (p.modules[k] === true || p.modules[k].done);
        }).length;
      }
    } catch (e) {}
    if (desk < 1) {
      return { label: "Seeker desk · first module", href: "/campus/desk/seeker/" };
    }
    return { label: "Lab · one short station", href: "/lab/" };
  }

  g.CuCampusProgress = {
    facultyState: facultyState,
    markFacultyLesson: markFacultyLesson,
    isFacultyDone: isFacultyDone,
    facultyDoneCount: facultyDoneCount,
    botsState: botsState,
    setSecurityConfirmed: setSecurityConfirmed,
    runItCheck: runItCheck,
    markOmStep: markOmStep,
    omStepCount: omStepCount,
    pushLog: pushLog,
    markReview: markReview,
    reviewDoneCount: reviewDoneCount,
    reviewState: reviewState,
    currentStage: currentStage,
    campusProgressPercent: campusProgressPercent,
    suggestedNext: suggestedNext,
    KEYS: { FACULTY_KEY: FACULTY_KEY, BOTS_KEY: BOTS_KEY, REVIEW_KEY: REVIEW_KEY, OM_STEPS_KEY: OM_STEPS_KEY }
  };
})(window);
