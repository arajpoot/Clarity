/* FD6 — Smart prefetch for university routes (idle + hover) */
(function (g) {
  "use strict";
  if (g.__CU_FLASH_PREFETCH_V6__) return;
  g.__CU_FLASH_PREFETCH_V6__ = true;

  var done = {};

  function prefetch(url) {
    if (!url || done[url]) return;
    done[url] = true;
    try {
      var l = document.createElement("link");
      l.rel = "prefetch";
      l.href = url;
      l.as = "document";
      document.head.appendChild(l);
    } catch (e) {}
  }

  function path() {
    return location.pathname || "";
  }

  function scheduleIdle(fn) {
    if (g.requestIdleCallback) g.requestIdleCallback(fn, { timeout: 2500 });
    else setTimeout(fn, 600);
  }

  function routeHints() {
    var p = path();
    if (p.indexOf("/campus/desk") >= 0) {
      prefetch("/lab/");
      prefetch("/lab/tajweed/");
      prefetch("/vault/");
    } else if (p.indexOf("/lab") >= 0) {
      prefetch("/campus/desk/");
      prefetch("/lab/tajweed/");
      prefetch("/lab/arabic/");
      prefetch("/lab/recite/");
    } else if (p.indexOf("/vault") >= 0) {
      prefetch("/campus/");
      prefetch("/campus/desk/");
    } else if (p.indexOf("/journey") >= 0 || p.indexOf("/charter") >= 0) {
      prefetch("/campus/");
      prefetch("/campus/desk/");
      prefetch("/lab/");
    } else {
      /* Map and default */
      prefetch("/campus/desk/");
      prefetch("/lab/");
      prefetch("/vault/");
      prefetch("/journey/");
    }
  }

  function armHover() {
    document.querySelectorAll(".cu-pills a, .cu-card, .cu-rich-card, .lab-card, a[href^='/campus'], a[href^='/lab'], a[href^='/vault']").forEach(function (a) {
      if (a.__cuPrefetchBound) return;
      a.__cuPrefetchBound = true;
      var href = a.getAttribute("href");
      if (!href || href.charAt(0) !== "/") return;
      a.addEventListener(
        "pointerenter",
        function () {
          prefetch(href.split("?")[0]);
        },
        { passive: true }
      );
    });
  }

  function boot() {
    scheduleIdle(function () {
      routeHints();
      armHover();
    });
    setTimeout(armHover, 1200);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
