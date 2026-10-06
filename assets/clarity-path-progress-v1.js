(function(){
"use strict";
if (window.__CLARITY_PATH_PROGRESS_V5__) return;
window.__CLARITY_PATH_PROGRESS_V5__ = true;

/**
 * Progressive doors (Seeker → New Muslim → Daily → Da'i)
 * - Quiz unlocks are PERMANENT (localStorage)
 * - Content is ADDITIVE: unlocking a door keeps earlier + new modules
 * - Switching focus among unlocked doors never re-asks the quiz
 * Educational only — not a fatwa path
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

/** Rich allowlists — each phase adds modules; filter uses UNION through unlocked max */
var ALLOW = {
  seeker: {
    "commands-card":1,"samina-verse-card":1,"samina-card":1,"about-clarity-card":1,
    "soul-compass-card":1,"hell-sins-card":1,"night-breath-card":1,
    "seerah-live-card":1,"creation-tongue-reflection":1,"grave-path-card":1,
    "cw-card":1,"ilm-pathway-card":1
  },
  new_muslim: {
    "commands-card":1,"samina-verse-card":1,"samina-card":1,"ilm-pathway-card":1,
    "about-clarity-card":1,"soul-compass-card":1,"seerah-live-card":1,
    "night-breath-card":1,"hajj-guide-card":1,"fiqh-quiz-card":1,
    "grave-path-card":1,"new-muslim-foundations-card":1,"salah-starter-card":1,
    "hell-sins-card":1,"cw-card":1,"tibbe-nabwi-card":1
  },
  practicing: {
    "commands-card":1,"samina-verse-card":1,"samina-card":1,"ilm-pathway-card":1,
    "about-clarity-card":1,"soul-compass-card":1,"seerah-live-card":1,
    "hell-sins-card":1,"night-breath-card":1,"weekly-review-card":1,
    "tajweed-live-card":1,"tajweed-path-card":1,"tj-deep-studio":1,"tj-lmr-score-card":1,
    "callig-lab-card":1,"meme-card":1,"tibbe-nabwi-card":1,"seerah-mirror-card":1,
    "najiha-tafseer-card":1,"tafseer-resources-card":1,"deepen-study-card":1,
    "asma-names-lecture-card":1,"creation-tongue-reflection":1,"hajj-checklist-card":1,
    "grave-path-card":1,"daily-deed-ledger-card":1,"hajj-guide-card":1,
    "new-muslim-foundations-card":1,"salah-starter-card":1,"cw-card":1,
    "tafseer-live-card":1,"tweet-desk-card":1
  },
  dai: {
    /* nearly full library */
    "commands-card":1,"samina-verse-card":1,"samina-card":1,"ilm-pathway-card":1,
    "about-clarity-card":1,"soul-compass-card":1,"seerah-live-card":1,
    "hell-sins-card":1,"night-breath-card":1,"deepen-study-card":1,
    "asma-names-lecture-card":1,"tafseer-resources-card":1,"creation-tongue-reflection":1,
    "hajj-guide-card":1,"hajj-checklist-card":1,"fiqh-quiz-card":1,
    "meme-card":1,"callig-lab-card":1,"tweet-desk-card":1,
    "tajweed-live-card":1,"tajweed-path-card":1,"tj-deep-studio":1,"tj-lmr-score-card":1,
    "weekly-review-card":1,"tibbe-nabwi-card":1,"seerah-mirror-card":1,
    "najiha-tafseer-card":1,"israeliyat-card":1,"sealed-nectar-card":1,
    "tajalliyat-lecture-card":1,"tafseer-live-card":1,"voice-translator-card":1,
    "grave-path-card":1,"daily-deed-ledger-card":1,"dai-transmit-card":1,
    "new-muslim-foundations-card":1,"salah-starter-card":1,"cw-card":1
  }
};

/** Always available (private vault / shell) */
var ALWAYS = {
  "user-family-tree-card":1,"faraid-card":1,"wasiyyah-card":1,
  "about-clarity-card":1,"cw-card":1,"notes-shell":1
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

function idx(g){
  var i = ORDER.indexOf(String(g || ""));
  return i < 0 ? 0 : i;
}

function getPassed(){
  try {
    var raw = localStorage.getItem(PASSED_KEY);
    if (!raw) return {};
    var o = JSON.parse(raw);
    return o && typeof o === "object" ? o : {};
  } catch(e){ return {}; }
}

function setPassed(gate){
  try {
    var o = getPassed();
    o[gate] = true;
    localStorage.setItem(PASSED_KEY, JSON.stringify(o));
  } catch(e){}
}

function doorCleared(gate){
  var i = idx(gate);
  if (i <= 0) return true; /* seeker always open */
  if (getMax() >= i) return true;
  var p = getPassed();
  return !!p[gate];
}

function getMax(){
  try {
    var n = parseInt(localStorage.getItem(UNLOCK_KEY) || "0", 10);
    if (isNaN(n) || n < 0) n = 0;
    /* reconcile with per-door passes */
    var p = getPassed();
    ORDER.forEach(function(g, i){
      if (p[g] && i > n) n = i;
    });
    n = Math.min(ORDER.length - 1, n);
    return n;
  } catch(e){ return 0; }
}

function setMax(n){
  n = Math.max(0, Math.min(ORDER.length - 1, n | 0));
  try { localStorage.setItem(UNLOCK_KEY, String(n)); } catch(e){}
  return n;
}

/** Union of allowlists from seeker through unlocked max (not merely focus path) */
function unionAllow(uptoGate){
  /* Curriculum view = modules for this focus only (0..focus), never forced up to max.
     Unlocked max still gates which doors you may *select*; focus confines what you *see*. */
  var upto = typeof uptoGate === "number" ? uptoGate : idx(uptoGate);
  if (isNaN(upto) || upto < 0) upto = 0;
  upto = Math.min(upto, getMax(), ORDER.length - 1);
  var u = {};
  Object.keys(ALWAYS).forEach(function(k){ u[k] = 1; });
  for (var i = 0; i <= upto; i++) {
    var a = ALLOW[ORDER[i]] || {};
    Object.keys(a).forEach(function(k){ if (a[k]) u[k] = 1; });
  }
  return u;
}

function hideEl(el){
  if (!el) return;
  el.classList.add("gate-hidden");
  el.setAttribute("data-gate-hidden", "1");
  el.style.setProperty("display", "none", "important");
}
function showEl(el){
  if (!el) return;
  el.classList.remove("gate-hidden");
  el.removeAttribute("data-gate-hidden");
  el.style.removeProperty("display");
  el.style.removeProperty("visibility");
  el.style.removeProperty("height");
}

var __pathFilterBusy = false;
var __lastPathGate = null;

function applyPathFilter(focusGate){
  if (__pathFilterBusy) return;
  focusGate = ORDER.indexOf(focusGate) >= 0 ? focusGate : "seeker";
  var max = getMax();
  var fi = idx(focusGate);
  if (fi > max) {
    focusGate = ORDER[max];
    fi = max;
  }
  /* Skip heavy DOM work when focus is unchanged and lock stylesheet already exists */
  var sameGate = (__lastPathGate === focusGate);
  __pathFilterBusy = true;
  try {
    /* Show curriculum for *focus* phase (additive 0..focus), clamped by unlock */
    var allow = unionAllow(fi);

    try {
      document.documentElement.setAttribute("data-clarity-path", focusGate);
      document.body.setAttribute("data-clarity-path", focusGate);
      localStorage.setItem("clarity_committed_path", focusGate);
      localStorage.setItem("clarity_path_override", focusGate);
      localStorage.setItem("clarity_path_focus", focusGate);
    } catch(e){}

    /* CSS lock stylesheet from union */
    var hideIds = [];
    document.querySelectorAll(".card[id], [id$='-card']").forEach(function(node){
      var id = node.id;
      if (!id) return;
      if (allow[id] === 1 || ALWAYS[id]) {
        showEl(node);
        return;
      }
      hideIds.push("#" + id.replace(/([^\w-])/g, "\\$1"));
      hideEl(node);
    });
    var el = document.getElementById("clarity-path-lock");
    if (!el) {
      el = document.createElement("style");
      el.id = "clarity-path-lock";
      document.head.appendChild(el);
    }
    el.textContent = hideIds.length
      ? (hideIds.join(",") + "{display:none!important;visibility:hidden!important;height:0!important;overflow:hidden!important;margin:0!important;padding:0!important;border:none!important;pointer-events:none!important;}")
      : "/* path open */";

    /* meme: only when *focus* is Daily/Da'i AND that door is unlocked — never on Seeker */
    try {
      var memeOk = fi >= idx("practicing") && max >= idx("practicing");
      try {
        document.documentElement.setAttribute("data-clarity-meme-ok", memeOk ? "1" : "0");
        document.body.setAttribute("data-clarity-meme-ok", memeOk ? "1" : "0");
        document.documentElement.setAttribute("data-clarity-unlocked-max", String(max));
      } catch(eAttr){}
      ["meme-card","meme-studio-root","meme","tweet-desk-card"].forEach(function(id){
        var node = document.getElementById(id);
        if (!node) return;
        if (memeOk) showEl(node); else hideEl(node);
      });
      if (!memeOk) {
        try {
          document.documentElement.setAttribute("data-clarity-meme-ok", "0");
          document.body.setAttribute("data-clarity-meme-ok", "0");
        } catch(eM){}
      }
      /* site-wide meme pills */
      document.querySelectorAll(".clarity-to-meme-pill, .clarity-meme-pill-row").forEach(function(p){
        if (memeOk) {
          p.style.removeProperty("display");
          p.style.removeProperty("visibility");
          p.removeAttribute("data-gate-hidden");
        } else {
          p.style.setProperty("display", "none", "important");
        }
      });
    } catch(e){}

    markUI(focusGate);
    var gateChanged = (__lastPathGate !== focusGate);
    __lastPathGate = focusGate;
    /* Dispatch only when the gate actually changes — prevents infinite reapply loops */
    if (gateChanged) {
      try { window.dispatchEvent(new CustomEvent("clarity-path-changed", { detail: { gate: focusGate } })); } catch(eEv){}
    }
  } finally {
    __pathFilterBusy = false;
  }
}

function markUI(focusGate){
  var max = getMax();
  focusGate = ORDER.indexOf(focusGate) >= 0 ? focusGate : ORDER[Math.min(max, ORDER.length - 1)];
  document.querySelectorAll(".gps-btn, .gps-phase, .cgs-btn, [data-gate]").forEach(function(btn){
    var g = btn.getAttribute("data-gate");
    if (!g || ORDER.indexOf(g) < 0) return;
    var i = idx(g);
    var unlocked = i <= max || doorCleared(g);
    btn.classList.toggle("active", g === focusGate);
    btn.classList.toggle("is-active", g === focusGate);
    btn.classList.toggle("path-locked", !unlocked);
    btn.setAttribute("aria-disabled", unlocked ? "false" : "true");
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
  } catch(e){}
}

function applyContent(gate, opts){
  gate = ORDER.indexOf(gate) >= 0 ? gate : "seeker";
  opts = opts || {};
  applyPathFilter(gate);
  try {
    var raw = window.__clarityPathDoSwitchRaw;
    if (typeof raw === "function") {
      window.__clarityPathBypass = true;
      try { raw(gate); } finally { window.__clarityPathBypass = false; }
    }
  } catch(e){}
  /* Only force-navigate to reminder on first unlock / welcome — not on every learning-tab click */
  if (opts.goReminder) {
    try {
      if (typeof switchTab === "function") switchTab("reminder");
    } catch(e){}
  }
  /* Single deferred re-sync if another layer rewrote visibility */
  setTimeout(function(){
    if (__lastPathGate === gate && !__pathFilterBusy) {
      __lastPathGate = null;
      applyPathFilter(gate);
    }
  }, 120);
}

/* ---- Quiz (once per door; majority pass) ---- */
var Q = null;

function ensureModal(){
  var m = document.getElementById("clarity-path-quiz-modal");
  if (m) return m;
  m = document.createElement("div");
  m.id = "clarity-path-quiz-modal";
  m.innerHTML = "<div class=\"cpq-card\" id=\"cpq-inner\"></div>";
  document.body.appendChild(m);
  m.addEventListener("click", function(e){ if (e.target === m) closeQuiz(false); });
  return m;
}

function closeQuiz(pass){
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

function openQuiz(from, target){
  /* never open if already cleared */
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
  requestAnimationFrame(function(){ m.classList.add("open"); });
}

function paintQuiz(){
  var inner = document.getElementById("cpq-inner");
  if (!inner || !Q) return;
  if (Q.step >= Q.qs.length) {
    /* majority pass: at least 2 of 3 (or all if shorter) */
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
    if (go) go.onclick = function(){ closeQuiz(true); };
    var retry = document.getElementById("cpq-retry");
    if (retry) retry.onclick = function(){
      var f = Q.from, t = Q.target;
      Q = null;
      openQuiz(f, t);
    };
    var x = document.getElementById("cpq-x");
    if (x) x.onclick = function(){ closeQuiz(false); };
    return;
  }
  var item = Q.qs[Q.step];
  inner.innerHTML = "<h3>Unlock " + LABELS[Q.target] + "</h3>" +
    "<p class=\"cpq-sub\">Question " + (Q.step + 1) + " of " + Q.qs.length +
    " · Need most correct · Cleared doors are never re-asked</p>" +
    "<div class=\"cpq-q\">" + item.q + "</div>" +
    item.opts.map(function(o, i){
      return "<button type=\"button\" class=\"cpq-opt\" data-i=\"" + i + "\">" + o + "</button>";
    }).join("") +
    "<div class=\"cpq-actions\"><button type=\"button\" id=\"cpq-stay\">Stay on " + LABELS[Q.from] + "</button></div>";
  inner.querySelectorAll(".cpq-opt").forEach(function(btn){
    btn.onclick = function(){
      if (!Q || Q.busy) return;
      Q.busy = true;
      var i = parseInt(btn.getAttribute("data-i"), 10);
      var good = i === item.a;
      if (good) Q.correct++;
      btn.classList.add(good ? "correct" : "wrong");
      inner.querySelectorAll(".cpq-opt").forEach(function(b){
        if (parseInt(b.getAttribute("data-i"), 10) === item.a) b.classList.add("correct");
        b.disabled = true;
      });
      setTimeout(function(){ if (Q) { Q.busy = false; Q.step++; paintQuiz(); } }, 420);
    };
  });
  var stay = document.getElementById("cpq-stay");
  if (stay) stay.onclick = function(){ closeQuiz(false); };
}

function clamp(){
  var cur = "seeker";
  try {
    cur = localStorage.getItem("clarity_committed_path")
      || document.documentElement.getAttribute("data-clarity-path")
      || "seeker";
  } catch(e){}
  if (ORDER.indexOf(cur) < 0) cur = "seeker";
  var max = getMax();
  if (idx(cur) > max) cur = ORDER[max];
  return cur;
}

function ensureIntro(){
  try {
    var host = document.querySelector(".clarity-gate-switcher, #clarity-path-strip, .gps-strip");
    if (!host || host.querySelector(".cgp-intro")) return;
    var p = document.createElement("p");
    p.className = "cgp-intro";
    p.style.cssText = "font-size:0.82rem;opacity:0.9;margin:0.35rem 0 0.5rem;line-height:1.45";
    p.innerHTML = "<strong>Phased learning</strong> — start as Seeker. A short quiz unlocks the next door once; earlier sections stay with you.";
    host.insertBefore(p, host.firstChild);
  } catch(e){}
}

window.clarityPathResetToSeeker = function(){
  try {
    localStorage.setItem(UNLOCK_KEY, "0");
    localStorage.setItem("clarity_committed_path", "seeker");
    localStorage.setItem("clarity_path_override", "seeker");
    localStorage.setItem("clarity_path_focus", "seeker");
    localStorage.removeItem(PASSED_KEY);
    localStorage.removeItem("clarity_path_quiz_done");
  } catch(e){}
  try {
    document.documentElement.setAttribute("data-clarity-path", "seeker");
    document.body.setAttribute("data-clarity-path", "seeker");
  } catch(e){}
  applyContent("seeker", { goReminder: true });
  return { ok: true, path: "seeker" };
};

window.clarityWelcomePickTrack = function(gate){
  gate = String(gate || "seeker");
  if (ORDER.indexOf(gate) < 0) gate = "seeker";
  try {
    localStorage.setItem("clarity_welcome_seen_v2", "1");
    localStorage.setItem("clarity_welcome_seen", "1");
    localStorage.setItem("clarity_committed_path", gate);
    localStorage.setItem("clarity_path_override", gate);
    localStorage.setItem("clarity_path_focus", gate);
    /* First-visit choice grants that door and all below — no quiz for prior steps */
    setMax(idx(gate));
    for (var i = 0; i <= idx(gate); i++) setPassed(ORDER[i]);
  } catch(e){}
  try {
    if (typeof window.clarityFinishWelcome === "function") window.clarityFinishWelcome(false);
    else {
      var el = document.getElementById("clarity-welcome");
      if (el) { el.classList.remove("show"); el.setAttribute("aria-hidden", "true"); }
    }
  } catch(e){}
  try {
    var td = document.getElementById("clarity-three-doors");
    if (td) { td.classList.add("hidden"); td.style.setProperty("display", "none", "important"); }
  } catch(e){}
  applyContent(gate, { goReminder: true });
  try { if (window.clarityUnlockScroll) window.clarityUnlockScroll(); } catch(e){}
  return { ok: true, path: gate };
};

window.clarityWelcomeSkipToName = function(){
  return window.clarityWelcomePickTrack("seeker");
};

window.clarityCommitGate = function(gate){
  return window.clarityWelcomePickTrack(gate);
};

window.clarityPickPrimaryDoor = function(door){
  var map = { today: "seeker", learn: "practicing", prepare: "dai" };
  if (map[door]) return window.clarityWelcomePickTrack(map[door]);
  try {
    var td = document.getElementById("clarity-three-doors");
    if (td) { td.classList.add("hidden"); td.style.display = "none"; }
  } catch(e){}
};

/**
 * Request a path:
 * - Already unlocked → switch focus, never quiz
 * - Next sequential door → quiz once
 * - Skip ahead → quiz for the next sequential door only
 */
window.clarityRequestPath = function(gate){
  gate = String(gate || "seeker");
  if (ORDER.indexOf(gate) < 0) gate = "seeker";
  if (window.__clarityPathBypass) { applyContent(gate); return { ok: true }; }

  var ti = idx(gate);
  var max = getMax();

  if (doorCleared(gate) || ti <= max) {
    setMax(Math.max(max, ti));
    applyContent(gate);
    return { ok: true, reason: "unlocked" };
  }

  /* Only quiz the next door in sequence */
  var nextGate = ORDER[Math.min(max + 1, ORDER.length - 1)];
  if (ti > max + 1) {
    openQuiz(ORDER[max], nextGate);
    markUI(ORDER[max]);
    return { ok: false, reason: "quiz-next", next: nextGate };
  }
  openQuiz(ORDER[max], gate);
  return { ok: false, reason: "quiz" };
};

function wire(){
  if (typeof window.__clarityPathDoSwitchRaw !== "function") {
    if (typeof window.claritySwitchGate === "function" && !window.claritySwitchGate.__isRequest) {
      window.__clarityPathDoSwitchRaw = window.claritySwitchGate;
    } else if (typeof window.applyGateSectionFilter === "function") {
      window.__clarityPathDoSwitchRaw = function(g){
        try { window.applyGateSectionFilter(g); } catch(e){}
      };
    }
  }
  window.claritySwitchGate = function(g){ return window.clarityRequestPath(g); };
  window.claritySwitchGate.__isRequest = true;
  window.applyGateConfiguration = window.claritySwitchGate;
  window.applyGateSectionFilter = function(g){ applyPathFilter(g || clamp()); };
  window.applyAdditiveFilter = window.applyGateSectionFilter;
  window.applyExclusiveFilter = window.applyGateSectionFilter;
}

var __pathBooted = false;
function boot(){
  if (__pathBooted) {
    /* late load pass: re-wire + soft filter only — avoid second applyContent cascade */
    wire();
    try {
      var g = clamp();
      applyPathFilter(g);
      markUI(g);
    } catch(e){}
    return;
  }
  __pathBooted = true;
  try {
    if (localStorage.getItem(UNLOCK_KEY) == null) setMax(0);
  } catch(e){}
  wire();
  ensureIntro();
  var cur = clamp();
  applyContent(cur);
  markUI(cur);
}

if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 150); });
else setTimeout(boot, 150);
window.addEventListener("load", function(){
  setTimeout(wire, 50);
  setTimeout(boot, 280);
});

window.clarityPathProgress = {
  order: ORDER,
  getMax: getMax,
  doorCleared: doorCleared,
  apply: applyPathFilter,
  reapply: function(){ var g = clamp(); applyPathFilter(g); markUI(g); },
  reset: function(){ return window.clarityPathResetToSeeker(); }
};
})();

/* ---- clarity-path-discipline (appended) ---- */
/* NOTE: Must NOT reapply on clarity-path-changed — applyPathFilter already owns the filter
   and dispatches that event. Re-listening caused infinite freeze when switching learning tabs. */
(function (g) {
  "use strict";
  if (g.__CLARITY_PATH_DISCIPLINE_V2__) return;
  g.__CLARITY_PATH_DISCIPLINE_V2__ = true;
  var __discOnce = false;
  function reapply() {
    try {
      if (g.clarityPathProgress && typeof g.clarityPathProgress.reapply === "function") {
        g.clarityPathProgress.reapply();
        return;
      }
    } catch (e) {}
  }
  function boot() {
    if (__discOnce) return;
    __discOnce = true;
    reapply();
    setTimeout(reapply, 500);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("load", function () { setTimeout(reapply, 300); });
  /* Intentionally no clarity-path-changed listener — that loop froze the SPA on tab switch */
})(typeof window !== "undefined" ? window : this);
