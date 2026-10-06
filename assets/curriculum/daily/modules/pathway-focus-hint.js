/**
 * Example curriculum module — Daily pathway focus hint
 * Loaded only when Daily is active + flag on.
 * Demonstrates the hydrator live-wire.
 */
(function () {
  "use strict";
  if (window.__CLARITY_DAILY_FOCUS_HINT__) return;
  window.__CLARITY_DAILY_FOCUS_HINT__ = true;

  function showHint() {
    if (document.getElementById("clarity-pathway-focus-hint")) return;
    var el = document.createElement("div");
    el.id = "clarity-pathway-focus-hint";
    el.setAttribute("role", "status");
    el.style.cssText = "position:fixed;bottom:1rem;left:50%;transform:translateX(-50%);z-index:9998;background:var(--clarity-card-bg,#1a2e24);color:var(--clarity-ink,#e7efe9);padding:.55rem 1rem;border-radius:999px;font:600 13px/1.3 system-ui,sans-serif;box-shadow:0 4px 20px rgba(0,0,0,.25);opacity:0;transition:opacity .4s;pointer-events:none;max-width:90vw;text-align:center";
    el.textContent = "Daily pathway active · consistent small deeds";
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.style.opacity = "1"; });
    setTimeout(function () {
      el.style.opacity = "0";
      setTimeout(function () { el.remove(); }, 500);
    }, 3200);
  }

  // Only show once per session when Daily becomes active
  if (!sessionStorage.getItem("clarity_daily_hint_shown")) {
    sessionStorage.setItem("clarity_daily_hint_shown", "1");
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () { setTimeout(showHint, 900); });
    } else {
      setTimeout(showHint, 900);
    }
  }

  window.addEventListener("clarity-pathway-hydrated", function (e) {
    if (e.detail && e.detail.phase === "daily") {
      // Module confirmed live
      if (window.localStorage && window.localStorage.getItem("clarity_perf") === "1") {
        console.log("[Daily module] focus-hint live");
      }
    }
  });
})();
