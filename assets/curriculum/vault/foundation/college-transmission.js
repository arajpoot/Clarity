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
    /* College of Transmission — Daʿi
       Usul al-Da'wah, ethics, knowledge before speech — Madinah Da'wah faculty spirit + Azhar Da'wah.
       Educational only — not a fatwa or licence to issue rulings. */
    {
      id: "dai-u1-ethics",
      title: "Unit 1 — Ethics of the caller",
      goal: "Sincerity, mercy, and knowledge before speech.",
      lessons: [
        {
          id: "dai-u1-l1",
          title: "Intention and humility",
          minutes: 15,
          points: [
            "Call to Allah — not to ego, brand, or argument score.",
            "Mercy and wisdom are conditions of beautiful calling.",
            "You remain a student even when teaching basics."
          ],
          ayah: { ref: "Qur'an 16:125", en: "Invite to the way of your Lord with wisdom and good instruction…" },
          deepLearn: [
            { label: "Qur'an 16:125", href: "https://quran.com/16/125" },
            { label: "Qur'an 12:108", href: "https://quran.com/12/108" }
          ]
        },
        {
          id: "dai-u1-l2",
          title: "Knowledge before speech",
          minutes: 14,
          points: [
            "Do not teach what you have not verified.",
            "Refer complex questions to qualified scholars.",
            "This college trains adab — it is not ijazah or fatwa authority."
          ],
          ayah: { ref: "Qur'an 17:36", en: "Do not pursue that of which you have no knowledge…" },
          deepLearn: [
            { label: "Qur'an 17:36", href: "https://quran.com/17/36" }
          ]
        }
      ]
    },
    {
      id: "dai-u2-sources",
      title: "Unit 2 — Source discipline",
      goal: "Qur'an and Sunnah first; cite carefully.",
      lessons: [
        {
          id: "dai-u2-l1",
          title: "Primary sources in speech",
          minutes: 15,
          points: [
            "Prefer clear Qur'an and well-known authentic hadith for public teaching.",
            "Avoid weak or fabricated reports; when unsure, stay silent on the claim."
          ],
          deepLearn: [
            { label: "quran.com", href: "https://quran.com" },
            { label: "sunnah.com", href: "https://sunnah.com" }
          ]
        },
        {
          id: "dai-u2-l2",
          title: "Citing and context",
          minutes: 12,
          points: [
            "Quote with reference when possible.",
            "Context of revelation and scholarly explanation matter for sensitive verses."
          ],
          deepLearn: [
            { label: "SeekersGuidance", href: "https://seekersguidance.org/" },
            { label: "Yaqeen Institute", href: "https://yaqeeninstitute.org/" }
          ]
        }
      ]
    },
    {
      id: "dai-u3-audience",
      title: "Unit 3 — Audience & wisdom",
      goal: "Speak to the level of the listener.",
      lessons: [
        {
          id: "dai-u3-l1",
          title: "New Muslim and seeker care",
          minutes: 14,
          points: [
            "Begin with Tawhid and hope; do not overload with advanced disputes.",
            "Protect dignity; private faults are not public content."
          ],
          ayah: { ref: "Qur'an 20:44", en: "Speak to him mildly…" },
          deepLearn: [
            { label: "Qur'an 20:44", href: "https://quran.com/20/44" }
          ]
        },
        {
          id: "dai-u3-l2",
          title: "Disagreement with adab",
          minutes: 12,
          points: [
            "Difference among scholars is not a licence for harshness.",
            "Public da'wah avoids takfir culture and mockery."
          ],
          deepLearn: [
            { label: "Qur'an 49:11", href: "https://quran.com/49/11" }
          ]
        }
      ]
    },
    {
      id: "dai-u4-service",
      title: "Unit 4 — Service & continuity",
      goal: "Dawah as service; keep learning after any diploma on this device.",
      lessons: [
        {
          id: "dai-u4-l1",
          title: "Service over platform",
          minutes: 12,
          points: [
            "Help with teaching basics, charity logistics, or mosque needs as able.",
            "Online reach without knowledge is a trust tested."
          ],
          deepLearn: [
            { label: "Qur'an 61:2-3", href: "https://quran.com/61/2-3" }
          ]
        },
        {
          id: "dai-u4-l2",
          title: "Never graduate from learning",
          minutes: 10,
          points: [
            "Device diplomas mark milestones on this path — not scholarly authority.",
            "Continue with teachers, books, and sincere company."
          ],
          ayah: { ref: "Qur'an 20:114", en: "My Lord, increase me in knowledge." },
          deepLearn: [
            { label: "Qur'an 20:114", href: "https://quran.com/20/114" }
          ]
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

(function(g){
  if (g.__CLARITY_SOURCE_FOOTER_V1__) return;
  g.__CLARITY_SOURCE_FOOTER_V1__ = true;
  g.clarityModuleSourceFooter = function(ref){
    ref = ref || "Qur'an & authentic Sunnah — verify with a qualified local scholar";
    return '<p class="notes-hint" style="font-size:0.8rem;opacity:0.9;margin-top:0.5rem">Source orientation: '+ref+'. Educational only — not a fatwa.</p>';
  };
})(typeof window!=="undefined"?window:this);
