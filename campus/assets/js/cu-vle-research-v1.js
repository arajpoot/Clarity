/*! cu-vle-research-v1 · U53
 * VLE Research Desk — allowlisted educational sources only.
 * NOT a fatwa bot · NOT a scholar · NOT a grade of īmān
 * On-device UI + public Qurʾān API + deep links (quran.com, sunnah.com, SeekersGuidance)
 */
(function (w, d) {
  "use strict";
  if (w.__CU_VLE_RESEARCH_V1__) return;
  w.__CU_VLE_RESEARCH_V1__ = true;

  var CHAPTERS = {
    ikhlas: 112, ikhlās: 112, "al-ikhlas": 112, الإخلاص: 112,
    fatiha: 1, fātiḥah: 1, "al-fatiha": 1, الفاتحة: 1,
    baqarah: 2, "al-baqarah": 2,
    kafirun: 109, "al-kafirun": 109,
    nas: 114, "an-nas": 114, falaq: 113, "al-falaq": 113,
    mulk: 67, "al-mulk": 67, yasin: 36, "ya-sin": 36
  };

  function path() {
    return (location.pathname || "").replace(/\/+$/, "") || "";
  }
  function onVleSurface() {
    var p = path();
    return (
      p.indexOf("/campus/desk") === 0 ||
      p === "/campus/bots" ||
      p === "/campus/library" ||
      p.indexOf("/campus/lab") === 0
    );
  }

  function ensureCss() {
    if (d.querySelector('link[data-cu-vle-research]')) return;
    var l = d.createElement("link");
    l.rel = "stylesheet";
    l.href = "/campus/assets/css/cu-vle-research-v1.css?v=20261121U53";
    l.setAttribute("data-cu-vle-research", "1");
    d.head.appendChild(l);
  }

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function parseRef(q) {
    var m = String(q).trim().match(/^(\d{1,3})\s*[:：]\s*(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?$/);
    if (m) return { ch: +m[1], from: +m[2], to: m[3] ? +m[3] : +m[2] };
    var low = String(q).trim().toLowerCase();
    if (CHAPTERS[low]) return { ch: CHAPTERS[low], from: 1, to: 4, name: low };
    for (var k in CHAPTERS) {
      if (low.indexOf(k) >= 0) return { ch: CHAPTERS[k], from: 1, to: 7, name: k };
    }
    return null;
  }

  function fetchUthmani(ch) {
    return fetch("https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=" + ch, {
      credentials: "omit",
      cache: "default"
    }).then(function (r) {
      if (!r.ok) throw new Error("Qurʾān API " + r.status);
      return r.json();
    });
  }

  function localHints(q) {
    var low = String(q).toLowerCase();
    var hints = [];
    if (/tawhid|tawḥīd|allah is one|ikhlas|shirk/.test(low)) {
      hints.push({
        title: "Campus · Seeker station",
        body: "Junior modules on tawḥīd open on the Seeker desk only.",
        href: "/campus/desk/seeker/"
      });
    }
    if (/pray|salah|ṣalāh|wudu|wuḍū|prayer/.test(low)) {
      hints.push({
        title: "Campus · Practice desk",
        body: "Prayer and purification maps — confirm steps with a local teacher.",
        href: "/campus/desk/practice/"
      });
    }
    if (/fatwa|halal|haram|ruling|divorce|inheritance/.test(low)) {
      hints.push({
        title: "Charter limit",
        body: "Clarity is not a fatwa service. Ask a qualified local teacher or recognized body.",
        href: "/campus/charter/"
      });
    }
    if (/progress|module|junior|phase/.test(low)) {
      hints.push({
        title: "Bots · Seq progress",
        body: "On-device progress bus and next module live under Campus bots.",
        href: "/campus/bots/"
      });
    }
    return hints;
  }

  function allowlistedLinks(q) {
    var enc = encodeURIComponent(q);
    return [
      { label: "Qurʾān.com search", href: "https://quran.com/search?q=" + enc },
      { label: "Sunnah.com search", href: "https://sunnah.com/search?q=" + enc },
      { label: "SeekersGuidance search", href: "https://seekersguidance.org/?s=" + enc },
      { label: "Campus library", href: "/campus/library/" },
      { label: "Charter limits", href: "/campus/charter/" }
    ];
  }

  function renderResults(host, q, ref, verses) {
    var html = "";
    if (ref && verses && verses.length) {
      html += '<div class="cvr-block"><h3>Qurʾān · ' + esc(ref.ch) + " (uthmani · API)</h3>";
      verses.forEach(function (v) {
        var key = v.verse_key || ref.ch + ":" + (v.verse_number || "");
        html +=
          '<p class="cvr-ar" lang="ar" dir="rtl">' +
          esc(v.text_uthmani || "") +
          "</p>" +
          '<p><a href="https://quran.com/' +
          esc(String(key).replace(":", "/")) +
          '" target="_blank" rel="noopener">' +
          esc(key) +
          " · open on Quran.com</a></p>";
      });
      html +=
        '<p class="cvr-stamp">Arabic text via api.quran.com — verify recitation and meaning with a teacher</p></div>';
    }
    var hints = localHints(q);
    hints.forEach(function (h) {
      html +=
        '<div class="cvr-block"><h3>' +
        esc(h.title) +
        "</h3><p>" +
        esc(h.body) +
        '</p><p><a href="' +
        esc(h.href) +
        '">Open</a></p></div>';
    });
    html += '<div class="cvr-block"><h3>Research outward (allowlisted)</h3>';
    allowlistedLinks(q).forEach(function (l) {
      html += '<a href="' + esc(l.href) + '" target="_blank" rel="noopener">' + esc(l.label) + "</a> ";
    });
    html +=
      '<p class="cvr-stamp">External sites open in a new tab. Clarity does not scrape private data or issue rulings.</p></div>';
    html +=
      '<p class="cvr-stamp"><strong>Not a fatwa · not a scholar · not a grade of īmān.</strong> Prefer a local teacher for practice and rulings.</p>';
    host.innerHTML = html;
  }

  function runQuery(q, out) {
    q = String(q || "").trim();
    if (!q) {
      out.innerHTML = '<p class="cvr-err">Enter a short question, topic, or verse key (e.g. 112:1).</p>';
      return;
    }
    out.innerHTML = '<p class="cvr-lead">Researching on-device + allowlisted sources…</p>';
    var ref = parseRef(q);
    if (ref && ref.ch >= 1 && ref.ch <= 114) {
      fetchUthmani(ref.ch)
        .then(function (data) {
          var all = (data && data.verses) || [];
          var slice = all.filter(function (v, i) {
            var n = v.verse_number || i + 1;
            return n >= ref.from && n <= ref.to;
          });
          if (!slice.length) slice = all.slice(0, Math.min(7, all.length));
          renderResults(out, q, ref, slice);
        })
        .catch(function () {
          renderResults(out, q, ref, []);
          out.insertAdjacentHTML(
            "afterbegin",
            '<p class="cvr-err">Qurʾān API unreachable — use Quran.com links below.</p>'
          );
        });
    } else {
      renderResults(out, q, null, null);
    }
  }

  function mount() {
    if (!onVleSurface()) return;
    if (d.getElementById("cu-vle-research")) return;
    ensureCss();
    var sec = d.createElement("section");
    sec.id = "cu-vle-research";
    sec.className = "cu-vle-research";
    sec.setAttribute("data-clarity-owned", "vle-research-v1");
    sec.innerHTML =
      '<div class="cvr-card">' +
      '<p class="cvr-kicker">VLE research desk · educational</p>' +
      "<h2>Ask · search · verify</h2>" +
      '<p class="cvr-lead">Look up a verse key (e.g. <strong>112:1</strong>), a short sūrah name, or a study topic. Answers are <strong>research aids</strong> from allowlisted sources — not a fatwa.</p>' +
      '<form class="cvr-row" id="cvr-form">' +
      '<input type="search" id="cvr-q" name="q" placeholder="112:1 · Ikhlas · prayer · tawḥīd" autocomplete="off" />' +
      '<button type="submit" class="cvr-go">Research</button>' +
      "</form>" +
      '<div class="cvr-out" id="cvr-out"></div>' +
      "</div>";
    var main = d.querySelector("main") || d.body;
    var hud = d.getElementById("cu-vle-hud");
    if (hud && hud.parentNode) hud.parentNode.insertBefore(sec, hud.nextSibling);
    else {
      var h1 = main.querySelector("h1, h2");
      if (h1 && h1.parentNode) h1.parentNode.insertBefore(sec, h1.nextSibling);
      else main.insertBefore(sec, main.firstChild);
    }
    var form = d.getElementById("cvr-form");
    var input = d.getElementById("cvr-q");
    var out = d.getElementById("cvr-out");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      runQuery(input.value, out);
    });
  }

  function boot() {
    try {
      mount();
    } catch (e) {}
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 400);
})(window, document);
