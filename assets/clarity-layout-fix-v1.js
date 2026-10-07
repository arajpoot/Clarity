(function (w) {
  "use strict";
  if (w.__CLARITY_LAYOUT_FIX_V5__) return;
  w.__CLARITY_LAYOUT_FIX_V5__ = true;
  var VER = "20261006AR";

  function isDesktop() {
    try {
      return w.matchMedia && w.matchMedia("(min-width:701px)").matches;
    } catch (e) {
      return false;
    }
  }

  function measure() {
    try {
      var nav = document.getElementById("clarity-global-nav");
      var duo = document.getElementById("clarity-top-duo");
      var desk = isDesktop();
      var root = document.documentElement;
      if (desk) root.setAttribute("data-chrome-pin", "1");
      else root.removeAttribute("data-chrome-pin");

      var h = 48;
      if (nav) h = Math.max(40, Math.round(nav.getBoundingClientRect().height)) || 48;
      root.style.setProperty("--clarity-nav-h", h + "px");

      if (!desk) {
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
    measure();
    w.addEventListener("resize", schedule, { passive: true });
    w.addEventListener("orientationchange", function () {
      measure();
      setTimeout(measure, 100);
      setTimeout(measure, 400);
    });
    if (w.visualViewport) w.visualViewport.addEventListener("resize", schedule, { passive: true });
    try {
      var mq = w.matchMedia("(min-width:701px)");
      if (mq.addEventListener) mq.addEventListener("change", schedule);
      else if (mq.addListener) mq.addListener(schedule);
    } catch (e) {}
    setTimeout(measure, 200);
    setTimeout(measure, 900);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();

  w.ClarityLayoutFix = { version: VER, measure: measure };
})(typeof window !== "undefined" ? window : this);
