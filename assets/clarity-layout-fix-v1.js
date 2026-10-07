/**
 * Clarity Layout Fix v1 — sticky chrome sync + orientation/resize
 * Fixes: black strip under nav, mobile content under banner, clunky desktop/mobile switch
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_LAYOUT_FIX_V1__) return;
  w.__CLARITY_LAYOUT_FIX_V1__ = true;
  var VER = "20261006DP";

  function navEl() { return document.getElementById("clarity-global-nav"); }
  function duoEl() { return document.getElementById("clarity-top-duo"); }

  function measure() {
    try {
      var nav = navEl();
      var duo = duoEl();
      var h = 48;
      if (nav) {
        var r = nav.getBoundingClientRect();
        h = Math.max(40, Math.round(r.height)) || 48;
      }
      document.documentElement.style.setProperty("--clarity-nav-h", h + "px");
      // Kill residual gap: force duo flush under nav
      if (duo) {
        duo.style.top = h + "px";
        duo.style.marginTop = "0";
        duo.style.paddingTop = "0";
      }
      if (nav) {
        nav.style.marginBottom = "0";
        nav.style.borderBottomWidth = "1px";
      }
      // Content offset so sticky stack doesn't cover first cards (mobile)
      var stack = h;
      if (duo) stack += Math.round(duo.getBoundingClientRect().height) || 0;
      document.documentElement.style.setProperty("--clarity-chrome-h", stack + "px");
      var main = document.getElementById("main-application-workspace") ||
        document.querySelector("main") ||
        document.getElementById("clarity-visit-pill-bar");
      if (main && w.matchMedia && w.matchMedia("(max-width: 700px)").matches) {
        // small safety pad under sticky duo when scrolled to top sections
        document.documentElement.style.setProperty("--clarity-mobile-pad", "0.25rem");
      } else {
        document.documentElement.style.setProperty("--clarity-mobile-pad", "0px");
      }
    } catch (e) {}
  }

  var t = null;
  function schedule() {
    if (t) clearTimeout(t);
    t = setTimeout(function () {
      t = null;
      measure();
    }, 60);
  }

  function bind() {
    measure();
    w.addEventListener("resize", schedule, { passive: true });
    w.addEventListener("orientationchange", function () {
      // double-pass: after orientation layout settles
      measure();
      setTimeout(measure, 120);
      setTimeout(measure, 400);
    });
    if (w.visualViewport) {
      w.visualViewport.addEventListener("resize", schedule, { passive: true });
      w.visualViewport.addEventListener("scroll", schedule, { passive: true });
    }
    // Theme / path changes can alter chrome height
    try {
      new MutationObserver(schedule).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme", "data-path-i", "class"]
      });
    } catch (e) {}
    // Fonts / images in banner
    setTimeout(measure, 300);
    setTimeout(measure, 1200);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(schedule).catch(function () {});
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();

  w.ClarityLayoutFix = { version: VER, measure: measure };
})(typeof window !== "undefined" ? window : this);
