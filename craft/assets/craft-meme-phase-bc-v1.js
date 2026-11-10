/*! craft-meme-phase-bc-v1 · C19MEME5 neutered — no dual paint */
(function (w) {
  "use strict";
  w.__CRAFT_MEME_PHASE_BC_NEUTERED__ = true;
  w.paintWithStoredBg = function () {
    if (typeof w.memeDraw === "function") try { w.memeDraw(); } catch (e) {}
  };
})(window);
