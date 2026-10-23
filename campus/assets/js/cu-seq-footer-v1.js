/* 20261023HK2 */
/* 20261023C4 */
/* 20261023CLEAN cleanse */
/**
 * cu-seq-footer-v1.js — University limits footer
 */
(function () {
  "use strict";
  if (window.__CU_SEQ_FOOTER_V1__) return;
  window.__CU_SEQ_FOOTER_V1__ = true;
  function boot() {
    if (document.getElementById("cu-seq-footer")) return;
    var f = document.createElement("footer");
    f.id = "cu-seq-footer";
    f.className = "cu-seq-footer";
    f.innerHTML =
      "Educational only — not a fatwa. Not a grade of īmān. Not affiliated with any seminary. Last reviewed October 2026 · " +
      '<a href="https://quran.com/" target="_blank" rel="noopener">Quran.com</a> / ' +
      '<a href="https://sunnah.com/" target="_blank" rel="noopener">Sunnah.com</a>';
    document.body.appendChild(f);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
