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
  seeker: {
    "commands-card":1,"samina-verse-card":1,"samina-card":1,"about-clarity-card":1,
    "soul-compass-card":1,"hell-sins-card":1,"night-breath-card":1,
    "seerah-live-card":1,"creation-tongue-reflection":1,"grave-path-card":1
  },
  new_muslim: {
    "commands-card":1,"samina-verse-card":1,"samina-card":1,"ilm-pathway-card":1,
    "about-clarity-card":1,"soul-compass-card":1,"seerah-live-card":1,
    "night-breath-card":1,"hajj-guide-card":1,"fiqh-quiz-card":1,
    "grave-path-card":1,"new-muslim-foundations-card":1,"salah-starter-card":1
  },
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
};
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

function applyAdditiveFilter(gate){ return applyExclusiveFilter(gate); }
function applyExclusiveFilter(gate){
  gate = ORDER.indexOf(gate) >= 0 ? gate : "seeker";
  try {
    document.documentElement.setAttribute("data-clarity-path", gate);
    document.body.setAttribute("data-clarity-path", gate);
    localStorage.setItem("clarity_committed_path", gate);
    localStorage.setItem("clarity_path_override", gate);
    localStorage.setItem("clarity_path_focus", gate);
  } catch(e){}
  var allow = ALLOW[gate] || ALLOW.seeker || {};
  document.querySelectorAll(".card, [id$='-card']").forEach(function(el){
    var id = el.id || "";
    if (id && VAULT[id]) { showEl(el); return; }
    if (el.closest && el.closest("#tab-notes, #amana-vault-interior, #clarity-top-duo")) { showEl(el); return; }
    if (id === "cw-card" || id === "about-clarity-card") { showEl(el); return; }
    var ok = !!(id && allow[id] === 1);
    if (!ok && el.classList && el.classList.contains("card-commands") && allow["commands-card"]) ok = true;
    if (ok) showEl(el); else hideEl(el);
  });
  try {
    document.querySelectorAll(".gps-btn, .gps-phase, [data-gate]").forEach(function(btn){
      var g = btn.getAttribute("data-gate");
      if (!g) return;
      btn.classList.toggle("active", g === gate);
      btn.classList.toggle("is-active", g === gate);
    });
  } catch(e){}
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
  /* Call raw switch for badge/theme, then exclusive path filter */
  var raw = window.__clarityPathDoSwitchRaw;
  if (typeof raw === "function") {
    window.__clarityPathBypass = true;
    try { raw(gate); } finally { window.__clarityPathBypass = false; }
  }
  applyExclusiveFilter(gate);
  /* Bring user to the natural hub for this path so sections are visible */
  try {
    var hub = (gate === "practicing") ? "action" : (gate === "dai") ? "reminder" : "reminder";
    if (typeof switchTab === "function") switchTab(hub);
  } catch(e){}
  setTimeout(function(){ applyExclusiveFilter(gate); }, 100);
  setTimeout(function(){ applyExclusiveFilter(gate); }, 900);
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
  window.applyGateSectionFilter = function(g){ applyExclusiveFilter(g || clamp()); };
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