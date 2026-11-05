/*! craft-studio-boot-v1 · C13 · safe open with retries */
(function (w, d) {
  "use strict";
  function tryOpen(apiName, rootId, tries) {
    tries = tries || 0;
    var root = d.getElementById(rootId);
    var api = w[apiName];
    if (root && api && typeof api.open === "function") {
      try {
        api.open(root);
        return true;
      } catch (e) {
        console.warn("[Craft]", apiName, e);
      }
    }
    if (tries < 8) {
      setTimeout(function () { tryOpen(apiName, rootId, tries + 1); }, 120 + tries * 40);
    }
    return false;
  }
  w.ClarityCraftStudioBoot = {
    tajweed: function () { return tryOpen("ClarityTajweedStudio", "tj-booth-root"); },
    calligraphy: function () { return tryOpen("ClarityCalligraphy", "cg-root"); },
    media: function () { return tryOpen("ClarityMediaReminder", "mr-root"); }
  };
})(window, document);
