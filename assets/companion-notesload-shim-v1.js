/* companion-notesload-shim-v1.js · 20261026FIX2 — must load without defer, early in head */
(function (g) {
  "use strict";
  if (g.__CLARITY_NOTESLOAD_SHIM_V2__) return;
  g.__CLARITY_NOTESLOAD_SHIM_V2__ = true;

  var real = null;
  function notesLoad() {
    if (typeof real === "function") {
      try { return real.apply(this, arguments); } catch (e) { return undefined; }
    }
    if (typeof g.__notesLoadReal === "function") {
      real = g.__notesLoadReal;
      try { return real.apply(this, arguments); } catch (e) { return undefined; }
    }
    return undefined;
  }
  g.notesLoad = notesLoad;
  try { g.notesLoad = notesLoad; } catch (e) {}

  var n = 0;
  var iv = setInterval(function () {
    n++;
    if (typeof g.__notesLoadReal === "function") {
      real = g.__notesLoadReal;
      g.notesLoad = function () {
        try { return real.apply(this, arguments); } catch (e) { return undefined; }
      };
      clearInterval(iv);
    } else if (n > 80) clearInterval(iv);
  }, 50);
})(typeof window !== "undefined" ? window : this);
