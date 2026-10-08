/* Clarity Junior Curriculum (Seeker) v1
 * Level: Junior / elementary foundation
 * Sources shaped by: SeekersGuidance foundations, BeginIslam roadmap,
 * Nawara/Zad essentials, NewMuslims.com Level-1 pattern
 * Content is educational reflection; not a fatwa service.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_JUNIOR_CURRICULUM_V1__) return;
  g.__CLARITY_JUNIOR_CURRICULUM_V1__ = true;

  var PROGRESS_KEY = "clarity_junior_progress_v1";

  /** Six units — junior standard */
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
            "We worship Him alone (Tawḥīd)."
          ],
          ayah: { ref: "Qur'an 112:1-2", en: "Say: He is Allah, One. Allah, the Eternal Refuge." },
          openCard: "soul-compass-card",
          links: [
            { label: "Qur'an 112 (Al-Ikhlāṣ)", href: "https://quran.com/112" },
            { label: "SeekersGuidance — Belief", href: "https://seekersguidance.org/" }
          ]
        },
        {
          id: "u1-l2",
          title: "Allah sees and knows",
          minutes: 7,
          points: [
            "Allah knows what we show and what we hide.",
            "He is closer in knowledge than we can imagine.",
            "This invites honesty and hope, not fear alone."
          ],
          ayah: { ref: "Qur'an 50:16", en: "We are closer to him than his jugular vein." },
          openCard: "night-breath-card",
          links: [{ label: "Qur'an 50:16", href: "https://quran.com/50/16" }]
        }
      ]
    },
    {
      id: "u2-iman",
      title: "Unit 2 — Six pillars of īmān",
      goal: "Name the six beliefs every Muslim holds.",
      lessons: [
        {
          id: "u2-l1",
          title: "Belief map (overview)",
          minutes: 10,
          points: [
            "1) Allah  2) Angels  3) Revealed Books  4) Prophets  5) Last Day  6) Divine Decree (Qadar)",
            "Junior goal: remember the list; depth comes later.",
            "Īmān grows with learning and good deeds."
          ],
          openCard: "soul-compass-card",
          links: [
            { label: "BeginIslam — Articles of Faith", href: "https://beginislam.org/" }
          ]
        },
        {
          id: "u2-l2",
          title: "Prophets & the Last Day (gentle)",
          minutes: 10,
          points: [
            "Allah sent messengers as mercy and guides.",
            "The final messenger is Muhammad ﷺ.",
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
          title: "Shahādah to Ḥajj (map)",
          minutes: 10,
          points: [
            "1) Shahādah  2) Ṣalāh  3) Zakāh  4) Ṣawm  5) Ḥajj",
            "Junior focus: meaning of each in simple words.",
            "Practice of prayer deepens in New Muslim track."
          ],
          openCard: "commands-card",
          links: [
            { label: "Qur'an 2:183 (fasting)", href: "https://quran.com/2/183" }
          ]
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
      title: "Unit 4 — The Messenger ﷺ",
      goal: "Love and follow the Prophet as the best example.",
      lessons: [
        {
          id: "u4-l1",
          title: "Who is Muhammad ﷺ?",
          minutes: 10,
          points: [
            "He is the final messenger and a mercy to the worlds.",
            "His character was the Qur'an in action.",
            "We say ﷺ when we mention him."
          ],
          openCard: "seerah-live-card",
          links: [
            { label: "Qur'an 21:107", href: "https://quran.com/21/107" },
            { label: "Qur'an 33:21", href: "https://quran.com/33/21" }
          ]
        },
        {
          id: "u4-l2",
          title: "Samiʿnā wa aṭaʿnā",
          minutes: 8,
          points: [
            "Believers say: we hear and we obey.",
            "Open Samiʿnā card and reflect on one verse."
          ],
          openCard: "samina-verse-card",
          links: []
        }
      ]
    },
    {
      id: "u5-adab",
      title: "Unit 5 — Adab & heart",
      goal: "Practice honesty, kindness, and remembrance.",
      lessons: [
        {
          id: "u5-l1",
          title: "Good character is half the path",
          minutes: 8,
          points: [
            "Truthfulness, mercy, and respect are worship.",
            "The Prophet ﷺ was sent to perfect noble character.",
            "One kind action today is success."
          ],
          openCard: "cw-card",
          links: []
        },
        {
          id: "u5-l2",
          title: "Night breath — calm dhikr",
          minutes: 7,
          points: [
            "Slow breathing with remembrance steadies the heart.",
            "Try Night Breath for two minutes before sleep."
          ],
          openCard: "night-breath-card",
          links: []
        }
      ]
    },
    {
      id: "u6-hereafter",
      title: "Unit 6 — Remember the return",
      goal: "Know we return to Allah; live prepared with hope.",
      lessons: [
        {
          id: "u6-l1",
          title: "This life is a journey",
          minutes: 10,
          points: [
            "Junior tone: hope and responsibility, not despair.",
            "Good deeds travel with us.",
            "Open Grave Path only with a calm heart; ask a teacher if heavy."
          ],
          openCard: "grave-path-card",
          links: [{ label: "Qur'an 67:2", href: "https://quran.com/67/2" }]
        }
      ]
    }
  ];

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
  function markDone(lessonId) {
    var p = loadProgress();
    p[lessonId] = { done: true, at: Date.now() };
    saveProgress(p);
    render();
  }
  function isDone(lessonId) {
    var p = loadProgress();
    return !!(p[lessonId] && p[lessonId].done);
  }
  function totalLessons() {
    var n = 0;
    UNITS.forEach(function (u) {
      n += u.lessons.length;
    });
    return n;
  }
  function doneCount() {
    var n = 0;
    UNITS.forEach(function (u) {
      u.lessons.forEach(function (l) {
        if (isDone(l.id)) n++;
      });
    });
    return n;
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
    if (card) return card;
    card = document.createElement("section");
    card.id = "junior-curriculum-card";
    card.className = "card";
    card.setAttribute("data-clarity-path", "seeker");
    card.setAttribute("data-clarity-curriculum", "junior");
    card.innerHTML =
      '<h2 class="card-title">Junior curriculum — Seeker</h2>' +
      '<p class="card-lead">Elementary foundation: belief, pillars, the Messenger ﷺ, adab, and hope in the Hereafter. Short lessons. Progress stays on this device.</p>' +
      '<div id="junior-curriculum-progress" class="junior-progress"></div>' +
      '<div id="junior-curriculum-body" class="junior-body"></div>' +
      '<p class="junior-footnote">Resources: Qur\'an.com · SeekersGuidance · BeginIslam patterns. Educational only — not a fatwa.</p>';

    // Place near about or first seeker card
    var anchor =
      document.getElementById("about-clarity-card") ||
      document.getElementById("soul-compass-card") ||
      document.getElementById("commands-card");
    if (anchor && anchor.parentNode) {
      if (anchor.nextSibling) anchor.parentNode.insertBefore(card, anchor.nextSibling);
      else anchor.parentNode.appendChild(card);
    } else {
      (document.getElementById("main") || document.body).appendChild(card);
    }
    return card;
  }

  function render() {
    ensureCard();
    var prog = document.getElementById("junior-curriculum-progress");
    var body = document.getElementById("junior-curriculum-body");
    if (!prog || !body) return;
    var d = doneCount();
    var t = totalLessons();
    var pct = t ? Math.round((100 * d) / t) : 0;
    prog.innerHTML =
      '<div class="junior-bar"><div class="junior-bar-fill" style="width:' +
      pct +
      '%"></div></div>' +
      "<span>" +
      d +
      " / " +
      t +
      " lessons · " +
      pct +
      "%</span>";

    var html = "";
    UNITS.forEach(function (unit, ui) {
      html += '<article class="junior-unit">';
      html += "<h3>" + unit.title + "</h3>";
      html += '<p class="junior-goal">' + unit.goal + "</p>";
      unit.lessons.forEach(function (les) {
        var done = isDone(les.id);
        html += '<div class="junior-lesson' + (done ? " is-done" : "") + '" data-lesson="' + les.id + '">';
        html += "<h4>" + (done ? "✓ " : "") + les.title + " <small>(" + les.minutes + " min)</small></h4>";
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
        html += '<div class="junior-actions">';
        if (les.openCard) {
          html +=
            '<button type="button" class="mv-chip" data-open-card="' +
            les.openCard +
            '">Open module</button>';
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
            '<button type="button" class="mv-chip junior-done-btn" data-mark="' +
            les.id +
            '">Mark done</button>';
        } else {
          html += '<span class="junior-done-label">Completed</span>';
        }
        html += "</div></div>";
      });
      html += "</article>";
    });
    body.innerHTML = html;

    body.onclick = function (ev) {
      var t = ev.target;
      if (!t) return;
      var open = t.getAttribute("data-open-card");
      if (open) {
        openCard(open);
        return;
      }
      var mark = t.getAttribute("data-mark");
      if (mark) markDone(mark);
    };
  }

  function pathIsSeeker() {
    try {
      var p =
        document.documentElement.getAttribute("data-clarity-path") ||
        localStorage.getItem("clarity_path_focus") ||
        "";
      return !p || p === "seeker" || p === "0";
    } catch (e) {
      return true;
    }
  }

  function boot() {
    render();
    // Show card more prominently on seeker
    try {
      var card = document.getElementById("junior-curriculum-card");
      if (card && pathIsSeeker()) card.classList.add("junior-active");
    } catch (e) {}
    g.addEventListener("clarity-path-changed", function () {
      render();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  g.ClarityJuniorCurriculum = { UNITS: UNITS, render: render, markDone: markDone };
})(typeof window !== "undefined" ? window : this);
