/**
 * cu-seq-modules-v1.js — Ordered modules for four University stages
 * Educational only — not a fatwa. Prefer Qurʾān + ṣaḥīḥ; where text does not settle, stop.
 */
(function (g) {
  "use strict";
  if (g.CU_SEQ_MODULES) return;

  function q(ref, en, href) {
    return { type: "quran", ref: ref, en: en, href: href };
  }
  function h(ref, en, href) {
    return { type: "hadith", ref: ref, en: en, href: href || "https://sunnah.com/" };
  }

  g.CU_SEQ_MODULES = {
    version: 1,
    stages: {
      seeker: {
        id: "seeker",
        title: "Seeker · Essentials",
        aim: "Belief, basic worship awareness, character, one short Qurʾān practice.",
        modules: [
          {
            id: "seeker.m1",
            title: "Allah is One",
            aim: "Hold tawḥīd: Allah alone creates and deserves worship.",
            source: q("Qurʾān 112:1–4", "Say: He is Allah, One…", "https://quran.com/112"),
            adab: "Sit with a calm heart. This is knowledge of Allah — not debate sport.",
            action: "Before one ordinary task today, say Bismillāh and intend it for Allah alone.",
            quiz: [
              { q: "Tawḥīd means primarily:", opts: ["Allah is One, without partner in lordship and worship", "A cultural slogan", "A political party"], a: 0 }
            ]
          },
          {
            id: "seeker.m2",
            title: "Allah sees and knows",
            aim: "Live with sincerity: He knows what is shown and what is hidden.",
            source: q("Qurʾān 67:13–14", "Whether you conceal speech or declare it…", "https://quran.com/67/13"),
            adab: "Let this soften the tongue — He hears every word.",
            action: "Pause once today before speaking; ask if the words are true and kind.",
            quiz: [
              { q: "Allah’s knowledge:", opts: ["Includes what we hide and what we show", "Only covers public acts", "Is like human guessing"], a: 0 }
            ]
          },
          {
            id: "seeker.m3",
            title: "Worship is for Him alone",
            aim: "Direct duʿāʾ and dependence to Allah alone.",
            source: q("Qurʾān 1:5", "You alone we worship, and You alone we ask for help.", "https://quran.com/1/5"),
            adab: "Duʿāʾ is conversation with the Lord, not performance.",
            action: "Make one private duʿāʾ today asking only Allah for help in a real need.",
            quiz: [
              { q: "Seeking help in worship and need is directed:", opts: ["To Allah alone", "To the creation first", "Only to public rituals"], a: 0 }
            ]
          },
          {
            id: "seeker.m4",
            title: "Character: truth and kindness",
            aim: "Faith shows in manners — truthfulness and restraint of harm.",
            source: h("See Bukhārī / Muslim on truthfulness", "Truthfulness leads to righteousness…", "https://sunnah.com/bukhari:6094"),
            adab: "Correct yourself before correcting others.",
            action: "Choose one conversation today to speak only what is true and needed.",
            quiz: [
              { q: "A sign of sincere faith includes:", opts: ["Truthfulness and avoiding harm to others", "Winning arguments online", "Collecting slogans"], a: 0 }
            ]
          },
          {
            id: "seeker.m5",
            title: "Prayer awareness",
            aim: "Know that ṣalāh is a pillar — learn its place with humility.",
            source: q("Qurʾān 2:238", "Be watchful over the prayers…", "https://quran.com/2/238"),
            adab: "This is awareness and encouragement — not a personal ruling on your past.",
            action: "Note the next prayer time in your area and prepare for it calmly.",
            quiz: [
              { q: "Regarding ṣalāh, a seeker should:", opts: ["Treat it as a central daily duty and learn with a teacher when unsure", "Ignore it until later years", "Replace it with opinions"], a: 0 }
            ]
          },
          {
            id: "seeker.m6",
            title: "Short Qurʾān practice",
            aim: "Read or listen to a short sūrah with meaning — not race.",
            source: q("Qurʾān 96:1", "Read in the name of your Lord who created.", "https://quran.com/96"),
            adab: "Recitation is worship; do not rush for a score.",
            action: "Read or listen to Sūrat al-Ikhlāṣ once with its meaning today.",
            quiz: [
              { q: "Short Qurʾān practice is meant to:", opts: ["Connect heart and tongue with revelation", "Finish a leaderboard", "Replace learning with a teacher"], a: 0 }
            ]
          }
        ]
      },
      practice: {
        id: "practice",
        title: "Practice · Foundations",
        aim: "Purification and prayer essentials, one ḥadīth practice, simple Arabic reading.",
        modules: [
          {
            id: "practice.m1",
            title: "Purity: wuḍūʾ awareness",
            aim: "Know that prayer needs purity; learn the steps with a reliable teacher when unsure.",
            source: q("Qurʾān 5:6", "When you rise to prayer, wash your faces and your hands…", "https://quran.com/5/6"),
            adab: "Educational outline only — verify details with a living teacher.",
            action: "Review the main limbs of wuḍūʾ once from a trusted basic text or teacher.",
            quiz: [
              { q: "Wuḍūʾ is:", opts: ["A condition related to prayer taught in the Qurʾān and Sunnah", "Optional decoration", "Replaced by intention alone in all cases"], a: 0 }
            ]
          },
          {
            id: "practice.m2",
            title: "Prayer: structure in brief",
            aim: "Recognize the main parts of ṣalāh without inventing rulings.",
            source: h("Prophetic prayer described in ṣaḥīḥ collections", "Pray as you have seen me pray.", "https://sunnah.com/bukhari:631"),
            adab: "Where details differ, ask a teacher — this page does not settle disputes.",
            action: "Name the main pillars you know (standing, recitation, rukūʿ, sujūd) and note one gap to ask a teacher.",
            quiz: [
              { q: "When a detail of prayer is unclear:", opts: ["Ask a qualified teacher; do not invent from a webpage", "Invent from social media", "Ignore the prayer"], a: 0 }
            ]
          },
          {
            id: "practice.m3",
            title: "One ḥadīth practice",
            aim: "Act on one short authentic reminder about manners.",
            source: h("Muslim / Bukhārī — religion is sincere advice", "The religion is naṣīḥah…", "https://sunnah.com/muslim:55"),
            adab: "Naṣīḥah begins with sincerity to Allah, then care for people.",
            action: "Give one gentle, sincere advice only if asked — or improve yourself silently.",
            quiz: [
              { q: "Naṣīḥah is best practiced as:", opts: ["Sincerity to Allah and sincere care, not harsh exposure", "Public shaming", "Empty slogans"], a: 0 }
            ]
          },
          {
            id: "practice.m4",
            title: "Simple Arabic reading",
            aim: "Read a few letters or a short word with Lab Arabic — pattern practice only.",
            source: q("Qurʾān 12:2", "We have sent it down as an Arabic Qurʾān…", "https://quran.com/12/2"),
            adab: "Not a grammar fatwa. Lab is practice, not certification.",
            action: "Open Lab → Arabic and complete five flashcards of Everyday words.",
            quiz: [
              { q: "Arabic lab practice is:", opts: ["A learning aid — verify serious study with a teacher", "A substitute for scholars", "A certificate of fluency"], a: 0 }
            ],
            labLink: "/lab/arabic/"
          },
          {
            id: "practice.m5",
            title: "Daily rhythm",
            aim: "Tie knowledge to a small daily return — one prayer, one dhikr, one kind act.",
            source: q("Qurʾān 73:8", "And remember the name of your Lord…", "https://quran.com/73/8"),
            adab: "Consistency beats intensity that dies in a week.",
            action: "Choose one fixed slot tomorrow for a short dhikr after a prayer.",
            quiz: [
              { q: "A sustainable practice looks like:", opts: ["Small daily return you can keep", "One long night then nothing", "Only public posts"], a: 0 }
            ]
          },
          {
            id: "practice.m6",
            title: "Foundations check",
            aim: "Review: tawḥīd, purity awareness, prayer duty, one ḥadīth, one Arabic step.",
            source: q("Qurʾān 2:177", "Righteousness is not that you turn your faces…", "https://quran.com/2/177"),
            adab: "Self-check is not a grade of īmān.",
            action: "Write three lines: what is clearer now, what still needs a teacher.",
            quiz: [
              { q: "This stage is complete when you have:", opts: ["Honestly worked the modules and know what to ask a teacher", "Defeated others in debate", "Collected certificates"], a: 0 }
            ]
          }
        ]
      },
      consistency: {
        id: "consistency",
        title: "Consistency",
        aim: "Review essentials and add one deeper module (light tafsīr or sīrah).",
        modules: [
          {
            id: "consistency.m1",
            title: "Review: tawḥīd in daily speech",
            aim: "Return to “Allah is One” in how you speak about power and praise.",
            source: q("Qurʾān 3:26", "Say: O Allah, Owner of dominion…", "https://quran.com/3/26"),
            action: "Catch one moment of attributing success only to creation; correct it gently.",
            quiz: [
              { q: "Consistency in tawḥīd includes:", opts: ["Speech and heart returning to Allah’s oneness", "Repeating slogans only", "Ignoring manners"], a: 0 }
            ]
          },
          {
            id: "consistency.m2",
            title: "Review: prayer presence",
            aim: "One practical step toward calmer ṣalāh.",
            source: q("Qurʾān 23:1–2", "Successful are the believers who are humble in their prayers.", "https://quran.com/23/1"),
            action: "In one prayer today, slow the first takbīr and the first sitting.",
            quiz: [
              { q: "Khushūʿ is helped by:", opts: ["Presence and humility, learned over time", "Speed only", "Showing off"], a: 0 }
            ]
          },
          {
            id: "consistency.m3",
            title: "Light tafsīr: Sūrat al-Fātiḥah",
            aim: "Know the main themes of al-Fātiḥah as guidance and dependence.",
            source: q("Qurʾān 1:1–7", "In the name of Allah… Guide us to the straight path.", "https://quran.com/1"),
            adab: "Brief meanings only — full tafsīr is with qualified teachers.",
            action: "After reading the meaning once, make duʿāʾ for guidance in your own words.",
            quiz: [
              { q: "Al-Fātiḥah centers on:", opts: ["Praise of Allah, worship, and asking for guidance", "History only", "Politics only"], a: 0 }
            ]
          },
          {
            id: "consistency.m4",
            title: "Light sīrah: mercy of the Prophet ﷺ",
            aim: "Recall that his mission is mercy — manners follow knowledge.",
            source: q("Qurʾān 21:107", "We have not sent you except as a mercy to the worlds.", "https://quran.com/21/107"),
            adab: "Educational reminder — not a full sīrah course.",
            action: "Choose one act of mercy today (family, neighbor, or silence from harm).",
            quiz: [
              { q: "Following the Prophet ﷺ includes:", opts: ["Mercy and good character alongside belief", "Harshness in every debate", "Ignoring the vulnerable"], a: 0 }
            ]
          },
          {
            id: "consistency.m5",
            title: "Review loop",
            aim: "Revisit one incomplete habit from Seeker or Practice.",
            source: q("Qurʾān 94:5–6", "With hardship comes ease…", "https://quran.com/94"),
            action: "Pick one missed small practice and do it once without guilt-spiral.",
            quiz: [
              { q: "Consistency means:", opts: ["Returning after slipping, with hope", "Never slipping", "Public perfection"], a: 0 }
            ]
          },
          {
            id: "consistency.m6",
            title: "Stage seal",
            aim: "Confirm review + one deeper reading before Transmission.",
            source: q("Qurʾān 16:125", "Invite to the way of your Lord with wisdom…", "https://quran.com/16/125"),
            adab: "Invitation comes after grounding — nothing before its time.",
            action: "List what you will not teach others until a teacher confirms it.",
            quiz: [
              { q: "Before sharing advanced claims you should:", opts: ["Be grounded and verify with knowledge and teachers", "Post first", "Copy viral claims"], a: 0 }
            ]
          }
        ]
      },
      transmission: {
        id: "transmission",
        title: "Transmission",
        aim: "Source hygiene, adab of sharing, and stopping where the text does not settle the point.",
        modules: [
          {
            id: "transmission.m1",
            title: "Source hygiene",
            aim: "Prefer Qurʾān and ṣaḥīḥ; name the collection when citing ḥadīth.",
            source: h("Discipline of narration", "Convey from me even a verse… (with integrity of transmission)", "https://sunnah.com/bukhari:3461"),
            adab: "Do not attribute to the Prophet ﷺ what you have not verified.",
            action: "Find one Islamic claim you shared before; check if it has a clear source.",
            quiz: [
              { q: "Source hygiene means:", opts: ["Verify and name sources; avoid weak viral claims", "Share first, check never", "Only use anonymous posts"], a: 0 }
            ]
          },
          {
            id: "transmission.m2",
            title: "Adab of sharing",
            aim: "Share to benefit, not to win; privacy and fairness matter.",
            source: q("Qurʾān 49:12", "Avoid much suspicion… and do not spy or backbite…", "https://quran.com/49/12"),
            action: "Delete or withhold one post that exposes someone’s fault without need.",
            quiz: [
              { q: "Adab of sharing includes:", opts: ["Avoiding backbiting and needless exposure", "Screenshotting private mistakes", "Mocking seekers"], a: 0 }
            ]
          },
          {
            id: "transmission.m3",
            title: "Text does not settle this",
            aim: "Stop when a page cannot answer a detailed ruling — refer to a teacher.",
            source: q("Qurʾān 16:43", "Ask the people of knowledge if you do not know.", "https://quran.com/16/43"),
            adab: "This University is educational only — not a fatwa service.",
            action: "Write one question you will take to a living teacher, not to a comment section.",
            quiz: [
              { q: "When a webpage cannot settle a ruling:", opts: ["Stop and ask a qualified teacher", "Invent an answer", "Follow the loudest account"], a: 0 }
            ]
          },
          {
            id: "transmission.m4",
            title: "Wisdom in invitation",
            aim: "Invite with wisdom and gentle preaching; no compulsion in the faith’s acceptance.",
            source: q("Qurʾān 16:125", "Invite to the way of your Lord with wisdom and good instruction…", "https://quran.com/16/125"),
            action: "If you share one reminder today, keep it short, sourced, and kind.",
            quiz: [
              { q: "Daʿwah on this path emphasizes:", opts: ["Wisdom, good instruction, and patience", "Force and mockery", "Debating for ego"], a: 0 }
            ]
          },
          {
            id: "transmission.m5",
            title: "Limits of this University",
            aim: "State clearly: not accredited, not a grade of īmān, not a seminary.",
            source: q("Qurʾān 17:36", "Do not pursue that of which you have no knowledge…", "https://quran.com/17/36"),
            action: "Read the Charter footer once and accept the limits before teaching others from these pages.",
            quiz: [
              { q: "Clarity University markers are:", opts: ["Study aids on this device — not faith grades or accreditation", "Official seminary degrees", "Fatwa certificates"], a: 0 }
            ]
          },
          {
            id: "transmission.m6",
            title: "Transmission seal",
            aim: "Carry essentials with adab; keep learning with people of knowledge.",
            source: q("Qurʾān 20:114", "My Lord, increase me in knowledge.", "https://quran.com/20/114"),
            action: "Plan one next step with a real teacher, class, or verified local resource.",
            quiz: [
              { q: "After these stages a student should:", opts: ["Continue with teachers and verified sources", "Stop all learning", "Declare themselves a mufti"], a: 0 }
            ]
          }
        ]
      }
    }
  };
})(typeof window !== "undefined" ? window : this);
