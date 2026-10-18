/**
 * N3 Loader stability — single stage mount, less flash.
 * University desks only. Educational only.
 */
(function (g) {
  "use strict";
  if (g.__CU_LOADER_N3__) return;
  g.__CU_LOADER_N3__ = true;

  var stageLocked = false;

  function stage() {
    return document.getElementById("cu-stage");
  }

  /** Prevent wiping stage after first successful curriculum paint */
  function lockStageOnce() {
    var el = stage();
    if (!el || stageLocked) return;
    if (el.children.length > 0 || (el.textContent || "").trim().length > 40) {
      stageLocked = true;
      el.setAttribute("data-n3-mounted", "1");
    }
  }

  /** If something empties stage after mount, do not loop forever — soft flag */
  var empties = 0;
  function watch() {
    var el = stage();
    if (!el) return;
    if (typeof MutationObserver === "undefined") return;
    var obs = new MutationObserver(function () {
      lockStageOnce();
      if (el.getAttribute("data-n3-mounted") === "1" && el.children.length === 0) {
        empties += 1;
        if (empties > 5) {
          try {
            obs.disconnect();
          } catch (e) {}
        }
      }
    });
    obs.observe(el, { childList: true, subtree: true });
  }

  /** Collapse duplicate foundation script tags for same file */
  function dedupeCurrScripts() {
    try {
      var seen = {};
      document.querySelectorAll("script[data-cu-curr]").forEach(function (s) {
        var k = s.getAttribute("data-cu-curr") || "";
        if (!k) return;
        if (seen[k]) {
          try {
            s.parentNode.removeChild(s);
          } catch (e) {}
        } else {
          seen[k] = true;
        }
      });
    } catch (e) {}
  }

  function boot() {
    watch();
    lockStageOnce();
    dedupeCurrScripts();
    setTimeout(lockStageOnce, 500);
    setTimeout(lockStageOnce, 1500);
    setTimeout(dedupeCurrScripts, 2000);
  }

  g.cuN3StageMounted = function () {
    return !!(stage() && stage().getAttribute("data-n3-mounted") === "1");
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(window);
