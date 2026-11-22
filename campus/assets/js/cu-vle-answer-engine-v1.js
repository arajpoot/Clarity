/*! cu-vle-answer-engine-v1 · U58
 * Hardened short answers + full-answer links. Not help-book object tips.
 * Educational only — not a fatwa · not a grade of īmān · not a living scholar
 */
(function (w) {
  "use strict";
  if (w.ClarityAnswerEngine) return;

  var BRIEFS = [
    {
      id: "iman",
      keys: [/\biman\b/i, /īmān/i, /\bfaith\b/i, /believe/i, /belief/i],
      short:
        "Īmān is belief held in the heart, affirmed by the tongue, and shown in action. It rises with obedience and falls with sin. Learn the six pillars as a map, then live them with sincerity — not as a slogan.",
      links: [
        { label: "Qurʾān 2:285 · full", href: "https://quran.com/2/285" },
        { label: "Qurʾān 4:136 · full", href: "https://quran.com/4/136" },
        { label: "SeekersGuidance · īmān", href: "https://seekersguidance.org/?s=iman" },
        { label: "Seeker desk", href: "/campus/desk/seeker/" }
      ]
    },
    {
      id: "tawhid",
      keys: [/tawhid/i, /tawḥīd/i, /oneness/i, /\bshirk\b/i],
      short:
        "Tawḥīd is worshipping Allāh alone — in Lordship, worship, and His Names and Attributes. Protect it by learning what harms it, with a teacher you trust.",
      links: [
        { label: "Sūrat al-Ikhlāṣ · full", href: "https://quran.com/112" },
        { label: "SeekersGuidance · tawhid", href: "https://seekersguidance.org/?s=tawhid" },
        { label: "Seeker desk", href: "/campus/desk/seeker/" }
      ]
    },
    {
      id: "prayer",
      keys: [/salah/i, /ṣalāh/i, /\bprayer\b/i, /wudu/i, /wuḍū/i, /purity/i],
      short:
        "Ṣalāh is the daily pillar of practice. Use Campus only as a study map — confirm purification and prayer steps with a local teacher.",
      links: [
        { label: "SeekersGuidance · prayer", href: "https://seekersguidance.org/?s=prayer" },
        { label: "Sunnah.com · prayer", href: "https://sunnah.com/search?q=prayer" },
        { label: "Practice desk", href: "/campus/desk/practice/" }
      ]
    },
    {
      id: "quran",
      keys: [/quran/i, /qurʾān/i, /qur'an/i, /recit/i, /tajweed/i],
      short:
        "Sit with one āyah at a time. Recite with adab; learn tajweed step by step. Craft labs support practice — they do not certify.",
      links: [
        { label: "Qurʾān.com", href: "https://quran.com" },
        { label: "Tajweed lab", href: "/craft/tajweed/" },
        { label: "SeekersGuidance · Qurʾān", href: "https://seekersguidance.org/?s=quran" }
      ]
    },
    {
      id: "wasiyyah",
      keys: [/wasiy/i, /waṣiy/i, /inherit/i, /faraid/i, /farā/i, /mirath/i, /mīrāth/i, /\bwill\b/i],
      short:
        "Wasiyyah and farāʾiḍ are trusts. Clarity only opens educational Amānah tools — not a will, not a fatwa, not legal advice. Seek qualified counsel in your jurisdiction.",
      links: [
        { label: "Amānah · Wasiyyah", href: "/amana/wasiyyah/" },
        { label: "Campus Mīrāth", href: "/campus/mirath/" },
        { label: "Charter limits", href: "/campus/charter/" }
      ]
    }
  ];

  var FALLBACKS = [
    "Ask with sincerity. Use allowlisted sources below, then confirm with a local teacher.",
    "One clear question and one reliable source beat many hurried tabs.",
    "Campus is a study mirror — not a fatwa desk and not a grade of īmān."
  ];

  function match(q) {
    var s = String(q || "");
    for (var i = 0; i < BRIEFS.length; i++) {
      var b = BRIEFS[i];
      for (var k = 0; k < b.keys.length; k++) {
        if (b.keys[k].test(s)) return b;
      }
    }
    return null;
  }

  function answer(q) {
    var b = match(q);
    if (b) {
      return { id: b.id, short: b.short, links: b.links.slice(), source: "answer-engine" };
    }
    var fb = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
    var enc = encodeURIComponent(String(q || "").trim() || "islam");
    return {
      id: "general",
      short: fb,
      links: [
        { label: "Qurʾān.com search · full", href: "https://quran.com/search?q=" + enc },
        { label: "Sunnah.com search · full", href: "https://sunnah.com/search?q=" + enc },
        { label: "SeekersGuidance · full", href: "https://seekersguidance.org/?s=" + enc },
        { label: "Campus library", href: "/campus/library/" }
      ],
      source: "answer-engine-general"
    };
  }

  w.ClarityAnswerEngine = {
    version: "U58",
    answer: answer,
    match: match
  };
})(window);
