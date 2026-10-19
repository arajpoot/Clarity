/**
 * Guides dock closer — R3 (lab + desk)
 * Closes on outside click, Escape, toggle, and student link click.
 */
(function () {
  "use strict";
  if (window.__CU_GUIDES_CLOSE_R3__) return;
  window.__CU_GUIDES_CLOSE_R3__ = true;

  function dock() {
    return document.getElementById("cu-personas-dock");
  }

  function close() {
    var d = dock();
    if (!d) return;
    var panel = d.querySelector(".cu-personas-dock-panel");
    var toggle = d.querySelector(".cu-personas-dock-toggle");
    if (panel) {
      panel.hidden = true;
      panel.setAttribute("hidden", "");
      panel.style.setProperty("display", "none", "important");
    }
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    d.classList.remove("open");
    d.classList.remove("is-open");
  }

  function isOpen() {
    var d = dock();
    if (!d) return false;
    var panel = d.querySelector(".cu-personas-dock-panel");
    if (!panel) return false;
    if (panel.hidden) return false;
    try {
      return window.getComputedStyle(panel).display !== "none";
    } catch (e) {
      return true;
    }
  }

  document.addEventListener(
    "click",
    function (e) {
      var d = dock();
      if (!d) return;
      var t = e.target;
      if (d.contains(t)) {
        if (t.closest && t.closest(".cu-personas-dock-item, a")) {
          setTimeout(close, 50);
        }
        return;
      }
      close();
    },
    true
  );

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });

  function boot() {
    close();
    setTimeout(close, 300);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  window.cuGuidesClose = close;
})();
