/*! companion-siq-quest-plus-v1 · timed focus · local badges · combo
 * Inspired by engagement patterns (timer, badges) — NOT a clone of any closed app.
 * Educational only — not a fatwa · not a certificate · local device only.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_SIQ_QUEST_PLUS_V1__) return;
  w.__CLARITY_SIQ_QUEST_PLUS_V1__ = true;

  var LS = "clarity_siq_plus_v1";
  var TIMER_SEC = 20;
  var timerId = null;
  var timerLeft = 0;
  var timerArmed = false;
  var combo = 0;
  var sessionCorrect = 0;
  var sessionTotal = 0;

  var BADGE_DEFS = [
    { id: "first_light", title: "First Light", need: "correct_total>=1", blurb: "First correct mark on this device" },
    { id: "ten_steady", title: "Ten Steady", need: "correct_total>=10", blurb: "Ten correct answers accumulated" },
    { id: "streak_3", title: "Three-Day Ember", need: "streak_days>=3", blurb: "Practice on 3 different local days" },
    { id: "swift_pen", title: "Swift Pen", need: "swift>=5", blurb: "Five answers within the focus window" },
    { id: "combo_5", title: "Chain of Five", need: "best_combo>=5", blurb: "Five correct in a row this session" },
    { id: "explorer", title: "Topic Explorer", need: "topics>=3", blurb: "Touched 3 topic filters" },
    { id: "humble_hint", title: "Humble Hint", need: "hints_used>=1", blurb: "Used a soft hint once" },
    { id: "night_guard", title: "Night Guard", need: "sessions>=5", blurb: "Five practice sessions stored" }
  ];

  function load() {
    try {
      var o = JSON.parse(w.localStorage.getItem(LS) || "{}") || {};
      o.correct_total = o.correct_total || 0;
      o.swift = o.swift || 0;
      o.best_combo = o.best_combo || 0;
      o.hints_used = o.hints_used || 0;
      o.sessions = o.sessions || 0;
      o.days = o.days || {};
      o.topics = o.topics || {};
      o.badges = o.badges || {};
      o.timer_on = o.timer_on !== false; /* default on */
      return o;
    } catch (e) {
      return { correct_total: 0, swift: 0, best_combo: 0, hints_used: 0, sessions: 0, days: {}, topics: {}, badges: {}, timer_on: true };
    }
  }
  function save(o) {
    try {
      w.localStorage.setItem(LS, JSON.stringify(o));
    } catch (e) {}
  }
  function today() {
    var t = new Date();
    return t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate();
  }

  function ensureChrome() {
    var host = d.querySelector("#fq-stats") || d.querySelector(".siq-hero-text");
    if (!host) return;
    if (!d.getElementById("siq-plus-bar")) {
      var bar = d.createElement("div");
      bar.id = "siq-plus-bar";
      bar.className = "siq-plus-bar";
      bar.innerHTML =
        '<button type="button" class="btn-soft siq-plus-timer-toggle" id="siq-plus-timer-btn">⏱ Focus 20s: ON</button>' +
        '<span class="siq-plus-combo" id="siq-plus-combo">Combo ×0</span>' +
        '<span class="siq-plus-timer" id="siq-plus-timer" hidden>20</span>' +
        '<span class="siq-plus-note edu">Focus timer optional · badges local · educational — not a fatwa</span>';
      host.appendChild(bar);
      d.getElementById("siq-plus-timer-btn").addEventListener("click", function () {
        var o = load();
        o.timer_on = !o.timer_on;
        save(o);
        this.textContent = "⏱ Focus 20s: " + (o.timer_on ? "ON" : "OFF");
        if (!o.timer_on) stopTimer(true);
      });
      var o = load();
      d.getElementById("siq-plus-timer-btn").textContent = "⏱ Focus 20s: " + (o.timer_on ? "ON" : "OFF");
    }
    if (!d.getElementById("siq-plus-badges")) {
      var tray = d.createElement("div");
      tray.id = "siq-plus-badges";
      tray.className = "siq-plus-badges";
      tray.setAttribute("aria-label", "Local practice badges");
      host.appendChild(tray);
    }
    paintBadges();
  }

  function paintBadges() {
    var tray = d.getElementById("siq-plus-badges");
    if (!tray) return;
    var o = load();
    var html = '<div class="siq-plus-badges-title">Local badges</div><div class="siq-plus-badges-row">';
    BADGE_DEFS.forEach(function (b) {
      var on = !!o.badges[b.id];
      html +=
        '<span class="siq-plus-badge' +
        (on ? " on" : "") +
        '" title="' +
        b.blurb +
        '">' +
        (on ? "✦ " : "· ") +
        b.title +
        "</span>";
    });
    html += "</div>";
    tray.innerHTML = html;
  }

  function evalBadges(o) {
    var streak_days = Object.keys(o.days || {}).length;
    var topics = Object.keys(o.topics || {}).length;
    var ctx = {
      correct_total: o.correct_total,
      streak_days: streak_days,
      swift: o.swift,
      best_combo: o.best_combo,
      hints_used: o.hints_used,
      sessions: o.sessions,
      topics: topics
    };
    var unlocked = [];
    BADGE_DEFS.forEach(function (b) {
      if (o.badges[b.id]) return;
      var ok = false;
      if (b.need === "correct_total>=1") ok = ctx.correct_total >= 1;
      if (b.need === "correct_total>=10") ok = ctx.correct_total >= 10;
      if (b.need === "streak_days>=3") ok = ctx.streak_days >= 3;
      if (b.need === "swift>=5") ok = ctx.swift >= 5;
      if (b.need === "best_combo>=5") ok = ctx.best_combo >= 5;
      if (b.need === "topics>=3") ok = ctx.topics >= 3;
      if (b.need === "hints_used>=1") ok = ctx.hints_used >= 1;
      if (b.need === "sessions>=5") ok = ctx.sessions >= 5;
      if (ok) {
        o.badges[b.id] = { t: Date.now(), title: b.title };
        unlocked.push(b.title);
      }
    });
    return unlocked;
  }

  function toast(msg) {
    var el = d.getElementById("siq-plus-toast");
    if (!el) {
      el = d.createElement("div");
      el.id = "siq-plus-toast";
      el.className = "siq-plus-toast";
      d.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    setTimeout(function () {
      el.classList.remove("show");
    }, 2800);
  }

  function stopTimer(hide) {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    timerArmed = false;
    var el = d.getElementById("siq-plus-timer");
    if (el) {
      if (hide) el.hidden = true;
      el.classList.remove("urgent");
    }
  }

  function startTimer() {
    stopTimer(false);
    var o = load();
    if (!o.timer_on) return;
    var el = d.getElementById("siq-plus-timer");
    if (!el) return;
    timerLeft = TIMER_SEC;
    timerArmed = true;
    el.hidden = false;
    el.textContent = String(timerLeft);
    el.classList.remove("urgent");
    timerId = setInterval(function () {
      timerLeft -= 1;
      if (timerLeft <= 5) el.classList.add("urgent");
      el.textContent = String(Math.max(0, timerLeft));
      if (timerLeft <= 0) {
        stopTimer(false);
        el.textContent = "0";
        /* soft expire — no auto-wrong; gentle nudge only */
        toast("Focus window ended — answer when ready. Educational only.");
      }
    }, 1000);
  }

  function onAnswer(correct, usedSwift) {
    var o = load();
    o.days[today()] = true;
    sessionTotal += 1;
    if (correct) {
      sessionCorrect += 1;
      o.correct_total += 1;
      combo += 1;
      if (combo > o.best_combo) o.best_combo = combo;
      if (usedSwift) o.swift += 1;
      /* soft rank bonus bridge */
      try {
        var r = JSON.parse(w.localStorage.getItem("clarity_siq_rank_v1") || "{}") || {};
        r.bonus = (r.bonus || 0) + 1 + Math.min(3, Math.floor(combo / 3));
        w.localStorage.setItem("clarity_siq_rank_v1", JSON.stringify(r));
      } catch (e) {}
    } else {
      combo = 0;
    }
    var unlocked = evalBadges(o);
    save(o);
    var comboEl = d.getElementById("siq-plus-combo");
    if (comboEl) comboEl.textContent = "Combo ×" + combo;
    paintBadges();
    if (unlocked.length) toast("Badge: " + unlocked.join(", ") + " · local only — not a certificate");
    stopTimer(false);
  }

  function trackTopic() {
    try {
      var active = d.querySelector(".fq-topic.active, .fq-topic[aria-pressed='true']");
      var t = active ? active.getAttribute("data-topic") || active.textContent : null;
      if (!t) {
        var st = w.__CLARITY_FQ_STATE__;
        if (st && st.topic) t = st.topic;
      }
      if (t) {
        var o = load();
        o.topics[String(t).slice(0, 40)] = true;
        save(o);
        paintBadges();
      }
    } catch (e) {}
  }

  function bind() {
    d.addEventListener(
      "click",
      function (ev) {
        var t = ev.target;
        if (!t || !t.closest) return;
        if (t.closest("[data-quest-act='hint']")) {
          var o = load();
          o.hints_used = (o.hints_used || 0) + 1;
          var unlocked = evalBadges(o);
          save(o);
          paintBadges();
          if (unlocked.length) toast("Badge: " + unlocked.join(", "));
        }
        if (t.closest(".fq-topic") || t.closest("[data-topic]") || t.closest(".fq-lvl")) {
          setTimeout(trackTopic, 30);
        }
        if (t.closest(".fq-choice") || t.closest(".siq-iq-ch")) {
          var swift = timerArmed && timerLeft > 0;
          var btn = t.closest(".fq-choice, .siq-iq-ch");
          setTimeout(function () {
            var correct = false;
            try {
              if (btn && (btn.style.borderColor.indexOf("61") >= 0 || btn.style.borderColor.indexOf("3d9") >= 0 || btn.classList.contains("correct")))
                correct = true;
              /* also green-ish */
              var bc = (btn.style.borderColor || "").toLowerCase();
              if (bc.indexOf("rgb(61") >= 0 || bc.indexOf("#3d9") >= 0 || bc.indexOf("green") >= 0) correct = true;
            } catch (e) {}
            /* fallback: if fq state answered last as correct count */
            try {
              var st = w.__CLARITY_FQ_STATE__;
              /* cannot know easily — use border heuristic + teach-back text */
              var stage = d.getElementById("fq-stage") || d.getElementById("siq-iq-stage");
              var why = stage && stage.querySelector(".fq-why, .siq-iq-why");
              if (why && why.textContent && /^Correct/i.test(why.textContent.trim())) correct = true;
              if (why && why.textContent && /Not quite/i.test(why.textContent)) correct = false;
            } catch (e2) {}
            onAnswer(correct, swift);
          }, 40);
        }
      },
      true
    );
  }

  function watchNewCard() {
    var stage = d.getElementById("fq-stage") || d.getElementById("siq-iq-stage");
    if (!stage) return;
    var sig = stage.innerHTML.length + ":" + (stage.querySelector(".fq-q, .siq-iq-card") || {}).textContent;
    if (watchNewCard._sig !== sig) {
      watchNewCard._sig = sig;
      if (stage.querySelector(".fq-choice, .siq-iq-ch")) startTimer();
    }
  }

  function boot() {
    ensureChrome();
    bind();
    var o = load();
    o.sessions = (o.sessions || 0) + 1;
    save(o);
    paintBadges();
    setInterval(watchNewCard, 800);
    setTimeout(ensureChrome, 600);
    setTimeout(ensureChrome, 2000);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
