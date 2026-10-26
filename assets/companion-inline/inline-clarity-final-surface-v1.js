/**
 * Companion final surface · v1
 * Merged: doors dismiss/pick + surface heal + shell companion assert
 * Load LAST among companion patches. Does not touch path-progress or landing-v3.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_FINAL_SURFACE_V1__) return;
  w.__CLARITY_FINAL_SURFACE_V1__ = true;

  var DOOR_KEY = "clarity_primary_door_v1";
  var SKIP = "clarity_doors_dismissed_v1";
  var TABS = ["reminder", "reality", "reflection", "action", "notes"];

  function $(id) { return document.getElementById(id); }

  function showEl(el) {
    if (!el) return;
    el.classList.remove("gate-hidden", "shell-landing-hide");
    el.removeAttribute("data-gate-hidden");
    el.hidden = false;
    try {
      el.style.removeProperty("display");
      el.style.removeProperty("visibility");
      el.style.removeProperty("height");
      el.style.removeProperty("max-height");
      el.style.removeProperty("opacity");
      el.style.removeProperty("pointer-events");
      el.style.removeProperty("overflow");
    } catch (e) {}
  }

  function normalize(id) {
    if (!id) return null;
    id = String(id).replace(/^#/, "").replace(/^tab-/, "").toLowerCase().split("?")[0].split("/")[0];
    if (id === "fiqh" || id === "vault" || id === "amana") id = "notes";
    if (id === "journey" || id === "commands" || id === "today") id = "reminder";
    if (id === "seerah" || id === "lectures" || id === "tools" || id === "about") id = "reality";
    if (id === "grave" || id === "tafseer") id = "reflection";
    if (id === "tajweed" || id === "guidance") id = "action";
    if (TABS.indexOf(id) < 0) return null;
    return id;
  }

  function activeId() {
    var h = normalize((w.location.hash || "").replace(/^#/, ""));
    if (h) return h;
    try {
      var s = normalize(sessionStorage.getItem("clarity_active_section_v1"));
      if (s) return s;
    } catch (e) {}
    var body = document.body && document.body.getAttribute("data-active-tab");
    return normalize(body) || "reminder";
  }

  function isCompanionContext() {
    var mode = document.documentElement.getAttribute("data-shell-mode") ||
      (document.body && document.body.getAttribute("data-shell-mode")) || "";
    if (mode === "companion") return true;
    if (normalize((w.location.hash || "").replace(/^#/, ""))) return true;
    try {
      if (localStorage.getItem("clarity_shell_mode_v1") === "companion") return true;
    } catch (e) {}
    return false;
  }

  /* ---------- Doors ---------- */
  function hardHideDoors() {
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
    hardHideDoors();
    try {
      if (w.ClarityShell && w.ClarityShell.setMode) w.ClarityShell.setMode("landing");
    } catch (e) {}
    setTimeout(function () {
      var land = $("clarity-day-landing");
      if (land) {
        land.hidden = false;
        land.style.removeProperty("display");
        try { land.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e2) {}
      }
      try { w.location.hash = "today"; } catch (e3) {}
    }, 30);
  }

  function goCompanion(kind) {
    hardHideDoors();
    try {
      if (w.ClarityShell && w.ClarityShell.setMode) w.ClarityShell.setMode("companion");
    } catch (e) {}
    setTimeout(function () {
      assertCompanionSurface(kind === "prepare" ? "action" : "reminder");
      try { w.location.hash = kind === "prepare" ? "prepare-for-death" : "reminder"; } catch (e2) {}
    }, 40);
  }

  function pickDoor(door) {
    door = String(door || "today").toLowerCase();
    try { localStorage.setItem(DOOR_KEY, door); } catch (e) {}
    try { sessionStorage.setItem(SKIP, "1"); } catch (e) {}
    if (door === "learn") return goCompanion("learn");
    if (door === "prepare") return goCompanion("prepare");
    return goLanding();
  }

  w.clarityPickPrimaryDoor = pickDoor;

  function bindDoorCard(card) {
    if (!card || card.__finalDoorBound) return;
    card.__finalDoorBound = true;
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
      pickDoor(resolveDoor());
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

  function wireDoors() {
    var root = $("clarity-three-doors");
    if (!root) return;
    root.querySelectorAll(".td-card").forEach(bindDoorCard);
    var dismissed = false;
    try { dismissed = sessionStorage.getItem(SKIP) === "1" || !!localStorage.getItem(DOOR_KEY); } catch (e) {}
    if (dismissed) hardHideDoors();
  }

  /* ---------- Shell companion assert + surface ---------- */
  function assertCompanionSurface(tabId) {
    tabId = normalize(tabId) || activeId() || "reminder";
    var main = $("main-content") || document.querySelector(".main-content");
    if (main) {
      main.hidden = false;
      main.style.setProperty("display", "block", "important");
      main.style.setProperty("visibility", "visible", "important");
      main.style.setProperty("opacity", "1", "important");
      main.removeAttribute("aria-hidden");
    }

    document.querySelectorAll(".shell-landing-hide").forEach(function (el) {
      el.classList.remove("shell-landing-hide");
    });

    document.querySelectorAll(".tab-panel").forEach(function (p) {
      var on = p.id === ("tab-" + tabId);
      p.classList.toggle("active", on);
      if (on) {
        p.hidden = false;
        p.classList.remove("shell-landing-hide", "gate-hidden");
        p.style.setProperty("display", "block", "important");
        p.style.setProperty("visibility", "visible", "important");
        p.style.setProperty("opacity", "1", "important");
        p.style.setProperty("min-height", "16rem", "important");
        p.setAttribute("aria-hidden", "false");

        p.querySelectorAll(".rrra-hub-hero, .rrra-hub-summary, .rrra-hub-meta, .clarity-gate-switcher, .cgs-btn").forEach(showEl);

        var allow = {};
        try {
          if (w.ALLOW) {
            var gate = document.documentElement.getAttribute("data-clarity-path") ||
              localStorage.getItem("clarity_committed_path") || "seeker";
            var order = ["seeker", "new_muslim", "practicing", "dai"];
            var upto = order.indexOf(gate);
            if (upto < 0) upto = 0;
            for (var i = 0; i <= upto; i++) {
              var a = w.ALLOW[order[i]] || {};
              Object.keys(a).forEach(function (k) { if (a[k]) allow[k] = 1; });
            }
          }
        } catch (eA) {}

        p.querySelectorAll(".card, [id$='-card']").forEach(function (c) {
          var cid = c.id || "";
          if (!cid || allow[cid] || c.classList.contains("card-commands")) showEl(c);
        });

        var visibleCards = 0;
        p.querySelectorAll(".card, [id$='-card'], .rrra-hub-hero").forEach(function (c) {
          var cs = w.getComputedStyle ? getComputedStyle(c) : null;
          if (cs && cs.display !== "none" && cs.visibility !== "hidden" && c.getBoundingClientRect().height > 8) visibleCards++;
        });
        if (visibleCards < 1) {
          p.querySelectorAll(".card, [id$='-card'], section, article").forEach(showEl);
        }
      } else {
        p.style.display = "none";
        p.setAttribute("aria-hidden", "true");
      }
    });

    document.querySelectorAll(".door-rail-btn, [data-rail-tab]").forEach(function (b) {
      var t = b.getAttribute("data-rail-tab") || "";
      b.classList.toggle("active", t === tabId);
    });
    try { document.body.setAttribute("data-active-tab", tabId); } catch (e) {}
  }

  function heal() {
    if (!isCompanionContext()) return;
    assertCompanionSurface(activeId());
  }

  function wrapFilter(name) {
    var fn = w[name];
    if (typeof fn !== "function" || fn.__finalSurface) return;
    w[name] = function () {
      var r = fn.apply(this, arguments);
      setTimeout(heal, 20);
      setTimeout(heal, 120);
      setTimeout(heal, 400);
      return r;
    };
    w[name].__finalSurface = true;
  }

  function wrapShell() {
    if (!w.ClarityShell || typeof w.ClarityShell.setMode !== "function") return;
    if (w.ClarityShell.setMode.__finalSurface) return;
    var prev = w.ClarityShell.setMode;
    w.ClarityShell.setMode = function (m) {
      var r = prev.apply(this, arguments);
      setTimeout(function () {
        if (m === "companion") assertCompanionSurface(activeId());
        else heal();
      }, 30);
      setTimeout(heal, 200);
      setTimeout(heal, 600);
      return r;
    };
    w.ClarityShell.setMode.__finalSurface = true;
  }

  function wrapDoorOpen() {
    if (typeof w.clarityOpenSectionDoor !== "function" || w.clarityOpenSectionDoor.__finalSurface) return;
    var prev = w.clarityOpenSectionDoor;
    w.clarityOpenSectionDoor = function (id) {
      var r = prev.apply(this, arguments);
      setTimeout(function () { assertCompanionSurface(normalize(id) || activeId()); }, 30);
      setTimeout(heal, 150);
      return r;
    };
    w.clarityOpenSectionDoor.__finalSurface = true;
  }

  w.addEventListener("hashchange", function () {
    setTimeout(heal, 20);
    setTimeout(heal, 150);
    setTimeout(heal, 400);
  });

  document.addEventListener("click", function (ev) {
    var t = ev.target && ev.target.closest &&
      ev.target.closest("[data-rail-tab], [data-tab], .door-rail-btn, [data-crb], .td-card, .dual-tile");
    if (!t) return;
    setTimeout(heal, 40);
    setTimeout(heal, 200);
    setTimeout(heal, 600);
  }, true);

  function boot() {
    wireDoors();
    wrapFilter("applyAdditiveFilter");
    wrapFilter("applyGateSectionFilter");
    wrapFilter("claritySwitchGate");
    wrapShell();
    wrapDoorOpen();
    heal();
    setTimeout(function () {
      wireDoors();
      wrapFilter("applyAdditiveFilter");
      wrapShell();
      wrapDoorOpen();
      heal();
    }, 400);
    setTimeout(heal, 1000);
    setTimeout(heal, 1800);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(boot, 80);
    setTimeout(heal, 500);
    setTimeout(heal, 1200);
  });

  setInterval(function () {
    try {
      // Keep doors dismissed once chosen
      if (sessionStorage.getItem(SKIP) === "1") {
        var doors = $("clarity-three-doors");
        if (doors) {
          var cs = getComputedStyle(doors);
          if (cs.display !== "none" && cs.visibility !== "hidden") hardHideDoors();
        }
      }
      if (!isCompanionContext()) return;
      var id = activeId();
      var p = $("tab-" + id);
      if (!p) return;
      var h = p.getBoundingClientRect().height;
      var cs2 = getComputedStyle(p);
      if (h < 80 || cs2.display === "none" || cs2.visibility === "hidden") assertCompanionSurface(id);
      var vis = 0;
      p.querySelectorAll(".card, [id$='-card'], .rrra-hub-hero").forEach(function (c) {
        var s = getComputedStyle(c);
        if (s.display !== "none" && s.visibility !== "hidden" && c.getBoundingClientRect().height > 8) vis++;
      });
      if (vis < 1) assertCompanionSurface(id);
    } catch (e) {}
  }, 1200);

  // Public assert for other scripts
  w.ClarityFinalSurface = { heal: heal, assert: assertCompanionSurface, hideDoors: hardHideDoors, pickDoor: pickDoor };
})(typeof window !== "undefined" ? window : this);
