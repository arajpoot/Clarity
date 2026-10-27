/* 20261026FREEZE freeze-safe */
/* companion-track-unhide-v1.js · 20261026FIX2 — last-word track visibility */
(function (g) {
  "use strict";
  if (g.__CLARITY_TRACK_UNHIDE_V2__) return;
  g.__CLARITY_TRACK_UNHIDE_V2__ = true;

  function force() {
    var sel = ".clarity-gate-switcher, .clarity-gate-switcher.rrra-sitewide, .cgs-btn-row";
    document.querySelectorAll(sel).forEach(function (el) {
      el.hidden = false;
      el.removeAttribute("data-gate-hidden");
      el.classList.remove("gate-hidden");
      ["display","visibility","opacity","height","max-height","pointer-events"].forEach(function (p) {
        try { el.style.removeProperty(p); } catch (e) {}
      });
      el.style.setProperty("display", "flex", "important");
      el.style.setProperty("visibility", "visible", "important");
      el.style.setProperty("opacity", "1", "important");
      el.style.setProperty("pointer-events", "auto", "important");
    });
    document.querySelectorAll(".clarity-gate-switcher .cgs-btn").forEach(function (b) {
      b.hidden = false;
      b.style.setProperty("display", "inline-flex", "important");
      b.style.setProperty("visibility", "visible", "important");
    });
  }

  function uniIcon() {
    document.querySelectorAll("a[href*='/campus/'], a[href*='/campus']").forEach(function (a) {
      var t = (a.textContent || "").toLowerCase();
      if (t.indexOf("university") < 0 && t.indexOf("campus") < 0) return;
      if (a.querySelector(".nuros-icon-campus")) return;
      var s = document.createElement("span");
      s.className = "nuros-icon nuros-icon-campus";
      s.setAttribute("aria-hidden", "true");
      s.textContent = "🎓";
      s.style.cssText = "margin-inline-end:.35rem";
      a.insertBefore(s, a.firstChild);
    });
    /* day-landing university card */
    document.querySelectorAll(".cph-card, .td-card, [class*='path']").forEach(function (card) {
      var t = (card.textContent || "").toLowerCase();
      if (t.indexOf("university path") < 0) return;
      if (card.querySelector(".nuros-icon-campus, .uni-glyph")) return;
      var s = document.createElement("span");
      s.className = "uni-glyph nuros-icon nuros-icon-campus";
      s.textContent = "🎓";
      s.setAttribute("aria-hidden", "true");
      s.style.cssText = "font-size:1.35rem;display:block;margin-bottom:.25rem";
      card.insertBefore(s, card.firstChild);
    });
  }

  function run() { force(); uniIcon(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
  g.addEventListener("load", function () { run(); setTimeout(run, 500); setTimeout(run, 2000); });
  /* FREEZE: no interval */
})(typeof window !== "undefined" ? window : this);
