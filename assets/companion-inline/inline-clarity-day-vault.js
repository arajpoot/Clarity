/**
 * Clarity Day Vault · 20261027VAULT
 * True room pattern: Day content lives only inside #clarity-day-landing-room.
 * Provision "Do this today" is adopted into the room so it cannot vanish with main-content.
 * Companion: no two-path dual cards; 4-way TRACK restored here only.
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_DAY_VAULT__) return;
  w.__CLARITY_DAY_VAULT__ = true;

  function mode() {
    return document.documentElement.getAttribute("data-shell-mode") || "landing";
  }

  function injectCss() {
    if (document.getElementById("clarity-day-vault-css")) return;
    var s = document.createElement("style");
    s.id = "clarity-day-vault-css";
    s.textContent = [
      /* Room isolation */
      "#clarity-day-landing-room{contain:layout style;isolation:isolate;}",
      'html[data-shell-mode="landing"] #clarity-day-landing-room{display:block!important;visibility:visible!important;}',
      'html[data-shell-mode="landing"] #main-content{display:none!important;}',
      'html[data-shell-mode="companion"] #clarity-day-landing-room{display:none!important;}',
      'html[data-shell-mode="companion"] #main-content{display:block!important;visibility:visible!important;}',

      /* Two-path dual cards: never on Companion; outer dual never on Day */
      'html[data-shell-mode="companion"] #clarity-dual-path,',
      'html[data-shell-mode="companion"] .clarity-dual-path{',
      "display:none!important;visibility:hidden!important;height:0!important;min-height:0!important;overflow:hidden!important;margin:0!important;padding:0!important;}",
      'html[data-shell-mode="landing"] #clarity-dual-path,',
      'html[data-shell-mode="landing"] .clarity-dual-path{',
      "display:none!important;height:0!important;min-height:0!important;overflow:hidden!important;}",
      /* Only the dual inside Day room */
      'html[data-shell-mode="landing"] #clarity-day-landing-room .dual-tiles{display:grid!important;}',

      /* Provision: only when parked inside Day room */
      'html[data-shell-mode="landing"] #clarity-day-landing-room #clarity-provision-home{',
      "display:block!important;visibility:visible!important;height:auto!important;overflow:visible!important;",
      "margin:0 0 0.75rem;max-width:100%;}",
      'html[data-shell-mode="companion"] #clarity-provision-home{',
      "display:none!important;height:0!important;overflow:hidden!important;margin:0!important;min-height:0!important;}",
      /* orphan provision outside room on landing — hide until adopted */
      'html[data-shell-mode="landing"] body > #clarity-provision-home,',
      'html[data-shell-mode="landing"] #clarity-top-duo > #clarity-provision-home,',
      'html[data-shell-mode="landing"] #main-application-workspace > #clarity-provision-home{',
      "display:none!important;}",

      /* 4-way TRACK — Companion only */
      'html[data-shell-mode="landing"] .clarity-gate-switcher,',
      'html[data-shell-mode="landing"] .rrra-sitewide{',
      "display:none!important;height:0!important;overflow:hidden!important;min-height:0!important;}",
      'html[data-shell-mode="companion"] .clarity-gate-switcher.rrra-sitewide,',
      'html[data-shell-mode="companion"] .clarity-gate-switcher{',
      "display:flex!important;visibility:visible!important;height:auto!important;min-height:2.75rem!important;",
      "flex-wrap:wrap;align-items:center;justify-content:center;gap:0.35rem;",
      "margin:0.45rem 0.5rem 0.65rem;padding:0.5rem 0.65rem;border-radius:14px;",
      "border:1px solid rgba(15,76,58,0.22);background:linear-gradient(135deg,rgba(15,76,58,0.12),rgba(15,76,58,0.04));}",
      'html[data-theme=dark] html[data-shell-mode="companion"] .clarity-gate-switcher,',
      'html[data-theme=night][data-shell-mode="companion"] .clarity-gate-switcher{',
      "border-color:rgba(212,180,90,0.25);background:rgba(12,28,22,0.75);}",

      /* Bottom rail Companion only */
      'html[data-shell-mode="landing"] #clarity-door-rail,html[data-shell-mode="landing"] .door-rail-bottom{',
      "display:none!important;height:0!important;}",
      'html[data-shell-mode="companion"] #clarity-door-rail{display:flex!important;}'
    ].join("");
    document.head.appendChild(s);
  }

  function adoptProvision() {
    var room = document.getElementById("clarity-day-landing-room");
    if (!room) return;
    var inner = room.querySelector(".day-room-inner") || room;
    var prov = document.getElementById("clarity-provision-home");
    if (!prov) return;

    if (mode() === "landing") {
      /* Park inside room — first child of inner so it cannot vanish with main */
      if (!inner.contains(prov)) {
        try {
          inner.insertBefore(prov, inner.firstChild);
        } catch (e) {
          try { inner.appendChild(prov); } catch (e2) {}
        }
      }
      prov.style.setProperty("display", "block", "important");
      prov.style.setProperty("visibility", "visible", "important");
      prov.style.setProperty("height", "auto", "important");
      prov.removeAttribute("hidden");
      prov.setAttribute("data-vault-adopted", "1");
    } else {
      /* Companion: leave in DOM but hide; optional move back under banner */
      prov.style.setProperty("display", "none", "important");
      var banner = document.querySelector(".banner");
      if (banner && banner.parentNode && prov.parentNode === inner) {
        try { banner.parentNode.insertBefore(prov, banner.nextSibling); } catch (e) {}
      }
    }
  }

  function dualPathCompanionOff() {
    document.querySelectorAll("#clarity-dual-path,.clarity-dual-path").forEach(function (el) {
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("min-height", "0", "important");
      el.setAttribute("aria-hidden", "true");
    });
  }

  function trackCompanionOnly() {
    document.querySelectorAll(".clarity-gate-switcher,.rrra-sitewide").forEach(function (el) {
      if (mode() === "companion") {
        el.style.setProperty("display", "flex", "important");
        el.style.setProperty("visibility", "visible", "important");
        el.style.setProperty("height", "auto", "important");
        el.style.setProperty("min-height", "2.75rem", "important");
        el.removeAttribute("hidden");
        el.setAttribute("aria-hidden", "false");
        el.removeAttribute("data-rail-suppressed");
        /* ensure not emptied */
        if (!el.querySelector(".cgs-btn") && el.getAttribute("data-vault-track-html")) {
          el.innerHTML = el.getAttribute("data-vault-track-html");
        }
      } else {
        if (!el.getAttribute("data-vault-track-html") && el.innerHTML) {
          try { el.setAttribute("data-vault-track-html", el.innerHTML); } catch (e) {}
        }
        el.style.setProperty("display", "none", "important");
        el.setAttribute("hidden", "");
        el.setAttribute("aria-hidden", "true");
      }
    });
  }

  function run() {
    injectCss();
    adoptProvision();
    dualPathCompanionOff();
    trackCompanionOnly();
  }

  [30, 150, 400, 900, 1800, 3500, 7000].forEach(function (ms) { setTimeout(run, ms); });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(run, 40); });
  } else setTimeout(run, 40);
  w.addEventListener("load", function () { setTimeout(run, 250); });
  document.addEventListener("clarity:day-room-ready", function () { setTimeout(run, 60); });
  var last = mode();
  setInterval(function () {
    var m = mode();
    if (m !== last) { last = m; run(); }
    else {
      /* keep provision adopted if something moved it out */
      if (m === "landing") adoptProvision();
      dualPathCompanionOff();
    }
  }, 1200);
})(typeof window !== "undefined" ? window : this);
