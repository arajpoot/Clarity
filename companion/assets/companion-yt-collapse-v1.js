/*! companion-yt-collapse-v1 · P1F · load on expand · educational only */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_YT_COLLAPSE_V1F__) return;
  w.__COMPANION_YT_COLLAPSE_V1F__ = true;

  function activate(fr) {
    if (!fr) return;
    var ds = fr.getAttribute("data-src");
    if (ds && !fr.getAttribute("src")) {
      fr.setAttribute("src", ds);
    }
  }

  function wire(root) {
    root = root || d;
    root.querySelectorAll("details.cs-yt-collapse").forEach(function (det) {
      if (det.__ytWired) return;
      det.__ytWired = true;
      function onOpen() {
        if (!det.open) return;
        activate(det.querySelector("iframe.cs-yt-frame"));
      }
      det.addEventListener("toggle", onOpen);
      if (det.open) onOpen();
    });
  }

  function boot() {
    wire(d);
    var m = d.getElementById("cs-mount");
    if (m) {
      new MutationObserver(function () { wire(m); }).observe(m, { childList: true, subtree: true });
    }
    // delegated fallback
    d.addEventListener("toggle", function (ev) {
      var det = ev.target;
      if (!det || !det.classList || !det.classList.contains("cs-yt-collapse")) return;
      if (det.open) activate(det.querySelector("iframe.cs-yt-frame"));
    }, true);
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
