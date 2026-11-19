/*! cu-chrome-harmony-v1 · U26 room-wide
 * Dedupe room nav, banners, smart-nav brand rows (double UNIVERSITY bar).
 * Educational only — not a fatwa · not a grade of īmān
 */
(function (w, d) {
  "use strict";
  if (w.__CU_CHROME_HARMONY_V26__) return;
  w.__CU_CHROME_HARMONY_V26__ = true;

  function keepFirst(sel) {
    var nodes = d.querySelectorAll(sel);
    for (var i = 1; i < nodes.length; i++) {
      try {
        nodes[i].parentNode && nodes[i].parentNode.removeChild(nodes[i]);
      } catch (e) {}
    }
  }

  function harmony() {
    keepFirst("nav.clarity-room-nav");
    // Keep at most one slim cu-banner
    keepFirst("header.cu-banner");
    keepFirst("#cu-banner");
    // One hero only
    keepFirst("header.cu-hero");
    keepFirst("nav.cu-pills");
    keepFirst("nav.lab-station-nav");
    keepFirst("[data-cu-student-status]");
    keepFirst("#cu-day-flow");
    keepFirst("nav.cu-smart-rooms");
    keepFirst("nav.cu-smart-stages");
    keepFirst(".cu-smart-nav-root");
    // Second smart-nav / uni topbar (Day Night Auto Companion strip)
    keepFirst(".cu-uni-topbar");
    keepFirst(".cu-brand-row");
    keepFirst("header.cu-subhead");
    keepFirst(".cu-uni-brand");
    keepFirst("[data-cu-uni-chrome]");
    // If room-nav already present, remove injected secondary uni headers
    if (d.querySelector("nav.clarity-room-nav")) {
      d.querySelectorAll(".cu-smart-top, .cu-injected-banner, header.cu-shell-banner").forEach(function (el, i) {
        if (i > 0 || el.classList.contains("cu-hero")) return;
        // remove only clear duplicates of brand strip
      });
      // common pattern: a bar with Day/Night/Auto next to UNIVERSITY label under path
      d.querySelectorAll("header, div, nav").forEach(function (el) {
        if (el.getAttribute("data-harmony-skip") === "1") return;
        var t = (el.textContent || "").replace(/\s+/g, " ").trim();
        // thin strip: UNIVERSITY + Day Night
        if (
          el !== d.querySelector("header.cu-hero") &&
          el !== d.querySelector("#cu-banner") &&
          /UNIVERSITY/i.test(t) &&
          /Day/.test(t) &&
          /Night/.test(t) &&
          t.length < 120 &&
          el.querySelector &&
          el.querySelector("button, a")
        ) {
          // likely injected secondary chrome — remove if not the primary #cu-banner
          if (!el.id || el.id !== "cu-banner") {
            try {
              if (!el.classList.contains("cu-banner") && !el.classList.contains("cu-hero")) {
                el.setAttribute("data-cu-dup-chrome", "1");
                el.style.display = "none";
              }
            } catch (e) {}
          }
        }
      });
    }
  }

  function boot() {
    try {
      harmony();
    } catch (e) {}
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 200);
  setTimeout(boot, 700);
  setTimeout(boot, 1500);
  setTimeout(boot, 2500);
})(window, document);
