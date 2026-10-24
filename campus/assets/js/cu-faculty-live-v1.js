/**
 * cu-faculty-live-v1.js — Resurrect Faculty Wing UX on /campus/faculty.html
 * Loads roster + help-book, paints cards, Ask-advisor popover, enroll/sign handoff.
 * Educational personas only — not living scholars, not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CU_FACULTY_LIVE_V1__) return;
  g.__CU_FACULTY_LIVE_V1__ = true;

  var ROSTER_URL = "/campus/assets/faculty/faculty-roster.json";
  var HELP_URL = "/campus/assets/faculty/help-book.json";
  var roster = null;
  var helpbook = null;

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function fetchJSON(url) {
    return fetch(url, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(url);
      return r.json();
    });
  }

  function phaseHref(phase) {
    var map = {
      1: "/campus/desk/seeker/",
      2: "/campus/desk/practice/",
      3: "/campus/desk/consistency/",
      4: "/campus/desk/transmission/"
    };
    return map[phase] || "/campus/desk/";
  }

  function ensurePopover() {
    var el = document.getElementById("cu-fac-popover");
    if (el) return el;
    el = document.createElement("div");
    el.id = "cu-fac-popover";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.hidden = true;
    el.innerHTML =
      '<div class="cu-fac-pop-card">' +
      '<button type="button" class="cu-fac-pop-x" aria-label="Close">×</button>' +
      '<p class="cu-fac-pop-seal" id="cu-fac-pop-seal"></p>' +
      '<h3 id="cu-fac-pop-title"></h3>' +
      '<p id="cu-fac-pop-body" class="cu-fac-pop-body"></p>' +
      '<p class="cu-fac-pop-foot">Educational guide only — not a fatwa. Verify with a local teacher.</p>' +
      '<div class="cu-fac-pop-actions">' +
      '<button type="button" id="cu-fac-pop-desk">Open desk →</button>' +
      '<button type="button" id="cu-fac-pop-close">Close</button>' +
      "</div></div>";
    document.body.appendChild(el);
    el.querySelector(".cu-fac-pop-x").onclick = closePop;
    el.querySelector("#cu-fac-pop-close").onclick = closePop;
    el.addEventListener("click", function (e) {
      if (e.target === el) closePop();
    });
    return el;
  }

  function closePop() {
    var el = document.getElementById("cu-fac-popover");
    if (el) el.hidden = true;
  }

  function openAdvisor(teacher) {
    var el = ensurePopover();
    var tips = [];
    if (helpbook && helpbook.byPhase && helpbook.byPhase[String(teacher.phase)]) {
      tips = helpbook.byPhase[String(teacher.phase)];
    } else if (helpbook && helpbook.tips) {
      tips = helpbook.tips;
    } else if (Array.isArray(helpbook)) {
      tips = helpbook;
    }
    var tip =
      (tips && tips[Math.floor(Math.random() * Math.max(tips.length, 1))]) ||
      teacher.greeting ||
      "Begin with Allah. Take one module at a time.";
    if (typeof tip === "object") tip = tip.text || tip.line || JSON.stringify(tip);

    el.querySelector("#cu-fac-pop-seal").textContent = teacher.seal || "✦";
    el.querySelector("#cu-fac-pop-title").textContent =
      (teacher.name || "Advisor") + " · " + (teacher.rank || "Guide");
    el.querySelector("#cu-fac-pop-body").textContent = String(tip);
    var desk = el.querySelector("#cu-fac-pop-desk");
    desk.onclick = function () {
      location.href = phaseHref(teacher.phase);
    };
    el.hidden = false;

    // Prefer buried controller help when present
    try {
      if (g.ClarityFaculty && typeof g.ClarityFaculty.offerHelp === "function") {
        g.ClarityFaculty.offerHelp(teacher.phase);
      }
    } catch (e) {}

    try {
      var log = JSON.parse(localStorage.getItem("clarity_faculty_help_log_v1") || "[]");
      if (!Array.isArray(log)) log = [];
      log.unshift({ at: Date.now(), phase: teacher.phase, id: teacher.id });
      localStorage.setItem("clarity_faculty_help_log_v1", JSON.stringify(log.slice(0, 30)));
    } catch (e) {}
  }

  function paintGrid() {
    var host = document.getElementById("fac-grid");
    if (!host || !roster || !roster.teachers) return;
    host.className = "fac-grid";
    host.innerHTML = roster.teachers
      .map(function (t) {
        return (
          '<article class="fac-card" data-phase="' +
          esc(t.phase) +
          '">' +
          '<span class="role">' +
          esc(t.title || t.rank) +
          "</span>" +
          "<strong>" +
          esc(t.name) +
          "</strong>" +
          '<span class="spec">' +
          esc(t.specialty) +
          "</span>" +
          '<p class="fac-greet">' +
          esc(t.greeting) +
          "</p>" +
          '<div class="fac-actions">' +
          '<button type="button" class="fac-ask" data-id="' +
          esc(t.id) +
          '">Ask advisor</button>' +
          '<a class="fac-desk" href="' +
          phaseHref(t.phase) +
          '">Phase desk →</a>' +
          "</div>" +
          (t.signatory
            ? '<span class="fac-seal" title="Signatory">' + esc(t.seal || "✦") + "</span>"
            : "") +
          "</article>"
        );
      })
      .join("");

    host.querySelectorAll(".fac-ask").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        var t = roster.teachers.filter(function (x) {
          return x.id === id;
        })[0];
        if (t) openAdvisor(t);
      });
    });

    var office = document.getElementById("fac-office-line");
    if (office) {
      office.textContent =
        (roster.office || "Faculty") +
        " · " +
        (roster.motto || "") +
        " · " +
        roster.teachers.length +
        " on duty";
    }
  }

  function paintDutyStrip() {
    if (!roster || !roster.teachers) return;
    var strip = document.getElementById("fac-duty-strip");
    if (!strip) {
      var main = document.querySelector("main");
      if (!main) return;
      strip = document.createElement("div");
      strip.id = "fac-duty-strip";
      strip.className = "fac-duty-strip";
      main.insertBefore(strip, main.firstChild.nextSibling);
    }
    var phase = 1;
    try {
      phase = parseInt(localStorage.getItem("clarity_curriculum_phase_v1") || "1", 10) || 1;
    } catch (e) {}
    var on = roster.teachers.filter(function (t) {
      return t.phase === phase;
    })[0];
    strip.innerHTML =
      '<span class="pulse" aria-hidden="true"></span>' +
      "<span><strong>On duty now:</strong> " +
      esc(on ? on.name : "Faculty guides") +
      (on ? " · " + esc(on.rank) : "") +
      ' · <button type="button" id="fac-duty-ask">Ask</button></span>';
    var b = document.getElementById("fac-duty-ask");
    if (b && on) b.onclick = function () {
      openAdvisor(on);
    };
  }

  function boot() {
    Promise.all([
      fetchJSON(ROSTER_URL).catch(function () {
        return null;
      }),
      fetchJSON(HELP_URL).catch(function () {
        return null;
      })
    ]).then(function (arr) {
      roster = arr[0] || { teachers: [] };
      helpbook = arr[1] || {};
      paintGrid();
      paintDutyStrip();
      try {
        if (g.ClarityFaculty) {
          console.info(
            "%c Faculty live ",
            "background:#1e7d5e;color:#fff",
            "ClarityFaculty bridge ready"
          );
        }
      } catch (e) {}
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
