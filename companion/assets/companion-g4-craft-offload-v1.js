/*! companion-g4-craft-offload-v1 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_G4_OFFLOAD_V1__) return;
  w.__CLARITY_G4_OFFLOAD_V1__ = true;
  var LOG = (w.__G4_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  var HIDE_IDS = [
    "callig-lab-card", "callig-canvas", "callig-stage-wrap", "callig-pad-control-bar",
    "callig-mic-panel", "nx-tajweed-deep-studio-v1", "tajweed-live-card",
    "meme-card", "meme-studio-root"
  ];

  function hardHide() {
    HIDE_IDS.forEach(function (id) {
      var el = d.getElementById(id);
      if (!el) return;
      el.setAttribute("hidden", "hidden");
      el.style.setProperty("display", "none", "important");
      log("hide:" + id);
    });
  }

  function markReset() {
    var g = d.querySelector(".clarity-gate-switcher");
    if (!g) return;
    g.querySelectorAll("button, a").forEach(function (btn) {
      var t = (btn.textContent || "").toLowerCase();
      if (/reset/.test(t) || btn.id === "clarity-path-reset-btn") {
        btn.classList.add("cgs-reset");
      }
    });
    log("reset-marked");
  }

  function boot() {
    hardHide();
    markReset();
    setTimeout(function () { hardHide(); markReset(); }, 400);
    log("g4-boot");
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
