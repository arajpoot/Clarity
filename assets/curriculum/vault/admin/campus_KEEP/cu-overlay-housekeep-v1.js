/* Overlay housekeeping — contain wing desks that paint without a modal shell */
(function (g) {
  "use strict";
  if (g.__CU_OVERLAY_HK_V1__) return;
  g.__CU_OVERLAY_HK_V1__ = true;

  var SELECTORS = [
    ".clarity-faculty-modal",
    ".clarity-it-modal",
    ".clarity-om-modal",
    ".clarity-security-modal",
    ".clarity-chancellor-modal",
    ".clarity-registrar-modal",
    "[id*='faculty-modal']",
    "[id*='it-modal']",
    "[id*='security-modal']",
    "[id*='om-modal']"
  ].join(",");

  function anyOpen() {
    var nodes = document.querySelectorAll(SELECTORS);
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n.hidden) continue;
      var st = g.getComputedStyle(n);
      if (st.display !== "none" && st.visibility !== "hidden") return true;
    }
    return false;
  }

  function syncBody() {
    if (!document.body) return;
    document.body.classList.toggle("cu-modal-open", anyOpen());
  }

  function harden(node) {
    if (!node || node.__cuHk) return;
    node.__cuHk = true;
    if (!node.classList.contains("clarity-faculty-modal") &&
        !node.classList.contains("clarity-it-modal") &&
        !node.classList.contains("clarity-om-modal") &&
        !node.classList.contains("clarity-security-modal")) {
      node.classList.add("cu-wing-modal");
    }
    /* close on backdrop click */
    node.addEventListener("click", function (ev) {
      if (ev.target === node) {
        node.hidden = true;
        node.style.display = "none";
        syncBody();
      }
    });
  }

  function scan() {
    document.querySelectorAll(SELECTORS).forEach(harden);
    /* IT/Faculty sometimes inject a floating panel without modal class — contain known ids */
    ["clarity-it-panel", "clarity-faculty-panel", "it-wing-panel", "faculty-desk-panel"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.classList.add("clarity-it-modal");
        harden(el);
      }
    });
    syncBody();
  }

  var obs = null;
  function boot() {
    scan();
    if (obs) return;
    obs = new MutationObserver(function () {
      scan();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "hidden", "style"] });
    g.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") {
        document.querySelectorAll(SELECTORS).forEach(function (n) {
          n.hidden = true;
          n.style.display = "none";
        });
        syncBody();
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
