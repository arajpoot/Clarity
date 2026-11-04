/*! Clarity Companion unfreeze v4.1 · no reminder re-leak · campus untouched */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_COMPANION_UNFREEZE_V4__) return;
  w.__CLARITY_COMPANION_UNFREEZE_V4__ = true;
  w.__CLARITY_COMPANION_UNFREEZE_V3__ = true;

  var SHELL_KEY = "clarity_shell_mode_v1";
  var LOG = [];
  w.__COMPANION_UNFREEZE_LOG = LOG;
  var tabBooted = false;

  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  function hide(el) {
    if (!el) return;
    try {
      el.style.setProperty("display", "none", "important");
      el.setAttribute("hidden", "hidden");
      el.setAttribute("aria-hidden", "true");
    } catch (e) {}
  }

  function forceCompanionShell() {
    try {
      localStorage.setItem(SHELL_KEY, "companion");
      sessionStorage.setItem("clarity_shell_user_pick_v1", "1");
    } catch (e) {}
    try {
      var root = d.documentElement;
      if (root.getAttribute("data-shell-mode") !== "companion") {
        root.setAttribute("data-shell-mode", "companion");
      }
      root.setAttribute("data-clarity-room", "companion");
      root.setAttribute("data-clarity-viewport", "companion-path");
      root.classList.add("companion-unfrozen");
      if (d.body && d.body.getAttribute("data-shell-mode") !== "companion") {
        d.body.setAttribute("data-shell-mode", "companion");
      }
    } catch (e) {}
    w.__CLARITY_SKIP_DAY_LANDING__ = true;
  }

  function scrubLanding() {
    ["clarity-day-landing","clarity-landing-stack","amana-vault-gate","amana-vault-interior","landing-gate-screen","clarity-welcome"].forEach(function (id) {
      hide(d.getElementById(id));
    });
  }

  function showMainOnly() {
    var main = d.getElementById("main-content");
    if (!main) return;
    try {
      main.removeAttribute("hidden");
      main.setAttribute("aria-hidden", "false");
      main.hidden = false;
      if (getComputedStyle(main).display === "none") {
        main.style.setProperty("display", "block", "important");
        log("main restored");
      }
      main.style.setProperty("visibility", "visible", "important");
      main.style.setProperty("opacity", "1", "important");
    } catch (e) {}
  }

  /** Only on first boot — do NOT re-force reminder after user changes tab */
  function openDefaultTabOnce() {
    if (tabBooted) return;
    tabBooted = true;
    var hash = (w.location.hash || "").replace(/^#/, "").toLowerCase();
    var map = {
      reminder: "tab-reminder",
      reality: "tab-reality",
      reflection: "tab-reflection",
      action: "tab-action",
      notes: "tab-notes"
    };
    var target = map[hash] || "tab-reminder";
    d.querySelectorAll(".tab-panel").forEach(function (p) {
      p.classList.remove("is-active", "active");
      p.setAttribute("aria-hidden", "true");
    });
    var rem = d.getElementById(target) || d.getElementById("tab-reminder");
    if (rem) {
      rem.classList.add("is-active", "active");
      rem.setAttribute("aria-hidden", "false");
      rem.removeAttribute("hidden");
      rem.style.removeProperty("display");
      log("default tab " + rem.id);
    }
    try {
      if (typeof w.clarityOpenSectionDoor === "function") {
        w.clarityOpenSectionDoor(hash && map[hash] ? hash : "reminder");
      }
    } catch (e) {}
  }

  function patchShell() {
    if (!w.ClarityShell || w.ClarityShell.__companionPatched) return;
    try {
      if (typeof w.ClarityShell.setMode === "function") {
        var os = w.ClarityShell.setMode.bind(w.ClarityShell);
        w.ClarityShell.setMode = function (m) {
          if (m === "landing") {
            log("block landing");
            m = "companion";
          }
          return os(m);
        };
      }
      if (typeof w.ClarityShell.apply === "function") {
        var oa = w.ClarityShell.apply.bind(w.ClarityShell);
        w.ClarityShell.apply = function () {
          try { localStorage.setItem(SHELL_KEY, "companion"); } catch (e) {}
          var r = oa();
          forceCompanionShell();
          scrubLanding();
          showMainOnly();
          /* no openDefaultTabOnce here */
          return r;
        };
      }
      w.ClarityShell.__companionPatched = true;
      log("shell patched");
      try { w.ClarityShell.setMode("companion"); } catch (e) {}
    } catch (e) {
      log("patch " + e);
    }
  }

  function restore(why, withTab) {
    forceCompanionShell();
    scrubLanding();
    showMainOnly();
    if (withTab) openDefaultTabOnce();
    patchShell();
    log("pass:" + why);
  }

  forceCompanionShell();

  function onReady() {
    restore("ready", true);
    setTimeout(function () { restore("t220", false); }, 220);
    setTimeout(function () {
      var main = d.getElementById("main-content");
      if (main && getComputedStyle(main).display === "none") restore("t600-fix", false);
      else log("stable@600");
    }, 600);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", onReady);
  else onReady();
  w.addEventListener("load", function () {
    var main = d.getElementById("main-content");
    if (main && getComputedStyle(main).display === "none") restore("load", false);
    else log("load-ok");
  });

  try {
    var mo = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        if (muts[i].attributeName === "data-shell-mode") {
          if (d.documentElement.getAttribute("data-shell-mode") === "landing") {
            restore("mo-landing", false);
          }
        }
      }
    });
    mo.observe(d.documentElement, { attributes: true, attributeFilter: ["data-shell-mode"] });
  } catch (e) {}

  w.clarityCompanionUnfreeze = function () { restore("manual", false); };
})(window, document);
