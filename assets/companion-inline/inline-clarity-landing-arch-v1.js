/**
 * Clarity Landing Architecture v1
 * Daily routines landing vs Companion deep-learning shell.
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_LANDING_ARCH_V1__) return;
  w.__CLARITY_LANDING_ARCH_V1__ = true;

  var KEY_MODE = "clarity_shell_mode_v1"; // "landing" | "companion"
  var KEY_LAND_HIDE = "clarity_day_landing_collapsed_v1";

  function mode() {
    try {
      var m = localStorage.getItem(KEY_MODE);
      if (m === "companion" || m === "landing") return m;
    } catch (e) {}
    try {
      if (localStorage.getItem(KEY_LAND_HIDE) === "1") return "companion";
    } catch (e) {}
    return "landing";
  }

  function setMode(m) {
    try { localStorage.setItem(KEY_MODE, m); } catch (e) {}
    try {
      if (m === "companion") localStorage.setItem(KEY_LAND_HIDE, "1");
      else localStorage.removeItem(KEY_LAND_HIDE);
    } catch (e) {}
    apply();
  }

  
  function placeRibbon(bar) {
    var visit = document.getElementById("clarity-visit-pill-bar");
    var duo = document.getElementById("clarity-top-duo");
    var banner = document.querySelector(".banner");
    var land = document.getElementById("clarity-day-landing");
    var parent = null;
    var before = null;
    if (visit && visit.parentNode) {
      parent = visit.parentNode;
      before = visit.nextSibling;
    } else if (duo && duo.parentNode) {
      parent = duo.parentNode;
      before = duo.nextSibling;
    } else if (banner && banner.parentNode) {
      parent = banner.parentNode;
      before = banner.nextSibling;
    }
    if (parent) {
      if (before) parent.insertBefore(bar, before);
      else parent.appendChild(bar);
    } else {
      document.body.insertBefore(bar, document.body.firstChild);
    }
    // On companion, keep before path boards
    if (document.documentElement.getAttribute("data-shell-mode") === "companion") {
      var path = document.querySelector("[data-path-board], #path-board, .path-board");
      if (path && path.parentNode && bar.parentNode === path.parentNode) {
        path.parentNode.insertBefore(bar, path);
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
      /*clarity-reopen-bar-v2*/
      bar.innerHTML =
        '<span class="crb-label">Day landing</span>' +
        '<button type="button" class="crb-btn crb-open" data-crb="open">Open daily routines</button>' +
        '<button type="button" class="crb-btn crb-hide" data-crb="hide">Hide for now</button>' +
        '<span class="crb-hint">Return anytime · on this device</span>';
      placeRibbon(bar);
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

  function ensureRoutineStrip() {
    if (window.ClarityRoutines90) return document.getElementById("clarity-daily-routines");
    var strip = document.getElementById("clarity-daily-routines");
    if (strip) return strip;
    strip = document.createElement("section");
    strip.id = "clarity-daily-routines";
    strip.setAttribute("aria-label", "Daily return routines");
    if (strip.querySelector(".cdr-phase")) return strip;
    strip.innerHTML =
      '<div class="cdr-head"><h2>Daily return routines</h2>' +
      '<p class="cdr-sub">Small, finishable steps — educational only. Path-aware when you set a track.</p></div>' +
      '<div class="cdr-grid">' +
        card("seeker", "Seeker · today", "1 belief spark · 1 short āyah · 1 character deed", "Open Reminder") +
        card("new-muslim", "New Muslim · today", "1 purity/prayer micro-step · 1 dhikr · 1 right", "Open Reality") +
        card("daily", "Daily consistency", "Next ṣalāh presence · 1 āyah · adhkār count", "Open Action") +
        card("dai", "Daʿī · careful transmit", "1 source-check · 1 adab note · share carefully", "Open Reflection") +
        card("review", "Spaced review", "Revisit one command or āyah from this week", "Open LAST") +
        card("legacy", "Light for the grave", "Istighfār · ṣalawāt · one duʿāʾ for parents", "Open Vault") +
      "</div>";
    function card(id, title, body, cta) {
      return (
        '<article class="cdr-card" data-routine="' + id + '">' +
        "<h3>" + title + "</h3>" +
        "<p>" + body + "</p>" +
        '<button type="button" class="cdr-cta" data-routine-go="' + id + '">' + cta + "</button>" +
        "</article>"
      );
    }
    var land = document.getElementById("clarity-day-landing");
    if (land && land.parentNode) {
      if (land.nextSibling) land.parentNode.insertBefore(strip, land.nextSibling);
      else land.parentNode.appendChild(strip);
    } else {
      var ribbon = document.getElementById("clarity-reopen-bar");
      if (ribbon && ribbon.parentNode) ribbon.parentNode.insertBefore(strip, ribbon.nextSibling);
      else document.body.appendChild(strip);
    }
    strip.addEventListener("click", function (ev) {
      var btn = ev.target && ev.target.closest && ev.target.closest("[data-routine-go]");
      if (!btn) return;
      var id = btn.getAttribute("data-routine-go");
      // Enter companion for deep tools; map soft targets
      setMode("companion");
      try {
        var map = {
          seeker: "reminder",
          "new-muslim": "reality",
          daily: "action",
          dai: "reflection",
          review: "reminder",
          legacy: "notes"
        };
        var tab = map[id] || "reminder";
        if (typeof w.switchTab === "function") w.switchTab(tab);
        else if (typeof w.clarityOpenSectionDoor === "function") w.clarityOpenSectionDoor(tab);
      } catch (e) {}
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (e) {}
    });
    return strip;
  }

  function apply() {
    var m = mode();
    document.documentElement.setAttribute("data-shell-mode", m);
    document.body.setAttribute("data-shell-mode", m);
    ensureRibbon();
    ensureRoutineStrip();
    var land = document.getElementById("clarity-day-landing");
    var routines = document.getElementById("clarity-daily-routines");
    var ribbon = document.getElementById("clarity-reopen-bar");
    var pathBoard = document.getElementById("path-board") || document.querySelector(".path-board, #clarity-path-board, [data-path-board]");
    var main = document.getElementById("main-content") || document.querySelector(".main-content, #main-application-workspace");

    if (m === "landing") {
      if (land) { land.hidden = false; land.style.display = ""; land.classList.remove("shell-hidden"); }
      if (routines) { routines.hidden = false; routines.style.display = ""; }
      if (ribbon) {
        ribbon.classList.add("on-landing");
        var hideBtn = ribbon.querySelector('[data-crb="hide"]');
        var openBtn = ribbon.querySelector('[data-crb="open"]');
        if (hideBtn) hideBtn.style.display = "";
        if (openBtn) openBtn.style.display = "none";
      }
      // Soft-hide deep learning clutter on landing (keep in DOM)
      document.querySelectorAll(
        ".rrra-hub-hero, #path-board, .phased-learning, [data-path-board], #clarity-path-board, .path-board, " +
        "[class*='path-to-furnish'], [class*='phased'], #grave-path, .grave-path-panel, " +
        "section.path-overview, .track-doors, #track-doors, [aria-label*='Phased learning']"
      ).forEach(function (el) {
        el.classList.add("shell-landing-hide");
      });
      // hide path cards by heading text parent
      document.querySelectorAll("h2, h3").forEach(function(h){
        var t=(h.textContent||"");
        if (/Path to furnish|Phased learning|Four doors/i.test(t)) {
          var box = h.closest("section, article, .card, .panel, div");
          if (box) box.classList.add("shell-landing-hide");
        }
      });
      if (main) main.classList.add("shell-mode-landing");
    } else {
      if (land) { land.hidden = true; land.style.display = "none"; land.classList.add("shell-hidden"); }
      if (routines) { routines.hidden = true; routines.style.display = "none"; }
      if (ribbon) {
        ribbon.classList.remove("on-landing");
        var hideBtn2 = ribbon.querySelector('[data-crb="hide"]');
        var openBtn2 = ribbon.querySelector('[data-crb="open"]');
        if (hideBtn2) hideBtn2.style.display = "none";
        if (openBtn2) openBtn2.style.display = "";
      }
      document.querySelectorAll(".shell-landing-hide").forEach(function (el) {
        el.classList.remove("shell-landing-hide");
      });
      if (main) main.classList.remove("shell-mode-landing");
    }
  }

  // Dual path: Companion enters deep shell; University leaves site
  function bindDual() {
    document.addEventListener("click", function (ev) {
      var a = ev.target && ev.target.closest && ev.target.closest("#dual-path-companion");
      if (a) {
        ev.preventDefault();
        setMode("companion");
        try {
          var mc = document.getElementById("main-content");
          if (mc) mc.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (e) {}
      }
    }, true);
  }

  function boot() {
    ensureRibbon();
    ensureRoutineStrip();
    bindDual();
    apply();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", function () { setTimeout(apply, 400); setTimeout(apply, 1200); });

  w.ClarityShell = { mode: mode, setMode: setMode, apply: apply, version: "20261024ARCH" };
})(typeof window !== "undefined" ? window : this);
