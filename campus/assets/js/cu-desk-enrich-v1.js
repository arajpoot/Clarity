/**
 * CU Desk enrich v1 — faculty help popover + diplomas host + optional registrar
 * Loads on /campus/desk/* only. Companion untouched.
 */
(function (g) {
  "use strict";
  if (g.__CU_DESK_ENRICH_V1__) return;
  g.__CU_DESK_ENRICH_V1__ = true;
  var BUILD = "20261017WIRE";

  function loadCss(href) {
    if (document.querySelector('link[data-cu-enrich="' + href + '"]')) return;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href + (href.indexOf("?") >= 0 ? "&" : "?") + "v=" + BUILD;
    l.dataset.cuEnrich = href;
    document.head.appendChild(l);
  }
  function loadScript(src) {
    return new Promise(function (resolve) {
      var base = src.split("?").shift().split("/").pop();
      if (document.querySelector('script[data-cu-enrich="' + base + '"]')) return resolve(true);
      var s = document.createElement("script");
      s.src = src + (src.indexOf("?") >= 0 ? "&" : "?") + "v=" + BUILD;
      s.dataset.cuEnrich = base;
      s.onload = function () { resolve(true); };
      s.onerror = function () { resolve(false); };
      document.head.appendChild(s);
    });
  }

  function ensureDiplomaHost() {
    if (document.getElementById("clarity-name-plaque")) return;
    var host = document.getElementById("clarity-phase-plaque-host") || document.getElementById("cu-stage") || document.querySelector("main");
    if (!host) return;
    var wrap = document.createElement("div");
    wrap.id = "clarity-name-plaque-slot";
    wrap.style.cssText = "margin:0.75rem 0";
    /* diplomas.js ensureUI looks for body append — just trigger after load */
    if (host.firstChild) host.insertBefore(wrap, host.firstChild);
    else host.appendChild(wrap);
  }

  function ensureHelpFab() {
    if (document.getElementById("cu-faculty-help-fab")) return;
    var btn = document.createElement("button");
    btn.id = "cu-faculty-help-fab";
    btn.type = "button";
    btn.setAttribute("aria-label", "Ask phase advisor for a tip");
    btn.textContent = "۞ Tip";
    btn.style.cssText =
      "position:fixed;right:1rem;bottom:5.5rem;z-index:60;padding:0.55rem 0.85rem;border-radius:999px;" +
      "border:1px solid rgba(212,180,90,0.45);background:linear-gradient(135deg,#0d4f3c,#1a6b52);" +
      "color:#f0e6c8;font-weight:700;font-size:0.78rem;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.35)";
    btn.onclick = function () {
      try {
        if (g.ClarityFaculty && typeof g.ClarityFaculty.offerHelp === "function") {
          g.ClarityFaculty.offerHelp(true);
          return;
        }
      } catch (e) {}
      /* fallback tip card */
      var phase = 1;
      try {
        var room = (document.body && document.body.getAttribute("data-phase-room")) || "seeker";
        phase = { seeker: 1, practice: 2, consistency: 3, transmission: 4 }[room] || 1;
      } catch (e2) {}
      var tips = {
        1: "Read slowly. Tawḥīd is loyalty of the heart, not a slogan.",
        2: "Use this as a map; confirm prayer details with a local teacher.",
        3: "One tajweed rule applied well beats ten rushed.",
        4: "Before teaching, ask: is my source clear? Adab is part of the message."
      };
      alert("Advisor tip (educational only — not a fatwa):\n\n" + (tips[phase] || tips[1]));
    };
    document.body.appendChild(btn);
  }

  function boot() {
    loadCss("/assets/curriculum/vault/admin/faculty/faculty.css");
    /* phase-plaque.css already has spark + diploma styles on desk pages */
    ensureDiplomaHost();
    ensureHelpFab();
    loadScript("/assets/curriculum/vault/admin/faculty/faculty-controller-v1.js").then(function (ok) {
      if (ok && g.ClarityFaculty && typeof g.ClarityFaculty.init === "function") {
        try { g.ClarityFaculty.init(); } catch (e) {}
      }
      /* periodic gentle help when spark buttons visible */
      setTimeout(function () {
        try {
          if (g.ClarityFaculty && g.ClarityFaculty.offerHelp) {
            /* don't force on load — fab is enough; soft offer after 12s if studying */
            setTimeout(function () {
              if (document.querySelector(".junior-spark-btn, [data-spark]")) {
                g.ClarityFaculty.offerHelp(false);
              }
            }, 12000);
          }
        } catch (e2) {}
      }, 800);
    });
    /* diplomas should be in curriculum chain; ensure UI after delay */
    setTimeout(function () {
      try {
        if (g.ClarityUniversityDiplomas && g.ClarityUniversityDiplomas.ensureUI) {
          g.ClarityUniversityDiplomas.ensureUI();
        }
      } catch (e) {}
    }, 1500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
