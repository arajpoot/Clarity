/*! craft-tajweed-bridge-v1 · single LMR surface · curriculum wire · educational only */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_TJ_BRIDGE_V1__) return;
  w.__CRAFT_TJ_BRIDGE_V1__ = true;

  var AYAH_COUNT = {"1": 7, "2": 286, "3": 200, "4": 176, "5": 120, "6": 165, "7": 206, "8": 75, "9": 129, "10": 109, "11": 123, "12": 111, "13": 43, "14": 52, "15": 99, "16": 128, "17": 111, "18": 110, "19": 98, "20": 135, "21": 112, "22": 78, "23": 118, "24": 64, "25": 77, "26": 227, "27": 93, "28": 88, "29": 69, "30": 60, "31": 34, "32": 30, "33": 73, "34": 54, "35": 45, "36": 83, "37": 182, "38": 88, "39": 75, "40": 85, "41": 54, "42": 53, "43": 89, "44": 59, "45": 37, "46": 35, "47": 38, "48": 29, "49": 18, "50": 45, "51": 60, "52": 49, "53": 62, "54": 55, "55": 78, "56": 96, "57": 29, "58": 22, "59": 24, "60": 13, "61": 14, "62": 11, "63": 11, "64": 18, "65": 12, "66": 12, "67": 30, "68": 52, "69": 52, "70": 44, "71": 28, "72": 28, "73": 20, "74": 56, "75": 40, "76": 31, "77": 50, "78": 40, "79": 46, "80": 42, "81": 29, "82": 19, "83": 36, "84": 25, "85": 22, "86": 17, "87": 19, "88": 26, "89": 30, "90": 20, "91": 15, "92": 21, "93": 11, "94": 8, "95": 8, "96": 19, "97": 5, "98": 8, "99": 8, "100": 11, "101": 11, "102": 8, "103": 3, "104": 9, "105": 5, "106": 4, "107": 7, "108": 3, "109": 6, "110": 3, "111": 5, "112": 4, "113": 5, "114": 6};
  var JOURNAL_KEY = "clarity_tajweed_practice_journal_v1";

  function $(id) { return d.getElementById(id); }
  function $$(sel) { return d.querySelectorAll(sel); }

  function loadJournal() {
    try { return JSON.parse(localStorage.getItem(JOURNAL_KEY) || "[]") || []; }
    catch (e) { return []; }
  }
  function saveJournal(rows) {
    try { localStorage.setItem(JOURNAL_KEY, JSON.stringify(rows.slice(0, 200))); } catch (e2) {}
  }

  function findSurahSelect() {
    return $("tj-lmr-surah") || d.querySelector('select[aria-label*="Sūrah"], select[aria-label*="Surah"], #tj-bridge-surah');
  }
  function findAyahInput() {
    return $("tj-lmr-ayah") || d.querySelector('input[aria-label*="Āyah"], input[aria-label*="Ayah"], #tj-bridge-ayah');
  }

  function maxAyah(s) {
    return AYAH_COUNT[s] || AYAH_COUNT[String(s)] || 1;
  }

  function syncFromBridge() {
    var bs = $("tj-bridge-surah");
    var ba = $("tj-bridge-ayah");
    if (!bs) return;
    var s = parseInt(bs.value, 10) || 1;
    var max = maxAyah(s);
    if (ba) {
      ba.max = max;
      var v = parseInt(ba.value, 10) || 1;
      if (v > max) ba.value = "1";
    }
    var lab = $("tj-bridge-ayah-max");
    if (lab) lab.textContent = "of " + max;

    /* push into original LMR fields if present */
    var os = findSurahSelect();
    var oa = findAyahInput();
    if (os && os !== bs) {
      os.value = String(s);
      try { os.dispatchEvent(new Event("change", { bubbles: true })); } catch (e3) {}
    }
    if (oa && oa !== ba && ba) {
      oa.value = ba.value;
      try { oa.dispatchEvent(new Event("change", { bubbles: true })); } catch (e4) {}
    }
    try {
      if (w.state) {
        w.state.surah = s;
        w.state.ayah = ba ? parseInt(ba.value, 10) || 1 : 1;
      }
    } catch (e5) {}
    var link = d.querySelector("#tj-lmr-quran-link, a[href*='quran.com']");
    if (link && ba) link.href = "https://quran.com/" + s + ":" + ba.value;
  }

  function stepAyah(delta) {
    var ba = $("tj-bridge-ayah");
    var bs = $("tj-bridge-surah");
    if (!ba || !bs) return;
    var s = parseInt(bs.value, 10) || 1;
    var max = maxAyah(s);
    var n = (parseInt(ba.value, 10) || 1) + delta;
    n = Math.max(1, Math.min(max, n));
    ba.value = String(n);
    syncFromBridge();
  }

  /** Enrich original surah select to full 114 if short */
  function enrichOriginalSurahSelect() {
    var os = d.querySelector("#tj-lmr-surah, select.tj-lmr-surah");
    if (!os || os.options.length >= 100) return;
    var cur = os.value;
    var html = '';
    Object.keys(AYAH_COUNT).forEach(function (n) {
      html += '<option value="' + n + '">' + n + '</option>';
    });
    /* keep if already named options — only expand count */
  }

  function logFromScoreText(text) {
    if (!text) return;
    var m = String(text).match(/(\d+)\s*\/\s*100/);
    if (!m) m = String(text).match(/score\s*(\d+)/i);
    if (!m) return;
    var score = parseInt(m[1], 10);
    var ref = String(text).match(/(\d+)\s*:\s*(\d+)/) || String(text).match(/Qur['']?an\s+(\d+):(\d+)/i);
    var surah = ref ? parseInt(ref[1], 10) : (parseInt(($("tj-bridge-surah") || {}).value, 10) || 1);
    var ayah = ref ? parseInt(ref[2], 10) : (parseInt(($("tj-bridge-ayah") || {}).value, 10) || 1);
    var rows = loadJournal();
    var last = rows[0];
    if (last && last.surah === surah && last.ayah === ayah && Math.abs((last.t || 0) - Date.now()) < 4000) return;
    rows.unshift({ t: Date.now(), surah: surah, ayah: ayah, score: score, note: "from LMR session" });
    saveJournal(rows);
    renderJournal();
    feedCurriculum(score);
  }

  function feedCurriculum(score) {
    try {
      var p = JSON.parse(localStorage.getItem("clarity_tajweed_curriculum_v2") || "{}") || {};
      p.phases = p.phases || {};
      var id = p.levelId || "L0";
      p.phases[id] = p.phases[id] || { drills: 0, listens: 0, marks: 0, lastScore: 0, bestScore: 0, history: [] };
      p.phases[id].lastScore = score;
      p.phases[id].bestScore = Math.max(p.phases[id].bestScore || 0, score);
      p.phases[id].drills = (p.phases[id].drills || 0) + 1;
      localStorage.setItem("clarity_tajweed_curriculum_v2", JSON.stringify(p));
      if (w.ClarityTajweedCurriculum && w.ClarityTajweedCurriculum.refreshAnalysis) {
        w.ClarityTajweedCurriculum.refreshAnalysis();
      }
    } catch (e6) {}
  }

  function renderJournal() {
    var host = $("tj-practice-journal");
    if (!host) return;
    var rows = loadJournal();
    if (!rows.length) {
      host.innerHTML = '<p class="tj-muted">Scores from the studio session log appear here as well.</p>';
      return;
    }
    host.innerHTML =
      '<table class="tj-journal-table"><thead><tr><th>When</th><th>Ref</th><th>Score</th></tr></thead><tbody>' +
      rows.slice(0, 30).map(function (r) {
        return "<tr><td>" + new Date(r.t).toLocaleString() + "</td><td>" + r.surah + ":" + r.ayah +
          "</td><td><strong>" + r.score + "</strong></td></tr>";
      }).join("") +
      "</tbody></table>";
  }

  function observeScores() {
    var targets = [
      $("tj-lmr-score"),
      d.querySelector("#practice-log-list"),
      d.querySelector(".session-log"),
      d.body
    ].filter(Boolean);
    var obs = new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        var t = (m.target && m.target.textContent) || "";
        if (/\d+\s*\/\s*100/.test(t) || /score\s*\d+/i.test(t)) logFromScoreText(t);
      });
    });
    targets.forEach(function (el) {
      try { obs.observe(el, { childList: true, subtree: true, characterData: true }); } catch (e7) {}
    });
  }

  /** Hide duplicate Record/Play blocks we may have left; never hide #tj-lmr-host original */
  function hideOurDuplicates() {
    $$("[data-tj-duplicate='1']").forEach(function (el) {
      el.hidden = true;
      el.style.display = "none";
    });
  }

  function wireBridge() {
    var bs = $("tj-bridge-surah");
    var ba = $("tj-bridge-ayah");
    if (bs && !bs.__br) {
      bs.__br = true;
      bs.addEventListener("change", syncFromBridge);
    }
    if (ba && !ba.__br) {
      ba.__br = true;
      ba.addEventListener("change", syncFromBridge);
    }
    var prev = $("tj-bridge-prev");
    var next = $("tj-bridge-next");
    if (prev && !prev.__br) {
      prev.__br = true;
      prev.addEventListener("click", function () { stepAyah(-1); });
    }
    if (next && !next.__br) {
      next.__br = true;
      next.addEventListener("click", function () { stepAyah(1); });
    }
    var pull = $("tj-bridge-pull");
    if (pull && !pull.__br) {
      pull.__br = true;
      pull.addEventListener("click", function () {
        syncFromBridge();
        var btn = $("tj-lmr-fetch") || d.querySelector('button[id*="fetch"], button[id*="pull"]');
        if (btn) btn.click();
        else if (typeof w.playMaster === "function") w.playMaster();
      });
    }
    syncFromBridge();
    renderJournal();
    observeScores();
    hideOurDuplicates();
  }

  function boot() {
    wireBridge();
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", boot);
  setTimeout(boot, 800);
  setTimeout(boot, 2000);
})(window, document);
