/*! craft-tajweed-bridge-v2 · real sessions only · export/reset · educational only — not a fatwa */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_TJ_BRIDGE_V2__) return;
  w.__CRAFT_TJ_BRIDGE_V2__ = true;

  var JOURNAL_KEY = "clarity_tajweed_practice_journal_v1";
  var CUR_KEY = "clarity_tajweed_curriculum_v2";
  var SESSION_FINGERPRINT = "clarity_tj_session_fp_v1";

  function $(id) { return d.getElementById(id); }

  function loadJournal() {
    try { return JSON.parse(localStorage.getItem(JOURNAL_KEY) || "[]") || []; }
    catch (e) { return []; }
  }
  function saveJournal(rows) {
    try { localStorage.setItem(JOURNAL_KEY, JSON.stringify(rows.slice(0, 200))); } catch (e2) {}
  }

  /** Only accept explicit user-triggered log entries */
  function commitPractice(entry) {
    if (!entry || !entry.surah || !entry.ayah) return false;
    entry.t = entry.t || Date.now();
    entry.score = typeof entry.score === "number" ? entry.score : 0;
    entry.source = entry.source || "user";
    /* de-dupe identical ref+score within 15s */
    var rows = loadJournal();
    var last = rows[0];
    if (
      last &&
      last.surah === entry.surah &&
      last.ayah === entry.ayah &&
      last.score === entry.score &&
      Math.abs((last.t || 0) - entry.t) < 15000
    ) {
      return false;
    }
    rows.unshift(entry);
    saveJournal(rows);
    renderJournal();
    return true;
  }

  function feedCurriculumOnce(score, levelHint) {
    try {
      var p = JSON.parse(localStorage.getItem(CUR_KEY) || "{}") || {};
      p.phases = p.phases || {};
      var id = levelHint || p.levelId || "L0";
      p.phases[id] = p.phases[id] || {
        drills: 0, listens: 0, marks: 0, lastScore: 0, bestScore: 0, history: []
      };
      var ph = p.phases[id];
      /* only bump drills when real score commit */
      ph.lastScore = score;
      ph.bestScore = Math.max(ph.bestScore || 0, score || 0);
      ph.drills = (ph.drills || 0) + 1;
      ph.history = (ph.history || []).slice(0, 40);
      ph.history.unshift({ t: Date.now(), score: score });
      localStorage.setItem(CUR_KEY, JSON.stringify(p));
      if (w.ClarityTajweedCurriculum && w.ClarityTajweedCurriculum.refreshAnalysis) {
        w.ClarityTajweedCurriculum.refreshAnalysis();
      }
    } catch (e3) {}
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
      '<table class="tj-journal-table"><thead><tr><th>When</th><th>Ref</th><th>Score</th><th>Source</th></tr></thead><tbody>' +
      rows.slice(0, 40).map(function (r) {
        return (
          "<tr><td>" +
          new Date(r.t).toLocaleString() +
          "</td><td>" +
          r.surah +
          ":" +
          r.ayah +
          "</td><td><strong>" +
          r.score +
          "</strong></td><td>" +
          (r.source || "") +
          "</td></tr>"
        );
      }).join("") +
      "</tbody></table>";
  }

  /**
   * Parse original session log ONLY when user clicks "Import session log once"
   * — never on page load / MutationObserver.
   */
  function importSessionLogOnce() {
    var list = $("practice-log-list") || d.querySelector("#practice-log-list, .session-log");
    if (!list) {
      setStatus("No session log host found");
      return;
    }
    var text = list.textContent || "";
    var re = /(\d+)\s*\/\s*100[^\n]*?Qur['']?an\s+(\d+)\s*:\s*(\d+)/gi;
    var m, n = 0;
    var seen = {};
    while ((m = re.exec(text))) {
      var score = parseInt(m[1], 10);
      var surah = parseInt(m[2], 10);
      var ayah = parseInt(m[3], 10);
      var key = surah + ":" + ayah + ":" + score;
      if (seen[key]) continue;
      seen[key] = 1;
      if (commitPractice({ surah: surah, ayah: ayah, score: score, source: "session-import" })) n++;
    }
    setStatus(n ? ("Imported " + n + " unique session rows") : "No new rows to import");
  }

  function setStatus(msg) {
    var el = $("tj-bridge-status");
    if (el) el.textContent = msg;
  }

  function exportAll() {
    var payload = {
      exportedAt: new Date().toISOString(),
      educationalOnly: true,
      notIjazah: true,
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
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 500);
    setStatus("Downloaded progress JSON on this device");
  }

  function resetAll() {
    if (!w.confirm("Reset Tajweed practice journal and curriculum meters on this device? Download a backup first if needed.")) {
      return;
    }
    try {
      localStorage.removeItem(JOURNAL_KEY);
      localStorage.removeItem(CUR_KEY);
      localStorage.removeItem(SESSION_FINGERPRINT);
    } catch (e4) {}
    renderJournal();
    if (w.ClarityTajweedCurriculum && w.ClarityTajweedCurriculum.refreshAnalysis) {
      try { w.ClarityTajweedCurriculum.refreshAnalysis(); } catch (e5) {}
    }
    /* clear visible session log list if present */
    var list = $("practice-log-list");
    if (list) list.innerHTML = "";
    setStatus("Reset complete on this device");
  }

  /* Surah bridge */
  var AYAH_COUNT = null;
  try {
    /* filled below via attribute on select options length */
  } catch (e6) {}

  function maxFromSelect() {
    var bs = $("tj-bridge-surah");
    if (!bs) return 7;
    var opt = bs.options[bs.selectedIndex];
    /* parse from known map on data-ayah if present */
    var da = opt && opt.getAttribute("data-ayah");
    if (da) return parseInt(da, 10) || 7;
    return 286;
  }

  function syncBridge() {
    var bs = $("tj-bridge-surah");
    var ba = $("tj-bridge-ayah");
    if (!bs || !ba) return;
    var max = maxFromSelect();
    ba.max = max;
    if (parseInt(ba.value, 10) > max) ba.value = "1";
    var lab = $("tj-bridge-ayah-max");
    if (lab) lab.textContent = "of " + max;
    var os = $("tj-lmr-surah") || d.querySelector("select#tj-lmr-surah");
    var oa = $("tj-lmr-ayah") || d.querySelector("input#tj-lmr-ayah");
    if (os) {
      os.value = bs.value;
      try { os.dispatchEvent(new Event("change", { bubbles: true })); } catch (e7) {}
    }
    if (oa) {
      oa.value = ba.value;
      try { oa.dispatchEvent(new Event("change", { bubbles: true })); } catch (e8) {}
    }
  }

  function wire() {
    renderJournal(); /* display only — does NOT append */
    var bs = $("tj-bridge-surah");
    var ba = $("tj-bridge-ayah");
    if (bs && !bs.__v2) {
      bs.__v2 = true;
      bs.addEventListener("change", syncBridge);
    }
    if (ba && !ba.__v2) {
      ba.__v2 = true;
      ba.addEventListener("change", syncBridge);
    }
    var prev = $("tj-bridge-prev");
    var next = $("tj-bridge-next");
    if (prev && !prev.__v2) {
      prev.__v2 = true;
      prev.addEventListener("click", function () {
        if (!ba) return;
        ba.value = String(Math.max(1, (parseInt(ba.value, 10) || 1) - 1));
        syncBridge();
      });
    }
    if (next && !next.__v2) {
      next.__v2 = true;
      next.addEventListener("click", function () {
        if (!ba) return;
        var max = maxFromSelect();
        ba.value = String(Math.min(max, (parseInt(ba.value, 10) || 1) + 1));
        syncBridge();
      });
    }
    var pull = $("tj-bridge-pull");
    if (pull && !pull.__v2) {
      pull.__v2 = true;
      pull.addEventListener("click", function () {
        syncBridge();
        var btn = $("tj-lmr-fetch") || d.querySelector("button#tj-lmr-fetch");
        if (btn) btn.click();
        setStatus("Pulled into studio");
      });
    }

    var exp = $("tj-progress-export");
    if (exp && !exp.__v2) {
      exp.__v2 = true;
      exp.addEventListener("click", exportAll);
    }
    var rst = $("tj-progress-reset");
    if (rst && !rst.__v2) {
      rst.__v2 = true;
      rst.addEventListener("click", resetAll);
    }
    var imp = $("tj-import-session");
    if (imp && !imp.__v2) {
      imp.__v2 = true;
      imp.addEventListener("click", importSessionLogOnce);
    }

    /**
     * Hook original score UI only on explicit record completion:
     * listen for clicks on stop/score buttons, then read score after short delay.
     */
    d.addEventListener(
      "click",
      function (ev) {
        var t = ev.target && ev.target.closest && ev.target.closest("button, [role='button']");
        if (!t) return;
        var label = ((t.textContent || "") + " " + (t.id || "")).toLowerCase();
        if (!/(stop|score|record)/.test(label)) return;
        if (/start\s*meter|stop\s*$/.test(label) && /meter/.test(label)) return;
        /* after original handler updates DOM */
        setTimeout(function () {
          var scoreEl =
            $("tj-lmr-score") ||
            d.querySelector("[data-tj-score], .tj-lmr-score");
          var text = (scoreEl && scoreEl.textContent) || "";
          var list = $("practice-log-list");
          if (list && list.firstChild) {
            text = (list.firstChild.textContent || text) + " " + text;
          }
          var m = text.match(/(\d+)\s*\/\s*100/);
          if (!m) return;
          var score = parseInt(m[1], 10);
          var ref = text.match(/(\d+)\s*:\s*(\d+)/) || text.match(/Qur['']?an\s+(\d+)\s*:\s*(\d+)/i);
          var surah = ref
            ? parseInt(ref[1], 10)
            : parseInt((bs && bs.value) || "1", 10);
          var ayah = ref
            ? parseInt(ref[2], 10)
            : parseInt((ba && ba.value) || "1", 10);
          if (commitPractice({ surah: surah, ayah: ayah, score: score, source: "lmr-record" })) {
            feedCurriculumOnce(score);
            setStatus("Logged real session " + surah + ":" + ayah + " · " + score);
          }
        }, 600);
      },
      true
    );

    syncBridge();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", wire);
  else wire();
  w.addEventListener("load", wire);
  setTimeout(wire, 900);

  w.ClarityTajweedBridge = {
    exportAll: exportAll,
    resetAll: resetAll,
    commitPractice: commitPractice,
    journal: loadJournal
  };
})(window, document);
