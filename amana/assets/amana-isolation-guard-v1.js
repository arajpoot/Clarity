/*! amana-isolation-guard-v1 · Phase 6
 * Amānah on-device only. Blocks campus grade APIs from binding here.
 * Does not remove vault/dayn/heir modules.
 * Educational only — not a fatwa / not a will.
 */
(function (w, d) {
  "use strict";
  if (w.__AMANA_ISOLATION_GUARD_V1__) return;
  w.__AMANA_ISOLATION_GUARD_V1__ = true;

  function isAmana() {
    try {
      var p = (w.location && w.location.pathname) || "";
      return p === "/amana" || p.indexOf("/amana/") === 0;
    } catch (e) { return false; }
  }
  if (!isAmana()) return;

  var LOG = (w.__AMANA_ISOLATION_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  try {
    d.documentElement.setAttribute("data-clarity-room", "amana");
    d.documentElement.setAttribute("data-amana-sot", "1");
  } catch (e) {}

  /* Soft-block campus grade / university progress writers if leaked */
  var BLOCK = [
    "cuWriteCampusGrade",
    "cuMergeTranscriptIntoVault",
    "clarityImportCampusGrades",
    "cu_uni_progress_write_to_amana"
  ];
  BLOCK.forEach(function (name) {
    try {
      Object.defineProperty(w, name, {
        configurable: true,
        get: function () {
          log("blocked " + name);
          return function () {
            console.info("[Amānah] " + name + " is not allowed in this room");
            return null;
          };
        },
        set: function () { log("set-blocked " + name); }
      });
    } catch (e) {
      w[name] = function () { return null; };
    }
  });

  /* Nav highlight */
  function fixNav() {
    try {
      d.querySelectorAll(".clarity-room-nav a").forEach(function (a) {
        var here = a.getAttribute("data-room-link") === "amana" ||
          ((a.getAttribute("href") || "").indexOf("/amana") === 0);
        a.classList.toggle("is-here", !!here);
        if (here) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      });
    } catch (e) {}
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", fixNav);
  else fixNav();
  w.addEventListener("load", fixNav);

  log("amana isolation guard active");
})(window, document);
