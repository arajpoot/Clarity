/**
 * Single switch authority · kills #clarity-reopen-bar multi-pills
 * Stops first-visit force-landing · sticky companion
 * ONE destination pill only
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_SINGLE_SWITCH_V1__) return;
  g.__CLARITY_SINGLE_SWITCH_V1__ = true;

  var KEY = "clarity_shell_mode_v1";
  var PICK = "clarity_shell_user_pick_v1";

  function getMode() {
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
      sessionStorage.setItem(PICK, "1"); /* mark user choice — stops shell first-visit force */
    } catch (e) {}
    try {
      if (g.ClarityShell && g.ClarityShell.setMode) g.ClarityShell.setMode(m);
    } catch (e) {}
    applyRoom(m);
    paintPill();
  }

  function applyRoom(m) {
    var room = document.getElementById("clarity-day-landing-room");
    if (!room) return;
    if (m === "companion") {
      room.hidden = true;
      room.setAttribute("hidden", "");
      room.setAttribute("inert", "");
      try { room.style.setProperty("display", "none", "important"); } catch (e) {}
    } else {
      room.hidden = false;
      room.removeAttribute("hidden");
      room.removeAttribute("inert");
      try {
        room.style.setProperty("display", "block", "important");
        room.style.setProperty("visibility", "visible", "important");
      } catch (e) {}
    }
  }

  function paintPill() {
    var bar = document.getElementById("clarity-reopen-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "clarity-reopen-bar";
      bar.setAttribute("role", "navigation");
      bar.setAttribute("aria-label", "Switch section");
      var anchor =
        document.querySelector("header, .clarity-banner, #clarity-banner") ||
        document.getElementById("clarity-day-landing-room");
      if (anchor && anchor.parentNode) {
        if (anchor.id === "clarity-day-landing-room") anchor.parentNode.insertBefore(bar, anchor);
        else anchor.parentNode.insertBefore(bar, anchor.nextSibling);
      } else document.body.appendChild(bar);
    }

    /* Remove ALL children — obliterate multi-pill */
    bar.innerHTML = "";

    var m = getMode();
    var go = m === "landing" ? "companion" : "landing";
    var label = m === "landing" ? "Companion path →" : "← Day landing";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "clarity-single-switch";
    btn.className = "crb-single";
    btn.textContent = label;
    btn.setAttribute("data-go", go);
    btn.addEventListener("click", function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      setMode(go);
    });
    bar.appendChild(btn);

    /* Remove competing bars */
    var other = document.getElementById("clarity-day-switch-bar");
    if (other) other.remove();
    var shell = document.getElementById("clarity-shell-switcher");
    if (shell) shell.remove();
  }

  /* Neutralize shell first-visit force on every tick */
  function stopFirstVisitForce() {
    try {
      sessionStorage.setItem(PICK, "1");
    } catch (e) {}
  }

  function wireDual() {
    document.querySelectorAll("#day-path-companion, #dual-path-companion").forEach(function (a) {
      if (a.__ss1) return;
      a.__ss1 = true;
      a.addEventListener(
        "click",
        function (ev) {
          ev.preventDefault();
          setMode("companion");
        },
        true
      );
    });
  }

  function enforce() {
    stopFirstVisitForce();
    var m = getMode();
    document.documentElement.setAttribute("data-shell-mode", m);
    applyRoom(m);
    paintPill();
    wireDual();
  }

  /* Patch ClarityShell.setMode after it loads to always set PICK */
  function patchShell() {
    if (!g.ClarityShell || !g.ClarityShell.setMode || g.ClarityShell.__ssPatched) return;
    var prev = g.ClarityShell.setMode;
    g.ClarityShell.setMode = function (m) {
      try { sessionStorage.setItem(PICK, "1"); } catch (e) {}
      var r = prev.apply(this, arguments);
      setTimeout(paintPill, 0);
      setTimeout(paintPill, 50);
      return r;
    };
    g.ClarityShell.__ssPatched = true;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", enforce);
  else enforce();
  [50, 200, 600, 1500, 3000].forEach(function (ms) {
    setTimeout(function () {
      patchShell();
      enforce();
    }, ms);
  });

  try {
    new MutationObserver(function (muts) {
      var bar = document.getElementById("clarity-reopen-bar");
      if (!bar) return;
      if (bar.querySelectorAll("button").length > 1) paintPill();
      if (!document.getElementById("clarity-single-switch")) paintPill();
    }).observe(document.documentElement, { childList: true, subtree: true });
  } catch (e) {}

  g.ClaritySingleSwitch = { setMode: setMode, mode: getMode, enforce: enforce };
})(typeof window !== "undefined" ? window : this);
