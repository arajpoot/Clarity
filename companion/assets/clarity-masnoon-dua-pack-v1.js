/*! clarity-masnoon-dua-pack-v1.1 · ~40 educational duʿās · hard override · not a fatwa */
(function (w, d) {
  "use strict";
  var DUAS = [
    {t:"Morning",ar:"أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",en:"We have entered the morning and the dominion belongs to Allah.",src:"Morning adhkār — widely taught",tags:"morning protection"},
    {t:"Evening",ar:"أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ",en:"We have entered the evening and the dominion belongs to Allah.",src:"Evening adhkār — widely taught",tags:"evening protection"},
    {t:"Sleep",ar:"بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",en:"In Your name, O Allah, I die and I live.",src:"Bukhārī — sleep",tags:"sleep night"},
    {t:"Waking",ar:"الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",en:"Praise be to Allah who gave us life after death, and to Him is the resurrection.",src:"Bukhārī",tags:"morning waking"},
    {t:"Entering home",ar:"بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا",en:"In the name of Allah we enter, and in the name of Allah we leave.",src:"Abū Dāwūd — graded ḥasan by many",tags:"home"},
    {t:"Leaving home",ar:"بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ",en:"In the name of Allah; I place my trust in Allah.",src:"Abū Dāwūd / Tirmidhī",tags:"travel home protection"},
    {t:"Entering masjid",ar:"اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",en:"O Allah, open for me the gates of Your mercy.",src:"Muslim",tags:"masjid"},
    {t:"Leaving masjid",ar:"اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",en:"O Allah, I ask You from Your bounty.",src:"Muslim",tags:"masjid"},
    {t:"Before eating",ar:"بِسْمِ اللَّهِ",en:"In the name of Allah.",src:"Bukhārī / Muslim",tags:"food"},
    {t:"After eating",ar:"الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",en:"Praise be to Allah who fed us, gave us drink, and made us Muslims.",src:"Abū Dāwūd / Tirmidhī",tags:"food gratitude"},
    {t:"Travel",ar:"سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ",en:"Glory be to Him who has subjected this to us, and we could not have done it by ourselves.",src:"Qurʾān 43:13 — travel",tags:"travel"},
    {t:"Anxiety",ar:"اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",en:"O Allah, I seek refuge in You from anxiety and sorrow.",src:"Bukhārī",tags:"anxiety worry"},
    {t:"Forgiveness",ar:"رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ",en:"My Lord, forgive me and accept my repentance. Indeed You are the Accepting of repentance, the Merciful.",src:"Abū Dāwūd / Tirmidhī",tags:"forgiveness tawbah"},
    {t:"Sayyid al-istighfār",ar:"اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ",en:"O Allah, You are my Lord; there is no god but You. You created me and I am Your servant.",src:"Bukhārī — sayyid al-istighfār (opening)",tags:"forgiveness morning evening"},
    {t:"Parents",ar:"رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",en:"My Lord, have mercy upon them as they brought me up when I was small.",src:"Qurʾān 17:24",tags:"parents"},
    {t:"Guidance",ar:"اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",en:"Guide us to the straight path.",src:"Qurʾān 1:6",tags:"guidance"},
    {t:"Knowledge",ar:"رَبِّ زِدْنِي عِلْمًا",en:"My Lord, increase me in knowledge.",src:"Qurʾān 20:114",tags:"knowledge"},
    {t:"Patience",ar:"رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَتَوَفَّنَا مُسْلِمِينَ",en:"Our Lord, pour upon us patience and let us die as Muslims.",src:"Qurʾān 7:126",tags:"patience"},
    {t:"Protection",ar:"أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",en:"I seek refuge in the perfect words of Allah from the evil of what He created.",src:"Muslim",tags:"protection evening"},
    {t:"After adhān",ar:"اللَّهُمَّ رَبَّ هَٰذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ",en:"O Allah, Lord of this perfect call and the prayer to be established…",src:"Bukhārī",tags:"adhān salah"},
    {t:"Opening ṣalāh",ar:"سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ",en:"Glory be to You, O Allah, and praise; blessed is Your name…",src:"Widely taught opening duʿāʾ",tags:"salah"},
    {t:"Rukūʿ",ar:"سُبْحَانَ رَبِّيَ الْعَظِيمِ",en:"Glory be to my Lord, the Magnificent.",src:"Muslim / Abū Dāwūd",tags:"salah"},
    {t:"Sujūd",ar:"سُبْحَانَ رَبِّيَ الْأَعْلَى",en:"Glory be to my Lord, the Most High.",src:"Muslim / Abū Dāwūd",tags:"salah"},
    {t:"Tashahhud ṣalāh",ar:"اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ",en:"O Allah, send ṣalāh upon Muḥammad and upon the family of Muḥammad.",src:"Bukhārī / Muslim",tags:"salah salawat"},
    {t:"After ṣalāh",ar:"أَسْتَغْفِرُ اللَّهَ · اللَّهُمَّ أَنْتَ السَّلَامُ",en:"I seek Allah’s forgiveness. O Allah, You are as-Salām…",src:"Muslim",tags:"salah forgiveness"},
    {t:"Rain",ar:"اللَّهُمَّ صَيِّبًا نَافِعًا",en:"O Allah, make it a beneficial downpour.",src:"Bukhārī",tags:"weather"},
    {t:"Distress",ar:"لَا إِلَٰهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ",en:"There is no god but Allah, the Magnificent, the Forbearing.",src:"Bukhārī / Muslim",tags:"anxiety distress"},
    {t:"Debt",ar:"اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ",en:"O Allah, suffice me with what You have made lawful so that I need not what You made unlawful.",src:"Tirmidhī — graded ḥasan by many",tags:"debt provision"},
    {t:"Market",ar:"لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",en:"There is no god but Allah alone, without partner…",src:"Tirmidhī — market duʿāʾ",tags:"market provision"},
    {t:"Anger",ar:"أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",en:"I seek refuge in Allah from the accursed Shayṭān.",src:"Bukhārī / Muslim",tags:"anger protection"},
    {t:"Toilet enter",ar:"اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",en:"O Allah, I seek refuge in You from male and female unclean spirits.",src:"Bukhārī / Muslim",tags:"bathroom"},
    {t:"Toilet leave",ar:"غُفْرَانَكَ",en:"I seek Your forgiveness.",src:"Abū Dāwūd / Tirmidhī",tags:"bathroom"},
    {t:"Wearing clothes",ar:"الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَٰذَا",en:"Praise be to Allah who has clothed me with this.",src:"Abū Dāwūd / Tirmidhī",tags:"clothes"},
    {t:"Character",ar:"اللَّهُمَّ كَمَا حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي",en:"O Allah, as You have beautified my outward form, beautify my character.",src:"Aḥmad — widely taught",tags:"character"},
    {t:"Visiting sick",ar:"لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللَّهُ",en:"No harm; it is purification, if Allah wills.",src:"Bukhārī",tags:"sick"},
    {t:"For the deceased",ar:"اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ",en:"O Allah, forgive him, have mercy on him, grant him well-being, and pardon him.",src:"Muslim — funeral duʿāʾ",tags:"deceased funeral"},
    {t:"Istikhārah (core)",ar:"اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ",en:"O Allah, I seek Your guidance by Your knowledge and ability by Your power…",src:"Bukhārī — istikhārah",tags:"decision guidance"},
    {t:"Laylat al-qadr",ar:"اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",en:"O Allah, You are Pardoning and love to pardon, so pardon me.",src:"Tirmidhī — graded ṣaḥīḥ by many",tags:"ramadan forgiveness"},
    {t:"Seeing new moon",ar:"اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْيُمْنِ وَالْإِيمَانِ",en:"O Allah, let it appear to us with security and faith…",src:"Tirmidhī — graded ḥasan",tags:"moon calendar"},
    {t:"Good in both worlds",ar:"رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",en:"Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",src:"Qurʾān 2:201",tags:"general forgiveness"}
  ];

  function norm(s) { return String(s || "").toLowerCase(); }
  function render(list, q) {
    var box = d.getElementById("dua-results");
    if (!box) return;
    if (!list.length) {
      box.innerHTML = '<p class="search-empty">No match for “' + (q || "") + '”. Try morning, parents, travel, forgiveness…</p>';
      return;
    }
    box.innerHTML = '<p class="dua-count" style="font-size:.78rem;opacity:.85;margin:.25rem 0 .5rem">' + list.length + ' duʿāʾ (educational only — not a fatwa)</p>' +
      list.map(function (x) {
        return '<article class="dua-card" style="margin:.55rem 0;padding:.65rem.75rem;border-radius:12px;border:1px solid rgba(212,180,90,.28);background:rgba(0,0,0,.18)">' +
          "<strong>" + x.t + "</strong>" +
          '<div lang="ar" dir="rtl" style="font-size:1.05rem;line-height:1.75;margin:.35rem 0">' + x.ar + "</div>" +
          "<p style=\"margin:.2rem 0;font-size:.86rem\">" + x.en + "</p>" +
          '<p style="margin:0;font-size:.72rem;opacity:.85">' + x.src + "</p></article>";
      }).join("");
  }
  function searchMasnoonDuaImpl() {
    var inp = d.getElementById("dua-search");
    var q = norm(inp && inp.value);
    var list = !q ? DUAS : DUAS.filter(function (x) {
      return norm(x.t + " " + x.en + " " + x.tags + " " + x.src).indexOf(q) !== -1;
    });
    render(list, q);
  }
  w.searchMasnoonDua = searchMasnoonDuaImpl;
  w.clarityMasnoonDuaCount = function () { return DUAS.length; };
  function boot() {
    var box = d.getElementById("dua-results");
    if (box) render(DUAS, "");
    // re-assert override after late scripts
    setTimeout(function () { w.searchMasnoonDua = searchMasnoonDuaImpl; }, 1500);
    setTimeout(function () { w.searchMasnoonDua = searchMasnoonDuaImpl; }, 4000);
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 300); });
  else setTimeout(boot, 300);
})(window, document);
