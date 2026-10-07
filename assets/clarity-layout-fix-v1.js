/**
 * Clarity Layout Fix v7 — sole chrome pin controller
 * Desktop/landscape: fixed nav+banner. Portrait mobile: flow.
 * Applies data-chrome-pin only; CSS at file end wins fighters.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_LAYOUT_FIX_V7__) return;
  w.__CLARITY_LAYOUT_FIX_V7__ = true;
  // Disable older layout fix if present
  w.__CLARITY_LAYOUT_FIX_V6__ = true;

  function shouldPin() {
    try {
      var width = w.innerWidth || document.documentElement.clientWidth || 0;
      if (width >= 901) return true;
      var landscape = false;
      try { landscape = w.matchMedia("(orientation: landscape)").matches; } catch (e) {}
      return width >= 700 && landscape;
    } catch (e2) {
      return false;
    }
  }

  function measure() {
    try {
      var nav = document.getElementById("clarity-global-nav");
      var duo = document.getElementById("clarity-top-duo");
      var root = document.documentElement;
      var body = document.body;
      var pin = shouldPin();

      root.setAttribute("data-chrome-pin", pin ? "1" : "0");
      root.setAttribute("data-clarity-pin-banner", pin ? "1" : "0");
      root.classList.toggle("clarity-pin-banner", !!pin);
      if (body) body.classList.toggle("clarity-chrome-pinned", !!pin);

      var h = 52;
      if (nav) {
        // When fixed, offsetHeight is reliable
        h = Math.max(44, Math.round(nav.offsetHeight || nav.getBoundingClientRect().height) || 52);
      }
      root.style.setProperty("--clarity-nav-h", h + "px");

      var duoH = 0;
      if (duo) {
        duoH = Math.round(duo.offsetHeight || duo.getBoundingClientRect().height) || 0;
        if (duoH < 120 && pin) duoH = 160; // min banner while measuring
      }

      if (pin) {
        var stack = h + duoH;
        root.style.setProperty("--clarity-chrome-h", stack + "px");
        if (body) body.style.paddingTop = stack + "px";
      } else {
        root.style.setProperty("--clarity-chrome-h", "0px");
        if (body) body.style.paddingTop = "";
      }
    } catch (e) {}
  }

  var t = null;
  function schedule() {
    if (t) clearTimeout(t);
    t = setTimeout(function () {
      t = null;
      measure();
      // second pass after layout settles (desktop↔mobile kink)
      setTimeout(measure, 80);
    }, 30);
  }

  function bind() {
    measure();
    w.addEventListener("resize", schedule, { passive: true });
    w.addEventListener("orientationchange", function () {
      measure();
      setTimeout(measure, 120);
      setTimeout(measure, 350);
      setTimeout(measure, 700);
    });
    if (w.visualViewport) {
      w.visualViewport.addEventListener("resize", schedule, { passive: true });
    }
    try {
      var mq = w.matchMedia("(min-width:901px)");
      if (mq.addEventListener) mq.addEventListener("change", schedule);
      else if (mq.addListener) mq.addListener(schedule);
    } catch (e) {}
    try {
      var mq2 = w.matchMedia("(orientation: landscape)");
      if (mq2.addEventListener) mq2.addEventListener("change", schedule);
    } catch (e3) {}
    setTimeout(measure, 100);
    setTimeout(measure, 400);
    setTimeout(measure, 1000);
    w.addEventListener("load", function () {
      measure();
      setTimeout(measure, 200);
    });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", bind);
  else bind();

  w.ClarityLayoutFix = { version: "20261007C", measure: measure, shouldPin: shouldPin };
})(typeof window !== "undefined" ? window : this);
