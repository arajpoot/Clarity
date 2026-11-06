/*! companion-banner-desktop-v1
 * Ensures Rabbana 24 cycle, 114 Surah options, desktop plaque class.
 * Does not touch Amānah/Campus/Yawm. Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_BANNER_DESKTOP_V1__) return;
  w.__COMPANION_BANNER_DESKTOP_V1__ = true;

  var RABBANA = w.CLARITY_RABBANA || null;

  function defaultRabbana() {
    /* 24 Rabbana — educational list; UI cycles these if page array missing */
    return [
      { ar: "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ", en: "Our Lord, accept [this] from us. Indeed You are the Hearing, the Knowing.", ref: "Quran 2:127" },
      { ar: "رَبَّنَا وَاجْعَلْنَا مُسْلِمَيْنِ لَكَ وَمِن ذُرِّيَّتِنَا أُمَّةً مُّسْلِمَةً لَّكَ", en: "Our Lord, and make us Muslims [in submission] to You and from our descendants a Muslim nation [in submission] to You.", ref: "Quran 2:128" },
      { ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", en: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.", ref: "Quran 2:201" },
      { ar: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ", en: "Our Lord, pour upon us patience and plant firmly our feet and give us victory over the disbelieving people.", ref: "Quran 2:250" },
      { ar: "رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا", en: "Our Lord, do not impose blame upon us if we have forgotten or erred.", ref: "Quran 2:286" },
      { ar: "رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا", en: "Our Lord, and lay not upon us a burden like that which You laid upon those before us.", ref: "Quran 2:286" },
      { ar: "رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ", en: "Our Lord, and burden us not with that which we have no ability to bear.", ref: "Quran 2:286" },
      { ar: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً", en: "Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy.", ref: "Quran 3:8" },
      { ar: "رَبَّنَا إِنَّكَ جَامِعُ النَّاسِ لِيَوْمٍ لَّا رَيْبَ فِيهِ", en: "Our Lord, surely You will gather the people for a Day about which there is no doubt.", ref: "Quran 3:9" },
      { ar: "رَبَّنَا إِنَّنَا آمَنَّا فَاغْفِرْ لَنَا ذُنُوبَنَا وَقِنَا عَذَابَ النَّارِ", en: "Our Lord, indeed we have believed, so forgive us our sins and protect us from the punishment of the Fire.", ref: "Quran 3:16" },
      { ar: "رَبَّنَا آمَنَّا بِمَا أَنزَلْتَ وَاتَّبَعْنَا الرَّسُولَ فَاكْتُبْنَا مَعَ الشَّاهِدِينَ", en: "Our Lord, we have believed in what You revealed and have followed the messenger, so register us among the witnesses.", ref: "Quran 3:53" },
      { ar: "رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ", en: "Our Lord, forgive us our sins and the excess [committed] in our affairs and plant firmly our feet and give us victory over the disbelieving people.", ref: "Quran 3:147" },
      { ar: "رَبَّنَا مَا خَلَقْتَ هَٰذَا بَاطِلًا سُبْحَانَكَ فَقِنَا عَذَابَ النَّارِ", en: "Our Lord, You did not create this aimlessly; exalted are You [above such a thing]; then protect us from the punishment of the Fire.", ref: "Quran 3:191" },
      { ar: "رَبَّنَا إِنَّكَ مَن تُدْخِلِ النَّارَ فَقَدْ أَخْزَيْتَهُ", en: "Our Lord, indeed whoever You admit to the Fire - You have disgraced him.", ref: "Quran 3:192" },
      { ar: "رَبَّنَا إِنَّنَا سَمِعْنَا مُنَادِيًا يُنَادِي لِلْإِيمَانِ أَنْ آمِنُوا بِرَبِّكُمْ فَآمَنَّا", en: "Our Lord, indeed we have heard a caller calling to faith, [saying], 'Believe in your Lord,' and we have believed.", ref: "Quran 3:193" },
      { ar: "رَبَّنَا فَاغْفِرْ لَنَا ذُنُوبَنَا وَكَفِّرْ عَنَّا سَيِّئَاتِنَا وَتَوَفَّنَا مَعَ الْأَبْرَارِ", en: "Our Lord, so forgive us our sins and remove from us our misdeeds and cause us to die with the righteous.", ref: "Quran 3:193" },
      { ar: "رَبَّنَا وَآتِنَا مَا وَعَدتَّنَا عَلَىٰ رُسُلِكَ وَلَا تُخْزِنَا يَوْمَ الْقِيَامَةِ", en: "Our Lord, and grant us what You promised us through Your messengers and do not disgrace us on the Day of Resurrection.", ref: "Quran 3:194" },
      { ar: "رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ", en: "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.", ref: "Quran 7:23" },
      { ar: "رَبَّنَا لَا تَجْعَلْنَا مَعَ الْقَوْمِ الظَّالِمِينَ", en: "Our Lord, do not place us with the wrongdoing people.", ref: "Quran 7:47" },
      { ar: "رَبَّنَا افْتَحْ بَيْنَنَا وَبَيْنَ قَوْمِنَا بِالْحَقِّ وَأَنتَ خَيْرُ الْفَاتِحِينَ", en: "Our Lord, decide between us and our people in truth, and You are the best of those who give decision.", ref: "Quran 7:89" },
      { ar: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَتَوَفَّنَا مُسْلِمِينَ", en: "Our Lord, pour upon us patience and let us die as Muslims [in submission to You].", ref: "Quran 7:126" },
      { ar: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا", en: "Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.", ref: "Quran 25:74" },
      { ar: "رَبَّنَا اصْرِفْ عَنَّا عَذَابَ جَهَنَّمَ ۖ إِنَّ عَذَابَهَا كَانَ غَرَامًا", en: "Our Lord, avert from us the punishment of Hell. Indeed, its punishment is ever adhering.", ref: "Quran 25:65" },
      { ar: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ", en: "My Lord, make me an establisher of prayer, and [many] from my descendants. Our Lord, and accept my supplication.", ref: "Quran 14:40" }
    ];
  }

  var idx = 0;
  function list() {
    if (Array.isArray(w.CLARITY_RABBANA) && w.CLARITY_RABBANA.length >= 20) return w.CLARITY_RABBANA;
    if (!RABBANA) RABBANA = defaultRabbana();
    return RABBANA;
  }

  function paint(i) {
    var L = list();
    if (!L.length) return;
    idx = ((i % L.length) + L.length) % L.length;
    var item = L[idx];
    var ar = d.getElementById("rabbana-arabic");
    var en = d.getElementById("rabbana-english");
    var ref = d.getElementById("rabbana-ref");
    var count = d.getElementById("rabbana-count");
    if (ar) ar.textContent = item.ar || item.arabic || "";
    if (en) en.textContent = item.en || item.english || "";
    if (ref) ref.textContent = item.ref || item.reference || "";
    if (count) count.textContent = (idx + 1) + " / " + L.length;
  }

  w.cycleRabbana = function (dir) {
    paint(idx + (dir || 1));
  };

  var SURAH_NAMES = [
    "Al-Fatihah","Al-Baqarah","Aal-Imran","An-Nisa","Al-Ma'idah","Al-An'am","Al-A'raf","Al-Anfal","At-Tawbah","Yunus",
    "Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr","An-Nahl","Al-Isra","Al-Kahf","Maryam","Ta-Ha",
    "Al-Anbiya","Al-Hajj","Al-Mu'minun","An-Nur","Al-Furqan","Ash-Shu'ara","An-Naml","Al-Qasas","Al-Ankabut","Ar-Rum",
    "Luqman","As-Sajdah","Al-Ahzab","Saba","Fatir","Ya-Sin","As-Saffat","Sad","Az-Zumar","Ghafir",
    "Fussilat","Ash-Shura","Az-Zukhruf","Ad-Dukhan","Al-Jathiyah","Al-Ahqaf","Muhammad","Al-Fath","Al-Hujurat","Qaf",
    "Adh-Dhariyat","At-Tur","An-Najm","Al-Qamar","Ar-Rahman","Al-Waqi'ah","Al-Hadid","Al-Mujadila","Al-Hashr","Al-Mumtahanah",
    "As-Saff","Al-Jumu'ah","Al-Munafiqun","At-Taghabun","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam","Al-Haqqah","Al-Ma'arij",
    "Nuh","Al-Jinn","Al-Muzzammil","Al-Muddaththir","Al-Qiyamah","Al-Insan","Al-Mursalat","An-Naba","An-Nazi'at","Abasa",
    "At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj","At-Tariq","Al-A'la","Al-Ghashiyah","Al-Fajr","Al-Balad",
    "Ash-Shams","Al-Layl","Ad-Duha","Ash-Sharh","At-Tin","Al-Alaq","Al-Qadr","Al-Bayyinah","Az-Zalzalah","Al-Adiyat",
    "Al-Qari'ah","At-Takathur","Al-Asr","Al-Humazah","Al-Fil","Quraysh","Al-Ma'un","Al-Kawthar","Al-Kafirun","An-Nasr",
    "Al-Masad","Al-Ikhlas","Al-Falaq","An-Nas"
  ];

  function fillSurahs() {
    var sel = d.getElementById("surah-list-pill");
    if (!sel) return;
    if (sel.options.length >= 114) return;
    var keep = sel.options[0] ? sel.options[0].outerHTML : '<option value="">📖 Surahs…</option>';
    var html = keep;
    for (var i = 0; i < 114; i++) {
      html += '<option value="' + (i + 1) + '">' + (i + 1) + ". " + SURAH_NAMES[i] + "</option>";
    }
    sel.innerHTML = html;
  }

  function flagDesktop() {
    var desk = w.matchMedia && w.matchMedia("(min-width: 701px)").matches;
    d.documentElement.classList.toggle("companion-desktop-banner", !!desk);
  }

  function boot() {
    flagDesktop();
    paint(0);
    fillSurahs();
    d.documentElement.setAttribute("data-companion-banner-desktop", "1");
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(boot, 100);
    setTimeout(fillSurahs, 500);
  });
  w.addEventListener("resize", flagDesktop);
})(window, document);
