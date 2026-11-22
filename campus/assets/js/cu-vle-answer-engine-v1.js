/*! cu-vle-answer-engine-v1 · U61
 * Expanded educational keyword briefs + allowlisted full links.
 * NOT a fatwa engine · NOT a mufti · NOT a grade of īmān
 * Confirm practice and rulings with a qualified local teacher.
 */
(function (w) {
  "use strict";

  function L(label, href) {
    return { label: label, href: href };
  }
  function SG(q) {
    return L("SeekersGuidance · full", "https://seekersguidance.org/?s=" + encodeURIComponent(q));
  }
  function SN(q) {
    return L("Sunnah.com · full", "https://sunnah.com/search?q=" + encodeURIComponent(q));
  }
  function Q(path, label) {
    return L(label || "Qurʾān.com", "https://quran.com/" + path);
  }

  var BRIEFS = [
    { id: "iman", keys: [/\biman\b/i, /īmān/i, /\bfaith\b/i, /belie[fv]/i],
      short: "Īmān is belief in the heart, speech on the tongue, and action on the limbs. It increases with obedience and decreases with sin. Study the six pillars as a map, then live them with sincerity.",
      links: [Q("2/285", "Qurʾān 2:285"), Q("4/136", "Qurʾān 4:136"), SG("iman"), L("Seeker desk", "/campus/desk/seeker/")] },
    { id: "tawhid", keys: [/tawh[iī]d/i, /tawḥīd/i, /oneness/i, /\bshirk\b/i, /associat/i],
      short: "Tawḥīd is single-hearted worship of Allāh alone. Learn what protects it and what harms it — with a teacher, not from slogans alone.",
      links: [Q("112", "Sūrat al-Ikhlāṣ"), SG("tawhid"), L("Seeker desk", "/campus/desk/seeker/")] },
    { id: "islam", keys: [/\bislam\b/i, /five pillars/i, /arkan/i],
      short: "Islām’s five pillars (testimony, prayer, zakāh, fasting, ḥajj) structure practice. Campus maps are study aids — confirm details with a local teacher.",
      links: [SG("five pillars"), SN("pillars of islam"), L("Seeker desk", "/campus/desk/seeker/")] },
    { id: "ihsan", keys: [/ihsan/i, /iḥsān/i, /excellence/i],
      short: "Iḥsān is to worship Allāh as though you see Him — and though you do not see Him, He sees you. It is excellence of heart and deed.",
      links: [SN("ihsan"), SG("ihsan"), L("Consistency desk", "/campus/desk/consistency/")] },
    { id: "prayer", keys: [/salah/i, /ṣalāh/i, /salaat/i, /\bpray(?:er|ing|s)?\b/i, /namaz/i],
      short: "Ṣalāh is the daily pillar of practice. Use study maps only for orientation — confirm times, conditions, and form with a local teacher.",
      links: [SG("prayer"), SN("prayer"), L("Practice desk", "/campus/desk/practice/")] },
    { id: "wudu", keys: [/wudu/i, /wuḍū/i, /wudou/i, /ablution/i, /purity/i, /tahara/i, /ṭahāra/i],
      short: "Wuḍūʾ is purification before prayer. Learn the obligatory acts and what breaks it from a reliable teacher; modules are reminders only.",
      links: [SG("wudu"), SN("wudu"), L("Practice desk", "/campus/desk/practice/")] },
    { id: "ghusl", keys: [/\bghusl\b/i, /major impurity/i, /janaba/i, /janāba/i],
      short: "Ghusl is the full ritual wash when required. Because details matter, learn it from a qualified local teacher — not from a chatbot ruling.",
      links: [SG("ghusl"), SN("ghusl"), L("Practice desk", "/campus/desk/practice/")] },
    { id: "tayammum", keys: [/tayammum/i, /dry ablution/i],
      short: "Tayammum is a concession when water cannot be used. Conditions are specific — confirm with a teacher before relying on a summary.",
      links: [SG("tayammum"), SN("tayammum")] },
    { id: "zakat", keys: [/zakat/i, /zakāh/i, /zakaah/i, /charity obligation/i],
      short: "Zakāh is an obligatory share of defined wealth for defined recipients. Rates and thresholds need careful study with qualified guidance.",
      links: [SG("zakat"), SN("zakat"), L("Charter limits", "/campus/charter/")] },
    { id: "sadaqah", keys: [/sadaqah/i, /ṣadaqah/i, /voluntary charity/i],
      short: "Ṣadaqah is voluntary giving for Allāh’s sake. It is broad and beautiful — sincerity matters more than display.",
      links: [SG("sadaqah"), SN("sadaqah"), Q("2/271", "Qurʾān 2:271")] },
    { id: "sawm", keys: [/\bsawm\b/i, /fasting/i, /ramadan/i, /ramaḍān/i, /\broza\b/i],
      short: "Fasting in Ramaḍān is a pillar. Learn what invalidates the fast and the adab of the month with reliable local instruction.",
      links: [SG("fasting"), SN("fasting"), Q("2/183", "Qurʾān 2:183")] },
    { id: "hajj", keys: [/\bhajj\b/i, /umrah/i, /ʿumrah/i, /pilgrimage/i],
      short: "Ḥajj is pilgrimage with defined rites and timings. Study early with qualified teachers; do not rely on a short app summary alone.",
      links: [SG("hajj"), SN("hajj"), Q("3/97", "Qurʾān 3:97")] },
    { id: "quran", keys: [/quran/i, /qur['']?an/i, /qurʾān/i, /mushaf/i, /muṣḥaf/i],
      short: "Sit with one āyah at a time. Recite with adab; seek understanding with humility and trusted tafsīr teachers.",
      links: [L("Qurʾān.com", "https://quran.com"), SG("quran"), L("Tajweed lab", "/craft/tajweed/")] },
    { id: "tajweed", keys: [/tajweed/i, /tajwīd/i, /makharij/i, /makhārij/i, /recit/i],
      short: "Tajweed is giving each letter its due. Practice slowly; a listening teacher is better than silent self-correction alone.",
      links: [L("Tajweed lab", "/craft/tajweed/"), SG("tajweed"), L("Qurʾān.com", "https://quran.com")] },
    { id: "sunnah", keys: [/sunnah/i, /hadith/i, /ḥadīth/i, /prophetic/i],
      short: "The Sunnah explains and embodies the Qurʾān. Read with authentic collections and teachers who care about chains and adab.",
      links: [L("Sunnah.com", "https://sunnah.com"), SG("sunnah"), SN("sunnah")] },
    { id: "adab", keys: [/\badab\b/i, /manners/i, /character/i, /akhlaq/i, /akhlāq/i],
      short: "Adab is the vessel of knowledge. Good character is part of faith — study it as seriously as rulings.",
      links: [SG("adab"), SN("character"), L("Transmission desk", "/campus/desk/transmission/")] },
    { id: "tawba", keys: [/tawba/i, /tawbah/i, /repent/i, /istighfar/i, /istighfār/i],
      short: "Tawbah is returning to Allāh: leave the sin, regret it, resolve not to return, and restore rights if owed.",
      links: [Q("66/8", "Qurʾān 66:8"), SG("repentance"), SN("tawbah")] },
    { id: "dua", keys: [/\bdua\b/i, /duʿā/i, /supplicat/i, /dhikr/i, /\bzikr\b/i],
      short: "Duʿāʾ is worship. Ask Allāh with humility; combine it with lawful means and patience.",
      links: [SG("dua"), SN("dua"), Q("2/186", "Qurʾān 2:186")] },
    { id: "halal", keys: [/halal/i, /ḥalāl/i, /haram/i, /ḥarām/i, /forbidden/i, /permissib/i],
      short: "Ḥalāl and ḥarām are boundaries set by Allāh. For specific food, finance, or medical cases, ask a qualified local scholar — Campus will not issue a ruling.",
      links: [SG("halal"), SG("haram"), L("Charter limits", "/campus/charter/")] },
    { id: "nikah", keys: [/nikah/i, /nikāḥ/i, /marriage/i, /walima/i, /walīmah/i],
      short: "Marriage in Islam has conditions, rights, and adab. For personal cases, consult a qualified local scholar and follow the law of your land.",
      links: [SG("marriage"), SN("nikah"), L("Charter limits", "/campus/charter/")] },
    { id: "divorce", keys: [/divorce/i, /talaq/i, /ṭalāq/i, /khula/i, /khulʿ/i],
      short: "Divorce rulings are sensitive and case-specific. Do not treat any app text as a decree — seek qualified local counsel immediately.",
      links: [SG("divorce"), L("Charter limits", "/campus/charter/")] },
    { id: "wasiyyah", keys: [/wasiy/i, /waṣiy/i, /inherit/i, /faraid/i, /farā/i, /mirath/i, /mīrāth/i, /\bwill\b/i, /estate/i],
      short: "Wasiyyah and farāʾiḍ are trusts with precise rules. Campus only points to educational Amānah tools — not a will, not a fatwa, not legal advice.",
      links: [L("Amānah · Wasiyyah", "/amana/wasiyyah/"), L("Campus Mīrāth", "/campus/mirath/"), L("Charter", "/campus/charter/")] },
    { id: "dayn", keys: [/\bdayn\b/i, /\bdebt\b/i, /loan/i, /qard/i, /qarḍ/i],
      short: "Debts are serious rights of others. Document honestly and seek lawful resolution; for contracts, use qualified counsel.",
      links: [SG("debt"), L("Amānah", "/amana/"), L("Charter", "/campus/charter/")] },
    { id: "riba", keys: [/\briba\b/i, /usury/i, /interest/i],
      short: "Ribā is prohibited. Modern finance is complex — for personal banking or business structures, ask a scholar who understands both fiqh and your local system.",
      links: [SG("riba"), Q("2/275", "Qurʾān 2:275"), L("Charter", "/campus/charter/")] },
    { id: "hijab", keys: [/hijab/i, /ḥijāb/i, /modesty/i, /awrah/i, /ʿawrah/i],
      short: "Modesty is a Qurʾānic value for believers. Details of dress and conduct are best learned with teachers who know your context.",
      links: [SG("hijab"), SG("modesty"), Q("24/31", "Qurʾān 24:31")] },
    { id: "death", keys: [/janazah/i, /janāzah/i, /funeral/i, /burial/i, /ghusl mayyit/i],
      short: "Funeral rites are communal trusts. Learn the outline, then follow local scholars and those handling the burial.",
      links: [SG("janazah"), SN("funeral"), L("Charter", "/campus/charter/")] },
    { id: "jannah", keys: [/jannah/i, /paradise/i, /akhirah/i, /ākhirah/i, /hereafter/i, /hell/i, /jahannam/i],
      short: "Belief in the Hereafter shapes how we live today. Read the Qurʾān’s descriptions with hope, fear, and sincere deeds.",
      links: [Q("2/25", "Qurʾān 2:25"), SG("hereafter"), SN("jannah")] }
  ];

  function match(q) {
    var s = String(q || "").trim();
    if (!s) return null;
    for (var i = 0; i < BRIEFS.length; i++) {
      for (var k = 0; k < BRIEFS[i].keys.length; k++) {
        if (BRIEFS[i].keys[k].test(s)) return BRIEFS[i];
      }
    }
    return null;
  }

  function answer(q) {
    var b = match(q);
    if (b) return { id: b.id, short: b.short, links: b.links.slice(), source: "answer-engine" };
    var enc = encodeURIComponent(String(q || "").trim() || "islam");
    return {
      id: "general",
      short:
        "No built-in brief for that word yet. Use allowlisted full sources below, then verify with a local teacher. Campus does not issue fatwas.",
      links: [
        L("Qurʾān.com search · full", "https://quran.com/search?q=" + enc),
        L("Sunnah.com search · full", "https://sunnah.com/search?q=" + enc),
        SG(String(q || "islam")),
        L("Campus library", "/campus/library/")
      ],
      source: "general"
    };
  }

  w.ClarityAnswerEngine = {
    version: "U61",
    answer: answer,
    match: match,
    listIds: function () {
      return BRIEFS.map(function (b) {
        return b.id;
      });
    }
  };
})(window);
