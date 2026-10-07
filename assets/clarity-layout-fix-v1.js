/**
 * Clarity Layout Fix v2 — sticky chrome sync, no gap, orientation-safe
 * Safe with dual-load boot path.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_LAYOUT_FIX_V2__) return;
  w.__CLARITY_LAYOUT_FIX_V2__ = true;
  var VER = "20261006L2";

  function q(id) { return document.getElementById(id); }

  function measure() {
    try {
      var nav = q("clarity-global-nav");
      var duo = q("clarity-top-duo");
      var h = 48;
      if (nav) {
        var r = nav.getBoundingClientRect();
        h = Math.max(36, Math.round(r.height)) || 48;
        nav.style.marginBottom = "0";
        nav.style.borderBottom = "none";
        nav.style.boxShadow = "none";
      }
      document.documentElement.style.setProperty("--clarity-nav-h", h + "px");
      if (duo) {
        duo.style.top = h + "px";
        duo.style.marginTop = "0";
        duo.style.paddingTop = "0";
        duo.style.borderTop = "none";
        // Match banner fill so no black shows through
        var dark = document.documentElement.getAttribute("data-theme") === "dark";
        duo.style.background = dark ? "#0c1410" : "#0d4f3c";
      }
      var stack = h;
      if (duo) stack += Math.round(duo.getBoundingClientRect().height) || 0;
      document.documentElement.style.setProperty("--clarity-chrome-h", stack + "px");
    } catch (e) {}
  }

  var t = null;
  function schedule() {
    if (t) clearTimeout(t);
    t = setTimeout(function () { t = null; measure(); }, 50);
  }

  function bind() {
    measure();
    w.addEventListener("resize", schedule, { passive: true });
    w.addEventListener("orientationchange", function () {
      measure();
      setTimeout(measure, 100);
      setTimeout(measure, 350);
      setTimeout(measure, 700);
    });
    if (w.visualViewport) {
      w.visualViewport.addEventListener("resize", schedule, { passive: true });
    }
    // matchMedia desktop/mobile breakpoint flips without full reload
    try {
      var mq = w.matchMedia("(max-width: 700px)");
      if (mq.addEventListener) mq.addEventListener("change", schedule);
      else if (mq.addListener) mq.addListener(schedule);
    } catch (e) {}
    try {
      new MutationObserver(schedule).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme", "data-path-i", "class", "style"]
      });
    } catch (e) {}
    setTimeout(measure, 200);
    setTimeout(measure, 800);
    setTimeout(measure, 2000);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(schedule).catch(function () {});
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();

  w.ClarityLayoutFix = { version: VER, measure: measure };
})(typeof window !== "undefined" ? window : this);
