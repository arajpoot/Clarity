/**
 * Clarity Layout Fix v10 — desktop sticky chrome, no fixed double-paint
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_LAYOUT_FIX_V10__) return;
  w.__CLARITY_LAYOUT_FIX_V10__ = true;
  w.__CLARITY_LAYOUT_FIX_V9__ = true;

  var raf = 0;

  function shouldPin() {
    try {
      var width = Math.min(w.innerWidth || 0, document.documentElement.clientWidth || 0);
      return width >= 1024;
    } catch (e) {
      return false;
    }
  }

  function measure() {
    try {
      var nav = document.getElementById("clarity-global-nav");
      var root = document.documentElement;
      var body = document.body;
      var pin = shouldPin();

      root.setAttribute("data-chrome-pin", pin ? "1" : "0");
      root.classList.toggle("clarity-pin-banner", pin);
      if (body) {
        body.classList.toggle("clarity-chrome-pinned", pin);
        // Never use padding-top spacer with sticky — causes double paint
        body.style.paddingTop = "";
        body.style.removeProperty("padding-top");
      }

      var h = 52;
      if (nav) h = Math.max(44, Math.round(nav.offsetHeight || 52));
      root.style.setProperty("--clarity-nav-h", h + "px");
      root.style.setProperty("--clarity-chrome-h", "0px");
    } catch (e) {}
  }

  function schedule() {
    if (raf) return;
    raf = w.requestAnimationFrame(function () {
      raf = 0;
      measure();
    });
  }

  function bind() {
    measure();
    w.addEventListener("resize", schedule, { passive: true });
    w.addEventListener("orientationchange", function () {
      setTimeout(measure, 150);
    });
    try {
      var mq = w.matchMedia("(min-width:1024px)");
      if (mq.addEventListener) mq.addEventListener("change", schedule);
    } catch (e) {}
    w.addEventListener("load", schedule);
    setTimeout(measure, 120);
    setTimeout(measure, 500);
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", bind);
  else bind();

  w.ClarityLayoutFix = { version: "20261007H", measure: measure, shouldPin: shouldPin };
})(typeof window !== "undefined" ? window : this);
