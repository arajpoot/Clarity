/**
 * Clarity Day Landing v3 — single source of truth
 * One paint: dual paths · Do this today · Adhkār
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_LANDING_V3__) return;
  w.__CLARITY_LANDING_V3__ = true;

  var KEY_PROV = "clarity_provision_day_v1";
  var KEY_TAS = "clarity_cph_tasbeeh_v1";
  var KEY_DONE = "clarity_today_done_v1";
  var KEY_STREAK = "clarity_soft_streak_v1";

  var PROVISIONS = [
    { lane: "ṣalāh", text: "Pray the next ṣalāh on time with presence; say Bismillāh before your next ordinary task." },
    { lane: "rights", text: "Settle or note one right: a debt, a trust, or an apology you still owe." },
    { lane: "knowledge", text: "Learn or share one beneficial sentence from Qur’ān or Sunnah with sincerity." },
    { lane: "character", text: "Guard the tongue for one hour: no mockery, no gossip; replace with istighfār." },
    { lane: "duʿāʾ", text: "Make duʿāʾ for your parents or a deceased relative; ask Allah to make you a source of ongoing good." },
    { lane: "jariyah", text: "Do one small ongoing good: teach something useful, water a plant, or give a quiet ṣadaqah." },
    { lane: "family", text: "One gentle word or act of service for family today." }
  ];

  var ADHKAR = {
    morning: [
      { ar: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
        en: "O Allah, by You we enter the morning and by You the evening, by You we live and die, and to You is the resurrection.",
        ref: "Tirmidhī 3391 · educational", target: 1 },
      { ar: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        en: "In the name of Allah, with whose name nothing on earth or in the heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
        ref: "Abū Dāwūd 5088 · educational", target: 3 }
    ],
    evening: [
      { ar: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
        en: "O Allah, by You we enter the evening and by You the morning, by You we live and die, and to You is the return.",
        ref: "Tirmidhī 3391 · educational", target: 1 },
      { ar: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        en: "I seek refuge in the perfect words of Allah from the evil of what He created.",
        ref: "Muslim 2708 · educational", target: 3 },
      { ar: "اللَّهُ أَكْبَرُ", en: "Allāhu akbar — Allah is the Greatest", ref: "Authentic remembrance · educational", target: 34 }
    ]
  };

  function todayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function readJSON(k) {
    try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; }
  }
  function writeJSON(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }
  function hash(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i) | 0;
    return h;
  }
  function isEvening() {
    var h = new Date().getHours();
    return h >= 17 || h < 5;
  }
  function dayPeriod() {
    var h = new Date().getHours();
    if (h >= 5 && h < 12) return "MORNING";
    if (h >= 12 && h < 17) return "DAY";
    return "NIGHT";
  }
  function todayProvision() {
    var n = Math.abs(hash(todayKey() + "prov"));
    return PROVISIONS[n % PROVISIONS.length];
  }
  function tasState() {
    var s = readJSON(KEY_TAS) || { day: null, count: 0 };
    if (s.day !== todayKey()) { s = { day: todayKey(), count: 0 }; writeJSON(KEY_TAS, s); }
    return s;
  }
  function streak() {
    var s = readJSON(KEY_STREAK) || { days: 0, last: null };
    return s.days || 0;
  }
  function bumpStreak() {
    var s = readJSON(KEY_STREAK) || { days: 0, last: null };
    var t = todayKey();
    if (s.last === t) return s.days;
    var y = new Date(); y.setDate(y.getDate() - 1);
    var yk = y.getFullYear() + "-" + (y.getMonth() + 1) + "-" + y.getDate();
    s.days = s.last === yk ? (s.days || 0) + 1 : 1;
    s.last = t;
    writeJSON(KEY_STREAK, s);
    return s.days;
  }

  function placeAfterBanner(el) {
    var visit = document.getElementById("clarity-visit-pill-bar");
    var bar = document.getElementById("clarity-reopen-bar");
    var duo = document.getElementById("clarity-top-duo");
    var host = null;
    var before = null;
    if (bar && bar.parentNode) {
      host = bar.parentNode;
      before = bar.nextSibling;
    } else if (visit && visit.parentNode) {
      host = visit.parentNode;
      before = visit.nextSibling;
    } else if (duo && duo.parentNode) {
      host = duo.parentNode;
      before = duo.nextSibling;
    } else {
      host = document.body;
    }
    if (before) host.insertBefore(el, before);
    else host.appendChild(el);
  }

  function build() {
    if (w.__CDL_V3_BUILT__ && !w.__CDL_V3_FORCE__) return;
    w.__CDL_V3_FORCE__ = false;
    // Remove any prior incomplete landings
    document.querySelectorAll("#clarity-day-landing").forEach(function (el) { el.remove(); });

    var prov = todayProvision();
    var tas = tasState();
    var pack = isEvening() ? ADHKAR.evening : ADHKAR.morning;
    var dh = pack[Math.abs(hash(todayKey() + "dh")) % pack.length];

    var wrap = document.createElement("section");
    wrap.id = "clarity-day-landing";
    wrap.setAttribute("aria-label", "Daily routines landing");
    wrap.innerHTML =
      '<div class="dual-tiles" role="navigation" aria-label="Paths">' +
        '<a class="dual-tile" href="#main-content" id="dual-path-companion">' +
          '<span class="dual-ico" aria-hidden="true">🏠</span>' +
          "<strong>Companion path</strong>" +
          "<small>Reminder · Reality · Reflection · Action · tools on this page</small></a>" +
        '<a class="dual-tile" href="https://clarity-dawah.fyi/campus/" id="dual-path-university" target="_blank" rel="noopener">' +
          '<span class="dual-ico" aria-hidden="true">🎓</span>' +
          "<strong>University path</strong>" +
          "<small>Four colleges · phase desk · Faculty · on Campus</small></a>" +
      "</div>" +
      '<article class="cdl-card" id="cdl-today">' +
        '<div class="cdl-head"><h2>Do this today</h2><span class="cdl-period">' + dayPeriod() + "</span></div>" +
        '<div class="cdl-row">' +
          '<span class="cdl-salah">🕌 Next ṣalāh · see banner</span>' +
          '<span class="cdl-tas">📿 <strong id="cdl-tas-count">' + (tas.count || 0) + "</strong> " +
            '<button type="button" id="cdl-tas-inc" class="cdl-mini">+1</button> ' +
            '<button type="button" id="cdl-tas-reset" class="cdl-mini">↺</button></span>' +
        "</div>" +
        '<div class="cdl-lane">' + (prov.lane || "") + "</div>" +
        '<p class="cdl-deed">' + prov.text + "</p>" +
        '<p class="cdl-note">Educational only — not a fatwa. Acceptance is with Allah.</p>' +
        '<div class="cdl-actions">' +
          '<button type="button" class="cdl-btn" id="cdl-todo-done">Mark done</button>' +
          '<span class="cdl-streak" id="cdl-streak">Soft streak: ' + streak() + " day(s)</span>" +
        "</div>" +
      "</article>" +
      '<article class="cdl-card" id="cdl-adhkar">' +
        '<div class="cdl-head"><h2>Adhkār · ' + (isEvening() ? "evening" : "morning") + "</h2>" +
          '<button type="button" class="cdl-count-btn" id="cdl-adhkar-count">Count 0 / ' + dh.target + "</button></div>" +
        '<p class="cdl-adhkar-ar" dir="rtl" lang="ar">' + dh.ar + "</p>" +
        '<p class="cdl-adhkar-en">' + dh.en + "</p>" +
        '<p class="cdl-adhkar-ref">' + dh.ref + "</p>" +
        '<div class="cdl-actions">' +
          '<button type="button" class="cdl-btn cdl-plus" id="cdl-adhkar-plus">+1</button>' +
          '<button type="button" class="cdl-btn" id="cdl-adhkar-reset">Reset</button>' +
        "</div>" +
      "</article>";

    placeAfterBanner(wrap);
    w.__CDL_V3_BUILT__ = true;

    // Bind once
    var adhCount = 0;
    var plus = document.getElementById("cdl-adhkar-plus");
    var reset = document.getElementById("cdl-adhkar-reset");
    var countBtn = document.getElementById("cdl-adhkar-count");
    if (plus) plus.onclick = function () {
      adhCount = Math.min(adhCount + 1, dh.target);
      if (countBtn) countBtn.textContent = adhCount >= dh.target ? ("Done ✓ · " + adhCount) : ("Count " + adhCount + " / " + dh.target);
    };
    if (reset) reset.onclick = function () {
      adhCount = 0;
      if (countBtn) countBtn.textContent = "Count 0 / " + dh.target;
    };
    if (countBtn) countBtn.onclick = function () {
      adhCount = Math.min(adhCount + 1, dh.target);
      this.textContent = adhCount >= dh.target ? ("Done ✓ · " + adhCount) : ("Count " + adhCount + " / " + dh.target);
    };

    var inc = document.getElementById("cdl-tas-inc");
    var tres = document.getElementById("cdl-tas-reset");
    if (inc) inc.onclick = function () {
      var s = tasState();
      s.count = (s.count || 0) + 1;
      writeJSON(KEY_TAS, s);
      var el = document.getElementById("cdl-tas-count");
      if (el) el.textContent = s.count;
    };
    if (tres) tres.onclick = function () {
      writeJSON(KEY_TAS, { day: todayKey(), count: 0 });
      var el = document.getElementById("cdl-tas-count");
      if (el) el.textContent = "0";
    };

    var done = document.getElementById("cdl-todo-done");
    if (done) done.onclick = function () {
      this.textContent = "Done ✓";
      var st = bumpStreak();
      var el = document.getElementById("cdl-streak");
      if (el) el.textContent = "Soft streak: " + st + " day(s)";
    };

    var comp = document.getElementById("dual-path-companion");
    if (comp) {
      comp.addEventListener("click", function (ev) {
        ev.preventDefault();
        if (w.ClarityShell) w.ClarityShell.setMode("companion");
        else if (typeof w.ClarityLoadCompanion === "function") {
          w.ClarityLoadCompanion().then(function(){
            document.documentElement.setAttribute("data-shell-mode", "companion");
            try { localStorage.setItem("clarity_shell_mode_v1", "companion"); } catch(e){}
          });
        }
      });
    }

    // Sync shell visibility
    if (w.ClarityShell && typeof w.ClarityShell.apply === "function") w.ClarityShell.apply();
  }

  function boot() {
    try { build(); } catch (e) { console.warn("[landing-v3]", e); w.__CDL_V3_BUILT__ = false; }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 60); });
  else setTimeout(boot, 60);
  window.addEventListener("load", function () {
    if (!w.__CDL_V3_BUILT__) setTimeout(boot, 80);
  });
w.ClarityLandingRebuild = function () {
    w.__CDL_V3_BUILT__ = false;
    w.__CDL_V3_FORCE__ = true;
    try { build(); } catch (e) { console.warn("[landing-rebuild]", e); w.__CDL_V3_BUILT__ = false; }
  };
})(typeof window !== "undefined" ? window : this);

