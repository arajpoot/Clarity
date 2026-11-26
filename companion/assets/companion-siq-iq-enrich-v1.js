/*! companion-siq-iq-enrich-v1
 * Full Sharia IQ Test session (15Q) on Reminder — educational only, NOT a fatwa.
 * Depends on g12 BANK + exports; safe if g12 already defined.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_SIQ_IQ_ENRICH_V1__) return;
  w.__CLARITY_SIQ_IQ_ENRICH_V1__ = true;

  function $(id) { return d.getElementById(id); }

  /* Extra educational stems (path bank + companions) — not rulings */
  var EXTRA = [{"id": "p1_0", "lvl": "intermediate", "topic": "Path", "q": "Shahāda affirms belief in:", "choices": ["Allah alone and Muhammad ﷺ as His Messenger", "Culture only", "Any idol", "Travel alone"], "a": 0, "why": "Educational self-check only — not a fatwa. Verify with Qur’an, Sunnah, and a local scholar."}, {"id": "p1_1", "lvl": "intermediate", "topic": "Path", "q": "Before ṣalāh when required, one performs:", "choices": ["Wudu (ablution)", "A social media post", "A payment", "Silence only"], "a": 0, "why": "Educational self-check only — not a fatwa. Verify with Qur’an, Sunnah, and a local scholar."}, {"id": "p1_2", "lvl": "intermediate", "topic": "Path", "q": "The five daily prayers are:", "choices": ["A core practiced pillar of the religion", "Optional decoration", "Only for imams", "Replaced by intention alone"], "a": 0, "why": "Educational self-check only — not a fatwa. Verify with Qur’an, Sunnah, and a local scholar."}, {"id": "p1_3", "lvl": "intermediate", "topic": "Path", "q": "The Qur'an is:", "choices": ["The speech of Allah revealed to the Prophet ﷺ", "A human poetry book only", "Replaced by dreams", "Optional for belief"], "a": 0, "why": "Educational self-check only — not a fatwa. Verify with Qur’an, Sunnah, and a local scholar."}, {"id": "p1_4", "lvl": "intermediate", "topic": "Path", "q": "A Muslim turns for help first to:", "choices": ["Allah ﷻ", "Gossip circles", "Astrology", "Mockery of others"], "a": 0, "why": "Educational self-check only — not a fatwa. Verify with Qur’an, Sunnah, and a local scholar."}, {"id": "p2_5", "lvl": "intermediate", "topic": "Path", "q": "Steady growth is best as:", "choices": ["Consistent sincere deeds", "Only online debates", "Abandoning prayer when busy", "Never opening the Qur'an"], "a": 0, "why": "Educational self-check only — not a fatwa. Verify with Qur’an, Sunnah, and a local scholar."}, {"id": "p2_6", "lvl": "intermediate", "topic": "Path", "q": "Tajweed primarily helps:", "choices": ["Correct Qur'an recitation", "Business ads", "Astrology", "Skipping ṣalāh"], "a": 0, "why": "Educational self-check only — not a fatwa. Verify with Qur’an, Sunnah, and a local scholar."}, {"id": "p2_7", "lvl": "intermediate", "topic": "Path", "q": "Family legacy notes are:", "choices": ["Educational readiness — not a website fatwa", "Final court orders", "Public shaming tools", "A way to hide debts"], "a": 0, "why": "Educational self-check only — not a fatwa. Verify with Qur’an, Sunnah, and a local scholar."}, {"id": "p2_8", "lvl": "intermediate", "topic": "Path", "q": "Ramadan teaches:", "choices": ["Taqwa, patience, and gratitude", "Only weight loss", "Leaving all work forever", "Ignoring the needy"], "a": 0, "why": "Educational self-check only — not a fatwa. Verify with Qur’an, Sunnah, and a local scholar."}, {"id": "p2_9", "lvl": "intermediate", "topic": "Path", "q": "Seeking knowledge in Islam is:", "choices": ["A lifelong duty with sincerity", "Only for children", "Replaced by viral clips alone", "Optional if wealthy"], "a": 0, "why": "Educational self-check only — not a fatwa. Verify with Qur’an, Sunnah, and a local scholar."}, {"id": "p3_10", "lvl": "intermediate", "topic": "Path", "q": "Calm dawah prioritises:", "choices": ["Sincerity, authentic sources, manners", "Winning by mockery", "Invented rulings", "Hiding references"], "a": 0, "why": "Educational self-check only — not a fatwa. Verify with Qur’an, Sunnah, and a local scholar."}, {"id": "p3_11", "lvl": "intermediate", "topic": "Path", "q": "If unsure of a ruling:", "choices": ["Ask qualified local scholarship / trusted sources", "Post a confident guess", "Follow the angriest comment", "Ignore harm"], "a": 0, "why": "Educational self-check only — not a fatwa. Verify with Qur’an, Sunnah, and a local scholar."}, {"id": "p3_12", "lvl": "intermediate", "topic": "Path", "q": "Sharing scripture publicly needs:", "choices": ["Care for authenticity and context", "Speed over accuracy", "Editing verses for trend", "No references"], "a": 0, "why": "Educational self-check only — not a fatwa. Verify with Qur’an, Sunnah, and a local scholar."}, {"id": "p3_13", "lvl": "intermediate", "topic": "Path", "q": "The best speech is:", "choices": ["The Book of Allah and the guidance of His Messenger ﷺ", "Whatever is trending", "Anonymous insults", "Unverified dreams as law"], "a": 0, "why": "Educational self-check only — not a fatwa. Verify with Qur’an, Sunnah, and a local scholar."}, {"id": "p3_14", "lvl": "intermediate", "topic": "Path", "q": "Adab in teaching includes:", "choices": ["Humility, evidence, and not speaking without knowledge", "Raising voice to win", "Mocking students", "Hiding sources"], "a": 0, "why": "Educational self-check only — not a fatwa. Verify with Qur’an, Sunnah, and a local scholar."}];

  var session = { list: [], idx: 0, correct: 0, active: false };

  function allCards() {
    var bank = [];
    try {
      /* g12 keeps BANK private — re-read from DOM? we ship parallel list via forceNew from known */
    } catch (e) {}
    return EXTRA.slice();
  }

  /* Pull whatever we can from last rendered daily deck by reusing fq path: expose via window if g12 set */
  function pool() {
    var out = EXTRA.slice();
    /* synthesized from common educational themes if EXTRA thin */
    var seed = [
      { id: "iq1", lvl: "intermediate", topic: "Aqidah", q: "Tawḥīd means primarily:", choices: ["Many paths of divinity", "Oneness of Allah in lordship, worship, and names/attributes", "Political unity only", "Arabian culture"], a: 1, why: "Educational summary of classical categories of tawḥīd. Not a fatwa." },
      { id: "iq2", lvl: "intermediate", topic: "Quran", q: "The Qurʾān is:", choices: ["A human poem", "Revelation from Allah preserved as recited and written", "Only a history book", "Replaced by ḥadīth"], a: 1, why: "Belief of Ahl al-Sunnah in outline. Details: local teacher." },
      { id: "iq3", lvl: "intermediate", topic: "Fiqh", q: "Farḍ (obligatory) acts are:", choices: ["Optional niceties", "Required; omitting without excuse is sinful in standard fiqh", "Only for scholars", "Cultural habits"], a: 1, why: "Educational fiqh vocabulary — not a personal ruling." },
      { id: "iq4", lvl: "advanced", topic: "Seerah", q: "The Hijrah is significant because it:", choices: ["Ended all conflict permanently", "Marked a new phase for the Muslim community in Madinah", "Cancelled Makkah’s sacredness", "Replaced prayer"], a: 1, why: "Seerah overview for learners." },
      { id: "iq5", lvl: "intermediate", topic: "Character", q: "Ikhlāṣ (sincerity) in worship means:", choices: ["Seeking show and praise", "Doing deeds for Allah alone", "Only praying in public", "Avoiding all good deeds"], a: 1, why: "Character education — not a fatwa." },
      { id: "iq6", lvl: "intermediate", topic: "Fiqh", q: "Wuḍūʾ is generally required before:", choices: ["Sleeping only", "The ritual prayer (ṣalāh)", "Every conversation", "Eating fruit"], a: 1, why: "Basic purity for prayer — edge cases: ask a scholar." },
      { id: "iq7", lvl: "advanced", topic: "Hadith", q: "A ṣaḥīḥ report is described in the sciences of ḥadīth as:", choices: ["Any popular story", "Meeting conditions of authenticity taught in ḥadīth sciences", "Only political speeches", "Anonymous internet posts"], a: 1, why: "Outline only — study with qualified teachers." },
      { id: "iq8", lvl: "intermediate", topic: "Quran", q: "Sūrah al-Fātiḥah is:", choices: ["Never recited in prayer", "Recited in the obligatory prayers as taught", "Only for funerals", "Replaced by poetry"], a: 1, why: "Prayer practice overview." },
      { id: "iq9", lvl: "intermediate", topic: "Daily", q: "Saying Bismillah before eating is:", choices: ["Forbidden", "A recommended sunnah practice in many reports", "Only for scholars", "A substitute for ṣalāh"], a: 1, why: "Adab education." },
      { id: "iq10", lvl: "advanced", topic: "Aqidah", q: "Shirk is:", choices: ["A light etiquette issue only", "Associating partners with Allah — among the gravest matters in the religion", "Recommended in trade", "The same as minor forgetfulness always"], a: 1, why: "Core creed vocabulary for learners — not a judicial verdict." },
      { id: "iq11", lvl: "intermediate", topic: "Fiqh", q: "Zakāh is:", choices: ["A voluntary tip only", "An obligatory pillar for those who meet its conditions", "Only for travelers", "Paid instead of prayer"], a: 1, why: "Pillar overview — niṣāb and details: local fiqh." },
      { id: "iq12", lvl: "intermediate", topic: "Seerah", q: "Madinah after Hijrah became:", choices: ["Irrelevant to Islam", "The center of the growing Muslim community", "A place where prayer was banned", "Abandoned by the Prophet ﷺ"], a: 1, why: "Seerah frame." },
      { id: "iq13", lvl: "advanced", topic: "Tafseer", q: "Tafsīr seeks to:", choices: ["Replace the Qurʾān", "Explain meanings of the Qurʾān using accepted methods", "Invent new revelation", "Cancel sunnah"], a: 1, why: "Study method overview." },
      { id: "iq14", lvl: "intermediate", topic: "Character", q: "Ghībah (backbiting) is:", choices: ["Encouraged daily", "Speaking of your brother with what he dislikes — warned against in the sunnah", "Required in business", "The same as sincere advice always"], a: 1, why: "Character warning — educational." },
      { id: "iq15", lvl: "intermediate", topic: "Fiqh", q: "The five daily prayers are:", choices: ["Two only", "Five obligatory prayers in the day and night", "Only on Friday", "Optional for adults"], a: 1, why: "Pillar of practice." },
      { id: "iq16", lvl: "advanced", topic: "Hadith", q: "Following the Prophet ﷺ means:", choices: ["Ignoring revelation", "Taking him as the exemplar in guidance and law as taught in Islam", "Only reading poetry about him", "Rejecting all reports"], a: 1, why: "Educational creed/practice link." },
      { id: "iq17", lvl: "intermediate", topic: "Daily", q: "Before sleep, many Muslims are taught to:", choices: ["Abandon dhikr entirely", "Remember Allah with authentic adhkār as they are able", "Only watch entertainment", "Skip all purity"], a: 1, why: "Adab — not a strict personal ruling list." },
      { id: "iq18", lvl: "advanced", topic: "Fiqh", q: "A fatwa is best seen as:", choices: ["A new verse of revelation", "A scholarly answer to a question — not automatically universal law for every case", "A substitute for the Qurʾān", "Random internet consensus"], a: 1, why: "Helps learners avoid misuse of the word fatwa." }
    ];
    seed.forEach(function (c) { out.push(c); });
    return out;
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function showEl(el, on) {
    if (!el) return;
    if (on) {
      el.hidden = false;
      try { el.removeAttribute("hidden"); } catch (e) {}
      el.style.display = "";
    } else {
      el.hidden = true;
      el.style.display = "none";
    }
  }

  function renderSessionCard() {
    var stage = $("siq-iq-stage");
    var intro = $("siq-iq-intro");
    var result = $("siq-iq-result");
    if (!stage) return;
    showEl(intro, false);
    showEl(result, false);
    showEl(stage, true);

    if (session.idx >= session.list.length) {
      showEl(stage, false);
      showEl(result, true);
      if (result) {
        result.innerHTML =
          "<p><strong>Session complete.</strong> " +
          session.correct +
          " / " +
          session.list.length +
          " marked correct this run.</p>" +
          "<p class=\"td-src\">This is a <em>practice index</em> for learning — not a secular IQ score and not a fatwa. Verify knowledge with Qur’an, Sunnah, and a local scholar.</p>" +
          "<button type=\"button\" class=\"btn-soft\" onclick=\"siqStart()\">Begin again</button>";
      }
      session.active = false;
      return;
    }

    var c = session.list[session.idx];
    var n = session.idx + 1;
    var total = session.list.length;
    var html =
      '<div class="siq-iq-card">' +
      '<p class="td-src" style="margin:0 0 .35rem">Question ' + n + " / " + total + " · " + (c.topic || "") + "</p>" +
      '<p style="font-weight:700;line-height:1.45;margin:0 0 .65rem">' + c.q + "</p>" +
      '<div class="siq-iq-choices" style="display:flex;flex-direction:column;gap:.35rem">';
    (c.choices || []).forEach(function (ch, i) {
      html +=
        '<button type="button" class="btn-soft siq-iq-ch" data-i="' +
        i +
        '" style="text-align:left">' +
        ch +
        "</button>";
    });
    html +=
      '</div><p class="td-src siq-iq-why" style="display:none;margin-top:.55rem;line-height:1.45"></p>' +
      '<div style="margin-top:.65rem;display:flex;gap:.4rem;flex-wrap:wrap">' +
      '<button type="button" class="btn-soft" id="siq-iq-next" style="display:none">Next →</button>' +
      "</div></div>";
    try { w.__CLARITY_SIQ_SESSION__ = session; if (session && session.list && session.list[session.idx]) { /* current */ } } catch(e) {}
    stage.innerHTML = html;

    var answered = false;
    stage.querySelectorAll(".siq-iq-ch").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (answered) return;
        answered = true;
        var pick = parseInt(btn.getAttribute("data-i"), 10);
        var why = stage.querySelector(".siq-iq-why");
        var ok = pick === c.a;
        if (ok) session.correct += 1;
        if (why) {
          why.style.display = "block";
          why.textContent = (ok ? "Correct. " : "Review: ") + (c.why || "Educational only — not a fatwa.");
        }
        var next = $("siq-iq-next");
        if (next) next.style.display = "";
        stage.querySelectorAll(".siq-iq-ch").forEach(function (b) {
          b.disabled = true;
        });
      });
    });
    var next = $("siq-iq-next");
    if (next) {
      next.addEventListener("click", function () {
        session.idx += 1;
        renderSessionCard();
      });
    }
  }

  w.siqStart = function () {
    var panel = $("siq-panel-iq");
    var daily = $("siq-panel-daily");
    if (typeof w.siqShow === "function") {
      try { w.siqShow("iq"); } catch (e) {}
    } else {
      if (daily) showEl(daily, false);
      if (panel) showEl(panel, true);
    }
    var p = shuffle(pool());
    session.list = p.slice(0, 15);
    if (session.list.length < 15) {
      /* pad by reshuffling remaining */
      session.list = shuffle(pool()).slice(0, Math.min(15, pool().length));
    }
    session.idx = 0;
    session.correct = 0;
    session.active = true;
    var status = $("siq-online-status");
    if (status) status.textContent = "Using educational offline bank (" + session.list.length + " questions). Not a fatwa.";
    renderSessionCard();
  };

  w.siqFetchOnlineBank = function () {
    var status = $("siq-online-status");
    if (status) {
      status.textContent =
        "Online fetch optional — educational offline bank ready. Verify all answers with authentic sources.";
    }
  };

  w.siqShowDailyLog = function () {
    var log = $("siq-daily-log");
    if (!log) return;
    showEl(log, true);
    try {
      var logs = JSON.parse(localStorage.getItem("clarity.siq.log.v1") || "[]");
      if (!logs.length) {
        log.innerHTML = "<p class=\"td-src\">No IQ session log yet. Complete a test to store a practice note on this device.</p>";
      } else {
        log.innerHTML = logs
          .slice(-8)
          .reverse()
          .map(function (row) {
            return "<div>" + new Date(row.t).toLocaleString() + " · " + row.correct + "/" + row.total + "</div>";
          })
          .join("");
      }
    } catch (e) {
      log.textContent = "Log unavailable.";
    }
  };

  /* When g12 siqShow switches to iq, ensure stage can show after Start */
  var prev = w.siqShow;
  if (typeof prev === "function") {
    w.siqShow = function (which) {
      prev(which);
      if (which === "iq") {
        var stage = $("siq-iq-stage");
        var intro = $("siq-iq-intro");
        /* keep intro visible until Start; do not force empty hidden stage */
        if (stage && session.active) showEl(stage, true);
        if (intro && session.active) showEl(intro, false);
      }
    };
  }
})(window, document);
