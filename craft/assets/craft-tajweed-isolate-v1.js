/*! craft-tajweed-isolate-v1 · self-contained Craft LMR · full 114 · educational only */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_TJ_ISOLATE_V1__) return;
  w.__CRAFT_TJ_ISOLATE_V1__ = true;

  var SURAHS = [{"n": 1, "name": "Al-Fātiḥah", "ay": 7}, {"n": 2, "name": "Al-Baqarah", "ay": 286}, {"n": 3, "name": "Āl ʿImrān", "ay": 200}, {"n": 4, "name": "An-Nisāʾ", "ay": 176}, {"n": 5, "name": "Al-Māʾidah", "ay": 120}, {"n": 6, "name": "Al-Anʿām", "ay": 165}, {"n": 7, "name": "Al-Aʿrāf", "ay": 206}, {"n": 8, "name": "Al-Anfāl", "ay": 75}, {"n": 9, "name": "At-Tawbah", "ay": 129}, {"n": 10, "name": "Yūnus", "ay": 109}, {"n": 11, "name": "Hūd", "ay": 123}, {"n": 12, "name": "Yūsuf", "ay": 111}, {"n": 13, "name": "Ar-Raʿd", "ay": 43}, {"n": 14, "name": "Ibrāhīm", "ay": 52}, {"n": 15, "name": "Al-Ḥijr", "ay": 99}, {"n": 16, "name": "An-Naḥl", "ay": 128}, {"n": 17, "name": "Al-Isrāʾ", "ay": 111}, {"n": 18, "name": "Al-Kahf", "ay": 110}, {"n": 19, "name": "Maryam", "ay": 98}, {"n": 20, "name": "Ṭā-Hā", "ay": 135}, {"n": 21, "name": "Al-Anbiyāʾ", "ay": 112}, {"n": 22, "name": "Al-Ḥajj", "ay": 78}, {"n": 23, "name": "Al-Muʾminūn", "ay": 118}, {"n": 24, "name": "An-Nūr", "ay": 64}, {"n": 25, "name": "Al-Furqān", "ay": 77}, {"n": 26, "name": "Ash-Shuʿarāʾ", "ay": 227}, {"n": 27, "name": "An-Naml", "ay": 93}, {"n": 28, "name": "Al-Qaṣaṣ", "ay": 88}, {"n": 29, "name": "Al-ʿAnkabūt", "ay": 69}, {"n": 30, "name": "Ar-Rūm", "ay": 60}, {"n": 31, "name": "Luqmān", "ay": 34}, {"n": 32, "name": "As-Sajdah", "ay": 30}, {"n": 33, "name": "Al-Aḥzāb", "ay": 73}, {"n": 34, "name": "Sabaʾ", "ay": 54}, {"n": 35, "name": "Fāṭir", "ay": 45}, {"n": 36, "name": "Yā-Sīn", "ay": 83}, {"n": 37, "name": "Aṣ-Ṣāffāt", "ay": 182}, {"n": 38, "name": "Ṣād", "ay": 88}, {"n": 39, "name": "Az-Zumar", "ay": 75}, {"n": 40, "name": "Ghāfir", "ay": 85}, {"n": 41, "name": "Fuṣṣilat", "ay": 54}, {"n": 42, "name": "Ash-Shūrā", "ay": 53}, {"n": 43, "name": "Az-Zukhruf", "ay": 89}, {"n": 44, "name": "Ad-Dukhān", "ay": 59}, {"n": 45, "name": "Al-Jāthiyah", "ay": 37}, {"n": 46, "name": "Al-Aḥqāf", "ay": 35}, {"n": 47, "name": "Muḥammad", "ay": 38}, {"n": 48, "name": "Al-Fatḥ", "ay": 29}, {"n": 49, "name": "Al-Ḥujurāt", "ay": 18}, {"n": 50, "name": "Qāf", "ay": 45}, {"n": 51, "name": "Adh-Dhāriyāt", "ay": 60}, {"n": 52, "name": "Aṭ-Ṭūr", "ay": 49}, {"n": 53, "name": "An-Najm", "ay": 62}, {"n": 54, "name": "Al-Qamar", "ay": 55}, {"n": 55, "name": "Ar-Raḥmān", "ay": 78}, {"n": 56, "name": "Al-Wāqiʿah", "ay": 96}, {"n": 57, "name": "Al-Ḥadīd", "ay": 29}, {"n": 58, "name": "Al-Mujādilah", "ay": 22}, {"n": 59, "name": "Al-Ḥashr", "ay": 24}, {"n": 60, "name": "Al-Mumtaḥanah", "ay": 13}, {"n": 61, "name": "Aṣ-Ṣaff", "ay": 14}, {"n": 62, "name": "Al-Jumuʿah", "ay": 11}, {"n": 63, "name": "Al-Munāfiqūn", "ay": 11}, {"n": 64, "name": "At-Taghābun", "ay": 18}, {"n": 65, "name": "Aṭ-Ṭalāq", "ay": 12}, {"n": 66, "name": "At-Taḥrīm", "ay": 12}, {"n": 67, "name": "Al-Mulk", "ay": 30}, {"n": 68, "name": "Al-Qalam", "ay": 52}, {"n": 69, "name": "Al-Ḥāqqah", "ay": 52}, {"n": 70, "name": "Al-Maʿārij", "ay": 44}, {"n": 71, "name": "Nūḥ", "ay": 28}, {"n": 72, "name": "Al-Jinn", "ay": 28}, {"n": 73, "name": "Al-Muzzammil", "ay": 20}, {"n": 74, "name": "Al-Muddaththir", "ay": 56}, {"n": 75, "name": "Al-Qiyāmah", "ay": 40}, {"n": 76, "name": "Al-Insān", "ay": 31}, {"n": 77, "name": "Al-Mursalāt", "ay": 50}, {"n": 78, "name": "An-Nabaʾ", "ay": 40}, {"n": 79, "name": "An-Nāziʿāt", "ay": 46}, {"n": 80, "name": "ʿAbasa", "ay": 42}, {"n": 81, "name": "At-Takwīr", "ay": 29}, {"n": 82, "name": "Al-Infiṭār", "ay": 19}, {"n": 83, "name": "Al-Muṭaffifīn", "ay": 36}, {"n": 84, "name": "Al-Inshiqāq", "ay": 25}, {"n": 85, "name": "Al-Burūj", "ay": 22}, {"n": 86, "name": "Aṭ-Ṭāriq", "ay": 17}, {"n": 87, "name": "Al-Aʿlā", "ay": 19}, {"n": 88, "name": "Al-Ghāshiyah", "ay": 26}, {"n": 89, "name": "Al-Fajr", "ay": 30}, {"n": 90, "name": "Al-Balad", "ay": 20}, {"n": 91, "name": "Ash-Shams", "ay": 15}, {"n": 92, "name": "Al-Layl", "ay": 21}, {"n": 93, "name": "Aḍ-Ḍuḥā", "ay": 11}, {"n": 94, "name": "Ash-Sharḥ", "ay": 8}, {"n": 95, "name": "At-Tīn", "ay": 8}, {"n": 96, "name": "Al-ʿAlaq", "ay": 19}, {"n": 97, "name": "Al-Qadr", "ay": 5}, {"n": 98, "name": "Al-Bayyinah", "ay": 8}, {"n": 99, "name": "Az-Zalzalah", "ay": 8}, {"n": 100, "name": "Al-ʿĀdiyāt", "ay": 11}, {"n": 101, "name": "Al-Qāriʿah", "ay": 11}, {"n": 102, "name": "At-Takāthur", "ay": 8}, {"n": 103, "name": "Al-ʿAṣr", "ay": 3}, {"n": 104, "name": "Al-Humazah", "ay": 9}, {"n": 105, "name": "Al-Fīl", "ay": 5}, {"n": 106, "name": "Quraysh", "ay": 4}, {"n": 107, "name": "Al-Māʿūn", "ay": 7}, {"n": 108, "name": "Al-Kawthar", "ay": 3}, {"n": 109, "name": "Al-Kāfirūn", "ay": 6}, {"n": 110, "name": "An-Naṣr", "ay": 3}, {"n": 111, "name": "Al-Masad", "ay": 5}, {"n": 112, "name": "Al-Ikhlāṣ", "ay": 4}, {"n": 113, "name": "Al-Falaq", "ay": 5}, {"n": 114, "name": "An-Nās", "ay": 6}];
  var AYAH_COUNT = {};
  SURAHS.forEach(function (S) { AYAH_COUNT[String(S.n)] = S.ay; });

  function $(id) { return d.getElementById(id); }

  function buildOptionsHtml() {
    return SURAHS.map(function (S) {
      return (
        '<option value="' +
        S.n +
        '" data-ayah="' +
        S.ay +
        '">' +
        S.n +
        " · " +
        S.name +
        "</option>"
      );
    }).join("");
  }

  function forceFullSurahSelect(sel) {
    if (!sel || sel.tagName !== "SELECT") return false;
    if (sel.options.length >= 110 && sel.getAttribute("data-craft-full") === "1") return true;
    var keep = sel.value;
    sel.innerHTML = buildOptionsHtml();
    sel.setAttribute("data-craft-full", "1");
    if (keep) sel.value = String(keep);
    if (!sel.value) sel.value = "1";
    return true;
  }

  function allSurahSelects() {
    return d.querySelectorAll(
      "#tj-lmr-surah, #tj-lmr-host select[aria-label*='Surah' i], #tj-lmr-host select[aria-label*='Sūrah' i], select#tj-lmr-surah"
    );
  }

  function enrichAll() {
    allSurahSelects().forEach(function (sel) {
      forceFullSurahSelect(sel);
    });
  }

  function everyAyahUrl(surah, ayah) {
    var s = String(surah).padStart(3, "0");
    var a = String(ayah).padStart(3, "0");
    return "https://everyayah.com/data/Husary_128kbps/" + s + a + ".mp3";
  }

  function applyVerse(surah, ayah, ar, en) {
    var ref = "Qur’an " + surah + ":" + ayah + " · Hafs · Ḥuṣarī audio";
    ["tj-lmr-meta", "tj-lmr-meta-read"].forEach(function (id) {
      var el = $(id);
      if (el) el.textContent = ref;
    });
    ["tj-lmr-ar", "tj-lmr-ar-read"].forEach(function (id) {
      var el = $(id);
      if (el) el.textContent = ar || "—";
    });
    ["tj-lmr-en", "tj-lmr-en-read"].forEach(function (id) {
      var el = $(id);
      if (el) el.textContent = en || "";
    });
    d.querySelectorAll("#tj-lmr-host .tj-lmr-ar, #tj-lmr-step1 .arabic").forEach(function (el) {
      el.textContent = ar || "—";
    });
    try {
      if (!w.state) w.state = {};
      w.state.surah = surah;
      w.state.ayah = ayah;
      w.state.ar = ar;
      w.state.en = en;
      w.state.audioUrl = everyAyahUrl(surah, ayah);
      w.state.ref = "Qur’an " + surah + ":" + ayah;
    } catch (e) {}
    var audio = $("tj-lmr-master-audio");
    if (audio) {
      audio.src = everyAyahUrl(surah, ayah);
      try { audio.load(); } catch (e2) {}
    }
    var play = $("tj-lmr-play-master");
    if (play) play.disabled = false;
    var link = $("tj-lmr-quran-link");
    if (link) link.href = "https://quran.com/" + surah + ":" + ayah;
  }

  function fetchVerse(surah, ayah) {
    var ref = surah + ":" + ayah;
    return Promise.all([
      fetch("https://api.alquran.cloud/v1/ayah/" + ref + "/quran-uthmani").then(function (r) { return r.json(); }),
      fetch("https://api.alquran.cloud/v1/ayah/" + ref + "/en.sahih").then(function (r) { return r.json(); })
    ]).then(function (pair) {
      var ar = pair[0].data && pair[0].data.text;
      var en = pair[1].data && pair[1].data.text;
      if (!ar) throw new Error("empty");
      applyVerse(surah, ayah, ar, en || "");
      return true;
    });
  }

  function readStudioSurahAyah() {
    enrichAll();
    var sel = $("tj-lmr-surah") || allSurahSelects()[0];
    var inp = $("tj-lmr-ayah") || d.querySelector("#tj-lmr-host input[type='number']");
    var s = sel ? parseInt(sel.value, 10) : 1;
    var a = inp ? parseInt(inp.value, 10) : 1;
    if (!s) s = 1;
    if (!a) a = 1;
    var max = AYAH_COUNT[String(s)] || 1;
    if (a > max) a = max;
    if (inp) inp.value = String(a);
    return { surah: s, ayah: a };
  }

  function onPull() {
    var ra = readStudioSurahAyah();
    fetchVerse(ra.surah, ra.ayah).catch(function () {
      applyVerse(ra.surah, ra.ayah, "—", "");
    });
  }

  /* Bridge integration */
  function bridgePull() {
    var bs = $("tj-bridge-surah");
    var ba = $("tj-bridge-ayah");
    var s = bs ? parseInt(bs.value, 10) || 1 : 1;
    var a = ba ? parseInt(ba.value, 10) || 1 : 1;
    enrichAll();
    var sel = $("tj-lmr-surah");
    var inp = $("tj-lmr-ayah");
    if (sel) sel.value = String(s);
    if (inp) {
      inp.value = String(a);
      inp.max = String(AYAH_COUNT[String(s)] || 1);
    }
    fetchVerse(s, a).catch(function () {});
    var st = $("tj-bridge-status");
    if (st) st.textContent = "Loaded " + s + ":" + a;
  }

  function wirePullButtons() {
    d.addEventListener(
      "click",
      function (ev) {
        var t = ev.target && ev.target.closest && ev.target.closest("button");
        if (!t) return;
        var lab = ((t.textContent || "") + " " + (t.id || "")).toLowerCase();
        if (t.id === "tj-bridge-pull") {
          ev.preventDefault();
          bridgePull();
          return;
        }
        if (/pull\s*āyah|pull\s*ayah|tj-lmr-fetch/.test(lab)) {
          setTimeout(onPull, 30);
        }
      },
      true
    );
  }

  function observeShell() {
    var host = $("tj-lmr-host") || d.body;
    var obs = new MutationObserver(function () {
      enrichAll();
    });
    try {
      obs.observe(host, { childList: true, subtree: true });
    } catch (e3) {}
  }

  function boot() {
    enrichAll();
    wirePullButtons();
    observeShell();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(enrichAll, 200);
    setTimeout(enrichAll, 1000);
    setTimeout(enrichAll, 3000);
  });
  setTimeout(boot, 500);

  w.ClarityTajweedIsolate = { enrichAll: enrichAll, fetchVerse: fetchVerse, bridgePull: bridgePull };
})(window, document);
