/*! companion-meme-section-packs-v1 · Phase 5 · section pills → verse/hadith fields · educational only — not a fatwa */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_SECTION_PACKS_V1__) return;
  w.__COMPANION_MEME_SECTION_PACKS_V1__ = true;

  /**
   * Packs aligned to Companion tabs / learning doors.
   * Each entry: ar, en, ref. Verify with Qur'an & Sunnah; not a fatwa.
   */
  var PACKS = {
    daily: [
      {
        ar: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        en: "All praise is for Allah, Lord of the worlds.",
        ref: "Qur'an 1:2"
      },
      {
        ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
        en: "Indeed, with hardship comes ease.",
        ref: "Qur'an 94:6"
      },
      {
        ar: "وَاذْكُرُوا اللَّهَ كَثِيرًا لَعَلَّكُمْ تُفْلِحُونَ",
        en: "And remember Allah much that you may succeed.",
        ref: "Qur'an 62:10"
      }
    ],
    reminder: [
      {
        ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
        en: "Unquestionably, by the remembrance of Allah hearts are assured.",
        ref: "Qur'an 13:28"
      },
      {
        ar: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        en: "Glory be to Allah and His is the praise.",
        ref: "Bukhari & Muslim — educational wording"
      },
      {
        ar: "فَاذْكُرُونِي أَذْكُرْكُمْ",
        en: "So remember Me; I will remember you.",
        ref: "Qur'an 2:152"
      }
    ],
    reality: [
      {
        ar: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ",
        en: "Every soul will taste death.",
        ref: "Qur'an 3:185"
      },
      {
        ar: "وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا مَتَاعُ الْغُرُورِ",
        en: "And the life of this world is only the enjoyment of delusion.",
        ref: "Qur'an 3:185"
      },
      {
        ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ",
        en: "O you who have believed, fear Allah.",
        ref: "Qur'an 59:18"
      }
    ],
    reflection: [
      {
        ar: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ",
        en: "O Turner of hearts, make my heart firm upon Your religion.",
        ref: "Tirmidhi — educational"
      },
      {
        ar: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا",
        en: "Our Lord, let not our hearts deviate after You have guided us.",
        ref: "Qur'an 3:8"
      },
      {
        ar: "وَتُوبُوا إِلَى اللَّهِ جَمِيعًا",
        en: "And turn to Allah in repentance, all of you.",
        ref: "Qur'an 24:31"
      }
    ],
    action: [
      {
        ar: "وَقُلِ اعْمَلُوا فَسَيَرَى اللَّهُ عَمَلَكُمْ",
        en: "And say: Work, for Allah will see your deeds.",
        ref: "Qur'an 9:105"
      },
      {
        ar: "فَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ",
        en: "So whoever does an atom's weight of good will see it.",
        ref: "Qur'an 99:7"
      },
      {
        ar: "وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ",
        en: "And cooperate in righteousness and piety.",
        ref: "Qur'an 5:2"
      }
    ],
    night: [
      {
        ar: "وَمِنَ اللَّيْلِ فَتَهَجَّدْ بِهِ نَافِلَةً لَكَ",
        en: "And from [part of] the night, pray with it as additional for you.",
        ref: "Qur'an 17:79"
      },
      {
        ar: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا",
        en: "O Allah, by You we enter the evening and by You we enter the morning.",
        ref: "Abu Dawud — educational wording"
      },
      {
        ar: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        en: "I seek refuge in the perfect words of Allah from the evil of what He created.",
        ref: "Muslim — educational wording"
      }
    ]
  };

  var cursor = {};

  function pick(name) {
    var list = PACKS[name] || PACKS.daily;
    var i = cursor[name] || 0;
    var item = list[i % list.length];
    cursor[name] = i + 1;
    return item;
  }

  function fields() {
    return {
      top: d.getElementById("meme-top"),
      mid: d.getElementById("meme-mid")
    };
  }

  function applyPack(name) {
    var item = pick(name);
    var f = fields();
    if (f.top) {
      f.top.value = item.ar;
      f.top.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (f.mid) {
      f.mid.value = item.en + (item.ref ? "\n" + item.ref : "");
      f.mid.dispatchEvent(new Event("input", { bubbles: true }));
    }
    var st = d.getElementById("meme-status") || d.getElementById("meme-fetch-status");
    if (st) {
      st.textContent = "Pack · " + name + " · " + (item.ref || "") + " · educational only — not a fatwa";
    }
    // Ask owner to repaint if present
    try {
      if (w.ClarityMemeOwner && typeof w.ClarityMemeOwner.paint === "function") {
        w.ClarityMemeOwner.paint();
      } else if (w.CompanionMeme && typeof w.CompanionMeme.paint === "function") {
        w.CompanionMeme.paint();
      } else {
        var canvas = d.getElementById("meme-canvas");
        if (canvas) canvas.dispatchEvent(new Event("meme-pack-applied"));
      }
    } catch (e) {}
    return item;
  }

  function boot() {
    d.addEventListener(
      "click",
      function (ev) {
        var btn = ev.target && ev.target.closest && ev.target.closest("[data-meme-pack]");
        if (!btn) return;
        var name = (btn.getAttribute("data-meme-pack") || "").toLowerCase().trim();
        if (!name || !PACKS[name]) return;
        ev.preventDefault();
        applyPack(name);
        // active chip
        d.querySelectorAll("[data-meme-pack]").forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
        });
      },
      true
    );
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();

  w.ClarityMemeSectionPacks = {
    version: "P5",
    packs: PACKS,
    apply: applyPack
  };
})(window, document);
