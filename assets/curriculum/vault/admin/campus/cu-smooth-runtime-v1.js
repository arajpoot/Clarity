/* Smooth runtime — BeginIslam-like feel without React rewrite */
(function (g) {
  "use strict";
  if (g.__CU_SMOOTH_RT_V1__) return;
  g.__CU_SMOOTH_RT_V1__ = true;

  /* View Transitions API for same-origin nav when available */
  function enhanceLinks() {
    if (!g.document || !g.document.startViewTransition) return;
    document.querySelectorAll('a[href^="/campus"],a[href^="/lab"],a[href^="/library"],a[href^="/journey"],a[href^="/vault"],a[href^="/charter"],a[href^="/systems"]').forEach(function (a) {
      if (a.__cuVt) return;
      a.__cuVt = true;
      a.addEventListener("click", function (ev) {
        if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
        var href = a.getAttribute("href");
        if (!href || href.indexOf("#") === 0) return;
        ev.preventDefault();
        document.startViewTransition(function () {
          location.href = href;
        });
      });
    });
  }

  /* Mark campus pages for CSS */
  function markPage() {
    if (!document.body) return;
    if (!document.body.getAttribute("data-campus-page")) {
      var p = location.pathname || "";
      if (p.indexOf("/lab") === 0) document.body.setAttribute("data-campus-page", "lab");
      else if (p.indexOf("/campus/desk") === 0) document.body.setAttribute("data-campus-page", "desk");
      else if (p.indexOf("/campus") === 0) document.body.setAttribute("data-campus-page", "campus");
    }
  }

  function boot() {
    markPage();
    enhanceLinks();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
