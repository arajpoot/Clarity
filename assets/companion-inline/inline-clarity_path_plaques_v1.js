/* 20261026FREEZE freeze-safe plaques */
/**
 * Path plaques v3 · 20261026FIX2
 * Decorate path tiles with icons. NEVER hide .clarity-gate-switcher track row.
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_PATH_PLAQUES_V4__) return;
  w.__CLARITY_PATH_PLAQUES_V4__ = true;

  var ICONS = {
    seeker: "🔭",
    new_muslim: "🌱",
    practicing: "📿",
    dai: "🕊️"
  };

  var CSS = [
    "/* Track row ALWAYS visible */",
    ".clarity-gate-switcher,.clarity-gate-switcher.rrra-sitewide,.cgs-btn-row{",
    "  display:flex!important;flex-wrap:wrap!important;gap:.4rem!important;",
    "  align-items:center!important;justify-content:center!important;",
    "  visibility:visible!important;opacity:1!important;",
    "  height:auto!important;max-height:none!important;overflow:visible!important;",
    "  pointer-events:auto!important;position:relative!important;",
    "  width:100%!important;margin:.5rem auto!important;padding:.45rem .6rem!important;",
    "  box-sizing:border-box!important;}",
    ".clarity-gate-switcher .cgs-btn,button.cgs-btn{",
    "  display:inline-flex!important;visibility:visible!important;opacity:1!important;",
    "  pointer-events:auto!important;align-items:center!important;gap:.3rem!important;}",
    ".clarity-gate-switcher .cgs-label{display:inline-block!important;font-size:.75rem!important;opacity:.85!important;}",
    "/* University path tile icon slot */",
    "[data-door='campus'] .td-ico,.cph-uni-tile .nuros-icon,.university-path-card .nuros-icon,",
    "a[href*='/campus'] .nuros-icon-campus{display:inline-block!important;}"
  ].join("\\n");

  function injectCss() {
    var id = "clarity-path-plaques-css-v3";
    var s = document.getElementById(id);
    if (!s) {
      s = document.createElement("style");
      s.id = id;
      (document.head || document.documentElement).appendChild(s);
    }
    s.textContent = CSS;
  }

  function showTrack() {
    try {
      document.querySelectorAll(".clarity-gate-switcher, .cgs-btn-row").forEach(function (el) {
        el.style.removeProperty("display");
        el.style.removeProperty("visibility");
        el.style.removeProperty("opacity");
        el.style.removeProperty("height");
        el.style.removeProperty("max-height");
        el.hidden = false;
        el.style.setProperty("display", "flex", "important");
        el.style.setProperty("visibility", "visible", "important");
        el.style.setProperty("opacity", "1", "important");
      });
      document.querySelectorAll(".clarity-gate-switcher .cgs-btn, button.cgs-btn").forEach(function (btn) {
        btn.style.setProperty("display", "inline-flex", "important");
        btn.style.setProperty("visibility", "visible", "important");
        btn.hidden = false;
      });
    } catch (e) {}
  }

  function decoratePhases() {
    var phases = document.querySelectorAll(
      "#clarity-grave-path-strip .gps-phase, .grave-path-strip .gps-phase, .clarity-gate-switcher .cgs-btn"
    );
    phases.forEach(function (btn) {
      if (btn.querySelector(".gps-ico, .cgs-ico .nuros-icon")) {
        /* leave existing emoji ico */
      }
      var g = btn.getAttribute("data-gate") || "";
      if (!g && btn.classList.contains("cgs-seeker")) g = "seeker";
      if (!g && btn.classList.contains("cgs-new")) g = "new_muslim";
      if (!g && btn.classList.contains("cgs-daily")) g = "practicing";
      if (!g && btn.classList.contains("cgs-dai")) g = "dai";
      if (!btn.querySelector(".gps-ico") && btn.classList.contains("gps-phase")) {
        var ico = ICONS[g] || "✦";
        var span = document.createElement("span");
        span.className = "gps-ico";
        span.setAttribute("aria-hidden", "true");
        span.textContent = ico;
        btn.insertBefore(span, btn.firstChild);
      }
    });
  }

  function decorateUniversityTile() {
    try {
      var tiles = document.querySelectorAll(
        "a[href*='/campus'], [data-door='campus'], .cph-uni, .university-path, [class*='university']"
      );
      tiles.forEach(function (tile) {
        var text = (tile.textContent || "").toLowerCase();
        if (text.indexOf("university") < 0 && !tile.getAttribute("href")) return;
        if (tile.querySelector(".nuros-icon-campus, .gps-ico-campus")) return;
        var el = document.createElement("span");
        el.className = "nuros-icon nuros-icon-campus";
        el.setAttribute("aria-hidden", "true");
        el.style.cssText = "display:inline-block;width:1.25em;height:1.25em;margin-inline-end:.35rem;vertical-align:-.2em;";
        /* fallback glyph if CSS sprite missing */
        if (!el.textContent) el.textContent = "🎓";
        var icoHost = tile.querySelector(".td-ico, .cph-ico, h2, strong") || tile;
        if (icoHost === tile) tile.insertBefore(el, tile.firstChild);
        else icoHost.insertBefore(el, icoHost.firstChild);
      });
    } catch (e) {}
  }

  function decorate() {
    injectCss();
    showTrack();
    decoratePhases();
    decorateUniversityTile();
  }

  function boot() {
    decorate();
    setTimeout(decorate, 300);
    setTimeout(decorate, 1000);
    setTimeout(decorate, 2500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(decorate, 200); });

  /* Defeat any later script that hides track */
  /* FREEZE: MutationObserver removed — was looping with style writes */
})(typeof window !== "undefined" ? window : this);
