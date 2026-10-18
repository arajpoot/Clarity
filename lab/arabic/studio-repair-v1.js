/**
 * Arabic studio repair STABLE — debounced, crash-safe
 */
(function (g) {
  "use strict";
  if (g.__CU_AR_REPAIR_V1__) return;
  g.__CU_AR_REPAIR_V1__ = true;

  var VER = "20261018STABLE";
  var DAY_KEY = "cu_lab_ar_day_v1";
  var SPEAK_KEY = "cu_lab_ar_speak_ticks_v1";
  var decorating = false;
  var bootDone = false;

  var SPEAK_DAYS = [
    { day: 1, speak: "السَّلَامُ عَلَيْكُمْ، اسْمِي…", cards: [
      { id: "s1a", ar: "السَّلَامُ عَلَيْكُمْ", en: "Peace be upon you", tr: "as-salamu alaykum" },
      { id: "s1b", ar: "وَعَلَيْكُمُ السَّلَام", en: "And upon you peace", tr: "wa alaykum as-salam" },
      { id: "s1c", ar: "شُكْرًا", en: "Thank you", tr: "shukran" },
      { id: "s1d", ar: "مِنْ فَضْلِكَ", en: "Please", tr: "min fadlik" },
      { id: "s1e", ar: "نَعَمْ", en: "Yes", tr: "na'am" }
    ]},
    { day: 2, speak: "أُرِيدُ مَاءً، مِنْ فَضْلِكَ", cards: [
      { id: "s2a", ar: "مَاء", en: "water", tr: "ma'" },
      { id: "s2b", ar: "أُرِيدُ…", en: "I want…", tr: "uridu" },
      { id: "s2c", ar: "أَيْنَ؟", en: "Where?", tr: "ayna?" },
      { id: "s2d", ar: "لَا", en: "No", tr: "la" },
      { id: "s2e", ar: "عَفْوًا", en: "Pardon / you're welcome", tr: "afwan" }
    ]}
  ];

  function $(id) { try { return document.getElementById(id); } catch (e) { return null; } }

  function toast(msg) {
    try {
      var t = $("ar-repair-toast");
      if (!t) {
        t = document.createElement("div");
        t.id = "ar-repair-toast";
        t.className = "ar-repair-toast";
        document.body.appendChild(t);
      }
      t.textContent = String(msg || "");
      t.classList.add("show");
      clearTimeout(t._tm);
      t._tm = setTimeout(function () { try { t.classList.remove("show"); } catch (e) {} }, 2000);
    } catch (e) {}
  }

  function dayIndex() {
    try {
      var d = parseInt(localStorage.getItem(DAY_KEY) || "1", 10);
      if (isNaN(d) || d < 1) d = 1;
      if (d > 30) d = 30;
      return d;
    } catch (e) { return 1; }
  }

  function packForDay(d) {
    var i = (d - 1) % SPEAK_DAYS.length;
    var p = SPEAK_DAYS[i];
    return { day: d, speak: p.speak, cards: p.cards, title: "Day " + d + " speak path" };
  }

  function speakAr(ar, slow) {
    try {
      if (!g.speechSynthesis) { toast("Speech not available"); return; }
      g.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(String(ar || ""));
      u.lang = "ar-SA";
      u.rate = slow ? 0.65 : 0.82;
      g.speechSynthesis.speak(u);
    } catch (e) { toast("Audio error"); }
  }

  function statusLine(msg) {
    try {
      var root = $("ar-studio");
      if (!root) return;
      var el = root.querySelector(".ar-status-line");
      if (!el) {
        el = document.createElement("p");
        el.className = "ar-status-line";
        root.insertBefore(el, root.firstChild);
      }
      el.textContent = String(msg || "");
    } catch (e) {}
  }

  function injectSpeakBar() {
    try {
      var root = $("ar-studio");
      if (!root || root.querySelector(".ar-speak-path")) return;
      var d = dayIndex();
      var pack = packForDay(d);
      var bar = document.createElement("div");
      bar.className = "ar-speak-path";
      bar.innerHTML =
        '<div class="ar-speak-head"><strong>Speak path · Day ' + d + '/30</strong>' +
        '<span class="ar-speak-sub">~10 min · hear → say</span></div>' +
        '<div class="ar-speak-actions">' +
        '<button type="button" class="ar-btn primary" data-ar-action="today-pack">Today pack</button>' +
        '<button type="button" class="ar-btn" data-ar-action="hear-line">Hear line</button>' +
        '<button type="button" class="ar-btn" data-ar-action="shadow">I said it</button>' +
        '<button type="button" class="ar-btn" data-ar-action="day-next">Next day</button>' +
        '<a class="ar-btn primary" href="/lab/arabic/hajj2027/">Hajj 2027 phrases</a>' +
        "</div>" +
        (pack.speak ? '<p class="ar-speak-line" dir="rtl" lang="ar">' + pack.speak + "</p>" : "");
      root.insertBefore(bar, root.firstChild);
    } catch (e) {}
  }

  function decorateButtons() {
    if (decorating) return;
    decorating = true;
    try {
      var root = $("ar-studio");
      if (!root) return;
      var usePath = $("ar-use-path");
      if (usePath) usePath.setAttribute("data-ar-action", "use-path");
      var expand = $("ar-expand");
      if (expand) expand.setAttribute("data-ar-action", "expand");
      var due = root.querySelector('[data-mode="reviews"]');
      if (due && /Due\s*\(\s*0\s*\)/i.test(due.textContent || "")) {
        due.setAttribute("data-ar-action", "due-empty");
      }
      injectSpeakBar();
    } catch (e) {}
    decorating = false;
  }

  function usePathDeck() {
    try {
      var root = $("ar-studio");
      var deckId = "everyday";
      if (g.CuLabArabic && typeof g.CuLabArabic.detectPathPhase === "function") {
        var ph = g.CuLabArabic.detectPathPhase();
        var map = { 1: "everyday", 2: "salah", 3: "stems", 4: "path" };
        deckId = map[ph] || "everyday";
      }
      var btn = root && root.querySelector('[data-deck="' + deckId + '"]');
      if (btn) btn.click();
      toast("Path deck: " + deckId);
      statusLine("Using path deck: " + deckId);
    } catch (e) { toast("Path deck error"); }
  }

  function expandBank() {
    statusLine("Expanding bank…");
    toast("Loading bank…");
    fetch("/lab/arabic/bank.json?v=" + VER)
      .then(function (r) { if (!r.ok) throw new Error("x"); return r.json(); })
      .then(function (data) {
        try { localStorage.setItem("cu_lab_ar_bank_v1_data", JSON.stringify(data)); } catch (e) {}
        statusLine("Bank expanded (cached on device).");
        toast("Bank ready");
      })
      .catch(function () {
        statusLine("Offline pack active.");
        toast("Offline pack");
      });
  }

  function onAction(action) {
    try {
      if (action === "use-path") return usePathDeck();
      if (action === "expand") return expandBank();
      if (action === "due-empty") {
        statusLine("No cards due — open Learn for new cards.");
        toast("Queue empty");
        var learn = $("ar-studio") && $("ar-studio").querySelector('[data-mode="learn"]');
        if (learn) learn.click();
        return;
      }
      if (action === "today-pack") {
        var pack = packForDay(dayIndex());
        if (pack.cards[0]) speakAr(pack.cards[0].ar, false);
        toast("Day " + dayIndex() + " pack");
        statusLine(pack.title);
        var listen = $("ar-studio") && $("ar-studio").querySelector('[data-mode="listen"]');
        if (listen) listen.click();
        return;
      }
      if (action === "hear-line") {
        var p = packForDay(dayIndex());
        if (p.speak) speakAr(p.speak, true);
        return;
      }
      if (action === "shadow") {
        try {
          var o = JSON.parse(localStorage.getItem(SPEAK_KEY) || "{}");
          o["day-" + dayIndex()] = (o["day-" + dayIndex()] || 0) + 1;
          localStorage.setItem(SPEAK_KEY, JSON.stringify(o));
        } catch (e) {}
        toast("Logged");
        return;
      }
      if (action === "day-next") {
        try { localStorage.setItem(DAY_KEY, String(Math.min(30, dayIndex() + 1))); } catch (e) {}
        var bar = $("ar-studio") && $("ar-studio").querySelector(".ar-speak-path");
        if (bar) bar.remove();
        injectSpeakBar();
        toast("Day " + dayIndex());
      }
    } catch (e) {}
  }

  function bindDelegate() {
    var root = $("ar-studio");
    if (!root || root.__arRepairBound) return;
    root.__arRepairBound = true;
    root.addEventListener("click", function (e) {
      try {
        var t = e.target;
        if (!t) return;
        var node = t.closest ? t.closest("[data-ar-action]") : null;
        if (node) {
          e.preventDefault();
          e.stopPropagation();
          onAction(node.getAttribute("data-ar-action"));
          return;
        }
        if (t.id === "ar-use-path") { e.preventDefault(); e.stopPropagation(); onAction("use-path"); }
        if (t.id === "ar-expand") { e.preventDefault(); e.stopPropagation(); onAction("expand"); }
      } catch (err) {}
    }, true);
  }

  function boot() {
    if (bootDone && $("ar-studio") && $("ar-studio").__arRepairBound) {
      decorateButtons();
      return;
    }
    try {
      bindDelegate();
      decorateButtons();
      statusLine("Arabic studio stable · Day " + dayIndex() + "/30");
      bootDone = true;
    } catch (e) {}
  }

  var sched = null;
  function scheduleBoot() {
    if (sched) return;
    sched = setTimeout(function () {
      sched = null;
      boot();
    }, 80);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      scheduleBoot();
      setTimeout(scheduleBoot, 400);
    });
  } else {
    scheduleBoot();
    setTimeout(scheduleBoot, 400);
  }

  /* Debounced observer — prevents mobile tab crash loops */
  try {
    var rootWait = setInterval(function () {
      var root = $("ar-studio");
      if (!root) return;
      clearInterval(rootWait);
      var t = null;
      var obs = new MutationObserver(function () {
        if (decorating) return;
        if (t) clearTimeout(t);
        t = setTimeout(function () {
          try { decorateButtons(); } catch (e) {}
        }, 200);
      });
      obs.observe(root, { childList: true, subtree: false });
    }, 100);
    setTimeout(function () { try { clearInterval(rootWait); } catch (e) {} }, 8000);
  } catch (e) {}
})(typeof window !== "undefined" ? window : this);
