(function () {
  "use strict";
  if (window.__CLARITY_PATH_PROGRESS_V6__) return;
  window.__CLARITY_PATH_PROGRESS_V6__ = true;

  /**
   * Clarity Path Progress v6 — CSS-first phased learning
   * Seeker → New Muslim → Daily → Da'i
   * Switch cost: attribute + button classes only (no per-card style thrash).
   */

  var ORDER = ["seeker", "new_muslim", "practicing", "dai"];
  var LABELS = {
    seeker: "Seeker",
    new_muslim: "New Muslim",
    practicing: "Daily Muslim",
    dai: "Da'i"
  };
  var UNLOCK_KEY = "clarity_path_unlocked_max";
  var PASSED_KEY = "clarity_quiz_passed_v1";

  var ALLOW = {
    seeker: {
      "commands-card": 1, "samina-verse-card": 1, "samina-card": 1, "about-clarity-card": 1,
      "soul-compass-card": 1, "hell-sins-card": 1, "night-breath-card": 1,
      "seerah-live-card": 1, "creation-tongue-reflection": 1, "grave-path-card": 1,
      "cw-card": 1, "ilm-pathway-card": 1
    },
    new_muslim: {
      "commands-card": 1, "samina-verse-card": 1, "samina-card": 1, "ilm-pathway-card": 1,
      "about-clarity-card": 1, "soul-compass-card": 1, "seerah-live-card": 1,
      "night-breath-card": 1, "hajj-guide-card": 1, "fiqh-quiz-card": 1,
      "grave-path-card": 1, "new-muslim-foundations-card": 1, "salah-starter-card": 1,
      "hell-sins-card": 1, "cw-card": 1, "tibbe-nabwi-card": 1
    },
    practicing: {
      "commands-card": 1, "samina-verse-card": 1, "samina-card": 1, "ilm-pathway-card": 1,
      "about-clarity-card": 1, "soul-compass-card": 1, "seerah-live-card": 1,
      "hell-sins-card": 1, "night-breath-card": 1, "weekly-review-card": 1,
      "tajweed-live-card": 1, "tajweed-path-card": 1, "tj-deep-studio": 1, "tj-lmr-score-card": 1,
      "callig-lab-card": 1, "meme-card": 1, "tibbe-nabwi-card": 1, "seerah-mirror-card": 1,
      "najiha-tafseer-card": 1, "tafseer-resources-card": 1, "deepen-study-card": 1,
      "asma-names-lecture-card": 1, "creation-tongue-reflection": 1, "hajj-checklist-card": 1,
      "grave-path-card": 1, "daily-deed-ledger-card": 1, "hajj-guide-card": 1,
      "new-muslim-foundations-card": 1, "salah-starter-card": 1, "cw-card": 1,
      "tafseer-live-card": 1, "tweet-desk-card": 1
    },
    dai: {
      "commands-card": 1, "samina-verse-card": 1, "samina-card": 1, "ilm-pathway-card": 1,
      "about-clarity-card": 1, "soul-compass-card": 1, "seerah-live-card": 1,
      "hell-sins-card": 1, "night-breath-card": 1, "deepen-study-card": 1,
      "asma-names-lecture-card": 1, "tafseer-resources-card": 1, "creation-tongue-reflection": 1,
      "hajj-guide-card": 1, "hajj-checklist-card": 1, "fiqh-quiz-card": 1,
      "meme-card": 1, "callig-lab-card": 1, "tweet-desk-card": 1,
      "tajweed-live-card": 1, "tajweed-path-card": 1, "tj-deep-studio": 1, "tj-lmr-score-card": 1,
      "weekly-review-card": 1, "tibbe-nabwi-card": 1, "seerah-mirror-card": 1,
      "najiha-tafseer-card": 1, "israeliyat-card": 1, "sealed-nectar-card": 1,
      "tajalliyat-lecture-card": 1, "tafseer-live-card": 1, "voice-translator-card": 1,
      "grave-path-card": 1, "daily-deed-ledger-card": 1, "dai-transmit-card": 1,
      "new-muslim-foundations-card": 1, "salah-starter-card": 1, "cw-card": 1
    }
  };

  var ALWAYS = {
    "user-family-tree-card": 1, "faraid-card": 1, "wasiyyah-card": 1,
    "about-clarity-card": 1, "cw-card": 1, "notes-shell": 1
  };

  var QUIZZES = {
    1: [
      { q: "Shahāda affirms belief in:", opts: ["Allah alone and Muhammad ﷺ as His Messenger", "Culture only", "Any idol", "Travel alone"], a: 0 },
      { q: "Before ṣalāh when required, one performs:", opts: ["Wudu (ablution)", "A social media post", "A payment", "Silence only"], a: 0 },
      { q: "The five daily prayers are:", opts: ["A core practiced pillar of the religion", "Optional decoration", "Only for imams", "Replaced by intention alone"], a: 0 }
    ],
    2: [
      { q: "Steady growth is best as:", opts: ["Consistent sincere deeds", "Only online debates", "Abandoning prayer when busy", "Never opening the Qur'an"], a: 0 },
      { q: "Tajweed primarily helps:", opts: ["Correct Qur'an recitation", "Business ads", "Astrology", "Skipping ṣalāh"], a: 0 },
      { q: "Family legacy notes are:", opts: ["Educational readiness — not a website fatwa", "Final court orders", "Public shaming tools", "A way to hide debts"], a: 0 }
    ],
    3: [
      { q: "Calm dawah prioritises:", opts: ["Sincerity, authentic sources, manners", "Winning by mockery", "Invented rulings", "Hiding references"], a: 0 },
      { q: "If unsure of a ruling:", opts: ["Ask qualified local scholarship / trusted sources", "Post a confident guess", "Follow the angriest comment", "Ignore harm"], a: 0 },
      { q: "Sharing scripture publicly needs:", opts: ["Care for authenticity and context", "Editing the text for drama", "No reference", "Guaranteed salvation claims"], a: 0 }
    ]
  };

  var __stamped = false;
  var __lastGate = null;
  var __busy = false;
  var __eventT = 0;
  var __minById = null;

  function idx(g) {
    var i = ORDER.indexOf(String(g || ""));
    return i < 0 ? 0 : i;
  }

  function getPassed() {
    try {
      var raw = localStorage.getItem(PASSED_KEY);
      if (!raw) return {};
      var o = JSON.parse(raw);
      return o && typeof o === "object" ? o : {};
    } catch (e) { return {}; }
  }

  function setPassed(gate) {
    try {
      var o = getPassed();
      o[gate] = true;
      localStorage.setItem(PASSED_KEY, JSON.stringify(o));
    } catch (e) {}
  }

  function doorCleared(gate) {
    var i = idx(gate);
    if (i <= 0) return true;
    if (getMax() >= i) return true;
    return !!getPassed()[gate];
  }

  function getMax() {
    try {
      var n = parseInt(localStorage.getItem(UNLOCK_KEY) || "0", 10);
      if (isNaN(n) || n < 0) n = 0;
      var p = getPassed();
      ORDER.forEach(function (g, i) {
        if (p[g] && i > n) n = i;
      });
      return Math.min(ORDER.length - 1, n);
    } catch (e) { return 0; }
  }

  function setMax(n) {
    n = Math.max(0, Math.min(ORDER.length - 1, n | 0));
    try { localStorage.setItem(UNLOCK_KEY, String(n)); } catch (e) {}
    return n;
  }

  function buildMinMap() {
    if (__minById) return __minById;
    var min = {};
    ORDER.forEach(function (g, i) {
      var a = ALLOW[g] || {};
      Object.keys(a).forEach(function (id) {
        if (a[id] && (min[id] === undefined || i < min[id])) min[id] = i;
      });
    });
    Object.keys(ALWAYS).forEach(function (id) { min[id] = 0; });
    __minById = min;
    return min;
  }

  function stampCards() {
    if (__stamped) return;
    __stamped = true;
    var min = buildMinMap();
    try {
      document.querySelectorAll(".card[id], [id$='-card']").forEach(function (node) {
        var id = node.id;
        if (!id) return;
        if (ALWAYS[id]) {
          node.setAttribute("data-always", "1");
          node.setAttribute("data-min-i", "0");
          return;
        }
        if (min[id] !== undefined) node.setAttribute("data-min-i", String(min[id]));
        else node.setAttribute("data-min-i", "2");
      });
      ["meme-card", "meme-studio-root", "meme", "tweet-desk-card"].forEach(function (id) {
        var n = document.getElementById(id);
        if (n && !n.hasAttribute("data-min-i")) n.setAttribute("data-min-i", "2");
      });
    } catch (e) {}
  }

  function clamp() {
    var cur = "seeker";
    try {
      cur = localStorage.getItem("clarity_path_focus")
        || localStorage.getItem("clarity_committed_path")
        || localStorage.getItem("clarity_path_override")
        || document.documentElement.getAttribute("data-clarity-path")
        || "seeker";
    } catch (e) {}
    if (ORDER.indexOf(cur) < 0) cur = "seeker";
    var max = getMax();
    if (idx(cur) > max) cur = ORDER[max];
    return cur;
  }

  function applyPathFilter(focusGate) {
    if (__busy) return;
    focusGate = ORDER.indexOf(focusGate) >= 0 ? focusGate : "seeker";
    var max = getMax();
    var fi = idx(focusGate);
    if (fi > max) {
      focusGate = ORDER[max];
      fi = max;
    }
    if (__lastGate === focusGate) {
      markUI(focusGate);
      return;
    }
    __busy = true;
    try {
      stampCards();
      var root = document.documentElement;
      var body = document.body;
      root.setAttribute("data-clarity-path", focusGate);
      root.setAttribute("data-path-i", String(fi));
      root.setAttribute("data-clarity-unlocked-max", String(max));
      if (body) {
        body.setAttribute("data-clarity-path", focusGate);
        body.setAttribute("data-path-i", String(fi));
      }
      var memeOk = fi >= 2 && max >= 2;
      root.setAttribute("data-clarity-meme-ok", memeOk ? "1" : "0");
      if (body) body.setAttribute("data-clarity-meme-ok", memeOk ? "1" : "0");
      try {
        localStorage.setItem("clarity_committed_path", focusGate);
        localStorage.setItem("clarity_path_override", focusGate);
        localStorage.setItem("clarity_path_focus", focusGate);
      } catch (e) {}
      markUI(focusGate);
      var changed = __lastGate !== focusGate;
      __lastGate = focusGate;
      if (changed) {
        clearTimeout(__eventT);
        __eventT = setTimeout(function () {
          try {
            window.dispatchEvent(new CustomEvent("clarity-path-changed", { detail: { gate: focusGate } }));
          } catch (eEv) {}
        }, 0);
      }
    } finally {
      __busy = false;
    }
  }

  function markUI(focusGate) {
    var max = getMax();
    focusGate = ORDER.indexOf(focusGate) >= 0 ? focusGate : ORDER[Math.min(max, ORDER.length - 1)];
    document.querySelectorAll(".gps-btn, .gps-phase, .cgs-btn, [data-gate]").forEach(function (btn) {
      var g = btn.getAttribute("data-gate");
      if (!g || ORDER.indexOf(g) < 0) return;
      var i = idx(g);
      var unlocked = i <= max || doorCleared(g);
      var on = g === focusGate;
      btn.classList.toggle("active", on);
      btn.classList.toggle("is-active", on);
      btn.classList.toggle("path-locked", !unlocked);
      btn.setAttribute("aria-disabled", unlocked ? "false" : "true");
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      if (unlocked) btn.removeAttribute("disabled");
    });
    try {
      var labels = {
        seeker: "SEEKER JOURNEY MODE",
        new_muslim: "NEW MUSLIM TRACK",
        practicing: "DAILY MUSLIM / LEGACY",
        dai: "ASPIRING DA'I TRACK"
      };
      var badge = document.getElementById("clarity-mode-badge") || document.querySelector(".seeker-mode-pill, .path-mode-badge");
      if (badge) badge.textContent = labels[focusGate] || badge.textContent;
    } catch (e) {}
  }

  function applyContent(gate, opts) {
    opts = opts || {};
    applyPathFilter(gate);
    try {
      var raw = window.__clarityPathDoSwitchRaw;
      if (typeof raw === "function") {
        window.__clarityPathBypass = true;
        try { raw(gate); } finally { window.__clarityPathBypass = false; }
      }
    } catch (e) {}
    if (opts.goReminder) {
      try { if (typeof switchTab === "function") switchTab("reminder"); } catch (e) {}
    }
  }

  var Q = null;

  function ensureModal() {
    var m = document.getElementById("clarity-path-quiz-modal");
    if (m) return m;
    m = document.createElement("div");
    m.id = "clarity-path-quiz-modal";
    m.innerHTML = "<div class=\"cpq-card\" id=\"cpq-inner\"></div>";
    document.body.appendChild(m);
    m.addEventListener("click", function (e) { if (e.target === m) closeQuiz(false); });
    return m;
  }

  function closeQuiz(pass) {
    var m = document.getElementById("clarity-path-quiz-modal");
    if (m) m.classList.remove("open");
    var target = Q && Q.target;
    Q = null;
    if (pass && target) {
      setPassed(target);
      setMax(Math.max(getMax(), idx(target)));
      applyContent(target, { goReminder: true });
    } else {
      markUI(clamp());
    }
  }

  function openQuiz(from, target) {
    if (doorCleared(target)) {
      setMax(Math.max(getMax(), idx(target)));
      applyContent(target);
      return;
    }
    var ti = idx(target);
    var qs = QUIZZES[ti];
    if (!qs || !qs.length) {
      setPassed(target);
      setMax(Math.max(getMax(), ti));
      applyContent(target, { goReminder: true });
      return;
    }
    Q = { from: from, target: target, qs: qs, step: 0, correct: 0, busy: false };
    var m = ensureModal();
    paintQuiz();
    requestAnimationFrame(function () { m.classList.add("open"); });
  }

  function paintQuiz() {
    var inner = document.getElementById("cpq-inner");
    if (!inner || !Q) return;
    if (Q.step >= Q.qs.length) {
      var need = Math.max(1, Math.ceil(Q.qs.length * 2 / 3));
      var ok = Q.correct >= need;
      inner.innerHTML = "<h3>" + (ok ? "Door unlocked" : "Not yet") + "</h3>" +
        "<p class=\"cpq-sub\">" + (ok
          ? ("Welcome to <strong>" + LABELS[Q.target] + "</strong>. This door stays open — you will not be quizzed again for it.")
          : ("Score " + Q.correct + "/" + Q.qs.length + " (need " + need + "). Stay on <strong>" + LABELS[Q.from] + "</strong> and try again.")) + "</p>" +
        "<div class=\"cpq-actions\">" +
        (ok
          ? "<button type=\"button\" class=\"cpq-primary\" id=\"cpq-go\">Enter path</button>"
          : "<button type=\"button\" class=\"cpq-primary\" id=\"cpq-retry\">Try again</button>") +
        "<button type=\"button\" id=\"cpq-x\">Close</button></div>";
      var go = document.getElementById("cpq-go");
      if (go) go.onclick = function () { closeQuiz(true); };
      var retry = document.getElementById("cpq-retry");
      if (retry) retry.onclick = function () {
        var f = Q.from, t = Q.target;
        Q = null;
        openQuiz(f, t);
      };
      var x = document.getElementById("cpq-x");
      if (x) x.onclick = function () { closeQuiz(false); };
      return;
    }
    var item = Q.qs[Q.step];
    inner.innerHTML = "<h3>Unlock " + LABELS[Q.target] + "</h3>" +
      "<p class=\"cpq-sub\">Question " + (Q.step + 1) + " of " + Q.qs.length +
      " · Need most correct · Cleared doors are never re-asked</p>" +
      "<div class=\"cpq-q\">" + item.q + "</div>" +
      item.opts.map(function (o, i) {
        return "<button type=\"button\" class=\"cpq-opt\" data-i=\"" + i + "\">" + o + "</button>";
      }).join("") +
      "<div class=\"cpq-actions\"><button type=\"button\" id=\"cpq-stay\">Stay on " + LABELS[Q.from] + "</button></div>";
    inner.querySelectorAll(".cpq-opt").forEach(function (btn) {
      btn.onclick = function () {
        if (!Q || Q.busy) return;
        Q.busy = true;
        var i = parseInt(btn.getAttribute("data-i"), 10);
        var good = i === item.a;
        if (good) Q.correct++;
        btn.classList.add(good ? "correct" : "wrong");
        inner.querySelectorAll(".cpq-opt").forEach(function (b) {
          if (parseInt(b.getAttribute("data-i"), 10) === item.a) b.classList.add("correct");
          b.disabled = true;
        });
        setTimeout(function () { if (Q) { Q.busy = false; Q.step++; paintQuiz(); } }, 320);
      };
    });
    var stay = document.getElementById("cpq-stay");
    if (stay) stay.onclick = function () { closeQuiz(false); };
  }

  function ensureIntro() {
    try {
      var host = document.querySelector(".clarity-gate-switcher, #clarity-path-strip, .gps-strip");
      if (!host || host.querySelector(".cgp-intro")) return;
      var p = document.createElement("p");
      p.className = "cgp-intro";
      p.style.cssText = "font-size:0.82rem;opacity:0.9;margin:0.35rem 0 0.5rem;line-height:1.45";
      p.innerHTML = "<strong>Phased learning</strong> — start as Seeker. A short quiz unlocks the next door once; earlier sections stay with you.";
      host.insertBefore(p, host.firstChild);
    } catch (e) {}
  }

  window.clarityPathResetToSeeker = function () {
    try {
      localStorage.setItem(UNLOCK_KEY, "0");
      localStorage.setItem("clarity_committed_path", "seeker");
      localStorage.setItem("clarity_path_override", "seeker");
      localStorage.setItem("clarity_path_focus", "seeker");
      localStorage.removeItem(PASSED_KEY);
      localStorage.removeItem("clarity_path_quiz_done");
    } catch (e) {}
    __lastGate = null;
    applyContent("seeker", { goReminder: true });
    return { ok: true, path: "seeker" };
  };

  window.clarityWelcomePickTrack = function (gate) {
    gate = String(gate || "seeker");
    if (ORDER.indexOf(gate) < 0) gate = "seeker";
    try {
      localStorage.setItem("clarity_welcome_seen_v2", "1");
      localStorage.setItem("clarity_welcome_seen", "1");
      localStorage.setItem("clarity_committed_path", gate);
      localStorage.setItem("clarity_path_override", gate);
      localStorage.setItem("clarity_path_focus", gate);
      setMax(idx(gate));
      for (var i = 0; i <= idx(gate); i++) setPassed(ORDER[i]);
    } catch (e) {}
    try {
      if (typeof window.clarityFinishWelcome === "function") window.clarityFinishWelcome(false);
      else {
        var el = document.getElementById("clarity-welcome");
        if (el) { el.classList.remove("show"); el.setAttribute("aria-hidden", "true"); }
      }
    } catch (e) {}
    try {
      var td = document.getElementById("clarity-three-doors");
      if (td) { td.classList.add("hidden"); td.style.setProperty("display", "none", "important"); }
    } catch (e) {}
    __lastGate = null;
    applyContent(gate, { goReminder: true });
    try { if (window.clarityUnlockScroll) window.clarityUnlockScroll(); } catch (e) {}
    return { ok: true, path: gate };
  };

  window.clarityWelcomeSkipToName = function () {
    return window.clarityWelcomePickTrack("seeker");
  };

  window.clarityCommitGate = function (gate) {
    return window.clarityWelcomePickTrack(gate);
  };

  window.clarityPickPrimaryDoor = function (door) {
    var map = { today: "seeker", learn: "practicing", prepare: "dai" };
    if (map[door]) return window.clarityWelcomePickTrack(map[door]);
    try {
      var td = document.getElementById("clarity-three-doors");
      if (td) { td.classList.add("hidden"); td.style.display = "none"; }
    } catch (e) {}
  };

  window.clarityRequestPath = function (gate) {
    gate = String(gate || "seeker");
    if (ORDER.indexOf(gate) < 0) gate = "seeker";
    if (window.__clarityPathBypass) {
      applyContent(gate);
      return { ok: true };
    }
    var ti = idx(gate);
    var max = getMax();
    if (doorCleared(gate) || ti <= max) {
      setMax(Math.max(max, ti));
      try {
        localStorage.setItem("clarity_path_focus", gate);
        localStorage.setItem("clarity_committed_path", gate);
        localStorage.setItem("clarity_path_override", gate);
      } catch (eP) {}
      applyContent(gate);
      return { ok: true, reason: "unlocked" };
    }
    var nextGate = ORDER[Math.min(max + 1, ORDER.length - 1)];
    if (ti > max + 1) {
      openQuiz(ORDER[max], nextGate);
      markUI(ORDER[max]);
      return { ok: false, reason: "quiz-next", next: nextGate };
    }
    openQuiz(ORDER[max], gate);
    return { ok: false, reason: "quiz" };
  };

  function wire() {
    if (typeof window.__clarityPathDoSwitchRaw !== "function") {
      if (typeof window.claritySwitchGate === "function" && !window.claritySwitchGate.__isRequest) {
        window.__clarityPathDoSwitchRaw = window.claritySwitchGate;
      } else if (typeof window.applyGateSectionFilter === "function") {
        window.__clarityPathDoSwitchRaw = function (g) {
          try { window.applyGateSectionFilter(g); } catch (e) {}
        };
      }
    }
    window.claritySwitchGate = function (g) { return window.clarityRequestPath(g); };
    window.claritySwitchGate.__isRequest = true;
    window.applyGateConfiguration = window.claritySwitchGate;
    window.applyGateSectionFilter = function (g) { applyPathFilter(g || clamp()); };
    window.applyAdditiveFilter = window.applyGateSectionFilter;
    window.applyExclusiveFilter = window.applyGateSectionFilter;
  }

  var __booted = false;
  function boot() {
    if (__booted) {
      /* Second call: only re-stamp + re-apply filter for same focus — never seeker reset */
      stampCards();
      applyPathFilter(clamp());
      return;
    }
    __booted = true;
    try {
      if (localStorage.getItem(UNLOCK_KEY) == null) setMax(0);
    } catch (e) {}
    wire();
    ensureIntro();
    stampCards();
    /* Restore last phase — no goReminder (does not steal hub tab) */
    applyContent(clamp());
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 60); });
  else setTimeout(boot, 60);
  window.addEventListener("load", function () {
    setTimeout(function () {
      if (!__booted) boot();
      else { stampCards(); applyPathFilter(clamp()); }
    }, 200);
    /* Final authority after bootPortal / onboarding sleepers */
    setTimeout(function () {
      try {
        var g = clamp();
        applyPathFilter(g);
        markUI(g);
      } catch (eF) {}
    }, 600);
  });

  window.clarityPathProgress = {
    order: ORDER,
    getMax: getMax,
    doorCleared: doorCleared,
    apply: applyPathFilter,
    reapply: function () {
      stampCards();
      __lastGate = null;
      var g = clamp();
      applyPathFilter(g);
      markUI(g);
    },
    reset: function () { return window.clarityPathResetToSeeker(); }
  };
})();
