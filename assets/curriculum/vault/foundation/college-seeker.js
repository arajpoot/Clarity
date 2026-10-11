/* Clarity Junior Curriculum (Seeker) v2 — sequential modules
 * Phase curriculum: first module only → checkmark unlocks next
 * All modules complete → phase quiz popup before next phase
 * Educational only — not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_JUNIOR_CURRICULUM_V2__) return;
  g.__CLARITY_JUNIOR_CURRICULUM_V2__ = true;
  g.__CLARITY_JUNIOR_CURRICULUM_V1__ = true;

  var PROGRESS_KEY = "clarity_junior_progress_v1";
  var PHASE_KEY = "clarity_curriculum_phase_v1";

  var UNITS = [
    /* Nur Path Junior — sequence inspired by foundational tracks at
       Islamic University of Madinah (Tawhid, Quran sciences, Hadith intro,
       Fiqh of worship) and Al-Azhar Ushuluddin/Sharia first principles.
       Educational companion only — not a fatwa. Verify with scholars. */
    {
      id: "u1-tawhid",
      title: "Unit 1 — Tawhid (Creed foundations)",
      goal: "Know Allah is One — the heart of every sound Islamic path (Madinah Aqidah 1 · Azhar Aqidah).",
      lessons: [
        {
          id: "u1-l1",
          title: "Allah is One — nothing is like Him",
          minutes: 12,
          points: [
            "Tawhid: worship Allah alone, without partners.",
            "Surah al-Ikhlas teaches He is One, Self-Sufficient, without equal.",
            "Junior practice: say Lā ilāha illā Allāh with presence of heart."
          ],
          ayah: { ref: "Qur'an 112:1-4", en: "Say: He is Allah, One. Allah, the Self-Sufficient…" },
          deepLearn: [
            { label: "Qur'an 112 (quran.com)", href: "https://quran.com/112" },
            { label: "Qur'an 2:163", href: "https://quran.com/2/163" }
          ],
          links: [{ label: "Qur'an 112", href: "https://quran.com/112" }]
        },
        {
          id: "u1-l2",
          title: "Names and knowledge of Allah",
          minutes: 12,
          points: [
            "Allah sees and knows what is open and what is hidden.",
            "He is closer in knowledge and care than the jugular vein.",
            "Call upon Him by His beautiful names with humility."
          ],
          ayah: { ref: "Qur'an 50:16", en: "We are closer to him than his jugular vein." },
          deepLearn: [
            { label: "Qur'an 50:16", href: "https://quran.com/50/16" },
            { label: "Qur'an 59:22-24", href: "https://quran.com/59/22-24" }
          ],
          links: [{ label: "Qur'an 50:16", href: "https://quran.com/50/16" }]
        },
        {
          id: "u1-l3",
          title: "Six pillars of iman (map)",
          minutes: 14,
          points: [
            "1) Allah  2) Angels  3) Books  4) Messengers  5) Last Day  6) Qadar",
            "This map is the classical creed outline taught in beginner tracks.",
            "Depth comes module by module — do not rush."
          ],
          ayah: { ref: "Qur'an 4:136", en: "Believe in Allah, His Messenger, the Book…" },
          deepLearn: [
            { label: "Qur'an 4:136", href: "https://quran.com/4/136" },
            { label: "BeginIslam — faith overview", href: "https://beginislam.org/" }
          ],
          links: [{ label: "Qur'an 4:136", href: "https://quran.com/4/136" }]
        }
      ]
    },
    {
      id: "u2-quran",
      title: "Unit 2 — Qur'an: recitation & respect",
      goal: "Honour the Book — tilawah manners and a first taste of Ulum al-Quran (Madinah Quran 1 · Azhar Quran studies).",
      lessons: [
        {
          id: "u2-l1",
          title: "Adab with the Qur'an",
          minutes: 12,
          points: [
            "The Qur'an is the speech of Allah — approach with wudu when you can, and with humility always.",
            "Seek refuge from Shaytan before reciting.",
            "Junior goal: recite short surahs slowly and correctly."
          ],
          ayah: { ref: "Qur'an 16:98", en: "When you recite the Qur'an, seek refuge in Allah from Satan…" },
          deepLearn: [
            { label: "Qur'an 16:98", href: "https://quran.com/16/98" },
            { label: "Qur'an 73:4 (tartil)", href: "https://quran.com/73/4" }
          ],
          links: [{ label: "Qur'an 16:98", href: "https://quran.com/16/98" }]
        },
        {
          id: "u2-l2",
          title: "Al-Fatiha — the opening",
          minutes: 14,
          points: [
            "Al-Fatiha is recited in every unit of prayer.",
            "It is praise, guidance-seeking, and the path of those favoured — not of those under anger or astray.",
            "Memorize with meaning, not only sound."
          ],
          ayah: { ref: "Qur'an 1:1-7", en: "In the name of Allah… Guide us to the straight path." },
          deepLearn: [
            { label: "Qur'an 1 — al-Fatiha", href: "https://quran.com/1" },
            { label: "Tafsir aid (quran.com)", href: "https://quran.com/1?translations=20" }
          ],
          links: [{ label: "Qur'an 1", href: "https://quran.com/1" }]
        },
        {
          id: "u2-l3",
          title: "What is Ulum al-Quran? (gentle map)",
          minutes: 12,
          points: [
            "Sciences of the Qur'an include revelation, compilation, and how we understand verses.",
            "Beginners start with clear verses on belief and worship.",
            "Always: educational study — ask a qualified teacher for deeper rulings."
          ],
          ayah: { ref: "Qur'an 15:9", en: "Indeed, it is We who sent down the Reminder, and indeed, We will be its guardian." },
          deepLearn: [
            { label: "Qur'an 15:9", href: "https://quran.com/15/9" },
            { label: "SeekersGuidance — Qur'an topics", href: "https://seekersguidance.org/" }
          ],
          links: [{ label: "Qur'an 15:9", href: "https://quran.com/15/9" }]
        }
      ]
    },
    {
      id: "u3-hadith",
      title: "Unit 3 — Prophetic guidance (Hadith intro)",
      goal: "Meet the Sunnah with respect — introduction track (Madinah Hadith intro · Mustalah seed).",
      lessons: [
        {
          id: "u3-l1",
          title: "Why we follow the Messenger ﷺ",
          minutes: 12,
          points: [
            "Allah commands obedience to the Messenger as obedience to Him in what is revealed.",
            "The Sunnah explains and embodies the Qur'an.",
            "Peace and blessings upon him whenever he is mentioned."
          ],
          ayah: { ref: "Qur'an 4:59", en: "Obey Allah and obey the Messenger…" },
          deepLearn: [
            { label: "Qur'an 4:59", href: "https://quran.com/4/59" },
            { label: "Qur'an 33:56", href: "https://quran.com/33/56" }
          ],
          links: [{ label: "Qur'an 4:59", href: "https://quran.com/4/59" }]
        },
        {
          id: "u3-l2",
          title: "A first authentic narration (mercy)",
          minutes: 12,
          points: [
            "Begin with well-known, widely accepted narrations taught to beginners.",
            "Example theme: mercy to others and to oneself in worship.",
            "Check collections on sunnah.com — prefer graded reports; ask a teacher if unsure."
          ],
          ayah: { ref: "Qur'an 21:107", en: "We sent you not but as a mercy to the worlds." },
          deepLearn: [
            { label: "sunnah.com — Bukhari", href: "https://sunnah.com/bukhari" },
            { label: "Qur'an 21:107", href: "https://quran.com/21/107" }
          ],
          links: [{ label: "sunnah.com", href: "https://sunnah.com/bukhari" }]
        },
        {
          id: "u3-l3",
          title: "Mustalah seed — what is a chain?",
          minutes: 10,
          points: [
            "Hadith science cares about who narrated from whom (isnad) and the text (matn).",
            "Junior level: know that scholars graded reports; we do not invent grades ourselves.",
            "Educational only — not a substitute for Hadith faculty training."
          ],
          deepLearn: [
            { label: "sunnah.com home", href: "https://sunnah.com/" },
            { label: "Yaqeen — Prophetic example (essays)", href: "https://yaqeeninstitute.org/" }
          ],
          links: [{ label: "sunnah.com", href: "https://sunnah.com/" }]
        }
      ]
    },
    {
      id: "u4-fiqh-ibadah",
      title: "Unit 4 — Fiqh of worship (beginner)",
      goal: "Purification and prayer map — Fiqh al-Ibadat 1 style (Madinah Fiqh of Worship · Azhar practical fiqh).",
      lessons: [
        {
          id: "u4-l1",
          title: "Taharah — purity before prayer",
          minutes: 14,
          points: [
            "Prayer needs purity: wudu for minor impurity; ghusl when required.",
            "Learn the steps of wudu from a reliable teacher; practice calmly.",
            "Intention (niyyah) is in the heart for Allah."
          ],
          ayah: { ref: "Qur'an 5:6", en: "When you rise to pray, wash your faces and your hands…" },
          deepLearn: [
            { label: "Qur'an 5:6", href: "https://quran.com/5/6" },
            { label: "SeekersGuidance — purification", href: "https://seekersguidance.org/" }
          ],
          links: [{ label: "Qur'an 5:6", href: "https://quran.com/5/6" }]
        },
        {
          id: "u4-l2",
          title: "Salah — the five daily prayers",
          minutes: 14,
          points: [
            "The five prayers are pillars of a Muslim day.",
            "Learn times, rak'ahs, and presence of heart (khushu) gradually.",
            "Local scholars and teachers correct posture and recitation — use them."
          ],
          ayah: { ref: "Qur'an 2:238", en: "Maintain the prayers, especially the middle prayer…" },
          deepLearn: [
            { label: "Qur'an 2:238", href: "https://quran.com/2/238" },
            { label: "Qur'an 11:114", href: "https://quran.com/11/114" }
          ],
          links: [{ label: "Qur'an 2:238", href: "https://quran.com/2/238" }]
        },
        {
          id: "u4-l3",
          title: "Zakat · fasting · Hajj (overview only)",
          minutes: 12,
          points: [
            "Pillars beyond salah: zakat, fasting Ramadan, Hajj if able.",
            "This module only maps the names and purposes — detailed rulings need a teacher.",
            "Never invent financial or travel rulings from an app alone."
          ],
          ayah: { ref: "Qur'an 2:183", en: "Fasting is prescribed for you as it was for those before you…" },
          deepLearn: [
            { label: "Qur'an 2:183", href: "https://quran.com/2/183" },
            { label: "Qur'an 3:97 (Hajj)", href: "https://quran.com/3/97" }
          ],
          links: [{ label: "Qur'an 2:183", href: "https://quran.com/2/183" }]
        }
      ]
    },
    {
      id: "u5-seerah",
      title: "Unit 5 — Seerah & character",
      goal: "Walk with the Prophet ﷺ — biography seed and akhlaq (Madinah Seerah · Islamic values).",
      lessons: [
        {
          id: "u5-l1",
          title: "Mercy and truthfulness",
          minutes: 12,
          points: [
            "His character was the Qur'an in action — honesty, patience, mercy.",
            "Junior practice: one true word, one kind act daily.",
            "Send salawat when he is mentioned."
          ],
          ayah: { ref: "Qur'an 68:4", en: "And you are truly of a magnificent character." },
          deepLearn: [
            { label: "Qur'an 68:4", href: "https://quran.com/68/4" },
            { label: "Qur'an 33:21", href: "https://quran.com/33/21" }
          ],
          links: [{ label: "Qur'an 68:4", href: "https://quran.com/68/4" }]
        },
        {
          id: "u5-l2",
          title: "Makkan patience · Madinan community",
          minutes: 12,
          points: [
            "Early Muslims faced hardship with patience in Makkah.",
            "In Madinah, brotherhood and justice shaped the community.",
            "Study seerah with verified books and teachers — not random clips alone."
          ],
          deepLearn: [
            { label: "Qur'an 9:40 (cave)", href: "https://quran.com/9/40" },
            { label: "Yaqeen — Seerah resources", href: "https://yaqeeninstitute.org/" }
          ],
          links: [{ label: "Qur'an 9:40", href: "https://quran.com/9/40" }]
        }
      ]
    },
    {
      id: "u6-usul-seed",
      title: "Unit 6 — How rulings are approached (Usul seed)",
      goal: "Respect the method — intro to sources (Madinah Usul intro · Azhar usul awareness).",
      lessons: [
        {
          id: "u6-l1",
          title: "Qur'an and Sunnah as sources",
          minutes: 12,
          points: [
            "Primary sources: Book of Allah and Sunnah of His Messenger ﷺ.",
            "Scholars use principles (usul) to understand texts — you are beginning that respect.",
            "App modules never replace a mufti or local scholar for personal rulings."
          ],
          ayah: { ref: "Qur'an 4:59", en: "If you disagree, refer it to Allah and the Messenger…" },
          deepLearn: [
            { label: "Qur'an 4:59", href: "https://quran.com/4/59" },
            { label: "SeekersGuidance — methodology", href: "https://seekersguidance.org/" }
          ],
          links: [{ label: "Qur'an 4:59", href: "https://quran.com/4/59" }]
        },
        {
          id: "u6-l2",
          title: "Adab of seeking knowledge",
          minutes: 10,
          points: [
            "Sincerity, humility, verifying sources, and patience.",
            "Prefer sequential learning — as in classical faculties.",
            "Educational disclaimer on every step of this journey."
          ],
          ayah: { ref: "Qur'an 20:114", en: "My Lord, increase me in knowledge." },
          deepLearn: [
            { label: "Qur'an 20:114", href: "https://quran.com/20/114" },
            { label: "Qur'an 39:9", href: "https://quran.com/39/9" }
          ],
          links: [{ label: "Qur'an 20:114", href: "https://quran.com/20/114" }]
        }
      ]
    }
  ];

  function flatModules() {
    var list = [];
    UNITS.forEach(function (u, ui) {
      u.lessons.forEach(function (les) {
        list.push({ unit: u, unitIndex: ui, lesson: les, moduleIndex: list.length });
      });
    });
    return list;
  }

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
    } catch (e) {}
  }
  function isDone(lessonId) {
    var p = loadProgress();
    return !!(p[lessonId] && p[lessonId].done);
  }
  function markDone(lessonId) {
    var p = loadProgress();
    p[lessonId] = { done: true, at: Date.now() };
    saveProgress(p);
    render();
    try {
      g.dispatchEvent(new CustomEvent("clarity-junior-progress", { detail: { id: lessonId } }));
    } catch (e) {}
    if (allComplete()) {
      setTimeout(function () {
        if (typeof g.clarityOpenPhaseQuiz === "function") g.clarityOpenPhaseQuiz(1);
      }, 400);
    }
  }
  function totalLessons() {
    return flatModules().length;
  }
  function doneCount() {
    var n = 0;
    flatModules().forEach(function (m) {
      if (isDone(m.lesson.id)) n++;
    });
    return n;
  }
  function allComplete() {
    return doneCount() >= totalLessons() && totalLessons() > 0;
  }
  function activeModuleIndex() {
    var mods = flatModules();
    for (var i = 0; i < mods.length; i++) {
      if (!isDone(mods[i].lesson.id)) return i;
    }
    return mods.length;
  }

  function openCard(id) {
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    try {
      el.classList.remove("gate-hidden", "hidden");
      el.hidden = false;
      el.style.removeProperty("display");
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {}
  }

  function ensureCard() {
    var card = document.getElementById("junior-curriculum-card");
    if (card) {
      try {
        card.setAttribute("data-min-i", "0");
        card.setAttribute("data-clarity-path", "seeker");
        card.setAttribute("data-curriculum-phase", "seeker");
        card.setAttribute("data-rrra", "reminder");
        card.setAttribute("data-curriculum-exclusive", "1");
      } catch (e) {}
      return card;
    }
    card = document.createElement("section");
    card.id = "junior-curriculum-card";
    card.className = "card curriculum-phase-card junior-active";
    card.setAttribute("data-min-i", "0");
    card.setAttribute("data-clarity-path", "seeker");
    card.setAttribute("data-curriculum-phase", "seeker");
    card.setAttribute("data-rrra", "reminder");
    card.setAttribute("data-curriculum-exclusive", "1");
    card.innerHTML =
      '<h2 class="card-title">Junior curriculum — Phase 1</h2>' +
      '<p class="card-lead">One module at a time. Answer a short reflection pause to open the next section. Finish all modules, then pass the phase quiz to advance. Educational only.</p>' +
      '<div id="junior-curriculum-progress" class="junior-progress"></div>' +
      '<div id="junior-curriculum-body" class="junior-body"></div>';
    var host =
      document.getElementById("campus-stage-body") ||
      document.getElementById("clarity-campus-stage") ||
      document.querySelector("#tab-reminder .rrra-hub-body") ||
      document.getElementById("tab-reminder") ||
      document.getElementById("main-application-workspace") ||
      document.body;
    try {
      host.insertBefore(card, host.firstChild);
    } catch (e2) {
      host.appendChild(card);
    }
    return card;
  }

  
    function deepLearnHtml(lesson) {
      var dl = lesson.deepLearn || lesson.links || [];
      if (!dl || !dl.length) return "";
      var h = '<div class="junior-deep" style="margin-top:.5rem;padding:.5rem .65rem;border-radius:10px;border:1px dashed rgba(224,197,106,.35);background:rgba(13,79,60,.12)">';
      h += '<div style="font-size:.68rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#d4b45a;margin-bottom:.35rem">Deep learning · primary sources</div>';
      h += '<ul style="margin:0;padding-left:1.1rem;font-size:.8rem;line-height:1.45">';
      dl.forEach(function (L) {
        if (!L || !L.href) return;
        h += '<li><a href="' + String(L.href).replace(/"/g, "") + '" target="_blank" rel="noopener noreferrer">' +
          String(L.label || L.href) + '</a></li>';
      });
      h += '</ul><p style="margin:.4rem 0 0;font-size:.72rem;opacity:.75">Educational only — not a fatwa. Confirm with a qualified teacher.</p></div>';
      return h;
    }

  function render() {
    ensureCard();
    var prog = document.getElementById("junior-curriculum-progress");
    var body = document.getElementById("junior-curriculum-body");
    if (!prog || !body) return;

    var mods = flatModules();
    var d = doneCount();
    var t = mods.length;
    var pct = t ? Math.round((100 * d) / t) : 0;
    var active = activeModuleIndex();

    prog.innerHTML =
      '<div class="junior-bar"><div class="junior-bar-fill" style="width:' +
      pct +
      '%"></div></div>' +
      '<span class="junior-prog-label">' +
      d +
      " / " +
      t +
      " modules · " +
      pct +
      "%</span>" +
      (allComplete()
        ? '<button type="button" class="junior-phase-quiz-btn" id="junior-open-phase-quiz">Phase quiz — open next section phase</button>'
        : '<span class="junior-lock-hint">Complete modules in order. Next phase stays locked until all are checked and you pass the quiz.</span>');

    var html = "";
    var lastUnitId = null;
    mods.forEach(function (m) {
      var les = m.lesson;
      var unit = m.unit;
      var idx = m.moduleIndex;
      var done = isDone(les.id);
      var unlocked = idx <= active;
      var isCurrent = idx === active && !done;

      if (unit.id !== lastUnitId) {
        if (lastUnitId) html += "</article>";
        html += '<article class="junior-unit">';
        html += "<h3>" + unit.title + "</h3>";
        html += '<p class="junior-goal">' + unit.goal + "</p>";
        lastUnitId = unit.id;
      }

      var stateClass = done ? " is-done" : isCurrent ? " is-current" : unlocked ? "" : " is-locked";
      html +=
        '<div class="junior-lesson' +
        stateClass +
        '" data-lesson="' +
        les.id +
        '" data-mod-index="' +
        idx +
        '">';
      html +=
        "<h4>" +
        (done ? "\u2713 " : isCurrent ? "\u25B6 " : unlocked ? "" : "\uD83D\uDD12 ") +
        les.title +
        " <small>(" +
        les.minutes +
        " min)</small></h4>";

      if (!unlocked && !done) {
        html +=
          '<p class="junior-locked-msg">Locked — complete the previous module and mark it complete to open this one.</p></div>';
        return;
      }

      html += "<ul>";
      (les.points || []).forEach(function (pt) {
        html += "<li>" + pt + "</li>";
      });
      html += "</ul>";
      if (les.ayah) {
        html +=
          '<blockquote class="junior-ayah"><strong>' +
          les.ayah.ref +
          "</strong> — " +
          les.ayah.en +
          "</blockquote>";
      }
      html += deepLearnHtml(les);
      if (les.video) {
        var v = les.video;
        var src = v.list
          ? "https://www.youtube-nocookie.com/embed/videoseries?list=" + encodeURIComponent(v.list) + "&rel=0"
          : v.id
          ? "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(v.id) + "?rel=0"
          : "";
        if (src) {
          html +=
            '<details class="curriculum-video-details"><summary class="curriculum-video-summary">▶ ' +
            (v.title || "Lecture") +
            "</summary><div class=\"curriculum-video-frame\"><iframe loading=\"lazy\" title=\"" +
            (v.title || "Lecture").replace(/"/g, "") +
            '" src="' +
            src +
            '" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></details>';
        }
      }
      html += '<div class="junior-actions">';
      if (les.openCard) {
        html +=
          '<button type="button" class="mv-chip" data-open-card="' +
          les.openCard +
          '">Open related card</button>';
      }
      (les.links || []).forEach(function (lk) {
        html +=
          '<a class="mv-chip" href="' +
          lk.href +
          '" target="_blank" rel="noopener noreferrer">' +
          lk.label +
          "</a>";
      });
      if (!done) {
        html +=
          '<button type="button" class="mv-chip junior-done-btn junior-spark-btn" data-spark="' +
          les.id +
          '">✦ Reflect to continue — open next section</button>';
      } else {
        html += '<span class="junior-done-label">Completed \u2713</span>';
      }
      html += "</div></div>";
    });
    if (lastUnitId) html += "</article>";

    if (allComplete()) {
      html +=
        '<div class="junior-phase-complete">' +
        "<strong>Phase 1 modules complete.</strong> Take the short quiz to unlock Phase 2 (New Muslim foundations)." +
        '<button type="button" class="junior-phase-quiz-btn" data-open-quiz="1">Open phase quiz</button>' +
        "</div>";
    }

    body.innerHTML = html;

    body.onclick = function (ev) {
      var t = ev.target;
      if (!t) return;
      var sparkId = t.getAttribute && t.getAttribute("data-spark");
      if (sparkId) {
        var mods2 = flatModules();
        var act = activeModuleIndex();
        var allowed = mods2[act] && mods2[act].lesson.id === sparkId;
        if (!allowed && !isDone(sparkId)) {
          alert("Complete modules in order — finish the current open module first.");
          return;
        }
        var lesObj = null;
        for (var mi = 0; mi < mods2.length; mi++) {
          if (mods2[mi].lesson.id === sparkId) {
            lesObj = mods2[mi].lesson;
            break;
          }
        }
        if (typeof g.clarityOpenModuleSparkQuiz === "function") {
          g.clarityOpenModuleSparkQuiz(sparkId, lesObj, function () {
            markDone(sparkId);
          });
        } else {
          markDone(sparkId);
        }
        return;
      }
      var mark = t.getAttribute && t.getAttribute("data-mark");
      if (mark) {
        markDone(mark);
        return;
      }
      var oc = t.getAttribute && t.getAttribute("data-open-card");
      if (oc) openCard(oc);
      if (t.getAttribute && t.getAttribute("data-open-quiz")) {
        if (typeof g.clarityOpenPhaseQuiz === "function") g.clarityOpenPhaseQuiz(1);
      }
    };

    var quizBtn = document.getElementById("junior-open-phase-quiz");
    if (quizBtn) {
      quizBtn.onclick = function () {
        if (typeof g.clarityOpenPhaseQuiz === "function") g.clarityOpenPhaseQuiz(1);
      };
    }
    try {
      if (typeof g.clarityRefreshPhasePlaque === "function") g.clarityRefreshPhasePlaque();
    } catch (eR) {}
  }

  function pathIsSeeker() {
    try {
      var p =
        localStorage.getItem("clarity_path_focus") ||
        localStorage.getItem("clarity_committed_path") ||
        "seeker";
      p = String(p).toLowerCase().replace(/_/g, "-");
      return p === "seeker" || p === "" || p === "junior";
    } catch (e) {
      return true;
    }
  }

  function revealCurriculumHost(tab) {
    if (!tab) return;
    try {
      tab.hidden = false;
      tab.removeAttribute("hidden");
      tab.setAttribute("aria-hidden", "false");
      tab.style.removeProperty("display");
      if (tab.style.display === "none") tab.style.display = "";
      tab.classList.add("is-active", "rrra-hub-active");
      tab.classList.remove("gate-hidden", "hidden");
    } catch (e) {}
    /* sibling panels stay as path pack left them — only ensure our host is visible */
    try {
      var workspace = document.getElementById("main-application-workspace");
      if (workspace) {
        workspace.hidden = false;
        workspace.style.removeProperty("display");
      }
      var mainApp = document.getElementById("main-application");
      if (mainApp) {
        mainApp.hidden = false;
        mainApp.style.removeProperty("display");
      }
    } catch (e2) {}
  }

  function mountBoost() {
    var card = ensureCard();
    if (!card) return;
    var phase = 1;
    try {
      phase = parseInt(localStorage.getItem(PHASE_KEY) || "1", 10) || 1;
    } catch (e) {}
    if (phase > 1 && !pathIsSeeker()) {
      try {
        card.classList.add("gate-hidden");
        card.style.setProperty("display", "none", "important");
      } catch (e2) {}
      return;
    }
    try {
      var tab = document.getElementById("tab-reminder");
      var hub = tab
        ? tab.querySelector(".rrra-hub-body") || tab
        : null;
      var workspace = document.getElementById("main-application-workspace");
      /* Prefer tab hub; if tab stays display:none, also pin under workspace */
      if (hub && (!card.parentNode || !hub.contains(card))) {
        try {
          hub.insertBefore(card, hub.firstChild);
        } catch (eIns) {
          hub.appendChild(card);
        }
      } else if (!card.parentNode && workspace) {
        workspace.insertBefore(card, workspace.firstChild);
      }
      revealCurriculumHost(tab);
      /* Soft-nudge RRRA path pack if present */
      try {
        if (typeof g.clarityOpenSectionDoor === "function") {
          g.clarityOpenSectionDoor("reminder");
        } else if (typeof g.setRrraHub === "function") {
          g.setRrraHub("reminder");
        } else {
          document.dispatchEvent(
            new CustomEvent("clarity-rrra-change", { detail: { hub: "reminder" } })
          );
        }
      } catch (eNav) {}
    } catch (eR) {}
    try {
      card.classList.remove("gate-hidden", "hidden");
      card.removeAttribute("data-gate-hidden");
      card.hidden = false;
      card.style.removeProperty("display");
      card.style.display = "";
      card.classList.add("junior-active");
    } catch (e3) {}
    render();
  }

  function boot() {
    mountBoost();
    setTimeout(mountBoost, 500);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("clarity-vault-ready", function () { setTimeout(boot, 50); });
  g.addEventListener("clarity-path-changed", function () {
    setTimeout(mountBoost, 120);
  });
  document.addEventListener("clarity-rrra-change", function () {
    setTimeout(mountBoost, 120);
  });

  g.ClarityJuniorCurriculum = {
    UNITS: UNITS,
    render: render,
    markDone: markDone,
    allComplete: allComplete,
    activeModuleIndex: activeModuleIndex,
    totalLessons: totalLessons,
    doneCount: doneCount
  };
})(typeof window !== "undefined" ? window : this);
