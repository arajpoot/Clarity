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
      {
        id: "hs-u1",
        title: "Unit 1 — Tajweed lab",
        goal: "Move from reading to measured practice with a teacher-grade visual guide.",
        lessons: [
          {
            id: "hs-u1-l1",
            title: "One rule, one ayah",
            minutes: 20,
            points: [
              "Open Tajweed studio on this device.",
              "Watch one beginner tajweed lesson below.",
              "Pick one rule (e.g. qalqalah) and apply it to one ayah.",
              "Record yourself once and note one improvement."
            ],
            openCard: "tajweed-live-card",
            video: {
              title: "Tajweed the easy way — beginner series",
              list: "PL62RQxDpIL7UAWIf4ZHOH5aJIt3YHc7rg",
              href: "https://www.youtube.com/playlist?list=PL62RQxDpIL7UAWIf4ZHOH5aJIt3YHc7rg",
              note: "Educational playlist already used in Clarity lectures. Practice with a local teacher for correction."
            },
            activity: { type: "project", prompt: "Note rule + ayah + one improvement in Notes." }
          },
          {
            id: "hs-u1-l2",
            title: "Listening lab — measured recitation",
            minutes: 15,
            points: [
              "Listen to a short measured recitation.",
              "Shadow-read (whisper along) for two minutes.",
              "Write one letter or rule you will focus on this week."
            ],
            openCard: "tajweed-live-card",
            video: {
              title: "Ustazah Najiha Hashmi — recitation focus",
              id: "MUDNDj4n7I4",
              href: "https://www.youtube.com/watch?v=MUDNDj4n7I4",
              mins: "varies",
              note: "Use as listening model only — not a substitute for a live teacher."
            },
            activity: { type: "write", prompt: "One focus letter/rule for the week." }
          }
        ]
      },
      {
        id: "hs-u2",
        title: "Unit 2 — Tafseer and deepen",
        goal: "Read meaning with tools, not vibes alone.",
        lessons: [
          {
            id: "hs-u2-l1",
            title: "Deepen study path",
            minutes: 20,
            points: [
              "Open Deepen / Tafseer resources in Clarity.",
              "Watch one short foundational reflection below.",
              "Write three takeaways and one question for a teacher."
            ],
            openCard: "deepen-study-card",
            video: {
              title: "Yaqeen / curated reflections playlist",
              list: "PLQ02IYL5pmhHFl7j6wPcFTZmlQvRhsejp",
              href: "https://www.youtube.com/playlist?list=PLQ02IYL5pmhHFl7j6wPcFTZmlQvRhsejp",
              note: "Pick one talk. Educational only — verify fiqh and aqidah with a qualified local scholar."
            },
            activity: { type: "write", prompt: "Three takeaways + one question for a teacher." }
          },
          {
            id: "hs-u2-l2",
            title: "Names of Allah — knowing before acting",
            minutes: 15,
            points: [
              "Study one Name of Allah with a short lecture.",
              "Link the Name to one action today (hope, patience, gratitude)."
            ],
            openCard: "callig-lab-card",
            video: {
              title: "99 Names of Allah — lecture series",
              list: "PLQ02IYL5pmhH0KWBrGxxR-lCCwlTFIVbm",
              href: "https://www.youtube.com/playlist?list=PLQ02IYL5pmhH0KWBrGxxR-lCCwlTFIVbm",
              note: "Reflect on one Name; do not invent rulings from a single talk."
            },
            activity: { type: "write", prompt: "Name · meaning in your words · one action." }
          }
        ]
      },
      {
        id: "hs-u3",
        title: "Unit 3 — Weekly review and deeds",
        goal: "Close the week with honest review and prophetic character.",
        lessons: [
          {
            id: "hs-u3-l1",
            title: "Weekly review",
            minutes: 15,
            points: [
              "Open Weekly Review card.",
              "Score honesty over perfection.",
              "Optional: a short reminder on character or repentance."
            ],
            openCard: "weekly-review-card",
            video: {
              title: "Character and spiritual growth talks",
              list: "PLVnvYMcW6CAEZSZcuwfeTO7EdqpPS3_qs",
              href: "https://www.youtube.com/playlist?list=PLVnvYMcW6CAEZSZcuwfeTO7EdqpPS3_qs",
              note: "Dr. Farhat Hashmi style reflections in Clarity library. Take what benefits; leave disputes to scholars."
            },
            activity: { type: "write", prompt: "Wins · misses · one next-week intention." }
          }
        ]
      },
      {
        id: "hs-u4",
        title: "Unit 4 — Beauty, craft, and consistency",
        goal: "Beauty and craft as study — not decoration only.",
        lessons: [
          {
            id: "hs-u4-l1",
            title: "Calligraphy or Asma session",
            minutes: 15,
            points: [
              "Practice one letter form or one Name reflection.",
              "Optional visual: calm Qur'an or Names session."
            ],
            openCard: "callig-lab-card",
            video: {
              title: "Qur'an beauty / focused session",
              id: "s17YH8xrCS8",
              href: "https://www.youtube.com/watch?v=s17YH8xrCS8",
              note: "Listening companion while you practice. Educational mood-setting only."
            },
            activity: { type: "project", prompt: "Photo or note of practice in Notes." }
          },
          {
            id: "hs-u4-l2",
            title: "Meme Studio — truthful reminder craft",
            minutes: 12,
            points: [
              "Open Meme Studio with a verified verse or hadith text.",
              "Craft one clean reminder; avoid mockery and doubtful claims."
            ],
            openCard: "meme-card",
            activity: { type: "project", prompt: "Export one reminder image for private notes only until reviewed." }
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

/* PRIORITY5_SOURCE — educational source reminder for module footers */
(function (g) {
  "use strict";
  if (g.__CLARITY_SOURCE_FOOTER_V1__) return;
  g.__CLARITY_SOURCE_FOOTER_V1__ = true;
  g.clarityModuleSourceFooter = function (ref) {
    ref = ref || "Qur'an & authentic Sunnah — verify with a qualified local scholar";
    return '<p class="notes-hint clarity-module-src" style="font-size:0.8rem;opacity:0.9;margin-top:0.5rem">Source orientation: ' + ref + '. Educational only — not a fatwa.</p>';
  };
})(typeof window !== "undefined" ? window : this);
