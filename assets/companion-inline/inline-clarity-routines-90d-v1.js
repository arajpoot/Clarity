/**
 * Clarity Daily Routines · Phase 0–9
 * Landing-shell cards. Educational — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_ROUTINES_90D_V1__) return;
  w.__CLARITY_ROUTINES_90D_V1__ = true;

  var KEY_STREAK = "clarity_soft_streak_v1";
  var KEY_DONE = "clarity_routine_done_v1";

  function todayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function readJSON(k) {
    try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; }
  }
  function writeJSON(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }
  function softStreak() {
    var s = readJSON(KEY_STREAK) || { days: 0, last: null };
    var t = todayKey();
    if (s.last === t) return s.days || 1;
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var yk = yesterday.getFullYear() + "-" + (yesterday.getMonth() + 1) + "-" + yesterday.getDate();
    if (s.last === yk) s.days = (s.days || 0) + 1;
    else s.days = 1;
    s.last = t;
    writeJSON(KEY_STREAK, s);
    return s.days;
  }
  function markDone(id) {
    var m = readJSON(KEY_DONE) || {};
    var t = todayKey();
    if (!m[t]) m[t] = {};
    m[t][id] = true;
    writeJSON(KEY_DONE, m);
    softStreak();
  }
  function isDone(id) {
    var m = readJSON(KEY_DONE) || {};
    var t = todayKey();
    return !!(m[t] && m[t][id]);
  }

  var PHASES = [
    { phase: 0, title: "Phase 0 · Foundation", weeks: "Weeks 1–2", goal: "Return without friction.",
      cards: [
        { id: "p0-open", title: "Open & orient", body: "Banner · LAST · dual paths · Do this today.", cta: "Stay on landing", tab: null, ref: "On-device shell" },
        { id: "p0-deed", title: "Complete one deed", body: "Mark Do this today or count Adhkār once.", cta: "Mark done", tab: null, ref: "Consistency" },
        { id: "p0-resume", title: "Resume card", body: "LAST bar stores last section on this device.", cta: "Use LAST bar", tab: null, ref: "localStorage" },
        { id: "p0-source", title: "See the source", body: "Every provision shows a reference.", cta: "Check Adhkār ref", tab: null, ref: "Educational only" }
      ]},
    { phase: 1, title: "Phase 1 · Path daily loops", weeks: "Weeks 3–6", goal: "3–5 minute path-aware loops.",
      cards: [
        { id: "p1-seeker", title: "Seeker · today", body: "1 belief spark · 1 short āyah · 1 character deed.", cta: "Open Reminder", tab: "reminder", ref: "Wake the heart" },
        { id: "p1-new", title: "New Muslim · today", body: "1 purity/prayer step · 1 dhikr · 1 right.", cta: "Open Reality", tab: "reality", ref: "Establish pillars" },
        { id: "p1-daily", title: "Daily consistency", body: "Next ṣalāh presence · 1 āyah · adhkār.", cta: "Open Action", tab: "action", ref: "Craft" },
        { id: "p1-dai", title: "Daʿī · careful transmit", body: "1 source-check · 1 adab note · share carefully.", cta: "Open Reflection", tab: "reflection", ref: "Transmit light" }
      ]},
    { phase: 2, title: "Phase 2 · Spaced review", weeks: "Weeks 7–10", goal: "Memory with mercy.",
      cards: [
        { id: "p2-review", title: "One due item", body: "Revisit one command or āyah from this week.", cta: "Open Reminder", tab: "reminder", ref: "Spaced review" },
        { id: "p2-dhikr", title: "Dhikr rail log", body: "Optional +1 remembrance when switching tabs.", cta: "Tap a bottom pill", tab: null, ref: "Dhikr" },
        { id: "p2-letter", title: "One letter / one line", body: "Tajweed or calligraphy: one small unit.", cta: "Open Action", tab: "action", ref: "Labs" },
        { id: "p2-meme", title: "Authentic short text", body: "Meme studio only with authentic texts.", cta: "Open Reminder", tab: "reminder", ref: "No fabrication" }
      ]},
    { phase: 3, title: "Phase 3 · Depth without overwhelm", weeks: "Weeks 11–13", goal: "Clear path progress.",
      cards: [
        { id: "p3-doors", title: "Four doors progress", body: "Seeker → New Muslim → Daily → Daʿī.", cta: "Enter Companion", tab: "companion", ref: "Path board" },
        { id: "p3-module", title: "7-day micro module", body: "Mark one step complete on companion.", cta: "Enter Companion", tab: "companion", ref: "Micro then deep" },
        { id: "p3-campus", title: "Study with structure", body: "University path opens Campus for long courses.", cta: "University tile", tab: "university", ref: "campus/" },
        { id: "p3-teacher", title: "Ask a teacher", body: "Clarity does not issue fatwa.", cta: "Stay educational", tab: null, ref: "Local scholar" }
      ]},
    { phase: 4, title: "Phase 4 · Family & legacy", weeks: "Ongoing", goal: "Light for the grave.",
      cards: [
        { id: "p4-parents", title: "Duʿāʾ for parents", body: "One private duʿāʾ for parents.", cta: "Open Vault", tab: "notes", ref: "Ongoing good" },
        { id: "p4-right", title: "One right", body: "Settle or note one right you still owe.", cta: "Do this today", tab: null, ref: "Rights first" },
        { id: "p4-vault", title: "Vault note", body: "Optional encrypted note on this device.", cta: "Open Vault", tab: "notes", ref: "On-device only" },
        { id: "p4-legacy", title: "Send light ahead", body: "Istighfār · ṣalawāt · small intention.", cta: "Mark done", tab: null, ref: "Furnish the grave" }
      ]},
    { phase: 5, title: "Phase 5 · Qur’an companionship", weeks: "Weeks 14–18", goal: "Small daily relationship with the Book.",
      cards: [
        { id: "p5-ayah", title: "One āyah today", body: "Read or listen to one āyah with meaning.", cta: "Open Reminder", tab: "reminder", ref: "Presence over volume" },
        { id: "p5-listen", title: "Listen with the banner", body: "Banner recitation once with intention.", cta: "Stay on banner", tab: null, ref: "On-device audio" },
        { id: "p5-reflect", title: "One reflection line", body: "Private line: what this āyah asks of you.", cta: "Open Reflection", tab: "reflection", ref: "Not a tafsīr claim" },
        { id: "p5-share", title: "Share carefully", body: "Share āyah text accurately only.", cta: "Open Action", tab: "action", ref: "Adab" }
      ]},
    { phase: 6, title: "Phase 6 · Ṣalāh presence", weeks: "Weeks 19–23", goal: "Protect the next prayer.",
      cards: [
        { id: "p6-next", title: "Next ṣalāh on time", body: "Aim for the next prayer with presence.", cta: "See banner times", tab: null, ref: "Local times vary" },
        { id: "p6-wudu", title: "Wuḍūʾ awareness", body: "One careful wuḍūʾ with basmalah.", cta: "Open Reality", tab: "reality", ref: "Purity" },
        { id: "p6-sunnah", title: "Two rakʿahs extra", body: "Optional sunnah — no guilt.", cta: "Mark done", tab: null, ref: "Voluntary" },
        { id: "p6-after", title: "After-ṣalāh adhkār", body: "Count the adhkār card once after a prayer.", cta: "Use Adhkār card", tab: null, ref: "Landing adhkār" }
      ]},
    { phase: 7, title: "Phase 7 · Character & rights", weeks: "Weeks 24–30", goal: "Knowledge that reaches the limbs.",
      cards: [
        { id: "p7-tongue", title: "Guard the tongue", body: "One hour without mockery; replace with istighfār.", cta: "Mark done", tab: null, ref: "Character" },
        { id: "p7-right", title: "Settle one right", body: "Debt, trust, or apology.", cta: "Do this today", tab: null, ref: "Rights first" },
        { id: "p7-family", title: "Mercy at home", body: "One gentle word or act for family.", cta: "Open Vault", tab: "notes", ref: "Private" },
        { id: "p7-sadaqah", title: "Quiet ṣadaqah", body: "Small ongoing good.", cta: "Mark done", tab: null, ref: "Jāriyah" }
      ]},
    { phase: 8, title: "Phase 8 · Craft & skill", weeks: "Weeks 31–40", goal: "Tiny daily craft units.",
      cards: [
        { id: "p8-tajweed", title: "One tajweed unit", body: "One letter or rule — not a full session.", cta: "Open Action", tab: "action", ref: "Tajweed lab" },
        { id: "p8-letter", title: "One Arabic letter", body: "Form or recognize one letter with care.", cta: "Open Action", tab: "action", ref: "Arabic craft" },
        { id: "p8-callig", title: "One calligraphy stroke", body: "One calm line in the lab.", cta: "Open Action", tab: "action", ref: "Calligraphy" },
        { id: "p8-review", title: "Review last unit", body: "Repeat yesterday’s unit before adding new.", cta: "Open Reminder", tab: "reminder", ref: "Spaced craft" }
      ]},
    { phase: 9, title: "Phase 9 · Transmission & trust", weeks: "Weeks 41–52+", goal: "Carry light carefully.",
      cards: [
        { id: "p9-source", title: "Source before speech", body: "Note the source or stay silent.", cta: "Open Reflection", tab: "reflection", ref: "Daʿī adab" },
        { id: "p9-adab", title: "Adab of daʿwah", body: "Wisdom, patience, no compulsion.", cta: "Open Reflection", tab: "reflection", ref: "Educational" },
        { id: "p9-campus", title: "Structured study", body: "Campus for long courses; companion for daily return.", cta: "University tile", tab: "university", ref: "campus/" },
        { id: "p9-legacy", title: "Annual light check", body: "Istighfār · ṣalawāt · parents · one right.", cta: "Open Vault", tab: "notes", ref: "Furnish the grave" }
      ]}
  ];

  function go(tab) {
    if (tab === "university") {
      try { w.open("https://clarity-dawah.fyi/campus/", "_blank", "noopener"); } catch (e) {}
      return;
    }
    if (tab === "companion") {
      if (w.ClarityShell) w.ClarityShell.setMode("companion");
      return;
    }
    if (!tab) return;
    if (w.ClarityShell) w.ClarityShell.setMode("companion");
    try {
      if (typeof w.switchTab === "function") w.switchTab(tab);
      else if (typeof w.clarityOpenSectionDoor === "function") w.clarityOpenSectionDoor(tab);
    } catch (e) {}
  }

  function render() {
    var host = document.getElementById("clarity-daily-routines");
    if (!host) {
      host = document.createElement("section");
      host.id = "clarity-daily-routines";
      host.setAttribute("aria-label", "90-day daily return routines");
      var land = document.getElementById("clarity-day-landing");
      if (land && land.parentNode) {
        if (land.nextSibling) land.parentNode.insertBefore(host, land.nextSibling);
        else land.parentNode.appendChild(host);
      } else {
        var bar = document.getElementById("clarity-reopen-bar");
        if (bar && bar.parentNode) {
          if (bar.nextSibling) bar.parentNode.insertBefore(host, bar.nextSibling);
          else bar.parentNode.appendChild(host);
        } else document.body.appendChild(host);
      }
    }
    var streak = softStreak();
    var html = '<div class="cdr-head"><h2>Daily return · 90-day path</h2>';
    html += '<p class="cdr-sub">Phase 0–9 on this landing page. Soft streak: <strong>' + streak + '</strong> day(s). Educational only — not a fatwa.</p></div>';
    PHASES.forEach(function (ph) {
      html += '<div class="cdr-phase" data-phase="' + ph.phase + '">';
      html += '<div class="cdr-phase-head"><span class="cdr-phase-num">P' + ph.phase + '</span>';
      html += '<div><strong>' + ph.title + '</strong>';
      html += '<div class="cdr-phase-meta">' + ph.weeks + ' · ' + ph.goal + '</div></div></div>';
      html += '<div class="cdr-grid">';
      ph.cards.forEach(function (c) {
        var done = isDone(c.id) ? " is-done" : "";
        html += '<article class="cdr-card' + done + '" data-routine="' + c.id + '">';
        html += '<h3>' + c.title + '</h3><p>' + c.body + '</p>';
        html += '<div class="cdr-foot"><span class="cdr-ref">' + c.ref + '</span>';
        html += '<button type="button" class="cdr-cta" data-routine-id="' + c.id + '" data-tab="' + (c.tab || "") + '">' + c.cta + '</button>';
        html += '</div></article>';
      });
      html += '</div></div>';
    });
    host.innerHTML = html;
    host.onclick = function (ev) {
      var btn = ev.target && ev.target.closest && ev.target.closest(".cdr-cta");
      if (!btn) return;
      var id = btn.getAttribute("data-routine-id");
      var tab = btn.getAttribute("data-tab") || "";
      markDone(id);
      var card = btn.closest(".cdr-card");
      if (card) card.classList.add("is-done");
      if (tab) go(tab);
      var sub = host.querySelector(".cdr-sub strong");
      if (sub) sub.textContent = String(softStreak());
    };
  }

  function boot() {
    render();
    try {
      var obs = new MutationObserver(function () {
        if (document.documentElement.getAttribute("data-shell-mode") === "landing") render();
      });
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-shell-mode"] });
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", function () { setTimeout(render, 400); });

  w.ClarityRoutines90 = { render: render, phases: PHASES, version: "20261024P90" };
})(typeof window !== "undefined" ? window : this);
