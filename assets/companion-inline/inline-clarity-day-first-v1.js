/**
 * Clarity Day-First v1 — 20261027DF2
 * First visit / new session → Day landing only.
 * First screen focus: āyah · next ṣalāh · one deed.
 * Companion path = one clear tap (shell bar). Campus untouched.
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_DAY_FIRST_V1__) return;
  w.__CLARITY_DAY_FIRST_V1__ = true;

  var KEY = "clarity_shell_mode_v1";
  var PICK = "clarity_shell_user_pick_v1";

  function forceLandingIfNeeded() {
    try {
      if (sessionStorage.getItem(PICK) === "1") return;
      localStorage.setItem(KEY, "landing");
      document.documentElement.setAttribute("data-shell-mode", "landing");
      try { document.body.setAttribute("data-shell-mode", "landing"); } catch (e) {}
    } catch (e) {}
  }

  function injectTightenCss() {
    if (document.getElementById("clarity-day-first-css")) return;
    var s = document.createElement("style");
    s.id = "clarity-day-first-css";
    s.textContent = [
      'html[data-shell-mode="landing"] #main-content,',
      'html[data-shell-mode="landing"] #main-application-workspace,',
      'html[data-shell-mode="landing"] #clarity-door-rail,',
      'html[data-shell-mode="landing"] .door-rail-bottom,',
      'html[data-shell-mode="landing"] .tab-panel.rrra-hub,',
      'html[data-shell-mode="landing"] #meme-studio-root{',
      "  display:none!important;visibility:hidden!important;}",
      'html[data-shell-mode="landing"] #clarity-day-landing,',
      'html[data-shell-mode="landing"] #clarity-reopen-bar,',
      'html[data-shell-mode="landing"] #clarity-day-first-strip{',
      "  display:block!important;visibility:visible!important;}",
      "#clarity-day-first-strip{max-width:min(36rem,100%);margin:0.5rem auto 0.75rem;padding:0.85rem 1rem;",
      "  border-radius:16px;border:1px solid rgba(15,76,58,0.25);",
      "  background:linear-gradient(160deg,rgba(15,76,58,0.08),rgba(255,252,245,0.95));box-sizing:border-box;}",
      "html[data-theme=dark] #clarity-day-first-strip,html[data-theme=night] #clarity-day-first-strip{",
      "  background:linear-gradient(160deg,rgba(12,28,22,0.9),rgba(15,40,32,0.85));border-color:rgba(212,180,90,0.28);}",
      "#clarity-day-first-strip .df-label{font-size:0.72rem;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;opacity:0.75;margin:0 0 0.35rem;}",
      "#clarity-day-first-strip .df-ar{font-size:1.25rem;line-height:1.7;direction:rtl;text-align:right;margin:0.25rem 0;font-family:Amiri,Traditional Arabic,serif;}",
      "#clarity-day-first-strip .df-en{font-size:0.92rem;line-height:1.45;margin:0.25rem 0 0.15rem;}",
      "#clarity-day-first-strip .df-ref{font-size:0.78rem;opacity:0.8;margin:0 0 0.65rem;}",
      "#clarity-day-first-strip .df-ref a{color:inherit;}",
      "#clarity-day-first-strip .df-grid{display:grid;gap:0.45rem;}",
      "#clarity-day-first-strip .df-tile{padding:0.55rem 0.7rem;border-radius:12px;border:1px solid rgba(15,76,58,0.18);font-size:0.88rem;}",
      "html[data-theme=dark] #clarity-day-first-strip .df-tile{border-color:rgba(212,180,90,0.2);}",
      "#clarity-day-first-strip .df-tile strong{display:block;font-size:0.72rem;text-transform:uppercase;letter-spacing:0.04em;opacity:0.75;margin-bottom:0.2rem;}",
      "#clarity-day-first-strip .df-cta{display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:0.65rem;}",
      "#clarity-day-first-strip .df-cta button{border:none;border-radius:999px;padding:0.4rem 0.9rem;font-weight:700;cursor:pointer;font-size:0.82rem;}",
      "#clarity-day-first-strip .df-cta .df-comp{background:linear-gradient(135deg,#0f4c3a,#1a6b52);color:#f7f3eb;}",
      "#clarity-day-first-strip .df-cta .df-note{font-size:0.72rem;opacity:0.75;align-self:center;}",
      'html[data-shell-mode="companion"] #clarity-day-first-strip{display:none!important;}'
    ].join("");
    document.head.appendChild(s);
  }

  function ensureStrip() {
    if (document.getElementById("clarity-day-first-strip")) return;
    var el = document.createElement("section");
    el.id = "clarity-day-first-strip";
    el.setAttribute("data-day-first", "1");
    el.setAttribute("aria-label", "Today — routines first");
    el.innerHTML =
      '<p class="df-label">Today · Day landing</p>' +
      '<p class="df-ar" lang="ar" dir="rtl">يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ</p>' +
      '<p class="df-en">O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.</p>' +
      '<p class="df-ref"><a href="https://quran.com/2/153" target="_blank" rel="noopener">Qurʾān 2:153</a> · Sahih International · educational only</p>' +
      '<div class="df-grid">' +
        '<div class="df-tile"><strong>Next ṣalāh</strong><span id="df-salah">See banner schedule · Day landing cards below</span></div>' +
        '<div class="df-tile"><strong>One deed</strong><span id="df-deed">Pray the next ṣalāh with presence — a light you send ahead.</span></div>' +
      "</div>" +
      '<div class="df-cta">' +
        '<button type="button" class="df-comp" id="df-open-companion">Companion path →</button>' +
        '<span class="df-note">Reminder · Reality · Reflection · Action · Amanah</span>' +
      "</div>";
    var top = document.getElementById("clarity-top-duo");
    if (top && top.parentNode) {
      if (top.nextSibling) top.parentNode.insertBefore(el, top.nextSibling);
      else top.parentNode.appendChild(el);
    } else {
      var main = document.getElementById("main-content");
      if (main && main.parentNode) main.parentNode.insertBefore(el, main);
      else document.body.insertBefore(el, document.body.firstChild);
    }
    var btn = document.getElementById("df-open-companion");
    if (btn) {
      btn.addEventListener("click", function () {
        try {
          if (w.ClarityShell && typeof w.ClarityShell.setMode === "function") {
            w.ClarityShell.setMode("companion");
          } else {
            sessionStorage.setItem(PICK, "1");
            localStorage.setItem(KEY, "companion");
            document.documentElement.setAttribute("data-shell-mode", "companion");
          }
        } catch (e) {}
      });
    }
  }

  function run() {
    forceLandingIfNeeded();
    injectTightenCss();
    try {
      var m = localStorage.getItem(KEY) || "landing";
      if (sessionStorage.getItem(PICK) !== "1") m = "landing";
      if (m === "landing") ensureStrip();
    } catch (e) { ensureStrip(); }
    if (w.ClarityShell && typeof w.ClarityShell.apply === "function") {
      try { w.ClarityShell.apply(); } catch (e2) {}
    }
  }

  forceLandingIfNeeded();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(run, 30); });
  } else setTimeout(run, 30);
  w.addEventListener("load", function () { setTimeout(run, 150); });
})(typeof window !== "undefined" ? window : this);
