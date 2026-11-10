/*! craft-meme-atelier-v1 · C19MEME5 neutered — paint owned by paint-standard */
(function (w) {
  "use strict";
  w.__CRAFT_MEME_ATELIER_NEUTERED__ = true;
  function defer() {
    if (typeof w.memeDraw === "function") try { w.memeDraw(); } catch (e) {}
  }
  w.paintWithBg = w.paintWithBg || defer;
  w.paintCanvas = w.paintCanvas || defer;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", defer);
  else setTimeout(defer, 300);
})(window);
