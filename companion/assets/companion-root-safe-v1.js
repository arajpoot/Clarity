/*! companion-root-safe-v1 · never call getElementById on Element roots
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_ROOT_SAFE_V1__) return;
  w.__COMPANION_ROOT_SAFE_V1__ = true;
  var orig = Document.prototype.getElementById;
  /* Do not patch Element — just expose helper */
  w.clarityGetById = function (id, root) {
    if (root && root.querySelector) {
      var el = root.querySelector("#" + CSS.escape(id));
      if (el) return el;
    }
    return d.getElementById(id);
  };
})(window, document);
