/**
 * Curriculum tools bridge (campus) — soft notes/tajweed lazy hooks
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_CURRICULUM_TOOLS_V1__) return;
  w.__CLARITY_CURRICULUM_TOOLS_V1__ = true;
  function inject(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[src*="' + src.replace(/^\.\//, "") + '"]')) {
        resolve("already");
        return;
      }
      var s = document.createElement("script");
      s.src = src + (src.indexOf("?") >= 0 ? "&" : "?") + "v=20261009CAMPUS5";
      s.defer = true;
      s.onload = function () { resolve("loaded"); };
      s.onerror = function () { resolve("missing"); };
      (document.head || document.documentElement).appendChild(s);
    });
  }
  w.ClarityCurriculumTools = {
    notes: function () { return inject("./assets/clarity-notes-recovery-v1.js"); },
    tajweed: function () { return inject("./assets/nx-tj-lmr-js-v1.js"); }
  };
  // soft idle notes
  try {
    if ("requestIdleCallback" in w) {
      requestIdleCallback(function () { w.ClarityCurriculumTools.notes(); }, { timeout: 8000 });
    }
  } catch (e) {}
})(typeof window !== "undefined" ? window : this);
