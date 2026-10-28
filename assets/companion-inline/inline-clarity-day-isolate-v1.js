/**
 * Day shell v3 · single authority — no first-paint fighter, no multi-bar
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_DAY_SHELL_V3__) return;
  g.__CLARITY_DAY_SHELL_V3__ = true;

  var KEY = "clarity_shell_mode_v1";

  function getMode() {
    var m = document.documentElement.getAttribute("data-shell-mode");
    if (m === "landing" || m === "companion") return m;
    try { m = localStorage.getItem(KEY); } catch (e) {}
    return m === "companion" ? "companion" : "landing";
  }

  function setMode(m) {
    if (m !== "landing" && m !== "companion") return;
    document.documentElement.setAttribute("data-shell-mode", m);
    try { localStorage.setItem(KEY, m); } catch (e) {}
    try {
      if (g.ClarityShell && g.ClarityShell.setMode) g.ClarityShell.setMode(m);
    } catch (e) {}
    apply();
  }

  function nukeBars() {
    document.querySelectorAll(
      "#clarity-shell-switcher,.clarity-shell-plaque,[data-legacy-shell-bar],.day-landing-switch-bar,.one-plaque-bar,#shell-go-landing,#shell-go-companion"
    ).forEach(function (el) {
      try { el.remove(); } catch (e) {
        el.style.cssText = "display:none!important;visibility:hidden!important;height:0!important";
      }
    });
    /* Hide for now buttons */
    document.querySelectorAll("button,a,span").forEach(function (el) {
      if (el.closest && el.closest("#clarity-day-switch-bar")) return;
      var t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (t === "Hide for now" || t === "One plaque · this device") {
        try { el.remove(); } catch (e) {
          el.style.setProperty("display", "none", "important");
        }
      }
    });
  }

  function apply() {
    nukeBars();
    var m = getMode();
    var room = document.getElementById("clarity-day-landing-room");
    if (room) {
      if (m === "companion") {
        room.hidden = true;
        room.setAttribute("hidden", "");
        room.setAttribute("inert", "");
        try {
          room.style.setProperty("display", "none", "important");
        } catch (e) {}
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
    bar(m);
  }

  function bar(m) {
    nukeBars();
    var el = document.getElementById("clarity-day-switch-bar");
    if (!el) {
      el = document.createElement("div");
      el.id = "clarity-day-switch-bar";
      var a = document.querySelector("header,.clarity-banner,#clarity-banner") ||
        document.getElementById("clarity-day-landing-room");
      if (a && a.parentNode) {
        if (a.id === "clarity-day-landing-room") a.parentNode.insertBefore(el, a);
        else a.parentNode.insertBefore(el, a.nextSibling);
      } else document.body.appendChild(el);
    }
    var go = m === "landing" ? "companion" : "landing";
    var label = m === "landing" ? "Companion path →" : "← Day landing";
    el.innerHTML = "";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "clarity-day-switch-only";
    btn.textContent = label;
    btn.onclick = function () {
      setMode(go);
    };
    el.appendChild(btn);
  }

  document.querySelectorAll("#day-path-companion,#dual-path-companion").forEach(function (a) {
    a.addEventListener("click", function (ev) {
      ev.preventDefault();
      setMode("companion");
    }, true);
  });

  function boot() {
    apply();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(apply, 500);
  setTimeout(apply, 1500);

  /* MutationObserver: if old bar reappears, nuke */
  try {
    new MutationObserver(function () {
      if (document.getElementById("clarity-shell-switcher") || document.querySelector(".clarity-shell-plaque")) {
        nukeBars();
        bar(getMode());
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  } catch (e) {}

  g.ClarityDayShell = { setMode: setMode, mode: getMode, apply: apply };
})(typeof window !== "undefined" ? window : this);
