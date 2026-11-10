/*! craft-quiz-curriculum-v1 · C20SIQ1
 * Sharia IQ Deep Studio — SIQ-rich UX + curriculum path + Phase 1 banks
 * Educational only — not a fatwa · not a grade of īmān · verify primary texts
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_QUIZ_CURR_C20SIQ1__) return;
  w.__CRAFT_QUIZ_CURR_C20SIQ1__ = true;

  var PATH_KEY = "clarity.craft.quiz.path.v2";
  var LOG_KEY = "clarity.craft.quiz.journal.v2";
  var STAT_KEY = "clarity.craft.quiz.stats.v2";
  var MAX_SHOW = 5;
  var SESSION_CAP = 5;

  var BANKS = {"orientation": {"id": "orientation", "title": "Orientation", "topic": "Orientation", "cards": [{"id": "o1", "title": "This studio’s purpose", "teach": "Sharia IQ is an educational self-check path. It does not issue fatwas, rank īmān, or replace a teacher. Scores stay on this device.", "citation": {"type": "note", "ref": "Clarity governance", "text": "Educational only — not a fatwa."}, "q": "What is the primary purpose of Sharia IQ Deep Studio?", "opts": ["To issue fatwas", "Educational self-check only", "To rank īmān", "To replace scholars"], "a": 1}, {"id": "o2", "title": "When you need a ruling", "teach": "Personal rulings require a qualified local scholar who hears your situation. Online cards cannot carry that trust.", "citation": {"type": "note", "ref": "Adab of iftāʾ", "text": "Ask a qualified local scholar for personal rulings."}, "q": "If you need a personal ruling, you should…", "opts": ["Trust any quiz score", "Ask a qualified local scholar", "Follow the highest streak", "Ignore primary texts"], "a": 1}]}, "taharah": {"id": "taharah", "title": "Ṭahārah", "topic": "Fiqh", "cards": [{"id": "t1", "title": "Purity before prayer", "teach": "Ṣalāh requires ṭahārah. The believer prepares with wuḍūʾ (or ghusl when required) before standing before Allāh. This is literacy — details of edge cases belong with a qualified teacher.", "citation": {"type": "quran", "ref": "Qur’an 5:6", "text": "O you who believe, when you rise for prayer, wash…", "url": "https://quran.com/5/6"}, "q": "What does ṭahārah primarily prepare a Muslim for in daily practice?", "opts": ["Social ranking", "Standing for ṣalāh in a state of purity", "Replacing repentance", "A public certificate"], "a": 1}, {"id": "t2", "title": "Wuḍūʾ is from the Sunnah of prayer", "teach": "The Prophet ﷺ taught wuḍūʾ as the ordinary way to enter prayer when minor impurity is present. Learning the outline is part of basic worship literacy.", "citation": {"type": "hadith", "collection": "Ṣaḥīḥ al-Bukhārī", "number": "159", "grade": "Ṣaḥīḥ", "url": "https://sunnah.com/bukhari:159"}, "q": "Wuḍūʾ is most closely linked to which daily obligation?", "opts": ["Optional poetry", "Ṣalāh when minor impurity is present", "Replacing zakāh", "Cancelling fasting"], "a": 1}, {"id": "t3", "title": "Intention of the heart", "teach": "Actions are by intentions. Wuḍūʾ and prayer begin with a sincere intention for Allāh — not for display. Exact verbal formulas vary by school; sincerity is shared.", "citation": {"type": "hadith", "collection": "Ṣaḥīḥ al-Bukhārī", "number": "1", "grade": "Ṣaḥīḥ", "url": "https://sunnah.com/bukhari:1"}, "q": "According to the opening of Ṣaḥīḥ al-Bukhārī, actions are judged by…", "opts": ["Public applause", "Intentions", "Wealth", "Speed alone"], "a": 1}, {"id": "t4", "title": "Outline of wuḍūʾ limbs", "teach": "A widely taught outline includes: intention, washing the hands, rinsing mouth and nose, washing the face, arms to the elbows, wiping the head, and washing the feet to the ankles. Confirm full practice with a teacher.", "citation": {"type": "quran", "ref": "Qur’an 5:6", "text": "…wash your faces and your forearms to the elbows and wipe over your heads and wash your feet to the ankles…", "url": "https://quran.com/5/6"}, "q": "Which body areas are named in Qur’an 5:6 for the washing/wiping of wuḍūʾ?", "opts": ["Only the hands", "Face, arms to elbows, head (wipe), feet to ankles", "Only the hair", "Only the chest"], "a": 1}, {"id": "t5", "title": "What breaks wuḍūʾ — literacy, not a fatwa", "teach": "Classical fiqh discusses matters that nullify wuḍūʾ (e.g. exiting impurity from the private parts). Schools differ on some details. This studio teaches awareness — not a personal ruling.", "citation": {"type": "hadith", "collection": "Ṣaḥīḥ al-Bukhārī", "number": "135", "grade": "Ṣaḥīḥ", "url": "https://sunnah.com/bukhari:135"}, "q": "If you are unsure whether your wuḍūʾ is still valid for a complex case, the safest educational step is…", "opts": ["Argue online", "Ask a qualified local teacher", "Ignore purity", "Follow a random social post"], "a": 1}, {"id": "t6", "title": "Ghusl when required", "teach": "Major impurity requires ghusl before prayer. The obligation and causes are taught in fiqh; this card only flags that ghusl is part of ṭahārah literacy, not a substitute for a teacher.", "citation": {"type": "quran", "ref": "Qur’an 5:6", "text": "…and if you are in a state of janābah, then purify yourselves…", "url": "https://quran.com/5/6"}, "q": "Janābah is addressed in Qur’an 5:6 by commanding the believer to…", "opts": ["Skip prayer permanently", "Purify themselves (ghusl)", "Only wipe the face", "Give zakāh instead"], "a": 1}, {"id": "t7", "title": "Water and purity", "teach": "Clean water is the default means of purification when available. Tayammum is a mercy when water cannot be used — its conditions are fiqh details for a teacher.", "citation": {"type": "quran", "ref": "Qur’an 5:6", "text": "…and if you find no water, then seek clean earth and wipe…", "url": "https://quran.com/5/6"}, "q": "When water is not available, Qur’an 5:6 points to which concession (details with a teacher)?", "opts": ["Abandoning all prayer", "Tayammum with clean earth", "Replacing prayer with fasting only", "No purification ever"], "a": 1}, {"id": "t8", "title": "Siwāk and cleanliness of the mouth", "teach": "The Prophet ﷺ strongly encouraged siwāk (tooth-stick) as part of cleanliness and readiness for prayer. It is a recommended practice of purity and adab, not a replacement for wuḍūʾ.", "citation": {"type": "hadith", "collection": "Ṣaḥīḥ al-Bukhārī", "number": "887", "grade": "Ṣaḥīḥ", "url": "https://sunnah.com/bukhari:887"}, "q": "Siwāk is best understood as…", "opts": ["A replacement for wuḍūʾ", "A recommended practice of cleanliness linked to prayer readiness", "A tax", "An optional political symbol"], "a": 1}, {"id": "t9", "title": "Privacy and adab of the bathroom", "teach": "Islamic teaching encourages modesty, cleanliness, and avoiding harm when relieving oneself. These are manners of purity in daily life — practiced with dignity, not displayed for attention.", "citation": {"type": "hadith", "collection": "Ṣaḥīḥ al-Bukhārī", "number": "156", "grade": "Ṣaḥīḥ", "url": "https://sunnah.com/bukhari:156"}, "q": "Adab related to relieving oneself is primarily about…", "opts": ["Public performance", "Modesty, cleanliness, and care", "Skipping purity rules", "Competing with others"], "a": 1}, {"id": "t10", "title": "Ṭahārah is a means, not a spectacle", "teach": "Purity serves worship and presence with Allāh. Showing off acts of purification for praise empties the intention. Keep learning humble; verify details with those who teach with knowledge and adab.", "citation": {"type": "hadith", "collection": "Ṣaḥīḥ Muslim", "number": "1907", "grade": "Ṣaḥīḥ", "url": "https://sunnah.com/muslim:1907"}, "q": "The healthiest approach to learning ṭahārah in this studio is…", "opts": ["Treat scores as a fatwa", "Use cards as literacy, then verify practice with a qualified teacher", "Ignore Qur’an and Sunnah", "Debate strangers for status"], "a": 1}]}, "salah-map": {"id": "salah-map", "title": "Ṣalāh map", "topic": "Fiqh", "cards": [{"id": "s1", "title": "Five daily names", "teach": "The five daily prayers are Fajr, Ẓuhr, ʿAṣr, Maghrib, and ʿIshāʾ. Times depend on location; use a reliable timetable and local guidance.", "citation": {"type": "quran", "ref": "Qur’an 4:103", "text": "…indeed, prayer has been decreed upon the believers a decree of specified times.", "url": "https://quran.com/4/103"}, "q": "How many obligatory daily prayers are there in mainstream teaching?", "opts": ["Two", "Three", "Five", "Seven"], "a": 2}, {"id": "s2", "title": "Farḍ rakʿah map (literacy)", "teach": "A widely taught farḍ map: Fajr 2, Ẓuhr 4, ʿAṣr 4, Maghrib 3, ʿIshāʾ 4. Sunnah units vary by school — confirm with a teacher.", "citation": {"type": "note", "ref": "Common school teaching", "text": "Educational map — not a fatwa. Verify locally."}, "q": "How many farḍ rakʿahs are widely taught for Maghrib?", "opts": ["2", "3", "4", "8"], "a": 1}, {"id": "s3", "title": "Prayer is established, not abandoned", "teach": "The Qur’an commands establishing prayer. Consistency with calm wuḍūʾ and presence is the lifelong work — not a one-time quiz win.", "citation": {"type": "quran", "ref": "Qur’an 2:43", "text": "And establish prayer…", "url": "https://quran.com/2/43"}, "q": "Qur’an 2:43 commands believers to…", "opts": ["Abandon prayer when busy", "Establish prayer", "Replace prayer with debate", "Pray only once a year"], "a": 1}]}, "adab-speech": {"id": "adab-speech", "title": "Adab of speech", "topic": "Daily", "cards": [{"id": "a1", "title": "Speech is recorded", "teach": "A believer guards the tongue. Words can be charity or harm. Adab of speech begins with remembering that speech is accountable.", "citation": {"type": "quran", "ref": "Qur’an 50:18", "text": "Man does not utter any word except that with him is an observer prepared.", "url": "https://quran.com/50/18"}, "q": "Qur’an 50:18 reminds the believer that speech is…", "opts": ["Always private and unchecked", "Observed and accountable", "Only for politics", "Never important"], "a": 1}, {"id": "a2", "title": "Say that which is good", "teach": "Allāh commands speaking good words to people. Harshness without right, mockery, and false speech damage trust and hearts.", "citation": {"type": "quran", "ref": "Qur’an 2:83", "text": "…and speak to people good [words]…", "url": "https://quran.com/2/83"}, "q": "Qur’an 2:83 includes the command to…", "opts": ["Speak to people good words", "Always remain silent forever", "Insult opponents", "Ignore manners"], "a": 0}, {"id": "a3", "title": "Whoever believes — guard the tongue", "teach": "Faith is tied to safety of people from one’s tongue and hand. Adab is not optional decoration; it is part of living īmān.", "citation": {"type": "hadith", "collection": "Ṣaḥīḥ al-Bukhārī", "number": "10", "grade": "Ṣaḥīḥ", "url": "https://sunnah.com/bukhari:10"}, "q": "A sign of faith highlighted in a famous ḥadīth is that others are safe from one’s…", "opts": ["Wealth only", "Tongue and hand", "Sleep schedule", "Clothing brand"], "a": 1}]}};

  var state = {
    bankId: "taharah",
    cardIndex: 0,
    mode: "teach", /* teach | check | feedback */
    sessionAnswered: 0,
    topic: "all",
    level: "path"
  };

  function $(id) { return d.getElementById(id); }

  function loadJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || "null") || fallback; }
    catch (e) { return fallback; }
  }
  function saveJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  function stats() {
    return loadJSON(STAT_KEY, { streak: 0, today: 0, best: 0, total: 0, day: "", lastOk: false });
  }
  function pathState() {
    return loadJSON(PATH_KEY, { banks: {}, updated: 0 });
  }
  function journal() {
    return loadJSON(LOG_KEY, []);
  }

  function todayKey() {
    var n = new Date();
    return n.getFullYear() + "-" + (n.getMonth() + 1) + "-" + n.getDate();
  }

  function touchStats(correct) {
    var s = stats();
    var day = todayKey();
    if (s.day !== day) {
      s.today = 0;
      s.day = day;
      if (!s.lastOk) s.streak = 0;
    }
    s.total = (s.total || 0) + 1;
    if (correct) {
      s.today = (s.today || 0) + 1;
      s.best = Math.max(s.best || 0, s.today);
      s.streak = (s.streak || 0) + 1;
      s.lastOk = true;
    } else {
      s.streak = 0;
      s.lastOk = false;
    }
    saveJSON(STAT_KEY, s);
    paintStats();
  }

  function paintStats() {
    var s = stats();
    var el;
    if ((el = $("siq-streak"))) el.textContent = "🔥 Streak " + (s.streak || 0);
    if ((el = $("siq-today"))) el.textContent = "Today " + (s.today || 0) + "/" + SESSION_CAP;
    if ((el = $("siq-best"))) el.textContent = "Best " + (s.best || 0);
    if ((el = $("siq-total"))) el.textContent = "All-time " + (s.total || 0);
  }

  function bankProgress(bankId) {
    var p = pathState();
    var b = (p.banks || {})[bankId] || { done: 0, correct: 0 };
    var total = (BANKS[bankId] && BANKS[bankId].cards.length) || 1;
    return Math.min(100, Math.round(((b.correct || 0) / total) * 100));
  }

  function paintPath() {
    var host = $("siq-path-meters");
    if (!host) return;
    host.innerHTML = Object.keys(BANKS).map(function (id) {
      var sc = bankProgress(id);
      return (
        '<div class="siq-path-row"><span>' +
        BANKS[id].title +
        '</span><div class="siq-path-track"><i style="width:' +
        sc +
        '%"></i></div><span>' +
        sc +
        "%</span></div>"
      );
    }).join("");
  }

  function citeHTML(c) {
    if (!c) return "";
    if (c.type === "hadith") {
      return (
        '<div class="siq-cite"><strong>Source</strong> · ' +
        (c.collection || "") +
        " · " +
        (c.number || "") +
        ' · <span class="grade">' +
        (c.grade || "verify") +
        "</span>" +
        (c.url
          ? ' · <a href="' + c.url + '" target="_blank" rel="noopener">Open</a>'
          : "") +
        "</div>"
      );
    }
    if (c.type === "quran") {
      return (
        '<div class="siq-cite"><strong>Source</strong> · ' +
        (c.ref || "") +
        (c.url
          ? ' · <a href="' + c.url + '" target="_blank" rel="noopener">quran.com</a>'
          : "") +
        (c.text ? "<br/>" + c.text : "") +
        "</div>"
      );
    }
    return (
      '<div class="siq-cite"><strong>Note</strong> · ' +
      (c.ref || "") +
      (c.text ? " — " + c.text : "") +
      "</div>"
    );
  }

  function currentCards() {
    var bank = BANKS[state.bankId];
    return (bank && bank.cards) || [];
  }

  function render() {
    var stage = $("siq-stage");
    if (!stage) return;
    var cards = currentCards();
    if (!cards.length) {
      stage.innerHTML = "<p class='panel-note'>No cards in this bank yet.</p>";
      return;
    }
    if (state.cardIndex >= cards.length) state.cardIndex = 0;
    var card = cards[state.cardIndex];
    var n = state.cardIndex + 1;
    var html = "";

    if (state.mode === "teach" || state.mode === "check" || state.mode === "feedback") {
      html +=
        '<div class="siq-teach-card"><p class="panel-note">Card ' +
        n +
        " / " +
        cards.length +
        " · " +
        (BANKS[state.bankId].title || "") +
        "</p><h3>" +
        card.title +
        "</h3><p>" +
        card.teach +
        "</p>" +
        citeHTML(card.citation) +
        "</div>";
    }

    if (state.mode === "teach") {
      html +=
        '<button type="button" class="btn primary" id="siq-to-check">Check understanding →</button>';
    }

    if (state.mode === "check" || state.mode === "feedback") {
      html += '<div class="siq-check"><p><strong>' + card.q + "</strong></p><div class='siq-opts' id='siq-opts'>";
      (card.opts || []).forEach(function (opt, i) {
        html +=
          '<button type="button" class="siq-opt" data-i="' +
          i +
          '">' +
          opt +
          "</button>";
      });
      html += "</div></div>";
    }

    if (state.mode === "feedback") {
      html += '<div class="siq-feedback" id="siq-feedback-box"></div>';
      html +=
        '<button type="button" class="btn primary" id="siq-next-card">Next card →</button>';
    }

    stage.innerHTML = html;

    var toCheck = $("siq-to-check");
    if (toCheck) {
      toCheck.onclick = function () {
        state.mode = "check";
        render();
      };
    }

    var opts = $("siq-opts");
    if (opts && state.mode === "check") {
      opts.querySelectorAll(".siq-opt").forEach(function (btn) {
        btn.onclick = function () {
          if (state.sessionAnswered >= SESSION_CAP) {
            alert("Session soft cap (" + SESSION_CAP + "). Continue tomorrow or Reset today.");
            return;
          }
          var i = parseInt(btn.getAttribute("data-i"), 10);
          var ok = i === card.a;
          state.mode = "feedback";
          render();
          applyAnswer(card, i, ok);
        };
      });
    }

    var next = $("siq-next-card");
    if (next) {
      next.onclick = function () {
        state.cardIndex = (state.cardIndex + 1) % cards.length;
        state.mode = "teach";
        render();
      };
    }
  }

  function applyAnswer(card, choice, ok) {
    state.sessionAnswered += 1;
    touchStats(ok);

    var p = pathState();
    p.banks = p.banks || {};
    var b = p.banks[state.bankId] || { done: 0, correct: 0 };
    b.done = (b.done || 0) + 1;
    if (ok) b.correct = (b.correct || 0) + 1;
    p.banks[state.bankId] = b;
    p.updated = Date.now();
    saveJSON(PATH_KEY, p);
    paintPath();

    var rows = journal();
    rows.unshift({
      t: Date.now(),
      bank: state.bankId,
      card: card.id,
      ok: ok,
      choice: choice
    });
    saveJSON(LOG_KEY, rows.slice(0, 200));
    paintJournal();

    var box = $("siq-feedback-box");
    if (box) {
      var c = card.citation || {};
      var citeLine = "";
      if (c.type === "hadith") {
        citeLine =
          (c.collection || "") +
          " · " +
          (c.number || "") +
          " · " +
          (c.grade || "verify");
      } else if (c.type === "quran") {
        citeLine = c.ref || "Qur’an";
      } else {
        citeLine = c.ref || "Educational note";
      }
      box.innerHTML =
        (ok
          ? "<strong>Correct</strong> — good literacy check."
          : "<strong>Not this option</strong> — review the teach card.") +
        "<br/><span class='grade'>Source feedback · " +
        citeLine +
        "</span>" +
        (c.url
          ? ' · <a href="' + c.url + '" target="_blank" rel="noopener">Open source</a>'
          : "") +
        "<br/><span class='panel-note'>Educational only — not a fatwa · not a grade of īmān</span>";
    }

    var stage = $("siq-stage");
    if (stage) {
      stage.querySelectorAll(".siq-opt").forEach(function (btn) {
        var i = parseInt(btn.getAttribute("data-i"), 10);
        btn.disabled = true;
        if (i === card.a) btn.classList.add("correct");
        if (i === choice && !ok) btn.classList.add("wrong");
      });
    }
  }

  function paintJournal() {
    var host = $("siq-journal-list");
    if (!host) return;
    var rows = journal();
    var expanded = host.getAttribute("data-expanded") === "1";
    var list = expanded ? rows.slice(0, 40) : rows.slice(0, MAX_SHOW);
    if (!rows.length) {
      host.innerHTML = "<p class='panel-note'>No checks yet.</p>";
      return;
    }
    host.innerHTML =
      "<ul>" +
      list
        .map(function (r) {
          return (
            "<li><span>" +
            (r.ok ? "✓" : "·") +
            "</span><span>" +
            (r.bank || "") +
            "/" +
            (r.card || "") +
            "</span><span>" +
            new Date(r.t).toLocaleString() +
            "</span></li>"
          );
        })
        .join("") +
      "</ul>";
    if (rows.length > MAX_SHOW) {
      var b = d.createElement("button");
      b.type = "button";
      b.className = "btn";
      b.textContent = expanded ? "Show only 5 recent" : "Show more";
      b.onclick = function () {
        host.setAttribute("data-expanded", expanded ? "0" : "1");
        paintJournal();
      };
      host.appendChild(b);
    }
  }

  function setBank(id) {
    if (!BANKS[id]) return;
    state.bankId = id;
    state.cardIndex = 0;
    state.mode = "teach";
    d.querySelectorAll(".siq-bank").forEach(function (btn) {
      btn.classList.toggle("on", btn.getAttribute("data-bank") === id);
    });
    render();
  }

  function setTopic(topic) {
    state.topic = topic;
    d.querySelectorAll(".siq-topic").forEach(function (btn) {
      btn.classList.toggle("on", btn.getAttribute("data-topic") === topic);
    });
    /* pick first bank matching topic, or all keeps current */
    if (topic !== "all") {
      var found = Object.keys(BANKS).filter(function (id) {
        return BANKS[id].topic === topic;
      })[0];
      if (found) setBank(found);
    }
  }

  function resetToday() {
    var s = stats();
    s.today = 0;
    s.day = todayKey();
    saveJSON(STAT_KEY, s);
    state.sessionAnswered = 0;
    paintStats();
  }

  function wire() {
    d.querySelectorAll(".siq-bank").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setBank(btn.getAttribute("data-bank"));
      });
    });
    d.querySelectorAll(".siq-topic").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setTopic(btn.getAttribute("data-topic"));
      });
    });
    var rt = $("siq-reset-today");
    if (rt) rt.onclick = resetToday;
  }

  function boot() {
    paintStats();
    paintPath();
    paintJournal();
    wire();
    setBank(state.bankId);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.ClarityShariaIQ = { setBank: setBank, stats: stats, BANKS: BANKS };
})(window, document);
