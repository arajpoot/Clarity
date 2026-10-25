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
    ,
    {
      phase: 5,
      title: "Phase 5 · Qur’an companionship",
      weeks: "Weeks 14–18",
      goal: "A steady, small daily relationship with the Book — not a race.",
      cards: [
        { id: "p5-ayah", title: "One āyah today", body: "Read or listen to one āyah with meaning. Prefer presence over volume.", cta: "Open Reminder", tab: "reminder", ref: "Quran.com optional" },
        { id: "p5-listen", title: "Listen with the banner", body: "Use banner recitation once with intention. Stills or live as available.", cta: "Stay on banner", tab: null, ref: "On-device audio" },
        { id: "p5-reflect", title: "One reflection line", body: "Write one private line: what this āyah asks of you today.", cta: "Open Reflection", tab: "reflection", ref: "Not a tafsīr claim" },
        { id: "p5-share-care", title: "Share carefully", body: "If you share, share the āyah text accurately — no invented meanings.", cta: "Open Action", tab: "action", ref: "Adab of transmission" }
      ]
    },
    {
      phase: 6,
      title: "Phase 6 · Ṣalāh presence",
      weeks: "Weeks 19–23",
      goal: "Protect the next prayer; build calm around the five.",
      cards: [
        { id: "p6-next", title: "Next ṣalāh on time", body: "Aim for the next prayer with presence. Use banner times as a reminder only.", cta: "See banner times", tab: null, ref: "Local times vary" },
        { id: "p6-wudu", title: "Wuḍūʾ awareness", body: "One careful wuḍūʾ today — unhurried, with basmalah.", cta: "Open Reality", tab: "reality", ref: "New Muslim / Daily" },
        { id: "p6-sunnah", title: "Two rakʿahs extra", body: "If able, two rakʿahs of sunnah or gratitude — optional, no guilt.", cta: "Mark done", tab: null, ref: "Voluntary" },
        { id: "p6-after", title: "After-ṣalāh adhkār", body: "Count the evening/morning adhkār card once after a prayer.", cta: "Use Adhkār card", tab: null, ref: "Landing adhkār" }
      ]
    },
    {
      phase: 7,
      title: "Phase 7 · Character & rights",
      weeks: "Weeks 24–30",
      goal: "Knowledge that reaches the limbs and the rights of others.",
      cards: [
        { id: "p7-tongue", title: "Guard the tongue", body: "One hour without mockery or gossip; replace with istighfār.", cta: "Mark done", tab: null, ref: "Character lane" },
        { id: "p7-right", title: "Settle one right", body: "Debt, trust, or apology — note it or begin to settle it.", cta: "Do this today", tab: null, ref: "Rights first" },
        { id: "p7-family", title: "Mercy at home", body: "One gentle word or act of service for family today.", cta: "Open Vault", tab: "notes", ref: "Private intention" },
        { id: "p7-sadaqah", title: "Quiet ṣadaqah", body: "A small ongoing good: water, teach, or give quietly.", cta: "Mark done", tab: null, ref: "Jāriyah intention" }
      ]
    },
    {
      phase: 8,
      title: "Phase 8 · Craft & skill",
      weeks: "Weeks 31–40",
      goal: "One skill line: tajweed, Arabic letter, or calligraphy — tiny daily units.",
      cards: [
        { id: "p8-tajweed", title: "One tajweed unit", body: "One letter, rule, or short line — not a full session.", cta: "Open Action", tab: "action", ref: "Tajweed lab" },
        { id: "p8-letter", title: "One Arabic letter", body: "Form or recognize one letter with care.", cta: "Open Action", tab: "action", ref: "Arabic craft" },
        { id: "p8-callig", title: "One calligraphy stroke", body: "One calm line in the calligraphy lab — beauty with sincerity.", cta: "Open Action", tab: "action", ref: "Calligraphy lab" },
        { id: "p8-review", title: "Review last unit", body: "Repeat yesterday’s tiny unit before adding new.", cta: "Open LAST", tab: "reminder", ref: "Spaced craft" }
      ]
    },
    {
      phase: 9,
      title: "Phase 9 · Transmission & trust",
      weeks: "Weeks 41–52+",
      goal: "Carry light carefully. Teach only what you know with sources.",
      cards: [
        { id: "p9-source", title: "Source before speech", body: "Before explaining a ruling or story, note the source or stay silent.", cta: "Open Reflection", tab: "reflection", ref: "Daʿī adab" },
        { id: "p9-adab", title: "Adab of daʿwah", body: "Wisdom, patience, and no compulsion — one reminder to self.", cta: "Open Reflection", tab: "reflection", ref: "Qur’an 16:125 educational" },
        { id: "p9-campus", title: "Structured study", body: "Use University / Campus for long courses; keep companion for daily return.", cta: "University tile", tab: "university", ref: "campus/" },
        { id: "p9-legacy", title: "Annual light check", body: "Istighfār · ṣalawāt · parents · one right · one small jāriyah intention.", cta: "Open Vault", tab: "notes", ref: "Furnish the grave" }
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
    html += '<p class="cdr-sub">Phase 0–9 on this landing page. Soft streak: <strong>' + streak + "</strong> day(s). Educational only — not a fatwa.</p>";
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
