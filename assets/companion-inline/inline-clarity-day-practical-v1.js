/**
 * Clarity Day Landing · practical daily cards
 * Do this today · Adhkār · Today’s routine (path-aware, finishable)
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_DAY_PRACTICAL_V1__) return;
  w.__CLARITY_DAY_PRACTICAL_V1__ = true;

  var KEY_DONE = "clarity_today_done_v1";
  var KEY_STREAK = "clarity_soft_streak_v1";

  function todayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function hour() { return new Date().getHours(); }
  function readJSON(k) {
    try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; }
  }
  function writeJSON(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }
  function isDone(id) {
    var m = readJSON(KEY_DONE) || {};
    return !!(m[todayKey()] && m[todayKey()][id]);
  }
  function markDone(id) {
    var m = readJSON(KEY_DONE) || {};
    var t = todayKey();
    if (!m[t]) m[t] = {};
    m[t][id] = true;
    writeJSON(KEY_DONE, m);
    var s = readJSON(KEY_STREAK) || { days: 0, last: null };
    if (s.last !== t) {
      var y = new Date(); y.setDate(y.getDate() - 1);
      var yk = y.getFullYear() + "-" + (y.getMonth() + 1) + "-" + y.getDate();
      s.days = s.last === yk ? (s.days || 0) + 1 : 1;
      s.last = t;
      writeJSON(KEY_STREAK, s);
    }
  }
  function streak() {
    var s = readJSON(KEY_STREAK) || { days: 0 };
    return s.days || 0;
  }

  // Rotating practical deeds by day-of-year
  var DEEDS = [
    { title: "Next ṣalāh with presence", body: "Pray the next prayer on time. Say Bismillāh before your next ordinary task.", tag: "ṢALĀH" },
    { title: "One right", body: "Settle or note one right: a debt, trust, or apology you still owe.", tag: "RIGHTS" },
    { title: "One āyah", body: "Read or listen to one āyah with its meaning. Presence over volume.", tag: "QUR’AN" },
    { title: "Guard the tongue", body: "One hour without mockery or gossip; replace with istighfār.", tag: "CHARACTER" },
    { title: "Mercy at home", body: "One gentle word or act of service for family today.", tag: "FAMILY" },
    { title: "Quiet ṣadaqah", body: "A small ongoing good: water, teach, or give quietly.", tag: "ṢADAQAH" },
    { title: "Parents / elders", body: "One duʿāʾ or kind check-in for parents or an elder.", tag: "BIRR" }
  ];

  var ADHKAR = [
    { ar: "سُبْحَانَ اللَّهِ", en: "Subḥānallāh — Glory be to Allah", count: 33 },
    { ar: "الْحَمْدُ لِلَّهِ", en: "Alḥamdulillāh — All praise is for Allah", count: 33 },
    { ar: "اللَّهُ أَكْبَرُ", en: "Allāhu akbar — Allah is the Greatest", count: 34 },
    { ar: "أَسْتَغْفِرُ اللَّهَ", en: "Astaghfirullāh — I seek Allah’s forgiveness", count: 10 },
    { ar: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ", en: "Allāhumma ṣalli ʿalā Muḥammad", count: 10 }
  ];

  function dayDeed() {
    var n = Math.floor(Date.now() / 86400000);
    return DEEDS[n % DEEDS.length];
  }
  function dayAdhkar() {
    var h = hour();
    // morning vs evening tilt
    if (h >= 5 && h < 12) return ADHKAR[0];
    if (h >= 12 && h < 17) return ADHKAR[1];
    if (h >= 17 && h < 21) return ADHKAR[2];
    return ADHKAR[3];
  }

  function ensureLandingCards() {
    var land = document.getElementById("clarity-day-landing");
    if (!land) return null;

    // Dual tiles should already exist from arch
    var host = document.getElementById("clarity-practical-daily");
    if (!host) {
      host = document.createElement("div");
      host.id = "clarity-practical-daily";
      host.className = "clarity-practical-daily";
      land.appendChild(host);
    }

    var deed = dayDeed();
    var dh = dayAdhkar();
    var st = streak();
    var night = hour() >= 17 || hour() < 5;

    host.innerHTML =
      '<article class="cdl-card cdl-todo" id="clarity-do-today">' +
        '<div class="cdl-card-head"><h2>Do this today</h2>' +
        '<span class="cdl-pill">' + (night ? "NIGHT" : "DAY") + "</span></div>" +
        '<div class="cdl-tag">' + deed.tag + "</div>" +
        "<h3>" + deed.title + "</h3>" +
        "<p>" + deed.body + "</p>" +
        '<p class="cdl-note">Educational only — not a fatwa. Acceptance is with Allah.</p>' +
        '<div class="cdl-actions">' +
          '<button type="button" class="cdl-btn" data-done="todo">' + (isDone("todo") ? "Done ✓" : "Mark done") + "</button>" +
          '<span class="cdl-streak">Soft streak: ' + st + " day(s)</span>" +
        "</div>" +
      "</article>" +
      '<article class="cdl-card cdl-adhkar" id="clarity-adhkar-card">' +
        "<div class=\"cdl-card-head\"><h2>Adhkār · " + (night ? "evening" : "morning") + "</h2>" +
        '<span class="cdl-count" id="adhkar-count">Count 0 / ' + dh.count + "</span></div>" +
        '<div class="cdl-ar" dir="rtl" lang="ar">' + dh.ar + "</div>" +
        "<p>" + dh.en + "</p>" +
        '<p class="cdl-note">From authentic remembrance — educational only.</p>' +
        '<div class="cdl-actions">' +
          '<button type="button" class="cdl-btn cdl-plus" data-adhkar="+1">+1</button>' +
          '<button type="button" class="cdl-btn" data-adhkar="reset">Reset</button>' +
          '<button type="button" class="cdl-btn" data-done="adhkar">' + (isDone("adhkar") ? "Done ✓" : "Mark done") + "</button>" +
        "</div>" +
      "</article>" +
      '<article class="cdl-card cdl-routine" id="clarity-today-routine">' +
        '<div class="cdl-card-head"><h2>Today’s short routine</h2></div>' +
        "<p>Three finishable steps — pick what fits your path today.</p>" +
        '<ul class="cdl-steps">' +
          "<li><strong>1.</strong> Presence in the next ṣalāh (or make-up intention).</li>" +
          "<li><strong>2.</strong> One āyah or one authentic dhikr count above.</li>" +
          "<li><strong>3.</strong> One right, kind word, or quiet ṣadaqah.</li>" +
        "</ul>" +
        '<div class="cdl-actions">' +
          '<button type="button" class="cdl-btn" data-done="routine">' + (isDone("routine") ? "Done ✓" : "Mark routine done") + "</button>" +
          '<button type="button" class="cdl-btn cdl-ghost" data-go="companion">Open Companion path</button>' +
        "</div>" +
      "</article>";

    var count = 0;
    host.onclick = function (ev) {
      var t = ev.target && ev.target.closest && ev.target.closest("[data-done], [data-adhkar], [data-go]");
      if (!t) return;
      if (t.getAttribute("data-go") === "companion") {
        if (w.ClarityShell) w.ClarityShell.setMode("companion");
        return;
      }
      if (t.hasAttribute("data-adhkar")) {
        var act = t.getAttribute("data-adhkar");
        if (act === "+1") count = Math.min(count + 1, dh.count);
        if (act === "reset") count = 0;
        var el = document.getElementById("adhkar-count");
        if (el) el.textContent = "Count " + count + " / " + dh.count;
        if (count >= dh.count) markDone("adhkar");
        return;
      }
      var id = t.getAttribute("data-done");
      if (id) {
        markDone(id);
        t.textContent = "Done ✓";
        var stEl = host.querySelector(".cdl-streak");
        if (stEl) stEl.textContent = "Soft streak: " + streak() + " day(s)";
      }
    };
    return host;
  }

  // Replace long phase curriculum host with a compact "Path ladder" link only
  function slimPhases() {
    var host = document.getElementById("clarity-daily-routines");
    if (!host) return;
    // Replace heavy curriculum with compact summary + open companion
    host.innerHTML =
      '<div class="cdr-head"><h2>Deep learning path</h2>' +
      '<p class="cdr-sub">The full Seeker → New Muslim → Daily → Daʿī ladder lives on the Companion path. Landing stays for today’s return.</p></div>' +
      '<div class="cdr-compact">' +
        '<button type="button" class="cdl-btn" data-open-companion>Open Companion · path doors</button>' +
        '<span class="cdr-hint">Phase cards & tools open there — keeps this page light.</span>' +
      "</div>";
    host.onclick = function (ev) {
      if (ev.target && ev.target.closest && ev.target.closest("[data-open-companion]")) {
        if (w.ClarityShell) w.ClarityShell.setMode("companion");
      }
    };
  }

  function boot() {
    ensureLandingCards();
    // Prefer practical landing; slim long phase dump if present
    setTimeout(function () {
      ensureLandingCards();
      if (document.getElementById("clarity-daily-routines")) slimPhases();
    }, 400);
    setTimeout(ensureLandingCards, 1200);
    setTimeout(slimPhases, 600);
    setTimeout(slimPhases, 1500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", function () { setTimeout(boot, 300); });

  // Re-render when shell becomes landing
  try {
    var obs = new MutationObserver(function () {
      if (document.documentElement.getAttribute("data-shell-mode") === "landing") {
        ensureLandingCards();
        slimPhases();
      }
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-shell-mode"] });
  } catch (e) {}

  w.ClarityDayPractical = { render: ensureLandingCards, version: "20261024DAY" };
})(typeof window !== "undefined" ? window : this);
