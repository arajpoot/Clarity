/*! Clarity Companion unfreeze v3.1 · defeats shell-v3 landing hide · campus untouched */
(function (w, d) {
  "use strict";
  var SHELL_KEY = "clarity_shell_mode_v1";
  if (!w.__CLARITY_COMPANION_UNFREEZE_V3__) {
    w.__CLARITY_COMPANION_UNFREEZE_V3__ = true;
  }
  var LOG = w.__COMPANION_UNFREEZE_LOG || [];
  w.__COMPANION_UNFREEZE_LOG = LOG;
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  function hide(el) {
    if (!el) return;
    try {
      el.style.setProperty("display", "none", "important");
      el.setAttribute("hidden", "hidden");
      el.setAttribute("aria-hidden", "true");
    } catch (e) {}
  }
  function show(el) {
    if (!el) return;
    try {
      el.removeAttribute("hidden");
      el.setAttribute("aria-hidden", "false");
      el.hidden = false;
      el.style.setProperty("display", "block", "important");
      el.style.setProperty("visibility", "visible", "important");
      el.style.setProperty("opacity", "1", "important");
    } catch (e) {}
  }

  function forceCompanionShell() {
    try {
      localStorage.setItem(SHELL_KEY, "companion");
      sessionStorage.setItem("clarity_shell_user_pick_v1", "1");
      localStorage.setItem("clarity_shell_mode", "companion");
    } catch (e) {}
    try {
      var root = d.documentElement;
      root.setAttribute("data-clarity-room", "companion");
      root.setAttribute("data-clarity-viewport", "companion-path");
      root.setAttribute("data-shell-mode", "companion");
      root.classList.add("companion-unfrozen");
      root.classList.remove("shell-landing");
      if (d.body) d.body.setAttribute("data-shell-mode", "companion");
    } catch (e) {}
    w.__CLARITY_SKIP_DAY_LANDING__ = true;
    try {
      if (w.ClarityShell && typeof w.ClarityShell.setMode === "function") {
        w.ClarityShell.setMode("companion");
      }
    } catch (e) {}
  }

  function scrubLandingVault() {
    [
      "clarity-day-landing",
      "clarity-landing-stack",
      "amana-vault-gate",
      "amana-vault-interior",
      "landing-gate-screen",
      "clarity-welcome"
    ].forEach(function (id) { hide(d.getElementById(id)); });
    try {
      d.querySelectorAll(
        ".clarity-day-landing,[data-clarity-day-landing],.day-landing-stack,.clarity-welcome-overlay"
      ).forEach(hide);
    } catch (e) {}
  }

  function showMainAndReminder() {
    var main = d.getElementById("main-content");
    if (main) {
      show(main);
      main.style.removeProperty("display");
      main.style.setProperty("display", "block", "important");
      log("main shown");
    } else {
      log("main MISSING");
    }
    var hash = (w.location.hash || "").replace(/^#/, "").toLowerCase();
    var map = {
      reminder: "tab-reminder",
      reality: "tab-reality",
      reflection: "tab-reflection",
      action: "tab-action",
      notes: "tab-notes",
      meme: "tab-meme",
      tajweed: "tab-tajweed",
      calligraphy: "tab-calligraphy"
    };
    var target = map[hash] || "tab-reminder";
    d.querySelectorAll(".tab-panel").forEach(function (p) {
      try {
        p.classList.remove("is-active", "active");
        p.setAttribute("aria-hidden", "true");
      } catch (e) {}
    });
    var rem = d.getElementById(target) || d.getElementById("tab-reminder");
    if (rem) {
      rem.classList.add("is-active", "active");
      show(rem);
      log("panel " + rem.id);
    }
    try {
      if (typeof w.clarityOpenSectionDoor === "function") {
        w.clarityOpenSectionDoor(hash && map[hash] ? hash : "reminder");
      }
    } catch (e) {}
  }

  function patchShellApply() {
    try {
      if (!w.ClarityShell || typeof w.ClarityShell.apply !== "function") return;
      if (w.ClarityShell.__companionPatched) return;
      var orig = w.ClarityShell.apply.bind(w.ClarityShell);
      w.ClarityShell.apply = function () {
        try {
          localStorage.setItem(SHELL_KEY, "companion");
        } catch (e) {}
        var r = orig();
        /* After shell applies, force main visible on companion room */
        forceCompanionShell();
        showMainAndReminder();
        scrubLandingVault();
        return r;
      };
      if (typeof w.ClarityShell.setMode === "function") {
        var os = w.ClarityShell.setMode.bind(w.ClarityShell);
        w.ClarityShell.setMode = function (m) {
          if (m === "landing") {
            log("blocked setMode(landing) on companion room");
            m = "companion";
          }
          return os(m);
        };
      }
      w.ClarityShell.__companionPatched = true;
      log("shell patched");
    } catch (e) {
      log("patch fail " + e);
    }
  }

  function pass(label) {
    forceCompanionShell();
    scrubLandingVault();
    showMainAndReminder();
    patchShellApply();
    try {
      d.documentElement.style.pointerEvents = "";
      if (d.body) d.body.style.pointerEvents = "";
    } catch (e) {}
    log("pass:" + label);
  }

  pass("sync");
  if (d.readyState === "loading") {
    d.addEventListener("DOMContentLoaded", function () { pass("dom"); });
  } else {
    pass("dom-ready");
  }
  w.addEventListener("load", function () { pass("load"); });
  /* Beat shell-v3 timeouts (40 / 200 / mobile force) */
  [50, 100, 250, 500, 1200, 2000, 3500].forEach(function (t) {
    setTimeout(function () { pass("t" + t); }, t);
  });
  /* Observe shell mode flips back to landing */
  try {
    var mo = new MutationObserver(function () {
      var m = d.documentElement.getAttribute("data-shell-mode");
      if (m === "landing") {
        log("observed landing → force companion");
        pass("mo");
      }
      var main = d.getElementById("main-content");
      if (main && getComputedStyle(main).display === "none") {
        log("main hidden → restore");
        pass("mo-main");
      }
    });
    mo.observe(d.documentElement, { attributes: true, attributeFilter: ["data-shell-mode", "class"] });
  } catch (e) {}

  w.clarityCompanionUnfreeze = function () { pass("manual"); };
})(window, document);
