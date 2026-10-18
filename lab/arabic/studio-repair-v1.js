/**
 * Arabic studio AR0–AR3 repair + speak path
 * Loads AFTER studio.js. Event delegation (survives re-render).
 * Educational only — not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CU_AR_REPAIR_V1__) return;
  g.__CU_AR_REPAIR_V1__ = true;

  var VER = "20261018AR03";
  var DAY_KEY = "cu_lab_ar_day_v1";
  var SPEAK_KEY = "cu_lab_ar_speak_ticks_v1";

  /* —— AR3: 30-day speak packs (week 1–4 samples; rotate by day) —— */
  var SPEAK30 = {
    version: VER,
    weeks: [
      {
        week: 1,
        title: "Greetings & identity",
        days: [
          { day: 1, cards: [
            { id: "s1a", ar: "السَّلَامُ عَلَيْكُمْ", en: "Peace be upon you", tr: "as-salāmu ʿalaykum", emoji: "🕊️", example: "السَّلَامُ عَلَيْكُمْ" },
            { id: "s1b", ar: "وَعَلَيْكُمُ السَّلَام", en: "And upon you peace", tr: "wa ʿalaykumu s-salām", emoji: "🤝", example: "وَعَلَيْكُمُ السَّلَام" },
            { id: "s1c", ar: "مَا اسْمُكَ؟", en: "What is your name? (m)", tr: "ma ismuk?", emoji: "🪪", example: "مَا اسْمُكَ؟" },
            { id: "s1d", ar: "اسْمِي…", en: "My name is…", tr: "ismī…", emoji: "✍️", example: "اسْمِي يُوسُف" },
            { id: "s1e", ar: "مِنْ أَيْنَ أَنْتَ؟", en: "Where are you from? (m)", tr: "min ayna anta?", emoji: "🌍", example: "مِنْ أَيْنَ أَنْتَ؟" }
          ], speak: "السَّلَامُ عَلَيْكُمْ، اسْمِي…" },
          { day: 2, cards: [
            { id: "s2a", ar: "شُكْرًا", en: "Thank you", tr: "shukran", emoji: "🙏", example: "شُكْرًا" },
            { id: "s2b", ar: "عَفْوًا", en: "You're welcome / pardon", tr: "ʿafwan", emoji: "💛", example: "عَفْوًا" },
            { id: "s2c", ar: "نَعَمْ", en: "Yes", tr: "naʿam", emoji: "✅", example: "نَعَمْ" },
            { id: "s2d", ar: "لَا", en: "No", tr: "lā", emoji: "⛔", example: "لَا" },
            { id: "s2e", ar: "مِنْ فَضْلِكَ", en: "Please (to m)", tr: "min faḍlik", emoji: "🤲", example: "مِنْ فَضْلِكَ" }
          ], speak: "شُكْرًا، مِنْ فَضْلِكَ" },
          { day: 3, cards: [
            { id: "s3a", ar: "مَرْحَبًا", en: "Hello", tr: "marḥaban", emoji: "👋", example: "مَرْحَبًا" },
            { id: "s3b", ar: "كَيْفَ حَالُكَ؟", en: "How are you? (m)", tr: "kayfa ḥāluk?", emoji: "🙂", example: "كَيْفَ حَالُكَ؟" },
            { id: "s3c", ar: "بِخَيْر", en: "Fine / well", tr: "bi-khayr", emoji: "💚", example: "أَنَا بِخَيْر" },
            { id: "s3d", ar: "الْحَمْدُ لِلَّهِ", en: "Praise be to Allah", tr: "al-ḥamdu lillāh", emoji: "✨", example: "الْحَمْدُ لِلَّهِ" },
            { id: "s3e", ar: "إِلَى اللِّقَاء", en: "Goodbye (until we meet)", tr: "ilā al-liqāʾ", emoji: "🚪", example: "إِلَى اللِّقَاء" }
          ], speak: "مَرْحَبًا، كَيْفَ حَالُكَ؟" }
        ]
      },
      {
        week: 2,
        title: "Home & needs",
        days: [
          { day: 8, cards: [
            { id: "s8a", ar: "مَاء", en: "water", tr: "māʾ", emoji: "💧", example: "أُرِيدُ مَاءً" },
            { id: "s8b", ar: "طَعَام", en: "food", tr: "ṭaʿām", emoji: "🍲", example: "أُرِيدُ طَعَامًا" },
            { id: "s8c", ar: "بَيْت", en: "house", tr: "bayt", emoji: "🏠", example: "هَذَا بَيْتٌ" },
            { id: "s8d", ar: "أُرِيدُ…", en: "I want…", tr: "urīdu…", emoji: "🙋", example: "أُرِيدُ مَاءً" },
            { id: "s8e", ar: "أَيْنَ؟", en: "Where?", tr: "ayna?", emoji: "📍", example: "أَيْنَ الْبَيْتُ؟" }
          ], speak: "أُرِيدُ مَاءً، مِنْ فَضْلِكَ" }
        ]
      },
      {
        week: 3,
        title: "Ṣalāh & masjid words",
        days: [
          { day: 15, cards: [
            { id: "s15a", ar: "مَسْجِد", en: "mosque", tr: "masjid", emoji: "🕌", example: "هَذَا مَسْجِدٌ" },
            { id: "s15b", ar: "صَلَاة", en: "prayer", tr: "ṣalāh", emoji: "🤲", example: "الصَّلَاةُ" },
            { id: "s15c", ar: "وُضُوء", en: "ablution", tr: "wuḍūʾ", emoji: "💧", example: "الْوُضُوءُ" },
            { id: "s15d", ar: "قِبْلَة", en: "prayer direction", tr: "qiblah", emoji: "➡️", example: "الْقِبْلَةُ" },
            { id: "s15e", ar: "إِمَام", en: "imam", tr: "imām", emoji: "👤", example: "الْإِمَامُ" }
          ], speak: "أَيْنَ الْمَسْجِدُ؟" }
        ]
      },
      {
        week: 4,
        title: "Review & simple needs",
        days: [
          { day: 22, cards: [
            { id: "s22a", ar: "مُسَاعَدَة", en: "help", tr: "musāʿadah", emoji: "🆘", example: "أُرِيدُ مُسَاعَدَةً" },
            { id: "s22b", ar: "يَمِين", en: "right", tr: "yamīn", emoji: "➡️", example: "عَلَى الْيَمِينِ" },
            { id: "s22c", ar: "يَسَار", en: "left", tr: "yasār", emoji: "⬅️", example: "عَلَى الْيَسَارِ" },
            { id: "s22d", ar: "كَمْ؟", en: "How much / how many?", tr: "kam?", emoji: "🔢", example: "كَمْ؟" },
            { id: "s22e", ar: "فَهِمْتُ", en: "I understood", tr: "fahimtu", emoji: "💡", example: "فَهِمْتُ" }
          ], speak: "أُرِيدُ مُسَاعَدَةً" }
        ]
      }
    ]
  };

  function $(id) { return document.getElementById(id); }

  function toast(msg) {
    var t = $("ar-repair-toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "ar-repair-toast";
      t.className = "ar-repair-toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._tm);
    t._tm = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  function dayIndex() {
    try {
      var d = parseInt(localStorage.getItem(DAY_KEY) || "1", 10);
      if (isNaN(d) || d < 1) d = 1;
      if (d > 30) d = 30;
      return d;
    } catch (e) { return 1; }
  }
  function setDay(d) {
    try { localStorage.setItem(DAY_KEY, String(d)); } catch (e) {}
  }

  function packForDay(d) {
    var all = [];
    SPEAK30.weeks.forEach(function (w) {
      (w.days || []).forEach(function (day) { all.push(day); });
    });
    /* map 1-30 onto available day templates */
    if (!all.length) return null;
    var i = ((d - 1) % all.length + all.length) % all.length;
    var p = all[i];
    return { day: d, cards: p.cards, speak: p.speak, title: "Day " + d + " · Speak path" };
  }

  function ensureSpeakDeck() {
    if (!g.CuLabArabic || !g.CuLabArabic.DECKS) return;
    var DECKS = g.CuLabArabic.DECKS;
    var d = dayIndex();
    var pack = packForDay(d);
    if (!pack) return;
    DECKS.speak30 = {
      id: "speak30",
      title: pack.title,
      level: 1,
      path: 1,
      cards: pack.cards.map(function (c) {
        return {
          id: c.id + "_d" + d,
          ar: c.ar,
          en: c.en,
          tr: c.tr,
          emoji: c.emoji,
          example: c.example || c.ar,
          root: c.root || ""
        };
      }),
      speakLine: pack.speak
    };
  }

  function speakAr(ar, slow) {
    try {
      if (!g.speechSynthesis) {
        toast("Speech not available on this device");
        return;
      }
      g.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(ar);
      u.lang = "ar-SA";
      u.rate = slow ? 0.65 : 0.82;
      var voices = g.speechSynthesis.getVoices() || [];
      var arV = null;
      for (var i = 0; i < voices.length; i++) {
        if ((voices[i].lang || "").toLowerCase().indexOf("ar") === 0) { arV = voices[i]; break; }
      }
      if (arV) u.voice = arV;
      g.speechSynthesis.speak(u);
    } catch (e) {
      toast("Could not play audio");
    }
  }

  function tickSpeak(id) {
    var o = {};
    try { o = JSON.parse(localStorage.getItem(SPEAK_KEY) || "{}"); } catch (e) {}
    o[id] = (o[id] || 0) + 1;
    try { localStorage.setItem(SPEAK_KEY, JSON.stringify(o)); } catch (e) {}
    if (g.ClarityTranscript) {
      try { g.ClarityTranscript.log("lab", { id: "ar-speak-" + id, title: "Arabic speak tick" }); } catch (e2) {}
    }
  }

  function statusLine(msg) {
    var root = $("ar-studio");
    if (!root) return;
    var el = root.querySelector(".ar-status-line");
    if (!el) {
      el = document.createElement("p");
      el.className = "ar-status-line";
      root.insertBefore(el, root.firstChild);
    }
    el.textContent = msg;
  }

  function injectSpeakBar() {
    var root = $("ar-studio");
    if (!root || root.querySelector(".ar-speak-path")) return;
    var d = dayIndex();
    var pack = packForDay(d);
    var bar = document.createElement("div");
    bar.className = "ar-speak-path";
    bar.innerHTML =
      '<div class="ar-speak-head"><strong>Speak path · Day ' + d + '/30</strong>' +
      '<span class="ar-speak-sub">~10 minutes · hear → say → use</span></div>' +
      '<div class="ar-speak-actions">' +
      '<button type="button" class="ar-btn primary" data-ar-action="today-pack">Today\'s pack</button>' +
      '<button type="button" class="ar-btn" data-ar-action="hear-line">Hear today\'s line</button>' +
      '<button type="button" class="ar-btn" data-ar-action="shadow">I said it</button>' +
      '<button type="button" class="ar-btn" data-ar-action="day-next">Next day</button>' +
      '<button type="button" class="ar-btn" data-ar-action="day-prev">Prev day</button>' +
      '</div>' +
      (pack && pack.speak ? '<p class="ar-speak-line" dir="rtl" lang="ar">' + pack.speak + '</p>' : '');
    root.insertBefore(bar, root.firstChild);
  }

  function usePathDeck() {
    ensureSpeakDeck();
    var api = g.CuLabArabic;
    if (!api) return toast("Studio not ready");
    /* prefer internal state via UI simulation */
    var root = $("ar-studio");
    var deckId = "everyday";
    try {
      if (api.detectPathPhase && api.DECKS) {
        var ph = api.detectPathPhase();
        var map = { 1: "everyday", 2: "salah", 3: "stems", 4: "path" };
        deckId = map[ph] || "everyday";
      }
    } catch (e) {}
    var btn = root && root.querySelector('[data-deck="' + deckId + '"]');
    if (btn) {
      btn.click();
      toast("Path deck: " + deckId);
      statusLine("Using path deck: " + deckId);
    } else {
      /* force deck button data */
      var any = root && root.querySelector("[data-deck]");
      if (any) {
        /* dispatch as path */
        toast("Path deck selected: " + deckId + " — tap the highlighted level if needed");
        statusLine("Suggested path deck: " + deckId);
      } else toast("Deck bar not found — try Flash mode");
    }
  }

  function expandBank() {
    statusLine("Expanding educational bank…");
    toast("Loading bank…");
    var done = function (ok, n) {
      if (ok) {
        statusLine("Bank ready" + (n ? " · sentences available" : "") + " (cached on device).");
        toast("Bank expanded / refreshed");
      } else {
        statusLine("Using offline sentence pack.");
        toast("Offline pack active");
      }
    };
    /* Prefer studio loadBank via fetch of bank.json ourselves and note */
    fetch("/lab/arabic/bank.json?v=" + VER, { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("bank");
        return r.json();
      })
      .then(function (data) {
        try {
          localStorage.setItem("cu_lab_ar_bank_v1_data", JSON.stringify(data));
        } catch (e) {}
        var n = 0;
        try {
          if (data.packs) {
            Object.keys(data.packs).forEach(function (k) {
              var p = data.packs[k];
              if (p && p.cards) n += p.cards.length;
              if (p && p.sentences) n += p.sentences.length;
            });
          }
          if (data.sentences) n += (Array.isArray(data.sentences) ? data.sentences.length : 0);
        } catch (e2) {}
        done(true, n);
        /* re-click expand native if present after a tick */
        var exp = $("ar-expand");
        if (exp) {
          /* native handler may re-render; our status persists via timeout inject */
          setTimeout(function () { statusLine("Bank expanded from local educational pack (cached)."); }, 400);
        }
      })
      .catch(function () {
        done(false, 0);
      });
  }

  function openTodayPack() {
    ensureSpeakDeck();
    var root = $("ar-studio");
    if (!root) return;
    /* inject temporary deck button click path: set by creating deck if studio supports DECKS mutation */
    ensureSpeakDeck();
    var deckBtn = root.querySelector('[data-deck="speak30"]');
    if (!deckBtn && g.CuLabArabic && g.CuLabArabic.DECKS && g.CuLabArabic.DECKS.speak30) {
      /* Studio may not show speak30 until re-render — trigger mode flash and message */
      statusLine("Today's speak pack loaded in memory — select Flash, then use Hear on each card.");
      toast("Day " + dayIndex() + " pack ready");
    }
    if (deckBtn) deckBtn.click();
    else {
      /* fallback: speak first cards with TTS in sequence hint */
      var pack = packForDay(dayIndex());
      if (pack && pack.cards[0]) speakAr(pack.cards[0].ar, false);
      toast("Day " + dayIndex() + " · " + (pack && pack.cards ? pack.cards.length : 0) + " cards");
      statusLine((pack && pack.title) || "Today's pack");
    }
    /* try switch to listen mode */
    var listen = root.querySelector('[data-mode="listen"]');
    if (listen) listen.click();
  }

  function onAction(action, t) {
    if (action === "use-path") return usePathDeck();
    if (action === "expand") return expandBank();
    if (action === "due-empty") {
      statusLine("No cards due yet. Learn 5 new in Learn mode, then return.");
      toast("Queue empty — learn new cards");
      var learn = $("ar-studio") && $("ar-studio").querySelector('[data-mode="learn"]');
      if (learn) learn.click();
      return;
    }
    if (action === "today-pack") return openTodayPack();
    if (action === "hear-line") {
      var pack = packForDay(dayIndex());
      if (pack && pack.speak) speakAr(pack.speak, true);
      else toast("No line for this day");
      return;
    }
    if (action === "shadow") {
      tickSpeak("day-" + dayIndex());
      toast("Logged — say it again with Hear");
      statusLine("Speak tick saved for day " + dayIndex());
      return;
    }
    if (action === "day-next") {
      setDay(Math.min(30, dayIndex() + 1));
      ensureSpeakDeck();
      var bar = $("ar-studio") && $("ar-studio").querySelector(".ar-speak-path");
      if (bar) bar.remove();
      injectSpeakBar();
      toast("Day " + dayIndex());
      return;
    }
    if (action === "day-prev") {
      setDay(Math.max(1, dayIndex() - 1));
      var bar2 = $("ar-studio") && $("ar-studio").querySelector(".ar-speak-path");
      if (bar2) bar2.remove();
      injectSpeakBar();
      toast("Day " + dayIndex());
      return;
    }
  }

  function decorateButtons() {
    var root = $("ar-studio");
    if (!root) return;
    var usePath = $("ar-use-path");
    if (usePath) {
      usePath.setAttribute("data-ar-action", "use-path");
      usePath.type = "button";
    }
    var expand = $("ar-expand");
    if (expand) {
      expand.setAttribute("data-ar-action", "expand");
      expand.type = "button";
    }
    var due = root.querySelector('[data-mode="reviews"]');
    if (due && /Due\s*\(\s*0\s*\)/i.test(due.textContent || "")) {
      due.setAttribute("data-ar-action", "due-empty");
    }
    injectSpeakBar();
  }

  function bindDelegate() {
    var root = $("ar-studio");
    if (!root || root.__arRepairBound) return;
    root.__arRepairBound = true;
    root.addEventListener("click", function (e) {
      var t = e.target;
      if (!t) return;
      var actionNode = t.closest && t.closest("[data-ar-action]");
      if (actionNode) {
        e.preventDefault();
        e.stopPropagation();
        onAction(actionNode.getAttribute("data-ar-action"), actionNode);
        return;
      }
      /* also catch id-based if studio re-rendered without data attrs yet */
      if (t.id === "ar-use-path") {
        e.preventDefault();
        e.stopPropagation();
        onAction("use-path", t);
        return;
      }
      if (t.id === "ar-expand") {
        e.preventDefault();
        e.stopPropagation();
        onAction("expand", t);
        return;
      }
    }, true); /* capture — wins over broken bubble handlers */
  }

  var obs = null;
  function watch() {
    var root = $("ar-studio");
    if (!root) return;
    bindDelegate();
    decorateButtons();
    if (obs) return;
    obs = new MutationObserver(function () {
      decorateButtons();
    });
    obs.observe(root, { childList: true, subtree: true });
  }

  function boot() {
    ensureSpeakDeck();
    watch();
    /* voices load async on some browsers */
    if (g.speechSynthesis) {
      try { g.speechSynthesis.getVoices(); } catch (e) {}
      if (g.speechSynthesis.onvoiceschanged !== undefined) {
        g.speechSynthesis.onvoiceschanged = function () {};
      }
    }
    statusLine("Arabic studio repair active · Speak path Day " + dayIndex() + "/30");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () {
    setTimeout(boot, 50);
    setTimeout(boot, 400);
  });
  else {
    setTimeout(boot, 50);
    setTimeout(boot, 400);
  }
})(typeof window !== "undefined" ? window : this);
