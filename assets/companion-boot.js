/*!
 * companion-boot.js
 * T-BOOT-01 · Phase 0–6 Governance Contract
 * Bismillah.
 * Enrichment: held
 * Merge order locked — do not reorder.
 * Contains: Shariah guard → error guard → micro-boot → nuros → shell → banner A/V → madinah → banner repair → moon → surah → room-nav
 * No vault scripts. No feature/meme scripts.
 * Educational only — not a fatwa.
 */

/* === 1. inline-clarity_shariah_source_guard_v1.js === */
/**
 * Clarity Shariah Source Guard v1 — educational authenticity layer
 * - Allowlists Qur'an / timed / graded hadith hosts
 * - Blocks anonymous random hadith & ungraded dua APIs
 * - Does not issue fatwas; forces educational labels on soft sources
 * Educational only — not a fatwa. Verify with a local scholar.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_SHARIAH_SOURCE_GUARD_V1__) return;
  w.__CLARITY_SHARIAH_SOURCE_GUARD_V1__ = "20261025";

  var ALLOW_HOSTS = [
    "api.alquran.cloud",
    "api.quran.com",
    "cdn.qurancdn.com",
    "everyayah.com",
    "api.aladhan.com",
    "cdn.jsdelivr.net", // only for fawazahmed0/hadith-api editions (checked below)
    "fonts.googleapis.com",
    "fonts.gstatic.com",
    "upload.wikimedia.org",
    "www.youtube.com",
    "www.youtube-nocookie.com",
    "open.spotify.com",
    "ipapi.co",
    "ipwho.is",
    "api.open-meteo.com"
  ];

  /** Hosts never used for deen text (random / ungraded) */
  var BLOCK_HOSTS = [
    "ummahapi.com",
    "dua-data-api.vercel.app",
    "api.countapi.xyz",
    "countapi.mileshilliard.com"
  ];

  /** Path must match for jsDelivr hadith */
  var HADITH_PATH_OK = /\/gh\/fawazahmed0\/hadith-api@[^/]+\/editions\/(eng|ara)-(bukhari|muslim|abudawud|nasai|ibnmajah|tirmidhi)\b/i;

  var GRADE_SOFT = /daif|da'if|weak|mawdu|fabricat|no\s*grade|ungraded/i;
  var GRADE_OK = /sahih|hasan|muttafaq|authentic/i;

  function hostOf(url) {
    try { return new URL(url, w.location && w.location.href).hostname.toLowerCase(); }
    catch (e) { return ""; }
  }

  function isBlocked(url) {
    var h = hostOf(url);
    if (!h) return true;
    for (var i = 0; i < BLOCK_HOSTS.length; i++) {
      if (h === BLOCK_HOSTS[i] || h.endsWith("." + BLOCK_HOSTS[i])) return true;
    }
    return false;
  }

  function isAllowHost(url) {
    var h = hostOf(url);
    for (var i = 0; i < ALLOW_HOSTS.length; i++) {
      if (h === ALLOW_HOSTS[i] || h.endsWith("." + ALLOW_HOSTS[i])) return true;
    }
    return false;
  }

  function hadithPathOk(url) {
    try {
      var u = new URL(url, w.location && w.location.href);
      if (u.hostname.indexOf("jsdelivr") === -1) return true;
      return HADITH_PATH_OK.test(u.pathname);
    } catch (e) { return false; }
  }

  /**
   * Returns { ok, reason, educationalOnly }
   */
  w.clarityShariahCheckUrl = function (url) {
    url = String(url || "");
    if (!url || url.indexOf("data:") === 0 || url.indexOf("blob:") === 0) {
      return { ok: true, reason: "local", educationalOnly: true };
    }
    if (isBlocked(url)) {
      return { ok: false, reason: "blocked-host-ungraded-or-metrics", educationalOnly: true };
    }
    if (!isAllowHost(url)) {
      return { ok: false, reason: "host-not-allowlisted", educationalOnly: true };
    }
    if (!hadithPathOk(url)) {
      return { ok: false, reason: "hadith-edition-not-in-kutub-sittah-path", educationalOnly: true };
    }
    return { ok: true, reason: "allow", educationalOnly: true };
  };

  /** Soft grade check on JSON/text payloads */
  w.clarityShariahScanPayload = function (text) {
    text = String(text || "");
    if (GRADE_SOFT.test(text) && !GRADE_OK.test(text)) {
      return { soft: true, label: "Contains weak/ungraded wording — educational only; verify isnād with a scholar." };
    }
    return { soft: false, label: "" };
  };

  /** Wrap fetch: block bad hosts; tag responses */
  var _fetch = w.fetch;
  if (typeof _fetch === "function" && !_fetch.__clarityShariah) {
    w.fetch = function (input, init) {
      var url = typeof input === "string" ? input : (input && input.url) || "";
      var chk = w.clarityShariahCheckUrl(url);
      if (!chk.ok) {
        try {
          console.info("[Clarity Shariah Guard] blocked fetch:", url, chk.reason);
        } catch (e) {}
        return Promise.reject(new Error("Shariah source guard: " + chk.reason));
      }
      return _fetch.apply(this, arguments).then(function (res) {
        try {
          res.headers && res.headers.get; // keep Response as-is
        } catch (e) {}
        return res;
      });
    };
    w.fetch.__clarityShariah = true;
  }

  /** Public allowlist for other modules */
  w.CLARITY_SHARIAH_ALLOW_HOSTS = ALLOW_HOSTS.slice();
  w.CLARITY_SHARIAH_BLOCK_HOSTS = BLOCK_HOSTS.slice();

  /** Stamp educational footer once */
  function stamp() {
    if (document.getElementById("clarity-shariah-stamp")) return;
    var d = document.createElement("div");
    d.id = "clarity-shariah-stamp";
    d.setAttribute("role", "note");
    d.style.cssText = "font-size:0.72rem;opacity:0.75;text-align:center;padding:0.35rem 0.75rem;max-width:52rem;margin:0.5rem auto;";
    d.textContent = "Educational companion — Qur’ān & reported Sunnah sources only where gated. Not a fatwa. Verify with a local scholar.";
    var host = document.getElementById("main-content") || document.body;
    if (host) host.appendChild(d);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(stamp, 400); });
  else setTimeout(stamp, 400);
})(typeof window !== "undefined" ? window : this);

/* === 2. inline-clarity_error_guard_v2.js === */
(function(){
  "use strict";
  if (window.__CLARITY_ERROR_GUARD_V2__) return;
  window.__CLARITY_ERROR_GUARD_V2__ = true;

  function ensureCalligState(){
    if (!window.calligState || typeof window.calligState !== "object") {
      window.calligState = {
        drawing:false, ink:"#0d4f3c", size:14, guide:true, script:"naskh", glyph:"ا",
        strokes:[], cur:null, lastPts:[], audioOn:true, scale:100, offsetX:0, offsetY:0,
        stylusSim:true, autoEnhance:true, stylusFeel:70, lastVel:0, pointerType:"touch", tip:"finger"
      };
    }
    var s = window.calligState;
    if (!Array.isArray(s.strokes)) s.strokes = [];
    if (!Array.isArray(s.lastPts)) s.lastPts = [];
    if (s.cur && !Array.isArray(s.cur)) {
      if (s.cur.pts && Array.isArray(s.cur.pts)) s.cur = s.cur.pts;
      else s.cur = null;
    }
    return s;
  }
  ensureCalligState();

  /* Patch common callig APIs to self-heal */
  ["calligPointerDown","calligPointerMove","calligPointerUp","calligRedraw","calligClear"].forEach(function(name){
    try {
      var fn = window[name];
      if (typeof fn !== "function" || fn.__guarded) return;
      window[name] = function(){
        ensureCalligState();
        try { return fn.apply(this, arguments); }
        catch(err){ console.warn("[Clarity]", name, err && err.message); }
      };
      window[name].__guarded = true;
    } catch(e){}
  });

  /* Soften uncaught push on undefined in late listeners */
  window.addEventListener("error", function(ev){
    try {
      var msg = (ev && ev.message) || "";
      if (/reading ['\"]push['\"]/.test(msg) || /Cannot read properties of undefined \(reading 'push'\)/.test(msg)) {
        ensureCalligState();
        if (window.calligState && window.calligState.cur && !Array.isArray(window.calligState.cur.pts)) {
          window.calligState.cur.pts = [];
        }
        /* prevent red overlay spam for this known class */
        ev.preventDefault && ev.preventDefault();
      }
    } catch(e){}
  }, true);

  /* notesState */
  if (!window.notesState || typeof window.notesState !== "object") {
    window.notesState = { notes: [], selectedId: null, query: "", tagFilter: "", viewMode: "edit", saveTimer: null };
  }
  if (!Array.isArray(window.notesState.notes)) window.notesState.notes = [];

  /* memeState */
  if (!window.memeState) window.memeState = { img:null, text:"", bg:null };
  if (!window.VERSE_POOL) window.VERSE_POOL = [];
  if (!Array.isArray(window.VERSE_POOL)) window.VERSE_POOL = [];

  function boot(){ ensureCalligState(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", boot);
})();

/* === 3. inline-clarity-micro-boot-v1.js === */
/**
 * Companion micro-boot bundle · v1
 * Merged early guards/boot only. Order preserved.
 */


;/* ---- inline-clarity-shell-mode-early.js ---- */
(function(){
  try {
    var m = localStorage.getItem("clarity_shell_mode_v1");
    if (m !== "landing" && m !== "companion") m = "landing";
    /* Mobile first paint: Day landing is default (companion only after explicit path) */
    try {
      var mobile = window.matchMedia && window.matchMedia("(max-width: 900px)").matches;
      var forceLand = sessionStorage.getItem("clarity_force_landing_once") === "1";
      var userPicked = sessionStorage.getItem("clarity_shell_user_pick_v1") === "1";
      if (mobile && !userPicked) m = "landing";
      if (forceLand) m = "landing";
    } catch (e2) {}
    document.documentElement.setAttribute("data-shell-mode", m);
    try { if (m === "landing") localStorage.setItem("clarity_shell_mode_v1", "landing"); } catch (e3) {}
  } catch (e) { document.documentElement.setAttribute("data-shell-mode", "landing"); }
})();


;/* ---- inline-clarity-path-boot-v1.js ---- */
(function(){try{var g=localStorage.getItem("clarity_committed_path")||localStorage.getItem("clarity_path_override")||"seeker";document.documentElement.setAttribute("data-clarity-path",g);}catch(e){}})();


;/* ---- inline-clarity_loader_guard_v1.js ---- */
(function(){
  "use strict";
  if (window.__CLARITY_LOADER_GUARD_V1__) return;
  window.__CLARITY_LOADER_GUARD_V1__ = true;

  /* Prevent double path-progress init if both defer + lazy fire */
  var _pp = window.clarityPathProgress;
  Object.defineProperty(window, "__clarityPathProgressOnce", {
    value: true,
    writable: false
  });

  /* After core ready, re-assert theme from user chips (stub may have run first) */
  document.addEventListener("clarity-core-ready", function(){
    try {
      var mode = localStorage.getItem("clarity_theme_mode") || localStorage.getItem("clarity_theme") || "system";
      if (typeof window.claritySetThemeMode === "function") window.claritySetThemeMode(mode);
    } catch(e){}
    try {
      if (typeof window.loadCommand === "function") window.loadCommand();
    } catch(e){}
  });

  /* Soft report failed lazy assets once */
  window.addEventListener("load", function(){
    setTimeout(function(){
      try {
        var f = typeof window.ClarityLoaderFailed === "function" ? window.ClarityLoaderFailed() : [];
        if (f && f.length) console.info("[Clarity] lazy failures:", f.join(", "));
      } catch(e){}
    }, 8000);
  });
})();


;/* ---- inline-clarity-scroll-unlock-v3.js ---- */
(function(){
  function unlock(){
    try {
      document.documentElement.style.setProperty("overflow-y", "auto", "important");
      document.documentElement.style.setProperty("height", "auto", "important");
      document.body.style.setProperty("overflow-y", "auto", "important");
      document.body.style.setProperty("height", "auto", "important");
      document.body.style.setProperty("position", "static", "important");
      document.documentElement.style.touchAction = "pan-x pan-y pinch-zoom";
      document.body.style.touchAction = "pan-x pan-y pinch-zoom";
    } catch (e) {}
  }
  unlock();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", unlock);
  window.addEventListener("load", unlock);
  /* PSI: no perpetual interval — unlock on show only */
  document.addEventListener("visibilitychange", function(){ if (!document.hidden) unlock(); });
})();


;/* ---- inline-clarity_mobile_unstick.js ---- */
(function(){
  "use strict";
  if (window.__CLARITY_MOBILE_UNSTICK__) return;
  window.__CLARITY_MOBILE_UNSTICK__ = true;
  function unstick(){
    if (window.matchMedia && !window.matchMedia("(max-width: 900px)").matches) return;
    document.querySelectorAll(".banner, #clarity-top-duo, .global-nav, nav.global-nav").forEach(function(el){
      try {
        el.style.setProperty("position", "relative", "important");
        el.style.setProperty("top", "auto", "important");
      } catch(e){}
    });
    try {
      document.documentElement.style.setProperty("overflow-y", "auto", "important");
      document.body.style.setProperty("overflow-y", "auto", "important");
      document.body.style.setProperty("height", "auto", "important");
      document.body.style.setProperty("position", "static", "important");
    } catch(e){}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", unstick);
  else unstick();
  window.addEventListener("load", unstick);
  window.addEventListener("resize", unstick);
})();


;/* ---- inline-clarity-polish-security-v1.js ---- */
(function(){
"use strict";
if (window.__CLARITY_POLISH_SECURITY_V1__) return;
window.__CLARITY_POLISH_SECURITY_V1__ = true;
window.claritySecurityAudit = function(){
  var r = {ok:true,ts:Date.now(),vault:{uftKey:window.UFT_KEY||"clarity_user_family_tree_v1",
    tree:!!document.getElementById("user-family-tree-card"),
    uftRead:typeof window.uftRead==="function"},
    path:{reset:typeof window.clarityPathResetToSeeker==="function",
      request:typeof window.clarityRequestPath==="function"},
    zoom:typeof window.clarityUftZoom==="object",
    storage:{suspicious:[]},notes:[]};
  try{
    if(r.vault.uftKey!=="clarity_user_family_tree_v1"){r.ok=false;r.notes.push("UFT_KEY");}
    for(var i=0;i<localStorage.length;i++){
      var k=localStorage.key(i)||"";
      if(/passphrase|plaintext.?key|(^|_)password$/i.test(k)){r.storage.suspicious.push(k);r.ok=false;}
    }
  }catch(e){}
  window.__CLARITY_SECURITY_REPORT__=r;
  return r;
};
setTimeout(function(){try{claritySecurityAudit();}catch(e){}},1000);
})();


;/* ---- inline-clarity_final_boot_v1.js ---- */
(function(){
  "use strict";
  if (window.__CLARITY_FINAL_BOOT_V1__) return;
  window.__CLARITY_FINAL_BOOT_V1__ = true;
  function safe(fn){ try { if (typeof fn === "function") fn(); } catch(e){} }
  function boot(){
    safe(window.__notesLoadReal || window.notesLoad);
    safe(window.uftLoad);
    safe(window.claritySecurityAudit);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 500); });
  else setTimeout(boot, 500);
  window.addEventListener("load", function(){ setTimeout(boot, 1000); });
})();

/* === 4. inline-bundle-nuros-v1.js === */
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
  window.addEventListener("load", function(){ setTimeout(boot, 2000); });

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
      setTimeout(activateActiveTab, 2000);
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
  window.addEventListener("load", function(){ setTimeout(boot, 2000); });
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
      }, 2000);
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
      }, 2000);
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

/* === 5. inline-clarity-shell-v3.js === */
/**
 * Clarity Shell v3.1 — single mode plaque under banner
 * One bar only: Companion ↔ Day landing. No double task bars.
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_SHELL_V3__) return;
  w.__CLARITY_SHELL_V3__ = true;

  var KEY = "clarity_shell_mode_v1";

  function mode() {
    try {
      var m = localStorage.getItem(KEY);
      if (m === "landing" || m === "companion") return m;
    } catch (e) {}
    return "landing";
  }

  function setMode(m) {
    if (m !== "landing" && m !== "companion") return;
    try { localStorage.setItem(KEY, m); } catch (e) {}
    try { sessionStorage.setItem("clarity_shell_user_pick_v1", "1"); } catch (e2) {}
    apply();
    try { document.dispatchEvent(new CustomEvent("clarity-shell-mode", { detail: { mode: m } })); } catch (e3) {}
    if (m === "companion") { try { if (typeof w.ClarityLoadCompanion === "function") w.ClarityLoadCompanion(); } catch (e4) {} }
  }

  function injectCss() {
    if (document.getElementById("clarity-shell-plaque-css")) return;
    var s = document.createElement("style");
    s.id = "clarity-shell-plaque-css";
    s.textContent = [
      "#clarity-reopen-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:0.4rem;",
      "  width:100%;max-width:100%;box-sizing:border-box;margin:0.35rem 0 0.5rem;padding:0.4rem 0.65rem;",
      "  border-radius:14px;border:1px solid rgba(15,76,58,0.22);",
      "  background:linear-gradient(135deg,rgba(15,76,58,0.14),rgba(15,76,58,0.05));}",
      "html[data-theme=dark] #clarity-reopen-bar,html[data-theme=night] #clarity-reopen-bar{",
      "  background:linear-gradient(135deg,rgba(212,180,90,0.1),rgba(12,28,22,0.7));border-color:rgba(212,180,90,0.22);}",
      "#clarity-reopen-bar .crb-ico{font-size:1.05rem;line-height:1;}",
      "#clarity-reopen-bar .crb-label{font-weight:800;font-size:0.78rem;letter-spacing:0.04em;text-transform:uppercase;opacity:0.85;}",
      "#clarity-reopen-bar .crb-btn{border:none;border-radius:999px;padding:0.32rem 0.75rem;font-weight:700;cursor:pointer;font-size:0.8rem;}",
      "#clarity-reopen-bar .crb-btn.crb-open{background:linear-gradient(135deg,#c9a227,#e0b93a);color:#1a1408;}",
      "#clarity-reopen-bar .crb-btn.crb-hide{background:linear-gradient(135deg,#0f4c3a,#1a6b52);color:#f7f3eb;}",
      "#clarity-reopen-bar .crb-btn.crb-comp{background:transparent;border:1px solid rgba(15,76,58,0.35);color:inherit;}",
      "html[data-theme=dark] #clarity-reopen-bar .crb-btn.crb-comp{border-color:rgba(212,180,90,0.35);}",
      "#clarity-reopen-bar .crb-hint{font-size:0.72rem;opacity:0.7;}",
      "#clarity-reopen-bar .crb-pill{font-size:0.72rem;font-weight:700;padding:0.18rem 0.5rem;border-radius:999px;",
      "  background:rgba(15,76,58,0.15);}",
      "html[data-theme=dark] #clarity-reopen-bar .crb-pill{background:rgba(212,180,90,0.12);}",
      "/* Hide duplicate bars */",
      "#clarity-visit-pill-bar,.clarity-visit-strip,#clarity-visit-strip,",
      ".visit-strip[data-day-landing],.day-landing-footer-bar{",
      "  display:none!important;}",
      ".shell-landing-hide{display:none!important;}",
      "/* Restore first-landing overview when marked */",
      "html[data-shell-mode=landing] #clarity-welcome,",
      "html[data-shell-mode=landing] #clarity-three-doors,",
      "html[data-shell-mode=landing] [data-landing-overview]{display:block!important;}"
    ].join("\n");
    (document.head || document.documentElement).appendChild(s);
  }

  function ensureRibbon() {
    var bar = document.getElementById("clarity-reopen-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "clarity-reopen-bar";
      bar.setAttribute("role", "toolbar");
      bar.setAttribute("aria-label", "Day landing and companion");
    }
    bar.setAttribute("data-landing", "pill");
    bar.innerHTML =
      '<span class="crb-ico" aria-hidden="true">🏠</span>' +
      '<span class="crb-pill" id="crb-mode-pill">Day landing</span>' +
      '<button type="button" class="crb-btn crb-open" data-crb="open">Open daily routines</button>' +
      '<button type="button" class="crb-btn crb-hide" data-crb="hide">Hide for now</button>' +
      '<button type="button" class="crb-btn crb-comp" data-crb="companion">Companion path</button>' +
      '<span class="crb-hint">One plaque · return anytime on this device</span>';

    // Place once: directly under banner (clarity-top-duo)
    var duo = document.getElementById("clarity-top-duo");
    var host = (duo && duo.parentNode) || document.body;
    if (bar.parentNode !== host || (duo && bar.previousSibling !== duo && bar.previousElementSibling !== duo)) {
      if (bar.parentNode) bar.parentNode.removeChild(bar);
      if (duo && duo.nextSibling) host.insertBefore(bar, duo.nextSibling);
      else if (duo) host.appendChild(bar);
      else host.insertBefore(bar, host.firstChild);
    }

    if (!bar._bound) {
      bar._bound = true;
      bar.addEventListener("click", function (ev) {
        var t = ev.target && ev.target.closest && ev.target.closest("[data-crb]");
        if (!t) return;
        var a = t.getAttribute("data-crb");
        if (a === "open") setMode("landing");
        else if (a === "hide" || a === "companion") setMode("companion");
      });
    }
    return bar;
  }

  function hideDuplicateBars() {
    try {
      ["clarity-visit-pill-bar", "clarity-visit-strip"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.style.setProperty("display", "none", "important");
      });
      document.querySelectorAll(".visit-strip, .clarity-visit-strip, .day-landing-footer-bar").forEach(function (el) {
        if (el.id === "clarity-reopen-bar") return;
        el.style.setProperty("display", "none", "important");
      });
      // Remove any second #clarity-reopen-bar
      var bars = document.querySelectorAll("#clarity-reopen-bar");
      for (var i = 1; i < bars.length; i++) bars[i].remove();
    } catch (e) {}
  }

  function applyDoorRail(m) {
    try {
      var door = document.getElementById("clarity-door-rail") || document.querySelector(".door-rail");
      if (!door) return;
      if (m === "landing") door.style.setProperty("display", "none", "important");
      else door.style.removeProperty("display");
    } catch (e) {}
  }

  function apply() {
    injectCss();
    var m = mode();
    document.documentElement.setAttribute("data-shell-mode", m);
    try { document.body.setAttribute("data-shell-mode", m); } catch (e) {}
    var bar = ensureRibbon();
    hideDuplicateBars();

    var openBtn = bar.querySelector('[data-crb="open"]');
    var hideBtn = bar.querySelector('[data-crb="hide"]');
    var compBtn = bar.querySelector('[data-crb="companion"]');
    var pill = document.getElementById("crb-mode-pill");
    var land = document.getElementById("clarity-day-landing");

    if (m === "landing") {
      if (land) { land.hidden = false; land.style.removeProperty("display"); }
      if (openBtn) openBtn.style.display = "none";
      if (hideBtn) hideBtn.style.display = "";
      if (compBtn) compBtn.style.display = "";
      if (pill) pill.textContent = "Day landing";
      /* Day landing only through oath + study cards. Companion hubs via path tiles. */
      document.querySelectorAll("#main-content .tab-panel, #main-content .rrra-hub, #main-content .rrra-hub-hero").forEach(function (el) {
        el.classList.add("shell-landing-hide");
      });
    } else {
      if (land) { land.hidden = true; land.style.display = "none"; }
      if (openBtn) openBtn.style.display = "";
      if (hideBtn) hideBtn.style.display = "none";
      if (compBtn) compBtn.style.display = "none";
      if (pill) pill.textContent = "Companion";
      document.querySelectorAll(".shell-landing-hide").forEach(function (el) {
        el.classList.remove("shell-landing-hide");
      });
      /* Reveal companion surface immediately — do not wait for refresh */
      try {
        var mainNow = document.getElementById("main-content") || document.querySelector(".main-content");
        if (mainNow) {
          mainNow.style.setProperty("display", "block", "important");
          mainNow.style.setProperty("visibility", "visible", "important");
          mainNow.removeAttribute("aria-hidden");
          mainNow.hidden = false;
        }
        document.querySelectorAll("#main-content .tab-panel, #main-content .rrra-hub").forEach(function (el) {
          el.classList.remove("shell-landing-hide");
        });
        var tabId = "reminder";
        try {
          var h = (w.location.hash || "").replace(/^#/, "").toLowerCase();
          if (/^(reminder|reality|reflection|action|notes)$/.test(h)) tabId = h;
          else {
            var s = w.sessionStorage && w.sessionStorage.getItem("clarity_active_section_v1");
            if (s && /^(reminder|reality|reflection|action|notes)$/.test(s)) tabId = s;
          }
        } catch (eTab) {}
        document.querySelectorAll(".tab-panel").forEach(function (p) {
          var on = p.id === ("tab-" + tabId);
          p.classList.toggle("active", on);
          if (on) {
            p.hidden = false;
            p.style.setProperty("display", "block", "important");
            p.style.setProperty("visibility", "visible", "important");
            p.style.setProperty("opacity", "1", "important");
            p.setAttribute("aria-hidden", "false");
            p.querySelectorAll(".card, [id$='-card'], .rrra-hub-hero, .rrra-hub-summary").forEach(function (c) {
              c.classList.remove("gate-hidden", "shell-landing-hide");
              c.hidden = false;
              c.style.removeProperty("display");
              c.style.removeProperty("visibility");
              c.style.removeProperty("height");
              c.style.removeProperty("max-height");
              c.style.removeProperty("opacity");
            });
          }
        });
        if (typeof w.clarityOpenSectionDoor === "function") {
          try { w.clarityOpenSectionDoor(tabId); } catch (eOpen) {}
        }
      } catch (eComp) {}
    }
    applyDoorRail(m);

    var main = document.getElementById("main-content") || document.querySelector(".main-content");
    if (main) {
      if (m === "landing") {
        main.style.setProperty("display", "none", "important");
        main.setAttribute("aria-hidden", "true");
      } else {
        main.style.setProperty("display", "block", "important");
        main.style.setProperty("visibility", "visible", "important");
        main.removeAttribute("aria-hidden");
        main.hidden = false;
      }
    }

    if (m === "companion" && typeof w.ClarityLoadCompanion === "function") {
      try { w.ClarityLoadCompanion(); } catch (e) {}
    }
  }

  /* Mobile: ensure Day landing is first surface */
  try {
    if (window.matchMedia && window.matchMedia("(max-width: 900px)").matches) {
      if (sessionStorage.getItem("clarity_shell_user_pick_v1") !== "1") {
        try { localStorage.setItem(KEY, "landing"); } catch (e) {}
      }
    }
  } catch (e) {}

  w.ClarityShell = { mode: mode, setMode: setMode, apply: apply };

  function boot() { apply(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 40); });
  else setTimeout(boot, 40);
  w.addEventListener("load", function () { setTimeout(apply, 200); });
  document.addEventListener("clarity-core-ready", function () { setTimeout(apply, 120); });
})(typeof window !== "undefined" ? window : this);

/* === 6. clarity-banner-av-v1.js === */
/*! clarity-banner-av-v1 · Haramain live + radio · educational streams may change */
(function (w) {
  "use strict";
  if (w.__CLARITY_BANNER_AV_V1__) return;
  w.__CLARITY_BANNER_AV_V1__ = true;

  /* Public educational embeds — not affiliated; fall back to still if blocked */
  var PLACES = {
    madinah: {
      label: "Madinah",
      embed: "https://www.youtube.com/embed/5RJkL7vLHLs?autoplay=1&mute=1&playsinline=1&rel=0"
    },
    makkah: {
      label: "Makkah",
      embed: "https://www.youtube.com/embed/NJooZDDcV1E?autoplay=1&mute=1&playsinline=1&rel=0"
    }
  };

  function $(id) { return document.getElementById(id); }

  function placeKey() {
    var sel = $("live-place-select");
    var v = (sel && sel.value) || "madinah";
    v = String(v).toLowerCase();
    if (v.indexOf("makk") >= 0 || v.indexOf("mecca") >= 0) return "makkah";
    return "madinah";
  }

  function setLiveActive(on) {
    var btn = $("live-haramain-btn");
    var label = $("live-haramain-label");
    var ifr = $("banner-live");
    var img = $("banner-img");
    var key = placeKey();
    var conf = PLACES[key] || PLACES.madinah;

    if (on) {
      if (ifr) {
        ifr.hidden = false;
        ifr.removeAttribute("hidden");
        ifr.style.display = "";
        try {
          ifr.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
          ifr.setAttribute("src", conf.embed);
        } catch (e) {}
      }
      if (img) {
        img.style.opacity = "0";
        img.setAttribute("aria-hidden", "true");
      }
      if (btn) btn.classList.add("active", "is-live");
      if (label) label.textContent = "Live · " + conf.label;
      try { localStorage.setItem("clarity_haramain_live", "1"); } catch (e2) {}
    } else {
      if (ifr) {
        try { ifr.removeAttribute("src"); } catch (e3) {}
        ifr.hidden = true;
        ifr.setAttribute("hidden", "");
        ifr.style.display = "none";
      }
      if (img) {
        img.style.opacity = "";
        img.removeAttribute("aria-hidden");
        if (!img.getAttribute("src")) {
          img.setAttribute("src", "/companion/assets/banner-still-haramain.jpg");
        }
      }
      if (btn) btn.classList.remove("active", "is-live");
      if (label) label.textContent = "Live";
      try { localStorage.setItem("clarity_haramain_live", "0"); } catch (e4) {}
    }
  }

  function isLiveOn() {
    var ifr = $("banner-live");
    if (!ifr) return false;
    if (ifr.hidden) return false;
    var src = ifr.getAttribute("src") || "";
    return !!src;
  }

  w.toggleHaramainLive = function () {
    try {
      setLiveActive(!isLiveOn());
    } catch (e) {
      try { console.warn("[Clarity] toggleHaramainLive", e); } catch (e2) {}
    }
  };

  w.changeHaramainPlace = function () {
    try {
      var key = placeKey();
      try { localStorage.setItem("clarity_haramain_place", key); } catch (e) {}
      if (isLiveOn()) {
        setLiveActive(true); /* reload embed for new place */
      } else {
        var label = $("live-haramain-label");
        var conf = PLACES[key] || PLACES.madinah;
        if (label && label.textContent && /live/i.test(label.textContent)) {
          /* keep Off label */
        }
      }
    } catch (e2) {
      try { console.warn("[Clarity] changeHaramainPlace", e2); } catch (e3) {}
    }
  };

  w.changeStream = function () {
    try {
      var sel = $("stream-select");
      var audio = $("quran-audio") || $("quran-audio-dup1");
      if (!sel || !audio) return;
      var url = sel.value || "";
      if (!url) return;
      try {
        audio.pause();
      } catch (e) {}
      audio.src = url;
      audio.load();
      var play = audio.play();
      if (play && typeof play.catch === "function") {
        play.catch(function () { /* autoplay policy — user can press Listen */ });
      }
      try { localStorage.setItem("clarity_quran_radio", url); } catch (e2) {}
    } catch (e3) {
      try { console.warn("[Clarity] changeStream", e3); } catch (e4) {}
    }
  };

  function restore() {
    try {
      var sel = $("live-place-select");
      var saved = localStorage.getItem("clarity_haramain_place");
      if (sel && saved) {
        for (var i = 0; i < sel.options.length; i++) {
          if (String(sel.options[i].value).toLowerCase().indexOf(saved.slice(0, 4)) >= 0) {
            sel.selectedIndex = i;
            break;
          }
        }
      }
      var radio = localStorage.getItem("clarity_quran_radio");
      var stream = $("stream-select");
      if (stream && radio) {
        for (var j = 0; j < stream.options.length; j++) {
          if (stream.options[j].value === radio) {
            stream.selectedIndex = j;
            break;
          }
        }
      }
      /* do not auto-start live video (data/privacy) — only restore place */
    } catch (e) {}
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", restore);
  else restore();

  /* Quran stream listen toggle */
  w.toggleQuranStream = function () {
    try {
      var audio = document.getElementById("quran-audio") || document.getElementById("quran-audio-dup1");
      if (!audio) {
        w.changeStream && w.changeStream();
        audio = document.getElementById("quran-audio") || document.getElementById("quran-audio-dup1");
      }
      if (!audio) return;
      if (audio.paused) {
        if (!audio.src || audio.src === location.href) {
          if (typeof w.changeStream === "function") w.changeStream();
        }
        var p = audio.play();
        if (p && typeof p.catch === "function") p.catch(function () {});
      } else {
        try { audio.pause(); } catch (e) {}
      }
    } catch (e2) {
      try { console.warn("[Clarity] toggleQuranStream", e2); } catch (e3) {}
    }
  };

  /* Aliases used by some archive onclicks */
  w.toggleLive = w.toggleHaramainLive;
  w.changeQuranStream = w.changeStream;

})(window);

/* === 7. inline-clarity_madinah_ap.js === */
(function(){
  "use strict";
  if (window.__CLARITY_MADINAH_AP__) return;
  window.__CLARITY_MADINAH_AP__ = true;

  function preferMadinah(){
    var sel = document.getElementById("stream-select") || document.querySelector("select[id*='stream']");
    if (sel) {
      var found = false;
      for (var i = 0; i < sel.options.length; i++) {
        var t = (sel.options[i].text || "") + " " + (sel.options[i].value || "");
        if (/madin/i.test(t)) {
          sel.selectedIndex = i;
          found = true;
          break;
        }
      }
      if (found) {
        try { sel.dispatchEvent(new Event("change", { bubbles: true })); } catch(e){}
      }
    }
    // Live button
    var liveBtn = document.getElementById("live-haramain-btn") || document.querySelector("[data-live], .live-btn, button.live");
    // iframe autoplay params
    document.querySelectorAll("#clarity-top-duo iframe, .banner-overlay iframe, #haramain-live iframe").forEach(function(f){
      try {
        var src = f.getAttribute("src") || "";
        if (src && src.indexOf("autoplay") < 0) {
          f.setAttribute("src", src + (src.indexOf("?") >= 0 ? "&" : "?") + "autoplay=1&mute=1");
        }
        f.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
      } catch(e){}
    });
  }

  function tryStart(){
    preferMadinah();
    // click live if present and not active
    var btns = document.querySelectorAll("#live-haramain-btn, button[onclick*='Live'], .av-pill-live");
    btns.forEach(function(b){
      if (b && !b.classList.contains("active") && !b.dataset.apDone) {
        // don't auto-click aggressively — only set default select
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(tryStart, 500); });
  else setTimeout(tryStart, 500);
  window.addEventListener("load", function(){ setTimeout(tryStart, 1200); });
})();

/* === 8. inline-clarity_banner_repair.js === */
(function(){
  "use strict";
  if (window.__CLARITY_BANNER_REPAIR_V2__) return;
  window.__CLARITY_BANNER_REPAIR_V2__ = true;
  window.__CLARITY_BANNER_REPAIR__ = true;

  function $(id){ return document.getElementById(id); }

  function hijriParts(d){
    try {
      var day = new Intl.DateTimeFormat("en-TN-u-ca-islamic", { day: "numeric" }).format(d);
      var month = new Intl.DateTimeFormat("en-TN-u-ca-islamic", { month: "long" }).format(d);
      var year = new Intl.DateTimeFormat("en-TN-u-ca-islamic", { year: "numeric" }).format(d);
      return { day: day, month: month, year: year,
        full: new Intl.DateTimeFormat("en-TN-u-ca-islamic", { day:"numeric", month:"long", year:"numeric" }).format(d) };
    } catch (e) {
      return { day: String(d.getDate()), month: "", year: "", full: d.toDateString() };
    }
  }

  function repairCalendar(){
    var now = new Date();
    var h = hijriParts(now);
    var grid = $("hijri-cal-grid");
    if (grid && (!grid.textContent || /…|\.\.\.|loading/i.test(grid.textContent) || grid.children.length === 0)) {
      grid.innerHTML = '<div class="hcg-day" style="font-size:1.6rem;font-weight:800;line-height:1.1">'+h.day+'</div>' +
        '<div class="hcg-month" style="font-size:0.78rem;opacity:0.9">'+h.month+'</div>';
    }
    var meta = $("hijri-cal-meta");
    if (meta && (!meta.textContent || /…|loading/i.test(meta.textContent))) {
      meta.textContent = h.full + " · " + now.toLocaleDateString(undefined, { weekday:"short", day:"numeric", month:"short" });
    }
    var title = $("hijri-cal-title");
    if (title && /…|loading/i.test(title.textContent || "")) title.textContent = "Hijri · تقويم";
    /* local clock */
    var lt = $("hijri-local-time");
    if (lt) {
      try {
        lt.textContent = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
      } catch (e2) {
        lt.textContent = now.getHours() + ":" + String(now.getMinutes()).padStart(2, "0");
      }
    }
  }

  function fillSalahList(timings, cityLabel){
    var list = $("salah-times-list");
    if (!list) return;
    var order = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    var html = "";
    order.forEach(function(name){
      var t = timings[name] ? String(timings[name]).slice(0, 5) : "—";
      html += '<li><span class="salah-name">'+name+'</span><span class="salah-time">'+t+'</span></li>';
    });
    list.innerHTML = html;
    var loc = $("hijri-local-loc");
    if (loc && cityLabel) loc.textContent = cityLabel;
    var st = $("salah-title");
    if (st) st.textContent = "Ṣalāh";
  }

  async function repairSalah(){
    var list = $("salah-times-list");
    if (!list) return;
    /* already real times? */
    if (list.querySelectorAll("li").length >= 5) {
      var sample = list.textContent || "";
      if (!/loading|…/i.test(sample) && /\d/.test(sample)) return;
    }
    var city = "Makkah";
    var country = "SA";
    try {
      var saved = localStorage.getItem("clarity_salah_city");
      if (saved) city = saved;
      var ctry = localStorage.getItem("clarity_salah_country");
      if (ctry) country = ctry;
    } catch (e) {}
    try {
      var url = "https://api.aladhan.com/v1/timingsByCity?city=" + encodeURIComponent(city) +
                "&country=" + encodeURIComponent(country) + "&method=4";
      var res = await fetch(url, { credentials: "omit" });
      if (!res.ok) throw new Error("http");
      var json = await res.json();
      var t = (json.data && json.data.timings) || {};
      fillSalahList(t, city + (country ? ", " + country : ""));
    } catch (e2) {
      /* offline placeholders — still structured */
      fillSalahList({ Fajr: "—", Dhuhr: "—", Asr: "—", Maghrib: "—", Isha: "—" }, "Times offline");
    }
  }

  function repairLiveFallback(){
    var ifr = $("banner-live");
    var img = $("banner-img");
    if (img && !img.getAttribute("src")) {
      img.setAttribute("src", "/companion/assets/banner-still-haramain.jpg");
    }
    if (ifr && img) {
      /* if live never starts, keep still visible */
      try {
        if (ifr.hasAttribute("hidden") || !ifr.src) {
          img.hidden = false;
          img.style.display = "";
        }
      } catch (e) {}
    }
  }

  function boot(){
    repairCalendar();
    repairSalah();
    repairLiveFallback();
    setTimeout(repairCalendar, 600);
    setTimeout(repairSalah, 900);
    setTimeout(repairLiveFallback, 1200);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", function(){ setTimeout(boot, 400); });
  /* light clock tick — pause when hidden */
  setInterval(function(){
    if (document.hidden) return;
    var lt = $("hijri-local-time");
    if (!lt) return;
    var now = new Date();
    try {
      lt.textContent = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    } catch (e) {}
  }, 30000);
})();

/* === 9. inline-clarity_banner_moon_v1.js === */
/**
 * Banner moon phase (calendar) + Allah plaque (salah) · no masjid clutter
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_BANNER_MOON_V2__) return;
  w.__CLARITY_BANNER_MOON_V2__ = true;

  var CSS = [
    "#clarity-top-duo .banner-overlay{display:flex!important;align-items:stretch!important;justify-content:space-between!important;",
    "  gap:0.35rem!important;width:100%!important;box-sizing:border-box!important;padding:0.3rem 0.35rem!important;}",
    "#clarity-top-duo .banner-side{flex:0 0 clamp(6.2rem,20vw,10rem)!important;width:clamp(6.2rem,20vw,10rem)!important;",
    "  max-width:22%!important;min-width:5.8rem!important;}",
    "#clarity-top-duo .banner-center{flex:1 1 auto!important;min-width:0!important;}",
    "#clarity-top-duo .hijri-cal-section,#clarity-top-duo .salah-times-section{",
    "  width:100%!important;height:100%!important;min-height:0!important;box-sizing:border-box!important;",
    "  border-radius:16px!important;background:rgba(0,0,0,0.34)!important;",
    "  box-shadow:inset 0 0 0 1px rgba(255,255,255,0.12)!important;padding:0.28rem 0.32rem!important;",
    "  display:flex!important;flex-direction:column!important;justify-content:flex-start!important;gap:0.12rem!important;}",
    "#clarity-moon-phase{display:flex;flex-direction:column;align-items:center;gap:0.12rem;margin:0 0 0.1rem;flex:0 0 auto;}",
    "#clarity-moon-disc{width:2.15rem;height:2.15rem;border-radius:50%;position:relative;overflow:hidden;",
    "  background:#1a1a22;box-shadow:inset -4px -2px 8px rgba(0,0,0,0.55),0 0 10px rgba(255,240,200,0.12);}",
    "#clarity-moon-disc .moon-lit{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 35% 35%,#f5f0d8,#c8b88a 55%,#8a7a55);}",
    "#clarity-moon-disc .moon-shade{position:absolute;top:0;bottom:0;border-radius:50%;background:#0c0c12;}",
    "#clarity-moon-label{font-size:0.58rem;opacity:0.9;text-align:center;line-height:1.15;}",
    "#clarity-top-duo .hijri-cal-grid{margin-top:0.05rem!important;}",
    "#clarity-top-duo .cal-title,#clarity-top-duo .salah-title{margin:0.05rem auto 0.1rem!important;font-size:0.62rem!important;}",
    "#clarity-top-duo .allah-circular-seal{margin:0 auto 0.1rem!important;}",
    "#clarity-top-duo .masjid-circular-seal,.cal-masjid-accent{display:none!important;}",
    "@media(max-width:720px){#clarity-moon-disc{width:1.85rem;height:1.85rem;}}"
  ].join("\n");

  function injectCss() {
    if (document.getElementById("clarity-banner-moon-css")) return;
    var s = document.createElement("style");
    s.id = "clarity-banner-moon-css";
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function moonPhase(date) {
    var d = date || new Date();
    var ref = Date.UTC(2000, 0, 6, 18, 14, 0);
    var synodic = 29.53058867;
    var days = (d.getTime() - ref) / 86400000;
    var age = ((days % synodic) + synodic) % synodic;
    var frac = age / synodic;
    var names = [
      [0.03, "New moon"], [0.22, "Waxing crescent"], [0.28, "First quarter"],
      [0.47, "Waxing gibbous"], [0.53, "Full moon"], [0.72, "Waning gibbous"],
      [0.78, "Last quarter"], [0.97, "Waning crescent"], [1.01, "New moon"]
    ];
    var label = "Moon";
    for (var i = 0; i < names.length; i++) {
      if (frac <= names[i][0]) { label = names[i][1]; break; }
    }
    return { frac: frac, label: label };
  }

  function paintMoon(disc, phase) {
    disc.innerHTML = "";
    var lit = document.createElement("div");
    lit.className = "moon-lit";
    disc.appendChild(lit);
    var shade = document.createElement("div");
    shade.className = "moon-shade";
    var f = phase.frac;
    if (f < 0.03 || f > 0.97) {
      shade.style.left = "0"; shade.style.width = "100%";
    } else if (f < 0.5) {
      shade.style.left = "0"; shade.style.width = ((0.5 - f) * 2 * 100) + "%";
    } else {
      shade.style.right = "0"; shade.style.left = "auto"; shade.style.width = ((f - 0.5) * 2 * 100) + "%";
    }
    disc.appendChild(shade);
  }

  function apply() {
    var cal = document.querySelector("#clarity-top-duo .hijri-cal-section");
    var sal = document.querySelector("#clarity-top-duo .salah-times-section");
    if (!cal || !sal) return;

    cal.querySelectorAll(".allah-circular-seal,.masjid-circular-seal,#clarity-moon-phase,.cal-masjid-accent").forEach(function (n) { n.remove(); });
    sal.querySelectorAll(".allah-circular-seal,.masjid-circular-seal").forEach(function (n) { n.remove(); });

    var moonWrap = document.createElement("div");
    moonWrap.id = "clarity-moon-phase";
    var disc = document.createElement("div");
    disc.id = "clarity-moon-disc";
    disc.setAttribute("aria-hidden", "true");
    var lab = document.createElement("div");
    lab.id = "clarity-moon-label";
    var phase = moonPhase(new Date());
    paintMoon(disc, phase);
    lab.textContent = phase.label;
    moonWrap.appendChild(disc);
    moonWrap.appendChild(lab);
    var calTitle = cal.querySelector(".cal-title");
    if (calTitle) cal.insertBefore(moonWrap, calTitle);
    else cal.insertBefore(moonWrap, cal.firstChild);

    var allah = document.createElement("div");
    allah.className = "allah-circular-seal";
    allah.title = "Allah";
    allah.innerHTML = '<span class="arabic seal-ar">الله</span>';
    var salTitle = sal.querySelector(".salah-title");
    if (salTitle) sal.insertBefore(allah, salTitle);
    else sal.insertBefore(allah, sal.firstChild);
  }

  function boot() { injectCss(); apply(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 80); });
  else setTimeout(boot, 80);
  w.addEventListener("load", function () { setTimeout(boot, 280); });
  document.addEventListener("clarity-core-ready", function () { setTimeout(boot, 180); });
})(typeof window !== "undefined" ? window : this);

/* === 10. inline-clarity_surah_cont.js === */
(function(){
  "use strict";
  if (window.__CLARITY_SURAH_CONT__) return;
  window.__CLARITY_SURAH_CONT__ = true;
  function wire(){
    var audio = document.getElementById("clarity-surah-audio");
    if (!audio || audio.__contWired) return;
    audio.__contWired = true;
    audio.addEventListener("ended", function(){
      try {
        var cur = (typeof currentSurah === "number" && currentSurah) ? currentSurah : 0;
        if (!cur) {
          var sel = document.getElementById("surah-dropdown") || document.querySelector("select.surah-dropdown");
          cur = parseInt(sel && sel.value, 10) || 0;
        }
        var next = cur + 1;
        if (next > 114) next = 1;
        if (typeof clarityPlaySurah === "function") {
          clarityPlaySurah(next);
          var sel2 = document.getElementById("surah-dropdown") || document.querySelector("select.surah-dropdown");
          if (sel2) sel2.value = String(next);
        }
      } catch(e){}
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(wire, 600); });
  else setTimeout(wire, 600);
  setInterval(wire, 4000);
})();

/* === 11. clarity-room-nav-v1.js === */
/*! clarity-room-nav-v1 · 20261104C8
 * Single sticky rail only. Four isolation doors + soft Craft tile.
 * Upgrades EVERY .clarity-room-nav in place (add Craft if missing).
 * Handles rich (icon+label) and simple (Yawm-style) markup.
 * Never inserts a second rail. No cross-room module imports.
 * Educational only — not a fatwa.
 */
(function () {
  "use strict";
  if (window.__CLARITY_ROOM_NAV_V1_C8__) return;
  window.__CLARITY_ROOM_NAV_V1_C8__ = true;
  /* Allow re-upgrade even if an older v1 flag was set by a prior script */
  window.__CLARITY_ROOM_NAV_V1__ = true;

  var ROOMS = {
    companion: {
      href: "/companion/",
      match: function (p) {
        p = p || "";
        return p === "/companion" || p.indexOf("/companion/") === 0;
      }
    },
    yawm: {
      href: "/daily/",
      match: function (p) {
        return (p || "").indexOf("/daily") === 0;
      }
    },
    university: {
      href: "/campus/",
      match: function (p) {
        return (p || "").indexOf("/campus") === 0;
      }
    },
    amana: {
      href: "/amana/",
      match: function (p) {
        return (p || "").indexOf("/amana") === 0;
      }
    },
    craft: {
      href: "/craft/",
      match: function (p) {
        return (p || "").indexOf("/craft") === 0;
      }
    }
  };

  function path() {
    try {
      return location.pathname || "/";
    } catch (e) {
      return "/";
    }
  }

  function mark(nav) {
    if (!nav) return;
    var p = path();
    var forced = (nav.getAttribute("data-room") || "").toLowerCase();
    var links = nav.querySelectorAll("[data-room-link]");
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var id = (a.getAttribute("data-room-link") || "").toLowerCase();
      var here = forced ? id === forced : ROOMS[id] && ROOMS[id].match(p);
      a.classList.toggle("is-here", !!here);
      a.classList.toggle("here", !!here);
      if (here) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    }
  }

  /** Detect simple text-only rails (e.g. Yawm .top) vs rich icon rails */
  function isSimpleRail(nav) {
    if (!nav) return false;
    if (nav.classList.contains("top")) return true;
    var sample = nav.querySelector("[data-room-link]");
    if (!sample) return false;
    return !sample.querySelector(".crn-ico, .crn-label");
  }

  function craftAnchor(simple) {
    var a = document.createElement("a");
    a.href = "/craft/";
    a.setAttribute("data-room-link", "craft");
    if (simple) {
      a.textContent = "Craft";
    } else {
      a.innerHTML =
        '<span class="crn-ico" aria-hidden="true">✒️</span>' +
        '<span class="crn-label">Craft<span class="crn-sub">meme · tajweed · desks</span></span>';
    }
    return a;
  }

  function fullNavHtml() {
    return (
      '<a href="/companion/" data-room-link="companion">' +
        '<span class="crn-ico" aria-hidden="true">🏠</span>' +
        '<span class="crn-label">Companion<span class="crn-sub">tools · reminder</span></span></a>' +
      '<a href="/daily/" data-room-link="yawm">' +
        '<span class="crn-ico" aria-hidden="true">🌅</span>' +
        '<span class="crn-label">Yawm<span class="crn-sub">today’s portion</span></span></a>' +
      '<a href="/campus/" data-room-link="university">' +
        '<span class="crn-ico" aria-hidden="true">🎓</span>' +
        '<span class="crn-label">University<span class="crn-sub">ordered path</span></span></a>' +
      '<a href="/amana/" data-room-link="amana">' +
        '<span class="crn-ico" aria-hidden="true">🔐</span>' +
        '<span class="crn-label">Amānah<span class="crn-sub">vault · dayn · heirs</span></span></a>' +
      '<a href="/craft/" data-room-link="craft">' +
        '<span class="crn-ico" aria-hidden="true">✒️</span>' +
        '<span class="crn-label">Craft<span class="crn-sub">meme · tajweed · desks</span></span></a>' +
      '<p class="crn-seal">Five rooms · educational only · not a fatwa</p>'
    );
  }

  function upgradeOne(nav, room) {
    if (!nav) return;
    if (room) nav.setAttribute("data-room", room);
    if (!nav.querySelector('[data-room-link="craft"]')) {
      var simple = isSimpleRail(nav);
      var link = craftAnchor(simple);
      var seal = nav.querySelector(".crn-seal");
      if (seal) {
        nav.insertBefore(link, seal);
        seal.textContent = "Five rooms · educational only · not a fatwa";
      } else {
        nav.appendChild(link);
        /* optional seal for rails that never had one */
        if (!simple) {
          var p = document.createElement("p");
          p.className = "crn-seal";
          p.textContent = "Five rooms · educational only · not a fatwa";
          nav.appendChild(p);
        }
      }
    } else {
      var seal2 = nav.querySelector(".crn-seal");
      if (seal2 && /Four rooms/i.test(seal2.textContent || "")) {
        seal2.textContent = "Five rooms · educational only · not a fatwa";
      }
    }
    mark(nav);
  }

  /**
   * SINGLE-RAIL RULE:
   * Upgrade every existing .clarity-room-nav in place.
   * Create one only if none exist.
   */
  function ensureNav(room) {
    var list = document.querySelectorAll(".clarity-room-nav");
    if (list && list.length) {
      for (var i = 0; i < list.length; i++) upgradeOne(list[i], room);
      return list[0];
    }
    var nav = document.createElement("nav");
    nav.className = "clarity-room-nav";
    nav.setAttribute("aria-label", "Clarity rooms");
    if (room) nav.setAttribute("data-room", room);
    nav.innerHTML = fullNavHtml();
    var body = document.body;
    if (body) {
      if (body.firstChild) body.insertBefore(nav, body.firstChild);
      else body.appendChild(nav);
    }
    mark(nav);
    return nav;
  }

  function detectRoom() {
    var room =
      document.documentElement.getAttribute("data-clarity-room") ||
      (document.body && document.body.getAttribute("data-clarity-room")) ||
      "";
    room = (room || "").toLowerCase();
    if (room) return room;
    var p = path();
    if (p.indexOf("/daily") === 0) return "yawm";
    if (p.indexOf("/campus") === 0) return "university";
    if (p.indexOf("/amana") === 0) return "amana";
    if (p.indexOf("/craft") === 0) return "craft";
    if (p === "/companion" || p.indexOf("/companion/") === 0) return "companion";
    return "";
  }

  function boot() {
    ensureNav(detectRoom());
  }

  /* Multiple passes: early DOM, load, and short delay for late shells */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  window.addEventListener("load", function () {
    ensureNav(detectRoom());
  });
  setTimeout(function () {
    ensureNav(detectRoom());
  }, 400);
  window.addEventListener("popstate", function () {
    var n = document.querySelector(".clarity-room-nav");
    if (n) mark(n);
  });

  /* Public re-run for shells that rebuild nav */
  window.ClarityRoomNavUpgrade = function () {
    ensureNav(detectRoom());
  };
})();

/* === END companion-boot.js · T-BOOT-01 · Bismillah === */
