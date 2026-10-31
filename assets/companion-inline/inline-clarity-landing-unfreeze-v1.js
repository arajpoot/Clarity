/**
 * inline-clarity-landing-unfreeze-v1.js
 * Live fix: site frozen on landing when #clarity-day-landing is missing
 * but shell mode is "landing" and #main-content is display:none.
 * Yawm/Campus untouched. Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_LANDING_UNFREEZE_V1__) return;
  w.__CLARITY_LANDING_UNFREEZE_V1__ = true;

  var KEY = "clarity_shell_mode_v1";
  var PICK = "clarity_shell_user_pick_v1";

  function landEl() {
    return document.getElementById("clarity-day-landing") ||
      document.getElementById("clarity-day-landing-room") ||
      document.querySelector("[data-landing-root]");
  }

  function landUsable(el) {
    if (!el) return false;
    try {
      if (el.hidden) return false;
      var st = w.getComputedStyle(el);
      if (st.display === "none" || st.visibility === "hidden" || st.opacity === "0") return false;
      var r = el.getBoundingClientRect();
      return r.height > 24 && r.width > 24;
    } catch (e) {
      return !!(el && el.children && el.children.length);
    }
  }

  function mode() {
    var m = document.documentElement.getAttribute("data-shell-mode");
    if (m === "landing" || m === "companion") return m;
    try { m = localStorage.getItem(KEY); } catch (e) {}
    return m === "companion" ? "companion" : "landing";
  }

  function setCompanion() {
    try {
      document.documentElement.setAttribute("data-shell-mode", "companion");
      document.body && document.body.setAttribute("data-shell-mode", "companion");
      localStorage.setItem(KEY, "companion");
      sessionStorage.setItem(PICK, "1");
    } catch (e) {}
    try {
      if (w.ClarityShell && w.ClarityShell.setMode) w.ClarityShell.setMode("companion");
      else if (w.ClarityDayShell && w.ClarityDayShell.setMode) w.ClarityDayShell.setMode("companion");
    } catch (e2) {}
  }

  function revealMain() {
    var main = document.getElementById("main-content") || document.querySelector(".main-content");
    if (main) {
      main.hidden = false;
      main.removeAttribute("aria-hidden");
      main.style.setProperty("display", "block", "important");
      main.style.setProperty("visibility", "visible", "important");
      main.style.setProperty("opacity", "1", "important");
      main.style.removeProperty("pointer-events");
    }
    document.querySelectorAll(".shell-landing-hide, .gate-hidden").forEach(function (el) {
      el.classList.remove("shell-landing-hide", "gate-hidden");
      el.hidden = false;
      try {
        el.style.removeProperty("display");
        el.style.removeProperty("visibility");
        el.style.removeProperty("opacity");
        el.style.removeProperty("pointer-events");
        el.style.removeProperty("height");
        el.style.removeProperty("max-height");
      } catch (e) {}
    });
    /* Prefer reminder hub if none active */
    var panels = document.querySelectorAll("#main-content .tab-panel");
    var any = false;
    panels.forEach(function (p) {
      if (p.classList.contains("active") && !p.hidden) any = true;
    });
    if (!any && panels.length) {
      var rem = document.getElementById("tab-reminder") || panels[0];
      panels.forEach(function (p) {
        var on = p === rem;
        p.classList.toggle("active", on);
        p.hidden = !on;
        p.setAttribute("aria-hidden", on ? "false" : "true");
        if (on) {
          p.style.setProperty("display", "block", "important");
          p.style.setProperty("visibility", "visible", "important");
        }
      });
    }
    try {
      document.body.style.removeProperty("pointer-events");
      document.documentElement.style.removeProperty("pointer-events");
      document.body.style.removeProperty("overflow");
    } catch (e3) {}
  }

  function killStaleGates() {
    ["landing-gate-screen", "clarity-gate-overlay", "gate-screen"].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("pointer-events", "none", "important");
      el.setAttribute("aria-hidden", "true");
      el.hidden = true;
    });
  }

  function ensurePathPills() {
    if (document.getElementById("clarity-path-pills")) return;
    var nav = document.createElement("nav");
    nav.id = "clarity-path-pills";
    nav.setAttribute("aria-label", "Path pills");
    nav.innerHTML =
      '<a class="cpp-pill cpp-primary" href="/daily/" title="Isolated Daily surface">Daily page</a>' +
      '<button type="button" class="cpp-pill" data-unfreeze="companion">Companion</button>' +
      '<a class="cpp-pill cpp-ghost" href="/campus/">Campus</a>';
    if (!document.getElementById("cpp-unfreeze-css")) {
      var s = document.createElement("style");
      s.id = "cpp-unfreeze-css";
      s.textContent =
        "#clarity-path-pills{display:flex;flex-wrap:nowrap;gap:0.4rem;justify-content:center;padding:0.45rem 0.65rem;overflow-x:auto;}" +
        "#clarity-path-pills .cpp-pill{border-radius:999px;padding:0.42rem 0.95rem;font-weight:700;font-size:0.82rem;" +
        "border:1.5px solid rgba(201,168,76,0.45);background:rgba(13,79,60,0.35);color:#f3e6c0;text-decoration:none;cursor:pointer;}" +
        "#clarity-path-pills .cpp-primary{background:linear-gradient(135deg,#1a5c45,#0d4f3c);border-color:rgba(212,180,90,0.65);}";
      document.head.appendChild(s);
    }
    nav.addEventListener("click", function (ev) {
      var t = ev.target && ev.target.closest && ev.target.closest("[data-unfreeze]");
      if (!t) return;
      setCompanion();
      revealMain();
    });
    var duo = document.getElementById("clarity-top-duo") || document.querySelector("header") || document.body;
    if (duo && duo.parentNode) duo.parentNode.insertBefore(nav, duo.nextSibling);
    else document.body.insertBefore(nav, document.body.firstChild);
  }

  function heal() {
    killStaleGates();
    var m = mode();
    var land = landEl();
    var ok = landUsable(land);

    /* Core freeze: landing mode, main hidden, no usable day landing */
    if (m === "landing" && !ok) {
      setCompanion();
      revealMain();
    } else if (m === "companion") {
      revealMain();
    } else if (m === "landing" && ok) {
      /* Landing present — keep it, but never leave body non-interactive */
      try {
        document.body.style.removeProperty("pointer-events");
      } catch (e) {}
    }

    ensurePathPills();
  }

  function boot() {
    try { heal(); } catch (e) {}
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    boot();
    setTimeout(boot, 300);
    setTimeout(boot, 1200);
    setTimeout(boot, 2800);
  });

  /* If shell re-hides main later, heal again */
  try {
    new MutationObserver(function () {
      var main = document.getElementById("main-content");
      if (!main) return;
      var m = mode();
      var land = landEl();
      if (m === "landing" && !landUsable(land)) {
        if (main.style.display === "none" || main.getAttribute("aria-hidden") === "true") boot();
      }
    }).observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ["style", "hidden", "aria-hidden", "data-shell-mode", "class"] });
  } catch (eObs) {}
})(typeof window !== "undefined" ? window : this);
