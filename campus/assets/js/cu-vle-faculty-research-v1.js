/*! cu-vle-faculty-research-v1 · U62
 * Assigned guide UI — answers from ClarityAnswerEngine (not help-book objects).
 * Educational personas only — not a fatwa · not legal advice · not ijāzah
 */
(function (w, d) {
  "use strict";
  if (w.__CU_VLE_FACULTY_RESEARCH_V1__) return;
  w.__CU_VLE_FACULTY_RESEARCH_V1__ = true;

  var ROSTER_URL = "/campus/assets/faculty/faculty-roster.json?v=20261121U62";
  var KEY_TEACHER = "cu_vle_assigned_teacher_v1";

  function path() {
    return (location.pathname || "").replace(/\/+$/, "") || "";
  }
  function onSurface() {
    var p = path();
    return p.indexOf("/campus/desk") === 0 || p === "/campus/bots" || p === "/campus/mirath" || p === "/campus/library";
  }
  function phase() {
    try {
      return parseInt(localStorage.getItem("clarity_curriculum_phase_v1") || "1", 10) || 1;
    } catch (e) {
      return 1;
    }
  }
  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function ensureCss() {
    if (d.querySelector('link[data-cu-vle-fac]')) return;
    var l = d.createElement("link");
    l.rel = "stylesheet";
    l.href = "/campus/assets/css/cu-vle-faculty-research-v1.css?v=20261121U54";
    l.setAttribute("data-cu-vle-fac", "1");
    d.head.appendChild(l);
  }
  function pickTeacher(roster, ph) {
    try {
      var saved = JSON.parse(localStorage.getItem(KEY_TEACHER) || "null");
      if (saved && saved.id && saved.phase === ph) return saved;
    } catch (e) {}
    var teachers = (roster && roster.teachers) || [];
    var match = teachers.filter(function (t) {
      return Number(t.phase) === ph;
    });
    var t = match[0] || teachers[0] || { id: "guide", name: "Campus guide", title: "On-device guide", phase: ph };
    var assigned = { id: t.id, name: t.name, title: t.title || t.rank || "Guide", college: t.college || "", phase: ph, at: Date.now() };
    try {
      localStorage.setItem(KEY_TEACHER, JSON.stringify(assigned));
    } catch (e2) {}
    return assigned;
  }

  function getAnswer(q) {
    if (w.ClarityAnswerEngine && typeof w.ClarityAnswerEngine.answer === "function") {
      return w.ClarityAnswerEngine.answer(q);
    }
    return {
      short: "Answer engine loading — try again in a moment, or open Qurʾān.com.",
      links: [{ label: "Qurʾān.com", href: "https://quran.com" }],
      source: "fallback"
    };
  }

  function renderAnswer(host, teacher, q) {
    var a = getAnswer(q);
    var short = typeof a.short === "string" ? a.short : "Verify with a local teacher.";
    var linksHtml = "";
    (a.links || []).forEach(function (L) {
      linksHtml +=
        '<a href="' +
        esc(L.href) +
        '" target="_blank" rel="noopener">' +
        esc(L.label) +
        "</a> ";
    });
    host.innerHTML =
      '<div class="cvf-block"><h4>Assigned guide · counsel</h4><p><strong>' +
      esc(teacher.name) +
      "</strong> — " +
      esc(teacher.title) +
      "</p><p>" +
      esc(short) +
      "</p>" +
      (a.hadith ? "<p><strong>Hadith · citation</strong><br/>" + esc(a.hadith) + "</p>" : "") +
      "<p>" +
      linksHtml +
      "</p></div>" +
      '<p class="cvf-stamp">Educational UX only — not a living mujtahid, not ijāzah, not a fatwa, not legal advice.</p>';
  }

  function mount(roster) {
    if (!onSurface() || d.getElementById("cu-vle-faculty-research")) return;
    ensureCss();
    var ph = phase();
    var teacher = pickTeacher(roster, ph);
    var sec = d.createElement("section");
    sec.id = "cu-vle-faculty-research";
    sec.className = "cu-vle-fac";
    sec.setAttribute("data-clarity-owned", "vle-faculty-research-v1");
    sec.innerHTML =
      '<div class="cvf-card">' +
      '<p class="cvf-kicker">VLE · assigned guide · research</p>' +
      "<h2>Study with your on-device guide</h2>" +
      '<div class="cvf-teacher"><div class="cvf-seal" aria-hidden="true">📖</div><div><h3>' +
      esc(teacher.name) +
      "</h3><p>" +
      esc(teacher.title) +
      (teacher.college ? " · " + esc(teacher.college) : "") +
      "</p><p>Phase " +
      esc(String(teacher.phase)) +
      " · educational persona only</p></div></div>" +
      '<div class="cvf-chips">' +
      '<button type="button" data-cvf-q="tawhid">Tawḥīd</button>' +
      '<button type="button" data-cvf-q="prayer">Prayer</button>' +
      '<button type="button" data-cvf-q="iman">Īmān</button>' +
      '<button type="button" data-cvf-q="wasiyyah">Wasiyyah · farāʾiḍ</button>' +
      "</div>" +
      '<form class="cvf-row" id="cvf-form">' +
      '<input type="search" id="cvf-q" placeholder="Ask: iman · tawhid · prayer · wasiyyah" />' +
      '<button type="submit" class="cvf-go">Ask guide</button></form>' +
      '<div class="cvf-out" id="cvf-out"></div>' +
      '<p class="cvf-stamp">Answers are short study aids with links to full sources — not a fatwa desk.</p></div>';

    var main = d.querySelector("main") || d.body;
    var after = d.getElementById("cu-vle-hud") || d.getElementById("cu-bots-command");
    if (after && after.parentNode) after.parentNode.insertBefore(sec, after.nextSibling);
    else main.insertBefore(sec, main.firstChild);

    var form = d.getElementById("cvf-form");
    var input = d.getElementById("cvf-q");
    var out = d.getElementById("cvf-out");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      renderAnswer(out, teacher, input.value);
    });
    sec.addEventListener("click", function (e) {
      var b = e.target.closest("[data-cvf-q]");
      if (!b) return;
      input.value = b.getAttribute("data-cvf-q");
      renderAnswer(out, teacher, input.value);
    });
  }

  function boot() {
    if (!onSurface()) return;
    function go(roster) {
      // load answer engine if missing
      if (!w.ClarityAnswerEngine) {
        var s = d.createElement("script");
        s.src = "/campus/assets/js/cu-vle-answer-engine-v1.js?v=20261121U62";
        s.onload = function () {
          mount(roster || {});
        };
        s.onerror = function () {
          mount(roster || {});
        };
        d.head.appendChild(s);
      } else mount(roster || {});
    }
    fetch(ROSTER_URL, { cache: "no-cache" })
      .then(function (r) {
        return r.ok ? r.json() : {};
      })
      .then(go)
      .catch(function () {
        go({});
      });
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 500);
})(window, document);
