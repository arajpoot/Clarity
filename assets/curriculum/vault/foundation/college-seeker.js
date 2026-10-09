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
      goal: "Know Allah is One, the Creator who loves good and guides us.",
      lessons: [
        {
          id: "u1-l1",
          title: "Allah is One",
          minutes: 8,
          points: [
            "Allah created the heavens and the earth.",
            "Nothing is like Him — He is unique.",
            "We worship Him alone (Tawhid)."
          ],
          ayah: { ref: "Qur'an 112:1-4", en: "Say: He is Allah, One." },
          links: [{ label: "Qur'an 112", href: "https://quran.com/112" }]
        },
        {
          id: "u1-l2",
          title: "Allah sees and knows",
          minutes: 8,
          points: [
            "Allah knows what we show and what we hide.",
            "He is closer to us than our jugular vein — in knowledge and care.",
            "Junior practice: say Bismillah before a small task."
          ],
          ayah: { ref: "Qur'an 50:16", en: "We are closer to him than his jugular vein." },
          links: [{ label: "Qur'an 50:16", href: "https://quran.com/50/16" }]
        }
      ]
    },
    {
      id: "u2-iman",
      title: "Unit 2 — Six pillars of iman",
      goal: "Name the six beliefs every Muslim holds.",
      lessons: [
        {
          id: "u2-l1",
          title: "Belief map (overview)",
          minutes: 10,
          points: [
            "1) Allah  2) Angels  3) Revealed Books  4) Prophets  5) Last Day  6) Divine Decree (Qadar)",
            "Junior goal: remember the list; depth comes later.",
            "Iman grows with learning and good deeds."
          ],
          openCard: "soul-compass-card",
          links: [{ label: "BeginIslam — Articles of Faith", href: "https://beginislam.org/" }]
        },
        {
          id: "u2-l2",
          title: "Prophets and the Last Day (gentle)",
          minutes: 10,
          points: [
            "Allah sent messengers as mercy and guides.",
            "The final messenger is Muhammad (peace be upon him).",
            "We will return to Allah; prepare with hope and good actions."
          ],
          openCard: "seerah-live-card",
          links: [{ label: "Qur'an 33:56", href: "https://quran.com/33/56" }]
        }
      ]
    },
    {
      id: "u3-pillars",
      title: "Unit 3 — Five pillars of Islam",
      goal: "Know the five acts that structure Muslim life.",
      lessons: [
        {
          id: "u3-l1",
          title: "Shahadah to Hajj (map)",
          minutes: 10,
          points: [
            "1) Shahadah  2) Salah  3) Zakah  4) Sawm  5) Hajj",
            "Junior focus: meaning of each in simple words.",
            "Practice of prayer deepens in New Muslim track."
          ],
          openCard: "commands-card",
          links: [{ label: "Qur'an 2:183 (fasting)", href: "https://quran.com/2/183" }]
        },
        {
          id: "u3-l2",
          title: "Living words — Commands",
          minutes: 12,
          points: [
            "Allah addresses believers with guidance.",
            "Open Commands and read one verse slowly.",
            "Write one small action in Notes."
          ],
          openCard: "commands-card",
          links: []
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

  function mountBoost() {
    var card = ensureCard();
    if (!card) return;
    try {
      var tab = document.getElementById("tab-reminder");
      if (tab && card.parentNode !== tab && !tab.contains(card)) {
        var hub = tab.querySelector(".rrra-hub-body") || tab;
        hub.appendChild(card);
      }
    } catch (eR) {}
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
      card.classList.remove("gate-hidden", "hidden");
      card.removeAttribute("data-gate-hidden");
      card.hidden = false;
      card.style.removeProperty("display");
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
