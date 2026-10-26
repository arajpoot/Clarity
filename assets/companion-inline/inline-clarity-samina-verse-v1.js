/**
 * Daily Samiʿnā wa aṭaʿnā command-verses · educational only — not a fatwa
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_SAMINA_VERSE_V1__) return;
  w.__CLARITY_SAMINA_VERSE_V1__ = true;

  var KEY_IDX = "clarity_samina_verse_idx_v1";
  var PACK = [
    {
      ref: "Qurʾān 2:285",
      ar: "آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ",
      en: "The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers. All of them have believed in Allah and His angels and His books and His messengers, [saying], \"We make no distinction between any of His messengers.\" And they say, \"We hear and we obey. [Grant us] Your forgiveness, our Lord. And to You is the [final] destination.\"",
      note: "Classic samiʿnā wa aṭaʿnā — hear and obey.",
      href: "https://quran.com/2/285"
    },
    {
      ref: "Qurʾān 4:59",
      ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا أَطِيعُوا اللَّهَ وَأَطِيعُوا الرَّسُولَ وَأُولِي الْأَمْرِ مِنكُمْ ۖ فَإِن تَنَازَعْتُمْ فِي شَيْءٍ فَرُدُّوهُ إِلَى اللَّهِ وَالرَّسُولِ",
      en: "O you who have believed, obey Allah and obey the Messenger and those in authority among you. And if you disagree over anything, refer it to Allah and the Messenger…",
      note: "Obedience to Allah and His Messenger is the axis of the command.",
      href: "https://quran.com/4/59"
    },
    {
      ref: "Qurʾān 8:20",
      ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا أَطِيعُوا اللَّهَ وَرَسُولَهُ وَلَا تَوَلَّوْا عَنْهُ وَأَنتُمْ تَسْمَعُونَ",
      en: "O you who have believed, obey Allah and His Messenger and do not turn away from him while you hear [his order].",
      note: "Hearing without turning away.",
      href: "https://quran.com/8/20"
    },
    {
      ref: "Qurʾān 24:51",
      ar: "إِنَّمَا كَانَ قَوْلَ الْمُؤْمِنِينَ إِذَا دُعُوا إِلَى اللَّهِ وَرَسُولِهِ لِيَحْكُمَ بَيْنَهُمْ أَن يَقُولُوا سَمِعْنَا وَأَطَعْنَا ۚ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ",
      en: "The only statement of the [true] believers when they are called to Allah and His Messenger to judge between them is that they say, \"We hear and we obey.\" And those are the successful.",
      note: "Response of the believers when called to judgment.",
      href: "https://quran.com/24/51"
    },
    {
      ref: "Qurʾān 5:7",
      ar: "وَاذْكُرُوا نِعْمَةَ اللَّهِ عَلَيْكُمْ وَمِيثَاقَهُ الَّذِي وَاثَقَكُم بِهِ إِذْ قُلْتُمْ سَمِعْنَا وَأَطَعْنَا ۖ وَاتَّقُوا اللَّهَ ۚ إِنَّ اللَّهَ عَلِيمٌ بِذَاتِ الصُّدُورِ",
      en: "And remember the favor of Allah upon you and His covenant with which He bound you when you said, \"We hear and we obey\"; and fear Allah. Indeed, Allah is Knowing of that within the breasts.",
      note: "Covenant language of hear and obey.",
      href: "https://quran.com/5/7"
    },
    {
      ref: "Qurʾān 33:36",
      ar: "وَمَا كَانَ لِمُؤْمِنٍ وَلَا مُؤْمِنَةٍ إِذَا قَضَى اللَّهُ وَرَسُولُهُ أَمْرًا أَن يَكُونَ لَهُمُ الْخِيَرَةُ مِنْ أَمْرِهِمْ",
      en: "It is not for a believing man or a believing woman, when Allah and His Messenger have decided a matter, that they should [thereafter] have any choice about their affair…",
      note: "No personal preference against a clear decision of Allah and His Messenger.",
      href: "https://quran.com/33/36"
    }
  ];

  function idx() {
    try {
      var n = parseInt(localStorage.getItem(KEY_IDX) || "0", 10);
      if (isNaN(n) || n < 0) n = 0;
      return n % PACK.length;
    } catch (e) { return 0; }
  }
  function setIdx(n) {
    try { localStorage.setItem(KEY_IDX, String(n % PACK.length)); } catch (e) {}
  }

  function paint(i) {
    var v = PACK[i % PACK.length];
    if (!v) return;
    var ref = document.getElementById("samina-verse-ref");
    var ar = document.getElementById("samina-verse-ar");
    var en = document.getElementById("samina-verse-en");
    var note = document.getElementById("samina-verse-note");
    var link = document.getElementById("samina-verse-link");
    if (ref) ref.textContent = v.ref;
    if (ar) ar.textContent = v.ar;
    if (en) en.textContent = v.en;
    if (note) note.textContent = (v.note || "") + " · Educational translation · not a fatwa";
    if (link) { link.href = v.href; link.textContent = "Open on Quran.com"; }
  }

  function clarityDailySaminaVerse(advance) {
    var i = idx();
    if (advance) {
      i = (i + 1) % PACK.length;
      setIdx(i);
    }
    paint(i);
    return PACK[i];
  }

  w.clarityDailySaminaVerse = clarityDailySaminaVerse;

  function boot() {
    if (!document.getElementById("samina-verse-ar") && !document.getElementById("samina-verse-card")) return;
    // Always show first/current without requiring a click
    paint(idx());
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 200); });
  else setTimeout(boot, 200);
  w.addEventListener("load", function () { setTimeout(boot, 500); setTimeout(boot, 1500); });
  document.addEventListener("click", function (ev) {
    var t = ev.target && ev.target.closest && ev.target.closest("[data-rail-tab='reminder'], [data-tab='reminder']");
    if (t) setTimeout(boot, 100);
  }, true);
})(typeof window !== "undefined" ? window : this);
