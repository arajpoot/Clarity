/*! Clarity Companion wire v1 · 20261031CW1
 * Tabs · Daily · Campus · main-content visibility · hash routes
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_COMPANION_WIRE_V1__) return;
  w.__CLARITY_COMPANION_WIRE_V1__ = true;

  var TABS = ["reminder", "reality", "reflection", "action", "notes"];
  var DAILY = "/daily/";
  var CAMPUS = "/campus/";
  var COMP = "/?enter=companion#reminder";

  function $(id) {
    return document.getElementById(id);
  }

  function markCompanion() {
    try {
      sessionStorage.setItem("clarity_landing_dest_v1", "companion");
      sessionStorage.setItem("clarity_shell_user_pick_v1", "1");
      sessionStorage.setItem("clarity_daily_first_skip_v1", "1");
      localStorage.setItem("clarity_shell_mode_v1", "companion");
      document.documentElement.setAttribute("data-shell-mode", "companion");
    } catch (e) {}
  }

  function showMain() {
    var main = $("main-content");
    if (!main) return;
    main.hidden = false;
    main.removeAttribute("aria-hidden");
    main.style.setProperty("display", "block", "important");
    main.style.setProperty("visibility", "visible", "important");
    main.style.setProperty("pointer-events", "auto", "important");
    document.querySelectorAll(".shell-landing-hide").forEach(function (el) {
      if (el.id === "main-content" || (main.contains && main.contains(el))) {
        el.classList.remove("shell-landing-hide");
      }
    });
  }

  function openTab(name) {
    name = String(name || "reminder").toLowerCase().replace(/^#/, "");
    if (name === "vault" || name === "amana") name = "notes";
    if (TABS.indexOf(name) < 0) name = "reminder";

    markCompanion();
    showMain();

    try {
      document.body.setAttribute("data-active-tab", name);
    } catch (e) {}

    TABS.forEach(function (t) {
      var panel = $("tab-" + t);
      if (!panel) return;
      var on = t === name;
      panel.classList.toggle("active", on);
      panel.classList.toggle("is-active", on);
      panel.hidden = !on;
      panel.setAttribute("aria-hidden", on ? "false" : "true");
      if (on) {
        panel.style.setProperty("display", "block", "important");
        panel.style.setProperty("visibility", "visible", "important");
      } else {
        panel.style.setProperty("display", "none", "important");
      }
    });

    document.querySelectorAll("[data-rail-tab], [data-rrra], .door-rail-btn").forEach(function (btn) {
      var t = (btn.getAttribute("data-rail-tab") || btn.getAttribute("data-rrra") || "").toLowerCase();
      if (t === "vault" || t === "amana") t = "notes";
      var on = t === name;
      btn.classList.toggle("active", on);
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-current", on ? "page" : "false");
    });

    try {
      var hash = name === "notes" ? "notes" : name;
      if ((w.location.hash || "").replace(/^#/, "") !== hash) {
        history.replaceState(null, "", w.location.pathname + w.location.search + "#" + hash);
      }
    } catch (e2) {}

    try {
      w.dispatchEvent(new CustomEvent("clarity-tab-change", { detail: { tab: name } }));
    } catch (e3) {}
  }

  function wireRail() {
    document.querySelectorAll("[data-rail-tab], .door-rail-btn[data-rrra], button[onclick*='clarityOpenSectionDoor']").forEach(function (btn) {
      if (btn.__cwRail) return;
      btn.__cwRail = true;
      btn.addEventListener(
        "click",
        function (ev) {
          var t =
            btn.getAttribute("data-rail-tab") ||
            btn.getAttribute("data-rrra") ||
            "";
          if (!t && btn.getAttribute("onclick")) {
            var m = String(btn.getAttribute("onclick")).match(/clarityOpenSectionDoor\(['\"](\w+)['\"]\)/);
            if (m) t = m[1];
          }
          if (!t) return;
          try {
            ev.preventDefault();
          } catch (e) {}
          openTab(t);
        },
        true
      );
    });
  }

  function wirePaths() {
    document.querySelectorAll("a[href], button").forEach(function (el) {
      if (el.__cwPath) return;
      var href = (el.getAttribute && el.getAttribute("href")) || "";
      var text = ((el.textContent || "") + " " + (el.getAttribute("aria-label") || "")).toLowerCase();

      if (/open daily|daily routines|daily page|day landing|yawm/.test(text) && !/campus/.test(text)) {
        el.__cwPath = true;
        if (el.tagName === "A") el.setAttribute("href", DAILY);
        el.addEventListener(
          "click",
          function (ev) {
            try {
              sessionStorage.setItem("clarity_landing_dest_v1", "daily");
            } catch (e) {}
            if (el.tagName !== "A") {
              try {
                ev.preventDefault();
              } catch (e2) {}
              w.location.href = DAILY;
            }
          },
          true
        );
      }

      if (/university path|campus path|campus map|campus desk/.test(text)) {
        el.__cwPath = true;
        if (el.tagName === "A") el.setAttribute("href", CAMPUS);
        el.addEventListener(
          "click",
          function (ev) {
            try {
              sessionStorage.setItem("clarity_landing_dest_v1", "campus");
            } catch (e) {}
            if (el.tagName !== "A") {
              try {
                ev.preventDefault();
              } catch (e2) {}
              w.location.href = CAMPUS;
            }
          },
          true
        );
      }
    });

    /* Soft remap 404 section paths still in DOM */
    var map = {
      "/grave": "/campus/journey/",
      "/seerah": "/campus/journey/",
      "/tafseer": "/campus/library/",
      "/tajweed": "/campus/lab/",
      "/lectures": "/campus/library/",
      "/notes": "/?enter=companion#notes",
      "/meme": "/?enter=companion#reminder",
      "/commands": "/campus/library/",
      "/fiqh-tools": "/campus/library/",
      "/charter/": "/campus/",
    };
    document.querySelectorAll("a[href]").forEach(function (a) {
      var h = (a.getAttribute("href") || "").split("?")[0].split("#")[0];
      if (map[h]) a.setAttribute("href", map[h]);
    });
  }

  function fromHash() {
    try {
      var h = (w.location.hash || "").replace(/^#/, "").toLowerCase();
      if (!h) return;
      if (TABS.indexOf(h) >= 0 || h === "vault" || h === "amana") openTab(h);
    } catch (e) {}
  }

  function ensureApi() {
    w.clarityOpenSectionDoor = function (name) {
      openTab(name);
    };
    w.ClarityCompanionWire = {
      openTab: openTab,
      showMain: showMain,
      markCompanion: markCompanion,
    };
  }

  function boot() {
    ensureApi();
    wireRail();
    wirePaths();
    showMain();
    fromHash();
    /* If companion mode and no hash, show reminder */
    try {
      var mode = document.documentElement.getAttribute("data-shell-mode") || "";
      var h = (w.location.hash || "").replace(/^#/, "");
      if ((mode === "companion" || sessionStorage.getItem("clarity_landing_dest_v1") === "companion") && !h) {
        openTab("reminder");
      }
    } catch (e) {}
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    boot();
    setTimeout(boot, 300);
    setTimeout(boot, 1200);
  });
  w.addEventListener("hashchange", fromHash);
})(typeof window !== "undefined" ? window : this);
