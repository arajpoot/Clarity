/*! companion-banner-f1.js · Phase F selective
 * Hijri label + Rabbana rotator · no heavy live docks on critical path
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_BANNER_F1__) return;
  w.__CLARITY_BANNER_F1__ = true;

  var RABBANA = [
    { ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً", en: "Our Lord, give us good in this world…", ref: "Qur’an 2:201" },
    { ar: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا", en: "Our Lord, let not our hearts deviate…", ref: "Qur’an 3:8" },
    { ar: "رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا", en: "Our Lord, forgive us our sins…", ref: "Qur’an 3:147" },
    { ar: "رَبِّ زِدْنِي عِلْمًا", en: "My Lord, increase me in knowledge.", ref: "Qur’an 20:114" }
  ];

  function hijriApprox() {
    try {
      return new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(new Date());
    } catch (e) {
      return "Hijri date · device";
    }
  }

  function mount() {
    if (d.getElementById("banner-f1")) return;
    var host =
      d.querySelector(".cs-path-grid") ||
      d.querySelector("header") ||
      d.getElementById("cs-mount") ||
      d.body;
    var el = d.createElement("div");
    el.id = "banner-f1";
    el.setAttribute(
      "style",
      "margin:.5rem auto;max-width:42rem;padding:.55rem .75rem;border-radius:12px;border:1px solid rgba(201,162,39,.28);background:rgba(8,14,24,.45);font-size:.88rem"
    );
    var i = Math.floor(Math.random() * RABBANA.length);
    function paint() {
      var r = RABBANA[i % RABBANA.length];
      el.innerHTML =
        '<p style="margin:0;font-size:.75rem;opacity:.85">📅 ' +
        hijriApprox() +
        " · selective banner · educational only</p>" +
        '<p dir="rtl" lang="ar" style="margin:.25rem 0;font-family:Amiri,serif;font-size:1.05rem">' +
        r.ar +
        "</p>" +
        "<p style=\"margin:0;opacity:.9\">" +
        r.en +
        " <span class=\"td-src\">(" +
        r.ref +
        ")</span></p>" +
        '<button type="button" class="btn-soft" data-f1-next style="margin-top:.35rem;font-size:.75rem">Next duʿāʾ</button>';
    }
    paint();
    el.addEventListener("click", function (ev) {
      if (ev.target && ev.target.getAttribute("data-f1-next") != null) {
        i = (i + 1) % RABBANA.length;
        paint();
      }
    });
    if (host.parentNode && host !== d.body) host.parentNode.insertBefore(el, host);
    else host.insertBefore(el, host.firstChild);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", mount);
  else mount();
  setTimeout(mount, 300);
})(window, document);
