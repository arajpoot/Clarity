/**
 * P0–P1 Day vault · 20261027P0P9
 * First-paint already locked via head CSS.
 * This script beats aux-pack display:flex !important resurrection.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_P0P1__) return;
  w.__CLARITY_P0P1__ = true;

  var savedTrack = null;

  function mode() {
    var m = document.documentElement.getAttribute("data-shell-mode");
    if (m === "landing" || m === "companion") return m;
    return "landing";
  }

  function inject() {
    if (document.getElementById("clarity-p1-track-kill")) return;
    var s = document.createElement("style");
    s.id = "clarity-p1-track-kill";
    /* Specificity > aux-pack .clarity-gate-switcher { display:flex !important } */
    s.textContent = [
      'html[data-shell-mode="landing"] .clarity-gate-switcher.rrra-sitewide,',
      'html[data-shell-mode="landing"] .clarity-gate-switcher.cgp-track-plaque,',
      'html[data-shell-mode="landing"] .clarity-gate-switcher,',
      'html[data-shell-mode="landing"] .cgp-track-plaque,',
      'html[data-shell-mode="landing"] .rrra-sitewide {',
      "display:none!important;visibility:hidden!important;height:0!important;max-height:0!important;",
      "min-height:0!important;overflow:hidden!important;margin:0!important;padding:0!important;",
      "opacity:0!important;pointer-events:none!important;position:absolute!important;left:-9999px!important;}",
      'html[data-shell-mode="companion"] .clarity-gate-switcher {',
      "display:flex!important;visibility:visible!important;height:auto!important;min-height:2.75rem!important;",
      "position:relative!important;left:auto!important;opacity:1!important;pointer-events:auto!important;",
      "flex-wrap:wrap;gap:0.35rem;margin:0.45rem 0.5rem;padding:0.5rem 0.65rem;border-radius:14px;",
      "border:1px solid rgba(15,76,58,0.22);}",
      "#clarity-dual-path,.clarity-dual-path,#clarity-provision-home,.clarity-provision-home{",
      "display:none!important;height:0!important;min-height:0!important;overflow:hidden!important;margin:0!important;}",
      'html[data-shell-mode="landing"] #clarity-door-rail,html[data-shell-mode="landing"] .door-rail-bottom{display:none!important;height:0!important;}',
      'html[data-shell-mode="landing"] #main-content{display:none!important;}',
      'html[data-shell-mode="landing"] #clarity-day-landing-room{display:block!important;visibility:visible!important;}'
    ].join("");
    document.head.appendChild(s);
  }

  function killTrack() {
    document.querySelectorAll(".clarity-gate-switcher,.rrra-sitewide,.cgp-track-plaque").forEach(function (el) {
      if (mode() !== "landing") {
        if (savedTrack && !el.querySelector(".cgs-btn")) {
          try { el.innerHTML = savedTrack; } catch (e) {}
        }
        el.style.removeProperty("display");
        el.removeAttribute("hidden");
        return;
      }
      if (!savedTrack && el.querySelector(".cgs-btn")) {
        try { savedTrack = el.innerHTML; } catch (e) {}
      }
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("height", "0", "important");
      el.style.setProperty("min-height", "0", "important");
      el.style.setProperty("overflow", "hidden", "important");
      el.style.setProperty("margin", "0", "important");
      el.style.setProperty("padding", "0", "important");
      el.style.setProperty("opacity", "0", "important");
      el.setAttribute("hidden", "");
      el.setAttribute("aria-hidden", "true");
      el.setAttribute("data-rail-suppressed", "1");
      try { el.classList.remove("cgp-track-plaque"); } catch (e2) {}
    });
  }

  function run() {
    /* force landing until user picks companion */
    try {
      if (sessionStorage.getItem("clarity_shell_user_pick_v1") !== "1") {
        document.documentElement.setAttribute("data-shell-mode", "landing");
        localStorage.setItem("clarity_shell_mode_v1", "landing");
      }
    } catch (e) {}
    inject();
    killTrack();
  }

  run();
  [0, 10, 30, 60, 120, 250, 500, 1000, 2000, 4000].forEach(function (ms) { setTimeout(run, ms); });
  setInterval(run, 1000);
  document.addEventListener("DOMContentLoaded", run);
  w.addEventListener("load", function () { run(); setTimeout(run, 100); });
})(typeof window !== "undefined" ? window : this);
