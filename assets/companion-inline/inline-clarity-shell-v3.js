/**
 * Clarity Shell RECOVERY · 20261027RECOVERY
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_SHELL_RECOVERY__) return;
  w.__CLARITY_SHELL_RECOVERY__ = true;
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
    try { sessionStorage.setItem("clarity_shell_user_pick_v1", "1"); } catch (e2) {}
    apply();
  }
  function injectCss() {
    if (document.getElementById("clarity-shell-rec-css")) return;
    var s = document.createElement("style");
    s.id = "clarity-shell-rec-css";
    s.textContent = [
      "#clarity-reopen-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:0.4rem;width:100%;box-sizing:border-box;margin:0.35rem 0 0.5rem;padding:0.4rem 0.65rem;border-radius:14px;border:1px solid rgba(15,76,58,0.22);background:linear-gradient(135deg,rgba(15,76,58,0.14),rgba(15,76,58,0.05));}",
      "#clarity-reopen-bar .crb-btn{border:none;border-radius:999px;padding:0.32rem 0.75rem;font-weight:700;cursor:pointer;font-size:0.8rem;}",
      "#clarity-reopen-bar .crb-btn.crb-open{background:linear-gradient(135deg,#c9a227,#e0b93a);color:#1a1408;}",
      "#clarity-reopen-bar .crb-btn.crb-hide{background:linear-gradient(135deg,#0f4c3a,#1a6b52);color:#f7f3eb;}",
      "#clarity-reopen-bar .crb-btn.crb-comp{background:transparent;border:1px solid rgba(15,76,58,0.35);color:inherit;}",
      'html[data-shell-mode="landing"] #clarity-day-landing-room{display:block!important;}',
      'html[data-shell-mode="landing"] #main-content{display:none!important;}',
      'html[data-shell-mode="companion"] #clarity-day-landing-room{display:none!important;}',
      'html[data-shell-mode="companion"] #main-content{display:block!important;visibility:visible!important;}',
      'html[data-shell-mode="landing"] #clarity-grave-path-strip,html[data-shell-mode="landing"] .grave-path-strip{display:none!important;height:0!important;overflow:hidden!important;}'
    ].join("");
    document.head.appendChild(s);
  }
  function ensurePlaque() {
    if (document.getElementById("clarity-reopen-bar")) return;
    var bar = document.createElement("div");
    bar.id = "clarity-reopen-bar";
    bar.innerHTML = '<button type="button" class="crb-btn crb-open" data-crb="landing">Day landing</button>' +
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
  function apply() {
    injectCss();
    ensurePlaque();
    var m = mode();
    try { document.documentElement.setAttribute("data-shell-mode", m); } catch (e) {}
    var dayRoom = document.getElementById("clarity-day-landing-room");
    var main = document.getElementById("main-content");
    if (dayRoom) {
      dayRoom.hidden = m !== "landing";
      dayRoom.style.setProperty("display", m === "landing" ? "block" : "none", "important");
    }
    if (main) {
      if (m === "landing") {
        main.style.setProperty("display", "none", "important");
        main.setAttribute("aria-hidden", "true");
      } else {
        main.style.setProperty("display", "block", "important");
        main.style.setProperty("visibility", "visible", "important");
        main.removeAttribute("aria-hidden");
      }
    }
  }
  try {
    if (sessionStorage.getItem("clarity_shell_user_pick_v1") !== "1") {
      localStorage.setItem(KEY, "landing");
      document.documentElement.setAttribute("data-shell-mode", "landing");
    }
  } catch (e) {}
  w.ClarityShell = { mode: mode, setMode: setMode, apply: apply };
  function boot() { apply(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 30); });
  else setTimeout(boot, 30);
  w.addEventListener("load", function () { setTimeout(apply, 150); });
})(typeof window !== "undefined" ? window : this);
