/**
 * Day isolate v2 · sticky companion on refresh · kill legacy switch bars
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_DAY_ISOLATE_V2__) return;
  g.__CLARITY_DAY_ISOLATE_V2__ = true;
  g.__CLARITY_DAY_ISOLATE_V1__ = true;

  var KEY = "clarity_shell_mode_v1";
  var PICK = "clarity_shell_pick_v1";

  function mode() {
    var m = document.documentElement.getAttribute("data-shell-mode");
    if (m === "landing" || m === "companion") return m;
    try {
      m = localStorage.getItem(KEY) || sessionStorage.getItem(PICK);
    } catch (e) {}
    return m === "companion" ? "companion" : "landing";
  }

  function setMode(m) {
    if (m !== "landing" && m !== "companion") return;
    document.documentElement.setAttribute("data-shell-mode", m);
    try {
      localStorage.setItem(KEY, m);
      sessionStorage.setItem(PICK, m);
    } catch (e) {}
    try {
      if (g.ClarityShell && g.ClarityShell.setMode) g.ClarityShell.setMode(m);
    } catch (e) {}
    enforce();
    renderBar();
  }

  function sealDayRoom() {
    var room = document.getElementById("clarity-day-landing-room");
    if (!room) return;
    room.setAttribute("hidden", "");
    room.setAttribute("inert", "");
    room.setAttribute("aria-hidden", "true");
    room.setAttribute("data-day-sealed", "1");
    room.hidden = true;
    try {
      room.style.setProperty("display", "none", "important");
      room.style.setProperty("visibility", "hidden", "important");
    } catch (e) {}
  }

  function openDayRoom() {
    var room = document.getElementById("clarity-day-landing-room");
    if (!room) return;
    room.removeAttribute("hidden");
    room.removeAttribute("inert");
    room.setAttribute("aria-hidden", "false");
    room.removeAttribute("data-day-sealed");
    room.hidden = false;
    try {
      room.style.setProperty("display", "block", "important");
      room.style.setProperty("visibility", "visible", "important");
      room.style.setProperty("position", "relative", "important");
      room.style.setProperty("left", "auto", "important");
    } catch (e) {}
  }

  function ejectLeaks() {
    if (mode() !== "companion") return;
    var room = document.getElementById("clarity-day-landing-room");
    var host = room && room.querySelector(".day-room-inner");
    document.querySelectorAll(
      ".cdl-card, .cdl-deed, .cdl-footer-plaque, .cdl-resurrection-shell, .dual-tiles, #cdl-wudu-card, #clarity-landing-slot-dayn, #cdl-qada-calendar, #cdl-verse"
    ).forEach(function (el) {
      if (room && room.contains(el)) return;
      if (el.closest && el.closest("#amana-vault-interior")) return;
      if (host) {
        try { host.appendChild(el); } catch (e) {
          el.setAttribute("hidden", "");
          try { el.style.setProperty("display", "none", "important"); } catch (e2) {}
        }
      } else {
        try { el.style.setProperty("display", "none", "important"); } catch (e) {}
      }
    });
    sealDayRoom();
  }

  function killOldBars() {
    var killSel = [
      "#clarity-shell-switcher",
      ".clarity-shell-plaque",
      "[data-legacy-shell-bar]",
      ".day-landing-switch-bar",
      ".one-plaque-bar",
      "#shell-go-landing",
      "#shell-go-companion"
    ];
    killSel.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (el.id === "clarity-day-switch-bar" || (el.closest && el.closest("#clarity-day-switch-bar"))) return;
        try { el.remove(); } catch (e) {
          el.style.setProperty("display", "none", "important");
        }
      });
    });
    /* hide buttons that look like old triple bar */
    document.querySelectorAll("button, a").forEach(function (el) {
      if (el.closest && el.closest("#clarity-day-switch-bar")) return;
      var t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (/^Hide for now$/i.test(t) || /^Day landing$/i.test(t) && el.id !== "clarity-day-switch-only") {
        /* only kill if in a horizontal plaque with multiple siblings */
        var p = el.parentElement;
        if (p && p.querySelectorAll("button, a").length >= 2 && /plaque|switch|shell|pill/i.test(p.className || p.id || "")) {
          try { el.style.setProperty("display", "none", "important"); } catch (e) {}
        }
      }
      if (/^Hide for now$/i.test(t)) {
        try { el.style.setProperty("display", "none", "important"); el.setAttribute("hidden", ""); } catch (e) {}
      }
    });
  }

  function renderBar() {
    killOldBars();
    var bar = document.getElementById("clarity-day-switch-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "clarity-day-switch-bar";
      bar.setAttribute("role", "navigation");
      bar.setAttribute("aria-label", "Switch section");
      var anchor =
        document.querySelector("header, .clarity-banner, #clarity-banner") ||
        document.getElementById("clarity-day-landing-room");
      if (anchor && anchor.parentNode) {
        if (anchor.id === "clarity-day-landing-room") anchor.parentNode.insertBefore(bar, anchor);
        else anchor.parentNode.insertBefore(bar, anchor.nextSibling);
      } else document.body.insertBefore(bar, document.body.firstChild);
    }
    var m = mode();
    var label = m === "landing" ? "Companion path →" : "← Day landing";
    var go = m === "landing" ? "companion" : "landing";
    bar.innerHTML = "";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "clarity-day-switch-only";
    btn.textContent = label;
    btn.addEventListener("click", function () {
      setMode(go);
    });
    bar.appendChild(btn);
  }

  function enforce() {
    killOldBars();
    if (mode() === "companion") {
      ejectLeaks();
      sealDayRoom();
    } else openDayRoom();
    renderBar();
  }

  function wirePaths() {
    document.querySelectorAll("#day-path-companion, #dual-path-companion").forEach(function (a) {
      if (a.__dayIso2) return;
      a.__dayIso2 = true;
      a.addEventListener("click", function (ev) {
        ev.preventDefault();
        setMode("companion");
      }, true);
    });
  }

  /* Honor saved companion mode immediately (before first-paint forces landing) */
  try {
    var saved = localStorage.getItem(KEY) || sessionStorage.getItem(PICK);
    if (saved === "companion") {
      document.documentElement.setAttribute("data-shell-mode", "companion");
    }
  } catch (e) {}

  function boot() {
    enforce();
    wirePaths();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  [200, 800, 2000, 4000].forEach(function (ms) { setTimeout(enforce, ms); });
  document.addEventListener("clarity:day-room-ready", function () { setTimeout(enforce, 60); });

  g.ClarityDayIsolate = { setMode: setMode, mode: mode, enforce: enforce, version: 2 };
})(typeof window !== "undefined" ? window : this);
