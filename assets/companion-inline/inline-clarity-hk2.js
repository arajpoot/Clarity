/**
 * HK2 · Day vault fortify · 20261027HK2
 * - Do this today (provision) ON Day landing only
 * - Dual path once (inside Day room only on landing)
 * - TRACK / 4-gate ONLY on Companion
 * - Bottom rail ONLY on Companion
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_HK2__) return;
  w.__CLARITY_HK2__ = true;

  function mode() {
    return document.documentElement.getAttribute("data-shell-mode") || "landing";
  }

  function injectCss() {
    if (document.getElementById("clarity-hk2-css")) return;
    var s = document.createElement("style");
    s.id = "clarity-hk2-css";
    s.textContent = [
      /* —— DAY LANDING —— */
      'html[data-shell-mode="landing"] #clarity-day-landing-room{display:block!important;visibility:visible!important;}',
      'html[data-shell-mode="landing"] #main-content{display:none!important;}',
      /* Provision "Do this today" — restore on Day only */
      'html[data-shell-mode="landing"] #clarity-provision-home,',
      'html[data-shell-mode="landing"] .clarity-provision-home{',
      "display:block!important;visibility:visible!important;height:auto!important;overflow:visible!important;",
      "max-width:min(52rem,100%);margin:0.5rem auto 0.75rem;padding:0 0.75rem;box-sizing:border-box;}",
      'html[data-shell-mode="companion"] #clarity-provision-home,',
      'html[data-shell-mode="companion"] .clarity-provision-home{',
      "display:none!important;visibility:hidden!important;height:0!important;overflow:hidden!important;margin:0!important;padding:0!important;}",
      /* Dual path: only inside Day room on landing — kill leaks */
      'html[data-shell-mode="landing"] .dual-tiles{display:none!important;}',
      'html[data-shell-mode="landing"] #clarity-day-landing-room .dual-tiles{display:grid!important;}',
      'html[data-shell-mode="landing"] #main-content .dual-tiles,',
      'html[data-shell-mode="landing"] #main-application-workspace > .dual-tiles{display:none!important;}',
      /* TRACK / phased — Companion only */
      'html[data-shell-mode="landing"] .clarity-gate-switcher,',
      'html[data-shell-mode="landing"] .rrra-sitewide,',
      'html[data-shell-mode="landing"] #clarity-visit-pill-bar,',
      'html[data-shell-mode="landing"] [aria-label*="Learning track"],',
      'html[data-shell-mode="landing"] [aria-label*="Phased learning"]{',
      "display:none!important;visibility:hidden!important;height:0!important;max-height:0!important;overflow:hidden!important;margin:0!important;padding:0!important;}",
      /* Bottom rail — Companion only */
      'html[data-shell-mode="landing"] #clarity-door-rail,',
      'html[data-shell-mode="landing"] .door-rail-bottom,',
      'html[data-shell-mode="landing"] .door-rail-rrra5{',
      "display:none!important;visibility:hidden!important;height:0!important;max-height:0!important;overflow:hidden!important;pointer-events:none!important;}",
      'html[data-shell-mode="companion"] #clarity-door-rail,',
      'html[data-shell-mode="companion"] .door-rail-bottom{',
      "display:flex!important;visibility:visible!important;height:auto!important;max-height:none!important;pointer-events:auto!important;}",
      /* Companion: hide Day room */
      'html[data-shell-mode="companion"] #clarity-day-landing-room{display:none!important;}'
    ].join("");
    document.head.appendChild(s);
  }

  function hideTrackOnLanding() {
    if (mode() !== "landing") return;
    document.querySelectorAll(".clarity-gate-switcher,.rrra-sitewide,#clarity-visit-pill-bar").forEach(function (el) {
      el.style.setProperty("display", "none", "important");
      el.setAttribute("hidden", "");
      el.setAttribute("aria-hidden", "true");
    });
    /* text-match phased strip that isn't classed */
    document.querySelectorAll("div,section").forEach(function (el) {
      if (el.closest("#clarity-day-landing-room")) return;
      if (el.closest(".banner")) return;
      if (el.closest("#clarity-reopen-bar")) return;
      if (el.closest("#clarity-provision-home")) return;
      var label = el.getAttribute("aria-label") || "";
      var head = "";
      try {
        var h = el.querySelector("h2,h3,.cgs-label");
        head = h ? h.textContent : "";
      } catch (e) {}
      var t = label + " " + head + " " + (el.childNodes.length && el.childNodes[0].textContent || "");
      t = t.slice(0, 120);
      if (/Phased learning|^TRACK\b|1\s*Seeker.*New Muslim/i.test(t)) {
        el.style.setProperty("display", "none", "important");
      }
    });
  }

  function dedupeDualOnLanding() {
    if (mode() !== "landing") return;
    document.querySelectorAll(".dual-tiles").forEach(function (el) {
      if (el.closest("#clarity-day-landing-room")) {
        el.style.setProperty("display", "grid", "important");
        return;
      }
      el.style.setProperty("display", "none", "important");
    });
  }

  function showProvisionOnLanding() {
    var el = document.getElementById("clarity-provision-home");
    if (!el) el = document.querySelector(".clarity-provision-home");
    if (!el) return;
    if (mode() === "landing") {
      el.style.setProperty("display", "block", "important");
      el.style.setProperty("visibility", "visible", "important");
      el.removeAttribute("hidden");
      el.setAttribute("aria-hidden", "false");
      /* move provision just above day room for vault-like stack: plaque → provision → day room */
      var room = document.getElementById("clarity-day-landing-room");
      if (room && room.parentNode && el.parentNode !== room.parentNode) {
        try { room.parentNode.insertBefore(el, room); } catch (e) {}
      } else if (room && el.nextSibling !== room) {
        try { room.parentNode.insertBefore(el, room); } catch (e2) {}
      }
    } else {
      el.style.setProperty("display", "none", "important");
    }
  }

  function hideRailOnLanding() {
    document.querySelectorAll("#clarity-door-rail,.door-rail-bottom").forEach(function (el) {
      if (mode() === "landing") {
        el.style.setProperty("display", "none", "important");
        el.setAttribute("aria-hidden", "true");
      } else {
        el.style.removeProperty("display");
        el.removeAttribute("aria-hidden");
      }
    });
  }

  function run() {
    injectCss();
    hideTrackOnLanding();
    dedupeDualOnLanding();
    showProvisionOnLanding();
    hideRailOnLanding();
  }

  [30, 120, 400, 900, 1800, 3500].forEach(function (ms) { setTimeout(run, ms); });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(run, 40); });
  }
  w.addEventListener("load", function () { setTimeout(run, 200); });
  document.addEventListener("clarity:day-room-ready", function () { setTimeout(run, 50); });
  var last = mode();
  setInterval(function () {
    var m = mode();
    if (m !== last) { last = m; run(); }
    else run();
  }, 1500);
})(typeof window !== "undefined" ? window : this);
