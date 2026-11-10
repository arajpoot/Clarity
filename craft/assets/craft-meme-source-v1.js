/*! craft-meme-source-v1 · C19MEME21
 * RRRA section packs · dual chip attrs · layer push · persist · optional companion bridge
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_SOURCE_V1__) return;
  w.__CRAFT_MEME_SOURCE_V1__ = true;

  var STATE_KEY = "clarity.craft.meme.state.v1";

  var SECTIONS = {
    reminder: {
      label: "Reminder",
      sub: "Dhikr · hearts · Names",
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
        { ar: "وَاتَّقُوا يَوْمًا تُرْجَعُونَ فِيهِ إِلَى اللَّهِ", en: "And fear a Day when you will be returned to Allah.", ref: "Qur’an 2:281" },
        { ar: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ", en: "Indeed we belong to Allah, and indeed to Him we will return.", ref: "Qur’an 2:156" }
      ]
    },
    reflection: {
      label: "Reflection",
      sub: "Tafakkur · signs · gratitude",
      lines: [
        { ar: "إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ لَآيَاتٍ", en: "Indeed, in the creation of the heavens and the earth are signs.", ref: "Qur’an 3:190" },
        { ar: "وَفِي أَنفُسِكُمْ ۚ أَفَلَا تُبْصِرُونَ", en: "And in yourselves. Then will you not see?", ref: "Qur’an 51:21" },
        { ar: "لَعَلَّكُمْ تَتَفَكَّرُونَ", en: "That you may give thought.", ref: "Qur’an 2:219" },
        { ar: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ", en: "And my success is not but through Allah.", ref: "Qur’an 11:88" }
      ]
    },
    action: {
      label: "Action",
      sub: "Practice · good works · urgency",
      lines: [
        { ar: "وَقُلِ اعْمَلُوا فَسَيَرَى اللَّهُ عَمَلَكُمْ", en: "And say, 'Do [as you will], for Allah will see your deeds.'", ref: "Qur’an 9:105" },
        { ar: "فَاسْتَبِقُوا الْخَيْرَاتِ", en: "So race to [all that is] good.", ref: "Qur’an 2:148" },
        { ar: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", en: "Indeed, Allah is with the patient.", ref: "Qur’an 2:153" },
        { ar: "وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ", en: "And cooperate in righteousness and piety.", ref: "Qur’an 5:2" }
      ]
    }
  };

  function pick(arr) {
    if (!arr || !arr.length) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function formatLine(line) {
    if (!line) return "";
    var parts = [];
    if (line.ar) parts.push(line.ar);
    if (line.en) parts.push(line.en);
    if (line.ref) parts.push("(" + line.ref + ")");
    parts.push("— clarity-dawah.fyi · educational only");
    return parts.join("\n");
  }

  function tryCompanionLine(sectionId) {
    try {
      /* optional bridges — never required */
      if (w.ClarityCompanion && w.ClarityCompanion.rrraLine) {
        var c = w.ClarityCompanion.rrraLine(sectionId);
        if (c && (c.ar || c.en)) return c;
      }
      if (w.ClarityMediaReminder && typeof w.ClarityMediaReminder.pickLine === "function") {
        var m = w.ClarityMediaReminder.pickLine(sectionId);
        if (m && (m.ar || m.en)) return m;
      }
      var raw = localStorage.getItem("clarity.companion.rrra." + sectionId);
      if (raw) {
        var j = JSON.parse(raw);
        if (j && (j.ar || j.en)) return j;
      }
    } catch (e) {}
    return null;
  }

  function fetchSection(sectionId) {
    sectionId = sectionId || "reminder";
    var sec = SECTIONS[sectionId] || SECTIONS.reminder;
    var line = tryCompanionLine(sectionId) || pick(sec.lines);
    return {
      section: sectionId,
      label: sec.label,
      line: line,
      text: formatLine(line)
    };
  }

  function pushLayers(line) {
    if (!line) return;
    w.__memeLayers = {
      ar: line.ar || "",
      en: line.en || "",
      ur: "", /* always refetch online for this ref */
      ref: line.ref || ""
    };
    /* English is local (bundled with line). Urdu is online-only for same ref. */
    try {
      if (w.CraftMemeUrduFetch) {
        w.CraftMemeUrduFetch.loadForCurrentLayers(true);
        setTimeout(function () {
          try { w.CraftMemeUrduFetch.loadForCurrentLayers(true); } catch (eR) {}
        }, 400);
      } /* bank urdu removed C19MEME21 */
    } catch (eU) {}
    try {
      if (w.CraftMemeAutomation && w.CraftMemeAutomation.setLayers) {
        w.CraftMemeAutomation.setLayers(w.__memeLayers);
      }
    } catch (e) {}
  }

  function applyToDesks(text) {
    var x = d.getElementById("x-draft");
    var fb = d.getElementById("fb-draft");
    if (x) {
      x.value = String(text || "").slice(0, 280);
      x.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (fb) {
      fb.value = String(text || "");
      fb.dispatchEvent(new Event("input", { bubbles: true }));
    }
    var card = d.getElementById("craft-verse-card");
    if (card) {
      card.textContent = text || "";
      card.hidden = !text;
    }
  }

  function status(msg) {
    var st = d.getElementById("meme-source-status");
    if (st) st.textContent = msg || "";
  }

  function saveState(extra) {
    try {
      var prev = {};
      try { prev = JSON.parse(localStorage.getItem(STATE_KEY) || "{}") || {}; } catch (e0) {}
      var next = Object.assign({}, prev, extra || {});
      if (w.__memeLayers) next.layers = w.__memeLayers;
      if (w.__memeSceneKind) next.sceneKind = w.__memeSceneKind;
      if (w.__memeBgUrl) next.bgUrl = w.__memeBgUrl;
      next.section = next.section || prev.section || "reminder";
      next.ratio = next.ratio || prev.ratio || "16:9";
      next.savedAt = new Date().toISOString();
      localStorage.setItem(STATE_KEY, JSON.stringify(next));
    } catch (e) {}
  }

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STATE_KEY) || "null");
    } catch (e) {
      return null;
    }
  }

  function applyResult(result, paint) {
    if (!result || !result.line) return;
    pushLayers(result.line);
    applyToDesks(result.text);
    saveState({ section: result.section, layers: w.__memeLayers, text: result.text });
    status("Section · " + (result.section || "reminder") + " · educational only");
    if (paint !== false) {
      try {
        if (typeof w.memeDraw === "function") w.memeDraw();
      } catch (e) {}
    }
  }

  function loadSection(sectionId, paint) {
    var result = fetchSection(sectionId || "reminder");
    applyResult(result, paint);
    return result;
  }

  function chipSelector() {
    return d.querySelectorAll("[data-meme-section], [data-rrra]");
  }

  function bindChips() {
    chipSelector().forEach(function (btn) {
      if (btn._srcBound) return;
      btn._srcBound = true;
      btn.addEventListener("click", function () {
        chipSelector().forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var id = btn.getAttribute("data-meme-section") || btn.getAttribute("data-rrra") || "reminder";
        loadSection(id, true);
      });
    });
    var refresh = d.getElementById("meme-refresh-source");
    if (refresh && !refresh._srcBound) {
      refresh._srcBound = true;
      refresh.addEventListener("click", function () {
        var active = d.querySelector("[data-meme-section].active, [data-rrra].active");
        var id = active
          ? (active.getAttribute("data-meme-section") || active.getAttribute("data-rrra"))
          : "reminder";
        loadSection(id, true);
      });
    }
  }

  w.CraftMemeSource = {
    sections: SECTIONS,
    fetchSection: fetchSection,
    formatLine: formatLine,
    applyToDesks: applyToDesks,
    loadSection: loadSection,
    pushLayers: pushLayers,
    saveState: saveState,
    loadState: loadState,
    STATE_KEY: STATE_KEY
  };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", bindChips);
  else bindChips();
})(window, document);
