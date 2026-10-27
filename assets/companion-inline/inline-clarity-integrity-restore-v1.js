/**
 * Clarity Integrity Restore 20261027IR1
 * Stops layout thrash · one visibility pass · safe shell modes
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_INTEGRITY_RESTORE_V1__) return;
  w.__CLARITY_INTEGRITY_RESTORE_V1__ = true;

  try {
    if (w.__CLARITY_DLC_MO__ && w.__CLARITY_DLC_MO__.disconnect) w.__CLARITY_DLC_MO__.disconnect();
  } catch (e) {}

  function mode() {
    try {
      var m = localStorage.getItem("clarity_shell_mode_v1");
      if (m === "landing" || m === "companion") return m;
    } catch (e) {}
    return "landing";
  }

  function injectCss() {
    var id = "clarity-integrity-restore-css";
    var s = document.getElementById(id);
    if (!s) {
      s = document.createElement("style");
      s.id = id;
      document.head.appendChild(s);
    }
    s.textContent = [
      'html[data-shell-mode="landing"] #main-content,',
      'html[data-shell-mode="landing"] #main-application-workspace,',
      'html[data-shell-mode="landing"] #clarity-door-rail{display:none!important;}',
      'html[data-shell-mode="landing"] #clarity-day-landing{',
      "display:block!important;visibility:visible!important;opacity:1!important;",
      "max-height:none!important;overflow:visible!important;}",
      'html[data-shell-mode="companion"] #main-content,',
      'html[data-shell-mode="companion"] #main-application-workspace{',
      "display:block!important;visibility:visible!important;opacity:1!important;",
      "height:auto!important;max-height:none!important;overflow:visible!important;}",
      'html[data-shell-mode="companion"] #clarity-door-rail{display:flex!important;visibility:visible!important;}',
      'html[data-shell-mode="companion"] #clarity-grave-path-strip,',
      'html[data-shell-mode="companion"] .grave-path-strip{',
      "display:block!important;width:100%!important;max-width:100%!important;box-sizing:border-box!important;}",
      'html[data-shell-mode="landing"] #clarity-grave-path-strip{display:none!important;}',
      'html[data-shell-mode="landing"] [data-landing="paths"]{',
      "display:grid!important;grid-template-columns:1fr 1fr;gap:0.5rem;",
      "width:100%;max-width:min(48rem,100%);margin:0.5rem auto;padding:0 0.75rem;box-sizing:border-box;}",
      "#clarity-day-first-strip{display:block!important;visibility:visible!important;",
      "width:100%;max-width:min(48rem,100%);margin:0.65rem auto;padding:0.9rem 1rem;box-sizing:border-box;}",
      "#hijri-cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;font-size:0.65rem;text-align:center;}",
      "#hijri-cal-grid .hc-today{background:rgba(201,162,39,0.35);font-weight:700;}"
    ].join("");
  }

  function applyVisibility() {
    var m = mode();
    try {
      document.documentElement.setAttribute("data-shell-mode", m);
      if (document.body) document.body.setAttribute("data-shell-mode", m);
    } catch (e) {}
    var main = document.getElementById("main-content");
    var day = document.getElementById("clarity-day-landing");
    var rail = document.getElementById("clarity-door-rail");
    if (m === "landing") {
      if (main) { main.style.setProperty("display", "none", "important"); main.setAttribute("aria-hidden", "true"); }
      if (day) { day.style.setProperty("display", "block", "important"); day.removeAttribute("aria-hidden"); }
      if (rail) rail.style.setProperty("display", "none", "important");
    } else {
      if (main) {
        main.style.setProperty("display", "block", "important");
        main.style.setProperty("visibility", "visible", "important");
        main.removeAttribute("aria-hidden");
        main.hidden = false;
      }
      if (rail) rail.style.setProperty("display", "flex", "important");
    }
  }

  function ensureDualAndVerse() {
    if (mode() !== "landing") return;
    var root = document.getElementById("clarity-day-landing");
    if (!root) return;
    var paths = root.querySelector('[data-landing="paths"]');
    if (!paths) {
      paths = document.createElement("div");
      paths.setAttribute("data-landing", "paths");
      paths.innerHTML =
        '<a class="dual-tile" href="#main-content" id="dual-path-companion"><strong>Companion path</strong><small>Reminder · Reality · Reflection · Action</small></a>' +
        '<a class="dual-tile" href="/campus/" id="dual-path-university" target="_blank" rel="noopener"><strong>University path</strong><small>Campus desk · educational</small></a>';
      root.insertBefore(paths, root.firstChild);
    }
    var comp = document.getElementById("dual-path-companion");
    if (comp && !comp.__irWired) {
      comp.__irWired = true;
      comp.addEventListener("click", function (ev) {
        ev.preventDefault();
        try {
          if (w.ClarityShell && w.ClarityShell.setMode) w.ClarityShell.setMode("companion");
          else {
            localStorage.setItem("clarity_shell_mode_v1", "companion");
            sessionStorage.setItem("clarity_shell_user_pick_v1", "1");
            document.documentElement.setAttribute("data-shell-mode", "companion");
            applyVisibility();
          }
        } catch (e) {}
      });
    }
    var strip = document.getElementById("clarity-day-first-strip");
    if (!strip) {
      strip = document.createElement("section");
      strip.id = "clarity-day-first-strip";
      strip.innerHTML =
        '<p class="df-ar" lang="ar" dir="rtl">يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ</p>' +
        '<p class="df-en">Seek help through patience and prayer. Indeed, Allah is with the patient.</p>' +
        '<p class="df-ref"><a href="https://quran.com/2/153" target="_blank" rel="noopener">Qurʾān 2:153</a> · educational only</p>';
    }
    if (paths && paths.parentNode && paths.nextSibling !== strip) {
      paths.parentNode.insertBefore(strip, paths.nextSibling);
    }
  }

  function lightHijri() {
    var grid = document.getElementById("hijri-cal-grid");
    if (!grid) return;
    try {
      var raw = localStorage.getItem("clarity_banner_salah_v1");
      var hijri = raw ? JSON.parse(raw).hijri : null;
      if (!hijri) return;
      var day = parseInt(hijri.day, 10) || 1;
      var heads = ["S","M","T","W","T","F","S"];
      var html = heads.map(function (h) { return '<span class="hc-cell hc-head">' + h + "</span>"; }).join("");
      for (var d = 1; d <= 30; d++) {
        html += '<span class="hc-cell' + (d === day ? " hc-today" : "") + '">' + d + "</span>";
      }
      grid.innerHTML = html;
    } catch (e) {}
  }

  var scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    setTimeout(function () {
      scheduled = false;
      injectCss();
      applyVisibility();
      ensureDualAndVerse();
      lightHijri();
    }, 80);
  }

  injectCss();
  applyVisibility();
  schedule();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", schedule);
  w.addEventListener("load", function () { schedule(); setTimeout(schedule, 500); });
  document.addEventListener("clarity:landing-ready", schedule);
  w.ClarityIntegrityRestore = { apply: schedule, mode: mode };
})(typeof window !== "undefined" ? window : this);
