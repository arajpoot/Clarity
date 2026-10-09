/* Sequential curriculum Phase 4 — Da'i + lecture visual aides */
(function (g) {
  "use strict";
  if (g.__CLARITY_DAI_UNIVERSITY_V2__) return;
  g.__CLARITY_DAI_UNIVERSITY_V2__ = true;
  g.__CLARITY_DAI_UNIVERSITY_V1__ = true;

  function boot() {
    if (!g.ClarityCurriculumEngine) {
      setTimeout(boot, 80);
      return;
    }
    var UNITS = [
      {
        id: "dai-u1",
        title: "Unit 1 — Usul al-Dawah and ethics of the caller",
        goal: "Define dawah with sincerity; protect intention and adab.",
        lessons: [
          {
            id: "dai-u1-l1",
            title: "Definition and intention",
            minutes: 15,
            points: [
              "Dawah is calling to Allah with knowledge and mercy.",
              "Intention: for Allah, not ego or audience size.",
              "Watch one foundational ethics talk, then write your intention."
            ],
            openCard: "dai-transmit-card",
            video: {
              title: "Foundations of calling to Allah — curated series",
              list: "PLQ02IYL5pmhHFl7j6wPcFTZmlQvRhsejp",
              href: "https://www.youtube.com/playlist?list=PLQ02IYL5pmhHFl7j6wPcFTZmlQvRhsejp",
              note: "Educational. Methods differ by school — confirm sensitive issues with a local scholar."
            },
            activity: {
              type: "write",
              prompt: "Write 4-6 lines: What is dawah, and what intention will you protect?",
              rubric: "Clear definition · sincere intention · no harshness"
            },
            links: [{ label: "Qur'an 16:125", href: "https://quran.com/16/125" }]
          },
          {
            id: "dai-u1-l2",
            title: "Adab of the dai",
            minutes: 12,
            points: [
              "Knowledge before speech; patience; humility; respect for the audience.",
              "Avoid mockery and compulsion — guidance is from Allah.",
              "List 5 character traits you will practice this week."
            ],
            openCard: "cw-card",
            video: {
              title: "Character growth lectures",
              list: "PLVnvYMcW6CAEZSZcuwfeTO7EdqpPS3_qs",
              href: "https://www.youtube.com/playlist?list=PLVnvYMcW6CAEZSZcuwfeTO7EdqpPS3_qs",
              note: "Take practical adab; leave advanced disputes to scholars."
            },
            activity: {
              type: "checklist",
              prompt: "Tick traits you will practice",
              items: ["Patience", "Humility", "Truthfulness", "Listening first", "Soft speech"]
            },
            links: []
          }
        ]
      },
      {
        id: "dai-u2",
        title: "Unit 2 — Prophetic method in dawah",
        goal: "Extract methods from the Seerah for real conversations.",
        lessons: [
          {
            id: "dai-u2-l1",
            title: "Seerah as method lab",
            minutes: 20,
            points: [
              "Study one Seerah episode: audience, message, tone, outcome.",
              "Prophets used hikmah, stories, questions, and lived example.",
              "Watch a Sealed Nectar segment, then write a method note."
            ],
            openCard: "sealed-nectar-card",
            video: {
              title: "Sealed Nectar — Seerah series",
              list: "PLGlK3JqJXED8GhgIczDFEqEM0uFWfGN5X",
              href: "https://www.youtube.com/playlist?list=PLGlK3JqJXED8GhgIczDFEqEM0uFWfGN5X",
              note: "Classic Seerah study aid already in Clarity. Cross-check details with a reliable teacher."
            },
            activity: {
              type: "write",
              prompt: "Method note: Audience / Message / Tone / One lesson for today",
              rubric: "Specific Seerah scene · transferable method · respectful tone"
            },
            links: [{ label: "Qur'an 33:21", href: "https://quran.com/33/21" }]
          },
          {
            id: "dai-u2-l2",
            title: "Samina — living transmission",
            minutes: 12,
            points: [
              "Dawah begins with personal obedience.",
              "Open Samina / Commands; teach one verse meaning to a family member (with adab)."
            ],
            openCard: "samina-verse-card",
            video: {
              title: "Ishaq / living Qur'an reminders",
              list: "PLH3gvuJis52MDUOlpiilZaJ_TNc8YMZVN",
              href: "https://www.youtube.com/playlist?list=PLH3gvuJis52MDUOlpiilZaJ_TNc8YMZVN",
              note: "Use as reminder fuel, not as a fatwa source."
            },
            activity: {
              type: "teachback",
              prompt: "Teach-back: explain one verse to someone (or record for yourself).",
              rubric: "Accurate meaning · soft tone · invited questions"
            },
            links: []
          }
        ]
      },
      {
        id: "dai-u3",
        title: "Unit 3 — Content craft (media-aware dawah)",
        goal: "Produce truthful, beautiful, Shariah-safe reminders.",
        lessons: [
          {
            id: "dai-u3-l1",
            title: "Meme Studio as reminder lab",
            minutes: 15,
            points: [
              "Truth over virality; cite sources; no mockery of people.",
              "Build one verse/hadith reminder and review wording carefully."
            ],
            openCard: "meme-card",
            video: {
              title: "Yaqeen media-literacy style talks (curated)",
              list: "PLQ02IYL5pmhHFl7j6wPcFTZmlQvRhsejp",
              href: "https://www.youtube.com/playlist?list=PLQ02IYL5pmhHFl7j6wPcFTZmlQvRhsejp",
              note: "Watch for framing ideas only. Your content must stay accurate and gentle."
            },
            activity: {
              type: "project",
              prompt: "One reminder card with source reference in Notes.",
              rubric: "Accurate text · clear source · respectful design"
            },
            links: []
          },
          {
            id: "dai-u3-l2",
            title: "Notes portfolio",
            minutes: 10,
            points: [
              "Keep a private portfolio of lessons, sources, and open questions.",
              "Export encrypted backup if using Amana Vault notes."
            ],
            openCard: "notes-shell",
            activity: { type: "write", prompt: "Portfolio index: 3 lessons · 2 sources · 1 open question." },
            links: []
          }
        ]
      },
      {
        id: "dai-u4",
        title: "Unit 4 — Clarity vs confusion (Israeliyat and caution)",
        goal: "Spot weak stories; prioritize Qur'an and authentic Sunnah.",
        lessons: [
          {
            id: "dai-u4-l1",
            title: "Israeliyat awareness",
            minutes: 15,
            points: [
              "Not every story circulating is authentic.",
              "When unsure, pause and ask a teacher before teaching others.",
              "Open the Israeliyat caution card in Clarity."
            ],
            openCard: "israeliyat-card",
            video: {
              title: "Careful study mindset — curated reflections",
              list: "PLQ02IYL5pmhHFl7j6wPcFTZmlQvRhsejp",
              href: "https://www.youtube.com/playlist?list=PLQ02IYL5pmhHFl7j6wPcFTZmlQvRhsejp",
              note: "Use talks to build caution habits; authentication needs hadith methodology with scholars."
            },
            activity: {
              type: "write",
              prompt: "One viral claim you will not share until verified — and why.",
              rubric: "Humility · source awareness · no mockery"
            },
            links: []
          }
        ]
      },
      {
        id: "dai-u5",
        title: "Unit 5 — Voice, Asma, Sealed Nectar depth",
        goal: "Know Allah's Names and the Prophet's life to call with light.",
        lessons: [
          {
            id: "dai-u5-l1",
            title: "Asma — knowing Allah to call to Him",
            minutes: 15,
            points: [
              "Study one Name deeply; let it shape how you speak about Allah.",
              "Avoid inventing meanings; stay with reliable explanations."
            ],
            openCard: "tajalliyat-lecture-card",
            video: {
              title: "99 Names lecture series",
              list: "PLQ02IYL5pmhH0KWBrGxxR-lCCwlTFIVbm",
              href: "https://www.youtube.com/playlist?list=PLQ02IYL5pmhH0KWBrGxxR-lCCwlTFIVbm",
              note: "One Name per session is enough. Educational reflection only."
            },
            activity: { type: "write", prompt: "Name · brief meaning · how it changes your dawah tone." },
            links: []
          },
          {
            id: "dai-u5-l2",
            title: "Sealed Nectar / timeline study",
            minutes: 20,
            points: [
              "Map one period of the Seerah (Makkah or Madinah).",
              "Note mercy, patience, and strategic wisdom for modern conversations."
            ],
            openCard: "sealed-nectar-card",
            video: {
              title: "Sealed Nectar — full series",
              list: "PLGlK3JqJXED8GhgIczDFEqEM0uFWfGN5X",
              href: "https://www.youtube.com/playlist?list=PLGlK3JqJXED8GhgIczDFEqEM0uFWfGN5X",
              open: false,
              note: "Watch one episode carefully; write timeline notes."
            },
            activity: { type: "write", prompt: "Timeline card: period · key event · one mercy lesson." },
            links: []
          }
        ]
      },
      {
        id: "dai-u6",
        title: "Unit 6 — Capstone portfolio",
        goal: "Assemble a humble, source-aware dawah portfolio.",
        lessons: [
          {
            id: "dai-u6-l1",
            title: "Capstone checklist",
            minutes: 20,
            points: [
              "Intention written · adab list · one Seerah method · one verified reminder · open questions for a teacher.",
              "Do not claim scholarship; remain a student who shares carefully."
            ],
            openCard: "dai-transmit-card",
            video: {
              title: "Final character reminder — growth playlist",
              list: "PLVnvYMcW6CAEZSZcuwfeTO7EdqpPS3_qs",
              href: "https://www.youtube.com/playlist?list=PLVnvYMcW6CAEZSZcuwfeTO7EdqpPS3_qs",
              note: "Close with humility. Educational only — not a certificate or fatwa license."
            },
            activity: {
              type: "checklist",
              prompt: "Capstone items",
              items: [
                "Written intention",
                "5 adab traits practiced",
                "Seerah method note",
                "One sourced reminder",
                "Questions list for a teacher"
              ]
            },
            links: []
          }
        ]
      }
    ];

    var track = g.ClarityCurriculumEngine.createTrack({
      phase: 4,
      progressKey: "clarity_dai_university_progress_v1",
      UNITS: UNITS,
      cardId: "dai-university-curriculum-card",
      progId: "dai-uni-progress",
      bodyId: "dai-uni-body",
      title: "Da'i University — Phase 4 · Transmit light + lectures",
      pathKey: "dai",
      tabId: "tab-action"
    });
    g.ClarityDaiUniversity = track;
    function sync() {
      var phaseNow = 1;
      try { phaseNow = parseInt(localStorage.getItem("clarity_curriculum_phase_v1") || "1", 10) || 1; } catch (e) {}
      track.show(phaseNow === 4);
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(sync, 200); setTimeout(sync, 1000); });
    else { setTimeout(sync, 200); setTimeout(sync, 1000); }
    g.addEventListener("clarity-path-changed", function () { setTimeout(sync, 100); });
    g.addEventListener("clarity-curriculum-phase", function () { setTimeout(sync, 80); });
  }
  boot();
})(typeof window !== "undefined" ? window : this);
