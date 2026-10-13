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
    {
      id: "u1-who-is-allah",
      title: "Unit 1 — Who is Allah?",
      goal: "Know Allah is One — Creator, not like creation — and turn to Him with humility.",
      lessons: [
        {
          id: "u1-l1",
          title: "Allah is One",
          minutes: 12,
          adab: "Sit with a calm heart. This is knowledge of Allah — not debate sport.",
          body: [
            "The first truth a seeker holds is tawḥīd: Allah is One. He alone creates, sustains, and deserves worship. Nothing shares His lordship or His right to be worshipped.",
            "When we say «Allāhu aḥad», we are not inventing a slogan — we are affirming what revelation taught. Creation points to a Creator; the heart finds rest when it stops assigning partners to Him.",
            "Practice for this lesson is small and honest: before your next task, say Bismillāh and intend the act for Allah alone."
          ],
          points: [
            "Allah alone is the Creator of the heavens and the earth.",
            "Nothing is like Him — He is unique (laysa ka-mithlihi shayʾ).",
            "Worship is for Him alone (tawḥīd al-ulūhiyyah).",
            "Junior practice: Bismillāh before one ordinary task today."
          ],
          ayah: {
            ref: "Qurʾān 112:1–4",
            en: "Say: He is Allah, One. Allah, the Self-Sufficient. He neither begets nor is begotten. And there is none comparable to Him."
          },
          practice: "Write one sentence: what does «Allah is One» change in how you speak today?",
          lab: { station: "media", label: "Lab · Media reminder (tawḥīd line + source)" },
          links: [
            { label: "Qurʾān 112", href: "https://quran.com/112" },
            { label: "Qurʾān 42:11", href: "https://quran.com/42/11" }
          ]
        },
        {
          id: "u1-l2",
          title: "Allah sees and knows",
          minutes: 12,
          adab: "Let this lesson soften the tongue — He hears every word.",
          body: [
            "Allah’s knowledge is not like ours. He knows what we show and what we hide. Nothing escapes His awareness — yet His knowledge is paired with mercy for the one who turns back.",
            "The Qurʾān reminds us that He is closer in knowledge and care than we imagine. That is not an invitation to casualness; it is an invitation to sincerity (ikhlāṣ).",
            "When you are alone, you are still with the One who sees. That is a door to both awe and hope."
          ],
          points: [
            "Allah knows the open and the secret.",
            "Awareness of His seeing trains honesty.",
            "Hope: He accepts repentance from those who return.",
            "Junior practice: pause before a private action — remember He sees."
          ],
          ayah: {
            ref: "Qurʾān 50:16",
            en: "We created the human being and We know what his soul whispers to him; We are closer to him than his jugular vein."
          },
          practice: "One private moment today: whisper a short istighfār with presence.",
          links: [{ label: "Qurʾān 50:16", href: "https://quran.com/50/16" }]
        }
      ]
    },
    {
      id: "u2-iman",
      title: "Unit 2 — Six pillars of īmān",
      goal: "Map the six articles of faith and hold them with humility, not slogans.",
      lessons: [
        {
          id: "u2-l1",
          title: "Belief map (overview)",
          minutes: 14,
          adab: "Īmān grows with knowledge and action — not with haste.",
          body: [
            "Classical teaching lists six articles of faith: belief in Allah, His angels, His books, His messengers, the Last Day, and divine decree (qadar) — its good and its bitter.",
            "This unit is a map, not a full theology course. A seeker learns the names of the pillars so the heart has somewhere to hang later lessons.",
            "Each pillar will return in later units with more detail. Today: know the six, and ask Allah for firmness."
          ],
          points: [
            "Six: Allah · angels · books · messengers · Last Day · qadar.",
            "Īmān is belief in the heart, speech, and action — according to Ahl al-Sunnah teaching in educational summary.",
            "We do not argue strangers into faith; we learn and live.",
            "Junior practice: list the six from memory once."
          ],
          ayah: {
            ref: "Qurʾān 4:136",
            en: "O you who believe: believe in Allah and His Messenger and the Book He sent down to His Messenger…"
          },
          practice: "Without looking, write the six pillars; check; correct gently.",
          links: [{ label: "Qurʾān 4:136", href: "https://quran.com/4/136" }]
        },
        {
          id: "u2-l2",
          title: "Messengers and the Last Day (gentle)",
          minutes: 14,
          adab: "Speak of the prophets with ṣalawāt and respect.",
          body: [
            "Allah sent messengers as bringers of good news and warners. The final messenger is Muḥammad ﷺ — mercy to the worlds. Belief in him includes belief in those sent before him.",
            "The Last Day is real: standing, judgment, and the meeting with Allah. Remembering it is not meant to freeze the heart — it is meant to straighten the walk.",
            "Keep this gentle: hope and fear together. Do not use the ākhirah to crush a learner; use it to wake sincerity."
          ],
          points: [
            "Messengers are chosen servants — not divine.",
            "Muḥammad ﷺ is the Seal of the Prophets.",
            "The Last Day organises priorities.",
            "Junior practice: one ṣalāh upon the Prophet ﷺ with presence."
          ],
          ayah: {
            ref: "Qurʾān 33:56",
            en: "Allah and His angels send blessings upon the Prophet. O you who believe, send blessings upon him and salute him with peace."
          },
          practice: "Send ṣalāh ten times slowly; notice the heart.",
          lab: { station: "tajweed", label: "Lab · Tajweed (short āyah presence)" },
          links: [{ label: "Qurʾān 33:56", href: "https://quran.com/33/56" }]
        }
      ]
    },
    {
      id: "u3-pillars",
      title: "Unit 3 — Five pillars of Islam",
      goal: "Know the five pillars as a living structure — not a checklist only.",
      lessons: [
        {
          id: "u3-l1",
          title: "From shahādah to ḥajj (map)",
          minutes: 14,
          adab: "Pillars are gifts of structure; learn them with gratitude.",
          body: [
            "Islām is built on five: the testimony of faith, prayer, zakāh, fasting Ramaḍān, and ḥajj for those who can. This is a famous educational frame from the Sunnah.",
            "Shahādah is the door. Ṣalāh is the daily spine. Zakāh purifies wealth and community. Ṣawm trains the soul. Ḥajj gathers the ummah in response to Allah’s call.",
            "You are not asked to master fiqh today. You are asked to know the five by name and meaning at a seeker level."
          ],
          points: [
            "Shahādah · ṣalāh · zakāh · ṣawm · ḥajj.",
            "Each pillar has conditions taught by scholars — seek local teachers for rulings.",
            "Junior practice: name the five aloud once with calm.",
            "Educational only — not a personal fatwa."
          ],
          ayah: {
            ref: "Qurʾān 2:183",
            en: "O you who believe: fasting is prescribed for you as it was prescribed for those before you — that you may gain taqwā."
          },
          practice: "Choose one pillar to understand better this week with a reliable teacher or class.",
          links: [
            { label: "Qurʾān 2:183", href: "https://quran.com/2/183" },
            { label: "Lab · Calligraphy (Allāh)", href: "/lab/" }
          ]
        },
        {
          id: "u3-l2",
          title: "Living words — hearing and obeying",
          minutes: 12,
          adab: "Samʿinā wa aṭaʿnā — we hear and we obey — is the believer’s posture.",
          body: [
            "Knowledge without response becomes weight. The Qurʾān praises those who, when called, hear and obey as best they can.",
            "For a junior seeker, «obey» starts with the obvious: truthfulness, prayer effort, kind speech, and leaving what is clearly wrong.",
            "Do not claim ranks you have not earned. Walk one sincere step."
          ],
          points: [
            "Hearing revelation is a trust.",
            "Obedience is according to ability — with sincerity.",
            "Leave argumentation that does not change the self.",
            "Junior practice: one concrete obedience today (prayer on time, or an apology)."
          ],
          ayah: {
            ref: "Qurʾān 2:285",
            en: "The Messenger believes in what was sent down to him from his Lord, and so do the believers… they say: We hear and we obey."
          },
          practice: "Write one act of obedience you will do before sleep — then do it.",
          lab: { station: "callig", label: "Lab · Calligraphy (one letter with presence)" },
          links: [{ label: "Qurʾān 2:285", href: "https://quran.com/2/285" }]
        }
      ]
    },
    {
      id: "u4-messenger",
      title: "Unit 4 — The Messenger",
      goal: "Love and follow the Prophet as the best example.",
      lessons: [
        {
          id: "u4-l1",
          title: "Who is Muhammad?",
          minutes: 10,
          points: [
            "He is the final messenger and a mercy to the worlds.",
            "His character was the Qur'an in action.",
            "We send salawat when we mention him."
          ],
          openCard: "seerah-live-card",
          links: [
            { label: "Qur'an 21:107", href: "https://quran.com/21/107" },
            { label: "Qur'an 33:21", href: "https://quran.com/33/21" }
          ]
        },
        {
          id: "u4-l2",
          title: "Samina wa atana",
          minutes: 8,
          points: [
            "Believers say: we hear and we obey.",
            "Open the Samina card and reflect on one verse.",
            "Obedience is love in action."
          ],
          openCard: "samina-card",
          links: []
        }
      ]
    },
    {
      id: "u5-adab",
      title: "Unit 5 — Adab and character",
      goal: "Good manners are half of faith in practice.",
      lessons: [
        {
          id: "u5-l1",
          title: "Truth, kindness, clean tongue",
          minutes: 10,
          points: [
            "A Muslim's tongue and hands do not harm others.",
            "Smile, greet with salam, keep promises.",
            "Junior deed: one kind word today."
          ],
          openCard: "creation-tongue-reflection",
          links: []
        },
        {
          id: "u5-l2",
          title: "Parents and teachers",
          minutes: 8,
          points: [
            "Honour parents — a major path to Allah's pleasure.",
            "Respect teachers of beneficial knowledge.",
            "Ask with adab; listen more than you speak."
          ],
          links: [{ label: "Qur'an 17:23", href: "https://quran.com/17/23" }]
        }
      ]
    },
    {
      id: "u6-hereafter",
      title: "Unit 6 — Remember the meeting with Allah",
      goal: "Live today ready for the long stay.",
      lessons: [
        {
          id: "u6-l1",
          title: "Death is a door — hope and work",
          minutes: 10,
          points: [
            "Everyone will taste death; the grave is the first station.",
            "Send light ahead with small sincere deeds.",
            "Junior tone: hope and responsibility, not despair."
          ],
          openCard: "grave-path-card",
          links: [{ label: "Qur'an 67:2", href: "https://quran.com/67/2" }]
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
      '<p class="card-lead">One module at a time. Answer a short spark quiz to unlock the next. Finish all modules, then pass the phase quiz to advance. Educational only.</p>' +
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
        ? '<button type="button" class="junior-phase-quiz-btn" id="junior-open-phase-quiz">Phase quiz — unlock next phase</button>'
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
      
      if (les.adab) {
        html += '<p class="junior-adab"><em>' + les.adab + "</em></p>";
      }
      if (les.body && les.body.length) {
        html += '<div class="junior-body-text">';
        les.body.forEach(function (para) {
          html += "<p>" + para + "</p>";
        });
        html += "</div>";
      }

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
      
      if (les.practice) {
        html += '<p class="junior-practice"><strong>Practice:</strong> ' + les.practice + "</p>";
      }
      if (les.lab && les.lab.station) {
        html +=
          '<a class="mv-chip" href="/lab/" data-lab-station="' +
          les.lab.station +
          '">' +
          (les.lab.label || "Open Lab") +
          "</a>";
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
          '">✦ Prove it — unlock next</button>';
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
    setTimeout(mountBoost, 300);
    setTimeout(mountBoost, 1200);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("clarity-vault-ready", function () { setTimeout(boot, 50); });
  g.addEventListener("clarity-path-changed", function () {
    setTimeout(mountBoost, 80);
  });
  document.addEventListener("clarity-rrra-change", function () {
    setTimeout(mountBoost, 60);
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
