/**
 * clarity-banner-revamp-v1.js · 20261026BANNER4
 * 24 masnūn / Qurʾānic duʿā collection · moon on calendar · Allah seal on Ṣalāh
 * Educational only — not a fatwa. Campus untouched.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_BANNER_REVAMP_V4__) return;
  g.__CLARITY_BANNER_REVAMP_V4__ = true;

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
    var ar = $("rabbana-arabic");
    var en = $("rabbana-english");
    var ref = $("rabbana-ref");
    var cnt = $("rabbana-count");
    if (ar) ar.textContent = d.ar;
    if (en) en.textContent = d.en;
    if (ref) ref.textContent = d.ref;
    if (cnt) cnt.textContent = ((rabbanaIdx % RABBANA.length) + 1) + " / " + RABBANA.length;
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
        var place = (sel && sel.value) || "madinah";
        iframe.src = LIVE[place] || LIVE.madinah;
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
  if (typeof g.claritySurpriseSurahReciter !== "function") {
    g.claritySurpriseSurahReciter = function () {
      try { g.open("https://quran.com", "_blank", "noopener"); } catch (e) {}
    };
  }

  /** Moon phase fraction 0–1 */
  function moonPhase(date) {
    var d = date || new Date();
    var lp = 2551443; /* synodic month seconds approx */
    var new_moon = Date.UTC(2001, 8, 12, 13, 3, 0) / 1000;
    var now = d.getTime() / 1000;
    var phase = ((now - new_moon) % lp) / lp;
    if (phase < 0) phase += 1;
    return phase;
  }
  function moonLabel(p) {
    if (p < 0.03 || p > 0.97) return "New moon";
    if (p < 0.22) return "Waxing crescent";
    if (p < 0.28) return "First quarter";
    if (p < 0.47) return "Waxing gibbous";
    if (p < 0.53) return "Full moon";
    if (p < 0.72) return "Waning gibbous";
    if (p < 0.78) return "Last quarter";
    return "Waning crescent";
  }
  function moonEmoji(p) {
    if (p < 0.03 || p > 0.97) return "🌑";
    if (p < 0.22) return "🌒";
    if (p < 0.28) return "🌓";
    if (p < 0.47) return "🌔";
    if (p < 0.53) return "🌕";
    if (p < 0.72) return "🌖";
    if (p < 0.78) return "🌗";
    return "🌘";
  }

  /** Place moon plaque on calendar; Allah seal on Ṣalāh */
  function arrangePlaqueSeals() {
    var cal = document.querySelector(".hijri-cal-section");
    var salah = document.querySelector(".salah-times-section");
    if (!cal || !salah) return;

    /* Remove misplaced seals */
    var allah = cal.querySelector(".allah-circular-seal") || salah.querySelector(".allah-circular-seal");
    var masjid = cal.querySelector(".masjid-circular-seal") || salah.querySelector(".masjid-circular-seal");
    var moon = document.getElementById("clarity-banner-moon-plaque");

    if (!moon) {
      moon = document.createElement("div");
      moon.id = "clarity-banner-moon-plaque";
      moon.className = "banner-moon-plaque";
      moon.setAttribute("title", "Moon phase · educational");
    }
    var p = moonPhase();
    moon.innerHTML =
      '<span class="moon-emoji" aria-hidden="true">' +
      moonEmoji(p) +
      "</span>";
    moon.setAttribute("aria-label", moonLabel(p));
    moon.title = moonLabel(p);

    /* Moon on top of calendar */
    if (moon.parentNode !== cal || cal.firstElementChild !== moon) {
      cal.insertBefore(moon, cal.firstChild);
    }
    /* Hide old moon widgets inside cal if any from moon script */
    cal.querySelectorAll(".banner-moon, .moon-phase-widget").forEach(function (el) {
      if (el.id !== "clarity-banner-moon-plaque") el.style.display = "none";
    });

    /* Allah SWT seal on top of Salah */
    if (!allah) {
      allah = document.createElement("div");
      allah.className = "allah-circular-seal";
      allah.title = "Allah";
      allah.innerHTML = '<span class="arabic seal-ar">الله</span>';
    }
    if (allah.parentNode !== salah || salah.firstElementChild !== allah) {
      salah.insertBefore(allah, salah.firstChild);
    }
    /* Hide masjid seal on salah or move away — prefer Allah only on top */
    if (masjid && masjid.parentNode === salah) {
      masjid.style.display = "none";
    }
    /* Remove Allah from calendar if still there */
    cal.querySelectorAll(".allah-circular-seal").forEach(function (el) {
      if (el.parentNode === cal) el.style.display = "none";
    });
  }

  function hijriApprox(d) {
    d = d || new Date();
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
    return { day: day, month: months[(m - 1 + 12) % 12], year: year };
  }

  function ensureCalendar() {
    var grid = $("hijri-cal-grid");
    var title = $("hijri-cal-title");
    var meta = $("hijri-cal-meta");
    var h = hijriApprox();
    if (title) title.textContent = h.month + " " + h.year + " AH";
    if (meta) {
      meta.textContent =
        "Today · " + h.day + " " + h.month + " · " +
        new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    }
    if (grid && grid.children.length < 7) {
      grid.innerHTML = "";
      ["S","M","T","W","T","F","S"].forEach(function (l) {
        var s = document.createElement("div");
        s.className = "hc-day hc-lab";
        s.textContent = l;
        s.style.opacity = "0.55";
        grid.appendChild(s);
      });
      for (var d = 1; d <= 30; d++) {
        var el = document.createElement("div");
        el.className = "hc-day" + (d === h.day ? " is-today" : "");
        el.textContent = String(d);
        grid.appendChild(el);
      }
    }
  }

  function ensureClock() {
    var el = $("hijri-local-time");
    var loc = $("hijri-local-loc");
    function tick() {
      try {
        if (el)
          el.textContent = new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
        if (loc && (!loc.textContent || loc.textContent.indexOf("…") >= 0 || loc.textContent === "—"))
          loc.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone || "Local";
      } catch (e) {}
    }
    tick();
    if (!g.__clarityBannerClock) g.__clarityBannerClock = setInterval(tick, 30000);
  }

  function dedupeAudio() {
    var dup = $("quran-audio-dup1");
    if (dup) {
      try { dup.pause(); } catch (e) {}
      dup.removeAttribute("src");
      dup.setAttribute("aria-hidden", "true");
    }
  }

  
  function silenceMoonWording() {
    try {
      document.querySelectorAll(
        ".banner-moon-plaque .moon-lab, #clarity-banner-moon-plaque .moon-lab, .hijri-cal-section .moon-lab"
      ).forEach(function (el) { el.style.display = "none"; el.textContent = ""; });
      /* Hide secondary moon widgets + their captions under the top graphic */
      document.querySelectorAll(".hijri-cal-section .banner-moon, .hijri-cal-section .moon-phase-widget, .hijri-cal-section .moon-caption, .hijri-cal-section .moon-name").forEach(function (el) {
        if (el.id === "clarity-banner-moon-plaque") return;
        el.style.display = "none";
      });
      /* Top moon graphic from moon-v1: keep glyph, strip text nodes labeled phase */
      document.querySelectorAll(".hijri-cal-section [class*='moon']").forEach(function (el) {
        if (el.id === "clarity-banner-moon-plaque") return;
        var t = (el.textContent || "").replace(/\s+/g, " ").trim();
        if (/waning|waxing|gibbous|crescent|full moon|new moon|quarter/i.test(t) && el.children.length === 0) {
          el.style.display = "none";
        }
      });
      /* Specific: hide text-only phase labels */
      document.querySelectorAll(".hijri-cal-section").forEach(function (sec) {
        sec.querySelectorAll("div, span, p").forEach(function (el) {
          if (el.closest("#clarity-banner-moon-plaque")) return;
          if (el.closest(".hijri-cal-grid")) return;
          if (el.id && /hijri|temp|cal-title|meta|event/.test(el.id)) return;
          var t = (el.textContent || "").replace(/\s+/g, " ").trim();
          if (/^(Waning|Waxing|Full|New|Last|First).{0,20}$/i.test(t) || /^WANING|^WAXING|^FULL MOON/i.test(t)) {
            el.style.display = "none";
          }
        });
      });
    } catch (e) {}
  }

  
  function highlightNextSalah() {
    var list = document.getElementById("salah-times-list");
    if (!list) return;
    var items = list.querySelectorAll("li");
    if (!items.length) return;
    var now = new Date();
    var mins = now.getHours() * 60 + now.getMinutes();
    var best = null;
    var bestDelta = 1e9;
    items.forEach(function (li) {
      li.classList.remove("is-next", "is-past");
      var tEl = li.querySelector(".salah-time, .time, span:last-child");
      if (!tEl) return;
      var raw = (tEl.textContent || "").trim();
      var m = raw.match(/(\d{1,2}):(\d{2})/);
      if (!m) return;
      var hm = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
      /* crude 24h; if all times look AM/PM site already set */
      var delta = hm - mins;
      if (delta < -30) delta += 24 * 60;
      if (delta >= 0 && delta < bestDelta) {
        bestDelta = delta;
        best = li;
      }
    });
    if (!best && items.length) {
      /* fallback first future-looking or first item */
      best = items[0];
    }
    if (best) best.classList.add("is-next");
  }

  function enrichSolarMeta() {
    var meta = document.getElementById("hijri-cal-meta");
    if (!meta) return;
    try {
      var d = new Date();
      var solar = d.toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric"
      });
      var existing = (meta.textContent || "").trim();
      /* Keep hijri today line; append solar if not present */
      if (existing.indexOf(String(d.getFullYear())) < 0) {
        meta.innerHTML =
          (existing && existing.indexOf("…") < 0 ? existing + "<br>" : "") +
          '<span class="solar-date">' + solar + "</span>";
      }
    } catch (e) {}
  }

  function boot() {
    try {
      var saved = parseInt(localStorage.getItem("clarity_rabbana_idx_v1") || "0", 10);
      if (!isNaN(saved)) rabbanaIdx = saved % RABBANA.length;
    } catch (e) {}
    paintRabbana();
    arrangePlaqueSeals();
    silenceMoonWording();
    ensureCalendar();
    ensureClock();
    highlightNextSalah();
    enrichSolarMeta();
    dedupeAudio();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("load", function () { setTimeout(boot, 250); });
  setTimeout(boot, 800);

  g.ClarityBannerRevamp = {
    rabbanaCount: RABBANA.length,
    paintRabbana: paintRabbana,
    arrangePlaqueSeals: arrangePlaqueSeals
  };
})(typeof window !== "undefined" ? window : this);


/* companion-banner-moon-clean-v1 · 20261026BANNER4 */
(function(){
  if (window.__CLARITY_BANNER_MOON_CLEAN_V1__) return;
  window.__CLARITY_BANNER_MOON_CLEAN_V1__ = true;
  function clean(){
    var sec = document.querySelector(".hijri-cal-section");
    if (!sec) return;
    /* Hide our secondary plaque entirely */
    var p = document.getElementById("clarity-banner-moon-plaque");
    if (p) p.style.display = "none";
    /* Walk text-only phase labels */
    sec.querySelectorAll("div, span, p, strong").forEach(function(el){
      if (el.closest(".hijri-cal-grid")) return;
      if (el.id && /hijri|temp|title|meta|event|cal-/.test(el.id)) return;
      var t = (el.textContent||"").replace(/\s+/g," ").trim();
      if (!t) return;
      if (/^(WANING|WAXING|FULL|NEW|LAST|FIRST)/i.test(t) || /^(Waning|Waxing) (gibbous|crescent)$/i.test(t) || /^Full moon$/i.test(t) || /^New moon$/i.test(t)) {
        /* if element is ONLY the label text, hide it */
        if (el.children.length === 0 || (el.children.length === 1 && /emoji|icon|moon/i.test(el.children[0].className||""))) {
          el.style.setProperty("display","none","important");
        } else if (el.children.length && t.length < 28) {
          /* parent that only holds phase word */
          var onlyText = true;
          for (var i=0;i<el.childNodes.length;i++) {
            var n = el.childNodes[i];
            if (n.nodeType === 3 && n.textContent.trim()) { onlyText = true; }
          }
          el.childNodes.forEach && null;
          Array.prototype.forEach.call(el.childNodes, function(n){
            if (n.nodeType === 3 && /waning|waxing|gibbous|crescent|full moon|new moon/i.test(n.textContent)) {
              n.textContent = "";
            }
          });
        }
      }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(clean, 100); setTimeout(clean, 600); });
  else { setTimeout(clean, 100); setTimeout(clean, 600); }
  window.addEventListener("load", function(){ setTimeout(clean, 300); });
})();
