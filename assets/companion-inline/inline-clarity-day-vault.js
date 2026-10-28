/**
 * Day vault PASSIVE · 20261028URLSHELL
 * No mode ownership. Only reinforces isolation CSS.
 * Shell (URL) is the sole mode owner.
 */
(function () {
  "use strict";
  if (window.__CLARITY_VAULT_PASSIVE__) return;
  window.__CLARITY_VAULT_PASSIVE__ = true;
  if (document.getElementById("clarity-vault-passive-css")) return;
  var s = document.createElement("style");
  s.id = "clarity-vault-passive-css";
  s.textContent = [
    'html[data-shell-mode="day"] .clarity-gate-switcher,html[data-shell-mode="landing"] .clarity-gate-switcher,',
    'html[data-shell-mode="day"] .cgp-track-plaque,html[data-shell-mode="landing"] .cgp-track-plaque{',
    "display:none!important;height:0!important;min-height:0!important;overflow:hidden!important;margin:0!important;}",
    'html[data-shell-mode="companion"] .clarity-gate-switcher{display:flex!important;visibility:visible!important;height:auto!important;min-height:2.75rem!important;}',
    "#clarity-provision-home,.clarity-provision-home,#clarity-dual-path,.clarity-dual-path{",
    "display:none!important;height:0!important;min-height:0!important;}"
  ].join("");
  document.head.appendChild(s);
})();
