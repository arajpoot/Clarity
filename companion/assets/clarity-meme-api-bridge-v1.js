/*! clarity-meme-api-bridge-v1 · fill missing meme* globals · educational only */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_MEME_API_BRIDGE_V1__) return;
  w.__CLARITY_MEME_API_BRIDGE_V1__ = true;

  var LOG = (w.__MEME_API_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  function status(msg) {
    var el = d.getElementById("meme-rrra-status") || d.getElementById("meme-fetch-status");
    if (el) el.textContent = msg || "";
  }

  function pick(a) {
    return a[Math.floor(Math.random() * a.length)];
  }

  /* Local daily-style verses (offline safe) */
  var DAILY = [
    { ar: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ", en: "Every soul will taste death.", ref: "Qur'an 3:185" },
    { ar: "وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنفَعُ الْمُؤْمِنِينَ", en: "And remind, for reminder benefits the believers.", ref: "Qur'an 51:55" },
    { ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ", en: "O you who believe, fear Allah.", ref: "Qur'an 59:18" },
    { ar: "فَاذْكُرُونِي أَذْكُرْكُمْ", en: "So remember Me; I will remember you.", ref: "Qur'an 2:152" },
    { ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", en: "Verily, in the remembrance of Allah do hearts find rest.", ref: "Qur'an 13:28" }
  ];

  var NIGHT = [
    { ar: "وَمِنَ اللَّيْلِ فَتَهَجَّدْ بِهِ نَافِلَةً لَّكَ", en: "And from [part of] the night, pray with it as additional worship for you.", ref: "Qur'an 17:79" },
    { ar: "إِنَّ نَاشِئَةَ اللَّيْلِ هِيَ أَشَدُّ وَطْئًا وَأَقْوَمُ قِيلًا", en: "Indeed, the hours of the night are more effective for concurrence and more suitable for words.", ref: "Qur'an 73:6" }
  ];

  var MASNUN = [
    { ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", en: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.", ref: "Qur'an 2:201" },
    { ar: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي", en: "My Lord, expand for me my breast and ease for me my task.", ref: "Qur'an 20:25–26" }
  ];

  function applyLine(line, bg) {
    if (!line) return;
    var ar = line.ar || line.arabic || "";
    var en = line.en || line.english || "";
    var ref = line.ref || line.reference || "";
    try {
      if (typeof w.clarityMemeFill === "function") w.clarityMemeFill(ar, en, ref);
      else if (typeof w.clarityMemeSetCanvas === "function") w.clarityMemeSetCanvas(ar, en, "", ref);
      else if (typeof w.memeApplyVerseCard === "function") w.memeApplyVerseCard(ar, en, "", ref);
    } catch (e) { log("apply " + e); }
    if (bg && typeof w.memeFetchBg === "function") {
      try { w.memeFetchBg(bg); } catch (e2) {}
    }
    status((ref || "Verse") + " · applied");
  }

  if (typeof w.memeDailyVerse !== "function") {
    w.memeDailyVerse = function () {
      try {
        /* Prefer RRRA reminder pack if present */
        var pack = w.RRRA_PACKS && w.RRRA_PACKS.reminder;
        var line = null;
        if (pack && pack.verses && pack.verses.length) line = pick(pack.verses);
        if (!line) line = pick(DAILY);
        applyLine(line, "holy");
        log("dailyVerse");
      } catch (e) {
        log("dailyVerse err " + e);
      }
    };
  }

  if (typeof w.memeNightQuote !== "function") {
    w.memeNightQuote = function () {
      applyLine(pick(NIGHT), "night");
    };
  }

  if (typeof w.memeMasnunDua !== "function") {
    w.memeMasnunDua = function () {
      applyLine(pick(MASNUN), "spirit");
    };
  }

  if (typeof w.memeFetchUrduDua !== "function") {
    w.memeFetchUrduDua = function () {
      try {
        if (typeof w.memePickLocalUrduDua === "function") w.memePickLocalUrduDua();
        if (typeof w.memeApplyUrduDua === "function") w.memeApplyUrduDua(false);
        else applyLine(pick(MASNUN), "spirit");
        log("urduDua");
      } catch (e) {
        applyLine(pick(MASNUN), "spirit");
      }
    };
  }

  if (typeof w.memeFromJourney !== "function") {
    w.memeFromJourney = function () {
      try {
        if (typeof w.memeFetchRrra === "function") w.memeFetchRrra("action");
        else applyLine(pick(DAILY), "nature");
      } catch (e) {}
    };
  }

  if (typeof w.memeShowBlankPalette !== "function") {
    w.memeShowBlankPalette = function () {
      var p = d.getElementById("meme-palette");
      if (p) {
        p.hidden = !p.hidden;
      }
      if (typeof w.memeFetchBg === "function") {
        try { w.memeFetchBg("blank"); } catch (e) {}
      }
    };
  }

  if (typeof w.memeAutoScaleLines !== "function") {
    w.memeAutoScaleLines = function () {
      try {
        var s = w.memeState;
        if (s) {
          s.topSize = s.topSize || 34;
          s.midSize = s.midSize || 20;
          s.bottomSize = s.bottomSize || 16;
        }
        if (typeof w.clarityMemeUiSync === "function") w.clarityMemeUiSync();
        status("Auto-scale applied");
      } catch (e) {}
    };
  }

  function canvasToBlob(cb) {
    var c = d.getElementById("meme-canvas");
    if (!c || !c.toBlob) {
      cb(null);
      return;
    }
    try {
      c.toBlob(cb, "image/png");
    } catch (e) {
      cb(null);
    }
  }

  if (typeof w.memeDownload !== "function") {
    w.memeDownload = function () {
      canvasToBlob(function (blob) {
        if (!blob) {
          status("Canvas not ready");
          return;
        }
        var a = d.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "clarity-meme.png";
        d.body.appendChild(a);
        a.click();
        setTimeout(function () {
          URL.revokeObjectURL(a.href);
          a.remove();
        }, 500);
        status("PNG downloaded");
      });
    };
  }

  if (typeof w.memeCopyPng !== "function") {
    w.memeCopyPng = function () {
      canvasToBlob(function (blob) {
        if (!blob || !navigator.clipboard || !window.ClipboardItem) {
          status("Copy not supported — use Download");
          return;
        }
        navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]).then(
          function () { status("Copied PNG"); },
          function () { status("Copy failed — use Download"); }
        );
      });
    };
  }

  if (typeof w.memeSharePng !== "function") {
    w.memeSharePng = function () {
      canvasToBlob(function (blob) {
        if (!blob) return;
        var file = new File([blob], "clarity-meme.png", { type: "image/png" });
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], title: "Clarity meme" }).catch(function () {});
        } else if (typeof w.memeDownload === "function") {
          w.memeDownload();
        }
      });
    };
  }

  if (typeof w.memeSendToTweetDesk !== "function") {
    w.memeSendToTweetDesk = function () {
      status("Tweet desk · use Share or Copy");
      try {
        if (typeof w.memeSharePng === "function") w.memeSharePng();
      } catch (e) {}
    };
  }

  /* Safe no-op wrappers for any other meme* called before core loads */
  ["memeClear", "memeRedraw"].forEach(function (name) {
    if (typeof w[name] !== "function") {
      w[name] = function () { log("stub " + name); };
    }
  });

  log("bridge-ready");
})(window, document);
