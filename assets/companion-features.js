/*!
 * companion-features.js
 * T-FEAT-01 · Phase 0–6 Governance Contract
 * Bismillah.
 * Enrichment: held
 * Load AFTER companion-boot.js
 * Contains: tab-persist · craft-core · path-progress · path-governance · grave-path · link-stubs
 * No vault scripts. No boot/guards.
 * Educational only — not a fatwa.
 */

/* === 1. companion-tab-persist-v35.js === */
/*! companion-tab-persist-v35 · N1 single path · default Reminder · campus untouched */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_TAB_PERSIST_V35__) return;
  w.__CLARITY_TAB_PERSIST_V35__ = true;

  var KEY = "clarity_companion_tab_v1";
  var VALID = {
    reminder: "tab-reminder",
    reality: "tab-reality",
    reflection: "tab-reflection",
    action: "tab-action",
    notes: "tab-notes",
    about: "tab-about"
  };

  function normalize(id) {
    id = String(id || "").toLowerCase().replace(/^#/, "");
    if (id === "journey" || id === "commands" || id === "seerah") id = "reminder";
    if (id === "tajweed" || id === "callig" || id === "calligraphy" || id === "meme") id = "action";
    if (!VALID[id]) return null;
    return id;
  }

  function showTab(id, write) {
    id = normalize(id) || "reminder";
    var panelId = VALID[id];
    d.querySelectorAll(".tab-panel").forEach(function (p) {
      var on = p.id === panelId;
      p.classList.toggle("is-active", on);
      p.classList.toggle("active", on);
      p.setAttribute("aria-hidden", on ? "false" : "true");
      if (on) p.removeAttribute("hidden");
    });
    d.querySelectorAll("[data-rail-tab], [data-rrra]").forEach(function (btn) {
      var t = (btn.getAttribute("data-rail-tab") || btn.getAttribute("data-rrra") || "").toLowerCase();
      btn.classList.toggle("is-active", t === id);
    });
    if (write !== false) {
      try { localStorage.setItem(KEY, id); } catch (e) {}
      try {
        var want = "#" + id;
        if ((w.location.hash || "") !== want) history.replaceState(null, "", want);
      } catch (e2) {}
    }
  }

  function resolveInitial() {
    var fromHash = normalize((w.location.hash || "").replace(/^#/, ""));
    if (fromHash) return fromHash;
    try {
      var saved = normalize(localStorage.getItem(KEY));
      if (saved) return saved;
    } catch (e) {}
    return "reminder";
  }

  w.clarityShowCompanionTab = showTab;

  function wrapDoor() {
    var prev = w.clarityOpenSectionDoor;
    w.clarityOpenSectionDoor = function (id) {
      var n = normalize(id);
      if (n) showTab(n, true);
      if (typeof prev === "function") {
        try { return prev.apply(this, arguments); } catch (e) {}
      }
    };
  }

  function boot() {
    wrapDoor();
    showTab(resolveInitial(), true);
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("hashchange", function () {
    var id = normalize((w.location.hash || "").replace(/^#/, ""));
    if (id) showTab(id, true);
  });
})(window, document);

/* === 2. companion-craft-core-v1.js === */
/*! companion-craft-core-v1 · N2 eager meme/tajweed/callig cores · campus untouched */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_CRAFT_CORE_V1__) return;
  w.__CLARITY_CRAFT_CORE_V1__ = true;

  var LOG = (w.__COMPANION_CRAFT_LOG = w.__COMPANION_CRAFT_LOG || []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  var CORE = [
    "/companion/assets/clarity-meme-api-bridge-v1.js?v=20261104EC",
    "/companion/modules/inline-clarity_lmr_read_sync.js?v=20261104N02",
    "/companion/modules/nx-tj-lmr-js-v1.js?v=20261104N02",
    "/companion/modules/inline-nx-tajweed-deep-studio-js-v1.js?v=20261104N02",
    "/companion/modules/inline-clarity_callig_pad_boot.js?v=20261104N02",
    "/companion/modules/inline-clarity-meme-canvas-clean-v1.js?v=20261104N02",
    "/companion/modules/inline-clarity-meme-online-bg-v1.js?v=20261104STAB",
    "/companion/modules/inline-bundle-meme-v1.js?v=20261104N02",
    "/companion/modules/inline-clarity_meme_unlock_v2.js?v=20261104N02",
    "/companion/assets/clarity-craft-integrity-v35.js?v=20261104N02"
  ];

  var EXTRA = [
        "/companion/modules/inline-clarity_meme_push_cards.js?v=20261104N02",
    "/companion/modules/inline-clarity-tj-meme-tweet-revamp-js.js?v=20261104N02"
  ];

  var loaded = {};

  function loadScript(src) {
    return new Promise(function (resolve) {
      var bare = src.split("?")[0];
      if (loaded[bare]) return resolve(bare);
      if (d.querySelector('script[src*="' + bare.replace(/"/g, "") + '"]')) {
        loaded[bare] = true;
        return resolve(bare);
      }
      var s = d.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = function () {
        loaded[bare] = true;
        log("core " + bare);
        resolve(bare);
      };
      s.onerror = function () {
        log("fail " + bare);
        resolve(bare);
      };
      d.head.appendChild(s);
    });
  }

  function loadAll(list) {
    return list.reduce(function (p, src) {
      return p.then(function () { return loadScript(src); });
    }, Promise.resolve());
  }

  function boot() {
    log("core-start");
    loadAll(CORE).then(function () {
      log("core-ready");
      try {
        d.dispatchEvent(new CustomEvent("clarity-craft-ready", { detail: { group: "core" } }));
      } catch (e) {}
      try {
        if (typeof w.clarityEnsureCraftMeters === "function") w.clarityEnsureCraftMeters();
      } catch (e2) {}
      /* extras idle */
      var runExtra = function () { loadAll(EXTRA).then(function () { log("extra-ready"); }); };
      if (typeof w.requestIdleCallback === "function") {
        w.requestIdleCallback(runExtra, { timeout: 5000 });
      } else {
        setTimeout(runExtra, 3000);
      }
    });
  }

  w.clarityLoadCraft = function (name) {
    /* compat for older hooks — cores already loading */
    log("loadCraft:" + name);
    return loadAll(CORE);
  };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);

/* === 3. clarity-path-progress-v1.js === */

(function(){
"use strict";
if (window.__CLARITY_PATH_PROGRESS_V4__) return;
window.__CLARITY_PATH_PROGRESS_V4__ = true;

/**
 * Phased doors + smooth quiz + ADDITIVE sections
 * As user unlocks higher doors, content from earlier doors remains available
 * (union of allowlists from seeker … selected path).
 */

var ORDER = ["seeker", "new_muslim", "practicing", "dai"];
var LABELS = {
  seeker: "Seeker",
  new_muslim: "New Muslim",
  practicing: "Daily Muslim",
  dai: "Da’i"
};
var UNLOCK_KEY = "clarity_path_unlocked_max";

var ALLOW = {
  /* SEEK: wake the heart — death, deeds, short light */
  seeker: {
    "commands-card":1,"samina-verse-card":1,"samina-card":1,"about-clarity-card":1,
    "soul-compass-card":1,"hell-sins-card":1,"night-breath-card":1,
    "seerah-live-card":1,"creation-tongue-reflection":1,"grave-path-card":1
  },
  /* NEW MUSLIM: establish pillars — prayer, purity, short path, basic fiqh */
  new_muslim: {
    "commands-card":1,"samina-verse-card":1,"samina-card":1,"ilm-pathway-card":1,
    "about-clarity-card":1,"soul-compass-card":1,"seerah-live-card":1,
    "night-breath-card":1,"hajj-guide-card":1,"fiqh-quiz-card":1,
    "grave-path-card":1,"new-muslim-foundations-card":1,"salah-starter-card":1
  },
  /* DAILY: craft & consistency — tajweed, calligraphy, review, character */
  practicing: {
    "commands-card":1,"samina-verse-card":1,"samina-card":1,"ilm-pathway-card":1,
    "about-clarity-card":1,"soul-compass-card":1,"seerah-live-card":1,
    "hell-sins-card":1,"night-breath-card":1,"weekly-review-card":1,
    "tajweed-live-card":1,"tajweed-path-card":1,"tj-deep-studio":1,"tj-lmr-score-card":1,
    "callig-lab-card":1,"meme-card":1,"tibbe-nabwi-card":1,"seerah-mirror-card":1,
    "najiha-tafseer-card":1,"tafseer-resources-card":1,"deepen-study-card":1,
    "asma-names-lecture-card":1,"creation-tongue-reflection":1,"hajj-checklist-card":1,
    "grave-path-card":1,"daily-deed-ledger-card":1
  },
  /* DAI: transmit light — teaching tools, critical study, legacy */
  dai: {
    "commands-card":1,"samina-verse-card":1,"samina-card":1,"ilm-pathway-card":1,
    "about-clarity-card":1,"soul-compass-card":1,"seerah-live-card":1,
    "hell-sins-card":1,"night-breath-card":1,"deepen-study-card":1,
    "asma-names-lecture-card":1,"tafseer-resources-card":1,"creation-tongue-reflection":1,
    "hajj-guide-card":1,"hajj-checklist-card":1,"fiqh-quiz-card":1,
    "meme-card":1,"callig-lab-card":1,"tweet-desk-card":1,
    "tajweed-live-card":1,"tajweed-path-card":1,"tj-deep-studio":1,"tj-lmr-score-card":1,
    "weekly-review-card":1,"tibbe-nabwi-card":1,"seerah-mirror-card":1,
    "najiha-tafseer-card":1,"israeliyat-card":1,"sealed-nectar-card":1,
    "tajalliyat-lecture-card":1,"tafseer-live-card":1,"authentic-learning-stack":1,
    "voice-translator-card":1,"grave-path-card":1,"daily-deed-ledger-card":1,
    "dai-transmit-card":1,"new-muslim-foundations-card":1,"salah-starter-card":1
  }
}
try { window.ALLOW = ALLOW; } catch(e){}
;
var VAULT = {
  "user-family-tree-card":1,"faraid-card":1,"wasiyyah-card":1,
  "uft-cards-file":1,"uft-build-from-cards":1,"uft-card-search":1,
  "uft-rel-card-search":1,"uft-rel-cards":1
};

var QUIZZES = {
  1: [
    { q: "Shahāda affirms belief in:", opts: ["Allah alone and Muhammad ﷺ as His Messenger", "Culture only", "Any idol", "Travel alone"], a: 0 },
    { q: "Before ṣalāh when required, one performs:", opts: ["Wudu (ablution)", "A social media post", "A payment", "Silence only"], a: 0 },
    { q: "The five daily prayers are:", opts: ["A core practiced pillar of the religion", "Optional decoration", "Only for imams", "Replaced by intention alone"], a: 0 }
  ],
  2: [
    { q: "Steady growth is best as:", opts: ["Consistent sincere deeds", "Only online debates", "Abandoning prayer when busy", "Never opening the Qur’an"], a: 0 },
    { q: "Tajweed primarily helps:", opts: ["Correct Qur’an recitation", "Business ads", "Astrology", "Skipping ṣalāh"], a: 0 },
    { q: "Family legacy notes are:", opts: ["Educational readiness — not a website fatwa", "Final court orders", "Public shaming tools", "A way to hide debts"], a: 0 }
  ],
  3: [
    { q: "Calm dawah prioritises:", opts: ["Sincerity, authentic sources, manners", "Winning by mockery", "Invented rulings", "Hiding references"], a: 0 },
    { q: "If unsure of a ruling:", opts: ["Ask qualified local scholarship / trusted sources", "Post a confident guess", "Follow the angriest comment", "Ignore harm"], a: 0 },
    { q: "Sharing scripture publicly needs:", opts: ["Care for authenticity and context", "Editing the text for drama", "No reference", "Guaranteed salvation claims"], a: 0 }
  ]
};

function idx(g){ var i = ORDER.indexOf(String(g||"")); return i < 0 ? 0 : i; }
function getMax(){
  try {
    var n = parseInt(localStorage.getItem(UNLOCK_KEY)||"0", 10);
    if (isNaN(n)||n<0) n = 0;
    return Math.min(ORDER.length-1, n);
  } catch(e){ return 0; }
}
function setMax(n){
  n = Math.max(0, Math.min(ORDER.length-1, n|0));
  try { localStorage.setItem(UNLOCK_KEY, String(n)); } catch(e){}
  return n;
}

/** Union of allowlists from seeker through gate (additive progress) */
function unionAllow(gate){
  var upto = idx(gate);
  var u = {};
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
}

/** Additive path filter — overrides exclusive filter */
function applyAdditiveFilter(gate){
  gate = ORDER.indexOf(gate) >= 0 ? gate : "seeker";
  try {
    document.documentElement.setAttribute("data-clarity-path", gate);
    document.body.setAttribute("data-clarity-path", gate);
  } catch(e){}
  var allow = unionAllow(gate);
  var openAll = (gate === "dai");
  document.querySelectorAll(".card, [id$='-card']").forEach(function(el){
    var id = el.id || "";
    if (openAll) { showEl(el); return; }
    if (id && VAULT[id]) { showEl(el); return; }
    if (el.closest && el.closest("#tab-notes, #amana-vault-interior")) { showEl(el); return; }
    if (id === "cw-card") { showEl(el); return; }
    var ok = (id && allow[id] === 1) ||
      (el.classList && el.classList.contains("card-commands") && allow["commands-card"]);
    if (!ok && id === "tajweed-path-card" && allow["tajweed-path-card"]) ok = true;
    if (!ok && id === "tj-deep-studio" && allow["tj-deep-studio"]) ok = true;
    if (ok) showEl(el);
    else hideEl(el);
  });
  /* dynamic CSS lock for additive */
  installAdditiveLock(gate, allow);
  /* Ensure Daily/Da’i modules actually appear after filter */
  if (gate === "practicing" || gate === "dai") {
    ["meme-card","callig-lab-card","tweet-desk-card","tajweed-live-card","tajweed-path-card","tj-deep-studio"].forEach(function(id){
      if (allow[id]) showEl(document.getElementById(id));
    });
  }
  try { if (typeof window.clarityMemeUiSync === "function") window.clarityMemeUiSync(); } catch(e){}
}

function installAdditiveLock(gate, allow){
  var el = document.getElementById("clarity-path-lock");
  if (!el) { el = document.createElement("style"); el.id = "clarity-path-lock"; }
  var hideIds = [];
  document.querySelectorAll(".card[id], [id$='-card']").forEach(function(node){
    var id = node.id;
    if (!id || VAULT[id] || allow[id]) return;
    hideIds.push(id);
  });
  /* also known advanced cards not in union */
  ["meme-card","tweet-desk-card","callig-lab-card","tajweed-live-card","israeliyat-card","najiha-tafseer-card"].forEach(function(id){
    if (!allow[id] && hideIds.indexOf(id) < 0) hideIds.push(id);
  });
  if (gate === "dai") {
    el.textContent = "/* dai: all sections open */";
    try { document.documentElement.appendChild(el); } catch(e){}
    return;
  }
  var css = hideIds.map(function(id){
    return 'html[data-clarity-path="'+gate+'"] #'+id+
      ',html[data-clarity-path="'+gate+'"] #tab-reminder.is-active #'+id;
  }).join(',') + (hideIds.length
    ? '{display:none!important;visibility:hidden!important;height:0!important;overflow:hidden!important;}'
    : '/* all open */');
  el.textContent = css;
  try { document.documentElement.appendChild(el); } catch(e){}
}

function applyContent(gate){
  gate = ORDER.indexOf(gate) >= 0 ? gate : "seeker";
  try {
    localStorage.setItem("clarity_committed_path", gate);
    localStorage.setItem("clarity_path_override", gate);
  } catch(e){}
  /* Call raw switch for badge/theme, then force additive filter */
  var raw = window.__clarityPathDoSwitchRaw;
  if (typeof raw === "function") {
    window.__clarityPathBypass = true;
    try { raw(gate); } finally { window.__clarityPathBypass = false; }
  }
  applyAdditiveFilter(gate);
  /* Bring user to the natural hub for this path so sections are visible */
  try {
    var hub = (gate === "practicing") ? "action" : (gate === "dai") ? "reminder" : "reminder";
    if (typeof switchTab === "function") switchTab(hub);
  } catch(e){}
  setTimeout(function(){ applyAdditiveFilter(gate); }, 80);
  setTimeout(function(){ applyAdditiveFilter(gate); }, 400);
  setTimeout(function(){ applyAdditiveFilter(gate); }, 900);
  try {
    var badge = document.getElementById("current-mode-badge");
    var labels = {seeker:"SEEKER JOURNEY MODE", new_muslim:"NEW MUSLIM TRACK", practicing:"DAILY MUSLIM / LEGACY", dai:"ASPIRING DA’I TRACK"};
    if (badge) badge.textContent = labels[gate] || badge.textContent;
  } catch(e){}
  markUI(gate);
}

function clamp(){
  var max = getMax();
  var cur = "seeker";
  try {
    cur = localStorage.getItem("clarity_committed_path") || document.documentElement.getAttribute("data-clarity-path") || "seeker";
  } catch(e){}
  if (idx(cur) > max) {
    cur = ORDER[max];
    applyContent(cur);
  }
  return ORDER.indexOf(cur) >= 0 ? cur : ORDER[max];
}

function ensureIntro(){
  if (document.getElementById("clarity-path-intro")) return;
  var host = document.querySelector(".clarity-gate-switcher");
  if (!host || !host.parentNode) return;
  var el = document.createElement("div");
  el.id = "clarity-path-intro";
  el.className = "clarity-path-intro";
  el.innerHTML =
    "<strong>Phased learning</strong> — start as <em>Seeker</em>. A short quiz unlocks the next door. " +
    "As you rise, <em>earlier sections stay with you</em> and new modules are added. " +
    "You may always step back down. Vault stays optional and private." +
    "<div class=\"cpi-row\">" +
      "<span class=\"cpi-pill\">1 Seeker</span>" +
      "<span class=\"cpi-pill\">2 + New Muslim</span>" +
      "<span class=\"cpi-pill\">3 + Daily</span>" +
      "<span class=\"cpi-pill\">4 + Da’i</span>" +
    "</div>";
  host.parentNode.insertBefore(el, host);
}

function markUI(current){
  var max = getMax();
  current = current || ORDER[Math.min(max, idx(clamp()))];
  document.querySelectorAll(".cgs-btn, [data-gate]").forEach(function(btn){
    var g = btn.getAttribute("data-gate");
    if (!g) return;
    btn.classList.toggle("path-locked", idx(g) > max);
    btn.classList.toggle("is-active", g === current);
  });
  var host = document.querySelector(".clarity-gate-switcher");
  if (!host) return;
  var rail = document.getElementById("clarity-path-rail");
  if (!rail) {
    rail = document.createElement("div");
    rail.id = "clarity-path-rail";
    host.parentNode.insertBefore(rail, host.nextSibling);
  }
  if (rail && rail.parentNode) rail.parentNode.removeChild(rail); /* single track UI only */
}

/* ---- Smooth quiz ---- */
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
    setMax(Math.max(getMax(), idx(target)));
    applyContent(target);
  } else {
    markUI(clamp());
  }
}
function openQuiz(from, target){
  var ti = idx(target);
  var qs = QUIZZES[ti];
  if (!qs) return;
  Q = { from: from, target: target, qs: qs, step: 0, correct: 0, busy: false };
  var m = ensureModal();
  paintQuiz();
  /* open next frame for smooth transition */
  requestAnimationFrame(function(){
    m.classList.add("open");
  });
}
function paintQuiz(){
  var inner = document.getElementById("cpq-inner");
  if (!inner || !Q) return;
  if (Q.step >= Q.qs.length) {
    var ok = Q.correct >= Q.qs.length;
    inner.innerHTML = "<h3>"+(ok?"Door unlocked":"Not yet")+"</h3>"+
      "<p class=\"cpq-sub\">"+(ok
        ? ("Welcome to <strong>"+LABELS[Q.target]+"</strong>. Earlier modules stay available; new ones are added.")
        : ("Score "+Q.correct+"/"+Q.qs.length+". Stay on <strong>"+LABELS[Q.from]+"</strong> and try again."))+"</p>"+
      "<div class=\"cpq-actions\">"+
      (ok?"<button type=\"button\" class=\"cpq-primary\" id=\"cpq-go\">Enter path</button>":
          "<button type=\"button\" class=\"cpq-primary\" id=\"cpq-retry\">Try again</button>")+
      "<button type=\"button\" id=\"cpq-x\">Close</button></div>";
    var go = document.getElementById("cpq-go");
    if (go) go.onclick = function(){ closeQuiz(true); };
    var retry = document.getElementById("cpq-retry");
    if (retry) retry.onclick = function(){ openQuiz(Q.from, Q.target); };
    var x = document.getElementById("cpq-x");
    if (x) x.onclick = function(){ closeQuiz(false); };
    return;
  }
  var item = Q.qs[Q.step];
  inner.innerHTML = "<h3>Unlock "+LABELS[Q.target]+"</h3>"+
    "<p class=\"cpq-sub\">Question "+(Q.step+1)+" of "+Q.qs.length+" · All correct to unlock · Refresh cannot skip</p>"+
    "<div class=\"cpq-q\">"+item.q+"</div>"+
    item.opts.map(function(o,i){ return "<button type=\"button\" class=\"cpq-opt\" data-i=\""+i+"\">"+o+"</button>"; }).join("")+
    "<div class=\"cpq-actions\"><button type=\"button\" id=\"cpq-stay\">Stay on "+LABELS[Q.from]+"</button></div>";
  inner.querySelectorAll(".cpq-opt").forEach(function(btn){
    btn.onclick = function(){
      if (!Q || Q.busy) return;
      Q.busy = true;
      var i = parseInt(btn.getAttribute("data-i"),10);
      var good = i === item.a;
      if (good) Q.correct++;
      btn.classList.add(good?"correct":"wrong");
      inner.querySelectorAll(".cpq-opt").forEach(function(b){
        if (parseInt(b.getAttribute("data-i"),10)===item.a) b.classList.add("correct");
        b.disabled = true;
      });
      setTimeout(function(){ if(Q){ Q.busy=false; Q.step++; paintQuiz(); } }, 480);
    };
  });
  var stay = document.getElementById("cpq-stay");
  if (stay) stay.onclick = function(){ closeQuiz(false); };
}

window.clarityRequestPath = function(gate){
  gate = String(gate||"seeker");
  if (ORDER.indexOf(gate)<0) gate = "seeker";
  if (window.__clarityPathBypass) { applyContent(gate); return {ok:true}; }
  var max = getMax();
  var ti = idx(gate);
  if (ti <= max) {
    applyContent(gate);
    return { ok: true };
  }
  if (ti > max + 1) {
    alert("Open doors in order.\nNext: " + LABELS[ORDER[max+1]] + " (short quiz).");
    markUI(ORDER[max]);
    return { ok: false, reason: "skip" };
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
  /* Override exclusive filter with additive */
  window.applyGateSectionFilter = function(g){ applyAdditiveFilter(g || clamp()); };
}

function boot(){
  if (localStorage.getItem(UNLOCK_KEY) == null) setMax(0);
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
  reset: function(){
    try {
      localStorage.setItem(UNLOCK_KEY, "0");
      localStorage.setItem("clarity_committed_path", "seeker");
    } catch(e){}
    applyContent("seeker");
  }
};
})();

/* === 4. companion-path-governance-v1.js === */
/*! companion-path-governance-v1
 * Single gardener for four-path module wiring.
 * Source of truth: clarity-path-progress ALLOW (window.ALLOW) when present.
 * - Selected path only (no additive leak)
 * - All live module cards mapped
 * - Vault cards stay suppressed on Companion (Amānah owns)
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_PATH_GOVERNANCE_V1__) return;
  w.__COMPANION_PATH_GOVERNANCE_V1__ = true;

  var ORDER = ["seeker", "new_muslim", "practicing", "dai"];
  var LABELS = {
    seeker: "1 Seeker",
    new_muslim: "2 New Muslim",
    practicing: "3 Daily",
    dai: "4 Da’i"
  };

  /* Fallback = path-progress governance (kept in sync with live ALLOW) */
  var ALLOW_FALLBACK = {
    seeker: {
      "commands-card": 1, "samina-verse-card": 1, "samina-card": 1, "about-clarity-card": 1,
      "soul-compass-card": 1, "hell-sins-card": 1, "night-breath-card": 1, "seerah-live-card": 1,
      "creation-tongue-reflection": 1, "grave-path-card": 1
    },
    new_muslim: {
      "commands-card": 1, "samina-verse-card": 1, "samina-card": 1, "ilm-pathway-card": 1,
      "about-clarity-card": 1, "soul-compass-card": 1, "seerah-live-card": 1, "night-breath-card": 1,
      "hajj-guide-card": 1, "fiqh-quiz-card": 1, "grave-path-card": 1,
      "new-muslim-foundations-card": 1, "salah-starter-card": 1
    },
    practicing: {
      "commands-card": 1, "samina-verse-card": 1, "samina-card": 1, "ilm-pathway-card": 1,
      "about-clarity-card": 1, "soul-compass-card": 1, "seerah-live-card": 1, "hell-sins-card": 1,
      "night-breath-card": 1, "weekly-review-card": 1, "tajweed-live-card": 1, "tajweed-path-card": 1,
      "tj-deep-studio": 1, "tj-lmr-score-card": 1, "callig-lab-card": 1, "meme-card": 1,
      "tibbe-nabwi-card": 1, "seerah-mirror-card": 1, "najiha-tafseer-card": 1,
      "tafseer-resources-card": 1, "deepen-study-card": 1, "asma-names-lecture-card": 1,
      "creation-tongue-reflection": 1, "hajj-checklist-card": 1, "grave-path-card": 1,
      "daily-deed-ledger-card": 1
    },
    dai: {
      "commands-card": 1, "samina-verse-card": 1, "samina-card": 1, "ilm-pathway-card": 1,
      "about-clarity-card": 1, "soul-compass-card": 1, "seerah-live-card": 1, "hell-sins-card": 1,
      "night-breath-card": 1, "deepen-study-card": 1, "asma-names-lecture-card": 1,
      "tafseer-resources-card": 1, "creation-tongue-reflection": 1, "hajj-guide-card": 1,
      "hajj-checklist-card": 1, "fiqh-quiz-card": 1, "meme-card": 1, "callig-lab-card": 1,
      "tweet-desk-card": 1, "tajweed-live-card": 1, "tajweed-path-card": 1, "tj-deep-studio": 1,
      "tj-lmr-score-card": 1, "weekly-review-card": 1, "tibbe-nabwi-card": 1, "seerah-mirror-card": 1,
      "najiha-tafseer-card": 1, "israeliyat-card": 1, "sealed-nectar-card": 1,
      "tajalliyat-lecture-card": 1, "tafseer-live-card": 1, "authentic-learning-stack": 1,
      "voice-translator-card": 1, "grave-path-card": 1, "daily-deed-ledger-card": 1,
      "dai-transmit-card": 1, "new-muslim-foundations-card": 1, "salah-starter-card": 1
    }
  };

  var VAULT = {
    "user-family-tree-card": 1, "faraid-card": 1, "wasiyyah-card": 1,
    "uft-cards-file": 1, "uft-build-from-cards": 1, "uft-card-search": 1,
    "uft-rel-card-search": 1, "uft-rel-cards": 1
  };

  function allowMap() {
    try {
      if (w.ALLOW && w.ALLOW.seeker && w.ALLOW.dai) return w.ALLOW;
    } catch (e) {}
    return ALLOW_FALLBACK;
  }

  function gate() {
    try {
      var g =
        localStorage.getItem("clarity_path_override") ||
        localStorage.getItem("clarity_committed_path") ||
        "seeker";
      return ORDER.indexOf(g) >= 0 ? g : "seeker";
    } catch (e) {
      return "seeker";
    }
  }

  function maxUnlocked() {
    try {
      var n = parseInt(localStorage.getItem("clarity_path_unlocked_max") || "0", 10);
      return isNaN(n) ? 0 : Math.max(0, Math.min(3, n));
    } catch (e) {
      return 0;
    }
  }

  function injectCss() {
    if (d.getElementById("path-gov-css")) return;
    var s = d.createElement("style");
    s.id = "path-gov-css";
    s.textContent = [
      ".path-filtered-out,.path-vault-suppressed{display:none!important;visibility:hidden!important;height:0!important;max-height:0!important;overflow:hidden!important;margin:0!important;padding:0!important;border:none!important;}",
      "html[data-clarity-path=seeker] #meme-card,html[data-clarity-path=seeker] .meme-card-realigned,html[data-clarity-path=seeker] #meme-studio-root,",
      "html[data-clarity-path=new_muslim] #meme-card,html[data-clarity-path=new_muslim] .meme-card-realigned,html[data-clarity-path=new_muslim] #meme-studio-root",
      "{display:none!important;visibility:hidden!important;height:0!important;overflow:hidden!important;}",
      "#clarity-path-pills{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.4rem;max-width:42rem;margin:.65rem auto .85rem;padding:.45rem .55rem;border-radius:999px;border:1px solid rgba(212,180,90,.35);background:linear-gradient(180deg,rgba(18,40,32,.92),rgba(8,20,16,.96));}",
      "#clarity-path-pills .cpp-label{font-size:.68rem;font-weight:800;letter-spacing:.06em;color:#e8d5a3;}",
      "#clarity-path-pills button.cpp-pill{border-radius:999px;border:1px solid rgba(212,180,90,.35);background:rgba(0,0,0,.28);color:#eef6f0;font-size:.78rem;font-weight:700;padding:.35rem .75rem;cursor:pointer;}",
      "#clarity-path-pills button.cpp-pill.is-active{background:rgba(30,125,94,.55);border-color:rgba(180,240,200,.45);}",
      "#clarity-path-pills button.cpp-pill.path-locked{opacity:.55;}",
      "#clarity-path-pills button.cpp-reset{border-radius:999px;border:1px solid rgba(212,180,90,.4);background:rgba(180,140,40,.35);color:#fff8e0;font-size:.75rem;font-weight:700;padding:.35rem .7rem;cursor:pointer;}"
    ].join("");
    (d.head || d.documentElement).appendChild(s);
  }

  function setVisible(el, on) {
    if (!el) return;
    if (on) {
      el.classList.remove("path-filtered-out", "path-vault-suppressed");
      el.hidden = false;
      el.style.removeProperty("display");
      el.removeAttribute("aria-hidden");
    } else {
      el.classList.add("path-filtered-out");
      el.hidden = true;
      el.style.setProperty("display", "none", "important");
      el.setAttribute("aria-hidden", "true");
    }
  }

  function apply(g) {
    injectCss();
    g = ORDER.indexOf(g) >= 0 ? g : gate();
    var ALLOW = allowMap();
    var allow = ALLOW[g] || ALLOW.seeker || {};
    d.documentElement.setAttribute("data-clarity-path", g);
    d.documentElement.setAttribute("data-path-filter", "governance-selected");
    d.documentElement.setAttribute("data-path-gov", "v1");

    var nodes = d.querySelectorAll(
      "[id$='-card'], #tj-deep-studio, #grave-path-card, #creation-tongue-reflection, #authentic-learning-stack, #meme-studio-root, .meme-card-realigned"
    );
    nodes.forEach(function (el) {
      var id = el.id || "";
      if (!id && el.classList.contains("meme-card-realigned")) id = "meme-card";
      if (!id) return;
      if (VAULT[id]) {
        el.classList.add("path-vault-suppressed");
        setVisible(el, false);
        return;
      }
      /* meme studio root follows meme-card */
      if (id === "meme-studio-root") {
        setVisible(el, !!allow["meme-card"]);
        return;
      }
      setVisible(el, allow[id] === 1);
    });

    /* Explicit meme hard rule */
    if (g === "seeker" || g === "new_muslim") {
      d.querySelectorAll("#meme-card, .meme-card-realigned, #meme-studio-root").forEach(function (el) {
        setVisible(el, false);
      });
    }

    paintPills(g);
  }

  function ensurePills() {
    var bar = d.getElementById("clarity-path-pills");
    if (bar) return bar;
    bar = d.createElement("div");
    bar.id = "clarity-path-pills";
    bar.setAttribute("role", "navigation");
    bar.setAttribute("aria-label", "Learning paths");
    var host = d.querySelector(".clarity-gate-switcher") || d.getElementById("commands-card");
    if (host && host.parentNode) host.parentNode.insertBefore(bar, host);
    else (d.querySelector("main") || d.body).appendChild(bar);
    return bar;
  }

  function paintPills(current) {
    var bar = ensurePills();
    var max = maxUnlocked();
    current = current || gate();
    var html = '<span class="cpp-label">TRACK</span>';
    ORDER.forEach(function (g, i) {
      html +=
        '<button type="button" class="cpp-pill' +
        (g === current ? " is-active" : "") +
        (i > max ? " path-locked" : "") +
        '" data-gate="' +
        g +
        '">' +
        LABELS[g] +
        (i > max ? " 🔒" : "") +
        "</button>";
    });
    html += '<button type="button" class="cpp-reset" id="cpp-reset-gov">Reset</button>';
    bar.innerHTML = html;
    bar.querySelectorAll("button.cpp-pill").forEach(function (btn) {
      btn.onclick = function () {
        var g = btn.getAttribute("data-gate");
        if (typeof w.clarityRequestPath === "function") w.clarityRequestPath(g);
        else {
          try {
            localStorage.setItem("clarity_path_override", g);
            localStorage.setItem("clarity_committed_path", g);
          } catch (e) {}
        }
        setTimeout(function () { apply(g); }, 50);
        setTimeout(function () { apply(gate()); }, 300);
      };
    });
    var reset = d.getElementById("cpp-reset-gov");
    if (reset) {
      reset.onclick = function () {
        try {
          localStorage.setItem("clarity_path_unlocked_max", "0");
          localStorage.setItem("clarity_path_override", "seeker");
          localStorage.setItem("clarity_committed_path", "seeker");
        } catch (e) {}
        apply("seeker");
      };
    }
  }

  function install() {
    w.applyAdditiveFilter = function (g) { apply(g || gate()); };
    w.applyGateSectionFilter = function (g) { apply(g || gate()); };
    var prev = w.clarityRequestPath;
    if (typeof prev === "function" && !prev.__gov) {
      w.clarityRequestPath = function (g) {
        var r = prev.apply(this, arguments);
        setTimeout(function () { apply(g || gate()); }, 40);
        setTimeout(function () { apply(gate()); }, 250);
        setTimeout(function () { apply(gate()); }, 700);
        return r;
      };
      w.clarityRequestPath.__gov = true;
    }
  }

  function boot() {
    install();
    apply(gate());
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(boot, 100);
    setTimeout(boot, 600);
    setTimeout(boot, 1500);
  });
  setInterval(function () {
    install();
    apply(gate());
  }, 2500);

  w.ClarityPathGovernance = {
    version: "v1",
    apply: apply,
    current: gate,
    allow: allowMap,
    order: ORDER
  };
})(window, document);

/* === 5. clarity-grave-path-curriculum-js.js === */

(function(){
  "use strict";
  if (window.__CLARITY_GRAVE_PATH_CURRICULUM__) return;
  window.__CLARITY_GRAVE_PATH_CURRICULUM__ = true;

  var PHASES = {
    seeker: {
      title: "Seeker · Wake the heart",
      goal: "Remember death. Send small light ahead. No overwhelm.",
      focus: "Soul audit · short reminders · seerah spark",
      hideExtra: true
    },
    new_muslim: {
      title: "New Muslim · Establish pillars",
      goal: "Wudu, salah, short surahs, clear belief — stability first.",
      focus: "Prayer · purification · basic fiqh · gentle path",
      hideExtra: true
    },
    practicing: {
      title: "Daily Muslim · Craft & consistency",
      goal: "Habits that outlive you: Qur'an craft, character, weekly review.",
      focus: "Tajweed · calligraphy · deed ledger · seerah mirror",
      hideExtra: false
    },
    dai: {
      title: "Aspiring Da'i · Transmit light",
      goal: "Teach with adab. Guard sources. Leave beneficial knowledge.",
      focus: "Dawah tools · critical study · family legacy",
      hideExtra: false
    }
  };

  function pathNow(){
    try {
      return document.documentElement.getAttribute("data-clarity-path")
        || localStorage.getItem("clarity_committed_path") || "seeker";
    } catch(e){ return "seeker"; }
  }

  function card(id, html){
    var el = document.getElementById(id);
    if (el) { el.innerHTML = html; return el; }
    el = document.createElement("div");
    el.id = id;
    el.className = "card";
    el.innerHTML = html;
    return el;
  }

  function gravePathHtml(){
    return '<div class="cred-stamp">Educational only — not a fatwa. Verify with Qur\'an, Sunnah, and a local scholar.</div>'
      + '<h2>🕯️ Furnish Your Grave · the real path</h2>'
      + '<p>The Prophet ﷺ taught that when a person dies, deeds end except ongoing charity, beneficial knowledge, and a righteous child who prays for them (Muslim). This track is ordered so each phase builds light you can send ahead.</p>'
      + '<ul style="margin:0.4rem 0 0.5rem;padding-left:1.2rem;font-size:0.88rem;line-height:1.5">'
      + '<li><strong>Seeker</strong> — softens the heart with death-awareness and small daily deeds.</li>'
      + '<li><strong>New Muslim</strong> — locks in prayer, purity, and clear belief before advanced tools.</li>'
      + '<li><strong>Daily</strong> — crafts Qur\'an, character, and a deed ledger that compounds.</li>'
      + '<li><strong>Da\'i</strong> — transmits carefully: sources, manners, family legacy.</li>'
      + '</ul>'
      + '<div class="gpc-links">'
      + '<a href="https://sunnah.com/muslim:1631" target="_blank" rel="noopener">Muslim 1631 · three continuing deeds</a>'
      + '<a href="https://quran.com/59/18" target="_blank" rel="noopener">Qur\'an 59:18 · let every soul look to what it sends forth</a>'
      + '<a href="https://islamqa.info/en/answers/69948" target="_blank" rel="noopener">IslamQA · sadaqah jariyah</a>'
      + '<a href="https://quran.com/2/201" target="_blank" rel="noopener">Qur\'an 2:201 · Rabbana</a>'
      + '</div>'
      + '<p class="gpc-note">Not a ruling service. Links are for study. Ask a qualified local teacher for personal guidance.</p>';
  }

  function foundationsHtml(){
    return '<h2>🌱 New Muslim foundations · first order</h2>'
      + '<p>Islamic learning has an order: belief, then daily worship, then manners and ḥalāl living — then deeper study. Quality and consistency beat speed.</p>'
      + '<ol style="margin:0.35rem 0;padding-left:1.2rem;font-size:0.86rem;line-height:1.5">'
      + '<li><strong>Week focus:</strong> Wuḍū\' and the five prayers — even imperfectly, begin.</li>'
      + '<li><strong>Memorize:</strong> Al-Fātiḥah + a few short surahs for prayer.</li>'
      + '<li><strong>Belief:</strong> Six articles of faith in plain language.</li>'
      + '<li><strong>Character:</strong> Truthfulness, prayer on time, guarding the tongue.</li>'
      + '</ol>'
      + '<div class="gpc-links">'
      + '<a href="https://quran.com/1" target="_blank" rel="noopener">Al-Fātiḥah · Qur\'an.com</a>'
      + '<a href="https://sunnah.com/bukhari:8" target="_blank" rel="noopener">Hadith · pillars of Islam</a>'
      + '<a href="https://quran.com/4/103" target="_blank" rel="noopener">Qur\'an 4:103 · prayer at fixed times</a>'
      + '<a href="https://seekersguidance.org" target="_blank" rel="noopener">SeekersGuidance · Absolute Essentials</a>'
      + '</div>'
      + '<p class="gpc-note">Educational outline only. Learn prayer with a living teacher when you can.</p>';
  }

  function salahHtml(){
    return '<h2>🕌 Salah starter · non-negotiable light</h2>'
      + '<p>The covenant between us and them is the prayer. Start with purity, then movements, then short recitation. Steady beats perfect-on-day-one.</p>'
      + '<ul style="margin:0.35rem 0;padding-left:1.2rem;font-size:0.86rem">'
      + '<li>Learn wuḍū\' steps; practice once after each prayer time reminder.</li>'
      + '<li>Pray the five — use a guide until memorized.</li>'
      + '<li>Add Al-Fātiḥah, then three short surahs.</li>'
      + '</ul>'
      + '<div class="gpc-links">'
      + '<a href="https://quran.com/23/1-2" target="_blank" rel="noopener">Qur\'an 23:1–2 · successful are the believers</a>'
      + '<a href="https://sunnah.com/nasai:463" target="_blank" rel="noopener">Prayer as covenant · study link</a>'
      + '<a href="https://quran.com/2/45" target="_blank" rel="noopener">Qur\'an 2:45 · seek help in patience and prayer</a>'
      + '</div>'
      + '<p class="gpc-note">Not a video course substitute — pair with a local mosque or trusted teacher.</p>';
  }

  function ledgerHtml(){
    return '<h2>📒 Daily deed ledger · send light ahead</h2>'
      + '<p>The most beloved deeds are those done consistently, even if small. Count for the grave — not for pride.</p>'
      + '<ul style="margin:0.35rem 0;padding-left:1.2rem;font-size:0.86rem">'
      + '<li>One page of Qur\'an with meaning</li>'
      + '<li>Istighfār &amp; ṣalawāt block</li>'
      + '<li>One kindness that costs little</li>'
      + '<li>One note for family legacy (private, on this device)</li>'
      + '</ul>'
      + '<div class="gpc-links">'
      + '<a href="https://sunnah.com/bukhari:6465" target="_blank" rel="noopener">Most beloved deeds · consistency</a>'
      + '<a href="https://sunnah.com/muslim:2699" target="_blank" rel="noopener">Gatherings of dhikr</a>'
      + '<a href="https://quran.com/18/46" target="_blank" rel="noopener">Qur\'an 18:46 · lasting righteous deeds</a>'
      + '</div>'
      + '<p class="gpc-note">Counts stay on this device. Educational habit tool — not a scoreboard for pride.</p>';
  }

  function daiHtml(){
    return '<h2>🕊️ Transmit · Da\'i with adab</h2>'
      + '<p>Call to Allah with wisdom. Beneficial knowledge continues after death. Guard sources; avoid inventing rulings.</p>'
      + '<ul style="margin:0.35rem 0;padding-left:1.2rem;font-size:0.86rem">'
      + '<li>Share only what you can source (Qur\'an / authentic Hadith / reliable teachers).</li>'
      + '<li>Prefer manners over winning arguments.</li>'
      + '<li>Leave written or taught knowledge that helps others worship correctly.</li>'
      + '</ul>'
      + '<div class="gpc-links">'
      + '<a href="https://quran.com/16/125" target="_blank" rel="noopener">Qur\'an 16:125 · invite with wisdom</a>'
      + '<a href="https://sunnah.com/muslim:1631" target="_blank" rel="noopener">Beneficial knowledge after death</a>'
      + '<a href="https://islamqa.info/en/answers/237764" target="_blank" rel="noopener">IslamQA · knowledge that benefits</a>'
      + '<a href="https://sunnah.com" target="_blank" rel="noopener">Sunnah.com · primary texts</a>'
      + '</div>'
      + '<p class="gpc-note">Clarity is educational only — not a fatwa desk. Personal rulings: ask a qualified local scholar.</p>';
  }

  function ensureCards(){
    var host = document.querySelector("#tab-reminder .main-content, #tab-reminder, #main-application-workspace, .page-wrapper")
      || document.body;
    var specs = [
      ["grave-path-card", gravePathHtml()],
      ["new-muslim-foundations-card", foundationsHtml()],
      ["salah-starter-card", salahHtml()],
      ["daily-deed-ledger-card", ledgerHtml()],
      ["dai-transmit-card", daiHtml()]
    ];
    specs.forEach(function(pair){
      var id = pair[0], html = pair[1];
      var el = document.getElementById(id);
      if (!el) {
        el = document.createElement("section");
        el.id = id;
        el.className = "card";
        el.setAttribute("data-grave-path-module", "1");
        var tab = document.getElementById("tab-reminder");
        if (tab) {
          /* Keep hub/intro first; append curriculum after existing intro blocks */
          var hub = tab.querySelector(".rrra-hub-body, #rrra-hub-body-reminder, .card-commands, #commands-card");
          if (hub && hub.parentNode === tab) {
            if (hub.nextSibling) tab.insertBefore(el, hub.nextSibling);
            else tab.appendChild(el);
          } else {
            tab.appendChild(el);
          }
        } else if (host) host.appendChild(el);
      }
      el.innerHTML = html;
    });
  }

  function ensureStrip(){
    var strip = document.getElementById("clarity-grave-path-strip");
    if (!strip) {
      strip = document.createElement("div");
      strip.id = "clarity-grave-path-strip";
      strip.className = "grave-path-strip";
      var anchor = document.getElementById("clarity-visit-pill-bar")
        || document.getElementById("clarity-top-duo")
        || document.querySelector(".page-wrapper");
      if (anchor && anchor.parentNode) {
        if (anchor.id === "clarity-visit-pill-bar" || anchor.id === "clarity-top-duo")
          anchor.parentNode.insertBefore(strip, anchor.nextSibling);
        else anchor.insertBefore(strip, anchor.firstChild);
      } else {
        document.body.insertBefore(strip, document.body.firstChild);
      }
    }
    var g = pathNow();
    var html = '<h3>Path to furnish the grave</h3>'
      + '<p class="gps-goal">Four doors. One aim: send light ahead — not a fatwa path.</p>'
      + '<div class="gps-phases">';
    ORDER.forEach(function(key){
      var p = PHASES[key];
      if (!p) return;
      html += '<button type="button" class="gps-phase'+(key===g?' active':'')+'" data-gate="'+key+'" onclick="typeof clarityRequestPath===\'function\'&&clarityRequestPath(\''+key+'\')">'
        + '<strong>'+p.title+'</strong>'+p.goal
        + '<span class="gps-tag">'+p.focus+'</span></button>';
    });
    html += '</div>';
    strip.innerHTML = html;
  }

  var ORDER = ["seeker","new_muslim","practicing","dai"];

  function syncVisibility(){
    var g = pathNow();
    ensureCards();
    ensureStrip();
    /* phase-specific show/hide for new modules only */
    var map = {
      seeker: ["grave-path-card"],
      new_muslim: ["grave-path-card","new-muslim-foundations-card","salah-starter-card"],
      practicing: ["grave-path-card","daily-deed-ledger-card"],
      dai: ["grave-path-card","dai-transmit-card","daily-deed-ledger-card","new-muslim-foundations-card"]
    };
    ["grave-path-card","new-muslim-foundations-card","salah-starter-card","daily-deed-ledger-card","dai-transmit-card"].forEach(function(id){
      var el = document.getElementById(id);
      if (!el) return;
      var show = (map[g] || []).indexOf(id) >= 0 || g === "dai";
      if (show) {
        el.classList.remove("gate-hidden");
        el.removeAttribute("data-gate-hidden");
        el.style.removeProperty("display");
      } else {
        el.classList.add("gate-hidden");
        el.setAttribute("data-gate-hidden","1");
        el.style.setProperty("display","none","important");
      }
    });
  }

  function boot(){ syncVisibility(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 400); });
  else setTimeout(boot, 400);
  window.addEventListener("load", function(){ setTimeout(boot, 900); });

  ["clarityRequestPath","applyAdditiveFilter","applyGateSectionFilter"].forEach(function(name){
    var fn = window[name];
    if (typeof fn === "function" && !fn.__gravePath) {
      window[name] = function(){
        var r = fn.apply(this, arguments);
        setTimeout(syncVisibility, 80);
        setTimeout(syncVisibility, 400);
        return r;
      };
      window[name].__gravePath = true;
    }
  });

  window.clarityGravePathSync = syncVisibility;
})();

/* === 6. clarity-link-stubs-v1.js === */
/**
 * Phase 0 stubs until core-block loads · 20261025
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_LINK_STUBS_V1__ === "20261025") return;
  w.__CLARITY_LINK_STUBS_V1__ = "20261025";

  function stub(name, fn) {
    if (typeof w[name] !== "function") w[name] = fn;
  }

  stub("claritySetThemeMode", function (mode) {
    mode = mode || "system";
    try { localStorage.setItem("clarity_theme_mode", mode); } catch (e) {}
    var resolved = mode;
    if (mode === "system") {
      try {
        resolved = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
      } catch (e) { resolved = "light"; }
    }
    try { document.documentElement.setAttribute("data-theme", resolved); } catch (e) {}
    try {
      document.querySelectorAll("[data-theme-chip]").forEach(function (t) {
        t.classList.toggle("active", t.getAttribute("data-theme-chip") === mode);
      });
    } catch (e) {}
  });

  stub("clarityRefreshSection", function (section) {
    try {
      var el = document.querySelector("#" + (section || ""));
      if (el) el.classList.add("cph-refresh-pulse");
    } catch (e) {}
  });

  stub("notesQuickFromSection", function () {
    try {
      if (typeof w.switchTab === "function") w.switchTab("notes");
      else w.location.hash = "notes";
    } catch (e) {}
  });

  stub("loadCommand", function () {
    try { (w.__clarityCmdQueue = w.__clarityCmdQueue || []).push([]); } catch (e) {}
  });
})(typeof window !== "undefined" ? window : this);

/* === END companion-features.js · T-FEAT-01 · Bismillah === */
