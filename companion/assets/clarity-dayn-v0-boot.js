/*! clarity-dayn-v0-boot · mount Dayn after Amānah sealed ready */
(function (w) {
  "use strict";
  if (w.__CLARITY_DAYN_V0_BOOT__) return;
  w.__CLARITY_DAYN_V0_BOOT__ = true;

  function tryBoot() {
    try {
      if (typeof w.ClarityLoadAmanaSealed === "function") {
        /* sealed may already be loading on hash notes */
      }
      // ledger v2 exposes boot via IIFE; fire soft events
      w.dispatchEvent(new CustomEvent("clarity-dayn-v0-mount"));
      // common boot names
      ["boot", "clarityDaynBoot", "daynBoot"].forEach(function (n) {
        try {
          if (typeof w[n] === "function") w[n]();
        } catch (e) {}
      });
      // force re-scan of slots if bridge left tick
      try {
        if (w.document) {
          var land = document.getElementById("clarity-landing-slot-dayn");
          var vault = document.getElementById("clarity-vault-slot-dayn");
          if (land) land.setAttribute("data-dayn-v0", "1");
          if (vault) vault.setAttribute("data-dayn-v0", "1");
        }
      } catch (e2) {}
    } catch (e) {}
  }

  function onSealed() {
    tryBoot();
    setTimeout(tryBoot, 400);
    setTimeout(tryBoot, 1200);
  }

  document.addEventListener("clarity-amana-sealed-ready", onSealed);
  w.addEventListener("clarity-amana-sealed-ready", onSealed);

  // if user opens Amānah or lands with slots visible
  document.addEventListener("clarity-amana-enter", function () {
    if (typeof w.ClarityLoadAmanaSealed === "function") {
      w.ClarityLoadAmanaSealed().then(onSealed).catch(function () { onSealed(); });
    } else onSealed();
  });

  function maybe() {
    try {
      var h = (w.location.hash || "").toLowerCase();
      if (/notes|amana|vault|dayn|heir/.test(h) && typeof w.ClarityLoadAmanaSealed === "function") {
        w.ClarityLoadAmanaSealed().then(onSealed).catch(function () { onSealed(); });
      } else {
        // landing Dayn: load sealed only if gate allows landing without full vault — still need ledger scripts
        // Load sealed pack when landing slot is present so entry works outside unlock
        var land = document.getElementById("clarity-landing-slot-dayn");
        if (land && typeof w.ClarityLoadAmanaSealed === "function") {
          w.ClarityLoadAmanaSealed().then(onSealed).catch(function () { onSealed(); });
        } else {
          tryBoot();
        }
      }
    } catch (e) {
      tryBoot();
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(maybe, 600); });
  else setTimeout(maybe, 600);
  w.addEventListener("load", function () { setTimeout(maybe, 1500); });
  w.addEventListener("hashchange", function () { setTimeout(maybe, 300); });
})(window);
