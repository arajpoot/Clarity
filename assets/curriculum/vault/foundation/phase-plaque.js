/* Clarity Phase Plaque + Quiz Gate v1
 * Single rail under banner explains phases.
 * Phase 1 (Junior) must finish all modules + quiz before Phase 2 unlocks.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_PHASE_PLAQUE_V1__) return;
  g.__CLARITY_PHASE_PLAQUE_V1__ = true;

  var PHASE_KEY = "clarity_curriculum_phase_v1";
  var QUIZ_PASS_KEY = "clarity_phase_quiz_pass_v1";

  var PHASES = [
    { id: 1, key: "seeker", label: "1 Junior", full: "Junior · Seeker foundations", short: "Modules in order → quiz" },
    { id: 2, key: "new_muslim", label: "2 New Muslim", full: "New Muslim · pillars & practice", short: "Locked until Phase 1 quiz" },
    { id: 3, key: "daily", label: "3 Daily", full: "Daily Muslim · consistency", short: "Locked until Phase 2" },
    { id: 4, key: "dai", label: "4 Da'i", full: "Aspiring Da'i · transmit light", short: "Locked until Phase 3" }
  ];

  /* Inline fallback if quiz bank fetch fails */
  var QUIZ_FALLBACK = {
    "1": [
      { q: "Shahada affirms belief in:", opts: ["Allah alone and Muhammad as His Messenger", "Culture only", "Any idol", "Travel alone"], a: 0 },
      { q: "Before salah when required, one performs:", opts: ["Wudu (ablution)", "A social media post", "A payment", "Silence only"], a: 0 },
      { q: "The five daily prayers are:", opts: ["A core practiced pillar of the religion", "Optional decoration", "Only for imams", "Replaced by intention alone"], a: 0 },
      { q: "The Qur'an is:", opts: ["The speech of Allah revealed to the Prophet", "A human poetry book only", "Replaced by dreams", "Optional for belief"], a: 0 },
      { q: "A Muslim turns for help first to:", opts: ["Allah", "Gossip circles", "Astrology", "Mockery of others"], a: 0 }
    ]
  };

  function getPhase() {
    try {
      return Math.max(1, Math.min(4, parseInt(localStorage.getItem(PHASE_KEY) || "1", 10) || 1));
    } catch (e) {
      return 1;
    }
  }
  function setPhase(n) {
    try {
      localStorage.setItem(PHASE_KEY, String(n));
    } catch (e) {}
  }
  function quizPassed(phase) {
    try {
      var o = JSON.parse(localStorage.getItem(QUIZ_PASS_KEY) || "{}") || {};
      return !!o[String(phase)];
    } catch (e) {
      return false;
    }
  }
  function setQuizPassed(phase) {
    try {
      var o = JSON.parse(localStorage.getItem(QUIZ_PASS_KEY) || "{}") || {};
      o[String(phase)] = true;
      localStorage.setItem(QUIZ_PASS_KEY, JSON.stringify(o));
    } catch (e) {}
  }

  function juniorStats() {
    var JC = g.ClarityJuniorCurriculum;
    if (!JC) return { done: 0, total: 11, all: false, active: 0 };
    return {
      done: JC.doneCount ? JC.doneCount() : 0,
      total: JC.totalLessons ? JC.totalLessons() : 11,
      all: JC.allComplete ? JC.allComplete() : false,
      active: JC.activeModuleIndex ? JC.activeModuleIndex() : 0
    };
  }

  function hideOtherRails() {
    var killers = [
      ".clarity-gate-switcher",
      "#clarity-path-module-strip",
      "#clarity-visit-pill-bar",
      ".clarity-visit-strip",
      ".cv-stitched-banner",
      ".clarity-daily-tools-strip",
      ".daily-path-tools",
      "#clarity-path-tools",
      ".path-tools-row",
      ".clarity-path-strip"
    ];
    killers.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (el.id === "clarity-phase-plaque-rail") return;
        el.style.setProperty("display", "none", "important");
        el.setAttribute("data-rail-suppressed", "1");
        el.setAttribute("aria-hidden", "true");
      });
    });
  }

  function ensurePlaque() {
    hideOtherRails();
    var rail = document.getElementById("clarity-phase-plaque-rail");
    if (rail) return rail;
    rail = document.createElement("div");
    rail.id = "clarity-phase-plaque-rail";
    rail.className = "clarity-phase-plaque-rail";
    rail.setAttribute("role", "region");
    rail.setAttribute("aria-label", "Curriculum phases");
    var duo = document.getElementById("clarity-top-duo");
    if (duo && duo.parentNode) {
      if (duo.nextSibling) duo.parentNode.insertBefore(rail, duo.nextSibling);
      else duo.parentNode.appendChild(rail);
    } else {
      document.body.insertBefore(rail, document.body.firstChild);
    }
    return rail;
  }

  function refreshPlaque() {
    var rail = ensurePlaque();
    var phase = getPhase();
    var st = juniorStats();
    var steps =
      '<div class="cpp-how">' +
      "<strong>How phases work</strong>" +
      "<ol>" +
      "<li><b>One module open</b> — only the current Junior lesson is unlocked.</li>" +
      "<li><b>Spark quiz</b> — answer correctly to open the next module.</li>" +
      "<li><b>All modules ✓</b> — then a short quiz appears.</li>" +
      "<li><b>Pass quiz</b> — unlocks the next phase (no skipping ahead).</li>" +
      "</ol></div>";

    var chips = PHASES.map(function (p) {
      var state = "locked";
      if (p.id < phase) state = "done";
      else if (p.id === phase) state = "active";
      var extra = "";
      if (p.id === 1) {
        extra = st.done + "/" + st.total;
      }
      return (
        '<button type="button" class="cpp-chip cpp-' +
        state +
        '" data-phase="' +
        p.id +
        '" title="' +
        p.full +
        '">' +
        '<span class="cpp-num">' +
        p.label +
        "</span>" +
        (extra ? '<span class="cpp-extra">' + extra + "</span>" : "") +
        (state === "locked" ? '<span class="cpp-lock">Locked</span>' : "") +
        (state === "active" ? '<span class="cpp-now">Now</span>' : "") +
        (state === "done" ? '<span class="cpp-ok">✓</span>' : "") +
        "</button>"
      );
    }).join("");

    var statusLine = "";
    if (phase === 1) {
      if (!st.all) {
        statusLine =
          "Phase 1 · Module " +
          Math.min(st.active + 1, st.total) +
          " of " +
          st.total +
          " — mark complete to continue. Later phases stay locked.";
      } else if (!quizPassed(1)) {
        statusLine = "All Junior modules complete — take the phase quiz to unlock Phase 2.";
      } else {
        statusLine = "Phase 1 quiz passed — Phase 2 is open.";
      }
    } else {
      statusLine = "You are on Phase " + phase + " · " + (PHASES[phase - 1] || {}).full;
    }

    rail.innerHTML =
      '<div class="cpp-inner">' +
      steps +
      '<div class="cpp-chips" role="list">' +
      chips +
      "</div>" +
      '<p class="cpp-status" id="cpp-status">' +
      statusLine +
      "</p>" +
      (st.all && phase === 1 && !quizPassed(1)
        ? '<button type="button" class="cpp-quiz-cta" id="cpp-quiz-cta">Open Phase 1 quiz</button>'
        : "") +
      "</div>";

    rail.querySelectorAll(".cpp-chip").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var want = parseInt(btn.getAttribute("data-phase"), 10) || 1;
        if (want > getPhase()) {
          alert("This phase is locked. Finish all modules in the current phase and pass the quiz first.");
          return;
        }
        if (want === 1) {
          try {
            if (typeof g.clarityOpenSectionDoor === "function") g.clarityOpenSectionDoor("reminder");
          } catch (e) {}
          var card = document.getElementById("junior-curriculum-card");
          if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
    var cta = document.getElementById("cpp-quiz-cta");
    if (cta) cta.onclick = function () { g.clarityOpenPhaseQuiz(1); };
  }

  g.clarityRefreshPhasePlaque = refreshPlaque;

  /* ---- Quiz modal ---- */
  function ensureModal() {
    var m = document.getElementById("clarity-phase-quiz-modal");
    if (m) return m;
    m = document.createElement("div");
    m.id = "clarity-phase-quiz-modal";
    m.className = "clarity-phase-quiz-modal";
    m.hidden = true;
    m.innerHTML =
      '<div class="cpq-backdrop" data-cpq-close="1"></div>' +
      '<div class="cpq-card" role="dialog" aria-modal="true" aria-labelledby="cpq-title">' +
      '<button type="button" class="cpq-x" data-cpq-close="1" aria-label="Close">×</button>' +
      '<h2 id="cpq-title">Phase quiz</h2>' +
      '<p class="cpq-lead">Educational check only — not a fatwa. Answer to unlock the next phase.</p>' +
      '<div id="cpq-body"></div>' +
      '<div class="cpq-actions">' +
      '<button type="button" class="cpq-submit" id="cpq-submit">Submit answers</button>' +
      "</div>" +
      '<p class="cpq-result" id="cpq-result" hidden></p>' +
      "</div>";
    document.body.appendChild(m);
    m.addEventListener("click", function (ev) {
      if (ev.target && ev.target.getAttribute("data-cpq-close")) closeQuiz();
    });
    return m;
  }

  function closeQuiz() {
    var m = document.getElementById("clarity-phase-quiz-modal");
    if (m) {
      m.hidden = true;
      m.classList.remove("show");
    }
  }

  function loadQuizQuestions(phase, cb) {
    var key = String(phase);
    fetch("./assets/curriculum/shared/path-quiz-bank.json")
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        var list = (data && data.transitions && data.transitions[key]) || QUIZ_FALLBACK[key] || [];
        cb(list);
      })
      .catch(function () {
        cb(QUIZ_FALLBACK[key] || []);
      });
  }

  g.clarityOpenPhaseQuiz = function (phase) {
    phase = phase || 1;
    if (phase === 1) {
      var JC = g.ClarityJuniorCurriculum;
      if (JC && JC.allComplete && !JC.allComplete()) {
        alert("Finish all Junior modules (mark each complete in order) before the phase quiz.");
        return;
      }
    }
    var m = ensureModal();
    var body = document.getElementById("cpq-body");
    var result = document.getElementById("cpq-result");
    var title = document.getElementById("cpq-title");
    if (title) title.textContent = "Phase " + phase + " quiz — unlock next phase";
    if (result) {
      result.hidden = true;
      result.textContent = "";
    }
    body.innerHTML = "<p>Loading questions…</p>";
    m.hidden = false;
    m.classList.add("show");

    loadQuizQuestions(phase, function (qs) {
      if (!qs.length) {
        body.innerHTML = "<p>No questions available.</p>";
        return;
      }
      var html = "";
      qs.forEach(function (item, i) {
        html += '<fieldset class="cpq-q" data-qi="' + i + '">';
        html += "<legend>" + (i + 1) + ". " + item.q + "</legend>";
        (item.opts || []).forEach(function (opt, oi) {
          var id = "cpq-" + i + "-" + oi;
          html +=
            '<label class="cpq-opt" for="' +
            id +
            '"><input type="radio" name="cpq-' +
            i +
            '" id="' +
            id +
            '" value="' +
            oi +
            '"/> ' +
            opt +
            "</label>";
        });
        html += "</fieldset>";
      });
      body.innerHTML = html;
      body.dataset.phase = String(phase);
      body._qs = qs;

      var sub = document.getElementById("cpq-submit");
      if (sub) {
        sub.onclick = function () {
          var correct = 0;
          qs.forEach(function (item, i) {
            var picked = body.querySelector('input[name="cpq-' + i + '"]:checked');
            if (picked && parseInt(picked.value, 10) === item.a) correct++;
          });
          var need = Math.ceil(qs.length * 0.6);
          var pass = correct >= need;
          result.hidden = false;
          if (typeof g.clarityRecordUniversityScore === "function") {
            g.clarityRecordUniversityScore({
              phase: phase,
              moduleId: "phase-quiz-" + phase,
              kind: "phase",
              correct: correct,
              total: qs.length
            });
          }
          if (pass) {
            result.textContent =
              "Passed (" + correct + "/" + qs.length + "). Phase " + (phase + 1) + " unlocked.";
            result.className = "cpq-result pass";
            setQuizPassed(phase);
            if (typeof g.clarityOnPhaseQuizPass === "function") {
              g.clarityOnPhaseQuizPass(phase);
            } else {
              setPhase(phase + 1);
              try {
                localStorage.setItem("clarity_path_focus", PHASES[phase] ? PHASES[phase].key : "new_muslim");
              } catch (e) {}
              try {
                g.dispatchEvent(new CustomEvent("clarity-path-changed", { detail: { phase: phase + 1 } }));
              } catch (e2) {}
              refreshPlaque();
            }
            setTimeout(closeQuiz, 1600);
          } else {
            result.textContent =
              "Not yet (" + correct + "/" + qs.length + "). Need " + need + "+ correct. Review modules and try again.";
            result.className = "cpq-result fail";
          }
        };
      }
    });
  };

  function boot() {
    hideOtherRails();
    refreshPlaque();
    setTimeout(function () {
      hideOtherRails();
      refreshPlaque();
    }, 400);
    setTimeout(hideOtherRails, 1500);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("load", function () {
    setTimeout(boot, 200);
  });
  g.addEventListener("clarity-junior-progress", function () {
    refreshPlaque();
  });
})(typeof window !== "undefined" ? window : this);


/* Controller bridge — chip clicks + quiz pass */
(function (g) {
  "use strict";
  var prevRefresh = g.clarityRefreshPhasePlaque;
  g.clarityRefreshPhasePlaque = function () {
    if (typeof prevRefresh === "function") prevRefresh();
    if (g.ClarityCurriculumController && g.ClarityCurriculumController.refreshPlaque) {
      try { g.ClarityCurriculumController.refreshPlaque(); } catch (e) {}
    }
  };
  document.addEventListener("click", function (ev) {
    var t = ev.target && ev.target.closest && ev.target.closest(".cpp-chip[data-phase]");
    if (!t) return;
    var want = parseInt(t.getAttribute("data-phase"), 10) || 1;
    if (g.ClarityCurriculumController && g.ClarityCurriculumController.goToPhase) {
      ev.preventDefault();
      ev.stopPropagation();
      g.ClarityCurriculumController.goToPhase(want);
    }
  }, true);
})(typeof window !== "undefined" ? window : this);
