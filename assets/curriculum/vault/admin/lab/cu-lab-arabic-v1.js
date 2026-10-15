/* Arabic Lab v1 — Rosetta-inspired immersion + SRS + i+1 phrases
 * Distinct from Tajweed (rules/recitation). Educational only.
 */
(function (g) {
  "use strict";
  if (g.__CU_LAB_ARABIC_V1__) return;
  g.__CU_LAB_ARABIC_V1__ = true;

  var KEY = "clarity_arabic_srs_v1";

  /* Image→meaning via emoji (on-device, no stock people) — immersion match */
  var WORDS = [
    { ar: "كِتَاب", en: "book", emoji: "📖", tr: "kitāb" },
    { ar: "قَلَم", en: "pen", emoji: "🖊️", tr: "qalam" },
    { ar: "بَيْت", en: "house", emoji: "🏠", tr: "bayt" },
    { ar: "مَاء", en: "water", emoji: "💧", tr: "māʾ" },
    { ar: "شَمْس", en: "sun", emoji: "☀️", tr: "shams" },
    { ar: "قَمَر", en: "moon", emoji: "🌙", tr: "qamar" },
    { ar: "نَجْم", en: "star", emoji: "⭐", tr: "najm" },
    { ar: "شَجَرَة", en: "tree", emoji: "🌳", tr: "shajarah" },
    { ar: "وَرْدَة", en: "rose", emoji: "🌹", tr: "wardah" },
    { ar: "قَلْب", en: "heart", emoji: "💚", tr: "qalb" },
    { ar: "يَد", en: "hand", emoji: "✋", tr: "yad" },
    { ar: "عَيْن", en: "eye", emoji: "👁️", tr: "ʿayn" },
    { ar: "بَاب", en: "door", emoji: "🚪", tr: "bāb" },
    { ar: "طَعَام", en: "food", emoji: "🍽️", tr: "ṭaʿām" },
    { ar: "سَلَام", en: "peace", emoji: "🕊️", tr: "salām" }
  ];

  var LETTERS = [
    { ar: "ا", name: "alif", tip: "Long ā sound when vowelled; seat of hamza sometimes." },
    { ar: "ب", name: "bāʾ", tip: "Like English b." },
    { ar: "ت", name: "tāʾ", tip: "Like English t." },
    { ar: "ث", name: "thāʾ", tip: "Like English th in think." },
    { ar: "ج", name: "jīm", tip: "Like j in jam (common teaching)." },
    { ar: "ح", name: "ḥāʾ", tip: "Heavy h from the throat — listen more than force." },
    { ar: "خ", name: "khāʾ", tip: "Like German Bach — gentle scrape." },
    { ar: "د", name: "dāl", tip: "Like English d." },
    { ar: "ر", name: "rāʾ", tip: "Tapped r." },
    { ar: "س", name: "sīn", tip: "Like English s." },
    { ar: "ش", name: "shīn", tip: "Like English sh." },
    { ar: "ص", name: "ṣād", tip: "Emphatic s — fuller mouth." },
    { ar: "م", name: "mīm", tip: "Like English m." },
    { ar: "ن", name: "nūn", tip: "Like English n." },
    { ar: "ه", name: "hāʾ", tip: "Light h." },
    { ar: "و", name: "wāw", tip: "w / long ū." },
    { ar: "ي", name: "yāʾ", tip: "y / long ī." },
    { ar: "ل", name: "lām", tip: "Like English l — core of Allāh." }
  ];

  var PHRASES = [
    { ar: "السَّلَامُ عَلَيْكُمْ", en: "Peace be upon you.", emoji: "🤝" },
    { ar: "وَعَلَيْكُمُ السَّلَام", en: "And upon you be peace.", emoji: "🤝" },
    { ar: "بِسْمِ اللَّهِ", en: "In the name of Allah.", emoji: "📗" },
    { ar: "الْحَمْدُ لِلَّهِ", en: "All praise is for Allah.", emoji: "🌟" },
    { ar: "شُكْرًا", en: "Thank you.", emoji: "🙏" },
    { ar: "نَعَمْ", en: "Yes.", emoji: "✅" },
    { ar: "لَا", en: "No.", emoji: "❌" },
    { ar: "مَا اسْمُكَ؟", en: "What is your name? (m)", emoji: "💬" }
  ];

  function $(id) {
    return document.getElementById(id);
  }

  function loadSRS() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch (e) {
      return {};
    }
  }
  function saveSRS(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      localStorage.setItem("clarity_lab_last_v1", String(Date.now()));
    } catch (e) {}
  }

  /** Simple SM-2-ish: again / good */
  function review(id, good) {
    var data = loadSRS();
    var card = data[id] || { due: 0, interval: 0, ease: 2.3 };
    var now = Date.now();
    if (good) {
      card.interval = card.interval ? Math.min(30, Math.round(card.interval * card.ease)) : 1;
      card.ease = Math.min(2.8, card.ease + 0.05);
    } else {
      card.interval = 0;
      card.ease = Math.max(1.5, card.ease - 0.15);
    }
    card.due = now + card.interval * 86400000;
    data[id] = card;
    saveSRS(data);
  }

  function dueWords() {
    var data = loadSRS();
    var now = Date.now();
    var due = WORDS.filter(function (w) {
      var c = data[w.ar];
      return !c || c.due <= now;
    });
    return due.length ? due : WORDS.slice();
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  var mode = "letters";
  var current = null;

  function setMode(m) {
    mode = m;
    document.querySelectorAll("[data-ar-mode]").forEach(function (b) {
      b.classList.toggle("here", b.getAttribute("data-ar-mode") === m);
    });
    ["ar-panel-letters", "ar-panel-match", "ar-panel-phrases", "ar-panel-review"].forEach(function (id) {
      var el = $(id);
      if (el) el.hidden = true;
    });
    if (m === "letters" && $("ar-panel-letters")) $("ar-panel-letters").hidden = false;
    if (m === "match" && $("ar-panel-match")) {
      $("ar-panel-match").hidden = false;
      nextMatch();
    }
    if (m === "phrases" && $("ar-panel-phrases")) {
      $("ar-panel-phrases").hidden = false;
      nextPhrase();
    }
    if (m === "review" && $("ar-panel-review")) {
      $("ar-panel-review").hidden = false;
      nextReview();
    }
  }

  function nextMatch() {
    var pool = dueWords();
    current = pool[Math.floor(Math.random() * pool.length)];
    var wrong = shuffle(WORDS.filter(function (w) {
      return w.ar !== current.ar;
    })).slice(0, 3);
    var choices = shuffle(wrong.concat([current]));
    $("ar-match-word").textContent = current.ar;
    $("ar-match-hint").textContent = "What does this mean? (think, then tap)";
    $("ar-match-status").textContent = "";
    var grid = $("ar-match-grid");
    grid.innerHTML = "";
    choices.forEach(function (w) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "ar-choice";
      b.innerHTML = "<span>" + w.emoji + "</span> <span style=\"font-size:0.85rem\">" + w.en + "</span>";
      b.addEventListener("click", function () {
        if (w.ar === current.ar) {
          b.classList.add("ok");
          $("ar-match-status").textContent = "Yes — " + current.tr + " · " + current.en;
          review(current.ar, true);
          setTimeout(nextMatch, 700);
        } else {
          b.classList.add("bad");
          $("ar-match-status").textContent = "Try again — look at the letters.";
          review(current.ar, false);
        }
      });
      grid.appendChild(b);
    });
    if ($("ar-match-hear")) {
      $("ar-match-hear").onclick = function () {
        speakAr(current.ar);
      };
    }
  }

  function nextPhrase() {
    current = PHRASES[Math.floor(Math.random() * PHRASES.length)];
    $("ar-phrase-ar").textContent = current.ar;
    $("ar-phrase-en").textContent = "Reveal meaning after you listen.";
    $("ar-phrase-en").dataset.hidden = "1";
    $("ar-phrase-status").textContent = "";
  }

  function nextReview() {
    var data = loadSRS();
    var list = WORDS.map(function (w) {
      var c = data[w.ar] || { interval: 0 };
      return { w: w, iv: c.interval || 0 };
    }).sort(function (a, b) {
      return a.iv - b.iv;
    });
    var box = $("ar-review-list");
    box.innerHTML = "";
    list.slice(0, 8).forEach(function (row) {
      var div = document.createElement("div");
      div.className = "ar-card";
      div.style.padding = "0.65rem";
      div.innerHTML =
        "<div style=\"display:flex;justify-content:space-between;align-items:center;gap:0.5rem\">" +
        "<span style=\"font-size:1.4rem;font-family:serif\" dir=\"rtl\">" +
        row.w.ar +
        "</span><span>" +
        row.w.emoji +
        " " +
        row.w.en +
        "</span></div>";
      box.appendChild(div);
    });
    $("ar-review-meta").textContent = Object.keys(data).length + " words touched on this device · spaced review";
  }

  function speakAr(text) {
    if (!g.speechSynthesis) return;
    try {
      g.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = "ar-SA";
      u.rate = 0.85;
      g.speechSynthesis.speak(u);
    } catch (e) {}
  }

  function boot() {
    document.querySelectorAll("[data-ar-mode]").forEach(function (b) {
      b.addEventListener("click", function () {
        setMode(b.getAttribute("data-ar-mode"));
      });
    });
    var row = $("ar-letter-row");
    if (row) {
      LETTERS.forEach(function (L) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "ar-letter";
        b.textContent = L.ar;
        b.title = L.name;
        b.addEventListener("click", function () {
          row.querySelectorAll(".ar-letter").forEach(function (x) {
            x.classList.remove("here");
          });
          b.classList.add("here");
          $("ar-letter-name").textContent = L.name + " · " + L.ar;
          $("ar-letter-tip").textContent = L.tip;
          speakAr(L.ar);
        });
        row.appendChild(b);
      });
    }
    if ($("ar-phrase-reveal")) {
      $("ar-phrase-reveal").onclick = function () {
        if (current) $("ar-phrase-en").textContent = current.emoji + " " + current.en;
      };
    }
    if ($("ar-phrase-hear")) {
      $("ar-phrase-hear").onclick = function () {
        if (current) speakAr(current.ar);
      };
    }
    if ($("ar-phrase-next")) {
      $("ar-phrase-next").onclick = nextPhrase;
    }
    setMode("letters");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
