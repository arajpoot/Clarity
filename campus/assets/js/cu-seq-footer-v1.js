/**
 * cu-seq-footer-v1.js — Charter limits footer on University pages
 */
(function () {
  "use strict";
  if (window.__CU_SEQ_FOOTER_V1__) return;
  window.__CU_SEQ_FOOTER_V1__ = true;
  function boot() {
    if (document.getElementById("cu-uni-seq-footer")) return;
    var p = (location.pathname || "");
    if (
      p.indexOf("/campus") !== 0 &&
      p.indexOf("/lab") !== 0 &&
      p.indexOf("/library") !== 0 &&
      p.indexOf("/charter") !== 0 &&
      p.indexOf("/vault") !== 0
    )
      return;
    var f = document.createElement("footer");
    f.id = "cu-uni-seq-footer";
    f.className = "cu-uni-footer";
    f.innerHTML =
      'Educational only — not a fatwa. Not a grade of īmān. Not affiliated with any seminary. ' +
      'Last reviewed October 2026 · <a href="https://quran.com/" target="_blank" rel="noopener">Quran.com</a> / ' +
      '<a href="https://sunnah.com/" target="_blank" rel="noopener">Sunnah.com</a> · ' +
      '<a href="/charter/">University Charter</a>';
    document.body.appendChild(f);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
