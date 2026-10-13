/* Lab portfolio — student log → O&M assist review → teacher score → transcript
 * Educational UX only — on-device, not a real credential
 */
(function (g) {
  "use strict";
  if (g.__CU_LAB_PORTFOLIO_V1__) return;
  g.__CU_LAB_PORTFOLIO_V1__ = true;

  var KEY_SUB = "cu_lab_submissions_v1";
  var KEY_TX = "cu_lab_transcript_v1";

  function load(k) {
    try {
      return JSON.parse(localStorage.getItem(k) || "[]") || [];
    } catch (e) {
      return [];
    }
  }
  function save(k, arr) {
    try {
      localStorage.setItem(k, JSON.stringify(arr.slice(0, 80)));
    } catch (e) {}
  }
  function id() {
    return "lab_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 7);
  }

  function submit(entry) {
    /* entry: { station, title, note, meta } */
    var row = {
      id: id(),
      at: Date.now(),
      station: entry.station || "lab",
      title: entry.title || "Lab practice",
      note: (entry.note || "").slice(0, 400),
      meta: entry.meta || {},
      status: "submitted", /* submitted | om_reviewed | scored */
      omReport: null,
      score: null,
      teacherNote: null
    };
    var arr = load(KEY_SUB);
    arr.unshift(row);
    save(KEY_SUB, arr);
    try {
      g.dispatchEvent(new CustomEvent("cu-lab-submitted", { detail: row }));
    } catch (e) {}
    return row;
  }

  function list() {
    return load(KEY_SUB);
  }
  function pendingOm() {
    return load(KEY_SUB).filter(function (x) {
      return x.status === "submitted";
    });
  }
  function pendingTeacher() {
    return load(KEY_SUB).filter(function (x) {
      return x.status === "om_reviewed";
    });
  }

  function omReview(subId, report) {
    var arr = load(KEY_SUB);
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id === subId) {
        arr[i].status = "om_reviewed";
        arr[i].omReport = {
          at: Date.now(),
          by: "O&M Lab Assistant (on-device)",
          summary: (report.summary || "").slice(0, 300),
          checklist: report.checklist || {},
          recommend: report.recommend || "ready_for_teacher"
        };
        save(KEY_SUB, arr);
        try {
          g.dispatchEvent(new CustomEvent("cu-lab-om-reviewed", { detail: arr[i] }));
        } catch (e) {}
        return arr[i];
      }
    }
    return null;
  }

  function teacherScore(subId, score, note) {
    var arr = load(KEY_SUB);
    var sc = Math.max(0, Math.min(100, parseInt(score, 10) || 0));
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id === subId) {
        arr[i].status = "scored";
        arr[i].score = sc;
        arr[i].teacherNote = (note || "").slice(0, 300);
        arr[i].scoredAt = Date.now();
        arr[i].teacher = "Lab Director · Ustadh Itqan (educational persona)";
        save(KEY_SUB, arr);
        /* transcript */
        var tx = load(KEY_TX);
        tx.unshift({
          id: arr[i].id,
          at: Date.now(),
          station: arr[i].station,
          title: arr[i].title,
          score: sc,
          note: arr[i].teacherNote,
          om: arr[i].omReport && arr[i].omReport.summary
        });
        save(KEY_TX, tx);
        try {
          g.dispatchEvent(new CustomEvent("cu-lab-scored", { detail: arr[i] }));
        } catch (e) {}
        return arr[i];
      }
    }
    return null;
  }

  function transcript() {
    return load(KEY_TX);
  }

  g.ClarityLabPortfolio = {
    submit: submit,
    list: list,
    pendingOm: pendingOm,
    pendingTeacher: pendingTeacher,
    omReview: omReview,
    teacherScore: teacherScore,
    transcript: transcript
  };
})(typeof window !== "undefined" ? window : this);
