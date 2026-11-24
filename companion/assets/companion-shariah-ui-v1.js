/*! companion-shariah-ui-v1 · P1G · educational stamps · not a fatwa */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_SHARIAH_UI_V1__) return;
  w.__COMPANION_SHARIAH_UI_V1__ = true;

  var STAMP = "Educational only — not a fatwa. Verify with Qur'an, Sunnah, and a qualified teacher.";

  function ensureBismillah() {
    if (d.getElementById("cs-bismillah-bar")) return;
    var bar = d.createElement("div");
    bar.id = "cs-bismillah-bar";
    bar.className = "cs-bismillah-bar";
    bar.setAttribute("lang", "ar");
    bar.innerHTML =
      '<span dir="rtl" lang="ar">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>' +
      '<span class="lat">In the name of Allah, the Most Gracious, the Most Merciful · Educational companion</span>';
    var main = d.querySelector("main") || d.getElementById("cs-mount");
    if (main && main.parentNode) main.parentNode.insertBefore(bar, main);
    else d.body.insertBefore(bar, d.body.firstChild);
  }

  function ensureFooterStamp() {
    if (d.getElementById("cs-shariah-stamp")) return;
    var p = d.createElement("p");
    p.id = "cs-shariah-stamp";
    p.className = "disc edu";
    p.style.cssText = "text-align:center;margin:0.75rem 0.5rem 5.5rem;font-size:0.78rem;opacity:0.9;";
    p.textContent = STAMP;
    var door = d.getElementById("clarity-door-rail") || d.querySelector(".cs-door");
    if (door && door.parentNode) door.parentNode.insertBefore(p, door);
    else d.body.appendChild(p);
  }

  function markArabic() {
    d.querySelectorAll("#cs-mount p, #cs-mount li, #cs-mount h2, #cs-mount h3").forEach(function (el) {
      var t = (el.textContent || "").trim();
      if (!t || t.length < 2) return;
      // If mostly Arabic letters, set lang
      var ar = (t.match(/[\u0600-\u06FF]/g) || []).join("").length;
      if (ar >= 8 && ar / Math.max(t.length, 1) > 0.4) {
        el.setAttribute("lang", "ar");
        el.setAttribute("dir", "rtl");
      }
    });
  }

  function boot() {
    try { d.documentElement.setAttribute("data-shariah-ui", "1"); } catch (e) {}
    ensureBismillah();
    ensureFooterStamp();
    markArabic();
    var m = d.getElementById("cs-mount");
    if (m) {
      new MutationObserver(function () { markArabic(); }).observe(m, { childList: true, subtree: true });
    }
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
