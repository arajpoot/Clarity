/**
 * companion-path-track-stable-v1.js · 20261026PATH2
 * Calm binder for 4 path track pills. No innerHTML/removeChild on track.
 * Path extent only; RRRA sections independent.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_PATH_TRACK_STABLE_V1__) return;
  g.__CLARITY_PATH_TRACK_STABLE_V1__ = true;

  var ORDER = ["seeker", "new_muslim", "practicing", "dai"];

  function isPath(id) {
    return ORDER.indexOf(String(id || "").toLowerCase()) >= 0;
  }

  function mark(gate) {
    document.querySelectorAll(".cgs-btn[data-gate]").forEach(function (btn) {
      var g0 = btn.getAttribute("data-gate");
      btn.classList.toggle("is-active", g0 === gate);
    });
    try {
      document.documentElement.setAttribute("data-clarity-path", gate);
      document.body.setAttribute("data-clarity-path", gate);
    } catch (e) {}
  }

  function extent(gate) {
    if (!isPath(gate)) return;
    try {
      localStorage.setItem("clarity_committed_path", gate);
    } catch (e) {}
    try {
      if (typeof g.applyGateSectionFilter === "function") g.applyGateSectionFilter(gate);
      else if (typeof g.applyAdditiveFilter === "function") g.applyAdditiveFilter(gate);
    } catch (e) {}
    mark(gate);
  }

  /* Block section openers only while path is applying — short window */
  function guardSections(ms) {
    g.__clarityPathExtentOnly = true;
    setTimeout(function () {
      g.__clarityPathExtentOnly = false;
    }, ms || 800);
  }

  function wrapSections() {
    ["switchTab", "clarityOpenSectionDoor"].forEach(function (name) {
      var prev = g[name];
      if (typeof prev !== "function" || prev.__pathStableGuard) return;
      var w = function (id) {
        if (isPath(id)) {
          /* mis-routed path id → path switch */
          if (typeof g.claritySwitchGate === "function") return g.claritySwitchGate(id);
          extent(id);
          return;
        }
        if (g.__clarityPathExtentOnly) return;
        return prev.apply(this, arguments);
      };
      w.__pathStableGuard = true;
      g[name] = w;
    });
  }

  function wrapPath() {
    var prev = g.claritySwitchGate;
    var prevReq = g.clarityRequestPath;
    function run(gate) {
      gate = String(gate || "seeker").toLowerCase();
      if (!isPath(gate)) return;
      guardSections(900);
      try {
        if (typeof prevReq === "function") prevReq(gate);
        else if (typeof prev === "function" && !prev.__pathStable) prev(gate);
      } catch (e) {
        console.warn("[path-stable]", e);
      }
      extent(gate);
      setTimeout(function () { extent(gate); }, 200);
    }
    var w = function (g0) { return run(g0); };
    w.__pathStable = true;
    w.__isRequest = true;
    g.claritySwitchGate = w;
  }

  function bind() {
    document.querySelectorAll(".clarity-gate-switcher .cgs-btn[data-gate]").forEach(function (btn) {
      if (btn.__pathStableBound) return;
      btn.__pathStableBound = true;
      /* capture: after native onclick */
      btn.addEventListener(
        "click",
        function () {
          var gate = btn.getAttribute("data-gate");
          if (!isPath(gate)) return;
          guardSections(900);
          setTimeout(function () { extent(gate); }, 60);
          setTimeout(function () { extent(gate); }, 400);
        },
        false
      );
    });
  }

  function ensureTrackVisible() {
    var el = document.querySelector(".clarity-gate-switcher");
    if (!el) return;
    /* only unhide if currently none — never rewrite HTML */
    try {
      var st = window.getComputedStyle(el);
      if (st.display === "none") {
        el.style.setProperty("display", "flex", "important");
        el.style.setProperty("visibility", "visible", "important");
      }
    } catch (e) {}
  }

  function cycle() {
    wrapSections();
    wrapPath();
    bind();
    ensureTrackVisible();
    var cur = "seeker";
    try {
      cur =
        localStorage.getItem("clarity_committed_path") ||
        document.documentElement.getAttribute("data-clarity-path") ||
        "seeker";
    } catch (e) {}
    if (isPath(cur)) mark(cur);
  }

  function boot() {
    cycle();
    setTimeout(cycle, 400);
    setTimeout(cycle, 1200);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("load", function () { setTimeout(cycle, 300); });

  g.ClarityPathStable = { extent: extent, mark: mark, order: ORDER };
})(typeof window !== "undefined" ? window : this);
