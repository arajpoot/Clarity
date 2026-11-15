/*! companion-hadith-governance-v1 · grade · collection · number mandatory on ḥadīth sparks
 * Educational only — not a fatwa. Verify on Sunnah.com / with a scholar.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_HADITH_GOV_V1__) return;
  w.__COMPANION_HADITH_GOV_V1__ = true;

  var SPARKS = [
    {
      t: "Actions are but by intention, and every person will have but that which they intended.",
      grade: "Ṣaḥīḥ",
      collection: "Bukhārī",
      number: "1",
      also: "Muslim 1907"
    },
    {
      t: "None of you truly believes until he loves for his brother what he loves for himself.",
      grade: "Ṣaḥīḥ",
      collection: "Bukhārī",
      number: "13",
      also: "Muslim 45"
    },
    {
      t: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.",
      grade: "Ṣaḥīḥ",
      collection: "Bukhārī",
      number: "6475",
      also: "Muslim 47"
    },
    {
      t: "The strong person is not the one who overcomes people by his strength, but the one who controls himself while angry.",
      grade: "Ṣaḥīḥ",
      collection: "Bukhārī",
      number: "6114",
      also: "Muslim 2609"
    },
    {
      t: "Make things easy and do not make them difficult; give glad tidings and do not drive people away.",
      grade: "Ṣaḥīḥ",
      collection: "Bukhārī",
      number: "69",
      also: "Muslim 1734"
    }
  ];

  function cite(h) {
    var line = h.grade + " · " + h.collection + " " + h.number;
    if (h.also) line += " · also " + h.also;
    return line + " · verify on Sunnah.com · educational only — not a fatwa";
  }

  function paintInto(host, h) {
    if (!host) return;
    host.innerHTML =
      '<p class="hadith-text" style="line-height:1.5;margin:0.35rem 0">' +
      h.t +
      "</p>" +
      '<p class="hadith-cite td-src" style="font-size:0.82rem;margin:0.25rem 0 0"><strong>' +
      h.grade +
      "</strong> · " +
      h.collection +
      " " +
      h.number +
      (h.also ? " · " + h.also : "") +
      " · verify on Sunnah.com · educational only — not a fatwa</p>";
  }

  var idx = Math.floor(Date.now() / 86400000) % SPARKS.length;

  function loadHadith() {
    idx = (idx + 1) % SPARKS.length;
    var host = d.querySelector("#cs-mount #hadith") || d.getElementById("hadith");
    paintInto(host, SPARKS[idx]);
  }

  w.loadHadith = loadHadith;

  function bindMounted() {
    var root = d.getElementById("cs-mount") || d;
    var host = root.querySelector("#hadith");
    if (host) {
      paintInto(host, SPARKS[idx]);
      var btn = host.parentElement && host.parentElement.querySelector("button[onclick*='loadHadith']");
      if (btn && !btn.__gov) {
        btn.__gov = true;
        btn.addEventListener("click", function (ev) {
          ev.preventDefault();
          loadHadith();
        });
      }
    }
    // data-engine hadith
    root.querySelectorAll("[data-engine='hadith']").forEach(function (eng) {
      var t = eng.querySelector("[data-hadith-text]");
      var s = eng.querySelector("[data-hadith-src]");
      var h = SPARKS[idx];
      if (t) t.textContent = h.t;
      if (s) s.textContent = cite(h);
    });
  }

  function boot() {
    bindMounted();
    var mount = d.getElementById("cs-mount");
    if (mount && typeof MutationObserver !== "undefined") {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(bindMounted, 40);
      }).observe(mount, { childList: true, subtree: false });
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
