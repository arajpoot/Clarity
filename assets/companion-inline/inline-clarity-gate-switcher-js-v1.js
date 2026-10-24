
(function(){
"use strict";
if (window.__CLARITY_GATE_FILTER_V7__) return;
window.__CLARITY_GATE_FILTER_V7__ = true;
window.__CLARITY_GATE_SWITCHER_V1__ = true;

/* ALLOW once below */
var VAULT = {"user-family-tree-card":1,"faraid-card":1,"wasiyyah-card":1,"uft-cards-file":1,"uft-build-from-cards":1,"uft-card-search":1,"uft-rel-card-search":1,"uft-rel-cards":1};

var HIDE = {
  seeker: ["meme-card","meme-studio-root","tweet-desk-card","callig-lab-card","tajweed-live-card","tajweed-path-card","tj-deep-studio","tj-lmr-score-card","israeliyat-card","najiha-tafseer-card","weekly-review-card","tibbe-nabwi-card","sealed-nectar-card","tajalliyat-lecture-card","fiqh-quiz-card","hajj-guide-card","hajj-checklist-card","tweet-desk-card","dai-transmit-card","voice-translator-card","tafseer-live-card","authentic-learning-stack","daily-deed-ledger-card","new-muslim-foundations-card","salah-starter-card"],
  new_muslim: ["meme-card","meme-studio-root","tweet-desk-card","callig-lab-card","tajweed-live-card","tj-deep-studio","tj-lmr-score-card","israeliyat-card","najiha-tafseer-card","tibbe-nabwi-card","sealed-nectar-card","tajalliyat-lecture-card","deepen-study-card","seerah-mirror-card","dai-transmit-card","voice-translator-card","tafseer-live-card","authentic-learning-stack","asma-names-lecture-card","creation-tongue-reflection","daily-deed-ledger-card"],
  practicing: ["tweet-desk-card","israeliyat-card","sealed-nectar-card","tajalliyat-lecture-card","tafseer-live-card","authentic-learning-stack","dai-transmit-card","israeliyat-card","voice-translator-card"],
  dai: []
};

function currentGate(){
  try {
    var g = localStorage.getItem("clarity_committed_path") || localStorage.getItem("clarity_path_override");
    if (g && ALLOW[g]) return g;
  } catch(e){}
  var d = document.documentElement.getAttribute("data-clarity-path");
  return (d && ALLOW[d]) ? d : "seeker";
}

function cssLock(gate){
  var ids = HIDE[gate] || [];
  var parts = [];
  ids.forEach(function(id){
    parts.push(
      'html[data-clarity-path="'+gate+'"] #'+id,
      'html[data-clarity-path="'+gate+'"] #tab-reminder #'+id,
      'html[data-clarity-path="'+gate+'"] #tab-reminder.is-active #'+id,
      'html[data-clarity-path="'+gate+'"] #tab-reminder.active #'+id,
      'html[data-clarity-path="'+gate+'"] body[data-active-tab="reminder"] #'+id,
      'html[data-clarity-path="'+gate+'"] #tab-reality #'+id,
      'html[data-clarity-path="'+gate+'"] #tab-reflection #'+id,
      'html[data-clarity-path="'+gate+'"] #tab-action #'+id
    );
  });
  if (!parts.length) {
    return '/* path '+gate+': nothing force-hidden */';
  }
  return parts.join(',\n') +
    '{display:none!important;visibility:hidden!important;height:0!important;max-height:0!important;overflow:hidden!important;margin:0!important;padding:0!important;border:none!important;pointer-events:none!important;}';
}

function installLock(gate){
  var el = document.getElementById("clarity-path-lock");
  if (!el) {
    el = document.createElement("style");
    el.id = "clarity-path-lock";
  }
  el.textContent = cssLock(gate);
  /* Always move to end of <html> so cascade wins over resurrecting rules */
  try {
    document.documentElement.appendChild(el);
  } catch(e){
    try { document.head.appendChild(el); } catch(e2){}
  }
}

function hideEl(el){
  if (!el) return;
  el.classList.add("gate-hidden");
  el.setAttribute("data-gate-hidden", "1");
  el.style.setProperty("display", "none", "important");
  el.style.setProperty("visibility", "hidden", "important");
}
function showEl(el){
  if (!el) return;
  el.classList.remove("gate-hidden");
  el.removeAttribute("data-gate-hidden");
  el.style.removeProperty("display");
  el.style.removeProperty("visibility");
}

function applyGateSectionFilter(gate){
  gate = gate || currentGate();
  if (!ALLOW || !ALLOW[gate]) gate = "seeker";
  try {
    document.documentElement.setAttribute("data-clarity-path", gate);
    document.body.setAttribute("data-clarity-path", gate);
  } catch(e){}

  installLock(gate);

  var hideIds = HIDE[gate] || [];
  var hideSet = {};
  hideIds.forEach(function(id){ hideSet[id] = 1; });

  /* Clear previous marks on all cards first for this pass */
  document.querySelectorAll("[data-gate-hidden='1']").forEach(function(el){
    var id = el.id || "";
    if (hideSet[id]) return; /* still should hide */
    if (id && VAULT[id]) { showEl(el); return; }
    if (el.closest && el.closest("#tab-notes")) { showEl(el); return; }
  });

  hideIds.forEach(function(id){
    var el = document.getElementById(id);
    if (el) hideEl(el);
  });

  var allow = (typeof ALLOW !== "undefined" && ALLOW && ALLOW[gate]) ? ALLOW[gate] : (typeof ALLOW !== "undefined" && ALLOW && ALLOW.seeker) ? ALLOW.seeker : {};
  document.querySelectorAll(".card, [id$='-card']").forEach(function(el){
    var id = el.id || "";
    if (id && VAULT[id]) { showEl(el); return; }
    if (el.closest && el.closest("#tab-notes, #amana-vault-interior")) { showEl(el); return; }
    if (id === "cw-card") { showEl(el); return; }
    if (hideSet[id]) { hideEl(el); return; }
    var ok = (id && allow[id] === 1) ||
      (el.classList && el.classList.contains("card-commands") && allow["commands-card"]);
    if (ok) showEl(el);
    else if (id) hideEl(el);
  });

  return { gate: gate };
}
window.applyGateSectionFilter = applyGateSectionFilter;

function highlightGateButtons(gate){
  document.querySelectorAll(".cgs-btn, [data-gate]").forEach(function(btn){
    var g = btn.getAttribute("data-gate");
    if (!g) return;
    btn.classList.toggle("is-active", g === gate);
  });
}

function doSwitch(gate){
  gate = String(gate || "seeker");
  if (!ALLOW || !ALLOW[gate]) gate = "seeker";
  try {
    localStorage.setItem("clarity_committed_path", gate);
    localStorage.setItem("clarity_path_override", gate);
    localStorage.setItem("clarity_active_gate", gate === "dai" ? "practicing" : gate);
  } catch(e){}
  highlightGateButtons(gate);
  applyGateSectionFilter(gate);
  try {
    var badge = document.getElementById("current-mode-badge");
    var labels = {seeker:"SEEKER JOURNEY MODE", new_muslim:"NEW MUSLIM TRACK", practicing:"DAILY MUSLIM / LEGACY", dai:"ASPIRING DA’I TRACK"};
    if (badge) badge.textContent = labels[gate] || badge.textContent;
  } catch(e){}
  try {
    if (typeof clarityCommitGate === "function" && !window.__clarityGateCommiting) {
      window.__clarityGateCommiting = true;
      try { clarityCommitGate(gate); } catch(e1){}
      window.__clarityGateCommiting = false;
      applyGateSectionFilter(gate);
      installLock(gate);
    }
  } catch(e){}
  /* Anti-resurrection schedule */
  [30,100,250,500,1000,2000,4000].forEach(function(ms){
    setTimeout(function(){ applyGateSectionFilter(gate); installLock(gate); }, ms);
  });
  return { gate: gate };
}
window.__clarityPathDoSwitchRaw = doSwitch;
window.claritySwitchGate = function(g){ if (typeof window.clarityRequestPath==='function') return window.clarityRequestPath(g); return doSwitch(g); };
window.applyGateConfiguration = doSwitch;

document.addEventListener("click", function(ev){
  var t = ev.target;
  if (!t || !t.closest) return;
  var btn = t.closest("[data-gate], .cgs-btn");
  if (!btn) return;
  var g = btn.getAttribute("data-gate");
  if (!g) {
    if (btn.classList.contains("cgs-seeker")) g = "seeker";
    else if (btn.classList.contains("cgs-new")) g = "new_muslim";
    else if (btn.classList.contains("cgs-daily")) g = "practicing";
    else if (btn.classList.contains("cgs-dai")) g = "dai";
  }
  if (!g) return;
  ev.preventDefault();
  ev.stopPropagation();
  /* Always go through progression gatekeeper when present */
  if (typeof window.clarityRequestPath === "function") window.clarityRequestPath(g);
  else if (typeof window.claritySwitchGate === "function") window.claritySwitchGate(g);
  else doSwitch(g);
}, true);

/* Watchdog: if fighters strip attributes, re-lock every 1.5s while page open */
setInterval(function(){
  try {
    var g = currentGate();
    var lock = document.getElementById("clarity-path-lock");
    if (!lock || lock.parentNode !== document.documentElement) installLock(g);
    var hideIds = HIDE[g] || [];
    hideIds.forEach(function(id){
      var el = document.getElementById(id);
      if (el && el.getAttribute("data-gate-hidden") !== "1") hideEl(el);
    });
  } catch(e){}
}, 1500);

function boot(){
  var g = currentGate();
  applyGateSectionFilter(g);
  highlightGateButtons(g);
  var bar = document.getElementById("clarity-visit-pill-bar");
  var banner = document.querySelector("#clarity-top-duo .banner, .banner");
  if (bar && banner && bar.parentNode !== banner) banner.appendChild(bar);
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
window.addEventListener("load", function(){ setTimeout(boot, 200); setTimeout(boot, 1000); });

var _sw = window.switchTab;
if (typeof _sw === "function") {
  window.switchTab = function(){
    var r = _sw.apply(this, arguments);
    var g = currentGate();
    setTimeout(function(){ applyGateSectionFilter(g); installLock(g); }, 80);
    setTimeout(function(){ applyGateSectionFilter(g); installLock(g); }, 400);
    return r;
  };
}
})();
