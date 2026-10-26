(function(){
"use strict";
if (window.__CLARITY_PATH_NUCLEAR_V1__) return;
window.__CLARITY_PATH_NUCLEAR_V1__ = true;

var ORDER = ["seeker","new_muslim","practicing","dai"];
var ADVANCED = [
  "meme-card","callig-lab-card","tweet-desk-card",
  "tajweed-live-card","tajweed-path-card","tj-deep-studio","tj-lmr-score-card",
  "weekly-review-card","tibbe-nabwi-card","seerah-mirror-card","najiha-tafseer-card",
  "israeliyat-card","sealed-nectar-card","tajalliyat-lecture-card","tafseer-live-card",
  "authentic-learning-stack","voice-translator-card","fiqh-quiz-card","hajj-guide-card",
  "hajj-checklist-card"
];

function pathNow(){
  try {
    return document.documentElement.getAttribute("data-clarity-path")
      || localStorage.getItem("clarity_committed_path") || "seeker";
  } catch(e){ return "seeker"; }
}

function show(el){
  if (!el) return;
  el.classList.remove("gate-hidden");
  el.removeAttribute("data-gate-hidden");
  el.hidden = false;
  el.style.removeProperty("display");
  el.style.removeProperty("visibility");
  el.style.removeProperty("height");
  el.style.removeProperty("max-height");
  el.style.removeProperty("opacity");
  el.style.removeProperty("pointer-events");
  el.style.removeProperty("overflow");
}

function hide(el){
  if (!el) return;
  el.classList.add("gate-hidden");
  el.setAttribute("data-gate-hidden","1");
  el.style.setProperty("display","none","important");
}

function populate(){
  var g = pathNow();
  try {
    document.documentElement.setAttribute("data-clarity-path", g);
    document.body.setAttribute("data-clarity-path", g);
  } catch(e){}

  /* Always use additive filter if present */
  if (typeof window.applyAdditiveFilter === "function") {
    try { window.applyAdditiveFilter(g); } catch(e){}
  }

  var idx = ORDER.indexOf(g);
  if (idx >= 2) {
    /* Daily or Da’i — force advanced modules visible */
    ADVANCED.forEach(function(id){ show(document.getElementById(id)); });
    try { if (typeof window.clarityMemeUiSync === "function") window.clarityMemeUiSync(); } catch(e){}
    document.body.setAttribute("data-meme-studio-open","1");
  } else if (idx === 1) {
    document.body.setAttribute("data-meme-studio-open","0");
    ["meme-card","callig-lab-card","tweet-desk-card"].forEach(function(id){
      /* new muslim may not have these in allow — leave filter */
    });
  } else {
    document.body.setAttribute("data-meme-studio-open","0");
  }

  /* Recount visible cards per tab for nav badges */
  try {
    ["reminder","reality","reflection","action","notes"].forEach(function(tab){
      var panel = document.getElementById("tab-"+tab);
      if (!panel) return;
      var n = 0;
      panel.querySelectorAll(".card, [id$='-card']").forEach(function(c){
        if (c.classList.contains("gate-hidden")) return;
        if (c.getAttribute("data-gate-hidden")==="1") return;
        var st = window.getComputedStyle(c);
        if (st.display === "none" || st.visibility === "hidden") return;
        n++;
      });
      var badge = document.querySelector('[data-tab="'+tab+'"] .tab-count, button[data-tab="'+tab+'"] .count, #nav-'+tab+' .count');
      /* bottom nav counts */
      document.querySelectorAll(".nav-tabs button, .tab-btn, [data-switch-tab]").forEach(function(btn){
        var t = btn.getAttribute("data-tab") || btn.getAttribute("data-switch-tab") || "";
        if (t === tab || (btn.onclick && String(btn.onclick).indexOf(tab)>=0)) {
          var c = btn.querySelector(".tab-count, .count, small");
          /* only update numeric nodes */
        }
      });
    });
  } catch(e){}
}

function dedupeBookmarks(){
  /* only one visit bar */
  var bars = document.querySelectorAll("#clarity-visit-pill-bar");
  for (var i = 1; i < bars.length; i++) {
    if (bars[i].parentNode) bars[i].parentNode.removeChild(bars[i]);
  }
  /* remove path intro progress pills from DOM */
  document.querySelectorAll("#clarity-path-intro .cpi-row, #clarity-path-rail").forEach(function(el){
    if (el.parentNode) el.parentNode.removeChild(el);
  });
}

function run(){
  dedupeBookmarks();
  populate();
}

/* Hijack late: any switch goes through populate */
function wire(){
  if (typeof window.clarityRequestPath === "function" && !window.clarityRequestPath.__nuclear) {
    var rp = window.clarityRequestPath;
    window.clarityRequestPath = function(g){
      var r = rp.apply(this, arguments);
      setTimeout(run, 50);
      setTimeout(run, 300);
      setTimeout(run, 800);
      return r;
    };
    window.clarityRequestPath.__nuclear = true;
  }
  if (typeof window.applyGateSectionFilter === "function" && !window.applyGateSectionFilter.__nuclear) {
    var af = window.applyGateSectionFilter;
    window.applyGateSectionFilter = function(g){
      if (typeof window.applyAdditiveFilter === "function") {
        var path = g || pathNow();
        window.applyAdditiveFilter(path);
        setTimeout(populate, 40);
        return;
      }
      var r = af.apply(this, arguments);
      setTimeout(populate, 40);
      return r;
    };
    window.applyGateSectionFilter.__nuclear = true;
  }
}

wire();
if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", function(){ setTimeout(function(){ wire(); run(); }, 400); });
else setTimeout(function(){ wire(); run(); }, 400);
window.addEventListener("load", function(){ setTimeout(run, 900); setTimeout(run, 2000); });

/* If stuck on Seeker visuals while path is Daily */
setInterval(function(){
  if (document.hidden) return;
  try {
    if (document.documentElement.getAttribute("data-shell-mode") === "landing") return;
  } catch (e) {}
  var g = pathNow();
  if (g === "practicing" || g === "dai") {
    var m = document.getElementById("meme-card");
    if (m && (m.classList.contains("gate-hidden") || getComputedStyle(m).display==="none")) run();
  }
  dedupeBookmarks();
}, 15000);

window.clarityPathNuclear = { run: run, populate: populate };
})();