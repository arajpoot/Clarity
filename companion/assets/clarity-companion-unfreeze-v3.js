/*! Clarity Companion unfreeze v3 · Phase 1 · campus/amana untouched · educational only */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_COMPANION_UNFREEZE_V3__) return;
  w.__CLARITY_COMPANION_UNFREEZE_V3__ = true;

  var LOG = [];
  function log(m) {
    try {
      LOG.push(String(m));
      w.__COMPANION_UNFREEZE_LOG = LOG;
    } catch (e) {}
  }

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
      el.style.removeProperty("display");
      if (getComputedStyle(el).display === "none") {
        el.style.setProperty("display", "block", "important");
      }
    } catch (e) {}
  }

  function scrubDayLandingAndVaultChrome() {
    [
      "clarity-day-landing",
      "clarity-landing-stack",
      "amana-vault-gate",
      "amana-vault-interior",
      "clarity-reopen-bar",
      "landing-gate-screen",
      "clarity-welcome"
    ].forEach(function (id) {
      hide(d.getElementById(id));
    });
    try {
      d.querySelectorAll(
        ".clarity-day-landing,[data-clarity-day-landing],.day-landing-stack,.clarity-welcome-overlay,#landing-gate-screen"
      ).forEach(hide);
    } catch (e) {}
  }

  function forceCompanionRoom() {
    try {
      var root = d.documentElement;
      root.setAttribute("data-clarity-room", "companion");
      root.setAttribute("data-clarity-viewport", "companion-path");
      root.setAttribute("data-shell-mode", "companion");
      root.classList.add("companion-unfrozen");
      root.classList.remove("shell-landing");
      try {
        localStorage.setItem("clarity_shell_mode", "companion");
        localStorage.setItem("clarity_welcome_seen_v2", "1");
        localStorage.setItem("clarity_welcome_seen", "1");
      } catch (e) {}
      w.__CLARITY_SKIP_DAY_LANDING__ = true;
    } catch (e) {
      log("room-attr " + e);
    }
  }

  function unlockPointer() {
    try {
      d.documentElement.style.pointerEvents = "";
      d.body && (d.body.style.pointerEvents = "");
      d.documentElement.style.overflowY = "";
      if (d.body) d.body.style.overflowY = "";
    } catch (e) {}
  }

  function showMain() {
    var main = d.getElementById("main-content");
    if (main) {
      show(main);
      main.style.setProperty("visibility", "visible", "important");
      main.style.setProperty("opacity", "1", "important");
      log("main-content shown");
    } else {
      log("main-content MISSING");
    }
  }

  function openReminderOrHash() {
    var hash = (w.location.hash || "").replace(/^#/, "").toLowerCase();
    var map = {
      reminder: "tab-reminder",
      reality: "tab-reality",
      reflection: "tab-reflection",
      action: "tab-action",
      notes: "tab-notes",
      meme: "tab-meme",
      tajweed: "tab-tajweed",
      calligraphy: "tab-calligraphy",
      callig: "tab-calligraphy"
    };
    var targetId = map[hash] || "tab-reminder";
    var panels = d.querySelectorAll(".tab-panel, [class*='tab-panel']");
    panels.forEach(function (p) {
      try {
        p.classList.remove("is-active", "active");
        if (p.id && p.id.indexOf("tab-") === 0) {
          p.setAttribute("aria-hidden", "true");
        }
      } catch (e) {}
    });
    var rem = d.getElementById(targetId) || d.getElementById("tab-reminder");
    if (rem) {
      rem.classList.add("is-active", "active");
      rem.setAttribute("aria-hidden", "false");
      rem.removeAttribute("hidden");
      rem.style.setProperty("display", "block", "important");
      log("panel open " + (rem.id || targetId));
    } else {
      log("tab-reminder MISSING");
    }
    try {
      if (typeof w.clarityOpenSectionDoor === "function") {
        var door = hash && map[hash] ? hash : "reminder";
        if (door === "callig") door = "calligraphy";
        w.clarityOpenSectionDoor(door);
      } else if (typeof w.switchTab === "function") {
        w.switchTab(hash && map[hash] ? hash : "reminder");
      }
    } catch (e) {
      log("door " + e);
    }
  }

  function neutralizeDayLandingShow() {
    /* Override any later script that forces day-landing visible on Companion */
    try {
      var land = d.getElementById("clarity-day-landing");
      if (land) {
        try {
          Object.defineProperty(land.style, "display", {
            configurable: true,
            set: function () {
              /* swallow forced show */
            },
            get: function () {
              return "none";
            }
          });
        } catch (e) {
          hide(land);
        }
        hide(land);
      }
    } catch (e) {}
  }

  function pass(label) {
    forceCompanionRoom();
    unlockPointer();
    scrubDayLandingAndVaultChrome();
    showMain();
    openReminderOrHash();
    neutralizeDayLandingShow();
    log("pass:" + label);
  }

  pass("sync");
  if (d.readyState === "loading") {
    d.addEventListener("DOMContentLoaded", function () {
      pass("dom");
    });
  } else {
    pass("dom-ready");
  }
  w.addEventListener("load", function () {
    pass("load");
  });
  setTimeout(function () {
    pass("t300");
  }, 300);
  setTimeout(function () {
    pass("t1200");
  }, 1200);
  setTimeout(function () {
    pass("t2800");
  }, 2800);

  /* Public hook for rail */
  w.clarityCompanionUnfreeze = function () {
    pass("manual");
  };
})(window, document);
