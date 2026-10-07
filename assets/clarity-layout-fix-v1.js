/**
 * Clarity Layout Fix v8 — pin only true desktop; mobile never fixed
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_LAYOUT_FIX_V8__) return;
  w.__CLARITY_LAYOUT_FIX_V8__ = true;
  w.__CLARITY_LAYOUT_FIX_V7__ = true;
  w.__CLARITY_LAYOUT_FIX_V6__ = true;

  function shouldPin() {
    try {
      // Only pin on real desktop widths — never phones / small tablets
      var width = Math.min(
        w.innerWidth || 0,
        document.documentElement.clientWidth || 0
      );
      if (width < 1024) return false;
      // Prefer desktop pointer when available
      try {
        if (w.matchMedia("(hover: none) and (pointer: coarse)").matches && width < 1200)
          return false;
      } catch (e) {}
      return true;
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
      if (nav) h = Math.max(44, Math.round(nav.offsetHeight || 52));
      root.style.setProperty("--clarity-nav-h", h + "px");

      var duoH = 0;
      if (duo) duoH = Math.round(duo.offsetHeight || 0);

      if (pin) {
        // Prefer measured; floor so first card is never under chrome
        var stack = Math.max(h + duoH, h + 180);
        root.style.setProperty("--clarity-chrome-h", stack + "px");
        if (body) body.style.paddingTop = stack + "px";
      } else {
        root.style.setProperty("--clarity-chrome-h", "0px");
        if (body) {
          body.style.paddingTop = "";
          body.style.removeProperty("padding-top");
        }
      }
    } catch (e) {}
  }

  var t = null;
  function schedule() {
    if (t) clearTimeout(t);
    t = setTimeout(function () {
      t = null;
      measure();
      setTimeout(measure, 100);
    }, 40);
  }

  function bind() {
    measure();
    w.addEventListener("resize", schedule, { passive: true });
    w.addEventListener("orientationchange", function () {
      // Force unpin during rotate then remeasure
      try {
        document.documentElement.setAttribute("data-chrome-pin", "0");
        document.body && document.body.classList.remove("clarity-chrome-pinned");
        if (document.body) document.body.style.paddingTop = "";
      } catch (e) {}
      setTimeout(measure, 50);
      setTimeout(measure, 200);
      setTimeout(measure, 500);
    });
    if (w.visualViewport)
      w.visualViewport.addEventListener("resize", schedule, { passive: true });
    try {
      var mq = w.matchMedia("(min-width:1024px)");
      if (mq.addEventListener) mq.addEventListener("change", schedule);
      else if (mq.addListener) mq.addListener(schedule);
    } catch (e) {}
    setTimeout(measure, 150);
    setTimeout(measure, 500);
    setTimeout(measure, 1200);
    w.addEventListener("load", function () {
      measure();
      setTimeout(measure, 300);
    });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", bind);
  else bind();

  w.ClarityLayoutFix = { version: "20261007D", measure: measure, shouldPin: shouldPin };
})(typeof window !== "undefined" ? window : this);
