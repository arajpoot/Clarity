/*! companion-g9-reflection-governance-v1
 * Reflection hub loaders · noise-free · governance contract hooks
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_G9_REFLECTION_V1__) return;
  w.__CLARITY_G9_REFLECTION_V1__ = true;
  var LOG = (w.__G9_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }
  function $(id) { return d.getElementById(id); }

  var cache = {};
  function parseKey(k) {
    var p = String(k).split(":");
    return { s: parseInt(p[0], 10), a: parseInt(p[1], 10) };
  }
  function fetchAyah(s, a) {
    var key = s + ":" + a;
    if (cache[key]) return Promise.resolve(cache[key]);
    return fetch("https://api.alquran.cloud/v1/ayah/" + s + ":" + a + "/editions/quran-uthmani,en.sahih")
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var eds = (j && j.data) || [];
        var ar = (eds[0] && eds[0].text) || "";
        var en = (eds[1] && eds[1].text) || "";
        var row = { s: s, a: a, ar: ar, en: en };
        cache[key] = row;
        return row;
      });
  }

  /* —— Lessons (grave / hereafter reflections) —— */
  var LESSONS = [
    { t: "Remember death often", b: "The Prophet ﷺ called death the destroyer of pleasures. One soft reminder, then one good deed — educational reflection, not a fatwa." },
    { t: "Send light ahead", b: "Ṣadaqah, duʿāʾ, and useful knowledge are among the deeds that continue. Verify details with Sunnah.com / a local scholar." },
    { t: "Three that follow", b: "Family, wealth, and deeds accompany; only deeds remain. Classical reminder — not a grading of īmān." },
    { t: "Right of the grave", b: "Furnish the grave with tawḥīd, prayer, and character before the body is laid. Educational only." },
    { t: "Private deeds", b: "What is between you and Allah needs no audience. Protect sincerity; consult a scholar for rulings." }
  ];
  var lessonIdx = 0;
  w.loadLesson = function (next) {
    if (next) lessonIdx = (lessonIdx + 1) % LESSONS.length;
    var el = $("lesson");
    if (!el) return;
    var L = LESSONS[lessonIdx];
    el.innerHTML =
      "<strong>" + L.t + "</strong><p style=\"margin:0.4rem 0 0;line-height:1.5;font-size:0.92rem\">" + L.b + "</p>";
    try {
      localStorage.setItem("clarity.lessons.count", String(lessonIdx + 1));
    } catch (e) {}
    var ld = $("lessons-display");
    if (ld) ld.textContent = "Lessons: " + (lessonIdx + 1);
    log("lesson:" + lessonIdx);
  };

  /* —— Daily verse —— */
  var VERSES = ["2:152", "2:286", "3:8", "13:28", "14:7", "16:18", "39:53", "94:5", "94:6", "103:1", "103:2", "103:3"];
  var verseIdx = Math.floor(Date.now() / 86400000) % VERSES.length;
  var currentVerse = null;
  w.loadVerse = function () {
    verseIdx = (verseIdx + 1) % VERSES.length;
    var p = parseKey(VERSES[verseIdx]);
    var el = $("verse");
    if (el) el.innerHTML = '<div class="loading-msg">Loading…</div>';
    fetchAyah(p.s, p.a)
      .then(function (row) {
        currentVerse = row;
        if (!el) return;
        el.innerHTML =
          '<div class="arabic" dir="rtl" lang="ar" style="font-size:1.2rem;line-height:1.85">' +
          row.ar +
          "</div><p style=\"margin:0.35rem 0;line-height:1.5\">" +
          row.en +
          "</p><p class=\"td-src\">Qur’an " +
          row.s +
          ":" +
          row.a +
          " · Sahih International · educational only</p>";
      })
      .catch(function () {
        if (el) el.innerHTML = "<p class=\"td-src\">Could not load verse. Check connection.</p>";
      });
  };
  w.playCurrentVerseAudio = function () {
    if (!currentVerse) {
      w.loadVerse();
      return;
    }
    try {
      var u =
        "https://cdn.islamic.network/quran/audio/128/ar.alafasy/" +
        currentVerse.s +
        "/" +
        currentVerse.a +
        ".mp3";
      var a = $("clarity-verse-audio") || d.createElement("audio");
      a.id = "clarity-verse-audio";
      a.src = u;
      a.play().catch(function () {
        log("audio-blocked");
      });
      if (!$("clarity-verse-audio")) d.body.appendChild(a);
    } catch (e) {
      log("audio-fail");
    }
  };

  /* —— Asmāʾ —— */
  var ASMA = [
    { ar: "الرَّحْمَٰنُ", en: "Ar-Raḥmān — The Most Merciful" },
    { ar: "الرَّحِيمُ", en: "Ar-Raḥīm — The Especially Merciful" },
    { ar: "الْمَلِكُ", en: "Al-Malik — The King" },
    { ar: "الْقُدُّوسُ", en: "Al-Quddūs — The Most Holy" },
    { ar: "السَّلَامُ", en: "As-Salām — The Source of Peace" },
    { ar: "الْغَفُورُ", en: "Al-Ghafūr — The Forgiving" },
    { ar: "الْوَدُودُ", en: "Al-Wadūd — The Most Loving" },
    { ar: "الْحَكِيمُ", en: "Al-Ḥakīm — The Wise" },
    { ar: "الْعَلِيمُ", en: "Al-ʿAlīm — The All-Knowing" },
    { ar: "الْحَفِيظُ", en: "Al-Ḥafīẓ — The Preserver" }
  ];
  var asmaIdx = 0;
  w.loadAsma = function (random) {
    if (random) asmaIdx = Math.floor(Math.random() * ASMA.length);
    else asmaIdx = (asmaIdx + 1) % ASMA.length;
    var box = $("asma-box");
    if (!box) return;
    var n = ASMA[asmaIdx];
    box.innerHTML =
      '<div class="arabic" dir="rtl" lang="ar" style="font-size:1.4rem">' +
      n.ar +
      "</div><p style=\"margin:0.35rem 0\">" +
      n.en +
      "</p><p class=\"td-src\">Educational Name of Allah · not a fatwa</p>";
  };
  w.showAllAsma = function () {
    var list = $("asma-all-list");
    if (!list) return;
    list.style.display = "block";
    list.innerHTML = ASMA.map(function (n) {
      return (
        '<div style="padding:0.35rem 0;border-bottom:1px solid rgba(255,255,255,0.06)"><span dir="rtl" lang="ar">' +
        n.ar +
        "</span> — " +
        n.en +
        "</div>"
      );
    }).join("");
  };

  /* —— Zikr —— */
  var ZIKR = [
    { ar: "سُبْحَانَ اللَّهِ", en: "Subḥānallāh — Glory be to Allah" },
    { ar: "الْحَمْدُ لِلَّهِ", en: "Alḥamdulillāh — All praise is for Allah" },
    { ar: "اللَّهُ أَكْبَرُ", en: "Allāhu akbar — Allah is the Greatest" },
    { ar: "لَا إِلَٰهَ إِلَّا اللَّهُ", en: "Lā ilāha illallāh — There is no god but Allah" },
    { ar: "أَسْتَغْفِرُ اللَّهَ", en: "Astaghfirullāh — I seek Allah’s forgiveness" }
  ];
  var zikrIdx = 0;
  w.loadZikr = function () {
    zikrIdx = (zikrIdx + 1) % ZIKR.length;
    var el = $("zikr");
    if (!el) return;
    var z = ZIKR[zikrIdx];
    el.innerHTML =
      '<div class="arabic" dir="rtl" lang="ar" style="font-size:1.25rem">' +
      z.ar +
      "</div><p>" +
      z.en +
      "</p>";
  };

  /* —— Live tafsīr ayah —— */
  var TAFSIR_KEYS = ["1:1", "1:2", "1:5", "2:2", "2:255", "3:26", "18:10", "24:35", "55:1", "55:2", "67:2", "112:1"];
  var tafIdx = Math.floor(Date.now() / 86400000) % TAFSIR_KEYS.length;
  w.clarityLiveTafseer = function (next) {
    if (next) tafIdx = (tafIdx + 1) % TAFSIR_KEYS.length;
    var p = parseKey(TAFSIR_KEYS[tafIdx]);
    fetchAyah(p.s, p.a)
      .then(function (row) {
        var ar = $("tafseer-live-ar");
        var en = $("tafseer-live-en");
        var meta = $("tafseer-live-meta");
        var full = $("tafseer-live-full");
        if (ar) ar.textContent = row.ar || "";
        if (en) en.textContent = row.en || "";
        if (meta) {
          meta.innerHTML =
            "Qur’an " +
            row.s +
            ":" +
            row.a +
            ' · <a href="https://quran.com/' +
            row.s +
            "/" +
            row.a +
            '" target="_blank" rel="noopener">Quran.com</a> · educational only';
        }
        if (full)
          full.textContent =
            "Read tafsīr with a trusted teacher. Short English above is translation, not full tafsīr. Not a fatwa.";
      })
      .catch(function () {
        log("tafseer-fail");
      });
  };

  /* —— Night breath —— */
  var NIGHT_Q = [
    "What one deed would I want to have sent ahead?",
    "Whom did I wrong that I can still ask to forgive me?",
    "What secret deed can I do before sleep for Allah alone?",
    "Did I pray with presence once today?",
    "What habit would I not want written against me tonight?"
  ];
  var nightIdx = 0;
  w.nightBreathRefresh = function () {
    nightIdx = (nightIdx + 1) % NIGHT_Q.length;
    var q = $("night-breath-q");
    if (q) q.textContent = NIGHT_Q[nightIdx];
  };
  w.nightBreathAct = function () {
    try {
      localStorage.setItem("clarity.nightBreath.acted." + new Date().toISOString().slice(0, 10), "1");
    } catch (e) {}
    var q = $("night-breath-q");
    if (q) q.textContent = "May Allah accept one sincere deed. Now act — then return to this question tomorrow.";
    log("night-act");
  };

  /* —— Soul compass —— */
  w.soulCompassDone = function () {
    var st = $("soul-compass-status");
    if (st) st.textContent = "Marked for tonight · educational self-audit only";
    try {
      localStorage.setItem("clarity.soulCompass." + new Date().toISOString().slice(0, 10), "1");
    } catch (e) {}
  };

  /* —— Deposits —— */
  function depKey(k) {
    return "clarity.deposit." + k + "." + new Date().toISOString().slice(0, 10);
  }
  w.addDeposit = function (kind) {
    var id = kind === "salawat" ? "salawat-count" : "istighfar-count";
    var el = $(id);
    var n = 0;
    try {
      n = parseInt(localStorage.getItem(depKey(kind)) || "0", 10) || 0;
    } catch (e) {}
    n += 1;
    try {
      localStorage.setItem(depKey(kind), String(n));
    } catch (e2) {}
    if (el) el.textContent = String(n);
  };
  w.resetDeposits = function () {
    ["istighfar", "salawat"].forEach(function (k) {
      try {
        localStorage.removeItem(depKey(k));
      } catch (e) {}
      var id = k === "salawat" ? "salawat-count" : "istighfar-count";
      var el = $(id);
      if (el) el.textContent = "0";
    });
  };
  function hydrateDeposits() {
    ["istighfar", "salawat"].forEach(function (k) {
      var id = k === "salawat" ? "salawat-count" : "istighfar-count";
      var el = $(id);
      if (!el) return;
      try {
        el.textContent = String(parseInt(localStorage.getItem(depKey(k)) || "0", 10) || 0);
      } catch (e) {}
    });
  }

  /* —— Name / notes / TTS stubs —— */
  w.resetName = function () {
    try {
      localStorage.removeItem("clarity.userName");
    } catch (e) {}
    var wa = $("welcome-area");
    if (wa) wa.style.display = "none";
    log("resetName");
  };
  if (typeof w.notesQuickFromSection !== "function") {
    w.notesQuickFromSection = function () {
      log("notesQuick");
    };
  }
  if (typeof w.clarityInlineTTS !== "function") {
    w.clarityInlineTTS = function (btn, lang) {
      try {
        var text = (btn && btn.closest && btn.closest(".card") && btn.closest(".card").innerText) || "";
        if (!w.speechSynthesis || !text) return;
        var u = new SpeechSynthesisUtterance(text.slice(0, 400));
        u.lang = lang === "ar" ? "ar-SA" : "en-US";
        w.speechSynthesis.speak(u);
      } catch (e) {
        log("tts-fail");
      }
    };
  }
  if (typeof w.toggleDailyReminder !== "function") {
    w.toggleDailyReminder = function () {
      log("notify-toggle");
    };
  }
  var prevRefresh = w.clarityRefreshSection;
  w.clarityRefreshSection = function (sec) {
    if (sec === "tafseer") {
      w.clarityLiveTafseer(true);
      return;
    }
    if (typeof prevRefresh === "function") {
      try {
        return prevRefresh.apply(this, arguments);
      } catch (e) {}
    }
  };

  function bootReflection() {
    hydrateDeposits();
    w.loadLesson(false);
    /* verse on open */
    verseIdx = (Math.floor(Date.now() / 86400000) % VERSES.length) - 1;
    w.loadVerse();
    w.loadAsma(false);
    w.loadZikr();
    w.clarityLiveTafseer(false);
    log("g9-boot");
  }

  d.addEventListener("click", function (ev) {
    var t = ev.target;
    if (!t || !t.closest) return;
    if (t.closest("[data-rail-tab='reflection'], [data-rrra='reflection']")) {
      setTimeout(function () {
        var v = $("verse");
        if (v && /Loading/i.test(v.textContent || "")) w.loadVerse();
        var ar = $("tafseer-live-ar");
        if (ar && !(ar.textContent || "").trim()) w.clarityLiveTafseer(false);
      }, 120);
    }
  });

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", bootReflection);
  else bootReflection();
})(window, document);
