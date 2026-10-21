/**
 * cu-campus-progress-v1.js — R1 bridge: Faculty/Bots/Grading → CuSeq single bus
 * If CuSeq present, module/stage truth is cu_uni_seq_v1 only.
 * Educational only — not a grade of īmān. Never Companion streaks.
 */
(function (g) {
  "use strict";
  if (g.__CU_CAMPUS_PROGRESS_V1__) return;
  g.__CU_CAMPUS_PROGRESS_V1__ = true;

  var FACULTY_KEY = "cu_uni_faculty_v1";
  var BOTS_KEY = "cu_uni_bots_v1";
  var REVIEW_KEY = "cu_uni_review_v1";

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

  function facultyDoneCount() {
    if (g.CuSeq && g.CuSeq.counts) {
      var c = g.CuSeq.counts();
      var n = 0;
      Object.keys(c).forEach(function (k) { n += c[k].done || 0; });
      return n;
    }
    var s = load(FACULTY_KEY, { lessons: {} });
    var n = 0;
    if (s.lessons) Object.keys(s.lessons).forEach(function (k) {
      if (s.lessons[k] && s.lessons[k].done) n++;
    });
    return n;
  }

  function markFacultyLesson(id) {
    if (g.CuSeq && g.CuSeq.markModuleDone) {
      /* map fac-* to stage first module if needed */
      var map = {
        "fac-seeker": "seeker.m1",
        "fac-practice": "practice.m1",
        "fac-consistency": "consistency.m1",
        "fac-transmission": "transmission.m1"
      };
      var mid = map[id] || id;
      if (String(mid).indexOf(".") >= 0) g.CuSeq.markModuleDone(mid);
    }
    var s = load(FACULTY_KEY, { lessons: {} });
    if (!s.lessons) s.lessons = {};
    s.lessons[id] = { done: true, at: new Date().toISOString() };
    save(FACULTY_KEY, s);
    return s;
  }

  function isFacultyDone(id) {
    if (g.CuSeq && g.CuSeq.isModuleDone) {
      var map = {
        "fac-seeker": "seeker.m1",
        "fac-practice": "practice.m1",
        "fac-consistency": "consistency.m1",
        "fac-transmission": "transmission.m1"
      };
      var mid = map[id] || id;
      if (String(mid).indexOf(".") >= 0) return g.CuSeq.isModuleDone(mid);
    }
    var s = load(FACULTY_KEY, { lessons: {} });
    return !!(s.lessons && s.lessons[id] && s.lessons[id].done);
  }

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
    var lines = [];
    if (g.CuSeq && g.CuSeq.counts) {
      var c = g.CuSeq.counts();
      var next = g.CuSeq.getNext();
      Object.keys(c).forEach(function (st) {
        lines.push(st + ": " + c[st].done + "/" + c[st].total + (c[st].unlocked ? "" : " (locked)"));
      });
      if (next && next.moduleId) lines.push("Next: " + next.moduleId);
      else lines.push("Sequence complete on this device");
    } else {
      lines.push("Sequential bus not loaded — open a desk page once.");
    }
    var s = botsState();
    s.it = { at: new Date().toISOString(), lines: lines };
    save(BOTS_KEY, s);
    pushLog("IT: checked sequential progress");
    return s;
  }
  function markOmStep() {
    if (g.CuSeq && g.CuSeq.getNext && g.CuSeq.markModuleDone) {
      var n = g.CuSeq.getNext();
      if (n && n.moduleId) {
        g.CuSeq.markModuleDone(n.moduleId);
        pushLog("O&M: marked " + n.moduleId);
        var s = botsState();
        s.om = { at: new Date().toISOString(), last: n.moduleId };
        save(BOTS_KEY, s);
        return { ok: true, id: n.moduleId };
      }
      return { ok: false, reason: "no next module" };
    }
    return { ok: false, reason: "seq bus missing" };
  }

  function reviewItem() {
    if (g.CuSeq && g.CuSeq.lastCompletedModule) {
      var last = g.CuSeq.lastCompletedModule();
      if (last && last.module)
        return {
          title: last.module.title || last.module.id,
          action: last.module.action || "Revisit the aim once today.",
          stage: last.stage
        };
    }
    return { title: "Seeker essentials", action: "Open Seeker and begin the first module.", stage: "seeker" };
  }

  function suggestNext() {
    if (g.CuSeq && g.CuSeq.getNext) {
      var n = g.CuSeq.getNext();
      if (n && n.moduleId)
        return {
          id: n.moduleId,
          href: g.CuSeq.deskHref(n.stage, n.moduleId),
          label: n.moduleId
        };
      return { id: null, href: "/campus/grading.html", label: "Sequence complete" };
    }
    return { id: null, href: "/campus/desk/seeker/", label: "Start Seeker" };
  }

  function stageSnapshot() {
    if (g.CuSeq && g.CuSeq.counts) return g.CuSeq.counts();
    return {};
  }

  g.CuCampusProgress = {
    facultyDoneCount: facultyDoneCount,
    markFacultyLesson: markFacultyLesson,
    isFacultyDone: isFacultyDone,
    setSecurityConfirmed: setSecurityConfirmed,
    runItCheck: runItCheck,
    markOmStep: markOmStep,
    botsState: botsState,
    pushLog: pushLog,
    reviewItem: reviewItem,
    suggestNext: suggestNext,
    stageSnapshot: stageSnapshot
  };
})(typeof window !== "undefined" ? window : this);
