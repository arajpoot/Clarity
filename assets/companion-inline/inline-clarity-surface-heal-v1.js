/**
 * Companion surface lock v2 — defeat post-nav empty main
 * Runs after path filter / shell mode so Reminder+ cards stay visible.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_SURFACE_HEAL_V2__) return;
  w.__CLARITY_SURFACE_HEAL_V2__ = true;
  w.__CLARITY_SURFACE_HEAL_V1__ = true;

  var TABS = ["reminder", "reality", "reflection", "action", "notes"];

  function normalize(id) {
    if (!id) return null;
    id = String(id).replace(/^#/, "").replace(/^tab-/, "").toLowerCase().split("?")[0];
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
    var h = (w.location.hash || "").replace(/^#/, "").toLowerCase();
    if (normalize(h)) return true;
    try {
      if (localStorage.getItem("clarity_shell_mode_v1") === "companion") return true;
    } catch (e) {}
    return false;
  }

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

  function forcePanel(id) {
    id = normalize(id) || "reminder";
    var main = document.getElementById("main-content") || document.querySelector(".main-content");
    if (main) {
      main.hidden = false;
      main.style.setProperty("display", "block", "important");
      main.style.setProperty("visibility", "visible", "important");
      main.style.setProperty("opacity", "1", "important");
      main.removeAttribute("aria-hidden");
    }

    // Path strip should never be the only visible block
    var path = document.getElementById("clarity-path-board") ||
      document.querySelector("[data-path-board], .path-to-furnish, .grave-path-board");
    if (path) showEl(path);

    document.querySelectorAll(".tab-panel").forEach(function (p) {
      var on = p.id === ("tab-" + id);
      p.classList.toggle("active", on);
      if (on) {
        p.hidden = false;
        p.classList.remove("shell-landing-hide", "gate-hidden");
        p.style.setProperty("display", "block", "important");
        p.style.setProperty("visibility", "visible", "important");
        p.style.setProperty("opacity", "1", "important");
        p.style.setProperty("min-height", "16rem", "important");
        p.setAttribute("aria-hidden", "false");

        // Always show hub chrome
        p.querySelectorAll(".rrra-hub-hero, .rrra-hub-summary, .rrra-hub-meta, .clarity-gate-switcher, .cgs-btn").forEach(showEl);

        // Show allowed path cards + any card already marked visible
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
          if (!cid) { showEl(c); return; }
          if (allow[cid] || c.classList.contains("card-commands")) showEl(c);
          // If filter emptied everything, still show core reminder cards when present
        });

        // If still no visible cards, force-show all cards in this panel (better than blank)
        var visibleCards = 0;
        p.querySelectorAll(".card, [id$='-card']").forEach(function (c) {
          var cs = w.getComputedStyle ? getComputedStyle(c) : null;
          if (cs && cs.display !== "none" && cs.visibility !== "hidden") visibleCards++;
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
      b.classList.toggle("active", t === id);
    });
    try { document.body.setAttribute("data-active-tab", id); } catch (e) {}
  }

  function heal() {
    if (!isCompanionContext()) return;
    forcePanel(activeId());
  }

  // Wrap path filter so we heal AFTER it hides cards
  function wrapFilter(name) {
    var fn = w[name];
    if (typeof fn !== "function" || fn.__surfaceHeal) return;
    w[name] = function () {
      var r = fn.apply(this, arguments);
      setTimeout(heal, 20);
      setTimeout(heal, 120);
      setTimeout(heal, 400);
      return r;
    };
    w[name].__surfaceHeal = true;
  }

  function wrapShell() {
    if (!w.ClarityShell || typeof w.ClarityShell.setMode !== "function") return;
    if (w.ClarityShell.setMode.__surfaceHeal) return;
    var prev = w.ClarityShell.setMode;
    w.ClarityShell.setMode = function (m) {
      var r = prev.apply(this, arguments);
      setTimeout(heal, 30);
      setTimeout(heal, 200);
      setTimeout(heal, 600);
      return r;
    };
    w.ClarityShell.setMode.__surfaceHeal = true;
  }

  function wrapDoor() {
    if (typeof w.clarityOpenSectionDoor !== "function" || w.clarityOpenSectionDoor.__surfaceHeal) return;
    var prev = w.clarityOpenSectionDoor;
    w.clarityOpenSectionDoor = function (id) {
      var r = prev.apply(this, arguments);
      setTimeout(function () { forcePanel(normalize(id) || activeId()); }, 30);
      setTimeout(heal, 150);
      return r;
    };
    w.clarityOpenSectionDoor.__surfaceHeal = true;
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
    wrapFilter("applyAdditiveFilter");
    wrapFilter("applyGateSectionFilter");
    wrapFilter("claritySwitchGate");
    wrapShell();
    wrapDoor();
    heal();
    setTimeout(heal, 300);
    setTimeout(heal, 900);
    setTimeout(function () {
      wrapFilter("applyAdditiveFilter");
      wrapDoor();
      wrapShell();
      heal();
    }, 1500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(boot, 100);
    setTimeout(heal, 500);
    setTimeout(heal, 1200);
  });

  // Watchdog: companion + active panel collapsed → heal
  setInterval(function () {
    try {
      if (!isCompanionContext()) return;
      var id = activeId();
      var p = document.getElementById("tab-" + id);
      if (!p) return;
      var h = p.getBoundingClientRect().height;
      var cs = getComputedStyle(p);
      if (h < 80 || cs.display === "none" || cs.visibility === "hidden") forcePanel(id);
      // also if panel open but zero cards visible
      var vis = 0;
      p.querySelectorAll(".card, [id$='-card'], .rrra-hub-hero").forEach(function (c) {
        var s = getComputedStyle(c);
        if (s.display !== "none" && s.visibility !== "hidden" && c.getBoundingClientRect().height > 8) vis++;
      });
      if (vis < 1) forcePanel(id);
    } catch (e) {}
  }, 1200);
})(typeof window !== "undefined" ? window : this);
