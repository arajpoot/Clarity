/**
 * Day Room 3B+ · path confine + Dayn + review + copyright · 20261027BANNER-AV
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_DAY_ROOM_3B_PLUS__) return;
  w.__CLARITY_DAY_ROOM_3B_PLUS__ = true;

  function injectCss() {
    if (document.getElementById("clarity-day-room-3b-css")) return;
    var s = document.createElement("style");
    s.id = "clarity-day-room-3b-css";
    s.textContent = [
      'html[data-shell-mode="landing"] #clarity-grave-path-strip,',
      'html[data-shell-mode="landing"] .grave-path-strip,',
      'html[data-shell-mode="landing"] #gps-path-strip,',
      'html[data-shell-mode="landing"] [data-path-tiles],',
      'html[data-shell-mode="landing"] .path-to-grave,',
      'html[data-shell-mode="landing"] #clarity-path-tiles{',
      "display:none!important;visibility:hidden!important;height:0!important;max-height:0!important;overflow:hidden!important;margin:0!important;padding:0!important;}",
      'html[data-shell-mode="companion"] #clarity-grave-path-strip{display:block!important;visibility:visible!important;height:auto!important;overflow:visible!important;}',
      "#clarity-day-landing-room .cdl-footer-plaque{text-align:center;margin:1.15rem auto 0.6rem;padding:0.9rem 1rem;border-radius:16px;border:1px solid rgba(15,76,58,0.2);max-width:min(42rem,100%);font-size:0.82rem;background:rgba(15,76,58,0.05);}",
      "html[data-theme=dark] #clarity-day-landing-room .cdl-footer-plaque{border-color:rgba(212,180,90,0.22);background:rgba(12,28,22,0.7);}",
      "#clarity-day-landing-room .cdl-footer-plaque a{color:inherit;text-decoration:underline;}",
      "#clarity-day-landing-room #clarity-dayn-entry{display:block!important;margin:0.85rem 0;}"
    ].join("");
    document.head.appendChild(s);
  }

  function mode() {
    return document.documentElement.getAttribute("data-shell-mode") || "landing";
  }

  function hidePath() {
    if (mode() !== "landing") return;
    ["#clarity-grave-path-strip",".grave-path-strip","#gps-path-strip","[data-path-tiles]","#clarity-path-tiles"].forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.style.setProperty("display", "none", "important");
        el.setAttribute("aria-hidden", "true");
      });
    });
  }

  function mountDayn() {
    var room = document.getElementById("clarity-day-landing-room");
    if (!room || mode() !== "landing") return;
    var inner = room.querySelector(".day-room-inner");
    if (!inner) return;
    var slot = document.getElementById("clarity-landing-slot-dayn");
    if (!slot) {
      slot = document.createElement("div");
      slot.id = "clarity-landing-slot-dayn";
      slot.setAttribute("data-day-slot", "dayn");
      inner.appendChild(slot);
    }
    var host = document.getElementById("clarity-dayn-entry");
    if (!host) {
      host = document.createElement("div");
      host.id = "clarity-dayn-entry";
      host.className = "clarity-dayn-entry cdl-card";
      host.innerHTML =
        '<div class="cdl-head"><h2 style="margin:0;font-size:1rem">📋 Amānah Dayn · cash-flow entry</h2></div>' +
        '<p class="cdl-sub">Qard ḥasan only · on this device · educational only — not legal advice.</p>' +
        '<p class="cdl-sub">Record principal obligations. Full ledger tools load with the Dayn module when available.</p>';
      slot.appendChild(host);
    } else if (!slot.contains(host)) {
      try { slot.appendChild(host); } catch (e) {}
    }
    host.style.setProperty("display", "block", "important");
    try {
      if (w.ClarityDaynLedger && typeof w.ClarityDaynLedger.mount === "function") w.ClarityDaynLedger.mount(host);
    } catch (e) {}
  }

  function ensureReviewFooter() {
    var room = document.getElementById("clarity-day-landing-room");
    if (!room || mode() !== "landing") return;
    var inner = room.querySelector(".day-room-inner");
    if (!inner) return;

    if (!document.getElementById("cdl-confidence")) {
      var conf = document.createElement("div");
      conf.className = "cdl-card";
      conf.id = "cdl-confidence";
      conf.innerHTML =
        '<div class="cdl-head"><h2 style="margin:0;font-size:1rem">🛡️ Built for trust · review plaques</h2></div>' +
        '<p class="cdl-sub"><strong>Educational companion only — not a fatwa, not legal advice.</strong></p>' +
        '<div style="display:grid;gap:0.5rem;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));margin-top:0.5rem">' +
        '<article style="padding:0.65rem;border-radius:12px;border:1px solid rgba(15,76,58,0.15)"><div>📖</div><strong>Sources</strong><p style="font-size:0.8rem;margin:0.2rem 0">Quran.com · Sunnah.com</p></article>' +
        '<article style="padding:0.65rem;border-radius:12px;border:1px solid rgba(15,76,58,0.15)"><div>💻</div><strong>On this device</strong><p style="font-size:0.8rem;margin:0.2rem 0">localStorage · private</p></article>' +
        '<article style="padding:0.65rem;border-radius:12px;border:1px solid rgba(15,76,58,0.15)"><div>🔐</div><strong>Amānah vault</strong><p style="font-size:0.8rem;margin:0.2rem 0">AES-GCM · not legal advice</p></article>' +
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
    hidePath();
    mountDayn();
    ensureReviewFooter();
  }

  [60, 250, 700, 1600, 3200].forEach(function (ms) { setTimeout(run, ms); });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(run, 50); });
  w.addEventListener("load", function () { setTimeout(run, 200); });
  document.addEventListener("clarity:day-room-ready", function () { setTimeout(run, 40); });
  var last = mode();
  setInterval(function () {
    var m = mode();
    if (m !== last) { last = m; run(); }
  }, 800);
})(typeof window !== "undefined" ? window : this);
