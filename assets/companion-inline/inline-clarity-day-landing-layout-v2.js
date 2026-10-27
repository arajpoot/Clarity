/**
 * Clarity Day Landing Layout 20261027BAN1
 * - Hide "Path to furnish the grave" strip under banner on Day landing
 * - Keep / restore dual tiles: Companion path + University path
 * - Stop main-content flash on landing mode
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_DAY_LANDING_LAYOUT_V2__) return;
  w.__CLARITY_DAY_LANDING_LAYOUT_V2__ = true;

  function injectCss() {
    if (document.getElementById("clarity-dll-v2-css")) return;
    var s = document.createElement("style");
    s.id = "clarity-dll-v2-css";
    s.textContent = [
      /* Remove path-to-furnish strip under banner on Day landing */
      'html[data-shell-mode="landing"] #clarity-grave-path-strip,',
      'html[data-shell-mode="landing"] .grave-path-strip,',
      'html[data-shell-mode="landing"] .path-to-grave,',
      'html[data-shell-mode="landing"] [data-strip="grave-path"],',
      'html[data-shell-mode="landing"] #grave-path-card {',
      "  display:none!important;visibility:hidden!important;height:0!important;",
      "  max-height:0!important;overflow:hidden!important;margin:0!important;padding:0!important;}",
      /* Dual path tiles VISIBLE on day landing */
      'html[data-shell-mode="landing"] [data-landing="paths"],',
      'html[data-shell-mode="landing"] #dual-path-companion,',
      'html[data-shell-mode="landing"] #dual-path-university,',
      'html[data-shell-mode="landing"] .dual-tile,',
      'html[data-shell-mode="landing"] .dual-path-row {',
      "  display:revert!important;visibility:visible!important;height:auto!important;",
      "  max-height:none!important;opacity:1!important;}",
      'html[data-shell-mode="landing"] [data-landing="paths"]{',
      "  display:grid!important;grid-template-columns:1fr 1fr;gap:0.5rem;",
      "  margin:0.5rem auto;max-width:min(42rem,100%);padding:0 0.75rem;box-sizing:border-box;}",
      'html[data-shell-mode="landing"] .dual-tile{',
      "  display:block!important;padding:0.75rem 0.85rem;border-radius:14px;",
      "  border:1px solid rgba(212,180,90,0.3);text-decoration:none;color:inherit;}",
      /* No main RRRA flash */
      'html[data-shell-mode="landing"] #main-content,',
      'html[data-shell-mode="landing"] #main-application-workspace,',
      'html[data-shell-mode="landing"] #clarity-door-rail,',
      'html[data-shell-mode="landing"] .door-rail-bottom {',
      "  display:none!important;visibility:hidden!important;}",
      /* Banner controls row readable */
      "#clarity-final-banner-controls-v2, .banner-av-row, #live-haramain-btn, #stream-btn {",
      "  pointer-events:auto!important;}"
    ].join("");
    document.head.appendChild(s);
  }

  function hideFurnishStrip() {
    if ((document.documentElement.getAttribute("data-shell-mode") || "landing") !== "landing") return;
    document.querySelectorAll(
      "#clarity-grave-path-strip, .grave-path-strip, .path-to-grave, #grave-path-card, [data-strip=grave-path]"
    ).forEach(function (el) {
      el.style.setProperty("display", "none", "important");
      el.setAttribute("aria-hidden", "true");
    });
    /* text heuristic: elements that only announce four doors path */
    document.querySelectorAll("h2, h3, .section-title, .path-title").forEach(function (el) {
      var t = (el.textContent || "").toLowerCase();
      if (t.indexOf("path to furnish") >= 0 || t.indexOf("four doors") >= 0) {
        var box = el.closest("section, aside, div");
        if (box && !box.querySelector(".cdl-hero, #clarity-day-landing, .dual-tile")) {
          box.style.setProperty("display", "none", "important");
        }
      }
    });
  }

  function ensureDualTiles() {
    if ((document.documentElement.getAttribute("data-shell-mode") || "landing") !== "landing") return;
    var root = document.getElementById("clarity-day-landing");
    if (!root) return;
    var paths = root.querySelector('[data-landing="paths"]');
    if (!paths) {
      paths = document.createElement("div");
      paths.setAttribute("data-landing", "paths");
      paths.setAttribute("role", "navigation");
      paths.setAttribute("aria-label", "Choose a path");
      paths.innerHTML =
        '<a class="dual-tile" href="#main-content" id="dual-path-companion">' +
          '<span class="dual-ico" aria-hidden="true">🏠</span><strong>Companion path</strong>' +
          "<small>Reminder · Reality · Reflection · Action — tools on this page</small></a>" +
        '<a class="dual-tile" href="/campus/" id="dual-path-university" target="_blank" rel="noopener">' +
          '<span class="dual-ico" aria-hidden="true">🎓</span><strong>University path</strong>' +
          "<small>Campus desk · four stages · educational</small></a>";
      var hero = root.querySelector('[data-landing="pulse"], .cdl-hero');
      if (hero && hero.parentNode) hero.parentNode.insertBefore(paths, hero);
      else root.insertBefore(paths, root.firstChild);
    }
    paths.style.removeProperty("display");
    paths.querySelectorAll(".dual-tile").forEach(function (a) {
      a.style.removeProperty("display");
      a.removeAttribute("aria-hidden");
    });
    var comp = document.getElementById("dual-path-companion");
    if (comp && !comp.__dllWired) {
      comp.__dllWired = true;
      comp.addEventListener("click", function (ev) {
        ev.preventDefault();
        try {
          if (w.ClarityShell && w.ClarityShell.setMode) w.ClarityShell.setMode("companion");
          else {
            localStorage.setItem("clarity_shell_mode_v1", "companion");
            sessionStorage.setItem("clarity_shell_user_pick_v1", "1");
            document.documentElement.setAttribute("data-shell-mode", "companion");
          }
        } catch (e) {}
      });
    }
  }

  function stopFlash() {
    if ((document.documentElement.getAttribute("data-shell-mode") || "") !== "landing") return;
    var main = document.getElementById("main-content");
    if (main) {
      main.style.setProperty("display", "none", "important");
      main.setAttribute("aria-hidden", "true");
    }
  }

  function run() {
    injectCss();
    hideFurnishStrip();
    ensureDualTiles();
    stopFlash();
  }

  run();
  [40, 150, 400, 1000, 2000].forEach(function (ms) {
    setTimeout(run, ms);
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(run, 50); });
  }
  w.addEventListener("load", function () { setTimeout(run, 200); });
  document.addEventListener("clarity:landing-ready", function () { setTimeout(run, 40); });
  try {
    new MutationObserver(function () {
      if ((document.documentElement.getAttribute("data-shell-mode") || "landing") === "landing") {
        hideFurnishStrip();
        ensureDualTiles();
        stopFlash();
      }
    }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-shell-mode"] });
  } catch (e) {}
})(typeof window !== "undefined" ? window : this);
