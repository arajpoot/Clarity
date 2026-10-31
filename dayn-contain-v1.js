/*! Dayn containment · strips Amānah Dayn from Reality / non-landing companion tabs
 * Educational only — not a fatwa · not legal/financial advice
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_DAYN_CONTAIN_V1__) return;
  w.__CLARITY_DAYN_CONTAIN_V1__ = true;

  function isAllowedParent(el) {
    if (!el) return false;
    if (el.closest && el.closest("#clarity-day-landing, #clarity-landing-slot-dayn, #clarity-dayn-vault-ledger, #clarity-vault-slot-dayn, .amana-vault-interior, #amana-vault, [data-vault-root]")) return true;
    return false;
  }

  function scrub() {
    var nodes = document.querySelectorAll(
      "#clarity-dayn-entry, .clarity-dayn-entry, [data-dayn-slot], section.clarity-dayn-entry"
    );
    nodes.forEach(function (el) {
      if (isAllowedParent(el)) return;
      /* duplicate form freeze: remove from Reality / main tabs */
      try {
        el.remove();
      } catch (e) {
        el.style.setProperty("display", "none", "important");
        el.setAttribute("hidden", "");
      }
    });
    /* orphan duplicate IDs outside landing */
    var ids = ["dayn-amount", "dayn-save", "dayn-dir", "dayn-who", "dayn-qh"];
    ids.forEach(function (id) {
      var all = document.querySelectorAll("#" + id);
      if (all.length <= 1) return;
      for (var i = 0; i < all.length; i++) {
        if (!isAllowedParent(all[i])) {
          var root = all[i].closest("section, .card, .clarity-dayn-entry") || all[i];
          try { root.remove(); } catch (e2) {}
        }
      }
    });
  }

  function boot() {
    try { scrub(); } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    boot();
    [200, 800, 2000, 4000, 8000].forEach(function (ms) { setTimeout(boot, ms); });
  });
  try {
    new MutationObserver(function () { boot(); }).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  } catch (e) {}
})(typeof window !== "undefined" ? window : this);
