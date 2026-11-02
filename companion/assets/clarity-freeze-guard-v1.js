/*! clarity-freeze-guard-v1 · landing only · do not touch RRRA */
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
    function killLandingOnly() {
      try {
        var nodes = document.querySelectorAll(
          "#clarity-day-landing,.clarity-day-landing,#clarity-landing-stack,.day-landing-stack,[data-clarity-day-landing]"
        );
        for (var i = 0; i < nodes.length; i++) {
          nodes[i].style.setProperty("display", "none", "important");
          nodes[i].setAttribute("hidden", "hidden");
        }
      } catch (e) {}
    }
    killLandingOnly();
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", killLandingOnly);
    setTimeout(killLandingOnly, 400);
    setTimeout(killLandingOnly, 1500);
    // brief observer — landing nodes only
    try {
      var n = 0;
      var obs = new MutationObserver(function (muts) {
        var hit = false;
        for (var i = 0; i < muts.length; i++) {
          var nodes = muts[i].addedNodes || [];
          for (var j = 0; j < nodes.length; j++) {
            var el = nodes[j];
            if (el && el.id === "clarity-day-landing") hit = true;
          }
        }
        if (hit) killLandingOnly();
        if (++n > 40) obs.disconnect();
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(function () { try { obs.disconnect(); } catch (e2) {} }, 6000);
    } catch (e3) {}
  } catch (err) {}
})();
