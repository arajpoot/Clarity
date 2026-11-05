/*! craft-quiz-studio-v1 · C16QZ
 * Sharia IQ + Daily Fiqh for Craft — Companion SIQ parity (local banks).
 * Educational only — not a fatwa · not a grade of īmān · verify primary texts.
 * Storage: clarity.craft.quiz.log.v1 (on-device session log only).
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_QUIZ_STUDIO_C16QZ__) return;
  w.__CRAFT_QUIZ_STUDIO_C16QZ__ = true;

  var LOG_KEY = "clarity.craft.quiz.log.v1";
  var BANK = [];
  var mode = "daily"; /* daily | iq */
  var i = 0;
  var locked = false;
  var session = { correct: 0, total: 0, started: 0 };
  var timed = false;
  var hideCorrect = false;
  var timerId = null;
  var timeLeft = 0;

  function $(id) { return d.getElementById(id); }
  function status(msg) {
    var el = $("quiz-status");
    if (el) el.textContent = msg || "";
  }
  function normalize(item) {
    if (!item || typeof item !== "object") return null;
    var q = item.question || item.q || item.prompt;
    var opts = item.options || item.opts || item.choices;
    var a = item.answerIndex != null ? item.answerIndex : item.a != null ? item.a : item.correct;
    var src = item.source || item.src || item.ref || "Educational bank · verify primary texts · not a fatwa";
    if (!q || !opts || !opts.length) return null;
    if (typeof a === "string") {
      var idx = -1;
      for (var j = 0; j < opts.length; j++) {
        if (String(opts[j]).toLowerCase() === a.toLowerCase()) { idx = j; break; }
      }
      a = idx >= 0 ? idx : 0;
    }
    a = a | 0;
    if (a < 0 || a >= opts.length) a = 0;
    return { q: String(q), opts: opts.map(String), a: a, src: String(src) };
  }
  function mergeBanks(arr) {
    if (!Array.isArray(arr)) return;
    arr.forEach(function (item) {
      var n = normalize(item);
      if (n) BANK.push(n);
    });
  }
  function ingest(data) {
    if (!data) return;
    if (Array.isArray(data)) { mergeBanks(data); return; }
    if (typeof data !== "object") return;
    if (Array.isArray(data.questions)) mergeBanks(data.questions);
    if (Array.isArray(data.items)) mergeBanks(data.items);
    if (Array.isArray(data.bank)) mergeBanks(data.bank);
    if (data.transitions && typeof data.transitions === "object") {
      Object.keys(data.transitions).forEach(function (k) { mergeBanks(data.transitions[k]); });
    }
    if (data.modules && typeof data.modules === "object") {
      Object.keys(data.modules).forEach(function (k) {
        var mod = data.modules[k];
        if (Array.isArray(mod)) mergeBanks(mod);
        else if (mod && Array.isArray(mod.questions)) mergeBanks(mod.questions);
      });
    }
  }
  function loadJson(url) {
    return fetch(url, { credentials: "same-origin", cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("bad"); return r.json(); })
      .then(ingest)
      .catch(function () {});
  }

  var FALLBACK = [
    { q: "How many obligatory daily prayers are there?", opts: ["Three", "Four", "Five", "Six"], a: 2, src: "Consensus overview · educational · not a fatwa" },
    { q: "Sūrat al-ʿAṣr stresses belief, righteous work, and…", opts: ["Wealth", "Truth and patience", "Travel", "Silence only"], a: 1, src: "Qur’an 103 · educational" },
    { q: "Zakāh is generally due on wealth above niṣāb after…", opts: ["One day", "One lunar year (ḥawl)", "Ten years", "Never"], a: 1, src: "Classical fiqh overview · ask a local scholar" },
    { q: "The testimony of faith includes that Muḥammad ﷺ is…", opts: ["An angel", "The Messenger of Allah", "A poet only", "Optional"], a: 1, src: "Shahādah · educational" },
    { q: "Wudu is required before ṣalāh when…", opts: ["Always optional", "In a state of minor impurity / as required", "Only on Fridays", "Never"], a: 1, src: "Fiqh overview · educational · not a fatwa" },
    { q: "Tajweed primarily concerns…", opts: ["Cooking", "Correct Qur’ān recitation rules", "Trade law", "Calendar design"], a: 1, src: "Tajweed pedagogy · learn with a teacher" },
    { q: "A common condition of valid ṣalāh is…", opts: ["Facing the qiblah", "Owning land", "Travel only", "Silence forever"], a: 0, src: "Prayer conditions overview · educational" },
    { q: "Istighfār means…", opts: ["Seeking forgiveness from Allah", "A type of trade", "A travel prayer only", "Ignoring mistakes"], a: 0, src: "Linguistic / spiritual overview · educational" }
  ];

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function stopTimer() {
    if (timerId) clearInterval(timerId);
    timerId = null;
  }
  function startTimer(sec) {
    stopTimer();
    timeLeft = sec || 25;
    var el = $("quiz-timer");
    timerId = setInterval(function () {
      timeLeft--;
      if (el) el.textContent = timed ? ("Time · " + Math.max(0, timeLeft) + "s") : "";
      if (timeLeft <= 0) {
        stopTimer();
        if (!locked) lockAnswer(-1);
      }
    }, 1000);
    if (el) el.textContent = "Time · " + timeLeft + "s";
  }

  function logSession() {
    try {
      var arr = JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
      arr.unshift({
        t: new Date().toISOString(),
        mode: mode,
        correct: session.correct,
        total: session.total
      });
      localStorage.setItem(LOG_KEY, JSON.stringify(arr.slice(0, 30)));
    } catch (e) {}
    paintLog();
  }
  function paintLog() {
    var el = $("quiz-daily-log");
    if (!el) return;
    try {
      var arr = JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
      if (!arr.length) {
        el.innerHTML = "<span class='panel-note'>No sessions logged yet on this device.</span>";
        return;
      }
      el.innerHTML = arr.slice(0, 5).map(function (r) {
        return "<div class='panel-note'>" + (r.t || "").slice(0, 16).replace("T", " ") +
          " · " + (r.mode || "") + " · " + (r.correct || 0) + "/" + (r.total || 0) + "</div>";
      }).join("");
    } catch (e) {
      el.textContent = "";
    }
  }

  function show() {
    locked = false;
    if (!BANK.length) BANK = FALLBACK.slice();
    if (mode === "iq" && session.total === 0) {
      BANK = shuffle(BANK);
      session.started = Date.now();
    }
    var item = BANK[i % BANK.length];
    var prog = $("quiz-progress");
    var qel = $("quiz-q");
    var box = $("quiz-opts");
    var fb = $("quiz-feedback");
    var res = $("quiz-result");
    if (res) res.hidden = true;
    if (!qel || !box) return;
    if (prog) {
      prog.textContent = mode === "iq"
        ? ("IQ · Q " + (session.total + 1) + " · score " + session.correct + "/" + session.total)
        : ("Daily Fiqh · " + ((i % BANK.length) + 1) + " / " + BANK.length);
    }
    qel.textContent = item.q;
    if (fb) fb.textContent = "";
    box.innerHTML = item.opts.map(function (o, idx) {
      return '<button type="button" data-idx="' + idx + '">' + o + "</button>";
    }).join("");
    box.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (locked) return;
        lockAnswer(+btn.getAttribute("data-idx"));
      });
    });
    if (timed && mode === "iq") startTimer(25);
    else {
      stopTimer();
      var el = $("quiz-timer");
      if (el) el.textContent = "";
    }
  }

  function lockAnswer(idx) {
    locked = true;
    stopTimer();
    var item = BANK[i % BANK.length];
    var box = $("quiz-opts");
    var fb = $("quiz-feedback");
    if (!box) return;
    box.querySelectorAll("button").forEach(function (b) { b.disabled = true; });
    var buttons = box.querySelectorAll("button");
    var ok = idx === item.a;
    if (mode === "iq") {
      session.total++;
      if (ok) session.correct++;
    }
    if (idx >= 0 && buttons[idx]) buttons[idx].classList.add(ok ? "ok" : "bad");
    if (!hideCorrect && buttons[item.a]) buttons[item.a].classList.add("ok");
    if (fb) {
      fb.textContent = (ok ? "Correct · " : "Review · ") + item.src + " · Educational only — not a fatwa.";
    }
    var prog = $("quiz-progress");
    if (prog && mode === "iq") {
      prog.textContent = "IQ · score " + session.correct + "/" + session.total;
    }
  }

  function next() {
    if (mode === "iq" && session.total >= 10) {
      finishIq();
      return;
    }
    i++;
    show();
  }

  function finishIq() {
    stopTimer();
    logSession();
    var res = $("quiz-result");
    var stage = $("quiz-stage");
    if (stage) stage.hidden = true;
    if (res) {
      res.hidden = false;
      res.innerHTML =
        "<h3>Session result</h3>" +
        "<p><strong>" + session.correct + " / " + session.total + "</strong> correct</p>" +
        "<p class='panel-note'>Educational self-check only — not a fatwa · not a grade of īmān. Review missed items with primary texts or a local teacher.</p>" +
        "<button type='button' class='btn primary' id='quiz-again'>Another session</button>";
      var again = $("quiz-again");
      if (again) again.addEventListener("click", function () {
        session = { correct: 0, total: 0, started: Date.now() };
        if (res) res.hidden = true;
        if (stage) stage.hidden = false;
        i = 0;
        BANK = shuffle(BANK.length ? BANK : FALLBACK.slice());
        show();
      });
    }
  }

  function setMode(m) {
    mode = m === "iq" ? "iq" : "daily";
    session = { correct: 0, total: 0, started: Date.now() };
    i = 0;
    d.querySelectorAll("[data-quiz-mode]").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-quiz-mode") === mode);
    });
    var stage = $("quiz-stage");
    var res = $("quiz-result");
    if (res) res.hidden = true;
    if (stage) stage.hidden = false;
    if (mode === "iq") BANK = shuffle(BANK.length ? BANK : FALLBACK.slice());
    show();
    status(mode === "iq" ? "Sharia IQ · 10-question session" : "Daily Fiqh · sequential bank");
  }

  function boot() {
    timed = !!($("siq-timed") && $("siq-timed").checked);
    hideCorrect = !!($("siq-hide-correct") && $("siq-hide-correct").checked);
    d.querySelectorAll("[data-quiz-mode]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setMode(btn.getAttribute("data-quiz-mode"));
      });
    });
    var nextBtn = $("quiz-next");
    if (nextBtn) nextBtn.addEventListener("click", next);
    var startIq = $("quiz-start-iq");
    if (startIq) startIq.addEventListener("click", function () { setMode("iq"); });
    ["siq-timed", "siq-hide-correct"].forEach(function (id) {
      var el = $(id);
      if (el) el.addEventListener("change", function () {
        timed = !!($("siq-timed") && $("siq-timed").checked);
        hideCorrect = !!($("siq-hide-correct") && $("siq-hide-correct").checked);
      });
    });
    paintLog();
    Promise.all([
      loadJson("/craft/assets/data/path-quiz-bank.json?v=20261105C16QZ"),
      loadJson("/craft/assets/data/module-spark-quiz-bank.json?v=20261105C16QZ"),
      loadJson("/craft/assets/vendor/path-quiz-bank.json?v=20261105C16QZ").catch(function () {}),
      loadJson("/assets/curriculum/shared/path-quiz-bank.json").catch(function () {}),
      loadJson("/assets/curriculum/shared/module-spark-quiz-bank.json").catch(function () {})
    ]).then(function () {
      if (!BANK.length) BANK = FALLBACK.slice();
      status("Banks ready · " + BANK.length + " items · educational only");
      setMode("daily");
    });
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
