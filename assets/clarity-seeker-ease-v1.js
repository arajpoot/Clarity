/**
 * Clarity Seeker Ease v1 — first-session comfort + one sincere deed
 * Lightweight, Seeker-safe, no path unlock required.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_SEEKER_EASE_V1__) return;
  w.__CLARITY_SEEKER_EASE_V1__ = true;

  var KEY = "clarity_seeker_ease_v1";
  var DEED_KEY = "clarity_one_deed_day";

  function lsGet(k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
  }
  function lsSet(k, v) {
    try { localStorage.setItem(k, v); } catch (e) {}
  }
  function today() {
    try { return new Date().toDateString(); } catch (e) { return "x"; }
  }

  var DEEDS = [
    { ar: "استغفر الله", en: "One sincere istighfār" },
    { ar: "سبحان الله", en: "Say Subḥānallāh with presence" },
    { ar: "الحمد لله", en: "Thank Allah for one blessing" },
    { ar: "اللهم صل على محمد", en: "One ṣalawāt upon the Prophet ﷺ" },
    { ar: "بسم الله", en: "Begin the next act with Bismillāh" },
    { ar: "حسبي الله", en: "Remind the heart: Ḥasbiyallāh" }
  ];

  function pickDeed() {
    var i = Math.floor(Math.random() * DEEDS.length);
    return DEEDS[i];
  }

  function ensureChip() {
    if (document.getElementById("clarity-one-deed-chip")) return;
    var d = pickDeed();
    var stored = lsGet(DEED_KEY);
    var day = today();
    if (stored && stored.indexOf(day) === 0) {
      try { d = JSON.parse(stored.slice(day.length + 1)); } catch (e) {}
    } else {
      lsSet(DEED_KEY, day + "|" + JSON.stringify(d));
    }

    var el = document.createElement("div");
    el.id = "clarity-one-deed-chip";
    el.setAttribute("role", "status");
    el.style.cssText = "position:fixed;bottom:1.1rem;right:1rem;z-index:9997;max-width:min(92vw,280px);background:rgba(26,46,36,.94);color:#e7efe9;padding:.65rem .9rem;border-radius:14px;font:600 13px/1.35 system-ui,sans-serif;box-shadow:0 8px 28px rgba(0,0,0,.28);backdrop-filter:blur(8px);opacity:0;transform:translateY(8px);transition:opacity .35s,transform .35s";
    el.innerHTML = '<div style="opacity:.75;font-size:11px;margin-bottom:.2rem">Today · one sincere deed</div>' +
      '<div style="font-family:Scheherazade New,serif;font-size:1.15rem;direction:rtl">' + (d.ar || "") + "</div>" +
      '<div style="margin-top:.25rem;font-weight:500;opacity:.92">' + (d.en || "") + "</div>" +
      '<button type="button" id="clarity-deed-done" style="margin-top:.55rem;border:0;background:#c9a227;color:#1a2e24;font:700 12px system-ui;padding:.35rem .7rem;border-radius:999px;cursor:pointer">Done · الحمد لله</button>';
    document.body.appendChild(el);
    requestAnimationFrame(function () {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
    var btn = document.getElementById("clarity-deed-done");
    if (btn) btn.addEventListener("click", function () {
      el.style.opacity = "0";
      setTimeout(function () { el.remove(); }, 320);
      lsSet(KEY, "welcomed");
    });
    // Auto-hide after 14s if untouched
    setTimeout(function () {
      if (el.parentNode && el.style.opacity !== "0") {
        el.style.opacity = "0";
        setTimeout(function () { try { el.remove(); } catch (e) {} }, 400);
      }
    }, 14000);
  }

  function firstVisitTip() {
    if (lsGet(KEY) === "welcomed") return;
    // Delay so shell paints first
    setTimeout(ensureChip, 1600);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", firstVisitTip);
  } else {
    firstVisitTip();
  }

  w.ClaritySeekerEase = { showDeed: ensureChip, version: "20261006AR" };
})(typeof window !== "undefined" ? window : this);
