/*! craft-tajweed-progress-bridge-v1 · C19TJ1
 * Journal collapse (5 recent) · realtime curriculum ↔ score wiring · focus drill
 * Educational only — not a fatwa · not a qāriʾ verdict · learn with a qualified teacher
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_TJ_PROGRESS_BRIDGE_C19TJ1__) return;
  w.__CRAFT_TJ_PROGRESS_BRIDGE_C19TJ1__ = true;

  var JOURNAL_KEY = "clarity_tajweed_practice_journal_v1";
  var CUR_KEY = "clarity_tajweed_curriculum_v2";
  var MAX_VISIBLE = 5;

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

  /* ——— Journal: only 5 recent visible, expandable ——— */
  function renderJournalCollapsed() {
    var host = $("tj-practice-journal");
    if (!host) return;
    var rows = loadJournal();
    var total = rows.length;
    var show = rows.slice(0, MAX_VISIBLE);
    var expanded = host.getAttribute("data-expanded") === "1";

    var html = '<div class="tj-j-head"><strong>Session log</strong> · ' + total +
      ' on this device · educational only</div>';

    if (!total) {
      html += '<p class="panel-note">No scored sessions yet. Pull a verse → Listen → Record → Stop → Score vs master.</p>';
      host.innerHTML = html;
      return;
    }

    var list = expanded ? rows.slice(0, 40) : show;
    html += '<ul class="tj-j-list">';
    list.forEach(function (r) {
      var when = r.t ? new Date(r.t).toLocaleString() : "";
      var ref = (r.surah || "?") + ":" + (r.ayah || "?");
      var sc = r.score != null ? r.score + "/100" : "—";
      var src = r.source ? " · " + r.source : "";
      html += '<li><span class="tj-j-score">' + sc + '</span> <span class="tj-j-ref">' + ref +
        '</span> <span class="tj-j-when">' + when + '</span><span class="tj-j-src">' + src + '</span></li>';
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

  /* ——— Realtime curriculum bump from journal score ——— */
  function bumpCurriculumFromScore(score, meta) {
    score = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
    var p = loadCur();
    p.phases = p.phases || {};
    var id = p.levelId || "L0";
    p.phases[id] = p.phases[id] || { drills: 0, listens: 0, marks: 0, lastScore: 0, bestScore: 0 };
    p.phases[id].lastScore = score;
    p.phases[id].bestScore = Math.max(p.phases[id].bestScore || 0, score);
    p.phases[id].drills = (p.phases[id].drills || 0) + 1;
    if (meta && meta.listen) p.phases[id].listens = (p.phases[id].listens || 0) + 1;
    p.updated = Date.now();
    saveCur(p);

    if (w.ClarityTajweedCurriculum) {
      try {
        if (typeof w.ClarityTajweedCurriculum.refreshAnalysis === "function") {
          w.ClarityTajweedCurriculum.refreshAnalysis();
        }
      } catch (e) {}
    }
    refreshFocusDrill();
    try { w.dispatchEvent(new CustomEvent("clarity:tajweed:progress", { detail: { levelId: id, score: score } })); } catch (e2) {}
  }

  function commitPractice(entry) {
    entry = entry || {};
    var rows = loadJournal();
    rows.unshift({
      t: entry.t || Date.now(),
      surah: entry.surah,
      ayah: entry.ayah,
      score: entry.score,
      source: entry.source || "bridge",
      levelId: entry.levelId || (loadCur().levelId || "L0")
    });
    try { localStorage.setItem(JOURNAL_KEY, JSON.stringify(rows.slice(0, 200))); } catch (e) {}
    bumpCurriculumFromScore(entry.score, entry);
    renderJournalCollapsed();
    if (w.ClarityTajweedFlow && w.ClarityTajweedFlow.refreshScoreStats) {
      try { w.ClarityTajweedFlow.refreshScoreStats(); } catch (e3) {}
    }
  }

  /* Expose bridge used by flow/score scripts */
  w.ClarityTajweedBridge = w.ClarityTajweedBridge || {};
  w.ClarityTajweedBridge.commitPractice = commitPractice;
  w.ClarityTajweedBridge.renderJournal = renderJournalCollapsed;
  w.ClarityTajweedBridge.bumpCurriculum = bumpCurriculumFromScore;

  /* Patch existing score-pill renderJournal if present */
  function hookScorePill() {
    if (w.ClarityTajweedScorePill) {
      w.ClarityTajweedScorePill.renderJournal = renderJournalCollapsed;
    }
  }

  /* Observe journal host mutations from other scripts and re-collapse */
  function observeJournal() {
    var host = $("tj-practice-journal");
    if (!host || host.__bridgeObs) return;
    host.__bridgeObs = true;
    var t = null;
    var obs = new MutationObserver(function () {
      if (host.getAttribute("data-bridge-render") === "1") return;
      clearTimeout(t);
      t = setTimeout(function () {
        /* if another script dumped a long list, re-apply collapse */
        var lis = host.querySelectorAll("li");
        if (lis.length > MAX_VISIBLE && host.getAttribute("data-expanded") !== "1") {
          renderJournalCollapsed();
        }
      }, 80);
    });
    obs.observe(host, { childList: true, subtree: true });
  }

  /* ——— Surprise: Today's focus drill from weakest phase ——— */
  var LEVEL_DRILLS = {
    L0: { surah: 1, ayah: 1, tip: "Basmalah — clear, unhurried. Intention + posture." },
    L1: { surah: 112, ayah: 1, tip: "Qul huwa Allāhu aḥad — qāf deep, clean articulation." },
    L2: { surah: 113, ayah: 1, tip: "Qul aʿūdhu — qalqalah on qāf; light vs heavy." },
    L3: { surah: 1, ayah: 7, tip: "Aṣ-ṣirāṭ — controlled natural madd (2 counts)." },
    L4: { surah: 1, ayah: 7, tip: "Junctions in 1:7 — listen for nūn rules." },
    L5: { surah: 108, ayah: 1, tip: "Inna aʿṭaynā — ghunnah timing on mīm/nūn." },
    L6: { surah: 67, ayah: 1, tip: "Al-Mulk 1 — full LMR cycle, one focused fix." }
  };

  function weakestLevelId() {
    var p = loadCur();
    var phases = p.phases || {};
    var ids = ["L0", "L1", "L2", "L3", "L4", "L5", "L6"];
    var worst = ids[0], worstScore = 101;
    ids.forEach(function (id) {
      var ph = phases[id] || {};
      var sc = 0;
      if (ph.bestScore) sc = Math.min(100, ph.bestScore);
      else sc = Math.min(100, (ph.drills || 0) * 15 + (ph.listens || 0) * 5);
      if (sc < worstScore) { worstScore = sc; worst = id; }
    });
    return worst;
  }

  function refreshFocusDrill() {
    var box = $("tj-focus-drill");
    if (!box) return;
    var id = weakestLevelId();
    var drill = LEVEL_DRILLS[id] || LEVEL_DRILLS.L0;
    var titles = { L0: "Orientation", L1: "Makhārij", L2: "Ṣifāt", L3: "Madd", L4: "Nūn sākinah", L5: "Mīm & ghunnah", L6: "Integration" };
    box.innerHTML =
      '<div class="tj-focus-inner">' +
      '<span class="tj-focus-badge">TODAY\'S FOCUS</span>' +
      "<h3>" + id + " · " + (titles[id] || id) + "</h3>" +
      "<p>" + drill.tip + "</p>" +
      '<p class="tj-focus-ref">Suggested drill · ' + drill.surah + ":" + drill.ayah + "</p>" +
      '<button type="button" class="btn primary" id="tj-focus-pull">Pull ' + drill.surah + ":" + drill.ayah + " into studio</button>" +
      '<p class="panel-note">Educational path signal only — not an ijāzah. Practice with a teacher.</p>' +
      "</div>";
    var btn = $("tj-focus-pull");
    if (btn) {
      btn.addEventListener("click", function () {
        var s = $("tj-bridge-surah") || $("tj-lmr-surah");
        var a = $("tj-bridge-ayah") || $("tj-lmr-ayah");
        if (s) s.value = String(drill.surah);
        if (a) a.value = String(drill.ayah);
        var pull = $("tj-bridge-pull");
        if (pull) pull.click();
        else {
          var pull2 = d.querySelector("#tj-lmr-pull, [data-action='pull']");
          if (pull2) pull2.click();
        }
        var st = $("tj-flow-status");
        if (st) st.textContent = "Focus drill loaded · " + id + " · " + drill.surah + ":" + drill.ayah;
        try {
          var p = loadCur();
          p.levelId = id;
          saveCur(p);
          if (w.ClarityTajweedCurriculum && w.ClarityTajweedCurriculum.refreshAnalysis) {
            w.ClarityTajweedCurriculum.refreshAnalysis();
          }
        } catch (e) {}
      });
    }
  }

  function injectBridgeCss() {
    if ($("tj-bridge-css-c19tj1")) return;
    var s = d.createElement("style");
    s.id = "tj-bridge-css-c19tj1";
    s.textContent = [
      ".tj-j-head{font-size:.85rem;margin:0 0 .4rem;opacity:.9}",
      ".tj-j-list{list-style:none;padding:0;margin:0}",
      ".tj-j-list li{display:flex;flex-wrap:wrap;gap:.35rem .6rem;padding:.45rem 0;border-bottom:1px solid rgba(212,180,90,.12);font-size:.82rem}",
      ".tj-j-score{font-weight:700;color:#e8d5a3;min-width:3.5rem}",
      ".tj-j-ref{opacity:.9}",
      ".tj-j-when{opacity:.65;font-size:.75rem}",
      ".tj-j-src{opacity:.55;font-size:.72rem}",
      ".tj-j-toggle{margin-top:.55rem}",
      "#tj-focus-drill{margin:1rem 0;border-radius:16px;border:1px solid rgba(212,180,90,.4);background:linear-gradient(160deg,rgba(30,125,94,.28),rgba(8,20,16,.4));padding:1rem 1.15rem}",
      ".tj-focus-badge{display:inline-block;font-size:.68rem;font-weight:700;letter-spacing:.05em;padding:.15rem .5rem;border-radius:6px;background:rgba(212,180,90,.28);color:#e8d5a3}",
      "#tj-focus-drill h3{margin:.4rem 0 .25rem;color:#e8d5a3;font-size:1.05rem}",
      ".tj-focus-ref{font-size:.8rem;opacity:.8}",
      ".craft-hero-banner{position:relative;width:100%;max-height:220px;overflow:hidden;border-radius:0 0 18px 18px}",
      ".craft-hero-banner img{width:100%;height:220px;object-fit:cover;display:block}",
      ".craft-hero-banner .banner-credit{position:absolute;right:.75rem;bottom:.5rem;font-size:.68rem;opacity:.75;background:rgba(0,0,0,.35);padding:.15rem .45rem;border-radius:6px}",
      ".tj-flow-steps{display:flex;flex-wrap:wrap;gap:.4rem;margin:.75rem 0 0}",
      ".tj-flow-step{border-radius:999px;border:1px solid rgba(212,180,90,.35);padding:.3rem .75rem;font-size:.78rem;background:rgba(15,76,58,.25)}",
      ".tj-flow-step strong{color:#e8d5a3;margin-right:.25rem}",
      ".tj-charter-mini{border-radius:14px;border:1px solid rgba(212,180,90,.35);background:rgba(15,76,58,.18);padding:.85rem 1rem;margin:1rem 0;font-size:.85rem;line-height:1.45}",
      ".tj-charter-mini ol{margin:.35rem 0 0;padding-left:1.2rem}"
    ].join("");
    (d.head || d.documentElement).appendChild(s);
  }

  function boot() {
    injectBridgeCss();
    hookScorePill();
    renderJournalCollapsed();
    observeJournal();
    refreshFocusDrill();
    /* re-render after other scripts settle */
    setTimeout(function () { hookScorePill(); renderJournalCollapsed(); refreshFocusDrill(); }, 600);
    setTimeout(function () { renderJournalCollapsed(); }, 1800);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(boot, 300); });
})(window, document);
