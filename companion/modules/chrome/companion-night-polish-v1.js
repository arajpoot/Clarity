/*! companion-night-polish-v1.js · Phase Night
 * Review footer on mount · soft night class · educational only — not a fatwa
 * Version: 20261128NIGHT
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_NIGHT_POLISH_V1__) return;
  w.__COMPANION_NIGHT_POLISH_V1__ = true;

  function qs(sel, root) {
    try {
      return (root || d).querySelector(sel);
    } catch (e) {
      return null;
    }
  }

  function ensureFooter() {
    var mount = qs("#cs-mount");
    if (!mount) return;
    var existing = qs("#cn-review-footer", mount) || qs("#cn-review-footer");
    if (existing) {
      /* keep single footer at end of mount */
      if (existing.parentNode === mount && existing !== mount.lastElementChild) {
        mount.appendChild(existing);
      }
      return;
    }
    var foot = d.createElement("footer");
    foot.id = "cn-review-footer";
    foot.setAttribute("role", "contentinfo");
    foot.innerHTML =
      '<strong>Last reviewed</strong> · Nov 2026 · ' +
      '<a href="https://quran.com" target="_blank" rel="noopener">Quran.com</a> · ' +
      '<a href="https://sunnah.com" target="_blank" rel="noopener">Sunnah.com</a> · ' +
      "educational companion · <strong>not a fatwa</strong>";
    mount.appendChild(foot);
  }

  function markNight() {
    try {
      d.documentElement.classList.add("cn-night");
      if (d.body) d.body.classList.add("cn-night");
    } catch (e) {}
  }

  function boot() {
    markNight();
    ensureFooter();
  }

  d.addEventListener("clarity:tab-mounted", function () {
    setTimeout(ensureFooter, 80);
    setTimeout(ensureFooter, 400);
  });

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 120); });
  else setTimeout(boot, 120);
  w.addEventListener("load", function () { setTimeout(boot, 500); });

  w.CompanionNightPolish = { boot: boot, version: "20261128NIGHT" };
})(window, document);
