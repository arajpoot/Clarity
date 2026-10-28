/**
 * Clarity URL Shell · 20261028URLSHELL
 * Single owner of mode. URL is source of truth.
 *   ?shell=day | ?shell=companion
 *   #shell=day | #shell=companion | #companion | #day
 * Refresh keeps the section. No first-visit force war.
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_URL_SHELL__) return;
  w.__CLARITY_URL_SHELL__ = true;
  w.__CLARITY_SHELL_V3__ = true; /* legacy guards */

  var KEY = "clarity_shell_mode_v1";

  function parseUrl() {
    try {
      var q = new URLSearchParams(w.location.search || "");
      var s = (q.get("shell") || "").toLowerCase();
      if (s === "day" || s === "landing") return "day";
      if (s === "companion" || s === "main") return "companion";
    } catch (e) {}
    try {
      var h = (w.location.hash || "").toLowerCase();
      if (h === "#shell=day" || h === "#day" || h === "#landing") return "day";
      if (h === "#shell=companion" || h === "#companion" || h === "#reminder" || h === "#main") return "companion";
    } catch (e2) {}
    return null;
  }

  function writeUrl(m) {
    try {
      var u = new URL(w.location.href);
      u.searchParams.set("shell", m === "companion" ? "companion" : "day");
      /* keep hash if not a shell hash */
      var h = (u.hash || "").toLowerCase();
      if (h === "#shell=day" || h === "#shell=companion" || h === "#day" || h === "#landing" || h === "#companion") {
        u.hash = "";
      }
      w.history.replaceState(null, "", u.pathname + u.search + (u.hash || ""));
    } catch (e) {}
  }

  function mode() {
    var fromUrl = parseUrl();
    if (fromUrl) return fromUrl;
    try {
      var m = localStorage.getItem(KEY);
      if (m === "companion") return "companion";
      if (m === "landing" || m === "day") return "day";
    } catch (e) {}
    return "day";
  }

  function setMode(m) {
    if (m === "landing") m = "day";
    if (m !== "day" && m !== "companion") return;
    try { localStorage.setItem(KEY, m === "day" ? "landing" : "companion"); } catch (e) {}
    try { sessionStorage.setItem("clarity_shell_user_pick_v1", "1"); } catch (e2) {}
    writeUrl(m);
    apply();
  }

  function injectCss() {
    if (document.getElementById("clarity-url-shell-css")) return;
    var s = document.createElement("style");
    s.id = "clarity-url-shell-css";
    s.textContent = [
      "#clarity-reopen-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:0.4rem;",
      "width:100%;box-sizing:border-box;margin:0.35rem 0 0.5rem;padding:0.4rem 0.65rem;border-radius:14px;",
      "border:1px solid rgba(15,76,58,0.22);background:linear-gradient(135deg,rgba(15,76,58,0.14),rgba(15,76,58,0.05));position:relative;z-index:40;}",
      "#clarity-reopen-bar .crb-btn{border:none;border-radius:999px;padding:0.35rem 0.8rem;font-weight:700;cursor:pointer;font-size:0.8rem;}",
      "#clarity-reopen-bar .crb-btn.crb-on{background:linear-gradient(135deg,#c9a227,#e0b93a);color:#1a1408;}",
      "#clarity-reopen-bar .crb-btn.crb-off{background:transparent;border:1px solid rgba(15,76,58,0.35);color:inherit;}",
      /* Day */
      'html[data-shell-mode="day"] #clarity-day-landing-room,html[data-shell-mode="landing"] #clarity-day-landing-room{display:block!important;visibility:visible!important;}',
      'html[data-shell-mode="day"] #main-content,html[data-shell-mode="landing"] #main-content{display:none!important;}',
      'html[data-shell-mode="day"] #clarity-door-rail,html[data-shell-mode="landing"] #clarity-door-rail,',
      'html[data-shell-mode="day"] .door-rail-bottom,html[data-shell-mode="landing"] .door-rail-bottom{display:none!important;height:0!important;}',
      'html[data-shell-mode="day"] #clarity-dual-path,html[data-shell-mode="landing"] #clarity-dual-path,',
      'html[data-shell-mode="day"] #clarity-provision-home,html[data-shell-mode="landing"] #clarity-provision-home{display:none!important;height:0!important;min-height:0!important;}',
      /* TRACK off on Day — specificity beats aux-pack */
      'html[data-shell-mode="day"] .clarity-gate-switcher,html[data-shell-mode="landing"] .clarity-gate-switcher,',
      'html[data-shell-mode="day"] .cgp-track-plaque,html[data-shell-mode="landing"] .cgp-track-plaque,',
      'html[data-shell-mode="day"] .rrra-sitewide,html[data-shell-mode="landing"] .rrra-sitewide{',
      "display:none!important;visibility:hidden!important;height:0!important;min-height:0!important;overflow:hidden!important;",
      "margin:0!important;padding:0!important;opacity:0!important;pointer-events:none!important;position:absolute!important;left:-9999px!important;}",
      /* Companion */
      'html[data-shell-mode="companion"] #clarity-day-landing-room{display:none!important;visibility:hidden!important;}',
      'html[data-shell-mode="companion"] #main-content{display:block!important;visibility:visible!important;}',
      'html[data-shell-mode="companion"] #clarity-door-rail,html[data-shell-mode="companion"] .door-rail-bottom{display:flex!important;visibility:visible!important;height:auto!important;}',
      'html[data-shell-mode="companion"] #clarity-dual-path,html[data-shell-mode="companion"] #clarity-provision-home{display:none!important;}',
      /* 4-path TRACK tiles — Companion only */
      'html[data-shell-mode="companion"] .clarity-gate-switcher,html[data-shell-mode="companion"] .cgp-track-plaque{',
      "display:flex!important;visibility:visible!important;height:auto!important;min-height:2.75rem!important;",
      "position:relative!important;left:auto!important;opacity:1!important;pointer-events:auto!important;",
      "flex-wrap:wrap;align-items:center;justify-content:center;gap:0.35rem;",
      "margin:0.45rem 0.5rem 0.65rem;padding:0.5rem 0.65rem;border-radius:14px;",
      "border:1px solid rgba(15,76,58,0.22);background:linear-gradient(135deg,rgba(15,76,58,0.12),rgba(15,76,58,0.04));}"
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
        '<button type="button" class="crb-btn" data-shell="day">Day landing</button>' +
        '<button type="button" class="crb-btn" data-shell="companion">Companion path</button>' +
        '<span style="font-size:0.72rem;opacity:0.75;margin-left:0.35rem">URL keeps your place on refresh</span>';
      var banner = document.querySelector(".banner");
      if (banner && banner.parentNode) banner.parentNode.insertBefore(bar, banner.nextSibling);
      else document.body.insertBefore(bar, document.body.firstChild);
      bar.addEventListener("click", function (ev) {
        var t = ev.target.closest("[data-shell]");
        if (!t) return;
        setMode(t.getAttribute("data-shell"));
      });
    }
    var m = mode();
    bar.querySelectorAll("[data-shell]").forEach(function (btn) {
      var on = btn.getAttribute("data-shell") === m;
      btn.classList.toggle("crb-on", on);
      btn.classList.toggle("crb-off", !on);
    });
  }

  function apply() {
    injectCss();
    var m = mode();
    /* sync attribute — both day and legacy landing for old CSS */
    try {
      document.documentElement.setAttribute("data-shell-mode", m === "day" ? "day" : "companion");
      /* also set landing alias for any leftover CSS */
      if (m === "day") document.documentElement.setAttribute("data-shell-mode", "day");
    } catch (e) {}
    ensurePlaque();

    var dayRoom = document.getElementById("clarity-day-landing-room");
    var main = document.getElementById("main-content");

    if (dayRoom) {
      if (m === "day") {
        dayRoom.hidden = false;
        dayRoom.removeAttribute("hidden");
        dayRoom.style.setProperty("display", "block", "important");
        dayRoom.style.setProperty("visibility", "visible", "important");
        /* allow fill once */
        try {
          if (w.ClarityDayRoom && typeof w.ClarityDayRoom.fill === "function") {
            var inner = dayRoom.querySelector(".day-room-inner");
            if (inner && !inner.children.length) w.ClarityDayRoom.fill();
          }
        } catch (e) {}
      } else {
        dayRoom.hidden = true;
        dayRoom.setAttribute("hidden", "");
        dayRoom.style.setProperty("display", "none", "important");
      }
    }
    if (main) {
      if (m === "day") {
        main.style.setProperty("display", "none", "important");
        main.setAttribute("aria-hidden", "true");
      } else {
        main.style.setProperty("display", "block", "important");
        main.style.setProperty("visibility", "visible", "important");
        main.removeAttribute("aria-hidden");
      }
    }

    /* TRACK: suppress on day only */
    document.querySelectorAll(".clarity-gate-switcher,.cgp-track-plaque,.rrra-sitewide").forEach(function (el) {
      if (m === "day") {
        el.style.setProperty("display", "none", "important");
        el.setAttribute("hidden", "");
      } else {
        el.style.setProperty("display", "flex", "important");
        el.removeAttribute("hidden");
      }
    });
  }

  /* Boot: URL wins; if no URL param, restore last mode into URL so refresh sticks */
  (function bootMode() {
    var fromUrl = parseUrl();
    var m = fromUrl || mode();
    try { localStorage.setItem(KEY, m === "day" ? "landing" : "companion"); } catch (e) {}
    if (!fromUrl) writeUrl(m);
    try { document.documentElement.setAttribute("data-shell-mode", m); } catch (e2) {}
  })();

  w.ClarityShell = {
    mode: function () { return mode() === "day" ? "landing" : "companion"; },
    setMode: function (m) {
      if (m === "landing") m = "day";
      setMode(m);
    },
    apply: apply,
    rawMode: mode
  };

  function boot() { apply(); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 20); });
  } else setTimeout(boot, 20);
  w.addEventListener("load", function () { setTimeout(apply, 80); });
  w.addEventListener("popstate", function () { apply(); });
})(typeof window !== "undefined" ? window : this);
