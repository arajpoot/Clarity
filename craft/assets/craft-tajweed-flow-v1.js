/*! craft-tajweed-flow-v1 · curriculum → rules → LMR → journal · score · educational only */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_TJ_FLOW_V1__) return;
  w.__CRAFT_TJ_FLOW_V1__ = true;

  var RULES = [
    { id: "makharij", title: "Makhārij", ar: "مخارج", tip: "Exit points of letters — throat, tongue, lips, teeth." },
    { id: "izhar", title: "Iẓhār", ar: "إظهار", tip: "Clear nūn — no ghunnah merge." },
    { id: "ikhfa", title: "Ikhfāʾ", ar: "إخفاء", tip: "Conceal nūn with light ghunnah." },
    { id: "idgham", title: "Idghām", ar: "إدغام", tip: "Merge nūn into the next letter." },
    { id: "iqlab", title: "Iqlāb", ar: "إقلاب", tip: "Nūn before bāʾ becomes mīm sound." },
    { id: "qalqalah", title: "Qalqalah", ar: "قلقلة", tip: "Echo on ق ط ب ج د when sākin." },
    { id: "ghunnah", title: "Ghunnah", ar: "غُنّة", tip: "Nasal sound — timed, not rushed." },
    { id: "madd", title: "Madd", ar: "مدّ", tip: "Elongation — natural 2 counts unless ruled longer." },
    { id: "waqf", title: "Waqf", ar: "وقف", tip: "Stop rules — breathe with adab." }
  ];

  function $(id) { return d.getElementById(id); }

  function mountBooth() {
    var host = $("tj-booth-root");
    if (!host) return;
    if (host.getAttribute("data-flow-booth") === "1" && host.querySelector(".tj-rule-chip")) return;
    host.setAttribute("data-flow-booth", "1");
    host.innerHTML =
      '<p class="panel-note">Rule cards feed <strong>Rule mode</strong> in Listen · Match · Record below. Educational only.</p>' +
      '<div class="tj-rule-chip-grid">' +
      RULES.map(function (R) {
        return (
          '<button type="button" class="tj-rule-chip" data-rule="' +
          R.id +
          '"><span class="tj-rule-title">' +
          R.title +
          '</span><span class="tj-rule-ar">' +
          R.ar +
          '</span><span class="tj-rule-tip">' +
          R.tip +
          "</span></button>"
        );
      }).join("") +
      "</div>" +
      '<div class="tj-makharij-mini" aria-label="Makhārij">' +
      "<span>Throat ءهعحغخ</span><span>Tongue قكجشيلنر</span><span>Lips فبمو</span>" +
      "</div>";

    host.querySelectorAll(".tj-rule-chip").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-rule");
        /* switch LMR to rule mode if controls exist */
        var ruleBtn = $("tj-lmr-mode-rule") || d.querySelector("button[id*='mode-rule']");
        if (ruleBtn) ruleBtn.click();
        var sel = $("tj-lmr-rule") || d.querySelector("select#tj-lmr-rule");
        if (sel) {
          sel.value = id;
          try { sel.dispatchEvent(new Event("change", { bubbles: true })); } catch (e) {}
        }
        d.querySelectorAll("button").forEach(function (b) {
          if (/load\s*example|load\s*rule/i.test(b.textContent || "")) b.click();
        });
        var tip = RULES.filter(function (r) { return r.id === id; })[0];
        var st = $("tj-flow-status");
        if (st && tip) st.textContent = tip.title + " · " + tip.tip;
        /* scroll to LMR */
        var lmr = $("tj-lmr-host") || $("section-lmr");
        if (lmr) lmr.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  /** Score user recording duration vs master — explicit only */
  function scoreVsMaster(userBlob) {
    return new Promise(function (resolve) {
      var master = $("tj-lmr-master-audio");
      var md = master && master.duration && isFinite(master.duration) ? master.duration : 0;
      if (!userBlob) {
        resolve({ score: 0, note: "No recording" });
        return;
      }
      var url = URL.createObjectURL(userBlob);
      var a = new Audio(url);
      a.addEventListener("loadedmetadata", function () {
        var ud = a.duration || 0;
        var ratio = md > 0.15 ? Math.min(ud, md) / Math.max(ud, md) : 0.55;
        var score = Math.round(45 + ratio * 55);
        score = Math.max(0, Math.min(100, score));
        URL.revokeObjectURL(url);
        resolve({
          score: score,
          note: md
            ? "Duration match vs master (educational proxy — not a qāriʾ grade)"
            : "Baseline score — play master once before recording for better match"
        });
      });
      a.addEventListener("error", function () {
        URL.revokeObjectURL(url);
        resolve({ score: 40, note: "Could not analyse clip" });
      });
    });
  }

  var lastBlob = null;
  function wireScore() {
    d.addEventListener(
      "click",
      function (ev) {
        var t = ev.target && ev.target.closest && ev.target.closest("button");
        if (!t) return;
        var lab = ((t.textContent || "") + " " + (t.id || "")).toLowerCase();
        if (!/stop/.test(lab) || /meter|start/.test(lab)) return;
        setTimeout(function () {
          /* try capture from LMR state blob if any */
          var blob = lastBlob;
          try {
            if (w.state && w.state.userBlob) blob = w.state.userBlob;
          } catch (e) {}
          scoreVsMaster(blob).then(function (res) {
            var box = $("tj-score-result");
            if (!box) {
              box = d.createElement("div");
              box.id = "tj-score-result";
              box.className = "tj-score-plaque";
              var host = $("tj-lmr-host") || $("section-lmr");
              if (host) host.appendChild(box);
            }
            var surah = 1, ayah = 1;
            try {
              if (w.state && w.state.surah) {
                surah = w.state.surah;
                ayah = w.state.ayah || 1;
              }
            } catch (e2) {}
            box.innerHTML =
              "<strong>Score " +
              res.score +
              "/100</strong> · " +
              surah +
              ":" +
              ayah +
              "<br/><span class='tj-muted'>" +
              res.note +
              "</span>";
            /* journal */
            try {
              if (w.ClarityTajweedBridge && w.ClarityTajweedBridge.commitPractice) {
                w.ClarityTajweedBridge.commitPractice({
                  surah: surah,
                  ayah: ayah,
                  score: res.score,
                  source: "score-vs-master"
                });
              } else {
                var key = "clarity_tajweed_practice_journal_v1";
                var rows = JSON.parse(localStorage.getItem(key) || "[]");
                rows.unshift({ t: Date.now(), surah: surah, ayah: ayah, score: res.score, source: "score-vs-master" });
                localStorage.setItem(key, JSON.stringify(rows.slice(0, 200)));
              }
            } catch (e3) {}
            /* curriculum phase bump once */
            try {
              var CUR = "clarity_tajweed_curriculum_v2";
              var p = JSON.parse(localStorage.getItem(CUR) || "{}") || {};
              p.phases = p.phases || {};
              var id = p.levelId || "L0";
              p.phases[id] = p.phases[id] || { drills: 0, listens: 0, marks: 0, lastScore: 0, bestScore: 0 };
              p.phases[id].lastScore = res.score;
              p.phases[id].bestScore = Math.max(p.phases[id].bestScore || 0, res.score);
              p.phases[id].drills = (p.phases[id].drills || 0) + 1;
              localStorage.setItem(CUR, JSON.stringify(p));
              if (w.ClarityTajweedCurriculum && w.ClarityTajweedCurriculum.refreshAnalysis) {
                w.ClarityTajweedCurriculum.refreshAnalysis();
              }
            try { refreshScoreStats(); } catch (eStats) {}
            } catch (e4) {}
          });
        }, 500);
      },
      true
    );
  }

  function injectCss() {
    if ($("tj-flow-css")) return;
    var s = d.createElement("style");
    s.id = "tj-flow-css";
    s.textContent = [
      ".tj-rule-chip-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(9.5rem,1fr));gap:.5rem;margin:.6rem 0}",
      ".tj-rule-chip{text-align:left;border-radius:14px;border:1px solid rgba(212,180,90,.32);background:rgba(0,0,0,.28);color:inherit;padding:.65rem;cursor:pointer}",
      ".tj-rule-chip:hover{border-color:rgba(212,180,90,.6)}",
      ".tj-rule-title{display:block;font-weight:700}",
      ".tj-rule-ar{display:block;opacity:.85;font-size:.9rem}",
      ".tj-rule-tip{display:block;font-size:.72rem;opacity:.8;margin-top:.25rem}",
      ".tj-makharij-mini{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.5rem;font-size:.78rem}",
      ".tj-makharij-mini span{padding:.3rem .55rem;border-radius:999px;background:rgba(30,125,94,.25);border:1px solid rgba(212,180,90,.25)}",
      ".tj-score-plaque{margin:.75rem 0;padding:.75rem 1rem;border-radius:14px;border:1px solid rgba(212,180,90,.4);background:rgba(30,125,94,.25)}",
      ".tj-flow-steps{display:flex;flex-wrap:wrap;gap:.4rem;margin:.5rem 0 1rem}",
      ".tj-flow-step{font-size:.75rem;padding:.3rem .65rem;border-radius:999px;border:1px solid rgba(212,180,90,.3);opacity:.9}",
      ".tj-flow-step strong{color:#e8d5a3}"
    ].join("");
    (d.head || d.documentElement).appendChild(s);
  }

  function boot() {
    injectCss();
    mountBooth();
    wireScore();
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(mountBooth, 400); setTimeout(mountBooth, 1500); });
  setTimeout(boot, 600);

  function refreshScoreStats() {
    var key = "clarity_tajweed_practice_journal_v1";
    var rows = [];
    try { rows = JSON.parse(localStorage.getItem(key) || "[]") || []; } catch (e) {}
    var scores = rows.map(function (r) { return r.score || 0; }).filter(function (n) { return n > 0; });
    var set = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = v; };
    set("tj-stat-sessions", String(scores.length));
    if (!scores.length) {
      set("tj-stat-best", "—");
      set("tj-stat-avg", "—");
      set("tj-stat-last", "—");
      return;
    }
    var best = Math.max.apply(null, scores);
    var sum = scores.reduce(function (a, b) { return a + b; }, 0);
    set("tj-stat-best", best + "/100");
    set("tj-stat-avg", Math.round(sum / scores.length) + "/100");
    set("tj-stat-last", scores[0] + "/100");
  }
  w.ClarityTajweedFlow = w.ClarityTajweedFlow || {};
  w.ClarityTajweedFlow.refreshScoreStats = refreshScoreStats;
  setTimeout(refreshScoreStats, 400);
  setInterval(refreshScoreStats, 4000);

})(window, document);
