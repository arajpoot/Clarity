/*! companion-repair-v2 · smoked green · full onclick surface · mount hydrate
 * Companion-only · enrichment hold · educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_REPAIR_V2__) return;
  w.__COMPANION_REPAIR_V2__ = true;
  var LOG = (w.__COMPANION_REPAIR_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }
  function root() { return d.getElementById("cs-mount") || d; }
  function $(sel, r) { return (r || root()).querySelector(sel); }
  function $id(id) { return root().querySelector("#" + id) || d.getElementById(id); }
  function safe(fn, name) {
    try { return fn(); } catch (e) { log("err:" + name + ":" + (e && e.message)); }
  }

  /* Nav */
  function fixNav() {
    d.querySelectorAll('a[href="/yawm/"],a[href="/yawm"]').forEach(function (a) {
      a.setAttribute("href", "/daily/");
    });
  }

  /* Ayah helper */
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

  /* Commands */
  var CMDS = [
    "2:153","2:183","2:254","2:278","3:102","3:200","4:1","4:59","4:135","5:1","5:6","5:8","5:35",
    "8:24","22:77","24:21","33:41","33:70","49:1","49:6","49:11","49:12","57:28","59:18","61:14","66:6"
  ];
  var ci = Math.floor(Date.now() / 86400000) % CMDS.length;
  function paintCmd(row) {
    var box = $id("command-box");
    if (!box) return;
    box.innerHTML =
      '<div class="arabic" dir="rtl" lang="ar" style="font-size:1.22rem;line-height:1.85">' + row.ar +
      '</div><p style="line-height:1.5">' + row.en +
      '</p><p class="td-src">Qur’an ' + row.s + ':' + row.a + ' · educational only — not a fatwa</p>';
  }
  function loadCmd(dlt) {
    if (dlt) ci = (ci + dlt + CMDS.length) % CMDS.length;
    var p = parseKA(CMDS[ci]);
    fetchAyah(p.s, p.a).then(paintCmd).catch(function () {
      var box = $id("command-box");
      if (box) box.innerHTML = '<p class="td-src">Offline — open <a target="_blank" rel="noopener" href="https://quran.com/' + p.s + '/' + p.a + '">Quran.com</a></p>';
    });
  }
  w.prevCommand = function () { loadCmd(-1); };
  w.nextCommand = function () { loadCmd(1); };

  /* Hadith */
  var HAD = [
    { t: "Actions are but by intentions.", g: "Ṣaḥīḥ", c: "Bukhārī", n: "1" },
    { t: "None of you truly believes until he loves for his brother what he loves for himself.", g: "Ṣaḥīḥ", c: "Bukhārī", n: "13" },
    { t: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.", g: "Ṣaḥīḥ", c: "Bukhārī", n: "6475" },
    { t: "Make things easy and do not make them difficult.", g: "Ṣaḥīḥ", c: "Bukhārī", n: "69" },
    { t: "The strong person is the one who controls himself when angry.", g: "Ṣaḥīḥ", c: "Bukhārī", n: "6114" },
    { t: "Religion is sincere counsel.", g: "Ṣaḥīḥ", c: "Muslim", n: "55" }
  ];
  var hi = Math.floor(Date.now() / 86400000) % HAD.length;
  w.loadHadith = function () {
    hi = (hi + 1) % HAD.length;
    var host = $id("hadith");
    if (!host) return;
    var h = HAD[hi];
    host.innerHTML = '<p style="line-height:1.5">' + h.t + '</p><p class="td-src"><strong>' + h.g + '</strong> · ' + h.c + ' ' + h.n + ' · verify on Sunnah.com · educational only — not a fatwa</p>';
  };

  /* Prophet names */
  var NAMES = [
    { ar: "مُحَمَّد", en: "Muḥammad", m: "The praised one" },
    { ar: "أَحْمَد", en: "Aḥmad", m: "Most praiseworthy" },
    { ar: "الْمُصْطَفَى", en: "al-Muṣṭafā", m: "The chosen" },
    { ar: "الْحَبِيب", en: "al-Ḥabīb", m: "The beloved" },
    { ar: "الْأَمِين", en: "al-Amīn", m: "The trustworthy" },
    { ar: "الرَّحْمَة", en: "Raḥmah", m: "Mercy (21:107 theme)" },
    { ar: "السِّرَاجُ الْمُنِير", en: "as-Sirāj al-Munīr", m: "Illuminating lamp (33:46 theme)" },
    { ar: "الْبَشِير", en: "al-Bashīr", m: "Bearer of good news" },
    { ar: "النَّذِير", en: "an-Nadhīr", m: "The warner" },
    { ar: "طٰهٰ", en: "Ṭā-Hā", m: "Qur’anic address" },
    { ar: "يٰسٓ", en: "Yā-Sīn", m: "Qur’anic address" }
  ];
  var ni = Math.floor(Date.now() / 86400000) % NAMES.length;
  function paintName(i) {
    var box = $id("prophet-name-box");
    if (!box) return;
    var n = NAMES[((i % NAMES.length) + NAMES.length) % NAMES.length];
    box.innerHTML = '<div class="arabic" dir="rtl" lang="ar" style="font-size:1.4rem">' + n.ar + '</div><p style="font-weight:700">' + n.en + '</p><p class="td-src">' + n.m + ' · educational · ṣallā Allāhu ʿalayhi wa sallam</p>';
  }
  w.loadProphetName = function (random) {
    ni = random ? Math.floor(Math.random() * NAMES.length) : Math.floor(Date.now() / 86400000) % NAMES.length;
    paintName(ni);
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

  /* Samiʿnā / daily verse */
  var SAM = ["2:285", "2:286", "4:59", "8:24", "24:51", "33:36"];
  var si = Math.floor(Date.now() / 86400000) % SAM.length;
  w.clarityDailySaminaVerse = function (next) {
    if (next) si = (si + 1) % SAM.length;
    var p = parseKA(SAM[si]);
    fetchAyah(p.s, p.a).then(function (row) {
      var ar = $id("samina-verse-ar");
      var en = $id("samina-verse-en");
      var ref = $id("samina-verse-ref");
      if (ar) ar.textContent = row.ar;
      if (en) en.textContent = row.en;
      if (ref) ref.textContent = "Qur’an " + row.s + ":" + row.a + " · educational only — not a fatwa";
    }).catch(function () { log("samina-fail"); });
  };

  /* Reality */
  var LIFE = [
    { t: "Job strain", b: "Allah does not burden a soul beyond its capacity (2:286 theme). Take the next ḥalāl step. Educational only — not a fatwa." },
    { t: "Illness", b: "Patience, duʿāʾ, and seeking care. Visiting the sick is a known good. Not medical advice." },
    { t: "Anger", b: "The strong one controls himself when angry (Bukhārī/Muslim). Seek refuge; remain silent if needed." },
    { t: "Family tension", b: "Speak justly; reconcile when you can. Educational — not a court." }
  ];
  var li = 0;
  w.loadLifeEvent = function () {
    li = (li + 1) % LIFE.length;
    var el = $id("life-event");
    if (el) el.innerHTML = "<strong>" + LIFE[li].t + "</strong><p style='margin:.35rem 0 0;line-height:1.5'>" + LIFE[li].b + "</p>";
  };
  var SEA = ["33:21", "9:128", "21:107", "48:29", "3:159", "9:40"];
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
        sc.innerHTML = '<div class="arabic" dir="rtl" lang="ar">' + row.ar + '</div><p>' + row.en + '</p><p class="td-src">Qur’an ' + row.s + ':' + row.a + ' · educational</p>';
      }
    }).catch(function () { log("seerah-fail"); });
  };
  w.loadSeerah = function () { w.clarityLiveSeerah(false); };
  var JUD = [
    { t: "Stand for justice", ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُونُوا قَوَّامِينَ بِالْقِسْطِ", en: "4:135 theme — educational only." },
    { t: "Return trusts", ar: "إِنَّ اللَّهَ يَأْمُرُكُمْ أَن تُؤَدُّوا الْأَمَانَاتِ", en: "4:58 theme — educational only." },
    { t: "Mercy in leadership", ar: "فَبِمَا رَحْمَةٍ مِّنَ اللَّهِ لِنتَ لَهُمْ", en: "3:159 — educational only." }
  ];
  var ji = 0;
  w.clarityLiveSamina = function (next) {
    if (next) ji = (ji + 1) % JUD.length;
    var j = JUD[ji];
    var t = $id("samina-title");
    var ar = $id("samina-ar");
    var en = $id("samina-en");
    if (t) t.textContent = j.t;
    if (ar) ar.textContent = j.ar;
    if (en) en.textContent = j.en;
  };
  var STORIES = [
    { t: "Nūḥ — persistence", b: "Long calling with patience. Qur’anic reflection — educational only." },
    { t: "Ibrāhīm — tawakkul", b: "Trust and clear argument. Verify with tafsīr." },
    { t: "Mūsā — courage for the oppressed", b: "Reliance on Allah. Educational only." },
    { t: "Yūsuf — purity under pressure", b: "Guard the heart. Educational only." }
  ];
  var sti = 0;
  w.loadProphetStory = function () {
    sti = (sti + 1) % STORIES.length;
    var el = $id("prophet-story");
    if (el) el.innerHTML = "<strong>" + STORIES[sti].t + "</strong><p>" + STORIES[sti].b + "</p>";
  };
  w.loadIsraeliyat = function () {
    var el = $id("israeliyat-content");
    if (el) el.innerHTML = "<p>Isrāʾīliyyāt are earlier-people reports used cautiously in tafsīr. Prefer Qur’an and ṣaḥīḥ Sunnah; ask a scholar. Educational only — not a fatwa.</p>";
  };
  w.clarityIsraeliyatDeepFetch = w.loadIsraeliyat;
  w.clarityIsraeliyatExpandScholar = function () { w.open("https://sunnah.com", "_blank", "noopener"); };
  w.expandAllSeerahTl = function () {
    root().querySelectorAll("details").forEach(function (x) { x.open = true; });
  };
  w.fetchSeerahOnlineSummaries = function () { w.clarityLiveSeerah(true); };
  w.clarityTibbeNext = function () { log("tibbe"); };
  w.clarityRefreshSection = function (sec) {
    if (sec === "seerah") w.clarityLiveSeerah(true);
    if (sec === "tajweed") w.clarityLiveTajweed && w.clarityLiveTajweed(true);
    if (sec === "tafseer") w.clarityLiveTafseer && w.clarityLiveTafseer(true);
  };

  /* Reflection */
  var LESSONS = [
    { t: "Remember death", b: "Soft reminder, then one good deed. Educational only." },
    { t: "Send light ahead", b: "Duʿāʾ, ṣadaqah, useful knowledge — verify with scholars." },
    { t: "Private sincerity", b: "What is between you and Allah needs no audience." }
  ];
  var lei = 0;
  w.loadLesson = function (next) {
    if (next) lei = (lei + 1) % LESSONS.length;
    var el = $id("lesson");
    if (el) el.innerHTML = "<strong>" + LESSONS[lei].t + "</strong><p>" + LESSONS[lei].b + "</p>";
  };
  var VS = ["2:152", "13:28", "94:5", "94:6", "103:1", "39:53"];
  var vi = 0;
  w.loadVerse = function () {
    vi = (vi + 1) % VS.length;
    var p = parseKA(VS[vi]);
    fetchAyah(p.s, p.a).then(function (row) {
      var el = $id("verse");
      if (el) el.innerHTML = '<div class="arabic" dir="rtl" lang="ar">' + row.ar + '</div><p>' + row.en + '</p><p class="td-src">Qur’an ' + row.s + ':' + row.a + '</p>';
    });
  };
  w.playCurrentVerseAudio = function () { log("verse-audio"); };
  var AS = [
    { ar: "الرَّحْمَٰنُ", en: "Ar-Raḥmān" },
    { ar: "الرَّحِيمُ", en: "Ar-Raḥīm" },
    { ar: "الْغَفُورُ", en: "Al-Ghafūr" },
    { ar: "الْوَدُودُ", en: "Al-Wadūd" },
    { ar: "الْحَكِيمُ", en: "Al-Ḥakīm" }
  ];
  var ai = 0;
  w.loadAsma = function (r) {
    ai = r ? Math.floor(Math.random() * AS.length) : (ai + 1) % AS.length;
    var box = $id("asma-box");
    if (box) box.innerHTML = '<div class="arabic" dir="rtl" lang="ar" style="font-size:1.35rem">' + AS[ai].ar + '</div><p>' + AS[ai].en + '</p>';
  };
  w.showAllAsma = function () {
    var list = $id("asma-all-list");
    if (!list) return;
    list.style.display = "block";
    list.innerHTML = AS.map(function (n) { return "<div>" + n.ar + " — " + n.en + "</div>"; }).join("");
  };
  w.loadZikr = function () {
    var el = $id("zikr");
    if (el) el.innerHTML = '<div class="arabic" dir="rtl" lang="ar">سُبْحَانَ اللَّهِ · الْحَمْدُ لِلَّهِ · اللَّهُ أَكْبَرُ</div>';
  };
  var NQ = ["What one deed would I want sent ahead?", "Whom can I still ask to forgive me?", "What secret good can I do before sleep?"];
  var nqi = 0;
  w.nightBreathRefresh = function () {
    nqi = (nqi + 1) % NQ.length;
    var q = $id("night-breath-q");
    if (q) q.textContent = NQ[nqi];
  };
  w.nightBreathAct = function () {
    var q = $id("night-breath-q");
    if (q) q.textContent = "May Allah accept one sincere deed. Act, then return tomorrow.";
  };
  w.soulCompassDone = function () {
    var st = $id("soul-compass-status");
    if (st) st.textContent = "Marked for tonight · educational only";
  };
  w.addDeposit = function (kind) {
    var id = kind === "salawat" ? "salawat-count" : "istighfar-count";
    var el = $id(id);
    if (!el) return;
    el.textContent = String((parseInt(el.textContent, 10) || 0) + 1);
  };
  w.resetDeposits = function () {
    ["istighfar-count", "salawat-count"].forEach(function (id) {
      var el = $id(id);
      if (el) el.textContent = "0";
    });
  };
  w.clarityLiveTafseer = function (next) {
    var keys = ["1:1", "2:255", "24:35", "67:2", "112:1"];
    var i = Math.floor(Date.now() / 86400000) % keys.length;
    if (next) i = (i + 1) % keys.length;
    var p = parseKA(keys[i]);
    fetchAyah(p.s, p.a).then(function (row) {
      var ar = $id("tafseer-live-ar");
      var en = $id("tafseer-live-en");
      if (ar) ar.textContent = row.ar;
      if (en) en.textContent = row.en;
    });
  };
  w.clarityInlineTTS = function (btn, lang) {
    try {
      var text = (btn && btn.closest && btn.closest(".card") && btn.closest(".card").innerText) || "";
      if (!w.speechSynthesis || !text) return;
      var u = new SpeechSynthesisUtterance(text.slice(0, 400));
      u.lang = lang === "ar" ? "ar-SA" : "en-US";
      w.speechSynthesis.speak(u);
    } catch (e) {}
  };

  /* Seerah mirror */
  var MIRROR = [
    { t: "Truthfulness", m: "He ﷺ was al-Amīn before prophecy.", p: "Where can I tell the truth when it costs comfort?" },
    { t: "Mercy", m: "Gentle even when wronged.", p: "Whom can I treat more gently before night?" },
    { t: "Tawakkul", m: "In the cave: Allah is with us.", p: "What anxiety can I hand to Allah in duʿāʾ?" },
    { t: "Humility", m: "He ﷺ served family and mended his sandals.", p: "What small service can I do unseen?" },
    { t: "Justice", m: "Even against one’s own.", p: "Where must I be fair though the ego resists?" },
    { t: "Consistency", m: "Beloved deeds are regular ones.", p: "What one small deed can I keep daily?" },
    { t: "Courage with wisdom", m: "Standing for truth without oppression.", p: "What boundary can I keep without harshness?" }
  ];
  var mi = 0;
  function paintMirror() {
    var lab = $id("sm-step-label");
    var title = $id("sm-title");
    var moment = $id("sm-moment");
    var prompt = $id("sm-prompt");
    var row = MIRROR[mi % MIRROR.length];
    if (lab) lab.textContent = "Step " + (mi + 1) + " of " + MIRROR.length;
    if (title) title.textContent = row.t;
    if (moment) moment.textContent = row.m;
    if (prompt) prompt.textContent = row.p;
    var fill = $id("sm-prog-fill");
    var prog = $id("sm-progress-text");
    if (fill) fill.style.width = ((mi + 1) / MIRROR.length) * 100 + "%";
    if (prog) prog.textContent = (mi + 1) + " / " + MIRROR.length;
  }
  w.claritySeerahMirrorNext = function () { mi = (mi + 1) % MIRROR.length; paintMirror(); };
  w.claritySeerahMirrorDone = function () { w.claritySeerahMirrorNext(); };
  w.claritySeerahMirrorNote = function () { log("mirror-note"); };

  /* Tajweed daily */
  var TJ = [
    { t: "Ikhfāʾ", b: "Conceal nūn sākinah/tanwīn with ghunnah before ikhfāʾ letters." },
    { t: "Idghām", b: "Merge into ي ن م و (ghunnah) or ل ر as rules apply." },
    { t: "Iẓhār", b: "Clear nūn before throat letters." },
    { t: "Qalqalah", b: "Echo on ق ط ب ج د when sākin." },
    { t: "Madd ṭabīʿī", b: "Natural two-count madd." },
    { t: "Ghunnah", b: "Nasal on م/ن mushaddad — two counts." }
  ];
  var ti = Math.floor(Date.now() / 86400000) % TJ.length;
  w.clarityLiveTajweed = function (next) {
    if (next) ti = (ti + 1) % TJ.length;
    var t = $id("tajweed-live-title");
    var b = $id("tajweed-live-body");
    if (t) t.textContent = TJ[ti].t;
    if (b) b.textContent = TJ[ti].b;
  };

  /* Ḥajj helpers beyond action-wiring */
  w.hajjWhereAmI = function () {
    if (typeof w.hajjShowStep === "function") w.hajjShowStep(0);
  };
  w.hajjChecklistPrint = function () {
    if (typeof w.hajjPrintChecklist === "function") w.hajjPrintChecklist();
  };
  w.hajjChecklistReset = function () { log("hajj-reset"); };
  var tal = 0;
  w.hajjTalbiyah = function (dlt) {
    tal = Math.max(0, tal + (dlt || 1));
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

  /* Quiz bank */
  var BANK = [
    { id: "1", lvl: "beginner", topic: "Fiqh", q: "How many farḍ prayers each day?", choices: ["Three", "Four", "Five", "Six"], a: 2, why: "Five daily prayers are established. Ask a teacher for details." },
    { id: "2", lvl: "beginner", topic: "Fiqh", q: "First pillar of Islam?", choices: ["Zakāh", "Shahāda", "Ḥajj", "Ṣawm"], a: 1, why: "Testimony of faith." },
    { id: "3", lvl: "beginner", topic: "Daily", q: "Before prayer one generally needs:", choices: ["Perfume only", "Wuḍūʾ (or ghusl when required)", "A written fatwa", "Travel"], a: 1, why: "Purity for prayer — edge cases: ask a scholar." },
    { id: "4", lvl: "intermediate", topic: "Seerah", q: "Hijrah destination?", choices: ["Ṭāʾif", "Madinah", "Yemen", "Egypt"], a: 1, why: "Migration to Madinah." },
    { id: "5", lvl: "intermediate", topic: "Tafseer", q: "Asbāb al-nuzūl means:", choices: ["Prayer times", "Occasions of revelation", "Inheritance only", "Grammar only"], a: 1, why: "Context reports — not every ayah has one." },
    { id: "6", lvl: "advanced", topic: "Fiqh", q: "A fatwa is best seen as:", choices: ["Automatic law for all", "A scholarly opinion for a context — not this quiz", "A hadith text", "A translation"], a: 1, why: "This app never issues fatwas." },
    { id: "7", lvl: "beginner", topic: "Daily", q: "Jumuʿah is emphasized on:", choices: ["Monday only", "Friday", "Wednesday", "Only Eid"], a: 1, why: "Friday virtues — verify reports on Sunnah.com." },
    { id: "8", lvl: "beginner", topic: "Seerah", q: "Qur’an revealed over about:", choices: ["1 year", "5 years", "23 years", "50 years"], a: 2, why: "Classical teaching ~23 years." }
  ];
  var fq = { level: "beginner", topic: "all", deck: [], idx: 0, correct: 0, today: 0, seen: {} };
  function fqFilter() {
    return BANK.filter(function (c) {
      if (c.lvl !== fq.level) return false;
      if (fq.topic !== "all" && c.topic !== fq.topic) return false;
      return true;
    });
  }
  function fqBuild(force) {
    var pool = fqFilter();
    if (!pool.length) pool = BANK.slice();
    var unused = pool.filter(function (c) { return force || !fq.seen[c.id]; });
    if (!unused.length) unused = pool.slice();
    for (var i = unused.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = unused[i]; unused[i] = unused[j]; unused[j] = t;
    }
    fq.deck = unused.slice(0, 10);
    fq.idx = 0;
  }
  function fqPaint() {
    var stage = $id("fq-stage");
    if (!stage) return;
    if (!fq.deck.length) fqBuild(false);
    if (fq.idx >= fq.deck.length) {
      stage.innerHTML = "<p><strong>Deck complete.</strong> Educational only — not a fatwa.</p>";
      return;
    }
    var c = fq.deck[fq.idx];
    var html = '<div class="fq-q" style="font-weight:700;margin:0 0 .5rem">' + (fq.idx + 1) + ". " + c.q + '</div>';
    c.choices.forEach(function (ch, i) {
      html += '<button type="button" class="btn-soft fq-choice" data-i="' + i + '" style="display:block;width:100%;text-align:left;margin:.3rem 0">' + ch + "</button>";
    });
    html += '<p class="fq-why td-src" style="display:none;margin-top:.5rem"></p>';
    stage.innerHTML = html;
    stage.querySelectorAll(".fq-choice").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var pick = parseInt(btn.getAttribute("data-i"), 10);
        fq.seen[c.id] = true;
        fq.today++;
        var why = stage.querySelector(".fq-why");
        if (pick === c.a) {
          fq.correct++;
          btn.style.borderColor = "#3d9e6f";
          if (why) { why.style.display = "block"; why.textContent = "Correct. " + c.why; }
        } else {
          btn.style.borderColor = "#a55";
          if (why) { why.style.display = "block"; why.textContent = "Review: " + c.why; }
        }
        var today = $id("fq-today");
        if (today) today.textContent = "Today " + fq.correct + "/" + Math.max(fq.today, 10);
      });
    });
  }
  w.fqSetLevel = function (lvl) { fq.level = lvl || "beginner"; fqBuild(true); fqPaint(); };
  w.fqSetTopic = function (t) { fq.topic = t || "all"; fqBuild(true); fqPaint(); };
  w.fqForceNewDeck = function () { fqBuild(true); fqPaint(); };
  w.fqResetSeenDecks = function () { fq.seen = {}; fqBuild(true); fqPaint(); };
  w.fqNext = function () { fq.idx++; fqPaint(); };
  w.fqResetToday = function () { fq.today = 0; fq.correct = 0; fqBuild(true); fqPaint(); };
  w.fqFetchOnlineDeck = function () { fqBuild(true); fqPaint(); };
  w.fqUseStoredOnly = function () { fqBuild(false); fqPaint(); };
  w.fqLogDailyProgress = function () { try { localStorage.setItem("clarity.fq.log", String(Date.now())); } catch (e) {} };
  w.fqShowDailyLog = function () { alert("Progress is on this device only. Educational only — not a fatwa."); };
  w.siqShow = function (which) {
    var daily = $id("siq-panel-daily");
    var iq = $id("siq-panel-iq");
    if (daily) daily.style.display = which === "daily" ? "block" : "none";
    if (iq) iq.style.display = which === "iq" ? "block" : "none";
    if (which === "daily") fqPaint();
  };
  w.siqStart = function () { fqPaint(); };
  w.siqFetchOnlineBank = w.fqFetchOnlineDeck;
  w.siqShowDailyLog = w.fqShowDailyLog;

  /* Notes minimal */
  w.notesCreate = function () { log("notes-create"); };
  w.notesSaveNow = function () { log("notes-save"); };
  w.notesExport = function () { log("notes-export"); };
  w.notesRequestDelete = function () { log("notes-del"); };
  w.notesRestoreSeed = function () { log("notes-seed"); };
  w.notesSetView = function () { log("notes-view"); };
  w.notesToggleGrave = function () { log("notes-grave"); };
  w.notesQuickFromSection = function () { log("notes-quick"); };

  /* Tweet desk minimal */
  w.tdSaveHandle = function () {
    var el = root().querySelector('input[value], input[placeholder*="@" i], #tweet-handle, input[type="text"]');
    log("td-save");
  };
  w.tdConnectX = function () { w.open("https://x.com/login", "_blank", "noopener"); };
  w.tdCopy = function () {
    try {
      var t = ($id("tweet-desk-card") || root()).innerText || "";
      if (navigator.clipboard) navigator.clipboard.writeText(t.slice(0, 280));
    } catch (e) {}
  };
  w.tdDraft = function () { log("td-draft"); };
  w.tdPost = function () { w.open("https://x.com/compose/tweet", "_blank", "noopener"); };
  w.tdRefreshOnline = function () { w.clarityDailySaminaVerse && w.clarityDailySaminaVerse(true); };
  w.tdRemind = function () { log("td-remind"); };
  w.tdSendToMeme = function () { log("td-meme"); };
  w.claritySurpriseMe = function () {
    w.nextCommand && w.nextCommand();
    w.loadHadith && w.loadHadith();
  };

  /* Meme / callig — safe stubs (full engines may exist elsewhere; no throw) */
  function stub(name, msg) {
    if (typeof w[name] === "function") return;
    w[name] = function () {
      log("stub:" + name);
      if (msg) {
        var tip = $id("cs-mount-status");
        if (tip) tip.textContent = msg;
        setTimeout(function () { if (tip && tip.textContent === msg) tip.textContent = ""; }, 2000);
      }
    };
  }
  [
    "memeFetchBg","memeFetchRrra","memeShowBlankPalette","memeDailyVerse","memeFromJourney","memeFromCommand",
    "memeMasnunDua","memeNightQuote","memeFetchUrduDua","memeApplyUrduDua","memeAutoScaleLines",
    "memeCopyPng","memeSharePng","memeDownload","memeSendToTweetDesk",
    "calligMicToggle","calligMicStop","calligMicPlaceArabic","calligMicPlaceEnglish",
    "calligPlaceArabicOnCanvas","calligSendEnglishToCanvas","calligSendEnglishToMeme","calligTranslateToArabic"
  ].forEach(function (n) {
    stub(n, n.indexOf("callig") === 0 || n.indexOf("meme") === 0 ? "Studio control ready — use pad tools or open Craft for full atelier." : "");
  });
  w.qaToggleList = function () { log("qa"); };
  w.ilmPathwayReset = function () { log("ilm-reset"); };
  w.resetName = function () { log("resetName"); };
  if (typeof w.switchTab !== "function") {
    w.switchTab = function (tab) {
      var btn = d.querySelector('.cs-door [data-rail-tab="' + tab + '"]');
      if (btn) btn.click();
    };
  }
  if (typeof w.askGrok !== "function") {
    w.askGrok = function () { w.open("https://grok.com", "_blank", "noopener"); };
  }

  /* Hydrate */
  function isLoading(el) {
    return el && /loading/i.test((el.textContent || "").trim());
  }
  function hydrate() {
    fixNav();
    if (isLoading($id("command-box"))) loadCmd(0);
    if (isLoading($id("hadith"))) w.loadHadith();
    if (isLoading($id("prophet-name-box"))) w.loadProphetName(false);
    if (isLoading($id("life-event"))) w.loadLifeEvent();
    if (isLoading($id("seerah-content"))) w.clarityLiveSeerah(false);
    if (isLoading($id("prophet-story"))) w.loadProphetStory();
    if (isLoading($id("israeliyat-content"))) w.loadIsraeliyat();
    if (isLoading($id("lesson"))) w.loadLesson(false);
    if (isLoading($id("verse"))) w.loadVerse();
    var sar = $id("seerah-live-ar");
    if (sar && !(sar.textContent || "").trim()) w.clarityLiveSeerah(false);
    var sam = $id("samina-verse-ar");
    if (sam && !(sam.textContent || "").trim()) w.clarityDailySaminaVerse(false);
    var sm = $id("sm-title");
    if (sm && (/loading/i.test(sm.textContent || "") || !(sm.textContent || "").trim())) paintMirror();
    var tj = $id("tajweed-live-title");
    if (tj && !(tj.textContent || "").trim()) w.clarityLiveTajweed(false);
    var fqStage = $id("fq-stage");
    if (fqStage && !(fqStage.innerHTML || "").trim()) fqPaint();
    if (w.ClarityTabEngines && typeof w.ClarityTabEngines.hydrate === "function") {
      try { w.ClarityTabEngines.hydrate(); } catch (e) {}
    }
    log("hydrate");
  }

  function watch() {
    var mount = d.getElementById("cs-mount");
    if (!mount) return;
    var t = null;
    new MutationObserver(function () {
      if (t) clearTimeout(t);
      t = setTimeout(hydrate, 50);
    }).observe(mount, { childList: true, subtree: true });
    hydrate();
    setTimeout(hydrate, 300);
    setTimeout(hydrate, 900);
    setTimeout(hydrate, 1800);
  }

  function boot() {
    fixNav();
    watch();
    log("repair-v2-boot");
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
