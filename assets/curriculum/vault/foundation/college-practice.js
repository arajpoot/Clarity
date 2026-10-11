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
    {
      id: "jh-u1-welcome",
      title: "Unit 1 — Welcome & confidence",
      goal: "Settle the heart after curiosity or Shahādah; know where to ask.",
      lessons: [
        {
          id: "jh-u1-l1",
          title: "You are not alone",
          minutes: 8,
          points: [
            "Learning is gradual — Allah does not burden a soul beyond its capacity.",
            "Mistakes in practice are part of growth; sincerity matters.",
            "Keep Junior units as your belief base; this track is about doing."
          ],
          ayah: { ref: "Qur'an 2:286", en: "Allah does not charge a soul except [with that within] its capacity." },
          openCard: "new-muslim-foundations-card",
          links: [
            { label: "Qur'an 2:286", href: "https://quran.com/2/286" },
            { label: "SeekersGuidance", href: "https://seekersguidance.org/" }
          ]
        },
        {
          id: "jh-u1-l2",
          title: "Shahādah living meaning",
          minutes: 10,
          points: [
            "Lā ilāha illā Allāh — no deity worthy of worship except Allah.",
            "Muḥammadun rasūl Allāh — Muhammad ﷺ is His messenger.",
            "It is a contract of loyalty and a door to mercy."
          ],
          openCard: "soul-compass-card",
          links: [{ label: "Qur'an 3:18", href: "https://quran.com/3/18" }]
        }
      ]
    },
    {
      id: "jh-u2-taharah",
      title: "Unit 2 — Purification (ṭahārah)",
      goal: "Know why purity matters and the main types (wuḍūʾ, ghusl overview).",
      lessons: [
        {
          id: "jh-u2-l1",
          title: "Cleanliness is half of faith",
          minutes: 10,
          video: { title: "Purification and prayer foundations", list: "PLQ02IYL5pmhHFl7j6wPcFTZmlQvRhsejp", href: "https://www.youtube.com/playlist?list=PLQ02IYL5pmhHFl7j6wPcFTZmlQvRhsejp", note: "Educational overview — learn wuḍūʿ steps with a local teacher." },
          points: [
            "Prayer needs purity of body and place.",
            "Wuḍūʾ: wash face, arms, wipe head, wash feet — learn steps with a teacher or reliable guide.",
            "Junior-high goal: understand the map; perfect form with practice."
          ],
          openCard: "salah-starter-card",
          links: [
            { label: "BeginIslam — Worship guide", href: "https://beginislam.org/" }
          ]
        },
        {
          id: "jh-u2-l2",
          title: "When to renew",
          minutes: 8,
          points: [
            "Wuḍūʾ breaks with certain events (e.g. using the toilet, deep sleep) — confirm details with a local teacher.",
            "Ghusl is required after major impurity — learn the obligation list carefully.",
            "When unsure, ask — do not guess on worship."
          ],
          openCard: "fiqh-quiz-card",
          links: []
        }
      ]
    },
    {
      id: "jh-u3-salah",
      title: "Unit 3 — Prayer (ṣalāh)",
      goal: "Build a working daily prayer habit with correct outline.",
      lessons: [
        {
          id: "jh-u3-l1",
          title: "Five prayers — the spine of the day",
          minutes: 12,
          video: { title: "Prayer guidance series", list: "PLVnvYMcW6CAEZSZcuwfeTO7EdqpPS3_qs", href: "https://www.youtube.com/playlist?list=PLVnvYMcW6CAEZSZcuwfeTO7EdqpPS3_qs", note: "Watch for overview; perfect form with a teacher." },
          points: [
            "Fajr, Ẓuhr, ʿAṣr, Maghrib, ʿIshāʾ structure the day.",
            "Open Salah Starter and follow one prayer slowly.",
            "Minimum: facing Qiblah, intention, Takbīr, Fātiḥah, rukūʿ, sujūd, salām — verify with a guide."
          ],
          openCard: "salah-starter-card",
          links: [
            { label: "Qur'an 4:103", href: "https://quran.com/4/103" }
          ]
        },
        {
          id: "jh-u3-l2",
          title: "What to recite first",
          minutes: 10,
          points: [
            "Al-Fātiḥah is required in every unit of prayer.",
            "Add short sūrahs as you learn (e.g. Al-Ikhlāṣ).",
            "Use Notes to write lines you are memorizing."
          ],
          openCard: "commands-card",
          links: [
            { label: "Qur'an 1 — Al-Fātiḥah", href: "https://quran.com/1" },
            { label: "Qur'an 112", href: "https://quran.com/112" }
          ]
        },
        {
          id: "jh-u3-l3",
          title: "Fiqh quiz — check yourself",
          minutes: 10,
          points: [
            "Take the Fiqh Quiz module to spot gaps.",
            "Wrong answers are teachers — review, then retest.",
            "Local mosque class beats internet alone for prayer form."
          ],
          openCard: "fiqh-quiz-card",
          links: []
        }
      ]
    },
    {
      id: "jh-u4-halal-day",
      title: "Unit 4 — Daily ḥalāl map",
      goal: "Food, speech, and earnings — simple boundaries.",
      lessons: [
        {
          id: "jh-u4-l1",
          title: "Eat of the good things",
          minutes: 8,
          points: [
            "Ḥalāl food and drink matter; avoid what is clearly forbidden (e.g. pork, alcohol).",
            "When labels are unclear, ask and choose the safer option.",
            "Gratitude before and after eating is Prophetic adab."
          ],
          openCard: "tibbe-nabwi-card",
          links: [{ label: "Qur'an 2:168", href: "https://quran.com/2/168" }]
        },
        {
          id: "jh-u4-l2",
          title: "Speech and screens",
          minutes: 8,
          points: [
            "Truthfulness and avoiding mockery protect the heart.",
            "Backbiting and gossip harm; silence can be worship.",
            "One honest conversation is better than an hour of empty scroll."
          ],
          openCard: "cw-card",
          links: []
        }
      ]
    },
    {
      id: "jh-u5-calendar",
      title: "Unit 5 — Ramadan, Zakāh, Ḥajj (overview)",
      goal: "Know the yearly pillars at junior-high depth.",
      lessons: [
        {
          id: "jh-u5-l1",
          title: "Fasting — why and how (overview)",
          minutes: 10,
          points: [
            "Ramadan trains taqwā and empathy.",
            "Who must fast and who is excused needs a teacher’s detail.",
            "Start by respecting the month and learning the timetable."
          ],
          openCard: "commands-card",
          links: [{ label: "Qur'an 2:183", href: "https://quran.com/2/183" }]
        },
        {
          id: "jh-u5-l2",
          title: "Zakāh & Ḥajj — maps for later",
          minutes: 8,
          points: [
            "Zakāh purifies wealth; thresholds and rates need calculation help.",
            "Ḥajj is once in a lifetime for those able — see Hajj Guide for the journey map.",
            "Junior-high: know they exist and why; details when you are ready."
          ],
          openCard: "hajj-guide-card",
          links: []
        }
      ]
    },
    {
      id: "jh-u6-seerah-practice",
      title: "Unit 6 — Seerah into practice",
      goal: "Connect the Prophet’s life ﷺ to daily choices.",
      lessons: [
        {
          id: "jh-u6-l1",
          title: "Mercy in action",
          minutes: 10,
          video: { title: "Sealed Nectar — Seerah for practice", list: "PLGlK3JqJXED8GhgIczDFEqEM0uFWfGN5X", href: "https://www.youtube.com/playlist?list=PLGlK3JqJXED8GhgIczDFEqEM0uFWfGN5X", note: "One episode is enough for this module." },
          points: [
            "Read one Seerah Live segment slowly.",
            "Extract one behavior to try today (patience, honesty, kindness).",
            "Mark the lesson done only after the action."
          ],
          openCard: "seerah-live-card",
          links: [{ label: "Qur'an 33:21", href: "https://quran.com/33/21" }]
        },
        {
          id: "jh-u6-l2",
          title: "Promotion checkpoint",
          minutes: 5,
          points: [
            "If prayer outline is stable and Units 1–5 feel familiar, you are ready for Daily (high-school) track.",
            "Keep Notes of questions for a teacher.",
            "Junior high is practice; high school adds tajweed, tafseer, and depth."
          ],
          openCard: "ilm-pathway-card",
          links: []
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
