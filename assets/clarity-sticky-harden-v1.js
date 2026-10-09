/* Clarity STICKY HARDEN v1 — measure + pin + re-assert against late patches */
(function (g) {
  "use strict";
  if (g.__CLARITY_STICKY_HARDEN_V1__) return;
  g.__CLARITY_STICKY_HARDEN_V1__ = true;

  function $(id) {
    try { return document.getElementById(id); } catch (e) { return null; }
  }

  function measureAndPin() {
    try {
      var nav = $("clarity-global-nav") || document.querySelector("nav.global-nav");
      var duo = $("clarity-top-duo");
      var gate = document.querySelector(".clarity-gate-switcher.rrra-sitewide, .clarity-gate-switcher");
      var nh = 48;
      var bh = 160;
      if (nav) {
        nh = Math.max(40, Math.ceil(nav.getBoundingClientRect().height) || 48);
        nav.style.setProperty("position", "sticky", "important");
        nav.style.setProperty("top", "0px", "important");
        nav.style.setProperty("z-index", "2100", "important");
        nav.style.setProperty("transform", "none", "important");
      }
      if (duo) {
        bh = Math.max(80, Math.ceil(duo.getBoundingClientRect().height) || 160);
        duo.style.setProperty("position", "sticky", "important");
        duo.style.setProperty("top", nh + "px", "important");
        duo.style.setProperty("z-index", "2090", "important");
        duo.style.setProperty("transform", "none", "important");
      }
      document.documentElement.style.setProperty("--clarity-nav-h", nh + "px");
      document.documentElement.style.setProperty("--clarity-banner-h", bh + "px");
      document.documentElement.setAttribute("data-chrome-pin", "1");
      document.documentElement.setAttribute("data-clarity-pin-banner", "1");
      document.body.classList.add("clarity-chrome-pinned");
      if (gate) {
        gate.style.setProperty("position", "sticky", "important");
        gate.style.setProperty("top", nh + bh + "px", "important");
        gate.style.setProperty("z-index", "2080", "important");
        gate.style.setProperty("width", "100%", "important");
      }
      // neutralize body spacer ghosts
      try {
        document.documentElement.style.paddingTop = "";
        document.body.style.paddingTop = "";
      } catch (e2) {}
    } catch (e) {}
  }

  function boot() {
    measureAndPin();
    [50, 150, 400, 1000, 2500, 4000].forEach(function (ms) {
      setTimeout(measureAndPin, ms);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  g.addEventListener("load", function () {
    measureAndPin();
    setTimeout(measureAndPin, 300);
  });
  g.addEventListener("resize", function () {
    setTimeout(measureAndPin, 80);
  });
  g.addEventListener("orientationchange", function () {
    setTimeout(measureAndPin, 120);
    setTimeout(measureAndPin, 500);
  });
  // Re-pin if late scripts reset styles
  try {
    var obs = new MutationObserver(function () {
      var duo = $("clarity-top-duo");
      if (!duo) return;
      var pos = g.getComputedStyle(duo).position;
      if (pos !== "sticky" && pos !== "fixed") measureAndPin();
    });
    if (document.documentElement) {
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "class", "data-chrome-pin"] });
    }
  } catch (e3) {}
})(typeof window !== "undefined" ? window : this);
