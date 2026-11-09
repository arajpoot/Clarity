/*! craft-tajweed-curriculum-v2 · full path progress · analysis · audio harden · educational only — not a fatwa */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_TAJWEED_CURRICULUM_V2__) return;
  w.__CRAFT_TAJWEED_CURRICULUM_V2__ = true;

  var STORAGE = "clarity_tajweed_curriculum_v2";
  var DEFAULT_VOL = 0.85;

  var CURRICULUM = [
    { id: "L0", title: "Orientation", minutes: 5, goals: ["Intention", "Posture", "One slow āyah"], rule: null,
      drills: [{ surah: 1, ayah: 1, tip: "Basmalah — clear, unhurried." }] },
    { id: "L1", title: "Makhārij", minutes: 12, goals: ["Throat", "Tongue", "Lips"], rule: "makharij",
      drills: [
        { surah: 1, ayah: 2, tip: "Al-ḥamdu — ḥāʾ from middle throat." },
        { surah: 112, ayah: 1, tip: "Qul huwa — qāf deep." },
        { surah: 112, ayah: 3, tip: "Lam yalid — clean lām." }
      ] },
    { id: "L2", title: "Ṣifāt", minutes: 12, goals: ["Hams/jahr", "Shiddah", "Qalqalah"], rule: "sifat",
      drills: [
        { surah: 113, ayah: 1, tip: "Qalqalah on qāf." },
        { surah: 114, ayah: 1, tip: "Light vs heavy in short sūrahs." }
      ] },
    { id: "L3", title: "Madd", minutes: 15, goals: ["Natural 2-count", "No over-stretch"], rule: "madd",
      drills: [
        { surah: 1, ayah: 7, tip: "Aṣ-ṣirāṭ — controlled madd." },
        { surah: 36, ayah: 1, tip: "Yā-Sīn — measured." }
      ] },
    { id: "L4", title: "Nūn sākinah", minutes: 15, goals: ["Iẓhār", "Idghām", "Iqlāb", "Ikhfāʾ"], rule: "noon",
      drills: [
        { surah: 2, ayah: 2, tip: "Listen for nūn rules." },
        { surah: 1, ayah: 7, tip: "Junctions in 1:7." }
      ] },
    { id: "L5", title: "Mīm & ghunnah", minutes: 12, goals: ["Ikhfāʾ shafawī", "Ghunnah timing"], rule: "meem",
      drills: [
        { surah: 105, ayah: 1, tip: "Mīm junctions." },
        { surah: 108, ayah: 1, tip: "Inna aʿṭaynā." }
      ] },
    { id: "L6", title: "Integration", minutes: 15, goals: ["LMR full cycle", "One focused fix"], rule: null,
      drills: [
        { surah: 67, ayah: 1, tip: "Al-Mulk 1 — full cycle." },
        { surah: 36, ayah: 1, tip: "Yā-Sīn 1 — revisit." }
      ] }
  ];

  function $(id) { return d.getElementById(id); }

  function loadP() {
    try { return JSON.parse(localStorage.getItem(STORAGE) || "{}") || {}; }
    catch (e) { return {}; }
  }
  function saveP(p) {
    try { localStorage.setItem(STORAGE, JSON.stringify(p)); } catch (e2) {}
  }

  function ensurePhase(p, id) {
    p.phases = p.phases || {};
    if (!p.phases[id]) {
      p.phases[id] = { drills: 0, listens: 0, marks: 0, lastScore: 0, bestScore: 0, history: [] };
    }
    return p.phases[id];
  }

  /** Phase score 0–100 from activity */
  function phaseScore(ph) {
    if (!ph) return 0;
    var s = 0;
    s += Math.min(40, (ph.listens || 0) * 8);
    s += Math.min(30, (ph.drills || 0) * 10);
    s += Math.min(15, (ph.marks || 0) * 15);
    s += Math.min(15, Math.round((ph.bestScore || 0) * 0.15));
    return Math.min(100, s);
  }

  function overallScore(p) {
    var sum = 0;
    CURRICULUM.forEach(function (L) {
      sum += phaseScore(ensurePhase(p, L.id));
    });
    return Math.round(sum / CURRICULUM.length);
  }

  function masterCandidates(surah, ayah) {
    var s = String(surah).padStart(3, "0");
    var a = String(ayah).padStart(3, "0");
    return [
      "https://everyayah.com/data/Husary_128kbps/" + s + a + ".mp3",
      "https://everyayah.com/data/Alafasy_128kbps/" + s + a + ".mp3",
      "https://server8.mp3quran.net/husr/" + s + ".mp3"
    ];
  }

  function ensureMasterAudio() {
    var el = $("tj-lmr-master-audio");
    if (!el) {
      el = d.createElement("audio");
      el.id = "tj-lmr-master-audio";
      el.preload = "auto";
      el.controls = true;
      el.setAttribute("playsinline", "true");
      var host = $("tj-lmr-host") || $("tj-booth-root") || d.body;
      host.appendChild(el);
    }
    if (!el.__c5Hardened) {
      el.__c5Hardened = true;
      el.volume = DEFAULT_VOL;
      el.addEventListener("error", function () { tryAdvanceSource(el); });
      el.addEventListener("playing", function () { setStatus("Master playing"); });
    }
    return el;
  }

  function tryAdvanceSource(el) {
    var list = el.__srcList || [];
    var i = (el.__srcIndex || 0) + 1;
    if (i >= list.length) {
      setStatus("Master unavailable — try another āyah");
      return;
    }
    el.__srcIndex = i;
    el.src = list[i];
    el.load();
    el.play().catch(function () { tryAdvanceSource(el); });
  }

  function playMasterHardened(surah, ayah) {
    var el = ensureMasterAudio();
    var list = masterCandidates(surah, ayah);
    el.__srcList = list;
    el.__srcIndex = 0;
    el.src = list[0];
    el.load();
    return el.play().catch(function () { tryAdvanceSource(el); });
  }

  function setStatus(msg) {
    var s = $("tj-curriculum-status") || $("tj-lmr-rec-status");
    if (s) s.textContent = msg;
  }

  function patchPlayMaster() {
    w.playMaster = function () {
      var surah = 1, ayah = 1;
      try {
        if (w.state && w.state.surah) { surah = w.state.surah; ayah = w.state.ayah || 1; }
      } catch (e) {}
      var meta = $("tj-lmr-meta") || $("tj-lmr-meta-read");
      if (meta && meta.textContent) {
        var m = meta.textContent.match(/(\d+)\s*:\s*(\d+)/);
        if (m) { surah = +m[1]; ayah = +m[2]; }
      }
      var selS = $("tj-lmr-surah");
      var selA = $("tj-lmr-ayah");
      if (selS && selS.value) surah = +selS.value || surah;
      if (selA && selA.value) ayah = +selA.value || ayah;
      var el = ensureMasterAudio();
      var list = masterCandidates(surah, ayah);
      try { if (w.state && w.state.audioUrl) list.unshift(w.state.audioUrl); } catch (e2) {}
      el.__srcList = list;
      el.__srcIndex = 0;
      el.src = list[0];
      el.load();
      el.play().then(function () {
        setStatus("Master playing");
        var p = loadP();
        var id = p.levelId || "L0";
        var ph = ensurePhase(p, id);
        ph.listens = (ph.listens || 0) + 1;
        saveP(p);
        refreshAnalysis();
      }).catch(function () { tryAdvanceSource(el); });
    };
    ["tj-lmr-play-master", "tj-lmr-play-master2", "tj-lmr-play-master3"].forEach(function (id) {
      var btn = $(id);
      if (btn && !btn.__c5v2) {
        btn.__c5v2 = true;
        btn.disabled = false;
        btn.addEventListener("click", function (ev) {
          ev.preventDefault();
          w.playMaster();
        });
      }
    });
  }

  function radarSVG(p) {
    var n = CURRICULUM.length;
    var cx = 110, cy = 110, R = 80;
    var pts = [];
    var grid = "";
    for (var ring = 1; ring <= 4; ring++) {
      var rr = (R * ring) / 4;
      var g = [];
      for (var i = 0; i < n; i++) {
        var ang = -Math.PI / 2 + (i * 2 * Math.PI) / n;
        g.push((cx + rr * Math.cos(ang)).toFixed(1) + "," + (cy + rr * Math.sin(ang)).toFixed(1));
      }
      grid += '<polygon points="' + g.join(" ") + '" fill="none" stroke="rgba(212,180,90,0.2)" stroke-width="1"/>';
    }
    var labels = "";
    for (var j = 0; j < n; j++) {
      var L = CURRICULUM[j];
      var sc = phaseScore(ensurePhase(p, L.id));
      var ang2 = -Math.PI / 2 + (j * 2 * Math.PI) / n;
      var r = (R * sc) / 100;
      pts.push((cx + r * Math.cos(ang2)).toFixed(1) + "," + (cy + r * Math.sin(ang2)).toFixed(1));
      var lx = cx + (R + 18) * Math.cos(ang2);
      var ly = cy + (R + 18) * Math.sin(ang2);
      labels +=
        '<text x="' +
        lx.toFixed(1) +
        '" y="' +
        ly.toFixed(1) +
        '" text-anchor="middle" font-size="10" fill="#e8d5a3">' +
        L.id +
        "</text>";
    }
    return (
      '<svg viewBox="0 0 220 220" class="tj-radar" aria-label="Path progress radar">' +
      grid +
      '<polygon points="' +
      pts.join(" ") +
      '" fill="rgba(30,125,94,0.35)" stroke="#c9a84c" stroke-width="2"/>' +
      labels +
      "</svg>"
    );
  }

  function advice(p) {
    var weakest = null, weakScore = 101;
    CURRICULUM.forEach(function (L) {
      var sc = phaseScore(ensurePhase(p, L.id));
      if (sc < weakScore) { weakScore = sc; weakest = L; }
    });
    var overall = overallScore(p);
    var tips = [];
    if (overall < 20) tips.push("Start L0: one basmalah slowly with master audio.");
    else if (weakest) tips.push("Focus next: " + weakest.id + " · " + weakest.title + " (phase meter " + weakScore + "%).");
    if (overall >= 70) tips.push("Strong path coverage — still seek a teacher for correction.");
    tips.push("Meters are practice signals only — not a qāriʾ grade.");
    return tips;
  }

  function refreshAnalysis() {
    var p = loadP();
    var overall = overallScore(p);
    var fill = $("tj-path-overall-fill");
    var label = $("tj-path-overall-label");
    if (fill) fill.style.width = overall + "%";
    if (label) label.textContent = "Path strength · " + overall + "%";
    var radar = $("tj-path-radar");
    if (radar) radar.innerHTML = radarSVG(p);
    var bars = $("tj-path-phase-bars");
    if (bars) {
      bars.innerHTML = CURRICULUM.map(function (L) {
        var sc = phaseScore(ensurePhase(p, L.id));
        return (
          '<div class="tj-phase-bar"><span class="tj-phase-id">' +
          L.id +
          '</span><div class="tj-phase-track"><i style="width:' +
          sc +
          '%"></i></div><span class="tj-phase-sc">' +
          sc +
          "%</span></div>"
        );
      }).join("");
    }
    var adv = $("tj-path-advice");
    if (adv) {
      adv.innerHTML = advice(p)
        .map(function (t) { return "<li>" + t + "</li>"; })
        .join("");
    }
  }

  function mountCurriculum() {
    var host = $("tj-curriculum-root");
    if (!host) {
      host = d.createElement("section");
      host.id = "tj-curriculum-root";
      host.className = "tj-curriculum-plaque";
      var anchor = $("tj-deep-studio") || $("tj-lmr-host") || $("tj-booth-root") || d.querySelector("main") || d.body;
      anchor.appendChild(host);
    }
    if (host.getAttribute("data-v2")) {
      refreshAnalysis();
      return;
    }
    host.setAttribute("data-v2", "1");
    host.innerHTML =
      '<div class="tj-cur-head"><h3>Deep path · curriculum + progress</h3>' +
      '<p class="tj-cur-disc">Optional staged practice. Scores are on-device activity meters — educational only, not an ijāzah.</p>' +
      '<p id="tj-curriculum-status" class="tj-cur-status" role="status"></p></div>' +
      '<div class="tj-path-overall"><div class="tj-path-overall-track"><div id="tj-path-overall-fill"></div></div>' +
      '<span id="tj-path-overall-label">Path strength · 0%</span></div>' +
      '<div class="tj-path-analysis"><div id="tj-path-radar"></div>' +
      '<div><div id="tj-path-phase-bars"></div><ul id="tj-path-advice"></ul></div></div>' +
      '<div class="tj-cur-levels" id="tj-cur-levels"></div>' +
      '<div class="tj-cur-detail" id="tj-cur-detail"></div>';

    var levelsEl = $("tj-cur-levels");
    var detailEl = $("tj-cur-detail");

    function renderLevels() {
      var p = loadP();
      levelsEl.innerHTML = CURRICULUM.map(function (L) {
        var sc = phaseScore(ensurePhase(p, L.id));
        var active = L.id === (p.levelId || "L0");
        return (
          '<button type="button" class="tj-cur-chip' +
          (active ? " is-active" : "") +
          '" data-level="' +
          L.id +
          '">' +
          L.id +
          " · " +
          L.title +
          ' <span class="tj-chip-sc">' +
          sc +
          "%</span></button>"
        );
      }).join("");
      levelsEl.querySelectorAll("[data-level]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          openLevel(btn.getAttribute("data-level"));
        });
      });
      refreshAnalysis();
    }

    function openLevel(id) {
      var L = CURRICULUM.filter(function (x) { return x.id === id; })[0];
      if (!L) return;
      var p = loadP();
      p.levelId = id;
      saveP(p);
      renderLevels();
      var sc = phaseScore(ensurePhase(p, id));
      detailEl.innerHTML =
        "<h4>" + L.title + " · ~" + L.minutes + " min · phase meter " + sc + "%</h4>" +
        "<div class=\"tj-phase-track tj-phase-track-lg\"><i style=\"width:" + sc + '%"></i></div>' +
        "<ul>" + L.goals.map(function (g) { return "<li>" + g + "</li>"; }).join("") + "</ul>" +
        '<div class="tj-cur-drills">' +
        L.drills.map(function (dr, i) {
          return (
            '<button type="button" class="tj-cur-drill" data-di="' + i + '">▶ ' +
            dr.surah + ":" + dr.ayah + " — " + dr.tip + "</button>"
          );
        }).join("") +
        "</div>" +
        '<button type="button" class="tj-cur-complete" id="tj-cur-complete">Mark level practiced (+meter)</button>';

      detailEl.querySelectorAll(".tj-cur-drill").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var dr = L.drills[+btn.getAttribute("data-di")];
          if (!dr) return;
          playMasterHardened(dr.surah, dr.ayah);
          var p2 = loadP();
          var ph = ensurePhase(p2, id);
          ph.drills = (ph.drills || 0) + 1;
          ph.listens = (ph.listens || 0) + 1;
          saveP(p2);
          try {
            if (w.state) {
              w.state.surah = dr.surah;
              w.state.ayah = dr.ayah;
              w.state.audioUrl = masterCandidates(dr.surah, dr.ayah)[0];
            }
          } catch (e3) {}
          setStatus(dr.tip);
          openLevel(id);
        });
      });
      var doneBtn = $("tj-cur-complete");
      if (doneBtn) {
        doneBtn.onclick = function () {
          var p3 = loadP();
          var ph = ensurePhase(p3, id);
          ph.marks = (ph.marks || 0) + 1;
          ph.bestScore = Math.max(ph.bestScore || 0, 80);
          p3.completed = p3.completed || {};
          p3.completed[id] = Date.now();
          saveP(p3);
          openLevel(id);
          setStatus(id + " practice logged · path meters updated");
        };
      }
    }

    renderLevels();
    openLevel((loadP().levelId) || "L0");
  }

  function injectCss() {
    if ($("tj-curriculum-css-v2")) return;
    var s = d.createElement("style");
    s.id = "tj-curriculum-css-v2";
    s.textContent = [
      ".tj-curriculum-plaque{margin:1rem 0;padding:1rem 1.1rem;border-radius:16px;border:1px solid rgba(212,180,90,.35);background:rgba(15,76,58,.2)}",
      ".tj-cur-disc{font-size:.78rem;opacity:.9}",
      ".tj-path-overall{margin:.6rem 0}",
      ".tj-path-overall-track{height:12px;border-radius:999px;background:rgba(0,0,0,.3);overflow:hidden}",
      "#tj-path-overall-fill{height:100%;width:0;background:linear-gradient(90deg,#1e7d5e,#c9a227);transition:width .35s ease}",
      ".tj-path-analysis{display:grid;grid-template-columns:220px 1fr;gap:1rem;align-items:start;margin:.75rem 0}",
      "@media(max-width:700px){.tj-path-analysis{grid-template-columns:1fr}}",
      ".tj-radar{width:220px;height:220px;background:rgba(0,0,0,.2);border-radius:12px}",
      ".tj-phase-bar{display:grid;grid-template-columns:2.2rem 1fr 2.4rem;gap:.35rem;align-items:center;margin:.25rem 0;font-size:.78rem}",
      ".tj-phase-track{height:8px;border-radius:999px;background:rgba(0,0,0,.3);overflow:hidden}",
      ".tj-phase-track i{display:block;height:100%;background:linear-gradient(90deg,#1e7d5e,#c9a227)}",
      ".tj-phase-track-lg{height:10px;margin:.4rem 0 .6rem}",
      ".tj-cur-levels{display:flex;flex-wrap:wrap;gap:.4rem;margin:.6rem 0}",
      ".tj-cur-chip{border-radius:999px;border:1px solid rgba(212,180,90,.35);background:rgba(0,0,0,.28);color:inherit;padding:.35rem .75rem;font-size:.75rem;cursor:pointer}",
      ".tj-cur-chip.is-active{background:rgba(30,125,94,.5);font-weight:700}",
      ".tj-chip-sc{opacity:.85;margin-left:.25rem}",
      ".tj-cur-drill,.tj-cur-complete{display:block;width:100%;text-align:left;margin:.35rem 0;padding:.55rem .7rem;border-radius:12px;border:1px solid rgba(212,180,90,.28);background:rgba(0,0,0,.22);color:inherit;cursor:pointer}",
      ".tj-cur-complete{text-align:center;font-weight:700;background:rgba(30,125,94,.35)}",
      "#tj-path-advice{font-size:.8rem;margin:.5rem 0 0;padding-left:1.1rem}",
      "#tj-deep-studio{margin-top:1rem}"
    ].join("");
    (d.head || d.documentElement).appendChild(s);
  }

  function boot() {
    injectCss();
    patchPlayMaster();
    ensureMasterAudio();
    mountCurriculum();
    refreshAnalysis();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", boot);
  setTimeout(boot, 700);
  setTimeout(boot, 2000);

  w.ClarityTajweedCurriculum = {
    playMaster: playMasterHardened,
    levels: CURRICULUM,
    progress: loadP,
    phaseScore: function (id) { return phaseScore(ensurePhase(loadP(), id)); },
    overall: function () { return overallScore(loadP()); },
    refreshAnalysis: refreshAnalysis
  };
})(window, document);
