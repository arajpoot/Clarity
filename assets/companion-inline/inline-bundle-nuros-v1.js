/**
 * Named bundle: nuros-* · v1
 * Order preserved from index. landing-v3 & path-progress untouched.
 */


;/* ==== inline-nuros-null-guard-js.js ==== */
(function(){
  "use strict";
  if (window.__NUROS_NULL_GUARD__) return;
  window.__NUROS_NULL_GUARD__ = true;

  function ensureStub(id, tag, attrs) {
    if (document.getElementById(id)) return document.getElementById(id);
    var el = document.createElement(tag || "div");
    el.id = id;
    el.hidden = true;
    el.setAttribute("aria-hidden", "true");
    if (attrs) Object.keys(attrs).forEach(function(k){ el.setAttribute(k, attrs[k]); });
    document.body.appendChild(el);
    return el;
  }

  function ensureStreamStubs() {
    /* Only ensure audio element — controls live in the polished banner */
    if (!document.getElementById("quran-audio")) {
      ensureStub("quran-audio", "audio", { preload: "none", crossorigin: "anonymous" });
    }
  }

  function unhideApp() {
    var ws = document.getElementById("main-application-workspace");
    if (ws) {
      ws.classList.remove("hidden");
      ws.style.display = "";
      ws.removeAttribute("hidden");
    }
    /* also common gate wrappers */
    document.querySelectorAll(".gate-container, #clarity-welcome, #clarity-gate").forEach(function(el) {
      /* do not force-hide gate if user intentionally on gate — only ensure main is visible if tabs exist */
    });
    var main = document.getElementById("main-content") || document.querySelector(".page-wrapper");
    if (main) {
      main.classList.remove("hidden");
      main.style.visibility = "visible";
      main.style.display = "";
    }
    document.body.classList.add("app-ready");
  }

  function safeWrappers() {
    if (typeof window.changeStream === "function" && !window.changeStream._safe) {
      var cs = window.changeStream;
      window.changeStream = function(){ try { return cs.apply(this, arguments); } catch(e) { console.warn("changeStream", e); } };
      window.changeStream._safe = true;
    }
    if (typeof window.toggleQuranStream === "function" && !window.toggleQuranStream._safe) {
      var tq = window.toggleQuranStream;
      window.toggleQuranStream = function(){ try { return tq.apply(this, arguments); } catch(e) { console.warn("toggleQuranStream", e); } };
      window.toggleQuranStream._safe = true;
    }
    if (typeof window.setDailyBanner === "function" && !window.setDailyBanner._safe) {
      var sb = window.setDailyBanner;
      window.setDailyBanner = function(){ try { return sb.apply(this, arguments); } catch(e) { console.warn("setDailyBanner", e); } };
      window.setDailyBanner._safe = true;
    }
  }

  function boot() {
    ensureStreamStubs();
    unhideApp();
    safeWrappers();
  }
  /* Run ASAP — before deferred boot that crashes */
  if (document.body) boot();
  else document.addEventListener("DOMContentLoaded", boot);
  document.addEventListener("DOMContentLoaded", function(){ ensureStreamStubs(); unhideApp(); });
  window.addEventListener("load", function(){ ensureStreamStubs(); unhideApp(); safeWrappers(); });
})();


;/* ==== inline-nuros-master-shield-v1.js ==== */
(function(){
  "use strict";
  if (window.__NUROS_SHIELD__) return;
  window.__NUROS_SHIELD__ = true;
  function _gebi(id){ try { return document.getElementById(id); } catch(e){ return null; } }
  var safeStyle; try { safeStyle = new Proxy({}, { get:function(){return "";}, set:function(){return true;} }); } catch(e){ safeStyle = {}; }
  var safeClassList = { add:function(){}, remove:function(){}, toggle:function(){return false;}, contains:function(){return false;} };
  function makeSafe(){
    var store = {innerHTML:"",textContent:"",value:"",src:"",href:"",disabled:false};
    var node = { style:safeStyle, classList:safeClassList, tagName:undefined, parentNode:null,
      setAttribute:function(){}, getAttribute:function(){return null;}, addEventListener:function(){},
      removeEventListener:function(){}, appendChild:function(c){return c;}, querySelector:function(){return null;},
      querySelectorAll:function(){return [];}, focus:function(){}, click:function(){}, remove:function(){},
      getContext:function(){return null;}, play:function(){return Promise.resolve();}, pause:function(){} };
    try {
      return new Proxy(node, {
        get: function(t,p){ if(p in t) return t[p]; if(p in store) return store[p]; return function(){return null;}; },
        set: function(t,p,v){ store[p]=v; return true; }
      });
    } catch(e){ return node; }
  }
  var SAFE = makeSafe();
  var OPTIONAL = {"grok-question":1,"hifz-arabic":1,"hifz-translation":1,"hifz-today-count":1,"istighfar-count":1,"salawat-count":1,"streak-display":1,"lessons-display":1,"welcome-text":1,"welcome-area":1,"mute-btn":1,"volume-slider":1,"tafseer-count":1,"tafseer-last":1,"tafseer-list":1,"prophet-story":1,"israeliyat-content":1,"zikr":1,"life-event":1,"life-results":1,"command-box":1,"seerah-content":1,"tj-overall-label":1,"tj-overall-fill":1,"tj-levels-root":1,"callig-mode-badge":1,"callig-voice-status":1,"callig-mic-stop":1,"callig-mic-btn":1,"banner-live-status":1,"nuros-dp-score":1,"nuros-dp-log":1};
  var _raw = document.getElementById.bind(document);
  document.getElementById = function(id){
    var n = null; try { n = _raw(id); } catch(e){}
    if (n) return n;
    if (OPTIONAL[id]) return SAFE;
    return null;
  };
  function wrapName(name){
    try {
      if (typeof window[name] !== "function" || window[name].__nurosWrapped) return;
      var prev = window[name];
      window[name] = function(){ try { return prev.apply(this, arguments); } catch(err){ console.warn("[NurOS]", name, err&&err.message); } };
      window[name].__nurosWrapped = true;
    } catch(e){}
  }
  function wrapAll(){
    try {
      Object.getOwnPropertyNames(window).forEach(function(n){
        if (/^(load|update|render|sync|show|hide|toggle|refresh|init|callig|clarity|tj|fq|pm|uft|meme)/i.test(n)) wrapName(n);
      });
      ["askGrok","loadZikr","loadProphetStory","loadIsraeliyat","loadCommand","tryBannerLiveEmbed","toggleHaramainLive","searchHadith","searchQuran"].forEach(wrapName);
    } catch(e){}
  }
  function soft(ev){
    try {
      var msg = (ev && (ev.message || (ev.reason && ev.reason.message))) || "";
      if (/Cannot set properties of null|Cannot read properties of null|is not a function/.test(msg)) {
        if (ev.preventDefault) ev.preventDefault();
        console.warn("[NurOS soft]", msg);
      }
    } catch(e){}
  }
  window.addEventListener("error", soft, true);
  window.addEventListener("unhandledrejection", soft, true);
  function paper(){
    try {
      var c=_raw("callig-canvas"), o=_raw("callig-stage-outer"), s=_raw("callig-lab-stage");
      if(o){o.style.background="#f7f3eb";o.style.minHeight="280px";}
      if(s){s.style.background="#f7f3eb";s.style.minHeight="260px";}
      if(c){c.style.background="#f7f3eb";c.style.display="block";
        if(!c.width||c.width<40)c.width=900; if(!c.height||c.height<40)c.height=420;
        if(!c.getAttribute("data-paper")){var ctx=c.getContext&&c.getContext("2d"); if(ctx){ctx.fillStyle="#f7f3eb";ctx.fillRect(0,0,c.width,c.height);} c.setAttribute("data-paper","1");}
      }
    } catch(e){}
  }
  function boot(){ wrapAll(); paper(); }
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", function(){ boot(); setTimeout(boot,120); });
  else boot();
  window.addEventListener("load", function(){ setTimeout(boot,80); setTimeout(boot,400); });
})();


;/* ==== inline-nuros_shell_collapse.js ==== */
(function(){
  "use strict";
  if (window.__NUROS_SHELL_COLLAPSE__) return;
  window.__NUROS_SHELL_COLLAPSE__ = true;

  function collapse() {
    try {
      // Force page-wrapper out of flex mode and zero size contribution when empty
      document.querySelectorAll("#main-content.page-wrapper, .page-wrapper, #main-content").forEach(function(el){
        el.style.setProperty("display", "block", "important");
        el.style.setProperty("margin", "0", "important");
        el.style.setProperty("padding", "0", "important");
        el.style.setProperty("min-height", "0", "important");
        el.style.setProperty("gap", "0", "important");
        // If wrapper only contains hidden sidebar / empty main, collapse height
        var visibleKids = Array.from(el.children).filter(function(ch){
          var cs = getComputedStyle(ch);
          return cs.display !== "none" && cs.visibility !== "hidden" && ch.offsetHeight > 0;
        });
        if (visibleKids.length === 0) {
          el.style.setProperty("height", "0", "important");
          el.style.setProperty("overflow", "hidden", "important");
        } else {
          el.style.setProperty("height", "auto", "important");
          el.style.removeProperty("overflow");
        }
      });
      document.querySelectorAll("main.main-content, .main-content").forEach(function(el){
        el.style.setProperty("margin", "0", "important");
        el.style.setProperty("padding", "0", "important");
        el.style.setProperty("min-height", "0", "important");
      });
      document.querySelectorAll("#clarity-sidebar, aside.sidebar").forEach(function(el){
        el.style.setProperty("display", "none", "important");
        el.style.setProperty("height", "0", "important");
        el.style.setProperty("width", "0", "important");
      });
      // Pull active tab up under banner
      var duo = document.getElementById("clarity-top-duo");
      var active = document.querySelector(".tab-panel.active, .tab-panel.is-active");
      if (duo && active) {
        active.style.setProperty("margin-top", "0", "important");
        active.style.setProperty("padding-top", "0.15rem", "important");
      }
    } catch (e) {}
  }

  function boot() {
    collapse();
    setTimeout(collapse, 300);
    setTimeout(collapse, 400);
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", function(){ setTimeout(collapse, 200); });

  // Re-run on tab change
  ["switchTab", "clarityOpenSectionDoor"].forEach(function(name){
    if (typeof window[name] === "function" && !window[name]._shellCollapse) {
      var prev = window[name];
      window[name] = function() {
        var r = prev.apply(this, arguments);
        setTimeout(collapse, 40);
        setTimeout(collapse, 150);
        return r;
      };
      window[name]._shellCollapse = true;
    }
  });
  document.addEventListener("click", function(ev){
    if (ev.target && ev.target.closest && ev.target.closest("[data-rail-tab],[data-tab],.door-rail-btn,.mb-tab,.nav-tab")) {
      setTimeout(collapse, 80);
    }
  }, true);
})();


;/* ==== inline-nuros_haramain_temps.js ==== */
(function(){
  "use strict";
  if (window.__NUROS_HARAMAIN_TEMPS__) return;
  window.__NUROS_HARAMAIN_TEMPS__ = true;
  var CITIES = {
    makkah:  { lat: 21.4225, lon: 39.8262 },
    madinah: { lat: 24.4672, lon: 39.6111 }
  };
  var CACHE_KEY = "clarity_haramain_temps_v1";
  var CACHE_MS = 25 * 60 * 1000;
  function setEl(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = (val != null && isFinite(val)) ? Math.round(val) : "—";
  }
  async function fetchOne(lat, lon) {
    var url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat +
      "&longitude=" + lon + "&current=temperature_2m&timezone=auto";
    var res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error("meteo " + res.status);
    var data = await res.json();
    if (data && data.current && data.current.temperature_2m != null)
      return data.current.temperature_2m;
    throw new Error("no temp");
  }
  async function loadBoth(force) {
    try {
      if (!force) {
        var raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          var cached = JSON.parse(raw);
          if (cached && cached.ts && (Date.now() - cached.ts) < CACHE_MS) {
            setEl("temp-makkah", cached.makkah);
            setEl("temp-madinah", cached.madinah);
            return;
          }
        }
      }
    } catch (e) {}
    var out = { ts: Date.now(), makkah: null, madinah: null };
    try {
      var results = await Promise.allSettled([
        fetchOne(CITIES.makkah.lat, CITIES.makkah.lon),
        fetchOne(CITIES.madinah.lat, CITIES.madinah.lon)
      ]);
      if (results[0].status === "fulfilled") out.makkah = results[0].value;
      if (results[1].status === "fulfilled") out.madinah = results[1].value;
      setEl("temp-makkah", out.makkah);
      setEl("temp-madinah", out.madinah);
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(out)); } catch (e2) {}
    } catch (err) {
      setEl("temp-makkah", null);
      setEl("temp-madinah", null);
    }
  }
  function boot() {
    loadBoth(false);
    setInterval(function(){ loadBoth(true); }, CACHE_MS);
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 400); });
  else setTimeout(boot, 400);
  window.addEventListener("online", function(){ loadBoth(true); });
})();


;/* ==== inline-nuros_av_repair_v1.js ==== */
(function(){
  "use strict";
  if (window.__NUROS_AV_REPAIR_V1__) return;
  window.__NUROS_AV_REPAIR_V1__ = true;

  function activateIframe(iframe) {
    if (!iframe || iframe.tagName !== "IFRAME") return;
    var ds = iframe.getAttribute("data-src") || iframe.dataset && iframe.dataset.src;
    var src = iframe.getAttribute("src") || "";
    if (ds && (!src || src === "about:blank" || src === "blank" || src === "#")) {
      iframe.setAttribute("src", ds);
    }
    // Ensure allow attributes for YT
    if (!iframe.getAttribute("allow")) {
      iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    }
    if (!iframe.hasAttribute("allowfullscreen")) {
      iframe.setAttribute("allowfullscreen", "");
    }
    iframe.style.setProperty("display", "block", "important");
    iframe.style.setProperty("visibility", "visible", "important");
    iframe.style.setProperty("opacity", "1", "important");
  }

  function activateAllIn(root) {
    root = root || document;
    root.querySelectorAll("iframe[data-src]").forEach(activateIframe);
    // Also bare youtube iframes that may have lost src
    root.querySelectorAll("iframe").forEach(function(f) {
      var s = f.getAttribute("src") || "";
      var d = f.getAttribute("data-src") || "";
      if ((!s || s === "about:blank") && d) activateIframe(f);
    });
  }

  function activateActiveTab() {
    var panel = document.querySelector(".tab-panel.active, .tab-panel.is-active");
    if (panel) activateAllIn(panel);
    // Known loaders
    try {
      var sealed = document.getElementById("sealed-yt-frame");
      if (sealed) {
        var sel = document.getElementById("sealed-ep");
        var val = sel ? sel.value : "videoseries";
        if (typeof sealedLoadEp === "function") sealedLoadEp(val);
        else activateIframe(sealed);
      }
    } catch(e){}
    try {
      var hajj = document.getElementById("hajj-yt-frame");
      if (hajj) activateIframe(hajj);
    } catch(e){}
    try {
      var taj = document.getElementById("tajalliyat-player");
      if (taj) activateIframe(taj);
    } catch(e){}
    // Generic players
    ["farhat-player","yaqeen-player","asma-lecture-player","spotify-player"].forEach(function(id){
      var el = document.getElementById(id);
      if (el) activateIframe(el);
    });
  }

  // Banner live: do not force-load if intentionally hidden; only ensure frame exists
  function checkBannerLive() {
    var live = document.getElementById("banner-live");
    if (!live) return;
    // leave src management to existing live toggle JS
  }

  // Mic / TTS smoke check (non-destructive)
  function checkMicWiring() {
    try {
      window.__NUROS_AV_STATUS__ = {
        getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        MediaRecorder: typeof MediaRecorder !== "undefined",
        AudioContext: !!(window.AudioContext || window.webkitAudioContext),
        speechSynthesis: !!(window.speechSynthesis),
        sealedLoadEp: typeof sealedLoadEp === "function",
        clarityNaturalTTS: typeof clarityNaturalTTS === "function"
      };
    } catch(e) {
      window.__NUROS_AV_STATUS__ = { error: String(e) };
    }
  }

  function boot() {
    activateAllIn(document);
    activateActiveTab();
    checkBannerLive();
    checkMicWiring();
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 80); });
  else setTimeout(boot, 80);
  window.addEventListener("load", function(){ setTimeout(boot, 250); });

  // Re-activate when switching sections
  function wrap(name) {
    if (typeof window[name] !== "function" || window[name]._avRepair) return;
    var prev = window[name];
    window[name] = function() {
      var r = prev.apply(this, arguments);
      setTimeout(activateActiveTab, 50);
      setTimeout(activateActiveTab, 200);
      return r;
    };
    window[name]._avRepair = true;
  }
  wrap("switchTab");
  wrap("clarityOpenSectionDoor");

  document.addEventListener("click", function(ev){
    var t = ev.target && ev.target.closest && ev.target.closest("[data-rail-tab],[data-tab],.door-rail-btn,.mb-tab,.nav-tab");
    if (t) {
      setTimeout(activateActiveTab, 80);
      setTimeout(activateActiveTab, 250);
    }
  }, true);

  // When select changes for lecture episodes, ensure src applies
  document.addEventListener("change", function(ev){
    var el = ev.target;
    if (!el || el.tagName !== "SELECT") return;
    if (/sealed|farhat|yaqeen|asma|spotify|hajj|episode/i.test(el.id || el.className || "")) {
      setTimeout(activateActiveTab, 30);
    }
  }, true);
})();


;/* ==== inline-nuros_final_polish_v1.js ==== */
(function(){
  "use strict";
  if (window.__NUROS_FINAL_POLISH_V1__) return;
  window.__NUROS_FINAL_POLISH_V1__ = true;

  function ensureDoorRailOn() {
    try {
      var rail = document.getElementById("clarity-door-rail");
      if (!rail) return;
      document.documentElement.classList.add("door-rail-on");
      rail.classList.remove("rail-hidden");
      // RRRA five-door rail (Reminder · Reality · Reflection · Action · Amana Vault)
      var need = ["reminder","reality","reflection","action","notes"];
      var labels = {
        reminder:"Reminder", reality:"Reality", reflection:"Reflection", action:"Action",
        notes:"Amana Vault",
        journey:"Reminder", commands:"Reminder", seerah:"Reality", grave:"Reflection",
        tafseer:"Reflection", tajweed:"Action", search:"Action", lectures:"Reality", about:"Reality"
      };
      var icons = {
        reminder:"✦", reality:"◉", reflection:"☾", action:"➤", notes:"🏦",
        journey:"✦", commands:"✦", seerah:"◉", grave:"☾",
        tafseer:"☾", tajweed:"➤", search:"➤", lectures:"◉", about:"◉"
      };
      var existing = {};
      rail.querySelectorAll("[data-rail-tab]").forEach(function(b){
        existing[b.getAttribute("data-rail-tab")] = b;
      });
      need.forEach(function(tab){
        if (existing[tab]) return;
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "door-rail-btn";
        btn.setAttribute("data-rail-tab", tab);
        btn.setAttribute("onclick", "clarityOpenSectionDoor('" + tab + "')");
        btn.innerHTML = '<span class="dr-ico">' + icons[tab] + '</span><span class="dr-label">' + labels[tab] + '</span>';
        rail.appendChild(btn);
      });
      // remove unknown extras beyond the 10
      rail.querySelectorAll("[data-rail-tab]").forEach(function(b){
        var t = b.getAttribute("data-rail-tab");
        if (need.indexOf(t) < 0) b.remove();
      });
    } catch (e) {}
  }

  function scaleMemeViewport() {
    try {
      var stages = document.querySelectorAll(".meme-stage, #meme-stage");
      stages.forEach(function(st){
        st.style.maxWidth = "100%";
        st.style.maxHeight = "min(46vh, 380px)";
      });
      var wraps = document.querySelectorAll(".meme-stage-wrap, #meme-stage-wrap");
      wraps.forEach(function(w){
        w.style.maxWidth = "min(100%, 340px)";
        w.style.maxHeight = "min(46vh, 380px)";
        w.style.marginLeft = "auto";
        w.style.marginRight = "auto";
      });
    } catch (e) {}
  }

  function boot() {
    ensureDoorRailOn();
    scaleMemeViewport();
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 80); });
  else setTimeout(boot, 80);
  window.addEventListener("load", function(){ setTimeout(boot, 250); });
  // re-apply when About / meme tab opens
  document.addEventListener("click", function(ev){
    var t = ev.target;
    if (!t) return;
    var tab = t.closest && t.closest("[data-rail-tab], [data-tab], .mb-tab, .nav-tab");
    if (tab) setTimeout(function(){ scaleMemeViewport(); ensureDoorRailOn(); }, 120);
  }, true);
})();


;/* ==== inline-nuros_gap_kill_v1.js ==== */
(function(){
  "use strict";
  if (window.__NUROS_GAP_KILL_V1__) return;
  window.__NUROS_GAP_KILL_V1__ = true;

  function collapseGaps() {
    try {
      document.documentElement.classList.add("door-rail-on");
      // Hide top nav tabs hard
      document.querySelectorAll("nav.nav-tabs, .nav-tabs").forEach(function(n){
        n.style.setProperty("display", "none", "important");
        n.style.setProperty("height", "0", "important");
        n.style.setProperty("margin", "0", "important");
        n.style.setProperty("padding", "0", "important");
      });
      // Zero top spacing on content shells
      ["#main-application-workspace", ".page-wrapper", "#main-content", ".main-content"].forEach(function(q){
        var el = document.querySelector(q);
        if (!el) return;
        el.style.setProperty("margin-top", "0", "important");
        el.style.setProperty("padding-top", "0", "important");
      });
      // Ensure only one active panel
      var active = document.querySelector(".tab-panel.active, .tab-panel.is-active");
      document.querySelectorAll(".tab-panel").forEach(function(p){
        if (p === active) {
          p.style.setProperty("display", "block", "important");
          p.style.setProperty("height", "auto", "important");
          p.style.setProperty("margin-top", "0", "important");
          p.style.setProperty("padding-top", "0.15rem", "important");
        } else {
          p.style.setProperty("display", "none", "important");
          p.style.setProperty("height", "0", "important");
          p.style.setProperty("margin", "0", "important");
          p.style.setProperty("padding", "0", "important");
        }
      });
    } catch (e) {}
  }

  // Hook tab switches
  function wrap(name) {
    if (typeof window[name] !== "function" || window[name]._gapKill) return;
    var prev = window[name];
    window[name] = function() {
      var r = prev.apply(this, arguments);
      setTimeout(collapseGaps, 30);
      setTimeout(collapseGaps, 120);
      return r;
    };
    window[name]._gapKill = true;
  }

  function boot() {
    collapseGaps();
    wrap("switchTab");
    wrap("clarityOpenSectionDoor");
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 50); });
  else setTimeout(boot, 50);
  window.addEventListener("load", function(){ setTimeout(collapseGaps, 200); });
  document.addEventListener("click", function(ev){
    var t = ev.target && ev.target.closest && ev.target.closest("[data-rail-tab], [data-tab], .door-rail-btn, .mb-tab, .nav-tab");
    if (t) setTimeout(collapseGaps, 80);
  }, true);
})();


;/* ==== inline-nuros-catchall-v16.js ==== */
(function(){
"use strict";
if (window.__NUROS_CATCHALL_V16__) return;
window.__NUROS_CATCHALL_V16__ = true;
var g = typeof globalThis !== "undefined" ? globalThis : window;
function _stub(){ return undefined; }
function _arr(){ return []; }
function _obj(){ return {}; }
function def(name, fn){
  try {
    if (typeof g[name] !== "function") g[name] = fn;
    if (typeof window[name] !== "function") window[name] = g[name];
  } catch(e){}
}
/* Early shims — real modules overwrite later */
if (typeof g.notesState === "undefined") {
  g.notesState = { notes: [], selectedId: null, query: "", tagFilter: "", viewMode: "edit", saveTimer: null };
  window.notesState = g.notesState;
}
def("notesLoad", function(){ try { if (typeof window.__notesLoadReal === "function") return window.__notesLoadReal(); } catch(e){} });
def("notesRender", function(){ try { if (typeof notesRenderList === "function") notesRenderList(); if (typeof notesRenderPreview === "function") notesRenderPreview(); } catch(e){} });
def("notesRenderList", _stub);
def("notesRenderPreview", _stub);
def("notesRenderTags", _stub);
def("notesPersist", _stub);
def("notesSaveNow", _stub);
def("notesCreate", _stub);
def("notesSelect", _stub);
def("notesSetQuery", _stub);
def("notesSetTagFilter", _stub);
def("notesCycleView", _stub);
def("notesSetView", _stub);
def("notesExport", _stub);
def("notesImport", _stub);
def("notesRestoreSeed", _stub);
def("notes", _stub);
def("memeLoadBg", function(url){ try { if (typeof memeSetBackground==="function") memeSetBackground(url); } catch(e){} });
def("memeRefresh", _stub);
def("memeRender", _stub);
def("memeSetBackground", function(url){ try { if (window.memeState) window.memeState.bg = url; if (typeof memeDraw==="function") memeDraw(); } catch(e){} });
def("uftRenderRegList", _arr);
def("uftLoad", function(){ try { if (typeof window.__uftLoadReal === "function") return window.__uftLoadReal(); if (typeof uftRender === "function") uftRender(); } catch(e){} });
def("clarityClearSearch", _stub);
def("clarityGoogleTranslate", _stub);
def("clarityMarkWelcomeSeen", _stub);
def("clarityMediaScan", _stub);
def("clarityMemeApplyStandard", _stub);
def("clarityMemeDecorBg", _stub);
def("clarityOpenDoor", _stub);
def("clarityAzanToggle", function(on){ try { localStorage.setItem("clarity_azan_alert", on?"on":"off"); var b=document.getElementById("azan-notify-toggle"); if(b) b.checked=!!on; } catch(e){} });
def("clarityAmanaPrintPack", function(d){ try { if (typeof clarityAmanaPrintPackSafe==="function") clarityAmanaPrintPackSafe(d||{}); } catch(e){} });
def("clarityOpenModuleSource", _stub);
def("clarityPrintLegacy", _stub);
def("clarityIsraeliyatDeepFetch", _stub);
def("clarityIsraeliyatExpandScholar", _stub);
def("tjRender", _stub);
def("calligRedraw", _stub);
def("renderBookmarks", _stub);
def("prevRabbana", _stub);
def("nextRabbana", _stub);
def("saveBookmarks", _stub);
def("addBookmark", _stub);
def("removeBookmark", _stub);
def("bookmarkCurrentVerse", _stub);
def("bookmarkCurrentLesson", _stub);
def("getBookmarks", function(){ return []; });
def("switchTab", function(tabId){
  try {
    var panels = document.querySelectorAll(".tab-panel, [id^='tab-']");
    panels.forEach(function(p){ p.classList.remove("active"); p.hidden = true; });
    var el = document.getElementById("tab-"+tabId) || document.getElementById(tabId);
    if (el) { el.hidden = false; el.classList.add("active"); }
    document.body.setAttribute("data-active-tab", tabId || "");
  } catch(e){}
});
if (typeof g.MEME_BG_POOLS === "undefined") g.MEME_BG_POOLS = {nature:[],flowers:[],holy:[],spirit:[],free:[]};
if (typeof g.UFT_KEY === "undefined") g.UFT_KEY = "clarity_user_family_tree_v1";
if (typeof g.VERSE_POOL === "undefined") g.VERSE_POOL = [];
if (typeof g.memeState === "undefined") g.memeState = {img:null,text:"",bg:null};
if (typeof g.memeBgIdx === "undefined") g.memeBgIdx = {};
window.MEME_BG_POOLS = g.MEME_BG_POOLS;
window.UFT_KEY = g.UFT_KEY;
window.VERSE_POOL = g.VERSE_POOL;
window.memeState = g.memeState;
window.memeBgIdx = g.memeBgIdx;
})();


;/* ==== inline-nuros_rrra_meta_v18.js ==== */
(function(){
  "use strict";
  if (window.__NUROS_RRRA_META_V18__) return;
  window.__NUROS_RRRA_META_V18__ = true;

  var HUBS = ["reminder","reality","reflection","action"];
  var VAULT = {"user-family-tree-card":1,"faraid-card":1,"wasiyyah-card":1};
  var SKIP = {"traffic-stats-card":1,"palette-mgr-card":1,"bookmarks-card":1};

  function hubBody(name){
    return document.getElementById("rrra-hub-body-" + name) || document.getElementById("tab-" + name);
  }
  function tabPanel(name){
    return document.getElementById("tab-" + name);
  }

  function visibleCards(name){
    var body = hubBody(name);
    if (!body) return [];
    var root = (body.id && body.id.indexOf("rrra-hub-body") === 0) ? body : (body.querySelector(".rrra-hub-body") || body);
    var nodes = root.querySelectorAll(":scope > .card");
    if (!nodes.length) nodes = root.querySelectorAll(".card");
    var out = [], seen = [];
    Array.prototype.forEach.call(nodes, function(ch){
      if (!ch || !ch.classList || !ch.classList.contains("card")) return;
      if (ch.hasAttribute("hidden") || ch.getAttribute("aria-hidden") === "true") return;
      if (ch.style && (ch.style.display === "none" || ch.style.visibility === "hidden")) return;
      if (ch.id && (VAULT[ch.id] || SKIP[ch.id])) return;
      if (ch.getAttribute("data-deduped") === "1") return;
      if (seen.indexOf(ch) >= 0) return;
      seen.push(ch);
      out.push(ch);
    });
    return out;
  }

  function cardLabel(card){
    var h = card.querySelector("h2, h3, summary, .card-title");
    var tx = h ? (h.textContent || "") : (card.getAttribute("data-title") || card.id || "Section");
    tx = tx.replace(/\s+/g, " ").trim();
    if (tx.length > 42) tx = tx.slice(0, 40) + "\u2026";
    return tx || "Section";
  }

  function ensureCardId(card, idx, hub){
    if (card.id) return card.id;
    var slug = "rrra-" + hub + "-sec-" + idx;
    card.id = slug;
    return slug;
  }

  function jumpTo(id){
    var el = document.getElementById(id);
    if (!el) return;
    try {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch(e){
      el.scrollIntoView(true);
    }
    el.classList.add("rrra-flash");
    setTimeout(function(){ el.classList.remove("rrra-flash"); }, 1600);
  }

  function buildSummaryLinks(summaryEl, cards, hub){
    if (!summaryEl) return;
    summaryEl.innerHTML = "";
    summaryEl.setAttribute("role", "navigation");
    summaryEl.setAttribute("aria-label", "Jump to sections");
    cards.forEach(function(card, idx){
      var id = ensureCardId(card, idx, hub);
      var a = document.createElement("a");
      a.href = "#" + id;
      a.className = "rrra-jump";
      a.textContent = cardLabel(card);
      a.setAttribute("data-jump", id);
      a.addEventListener("click", function(ev){
        ev.preventDefault();
        jumpTo(id);
      });
      summaryEl.appendChild(a);
    });
  }

  function setText(el, text){
    if (!el) return;
    if ((el.textContent || "").trim() === text) return;
    el.textContent = text;
  }

  function markRailActive(name){
    document.querySelectorAll("#clarity-door-rail .door-rail-btn").forEach(function(btn){
      var tab = btn.getAttribute("data-rail-tab") || btn.getAttribute("data-rrra") || "";
      var on = (tab === name) || (name === "notes" && (tab === "notes" || tab === "vault" || tab === "amana"));
      btn.classList.toggle("active", on);
      btn.setAttribute("data-active", on ? "1" : "0");
      if (on) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });
  }

  function updateHub(name){
    var cards = visibleCards(name);
    var n = cards.length;
    var tab = tabPanel(name);
    var meta = tab ? tab.querySelector(".rrra-hub-meta") : null;
    var summary = tab ? tab.querySelector(".rrra-hub-summary") : null;
    if (meta) setText(meta, n + (n === 1 ? " section" : " sections"));
    if (summary) buildSummaryLinks(summary, cards, name);

    var el = document.getElementById("rrra-count-" + name);
    if (el) setText(el, String(n));
    document.querySelectorAll("[data-rail-tab='"+name+"'] .dr-count, [data-rail-tab='"+name+"'] .door-count").forEach(function(c){
      setText(c, String(n));
    });
    return n;
  }

  function currentHub(){
    for (var i = 0; i < HUBS.length; i++) {
      var tab = tabPanel(HUBS[i]);
      if (!tab) continue;
      if (tab.getAttribute("aria-hidden") === "false" || tab.classList.contains("active") ||
          (tab.style && tab.style.display && tab.style.display !== "none" && !tab.hidden)) {
        /* prefer visible */
        var st = window.getComputedStyle ? window.getComputedStyle(tab) : null;
        if (st && st.display === "none") continue;
        if (!tab.hidden) return HUBS[i];
      }
    }
    /* hash fallback */
    var h = (location.hash || "").replace(/^#/, "");
    if (HUBS.indexOf(h) >= 0) return h;
    if (h === "notes" || h === "vault" || h === "amana") return "notes";
    return "reminder";
  }

  function refreshAll(){
    HUBS.forEach(updateHub);
    markRailActive(currentHub());
  }

  function boot(){
    refreshAll();
    setTimeout(refreshAll, 500);
    setTimeout(refreshAll, 1500);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", function(){ setTimeout(refreshAll, 400); });

  document.addEventListener("click", function(ev){
    var b = ev.target && ev.target.closest && ev.target.closest("[data-rail-tab], [data-rrra]");
    if (!b) return;
    var name = b.getAttribute("data-rail-tab") || b.getAttribute("data-rrra") || "";
    setTimeout(function(){
      refreshAll();
      if (name) markRailActive(name);
    }, 60);
    setTimeout(refreshAll, 350);
  }, true);

  window.clarityRrraRefreshMeta = refreshAll;
  window.clarityRrraPolishCounts = refreshAll;
  window.clarityRrraUpdateCounts = refreshAll;
  window.clarityRrraJump = jumpTo;
})();


;/* ==== inline-nuros_amana_integrity_v1.js ==== */
(function(){
  "use strict";
  if (window.__NUROS_AMANA_INTEGRITY_V1__) return;
  window.__NUROS_AMANA_INTEGRITY_V1__ = true;
  function check(){
    var report = { ok: true, notes: [] };
    try {
      if (!document.getElementById("amana-vault-gate")) { report.ok = false; report.notes.push("gate missing"); }
      if (!document.getElementById("amana-vault-interior")) { report.ok = false; report.notes.push("interior missing"); }
      var interior = document.getElementById("amana-vault-interior");
      if (interior && !interior.hidden && interior.getAttribute("data-amana-sealed") === "1") {
        report.notes.push("sealed attr with visible interior — check gate script");
      }
      /* must not store passphrase keys */
      try {
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i) || "";
          if (/passphrase|password|amana-pass/i.test(k)) {
            report.ok = false;
            report.notes.push("suspicious localStorage key: " + k);
          }
        }
      } catch(e){}
    } catch(e){ report.ok = false; report.notes.push(String(e)); }
    try { window.__AMANA_INTEGRITY__ = report; } catch(e){}
    return report;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(check, 800); });
  else setTimeout(check, 800);
  window.clarityAmanaIntegrityCheck = check;
})();


;/* ==== inline-nuros_amana_unlock_v21.js ==== */
(function(){
  "use strict";
  if (window.__NUROS_AMANA_UNLOCK_V21__) return;
  window.__NUROS_AMANA_UNLOCK_V21__ = true;

  function $(id){ return document.getElementById(id); }

  function fullyOpenInterior(){
    var tab = $("tab-notes");
    var gate = $("amana-vault-gate");
    var interior = $("amana-vault-interior");
    if (!tab) return;
    tab.classList.remove("amana-locked");
    tab.classList.add("amana-unlocked", "active");
    tab.removeAttribute("hidden");
    tab.setAttribute("aria-hidden", "false");
    tab.style.removeProperty("display");
    if (gate) {
      gate.hidden = true;
      gate.setAttribute("hidden", "");
      gate.style.setProperty("display", "none", "important");
    }
    if (interior) {
      interior.hidden = false;
      interior.removeAttribute("hidden");
      interior.removeAttribute("inert");
      interior.setAttribute("aria-hidden", "false");
      interior.setAttribute("data-amana-sealed", "0");
      interior.style.setProperty("display", "block", "important");
      interior.style.setProperty("visibility", "visible", "important");
      interior.style.setProperty("pointer-events", "auto", "important");
    }
  }

  function fullyCloseInterior(){
    var tab = $("tab-notes");
    var gate = $("amana-vault-gate");
    var interior = $("amana-vault-interior");
    if (!tab) return;
    tab.classList.add("amana-locked");
    tab.classList.remove("amana-unlocked");
    if (gate) {
      gate.hidden = false;
      gate.removeAttribute("hidden");
      gate.style.setProperty("display", "block", "important");
      gate.style.setProperty("visibility", "visible", "important");
    }
    if (interior) {
      interior.hidden = true;
      interior.setAttribute("hidden", "");
      interior.setAttribute("inert", "");
      interior.setAttribute("aria-hidden", "true");
      interior.setAttribute("data-amana-sealed", "1");
      interior.style.setProperty("display", "none", "important");
      /* wipe fields on lock — security */
      try {
        interior.querySelectorAll("input, textarea").forEach(function(el){
          if (el.type === "checkbox" || el.type === "radio") el.checked = false;
          else if (el.tagName !== "SELECT") el.value = "";
        });
      } catch(e){}
    }
  }

  function showStatus(msg, isErr){
    var el = $("amana-gate-status");
    if (!el) return;
    el.textContent = msg || "";
    el.className = "av-status" + (isErr ? " err" : "");
    el.hidden = !msg;
    el.style.display = msg ? "block" : "none";
  }

  /** Patch setLockedUI once it exists */
  function patchSetLockedUI(){
    if (typeof window.setLockedUI !== "function" && typeof setLockedUI === "undefined") {
      /* gate script may keep setLockedUI local — patch via prototype on click path */
      return false;
    }
    return true;
  }

  /** Wrap gate unlock/create to force UI after success */
  function wireUnlockSuccessObserver(){
    var tab = $("tab-notes");
    if (!tab || tab.__unlockObsV21) return;
    tab.__unlockObsV21 = true;
    var was = tab.classList.contains("amana-unlocked");
    var mo = new MutationObserver(function(){
      var now = tab.classList.contains("amana-unlocked");
      if (now && !was) {
        fullyOpenInterior();
        showStatus("Vault open.", false);
        setTimeout(function(){ showStatus("", false); }, 1200);
      }
      if (!now && was) {
        fullyCloseInterior();
      }
      was = now;
    });
    mo.observe(tab, { attributes: true, attributeFilter: ["class"] });
  }

  /** Reliable unlock path: re-bind button with our wrapper after gate boots */
  function wireUnlockButton(){
    var btn = $("amana-btn-unlock");
    if (!btn || btn.__v21Wired) return;
    btn.__v21Wired = true;
    btn.addEventListener("click", function(){
      /* After gate async unlock finishes, force open if class flipped */
      var tries = 0;
      var timer = setInterval(function(){
        tries++;
        var tab = $("tab-notes");
        if (tab && tab.classList.contains("amana-unlocked")) {
          fullyOpenInterior();
          clearInterval(timer);
        }
        if (tries > 40) clearInterval(timer); /* ~4s */
      }, 250);
    }, false);
  }

  function wireCreateButton(){
    var btn = $("amana-btn-create");
    if (!btn || btn.__v21Wired) return;
    btn.__v21Wired = true;
    btn.addEventListener("click", function(){
      var tries = 0;
      var timer = setInterval(function(){
        tries++;
        var tab = $("tab-notes");
        if (tab && tab.classList.contains("amana-unlocked")) {
          fullyOpenInterior();
          clearInterval(timer);
        }
        if (tries > 40) clearInterval(timer);
      }, 250);
    }, false);
  }

  /** Enter key on unlock field */
  function wireEnter(){
    var pass = $("amana-pass-unlock");
    if (!pass || pass.__v21Enter) return;
    pass.__v21Enter = true;
    pass.addEventListener("keydown", function(ev){
      if (ev.key === "Enter") {
        ev.preventDefault();
        var btn = $("amana-btn-unlock");
        if (btn) btn.click();
      }
    });
  }

  /** Ensure status visible on failures — observe status text */
  function wireStatusVisibility(){
    var el = $("amana-gate-status");
    if (!el || el.__v21Stat) return;
    el.__v21Stat = true;
    var mo = new MutationObserver(function(){
      var t = (el.textContent || "").trim();
      if (t) {
        el.style.display = "block";
        el.hidden = false;
      }
    });
    mo.observe(el, { childList: true, characterData: true, subtree: true });
  }

  /** Open notes tab showing gate if locked */
  function ensureNotesPanel(){
    var tab = $("tab-notes");
    if (!tab) return;
    if (!tab.classList.contains("amana-unlocked")) {
      tab.classList.add("amana-locked");
      fullyCloseInterior();
    }
  }

  function openNotesFromRail(){
    document.querySelectorAll(".tab-panel").forEach(function(p){
      p.classList.remove("active");
      p.setAttribute("hidden", "");
    });
    var tab = $("tab-notes");
    if (!tab) return;
    tab.classList.add("active");
    tab.removeAttribute("hidden");
    tab.setAttribute("aria-hidden", "false");
    if (tab.classList.contains("amana-unlocked")) fullyOpenInterior();
    else {
      tab.classList.add("amana-locked");
      fullyCloseInterior();
    }
  }

  function boot(){
    /* keep locked class default */
    var tab = $("tab-notes");
    if (tab && !tab.classList.contains("amana-unlocked")) {
      tab.classList.add("amana-locked");
    }
    wireUnlockSuccessObserver();
    wireUnlockButton();
    wireCreateButton();
    wireEnter();
    wireStatusVisibility();
    ensureNotesPanel();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 300); });
  else setTimeout(boot, 300);
  window.addEventListener("load", function(){ setTimeout(boot, 300); });

  document.addEventListener("click", function(ev){
    var b = ev.target && ev.target.closest && ev.target.closest("[data-rail-tab='notes'], [data-rail-tab='vault']");
    if (!b) return;
    setTimeout(openNotesFromRail, 50);
    setTimeout(boot, 200);
  }, true);

  /* Public */
  window.clarityAmanaFullyOpen = fullyOpenInterior;
  window.clarityAmanaFullyClose = fullyCloseInterior;
})();
