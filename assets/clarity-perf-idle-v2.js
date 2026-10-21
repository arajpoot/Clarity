/** Phase C3 — idle secondary scripts · 20261021PERF3 */
(function (w) {
  "use strict";
  if (w.__CLARITY_PERF_IDLE_V2__) return;
  w.__CLARITY_PERF_IDLE_V2__ = "20261021PERF3";
  function load(src) {
    if (!src) return;
    var base = src.split("?")[0].split("/").pop();
    if (document.querySelector('script[src*="' + base + '"]')) return;
    var s = document.createElement("script");
    s.src = src;
    s.defer = true;
    document.head.appendChild(s);
  }
  function run() {
    load("/assets/craft/companion-meme-hide-v1.js?v=20261020ANCHOR");
    load("/assets/craft/companion-tools-restore-v1.js?v=20261020ANCHOR");
    load("/assets/clarity-pack-extend-v1.js?v=20261017FINAL");
    load("/assets/clarity-meme-bg-fetch-v1.js?v=20261020TABLIGH");
    load("/assets/clarity-one-daily-drill-v1.js?v=20261017FINAL");
    load("/assets/clarity-continue-v1.js?v=20261017FINAL");
    load("/assets/clarity-share-desks-v2.js?v=20261020GFIX");
    load("/assets/clarity-craft-action-only-v1.js?v=20261020ANCHOR");
    load("/assets/nuros-icons-apply-v1.js?v=20261020NUR");
  }
  if ("requestIdleCallback" in w) w.requestIdleCallback(run, { timeout: 3500 });
  else w.setTimeout(run, 2000);
})(window);
