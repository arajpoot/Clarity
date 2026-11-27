/*! companion-tajweed-daily-b1.js · Phase B
 * Daily tajweed module filler + LMR/Craft bridge + empty-rule soft fill
 * Educational only — not a fatwa · not a qāriʾ certificate
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_TAJWEED_DAILY_B1__) return;
  w.__CLARITY_TAJWEED_DAILY_B1__ = true;

  var KEY = "clarity_tj_daily_b1";
  var RULES = [
    {
      title: "Ikhfāʾ — hide the nūn",
      body: "When nūn sākinah or tanwīn is followed by one of the ikhfāʾ letters, the nūn is concealed with a light ghunnah. Practice slowly; seek a teacher for correction.",
      src: "Rule family · ikhfāʾ (Hafs)",
      href: "https://www.abouttajweed.com"
    },
    {
      title: "Idghām — merge with ghunnah",
      body: "With yāʾ, nūn, mīm, wāw (ي ن م و), nūn sākinah/tanwīn merges with ghunnah. Lām and rāʾ merge without ghunnah. Hear the difference in a master recording.",
      src: "Rule family · idghām",
      href: "https://www.abouttajweed.com"
    },
    {
      title: "Iẓhār — clear nūn",
      body: "Before the throat letters, nūn sākinah and tanwīn are pronounced clearly without ghunnah. Do not hide what should be shown.",
      src: "Rule family · iẓhār",
      href: "https://www.abouttajweed.com"
    },
    {
      title: "Qalqalah — echo on stop",
      body: "Letters ق ط ب ج د carry a light bounce when sākin. Keep it controlled — not a full vowel.",
      src: "Rule family · qalqalah",
      href: "https://www.abouttajweed.com"
    },
    {
      title: "Madd ṭabīʿī — natural stretch",
      body: "Alif, wāw, and yāʾ madd letters stretch two counts when the conditions are met. Count calmly; rushing breaks the measure.",
      src: "Rule family · madd",
      href: "https://www.abouttajweed.com"
    },
    {
      title: "Makhārij — point of exit",
      body: "Each letter has a home in the throat, tongue, lips, or nasal passage. One careful letter a day beats racing a page.",
      src: "Makhārij map · practice in Deep Studio",
      href: "#tj-makharij-panel"
    },
    {
      title: "Ghunnah — nasal quality",
      body: "Nūn and mīm carry ghunnah in defined rules. Hold the nasal sound steadily for the taught length — neither cut short nor stretched without basis.",
      src: "Rule family · ghunnah",
      href: "https://www.abouttajweed.com"
    },
    {
      title: "Adab of correction",
      body: "Self-check tools are helpers only. A qualified teacher remains the standard for certification. Practice with humility.",
      src: "Adab · educational only",
      href: "/craft/tajweed/"
    }
  ];

  function $(id) {
    return d.getElementById(id);
  }

  function loadIdx() {
    try {
      return parseInt(w.localStorage.getItem(KEY) || "0", 10) || 0;
    } catch (e) {
      return 0;
    }
  }
  function saveIdx(i) {
    try {
      w.localStorage.setItem(KEY, String(i));
    } catch (e) {}
  }

  function render(i) {
    i = ((i % RULES.length) + RULES.length) % RULES.length;
    saveIdx(i);
    var r = RULES[i];
    if ($("tajweed-live-title")) $("tajweed-live-title").textContent = r.title;
    if ($("tajweed-live-body")) $("tajweed-live-body").textContent = r.body;
    if ($("tajweed-live-src")) {
      $("tajweed-live-src").innerHTML =
        '<a href="' +
        r.href +
        '" target="_blank" rel="noopener">' +
        r.src +
        "</a> · <span class=\"edu\">Educational only — not a fatwa · not a qāriʾ grade</span> " +
        '<button type="button" class="btn-soft" style="font-size:.72rem;padding:.2rem .5rem;margin-left:.35rem" data-tj-daily-next>↻ New module</button>';
    }
  }

  w.clarityLiveTajweed = function (advance) {
    var i = loadIdx();
    if (advance) i += 1;
    render(i);
  };

  function ensureBridgeNote() {
    var host = $("tj-lmr-panel") || $("tj-deep-studio") || $("tajweed-live-card");
    if (!host || $("tj-b1-craft-bridge")) return;
    var p = d.createElement("p");
    p.id = "tj-b1-craft-bridge";
    p.className = "td-src";
    p.style.marginTop = "0.55rem";
    p.innerHTML =
      'Full Listen · Match · Record atelier: <a href="/craft/tajweed/" rel="noopener"><strong>Open Craft · Tajweed Deep Studio</strong></a> · on-device practice · educational only — not a fatwa.';
    host.appendChild(p);
  }

  function softFillRules() {
    var grid = $("tj-rule-grid");
    var empty = $("tj-rule-empty");
    if (!grid) return;
    if (grid.children && grid.children.length > 0) {
      if (empty) empty.style.display = "none";
      return;
    }
    RULES.slice(0, 5).forEach(function (r, idx) {
      var det = d.createElement("details");
      det.className = "tj-rule-tile";
      det.innerHTML =
        "<summary>" +
        r.title +
        "</summary><p style=\"font-size:.9rem;line-height:1.45\">" +
        r.body +
        '</p><p class="td-src">' +
        r.src +
        " · educational only</p>";
      grid.appendChild(det);
    });
    if (empty) empty.style.display = "none";
  }

  function bind() {
    if ($("tajweed-live-card")) {
      var i = loadIdx();
      render(i);
    }
    d.addEventListener(
      "click",
      function (ev) {
        var t = ev.target;
        if (!t || !t.closest) return;
        if (t.closest("[data-tj-daily-next]") || (t.closest && t.closest("button") && /New module/i.test(t.textContent || ""))) {
          if (t.closest("#tajweed-live-card") || t.closest("[data-tj-daily-next]")) {
            w.clarityLiveTajweed(true);
          }
        }
      },
      true
    );
    ensureBridgeNote();
    softFillRules();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", bind);
  else bind();
  setTimeout(bind, 400);
  setTimeout(bind, 1500);
})(window, document);
