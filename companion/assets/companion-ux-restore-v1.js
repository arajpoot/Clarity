/*! companion-ux-restore-v1 · rail polish + deep fold UX · educational only */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_UX_RESTORE_V1__) return;
  w.__COMPANION_UX_RESTORE_V1__ = true;

  function markActive() {
    var tab =
      (d.body && d.body.getAttribute("data-active-tab")) ||
      ((w.location.hash || "").replace(/^#/, "") || "reminder");
    d.querySelectorAll(".cs-door [data-rail-tab]").forEach(function (btn) {
      var on = btn.getAttribute("data-rail-tab") === tab;
      btn.classList.toggle("is-active", on);
      if (on) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });
  }

  function enhanceRail() {
    var rail = d.getElementById("clarity-door-rail") || d.querySelector(".cs-door");
    if (!rail) return;
    rail.setAttribute("role", "tablist");
    rail.querySelectorAll("[data-rail-tab]").forEach(function (btn) {
      btn.setAttribute("role", "tab");
      if (!btn.getAttribute("type")) btn.setAttribute("type", "button");
    });
    markActive();
  }

  function fixDeepMedia(root) {
    root = root || d.getElementById("cs-mount");
    if (!root) return;
    root.querySelectorAll(".cs-r7-r8 iframe, .cs-deep-body iframe").forEach(function (f) {
      if (!f.getAttribute("loading")) f.setAttribute("loading", "lazy");
      if (!f.getAttribute("title")) f.setAttribute("title", "Educational video");
      f.setAttribute("allowfullscreen", "");
    });
    // broken empty anchors from archive
    root.querySelectorAll("a[href=''], a:not([href])").forEach(function (a) {
      if (!(a.textContent || "").trim()) a.style.display = "none";
    });
  }

  function boot() {
    enhanceRail();
    fixDeepMedia();
    d.addEventListener("clarity:tab-mounted", function (ev) {
      markActive();
      fixDeepMedia(ev && ev.detail && ev.detail.root);
    });
    d.addEventListener("click", function (ev) {
      var b = ev.target && ev.target.closest && ev.target.closest("[data-rail-tab]");
      if (b) setTimeout(markActive, 30);
    }, true);
    var m = d.getElementById("cs-mount");
    if (m && typeof MutationObserver !== "undefined") {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(function () {
          markActive();
          fixDeepMedia(m);
        }, 40);
      }).observe(m, { childList: true });
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.ClarityCompanionUXRestore = { markActive: markActive, version: "UX1" };
})(window, document);
