/**
 * CU Desk enrich · 20261017GUIDE
 * Ask advisor card + FAB · faculty help-book · diplomas host
 * Does not rebuild gates. Companion untouched.
 */
(function (g) {
  "use strict";
  if (g.__CU_DESK_ENRICH_V1__) return;
  g.__CU_DESK_ENRICH_V1__ = true;
  var BUILD = "20261017GUIDE";

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

  function roomPhase() {
    var room = (document.body && document.body.getAttribute("data-phase-room")) || "seeker";
    return { seeker: 1, practice: 2, consistency: 3, transmission: 4 }[room] || 1;
  }

  function askAdvisor() {
    try {
      if (g.ClarityFaculty && typeof g.ClarityFaculty.offerHelp === "function") {
        g.ClarityFaculty.offerHelp(true);
        return;
      }
    } catch (e) {}
    var tips = {
      1: "Read slowly. Tawḥīd is loyalty of the heart, not a slogan.",
      2: "Use this as a map; confirm prayer details with a local teacher.",
      3: "One tajweed rule applied well beats ten rushed.",
      4: "Before teaching, ask: is my source clear? Adab is part of the message."
    };
    var phase = roomPhase();
    var card = document.getElementById("cu-advisor-inline-tip");
    if (card) {
      card.textContent = tips[phase] || tips[1];
      card.hidden = false;
    } else {
      alert("Advisor tip (educational only — not a fatwa):\n\n" + (tips[phase] || tips[1]));
    }
  }

  function ensureAdvisorCard() {
    if (document.getElementById("cu-ask-advisor-card")) return;
    var host =
      document.getElementById("clarity-phase-plaque-host") ||
      document.getElementById("cu-stage") ||
      document.querySelector("main.cu-wrap") ||
      document.querySelector("main");
    if (!host) return;
    var card = document.createElement("div");
    card.id = "cu-ask-advisor-card";
    card.className = "cu-panel";
    card.style.cssText =
      "margin:0.75rem 0;padding:0.85rem 1rem;border-radius:14px;border:1px solid rgba(212,180,90,0.3);" +
      "background:rgba(13,79,60,0.12)";
    card.innerHTML =
      '<div style="font-size:0.65rem;font-weight:800;letter-spacing:0.08em;color:#d4b45a;margin-bottom:0.25rem">GUIDANCE</div>' +
      "<strong style=\"display:block;margin-bottom:0.35rem\">Ask advisor</strong>" +
      '<p style="margin:0 0 0.55rem;font-size:0.85rem;line-height:1.4;opacity:0.9">' +
      "Phase teacher tip from the help-book. Educational only — not a fatwa.</p>" +
      '<button type="button" id="cu-ask-advisor-btn" style="padding:0.4rem 0.85rem;border-radius:999px;' +
      "border:1px solid rgba(212,180,90,0.4);background:linear-gradient(135deg,#0d4f3c,#1a6b52);" +
      'color:#f0e6c8;font-weight:700;font-size:0.78rem;cursor:pointer">۞ Ask advisor</button>' +
      '<p id="cu-advisor-inline-tip" hidden style="margin:0.65rem 0 0;font-size:0.88rem;line-height:1.45"></p>';
    if (host.id === "cu-stage" || host.id === "clarity-phase-plaque-host") {
      host.parentNode.insertBefore(card, host);
    } else {
      host.insertBefore(card, host.firstChild);
    }
    document.getElementById("cu-ask-advisor-btn").onclick = askAdvisor;
  }

  function ensureHelpFab() {
    if (document.getElementById("cu-faculty-help-fab")) return;
    var btn = document.createElement("button");
    btn.id = "cu-faculty-help-fab";
    btn.type = "button";
    btn.setAttribute("aria-label", "Ask phase advisor");
    btn.textContent = "۞ Tip";
    btn.style.cssText =
      "position:fixed;right:1rem;bottom:5.5rem;z-index:60;padding:0.55rem 0.85rem;border-radius:999px;" +
      "border:1px solid rgba(212,180,90,0.45);background:linear-gradient(135deg,#0d4f3c,#1a6b52);" +
      "color:#f0e6c8;font-weight:700;font-size:0.78rem;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.35)";
    btn.onclick = askAdvisor;
    document.body.appendChild(btn);
  }

  function ensureDiplomaHost() {
    if (document.getElementById("clarity-name-plaque-slot")) return;
    var host = document.getElementById("clarity-phase-plaque-host") || document.querySelector("main");
    if (!host) return;
    var wrap = document.createElement("div");
    wrap.id = "clarity-name-plaque-slot";
    wrap.style.margin = "0.5rem 0";
    host.parentNode.insertBefore(wrap, host.nextSibling);
  }

  /**
   * Next level safety net: if engine marks phase complete and phase quiz API exists,
   * do not rebuild gates — only ensure diplomas hook is alive after scripts load.
   */
  function ensurePhaseCompleteBridge() {
    /* diplomas.js sets clarityOnPhaseQuizPass → issueDiploma when loaded after spark */
    var tries = 0;
    function check() {
      tries++;
      if (typeof g.clarityOpenPhaseQuiz === "function" && g.ClarityUniversity && g.ClarityUniversity.issueDiploma) {
        var prev = g.clarityOnPhaseQuizPass;
        if (!g.__CU_DIPLOMA_BRIDGE__) {
          g.__CU_DIPLOMA_BRIDGE__ = true;
          g.clarityOnPhaseQuizPass = function (phase) {
            if (typeof prev === "function") prev(phase);
            else {
              try {
                g.ClarityUniversity.issueDiploma(phase);
              } catch (e) {}
            }
          };
        }
        return;
      }
      if (tries < 20) setTimeout(check, 400);
    }
    check();
  }

  function boot() {
    loadCss("/assets/curriculum/vault/admin/faculty/faculty.css");
    ensureAdvisorCard();
    ensureHelpFab();
    ensureDiplomaHost();
    loadScript("/assets/curriculum/vault/admin/faculty/faculty-controller-v1.js").then(function (ok) {
      if (ok && g.ClarityFaculty) {
        try {
          if (typeof g.ClarityFaculty.init === "function") g.ClarityFaculty.init();
        } catch (e) {}
      }
    });
    ensurePhaseCompleteBridge();
    setTimeout(function () {
      try {
        if (g.ClarityUniversity && g.ClarityUniversity.ensureUI) g.ClarityUniversity.ensureUI();
      } catch (e) {}
      try {
        if (g.ClarityUniversityDiplomas && g.ClarityUniversityDiplomas.ensureUI) {
          g.ClarityUniversityDiplomas.ensureUI();
        }
      } catch (e2) {}
    }, 1600);
  }

  g.CuDeskEnrich = { askAdvisor: askAdvisor, BUILD: BUILD };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
