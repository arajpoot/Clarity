/*! companion-rrra-quiet-v1 · remove legacy RRRA rail chrome after tab mount
 * Does not delete educational cards (data-rrra on cards kept for meme filters).
 * Educational only — not a fatwa. Companion only.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_RRRA_QUIET_V1__) return;
  w.__COMPANION_RRRA_QUIET_V1__ = true;

  var KILL = [
    ".rrra-hub-summary",
    ".rrra-hub-hero",
    ".rrra-hub-meta",
    ".clarity-gate-switcher",
    ".rrra-sitewide",
    '[aria-label="Learning track — switch anytime"]'
  ].join(",");

  function quiet(root) {
    root = root || d.getElementById("cs-mount");
    if (!root) return;
    root.querySelectorAll(KILL).forEach(function (el) {
      el.setAttribute("hidden", "");
      el.style.setProperty("display", "none", "important");
    });
    // Neutralize hub body id so legacy scripts don't treat it as a rail host
    root.querySelectorAll('[id^="rrra-hub-body"]').forEach(function (el) {
      el.id = el.id.replace("rrra-hub-body", "cs-tab-sections");
      el.classList.remove("rrra-hub-body");
      el.classList.add("cs-tab-sections");
    });
  }

  function boot() {
    quiet();
    var mount = d.getElementById("cs-mount");
    if (!mount || typeof MutationObserver === "undefined") return;
    var t = null;
    new MutationObserver(function () {
      if (t) clearTimeout(t);
      t = setTimeout(function () {
        quiet(mount);
      }, 30);
    }).observe(mount, { childList: true, subtree: false });
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
