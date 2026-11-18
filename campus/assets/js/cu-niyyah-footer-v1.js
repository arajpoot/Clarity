/*! cu-niyyah-footer-v1 · U23
 * University-specific niyyah footer on all Campus pages.
 * Educational only — not a fatwa · not a grade of īmān · not a seminary.
 */
(function (w, d) {
  "use strict";
  if (w.__CU_NIYYAH_FOOTER_V1__) return;
  w.__CU_NIYYAH_FOOTER_V1__ = true;

  var HALLS = {
    "/campus/": "University · admission",
    "/campus/desk": "Seeker desk",
    "/campus/portal": "Student portal",
    "/campus/journey": "Journey map",
    "/campus/faculty": "Faculty",
    "/campus/grading": "Progress mirror",
    "/campus/lab": "Laboratory",
    "/campus/library": "Library",
    "/campus/orientation": "Orientation"
  };

  function hallLabel() {
    var path = (location.pathname || "/campus/").replace(/\/+$/, "") || "/campus";
    if (path === "/campus") return HALLS["/campus/"];
    for (var k in HALLS) {
      if (k !== "/campus/" && path.indexOf(k) === 0) return HALLS[k];
    }
    return "University room";
  }

  function buildMeta() {
    var m = d.querySelector('meta[name="clarity-build"]');
    return m ? m.getAttribute("content") || "U23" : "U23";
  }

  function markup() {
    return (
      '<div class="cuf-band">' +
      '  <div class="cuf-inner">' +
      '    <p class="cuf-ayah" lang="ar" dir="rtl">وَقُل رَّبِّ زِدْنِي عِلْمًا</p>' +
      '    <p class="cuf-ayah-ref">Qur’an 20:114 · <a href="https://quran.com/20/114" target="_blank" rel="noopener">quran.com/20/114</a></p>' +
      '    <p class="cuf-mission">Clarity University is an <strong>ordered path on this device</strong> — stages, practice, and a study mirror — not a campus certificate, not a fatwa desk, not a grade of īmān. Knowledge is sought for Allāh; teachers of flesh and blood remain the guide.</p>' +
      '    <p class="cuf-stages">Seeker → Practice → Consistency → Transmission · ' +
      hallLabel() +
      "</p>" +
      '    <nav class="cuf-rooms" aria-label="Clarity rooms">' +
      '      <a href="/">Port</a>' +
      '      <a href="/companion/">Companion</a>' +
      '      <a href="/daily/">Yawm</a>' +
      '      <a href="/campus/" aria-current="page">University</a>' +
      '      <a href="/amana/">Amānah</a>' +
      '      <a href="/craft/">Craft</a>' +
      "    </nav>" +
      '    <p class="cuf-sources">Sources: <a href="https://quran.com" target="_blank" rel="noopener">Quran.com</a> · <a href="https://sunnah.com" target="_blank" rel="noopener">Sunnah.com</a></p>' +
      '    <p class="cuf-stamp">Educational only — not a fatwa · not a grade of īmān · not legal advice · progress stays on this device unless you export it</p>' +
      '    <p class="cuf-build">Clarity University · ' +
      buildMeta() +
      "</p>" +
      "  </div>" +
      "</div>"
    );
  }

  function upgrade() {
    var foot =
      d.querySelector("footer.cu-foot") ||
      d.querySelector("footer.cu-niyyah-footer") ||
      d.querySelector("footer.craft-footer");
    if (!foot) {
      foot = d.createElement("footer");
      d.body.appendChild(foot);
    }
    if (foot.getAttribute("data-cuf-wired") === "1") return;
    foot.setAttribute("data-cuf-wired", "1");
    foot.className = "cu-foot cu-niyyah-footer";
    foot.setAttribute("role", "contentinfo");
    foot.innerHTML = markup();
  }

  function boot() {
    try {
      upgrade();
    } catch (e) {}
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 350);
})(window, document);
