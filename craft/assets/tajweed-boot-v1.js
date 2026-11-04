/** Boot Deep Studio + meter booth · educational only */
(function () {
  "use strict";
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  ready(function () {
    var root = document.getElementById("tj-booth-root");
    function mount() {
      if (root && window.ClarityTajweedStudio && typeof window.ClarityTajweedStudio.open === "function") {
        try { window.ClarityTajweedStudio.open(root); return true; } catch (e) {
          console.warn("[Craft Tajweed]", e);
        }
      }
      return false;
    }
    if (!mount() && root) {
      root.innerHTML = '<p class="panel-note">Loading booth from /assets/craft/tajweed-studio-v1.js…</p>';
      setTimeout(function () {
        if (!mount() && root) {
          root.innerHTML = '<p class="panel-note">Booth asset not ready. Use <a href="/campus/lab/tajweed/">Lab Tajweed</a>.</p>';
        }
      }, 450);
    }
    console.info("[Clarity Craft] Tajweed page ready · five-door nav");
  });
})();
