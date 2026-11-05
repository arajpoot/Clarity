/*! craft-quiz-v1 · C13 · local + curriculum transitions · educational only */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_CRAFT_QUIZ_C13__) return;
  w.__CLARITY_CRAFT_QUIZ_C13__ = true;

  var FALLBACK = [
    { q: "How many obligatory daily prayers are there?", opts: ["Three", "Four", "Five", "Six"], a: 2, src: "Consensus overview · educational" },
    { q: "Sūrat al-ʿAṣr stresses belief, righteous work, and…", opts: ["Wealth", "Truth and patience", "Travel", "Silence only"], a: 1, src: "Qur’an 103 · educational" },
    { q: "Zakāh is generally due on wealth above niṣāb after…", opts: ["One day", "One lunar year (ḥawl)", "Ten years", "Never"], a: 1, src: "Classical fiqh overview · ask a local scholar" },
    { q: "The testimony of faith includes that Muḥammad ﷺ is…", opts: ["An angel", "The Messenger of Allah", "A poet only", "Optional"], a: 1, src: "Shahādah · educational" },
    { q: "Tajweed primarily concerns…", opts: ["Cooking", "Correct Qur’ān recitation rules", "Trade law", "Calendar design"], a: 1, src: "Tajweed pedagogy · learn with a teacher" }
  ];
  var BANK = FALLBACK.slice();
  var i = 0, locked = false;

  function normalize(item) {
    if (!item || typeof item !== "object") return null;
    var q = item.question || item.q || item.prompt;
    var opts = item.options || item.opts || item.choices;
    var a = item.answerIndex != null ? item.answerIndex : (item.a != null ? item.a : item.correct);
    var src = item.source || item.src || item.ref || "Curriculum bank · educational only";
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
    return { q: q, opts: opts, a: a, src: src };
  }

  function mergeBanks(arr) {
    if (!Array.isArray(arr)) return;
    for (var k = 0; k < arr.length; k++) {
      var n = normalize(arr[k]);
      if (n) BANK.push(n);
    }
  }

  function ingest(data) {
    if (!data) return;
    if (Array.isArray(data)) { mergeBanks(data); return; }
    if (typeof data !== "object") return;
    if (Array.isArray(data.questions)) mergeBanks(data.questions);
    if (Array.isArray(data.items)) mergeBanks(data.items);
    if (Array.isArray(data.bank)) mergeBanks(data.bank);
    /* path-quiz-bank: { transitions: { "1": [ {q,opts,a}, ... ] } } */
    if (data.transitions && typeof data.transitions === "object") {
      Object.keys(data.transitions).forEach(function (key) {
        mergeBanks(data.transitions[key]);
      });
    }
    /* module-spark may nest modules */
    if (data.modules && typeof data.modules === "object") {
      Object.keys(data.modules).forEach(function (key) {
        var mod = data.modules[key];
        if (Array.isArray(mod)) mergeBanks(mod);
        else if (mod && Array.isArray(mod.questions)) mergeBanks(mod.questions);
      });
    }
  }

  function show() {
    locked = false;
    if (!BANK.length) BANK = FALLBACK.slice();
    var item = BANK[i % BANK.length];
    var prog = d.getElementById("quiz-progress");
    var qel = d.getElementById("quiz-q");
    var box = d.getElementById("quiz-opts");
    var fb = d.getElementById("quiz-feedback");
    if (!qel || !box) return;
    if (prog) prog.textContent = "Question " + ((i % BANK.length) + 1) + " / " + BANK.length;
    qel.textContent = item.q;
    if (fb) fb.textContent = "";
    box.innerHTML = item.opts.map(function (o, idx) {
      return '<button type="button" data-idx="' + idx + '">' + o + "</button>";
    }).join("");
    box.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (locked) return;
        locked = true;
        var idx = +btn.getAttribute("data-idx");
        box.querySelectorAll("button").forEach(function (b) { b.disabled = true; });
        if (idx === item.a) {
          btn.classList.add("ok");
          if (fb) fb.textContent = "Correct · " + item.src;
        } else {
          btn.classList.add("bad");
          var right = box.querySelectorAll("button")[item.a];
          if (right) right.classList.add("ok");
          if (fb) fb.textContent = "Review · " + item.src + " · Educational only — not a fatwa.";
        }
      });
    });
  }

  function loadJson(url) {
    return fetch(url, { credentials: "same-origin", cache: "no-store" }).then(function (r) {
      if (!r.ok) throw new Error("bad");
      return r.json();
    }).then(ingest).catch(function () {});
  }

  function boot() {
    var next = d.getElementById("quiz-next");
    if (next) next.addEventListener("click", function () { i++; show(); });
    Promise.all([
      loadJson("/craft/assets/vendor/module-spark-quiz-bank.json?v=20261104C13"),
      loadJson("/craft/assets/vendor/path-quiz-bank.json?v=20261104C13")
    ]).then(function () {
      show();
      if (w.ClarityCraftRegistry) w.ClarityCraftRegistry.runUpgrade("quiz", { n: BANK.length });
    });
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
