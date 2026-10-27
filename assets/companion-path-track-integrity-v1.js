/**
 * companion-path-track-integrity-v1.js · 20261026PATH
 * Path track pills (Seeker · New Muslim · Daily · Da’i) must change PATH EXTENT only —
 * not cross-wire into RRRA section pills (Reminder/Reality/…).
 * Educational only — not a fatwa. Campus untouched.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_PATH_TRACK_INTEGRITY_V1__) return;
  g.__CLARITY_PATH_TRACK_INTEGRITY_V1__ = true;

  var ORDER = ["seeker", "new_muslim", "practicing", "dai"];
  var LABELS = {
    seeker: "Seeker",
    new_muslim: "New Muslim",
    practicing: "Daily Muslim",
    dai: "Da’i"
  };

  function isPathGate(id) {
    id = String(id || "").toLowerCase().trim();
    return ORDER.indexOf(id) >= 0;
  }

  function currentPath() {
    try {
      return (
        document.documentElement.getAttribute("data-clarity-path") ||
        localStorage.getItem("clarity_committed_path") ||
        "seeker"
      );
    } catch (e) {
      return "seeker";
    }
  }

  function markTrackUI(gate) {
    gate = isPathGate(gate) ? gate : currentPath();
    document.querySelectorAll(".cgs-btn[data-gate], [data-gate]").forEach(function (btn) {
      var g0 = btn.getAttribute("data-gate");
      if (!g0) return;
      btn.classList.toggle("is-active", g0 === gate);
      btn.setAttribute("aria-pressed", g0 === gate ? "true" : "false");
    });
    try {
      document.documentElement.setAttribute("data-clarity-path", gate);
      document.body.setAttribute("data-clarity-path", gate);
    } catch (e) {}
  }

  function applyExtent(gate) {
    gate = isPathGate(gate) ? gate : "seeker";
    try {
      localStorage.setItem("clarity_committed_path", gate);
      localStorage.setItem("clarity_path_override", gate);
    } catch (e) {}
    try {
      document.documentElement.setAttribute("data-clarity-path", gate);
      document.body.setAttribute("data-clarity-path", gate);
    } catch (e) {}

    /* Prefer official additive filter from path-progress */
    try {
      if (typeof g.applyGateSectionFilter === "function") {
        g.applyGateSectionFilter(gate);
      } else if (typeof g.applyAdditiveFilter === "function") {
        g.applyAdditiveFilter(gate);
      }
    } catch (e) {}

    /* Badge */
    try {
      var badge = document.getElementById("current-mode-badge");
      var labels = {
        seeker: "SEEKER JOURNEY MODE",
        new_muslim: "NEW MUSLIM TRACK",
        practicing: "DAILY MUSLIM / LEGACY",
        dai: "ASPIRING DA’I TRACK"
      };
      if (badge && labels[gate]) badge.textContent = labels[gate];
    } catch (e) {}

    markTrackUI(gate);
  }

  /** Block section switchTab/openDoor while a path extent is applying */
  function wrapSectionOpeners() {
    ["switchTab", "clarityOpenSectionDoor"].forEach(function (name) {
      var prev = g[name];
      if (typeof prev !== "function") return;
      if (prev.__pathTrackGuard) return;
      var wrapped = function (id) {
        /* If caller passes a path gate by mistake, treat as path switch */
        if (isPathGate(id)) {
          try {
            if (typeof g.claritySwitchGate === "function") return g.claritySwitchGate(id);
          } catch (e) {}
          applyExtent(id);
          return;
        }
        if (g.__clarityPathExtentOnly) {
          /* Swallow hub jumps from path-progress applyContent */
          return undefined;
        }
        return prev.apply(this, arguments);
      };
      wrapped.__pathTrackGuard = true;
      wrapped.__prev = prev;
      g[name] = wrapped;
    });
  }

  function wrapPathSwitch() {
    var prev = g.claritySwitchGate;
    var prevReq = g.clarityRequestPath;

    function runPath(gate) {
      gate = String(gate || "seeker").toLowerCase();
      if (!isPathGate(gate)) return;
      g.__clarityPathExtentOnly = true;
      try {
        if (typeof prevReq === "function") {
          try {
            prevReq(gate);
          } catch (e) {
            console.warn("[path-track]", e);
          }
        } else if (typeof prev === "function" && !prev.__pathTrackIntegrity) {
          try {
            prev(gate);
          } catch (e2) {}
        }
        /* Always re-assert extent + track UI (quiz may still open) */
        applyExtent(gate);
      } finally {
        setTimeout(function () {
          g.__clarityPathExtentOnly = false;
          applyExtent(gate);
          markTrackUI(gate);
        }, 100);
        setTimeout(function () {
          g.__clarityPathExtentOnly = false;
          applyExtent(gate);
        }, 600);
        setTimeout(function () {
          g.__clarityPathExtentOnly = false;
        }, 1600);
      }
    }

    var wrapped = function (gate) {
      return runPath(gate);
    };
    wrapped.__pathTrackIntegrity = true;
    wrapped.__isRequest = true;
    g.claritySwitchGate = wrapped;
    g.applyGateConfiguration = wrapped;

    /* Keep request path but ensure extent-only side effects */
    if (typeof prevReq === "function") {
      g.clarityRequestPath = function (gate) {
        g.__clarityPathExtentOnly = true;
        var r;
        try {
          r = prevReq.apply(this, arguments);
        } finally {
          setTimeout(function () {
            applyExtent(gate);
            g.__clarityPathExtentOnly = false;
          }, 120);
        }
        return r;
      };
    }
  }

  function bindTrackClicks() {
    document.querySelectorAll(".clarity-gate-switcher .cgs-btn[data-gate], .cgs-btn[data-gate]").forEach(function (btn) {
      if (btn.__pathTrackBound) return;
      btn.__pathTrackBound = true;
      btn.addEventListener(
        "click",
        function (ev) {
          var gate = btn.getAttribute("data-gate");
          if (!isPathGate(gate)) return;
          /* Let onclick fire claritySwitchGate; also enforce extent */
          g.__clarityPathExtentOnly = true;
          setTimeout(function () {
            applyExtent(gate);
            markTrackUI(gate);
          }, 50);
          setTimeout(function () {
            applyExtent(gate);
            g.__clarityPathExtentOnly = false;
          }, 500);
        },
        true
      );
    });
  }

  function cycle() {
    wrapSectionOpeners();
    wrapPathSwitch();
    bindTrackClicks();
    markTrackUI(currentPath());
    try {
      if (typeof g.applyGateSectionFilter === "function") {
        g.applyGateSectionFilter(currentPath());
      }
    } catch (e) {}
  }

  function boot() {
    cycle();
    setTimeout(cycle, 300);
    setTimeout(cycle, 900);
    setTimeout(cycle, 2000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("load", function () {
    setTimeout(cycle, 400);
  });

  g.ClarityPathTrack = {
    applyExtent: applyExtent,
    markTrackUI: markTrackUI,
    order: ORDER,
    labels: LABELS
  };
})(typeof window !== "undefined" ? window : this);
