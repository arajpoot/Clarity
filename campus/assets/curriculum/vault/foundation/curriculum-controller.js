/* Clarity Curriculum Controller v1 — central journey Junior → Da'i
 * Single source of truth for phase, card ordering, and seamless advance.
 * Educational only — not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_CURRICULUM_CONTROLLER_V1__) return;
  g.__CLARITY_CURRICULUM_CONTROLLER_V1__ = true;

  var PHASE_KEY = "clarity_curriculum_phase_v1";
  var QUIZ_PASS_KEY = "clarity_phase_quiz_pass_v1";

  /** Deep-learning card order per phase — beneficial sequencing inside tabs */
  var CARD_ORDER = {
    1: {
      /* Junior / Seeker — belief first, then character, then hereafter */
      "tab-reminder": [
        "junior-curriculum-card",
        "soul-compass-card",
        "commands-card",
        "samina-card",
        "samina-verse-card",
        "seerah-live-card",
        "creation-tongue-reflection",
        "grave-path-card",
        "night-breath-card",
        "hell-sins-card",
        "ilm-pathway-card",
        "about-clarity-card"
      ],
      "tab-reality": ["about-clarity-card"],
      "tab-reflection": ["soul-compass-card", "creation-tongue-reflection"],
      "tab-action": ["commands-card", "grave-path-card"]
    },
    2: {
      /* Junior High / New Muslim — purity → prayer → life */
      "tab-reminder": ["junior-high-curriculum-card", "soul-compass-card"],
      "tab-action": [
        "junior-high-curriculum-card",
        "new-muslim-foundations-card",
        "salah-starter-card",
        "fiqh-quiz-card",
        "tibbe-nabwi-card",
        "hajj-guide-card"
      ],
      "tab-reality": ["salah-starter-card", "fiqh-quiz-card"],
      "tab-reflection": ["new-muslim-foundations-card", "seerah-live-card"]
    },
    3: {
      /* Daily HS — craft & consistency */
      "tab-reality": [
        "daily-hs-curriculum-card",
        "tajweed-live-card",
        "weekly-review-card",
        "deepen-study-card",
        "callig-lab-card",
        "meme-card"
      ],
      "tab-reminder": ["daily-hs-curriculum-card", "commands-card", "asma"],
      "tab-reflection": ["deepen-study-card", "weekly-review-card"],
      "tab-action": ["tajweed-live-card", "callig-lab-card", "meme-card"]
    },
    4: {
      /* Da'i — method then media then legacy */
      "tab-action": [
        "dai-university-curriculum-card",
        "dai-transmit-card",
        "sealed-nectar-card",
        "israeliyat-card",
        "tajalliyat-lecture-card",
        "voice-translator-card"
      ],
      "tab-reminder": ["dai-university-curriculum-card", "seerah-live-card"],
      "tab-reflection": ["israeliyat-card", "sealed-nectar-card"],
      "tab-reality": ["dai-transmit-card", "voice-translator-card"]
    }
  };

  var PHASE_META = [
    { id: 1, key: "seeker", label: "1 Junior", full: "Junior · Seeker foundations", api: "ClarityJuniorCurriculum" },
    { id: 2, key: "new_muslim", label: "2 New Muslim", full: "Junior High · practice", api: "ClarityJuniorHighCurriculum" },
    { id: 3, key: "daily", label: "3 Daily", full: "High School · consistency", api: "ClarityDailyHsCurriculum" },
    { id: 4, key: "dai", label: "4 Da'i", full: "University · transmit light", api: "ClarityDaiUniversity" }
  ];

  function getPhase() {
    try {
      return Math.max(1, Math.min(4, parseInt(localStorage.getItem(PHASE_KEY) || "1", 10) || 1));
    } catch (e) {
      return 1;
    }
  }
  function setPhase(n) {
    n = Math.max(1, Math.min(4, n));
    try {
      localStorage.setItem(PHASE_KEY, String(n));
      var meta = PHASE_META[n - 1];
      if (meta) {
        localStorage.setItem("clarity_path_focus", meta.key);
        localStorage.setItem("clarity_committed_path", meta.key);
      }
    } catch (e) {}
    try {
      document.documentElement.setAttribute("data-curriculum-phase", String(n));
      document.documentElement.setAttribute("data-clarity-path", (PHASE_META[n - 1] || {}).key || "seeker");
    } catch (e2) {}
    try {
      g.dispatchEvent(new CustomEvent("clarity-curriculum-phase", { detail: { phase: n } }));
      g.dispatchEvent(new CustomEvent("clarity-path-changed", { detail: { phase: n } }));
    } catch (e3) {}
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

  function getTrack(phase) {
    if (g.ClarityCurriculumEngine && g.ClarityCurriculumEngine.get) {
      var t = g.ClarityCurriculumEngine.get(phase);
      if (t) return t;
    }
    var meta = PHASE_META[phase - 1];
    if (meta && g[meta.api]) return g[meta.api];
    return null;
  }

  function syncTracks() {
    var phase = getPhase();
    for (var p = 1; p <= 4; p++) {
      var track = getTrack(p);
      if (track && typeof track.show === "function") {
        track.show(p === phase);
      } else if (track && track.cardId) {
        var el = document.getElementById(track.cardId);
        if (el) {
          if (p === phase) {
            el.style.removeProperty("display");
            el.classList.remove("gate-hidden");
            if (track.render) track.render();
          } else {
            el.style.setProperty("display", "none", "important");
            el.classList.add("gate-hidden");
          }
        }
      }
    }
    /* Junior v2 uses show via ensure — also handle ClarityJuniorCurriculum without show */
    var j = g.ClarityJuniorCurriculum;
    if (j && !j.show) {
      var jc = document.getElementById("junior-curriculum-card");
      if (jc) {
        if (phase === 1) {
          jc.style.removeProperty("display");
          jc.classList.remove("gate-hidden");
          if (j.render) j.render();
        } else {
          jc.style.setProperty("display", "none", "important");
        }
      }
    }
  }

  /** Reorder cards inside a tab for beneficial learning sequence */
  function orderCardsInTab(tabId, order) {
    var tab = document.getElementById(tabId);
    if (!tab || !order || !order.length) return;
    var host = tab.querySelector(".rrra-hub-body") || tab;
    var placed = [];
    order.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      /* prefer moving if it's within this tab or orphan */
      try {
        if (el.parentNode !== host) {
          /* only move if currently inside this tab or floating in main */
          var inTab = tab.contains(el);
          var inMain =
            el.closest("#main-application-workspace") ||
            el.closest("#main-content") ||
            el.parentElement === document.body;
          if (!inTab && !inMain) return;
        }
        host.appendChild(el);
        placed.push(el);
        el.style.removeProperty("display");
        el.classList.remove("gate-hidden", "hidden");
        el.hidden = false;
      } catch (e) {}
    });
    return placed.length;
  }

  function applyDeepLearningOrder() {
    var phase = getPhase();
    var map = CARD_ORDER[phase] || {};
    Object.keys(map).forEach(function (tabId) {
      orderCardsInTab(tabId, map[tabId]);
    });
    /* Hide curriculum cards not for this phase */
    var allCurr = [
      "junior-curriculum-card",
      "junior-high-curriculum-card",
      "daily-hs-curriculum-card",
      "dai-university-curriculum-card",
      "dai-university-card",
      "jh-curriculum-card"
    ];
    var activeIds = {
      1: "junior-curriculum-card",
      2: "junior-high-curriculum-card",
      3: "daily-hs-curriculum-card",
      4: "dai-university-curriculum-card"
    };
    var keep = activeIds[phase];
    allCurr.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (id === keep || (phase === 4 && id === "dai-university-card")) {
        el.style.removeProperty("display");
        el.classList.remove("gate-hidden");
      } else if (id.indexOf("curriculum") >= 0 || id.indexOf("jh-") === 0 || id.indexOf("dai-uni") === 0) {
        /* don't hide related learning cards — only alternate curriculum roots */
        if (
          id === "junior-curriculum-card" ||
          id === "junior-high-curriculum-card" ||
          id === "daily-hs-curriculum-card" ||
          id === "dai-university-curriculum-card" ||
          id === "dai-university-card" ||
          id === "jh-curriculum-card"
        ) {
          if (id !== keep) el.style.setProperty("display", "none", "important");
        }
      }
    });
  }

  function canEnterPhase(target) {
    if (target <= 1) return true;
    /* must have passed quiz for target-1 */
    if (!quizPassed(target - 1)) return false;
    var prev = getTrack(target - 1);
    if (prev && prev.allComplete && !prev.allComplete()) return false;
    return getPhase() >= target || quizPassed(target - 1);
  }

  function goToPhase(target) {
    target = Math.max(1, Math.min(4, target));
    if (target > getPhase() && !canEnterPhase(target)) {
      alert("This phase is locked. Finish all modules in the current phase and pass the quiz first.");
      return false;
    }
    setPhase(target);
    syncTracks();
    applyDeepLearningOrder();
    refreshPlaque();
    var track = getTrack(target);
    if (track && track.cardId) {
      var el = document.getElementById(track.cardId);
      if (el) {
        try {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (e) {}
      }
    }
    if (track && track.tabId && typeof g.clarityOpenSectionDoor === "function") {
      var door = track.tabId.replace("tab-", "");
      try {
        g.clarityOpenSectionDoor(door);
      } catch (e2) {}
    }
    return true;
  }

  function statsFor(phase) {
    var t = getTrack(phase);
    if (!t) return { done: 0, total: 0, all: false, active: 0 };
    return {
      done: t.doneCount ? t.doneCount() : 0,
      total: t.totalLessons ? t.totalLessons() : 0,
      all: t.allComplete ? t.allComplete() : false,
      active: t.activeModuleIndex ? t.activeModuleIndex() : 0
    };
  }

  function refreshPlaque() {
    if (typeof g.clarityRefreshPhasePlaque === "function") {
      try {
        g.clarityRefreshPhasePlaque();
      } catch (e) {}
    }
    /* Enhance plaque status with controller data */
    var stEl = document.getElementById("cpp-status");
    if (!stEl) return;
    var phase = getPhase();
    var st = statsFor(phase);
    var meta = PHASE_META[phase - 1] || {};
    if (st.total) {
      if (!st.all) {
        stEl.textContent =
          "Phase " +
          phase +
          " · " +
          (meta.full || "") +
          " · Module " +
          Math.min(st.active + 1, st.total) +
          " of " +
          st.total +
          " — mark complete to continue.";
      } else if (!quizPassed(phase) && phase < 4) {
        stEl.textContent =
          "Phase " + phase + " modules complete — take the quiz to unlock Phase " + (phase + 1) + ".";
      } else if (phase === 4 && st.all) {
        stEl.textContent = "Phase 4 complete — may Allah accept. Continue reviewing with adab.";
      } else {
        stEl.textContent = "Phase " + phase + " · " + (meta.full || "");
      }
    }
  }

  /* Hook phase advance after quiz — used by phase-plaque quiz */
  var _prevOpen = g.clarityOpenPhaseQuiz;
  g.clarityOnPhaseQuizPass = function (phase) {
    setQuizPassed(phase);
    if (phase < 4) {
      setPhase(phase + 1);
    }
    syncTracks();
    applyDeepLearningOrder();
    refreshPlaque();
  };

  function boot() {
    try {
      document.documentElement.setAttribute("data-curriculum-phase", String(getPhase()));
    } catch (e) {}
    syncTracks();
    applyDeepLearningOrder();
    refreshPlaque();
  }

  function schedule() {
    boot();
    [200, 600, 1500, 3000].forEach(function (ms) {
      setTimeout(boot, ms);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", schedule);
  else schedule();
  g.addEventListener("load", function () {
    setTimeout(boot, 400);
  });
  g.addEventListener("clarity-curriculum-progress", function () {
    refreshPlaque();
    applyDeepLearningOrder();
  });
  g.addEventListener("clarity-junior-progress", function () {
    refreshPlaque();
  });

  g.ClarityCurriculumController = {
    getPhase: getPhase,
    setPhase: setPhase,
    goToPhase: goToPhase,
    canEnterPhase: canEnterPhase,
    quizPassed: quizPassed,
    setQuizPassed: setQuizPassed,
    syncTracks: syncTracks,
    applyDeepLearningOrder: applyDeepLearningOrder,
    statsFor: statsFor,
    refreshPlaque: refreshPlaque,
    PHASE_META: PHASE_META,
    CARD_ORDER: CARD_ORDER
  };
})(typeof window !== "undefined" ? window : this);
