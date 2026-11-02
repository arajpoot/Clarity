/*! clarity-freeze-guard-v1 · stop day-landing thrash on Companion */
(function () {
  "use strict";
  if (window.__CLARITY_FREEZE_GUARD_V1__) return;
  window.__CLARITY_FREEZE_GUARD_V1__ = true;
  try {
    var path = location.pathname || "";
    if (path.indexOf("/companion") === 0) {
      document.documentElement.setAttribute("data-clarity-viewport", "companion-path");
      document.documentElement.setAttribute("data-clarity-room", "companion");
    }
    window.__CLARITY_SKIP_DAY_LANDING__ = true;
    function killLanding() {
      try {
        var nodes = document.querySelectorAll(
          "#clarity-day-landing,.clarity-day-landing,#clarity-landing-stack,.day-landing-stack,[data-clarity-day-landing]"
        );
        for (var i = 0; i < nodes.length; i++) {
          nodes[i].style.setProperty("display", "none", "important");
          nodes[i].setAttribute("hidden", "hidden");
          nodes[i].setAttribute("aria-hidden", "true");
        }
      } catch (e) {}
    }
    killLanding();
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", killLanding);
    setTimeout(killLanding, 0);
    setTimeout(killLanding, 400);
    setTimeout(killLanding, 1200);
    try {
      var n = 0;
      var obs = new MutationObserver(function () {
        killLanding();
        if (++n > 25) obs.disconnect();
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(function () {
        try {
          obs.disconnect();
        } catch (e2) {}
      }, 8000);
    } catch (e3) {}
  } catch (err) {}
})();
