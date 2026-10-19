/**
 * Tajweed surface bridge · 20261018TJFIX
 * Rule chips set surah/ayah and trigger fetch; resilient if LMR boots late.
 */
(function () {
  "use strict";
  if (window.__CU_TJ_STUDIO_FIX__) return;
  window.__CU_TJ_STUDIO_FIX__ = true;

  function $(id) {
    return document.getElementById(id);
  }

  function setVal(id, val) {
    var el = $(id);
    if (!el) return false;
    el.value = String(val);
    try {
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    } catch (e) {}
    return true;
  }

  function doFetch() {
    var fetchBtn = $("tj-lmr-fetch") || $("tj-lmr-fetch-rule");
    if (fetchBtn) {
      try {
        fetchBtn.click();
        return true;
      } catch (e) {}
    }
    return false;
  }

  function loadRef(ref) {
    var parts = String(ref || "1:1").split(":");
    setVal("tj-lmr-surah", parts[0] || "1");
    setVal("tj-lmr-ayah", parts[1] || "1");
    setTimeout(function () {
      if (!doFetch()) {
        setTimeout(doFetch, 300);
        setTimeout(doFetch, 900);
      }
    }, 40);
  }

  function wireChips() {
    document.querySelectorAll("[data-lab-load]").forEach(function (b) {
      if (b.__tjWired) return;
      b.__tjWired = true;
      b.addEventListener("click", function (e) {
        e.preventDefault();
        loadRef(b.getAttribute("data-lab-load") || "1:1");
      });
    });
  }

  function fillSurah() {
    try {
      var VP = window.CuVersePractice;
      if (VP && typeof VP.fillSurahSelect === "function" && $("tj-lmr-surah")) {
        VP.fillSurahSelect($("tj-lmr-surah"));
      }
    } catch (e) {}
  }

  function boot() {
    fillSurah();
    wireChips();
    try {
      var q = new URLSearchParams(location.search);
      if (q.get("surah")) {
        setVal("tj-lmr-surah", q.get("surah"));
        if (q.get("ayah")) setVal("tj-lmr-ayah", q.get("ayah"));
        setTimeout(doFetch, 400);
      }
    } catch (e) {}
    setTimeout(wireChips, 500);
    setTimeout(wireChips, 1500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  window.addEventListener("load", function () {
    setTimeout(boot, 200);
  });
})();
