
/**
 * HK1 confine · 20261027HK1
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_HK1__) return;
  w.__CLARITY_HK1__ = true;
  function mode() {
    return document.documentElement.getAttribute("data-shell-mode") || "landing";
  }
  function run() {
    var m = mode();
    var hideLanding = [
      "#clarity-door-rail",
      ".door-rail-bottom",
      ".door-rail-rrra5",
      ".clarity-gate-switcher",
      ".rrra-sitewide",
      "#clarity-visit-pill-bar"
    ];
    hideLanding.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (m === "landing") {
          el.style.setProperty("display", "none", "important");
          el.setAttribute("aria-hidden", "true");
        } else {
          if (sel.indexOf("door-rail") >= 0 || sel.indexOf("gate") >= 0) {
            el.style.removeProperty("display");
            el.removeAttribute("aria-hidden");
          }
        }
      });
    });
    /* provision home: never with Companion RRRA; Day room has deed card */
    document.querySelectorAll("#clarity-provision-home,.clarity-provision-home").forEach(function (el) {
      el.style.setProperty("display", "none", "important");
    });
    /* hide phased track strips by label */
    if (m === "landing") {
      document.querySelectorAll("div,section").forEach(function (el) {
        if (el.closest("#clarity-day-landing-room")) return;
        if (el.closest(".banner")) return;
        var t = (el.getAttribute("aria-label") || "") + " " + (el.textContent || "").slice(0, 80);
        if (/Phased learning|TRACK\s*1\s*Seeker/i.test(t) && el.children.length < 12) {
          el.style.setProperty("display", "none", "important");
        }
      });
    }
  }
  [40, 200, 600, 1500, 3000].forEach(function (ms) { setTimeout(run, ms); });
  setInterval(run, 1200);
  document.addEventListener("clarity:day-room-ready", function () { setTimeout(run, 30); });
})(typeof window !== "undefined" ? window : this);
