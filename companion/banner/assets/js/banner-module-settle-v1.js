/*! banner enrich restore · Rabbana + AV + city + countdown · Bismillah */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_BANNER_ENRICH_V2__) return;
  w.__CLARITY_BANNER_ENRICH_V2__ = true;

  var KEY = "clarity_salah_location_v1";
  var lastT = null, timer = null, ri = 0;

  /* Short Rabbana set — educational; full cycle on companion content pages */
  var RABBANA = [
    { ar: "رَبَّنَا تَقَبَّلْ مِنَّا ۖ إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ", en: "Our Lord, accept [this] from us. Indeed You are the Hearing, the Knowing.", ref: "Qurʾān 2:127" },
    { ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", en: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.", ref: "Qurʾān 2:201" },
    { ar: "رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا", en: "Our Lord, do not impose blame upon us if we have forgotten or erred.", ref: "Qurʾān 2:286" },
    { ar: "رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا", en: "Our Lord, and lay not upon us a burden like that which You laid upon those before us.", ref: "Qurʾān 2:286" },
    { ar: "رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا", en: "Our Lord, and burden us not with that which we have no ability to bear. Pardon us, forgive us, and have mercy upon us.", ref: "Qurʾān 2:286" },
    { ar: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَتَوَفَّنَا مُسْلِمِينَ", en: "Our Lord, pour upon us patience and let us die as Muslims.", ref: "Qurʾān 7:126" },
    { ar: "رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ", en: "Our Lord, we have wronged ourselves. If You do not forgive us and have mercy upon us, we will surely be among the losers.", ref: "Qurʾān 7:23" },
    { ar: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي", en: "My Lord, expand for me my breast and ease for me my task.", ref: "Qurʾān 20:25–26" },
    { ar: "رَبِّ زِدْنِي عِلْمًا", en: "My Lord, increase me in knowledge.", ref: "Qurʾān 20:114" },
    { ar: "رَبِّ اغْفِرْ وَارْحَمْ وَأَنتَ خَيْرُ الرَّاحِمِينَ", en: "My Lord, forgive and have mercy, and You are the best of the merciful.", ref: "Qurʾān 23:118" },
    { ar: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا", en: "Our Lord, grant us from our spouses and offspring comfort to our eyes, and make us a leader for the righteous.", ref: "Qurʾān 25:74" },
    { ar: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ", en: "My Lord, enable me to be grateful for Your favor which You have bestowed upon me.", ref: "Qurʾān 27:19" },
    { ar: "رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ", en: "Our Lord, forgive us and our brothers who preceded us in faith.", ref: "Qurʾān 59:10" },
    { ar: "رَبَّنَا عَلَيْكَ تَوَكَّلْنَا وَإِلَيْكَ أَنَبْنَا وَإِلَيْكَ الْمَصِيرُ", en: "Our Lord, upon You we have relied, and to You we have returned, and to You is the destination.", ref: "Qurʾān 60:4" },
    { ar: "رَبَّنَا أَتْمِمْ لَنَا نُورَنَا وَاغْفِرْ لَنَا ۖ إِنَّكَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", en: "Our Lord, perfect for us our light and forgive us. Indeed, You are over all things competent.", ref: "Qurʾān 66:8" },
    { ar: "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا", en: "My Lord, have mercy upon them as they brought me up when I was small.", ref: "Qurʾān 17:24" },
    { ar: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً", en: "Our Lord, let not our hearts deviate after You have guided us, and grant us from Yourself mercy.", ref: "Qurʾān 3:8" },
    { ar: "رَبَّنَا إِنَّنَا آمَنَّا فَاغْفِرْ لَنَا ذُنُوبَنَا وَقِنَا عَذَابَ النَّارِ", en: "Our Lord, we have believed, so forgive us our sins and protect us from the punishment of the Fire.", ref: "Qurʾān 3:16" },
    { ar: "رَبِّ أَعُوذُ بِكَ مِنْ هَمَزَاتِ الشَّيَاطِينِ", en: "My Lord, I seek refuge in You from the incitements of the devils.", ref: "Qurʾān 23:97" },
    { ar: "رَبَّنَا اصْرِفْ عَنَّا عَذَابَ جَهَنَّمَ ۖ إِنَّ عَذَابَهَا كَانَ غَرَامًا", en: "Our Lord, avert from us the punishment of Hell. Indeed, its punishment is ever adhering.", ref: "Qurʾān 25:65" },
    { ar: "رَبِّ هَبْ لِي حُكْمًا وَأَلْحِقْنِي بِالصَّالِحِينَ", en: "My Lord, grant me authority and join me with the righteous.", ref: "Qurʾān 26:83" },
    { ar: "رَبِّ نَجِّنِي وَأَهْلِي مِمَّا يَعْمَلُونَ", en: "My Lord, save me and my family from what they do.", ref: "Qurʾān 26:169" },
    { ar: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ… وَأَدْخِلْنِي بِرَحْمَتِكَ فِي عِبَادِكَ الصَّالِحِينَ", en: "My Lord, enable me to be grateful for Your favor… and admit me by Your mercy into the ranks of Your righteous servants.", ref: "Qurʾān 27:19" },
    { ar: "رَبَّنَا وَسِعْتَ كُلَّ شَيْءٍ رَّحْمَةً وَعِلْمًا فَاغْفِرْ لِلَّذِينَ تَابُوا", en: "Our Lord, You have encompassed all things in mercy and knowledge, so forgive those who have repented.", ref: "Qurʾān 40:7" },
    { ar: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ", en: "My Lord, enable me to be grateful for Your favor which You have bestowed upon me and upon my parents.", ref: "Qurʾān 46:15" },
    { ar: "رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا", en: "Our Lord, forgive us our sins and the excess in our affairs, and plant firmly our feet.", ref: "Qurʾān 3:147" },
    { ar: "رَبَّنَا مَا خَلَقْتَ هَٰذَا بَاطِلًا سُبْحَانَكَ فَقِنَا عَذَابَ النَّارِ", en: "Our Lord, You did not create this aimlessly; exalted are You; protect us from the punishment of the Fire.", ref: "Qurʾān 3:191" },
    { ar: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي", en: "My Lord, make me an establisher of prayer, and many from my descendants.", ref: "Qurʾān 14:40" },
    { ar: "رَبَّنَا تَقَبَّلْ دُعَاءِ", en: "Our Lord, accept my supplication.", ref: "Qurʾān 14:40" },
    { ar: "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ", en: "Our Lord, forgive me and my parents and the believers the Day the account is established.", ref: "Qurʾān 14:41" },
    { ar: "رَبِّ أَدْخِلْنِي مُدْخَلَ صِدْقٍ وَأَخْرِجْنِي مُخْرَجَ صِدْقٍ", en: "My Lord, cause me to enter a sound entrance and to exit a sound exit.", ref: "Qurʾān 17:80" },
    { ar: "رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا", en: "Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance.", ref: "Qurʾān 18:10" },
    { ar: "رَبِّ لَا تَذَرْنِي فَرْدًا وَأَنتَ خَيْرُ الْوَارِثِينَ", en: "My Lord, do not leave me alone [with no heir], while You are the best of inheritors.", ref: "Qurʾān 21:89" },
    { ar: "رَبِّ انصُرْنِي بِمَا كَذَّبُونِ", en: "My Lord, support me because they have denied me.", ref: "Qurʾān 23:26" },
    { ar: "رَبَّنَا اكْشِفْ عَنَّا الْعَذَابَ إِنَّا مُؤْمِنُونَ", en: "Our Lord, remove from us the torment; indeed, we are believers.", ref: "Qurʾān 44:12" },
    { ar: "رَبِّ أَعِنِّي وَلَا تُعِنْ عَلَيَّ", en: "My Lord, aid me and do not aid against me.", ref: "Abū Dāwūd / Tirmidhī — graded ḥasan by many" },
    { ar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى", en: "O Allah, I ask You for guidance, piety, restraint, and sufficiency.", ref: "Muslim" },
    { ar: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ", en: "O Turner of the hearts, make my heart firm upon Your religion.", ref: "Tirmidhī — graded ṣaḥīḥ by many" },
    { ar: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، عَلَيْكَ تَوَكَّلْتُ", en: "O Allah, You are my Lord; there is no god but You. Upon You I rely.", ref: "Educational composite from morning adhkār" },
    { ar: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", en: "Allah is sufficient for us, and He is the best Disposer of affairs.", ref: "Qurʾān 3:173" }
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

  function fillSurahs() { /* full list in HTML */ }

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
    /* only touch numeric text — keep SVG labels intact */
    function onlyNum(el) {
      if (!el) return;
      var n = (el.textContent || "").replace(/[^0-9.\-]/g, "");
      if (n) el.textContent = n;
    }
    onlyNum($("temp-makkah"));
    onlyNum($("temp-madinah"));
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

  
  /* CITY_REASSERT — stop owner fallback labeling user city as Madinah */
  function reassertCity() {
    var s = readLoc();
    if (!s) return;
    var label = (s.city || "").trim();
    if (label && !/^saved location$/i.test(label) && !/^near you$/i.test(label)) {
      setCity(label);
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
      setTimeout(function () { patchOwnerCity(); applySaved(); reassertCity(); }, 1200);
      setTimeout(reassertCity, 3500);
      setInterval(reassertCity, 8000);
    }
    setInterval(reassertCity, 10000);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(wire, 300); });
  else setTimeout(wire, 300);
})(window, document);
