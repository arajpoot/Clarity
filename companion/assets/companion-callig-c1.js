/*! companion-callig-c1.js · Phase C
 * Calligraphy practice bridge on Action · pad lives in Craft
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_CALLIG_C1__) return;
  w.__CLARITY_CALLIG_C1__ = true;

  var LINES = [
    { ar: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", en: "In the name of Allah, the Entirely Merciful, the Especially Merciful.", tip: "Basmala · start of the path" },
    { ar: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", en: "All praise is due to Allah, Lord of the worlds.", tip: "Al-Fātiḥah · praise" },
    { ar: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", en: "Glory be to Allah and praise be to Him.", tip: "Dhikr · short hand practice" },
    { ar: "لَا إِلَٰهَ إِلَّا اللَّهُ", en: "There is no deity except Allah.", tip: "Tawḥīd · clear letter shapes" }
  ];
  var KEY = "clarity_callig_c1";

  function $(id) { return d.getElementById(id); }

  function mount() {
    if ($("callig-c1-card")) return;
    var host =
      $("tj-deep-studio") ||
      $("tajweed-path-card") ||
      $("tajweed-live-card") ||
      d.querySelector("[data-rrra='action']");
    if (!host) return;
    var i = 0;
    try { i = parseInt(w.localStorage.getItem(KEY) || "0", 10) || 0; } catch (e) {}
    var card = d.createElement("div");
    card.id = "callig-c1-card";
    card.className = "card";
    card.setAttribute("data-rrra", "action");
    card.setAttribute("style", "border-top:3px solid var(--gold,#e0c36a);margin:1rem 0;padding:.85rem 1rem;border-radius:14px");
    function paint() {
      var L = LINES[((i % LINES.length) + LINES.length) % LINES.length];
      card.innerHTML =
        "<h2 style=\"margin:.1rem 0 .35rem\">✍️ Calligraphy practice bridge</h2>" +
        "<p class=\"td-src\" style=\"margin:0 0 .5rem\">Trace on paper or open the Craft pad. Educational only — not a fatwa.</p>" +
        '<p dir="rtl" lang="ar" style="font-size:1.55rem;line-height:1.9;font-family:Amiri,Scheherazade New,serif;margin:.25rem 0">' +
        L.ar +
        "</p>" +
        '<p style="font-size:.9rem;opacity:.9">' + L.en + "</p>" +
        '<p class="td-src">' + L.tip + "</p>" +
        '<div style="display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.5rem">' +
        '<button type="button" class="btn-soft" data-callig-next>Next line</button>' +
        '<a class="btn" href="/craft/calligraphy/">Open Craft · Calligraphy pad</a>' +
        "</div>";
    }
    paint();
    card.addEventListener("click", function (ev) {
      if (ev.target && ev.target.getAttribute && ev.target.getAttribute("data-callig-next") != null) {
        i = (i + 1) % LINES.length;
        try { w.localStorage.setItem(KEY, String(i)); } catch (e2) {}
        paint();
      }
    });
    host.parentNode.insertBefore(card, host.nextSibling);
  }

  function boot() { mount(); }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 500);
})(window, document);
