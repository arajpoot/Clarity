/*! banner enrich restore · Rabbana + AV + city + countdown · Bismillah */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_BANNER_ENRICH_V2__) return;
  w.__CLARITY_BANNER_ENRICH_V2__ = true;

  var KEY = "clarity_salah_location_v1";
  var lastT = null, timer = null, ri = 0;

  /* Short Rabbana set — educational; full cycle on companion content pages */
  var RABBANA = [
    { ar: "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ", en: "Our Lord, accept [this] from us. Indeed You are the Hearing, the Knowing.", ref: "Qurʾān 2:127" },
    { ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", en: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.", ref: "Qurʾān 2:201" },
    { ar: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ", en: "Our Lord, pour upon us patience, plant firmly our feet, and give us victory over the disbelieving people.", ref: "Qurʾān 2:250" },
    { ar: "رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا", en: "Our Lord, do not impose blame upon us if we have forgotten or erred.", ref: "Qurʾān 2:286" },
    { ar: "رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا", en: "Our Lord, lay not upon us a burden like that which You laid upon those before us.", ref: "Qurʾān 2:286" },
    { ar: "رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ", en: "Our Lord, burden us not with that which we have no ability to bear.", ref: "Qurʾān 2:286" },
    { ar: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً", en: "Our Lord, let not our hearts deviate after You have guided us, and grant us from Yourself mercy.", ref: "Qurʾān 3:8" },
    { ar: "رَبَّنَا إِنَّكَ جَامِعُ النَّاسِ لِيَوْمٍ لَّا رَيْبَ فِيهِ", en: "Our Lord, surely You will gather the people for a Day about which there is no doubt.", ref: "Qurʾān 3:9" },
    { ar: "رَبَّنَا إِنَّنَا آمَنَّا فَاغْفِرْ لَنَا ذُنُوبَنَا وَقِنَا عَذَابَ النَّارِ", en: "Our Lord, we have believed, so forgive us our sins and protect us from the punishment of the Fire.", ref: "Qurʾān 3:16" },
    { ar: "رَبَّنَا آمَنَّا بِمَا أَنزَلْتَ وَاتَّبَعْنَا الرَّسُولَ فَاكْتُبْنَا مَعَ الشَّاهِدِينَ", en: "Our Lord, we have believed in what You revealed and have followed the Messenger, so register us among the witnesses.", ref: "Qurʾān 3:53" },
    { ar: "رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ", en: "Our Lord, forgive us our sins and the excess in our affairs, plant firmly our feet, and give us victory over the disbelieving people.", ref: "Qurʾān 3:147" },
    { ar: "رَبَّنَا مَا خَلَقْتَ هَٰذَا بَاطِلًا سُبْحَانَكَ فَقِنَا عَذَابَ النَّارِ", en: "Our Lord, You did not create this aimlessly; exalted are You [above such a thing]; then protect us from the punishment of the Fire.", ref: "Qurʾān 3:191" },
    { ar: "رَبَّنَا إِنَّكَ مَن تُدْخِلِ النَّارَ فَقَدْ أَخْزَيْتَهُ", en: "Our Lord, indeed whoever You admit to the Fire — You have disgraced him.", ref: "Qurʾān 3:192" },
    { ar: "رَبَّنَا إِنَّنَا سَمِعْنَا مُنَادِيًا يُنَادِي لِلْإِيمَانِ أَنْ آمِنُوا بِرَبِّكُمْ فَآمَنَّا", en: "Our Lord, we have heard a caller calling to faith, [saying], 'Believe in your Lord,' and we have believed.", ref: "Qurʾān 3:193" },
    { ar: "رَبَّنَا فَاغْفِرْ لَنَا ذُنُوبَنَا وَكَفِّرْ عَنَّا سَيِّئَاتِنَا وَتَوَفَّنَا مَعَ الْأَبْرَارِ", en: "Our Lord, so forgive us our sins and remove from us our misdeeds and cause us to die with the righteous.", ref: "Qurʾān 3:193" },
    { ar: "رَبَّنَا وَآتِنَا مَا وَعَدتَّنَا عَلَىٰ رُسُلِكَ وَلَا تُخْزِنَا يَوْمَ الْقِيَامَةِ", en: "Our Lord, grant us what You promised us through Your messengers and do not disgrace us on the Day of Resurrection.", ref: "Qurʾān 3:194" },
    { ar: "رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ", en: "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.", ref: "Qurʾān 7:23" },
    { ar: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَتَوَفَّنَا مُسْلِمِينَ", en: "Our Lord, pour upon us patience and let us die as Muslims [in submission to You].", ref: "Qurʾān 7:126" },
    { ar: "رَبَّنَا لَا تَجْعَلْنَا مَعَ الْقَوْمِ الظَّالِمِينَ", en: "Our Lord, do not place us with the wrongdoing people.", ref: "Qurʾān 7:47" },
    { ar: "رَبَّنَا افْتَحْ بَيْنَنَا وَبَيْنَ قَوْمِنَا بِالْحَقِّ وَأَنتَ خَيْرُ الْفَاتِحِينَ", en: "Our Lord, decide between us and our people in truth, and You are the best of those who give decision.", ref: "Qurʾān 7:89" },
    { ar: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَتَوَفَّنَا مُسْلِمِينَ", en: "Our Lord, pour upon us patience and take us as Muslims.", ref: "Qurʾān 7:126" },
    { ar: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا", en: "Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.", ref: "Qurʾān 25:74" },
    { ar: "رَبَّنَا اصْرِفْ عَنَّا عَذَابَ جَهَنَّمَ إِنَّ عَذَابَهَا كَانَ غَرَامًا", en: "Our Lord, avert from us the punishment of Hell. Indeed, its punishment is ever adhering.", ref: "Qurʾān 25:65" },
    { ar: "رَبَّنَا هَبْ لَنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا", en: "Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance.", ref: "Qurʾān 18:10" },
    { ar: "رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا", en: "Our Lord, grant us from Yourself mercy and facilitate for us our affair in the right way.", ref: "Qurʾān 18:10" },
    { ar: "رَبَّنَا إِنَّنَا نَخَافُ أَن يَفْرُطَ عَلَيْنَا أَوْ أَن يَطْغَىٰ", en: "Our Lord, indeed we fear that he will hasten [punishment] against us or that he will transgress.", ref: "Qurʾān 20:45" },
    { ar: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي", en: "My Lord, expand for me my breast [with assurance] and ease for me my task.", ref: "Qurʾān 20:25–26" },
    { ar: "رَبَّنَا آمَنَّا فَاغْفِرْ لَنَا وَارْحَمْنَا وَأَنتَ خَيْرُ الرَّاحِمِينَ", en: "Our Lord, we have believed, so forgive us and have mercy upon us, and You are the best of the merciful.", ref: "Qurʾān 23:109" },
    { ar: "رَبَّنَا اصْرِفْ عَنَّا عَذَابَ جَهَنَّمَ إِنَّ عَذَابَهَا كَانَ غَرَامًا", en: "Our Lord, turn away from us the punishment of Hell; indeed its punishment is a lasting affliction.", ref: "Qurʾān 25:65" },
    { ar: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ", en: "Our Lord, grant us from our spouses and descendants comfort to our eyes.", ref: "Qurʾān 25:74" },
    { ar: "رَبَّنَا وَسِعْتَ كُلَّ شَيْءٍ رَّحْمَةً وَعِلْمًا فَاغْفِرْ لِلَّذِينَ تَابُوا", en: "Our Lord, You have encompassed all things in mercy and knowledge, so forgive those who have repented.", ref: "Qurʾān 40:7" },
    { ar: "رَبَّنَا وَأَدْخِلْهُمْ جَنَّاتِ عَدْنٍ الَّتِي وَعَدتَّهُمْ", en: "Our Lord, and admit them to gardens of perpetual residence which You have promised them.", ref: "Qurʾān 40:8" },
    { ar: "رَبَّنَا اكْشِفْ عَنَّا الْعَذَابَ إِنَّا مُؤْمِنُونَ", en: "Our Lord, remove from us the torment; indeed, we are believers.", ref: "Qurʾān 44:12" },
    { ar: "رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ", en: "Our Lord, forgive us and our brothers who preceded us in faith.", ref: "Qurʾān 59:10" },
    { ar: "رَبَّنَا إِنَّكَ رَءُوفٌ رَّحِيمٌ", en: "Our Lord, indeed You are Kind and Merciful.", ref: "Qurʾān 59:10" },
    { ar: "رَبَّنَا عَلَيْكَ تَوَكَّلْنَا وَإِلَيْكَ أَنَبْنَا وَإِلَيْكَ الْمَصِيرُ", en: "Our Lord, upon You we have relied, and to You we have returned, and to You is the destination.", ref: "Qurʾān 60:4" },
    { ar: "رَبَّنَا لَا تَجْعَلْنَا فِتْنَةً لِّلَّذِينَ كَفَرُوا وَاغْفِرْ لَنَا", en: "Our Lord, make us not [objects of] torment for the disbelievers, and forgive us.", ref: "Qurʾān 60:5" },
    { ar: "رَبَّنَا أَتْمِمْ لَنَا نُورَنَا وَاغْفِرْ لَنَا إِنَّكَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", en: "Our Lord, perfect for us our light and forgive us. Indeed, You are over all things competent.", ref: "Qurʾān 66:8" },
    { ar: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ", en: "My Lord, enable me to be grateful for Your favor which You have bestowed upon me.", ref: "Qurʾān 27:19" },
    { ar: "رَبِّ أَعُوذُ بِكَ مِنْ هَمَزَاتِ الشَّيَاطِينِ وَأَعُوذُ بِكَ رَبِّ أَن يَحْضُرُونِ", en: "My Lord, I seek refuge in You from the incitements of the devils, and I seek refuge in You, my Lord, lest they be present with me.", ref: "Qurʾān 23:97–98" }
  ];

  function $(id) { return d.getElementById(id); }

  function showRabbana() {
    var item = RABBANA[ri % RABBANA.length];
    var ar = $("rabbana-arabic"), en = $("rabbana-english"), ref = $("rabbana-ref"), c = $("rabbana-count");
    if (ar) ar.textContent = item.ar;
    if (en) en.textContent = item.en;
    if (ref) ref.textContent = item.ref;
    if (c) c.textContent = (ri % RABBANA.length) + 1 + " / " + RABBANA.length;
  }
  w.cycleRabbana = function (dir) {
    ri = (ri + (dir || 1) + RABBANA.length * 10) % RABBANA.length;
    showRabbana();
  };

  function fillSurahs() {
    var sel = $("surah-list-pill");
    if (!sel) return;
    /* Always rebuild full 114 */
    var cur = sel.value;
    sel.innerHTML = "";
    var ph = d.createElement("option");
    ph.value = "";
    ph.textContent = "Sūrah 1–114";
    sel.appendChild(ph);
    var names = [
      [1,"Al-Fātiḥah"],
      [2,"Al-Baqarah"],
      [3,"Āl ʿImrān"],
      [4,"An-Nisāʾ"],
      [5,"Al-Māʾidah"],
      [6,"Al-Anʿām"],
      [7,"Al-Aʿrāf"],
      [8,"Al-Anfāl"],
      [9,"At-Tawbah"],
      [10,"Yūnus"],
      [11,"Hūd"],
      [12,"Yūsuf"],
      [13,"Ar-Raʿd"],
      [14,"Ibrāhīm"],
      [15,"Al-Ḥijr"],
      [16,"An-Naḥl"],
      [17,"Al-Isrāʾ"],
      [18,"Al-Kahf"],
      [19,"Maryam"],
      [20,"Ṭā-Hā"],
      [21,"Al-Anbiyāʾ"],
      [22,"Al-Ḥajj"],
      [23,"Al-Muʾminūn"],
      [24,"An-Nūr"],
      [25,"Al-Furqān"],
      [26,"Ash-Shuʿarāʾ"],
      [27,"An-Naml"],
      [28,"Al-Qaṣaṣ"],
      [29,"Al-ʿAnkabūt"],
      [30,"Ar-Rūm"],
      [31,"Luqmān"],
      [32,"As-Sajdah"],
      [33,"Al-Aḥzāb"],
      [34,"Sabaʾ"],
      [35,"Fāṭir"],
      [36,"Yā-Sīn"],
      [37,"Aṣ-Ṣāffāt"],
      [38,"Ṣād"],
      [39,"Az-Zumar"],
      [40,"Ghāfir"],
      [41,"Fuṣṣilat"],
      [42,"Ash-Shūrā"],
      [43,"Az-Zukhruf"],
      [44,"Ad-Dukhān"],
      [45,"Al-Jāthiyah"],
      [46,"Al-Aḥqāf"],
      [47,"Muḥammad"],
      [48,"Al-Fatḥ"],
      [49,"Al-Ḥujurāt"],
      [50,"Qāf"],
      [51,"Adh-Dhāriyāt"],
      [52,"Aṭ-Ṭūr"],
      [53,"An-Najm"],
      [54,"Al-Qamar"],
      [55,"Ar-Raḥmān"],
      [56,"Al-Wāqiʿah"],
      [57,"Al-Ḥadīd"],
      [58,"Al-Mujādilah"],
      [59,"Al-Ḥashr"],
      [60,"Al-Mumtaḥanah"],
      [61,"Aṣ-Ṣaff"],
      [62,"Al-Jumuʿah"],
      [63,"Al-Munāfiqūn"],
      [64,"At-Taghābun"],
      [65,"Aṭ-Ṭalāq"],
      [66,"At-Taḥrīm"],
      [67,"Al-Mulk"],
      [68,"Al-Qalam"],
      [69,"Al-Ḥāqqah"],
      [70,"Al-Maʿārij"],
      [71,"Nūḥ"],
      [72,"Al-Jinn"],
      [73,"Al-Muzzammil"],
      [74,"Al-Muddaththir"],
      [75,"Al-Qiyāmah"],
      [76,"Al-Insān"],
      [77,"Al-Mursalāt"],
      [78,"An-Nabaʾ"],
      [79,"An-Nāziʿāt"],
      [80,"ʿAbasa"],
      [81,"At-Takwīr"],
      [82,"Al-Infiṭār"],
      [83,"Al-Muṭaffifīn"],
      [84,"Al-Inshiqāq"],
      [85,"Al-Burūj"],
      [86,"Aṭ-Ṭāriq"],
      [87,"Al-Aʿlā"],
      [88,"Al-Ghāshiyah"],
      [89,"Al-Fajr"],
      [90,"Al-Balad"],
      [91,"Ash-Shams"],
      [92,"Al-Layl"],
      [93,"Aḍ-Ḍuḥā"],
      [94,"Ash-Sharḥ"],
      [95,"At-Tīn"],
      [96,"Al-ʿAlaq"],
      [97,"Al-Qadr"],
      [98,"Al-Bayyinah"],
      [99,"Az-Zalzalah"],
      [100,"Al-ʿĀdiyāt"],
      [101,"Al-Qāriʿah"],
      [102,"At-Takāthur"],
      [103,"Al-ʿAṣr"],
      [104,"Al-Humazah"],
      [105,"Al-Fīl"],
      [106,"Quraysh"],
      [107,"Al-Māʿūn"],
      [108,"Al-Kawthar"],
      [109,"Al-Kāfirūn"],
      [110,"An-Naṣr"],
      [111,"Al-Masad"],
      [112,"Al-Ikhlāṣ"],
      [113,"Al-Falaq"],
      [114,"An-Nās"]
    ];
    names.forEach(function (p) {
      var o = d.createElement("option");
      o.value = String(p[0]);
      o.textContent = p[0] + " · " + p[1];
      sel.appendChild(o);
    });
    if (cur) sel.value = cur;
  }

  function vague(s) {
    s = (s || "").trim();
    return !s || /^near you$/i.test(s) || /^-?\d+(\.\d+)?\s*°/.test(s) ||
      /locating|saved location/i.test(s) || /^madinah$/i.test(s) && !readLoc();
  }
  /* Don't treat real city Madinah as vague when user is actually there — only when it's owner fallback without save */

  function setCity(label) {
    var el = $("hijri-local-loc");
    if (!el) return;
    var t = (label || "").trim();
    if (!t || /^near you$/i.test(t) || /^-?\d+(\.\d+)?\s*°/.test(t) || /locating/i.test(t)) {
      el.textContent = "Locating…";
      return;
    }
    if (/^saved location$/i.test(t)) {
      el.textContent = "Tap Update location";
      return;
    }
    el.textContent = t;
  }

  function parseHM(s) {
    if (!s) return null;
    s = String(s).replace(/[ap]m/i, "").trim().split(" ")[0];
    var p = s.split(":");
    if (p.length < 2) return null;
    var h = parseInt(p[0], 10), m = parseInt(p[1], 10);
    if (isNaN(h) || isNaN(m)) return null;
    return { h: h, m: m };
  }

  function tick() {
    var box = $("clarity-next-prayer");
    if (!box || !lastT) return;
    var order = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
    var now = new Date(), nextN = null, nextD = null;
    for (var i = 0; i < order.length; i++) {
      var hm = parseHM(lastT[order[i]]);
      if (!hm) continue;
      var dt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hm.h, hm.m, 0, 0);
      if (dt > now) { nextN = order[i]; nextD = dt; break; }
    }
    if (!nextN) {
      var f = parseHM(lastT.Fajr);
      if (f) {
        nextN = "Fajr";
        nextD = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, f.h, f.m, 0, 0);
      }
    }
    if (!nextN || !nextD) return;
    var ms = Math.max(0, nextD - now);
    var totalMin = Math.floor(ms / 60000);
    var hh = Math.floor(totalMin / 60), mm = totalMin % 60, ss = Math.floor((ms % 60000) / 1000);
    var name = box.querySelector(".np-name"), count = box.querySelector(".np-count");
    if (name) name.textContent = nextN;
    if (count) count.textContent = (hh ? hh + "h " : "") + mm + "m" + (hh ? "" : " " + ss + "s");
  }

  function renderTimes(t, label) {
    lastT = t;
    var list = $("salah-times-list");
    if (list && t) {
      list.innerHTML = ["Fajr","Sunrise","Dhuhr","Asr","Maghrib","Isha"].map(function (n) {
        var val = (t[n] || "—").toString().split(" ")[0];
        return '<li class="salah-row"><span class="salah-name">' + n + '</span><span class="salah-time">' + val + "</span></li>";
      }).join("");
    }
    if (label) setCity(label);
    if (!timer) timer = setInterval(tick, 1000);
    tick();
  }

  function reverse(lat, lon) {
    return fetch(
      "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + lat +
        "&longitude=" + lon + "&localityLanguage=en",
      { credentials: "omit" }
    )
      .then(function (r) { return r.json(); })
      .then(function (j) {
        return (j && (j.city || j.locality || j.principalSubdivision)) || "";
      })
      .catch(function () { return ""; });
  }

  function saveLoc(o) {
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
  }
  function readLoc() {
    try {
      var o = JSON.parse(localStorage.getItem(KEY) || "null");
      if (o && typeof o.lat === "number") return o;
    } catch (e) {}
    return null;
  }

  function fetchTimes(lat, lon, label) {
    return fetch(
      "https://api.aladhan.com/v1/timings?latitude=" + lat + "&longitude=" + lon + "&method=4",
      { credentials: "omit" }
    )
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var t = j && j.data && j.data.timings;
        if (t) renderTimes(t, label);
      });
  }

  function applySaved() {
    var s = readLoc();
    if (!s) return false;
    if (s.city && !/saved location/i.test(s.city)) setCity(s.city);
    else setCity("Locating…");
    fetchTimes(s.lat, s.lon, s.city);
    if (!s.city || /saved location|near you/i.test(s.city)) {
      reverse(s.lat, s.lon).then(function (city) {
        if (city) {
          s.city = city;
          saveLoc(s);
          setCity(city);
        }
      });
    }
    return true;
  }

  function geo(force) {
    return new Promise(function (resolve, reject) {
      if (!navigator.geolocation) return reject();
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          var lat = pos.coords.latitude, lon = pos.coords.longitude;
          reverse(lat, lon).then(function (city) {
            var o = { lat: lat, lon: lon, city: city || "Saved location", ts: Date.now() };
            saveLoc(o);
            setCity(o.city);
            fetchTimes(lat, lon, o.city).then(resolve).catch(reject);
          });
        },
        reject,
        { enableHighAccuracy: false, timeout: 12000, maximumAge: force ? 0 : 300000 }
      );
    });
  }

  function forceKaaba() {
    /* 20261111STILLS: do not rewrite temps DOM — icons live in HTML; temps.js sets numbers only */
    return;
  }

  function patchOwnerCity() {
    /* After owner paints Madinah fallback, re-apply saved city */
    if (typeof w.loadSalah === "function" && !w.loadSalah.__enrich) {
      var orig = w.loadSalah;
      w.loadSalah = function () {
        if (readLoc()) {
          applySaved();
          return;
        }
        return orig.apply(this, arguments);
      };
      w.loadSalah.__enrich = true;
    }
  }

  function wire() {
    if (/\bsolo=1\b/.test(location.search) || w.top === w) {
      d.body.classList.add("solo");
    }
    showRabbana();
    fillSurahs();
    forceKaaba();
    setTimeout(forceKaaba, 1500);

    var prev = $("rabbana-prev"), next = $("rabbana-next");
    if (prev) prev.onclick = function () { w.cycleRabbana(-1); };
    if (next) next.onclick = function () { w.cycleRabbana(1); };

    var btn = $("clarity-salah-loc-btn");
    if (btn) {
      btn.onclick = function () {
        btn.disabled = true;
        btn.textContent = "Updating…";
        geo(true)
          .then(function () { btn.textContent = "Location saved"; })
          .catch(function () { btn.textContent = "Unavailable"; })
          .then(function () {
            setTimeout(function () {
              btn.textContent = "Update location";
              btn.disabled = false;
            }, 1500);
          });
      };
    }

    patchOwnerCity();
    if (!applySaved()) {
      geo(false).catch(function () { setCity("Tap Update location"); });
    } else {
      setTimeout(function () { patchOwnerCity(); applySaved(); }, 5000);
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(wire, 300); });
  else setTimeout(wire, 300);
})(window, document);
