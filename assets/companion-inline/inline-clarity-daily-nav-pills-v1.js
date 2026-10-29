/**
 * Clarity · Daily nav pills v1
 * Streamlines Day landing / Daily page / Companion / Campus into one aligned pill row.
 * Daily page → /daily/ (isolated surface). Educational only — not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_DAILY_NAV_PILLS_V1__) return;
  g.__CLARITY_DAILY_NAV_PILLS_V1__ = true;

  var STYLE_ID = "clarity-daily-nav-pills-css";
  var BAR_ID = "clarity-path-pills";

  function injectCss() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = [
      "#" + BAR_ID + "{",
      "display:flex;flex-wrap:nowrap;align-items:center;justify-content:center;",
      "gap:0.4rem;padding:0.45rem 0.65rem;margin:0.35rem auto 0.5rem;",
      "max-width:52rem;width:100%;box-sizing:border-box;",
      "overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;",
      "}",
      "#" + BAR_ID + "::-webkit-scrollbar{display:none}",
      "#" + BAR_ID + " .cpp-pill{",
      "display:inline-flex;align-items:center;justify-content:center;gap:0.35rem;",
      "flex:0 0 auto;white-space:nowrap;",
      "border-radius:999px;padding:0.42rem 0.95rem;",
      "font-size:0.82rem;font-weight:700;letter-spacing:0.01em;",
      "text-decoration:none;border:1.5px solid rgba(201,168,76,0.45);",
      "background:rgba(13,79,60,0.35);color:#f3e6c0;",
      "box-shadow:inset 0 1px 0 rgba(255,255,255,0.06);",
      "cursor:pointer;line-height:1.2;min-height:2.15rem;",
      "transition:border-color .15s,background .15s,transform .12s;",
      "}",
      "#" + BAR_ID + " .cpp-pill:hover{border-color:#d4b45a;transform:translateY(-1px)}",
      "#" + BAR_ID + " .cpp-pill.cpp-primary{",
      "background:linear-gradient(135deg,#1a5c45 0%,#0d4f3c 55%,#0a3a30 100%);",
      "border-color:rgba(212,180,90,0.65);color:#f5e6b8;",
      "box-shadow:0 2px 10px rgba(0,0,0,0.25),inset 0 1px 0 rgba(240,215,140,0.12);",
      "}",
      "#" + BAR_ID + " .cpp-pill.cpp-active{",
      "background:rgba(212,180,90,0.2);border-color:#d4b45a;color:#f0d78c;",
      "}",
      "#" + BAR_ID + " .cpp-pill.cpp-ghost{",
      "background:transparent;opacity:0.92;",
      "}",
      "html[data-theme=light] #" + BAR_ID + " .cpp-pill{",
      "background:#fffdf8;color:#1a5c45;border-color:rgba(154,123,47,0.45);",
      "}",
      "html[data-theme=light] #" + BAR_ID + " .cpp-pill.cpp-primary{",
      "background:linear-gradient(135deg,#1a5c45,#0d4f3c);color:#f5e6b8;",
      "}",
      /* Hide legacy messy strip controls we replace */
      "#clarity-reopen-bar .crb-hint,",
      "#clarity-reopen-bar a[href*='daily'],",
      "a.open-daily-page,.open-daily-page{display:none!important}",
      "@media (max-width:520px){",
      "#" + BAR_ID + "{justify-content:flex-start;padding-left:0.5rem;padding-right:0.5rem}",
      "#" + BAR_ID + " .cpp-pill{padding:0.4rem 0.8rem;font-size:0.78rem}",
      "}"
    ].join("");
    document.head.appendChild(s);
  }

  function setShell(mode) {
    try {
      if (g.ClarityDayShell && g.ClarityDayShell.setMode) {
        g.ClarityDayShell.setMode(mode);
        return;
      }
    } catch (e) {}
    try {
      if (g.ClarityShell && g.ClarityShell.setMode) {
        g.ClarityShell.setMode(mode);
        return;
      }
    } catch (e) {}
    document.documentElement.setAttribute("data-shell-mode", mode);
    try { localStorage.setItem("clarity_shell_mode_v1", mode); } catch (e) {}
  }

  function currentShell() {
    var m = document.documentElement.getAttribute("data-shell-mode");
    if (m === "landing" || m === "companion") return m;
    try { m = localStorage.getItem("clarity_shell_mode_v1"); } catch (e) {}
    return m === "companion" ? "companion" : "landing";
  }

  function buildBar() {
    injectCss();
    var bar = document.getElementById(BAR_ID);
    if (!bar) {
      bar = document.createElement("nav");
      bar.id = BAR_ID;
      bar.setAttribute("aria-label", "Path pills");
    }

    var shell = currentShell();
    bar.innerHTML = "";

    function pill(tag, opts) {
      var el = document.createElement(tag);
      el.className = "cpp-pill" + (opts.primary ? " cpp-primary" : "") +
        (opts.active ? " cpp-active" : "") + (opts.ghost ? " cpp-ghost" : "");
      if (opts.href) {
        el.href = opts.href;
      } else {
        el.type = "button";
      }
      el.textContent = opts.label;
      if (opts.title) el.title = opts.title;
      if (opts.onClick) el.addEventListener("click", opts.onClick);
      bar.appendChild(el);
      return el;
    }

    /* Day landing = on-page plaque mode */
    pill("button", {
      label: "Day landing",
      active: shell === "landing",
      title: "Show day plaque on this page",
      onClick: function (ev) {
        ev.preventDefault();
        setShell("landing");
        paintActive();
      }
    });

    /* Daily page = isolated /daily/ surface (Campus pattern) */
    pill("a", {
      label: "Daily page",
      primary: true,
      href: "/daily/",
      title: "Open isolated Daily surface — furnish your grave"
    });

    /* Companion tools on this page */
    pill("button", {
      label: "Companion",
      active: shell === "companion",
      title: "Companion tools on this page",
      onClick: function (ev) {
        ev.preventDefault();
        setShell("companion");
        paintActive();
      }
    });

    /* Campus */
    pill("a", {
      label: "Campus",
      ghost: true,
      href: "/campus/",
      title: "University campus path"
    });

    function paintActive() {
      var m = currentShell();
      var pills = bar.querySelectorAll(".cpp-pill");
      if (pills[0]) pills[0].classList.toggle("cpp-active", m === "landing");
      if (pills[2]) pills[2].classList.toggle("cpp-active", m === "companion");
    }

    /* Place under banner / top duo / after existing reopen bar */
    var duo = document.getElementById("clarity-top-duo");
    var reopen = document.getElementById("clarity-reopen-bar");
    var host = (duo && duo.parentNode) || (reopen && reopen.parentNode) || document.body;
    if (reopen) {
      reopen.style.setProperty("display", "none", "important");
      if (bar.parentNode !== host) {
        if (reopen.nextSibling) host.insertBefore(bar, reopen.nextSibling);
        else host.appendChild(bar);
      }
    } else if (duo) {
      if (bar.parentNode !== host) {
        if (duo.nextSibling) host.insertBefore(bar, duo.nextSibling);
        else host.appendChild(bar);
      }
    } else if (!bar.parentNode) {
      document.body.insertBefore(bar, document.body.firstChild);
    }

    /* Soft-hide leftover "Open daily page" text links */
    document.querySelectorAll("a").forEach(function (a) {
      var t = (a.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
      if (t === "open daily page" || t === "open daily routines") {
        if (a.closest && a.closest("#" + BAR_ID)) return;
        a.style.setProperty("display", "none", "important");
      }
    });

    return bar;
  }

  function boot() {
    try { buildBar(); } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 400);
  setTimeout(boot, 1200);
})(typeof window !== "undefined" ? window : this);
