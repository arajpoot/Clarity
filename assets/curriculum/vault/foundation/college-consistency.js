/* Sequential curriculum Phase 3 — Daily HS + lecture visual aides */
(function (g) {
  "use strict";
  if (g.__CLARITY_DAILY_HS_CURRICULUM_V2__) return;
  g.__CLARITY_DAILY_HS_CURRICULUM_V2__ = true;

  function boot() {
    if (!g.ClarityCurriculumEngine) {
      setTimeout(boot, 80);
      return;
    }
    var UNITS = [
    /* College of Consistency — Daily / High
       Tajweed, steady worship, Quran habit — Madinah Quran track + daily discipline.
       Educational only — not a fatwa. */
    {
      id: "hs-u1-tajweed",
      title: "Unit 1 — Tajweed foundations",
      goal: "One rule, one ayah — measured recitation (Madinah Tajweed / Quran faculty spirit).",
      lessons: [
        {
          id: "hs-u1-l1",
          title: "Makharij awareness",
          minutes: 18,
          points: [
            "Know that letters have points of articulation.",
            "Practice with a teacher when possible; recordings support, not replace.",
            "Pick one letter family per session."
          ],
          deepLearn: [
            { label: "Qur'an 73:4 (tartil)", href: "https://quran.com/73/4" },
            { label: "Qur'an 25:32", href: "https://quran.com/25/32" }
          ]
        },
        {
          id: "hs-u1-l2",
          title: "One rule applied",
          minutes: 16,
          points: [
            "Choose one beginner rule (e.g. qalqalah or ghunnah).",
            "Apply it to one short ayah; record and compare once."
          ],
          deepLearn: [
            { label: "Qur'an 1 — slow practice", href: "https://quran.com/1" }
          ]
        }
      ]
    },
    {
      id: "hs-u2-wird",
      title: "Unit 2 — Daily wird (Quran habit)",
      goal: "A sustainable portion of Quran every day.",
      lessons: [
        {
          id: "hs-u2-l1",
          title: "Choose a sustainable portion",
          minutes: 14,
          points: [
            "Better a small daily portion than a rare long one.",
            "Tie it to a fixed time after a prayer."
          ],
          ayah: { ref: "Qur'an 73:20", en: "So recite what is easy of the Qur'an…" },
          deepLearn: [
            { label: "Qur'an 73:20", href: "https://quran.com/73/20" }
          ]
        },
        {
          id: "hs-u2-l2",
          title: "Reflection seed (tadabbur)",
          minutes: 14,
          points: [
            "After reciting, note one meaning or action.",
            "Tafsir study uses reliable works and teachers — not random opinions."
          ],
          deepLearn: [
            { label: "Qur'an 38:29", href: "https://quran.com/38/29" },
            { label: "SeekersGuidance", href: "https://seekersguidance.org/" }
          ]
        }
      ]
    },
    {
      id: "hs-u3-salah-strength",
      title: "Unit 3 — Strengthening salah",
      goal: "Sunnah prayers and congregation when able.",
      lessons: [
        {
          id: "hs-u3-l1",
          title: "Rawatib overview",
          minutes: 12,
          points: [
            "Optional confirmed sunnah prayers surround the obligations.",
            "Learn counts from a teacher; start with what you can keep."
          ],
          deepLearn: [
            { label: "sunnah.com — voluntary prayer", href: "https://sunnah.com/search?q=sunnah%20prayer" }
          ]
        },
        {
          id: "hs-u3-l2",
          title: "Congregation and community",
          minutes: 12,
          points: [
            "Prayer in congregation has great virtue when accessible.",
            "Mosque adab: silence, rows, respect for others."
          ],
          deepLearn: [
            { label: "Qur'an 9:18", href: "https://quran.com/9/18" }
          ]
        }
      ]
    },
    {
      id: "hs-u4-ramadan-map",
      title: "Unit 4 — Ramadan & zakat awareness",
      goal: "Map the annual pillars without inventing rulings.",
      lessons: [
        {
          id: "hs-u4-l1",
          title: "Fasting purpose",
          minutes: 12,
          points: [
            "Fasting is prescribed to attain taqwa.",
            "Details of excuse, travel, and medical cases need a scholar."
          ],
          ayah: { ref: "Qur'an 2:183", en: "Fasting is prescribed for you…" },
          deepLearn: [
            { label: "Qur'an 2:183", href: "https://quran.com/2/183" }
          ]
        },
        {
          id: "hs-u4-l2",
          title: "Zakat as purification",
          minutes: 12,
          points: [
            "Zakat purifies wealth; calculation is technical.",
            "Use a qualified calculator/teacher for your situation — educational map only."
          ],
          ayah: { ref: "Qur'an 9:103", en: "Take from their wealth a charity by which you purify them…" },
          deepLearn: [
            { label: "Qur'an 9:103", href: "https://quran.com/9/103" }
          ]
        }
      ]
    }
  ];

    var track = g.ClarityCurriculumEngine.createTrack({
      phase: 3,
      progressKey: "clarity_daily_hs_progress_v1",
      UNITS: UNITS,
      cardId: "daily-hs-curriculum-card",
      progId: "daily-hs-progress",
      bodyId: "daily-hs-body",
      title: "Daily High School — Phase 3 · Consistency + lectures",
      pathKey: "daily",
      tabId: "tab-reality"
    });
    g.ClarityDailyHsCurriculum = track;
    function sync() {
      var phaseNow = 1;
      try { phaseNow = parseInt(localStorage.getItem("clarity_curriculum_phase_v1") || "1", 10) || 1; } catch (e) {}
      track.show(phaseNow === 3);
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(sync, 200); setTimeout(sync, 1000); });
    else { setTimeout(sync, 200); setTimeout(sync, 1000); }
    g.addEventListener("clarity-path-changed", function () { setTimeout(sync, 100); });
    g.addEventListener("clarity-curriculum-phase", function () { setTimeout(sync, 80); });
  }
  boot();
})(typeof window !== "undefined" ? window : this);
