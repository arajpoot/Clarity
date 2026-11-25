/*! companion-glory-seal-g5 · active rail + single hero nudge · educational only */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_GLORY_SEAL_G5__) return;
  w.__COMPANION_GLORY_SEAL_G5__ = true;

  function markRail() {
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

  function singleHero(root) {
    root = root || d.getElementById("cs-mount");
    if (!root) return;
    var heroes = root.querySelectorAll("header.cs-tab-hero, .cs-tab-hero");
    heroes.forEach(function (h, i) {
      if (i > 0) {
        h.setAttribute("data-g5-demoted", "1");
        h.style.display = "none";
      }
    });
  }

  function boot() {
    markRail();
    singleHero();
    d.addEventListener("clarity:tab-mounted", function (ev) {
      markRail();
      singleHero(ev && ev.detail && ev.detail.root);
    });
    d.addEventListener(
      "click",
      function (ev) {
        var b = ev.target && ev.target.closest && ev.target.closest("[data-rail-tab]");
        if (b) setTimeout(markRail, 30);
      },
      true
    );
    var m = d.getElementById("cs-mount");
    if (m && typeof MutationObserver !== "undefined") {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(function () {
          markRail();
          singleHero(m);
        }, 40);
      }).observe(m, { childList: true });
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.ClarityGlorySealG5 = { markRail: markRail, version: "G5" };
})(window, document);
