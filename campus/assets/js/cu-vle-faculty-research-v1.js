/*! cu-vle-faculty-research-v1 · U54
 * Assigned virtual faculty + research desk + educational wasiyyah bridge.
 * Educational personas only — NOT living scholars, NOT fatwa, NOT legal advice,
 * NOT a grade of īmān. Wasiyyah/farāʾiḍ study opens Amānah room tools.
 */
(function (w, d) {
  "use strict";
  if (w.__CU_VLE_FACULTY_RESEARCH_V1__) return;
  w.__CU_VLE_FACULTY_RESEARCH_V1__ = true;

  var ROSTER_URL = "/campus/assets/faculty/faculty-roster.json?v=20261121U54";
  var HELP_URL = "/campus/assets/faculty/help-book.json?v=20261121U54";
  var KEY_TEACHER = "cu_vle_assigned_teacher_v1";

  function path() {
    return (location.pathname || "").replace(/\/+$/, "") || "";
  }
  function onSurface() {
    var p = path();
    return (
      p.indexOf("/campus/desk") === 0 ||
      p === "/campus/bots" ||
      p === "/campus/mirath" ||
      p === "/campus/library"
    );
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
  function lsJSON(k, fb) {
    try {
      return JSON.parse(localStorage.getItem(k) || "null") || fb;
    } catch (e) {
      return fb;
    }
  }
  function lsSet(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
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
    var saved = lsJSON(KEY_TEACHER, null);
    if (saved && saved.id && saved.phase === ph) return saved;
    var teachers = (roster && roster.teachers) || [];
    var match = teachers.filter(function (t) {
      return Number(t.phase) === ph;
    });
    var t = match[0] || teachers[0] || {
      id: "guide-default",
      name: "Campus guide",
      title: "On-device learning guide",
      phase: ph
    };
    var assigned = {
      id: t.id,
      name: t.name,
      title: t.title || t.rank || "Mudarris",
      college: t.college || "",
      phase: ph,
      at: Date.now()
    };
    lsSet(KEY_TEACHER, assigned);
    return assigned;
  }

  function tipFor(help, ph, q) {
    var tips = [];
    if (help && help.byPhase && help.byPhase[String(ph)]) tips = help.byPhase[String(ph)];
    else if (help && help.default) tips = help.default;
    if (!tips || !tips.length) {
      tips = [
        "One sincere page is better than ten rushed ones.",
        "Verify practice with a local teacher.",
        "Charter limits protect sincerity."
      ];
    }
    var low = String(q || "").toLowerCase();
    if (/wasiy|will|inherit|fara|mirath|estate/.test(low)) {
      return "Inheritance and wasiyyah study belongs in the Amānah room as education only — not a court filing, not a fatwa. Confirm with qualified counsel in your jurisdiction.";
    }
    return tips[Math.floor(Math.random() * tips.length)] || tips[0];
  }

  function parseRef(q) {
    var m = String(q).trim().match(/^(\d{1,3})\s*[:：]\s*(\d{1,3})/);
    if (m) return { ch: +m[1], ay: +m[2] };
    return null;
  }

  function isWasiyyahQuery(q) {
    return /wasiy|waṣiy|will\b|inherit|faraid|farā|mirath|mīrāth|estate|bequest|heir|dayn|debt.*estate/i.test(
      String(q || "")
    );
  }

  function fetchUthmani(ch) {
    return fetch("https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=" + ch, {
      credentials: "omit"
    }).then(function (r) {
      if (!r.ok) throw new Error("api");
      return r.json();
    });
  }

  function renderWasiyyahBridge(host, teacher) {
    host.innerHTML =
      '<div class="cvf-block cvf-warn"><h4>Wasiyyah · farāʾiḍ · study bridge</h4>' +
      "<p>Your assigned guide (<strong>" +
      esc(teacher.name) +
      "</strong>) can only point to <em>educational</em> architecture. This is <strong>not</strong> a will, not a fatwa, not legal advice, not a court document.</p></div>" +
      '<div class="cvf-block"><h4>Unlocked Amānah architecture</h4>' +
      "<p>Tree · farāʾiḍ study · wasiyyah enrich live in the <strong>Amānah room</strong> (private trust tools on this device). Campus Mīrāth is a study desk only.</p>" +
      '<p><a href="/amana/wasiyyah/">Amānah · Wasiyyah</a>' +
      '<a href="/amana/">Amānah gate</a>' +
      '<a href="/campus/mirath/">Campus · Mīrāth study</a>' +
      '<a href="/campus/charter/">Charter limits</a></p>' +
      '<p class="cvf-stamp">Verify inheritance practice with qualified counsel and a local scholar in your jurisdiction.</p></div>' +
      '<div class="cvf-block"><h4>Guide counsel (persona)</h4><p>' +
      esc(
        tipFor(
          null,
          teacher.phase,
          "wasiyyah"
        )
      ) +
      "</p></div>" +
      '<p class="cvf-stamp"><strong>Educational personas only</strong> — not living mujtahids · not formal ijāzah · not a fatwa desk.</p>';
  }

  function runResearch(q, host, teacher, help) {
    q = String(q || "").trim();
    if (!q) {
      host.innerHTML = '<p class="cvf-stamp">Ask a topic, verse key (2:180), or “wasiyyah”.</p>';
      return;
    }
    if (isWasiyyahQuery(q)) {
      renderWasiyyahBridge(host, teacher);
      return;
    }
    host.innerHTML = '<p class="cvf-stamp">Consulting guide + allowlisted sources…</p>';
    var counsel = tipFor(help, teacher.phase, q);
    var ref = parseRef(q);
    var base =
      '<div class="cvf-block"><h4>Assigned guide · counsel</h4><p><strong>' +
      esc(teacher.name) +
      "</strong> — " +
      esc(teacher.title) +
      "</p><p>" +
      esc(counsel) +
      "</p></div>";

    function links() {
      var enc = encodeURIComponent(q);
      return (
        '<div class="cvf-block"><h4>Research outward</h4>' +
        '<a href="https://quran.com/search?q=' +
        enc +
        '" target="_blank" rel="noopener">Qurʾān.com</a>' +
        '<a href="https://sunnah.com/search?q=' +
        enc +
        '" target="_blank" rel="noopener">Sunnah.com</a>' +
        '<a href="https://seekersguidance.org/?s=' +
        enc +
        '" target="_blank" rel="noopener">SeekersGuidance</a>' +
        '<a href="/campus/library/">Campus library</a>' +
        "</div>" +
        '<p class="cvf-stamp">Not a fatwa · not a grade of īmān · confirm with a local teacher.</p>'
      );
    }

    if (ref && ref.ch >= 1 && ref.ch <= 114) {
      fetchUthmani(ref.ch)
        .then(function (data) {
          var verses = (data.verses || []).filter(function (v) {
            return (v.verse_number || 0) === ref.ay;
          });
          if (!verses.length) verses = (data.verses || []).slice(0, 3);
          var ar = verses
            .map(function (v) {
              var key = v.verse_key || ref.ch + ":" + v.verse_number;
              return (
                '<p class="cvf-ar" lang="ar" dir="rtl">' +
                esc(v.text_uthmani || "") +
                '</p><p><a href="https://quran.com/' +
                esc(String(key).replace(":", "/")) +
                '" target="_blank" rel="noopener">' +
                esc(key) +
                "</a></p>"
              );
            })
            .join("");
          host.innerHTML =
            base +
            '<div class="cvf-block"><h4>Qurʾān · uthmani</h4>' +
            ar +
            "</div>" +
            links();
        })
        .catch(function () {
          host.innerHTML = base + links();
        });
    } else {
      host.innerHTML = base + links();
    }
  }

  function mount(roster, help) {
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
      '<div class="cvf-teacher">' +
      '<div class="cvf-seal" aria-hidden="true">📖</div>' +
      "<div><h3>" +
      esc(teacher.name) +
      "</h3><p>" +
      esc(teacher.title) +
      (teacher.college ? " · " + esc(teacher.college) : "") +
      "</p><p>Phase " +
      esc(String(teacher.phase)) +
      " · educational persona only</p></div></div>" +
      '<div class="cvf-chips">' +
      '<button type="button" data-cvf-q="tawḥīd">Tawḥīd</button>' +
      '<button type="button" data-cvf-q="prayer">Prayer</button>' +
      '<button type="button" data-cvf-q="112:1">112:1</button>' +
      '<button type="button" data-cvf-q="wasiyyah">Wasiyyah · farāʾiḍ</button>' +
      "</div>" +
      '<form class="cvf-row" id="cvf-form">' +
      '<input type="search" id="cvf-q" placeholder="Ask guide · verse · wasiyyah" />' +
      '<button type="submit" class="cvf-go">Ask guide</button>' +
      "</form>" +
      '<div class="cvf-out" id="cvf-out"></div>' +
      '<p class="cvf-stamp">Educational UX only — not a living mujtahid, not ijāzah, not a fatwa, not legal advice.</p>' +
      "</div>";

    var main = d.querySelector("main") || d.body;
    var after = d.getElementById("cu-vle-hud") || d.getElementById("cu-vle-research");
    if (after && after.parentNode) after.parentNode.insertBefore(sec, after.nextSibling);
    else {
      var h1 = main.querySelector("h1, h2");
      if (h1 && h1.parentNode) h1.parentNode.insertBefore(sec, h1.nextSibling);
      else main.insertBefore(sec, main.firstChild);
    }

    var form = d.getElementById("cvf-form");
    var input = d.getElementById("cvf-q");
    var out = d.getElementById("cvf-out");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      runResearch(input.value, out, teacher, help);
    });
    sec.addEventListener("click", function (e) {
      var b = e.target.closest("[data-cvf-q]");
      if (!b) return;
      input.value = b.getAttribute("data-cvf-q");
      runResearch(input.value, out, teacher, help);
    });
  }

  function boot() {
    if (!onSurface()) return;
    Promise.all([
      fetch(ROSTER_URL, { cache: "no-cache" }).then(function (r) {
        return r.ok ? r.json() : {};
      }),
      fetch(HELP_URL, { cache: "no-cache" }).then(function (r) {
        return r.ok ? r.json() : {};
      })
    ])
      .then(function (arr) {
        mount(arr[0] || {}, arr[1] || {});
      })
      .catch(function () {
        mount({}, {});
      });
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 450);
})(window, document);
