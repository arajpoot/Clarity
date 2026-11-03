/*! Clarity Companion unfreeze v4 · Phase 2 smooth · campus untouched */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_COMPANION_UNFREEZE_V4__) return;
  w.__CLARITY_COMPANION_UNFREEZE_V4__ = true;
  w.__CLARITY_COMPANION_UNFREEZE_V3__ = true; /* compat */

  var SHELL_KEY = "clarity_shell_mode_v1";
  var LOG = [];
  w.__COMPANION_UNFREEZE_LOG = LOG;
  var settled = false;
  var lastMainDisplay = "";

  function log(m) {
    try { LOG.push(String(m)); } catch (e) {}
  }

  function hide(el) {
    if (!el) return;
    try {
      el.style.setProperty("display", "none", "important");
      el.setAttribute("hidden", "hidden");
      el.setAttribute("aria-hidden", "true");
    } catch (e) {}
  }

  function showMain(el) {
    if (!el) return;
    try {
      el.removeAttribute("hidden");
      el.setAttribute("aria-hidden", "false");
      el.hidden = false;
      /* only write if needed — reduces jump */
      if (el.style.display === "none" || el.getAttribute("style") && /display\s*:\s*none/i.test(el.getAttribute("style") || "")) {
        el.style.setProperty("display", "block", "important");
      } else if (!el.style.display) {
        el.style.setProperty("display", "block", "important");
      }
      el.style.setProperty("visibility", "visible", "important");
      el.style.setProperty("opacity", "1", "important");
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
    [
      "clarity-day-landing",
      "clarity-landing-stack",
      "amana-vault-gate",
      "amana-vault-interior",
      "landing-gate-screen",
      "clarity-welcome"
    ].forEach(function (id) {
      hide(d.getElementById(id));
    });
  }

  function openReminderOnce() {
    var hash = (w.location.hash || "").replace(/^#/, "").toLowerCase();
    var map = {
      reminder: "tab-reminder",
      reality: "tab-reality",
      reflection: "tab-reflection",
      action: "tab-action",
      notes: "tab-notes"
    };
    var target = map[hash] || "tab-reminder";
    var rem = d.getElementById(target) || d.getElementById("tab-reminder");
    if (!rem) return;
    if (rem.classList.contains("is-active") && rem.getAttribute("aria-hidden") === "false") {
      /* already open — avoid class thrash */
      if (getComputedStyle(rem).display === "none") {
        rem.style.setProperty("display", "block", "important");
      }
      return;
    }
    d.querySelectorAll(".tab-panel.is-active, .tab-panel.active").forEach(function (p) {
      if (p === rem) return;
      p.classList.remove("is-active", "active");
      p.setAttribute("aria-hidden", "true");
    });
    rem.classList.add("is-active", "active");
    rem.setAttribute("aria-hidden", "false");
    rem.removeAttribute("hidden");
    rem.style.setProperty("display", "block", "important");
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
          restore("after-shell-apply");
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

  function restore(why) {
    forceCompanionShell();
    scrubLanding();
    var main = d.getElementById("main-content");
    if (main) {
      var disp = "";
      try { disp = getComputedStyle(main).display; } catch (e) {}
      if (disp === "none" || main.style.display === "none") {
        showMain(main);
        log("main restored " + why);
      } else {
        /* soft ensure without rewrite */
        main.setAttribute("aria-hidden", "false");
        main.removeAttribute("hidden");
      }
    }
    openReminderOnce();
    patchShell();
  }

  function settle() {
    restore("settle");
    settled = true;
    log("settled");
  }

  /* Early: attributes only, minimal layout */
  forceCompanionShell();

  function onReady() {
    restore("ready");
    /* one follow-up after shell timers (40–200ms) */
    setTimeout(function () {
      restore("t220");
      settle();
    }, 220);
    setTimeout(function () {
      /* final quiet check only if main hidden */
      var main = d.getElementById("main-content");
      if (main && getComputedStyle(main).display === "none") {
        restore("t600-fix");
      } else {
        log("stable@600");
      }
    }, 600);
  }

  if (d.readyState === "loading") {
    d.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }
  w.addEventListener("load", function () {
    var main = d.getElementById("main-content");
    if (main && getComputedStyle(main).display === "none") restore("load");
    else log("load-ok");
  });

  /* Observe only shell-mode attribute — not every class thrash */
  try {
    var mo = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        if (muts[i].attributeName === "data-shell-mode") {
          if (d.documentElement.getAttribute("data-shell-mode") === "landing") {
            restore("mo-landing");
          }
        }
      }
    });
    mo.observe(d.documentElement, { attributes: true, attributeFilter: ["data-shell-mode"] });
  } catch (e) {}

  w.clarityCompanionUnfreeze = function () { restore("manual"); };
})(window, document);
