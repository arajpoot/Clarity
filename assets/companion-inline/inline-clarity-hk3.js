/**
 * HK3 · kill TRACK bar sitewide · dual-path tiles Companion-only · 20261027HK3
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_HK3__) return;
  w.__CLARITY_HK3__ = true;

  function mode() {
    return document.documentElement.getAttribute("data-shell-mode") || "landing";
  }

  function injectCss() {
    if (document.getElementById("clarity-hk3-css")) return;
    var s = document.createElement("style");
    s.id = "clarity-hk3-css";
    s.textContent = [
      /* KILL 4-path TRACK / phased bar — both Day and Companion */
      ".clarity-gate-switcher,",
      ".rrra-sitewide,",
      "#clarity-gate-switcher,",
      "[aria-label=\"Learning track — switch anytime\"],",
      "[aria-label*=\"Learning track\"],",
      "[aria-label*=\"Phased learning\"]{",
      "display:none!important;visibility:hidden!important;height:0!important;max-height:0!important;",
      "overflow:hidden!important;margin:0!important;padding:0!important;border:none!important;",
      "min-height:0!important;opacity:0!important;pointer-events:none!important;}",
      /* Dual-path TILE section — Companion only (fills padding) */
      'html[data-shell-mode="landing"] #clarity-dual-path,',
      'html[data-shell-mode="landing"] .clarity-dual-path{',
      "display:none!important;visibility:hidden!important;height:0!important;overflow:hidden!important;margin:0!important;min-height:0!important;}",
      'html[data-shell-mode="companion"] #clarity-dual-path,',
      'html[data-shell-mode="companion"] .clarity-dual-path{',
      "display:block!important;visibility:visible!important;height:auto!important;min-height:7.5rem!important;",
      "overflow:visible!important;margin:0.5rem 0 0.75rem!important;padding:0 0.5rem;box-sizing:border-box;width:100%;}",
      'html[data-shell-mode="companion"] #clarity-dual-path .dual-tiles{',
      "display:grid!important;grid-template-columns:1fr 1fr;gap:0.55rem;width:100%;max-width:none;}",
      /* Day room keeps its own single dual-tiles */
      'html[data-shell-mode="landing"] #clarity-day-landing-room .dual-tiles{display:grid!important;}',
      /* Provision on Day only */
      'html[data-shell-mode="landing"] #clarity-provision-home{display:block!important;visibility:visible!important;height:auto!important;margin:0.5rem auto;max-width:min(52rem,100%);}',
      'html[data-shell-mode="companion"] #clarity-provision-home{display:none!important;height:0!important;overflow:hidden!important;margin:0!important;padding:0!important;min-height:0!important;}',
      /* No leftover min-height gap when provision hidden on Companion */
      'html[data-shell-mode="companion"] .clarity-provision-home{min-height:0!important;}',
      /* Bottom rail Companion only */
      'html[data-shell-mode="landing"] #clarity-door-rail,html[data-shell-mode="landing"] .door-rail-bottom{display:none!important;height:0!important;}',
      'html[data-shell-mode="companion"] #clarity-door-rail{display:flex!important;}'
    ].join("");
    document.head.appendChild(s);
  }

  function killTrack() {
    document.querySelectorAll(
      ".clarity-gate-switcher,.rrra-sitewide,[aria-label*=\"Learning track\"],[aria-label*=\"Phased learning\"]"
    ).forEach(function (el) {
      el.style.setProperty("display", "none", "important");
      el.setAttribute("hidden", "");
      el.setAttribute("aria-hidden", "true");
      el.setAttribute("data-rail-suppressed", "1");
      try { el.innerHTML = ""; } catch (e) {}
    });
  }

  function placeDualPath() {
    var dual = document.getElementById("clarity-dual-path") || document.querySelector(".clarity-dual-path");
    if (!dual) return;
    if (mode() === "companion") {
      dual.style.setProperty("display", "block", "important");
      dual.style.setProperty("min-height", "7.5rem", "important");
      dual.removeAttribute("hidden");
      /* mount under plaque / after reopen bar to fill gap */
      var bar = document.getElementById("clarity-reopen-bar");
      var main = document.getElementById("main-content");
      if (bar && bar.parentNode && dual.parentNode) {
        try {
          if (dual.previousElementSibling !== bar) {
            bar.parentNode.insertBefore(dual, bar.nextSibling);
          }
        } catch (e) {}
      }
      if (main && dual.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING) {
        /* dual should be before main content body gap */
      }
    } else {
      dual.style.setProperty("display", "none", "important");
      dual.style.setProperty("min-height", "0", "important");
    }
  }

  function run() {
    injectCss();
    killTrack();
    placeDualPath();
  }

  [20, 100, 300, 700, 1500, 3000, 6000].forEach(function (ms) { setTimeout(run, ms); });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(run, 30); });
  }
  w.addEventListener("load", function () { setTimeout(run, 200); });
  setInterval(run, 2000);
})(typeof window !== "undefined" ? window : this);
