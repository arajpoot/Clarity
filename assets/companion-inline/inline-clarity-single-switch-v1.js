/**
 * Sticky companion FINAL — honour localStorage on refresh
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_STICKY_COMPANION_V1__) return;
  g.__CLARITY_STICKY_COMPANION_V1__ = true;

  var KEY = "clarity_shell_mode_v1";
  var PICK = "clarity_shell_user_pick_v1";

  function readMode() {
    try {
      var m = localStorage.getItem(KEY);
      if (m === "landing" || m === "companion") return m;
    } catch (e) {}
    return "landing";
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
    paintPill(m);
  }

  function paintPill(m) {
    m = m || readMode();
    var bar = document.getElementById("clarity-reopen-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "clarity-reopen-bar";
      var a = document.querySelector("header,.clarity-banner,#clarity-banner") ||
        document.getElementById("clarity-day-landing-room");
      if (a && a.parentNode) {
        if (a.id === "clarity-day-landing-room") a.parentNode.insertBefore(bar, a);
        else a.parentNode.insertBefore(bar, a.nextSibling);
      } else document.body.appendChild(bar);
    }
    bar.innerHTML = "";
    var go = m === "landing" ? "companion" : "landing";
    var label = m === "landing" ? "Companion path →" : "← Day landing";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "clarity-single-switch";
    btn.textContent = label;
    btn.addEventListener("click", function (ev) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      setMode(go);
    });
    bar.appendChild(btn);
  }

  function honourStorage() {
    armPick();
    var stored = readMode();
    document.documentElement.setAttribute("data-shell-mode", stored);
    try { localStorage.setItem(KEY, stored); } catch (e) {}
    apply(stored);
  }

  function patchShell() {
    if (!g.ClarityShell || g.ClarityShell.__stickyPatched) return;
    var sm = g.ClarityShell.setMode;
    var ap = g.ClarityShell.apply;
    if (typeof sm === "function") {
      g.ClarityShell.setMode = function (m) {
        writeMode(m);
        var r = sm.apply(this, arguments);
        setTimeout(honourStorage, 0);
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
        setTimeout(honourStorage, 0);
        setTimeout(honourStorage, 40);
        return r;
      };
    }
    g.ClarityShell.__stickyPatched = true;
  }

  try {
    var _setItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      if (k === KEY && v === "landing") {
        try {
          if (localStorage.getItem(PICK) === "1" && localStorage.getItem(KEY) === "companion") {
            return; /* refuse forced demotion */
          }
        } catch (e) {}
      }
      return _setItem.apply(this, arguments);
    };
  } catch (e) {}

  document.addEventListener("click", function (ev) {
    var t = ev.target && ev.target.closest && ev.target.closest("#day-path-companion,#dual-path-companion");
    if (t) {
      ev.preventDefault();
      setMode("companion");
    }
  }, true);

  function boot() {
    armPick();
    patchShell();
    honourStorage();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  [0, 50, 100, 250, 500, 1000, 2000, 4000].forEach(function (ms) {
    setTimeout(function () { patchShell(); honourStorage(); }, ms);
  });
  g.addEventListener("load", function () {
    honourStorage();
    setTimeout(honourStorage, 100);
  });

  g.ClaritySticky = { setMode: setMode, mode: readMode, honour: honourStorage };
})(typeof window !== "undefined" ? window : this);
