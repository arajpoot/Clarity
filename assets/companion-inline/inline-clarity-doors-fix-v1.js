/**
 * Clarity primary doors · v2 hard dismiss + mobile taps
 * Landing content is already built behind this modal.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_DOORS_FIX_V2__) return;
  w.__CLARITY_DOORS_FIX_V2__ = true;
  w.__CLARITY_DOORS_FIX_V1__ = true;

  var KEY = "clarity_primary_door_v1";
  var SKIP = "clarity_doors_dismissed_v1";

  function $(id) { return document.getElementById(id); }

  function hardHide() {
    var el = $("clarity-three-doors");
    if (!el) return;
    el.classList.add("hidden");
    el.setAttribute("aria-hidden", "true");
    el.setAttribute("hidden", "");
    el.style.cssText = "display:none!important;visibility:hidden!important;pointer-events:none!important;opacity:0!important;";
    try { document.body.classList.remove("doors-open"); } catch (e) {}
    try { sessionStorage.setItem(SKIP, "1"); } catch (e) {}
  }

  function goLanding() {
    hardHide();
    try {
      if (w.ClarityShell && w.ClarityShell.setMode) w.ClarityShell.setMode("landing");
    } catch (e) {}
    setTimeout(function () {
      var land = $("clarity-day-landing");
      if (land) {
        land.hidden = false;
        land.style.removeProperty("display");
        try { land.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) {}
      }
      try { w.location.hash = "today"; } catch (e) {}
    }, 30);
  }

  function goCompanion(kind) {
    hardHide();
    try {
      if (w.ClarityShell && w.ClarityShell.setMode) w.ClarityShell.setMode("companion");
    } catch (e) {}
    setTimeout(function () {
      var id = kind === "prepare" ? "tab-action" : "tab-reminder";
      var target = $(id) || $("main-content");
      if (target) {
        try {
          target.hidden = false;
          target.style.removeProperty("display");
          target.classList.remove("shell-landing-hide");
          target.setAttribute("aria-hidden", "false");
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (e) {}
      }
      try { w.location.hash = kind === "prepare" ? "prepare-for-death" : "reminder"; } catch (e) {}
    }, 40);
  }

  function pick(door) {
    door = String(door || "today").toLowerCase();
    try { localStorage.setItem(KEY, door); } catch (e) {}
    try { sessionStorage.setItem(SKIP, "1"); } catch (e) {}
    if (door === "learn") return goCompanion("learn");
    if (door === "prepare") return goCompanion("prepare");
    return goLanding();
  }

  w.clarityPickPrimaryDoor = pick;

  function bindCard(card) {
    if (!card || card.__doorBound2) return;
    card.__doorBound2 = true;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.style.pointerEvents = "auto";
    card.style.cursor = "pointer";
    card.style.touchAction = "manipulation";

    function resolveDoor() {
      var d = card.getAttribute("data-door");
      if (d) return d;
      var oc = card.getAttribute("onclick") || "";
      var m = oc.match(/clarityPickPrimaryDoor\s*\(\s*['\"](\w+)['\"]\s*\)/);
      if (m) return m[1];
      var t = (card.textContent || "").toLowerCase();
      if (t.indexOf("learn") >= 0) return "learn";
      if (t.indexOf("prepare") >= 0 || t.indexOf("affair") >= 0) return "prepare";
      return "today";
    }
    function fire(ev) {
      if (ev) { try { ev.preventDefault(); ev.stopPropagation(); } catch (e) {} }
      pick(resolveDoor());
    }
    card.addEventListener("click", fire, true);
    card.addEventListener("pointerup", function (ev) {
      if (ev.pointerType === "touch" || ev.pointerType === "pen") fire(ev);
    }, true);
    card.addEventListener("touchend", function (ev) {
      if (card.__lock) return;
      card.__lock = true;
      fire(ev);
      setTimeout(function () { card.__lock = false; }, 350);
    }, { passive: false, capture: true });
    card.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); fire(ev); }
    });
  }

  function wire() {
    var root = $("clarity-three-doors");
    if (!root) return;
    root.querySelectorAll(".td-card").forEach(bindCard);
  }

  function boot() {
    wire();
    var dismissed = false;
    try { dismissed = sessionStorage.getItem(SKIP) === "1" || !!localStorage.getItem(KEY); } catch (e) {}
    // Returning visitors: skip modal, go straight to last door / today landing
    if (dismissed) {
      hardHide();
      var last = "today";
      try { last = localStorage.getItem(KEY) || "today"; } catch (e) {}
      if (last === "learn" || last === "prepare") {
        /* leave companion choice for explicit nav; still hide modal */
      } else {
        try {
          if (w.ClarityShell && w.ClarityShell.setMode) w.ClarityShell.setMode("landing");
        } catch (e) {}
      }
    }
    // Heal: if something re-opens modal after dismiss, force close
    setInterval(function () {
      try {
        if (sessionStorage.getItem(SKIP) !== "1") return;
        var el = $("clarity-three-doors");
        if (!el) return;
        var cs = getComputedStyle(el);
        if (cs.display !== "none" && cs.visibility !== "hidden") hardHide();
      } catch (e) {}
    }, 800);
    setTimeout(wire, 400);
    setTimeout(wire, 1500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(boot, 200); });
})(typeof window !== "undefined" ? window : this);
