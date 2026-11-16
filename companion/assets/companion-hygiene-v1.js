/*! companion-hygiene-v1.js · safe concat merge · enrichment held · educational only — not a fatwa */

/* ---- companion-housekeep-v1.js ---- */
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

/* ---- companion-rrra-quiet-v1.js ---- */
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

/* ---- companion-link-hygiene-v1.js ---- */
/*! companion-link-hygiene-v1 · P5i slim replacement for repair-v3 link bit
 * /yawm → /daily only. No mount races. Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_LINK_HYGIENE_V1__) return;
  w.__COMPANION_LINK_HYGIENE_V1__ = true;
  function fix(root) {
    root = root || d;
    try {
      root.querySelectorAll('a[href="/yawm/"],a[href="/yawm"]').forEach(function (a) {
        a.setAttribute("href", "/daily/");
      });
    } catch (e) {}
  }
  function boot() {
    fix(d);
    var m = d.getElementById("cs-mount");
    if (m && typeof MutationObserver !== "undefined") {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(function () { fix(m); }, 40);
      }).observe(m, { childList: true });
    }
    d.addEventListener("clarity:tab-mounted", function () { fix(d.getElementById("cs-mount") || d); });
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
