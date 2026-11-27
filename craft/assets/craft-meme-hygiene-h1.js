/*! craft-meme-hygiene-h1.js · Phase H de-fossilize
 * Single memeFetchBg owner · silence dual online-bg competition when nuke/sync present
 * Educational only — not a fatwa
 */
(function (w) {
  "use strict";
  if (w.__CRAFT_MEME_HYGIENE_H1__) return;
  w.__CRAFT_MEME_HYGIENE_H1__ = true;

  var primary = w.memeFetchBg;
  if (typeof primary === "function") {
    w.memeFetchBg = function (kind) {
      try {
        return primary.apply(this, arguments);
      } catch (e) {}
    };
    w.memeFetchBg.__hygiene = true;
  }

  /* Prefer sync-nuke / bg-v1; do not chain second online surprise on boot */
  try {
    if (w.__CRAFT_MEME_SYNC_NUKE_V1__ || w.__CRAFT_MEME_BG_V1__) {
      w.__CLARITY_MEME_HYGIENE_SKIP_DOUBLE_BOOT__ = true;
    }
  } catch (e2) {}
})(window);
