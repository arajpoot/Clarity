/*! companion-repair-v3 · calm-as-campus · dead-link sanitzer · mount hydrate
 * Companion-only · enrichment hold · educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_REPAIR_V3__) return;
  w.__COMPANION_REPAIR_V3__ = true;
  var LOG = (w.__COMPANION_REPAIR_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }
  function root() { return d.getElementById("cs-mount") || d; }
  function $id(id) { return root().querySelector("#" + id) || d.getElementById(id); }

  /* —— Calm nav: never /yawm/ —— */
  function sanitizeLinks(scope) {
    (scope || d).querySelectorAll("a[href]").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (href === "/yawm/" || href === "/yawm" || href.indexOf("/yawm/") === 0) {
        a.setAttribute("href", "/daily/");
        log("fix-yawm");
      }
      /* in-room studio hashes → Craft room (isolated upgrades) or Action */
      if (href === "/companion/#meme" || href === "#meme") {
        a.setAttribute("href", "/craft/");
        a.setAttribute("title", "Full Meme atelier lives in Craft");
      }
      if (href === "/companion/#callig" || href === "#callig") {
        a.setAttribute("href", "/craft/");
        a.setAttribute("title", "Full Calligraphy atelier lives in Craft");
      }
      /* empty / javascript dead */
      if (href === "" || href === "#" || href.indexOf("javascript:") === 0) {
        if (!a.getAttribute("data-rail-tab") && !a.onclick) {
          a.setAttribute("role", "presentation");
        }
      }
    });
  }

  /* —— Hash deep links on companion entry —— */
  function honorHash() {
    var h = (w.location.hash || "").replace(/^#/, "");
    if (!h) return;
    if (h === "meme" || h === "callig" || h === "tajweed") {
      /* open Action tab where studios are listed */
      var btn = d.querySelector('.cs-door [data-rail-tab="action"]');
      if (btn) btn.click();
      setTimeout(function () {
        var target =
          h === "meme"
            ? $id("meme-studio-root") || root().querySelector("[data-meme], #meme-studio")
            : h === "callig"
            ? $id("callig-canvas") || root().querySelector("[data-callig], #callig-pad")
            : $id("tj-deep-studio");
        if (target && target.scrollIntoView) target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 400);
    } else if (["reminder", "reality", "reflection", "action", "notes", "about"].indexOf(h) >= 0) {
      var b = d.querySelector('.cs-door [data-rail-tab="' + h + '"]');
      if (b) b.click();
    }
  }

  /* —— Ayah / content engines (keep v2 surface) —— */
  var cache = {};
  function fetchAyah(s, a) {
    var k = s + ":" + a;
    if (cache[k]) return Promise.resolve(cache[k]);
    return fetch("https://api.alquran.cloud/v1/ayah/" + s + ":" + a + "/editions/quran-uthmani,en.sahih")
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var eds = (j && j.data) || [];
        var row = { s: s, a: a, ar: (eds[0] && eds[0].text) || "", en: (eds[1] && eds[1].text) || "" };
        cache[k] = row;
        return row;
      });
  }
  function parseKA(str) {
    var p = String(str).split(":");
    return { s: parseInt(p[0], 10), a: parseInt(p[1], 10) };
  }

  var CMDS = ["2:153","2:183","2:254","2:278","3:102","3:200","4:1","4:59","4:135","5:6","5:8","8:24","33:41","33:70","49:6","49:12","59:18","61:14","66:6"];
  var ci = Math.floor(Date.now() / 86400000) % CMDS.length;
  function loadCmd(dlt) {
    if (dlt) ci = (ci + dlt + CMDS.length) % CMDS.length;
    var p = parseKA(CMDS[ci]);
    fetchAyah(p.s, p.a).then(function (row) {
      var box = $id("command-box");
      if (!box) return;
      box.innerHTML = '<div class="arabic" dir="rtl" lang="ar" style="font-size:1.2rem;line-height:1.85">' + row.ar + '</div><p style="line-height:1.5">' + row.en + '</p><p class="td-src">Qur’an ' + row.s + ':' + row.a + ' · educational only — not a fatwa</p>';
    }).catch(function () {
      var box = $id("command-box");
      if (box) box.innerHTML = '<p class="td-src">Offline — <a href="https://quran.com/' + p.s + '/' + p.a + '" target="_blank" rel="noopener">Quran.com</a></p>';
    });
  }
  w.prevCommand = function () { loadCmd(-1); };
  w.nextCommand = function () { loadCmd(1); };

  var HAD = [
    { t: "Actions are but by intentions.", g: "Ṣaḥīḥ", c: "Bukhārī", n: "1" },
    { t: "None of you truly believes until he loves for his brother what he loves for himself.", g: "Ṣaḥīḥ", c: "Bukhārī", n: "13" },
    { t: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.", g: "Ṣaḥīḥ", c: "Bukhārī", n: "6475" },
    { t: "Make things easy and do not make them difficult.", g: "Ṣaḥīḥ", c: "Bukhārī", n: "69" },
    { t: "The strong person is the one who controls himself when angry.", g: "Ṣaḥīḥ", c: "Bukhārī", n: "6114" }
  ];
  var hi = 0;
  w.loadHadith = function () {
    hi = (hi + 1) % HAD.length;
    var host = $id("hadith");
    if (!host) return;
    var h = HAD[hi];
    host.innerHTML = '<p style="line-height:1.5">' + h.t + '</p><p class="td-src"><strong>' + h.g + '</strong> · ' + h.c + ' ' + h.n + ' · verify on Sunnah.com · educational only — not a fatwa</p>';
  };

  var NAMES = [
    { ar: "مُحَمَّد", en: "Muḥammad", m: "The praised one" },
    { ar: "أَحْمَد", en: "Aḥmad", m: "Most praiseworthy" },
    { ar: "الْمُصْطَفَى", en: "al-Muṣṭafā", m: "The chosen" },
    { ar: "الْحَبِيب", en: "al-Ḥabīb", m: "The beloved" },
    { ar: "الْأَمِين", en: "al-Amīn", m: "The trustworthy" },
    { ar: "الرَّحْمَة", en: "Raḥmah", m: "Mercy (21:107 theme)" },
    { ar: "السِّرَاجُ الْمُنِير", en: "as-Sirāj al-Munīr", m: "Illuminating lamp" },
    { ar: "الْبَشِير", en: "al-Bashīr", m: "Bearer of good news" },
    { ar: "النَّذِير", en: "an-Nadhīr", m: "The warner" }
  ];
  var ni = Math.floor(Date.now() / 86400000) % NAMES.length;
  w.loadProphetName = function (random) {
    ni = random ? Math.floor(Math.random() * NAMES.length) : Math.floor(Date.now() / 86400000) % NAMES.length;
    var box = $id("prophet-name-box");
    if (!box) return;
    var n = NAMES[ni % NAMES.length];
    box.innerHTML = '<div class="arabic" dir="rtl" lang="ar" style="font-size:1.35rem">' + n.ar + '</div><p style="font-weight:700">' + n.en + '</p><p class="td-src">' + n.m + ' · educational · ṣallā Allāhu ʿalayhi wa sallam</p>';
  };
  w.showAllProphetNames = function () {
    var list = $id("prophet-names-list");
    if (!list) {
      list = d.createElement("div");
      list.id = "prophet-names-list";
      var box = $id("prophet-name-box");
      if (box && box.parentNode) box.parentNode.appendChild(list);
      else return;
    }
    list.style.display = "block";
    list.innerHTML = NAMES.map(function (n) {
      return '<div style="padding:.3rem 0;border-bottom:1px solid rgba(255,255,255,.06)"><span dir="rtl" lang="ar">' + n.ar + '</span> — <strong>' + n.en + '</strong> · ' + n.m + '</div>';
    }).join("");
  };
  w.filterProphetNames = function (q) {
    w.showAllProphetNames();
    q = String(q || "").toLowerCase();
    var list = $id("prophet-names-list");
    if (!list) return;
    Array.prototype.forEach.call(list.children, function (row) {
      row.style.display = !q || row.textContent.toLowerCase().indexOf(q) >= 0 ? "block" : "none";
    });
  };

  var SAM = ["2:285","2:286","4:59","8:24","24:51"];
  var si = 0;
  w.clarityDailySaminaVerse = function (next) {
    if (next) si = (si + 1) % SAM.length;
    var p = parseKA(SAM[si]);
    fetchAyah(p.s, p.a).then(function (row) {
      var ar = $id("samina-verse-ar");
      var en = $id("samina-verse-en");
      var ref = $id("samina-verse-ref");
      if (ar) ar.textContent = row.ar;
      if (en) en.textContent = row.en;
      if (ref) ref.textContent = "Qur’an " + row.s + ":" + row.a + " · educational only";
    });
  };

  var LIFE = [
    { t: "Job strain", b: "Take the next ḥalāl step; 2:286 theme. Educational only — not a fatwa." },
    { t: "Anger", b: "The strong controls himself when angry (Bukhārī/Muslim)." },
    { t: "Illness", b: "Patience, duʿāʾ, seeking care. Not medical advice." },
    { t: "Family tension", b: "Speak justly; reconcile when you can. Educational only." }
  ];
  var li = 0;
  w.loadLifeEvent = function () {
    li = (li + 1) % LIFE.length;
    var el = $id("life-event");
    if (el) el.innerHTML = "<strong>" + LIFE[li].t + "</strong><p>" + LIFE[li].b + "</p>";
  };
  var SEA = ["33:21","9:128","21:107","48:29","3:159"];
  var sei = 0;
  w.clarityLiveSeerah = function (next) {
    if (next) sei = (sei + 1) % SEA.length;
    var p = parseKA(SEA[sei]);
    fetchAyah(p.s, p.a).then(function (row) {
      var ar = $id("seerah-live-ar");
      var en = $id("seerah-live-en");
      if (ar) ar.textContent = row.ar;
      if (en) en.textContent = row.en;
      var sc = $id("seerah-content");
      if (sc && /loading/i.test(sc.textContent || "")) {
        sc.innerHTML = '<div class="arabic" dir="rtl" lang="ar">' + row.ar + '</div><p>' + row.en + '</p>';
      }
    });
  };
  w.loadSeerah = function () { w.clarityLiveSeerah(false); };
  w.loadIsraeliyat = function () {
    var el = $id("israeliyat-content");
    if (el) el.innerHTML = "<p>Isrāʾīliyyāt are used cautiously. Prefer Qur’an and ṣaḥīḥ Sunnah. Educational only — not a fatwa.</p>";
  };
  w.clarityIsraeliyatDeepFetch = w.loadIsraeliyat;
  w.clarityIsraeliyatExpandScholar = function () { w.open("https://sunnah.com", "_blank", "noopener"); };
  var STORIES = [
    { t: "Nūḥ — persistence", b: "Educational Qur’anic reflection." },
    { t: "Ibrāhīm — tawakkul", b: "Educational only — verify with tafsīr." },
    { t: "Yūsuf — purity under pressure", b: "Educational only." }
  ];
  var sti = 0;
  w.loadProphetStory = function () {
    sti = (sti + 1) % STORIES.length;
    var el = $id("prophet-story");
    if (el) el.innerHTML = "<strong>" + STORIES[sti].t + "</strong><p>" + STORIES[sti].b + "</p>";
  };
  w.expandAllSeerahTl = function () {
    root().querySelectorAll("details").forEach(function (x) { x.open = true; });
  };
  w.fetchSeerahOnlineSummaries = function () { w.clarityLiveSeerah(true); };
  w.clarityRefreshSection = function (sec) {
    if (sec === "seerah") w.clarityLiveSeerah(true);
  };

  /* Mirror */
  var MIRROR = [
    { t: "Truthfulness", m: "He ﷺ was al-Amīn before prophecy.", p: "Where can I tell the truth when it costs comfort?" },
    { t: "Mercy", m: "Gentle even when wronged.", p: "Whom can I treat more gently?" },
    { t: "Tawakkul", m: "In the cave: Allah is with us.", p: "What anxiety can I hand to Allah?" },
    { t: "Consistency", m: "Beloved deeds are regular ones.", p: "What one small deed can I keep daily?" }
  ];
  var mi = 0;
  function paintMirror() {
    var row = MIRROR[mi % MIRROR.length];
    var title = $id("sm-title");
    var moment = $id("sm-moment");
    var prompt = $id("sm-prompt");
    var lab = $id("sm-step-label");
    if (title) title.textContent = row.t;
    if (moment) moment.textContent = row.m;
    if (prompt) prompt.textContent = row.p;
    if (lab) lab.textContent = "Step " + (mi + 1) + " of " + MIRROR.length;
  }
  w.claritySeerahMirrorNext = function () { mi = (mi + 1) % MIRROR.length; paintMirror(); };
  w.claritySeerahMirrorDone = function () { w.claritySeerahMirrorNext(); };
  w.claritySeerahMirrorNote = function () { log("mirror-note"); };

  /* Quiz minimal */
  var BANK = [
    { id: "1", q: "How many farḍ prayers each day?", choices: ["Three", "Four", "Five", "Six"], a: 2, why: "Five daily prayers. Educational only." },
    { id: "2", q: "First pillar of Islam?", choices: ["Zakāh", "Shahāda", "Ḥajj", "Ṣawm"], a: 1, why: "Testimony of faith." },
    { id: "3", q: "Hijrah destination?", choices: ["Ṭāʾif", "Madinah", "Yemen", "Egypt"], a: 1, why: "Madinah." },
    { id: "4", q: "A fatwa is best seen as:", choices: ["Automatic for all", "Scholarly opinion for a context — not this quiz", "A hadith", "A translation"], a: 1, why: "This app never issues fatwas." }
  ];
  var fq = { deck: BANK.slice(), idx: 0, correct: 0, today: 0 };
  function fqPaint() {
    var stage = $id("fq-stage");
    if (!stage) return;
    if (fq.idx >= fq.deck.length) {
      stage.innerHTML = "<p><strong>Deck complete.</strong> Educational only — not a fatwa.</p>";
      return;
    }
    var c = fq.deck[fq.idx];
    var html = '<div style="font-weight:700;margin:0 0 .5rem">' + (fq.idx + 1) + ". " + c.q + "</div>";
    c.choices.forEach(function (ch, i) {
      html += '<button type="button" class="btn-soft fq-choice" data-i="' + i + '" style="display:block;width:100%;text-align:left;margin:.3rem 0">' + ch + "</button>";
    });
    html += '<p class="fq-why td-src" style="display:none;margin-top:.5rem"></p>';
    stage.innerHTML = html;
    stage.querySelectorAll(".fq-choice").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var pick = parseInt(btn.getAttribute("data-i"), 10);
        fq.today++;
        var why = stage.querySelector(".fq-why");
        if (pick === c.a) {
          fq.correct++;
          if (why) { why.style.display = "block"; why.textContent = "Correct. " + c.why; }
        } else if (why) {
          why.style.display = "block";
          why.textContent = "Review: " + c.why;
        }
        var today = $id("fq-today");
        if (today) today.textContent = "Today " + fq.correct + "/" + Math.max(fq.today, 4);
      });
    });
  }
  w.fqNext = function () { fq.idx++; fqPaint(); };
  w.fqForceNewDeck = function () { fq.idx = 0; fq.deck = BANK.slice(); fqPaint(); };
  w.fqResetToday = function () { fq.today = 0; fq.correct = 0; fq.idx = 0; fqPaint(); };
  w.fqSetLevel = function () { fqPaint(); };
  w.fqSetTopic = function () { fqPaint(); };
  w.fqResetSeenDecks = w.fqForceNewDeck;
  w.fqFetchOnlineDeck = w.fqForceNewDeck;
  w.fqUseStoredOnly = w.fqForceNewDeck;
  w.fqLogDailyProgress = function () {};
  w.fqShowDailyLog = function () { alert("Progress on this device only. Educational only — not a fatwa."); };
  w.siqShow = function (which) {
    var daily = $id("siq-panel-daily");
    var iq = $id("siq-panel-iq");
    if (daily) daily.style.display = which === "daily" ? "block" : "none";
    if (iq) iq.style.display = which === "iq" ? "block" : "none";
    if (which === "daily") fqPaint();
  };
  w.siqStart = function () { fqPaint(); };
  w.siqFetchOnlineBank = w.fqForceNewDeck;
  w.siqShowDailyLog = w.fqShowDailyLog;

  /* Ḥajj helpers */
  w.hajjWhereAmI = function () { if (typeof w.hajjShowStep === "function") w.hajjShowStep(0); };
  w.hajjChecklistPrint = function () { if (typeof w.hajjPrintChecklist === "function") w.hajjPrintChecklist(); };
  w.hajjChecklistReset = function () { log("hajj-reset"); };
  var tal = 0;
  w.hajjTalbiyah = function (n) {
    tal = Math.max(0, tal + (typeof n === "number" ? n : 1));
    var el = $id("hajj-talbiyah-count");
    if (el) el.textContent = String(tal);
  };
  w.hajjPlayTalbiyah = function () {
    try {
      var u = new SpeechSynthesisUtterance("Labbayka Allahumma labbayk");
      u.lang = "ar-SA";
      w.speechSynthesis.speak(u);
    } catch (e) {}
  };

  /* Safe stubs — no throw */
  function stub(name) {
    if (typeof w[name] === "function") return;
    w[name] = function () { log("stub:" + name); };
  }
  [
    "memeFetchBg","memeFetchRrra","memeShowBlankPalette","memeDailyVerse","memeFromJourney","memeFromCommand",
    "memeMasnunDua","memeNightQuote","memeFetchUrduDua","memeApplyUrduDua","memeAutoScaleLines",
    "memeCopyPng","memeSharePng","memeDownload","memeSendToTweetDesk",
    "calligMicToggle","calligMicStop","calligMicPlaceArabic","calligMicPlaceEnglish",
    "calligPlaceArabicOnCanvas","calligSendEnglishToCanvas","calligSendEnglishToMeme","calligTranslateToArabic",
    "notesCreate","notesSaveNow","notesExport","notesRequestDelete","notesRestoreSeed","notesSetView","notesToggleGrave","notesQuickFromSection",
    "tdSaveHandle","tdConnectX","tdCopy","tdDraft","tdPost","tdRefreshOnline","tdRemind","tdSendToMeme",
    "claritySurpriseMe","qaToggleList","ilmPathwayReset","resetName","loadLesson","loadVerse","loadAsma","showAllAsma","loadZikr",
    "nightBreathAct","nightBreathRefresh","soulCompassDone","addDeposit","resetDeposits","clarityInlineTTS","clarityLiveTafseer",
    "clarityLiveSamina","clarityTibbeNext","clarityLiveTajweed","playCurrentVerseAudio"
  ].forEach(stub);

  w.claritySurpriseMe = function () {
    w.nextCommand && w.nextCommand();
    w.loadHadith && w.loadHadith();
  };
  if (typeof w.switchTab !== "function") {
    w.switchTab = function (tab) {
      var b = d.querySelector('.cs-door [data-rail-tab="' + tab + '"]');
      if (b) b.click();
    };
  }

  function isLoading(el) {
    return el && /loading/i.test((el.textContent || "").trim());
  }
  function hydrate() {
    sanitizeLinks(d);
    sanitizeLinks(root());
    if (isLoading($id("command-box"))) loadCmd(0);
    if (isLoading($id("hadith"))) w.loadHadith();
    if (isLoading($id("prophet-name-box"))) w.loadProphetName(false);
    if (isLoading($id("life-event"))) w.loadLifeEvent();
    if (isLoading($id("seerah-content"))) w.clarityLiveSeerah(false);
    if (isLoading($id("prophet-story"))) w.loadProphetStory();
    if (isLoading($id("israeliyat-content"))) w.loadIsraeliyat();
    var sar = $id("seerah-live-ar");
    if (sar && !(sar.textContent || "").trim()) w.clarityLiveSeerah(false);
    var sam = $id("samina-verse-ar");
    if (sam && !(sam.textContent || "").trim()) w.clarityDailySaminaVerse(false);
    var sm = $id("sm-title");
    if (sm && (!(sm.textContent || "").trim() || /loading/i.test(sm.textContent))) paintMirror();
    var fqStage = $id("fq-stage");
    if (fqStage && !(fqStage.innerHTML || "").trim()) fqPaint();
    if (w.ClarityTabEngines && w.ClarityTabEngines.hydrate) {
      try { w.ClarityTabEngines.hydrate(); } catch (e) {}
    }
    log("hydrate");
  }

  function watch() {
    var mount = d.getElementById("cs-mount");
    if (mount) {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(hydrate, 40);
      }).observe(mount, { childList: true, subtree: true });
    }
    /* also watch whole document for late nav inject */
    d.addEventListener("click", function (ev) {
      var a = ev.target && ev.target.closest && ev.target.closest("a[href]");
      if (!a) return;
      var href = a.getAttribute("href") || "";
      if (href === "/yawm/" || href === "/yawm") {
        ev.preventDefault();
        w.location.href = "/daily/";
      }
    }, true);
    hydrate();
    setTimeout(hydrate, 250);
    setTimeout(hydrate, 800);
    setTimeout(honorHash, 500);
  }

  function boot() {
    sanitizeLinks(d);
    watch();
    log("repair-v3-boot");
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
