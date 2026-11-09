/*! craft-tajweed-bridge-v3 · correct ayah maxima · studio sync · educational only */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_TJ_BRIDGE_V3__) return;
  w.__CRAFT_TJ_BRIDGE_V3__ = true;

  var AYAH_COUNT = {"1": 7, "2": 286, "3": 200, "4": 176, "5": 120, "6": 165, "7": 206, "8": 75, "9": 129, "10": 109, "11": 123, "12": 111, "13": 43, "14": 52, "15": 99, "16": 128, "17": 111, "18": 110, "19": 98, "20": 135, "21": 112, "22": 78, "23": 118, "24": 64, "25": 77, "26": 227, "27": 93, "28": 88, "29": 69, "30": 60, "31": 34, "32": 30, "33": 73, "34": 54, "35": 45, "36": 83, "37": 182, "38": 88, "39": 75, "40": 85, "41": 54, "42": 53, "43": 89, "44": 59, "45": 37, "46": 35, "47": 38, "48": 29, "49": 18, "50": 45, "51": 60, "52": 49, "53": 62, "54": 55, "55": 78, "56": 96, "57": 29, "58": 22, "59": 24, "60": 13, "61": 14, "62": 11, "63": 11, "64": 18, "65": 12, "66": 12, "67": 30, "68": 52, "69": 52, "70": 44, "71": 28, "72": 28, "73": 20, "74": 56, "75": 40, "76": 31, "77": 50, "78": 40, "79": 46, "80": 42, "81": 29, "82": 19, "83": 36, "84": 25, "85": 22, "86": 17, "87": 19, "88": 26, "89": 30, "90": 20, "91": 15, "92": 21, "93": 11, "94": 8, "95": 8, "96": 19, "97": 5, "98": 8, "99": 8, "100": 11, "101": 11, "102": 8, "103": 3, "104": 9, "105": 5, "106": 4, "107": 7, "108": 3, "109": 6, "110": 3, "111": 5, "112": 4, "113": 5, "114": 6};
  var JOURNAL_KEY = "clarity_tajweed_practice_journal_v1";
  var CUR_KEY = "clarity_tajweed_curriculum_v2";

  function $(id) { return d.getElementById(id); }

  function ayahMax(surah) {
    var k = String(parseInt(surah, 10) || 1);
    return AYAH_COUNT[k] || 1;
  }

  function loadJournal() {
    try { return JSON.parse(localStorage.getItem(JOURNAL_KEY) || "[]") || []; }
    catch (e) { return []; }
  }
  function saveJournal(rows) {
    try { localStorage.setItem(JOURNAL_KEY, JSON.stringify(rows.slice(0, 200))); } catch (e2) {}
  }

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
    var s = bridgeSurah();
    var max = ayahMax(s);
    if (!ba) return max;
    var v = parseInt(ba.value, 10) || 1;
    if (v < 1) v = 1;
    if (v > max) v = max;
    ba.value = String(v);
    ba.max = String(max);
    ba.setAttribute("max", String(max));
    var lab = $("tj-bridge-ayah-max");
    if (lab) lab.textContent = "of " + max;
    return max;
  }

  /** Push into original studio controls (various id patterns) */
  function findStudioSurah() {
    return (
      $("tj-lmr-surah") ||
      d.querySelector("#tj-lmr-host select") ||
      d.querySelector(".tj-lmr-toolbar select") ||
      d.querySelector('select[aria-label*="ūrāh"], select[aria-label*="Surah"], select[aria-label*="Sūrah"]')
    );
  }
  function findStudioAyah() {
    return (
      $("tj-lmr-ayah") ||
      d.querySelector("#tj-lmr-host input[type='number']") ||
      d.querySelector(".tj-lmr-toolbar input[type='number']") ||
      d.querySelector('input[aria-label*="yah"], input[aria-label*="Ayah"]')
    );
  }

  function setSelectValue(sel, value) {
    if (!sel) return false;
    var v = String(value);
    /* ensure option exists */
    var found = false;
    for (var i = 0; i < sel.options.length; i++) {
      if (String(sel.options[i].value) === v || String(sel.options[i].value).indexOf(v + ".") === 0) {
        sel.selectedIndex = i;
        found = true;
        break;
      }
      /* match "1 · Al-Fātiḥah" style by leading number */
      var m = String(sel.options[i].textContent || "").match(/^(\d+)/);
      if (m && m[1] === v) {
        sel.selectedIndex = i;
        found = true;
        break;
      }
    }
    if (!found && sel.options.length) {
      /* try value assign anyway */
      sel.value = v;
    }
    try {
      sel.dispatchEvent(new Event("input", { bubbles: true }));
      sel.dispatchEvent(new Event("change", { bubbles: true }));
    } catch (e3) {}
    return true;
  }

  function syncToStudio() {
    clampAyah();
    var s = bridgeSurah();
    var a = bridgeAyah();
    setSelectValue(findStudioSurah(), s);
    var oa = findStudioAyah();
    if (oa) {
      oa.value = String(a);
      oa.max = String(ayahMax(s));
      try {
        oa.dispatchEvent(new Event("input", { bubbles: true }));
        oa.dispatchEvent(new Event("change", { bubbles: true }));
      } catch (e4) {}
    }
    try {
      if (!w.state) w.state = {};
      w.state.surah = s;
      w.state.ayah = a;
      var ss = String(s).padStart(3, "0");
      var aa = String(a).padStart(3, "0");
      w.state.audioUrl = "https://everyayah.com/data/Husary_128kbps/" + ss + aa + ".mp3";
    } catch (e5) {}
    var link = d.querySelector("#tj-lmr-quran-link, a[href*='quran.com']");
    if (link) link.href = "https://quran.com/" + s + ":" + a;
    setStatus("Bridge · " + s + ":" + a + " (max " + ayahMax(s) + ")");
  }

  function pullIntoStudio() {
    syncToStudio();
    var selectors = [
      "#tj-lmr-fetch",
      "button#tj-lmr-fetch",
      "button[id*='fetch']",
      "button[id*='pull']"
    ];
    var clicked = false;
    for (var i = 0; i < selectors.length; i++) {
      var btn = d.querySelector(selectors[i]);
      if (btn && /pull|fetch|load/i.test(btn.textContent || btn.id || "")) {
        btn.click();
        clicked = true;
        break;
      }
    }
    if (!clicked) {
      /* click any green Pull āyah */
      d.querySelectorAll("button").forEach(function (b) {
        if (clicked) return;
        if (/pull\s*āyah|pull\s*ayah|fetch/i.test(b.textContent || "")) {
          b.click();
          clicked = true;
        }
      });
    }
    setStatus(clicked ? ("Pulled " + bridgeSurah() + ":" + bridgeAyah()) : ("Synced " + bridgeSurah() + ":" + bridgeAyah() + " — press Pull āyah in studio"));
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

  function commitPractice(entry) {
    if (!entry || !entry.surah) return false;
    entry.t = entry.t || Date.now();
    var rows = loadJournal();
    var last = rows[0];
    if (last && last.surah === entry.surah && last.ayah === entry.ayah && last.score === entry.score &&
        Math.abs((last.t || 0) - entry.t) < 15000) return false;
    rows.unshift(entry);
    saveJournal(rows);
    renderJournal();
    return true;
  }

  function exportAll() {
    var payload = {
      exportedAt: new Date().toISOString(),
      educationalOnly: true,
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
    setStatus("Downloaded progress JSON");
  }

  function resetAll() {
    if (!w.confirm("Reset journal and curriculum meters on this device?")) return;
    try {
      localStorage.removeItem(JOURNAL_KEY);
      localStorage.removeItem(CUR_KEY);
    } catch (e6) {}
    renderJournal();
    if (w.ClarityTajweedCurriculum && w.ClarityTajweedCurriculum.refreshAnalysis) {
      try { w.ClarityTajweedCurriculum.refreshAnalysis(); } catch (e7) {}
    }
    setStatus("Reset complete");
  }

  function wire() {
    var bs = $("tj-bridge-surah");
    var ba = $("tj-bridge-ayah");
    if (bs && !bs.__v3) {
      bs.__v3 = true;
      bs.addEventListener("change", function () {
        if (ba) ba.value = "1";
        clampAyah();
        syncToStudio();
      });
    }
    if (ba && !ba.__v3) {
      ba.__v3 = true;
      ba.addEventListener("change", function () {
        clampAyah();
        syncToStudio();
      });
    }
    var prev = $("tj-bridge-prev");
    var next = $("tj-bridge-next");
    if (prev && !prev.__v3) {
      prev.__v3 = true;
      prev.addEventListener("click", function () {
        if (!ba) return;
        ba.value = String(Math.max(1, bridgeAyah() - 1));
        clampAyah();
        syncToStudio();
      });
    }
    if (next && !next.__v3) {
      next.__v3 = true;
      next.addEventListener("click", function () {
        if (!ba) return;
        var max = ayahMax(bridgeSurah());
        ba.value = String(Math.min(max, bridgeAyah() + 1));
        clampAyah();
        syncToStudio();
      });
    }
    var pull = $("tj-bridge-pull");
    if (pull && !pull.__v3) {
      pull.__v3 = true;
      pull.addEventListener("click", pullIntoStudio);
    }
    var exp = $("tj-progress-export");
    if (exp && !exp.__v3) { exp.__v3 = true; exp.addEventListener("click", exportAll); }
    var rst = $("tj-progress-reset");
    if (rst && !rst.__v3) { rst.__v3 = true; rst.addEventListener("click", resetAll); }

    d.addEventListener("click", function (ev) {
      var t = ev.target && ev.target.closest && ev.target.closest("button");
      if (!t) return;
      var label = ((t.textContent || "") + t.id).toLowerCase();
      if (!/(stop|score)/.test(label) || /meter/.test(label)) return;
      setTimeout(function () {
        var list = $("practice-log-list");
        var text = (list && list.textContent) || "";
        var scoreEl = $("tj-lmr-score");
        if (scoreEl) text += " " + scoreEl.textContent;
        var m = text.match(/(\d+)\s*\/\s*100/);
        if (!m) return;
        var score = parseInt(m[1], 10);
        var ref = text.match(/(\d+)\s*:\s*(\d+)/);
        commitPractice({
          surah: ref ? parseInt(ref[1], 10) : bridgeSurah(),
          ayah: ref ? parseInt(ref[2], 10) : bridgeAyah(),
          score: score,
          source: "lmr-record"
        });
      }, 700);
    }, true);

    clampAyah();
    syncToStudio();
    renderJournal();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", wire);
  else wire();
  w.addEventListener("load", function () { setTimeout(wire, 400); });
  setTimeout(wire, 1200);

  w.ClarityTajweedBridge = {
    ayahMax: ayahMax,
    syncToStudio: syncToStudio,
    pullIntoStudio: pullIntoStudio,
    exportAll: exportAll,
    resetAll: resetAll
  };
})(window, document);
