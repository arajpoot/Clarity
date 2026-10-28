/**
 * Day vault confine · 20261027VAULTFULL
 * Room owns all Day content. Hide external dual / provision / track on Day.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_DAY_VAULT_FULL__) return;
  w.__CLARITY_DAY_VAULT_FULL__ = true;
  function mode() {
    return document.documentElement.getAttribute("data-shell-mode") || "landing";
  }
  function inject() {
    if (document.getElementById("clarity-vault-full-css")) return;
    var s = document.createElement("style");
    s.id = "clarity-vault-full-css";
    s.textContent = [
      'html[data-shell-mode="landing"] #clarity-day-landing-room{display:block!important;visibility:visible!important;}',
      'html[data-shell-mode="landing"] #main-content{display:none!important;}',
      'html[data-shell-mode="companion"] #clarity-day-landing-room{display:none!important;}',
      'html[data-shell-mode="companion"] #main-content{display:block!important;}',
      /* external provision never needed — Day room has native Do this today */
      "#clarity-provision-home,.clarity-provision-home{display:none!important;height:0!important;overflow:hidden!important;margin:0!important;min-height:0!important;}",
      'html[data-shell-mode="landing"] #clarity-dual-path,html[data-shell-mode="landing"] .clarity-dual-path{display:none!important;height:0!important;min-height:0!important;}',
      'html[data-shell-mode="companion"] #clarity-dual-path{display:none!important;}',
      'html[data-shell-mode="landing"] .clarity-gate-switcher,html[data-shell-mode="landing"] .rrra-sitewide{display:none!important;height:0!important;}',
      'html[data-shell-mode="companion"] .clarity-gate-switcher{display:flex!important;visibility:visible!important;height:auto!important;min-height:2.75rem!important;flex-wrap:wrap;gap:0.35rem;margin:0.45rem 0.5rem;padding:0.5rem;border-radius:14px;border:1px solid rgba(15,76,58,0.22);}',
      'html[data-shell-mode="landing"] #clarity-door-rail,html[data-shell-mode="landing"] .door-rail-bottom{display:none!important;height:0!important;}',
      'html[data-shell-mode="companion"] #clarity-door-rail{display:flex!important;}'
    ].join("");
    document.head.appendChild(s);
  }
  function run() {
    inject();
    document.querySelectorAll("#clarity-provision-home,.clarity-provision-home").forEach(function (el) {
      el.style.setProperty("display", "none", "important");
    });
    document.querySelectorAll("#clarity-dual-path,.clarity-dual-path").forEach(function (el) {
      el.style.setProperty("display", "none", "important");
    });
    if (mode() === "landing") {
      document.querySelectorAll(".clarity-gate-switcher,#clarity-door-rail").forEach(function (el) {
        el.style.setProperty("display", "none", "important");
      });
    }
  }
  [20, 100, 400, 1000, 2500].forEach(function (ms) { setTimeout(run, ms); });
  setInterval(run, 2000);
})(typeof window !== "undefined" ? window : this);
