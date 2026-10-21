/* Companion perf — lazy iframes */
(function () {
  "use strict";
  if (window.__CLARITY_COMPANION_PERF_V1__) return;
  window.__CLARITY_COMPANION_PERF_V1__ = true;

  function boot() {
    var list = document.querySelectorAll("iframe[src*='youtube'], iframe[src*='youtu.be']");
    list.forEach(function (iframe) {
      if (iframe.dataset.perfLazy === "1") return;
      iframe.dataset.perfLazy = "1";
      var src = iframe.getAttribute("src");
      if (!src || iframe.id === "banner-live") return;
      iframe.setAttribute("data-src", src);
      iframe.removeAttribute("src");
      iframe.setAttribute("loading", "lazy");
    });
    function loadOne(iframe) {
      var s = iframe.getAttribute("data-src");
      if (s && !iframe.getAttribute("src")) iframe.setAttribute("src", s);
    }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            loadOne(en.target);
            io.unobserve(en.target);
          }
        });
      }, { rootMargin: "240px 0px" });
      document.querySelectorAll("iframe[data-src]").forEach(function (f) { io.observe(f); });
    }
    document.addEventListener("click", function (ev) {
      var t = ev.target;
      if (!t || !t.closest) return;
      var host = t.closest("details, .card, [data-open]");
      if (host) host.querySelectorAll("iframe[data-src]").forEach(loadOne);
    }, true);
  }

  function idle(fn) {
    if (window.requestIdleCallback) requestIdleCallback(fn, { timeout: 2500 });
    else setTimeout(fn, 800);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { idle(boot); });
  } else idle(boot);
})();
