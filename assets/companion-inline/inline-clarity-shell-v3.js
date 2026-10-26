/**
 * Clarity Shell v3.1 — single mode plaque under banner
 * One bar only: Companion ↔ Day landing. No double task bars.
 * Educational only — not a fatwa.
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

  function injectCss() {
    if (document.getElementById("clarity-shell-plaque-css")) return;
    var s = document.createElement("style");
    s.id = "clarity-shell-plaque-css";
    s.textContent = [
      "#clarity-reopen-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:0.4rem;",
      "  width:100%;max-width:100%;box-sizing:border-box;margin:0.35rem 0 0.5rem;padding:0.4rem 0.65rem;",
      "  border-radius:14px;border:1px solid rgba(15,76,58,0.22);",
      "  background:linear-gradient(135deg,rgba(15,76,58,0.14),rgba(15,76,58,0.05));}",
      "html[data-theme=dark] #clarity-reopen-bar,html[data-theme=night] #clarity-reopen-bar{",
      "  background:linear-gradient(135deg,rgba(212,180,90,0.1),rgba(12,28,22,0.7));border-color:rgba(212,180,90,0.22);}",
      "#clarity-reopen-bar .crb-ico{font-size:1.05rem;line-height:1;}",
      "#clarity-reopen-bar .crb-label{font-weight:800;font-size:0.78rem;letter-spacing:0.04em;text-transform:uppercase;opacity:0.85;}",
      "#clarity-reopen-bar .crb-btn{border:none;border-radius:999px;padding:0.32rem 0.75rem;font-weight:700;cursor:pointer;font-size:0.8rem;}",
      "#clarity-reopen-bar .crb-btn.crb-open{background:linear-gradient(135deg,#c9a227,#e0b93a);color:#1a1408;}",
      "#clarity-reopen-bar .crb-btn.crb-hide{background:linear-gradient(135deg,#0f4c3a,#1a6b52);color:#f7f3eb;}",
      "#clarity-reopen-bar .crb-btn.crb-comp{background:transparent;border:1px solid rgba(15,76,58,0.35);color:inherit;}",
      "html[data-theme=dark] #clarity-reopen-bar .crb-btn.crb-comp{border-color:rgba(212,180,90,0.35);}",
      "#clarity-reopen-bar .crb-hint{font-size:0.72rem;opacity:0.7;}",
      "#clarity-reopen-bar .crb-pill{font-size:0.72rem;font-weight:700;padding:0.18rem 0.5rem;border-radius:999px;",
      "  background:rgba(15,76,58,0.15);}",
      "html[data-theme=dark] #clarity-reopen-bar .crb-pill{background:rgba(212,180,90,0.12);}",
      "/* Hide duplicate bars */",
      "#clarity-visit-pill-bar,.clarity-visit-strip,#clarity-visit-strip,",
      ".visit-strip[data-day-landing],.day-landing-footer-bar{",
      "  display:none!important;}",
      ".shell-landing-hide{display:none!important;}",
      "/* Restore first-landing overview when marked */",
      "html[data-shell-mode=landing] #clarity-welcome,",
      "html[data-shell-mode=landing] #clarity-three-doors,",
      "html[data-shell-mode=landing] [data-landing-overview]{display:block!important;}"
    ].join("\n");
    (document.head || document.documentElement).appendChild(s);
  }

  function ensureRibbon() {
    var bar = document.getElementById("clarity-reopen-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "clarity-reopen-bar";
      bar.setAttribute("role", "toolbar");
      bar.setAttribute("aria-label", "Day landing and companion");
    }
    bar.setAttribute("data-landing", "pill");
    bar.innerHTML =
      '<span class="crb-ico" aria-hidden="true">🏠</span>' +
      '<span class="crb-pill" id="crb-mode-pill">Day landing</span>' +
      '<button type="button" class="crb-btn crb-open" data-crb="open">Open daily routines</button>' +
      '<button type="button" class="crb-btn crb-hide" data-crb="hide">Hide for now</button>' +
      '<button type="button" class="crb-btn crb-comp" data-crb="companion">Companion path</button>' +
      '<span class="crb-hint">One plaque · return anytime on this device</span>';

    // Place once: directly under banner (clarity-top-duo)
    var duo = document.getElementById("clarity-top-duo");
    var host = (duo && duo.parentNode) || document.body;
    if (bar.parentNode !== host || (duo && bar.previousSibling !== duo && bar.previousElementSibling !== duo)) {
      if (bar.parentNode) bar.parentNode.removeChild(bar);
      if (duo && duo.nextSibling) host.insertBefore(bar, duo.nextSibling);
      else if (duo) host.appendChild(bar);
      else host.insertBefore(bar, host.firstChild);
    }

    if (!bar._bound) {
      bar._bound = true;
      bar.addEventListener("click", function (ev) {
        var t = ev.target && ev.target.closest && ev.target.closest("[data-crb]");
        if (!t) return;
        var a = t.getAttribute("data-crb");
        if (a === "open") setMode("landing");
        else if (a === "hide" || a === "companion") setMode("companion");
      });
    }
    return bar;
  }

  function hideDuplicateBars() {
    try {
      ["clarity-visit-pill-bar", "clarity-visit-strip"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.style.setProperty("display", "none", "important");
      });
      document.querySelectorAll(".visit-strip, .clarity-visit-strip, .day-landing-footer-bar").forEach(function (el) {
        if (el.id === "clarity-reopen-bar") return;
        el.style.setProperty("display", "none", "important");
      });
      // Remove any second #clarity-reopen-bar
      var bars = document.querySelectorAll("#clarity-reopen-bar");
      for (var i = 1; i < bars.length; i++) bars[i].remove();
    } catch (e) {}
  }

  function applyDoorRail(m) {
    try {
      var door = document.getElementById("clarity-door-rail") || document.querySelector(".door-rail");
      if (!door) return;
      if (m === "landing") door.style.setProperty("display", "none", "important");
      else door.style.removeProperty("display");
    } catch (e) {}
  }

  function apply() {
    injectCss();
    var m = mode();
    document.documentElement.setAttribute("data-shell-mode", m);
    try { document.body.setAttribute("data-shell-mode", m); } catch (e) {}
    var bar = ensureRibbon();
    hideDuplicateBars();

    var openBtn = bar.querySelector('[data-crb="open"]');
    var hideBtn = bar.querySelector('[data-crb="hide"]');
    var compBtn = bar.querySelector('[data-crb="companion"]');
    var pill = document.getElementById("crb-mode-pill");
    var land = document.getElementById("clarity-day-landing");

    if (m === "landing") {
      if (land) { land.hidden = false; land.style.removeProperty("display"); }
      if (openBtn) openBtn.style.display = "none";
      if (hideBtn) hideBtn.style.display = "";
      if (compBtn) compBtn.style.display = "";
      if (pill) pill.textContent = "Day landing";
      /* Day landing only through oath + study cards. Companion hubs via path tiles. */
      document.querySelectorAll("#main-content .tab-panel, #main-content .rrra-hub, #main-content .rrra-hub-hero").forEach(function (el) {
        el.classList.add("shell-landing-hide");
      });
    } else {
      if (land) { land.hidden = true; land.style.display = "none"; }
      if (openBtn) openBtn.style.display = "";
      if (hideBtn) hideBtn.style.display = "none";
      if (compBtn) compBtn.style.display = "none";
      if (pill) pill.textContent = "Companion";
      document.querySelectorAll(".shell-landing-hide").forEach(function (el) {
        el.classList.remove("shell-landing-hide");
      });
    }
    applyDoorRail(m);

    var main = document.getElementById("main-content") || document.querySelector(".main-content");
    if (main) {
      if (m === "landing") {
        main.style.setProperty("display", "none", "important");
        main.setAttribute("aria-hidden", "true");
      } else {
        main.style.setProperty("display", "block", "important");
        main.removeAttribute("aria-hidden");
      }
    }

    if (m === "companion" && typeof w.ClarityLoadCompanion === "function") {
      try { w.ClarityLoadCompanion(); } catch (e) {}
    }
  }

  w.ClarityShell = { mode: mode, setMode: setMode, apply: apply };

  function boot() { apply(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 40); });
  else setTimeout(boot, 40);
  w.addEventListener("load", function () { setTimeout(apply, 200); });
  document.addEventListener("clarity-core-ready", function () { setTimeout(apply, 120); });
})(typeof window !== "undefined" ? window : this);
