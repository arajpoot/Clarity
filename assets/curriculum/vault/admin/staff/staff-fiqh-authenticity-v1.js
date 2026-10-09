/* Admin Staff — Authenticity Clerk (fiqh-safe tone)
 * Ensures modules keep educational disclaimers, avoid fatwa posture,
 * and point learners to qualified local scholarship when needed.
 * Does NOT judge Islamic rulings — only content hygiene flags.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_STAFF_FIQH__) return;
  g.__CLARITY_STAFF_FIQH__ = true;

  var REPORT_KEY = "clarity_staff_fiqh_report_v1";
  var state = { id: "fiqh", name: "Authenticity Clerk", scans: 0, flags: [] };

  var REQUIRED_PHRASES = [
    /educational only/i,
    /not a fatwa/i,
    /not a (formal )?ijazah/i,
    /teacher/i
  ];
  var RISK_PHRASES = [
    /this is a binding ruling/i,
    /you must follow this madhhab only/i,
    /ignore all scholars/i,
    /fatwa of this app/i,
    /definitive hukm without scholar/i
  ];

  function scanText(label, text) {
    var flags = [];
    var t = String(text || "");
    if (!t) return flags;
    RISK_PHRASES.forEach(function (re) {
      if (re.test(t)) flags.push({ level: "risk", label: label, rule: String(re), sample: t.slice(0, 80) });
    });
    return flags;
  }

  function scanLesson(phase, lesson) {
    var flags = [];
    var blob =
      (lesson.title || "") +
      " " +
      (lesson.points || []).join(" ") +
      " " +
      ((lesson.activity && lesson.activity.prompt) || "") +
      " " +
      ((lesson.video && lesson.video.note) || "");
    flags = flags.concat(scanText("P" + phase + ":" + (lesson.id || "?"), blob));
    /* Encourage teacher pointer on practice-heavy openCards */
    if (lesson.openCard && /salah|fiqh|wudu|prayer/i.test(lesson.openCard + blob)) {
      if (!/teacher|local scholar|qualified/i.test(blob)) {
        flags.push({
          level: "advise",
          label: lesson.id,
          rule: "practice-module-teacher-hint",
          sample: "Practice module should mention verifying with a teacher"
        });
      }
    }
    return flags;
  }

  function scanTrack(apiName, phase) {
    var track = g[apiName];
    if (!track || !track.UNITS) return [];
    var flags = [];
    (track.UNITS || []).forEach(function (u) {
      (u.lessons || []).forEach(function (les) {
        flags = flags.concat(scanLesson(phase, les));
      });
    });
    return flags;
  }

  function scanGlobalDisclaimer() {
    var flags = [];
    var nodes = document.querySelectorAll(
      ".card-lead, .cdc-disclaimer, .curriculum-video-note, .junior-lock-hint, .cpq-lead, .csq-lead"
    );
    var hasEdu = false;
    nodes.forEach(function (n) {
      var t = n.textContent || "";
      if (/educational only|not a fatwa/i.test(t)) hasEdu = true;
      flags = flags.concat(scanText("dom", t));
    });
    if (!hasEdu) {
      flags.push({
        level: "advise",
        label: "ui",
        rule: "visible-disclaimer",
        sample: "No visible educational-only disclaimer in view"
      });
    }
    return flags;
  }

  function runScan() {
    state.scans += 1;
    var flags = [];
    flags = flags.concat(scanTrack("ClarityJuniorCurriculum", 1));
    flags = flags.concat(scanTrack("ClarityJuniorHighCurriculum", 2));
    flags = flags.concat(scanTrack("ClarityDailyHsCurriculum", 3));
    flags = flags.concat(scanTrack("ClarityDaiUniversity", 4));
    flags = flags.concat(scanGlobalDisclaimer());
    state.flags = flags;
    try {
      localStorage.setItem(
        REPORT_KEY,
        JSON.stringify({ at: Date.now(), flags: flags, scans: state.scans })
      );
    } catch (e) {}
    var risks = flags.filter(function (f) {
      return f.level === "risk";
    });
    try {
      console.info(
        "%c Authenticity Clerk ",
        "background:#6b3a1a;color:#f0e6c8",
        "scan",
        state.scans,
        "flags",
        flags.length,
        "risks",
        risks.length
      );
    } catch (e2) {}
    try {
      g.dispatchEvent(new CustomEvent("clarity-staff-fiqh", { detail: { flags: flags } }));
    } catch (e3) {}
    return flags;
  }

  g.ClarityStaffFiqh = {
    runScan: runScan,
    state: function () {
      return state;
    },
    report: function () {
      try {
        return JSON.parse(localStorage.getItem(REPORT_KEY) || "null");
      } catch (e) {
        return null;
      }
    }
  };

  function boot() {
    setTimeout(runScan, 2000);
    setInterval(runScan, 120000);
  }
  g.addEventListener("clarity-vault-ready", function () {
    setTimeout(runScan, 500);
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
