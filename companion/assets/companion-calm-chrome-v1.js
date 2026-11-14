/*! companion-calm-chrome-v1 · suppress nav noise · companion isolation
 * Educational only — not a fatwa. Does not touch campus/yawm/amana/craft pages.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_CALM_CHROME_V1__) return;
  w.__COMPANION_CALM_CHROME_V1__ = true;

  function isCompanion() {
    var room = (d.documentElement.getAttribute("data-clarity-room") || "").toLowerCase();
    var p = location.pathname || "";
    return room === "companion" || p.indexOf("/companion") === 0;
  }

  function calm() {
    if (!isCompanion()) return;
    d.documentElement.classList.add("cc-calm-on");
    /* Ensure room attribute for CSS */
    if (!d.documentElement.getAttribute("data-clarity-room")) {
      d.documentElement.setAttribute("data-clarity-room", "companion");
    }
    /* Hide known noise hosts if still visible */
    ["clarity-global-nav", "clarity-visit-pill-bar", "companion-nav-clean-n34"].forEach(function (id) {
      var el = d.getElementById(id);
      if (el) {
        el.setAttribute("data-cc-suppressed", "1");
        el.style.display = "none";
      }
    });
    /* Room nav: strip emoji text nodes noise already CSS-hidden */
    var rail = d.querySelector(".clarity-room-nav");
    if (rail) {
      rail.setAttribute("data-cc-owner", "calm");
    }
  }

  function boot() {
    if (!isCompanion()) return;
    calm();
    setTimeout(calm, 200);
    setTimeout(calm, 800);
    setTimeout(calm, 2000);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
