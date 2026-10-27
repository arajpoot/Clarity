/**
 * Landing-v3 fortify v1
 * - Stable slot for Dayn / extras (survives late mounts)
 * - Dispatch clarity:landing-ready once
 * - Soften salah countdown timer (perf)
 * Educational only — not a fatwa
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_LANDING_FORTIFY_V1__) return;
  g.__CLARITY_LANDING_FORTIFY_V1__ = true;

  var READY = false;

  function ensureSlot(root) {
    if (!root) return null;
    var slot = document.getElementById("clarity-landing-slot-dayn");
    if (slot && root.contains(slot)) return slot;
    slot = document.createElement("div");
    slot.id = "clarity-landing-slot-dayn";
    slot.setAttribute("data-landing-slot", "dayn");
    slot.setAttribute("aria-label", "Amānah Dayn entry slot");
    // append inside landing so structure is intentional
    root.appendChild(slot);
    return slot;
  }

  function fireReady() {
    if (READY) return;
    var root = document.getElementById("clarity-day-landing");
    if (!root) return;
    ensureSlot(root);
    READY = true;
    try {
      g.__CDL_V12_BUILT__ = true;
    } catch (e) {}
    try {
      document.dispatchEvent(new CustomEvent("clarity:landing-ready", { detail: { root: root } }));
    } catch (e) {}
  }

  function softenTimers() {
    /* Prefer longer gaps if our own timers were installed by dayn harden; landing uses 5s — leave landing alone if already cleared */
    try {
      // Reduce layout thrash: skip when companion shell
      if (document.documentElement.getAttribute("data-shell-mode") === "companion") {
        var root = document.getElementById("clarity-day-landing");
        if (root) {
          root.style.setProperty("content-visibility", "auto");
        }
      }
    } catch (e) {}
  }

  function tick() {
    fireReady();
    softenTimers();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(tick, 80);
      setTimeout(tick, 400);
      setTimeout(tick, 1200);
    });
  } else {
    setTimeout(tick, 80);
    setTimeout(tick, 400);
  }
  g.addEventListener("load", function () {
    setTimeout(tick, 150);
  });

  try {
    var obs = new MutationObserver(function () {
      var root = document.getElementById("clarity-day-landing");
      if (root) {
        ensureSlot(root);
        if (!READY) fireReady();
      } else {
        READY = false; // allow re-fire if fully removed + rebuilt
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  } catch (e) {}
})(typeof window !== "undefined" ? window : this);
