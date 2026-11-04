/*! companion-ai-maintainer-v1 · auto-detect + safe repair
 * Companion room only. Campus / daily / amana untouched.
 * Educational tool — not a fatwa agent.
 *
 * Watches for: missing core, tab wiring, banner stills/live, craft stubs,
 * path strip, shell freeze, console-level recoverable faults.
 * Applies idempotent repairs; logs to window.__CLARITY_AI_MAINT__.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_AI_MAINTAINER_V1__) return;
  w.__CLARITY_AI_MAINTAINER_V1__ = true;

  var LOG = (w.__CLARITY_AI_MAINT__ = w.__CLARITY_AI_MAINT__ || []);
  function log(msg, detail) {
    var row = { t: Date.now(), msg: String(msg), detail: detail || null };
    try { LOG.push(row); } catch (e) {}
    try { if (w.console && console.info) console.info("[Clarity AI Maint]", msg, detail || ""); } catch (e2) {}
  }

  function roomOk() {
    try {
      var p = (w.location && w.location.pathname) || "";
      if (p.indexOf("/campus") === 0 || p.indexOf("/amana") === 0 || p.indexOf("/daily") === 0) return false;
      return p.indexOf("/companion") === 0;
    } catch (e) { return false; }
  }
  if (!roomOk()) return;

  var CORE_ABS = "/assets/clarity-core-block-8.js";
  var CORE_VER = "20261104AIM";
  var MAX_REPAIRS_PER_PULSE = 6;
  var pulseCount = 0;

  function $(id) { return d.getElementById(id); }

  /* ── detectors ── */
  function detect() {
    var issues = [];
    if (!w.__CLARITY_CORE_ABS_LOADED__ && !d.querySelector('script[data-clarity-core-abs="1"]')) {
      issues.push({ id: "core_missing", severity: 1 });
    }
    if (typeof w.switchTab !== "function") {
      issues.push({ id: "switchTab_missing", severity: 1 });
    }
    if (typeof w.claritySetThemeMode !== "function") {
      issues.push({ id: "theme_missing", severity: 2 });
    }
    if (typeof w.toggleHaramainLive !== "function") {
      issues.push({ id: "banner_live_missing", severity: 2 });
    }
    var img = $("banner-img");
    if (img && (!img.getAttribute("src") || /about:blank/i.test(img.src || ""))) {
      issues.push({ id: "banner_still_broken", severity: 2 });
    }
    if (!$("tab-reminder") && !d.querySelector(".tab-panel")) {
      issues.push({ id: "tabs_missing_dom", severity: 1 });
    }
    var panels = d.querySelectorAll(".tab-panel");
    var anyVisible = false;
    panels.forEach(function (p) {
      if (p.classList.contains("active") || (p.style && p.style.display !== "none" && !p.hidden)) anyVisible = true;
    });
    if (panels.length && !anyVisible) {
      issues.push({ id: "no_tab_visible", severity: 1 });
    }
    if (typeof w.memeFetchBg !== "function" || typeof w.memeFetchRrra !== "function") {
      issues.push({ id: "craft_stubs_missing", severity: 3 });
    }
    try {
      if (d.body && (d.body.style.overflow === "hidden" || d.documentElement.style.overflow === "hidden")) {
        /* only flag if scroll locked without modal */
        if (!d.querySelector(".modal.open, .cpq-card, [aria-modal='true']:not([hidden])")) {
          issues.push({ id: "scroll_locked", severity: 2 });
        }
      }
    } catch (e) {}
    return issues;
  }

  /* ── repairs ── */
  var REPAIR = {
    core_missing: function () {
      if (d.querySelector('script[data-clarity-core-abs="1"]')) {
        w.__CLARITY_CORE_ABS_LOADED__ = true;
        return true;
      }
      var s = d.createElement("script");
      s.src = CORE_ABS + "?v=" + CORE_VER;
      s.async = false;
      s.setAttribute("data-clarity-core-abs", "1");
      s.onload = function () {
        w.__CLARITY_CORE_ABS_LOADED__ = true;
        try { d.dispatchEvent(new CustomEvent("clarity-core-ready")); } catch (e) {}
        log("repaired core_missing");
      };
      d.head.appendChild(s);
      return true;
    },
    switchTab_missing: function () {
      w.switchTab = function (id) {
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
      };
      log("repaired switchTab_missing");
      return true;
    },
    theme_missing: function () {
      w.claritySetThemeMode = function (mode) {
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
      };
      log("repaired theme_missing");
      return true;
    },
    banner_live_missing: function () {
      var STILLS = {
        makkah: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/640px-Kaaba_Masjid_Haraam_Makkah.jpg",
        madinah: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Al-Masjid_an-Nabawi_as-from_top.jpg/640px-Al-Masjid_an-Nabawi_as-from_top.jpg"
      };
      var PLACES = {
        madinah: "https://www.youtube-nocookie.com/embed/5RJkL7vLHLs?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1",
        makkah: "https://www.youtube-nocookie.com/embed/NJooZDDcV1E?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1"
      };
      function placeKey() {
        var sel = $("live-place-select");
        var v = ((sel && sel.value) || "madinah").toLowerCase();
        return (v.indexOf("makk") >= 0) ? "makkah" : "madinah";
      }
      w.toggleHaramainLive = function () {
        var ifr = $("banner-live");
        var media = $("banner-media");
        var live = ifr && !ifr.hidden && ifr.src && ifr.src.indexOf("youtube") >= 0;
        if (!live) {
          if (ifr) {
            ifr.hidden = false;
            ifr.removeAttribute("hidden");
            ifr.src = PLACES[placeKey()];
          }
          if (media) media.classList.add("live-active");
        } else {
          if (ifr) { ifr.hidden = true; ifr.src = "about:blank"; }
          if (media) media.classList.remove("live-active");
          var img = $("banner-img");
          if (img) img.src = STILLS[placeKey()];
        }
      };
      w.toggleLive = w.toggleHaramainLive;
      log("repaired banner_live_missing");
      return true;
    },
    banner_still_broken: function () {
      var img = $("banner-img");
      if (!img) return false;
      img.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/640px-Kaaba_Masjid_Haraam_Makkah.jpg";
      img.style.display = "block";
      img.removeAttribute("hidden");
      log("repaired banner_still_broken");
      return true;
    },
    no_tab_visible: function () {
      if (typeof w.switchTab === "function") w.switchTab("reminder");
      else {
        var t = $("tab-reminder");
        if (t) {
          t.hidden = false;
          t.style.display = "block";
          t.classList.add("active");
        }
      }
      log("repaired no_tab_visible");
      return true;
    },
    tabs_missing_dom: function () {
      log("tabs_missing_dom — cannot invent DOM; skip");
      return false;
    },
    craft_stubs_missing: function () {
      if (typeof w.memeFetchBg !== "function") {
        w.memeFetchBg = function (kind) {
          return Promise.resolve("https://picsum.photos/seed/c-" + (kind || "nature") + "/1200/900.jpg");
        };
      }
      if (typeof w.memeFetchRrra !== "function") {
        w.memeFetchRrra = function () { return Promise.resolve(null); };
      }
      if (typeof w.memeDailyVerse !== "function") {
        w.memeDailyVerse = function () {};
      }
      log("repaired craft_stubs_missing");
      return true;
    },
    scroll_locked: function () {
      try {
        d.documentElement.style.removeProperty("overflow");
        d.body.style.removeProperty("overflow");
        d.body.style.setProperty("overflow-y", "auto", "important");
        log("repaired scroll_locked");
        return true;
      } catch (e) { return false; }
    }
  };

  function repairAll(issues) {
    var n = 0;
    issues.sort(function (a, b) { return a.severity - b.severity; });
    for (var i = 0; i < issues.length && n < MAX_REPAIRS_PER_PULSE; i++) {
      var issue = issues[i];
      var fn = REPAIR[issue.id];
      if (!fn) continue;
      try {
        if (fn()) n++;
      } catch (e) {
        log("repair_fail", issue.id + " " + e);
      }
    }
    return n;
  }

  function pulse() {
    if (!roomOk()) return;
    pulseCount++;
    var issues = detect();
    if (!issues.length) {
      if (pulseCount <= 3 || pulseCount % 10 === 0) log("healthy", "pulse " + pulseCount);
      return;
    }
    log("issues", issues.map(function (x) { return x.id; }).join(","));
    var fixed = repairAll(issues);
    log("repaired_count", fixed);
  }

  /* Public API */
  w.ClarityAIMaintainer = {
    pulse: pulse,
    detect: detect,
    log: function () { return LOG.slice(); },
    status: function () {
      return { pulses: pulseCount, last: LOG[LOG.length - 1] || null, issues: detect() };
    }
  };

  function boot() {
    log("boot", "companion AI maintainer");
    pulse();
    setTimeout(pulse, 800);
    setTimeout(pulse, 2500);
    setInterval(pulse, 12000);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 100); });
  else setTimeout(boot, 100);
  w.addEventListener("load", function () { setTimeout(pulse, 400); });
  d.addEventListener("clarity-core-ready", function () { setTimeout(pulse, 200); });
  d.addEventListener("clarity-a2-spine-ready", function () { setTimeout(pulse, 200); });

  /* Soft trap: recoverable errors that mention known globals */
  try {
    w.addEventListener("error", function (ev) {
      var msg = (ev && ev.message) || "";
      if (/switchTab|claritySetThemeMode|toggleHaramainLive|memeFetch/i.test(msg)) {
        log("window_error_hint", msg);
        setTimeout(pulse, 50);
      }
    });
  } catch (e) {}
})(window, document);
