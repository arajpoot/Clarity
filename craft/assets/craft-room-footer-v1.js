/*! craft-room-footer-v1 · C21F3
 * Upgrades any footer.craft-footer into shared niyyah footer.
 * Station label from data-craft-station or path. Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_ROOM_FOOTER_V1__) return;
  w.__CRAFT_ROOM_FOOTER_V1__ = true;

  var STATIONS = {
    "/craft/": { id: "hub", label: "Atelier hub", current: "craft" },
    "/craft/meme": { id: "meme", label: "Meme Studio", current: "craft" },
    "/craft/tajweed": { id: "tajweed", label: "Tajweed Deep Studio", current: "craft" },
    "/craft/calligraphy": { id: "calligraphy", label: "Calligraphy Pad", current: "craft" },
    "/craft/quiz": { id: "quiz", label: "Sharia IQ · Quiz", current: "craft" },
    "/craft/notes": { id: "notes", label: "Craft Notes", current: "craft" },
    "/craft/institute": { id: "institute", label: "Dawah Vocational Institute", current: "craft" }
  };

  function resolve() {
    var path = (location.pathname || "/craft/").replace(/\/+$/, "") || "/craft";
    if (path === "/craft") path = "/craft/";
    // normalize /craft/meme/ → /craft/meme
    var key = path.replace(/\/$/, "");
    if (key === "/craft") key = "/craft/";
    for (var k in STATIONS) {
      if (k === "/craft/") {
        if (path === "/craft/" || path === "/craft") return STATIONS[k];
      } else if (path.indexOf(k) === 0) return STATIONS[k];
    }
    return { id: "craft", label: "Craft", current: "craft" };
  }

  function buildLabel(station) {
    var meta = d.querySelector('meta[name="clarity-build"]');
    var build = meta ? meta.getAttribute("content") || "C21F3" : "C21F3";
    return "Clarity Craft · " + station.label + " · " + build;
  }

  function markup(station) {
    return (
      '<div class="caf-band">' +
      '  <div class="caf-inner">' +
      '    <p class="caf-niyyah" lang="ar" dir="rtl">وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ</p>' +
      '    <p class="caf-mission">Built as a quiet companion for the path — five rooms, on-device where it matters, for the sake of Allāh alone. Not a product pitch. Not a fatwa desk. If it helps one person remember, that is enough.</p>' +
      '    <p class="caf-bench">' +
      station.label +
      " · self-contained bench</p>" +
      '    <nav class="caf-rooms" aria-label="Clarity rooms">' +
      '      <a href="/">Port</a>' +
      '      <a href="/companion/">Companion</a>' +
      '      <a href="/daily/">Yawm</a>' +
      '      <a href="/campus/">Campus</a>' +
      '      <a href="/amana/">Amānah</a>' +
      '      <a href="/craft/" aria-current="page">Craft</a>' +
      "    </nav>" +
      '    <p class="caf-sources">Sources: <a href="https://quran.com" target="_blank" rel="noopener">Quran.com</a> · <a href="https://sunnah.com" target="_blank" rel="noopener">Sunnah.com</a></p>' +
      '    <p class="caf-stamp">Educational only — not a fatwa · not legal advice · verify with a teacher you trust · private data stays on this device unless you export it</p>' +
      '    <p class="caf-build">' +
      buildLabel(station) +
      "</p>" +
      "  </div>" +
      "</div>"
    );
  }

  function upgrade() {
    var foot = d.querySelector("footer.craft-footer, footer.clarity-app-footer");
    if (!foot) {
      foot = d.createElement("footer");
      foot.className = "craft-footer";
      d.body.appendChild(foot);
    }
    if (foot.getAttribute("data-caf-wired") === "1") return;
    foot.setAttribute("data-caf-wired", "1");
    foot.className = "craft-footer clarity-app-footer clarity-app-footer--niyyah";
    foot.setAttribute("data-clarity-footer", "niyyah-v1");
    foot.setAttribute("role", "contentinfo");
    var station = resolve();
    foot.innerHTML = markup(station);
  }

  function boot() {
    try {
      upgrade();
    } catch (e) {}
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 300);
})(window, document);
