/**
 * Clarity Layout Fix v9 — smooth desktop pin, no laggy switch
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_LAYOUT_FIX_V9__) return;
  w.__CLARITY_LAYOUT_FIX_V9__ = true;
  w.__CLARITY_LAYOUT_FIX_V8__ = true;
  w.__CLARITY_LAYOUT_FIX_V7__ = true;

  var raf = 0;
  var lastPin = null;

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
      var duo = document.getElementById("clarity-top-duo");
      var visit = document.getElementById("clarity-visit-pill-bar");
      var pathStrip = document.getElementById("clarity-path-module-strip");
      var root = document.documentElement;
      var body = document.body;
      var pin = shouldPin();

      if (pin !== lastPin) {
        lastPin = pin;
        root.setAttribute("data-chrome-pin", pin ? "1" : "0");
        root.classList.toggle("clarity-pin-banner", pin);
        if (body) body.classList.toggle("clarity-chrome-pinned", pin);
      } else {
        root.setAttribute("data-chrome-pin", pin ? "1" : "0");
      }

      var h = 52;
      if (nav) h = Math.max(44, Math.round(nav.offsetHeight || 52));
      root.style.setProperty("--clarity-nav-h", h + "px");

      var duoH = duo ? Math.round(duo.offsetHeight || 0) : 0;
      var visitH = visit && pin ? Math.round(visit.offsetHeight || 0) : 0;
      var pathH = pathStrip && pin ? Math.round(pathStrip.offsetHeight || 0) : 0;

      if (pin) {
        var stack = Math.max(h + Math.max(duoH, 160), h + 160);
        root.style.setProperty("--clarity-chrome-h", stack + "px");
        root.style.setProperty("--clarity-visit-top", stack + "px");
        if (body) body.style.paddingTop = stack + (visitH || 36) + pathH + "px";
      } else {
        root.style.setProperty("--clarity-chrome-h", "0px");
        root.style.setProperty("--clarity-visit-top", "auto");
        if (body) {
          body.style.paddingTop = "";
          body.style.removeProperty("padding-top");
        }
      }
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
      lastPin = null;
      schedule();
      setTimeout(measure, 180);
    });
    try {
      var mq = w.matchMedia("(min-width:1024px)");
      if (mq.addEventListener) mq.addEventListener("change", function () {
        lastPin = null;
        schedule();
      });
    } catch (e) {}
    w.addEventListener("load", function () {
      schedule();
      setTimeout(measure, 250);
    });
    setTimeout(measure, 100);
    setTimeout(measure, 600);
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", bind);
  else bind();

  w.ClarityLayoutFix = { version: "20261007G", measure: measure, shouldPin: shouldPin };
})(typeof window !== "undefined" ? window : this);
