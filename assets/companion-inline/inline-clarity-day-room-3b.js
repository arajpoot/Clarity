/**
 * Day Room companion-only path strip + Dayn + footer · 20261027ROOM3b
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_DAY_ROOM_3B__) return;
  w.__CLARITY_DAY_ROOM_3B__ = true;

  function injectCss() {
    if (document.getElementById("clarity-day-room-3b-css")) return;
    var s = document.createElement("style");
    s.id = "clarity-day-room-3b-css";
    s.textContent = [
      /* Path to furnish the grave — Companion room ONLY */
      'html[data-shell-mode="landing"] #clarity-grave-path-strip,',
      'html[data-shell-mode="landing"] .grave-path-strip,',
      'html[data-shell-mode="landing"] #gps-path-strip,',
      'html[data-shell-mode="landing"] [data-path-tiles],',
      'html[data-shell-mode="landing"] .path-to-grave,',
      'html[data-shell-mode="landing"] .gps-phases,',
      'html[data-shell-mode="landing"] #clarity-path-tiles,',
      'html[data-shell-mode="landing"] .furnish-path,',
      'html[data-shell-mode="landing"] [aria-label*="Path to furnish"],',
      'html[data-shell-mode="landing"] [aria-label*="furnish the grave"]{',
      "  display:none!important;visibility:hidden!important;height:0!important;max-height:0!important;",
      "  overflow:hidden!important;margin:0!important;padding:0!important;border:none!important;}",
      'html[data-shell-mode="companion"] #clarity-grave-path-strip,',
      'html[data-shell-mode="companion"] .grave-path-strip{',
      "  display:block!important;visibility:visible!important;height:auto!important;max-height:none!important;",
      "  overflow:visible!important;}",
      /* Day footer plaque */
      "#clarity-day-landing-room .cdl-footer-plaque{",
      "  text-align:center;margin:1.15rem auto 0.6rem;padding:0.9rem 1rem;border-radius:16px;",
      "  border:1px solid rgba(15,76,58,0.2);max-width:min(42rem,100%);font-size:0.82rem;",
      "  background:rgba(15,76,58,0.05);}",
      "html[data-theme=dark] #clarity-day-landing-room .cdl-footer-plaque,",
      "html[data-theme=night] #clarity-day-landing-room .cdl-footer-plaque{",
      "  border-color:rgba(212,180,90,0.22);background:rgba(12,28,22,0.7);}",
      "#clarity-day-landing-room .cdl-footer-plaque a{color:inherit;text-decoration:underline;}",
      "#clarity-day-landing-room #clarity-dayn-entry,",
      "#clarity-day-landing-room .clarity-dayn-entry{display:block!important;margin:0.85rem 0;}"
    ].join("");
    document.head.appendChild(s);
  }

  function mode() {
    return document.documentElement.getAttribute("data-shell-mode") || "landing";
  }

  function hidePathOnLanding() {
    injectCss();
    if (mode() !== "landing") return;
    var sels = [
      "#clarity-grave-path-strip",
      ".grave-path-strip",
      "#gps-path-strip",
      "[data-path-tiles]",
      ".path-to-grave",
      "#clarity-path-tiles"
    ];
    sels.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        /* never hide if inside companion main only — still force hide on landing */
        el.style.setProperty("display", "none", "important");
        el.setAttribute("aria-hidden", "true");
        el.setAttribute("data-day-hidden-path", "1");
      });
    });
    /* text match Path to furnish */
    document.querySelectorAll("section,div,article").forEach(function (el) {
      if (el.closest("#clarity-day-landing-room")) return;
      if (el.closest("#main-content")) return; /* companion owns path inside main */
      var t = (el.getAttribute("aria-label") || "") + " " + (el.querySelector("h2,h3") && el.querySelector("h2,h3").textContent || "");
      if (/path to furnish|four doors/i.test(t) && !el.closest("#main-content")) {
        el.style.setProperty("display", "none", "important");
      }
    });
  }

  function mountDayn() {
    var room = document.getElementById("clarity-day-landing-room");
    if (!room || mode() !== "landing") return;
    var slot = document.getElementById("clarity-landing-slot-dayn") || room.querySelector("[data-day-slot=dayn]");
    if (!slot) {
      var inner = room.querySelector(".day-room-inner");
      if (!inner) return;
      slot = document.createElement("div");
      slot.id = "clarity-landing-slot-dayn";
      slot.setAttribute("data-day-slot", "dayn");
      inner.appendChild(slot);
    }
    var host = document.getElementById("clarity-dayn-entry");
    if (!host) {
      host = document.createElement("div");
      host.id = "clarity-dayn-entry";
      host.className = "clarity-dayn-entry card";
      host.innerHTML =
        '<p class="cdl-sub" style="font-weight:800">Amānah Dayn · cash-flow entry</p>' +
        '<p class="cdl-sub">Qard ḥasan only · on this device · educational only — not legal advice.</p>' +
        '<p class="cdl-sub">Open full ledger tools load with Dayn module. Record principal obligations here when the form is available.</p>';
      slot.appendChild(host);
    } else if (!slot.contains(host)) {
      try { slot.appendChild(host); } catch (e) {}
    }
    host.style.setProperty("display", "block", "important");
    /* nudge dayn module if present */
    try {
      if (w.ClarityDaynLedger && typeof w.ClarityDaynLedger.mount === "function") {
        w.ClarityDaynLedger.mount(host);
      }
    } catch (e) {}
    document.dispatchEvent(new CustomEvent("clarity:dayn-slot-ready"));
  }

  function ensureReviewAndFooter() {
    var room = document.getElementById("clarity-day-landing-room");
    if (!room || mode() !== "landing") return;
    var inner = room.querySelector(".day-room-inner");
    if (!inner) return;

    if (!document.getElementById("cdl-confidence")) {
      var conf = document.createElement("div");
      conf.className = "cdl-card";
      conf.id = "cdl-confidence";
      conf.setAttribute("data-landing", "confidence");
      conf.innerHTML =
        '<div class="cdl-head"><h2><span class="cdl-ico" aria-hidden="true">🛡️</span> Built for trust · review plaques</h2></div>' +
        '<p class="cdl-sub"><strong>Educational companion only — not a fatwa, not legal advice.</strong> For personal rulings, ask a qualified local teacher.</p>' +
        '<div class="cdl-trust-grid" style="display:grid;gap:0.5rem;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));margin-top:0.5rem">' +
          '<article class="cdl-trust-plaque" style="padding:0.65rem;border-radius:12px;border:1px solid rgba(15,76,58,0.15)"><div>📖</div><h3 style="margin:0.2rem 0;font-size:0.9rem">Sources in the open</h3><p style="font-size:0.8rem;margin:0">Quran.com · Sunnah.com</p></article>' +
          '<article class="cdl-trust-plaque" style="padding:0.65rem;border-radius:12px;border:1px solid rgba(15,76,58,0.15)"><div>💻</div><h3 style="margin:0.2rem 0;font-size:0.9rem">On this device</h3><p style="font-size:0.8rem;margin:0">localStorage · private by default</p></article>' +
          '<article class="cdl-trust-plaque" style="padding:0.65rem;border-radius:12px;border:1px solid rgba(15,76,58,0.15)"><div>🔐</div><h3 style="margin:0.2rem 0;font-size:0.9rem">Amānah vault</h3><p style="font-size:0.8rem;margin:0">AES-GCM on-device · not legal advice</p></article>' +
        "</div>";
      inner.appendChild(conf);
    }

    if (!document.getElementById("cdl-footer-plaque")) {
      var foot = document.createElement("div");
      foot.id = "cdl-footer-plaque";
      foot.className = "cdl-footer-plaque";
      foot.setAttribute("role", "contentinfo");
      foot.innerHTML =
        "<p><strong>© Clarity Dawah · Educational companion</strong></p>" +
        "<p>Furnish your grave · prepare for the long stay · not a fatwa · not legal advice</p>" +
        '<p><a href="https://quran.com" target="_blank" rel="noopener">Quran.com</a> · ' +
        '<a href="https://sunnah.com" target="_blank" rel="noopener">Sunnah.com</a> · ' +
        '<a href="/campus/" target="_blank" rel="noopener">Campus</a></p>';
      inner.appendChild(foot);
    }
  }

  function run() {
    injectCss();
    hidePathOnLanding();
    mountDayn();
    ensureReviewAndFooter();
  }

  [80, 300, 800, 1800, 3500].forEach(function (ms) {
    setTimeout(run, ms);
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(run, 60); });
  }
  w.addEventListener("load", function () { setTimeout(run, 200); });
  document.addEventListener("clarity:day-room-ready", function () { setTimeout(run, 50); });
  document.addEventListener("clarity:landing-ready", function () { setTimeout(run, 50); });
  /* when shell toggles */
  var last = mode();
  setInterval(function () {
    var m = mode();
    if (m !== last) {
      last = m;
      run();
    }
  }, 700);
})(typeof window !== "undefined" ? window : this);
