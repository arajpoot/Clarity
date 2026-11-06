/*! companion-banner-mobile-v1
 * Mobile banner behavior: next-salah mark, unstick, stack class.
 * Companion room only. Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_BANNER_MOBILE_V1__) return;
  w.__COMPANION_BANNER_MOBILE_V1__ = true;

  function isMobile() {
    return w.matchMedia && w.matchMedia("(max-width: 700px)").matches;
  }

  function markNextSalah() {
    var list = d.getElementById("salah-times-list");
    if (!list) return;
    var items = list.querySelectorAll("li");
    if (!items.length) return;
    items.forEach(function (li) { li.classList.remove("is-next-salah"); });
    /* prefer explicit next marker if present */
    var next = list.querySelector("[data-next='1'], .next, .is-next");
    if (next) {
      next.classList.add("is-next-salah");
      return;
    }
    if (items[0]) items[0].classList.add("is-next-salah");
  }

  function unstick() {
    if (!isMobile()) return;
    d.querySelectorAll(".banner, #clarity-top-duo, .global-nav, nav.global-nav").forEach(function (el) {
      try {
        el.style.setProperty("position", "relative", "important");
        el.style.setProperty("max-height", "none", "important");
        el.style.setProperty("overflow", "visible", "important");
      } catch (e) {}
    });
  }

  function flag() {
    d.documentElement.classList.toggle("companion-mobile-banner", isMobile());
  }

  function boot() {
    flag();
    unstick();
    markNextSalah();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", boot);
  w.addEventListener("resize", function () {
    flag();
    unstick();
  });
  setInterval(markNextSalah, 60000);
})(window, document);
