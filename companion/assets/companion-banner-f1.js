/*! companion-banner-f1.js · DISABLED
 * Removed: duplicate of full AV banner (Hijri calendar + salah already above path tiles).
 * Wrong Intl hijri string ("BC") was misleading.
 * Educational only — not a fatwa.
 */
(function () {
  "use strict";
  try {
    var el = document.getElementById("banner-f1");
    if (el && el.parentNode) el.parentNode.removeChild(el);
  } catch (e) {}
})();
