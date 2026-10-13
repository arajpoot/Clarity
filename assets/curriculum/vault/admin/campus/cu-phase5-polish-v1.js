/* Phase 5 — Companion exit hard-nav + polish hooks */
(function (g) {
  "use strict";
  if (g.__CU_PHASE5_POLISH_V1__) return;
  g.__CU_PHASE5_POLISH_V1__ = true;

  function wireCompanion() {
    document.querySelectorAll('a.cu-main-link, a[href="/"]').forEach(function (a) {
      var t = (a.textContent || "").toLowerCase();
      var href = a.getAttribute("href") || "";
      if (href !== "/" && href !== "/index.html") return;
      if (t.indexOf("companion") < 0 && !a.classList.contains("cu-main-link")) return;
      if (a.__p5) return;
      a.__p5 = true;
      a.addEventListener(
        "click",
        function (ev) {
          /* hard navigation — avoid SW/view-transition stickiness */
          ev.preventDefault();
          ev.stopPropagation();
          try {
            g.location.assign("/");
          } catch (e) {
            g.location.href = "/";
          }
        },
        true
      );
    });
  }

  function boot() {
    wireCompanion();
    setTimeout(wireCompanion, 500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
