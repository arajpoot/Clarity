/**
 * Apply NurOS icons to bottom tabs + dual path tiles · Companion
 */
(function (g) {
  "use strict";
  if (g.__NUROS_ICONS_APPLY__) return;
  g.__NUROS_ICONS_APPLY__ = true;

  var MAP = [
    { match: /reminder/i, icon: "nuros-icon-reminder" },
    { match: /reality/i, icon: "nuros-icon-reality" },
    { match: /reflection/i, icon: "nuros-icon-reflection" },
    { match: /action/i, icon: "nuros-icon-action" },
    { match: /vault|amana|notes/i, icon: "nuros-icon-vault" }
  ];

  function decorate(el, iconClass) {
    if (!el || el.querySelector(".nuros-icon")) return;
    var i = document.createElement("i");
    i.className = "nuros-icon nuros-tab-ico " + iconClass;
    i.setAttribute("aria-hidden", "true");
    el.insertBefore(i, el.firstChild);
  }

  function boot() {
    try {
      document.querySelectorAll("[data-tab], .clarity-tab-nav button, nav.tab-bar button, .mobile-tab-bar button").forEach(function (btn) {
        var label = (btn.getAttribute("data-tab") || btn.textContent || "").trim();
        MAP.forEach(function (m) {
          if (m.match.test(label)) decorate(btn, m.icon);
        });
      });
      /* dual tiles */
      document.querySelectorAll(".dual-tile").forEach(function (tile) {
        var n = (tile.textContent || "").toLowerCase();
        if (n.indexOf("university") >= 0 || n.indexOf("campus") >= 0)
          decorate(tile.querySelector(".dual-name") || tile, "nuros-icon-campus");
        else if (n.indexOf("companion") >= 0)
          decorate(tile.querySelector(".dual-name") || tile, "nuros-icon-quran");
      });
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 800);
})(typeof window !== "undefined" ? window : this);
