/*! amana-desk-landing-v1 · polished
 * Desk surface only. No passphrase UI. No banner.
 * Security: never read/write password fields on this page.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__AMANA_DESK_LANDING_V1__) return;
  w.__AMANA_DESK_LANDING_V1__ = true;

  function hideVaultChrome() {
    try {
      d.documentElement.setAttribute("data-amana-surface", "desk");
      d.documentElement.setAttribute("data-clarity-room", "amana");
      var g = d.getElementById("amana-vault-gate");
      if (g) {
        g.hidden = true;
        g.setAttribute("aria-hidden", "true");
        g.style.display = "none";
        /* strip password fields if a script injects them */
        g.querySelectorAll('input[type="password"]').forEach(function (inp) {
          inp.disabled = true;
          inp.value = "";
          inp.setAttribute("data-desk-stripped", "1");
        });
      }
      d.querySelectorAll(".amana-shariah-banner, header.amana-shariah-banner").forEach(function (el) {
        el.hidden = true;
        el.style.display = "none";
      });
      d.querySelectorAll(".amana-unlocked-only").forEach(function (el) {
        el.hidden = true;
      });
    } catch (e) {}
  }

  function boot() {
    hideVaultChrome();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", boot);
  setInterval(hideVaultChrome, 2500);
})(window, document);
