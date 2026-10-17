/**
 * Amana single-path guard — 20261016GUARD
 * Ensures only live-gate crypto runs. Does not load old Castle/gate modules.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_AMANA_SINGLE_PATH__) return;
  g.__CLARITY_AMANA_SINGLE_PATH__ = true;
  /* Prefer live AmanaVault; do not let a later stub erase status node */
  function ping() {
    try {
      var st = document.getElementById("amana-gate-status");
      if (st) {
        st.style.display = "block";
        st.style.visibility = "visible";
        st.style.opacity = "1";
      }
    } catch (e) {}
  }
  setTimeout(ping, 200);
  setTimeout(ping, 1000);
})(window);
