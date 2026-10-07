/**
 * Clarity Layout Fix v3 — measure nav, sync --clarity-nav-h, orientation/resize
 * Does NOT force position; CSS L3 owns sticky stack. Banner stays relative inside duo.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_LAYOUT_FIX_V3__) return;
  w.__CLARITY_LAYOUT_FIX_V3__ = true;
  var VER = "20261006L3";

  function measure() {
    try {
      var nav = document.getElementById("clarity-global-nav");
      var duo = document.getElementById("clarity-top-duo");
      var h = 48;
      if (nav) {
        h = Math.max(40, Math.round(nav.getBoundingClientRect().height)) || 48;
      }
      document.documentElement.style.setProperty("--clarity-nav-h", h + "px");
      var stack = h;
      if (duo) {
        // only set top via CSS var — do not fight position
        stack += Math.round(duo.getBoundingClientRect().height) || 0;
      }
      document.documentElement.style.setProperty("--clarity-chrome-h", stack + "px");
    } catch (e) {}
  }

  var t = null;
  function schedule() {
    if (t) clearTimeout(t);
    t = setTimeout(function () { t = null; measure(); }, 40);
  }

  function bind() {
    measure();
    w.addEventListener("resize", schedule, { passive: true });
    w.addEventListener("orientationchange", function () {
      measure();
      setTimeout(measure, 80);
      setTimeout(measure, 300);
      setTimeout(measure, 600);
    });
    if (w.visualViewport) {
      w.visualViewport.addEventListener("resize", schedule, { passive: true });
    }
    try {
      var mq = w.matchMedia("(max-width: 700px)");
      if (mq.addEventListener) mq.addEventListener("change", schedule);
      else if (mq.addListener) mq.addListener(schedule);
    } catch (e) {}
    try {
      new MutationObserver(schedule).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme", "class"]
      });
    } catch (e) {}
    setTimeout(measure, 150);
    setTimeout(measure, 700);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(schedule).catch(function () {});
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();

  w.ClarityLayoutFix = { version: VER, measure: measure };
})(typeof window !== "undefined" ? window : this);
