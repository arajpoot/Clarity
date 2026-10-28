/**
 * Companion seal + sticky mode + single pill
 * Day content must not creep into companion
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_COMPANION_SEAL_V1__) return;
  g.__CLARITY_COMPANION_SEAL_V1__ = true;

  var KEY = "clarity_shell_mode_v1";
  var PICK = "clarity_shell_user_pick_v1";

  var DAY_SELECTORS = [
    ".cdl-card",
    ".cdl-deed",
    ".cdl-footer-plaque",
    ".cdl-resurrection-shell",
    ".dual-tiles",
    "#cdl-wudu-card",
    "#clarity-landing-slot-dayn",
    "#cdl-qada-calendar",
    "#cdl-verse",
    "#cdl-do-today",
    "#cdl-footer-plaque",
    "#cdl-qibla-card",
    "#cdl-trust-review-card",
    "[data-day-slot]",
    "[data-resurrected]"
  ].join(",");

  function readMode() {
    try {
      var m = localStorage.getItem(KEY);
      if (m === "landing" || m === "companion") return m;
    } catch (e) {}
    return document.documentElement.getAttribute("data-shell-mode") === "companion"
      ? "companion"
      : "landing";
  }

  function armPick() {
    try {
      sessionStorage.setItem(PICK, "1");
      localStorage.setItem(PICK, "1");
    } catch (e) {}
  }

  function writeMode(m) {
    if (m !== "landing" && m !== "companion") return;
    try { localStorage.setItem(KEY, m); } catch (e) {}
    armPick();
    document.documentElement.setAttribute("data-shell-mode", m);
  }

  function setMode(m) {
    writeMode(m);
    try {
      if (g.ClarityShell && g.ClarityShell.setMode) g.ClarityShell.setMode(m);
    } catch (e) {}
    apply(m);
  }

  function sealDayRoom() {
    var room = document.getElementById("clarity-day-landing-room");
    if (!room) return;
    room.hidden = true;
    room.setAttribute("hidden", "");
    room.setAttribute("inert", "");
    room.setAttribute("aria-hidden", "true");
    room.setAttribute("data-day-sealed", "1");
    try {
      room.style.setProperty("display", "none", "important");
      room.style.setProperty("visibility", "hidden", "important");
      room.style.setProperty("height", "0", "important");
      room.style.setProperty("overflow", "hidden", "important");
      room.style.setProperty("position", "absolute", "important");
      room.style.setProperty("left", "-9999px", "important");
    } catch (e) {}
  }

  function openDayRoom() {
    var room = document.getElementById("clarity-day-landing-room");
    if (!room) return;
    room.hidden = false;
    room.removeAttribute("hidden");
    room.removeAttribute("inert");
    room.setAttribute("aria-hidden", "false");
    room.removeAttribute("data-day-sealed");
    try {
      room.style.setProperty("display", "block", "important");
      room.style.setProperty("visibility", "visible", "important");
      room.style.setProperty("height", "auto", "important");
      room.style.setProperty("position", "relative", "important");
      room.style.setProperty("left", "auto", "important");
    } catch (e) {}
  }

  /** Move leaked day nodes back into day room; hide if no host */
  function ejectLeaks() {
    var room = document.getElementById("clarity-day-landing-room");
    var host = room && room.querySelector(".day-room-inner");
    document.querySelectorAll(DAY_SELECTORS).forEach(function (el) {
      if (room && room.contains(el)) return;
      if (el.closest && el.closest("#amana-vault-interior,#amana-vault-host,#clarity-reopen-bar")) return;
      /* not inside day room = leak */
      if (host) {
        try {
          host.appendChild(el);
        } catch (e) {
          try {
            el.setAttribute("hidden", "");
            el.style.setProperty("display", "none", "important");
          } catch (e2) {}
        }
      } else {
        try {
          el.setAttribute("hidden", "");
          el.style.setProperty("display", "none", "important");
        } catch (e) {}
      }
    });
  }

  function ensureBar(m) {
    m = m || readMode();
    var bar = document.getElementById("clarity-reopen-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "clarity-reopen-bar";
      bar.setAttribute("role", "navigation");
      var anchor =
        document.getElementById("clarity-top-duo") ||
        document.querySelector(".clarity-banner,#clarity-banner,header") ||
        document.getElementById("clarity-day-landing-room");
      try {
        if (anchor && anchor.parentNode) {
          if (anchor.id === "clarity-day-landing-room") anchor.parentNode.insertBefore(bar, anchor);
          else anchor.parentNode.insertBefore(bar, anchor.nextSibling);
        } else document.body.appendChild(bar);
      } catch (e) {
        document.body.appendChild(bar);
      }
    }
    try {
      bar.style.setProperty("display", "flex", "important");
      bar.style.setProperty("visibility", "visible", "important");
      bar.style.setProperty("z-index", "100", "important");
    } catch (e) {}

    var go = m === "landing" ? "companion" : "landing";
    var label = m === "landing" ? "Companion path →" : "← Day landing";
    var btn = document.getElementById("clarity-single-switch");
    if (!btn || btn.parentNode !== bar) {
      bar.innerHTML = "";
      btn = document.createElement("button");
      btn.type = "button";
      btn.id = "clarity-single-switch";
      bar.appendChild(btn);
    }
    Array.prototype.slice.call(bar.querySelectorAll("button")).forEach(function (b) {
      if (b.id !== "clarity-single-switch") b.remove();
    });
    btn.textContent = label;
    btn.onclick = function (ev) {
      if (ev) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
      }
      setMode(go);
    };
  }

  function apply(m) {
    m = m || readMode();
    document.documentElement.setAttribute("data-shell-mode", m);
    if (m === "companion") {
      ejectLeaks();
      sealDayRoom();
    } else {
      openDayRoom();
    }
    ensureBar(m);
  }

  function honour() {
    armPick();
    var stored = readMode();
    document.documentElement.setAttribute("data-shell-mode", stored);
    try { localStorage.setItem(KEY, stored); } catch (e) {}
    apply(stored);
  }

  function patchShell() {
    if (!g.ClarityShell || g.ClarityShell.__sealPatched) return;
    var sm = g.ClarityShell.setMode;
    var ap = g.ClarityShell.apply;
    if (typeof sm === "function") {
      g.ClarityShell.setMode = function (m) {
        writeMode(m);
        var r = sm.apply(this, arguments);
        setTimeout(honour, 0);
        return r;
      };
    }
    if (typeof ap === "function") {
      g.ClarityShell.apply = function () {
        armPick();
        var stored = readMode();
        if (stored === "companion") {
          try {
            localStorage.setItem(KEY, "companion");
            document.documentElement.setAttribute("data-shell-mode", "companion");
          } catch (e) {}
        }
        var r = ap.apply(this, arguments);
        setTimeout(honour, 0);
        setTimeout(function () {
          if (readMode() === "companion") {
            ejectLeaks();
            sealDayRoom();
          }
        }, 40);
        return r;
      };
    }
    g.ClarityShell.__sealPatched = true;
  }

  /* day-flow unhide must not open room on companion */
  document.addEventListener("clarity:day-room-ready", function () {
    setTimeout(function () {
      if (readMode() === "companion") {
        ejectLeaks();
        sealDayRoom();
      }
      ensureBar(readMode());
    }, 30);
  });

  document.addEventListener(
    "click",
    function (ev) {
      var t = ev.target && ev.target.closest && ev.target.closest("#day-path-companion,#dual-path-companion");
      if (t) {
        ev.preventDefault();
        setMode("companion");
      }
    },
    true
  );

  function boot() {
    patchShell();
    honour();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  [0, 100, 300, 800, 1500, 3000, 5000].forEach(function (ms) {
    setTimeout(function () {
      patchShell();
      if (readMode() === "companion") {
        ejectLeaks();
        sealDayRoom();
      }
      ensureBar(readMode());
    }, ms);
  });

  try {
    new MutationObserver(function () {
      if (readMode() !== "companion") return;
      var room = document.getElementById("clarity-day-landing-room");
      if (room && getComputedStyle(room).display !== "none") sealDayRoom();
      /* leaked visible day card? */
      var leak = false;
      document.querySelectorAll("#main-content .cdl-card, #main-content .dual-tiles").forEach(function (el) {
        if (room && room.contains(el)) return;
        if (getComputedStyle(el).display !== "none") leak = true;
      });
      if (leak) ejectLeaks();
    }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "class", "hidden"] });
  } catch (e) {}

  g.ClaritySeal = { setMode: setMode, mode: readMode, honour: honour, eject: ejectLeaks };
})(typeof window !== "undefined" ? window : this);
