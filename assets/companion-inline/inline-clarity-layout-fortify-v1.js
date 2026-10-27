/**
 * Clarity Layout Fortify 20261027LF1
 * - Hijri calendar grid in banner
 * - 4 path tiles full viewport width on Companion
 * - Day āyah strip below dual tiles, full width, re-mount if lost
 * - Amānah Dayn above "Remember the long stay"; vault line counter
 * - Day landing footer blocks above copyright
 * Educational only — not a fatwa · not legal advice.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_LAYOUT_FORTIFY_V1__) return;
  w.__CLARITY_LAYOUT_FORTIFY_V1__ = true;

  var STORE = "clarity_dayn_ledger_v1";

  function injectCss() {
    if (document.getElementById("clarity-layout-fortify-css")) return;
    var s = document.createElement("style");
    s.id = "clarity-layout-fortify-css";
    s.textContent = [
      /* Companion: 4 path tiles full width */
      'html[data-shell-mode="companion"] #clarity-grave-path-strip,',
      'html[data-shell-mode="companion"] .grave-path-strip,',
      'html[data-shell-mode="companion"] .path-to-grave {',
      "  display:block!important;visibility:visible!important;",
      "  width:100%!important;max-width:100%!important;margin:0.5rem 0!important;",
      "  padding:0.75rem 1rem!important;box-sizing:border-box!important;}",
      'html[data-shell-mode="companion"] #clarity-grave-path-strip .gps-phases,',
      'html[data-shell-mode="companion"] .grave-path-strip .gps-phases,',
      'html[data-shell-mode="companion"] [data-path-tiles],',
      'html[data-shell-mode="companion"] .path-tiles-grid {',
      "  display:grid!important;grid-template-columns:repeat(auto-fit,minmax(140px,1fr))!important;",
      "  gap:0.55rem!important;width:100%!important;max-width:100%!important;}",
      'html[data-shell-mode="companion"] .gps-phase,html[data-shell-mode="companion"] .path-tile-card {',
      "  min-width:0!important;width:100%!important;box-sizing:border-box!important;}",
      /* Day landing: dual tiles + verse full width */
      'html[data-shell-mode="landing"] [data-landing="paths"]{',
      "  display:grid!important;grid-template-columns:1fr 1fr!important;gap:0.5rem!important;",
      "  width:100%!important;max-width:min(48rem,100%)!important;margin:0.5rem auto!important;",
      "  padding:0 0.75rem!important;box-sizing:border-box!important;}",
      "#clarity-day-first-strip,.clarity-day-first-strip{",
      "  display:block!important;visibility:visible!important;opacity:1!important;",
      "  width:100%!important;max-width:min(48rem,100%)!important;margin:0.65rem auto!important;",
      "  padding:0.9rem 1rem!important;box-sizing:border-box!important;",
      "  border-radius:16px;border:1px solid rgba(15,76,58,0.25);}",
      "html[data-theme=dark] #clarity-day-first-strip,html[data-theme=night] #clarity-day-first-strip{",
      "  border-color:rgba(212,180,90,0.28);background:rgba(12,28,22,0.85);}",
      /* Hijri grid */
      "#hijri-cal-grid{display:grid!important;grid-template-columns:repeat(7,1fr);gap:2px;",
      "  font-size:0.68rem;text-align:center;margin:0.25rem 0;min-height:4.5rem;}",
      "#hijri-cal-grid .hc-cell{padding:0.15rem 0;border-radius:4px;opacity:0.9;}",
      "#hijri-cal-grid .hc-head{font-weight:700;opacity:0.7;}",
      "#hijri-cal-grid .hc-today{background:rgba(201,162,39,0.35);font-weight:800;}",
      /* Dayn placement helpers */
      "#clarity-dayn-entry,.clarity-dayn-entry{order:0;}",
      "#clarity-dayn-vault-ledger .dayn-vault-count{font-weight:800;color:var(--gold,#c9a227);}",
      /* Hide furnish strip only on pure day-landing mode (not companion) */
      'html[data-shell-mode="landing"] #clarity-grave-path-strip,',
      'html[data-shell-mode="landing"] .grave-path-strip{display:none!important;}'
    ].join("");
    document.head.appendChild(s);
  }

  function mode() {
    return document.documentElement.getAttribute("data-shell-mode") || "landing";
  }

  /* —— Hijri month grid —— */
  function renderHijriGrid(hijri) {
    var grid = document.getElementById("hijri-cal-grid");
    if (!grid || !hijri) return;
    var day = parseInt(hijri.day, 10) || 1;
    var monthLen = 30;
    var heads = ["S", "M", "T", "W", "T", "F", "S"];
    var html = heads.map(function (h) {
      return '<span class="hc-cell hc-head">' + h + "</span>";
    }).join("");
    // approximate start offset from weekday if present
    var wd = (hijri.weekday && hijri.weekday.en) ? hijri.weekday.en.slice(0, 3).toLowerCase() : "";
    var map = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
    var start = map[wd] != null ? map[wd] : ((day - 1) % 7);
    // back up to week start for "today"
    var firstOffset = (start - ((day - 1) % 7) + 7) % 7;
    for (var i = 0; i < firstOffset; i++) html += '<span class="hc-cell"></span>';
    for (var d = 1; d <= monthLen; d++) {
      var cls = "hc-cell" + (d === day ? " hc-today" : "");
      html += '<span class="' + cls + '">' + d + "</span>";
    }
    grid.innerHTML = html;
    var meta = document.getElementById("hijri-cal-meta");
    if (meta) {
      var line = (hijri.day || "") + " " + ((hijri.month && (hijri.month.en || hijri.month.ar)) || "") + " " + (hijri.year || "") + " AH";
      meta.textContent = line;
    }
  }

  function ensureHijri() {
    try {
      var raw = localStorage.getItem("clarity_banner_salah_v1");
      if (raw) {
        var c = JSON.parse(raw);
        if (c && c.hijri) {
          renderHijriGrid(c.hijri);
          return;
        }
      }
    } catch (e) {}
    // fetch light
    fetch("https://api.aladhan.com/v1/timingsByCity?city=Edmonton&country=Canada&method=2")
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.data && data.data.date && data.data.date.hijri) {
          renderHijriGrid(data.data.date.hijri);
        }
      })
      .catch(function () {});
  }

  /* —— Day āyah strip fortify —— */
  function ensureVerseStrip() {
    if (mode() !== "landing") return;
    var strip = document.getElementById("clarity-day-first-strip");
    if (!strip) {
      strip = document.createElement("section");
      strip.id = "clarity-day-first-strip";
      strip.setAttribute("data-day-first", "1");
      strip.innerHTML =
        '<p class="df-label">Today · Day landing</p>' +
        '<p class="df-ar" lang="ar" dir="rtl">يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ</p>' +
        '<p class="df-en">O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.</p>' +
        '<p class="df-ref"><a href="https://quran.com/2/153" target="_blank" rel="noopener">Qurʾān 2:153</a> · Sahih International · educational only</p>' +
        '<div class="df-grid">' +
          '<div class="df-tile"><strong>Next ṣalāh</strong><span id="df-salah">See banner schedule</span></div>' +
          '<div class="df-tile"><strong>One deed</strong><span>Pray the next ṣalāh with presence — a light you send ahead.</span></div>' +
        "</div>" +
        '<div class="df-cta"><button type="button" class="df-comp" id="df-open-companion">Companion path →</button>' +
        '<span class="df-note">Reminder · Reality · Reflection · Action · Amanah</span></div>';
    }
    strip.style.setProperty("display", "block", "important");
    strip.style.setProperty("visibility", "visible", "important");
    // place below dual path tiles inside day landing
    var root = document.getElementById("clarity-day-landing");
    var paths = root && root.querySelector('[data-landing="paths"]');
    if (paths && paths.parentNode) {
      if (paths.nextSibling !== strip) {
        paths.parentNode.insertBefore(strip, paths.nextSibling);
      }
    } else if (root && !root.contains(strip)) {
      root.insertBefore(strip, root.firstChild);
    }
    var btn = document.getElementById("df-open-companion");
    if (btn && !btn.__lfWired) {
      btn.__lfWired = true;
      btn.addEventListener("click", function () {
        try {
          if (w.ClarityShell && w.ClarityShell.setMode) w.ClarityShell.setMode("companion");
        } catch (e) {}
      });
    }
  }

  /* —— Dayn above long stay; vault counter —— */
  function placeDayn() {
    var host = document.getElementById("clarity-dayn-entry");
    if (!host) return;
    var root = document.getElementById("clarity-day-landing");
    if (!root) return;
    // find "Remember the long stay" card
    var longStay = null;
    root.querySelectorAll("h2, .cdl-head").forEach(function (h) {
      if (/long stay/i.test(h.textContent || "")) {
        longStay = h.closest(".cdl-card, .cdl-oath-warn, section, div");
      }
    });
    if (longStay && longStay.parentNode) {
      if (host.nextSibling !== longStay) {
        longStay.parentNode.insertBefore(host, longStay);
      }
    }
    host.style.setProperty("display", "block", "important");
  }

  function vaultDaynCounter() {
    var data;
    try {
      data = JSON.parse(localStorage.getItem(STORE) || "{}");
    } catch (e) {
      data = {};
    }
    var lines = (data.lines || []).filter(function (l) {
      return (l.status || "open") !== "closed";
    });
    var n = lines.length;
    // ensure vault panel mount target
    var panel = document.getElementById("clarity-dayn-vault-ledger");
    var vault =
      document.getElementById("amana-vault-interior") ||
      document.querySelector("#amana-vault-gate, [data-tab=amanah], .amana-vault, #tab-action");
    if (!panel && vault) {
      panel = document.createElement("div");
      panel.id = "clarity-dayn-vault-ledger";
      panel.setAttribute("data-dayn-vault", "1");
      panel.innerHTML =
        '<p class="dayn-vault-count">Qard ḥasan lines on this device: <strong id="dayn-vault-count-n">' +
        n +
        "</strong></p>" +
        "<p class=\"cdl-sub\">Open ledger from Day landing · educational only · not legal advice.</p>";
      vault.appendChild(panel);
    } else if (panel) {
      var strong = panel.querySelector("#dayn-vault-count-n") || panel.querySelector("strong");
      if (strong) strong.textContent = String(n);
      else {
        panel.insertAdjacentHTML(
          "afterbegin",
          '<p class="dayn-vault-count">Qard ḥasan lines: <strong id="dayn-vault-count-n">' + n + "</strong></p>"
        );
      }
    }
    // also small badge on dayn entry
    var host = document.getElementById("clarity-dayn-entry");
    if (host) {
      var badge = host.querySelector("#dayn-entry-count");
      if (!badge) {
        badge = document.createElement("p");
        badge.id = "dayn-entry-count";
        badge.className = "cdl-sub";
        host.insertBefore(badge, host.firstChild);
      }
      badge.textContent = "On-device open lines: " + n + " · educational ledger only";
    }
  }

  /* —— Move bottom day blocks above copyright —— */
  function placeAboveCopyright() {
    if (mode() !== "landing") return;
    var foot =
      document.querySelector("footer, .site-footer, #clarity-footer, [data-footer]") ||
      Array.prototype.find.call(document.querySelectorAll("div, section"), function (el) {
        return /Clarity Dawah|Educational companion/i.test(el.textContent || "") &&
          /Furnish your grave/i.test(el.textContent || "") &&
          el.children.length < 8;
      });
    var strip = document.getElementById("clarity-day-first-strip");
    var dayn = document.getElementById("clarity-dayn-entry");
    // Prefer inside day landing root, not page bottom orphans
    var root = document.getElementById("clarity-day-landing");
    if (root && strip && !root.contains(strip)) {
      root.appendChild(strip);
    }
    if (root && dayn && !root.contains(dayn)) {
      placeDayn();
    }
    if (foot && strip && foot.parentNode) {
      // if strip somehow after footer, move before foot
      try {
        if (strip.compareDocumentPosition(foot) & Node.DOCUMENT_POSITION_FOLLOWING) {
          /* strip before foot already */
        } else {
          foot.parentNode.insertBefore(strip, foot);
        }
      } catch (e) {}
    }
  }

  function run() {
    injectCss();
    ensureHijri();
    ensureVerseStrip();
    placeDayn();
    vaultDaynCounter();
    placeAboveCopyright();
  }

  [50, 200, 500, 1200, 2500, 5000].forEach(function (ms) {
    setTimeout(run, ms);
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(run, 80); });
  }
  w.addEventListener("load", function () { setTimeout(run, 300); });
  document.addEventListener("clarity:landing-ready", function () { setTimeout(run, 60); });
  document.addEventListener("clarity:companion-ready", function () { setTimeout(run, 60); });
  try {
    new MutationObserver(function () {
      if (mode() === "landing") {
        ensureVerseStrip();
        placeDayn();
      }
      vaultDaynCounter();
    }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-shell-mode"] });
  } catch (e) {}
})(typeof window !== "undefined" ? window : this);
