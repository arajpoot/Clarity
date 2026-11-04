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
