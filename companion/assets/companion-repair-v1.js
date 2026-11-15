/*! companion-repair-v1 · nav-aligned · mount hydrate · dead wiring
 * Companion-only. Enrichment hold. Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_REPAIR_V1__) return;
  w.__COMPANION_REPAIR_V1__ = true;
  var LOG = (w.__COMPANION_REPAIR_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }
  function $(sel, root) {
    return (root || d).querySelector(sel);
  }
  function $all(sel, root) {
    return Array.prototype.slice.call((root || d).querySelectorAll(sel));
  }
  function mountRoot() {
    return d.getElementById("cs-mount") || d;
  }

  /* —— Nav fix (runtime safety net) —— */
  function fixNav() {
    $all('a[href="/yawm/"], a[href="/yawm"]').forEach(function (a) {
      a.setAttribute("href", "/daily/");
    });
  }

  /* —— Commands (يَا أَيُّهَا الَّذِينَ آمَنُوا) —— */
  var COMMANDS = [
    { s: 2, a: 153, note: "Patience and prayer" },
    { s: 2, a: 183, note: "Fasting prescribed" },
    { s: 2, a: 254, note: "Spend before a day comes" },
    { s: 2, a: 264, note: "Do not void charity with reminders" },
    { s: 2, a: 278, note: "Leave what remains of ribā" },
    { s: 3, a: 102, note: "Taqwā as due to Allah" },
    { s: 3, a: 200, note: "Persevere and guard" },
    { s: 4, a: 1, note: "Taqwā · kinship" },
    { s: 4, a: 59, note: "Obey Allah and the Messenger" },
    { s: 4, a: 135, note: "Stand for justice" },
    { s: 5, a: 1, note: "Fulfill contracts" },
    { s: 5, a: 6, note: "Wuḍūʾ when you rise for prayer" },
    { s: 5, a: 8, note: "Be just, witnesses for Allah" },
    { s: 5, a: 35, note: "Seek means to Allah" },
    { s: 8, a: 15, note: "When you meet those who disbelieve…" },
    { s: 8, a: 24, note: "Respond to Allah and the Messenger" },
    { s: 9, a: 38, note: "What is the matter when told to go forth?" },
    { s: 22, a: 77, note: "Bow, prostrate, worship, do good" },
    { s: 24, a: 21, note: "Do not follow steps of Shayṭān" },
    { s: 33, a: 41, note: "Remember Allah with much remembrance" },
    { s: 33, a: 70, note: "Speak words straight" },
    { s: 49, a: 1, note: "Do not put yourselves forward before Allah and His Messenger" },
    { s: 49, a: 6, note: "If a fāsiq brings news, verify" },
    { s: 49, a: 11, note: "Let not a people ridicule another" },
    { s: 49, a: 12, note: "Avoid much assumption · do not spy · do not backbite" },
    { s: 57, a: 28, note: "Fear Allah and believe in His Messenger" },
    { s: 59, a: 18, note: "Let every soul see what it has sent ahead" },
    { s: 61, a: 10, note: "Shall I guide you to a trade that saves…" },
    { s: 61, a: 14, note: "Be helpers of Allah" },
    { s: 66, a: 6, note: "Protect yourselves and your families from a Fire" }
  ];
  var cmdIdx = Math.floor(Date.now() / 86400000) % COMMANDS.length;
  var cmdCache = {};

  function fetchAyah(s, a) {
    var key = s + ":" + a;
    if (cmdCache[key]) return Promise.resolve(cmdCache[key]);
    return fetch("https://api.alquran.cloud/v1/ayah/" + s + ":" + a + "/editions/quran-uthmani,en.sahih")
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var eds = (j && j.data) || [];
        var row = {
          s: s,
          a: a,
          ar: (eds[0] && eds[0].text) || "",
          en: (eds[1] && eds[1].text) || ""
        };
        cmdCache[key] = row;
        return row;
      });
  }

  function paintCommand(row, note) {
    var box = $("#command-box", mountRoot()) || d.getElementById("command-box");
    if (!box) return;
    box.innerHTML =
      '<div class="arabic" dir="rtl" lang="ar" style="font-size:1.25rem;line-height:1.85;margin:.35rem 0">' +
      (row.ar || "") +
      "</div><p style=\"line-height:1.5;margin:.35rem 0\">" +
      (row.en || "") +
      "</p><p class=\"td-src\">Qur’an " +
      row.s +
      ":" +
      row.a +
      (note ? " · " + note : "") +
      " · Sahih International · educational only — not a fatwa</p>";
  }

  function loadCommand(delta) {
    if (delta) cmdIdx = (cmdIdx + delta + COMMANDS.length) % COMMANDS.length;
    var c = COMMANDS[cmdIdx];
    fetchAyah(c.s, c.a)
      .then(function (row) { paintCommand(row, c.note); })
      .catch(function () {
        var box = $("#command-box", mountRoot()) || d.getElementById("command-box");
        if (box)
          box.innerHTML =
            '<p class="td-src">Could not load verse offline. Open <a href="https://quran.com/' +
            c.s +
            "/" +
            c.a +
            '" target="_blank" rel="noopener">Quran.com/' +
            c.s +
            "/" +
            c.a +
            "</a> · educational only.</p>";
      });
  }
  w.prevCommand = function () { loadCommand(-1); };
  w.nextCommand = function () { loadCommand(1); };

  /* —— Samiʿnā daily verse —— */
  var SAMINA = ["2:285", "2:286", "4:59", "8:24", "24:51", "33:36", "59:7"];
  var samIdx = Math.floor(Date.now() / 86400000) % SAMINA.length;
  w.clarityDailySaminaVerse = function (next) {
    if (next) samIdx = (samIdx + 1) % SAMINA.length;
    var parts = SAMINA[samIdx].split(":");
    var s = parseInt(parts[0], 10);
    var a = parseInt(parts[1], 10);
    fetchAyah(s, a).then(function (row) {
      var ar = $("#samina-verse-ar", mountRoot()) || d.getElementById("samina-verse-ar");
      var en = $("#samina-verse-en", mountRoot()) || d.getElementById("samina-verse-en");
      var ref = $("#samina-verse-ref", mountRoot()) || d.getElementById("samina-verse-ref");
      if (ar) ar.textContent = row.ar || "";
      if (en) en.textContent = row.en || "";
      if (ref) ref.textContent = "Qur’an " + row.s + ":" + row.a + " · educational only — not a fatwa";
      // alternate markup in some tabs
      var card = $("#samina-verse-card", mountRoot());
      if (card && !ar) {
        var box = card.querySelector(".arabic") || card;
      }
    }).catch(function () { log("samina-fail"); });
  };

  /* —— Hadith (ensure global) —— */
  if (typeof w.loadHadith !== "function") {
    var H = [
      { t: "Actions are but by intentions.", g: "Ṣaḥīḥ", c: "Bukhārī", n: "1" },
      { t: "None of you truly believes until he loves for his brother what he loves for himself.", g: "Ṣaḥīḥ", c: "Bukhārī", n: "13" },
      { t: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.", g: "Ṣaḥīḥ", c: "Bukhārī", n: "6475" },
      { t: "Make things easy and do not make them difficult.", g: "Ṣaḥīḥ", c: "Bukhārī", n: "69" },
      { t: "The strong is the one who controls himself when angry.", g: "Ṣaḥīḥ", c: "Bukhārī", n: "6114" }
    ];
    var hi = 0;
    w.loadHadith = function () {
      hi = (hi + 1) % H.length;
      var host = $("#hadith", mountRoot()) || d.getElementById("hadith");
      if (!host) return;
      var h = H[hi];
      host.innerHTML =
        '<p style="line-height:1.5">' +
        h.t +
        '</p><p class="td-src"><strong>' +
        h.g +
        "</strong> · " +
        h.c +
        " " +
        h.n +
        " · verify on Sunnah.com · educational only — not a fatwa</p>";
    };
  }

  /* —— Prophet names —— */
  var NAMES = [
    { ar: "مُحَمَّد", en: "Muḥammad", m: "The praised one" },
    { ar: "أَحْمَد", en: "Aḥmad", m: "Most praiseworthy" },
    { ar: "الْمُصْطَفَى", en: "al-Muṣṭafā", m: "The chosen" },
    { ar: "الْحَبِيب", en: "al-Ḥabīb", m: "The beloved" },
    { ar: "الْأَمِين", en: "al-Amīn", m: "The trustworthy" },
    { ar: "الرَّحْمَة", en: "Raḥmah", m: "Mercy to the worlds (21:107 theme)" },
    { ar: "السِّرَاجُ الْمُنِير", en: "as-Sirāj al-Munīr", m: "The illuminating lamp (33:46 theme)" },
    { ar: "الْبَشِير", en: "al-Bashīr", m: "Bearer of good news" },
    { ar: "النَّذِير", en: "an-Nadhīr", m: "The warner" },
    { ar: "طٰهٰ", en: "Ṭā-Hā", m: "Qur’anic address" },
    { ar: "يٰسٓ", en: "Yā-Sīn", m: "Qur’anic address" },
    { ar: "الْمُزَّمِّل", en: "al-Muzzammil", m: "The enwrapped" },
    { ar: "الْمُدَّثِّر", en: "al-Muddaththir", m: "The cloaked" }
  ];
  var ni = Math.floor(Date.now() / 86400000) % NAMES.length;
  function paintName(i) {
    var box = $("#prophet-name-box", mountRoot()) || d.getElementById("prophet-name-box");
    if (!box) return;
    var n = NAMES[((i % NAMES.length) + NAMES.length) % NAMES.length];
    box.innerHTML =
      '<div class="arabic" dir="rtl" lang="ar" style="font-size:1.4rem">' +
      n.ar +
      "</div><p style=\"font-weight:700;margin:.25rem 0\">" +
      n.en +
      '</p><p class="td-src">' +
      n.m +
      " · educational · ṣallā Allāhu ʿalayhi wa sallam · not a fixed “99” claim</p>";
  }
  w.loadProphetName = function (random) {
    if (random) ni = Math.floor(Math.random() * NAMES.length);
    else ni = Math.floor(Date.now() / 86400000) % NAMES.length;
    paintName(ni);
  };
  w.showAllProphetNames = function () {
    var list = $("#prophet-names-list", mountRoot()) || d.getElementById("prophet-names-list");
    if (!list) {
      list = d.createElement("div");
      list.id = "prophet-names-list";
      var box = $("#prophet-name-box", mountRoot());
      if (box && box.parentNode) box.parentNode.appendChild(list);
      else return;
    }
    list.style.display = "block";
    list.innerHTML = NAMES.map(function (n) {
      return (
        '<div style="padding:.3rem 0;border-bottom:1px solid rgba(255,255,255,.06)"><span dir="rtl" lang="ar">' +
        n.ar +
        "</span> — <strong>" +
        n.en +
        "</strong> · " +
        n.m +
        "</div>"
      );
    }).join("");
  };
  w.filterProphetNames = function (q) {
    q = String(q || "").toLowerCase();
    w.showAllProphetNames();
    var list = d.getElementById("prophet-names-list");
    if (!list) return;
    $all("div", list).forEach(function (row) {
      row.style.display = !q || row.textContent.toLowerCase().indexOf(q) >= 0 ? "block" : "none";
    });
  };

  /* —— Reality loaders —— */
  var LIFE = [
    { t: "Job strain", b: "Allah does not burden a soul beyond its capacity (2:286 theme). Take the next ḥalāl step; ask a scholar for your case. Educational only." },
    { t: "Illness", b: "Patience and duʿāʾ; visiting the sick is a known good. Medical care is sought — not a substitute for professional care." },
    { t: "Anger", b: "The strong one controls himself when angry (Bukhārī/Muslim). Seek refuge, change posture, remain silent if needed." },
    { t: "Family tension", b: "Kinship is heavy in the dīn. Speak justly; reconcile when you can. Educational — not a family court." }
  ];
  var li = 0;
  w.loadLifeEvent = function () {
    li = (li + 1) % LIFE.length;
    var el = $("#life-event", mountRoot()) || d.getElementById("life-event");
    if (!el) return;
    el.innerHTML = "<strong>" + LIFE[li].t + "</strong><p style=\"margin:.35rem 0 0;line-height:1.5\">" + LIFE[li].b + "</p>";
  };

  var SEERAH_A = ["33:21", "9:128", "21:107", "48:29", "3:159", "9:40"];
  var si = 0;
  w.clarityLiveSeerah = function (next) {
    if (next) si = (si + 1) % SEERAH_A.length;
    var p = SEERAH_A[si].split(":");
    fetchAyah(parseInt(p[0], 10), parseInt(p[1], 10)).then(function (row) {
      var ar = $("#seerah-live-ar", mountRoot()) || d.getElementById("seerah-live-ar");
      var en = $("#seerah-live-en", mountRoot()) || d.getElementById("seerah-live-en");
      if (ar) ar.textContent = row.ar || "";
      if (en) en.textContent = row.en || "";
      var sc = $("#seerah-content", mountRoot()) || d.getElementById("seerah-content");
      if (sc && !ar) {
        sc.innerHTML =
          '<div class="arabic" dir="rtl" lang="ar">' +
          (row.ar || "") +
          "</div><p>" +
          (row.en || "") +
          '</p><p class="td-src">Qur’an ' +
          row.s +
          ":" +
          row.a +
          " · educational sīrah-linked reminder</p>";
      }
    }).catch(function () { log("seerah-fail"); });
  };
  w.loadSeerah = function () { w.clarityLiveSeerah(false); };

  var JUD = [
    { t: "Justice even against yourselves", ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُونُوا قَوَّامِينَ بِالْقِسْطِ", en: "Stand firm for justice… (4:135 opening theme)." },
    { t: "Return trusts", ar: "إِنَّ اللَّهَ يَأْمُرُكُمْ أَن تُؤَدُّوا الْأَمَانَاتِ", en: "Allah commands you to restore trusts… (4:58 theme)." },
    { t: "Mercy in leadership", ar: "فَبِمَا رَحْمَةٍ مِّنَ اللَّهِ لِنتَ لَهُمْ", en: "By mercy from Allah you were gentle with them (3:159)." }
  ];
  var ji = 0;
  w.clarityLiveSamina = function (next) {
    if (next) ji = (ji + 1) % JUD.length;
    var j = JUD[ji];
    var t = $("#samina-title", mountRoot());
    var ar = $("#samina-ar", mountRoot());
    var en = $("#samina-en", mountRoot());
    if (t) t.textContent = j.t;
    if (ar) ar.textContent = j.ar;
    if (en) en.textContent = j.en + " Educational only — not a fatwa.";
  };

  var STORIES = [
    { t: "Nūḥ — persistence", b: "Long calling with patience. Educational reflection from Qur’anic narrative — not entertainment." },
    { t: "Ibrāhīm — tawakkul", b: "Trust and argument with clear proof. Verify details with tafsīr and a teacher." },
    { t: "Mūsā — standing for the oppressed", b: "Courage with reliance on Allah. Educational only." },
    { t: "Yūsuf — purity under pressure", b: "Guard the heart when tested. Educational only." }
  ];
  var sti = 0;
  w.loadProphetStory = function () {
    sti = (sti + 1) % STORIES.length;
    var el = $("#prophet-story", mountRoot()) || d.getElementById("prophet-story");
    if (!el) return;
    el.innerHTML = "<strong>" + STORIES[sti].t + "</strong><p style=\"margin:.35rem 0 0\">" + STORIES[sti].b + "</p>";
  };
  w.loadIsraeliyat = function () {
    var el = $("#israeliyat-content", mountRoot()) || d.getElementById("israeliyat-content");
    if (!el) return;
    el.innerHTML =
      "<p>Isrāʾīliyyāt are reports from earlier peoples used cautiously in tafsīr. Prefer Qur’an and ṣaḥīḥ Sunnah; verify with a scholar. Educational only — not a fatwa.</p>";
  };
  w.clarityIsraeliyatDeepFetch = w.loadIsraeliyat;
  w.clarityIsraeliyatExpandScholar = function () {
    w.open("https://sunnah.com", "_blank", "noopener");
  };
  w.clarityTibbeNext = function () {
    var el = $("#tibbe-remedy-body", mountRoot()) || d.getElementById("tibbe-title");
    if (el && el.tagName) {
      /* leave existing static if present */
    }
    log("tibbe");
  };
  w.clarityRefreshSection = function (sec) {
    if (sec === "seerah") w.clarityLiveSeerah(true);
    if (sec === "tajweed" && typeof w.clarityLiveTajweed === "function") w.clarityLiveTajweed(true);
  };

  /* —— Reflection stubs if missing —— */
  var LESSONS = [
    { t: "Remember death", b: "A soft reminder, then one good deed. Educational only." },
    { t: "Send light ahead", b: "Duʿāʾ, ṣadaqah, useful knowledge — verify details with scholars." },
    { t: "Private sincerity", b: "What is between you and Allah needs no audience." }
  ];
  var lei = 0;
  if (typeof w.loadLesson !== "function") {
    w.loadLesson = function (next) {
      if (next) lei = (lei + 1) % LESSONS.length;
      var el = $("#lesson", mountRoot()) || d.getElementById("lesson");
      if (!el) return;
      el.innerHTML = "<strong>" + LESSONS[lei].t + "</strong><p>" + LESSONS[lei].b + "</p>";
    };
  }
  if (typeof w.loadVerse !== "function") {
    var VI = 0;
    var VS = ["2:152", "13:28", "94:5", "94:6", "103:1"];
    w.loadVerse = function () {
      VI = (VI + 1) % VS.length;
      var p = VS[VI].split(":");
      fetchAyah(parseInt(p[0], 10), parseInt(p[1], 10)).then(function (row) {
        var el = $("#verse", mountRoot()) || d.getElementById("verse");
        if (!el) return;
        el.innerHTML =
          '<div class="arabic" dir="rtl" lang="ar">' +
          row.ar +
          "</div><p>" +
          row.en +
          '</p><p class="td-src">Qur’an ' +
          row.s +
          ":" +
          row.a +
          "</p>";
      });
    };
  }
  if (typeof w.loadAsma !== "function") {
    var AS = [
      { ar: "الرَّحْمَٰنُ", en: "Ar-Raḥmān" },
      { ar: "الرَّحِيمُ", en: "Ar-Raḥīm" },
      { ar: "الْغَفُورُ", en: "Al-Ghafūr" },
      { ar: "الْوَدُودُ", en: "Al-Wadūd" }
    ];
    var ai = 0;
    w.loadAsma = function (r) {
      if (r) ai = Math.floor(Math.random() * AS.length);
      else ai = (ai + 1) % AS.length;
      var box = $("#asma-box", mountRoot()) || d.getElementById("asma-box");
      if (!box) return;
      box.innerHTML =
        '<div class="arabic" dir="rtl" lang="ar" style="font-size:1.35rem">' +
        AS[ai].ar +
        "</div><p>" +
        AS[ai].en +
        "</p>";
    };
    w.showAllAsma = function () {
      var list = d.getElementById("asma-all-list");
      if (!list) return;
      list.style.display = "block";
      list.innerHTML = AS.map(function (n) {
        return "<div>" + n.ar + " — " + n.en + "</div>";
      }).join("");
    };
  }
  if (typeof w.loadZikr !== "function") {
    w.loadZikr = function () {
      var el = $("#zikr", mountRoot()) || d.getElementById("zikr");
      if (!el) return;
      el.innerHTML =
        '<div class="arabic" dir="rtl" lang="ar">سُبْحَانَ اللَّهِ · الْحَمْدُ لِلَّهِ · اللَّهُ أَكْبَرُ</div>';
    };
  }
  if (typeof w.nightBreathRefresh !== "function") {
    var NQ = [
      "What one deed would I want sent ahead?",
      "Whom can I still ask to forgive me?",
      "What secret good can I do before sleep?"
    ];
    var nqi = 0;
    w.nightBreathRefresh = function () {
      nqi = (nqi + 1) % NQ.length;
      var q = d.getElementById("night-breath-q");
      if (q) q.textContent = NQ[nqi];
    };
    w.nightBreathAct = function () {
      var q = d.getElementById("night-breath-q");
      if (q) q.textContent = "May Allah accept one sincere deed. Act, then return tomorrow.";
    };
  }
  if (typeof w.soulCompassDone !== "function") {
    w.soulCompassDone = function () {
      var st = d.getElementById("soul-compass-status");
      if (st) st.textContent = "Marked for tonight · educational only";
    };
  }
  if (typeof w.addDeposit !== "function") {
    w.addDeposit = function (kind) {
      var id = kind === "salawat" ? "salawat-count" : "istighfar-count";
      var el = d.getElementById(id);
      if (!el) return;
      var n = (parseInt(el.textContent, 10) || 0) + 1;
      el.textContent = String(n);
      try {
        localStorage.setItem("clarity.dep." + kind, String(n));
      } catch (e) {}
    };
    w.resetDeposits = function () {
      ["istighfar-count", "salawat-count"].forEach(function (id) {
        var el = d.getElementById(id);
        if (el) el.textContent = "0";
      });
    };
  }
  if (typeof w.ilmPathwayReset !== "function") {
    w.ilmPathwayReset = function () {
      log("ilm-reset");
    };
  }
  if (typeof w.notesQuickFromSection !== "function") {
    w.notesQuickFromSection = function () {
      log("notes");
    };
  }
  if (typeof w.playCurrentVerseAudio !== "function") {
    w.playCurrentVerseAudio = function () {
      log("audio");
    };
  }
  if (typeof w.resetName !== "function") {
    w.resetName = function () {
      log("resetName");
    };
  }
  if (typeof w.switchTab !== "function") {
    w.switchTab = function (tab) {
      if (w.ClarityCompanionShell && typeof w.ClarityCompanionShell.mountTab === "function") {
        w.ClarityCompanionShell.mountTab(tab);
      } else {
        var btn = d.querySelector('.cs-door [data-rail-tab="' + tab + '"]');
        if (btn) btn.click();
      }
    };
  }

  /* —— Hydrate after every mount —— */
  function hydrateAll() {
    fixNav();
    var root = mountRoot();
    var cmd = $("#command-box", root);
    if (cmd && /loading/i.test(cmd.textContent || "")) loadCommand(0);
    var had = $("#hadith", root);
    if (had && /loading/i.test(had.textContent || "")) {
      try {
        w.loadHadith();
      } catch (e) {}
    }
    var pn = $("#prophet-name-box", root);
    if (pn && /loading/i.test(pn.textContent || "")) w.loadProphetName(false);
    var life = $("#life-event", root);
    if (life && /loading/i.test(life.textContent || "")) w.loadLifeEvent();
    var seerah = $("#seerah-content", root);
    if (seerah && /loading/i.test(seerah.textContent || "")) w.clarityLiveSeerah(false);
    var sar = $("#seerah-live-ar", root);
    if (sar && !(sar.textContent || "").trim()) w.clarityLiveSeerah(false);
    var story = $("#prophet-story", root);
    if (story && /loading/i.test(story.textContent || "")) w.loadProphetStory();
    var isr = $("#israeliyat-content", root);
    if (isr && /loading/i.test(isr.textContent || "")) w.loadIsraeliyat();
    var lesson = $("#lesson", root);
    if (lesson && /loading/i.test(lesson.textContent || "")) w.loadLesson(false);
    var verse = $("#verse", root);
    if (verse && /loading/i.test(verse.textContent || "")) w.loadVerse();
    // samina verse areas
    var samAr = $("#samina-verse-ar", root);
    if (samAr && !(samAr.textContent || "").trim()) w.clarityDailySaminaVerse(false);
    if (typeof w.ClarityTabEngines === "object" && typeof w.ClarityTabEngines.hydrate === "function") {
      try {
        w.ClarityTabEngines.hydrate();
      } catch (e2) {}
    }
    log("hydrate");
  }

  function watchMount() {
    var mount = d.getElementById("cs-mount");
    if (!mount) return;
    var t = null;
    var mo = new MutationObserver(function () {
      if (t) clearTimeout(t);
      t = setTimeout(hydrateAll, 60);
    });
    mo.observe(mount, { childList: true, subtree: true });
    hydrateAll();
    // late passes for slow fragment/tab paint
    setTimeout(hydrateAll, 400);
    setTimeout(hydrateAll, 1200);
  }

  function boot() {
    fixNav();
    watchMount();
    log("repair-boot");
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
