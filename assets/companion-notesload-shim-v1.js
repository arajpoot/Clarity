/* companion-notesload-shim-v1.js · 20261026FIX
 * Prevents ReferenceError: notesLoad is not defined when callers race recovery.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_NOTESLOAD_SHIM__) return;
  g.__CLARITY_NOTESLOAD_SHIM__ = true;

  function stub() {
    try {
      if (typeof g.__notesLoadReal === "function") return g.__notesLoadReal.apply(this, arguments);
      if (typeof g.notesLoad === "function" && g.notesLoad !== stub) return g.notesLoad.apply(this, arguments);
    } catch (e) {}
    return undefined;
  }

  if (typeof g.notesLoad !== "function") {
    g.notesLoad = stub;
  }

  /* Re-bind when recovery arrives */
  var n = 0;
  var iv = setInterval(function () {
    n++;
    if (typeof g.__notesLoadReal === "function") {
      g.notesLoad = g.__notesLoadReal;
      clearInterval(iv);
    } else if (n > 50) {
      clearInterval(iv);
    }
  }, 100);

  /* Safe global call wrapper used by delayed boot */
  g.clarityNotesLoadSafe = function () {
    try {
      if (typeof g.notesLoad === "function") g.notesLoad();
    } catch (e) {}
  };
})(typeof window !== "undefined" ? window : this);
