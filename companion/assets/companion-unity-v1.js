/*! companion-unity-v1 · one coordinator · shell · banner · meme · no thrash */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_UNITY_V1__) return;
  w.__CLARITY_UNITY_V1__ = true;

  var LOG = (w.__UNITY_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  /* ---------- shell ---------- */
  function lockShell() {
    try {
      localStorage.setItem("clarity_shell_mode_v1", "companion");
      d.documentElement.setAttribute("data-shell-mode", "companion");
      d.documentElement.setAttribute("data-clarity-room", "companion");
      d.documentElement.classList.add("companion-unfrozen");
      w.__CLARITY_SKIP_DAY_LANDING__ = true;
    } catch (e) {}
    ["clarity-day-landing", "clarity-landing-stack", "landing-gate-screen"].forEach(function (id) {
      var el = d.getElementById(id);
      if (el) {
        el.style.setProperty("display", "none", "important");
        el.setAttribute("hidden", "hidden");
      }
    });
    var main = d.getElementById("main-content");
    if (main) {
      main.hidden = false;
      main.removeAttribute("hidden");
      main.style.setProperty("display", "block", "important");
    }
  }

  /* ---------- tabs ---------- */
  var TAB_KEY = "clarity_companion_tab_v1";
  var TABS = {
    reminder: "tab-reminder",
    reality: "tab-reality",
    reflection: "tab-reflection",
    action: "tab-action",
    notes: "tab-notes",
    about: "tab-about"
  };
  function normTab(id) {
    id = String(id || "").toLowerCase().replace(/^#/, "");
    if (id === "journey" || id === "commands") id = "reminder";
    if (id === "tajweed" || id === "meme" || id === "calligraphy" || id === "callig") id = "action";
    return TABS[id] ? id : null;
  }
  function showTab(id, write) {
    id = normTab(id) || "reminder";
    var pid = TABS[id];
    d.querySelectorAll(".tab-panel").forEach(function (p) {
      var on = p.id === pid;
      p.classList.toggle("is-active", on);
      p.classList.toggle("active", on);
      p.setAttribute("aria-hidden", on ? "false" : "true");
    });
    d.querySelectorAll("[data-rail-tab],[data-rrra]").forEach(function (b) {
      var t = (b.getAttribute("data-rail-tab") || b.getAttribute("data-rrra") || "").toLowerCase();
      b.classList.toggle("is-active", t === id);
    });
    if (write !== false) {
      try { localStorage.setItem(TAB_KEY, id); } catch (e) {}
      try {
        if ((w.location.hash || "") !== "#" + id) history.replaceState(null, "", "#" + id);
      } catch (e2) {}
    }
  }
  function initialTab() {
    return normTab((w.location.hash || "").slice(1)) ||
      normTab((function () { try { return localStorage.getItem(TAB_KEY); } catch (e) { return null; } })()) ||
      "reminder";
  }

  /* ---------- banner layout once ---------- */
  var layoutDone = false;
  function layoutBanner() {
    var ov = d.querySelector(".banner-overlay");
    if (!ov) return;
    var left = ov.querySelector(".banner-side.left");
    var center = ov.querySelector(".banner-center");
    var right = ov.querySelector(".banner-side.right");
    var salah = ov.querySelector(".salah-times-section");
    var cal = ov.querySelector(".hijri-cal-section");
    if (salah && right && salah.parentElement !== right) right.appendChild(salah);
    if (cal && left && cal.parentElement !== left) left.appendChild(cal);
    if (left && center && right) {
      ov.appendChild(left);
      ov.appendChild(center);
      ov.appendChild(right);
    }
    layoutDone = true;
    log("banner-layout");
  }

  /* ---------- banner live ---------- */
  var STILL = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/640px-Kaaba_Masjid_Haraam_Makkah.jpg";
  var EMBEDS = {
    madinah: "https://www.youtube-nocookie.com/embed/5RJkL7vLHLs?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1",
    makkah: "https://www.youtube-nocookie.com/embed/NJooZDDcV1E?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1"
  };
  function placeKey() {
    var sel = d.getElementById("live-place-select");
    var v = ((sel && sel.value) || "madinah").toLowerCase();
    return (v.indexOf("makk") >= 0 || v.indexOf("mecca") >= 0) ? "makkah" : "madinah";
  }
  function setLive(on) {
    var ifr = d.getElementById("banner-live");
    var img = d.getElementById("banner-img");
    var btn = d.getElementById("live-haramain-btn");
    var label = d.getElementById("live-haramain-label");
    var key = placeKey();
    if (on) {
      if (ifr) {
        ifr.hidden = false;
        ifr.removeAttribute("hidden");
        ifr.style.display = "block";
        ifr.src = EMBEDS[key] || EMBEDS.madinah;
      }
      if (img) img.style.opacity = "0";
      if (btn) btn.classList.add("is-live", "active");
      if (label) label.textContent = "Live · " + (key === "makkah" ? "Makkah" : "Madinah");
    } else {
      if (ifr) {
        try { ifr.src = ""; } catch (e) {}
        ifr.hidden = true;
        ifr.setAttribute("hidden", "");
        ifr.style.display = "none";
      }
      if (img) {
        if (!img.getAttribute("src")) img.src = STILL;
        img.style.opacity = "1";
        img.style.display = "block";
      }
      if (btn) btn.classList.remove("is-live", "active");
      if (label) label.textContent = "Live";
    }
    log(on ? "live-on" : "live-off");
  }
  w.toggleHaramainLive = function () {
    var ifr = d.getElementById("banner-live");
    var on = ifr && !ifr.hidden && ifr.getAttribute("src");
    setLive(!on);
  };
  w.changeHaramainPlace = function () {
    var ifr = d.getElementById("banner-live");
    var live = ifr && !ifr.hidden && ifr.getAttribute("src");
    if (live) setLive(true);
    else {
      var img = d.getElementById("banner-img");
      if (img && !img.src) img.src = STILL;
    }
  };
  w.toggleLive = w.toggleHaramainLive;

  /* ---------- meme APIs (always present) ---------- */
  var VERSES = [
    { ar: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ", en: "Every soul will taste death.", ref: "Qur'an 3:185" },
    { ar: "وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنفَعُ الْمُؤْمِنِينَ", en: "And remind, for reminder benefits the believers.", ref: "Qur'an 51:55" },
    { ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", en: "Verily, in the remembrance of Allah do hearts find rest.", ref: "Qur'an 13:28" }
  ];
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function status(msg) {
    var el = d.getElementById("meme-fetch-status") || d.getElementById("meme-rrra-status");
    if (el) el.textContent = msg || "";
  }
  function applyVerse(line, bg) {
    if (!line) return;
    var ar = line.ar || "", en = line.en || "", ref = line.ref || "";
    try {
      if (typeof w.clarityMemeFill === "function") w.clarityMemeFill(ar, en, ref);
      else if (typeof w.clarityMemeSetCanvas === "function") w.clarityMemeSetCanvas(ar, en, "", ref);
    } catch (e) {}
    if (bg) w.memeFetchBg && w.memeFetchBg(bg);
    status((ref || "Verse") + " · applied");
  }
  if (typeof w.memeDailyVerse !== "function") {
    w.memeDailyVerse = function () {
      var pack = w.RRRA_PACKS && w.RRRA_PACKS.reminder;
      var line = pack && pack.verses && pack.verses.length ? pick(pack.verses) : pick(VERSES);
      applyVerse(line, "holy");
    };
  }
  /* memeFetchBg — solid online + picsum */
  function loadBgUrl(url) {
    status("Loading…");
    if (typeof w.memeLoadImageFromUrl === "function") {
      try { w.memeLoadImageFromUrl(url, "Could not load"); status("Background ready"); return; } catch (e) {}
    }
    var im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = function () {
      try {
        if (!w.memeState) w.memeState = {};
        w.memeState.img = im;
        if (typeof w.memeDraw === "function") w.memeDraw();
        else if (typeof w.clarityMemeUiSync === "function") w.clarityMemeUiSync();
      } catch (e) {}
      status("Background ready");
    };
    im.onerror = function () { status("Load failed — try another"); };
    im.src = url;
  }
  function picsum(kind) {
    return "https://picsum.photos/seed/clarity-" + kind + "-" + (Date.now() % 10000) + "/1200/900.jpg";
  }
  function installFetchBg() {
    if (typeof w.__memeOnlineFetch === "function") {
      w.memeFetchBg = function (kind) {
        try { return w.__memeOnlineFetch(kind); } catch (e) { loadBgUrl(picsum(kind || "nature")); }
      };
      log("fetchBg=online");
      return;
    }
    w.memeFetchBg = function (kind) {
      kind = kind || "nature";
      loadBgUrl(picsum(kind));
    };
    log("fetchBg=picsum");
  }

  function sizeCanvas() {
    var canvas = d.getElementById("meme-canvas");
    if (!canvas) return;
    if (!canvas.width || canvas.width < 100) {
      canvas.width = 1200;
      canvas.height = 675;
    }
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    log("canvas-ok");
  }

  function loadScript(src, attr) {
    return new Promise(function (resolve) {
      if (d.querySelector('script[src*="' + src.split("?")[0].replace(/"/g, "") + '"]')) return resolve();
      var s = d.createElement("script");
      s.src = src;
      s.async = true;
      if (attr) s.setAttribute(attr, "1");
      s.onload = function () { resolve(); };
      s.onerror = function () { resolve(); };
      d.head.appendChild(s);
    });
  }

  function loadMemeCore() {
    return loadScript("/companion/modules/inline-clarity-meme-canvas-clean-v1.js?v=20261104U", "data-unity")
      .then(function () { return loadScript("/companion/modules/inline-clarity-meme-online-bg-v1.js?v=20261104U", "data-unity"); })
      .then(function () { return loadScript("/companion/modules/inline-bundle-meme-v1.js?v=20261104U", "data-unity"); })
      .then(function () {
        installFetchBg();
        sizeCanvas();
        log("meme-core-ready");
      });
  }

  /* freeze A2 sticky/measure from mutating banner after settle */
  function freezeAfterSpine() {
    layoutBanner();
    installFetchBg();
    sizeCanvas();
    /* neutralize sticky top on duo if A2 set it */
    try {
      var duo = d.getElementById("clarity-top-duo");
      if (duo) {
        duo.style.position = "relative";
        duo.style.top = "auto";
      }
    } catch (e) {}
    log("freeze");
  }

  function wireDoor() {
    var prev = w.clarityOpenSectionDoor;
    w.clarityOpenSectionDoor = function (id) {
      var n = normTab(id);
      if (n) showTab(n, true);
      if (typeof prev === "function") {
        try { return prev.apply(this, arguments); } catch (e) {}
      }
    };
  }

  function boot() {
    lockShell();
    wireDoor();
    showTab(initialTab(), true);
    layoutBanner();
    setLive(false);
    installFetchBg();
    sizeCanvas();
    loadMemeCore();
    log("boot");
    /* ONE settle pass only — not a loop */
    setTimeout(function () {
      lockShell();
      layoutBanner();
      installFetchBg();
      sizeCanvas();
      log("settle");
    }, 700);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();

  w.addEventListener("clarity-a2-spine-ready", function () {
    setTimeout(freezeAfterSpine, 100);
    setTimeout(freezeAfterSpine, 600);
  });

  w.clarityUnity = { layoutBanner: layoutBanner, showTab: showTab, setLive: setLive, log: LOG };
})(window, document);
