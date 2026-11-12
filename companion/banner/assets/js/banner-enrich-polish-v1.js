/*! banner-enrich-polish-v1 · visual settle helpers · educational only — not a fatwa */
(function (w, d) {
  "use strict";
  if (w.__BANNER_ENRICH_POLISH_V1__) return;
  w.__BANNER_ENRICH_POLISH_V1__ = true;

  function markToday() {
    var grid = d.getElementById("hijri-cal-grid");
    if (!grid) return;
    var today = grid.querySelector(".is-today, .hc-day.is-today");
    if (today) today.classList.add("is-today");
  }

  function postHeight() {
    try {
      var h = Math.ceil(d.documentElement.scrollHeight || d.body.scrollHeight || 0);
      if (h > 80 && w.parent && w.parent !== w) {
        w.parent.postMessage({ type: "clarity-banner-height", height: h }, "*");
      }
    } catch (e) {}
  }

  function boot() {
    markToday();
    postHeight();
    d.documentElement.setAttribute("data-banner-enrich", "20261112E1");
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(boot, 100);
    setTimeout(postHeight, 400);
    setTimeout(postHeight, 1200);
  });
  setInterval(postHeight, 3000);
})(window, document);
