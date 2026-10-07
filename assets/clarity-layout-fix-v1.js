/**
 * Clarity Layout Fix v6 — single chrome/pin controller (no dual fighters)
 * Desktop + landscape pin; portrait free; nav height CSS vars
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_LAYOUT_FIX_V6__) return;
  w.__CLARITY_LAYOUT_FIX_V6__ = true;

  function shouldPin() {
    try {
      var width = w.innerWidth || document.documentElement.clientWidth || 0;
      var landscape = false;
      try { landscape = w.matchMedia("(orientation: landscape)").matches; } catch (e) {}
      return width >= 901 || (width >= 600 && landscape);
    } catch (e2) {
      return false;
    }
  }

  function measure() {
    try {
      var nav = document.getElementById("clarity-global-nav");
      var duo = document.getElementById("clarity-top-duo");
      var root = document.documentElement;
      var pin = shouldPin();
      root.setAttribute("data-chrome-pin", pin ? "1" : "0");
      root.setAttribute("data-clarity-pin-banner", pin ? "1" : "0");
      root.classList.toggle("clarity-pin-banner", pin);

      var h = 48;
      if (nav) h = Math.max(40, Math.round(nav.getBoundingClientRect().height)) || 48;
      root.style.setProperty("--clarity-nav-h", h + "px");

      if (!pin) {
        root.style.setProperty("--clarity-chrome-h", "0px");
        return;
      }
      var stack = h;
      if (duo) stack += Math.round(duo.getBoundingClientRect().height) || 0;
      root.style.setProperty("--clarity-chrome-h", stack + "px");
    } catch (e) {}
  }

  var t = null;
  function schedule() {
    if (t) clearTimeout(t);
    t = setTimeout(function () {
      t = null;
      measure();
    }, 40);
  }

  function bind() {
    try {
      var seo = document.getElementById("clarity-seo-paths");
      if (seo) seo.classList.add("clarity-seo-sr");
    } catch (e) {}
    measure();
    w.addEventListener("resize", schedule, { passive: true });
    w.addEventListener("orientationchange", function () {
      measure();
      setTimeout(measure, 100);
      setTimeout(measure, 400);
    });
    if (w.visualViewport) w.visualViewport.addEventListener("resize", schedule, { passive: true });
    try {
      var mq = w.matchMedia("(min-width:901px)");
      if (mq.addEventListener) mq.addEventListener("change", schedule);
      else if (mq.addListener) mq.addListener(schedule);
    } catch (e) {}
    try {
      var mq2 = w.matchMedia("(orientation: landscape)");
      if (mq2.addEventListener) mq2.addEventListener("change", schedule);
    } catch (e3) {}
    setTimeout(measure, 200);
    setTimeout(measure, 900);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();

  w.ClarityLayoutFix = { version: "20261006F", measure: measure };
})(typeof window !== "undefined" ? window : this);
