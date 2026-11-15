/*! companion-housekeep-v1 · post-mount hero/studio hygiene
 * Educational only — not a fatwa. Companion only.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_HOUSEKEEP_V1__) return;
  w.__COMPANION_HOUSEKEEP_V1__ = true;

  function hygiene(root) {
    root = root || d.getElementById("cs-mount");
    if (!root) return;
    // Single visual hero: demote extra headers
    var heroes = root.querySelectorAll(".cs-tab-hero, .rrra-hub-hero");
    heroes.forEach(function (el, i) {
      if (i === 0 && el.classList.contains("cs-tab-hero")) return;
      if (el.classList.contains("rrra-hub-hero")) {
        el.setAttribute("hidden", "");
        return;
      }
      if (i > 0) el.setAttribute("data-cs-extra-hero", "1");
    });
    root.querySelectorAll("[data-cs-dup='1']").forEach(function (el) {
      el.setAttribute("hidden", "");
    });
    // Content stream: only first primary keeps stream-primary weight
    var prim = root.querySelectorAll("[data-cs-primary='1']");
    prim.forEach(function (el, i) {
      if (i > 0) {
        el.setAttribute("data-cs-primary", "0");
        el.classList.remove("cs-stream-primary");
      }
    });
  }

  // Patch stream apply
  function patchStream() {
    var S = w.ClarityContentStreamV2;
    if (!S || S.__housekeep) return;
    var prev = S.apply;
    S.apply = function (root, tab, path) {
      if (typeof prev === "function") prev(root, tab, path);
      hygiene(root);
    };
    S.__housekeep = true;
  }

  function boot() {
    patchStream();
    hygiene();
    var mount = d.getElementById("cs-mount");
    if (mount && typeof MutationObserver !== "undefined") {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(function () {
          patchStream();
          hygiene(mount);
        }, 40);
      }).observe(mount, { childList: true, subtree: false });
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
