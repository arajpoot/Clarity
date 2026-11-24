/*! companion-nav-polish-v1 · rail active + tab adhkar · educational only */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_NAV_POLISH_V1__) return;
  w.__COMPANION_NAV_POLISH_V1__ = true;

  /* Short authentic-cited lines — educational packs with refs */
  var ADHKAR = {
    reminder: {
      ar: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
      en: "Glory be to Allah and His is the praise.",
      ref: "Bukhari & Muslim — educational wording"
    },
    reality: {
      ar: "اللَّهُمَّ أَرِنِي الْحَقَّ حَقًّا",
      en: "O Allah, show me truth as truth (and grant following it).",
      ref: "Educational duʿāʾ theme — verify full wording with a teacher"
    },
    reflection: {
      ar: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ",
      en: "O Turner of hearts, make my heart firm upon Your religion.",
      ref: "Tirmidhi — educational"
    },
    action: {
      ar: "وَقُلِ اعْمَلُوا فَسَيَرَى اللَّهُ عَمَلَكُمْ",
      en: "Say: Work, for Allah will see your deeds.",
      ref: "Qur'an 9:105"
    },
    notes: {
      ar: "رَبِّ زِدْنِي عِلْمًا",
      en: "My Lord, increase me in knowledge.",
      ref: "Qur'an 20:114"
    },
    about: {
      ar: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      en: "All praise is for Allah, Lord of the worlds.",
      ref: "Qur'an 1:2"
    }
  };

  function setAdhkar(tab) {
    var pack = ADHKAR[tab] || ADHKAR.reminder;
    var root = d.getElementById("cs-tab-adhkar");
    if (!root) return;
    var ar = d.getElementById("cs-tab-adhkar-ar");
    var en = d.getElementById("cs-tab-adhkar-en");
    var ref = d.getElementById("cs-tab-adhkar-ref");
    var kick = d.getElementById("cs-tab-adhkar-kicker");
    if (ar) ar.textContent = pack.ar;
    if (en) en.textContent = pack.en;
    if (ref) ref.textContent = pack.ref;
    if (kick) kick.textContent = "Adhkār · " + tab;
    root.hidden = false;
  }

  function setActive(tab) {
    d.querySelectorAll(".cs-door .cs-door-btn").forEach(function (btn) {
      var t = btn.getAttribute("data-rail-tab");
      if (t === tab) {
        btn.classList.add("is-active");
        btn.setAttribute("aria-current", "page");
      } else {
        btn.classList.remove("is-active");
        btn.removeAttribute("aria-current");
      }
    });
    try { d.body.setAttribute("data-active-tab", tab); } catch (e) {}
    setAdhkar(tab);
  }

  function currentTab() {
    var b = d.querySelector(".cs-door .cs-door-btn.is-active");
    return (b && b.getAttribute("data-rail-tab")) || "reminder";
  }

  function boot() {
    setActive(currentTab());
    d.addEventListener(
      "click",
      function (ev) {
        var btn = ev.target && ev.target.closest && ev.target.closest(".cs-door .cs-door-btn[data-rail-tab]");
        if (!btn) return;
        var tab = btn.getAttribute("data-rail-tab");
        if (tab) setTimeout(function () { setActive(tab); }, 10);
      },
      true
    );
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.ClarityNavPolish = { setActive: setActive, version: "P1C" };
})(window, document);
