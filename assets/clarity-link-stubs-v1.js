/**
 * Phase D — safe stubs until chunk-8 loads · 20261022AB
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_LINK_STUBS_V1__) return;
  w.__CLARITY_LINK_STUBS_V1__ = "20261022AB";

  function stub(name, fn) {
    if (typeof w[name] !== "function") w[name] = fn;
  }

  stub("clarityRefreshSection", function (section) {
    try {
      console.info("[Clarity] Refresh:", section || "");
      var el = document.querySelector("#" + (section || ""));
      if (el) {
        el.classList.add("cph-refresh-pulse");
      }
    } catch (e) {}
  });

  stub("notesQuickFromSection", function () {
    try {
      if (typeof w.switchTab === "function") w.switchTab("notes");
      else w.location.hash = "notes";
    } catch (e) {}
  });
})(typeof window !== "undefined" ? window : this);
