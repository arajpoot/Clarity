/**
 * Tajweed surface bridge · 20261024FULL
 * Rule chips + URL deep-link; LMR owns fetch/record/score/read-along
 */
(function () {
  "use strict";
  function $(id) { return document.getElementById(id); }
  function boot() {
    var VP = window.CuVersePractice;
    if (VP && $("tj-lmr-surah")) VP.fillSurahSelect($("tj-lmr-surah"));

    document.querySelectorAll("[data-lab-load]").forEach(function (b) {
      b.addEventListener("click", function () {
        var parts = (b.getAttribute("data-lab-load") || "1:1").split(":");
        if ($("tj-lmr-surah")) $("tj-lmr-surah").value = parts[0];
        if ($("tj-lmr-ayah")) $("tj-lmr-ayah").value = parts[1];
        var fetchBtn = $("tj-lmr-fetch");
        if (fetchBtn) fetchBtn.click();
      });
    });

    try {
      var q = new URLSearchParams(location.search);
      if (q.get("surah") && $("tj-lmr-surah")) {
        $("tj-lmr-surah").value = q.get("surah");
        if (q.get("ayah") && $("tj-lmr-ayah")) $("tj-lmr-ayah").value = q.get("ayah");
        setTimeout(function () {
          var fetchBtn = $("tj-lmr-fetch");
          if (fetchBtn) fetchBtn.click();
        }, 450);
      }
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
