/*! craft-meme-canvas-clean-v1 · C19MEME5 neutered — delegates to paint-standard */
(function (w) {
  "use strict";
  w.__CRAFT_MEME_CANVAS_CLEAN_NEUTERED__ = true;
  function paint() {
    if (typeof w.memeDraw === "function") try { w.memeDraw(); } catch (e) {}
  }
  w.addEventListener("load", function () { setTimeout(paint, 500); });
})(window);
