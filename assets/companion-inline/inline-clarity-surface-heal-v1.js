/**
 * Companion surface healer — sections stay visible without full refresh
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_SURFACE_HEAL_V1__) return;
  w.__CLARITY_SURFACE_HEAL_V1__ = true;

  function normalize(id) {
    if (!id) return null;
    id = String(id).replace(/^#/, "").replace(/^tab-/, "").toLowerCase();
    if (id === "fiqh" || id === "vault" || id === "amana") id = "notes";
    if (id === "journey" || id === "commands" || id === "today") id = "reminder";
    if (id === "seerah" || id === "lectures" || id === "tools") id = "reality";
    if (id === "grave" || id === "tafseer") id = "reflection";
    if (id === "tajweed" || id === "guidance") id = "action";
    if (["reminder","reality","reflection","action","notes"].indexOf(id) < 0) return null;
    return id;
  }

  function revealPanel(id) {
    id = normalize(id) || "reminder";
    var main = document.getElementById("main-content") || document.querySelector(".main-content");
    if (main) {
      main.hidden = false;
      main.style.setProperty("display", "block", "important");
      main.style.setProperty("visibility", "visible", "important");
      main.removeAttribute("aria-hidden");
    }
    document.querySelectorAll(".tab-panel").forEach(function (p) {
      var on = p.id === ("tab-" + id);
      p.classList.toggle("active", on);
      if (on) {
        p.hidden = false;
        p.classList.remove("shell-landing-hide");
        p.style.setProperty("display", "block", "important");
        p.style.setProperty("visibility", "visible", "important");
        p.style.setProperty("opacity", "1", "important");
        p.style.setProperty("min-height", "12rem", "important");
        p.setAttribute("aria-hidden", "false");
        p.querySelectorAll(".card, [id$='-card'], .rrra-hub-hero, .rrra-hub-summary, .rrra-hub").forEach(function (c) {
          c.classList.remove("gate-hidden", "shell-landing-hide");
          c.removeAttribute("data-gate-hidden");
          c.hidden = false;
          try {
            c.style.removeProperty("display");
            c.style.removeProperty("visibility");
            c.style.removeProperty("height");
            c.style.removeProperty("max-height");
            c.style.removeProperty("opacity");
            c.style.removeProperty("pointer-events");
          } catch (e) {}
        });
      } else {
        p.style.display = "none";
        p.setAttribute("aria-hidden", "true");
      }
    });
    document.querySelectorAll(".door-rail-btn, [data-rail-tab]").forEach(function (b) {
      var t = b.getAttribute("data-rail-tab") || "";
      b.classList.toggle("active", t === id);
    });
    try { document.body.setAttribute("data-active-tab", id); } catch (e) {}
  }

  function activeId() {
    var h = normalize((w.location.hash || "").replace(/^#/, ""));
    if (h) return h;
    try {
      var s = normalize(sessionStorage.getItem("clarity_active_section_v1"));
      if (s) return s;
    } catch (e) {}
    return "reminder";
  }

  function heal() {
    var mode = "landing";
    try {
      mode = (w.ClarityShell && w.ClarityShell.mode && w.ClarityShell.mode()) ||
        localStorage.getItem("clarity_shell_mode_v1") ||
        localStorage.getItem("clarity_shell_mode") ||
        document.documentElement.getAttribute("data-shell-mode") ||
        "landing";
    } catch (e) {}
    // If URL is a companion tab, force companion surface
    var id = activeId();
    if (id && mode !== "companion") {
      // hash says companion section — ensure main is visible
      if (/reminder|reality|reflection|action|notes/.test(id)) {
        try {
          if (w.ClarityShell && w.ClarityShell.setMode) w.ClarityShell.setMode("companion");
        } catch (e2) {}
      }
    }
    if ((document.documentElement.getAttribute("data-shell-mode") === "companion") ||
        (document.body && document.body.getAttribute("data-shell-mode") === "companion") ||
        /reminder|reality|reflection|action|notes/.test((w.location.hash || "").replace(/^#/, ""))) {
      revealPanel(id);
    }
  }

  w.addEventListener("hashchange", function () { setTimeout(heal, 30); setTimeout(heal, 200); });
  document.addEventListener("click", function (ev) {
    var t = ev.target && ev.target.closest && ev.target.closest("[data-rail-tab], [data-tab], .door-rail-btn, [data-crb]");
    if (!t) return;
    setTimeout(heal, 40);
    setTimeout(heal, 180);
    setTimeout(heal, 500);
  }, true);

  // After shell apply
  var prevSet = w.ClarityShell && w.ClarityShell.setMode;
  if (typeof prevSet === "function" && !prevSet.__healWrapped) {
    w.ClarityShell.setMode = function (m) {
      var r = prevSet.apply(this, arguments);
      setTimeout(heal, 50);
      setTimeout(heal, 250);
      return r;
    };
    w.ClarityShell.setMode.__healWrapped = true;
  }

  function boot() {
    heal();
    setTimeout(heal, 400);
    setTimeout(heal, 1200);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(heal, 300); setTimeout(heal, 900); });

  // Soft interval: only if active panel has near-zero height while in companion
  setInterval(function () {
    try {
      if (document.documentElement.getAttribute("data-shell-mode") !== "companion") return;
      var id = activeId();
      var p = document.getElementById("tab-" + id);
      if (!p) return;
      var h = p.getBoundingClientRect().height;
      if (h < 40) revealPanel(id);
    } catch (e) {}
  }, 1500);
})(typeof window !== "undefined" ? window : this);
