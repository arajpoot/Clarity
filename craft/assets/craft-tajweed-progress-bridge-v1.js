/*! craft-tajweed-progress-bridge-v2 · journal→curriculum realtime · dedupe bars · 5-row journal
 * Educational only — not a fatwa · not a qāriʾ verdict · learn with a qualified teacher
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_TJ_PROGRESS_BRIDGE_V2__) return;
  w.__CRAFT_TJ_PROGRESS_BRIDGE_V2__ = true;

  var JOURNAL_KEY = "clarity_tajweed_practice_journal_v1";
  var CUR_KEY = "clarity_tajweed_curriculum_v2";
  var MAX_VISIBLE = 5;
  var LEVEL_ORDER = ["L0","L1","L2","L3","L4","L5","L6"];
  var LEVEL_DRILLS = {"L0": [[1, 1]], "L1": [[1, 2], [112, 1], [112, 3]], "L2": [[113, 1], [114, 1]], "L3": [[1, 7], [36, 1]], "L4": [[2, 2], [1, 7]], "L5": [[105, 1], [108, 1]], "L6": [[67, 1], [36, 1]]};

  function $(id) { return d.getElementById(id); }

  function loadJournal() {
    try { return JSON.parse(localStorage.getItem(JOURNAL_KEY) || "[]") || []; }
    catch (e) { return []; }
  }
  function loadCur() {
    try { return JSON.parse(localStorage.getItem(CUR_KEY) || "{}") || {}; }
    catch (e) { return {}; }
  }
  function saveCur(p) {
    try { localStorage.setItem(CUR_KEY, JSON.stringify(p)); } catch (e) {}
  }

  function drillKey(s, a) { return String(s) + ":" + String(a); }

  function levelForRef(surah, ayah) {
    var ref = drillKey(surah, ayah);
    for (var i = 0; i < LEVEL_ORDER.length; i++) {
      var id = LEVEL_ORDER[i];
      var drills = LEVEL_DRILLS[id] || [];
      for (var j = 0; j < drills.length; j++) {
        if (drillKey(drills[j][0], drills[j][1]) === ref) return id;
      }
    }
    return null;
  }

  /** Phase score from real journal scores + light activity — primary = practice quality */
  function phaseScoreFromJournal(levelId, ph, rows) {
    var scores = [];
    rows.forEach(function (r) {
      if (!r || r.score == null || r.score <= 0) return;
      var lid = r.levelId || levelForRef(r.surah, r.ayah);
      if (lid === levelId) scores.push(Number(r.score) || 0);
    });
    var best = ph && ph.bestScore ? ph.bestScore : 0;
    var last = ph && ph.lastScore ? ph.lastScore : 0;
    if (scores.length) {
      best = Math.max(best, Math.max.apply(null, scores));
      last = scores[0];
      var avg = scores.reduce(function (a, b) { return a + b; }, 0) / scores.length;
      /* quality 70% · volume 20% · mark 10% */
      var quality = Math.round(avg * 0.5 + best * 0.5);
      var volume = Math.min(20, scores.length * 4);
      var mark = Math.min(10, (ph && ph.marks ? ph.marks : 0) * 10);
      return Math.min(100, Math.round(quality * 0.7 + volume + mark));
    }
    /* fallback legacy activity formula */
    if (!ph) return 0;
    var s = 0;
    s += Math.min(40, (ph.listens || 0) * 8);
    s += Math.min(30, (ph.drills || 0) * 10);
    s += Math.min(15, (ph.marks || 0) * 15);
    s += Math.min(15, Math.round((ph.bestScore || 0) * 0.15));
    return Math.min(100, s);
  }

  /** Rebuild all phase best/last from journal; refresh curriculum UI */
  function syncCurriculumFromJournal() {
    var rows = loadJournal();
    var p = loadCur();
    p.phases = p.phases || {};
    LEVEL_ORDER.forEach(function (id) {
      p.phases[id] = p.phases[id] || { drills: 0, listens: 0, marks: 0, lastScore: 0, bestScore: 0 };
      var scores = [];
      rows.forEach(function (r) {
        if (!r || !(r.score > 0)) return;
        var lid = r.levelId || levelForRef(r.surah, r.ayah) || (r.source === "alignment" || r.source === "score-vs-master" ? p.levelId : null);
        if (lid === id) scores.push(Number(r.score));
      });
      if (scores.length) {
        p.phases[id].bestScore = Math.max(p.phases[id].bestScore || 0, Math.max.apply(null, scores));
        p.phases[id].lastScore = scores[0];
        p.phases[id].drills = Math.max(p.phases[id].drills || 0, scores.length);
      }
      p.phases[id]._liveScore = phaseScoreFromJournal(id, p.phases[id], rows);
    });
    p.updated = Date.now();
    saveCur(p);

    /* Patch curriculum engine phaseScore if exposed */
    if (w.ClarityTajweedCurriculum) {
      try {
        w.ClarityTajweedCurriculum.phaseScore = function (id) {
          var pp = loadCur();
          return phaseScoreFromJournal(id, (pp.phases || {})[id], loadJournal());
        };
        if (typeof w.ClarityTajweedCurriculum.refreshAnalysis === "function") {
          w.ClarityTajweedCurriculum.refreshAnalysis();
        }
      } catch (e) {}
    }

    paintLivePath(p, rows);
    refreshFocusDrill(p);
    return p;
  }

  /** Dedupe: one path strip — radar + phase rows; hide duplicate overall + detail meter clone */
  function dedupeProgressUI() {
    /* hide secondary overall if phase bars exist */
    var bars = $("tj-path-phase-bars");
    var overall = d.querySelector(".tj-path-overall");
    if (bars && bars.children.length && overall) {
      overall.style.display = "none";
      overall.setAttribute("data-deduped", "1");
    }
    /* hide extra large phase meter under level detail when chip already shows % */
    d.querySelectorAll(".tj-phase-track-lg").forEach(function (el) {
      el.style.display = "none";
    });
  }

  function paintLivePath(p, rows) {
    dedupeProgressUI();
    rows = rows || loadJournal();
    p = p || loadCur();
    var host = $("tj-path-phase-bars");
    if (host) {
      host.innerHTML = LEVEL_ORDER.map(function (id) {
        var sc = phaseScoreFromJournal(id, (p.phases || {})[id], rows);
        return (
          '<div class="tj-phase-bar"><span class="tj-phase-id">' +
          id +
          '</span><div class="tj-phase-track"><i style="width:' +
          sc +
          '%"></i></div><span class="tj-phase-sc">' +
          sc +
          "%</span></div>"
        );
      }).join("");
    }
    /* chip labels */
    d.querySelectorAll(".tj-cur-chip[data-level]").forEach(function (btn) {
      var id = btn.getAttribute("data-level");
      var sc = phaseScoreFromJournal(id, (p.phases || {})[id], rows);
      var lab = btn.querySelector(".tj-chip-sc");
      if (lab) lab.textContent = sc + "%";
      else {
        var span = d.createElement("span");
        span.className = "tj-chip-sc";
        span.textContent = " " + sc + "%";
        btn.appendChild(span);
      }
    });
    /* single overall label in advice area only */
    var label = $("tj-path-overall-label");
    if (label) {
      var sum = 0;
      LEVEL_ORDER.forEach(function (id) {
        sum += phaseScoreFromJournal(id, (p.phases || {})[id], rows);
      });
      var overall = Math.round(sum / LEVEL_ORDER.length);
      label.textContent = "Path strength · " + overall + "% · live from journal";
    }
  }

  function renderJournalCollapsed() {
    var host = $("tj-practice-journal");
    if (!host) return;
    var rows = loadJournal();
    var total = rows.length;
    var expanded = host.getAttribute("data-expanded") === "1";
    var list = expanded ? rows.slice(0, 40) : rows.slice(0, MAX_VISIBLE);

    var html = '<div class="tj-j-head"><strong>Session log</strong> · ' + total +
      ' on this device · showing ' + list.length + (total > MAX_VISIBLE && !expanded ? " of " + total : "") +
      ' · educational only</div>';

    if (!total) {
      html += '<p class="panel-note">No scored sessions yet. Pull → Listen → Record → Stop → Score vs master.</p>';
      host.innerHTML = html;
      return;
    }

    html += '<ul class="tj-j-list">';
    list.forEach(function (r) {
      var when = r.t ? new Date(r.t).toLocaleString() : "";
      var ref = (r.surah || "?") + ":" + (r.ayah || "?");
      var sc = r.score != null ? r.score + "/100" : "—";
      var lvl = r.levelId ? " · " + r.levelId : "";
      html += '<li><span class="tj-j-score">' + sc + '</span><span class="tj-j-ref">' + ref +
        '</span><span class="tj-j-when">' + when + lvl + "</span></li>";
    });
    html += "</ul>";
    if (total > MAX_VISIBLE) {
      html += '<button type="button" class="btn tj-j-toggle" id="tj-j-toggle">' +
        (expanded ? "Show only 5 recent" : "Show more (" + Math.min(40, total) + ")") +
        "</button>";
    }
    host.innerHTML = html;
    var tog = $("tj-j-toggle");
    if (tog) {
      tog.addEventListener("click", function () {
        host.setAttribute("data-expanded", expanded ? "0" : "1");
        renderJournalCollapsed();
      });
    }
  }

  function bumpFromScore(score, meta) {
    meta = meta || {};
    score = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
    var p = loadCur();
    p.phases = p.phases || {};
    var id = meta.levelId || p.levelId || levelForRef(meta.surah, meta.ayah) || "L0";
    p.levelId = p.levelId || id;
    p.phases[id] = p.phases[id] || { drills: 0, listens: 0, marks: 0, lastScore: 0, bestScore: 0 };
    p.phases[id].lastScore = score;
    p.phases[id].bestScore = Math.max(p.phases[id].bestScore || 0, score);
    p.phases[id].drills = (p.phases[id].drills || 0) + 1;
    p.updated = Date.now();
    saveCur(p);
    syncCurriculumFromJournal();
    renderJournalCollapsed();
    try {
      w.dispatchEvent(new CustomEvent("clarity:tajweed:progress", { detail: { levelId: id, score: score } }));
    } catch (e) {}
  }

  function commitPractice(entry) {
    entry = entry || {};
    var rows = loadJournal();
    var levelId = entry.levelId || loadCur().levelId || levelForRef(entry.surah, entry.ayah) || "L0";
    var row = {
      t: entry.t || Date.now(),
      surah: entry.surah,
      ayah: entry.ayah,
      score: entry.score,
      source: entry.source || "bridge",
      levelId: levelId,
      timing: entry.timing,
      energy: entry.energy,
      length: entry.length
    };
    /* de-dupe identical within 8s */
    var last = rows[0];
    if (last && last.surah === row.surah && last.ayah === row.ayah && last.score === row.score &&
        Math.abs((last.t || 0) - row.t) < 8000) {
      renderJournalCollapsed();
      syncCurriculumFromJournal();
      return;
    }
    rows.unshift(row);
    try { localStorage.setItem(JOURNAL_KEY, JSON.stringify(rows.slice(0, 200))); } catch (e) {}
    bumpFromScore(row.score, row);
    if (w.ClarityTajweedFlow && w.ClarityTajweedFlow.refreshScoreStats) {
      try { w.ClarityTajweedFlow.refreshScoreStats(); } catch (e2) {}
    }
  }

  function refreshFocusDrill(p) {
    p = p || loadCur();
    var host = $("tj-focus-drill");
    if (!host) {
      var cur = $("tj-curriculum-root");
      if (!cur) return;
      host = d.createElement("div");
      host.id = "tj-focus-drill";
      cur.appendChild(host);
    }
    var rows = loadJournal();
    var weakest = "L0";
    var weakSc = 101;
    LEVEL_ORDER.forEach(function (id) {
      var sc = phaseScoreFromJournal(id, (p.phases || {})[id], rows);
      if (sc < weakSc) {
        weakSc = sc;
        weakest = id;
      }
    });
    var drills = LEVEL_DRILLS[weakest] || [[1, 1]];
    var d0 = drills[0];
    host.innerHTML =
      '<span class="tj-focus-badge">AUTO FOCUS</span>' +
      "<h3>Next: " + weakest + " · phase " + weakSc + "%</h3>" +
      '<p class="tj-focus-ref">Suggested drill ' + d0[0] + ":" + d0[1] +
      " — score feeds this level’s meter live from the journal.</p>" +
      '<button type="button" class="btn primary" id="tj-focus-pull">Pull focus verse into studio</button>';
    var btn = $("tj-focus-pull");
    if (btn) {
      btn.onclick = function () {
        var bs = $("tj-bridge-surah");
        var ba = $("tj-bridge-ayah");
        if (bs) bs.value = String(d0[0]);
        if (ba) ba.value = String(d0[1]);
        p.levelId = weakest;
        saveCur(p);
        if (w.ClarityTajweedIsolate && w.ClarityTajweedIsolate.bridgePull) {
          w.ClarityTajweedIsolate.bridgePull();
        } else if (w.ClarityTajweedBridge && w.ClarityTajweedBridge.pullIntoStudio) {
          w.ClarityTajweedBridge.pullIntoStudio();
        } else {
          var pull = $("tj-bridge-pull");
          if (pull) pull.click();
        }
        var lmr = $("section-lmr") || $("tj-lmr-host");
        if (lmr) lmr.scrollIntoView({ behavior: "smooth", block: "start" });
      };
    }
  }

  function injectCss() {
    if ($("tj-bridge-css-v2")) return;
    var s = d.createElement("style");
    s.id = "tj-bridge-css-v2";
    s.textContent = [
      ".tj-j-head{font-size:.85rem;margin:0 0 .4rem;opacity:.9}",
      ".tj-j-list{list-style:none;padding:0;margin:0}",
      ".tj-j-list li{display:flex;flex-wrap:wrap;gap:.35rem .65rem;padding:.4rem 0;border-bottom:1px solid rgba(212,180,90,.12);font-size:.82rem}",
      ".tj-j-score{font-weight:700;color:#e8d5a3;min-width:3.6rem}",
      ".tj-j-when{opacity:.7;font-size:.75rem}",
      ".tj-j-toggle{margin-top:.5rem}",
      "#tj-focus-drill{margin:1rem 0;border-radius:16px;border:1px solid rgba(212,180,90,.4);background:linear-gradient(160deg,rgba(30,125,94,.28),rgba(8,20,16,.4));padding:1rem 1.15rem}",
      ".tj-focus-badge{display:inline-block;font-size:.68rem;font-weight:700;letter-spacing:.05em;padding:.15rem .5rem;border-radius:6px;background:rgba(212,180,90,.28);color:#e8d5a3}",
      "#tj-focus-drill h3{margin:.4rem 0 .25rem;color:#e8d5a3;font-size:1.05rem}",
      ".tj-path-overall[data-deduped='1']{display:none!important}",
      ".tj-phase-track-lg{display:none!important}"
    ].join("");
    (d.head || d.documentElement).appendChild(s);
  }

  function hookScore() {
    if (w.ClarityTajweedScorePill) {
      w.ClarityTajweedScorePill.renderJournal = renderJournalCollapsed;
    }
    w.ClarityTajweedBridge = w.ClarityTajweedBridge || {};
    w.ClarityTajweedBridge.commitPractice = commitPractice;
    w.ClarityTajweedBridge.renderJournal = renderJournalCollapsed;
    w.ClarityTajweedBridge.bumpCurriculum = bumpFromScore;
    w.ClarityTajweedBridge.syncFromJournal = syncCurriculumFromJournal;
  }

  function onStorage(ev) {
    if (!ev || ev.key === JOURNAL_KEY || ev.key === CUR_KEY || !ev.key) {
      renderJournalCollapsed();
      syncCurriculumFromJournal();
    }
  }

  function boot() {
    injectCss();
    hookScore();
    renderJournalCollapsed();
    syncCurriculumFromJournal();
    dedupeProgressUI();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(boot, 400); setTimeout(boot, 1600); });
  w.addEventListener("storage", onStorage);
  w.addEventListener("clarity:tajweed:progress", function () {
    renderJournalCollapsed();
    syncCurriculumFromJournal();
  });
  setTimeout(boot, 900);

  /* after score-pill writes journal, periodic soft sync */
  setInterval(function () {
    renderJournalCollapsed();
    paintLivePath(loadCur(), loadJournal());
  }, 5000);
})(window, document);
