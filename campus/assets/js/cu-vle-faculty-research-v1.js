/*! cu-vle-faculty-research-v1 · U57 fix+upgrade
 * Assigned virtual faculty + research desk + educational wasiyyah bridge.
 * Educational personas only — NOT living scholars, NOT fatwa, NOT legal advice,
 * NOT a grade of īmān. Wasiyyah/farāʾiḍ study opens Amānah room tools.
 */
(function (w, d) {
  "use strict";
  if (w.__CU_VLE_FACULTY_RESEARCH_V1__) return;
  w.__CU_VLE_FACULTY_RESEARCH_V1__ = true;

  var ROSTER_URL = "/campus/assets/faculty/faculty-roster.json?v=20261121U57";
  var HELP_URL = "/campus/assets/faculty/help-book.json?v=20261121U57";
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
    l.href = "/campus/assets/css/cu-vle-faculty-research-v1.css?v=20261121U57";
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


  function asTipText(item) {
    if (item == null) return "";
    if (typeof item === "string") return item;
    if (typeof item === "object") {
      if (typeof item.tip === "string") return item.tip;
      if (typeof item.text === "string") return item.text;
      if (typeof item.body === "string") return item.body;
      if (typeof item.message === "string") return item.message;
    }
    return "";
  }

  /** Topic briefs — short educational answers + primary full-answer links */
  var TOPIC_BRIEFS = [
    {
      keys: [/iman|īmān|faith|believe/i],
      short:
        "Īmān is belief in the heart, speech of the tongue, and action of the limbs — it increases with obedience and decreases with disobedience. Start with the six pillars as a map, then live them with sincerity.",
      links: [
        { label: "Qurʾān · 2:285", href: "https://quran.com/2/285" },
        { label: "SeekersGuidance · īmān", href: "https://seekersguidance.org/?s=iman" },
        { label: "Seeker desk", href: "/campus/desk/seeker/" }
      ]
    },
    {
      keys: [/tawhid|tawḥīd|oneness|shirk/i],
      short:
        "Tawḥīd is single-hearted loyalty to Allāh alone in Lordship, worship, and His Names and Attributes — not a slogan. Protect it by knowing what nullifies it, with a local teacher.",
      links: [
        { label: "Qurʾān · 112", href: "https://quran.com/112" },
        { label: "SeekersGuidance · tawhid", href: "https://seekersguidance.org/?s=tawhid" },
        { label: "Seeker desk", href: "/campus/desk/seeker/" }
      ]
    },
    {
      keys: [/salah|ṣalāh|prayer|wudu|wuḍū|purity/i],
      short:
        "Prayer is the pillar of practice. Use Campus maps for orientation only — confirm the steps of purification and ṣalāh with a local teacher you trust.",
      links: [
        { label: "SeekersGuidance · prayer", href: "https://seekersguidance.org/?s=prayer" },
        { label: "Sunnah.com · prayer", href: "https://sunnah.com/search?q=prayer" },
        { label: "Practice desk", href: "/campus/desk/practice/" }
      ]
    },
    {
      keys: [/quran|qurʾān|recit|tajweed/i],
      short:
        "The Qurʾān is recited with adab and understood with humility. Open one verse, sit with it, and learn tajweed gradually — Craft Tajweed lab supports practice, not certification.",
      links: [
        { label: "Qurʾān.com", href: "https://quran.com" },
        { label: "Tajweed lab", href: "/craft/tajweed/" },
        { label: "SeekersGuidance · Qurʾān", href: "https://seekersguidance.org/?s=quran" }
      ]
    },
    {
      keys: [/wasiy|inherit|faraid|mirath|will/i],
      short:
        "Wasiyyah and farāʾiḍ are serious trusts. Campus only points to educational Amānah tools — not a will, not a fatwa, not legal advice. Use qualified counsel in your jurisdiction.",
      links: [
        { label: "Amānah · Wasiyyah", href: "/amana/wasiyyah/" },
        { label: "Campus Mīrāth study", href: "/campus/mirath/" },
        { label: "Charter limits", href: "/campus/charter/" }
      ]
    }
  ];

  function topicBrief(q) {
    var s = String(q || "");
    for (var i = 0; i < TOPIC_BRIEFS.length; i++) {
      var t = TOPIC_BRIEFS[i];
      for (var k = 0; k < t.keys.length; k++) {
        if (t.keys[k].test(s)) return t;
      }
    }
    return null;
  }

  function tipFor(help, ph, q) {
    var brief = topicBrief(q);
    if (brief) return brief.short;

    var tips = [];
    if (help && help.byPhase && help.byPhase[String(ph)]) tips = help.byPhase[String(ph)];
    else if (help && Array.isArray(help.default)) tips = help.default;

    var texts = [];
    for (var i = 0; i < (tips || []).length; i++) {
      var tx = asTipText(tips[i]);
      if (tx) texts.push(tx);
    }
    if (!texts.length) {
      texts = [
        "One sincere page is better than ten rushed ones.",
        "Verify practice with a local teacher.",
        "Charter limits protect sincerity."
      ];
    }
    return texts[Math.floor(Math.random() * texts.length)] || texts[0];
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
    if (typeof counsel !== "string") counsel = asTipText(counsel) || "Ask with sincerity; verify with a local teacher.";
    var brief = topicBrief(q);
    var ref = parseRef(q);
    var counselLinks = "";
    if (brief && brief.links && brief.links.length) {
      counselLinks = "<p>";
      brief.links.forEach(function (L) {
        counselLinks +=
          '<a href="' +
          esc(L.href) +
          '" target="_blank" rel="noopener">' +
          esc(L.label) +
          " · full answer</a> ";
      });
      counselLinks += "</p>";
    }
    var base =
      '<div class="cvf-block"><h4>Assigned guide · counsel</h4><p><strong>' +
      esc(teacher.name) +
      "</strong> — " +
      esc(teacher.title) +
      "</p><p>" +
      esc(counsel) +
      "</p>" +
      counselLinks +
      "</div>";

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
