/*! clarity-dayn-v0-boot · mount Dayn after Amānah sealed ready · leak-safe */
(function (w) {
  "use strict";
  if (w.__CLARITY_DAYN_V0_BOOT__) return;
  w.__CLARITY_DAYN_V0_BOOT__ = true;

  var sealedPromise = null;
  var bootTimer = null;

  function tryBoot() {
    try {
      w.dispatchEvent(new CustomEvent("clarity-dayn-v0-mount"));
      ["boot", "clarityDaynBoot", "daynBoot"].forEach(function (n) {
        try { if (typeof w[n] === "function") w[n](); } catch (e) {}
      });
      var land = document.getElementById("clarity-landing-slot-dayn");
      var vault = document.getElementById("clarity-vault-slot-dayn");
      if (land) land.setAttribute("data-dayn-v0", "1");
      if (vault) vault.setAttribute("data-dayn-v0", "1");
    } catch (e) {}
  }

  function scheduleBoot() {
    if (bootTimer) clearTimeout(bootTimer);
    bootTimer = setTimeout(function () {
      bootTimer = null;
      tryBoot();
    }, 200);
  }

  function loadSealedOnce() {
    if (sealedPromise) return sealedPromise;
    if (typeof w.ClarityLoadAmanaSealed !== "function") {
      scheduleBoot();
      return Promise.resolve();
    }
    sealedPromise = w.ClarityLoadAmanaSealed().then(function () {
      scheduleBoot();
      setTimeout(scheduleBoot, 500);
      setTimeout(scheduleBoot, 1500);
      return "ready";
    }).catch(function () {
      sealedPromise = null;
      scheduleBoot();
    });
    return sealedPromise;
  }

  function onSealed() {
    scheduleBoot();
  }

  document.addEventListener("clarity-amana-sealed-ready", onSealed);
  w.addEventListener("clarity-amana-sealed-ready", onSealed);
  document.addEventListener("clarity-amana-enter", function () { loadSealedOnce(); });
  document.addEventListener("clarity-amana-unlocked", function () { scheduleBoot(); });

  function maybe() {
    try {
      var h = (w.location.hash || "").toLowerCase();
      var onAmana = (w.location.pathname || "").indexOf("/amana") === 0;
      var land = document.getElementById("clarity-landing-slot-dayn");
      if (onAmana || land || /notes|amana|vault|dayn|heir/.test(h)) {
        loadSealedOnce();
      } else {
        scheduleBoot();
      }
    } catch (e) {
      scheduleBoot();
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(maybe, 400); });
  else setTimeout(maybe, 400);
  w.addEventListener("load", function () { setTimeout(maybe, 1200); });
  w.addEventListener("hashchange", function () { setTimeout(maybe, 200); });
})(window);
