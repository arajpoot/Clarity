/*! companion-nav-dedupe-v35 · one room strip · no double top bars */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_NAV_DEDUPE_V35__) return;
  w.__CLARITY_NAV_DEDUPE_V35__ = true;

  function ensureIntegrated() {
    var global = d.getElementById("clarity-global-nav");
    var injected = d.querySelectorAll("body > nav.clarity-room-nav, body > .clarity-room-nav");
    /* Prefer a compact strip inside global-nav */
    var strip = d.getElementById("clarity-room-strip");
    if (global && !strip) {
      strip = d.createElement("div");
      strip.id = "clarity-room-strip";
      strip.className = "clarity-room-nav clarity-room-strip-inline";
      strip.setAttribute("data-room", "companion");
      strip.setAttribute("aria-label", "Clarity rooms");
      strip.innerHTML =
        '<a href="/companion/" data-room-link="companion" class="is-here" aria-current="page">Companion</a>' +
        '<a href="/daily/" data-room-link="yawm">Yawm</a>' +
        '<a href="/campus/" data-room-link="university">University</a>' +
        '<a href="/amana/" data-room-link="amana">Amānah</a>';
      var left = global.querySelector(".nav-left") || global;
      left.appendChild(strip);
    }
    /* Remove body-level duplicate room navs (keep inline strip) */
    d.querySelectorAll("nav.clarity-room-nav, .clarity-room-nav").forEach(function (el) {
      if (el.id === "clarity-room-strip") return;
      if (el.classList.contains("clarity-room-strip-inline")) return;
      try { el.parentNode && el.parentNode.removeChild(el); } catch (e) {}
    });
  }

  function boot() {
    ensureIntegrated();
    /* run again after room-nav script injects */
    setTimeout(ensureIntegrated, 50);
    setTimeout(ensureIntegrated, 300);
    setTimeout(ensureIntegrated, 1000);
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(ensureIntegrated, 100); });
})(window, document);
