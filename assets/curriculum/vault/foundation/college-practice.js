/* Sequential curriculum Phase 2 — generated full sequencing */
(function (g) {
  "use strict";
  if (g.__CLARITY_JUNIOR_HIGH_CURRICULUM_V2__) return;
  g.__CLARITY_JUNIOR_HIGH_CURRICULUM_V2__ = true;
  g.__CLARITY_JUNIOR_HIGH_CURRICULUM_V1__ = true;

  function boot() {
    if (!g.ClarityCurriculumEngine) {
      setTimeout(boot, 80);
      return;
    }
    var UNITS = [
    /* College of Practice — New Muslim / Junior High
       Inspired by Madinah Fiqh al-Ibadat progression + Azhar practical worship tracks.
       Educational only — not a fatwa. */
    {
      id: "jh-u1-confidence",
      title: "Unit 1 — Confidence after Shahadah",
      goal: "Settle the heart; learning is gradual (Qur'an 2:286).",
      lessons: [
        {
          id: "jh-u1-l1",
          title: "Capacity and sincerity",
          minutes: 12,
          points: [
            "Allah does not burden a soul beyond its capacity.",
            "Mistakes in early practice are part of growth when sincerity is present.",
            "Keep Tawhid units as your base; this college is about doing with guidance."
          ],
          ayah: { ref: "Qur'an 2:286", en: "Allah does not charge a soul except with that within its capacity." },
          deepLearn: [
            { label: "Qur'an 2:286", href: "https://quran.com/2/286" },
            { label: "Qur'an 94:5-6", href: "https://quran.com/94/5-6" }
          ]
        },
        {
          id: "jh-u1-l2",
          title: "Where to ask questions",
          minutes: 10,
          points: [
            "Prefer a local imam or known teacher for personal situations.",
            "Use primary texts and trusted educational sites for study maps.",
            "This desk never issues a binding fatwa."
          ],
          deepLearn: [
            { label: "SeekersGuidance", href: "https://seekersguidance.org/" },
            { label: "BeginIslam", href: "https://beginislam.org/" }
          ]
        }
      ]
    },
    {
      id: "jh-u2-taharah",
      title: "Unit 2 — Taharah in practice",
      goal: "Wudu and purity steps with patience (Madinah Fiqh of Worship track).",
      lessons: [
        {
          id: "jh-u2-l1",
          title: "Wudu step map",
          minutes: 14,
          points: [
            "Intention in the heart; wash as taught in reliable beginner fiqh.",
            "Practice once slowly before prayer time pressure.",
            "Confirm details with a living teacher for your school of practice."
          ],
          ayah: { ref: "Qur'an 5:6", en: "When you rise to pray, wash your faces and your hands to the elbows…" },
          deepLearn: [
            { label: "Qur'an 5:6", href: "https://quran.com/5/6" },
            { label: "sunnah.com — purification", href: "https://sunnah.com/search?q=wudu" }
          ]
        },
        {
          id: "jh-u2-l2",
          title: "What breaks wudu (overview)",
          minutes: 12,
          points: [
            "Common nullifiers are taught in every beginner madhhab curriculum.",
            "When unsure, renew wudu — ease is part of the deen.",
            "Do not invent detailed rulings from an app alone."
          ],
          deepLearn: [
            { label: "SeekersGuidance — purification", href: "https://seekersguidance.org/" }
          ]
        }
      ]
    },
    {
      id: "jh-u3-salah",
      title: "Unit 3 — Salah practice path",
      goal: "Build the five prayers with presence (Azhar/Madinah ibadah practice).",
      lessons: [
        {
          id: "jh-u3-l1",
          title: "Times and rak'ahs map",
          minutes: 14,
          points: [
            "Learn the five daily names, rough times, and unit counts.",
            "Use a local timetable; this module is a map, not a prayer calculator ruling."
          ],
          ayah: { ref: "Qur'an 11:114", en: "Establish prayer at the two ends of the day and in the approach of the night…" },
          deepLearn: [
            { label: "Qur'an 11:114", href: "https://quran.com/11/114" },
            { label: "Qur'an 2:238", href: "https://quran.com/2/238" }
          ]
        },
        {
          id: "jh-u3-l2",
          title: "Khushu — presence of heart",
          minutes: 12,
          points: [
            "Slow the opening takbir; understand al-Fatiha meaning.",
            "One focused prayer is better than many rushed ones."
          ],
          ayah: { ref: "Qur'an 23:1-2", en: "Successful are the believers who are humble in their prayers." },
          deepLearn: [
            { label: "Qur'an 23:1-2", href: "https://quran.com/23/1-2" },
            { label: "Qur'an 1", href: "https://quran.com/1" }
          ]
        }
      ]
    },
    {
      id: "jh-u4-daily-adhkar",
      title: "Unit 4 — Daily adhkar & manners",
      goal: "Morning/evening remembrance and basic adab.",
      lessons: [
        {
          id: "jh-u4-l1",
          title: "Morning and evening",
          minutes: 12,
          points: [
            "Short authentic adhkar after prayer and at day edges.",
            "Consistency over quantity."
          ],
          deepLearn: [
            { label: "sunnah.com — adhkar themes", href: "https://sunnah.com/search?q=morning" },
            { label: "Qur'an 33:41-42", href: "https://quran.com/33/41-42" }
          ]
        },
        {
          id: "jh-u4-l2",
          title: "Adab with parents and neighbours",
          minutes: 10,
          points: [
            "Excellence to parents and kindness to neighbours are core practice.",
            "Character is worship when done for Allah."
          ],
          ayah: { ref: "Qur'an 4:36", en: "Worship Allah… and be good to parents…" },
          deepLearn: [
            { label: "Qur'an 4:36", href: "https://quran.com/4/36" }
          ]
        }
      ]
    }
  ];

    var track = g.ClarityCurriculumEngine.createTrack({
      phase: 2,
      progressKey: "clarity_junior_high_progress_v1",
      UNITS: UNITS,
      cardId: "junior-high-curriculum-card",
      progId: "jh-curriculum-progress",
      bodyId: "jh-curriculum-body",
      title: "Junior High — Phase 2 · New Muslim practice",
      pathKey: "new_muslim",
      tabId: "tab-action"
    });

    g.ClarityJuniorHighCurriculum = track;

    function sync() {
      var phaseNow = 1;
      try {
        phaseNow = parseInt(localStorage.getItem("clarity_curriculum_phase_v1") || "1", 10) || 1;
      } catch (e) {}
      var show = phaseNow === 2;
      track.show(show);
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        setTimeout(sync, 200);
        setTimeout(sync, 1000);
      });
    } else {
      setTimeout(sync, 200);
      setTimeout(sync, 1000);
    }
    g.addEventListener("clarity-path-changed", function () { setTimeout(sync, 100); });
    g.addEventListener("clarity-curriculum-phase", function () { setTimeout(sync, 80); });
  }
  boot();
})(typeof window !== "undefined" ? window : this);
