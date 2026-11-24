/*! meme-embed-host-bridge-v1 · optional height ping · educational only */
(function (w, d) {
  "use strict";
  if (w.__MEME_EMBED_BRIDGE__) return;
  w.__MEME_EMBED_BRIDGE__ = true;
  function ping() {
    try {
      var h = Math.max(d.documentElement.scrollHeight, d.body.scrollHeight, 600);
      w.parent.postMessage({ source: "clarity-companion-meme", type: "height", px: h }, "*");
      w.parent.postMessage({ source: "clarity-companion-meme", type: "ready" }, "*");
    } catch (e) {}
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { ping(); setTimeout(ping, 400); });
  else { ping(); setTimeout(ping, 400); }
})(window, document);
