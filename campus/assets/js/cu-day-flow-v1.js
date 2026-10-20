/**
 * Clarity University — Day in the life (sequenced path)
 * discipline + ʿilm + adab · local-only · not Cairo · not a fatwa
 *
 * Flow:
 *   soft prayer-window hint (optional)
 *   → Continue desk module
 *   → one Lab station
 *   → Buddy if stuck / Vault note / Library
 *   → weekly Assignments · Schedule · Diploma milestone
 */
(function (g) {
  "use strict";
  if (g.__CU_DAY_FLOW_V1__) return;
  g.__CU_DAY_FLOW_V1__ = true;

  var DAY_KEY = "cu_uni_day_flow_v1";

  function loadDay() {
    try {
      return JSON.parse(localStorage.getItem(DAY_KEY) || "{}") || {};
    } catch (e) {
      return {};
    }
  }
  function saveDay(d) {
    try {
      localStorage.setItem(DAY_KEY, JSON.stringify(d));
    } catch (e) {}
  }
  function todayStr() {
    var n = new Date();
    return n.getFullYear() + "-" + String(n.getMonth() + 1).padStart(2, "0") + "-" + String(n.getDate()).padStart(2, "0");
  }
  function ensureToday() {
    var d = loadDay();
    var t = todayStr();
    if (d.date !== t) {
      d = { date: t, desk: false, lab: false, note: false, assign: false };
      saveDay(d);
    }
    return d;
  }

  /** Soft time-of-day adab window — not prayer calculation, not a timetable fatwa */
  function softWindow() {
    var h = new Date().getHours();
    if (h >= 4 && h < 7)
      return {
        id: "fajrish",
        title: "Early hours",
        line: "A quiet window many students use for Qurʾān or one short lesson. Optional — follow your local prayer times with a trusted source."
      };
    if (h >= 7 && h < 12)
      return {
        id: "morning",
        title: "Morning study",
        line: "One desk module while the mind is fresh. Then one Lab station."
      };
    if (h >= 12 && h < 16)
      return {
        id: "mid",
        title: "Midday pace",
        line: "Short session is enough. Finish an open module or review Transcript."
      };
    if (h >= 16 && h < 20)
      return {
        id: "late",
        title: "Late afternoon",
        line: "One practice line · optional Lab · or a Library pin."
      };
    return {
      id: "night",
      title: "Evening wind-down",
      line: "Light review only. Vault note or duʿāʾ — avoid heavy new modules if you are tired."
    };
  }

  function status() {
    if (g.CuStudentStatus) return g.CuStudentStatus.get();
    return {
      phaseLabel: "Seeker",
      href: "/campus/desk/seeker/",
      done: 0,
      name: ""
    };
  }

  function labForPhase(phaseId) {
    var map = {
      seeker: { href: "/lab/tajweed/", label: "Tajweed lab" },
      practice: { href: "/lab/arabic/", label: "Arabic studio" },
      consistency: { href: "/lab/recite/", label: "Recite studio" },
      transmission: { href: "/lab/media/", label: "Media studio" }
    };
    return map[phaseId] || map.seeker;
  }

  function mark(kind) {
    var d = ensureToday();
    d[kind] = true;
    saveDay(d);
    paint();
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function stepClass(done, current) {
    if (done) return "cu-day-step is-done";
    if (current) return "cu-day-step is-now";
    return "cu-day-step";
  }

  function paint() {
    var root = document.getElementById("cu-day-flow");
    if (!root) return;
    var d = ensureToday();
    var s = status();
    var win = softWindow();
    var lab = labForPhase(s.phaseId || "seeker");
    var next =
      !d.desk ? "desk" : !d.lab ? "lab" : !d.note ? "note" : "done";

    root.innerHTML =
      '<section class="cu-day-panel" aria-label="Today on the path">' +
      '<header class="cu-day-head">' +
      "<div><strong>Today on the path</strong>" +
      '<span class="cu-meta"> · ' +
      esc(win.title) +
      "</span>" +
      "<p class=\"cu-day-line\">" +
      esc(win.line) +
      "</p></div>" +
      '<span class="cu-day-date cu-meta">' +
      esc(d.date) +
      "</span></header>" +
      '<ol class="cu-day-steps">' +
      /* 1 desk */
      "<li class=\"" +
      stepClass(d.desk, next === "desk") +
      '">' +
      "<div class=\"cu-day-num\">1</div><div class=\"cu-day-body\">" +
      "<strong>Desk · " +
      esc(s.phaseLabel) +
      "</strong>" +
      "<p class=\"cu-meta\">One module. Understand · one practice line.</p>" +
      '<p class="cu-day-actions">' +
      '<a class="cu-day-go" href="' +
      esc(s.href) +
      '">Open desk →</a> ' +
      '<button type="button" class="cu-day-mark" data-mark="desk">' +
      (d.desk ? "Done ✓" : "Mark done") +
      "</button></p></div></li>" +
      /* 2 lab */
      "<li class=\"" +
      stepClass(d.lab, next === "lab") +
      '">' +
      "<div class=\"cu-day-num\">2</div><div class=\"cu-day-body\">" +
      "<strong>Lab · one station</strong>" +
      "<p class=\"cu-meta\">Suggested: " +
      esc(lab.label) +
      " · or any studio once.</p>" +
      '<p class="cu-day-actions">' +
      '<a class="cu-day-go" href="' +
      esc(lab.href) +
      '">Open lab →</a> ' +
      '<a class="cu-day-go ghost" href="/lab/">All studios</a> ' +
      '<button type="button" class="cu-day-mark" data-mark="lab">' +
      (d.lab ? "Done ✓" : "Mark done") +
      "</button></p></div></li>" +
      /* 3 seal */
      "<li class=\"" +
      stepClass(d.note, next === "note") +
      '">' +
      "<div class=\"cu-day-num\">3</div><div class=\"cu-day-body\">" +
      "<strong>Seal with adab</strong>" +
      "<p class=\"cu-meta\">Vault note · Library pin · or Buddy if you are lost.</p>" +
      '<p class="cu-day-actions">' +
      '<a class="cu-day-go" href="/vault/">Vault note</a> ' +
      '<a class="cu-day-go ghost" href="/library/">Library</a> ' +
      '<a class="cu-day-go ghost" href="/campus/buddy/">Buddy</a> ' +
      '<button type="button" class="cu-day-mark" data-mark="note">' +
      (d.note ? "Done ✓" : "Mark done") +
      "</button></p></div></li>" +
      "</ol>" +
      '<footer class="cu-day-foot">' +
      (next === "done"
        ? '<p class="cu-day-done"><strong>Today’s sequence complete.</strong> Optional: <a href="/campus/assignments/">Assignments</a> · <a href="/campus/transcript/">Transcript</a> · <a href="/campus/diploma/">Diploma checklist</a></p>'
        : '<p class="cu-meta">Weekly: <a href="/campus/schedule/">Schedule</a> · <a href="/campus/assignments/">Assignments</a> · milestone <a href="/campus/diploma/">Diploma</a></p>') +
      '<p class="cu-meta">Educational only · not a fatwa · not affiliated with Al-Azhar · progress stays on this device.</p>' +
      "</footer></section>";

    root.querySelectorAll("[data-mark]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        mark(btn.getAttribute("data-mark"));
      });
    });
  }

  function boot() {
    ensureToday();
    paint();
  }

  g.CuDayFlow = { paint: paint, mark: mark, ensureToday: ensureToday, softWindow: softWindow };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window);
