/**
 * Clarity Day Room v1 · 20261027ROOM1
 * Vault-pattern: fills static #clarity-day-landing-room slots once.
 * Does not own shell door — ClarityShell does.
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_DAY_ROOM_V1__) return;
  w.__CLARITY_DAY_ROOM_V1__ = true;

  var FILLED = false;

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function injectCss() {
    if (document.getElementById("clarity-day-room-css")) return;
    var s = document.createElement("style");
    s.id = "clarity-day-room-css";
    s.textContent = [
      "#clarity-day-landing-room.clarity-room-day{",
      "  width:100%;max-width:100%;box-sizing:border-box;margin:0;padding:0.5rem 0.75rem 1.25rem;}",
      "#clarity-day-landing-room .day-room-inner{",
      "  width:100%;max-width:min(48rem,100%);margin:0 auto;box-sizing:border-box;}",
      "#clarity-day-landing-room .day-room-slot{margin:0.55rem 0;}",
      "#clarity-day-landing-room .day-dual{",
      "  display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;}",
      "#clarity-day-landing-room .day-dual a{",
      "  display:block;padding:0.75rem 0.85rem;border-radius:14px;text-decoration:none;color:inherit;",
      "  border:1px solid rgba(15,76,58,0.22);background:rgba(15,76,58,0.06);}",
      "html[data-theme=dark] #clarity-day-landing-room .day-dual a,",
      "html[data-theme=night] #clarity-day-landing-room .day-dual a{",
      "  border-color:rgba(212,180,90,0.28);background:rgba(12,28,22,0.75);}",
      "#clarity-day-landing-room .day-dual strong{display:block;font-size:0.95rem;}",
      "#clarity-day-landing-room .day-dual small{display:block;opacity:0.8;font-size:0.75rem;margin-top:0.2rem;}",
      "#clarity-day-landing-room .day-verse{",
      "  padding:0.9rem 1rem;border-radius:16px;border:1px solid rgba(15,76,58,0.2);}",
      "#clarity-day-landing-room .day-verse .df-ar{font-size:1.15rem;line-height:1.9;text-align:right;}",
      "#clarity-day-landing-room .day-verse .df-en{margin:0.4rem 0;}",
      "#clarity-day-landing-room .day-verse .df-ref{font-size:0.8rem;opacity:0.85;}",
      "#clarity-day-landing-room .day-pulse{",
      "  display:grid;gap:0.5rem;grid-template-columns:1fr;}",
      "@media(min-width:640px){#clarity-day-landing-room .day-pulse{grid-template-columns:1fr 1fr 1fr;}}",
      "#clarity-day-landing-room .day-pulse .tile{",
      "  padding:0.7rem 0.8rem;border-radius:14px;border:1px solid rgba(15,76,58,0.18);}",
      "#clarity-day-landing-room .day-card{",
      "  padding:0.75rem 0.9rem;border-radius:14px;border:1px solid rgba(15,76,58,0.16);margin:0.45rem 0;}",
      "#clarity-day-landing-room .day-card h2{font-size:1rem;margin:0 0 0.35rem;}",
      "#clarity-day-landing-room .day-card p{margin:0.25rem 0;font-size:0.88rem;opacity:0.92;}",
      'html[data-shell-mode="landing"] #clarity-day-landing-room{display:block!important;}',
      'html[data-shell-mode="companion"] #clarity-day-landing-room{display:none!important;}'
    ].join("");
    document.head.appendChild(s);
  }

  function fillPaths(slot) {
    if (!slot || slot.getAttribute("data-filled") === "1") return;
    slot.innerHTML =
      '<div class="day-dual" role="navigation" aria-label="Choose a path">' +
        '<a href="#main-content" id="day-path-companion">' +
          "<strong>Companion path</strong>" +
          "<small>Reminder · Reality · Reflection · Action</small></a>" +
        '<a href="/campus/" id="day-path-university" target="_blank" rel="noopener">' +
          "<strong>University path</strong>" +
          "<small>Campus desk · educational</small></a>" +
      "</div>";
    slot.setAttribute("data-filled", "1");
    var a = document.getElementById("day-path-companion");
    if (a && !a.__dayWired) {
      a.__dayWired = true;
      a.addEventListener("click", function (ev) {
        ev.preventDefault();
        try {
          if (w.ClarityShell && w.ClarityShell.setMode) w.ClarityShell.setMode("companion");
        } catch (e) {}
      });
    }
  }

  function fillVerse(slot) {
    if (!slot || slot.getAttribute("data-filled") === "1") return;
    slot.innerHTML =
      '<div class="day-verse" id="clarity-day-first-strip">' +
        '<p class="df-label" style="font-size:0.72rem;font-weight:800;letter-spacing:0.04em;text-transform:uppercase;opacity:0.75">Today · Day landing</p>' +
        '<p class="df-ar" lang="ar" dir="rtl">يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ</p>' +
        '<p class="df-en">O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.</p>' +
        '<p class="df-ref"><a href="https://quran.com/2/153" target="_blank" rel="noopener">Qurʾān 2:153</a> · Sahih International · educational only</p>' +
      "</div>";
    slot.setAttribute("data-filled", "1");
  }

  function fillPulse(slot) {
    if (!slot || slot.getAttribute("data-filled") === "1") return;
    slot.innerHTML =
      '<div class="day-pulse" role="region" aria-label="Today at a glance">' +
        '<div class="tile"><strong>Next ṣalāh</strong><p id="day-pulse-salah">See banner schedule</p></div>' +
        '<div class="tile"><strong>One deed</strong><p>Pray the next ṣalāh with presence — a light you send ahead.</p></div>' +
        '<div class="tile"><strong>Tasbeeh</strong><p>Soft count on this device · use Companion tools when ready.</p></div>' +
      "</div>";
    slot.setAttribute("data-filled", "1");
    try {
      var raw = localStorage.getItem("clarity_banner_salah_v1");
      if (raw) {
        var c = JSON.parse(raw);
        if (c && c.timings) {
          var names = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
          var now = new Date();
          var mins = now.getHours() * 60 + now.getMinutes();
          function toM(t) {
            var p = String(t).split(" ")[0].split(":");
            return (+p[0]) * 60 + (+p[1] || 0);
          }
          for (var i = 0; i < names.length; i++) {
            if (c.timings[names[i]] && toM(c.timings[names[i]]) > mins) {
              var el = document.getElementById("day-pulse-salah");
              if (el) el.textContent = names[i] + " · see banner";
              break;
            }
          }
        }
      }
    } catch (e) {}
  }

  function fillAdhkar(slot) {
    if (!slot || slot.getAttribute("data-filled") === "1") return;
    var evening = true;
    try {
      evening = new Date().getHours() >= 12;
    } catch (e) {}
    var title = evening ? "Adhkār · evening window" : "Adhkār · morning window";
    var ar = evening
      ? "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ"
      : "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ";
    var en = evening
      ? "We have entered the evening and the dominion belongs to Allah, Lord of the worlds."
      : "We have entered the morning and the dominion belongs to Allah, Lord of the worlds.";
    slot.innerHTML =
      '<div class="day-card" role="region" aria-label="Adhkar">' +
        "<h2>" + title + "</h2>" +
        '<p class="df-ar" lang="ar" dir="rtl">' + ar + "</p>" +
        "<p>" + en + "</p>" +
        "<p style=\"font-size:0.8rem;opacity:0.8\">Abū Dāwūd 5084 · educational · verify wording with a teacher</p>" +
      "</div>";
    slot.setAttribute("data-filled", "1");
  }

  function fillReminders(slot) {
    if (!slot || slot.getAttribute("data-filled") === "1") return;
    slot.innerHTML =
      '<div class="day-card"><h2>🕯️ Remember the long stay</h2>' +
        "<p>Family and wealth turn back at the grave; <strong>deeds stay with you</strong>. Educational reminder · not a fatwa.</p></div>" +
      '<div class="day-card"><h2>🌱 Reward that may continue</h2>' +
        "<p>Ongoing charity, beneficial knowledge, and a child who prays for you. Muslim 1631 · educational · verify with a scholar.</p></div>" +
      '<div class="day-card"><h2>🛡️ Core protection set</h2>' +
        "<p>When ready: Āyat al-Kursī, the three Quls, Sayyid al-istighfār — learn full wording with a teacher.</p></div>";
    slot.setAttribute("data-filled", "1");
  }

  function fill() {
    injectCss();
    var room = document.getElementById("clarity-day-landing-room");
    if (!room) return;
    fillPaths($('[data-day-slot="paths"]', room));
    fillVerse($('[data-day-slot="verse"]', room));
    fillPulse($('[data-day-slot="pulse"]', room));
    fillAdhkar($('[data-day-slot="adhkar"]', room));
    fillReminders($('[data-day-slot="reminders"]', room));
    /* dayn slot left empty for dayn-ledger to mount into #clarity-landing-slot-dayn */
    FILLED = true;
    try {
      document.dispatchEvent(new CustomEvent("clarity:day-room-ready"));
    } catch (e) {}
  }

  function boot() {
    fill();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 30); });
  } else setTimeout(boot, 30);
  w.addEventListener("load", function () {
    if (!FILLED) boot();
  });

  w.ClarityDayRoom = { fill: fill };
})(typeof window !== "undefined" ? window : this);
