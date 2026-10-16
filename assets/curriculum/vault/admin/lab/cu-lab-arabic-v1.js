/**
 * Arabic Lab Studio — A0–A8 educational vocabulary path
 * Modes: Flash · Match · Learn · Test · Type · Letters
 * On-device only. Not Tajweed. Educational only — not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CU_LAB_ARABIC_V1__) return;
  g.__CU_LAB_ARABIC_V1__ = true;

  var KEY = "clarity_arabic_studio_v1";
  var VER = "20261016ARABIC";

  /* A0 schema: { id, ar, en, tr?, tags[], emoji? } */
  var DECKS = {
    everyday: {
      id: "everyday",
      title: "Everyday words",
      level: 1,
      cards: [
        { id: "e1", ar: "كِتَاب", en: "book", tr: "kitāb", emoji: "📖", tags: ["noun"] },
        { id: "e2", ar: "قَلَم", en: "pen", tr: "qalam", emoji: "🖊️", tags: ["noun"] },
        { id: "e3", ar: "بَيْت", en: "house", tr: "bayt", emoji: "🏠", tags: ["noun"] },
        { id: "e4", ar: "مَاء", en: "water", tr: "māʾ", emoji: "💧", tags: ["noun"] },
        { id: "e5", ar: "شَمْس", en: "sun", tr: "shams", emoji: "☀️", tags: ["noun"] },
        { id: "e6", ar: "قَمَر", en: "moon", tr: "qamar", emoji: "🌙", tags: ["noun"] },
        { id: "e7", ar: "قَلْب", en: "heart", tr: "qalb", emoji: "💚", tags: ["noun"] },
        { id: "e8", ar: "بَاب", en: "door", tr: "bāb", emoji: "🚪", tags: ["noun"] },
        { id: "e9", ar: "سَلَام", en: "peace", tr: "salām", emoji: "🕊️", tags: ["noun"] },
        { id: "e10", ar: "طَعَام", en: "food", tr: "ṭaʿām", emoji: "🍽️", tags: ["noun"] }
      ]
    },
    salah: {
      id: "salah",
      title: "Ṣalāh lexicon",
      level: 2,
      cards: [
        { id: "s1", ar: "صَلَاة", en: "prayer", tr: "ṣalāh", tags: ["worship"] },
        { id: "s2", ar: "وُضُوء", en: "ablution", tr: "wuḍūʾ", tags: ["worship"] },
        { id: "s3", ar: "رُكُوع", en: "bowing", tr: "rukūʿ", tags: ["worship"] },
        { id: "s4", ar: "سُجُود", en: "prostration", tr: "sujūd", tags: ["worship"] },
        { id: "s5", ar: "قِبْلَة", en: "prayer direction", tr: "qiblah", tags: ["worship"] },
        { id: "s6", ar: "إِمَام", en: "prayer leader", tr: "imām", tags: ["worship"] },
        { id: "s7", ar: "فَجْر", en: "dawn prayer time", tr: "fajr", tags: ["worship"] },
        { id: "s8", ar: "مَغْرِب", en: "sunset prayer time", tr: "maghrib", tags: ["worship"] }
      ]
    },
    stems: {
      id: "stems",
      title: "High-frequency stems",
      level: 3,
      cards: [
        { id: "t1", ar: "عَلِمَ", en: "he knew", tr: "ʿalima", tags: ["stem"] },
        { id: "t2", ar: "كَتَبَ", en: "he wrote", tr: "kataba", tags: ["stem"] },
        { id: "t3", ar: "قَرَأَ", en: "he read", tr: "qaraʾa", tags: ["stem"] },
        { id: "t4", ar: "آمَنَ", en: "he believed", tr: "āmana", tags: ["stem"] },
        { id: "t5", ar: "عَبَدَ", en: "he worshipped", tr: "ʿabada", tags: ["stem"] },
        { id: "t6", ar: "رَحِمَ", en: "he showed mercy", tr: "raḥima", tags: ["stem"] },
        { id: "t7", ar: "صَبَرَ", en: "he was patient", tr: "ṣabara", tags: ["stem"] },
        { id: "t8", ar: "شَكَرَ", en: "he thanked", tr: "shakara", tags: ["stem"] }
      ]
    }
  };

  var LETTERS = [
    { ar: "ا", name: "alif" }, { ar: "ب", name: "bāʾ" }, { ar: "ت", name: "tāʾ" },
    { ar: "ث", name: "thāʾ" }, { ar: "ج", name: "jīm" }, { ar: "ح", name: "ḥāʾ" },
    { ar: "خ", name: "khāʾ" }, { ar: "د", name: "dāl" }, { ar: "ر", name: "rāʾ" },
    { ar: "س", name: "sīn" }, { ar: "ش", name: "shīn" }, { ar: "ص", name: "ṣād" },
    { ar: "ض", name: "ḍād" }, { ar: "ط", name: "ṭāʾ" }, { ar: "ع", name: "ʿayn" },
    { ar: "ف", name: "fāʾ" }, { ar: "ق", name: "qāf" }, { ar: "ك", name: "kāf" },
    { ar: "ل", name: "lām" }, { ar: "م", name: "mīm" }, { ar: "ن", name: "nūn" },
    { ar: "ه", name: "hāʾ" }, { ar: "و", name: "wāw" }, { ar: "ي", name: "yāʾ" }
  ];

  var state = {
    mode: "flash",
    deckId: "everyday",
    ix: 0,
    flipped: false,
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
      return JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch (e) {
      return {};
    }
  }
  function saveProg(p) {
    try {
      localStorage.setItem(KEY, JSON.stringify(p));
    } catch (e) {}
  }

  function deck() {
    return DECKS[state.deckId] || DECKS.everyday;
  }
  function cards() {
    return deck().cards.slice();
  }

  function speak(ar) {
    try {
      if (!g.speechSynthesis) return;
      g.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(ar);
      u.lang = "ar-SA";
      u.rate = 0.85;
      g.speechSynthesis.speak(u);
    } catch (e) {}
  }

  function $(id) {
    return document.getElementById(id);
  }

  function setMode(m) {
    state.mode = m;
    state.flipped = false;
    state.ix = 0;
    if (m === "match") setupMatch();
    if (m === "learn") setupLearn();
    if (m === "test") setupTest();
    render();
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
    var p = loadProg();
    var due = p.due || {};
    var list = cards().filter(function (c) {
      return !due[c.id] || due[c.id] <= Date.now();
    });
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
      var pool = cards().filter(function (x) { return x.id !== card.id; });
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

  function rateLearn(knew) {
    var card = state.learnQueue[state.ix];
    if (!card) return;
    var p = loadProg();
    p.due = p.due || {};
    var day = 24 * 60 * 60 * 1000;
    p.due[card.id] = Date.now() + (knew ? 3 * day : 1 * day);
    p.seen = (p.seen || 0) + 1;
    saveProg(p);
    state.ix++;
    state.flipped = false;
    if (state.ix >= state.learnQueue.length) {
      state.ix = 0;
      setupLearn();
    }
    render();
  }

  function render() {
    var root = $("ar-studio");
    if (!root) return;

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
      '<p class="ar-lead">Arabic vocabulary studio — levels unlock harder decks. Educational only. Not Tajweed or tafsīr.</p>' +
      deckBar +
      modeBar +
      '<div class="ar-stage">' +
      body +
      "</div>" +
      '<p class="ar-note">Progress stays on this device. Verify meanings with a trusted teacher.</p>';

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
    bindStage();
  }

  function renderFlash() {
    var c = cards();
    var card = c[state.ix % c.length];
    return (
      '<div class="ar-card-wrap">' +
      '<div class="ar-flash' +
      (state.flipped ? " flipped" : "") +
      '" id="ar-flash-card">' +
      '<div class="ar-face ar-front"><span class="ar-ar" dir="rtl" lang="ar">' +
      card.ar +
      "</span>" +
      (card.tr ? '<span class="ar-tr">' + card.tr + "</span>" : "") +
      "</div>" +
      '<div class="ar-face ar-back"><span class="ar-en">' +
      (card.emoji ? card.emoji + " " : "") +
      card.en +
      "</span></div></div>" +
      '<div class="ar-actions">' +
      '<button type="button" class="ar-btn" id="ar-hear">Hear</button>' +
      '<button type="button" class="ar-btn" id="ar-flip">Flip</button>' +
      '<button type="button" class="ar-btn primary" id="ar-next">Next</button>' +
      "</div>" +
      '<p class="ar-meta">' +
      (state.ix % c.length) +
      1 +
      " / " +
      c.length +
      " · " +
      deck().title +
      "</p></div>"
    );
  }

  function renderMatch() {
    var html =
      '<p class="ar-meta">Tap a pair — Arabic with its meaning.</p><div class="ar-match-grid">';
    state.matchPairs.forEach(function (p, i) {
      var done = state.matchMatched[p.pair];
      var sel = state.matchSelected === i;
      html +=
        '<button type="button" class="ar-match-cell' +
        (done ? " done" : "") +
        (sel ? " sel" : "") +
        '" data-match-i="' +
        i +
        '"' +
        (done ? " disabled" : "") +
        ">" +
        p.text +
        "</button>";
    });
    html +=
      '</div><button type="button" class="ar-btn" id="ar-match-reset">New round</button>';
    return html;
  }

  function renderLearn() {
    if (!state.learnQueue.length) setupLearn();
    var card = state.learnQueue[state.ix];
    if (!card)
      return '<p>Deck clear for now. Come back later or switch deck.</p>';
    return (
      '<div class="ar-card-wrap">' +
      '<p class="ar-meta">Learn · spaced review</p>' +
      '<div class="ar-flash' +
      (state.flipped ? " flipped" : "") +
      '" id="ar-flash-card">' +
      '<div class="ar-face ar-front"><span class="ar-ar" dir="rtl" lang="ar">' +
      card.ar +
      "</span></div>" +
      '<div class="ar-face ar-back"><span class="ar-en">' +
      card.en +
      "</span></div></div>" +
      '<div class="ar-actions">' +
      '<button type="button" class="ar-btn" id="ar-hear">Hear</button>' +
      '<button type="button" class="ar-btn" id="ar-flip">Show</button>' +
      '<button type="button" class="ar-btn" id="ar-again">Again</button>' +
      '<button type="button" class="ar-btn primary" id="ar-knew">Knew</button>' +
      "</div></div>"
    );
  }

  function renderTest() {
    if (!state.testItems.length) setupTest();
    if (state.testIx >= state.testItems.length) {
      return (
        '<div class="ar-card-wrap"><p class="ar-en">Score: ' +
        state.testScore +
        " / " +
        state.testItems.length +
        '</p><button type="button" class="ar-btn primary" id="ar-test-retry">Try again</button></div>'
      );
    }
    var item = state.testItems[state.testIx];
    return (
      '<div class="ar-card-wrap"><p class="ar-meta">Test ' +
      (state.testIx + 1) +
      " / " +
      state.testItems.length +
      '</p><p class="ar-ar" dir="rtl" lang="ar">' +
      item.card.ar +
      '</p><div class="ar-options">' +
      item.options
        .map(function (o) {
          return (
            '<button type="button" class="ar-btn block" data-opt="' +
            o.replace(/"/g, "") +
            '">' +
            o +
            "</button>"
          );
        })
        .join("") +
      "</div></div>"
    );
  }

  function renderType() {
    var c = cards();
    var card = c[state.ix % c.length];
    return (
      '<div class="ar-card-wrap"><p class="ar-meta">Type the English meaning</p>' +
      '<p class="ar-ar" dir="rtl" lang="ar">' +
      card.ar +
      '</p><input class="ar-input" id="ar-type-in" autocomplete="off" placeholder="meaning"/>' +
      '<div class="ar-actions"><button type="button" class="ar-btn" id="ar-hear">Hear</button>' +
      '<button type="button" class="ar-btn primary" id="ar-type-check">Check</button></div>' +
      '<p class="ar-meta" id="ar-type-fb"></p></div>'
    );
  }

  function renderLetters() {
    return (
      '<div class="ar-letters">' +
      LETTERS.map(function (L) {
        return (
          '<button type="button" class="ar-letter" data-letter="' +
          L.ar +
          '" title="' +
          L.name +
          '"><span dir="rtl" lang="ar">' +
          L.ar +
          "</span><small>" +
          L.name +
          "</small></button>"
        );
      }).join("") +
      "</div>"
    );
  }

  function bindStage() {
    var flash = $("ar-flash-card");
    if (flash) {
      flash.onclick = function () {
        state.flipped = !state.flipped;
        render();
      };
    }
    var flip = $("ar-flip");
    if (flip)
      flip.onclick = function () {
        state.flipped = !state.flipped;
        render();
      };
    var next = $("ar-next");
    if (next)
      next.onclick = function () {
        state.ix++;
        state.flipped = false;
        render();
      };
    var hear = $("ar-hear");
    if (hear)
      hear.onclick = function () {
        var c =
          state.mode === "learn"
            ? state.learnQueue[state.ix]
            : cards()[state.ix % cards().length];
        if (c) speak(c.ar);
      };
    var again = $("ar-again");
    if (again)
      again.onclick = function () {
        rateLearn(false);
      };
    var knew = $("ar-knew");
    if (knew)
      knew.onclick = function () {
        rateLearn(true);
      };
    var reset = $("ar-match-reset");
    if (reset)
      reset.onclick = function () {
        setupMatch();
        render();
      };
    document.querySelectorAll("[data-match-i]").forEach(function (btn) {
      btn.onclick = function () {
        var i = +btn.getAttribute("data-match-i");
        if (state.matchMatched[state.matchPairs[i].pair]) return;
        if (state.matchSelected === null) {
          state.matchSelected = i;
          render();
          return;
        }
        if (state.matchSelected === i) {
          state.matchSelected = null;
          render();
          return;
        }
        var a = state.matchPairs[state.matchSelected];
        var b = state.matchPairs[i];
        if (a.pair === b.pair && a.side !== b.side) {
          state.matchMatched[a.pair] = true;
        }
        state.matchSelected = null;
        render();
      };
    });
    document.querySelectorAll("[data-opt]").forEach(function (btn) {
      btn.onclick = function () {
        var item = state.testItems[state.testIx];
        if (btn.getAttribute("data-opt") === item.card.en) state.testScore++;
        state.testIx++;
        render();
      };
    });
    var retry = $("ar-test-retry");
    if (retry)
      retry.onclick = function () {
        setupTest();
        render();
      };
    var chk = $("ar-type-check");
    if (chk)
      chk.onclick = function () {
        var card = cards()[state.ix % cards().length];
        var val = ($("ar-type-in") || {}).value || "";
        var fb = $("ar-type-fb");
        if (fb)
          fb.textContent =
            val.trim().toLowerCase() === card.en.toLowerCase()
              ? "Correct"
              : "Answer: " + card.en;
        if (val.trim().toLowerCase() === card.en.toLowerCase()) {
          state.ix++;
          setTimeout(render, 600);
        }
      };
    document.querySelectorAll("[data-letter]").forEach(function (b) {
      b.onclick = function () {
        speak(b.getAttribute("data-letter"));
      };
    });
  }

  function boot() {
    var q = "";
    try {
      q = new URL(location.href).searchParams.get("deck") || "";
    } catch (e) {}
    if (q && DECKS[q]) state.deckId = q;
    var host =
      document.getElementById("ar-studio") ||
      document.getElementById("lab-arabic-root") ||
      document.querySelector("[data-arabic-lab]");
    if (!host) {
      host = document.createElement("section");
      host.id = "ar-studio";
      var main = document.querySelector("main.cu-wrap") || document.querySelector("main");
      if (main) main.appendChild(host);
      else document.body.appendChild(host);
    } else {
      host.id = "ar-studio";
    }
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
