/*! companion-craft-idle-v1 · C3 · load meme/craft after idle · educational only */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_CRAFT_IDLE_V1__) return;
  w.__COMPANION_CRAFT_IDLE_V1__ = true;
  var V = "20261108C3";
  var FILES = [
    "/companion/assets/clarity-meme-api-bridge-v1.js",
    "/companion/assets/companion-meme-studio-fix-v1.js"
  ];
  function load(src) {
    if (d.querySelector('script[src*="'+src.split('/').pop().split('?')[0]+'"]')) return;
    var s = d.createElement("script");
    s.src = src + "?v=" + V;
    s.async = true;
    s.setAttribute("data-c3-craft", "1");
    d.body.appendChild(s);
  }
  function run() {
    FILES.forEach(load);
  }
  function schedule() {
    if (typeof w.requestIdleCallback === "function") {
      w.requestIdleCallback(run, { timeout: 8000 });
    } else {
      w.setTimeout(run, 2500);
    }
  }
  /* also load when user opens craft/meme UI */
  d.addEventListener("click", function (ev) {
    var t = ev.target && ev.target.closest && ev.target.closest("[data-craft], [data-meme], .meme-studio, #meme-studio, a[href*='meme'], a[href*='craft']");
    if (t) run();
  }, true);
  if (d.readyState === "complete") schedule();
  else w.addEventListener("load", schedule);
})(window, document);
