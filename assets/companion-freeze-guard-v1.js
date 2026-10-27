/**
 * companion-freeze-guard-v1.js · 20261026FREEZE
 * Last-line freeze guard: disable track style thrash; break recursion flags.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_FREEZE_GUARD_V1__) return;
  g.__CLARITY_FREEZE_GUARD_V1__ = true;

  /* Clear known thrash flag after load */
  g.__clarityPathExtentOnly = false;

  /* Patch setInterval to block sub-5s force loops on anonymous track forces — too aggressive.
     Instead: after load, one-time track flex if hidden. */
  function softUnhideOnce() {
    try {
      var el = document.querySelector(".clarity-gate-switcher");
      if (!el) return;
      var st = window.getComputedStyle(el);
      if (st.display === "none") {
        el.style.display = "flex";
        el.style.visibility = "visible";
      }
    } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(softUnhideOnce, 200);
    });
  } else {
    setTimeout(softUnhideOnce, 200);
  }
  g.addEventListener("load", function () {
    g.__clarityPathExtentOnly = false;
    setTimeout(softUnhideOnce, 100);
  });
})(typeof window !== "undefined" ? window : this);
