/**
 * Arabic Lab Studio · 20261017ARABIC
 * A0–A8: card model · visual flash · audio · SRS · session ramp · desk/vault links
 * On-device only. Educational only — not a fatwa. Not Tajweed / tafsīr.
 */
(function (g) {
  "use strict";
  if (g.__CU_LAB_ARABIC_V1__) return;
  g.__CU_LAB_ARABIC_V1__ = true;

  var KEY = "cu_lab_ar_progress_v1";
  var KEY_LEGACY = "clarity_arabic_studio_v1";
  var VER = "20261017ARABIC";
  var NEW_CAP = 10;

  /* A0/A1/A7 card model: ar, tr, en, example?, root?, emoji? */
  var DECKS = {
    everyday: {
      id: "everyday",
      title: "Everyday words",
      level: 1,
      cards: [
        { id: "e1", ar: "كِتَاب", en: "book", tr: "kitāb", emoji: "📖", example: "هَذَا كِتَابٌ.", root: "ك ت ب", tags: ["noun"] },
        { id: "e2", ar: "قَلَم", en: "pen", tr: "qalam", emoji: "🖊️", example: "هَذَا قَلَمٌ.", tags: ["noun"] },
        { id: "e3", ar: "بَيْت", en: "house", tr: "bayt", emoji: "🏠", example: "هَذَا بَيْتٌ.", tags: ["noun"] },
        { id: "e4", ar: "مَاء", en: "water", tr: "māʾ", emoji: "💧", example: "هَذَا مَاءٌ.", tags: ["noun"] },
        { id: "e5", ar: "شَمْس", en: "sun", tr: "shams", emoji: "☀️", example: "هَذِهِ شَمْسٌ.", tags: ["noun"] },
        { id: "e6", ar: "قَمَر", en: "moon", tr: "qamar", emoji: "🌙", example: "هَذَا قَمَرٌ.", tags: ["noun"] },
        { id: "e7", ar: "قَلْب", en: "heart", tr: "qalb", emoji: "💚", example: "فِي الْقَلْبِ.", tags: ["noun"] },
        { id: "e8", ar: "بَاب", en: "door", tr: "bāb", emoji: "🚪", example: "هَذَا بَابٌ.", tags: ["noun"] },
        { id: "e9", ar: "سَلَام", en: "peace", tr: "salām", emoji: "🕊️", example: "السَّلَامُ عَلَيْكُمْ.", tags: ["noun"] },
        { id: "e10", ar: "طَعَام", en: "food", tr: "ṭaʿām", emoji: "🍽️", example: "هَذَا طَعَامٌ.", tags: ["noun"] }
      ]
    },
    salah: {
      id: "salah",
      title: "Ṣalāh lexicon",
      level: 2,
      cards: [
        { id: "s1", ar: "صَلَاة", en: "prayer", tr: "ṣalāh", emoji: "🕌", example: "أُقِيمُ الصَّلَاةَ.", tags: ["worship"] },
        { id: "s2", ar: "وُضُوء", en: "ablution", tr: "wuḍūʾ", emoji: "💧", example: "أَتَوَضَّأُ.", tags: ["worship"] },
        { id: "s3", ar: "رُكُوع", en: "bowing", tr: "rukūʿ", emoji: "🙇", tags: ["worship"] },
        { id: "s4", ar: "سُجُود", en: "prostration", tr: "sujūd", emoji: "🤲", tags: ["worship"] },
        { id: "s5", ar: "قِبْلَة", en: "prayer direction", tr: "qiblah", emoji: "🧭", tags: ["worship"] },
        { id: "s6", ar: "إِمَام", en: "prayer leader", tr: "imām", emoji: "👤", tags: ["worship"] },
        { id: "s7", ar: "فَجْر", en: "dawn prayer time", tr: "fajr", emoji: "🌅", tags: ["worship"] },
        { id: "s8", ar: "مَغْرِب", en: "sunset prayer time", tr: "maghrib", emoji: "🌇", tags: ["worship"] }
      ]
    },
    stems: {
      id: "stems",
      title: "High-frequency stems",
      level: 3,
      cards: [
        { id: "t1", ar: "عَلِمَ", en: "he knew", tr: "ʿalima", root: "ع ل م", example: "عَلِمَ الطَّالِبُ.", tags: ["verb"] },
        { id: "t2", ar: "كَتَبَ", en: "he wrote", tr: "kataba", root: "ك ت ب", example: "كَتَبَ الدَّرْسَ.", tags: ["verb"] },
        { id: "t3", ar: "قَرَأَ", en: "he read", tr: "qaraʾa", root: "ق ر أ", example: "قَرَأَ الْكِتَابَ.", tags: ["verb"] },
        { id: "t4", ar: "ذَهَبَ", en: "he went", tr: "dhahaba", root: "ذ ه ب", tags: ["verb"] },
        { id: "t5", ar: "قَالَ", en: "he said", tr: "qāla", root: "ق و ل", tags: ["verb"] },
        { id: "t6", ar: "سَمِعَ", en: "he heard", tr: "samiʿa", root: "س م ع", tags: ["verb"] },
        { id: "t7", ar: "عَمِلَ", en: "he worked / did", tr: "ʿamila", root: "ع م ل", tags: ["verb"] },
        { id: "t8", ar: "طَلَبَ", en: "he sought", tr: "ṭalaba", root: "ط ل ب", tags: ["verb"] }
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
    typeAnswer: ""
  };

  function loadProg() {
    try {
      var o = JSON.parse(localStorage.getItem(KEY) || localStorage.getItem(KEY_LEGACY) || "null");
      if (o && typeof o === "object") return o;
    } catch (e) {}
    return { due: {}, interval: {}, seen: 0, newToday: {}, day: "" };
  }
  function saveProg(p) {
    try {
      localStorage.setItem(KEY, JSON.stringify(p));
    } catch (e) {}
  }
  function todayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function cards() {
    return (DECKS[state.deckId] && DECKS[state.deckId].cards) || [];
  }
  function cardAt() {
    var c = cards();
    return c[state.ix % Math.max(c.length, 1)] || null;
  }

  /* A4 SRS */
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
    var tk = todayKey();
    if (p.day !== tk) {
      p.day = tk;
      p.newToday = {};
    }
    p.newToday = p.newToday || {};
    if (!p.newToday[cardId]) p.newToday[cardId] = 1;
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
  function newList() {
    var p = loadProg();
    var tk = todayKey();
    if (p.day !== tk) {
      p.day = tk;
      p.newToday = {};
      saveProg(p);
    }
    var nToday = Object.keys(p.newToday || {}).length;
    return cards().filter(function (c) {
      return !p.due || !p.due[c.id];
    }).slice(0, Math.max(0, NEW_CAP - nToday));
  }

  /* A3 Audio — prefer Arabic voice */
  function speak(ar) {
    try {
      if (!g.speechSynthesis) return;
      g.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(ar);
      u.lang = "ar-SA";
      u.rate = 0.82;
      var voices = g.speechSynthesis.getVoices() || [];
      var arVoice =
        voices.find(function (v) {
          return (v.lang || "").toLowerCase().indexOf("ar") === 0;
        }) ||
        voices.find(function (v) {
          return (v.name || "").toLowerCase().indexOf("arab") >= 0;
        });
      if (arVoice) u.voice = arVoice;
      g.speechSynthesis.speak(u);
    } catch (e) {}
  }
  try {
    if (g.speechSynthesis) g.speechSynthesis.onvoiceschanged = function () {};
  } catch (e) {}

  function $(id) {
    return document.getElementById(id);
  }

  function setMode(m) {
    state.mode = m;
    state.flipped = false;
    state.ix = 0;
    state.production = false;
    if (m === "match") setupMatch();
    if (m === "learn") setupLearn();
    if (m === "test") setupTest();
    if (m === "reviews") setupReviews();
    render();
  }

  function setupReviews() {
    var list = dueList();
    if (!list.length) list = newList();
    if (!list.length) list = cards();
    state.learnQueue = list;
    state.ix = 0;
    state.flipped = false;
    state.mode = "learn";
  }

  function setupMatch() {
    var c = cards().slice(0, 6);
    var pairs = [];
    c.forEach(function (card) {
      pairs.push({ id: card.id, side: "ar", text: card.ar, pair: card.id });
      pairs.push({ id: card.id + "-en", side: "en", text: card.en, pair: card.id });
    });
    for (var i = pairs.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = pairs[i];
      pairs[i] = pairs[j];
      pairs[j] = t;
    }
    state.matchPairs = pairs;
    state.matchSelected = null;
    state.matchMatched = {};
  }

  function setupLearn() {
    var due = dueList();
    var neu = newList();
    var list = due.concat(neu);
    if (!list.length) list = cards();
    state.learnQueue = list;
    state.ix = 0;
    state.flipped = false;
  }

  function setupTest() {
    var c = cards().slice();
    for (var i = c.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = c[i];
      c[i] = c[j];
      c[j] = t;
    }
    state.testItems = c.slice(0, Math.min(8, c.length)).map(function (card) {
      var opts = [card.en];
      var pool = cards().filter(function (x) {
        return x.id !== card.id;
      });
      while (opts.length < 4 && pool.length) {
        var k = Math.floor(Math.random() * pool.length);
        opts.push(pool.splice(k, 1)[0].en);
      }
      for (var i = opts.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = opts[i];
        opts[i] = opts[j];
        opts[j] = t;
      }
      return { card: card, options: opts };
    });
    state.testIx = 0;
    state.testScore = 0;
  }

  function grade(gname) {
    var card = state.learnQueue[state.ix] || cardAt();
    if (!card) return;
    schedule(card.id, gname);
    state.ix++;
    state.flipped = false;
    if (state.learnQueue.length && state.ix >= state.learnQueue.length) {
      state.ix = 0;
      setupLearn();
    }
    render();
  }

  /* A2 visual flash */
  function renderFlashCard(card, flipped, production) {
    if (!card) return "<p>No cards.</p>";
    var frontInner, backInner;
    if (production) {
      frontInner =
        '<div class="ar-visual">' +
        (card.emoji ? '<div class="ar-emoji">' + card.emoji + "</div>" : "") +
        '<div class="ar-en">' +
        card.en +
        "</div></div>";
      backInner =
        '<div class="ar-ar" dir="rtl" lang="ar">' +
        card.ar +
        "</div>" +
        '<span class="ar-tr">' +
        (card.tr || "") +
        "</span>" +
        (card.example ? '<p class="ar-ex" dir="rtl" lang="ar">' + card.example + "</p>" : "") +
        (card.root ? '<p class="ar-root">Root · ' + card.root + "</p>" : "");
    } else {
      frontInner =
        '<div class="ar-visual">' +
        (card.emoji ? '<div class="ar-emoji">' + card.emoji + "</div>" : "") +
        '<div class="ar-ar" dir="rtl" lang="ar">' +
        card.ar +
        "</div>" +
        '<span class="ar-tr">' +
        (card.tr || "") +
        "</span></div>";
      backInner =
        '<div class="ar-en">' +
        card.en +
        "</div>" +
        (card.example ? '<p class="ar-ex" dir="rtl" lang="ar">' + card.example + "</p>" : "") +
        (card.root ? '<p class="ar-root">Root · ' + card.root + "</p>" : "");
    }
    return (
      '<div class="ar-card-wrap"><div class="ar-flash' +
      (flipped ? " flipped" : "") +
      '" id="ar-flash-card" role="button" tabindex="0">' +
      '<div class="ar-face ar-front">' +
      frontInner +
      "</div>" +
      '<div class="ar-face ar-back">' +
      backInner +
      "</div></div>" +
      '<div class="ar-actions">' +
      '<button type="button" class="ar-btn primary" id="ar-hear">Hear</button>' +
      '<button type="button" class="ar-btn" id="ar-flip">Flip</button>' +
      '<button type="button" class="ar-btn" id="ar-next">Next</button>' +
      '<button type="button" class="ar-btn" id="ar-prod">' +
      (production ? "Arabic→Meaning" : "Meaning→Arabic") +
      "</button></div>" +
      '<p class="ar-meta">' +
      String(state.ix + 1).padStart(2, "0") +
      "/" +
      String(cards().length).padStart(2, "0") +
      " · " +
      (DECKS[state.deckId] && DECKS[state.deckId].title) +
      "</p></div>"
    );
  }

  function renderFlash() {
    return renderFlashCard(cardAt(), state.flipped, state.production);
  }

  function renderLearn() {
    var card = state.learnQueue[state.ix] || cardAt();
    var dueN = dueList().length;
    var html =
      '<p class="ar-session">Reviews due: <strong>' +
      dueN +
      "</strong> · New cap " +
      NEW_CAP +
      "/day · grade honestly</p>" +
      renderFlashCard(card, state.flipped, false) +
      '<div class="ar-grade">' +
      '<button type="button" class="ar-btn" data-grade="again">Again</button>' +
      '<button type="button" class="ar-btn" data-grade="hard">Hard</button>' +
      '<button type="button" class="ar-btn primary" data-grade="good">Good</button>' +
      '<button type="button" class="ar-btn" data-grade="easy">Easy</button></div>';
    return html;
  }

  function renderMatch() {
    var cells = state.matchPairs
      .map(function (p, i) {
        var done = state.matchMatched[p.pair];
        var sel = state.matchSelected === i;
        return (
          '<button type="button" class="ar-match-cell' +
          (done ? " done" : "") +
          (sel ? " sel" : "") +
          '" data-mi="' +
          i +
          '"' +
          (done ? " disabled" : "") +
          ">" +
          p.text +
          "</button>"
        );
      })
      .join("");
    return '<div class="ar-card-wrap"><div class="ar-match-grid">' + cells + "</div></div>";
  }

  function renderTest() {
    var item = state.testItems[state.testIx];
    if (!item) {
      return (
        '<div class="ar-card-wrap"><p class="ar-en">Score: ' +
        state.testScore +
        "/" +
        state.testItems.length +
        '</p><button type="button" class="ar-btn primary" id="ar-retest">Again</button></div>'
      );
    }
    var opts = item.options
      .map(function (o) {
        return '<button type="button" class="ar-btn block" data-opt="' + o.replace(/"/g, "") + '">' + o + "</button>";
      })
      .join("");
    return (
      '<div class="ar-card-wrap"><div class="ar-ar" dir="rtl" lang="ar">' +
      item.card.ar +
      '</div><div class="ar-actions" style="flex-direction:column;align-items:stretch">' +
      opts +
      '</div><p class="ar-meta">' +
      (state.testIx + 1) +
      "/" +
      state.testItems.length +
      "</p></div>"
    );
  }

  function renderType() {
    var card = cardAt();
    if (!card) return "<p>No cards.</p>";
    return (
      '<div class="ar-card-wrap"><p class="ar-en">' +
      card.en +
      '</p><p class="ar-note" style="text-align:center">Type the Arabic (or transliteration)</p>' +
      '<input class="ar-input" id="ar-type-in" autocomplete="off" dir="rtl" />' +
      '<div class="ar-actions"><button type="button" class="ar-btn primary" id="ar-type-check">Check</button>' +
      '<button type="button" class="ar-btn" id="ar-hear">Hear</button>' +
      '<button type="button" class="ar-btn" id="ar-next">Next</button></div>' +
      '<p class="ar-meta" id="ar-type-msg"></p></div>'
    );
  }

  function renderLetters() {
    return (
      '<div class="ar-card-wrap"><div class="ar-letters">' +
      LETTERS.map(function (L) {
        return (
          '<button type="button" class="ar-letter" data-letter="' +
          L.ar +
          '"><span dir="rtl" lang="ar">' +
          L.ar +
          "</span><small>" +
          L.name +
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
    var session =
      '<div class="ar-session-bar">' +
      '<button type="button" class="ar-btn primary" data-mode="reviews">Due reviews (' +
      dueN +
      ")</button>" +
      '<a class="ar-btn" href="/campus/desk/seeker/">Desk</a>' +
      '<a class="ar-btn" href="/vault/#locker">Vault pin</a>' +
      '<a class="ar-btn" href="/lab/tajweed/">Tajweed lab</a></div>';

    var modeBar =
      '<div class="ar-modes" role="toolbar">' +
      ["flash", "match", "learn", "test", "type", "letters"]
        .map(function (m) {
          return (
            '<button type="button" class="ar-mode-btn' +
            (state.mode === m ? " here" : "") +
            '" data-mode="' +
            m +
            '">' +
            m.charAt(0).toUpperCase() +
            m.slice(1) +
            "</button>"
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
            '<button type="button" class="ar-deck-btn' +
            (state.deckId === id ? " here" : "") +
            '" data-deck="' +
            id +
            '">L' +
            d.level +
            " · " +
            d.title +
            "</button>"
          );
        })
        .join("") +
      "</div>";

    var body = "";
    if (state.mode === "flash") body = renderFlash();
    else if (state.mode === "match") body = renderMatch();
    else if (state.mode === "learn") body = renderLearn();
    else if (state.mode === "test") body = renderTest();
    else if (state.mode === "type") body = renderType();
    else if (state.mode === "letters") body = renderLetters();

    root.innerHTML =
      '<p class="ar-lead">Arabic vocabulary studio — hear · see · recall. Levels unlock harder decks. Educational only. Not Tajweed or tafsīr.</p>' +
      session +
      deckBar +
      modeBar +
      '<div class="ar-stage">' +
      body +
      "</div>" +
      '<p class="ar-note">Progress on this device (<code>cu_lab_ar_progress_v1</code>). Verify with a trusted teacher. Not affiliated with Al-Azhar or Madinah University.</p>';

    bind();
  }

  function bind() {
    var root = $("ar-studio");
    if (!root) return;

    root.querySelectorAll("[data-mode]").forEach(function (b) {
      b.onclick = function () {
        setMode(b.getAttribute("data-mode"));
      };
    });
    root.querySelectorAll("[data-deck]").forEach(function (b) {
      b.onclick = function () {
        state.deckId = b.getAttribute("data-deck");
        state.ix = 0;
        state.flipped = false;
        if (state.mode === "match") setupMatch();
        if (state.mode === "learn") setupLearn();
        if (state.mode === "test") setupTest();
        render();
      };
    });

    var hear = $("ar-hear");
    if (hear)
      hear.onclick = function () {
        var c = state.mode === "learn" ? state.learnQueue[state.ix] : cardAt();
        if (c) speak(c.ar);
      };

    var flip = $("ar-flip");
    if (flip)
      flip.onclick = function () {
        state.flipped = !state.flipped;
        render();
      };
    var flash = $("ar-flash-card");
    if (flash)
      flash.onclick = function () {
        state.flipped = !state.flipped;
        render();
      };

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
      b.onclick = function () {
        grade(b.getAttribute("data-grade"));
      };
    });

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
        } else {
          state.matchSelected = i;
        }
        render();
      };
    });

    root.querySelectorAll("[data-opt]").forEach(function (b) {
      b.onclick = function () {
        var item = state.testItems[state.testIx];
        if (!item) return;
        if (b.getAttribute("data-opt") === item.card.en) {
          state.testScore++;
          schedule(item.card.id, "good");
        } else {
          schedule(item.card.id, "again");
        }
        state.testIx++;
        render();
      };
    });
    var retest = $("ar-retest");
    if (retest)
      retest.onclick = function () {
        setupTest();
        render();
      };

    var typeCheck = $("ar-type-check");
    if (typeCheck)
      typeCheck.onclick = function () {
        var card = cardAt();
        var inp = $("ar-type-in");
        var msg = $("ar-type-msg");
        if (!card || !inp) return;
        var v = (inp.value || "").trim();
        var ok =
          v === card.ar ||
          v.replace(/[ًٌٍَُِّْ]/g, "") === card.ar.replace(/[ًٌٍَُِّْ]/g, "") ||
          (card.tr && v.toLowerCase() === card.tr.toLowerCase());
        if (msg) msg.textContent = ok ? "Correct — " + card.ar : "Not yet — " + card.ar + " (" + (card.tr || "") + ")";
        schedule(card.id, ok ? "good" : "again");
      };

    root.querySelectorAll("[data-letter]").forEach(function (b) {
      b.onclick = function () {
        speak(b.getAttribute("data-letter"));
      };
    });
  }

  function boot() {
    var host = $("ar-studio");
    if (!host) {
      host = document.createElement("div");
      host.id = "ar-studio";
      var main = document.querySelector("main.cu-wrap") || document.querySelector("main");
      if (main) main.appendChild(host);
      else document.body.appendChild(host);
    }
    render();
  }

  g.CuLabArabic = {
    speak: speak,
    schedule: schedule,
    dueList: dueList,
    DECKS: DECKS,
    VER: VER
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
