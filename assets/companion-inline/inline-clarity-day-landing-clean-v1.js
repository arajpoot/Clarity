/**
 * Clarity Day Landing Clean 20261027DLC1
 * - Remove dual/4-path tiles from Day landing (they belong in companion main area only)
 * - Stop path-tiles / doors-flow flashing main content on landing mode
 * - Re-assert Shariah palette + source-guard presence (educational)
 * - Soft banner refresh for Hijri / salah / temps when stuck on Loading
 * Campus untouched. Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_DAY_LANDING_CLEAN_V1__) return;
  w.__CLARITY_DAY_LANDING_CLEAN_V1__ = true;

  var CSS_ID = "clarity-day-landing-clean-css";

  function injectCss() {
    if (document.getElementById(CSS_ID)) return;
    var s = document.createElement("style");
    s.id = CSS_ID;
    s.textContent = [
      /* Day landing: no dual path tiles / 4-door pills under banner */
      'html[data-shell-mode="landing"] [data-landing="paths"],',
      'html[data-shell-mode="landing"] #dual-path-companion,',
      'html[data-shell-mode="landing"] #dual-path-university,',
      'html[data-shell-mode="landing"] .dual-path-row,',
      'html[data-shell-mode="landing"] .dual-tile,',
      'html[data-shell-mode="landing"] .path-tiles-row,',
      'html[data-shell-mode="landing"] .clarity-path-tiles,',
      'html[data-shell-mode="landing"] [data-path-tiles],',
      'html[data-shell-mode="landing"] #clarity-three-doors,',
      'html[data-shell-mode="landing"] .door-path-pills,',
      'html[data-shell-mode="landing"] .path-pill-bar {',
      "  display:none!important;visibility:hidden!important;height:0!important;",
      "  max-height:0!important;overflow:hidden!important;margin:0!important;padding:0!important;}",
      /* Prevent main workspace flash while on Day landing */
      'html[data-shell-mode="landing"] #main-content,',
      'html[data-shell-mode="landing"] #main-application-workspace,',
      'html[data-shell-mode="landing"] #clarity-door-rail,',
      'html[data-shell-mode="landing"] .door-rail-bottom,',
      'html[data-shell-mode="landing"] .tab-panel.rrra-hub {',
      "  display:none!important;visibility:hidden!important;}",
      /* Shariah-calm reinforce (day/night) — modest green/gold/parchment only */
      "html[data-theme=light],html[data-theme=day]{",
      "  --accent:#0f4c3a;--gold:#8f7020;--bg:#f3efe6;--text:#1a2e26;}",
      "html[data-theme=dark],html[data-theme=night]{",
      "  --accent:#1fa67a;--gold:#d4b45a;--bg:#061510;--text:#eaf6f0;}",
      /* Meme canvas: nature/architecture only reminder class if present */
      ".meme-stage,.meme-canvas,[data-meme-canvas]{background-size:cover;background-position:center;}"
    ].join("");
    document.head.appendChild(s);
  }

  function stripPathTiles() {
    try {
      var mode = document.documentElement.getAttribute("data-shell-mode") || "landing";
      if (mode !== "landing") return;
      var sel = [
        '[data-landing="paths"]',
        "#dual-path-companion",
        "#dual-path-university",
        ".dual-path-row",
        ".dual-tile",
        "#clarity-three-doors",
        ".path-tiles-row",
        "[data-path-tiles]",
        ".door-path-pills",
        ".path-pill-bar"
      ];
      document.querySelectorAll(sel.join(",")).forEach(function (el) {
        try {
          el.setAttribute("data-dlc-hidden", "1");
          el.style.setProperty("display", "none", "important");
          el.setAttribute("aria-hidden", "true");
        } catch (e) {}
      });
      /* inside day landing root only */
      var root = document.getElementById("clarity-day-landing");
      if (root) {
        root.querySelectorAll(".dual-tile, [data-landing=paths], .dual-path-row").forEach(function (el) {
          el.style.setProperty("display", "none", "important");
        });
      }
    } catch (e) {}
  }

  function stopDoorsFight() {
    try {
      if ((document.documentElement.getAttribute("data-shell-mode") || "") !== "landing") return;
      /* path-tiles-restore / doors-flow openAllSections — re-hide main */
      var main = document.getElementById("main-content");
      if (main) {
        main.style.setProperty("display", "none", "important");
        main.setAttribute("aria-hidden", "true");
      }
      var rail = document.getElementById("clarity-door-rail");
      if (rail) rail.style.setProperty("display", "none", "important");
    } catch (e) {}
  }

  function bannerNudge() {
    try {
      /* Retry common banner hooks if stuck on Loading / ellipsis */
      var hijri = document.getElementById("hijri-cal-title") || document.getElementById("hijri-cal-meta");
      var salah = document.querySelector("#banner-live .salah-name, .salah-name, [data-salah-name]");
      if (typeof w.clarityRefreshBanner === "function") {
        try { w.clarityRefreshBanner(); } catch (e) {}
      }
      if (typeof w.ClarityBannerHarden === "function") {
        try { w.ClarityBannerHarden(); } catch (e2) {}
      }
      /* dispatch soft event for banner scripts */
      try {
        document.dispatchEvent(new CustomEvent("clarity-banner-nudge", { detail: { source: "day-landing-clean" } }));
      } catch (e3) {}
      /* Madinah AP / surah cont if exposed */
      if (typeof w.clarityMadinahRefresh === "function") {
        try { w.clarityMadinahRefresh(); } catch (e4) {}
      }
    } catch (e) {}
  }

  function shariahAssert() {
    try {
      /* ensure source guard flag visible for other scripts */
      if (!w.__CLARITY_SHARIAH_SOURCE_GUARD_V1__) {
        w.__CLARITY_SHARIAH_SOURCE_GUARD_HINT__ = "load source guard early";
      }
      document.documentElement.setAttribute("data-shariah-calm", "1");
    } catch (e) {}
  }

  function run() {
    injectCss();
    shariahAssert();
    stripPathTiles();
    stopDoorsFight();
    bannerNudge();
  }

  /* Observe landing rebuilds (landing-v3 removes/recreates root) */
  function observe() {
    try {
      var mo = new MutationObserver(function () {
        if ((document.documentElement.getAttribute("data-shell-mode") || "landing") === "landing") {
          stripPathTiles();
          stopDoorsFight();
        }
      });
      mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-shell-mode"] });
      w.__CLARITY_DLC_MO__ = mo;
    } catch (e) {}
  }

  run();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(run, 40);
      setTimeout(run, 200);
      setTimeout(bannerNudge, 600);
      observe();
    });
  } else {
    setTimeout(run, 40);
    setTimeout(run, 200);
    setTimeout(bannerNudge, 600);
    observe();
  }
  w.addEventListener("load", function () {
    setTimeout(run, 100);
    setTimeout(bannerNudge, 800);
    setTimeout(bannerNudge, 2000);
  });
  document.addEventListener("clarity:landing-ready", function () {
    setTimeout(run, 30);
  });
})(typeof window !== "undefined" ? window : this);
