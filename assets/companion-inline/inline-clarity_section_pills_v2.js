(function(){
"use strict";
if (window.__CLARITY_SECTION_PILLS_V2__) return;
window.__CLARITY_SECTION_PILLS_V2__ = true;
/* organizer: prefer LAST visit bar; section chips stay in-tab only */
window.__CLARITY_SECTION_PILLS__ = true;

var HUBS = ["reminder","reality","reflection","action","notes"];
var LABELS = { reminder:"Rem", reality:"Rea", reflection:"Ref", action:"Act", notes:"Vault" };
var ICONS = { reminder:"✦", reality:"◈", reflection:"☾", action:"➤", notes:"🏦" };
var STORE = "clarity_last_section_by_tab";

function readMap(){ try { return JSON.parse(localStorage.getItem(STORE)||"{}")||{}; } catch(e){ return {}; } }
function writeMap(m){ try { localStorage.setItem(STORE, JSON.stringify(m)); } catch(e){} }
function activeHub(){
  return document.body.getAttribute("data-active-tab")
    || document.documentElement.getAttribute("data-active-tab")
    || "reminder";
}
function sectionTitle(el){
  if (!el) return "";
  var h = el.querySelector("h2, h3, summary strong, summary");
  if (h) return (h.textContent||"").replace(/\s+/g," ").trim().slice(0,36);
  return (el.id||"section").slice(0,36);
}

function stickyOffset(){
  var top = 0;
  var nav = document.getElementById("clarity-global-nav");
  if (nav) {
    var r = nav.getBoundingClientRect();
    /* if nav is sticky/fixed and visible */
    if (r.bottom > 0 && r.top <= 8) top = Math.max(top, r.bottom);
  }
  return Math.round(top);
}
function updateStickyOffset(bar){
  if (!bar) return;
  var off = stickyOffset();
  bar.style.setProperty("--clarity-sticky-offset", off + "px");
  if (off > 0) bar.classList.add("cv-under-nav");
  else bar.classList.remove("cv-under-nav");
}

function ensureBar(){
  var bar = document.getElementById("clarity-visit-pill-bar");
  if (bar) {
    /* Re-stitch to banner bottom if orphaned */
    placeBar(bar);
    return bar;
  }
  bar = document.createElement("div");
  bar.id = "clarity-visit-pill-bar";
  bar.setAttribute("role", "navigation");
  bar.setAttribute("aria-label", "Last visited sections by tab");
  placeBar(bar);
  return bar;
}

function placeBar(bar){
  /* Keep stitched to lower edge INSIDE .banner */
  var banner = document.querySelector("#clarity-top-duo .banner, .banner");
  if (banner) {
    if (bar.parentNode !== banner) banner.appendChild(bar);
    return;
  }
  var duo = document.getElementById("clarity-top-duo");
  if (duo) { duo.appendChild(bar); return; }
}

function render(){
  var bar = ensureBar();
  updateStickyOffset(bar);
  var map = readMap();
  var hub = activeHub();
  var html = '<span class="cv-label">Last</span>';
  HUBS.forEach(function(h){
    var rec = map[h];
    if (!rec || !rec.id) return;
    var ico = ICONS[h] || "•";
    var lab = LABELS[h] || h;
    var title = (rec.title || rec.id).replace(/</g,"");
    html += '<button type="button" class="cv-pill" data-hub="'+h+'" data-sec="'+String(rec.id).replace(/"/g,"")+'">'
      + '<span class="cv-ico">'+ico+'</span>'
      + '<span class="cv-k">'+lab+'</span> '
      + title
      + '</button>';
  });
  if (html.indexOf("cv-pill") < 0) {
    html += '<span class="cv-label" style="opacity:.55;font-weight:600;text-transform:none;letter-spacing:0">Scroll a section to pin it</span>';
  }
  bar.innerHTML = html;
  bar.querySelectorAll(".cv-pill").forEach(function(btn){
    btn.addEventListener("click", function(){
      var h = btn.getAttribute("data-hub");
      var sid = btn.getAttribute("data-sec");
      try {
        if (typeof switchTab === "function") switchTab(h);
      } catch(e){}
      setTimeout(function(){
        var el = document.getElementById(sid);
        if (el) {
          try { el.scrollIntoView({ behavior: "smooth", block: "start" }); } catch(e2){}
          try { el.classList.add("cv-flash"); setTimeout(function(){ el.classList.remove("cv-flash"); }, 1200); } catch(e3){}
        }
      }, 120);
    });
  });
}

function trackVisible(){
  try {
    var hub = activeHub();
    if (HUBS.indexOf(hub) < 0) return;
    var panel = document.getElementById("tab-"+hub);
    if (!panel) return;
    var cards = panel.querySelectorAll(".card, [data-rrra]");
    var best = null, bestScore = -1;
    var vh = window.innerHeight || 600;
    var topCut = 100;
    cards.forEach(function(c){
      if (c.classList && c.classList.contains("gate-hidden")) return;
      var r = c.getBoundingClientRect();
      if (r.bottom < topCut || r.top > vh - 40) return;
      var visible = Math.min(r.bottom, vh) - Math.max(r.top, topCut);
      if (visible > bestScore) { bestScore = visible; best = c; }
    });
    if (!best) return;
    if (!best.id) {
      var t = sectionTitle(best);
      var h = 0;
      for (var i = 0; i < t.length; i++) h = ((h << 5) - h) + t.charCodeAt(i) | 0;
      best.id = "sec-" + hub + "-" + Math.abs(h);
    }
    var map = readMap();
    map[hub] = { id: best.id, title: sectionTitle(best), ts: Date.now() };
    writeMap(map);
    render();
  } catch(e){}
}

var scrollT = null;
window.addEventListener("scroll", function(){
  clearTimeout(scrollT);
  scrollT = setTimeout(trackVisible, 180);
}, { passive: true });
window.addEventListener("resize", function(){ updateStickyOffset(document.getElementById("clarity-visit-pill-bar")); });

function boot(){
  ensureBar();
  render();
  trackVisible();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 350); });
else setTimeout(boot, 350);
window.addEventListener("load", function(){ setTimeout(boot, 800); });

/* After tab switch, refresh bar */
var _sw = window.switchTab;
if (typeof _sw === "function") {
  window.switchTab = function(){
    var r = _sw.apply(this, arguments);
    setTimeout(function(){ ensureBar(); render(); trackVisible(); }, 200);
    return r;
  };
}
})();