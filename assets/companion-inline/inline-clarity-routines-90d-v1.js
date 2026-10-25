/**
 * Clarity Daily Routines · Phase 0–4 (90-day sequence)
 * Landing-shell cards only. Educational — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_ROUTINES_90D_V1__) return;
  w.__CLARITY_ROUTINES_90D_V1__ = true;

  var KEY_STREAK = "clarity_soft_streak_v1";
  var KEY_DONE = "clarity_routine_done_v1";
  var KEY_RESUME = "clarity_resume_v1";

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
    if (s.last === t) return s.days;
    // repair: if yesterday-ish miss, keep count (gentle)
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var yk = yesterday.getFullYear() + "-" + (yesterday.getMonth() + 1) + "-" + yesterday.getDate();
    if (s.last === yk) s.days = (s.days || 0) + 1;
    else if (s.last !== t) s.days = 1;
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
    writeJSON(KEY_RESUME, { id: id, at: Date.now(), day: t });
  }

  function isDone(id) {
    var m = readJSON(KEY_DONE) || {};
    var t = todayKey();
    return !!(m[t] && m[t][id]);
  }

  var PHASES = [
    {
      phase: 0,
      title: "Phase 0 · Foundation",
      weeks: "Weeks 1–2",
      goal: "Return without friction. One clear next step in under 10 seconds.",
      cards: [
        { id: "p0-open", title: "Open & orient", body: "Banner · LAST · dual paths · Do this today. Primary action is already on this page.", cta: "Stay on landing", tab: null, ref: "On-device shell" },
        { id: "p0-deed", title: "Complete one deed", body: "Mark Do this today or count Adhkār once. Soft streak counts a return + one deed.", cta: "Mark done", tab: null, ref: "Consistency > intensity" },
        { id: "p0-resume", title: "Resume card", body: "LAST bar stores last section per tab on this device. Scroll a section to pin it.", cta: "Use LAST bar", tab: null, ref: "localStorage" },
        { id: "p0-source", title: "See the source", body: "Every provision and adhkār shows a reference. Prefer Qur’an and authentic reports.", cta: "Check Adhkār ref", tab: null, ref: "Educational only" }
      ]
    },
    {
      phase: 1,
      title: "Phase 1 · Path daily loops",
      weeks: "Weeks 3–6",
      goal: "3–5 minute path-aware loops. Same shell, different today.",
      cards: [
        { id: "p1-seeker", title: "Seeker · today", body: "1 belief spark · 1 short āyah with meaning · 1 character deed.", cta: "Open Reminder", tab: "reminder", ref: "Wake the heart" },
        { id: "p1-new", title: "New Muslim · today", body: "1 purity/prayer micro-step · 1 dhikr · 1 right (parent or neighbour).", cta: "Open Reality", tab: "reality", ref: "Establish pillars" },
        { id: "p1-daily", title: "Daily consistency", body: "Next ṣalāh with presence · 1 āyah · adhkār count · one right.", cta: "Open Action", tab: "action", ref: "Craft & consistency" },
        { id: "p1-dai", title: "Daʿī · careful transmit", body: "1 source-check habit · 1 adab reminder · share carefully — no public post required.", cta: "Open Reflection", tab: "reflection", ref: "Transmit light" }
      ]
    },
    {
      phase: 2,
      title: "Phase 2 · Spaced review",
      weeks: "Weeks 7–10",
      goal: "Memory with mercy. Review what you already opened.",
      cards: [
        { id: "p2-review", title: "One due item", body: "Revisit one command or āyah from this week via LAST or Reminder.", cta: "Open Reminder", tab: "reminder", ref: "Spaced repetition light" },
        { id: "p2-dhikr", title: "Dhikr rail log", body: "Bottom pills show a dhikr chip. Optional +1 remembrance when you switch tabs.", cta: "Tap a bottom pill", tab: null, ref: "Dhikr · remember" },
        { id: "p2-letter", title: "One letter / one line", body: "Tajweed or calligraphy: one small unit today — not a full lesson.", cta: "Open Action tools", tab: "action", ref: "Labs on device" },
        { id: "p2-meme", title: "Authentic short text", body: "Meme studio only with authentic short texts. Prefer Qur’an wording.", cta: "Open Reminder tools", tab: "reminder", ref: "No fabrication" }
      ]
    },
    {
      phase: 3,
      title: "Phase 3 · Depth without overwhelm",
      weeks: "Weeks 11–13",
      goal: "Clear path progress. Long form lives on Campus.",
      cards: [
        { id: "p3-doors", title: "Four doors progress", body: "Seeker → New Muslim → Daily → Daʿī. Short quiz unlocks; earlier doors stay with you.", cta: "Enter Companion", tab: "companion", ref: "Path board" },
        { id: "p3-module", title: "7-day micro module", body: "Ilm pathway / short modules on companion. Mark one step complete.", cta: "Enter Companion", tab: "companion", ref: "Micro then deep" },
        { id: "p3-campus", title: "Study with structure", body: "University path opens Campus for long courses. Companion stays the daily home.", cta: "University tile", tab: "university", ref: "clarity-dawah.fyi/campus/" },
        { id: "p3-teacher", title: "Ask a teacher", body: "Link out for scholarly guidance. Clarity does not issue fatwa.", cta: "Stay educational", tab: null, ref: "Local scholar preferred" }
      ]
    },
    {
      phase: 4,
      title: "Phase 4 · Family & legacy",
      weeks: "Ongoing",
      goal: "Light for the grave. Private on this device.",
      cards: [
        { id: "p4-parents", title: "Duʿāʾ for parents", body: "One duʿāʾ for parents or a deceased relative. Keep it private and sincere.", cta: "Open Vault", tab: "notes", ref: "Ongoing good" },
        { id: "p4-right", title: "One right", body: "Settle or note one right: debt, trust, or apology you still owe.", cta: "Do this today", tab: null, ref: "Rights first" },
        { id: "p4-vault", title: "Vault note", body: "Optional encrypted note with timestamp in Amanah Vault. Print pack when ready.", cta: "Open Vault", tab: "notes", ref: "On-device only" },
        { id: "p4-legacy", title: "Send light ahead", body: "Istighfār · ṣalawāt · small ṣadaqah intention. Consistency over intensity.", cta: "Mark done", tab: null, ref: "Furnish the grave" }
      ]
    }
  ];

  function go(tab) {
    if (tab === "university") {
      try { w.open("https://clarity-dawah.fyi/campus/", "_blank", "noopener"); } catch (e) {}
      return;
    }
    if (tab === "companion") {
      if (w.ClarityShell && typeof w.ClarityShell.setMode === "function") w.ClarityShell.setMode("companion");
      return;
    }
    if (!tab) return;
    if (w.ClarityShell && typeof w.ClarityShell.setMode === "function") w.ClarityShell.setMode("companion");
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
      } else document.body.appendChild(host);
    }

    var streak = softStreak();
    var html = "";
    html += '<div class="cdr-head">';
    html += "<h2>Daily return · 90-day path</h2>";
    html += '<p class="cdr-sub">Phase 0–4 on this landing page. Soft streak: <strong>' + streak + "</strong> day(s). Educational only — not a fatwa.</p>";
    html += "</div>";

    PHASES.forEach(function (ph) {
      html += '<div class="cdr-phase" data-phase="' + ph.phase + '">';
      html += '<div class="cdr-phase-head"><span class="cdr-phase-num">P' + ph.phase + "</span>";
      html += "<div><strong>" + ph.title + "</strong>";
      html += '<div class="cdr-phase-meta">' + ph.weeks + " · " + ph.goal + "</div></div></div>";
      html += '<div class="cdr-grid">';
      ph.cards.forEach(function (c) {
        var done = isDone(c.id) ? " is-done" : "";
        html += '<article class="cdr-card' + done + '" data-routine="' + c.id + '">';
        html += "<h3>" + c.title + "</h3>";
        html += "<p>" + c.body + "</p>";
        html += '<div class="cdr-foot"><span class="cdr-ref">' + c.ref + "</span>";
        html += '<button type="button" class="cdr-cta" data-routine-id="' + c.id + '" data-tab="' + (c.tab || "") + '">' + c.cta + "</button>";
        html += "</div></article>";
      });
      html += "</div></div>";
    });

    host.innerHTML = html;
    host.onclick = function (ev) {
      var btn = ev.target && ev.target.closest && ev.target.closest(".cdr-cta");
      if (!btn) return;
      var id = btn.getAttribute("data-routine-id");
      var tab = btn.getAttribute("data-tab") || "";
      markDone(id);
      btn.closest(".cdr-card") && btn.closest(".cdr-card").classList.add("is-done");
      if (tab) go(tab);
      // refresh streak label
      var sub = host.querySelector(".cdr-sub strong");
      if (sub) sub.textContent = String(softStreak());
    };
  }

  function boot() {
    render();
    // re-render when shell becomes landing
    var obs = new MutationObserver(function () {
      if (document.documentElement.getAttribute("data-shell-mode") === "landing") render();
    });
    try { obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-shell-mode"] }); } catch (e) {}
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", function () { setTimeout(render, 500); });

  w.ClarityRoutines90 = { render: render, phases: PHASES, version: "20261024P90" };
})(typeof window !== "undefined" ? window : this);
