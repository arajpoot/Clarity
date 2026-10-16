/* Compass FAB DISABLED 20261016PAUSE — grey strip root cause removed */
(function (g) {
  "use strict";
  if (g.__CU_COMPASS_FAB_V1__) return;
  g.__CU_COMPASS_FAB_V1__ = true;
  function nuke() {
    try {
      document.querySelectorAll("#cu-compass-panel,#cu-compass-fab").forEach(function (el) {
        el.remove();
      });
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", nuke);
  else nuke();
  setTimeout(nuke, 400);
  setTimeout(nuke, 1200);
  setTimeout(nuke, 2500);
})(typeof window !== "undefined" ? window : this);
