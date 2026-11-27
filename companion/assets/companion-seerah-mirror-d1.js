/*! companion-seerah-mirror-d1.js · Phase D · Mirror steps + tap sources
 * Never leave "Loading…" · Qurʾān + Sunnah links · educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_SEERAH_MIRROR_D1__) return;
  w.__CLARITY_SEERAH_MIRROR_D1__ = true;

  var KEY = "clarity_seerah_mirror_v1";
  var STEPS = [
    {
      title: "Truthfulness (ṣidq)",
      moment: "He ﷺ was known as al-Amīn before prophethood. Truthfulness is a character path, not a slogan.",
      sources: [
        { label: "Sunnah · truthfulness", href: "https://sunnah.com/search?q=truthfulness" },
        { label: "Qurʾān 9:119", href: "https://quran.com/9/119" }
      ],
      prompt: "Where did I shade the truth this week? What would full honesty cost — and repair look like?"
    },
    {
      title: "Mercy in strength",
      moment: "Mercy to family and the weak is Prophetic character. Strength without mercy is not the model of the Messenger ﷺ.",
      sources: [
        { label: "Qurʾān 21:107", href: "https://quran.com/21/107" },
        { label: "Sunnah · mercy", href: "https://sunnah.com/search?q=mercy" }
      ],
      prompt: "Whom can I show quiet mercy to today without announcing it?"
    },
    {
      title: "Patience (ṣabr)",
      moment: "Patience is named throughout the Qurʾān as a companion of certainty. Hardship is not proof of abandonment.",
      sources: [
        { label: "Qurʾān 2:153", href: "https://quran.com/2/153" },
        { label: "Sunnah · patience", href: "https://sunnah.com/search?q=patience" }
      ],
      prompt: "What am I rushing that needs ṣabr instead of complaint?"
    },
    {
      title: "Forgiving when able",
      moment: "Pardon is praised when one has power to retaliate. This is a mirror, not a fatwa on your legal rights.",
      sources: [
        { label: "Qurʾān 24:22", href: "https://quran.com/24/22" },
        { label: "Qurʾān 3:134", href: "https://quran.com/3/134" }
      ],
      prompt: "Is there a grudge I can lighten for Allah’s sake — without denying justice where due?"
    },
    {
      title: "Remembering death",
      moment: "Frequent remembrance of death softens the heart. Prefer Qurʾān, death awareness, and istighfār over empty night noise.",
      sources: [
        { label: "Sunnah · remember death", href: "https://sunnah.com/search?q=remember%20death" },
        { label: "Qurʾān 3:185", href: "https://quran.com/3/185" }
      ],
      prompt: "If I died tonight, what unfinished obedience would I regret?"
    },
    {
      title: "Private istighfār",
      moment: "Seeking forgiveness in the quiet of night is a known door. Quiet repentance beats public performance.",
      sources: [
        { label: "Qurʾān 3:17", href: "https://quran.com/3/17" },
        { label: "Sunnah · istighfār", href: "https://sunnah.com/search?q=istighfar" }
      ],
      prompt: "Can I set one private istighfār slot before sleep?"
    },
    {
      title: "Convey, do not invent",
      moment: "The message is conveyance of what was revealed — not inventing a third source. Share with adab and attribution.",
      sources: [
        { label: "Qurʾān 5:67", href: "https://quran.com/5/67" },
        { label: "Sunnah.com", href: "https://sunnah.com" }
      ],
      prompt: "Before I share a ‘benefit’, can I name a reliable source?"
    },
    {
      title: "Gentle teaching",
      moment: "He ﷺ taught with patience and clarity. Harshness that drives people away is not the Prophetic classroom.",
      sources: [
        { label: "Qurʾān 3:159", href: "https://quran.com/3/159" },
        { label: "Sunnah · kindness", href: "https://sunnah.com/search?q=kindness" }
      ],
      prompt: "Where can I replace a sharp tone with a clearer, gentler one?"
    }
  ];

  function $(id) {
    return d.getElementById(id);
  }
  function load() {
    try {
      return JSON.parse(w.localStorage.getItem(KEY) || "{}") || {};
    } catch (e) {
      return {};
    }
  }
  function save(st) {
    try {
      w.localStorage.setItem(KEY, JSON.stringify(st));
    } catch (e) {}
  }

  function render(i) {
    i = ((i % STEPS.length) + STEPS.length) % STEPS.length;
    var step = STEPS[i];
    var st = load();
    st.i = i;
    save(st);
    if ($("sm-title")) $("sm-title").textContent = step.title;
    if ($("sm-moment")) $("sm-moment").textContent = step.moment;
    if ($("sm-prompt")) $("sm-prompt").textContent = step.prompt;
    if ($("sm-src")) {
      var html = step.sources
        .map(function (s) {
          return (
            '<a class="phase3-cite" href="' +
            s.href +
            '" target="_blank" rel="noopener">' +
            s.label +
            "</a>"
          );
        })
        .join(" · ");
      $("sm-src").innerHTML = html + ' · <span class="edu">Educational only — not a fatwa</span>';
    }
    if ($("sm-link") && step.sources[0]) {
      $("sm-link").href = step.sources[0].href;
      $("sm-link").textContent = "Open source";
    }
    var done = (st.done || []).length;
    if ($("sm-progress-text"))
      $("sm-progress-text").textContent = done + " / " + STEPS.length + " steps marked on this device";
    if ($("sm-prog-fill"))
      $("sm-prog-fill").style.width = Math.round((done / STEPS.length) * 100) + "%";
  }

  function install() {
    if (!$("seerah-mirror-card") && !$("sm-title")) return false;
    w.claritySeerahMirrorNext = function () {
      var st = load();
      render((st.i | 0) + 1);
    };
    w.claritySeerahMirrorNext.__d1 = true;
    w.claritySeerahMirrorDone = function () {
      var st = load();
      var i = st.i | 0;
      st.done = st.done || [];
      if (st.done.indexOf(i) < 0) st.done.push(i);
      save(st);
      w.claritySeerahMirrorNext();
    };
    w.claritySeerahMirrorNote = function () {
      var t = ($("sm-title") && $("sm-title").textContent) || "Seerah mirror";
      var p = ($("sm-prompt") && $("sm-prompt").textContent) || "";
      try {
        var notes = JSON.parse(w.localStorage.getItem("clarity_notes_v1") || "[]");
        if (!Array.isArray(notes)) notes = [];
        notes.unshift({ t: Date.now(), title: "Mirror · " + t, body: p });
        w.localStorage.setItem("clarity_notes_v1", JSON.stringify(notes.slice(0, 50)));
      } catch (e) {}
    };
    var st = load();
    render(st.i | 0);
    /* force replace Loading… */
    if ($("sm-title") && /loading/i.test($("sm-title").textContent || "")) render(0);
    return true;
  }

  function boot() {
    install();
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 200);
  setTimeout(boot, 800);
  setTimeout(boot, 2500);
})(window, document);
