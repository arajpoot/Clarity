/*! companion-nav-clean-n34 · remove short strip · keep full room nav */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_NAV_CLEAN_N34__) return;
  w.__CLARITY_NAV_CLEAN_N34__ = true;

  function killStrip() {
    try {
      d.querySelectorAll(
        "#clarity-room-strip, .clarity-room-strip-inline, .crn-mini, .room-nav-compact"
      ).forEach(function (el) {
        try { el.parentNode && el.parentNode.removeChild(el); } catch (e) {}
      });
      /* if room-nav missing, let clarity-room-nav-v1 ensureNav run — do not recreate strip */
      var full = d.querySelector("nav.clarity-room-nav, .clarity-room-nav");
      if (full) {
        full.style.display = "flex";
        full.removeAttribute("hidden");
      }
    } catch (e) {}
  }

  killStrip();
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", killStrip);
  w.addEventListener("load", killStrip);
  setTimeout(killStrip, 100);
  setTimeout(killStrip, 500);
  setTimeout(killStrip, 1500);
  try {
    var mo = new MutationObserver(function () { killStrip(); });
    mo.observe(d.documentElement, { childList: true, subtree: true });
    setTimeout(function () { try { mo.disconnect(); } catch (e) {} }, 4000);
  } catch (e2) {}
})(window, document);
