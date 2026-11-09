/*! craft-tajweed-bridge-v4 · full studio surah list · pull loads verse · educational only */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_TJ_BRIDGE_V4__) return;
  w.__CRAFT_TJ_BRIDGE_V4__ = true;

  var AYAH_COUNT = {"1": 7, "2": 286, "3": 200, "4": 176, "5": 120, "6": 165, "7": 206, "8": 75, "9": 129, "10": 109, "11": 123, "12": 111, "13": 43, "14": 52, "15": 99, "16": 128, "17": 111, "18": 110, "19": 98, "20": 135, "21": 112, "22": 78, "23": 118, "24": 64, "25": 77, "26": 227, "27": 93, "28": 88, "29": 69, "30": 60, "31": 34, "32": 30, "33": 73, "34": 54, "35": 45, "36": 83, "37": 182, "38": 88, "39": 75, "40": 85, "41": 54, "42": 53, "43": 89, "44": 59, "45": 37, "46": 35, "47": 38, "48": 29, "49": 18, "50": 45, "51": 60, "52": 49, "53": 62, "54": 55, "55": 78, "56": 96, "57": 29, "58": 22, "59": 24, "60": 13, "61": 14, "62": 11, "63": 11, "64": 18, "65": 12, "66": 12, "67": 30, "68": 52, "69": 52, "70": 44, "71": 28, "72": 28, "73": 20, "74": 56, "75": 40, "76": 31, "77": 50, "78": 40, "79": 46, "80": 42, "81": 29, "82": 19, "83": 36, "84": 25, "85": 22, "86": 17, "87": 19, "88": 26, "89": 30, "90": 20, "91": 15, "92": 21, "93": 11, "94": 8, "95": 8, "96": 19, "97": 5, "98": 8, "99": 8, "100": 11, "101": 11, "102": 8, "103": 3, "104": 9, "105": 5, "106": 4, "107": 7, "108": 3, "109": 6, "110": 3, "111": 5, "112": 4, "113": 5, "114": 6};
  var SURAHS = [{"n": 1, "name": "Al-Fātiḥah", "ay": 7}, {"n": 2, "name": "Al-Baqarah", "ay": 286}, {"n": 3, "name": "Āl ʿImrān", "ay": 200}, {"n": 4, "name": "An-Nisāʾ", "ay": 176}, {"n": 5, "name": "Al-Māʾidah", "ay": 120}, {"n": 6, "name": "Al-Anʿām", "ay": 165}, {"n": 7, "name": "Al-Aʿrāf", "ay": 206}, {"n": 8, "name": "Al-Anfāl", "ay": 75}, {"n": 9, "name": "At-Tawbah", "ay": 129}, {"n": 10, "name": "Yūnus", "ay": 109}, {"n": 11, "name": "Hūd", "ay": 123}, {"n": 12, "name": "Yūsuf", "ay": 111}, {"n": 13, "name": "Ar-Raʿd", "ay": 43}, {"n": 14, "name": "Ibrāhīm", "ay": 52}, {"n": 15, "name": "Al-Ḥijr", "ay": 99}, {"n": 16, "name": "An-Naḥl", "ay": 128}, {"n": 17, "name": "Al-Isrāʾ", "ay": 111}, {"n": 18, "name": "Al-Kahf", "ay": 110}, {"n": 19, "name": "Maryam", "ay": 98}, {"n": 20, "name": "Ṭā-Hā", "ay": 135}, {"n": 21, "name": "Al-Anbiyāʾ", "ay": 112}, {"n": 22, "name": "Al-Ḥajj", "ay": 78}, {"n": 23, "name": "Al-Muʾminūn", "ay": 118}, {"n": 24, "name": "An-Nūr", "ay": 64}, {"n": 25, "name": "Al-Furqān", "ay": 77}, {"n": 26, "name": "Ash-Shuʿarāʾ", "ay": 227}, {"n": 27, "name": "An-Naml", "ay": 93}, {"n": 28, "name": "Al-Qaṣaṣ", "ay": 88}, {"n": 29, "name": "Al-ʿAnkabūt", "ay": 69}, {"n": 30, "name": "Ar-Rūm", "ay": 60}, {"n": 31, "name": "Luqmān", "ay": 34}, {"n": 32, "name": "As-Sajdah", "ay": 30}, {"n": 33, "name": "Al-Aḥzāb", "ay": 73}, {"n": 34, "name": "Sabaʾ", "ay": 54}, {"n": 35, "name": "Fāṭir", "ay": 45}, {"n": 36, "name": "Yā-Sīn", "ay": 83}, {"n": 37, "name": "Aṣ-Ṣāffāt", "ay": 182}, {"n": 38, "name": "Ṣād", "ay": 88}, {"n": 39, "name": "Az-Zumar", "ay": 75}, {"n": 40, "name": "Ghāfir", "ay": 85}, {"n": 41, "name": "Fuṣṣilat", "ay": 54}, {"n": 42, "name": "Ash-Shūrā", "ay": 53}, {"n": 43, "name": "Az-Zukhruf", "ay": 89}, {"n": 44, "name": "Ad-Dukhān", "ay": 59}, {"n": 45, "name": "Al-Jāthiyah", "ay": 37}, {"n": 46, "name": "Al-Aḥqāf", "ay": 35}, {"n": 47, "name": "Muḥammad", "ay": 38}, {"n": 48, "name": "Al-Fatḥ", "ay": 29}, {"n": 49, "name": "Al-Ḥujurāt", "ay": 18}, {"n": 50, "name": "Qāf", "ay": 45}, {"n": 51, "name": "Adh-Dhāriyāt", "ay": 60}, {"n": 52, "name": "Aṭ-Ṭūr", "ay": 49}, {"n": 53, "name": "An-Najm", "ay": 62}, {"n": 54, "name": "Al-Qamar", "ay": 55}, {"n": 55, "name": "Ar-Raḥmān", "ay": 78}, {"n": 56, "name": "Al-Wāqiʿah", "ay": 96}, {"n": 57, "name": "Al-Ḥadīd", "ay": 29}, {"n": 58, "name": "Al-Mujādilah", "ay": 22}, {"n": 59, "name": "Al-Ḥashr", "ay": 24}, {"n": 60, "name": "Al-Mumtaḥanah", "ay": 13}, {"n": 61, "name": "Aṣ-Ṣaff", "ay": 14}, {"n": 62, "name": "Al-Jumuʿah", "ay": 11}, {"n": 63, "name": "Al-Munāfiqūn", "ay": 11}, {"n": 64, "name": "At-Taghābun", "ay": 18}, {"n": 65, "name": "Aṭ-Ṭalāq", "ay": 12}, {"n": 66, "name": "At-Taḥrīm", "ay": 12}, {"n": 67, "name": "Al-Mulk", "ay": 30}, {"n": 68, "name": "Al-Qalam", "ay": 52}, {"n": 69, "name": "Al-Ḥāqqah", "ay": 52}, {"n": 70, "name": "Al-Maʿārij", "ay": 44}, {"n": 71, "name": "Nūḥ", "ay": 28}, {"n": 72, "name": "Al-Jinn", "ay": 28}, {"n": 73, "name": "Al-Muzzammil", "ay": 20}, {"n": 74, "name": "Al-Muddaththir", "ay": 56}, {"n": 75, "name": "Al-Qiyāmah", "ay": 40}, {"n": 76, "name": "Al-Insān", "ay": 31}, {"n": 77, "name": "Al-Mursalāt", "ay": 50}, {"n": 78, "name": "An-Nabaʾ", "ay": 40}, {"n": 79, "name": "An-Nāziʿāt", "ay": 46}, {"n": 80, "name": "ʿAbasa", "ay": 42}, {"n": 81, "name": "At-Takwīr", "ay": 29}, {"n": 82, "name": "Al-Infiṭār", "ay": 19}, {"n": 83, "name": "Al-Muṭaffifīn", "ay": 36}, {"n": 84, "name": "Al-Inshiqāq", "ay": 25}, {"n": 85, "name": "Al-Burūj", "ay": 22}, {"n": 86, "name": "Aṭ-Ṭāriq", "ay": 17}, {"n": 87, "name": "Al-Aʿlā", "ay": 19}, {"n": 88, "name": "Al-Ghāshiyah", "ay": 26}, {"n": 89, "name": "Al-Fajr", "ay": 30}, {"n": 90, "name": "Al-Balad", "ay": 20}, {"n": 91, "name": "Ash-Shams", "ay": 15}, {"n": 92, "name": "Al-Layl", "ay": 21}, {"n": 93, "name": "Aḍ-Ḍuḥā", "ay": 11}, {"n": 94, "name": "Ash-Sharḥ", "ay": 8}, {"n": 95, "name": "At-Tīn", "ay": 8}, {"n": 96, "name": "Al-ʿAlaq", "ay": 19}, {"n": 97, "name": "Al-Qadr", "ay": 5}, {"n": 98, "name": "Al-Bayyinah", "ay": 8}, {"n": 99, "name": "Az-Zalzalah", "ay": 8}, {"n": 100, "name": "Al-ʿĀdiyāt", "ay": 11}, {"n": 101, "name": "Al-Qāriʿah", "ay": 11}, {"n": 102, "name": "At-Takāthur", "ay": 8}, {"n": 103, "name": "Al-ʿAṣr", "ay": 3}, {"n": 104, "name": "Al-Humazah", "ay": 9}, {"n": 105, "name": "Al-Fīl", "ay": 5}, {"n": 106, "name": "Quraysh", "ay": 4}, {"n": 107, "name": "Al-Māʿūn", "ay": 7}, {"n": 108, "name": "Al-Kawthar", "ay": 3}, {"n": 109, "name": "Al-Kāfirūn", "ay": 6}, {"n": 110, "name": "An-Naṣr", "ay": 3}, {"n": 111, "name": "Al-Masad", "ay": 5}, {"n": 112, "name": "Al-Ikhlāṣ", "ay": 4}, {"n": 113, "name": "Al-Falaq", "ay": 5}, {"n": 114, "name": "An-Nās", "ay": 6}];
  var JOURNAL_KEY = "clarity_tajweed_practice_journal_v1";
  var CUR_KEY = "clarity_tajweed_curriculum_v2";

  function $(id) { return d.getElementById(id); }
  function ayahMax(s) { return AYAH_COUNT[String(parseInt(s, 10) || 1)] || 1; }

  function setStatus(msg) {
    var el = $("tj-bridge-status");
    if (el) el.textContent = msg;
  }

  function bridgeSurah() {
    var bs = $("tj-bridge-surah");
    return bs ? parseInt(bs.value, 10) || 1 : 1;
  }
  function bridgeAyah() {
    var ba = $("tj-bridge-ayah");
    return ba ? parseInt(ba.value, 10) || 1 : 1;
  }

  function clampAyah() {
    var ba = $("tj-bridge-ayah");
    var max = ayahMax(bridgeSurah());
    if (ba) {
      var v = parseInt(ba.value, 10) || 1;
      if (v < 1) v = 1;
      if (v > max) v = max;
      ba.value = String(v);
      ba.max = String(max);
    }
    var lab = $("tj-bridge-ayah-max");
    if (lab) lab.textContent = "of " + max;
    return max;
  }

  /** Fill original studio <select id="tj-lmr-surah"> with full 114 */
  function enrichStudioSurahSelect() {
    var sel =
      $("tj-lmr-surah") ||
      d.querySelector("#tj-lmr-host select") ||
      d.querySelector(".tj-lmr-toolbar select") ||
      d.querySelector("#tj-lmr select");
    if (!sel) return null;
    if (sel.getAttribute("data-full-surah") === "1" && sel.options.length >= 100) return sel;
    var cur = sel.value;
    var html = "";
    SURAHS.forEach(function (S) {
      html +=
        '<option value="' +
        S.n +
        '" data-ayah="' +
        S.ay +
        '">' +
        S.n +
        ". " +
        S.name +
        " (" +
        S.ay +
        ")</option>";
    });
    sel.innerHTML = html;
    sel.setAttribute("data-full-surah", "1");
    if (cur) sel.value = String(cur);
    return sel;
  }

  function findStudioAyah() {
    return (
      $("tj-lmr-ayah") ||
      d.querySelector("#tj-lmr-host input[type='number']") ||
      d.querySelector(".tj-lmr-toolbar input[type='number']")
    );
  }

  function everyAyahUrl(surah, ayah) {
    var s = String(surah).padStart(3, "0");
    var a = String(ayah).padStart(3, "0");
    return "https://everyayah.com/data/Husary_128kbps/" + s + a + ".mp3";
  }

  function applyVerseToDom(surah, ayah, ar, en) {
    var ref = "Qur’an " + surah + ":" + ayah;
    var metaBits = ref + " · Hafs · Ḥuṣarī audio";
    ["tj-lmr-meta", "tj-lmr-meta-read"].forEach(function (id) {
      var el = $(id);
      if (el) el.textContent = metaBits;
    });
    ["tj-lmr-ar", "tj-lmr-ar-read"].forEach(function (id) {
      var el = $(id);
      if (el) el.textContent = ar || "—";
    });
    ["tj-lmr-en", "tj-lmr-en-read"].forEach(function (id) {
      var el = $(id);
      if (el) el.textContent = en || "";
    });
    /* also any unlabeled arabic blocks under LMR host */
    d.querySelectorAll("#tj-lmr-host .arabic, #tj-lmr .arabic, #tj-lmr-step1 .arabic").forEach(function (el) {
      if (el.id && el.id.indexOf("tj-lmr-ar") < 0) return;
      if (!el.id || el.id.indexOf("tj-lmr-ar") === 0) el.textContent = ar || "—";
    });

    try {
      if (!w.state) w.state = {};
      w.state.surah = surah;
      w.state.ayah = ayah;
      w.state.ar = ar;
      w.state.en = en;
      w.state.ref = ref;
      w.state.audioUrl = everyAyahUrl(surah, ayah);
      w.state.mode = "verse";
    } catch (e) {}

    var audio = $("tj-lmr-master-audio");
    if (audio) {
      audio.src = everyAyahUrl(surah, ayah);
      try { audio.load(); } catch (e2) {}
    }
    var playBtn = $("tj-lmr-play-master");
    if (playBtn) playBtn.disabled = false;
    var link = $("tj-lmr-quran-link") || d.querySelector("a[href*='quran.com']");
    if (link) link.href = "https://quran.com/" + surah + ":" + ayah;
  }

  function fetchAndShow(surah, ayah) {
    setStatus("Loading " + surah + ":" + ayah + "…");
    var ref = surah + ":" + ayah;
    return Promise.all([
      fetch("https://api.alquran.cloud/v1/ayah/" + ref + "/quran-uthmani").then(function (r) {
        return r.json();
      }),
      fetch("https://api.alquran.cloud/v1/ayah/" + ref + "/en.sahih").then(function (r) {
        return r.json();
      })
    ])
      .then(function (pair) {
        var arJ = pair[0];
        var enJ = pair[1];
        if (!arJ.data || !arJ.data.text) throw new Error("empty");
        var ar = arJ.data.text;
        var en = (enJ.data && enJ.data.text) || "";
        applyVerseToDom(surah, ayah, ar, en);
        setStatus("Loaded " + ref);
        return true;
      })
      .catch(function () {
        setStatus("Could not load verse — check connection");
        applyVerseToDom(surah, ayah, "—", "");
        return false;
      });
  }

  function syncControls() {
    clampAyah();
    var s = bridgeSurah();
    var a = bridgeAyah();
    var sel = enrichStudioSurahSelect();
    if (sel) {
      sel.value = String(s);
      try {
        sel.dispatchEvent(new Event("change", { bubbles: true }));
      } catch (e3) {}
    }
    var oa = findStudioAyah();
    if (oa) {
      oa.value = String(a);
      oa.max = String(ayahMax(s));
      try {
        oa.dispatchEvent(new Event("change", { bubbles: true }));
      } catch (e4) {}
    }
  }

  function pullIntoStudio() {
    syncControls();
    var s = bridgeSurah();
    var a = bridgeAyah();
    fetchAndShow(s, a).then(function () {
      /* also click native pull if present for any internal state */
      var btn = $("tj-lmr-fetch");
      if (btn) {
        try { btn.click(); } catch (e5) {}
      }
    });
  }

  function loadJournal() {
    try { return JSON.parse(localStorage.getItem(JOURNAL_KEY) || "[]") || []; }
    catch (e) { return []; }
  }
  function saveJournal(rows) {
    try { localStorage.setItem(JOURNAL_KEY, JSON.stringify(rows.slice(0, 200))); } catch (e6) {}
  }
  function renderJournal() {
    var host = $("tj-practice-journal");
    if (!host) return;
    var rows = loadJournal();
    if (!rows.length) {
      host.innerHTML = '<p class="tj-muted">No real practice sessions logged yet.</p>';
      return;
    }
    host.innerHTML =
      '<table class="tj-journal-table"><thead><tr><th>When</th><th>Ref</th><th>Score</th></tr></thead><tbody>' +
      rows.slice(0, 40).map(function (r) {
        return "<tr><td>" + new Date(r.t).toLocaleString() + "</td><td>" + r.surah + ":" + r.ayah +
          "</td><td><strong>" + r.score + "</strong></td></tr>";
      }).join("") +
      "</tbody></table>";
  }

  function exportAll() {
    var payload = {
      exportedAt: new Date().toISOString(),
      journal: loadJournal(),
      curriculum: (function () {
        try { return JSON.parse(localStorage.getItem(CUR_KEY) || "{}"); } catch (e) { return {}; }
      })()
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    var a = d.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "clarity-tajweed-progress-" + Date.now() + ".json";
    d.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
  }
  function resetAll() {
    if (!w.confirm("Reset journal and curriculum meters?")) return;
    try {
      localStorage.removeItem(JOURNAL_KEY);
      localStorage.removeItem(CUR_KEY);
    } catch (e7) {}
    renderJournal();
    setStatus("Reset complete");
  }

  function wire() {
    enrichStudioSurahSelect();
    clampAyah();
    var bs = $("tj-bridge-surah");
    var ba = $("tj-bridge-ayah");
    if (bs && !bs.__v4) {
      bs.__v4 = true;
      bs.addEventListener("change", function () {
        if (ba) ba.value = "1";
        clampAyah();
        syncControls();
      });
    }
    if (ba && !ba.__v4) {
      ba.__v4 = true;
      ba.addEventListener("change", function () {
        clampAyah();
        syncControls();
      });
    }
    var prev = $("tj-bridge-prev");
    var next = $("tj-bridge-next");
    if (prev && !prev.__v4) {
      prev.__v4 = true;
      prev.addEventListener("click", function () {
        if (!ba) return;
        ba.value = String(Math.max(1, bridgeAyah() - 1));
        clampAyah();
        syncControls();
      });
    }
    if (next && !next.__v4) {
      next.__v4 = true;
      next.addEventListener("click", function () {
        if (!ba) return;
        ba.value = String(Math.min(ayahMax(bridgeSurah()), bridgeAyah() + 1));
        clampAyah();
        syncControls();
      });
    }
    var pull = $("tj-bridge-pull");
    if (pull && !pull.__v4) {
      pull.__v4 = true;
      pull.addEventListener("click", pullIntoStudio);
    }
    /* studio's own Pull āyah: ensure select is full then load */
    d.addEventListener(
      "click",
      function (ev) {
        var t = ev.target && ev.target.closest && ev.target.closest("button");
        if (!t) return;
        if (!/pull\s*āyah|pull\s*ayah|tj-lmr-fetch/i.test((t.textContent || "") + t.id)) return;
        enrichStudioSurahSelect();
        var sel = $("tj-lmr-surah");
        var oa = findStudioAyah();
        var s = sel ? parseInt(sel.value, 10) || bridgeSurah() : bridgeSurah();
        var a = oa ? parseInt(oa.value, 10) || bridgeAyah() : bridgeAyah();
        /* if studio surah empty, use bridge */
        if (!s) s = bridgeSurah();
        setTimeout(function () {
          fetchAndShow(s, a);
        }, 50);
      },
      true
    );

    var exp = $("tj-progress-export");
    if (exp && !exp.__v4) { exp.__v4 = true; exp.addEventListener("click", exportAll); }
    var rst = $("tj-progress-reset");
    if (rst && !rst.__v4) { rst.__v4 = true; rst.addEventListener("click", resetAll); }

    renderJournal();
    syncControls();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", wire);
  else wire();
  w.addEventListener("load", function () {
    setTimeout(wire, 300);
    setTimeout(function () { enrichStudioSurahSelect(); }, 1000);
    setTimeout(function () { enrichStudioSurahSelect(); }, 2500);
  });
  setTimeout(wire, 800);

  w.ClarityTajweedBridge = {
    pullIntoStudio: pullIntoStudio,
    fetchAndShow: fetchAndShow,
    enrichStudioSurahSelect: enrichStudioSurahSelect
  };
})(window, document);
