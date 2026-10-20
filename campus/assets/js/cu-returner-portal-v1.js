/**
 * cu-returner-portal-v1.js · 20261020P1
 * Returning student: soft gate to /campus/portal/
 * Uses same admit keys as cu-admit-v1. Educational only.
 */
(function (g) {
  "use strict";
  if (g.__CU_RETURNER_PORTAL_V1__) return;
  g.__CU_RETURNER_PORTAL_V1__ = true;

  var ADMIT_KEY = "cu_admit_v1";
  var NAME_KEY = "cu_admit_name_v1";
  var LETTER_KEY = "cu_admit_letter_v1";
  var PREF_KEY = "cu_returner_auto_portal_v1";
  var PORTAL = "/campus/portal/";

  function readAdmit() {
    try {
      return JSON.parse(localStorage.getItem(ADMIT_KEY) || "null");
    } catch (e) {
      return null;
    }
  }
  function readName() {
    try {
      return (localStorage.getItem(NAME_KEY) || "").trim();
    } catch (e) {
      return "";
    }
  }
  function hasLetter() {
    try {
      var L = JSON.parse(localStorage.getItem(LETTER_KEY) || "null");
      return !!(L && (L.name || L.ts));
    } catch (e) {
      return false;
    }
  }
  function isReturner() {
    var a = readAdmit();
    if (a && (a.done || a.registered || a.ts)) return true;
    if (hasLetter()) return true;
    if (readName()) return true;
    return false;
  }
  function wantsAdmit() {
    try {
      var q = new URLSearchParams(g.location.search || "");
      if (q.get("admit") === "1" || q.get("admission") === "1") return true;
      if (q.get("go") === "admit") return true;
    } catch (e) {}
    return false;
  }
  function autoPref() {
    try {
      return localStorage.getItem(PREF_KEY) === "1";
    } catch (e) {
      return false;
    }
  }
  function setAutoPref(on) {
    try {
      localStorage.setItem(PREF_KEY, on ? "1" : "0");
    } catch (e) {}
  }

  function pathIsLanding() {
    var p = (g.location.pathname || "/").replace(/\/+$/, "") || "/";
    return (
      p === "/campus" ||
      p === "/charter" ||
      p === "/university" ||
      p === "/uni"
    );
  }

  function ensureBanner() {
    if (document.getElementById("cu-returner-banner")) return;
    var name = readName() || "seeker";
    var bar = document.createElement("div");
    bar.id = "cu-returner-banner";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Returning student");
    bar.innerHTML =
      '<div class="cu-returner-inner">' +
      "<p><strong>Welcome back</strong> · " +
      String(name).replace(/</g, "") +
      "</p>" +
      '<div class="cu-returner-actions">' +
      '<a class="cu-returner-primary" href="' +
      PORTAL +
      '">Enter student portal →</a>' +
      '<button type="button" class="cu-returner-ghost" id="cu-returner-stay">Stay on admission</button>' +
      '<label class="cu-returner-check"><input type="checkbox" id="cu-returner-auto"/> Always open portal when I return</label>' +
      "</div></div>";
    var host = document.querySelector("main") || document.body;
    host.insertBefore(bar, host.firstChild);

    var style = document.createElement("style");
    style.textContent =
      "#cu-returner-banner{margin:0.75rem auto 1rem;max-width:40rem;padding:1rem 1.1rem;border-radius:18px;" +
      "border:1px solid rgba(201,168,76,0.55);background:linear-gradient(145deg,#fffefb,#f3ebdc);" +
      "box-shadow:0 1px 0 rgba(255,255,255,0.85) inset,0 8px 24px rgba(19,32,26,0.06)}" +
      "html[data-theme=dark] #cu-returner-banner{background:linear-gradient(155deg,rgba(32,48,40,.98),rgba(14,24,18,.99))}" +
      "#cu-returner-banner p{margin:0 0 0.55rem;font-size:0.92rem}" +
      ".cu-returner-actions{display:flex;flex-wrap:wrap;gap:0.4rem;align-items:center}" +
      ".cu-returner-primary{display:inline-flex;align-items:center;min-height:42px;padding:0.4rem 1rem;border-radius:999px;" +
      "background:#1e7d5e;color:#fff!important;font-weight:700;text-decoration:none;font-size:0.84rem}" +
      ".cu-returner-ghost{min-height:42px;padding:0.35rem 0.9rem;border-radius:999px;border:1px solid rgba(201,168,76,0.4);" +
      "background:transparent;color:inherit;font-weight:700;cursor:pointer;font-size:0.8rem}" +
      ".cu-returner-check{font-size:0.75rem;opacity:0.9;display:flex;gap:0.35rem;align-items:center;margin-left:0.25rem}";
    document.head.appendChild(style);

    var stay = document.getElementById("cu-returner-stay");
    if (stay) {
      stay.addEventListener("click", function () {
        bar.hidden = true;
      });
    }
    var auto = document.getElementById("cu-returner-auto");
    if (auto) {
      auto.checked = autoPref();
      auto.addEventListener("change", function () {
        setAutoPref(!!auto.checked);
      });
    }
  }

  function boot() {
    if (!pathIsLanding()) return;
    if (wantsAdmit()) return;
    if (!isReturner()) return;
    if (autoPref()) {
      try {
        g.location.replace(PORTAL);
        return;
      } catch (e) {}
    }
    ensureBanner();
    // Reveal existing campus returning card if present
    var ret = document.getElementById("adm-returning");
    if (ret) {
      ret.hidden = false;
      var n = document.getElementById("adm-returning-name");
      if (n && !n.textContent) n.textContent = readName() || "seeker";
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
