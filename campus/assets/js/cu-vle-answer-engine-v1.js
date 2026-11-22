/*! cu-vle-answer-engine-v1 · U63
 * Keyword briefs + concrete hadith citations + sunnah.com / quran.com links.
 * Educational only — not a fatwa · verify text and grading with a teacher / primary sources.
 */
(function (w) {
  "use strict";
  var BRIEFS = [
    {
      id: 'iman',
      keys: [/\biman\b/i, /īmān/i, /\bfaith\b/i, /belie[fv]/i],
      short: 'Īmān is belief in the heart, speech on the tongue, and action on the limbs. It increases with obedience and decreases with sin.',
      hadith: 'Hadith: «Faith has over seventy branches…» — Ṣaḥīḥ Muslim 35; also the Ḥadīth of Jibrīl defining īmān — Ṣaḥīḥ Muslim 8.',
      links: [
        { label: 'Qurʾān 2:285', href: 'https://quran.com/2/285' },
        { label: 'Muslim 35 · full', href: 'https://sunnah.com/muslim:35' },
        { label: 'Muslim 8 · Jibrīl · full', href: 'https://sunnah.com/muslim:8' },
        { label: 'SeekersGuidance', href: 'https://seekersguidance.org/?s=iman' },
      ]
    },
    {
      id: 'tawhid',
      keys: [/tawh[iī]d/i, /tawḥīd/i, /oneness/i, /\bshirk\b/i],
      short: 'Tawḥīd is single-hearted worship of Allāh alone. Protect it by knowing what harms it, with a teacher.',
      hadith: 'Hadith: «Whoever dies while not associating anything with Allāh will enter Paradise» — Ṣaḥīḥ al-Bukhārī 1294 / Muslim 93 (meaning as transmitted).',
      links: [
        { label: 'Sūrat al-Ikhlāṣ', href: 'https://quran.com/112' },
        { label: 'Bukhārī · related · full', href: 'https://sunnah.com/bukhari:1294' },
        { label: 'Muslim 93 · full', href: 'https://sunnah.com/muslim:93' },
        { label: 'SeekersGuidance', href: 'https://seekersguidance.org/?s=tawhid' },
      ]
    },
    {
      id: 'islam',
      keys: [/\bislam\b/i, /five pillars/i, /arkan/i],
      short: 'Islām is built on five pillars: testimony, prayer, zakāh, fasting Ramaḍān, and ḥajj for those able.',
      hadith: 'Hadith: «Islam is built upon five…» — Ṣaḥīḥ al-Bukhārī 8; Ṣaḥīḥ Muslim 16.',
      links: [
        { label: 'Bukhārī 8 · full', href: 'https://sunnah.com/bukhari:8' },
        { label: 'Muslim 16 · full', href: 'https://sunnah.com/muslim:16' },
        { label: 'SeekersGuidance', href: 'https://seekersguidance.org/?s=five+pillars' },
      ]
    },
    {
      id: 'ihsan',
      keys: [/ihsan/i, /iḥsān/i, /excellence/i],
      short: 'Iḥsān is to worship Allāh as though you see Him — and if you do not see Him, He sees you.',
      hadith: 'Hadith: definition of iḥsān in the Ḥadīth of Jibrīl — Ṣaḥīḥ Muslim 8.',
      links: [
        { label: 'Muslim 8 · full', href: 'https://sunnah.com/muslim:8' },
        { label: 'SeekersGuidance', href: 'https://seekersguidance.org/?s=ihsan' },
      ]
    },
    {
      id: 'prayer',
      keys: [/salah/i, /ṣalāh/i, /salaat/i, /\bpray(?:er|ing|s)?\b/i, /namaz/i],
      short: 'Ṣalāh is the pillar of practice after the testimony. Confirm form and conditions with a local teacher.',
      hadith: 'Hadith: «The first of his deeds for which a servant will be called to account on the Day of Resurrection will be his prayer» — Jāmiʿ al-Tirmidhī 413 (graded ḥasan by many scholars).',
      links: [
        { label: 'Tirmidhī 413 · full', href: 'https://sunnah.com/tirmidhi:413' },
        { label: 'Bukhārī 527 · full', href: 'https://sunnah.com/bukhari:527' },
        { label: 'SeekersGuidance · prayer', href: 'https://seekersguidance.org/?s=prayer' },
      ]
    },
    {
      id: 'wudu',
      keys: [/wudu/i, /wuḍū/i, /wudou/i, /ablution/i, /tahara/i, /ṭahāra/i],
      short: 'Wuḍūʾ is purification before prayer. Learn the obligatory acts and what breaks it from a reliable teacher.',
      hadith: 'Hadith: «Allāh does not accept prayer without purification» — Ṣaḥīḥ Muslim 224.',
      links: [
        { label: 'Muslim 224 · full', href: 'https://sunnah.com/muslim:224' },
        { label: 'Bukhārī 135 · full', href: 'https://sunnah.com/bukhari:135' },
        { label: 'SeekersGuidance · wudu', href: 'https://seekersguidance.org/?s=wudu' },
      ]
    },
    {
      id: 'ghusl',
      keys: [/\bghusl\b/i, /janaba/i, /janāba/i, /major impurity/i],
      short: 'Ghusl is the full ritual wash when required. Details matter — learn from a qualified local teacher.',
      hadith: 'Hadith: descriptions of the Prophet’s ghusl — e.g. Ṣaḥīḥ al-Bukhārī 248; Ṣaḥīḥ Muslim 317.',
      links: [
        { label: 'Bukhārī 248 · full', href: 'https://sunnah.com/bukhari:248' },
        { label: 'Muslim 317 · full', href: 'https://sunnah.com/muslim:317' },
        { label: 'SeekersGuidance · ghusl', href: 'https://seekersguidance.org/?s=ghusl' },
      ]
    },
    {
      id: 'tayammum',
      keys: [/tayammum/i, /dry ablution/i],
      short: 'Tayammum is a concession when water cannot be used. Conditions are specific — confirm with a teacher.',
      hadith: 'Hadith: tayammum granted as pure earth — Ṣaḥīḥ al-Bukhārī 334; Ṣaḥīḥ Muslim 368.',
      links: [
        { label: 'Bukhārī 334 · full', href: 'https://sunnah.com/bukhari:334' },
        { label: 'Muslim 368 · full', href: 'https://sunnah.com/muslim:368' },
        { label: 'SeekersGuidance', href: 'https://seekersguidance.org/?s=tayammum' },
      ]
    },
    {
      id: 'zakat',
      keys: [/zakat/i, /zakāh/i, /zakaah/i],
      short: 'Zakāh is an obligatory share of defined wealth for defined recipients. Thresholds need careful study.',
      hadith: 'Hadith: zakāh listed among the five pillars — Ṣaḥīḥ al-Bukhārī 8; command to take ṣadaqah from their wealth — related in collections via Qurʾān 9:103 context.',
      links: [
        { label: 'Bukhārī 8 · full', href: 'https://sunnah.com/bukhari:8' },
        { label: 'Qurʾān 9:60', href: 'https://quran.com/9/60' },
        { label: 'SeekersGuidance · zakat', href: 'https://seekersguidance.org/?s=zakat' },
      ]
    },
    {
      id: 'sadaqah',
      keys: [/sadaqah/i, /ṣadaqah/i, /voluntary charity/i],
      short: 'Ṣadaqah is voluntary giving for Allāh’s sake; sincerity matters more than display.',
      hadith: 'Hadith: «Charity extinguishes sin as water extinguishes fire» — Jāmiʿ al-Tirmidhī 2616 (check grading with a teacher).',
      links: [
        { label: 'Tirmidhī 2616 · full', href: 'https://sunnah.com/tirmidhi:2616' },
        { label: 'Qurʾān 2:271', href: 'https://quran.com/2/271' },
        { label: 'SeekersGuidance', href: 'https://seekersguidance.org/?s=sadaqah' },
      ]
    },
    {
      id: 'sawm',
      keys: [/\bsawm\b/i, /fasting/i, /ramadan/i, /ramaḍān/i, /\broza\b/i],
      short: 'Fasting in Ramaḍān is a pillar. Learn what invalidates the fast with reliable local instruction.',
      hadith: 'Hadith: «Whoever fasts Ramaḍān out of faith and seeking reward, his past sins will be forgiven» — Ṣaḥīḥ al-Bukhārī 38.',
      links: [
        { label: 'Bukhārī 38 · full', href: 'https://sunnah.com/bukhari:38' },
        { label: 'Qurʾān 2:183', href: 'https://quran.com/2/183' },
        { label: 'SeekersGuidance · fasting', href: 'https://seekersguidance.org/?s=fasting' },
      ]
    },
    {
      id: 'hajj',
      keys: [/\bhajj\b/i, /umrah/i, /ʿumrah/i, /pilgrimage/i],
      short: 'Ḥajj has defined rites and timings. Study with qualified teachers; do not rely on a short summary alone.',
      hadith: 'Hadith: «Ḥajj is ʿArafah» — Jāmiʿ al-Tirmidhī 889; pillars include ḥajj in Bukhārī 8.',
      links: [
        { label: 'Tirmidhī 889 · full', href: 'https://sunnah.com/tirmidhi:889' },
        { label: 'Bukhārī 8 · full', href: 'https://sunnah.com/bukhari:8' },
        { label: 'SeekersGuidance · hajj', href: 'https://seekersguidance.org/?s=hajj' },
      ]
    },
    {
      id: 'quran',
      keys: [/quran/i, /qur['']?an/i, /qurʾān/i, /mushaf/i],
      short: 'Sit with one āyah at a time. Recite with adab; seek understanding with trusted teachers.',
      hadith: 'Hadith: «The best of you are those who learn the Qurʾān and teach it» — Ṣaḥīḥ al-Bukhārī 5027.',
      links: [
        { label: 'Bukhārī 5027 · full', href: 'https://sunnah.com/bukhari:5027' },
        { label: 'Qurʾān.com', href: 'https://quran.com' },
        { label: 'SeekersGuidance', href: 'https://seekersguidance.org/?s=quran' },
      ]
    },
    {
      id: 'tajweed',
      keys: [/tajweed/i, /tajwīd/i, /makharij/i, /recit/i],
      short: 'Tajweed is giving each letter its due. Practice slowly with a listening teacher when you can.',
      hadith: 'Hadith: «Beautify the Qurʾān with your voices» — Sunan Abī Dāwūd 1468 (and parallel reports).',
      links: [
        { label: 'Abū Dāwūd 1468 · full', href: 'https://sunnah.com/abudawud:1468' },
        { label: 'Bukhārī 5027 · full', href: 'https://sunnah.com/bukhari:5027' },
        { label: 'Tajweed lab', href: '/craft/tajweed/' },
      ]
    },
    {
      id: 'sunnah',
      keys: [/sunnah/i, /hadith/i, /ḥadīth/i, /prophetic/i],
      short: 'The Sunnah explains and embodies the Qurʾān. Prefer authentic collections and teachers who care about chains.',
      hadith: 'Hadith: «Whoever turns away from my Sunnah is not of me» — Ṣaḥīḥ al-Bukhārī 5063; Ṣaḥīḥ Muslim 1401 (context: marriage and balanced practice).',
      links: [
        { label: 'Bukhārī 5063 · full', href: 'https://sunnah.com/bukhari:5063' },
        { label: 'Muslim 1401 · full', href: 'https://sunnah.com/muslim:1401' },
        { label: 'Sunnah.com', href: 'https://sunnah.com' },
      ]
    },
    {
      id: 'adab',
      keys: [/\badab\b/i, /manners/i, /character/i, /akhlaq/i, /akhlāq/i],
      short: 'Adab is the vessel of knowledge. Good character is part of faith.',
      hadith: 'Hadith: «I was sent to perfect good character» — Muwaṭṭaʾ Mālik 1614 (and widely cited parallels).',
      links: [
        { label: 'Related · character · full', href: 'https://sunnah.com/search?q=character' },
        { label: 'Bukhārī 6035 · full', href: 'https://sunnah.com/bukhari:6035' },
        { label: 'SeekersGuidance · adab', href: 'https://seekersguidance.org/?s=adab' },
      ]
    },
    {
      id: 'tawba',
      keys: [/tawba/i, /tawbah/i, /repent/i, /istighfar/i],
      short: 'Tawbah is leaving the sin, regret, resolve not to return, and restoring rights if owed.',
      hadith: 'Hadith: «Allāh accepts the repentance of the servant so long as the death rattle has not reached his throat» — Jāmiʿ al-Tirmidhī 3537.',
      links: [
        { label: 'Tirmidhī 3537 · full', href: 'https://sunnah.com/tirmidhi:3537' },
        { label: 'Qurʾān 66:8', href: 'https://quran.com/66/8' },
        { label: 'SeekersGuidance', href: 'https://seekersguidance.org/?s=repentance' },
      ]
    },
    {
      id: 'dua',
      keys: [/\bdua\b/i, /duʿā/i, /supplicat/i, /dhikr/i, /\bzikr\b/i],
      short: 'Duʿāʾ is worship. Ask Allāh with humility; combine it with lawful means and patience.',
      hadith: 'Hadith: «Duʿāʾ is worship» — Jāmiʿ al-Tirmidhī 3372; Abū Dāwūd 1479.',
      links: [
        { label: 'Tirmidhī 3372 · full', href: 'https://sunnah.com/tirmidhi:3372' },
        { label: 'Abū Dāwūd 1479 · full', href: 'https://sunnah.com/abudawud:1479' },
        { label: 'Qurʾān 2:186', href: 'https://quran.com/2/186' },
      ]
    },
    {
      id: 'halal',
      keys: [/halal/i, /ḥalāl/i, /haram/i, /ḥarām/i, /forbidden/i],
      short: 'Ḥalāl and ḥarām are boundaries set by Allāh. For specific cases, ask a qualified local scholar — Campus does not issue rulings.',
      hadith: 'Hadith: «The ḥalāl is clear and the ḥarām is clear…» — Ṣaḥīḥ al-Bukhārī 52; Ṣaḥīḥ Muslim 1599.',
      links: [
        { label: 'Bukhārī 52 · full', href: 'https://sunnah.com/bukhari:52' },
        { label: 'Muslim 1599 · full', href: 'https://sunnah.com/muslim:1599' },
        { label: 'Charter limits', href: '/campus/charter/' },
      ]
    },
    {
      id: 'nikah',
      keys: [/nikah/i, /nikāḥ/i, /marriage/i, /walima/i],
      short: 'Marriage has conditions, rights, and adab. For personal cases, consult a qualified local scholar and follow the law of your land.',
      hadith: 'Hadith: «O young people, whoever among you can marry, let him marry» — Ṣaḥīḥ al-Bukhārī 5065; Ṣaḥīḥ Muslim 1400.',
      links: [
        { label: 'Bukhārī 5065 · full', href: 'https://sunnah.com/bukhari:5065' },
        { label: 'Muslim 1400 · full', href: 'https://sunnah.com/muslim:1400' },
        { label: 'SeekersGuidance · marriage', href: 'https://seekersguidance.org/?s=marriage' },
      ]
    },
    {
      id: 'divorce',
      keys: [/divorce/i, /talaq/i, /ṭalāq/i, /khula/i],
      short: 'Divorce rulings are sensitive and case-specific. Do not treat any app text as a decree — seek qualified local counsel.',
      hadith: 'Hadith: the Prophet ﷺ taught careful handling of divorce; details vary by school — study with a scholar (see collections under ṭalāq).',
      links: [
        { label: 'Sunnah.com · talaq · full', href: 'https://sunnah.com/search?q=talaq' },
        { label: 'SeekersGuidance · divorce', href: 'https://seekersguidance.org/?s=divorce' },
        { label: 'Charter limits', href: '/campus/charter/' },
      ]
    },
    {
      id: 'wasiyyah',
      keys: [/wasiy/i, /waṣiy/i, /inherit/i, /faraid/i, /mirath/i, /\bwill\b/i],
      short: 'Wasiyyah and farāʾiḍ are trusts with precise rules. Campus points only to educational tools — not a will or fatwa.',
      hadith: 'Hadith: «It is not right for a Muslim who has something to bequeath to spend two nights without having his will written with him» — Ṣaḥīḥ al-Bukhārī 2738; Ṣaḥīḥ Muslim 1627.',
      links: [
        { label: 'Bukhārī 2738 · full', href: 'https://sunnah.com/bukhari:2738' },
        { label: 'Muslim 1627 · full', href: 'https://sunnah.com/muslim:1627' },
        { label: 'Amānah · Wasiyyah', href: '/amana/wasiyyah/' },
      ]
    },
    {
      id: 'dayn',
      keys: [/\bdayn\b/i, /\bdebt\b/i, /loan/i, /qard/i],
      short: 'Debts are serious rights of others. Document honestly; for contracts use qualified counsel.',
      hadith: 'Hadith: the martyr is forgiven all except debt — Ṣaḥīḥ Muslim 1886 (among related reports).',
      links: [
        { label: 'Muslim 1886 · full', href: 'https://sunnah.com/muslim:1886' },
        { label: 'SeekersGuidance · debt', href: 'https://seekersguidance.org/?s=debt' },
        { label: 'Amānah', href: '/amana/' },
      ]
    },
    {
      id: 'riba',
      keys: [/\briba\b/i, /usury/i, /interest/i],
      short: 'Ribā is prohibited. Modern finance is complex — ask a scholar who understands fiqh and your local system.',
      hadith: 'Hadith: the Prophet ﷺ cursed the consumer of ribā, its payer, its witnesses, and its scribe — Ṣaḥīḥ Muslim 1598.',
      links: [
        { label: 'Muslim 1598 · full', href: 'https://sunnah.com/muslim:1598' },
        { label: 'Qurʾān 2:275', href: 'https://quran.com/2/275' },
        { label: 'Charter limits', href: '/campus/charter/' },
      ]
    },
    {
      id: 'hijab',
      keys: [/hijab/i, /ḥijāb/i, /modesty/i, /awrah/i],
      short: 'Modesty is a Qurʾānic value. Details of dress and conduct are best learned with teachers who know your context.',
      hadith: 'Hadith: modesty (ḥayāʾ) is part of faith — Ṣaḥīḥ al-Bukhārī 24; Ṣaḥīḥ Muslim 36.',
      links: [
        { label: 'Bukhārī 24 · full', href: 'https://sunnah.com/bukhari:24' },
        { label: 'Muslim 36 · full', href: 'https://sunnah.com/muslim:36' },
        { label: 'Qurʾān 24:31', href: 'https://quran.com/24/31' },
      ]
    },
    {
      id: 'death',
      keys: [/janazah/i, /janāzah/i, /funeral/i, /burial/i],
      short: 'Funeral rites are communal trusts. Learn the outline, then follow local scholars and those handling the burial.',
      hadith: 'Hadith: «Promptly bury the deceased» — related in Ṣaḥīḥ al-Bukhārī 1315 (and parallels on haste in burial).',
      links: [
        { label: 'Bukhārī 1315 · full', href: 'https://sunnah.com/bukhari:1315' },
        { label: 'SeekersGuidance · janazah', href: 'https://seekersguidance.org/?s=janazah' },
      ]
    },
    {
      id: 'jannah',
      keys: [/jannah/i, /paradise/i, /akhirah/i, /ākhirah/i, /hereafter/i, /jahannam/i],
      short: 'Belief in the Hereafter shapes how we live today. Read the Qurʾān with hope, fear, and sincere deeds.',
      hadith: 'Hadith: «Paradise is surrounded by hardships and the Fire is surrounded by desires» — Ṣaḥīḥ Muslim 2822.',
      links: [
        { label: 'Muslim 2822 · full', href: 'https://sunnah.com/muslim:2822' },
        { label: 'Qurʾān 2:25', href: 'https://quran.com/2/25' },
        { label: 'SeekersGuidance', href: 'https://seekersguidance.org/?s=hereafter' },
      ]
    },

    {
      id: 'parents',
      keys: [/\bparents?\b/i, /\bmother\b/i, /\bfather\b/i, /walid/i, /wālid/i, /birr/i, /parental/i, /mom\b/i, /dad\b/i],
      short: 'Dutifulness to parents (birr al-wālidayn) is among the greatest deeds after worship of Allāh. Kindness to them in old age is especially stressed. Campus only reminds — personal cases need local guidance.',
      hadith: 'Hadith: A man asked who is most deserving of good companionship. The Prophet ﷺ said: «Your mother,» then «your mother,» then «your mother,» then «your father» — Ṣaḥīḥ al-Bukhārī 5971; Ṣaḥīḥ Muslim 2548. Also: pleasure of Allāh is in the pleasure of the parents — Jāmiʿ al-Tirmidhī 1899 (check grading with a teacher).',
      links: [
        { label: 'Bukhārī 5971 · full', href: 'https://sunnah.com/bukhari:5971' },
        { label: 'Muslim 2548 · full', href: 'https://sunnah.com/muslim:2548' },
        { label: 'Qurʾān 17:23 · full', href: 'https://quran.com/17/23' },
        { label: 'SeekersGuidance · parents', href: 'https://seekersguidance.org/?s=parents' }
      ]
    },

    {
      id: 'kinship',
      keys: [/\bkinship\b/i, /silat\s*al[- ]?rahim/i, /ṣilat/i, /relatives/i, /\bfamily\b/i],
      short: 'Keeping ties of kinship is a major virtue; cutting them is a serious wrong. Balance rights with justice and local custom under scholarly guidance.',
      hadith: 'Hadith: «The one who severs the ties of kinship will not enter Paradise» — Ṣaḥīḥ al-Bukhārī 5984; Ṣaḥīḥ Muslim 2556.',
      links: [
        { label: 'Bukhārī 5984 · full', href: 'https://sunnah.com/bukhari:5984' },
        { label: 'Muslim 2556 · full', href: 'https://sunnah.com/muslim:2556' },
        { label: 'SeekersGuidance · kinship', href: 'https://seekersguidance.org/?s=kinship' }
      ]
    },
    {
      id: 'neighbor',
      keys: [/\bneighbor\b/i, /\bneighbour\b/i, /jar\b/i],
      short: 'The neighbor has rights in Islam. Good treatment of neighbors is part of faith and social adab.',
      hadith: 'Hadith: «Jibrīl kept recommending the neighbor to me until I thought he would make him an heir» — Ṣaḥīḥ al-Bukhārī 6014; Ṣaḥīḥ Muslim 2624.',
      links: [
        { label: 'Bukhārī 6014 · full', href: 'https://sunnah.com/bukhari:6014' },
        { label: 'Muslim 2624 · full', href: 'https://sunnah.com/muslim:2624' },
        { label: 'SeekersGuidance · neighbor', href: 'https://seekersguidance.org/?s=neighbor' }
      ]
    },
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
    if (b) {
      return {
        id: b.id,
        short: b.short,
        hadith: b.hadith || "",
        links: (b.links || []).slice(),
        source: "answer-engine"
      };
    }
    var enc = encodeURIComponent(String(q || "").trim() || "islam");
    return {
      id: "general",
      short: "No built-in brief for that word yet. Use allowlisted full sources, then verify with a local teacher.",
      hadith: "Tip: search sunnah.com for the Arabic or English keyword with a teacher’s help.",
      links: [
        { label: "Sunnah.com search · full", href: "https://sunnah.com/search?q=" + enc },
        { label: "Qurʾān.com search · full", href: "https://quran.com/search?q=" + enc },
        { label: "SeekersGuidance · full", href: "https://seekersguidance.org/?s=" + enc }
      ],
      source: "general"
    };
  }
  w.ClarityAnswerEngine = {
    version: "U63",
    answer: answer,
    match: match,
    listIds: function () { return BRIEFS.map(function (b) { return b.id; }); }
  };
})(window);
