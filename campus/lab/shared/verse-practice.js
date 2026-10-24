/**
 * Shared verse practice · 20261017TQ
 * Fetch Arabic/EN from AlQuran.cloud · audio EveryAyah Ḥuṣarī
 * Used by Recite + optional Tajweed fill
 */
(function (g) {
  "use strict";
  if (g.CuVersePractice) return;
  var CACHE_KEY = "cu_lab_verse_cache_v1";
  var SURAHS = [
    [1,"Al-Fātiḥah",7],[2,"Al-Baqarah",286],[3,"Āl ʿImrān",200],[4,"An-Nisāʾ",176],
    [5,"Al-Māʾidah",120],[6,"Al-Anʿām",165],[7,"Al-Aʿrāf",206],[8,"Al-Anfāl",75],
    [9,"At-Tawbah",129],[10,"Yūnus",109],[11,"Hūd",123],[12,"Yūsuf",111],
    [13,"Ar-Raʿd",43],[14,"Ibrāhīm",52],[15,"Al-Ḥijr",99],[16,"An-Naḥl",128],
    [17,"Al-Isrāʾ",111],[18,"Al-Kahf",110],[19,"Maryam",98],[20,"Ṭā-Hā",135],
    [21,"Al-Anbiyāʾ",112],[22,"Al-Ḥajj",78],[23,"Al-Muʾminūn",118],[24,"An-Nūr",64],
    [25,"Al-Furqān",77],[26,"Ash-Shuʿarāʾ",227],[27,"An-Naml",93],[28,"Al-Qaṣaṣ",88],
    [29,"Al-ʿAnkabūt",69],[30,"Ar-Rūm",60],[31,"Luqmān",34],[32,"As-Sajdah",30],
    [33,"Al-Aḥzāb",73],[34,"Sabaʾ",54],[35,"Fāṭir",45],[36,"Yā-Sīn",83],
    [37,"Aṣ-Ṣāffāt",182],[38,"Ṣād",88],[39,"Az-Zumar",75],[40,"Ghāfir",85],
    [41,"Fuṣṣilat",54],[42,"Ash-Shūrā",53],[43,"Az-Zukhruf",89],[44,"Ad-Dukhān",59],
    [45,"Al-Jāthiyah",37],[46,"Al-Aḥqāf",35],[47,"Muḥammad",38],[48,"Al-Fatḥ",29],
    [49,"Al-Ḥujurāt",18],[50,"Qāf",45],[51,"Adh-Dhāriyāt",60],[52,"Aṭ-Ṭūr",49],
    [53,"An-Najm",62],[54,"Al-Qamar",55],[55,"Ar-Raḥmān",78],[56,"Al-Wāqiʿah",96],
    [57,"Al-Ḥadīd",29],[58,"Al-Mujādilah",22],[59,"Al-Ḥashr",24],[60,"Al-Mumtaḥanah",13],
    [61,"Aṣ-Ṣaff",14],[62,"Al-Jumuʿah",11],[63,"Al-Munāfiqūn",11],[64,"At-Taghābun",18],
    [65,"Aṭ-Ṭalāq",12],[66,"At-Taḥrīm",12],[67,"Al-Mulk",30],[68,"Al-Qalam",52],
    [69,"Al-Ḥāqqah",52],[70,"Al-Maʿārij",44],[71,"Nūḥ",28],[72,"Al-Jinn",28],
    [73,"Al-Muzzammil",20],[74,"Al-Muddaththir",56],[75,"Al-Qiyāmah",40],[76,"Al-Insān",31],
    [77,"Al-Mursalāt",50],[78,"An-Nabaʾ",40],[79,"An-Nāziʿāt",46],[80,"ʿAbasa",42],
    [81,"At-Takwīr",29],[82,"Al-Infiṭār",19],[83,"Al-Muṭaffifīn",36],[84,"Al-Inshiqāq",25],
    [85,"Al-Burūj",22],[86,"Aṭ-Ṭāriq",17],[87,"Al-Aʿlā",19],[88,"Al-Ghāshiyah",26],
    [89,"Al-Fajr",30],[90,"Al-Balad",20],[91,"Ash-Shams",15],[92,"Al-Layl",21],
    [93,"Aḍ-Ḍuḥā",11],[94,"Ash-Sharḥ",8],[95,"At-Tīn",8],[96,"Al-ʿAlaq",19],
    [97,"Al-Qadr",5],[98,"Al-Bayyinah",8],[99,"Az-Zalzalah",8],[100,"Al-ʿĀdiyāt",11],
    [101,"Al-Qāriʿah",11],[102,"At-Takāthur",8],[103,"Al-ʿAṣr",3],[104,"Al-Humazah",9],
    [105,"Al-Fīl",5],[106,"Quraysh",4],[107,"Al-Māʿūn",7],[108,"Al-Kawthar",3],
    [109,"Al-Kāfirūn",6],[110,"An-Naṣr",3],[111,"Al-Masad",5],[112,"Al-Ikhlāṣ",4],
    [113,"Al-Falaq",5],[114,"An-Nās",6]
  ];

  function cacheGet(k) {
    try {
      var o = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
      return o[k] || null;
    } catch (e) { return null; }
  }
  function cacheSet(k, v) {
    try {
      var o = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
      o[k] = v;
      var keys = Object.keys(o);
      if (keys.length > 80) delete o[keys[0]];
      localStorage.setItem(CACHE_KEY, JSON.stringify(o));
    } catch (e) {}
  }

  function fillSurahSelect(sel) {
    if (!sel) return;
    sel.innerHTML = SURAHS.map(function (s) {
      return '<option value="' + s[0] + '">' + s[0] + " · " + s[1] + "</option>";
    }).join("");
  }

  function ayahCount(surah) {
    var row = SURAHS.find(function (s) { return s[0] === Number(surah); });
    return row ? row[2] : 7;
  }

  function audioUrl(surah, ayah) {
    var s = String(surah).padStart(3, "0");
    var a = String(ayah).padStart(3, "0");
    return "https://everyayah.com/data/Husary_128kbps/" + s + a + ".mp3";
  }

  function fetchAyah(surah, ayah) {
    surah = Number(surah) || 1;
    ayah = Number(ayah) || 1;
    var max = ayahCount(surah);
    if (ayah < 1) ayah = 1;
    if (ayah > max) ayah = max;
    var key = surah + ":" + ayah;
    var hit = cacheGet(key);
    if (hit) return Promise.resolve(hit);

    var url = "https://api.alquran.cloud/v1/ayah/" + surah + ":" + ayah + "/editions/quran-uthmani,en.sahih";
    return fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var eds = (data && data.data) || [];
        var ar = "", en = "";
        eds.forEach(function (e) {
          if (e.edition && e.edition.identifier === "quran-uthmani") ar = e.text || "";
          if (e.edition && String(e.edition.identifier || "").indexOf("en.") === 0) en = e.text || "";
        });
        if (!ar && eds[0]) ar = eds[0].text || "";
        if (!en && eds[1]) en = eds[1].text || "";
        var pack = { surah: surah, ayah: ayah, ar: ar, en: en, audio: audioUrl(surah, ayah) };
        cacheSet(key, pack);
        return pack;
      })
      .catch(function () {
        return {
          surah: surah, ayah: ayah,
          ar: "(offline — open when connected)",
          en: "Could not fetch. Try again online.",
          audio: audioUrl(surah, ayah),
          offline: true
        };
      });
  }

  function playAudio(url) {
    try {
      if (g.__cuVerseAudio) { g.__cuVerseAudio.pause(); }
      var a = new Audio(url);
      g.__cuVerseAudio = a;
      return a.play();
    } catch (e) { return Promise.reject(e); }
  }

  function speakAr(text) {
    try {
      if (!g.speechSynthesis) return;
      g.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = "ar-SA";
      u.rate = 0.85;
      g.speechSynthesis.speak(u);
    } catch (e) {}
  }

  function speakEn(text) {
    try {
      if (!g.speechSynthesis) return;
      g.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      g.speechSynthesis.speak(u);
    } catch (e) {}
  }

  g.CuVersePractice = {
    SURAHS: SURAHS,
    fillSurahSelect: fillSurahSelect,
    ayahCount: ayahCount,
    fetchAyah: fetchAyah,
    audioUrl: audioUrl,
    playAudio: playAudio,
    speakAr: speakAr,
    speakEn: speakEn,
    VER: "20261017TQ"
  };
})(typeof globalThis !== "undefined" ? globalThis : (typeof window !== "undefined" ? window : this));
