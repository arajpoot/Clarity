/**
 * Day vault HARDEN · 20261027VAULT-HARD
 * TRACK bar cannot peek on Day — aux-pack resurrection blocked.
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_DAY_VAULT_HARD__) return;
  w.__CLARITY_DAY_VAULT_HARD__ = true;

  var TRACK_HTML = null;

  function mode() {
    return document.documentElement.getAttribute("data-shell-mode") || "landing";
  }

  function injectCss() {
    if (document.getElementById("clarity-vault-hard-css")) return;
    var s = document.createElement("style");
    s.id = "clarity-vault-hard-css";
    s.textContent = [
      /* Absolute kill on Day — beat aux-pack */
      'html[data-shell-mode="landing"] .clarity-gate-switcher,',
      'html[data-shell-mode="landing"] .rrra-sitewide,',
      'html[data-shell-mode="landing"] .cgp-track-bar,',
      'html[data-shell-mode="landing"] [aria-label*="Learning track"],',
      'html[data-shell-mode="landing"] [aria-label*="Phased learning"],',
      'html[data-shell-mode="landing"] .cgs-btn{',
      "display:none!important;visibility:hidden!important;height:0!important;max-height:0!important;",
      "min-height:0!important;overflow:hidden!important;margin:0!important;padding:0!important;",
      "opacity:0!important;pointer-events:none!important;position:absolute!important;left:-9999px!important;}",
      /* Companion may show track */
      'html[data-shell-mode="companion"] .clarity-gate-switcher{',
      "display:flex!important;visibility:visible!important;height:auto!important;min-height:2.75rem!important;",
      "position:relative!important;left:auto!important;opacity:1!important;pointer-events:auto!important;",
      "flex-wrap:wrap;align-items:center;justify-content:center;gap:0.35rem;",
      "margin:0.45rem 0.5rem 0.65rem;padding:0.5rem 0.65rem;border-radius:14px;",
      "border:1px solid rgba(15,76,58,0.22);}",
      /* dual external off both */
      "#clarity-dual-path,.clarity-dual-path{display:none!important;height:0!important;min-height:0!important;}",
      /* external provision off — Day room owns Do this today */
      "#clarity-provision-home,.clarity-provision-home{display:none!important;height:0!important;min-height:0!important;overflow:hidden!important;}",
      'html[data-shell-mode="landing"] #clarity-door-rail,html[data-shell-mode="landing"] .door-rail-bottom{display:none!important;height:0!important;}',
      'html[data-shell-mode="landing"] #main-content{display:none!important;}',
      'html[data-shell-mode="landing"] #clarity-day-landing-room{display:block!important;visibility:visible!important;}',
      /* kill min-height jump from track CSS */
      'html[data-shell-mode="landing"] .clarity-gate-switcher{min-height:0!important;}'
    ].join("");
    document.head.appendChild(s);
  }

  function killTrackOnLanding() {
    var nodes = document.querySelectorAll(
      ".clarity-gate-switcher,.rrra-sitewide,.cgp-track-bar,[aria-label*=\"Learning track\"],[aria-label*=\"Phased learning\"]"
    );
    nodes.forEach(function (el) {
      if (mode() === "landing") {
        if (!TRACK_HTML && el.innerHTML && el.querySelector(".cgs-btn")) {
          TRACK_HTML = el.innerHTML;
        }
        el.style.setProperty("display", "none", "important");
        el.style.setProperty("height", "0", "important");
        el.style.setProperty("min-height", "0", "important");
        el.style.setProperty("max-height", "0", "important");
        el.style.setProperty("overflow", "hidden", "important");
        el.style.setProperty("margin", "0", "important");
        el.style.setProperty("padding", "0", "important");
        el.style.setProperty("opacity", "0", "important");
        el.setAttribute("hidden", "");
        el.setAttribute("aria-hidden", "true");
        el.setAttribute("data-rail-suppressed", "1");
        /* remove from flow completely */
        try { el.classList.remove("cgp-track-bar"); } catch (e) {}
      } else {
        el.style.removeProperty("display");
        el.style.removeProperty("height");
        el.style.removeProperty("min-height");
        el.style.removeProperty("opacity");
        el.removeAttribute("hidden");
        el.setAttribute("aria-hidden", "false");
        if (TRACK_HTML && !el.querySelector(".cgs-btn")) {
          try { el.innerHTML = TRACK_HTML; } catch (e) {}
        }
      }
    });
    /* Phased learning text nodes wrappers */
    if (mode() === "landing") {
      document.querySelectorAll("div,section,p").forEach(function (el) {
        if (el.closest("#clarity-day-landing-room")) return;
        if (el.closest(".banner")) return;
        if (el.closest("#clarity-reopen-bar")) return;
        var t = (el.getAttribute("aria-label") || "");
        if (/Learning track|Phased learning/i.test(t)) {
          el.style.setProperty("display", "none", "important");
          el.style.setProperty("height", "0", "important");
        }
      });
    }
  }

  function run() {
    injectCss();
    killTrackOnLanding();
    document.querySelectorAll("#clarity-provision-home,#clarity-dual-path").forEach(function (el) {
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("height", "0", "important");
    });
  }

  /* Beat aux-pack: run often early */
  [0, 16, 50, 100, 200, 400, 800, 1600, 3200, 6000].forEach(function (ms) {
    setTimeout(run, ms);
  });
  setInterval(run, 800);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  }
  w.addEventListener("load", function () { run(); setTimeout(run, 100); });
  document.addEventListener("clarity:day-room-ready", run);

  /* Intercept classList.add that re-enables track on Day */
  try {
    var elProto = w.Element && w.Element.prototype;
    if (elProto && !elProto.__clarityVaultClassList) {
      elProto.__clarityVaultClassList = true;
      var origAdd = elProto.classList && Object.getOwnPropertyDescriptor(DOMTokenList.prototype, "add");
    }
  } catch (e) {}
})(typeof window !== "undefined" ? window : this);
