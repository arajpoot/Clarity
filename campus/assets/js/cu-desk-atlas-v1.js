/*! cu-desk-atlas-v1 · U27
 * Surfaces ordered stages + classic desk shelves on /campus/desk/
 * Educational only — not a fatwa · not a grade of īmān
 */
(function (w, d) {
  "use strict";
  if (w.__CU_DESK_ATLAS_V1__) return;
  w.__CU_DESK_ATLAS_V1__ = true;

  function isDeskHub() {
    var p = (location.pathname || "").replace(/\/+$/, "");
    return p === "/campus/desk";
  }

  function ensure() {
    if (d.getElementById("cu-desk-atlas")) return;
    var sec = d.createElement("section");
    sec.id = "cu-desk-atlas";
    sec.className = "cu-desk-atlas";
    sec.setAttribute("data-clarity-owned", "desk-atlas-v1");
    sec.setAttribute("aria-label", "Desk atlas");
    sec.innerHTML =
      '<p class="cda-kicker">Desk atlas</p>' +
      '<h2 class="cda-title">Two maps · one path</h2>' +
      '<p class="cda-lead">The ordered stages unlock in sequence. The classic shelves stay available as study rooms under the desk — educational only, not a grade of īmān.</p>' +
      '<div class="cda-layer">' +
      "  <h3>Ordered path · stages</h3>" +
      "  <p>One module open at a time. Finish the stage honestly before the next unlocks.</p>" +
      '  <div class="cda-grid">' +
      '    <a class="cda-card" href="/campus/desk/seeker/"><span class="cda-ar" lang="ar" dir="rtl">طالب</span><span class="cda-name">1 · Seeker</span><span class="cda-desc">Essentials · tawḥīd map · open the door with humility</span></a>' +
      '    <a class="cda-card" href="/campus/desk/practice/"><span class="cda-ar" lang="ar" dir="rtl">عمل</span><span class="cda-name">2 · Practice</span><span class="cda-desc">Foundations · purification · prayer essentials</span></a>' +
      '    <a class="cda-card" href="/campus/desk/consistency/"><span class="cda-ar" lang="ar" dir="rtl">ثبات</span><span class="cda-name">3 · Consistency</span><span class="cda-desc">Steady habits · review · stay after the day</span></a>' +
      '    <a class="cda-card" href="/campus/desk/transmission/"><span class="cda-ar" lang="ar" dir="rtl">تبليغ</span><span class="cda-name">4 · Transmission</span><span class="cda-desc">Share with adab · teach-back, not arguing</span></a>' +
      "  </div>" +
      "</div>" +
      '<div class="cda-layer">' +
      "  <h3>Classic shelves · always on the map</h3>" +
      "  <p>Legacy desk rooms still live under this path. Open when you need that shelf — they do not replace the ordered stages.</p>" +
      '  <div class="cda-grid">' +
      '    <a class="cda-card" href="/campus/desk/foundation/"><span class="cda-name">Foundation of Īmān</span><span class="cda-desc">Ikhlāṣ · Ḥadīth Jibrīl · belief map</span></a>' +
      '    <a class="cda-card" href="/campus/desk/pillars/"><span class="cda-name">Pillars of practice</span><span class="cda-desc">Wuḍūʾ · ṣalāh essentials · practice focus</span></a>' +
      '    <a class="cda-card" href="/campus/desk/ihsan/"><span class="cda-name">Path of iḥsān</span><span class="cda-desc">Excellence · presence · refine the craft</span></a>' +
      '    <a class="cda-card" href="/campus/desk/amanah/"><span class="cda-name">Amānah of knowledge</span><span class="cda-desc">Trust of what you learn · not the Amānah room vault</span></a>' +
      "  </div>" +
      "</div>" +
      '<nav class="cda-halls" aria-label="Nearby halls">' +
      '  <a href="/campus/faculty/">Faculty</a>' +
      '  <a href="/campus/grading/">Progress</a>' +
      '  <a href="/campus/lab/">Lab</a>' +
      '  <a href="/campus/library/">Library</a>' +
      '  <a href="/campus/journey/">Journey</a>' +
      '  <a href="/campus/portal/">Portal</a>' +
      '  <a href="/campus/">Campus home</a>' +
      "</nav>" +
      '<p class="cda-intent">Intention: seek benefit, act on what you learn, and ask a living teacher when a matter is heavy.</p>' +
      '<p class="cda-stamp">Educational only — not a fatwa · not a grade of īmān · not a seminary · progress stays on this device</p>';

    var main = d.querySelector("main") || d.body;
    var h1 = main.querySelector("h1, h2");
    // Prefer after lead paragraph under Desk title
    var lead = null;
    if (h1) {
      var n = h1.nextElementSibling;
      while (n && n.tagName !== "P") n = n.nextElementSibling;
      lead = n;
    }
    if (lead && lead.parentNode) {
      lead.parentNode.insertBefore(sec, lead.nextSibling);
    } else if (h1 && h1.parentNode) {
      h1.parentNode.insertBefore(sec, h1.nextSibling);
    } else {
      main.insertBefore(sec, main.firstChild);
    }
  }

  function fixLegacyLinks() {
    d.querySelectorAll('a[href="/campus/faculty.html"]').forEach(function (a) {
      a.setAttribute("href", "/campus/faculty/");
    });
    d.querySelectorAll('a[href="/campus/grading.html"]').forEach(function (a) {
      a.setAttribute("href", "/campus/grading/");
    });
  }

  function boot() {
    if (!isDeskHub()) return;
    try {
      ensure();
      fixLegacyLinks();
    } catch (e) {}
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 200);
})(window, document);
