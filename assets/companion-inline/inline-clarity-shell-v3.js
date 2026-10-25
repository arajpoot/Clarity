/**
 * Clarity Shell v3.1 — robust mode + ribbon
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_SHELL_V3__) return;
  w.__CLARITY_SHELL_V3__ = true;

  var KEY = "clarity_shell_mode_v1";

  function mode() {
    try {
      var m = localStorage.getItem(KEY);
      if (m === "landing" || m === "companion") return m;
    } catch (e) {}
    return "landing";
  }

  function setMode(m) {
    if (m !== "landing" && m !== "companion") return;
    try { localStorage.setItem(KEY, m); } catch (e) {}
    if (m === "companion" && typeof w.ClarityLoadCompanion === "function") {
      document.documentElement.setAttribute("data-companion-loading", "1");
      apply();
      w.ClarityLoadCompanion().then(function () {
        document.documentElement.removeAttribute("data-companion-loading");
        apply();
        try {
          var main = document.getElementById("main-content");
          if (main) {
            main.style.setProperty("display", "block", "important");
            main.removeAttribute("aria-hidden");
          }
        } catch (e) {}
      });
    } else {
      apply();
      if (m === "landing") {
        // Ensure landing cards exist
        try {
          if (typeof w.ClarityLandingRebuild === "function") w.ClarityLandingRebuild();
        } catch (e) {}
        try {
          var land = document.getElementById("clarity-day-landing");
          if (land) land.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (e) {}
      }
    }
  }

  function ensureRibbon() {
    var bar = document.getElementById("clarity-reopen-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "clarity-reopen-bar";
      bar.setAttribute("role", "toolbar");
      bar.setAttribute("aria-label", "Day landing controls");
      bar.innerHTML =
        '<span class="crb-label">Day landing</span>' +
        '<button type="button" class="crb-btn crb-open" data-crb="open">Open daily routines</button>' +
        '<button type="button" class="crb-btn crb-hide" data-crb="hide">Hide for now</button>' +
        '<span class="crb-hint">Return anytime · on this device</span>';
      var visit = document.getElementById("clarity-visit-pill-bar");
      var duo = document.getElementById("clarity-top-duo");
      var banner = document.querySelector(".banner, #banner, [data-banner]");
      var host = (visit && visit.parentNode) || (duo && duo.parentNode) ||
                 (banner && banner.parentNode) || document.body;
      var before = null;
      if (visit) before = visit.nextSibling;
      else if (duo) before = duo.nextSibling;
      else if (banner) before = banner.nextSibling;
      if (before) host.insertBefore(bar, before);
      else host.appendChild(bar);
      bar.addEventListener("click", function (ev) {
        var t = ev.target && ev.target.closest && ev.target.closest("[data-crb]");
        if (!t) return;
        setMode(t.getAttribute("data-crb") === "open" ? "landing" : "companion");
      });
    }
    // Always visible
    bar.hidden = false;
    bar.style.removeProperty("display");
    bar.style.visibility = "visible";
    return bar;
  }

  function applyDoorRail(m) {
    var door = document.getElementById("clarity-door-rail");
    if (!door) return;
    if (m === "landing") {
      door.style.setProperty("display", "none", "important");
      door.style.setProperty("visibility", "hidden", "important");
      door.setAttribute("aria-hidden", "true");
    } else {
      door.style.setProperty("display", "flex", "important");
      door.style.setProperty("visibility", "visible", "important");
      door.removeAttribute("aria-hidden");
    }
  }

  function apply() {
    var m = mode();
    document.documentElement.setAttribute("data-shell-mode", m);
    document.body.setAttribute("data-shell-mode", m);
    var bar = ensureRibbon();
    var openBtn = bar.querySelector('[data-crb="open"]');
    var hideBtn = bar.querySelector('[data-crb="hide"]');
    var land = document.getElementById("clarity-day-landing");
    var main = document.getElementById("main-content") || document.querySelector(".main-content");

    if (m === "landing") {
      if (land) {
        land.hidden = false;
        land.style.removeProperty("display");
        land.style.display = "flex";
      }
      if (openBtn) openBtn.style.display = "none";
      if (hideBtn) hideBtn.style.display = "";
      if (main) {
        main.style.setProperty("display", "none", "important");
        main.setAttribute("aria-hidden", "true");
      }
      document.querySelectorAll(".tab-panel, .rrra-hub, .rrra-hub-hero, .path-board, .four-doors, #path-board").forEach(function (el) {
        if (el.closest && el.closest("#clarity-day-landing")) return;
        el.classList.add("shell-landing-hide");
      });
      /* path-board-hide: any block headed Path to furnish / Phased learning */
      document.querySelectorAll("h2, h3, .section-title").forEach(function (h) {
        var t = h.textContent || "";
        if (/Path to furnish|Phased learning|Four doors|TRACK/i.test(t)) {
          var box = h.closest("section, article, .card, .panel, .path-board, div");
          if (box && box.id !== "clarity-day-landing" && !(box.closest && box.closest("#clarity-day-landing"))) {
            box.classList.add("shell-landing-hide");
          }
        }
      });
    } else {
      if (land) {
        land.hidden = true;
        land.style.display = "none";
      }
      if (openBtn) openBtn.style.display = "";
      if (hideBtn) hideBtn.style.display = "none";
      if (main) {
        main.style.setProperty("display", "block", "important");
        main.removeAttribute("aria-hidden");
      }
      document.querySelectorAll(".shell-landing-hide").forEach(function (el) {
        el.classList.remove("shell-landing-hide");
      });
    }
    applyDoorRail(m);
    try {
      document.documentElement.style.setProperty("overflow-y", "auto", "important");
      document.body.style.setProperty("overflow-y", "auto", "important");
    } catch (e) {}
  }

  function boot() {
    ensureRibbon();
    apply();
    // If landing mode but cards missing, request rebuild
    if (mode() === "landing") {
      var land = document.getElementById("clarity-day-landing");
      if (!land || !document.getElementById("cdl-today")) {
        setTimeout(function () {
          if (typeof w.ClarityLandingRebuild === "function") w.ClarityLandingRebuild();
          apply();
        }, 100);
        setTimeout(function () {
          if (typeof w.ClarityLandingRebuild === "function") w.ClarityLandingRebuild();
          apply();
        }, 600);
      }
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", function () { setTimeout(boot, 150); });

  w.ClarityShell = { mode: mode, setMode: setMode, apply: apply, version: "20261024SHELL31" };
})(typeof window !== "undefined" ? window : this);
