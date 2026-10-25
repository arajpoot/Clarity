/**
 * Clarity Shell v3 — mode switch only (no landing DOM)
 * landing | companion. Educational only — not a fatwa.
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
    apply();
  }

  function ensureRibbon() {
    var bar = document.getElementById("clarity-reopen-bar");
    if (bar) return bar;
    bar = document.createElement("div");
    bar.id = "clarity-reopen-bar";
    bar.setAttribute("role", "toolbar");
    bar.innerHTML =
      '<span class="crb-label">Day landing</span>' +
      '<button type="button" class="crb-btn crb-open" data-crb="open">Open daily routines</button>' +
      '<button type="button" class="crb-btn crb-hide" data-crb="hide">Hide for now</button>' +
      '<span class="crb-hint">Return anytime · on this device</span>';
    var visit = document.getElementById("clarity-visit-pill-bar");
    var duo = document.getElementById("clarity-top-duo");
    var host = (visit && visit.parentNode) || (duo && duo.parentNode) || document.body;
    var before = visit ? visit.nextSibling : (duo ? duo.nextSibling : null);
    if (before) host.insertBefore(bar, before);
    else host.appendChild(bar);
    bar.addEventListener("click", function (ev) {
      var t = ev.target && ev.target.closest && ev.target.closest("[data-crb]");
      if (!t) return;
      setMode(t.getAttribute("data-crb") === "open" ? "landing" : "companion");
    });
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
    ensureRibbon();
    var bar = document.getElementById("clarity-reopen-bar");
    var openBtn = bar && bar.querySelector('[data-crb="open"]');
    var hideBtn = bar && bar.querySelector('[data-crb="hide"]');
    var land = document.getElementById("clarity-day-landing");

    if (m === "landing") {
      if (land) { land.hidden = false; land.style.removeProperty("display"); }
      if (openBtn) openBtn.style.display = "none";
      if (hideBtn) hideBtn.style.display = "";
      document.querySelectorAll(".tab-panel, .rrra-hub, .rrra-hub-hero").forEach(function (el) {
        if (el.closest && el.closest("#clarity-day-landing")) return;
        el.classList.add("shell-landing-hide");
      });
      document.querySelectorAll("h2, h3").forEach(function (h) {
        if (!/Path to furnish|Phased learning/i.test(h.textContent || "")) return;
        var box = h.closest("section, article, .card, .panel, div");
        if (box && box.id !== "clarity-day-landing") box.classList.add("shell-landing-hide");
      });
    } else {
      if (land) { land.hidden = true; land.style.display = "none"; }
      if (openBtn) openBtn.style.display = "";
      if (hideBtn) hideBtn.style.display = "none";
      document.querySelectorAll(".shell-landing-hide").forEach(function (el) {
        el.classList.remove("shell-landing-hide");
      });
    }
    applyDoorRail(m);
  }

  function boot() {
    ensureRibbon();
    apply();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", function () { setTimeout(apply, 200); });

  w.ClarityShell = { mode: mode, setMode: setMode, apply: apply, version: "20261024SHELL3" };
})(typeof window !== "undefined" ? window : this);
