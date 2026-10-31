/*! Clarity Surface Authority v1 · 20261031SA1
 * Phases 1–4: ONE owner of Companion surface, tabs, gate kill, paths.
 * Replaces competing unfreeze / freeze-breaker / link-rescue stacks.
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_SURFACE_AUTHORITY_V1__) return;
  w.__CLARITY_SURFACE_AUTHORITY_V1__ = true;

  var TABS = ["reminder", "reality", "reflection", "action", "notes"];
  var DAILY = "/daily/";
  var CAMPUS = "/campus/";
  var VER = "20261031SA1";

  function $(id) {
    return document.getElementById(id);
  }

  /* ---------- Phase 1: shell authority ---------- */
  function forceCompanion() {
    try {
      document.documentElement.setAttribute("data-shell-mode", "companion");
      if (document.body) document.body.setAttribute("data-shell-mode", "companion");
      localStorage.setItem("clarity_shell_mode_v1", "companion");
      sessionStorage.setItem("clarity_landing_dest_v1", "companion");
      sessionStorage.setItem("clarity_shell_user_pick_v1", "1");
      sessionStorage.setItem("clarity_daily_first_skip_v1", "1");
    } catch (e) {}
    try {
      if (w.ClarityShell && typeof w.ClarityShell.setMode === "function") {
        if (!w.ClarityShell.setMode.__sa1) {
          var orig = w.ClarityShell.setMode.bind(w.ClarityShell);
          w.ClarityShell.setMode = function (m) {
            if (m === "landing") {
              /* In-page landing is retired — Daily is /daily/ */
              try {
                sessionStorage.setItem("clarity_landing_dest_v1", "daily");
              } catch (e2) {}
              w.location.href = DAILY;
              return;
            }
            return orig("companion");
          };
          w.ClarityShell.setMode.__sa1 = true;
        }
      }
    } catch (e3) {}
  }

  function unlockPointers() {
    try {
      document.documentElement.style.pointerEvents = "auto";
      document.body.style.pointerEvents = "auto";
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    } catch (e) {}
  }

  function showMain() {
    var main = $("main-content");
    if (!main) return null;
    main.hidden = false;
    main.removeAttribute("aria-hidden");
    main.classList.remove("shell-landing-hide", "gate-hidden", "hidden");
    main.style.setProperty("display", "block", "important");
    main.style.setProperty("visibility", "visible", "important");
    main.style.setProperty("opacity", "1", "important");
    main.style.setProperty("pointer-events", "auto", "important");
    main.style.setProperty("z-index", "2", "important");
    return main;
  }

  /* ---------- Phase 2: tabs ---------- */
  function openTab(name) {
    name = String(name || "reminder").toLowerCase().replace(/^#/, "");
    if (name === "vault" || name === "amana" || name === "journey") name = name === "journey" ? "reminder" : "notes";
    if (TABS.indexOf(name) < 0) name = "reminder";

    forceCompanion();
    unlockPointers();
    showMain();

    try {
      document.body.setAttribute("data-active-tab", name);
    } catch (e) {}

    TABS.forEach(function (t) {
      var p = $("tab-" + t);
      if (!p) return;
      var on = t === name;
      p.classList.toggle("active", on);
      p.classList.toggle("is-active", on);
      p.hidden = !on;
      p.setAttribute("aria-hidden", on ? "false" : "true");
      if (on) {
        p.style.setProperty("display", "block", "important");
        p.style.setProperty("visibility", "visible", "important");
        p.style.setProperty("opacity", "1", "important");
        p.style.setProperty("pointer-events", "auto", "important");
      } else {
        p.style.setProperty("display", "none", "important");
      }
    });

    document.querySelectorAll("[data-rail-tab], .door-rail-btn").forEach(function (btn) {
      var t = (btn.getAttribute("data-rail-tab") || btn.getAttribute("data-rrra") || "").toLowerCase();
      if (t === "vault" || t === "amana") t = "notes";
      btn.classList.toggle("active", t === name);
      btn.setAttribute("aria-current", t === name ? "page" : "false");
    });

    var main = $("main-content");
    if (main) {
      main.querySelectorAll("a, button, [onclick], input, select, textarea").forEach(function (n) {
        try {
          n.style.pointerEvents = "auto";
        } catch (e) {}
      });
    }

    try {
      var want = name === "notes" ? "notes" : name;
      if ((w.location.hash || "").replace(/^#/, "") !== want) {
        history.replaceState(null, "", w.location.pathname + w.location.search + "#" + want);
      }
    } catch (e4) {}

    return name;
  }

  function desiredTab() {
    try {
      var h = (w.location.hash || "").replace(/^#/, "").toLowerCase();
      if (h === "vault" || h === "amana") return "notes";
      if (TABS.indexOf(h) >= 0) return h;
      var cur = (document.body && document.body.getAttribute("data-active-tab")) || "";
      if (TABS.indexOf(cur) >= 0) return cur;
    } catch (e) {}
    return "reminder";
  }

  /* ---------- Phase 3: gate ghosts ---------- */
  function killGateGhosts() {
    [
      "landing-gate-screen",
      "clarity-gate-overlay",
      "gate-screen",
      "clarity-welcome",
    ].forEach(function (id) {
      var el = $(id);
      if (!el) return;
      el.hidden = true;
      el.setAttribute("aria-hidden", "true");
      el.classList.add("hidden");
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("pointer-events", "none", "important");
      el.style.setProperty("opacity", "0", "important");
      el.style.setProperty("z-index", "-1", "important");
      try {
        if (el.parentNode) el.parentNode.removeChild(el);
      } catch (e) {}
    });
    document.querySelectorAll(".gate-overlay, .clarity-welcome-overlay").forEach(function (el) {
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("pointer-events", "none", "important");
      try {
        el.remove();
      } catch (e2) {}
    });
    /* Hide in-page day-landing when companion — real Daily is /daily/ */
    try {
      var land = $("clarity-day-landing");
      if (land && document.documentElement.getAttribute("data-shell-mode") === "companion") {
        land.style.setProperty("display", "none", "important");
        land.setAttribute("aria-hidden", "true");
      }
    } catch (e3) {}
  }

  /* ---------- Phase 4: paths ---------- */
  var PATH_MAP = {
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
    "/charter": "/campus/",
  };

  function wirePaths() {
    document.querySelectorAll("a[href]").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      var path = href.split("?")[0].split("#")[0];
      if (PATH_MAP[path]) {
        a.setAttribute("href", PATH_MAP[path]);
        a.setAttribute("data-sa-remap", "1");
      }
      var text = ((a.textContent || "") + " " + (a.getAttribute("aria-label") || "")).toLowerCase();
      if (/open daily|daily routines|daily page|day landing/.test(text) && !/campus/.test(text)) {
        if (href === "/" || href === "#" || !href) a.setAttribute("href", DAILY);
      }
      if (/university path|campus path|campus map/.test(text)) {
        if (href === "/" || href === "#" || !href) a.setAttribute("href", CAMPUS);
      }
    });
  }

  function wireRail() {
    w.clarityOpenSectionDoor = function (name) {
      openTab(name);
    };
    w.ClaritySurface = {
      openTab: openTab,
      forceCompanion: forceCompanion,
      showMain: showMain,
      version: VER,
    };
    /* Neutralize gate reset → companion reminder */
    w.resetToGateView = function () {
      openTab("reminder");
    };
    w.clarityShowWelcome = function () {};

    document.querySelectorAll("[data-rail-tab], .door-rail-btn").forEach(function (btn) {
      if (btn.__sa1) return;
      btn.__sa1 = true;
      btn.addEventListener(
        "click",
        function (ev) {
          var t = btn.getAttribute("data-rail-tab") || btn.getAttribute("data-rrra") || "reminder";
          try {
            ev.preventDefault();
            ev.stopPropagation();
          } catch (e) {}
          openTab(t);
        },
        true
      );
    });
  }

  function scrubDaynOutsideVault() {
    try {
      document.querySelectorAll("#clarity-dayn-entry, .clarity-dayn-entry, #clarity-landing-slot-dayn").forEach(function (el) {
        if (el.closest && el.closest("#amana-vault, [data-vault-root], .amana-vault-interior, #tab-notes, #clarity-dayn-vault-ledger, #clarity-vault-slot-dayn")) return;
        try {
          el.remove();
        } catch (e) {
          el.style.setProperty("display", "none", "important");
        }
      });
    } catch (e) {}
  }

  function run() {
    forceCompanion();
    unlockPointers();
    killGateGhosts();
    showMain();
    openTab(desiredTab());
    wireRail();
    wirePaths();
    scrubDaynOutsideVault();
  }

  function boot() {
    run();
    [40, 120, 350, 800, 1600, 3200, 6000].forEach(function (ms) {
      setTimeout(run, ms);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", boot);
  w.addEventListener("hashchange", function () {
    openTab(desiredTab());
  });

  try {
    new MutationObserver(function () {
      var main = $("main-content");
      if (!main) return;
      if (main.hidden || main.getAttribute("aria-hidden") === "true") run();
    }).observe(document.documentElement, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["style", "hidden", "aria-hidden", "class", "data-shell-mode"],
    });
  } catch (e) {}
})(typeof window !== "undefined" ? window : this);
