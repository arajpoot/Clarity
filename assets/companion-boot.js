/*!
 * companion-boot.js
 * T-BOOT-01 (current live paths) · Phase 0–6 Governance Contract
 * Bismillah.
 * Enrichment: held
 * Built from CURRENT companion/assets boot scripts (2026-11).
 * No vault scripts. Feature scripts remain separate.
 * Educational only — not a fatwa.
 */

/* === 1. companion-shariah-guard-v1.js === */
/*! companion-shariah-guard-v1 · Phase C migrate from companion-inline
 * from inline-clarity_shariah_source_guard_v1
 * Educational only — not a fatwa.
 */
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

/* === 2. companion-error-guard-v1.js === */
/*! companion-error-guard-v1 · Phase C migrate from companion-inline
 * from inline-clarity_error_guard_v2
 * Educational only — not a fatwa.
 */
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

/* === 3. companion-boot-v2.js === */
/*! Clarity companion-boot v2 · Phase 2 · campus untouched */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_COMPANION_BOOT_V2__) return;
  w.__CLARITY_COMPANION_BOOT_V2__ = true;
  w.__CLARITY_SKIP_DAY_LANDING__ = true;
  var KEY = "clarity_shell_mode_v1";
  try {
    localStorage.setItem(KEY, "companion");
    sessionStorage.setItem("clarity_shell_user_pick_v1", "1");
    var r = d.documentElement;
    r.setAttribute("data-clarity-room", "companion");
    r.setAttribute("data-clarity-viewport", "companion-path");
    r.setAttribute("data-shell-mode", "companion");
  } catch (e) {}
})(window, document);

/* === 4. companion-boot-shim-v1.js === */
/*! companion-boot-shim-v1 · Phase C
 * Cleaned from inline-96908bb2ed Phase 0 shim.
 * Does NOT set window.ALLOW (path-progress + governance own it).
 * Early theme + queue stubs only. Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_BOOT_SHIM_V1__) return;
  w.__COMPANION_BOOT_SHIM_V1__ = true;

  /* Theme chips — real core may replace */
  if (typeof w.claritySetThemeMode !== "function") {
    w.claritySetThemeMode = function (mode) {
      mode = mode || "system";
      try { localStorage.setItem("clarity_theme_mode", mode); } catch (e) {}
      var resolved = mode;
      if (mode === "system") {
        try {
          resolved =
            w.matchMedia && w.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light";
        } catch (e) {
          resolved = "light";
        }
      }
      try {
        d.documentElement.setAttribute("data-theme", resolved);
        d.documentElement.setAttribute("data-theme-mode", mode);
      } catch (e) {}
      try {
        d.querySelectorAll("[data-theme-chip]").forEach(function (t) {
          t.classList.toggle("active", t.getAttribute("data-theme-chip") === mode);
        });
      } catch (e) {}
    };
  }

  if (typeof w.clarityWelcomePickTrack !== "function") {
    w.clarityWelcomePickTrack = function () {};
  }
  if (typeof w.clarityWelcomeSkipToName !== "function") {
    w.clarityWelcomeSkipToName = function () {};
  }
  if (typeof w.loadCommand !== "function") {
    w.loadCommand = function () {
      try {
        (w.__clarityCmdQueue = w.__clarityCmdQueue || []).push([]);
      } catch (e) {}
    };
  }
  if (typeof w.memeFetchRrra !== "function") {
    w.memeFetchRrra = function () {
      try {
        (w.__clarityMemeQueue = w.__clarityMemeQueue || []).push(["rrra"]);
      } catch (e) {}
    };
  }
  if (typeof w.memeFetchBg !== "function") {
    w.memeFetchBg = function (kind) {
      try {
        (w.__clarityMemeQueue = w.__clarityMemeQueue || []).push(["bg", kind]);
      } catch (e) {}
    };
  }
  /* Surah/reciter: prefer banner-controls if already defined */
  if (typeof w.clarityPlaySurahFromSelect !== "function") {
    w.clarityPlaySurahFromSelect = function (sel) {
      try {
        (w.__claritySurahQueue = w.__claritySurahQueue || []).push(sel && sel.value);
      } catch (e) {}
    };
  }
  if (typeof w.claritySetReciter !== "function") {
    w.claritySetReciter = function (code) {
      try {
        localStorage.setItem("clarity_reciter", code || "afs");
      } catch (e) {}
    };
  }
})(window, document);

/* === 5. companion-room-owner-v1.js === */
/*! companion-room-owner-v1 · Phase 6 — SINGLE OWNER
 * Boot · core path · spine packs (no chunk-8) · tabs · banner · craft · path
 * Companion room only. Campus / daily / amana untouched.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_COMPANION_ROOM_OWNER_V1__) return;
  w.__CLARITY_COMPANION_ROOM_OWNER_V1__ = true;

  /* Claim legacy phase flags so older scripts no-op */
  w.__CLARITY_SPINE_DEDUPE_V1__ = true;
  w.__CLARITY_COMPANION_CORE_PATH_FIX_V1__ = true;
  w.__CLARITY_COMPANION_TAB_INTEGRITY_V1__ = true;
  w.__CLARITY_BANNER_OWNER_V3__ = true;
  w.__CLARITY_BANNER_OWNER_V2__ = true;
  w.__CLARITY_BANNER_CONTROL_N34__ = true;
  w.__CLARITY_BANNER_INTEGRITY_V35__ = true;
  w.__CLARITY_BANNER_AV_V1__ = true;
  w.__CLARITY_BANNER_MOON_V2__ = true;
  w.__CLARITY_CRAFT_PHASE3_V1__ = true;
  w.__CLARITY_PATH_PHASE4_V1__ = true;
  w.__CLARITY_A2_SPINE_LOADER__ = true;

  function roomOk() {
    try {
      var p = (w.location && w.location.pathname) || "";
      if (p.indexOf("/campus") === 0 || p.indexOf("/amana") === 0 || p.indexOf("/daily") === 0) return false;
      return p.indexOf("/companion") === 0;
    } catch (e) { return false; }
  }
  if (!roomOk()) return;

  try {
    d.documentElement.setAttribute("data-clarity-room", "companion");
  } catch (e) {}

  /* ── stubs ── */
  function stub(name, fn) {
    if (typeof w[name] !== "function") w[name] = fn;
  }
  stub("claritySetThemeMode", function (mode) {
    try {
      mode = String(mode || "system").toLowerCase();
      if (mode === "night") mode = "dark";
      if (mode === "day") mode = "light";
      if (mode === "system") {
        var dark = w.matchMedia && w.matchMedia("(prefers-color-scheme: dark)").matches;
        mode = dark ? "dark" : "light";
      }
      d.documentElement.setAttribute("data-theme", mode);
      try { localStorage.setItem("clarity_theme_mode", mode); } catch (e) {}
    } catch (e) {}
  });
  stub("memeFetchRrra", function () { return Promise.resolve(null); });
  stub("memeFetchBg", function () { return Promise.resolve(null); });
  stub("clarityPlaySurahFromSelect", function () {});
  stub("claritySetReciter", function () {});
  stub("resetToGateView", function () { try { w.location.href = "/"; } catch (e) {} });
  stub("clarityPickPrimaryDoor", function (door) {
    try {
      if (door === "today") w.location.href = "/daily/";
      else if (door === "learn") w.location.href = "/campus/";
      else if (door === "prepare") w.location.href = "/amana/";
      else w.location.href = "/";
    } catch (e) {}
  });

  /* ── core + spine (no chunk-8 — avoids const tabKeys clash) ── */
  var CORE_ABS = "/assets/clarity-core-block-8.js";
  var CORE_VER = "20261104P6";
  var A2 = "/companion/assets/a2/";
  var A2V = "20261104R17";
  var PACKS = [
    "clarity-runtime-overlays-v1.js",
    "clarity-feature-pack-v1.js",
    "clarity-path-pack-v1.js",
    "clarity-aux-pack-v1.js"
  ];

  function loadScript(src, flag) {
    return new Promise(function (resolve) {
      var bare = src.split("?")[0];
      if (d.querySelector("script[" + flag + '="' + bare + '"]')) return resolve(true);
      var s = d.createElement("script");
      s.src = src;
      s.async = false;
      s.setAttribute(flag, bare);
      s.onload = function () { resolve(true); };
      s.onerror = function () { resolve(false); };
      d.head.appendChild(s);
    });
  }

  function loadCoreAndPacks() {
    if (w.__CLARITY_CORE_ABS_LOADED__) {
      return PACKS.reduce(function (p, name) {
        return p.then(function () { return loadScript(A2 + name + "?v=" + A2V, "data-a2-spine"); });
      }, Promise.resolve()).then(function () {
        try { d.dispatchEvent(new CustomEvent("clarity-a2-spine-ready")); } catch (e) {}
      });
    }
    /* poison chunk-8 marker so stock spine cannot load it */
    try {
      var m = d.createElement("script");
      m.type = "text/plain";
      m.setAttribute("data-a2-spine", A2 + "clarity-chunk-8.js");
      d.head.appendChild(m);
    } catch (e) {}

    return loadScript(CORE_ABS + "?v=" + CORE_VER, "data-clarity-core-abs").then(function (ok) {
      if (ok) {
        w.__CLARITY_CORE_ABS_LOADED__ = true;
        try { d.dispatchEvent(new CustomEvent("clarity-core-ready")); } catch (e) {}
      }
      return PACKS.reduce(function (p, name) {
        return p.then(function () { return loadScript(A2 + name + "?v=" + A2V, "data-a2-spine"); });
      }, Promise.resolve());
    }).then(function () {
      try { d.dispatchEvent(new CustomEvent("clarity-a2-spine-ready")); } catch (e) {}
      try { d.dispatchEvent(new CustomEvent("clarity-core-ready")); } catch (e) {}
    });
  }

  /* ── tabs ── */
  function softSwitchTab(id) {
    id = String(id || "reminder").replace(/^tab-/, "");
    d.querySelectorAll(".tab-panel").forEach(function (t) {
      var on = t.id === "tab-" + id || t.getAttribute("data-rrra-hub") === id;
      t.classList.toggle("active", on);
      t.style.display = on ? "block" : "none";
      t.setAttribute("aria-hidden", on ? "false" : "true");
    });
    d.querySelectorAll("[data-tab],[data-rrra-nav]").forEach(function (b) {
      var t = b.getAttribute("data-tab") || b.getAttribute("data-rrra-nav");
      b.classList.toggle("active", t === id);
    });
    try { localStorage.setItem("clarity_active_tab", id); } catch (e) {}
  }
  if (typeof w.switchTab !== "function") w.switchTab = softSwitchTab;

  function bindTabs() {
    d.querySelectorAll(".bottom-nav a, .bottom-nav button, .rrra-bottom-nav a, .rrra-bottom-nav button, [data-tab], [data-rrra-nav]").forEach(function (el) {
      if (el.__ownerTab) return;
      el.__ownerTab = true;
      el.addEventListener("click", function (ev) {
        var id = el.getAttribute("data-tab") || el.getAttribute("data-rrra-nav");
        if (!id) {
          var href = el.getAttribute("href") || "";
          var m = href.match(/#?(reminder|reality|reflection|action|notes|about)/i);
          if (m) id = m[1].toLowerCase();
        }
        if (!id) return;
        ev.preventDefault();
        if (typeof w.switchTab === "function") w.switchTab(id);
        else softSwitchTab(id);
      });
    });
  }

  /* ── banner (sole owner) ── */
  var STILLS = {
    makkah: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/640px-Kaaba_Masjid_Haraam_Makkah.jpg",
    madinah: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Al-Masjid_an-Nabawi_as-from_top.jpg/640px-Al-Masjid_an-Nabawi_as-from_top.jpg"
  };
  var PLACES = {
    madinah: { embed: "https://www.youtube-nocookie.com/embed/5RJkL7vLHLs?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1" },
    makkah: { embed: "https://www.youtube-nocookie.com/embed/NJooZDDcV1E?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1" }
  };

  var BANNER_CSS = [
    "html[data-clarity-room=companion] .banner{position:relative;width:100%;overflow:hidden;border-radius:0 0 18px 18px;min-height:200px;}",
    "html[data-clarity-room=companion] #banner-media{position:absolute;inset:0;z-index:0;background:#0a1210;min-height:200px;}",
    "html[data-clarity-room=companion] #banner-img.banner-still-img{width:100%;height:100%;object-fit:cover;display:block;opacity:1;transition:opacity .25s;}",
    "html[data-clarity-room=companion] #banner-live.banner-live-iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:none;}",
    "html[data-clarity-room=companion] #banner-media.live-active #banner-live{display:block!important;}",
    "html[data-clarity-room=companion] #banner-media.live-active #banner-img{opacity:0.12;}",
    "html[data-clarity-room=companion] .banner{min-height:12rem;}",
    "html[data-clarity-room=companion] .banner-overlay{position:relative;z-index:2;display:grid!important;",
    "  grid-template-columns:minmax(7rem,22%) minmax(0,1fr) minmax(7rem,22%);",
    "  grid-template-areas:\"bleft bcenter bright\";gap:0.35rem;padding:0.45rem 0.55rem;width:100%;box-sizing:border-box;",
    "  background:linear-gradient(180deg,rgba(8,28,22,0.55),rgba(8,28,22,0.72));contain:layout;}",
    "html[data-clarity-room=companion] .banner-side.left{grid-area:bleft;}",
    "html[data-clarity-room=companion] .banner-center{grid-area:bcenter;display:flex;flex-direction:column;align-items:center;text-align:center;justify-content:center;min-width:0;}",
    "html[data-clarity-room=companion] .banner-side.right{grid-area:bright;justify-self:end;width:100%;}",
    "html[data-clarity-room=companion] .banner-side.right .salah-times-section{margin-left:auto;max-width:11.5rem;text-align:right;",
    "  background:rgba(8,18,14,0.62);border:1px solid rgba(212,180,90,0.25);border-radius:12px;padding:0.4rem 0.5rem;}",
    "html[data-clarity-room=companion] .stream-controls{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:0.3rem;margin-top:0.35rem;}",
    "html[data-clarity-room=companion] .stream-controls select,.stream-controls button{height:1.85rem;border-radius:999px;font-size:0.75rem;}",
    "html[data-clarity-room=companion] .hijri-cal-section,html[data-clarity-room=companion] .salah-times-section{",
    "  width:100%;box-sizing:border-box;border-radius:14px;background:rgba(0,0,0,0.38);",
    "  box-shadow:inset 0 0 0 1px rgba(255,255,255,0.1);padding:0.3rem 0.35rem;}",
    "html[data-clarity-room=companion] #clarity-moon-phase{display:flex;flex-direction:column;align-items:center;gap:0.1rem;}",
    "html[data-clarity-room=companion] #clarity-moon-disc{width:2rem;height:2rem;border-radius:50%;position:relative;overflow:hidden;background:#1a1a22;}",
    "html[data-clarity-room=companion] #clarity-moon-disc .moon-lit{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 35% 35%,#f5f0d8,#c8b88a 55%,#8a7a55);}",
    "html[data-clarity-room=companion] #clarity-moon-disc .moon-shade{position:absolute;top:0;bottom:0;border-radius:50%;background:#0c0c12;}",
    "html[data-clarity-room=companion] #clarity-moon-label{font-size:0.58rem;opacity:0.9;text-align:center;}",
    "html[data-clarity-room=companion] .live-haramain-btn.is-live,#live-haramain-btn.active{outline:1px solid rgba(201,162,39,0.7);}",
    "/* path plaques */",
    ".clarity-gate-switcher,#clarity-path-rail,#clarity-path-intro{display:none!important;}",
    "#clarity-grave-path-strip .gps-phases{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0.4rem;}",
    "@media(max-width:720px){#clarity-grave-path-strip .gps-phases{grid-template-columns:repeat(2,minmax(0,1fr));}}",
    "#clarity-grave-path-strip .gps-phase{display:flex;flex-direction:column;align-items:flex-start;gap:0.15rem;",
    "  padding:0.5rem 0.55rem;border-radius:12px;border:1px solid rgba(212,180,90,0.25);background:rgba(0,0,0,0.2);",
    "  cursor:pointer;font:inherit;color:inherit;width:100%;text-align:left;}",
    "#clarity-grave-path-strip .gps-phase.active{border-color:rgba(201,162,39,0.7);}",
    "#clarity-grave-path-strip .gps-ico{font-size:1.2rem;line-height:1;}"
  ].join("\n");

  function $(id) { return d.getElementById(id); }

  function injectCss() {
    var el = d.getElementById("companion-room-owner-css");
    if (el) el.remove();
    var s = d.createElement("style");
    s.id = "companion-room-owner-css";
    s.textContent = BANNER_CSS;
    (d.head || d.documentElement).appendChild(s);
  }

  function placeKey() {
    var sel = $("live-place-select");
    var v = ((sel && sel.value) || "madinah").toLowerCase();
    if (v.indexOf("makk") >= 0 || v.indexOf("mecca") >= 0) return "makkah";
    return "madinah";
  }

  function ensureStill(key) {
    var img = $("banner-img");
    if (!img) return;
    key = key || placeKey();
    var src = STILLS[key] || STILLS.makkah;
    if (!img.getAttribute("src") || /about:blank/i.test(img.src || "")) img.src = src;
    img.onerror = function () { img.onerror = null; img.src = STILLS.makkah; };
    img.style.display = "block";
    img.removeAttribute("hidden");
  }

  function setLive(on) {
    var ifr = $("banner-live");
    var btn = $("live-haramain-btn");
    var label = $("live-haramain-label");
    var media = $("banner-media");
    var conf = PLACES[placeKey()] || PLACES.madinah;
    if (on) {
      if (ifr) {
        ifr.hidden = false;
        ifr.removeAttribute("hidden");
        ifr.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
        ifr.src = conf.embed;
      }
      if (media) media.classList.add("live-active");
      if (btn) { btn.classList.add("active", "is-live"); btn.setAttribute("aria-pressed", "true"); }
      if (label) label.textContent = "Live";
      try { localStorage.setItem("clarity_banner_live_v1", "1"); } catch (e) {}
    } else {
      if (ifr) { ifr.hidden = true; ifr.setAttribute("hidden", ""); ifr.src = "about:blank"; }
      if (media) media.classList.remove("live-active");
      if (btn) { btn.classList.remove("active", "is-live"); btn.setAttribute("aria-pressed", "false"); }
      if (label) label.textContent = "Stills";
      ensureStill(placeKey());
      try { localStorage.setItem("clarity_banner_live_v1", "0"); } catch (e) {}
    }
  }

  w.toggleHaramainLive = function () {
    var ifr = $("banner-live");
    var live = ifr && !ifr.hidden && ifr.src && ifr.src.indexOf("youtube") >= 0;
    setLive(!live);
  };
  w.toggleLive = w.toggleHaramainLive;
  w.changeHaramainPlace = function () {
    var ifr = $("banner-live");
    var live = ifr && !ifr.hidden && ifr.src && ifr.src.indexOf("youtube") >= 0;
    ensureStill(placeKey());
    if (live) setLive(true);
  };
  if (typeof w.toggleQuranStream !== "function") {
    w.toggleQuranStream = function () {
      var a = $("quran-audio") || $("quran-audio-dup1");
      if (!a) return;
      try { if (a.paused) a.play(); else a.pause(); } catch (e) {}
    };
  }
  if (typeof w.changeStream !== "function") {
    w.changeStream = function () {
      var sel = $("stream-select");
      var a = $("quran-audio") || $("quran-audio-dup1");
      if (sel && a && sel.value) try { a.src = sel.value; } catch (e) {}
    };
  }

  function moonPhase(date) {
    var d0 = date || new Date();
    var ref = Date.UTC(2000, 0, 6, 18, 14, 0);
    var synodic = 29.53058867;
    var days = (d0.getTime() - ref) / 86400000;
    var age = ((days % synodic) + synodic) % synodic;
    var frac = age / synodic;
    var names = [[0.03,"New moon"],[0.22,"Waxing crescent"],[0.28,"First quarter"],[0.47,"Waxing gibbous"],[0.53,"Full moon"],[0.72,"Waning gibbous"],[0.78,"Last quarter"],[0.97,"Waning crescent"],[1.01,"New moon"]];
    var label = "Moon";
    for (var i = 0; i < names.length; i++) if (frac <= names[i][0]) { label = names[i][1]; break; }
    return { frac: frac, label: label };
  }

  function ensureMoon() {
    var cal = d.querySelector(".hijri-cal-section");
    if (!cal) return;
    cal.querySelectorAll(".masjid-circular-seal,.cal-masjid-accent").forEach(function (n) { n.remove(); });
    var wrap = $("clarity-moon-phase");
    if (!wrap) {
      wrap = d.createElement("div");
      wrap.id = "clarity-moon-phase";
      var disc = d.createElement("div");
      disc.id = "clarity-moon-disc";
      disc.setAttribute("aria-hidden", "true");
      var lab = d.createElement("div");
      lab.id = "clarity-moon-label";
      wrap.appendChild(disc);
      wrap.appendChild(lab);
      var title = cal.querySelector(".cal-title");
      if (title) cal.insertBefore(wrap, title);
      else cal.insertBefore(wrap, cal.firstChild);
    }
    var phase = moonPhase(new Date());
    var disc = $("clarity-moon-disc");
    if (disc) {
      disc.innerHTML = "";
      var lit = d.createElement("div");
      lit.className = "moon-lit";
      disc.appendChild(lit);
      var shade = d.createElement("div");
      shade.className = "moon-shade";
      var f = phase.frac;
      if (f < 0.03 || f > 0.97) { shade.style.left = "0"; shade.style.width = "100%"; }
      else if (f < 0.5) { shade.style.left = "0"; shade.style.width = ((0.5 - f) * 2 * 100) + "%"; }
      else { shade.style.right = "0"; shade.style.left = "auto"; shade.style.width = ((f - 0.5) * 2 * 100) + "%"; }
      disc.appendChild(shade);
    }
    var lab = $("clarity-moon-label");
    if (lab) lab.textContent = phase.label;
  }

  function layoutBanner() {
    var ov = d.querySelector(".banner-overlay");
    if (!ov) return;
    var left = ov.querySelector(".banner-side.left");
    var center = ov.querySelector(".banner-center");
    var right = ov.querySelector(".banner-side.right");
    if (!right) {
      right = d.createElement("div");
      right.className = "banner-side right";
    }
    var salah = ov.querySelector(".salah-times-section") || d.querySelector(".salah-times-section");
    var cal = ov.querySelector(".hijri-cal-section");
    if (salah) right.appendChild(salah);
    if (cal && left) left.appendChild(cal);
    if (left) ov.appendChild(left);
    if (center) ov.appendChild(center);
    ov.appendChild(right);
  }

  /* ── craft fallbacks ── */
  var DAILY = [
    { ar: "فَاذْكُرُونِي أَذْكُرْكُمْ", en: "So remember Me; I will remember you.", ref: "Qur'an 2:152" },
    { ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", en: "Verily, in the remembrance of Allah do hearts find rest.", ref: "Qur'an 13:28" }
  ];
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function applyLine(line, bg) {
    if (!line) return;
    try {
      if (typeof w.clarityMemeFill === "function") w.clarityMemeFill(line.ar, line.en, line.ref);
      else if (typeof w.memeApplyVerseCard === "function") w.memeApplyVerseCard(line.ar, line.en, "", line.ref);
      else {
        var t = $("meme-top-input"), m = $("meme-mid-input"), b = $("meme-bottom-input");
        if (t) t.value = line.ar || "";
        if (m) m.value = line.en || "";
        if (b) b.value = line.ref || "";
        if (typeof w.memeDraw === "function") w.memeDraw();
      }
    } catch (e) {}
    if (bg && typeof w.memeFetchBg === "function") try { w.memeFetchBg(bg); } catch (e2) {}
  }
  function ensureCraft() {
    if (typeof w.memeFetchBg !== "function") {
      w.memeFetchBg = function (kind) {
        var url = "https://picsum.photos/seed/c-" + (kind || "nature") + "-" + (Date.now() % 9999) + "/1200/900.jpg";
        try {
          if (typeof w.memeSetBackgroundUrl === "function") w.memeSetBackgroundUrl(url);
        } catch (e) {}
        return Promise.resolve(url);
      };
    }
    if (typeof w.memeFetchRrra !== "function") {
      w.memeFetchRrra = function () { applyLine(pick(DAILY), "holy"); return Promise.resolve(true); };
    }
    if (typeof w.memeDailyVerse !== "function") {
      w.memeDailyVerse = function () { applyLine(pick(DAILY), "holy"); };
    }
  }

  /* ── path plaques ── */
  var ICONS = { seeker: "🔭", new_muslim: "🌱", practicing: "📿", dai: "🕊️" };
  function decoratePath() {
    d.querySelectorAll("#clarity-grave-path-strip .gps-phase").forEach(function (btn) {
      if (btn.querySelector(".gps-ico")) return;
      var g = btn.getAttribute("data-gate") || "";
      var span = d.createElement("span");
      span.className = "gps-ico";
      span.setAttribute("aria-hidden", "true");
      span.textContent = ICONS[g] || "✦";
      btn.insertBefore(span, btn.firstChild);
    });
  }

  /* ── surface boot ── */
  function surface() {
    injectCss();
    ensureStill(placeKey());
    layoutBanner();
    ensureMoon();
    ensureCraft();
    decoratePath();
    bindTabs();
    try {
      if (localStorage.getItem("clarity_banner_live_v1") === "1") setLive(true);
    } catch (e) {}
    var sel = $("live-place-select");
    if (sel && !sel.__owner6) {
      sel.__owner6 = true;
      sel.addEventListener("change", function () { w.changeHaramainPlace(); });
    }
    var id = "reminder";
    try { id = localStorage.getItem("clarity_active_tab") || "reminder"; } catch (e) {}
    if (typeof w.switchTab === "function") try { w.switchTab(id); } catch (e) { softSwitchTab(id); }
    else softSwitchTab(id);
  }

  function boot() {
    loadCoreAndPacks().then(function () { surface(); });
    /* also surface early for stills/tabs before core finishes */
    setTimeout(surface, 40);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(surface, 200); });
  d.addEventListener("clarity-core-ready", function () { setTimeout(surface, 50); });
  d.addEventListener("clarity-a2-spine-ready", function () { setTimeout(surface, 50); });

  try {
    new MutationObserver(function () { setTimeout(decoratePath, 40); }).observe(d.documentElement, { childList: true, subtree: true });
  } catch (e) {}
})(window, document);

/* === 6. clarity-room-nav-v1.js === */
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

/* === 7. clarity-companion-unfreeze-v3.js === */
/*! Clarity Companion unfreeze v4.2 · shell only · tabs via persist · campus untouched */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_COMPANION_UNFREEZE_V4__) return;
  w.__CLARITY_COMPANION_UNFREEZE_V4__ = true;
  w.__CLARITY_COMPANION_UNFREEZE_V3__ = true;

  var SHELL_KEY = "clarity_shell_mode_v1";
  var LOG = [];
  w.__COMPANION_UNFREEZE_LOG = LOG;
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  function hide(el) {
    if (!el) return;
    try {
      el.style.setProperty("display", "none", "important");
      el.setAttribute("hidden", "hidden");
      el.setAttribute("aria-hidden", "true");
    } catch (e) {}
  }

  function forceCompanionShell() {
    try {
      localStorage.setItem(SHELL_KEY, "companion");
      sessionStorage.setItem("clarity_shell_user_pick_v1", "1");
    } catch (e) {}
    try {
      var root = d.documentElement;
      if (root.getAttribute("data-shell-mode") !== "companion") {
        root.setAttribute("data-shell-mode", "companion");
      }
      root.setAttribute("data-clarity-room", "companion");
      root.setAttribute("data-clarity-viewport", "companion-path");
      root.classList.add("companion-unfrozen");
      if (d.body) d.body.setAttribute("data-shell-mode", "companion");
    } catch (e) {}
    w.__CLARITY_SKIP_DAY_LANDING__ = true;
  }

  function scrubLanding() {
    ["clarity-day-landing","clarity-landing-stack","landing-gate-screen","clarity-welcome"].forEach(function (id) {
      hide(d.getElementById(id));
    });
  }

  function showMainOnly() {
    var main = d.getElementById("main-content");
    if (!main) return;
    try {
      main.removeAttribute("hidden");
      main.setAttribute("aria-hidden", "false");
      main.hidden = false;
      if (getComputedStyle(main).display === "none") {
        main.style.setProperty("display", "block", "important");
        log("main restored");
      }
    } catch (e) {}
  }

  function patchShell() {
    if (!w.ClarityShell || w.ClarityShell.__companionPatched) return;
    try {
      if (typeof w.ClarityShell.setMode === "function") {
        var os = w.ClarityShell.setMode.bind(w.ClarityShell);
        w.ClarityShell.setMode = function (m) {
          if (m === "landing") m = "companion";
          return os(m);
        };
      }
      if (typeof w.ClarityShell.apply === "function") {
        var oa = w.ClarityShell.apply.bind(w.ClarityShell);
        w.ClarityShell.apply = function () {
          try { localStorage.setItem(SHELL_KEY, "companion"); } catch (e) {}
          var r = oa();
          forceCompanionShell();
          scrubLanding();
          showMainOnly();
          return r;
        };
      }
      w.ClarityShell.__companionPatched = true;
      log("shell patched");
      try { w.ClarityShell.setMode("companion"); } catch (e) {}
    } catch (e) {
      log("patch " + e);
    }
  }

  function restore(why) {
    forceCompanionShell();
    scrubLanding();
    showMainOnly();
    patchShell();
    log("pass:" + why);
  }

  forceCompanionShell();
  function onReady() {
    restore("ready");
    setTimeout(function () { restore("t250"); }, 250);
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", onReady);
  else onReady();
  w.addEventListener("load", function () {
    var main = d.getElementById("main-content");
    if (main && getComputedStyle(main).display === "none") restore("load");
    else log("load-ok");
  });

  try {
    var mo = new MutationObserver(function () {
      if (d.documentElement.getAttribute("data-shell-mode") === "landing") restore("mo");
    });
    mo.observe(d.documentElement, { attributes: true, attributeFilter: ["data-shell-mode"] });
  } catch (e) {}

  w.clarityCompanionUnfreeze = function () { restore("manual"); };
})(window, document);

/* === 8. companion-pathway-loader-v1.js === */
/*! companion-pathway-loader-v1 · C2 · selective pathway packs · chrome unchanged · educational only */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_PATHWAY_LOADER_V1__) return;
  w.__COMPANION_PATHWAY_LOADER_V1__ = true;

  var V = "20261108C2";
  var loaded = {};
  var PACK = {
    reminder: "/companion/assets/pathways/reminder/pack-v1.js",
    reality: "/companion/assets/pathways/reality/pack-v1.js",
    reflection: "/companion/assets/pathways/reflection/pack-v1.js",
    action: "/companion/assets/pathways/action/pack-v1.js"
  };

  function normalize(id) {
    id = String(id || "").toLowerCase().replace(/^#/, "");
    if (id.indexOf("remind") >= 0) return "reminder";
    if (id.indexOf("realit") >= 0 || id.indexOf("grave") >= 0) return "reality";
    if (id.indexOf("reflect") >= 0) return "reflection";
    if (id.indexOf("action") >= 0 || id.indexOf("hajj") >= 0) return "action";
    if (PACK[id]) return id;
    return null;
  }

  function loadPack(id) {
    id = normalize(id);
    if (!id || !PACK[id]) return Promise.resolve(null);
    if (loaded[id]) return loaded[id];
    loaded[id] = new Promise(function (resolve) {
      var s = d.createElement("script");
      s.src = PACK[id] + "?v=" + V;
      s.async = true;
      s.setAttribute("data-pathway-loader", id);
      s.onload = function () { resolve(id); };
      s.onerror = function () { resolve(null); };
      d.head.appendChild(s);
    });
    return loaded[id];
  }

  function fromHash() {
    var h = (location.hash || "").toLowerCase();
    return normalize(h) || null;
  }

  function fromDom() {
    var active = d.querySelector("[data-pathway].is-active, [data-path].is-active, .path-tile.active, [aria-current='page'][data-pathway]");
    if (active) {
      return normalize(active.getAttribute("data-pathway") || active.getAttribute("data-path") || active.textContent);
    }
    /* RRRA-style tabs */
    var tab = d.querySelector('[role="tab"][aria-selected="true"], .tab.is-active, .rrra-tab.active');
    if (tab) return normalize(tab.getAttribute("data-pathway") || tab.getAttribute("data-tab") || tab.textContent);
    return null;
  }

  function bootDefault() {
    var id = fromHash() || fromDom() || "reminder";
    loadPack(id);
    /* warm adjacent packs on idle for snappy switch */
    if (typeof w.requestIdleCallback === "function") {
      w.requestIdleCallback(function () {
        ["reality", "reflection", "action"].forEach(function (p) {
          if (p !== id) loadPack(p);
        });
      }, { timeout: 6000 });
    }
  }

  function onNavigate() {
    var id = fromHash() || fromDom();
    if (id) loadPack(id);
  }

  d.addEventListener("click", function (ev) {
    var t = ev.target && ev.target.closest && ev.target.closest("a, button, [data-pathway], [data-tab], [data-path]");
    if (!t) return;
    var raw = t.getAttribute("data-pathway") || t.getAttribute("data-tab") || t.getAttribute("data-path") || t.getAttribute("href") || t.textContent;
    var id = normalize(raw);
    if (id) loadPack(id);
  }, true);

  w.addEventListener("hashchange", onNavigate);
  d.addEventListener("clarity-companion-tab-change", onNavigate);

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", bootDefault);
  else bootDefault();

  w.ClarityCompanionLoadPathway = loadPack;
})(window, document);

/* === 9. companion-craft-idle-v1.js === */
/*! companion-craft-idle-v1 · C3 · load meme/craft after idle · educational only */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_CRAFT_IDLE_V1__) return;
  w.__COMPANION_CRAFT_IDLE_V1__ = true;
  var V = "20261108C3";
  var FILES = [
    "/companion/assets/clarity-meme-api-bridge-v1.js",
    "/companion/assets/companion-meme-studio-fix-v1.js"
  ];
  function load(src) {
    if (d.querySelector('script[src*="'+src.split('/').pop().split('?')[0]+'"]')) return;
    var s = d.createElement("script");
    s.src = src + "?v=" + V;
    s.async = true;
    s.setAttribute("data-c3-craft", "1");
    d.body.appendChild(s);
  }
  function run() {
    FILES.forEach(load);
  }
  function schedule() {
    if (typeof w.requestIdleCallback === "function") {
      w.requestIdleCallback(run, { timeout: 8000 });
    } else {
      w.setTimeout(run, 2500);
    }
  }
  /* also load when user opens craft/meme UI */
  d.addEventListener("click", function (ev) {
    var t = ev.target && ev.target.closest && ev.target.closest("[data-craft], [data-meme], .meme-studio, #meme-studio, a[href*='meme'], a[href*='craft']");
    if (t) run();
  }, true);
  if (d.readyState === "complete") schedule();
  else w.addEventListener("load", schedule);
})(window, document);

/* === END companion-boot.js · T-BOOT-01 · Bismillah === */
