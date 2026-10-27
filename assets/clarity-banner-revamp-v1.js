/**
 * clarity-banner-revamp-v1.js · 20261026NIGHT2
 * Restore moon (#clarity-moon-phase) · fix Ṣalāh list · 24 duʿās · no lower duplicate moon
 * Educational only — not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_BANNER_REVAMP_V7__) return;
  g.__CLARITY_BANNER_REVAMP_V7__ = true;

  var STILLS = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/640px-Kaaba_Masjid_Haraam_Makkah.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madinah.jpg/640px-Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madinah.jpg"
  ];
  var LIVE = {
    madinah: "https://www.youtube.com/embed/live_stream?channel=UCXVxMUGmA5XDzl1Jur5tbwA&autoplay=1&mute=1",
    makkah: "https://www.youtube.com/embed/live_stream?channel=UCqL_GKMzFr-ONIRYduUsA9w&autoplay=1&mute=1"
  };

  var RABBANA = [
    { ar: "رَبَّنَا تَقَبَّلْ مِنَّا ۖ إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ", en: "Our Lord, accept [this] from us. Indeed You are the Hearing, the Knowing.", ref: "Quran 2:127" },
    { ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", en: "Our Lord, give us good in this world and the Hereafter, and protect us from the Fire.", ref: "Quran 2:201" },
    { ar: "رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا", en: "Our Lord, do not impose blame upon us if we forget or make a mistake.", ref: "Quran 2:286" },
    { ar: "رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا", en: "Our Lord, do not lay upon us a burden like that you laid upon those before us.", ref: "Quran 2:286" },
    { ar: "رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ", en: "Our Lord, do not burden us with that which we have no ability to bear.", ref: "Quran 2:286" },
    { ar: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَتَوَفَّنَا مُسْلِمِينَ", en: "Our Lord, pour upon us patience and let us die as Muslims.", ref: "Quran 7:126" },
    { ar: "رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ", en: "Our Lord, we have wronged ourselves; if You do not forgive us and have mercy, we will be among the losers.", ref: "Quran 7:23" },
    { ar: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً", en: "Our Lord, do not let our hearts deviate after You have guided us; grant us mercy from Yourself.", ref: "Quran 3:8" },
    { ar: "رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا", en: "Our Lord, forgive our sins and our excesses, and plant firmly our feet.", ref: "Quran 3:147" },
    { ar: "رَبَّنَا آمَنَّا فَاغْفِرْ لَنَا وَارْحَمْنَا وَأَنتَ خَيْرُ الرَّاحِمِينَ", en: "Our Lord, we have believed, so forgive us and have mercy upon us; You are the best of the merciful.", ref: "Quran 23:109" },
    { ar: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا", en: "Our Lord, grant us from our spouses and offspring comfort to our eyes, and make us leaders for the righteous.", ref: "Quran 25:74" },
    { ar: "رَبَّنَا اصْرِفْ عَنَّا عَذَابَ جَهَنَّمَ ۖ إِنَّ عَذَابَهَا كَانَ غَرَامًا", en: "Our Lord, avert from us the punishment of Hell; its punishment is ever adhering.", ref: "Quran 25:65" },
    { ar: "رَبَّنَا أَتْمِمْ لَنَا نُورَنَا وَاغْفِرْ لَنَا ۖ إِنَّكَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", en: "Our Lord, perfect for us our light and forgive us; indeed You are over all things competent.", ref: "Quran 66:8" },
    { ar: "رَبَّنَا آمَنَّا بِمَا أَنزَلْتَ وَاتَّبَعْنَا الرَّسُولَ فَاكْتُبْنَا مَعَ الشَّاهِدِينَ", en: "Our Lord, we have believed in what You revealed and followed the Messenger, so register us among the witnesses.", ref: "Quran 3:53" },
    { ar: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي", en: "My Lord, expand for me my breast and ease for me my task.", ref: "Quran 20:25–26" },
    { ar: "رَبِّ زِدْنِي عِلْمًا", en: "My Lord, increase me in knowledge.", ref: "Quran 20:114" },
    { ar: "رَبِّ اغْفِرْ وَارْحَمْ وَأَنتَ خَيْرُ الرَّاحِمِينَ", en: "My Lord, forgive and have mercy; You are the best of the merciful.", ref: "Quran 23:118" },
    { ar: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ", en: "My Lord, enable me to be grateful for Your favor which You have bestowed upon me.", ref: "Quran 27:19" },
    { ar: "رَبَّنَا تَقَبَّلْ دُعَاءِ", en: "Our Lord, accept my supplication.", ref: "Quran 14:40" },
    { ar: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي", en: "My Lord, make me an establisher of prayer, and [many] from my descendants.", ref: "Quran 14:40" },
    { ar: "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ", en: "Our Lord, forgive me and my parents and the believers the Day the account is established.", ref: "Quran 14:41" },
    { ar: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", en: "Allah is sufficient for us, and He is the best Disposer of affairs.", ref: "Quran 3:173" },
    { ar: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ", en: "O Allah, You are my Lord; there is no deity except You. You created me and I am Your servant.", ref: "Sayyid al-Istighfār (educational)" },
    { ar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى", en: "O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.", ref: "Muslim (educational wording)" }
  ];
  var rabbanaIdx = 0;

  function $(id) { return document.getElementById(id); }

  function paintRabbana() {
    var d = RABBANA[rabbanaIdx % RABBANA.length];
    if ($("rabbana-arabic")) $("rabbana-arabic").textContent = d.ar;
    if ($("rabbana-english")) $("rabbana-english").textContent = d.en;
    if ($("rabbana-ref")) $("rabbana-ref").textContent = d.ref;
    if ($("rabbana-count")) $("rabbana-count").textContent = (rabbanaIdx % RABBANA.length) + 1 + " / " + RABBANA.length;
  }
  g.cycleRabbana = function (dir) {
    rabbanaIdx = (rabbanaIdx + (dir || 1) + RABBANA.length * 20) % RABBANA.length;
    try { localStorage.setItem("clarity_rabbana_idx_v1", String(rabbanaIdx)); } catch (e) {}
    paintRabbana();
  };

  if (typeof g.setVolume !== "function") {
    g.setVolume = function (v) {
      var a = $("quran-audio");
      if (a) a.volume = Math.max(0, Math.min(1, parseFloat(v) || 0.85));
    };
  }
  if (typeof g.toggleMute !== "function") {
    g.toggleMute = function () {
      var a = $("quran-audio");
      var btn = $("mute-btn");
      if (!a) return;
      a.muted = !a.muted;
      if (btn) btn.textContent = a.muted ? "🔇" : "🔊";
    };
  }
  if (typeof g.changeHaramainPlace !== "function") {
    g.changeHaramainPlace = function () {
      var sel = $("live-place-select");
      var place = (sel && sel.value) || "madinah";
      var iframe = $("banner-live");
      var img = $("banner-img");
      if (iframe && !iframe.hidden) iframe.src = LIVE[place] || LIVE.madinah;
      if (img) img.src = place === "makkah" ? STILLS[0] : STILLS[1];
    };
  }
  if (typeof g.toggleHaramainLive !== "function") {
    g.toggleHaramainLive = function () {
      var iframe = $("banner-live");
      var img = $("banner-img");
      var btn = $("live-haramain-btn");
      var sel = $("live-place-select");
      if (!iframe) return;
      if (iframe.hidden) {
        iframe.src = LIVE[(sel && sel.value) || "madinah"] || LIVE.madinah;
        iframe.hidden = false;
        if (img) img.style.opacity = "0";
        if (btn) btn.classList.add("is-live");
      } else {
        iframe.hidden = true;
        iframe.removeAttribute("src");
        if (img) img.style.opacity = "1";
        if (btn) btn.classList.remove("is-live");
      }
    };
  }
  if (typeof g.changeStream !== "function") {
    g.changeStream = function () {
      var sel = $("stream-select");
      var a = $("quran-audio");
      if (!sel || !a) return;
      var playing = !a.paused;
      a.src = sel.value;
      if (playing) a.play().catch(function () {});
    };
  }
  if (typeof g.toggleQuranStream !== "function") {
    g.toggleQuranStream = function () {
      var a = $("quran-audio");
      var sel = $("stream-select");
      var icon = $("stream-icon");
      var text = $("stream-text");
      if (!a) return;
      if (a.paused) {
        if (sel && sel.value) a.src = sel.value;
        a.play().catch(function () {});
        if (icon) icon.textContent = "⏸";
        if (text) text.textContent = "Pause";
      } else {
        a.pause();
        if (icon) icon.textContent = "▶";
        if (text) text.textContent = "Listen";
      }
    };
  }

  /** Remove ONLY our secondary moon plaque — never touch #clarity-moon-phase */
  function removeLowerMoon() {
    var bad = $("clarity-banner-moon-plaque");
    if (bad && bad.parentNode) bad.parentNode.removeChild(bad);
    document.querySelectorAll(".banner-moon-plaque").forEach(function (el) {
      if (el.id === "clarity-moon-phase" || el.closest("#clarity-moon-phase")) return;
      if (el.parentNode) el.parentNode.removeChild(el);
    });
  }

  /** Ensure Allah seal on Ṣalāh top */
  function ensureAllahOnSalah() {
    var salah = document.querySelector(".salah-times-section");
    if (!salah) return;
    var allah = salah.querySelector(".allah-circular-seal");
    if (!allah) {
      allah = document.createElement("div");
      allah.className = "allah-circular-seal";
      allah.title = "Allah";
      allah.innerHTML = '<span class="arabic seal-ar">الله</span>';
    }
    if (salah.firstElementChild !== allah) salah.insertBefore(allah, salah.firstChild);
  }

  /** Force show official moon widget */
  function restoreMoon() {
    var moon = $("clarity-moon-phase");
    var disc = $("clarity-moon-disc");
    if (moon) {
      moon.style.setProperty("display", "flex", "important");
      moon.style.setProperty("visibility", "visible", "important");
      moon.style.setProperty("opacity", "1", "important");
    }
    if (disc) {
      disc.style.setProperty("display", "block", "important");
      disc.style.setProperty("visibility", "visible", "important");
    }
    var lab = $("clarity-moon-label");
    if (lab) {
      lab.style.setProperty("display", "block", "important");
      lab.style.setProperty("visibility", "visible", "important");
    }
  }

  function highlightNextSalah() {
    var list = $("salah-times-list");
    if (!list) return;
    var items = list.querySelectorAll("li");
    if (!items.length) return;
    var now = new Date();
    var mins = now.getHours() * 60 + now.getMinutes();
    var best = null;
    var bestDelta = 1e9;
    items.forEach(function (li) {
      li.classList.remove("is-next");
      var tEl = li.querySelector(".salah-time, span:last-child");
      if (!tEl) return;
      var m = (tEl.textContent || "").match(/(\d{1,2}):(\d{2})/);
      if (!m) return;
      var hm = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
      var delta = hm - mins;
      if (delta < -20) delta += 24 * 60;
      if (delta >= 0 && delta < bestDelta) {
        bestDelta = delta;
        best = li;
      }
    });
    if (best) best.classList.add("is-next");
  }

  function fillSalahList(timings, locLabel) {
    var list = $("salah-times-list");
    if (!list) return;
    var order = [
      ["Fajr", timings.Fajr],
      ["Sunrise", timings.Sunrise],
      ["Dhuhr", timings.Dhuhr],
      ["Asr", timings.Asr],
      ["Maghrib", timings.Maghrib],
      ["Isha", timings.Isha]
    ];
    list.innerHTML = "";
    order.forEach(function (pair) {
      if (!pair[1]) return;
      var li = document.createElement("li");
      li.innerHTML =
        '<span class="salah-name">' +
        pair[0] +
        '</span><span class="salah-time">' +
        String(pair[1]).slice(0, 5) +
        "</span>";
      list.appendChild(li);
    });
    var title = $("salah-title");
    if (title && locLabel) title.textContent = "Ṣalāh · " + locLabel;
    highlightNextSalah();
  }

  function repairSalah() {
    var list = $("salah-times-list");
    if (!list) return;
    var txt = (list.textContent || "").toLowerCase();
    if (txt && !/loading|…|\.\.\./.test(txt) && /\d{1,2}:\d{2}/.test(txt)) {
      highlightNextSalah();
      return;
    }
    var city = "Edmonton";
    var country = "Canada";
    try {
      var s = localStorage.getItem("clarity_salah_city");
      if (s) city = s;
    } catch (e) {}
    var url =
      "https://api.aladhan.com/v1/timingsByCity?city=" +
      encodeURIComponent(city) +
      "&country=" +
      encodeURIComponent(country) +
      "&method=2";
    fetch(url, { credentials: "omit" })
      .then(function (r) {
        if (!r.ok) throw new Error("http");
        return r.json();
      })
      .then(function (json) {
        var t = (json.data && json.data.timings) || {};
        fillSalahList(t, city);
        var loc = $("hijri-local-loc");
        if (loc) loc.textContent = city + (country ? ", " + country : "");
      })
      .catch(function () {
        /* offline stub so UI is not stuck on Loading */
        if (/loading/i.test(list.textContent || "")) {
          list.innerHTML =
            '<li><span class="salah-name">Fajr</span><span class="salah-time">—</span></li>' +
            '<li><span class="salah-name">Dhuhr</span><span class="salah-time">—</span></li>' +
            '<li><span class="salah-name">Asr</span><span class="salah-time">—</span></li>' +
            '<li><span class="salah-name">Maghrib</span><span class="salah-time">—</span></li>' +
            '<li><span class="salah-name">Isha</span><span class="salah-time">—</span></li>';
        }
      });
  }

  function ensureClock() {
    var el = $("hijri-local-time");
    function tick() {
      try {
        if (el)
          el.textContent = new Date().toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit"
          });
      } catch (e) {}
    }
    tick();
    if (!g.__clarityBannerClock) g.__clarityBannerClock = setInterval(tick, 30000);
  }

  
  function formatHijriSolarLines() {
    var meta = document.getElementById("hijri-cal-meta");
    var title = document.getElementById("hijri-cal-title");
    if (!meta) return;
    try {
      var d = new Date();
      var jd = Math.floor((d.getTime() - Date.UTC(1970, 0, 1)) / 86400000) + 2440588;
      var l = jd - 1948439 + 10632;
      var n = Math.floor((l - 1) / 10631);
      l = l - 10631 * n + 354;
      var j =
        Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
        Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
      l =
        l -
        Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
        Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
        29;
      var m = Math.floor((24 * l) / 709);
      var day = l - Math.floor((709 * m) / 24);
      var year = 30 * n + j - 30;
      var months = [
        "Muḥarram","Ṣafar","Rabīʿ I","Rabīʿ II","Jumādā I","Jumādā II",
        "Rajab","Shaʿbān","Ramaḍān","Shawwāl","Dhū al-Qaʿdah","Dhū al-Ḥijjah"
      ];
      var month = months[(m - 1 + 12) % 12];
      var weekday = d.toLocaleDateString(undefined, { weekday: "short" });
      /* Hijri only — no solar year line */
      meta.textContent = "Today · " + day + " " + month + " · " + weekday + " · " + year + " AH";
      if (title) title.textContent = month + " " + year + " AH";
      /* Remove any leftover solar-date nodes */
      meta.querySelectorAll && meta.querySelectorAll(".solar-date").forEach(function (n) { n.remove(); });
    } catch (e) {}
  }

  
  function styleMoonPlaque() {
    var moon = document.getElementById("clarity-moon-phase");
    if (!moon) return;
    moon.classList.add("clarity-moon-card");
    moon.style.setProperty("display", "flex", "important");
    /* remove plain duplicate discs outside official widget */
    document.querySelectorAll(".hijri-cal-section > .banner-moon-plaque, #clarity-banner-moon-plaque").forEach(function (n) {
      if (n.id !== "clarity-moon-phase") n.remove();
    });
  }

  function boot() {
    try {
      var saved = parseInt(localStorage.getItem("clarity_rabbana_idx_v1") || "0", 10);
      if (!isNaN(saved)) rabbanaIdx = saved % RABBANA.length;
    } catch (e) {}
    paintRabbana();
    removeLowerMoon();
    restoreMoon();
    styleMoonPlaque();
    ensureAllahOnSalah();
    ensureClock();
    repairSalah();
    formatHijriSolarLines();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("load", function () {
    setTimeout(boot, 200);
    setTimeout(restoreMoon, 500);
    setTimeout(repairSalah, 600);
  });
  setTimeout(boot, 1000);

  g.ClarityBannerRevamp = { restoreMoon: restoreMoon, repairSalah: repairSalah, rabbanaCount: 24 };
})(typeof window !== "undefined" ? window : this);
