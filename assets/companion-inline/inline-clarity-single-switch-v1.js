/**
 * Restore switch bar — always visible single destination pill
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_SWITCH_RESTORE_V1__) return;
  g.__CLARITY_SWITCH_RESTORE_V1__ = true;

  var KEY = "clarity_shell_mode_v1";
  var PICK = "clarity_shell_user_pick_v1";

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

  function apply(m) {
    m = m || readMode();
    document.documentElement.setAttribute("data-shell-mode", m);
    var room = document.getElementById("clarity-day-landing-room");
    if (room) {
      if (m === "companion") {
        room.hidden = true;
        room.setAttribute("hidden", "");
        try { room.style.setProperty("display", "none", "important"); } catch (e) {}
      } else {
        room.hidden = false;
        room.removeAttribute("hidden");
        try {
          room.style.setProperty("display", "block", "important");
          room.style.setProperty("visibility", "visible", "important");
        } catch (e) {}
      }
    }
    ensureBar(m);
  }

  function findAnchor() {
    return (
      document.getElementById("clarity-top-duo") ||
      document.querySelector(".clarity-banner, #clarity-banner, header, #clarity-global-nav") ||
      document.getElementById("clarity-day-landing-room") ||
      document.getElementById("main-application-workspace") ||
      document.body
    );
  }

  function ensureBar(m) {
    m = m || readMode();
    var bar = document.getElementById("clarity-reopen-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "clarity-reopen-bar";
      bar.setAttribute("role", "navigation");
      bar.setAttribute("aria-label", "Switch Day landing or Companion");
      var anchor = findAnchor();
      try {
        if (anchor && anchor.parentNode) {
          if (anchor.id === "clarity-day-landing-room" || anchor.id === "main-application-workspace") {
            anchor.parentNode.insertBefore(bar, anchor);
          } else {
            anchor.parentNode.insertBefore(bar, anchor.nextSibling);
          }
        } else {
          document.body.appendChild(bar);
        }
      } catch (e) {
        document.body.appendChild(bar);
      }
    }

    /* force visible styles inline as last resort */
    try {
      bar.style.setProperty("display", "flex", "important");
      bar.style.setProperty("visibility", "visible", "important");
      bar.style.setProperty("opacity", "1", "important");
      bar.style.setProperty("z-index", "100", "important");
      bar.style.setProperty("position", "relative", "important");
      bar.style.setProperty("margin", "0.5rem auto 0.65rem", "important");
      bar.style.setProperty("max-width", "min(20rem, 92vw)", "important");
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
    /* remove extra buttons */
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

    try {
      btn.style.setProperty("display", "block", "important");
      btn.style.setProperty("width", "100%", "important");
      btn.style.setProperty("visibility", "visible", "important");
    } catch (e) {}
  }

  function honour() {
    armPick();
    var stored = readMode();
    document.documentElement.setAttribute("data-shell-mode", stored);
    apply(stored);
  }

  function patchShell() {
    if (!g.ClarityShell || g.ClarityShell.__switchRestored) return;
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
        setTimeout(ensureBar, 20);
        return r;
      };
    }
    g.ClarityShell.__switchRestored = true;
  }

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
      ensureBar(readMode());
    }, ms);
  });
  g.addEventListener("load", function () {
    ensureBar(readMode());
    setTimeout(function () { ensureBar(readMode()); }, 200);
  });

  /* If something removes the bar, put it back */
  try {
    new MutationObserver(function () {
      if (!document.getElementById("clarity-reopen-bar") || !document.getElementById("clarity-single-switch")) {
        ensureBar(readMode());
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  } catch (e) {}

  g.ClaritySwitch = { setMode: setMode, mode: readMode, ensureBar: ensureBar };
})(typeof window !== "undefined" ? window : this);
