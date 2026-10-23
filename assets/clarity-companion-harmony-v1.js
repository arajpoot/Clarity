/**
 * Companion harmony · calendar today · moon · landing CTAs · 20261022HARMONY
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_COMPANION_HARMONY_V1__) return;
  w.__CLARITY_COMPANION_HARMONY_V1__ = "20261022HARMONY";

  function parseHijriDayFromMeta() {
    var meta = document.getElementById("hijri-cal-meta");
    var title = document.getElementById("hijri-cal-title");
    var day = null;
    var month = "";
    var year = "";
    var text = ((meta && meta.textContent) || "") + " " + ((title && title.textContent) || "");
    var m = text.match(/Today:\s*(\d{1,2})\s+([A-Za-zʿʾ'\-]+)/i);
    if (m) {
      day = parseInt(m[1], 10);
      month = m[2];
    }
    if (!day) {
      m = text.match(/(\d{1,2})\s+([A-Za-zʿʾ'\-]+)\s+(\d{3,4})/);
      if (m) {
        day = parseInt(m[1], 10);
        month = m[2];
        year = m[3];
      }
    }
    /* title often "Month Year AH" without day — keep day from meta */
    if (title && day && title.textContent && title.textContent.indexOf(String(day)) < 0) {
      var ty = title.textContent.replace(/\s*AH\s*$/i, "").trim();
      /* If title is "Month Year", prefix day */
      if (/^[A-Za-zʿʾ]/.test(ty)) {
        title.textContent = day + " " + ty + (/\bAH\b/i.test(title.textContent) ? "" : " AH");
      }
    }
    return { day: day, month: month, year: year };
  }

  function highlightToday() {
    var grid = document.getElementById("hijri-cal-grid");
    if (!grid) return;
    var info = parseHijriDayFromMeta();
    var day = info.day;
    if (!day) {
      /* fallback: gregorian day as last resort if grid is hijri numbers only skip */
      return;
    }
    grid.querySelectorAll(".day").forEach(function (el) {
      el.classList.remove("today", "is-today");
      el.removeAttribute("aria-current");
      var n = parseInt((el.textContent || "").trim(), 10);
      if (n === day) {
        el.classList.add("today", "is-today");
        el.setAttribute("aria-current", "date");
      }
    });
    /* sync moon plaque title to calendar day */
    try {
      if (w.clarityMoonPhase && typeof w.clarityMoonPhase.render === "function") {
        w.clarityMoonPhase.render();
      }
      var moon = document.getElementById("clarity-moon-plaque");
      if (moon && info.day) {
        moon.setAttribute(
          "title",
          "Hijri day " + info.day + (info.month ? " · " + info.month : "") + " · moon phase (approx)"
        );
      }
    } catch (e) {}
  }

  function observeCalendar() {
    var grid = document.getElementById("hijri-cal-grid");
    if (!grid) return;
    highlightToday();
    try {
      var obs = new MutationObserver(function () {
        highlightToday();
      });
      obs.observe(grid, { childList: true, subtree: true, characterData: true });
    } catch (e) {}
    setInterval(highlightToday, 15000);
  }

  /** Landing CTAs: leave day surface → main + tab (no scroll-down on landing) */
  function leaveLandingTo(tab, scrollId) {
    var gate = "seeker";
    try {
      var s = JSON.parse(localStorage.getItem("clarity_landing_gate_v1") || "{}") || {};
      if (s.lastGate) gate = s.lastGate;
    } catch (e0) {}
    try {
      if (typeof w.clarityLandingEnterGate === "function") {
        w.clarityLandingEnterGate(gate);
      } else {
        document.documentElement.classList.remove("clarity-landing-active");
        document.documentElement.classList.add("clarity-landing-done", "clarity-main-active");
        if (document.body) {
          document.body.classList.remove("clarity-landing-active");
          document.body.classList.add("clarity-landing-done", "clarity-main-active");
        }
        try {
          var KEY = "clarity_landing_gate_v1";
          var d = new Date();
          var day = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
          var st = JSON.parse(localStorage.getItem(KEY) || "{}") || {};
          st.skipDay = day;
          localStorage.setItem(KEY, JSON.stringify(st));
        } catch (e1) {}
        var doors = document.getElementById("clarity-landing-doors");
        if (doors) doors.style.display = "none";
      }
    } catch (e) {}
    setTimeout(function () {
      try {
        if (typeof w.switchTab === "function") w.switchTab(tab || "reminder", scrollId);
        else if (scrollId) {
          var el = document.getElementById(scrollId);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } catch (e2) {}
    }, 100);
  }

  function wireLandingProvisionCtas() {
    var root = document.getElementById("clarity-provision-home");
    if (!root || root.__harmonyWired) return;
    root.__harmonyWired = true;
    root.addEventListener(
      "click",
      function (ev) {
        var a = ev.target.closest("[data-cph-tab], [data-cph-tonight], .cph-btn, .cph-chip");
        if (!a) return;
        var landing = document.documentElement.classList.contains("clarity-landing-active");
        if (!landing) return;
        var tab = a.getAttribute("data-cph-tab");
        var sid = a.getAttribute("data-cph-scroll");
        if (a.getAttribute("data-cph-tonight")) {
          tab = "notes";
          sid = null;
        }
        if (!tab && a.getAttribute("href")) {
          var h = (a.getAttribute("href") || "").replace(/^#/, "");
          if (["reminder", "reality", "reflection", "action", "notes"].indexOf(h) >= 0) tab = h;
        }
        if (!tab) return;
        ev.preventDefault();
        ev.stopPropagation();
        leaveLandingTo(tab, sid);
      },
      true
    );
  }

  function rebindTajweedNewModule() {
    var btn = document.querySelector("#tajweed-live-card button, button[onclick*='clarityLiveTajweed']");
    document.querySelectorAll("#tajweed-live-card button").forEach(function (b) {
      if ((b.textContent || "").toLowerCase().indexOf("new module") < 0) return;
      if (b.__harmonyNew) return;
      b.__harmonyNew = true;
      b.removeAttribute("onclick");
      b.addEventListener("click", function (ev) {
        ev.preventDefault();
        try {
          if (typeof w.clarityLiveTajweed === "function") w.clarityLiveTajweed(true);
          else if (w.clarityMoonPhase) {
            /* noop */
          }
          var title = document.getElementById("tajweed-live-title");
          var body = document.getElementById("tajweed-live-body");
          var rules = [
            { t: "Izhār (إظهار)", b: "Nūn sākinah or tanwīn before ء ه ع ح غ خ: keep the nūn clear." },
            { t: "Ikhfāʾ (إخفاء)", b: "Hide nūn/tanwīn before the ikhfāʾ letters with light ghunnah." },
            { t: "Idghām (إدغام)", b: "Nūn/tanwīn + ي ن م و: merge with ghunnah where required." },
            { t: "Iqlāb (إقلاب)", b: "Nūn/tanwīn before ب: change to mīm with ghunnah." },
            { t: "Qalqalah (قلقلة)", b: "Bounce ق ط ب ج د when sākin." },
            { t: "Madd ṭabīʿī", b: "Two counts on a long vowel not followed by hamzah or sukūn." },
            { t: "Ghunnah (غُنّة)", b: "Nūn or mīm mushaddadah: two counts nasal." }
          ];
          var i = Math.floor(Math.random() * rules.length);
          if (title) title.textContent = rules[i].t;
          if (body) body.textContent = rules[i].b;
        } catch (e) {}
      });
    });
  }

  function rebindDrill() {
    var go = document.getElementById("cod-go-tajweed");
    if (!go || go.__harmonyDrill) return;
    go.__harmonyDrill = true;
    go.onclick = function (ev) {
      if (ev) ev.preventDefault();
      leaveLandingTo("reminder", "tajweed-live-card");
      setTimeout(function () {
        try {
          if (typeof w.switchTab === "function") w.switchTab("reminder", "tajweed-live-card");
          if (typeof w.clarityLiveTajweed === "function") w.clarityLiveTajweed(false);
        } catch (e) {}
      }, 100);
    };
  }

  function boot() {
    observeCalendar();
    wireLandingProvisionCtas();
    rebindTajweedNewModule();
    rebindDrill();
    setTimeout(rebindTajweedNewModule, 600);
    setTimeout(rebindDrill, 800);
    setTimeout(highlightToday, 1200);
    setTimeout(highlightToday, 3000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(boot, 500);
  });
})(typeof window !== "undefined" ? window : this);
