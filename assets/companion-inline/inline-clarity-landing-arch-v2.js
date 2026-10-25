/**
 * Clarity Landing Architecture v2.1 — integrity-preserving
 * Landing = daily routines only (no door rail / section panels)
 * Companion = path + sections + door rail
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_LANDING_ARCH_V2__) return;
  w.__CLARITY_LANDING_ARCH_V2__ = true;

  var KEY_MODE = "clarity_shell_mode_v1";

  function mode() {
    try {
      var m = localStorage.getItem(KEY_MODE);
      if (m === "companion" || m === "landing") return m;
    } catch (e) {}
    return "landing";
  }

  function setMode(m) {
    if (m !== "landing" && m !== "companion") return;
    try { localStorage.setItem(KEY_MODE, m); } catch (e) {}
    apply();
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
      var host = null;
      var before = null;
      if (visit && visit.parentNode) {
        host = visit.parentNode;
        before = visit.nextSibling;
      } else if (duo && duo.parentNode) {
        host = duo.parentNode;
        before = duo.nextSibling;
      } else if (banner && banner.parentNode) {
        host = banner.parentNode;
        before = banner.nextSibling;
      }
      if (host) {
        if (before) host.insertBefore(bar, before);
        else host.appendChild(bar);
      } else {
        document.body.appendChild(bar);
      }
      bar.addEventListener("click", function (ev) {
        var t = ev.target && ev.target.closest && ev.target.closest("[data-crb]");
        if (!t) return;
        var act = t.getAttribute("data-crb");
        if (act === "open") setMode("landing");
        if (act === "hide") setMode("companion");
      });
    }
    return bar;
  }

  function ensureDualPaths() {
    if (document.getElementById("dual-path-companion")) return;
    var land = document.getElementById("clarity-day-landing");
    if (!land) {
      land = document.createElement("section");
      land.id = "clarity-day-landing";
      land.setAttribute("aria-label", "Day landing");
      land.className = "clarity-day-landing";
      var bar = document.getElementById("clarity-reopen-bar");
      if (bar && bar.parentNode) {
        if (bar.nextSibling) bar.parentNode.insertBefore(land, bar.nextSibling);
        else bar.parentNode.appendChild(land);
      } else {
        var visit = document.getElementById("clarity-visit-pill-bar");
        if (visit && visit.parentNode) {
          if (visit.nextSibling) visit.parentNode.insertBefore(land, visit.nextSibling);
          else visit.parentNode.appendChild(land);
        } else document.body.appendChild(land);
      }
    }
    if (!document.getElementById("dual-path-companion")) {
      var dual = document.createElement("div");
      dual.className = "dual-tiles";
      dual.id = "clarity-dual-tiles";
      dual.innerHTML =
        '<a href="#main-content" id="dual-path-companion" class="dual-tile dual-companion">' +
        '<span class="dual-ico" aria-hidden="true">🏠</span>' +
        "<strong>Companion path</strong>" +
        "<span>Reminder · Reality · Reflection · Action · tools on this page</span></a>" +
        '<a href="https://clarity-dawah.fyi/campus/" id="dual-path-university" class="dual-tile dual-university" target="_blank" rel="noopener">' +
        '<span class="dual-ico" aria-hidden="true">🎓</span>' +
        "<strong>University path</strong>" +
        "<span>Four colleges · phase desk · Faculty · Security · IT — on Campus pages</span></a>";
      if (land.firstChild) land.insertBefore(dual, land.firstChild);
      else land.appendChild(dual);
      dual.querySelector("#dual-path-companion").addEventListener("click", function (ev) {
        ev.preventDefault();
        setMode("companion");
        try {
          var mc = document.getElementById("main-content") || document.querySelector(".main-content");
          if (mc) mc.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (e) {}
      });
    }
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
      door.style.removeProperty("opacity");
      door.removeAttribute("aria-hidden");
    }
  }

  function apply() {
    var m = mode();
    document.documentElement.setAttribute("data-shell-mode", m);
    document.body.setAttribute("data-shell-mode", m);
    ensureRibbon();
    ensureDualPaths();

    var land = document.getElementById("clarity-day-landing");
    var routines = document.getElementById("clarity-daily-routines");
    var bar = document.getElementById("clarity-reopen-bar");
    var openBtn = bar && bar.querySelector('[data-crb="open"]');
    var hideBtn = bar && bar.querySelector('[data-crb="hide"]');

    if (m === "landing") {
      if (land) { land.hidden = false; land.style.removeProperty("display"); land.classList.remove("shell-hidden"); }
      if (routines) { routines.hidden = false; routines.style.removeProperty("display"); }
      if (openBtn) openBtn.style.display = "none";
      if (hideBtn) hideBtn.style.display = "";

      document.querySelectorAll(
        "#clarity-door-rail, .clarity-door-rail, .bottom-nav, .nav-rail, #bottom-nav, " +
        "[data-bottom-nav], .global-nav-bottom, .tab-bar, .rrra-tabs, #main-tab-bar, " +
        ".clarity-bottom-nav, [role='tablist'], .quick-access, .quick-access-bar, #quick-access"
      ).forEach(function (el) {
        el.classList.add("shell-landing-hide");
        el.setAttribute("data-shell-hidden", "1");
      });

      document.querySelectorAll(
        ".tab-panel, .rrra-hub, .rrra-hub-hero, [data-tab-panel], " +
        "#reminder, #reality, #reflection, #action, #notes, " +
        ".reminder-panel, .reality-panel, .reflection-panel, .action-panel, .notes-panel"
      ).forEach(function (el) {
        if (el.closest && (el.closest("#clarity-day-landing") || el.closest("#clarity-daily-routines"))) return;
        el.classList.add("shell-landing-hide");
        el.setAttribute("data-shell-hidden", "1");
      });

      document.querySelectorAll("h2, h3").forEach(function (h) {
        var t = h.textContent || "";
        if (/Path to furnish|Phased learning|\bTRACK\b|Reminder|Reality|Reflection|\bAction\b|Amanah Vault|Allah's Commands/i.test(t)) {
          var box = h.closest("section, article, .card, .panel, .hub, div");
          if (!box) return;
          if (box.id === "clarity-day-landing" || box.id === "clarity-daily-routines") return;
          if (box.closest && (box.closest("#clarity-day-landing") || box.closest("#clarity-daily-routines"))) return;
          if (box.classList.contains("banner") || box.id === "clarity-top-duo") return;
          box.classList.add("shell-landing-hide");
          box.setAttribute("data-shell-hidden", "1");
        }
      });
    } else {
      if (land) { land.hidden = true; land.style.display = "none"; }
      if (routines) { routines.hidden = true; routines.style.display = "none"; }
      if (openBtn) openBtn.style.display = "";
      if (hideBtn) hideBtn.style.display = "none";
      document.querySelectorAll(".shell-landing-hide, [data-shell-hidden='1']").forEach(function (el) {
        el.classList.remove("shell-landing-hide");
        el.removeAttribute("data-shell-hidden");
      });
    }

    applyDoorRail(m);
  }

  function boot() {
    ensureRibbon();
    ensureDualPaths();
    apply();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", function () {
    setTimeout(apply, 300);
    setTimeout(apply, 1200);
  });

  w.ClarityShell = { mode: mode, setMode: setMode, apply: apply, version: "20261024ARCH21" };
})(typeof window !== "undefined" ? window : this);
