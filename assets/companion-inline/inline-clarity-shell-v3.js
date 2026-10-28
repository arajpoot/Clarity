/**
 * Clarity Shell DAYFIX · 20261027DAYFIX
 * Banner stays untouched. Door: Day room ↔ Companion main.
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  /* allow re-bind over RECOVERY */
  w.__CLARITY_SHELL_RECOVERY__ = true;
  if (w.__CLARITY_SHELL_DAYFIX__) return;
  w.__CLARITY_SHELL_DAYFIX__ = true;
  w.__CLARITY_SHELL_V3__ = true;

  var KEY = "clarity_shell_mode_v1";
  var PICK = "clarity_shell_user_pick_v1";

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
    try { sessionStorage.setItem(PICK, "1"); } catch (e2) {}
    apply();
  }

  function injectCss() {
    var old = document.getElementById("clarity-shell-rec-css");
    if (old) old.remove();
    if (document.getElementById("clarity-shell-dayfix-css")) return;
    var s = document.createElement("style");
    s.id = "clarity-shell-dayfix-css";
    s.textContent = [
      "#clarity-reopen-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:0.4rem;",
      "width:100%;box-sizing:border-box;margin:0.35rem 0 0.55rem;padding:0.45rem 0.65rem;border-radius:14px;",
      "border:1px solid rgba(15,76,58,0.22);background:linear-gradient(135deg,rgba(15,76,58,0.14),rgba(15,76,58,0.05));position:relative;z-index:30;}",
      "html[data-theme=dark] #clarity-reopen-bar,html[data-theme=night] #clarity-reopen-bar{",
      "background:linear-gradient(135deg,rgba(212,180,90,0.1),rgba(12,28,22,0.75));border-color:rgba(212,180,90,0.25);}",
      "#clarity-reopen-bar .crb-btn{border:none;border-radius:999px;padding:0.35rem 0.8rem;font-weight:700;cursor:pointer;font-size:0.8rem;}",
      "#clarity-reopen-bar .crb-btn.crb-open{background:linear-gradient(135deg,#c9a227,#e0b93a);color:#1a1408;}",
      "#clarity-reopen-bar .crb-btn.crb-hide{background:linear-gradient(135deg,#0f4c3a,#1a6b52);color:#f7f3eb;}",
      "#clarity-reopen-bar .crb-btn.crb-comp{background:transparent;border:1px solid rgba(15,76,58,0.35);color:inherit;}",
      /* Day room vs main — decisive */
      'html[data-shell-mode="landing"] #clarity-day-landing-room{display:block!important;visibility:visible!important;opacity:1!important;position:relative;z-index:5;}',
      'html[data-shell-mode="landing"] #main-content{display:none!important;visibility:hidden!important;}',
      'html[data-shell-mode="landing"] #main-application-workspace > #main-content{display:none!important;}',
      'html[data-shell-mode="companion"] #clarity-day-landing-room{display:none!important;visibility:hidden!important;}',
      'html[data-shell-mode="companion"] #main-content{display:block!important;visibility:visible!important;opacity:1!important;}',
      /* Hide legacy dual path OUTSIDE day room on landing */
      'html[data-shell-mode="landing"] #main-content .dual-tiles,',
      'html[data-shell-mode="landing"] #main-application-workspace .dual-tiles:not(#clarity-day-landing-room .dual-tiles){display:none!important;}',
      
      /* HK1: Do this today (provision) → Day landing only */
      'html[data-shell-mode="companion"] #clarity-provision-home,',
      'html[data-shell-mode="companion"] .clarity-provision-home,',
      'html[data-shell-mode="companion"] #clarity-visit-pill-bar,',
      'html[data-shell-mode="companion"] .cph-card.cph-provision{',
      "display:none!important;visibility:hidden!important;height:0!important;overflow:hidden!important;margin:0!important;padding:0!important;}",
      'html[data-shell-mode="landing"] #clarity-provision-home,',
      'html[data-shell-mode="landing"] .clarity-provision-home{',
      "display:none!important;}",  /* Day room owns "do this today" — avoid double */
      /* HK1: Track bar + phased learning → Companion only */
      'html[data-shell-mode="landing"] .clarity-gate-switcher,',
      'html[data-shell-mode="landing"] .rrra-sitewide,',
      'html[data-shell-mode="landing"] [aria-label*="Learning track"],',
      'html[data-shell-mode="landing"] [aria-label*="Phased learning"],',
      'html[data-shell-mode="landing"] .cgs-label,',
      'html[data-shell-mode="landing"] #clarity-visit-pill-bar{',
      "display:none!important;visibility:hidden!important;height:0!important;overflow:hidden!important;}",
      'html[data-shell-mode="companion"] .clarity-gate-switcher.rrra-sitewide{',
      "display:flex!important;visibility:visible!important;height:auto!important;}",
      /* HK1: Bottom RRRA door rail → Companion only */
      'html[data-shell-mode="landing"] #clarity-door-rail,',
      'html[data-shell-mode="landing"] .door-rail-bottom,',
      'html[data-shell-mode="landing"] .door-rail-rrra5{',
      "display:none!important;visibility:hidden!important;height:0!important;max-height:0!important;overflow:hidden!important;pointer-events:none!important;}",
      'html[data-shell-mode="companion"] #clarity-door-rail,',
      'html[data-shell-mode="companion"] .door-rail-bottom{',
      "display:flex!important;visibility:visible!important;height:auto!important;max-height:none!important;pointer-events:auto!important;}",

      'html[data-shell-mode="landing"] #clarity-grave-path-strip,',
      'html[data-shell-mode="landing"] .grave-path-strip{display:none!important;height:0!important;overflow:hidden!important;margin:0!important;padding:0!important;}'
    ].join("");
    document.head.appendChild(s);
  }

  function ensurePlaque() {
    var bar = document.getElementById("clarity-reopen-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "clarity-reopen-bar";
      bar.setAttribute("role", "navigation");
      bar.innerHTML =
        '<button type="button" class="crb-btn crb-open" data-crb="landing">Day landing</button>' +
        '<button type="button" class="crb-btn crb-hide" data-crb="hide">Hide for now</button>' +
        '<button type="button" class="crb-btn crb-comp" data-crb="companion">Companion path</button>' +
        '<span style="font-size:0.72rem;opacity:0.75;margin-left:0.35rem">One plaque · this device</span>';
      var banner = document.querySelector(".banner");
      if (banner && banner.parentNode) banner.parentNode.insertBefore(bar, banner.nextSibling);
      else document.body.insertBefore(bar, document.body.firstChild);
      bar.addEventListener("click", function (ev) {
        var t = ev.target.closest("[data-crb]");
        if (!t) return;
        var a = t.getAttribute("data-crb");
        if (a === "landing") setMode("landing");
        else setMode("companion");
      });
    }
  }

  function apply() {
    injectCss();
    ensurePlaque();
    var m = mode();
    try { document.documentElement.setAttribute("data-shell-mode", m); } catch (e) {}

    var dayRoom = document.getElementById("clarity-day-landing-room");
    var main = document.getElementById("main-content");

    if (dayRoom) {
      if (m === "landing") {
        dayRoom.hidden = false;
        dayRoom.removeAttribute("hidden");
        dayRoom.style.setProperty("display", "block", "important");
        dayRoom.style.setProperty("visibility", "visible", "important");
        dayRoom.setAttribute("aria-hidden", "false");
      } else {
        dayRoom.hidden = true;
        dayRoom.style.setProperty("display", "none", "important");
        dayRoom.setAttribute("aria-hidden", "true");
      }
    }
    if (main) {
      if (m === "landing") {
        main.style.setProperty("display", "none", "important");
        main.setAttribute("aria-hidden", "true");
      } else {
        main.style.setProperty("display", "block", "important");
        main.style.setProperty("visibility", "visible", "important");
        main.removeAttribute("aria-hidden");
        main.hidden = false;
      }
    }
    /* refill day room if empty */
    if (m === "landing" && dayRoom) {
      var inner = dayRoom.querySelector(".day-room-inner");
      if (inner && !inner.children.length && w.ClarityDayRoom && typeof w.ClarityDayRoom.fill === "function") {
        try { w.ClarityDayRoom.fill(); } catch (e) {}
      }
    }
  }

  /* First visit this session → Day landing */
  try {
    if (sessionStorage.getItem(PICK) !== "1") {
      localStorage.setItem(KEY, "landing");
      document.documentElement.setAttribute("data-shell-mode", "landing");
    }
  } catch (e) {}

  w.ClarityShell = { mode: mode, setMode: setMode, apply: apply };

  function boot() { apply(); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 20); });
  } else setTimeout(boot, 20);
  w.addEventListener("load", function () { setTimeout(apply, 100); setTimeout(apply, 400); });
  document.addEventListener("clarity:day-room-ready", function () { setTimeout(apply, 30); });
})(typeof window !== "undefined" ? window : this);
