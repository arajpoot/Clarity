/**
 * Day landing isolation trench · vault architecture pattern
 * - Single destination switch pill (never 3)
 * - Seal day room when not on landing shell
 * - Eject day cards that leaked into companion tabs back into room or hide
 * - Cut cross-wiring: day modules do not paint companion
 * Educational · on-device · not a fatwa
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_DAY_ISOLATE_V1__) return;
  g.__CLARITY_DAY_ISOLATE_V1__ = true;

  var KEY = "clarity_shell_mode_v1";
  var PICK = "clarity_shell_pick_v1";

  var DAY_IDS = [
    "clarity-day-landing-room",
    "cdl-wudu-card",
    "cdl-qada-calendar",
    "cdl-qada-card",
    "clarity-landing-slot-dayn",
    "cdl-footer-plaque",
    "cdl-trust-review-card",
    "cdl-do-today",
    "cdl-verse",
    "cdl-qibla-card",
    "cdl-confidence"
  ];

  function mode() {
    var m = document.documentElement.getAttribute("data-shell-mode");
    if (m === "landing" || m === "companion") return m;
    try { m = localStorage.getItem(KEY); } catch (e) {}
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
      room.style.setProperty("opacity", "1", "important");
      room.style.setProperty("height", "auto", "important");
      room.style.setProperty("position", "relative", "important");
      room.style.setProperty("left", "auto", "important");
    } catch (e) {}
  }

  /** Move leaked day nodes back into .day-room-inner or hide */
  function ejectLeaksFromCompanion() {
    if (mode() !== "companion") return;
    var room = document.getElementById("clarity-day-landing-room");
    var host = room && room.querySelector(".day-room-inner");
    var selectors = [
      ".cdl-card",
      ".cdl-deed",
      ".cdl-footer-plaque",
      ".cdl-resurrection-shell",
      ".dual-tiles",
      "#cdl-wudu-card",
      "#clarity-landing-slot-dayn",
      "#cdl-qada-calendar",
      "#cdl-footer-plaque",
      "#cdl-verse"
    ];
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (room && room.contains(el)) return; /* legitimately inside day room */
        if (el.closest && el.closest("#amana-vault-interior, #amana-vault-host")) return;
        if (host) {
          try {
            host.appendChild(el);
          } catch (e) {
            el.setAttribute("hidden", "");
            try { el.style.setProperty("display", "none", "important"); } catch (e2) {}
          }
        } else {
          el.setAttribute("hidden", "");
          try { el.style.setProperty("display", "none", "important"); } catch (e2) {}
        }
      });
    });
    sealDayRoom();
  }

  function killMultiPillBars() {
    /* remove old shell-contain triple bars */
    var old = document.getElementById("clarity-shell-switcher");
    if (old) old.remove();
    document.querySelectorAll("[data-legacy-shell-bar], .clarity-shell-plaque").forEach(function (el) {
      el.remove();
    });
  }

  function renderBar() {
    killMultiPillBars();
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
        if (anchor.id === "clarity-day-landing-room") {
          anchor.parentNode.insertBefore(bar, anchor);
        } else {
          anchor.parentNode.insertBefore(bar, anchor.nextSibling);
        }
      } else {
        document.body.insertBefore(bar, document.body.firstChild);
      }
    }
    var m = mode();
    /* ONE pill only — destination */
    var label = m === "landing" ? "Companion path →" : "← Day landing";
    var go = m === "landing" ? "companion" : "landing";
    bar.innerHTML = "";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "clarity-day-switch-only";
    btn.textContent = label;
    btn.setAttribute("data-go", go);
    btn.addEventListener("click", function () {
      setMode(go);
      try {
        if (go === "companion") {
          var t = document.getElementById("tab-reminder") || document.getElementById("main-content");
          if (t) t.scrollIntoView({ block: "start", behavior: "smooth" });
        } else {
          var r = document.getElementById("clarity-day-landing-room");
          if (r) r.scrollIntoView({ block: "start", behavior: "smooth" });
        }
      } catch (e) {}
    });
    bar.appendChild(btn);
  }

  function enforce() {
    killMultiPillBars();
    if (mode() === "companion") {
      ejectLeaksFromCompanion();
      sealDayRoom();
    } else {
      openDayRoom();
    }
    renderBar();
  }

  /* Dual path → companion only via setMode; no day content copy */
  function wirePaths() {
    document.querySelectorAll("#day-path-companion, #dual-path-companion").forEach(function (a) {
      if (a.__dayIso) return;
      a.__dayIso = true;
      a.addEventListener(
        "click",
        function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          setMode("companion");
        },
        true
      );
    });
  }

  function boot() {
    enforce();
    wirePaths();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  [300, 1000, 2500, 5000].forEach(function (ms) {
    setTimeout(enforce, ms);
  });
  document.addEventListener("clarity:day-room-ready", function () {
    setTimeout(enforce, 80);
  });
  document.addEventListener("clarity:shell-mode", enforce);
  g.addEventListener("clarity-tab-change", function () {
    if (mode() === "companion") ejectLeaksFromCompanion();
  });

  /* Block day-flow / registry from unhiding room while companion */
  var _setProp = CSSStyleDeclaration.prototype.setProperty;
  /* do not patch globally — too aggressive */

  g.ClarityDayIsolate = { setMode: setMode, mode: mode, enforce: enforce, version: 1 };
})(typeof window !== "undefined" ? window : this);
