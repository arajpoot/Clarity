/*! companion-g13-reminder-about-v1
 * Reminder: hadith + Prophet names · About rail (not Journey landing)
 * Educational only — not a fatwa. Prefer ṣaḥīḥ collections; verify on Sunnah.com.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_G13_REMINDER_ABOUT_V1__) return;
  w.__CLARITY_G13_REMINDER_ABOUT_V1__ = true;
  var LOG = (w.__G13_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }
  function $(id) { return d.getElementById(id); }

  /* Curated educational hadith bank — short text + collection label; verify on Sunnah.com */
  var HADITH = [
    { ar: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ", en: "Actions are but by intentions.", ref: "Bukhārī & Muslim — famous opening report · verify full text on Sunnah.com" },
    { ar: "مَنْ حَسَّنَ إِسْلَامَ الْمَرْءِ تَرْكُهُ مَا لَا يَعْنِيهِ", en: "Part of the excellence of a person's Islam is leaving what does not concern him.", ref: "Tirmidhī / others — verify grade and wording on Sunnah.com" },
    { ar: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ", en: "None of you truly believes until he loves for his brother what he loves for himself.", ref: "Bukhārī & Muslim · verify on Sunnah.com" },
    { ar: "الطُّهُورُ شَطْرُ الْإِيمَانِ", en: "Purity is half of faith.", ref: "Muslim · verify on Sunnah.com" },
    { ar: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ", en: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.", ref: "Bukhārī & Muslim · verify on Sunnah.com" },
    { ar: "الدِّينُ النَّصِيحَةُ", en: "The religion is sincere counsel.", ref: "Muslim · verify full narration on Sunnah.com" },
    { ar: "حُفَّتِ الْجَنَّةُ بِالْمَكَارِهِ وَحُفَّتِ النَّارُ بِالشَّهَوَاتِ", en: "Paradise is surrounded by hardships and the Fire is surrounded by desires.", ref: "Muslim · verify on Sunnah.com" },
    { ar: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ", en: "The best of you are those who learn the Qur'an and teach it.", ref: "Bukhārī · verify on Sunnah.com" },
    { ar: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ", en: "Whoever travels a path seeking knowledge, Allah makes easy for him a path to Paradise.", ref: "Muslim · verify on Sunnah.com" },
    { ar: "ارْحَمُوا مَنْ فِي الْأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ", en: "Show mercy to those on earth, and the One above the heavens will show mercy to you.", ref: "Tirmidhī / Abū Dāwūd routes — verify grade on Sunnah.com / scholar" }
  ];
  var hadithIdx = Math.floor(Date.now() / 86400000) % HADITH.length;

  function renderHadith() {
    var el = $("hadith");
    if (!el) return;
    var h = HADITH[hadithIdx % HADITH.length];
    el.innerHTML =
      '<div class="arabic" dir="rtl" lang="ar" style="font-size:1.2rem;line-height:1.85;margin:.35rem 0">' +
      h.ar +
      "</div><p style=\"line-height:1.5;margin:.35rem 0\">" +
      h.en +
      "</p><p class=\"td-src\">" +
      h.ref +
      " · educational only — not a fatwa</p>";
  }
  w.loadHadith = function () {
    hadithIdx = (hadithIdx + 1) % HADITH.length;
    renderHadith();
  };

  /* Names of the Prophet ﷺ — educational list with meanings */
  var NAMES = [
    { ar: "مُحَمَّد", en: "Muḥammad", mean: "The praised one" },
    { ar: "أَحْمَد", en: "Aḥmad", mean: "Most praiseworthy" },
    { ar: "الْمُصْطَفَى", en: "al-Muṣṭafā", mean: "The chosen" },
    { ar: "الْحَبِيب", en: "al-Ḥabīb", mean: "The beloved" },
    { ar: "رَسُولُ اللَّهِ", en: "Rasūl Allāh", mean: "Messenger of Allah" },
    { ar: "النَّبِيّ", en: "an-Nabī", mean: "The Prophet" },
    { ar: "الْبَشِير", en: "al-Bashīr", mean: "The bearer of good news" },
    { ar: "النَّذِير", en: "an-Nadhīr", mean: "The warner" },
    { ar: "السِّرَاجُ الْمُنِير", en: "as-Sirāj al-Munīr", mean: "The illuminating lamp (Qur'an 33:46 theme)" },
    { ar: "الرَّحْمَة", en: "Raḥmah", mean: "Mercy to the worlds (Qur'an 21:107 theme)" },
    { ar: "طٰهٰ", en: "Ṭā-Hā", mean: "Address in the Qur'an (Sūrah Ṭā-Hā)" },
    { ar: "يٰسٓ", en: "Yā-Sīn", mean: "Address in the Qur'an (Sūrah Yā-Sīn)" },
    { ar: "الْمُزَّمِّل", en: "al-Muzzammil", mean: "The enwrapped (Sūrah 73)" },
    { ar: "الْمُدَّثِّر", en: "al-Muddaththir", mean: "The cloaked (Sūrah 74)" },
    { ar: "الشَّاهِد", en: "ash-Shāhid", mean: "The witness" },
    { ar: "الْمُبَشِّر", en: "al-Mubashshir", mean: "The announcer of good news" },
    { ar: "الدَّاعِي إِلَى اللَّهِ", en: "ad-Dāʿī ilā Allāh", mean: "Caller to Allah" },
    { ar: "الْأَمِين", en: "al-Amīn", mean: "The trustworthy" },
    { ar: "الْمَاحِي", en: "al-Māḥī", mean: "The eraser (of disbelief) — reported name lists; verify" },
    { ar: "الْحَاشِر", en: "al-Ḥāshir", mean: "The gatherer — reported name lists; verify" },
    { ar: "الْعَاقِب", en: "al-ʿĀqib", mean: "The last (no prophet after him) — reported lists; verify" },
    { ar: "نَبِيُّ التَّوْبَة", en: "Nabī at-Tawbah", mean: "Prophet of repentance — reported lists; verify" },
    { ar: "نَبِيُّ الرَّحْمَة", en: "Nabī ar-Raḥmah", mean: "Prophet of mercy — reported lists; verify" }
  ];
  var nameIdx = Math.floor(Date.now() / 86400000) % NAMES.length;

  function renderName(i) {
    var box = $("prophet-name-box");
    if (!box) return;
    var n = NAMES[((i % NAMES.length) + NAMES.length) % NAMES.length];
    box.innerHTML =
      '<div class="arabic" dir="rtl" lang="ar" style="font-size:1.45rem;margin:.25rem 0">' +
      n.ar +
      "</div><p style=\"font-weight:700;margin:.2rem 0\">" +
      n.en +
      "</p><p class=\"td-src\">" +
      n.mean +
      " · educational; not a fixed “99” claim in every narration · ṣallā Allāhu ʿalayhi wa sallam</p>";
  }

  w.loadProphetName = function (random) {
    if (random) nameIdx = Math.floor(Math.random() * NAMES.length);
    else nameIdx = Math.floor(Date.now() / 86400000) % NAMES.length;
    renderName(nameIdx);
  };
  w.showAllProphetNames = function () {
    var list = $("prophet-names-list");
    if (!list) {
      list = d.createElement("div");
      list.id = "prophet-names-list";
      var box = $("prophet-name-box");
      if (box && box.parentNode) box.parentNode.appendChild(list);
    }
    list.style.display = "block";
    list.innerHTML = NAMES.map(function (n) {
      return (
        '<div style="padding:.35rem 0;border-bottom:1px solid rgba(255,255,255,.06)"><span dir="rtl" lang="ar">' +
        n.ar +
        "</span> — <strong>" +
        n.en +
        "</strong> · " +
        n.mean +
        "</div>"
      );
    }).join("");
  };
  w.filterProphetNames = function (q) {
    q = String(q || "").toLowerCase();
    var list = $("prophet-names-list");
    if (!list || list.style.display === "none") w.showAllProphetNames();
    list = $("prophet-names-list");
    if (!list) return;
    list.querySelectorAll("div").forEach(function (row) {
      row.style.display = !q || row.textContent.toLowerCase().indexOf(q) >= 0 ? "block" : "none";
    });
  };

  /* About door: never day-landing / journey */
  function showPanel(name) {
    d.querySelectorAll(".tab-panel").forEach(function (p) {
      var on = p.id === "tab-" + name;
      p.classList.toggle("is-active", on);
      p.classList.toggle("active", on);
      p.style.display = on ? "block" : "none";
      if (on) p.removeAttribute("hidden");
    });
    d.querySelectorAll(".door-rail-btn").forEach(function (b) {
      var t = b.getAttribute("data-rail-tab");
      b.classList.toggle("on", t === name);
      b.classList.toggle("is-active", t === name);
    });
    try {
      d.documentElement.removeAttribute("data-shell-mode");
      d.body.classList.remove("day-landing");
    } catch (e) {}
  }

  var prevOpen = w.clarityOpenSectionDoor;
  w.clarityOpenSectionDoor = function (door) {
    if (door === "about") {
      showPanel("about");
      log("open-about");
      return;
    }
    if (door === "notes") {
      showPanel("notes");
      log("open-notes");
      return;
    }
    if (typeof prevOpen === "function") {
      try {
        return prevOpen.apply(this, arguments);
      } catch (e) {
        showPanel(door);
      }
    } else {
      showPanel(door);
    }
  };

  function boot() {
    renderHadith();
    renderName(nameIdx);
    /* ensure about panel has g12 card; link to notes + amana */
    var about = $("tab-about");
    if (about && !about.querySelector("[data-g13-notes-link]")) {
      var p = d.createElement("p");
      p.setAttribute("data-g13-notes-link", "1");
      p.style.cssText = "max-width:42rem;margin:0.5rem auto 1rem;font-size:0.9rem";
      p.innerHTML =
        '<button type="button" class="btn-soft" onclick="clarityOpenSectionDoor(\'notes\')">Open on-device Notes</button> · <a href="/amana/">Amānah vault</a> · <a href="/campus/">University</a>';
      about.insertBefore(p, about.firstChild);
    }
    log("g13-boot");
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
