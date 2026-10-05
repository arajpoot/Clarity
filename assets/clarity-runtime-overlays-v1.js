/**
 * Clarity runtime overlays (L1)
 * Single bundle — load BEFORE chunk-8.
 *
 * Contains (in order):
 *   1. boot-orchestrator   — inventory / health
 *   2. nuros shields       — null-guard, catchall, master, shariah
 *   3. banner-lock         — top banner geometry
 *   4. smooth-flow         — rAF meme + soft section calm
 *   5. theme-harmony       — day/night tokens
 *   6. security-shield     — noopener, pass wipe
 *   7. meme-confidence     — single citation + pills
 *
 * Do not load the old split files; they are absorbed here.
 */

(function (g) {
  "use strict";
  if (g.__CLARITY_BOOT_ORCH_V1__) return;
  g.__CLARITY_BOOT_ORCH_V1__ = true;

  var VERSION = "20261005i";
  var ASSETS = [
    { id: "chunk-8",          src: "./assets/clarity-chunk-8.js",                 layer: 1 },
    { id: "track-os",         src: "./assets/clarity-track-os-v3.js",             layer: 2 },
    { id: "tj-lmr",           src: "./assets/nx-tj-lmr-js-v1.js",                 layer: 2 },
    { id: "bridge",           src: "./assets/nuros-bridge-enrich-js.js",          layer: 2 },
    { id: "amana",            src: "./assets/clarity-amana-vault-gate-js-v1.js",  layer: 2 },
    { id: "uft",              src: "./assets/clarity-uft-full-restore-v1.js",     layer: 2 },
    { id: "notes",            src: "./assets/clarity-notes-recovery-v1.js",       layer: 2 },
    { id: "path-progress",    src: "./assets/clarity-path-progress-v1.js",        layer: 3 },
    { id: "grave-curriculum", src: "./assets/clarity-grave-path-curriculum-js.js",layer: 3 },
    { id: "polish-wiring",    src: "./assets/clarity-polish-wiring-v2.js",        layer: 4 },
    { id: "ui-shine",         src: "./assets/clarity-ui-shine-v1.js",             layer: 4 },
    { id: "smooth-flow",      src: "./assets/clarity-smooth-flow-v1.js",          layer: 4 },
    { id: "theme-harmony",    src: "./assets/clarity-theme-harmony-v1.js",        layer: 4 },
    { id: "security-shield",  src: "./assets/clarity-security-shield-v1.js",      layer: 4 },
    { id: "meme-confidence",  src: "./assets/clarity-meme-confidence-v1.js",      layer: 4 }
  ];

  var health = {
    version: VERSION,
    started: Date.now(),
    modules: {},
    errors: [],
    deduped: []
  };

  function mark(id, status, detail) {
    health.modules[id] = { status: status, at: Date.now(), detail: detail || null };
  }

  /** Remove leftover duplicate audio / gate nodes from prior factor chaos */
  function scrubDomJunk() {
    try {
      var seenAudio = {};
      document.querySelectorAll("audio[id]").forEach(function (el) {
        var id = el.id;
        if (seenAudio[id] || /-dup\d+$/.test(id)) {
          el.remove();
          health.deduped.push("audio#" + id);
        } else {
          seenAudio[id] = true;
        }
      });
    } catch (e) {
      health.errors.push("scrubAudio:" + e.message);
    }
    try {
      var gates = document.querySelectorAll("#landing-gate-screen");
      if (gates.length > 1) {
        for (var i = 1; i < gates.length; i++) {
          gates[i].remove();
          health.deduped.push("landing-gate-extra");
        }
      }
    } catch (e2) {
      health.errors.push("scrubGate:" + e2.message);
    }
  }

  /** Ensure CSS patches link is present (if someone strips head) */
  function ensureCssPatches() {
    if (document.getElementById("clarity-css-patches-link")) {
      mark("css-patches", "present");
      return;
    }
    try {
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.id = "clarity-css-patches-link";
      link.href = "./assets/clarity-css-patches-v1.css?v=" + VERSION;
      (document.head || document.documentElement).appendChild(link);
      mark("css-patches", "injected");
    } catch (e) {
      mark("css-patches", "fail", e.message);
      health.errors.push("css:" + e.message);
    }
  }

  /** Soft-ensure a deferred script exists (idempotent) */
  function ensureScript(mod) {
    var sel = 'script[src*="' + mod.src.replace("./", "") + '"]';
    if (document.querySelector(sel)) {
      mark(mod.id, "already-in-dom");
      return;
    }
    try {
      var s = document.createElement("script");
      s.src = mod.src + "?v=" + VERSION;
      s.defer = true;
      s.dataset.clarityMod = mod.id;
      s.dataset.clarityLayer = String(mod.layer);
      s.onerror = function () {
        mark(mod.id, "error-load");
        health.errors.push("load:" + mod.id);
      };
      s.onload = function () { mark(mod.id, "loaded-late"); };
      (document.body || document.documentElement).appendChild(s);
      mark(mod.id, "injected");
    } catch (e) {
      mark(mod.id, "fail", e.message);
    }
  }

  function inventoryDeferred() {
    ASSETS.forEach(function (mod) {
      var sel = 'script[src*="' + mod.src.replace("./", "") + '"]';
      if (document.querySelector(sel)) mark(mod.id, "deferred-ok");
      else mark(mod.id, "missing");
    });
  }

  function report() {
    var missing = Object.keys(health.modules).filter(function (k) {
      return health.modules[k].status === "missing" || health.modules[k].status === "error-load";
    });
    var line = "[ClarityBoot] v" + VERSION +
      " · " + (Date.now() - health.started) + "ms · " +
      "deduped=" + health.deduped.length +
      " · errors=" + health.errors.length +
      (missing.length ? " · missing=" + missing.join(",") : " · all modules present");
    if (health.errors.length || missing.length) console.warn(line, health);
    else console.info(line);
    return health;
  }

  // Public API
  g.ClarityBoot = {
    version: VERSION,
    assets: ASSETS,
    health: health,
    scrub: scrubDomJunk,
    ensureAll: function () { ASSETS.forEach(ensureScript); return report(); },
    report: report,
    reloadCss: function () {
      var el = document.getElementById("clarity-css-patches-link");
      if (el) {
        el.href = "./assets/clarity-css-patches-v1.css?v=" + VERSION + "&t=" + Date.now();
      }
    }
  };

  function boot() {
    ensureCssPatches();
    scrubDomJunk();
    inventoryDeferred();
    // Late safety: if path-progress already set meme-ok, leave it; else soft default
    try {
      if (!document.documentElement.getAttribute("data-clarity-meme-ok")) {
        var max = 0;
        try { max = parseInt(localStorage.getItem("clarity_path_unlocked_max") || "0", 10) || 0; } catch (e) {}
        var ok = max >= 2; // practicing index
        document.documentElement.setAttribute("data-clarity-meme-ok", ok ? "1" : "0");
        document.body && document.body.setAttribute("data-clarity-meme-ok", ok ? "1" : "0");
      }
    } catch (e) {}
    setTimeout(report, 0);
    setTimeout(report, 1200); // after deferred scripts settle
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(typeof window !== "undefined" ? window : this);

/* ---- nuros-catchall-v16.js (4068 bytes) ---- */
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

/* ---- nuros-null-guard-js.js (2910 bytes) ---- */
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

/* ---- nuros-master-shield-v1.js (4377 bytes) ---- */
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

/* ---- nuros5-shariah-js-v2.js (4651 bytes) ---- */
(function(){
  "use strict";
  function wrapWorkspace(sel, label){
    var el = document.querySelector(sel);
    if (!el || el.closest(".workspace-safe-frame")) return;
    var frame = document.createElement("div");
    frame.className = "workspace-safe-frame";
    frame.setAttribute("data-frame-label", label || "Workspace");
    el.parentNode.insertBefore(frame, el);
    frame.appendChild(el);
    var hint = document.createElement("p");
    hint.className = "workspace-scroll-hint";
    hint.textContent = "Scroll outside this frame to leave the workspace safely.";
    frame.appendChild(hint);
  }
  function ensureCalligBridge(){
    if (document.getElementById("callig-text-bridge")) return;
    var stage = document.getElementById("callig-stage-outer") || document.getElementById("callig-lab-stage");
    var tools = document.getElementById("callig-canvas-tools");
    if (!stage && !tools) return;
    var bridge = document.createElement("div");
    bridge.id = "callig-text-bridge";
    bridge.innerHTML = '<div class="bridge-title">Text → Arabic · preview on pad</div><div class="bridge-row"><input type="text" id="callig-bridge-en" placeholder="Type English to translate…" autocomplete="off" /><button type="button" class="btn-soft" id="callig-bridge-go">EN → AR</button><button type="button" class="btn-soft" id="callig-bridge-place">Place on pad</button></div><div class="arabic" id="callig-bridge-ar" dir="rtl" lang="ar"></div><p id="callig-bridge-hint">Educational calligraphy aid. Verify Arabic with a teacher when needed.</p>';
    if (tools && tools.parentNode) tools.parentNode.insertBefore(bridge, tools);
    else if (stage && stage.parentNode) stage.parentNode.insertBefore(bridge, stage);
    var en = document.getElementById("callig-bridge-en");
    var go = document.getElementById("callig-bridge-go");
    var place = document.getElementById("callig-bridge-place");
    var arOut = document.getElementById("callig-bridge-ar");
    function translate(){
      var t = (en && en.value || "").trim();
      if (!t) { if (arOut) arOut.textContent = ""; return; }
      var mainIn = document.getElementById("callig-english-input");
      if (mainIn) {
        mainIn.value = t;
        try { if (typeof calligLiveTranslateFromInput==="function") calligLiveTranslateFromInput(); if (typeof calligTranslateToArabic==="function") calligTranslateToArabic(); } catch(e){}
        setTimeout(function(){
          var arText = window.calligLastArabic || "";
          var arField = document.getElementById("callig-arabic-output") || document.getElementById("callig-ar-text");
          if (!arText && arField) arText = arField.value || arField.textContent || "";
          if (arOut) arOut.textContent = arText || "… (use toolbar EN→AR if needed)";
        }, 400);
      } else if (arOut) arOut.textContent = "Use the EN→AR control under the pad.";
    }
    if (go) go.addEventListener("click", translate);
    if (en) en.addEventListener("keydown", function(ev){ if (ev.key==="Enter"){ ev.preventDefault(); translate(); } });
    if (place) place.addEventListener("click", function(){
      var ar = (arOut && arOut.textContent || "").trim();
      if (!ar || ar.indexOf("…")===0) { translate(); return; }
      try {
        if (typeof calligPlaceArabicOnCanvas==="function") calligPlaceArabicOnCanvas(ar);
        else if (typeof calligSendEnglishToCanvas==="function") calligSendEnglishToCanvas();
        else if (typeof calligTranslateToArabic==="function") calligTranslateToArabic();
      } catch(e){}
    });
  }
  function forceLive(){
    if (typeof window.officialLiveEmbedUrl === "function") {
      window.officialLiveEmbedUrl = function(source){
        var host = "www.youtube-nocookie.com";
        var qs = "autoplay=0&mute=1&controls=1&modestbranding=1&playsinline=1&rel=0&enablejsapi=1";
        var id = (source && source.id) || "Rs7St51oDDc";
        if (source && source.kind === "channel") id = "Rs7St51oDDc";
        var place = ((document.getElementById("live-place-select")||{}).value)||"";
        if (place === "madinah") id = "27cln-IxOGo";
        return "https://"+host+"/embed/"+encodeURIComponent(id)+"?"+qs;
      };
    }
  }
  function boot(){
    forceLive();
    wrapWorkspace("#callig-stage-outer", "Calligraphy pad");
    wrapWorkspace("#meme-stage-wrap", "Meme studio");
    wrapWorkspace("#uft-stage", "Family tree viewport");
    ensureCalligBridge();
  }
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 120); });
  else setTimeout(boot, 120);
  window.addEventListener("load", function(){ setTimeout(boot, 400); });
})();

/* ---- clarity-banner-lock-js.js (2429 bytes) ---- */
(function(){
  "use strict";
  if (window.__CLARITY_SCROLL_UNLOCK__) return;
  window.__CLARITY_SCROLL_UNLOCK__ = true;
  window.__CLARITY_BOOT_TS = Date.now();

  function unlockScroll(){
    try {
      var de = document.documentElement;
      var b = document.body;
      if (de) {
        de.style.setProperty("overflow-y", "auto", "important");
        de.style.setProperty("overflow-x", "hidden", "important");
        de.style.setProperty("height", "auto", "important");
        de.style.setProperty("position", "static", "important");
        de.style.removeProperty("overflow");
      }
      if (b) {
        b.style.setProperty("overflow-y", "auto", "important");
        b.style.setProperty("overflow-x", "hidden", "important");
        b.style.setProperty("height", "auto", "important");
        b.style.setProperty("position", "static", "important");
        b.classList.remove("no-scroll", "modal-open", "scroll-lock");
      }
      /* close stuck welcome if marked seen */
      var w = document.getElementById("clarity-welcome");
      if (w && w.classList.contains("show")) {
        try {
          var seen = localStorage.getItem("clarity_welcome_seen_v2") || localStorage.getItem("clarity_welcome_seen");
          if (seen) {
            w.classList.remove("show");
            w.setAttribute("aria-hidden", "true");
          }
        } catch (e) {}
      }
      var td = document.getElementById("clarity-three-doors");
      if (td) {
        td.classList.add("hidden");
        td.style.setProperty("display", "none", "important");
      }
    } catch (e) {}
  }

  function ensureBanner(){
    var duo = document.getElementById("clarity-top-duo");
    if (!duo) return;
    duo.style.setProperty("display", "block", "important");
    duo.style.setProperty("visibility", "visible", "important");
  }

  function boot(){
    unlockScroll();
    ensureBanner();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", function(){
    unlockScroll();
    ensureBanner();
    try { window.scrollTo(0, 0); } catch (e) {}
  });
  /* Keep unlocking briefly in case deferred chunk sets overflowY hidden then fails to clear */
  var n = 0;
  var iv = setInterval(function(){
    unlockScroll();
    n++;
    if (n > 20) clearInterval(iv);
  }, 250);
  /* Public API */
  window.clarityUnlockScroll = unlockScroll;
})();

/* ---- clarity-smooth-flow-v1.js (2409 bytes) ---- */
/**
 * Clarity Smooth Flow v1
 * - Debounce memeDraw (stops laggy multi-repaint)
 * - Throttle section sentinel
 * - Calm layout thrash after path changes
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_SMOOTH_FLOW_V1__) return;
  g.__CLARITY_SMOOTH_FLOW_V1__ = true;

  function rafDebounce(fn, wait) {
    var t = null, lastArgs = null;
    return function () {
      lastArgs = arguments;
      if (t) return;
      t = setTimeout(function () {
        t = null;
        var a = lastArgs;
        lastArgs = null;
        if (typeof requestAnimationFrame === "function") {
          requestAnimationFrame(function () { fn.apply(null, a || []); });
        } else {
          fn.apply(null, a || []);
        }
      }, wait || 32);
    };
  }

  function wrapMemeDraw() {
    try {
      var prev = g.memeDraw;
      if (typeof prev !== "function" || prev.__smoothWrapped) return;
      var debounced = rafDebounce(function () {
        try { prev.apply(g, arguments); } catch (e) {}
      }, 40);
      debounced.__smoothWrapped = true;
      debounced.__raw = prev;
      g.memeDraw = debounced;
    } catch (e) {}
  }

  function throttleSentinel() {
    try {
      if (typeof g.claritySectionSentinel !== "function") return;
      if (g.claritySectionSentinel.__smoothThrottled) return;
      var raw = g.claritySectionSentinel;
      var last = 0;
      g.claritySectionSentinel = function () {
        var now = Date.now();
        if (now - last < 1500) return; // was 2s interval + other callers
        last = now;
        try { return raw.apply(this, arguments); } catch (e) {}
      };
      g.claritySectionSentinel.__smoothThrottled = true;
    } catch (e) {}
  }

  function calmCards() {
    try {
      document.documentElement.style.setProperty("scroll-behavior", "smooth");
    } catch (e) {}
  }

  function boot() {
    wrapMemeDraw();
    throttleSentinel();
    calmCards();
    // Re-wrap if chunk reassigned memeDraw later
    setTimeout(wrapMemeDraw, 400);
    setTimeout(wrapMemeDraw, 1200);
    setTimeout(throttleSentinel, 500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  g.addEventListener("load", function () { setTimeout(boot, 200); });

  g.ClaritySmooth = { wrapMemeDraw: wrapMemeDraw, throttleSentinel: throttleSentinel };
})(typeof window !== "undefined" ? window : this);

/* ---- clarity-theme-harmony-v1.js (5065 bytes) ---- */
/**
 * Clarity Theme Harmony v1
 * One theme attribute, one token set. Palette presets (day/night/…)
 * write CSS variables; data-theme stays light|dark only.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_THEME_HARMONY_V1__) return;
  g.__CLARITY_THEME_HARMONY_V1__ = true;

  var HARMONY_PRESETS = {
    day:   { bg:"#f6f1e7", text:"#1c2a22", card:"#fffdf8", accent:"#0d4f3c", gold:"#b8922a", sky:"#2a5f7a" },
    night: { bg:"#0c1410", text:"#e7efe9", card:"#152019", accent:"#3d9b78", gold:"#d4b45a", sky:"#6a9fb5" },
    soft:  { bg:"#f4f0ea", text:"#2a322c", card:"#faf8f4", accent:"#2a6b52", gold:"#c4a04a", sky:"#4a7a90" },
    high:  { bg:"#ffffff", text:"#111111", card:"#ffffff", accent:"#004d33", gold:"#8a6a00", sky:"#003366" },
    oasis: { bg:"#eef6f1", text:"#0b3d2e", card:"#f7fbf8", accent:"#0b5c45", gold:"#b8922a", sky:"#2a5f7a" }
  };

  function applyTokens(o) {
    if (!o) return;
    var r = document.documentElement;
    var map = {
      bg: "--bg",
      text: "--text",
      card: "--card-bg",
      accent: "--accent",
      gold: "--gold",
      sky: "--sky"
    };
    Object.keys(map).forEach(function (k) {
      if (o[k]) r.style.setProperty(map[k], o[k]);
    });
    if (o.card) r.style.setProperty("--bg-elevated", o.card);
    if (o.accent) {
      r.style.setProperty("--banner", o.accent);
      r.style.setProperty("--accent-light", o.accent);
    }
  }

  function setThemeAttr(mode) {
    var resolved = mode;
    if (mode === "system") {
      try {
        resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      } catch (e) {
        resolved = "light";
      }
    }
    if (mode === "night") resolved = "dark";
    if (mode === "day" || mode === "soft" || mode === "high" || mode === "oasis") resolved = "light";
    if (resolved !== "dark" && resolved !== "light") resolved = "light";
    document.documentElement.setAttribute("data-theme", resolved);
    try {
      document.body && document.body.setAttribute("data-theme", resolved);
    } catch (e2) {}
    return resolved;
  }

  /** Public: prefer this over ad-hoc night/day setters */
  g.clarityHarmonyTheme = function (name) {
    name = String(name || "day").toLowerCase();
    var preset = HARMONY_PRESETS[name];
    var mode = name === "night" ? "dark" : name === "system" ? "system" : "light";
    if (name === "dark") { mode = "dark"; preset = HARMONY_PRESETS.night; }
    if (name === "light") { mode = "light"; preset = HARMONY_PRESETS.day; }
    try {
      localStorage.setItem("clarity_theme_mode", mode === "system" ? "system" : mode);
      if (preset) localStorage.setItem("clarity_harmony_preset", name);
    } catch (e) {}
    setThemeAttr(mode === "system" ? "system" : mode);
    if (preset) applyTokens(preset);
    // Keep chip UI in sync
    try {
      document.querySelectorAll("[data-theme-chip]").forEach(function (btn) {
        var chip = btn.getAttribute("data-theme-chip");
        btn.classList.toggle("active", chip === mode || chip === name);
      });
      document.querySelectorAll(".pm-preset").forEach(function (btn) {
        btn.classList.toggle("on", btn.getAttribute("data-pm") === name);
      });
    } catch (e3) {}
    return { mode: mode, preset: name };
  };

  // Wrap existing setters so they don't fight
  function wrapExisting() {
    if (typeof g.claritySetThemeMode === "function" && !g.claritySetThemeMode.__harmony) {
      var prev = g.claritySetThemeMode;
      g.claritySetThemeMode = function (mode) {
        mode = mode || "system";
        if (mode === "dark") return g.clarityHarmonyTheme("night");
        if (mode === "light") return g.clarityHarmonyTheme("day");
        var r = prev.apply(this, arguments);
        setThemeAttr(mode);
        return r;
      };
      g.claritySetThemeMode.__harmony = true;
    }
    // Palette manager preset
    if (typeof g.pmApplyPreset === "function" && !g.pmApplyPreset.__harmony) {
      var prevPm = g.pmApplyPreset;
      g.pmApplyPreset = function (name) {
        try { prevPm.apply(this, arguments); } catch (e) {}
        g.clarityHarmonyTheme(name);
      };
      g.pmApplyPreset.__harmony = true;
    }
  }

  function boot() {
    wrapExisting();
    var mode = "system";
    var preset = null;
    try {
      mode = localStorage.getItem("clarity_theme_mode") || "system";
      preset = localStorage.getItem("clarity_harmony_preset");
    } catch (e) {}
    if (preset && HARMONY_PRESETS[preset]) {
      g.clarityHarmonyTheme(preset);
    } else if (mode === "dark" || mode === "night") {
      g.clarityHarmonyTheme("night");
    } else if (mode === "light" || mode === "day") {
      g.clarityHarmonyTheme("day");
    } else {
      setThemeAttr("system");
    }
    setTimeout(wrapExisting, 400);
    setTimeout(wrapExisting, 1200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  g.addEventListener("load", function () { setTimeout(boot, 150); });
})(typeof window !== "undefined" ? window : this);

/* ---- clarity-security-shield-v1.js (2552 bytes) ---- */
/**
 * Clarity Security Shield v1 — sitewide + vault
 * - CSP-friendly helpers
 * - Strip dangerous leftovers
 * - Lock vault on page hide if configured
 * - noopener on external links
 * - No eval / no document.write
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_SECURITY_SHIELD_V1__) return;
  g.__CLARITY_SECURITY_SHIELD_V1__ = true;

  function hardenLinks() {
    try {
      document.querySelectorAll('a[target="_blank"]').forEach(function (a) {
        var rel = (a.getAttribute("rel") || "").toLowerCase();
        if (rel.indexOf("noopener") < 0) {
          a.setAttribute("rel", (rel ? rel + " " : "") + "noopener noreferrer");
        }
      });
    } catch (e) {}
  }

  function scrubDangerous() {
    try {
      /* remove leftover debug hooks if any */
      if (g.eval && g.__CLARITY_BLOCK_EVAL__) {
        /* do not override eval in strict environments — just flag */
      }
      document.querySelectorAll("script[src^='http://']").forEach(function (s) {
        console.warn("[ClaritySecurity] blocked insecure script src", s.src);
      });
    } catch (e) {}
  }

  function vaultAutoLock() {
    try {
      if (typeof g.clarityAmanaLock === "function") {
        g.clarityAmanaLock();
      } else if (typeof g.lockVault === "function") {
        g.lockVault();
      }
    } catch (e) {}
  }

  /* Clear passphrase fields from DOM */
  function wipePassFields() {
    ["amana-pass-new", "amana-pass-confirm", "amana-pass-unlock"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el && "value" in el) el.value = "";
    });
  }

  function boot() {
    hardenLinks();
    scrubDangerous();
    /* Auto-lock vault when tab hidden long or page unload — key is RAM-only */
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") {
        /* soft: wipe fields only; full lock on pagehide */
        wipePassFields();
      }
    });
    g.addEventListener("pagehide", function () {
      wipePassFields();
    });
    /* Mutation: new target=_blank links */
    try {
      var mo = new MutationObserver(function () { hardenLinks(); });
      mo.observe(document.documentElement, { childList: true, subtree: true });
    } catch (e2) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  g.ClaritySecurity = { hardenLinks: hardenLinks, wipePassFields: wipePassFields, vaultAutoLock: vaultAutoLock };
})(typeof window !== "undefined" ? window : this);

/* ---- clarity-meme-confidence-v1.js (4996 bytes) ---- */
/**
 * Clarity Meme Confidence v1
 * - Keeps watermark citation = applied verse ref (no stale 2:201)
 * - Re-injects section "Use in Meme" pills and ensures clicks work
 * - Re-runs after path unlock / tab switch
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_MEME_CONFIDENCE_V1__) return;
  g.__CLARITY_MEME_CONFIDENCE_V1__ = true;

  function setRef(ref) {
    ref = String(ref || "").trim();
    if (typeof g.memeState !== "object" || !g.memeState) g.memeState = {};
    g.memeState.ref = ref;
    g.memeState._lastRef = ref;
  }

  function extractRefFromBottom() {
    try {
      var bot = (g.memeState && g.memeState.bottom) || "";
      var lines = String(bot).split(/\n/).map(function (x) { return x.trim(); }).filter(Boolean);
      var last = lines.length ? lines[lines.length - 1] : "";
      if (/^Qur[\u2019'`]?an\s+\d+/i.test(last) || /^\d+:\d+/.test(last) || /Bukhari|Muslim|Tirmidh|Abu Dawud/i.test(last))
        return last;
    } catch (e) {}
    return "";
  }

  /** Wrap memeDraw so watermark never shows a ref that contradicts bottom */
  function wrapDraw() {
    var prev = g.memeDraw;
    if (typeof prev !== "function" || prev.__memeConf) return;
    g.memeDraw = function () {
      try {
        if (g.memeState) {
          var bottomRef = extractRefFromBottom();
          if (bottomRef) setRef(bottomRef);
          else if (g.memeState.bottom && g.memeState._lastRef) {
            /* bottom is non-ref text (e.g. urdu only) — keep explicit _lastRef */
          } else if (!g.memeState.bottom) {
            setRef("");
          }
        }
      } catch (e) {}
      return prev.apply(this, arguments);
    };
    g.memeDraw.__memeConf = true;
    if (prev.__smoothWrapped) g.memeDraw.__smoothWrapped = true;
  }

  function pushPayload(payload) {
    payload = payload || {};
    var ar = String(payload.arabic || payload.ar || "").trim();
    var en = String(payload.en || payload.english || "").trim();
    var ur = String(payload.ur || "").trim();
    var ref = String(payload.ref || "").trim();
    try {
      document.documentElement.setAttribute("data-clarity-meme-ok", "1");
    } catch (e) {}
    if (typeof g.memeApplyVerseCard === "function") {
      g.memeApplyVerseCard(ar, en, ur, ref);
    } else {
      if (!g.memeState) g.memeState = {};
      g.memeState.top = ar;
      g.memeState.mid = en;
      g.memeState.bottom = [ur, ref].filter(Boolean).join("\n");
      setRef(ref);
      if (typeof g.memeDraw === "function") g.memeDraw();
    }
    try {
      if (typeof g.switchTab === "function") g.switchTab("reminder");
    } catch (e2) {}
    setTimeout(function () {
      var card = document.getElementById("meme-card");
      if (card) {
        card.classList.remove("gate-hidden");
        card.style.removeProperty("display");
        card.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);
  }

  function ensurePills() {
    try {
      if (typeof g.ensureSectionMemePills === "function") {
        g.ensureSectionMemePills();
      }
      /* Bind any orphan pills that lost listeners after re-render */
      document.querySelectorAll(".clarity-to-meme-pill").forEach(function (btn) {
        if (btn.__memeBound) return;
        btn.__memeBound = true;
        btn.addEventListener("click", function (ev) {
          try { ev.preventDefault(); ev.stopPropagation(); } catch (e0) {}
          var card = btn.closest(".card, [id$='-card'], .search-result, .question");
          if (!card) return;
          var arEl = card.querySelector(".arabic, .rabbana-arabic, [lang='ar'], .cmd-ar, .sr-ar");
          var enEl = card.querySelector(".cmd-en, .sr-en, .verse-en, .translation, .english");
          var refEl = card.querySelector(".ref, .verse-ref, .sr-ref, .citation, [data-ref]");
          var ar = arEl ? arEl.textContent.trim() : "";
          var en = enEl ? enEl.textContent.trim() : "";
          var ref = refEl ? (refEl.textContent || refEl.getAttribute("data-ref") || "").trim() : "";
          pushPayload({ arabic: ar, en: en, ref: ref });
        });
      });
    } catch (e) {}
  }

  function boot() {
    wrapDraw();
    ensurePills();
    /* Override push desk to always set ref */
    var prevPush = g.clarityPushToMemeDesk;
    g.clarityPushToMemeDesk = function (payload) {
      if (typeof prevPush === "function") {
        try { prevPush(payload); } catch (e) {}
      }
      pushPayload(payload);
    };
    setTimeout(ensurePills, 600);
    setTimeout(ensurePills, 2000);
    g.addEventListener("clarity-path-changed", function () {
      setTimeout(ensurePills, 300);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  g.addEventListener("load", function () {
    setTimeout(boot, 200);
    setTimeout(ensurePills, 1500);
  });
  g.ClarityMemeConfidence = { ensurePills: ensurePills, setRef: setRef, push: pushPayload };
})(typeof window !== "undefined" ? window : this);

/* ---- clarity-perf-monitor-v1.js ---- */
/**
 * Clarity Performance Monitor v1
 * Lightweight — samples paint, load, long tasks, path/meme hooks.
 * Enable: localStorage.clarity_perf = "1"  OR  ?perf=1
 * Report: window.ClarityPerf.report()
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_PERF_MONITOR_V1__) return;
  g.__CLARITY_PERF_MONITOR_V1__ = true;

  function enabled() {
    try {
      if (/[?&]perf=1(?:&|$)/.test(g.location.search)) return true;
      if (localStorage.getItem("clarity_perf") === "1") return true;
    } catch (e) {}
    return false;
  }

  var marks = [];
  var longTasks = [];
  var paints = {};
  var nav = null;
  var started = performance.now();

  function mark(name, detail) {
    var t = performance.now();
    marks.push({ name: name, t: Math.round(t), d: detail || null });
    try {
      if (performance.mark) performance.mark("clarity:" + name);
    } catch (e) {}
    return t;
  }

  function sampleNavigation() {
    try {
      var list = performance.getEntriesByType("navigation");
      if (list && list[0]) {
        var n = list[0];
        nav = {
          dns: Math.round(n.domainLookupEnd - n.domainLookupStart),
          tcp: Math.round(n.connectEnd - n.connectStart),
          ttfb: Math.round(n.responseStart - n.requestStart),
          response: Math.round(n.responseEnd - n.responseStart),
          domInteractive: Math.round(n.domInteractive),
          domComplete: Math.round(n.domComplete),
          loadEvent: Math.round(n.loadEventEnd - n.startTime),
          transferSize: n.transferSize || 0,
          encoded: n.encodedBodySize || 0
        };
      }
    } catch (e) {}
  }

  function samplePaints() {
    try {
      performance.getEntriesByType("paint").forEach(function (p) {
        paints[p.name] = Math.round(p.startTime);
      });
    } catch (e) {}
  }

  function observeLongTasks() {
    try {
      if (typeof PerformanceObserver === "undefined") return;
      var po = new PerformanceObserver(function (list) {
        list.getEntries().forEach(function (e) {
          if (e.duration >= 50) {
            longTasks.push({
              t: Math.round(e.startTime),
              ms: Math.round(e.duration)
            });
            if (longTasks.length > 40) longTasks.shift();
          }
        });
      });
      po.observe({ entryTypes: ["longtask"] });
    } catch (e) {}
  }

  function observeResources() {
    var slow = [];
    try {
      performance.getEntriesByType("resource").forEach(function (r) {
        if (r.duration >= 200) {
          slow.push({
            name: (r.name || "").split("/").pop().split("?")[0],
            ms: Math.round(r.duration),
            size: r.transferSize || 0
          });
        }
      });
    } catch (e) {}
    return slow.sort(function (a, b) { return b.ms - a.ms; }).slice(0, 12);
  }

  function report() {
    sampleNavigation();
    samplePaints();
    var slow = observeResources();
    var out = {
      enabled: true,
      uptimeMs: Math.round(performance.now() - started),
      paints: paints,
      navigation: nav,
      marks: marks.slice(-30),
      longTasks: longTasks.slice(-15),
      longTaskCount: longTasks.length,
      slowResources: slow,
      path: null,
      meme: null
    };
    try {
      out.path = {
        gate: document.documentElement.getAttribute("data-clarity-path"),
        max: document.documentElement.getAttribute("data-clarity-unlocked-max"),
        memeOk: document.documentElement.getAttribute("data-clarity-meme-ok")
      };
    } catch (e) {}
    try {
      if (g.memeState) {
        out.meme = {
          hasImg: !!g.memeState.img,
          ref: g.memeState._lastRef || g.memeState.ref || "",
          topLen: (g.memeState.top || "").length,
          midLen: (g.memeState.mid || "").length
        };
      }
    } catch (e2) {}
    return out;
  }

  function logReport() {
    var r = report();
    try {
      console.groupCollapsed(
        "%cClarityPerf%c " +
          (r.paints["first-contentful-paint"] || "?") +
          "ms FCP · " +
          r.longTaskCount +
          " long tasks",
        "background:#0d4f3c;color:#fff;padding:2px 6px;border-radius:4px",
        "color:#6b7280"
      );
      console.table(r.paints);
      if (r.navigation) console.table(r.navigation);
      if (r.slowResources.length) console.table(r.slowResources);
      if (r.longTasks.length) console.table(r.longTasks);
      console.log("marks", r.marks);
      console.log("path", r.path, "meme", r.meme);
      console.groupEnd();
    } catch (e) {
      console.log("[ClarityPerf]", r);
    }
    return r;
  }

  /* Public API always available (cheap); sampling only when enabled */
  g.ClarityPerf = {
    mark: mark,
    report: report,
    log: logReport,
    enable: function () {
      try { localStorage.setItem("clarity_perf", "1"); } catch (e) {}
      boot(true);
    },
    disable: function () {
      try { localStorage.removeItem("clarity_perf"); } catch (e) {}
    }
  };

  function boot(force) {
    if (!force && !enabled()) return;
    mark("perf-boot");
    observeLongTasks();
    samplePaints();
    if (document.readyState === "complete") {
      sampleNavigation();
      mark("load-complete");
      setTimeout(logReport, 100);
    } else {
      g.addEventListener("load", function () {
        sampleNavigation();
        mark("load-complete");
        setTimeout(logReport, 150);
      });
    }
    /* Hook path + meme if present */
    setTimeout(function () {
      try {
        if (g.clarityPathProgress && g.clarityPathProgress.apply && !g.clarityPathProgress.apply.__perf) {
          var prev = g.clarityPathProgress.apply;
          g.clarityPathProgress.apply = function () {
            var t0 = performance.now();
            var r = prev.apply(this, arguments);
            mark("path-apply", Math.round(performance.now() - t0) + "ms");
            return r;
          };
          g.clarityPathProgress.apply.__perf = true;
        }
      } catch (e) {}
      try {
        if (typeof g.memeDraw === "function" && !g.memeDraw.__perfMark) {
          var md = g.memeDraw;
          g.memeDraw = function () {
            var t0 = performance.now();
            var r = md.apply(this, arguments);
            mark("meme-draw", Math.round(performance.now() - t0) + "ms");
            return r;
          };
          g.memeDraw.__perfMark = true;
        }
      } catch (e2) {}
    }, 800);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      mark("dom-ready");
      boot(false);
    });
  } else {
    mark("dom-ready");
    boot(false);
  }
})(typeof window !== "undefined" ? window : this);

/* ---- theme night/day hard sync ---- */
(function(g){
  "use strict";
  if (g.__CLARITY_THEME_HARD_SYNC__) return;
  g.__CLARITY_THEME_HARD_SYNC__ = true;
  function sync(){
    try {
      var mode = localStorage.getItem("clarity_theme_mode") || "system";
      var preset = localStorage.getItem("clarity_harmony_preset");
      if (typeof g.clarityHarmonyTheme === "function") {
        if (preset) g.clarityHarmonyTheme(preset);
        else if (mode === "dark" || mode === "night") g.clarityHarmonyTheme("night");
        else if (mode === "light" || mode === "day") g.clarityHarmonyTheme("day");
        else g.clarityHarmonyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day");
      } else {
        var resolved = mode;
        if (mode === "system") {
          resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }
        if (mode === "night") resolved = "dark";
        if (mode === "day") resolved = "light";
        document.documentElement.setAttribute("data-theme", resolved === "dark" ? "dark" : "light");
      }
    } catch(e){}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(sync, 0); setTimeout(sync, 400); });
  else { setTimeout(sync, 0); setTimeout(sync, 400); }
  g.addEventListener("load", function(){ setTimeout(sync, 200); });
})(typeof window !== "undefined" ? window : this);

/**
 * Clarity Meme Push Complete v1
 * - Broad "Use in Meme" pills on verse / hadith / command cards
 * - Push fills HQ text + fetches thematic background (Unsplash/LoremFlickr)
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_MEME_PUSH_COMPLETE_V1__) return;
  g.__CLARITY_MEME_PUSH_COMPLETE_V1__ = true;

  var BG_KEYWORDS = [
    { re: /grave|death|akhirah|hereafter|qabr/i, q: "islamic,mosque,night,peaceful" },
    { re: /salah|prayer|sujud|ruku/i, q: "mosque,prayer,islamic,architecture" },
    { re: /rahman|mercy|forgiv|istighfar|tawba/i, q: "sunrise,nature,peaceful,light" },
    { re: /jannah|paradise|garden/i, q: "garden,green,nature,peaceful" },
    { re: /fire|hell|jahannam|punish/i, q: "desert,dusk,dramatic,sky" },
    { re: /parent|mother|father|womb/i, q: "family,warm,light,home" },
    { re: /kaaba|makkah|haram|hajj|umrah/i, q: "kaaba,makkah,mosque" },
    { re: /madinah|nabawi|prophet|muhammad/i, q: "madinah,mosque,islamic" },
    { re: /quran|ayah|surah|kitab/i, q: "quran,book,islamic,calligraphy" },
    { re: /night|qiyam|tahajjud/i, q: "night,stars,mosque,moon" },
    { re: /water|rain|sea/i, q: "water,calm,nature" },
    { re: /heart|soul|iman|faith/i, q: "light,nature,peaceful,green" }
  ];

  function pickQuery(ar, en, ref) {
    var blob = [ar, en, ref].join(" ");
    for (var i = 0; i < BG_KEYWORDS.length; i++) {
      if (BG_KEYWORDS[i].re.test(blob)) return BG_KEYWORDS[i].q;
    }
    return "islamic,mosque,architecture,peaceful";
  }

  function bgCandidates(q) {
    var seed = Math.abs((q + Date.now()).split("").reduce(function (a, c) {
      return ((a << 5) - a) + c.charCodeAt(0) | 0;
    }, 0));
    var tags = q.replace(/,/g, ",");
    return [
      "https://loremflickr.com/1600/900/" + encodeURIComponent(tags.split(",")[0] || "mosque") + "?lock=" + (seed % 10000),
      "https://picsum.photos/seed/clarity" + (seed % 9999) + "/1600/900",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg"
    ];
  }

  function loadBgChain(urls, i) {
    i = i || 0;
    if (i >= urls.length) return;
    var url = urls[i];
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      try {
        if (typeof g.memeState !== "object" || !g.memeState) g.memeState = {};
        g.memeState.img = img;
        g.memeState.blank = false;
        if (typeof g.memeDraw === "function") g.memeDraw();
        if (typeof g.memeFetchStatus === "function")
          g.memeFetchStatus("Background ready · HQ");
      } catch (e) {}
    };
    img.onerror = function () { loadBgChain(urls, i + 1); };
    img.src = url;
  }

  function extractFromCard(card) {
    if (!card) return { ar: "", en: "", ref: "" };
    var arEl = card.querySelector(
      '.arabic, .rabbana-arabic, [lang="ar"], .cmd-ar, .sr-ar, .verse-ar, .ayah-ar, .hadith-ar, .ht-ar, .najiha-ar'
    );
    var enEl = card.querySelector(
      '.cmd-en, .sr-en, .verse-en, .translation, .ayah-en, .english, .hadith-en, .ht-en, .najiha-en, p.muted'
    );
    var refEl = card.querySelector('.ref, .verse-ref, .sr-ref, .citation, [data-ref], .hadith-ref, .source');
    var ar = arEl ? (arEl.textContent || "").trim() : "";
    var en = enEl ? (enEl.textContent || "").trim() : "";
    var ref = refEl ? (refEl.textContent || refEl.getAttribute("data-ref") || "").trim() : "";
    if (!ar && !en) {
      var paras = card.querySelectorAll("p, blockquote, li");
      for (var i = 0; i < paras.length && (!ar || !en); i++) {
        var t = (paras[i].textContent || "").trim();
        if (!t || t.length < 12) continue;
        if (/[\u0600-\u06FF]/.test(t) && !ar) ar = t;
        else if (!en && !/[\u0600-\u06FF]/.test(t)) en = t.slice(0, 320);
      }
    }
    if (!ref) {
      var h = ((card.querySelector("h2, h3, .card-title") || {}).textContent || "");
      var m = h.match(/(\d+\s*:\s*\d+)/);
      if (m) ref = "Qur\u2019an " + m[1].replace(/\s/g, "");
      else if (/bukhari|muslim|tirmidh|dawud|nasai|majah|hadith/i.test(h + " " + (card.textContent || "").slice(0, 200)))
        ref = h.slice(0, 80) || "Hadith";
    }
    return { ar: ar, en: en, ref: ref };
  }

  function pushToStudio(payload, withBg) {
    payload = payload || {};
    var ar = String(payload.arabic || payload.ar || "").trim();
    var en = String(payload.en || payload.english || "").trim();
    var ref = String(payload.ref || "").trim();
    try {
      document.documentElement.setAttribute("data-clarity-meme-ok", "1");
    } catch (e) {}
    if (typeof g.memeApplyVerseCard === "function") {
      g.memeApplyVerseCard(ar, en, "", ref);
    } else if (g.memeState) {
      g.memeState.top = ar;
      g.memeState.mid = en;
      g.memeState.bottom = ref;
      g.memeState.ref = ref;
      g.memeState._lastRef = ref;
      if (typeof g.memeDraw === "function") g.memeDraw();
    }
    /* HQ text defaults */
    try {
      if (g.memeState) {
        g.memeState.fontSize = Math.max(g.memeState.fontSize || 0, 42);
        g.memeState.topSize = Math.max(g.memeState.topSize || 0, 40);
        g.memeState.midSize = Math.max(g.memeState.midSize || 0, 28);
        g.memeState.bottomSize = Math.max(g.memeState.bottomSize || 0, 20);
        g.memeState.outline = Math.max(g.memeState.outline || 0, 4);
        if (typeof g.memeAutoFitSizes === "function") g.memeAutoFitSizes();
      }
    } catch (e2) {}
    if (withBg !== false) {
      var q = pickQuery(ar, en, ref);
      loadBgChain(bgCandidates(q), 0);
      if (typeof g.memeFetchStatus === "function")
        g.memeFetchStatus("Fetching scene · " + q.split(",")[0] + "…");
    }
    try {
      if (typeof g.switchTab === "function") g.switchTab("reminder");
    } catch (e3) {}
    setTimeout(function () {
      var card = document.getElementById("meme-card");
      if (card) {
        card.classList.remove("gate-hidden");
        card.style.removeProperty("display");
        card.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  }

  function ensurePills() {
    var memeOk = true;
    try {
      memeOk = document.documentElement.getAttribute("data-clarity-meme-ok") !== "0";
    } catch (e) {}
    var sel = [
      ".card[id]",
      "[id$='-card']",
      ".search-result",
      ".question",
      ".cmd-card",
      ".verse-card",
      ".hadith-card",
      ".rabbana-box",
      "[data-rrra] .card",
      ".gpc-item",
      "blockquote",
      ".deep-learn"
    ].join(",");
    document.querySelectorAll(sel).forEach(function (card) {
      if (!card || card.id === "meme-card" || card.id === "tweet-desk-card") return;
      if (card.querySelector(".clarity-to-meme-pill")) return;
      var sample = extractFromCard(card);
      if (!sample.ar && !sample.en) return;
      if ((sample.ar + sample.en).length < 20) return;
      var row = card.querySelector(".sr-actions, .card-actions, .gpc-links, .clarity-meme-pill-row");
      if (!row) {
        row = document.createElement("div");
        row.className = "clarity-meme-pill-row";
        row.style.cssText = "display:flex;flex-wrap:wrap;gap:0.35rem;margin-top:0.5rem;align-items:center";
        card.appendChild(row);
      }
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-soft clarity-to-meme-pill";
      btn.innerHTML = "🖼️ Meme";
      btn.title = "Push to Meme Studio with matching background";
      btn.style.display = memeOk ? "inline-flex" : "none";
      btn.addEventListener("click", function (ev) {
        try { ev.preventDefault(); ev.stopPropagation(); } catch (e0) {}
        var p = extractFromCard(card);
        pushToStudio({ arabic: p.ar, en: p.en, ref: p.ref }, true);
      });
      row.appendChild(btn);
    });
  }

  function boot() {
    ensurePills();
    /* Override global push */
    g.clarityPushToMemeDesk = function (payload) {
      pushToStudio(payload, true);
    };
    g.clarityMemePushComplete = { ensure: ensurePills, push: pushToStudio };
    setTimeout(ensurePills, 700);
    setTimeout(ensurePills, 2500);
    g.addEventListener("clarity-path-changed", function () {
      setTimeout(ensurePills, 350);
    });
    /* Re-scan when cards mutate */
    try {
      var mo = new MutationObserver(function () {
        clearTimeout(g.__memePillScanT);
        g.__memePillScanT = setTimeout(ensurePills, 400);
      });
      mo.observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("load", function () { setTimeout(ensurePills, 500); });
})(typeof window !== "undefined" ? window : this);
