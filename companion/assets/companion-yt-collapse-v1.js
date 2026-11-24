/*! companion-yt-collapse-v1 · load iframe only when expanded · educational only */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_YT_COLLAPSE_V1__) return;
  w.__COMPANION_YT_COLLAPSE_V1__ = true;

  function wire(root) {
    root = root || d;
    root.querySelectorAll("details.cs-yt-collapse").forEach(function (det) {
      if (det.__ytWired) return;
      det.__ytWired = true;
      det.addEventListener("toggle", function () {
        if (!det.open) return;
        var fr = det.querySelector("iframe.cs-yt-frame[data-src]");
        if (!fr) return;
        if (!fr.getAttribute("src")) {
          fr.setAttribute("src", fr.getAttribute("data-src"));
        }
      });
    });
  }

  function boot() {
    wire(d);
    var m = d.getElementById("cs-mount");
    if (m) {
      new MutationObserver(function () { wire(m); }).observe(m, { childList: true, subtree: true });
    }
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
