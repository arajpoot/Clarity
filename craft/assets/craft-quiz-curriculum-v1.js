/*! craft-quiz-curriculum-v1 · C19QUIZ1
 * Sharia IQ Deep Studio — curriculum path + teach-then-check banks
 * Research-aligned: aqidah → pillars → worship fiqh → seerah → Quran literacy → adab
 * Educational only — not a fatwa · not a grade of īmān · verify with scholars / primary texts
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_QUIZ_CURR_V1__) return;
  w.__CRAFT_QUIZ_CURR_V1__ = true;

  var PATH_KEY = "clarity.craft.quiz.path.v1";
  var LOG_KEY = "clarity.craft.quiz.journal.v1";
  var MAX_SHOW = 5;

  /* Surprise: each level has a short “teach” card, then 5 checks */
  var LEVELS = [
    {
      id: "L0",
      title: "Orientation",
      blurb: "Why we learn · adab of knowledge · this is self-check only.",
      teach:
        "Seeking beneficial knowledge is an act of worship when done for Allāh. This studio is a mirror for review — not a certificate of īmān, and not a fatwa. When unsure, ask a qualified local scholar and return to the Qurʾān and authentic Sunnah.",
      need: 2,
      questions: [
        { q: "What is the primary purpose of this quiz studio?", opts: ["To issue fatwas", "Educational self-check only", "To rank īmān", "To replace a teacher"], a: 1, src: "Governance stamp · educational only — not a fatwa" },
        { q: "If a personal ruling is needed, what should you do?", opts: ["Trust any online quiz", "Ask a qualified local scholar", "Follow the highest score", "Ignore primary texts"], a: 1, src: "Classical adab of iftāʾ · educational overview" },
        { q: "Knowledge sought for Allāh’s sake is closest to…", opts: ["Argument for status", "Worship when practiced with sincerity", "Entertainment only", "Political identity"], a: 1, src: "Prophetic encouragement of beneficial knowledge · educational" }
      ]
    },
    {
      id: "L1",
      title: "ʿAqīdah foundations",
      blurb: "Six pillars of īmān · tawḥīd · educational overview.",
      teach:
        "Īmān includes belief in Allāh, His angels, His books, His messengers, the Last Day, and divine decree (qadar) — good and bad. Tawḥīd is singling out Allāh in Lordship, worship, and His names and attributes — without likening or denial. Details have scholarly nuance; this level only checks broad literacy.",
      need: 4,
      questions: [
        { q: "How many pillars of īmān are listed in the well-known ḥadīth of Jibrīl?", opts: ["Three", "Five", "Six", "Seven"], a: 2, src: "Ṣaḥīḥ Muslim · Ḥadīth of Jibrīl · educational summary" },
        { q: "Which is NOT one of the six pillars of īmān?", opts: ["Belief in the angels", "Belief in the Last Day", "Belief in democratic majorities", "Belief in the messengers"], a: 2, src: "Ḥadīth of Jibrīl · educational" },
        { q: "Tawḥīd, in the simplest classroom sense, means…", opts: ["Many gods with one chief", "Singling out Allāh alone", "Worship of saints with Allāh", "Rejecting all attributes"], a: 1, src: "Introductory ʿaqīdah primers · educational — not a sectarian brief" },
        { q: "Belief in qadar includes…", opts: ["Only pleasant events", "Good and bad decree from Allāh", "Human denial of responsibility", "Astrology as guidance"], a: 1, src: "Mainstream Sunni overview · educational" },
        { q: "The final messenger in Islamic belief is…", opts: ["Mūsā ﷺ", "ʿĪsā ﷺ", "Muḥammad ﷺ", "Ibrāhīm ﷺ"], a: 2, src: "Qurʾān 33:40 · educational" }
      ]
    },
    {
      id: "L2",
      title: "Five pillars of Islam",
      blurb: "Shahādah · ṣalāh · zakāh · ṣawm · ḥajj — practice literacy.",
      teach:
        "Islam is built on five: the testimony of faith, the five daily prayers, zakāh, fasting Ramaḍān, and ḥajj for those able. These are widely taught as the pillars of practice. Specific rulings differ by school — always verify with a teacher for your situation.",
      need: 4,
      questions: [
        { q: "How many pillars of Islam are classically listed?", opts: ["Three", "Four", "Five", "Six"], a: 2, src: "Ṣaḥīḥ al-Bukhārī & Muslim · pillars ḥadīth · educational" },
        { q: "What is the first pillar of Islam?", opts: ["Ṣalāh", "Shahādah (testimony of faith)", "Zakāh", "Ḥajj"], a: 1, src: "Agreed pillar order · educational" },
        { q: "How many obligatory (farḍ) prayers are there each day?", opts: ["Three", "Four", "Five", "Six"], a: 2, src: "Consensus overview · educational — not a fatwa" },
        { q: "Zakāh, in general terms, is…", opts: ["Optional gift only", "Obligatory alms on qualifying wealth", "A tax to any state", "Only for Ramaḍān"], a: 1, src: "Introductory fiqh literacy · educational" },
        { q: "Ḥajj is obligatory…", opts: ["Every year on everyone", "Once in a lifetime for those able", "Only for scholars", "Only in dreams"], a: 1, src: "Qurʾān 3:97 · educational overview" }
      ]
    },
    {
      id: "L3",
      title: "Ṭahārah & ṣalāh literacy",
      blurb: "Wuḍūʾ · prayer names · basic structure — still not a fatwa.",
      teach:
        "Prayer is the daily pillar most asked about. Literacy includes the five names (Fajr, Ẓuhr, ʿAṣr, Maghrib, ʿIshāʾ), that wuḍūʾ precedes ṣalāh when required, and that Al-Fātiḥah is central in each rakʿah. Exact invalidators and school differences need a living teacher.",
      need: 4,
      questions: [
        { q: "Which prayer is at dawn?", opts: ["ʿIshāʾ", "Fajr", "Ẓuhr", "Maghrib"], a: 1, src: "Prayer-time literacy · educational" },
        { q: "How many farḍ rakʿahs are in Fajr?", opts: ["Two", "Three", "Four", "One"], a: 0, src: "Common school teaching · educational — verify locally" },
        { q: "Al-Fātiḥah is…", opts: ["Optional in prayer", "Recited in each rakʿah of ṣalāh (standard teaching)", "Only for Jumuʿah", "Only in Ramaḍān"], a: 1, src: "Widespread fiqh teaching · educational" },
        { q: "Wuḍūʾ is generally required before…", opts: ["Sleeping only", "The ritual prayer when one is not in a state of purity", "Eating dates", "Travel only"], a: 1, src: "Introductory ṭahārah · educational — not a fatwa" },
        { q: "Maghrib is prayed…", opts: ["At noon", "After sunset", "At midnight only", "Before Fajr only"], a: 1, src: "Prayer-time literacy · educational" }
      ]
    },
    {
      id: "L4",
      title: "Ṣawm & zakāh awareness",
      blurb: "Ramaḍān · niṣāb idea · educational boundaries.",
      teach:
        "Ramaḍān fasting is obligatory on capable adult Muslims, from dawn to sunset, with known exemptions (e.g. illness, travel — details need a mufti). Zakāh has thresholds (niṣāb) and categories of recipients. This level only checks awareness, not calculation.",
      need: 3,
      questions: [
        { q: "In which month is obligatory fasting prescribed?", opts: ["Muḥarram only", "Ramaḍān", "Shawwāl only", "Dhul-Ḥijjah only"], a: 1, src: "Qurʾān 2:183–185 · educational" },
        { q: "A common classroom definition of niṣāb is…", opts: ["Any small coin", "A minimum threshold of wealth for zakāh liability", "A type of prayer", "A Makkah gate"], a: 1, src: "Introductory zakāh literacy · educational — not a calculation service" },
        { q: "Fasting in Ramaḍān generally means abstaining from…", opts: ["Only meat", "Food, drink, and marital relations from dawn to sunset", "Speaking entirely", "Sleep"], a: 1, src: "Introductory ṣawm literacy · educational" },
        { q: "Who may be excused from fasting (in principle)?", opts: ["Nobody ever", "Certain categories such as the ill or travelers — ask a scholar for your case", "Only children under 5", "Only the wealthy"], a: 1, src: "General fiqh overview · educational — not a personal ruling" }
      ]
    },
    {
      id: "L5",
      title: "Sīrah markers",
      blurb: "Key life stations of the Prophet ﷺ — literacy, not exhaustive history.",
      teach:
        "Knowing the broad outline of the Prophet’s ﷺ life strengthens love and context: birth in Makkah, revelation at 40, Ḥijrah to Madinah, major events such as Badr, and the Farewell Ḥajj. Details fill libraries; here we only touch markers.",
      need: 3,
      questions: [
        { q: "In which city was the Prophet ﷺ born?", opts: ["Madinah", "Makkah", "Ṭāʾif", "Jerusalem"], a: 1, src: "Sīrah literacy · educational" },
        { q: "The Ḥijrah was a migration to…", opts: ["Abyssinia only", "Madinah", "Ṭāʾif only", "Yemen"], a: 1, src: "Sīrah literacy · educational" },
        { q: "The first major battle after the Ḥijrah often named in primers is…", opts: ["Badr", "Yarmūk", "Qādisiyyah", "Ayn Jālūt"], a: 0, src: "Sīrah literacy · educational" },
        { q: "Revelation began when the Prophet ﷺ was about…", opts: ["20 years old", "40 years old", "60 years old", "15 years old"], a: 1, src: "Sīrah literacy · educational" }
      ]
    },
    {
      id: "L6",
      title: "Qurʾān & adab",
      blurb: "Structure literacy · manners of seeking knowledge.",
      teach:
        "The Qurʾān has 114 sūrahs; Al-Fātiḥah opens the muṣḥaf. Adab of knowledge includes sincerity, humility, verifying reports, and avoiding argumentation for ego. Quizzes never replace tadabbur or a teacher.",
      need: 3,
      questions: [
        { q: "How many sūrahs are in the Qurʾān?", opts: ["99", "114", "30", "7"], a: 1, src: "Muṣḥaf structure · educational" },
        { q: "Which sūrah is recited in every rakʿah of ṣalāh (standard teaching)?", opts: ["Al-Ikhlāṣ only", "Al-Fātiḥah", "Yā-Sīn only", "Al-Mulk only"], a: 1, src: "Prayer & Qurʾān literacy · educational" },
        { q: "A praiseworthy adab when unsure of a ruling is…", opts: ["Guess publicly", "Refer to qualified scholarship and primary sources", "Follow social media consensus", "Remain silent forever on all topics"], a: 1, src: "Adab of knowledge · educational" },
        { q: "The Qurʾān was revealed in…", opts: ["Latin", "Arabic", "Syriac only", "Persian"], a: 1, src: "Qurʾān 12:2 · educational" }
      ]
    }
  ];

  var path = {};
  var journal = [];
  var active = 0;
  var qi = 0;
  var locked = false;
  var sessionCorrect = 0;
  var sessionTotal = 0;

  function $(id) { return d.getElementById(id); }

  function load() {
    try { path = JSON.parse(localStorage.getItem(PATH_KEY) || "{}") || {}; } catch (e) { path = {}; }
    try {
      journal = JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
      if (!Array.isArray(journal)) journal = [];
    } catch (e2) { journal = []; }
  }
  function save() {
    try {
      localStorage.setItem(PATH_KEY, JSON.stringify(path));
      localStorage.setItem(LOG_KEY, JSON.stringify(journal.slice(0, 60)));
    } catch (e) {}
  }

  function level() { return LEVELS[active] || LEVELS[0]; }

  function status(msg) {
    var el = $("quiz-status");
    if (el) el.textContent = msg || "";
  }

  function renderPath() {
    var grid = $("qz-level-grid");
    if (!grid) return;
    grid.innerHTML = "";
    LEVELS.forEach(function (lv, idx) {
      var n = path[lv.id] || 0;
      var pct = Math.min(100, Math.round((n / Math.max(1, lv.need)) * 100));
      var b = d.createElement("button");
      b.type = "button";
      b.className = "cal-level-card" + (idx === active ? " active" : "");
      b.innerHTML =
        "<h4>" + lv.id + " · " + lv.title + "</h4>" +
        "<p>" + lv.blurb + "</p>" +
        '<div class="cal-lv-meter"><span style="width:' + pct + '%"></span></div>' +
        '<p style="margin-top:.3rem;font-size:.68rem;opacity:.8">' + n + " / " + lv.need + " sessions</p>";
      b.addEventListener("click", function () {
        active = idx;
        qi = 0;
        locked = false;
        sessionCorrect = 0;
        sessionTotal = 0;
        renderPath();
        renderTeach();
        renderQ();
        status("Path · " + lv.id + " " + lv.title);
      });
      grid.appendChild(b);
    });
    var stats = $("qz-stat-path");
    if (stats) {
      var done = LEVELS.filter(function (lv) { return (path[lv.id] || 0) >= lv.need; }).length;
      stats.textContent = done + "/" + LEVELS.length;
    }
    var sess = $("qz-stat-sessions");
    if (sess) sess.textContent = String(journal.length);
  }

  function renderTeach() {
    var el = $("qz-teach");
    var lv = level();
    if (!el || !lv) return;
    el.innerHTML =
      "<strong>" + lv.id + " · Teach card</strong>" +
      "<p class='panel-note' style='margin:.4rem 0 0'>" + lv.teach + "</p>" +
      "<p class='panel-note' style='margin:.35rem 0 0;opacity:.85'>Then answer the checks below — learning first, score second.</p>";
  }

  function renderQ() {
    var lv = level();
    var item = lv.questions[qi];
    var qEl = $("quiz-q");
    var oEl = $("quiz-opts");
    var fb = $("quiz-feedback");
    if (!item || !qEl || !oEl) return;
    locked = false;
    if (fb) fb.innerHTML = "";
    qEl.innerHTML =
      "<span class='panel-note'>" + lv.id + " · check " + (qi + 1) + " / " + lv.questions.length + "</span><br/>" +
      "<strong>" + item.q + "</strong>";
    oEl.innerHTML = "";
    item.opts.forEach(function (opt, idx) {
      var b = d.createElement("button");
      b.type = "button";
      b.className = "btn";
      b.style.display = "block";
      b.style.width = "100%";
      b.style.margin = ".35rem 0";
      b.style.textAlign = "start";
      b.textContent = opt;
      b.addEventListener("click", function () { answer(idx); });
      oEl.appendChild(b);
    });
    var prog = $("quiz-progress");
    if (prog) prog.textContent = "Session · " + sessionCorrect + " correct / " + sessionTotal + " answered";
  }

  function answer(idx) {
    if (locked) return;
    locked = true;
    var lv = level();
    var item = lv.questions[qi];
    if (!item) return;
    sessionTotal++;
    var ok = idx === item.a;
    if (ok) sessionCorrect++;
    var fb = $("quiz-feedback");
    if (fb) {
      fb.innerHTML =
        "<p><strong>" + (ok ? "Correct" : "Not quite") + "</strong> — " + item.opts[item.a] + "</p>" +
        "<p class='panel-note'>Source: " + item.src + "</p>" +
        "<p class='panel-note'>Educational only — not a fatwa · verify primary texts.</p>";
    }
    var prog = $("quiz-progress");
    if (prog) prog.textContent = "Session · " + sessionCorrect + " correct / " + sessionTotal + " answered";
  }

  function nextQ() {
    var lv = level();
    if (qi < lv.questions.length - 1) {
      qi++;
      renderQ();
      return;
    }
    /* complete level session */
    path[lv.id] = (path[lv.id] || 0) + 1;
    journal.unshift({
      when: new Date().toISOString().replace("T", " ").slice(0, 16),
      levelId: lv.id,
      title: lv.title,
      correct: sessionCorrect,
      total: sessionTotal
    });
    save();
    renderPath();
    renderJournal();
    status("Level session saved on-device · " + lv.id + " · educational only");
    sessionCorrect = 0;
    sessionTotal = 0;
    qi = 0;
    /* soft advance */
    if ((path[lv.id] || 0) >= lv.need && active < LEVELS.length - 1) {
      active++;
      status("Path unlocked next · " + level().id + " " + level().title);
    }
    renderTeach();
    renderQ();
  }

  function renderJournal() {
    var host = $("qz-practice-journal");
    if (!host) return;
    var rows = journal.slice(0, MAX_SHOW);
    if (!rows.length) {
      host.innerHTML = '<p class="panel-note">No curriculum sessions yet — finish a level’s checks to log.</p>';
      return;
    }
    var html = '<ul class="cal-journal-list">';
    rows.forEach(function (r) {
      html +=
        "<li><time>" + (r.when || "") + "</time> · <strong>" + (r.levelId || "") + "</strong> " +
        (r.title || "") + " · " + (r.correct || 0) + "/" + (r.total || 0) + "</li>";
    });
    html += "</ul>";
    if (journal.length > MAX_SHOW) {
      html +=
        '<button type="button" class="btn" id="qz-journal-expand">Show all ' + journal.length + " entries</button>";
    }
    host.innerHTML = html;
    var ex = $("qz-journal-expand");
    if (ex) {
      ex.addEventListener("click", function () {
        host.innerHTML =
          '<ul class="cal-journal-list">' +
          journal
            .map(function (r) {
              return (
                "<li><time>" + (r.when || "") + "</time> · <strong>" + (r.levelId || "") + "</strong> · " +
                (r.correct || 0) + "/" + (r.total || 0) + "</li>"
              );
            })
            .join("") +
          "</ul>";
      });
    }
  }

  function exportProgress() {
    var blob = new Blob(
      [JSON.stringify({ path: path, journal: journal, educational: true, exported: new Date().toISOString() }, null, 2)],
      { type: "application/json" }
    );
    var a = d.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "clarity-craft-quiz-progress-" + Date.now() + ".json";
    a.click();
  }

  function resetAll() {
    if (!w.confirm("Reset quiz path meters and journal on this device?")) return;
    path = {};
    journal = [];
    save();
    renderPath();
    renderJournal();
    status("Path & journal reset");
  }

  function inject() {
    if ($("qz-curriculum-root")) return;
    var main = d.querySelector("main.craft-main") || d.querySelector("main");
    if (!main) return;

    var flow = d.createElement("div");
    flow.className = "cal-flow";
    flow.innerHTML =
      '<span class="cal-flow-step"><strong>1</strong> Curriculum</span>' +
      '<span class="cal-flow-step"><strong>2</strong> Teach</span>' +
      '<span class="cal-flow-step"><strong>3</strong> Checks</span>' +
      '<span class="cal-flow-step"><strong>4</strong> Journal</span>';
    main.insertBefore(flow, main.firstChild);

    var curr = d.createElement("section");
    curr.className = "cal-glass tool-section";
    curr.id = "qz-curriculum-root";
    curr.innerHTML =
      "<h2>1 · Curriculum path</h2>" +
      '<p class="panel-note">Research-aligned literacy path: orientation → ʿaqīdah → pillars → ṭahārah/ṣalāh → ṣawm/zakāh → sīrah → Qurʾān &amp; adab. ' +
      "Meters count completed level sessions — practice signals only, not a grade of īmān.</p>" +
      '<div class="cal-stat-row">' +
      '<div class="cal-stat-card"><span>Sessions</span><strong id="qz-stat-sessions">0</strong></div>' +
      '<div class="cal-stat-card"><span>Levels ready</span><strong id="qz-stat-path">0/7</strong></div>' +
      "</div>" +
      '<div class="cal-level-grid" id="qz-level-grid"></div>';

    var teach = d.createElement("section");
    teach.className = "cal-glass tool-section";
    teach.id = "qz-teach-root";
    teach.innerHTML = "<h2>2 · Teach card</h2><div id='qz-teach'></div>";

    /* reuse existing quiz-stage if present */
    var stage = $("quiz-stage");
    if (stage) {
      var h = d.createElement("h2");
      h.textContent = "3 · Checks";
      stage.parentNode.insertBefore(h, stage);
    }

    var journalSec = d.createElement("section");
    journalSec.className = "cal-glass tool-section";
    journalSec.innerHTML =
      "<h2>4 · Practice journal</h2>" +
      '<p class="panel-note">Showing <strong>5 most recent</strong> curriculum sessions · on-device only.</p>' +
      '<div style="display:flex;flex-wrap:wrap;gap:.4rem;margin:.4rem 0">' +
      '<button type="button" class="btn primary" id="qz-export">Download progress JSON</button>' +
      '<button type="button" class="btn" id="qz-reset">Reset path &amp; journal</button>' +
      "</div>" +
      '<div id="qz-practice-journal"></div>';

    var note = $("gov-quiz-note");
    if (note && note.parentNode) {
      note.parentNode.insertBefore(curr, note.nextSibling);
      curr.parentNode.insertBefore(teach, curr.nextSibling);
    } else {
      main.insertBefore(curr, main.firstChild.nextSibling);
      main.insertBefore(teach, curr.nextSibling);
    }
    main.appendChild(journalSec);

    var next = $("quiz-next");
    if (next) {
      next.addEventListener("click", nextQ);
    } else {
      var actions = stage && stage.querySelector(".studio-actions");
      if (actions) {
        var b = d.createElement("button");
        b.type = "button";
        b.className = "btn primary";
        b.id = "quiz-next";
        b.textContent = "Next check";
        b.addEventListener("click", nextQ);
        actions.appendChild(b);
      }
    }

    $("qz-export").addEventListener("click", exportProgress);
    $("qz-reset").addEventListener("click", resetAll);
  }

  function boot() {
    load();
    inject();
    renderPath();
    renderTeach();
    renderQ();
    renderJournal();
    status("Curriculum ready · teach card first · educational only");
  }

  w.CraftQuizCurriculum = { levels: LEVELS };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(boot, 200); });
})(window, document);
