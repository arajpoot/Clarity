/** Phase C — idle load secondary tools · 20261021PERF */
(function (w) {
  "use strict";
  if (w.__CLARITY_PERF_IDLE_V2__) return;
  w.__CLARITY_PERF_IDLE_V2__ = true;
  function load(src) {
    if (document.querySelector('script[src*="' + src.split("/").pop().split("?")[0] + '"]')) return;
    var s = document.createElement("script");
    s.src = src;
    s.defer = true;
    document.head.appendChild(s);
  }
  function run() {
    /* packs only after idle — never block first paint */
    try {
      load("/assets/clarity-meme-bg-fetch-v1.js?v=20261021PERF");
    } catch (e) {}
  }
  if ("requestIdleCallback" in w) {
    w.requestIdleCallback(run, { timeout: 4000 });
  } else {
    w.setTimeout(run, 2500);
  }
})(window);
