/**
 * companion-path-track-stable-v1.js · 20261026FREEZE
 * Freeze-safe path track binder. No intervals, no observers, no DOM surgery.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_PATH_TRACK_STABLE_V2__) return;
  g.__CLARITY_PATH_TRACK_STABLE_V2__ = true;

  var ORDER = ["seeker", "new_muslim", "practicing", "dai"];
  var applying = false;

  function isPath(id) {
    return ORDER.indexOf(String(id || "").toLowerCase()) >= 0;
  }

  function mark(gate) {
    try {
      document.querySelectorAll(".cgs-btn[data-gate]").forEach(function (btn) {
        btn.classList.toggle("is-active", btn.getAttribute("data-gate") === gate);
      });
      document.documentElement.setAttribute("data-clarity-path", gate);
      document.body.setAttribute("data-clarity-path", gate);
    } catch (e) {}
  }

  function extent(gate) {
    if (!isPath(gate) || applying) return;
    applying = true;
    try {
      try { localStorage.setItem("clarity_committed_path", gate); } catch (e) {}
      if (typeof g.applyGateSectionFilter === "function") {
        try { g.applyGateSectionFilter(gate); } catch (e) {}
      } else if (typeof g.applyAdditiveFilter === "function") {
        try { g.applyAdditiveFilter(gate); } catch (e) {}
      }
      mark(gate);
    } finally {
      setTimeout(function () { applying = false; }, 100);
    }
  }

  function wrapSections() {
    ["switchTab", "clarityOpenSectionDoor"].forEach(function (name) {
      var prev = g[name];
      if (typeof prev !== "function" || prev.__pathStableV2) return;
      var w = function (id) {
        if (g.__clarityPathExtentOnly) return;
        if (isPath(id)) {
          extent(id);
          return;
        }
        return prev.apply(this, arguments);
      };
      w.__pathStableV2 = true;
      g[name] = w;
    });
  }

  function wrapPath() {
    var prevReq = g.clarityRequestPath;
    var prev = g.claritySwitchGate;
    if (g.claritySwitchGate && g.claritySwitchGate.__pathStableV2) return;

    var w = function (gate) {
      gate = String(gate || "seeker").toLowerCase();
      if (!isPath(gate) || applying) return;
      g.__clarityPathExtentOnly = true;
      try {
        if (typeof prevReq === "function") {
          try { prevReq(gate); } catch (e) {}
        } else if (typeof prev === "function" && !prev.__pathStableV2) {
          try { prev(gate); } catch (e) {}
        }
        extent(gate);
      } finally {
        setTimeout(function () {
          g.__clarityPathExtentOnly = false;
        }, 500);
      }
    };
    w.__pathStableV2 = true;
    w.__isRequest = true;
    g.claritySwitchGate = w;
  }

  function bind() {
    document.querySelectorAll(".clarity-gate-switcher .cgs-btn[data-gate]").forEach(function (btn) {
      if (btn.__pathStableV2Bound) return;
      btn.__pathStableV2Bound = true;
      btn.addEventListener("click", function () {
        var gate = btn.getAttribute("data-gate");
        if (!isPath(gate)) return;
        setTimeout(function () { extent(gate); }, 80);
      });
    });
  }

  function boot() {
    wrapSections();
    wrapPath();
    bind();
    var cur = "seeker";
    try {
      cur = localStorage.getItem("clarity_committed_path") || "seeker";
    } catch (e) {}
    if (isPath(cur)) mark(cur);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  /* one delayed re-wire only — not a storm */
  setTimeout(boot, 600);
})(typeof window !== "undefined" ? window : this);
