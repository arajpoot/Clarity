/*! banner-enrich-polish-v1.4 · surah search · height · educational only */
(function (w, d) {
  "use strict";
  if (w.__BANNER_ENRICH_POLISH_V14__) return;
  w.__BANNER_ENRICH_POLISH_V14__ = true;

  function wireSurahSearch() {
    var inp = d.getElementById("surah-search");
    var sel = d.getElementById("surah-list-pill");
    if (!inp || !sel || inp.__wired) return;
    inp.__wired = true;
    inp.addEventListener("input", function () {
      var q = String(inp.value || "").toLowerCase().trim();
      var opts = sel.options;
      var firstVisible = -1;
      for (var i = 0; i < opts.length; i++) {
        var t = String(opts[i].text || "").toLowerCase();
        var show = !q || t.indexOf(q) >= 0 || String(opts[i].value) === q;
        opts[i].hidden = !show && opts[i].value !== "";
        opts[i].disabled = opts[i].hidden;
        if (show && opts[i].value && firstVisible < 0) firstVisible = i;
      }
      if (q && firstVisible >= 0) sel.selectedIndex = firstVisible;
    });
  }

  function postHeight() {
    try {
      var ban = d.querySelector(".banner") || d.body;
      var h = Math.ceil((ban && ban.getBoundingClientRect().height) || 0);
      if (h > 60 && w.parent && w.parent !== w) {
        w.parent.postMessage({ type: "clarity-banner-height", height: Math.min(h + 4, 480) }, "*");
      }
    } catch (e) {}
  }

  function boot() {
    wireSurahSearch();
    postHeight();
    d.documentElement.setAttribute("data-banner-enrich", "20261112E4");
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(boot, 80);
    setTimeout(postHeight, 400);
  });
  setInterval(postHeight, 2500);
})(window, document);
