/**
 * Arabic Lab Studio · 20261017SENT
 * S0–S8: MCQ engine · path levels · Jumlah sentences · banks · listen · links
 * Educational only — not a fatwa. Offline core + optional expand.
 */
(function (g) {
  "use strict";
  if (g.__CU_LAB_ARABIC_V1__) return;
  g.__CU_LAB_ARABIC_V1__ = true;

  var KEY = "cu_lab_ar_progress_v1";
  var KEY_BANK = "cu_lab_ar_bank_v1";
  var VER = "20261018FULL";
  var NEW_CAP = 10;
  var ALLOW_FETCH = false; /* S0: offline first; expand uses local bank JSON */

  var DECKS = {
    everyday: {
      id: "everyday", title: "Everyday words", level: 1, path: 1,
      cards: [
        { id: "e1", ar: "كِتَاب", en: "book", tr: "kitāb", emoji: "📖", example: "هَذَا كِتَابٌ.", root: "ك ت ب" },
        { id: "e2", ar: "قَلَم", en: "pen", tr: "qalam", emoji: "🖊️", example: "هَذَا قَلَمٌ." },
        { id: "e3", ar: "بَيْت", en: "house", tr: "bayt", emoji: "🏠", example: "هَذَا بَيْتٌ." },
        { id: "e4", ar: "مَاء", en: "water", tr: "māʾ", emoji: "💧", example: "هَذَا مَاءٌ." },
        { id: "e5", ar: "شَمْس", en: "sun", tr: "shams", emoji: "☀️", example: "هَذِهِ شَمْسٌ." },
        { id: "e6", ar: "قَمَر", en: "moon", tr: "qamar", emoji: "🌙", example: "هَذَا قَمَرٌ." },
        { id: "e7", ar: "قَلْب", en: "heart", tr: "qalb", emoji: "💚", example: "فِي الْقَلْبِ." },
        { id: "e8", ar: "بَاب", en: "door", tr: "bāb", emoji: "🚪", example: "هَذَا بَابٌ." },
        { id: "e9", ar: "سَلَام", en: "peace", tr: "salām", emoji: "🕊️", example: "السَّلَامُ عَلَيْكُمْ." },
        { id: "e10", ar: "طَعَام", en: "food", tr: "ṭaʿām", emoji: "🍽️", example: "هَذَا طَعَامٌ." }
      ]
    },
    salah: {
      id: "salah", title: "Ṣalāh lexicon", level: 2, path: 2,
      cards: [
        { id: "s1", ar: "صَلَاة", en: "prayer", tr: "ṣalāh", emoji: "🕌", example: "أُقِيمُ الصَّلَاةَ." },
        { id: "s2", ar: "وُضُوء", en: "ablution", tr: "wuḍūʾ", emoji: "💧" },
        { id: "s3", ar: "رُكُوع", en: "bowing", tr: "rukūʿ", emoji: "🙇" },
        { id: "s4", ar: "سُجُود", en: "prostration", tr: "sujūd", emoji: "🤲" },
        { id: "s5", ar: "قِبْلَة", en: "prayer direction", tr: "qiblah", emoji: "🧭" },
        { id: "s6", ar: "إِمَام", en: "prayer leader", tr: "imām", emoji: "👤" },
        { id: "s7", ar: "فَجْر", en: "dawn prayer time", tr: "fajr", emoji: "🌅" },
        { id: "s8", ar: "مَغْرِب", en: "sunset prayer time", tr: "maghrib", emoji: "🌇" }
      ]
    },
    stems: {
      id: "stems", title: "High-frequency stems", level: 3, path: 3,
      cards: [
        { id: "t1", ar: "عَلِمَ", en: "he knew", tr: "ʿalima", root: "ع ل م", example: "عَلِمَ الطَّالِبُ." },
        { id: "t2", ar: "كَتَبَ", en: "he wrote", tr: "kataba", root: "ك ت ب", example: "كَتَبَ الدَّرْسَ." },
        { id: "t3", ar: "قَرَأَ", en: "he read", tr: "qaraʾa", root: "ق ر أ", example: "قَرَأَ الْكِتَابَ." },
        { id: "t4", ar: "ذَهَبَ", en: "he went", tr: "dhahaba", root: "ذ ه ب" },
        { id: "t5", ar: "قَالَ", en: "he said", tr: "qāla", root: "ق و ل" },
        { id: "t6", ar: "سَمِعَ", en: "he heard", tr: "samiʿa", root: "س م ع" },
        { id: "t7", ar: "عَمِلَ", en: "he worked / did", tr: "ʿamila", root: "ع م ل" },
        { id: "t8", ar: "طَلَبَ", en: "he sought", tr: "ṭalaba", root: "ط ل ب" }
      ]
    },
    
    haramayn: {
      id: "haramayn", title: "Hajj & Ḥaramayn", level: 5, path: 2,
      cards: [
        { id: "hj1", ar: "لَبَّيْكَ", en: "Here I am (at Your service)", tr: "labbayk", emoji: "🕋", example: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ." },
        { id: "hj2", ar: "حَجّ", en: "pilgrimage (Ḥajj)", tr: "ḥajj", emoji: "🕌" },
        { id: "hj3", ar: "عُمْرَة", en: "lesser pilgrimage", tr: "ʿumrah", emoji: "🌙" },
        { id: "hj4", ar: "طَوَاف", en: "circumambulation", tr: "ṭawāf", emoji: "🔄" },
        { id: "hj5", ar: "سَعْي", en: "Saʿy (Ṣafā–Marwah)", tr: "saʿy", emoji: "🚶" },
        { id: "hj6", ar: "كَعْبَة", en: "the Kaʿbah", tr: "kaʿbah", emoji: "🕋" },
        { id: "hj7", ar: "زَمْزَم", en: "Zamzam", tr: "zamzam", emoji: "💧" },
        { id: "hj8", ar: "مَدِينَة", en: "Madinah", tr: "madīnah", emoji: "💚" },
        { id: "hj9", ar: "مَسْجِد", en: "mosque", tr: "masjid", emoji: "🕌", example: "هَذَا مَسْجِدٌ." },
        { id: "hj10", ar: "عَرَفَة", en: "ʿArafah", tr: "ʿarafah", emoji: "⛰️" }
      ]
    },
    path: {
      id: "path", title: "Path / adab pack", level: 4, path: 4,
      cards: [
        { id: "p1", ar: "أَدَب", en: "manners / adab", tr: "adab", emoji: "🌿", example: "الْأَدَبُ نُورٌ." },
        { id: "p2", ar: "عِلْم", en: "knowledge", tr: "ʿilm", emoji: "📚", root: "ع ل م" },
        { id: "p3", ar: "صِدْق", en: "truthfulness", tr: "ṣidq", emoji: "✨" },
        { id: "p4", ar: "أَمَانَة", en: "trust", tr: "amānah", emoji: "🔒" },
        { id: "p5", ar: "صَبْر", en: "patience", tr: "ṣabr", emoji: "🕊️" },
        { id: "p6", ar: "دَعْوَة", en: "invitation / daʿwah", tr: "daʿwah", emoji: "📣" }
      ]
    }
  };

  var LETTERS = [
    { ar: "ا", name: "alif" }, { ar: "ب", name: "bāʾ" }, { ar: "ت", name: "tāʾ" },
    { ar: "ث", name: "thāʾ" }, { ar: "ج", name: "jīm" }, { ar: "ح", name: "ḥāʾ" },
    { ar: "خ", name: "khāʾ" }, { ar: "د", name: "dāl" }, { ar: "ذ", name: "dhāl" },
    { ar: "ر", name: "rāʾ" }, { ar: "ز", name: "zāy" }, { ar: "س", name: "sīn" },
    { ar: "ش", name: "shīn" }, { ar: "ص", name: "ṣād" }, { ar: "ض", name: "ḍād" },
    { ar: "ط", name: "ṭāʾ" }, { ar: "ظ", name: "ẓāʾ" }, { ar: "ع", name: "ʿayn" },
    { ar: "غ", name: "ghayn" }, { ar: "ف", name: "fāʾ" }, { ar: "ق", name: "qāf" },
    { ar: "ك", name: "kāf" }, { ar: "ل", name: "lām" }, { ar: "م", name: "mīm" },
    { ar: "ن", name: "nūn" }, { ar: "ه", name: "hāʾ" }, { ar: "و", name: "wāw" },
    { ar: "ي", name: "yāʾ" }
  ];

  var SENT_BANK = null;
  var EXTRA_CARDS = [];

  var state = {
    deckId: "everyday",
    mode: "flash",
    ix: 0,
    flipped: false,
    production: false,
    matchPairs: [],
    matchSelected: null,
    matchMatched: {},
    learnQueue: [],
    testItems: [],
    testIx: 0,
    testScore: 0,
    sentItems: [],
    sentIx: 0,
    sentScore: 0,
    listenItems: [],
    listenIx: 0,
    listenScore: 0,
    pathPhase: 1
  };

  function $(id) { return document.getElementById(id); }

  function loadProg() {
    try {
      var o = JSON.parse(localStorage.getItem(KEY) || "null");
      if (o && typeof o === "object") return o;
    } catch (e) {}
    return { due: {}, interval: {}, seen: 0, newToday: {}, day: "" };
  }
  function saveProg(p) {
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {}
  }

  /* S2 path phase from University progress (read-only) */
  function detectPathPhase() {
    try {
      var reg = JSON.parse(localStorage.getItem("cu_uni_registration_v1") || "null");
      var prog = JSON.parse(localStorage.getItem("cu_uni_progress_v1") || "null");
      var ph = (prog && prog.phase) || (reg && reg.phase) || 1;
      ph = Math.max(1, Math.min(4, parseInt(ph, 10) || 1));
      state.pathPhase = ph;
      return ph;
    } catch (e) {
      state.pathPhase = 1;
      return 1;
    }
  }

  function suggestDeckForPath() {
    var ph = detectPathPhase();
    var map = { 1: "everyday", 2: "salah", 3: "stems", 4: "path" };
    return map[ph] || "everyday";
  }

  function cards() {
    var base = (DECKS[state.deckId] && DECKS[state.deckId].cards) || [];
    if (!EXTRA_CARDS.length) return base;
    var path = DECKS[state.deckId] && DECKS[state.deckId].path;
    var extra = EXTRA_CARDS.filter(function (c) {
      return !c._path || c._path === path;
    });
    return base.concat(extra);
  }
  function cardAt() {
    var c = cards();
    return c[state.ix % Math.max(c.length, 1)] || null;
  }

  function schedule(cardId, grade) {
    var p = loadProg();
    p.due = p.due || {};
    p.interval = p.interval || {};
    var day = 24 * 60 * 60 * 1000;
    var prev = p.interval[cardId] || 0;
    var next = day;
    if (grade === "again") next = 0.25 * day;
    else if (grade === "hard") next = Math.max(day, prev * 1.2);
    else if (grade === "good") next = Math.max(day, prev ? prev * 2.2 : day * 2);
    else if (grade === "easy") next = Math.max(day * 3, prev ? prev * 3 : day * 4);
    p.interval[cardId] = next;
    p.due[cardId] = Date.now() + next;
    p.seen = (p.seen || 0) + 1;
    saveProg(p);
    return p;
  }

  function dueList() {
    var p = loadProg();
    var now = Date.now();
    return cards().filter(function (c) {
      return p.due && p.due[c.id] && p.due[c.id] <= now;
    });
  }

  function speak(ar) {
    try {
      if (!g.speechSynthesis) return;
      g.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(ar);
      u.lang = "ar-SA";
      u.rate = 0.82;
      var voices = g.speechSynthesis.getVoices() || [];
      var arV = voices.find(function (v) { return (v.lang || "").toLowerCase().indexOf("ar") === 0; });
      if (arV) u.voice = arV;
      g.speechSynthesis.speak(u);
    } catch (e) {}
  }

  /* S1 MCQ engine */
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function mcqChoices(correct, pool, n) {
    n = n || 4;
    var opts = [correct];
    var rest = pool.filter(function (x) { return x !== correct; });
    rest = shuffle(rest);
    while (opts.length < n && rest.length) opts.push(rest.shift());
    return shuffle(opts);
  }

  function buildMeaningMcq(list) {
    var pool = list.map(function (c) { return c.en; });
    return shuffle(list).slice(0, Math.min(8, list.length)).map(function (card) {
      return {
        kind: "meaning",
        card: card,
        promptAr: card.ar,
        promptTr: card.tr,
        choices: mcqChoices(card.en, pool, 4),
        answer: card.en
      };
    });
  }

  function buildListenMcq(list) {
    var pool = list.map(function (c) { return c.en; });
    return shuffle(list).slice(0, Math.min(6, list.length)).map(function (card) {
      return {
        kind: "listen",
        card: card,
        choices: mcqChoices(card.en, pool, 4),
        answer: card.en
      };
    });
  }

  function setupTest() {
    state.testItems = buildMeaningMcq(cards());
    state.testIx = 0;
    state.testScore = 0;
  }
  function setupListen() {
    state.listenItems = buildListenMcq(cards());
    state.listenIx = 0;
    state.listenScore = 0;
  }

  /* S3 Sentence / Jumlah */
  function setupSentence() {
    var ph = String(DECKS[state.deckId] && DECKS[state.deckId].path || state.pathPhase || 1);
    var list = (SENT_BANK && SENT_BANK[ph]) || (SENT_BANK && SENT_BANK["1"]) || [];
    state.sentItems = shuffle(list).map(function (s) {
      if (s.pattern === "vso" && s.parts) {
        var correct = s.parts.verb + " · " + s.parts.subject + " · " + s.parts.object;
        var wrong1 = s.parts.subject + " · " + s.parts.verb + " · " + s.parts.object;
        var wrong2 = s.parts.object + " · " + s.parts.subject + " · " + s.parts.verb;
        var wrong3 = s.parts.verb + " · " + s.parts.object + " · " + s.parts.subject;
        return {
          kind: "vso",
          sent: s,
          prompt: "Choose the VSO order (verb · subject · object)",
          choices: shuffle([correct, wrong1, wrong2, wrong3]),
          answer: correct,
          reveal: s.ar + " — " + s.en
        };
      }
      if (s.pattern === "cloze") {
        return {
          kind: "cloze",
          sent: s,
          prompt: s.ar.replace(s.blank, "___") + " — " + s.en,
          choices: shuffle(s.options || [s.blank]),
          answer: s.blank,
          reveal: s.ar
        };
      }
      /* nominal / template: meaning MCQ */
      return {
        kind: "sent-meaning",
        sent: s,
        prompt: s.ar,
        choices: mcqChoices(s.en, (list.map(function (x) { return x.en; })), 4),
        answer: s.en,
        reveal: s.en
      };
    });
    state.sentIx = 0;
    state.sentScore = 0;
  }

  function setupMatch() {
    var c = cards().slice(0, 6);
    var pairs = [];
    c.forEach(function (card) {
      pairs.push({ id: card.id, side: "ar", text: card.ar, pair: card.id });
      pairs.push({ id: card.id + "-en", side: "en", text: card.en, pair: card.id });
    });
    state.matchPairs = shuffle(pairs);
    state.matchSelected = null;
    state.matchMatched = {};
  }

  function setupLearn() {
    var due = dueList();
    var list = due.length ? due : cards();
    state.learnQueue = list;
    state.ix = 0;
    state.flipped = false;
  }

  function setMode(m) {
    state.mode = m;
    state.flipped = false;
    state.ix = 0;
    if (m === "match") setupMatch();
    if (m === "learn" || m === "reviews") { setupLearn(); state.mode = "learn"; }
    if (m === "test") setupTest();
    if (m === "listen") setupListen();
    if (m === "sentence") setupSentence();
    render();
  }

  function grade(gname) {
    var card = state.learnQueue[state.ix] || cardAt();
    if (card) schedule(card.id, gname);
    state.ix++;
    state.flipped = false;
    if (state.learnQueue.length && state.ix >= state.learnQueue.length) {
      state.ix = 0;
      setupLearn();
    }
    render();
  }

  function renderFlashCard(card, flipped, production) {
    if (!card) return "<p>No cards.</p>";
    var front, back;
    if (production) {
      front = '<div class="ar-visual">' + (card.emoji ? '<div class="ar-emoji">' + card.emoji + "</div>" : "") +
        '<div class="ar-en">' + card.en + "</div></div>";
      back = '<div class="ar-ar" dir="rtl" lang="ar">' + card.ar + "</div>" +
        '<span class="ar-tr">' + (card.tr || "") + "</span>" +
        (card.example ? '<p class="ar-ex" dir="rtl" lang="ar">' + card.example + "</p>" : "") +
        (card.root ? '<p class="ar-root">Root · ' + card.root + "</p>" : "");
    } else {
      front = '<div class="ar-visual">' + (card.emoji ? '<div class="ar-emoji">' + card.emoji + "</div>" : "") +
        '<div class="ar-ar" dir="rtl" lang="ar">' + card.ar + "</div>" +
        '<span class="ar-tr">' + (card.tr || "") + "</span></div>";
      back = '<div class="ar-en">' + card.en + "</div>" +
        (card.example ? '<p class="ar-ex" dir="rtl" lang="ar">' + card.example + "</p>" : "") +
        (card.root ? '<p class="ar-root">Root · ' + card.root + "</p>" : "");
    }
    return (
      '<div class="ar-card-wrap"><div class="ar-flash' + (flipped ? " flipped" : "") +
      '" id="ar-flash-card" role="button" tabindex="0">' +
      '<div class="ar-face ar-front">' + front + "</div>" +
      '<div class="ar-face ar-back">' + back + "</div></div>" +
      '<div class="ar-actions">' +
      '<button type="button" class="ar-btn primary" id="ar-hear">Hear</button>' +
      '<button type="button" class="ar-btn" id="ar-flip">Flip</button>' +
      '<button type="button" class="ar-btn" id="ar-next">Next</button>' +
      '<button type="button" class="ar-btn" id="ar-prod">' +
      (production ? "Arabic→Meaning" : "Meaning→Arabic") +
      "</button></div>" +
      '<p class="ar-meta">' + String(state.ix + 1).padStart(2, "0") + "/" +
      String(cards().length).padStart(2, "0") + " · " +
      ((DECKS[state.deckId] && DECKS[state.deckId].title) || "") + "</p></div>"
    );
  }

  function renderMcqBlock(item, score, total, ix) {
    if (!item) {
      return (
        '<div class="ar-card-wrap"><p class="ar-en">Score: ' + score + "/" + total +
        '</p><button type="button" class="ar-btn primary" id="ar-retest">Again</button>' +
        '<p class="ar-note">Pattern practice — educational only, not a grammar fatwa.</p></div>'
      );
    }
    var prompt = "";
    if (item.kind === "listen") {
      prompt = '<p class="ar-en">Listen, then choose the meaning</p>' +
        '<button type="button" class="ar-btn primary" id="ar-hear-q">Hear word</button>';
    } else if (item.kind === "vso" || item.kind === "cloze" || item.kind === "sent-meaning") {
      prompt = '<p class="ar-note">' + (item.prompt || "") + "</p>" +
        (item.kind === "sent-meaning" ? '<div class="ar-ar" dir="rtl" lang="ar">' + item.prompt + "</div>" : "");
    } else {
      prompt = '<div class="ar-ar" dir="rtl" lang="ar">' + (item.promptAr || "") + "</div>" +
        (item.promptTr ? '<span class="ar-tr">' + item.promptTr + "</span>" : "");
    }
    var opts = (item.choices || [])
      .map(function (o) {
        return '<button type="button" class="ar-btn block" data-mcq="' +
          String(o).replace(/"/g, "&quot;") + '">' + o + "</button>";
      })
      .join("");
    return (
      '<div class="ar-card-wrap">' + prompt +
      '<div class="ar-actions" style="flex-direction:column;align-items:stretch;margin-top:.75rem">' +
      opts + "</div>" +
      '<p class="ar-meta">' + (ix + 1) + "/" + total + " · multiple choice</p></div>"
    );
  }

  function renderLearn() {
    var card = state.learnQueue[state.ix] || cardAt();
    return (
      '<p class="ar-session">Reviews due: <strong>' + dueList().length +
      "</strong> · grade honestly</p>" +
      renderFlashCard(card, state.flipped, false) +
      '<div class="ar-grade">' +
      '<button type="button" class="ar-btn" data-grade="again">Again</button>' +
      '<button type="button" class="ar-btn" data-grade="hard">Hard</button>' +
      '<button type="button" class="ar-btn primary" data-grade="good">Good</button>' +
      '<button type="button" class="ar-btn" data-grade="easy">Easy</button></div>'
    );
  }

  function renderMatch() {
    var cells = state.matchPairs
      .map(function (p, i) {
        var done = state.matchMatched[p.pair];
        var sel = state.matchSelected === i;
        return (
          '<button type="button" class="ar-match-cell' + (done ? " done" : "") +
          (sel ? " sel" : "") + '" data-mi="' + i + '"' + (done ? " disabled" : "") +
          ">" + p.text + "</button>"
        );
      })
      .join("");
    return '<div class="ar-card-wrap"><div class="ar-match-grid">' + cells + "</div></div>";
  }

  function renderType() {
    var card = cardAt();
    if (!card) return "<p>No cards.</p>";
    var pool = cards().map(function (c) { return c.ar; });
    var choices = mcqChoices(card.ar, pool, 4);
    var opts = choices
      .map(function (o) {
        return '<button type="button" class="ar-btn block" dir="rtl" lang="ar" data-type-mcq="' +
          o.replace(/"/g, "") + '">' + o + "</button>";
      })
      .join("");
    return (
      '<div class="ar-card-wrap"><p class="ar-en">' + card.en +
      '</p><p class="ar-note" style="text-align:center">Choose the Arabic (MCQ)</p>' +
      '<div class="ar-actions" style="flex-direction:column;align-items:stretch">' + opts + "</div>" +
      '<div class="ar-actions"><button type="button" class="ar-btn" id="ar-hear">Hear</button>' +
      '<button type="button" class="ar-btn" id="ar-next">Next</button></div>' +
      '<p class="ar-meta" id="ar-type-msg"></p></div>'
    );
  }

  function renderLetters() {
    return (
      '<div class="ar-card-wrap"><div class="ar-letters">' +
      LETTERS.map(function (L) {
        return (
          '<button type="button" class="ar-letter" data-letter="' + L.ar +
          '"><span dir="rtl" lang="ar">' + L.ar + "</span><small>" + L.name +
          "</small></button>"
        );
      }).join("") +
      '</div><p class="ar-note">Tap a letter to hear. Educational script practice only.</p></div>'
    );
  }

  function render() {
    var root = $("ar-studio");
    if (!root) return;
    var dueN = dueList().length;
    var pathNote =
      '<p class="ar-path">Path phase <strong>' + state.pathPhase +
      "</strong> · suggested deck: <strong>" +
      ((DECKS[suggestDeckForPath()] && DECKS[suggestDeckForPath()].title) || "Everyday") +
      '</strong> <button type="button" class="ar-btn" id="ar-use-path">Use path deck</button></p>';

    var session =
      '<div class="ar-session-bar">' +
      '<button type="button" class="ar-btn primary" data-mode="reviews">Due (' + dueN + ")</button>" +
      '<button type="button" class="ar-btn" id="ar-expand">Expand bank</button>' +
      '<a class="ar-btn ar-btn-link" href="/campus/desk/seeker/">Desk</a>' +
      '<a class="ar-btn ar-btn-link" href="/vault/#locker">Vault</a>' +
      '<a class="ar-btn ar-btn-link" href="/lab/tajweed/">Tajweed</a></div>';

    var modes = ["flash", "match", "learn", "test", "listen", "sentence", "type", "letters"];
    var modeBar =
      '<div class="ar-modes" role="toolbar">' +
      modes
        .map(function (m) {
          var label = m === "sentence" ? "Jumlah" : m.charAt(0).toUpperCase() + m.slice(1);
          return (
            '<button type="button" class="ar-mode-btn' + (state.mode === m ? " here" : "") +
            '" data-mode="' + m + '">' + label + "</button>"
          );
        })
        .join("") +
      "</div>";

    var deckBar =
      '<div class="ar-decks">' +
      Object.keys(DECKS)
        .map(function (id) {
          var d = DECKS[id];
          return (
            '<button type="button" class="ar-deck-btn' + (state.deckId === id ? " here" : "") +
            '" data-deck="' + id + '">L' + d.level + " · " + d.title + "</button>"
          );
        })
        .join("") +
      "</div>";

    var body = "";
    if (state.mode === "flash") body = renderFlashCard(cardAt(), state.flipped, state.production);
    else if (state.mode === "match") body = renderMatch();
    else if (state.mode === "learn") body = renderLearn();
    else if (state.mode === "test")
      body = renderMcqBlock(state.testItems[state.testIx], state.testScore, state.testItems.length, state.testIx);
    else if (state.mode === "listen")
      body = renderMcqBlock(state.listenItems[state.listenIx], state.listenScore, state.listenItems.length, state.listenIx);
    else if (state.mode === "sentence")
      body = renderMcqBlock(state.sentItems[state.sentIx], state.sentScore, state.sentItems.length, state.sentIx);
    else if (state.mode === "type") body = renderType();
    else if (state.mode === "letters") body = renderLetters();

    try {
      if (!pathNote) pathNote = "";
      if (!session) session = "";
      if (!deckBar) deckBar = "";
      if (!modeBar) modeBar = "";
      if (!body) body = '<p class="ar-note">Loading cards…</p>';
      root.innerHTML =
        pathNote +
        session +
        deckBar +
        modeBar +
        '<div class="ar-stage">' +
        body +
        "</div>" +
        '<p class="ar-note">On-device · <code>cu_lab_ar_*</code> · Pattern practice is not a grammar fatwa. Verify with a trusted teacher.</p>';
    } catch (err) {
      root.innerHTML =
        '<p class="ar-note">Studio UI error — retry. Educational only.</p>' +
        pathNote +
        session +
        deckBar +
        modeBar;
      try {
        console.error("[CuLabArabic render]", err);
      } catch (e2) {}
    }

    try {
      bind();
    } catch (e3) {
      try {
        console.error("[CuLabArabic bind]", e3);
      } catch (e4) {}
    }
  }

  function answerMcq(mode, choice) {
    var item, ixKey, scoreKey, listKey;
    if (mode === "test") {
      item = state.testItems[state.testIx];
      if (!item) return;
      if (choice === item.answer) state.testScore++;
      if (item.card) schedule(item.card.id, choice === item.answer ? "good" : "again");
      state.testIx++;
    } else if (mode === "listen") {
      item = state.listenItems[state.listenIx];
      if (!item) return;
      if (choice === item.answer) state.listenScore++;
      if (item.card) schedule(item.card.id, choice === item.answer ? "good" : "again");
      state.listenIx++;
    } else if (mode === "sentence") {
      item = state.sentItems[state.sentIx];
      if (!item) return;
      if (choice === item.answer) state.sentScore++;
      state.sentIx++;
    }
    render();
  }

  function bind() {
    var root = $("ar-studio");
    if (!root) return;

    root.querySelectorAll("[data-mode]").forEach(function (b) {
      b.onclick = function () { setMode(b.getAttribute("data-mode")); };
    });
    root.querySelectorAll("[data-deck]").forEach(function (b) {
      b.onclick = function () {
        state.deckId = b.getAttribute("data-deck");
        state.ix = 0;
        state.flipped = false;
        if (state.mode === "match") setupMatch();
        if (state.mode === "learn") setupLearn();
        if (state.mode === "test") setupTest();
        if (state.mode === "listen") setupListen();
        if (state.mode === "sentence") setupSentence();
        render();
      };
    });

    var usePath = $("ar-use-path");
    if (usePath)
      usePath.onclick = function () {
        state.deckId = suggestDeckForPath();
        state.ix = 0;
        render();
      };

    var expand = $("ar-expand");
    if (expand)
      expand.onclick = function () {
        loadBank(function () {
          var st = document.createElement("p");
          st.className = "ar-note";
          st.textContent = "Bank expanded from local educational pack (cached).";
          var stage = root.querySelector(".ar-stage");
          if (stage) stage.appendChild(st);
          render();
        });
      };

    var hear = $("ar-hear");
    if (hear)
      hear.onclick = function () {
        var c = state.mode === "learn" ? state.learnQueue[state.ix] : cardAt();
        if (c) speak(c.ar);
      };
    var hearQ = $("ar-hear-q");
    if (hearQ)
      hearQ.onclick = function () {
        var item = state.listenItems[state.listenIx];
        if (item && item.card) speak(item.card.ar);
      };

    var flip = $("ar-flip");
    if (flip) flip.onclick = function () { state.flipped = !state.flipped; render(); };
    var flash = $("ar-flash-card");
    if (flash) flash.onclick = function () { state.flipped = !state.flipped; render(); };
    var next = $("ar-next");
    if (next)
      next.onclick = function () {
        state.ix = (state.ix + 1) % Math.max(cards().length, 1);
        state.flipped = false;
        render();
      };
    var prod = $("ar-prod");
    if (prod)
      prod.onclick = function () {
        state.production = !state.production;
        state.flipped = false;
        render();
      };

    root.querySelectorAll("[data-grade]").forEach(function (b) {
      b.onclick = function () { grade(b.getAttribute("data-grade")); };
    });

    root.querySelectorAll("[data-mcq]").forEach(function (b) {
      b.onclick = function () {
        answerMcq(state.mode, b.getAttribute("data-mcq"));
      };
    });

    root.querySelectorAll("[data-type-mcq]").forEach(function (b) {
      b.onclick = function () {
        var card = cardAt();
        var choice = b.getAttribute("data-type-mcq");
        var msg = $("ar-type-msg");
        var ok = card && choice === card.ar;
        if (msg) msg.textContent = ok ? "Correct" : "Not yet — " + (card && card.ar);
        if (card) schedule(card.id, ok ? "good" : "again");
      };
    });

    var retest = $("ar-retest");
    if (retest)
      retest.onclick = function () {
        if (state.mode === "test") setupTest();
        else if (state.mode === "listen") setupListen();
        else if (state.mode === "sentence") setupSentence();
        render();
      };

    root.querySelectorAll("[data-mi]").forEach(function (b) {
      b.onclick = function () {
        var i = parseInt(b.getAttribute("data-mi"), 10);
        if (state.matchMatched[state.matchPairs[i].pair]) return;
        if (state.matchSelected == null) {
          state.matchSelected = i;
          render();
          return;
        }
        var a = state.matchPairs[state.matchSelected];
        var c = state.matchPairs[i];
        if (a.pair === c.pair && a.side !== c.side) {
          state.matchMatched[a.pair] = true;
          state.matchSelected = null;
        } else state.matchSelected = i;
        render();
      };
    });

    root.querySelectorAll("[data-letter]").forEach(function (b) {
      b.onclick = function () { speak(b.getAttribute("data-letter")); };
    });
  }

  /* S4 load local bank */
  function loadBank(cb) {
    function apply(data) {
      if (!data) { if (cb) cb(false); return; }
      SENT_BANK = data.sentences || SENT_BANK;
      EXTRA_CARDS = [];
      var packs = data.packs || {};
      Object.keys(packs).forEach(function (pk) {
        var path = pk.indexOf("salah") >= 0 ? 2 : 1;
        (packs[pk] || []).forEach(function (c) {
          c._path = path;
          EXTRA_CARDS.push(c);
        });
      });
      try {
        localStorage.setItem(KEY_BANK, JSON.stringify({ at: Date.now(), n: EXTRA_CARDS.length }));
      } catch (e) {}
      if (cb) cb(true);
    }
    try {
      var cached = JSON.parse(localStorage.getItem(KEY_BANK + "_data") || "null");
      if (cached && cached.sentences) {
        apply(cached);
        return;
      }
    } catch (e) {}
    fetch("/lab/arabic/bank.json?v=" + VER)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        try {
          localStorage.setItem(KEY_BANK + "_data", JSON.stringify(data));
        } catch (e) {}
        apply(data);
      })
      .catch(function () {
        /* embedded minimal sentences if fetch fails */
        SENT_BANK = {
          "1": [{ id: "j1a", pattern: "nominal", ar: "هَذَا كِتَابٌ.", en: "This is a book." }],
          "2": [{ id: "j2a", pattern: "template", ar: "عِنْدِي كِتَابٌ.", en: "I have a book." }],
          "3": [{
            id: "j3a", pattern: "vso", ar: "كَتَبَ الطَّالِبُ الدَّرْسَ.", en: "The student wrote the lesson.",
            parts: { verb: "كَتَبَ", subject: "الطَّالِبُ", object: "الدَّرْسَ" }
          }],
          "4": [{ id: "j4a", pattern: "cloze", ar: "الْعِلْمُ نُورٌ.", en: "Knowledge is light.", blank: "نُورٌ", options: ["نُورٌ", "بَيْتٌ", "قَلَمٌ", "بَابٌ"] }]
        };
        if (cb) cb(false);
      });
  }

  function boot() {
    detectPathPhase();
    state.deckId = suggestDeckForPath();
    var host = $("ar-studio");
    if (!host) {
      host = document.createElement("div");
      host.id = "ar-studio";
      var main = document.querySelector("main.cu-wrap") || document.querySelector("main");
      if (main) main.appendChild(host);
      else document.body.appendChild(host);
    }
    /* paint shell immediately so L1–L5 + modes never disappear */
    try {
      render();
    } catch (e) {}
    loadBank(function () {
      try {
        render();
      } catch (e2) {}
    });
  }

  g.CuLabArabic = {
    speak: speak,
    schedule: schedule,
    dueList: dueList,
    detectPathPhase: detectPathPhase,
    buildMeaningMcq: buildMeaningMcq,
    DECKS: DECKS,
    VER: VER
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
