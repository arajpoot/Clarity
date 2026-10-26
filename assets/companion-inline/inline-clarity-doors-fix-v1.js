/**
 * Clarity primary doors · mobile-safe picker
 * Defines missing clarityPickPrimaryDoor + touch handlers
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_DOORS_FIX_V1__) return;
  w.__CLARITY_DOORS_FIX_V1__ = true;

  var KEY = "clarity_primary_door_v1";

  function $(id) { return document.getElementById(id); }

  function hideDoors() {
    var el = $("clarity-three-doors");
    if (!el) return;
    el.classList.add("hidden");
    el.setAttribute("aria-hidden", "true");
    el.style.setProperty("display", "none", "important");
    try { document.body.classList.remove("doors-open"); } catch (e) {}
  }

  function showDoors() {
    var el = $("clarity-three-doors");
    if (!el) return;
    el.classList.remove("hidden");
    el.removeAttribute("hidden");
    el.setAttribute("aria-hidden", "false");
    el.style.setProperty("display", "flex", "important");
    el.style.setProperty("pointer-events", "auto", "important");
    try { document.body.classList.add("doors-open"); } catch (e) {}
    // Ensure cards receive taps
    el.querySelectorAll(".td-card").forEach(function (card) {
      card.style.pointerEvents = "auto";
      card.style.cursor = "pointer";
      card.style.touchAction = "manipulation";
      card.style.webkitUserSelect = "none";
      card.style.userSelect = "none";
    });
  }

  function goCompanion(section) {
    try {
      if (w.ClarityShell && w.ClarityShell.setMode) w.ClarityShell.setMode("companion");
    } catch (e) {}
    hideDoors();
    var map = {
      today: "clarity-day-landing",
      learn: "tab-reminder",
      prepare: "tab-action"
    };
    var id = map[section] || "clarity-day-landing";
    setTimeout(function () {
      var target = $(id) || $("main-content") || $("clarity-day-landing");
      if (target) {
        try {
          target.hidden = false;
          target.style.removeProperty("display");
          target.classList.remove("shell-landing-hide");
          target.setAttribute("aria-hidden", "false");
        } catch (e) {}
        try { target.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e2) {}
      }
      // Prefer hash routes used by app
      if (section === "prepare") {
        try { w.location.hash = "prepare-for-death"; } catch (e) {}
      } else if (section === "learn") {
        try { w.location.hash = "reminder"; } catch (e) {}
      } else {
        try { w.location.hash = "today"; } catch (e) {}
      }
    }, 60);
  }

  function pick(door) {
    door = String(door || "today").toLowerCase();
    try { localStorage.setItem(KEY, door); } catch (e) {}
    if (door === "today") {
      try {
        if (w.ClarityShell && w.ClarityShell.setMode) w.ClarityShell.setMode("landing");
      } catch (e) {}
      hideDoors();
      setTimeout(function () {
        var land = $("clarity-day-landing");
        if (land) {
          land.hidden = false;
          land.style.removeProperty("display");
          try { land.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) {}
        }
      }, 40);
      return;
    }
    if (door === "learn") {
      goCompanion("learn");
      return;
    }
    if (door === "prepare") {
      goCompanion("prepare");
      // Soft open legacy path pages if present
      try {
        var a = document.querySelector('a[href*="prepare-for-death"], a[href*="islamic-will"]');
        if (a && /prepare|will|legacy/i.test(a.getAttribute("href") || "")) {
          /* stay in-app; hash already set */
        }
      } catch (e) {}
      return;
    }
    hideDoors();
  }

  // Public API — also satisfies inline onclick="clarityPickPrimaryDoor(...)"
  w.clarityPickPrimaryDoor = pick;

  function bindCard(card) {
    if (!card || card.__doorBound) return;
    card.__doorBound = true;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    if (!card.getAttribute("aria-label")) {
      var h = card.querySelector("h2");
      if (h) card.setAttribute("aria-label", (h.textContent || "").trim());
    }
    function resolveDoor() {
      var oc = card.getAttribute("onclick") || "";
      var m = oc.match(/clarityPickPrimaryDoor\s*\(\s*['\"](\w+)['\"]\s*\)/);
      if (m) return m[1];
      var t = (card.textContent || "").toLowerCase();
      if (t.indexOf("learn") >= 0) return "learn";
      if (t.indexOf("prepare") >= 0 || t.indexOf("affair") >= 0) return "prepare";
      return "today";
    }
    function fire(ev) {
      if (ev) {
        ev.preventDefault();
        ev.stopPropagation();
      }
      pick(resolveDoor());
    }
    card.addEventListener("click", fire, true);
    card.addEventListener("touchend", function (ev) {
      // avoid double-fire with click on some WebViews
      if (card.__touchLock) return;
      card.__touchLock = true;
      fire(ev);
      setTimeout(function () { card.__touchLock = false; }, 400);
    }, { passive: false });
    card.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        fire(ev);
      }
    });
  }

  function wireAll() {
    var root = $("clarity-three-doors");
    if (root) {
      root.style.pointerEvents = "auto";
      root.querySelectorAll(".td-card").forEach(bindCard);
      // Backdrop tap does not steal card taps
      root.addEventListener("click", function (ev) {
        if (ev.target === root) {
          // optional: do not auto-close; user must pick
        }
      }, true);
    }
  }

  function boot() {
    wireAll();
    // If modal is visible (or forced visible by other scripts), ensure handlers work
    var el = $("clarity-three-doors");
    if (el) {
      var shown = !el.classList.contains("hidden") && el.style.display !== "none";
      var cs = w.getComputedStyle ? getComputedStyle(el) : null;
      if (cs && cs.display !== "none" && cs.visibility !== "hidden") {
        showDoors();
      }
      // Live mobile: often forced open despite .hidden — detect painted modal by size
      try {
        var r = el.getBoundingClientRect();
        if (r.width > 40 && r.height > 40) {
          el.classList.remove("hidden");
          el.style.setProperty("display", "flex", "important");
          el.style.setProperty("pointer-events", "auto", "important");
        }
      } catch (e) {}
    }
    // Re-bind shortly after other boot scripts
    setTimeout(wireAll, 300);
    setTimeout(wireAll, 1200);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", boot);
})(typeof window !== "undefined" ? window : this);
