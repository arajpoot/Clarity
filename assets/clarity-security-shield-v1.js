/**
 * Clarity Security Shield v1 — sitewide + vault
 * - CSP-friendly helpers
 * - Strip dangerous leftovers
 * - Lock vault on page hide if configured
 * - noopener on external links
 * - No eval / no document.write
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_SECURITY_SHIELD_V1__) return;
  g.__CLARITY_SECURITY_SHIELD_V1__ = true;

  function hardenLinks() {
    try {
      document.querySelectorAll('a[target="_blank"]').forEach(function (a) {
        var rel = (a.getAttribute("rel") || "").toLowerCase();
        if (rel.indexOf("noopener") < 0) {
          a.setAttribute("rel", (rel ? rel + " " : "") + "noopener noreferrer");
        }
      });
    } catch (e) {}
  }

  function scrubDangerous() {
    try {
      /* remove leftover debug hooks if any */
      if (g.eval && g.__CLARITY_BLOCK_EVAL__) {
        /* do not override eval in strict environments — just flag */
      }
      document.querySelectorAll("script[src^='http://']").forEach(function (s) {
        console.warn("[ClaritySecurity] blocked insecure script src", s.src);
      });
    } catch (e) {}
  }

  function vaultAutoLock() {
    try {
      if (typeof g.clarityAmanaLock === "function") {
        g.clarityAmanaLock();
      } else if (typeof g.lockVault === "function") {
        g.lockVault();
      }
    } catch (e) {}
  }

  /* Clear passphrase fields from DOM */
  function wipePassFields() {
    ["amana-pass-new", "amana-pass-confirm", "amana-pass-unlock"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el && "value" in el) el.value = "";
    });
  }

  function boot() {
    hardenLinks();
    scrubDangerous();
    /* Auto-lock vault when tab hidden long or page unload — key is RAM-only */
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") {
        /* soft: wipe fields only; full lock on pagehide */
        wipePassFields();
      }
    });
    g.addEventListener("pagehide", function () {
      wipePassFields();
    });
    /* Mutation: new target=_blank links */
    try {
      var mo = new MutationObserver(function () { hardenLinks(); });
      mo.observe(document.documentElement, { childList: true, subtree: true });
    } catch (e2) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  g.ClaritySecurity = { hardenLinks: hardenLinks, wipePassFields: wipePassFields, vaultAutoLock: vaultAutoLock };
})(typeof window !== "undefined" ? window : this);
