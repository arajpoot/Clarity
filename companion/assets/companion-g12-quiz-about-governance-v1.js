/*! companion-g12-quiz-about-governance-v1
 * Sharia IQ & Daily Fiqh offline deck · About tab focus · governance
 * Educational self-check only — NOT a fatwa. Verify on Quran.com / Sunnah.com / a local scholar.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_G12_QUIZ_ABOUT_V1__) return;
  w.__CLARITY_G12_QUIZ_ABOUT_V1__ = true;
  var LOG = (w.__G12_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }
  function $(id) { return d.getElementById(id); }

  /* Offline bank — short stems, one correct index, source hint */
  var BANK = [
    { id: "b1", lvl: "beginner", topic: "Fiqh", q: "How many obligatory (farḍ) prayers are there each day?", choices: ["Three", "Four", "Five", "Six"], a: 2, why: "The five daily prayers are unanimously established. Verify details of times with a local teacher." },
    { id: "b2", lvl: "beginner", topic: "Fiqh", q: "What is the first pillar of Islam?", choices: ["Zakāh", "Shahāda", "Ḥajj", "Ṣawm"], a: 1, why: "Testimony of faith is the first pillar. Educational only — not a conversion procedure guide." },
    { id: "b3", lvl: "beginner", topic: "Daily", q: "Before prayer, a Muslim generally needs:", choices: ["Only perfume", "Wuḍūʾ (or ghusl when required)", "A written fatwa", "Travel"], a: 1, why: "Purity for prayer is required. Edge cases: ask a scholar." },
    { id: "b4", lvl: "beginner", topic: "Tafseer", q: "Sūrah al-Fātiḥah is recited in:", choices: ["Only Friday prayer", "Every rakʿah of the farḍ prayers (as taught)", "Only Taraweeh", "Only Janāzah"], a: 1, why: "Al-Fātiḥah’s role in prayer is foundational; school nuances exist — ask a teacher." },
    { id: "b5", lvl: "beginner", topic: "Seerah", q: "The Prophet ﷺ migrated (Hijrah) from Makkah to:", choices: ["Ṭāʾif", "Madinah", "Yemen", "Egypt"], a: 1, why: "Hijrah to Madinah is a central sīrah event." },
    { id: "b6", lvl: "beginner", topic: "Daily", q: "Saying “Bismillah” before eating is:", choices: ["Forbidden", "A recommended adab / sunnah practice", "Only for guests", "Only in Ramadan"], a: 1, why: "Prophetic adab of food. Educational character practice." },
    { id: "b7", lvl: "beginner", topic: "Fiqh", q: "Zakāh is primarily:", choices: ["Optional gift only", "An obligatory alms on qualifying wealth", "Only for travelers", "A tax to any state"], a: 1, why: "Zakāh is a pillar with conditions — calculate with a qualified person." },
    { id: "b8", lvl: "beginner", topic: "Seerah", q: "The Qurʾān was revealed over approximately:", choices: ["1 year", "5 years", "23 years", "50 years"], a: 2, why: "Classical sīrah/history teaching: about 23 years." },
    { id: "i1", lvl: "intermediate", topic: "Fiqh", q: "In travel, shortening (qaṣr) of some prayers is:", choices: ["Always forbidden", "A concession with conditions in the schools", "Only for Ḥajj", "Only for women"], a: 1, why: "Qaṣr has conditions (distance, intention, etc.). Ask a local scholar for your case." },
    { id: "i2", lvl: "intermediate", topic: "Tafseer", q: "Asbāb al-nuzūl refers to:", choices: ["Prayer times", "Reported contexts/occasions of revelation", "Inheritance shares", "Grammar only"], a: 1, why: "Occasions of revelation aid understanding; not every ayah has a specific report." },
    { id: "i3", lvl: "intermediate", topic: "Seerah", q: "The Treaty of Ḥudaybiyyah is remembered for:", choices: ["Abandoning prayer", "A peace agreement and strategic patience", "Canceling Ḥajj forever", "Ending zakāh"], a: 1, why: "Major sīrah milestone; study with a teacher for detail." },
    { id: "i4", lvl: "intermediate", topic: "Fiqh", q: "Intention (niyyah) for wuḍūʾ and prayer is:", choices: ["Irrelevant", "Central in the heart for valid worship (as taught)", "Only spoken in English", "Only for imams"], a: 1, why: "Niyyah is foundational; articulation rules differ by school." },
    { id: "i5", lvl: "intermediate", topic: "Daily", q: "Backbiting (ghībah) is:", choices: ["Allowed if true", "Generally prohibited; exceptions are narrow", "Recommended in daʿwah", "Only about non-Muslims"], a: 1, why: "Qur’an 49:12 theme. Educational ethics — not a case ruling." },
    { id: "i6", lvl: "intermediate", topic: "Tafseer", q: "Tafsīr bi’l-maʾthūr emphasizes:", choices: ["Only poetry", "Reports from Qur’an, Sunnah, and early authorities", "Astrology", "Dreams only"], a: 1, why: "Classical method label; still verify chains/teachers." },
    { id: "a1", lvl: "advanced", topic: "Fiqh", q: "When reports appear to conflict, scholars may use:", choices: ["Ignore all hadith", "Methods of reconciliation, abrogation analysis, or preference with usūl", "Coin flips", "Social media polls"], a: 1, why: "Usūl al-fiqh tools — not DIY fatwa. Refer real conflicts to qualified scholars." },
    { id: "a2", lvl: "advanced", topic: "Tafseer", q: "Isrāʾīliyyāt in tafsīr are:", choices: ["Always ṣaḥīḥ proof", "Reports from earlier peoples; used cautiously and verified", "Identical to mutawātir sunnah", "Modern news only"], a: 1, why: "Classical caution on Israʾīliyyāt. Educational note only." },
    { id: "a3", lvl: "advanced", topic: "Fiqh", q: "A fatwa is best understood as:", choices: ["A binding law for all times/places automatically", "A scholarly legal opinion for a context; not your DIY quiz result", "A hadith text", "A translation only"], a: 1, why: "This app never issues fatwas." },
    { id: "a4", lvl: "advanced", topic: "Seerah", q: "The Constitution of Madinah literature is studied as:", choices: ["A modern constitution template for every state", "Historical documents on community agreements in early Madinah (academic/sīrah study)", "A replacement for Qur’an", "A commercial contract only"], a: 1, why: "Historical study — not a political program." },
    { id: "a5", lvl: "advanced", topic: "Daily", q: "Riyaʾ (showing off in worship) is:", choices: ["A minor joke", "A spiritual disease that can void reward; treat with sincerity", "Required for daʿwah fame", "Only about clothing"], a: 1, why: "Heart-works: educational reminder, not a diagnosis." },
    { id: "d1", lvl: "beginner", topic: "Daily", q: "The best day of the week for extra emphasis in many reports is:", choices: ["Monday only", "Friday (Jumuʿah)", "Wednesday", "Only Eid"], a: 1, why: "Jumuʿah virtues are well-known; verify specific reports on Sunnah.com." },
    { id: "d2", lvl: "intermediate", topic: "Fiqh", q: "Janāzah prayer is:", choices: ["Exactly like a normal four-rakʿah ẓuhr", "A distinct funeral prayer with its own form", "Only done in Ramadan", "Replaced by fasting"], a: 1, why: "Learn the form from a local imam. Educational only." },
    { id: "d3", lvl: "beginner", topic: "Tafseer", q: "“Iqraʾ” at the beginning of revelation relates to:", choices: ["Ending prayer", "The command to read/recite (Sūrah al-ʿAlaq)", "Building the Kaʿbah", "Writing contracts only"], a: 1, why: "Sīrah of the first revelation — study with tafsīr." }
  ];

  var state = {
    level: "beginner",
    topic: "all",
    deck: [],
    idx: 0,
    today: 0,
    correct: 0,
    seen: {},
    answered: {}
  };

  try {
    var st = JSON.parse(localStorage.getItem("clarity.fq.state.v1") || "null");
    if (st) {
      state.today = st.today || 0;
      state.correct = st.correct || 0;
      state.seen = st.seen || {};
    }
  } catch (e) {}

  function save() {
    try {
      localStorage.setItem(
        "clarity.fq.state.v1",
        JSON.stringify({
          today: state.today,
          correct: state.correct,
          seen: state.seen,
          day: new Date().toISOString().slice(0, 10)
        })
      );
    } catch (e) {}
  }

  function filtered() {
    return BANK.filter(function (c) {
      if (state.level && c.lvl !== state.level) return false;
      if (state.topic && state.topic !== "all" && c.topic !== state.topic) return false;
      return true;
    });
  }

  function buildDeck(forceAll) {
    var pool = filtered();
    if (!pool.length) pool = BANK.slice();
    var unused = pool.filter(function (c) {
      return forceAll || !state.seen[c.id];
    });
    if (!unused.length) unused = pool.slice();
    /* shuffle */
    for (var i = unused.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = unused[i];
      unused[i] = unused[j];
      unused[j] = t;
    }
    state.deck = unused.slice(0, 10);
    state.idx = 0;
    log("deck:" + state.deck.length);
  }

  function stats() {
    var streak = $("fq-streak");
    var today = $("fq-today");
    var best = $("fq-best");
    var total = $("fq-total");
    if (streak) streak.textContent = "🔥 Streak " + (state.streak || 0);
    if (today) today.textContent = "Today " + state.correct + "/" + Math.max(state.today, 10);
    if (best) best.textContent = "Best " + (state.best || state.correct || 0);
    if (total) total.textContent = "All-time " + (Object.keys(state.seen).length || 0);
  }

  function renderCard() {
    var stage = $("fq-stage");
    if (!stage) return;
    if (!state.deck.length) buildDeck(false);
    if (!state.deck.length) {
      stage.innerHTML = "<p class=\"td-src\">No cards in this filter. Try All topics or another level.</p>";
      return;
    }
    if (state.idx >= state.deck.length) {
      stage.innerHTML =
        "<p><strong>Deck complete.</strong> " +
        state.correct +
        " correct marks this session.</p><p class=\"td-src\">Educational only — not a fatwa. Verify on Sunnah.com / IslamQA / a local scholar.</p>";
      stats();
      return;
    }
    var c = state.deck[state.idx];
    var html =
      '<div class="fq-card" data-id="' +
      c.id +
      '"><div class="fq-q" style="font-weight:700;margin:0 0 .5rem;line-height:1.45">' +
      (state.idx + 1) +
      ". " +
      c.q +
      '</div><div class="fq-choices" style="display:flex;flex-direction:column;gap:.35rem">';
    c.choices.forEach(function (ch, i) {
      html +=
        '<button type="button" class="btn-soft fq-choice" data-i="' +
        i +
        '" style="text-align:left">' +
        ch +
        "</button>";
    });
    html +=
      '</div><p class="fq-why td-src" style="display:none;margin-top:.5rem;line-height:1.45"></p></div>';
    stage.innerHTML = html;
    stage.querySelectorAll(".fq-choice").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (state.answered[c.id]) return;
        var pick = parseInt(btn.getAttribute("data-i"), 10);
        state.answered[c.id] = true;
        state.seen[c.id] = true;
        state.today += 1;
        var why = stage.querySelector(".fq-why");
        if (pick === c.a) {
          state.correct += 1;
          btn.style.borderColor = "#3d9e6f";
          if (why) {
            why.style.display = "block";
            why.textContent = "Correct. " + c.why;
          }
        } else {
          btn.style.borderColor = "#a55";
          var right = stage.querySelector('.fq-choice[data-i="' + c.a + '"]');
          if (right) right.style.borderColor = "#3d9e6f";
          if (why) {
            why.style.display = "block";
            why.textContent = "Not quite. " + c.why;
          }
        }
        save();
        stats();
      });
    });
    stats();
  }

  w.fqSetLevel = function (lvl) {
    state.level = lvl || "beginner";
    d.querySelectorAll(".fq-lvl").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-lvl") === state.level);
    });
    buildDeck(false);
    renderCard();
  };
  w.fqSetTopic = function (topic) {
    state.topic = topic || "all";
    d.querySelectorAll(".fq-topic").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-topic") === state.topic);
    });
    buildDeck(false);
    renderCard();
  };
  w.fqForceNewDeck = function () {
    buildDeck(true);
    renderCard();
  };
  w.fqResetSeenDecks = function () {
    state.seen = {};
    state.answered = {};
    save();
    buildDeck(true);
    renderCard();
  };
  w.fqNext = function () {
    state.idx += 1;
    renderCard();
  };
  w.fqResetToday = function () {
    state.today = 0;
    state.correct = 0;
    state.answered = {};
    save();
    buildDeck(true);
    renderCard();
  };
  w.fqFetchOnlineDeck = function () {
    var st = $("fq-online-status");
    if (st) st.textContent = "Using offline educational bank (online deck optional / unavailable).";
    buildDeck(true);
    renderCard();
  };
  w.fqUseStoredOnly = function () {
    var st = $("fq-online-status");
    if (st) st.textContent = "Stored offline bank only.";
    buildDeck(false);
    renderCard();
  };
  w.fqLogDailyProgress = function () {
    try {
      var logs = JSON.parse(localStorage.getItem("clarity.fq.log.v1") || "[]");
      logs.push({ t: Date.now(), correct: state.correct, today: state.today });
      localStorage.setItem("clarity.fq.log.v1", JSON.stringify(logs.slice(-30)));
    } catch (e) {}
    alert("Progress logged on this device only. Educational only — not a fatwa.");
  };
  w.fqShowDailyLog = function () {
    try {
      var logs = JSON.parse(localStorage.getItem("clarity.fq.log.v1") || "[]");
      alert(logs.length ? JSON.stringify(logs.slice(-5), null, 0) : "No log yet.");
    } catch (e) {
      alert("No log.");
    }
  };

  /* Sharia IQ panel — timed-style but simple */
  w.siqShow = function (which) {
    d.querySelectorAll(".siq-tab").forEach(function (t) {
      t.classList.toggle("active", t.getAttribute("data-siq") === which);
    });
    var daily = $("siq-panel-daily");
    var iq = $("siq-panel-iq");
    if (daily) daily.style.display = which === "daily" ? "block" : "none";
    if (iq) iq.style.display = which === "iq" ? "block" : "none";
    if (which === "daily") renderCard();
    if (which === "iq") renderIq();
  };

  function renderIq() {
    var stage = $("siq-iq-stage");
    if (!stage) return;
    var pool = BANK.filter(function (c) {
      return c.lvl === "intermediate" || c.lvl === "advanced";
    });
    var c = pool[Math.floor(Math.random() * pool.length)] || BANK[0];
    stage.innerHTML =
      '<p style="font-weight:700">' +
      c.q +
      "</p>" +
      c.choices
        .map(function (ch, i) {
          return '<button type="button" class="btn-soft siq-iq-ch" data-i="' + i + '" style="display:block;width:100%;text-align:left;margin:.3rem 0">' + ch + "</button>";
        })
        .join("") +
      '<p class="td-src siq-iq-why" style="display:none"></p>';
    stage.querySelectorAll(".siq-iq-ch").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var why = stage.querySelector(".siq-iq-why");
        var pick = parseInt(btn.getAttribute("data-i"), 10);
        if (why) {
          why.style.display = "block";
          why.textContent = (pick === c.a ? "Correct. " : "Review: ") + c.why;
        }
      });
    });
  }

  /* About tab: ensure content; optional move pointer from Notes vault message */
  function fortifyAbout() {
    var about = $("tab-about");
    if (!about) return;
    if (!about.querySelector("[data-g12-about]")) {
      var box = d.createElement("div");
      box.setAttribute("data-g12-about", "1");
      box.className = "card";
      box.style.cssText = "max-width:42rem;margin:1rem auto;padding:1.1rem";
      box.innerHTML =
        "<h2>About this Companion</h2>" +
        "<p><strong>Educational only — not a fatwa · not legal advice.</strong></p>" +
        "<ul style=\"line-height:1.5\">" +
        "<li>Qur’an &amp; hadith study aids with outbound links to Quran.com / Sunnah.com</li>" +
        "<li>Progress and notes stay on this device by default</li>" +
        "<li>Private vault / dayn / heirs: use the <a href=\"/amana/\">Amānah</a> room</li>" +
        "<li>Deep ateliers (meme, tajweed, calligraphy): <a href=\"/craft/\">Craft</a> room</li>" +
        "<li>Ordered curriculum: <a href=\"/campus/\">University</a> room</li>" +
        "</ul>" +
        "<p class=\"td-src\">Quizzes are self-checks for learning, never rulings.</p>";
      about.appendChild(box);
    }
    log("about-fortified");
  }

  function boot() {
    fortifyAbout();
    buildDeck(false);
    renderCard();
    var daily = $("siq-panel-daily");
    if (daily) daily.style.display = "block";
    var iq = $("siq-panel-iq");
    if (iq) iq.style.display = "none";
    log("g12-boot");
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
