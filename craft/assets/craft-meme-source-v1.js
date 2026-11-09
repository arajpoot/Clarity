/*! craft-meme-source-v1 · Self-contained RRRA section packs for Craft Meme
 * Local packs + optional live Companion bridge. No free-type scripture.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_SOURCE_V1__) return;
  w.__CRAFT_MEME_SOURCE_V1__ = true;

  /* Section packs aligned to Companion RRRA hubs */
  var SECTIONS = {
    reminder: {
      label: "Reminder",
      sub: "Qur’an · commands · Names",
      lines: [
        { ar: "فَاذْكُرُونِي أَذْكُرْكُمْ", en: "So remember Me; I will remember you.", ref: "Qur’an 2:152" },
        { ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", en: "Verily, in the remembrance of Allah do hearts find rest.", ref: "Qur’an 13:28" },
        { ar: "وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنفَعُ الْمُؤْمِنِينَ", en: "And remind, for reminder benefits the believers.", ref: "Qur’an 51:55" },
        { ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ", en: "O you who believe, fear Allah.", ref: "Qur’an 59:18" },
        { ar: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ", en: "Every soul will taste death.", ref: "Qur’an 3:185" }
      ]
    },
    reality: {
      label: "Reality",
      sub: "World · self · accountability",
      lines: [
        { ar: "وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا مَتَاعُ الْغُرُورِ", en: "And the life of this world is only the enjoyment of deception.", ref: "Qur’an 3:185" },
        { ar: "أَفَحَسِبْتُمْ أَنَّمَا خَلَقْنَاكُمْ عَبَثًا", en: "Did you think that We created you uselessly?", ref: "Qur’an 23:115" },
        { ar: "كُلُّ مَنْ عَلَيْهَا فَانٍ", en: "Everyone upon it [the earth] will perish.", ref: "Qur’an 55:26" },
        {
          ar: "",
          en: "When a person dies, his deeds come to an end except three: ongoing charity, beneficial knowledge, or a righteous child who prays for him.",
          ref: "Muslim"
        }
      ]
    },
    reflection: {
      label: "Reflection",
      sub: "Heart · tawbah · night",
      lines: [
        { ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", en: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.", ref: "Qur’an 2:201" },
        { ar: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي", en: "My Lord, expand for me my breast and ease for me my task.", ref: "Qur’an 20:25–26" },
        { ar: "وَمِنَ اللَّيْلِ فَتَهَجَّدْ بِهِ نَافِلَةً لَّكَ", en: "And from [part of] the night, pray with it as additional [worship] for you.", ref: "Qur’an 17:79" },
        { ar: "إِنَّ نَاشِئَةَ اللَّيْلِ هِيَ أَشَدُّ وَطْئًا وَأَقْوَمُ قِيلًا", en: "Indeed, the hours of the night are more effective for concurrence and more suitable for words.", ref: "Qur’an 73:6" }
      ]
    },
    action: {
      label: "Action",
      sub: "Deed · dawah · consistency",
      lines: [
        { ar: "وَالْعَصْرِ · إِنَّ الْإِنسَانَ لَفِي خُسْرٍ", en: "By time — mankind is in loss…", ref: "Qur’an 103:1–2" },
        {
          ar: "",
          en: "The most beloved of deeds to Allah are those done consistently, even if they are small.",
          ref: "Bukhari & Muslim"
        },
        { ar: "ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ", en: "Invite to the way of your Lord with wisdom and good instruction.", ref: "Qur’an 16:125" },
        {
          ar: "",
          en: "Convey from me, even if it is one verse.",
          ref: "Bukhari"
        }
      ]
    }
  };

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function formatLine(line) {
    var parts = [];
    if (line.ar) parts.push(line.ar);
    if (line.en) parts.push(line.en);
    if (line.ref) parts.push("(" + line.ref + ")");
    parts.push("— clarity-dawah.fyi · educational only");
    return parts.join("\n");
  }

  function fetchSection(sectionId) {
    var sec = SECTIONS[sectionId] || SECTIONS.reminder;
    var line = pick(sec.lines);
    /* C19MEME3 self-contained: local SECTIONS packs only (no Companion bridge) */
    return {
      section: sectionId,
      label: sec.label,
      line: line,
      text: formatLine(line)
    };
  }

  function applyToDesks(text) {
    var x = d.getElementById("x-draft");
    var fb = d.getElementById("fb-draft");
    if (x) {
      x.value = text.slice(0, 280);
      x.dispatchEvent(new Event("input"));
    }
    if (fb) {
      fb.value = text;
      fb.dispatchEvent(new Event("input"));
    }
    var card = d.getElementById("craft-verse-card");
    if (card) {
      card.textContent = text;
      card.hidden = false;
    }
    var st = d.getElementById("meme-source-status");
    if (st) st.textContent = "Source loaded · educational only";
  }

  function bindChips() {
    d.querySelectorAll("[data-meme-section]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        d.querySelectorAll("[data-meme-section]").forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        var id = btn.getAttribute("data-meme-section");
        var result = fetchSection(id);
        applyToDesks(result.text);
        if (w.ClarityCraftRegistry) {
          w.ClarityCraftRegistry.runUpgrade("meme", { section: id, line: result.line });
        }
      });
    });
    var refresh = d.getElementById("meme-refresh-source");
    if (refresh) {
      refresh.addEventListener("click", function () {
        var active = d.querySelector("[data-meme-section].active");
        var id = active ? active.getAttribute("data-meme-section") : "reminder";
        var _r = fetchSection(id); applyToDesks(_r.text);
          try {
            if (typeof w.memeDraw === "function") w.memeDraw();
            else if (typeof w.craftMemePaintStandard === "function") w.craftMemePaintStandard({});
          } catch (_e) {}
      });
    }
  }

  w.CraftMemeSource = {
    sections: SECTIONS,
    fetchSection: fetchSection,
    formatLine: formatLine,
    applyToDesks: applyToDesks
  };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", bindChips);
  else bindChips();
})(window, document);
