/*! port-polish-modal-v1 · keep body locked while tour open · educational only */
(function () {
  "use strict";
  if (window.__PORT_POLISH_MODAL_V1__) return;
  window.__PORT_POLISH_MODAL_V1__ = true;

  function sync() {
    var modal = document.getElementById("room-tour-modal");
    if (!modal) return;
    var open = !modal.hidden && !modal.hasAttribute("hidden");
    document.body.classList.toggle("port-tour-open", open);
    if (open) {
      modal.style.display = "flex";
      modal.removeAttribute("hidden");
    }
  }

  var obs = new MutationObserver(sync);
  function boot() {
    var modal = document.getElementById("room-tour-modal");
    if (modal) {
      obs.observe(modal, { attributes: true, attributeFilter: ["hidden", "class", "style"] });
      sync();
    }
    /* ensure modal is direct child of body so fixed covers viewport */
    if (modal && modal.parentElement !== document.body) {
      document.body.appendChild(modal);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 500);
})();
